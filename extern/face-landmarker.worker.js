self.importScripts('/lib/entry-js/extern/vision_bundle.js');

self.onmessage = async ({ data }) => {
    if (data.action === 'face_landmarker_init') {
        initializeFaceLandmarker(data);
    } else if (data.action === 'face_landmarker_change_option') {
        changeFaceLandmarkerOption(data.option);
    } else if (data.action === 'face_landmarker') {
        predictFaceLandmarker(data.imageBitmap);
    } else if (data.action === 'clear_face_landmarker') {
        clearPredictFaceLandmarker();
    }
};

let workerContext;
let drawingUtils;
let faceLandmarker;
let isPrevFaceLandmarker = false;
let countDetectedFace = 0;
let isDrawDetectedFaceLandmarker = false;

const initializeFaceLandmarker = async (data) => {
    const { canvas } = data;
    isDrawDetectedFaceLandmarker = data.isDrawDetectedFaceLandmarker;
    workerContext = canvas.getContext('2d');
    workerContext.font = '20px Arial';
    drawingUtils = new DrawingUtils(workerContext);
    const vision = await FilesetResolver.forVisionTasks('/lib/entry-js/extern/wasm');
    faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath: '/lib/entry-js/extern/model/face_landmaker.task',
            delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numFaces: 4,
    });
    self.postMessage({ action: 'next_face_landmarker' });
};

const changeFaceLandmarkerOption = (option) => {
    isDrawDetectedFaceLandmarker = option.isDrawDetectedFaceLandmarker;
};

const predictFaceLandmarker = async (imageBitmap) => {
    try {
        if (!workerContext || !faceLandmarker) {
            return;
        }
        const startTimeMs = performance.now();
        const results = await faceLandmarker.detectForVideo(imageBitmap, startTimeMs);
        workerContext.save();
        workerContext.clearRect(0, 0, 640, 360);
        const { faceLandmarks } = results;
        self.postMessage({
            action: 'face_landmarker_data',
            faceLandmarkerResult: results,
        });
        if (faceLandmarks.length) {
            if (!isPrevFaceLandmarker) {
                isPrevFaceLandmarker = true;
                self.postMessage({ action: 'start_face_landmarker' });
            }
            if (faceLandmarks.length !== countDetectedFace) {
                countDetectedFace = faceLandmarks.length;
                self.postMessage({
                    action: 'count_detected_face_landmarker',
                    count: countDetectedFace,
                });
            }
            if (!isDrawDetectedFaceLandmarker) {
                return;
            }
            faceLandmarks.forEach((landmark, i) => {
                drawingUtils.drawConnectors(landmark, FaceLandmarker.FACE_LANDMARKS_TESSELATION, {
                    color: '#C0C0C070',
                    lineWidth: 1,
                });
                drawingUtils.drawConnectors(landmark, FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE, {
                    color: '#FF3030',
                });
                drawingUtils.drawConnectors(landmark, FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW, {
                    color: '#FF3030',
                });
                drawingUtils.drawConnectors(landmark, FaceLandmarker.FACE_LANDMARKS_LEFT_EYE, {
                    color: '#30FF30',
                });
                drawingUtils.drawConnectors(landmark, FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW, {
                    color: '#30FF30',
                });
                drawingUtils.drawConnectors(landmark, FaceLandmarker.FACE_LANDMARKS_FACE_OVAL, {
                    color: '#E0E0E0',
                });
                drawingUtils.drawConnectors(landmark, FaceLandmarker.FACE_LANDMARKS_LIPS, {
                    color: '#E0E0E0',
                });
                drawingUtils.drawConnectors(landmark, FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS, {
                    color: '#FF3030',
                });
                drawingUtils.drawConnectors(landmark, FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS, {
                    color: '#30FF30',
                });
            });
        } else if (isPrevFaceLandmarker) {
            isPrevFaceLandmarker = false;
            countDetectedFace = 0;
            self.postMessage({ action: 'stop_face_landmarker' });
        }
    } catch (e) {
        console.error(e);
    } finally {
        workerContext.restore();
        requestAnimationFrame(() => {
            self.postMessage({ action: 'next_face_landmarker' });
        });
    }
};

const clearPredictFaceLandmarker = () => {
    console.log('clearPredictFaceLandmarker');
    workerContext.clearRect(0, 0, 640, 360);
};
