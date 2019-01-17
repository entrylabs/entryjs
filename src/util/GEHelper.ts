import PIXIHelper from '../class/pixi/helper/PIXIHelper';
import Texture = PIXI.Texture;
import { PIXIGlobal } from '../class/pixi/init/PIXIGlobal';


declare let createjs:any;

class _GEHelper {

    INIT(isWebGL:boolean) {
        this._isWebGL = isWebGL;
    }

    private _isWebGL:boolean = true;

    get isWebGL():boolean { return this._isWebGL; }

    newStage(canvas:HTMLCanvasElement) {
        let stage:any;
        if(this._isWebGL) {
            let pixiApp = PIXIGlobal.getNewApp(canvas);
            stage = pixiApp.stage;
        } else {
            stage = new createjs.Stage(canvas.id);
            createjs.Touch.enable(stage);
            stage.enableMouseOver(10);
            stage.mouseMoveOutside = true;
        }
        return stage;
    }


    cloneStamp(entity:any):any {
        if(this._isWebGL) {
            let orgObj = entity.object;
            let object = PIXIHelper.sprite("StampEntity", orgObj.texture);
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

    newTexture(path:string) {
        if(this._isWebGL) {
            return Texture.fromImage(path);
        } else {
            let img = new Image();
            return img.src = path;
        }
    }

    newSpriteWithTex(tex?:any) {
        if(this._isWebGL) {
            return new PIXI.Sprite(tex);
        } else {
            return new createjs.Bitmap(tex);
        }
    }


}

export const GEHelper:_GEHelper = new _GEHelper();


