import { ImageRect } from '../../../maxrect-packer/geom/ImageRect';
import Rectangle = PIXI.Rectangle;
import BaseTexture = PIXI.BaseTexture;

export class EntryTextureBase extends PIXI.Texture {
    public textureScaleFactorX: number;
    public textureScaleFactorY: number;

    constructor(baseTexture: BaseTexture, imageRect: ImageRect) {
        const frame = new Rectangle(0, 0, imageRect.width, imageRect.height);
        super(baseTexture, frame);
        this.textureScaleFactorX = imageRect.scaleFactorX;
        this.textureScaleFactorY = imageRect.scaleFactorY;
    }

    assignTextureScaleFactor(target: PIXI.RenderTexture) {
        const tex: any = target;
        //textureScaleFactor 변수 네이밍을 여기저기서 쓰지 않으려고 메서드를 만듬.
        tex.textureScaleFactorX = this.textureScaleFactorX;
        tex.textureScaleFactorY = this.textureScaleFactorY;
    }
}
