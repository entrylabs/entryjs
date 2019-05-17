
import DestroyOptions = PIXI.DestroyOptions;
import Texture = PIXI.Texture;
import { PIXISprite } from '../plugins/PIXISprite';


export class PIXIGraphics extends PIXI.Graphics {
    
    destroyed:boolean = false;
    
    destroy(options?: DestroyOptions | boolean) {
        this.destroyed = true;
        super.destroy(options);
    }
}



let PIXITempStore:any = require('../etc/PIXITempStore').PIXITempStore;
let PIXIText:any = require('../text/PIXIText').PIXIText;

export default class PIXIHelper {

    static sprite(debugName?:string, texture?:Texture):PIXI.Sprite {
        return new PIXISprite(texture);
    }

    static container(debugName?:string):PIXI.Container {
        return new PIXI.Container();
    }

    static text(str:string, font:string, color:string, textBaseline:string, textAlign:string) {
        // console.log(str, font);
        var reg = /((\d+)(pt|sp|px))?\s*(.+)/gi;
        var result:any[] = reg.exec(font) || [];
        var fontName = (result[4]) || "NanumGothic";
        var size = (result[1]) || "10pt";

        const nColor = parseInt(color.replace("#", "0x")) || 0;
        // var t = new PIXI.Text(str, {
        var t = new PIXIText(str, {
            fontFamily: fontName,
            fontSize: size,
            fill: nColor,
            // textBaseline: textBaseline || 'alphabetic',
            textBaseline: "middle",
            align: textAlign || "left",
            miterLimit: 2.5 //createjs default value,
            ,padding: 5 //바운드를 삐져나오는 경우를 대비한 패딩
        });
        return t;
    }

    static getOffScreenCanvas(forceHTMLCanvas:boolean = false):HTMLCanvasElement {
        forceHTMLCanvas = true;
        var WIN:any = window;
        if( !forceHTMLCanvas && ("OffscreenCanvas" in WIN) ) {
            return new WIN.OffscreenCanvas(1,1);
        } else {
            return document.createElement('canvas');
        }
    }

    /**
     * #ff00ff --> 0xff00ff
     * @param strColor
     */
    static colorToUint(strColor:any) {
        return strColor ? Number(strColor.replace("#", "0x")) : undefined;
    }


    static todo(msg:string) {

    }

    static newPIXIGraphics() {
        return new PIXIGraphics(false);
    }

    static randomRGBAString(alpha:number=0.3):string {
        var rr = this._rand255;
        return `rgba(${rr()},${rr()},${rr()},${alpha})`
    }

    private static _rand255():number {
        return Math.floor(Math.random()*255);
    }

    /**
     * createjs.DisplayObject#getTransformBound()
     * @param {PIXI.DisplayObject} target
     */
    static getTransformBound(target:any) {
        var bounds = target.getLocalBounds(PIXITempStore.rect);

        var x = bounds.x, y = bounds.y, width = bounds.width, height = bounds.height;
        var mtx = PIXITempStore.matrix1;
        target.localTransform.copy(mtx);

        if (x || y) {
            var mat2 = PIXITempStore.matrix2.identity().translate(-x,-y);
            mtx.append(mat2);
        }

        var x_a = width*mtx.a, x_b = width*mtx.b;
        var y_c = height*mtx.c, y_d = height*mtx.d;
        var tx = mtx.tx, ty = mtx.ty;

        var minX = tx, maxX = tx, minY = ty, maxY = ty;

        if ((x = x_a + tx) < minX) { minX = x; } else if (x > maxX) { maxX = x; }
        if ((x = x_a + y_c + tx) < minX) { minX = x; } else if (x > maxX) { maxX = x; }
        if ((x = y_c + tx) < minX) { minX = x; } else if (x > maxX) { maxX = x; }

        if ((y = x_b + ty) < minY) { minY = y; } else if (y > maxY) { maxY = y; }
        if ((y = x_b + y_d + ty) < minY) { minY = y; } else if (y > maxY) { maxY = y; }
        if ((y = y_d + ty) < minY) { minY = y; } else if (y > maxY) { maxY = y; }

        bounds.x = minX;
        bounds.y = minY;
        bounds.width = maxX-minX;
        bounds.height = maxY-minY;
        return bounds;
    }


}

