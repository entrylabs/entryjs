import { clamp } from 'lodash';

const ctx: Worker = self as any;

type FLIP_NORMAL = 0;
type FLIP_HORIZONTAL = 1;
type FLIP_VERTICAL = 2;
type FLIP_BOTH = 3;
type TFlipState = FLIP_NORMAL | FLIP_HORIZONTAL | FLIP_VERTICAL | FLIP_BOTH;

type Pixel = {
    r: number;
    g: number;
    b: number;
    rDiff: number;
    gDiff: number;
    bDiff: number;
};

type ImageRange = {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
};

type TMessageData = {
    action: String;
    width?: number;
    height?: number;
    range?: ImageRange;
    imageBitmap?: ImageBitmap;
    flipState?: TFlipState;
    sprite?: any;
};

let motions: Pixel[][];

let wasmInstance;
let motionCanvas: OffscreenCanvas;
let motionCanvasCtx: OffscreenCanvasRenderingContext2D;
let detector;

const _SAMPLE_SIZE: number = 15;
const _BOUNDARY_OFFSET: number = 4;
const _SAME_COORDINATE_COMPENSATION: number = 10;

const dimension = {
    height: 0,
    width: 0,
};

const flipState = {
    NORMAL: 0,
    HORIZONTAL: 1,
    VERTICAL: 2,
    BOTH: 3,
};

ctx.onmessage = async function(e: { data: TMessageData }) {
    const { action } = e.data;
    switch (action) {
        case 'init':
            init(e.data);
            break;
        case 'motion':
            calcMotion(e.data);
            break;
        default:
            break;
    }
};

function isFlipState(nowFlipState: TFlipState, type: string) {
    if (type === 'horizontal') {
        return nowFlipState === flipState.BOTH || nowFlipState === flipState.HORIZONTAL;
    } else if (type === 'vertical') {
        return nowFlipState === flipState.BOTH || nowFlipState === flipState.VERTICAL;
    }
}

async function init(data: TMessageData) {
    motionCanvas = new OffscreenCanvas(data.width, data.height);
    motionCanvasCtx = motionCanvas.getContext('2d');
    dimension.width = data.width;
    dimension.height = data.height;
    motions = [...Array(Math.ceil(dimension.height / _SAMPLE_SIZE))].map((e) =>
        Array(Math.ceil(dimension.width / _SAMPLE_SIZE))
    );
    ctx.postMessage({ action: 'init_complete' });
}

