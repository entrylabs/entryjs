export default class PIXIHelper {
    static text(str, font, color, textBaseline, textAlign) {
        var reg = /((\d+)(pt|sp|px))?\s*(.+)/gi;
        var result = reg.exec(font);
        var fontName = (result&&result[4]) || "NanumGothic";
        var size = (result&&result[1]) || "10pt";

        console.log({
            input: font,
            fontName: fontName,
            size: size
        });

        var t = new PIXI.Text(str, {
            fontFamily: fontName,
            fontSize: size,
            fill: color,
            textBaseline: textBaseline || 'alphabetic',
            align: textAlign || "left"
        });
        return t;
    }

    /**
     * createjs.Text.getMeasuredWidth() 의 pollyfill
     * @param pixiText
     */
    static textWidth(pixiText) {
        return pixiText.width;
    }

    static pixiContainerClone(pixiContainer, recusive) {
        console.log("pixiContainerClone");
        return src.clone;
    }

    static cacheIfHasFilters(that) {
        // if (!_.isEmpty(that.object.filters)) that.cache();
        // else that.object.uncache();
    }

    /**
     *
     * @param {PIXI.Sprite} sp
     * @param {HTMLImageElement} image
     */
    static setTextureToPIXISprite(sp, image) {
        sp.texture = PIXI.Texture.from(image);
    }


    static createjsUncache(target) {
        // object.uncache()
    }

    /**
     * #ff00ff --> 0xff00ff
     * @param strColor
     */
    static colorToUint(strColor) {
        return Number(strColor.replace("#", "0x"));
    }


}

