import { Sprite, Point } from 'pixi.js';

const tempPoint = new Point();
const hitTestCanvas = document.createElement('canvas');
hitTestCanvas.width = 1;
hitTestCanvas.height = 1;
const hitTestConText = hitTestCanvas.getContext('2d');

export function PIXIPixelPerfectInteractionPlugIn() {
    const p = Sprite.prototype;

    /**
     * if true use pixel-perfect hit test
     * @type {boolean}
     */
    p.pixelPerfect = false;

    /** @type {number} not ratio. 16 bit value.
     *  [박봉배] - createjs 에서 testAlpha > 1 이면 히트로 처리.
     */
    p.pixelPerfectAlpha = 1;
    /**
     * PIXISprite.ts 에서 override 함. 메서드명 바꾸지 말긔.
     * @return {PIXI.BaseTexture | (HTMLImageElement | HTMLCanvasElement | HTMLVideoElement)}
     */
    p.internal_getOriginalTex = function() {
        return this.texture;
    };

    p.containsPoint = function(point) {
        //overwrite PIXI.Sprite.containsPoint
        const tex = this.internal_getOriginalTex();
        // if (!tex.baseTexture) {
        //     return false;
        // }
        // if (!tex.baseTexture.source) {
        //     return false;
        // }

        this.worldTransform.applyInverse(point, tempPoint);
        const width = tex.orig.width;
        const height = tex.orig.height;
        const x1 = -width * this.anchor.x;
        let y1 = 0;

        if (tempPoint.x >= x1 && tempPoint.x < x1 + width) {
            y1 = -height * this.anchor.y;
            if (tempPoint.y >= y1 && tempPoint.y < y1 + height) {
                if (this.pixelPerfect) {
                    return this._pixelHasAlpha(tempPoint.x, tempPoint.y, tex);
                }
                return true;
            }
        }
        return false;
    }; // end p.containsPoint

    p._pixelHasAlpha = function(x, y, tex) {
        //add method into PIXI.Sprite
        let left = x;
        let top = y;
        const { frame } = tex;
        const anchor = this.anchor;

        if (anchor.x !== 0) {
            left -= -frame.width * anchor.x;
        }

        if (anchor.y !== 0) {
            top -= -frame.height * anchor.y;
        }

        left += frame.x;
        top += frame.y;
        const { resource } = tex.baseTexture;
        const { source } = resource || {};
        if (!source) {
            return false;
        }
        const ctx = hitTestConText;
        ctx.clearRect(0, 0, 1, 1);
        ctx.drawImage(source, left, top, 1, 1, 0, 0, 1, 1);
        const rgba = ctx.getImageData(0, 0, 1, 1);
        return rgba.data[3] > this.pixelPerfectAlpha;
    }; //end p._checkPixel
}
