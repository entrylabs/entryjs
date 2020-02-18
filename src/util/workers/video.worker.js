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

// import { decodePixelsFromOffscreenCanvas } from './util';
// instances, used as flag, handler class if each instances are loaded or not

let isInitialized = false;

let mobileNet = null;
let coco = null;
let faceLoaded = false;

const previousFrame = [];
const BRIGHTNESS_THRESHOLD = 30;
const SAMPLE_SIZE = 10;

let options = {};
const dimension = { width: 0, height: 0 };
let offCanvas = null;

const tinyFaceDetectOption = new faceapi.TinyFaceDetectorOptions({ inputSize: 320 });

async function processImage() {
    try {
        // check objects
        objectDetect(this);
        // check Pose
        poseDetect(this);
        // check face
        faceDetect(this);
        // //check Motion
        motionDetect(this);
    } catch (err) {
        console.log('estimation error', err);
        return [];
    }
    setTimeout(() => {
        processImage();
    }, 50);
}

async function objectDetect(context) {
    if (!coco) {
        return;
    }

    const predictions = await coco.detect(offCanvas);
    // console.log('COCO', predictions);
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
    // console.log('FACE', predictions);

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
    // console.log('POSE', predictions);
    context.postMessage({ type: 'pose', message: { predictions, adjacents } });
}

async function motionDetect(context) {
    const { width, height } = dimension;
    // const imageData = await decodePixelsFromOffscreenCanvas(offCanvas);

    // const data = imageData.data;
    // const motion = [];
    // const motions = { total: 0, maxPoint: { score: 0, x: -10, y: -10 }, motion: [] };
    // for (let y = 0; y < height; y += SAMPLE_SIZE) {
    //     for (let x = 0; x <= width; x += SAMPLE_SIZE) {
    //         const pos = (x + y * width) * 4;
    //         const r = data[pos];
    //         const g = data[pos + 1];
    //         const b = data[pos + 2];
    //         // const a = data[pos + 3];

    //         const currentPos = previousFrame[pos] || { r: 0, g: 0, b: 0, a: 0 };
    //         const rDiff = Math.abs(currentPos.r - r);
    //         const gDiff = Math.abs(currentPos.g - g);
    //         const bDiff = Math.abs(currentPos.b - b);
    //         const areaMotionScore = rDiff + gDiff + bDiff / (SAMPLE_SIZE * SAMPLE_SIZE);

    //         motion.push({
    //             x,
    //             y,
    //             r,
    //             g,
    //             b,
    //         });
    //         if (
    //             rDiff > BRIGHTNESS_THRESHOLD
    //             // ||
    //             // gDiff > BRIGHTNESS_THRESHOLD ||
    //             // bDiff > BRIGHTNESS_THRESHOLD
    //         ) {
    //             if (motions.maxPoint.score < areaMotionScore) {
    //                 motions.maxPoint.x = x;
    //                 motions.maxPoint.y = y;
    //                 motions.maxPoint.score = areaMotionScore;
    //             }
    //         }

    //         motions.total += areaMotionScore;
    //         previousFrame[pos] = { r, g, b };
    //     }
    // }
    // motions.motion = motion;
    // // motions.motion = motion;
    // context.postMessage({ type: 'motion', message: motions });
}

// worker 메시지 수신 listener
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
            if (mobileNet && coco && !isInitialized) {
                isInitialized = true;
                processImage(image);
            }
            break;
        case 'option':
            options = e.data.option;
            break;
    }
};
