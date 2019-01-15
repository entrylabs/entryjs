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
}

export const GEHelper:_GEHelper = new _GEHelper();

