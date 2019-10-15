class AudioUtils {
    constructor() {
        this.isAudioSupport = this._isBrowserSupportAudio(); // 브라우저 지원 확인
        this.isAudioInitComplete = false; // 유저 인풋 연결 확인
        this.isRecording = false;

        this._userMediaStream = undefined;
        this._mediaRecorder = undefined;
        this._gainNode = undefined;
        this._audioChunks = [];
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
            const audioContext = new AudioContext();
            const streamSrc = audioContext.createMediaStreamSource(mediaStream);
            const gainNode = audioContext.createGain();
            const streamDest = audioContext.createMediaStreamDestination();
            const mediaRecorder = new MediaRecorder(streamDest.stream);

            streamSrc.connect(gainNode);
            gainNode.connect(streamDest);

            this._userMediaStream = mediaStream;
            this._gainNode = gainNode;
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
        if (!this.isAudioInitComplete) {
            console.error('audio not initialized');
            return;
        }

        this.isRecording = false;
        this._mediaRecorder.stop();
    }

    isAudioConnected() {
        const tracks = this._userMediaStream.getAudioTracks();
        return tracks && tracks.some((track) => track.enabled);
    }

    setAudioVolume(volume) {

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
}

// 해당 클래스는 프로젝트 내 싱글인스턴스로 존재한다. Entry 네임스페이스에는 존재하지 않으므로 외부에서 사용할 수 없다.
window.audio = new AudioUtils();
export default window.audio;
