/**
 * nt11576 Lee.Jaewon
 * commented area with "motion test" is for the motion detection testing canvas to test the computer vision, uncomment all codes labeled "motion test"
 */

import { GEHelper } from '../graphicEngine/GEHelper';
import VideoWorker from './workers/video.worker.ts';
import VideoMotionWorker from './workers/motion.worker.ts';
// type을 위해서 import
import * as posenet from '@tensorflow-models/posenet';
import clamp from 'lodash/clamp';

type FlipStatus = {
    horizontal: boolean;
    vertical: boolean;
};

type ModelStatus = {
    pose: boolean;
    face: boolean;
    object: boolean;
    warmup: boolean;
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
    // 비디오 캔버스 크기에 쓰이는 공통 밸류
    public CANVAS_WIDTH: number = 480;
    public CANVAS_HEIGHT: number = 270;

    // 카메라 입력 해상도
    private _VIDEO_WIDTH: number = 640;
    private _VIDEO_HEIGHT: number = 360;

    // 움직임 감지에 쓰이는 상수

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
        warmup: false,
    };

    public modelMountStatus: ModelStatus = {
        pose: false,
        face: false,
        object: false,
        warmup: false,
    };

    public modelRunningStatus: ModelStatus = {
        pose: false,
        face: false,
        object: false,
        warmup: false,
    };

    // motion test
    // private tempCanvas: any;
    // motion test

    // 감지된 요소들
    public motions: Pixel[][] = [...Array(this.CANVAS_HEIGHT / this._SAMPLE_SIZE)].map((e) =>
        Array(this.CANVAS_WIDTH / this._SAMPLE_SIZE)
    );
    public totalMotions: MotionElement = { total: 0, direction: { x: 0, y: 0 } };
    public objects: DetectedObject[] = [];
    public poses: {
        predictions: posenet.Pose[];
        adjacents: posenet.Keypoint[][][];
    };
    public faces: any = [];

    public isRunning = false;
    public isModelInitiated = false;
    /**
     * 아래는 faces 의 type, 너무 길고, 라이브러리에서 typed 되어 나오는 값이므로 any로 지정하였음.
     */
    // faceapi.WithFaceExpressions<
    //     faceapi.WithAge<
    //         faceapi.WithGender<
    //             faceapi.WithFaceLandmarks<
    //                 {
    //                     detection: faceapi.FaceDetection;
    //                 },
    //                 faceapi.FaceLandmarks68
    //             >
    //         >
    //     >
    // >[]

    // 로컬 스코프
    public isInitialized: boolean = false;
    public worker: Worker = new VideoWorker();
    public motionWorker: Worker = new VideoMotionWorker();
    private stream: MediaStream;
    private imageCapture: typeof ImageCapture;

    constructor() {
        this.videoOnLoadHandler = this.videoOnLoadHandler.bind(this);
    }
    async initialize() {
        if (this.isInitialized) {
            return;
        }
        await this.compatabilityChecker();

        // inMemoryCanvas라는 실제로 보이지 않는 캔버스를 이용해서 imageData 값을 추출.
        // 움직임 감지를 위한 실제 렌더되지 않는 돔
        if (!this.inMemoryCanvas) {
            this.inMemoryCanvas = document.createElement('canvas');
            this.inMemoryCanvas.width = this.CANVAS_WIDTH;
            this.inMemoryCanvas.height = this.CANVAS_HEIGHT;
        }

        // //motion test
        // this.tempCanvas = document.createElement('canvas');
        // this.tempCanvas.width = this.CANVAS_WIDTH;
        // this.tempCanvas.height = this.CANVAS_HEIGHT;
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

            this.motionWorker.onmessage = (e: { data: { type: String; message: any } }) => {
                const { type, message } = e.data;
                if (Entry.engine.state !== 'run' && type !== 'init') {
                    return;
                }
                this.totalMotions = {
                    total: message.total,
                    direction: message.direction,
                };
                this.motions = message.motions;

                if (this.isRunning) {
                    setTimeout(this.motionDetect.bind(this), 20);
                }
            };

            Entry.addEventListener('beforeStop', this.reset.bind(this));
            Entry.addEventListener('run', this.initialSetup.bind(this));

            this.worker.onmessage = (e: { data: { type: String; message: any } }) => {
                const { type, message } = e.data;
                if (Entry.engine.state !== 'run' && type !== 'init') {
                    return;
                }

                switch (type) {
                    case 'init':
                        const name: 'pose' | 'face' | 'object' | 'warmup' = message;
                        if (message === 'warmup') {
                            console.timeEnd('test');
                        } else {
                            Entry.toast.success('모델 로드', `${name} 로드 완료`, false);
                        }
                        this.modelRunningStatus[name] = true;
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
            this.motionWorker.postMessage({
                type: 'init',
                width: this.CANVAS_WIDTH,
                height: this.CANVAS_HEIGHT,
            });
            if (window.OffscreenCanvas) {
                this.worker.postMessage({
                    type: 'init',
                    width: this.CANVAS_WIDTH,
                    height: this.CANVAS_HEIGHT,
                });
                // Entry.dispatchEvent('showVideoLoadingScreen');
            } else {
                Entry.toast.alert(
                    Lang.Msgs.warn,
                    '현재 사용 환경은 비디오 블럭 모델을 지원하지 않습니다',
                    true
                );
                Entry.addEventListener('beforeStop', this.reset.bind(this));
                Entry.addEventListener('run', () => {
                    this.isRunning = true;
                    this.motionDetect(null);
                    this.video.play();
                });
            }

            const video = document.createElement('video');
            video.id = 'webCamElement';
            video.srcObject = stream;
            video.width = this.CANVAS_WIDTH;
            video.height = this.CANVAS_HEIGHT;
            video.autoplay = true;
            video.onloadedmetadata = this.videoOnLoadHandler.bind(this);

            this.stream = stream;
            this.canvasVideo = GEHelper.getVideoElement(video);
            this.video = video;
            this.isInitialized = true;
        } catch (err) {
            console.log(err);
            this.isInitialized = false;
        }
    }
    videoOnLoadHandler() {
        console.time('test');
        if (!this.flipStatus.horizontal) {
            this.setOptions('hflip', null);
        }
    }

    initialSetup() {
        console.log('initial setup');
        this.isRunning = true;
        if (window.OffscreenCanvas) {
            GEHelper.drawDetectedGraphic();
        }
        this.motionDetect(null);
        this.startDrawIndicators();
    }

    startDrawIndicators() {
        if (!this.isRunning) {
            return;
        }
        if (!window.OffscreenCanvas) {
            throw new Entry.Utils.IncompatibleError();
        }

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
        setTimeout(() => {
            requestAnimationFrame(this.startDrawIndicators.bind(this));
        }, 50);
    }
    async sendImageToWorker() {
        if (!this.isModelInitiated) {
            return;
        }
        const captured = await this.imageCapture.grabFrame();

        this.worker.postMessage({ type: 'estimate', image: captured }, [captured]);

        // //motion test
        // const tempCtx = this.tempCanvas.getContext('2d');
        // tempCtx.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);
        // this.motions.forEach((row, j) => {
        //     row.forEach((col, i) => {
        //         const { r, g, b, rDiff, gDiff, bDiff } = col;
        //         tempCtx.fillStyle = `rgb(${rDiff},${gDiff},${bDiff})`;
        //         tempCtx.fillRect(
        //             i * this._SAMPLE_SIZE,
        //             j * this._SAMPLE_SIZE,
        //             this._SAMPLE_SIZE,
        //             this._SAMPLE_SIZE
        //         );
        //     });
        // });
        // //motion test
        setTimeout(() => {
            requestAnimationFrame(this.sendImageToWorker.bind(this));
        }, 20);
    }
    /**
     * MOTION DETECT CALCULATION BASED ON COMPUTER VISION
     * @param sprite Entry Entity Object
     */
    motionDetect(sprite: any) {
        if (!this.inMemoryCanvas) {
            return;
        }
        // 움직임 감지 기본 범위는 전체 캔버스 범위
        let minX = 0;
        let maxX = this.CANVAS_WIDTH;
        let minY = 0;
        let maxY = this.CANVAS_HEIGHT;
        // 만약 오브젝트 위에 가해진 값이 필요하다면. 범위를 재 지정한다.
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
                minY = this.CANVAS_HEIGHT - maxY;
                maxY = this.CANVAS_HEIGHT - tempMinY;
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
        if (!sprite) {
            this.motionWorker.postMessage({
                type: 'motion',
                range: {
                    minX,
                    maxX,
                    minY,
                    maxY,
                },
                image: imageData,
            });
            return;
        }
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

                const xLength = this.motions[0].length;
                const yLength = this.motions.length;

                const yIndex = y / this._SAMPLE_SIZE;
                const xIndex = x / this._SAMPLE_SIZE;
                if (yIndex > yLength - 1 || xIndex > xLength - 1 || xIndex < 0 || yIndex < 0) {
                    continue;
                }
                const currentPos = this.motions[yIndex][xIndex] || { r: 0, g: 0, b: 0 };
                const rDiff = Math.abs(currentPos.r - r);
                const gDiff = Math.abs(currentPos.g - g);
                const bDiff = Math.abs(currentPos.b - b);
                const areaMotionScore =
                    rDiff + gDiff + bDiff / (this._SAMPLE_SIZE * this._SAMPLE_SIZE);

                const mostSimilar = { x: 0, y: 0, diff: 99999999 };

                /**
                 * 주변 픽셀 검사로 방향 체크, 가장 값이 비슷한 픽셀 위치로 이동했다 가정
                 * */
                // clamp를 통해서 out of bounds 검사
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
                        // 같은 포지션에 있는 픽셀에 대해서 이동하지 않았다는 전제로 가중치를 추가
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

                // 이미지 픽셀값 노이즈로 인한 부분들은 수용하지 않는다.
                if (mostSimilar.x > 1) {
                    totalMotionDirectionX += mostSimilar.x - xIndex;
                }
                if (mostSimilar.y > 1) {
                    totalMotionDirectionY += mostSimilar.y - yIndex;
                }
                areaMotion += areaMotionScore;
            }
        }

        const result = {
            total: areaMotion,
            direction: {
                x: totalMotionDirectionX,
                y: totalMotionDirectionY,
            },
        };

        return result;
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
    manageModel(target: IndicatorType, mode: String) {
        if (!this.isModelInitiated) {
            if (!window.OffscreenCanvas) {
                throw new Entry.Utils.IncompatibleError();
            }
            this.isModelInitiated = true;
            const [track] = this.stream.getVideoTracks();
            this.imageCapture = new ImageCapture(track);
            this.sendImageToWorker();
        }
        this.worker.postMessage({
            type: 'handle',
            target,
            mode,
        });
        if (mode == 'off') {
            this.modelRunningStatus[target] = false;
            this.isModelInitiated =
                this.modelRunningStatus.face ||
                this.modelRunningStatus.object ||
                this.modelRunningStatus.pose;
            if (!this.isModelInitiated) {
                this.worker.postMessage({
                    type: 'pause',
                });
            }
            this.removeIndicator(target);
        } else {
            if (!window.OffscreenCanvas) {
                throw new Entry.Utils.IncompatibleError();
            }
            this.worker.postMessage({
                type: 'run',
            });
            this.modelRunningStatus[target] = true;
        }
    }
    showIndicator(type: IndicatorType) {
        if (!window.OffscreenCanvas) {
            throw new Entry.Utils.IncompatibleError();
        }
        this.indicatorStatus[type] = true;
    }
    removeIndicator(type: IndicatorType) {
        if (!window.OffscreenCanvas) {
            throw new Entry.Utils.IncompatibleError();
        }
        if (type) {
            this.indicatorStatus[type] = false;
        }
        GEHelper.resetHandlers();
    }

    reset() {
        this.indicatorStatus = {
            pose: false,
            face: false,
            object: false,
            warmup: null,
        };
        this.disableAllModels();
        GEHelper.resetHandlers();
        this.turnOffWebcam();
        if (!this.flipStatus.horizontal) {
            this.setOptions('hflip', null);
        }
        if (this.flipStatus.vertical) {
            this.setOptions('vflip', null);
        }

        GEHelper.setVideoAlpha(this.canvasVideo, 50);

        this.poses = { predictions: [], adjacents: [] };
        this.faces = [];
        this.objects = [];
        this.isRunning = false;
        this.isModelInitiated = false;
    }

    // videoUtils.destroy does not actually destroy singletonClass, but instead resets the whole stuff except models to be used
    destroy() {
        this.disableAllModels();
        this.turnOffWebcam();
        try {
            this.stream.getTracks().forEach((track) => {
                track.stop();
            });
            this.worker.terminate();
        } catch (err) {
            console.log(err);
        }

        this.video = null;
        this.canvasVideo = null;
        this.inMemoryCanvas = null;
        this.flipStatus = {
            horizontal: false,
            vertical: false,
        };
        this.objects = [];
        this.poses = { predictions: [], adjacents: [] };
        this.faces = [];
        this.isInitialized = false;
    }

    disableAllModels() {
        this.worker.postMessage({
            type: 'handleOff',
        });
    }

    async compatabilityChecker() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Entry.Utils.IncompatibleError();
        }
        if (!this.stream) {
            if (!this.checkUserCamAvailable()) {
                throw new Entry.Utils.IncompatibleError('IncompatibleError', [
                    Lang.Workspace.check_webcam_error,
                ]);
            }
        }
    }
    async checkUserCamAvailable() {
        try {
            await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                    facingMode: 'user',
                    width: this._VIDEO_WIDTH,
                    height: this._VIDEO_HEIGHT,
                },
            });
            return true;
        } catch (err) {
            return false;
        }
    }
}

export default new VideoUtils();
