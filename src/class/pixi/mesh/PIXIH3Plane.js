export class PIXIH3Plane extends PIXI.Container {

    /**
     * assignTexture() 호출 이후, width, tint 를 호출해야 함.
     * @param {PIXIBaseAsset} baseAsset
     */
    constructor(baseAsset) {
        super();
        this._baseAsset = baseAsset;
        this._tint = 0xffffff;
        this._prevTexturePrefix = "";
    }


    assignTexture(texturePrefix) {
        if(this._prevTexturePrefix === texturePrefix) return;
        this._prevTexturePrefix = texturePrefix;

        this._tint = 0xffffff;
        this._releaseSprite(this._sp0);
        this._releaseSprite(this._sp1);
        this._releaseSprite(this._sp2);

        var ba = this._baseAsset;
        this._sp0 = this._appendSprite(ba, texturePrefix, 0);
        this._sp1 = this._appendSprite(ba, texturePrefix, 1);
        this._sp2 = this._appendSprite(ba, texturePrefix, 2);
        this._sideWidth = this._sp0.width + this._sp2.width;
    }


    /**
     *
     * @param {PIXIBaseAsset} baseAsset
     * @param {string} texturePrefix
     * @param {number} index
     */
    _appendSprite(baseAsset, texturePrefix, index) {
        var sp = baseAsset.newSprite(texturePrefix + index);
        this.addChild(sp);
        return sp;
    }


    _releaseSprite(sp) {
        if(!sp) return;
        sp.destroy();
    }


    set width(value) {
        var cw = value - this._sideWidth;
        if(cw > 0) {
            this._sp1.x = this._sp0.width;
            this._sp1.width = cw;
            this._sp2.x = value - this._sp2.width;
        } else {
            this._sp0.scale.x = this._sp2.scale.x = value / this._sideWidth;
            this._sp2.x = this._sp0.width;
            this._sp1.scale.x = 0;
        }
    }


    /**
     * @param {number} value
     */
    set tint(value) {
        this._tint = value;
        this._sp0.tint = this._sp1.tint = this._sp2.tint = value;
    }


    get tint() {
        return this._tint;
    }

}