import BaseTexture = PIXI.BaseTexture;
import Rectangle = PIXI.Rectangle;

export class AtlasTexture extends PIXI.Texture {

    public baseTextureIndex:number;

    constructor(baseTexture: BaseTexture, frame?: Rectangle, orig?: Rectangle, trim?: Rectangle, rotate?: number) {
        super(baseTexture, frame, orig, trim, rotate);

    }

    drawImageAtBaseTexture(img:HTMLImageElement) {
        var texture:AtlasTexture = this;
        var canvas:HTMLCanvasElement = texture.baseTexture.source as HTMLCanvasElement;
        var ctx:CanvasRenderingContext2D = canvas.getContext("2d");
        var r = texture.orig;
        var w = img.naturalWidth || img.width;
        var h = img.naturalHeight || img.height;
        ctx.drawImage(img, 0, 0, w, h, r.x, r.y, r.width, r.height);
        this._updateUvs();
    }
}