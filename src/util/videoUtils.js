/**
 * nt11576 Lee.Jaewon
 * commented area with "motion test" is for the motion detection testing canvas to test the cv, uncomment all codes labeled "motion test"
 */

import { GEHelper } from '../graphicEngine/GEHelper';
import VideoWorker from './workers/video.worker';
import clamp from 'lodash/clamp';
// webcam input resolution setting
const VIDEO_WIDTH = 640;
const VIDEO_HEIGHT = 360;

// canvasVideo SETTING, used in all canvas'
const CANVAS_WIDTH = 480;
const CANVAS_HEIGHT = 270;

// ** MOTION DETECTION
// motion detection parameters
const SAMPLE_SIZE = 15;
const BOUNDARY_OFFSET = 4;
const SAME_COORDINATE_COMPENSATION = 10;

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
        this.motions = [...Array(CANVAS_HEIGHT / SAMPLE_SIZE)].map((e) =>
            Array(CANVAS_WIDTH / SAMPLE_SIZE)
        );
        this.motionPoint = { x: 0, y: 0 };
        this.motionDirection = [...Array(CANVAS_HEIGHT / SAMPLE_SIZE)].map((e) =>
            Array(CANVAS_WIDTH / SAMPLE_SIZE)
        );
        this.totalMotions = 0;
        this.totalMotionDirection = { x: 0, y: 0 };
        /////////////////////////////////
        this.objects = null;
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
        this.disableAllModels();
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

        this.poses = { predictions: [], adjacents: [] };
        this.faces = [];
        this.objects = [];
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
        // const tempTarget = document.getElementsByClassName('uploadInput')[0];
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

    videoOnLoadHandler() {
        Entry.addEventListener('beforeStop', this.reset.bind(this));
        this.video.play();
        this.startDrawIndicators();
        this.turnOnWebcam();
        if (this.initialized) {
            return;
        }
        const [track] = this.stream.getVideoTracks();
        this.imageCapture = new ImageCapture(track);

        worker.onmessage = (e) => {
            const { type, message } = e.data;
            if (Entry.engine.state !== 'run' && type !== 'init') {
                return;
            }
            switch (type) {
                case 'init':
                    this.initialized = true;
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

    // ** MOTION DETECTION
    motionDetect(sprite) {
        if (!this.inMemoryCanvas) {
            return;
        }
        let minX = 0;
        let maxX = CANVAS_WIDTH;
        let minY = 0;
        let maxY = CANVAS_HEIGHT;

        if (sprite) {
            const { x, y, width, height, scaleX, scaleY } = sprite;
            minX = CANVAS_WIDTH / 2 + x - (width * scaleX) / 2;
            maxX = CANVAS_WIDTH / 2 + x + (width * scaleX) / 2;
            minY = CANVAS_HEIGHT / 2 - y - (height * scaleY) / 2;
            maxY = CANVAS_HEIGHT / 2 - y + (height * scaleY) / 2;
            if (this.flipStatus.horizontal) {
                const tempMinX = minX;
                minX = CANVAS_WIDTH - maxX;
                maxX = CANVAS_WIDTH - tempMinX;
            }
            if (this.flipStatus.vertical) {
                const tempMinY = minY;
                minY = CANVAS_WIDTH - maxY;
                maxY = CANVAS_WIDTH - tempMinY;
            }
            minX = Math.floor(minX / SAMPLE_SIZE) * SAMPLE_SIZE;
            maxX = Math.floor(maxX / SAMPLE_SIZE) * SAMPLE_SIZE;
            minY = Math.floor(minY / SAMPLE_SIZE) * SAMPLE_SIZE;
            maxY = Math.floor(maxY / SAMPLE_SIZE) * SAMPLE_SIZE;
        }

        const context = this.inMemoryCanvas.getContext('2d');
        context.clearRect(0, 0, this.inMemoryCanvas.width, this.inMemoryCanvas.height);
        context.drawImage(this.video, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        const imageData = context.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        const data = imageData.data;
        let areaMotion = 0;
        let totalMotionDirectionX = 0;
        let totalMotionDirectionY = 0;
        for (let y = minY; y < maxY; y += SAMPLE_SIZE) {
            for (let x = minX; x < maxX; x += SAMPLE_SIZE) {
                const pos = (x + y * CANVAS_WIDTH) * 4;
                const r = data[pos];
                const g = data[pos + 1];
                const b = data[pos + 2];
                // const a = data[pos + 3];
                // diffScheme;
                const yIndex = y / SAMPLE_SIZE;
                const xIndex = x / SAMPLE_SIZE;
                const currentPos = this.motions[yIndex][xIndex] || { r: 0, g: 0, b: 0 };
                const rDiff = Math.abs(currentPos.r - r);
                const gDiff = Math.abs(currentPos.g - g);
                const bDiff = Math.abs(currentPos.b - b);
                const areaMotionScore = rDiff + gDiff + bDiff / (SAMPLE_SIZE * SAMPLE_SIZE);

                const xLength = this.motions[0].length;
                const yLength = this.motions.length;
                const mostSimilar = { x: 0, y: 0, diff: 99999999 };

                const minScanY = clamp(yIndex - BOUNDARY_OFFSET, 0, yLength - 1);
                const maxScanY = clamp(yIndex + BOUNDARY_OFFSET, 0, yLength - 1);
                const minScanX = clamp(xIndex - BOUNDARY_OFFSET, 0, xLength - 1);
                const maxScanX = clamp(xIndex + BOUNDARY_OFFSET, 0, xLength - 1);
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
                            diff = diff - SAME_COORDINATE_COMPENSATION;
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

                this.motionDirection[yIndex][xIndex] = {
                    x: mostSimilar.x - xIndex,
                    y: mostSimilar.y - yIndex,
                };
            }
        }
        const result = {
            total: areaMotion,
            totalMotionDirection: {
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
            case 'transparency':
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
