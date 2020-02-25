/**
 * nt11576 Lee.Jaewon
 * This is worker thread for detection purpose without blocking main thread to avoid delayed UI update
 */

const ctx: Worker = self as any;

const posenet = require('@tensorflow-models/posenet');
const cocoSsd = require('@tensorflow-models/coco-ssd');
const faceapi = require('face-api.js');
faceapi.env.setEnv(faceapi.env.createNodejsEnv());
faceapi.env.monkeyPatch({
    Canvas: OffscreenCanvas,
    createCanvasElement: () => new OffscreenCanvas(480, 270),
});

// instances, used as flag, handler class if each instances are loaded or not
let mobileNet: any = null;
let coco: any = null;
let faceLoaded: boolean = false;

// flags if selected model(s) should estimate
let modelStatus = {
    pose: false,
    object: false,
    face: false,
};

// video Status
let options: any;

const dimension = { width: 0, height: 0 };

// face detection option
const tinyFaceDetectOption = new faceapi.TinyFaceDetectorOptions({ inputSize: 320 });

// canvas drawing imageFrame passed from main thread
const offCanvas = new OffscreenCanvas(480, 270);

async function processImage() {
    try {
        objectDetect(this);
        poseDetect(this);
        faceDetect(this);
    } catch (err) {
        console.log('estimation error', err);
    }
    setTimeout(() => {
        processImage();
    }, 50);
}

async function objectDetect(context: any) {
    if (!coco || !modelStatus.object) {
        return;
    }

    const predictions = await coco.detect(offCanvas);
    context.postMessage({ type: 'coco', message: predictions });
}

async function faceDetect(context: any) {
    if (!faceLoaded || !modelStatus.face) {
        return;
    }

    const predictions = await faceapi
        .detectAllFaces(offCanvas, tinyFaceDetectOption)
        .withFaceLandmarks()
        .withAgeAndGender()
        .withFaceExpressions();

    context.postMessage({ type: 'face', message: predictions });
}

async function poseDetect(context: any) {
    if (!mobileNet || !modelStatus.pose) {
        return;
    }

    const currentFlipStatus = options.flipStatus ? options.flipStatus.horizontal : true;
    const predictions = await mobileNet.estimateMultiplePoses(offCanvas, {
        flipHorizontal: currentFlipStatus,
        maxDetections: 4,
        scoreThreshold: 0.6,
        nmsRadius: 20,
    });
    const adjacents: Array<any> = [];
    predictions.forEach((pose: any) => {
        // neck estimation by calculation, based on midst of shoulders and nose
        const leftShoulder = pose.keypoints[5];
        const rightShoulder = pose.keypoints[6];
        const nose = pose.keypoints[0];
        const neckPos = {
            x: ((leftShoulder.position.x + rightShoulder.position.x) / 2 + nose.position.x) / 2,
            y:
                (((leftShoulder.position.y + rightShoulder.position.y) / 2) * 1.5 +
                    nose.position.y * 0.5) /
                2,
        };
        pose.keypoints[21] = { part: 'neck', position: neckPos, score: -1 };
        //---------------------------------------
        const adjacentMap = posenet.getAdjacentKeyPoints(pose.keypoints, 0.1);
        adjacents.push(adjacentMap);
    });
    context.postMessage({ type: 'pose', message: { predictions, adjacents } });
}

ctx.onmessage = async function(e: {
    data: {
        type: String;
        width: number;
        height: number;
        option: any;
        image: ImageBitmap;
        target: String;
        mode: String;
    };
}) {
    const { type } = e.data;
    switch (type) {
        case 'init':
            dimension.width = e.data.width;
            dimension.height = e.data.height;
            const weightsUrl = `${self.location.origin}/lib/entry-js/weights`;

            posenet
                .load({
                    architecture: 'MobileNetV1',
                    outputStride: 16,
                    inputResolution: { width: e.data.width, height: e.data.height },
                    multiplier: 1,
                })
                .then((mobileNetLoaded: any) => {
                    console.log('posenet loaded');
                    mobileNet = mobileNetLoaded;
                });

            cocoSsd
                .load({
                    base: 'lite_mobilenet_v2',
                })
                .then((cocoLoaded: any) => {
                    console.log('coco loaded');
                    coco = cocoLoaded;
                });

            Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(weightsUrl),
                faceapi.nets.faceLandmark68Net.loadFromUri(weightsUrl),
                faceapi.nets.ageGenderNet.loadFromUri(weightsUrl),
                faceapi.nets.faceExpressionNet.loadFromUri(weightsUrl),
            ]).then(() => {
                console.log('face model loaded');
                faceLoaded = true;
            });
            console.log('video worker loaded');
            this.postMessage({ type: 'init', message: 'done' });
            processImage();
            break;
        case 'estimate':
            const image = e.data.image;
            const ctx = offCanvas.getContext('2d');
            ctx.drawImage(image, 0, 0, dimension.width, dimension.height);
            break;
        case 'option':
            options = e.data.option;
            break;

        case 'handle':
            const { target, mode } = e.data;
            const targetMode = mode === 'on' ? true : false;
            modelStatus[target] = targetMode;
            break;

        case 'handleOff':
            modelStatus = {
                pose: false,
                object: false,
                face: false,
            };
            break;
    }
};
