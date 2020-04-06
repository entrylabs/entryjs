/**
 * 언더바가 붙은 함수 및 변수를 외부에서 쓰지 마세요
 * @author extracold1209, wodnjs6512
 */

import { voiceApiConnect } from './audioSocket';
import toWav from 'audiobuffer-to-wav';

const STATUS_CODE = {
    CONNECTED: 'CONNECTED',
    NOT_RECOGNIZED: 'NOT_RECOGNIZED',
};

const getVoiceServerAddress = () => ({
    hostname: Entry.baseUrl,
    path: '/vc',
});

const DESIRED_SAMPLE_RATE = 16000;

class AudioUtils implements MediaUtilsInterface {
    get currentVolume() {
        return this._currentVolume;
    }
    public isRecording = false;
    public startedRecording = false;
    public isInitialized = false; // 유저 인풋 연결 확인

    private _userMediaStream: MediaStream = null;
    private _mediaRecorder: MediaRecorder = null;
    private _currentVolume = -1;
    private _isAudioSupport = false;
    private _resolveFunc: Function = null;
    private _audioContext: AudioContext = null;
    private _socketClient: SocketIOClient.Socket = null; // socket.io-client instance
    private _properStopCall: ReturnType<typeof setTimeout> = null; // setTimeout Function to handle proper stop Call

