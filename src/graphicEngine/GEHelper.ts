import PIXIHelper from '../class/pixi/helper/PIXIHelper';
import Texture = PIXI.Texture;
import { PIXIGlobal } from '../class/pixi/init/PIXIGlobal';
import { PIXIAtlasHelper } from '../class/pixi/atlas/PIXIAtlasHelper';
import { PIXIAtlasManager } from '../class/pixi/atlas/PIXIAtlasManager';
import { GEDragHelper } from './GEDragHelper';
import { PIXIText } from '../class/pixi/text/PIXIText';
import { IGEResManager } from './IGEResManager';
import { EaselResManager } from './EaselResManager';




declare let createjs:any;

interface IGraphicsEngineApplication {
    render():void;
    stage:PIXI.Container|any;
    destroy(destroyOption:any):void;


}

class CreateJsApplication implements IGraphicsEngineApplication {

    stage:any;

    constructor(canvas:HTMLCanvasElement) {
        let stage = new createjs.Stage(canvas.id);
        createjs.Touch.enable(stage);
        stage.enableMouseOver(10);
        stage.mouseMoveOutside = true;
        this.stage = stage;
    }
    render():void {
        this.stage.update();
    }
    destroy(destroyOption:any) {
        this.stage = null;
    }
}

export class GEHelperBase {

    protected _isWebGL:boolean = false;

    get isWebGL():boolean { return this._isWebGL; }

    INIT(isWebGL:boolean):this {
        this._isWebGL = isWebGL;
        return this;
    }
}
class _GEHelper extends GEHelperBase {

    INIT(isWebGL:boolean):this {
        super.INIT(isWebGL);
        GEDragHelper.INIT(isWebGL);
        this.colorFilter = new _ColorFilterHelper().INIT(isWebGL);
        this.textHelper = new _TextHelper().INIT(isWebGL);
        if(this._isWebGL) {
            PIXIGlobal.initOnce();
            this.rotateRead = 180 / Math.PI;
            this.rotateWrite = Math.PI / 180;
            this.resManager = PIXIGlobal.atlasManager;
        } else {
            this.resManager = new EaselResManager();
        }
        this.resManager.INIT();
        return this;
    }

    public resManager:IGEResManager;
    public textHelper:_TextHelper;
    public colorFilter:_ColorFilterHelper;

    /**  pixi 객체로부터 rotate를 읽을 때 사용할 값 */
    public rotateRead:number = 1;

    /**  pixi 객체에 rotate를 할당 할 때 사용할 값 */
    public rotateWrite:number = 1;




    newApp(canvas:HTMLCanvasElement):IGraphicsEngineApplication {
        let app:IGraphicsEngineApplication;
        if(this._isWebGL) {
            app = PIXIGlobal.getNewApp(canvas);
        } else {
            app = new CreateJsApplication(canvas);
        }
        return app;
    }


    cloneStamp(entity:any):any {
        if(this._isWebGL) {
            let orgObj = entity.object;
            let object = PIXIHelper.sprite('StampEntity', orgObj.texture);
            object.visible = orgObj.visible;
            object.interactive = false;
            object.interactiveChildren = false;
            object.setTransform(
                orgObj.x,
                orgObj.y,
                orgObj.scale.x,
                orgObj.scale.y,
                orgObj.rotation,
                orgObj.skew.x,
                orgObj.skew.y,
                orgObj.pivot.x,
                orgObj.pivot.y
            );
            return object;
        } else {
            let object = entity.object.clone();
            object.mouseEnabled = false;
            object.tickEnabled = false;
            object.filters = null;
            return object;
        }
    }

    hitTestMouse(object:any):boolean {
        if(this._isWebGL) {
            let pixiApp:PIXI.Application;
            let im = pixiApp.renderer.plugins.interaction;
            let hitObject = im.hitTest(im.mouse.global, object);
            return !!hitObject;
        } else {
            const stage = Entry.stage.canvas;
            const pt = object.globalToLocal(stage.mouseX, stage.mouseY);
            return object.hitTest(pt.x, pt.y);
        }
    }

    getTransformedBounds(sprite:PIXI.Sprite|any):PIXI.Rectangle|any {
        if(this._isWebGL) {
            return sprite.getBounds(false);
        } else {
            return sprite.getTransformedBounds();
        }
    }
    
