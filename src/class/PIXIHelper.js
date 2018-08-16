import { PIXIText } from './pixi/text/PIXIText';

export default class PIXIHelper {
    static text(str, font, color, textBaseline, textAlign) {
        var reg = /((\d+)(pt|sp|px))?\s*(.+)/gi;
        var result = reg.exec(font) || [];
        var fontName = (result[4]) || "NanumGothic";
        var size = (result[1]) || "10pt";

        // console.log({
        //     input: font,
        //     fontName: fontName,
        //     size: size
        // });

        // var t = new PIXI.Text(str, {
        var t = new PIXIText(str, {
            fontFamily: fontName,
            fontSize: size,
            fill: color,
            textBaseline: textBaseline || 'alphabetic',
            align: textAlign || "left",
            miterLimit: 2.5 //createjs default value
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
    static textHeight(pixiText) {
        return pixiText.height;
    }
    static getMeasuredLineHeight(pixiText) {
        return pixiText.height;
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
        return strColor ? Number(strColor.replace("#", "0x")) : undefined;
    }

    static needDestroy(target) {

    }

    static todo(msg) {

    }
}

