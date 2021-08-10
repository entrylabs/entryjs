/**
 * 언더바가 붙은 함수 및 변수를 외부에서 쓰지 마세요
 * @author extracold1209, wodnjs6512
 */

const { voiceApiConnect } = require('./audioSocket');
const toWav = require('audiobuffer-to-wav');

const STATUS_CODE = {
    CONNECTED: 'CONNECTED',
    NOT_RECOGNIZED: 'NOT_RECOGNIZED',
};

const getVoiceServerAddress = () => ({
    hostname: Entry.baseUrl,
    path: '/vc',
});

const DESIRED_SAMPLE_RATE = 16000;

class AudioUtils {
    get currentVolume() {
        return this._currentVolume;
    }

    constructor() {
        this.isInitialized = false; // 유저 인풋 연결 확인
        this.isRecording = false;
        this._userMediaStream = undefined;
        this._mediaRecorder = undefined;
        this._currentVolume = -1;
        this._audioChunks = [];
        this.result = null;
        this.startedRecording = false;
        this.audioInputList = [];
    }

    async getMediaStream() {
        try {
            return await navigator.mediaDevices.getUserMedia({
                audio: {
                    autoGainControl: true,
                    noiseSuppression: true,
                    echoCancellation: true,
                },
            });
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
        if (!this.isAudioSupport) {
            this.isAudioSupport = this._isBrowserSupportAudio(); // 브라우저 지원 확인
        }
        if (!this.isAudioSupport) {
            this.isRecording = false;
            this.stopRecord();
            throw new Entry.Utils.IncompatibleError();
        }
    }

    async initialize() {
        if (this.isInitialized) {
            return;
        }
        this.incompatBrowserChecker();
        const mediaStream = await this.getMediaStream();
        try {
            Entry.addEventListener('beforeStop', () => {
                this.improperStop();
            });

            const inputList = await navigator.mediaDevices.enumerateDevices();
            this.audioInputList = inputList
                .filter((input) => input.kind === 'audioinput')
                .map((item) => [item.label, item.deviceId]);

            if (!window.AudioContext) {
                if (window.webkitAudioContext) {
                    window.AudioContext = window.webkitAudioContext;
                }
            }
            const audioContext = new window.AudioContext();
            const streamSrc = audioContext.createMediaStreamSource(mediaStream);
            const analyserNode = audioContext.createAnalyser();
            // const reducerNode = new window.audio.NoiseReducer(0.5, 5);
            const gainNode = audioContext.createGain();
            gainNode.gain.value = 1.8;

            const highpassFilter = audioContext.createBiquadFilter();
            highpassFilter.type = 'highpass';
            highpassFilter.frequency.value = 150;
            highpassFilter.Q.value = 1;
            highpassFilter.detune.value = 1;

            analyserNode.fftSize = 4096;
            analyserNode.smoothingTimeConstant = 0.0;
            analyserNode.minDecibels = -80;
            analyserNode.maxDecibels = -40;

            const scriptNode = audioContext.createScriptProcessor(512, 1, 1);
            const streamDest = audioContext.createMediaStreamDestination();
            const mediaRecorder = new MediaRecorder(streamDest.stream);
            mediaRecorder.onstop = async (event) => {
                const blob = new Blob(this._audioChunks, { type: 'audio/ogg; codecs=opus' });
                const audio = document.createElement('audio');
                audio.style = { width: 100, height: 100 };
                audio.src = await window.URL.createObjectURL(blob);

                audio.controls = true;

                audio.oncanplay = () => {
                    document.body.prepend(audio);
                };
                this._audioChunks = [];
            };
            mediaRecorder.ondataavailable = (event) => {
                if (!this._audioChunks) {
                    this._audioChunks = [];
                }
                this._audioChunks.push(event.data);
            };
            // 순서대로 노드 커넥션을 맺는다.
            this._connectNodes(
                streamSrc,
                // highpassFilter,
                // gainNode,
                // highpassFilter2,
                // gainNode2,
                // reducerNode,
                analyserNode,
                scriptNode,
                streamDest
            );
            scriptNode.onaudioprocess = this._handleScriptProcess(analyserNode);

            this._audioContext = audioContext;
            this._userMediaStream = mediaStream;
            this._mediaRecorder = mediaRecorder;

            // 음성 인식 api 를 사용하기 위함
            // 음성 인식은 websocket 을 통해서 WAV로 전송하게 되어있음.
            // 첫번째 파라미터는 프로토콜을 제외한 hostname+port 조합
            // ex)'localhost:4001'
            this.isInitialized = true;
            return;
        } catch (e) {
            console.error('error occurred while init audio input', e);
            this.isInitialized = false;
            return;
        }
    }

    improperStop() {
        this.stopRecord();
        if (this.resolveFunc) {
            this.resolveFunc('');
        }
    }

    async startRecord(recordMilliSecond, language) {
        //getMediaStream 은 만약 stream 이 없는 경우
        await this.getMediaStream();
        return await new Promise(async (resolve, reject) => {
            this.resolveFunc = resolve;
            if (!this.isInitialized) {
                console.log('audio not initialized');
                resolve(0);
                return;
            }
            // this.isRecording = true;
            if (this._audioContext.state === 'suspended') {
                this.isInitialized = false;
                await this.initialize();
            }

            try {
                this._socketClient = await voiceApiConnect(
                    getVoiceServerAddress(),
                    language,
                    (data) => {
                        this.result = data;
                    }
                );
            } catch (err) {
                console.log(err);
            }

            this._audioChunks = [];

            this._stopMediaRecorder();
            this._mediaRecorder.start();
            this.startedRecording = true;
            Entry.engine.toggleAudioShadePanel();
            this._socketClient.on('message', (e) => {
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
     * 녹음을 종료한다.
     */
    async stopRecord() {
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

        this._mediaRecorder.onstop = null;

        this._stopMediaRecorder();
        this._audioContext.suspend();
        this.stream.getTracks().forEach((track) => {
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

    _connectNodes(...connectableNodes) {
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

    _handleScriptProcess = (analyserNode) => (audioProcessingEvent) => {
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
            if (this._socketClient && this._socketClient.readyState === this._socketClient.OPEN) {
                this._socketClient.send(toWav(e.renderedBuffer));
            }
        };
        offlineCtx.startRendering();
        source.start(0);
    };
}

//Entry 네임스페이스에는 존재하지 않으므로 외부에서 사용할 수 없다.
export default new AudioUtils();
