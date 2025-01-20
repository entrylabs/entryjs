self.importScripts(`${self.location.pathname}/../human/human.js`);

const config = {
    backend: 'humangl',
    modelBasePath: './human/models/',
    cacheModels: true,
    validateModels: true,
    wasmPlatformFetch: false,
    debug: false,
    async: true,
    warmup: 'full',
    cacheSensitivity: 0.7,
    skipAllowed: false,
    deallocate: false,
    flags: {},
    softwareKernels: false,
    face: {
        enabled: true,
        detector: {
            modelPath: 'blazeface.json',
            rotation: false,
            maxDetected: 4,
            minConfidence: 0.2,
            return: true,
        },
        mesh: {
            enabled: true,
            modelPath: 'facemesh.json',
            keepInvalid: false,
        },
        attention: {
            enabled: false,
            modelPath: 'facemesh-attention.json',
        },
        iris: {
            enabled: false,
            modelPath: 'iris.json',
        },
        emotion: {
            enabled: true,
            minConfidence: 0.1,
            skipFrames: 99,
            skipTime: 1500,
            modelPath: 'emotion.json',
        },
        description: {
            enabled: true,
            modelPath: 'faceres.json',
            skipFrames: 99,
            skipTime: 3000,
            minConfidence: 0.1,
        },
        antispoof: {
            enabled: false,
            skipFrames: 99,
            skipTime: 4000,
            modelPath: 'antispoof.json',
        },
        liveness: {
            enabled: false,
            skipFrames: 99,
            skipTime: 4000,
            modelPath: 'liveness.json',
        },
    },
    filter: { enabled: false },
    object: { enabled: false },
    gesture: { enabled: false },
    hand: { enabled: false },
    body: { enabled: false },
    segmentation: { enabled: false },
};

const drawOption = {
    alpha: 1,
    color: '#ffffff',
    drawPoints: true,
    drawPolygons: true,
    drawAttention: false,
    drawBoxes: false,
    drawGaze: false,
    drawGestures: false,
    drawLabels: false,
};

let flipState;
let isRun = false;
let isFirstIdle = false;

self.onmessage = async ({ data }) => {
    if (data.action === 'face_landmarker_init') {
        initializeFaceLandmarker(data);
    } else if (data.action === 'face_landmarker_restart') {
        isRun = true;
        self.postMessage({ action: 'run_start_face_landmarker' });
    } else if (data.action === 'face_landmarker_change_option') {
        changeFaceLandmarkerOption(data.option);
    } else if (data.action === 'face_landmarker') {
        flipState = data.flipState;
        predictFaceLandmarker(data.imageBitmap);
    } else if (data.action === 'clear_face_landmarker') {
        clearPredictFaceLandmarker();
    }
};

let human;
let faceLang;
let offCanvas;
let workerContext;
let drawingUtils;
let faceLandmarker;
let isPrevFaceLandmarker = false;
let countDetectedFace = 0;
let isDrawDetectedFaceLandmarker = false;

const initializeFaceLandmarker = async (data) => {
    const { canvas, option, isSafari, lang } = data;
    faceLang = lang.face;
    isDrawDetectedFaceLandmarker = option.isDrawDetectedFaceLandmarker;
    offCanvas = canvas;
    workerContext = canvas.getContext('2d');
    workerContext.font = '20px Arial';

    if (isSafari) {
        config.backend = 'wasm';
    }

    if (!human) human = new Human.default(config);
    await human.load(); // optional as models would be loaded on-demand first time they are required
    await human.warmup(); // optional as model warmup is performed on-demand first time its executed

    isRun = true;
    self.postMessage({ action: 'run_start_face_landmarker' });
    self.postMessage({ action: 'next_face_landmarker' });
};

const changeFaceLandmarkerOption = (option) => {
    isDrawDetectedFaceLandmarker = option.isDrawDetectedFaceLandmarker;
};

const contextFlip = (context, axis) => {
    if (flipState === 0) {
        context.scale(-1, 1);
        return {
            x: -axis[0] * 640,
            y: axis[1] * 360 - 20,
        };
    } else if (flipState === 1) {
        context.scale(1, 1);
        return {
            x: axis[0] * 640,
            y: axis[1] * 360 - 20,
        };
    } else if (flipState === 2) {
        context.scale(-1, -1);
        return {
            x: -axis[0] * 640,
            y: -axis[1] * 360 + 20,
        };
    } else if (flipState === 3) {
        context.scale(1, -1);
        return {
            x: axis[0] * 640,
            y: -axis[1] * 360 + 20,
        };
    }
};

let lastDetect;
const predictFaceLandmarker = async (imageBitmap) => {
    try {
        if (!workerContext || !human) {
            return;
        }
        if (!isFirstIdle && human.state === 'idle') {
            isFirstIdle = true;
        }
        if (!isRun || !isFirstIdle) {
            return;
        }
        lastDetect = human.detect(imageBitmap);
        const results = await lastDetect;

        workerContext.save();
        workerContext.clearRect(0, 0, 640, 360);

        const { face } = results;
        self.postMessage({
            action: 'face_landmarker_data',
            faceLandmarkerResult: { face },
        });
        if (face.length) {
            if (!isPrevFaceLandmarker) {
                isPrevFaceLandmarker = true;
                self.postMessage({ action: 'start_face_landmarker' });
            }
            if (face.length !== countDetectedFace) {
                countDetectedFace = face.length;
                self.postMessage({
                    action: 'count_detected_face_landmarker',
                    count: countDetectedFace,
                });
            }
            if (!isDrawDetectedFaceLandmarker) {
                return;
            }
            face.forEach((item, i) => {
                const { meshRaw } = item;
                const mark297 = meshRaw[297];
                const { x, y } = contextFlip(workerContext, mark297);
                workerContext.fillStyle = '#FF0000';
                workerContext.fillText(`${i + 1}-${faceLang}`, x, y);
                contextFlip(workerContext, mark297);
            });
            await human.draw.face(offCanvas, face, drawOption);
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

const clearPredictFaceLandmarker = async () => {
    isRun = false;
    await lastDetect;
    requestAnimationFrame(() => {
        self.postMessage({ action: 'run_stop_face_landmarker' });
        isPrevFaceLandmarker = false;
        countDetectedFace = 0;
        workerContext.clearRect(0, 0, 640, 360);
    });
};
