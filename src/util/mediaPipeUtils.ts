import singleInstance from '../core/singleInstance';
import { GEHelper } from '../graphicEngine/GEHelper';
import {
    FilesetResolver,
    GestureRecognizer,
    GestureRecognizerResult,
    DrawingUtils,
} from '@mediapipe/tasks-vision';

export const getInputList = async () => {
    if (navigator.mediaDevices) {
        return (await navigator.mediaDevices.enumerateDevices()) || [];
    }
    return [];
};

import { UAParser } from 'ua-parser-js';

const parser = new UAParser();

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
    private VIDEO_WIDTH: number = 640;
    private VIDEO_HEIGHT: number = 360;
    private stream: MediaStream;
    private lastVideoTime: number = -1;
    private grResult: GestureRecognizerResult;
    private gestureRecognizer: GestureRecognizer;
    private drawingUtils: DrawingUtils;
    private worker: Worker;
    inOffscreenCanvas: OffscreenCanvas;
    once: boolean;

    constructor() {
        const uaResult = parser.getResult();
        console.log('uaResult', uaResult, uaResult.browser.name, uaResult.os.name);
        if (uaResult.browser.name === 'Safari' || uaResult.os.name === 'iOS') {
            this.canWorker = false;
        }
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
        this.video = video;

        if (this.canWorker) {
            this.inOffscreenCanvas = this.inMemoryCanvas.transferControlToOffscreen();
            this.worker = new Worker('/lib/entry-js/extern/vision.worker.js');
            this.initWorkerEvent();
        } else {
            this.inMemoryCanvasCtx = this.inMemoryCanvas.getContext('2d');
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
            }
        };
    }

    async sendImageBitmapForGesture() {
        console.log('run sendImageBitmapForGesture');
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

    cameraSwitch(mode: String) {
        if (mode === 'on') {
            this.turnOnWebcam();
        } else {
            this.turnOffWebcam();
        }
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
    }

    async turnOnWebcam() {
        let stream;
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    deviceId: { exact: this.videoInputList[0][1] },
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
                if (!this.once) {
                    this.worker.postMessage(
                        {
                            action: 'gesture_recognizer_init',
                            canvas: this.inOffscreenCanvas,
                        },
                        [this.inOffscreenCanvas]
                    );
                    this.once = true;
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

    async stopHandGestureRecognition() {
        this.isRunningHandGesture = false;
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
        }

        this.inMemoryCanvasCtx.save();
        this.inMemoryCanvasCtx.clearRect(0, 0, this.video.width, this.video.height);

        const { landmarks, handednesses } = results;
        if (landmarks) {
            landmarks.forEach((landmark, i) => {
                let connectColor;
                let landmarkColor;
                const [handedness] = handednesses[i];
                if (handedness.categoryName === 'Left') {
                    connectColor = '#FF0000';
                    landmarkColor = '#00FF00';
                } else {
                    connectColor = '#00FF00';
                    landmarkColor = '#FF0000';
                }
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
        }
        this.inMemoryCanvasCtx.restore();
        if (this.isRunningHandGesture === true) {
            window.requestAnimationFrame(this.predictHandGesture.bind(this));
        }
    }

    reset() {
        this.stopHandGestureRecognition();
        this.turnOffWebcam();
    }

    destroy() {
        this.isInitialized = false;
        console.log('destroy');
    }
}

export default singleInstance(MediaPipeUtils);
