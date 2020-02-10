let mobileNet;

const previousFrame = [];
const BRIGHTNESS_THRESHOLD = 5;
const SAMPLE_SIZE = 40;

const dimension = { width: 0, height: 0 };

async function processImage(imageData) {
    try {
        // check Pose
        const poses = await mobileNet.estimateMultiplePoses(imageData, {
            flipHorizontal: true,
            maxDetections: 4,
            scoreThreshold: 0.5,
            nmsRadius: 20,
        });
        this.postMessage({ type: 'pose', message: poses });

        //check Motion
        const { width, height } = dimension;
        const data = imageData.data;
        const motion = [];
        for (let y = 0; y < height; y += SAMPLE_SIZE) {
            for (let x = 0; x < width; x += SAMPLE_SIZE) {
                const pos = (x + y + width) * 4;
                const r = data[pos];
                const g = data[pos + 1];
                const b = data[pos + 2];
                if (
                    previousFrame[pos] &&
                    (Math.abs(previousFrame[pos].r - r > BRIGHTNESS_THRESHOLD) ||
                        Math.abs(previousFrame[pos].g - g > BRIGHTNESS_THRESHOLD) ||
                        Math.abs(previousFrame[pos].b - b > BRIGHTNESS_THRESHOLD))
                ) {
                    motion.push({ x, y, r, g, b });
                }
                previousFrame[pos] = { r, g, b };
            }
        }
        this.postMessage({ type: 'motion', message: motion });
    } catch (err) {
        console.log('estimation error', err);
        return [];
    }
}

// worker 메시지 수신 listener
self.onmessage = async function(e) {
    const { type, video } = e.data;
    if (type === 'init') {
        const { width, height } = e.data;
        dimension.width = width;
        dimension.height = height;
        importScripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs');
        importScripts('https://cdn.jsdelivr.net/npm/@tensorflow-models/posenet');
        mobileNet = await posenet.load({
            architecture: 'MobileNetV1',
            outputStride: 16,
            inputResolution: { width, height },
            multiplier: 1,
        });
        this.postMessage({ type: 'init', message: 'done' });
        // this.estimatePoseOnImage(video);
    } else if (type === 'estimate') {
        const { imageData } = e.data;
        if (mobileNet) {
            processImage(imageData);
        }
    }
};