function calcMotion(data: TMessageData) {
    try {
        motionCanvasCtx.drawImage(data.imageBitmap, 0, 0);
        const imageData = motionCanvasCtx.getImageData(
            0,
            0,
            motionCanvas.width,
            motionCanvas.height
        ).data;
        const sprite = data.sprite;
        const flipState = data.flipState;
        let { minX, maxX, minY, maxY } = data.range;

        if (sprite) {
            const { x, y, width, height, scaleX, scaleY } = sprite;
            minX = motionCanvas.width / 2 + x - (width * scaleX) / 2;
            maxX = motionCanvas.width / 2 + x + (width * scaleX) / 2;
            minY = motionCanvas.height / 2 - y - (height * scaleY) / 2;
            maxY = motionCanvas.height / 2 - y + (height * scaleY) / 2;
            if (isFlipState(flipState, 'horizontal')) {
                const tempMinX = minX;
                minX = motionCanvas.width - maxX;
                maxX = motionCanvas.width - tempMinX;
            }
            if (isFlipState(flipState, 'vertical')) {
                const tempMinY = minY;
                minY = motionCanvas.height - maxY;
                maxY = motionCanvas.height - tempMinY;
            }
            minX = Math.floor(minX / _SAMPLE_SIZE) * _SAMPLE_SIZE;
            maxX = Math.floor(maxX / _SAMPLE_SIZE) * _SAMPLE_SIZE;
            minY = Math.floor(minY / _SAMPLE_SIZE) * _SAMPLE_SIZE;
            maxY = Math.floor(maxY / _SAMPLE_SIZE) * _SAMPLE_SIZE;
        }

        if (minX > maxX) {
            const temp = minX;
            minX = maxX;
            maxX = temp;
        }
        if (minY > maxY) {
            const temp = minY;
            minY = maxY;
            maxY = temp;
        }

        let areaMotion = 0;
        let totalMotionDirectionX = 0;
        let totalMotionDirectionY = 0;
        for (let y = minY; y < maxY; y += _SAMPLE_SIZE) {
            for (let x = minX; x < maxX; x += _SAMPLE_SIZE) {
                const pos = (x + y * dimension.width) * 4;
                const r = imageData[pos];
                const g = imageData[pos + 1];
                const b = imageData[pos + 2];
                // const a = imageData[pos + 3];
                const xLength = motions[0].length;
                const yLength = motions.length;

                const yIndex = y / _SAMPLE_SIZE;
                const xIndex = x / _SAMPLE_SIZE;
                if (yIndex > yLength - 1 || xIndex > xLength - 1 || xIndex < 0 || yIndex < 0) {
                    continue;
                }
                const currentPos = motions[yIndex][xIndex] || { r: 0, g: 0, b: 0 };
                const rDiff = Math.abs(currentPos.r - r);
                const gDiff = Math.abs(currentPos.g - g);
                const bDiff = Math.abs(currentPos.b - b);
                const areaMotionScore = rDiff + gDiff + bDiff / (_SAMPLE_SIZE * _SAMPLE_SIZE);

                const mostSimilar = { x: 0, y: 0, diff: 99999999 };

                /**
                 * 주변 픽셀 검사로 방향 체크, 가장 값이 비슷한 픽셀 위치로 이동했다 가정
                 * */
                // clamp를 통해서 out of bounds 검사
                const minScanY = clamp(yIndex - _BOUNDARY_OFFSET, 0, yLength - 1);
                const maxScanY = clamp(yIndex + _BOUNDARY_OFFSET, 0, yLength - 1);
                const minScanX = clamp(xIndex - _BOUNDARY_OFFSET, 0, xLength - 1);
                const maxScanX = clamp(xIndex + _BOUNDARY_OFFSET, 0, xLength - 1);
                for (let scopeY = minScanY; scopeY <= maxScanY; scopeY++) {
                    for (let scopeX = minScanX; scopeX <= maxScanX; scopeX++) {
                        const valuesNearPos = motions[scopeY][scopeX] || {
                            r: 0,
                            g: 0,
                            b: 0,
                        };
                        const rDiffScope = Math.abs(valuesNearPos.r - r);
                        const gDiffScope = Math.abs(valuesNearPos.g - g);
                        const bDiffScope = Math.abs(valuesNearPos.b - b);
                        let diff = rDiffScope + gDiffScope + bDiffScope;
                        // 같은 포지션에 있는 픽셀에 대해서 이동하지 않았다는 전제로 가중치를 추가
                        if (yIndex === scopeY && xIndex === scopeX) {
                            diff = diff - _SAME_COORDINATE_COMPENSATION;
                        }
                        if (diff < mostSimilar.diff) {
                            mostSimilar.x = scopeX;
                            mostSimilar.y = scopeY;
                            mostSimilar.diff = diff;
                        }
                    }
                }

                // 이미지 픽셀값 노이즈로 인한 부분들은 수용하지 않는다.
                if (mostSimilar.x > 1) {
                    totalMotionDirectionX += mostSimilar.x - xIndex;
                }
                if (mostSimilar.y > 1) {
                    totalMotionDirectionY += mostSimilar.y - yIndex;
                }
                areaMotion += areaMotionScore;

                motions[yIndex][xIndex] = {
                    r,
                    g,
                    b,
                    rDiff,
                    gDiff,
                    bDiff,
                };
            }
        }
        const result = {
            total: areaMotion,
            direction: {
                x: totalMotionDirectionX,
                y: totalMotionDirectionY,
            },
        };
        if (sprite) {
            ctx.postMessage({ action: 'sprite_return', result });
        } else {
            ctx.postMessage({ action: 'next_detect_motion', result });
        }
    } catch (e) {
        console.error(e);
    }
}
