self.importScripts('/lib/entry-js/extern/vision_bundle.js');

let flipState;

self.onmessage = async ({ data }) => {
    if (data.action === 'pose_landmarker_init') {
        initializePoseLandmarker(data);
    } else if (data.action === 'pose_landmarker_change_option') {
        changePoseLandmarkerOption(data.option);
    } else if (data.action === 'pose_landmarker') {
        flipState = data.flipState;
        predictPoseLandmarker(data.imageBitmap);
    } else if (data.action === 'clear_pose_landmarker') {
        clearPredictPoseLandmarker();
    }
};

let person;
let workerContext;
let drawingUtils;
let poseLandmarker;
let isPrevPoseLandmarker = false;
let countDetectedPose = 0;
let isDrawDetectedPoseLandmarker = false;

const initializePoseLandmarker = async (data) => {
    const { canvas, lang, option } = data;
    person = lang.person;
    isDrawDetectedPoseLandmarker = option.isDrawDetectedPoseLandmarker;
    workerContext = canvas.getContext('2d');
    workerContext.font = '20px Arial';
    drawingUtils = new DrawingUtils(workerContext);
    const vision = await FilesetResolver.forVisionTasks('/lib/entry-js/extern/wasm');
    poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath: '/lib/entry-js/extern/model/pose_landmarker_lite.task',
            delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numPoses: 4,
    });
    self.postMessage({ action: 'next_pose_landmarker' });
};

const changePoseLandmarkerOption = (option) => {
    isDrawDetectedPoseLandmarker = option.isDrawDetectedPoseLandmarker;
};

const contextFlip = (context, axis) => {
    if (flipState === 0) {
        context.scale(-1, 1);
        return {
            x: -axis.x * 640,
            y: axis.y * 360 - 20,
        };
    } else if (flipState === 1) {
        context.scale(1, 1);
        return {
            x: axis.x * 640,
            y: axis.y * 360 - 20,
        };
    } else if (flipState === 2) {
        context.scale(-1, -1);
        return {
            x: -axis.x * 640,
            y: -axis.y * 360 + 20,
        };
    } else if (flipState === 3) {
        context.scale(1, -1);
        return {
            x: axis.x * 640,
            y: -axis.y * 360 + 20,
        };
    }
};

const predictPoseLandmarker = async (imageBitmap) => {
    try {
        if (!workerContext || !poseLandmarker) {
            return;
        }
        const startTimeMs = performance.now();
        const results = await poseLandmarker.detectForVideo(imageBitmap, startTimeMs);
        workerContext.save();
        workerContext.clearRect(0, 0, 640, 360);
        const { landmarks } = results;
        self.postMessage({
            action: 'pose_landmarker_data',
            poseLandmarkerResult: results,
        });
        if (landmarks.length) {
            if (!isPrevPoseLandmarker) {
                isPrevPoseLandmarker = true;
                self.postMessage({ action: 'start_pose_landmarker' });
            }
            if (landmarks.length !== countDetectedPose) {
                countDetectedPose = landmarks.length;
                self.postMessage({
                    action: 'count_detected_pose_landmarker',
                    count: countDetectedPose,
                });
            }
            if (!isDrawDetectedPoseLandmarker) {
                return;
            }
            landmarks.forEach((landmark, i) => {
                const mark7 = landmark[7];
                const { x, y } = contextFlip(workerContext, mark7);
                workerContext.fillStyle = '#FF0000';
                workerContext.fillText(`${i + 1}-${person}`, x, y);
                contextFlip(workerContext, mark7);
                drawingUtils.drawLandmarks(landmark, {
                    radius: (data) => DrawingUtils.lerp(data.from.z, -0.15, 0.1, 5, 1),
                });
                drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS);
            });
        } else if (isPrevPoseLandmarker) {
            isPrevPoseLandmarker = false;
            countDetectedPose = 0;
            self.postMessage({ action: 'stop_pose_landmarker' });
        }
    } catch (e) {
        console.error(e);
    } finally {
        workerContext.restore();
        requestAnimationFrame(() => {
            self.postMessage({ action: 'next_pose_landmarker' });
        });
    }
};

const clearPredictPoseLandmarker = () => {
    console.log('clearPredictPoseLandmarker');
    isPrevPoseLandmarker = false;
    workerContext.clearRect(0, 0, 640, 360);
};
