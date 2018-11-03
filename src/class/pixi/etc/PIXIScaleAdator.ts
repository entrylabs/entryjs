import Container = PIXI.Container;
import { IDestroyer } from '../../../util/destroyer/Destroyer';
import Sprite = PIXI.Sprite;
import { AtlasTexture } from '../atlas/texture/AtlasTexture';

export interface IPIXIScaleAdaptor extends IDestroyer{
    setX(value:number):void;
    setY(value:number):void;
    set(x:number, y:number):void;
}


export class PIXIContainerScaleAdaptor implements IPIXIScaleAdaptor {
    constructor(private target:Container) {
    }

    setX(value:number):void {
        this.target.scale.x = value;
    }

    setY(value:number):void {
        this.target.scale.y = value;
    }

    set(x:number, y:number):void {
        this.target.scale.set(x, y);
    }

    destroy():void {
        this.target = null;
    }
}


export class PIXISpriteScaleAdaptor implements IPIXIScaleAdaptor {
    constructor(private target:Sprite) {
    }

    setX(value:number):void {
        this.target.scale.x = value * this.getTexScale();
    }

    setY(value:number):void {
        this.target.scale.y = value * this.getTexScale();
    }

    set(x:number, y:number):void {
        var sf = this.getTexScale();
        this.target.scale.set(
            x ? x * sf : x,
            y ? y * sf : y
        );
    }

    destroy():void {
        this.target = null;
    }

    private getTexScale():number {
        var tex:AtlasTexture = this.target.texture as AtlasTexture;
        return tex ? tex.textureScaleFactor : 1;
    }
}