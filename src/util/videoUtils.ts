/**
 * nt11576 Lee.Jaewon
 * commented area with "motion test" is for the motion detection testing canvas to test the computer vision, uncomment all codes labeled "motion test"
 */

import { GEHelper } from '../graphicEngine/GEHelper';
import VideoWorker from './workers/video.worker.ts';
import VideoMotionWorker from './workers/motion.worker.ts';
// type을 위해서 import
import * as posenet from '@tensorflow-models/posenet';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as faceapi from 'face-api.js';

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

export const getInputList = async () => {
    if (navigator.mediaDevices) {
        return (await navigator.mediaDevices.enumerateDevices()) || [];
    }
    return [];
};

class VideoUtils implements MediaUtilsInterface {
    // 비디오 캔버스 크기에 쓰이는 공통 밸류
    public CANVAS_WIDTH: number = 480;
    public CANVAS_HEIGHT: number = 270;

    // 카메라 입력 해상도
    private _VIDEO_WIDTH: number = 640;
    private _VIDEO_HEIGHT: number = 360;

    private tinyFaceDetectOption = new faceapi.TinyFaceDetectorOptions({ inputSize: 160 });

    // 움직임 감지에 쓰이는 상수
    private _SAMPLE_SIZE: number = 15;
    private _BOUNDARY_OFFSET: number = 4;
    private _SAME_COORDINATE_COMPENSATION: number = 10; // assumption weight that there is no movement within frame

    public video: HTMLVideoElement;
    public canvasVideo: PIXI.Sprite | createjs.Bitmap;
    public inMemoryCanvas: HTMLCanvasElement;

    private captureTimeout: any = null;
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
    public mobileNet: posenet.MobileNet;
    public coco: any;
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
    public worker: Worker;
    public isChrome = window.OffscreenCanvas || false;
    public isFirefox = typeof InstallTrigger !== 'undefined';
    public motionWorker: Worker = new VideoMotionWorker();
    private stream: MediaStream;
    private imageCapture: typeof ImageCapture;
    private isFront = true;
    private initializing: boolean = false;
    public videoInputList: string[][] = [];

    constructor() {
        this.videoOnLoadHandler = this.videoOnLoadHandler.bind(this);
    }

    // issue 12160 bug , 강제로 usermedia를 가져오도록 하기 위함 enumerateDevices자체로는 권한 요청을 하지 않음
    async checkPermission() {
        if (navigator.permissions) {
            const permission = await navigator.permissions.query({ name: 'camera' });
            console.log('camera state', permission.state);
            if (permission.state !== 'granted') {
                await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
            }
        } else {
            await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
        }
    }

    async initialize() {
        if (this.initializing) {
            return;
        }
        this.initializing = true;
        try {
            await this._initialize();
        } finally {
            this.initializing = false;
        }
    }

