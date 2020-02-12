let mobileNet;
let coco;

const previousFrame = [];
const BRIGHTNESS_THRESHOLD = 10;
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
        scoreThreshold: 0.6,
        nmsRadius: 20,
    });
    const adjacents = [];

    predictions.forEach((pose) => {
        const btwnEyes = {
            x: (pose.keypoints[1].position.x + pose.keypoints[2].position.x) / 2,
            y: (pose.keypoints[1].position.y + pose.keypoints[2].position.y) / 2,
        };
        const nose = pose.keypoints[0].position;
        const mouse = {
            score: '-1',
            part: 'mouse',
            position: {
                x: nose.x * 2 - btwnEyes.x,
                y: nose.y * 2 - btwnEyes.y,
            },
        };
        pose.keypoints[21] = mouse;
        const adjacentMap = posenet.getAdjacentKeyPoints(pose.keypoints, 0.1);
        adjacents.push(adjacentMap);
    });

    // console.log('POSE', predictions);
    context.postMessage({ type: 'pose', message: { predictions, adjacents } });
}

function motionDetect(imageData, context) {
    const { width, height } = dimension;
    const data = imageData.data;
    const motion = [];
    const motions = { total: 0, maxPoint: { score: 0, x: -1, y: -1 } };
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
            const areaMotionScore = rDiff + gDiff + bDiff;

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
                if (motions.maxPoint.score < areaMotionScore) {
                    motions.maxPoint.x = x;
                    motions.maxPoint.y = y;
                    motions.maxPoint.score = areaMotionScore;
                }
            }
            motions.total += areaMotionScore;
            previousFrame[pos] = { r, g, b };
        }
    }
    context.postMessage({ type: 'motion', message: motions });
}

// worker 메시지 수신 listener
self.onmessage = async function(e) {
    const { type, video } = e.data;
    switch (type) {
        case 'init':
            dimension.width = e.data.width;
            dimension.height = e.data.height;
            importScripts(`${self.location.origin}/aimodules/tfjscore.js`);
            importScripts(`${self.location.origin}/aimodules/posenet.js`);
            importScripts(`${self.location.origin}/aimodules/cocossd.js`);
            console.log('loadDone');
            mobileNet = await posenet.load({
                architecture: 'MobileNetV1',
                outputStride: 16,
                inputResolution: { width: e.data.width, height: e.data.height },
                multiplier: 1,
            });
            coco = await cocoSsd.load({
                base: 'lite_mobilenet_v2',
            });

            this.postMessage({ type: 'init', message: 'done' });
            break;
        case 'estimate':
            if (mobileNet && coco) {
                processImage(e.data.imageData);
            }
            break;
        case 'option':
            options = e.data.option;
            break;
    }
};
