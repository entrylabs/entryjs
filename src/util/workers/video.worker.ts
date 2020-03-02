/**
 * nt11576 Lee.Jaewon
 * This is worker thread for video detection purpose without blocking main thread to avoid delayed UI update
 */

// load model right after mount
/**
 * preload를 위해 매직 넘버를 사용할수 밖에 없는 환경, 480,270 은 videoUtils.ts의 캔버스 크기
 */

const ctx: Worker = self as any;

type IndicatorType = 'pose' | 'face' | 'object';

const WIDTH = 480;
const HEIGHT = 270;

const posenet = require('@tensorflow-models/posenet');
const cocoSsd = require('@tensorflow-models/coco-ssd');
const faceapi = require('face-api.js');
faceapi.env.setEnv(faceapi.env.createNodejsEnv());
faceapi.env.monkeyPatch({
    Canvas: OffscreenCanvas,
    createCanvasElement: () => new OffscreenCanvas(WIDTH, HEIGHT),
});

// instances, used as flag of handler class if each instances are loaded or not
let mobileNet: any = null;
let coco: any = null;
let faceLoaded: boolean = false;
const weightsUrl = `${self.location.origin}/lib/entry-js/weights`;

// 메인 스레드에서 전달받은 이미지 프레임 반영용 캔버스
const offCanvas = new OffscreenCanvas(WIDTH, HEIGHT);

// 얼굴 인식 모델 옵션
const tinyFaceDetectOption = new faceapi.TinyFaceDetectorOptions({ inputSize: 320 });

// 각각의 모델 pre-load
posenet
    .load({
        architecture: 'MobileNetV1',
        outputStride: 16,
        inputResolution: { width: WIDTH, height: HEIGHT },
        multiplier: 0.5,
    })
    .then((mobileNetLoaded: any) => {
        mobileNet = mobileNetLoaded;
        console.log('posenet pre sample');
    });

cocoSsd
    .load({
        base: 'lite_mobilenet_v2',
    })
    .then((cocoLoaded: any) => {
        coco = cocoLoaded;
    });

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(weightsUrl),
    faceapi.nets.faceLandmark68Net.loadFromUri(weightsUrl),
    faceapi.nets.ageGenderNet.loadFromUri(weightsUrl),
    faceapi.nets.faceExpressionNet.loadFromUri(weightsUrl),
]).then(() => {
    faceLoaded = true;
});

// flags if selected model(s) should estimate
let modelStatus = {
    pose: false,
    object: false,
    face: false,
};

// video Status
let options: any;

const dimension = { width: 0, height: 0 };

async function processImage() {
    try {
        // await Promise.all([]);
        objectDetect(this), poseDetect(this), faceDetect(this);
    } catch (err) {
        console.log('estimation error', err);
    }
    requestAnimationFrame(processImage);
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
        // 어깨 위치와 코 위치를 기반으로 한 목 위치 계산
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
        const adjacentMap = posenet.getAdjacentKeyPoints(pose.keypoints, 0.05);
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
        target: IndicatorType;
        mode: String;
    };
}) {
    const { type } = e.data;
    switch (type) {
        case 'init':
            dimension.width = e.data.width;
            dimension.height = e.data.height;
            console.log('video worker loaded');
            this.postMessage({ type: 'init', message: 'done' });
            processImage();
            break;

        case 'estimate':
            // 이미지를 메인 스레드에서 전달 받은경우 이미지 프레임을 offScreenCanvas에 그린다
            const image = e.data.image;
            const ctx = offCanvas.getContext('2d');
            ctx.drawImage(image, 0, 0, dimension.width, dimension.height);
            break;

        case 'option':
            options = e.data.option;
            break;

        case 'handle':
            // 이미지 값을 전달해야하는지 여부에 대한 플래그값 조절
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
