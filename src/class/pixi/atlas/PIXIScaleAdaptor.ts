/**
 * 텍스쳐가 너무 커서 리사이즈 된 경우에 그만큼 보정하기 위한 클래스.
 * 예를 들어 원본크기가 2048, 리사이즈를 1024로 했으면 scaleFactor = 2;
 * entity에서 scale = 5 로 설정하면
 * Sprite.scale = entiry.scale(5) * scaleFactor(2) = 10 이 된다.
 */

import { IDestroyer } from '../../../util/destroyer/Destroyer';
import { AtlasTexture } from '../atlas/texture/AtlasTexture';
import DisplayObject = PIXI.DisplayObject;
import Sprite = PIXI.Sprite;

export namespace PIXIScaleAdaptor {

    export function factory(target:DisplayObject):ScaleFactorNormalAdaptor {
        var clazz:any = target instanceof Sprite ? ScaleFactorSpriteAdaptor : ScaleFactorNormalAdaptor;
        var adaptor:ScaleFactorNormalAdaptor = new clazz();
        adaptor._internal_init(target);
        return adaptor;
    }
}


class ScaleFactorNormalAdaptor implements IDestroyer{

    public scale:ScaleFactorPoint;
    public pivot:ScaleFactorPoint;
    protected _target:DisplayObject;

    _internal_init(target:DisplayObject) {
        this._target = target;
        this.scale = new ScaleFactorPoint(target.scale, "scale");
        this.pivot = new ScaleFactorPoint(target.pivot, "pivot");
    }

    updateScaleFactor() {
        //do nothing
    }

    destroy() {
        this.pivot.destroy();
        this.scale.destroy();
        this._target = null;
        this.pivot = null;
        this.scale = null;
    }
}

class ScaleFactorSpriteAdaptor extends ScaleFactorNormalAdaptor{

    updateScaleFactor() {
        var sp = this._target as Sprite;
        var tex = sp.texture as AtlasTexture;
        var sf = tex.textureScaleFactor;
        if(!sf) return;
        this.scale.internal_setScaleFactor(sf);
        this.pivot.internal_setScaleFactor(1/sf);
    }
}


class ScaleFactorPoint {

    private _scale:number = 1;
    private _x:number = 0;
    private _y:number = 0;

    constructor(protected _point:PIXI.Point|PIXI.ObservablePoint, protected name:string) {

    }

    internal_setScaleFactor(value:number) {
        this._scale = value;
        this.set(this._x, this._y);
    }

    setX(value:number):void {
        this._x = value;
        this._point.x = value * this._scale;
    }

    setY(value:number):void {
        this._y = value;
        this._point.y = value * this._scale;
    }

    set(x:number, y:number):void {
        this._x = x;
        this._y = y || ((y != 0) ? x : 0);
        var sf = this._scale;
        this._point.set(
            this._x * sf,
            this._y * sf
        );
    }

    destroy():void {
        this._point = null;
    }
}