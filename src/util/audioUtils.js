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

    /**
     * 웹 오디오 노드 스트림을 정의한다.
     * 각 스트림은 아래와 같은 역할을 한다.
     * 추가로, 한번 init 되면 스트림은 계속 흐르는 구조이다.
     * 그러므로 currentVolume 값은 실시간으로 변경된다.
     *
     * - MediaStreamSource : 오디오 인풋 데이터를 컨트롤 가능한 컨텍스트에 넣기 위한 시점
     * - GainNode : 전체 볼륨 세기 조정
     * - AnalyserNode : 현재 버퍼에서 진폭등의 값을 읽어와 표현 가능한 수치로 제공
     * - ScriptProcessorNode: (deprecated) input - output 사이에서 데이터를 가져와 다양한 로직 추가가능
     *   여기서는 analyse 된 음세기의 평균값을 도출한 후 그대로 버퍼를 다음으로 전달
     * @returns {Promise<boolean>}
     */
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
            const scriptNode = audioContext.createScriptProcessor(2048, 1, 1);
            const streamDest = audioContext.createMediaStreamDestination();
            const mediaRecorder = new MediaRecorder(streamDest.stream);
            // 순서대로 노드 커넥션을 맺는다.
            this._connectNodes(streamSrc, analyserNode, scriptNode, streamDest);
            scriptNode.onaudioprocess = this._handleScriptProcess(analyserNode);

            this._audioContext = audioContext;
            this._userMediaStream = mediaStream;
            this._mediaRecorder = mediaRecorder;
            this.isAudioInitComplete = true;

            // 음성 인식 api 를 사용하기 위함
            // 음성 인식은 websocket 을 통해서 WAV로 전송하게 되어있음.
            // 첫번째 파라미터는 프로토콜을 제외한 hostname+port 조합
            // ex)'localhost:4001'
            const socketClient = await voiceApiConnect(null, (data) => {
                this.result = data;
            });
            this._socketClient = socketClient;
            return true;
        } catch (e) {
            console.error('error occurred while init audio input', e);
            this.isAudioInitComplete = false;
            return false;
        }
    }

    startRecord(recordMilliSecond = 3000) {
        return new Promise(async (resolve) => {
            if (!this.isAudioInitComplete) {
                console.error('audio not initialized');
                resolve();
                return;
            }
            if (this.isRecording) {
                console.error('audio is already recording');
                resolve();
                return;
            }
            if (this._audioContext.state === 'suspended') {
                await this.initUserMedia();
            }
            this._audioChunks = [];
            this.isRecording = true;

            this._mediaRecorder.start();

            this._socketClient.onmessage = (e) => {
                switch (e.data) {
                    case STATUS_CODE.CONNECTED:
                        console.log('Received String: ', e.data, ' ');
                        break;
                    case STATUS_CODE.NOT_RECOGNIZED:
                        this._socketClient.close();
                        resolve('');
                        break;
                    default:
                        const parsed = JSON.parse(e.data);
                        const isArray = Array.isArray(parsed);
                        if (isArray) {
                            this._socketClient.close();
                            resolve(parsed[0]);
                        } else if (typeof e.data === 'string') {
                            console.log('Received String: ', e.data, ' ');
                        } else {
                            console.log('Received : ', e.data, ' ');
                        }
                        break;
                }
            };
            setTimeout(() => {
                this.stopRecord();
            }, recordMilliSecond);
        });
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

        this.isRecording = false;

        if (option.silent) {
            this._mediaRecorder.onstop = () => {
                console.log('silent stop');
            };
            this._mediaRecorder.stop();
        } else {
            this._mediaRecorder.stop();
            this._mediaRecorder.onstop = () => {
                console.log('proper stop');
            };
        }
        this._audioContext.suspend();
        this._userMediaStream.getTracks().forEach((track) => {
            track.stop();
        });
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
        // websocket 으로 서버 전송
        const client = this._socketClient;

        if (client.readyState === client.OPEN) {
            client.send(toWav(outputBuffer));
        }
    };
}

// 해당 클래스는 프로젝트 내 싱글인스턴스로 존재한다. Entry 네임스페이스에는 존재하지 않으므로 외부에서 사용할 수 없다.
window.audio = new AudioUtils();
export default window.audio;
