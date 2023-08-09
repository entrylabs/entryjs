self.importScripts('/lib/entry-js/extern/vision_bundle.js');

self.onmessage = async ({ data }) => {
    if (data.action === 'object_detector_init') {
        initializeObjectDetector(data);
    } else if (data.action === 'object_detector_change_option') {
        changeObjectDetectorOption(data.option);
    } else if (data.action === 'object_detector') {
        predictObjectDetector(data.imageBitmap);
    } else if (data.action === 'clear_object_detector') {
        clearPredictObjectDetector();
    }
};

let workerContext;
let drawingUtils;
let objectDetector;
let isPrevObjectDetector = false;
let countDetectedObject = 0;
let isDrawDetectedObjectDetector = false;

const initializeObjectDetector = async (data) => {
    const { canvas } = data;
    isDrawDetectedObjectDetector = data.isDrawDetectedObjectDetector;
    workerContext = canvas.getContext('2d');
    workerContext.font = '20px Arial';
    workerContext.lineWidth = 5;
    drawingUtils = new DrawingUtils(workerContext);
    const vision = await FilesetResolver.forVisionTasks('/lib/entry-js/extern/wasm');
    objectDetector = await ObjectDetector.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath: '/lib/entry-js/extern/model/object_detector_lite.tflite',
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
        if (!workerContext || !objectDetector) {
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

const names = {
    person: '사람',
    bicycle: '자전거',
    car: '자동차',
    motorcycle: '오토바이',
    airplane: '비행기',
    bus: '버스',
    train: '기차',
    truck: '트럭',
    boat: '보트',
    'traffic light': '신호등',
    'fire hydrant': '소화전',
    'stop sign': '정지 표지판',
    'parking meter': '주차 미터기',
    bench: '벤치',
    bird: '새',
    cat: '고양이',
    dog: '개',
    horse: '말',
    sheep: '양',
    cow: '소',
    elephant: '코끼리',
    bear: '곰',
    zebra: '얼룩말',
    giraffe: '기린',
    backpack: '배낭',
    umbrella: '우산',
    handbag: '핸드백',
    tie: '넥타이',
    suitcase: '여행 가방',
    frisbee: '원반',
    skis: '스키',
    snowboard: '스노보드',
    'sports ball': '공',
    kite: '연',
    'baseball bat': '야구 배트',
    'baseball glove': '야구 글러브',
    skateboard: '스케이트보드',
    surfboard: '서프보드',
    'tennis racket': '테니스 라켓',
    bottle: '병',
    'wine glass': '와인잔',
    cup: '컵',
    fork: '포크',
    knife: '나이프',
    spoon: '숟가락',
    bowl: '그릇',
    banana: '바나나',
    apple: '사과',
    sandwich: '샌드위치',
    orange: '오렌지',
    broccoli: '브로콜리',
    carrot: '당근',
    'hot dog': '핫도그',
    pizza: '피자',
    donut: '도넛',
    cake: '케이크',
    chair: '의자',
    couch: '소파',
    'potted plant': '화분',
    bed: '침대',
    'dining table': '식탁',
    toilet: '변기',
    tv: '텔레비전',
    laptop: '노트북',
    mouse: '마우스',
    remote: '리모컨',
    keyboard: '키보드',
    'cell phone': '핸드폰',
    microwave: '전자레인지',
    oven: '오븐',
    toaster: '토스터',
    sink: '싱크대',
    refrigerator: '냉장고',
    book: '책',
    clock: '시계',
    vase: '꽃병',
    scissors: '가위',
    'teddy bear': '테디베어',
    'hair dryer': '헤어드라이어',
    'tooth brush': '칫솔',
};
let offset = 0;
function drawObjectDetections(detect, i) {
    try {
        const { boundingBox, categories } = detect;
        const [category] = categories;
        const displayName = category.displayName || category.categoryName;
        const text = names[displayName] || displayName;

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
        workerContext.scale(-1, 1);
        workerContext.fillStyle = 'white';
        workerContext.fillText(text, -(m + l - 3), y + measureSize - 3 * e);
        workerContext.scale(-1, 1);
    } catch (e) {
        console.error(e.stack);
    }
}

const clearPredictObjectDetector = () => {
    console.log('clearPredictObjectDetector');
    isPrevObjectDetector = false;
    workerContext.clearRect(0, 0, 640, 360);
};
