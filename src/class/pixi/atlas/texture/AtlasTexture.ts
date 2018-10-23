import BaseTexture = PIXI.BaseTexture;
import Rectangle = PIXI.Rectangle;
import { AtlasBaseTexture } from './AtlasBaseTexture';
import { InputRect } from '../../../maxrect-packer/geom/InputRect';

export class AtlasTexture extends PIXI.Texture {

    public inputRect:InputRect;

    constructor(baseTexture: BaseTexture, inputRect:InputRect) {
        var frame = new Rectangle(0, 0, inputRect.width, inputRect.height);
        super(baseTexture, frame);
        this.inputRect = inputRect;
    }

    getBaseTexture():AtlasBaseTexture {
        return this.baseTexture as AtlasBaseTexture;
    }

    drawImageAtBaseTexture(img:HTMLImageElement):void {
        var texture:AtlasTexture = this;
        var ctx:CanvasRenderingContext2D = this.getBaseTexture().getCtx();
        var r = texture.orig;
        var w = img.naturalWidth || img.width;
        var h = img.naturalHeight || img.height;
        ctx.drawImage(img, 0, 0, w, h, r.x, r.y, r.width, r.height);
    }

    updateBaseAndUVs(base:AtlasBaseTexture):void {
        this.baseTexture = base;
        if(this.frame.x != this.inputRect.x || this.frame.y != this.inputRect.y) {
            this.frame.x = this.inputRect.x;
            this.frame.y = this.inputRect.y;
            this._updateUvs();
        }
    }
}