import { Graphics } from 'pixi.js';

/**
 * PIXI.Graphics을 createjs.Shape와 비슷한 인터페이스로 구현하기 위한 함수
 *
 */

class GraphicsAdaptor {
    constructor(gra) {
        /**
         * @private
         * @type {PIXI.Graphics}
         */
        this._gra = gra;
        this._lineStyleChanged = false;

        this._lineStyle = {
            alpha: 1,
            color: 0,
            thickness: 0,
        };

        this._fillStyle = {
            alpha: 1,
            color: 0,
        };
    }

    moveTo(x, y) {
        this._gra.moveTo(x, y);
        return this;
    }

    beginFill(color) {
        const style = this._fillStyle;
        this._parseRGBCssStyleColor(color, style);
        this._gra.beginFill(style.color, style.alpha);
        return this;
    }

    beginStroke(color) {
        this._parseRGBCssStyleColor(color, this._lineStyle);
        this._lineStyleChanged = true;
        this._setStrokeStyle();
        return this;
    }

    drawRoundRect(x, y, w, h, r) {
        this._gra.drawRoundedRect(x, y, w, h, r);
        return this;
    }

    drawCircle(x, y, r) {
        this._gra.drawCircle(x, y, r);
        return this;
    }

    lineTo(x, y) {
        this._gra.lineTo(x, y);
        return this;
    }

    clear() {
        this._gra.clear();
        return this;
    }

    setStrokeStyle(thickness, caps = 0, joints = 0, miterLimit = 10) {
        this._lineStyleChanged = true;
        this._lineStyle.thickness = thickness;
        this._setStrokeStyle();
        return this;
    }

    drawRect(x, y, w, h) {
        this._gra.drawRect(x, y, w, h);
        return this;
    }

    closePath() {
        this._gra.closePath();
        return this;
    }

    endStroke() {
        //todo [박준배] endStroke에 해당하는 pixi 메서드를 찾아서 넣어주긔.
        return this;
    }

    _setStrokeStyle() {
        if (!this._lineStyleChanged) {
            return;
        }
        this._lineStyleChanged = false;
        const s = this._lineStyle;
        this._gra.lineStyle(s.thickness, s.color, s.alpha);
    }

    /**
     * @param color {string}
     * @param result
     * @private
     */
    _parseRGBCssStyleColor(color, result) {
        if (!color) {
            return;
        }
        color = color.replace('/s/', '');
        if (color[0] === '#') {
            result.color = parseInt(color.substr(1), 16);
            return;
        }

        let regexResult;

        regexResult = /^rgba\((\d+),(\d+),(\d+),(\d+(\.?\d*))\)$/i.exec(color);
        if (regexResult) {
            result.color = this._RGBToNumber(regexResult);
            result.alpha = Number(regexResult[4]);
            return;
        }

        regexResult = /^rgb\((\d+),(\d+),(\d+)\)$/i.exec(color);
        if (regexResult) {
            result.color = this._RGBToNumber(regexResult);
        }
    }

    _RGBToNumber(regexResult) {
        const [x, r, g, b] = regexResult;
        return (r << 16) + (g << 8) + Number(b);
    }
}

// createjs tiny api
const GP = GraphicsAdaptor.prototype;
GP.mt = GP.moveTo;
GP.f = GP.beginFill;
GP.s = GP.beginStroke;
GP.rr = GP.drawRoundRect;
GP.dc = GP.drawCircle;
GP.lt = GP.lineTo;
GP.ss = GP.setStrokeStyle;
GP.rect = GP.r = GP.dr = GP.drawRect;
GP.cp = GP.closePath;
GP.es = GP.endStroke;

export function PIXIGraphicOverride() {
    const p = Graphics.prototype;

    Object.defineProperties(p, {
        graphics: {
            get() {
                if (!this.___adaptor___) {
                    this.___adaptor___ = new GraphicsAdaptor(this);
                }
                return this.___adaptor___;
            },
        },
    });
}
