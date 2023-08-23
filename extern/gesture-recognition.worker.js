self.importScripts('/lib/entry-js/extern/vision_bundle.js');

let flipState;
self.onmessage = async ({ data }) => {
    if (data.action === 'gesture_recognizer_init') {
        initializeGesture(data);
    } else if (data.action === 'gesture_recognizer_change_option') {
        changeGestureOption(data.option);
    } else if (data.action === 'gesture_recognizer') {
        flipState = data.flipState || 0;
        predictGesture(data.imageBitmap);
    } else if (data.action === 'clear_gesture_recognizer') {
        clearPredictGesture();
    }
};

let leftHand;
let rightHand;
let workerContext;
let drawingUtils;
let gestureRecognizer;
let isPrevHandDetected = false;
let countDetectedHand = 0;
let isDrawDetectedHand = false;

const initializeGesture = async (data) => {
    const { canvas, lang, option } = data;
    leftHand = lang.leftHand;
    rightHand = lang.rightHand;
    isDrawDetectedHand = option.isDrawDetectedHand;
    workerContext = canvas.getContext('2d');
    workerContext.font = '20px Arial';
    drawingUtils = new DrawingUtils(workerContext);
    const vision = await FilesetResolver.forVisionTasks('/lib/entry-js/extern/wasm');
    gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath: '/lib/entry-js/extern/model/gesture_recognizer.task',
            delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numHands: 2,
    });
    self.postMessage({ action: 'next_gesture_recognizer' });
};

const changeGestureOption = (option) => {
    isDrawDetectedHand = option.isDrawDetectedHand;
};

const YX = (a) => {
    return Math.max(1, Math.min(10, 10 * (1 - (a - -0.15) / 0.25) + (1 - (0.1 - a) / 0.25)));
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

const predictGesture = (imageBitmap) => {
    try {
        if (!workerContext || !gestureRecognizer) {
            return;
        }
        const results = gestureRecognizer.recognizeForVideo(imageBitmap, Date.now());
        workerContext.save();
        workerContext.clearRect(0, 0, 640, 360);
        const { landmarks, handednesses } = results;
        self.postMessage({
            action: 'gesture_recognizer_data',
            gestureRecognizerResult: results,
        });
        if (landmarks.length) {
            if (!isPrevHandDetected) {
                isPrevHandDetected = true;
                self.postMessage({ action: 'start_gesture_recognizer' });
            }
            if (landmarks.length !== countDetectedHand) {
                countDetectedHand = landmarks.length;
                self.postMessage({
                    action: 'count_detected_hand_gesture_recognizer',
                    count: countDetectedHand,
                });
            }
            if (!isDrawDetectedHand) {
                return;
            }
            landmarks.forEach((landmark, i) => {
                let connectColor;
                let landmarkColor;
                const [handedness] = handednesses[i];
                const mark12 = landmark[12];
                const { x, y } = contextFlip(workerContext, mark12);
                if (handedness.categoryName === 'Left') {
                    workerContext.fillStyle = '#FF0000';
                    workerContext.fillText(`${i + 1}-${rightHand}`, x, y);
                    connectColor = '#FF0000';
                    landmarkColor = '#00FF00';
                } else {
                    workerContext.fillStyle = '#00FF00';
                    workerContext.fillText(`${i + 1}-${leftHand}`, x, y);
                    connectColor = '#00FF00';
                    landmarkColor = '#FF0000';
                }
                contextFlip(workerContext, mark12);
                drawingUtils.drawConnectors(landmark, GestureRecognizer.HAND_CONNECTIONS, {
                    color: connectColor,
                    lineWidth: 4,
                });
                drawingUtils.drawLandmarks(landmark, {
                    color: connectColor,
                    lineWidth: 4,
                    fillColor: landmarkColor,
                    radius: (e) => {
                        return YX(e.from?.z || 0);
                    },
                });
            });
        } else if (isPrevHandDetected) {
            isPrevHandDetected = false;
            countDetectedHand = 0;
            self.postMessage({ action: 'stop_gesture_recognizer' });
        }
    } catch (e) {
        console.error(e);
    } finally {
        workerContext.restore();
        requestAnimationFrame(() => {
            self.postMessage({ action: 'next_gesture_recognizer' });
        });
    }
};

const clearPredictGesture = () => {
    console.log('clearPredictGesture');
    isPrevHandDetected = false;
    workerContext.clearRect(0, 0, 640, 360);
};
