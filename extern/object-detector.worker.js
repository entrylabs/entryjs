self.importScripts(`${self.location.pathname}/../vision_bundle.js`);

let flipState;
let isRun = false;

self.onmessage = async ({ data }) => {
    if (data.action === 'object_detector_init') {
        initializeObjectDetector(data);
    } else if (data.action === 'object_detector_restart') {
        isRun = true;
    } else if (data.action === 'object_detector_change_option') {
        changeObjectDetectorOption(data.option);
    } else if (data.action === 'object_detector') {
        flipState = data.flipState;
        predictObjectDetector(data.imageBitmap);
    } else if (data.action === 'clear_object_detector') {
        clearPredictObjectDetector();
    }
};

let objectNameList;
let workerContext;
let drawingUtils;
let objectDetector;
let isPrevObjectDetector = false;
let countDetectedObject = 0;
let isDrawDetectedObjectDetector = false;

const initializeObjectDetector = async (data) => {
    const { canvas, lang, option } = data;
    isRun = true;
    objectNameList = lang.objectNameList;
    isDrawDetectedObjectDetector = option.isDrawDetectedObjectDetector;
    workerContext = canvas.getContext('2d');
    workerContext.font = '20px Arial';
    workerContext.lineWidth = 5;
    drawingUtils = new DrawingUtils(workerContext);
    const vision = await FilesetResolver.forVisionTasks(`${self.location.pathname}/../wasm`);
    objectDetector = await ObjectDetector.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath: `${self.location.pathname}/../model/object_detector_lite.tflite`,
            delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        scoreThreshold: 0.5,
        maxResults: 8,
    });
    self.postMessage({ action: 'next_object_detector' });
};

const changeObjectDetectorOption = (option) => {
    isDrawDetectedObjectDetector = option.isDrawDetectedObjectDetector;
};

const YX = (a) => {
    return Math.max(1, Math.min(10, 10 * (1 - (a - -0.15) / 0.25) + (1 - (0.1 - a) / 0.25)));
};

const predictObjectDetector = (imageBitmap) => {
    try {
        if (!workerContext || !objectDetector || !isRun) {
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
                    action: 'count_detected_object_detector',
                    count: countDetectedObject,
                });
            }
            if (!isDrawDetectedObjectDetector) {
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

const contextFlip = (context, axis) => {
    if (flipState === 0) {
        context.scale(-1, 1);
        return {
            x: -axis.x - axis.offsetX,
            y: axis.y - axis.offsetY,
        };
    } else if (flipState === 1) {
        context.scale(1, 1);
        return {
            x: axis.x + 3,
            y: axis.y - axis.offsetY,
        };
    } else if (flipState === 2) {
        context.scale(-1, -1);
        return {
            x: -axis.x - axis.offsetX,
            y: -(axis.y - axis.offsetY - 6),
        };
    } else if (flipState === 3) {
        context.scale(1, -1);
        return {
            x: axis.x + 3,
            y: -(axis.y - axis.offsetY - 6),
        };
    }
};

let offset = 0;
function drawObjectDetections(detect, i) {
    try {
        const { boundingBox, categories } = detect;
        const [category] = categories;
        const displayName = category.displayName || category.categoryName;
        const text = objectNameList[displayName] || displayName;

        const x = boundingBox.originX;
        const y = boundingBox.originY;
        const w = boundingBox.width;
        const h = boundingBox.height;
        const e = (640 / 600) * 4;
        const measureText = workerContext.measureText(text);
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
        const { x: axisX, y: axisY } = contextFlip(workerContext, {
            offsetX: l - 3,
            offsetY: 3 * e,
            x: m,
            y: y + measureSize,
        });
        workerContext.fillStyle = 'white';
        workerContext.fillText(text, axisX, axisY);
        contextFlip(workerContext, { offsetX: 0, offsetY: 0, x: 0, y: 0 });
    } catch (e) {
        console.error(e.stack);
    }
}

const clearPredictObjectDetector = () => {
    console.log('clearPredictObjectDetector');
    isRun = false;
    isPrevObjectDetector = false;
    countDetectedObject = 0;
    workerContext.clearRect(0, 0, 640, 360);
};
