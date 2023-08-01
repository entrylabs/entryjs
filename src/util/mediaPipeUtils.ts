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

class MediaPipeUtils {
    public isInitialized: boolean = false;
    public videoInputList: string[][] = [];
    public canvasVideo: PIXI.Sprite | createjs.Bitmap;
    public canvasOverlay: PIXI.Sprite | createjs.Bitmap;
    public video: HTMLVideoElement;
    public inMemoryCanvas: HTMLCanvasElement;
    public inMemoryCanvasCtx: CanvasRenderingContext2D;
    private VIDEO_WIDTH: number = 640;
    private VIDEO_HEIGHT: number = 360;
    private stream: MediaStream;
    private lastVideoTime: number = -1;
    private grResult: GestureRecognizerResult;
    private gestureRecognizer: GestureRecognizer;
    private drawingUtils: DrawingUtils;
    private worker: Worker;

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
        this.inMemoryCanvasCtx = this.inMemoryCanvas.getContext('2d') as CanvasRenderingContext2D;
        this.drawingUtils = new DrawingUtils(this.inMemoryCanvasCtx);
        const video = document.createElement('video');
        video.id = 'webCamElement';
        video.autoplay = true;
        video.width = this.VIDEO_WIDTH;
        video.height = this.VIDEO_HEIGHT;
        this.canvasVideo = GEHelper.getVideoElement(video);
        this.canvasOverlay = GEHelper.getOverlayElement(this.inMemoryCanvas);
        this.video = video;
        this.worker = new Worker('/lib/entry-js/extern/vision.worker.js');

        Entry.addEventListener('beforeStop', this.reset.bind(this));
        this.isInitialized = true;
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
                // webcamElement.removeEventListener('loadeddata', predictWebcam);
                track.stop();
            });
            window.requestAnimationFrame(() => {
                this.video.srcObject = null;
                this.stream = undefined;
                // canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
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
        GEHelper.drawVideoElement(this.canvasVideo);
        GEHelper.drawOverlayElement(this.canvasOverlay);
    }

    async startHandGestureRecognition() {
        if (!this.stream) {
            await this.turnOnWebcam();
        }
        // const vision = await FilesetResolver.forVisionTasks('/lib/entry-js/extern/wasm');
        // this.gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
        //     baseOptions: {
        //         modelAssetPath: '/lib/entry-js/extern/model/gesture_recognizer.task',
        //         delegate: 'GPU',
        //     },
        //     runningMode: 'VIDEO',
        //     numHands: 2,
        // });

        this.predictWebcam();
        // this.video.addEventListener('loadeddata', this.predictWebcam);
    }

    async stopHandGestureRecognition() {
        // if (!this.stream) {
        //     await this.turnOnWebcam();
        // }
        // this.predictWebcam();
        // this.video.addEventListener('loadeddata', this.predictWebcam);
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

    predictWebcam() {
        this.worker.postMessage({ action: 'gesture_recognizer' });
    }

    reset() {
        this.turnOffWebcam();
    }

    destroy() {
        this.isInitialized = false;
        console.log('destroy');

        // webcamElement.removeEventListener('loadeddata', predictWebcam);
    }
}

export default singleInstance(MediaPipeUtils);
