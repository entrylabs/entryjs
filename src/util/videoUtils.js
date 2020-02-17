import { GEHelper } from '../graphicEngine/GEHelper';
import * as posenet from '@tensorflow-models/posenet';
import VideoWorker from './workers/video.worker';
import * as faceapi from 'face-api.js';

// input resolution setting, this regards of the position of posenet and cocoSSD
const VIDEO_WIDTH = 640;
const VIDEO_HEIGHT = 360;

// canvasVideo SETTING
const CANVAS_WIDTH = 480;
const CANVAS_HEIGHT = 270;

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
        this.motions = { total: 0, maxPoint: { score: 0, x: -1, y: -1 } };
        this.motionPoint = { x: 0, y: 0 };
        this.motionDirection = { x: 0, y: 0 };
        /////////////////////////////////
        this.objectDetected = null;
        this.initialized = false;
        this.mobileNet = null;
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
    }

    async initialize() {
        if (this.isInitialized) {
            return;
        }

        this.isInitialized = true;

        if (!this.inMemoryCanvas) {
            this.inMemoryCanvas = document.createElement('canvas');
            this.inMemoryCanvas.width = CANVAS_WIDTH;
            this.inMemoryCanvas.height = CANVAS_HEIGHT;
        }

        // //test
        // this.tempCanvas = document.createElement('canvas');
        // this.tempCanvas.width = CANVAS_WIDTH;
        // this.tempCanvas.height = CANVAS_HEIGHT;
        // let tempTarget = document.getElementsByClassName('uploadInput')[0];
        // tempTarget.parentNode.insertBefore(this.tempCanvas, tempTarget);
        // //test

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
                await Promise.all([
                    faceapi.nets.ssdMobilenetv1.loadFromUri(`/aimodules/weights`),
                    faceapi.nets.faceLandmark68Net.loadFromUri(`/aimodules/weights`),
                ]);
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

        worker.onmessage = (e) => {
            const { type, message } = e.data;
            switch (type) {
                case 'pose':
                    this.poses = message;
                    break;
                case 'init':
                    this.initialized = true;
                    this.turnOnWebcam();
                    break;
                case 'motion':
                    this.motions = message;
                    const {
                        maxPoint: { score, x, y },
                    } = message;
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

                    break;
                case 'coco':
                    this.objectDetected = message;
                    break;
            }
        };
        worker.postMessage({
            type: 'init',
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT,
        });
        // this.faceWorker.postMessage({ type: 'init' });

        const [track] = this.stream.getVideoTracks();
        this.imageCapture = new ImageCapture(track);

        setInterval(() => {
            // const tempCtx = this.tempCanvas.getContext('2d');
            // if (this.motions.maxPoint) {
            //     const { x, y } = this.motions.maxPoint;
            //     tempCtx.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);

            //     tempCtx.fillStyle = `rgb(${255},${0},${0})`;
            //     tempCtx.fillRect(x, y, 10, 10);
            // }

            const context = this.inMemoryCanvas.getContext('2d');
            context.drawImage(this.video, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            const imageData = context.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            worker.postMessage({
                type: 'estimate',
                imageData,
            });
        }, 100);
        setInterval(() => {
            if (this.faceModelLoaded) {
                faceapi
                    .detectAllFaces(this.video)
                    .withFaceLandmarks()
                    .then((result) => {
                        console.log(result);
                        this.faces = result;
                    });
            }
        }, 300);
    }

    async estimatePoseOnImage() {
        return this.poses.predictions;
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
        this.turnOffWebcam();
        this.stream.getTracks().forEach((track) => {
            track.stop();
        });
        worker.terminate();
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
