let mobileNet;
let coco;

const previousFrame = [];
const BRIGHTNESS_THRESHOLD = 5;
const SAMPLE_SIZE = 20;
let options = {};
const dimension = { width: 0, height: 0 };

async function processImage(imageData) {
    try {
        // check objects
        await objectDetect(imageData, this);
        // check Pose
        await poseDetect(imageData, this);
        //check Motion
        motionDetect(imageData, this);
    } catch (err) {
        console.log('estimation error', err);
        return [];
    }
}

async function objectDetect(imageData, context) {
    const predictions = await coco.detect(imageData);
    // bbox=>[x,y,width,height]
    // console.log('COCO', predictions);
    context.postMessage({ type: 'coco', message: predictions });
}

async function poseDetect(imageData, context) {
    const currentFlipStatus = options.flipStatus ? options.flipStatus.horizontal : true;
    const predictions = await mobileNet.estimateMultiplePoses(imageData, {
        flipHorizontal: currentFlipStatus,
        maxDetections: 4,
        scoreThreshold: 0.5,
        nmsRadius: 20,
    });
    const adjacents = [];

    predictions.forEach((pose) => {
        const adjacentMap = posenet.getAdjacentKeyPoints(pose.keypoints, 0.2);
        adjacents.push(adjacentMap);
    });

    // console.log('POSE', predictions);
    context.postMessage({ type: 'pose', message: { predictions, adjacents } });
}

function motionDetect(imageData, context) {
    const { width, height } = dimension;
    const data = imageData.data;
    const motion = [];
    const motionScores = { total: 0, left: 0, right: 0, top: 0, bottom: 0 };
    for (let y = 0; y < height; y += SAMPLE_SIZE) {
        for (let x = 0; x < width; x += SAMPLE_SIZE) {
            const pos = (x + y + width) * 4;
            const r = data[pos];
            const g = data[pos + 1];
            const b = data[pos + 2];
            // const a = data[pos + 3];

            const currentPos = previousFrame[pos] || { r: 0, g: 0, b: 0, a: 0 };
            const rDiff = Math.abs(currentPos.r - r);
            const gDiff = Math.abs(currentPos.g - g);
            const bDiff = Math.abs(currentPos.b - b);
            if (
                rDiff > BRIGHTNESS_THRESHOLD ||
                gDiff > BRIGHTNESS_THRESHOLD ||
                bDiff > BRIGHTNESS_THRESHOLD
            ) {
                motion.push({
                    x,
                    y,
                    r: rDiff,
                    g: gDiff,
                    b: bDiff,
                });
            }
            // area calc => (640 *360)/400  = 576, Mult 1000 for scale up
            const areaMotionScore = ((rDiff + gDiff + bDiff) / (3 * 255 * 576)) * 1000;
            motionScores.total += areaMotionScore;
            if (x < width / 2) {
                motionScores.right = motionScores.right + areaMotionScore;
            } else {
                motionScores.left = motionScores.left + areaMotionScore;
            }

            if (y < height / 2) {
                motionScores.top = motionScores.top + areaMotionScore;
            } else {
                motionScores.bottom = motionScores.bottom + areaMotionScore;
            }
            previousFrame[pos] = { r, g, b };
        }
    }
    motionScores.total = motionScores.total.toFixed(2);
    motionScores.right = motionScores.right.toFixed(2);
    motionScores.left = motionScores.left.toFixed(2);
    motionScores.bottom = motionScores.bottom.toFixed(2);
    motionScores.top = motionScores.top.toFixed(2);
    // console.log('MOTION', motionScores);
    context.postMessage({ type: 'motion', message: motionScores });
}

// worker 메시지 수신 listener
self.onmessage = async function(e) {
    const { type, video } = e.data;
    switch (type) {
        case 'init':
            dimension.width = e.data.width;
            dimension.height = e.data.height;
            importScripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs');
            importScripts('https://cdn.jsdelivr.net/npm/@tensorflow-models/posenet');
            importScripts('https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd');
            mobileNet = await posenet.load({
                architecture: 'MobileNetV1',
                outputStride: 16,
                inputResolution: { width: e.data.width, height: e.data.height },
                multiplier: 1,
            });
            coco = await cocoSsd.load();

            this.postMessage({ type: 'init', message: 'done' });
            break;
        case 'estimate':
            if (mobileNet && coco) {
                processImage(e.data.imageData);
            }
            break;
        case 'option':
            options = e.data.option;
    }
};
