/**
 * nt11576 Lee.Jaewon
 * commented area with "motion test" is for the motion detection testing canvas to test the cv, uncomment all codes labeled "motion test"
 */

import { GEHelper } from '../graphicEngine/GEHelper';
import VideoWorker from './workers/video.worker';

// input resolution setting, this regards of the position of posenet and cocoSSD
const VIDEO_WIDTH = 640;
const VIDEO_HEIGHT = 360;

// canvasVideo SETTING
const CANVAS_WIDTH = 480;
const CANVAS_HEIGHT = 270;

const previousFrame = [];
const BRIGHTNESS_THRESHOLD = 30;
const SAMPLE_SIZE = 30;

const worker = new VideoWorker();

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
        // motion related
        this.motions = { total: 0, maxPoint: { score: 0, x: -1, y: -1 }, motion: [] };
        this.motionPoint = { x: 0, y: 0 };
        this.motionDirection = { x: 0, y: 0 };
        /////////////////////////////////
        this.objectDetected = null;
        this.initialized = false;
        this.poses = { predictions: [], adjacents: [] };
        this.isInitialized = false;
        this.videoOnLoadHandler = this.videoOnLoadHandler.bind(this);

        //face models
        this.faces = [];

        //only for webGL
        this.subCanvas = null;

        this.indicatorStatus = {
            pose: false,
            face: false,
            object: false,
        };
    }
    showIndicator(type) {
        this.indicatorStatus[type] = true;
    }
    removeIndicator(type) {
        this.indicatorStatus[type] = false;
        GEHelper.resetHandlers();
    }
    reset() {
        this.indicatorStatus = {
            pose: false,
            face: false,
            object: false,
        };
        GEHelper.resetHandlers();
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
        this.objectDetected = null;
        this.motionStatus = {
            total: 0,
            right: 0,
            left: 0,
            top: 0,
            bottom: 0,
        };
        this.disableAllModels();
    }

    async initialize() {
        if (this.isInitialized) {
            return;
        }

        this.isInitialized = true;

        // this canvas is for motion calculation
        if (!this.inMemoryCanvas) {
            this.inMemoryCanvas = document.createElement('canvas');
            this.inMemoryCanvas.width = CANVAS_WIDTH;
            this.inMemoryCanvas.height = CANVAS_HEIGHT;
        }

        // //motion test
        // this.tempCanvas = document.createElement('canvas');
        // this.tempCanvas.width = CANVAS_WIDTH;
        // this.tempCanvas.height = CANVAS_HEIGHT;
        // let tempTarget = document.getElementsByClassName('uploadInput')[0];
        // tempTarget.parentNode.insertBefore(this.tempCanvas, tempTarget);
        // //motion test

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

                this.faceModelLoaded = true;
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

    test() {
        this.indicatorStatus = {
            pose: true,
            face: true,
            object: true,
        };
    }

    startDrawIndicators() {
        if (this.objectDetected && this.indicatorStatus.object) {
            GEHelper.drawObjectBox(this.objectDetected, this.flipStatus);
        }
        if (this.faces && this.indicatorStatus.face) {
            const result = GEHelper.drawFaceBoxes(this.faces, this.flipStatus);
        }
        if (this.poses && this.indicatorStatus.pose) {
            GEHelper.drawHumanPoints(this.poses.predictions, this.flipStatus);
            GEHelper.drawHumanSkeletons(this.poses.adjacents, this.flipStatus);
        }
        requestAnimationFrame(this.startDrawIndicators.bind(this));
    }

    videoOnLoadHandler() {
        Entry.addEventListener('beforeStop', this.reset.bind(this));
        this.video.play();
        this.startDrawIndicators();

        if (this.initialized) {
            return;
        }
        const [track] = this.stream.getVideoTracks();
        this.imageCapture = new ImageCapture(track);

        worker.onmessage = (e) => {
            const { type, message } = e.data;
            switch (type) {
                case 'init':
                    this.initialized = true;
                    this.turnOnWebcam();
                    break;
                case 'face':
                    this.faces = message;
                    break;
                case 'coco':
                    this.objectDetected = message;
                    break;
                case 'pose':
                    this.poses = message;
                    break;
            }
        };

        const offCanvas = new OffscreenCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);

        worker.postMessage(
            {
                type: 'init',
                width: CANVAS_WIDTH,
                height: CANVAS_HEIGHT,
                offCanvas,
            },
            [offCanvas]
        );
        this.sendImageToWorker();
        this.motionDetect();
    }

    manageModel(target, mode) {
        worker.postMessage({
            type: 'handle',
            target,
            mode,
        });
    }
    disableAllModels() {
        worker.postMessage({
            type: 'handleOff',
        });
    }

    async sendImageToWorker() {
        const captured = await this.imageCapture.grabFrame();
        worker.postMessage({ type: 'estimate', image: captured }, [captured]);

        // //motion test
        // const tempCtx = this.tempCanvas.getContext('2d');
        // if (this.motions && this.motions.motion) {
        //     tempCtx.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);
        //     this.motions.motion.forEach(({ x, y, r, g, b }) => {
        //         tempCtx.fillStyle = `rgb(${r},${g},${b})`;
        //         tempCtx.fillRect(x, y, 10, 10);
        //     });
        //     const { x, y } = this.motions.maxPoint;

        //     tempCtx.fillStyle = `rgb(${255},${0},${0})`;
        //     tempCtx.fillRect(x, y, 10, 10);
        // }
        ///////////////////////////
        // if (this.motions.maxPoint) {
        //     const { x, y } = this.motions.maxPoint;
        //     tempCtx.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);

        //     tempCtx.fillStyle = `rgb(${255},${0},${0})`;
        //     tempCtx.fillRect(x, y, 10, 10);
        // }
        // //motion test
        setTimeout(() => {
            requestAnimationFrame(this.sendImageToWorker.bind(this));
        }, 50);
    }

    motionDetect() {
        if (!this.inMemoryCanvas) {
            return;
        }
        const context = this.inMemoryCanvas.getContext('2d');
        context.drawImage(this.video, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        const imageData = context.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        const data = imageData.data;
        // // motion test
        // const motion = [];
        // // motion test

        const motions = { total: 0, maxPoint: { score: 0, x: -10, y: -10 }, motion: [] };
        for (let y = 0; y < CANVAS_HEIGHT; y += SAMPLE_SIZE) {
            for (let x = 0; x <= CANVAS_WIDTH; x += SAMPLE_SIZE) {
                const pos = (x + y * CANVAS_WIDTH) * 4;
                const r = data[pos];
                const g = data[pos + 1];
                const b = data[pos + 2];
                // const a = data[pos + 3];

                const currentPos = previousFrame[pos] || { r: 0, g: 0, b: 0, a: 0 };
                const rDiff = Math.abs(currentPos.r - r);
                const gDiff = Math.abs(currentPos.g - g);
                const bDiff = Math.abs(currentPos.b - b);
                const areaMotionScore = rDiff + gDiff + bDiff / (SAMPLE_SIZE * SAMPLE_SIZE);
                // // motion test
                // motion.push({
                //     x,
                //     y,
                //     r,
                //     g,
                //     b,
                // });
                // // motion test
                if (rDiff > BRIGHTNESS_THRESHOLD) {
                    if (motions.maxPoint.score < areaMotionScore) {
                        motions.maxPoint.x = x;
                        motions.maxPoint.y = y;
                        motions.maxPoint.score = areaMotionScore;
                    }
                }
                motions.total += areaMotionScore;
                previousFrame[pos] = { r, g, b };
            }
        }

        const { score, x, y } = motions.maxPoint;
        if (score > 0 && x > 0 && y > 0) {
            const prevX = this.motionPoint.x;
            const prevY = this.motionPoint.y;
            const motionScalarX = Math.abs(prevX - x);
            const motionScalarY = Math.abs(prevY - y);
            this.motionDirection.x = motionScalarX;
            this.motionDirection.y = motionScalarY;
            if (prevX > x) {
                this.motionDirection.x *= -1;
            }

            if (prevY > y) {
                this.motionDirection.y *= -1;
            }
            this.motionPoint.x = x;
            this.motionPoint.y = y;
        }

        this.motions = motions;

        setTimeout(this.motionDetect.bind(this), 80);
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
                worker.postMessage({
                    type: 'option',
                    option: { flipStatus: this.flipStatus },
                });
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
        this.disableAllModels();
        this.turnOffWebcam();
        this.stream.getTracks().forEach((track) => {
            track.stop();
        });
        worker.terminate();
        this.video = null;
        this.canvasVideo = null;
        this.inMemoryCanvas = null;
        this.flipStatus = {
            horizontal: false,
            vertical: false,
        };

        this.poses = null;
        this.isInitialized = false;
    }
}

//Entry 네임스페이스에는 존재하지 않으므로 외부에서 사용할 수 없다.
export default new VideoUtils();
