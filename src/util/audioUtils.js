/**
 * 언더바가 붙은 함수 및 변수를 외부에서 쓰지 마세요
 * @author extracold1209
 */
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
            const audioContext = new AudioContext();
            const streamSrc = audioContext.createMediaStreamSource(mediaStream);
            const analyserNode = audioContext.createAnalyser();
            const scriptNode = audioContext.createScriptProcessor(2048, 1, 1);
            const streamDest = audioContext.createMediaStreamDestination();
            const mediaRecorder = new MediaRecorder(streamDest.stream);

            // 순서대로 노드 커넥션을 맺는다.
            this._connectNodes(streamSrc, analyserNode, scriptNode, streamDest);
            scriptNode.onaudioprocess = this._handleScriptProcess(analyserNode);

            this._userMediaStream = mediaStream;
            this._mediaRecorder = mediaRecorder;
            this.isAudioInitComplete = true;
            return true;
        } catch (e) {
            console.error('error occurred while init audio input', e);
            this.isAudioInitComplete = false;
            return false;
        }
    }

    startRecord(recordMilliSecond = 3000) {
        return new Promise((resolve) => {
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
            this._audioChunks = [];
            this.isRecording = true;

            this._mediaRecorder.addEventListener('dataavailable', this._handleRecorderOnData);
            this._mediaRecorder.addEventListener('stop', this._handleRecorderOnStop);

            this._mediaRecorder.start();

            setTimeout(() => {
                this.stopRecord();
                resolve();
            }, recordMilliSecond);
        });
    }

    stopRecord() {
        if (!this.isAudioInitComplete || !this.isRecording) {
            return;
        }

        this.isRecording = false;
        this._mediaRecorder.stop();
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

    _handleRecorderOnData = (event) => {
        this._audioChunks.push(event.data);
    };

    _handleRecorderOnStop = (event) => {
        this._mediaRecorder.removeEventListener('dataavailable', this._handleRecorderOnData);
        this._mediaRecorder.removeEventListener('stop', this._handleRecorderOnStop);

        const blob = new Blob(this._audioChunks, { type: 'audio/wav' });
        console.log(URL.createObjectURL(blob));
    };

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
    };
}

// 해당 클래스는 프로젝트 내 싱글인스턴스로 존재한다. Entry 네임스페이스에는 존재하지 않으므로 외부에서 사용할 수 없다.
window.audio = new AudioUtils();
export default window.audio;
