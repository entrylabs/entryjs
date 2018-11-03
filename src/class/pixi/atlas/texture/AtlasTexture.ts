/*
생성자에서 empty base texture 를 받은 후, sprite 를 통해 즉시 stage에서 사용 할 수 있도록 함.
 */

import Rectangle = PIXI.Rectangle;
import { AtlasBaseTexture } from './AtlasBaseTexture';
import { ImageRect } from '../../../maxrect-packer/geom/ImageRect';
import { AtlasImageLoadingInfo } from '../loader/AtlasImageLoadingInfo';

export class AtlasTexture extends PIXI.Texture {

    public imageRect:ImageRect;
    private _isEmptyTexture:boolean;
    public textureScaleFactor:number;

    constructor(baseTexture: AtlasBaseTexture, imageRect:ImageRect) {
        var frame = new Rectangle(0, 0, imageRect.width, imageRect.height);
        baseTexture.hasLoaded = true; // false 이면 이벤트 super.constructor 에서 eventListening 을 하기 때문에 그것을 회피 하기 위해 true로 임시 설정
        super(baseTexture, frame);
        baseTexture.hasLoaded = false;// false 로 해놔야 렌더러에서 drawing을 안함.  이후 updateBaseAndUVs 를 동해 baseTexture 참조가 변경되면 렌더링이 가능해짐.
        this._isEmptyTexture = true;
        this.imageRect = imageRect;
        this.textureScaleFactor = imageRect.scaleFactor;
    }

    get isEmptyTexture():boolean {
        return this._isEmptyTexture;
    }

    getBaseTexture():AtlasBaseTexture {
        return this.baseTexture as AtlasBaseTexture;
    }

    /**
     * @param img
     * @param extrude - Reduce flickering in some cases where sprites have to be put next to each other in the final program.
     * example: https://www.codeandweb.com/texturepacker/documentation/texture-settings
     */
    drawImageAtBaseTexture(info:AtlasImageLoadingInfo, extrude:boolean = true):void {
        if(this._isEmptyTexture) return;
        var img = info.source();
        var ctx:CanvasRenderingContext2D = this.getBaseTexture().getCtx();
        var r = this.orig;
        var w = r.width;
        var h = r.height;
        var rx = r.x;
        var ry = r.y;


        ctx.drawImage(img, 0, 0, w, h, rx, ry, w, h);

        if(extrude) {
            //top
            ctx.drawImage(img, 0, 0, w, 1, rx, ry - 1, w, 1);
            //down
            ctx.drawImage(img, 0, h - 1, w, 1, rx, ry + h, w, 1);
            //left
            ctx.drawImage(img, 0, 0, 1, h, rx - 1, ry, 1, h);
            //right
            ctx.drawImage(img, w - 1, 0, 1, h, rx + w, ry, 1, h);
        }
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