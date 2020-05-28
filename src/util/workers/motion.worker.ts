import { clamp } from 'lodash';

const ctx: Worker = self as any;

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

let motions: Pixel[][];

const _SAMPLE_SIZE: number = 15;
const _BOUNDARY_OFFSET: number = 4;
const _SAME_COORDINATE_COMPENSATION: number = 10; // assumption weight that there is no movement within frame

const dimension = {
    height: 0,
    width: 0,
};

ctx.onmessage = async function(e: {
    data: {
        type: String;
        width: number;
        height: number;
        range: ImageRange;
        image: ImageData;
    };
}) {
    const { type } = e.data;
    switch (type) {
        case 'init':
            dimension.width = e.data.width;
            dimension.height = e.data.height;
            motions = [...Array(dimension.height / _SAMPLE_SIZE)].map((e) =>
                Array(dimension.width / _SAMPLE_SIZE)
            );
            break;
        case 'motion':
            calcMotion(e.data);
            break;
        default:
            break;
    }
};

function calcMotion(params: {
    type: String;
    width: number;
    height: number;
    range: ImageRange;
    image: ImageData;
}) {
    const { minX, maxX, minY, maxY } = params.range;
    const data = params.image.data;
    let areaMotion = 0;
    let totalMotionDirectionX = 0;
    let totalMotionDirectionY = 0;
    for (let y = minY; y < maxY; y += _SAMPLE_SIZE) {
        for (let x = minX; x < maxX; x += _SAMPLE_SIZE) {
            const pos = (x + y * dimension.width) * 4;
            const r = data[pos];
            const g = data[pos + 1];
            const b = data[pos + 2];
            // const a = data[pos + 3];
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
        motions,
    };
    ctx.postMessage({ type: 'all', message: result });
}
