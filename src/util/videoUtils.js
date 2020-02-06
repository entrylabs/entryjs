import { GEHelper } from '../graphicEngine/GEHelper';
import * as posenet from '@tensorflow-models/posenet';

// input resolution setting
const VIDEO_WIDTH = 640;
const VIDEO_HEIGHT = 360;

class VideoUtils {
    constructor() {
        this.CANVAS_WIDTH = 480;
        this.CANVAS_HEIGHT = 270;
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
        this.isVideoInitialized = false;
        this.initialize();
    }

    reset() {
        console.log('RESET');
        this.turnOffWebcam();
        if (this.flipStatus.horizontal) {
            this.setOptions('hflip');
        }
        if (this.flipStatus.vertical) {
            this.setOptions('vflip');
        }
        this.flipStatus = {
            horizontal: false,
            vertical: false,
        };
        this.poses = null;
    }

    async initialize() {
        if (this.isInitialized) {
            return;
        }
        this.isInitialized = true;
        this.video = document.createElement('video');
        this.video.width = this.CANVAS_WIDTH;
        this.video.height = this.CANVAS_HEIGHT;
        this.canvasVideo = GEHelper.getVideo(this.video);
        navigator.getUserMedia =
            navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        if (navigator.getUserMedia) {
            try {
                this.video.srcObject = await navigator.mediaDevices.getUserMedia({
                    audio: false,
                    video: {
                        facingMode: 'user',
                        width: VIDEO_WIDTH,
                        height: VIDEO_HEIGHT,
                    },
                });
                this.video.play();
                this.video.onloadedmetadata = async (e) => {
                    this.isVideoInitialized = true;
                    Entry.addEventListener('dispatchEventDidToggleStop', this.reset.bind(this));
                };
            } catch (err) {
                console.log(err);
                this.isInitialized = false;
            }
        } else {
            console.log('getUserMedia not supported');
        }
    }

    async initializePosenet() {
        if (this.isMobileNetInit) {
            return;
        }
        this.isMobileNetInit = true;
        this.mobileNet = await posenet.load({
            architecture: 'MobileNetV1',
            outputStride: 16,
            inputResolution: { width: VIDEO_WIDTH, height: VIDEO_HEIGHT },
            multiplier: 1,
        });
        console.log('done initializing');
    }

    async estimatePoseOnImage() {
        // load the posenet model from a checkpoint
        if (!this.mobileNet) {
            await this.initializePosenet();
        }
        return await new Promise((resolve, reject) => {
            try {
                this.mobileNet
                    .estimateMultiplePoses(this.video, {
                        flipHorizontal: true,
                        maxDetections: 4,
                        scoreThreshold: 0.5,
                        nmsRadius: 20,
                    })
                    .then((poses) => {
                        this.poses = poses;
                        resolve(poses);
                    });
            } catch (err) {
                console.error('error in detection');
                resolve([]);
            }
        });
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
        if (!this.canvasVideo) {
            this.canvasVideo = GEHelper.getVideo(this.video);
        }
        GEHelper.drawVideo(this.canvasVideo);
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
