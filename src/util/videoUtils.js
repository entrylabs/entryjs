const VIDEO_WIDTH = 640;
const VIDEO_HEIGHT = 360;
import { GEHelper } from '../graphicEngine/GEHelper';
class VideoUtils {
    constructor() {
        // 기본적으로 hFlip을 한번 해야 거울과 같이 동작하므로 horizontal flip 인지 아닌지를 확인한다.
        this.isInitialized = false;
        this.video = null;
        this.canvasVideo = null;
        this.flipStatus = {
            horizontal: false,
            vertical: false,
        };
    }

    reset() {
        this.turnOffWebcam();
        this.canvasVideo = null;
        this.flipStatus = {
            horizontal: false,
            vertical: false,
        };
    }

    async initialize() {
        if (this.isInitialized) {
            return;
        }
        navigator.getUserMedia =
            navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        if (navigator.getUserMedia) {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                    facingMode: 'user',
                    width: VIDEO_WIDTH,
                    height: VIDEO_HEIGHT,
                },
            });
            this.video = document.createElement('video');
            this.video.srcObject = stream;
            this.video.width = 480;
            this.video.height = 270;
            this.video.onloadedmetadata = async (e) => {
                // const mobilenet = await posenet.load({
                //     architecture: 'MobileNetV1',
                //     outputStride: 16,
                //     inputResolution: { width: VIDEO_WIDTH, height: VIDEO_HEIGHT },
                //     multiplier: 1,
                // });
                // setNet(mobilenet);
                // const posenetInstance = await posenet.load();
                // setNet(posenetInstance);
                this.initialized = true;
                this.video.play();
                console.log('done initializing');
                // getPose();
            };
        } else {
            console.log('getUserMedia not supported');
        }
    }

    async checkUserCamAvailable() {
        try {
            await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            return true;
        } catch (err) {
            return false;
        }
    }
    // camera power
    cameraSwitch(value) {
        switch (value) {
            case 'on':
                this.turnOnWebcam();
                this.setOptions('hflip');
                break;
            default:
                this.turnOffWebcam();
                break;
        }
    }

    turnOffWebcam() {
        Entry.stage.canvas.removeChild(this.canvasVideo);
        createjs.Ticker.on('tick', Entry.stage.canvas);
    }

    turnOnWebcam() {
        if (this.canvasVideo) {
            return;
        }
        this.canvasVideo = GEHelper.getVideoElement(this.video);
        Entry.addEventListener('dispatchEventDidToggleStop', this.reset.bind(this));
    }
    // option change
    setOptions(target, value) {
        switch (target) {
            case 'brightness':
                this.setBrightness(value);
                createjs.Ticker.on('tick', Entry.stage.canvas);
                break;
            case 'opacity':
                this.setAlpha(value);
                break;
            case 'hflip':
                this.flipStatus.horizontal = !this.flipStatus.horizontal;
                GEHelper.hFlipVideoElement(this.canvasVideo);
                break;
            case 'vflip':
                this.flipStatus.vertical = !this.flipStatus.vertical;
                GEHelper.vFlipVideoElement(this.canvasVideo);
                break;
        }
    }
    setBrightness(brightVal) {
        GEHelper.setVideoBrightness(this.canvasVideo, brightVal);
        createjs.Ticker.on('tick', Entry.stage.canvas);
    }
    setAlpha(alphaVal) {
        this.canvasVideo.alpha = (100 - alphaVal) / 100;
        createjs.Ticker.on('tick', Entry.stage.canvas);
    }
}

//Entry 네임스페이스에는 존재하지 않으므로 외부에서 사용할 수 없다.
export default new VideoUtils();