    async _initialize() {
        if (this.isInitialized) {
            return;
        }
        await this.checkPermission();
        const inputList = await getInputList();
        this.videoInputList = inputList
            .filter((input) => input.kind === 'videoinput' && input.deviceId)
            .map((item) => [item.label, item.deviceId]);
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
        if (this.isFirefox) {
            this._VIDEO_HEIGHT = 480;
            this.CANVAS_HEIGHT = 360;
        }
        let stream;
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                    deviceId: { exact: this.videoInputList[0][1] },
                    width: this._VIDEO_WIDTH,
                    height: this._VIDEO_HEIGHT,
                },
            });
        } catch (err) {
            throw new Entry.Utils.IncompatibleError('IncompatibleError', [
                Lang.Workspace.check_webcam_error,
            ]);
        }

        try {
            if (!this.motionWorker) {
                this.motionWorker = new VideoMotionWorker();
            }
            /*
                NT11576  #11683
                파이어폭스는 기본적으로 4:3비율로만 비디오를 가져오게 되어있어서, 사이즈를 조절해야함. 
                이로인해 다른 브라우저에 비해서 잘려보임
            */
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
            this.motionWorker.postMessage({
                type: 'init',
                width: this.CANVAS_WIDTH,
                height: this.CANVAS_HEIGHT,
            });
            console.time('test');
            if (this.isChrome) {
                if (!this.worker) {
                    this.worker = new VideoWorker();
                }
                this.worker.onmessage = (e: { data: { type: String; message: any } }) => {
                    const { type, message } = e.data;
                    if (Entry.engine.state !== 'run' && type !== 'init') {
                        return;
                    }
                    const name: 'pose' | 'face' | 'object' | 'warmup' = message;
                    const modelLang = Lang.Blocks[`video_${name}_model`];

                    switch (type) {
                        case 'init':
                            if (message === 'warmup') {
                                Entry.toast.success(
                                    Lang.Msgs.video_model_load_success,
                                    Lang.Msgs.video_model_load_completed,
                                    true
                                );
                                Entry.dispatchEvent('hideLoadingScreen');
                                console.timeEnd('test');
                            } else {
                                Entry.toast.success(
                                    Lang.Msgs.video_model_load_success,
                                    `${modelLang} ${Lang.Msgs.video_model_load_success}`,
                                    false
                                );
                            }
                            this.modelMountStatus[name] = true;
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
                const weightsUrl = this.getWeightUrl();
                this.worker.postMessage({
                    weightsUrl: weightsUrl,
                    type: 'init',
                    width: this.CANVAS_WIDTH,
                    height: this.CANVAS_HEIGHT,
                });
                Entry.dispatchEvent('showVideoLoadingScreen');
            } else {
                const weightsUrl = `${window.location.origin}/lib/entry-js/weights`;
                Entry.dispatchEvent('showVideoLoadingScreen');
                Promise.all([
                    Promise.all([
                        faceapi.nets.tinyFaceDetector.loadFromUri(weightsUrl),
                        faceapi.nets.faceLandmark68Net.loadFromUri(weightsUrl),
                        faceapi.nets.ageGenderNet.loadFromUri(weightsUrl),
                        faceapi.nets.faceExpressionNet.loadFromUri(weightsUrl),
                    ]).then(() => {
                        Entry.toast.success(
                            Lang.Msgs.video_model_load_success,
                            `${Lang.Blocks.video_face_model} ${Lang.Msgs.video_model_load_success}`,
                            false
                        );
                    }),
                    cocoSsd
                        .load({
                            base: 'lite_mobilenet_v2',
                        })
                        .then((cocoLoaded: any) => {
                            this.coco = cocoLoaded;
                            Entry.toast.success(
                                Lang.Msgs.video_model_load_success,
                                // eslint-disable-next-line
                                `${Lang.Blocks.video_object_model} ${Lang.Msgs.video_model_load_success}`,
                                false
                            );
                            console.timeEnd('test');
                        }),
                    posenet
                        .load({
                            architecture: 'MobileNetV1',
                            outputStride: 16,
                            inputResolution: {
                                width: this.CANVAS_WIDTH,
                                height: this.CANVAS_HEIGHT,
                            },
                            multiplier: 0.5,
                        })
                        .then((mobileNetLoaded: any) => {
                            this.mobileNet = mobileNetLoaded;
                            Entry.toast.success(
                                Lang.Msgs.video_model_load_success,
                                // eslint-disable-next-line
                                `${Lang.Blocks.video_pose_model} ${Lang.Msgs.video_model_load_success}`,
                                false
                            );
                        }),
                ]).then(() => {
                    Entry.toast.success(
                        Lang.Msgs.video_model_load_success,
                        Lang.Msgs.video_model_load_completed,
                        true
                    );
                    Entry.dispatchEvent('hideLoadingScreen');
                });
            }

            const video = document.createElement('video');
            video.id = 'webCamElement';
            video.autoplay = true;
            video.srcObject = stream;
            video.width = this.CANVAS_WIDTH;
            video.height = this.CANVAS_HEIGHT;

            video.onloadedmetadata = this.videoOnLoadHandler.bind(this);
            this.stream = stream;
            this.canvasVideo = GEHelper.getVideoElement(video);
            this.video = video;
            this.stopVideo();
            this.isInitialized = true;
        } catch (err) {
            console.log(err);
            this.isInitialized = false;
        }
    }
    async changeSource(target: number) {
        if (!this.videoInputList[target]) {
            return;
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                    deviceId: {
                        exact: this.videoInputList[target][1],
                    },
                    width: this._VIDEO_WIDTH,
                    height: this._VIDEO_HEIGHT,
                },
            });
            this.isFront = !this.isFront;
            this.stream = stream;
            this.video.srcObject = this.stream;
            this.video.width = this.CANVAS_WIDTH;
            this.video.height = this.CANVAS_HEIGHT;
            const [track] = this.stream.getVideoTracks();
            this.imageCapture = new ImageCapture(track);
        } catch (err) {
            console.log(err);
        }
    }

    getWeightUrl() {
        return window.navigator.userAgent.indexOf('Electron') > -1
            ? `file://${window.weightsPath()}`
            : `${self.location.origin}/lib/entry-js/weights`;
    }

    videoOnLoadHandler() {
        if (!this.flipStatus.horizontal) {
            this.setOptions('hflip', null);
        }
    }

    initialSetup() {
        const videoTracks = this.stream.getVideoTracks();
        if (videoTracks[0].readyState === 'ended') {
            this.changeSource(0);
        }
        console.log('initial setup');
        this.isRunning = true;
        GEHelper.drawDetectedGraphic();

        this.motionDetect(null);
        this.startDrawIndicators();
    }

    startDrawIndicators() {
        if (!this.isRunning) {
            return;
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

    async faceDetect() {
        if (!this.modelRunningStatus.face) {
            return;
        }
        const predictions = await faceapi
            .detectAllFaces(this.inMemoryCanvas, this.tinyFaceDetectOption)
            .withFaceLandmarks()
            .withAgeAndGender()
            .withFaceExpressions();
        this.faces = predictions;
    }

    async cocoDetect() {
        if (!this.modelRunningStatus.object) {
            return;
        }
        const predictions = await this.coco.detect(this.inMemoryCanvas, 4);
        this.objects = predictions;
    }

    async poseDetect() {
        if (!this.modelRunningStatus.pose) {
            return;
        }
        const predictions = await this.mobileNet.estimateMultiplePoses(this.inMemoryCanvas, {
            flipHorizontal: this.flipStatus.horizontal,
            maxDetections: 4,
            scoreThreshold: 0.75,
            nmsRadius: 10,
            multiplier: 0.5,
            quantBytes: 1,
        });
        const adjacents: posenet.Keypoint[][][] = [];
        predictions.forEach((pose: posenet.Pose) => {
            // 어깨 위치와 코 위치를 기반으로 한 목 위치 계산
            const leftShoulder = pose.keypoints[5];
            const rightShoulder = pose.keypoints[6];
            const nose = pose.keypoints[0];
            const neckPos = {
                x: ((leftShoulder.position.x + rightShoulder.position.x) / 2 + nose.position.x) / 2,
                y:
                    (((leftShoulder.position.y + rightShoulder.position.y) / 2) * 1.5 +
                        nose.position.y * 0.5) /
                    2,
            };
            pose.keypoints[21] = { part: 'neck', position: neckPos, score: -1 };
            //---------------------------------------
            const adjacentMap = posenet.getAdjacentKeyPoints(pose.keypoints, 0.02);
            adjacents.push(adjacentMap);
        });
        this.poses = { predictions, adjacents };
    }

    async imageDetection() {
        if (!this.isModelInitiated) {
            return;
        }
        if (this.isChrome) {
            if (
                this.imageCapture.track.readyState === 'live' &&
                this.imageCapture.track.enabled &&
                !this.imageCapture.track.muted
            ) {
                const captured = await this.imageCapture.grabFrame();
                this.worker.postMessage({ type: 'estimate', image: captured }, [captured]);
            }
        } else {
            const context = this.inMemoryCanvas.getContext('2d');
            context.clearRect(0, 0, this.inMemoryCanvas.width, this.inMemoryCanvas.height);
            context.drawImage(this.video, 0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);

            this.cocoDetect();
            this.faceDetect();
            this.poseDetect();
        }

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
            requestAnimationFrame(this.imageDetection.bind(this));
        }, 100);
    }

    startCapturedImage(
        callback: Function,
        { width = this.CANVAS_WIDTH, height = this.CANVAS_HEIGHT }
    ) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        this.captureTimeout = Entry.Utils.asyncAnimationFrame(async () => {
            const context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(this.video, 0, 0, width, height);
            callback && (await callback(canvas));
        });
        Entry.addEventListener('stop', () => {
            this.stopCaptureImage();
        });
        return this.captureTimeout;
    }

    stopCaptureImage() {
        this.captureTimeout && cancelAnimationFrame(this.captureTimeout);
    }
    /**
     * MOTION DETECT CALCULATION BASED ON COMPUTER VISION
     * @param sprite Entry Entity Object
     */
    motionDetect(sprite: any) {
        if (!this.inMemoryCanvas || !this.isRunning) {
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

        // NT11576 이재원 #11709 sprite가 뒤집혔을때 minX와 maxX가 바뀌는 경우가 생김, sprite의 상태값을 저장하는 부분이 없으므로 비교 후 재설정으로 해결
        if (minX > maxX) {
            const temp = minX;
            minX = maxX;
            maxX = temp;
        }
        if (minY > maxY) {
            const temp = minY;
            minY = maxY;
            maxY = temp;
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
        if (mode === 'on') {
            this.turnOnWebcam();
        } else {
            this.turnOffWebcam();
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
                if (this.isChrome) {
                    this.worker.postMessage({
                        type: 'option',
                        option: { flipStatus: this.flipStatus },
                    });
                }
                GEHelper.hFlipVideoElement(this.canvasVideo);
                break;
            case 'vflip':
                this.flipStatus.vertical = !this.flipStatus.vertical;
                GEHelper.vFlipVideoElement(this.canvasVideo);
                break;
        }
    }
    manageModel(target: IndicatorType, mode: String) {
        if (mode == 'off') {
            this.modelRunningStatus[target] = false;
            if (this.isChrome) {
                this.isModelInitiated =
                    this.modelRunningStatus.face ||
                    this.modelRunningStatus.object ||
                    this.modelRunningStatus.pose;
                if (!this.isModelInitiated) {
                    this.worker.postMessage({
                        type: 'pause',
                    });
                }
            }
            this.removeIndicator(target);
            return;
        }
        // if turning on;
        if (this.isChrome) {
            if (!this.imageCapture) {
                const [track] = this.stream.getVideoTracks();
                this.imageCapture = new ImageCapture(track);
            }
            this.worker.postMessage({
                type: 'handle',
                target,
                mode,
            });
        }
        if (!this.isModelInitiated) {
            if (this.isChrome) {
                this.worker.postMessage({
                    type: 'run',
                });
            }

            this.isModelInitiated = true;
            this.imageDetection();
        }
        this.modelRunningStatus[target] = true;
    }
    showIndicator(type: IndicatorType) {
        this.indicatorStatus[type] = true;
    }
    removeIndicator(type: IndicatorType) {
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
        if (this.canvasVideo) {
            GEHelper.setVideoAlpha(this.canvasVideo, 50);
        }

        this.poses = { predictions: [], adjacents: [] };
        this.faces = [];
        this.objects = [];
        this.isRunning = false;
        this.isModelInitiated = false;
        this.stopVideo();
    }

    stopVideo() {
        try {
            if (this.stream) {
                this.stream.getTracks().forEach((track) => {
                    track.stop();
                });
            }
        } catch (err) {
            console.log(err);
        }
    }

    // videoUtils.destroy does not actually destroy singletonClass, but instead resets the whole stuff except models to be used
    destroy() {
        this.disableAllModels();
        this.turnOffWebcam();
        this.reset();
        this.stopVideo();
        GEHelper.destroy();
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
        this.worker = null;
        this.motionWorker = null;
        this.isInitialized = false;
    }

    disableAllModels() {
        this.modelRunningStatus = {
            pose: false,
            face: false,
            object: false,
            warmup: null,
        };
        if (this.isChrome && this.isInitialized) {
            this.worker.postMessage({
                type: 'handleOff',
            });
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
}

export default new VideoUtils();
