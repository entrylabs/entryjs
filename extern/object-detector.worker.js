self.importScripts('/lib/entry-js/extern/vision_bundle.js');

self.onmessage = async ({ data }) => {
    if (data.action === 'object_detector_init') {
        initializeObjectDetector(data);
    } else if (data.action === 'object_detector_change_option') {
        changeObjectDetectorOption(data.option);
    } else if (data.action === 'object_detector') {
        predictObjectDetector(data.imageBitmap);
    } else if (data.action === 'clear_object_detector') {
        clearPredictObjectDetector();
    }
};

let workerContext;
let drawingUtils;
let objectDetector;
let isPrevObjectDetector = false;
let countDetectedHand = 0;
let isDrawDetectedObject = false;

const initializeObjectDetector = async (data) => {
    const { canvas } = data;
    isDrawDetectedObject = data.isDrawDetectedObject;
    workerContext = canvas.getContext('2d');
    workerContext.font = '20px Arial';
    workerContext.lineWidth = 5;
    drawingUtils = new DrawingUtils(workerContext);
    const vision = await FilesetResolver.forVisionTasks('/lib/entry-js/extern/wasm');
    objectDetector = await ObjectDetector.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath: '/lib/entry-js/extern/model/object_detector.task',
            delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numHands: 2,
    });
    self.postMessage({ action: 'next_object_detector' });
};

const changeObjectDetectorOption = (option) => {
    isDrawDetectedObject = option.isDrawDetectedObject;
};

const YX = (a) => {
    return Math.max(1, Math.min(10, 10 * (1 - (a - -0.15) / 0.25) + (1 - (0.1 - a) / 0.25)));
};

const predictObjectDetector = (imageBitmap) => {
    try {
        if (!workerContext || !objectDetector) {
            return;
        }
        const startTimeMs = performance.now();
        const results = objectDetector.detectForVideo(imageBitmap, startTimeMs);
        workerContext.save();
        workerContext.clearRect(0, 0, 640, 360);
        const { detections } = results;
        self.postMessage({
            action: 'object_detector_data',
            objectDetectorResult: results,
        });
        if (detections.length) {
            if (!isPrevObjectDetector) {
                isPrevObjectDetector = true;
                self.postMessage({ action: 'start_object_detector' });
            }
            if (detections.length !== countDetectedObject) {
                countDetectedObject = detections.length;
                self.postMessage({
                    action: 'count_detected_hand_object_detector',
                    count: countDetectedObject,
                });
            }
            if (!isDrawDetectedObject) {
                return;
            }
            detections.forEach((detect, i) => {
                drawObjectDetections(detect, i);
            });
        } else if (isPrevObjectDetector) {
            isPrevObjectDetector = false;
            countDetectedObject = 0;
            self.postMessage({ action: 'stop_object_detector' });
        }
    } catch (e) {
        console.error(e);
    } finally {
        workerContext.restore();
        requestAnimationFrame(() => {
            self.postMessage({ action: 'next_object_detector' });
        });
    }
};

const colors = [
    'rgb(66, 133, 244)',
    'rgb(36, 193, 224)',
    'rgb(52, 168, 83)',
    'rgb(161, 66, 244)',
    'rgb(244, 57, 160)',
    'rgb(234, 67, 53)',
    'rgb(250, 123, 23)',
    'rgb(252, 201, 52)',
];
async function drawObjectDetections(detect, i) {
    try {
        const { boundingBox, categories } = detect;
        const [category] = categories;
        const displayName = category.displayName || category.categoryName;

        const x = boundingBox.originX;
        const y = boundingBox.originY;
        const w = boundingBox.width;
        const h = boundingBox.height;
        const e = (640 / 600) * 4;
        const measureText = workerContext.measureText(displayName);
        const l = measureText.width + 6;
        const measureSize =
            measureText.fontBoundingBoxAscent + measureText.fontBoundingBoxDescent + 2 * e;
        const m = x + w - l;
        workerContext.strokeStyle = colors[i];
        workerContext.beginPath();
        workerContext.moveTo(x, y);
        workerContext.lineTo(x + w, y);
        workerContext.lineTo(x + w, y + h);
        workerContext.lineTo(x, y + h);
        workerContext.lineTo(x, y);
        workerContext.stroke();
        workerContext.fillStyle = colors[i];
        workerContext.fillRect(m, y, l, measureSize);
        workerContext.fillStyle = 'white';
        workerContext.fillText(displayName, m + 3, y + measureSize - 3 * e);
    } catch (e) {
        console.error(e.stack);
    }
}

const clearPredictObjectDetector = () => {
    console.log('clearPredictObjectDetector');
    isPrevObjectDetector = false;
    workerContext.clearRect(0, 0, 640, 360);
};
