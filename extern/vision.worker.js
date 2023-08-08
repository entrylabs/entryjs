self.importScripts('/lib/entry-js/extern/vision_bundle.js');

self.onmessage = async ({ data }) => {
    if (data.action === 'pose_landmarker_init') {
        initializePoseLandmarker(data);
    } else if (data.action === 'gesture_recognizer_change_option') {
        changeGestureOption(data.option);
    } else if (data.action === 'pose_landmarker') {
        predictPoseLandmarker(data.imageBitmap);
    } else if (data.action === 'clear_pose_landmarker') {
        clearPredictPoseLandmarker();
    }
};

let workerContext;
let drawingUtils;
let gestureRecognizer;
let poseLandmarker;
let isPrevHandDetected = false;
let isPrevPoseLandmarker = false;
let countDetectedHand = 0;
let isDrawDetectedHand = false;
let isDrawDetectedPoseLandmarker = false;

const initializePoseLandmarker = async (data) => {
    const { canvas } = data;
    isDrawDetectedPoseLandmarker = data.isDrawDetectedPoseLandmarker;
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
        numPoses: 1,
    });
    self.postMessage({ action: 'next_pose_landmarker' });
};

const YX = (a) => {
    return Math.max(1, Math.min(10, 10 * (1 - (a - -0.15) / 0.25) + (1 - (0.1 - a) / 0.25)));
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
            action: 'pose_landmaker_data',
            poseLandmarkerResult: results,
        });
        if (landmarks.length) {
            if (!isPrevPoseLandmarker) {
                isPrevPoseLandmarker = true;
                self.postMessage({ action: 'start_pose_landmarker' });
            }
            // if (landmarks.length !== countDetectedHand) {
            //     countDetectedHand = landmarks.length;
            //     self.postMessage({
            //         action: 'count_detected_hand_gesture_recognizer',
            //         count: countDetectedHand,
            //     });
            // }
            // if (!isDrawDetectedPoseLandmarker) {
            //     return;
            // }
            landmarks.forEach((landmark, i) => {
                drawingUtils.drawLandmarks(landmark, {
                    radius: (data) => DrawingUtils.lerp(data.from.z, -0.15, 0.1, 5, 1),
                });
                drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS);
            });
        } else if (isPrevPoseLandmarker) {
            isPrevPoseLandmarker = false;
            // countDetectedHand = 0;
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
    workerContext.clearRect(0, 0, 640, 360);
};