    async checkUserMicAvailable() {
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
            return true;
        } catch (err) {
            return false;
        }
    }

    async getMediaStream() {
        try {
            return await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (err) {
            // is MIC present in browser
            this.isRecording = false;
            this.stopRecord();
            throw new Entry.Utils.IncompatibleError('IncompatibleError', [
                Lang.Workspace.check_microphone_error,
            ]);
        }
    }

    incompatBrowserChecker() {
        // IE/safari CHECKER
        if (!this._isAudioSupport) {
            this._isAudioSupport = this._isBrowserSupportAudio(); // 브라우저 지원 확인
        }
        if (!this._isAudioSupport) {
            this.isRecording = false;
            this.stopRecord();
            throw new Entry.Utils.IncompatibleError();
        }
    }

    improperStop() {
        this.stopRecord();
        if (this._resolveFunc) {
            this._resolveFunc('');
        }
    }

    async startRecord(recordMilliSecond: number, language: string) {
        //getMediaStream 은 만약 stream 이 없는 경우
        await this.getMediaStream();
        return await new Promise(async (resolve, reject) => {
            this._resolveFunc = resolve;
            if (!this.isInitialized) {
                console.log('audio not initialized');
                resolve(0);
                return;
            }
            // this.isRecording = true;
            if (this._audioContext.state === 'suspended') {
                await this.initialize();
            }

            try {
                this._socketClient = await voiceApiConnect(getVoiceServerAddress(), language);
            } catch (err) {
                console.log(err);
            }

            this._stopMediaRecorder();
            this._mediaRecorder.start();
            this.startedRecording = true;
            Entry.engine.toggleAudioShadePanel();
            this._socketClient.on('message', (e: any) => {
                switch (e) {
                    case STATUS_CODE.CONNECTED:
                        break;
                    case STATUS_CODE.NOT_RECOGNIZED:
                        this.stopRecord();
                        resolve('');
                        break;
                    default:
                        const parsed = JSON.parse(e);
                        const isArray = Array.isArray(parsed);
                        if (isArray) {
                            this.stopRecord();
                            resolve(parsed[0]);
                        }
                        break;
                }
            });
            this._properStopCall = setTimeout(this.stopRecord, recordMilliSecond);
        });
    }
    _stopMediaRecorder() {
        if (this._mediaRecorder.state == 'recording' || this._mediaRecorder.state === 'paused') {
            this._mediaRecorder.stop();
        }
    }

    /**
     * 녹음을 종료한다. silent = true 인 경우 API 콜을 하지 않기 위해 리스너를 먼저 제거하고 stop 한다.
     * @param {object=} option
     * @param {boolean} [option.silent=false]
     */
    async stopRecord(option = { silent: false }) {
        if (this._socketClient) {
            this._socketClient.disconnect();
        }
        if (!this.isInitialized || !this.isRecording) {
            return;
        }
        Entry.dispatchEvent('audioRecordProcessing');
        if (this.startedRecording) {
            Entry.engine.toggleAudioProgressPanel();
        }
        this.startedRecording = false;

        if (option.silent) {
            this._mediaRecorder.onstop = () => {
                console.log('silent stop');
            };
            this._stopMediaRecorder();
        } else {
            this._stopMediaRecorder();
            this._mediaRecorder.onstop = () => {
                console.log('proper stop');
            };
        }
        this._audioContext.close();
        this._userMediaStream.getTracks().forEach((track) => {
            track.stop();
        });

        clearTimeout(this._properStopCall);
        // this.isRecording = false;
    }

    isAudioConnected() {
        if (!this._isBrowserSupportAudio() || !this.isInitialized || !this._userMediaStream) {
            return false;
        }
        const tracks = this._userMediaStream.getAudioTracks();
        return tracks && tracks.some((track) => track.readyState === 'live');
    }

    _connectNodes(...connectableNodes: AudioNode[]) {
        for (let i = 0; i < connectableNodes.length - 1; i++) {
            if (connectableNodes[i].connect) {
                connectableNodes[i].connect(connectableNodes[i + 1]);
            } else {
                throw new Error('you can not connect node');
            }
        }
    }

    _isBrowserSupportAudio() {
        if (
            !navigator.mediaDevices ||
            !navigator.mediaDevices.getUserMedia ||
            !window.MediaRecorder
        ) {
            return false;
        }
        return true;
    }

    async initialize() {
        const mediaStream = await this.compatabilityChecker();
        if (this.isInitialized) {
            return;
        }
        Entry.addEventListener('beforeStop', () => {
            this.improperStop();
        });
        try {
            if (!window.AudioContext) {
                if (window.webkitAudioContext) {
                    window.AudioContext = window.webkitAudioContext;
                }
            }
            const audioContext = new window.AudioContext();
            const streamSrc = audioContext.createMediaStreamSource(mediaStream);
            const analyserNode = audioContext.createAnalyser();
            const biquadFilter = audioContext.createBiquadFilter();
            biquadFilter.type = 'highpass';
            biquadFilter.frequency.value = 30;
            const scriptNode = audioContext.createScriptProcessor(4096, 1, 1);
            const streamDest = audioContext.createMediaStreamDestination();
            const mediaRecorder = new MediaRecorder(streamDest.stream);
            // 순서대로 노드 커넥션을 맺는다.
            this._connectNodes(streamSrc, analyserNode, biquadFilter, scriptNode, streamDest);
            scriptNode.onaudioprocess = this._handleScriptProcess(analyserNode);

            this._audioContext = audioContext;
            this._userMediaStream = mediaStream;
            this._mediaRecorder = mediaRecorder;
            this.isInitialized = true;

            // 음성 인식 api 를 사용하기 위함
            // 음성 인식은 websocket 을 통해서 WAV로 전송하게 되어있음.
            // 첫번째 파라미터는 프로토콜을 제외한 hostname+port 조합
            // ex)'localhost:4001'
            return true;
        } catch (e) {
            console.error('error occurred while init audio input', e);
            this.isInitialized = false;
            return false;
        }
    }
    reset(): void {
        throw new Error('Method not implemented.');
    }
    destroy(): void {
        this._audioContext.close();
        this._userMediaStream.getTracks().forEach((track) => {
            track.stop();
        });
    }
    async compatabilityChecker(): Promise<MediaStream> {
        this.incompatBrowserChecker();
        const mediaStream = await this.getMediaStream();
        return mediaStream;
    }

    _handleScriptProcess = (analyserNode: AnalyserNode) => (audioProcessingEvent: {
        inputBuffer: AudioBuffer;
        outputBuffer: AudioBuffer;
    }) => {
        const array = new Uint8Array(analyserNode.frequencyBinCount);
        analyserNode.getByteFrequencyData(array);

        // 현재 input 의 볼륨세기
        this._currentVolume = array.reduce((total, data) => total + data, 0) / array.length;

        // 볼륨 변형 없이 그대로 통과
        const { inputBuffer, outputBuffer } = audioProcessingEvent;
        for (let channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
            const inputData = inputBuffer.getChannelData(channel);
            const outputData = outputBuffer.getChannelData(channel);
            for (let sample = 0; sample < inputBuffer.length; sample++) {
                outputData[sample] = inputData[sample];
            }
        }
        if (!this.isRecording) {
            return;
        }

        ///// RESAMPLE
        // offline context 로 44100hz 에서 16000hz로 resample
        const offlineCtx = new OfflineAudioContext(
            outputBuffer.numberOfChannels,
            outputBuffer.duration * DESIRED_SAMPLE_RATE,
            DESIRED_SAMPLE_RATE
        );
        const cloneBuffer = offlineCtx.createBuffer(
            outputBuffer.numberOfChannels,
            outputBuffer.length,
            outputBuffer.sampleRate
        );
        // Copy the source data into the offline AudioBuffer
        for (let channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
            cloneBuffer.copyToChannel(outputBuffer.getChannelData(channel), channel);
        }
        // Play it from the beginning.
        const source = offlineCtx.createBufferSource();
        source.buffer = cloneBuffer;
        source.connect(offlineCtx.destination);
        offlineCtx.oncomplete = (e) => {
            if (!this.isRecording) {
                return;
            }
            // socket.io로 서버 전송
            if (this._socketClient) {
                this._socketClient.send(toWav(e.renderedBuffer));
            }
        };
        offlineCtx.startRendering();
        source.start(0);
    };
}

//Entry 네임스페이스에는 존재하지 않으므로 외부에서 사용할 수 없다.
export default new AudioUtils();
