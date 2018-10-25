/*
생성자에서 empty base texture 를 받은 후, sprite 를 통해 즉시 stage에서 사용 할 수 있도록 함.
 */

import Rectangle = PIXI.Rectangle;
import { AtlasBaseTexture } from './AtlasBaseTexture';
import { ImageRect } from '../../../maxrect-packer/geom/ImageRect';

export class AtlasTexture extends PIXI.Texture {

    public imageRect:ImageRect;
    private _isEmptyTexture:boolean;

    constructor(baseTexture: AtlasBaseTexture, imageRect:ImageRect) {
        var frame = new Rectangle(0, 0, imageRect.width, imageRect.height);
        baseTexture.hasLoaded = true; // false 이면 이벤트 super.constructor 에서 eventListening 을 하기 때문에 그것을 회피 하기 위해 true로 임시 설정
        super(baseTexture, frame);
        baseTexture.hasLoaded = false;// false 로 해놔야 렌더러에서 drawing을 안함.  이후 updateBaseAndUVs 를 동해 baseTexture 참조가 변경되면 렌더링이 가능해짐.
        this._isEmptyTexture = true;
        this.imageRect = imageRect;
    }

    get isEmptyTexture():boolean {
        return this._isEmptyTexture;
    }

    getBaseTexture():AtlasBaseTexture {
        return this.baseTexture as AtlasBaseTexture;
    }

    drawImageAtBaseTexture(img:HTMLImageElement):void {
        if(this._isEmptyTexture) return;
        var ctx:CanvasRenderingContext2D = this.getBaseTexture().getCtx();
        var r = this.orig;
        var w = img.naturalWidth || img.width;
        var h = img.naturalHeight || img.height;
        ctx.drawImage(img, 0, 0, w, h, r.x, r.y, r.width, r.height);
    }

    updateBaseAndUVs(base:AtlasBaseTexture):void {
        this._isEmptyTexture = false;
        this.baseTexture = base;
        if(this.frame.x != this.imageRect.x || this.frame.y != this.imageRect.y) {
            this.frame.x = this.imageRect.x;
            this.frame.y = this.imageRect.y;
            this._updateUvs();
        }
    }
}