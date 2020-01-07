/**
 * 언더바가 붙은 함수 및 변수를 외부에서 쓰지 마세요
 * @author extracold1209, wodnjs6512
 */

const { voiceApiConnect } = require('./websocket');
var toWav = require('audiobuffer-to-wav');

const STATUS_CODE = {
    CONNECTED: 'CONNECTED',
    NOT_RECOGNIZED: 'NOT_RECOGNIZED',
};

const VOICE_SERVER_ADDR = {
    host: window.location.hostname,
    port: 4001,
};

class AudioUtils {
    get currentVolume() {
        return this._currentVolume;
    }

    constructor() {
        this.isAudioSupport = this._isBrowserSupportAudio(); // 브라우저 지원 확인
        this.isAudioInitComplete = false; // 유저 인풋 연결 확인
        this.isRecording = false;
        this._userMediaStream = undefined;
        this._mediaRecorder = undefined;
        this._currentVolume = -1;
        this._audioChunks = [];
        this.result = null;
    }

    async checkUserMicAvailable() {
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
            return true;
        } catch (err) {
            return false;
        }
    }

    async initUserMedia() {
        if (!this.isAudioSupport) {
            console.error('this browser not support input media');
            return false;
        }

        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });
            const audioContext = new AudioContext({ sampleRate: 16000 });
            const streamSrc = audioContext.createMediaStreamSource(mediaStream);
            const analyserNode = audioContext.createAnalyser();
            const biquadFilter = audioContext.createBiquadFilter();
            biquadFilter.type = 'highpass';
            biquadFilter.frequency.value = 60;
            const scriptNode = audioContext.createScriptProcessor(4096, 1, 1);
            const streamDest = audioContext.createMediaStreamDestination();
            const mediaRecorder = new MediaRecorder(streamDest.stream);
            // 순서대로 노드 커넥션을 맺는다.
            this._connectNodes(streamSrc, analyserNode, biquadFilter, scriptNode, streamDest);
            scriptNode.onaudioprocess = this._handleScriptProcess(analyserNode);

            this._audioContext = audioContext;
            this._userMediaStream = mediaStream;
            this._mediaRecorder = mediaRecorder;
            this.isAudioInitComplete = true;

            // 음성 인식 api 를 사용하기 위함
            // 음성 인식은 websocket 을 통해서 WAV로 전송하게 되어있음.
            // 첫번째 파라미터는 프로토콜을 제외한 hostname+port 조합
            // ex)'localhost:4001'
            return true;
        } catch (e) {
            console.error('error occurred while init audio input', e);
            this.isAudioInitComplete = false;
            return false;
        }
    }

    startRecord(recordMilliSecond) {
        return new Promise(async (resolve, reject) => {
            if (!this.isAudioInitComplete) {
                console.log('audio not initialized');
                resolve();
                return;
            }
            this.isRecording = true;
            console.log('start record');
            // this.isRecording = true;
            if (this._audioContext.state === 'suspended') {
                await this.initUserMedia();
            }
            const socketClient = await voiceApiConnect(VOICE_SERVER_ADDR, (data) => {
                this.result = data;
            });
            this._socketClient = socketClient;

            this._audioChunks = [];

            this._mediaRecorder.start();
            Entry.dispatchEvent('audioRecording');
            this._socketClient.on('message', (e) => {
                switch (e) {
                    case STATUS_CODE.CONNECTED:
                        console.log('Received String: ', e.data, ' ');
                        break;
                    case STATUS_CODE.NOT_RECOGNIZED:
                        this._socketClient.disconnect();
                        this.stopRecord();
                        Entry.container.setSttValue();
                        resolve('');
                        break;
                    default:
                        const parsed = JSON.parse(e);
                        const isArray = Array.isArray(parsed);
                        if (isArray) {
                            this._socketClient.disconnect();
                            this.stopRecord();
                            Entry.container.setSttValue(parsed[0]);
                            resolve(parsed[0]);
                        } else if (typeof e === 'string') {
                            console.log('Received String: ', e, ' ');
                        } else {
                            console.log('Received : ', e, ' ');
                        }
                        break;
                }
            });
            this._properStopCall = setTimeout(this.stopRecord, recordMilliSecond);
            this._noInputStopCall = setTimeout(() => {
                this.stopRecord();
                clearTimeout(this._properStopCall);
            }, 3000);
        });
    }

    _stopMediaRecorder() {
        if (this._mediaRecorder.state == 'recording') {
            this._mediaRecorder.stop();
        }
    }
    /**
     * 녹음을 종료한다. silent = true 인 경우 API 콜을 하지 않기 위해 리스너를 먼저 제거하고 stop 한다.
     * @param {object=} option
     * @param {boolean} [option.silent=false]
     */
    async stopRecord(option = { silent: false }) {
        if (!this.isAudioInitComplete || !this.isRecording) {
            return;
        }
        Entry.dispatchEvent('audioRecordingDone');
        console.log('stopCalled');
        this.isRecording = false;

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
        this._audioContext.suspend();
        this._userMediaStream.getTracks().forEach((track) => {
            track.stop();
        });
        clearTimeout(this._properStopCall);
        clearTimeout(this._noInputStopCall);
    }

    isAudioConnected() {
        if (!this._isBrowserSupportAudio() || !this.isAudioInitComplete || !this._userMediaStream) {
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
        return navigator.mediaDevices && navigator.mediaDevices.getUserMedia && MediaRecorder;
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
        // console.log(this._currentVolume);
        if (this.isRecording) {
            if (this._currentVolume > 60) {
                clearTimeout(this._noInputStopCall);
            }
            // websocket 으로 서버 전송
            const client = this._socketClient;

            if (client.readyState === client.OPEN) {
                client.send(toWav(outputBuffer));
            }
        }
    };
}

// 해당 클래스는 프로젝트 내 싱글인스턴스로 존재한다. Entry 네임스페이스에는 존재하지 않으므로 외부에서 사용할 수 없다.
export default new AudioUtils();
