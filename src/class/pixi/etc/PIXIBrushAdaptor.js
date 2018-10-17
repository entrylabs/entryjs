/**
 * createjs.Graphics 스타일의 lagacy 메서드 호출을 pixi.Graphics 로 변경해주는 adaptor 클라스.
 */
export class PIXIBrushAdaptor {
    constructor() {
        //아래 값들은 다른 클래스에서 값을 할당해줌.
        this.rgb = undefined;
        this.thickness = undefined;
        this.stop = undefined;
        this.opacity = undefined;

        //private 아래 값들은 내부에서만 사용함.
        this._alpha = 1;
        this._thickness =undefined;
        this._shape = null;
    }

    endStroke() {
        if(!this._shape) return;
        this._shape.closePath();
    }

    /**
     * @param {string} color - "#FF0000", "rgba(255,0,0,0.5)"
     */
    beginStroke(color) {
        this._parseRGBCssStyleColor(color);
        this._setStyle();
    }



    setStrokeStyle(thickness) {
        this._thickness = thickness;
        this._setStyle();
    }

    moveTo(x, y) {
        if(!this._shape) return;
        this._shape.moveTo(x, y);
    }

    lineTo(x, y) {
        if(!this._shape) return;
        this._setStyle();
        this._shape.lineTo(x, y);
    }

    /**
     * drawing 을 할 대상
     * @param {PIXI.Graphics} shape
     */
    internal_setShape(shape) {
        this._shape = shape;
        this._setStyle();
    }

    _setStyle() {
        if(!this._shape) return;
        //console.log("setStyle", this._thickness, this._color, this._alpha);
        this._shape.lineStyle(this._thickness, this._color, this._alpha);
    }

    _parseRGBCssStyleColor(color) {
        color  = color.replace("/\s/", "");
        if(color[0] == "#") {
            this._color = parseInt(color.replace("#", ""), 16);
            return;
        }

        var result;

        if(result = (/^rgb\((\d+),(\d+),(\d+)\)$/i).exec(color)) {
            this._color = this._RGBToNumber(result);
        }

        if(result = (/^rgba\((\d+),(\d+),(\d+),(\d+(\.?\d*))\)$/i).exec(color)) {
            this._color = this._RGBToNumber(result);
            this._alpha = Number(result[4]);
        }
    }

    _RGBToNumber(regexResult) {
        var r = regexResult[1];
        var g = regexResult[2];
        var b = regexResult[3];
        return (r << 16) + (g << 8) + Number(b);
    }

}