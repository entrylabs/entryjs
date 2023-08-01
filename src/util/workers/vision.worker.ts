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

const initialize = () => {
    console.log('init');
};

const predictGesture = () => {
    console.log('predictGesture');
};

const clearPredictGesture = () => {
    console.log('clearPredictGesture');
};
