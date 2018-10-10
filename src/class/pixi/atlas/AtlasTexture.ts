import BaseTexture = PIXI.BaseTexture;
import Rectangle = PIXI.Rectangle;

export class AtlasTexture extends PIXI.Texture {

    public baseTextureIndex:number;

    constructor(baseTexture: BaseTexture, frame?: Rectangle, orig?: Rectangle, trim?: Rectangle, rotate?: number) {
        super(baseTexture, frame, orig, trim, rotate);
    }

}