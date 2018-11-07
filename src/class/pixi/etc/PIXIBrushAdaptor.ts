interface IRBG {
    r:number;
    g:number;
    b:number;
}

/**
 * createjs.Graphics 스타일의 lagacy 메서드 호출을 pixi.Graphics 로 변경해주는 adaptor 클라스.
 */
export class PIXIBrushAdaptor {

    //아래 값들은 다른 클래스에서 값을 할당해줌.
    public rgb:IRBG;
    public thickness:number;
    public opacity:number;
    /** [박봉배] 추측 - drawing 중인지 아닌지를 저장하는 값으로 생각 됨. */
    public stop:boolean;


    //아래 값들은 내부에서만 사용함.
    private _alpha:number = 1;
    private _thickness:number;
    private _shape:PIXI.Graphics;
    private _color:number;

    constructor() {
    }

    endStroke() {
        if(!this._shape) return;
        this._shape.closePath();
    }

    /** @param color - "#FF0000", "rgba(255,0,0,0.5)" */
    beginStroke(color:string) {
        this._parseRGBCssStyleColor(color);
        this._setStyle();
    }

    setStrokeStyle(thickness:number) {
        this._thickness = thickness;
        this._setStyle();
    }

    moveTo(x:number, y:number) {
        if(!this._shape) return;
        this._shape.moveTo(Number(x), Number(y)); //
    }

    lineTo(x:number, y:number) {
        if(!this._shape) return;
        this._setStyle(); // pixi webgl 오류 때문에 이것을 함.
        this._shape.lineTo(Number(x), Number(y)); // 박봉배: [https://oss.navercorp.com/entry/Entry/issues/9374] x,y 좌표가 문자로 넘어와서 생긴 이슈
    }

    /** @param shape - drawing 을 할 대상을 지정 */
    internal_setShape(shape:PIXI.Graphics) {
        this._shape = shape;
        this._setStyle();
    }

    _setStyle() {
        if(!this._shape) return;
        //console.log("setStyle", this._thickness, this._color, this._alpha);
        this._shape.lineStyle(this._thickness, this._color, this._alpha);
    }

    _parseRGBCssStyleColor(color:string) {
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

    _RGBToNumber(regexResult:any[]) {
        var r = regexResult[1];
        var g = regexResult[2];
        var b = regexResult[3];
        return (r << 16) + (g << 8) + Number(b);
    }

}