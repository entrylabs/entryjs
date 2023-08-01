self.importScripts('/lib/entry-js/extern/vision_bundle.js');

self.onmessage = async ({ data }) => {
    if (data.action === 'init') {
        initialize(data.canvas);
    } else if (data.action === 'gesture_recognizer') {
        predictGesture(data.imageData);
    } else if (data.action === 'clear_gesture_recognizer') {
        clearPredictGesture();
    }
};

let workerContext;
let drawingUtils;
let gestureRecognizer;

const initialize = async (canvas) => {
    workerContext = canvas.getContext('2d');
    drawingUtils = new DrawingUtils(workerContext);
    const vision = await FilesetResolver.forVisionTasks('/lib/entry-js/extern/wasm');
    gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath: '/lib/entry-js/extern/model/gesture_recognizer.task',
            delegate: 'GPU',
        },
        runningMode: 'IMAGE',
        numHands: 2,
    });
};

const YX = (a) => {
    return Math.max(1, Math.min(10, 10 * (1 - (a - -0.15) / 0.25) + (1 - (0.1 - a) / 0.25)));
};

const predictGesture = () => {
    if (!workerContext || !gestureRecognizer) {
        return;
    }
    const results = gestureRecognizer.recognize(imageData);
    workerContext.save();
    workerContext.clearRect(0, 0, 640, 480);
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
    self.postMessage({ action: 'next_gesture_recognizer' });
};

const clearPredictGesture = () => {
    console.log('clearPredictGesture');
    workerContext.clearRect(0, 0, 640, 480);
};
