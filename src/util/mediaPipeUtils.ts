import singleInstance from '../core/singleInstance';
import { GEHelper } from '../graphicEngine/GEHelper';
import {
    FilesetResolver,
    DrawingUtils,
    GestureRecognizer,
    GestureRecognizerResult,
    PoseLandmarker,
    PoseLandmarkerResult,
} from '@mediapipe/tasks-vision';
import { UAParser } from 'ua-parser-js';
import _clamp from 'lodash/clamp';
import VideoMotionWorker from './workers/newmotion.worker.ts';

export const getInputList = async () => {
    if (navigator.mediaDevices) {
        return (await navigator.mediaDevices.enumerateDevices()) || [];
    }
    return [];
};

const parser = new UAParser();

export const flipState = {
    NORMAL: 0,
    HORIZONTAL: 1,
    VERTICAL: 2,
    BOTH: 3,
};
type FLIP_NORMAL = 0;
type FLIP_HORIZONTAL = 1;
type FLIP_VERTICAL = 2;
type FLIP_BOTH = 3;
type TFlipState = FLIP_NORMAL | FLIP_HORIZONTAL | FLIP_VERTICAL | FLIP_BOTH;

type TGestureRecognitionOption = {
    isDrawDetectedHand?: boolean;
};

type MotionElement = {
    total: number;
    direction: {
        x: number;
        y: number;
    };
};

type Pixel = {
    r: number;
    g: number;
    b: number;
    rDiff: number;
    gDiff: number;
    bDiff: number;
};

const flipActions = {
    [flipState.NORMAL]: {
        [flipState.HORIZONTAL]: (videos: PIXI.Sprite[] | createjs.Bitmap[]) => {
            GEHelper.hFlipVideoElement(videos);
        },
        [flipState.VERTICAL]: (videos: PIXI.Sprite[] | createjs.Bitmap[]) => {
            GEHelper.vFlipVideoElement(videos);
        },
        [flipState.BOTH]: (videos: PIXI.Sprite[] | createjs.Bitmap[]) => {
            GEHelper.hFlipVideoElement(videos);
            GEHelper.vFlipVideoElement(videos);
        },
    },
    [flipState.HORIZONTAL]: {
        [flipState.NORMAL]: (videos: PIXI.Sprite[] | createjs.Bitmap[]) => {
            GEHelper.hFlipVideoElement(videos);
        },
        [flipState.VERTICAL]: (videos: PIXI.Sprite[] | createjs.Bitmap[]) => {
            GEHelper.hFlipVideoElement(videos);
            GEHelper.vFlipVideoElement(videos);
        },
        [flipState.BOTH]: (videos: PIXI.Sprite[] | createjs.Bitmap[]) => {
            GEHelper.vFlipVideoElement(videos);
        },
    },
    [flipState.VERTICAL]: {
        [flipState.NORMAL]: (videos: PIXI.Sprite[] | createjs.Bitmap[]) => {
            GEHelper.vFlipVideoElement(videos);
        },
        [flipState.HORIZONTAL]: (videos: PIXI.Sprite[] | createjs.Bitmap[]) => {
            GEHelper.hFlipVideoElement(videos);
            GEHelper.vFlipVideoElement(videos);
        },
        [flipState.BOTH]: (videos: PIXI.Sprite[] | createjs.Bitmap[]) => {
            GEHelper.hFlipVideoElement(videos);
        },
    },
    [flipState.BOTH]: {
        [flipState.NORMAL]: (videos: PIXI.Sprite[] | createjs.Bitmap[]) => {
            GEHelper.hFlipVideoElement(videos);
            GEHelper.vFlipVideoElement(videos);
        },
        [flipState.HORIZONTAL]: (videos: PIXI.Sprite[] | createjs.Bitmap[]) => {
            GEHelper.vFlipVideoElement(videos);
        },
        [flipState.VERTICAL]: (videos: PIXI.Sprite[] | createjs.Bitmap[]) => {
            GEHelper.hFlipVideoElement(videos);
        },
    },
};

