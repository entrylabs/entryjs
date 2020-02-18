const posenet = require('@tensorflow-models/posenet');
const cocoSsd = require('@tensorflow-models/coco-ssd');
const faceapi = require('face-api.js');
faceapi.env.setEnv(faceapi.env.createNodejsEnv());

faceapi.env.monkeyPatch({
    Canvas: OffscreenCanvas,
    createCanvasElement: () => {
        return new OffscreenCanvas(480, 270);
    },
});

// instances, used as flag, handler class if each instances are loaded or not
let isInitialized = false;
let mobileNet = null;
let coco = null;
let faceLoaded = false;

let options = {};
const dimension = { width: 0, height: 0 };
let offCanvas = null;

const tinyFaceDetectOption = new faceapi.TinyFaceDetectorOptions({ inputSize: 320 });

async function processImage() {
    try {
        objectDetect(this);
        poseDetect(this);
        faceDetect(this);
        // //check Motion
    } catch (err) {
        console.log('estimation error', err);
        return [];
    }
    setTimeout(() => {
        processImage();
    }, 30);
}

async function objectDetect(context) {
    if (!coco) {
        return;
    }

    const predictions = await coco.detect(offCanvas);
    context.postMessage({ type: 'coco', message: predictions });
}

async function faceDetect(context) {
    if (!faceLoaded) {
        return;
    }
    const predictions = await faceapi
        .detectAllFaces(offCanvas, tinyFaceDetectOption)
        .withFaceLandmarks()
        .withAgeAndGender()
        .withFaceExpressions();

    context.postMessage({ type: 'face', message: predictions });
}

async function poseDetect(context) {
    if (!mobileNet) {
        return;
    }
    const currentFlipStatus = options.flipStatus ? options.flipStatus.horizontal : true;
    const predictions = await mobileNet.estimateMultiplePoses(offCanvas, {
        flipHorizontal: currentFlipStatus,
        maxDetections: 4,
        scoreThreshold: 0.6,
        nmsRadius: 20,
    });
    const adjacents = [];
    predictions.forEach((pose) => {
        const adjacentMap = posenet.getAdjacentKeyPoints(pose.keypoints, 0.1);
        adjacents.push(adjacentMap);
    });
    context.postMessage({ type: 'pose', message: { predictions, adjacents } });
}

self.onmessage = async function(e) {
    const { type } = e.data;
    switch (type) {
        case 'init':
            dimension.width = e.data.width;
            dimension.height = e.data.height;
            offCanvas = e.data.offCanvas;

            console.log('loadDone');
            posenet
                .load({
                    architecture: 'MobileNetV1',
                    outputStride: 16,
                    inputResolution: { width: e.data.width, height: e.data.height },
                    multiplier: 1,
                })
                .then((mobileNetLoaded) => {
                    mobileNet = mobileNetLoaded;
                });
            cocoSsd
                .load({
                    base: 'lite_mobilenet_v2',
                })
                .then((cocoLoaded) => {
                    coco = cocoLoaded;
                });
            Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(
                    `${self.location.origin}/aimodules/weights`
                ),
                faceapi.nets.faceLandmark68Net.loadFromUri(
                    `${self.location.origin}/aimodules/weights`
                ),
                faceapi.nets.ageGenderNet.loadFromUri(`${self.location.origin}/aimodules/weights`),
                faceapi.nets.faceExpressionNet.loadFromUri(
                    `${self.location.origin}/aimodules/weights`
                ),
            ]).then(() => {
                faceLoaded = true;
            });

            this.postMessage({ type: 'init', message: 'done' });
            break;
        case 'estimate':
            const image = e.data.image;
            const ctx = offCanvas.getContext('2d');
            ctx.drawImage(image, 0, 0, dimension.width, dimension.height);
            if (!isInitialized) {
                isInitialized = true;
                processImage(image);
            }
            break;
        case 'option':
            options = e.data.option;
            break;
    }
};
