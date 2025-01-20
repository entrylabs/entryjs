import { DisplayObject } from 'pixi.js';
import { PIXIGraphics } from '../helper/PIXIHelper';

interface IRBG {
    r: number;
    g: number;
    b: number;
}

/**
 * createjs.Graphics 스타일의 lagacy 메서드 호출을 pixi.Graphics 로 변경해주는 adaptor 클라스.
 */
export class PIXIPaintAdaptor {
    //아래 값들은 다른 클래스에서 값을 할당해줌.
    public rgb: IRBG;
    public thickness: number;
    public opacity: number;
    /** [박봉배] 추측 - drawing 중인지 아닌지를 저장하는 값으로 생각 됨. */
    public stop: boolean;

    /** [박봉배] 추측 - 이 브러시가 따라다녀야 할 대상 */
    public entity: DisplayObject;

    //아래 값들은 내부에서만 사용함.
    private _alpha: number = 1;
    private _thickness: number;
    private _color: number;

    private _shape: PIXIGraphics;

    private currentPath: PIXI.Polygon;

    endFill() {
        // #10141 때문에 closePath 사용안함.
        if (!this._shape || this._shape.destroyed) {
            return;
        }
        this.currentPath = null;
        this._shape.closePath();
    }

    beginFill(color: string) {
        this._parseRGBCssStyleColor(color);
        this._shape.beginFill(this._color, this._alpha);
    }

    beginFillFast(color: number, alpha: number) {
        this._color = color;
        this._alpha = alpha;
        this._shape.beginFill(color, alpha);
    }

    moveTo(x: number, y: number) {
        if (!this._shape || this._shape.destroyed) {
            return;
        }
        this._shape.moveTo(Number(x), Number(y));
        this.currentPath = this._shape.currentPath;
    }

    lineTo(x: number, y: number) {
        if (!this._shape || this._shape.destroyed) {
            return;
        }
        if (!this.currentPath) {
            this._shape.moveTo(0, 0);
            this.currentPath = this._shape.currentPath;
        }
        const points = this.currentPath.points;
        const fromX = points[points.length - 2];
        const fromY = points[points.length - 1];
        if (fromX !== x || fromY !== y) {
            points.push(Number(x), Number(y));
        }
        this._shape.currentPath = this.currentPath;
        this._shape.lineTo(Number(x), Number(y)); // 박봉배: #9374 x,y 좌표가 문자로 넘어와서 생긴 이슈
        this._shape.geometry.invalidate();
    }

    /** @param shape - drawing 을 할 대상을 지정 */
    internalSetShape(shape: PIXIGraphics) {
        this._shape = shape;
        this._setStyle();
    }

    _setStyle() {
        if (!this._shape || this._shape.destroyed) {
            return;
        }
        this._shape.lineStyle(this._thickness, this._color, this._alpha);
    }

    _parseRGBCssStyleColor(colorOld: string) {
        const color = colorOld.replace('/s/', '');
        if (color[0] == '#') {
            this._color = parseInt(color.replace('#', ''), 16);
            return;
        }

        let result;

        //rgb 보다 rgba 문자열을 더 많이 사용하는것 같아 이 조건문을 위로 올림
        if ((result = /^rgba\((\d+),(\d+),(\d+),(\d+(\.?\d*))\)$/i.exec(color))) {
            this._color = this._RGBToNumber(result);
            this._alpha = Number(result[4]);
            return;
        }

        if ((result = /^rgb\((\d+),(\d+),(\d+)\)$/i.exec(color))) {
            this._color = this._RGBToNumber(result);
        }
    }

    _RGBToNumber(regexResult: any[]) {
        const [x, r, g, b] = regexResult;
        return (r << 16) + (g << 8) + Number(b);
    }
    // Matched the method name to createjs for fulfilling the purpose of wrapper class (#11626)
    clear() {
        const { x = 0, y = 0 } = this.entity || {};
        this._shape.clear();
        // Disconnect the previously continued path
        this._shape.moveTo(x, -y);
    }
}
