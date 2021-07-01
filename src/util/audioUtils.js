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
        // this.noiseRectifier = new this._getNoiseRectifier();
    }

    async getMediaStream() {
        try {
            return await navigator.mediaDevices.getUserMedia({
                audio: {
                    autoGainControl: false,
                    noiseSuppression: false,
                    echoCancellation: false,
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

    // reducerModuleRegister() {
    //     window.audio = {};
    //     const audio = window.audio;

    //     // An 8-band parametric EQ type for convenient application of filters
    //     audio.ParametricEQ = function() {
    //         const _this = this;
    //         // Create a pre-gain as the input
    //         _this.input = audio.context.createGain();
    //         // Create the bands; all are initially peaking filters
    //         _this.bands = [];
    //         for (let i = 0; i < 8; i++) {
    //             const filter = audio.context.createBiquadFilter();
    //             filter.type = 'peaking';
    //             filter.frequency.value = 64 * Math.pow(2, i) + 100;
    //             filter.Q.value = 1;
    //             _this.bands.push(filter);
    //             // Connect consecutive bands
    //             if (i > 0) {
    //                 _this.bands[i - 1].connect(_this.bands[i]);
    //             }
    //         }
    //         // Connect the input to band 0, and set band 7 as output
    //         _this.input.connect(_this.bands[0]);
    //         _this.output = _this.bands[7];

    //         // Sets all band frequencies at once; freqs is a list
    //         _this.setBandFrequencies = function(freqs) {
    //             const min = Math.min(_this.bands.length, freqs.length);
    //             for (let i = 0; i < min; i++) {
    //                 _this.bands[i].frequency.value = freqs[i];
    //             }
    //         };

    //         // Sets all band types at once; types is a list
    //         _this.setBandTypes = function(types) {
    //             const min = Math.min(_this.bands.length, types.length);
    //             for (let i = 0; i < min; i++) {
    //                 _this.bands[i].type = types[i];
    //             }
    //         };

    //         // Sets all Q values at once; Qs is a list
    //         _this.setQValues = function(Qs) {
    //             const min = Math.min(_this.bands.length, Qs.length);
    //             for (let i = 0; i < min; i++) {
    //                 _this.bands[i].Q.value = Qs[i];
    //             }
    //         };

    //         // Sets all gain values at once; gains is a list
    //         _this.setBandGains = function(gains) {
    //             const min = Math.min(_this.bands.length, gains.length);
    //             for (let i = 0; i < min; i++) {
    //                 _this.bands[i].gain.value = gains[i];
    //             }
    //         };
    //     };

    //     // A meter to measure the overall loudness of the audio
    //     audio.Meter = function() {
    //         const _this = this;
    //         // Create an analyser as the input
    //         _this.node = audio.context.createAnalyser();
    //         _this.node.fftSize = 2048;

    //         // Measurement variables to store the average level & deviation
    //         let _averageLevel = 0;
    //         let _averageDeviation = 0;
    //         let _counter = 0;

    //         // Measures and returns the current loudness, the average loudness, the current deviation,
    //         // and the average deviation
    //         _this.measure = function() {
    //             // Read the frequency domain data into an array
    //             const freqData = new Uint8Array(_this.node.frequencyBinCount);
    //             _this.node.getByteFrequencyData(freqData);
    //             // Calculate the average level of the signal over all frequencies
    //             const total = freqData.reduce(
    //                 (accumulator, currentValue) => accumulator + parseFloat(currentValue)
    //             );
    //             const level = total / freqData.length;
    //             // Find the time-average of the level and deviation
    //             _averageLevel = (_averageLevel * _counter + level) / (_counter + 1);
    //             const deviation = Math.abs(level - _averageLevel);
    //             _averageDeviation = (_averageDeviation * _counter + deviation) / (_counter + 1);
    //             _counter++;
    //             return {
    //                 level,
    //                 averageLevel: _averageLevel,
    //                 deviation,
    //                 averageDeviation: _averageDeviation,
    //             };
    //         };

    //         // Resets the averages
    //         _this.reset = function() {
    //             _averageLevel = 0;
    //             _averageDeviation = 0;
    //             _counter = 0;
    //         };
    //     };

    //     // A noise gate to manage levels
    //     // Eliminates sound below the threshold and amplifies sound above it
    //     audio.NoiseGate = function(threshold, target) {
    //         const _this = this;
    //         // Set the threshold and target levels
    //         _this.threshold = threshold;
    //         _this.target = target;
    //         // Create a level meter
    //         const _meter = new audio.Meter();
    //         // Set the input of the gate to be the meter node
    //         _this.input = _meter.node;
    //         // Create a gain as the output
    //         _this.output = audio.context.createGain();
    //         // Connect the meter node to the output
    //         _meter.node.connect(_this.output);

    //         // Controls the gain
    //         const _controlGain = function() {
    //             const level = _meter.measure().level;
    //             if (level < _this.threshold) {
    //                 _this.output.gain.value = 0.1;
    //             } else {
    //                 _this.output.gain.value = _this.target / level;
    //             }
    //         };

    //         // Set up the interval at which to control the gain
    //         let _interval = setInterval(_controlGain, 10);
    //         // An internal boolean to store whether the module is bypassed or not
    //         let _bypassed = false;
    //         // Determines whether the module is active or not - argument is a boolean
    //         _this.bypass = function(doBypass) {
    //             if (doBypass && !_bypassed) {
    //                 clearInterval(_interval);
    //                 _bypassed = true;
    //             } else if (!doBypass && _bypassed) {
    //                 _interval = setInterval(_controlGain, 10);
    //                 _meter.reset();
    //                 _bypassed = false;
    //             }
    //         };
    //     };

    //     // A noise reduction module (combines a parametric EQ and a noise gate)
    //     // Default threshold is 1, default target is 10
    //     audio.NoiseReducer = function(threshold = 1, target = 10) {
    //         const _this = this;
    //         // Create a noise gate to process the sound first
    //         _this.gate = new audio.NoiseGate(threshold, target);
    //         // Create and configure the parametric EQ
    //         _this.eq = new audio.ParametricEQ();
    //         _this.eq.setBandFrequencies([164, 200, 191, 677, 1014, 2858, 6240, 10000]);
    //         _this.eq.setBandTypes([
    //             'highpass',
    //             'peaking',
    //             'notch',
    //             'notch',
    //             'notch',
    //             'notch',
    //             'lowpass',
    //             'peaking',
    //         ]);
    //         // _this.eq.setBandGains([-2, 2, 1, 1, 1, 1, 1, 1]);
    //         // Create a post-gain node
    //         const _gain = audio.context.createGain();
    //         // Connect the components: EQ -> noise gate -> gain
    //         _this.eq.output.connect(_this.gate.input);
    //         _this.gate.output.connect(_gain);
    //         // Set the input of this module to be the EQ input
    //         _this.input = _this.eq.input;
    //         // Set the output of this module to be the gain
    //         _this.output = _gain;

    //         // An internal boolean to store whether the module is bypassed or not
    //         let _bypassed = false;
    //         // Determines whether the module is active or not - argument is a boolean
    //         _this.bypass = function(isBypassed) {
    //             if (isBypassed && !_bypassed) {
    //                 _this.input.disconnect(0);
    //                 _this.input.connect(_this.output);
    //                 _bypassed = true;
    //             } else if (!isBypassed && _bypassed) {
    //                 _this.input.disconnect(0);
    //                 _this.input.connect(_this.eq.bands[0]);
    //                 _bypassed = false;
    //             }
    //         };
    //     };
    // }

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
            // this.reducerModuleRegister();

            const inputList = await navigator.mediaDevices.enumerateDevices();
            this.audioInputList = inputList
                .filter((input) => input.kind === 'audioinput')
                .map((item) => [item.label, item.deviceId]);

            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            const audioContext = new window.AudioContext();
            // window.audio.context = audioContext;

            const streamSrc = audioContext.createMediaStreamSource(mediaStream);
            const analyserNode = audioContext.createAnalyser();
            // const reducerNode = new window.audio.NoiseReducer(0.5, 5);
            const gainNode = audioContext.createGain();
            const highpassFilter = audioContext.createBiquadFilter();
            highpassFilter.type = 'highpass';
            highpassFilter.frequency.value = 200;
            highpassFilter.Q.value = 6;
            highpassFilter.detune.value = 6;
            gainNode.gain.value = 1.8;
            analyserNode.fftSize = 4096;
            analyserNode.smoothingTimeConstant = 0.0;
            analyserNode.minDecibels = -80;
            analyserNode.maxDecibels = -60;

            const scriptNode = audioContext.createScriptProcessor(512, 1, 1);
            const streamDest = audioContext.createMediaStreamDestination();
            const mediaRecorder = new MediaRecorder(streamDest.stream);
            // mediaRecorder.onstop = async (event) => {
            //     const blob = new Blob(this._audioChunks, { type: 'audio/ogg; codecs=opus' });
            //     const audio = document.createElement('audio');
            //     audio.style = { width: 100, height: 100 };
            //     audio.src = await window.URL.createObjectURL(blob);

            //     audio.controls = true;

            //     audio.oncanplay = () => {
            //         document.body.prepend(audio);
            //     };
            //     this._audioChunks = [];
            // };
            // mediaRecorder.ondataavailable = (event) => {
            //     if (!this._audioChunks) {
            //         this._audioChunks = [];
            //     }
            //     this._audioChunks.push(event.data);
            // };
            // 순서대로 노드 커넥션을 맺는다.
            this._connectNodes(
                streamSrc,
                highpassFilter,
                gainNode,
                // reducerNode,
                analyserNode,
                scriptNode,
                streamDest
            );
            scriptNode.onaudioprocess = this._handleScriptProcess(analyserNode);

            this._audioContext = audioContext;
            this._userMediaStream = mediaStream;
            this._mediaRecorder = mediaRecorder;
            this._analyserNode = analyserNode;

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

    // setupAnalyzer() {
    //     const analyserPanel = document.createElement('canvas');
    //     analyserPanel.id = 'analyserPanel';
    //     document.body.prepend(analyserPanel);
    //     this._analyserPanel = analyserPanel;
    //     const WIDTH = 1200;
    //     const HEIGHT = 400;
    //     analyserPanel.width = WIDTH;
    //     analyserPanel.height = HEIGHT;
    // }

    async startRecord(recordMilliSecond, language) {
        //getMediaStream 은 만약 stream 이 없는 경우
        this._audioChunks = [];
        await this.getMediaStream();
        // this.setupAnalyzer();
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
        this._analyserPanel = null;
        Entry.dispatchEvent('audioRecordProcessing');
        if (this.startedRecording) {
            Entry.engine.toggleAudioProgressPanel();
        }
        this.startedRecording = false;

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
            const pre =
                connectableNodes[i].output || connectableNodes[i].node || connectableNodes[i];
            const post =
                connectableNodes[i + 1].input ||
                connectableNodes[i + 1].node ||
                connectableNodes[i + 1];
            pre.connect(post);
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

    // alpha value = noise 기준치, betaValue = weight
    // _getNoiseRectifier(alphaValue, betaValue) {
    //     const _this = this;
    //     _this.alpha = alphaValue;
    //     if (_this.alpha === undefined) {
    //         _this.alpha = 1.8;
    //     }
    //     _this.beta = betaValue;
    //     if (_this.beta === undefined) {
    //         _this.beta = 0.03;
    //     }
    //     _this.noise;
    //     _this.noiseSum = 0;
    //     const sumFunction = (a, b) => a + b;

    //     _this.getNoise = (input) => {
    //         if (_this.noiseSum == 0) {
    //             _this.noise = input;
    //             _this.noiseSum = _this.noise.reduce(sumFunction, 0);
    //             return _this.noise;
    //         }
    //         const inputSum = input.reduce(sumFunction, 0);
    //         const xnr = inputSum / _this.noiseSum;
    //         if (xnr > _this.alpha) {
    //             return _this.noise;
    //         }
    //         const oneMinusBetaFactor = 1 - _this.beta;
    //         for (let i = 0; i < input.length; i++) {
    //             _this.noise[i] = oneMinusBetaFactor * _this.noise[i] + _this.beta * input[i];
    //         }
    //         _this.noiseSum = oneMinusBetaFactor * inputSum + _this.beta * _this.noiseSum;
    //         return _this.noise;
    //     };
    // }
    drawByFrequency = (dataArray, bufferLength) => () => {
        if (this._analyserPanel) {
            const canvasCtx = this._analyserPanel.getContext('2d');
            const WIDTH = 1200;
            const HEIGHT = 400;
            const rect = this._analyserPanel.getBoundingClientRect();
            canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
            canvasCtx.fillStyle = 'rgba(0,0,0,0.5)';
            canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
            canvasCtx.fillStyle = '#42ca5b';
            const barWidth = WIDTH / bufferLength;
            for (let i = 0; i < bufferLength; i++) {
                const barHeight = (HEIGHT * dataArray[i]) / 256;
                canvasCtx.fillRect(i * barWidth, rect.height - barHeight, barWidth, barHeight);
            }
        }
    };

    _handleScriptProcess = (analyserNode) => (audioProcessingEvent) => {
        const bufferLength = analyserNode.frequencyBinCount;
        const array = new Uint8Array(bufferLength);
        analyserNode.getByteFrequencyData(array);
        // requestAnimationFrame(this.drawByFrequency(array, bufferLength));

        // 현재 input 의 볼륨세기
        this._currentVolume = array.reduce((total, data) => total + data, 0) / array.length;

        // input -> output연결 데이터 커스텀 mod

        if (!this.isRecording) {
            // const panel = document.querySelector('#analyserPanel');
            // panel?.remove();
            return;
        }
        const { inputBuffer, outputBuffer } = audioProcessingEvent;
        for (let channel = 0; channel < inputBuffer.numberOfChannels; channel++) {
            const inputData = inputBuffer.getChannelData(channel);
            const outputData = outputBuffer.getChannelData(channel);
            for (let sample = 0; sample < inputBuffer.length; sample++) {
                outputData[sample] = inputData[sample];
            }
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
