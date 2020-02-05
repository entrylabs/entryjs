import { GEHelper } from '../graphicEngine/GEHelper';
import * as posenet from '@tensorflow-models/posenet';

const VIDEO_WIDTH = 640;
const VIDEO_HEIGHT = 360;

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
        this.isMobileNetInit = false;
        this.mobileNet = null;
        this.poses = null;
    }

    reset() {
        this.turnOffWebcam();
        this.isInitialized = false;
        this.video = null;
        this.canvasVideo = null;
        this.flipStatus = {
            horizontal: false,
            vertical: false,
        };
        this.isMobileNetInit = false;
        this.mobileNet = null;
        this.poses = null;
    }

    async initialize() {
        if (this.isInitialized) {
            return;
        }
        this.isInitialized = true;
        Entry.addEventListener('dispatchEventDidToggleStop', this.reset.bind(this));
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
                this.video = document.createElement('video');
                this.video.srcObject = stream;
                this.video.width = 480;
                this.video.height = 270;

                this.video.onloadedmetadata = async (e) => {
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
                    this.video.play();
                    console.log('done initializing');
                    this.getPose();
                };
            } catch (err) {
                console.log(err);
                this.isInitialized = false;
            }
        } else {
            console.log('getUserMedia not supported');
        }
    }

    getPose() {
        if (!this.canvasVideo) {
            return;
        }
        if (this.isMobileNetInit) {
            this.estimatePoseOnImage(this.video);
        }
        requestAnimationFrame(() => {
            this.getPose();
        });
    }

    estimatePoseOnImage(imageElement) {
        // load the posenet model from a checkpoint
        if (!this.mobileNet) {
            return;
        }
        try {
            this.mobileNet
                .estimateMultiplePoses(imageElement, {
                    flipHorizontal: true,
                    maxDetections: 4,
                    scoreThreshold: 0.5,
                    nmsRadius: 20,
                })
                .then((poses) => {
                    this.poses = poses;
                });
        } catch (err) {
            console.error('error in detection');
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
        if (this.canvasVideo) {
            return;
        }
        this.canvasVideo = GEHelper.getAndDrawVideo(this.video);
        if (!this.flipStatus.horizontal) {
            this.setOptions('hflip');
        }
    }
    // option change
    setOptions(target, value) {
        switch (target) {
            case 'brightness':
                if (!this.canvasVideo) {
                    return;
                }
                GEHelper.setVideoBrightness(this.canvasVideo, value);
                break;
            case 'opacity':
                if (!this.canvasVideo) {
                    return;
                }
                GEHelper.setVideoAlpha(this.canvasVideo, value);
                break;
            case 'hflip':
                if (!this.canvasVideo) {
                    return;
                }
                this.flipStatus.horizontal = !this.flipStatus.horizontal;
                GEHelper.hFlipVideoElement(this.canvasVideo);
                break;
            case 'vflip':
                if (!this.canvasVideo) {
                    return;
                }
                this.flipStatus.vertical = !this.flipStatus.vertical;
                GEHelper.vFlipVideoElement(this.canvasVideo);
                break;
        }
    }
}

//Entry 네임스페이스에는 존재하지 않으므로 외부에서 사용할 수 없다.
export default new VideoUtils();
