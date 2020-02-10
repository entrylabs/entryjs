import { GEHelper } from '../graphicEngine/GEHelper';
import * as posenet from '@tensorflow-models/posenet';

// input resolution setting
const VIDEO_WIDTH = 640;
const VIDEO_HEIGHT = 360;

// canvasVideo SETTING
const CANVAS_WIDTH = 480;
const CANVAS_HEIGHT = 270;

class VideoUtils {
    constructor() {
        //with purpose of utilizing same value outside
        this.CANVAS_WIDTH = CANVAS_WIDTH;
        this.CANVAS_HEIGHT = CANVAS_HEIGHT;
        this.video = null;
        this.canvasVideo = null;
        this.flipStatus = {
            horizontal: false,
            vertical: false,
        };
        this.isMobileNetInit = false;
        this.mobileNet = null;
        this.poses = null;
        this.isInitialized = false;
        this.videoOnLoadHandler = this.videoOnLoadHandler.bind(this);
    }

    reset() {
        this.turnOnWebcam();
        if (!this.flipStatus.horizontal) {
            this.setOptions('hflip');
        }
        if (this.flipStatus.vertical) {
            this.setOptions('vflip');
        }
        GEHelper.resetCanvasBrightness(this.canvasVideo);
        GEHelper.setVideoAlpha(this.canvasVideo, 50);
        GEHelper.tickByEngine();
        this.poses = null;
    }

    async initialize() {
        if (this.isInitialized) {
            return;
        }
        this.isInitialized = true;

        navigator.getUserMedia =
            navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        if (navigator.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: false,
                    video: {
                        facingMode: 'user',
                        width: VIDEO_WIDTH,
                        height: VIDEO_HEIGHT,
                    },
                });

                this.stream = stream;
                const video = document.createElement('video');
                video.srcObject = stream;
                video.width = CANVAS_WIDTH;
                video.height = CANVAS_HEIGHT;
                this.canvasVideo = GEHelper.getVideoElement(video);
                this.video = video;
                video.onloadedmetadata = this.videoOnLoadHandler;
            } catch (err) {
                console.log(err);
                this.isInitialized = false;
            }
        } else {
            console.log('getUserMedia not supported');
        }
    }

    videoOnLoadHandler() {
        Entry.addEventListener('dispatchEventDidToggleStop', this.reset.bind(this));
        this.video.play();
        this.turnOnWebcam();
        this.initializePosenet();
    }

    async initializePosenet() {
        if (this.isMobileNetInit) {
            return;
        }
        this.mobileNet = await posenet.load({
            architecture: 'MobileNetV1',
            outputStride: 16,
            inputResolution: { width: VIDEO_WIDTH, height: VIDEO_HEIGHT },
            multiplier: 1,
        });
        this.isMobileNetInit = true;
    }

    async estimatePoseOnImage() {
        // load the posenet model from a checkpoint
        if (!this.isMobileNetInit) {
            return [];
        }
        try {
            const poses = await this.mobileNet.estimateMultiplePoses(this.video, {
                flipHorizontal: true,
                maxDetections: 4,
                scoreThreshold: 0.5,
                nmsRadius: 20,
            });
            this.poses = poses;
            return poses;
        } catch (err) {
            if (!this.isMobileNetInit) {
                console.log(err);
            }
            return [];
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
                break;
            default:
                this.turnOffWebcam();
                break;
        }
    }

    turnOffWebcam() {
        GEHelper.turnOffWebcam(this.canvasVideo);
    }

    turnOnWebcam() {
        GEHelper.drawVideoElement(this.canvasVideo);
        if (!this.flipStatus.horizontal) {
            this.setOptions('hflip');
        }
    }
    // option change
    setOptions(target, value) {
        if (!this.canvasVideo) {
            return;
        }
        switch (target) {
            case 'brightness':
                GEHelper.setVideoBrightness(this.canvasVideo, value);
                break;
            case 'opacity':
                GEHelper.setVideoAlpha(this.canvasVideo, value);
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

    // videoUtils.destroy does not actually destroy singletonClass, but instead resets the whole stuff except models to be used
    destroy() {
        this.turnOffWebcam();
        this.stream.getTracks().forEach((track) => {
            track.stop();
        });
        this.video = null;
        this.canvasVideo = null;
        this.flipStatus = {
            horizontal: false,
            vertical: false,
        };

        this.mobileNet = null;
        this.poses = null;
        this.isInitialized = false;
    }
}

//Entry 네임스페이스에는 존재하지 않으므로 외부에서 사용할 수 없다.
export default new VideoUtils();