class MediaPipeUtils {
    public isInitialized: boolean = false;
    public videoInputList: string[][] = [];
    public canvasVideo: PIXI.Sprite | createjs.Bitmap;
    public canvasOverlay: PIXI.Sprite | createjs.Bitmap;
    public video: HTMLVideoElement;
    public videoCanvas: HTMLCanvasElement;
    public videoCanvasCtx: CanvasRenderingContext2D;
    public motionCanvas: HTMLCanvasElement;
    public motionOffscreenCanvas: HTMLCanvasElement;
    public isRunningHandGesture: boolean;
    public canWorker: boolean = true;
    public flipState: TFlipState = 0;
    public isDrawDetectedHand: boolean = false;
    public isDrawDetectedPoseLandmarker: boolean = false;
    public isPrevHandDetected: boolean = false;
    public isPrevPoseLandmarker: boolean = false;
    public isRunningPoseLandmarker: boolean = false;
    public countDetectedHand: number;
    private VIDEO_WIDTH: number = 640;
    private VIDEO_HEIGHT: number = 360;
    private STAGE_WIDTH: number = 480;
    private STAGE_HEIGHT: number = 260;
    private SAMPLE_SIZE: number = 15;
    private stream: MediaStream;
    private lastVideoTime: number = -1;
    private prevGestureRecognizerResult: GestureRecognizerResult;
    private prevPoseLandmarkerResult: PoseLandmarkerResult;
    private gestureRecognizer: GestureRecognizer;
    private poseLandmarker: PoseLandmarker;
    private drawingUtils: DrawingUtils;
    private worker: Worker;
    private inOffscreenCanvas: OffscreenCanvas;
    private alreadyInitOffscreenCanvas: boolean;
    private sourceTarget: number;
    private BOUNDARY_OFFSET: number = 4;
    private SAME_COORDINATE_COMPENSATION: number = 10;
    private isInitGestureRecognition: boolean = false;
    private gestureRecognizerVideoCanvas: HTMLCanvasElement;
    private gestureRecognizerVideoCanvasCtx: CanvasRenderingContext2D;
    private gestureRecognizerCanvasOverlay: PIXI.Sprite | createjs.Bitmap;
    private gestureRecognizerOffscreenCanvas: OffscreenCanvas;
    private gestureRecognizerWorker: Worker;
    private alreadyInitGestureRecognizerOffscreenCanvas: boolean = false;
    private gestureRecognizerDrawingUtils: DrawingUtils;

    private isInitPoseLandmarker: boolean = false;
    private poseLandmarkerVideoCanvas: HTMLCanvasElement;
    private poseLandmarkerVideoCanvasCtx: CanvasRenderingContext2D;
    private poseLandmarkerCanvasOverlay: PIXI.Sprite | createjs.Bitmap;
    private poseLandmarkerOffscreenCanvas: OffscreenCanvas;
    private poseLandmarkerWorker: Worker;
    private alreadyInitPoseLandmarkerOffscreenCanvas: boolean = false;
    private poseLandmarkerDrawingUtils: DrawingUtils;

    public totalMotions: MotionElement = { total: 0, direction: { x: 0, y: 0 } };
    public motions: Pixel[][] = [
        ...Array(Math.ceil(this.STAGE_HEIGHT / this.SAMPLE_SIZE)),
    ].map((e) => Array(this.STAGE_WIDTH / this.SAMPLE_SIZE));
    public motionWorker: Worker = new VideoMotionWorker();

    constructor() {
        const uaResult = parser.getResult();
        if (uaResult.browser.name === 'Safari' || uaResult.os.name === 'iOS') {
            this.canWorker = false;
        }
    }

    get isRunning() {
        return Boolean(this.video.srcObject);
    }

    get allCanvases(): PIXI.Sprite[] | createjs.Bitmap[] {
        return [
            this.canvasVideo,
            this.canvasOverlay,
            this.gestureRecognizerCanvasOverlay,
            this.poseLandmarkerCanvasOverlay,
        ] as PIXI.Sprite[] | createjs.Bitmap[];
    }

