/**
 * 임시로 사용할 변수의 포인터 저장용.
 */
export class PIXITempStore {
    static init() {
        const T = this;
        T.point1 = new PIXI.Point();
        T.point2 = new PIXI.Point();
        T.rect1 = new PIXI.Rectangle();
        T.rect2 = new PIXI.Rectangle();
        T.matrix1 = new PIXI.Matrix();
        T.matrix2 = new PIXI.Matrix();
    }
}

