/**
 * 텍스쳐가 너무 커서 리사이즈 된 경우에 그만큼 보정하기 위한 클래스.
 * 예를 들어 원본크기가 2048, 리사이즈를 1024로 했으면 scaleFactor = 2;
 * entity에서 scale = 5 로 설정하면
 * Sprite.scale = entiry.scale(5) * scaleFactor(2) = 10 이 된다.
 */
import { DisplayObject, Sprite, Point, ObservablePoint } from 'pixi.js';
import { IDestroyer } from '../../../util/destroyer/Destroyer';
import { AtlasTexture } from '../atlas/texture/AtlasTexture';

type AdaptorConstructor = new () => ScaleFactorNormalAdaptor;

export namespace PIXIScaleAdaptor {
    export function factory(target: DisplayObject): ScaleFactorNormalAdaptor {
        const clazz: AdaptorConstructor =
            target instanceof Sprite ? ScaleFactorSpriteAdaptor : ScaleFactorNormalAdaptor;
        const adaptor: ScaleFactorNormalAdaptor = new clazz();
        adaptor._internal_init(target);
        return adaptor;
    }
}

class ScaleFactorNormalAdaptor implements IDestroyer {
    public scale: ScaleFactorPoint;
    public pivot: ScaleFactorPoint;
    protected _target: DisplayObject;

    _internal_init(target: DisplayObject) {
        this._target = target;
        this.scale = new ScaleFactorPoint(target.scale, 'scale');
        this.pivot = new ScaleFactorPoint(target.pivot, 'pivot');
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

class ScaleFactorSpriteAdaptor extends ScaleFactorNormalAdaptor {
    updateScaleFactor() {
        const sp = this._target as Sprite;
        const tex = sp.texture as AtlasTexture;
        const sfx = tex.textureScaleFactorX;
        const sfy = tex.textureScaleFactorY;
        if (!sfx || !sfy) {
            return;
        }
        this.scale.internal_setScaleFactor(sfx, sfy);
        this.pivot.internal_setScaleFactor(1 / sfx, 1 / sfy);
    }
}

class ScaleFactorPoint {
    private _scaleX: number = 1;
    private _scaleY: number = 1;
    private _x: number = 0;
    private _y: number = 0;

    // eslint-disable-next-line no-useless-constructor
    constructor(protected _point: Point | ObservablePoint, protected name: string) {}

    internal_setScaleFactor(x: number, y: number) {
        this._scaleX = x;
        this._scaleY = y;
        this.set(this._x, this._y);
    }

    setX(value: number): void {
        this._x = value;
        this._point.x = value * this._scaleX;
    }

    setY(value: number): void {
        this._y = value;
        this._point.y = value * this._scaleY;
    }

    set(x: number, y: number): void {
        this._x = x;
        this._y = y || (y != 0 ? x : 0);
        this._point.set(this._x * this._scaleX, this._y * this._scaleY);
    }

    destroy(): void {
        this._point = null;
    }
}