    get overlayCanvases(): PIXI.Sprite[] | createjs.Bitmap[] {
        return [
            this.canvasOverlay,
            this.gestureRecognizerCanvasOverlay,
            this.poseLandmarkerCanvasOverlay,
        ] as PIXI.Sprite[] | createjs.Bitmap[];
    }

    changeCanWorker(canWorker: boolean) {
        this.canWorker = canWorker;
    }

    async initialize() {
        if (this.isInitialized) {
            return;
        }
        await this.checkPermission();
        const inputList = await getInputList();
        this.videoInputList = inputList
            .filter((input) => input.kind === 'videoinput' && input.deviceId)
            .map((item) => [item.label, item.deviceId]);

        await this.compatabilityChecker();
        this.motionCanvas = document.createElement('canvas');
        this.motionCanvas.width = this.VIDEO_WIDTH;
        this.motionCanvas.height = this.VIDEO_HEIGHT;
        const video = document.createElement('video');
        video.id = 'webCamElement';
        video.autoplay = true;
        video.width = this.VIDEO_WIDTH;
        video.height = this.VIDEO_HEIGHT;
        this.canvasVideo = GEHelper.getVideoElement(video);
        GEHelper.hFlipVideoElement(this.allCanvases as PIXI.Sprite[] | createjs.Bitmap[]);
        this.video = video;
        Entry.addEventListener('beforeStop', this.reset.bind(this));
        this.isInitialized = true;
        this.initMotionWorkerEvent();
    }

    sleep(ms?: number) {
        return new Promise((resolve) => {
            if (ms) {
                setTimeout(resolve, ms);
            } else {
                requestAnimationFrame(resolve);
            }
        });
    }

    initMotionWorkerEvent() {
        this.motionWorker.onmessage = ({ data }) => {
            if (data.action === 'init_complete') {
                this.motionDetect();
            } else if (data.action === 'next_detect_motion') {
                this.totalMotions = data.result;
                setTimeout(this.motionDetect.bind(this), 100);
            }
        };
    }

    async sendImageBitmapForGesture() {
        if (!this.isRunningHandGesture) {
            return;
        }
        if (this.video.readyState < 2) {
            await this.sleep();
            this.sendImageBitmapForGesture();
            return;
        }
        this.gestureRecognizerWorker.postMessage({
            action: 'gesture_recognizer',
            imageBitmap: await createImageBitmap(this.video),
        });
    }

    async sendImageBitmapForPoseLandmarker() {
        if (!this.isRunningPoseLandmarker) {
            return;
        }
        if (this.video.readyState < 2) {
            await this.sleep();
            this.sendImageBitmapForPoseLandmarker();
            return;
        }
        this.poseLandmarkerWorker.postMessage({
            action: 'pose_landmarker',
            imageBitmap: await createImageBitmap(this.video),
        });
    }

    cameraOnOff(mode: String) {
        if (mode === 'on') {
            this.turnOnWebcam();
        } else {
            this.turnOffWebcam();
        }
    }