    newContainer(debugName?:string):PIXI.Container|any {
        if(this._isWebGL) {
            return PIXIHelper.container(debugName);
        } else {
            return new createjs.Container();
        }
    }

    newTexture(path:string):Texture|HTMLImageElement {
        if(this._isWebGL) {
            return Texture.fromImage(path);
        } else {
            let img:HTMLImageElement = new Image();
            img.src = path;
            return img;
        }
    }

    newSpriteWithTex(tex?:any) {
        if(this._isWebGL) {
            return new PIXI.Sprite(tex);
        } else {
            return new createjs.Bitmap(tex);
        }
    }

    newSpriteWithURL(url:string) {
        if(this._isWebGL) {
            //todo [박봉배] PIXISprite로 변경
            return PIXI.Sprite.from(url);
        } else {
            return new createjs.Bitmap(url);
        }
    }

    newSpriteWithCallback(url:string, callback:()=>void) {
        let img = new Image();
        img.onload = ()=>{
            callback && callback();
        };
        img.src = url;
        if(this._isWebGL) {
            return PIXI.Sprite.from(img);
        } else {
            return new createjs.Bitmap(img);
        }
    }

    newGraphic() {
        if(this._isWebGL) {
            return new PIXI.Graphics();
        } else {
            return new createjs.Shape();
        }
    }





}

export const GEHelper:_GEHelper = new _GEHelper();
let w:any = window;
(w.GEHelper) = GEHelper;


class _ColorFilterHelper extends GEHelperBase {


    hue(value:number) {
        if(this._isWebGL) {
            const cmHue = new PIXI.filters.ColorMatrixFilter();
            return cmHue.hue(value);
        } else {
            const cmHue = new createjs.ColorMatrix();
            cmHue.adjustColor(0, 0, 0, value);
            const hueFilter = new createjs.ColorMatrixFilter(cmHue);
            return hueFilter;
        }
    }

    brightness(value:number) {
        if(this._isWebGL) {
            // todo [박봉배] 여기 /255 가 필요한가
            value /= 255;
        }
        // pixi 필터에 brightness 가 있지만, createjs 와 matrix 값이 달라 결과가 다르게 보임. 그래서 동일하게 구현함.
        const matrix = [
            1, 0, 0, 0, value,
            0, 1, 0, 0, value,
            0, 0, 1, 0, value,
            0, 0, 0, 1, 0,
            0, 0, 0, 0, 1,
        ];
        return this.newColorMatrixFilter(matrix);
    }

    /**
     * @param matrixValue
     */
    newColorMatrixFilter(matrixValue:number[]) {
        if(this._isWebGL) {
            matrixValue.length = 20; // pixi matrix 는 5 * 4
            let m = new PIXI.filters.ColorMatrixFilter();
            m.matrix = matrixValue;
            return m;
        } else {
            //createjs matrix 는 5*5
            let cm = new createjs.ColorMatrix();
            cm.copy(matrixValue);
            return new createjs.ColorMatrixFilter(cm);
        }
    }

    /**
     *
     * @param target - EntityObject
     * @param cache
     */
    setCache(entiy:any, cache:boolean) {
        if(this._isWebGL) {

        } else {
            cache ? entiy.cache() : entiy.object.uncache();
        }
    }

}

class _TextHelper extends GEHelperBase {

    setColor(target:PIXI.Text|any, color:string) {
        if(this._isWebGL) {
            target.style.fill = color;
        } else {
            target.color = color;
        }
    }

    /**
     * @param str
     * @param font size & fontface - 10pt NanumGothic
     * @param color css style color - #ffffff
     * @param textBaseline
     * @param textAlign
     * @
     */
    newText(str:string, font:string, color:string, textBaseline?:string, textAlign?:string):PIXI.Text|any {
        if(this._isWebGL) {
            return PIXIHelper.text(str, font, color, textBaseline, textAlign);
        } else {
            let t = new createjs.Text(str, font, color);
            textBaseline ? t.textBaseline = textBaseline : 0;
            textAlign ? t.textAlign = textAlign : 0;
            return t;
        }
    }

}