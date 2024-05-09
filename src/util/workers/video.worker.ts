/**
 * nt11576 Lee.Jaewon
 * This is worker thread for video detection purpose without blocking main thread to avoid delayed UI update
 */

// load model right after mount
/**
 * preload를 위해 매직 넘버를 사용할수 밖에 없는 환경, 480,270 은 videoUtils.ts의 캔버스 크기
 */
import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as tf from '@tensorflow/tfjs';
// import * as faceapi from 'face-api.js';
const poseModel = poseDetection.SupportedModels.PoseNet;
const ctx: Worker = self as any;

type IndicatorType = 'pose' | 'face' | 'object';

type FlipStatus = {
    horizontal: boolean;
    vertical: boolean;
};

type PosKeyPoint = {
    part: string;
    position: {
        x: number;
        y: number;
    };
    score: number;
};
// instances, used as flag of handler class if each instances are loaded or not
let poseDetector: poseDetection.PoseDetector = null;
let coco: cocoSsd.ObjectDetection = null;
let faceLoaded: boolean = false;

// 메인 스레드에서 전달받은 이미지 프레임 반영용 캔버스
let offCanvas: OffscreenCanvas = null;

// 얼굴 인식 모델 옵션
// const tinyFaceDetectOption = new faceapi.TinyFaceDetectorOptions({ inputSize: 160 });

// flags if selected model(s) should estimate
let modelStatus = {
    pose: false,
    object: false,
    face: false,
};

// video Status
let options: {
    flipStatus: FlipStatus;
};

let isRunning = false;

const dimension = { width: 0, height: 0 };

async function processImage(repeat: boolean) {
    try {
        if (!repeat) {
            await objectDetect(true);
            await poseDetect(true);
            return;
        } else if (isRunning) {
            if (modelStatus.object) {
                objectDetect(false);
            }
            if (modelStatus.pose) {
                poseDetect(false);
            }
            // if (modelStatus.face) {
            //     faceDetect(false);
            // }
        } else {
            return;
        }
    } catch (err) {
        console.log('estimation error', err);
    }
    setTimeout(() => {
        processImage(true);
    }, 50);
}

//pre run for better performance on loading
async function warmup() {
    for (let i = 0; i < 10; i++) {
        await processImage(false);
        // console.log('warmup', (i + 1) * 10, '% done');
    }
}

async function objectDetect(force: boolean) {
    if ((!coco || !modelStatus.object) && !force) {
        return;
    }

    const offCanvasCtx = offCanvas.getContext('2d');
    const imageData = offCanvasCtx.getImageData(0, 0, offCanvas.width, offCanvas.height);

    const predictions = await coco.detect(imageData, 4);
    if (!force) {
        ctx.postMessage({ type: 'coco', message: predictions });
    }
}

async function faceDetect(force: boolean) {
    if ((!faceLoaded || !modelStatus.face) && !force) {
        return;
    }

    // const predictions = await faceapi
    //     .detectAllFaces(offCanvas, tinyFaceDetectOption)
    //     .withFaceLandmarks()
    //     .withAgeAndGender()
    //     .withFaceExpressions();
    // if (!force) {
    //     ctx.postMessage({ type: 'face', message: predictions });
    // }
}

async function poseDetect(force: boolean) {
    if ((!poseDetector || !modelStatus.pose) && !force) {
        return;
    }
    const currentFlipStatus = options.flipStatus ? options.flipStatus.horizontal : true;

    const offCanvasCtx = offCanvas.getContext('2d');
    const imageData = offCanvasCtx.getImageData(0, 0, offCanvas.width, offCanvas.height);

    const predictions = (await poseDetector.estimatePoses(
        imageData,
        {
            flipHorizontal: currentFlipStatus,
            // maxDetections: 4,
            maxPoses: 1,
            scoreThreshold: 0.75,
            // nmsRadius: 10,
        }
    )).map((pose) => ({
        keypoints: pose.keypoints.map((keypoint) => ({
            part: keypoint.name,
            position: {
                x: keypoint.x,
                y: keypoint.y,
            },
            score: keypoint.score
        })),
        score: pose.score
    }));
    const adjacents: PosKeyPoint[][][] = [];
    predictions.forEach((pose) => {
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
        pose.keypoints[21] = { part: 'neck', position: neckPos, score: 0.5 };
        //---------------------------------------
        const adjacentParis = poseDetection.util.getAdjacentPairs(poseModel);
        const adjacentMap = adjacentParis.map((pair) => {
            const [i, j] = pair;
            const kp1 = pose.keypoints[i];
            const kp2 = pose.keypoints[j];
            const score1 = kp1.score != null ? kp1.score : 1;
            const score2 = kp2.score != null ? kp2.score : 1;
            const scoreThreshold = 0.05;

            if (score1 >= scoreThreshold && score2 >= scoreThreshold) {
                return [kp1, kp2];
            }
            return undefined;
        }).filter(x => x);
        adjacents.push(adjacentMap);
    });
    if (!force) {
        ctx.postMessage({ type: 'pose', message: { predictions, adjacents } });
    }
}

ctx.onmessage = async function(e: {
    data: {
        type: String;
        width: number;
        height: number;
        option: { flipStatus: FlipStatus };
        image: ImageBitmap;
        target: IndicatorType;
        mode: String;
        weightsUrl: string;
    };
}) {
    const { type, weightsUrl } = e.data;
    switch (type) {
        case 'init':
            dimension.width = e.data.width;
            dimension.height = e.data.height;

            // faceapi.env.setEnv(faceapi.env.createNodejsEnv());
            // // MonkeyPatch때문에 생기는 TypeError, 의도된 방향이므로 수정 하지 말것
            // faceapi.env.monkeyPatch({
            //     Canvas: OffscreenCanvas,
            //     createCanvasElement: () => new OffscreenCanvas(dimension.width, dimension.height),
            // });

            offCanvas = new OffscreenCanvas(dimension.width, dimension.height);
            // 각각의 모델 pre-load
            await Promise.all([
                tf.ready(),
                poseDetection
                    .createDetector(
                        poseModel
                    ).then((detector) => {
                        poseDetector = detector;
                        this.postMessage({ type: 'init', message: 'pose' });
                    }),
                cocoSsd
                    .load({
                        base: 'lite_mobilenet_v2',
                    })
                    .then((cocoLoaded: cocoSsd.ObjectDetection) => {
                        coco = cocoLoaded;
                        // console.log('coco model loaded');
                        this.postMessage({ type: 'init', message: 'object' });
                    }),
                // Promise.all([
                //     faceapi.nets.tinyFaceDetector.loadFromUri(weightsUrl),
                //     faceapi.nets.faceLandmark68Net.loadFromUri(weightsUrl),
                //     faceapi.nets.ageGenderNet.loadFromUri(weightsUrl),
                //     faceapi.nets.faceExpressionNet.loadFromUri(weightsUrl),
                // ]).then(() => {
                //     faceLoaded = true;
                //     this.postMessage({ type: 'init', message: 'face' });
                // }),
            ]);
            await warmup();
            this.postMessage({ type: 'init', message: 'warmup' });

            // console.log('video worker loaded');
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
            const targetMode = mode === 'on';
            modelStatus[target] = targetMode;
            break;

        case 'pause':
            isRunning = false;
            break;

        case 'run':
            isRunning = true;
            processImage(true);
            break;

        case 'handleOff':
            modelStatus = {
                pose: false,
                object: false,
                face: false,
            };
            isRunning = false;
            break;
    }
};
