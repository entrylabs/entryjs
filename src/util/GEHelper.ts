import PIXIHelper from '../class/pixi/helper/PIXIHelper';


class _GEHelper {

    private _isWebGL:boolean = false;

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


}

export const GEHelper:_GEHelper = new _GEHelper();


