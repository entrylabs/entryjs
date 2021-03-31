/**
 * 임시로 사용할 변수의 포인터 저장용.
 */
import { Point, Rectangle, Matrix } from 'pixi.js';

export class PIXITempStore {
    static point1: Point;
    static point2: Point;
    static rect1: Rectangle;
    static rect2: Rectangle;
    static matrix1: Matrix;
    static matrix2: Matrix;

    static init() {
        this.point1 = new Point();
        this.point2 = new Point();
        this.rect1 = new Rectangle();
        this.rect2 = new Rectangle();
        this.matrix1 = new Matrix();
        this.matrix2 = new Matrix();
    }
}
