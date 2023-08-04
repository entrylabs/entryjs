self.importScripts('/lib/entry-js/extern/vision_bundle.js');

self.onmessage = async ({ data }) => {
    if (data.action === 'gesture_recognizer_init') {
        initializeGesture(data.canvas);
    } else if (data.action === 'gesture_recognizer') {
        predictGesture(data.imageBitmap);
    } else if (data.action === 'clear_gesture_recognizer') {
        clearPredictGesture();
    }
};

let workerContext;
let drawingUtils;
let gestureRecognizer;

const initializeGesture = async (canvas) => {
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

const YX = (a) => {
    return Math.max(1, Math.min(10, 10 * (1 - (a - -0.15) / 0.25) + (1 - (0.1 - a) / 0.25)));
};

const predictGesture = (imageBitmap) => {
    if (!workerContext || !gestureRecognizer) {
        return;
    }
    const results = gestureRecognizer.recognizeForVideo(imageBitmap, Date.now());
    workerContext.save();
    workerContext.clearRect(0, 0, 640, 360);
    const { landmarks, handednesses } = results;
    if (landmarks) {
        landmarks.forEach((landmark, i) => {
            let connectColor;
            let landmarkColor;
            const [handedness] = handednesses[i];
            const mark12 = landmark[12];
            if (handedness.categoryName === 'Left') {
                workerContext.fillStyle = '#FF0000';
                workerContext.fillText(`${i + 1}-왼손`, mark12.x * 640, mark12.y * 360 - 20);
                connectColor = '#FF0000';
                landmarkColor = '#00FF00';
            } else {
                workerContext.fillStyle = '#00FF00';
                workerContext.fillText(`${i + 1}-오른손`, mark12.x * 640, mark12.y * 360 - 20);
                connectColor = '#00FF00';
                landmarkColor = '#FF0000';
            }
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
    }
    workerContext.restore();
    requestAnimationFrame(() => {
        self.postMessage({ action: 'next_gesture_recognizer' });
    });
};

const clearPredictGesture = () => {
    console.log('clearPredictGesture');
    workerContext.clearRect(0, 0, 640, 360);
};
