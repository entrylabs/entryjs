/**
 * nt11576 Lee.Jaewon
 * commented area with "motion test" is for the motion detection testing canvas to test the computer vision, uncomment all codes labeled "motion test"
 */

import { GEHelper } from '../graphicEngine/GEHelper';
import VideoWorker from './workers/video.worker.ts';
import { clamp } from 'lodash';

type FlipStatus = {
    horizontal: boolean;
    vertical: boolean;
};

type ModelStatus = {
    pose: boolean;
    face: boolean;
    object: boolean;
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

type DetectedObject = {
    bbox: Array<number>;
    class: String;
};
type IndicatorType = 'pose' | 'face' | 'object';

class VideoUtils implements MediaUtilsInterface {
    // canvasVideo SETTING, used in all canvas'
    public CANVAS_WIDTH: number = 480;
    public CANVAS_HEIGHT: number = 270;
    // webcam input resolution setting
    private _VIDEO_WIDTH: number = 640;
    private _VIDEO_HEIGHT: number = 360;

    //MotionDetection Constants
    private _SAMPLE_SIZE: number = 15;
    private _BOUNDARY_OFFSET: number = 4;
    private _SAME_COORDINATE_COMPENSATION: number = 10; // assumption weight that there is no movement within frame

    public video: HTMLVideoElement;
    public canvasVideo: PIXI.Sprite | createjs.Bitmap;
    public inMemoryCanvas: HTMLCanvasElement;

    public flipStatus: FlipStatus = {
        horizontal: false,
        vertical: false,
    };
    public indicatorStatus: ModelStatus = {
        pose: false,
        face: false,
        object: false,
    };

    // detected parts
    public motions: Pixel[][] = [...Array(this.CANVAS_HEIGHT / this._SAMPLE_SIZE)].map((e) =>
        Array(this.CANVAS_WIDTH / this._SAMPLE_SIZE)
    );
    public totalMotions: MotionElement = { total: 0, direction: { x: 0, y: 0 } };
    public objects: DetectedObject[] = [];
    public poses: {
        predictions: any[];
        adjacents: any[];
    };
    public faces: any[] = [];

    public isInitialized: boolean = false;
    public worker: Worker = new VideoWorker();
    private stream: MediaStream;
    private imageCapture: any; // capturing class ImageCapture

    constructor() {
        this.videoOnLoadHandler = this.videoOnLoadHandler.bind(this);
    }
    async initialize() {
        if (this.isInitialized) {
            return;
        }
        await this.compatabilityChecker();
        this.isInitialized = true;

        // this canvas is for motion calculation
        if (!this.inMemoryCanvas) {
            this.inMemoryCanvas = document.createElement('canvas');
            this.inMemoryCanvas.width = this.CANVAS_WIDTH;
            this.inMemoryCanvas.height = this.CANVAS_HEIGHT;
        }

        // //motion test
        // this.tempCanvas = document.createElement('canvas');
        // this.tempCanvas.width = CANVAS_WIDTH;
        // this.tempCanvas.height = CANVAS_HEIGHT;
        // const tempTarget = document.getElementsByClassName('uploadInput')[0];
        // tempTarget.parentNode.insertBefore(this.tempCanvas, tempTarget);
        // //motion test

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                    facingMode: 'user',
                    width: this._VIDEO_WIDTH,
                    height: this._VIDEO_HEIGHT,
                },
            });

            this.stream = stream;
            const video = document.createElement('video');
            video.srcObject = stream;
            video.width = this.CANVAS_WIDTH;
            video.height = this.CANVAS_HEIGHT;
            this.canvasVideo = GEHelper.getVideoElement(video);
            this.video = video;
            video.onloadedmetadata = this.videoOnLoadHandler;
        } catch (err) {
            console.log(err);
            this.isInitialized = false;
        }
    }
    videoOnLoadHandler() {
        Entry.addEventListener('beforeStop', this.reset.bind(this));
        this.video.play();
        this.startDrawIndicators();
        this.turnOnWebcam();
        const [track] = this.stream.getVideoTracks();
        this.imageCapture = new ImageCapture(track);

        this.worker.onmessage = (e: { data: { type: String; message: Array<any> | any } }) => {
            const { type, message } = e.data;
            if (Entry.engine.state !== 'run' && type !== 'init') {
                return;
            }
            switch (type) {
                case 'init':
                    break;
                case 'face':
                    this.faces = message;
                    break;
                case 'coco':
                    this.objects = message;
                    break;
                case 'pose':
                    this.poses = message;
                    break;
            }
        };

        this.worker.postMessage({
            type: 'init',
            width: this.CANVAS_WIDTH,
            height: this.CANVAS_HEIGHT,
        });
        this.sendImageToWorker();
        this.motionDetect(null);
    }
    startDrawIndicators() {
        if (this.objects && this.indicatorStatus.object) {
            GEHelper.drawObjectBox(this.objects, this.flipStatus);
        }
        if (this.faces && this.indicatorStatus.face) {
            GEHelper.drawFaceEdges(this.faces, this.flipStatus);
        }
        if (this.poses && this.indicatorStatus.pose) {
            GEHelper.drawHumanPoints(this.poses.predictions, this.flipStatus);
            GEHelper.drawHumanSkeletons(this.poses.adjacents, this.flipStatus);
        }
        requestAnimationFrame(this.startDrawIndicators.bind(this));
    }
    async sendImageToWorker() {
        const captured = await this.imageCapture.grabFrame();
        this.worker.postMessage({ type: 'estimate', image: captured }, [captured]);

        // //motion test
        // const tempCtx = this.tempCanvas.getContext('2d');
        // tempCtx.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);
        // this.motions.forEach((row, j) => {
        //     row.forEach((col, i) => {
        //         const { r, g, b, rDiff, gDiff, bDiff } = col;
        //         tempCtx.fillStyle = `rgb(${rDiff},${gDiff},${bDiff})`;
        //         tempCtx.fillRect(i * SAMPLE_SIZE, j * SAMPLE_SIZE, SAMPLE_SIZE, SAMPLE_SIZE);
        //     });
        // });
        // //motion test
        setTimeout(() => {
            requestAnimationFrame(this.sendImageToWorker.bind(this));
        }, 50);
    }
    /**
     * MOTION DETECT CALCULATION BASED ON COMPUTER VISION
     * @param sprite Entry Entity Object
     */
    motionDetect(sprite: any) {
        if (!this.inMemoryCanvas) {
            return;
        }
        let minX = 0;
        let maxX = this.CANVAS_WIDTH;
        let minY = 0;
        let maxY = this.CANVAS_HEIGHT;

        if (sprite) {
            const { x, y, width, height, scaleX, scaleY } = sprite;
            minX = this.CANVAS_WIDTH / 2 + x - (width * scaleX) / 2;
            maxX = this.CANVAS_WIDTH / 2 + x + (width * scaleX) / 2;
            minY = this.CANVAS_HEIGHT / 2 - y - (height * scaleY) / 2;
            maxY = this.CANVAS_HEIGHT / 2 - y + (height * scaleY) / 2;
            if (this.flipStatus.horizontal) {
                const tempMinX = minX;
                minX = this.CANVAS_WIDTH - maxX;
                maxX = this.CANVAS_WIDTH - tempMinX;
            }
            if (this.flipStatus.vertical) {
                const tempMinY = minY;
                minY = this.CANVAS_WIDTH - maxY;
                maxY = this.CANVAS_WIDTH - tempMinY;
            }
            minX = Math.floor(minX / this._SAMPLE_SIZE) * this._SAMPLE_SIZE;
            maxX = Math.floor(maxX / this._SAMPLE_SIZE) * this._SAMPLE_SIZE;
            minY = Math.floor(minY / this._SAMPLE_SIZE) * this._SAMPLE_SIZE;
            maxY = Math.floor(maxY / this._SAMPLE_SIZE) * this._SAMPLE_SIZE;
        }

        const context = this.inMemoryCanvas.getContext('2d');
        context.clearRect(0, 0, this.inMemoryCanvas.width, this.inMemoryCanvas.height);
        context.drawImage(this.video, 0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
        const imageData = context.getImageData(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
        const data = imageData.data;
        let areaMotion = 0;
        let totalMotionDirectionX = 0;
        let totalMotionDirectionY = 0;
        for (let y = minY; y < maxY; y += this._SAMPLE_SIZE) {
            for (let x = minX; x < maxX; x += this._SAMPLE_SIZE) {
                const pos = (x + y * this.CANVAS_WIDTH) * 4;
                const r = data[pos];
                const g = data[pos + 1];
                const b = data[pos + 2];
                // const a = data[pos + 3];
                // diffScheme;
                const yIndex = y / this._SAMPLE_SIZE;
                const xIndex = x / this._SAMPLE_SIZE;
                const currentPos = this.motions[yIndex][xIndex] || { r: 0, g: 0, b: 0 };
                const rDiff = Math.abs(currentPos.r - r);
                const gDiff = Math.abs(currentPos.g - g);
                const bDiff = Math.abs(currentPos.b - b);
                const areaMotionScore =
                    rDiff + gDiff + bDiff / (this._SAMPLE_SIZE * this._SAMPLE_SIZE);

                const xLength = this.motions[0].length;
                const yLength = this.motions.length;
                const mostSimilar = { x: 0, y: 0, diff: 99999999 };

                const minScanY = clamp(yIndex - this._BOUNDARY_OFFSET, 0, yLength - 1);
                const maxScanY = clamp(yIndex + this._BOUNDARY_OFFSET, 0, yLength - 1);
                const minScanX = clamp(xIndex - this._BOUNDARY_OFFSET, 0, xLength - 1);
                const maxScanX = clamp(xIndex + this._BOUNDARY_OFFSET, 0, xLength - 1);
                for (let scopeY = minScanY; scopeY <= maxScanY; scopeY++) {
                    for (let scopeX = minScanX; scopeX <= maxScanX; scopeX++) {
                        const valuesNearPos = this.motions[scopeY][scopeX] || {
                            r: 0,
                            g: 0,
                            b: 0,
                        };
                        const rDiffScope = Math.abs(valuesNearPos.r - r);
                        const gDiffScope = Math.abs(valuesNearPos.g - g);
                        const bDiffScope = Math.abs(valuesNearPos.b - b);
                        let diff = rDiffScope + gDiffScope + bDiffScope;
                        // compensation only if scope is looking for the same coordination in case of reducing noise when no movement has been detected.
                        if (yIndex === scopeY && xIndex === scopeX) {
                            diff = diff - this._SAME_COORDINATE_COMPENSATION;
                        }
                        if (diff < mostSimilar.diff) {
                            mostSimilar.x = scopeX;
                            mostSimilar.y = scopeY;
                            mostSimilar.diff = diff;
                        }
                    }
                }

                //reduce noise of small motions
                if (mostSimilar.x > 1) {
                    totalMotionDirectionX += mostSimilar.x - xIndex;
                }
                if (mostSimilar.y > 1) {
                    totalMotionDirectionY += mostSimilar.y - yIndex;
                }
                if (sprite) {
                    continue;
                }
                areaMotion += areaMotionScore;
                this.motions[yIndex][xIndex] = {
                    r,
                    g,
                    b,
                    rDiff,
                    gDiff,
                    bDiff,
                };
            }
        }
        const result = {
            total: areaMotion,
            direction: {
                x: totalMotionDirectionX,
                y: totalMotionDirectionY,
            },
        };
        if (sprite) {
            return result;
        }

        this.totalMotions = result;
        setTimeout(this.motionDetect.bind(this), 200);
    }

    cameraSwitch(mode: String) {
        switch (mode) {
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
            this.setOptions('hflip', null);
        }
    }
    setOptions(target: String, value: number) {
        if (!this.canvasVideo) {
            return;
        }
        switch (target) {
            case 'brightness':
                GEHelper.setVideoBrightness(this.canvasVideo, value);
                break;
            case 'transparency':
                GEHelper.setVideoAlpha(this.canvasVideo, value);
                break;
            case 'hflip':
                this.flipStatus.horizontal = !this.flipStatus.horizontal;
                this.worker.postMessage({
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
    manageModel(target: String, mode: String) {
        this.worker.postMessage({
            type: 'handle',
            target,
            mode,
        });
    }
    showIndicator(type: IndicatorType) {
        this.indicatorStatus[type] = true;
    }
    removeIndicator(type: IndicatorType) {
        this.indicatorStatus[type] = false;
        GEHelper.resetHandlers();
    }

    reset() {
        this.indicatorStatus = {
            pose: false,
            face: false,
            object: false,
        };
        this.disableAllModels();
        GEHelper.resetHandlers();
        this.turnOnWebcam();
        if (!this.flipStatus.horizontal) {
            this.setOptions('hflip', null);
        }
        if (this.flipStatus.vertical) {
            this.setOptions('vflip', null);
        }

        GEHelper.resetCanvasBrightness(this.canvasVideo);
        GEHelper.setVideoAlpha(this.canvasVideo, 50);
        GEHelper.tickByEngine();

        this.poses = { predictions: [], adjacents: [] };
        this.faces = [];
        this.objects = [];
    }

    // videoUtils.destroy does not actually destroy singletonClass, but instead resets the whole stuff except models to be used
    destroy() {
        this.disableAllModels();
        this.turnOffWebcam();
        this.stream.getTracks().forEach((track) => {
            track.stop();
        });
        this.worker.terminate();
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
    disableAllModels() {
        this.worker.postMessage({
            type: 'handleOff',
        });
    }

    async compatabilityChecker() {
        if (!navigator.getUserMedia) {
            throw new Entry.Utils.IncompatibleError();
        }
        if (!this.stream) {
            try {
                await navigator.mediaDevices.getUserMedia({
                    audio: false,
                    video: {
                        facingMode: 'user',
                        width: this._VIDEO_WIDTH,
                        height: this._VIDEO_HEIGHT,
                    },
                });
            } catch (err) {
                throw new Entry.Utils.IncompatibleError('IncompatibleError', [
                    Lang.Workspace.check_webcam_error,
                ]);
            }
        }
    }
}

export default new VideoUtils();
