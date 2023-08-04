import singleInstance from '../core/singleInstance';
import { GEHelper } from '../graphicEngine/GEHelper';
import {
    FilesetResolver,
    GestureRecognizer,
    GestureRecognizerResult,
    DrawingUtils,
} from '@mediapipe/tasks-vision';
import { UAParser } from 'ua-parser-js';

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
    public inMemoryCanvas: HTMLCanvasElement;
    public inMemoryCanvasCtx: CanvasRenderingContext2D;
    public isRunningHandGesture: boolean;
    public canWorker: boolean = true;
    public flipState: TFlipState = 0;
    public isDrawDetectedHand: boolean = false;
    public isPrevHandDetected: boolean = false;
    public countDetectedHand: number;
    private VIDEO_WIDTH: number = 640;
    private VIDEO_HEIGHT: number = 360;
    private stream: MediaStream;
    private lastVideoTime: number = -1;
    private grResult: GestureRecognizerResult;
    private gestureRecognizer: GestureRecognizer;
    private drawingUtils: DrawingUtils;
    private worker: Worker;
    private inOffscreenCanvas: OffscreenCanvas;
    private alreadyInitOffscreenCanvas: boolean;
    private sourceTarget: number;

    constructor() {
        const uaResult = parser.getResult();
        if (uaResult.browser.name === 'Safari' || uaResult.os.name === 'iOS') {
            this.canWorker = false;
        }
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
        this.inMemoryCanvas = document.createElement('canvas');
        this.inMemoryCanvas.width = this.VIDEO_WIDTH;
        this.inMemoryCanvas.height = this.VIDEO_HEIGHT;
        const video = document.createElement('video');
        video.id = 'webCamElement';
        video.autoplay = true;
        video.width = this.VIDEO_WIDTH;
        video.height = this.VIDEO_HEIGHT;
        this.canvasVideo = GEHelper.getVideoElement(video);
        this.canvasOverlay = GEHelper.getOverlayElement(this.inMemoryCanvas);
        GEHelper.hFlipVideoElement([this.canvasVideo, this.canvasOverlay] as
            | PIXI.Sprite[]
            | createjs.Bitmap[]);
        this.video = video;

        if (this.canWorker) {
            this.inOffscreenCanvas = this.inMemoryCanvas.transferControlToOffscreen();
            this.worker = new Worker('/lib/entry-js/extern/vision.worker.js');
            this.initWorkerEvent();
        } else {
            this.inMemoryCanvasCtx = this.inMemoryCanvas.getContext('2d');
            this.inMemoryCanvasCtx.font = '20px Arial';
            this.drawingUtils = new DrawingUtils(this.inMemoryCanvasCtx);
        }

        Entry.addEventListener('beforeStop', this.reset.bind(this));
        this.isInitialized = true;
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

    initWorkerEvent() {
        this.worker.onmessage = ({ data }) => {
            if (['next_gesture_recognizer'].includes(data.action)) {
                this.sendImageBitmapForGesture();
            } else if (data.action === 'start_gesture_recognizer') {
                this.isPrevHandDetected = true;
                Entry.engine.fireEvent('when_hand_detection');
            } else if (data.action === 'stop_gesture_recognizer') {
                this.isPrevHandDetected = false;
            } else if (data.action === 'count_detected_hand_gesture_recognizer') {
                this.countDetectedHand = data.count;
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
        this.worker.postMessage({
            action: 'gesture_recognizer',
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
        const canvasVideos = [this.canvasVideo, this.canvasOverlay] as
            | PIXI.Sprite[]
            | createjs.Bitmap[];
        const action = flipActions[prevState][nextState];
        if (action) {
            action(canvasVideos);
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
        this.video.play();
        GEHelper.drawVideoElement(this.canvasVideo);
        GEHelper.drawOverlayElement(this.canvasOverlay);
    }

    async startHandGestureRecognition() {
        try {
            if (!this.stream) {
                await this.turnOnWebcam();
            }
            this.isRunningHandGesture = true;

            if (this.canWorker) {
                if (!this.alreadyInitOffscreenCanvas) {
                    this.worker.postMessage(
                        {
                            action: 'gesture_recognizer_init',
                            canvas: this.inOffscreenCanvas,
                            option: {
                                isDrawDetectedHand: this.isDrawDetectedHand,
                            },
                        },
                        [this.inOffscreenCanvas]
                    );
                    this.alreadyInitOffscreenCanvas = true;
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

    changeDrawDetectedHand(isDrawDetectedHand: boolean) {
        this.isDrawDetectedHand = isDrawDetectedHand;
        this.updateHandGestureRecognition();
    }

    updateHandGestureRecognition() {
        if (this.canWorker) {
            this.worker.postMessage({
                action: 'gesture_recognizer_change_option',
                option: {
                    isDrawDetectedHand: this.isDrawDetectedHand,
                },
            });
        }
    }

    async stopHandGestureRecognition() {
        this.isRunningHandGesture = false;
        this.isPrevHandDetected = false;
        this.countDetectedHand = 0;
        if (this.canWorker) {
            this.worker.postMessage({
                action: 'clear_gesture_recognizer',
            });
        } else {
            this.inMemoryCanvasCtx.clearRect(0, 0, this.video.width, this.video.height);
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

    async predictHandGesture() {
        try {
            const nowInMs = Date.now();
            let results;

            if (!this.inMemoryCanvasCtx || this.isRunningHandGesture === false) {
                return;
            }
            if (this.video.readyState < 2) {
                await this.sleep();
                this.predictHandGesture();
                return;
            }
            if (this.video.currentTime !== this.lastVideoTime) {
                this.lastVideoTime = this.video.currentTime;
                results = this.gestureRecognizer.recognizeForVideo(this.video, nowInMs);
            } else {
                return;
            }
            this.inMemoryCanvasCtx.save();
            this.inMemoryCanvasCtx.clearRect(0, 0, this.video.width, this.video.height);

            const { landmarks, handednesses } = results;
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
                    this.inMemoryCanvasCtx.scale(-1, 1);
                    if (handedness.categoryName === 'Left') {
                        this.inMemoryCanvasCtx.fillStyle = '#FF0000';
                        this.inMemoryCanvasCtx.fillText(
                            `${i + 1}-오른손`,
                            -mark12.x * 640,
                            mark12.y * 360 - 20
                        );
                        connectColor = '#FF0000';
                        landmarkColor = '#00FF00';
                    } else {
                        this.inMemoryCanvasCtx.fillStyle = '#00FF00';
                        this.inMemoryCanvasCtx.fillText(
                            `${i + 1}-왼손`,
                            -mark12.x * 640,
                            mark12.y * 360 - 20
                        );
                        connectColor = '#00FF00';
                        landmarkColor = '#FF0000';
                    }
                    this.inMemoryCanvasCtx.scale(-1, 1);
                    this.drawingUtils.drawConnectors(landmark, GestureRecognizer.HAND_CONNECTIONS, {
                        color: connectColor,
                        lineWidth: 4,
                    });
                    this.drawingUtils.drawLandmarks(landmark, {
                        color: connectColor,
                        lineWidth: 4,
                        fillColor: landmarkColor,
                        radius: (e) => this.getYX(e.from?.z || 0),
                    });
                });
            } else {
                this.isPrevHandDetected = false;
                this.countDetectedHand = 0;
            }
        } finally {
            this.inMemoryCanvasCtx.restore();
            if (this.isRunningHandGesture === true) {
                window.requestAnimationFrame(this.predictHandGesture.bind(this));
            }
        }
    }

    reset() {
        this.changeDrawDetectedHand(false);
        this.stopHandGestureRecognition();
        this.turnOffWebcam();
    }

    destroy() {
        this.isInitialized = false;
        console.log('destroy');
    }
}

export default singleInstance(MediaPipeUtils);