    async changeSource(target: number) {
        const inputSource = this.videoInputList[target];
        if (!inputSource) {
            return;
        }
        this.sourceTarget = target;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                    deviceId: {
                        exact: inputSource[1],
                    },
                    width: this.VIDEO_WIDTH,
                    height: this.VIDEO_HEIGHT,
                },
            });
            this.stream = stream;
            this.video.srcObject = this.stream;
            this.video.width = this.VIDEO_WIDTH;
            this.video.height = this.VIDEO_HEIGHT;
            this.video.style.transform = 'scaleX(-1)';
        } catch (err) {
            console.log(err);
        }
    }

    setFlipState(state: TFlipState) {
        if (!this.canvasVideo) {
            return;
        }
        this.setForceFlipState(this.flipState, state);
    }

    setForceFlipState(prevState: TFlipState, nextState: TFlipState) {
        const action = flipActions[prevState][nextState];
        if (action) {
            action(this.allCanvases);
        }
        this.flipState = nextState;
    }

    setOpacityCamera(opacity: number) {
        GEHelper.setVideoAlpha(this.canvasVideo, opacity);
    }

    turnOffWebcam() {
        if (this.video.srcObject) {
            const stream: MediaStream = this.video.srcObject as MediaStream;
            stream.getTracks().forEach((track) => {
                track.stop();
            });
            window.requestAnimationFrame(() => {
                this.video.srcObject = null;
                this.stream = undefined;
            });
        }

        GEHelper.turnOffWebcam(this.canvasVideo);
        this.overlayCanvases.forEach((canvas: PIXI.Sprite | createjs.Bitmap) => {
            GEHelper.turnOffOverlay(canvas);
        });
        this.setForceFlipState(this.flipState, 0);
    }

    async turnOnWebcam() {
        let stream;
        try {
            const target = this.sourceTarget || 0;
            stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    deviceId: { exact: this.videoInputList[target][1] },
                    width: this.VIDEO_WIDTH,
                    height: this.VIDEO_HEIGHT,
                },
            });
        } catch (err) {
            throw new Entry.Utils.IncompatibleError('IncompatibleError', [
                Lang.Workspace.check_webcam_error,
            ]);
        }
        this.video.srcObject = stream;
        this.stream = stream;
        try {
            await this.video.play();
        } catch {}
        GEHelper.drawVideoElement(this.canvasVideo);
        this.overlayCanvases.forEach((canvas: PIXI.Sprite | createjs.Bitmap) => {
            GEHelper.drawOverlayElement(canvas);
        });
        this.motionWorker.postMessage({
            action: 'init',
            width: this.VIDEO_WIDTH,
            height: this.VIDEO_HEIGHT,
        });
    }

    initGestureRecognitionWorkerEvent() {
        this.gestureRecognizerWorker.addEventListener('message', ({ data }) => {
            if (['next_gesture_recognizer'].includes(data.action)) {
                this.sendImageBitmapForGesture();
            } else if (data.action === 'start_gesture_recognizer') {
                this.isPrevHandDetected = true;
                Entry.engine.fireEvent('when_hand_detection');
            } else if (data.action === 'stop_gesture_recognizer') {
                this.isPrevHandDetected = false;
            } else if (data.action === 'count_detected_hand_gesture_recognizer') {
                this.countDetectedHand = data.count;
            } else if (data.action === 'gesture_recognizer_data') {
                this.prevGestureRecognizerResult = data.gestureRecognizerResult;
            }
        });
    }

    initPoseLandmarkerWorkerEvent() {
        this.poseLandmarkerWorker.addEventListener('message', ({ data }) => {
            if (['next_pose_landmarker'].includes(data.action)) {
                this.sendImageBitmapForPoseLandmarker();
            } else if (data.action === 'start_pose_landmarker') {
                this.isPrevPoseLandmarker = true;
                Entry.engine.fireEvent('when_pose_landmarker');
            } else if (data.action === 'stop_pose_landmarker') {
                this.isPrevPoseLandmarker = false;
            } else if (data.action === 'count_detected_hand_pose_landmarker') {
                // this.countDetectedHand = data.count;
            } else if (data.action === 'pose_landmarker_data') {
                this.prevPoseLandmarkerResult = data.poseLandmarkerResult;
            }
        });
    }

    initHandGestureRecognition() {
        this.isInitGestureRecognition = true;
        this.gestureRecognizerVideoCanvas = document.createElement('canvas');
        this.gestureRecognizerVideoCanvas.width = this.VIDEO_WIDTH;
        this.gestureRecognizerVideoCanvas.height = this.VIDEO_HEIGHT;
        this.gestureRecognizerCanvasOverlay = GEHelper.getOverlayElement(
            this.gestureRecognizerVideoCanvas
        );
        GEHelper.drawOverlayElement(this.gestureRecognizerCanvasOverlay);
        GEHelper.hFlipVideoElement(this.gestureRecognizerCanvasOverlay);
        if (this.canWorker) {
            this.gestureRecognizerOffscreenCanvas = this.gestureRecognizerVideoCanvas.transferControlToOffscreen();
            this.gestureRecognizerWorker = new Worker(
                '/lib/entry-js/extern/gesture-recognition.worker.js'
            );
            this.initGestureRecognitionWorkerEvent();
        } else {
            this.gestureRecognizerVideoCanvasCtx = this.gestureRecognizerVideoCanvas.getContext(
                '2d'
            );
            this.gestureRecognizerVideoCanvasCtx.font = '20px Arial';
            this.gestureRecognizerDrawingUtils = new DrawingUtils(
                this.gestureRecognizerVideoCanvasCtx
            );
        }
    }

    initPoseLandmarker() {
        this.isInitPoseLandmarker = true;
        this.poseLandmarkerVideoCanvas = document.createElement('canvas');
        this.poseLandmarkerVideoCanvas.width = this.VIDEO_WIDTH;
        this.poseLandmarkerVideoCanvas.height = this.VIDEO_HEIGHT;
        this.poseLandmarkerCanvasOverlay = GEHelper.getOverlayElement(
            this.poseLandmarkerVideoCanvas
        );
        GEHelper.drawOverlayElement(this.poseLandmarkerCanvasOverlay);
        GEHelper.hFlipVideoElement(this.poseLandmarkerCanvasOverlay);
        if (this.canWorker) {
            this.poseLandmarkerOffscreenCanvas = this.poseLandmarkerVideoCanvas.transferControlToOffscreen();
            this.poseLandmarkerWorker = new Worker(
                '/lib/entry-js/extern/pose-landmarker.worker.js'
            );
            this.initPoseLandmarkerWorkerEvent();
        } else {
            this.poseLandmarkerVideoCanvasCtx = this.poseLandmarkerVideoCanvas.getContext('2d');
            this.poseLandmarkerVideoCanvasCtx.font = '20px Arial';
            this.poseLandmarkerDrawingUtils = new DrawingUtils(this.poseLandmarkerVideoCanvasCtx);
        }
    }

    async startHandGestureRecognition() {
        try {
            if (!this.stream) {
                await this.turnOnWebcam();
            }
            if (!this.isInitGestureRecognition) {
                this.initHandGestureRecognition();
            }
            this.isRunningHandGesture = true;

            if (this.canWorker) {
                if (!this.alreadyInitGestureRecognizerOffscreenCanvas) {
                    this.gestureRecognizerWorker.postMessage(
                        {
                            action: 'gesture_recognizer_init',
                            canvas: this.gestureRecognizerOffscreenCanvas,
                            option: {
                                isDrawDetectedHand: this.isDrawDetectedHand,
                            },
                        },
                        [this.gestureRecognizerOffscreenCanvas]
                    );
                    this.alreadyInitGestureRecognizerOffscreenCanvas = true;
                } else {
                    this.sendImageBitmapForGesture();
                }
            } else {
                await this.initPredictHandGesture();
                this.predictHandGesture();
            }
        } catch (e) {
            console.error(e);
        }
    }

    async startPoseLandmarker() {
        try {
            if (!this.stream) {
                await this.turnOnWebcam();
            }
            if (!this.isInitPoseLandmarker) {
                this.initPoseLandmarker();
            }
            this.isRunningPoseLandmarker = true;

            if (this.canWorker) {
                if (!this.alreadyInitPoseLandmarkerOffscreenCanvas) {
                    this.poseLandmarkerWorker.postMessage(
                        {
                            action: 'pose_landmarker_init',
                            canvas: this.poseLandmarkerOffscreenCanvas,
                            option: {
                                isDrawDetectedPoseLandmarker: this.isDrawDetectedPoseLandmarker,
                            },
                        },
                        [this.poseLandmarkerOffscreenCanvas]
                    );
                    this.alreadyInitPoseLandmarkerOffscreenCanvas = true;
                } else {
                    this.sendImageBitmapForPoseLandmarker();
                }
            } else {
                await this.initPredictPoseLandmarker();
                this.predictPoseLandmarker();
            }
        } catch (e) {
            console.error(e);
        }
    }

    changeDrawDetectedHand(isDrawDetectedHand: boolean) {
        this.isDrawDetectedHand = isDrawDetectedHand;
        this.updateHandGestureRecognition();
    }

    changeDrawDetectedPoseLandmarker(isDrawDetectedPoseLandmarker: boolean) {
        this.isDrawDetectedPoseLandmarker = isDrawDetectedPoseLandmarker;
        this.updatePoseLandmarker();
    }

    updateHandGestureRecognition() {
        if (this.canWorker) {
            this.gestureRecognizerWorker.postMessage({
                action: 'gesture_recognizer_change_option',
                option: {
                    isDrawDetectedHand: this.isDrawDetectedHand,
                },
            });
        }
    }

    updatePoseLandmarker() {
        if (this.canWorker) {
            this.poseLandmarkerWorker.postMessage({
                action: 'pose_landmarker_change_option',
                option: {
                    isDrawDetectedPoseLandmarker: this.isDrawDetectedPoseLandmarker,
                },
            });
        }
    }

    async stopHandGestureRecognition() {
        this.isRunningHandGesture = false;
        this.isPrevHandDetected = false;
        this.countDetectedHand = 0;
        if (this.canWorker) {
            this.gestureRecognizerWorker.postMessage({
                action: 'clear_gesture_recognizer',
            });
        } else {
            this.gestureRecognizerVideoCanvasCtx.clearRect(
                0,
                0,
                this.video.width,
                this.video.height
            );
        }
    }

    async stopPoseLandmarker() {
        this.isRunningPoseLandmarker = false;
        this.isPrevPoseLandmarker = false;
        // this.countDetectedHand = 0;
        if (this.canWorker) {
            this.poseLandmarkerWorker.postMessage({
                action: 'clear_pose_landmarker',
            });
        } else {
            this.poseLandmarkerVideoCanvasCtx.clearRect(0, 0, this.video.width, this.video.height);
        }
    }

    async checkPermission() {
        if (navigator.permissions) {
            const permission = await navigator.permissions.query({ name: 'camera' });
            if (permission.state !== 'granted') {
                await navigator.mediaDevices.getUserMedia({ video: true });
            }
        } else {
            await navigator.mediaDevices.getUserMedia({ video: true });
        }
    }

    async compatabilityChecker() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Entry.Utils.IncompatibleError('IncompatibleError', [
                Lang.Workspace.check_browser_error_video,
            ]);
        }
        if (!this.stream && this.videoInputList.length == 0) {
            throw new Entry.Utils.IncompatibleError('IncompatibleError', [
                Lang.Workspace.check_webcam_error,
            ]);
        }
    }

    getYX(a: number) {
        return Math.max(1, Math.min(10, 10 * (1 - (a - -0.15) / 0.25) + (1 - (0.1 - a) / 0.25)));
    }

    async initPredictHandGesture() {
        const vision = await FilesetResolver.forVisionTasks('/lib/entry-js/extern/wasm');
        this.gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
            baseOptions: {
                modelAssetPath: '/lib/entry-js/extern/model/gesture_recognizer.task',
                delegate: 'GPU',
            },
            runningMode: 'VIDEO',
            numHands: 2,
        });
    }

    async initPredictPoseLandmarker() {
        const vision = await FilesetResolver.forVisionTasks('/lib/entry-js/extern/wasm');
        this.poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
            baseOptions: {
                modelAssetPath: '/lib/entry-js/extern/model/pose_landmarker_lite.task',
                delegate: 'GPU',
            },
            runningMode: 'VIDEO',
            numPoses: 1,
        });
    }

    async predictHandGesture() {
        try {
            let results;

            if (!this.gestureRecognizerVideoCanvasCtx || this.isRunningHandGesture === false) {
                return;
            }
            if (this.video.readyState < 2) {
                await this.sleep();
                this.predictHandGesture();
                return;
            }
            if (this.video.currentTime !== this.lastVideoTime) {
                this.lastVideoTime = this.video.currentTime;
                const startTimeMs = Date.now();
                results = this.gestureRecognizer.recognizeForVideo(this.video, startTimeMs);
            } else {
                return;
            }
            this.gestureRecognizerVideoCanvasCtx.save();
            this.gestureRecognizerVideoCanvasCtx.clearRect(
                0,
                0,
                this.video.width,
                this.video.height
            );

            const { landmarks, handednesses } = results;
            this.prevGestureRecognizerResult = results;
            if (landmarks.length) {
                if (!this.isPrevHandDetected) {
                    this.isPrevHandDetected = true;
                    Entry.engine.fireEvent('when_hand_detection');
                }
                if (landmarks.length !== this.countDetectedHand) {
                    this.countDetectedHand = landmarks.length;
                }
                if (!this.isDrawDetectedHand) {
                    return;
                }

                landmarks.forEach((landmark, i) => {
                    let connectColor;
                    let landmarkColor;
                    const [handedness] = handednesses[i];
                    const mark12 = landmark[12];
                    this.gestureRecognizerVideoCanvasCtx.scale(-1, 1);
                    if (handedness.categoryName === 'Left') {
                        this.gestureRecognizerVideoCanvasCtx.fillStyle = '#FF0000';
                        this.gestureRecognizerVideoCanvasCtx.fillText(
                            `${i + 1}-오른손`,
                            -mark12.x * 640,
                            mark12.y * 360 - 20
                        );
                        connectColor = '#FF0000';
                        landmarkColor = '#00FF00';
                    } else {
                        this.gestureRecognizerVideoCanvasCtx.fillStyle = '#00FF00';
                        this.gestureRecognizerVideoCanvasCtx.fillText(
                            `${i + 1}-왼손`,
                            -mark12.x * 640,
                            mark12.y * 360 - 20
                        );
                        connectColor = '#00FF00';
                        landmarkColor = '#FF0000';
                    }
                    this.gestureRecognizerVideoCanvasCtx.scale(-1, 1);
                    this.gestureRecognizerDrawingUtils.drawConnectors(
                        landmark,
                        GestureRecognizer.HAND_CONNECTIONS,
                        {
                            color: connectColor,
                            lineWidth: 4,
                        }
                    );
                    this.gestureRecognizerDrawingUtils.drawLandmarks(landmark, {
                        color: connectColor,
                        lineWidth: 4,
                        fillColor: landmarkColor,
                        radius: (e) => this.getYX(e.from!.z || 0),
                    });
                });
            } else {
                this.isPrevHandDetected = false;
                this.countDetectedHand = 0;
            }
        } finally {
            this.gestureRecognizerVideoCanvasCtx.restore();
            if (this.isRunningHandGesture === true) {
                window.requestAnimationFrame(this.predictHandGesture.bind(this));
            }
        }
    }

    async predictPoseLandmarker() {
        try {
            let results;

            if (!this.poseLandmarkerVideoCanvasCtx || this.isRunningPoseLandmarker === false) {
                return;
            }
            if (this.video.readyState < 2) {
                await this.sleep();
                this.predictHandGesture();
                return;
            }
            if (this.video.currentTime !== this.lastVideoTime) {
                this.lastVideoTime = this.video.currentTime;
                const startTimeMs = performance.now();
                results = await this.poseLandmarker.detectForVideo(this.video, startTimeMs);
            } else {
                return;
            }
            this.poseLandmarkerVideoCanvasCtx.save();
            this.poseLandmarkerVideoCanvasCtx.clearRect(0, 0, this.video.width, this.video.height);

            const { landmarks } = results;
            // this.prevGestureRecognizerResult = results;
            if (landmarks.length) {
                if (!this.isPrevPoseLandmarker) {
                    this.isPrevPoseLandmarker = true;
                    Entry.engine.fireEvent('when_pose_landmarker');
                }
                // if (landmarks.length !== this.countDetectedHand) {
                //     this.countDetectedHand = landmarks.length;
                // }
                if (!this.isDrawDetectedPoseLandmarker) {
                    return;
                }

                landmarks.forEach((landmark, i) => {
                    this.poseLandmarkerDrawingUtils.drawLandmarks(landmark, {
                        radius: (data) => DrawingUtils.lerp(data.from!.z, -0.15, 0.1, 5, 1),
                    });
                    this.poseLandmarkerDrawingUtils.drawConnectors(
                        landmark,
                        PoseLandmarker.POSE_CONNECTIONS
                    );
                });
            } else {
                this.isPrevPoseLandmarker = false;
                // this.countDetectedHand = 0;
            }
        } catch (e) {
            console.error(e);
        } finally {
            this.poseLandmarkerVideoCanvasCtx.restore();
            if (this.isRunningPoseLandmarker === true) {
                window.requestAnimationFrame(this.predictPoseLandmarker.bind(this));
            }
        }
    }

    getHandPointAxis(hand: number, handPoint: number) {
        if (!this.prevGestureRecognizerResult) {
            return;
        }
        const { landmarks } = this.prevGestureRecognizerResult;
        if (!landmarks.length) {
            return;
        }
        const landmark = landmarks[hand];
        const pointAxis = landmark[handPoint];
        return {
            x: -pointAxis.x * this.STAGE_WIDTH + this.STAGE_WIDTH / 2,
            y: -pointAxis.y * this.STAGE_HEIGHT + this.STAGE_HEIGHT / 2,
            z: pointAxis.z,
        };
    }

    getHandedness(hand: number) {
        if (!this.prevGestureRecognizerResult) {
            return;
        }
        const { handednesses } = this.prevGestureRecognizerResult;
        if (!handednesses.length) {
            return;
        }
        return handednesses[hand][0];
    }

    getGesture(hand: number) {
        if (!this.prevGestureRecognizerResult) {
            return;
        }
        const { gestures } = this.prevGestureRecognizerResult;
        if (!gestures.length) {
            return;
        }
        return gestures[hand][0];
    }

    isFlipState(type: string) {
        if (type === 'horizontal') {
            return this.flipState === flipState.BOTH || this.flipState === flipState.HORIZONTAL;
        } else if (type === 'vertical') {
            return this.flipState === flipState.BOTH || this.flipState === flipState.VERTICAL;
        }
    }

    motionDetect(sprite?: any): Promise<MotionElement> {
        return new Promise(async (resolve, reject) => {
            try {
                if (!this.motionCanvas || !this.isRunning) {
                    resolve(undefined);
                    return;
                }
                if (this.video.readyState < 2) {
                    await this.sleep();
                    resolve(this.motionDetect(sprite));
                    return;
                }

                if (sprite) {
                    const returnMessage = ({ data }: MessageEvent) => {
                        if (data.action === 'sprite_return') {
                            this.motionWorker.removeEventListener('message', returnMessage);
                            resolve(data.result);
                        }
                    };
                    this.motionWorker.addEventListener('message', returnMessage);
                }
                const { STAGE_WIDTH: width, STAGE_HEIGHT: height, SAMPLE_SIZE: sampleSize } = this;
                const [minX, maxX] = [0, width];
                const [minY, maxY] = [0, height];
                const imageBitmap = await createImageBitmap(this.video);
                this.motionWorker.postMessage({
                    sprite: sprite && {
                        x: sprite.x,
                        y: sprite.y,
                        width: sprite.width,
                        height: sprite.height,
                        scaleX: sprite.scaleX,
                        scaleY: sprite.scaleY,
                    },
                    action: 'motion',
                    range: {
                        minX,
                        maxX,
                        minY,
                        maxY,
                    },
                    imageBitmap,
                });

                if (!sprite) {
                    resolve(undefined);
                }
            } catch (e) {
                console.error(e);
                reject(e);
            }
        });
    }

    reset() {
        if (this.isInitGestureRecognition) {
            this.changeDrawDetectedHand(false);
            this.stopHandGestureRecognition();
            this.prevGestureRecognizerResult = undefined;
        }
        if (this.isInitPoseLandmarker) {
            this.changeDrawDetectedPoseLandmarker(false);
            this.stopPoseLandmarker();
            this.prevPoseLandmarkerResult = undefined;
        }
        this.turnOffWebcam();
    }

    destroy() {
        this.isInitialized = false;
        console.log('destroy');
    }
}

export default singleInstance(MediaPipeUtils);
