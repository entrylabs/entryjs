/**
 * createjs 의 rendeeing 방식을 따라 하기 위해 fontProperty를 사용안함.
 * 뷰의 스케일 조정을 하더라도 깔끔하게 보이기 위해 fontScale 를 추가하여 텍스쳐의 크기를 조절함.
 */
import { TextMetrics, Text } from 'pixi.js';
import PIXITextStyle from './PIXITextStyle';
import { PIXIGlobal } from '../init/PIXIGlobal';

let $textCanvasContainer;

export class PIXIText extends Text {
    constructor(text, style) {
        const canvas = document.createElement('canvas');
        if (!$textCanvasContainer) {
            $textCanvasContainer = $('#textCanvasContainer');
        }
        $textCanvasContainer.append(canvas);
        super(text, style, canvas);
        this.setFontScaleX(1);
        this.setFontScaleY(1);
        PIXIGlobal.fontLoadChecker.manage(this);
    }

    set style(style) {
        // eslint-disable-line require-jsdoc
        style = style || {};

        if (style instanceof PIXITextStyle) {
            this._style = style;
        } else {
            this._style = new PIXITextStyle(style);
        }

        this.localStyleID = -1;
        this.dirty = true;
    }
    get style() {
        return super.style;
    }

    setFontScaleX(value) {
        value = value * PIXIText.STAGE_SCALE;
        this._fontScaleX = value;
        this.scale.x = 1 / value;
        this.dirty = true;
    }
    setFontScaleY(value) {
        value = value * PIXIText.STAGE_SCALE;
        this._fontScaleY = value;
        this.scale.y = 1 / value;
        this.dirty = true;
    }

    getMeasuredWidth() {
        this.updateText(true);
        return this._measuredWidth;
    }

    getMeasuredHeight() {
        this.updateText(true);
        return this._measuredHeight;
    }
    getMeasuredLineHeight() {
        this.updateText(true);
        return this._measuredLineHeight;
    }

    /** @deprecated */
    get measuredWidth() {
        this.updateText(true);
        console.warn('[deprecated] - PIXIText.measuredWidth');
        return this._measuredWidth;
    }
    /** @deprecated */
    get measuredHeight() {
        this.updateText(true);
        console.warn('[deprecated] - PIXIText.measuredHeight');
        return this._measuredHeight;
    }
    /** @deprecated */
    get measuredLineHeight() {
        this.updateText(true);
        console.warn('[deprecated] - PIXIText.measuredLineHeight');
        return this._measuredLineHeight;
    }

    /**
     * Renders text and updates it when needed.
     *
     * @private
     * @param {boolean} respectDirty - Whether to abort updating the text if the Text isn't dirty and the function is called.
     */
    updateText(respectDirty) {
        const style = this._style;

        // check if style has changed..
        if (this.localStyleID !== style.styleID) {
            this.dirty = true;
            this.localStyleID = style.styleID;
        }

        if (!this.dirty && respectDirty) {
            return;
        }

        this._font = this._style.toFontString();
        const context = this.context;
        const measured = TextMetrics.measureText(
            this._text,
            this._style,
            this._style.wordWrap,
            this.canvas
        );
        const width = (this._measuredWidth = measured.width);
        const height = (this._measuredHeight = measured.height);
        const lines = measured.lines;
        const lineHeight = (this._measuredLineHeight = measured.lineHeight);
        const lineWidths = measured.lineWidths;
        const maxLineWidth = measured.maxLineWidth;
        const fontProperties = measured.fontProperties;

        const UN = undefined;
        const FSX = this._fontScaleX === UN ? 1 : this._fontScaleX;
        const FSY = this._fontScaleY === UN ? 1 : this._fontScaleY;

        this.canvas.width = Math.ceil(
            (Math.max(1, width) + style.padding * 2) * this.resolution * FSX
        );
        this.canvas.height = Math.ceil(
            (Math.max(1, height) + style.padding * 2) * this.resolution * FSY
        );

        context.scale(this.resolution * FSX, this.resolution * FSY);

        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        //---------- DEBUG CODE ------------
        // context.fillStyle = "rgba(255, 0, 0, 0.3)";
        // context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        //---------- DEBUG CODE ------------

        context.font = this._font;
        context.strokeStyle = style.stroke;
        context.lineWidth = style.strokeThickness;
        context.textBaseline = style.textBaseline;
        context.lineJoin = style.lineJoin;
        context.miterLimit = style.miterLimit;

        let linePositionX;
        let linePositionY;

        if (style.dropShadow) {
            context.fillStyle = style.dropShadowColor;
            context.globalAlpha = style.dropShadowAlpha;
            context.shadowBlur = style.dropShadowBlur;

            if (style.dropShadowBlur > 0) {
                context.shadowColor = style.dropShadowColor;
            }

            const xShadowOffset = Math.cos(style.dropShadowAngle) * style.dropShadowDistance;
            const yShadowOffset = Math.sin(style.dropShadowAngle) * style.dropShadowDistance;

            for (let i = 0; i < lines.length; i++) {
                linePositionX = style.strokeThickness / 2;
                linePositionY = style.strokeThickness / 2 + i * lineHeight + fontProperties.ascent;

                if (style.align === 'right') {
                    linePositionX += maxLineWidth - lineWidths[i];
                } else if (style.align === 'center') {
                    linePositionX += (maxLineWidth - lineWidths[i]) / 2;
                }

                if (style.fill) {
                    this.drawLetterSpacing(
                        lines[i],
                        linePositionX + xShadowOffset + style.padding,
                        linePositionY + yShadowOffset + style.padding
                    );

                    if (style.stroke && style.strokeThickness) {
                        context.strokeStyle = style.dropShadowColor;
                        this.drawLetterSpacing(
                            lines[i],
                            linePositionX + xShadowOffset + style.padding,
                            linePositionY + yShadowOffset + style.padding,
                            true
                        );
                        context.strokeStyle = style.stroke;
                    }
                }
            }
        }

        // reset the shadow blur and alpha that was set by the drop shadow, for the regular text
        context.shadowBlur = 0;
        context.globalAlpha = 1;

        // set canvas text styles
        context.fillStyle = this._generateFillStyle(style, lines);
        const WORD_WRAP = style.wordWrap;
        const H_LH = lineHeight * 0.5; // half line-height
        const MAX_HEIGHT = style.maxHeight < 0 ? 0xffff : style.maxHeight - H_LH;
        const PAD = style.padding;
        // draw lines line by line
        for (let i = 0; i < lines.length; i++) {
            linePositionX = style.strokeThickness / 2;
            linePositionY = style.strokeThickness / 2 + i * lineHeight + H_LH;

            if (WORD_WRAP && linePositionY > MAX_HEIGHT) {
                break;
            }

            if (style.align === 'right') {
                linePositionX += maxLineWidth - lineWidths[i];
            } else if (style.align === 'center') {
                linePositionX += (maxLineWidth - lineWidths[i]) / 2;
            }

            if (style.stroke && style.strokeThickness) {
                this.drawLetterSpacing(
                    lines[i],
                    linePositionX + style.padding,
                    linePositionY + style.padding,
                    true
                );
            }

            if (style.fill) {
                this.drawLetterSpacing(
                    lines[i],
                    linePositionX + style.padding,
                    linePositionY + style.padding
                );
            }

            //취소선 추가
            if (style.cancelLine) {
                this._drawLineAt(
                    context,
                    linePositionX + PAD,
                    linePositionY + PAD,
                    lineWidths[i],
                    0
                );
            }

            //밑줄
            if (style.underLine) {
                this._drawLineAt(
                    context,
                    linePositionX + PAD,
                    linePositionY + PAD,
                    lineWidths[i],
                    lineHeight * 0.4
                );
            }
        }

        this.updateTexture();
    }

    updateTexture() {
        const canvas = this.canvas;

        // 박봉배- entryjs 에서 trim 기능 사용안함. 그리고 trimCanvas 의 참조를 pixi 라이브러리로부터 못갖고 오겠음.
        /*
        if (this._style.trim)
        {
            const trimmed = trimCanvas(canvas);

            if (trimmed.data)
            {
                canvas.width = trimmed.width;
                canvas.height = trimmed.height;
                this.context.putImageData(trimmed.data, 0, 0);
            }
        }
        */

        const texture = this._texture;
        const style = this._style;
        const padding = style.trim ? 0 : style.padding;
        const baseTexture = texture.baseTexture;

        const UN = undefined;
        const FSX = this._fontScaleX === UN ? 1 : this._fontScaleX;
        const FSY = this._fontScaleY === UN ? 1 : this._fontScaleY;

        baseTexture.hasLoaded = true;
        baseTexture.resolution = this.resolution;
        baseTexture.setRealSize(canvas.width, canvas.height);
        baseTexture.setSize(canvas.width, canvas.height, this.resolution);

        texture.trim.width = texture._frame.width = canvas.width / this.resolution;
        texture.trim.height = texture._frame.height = canvas.height / this.resolution;
        texture.trim.x = -padding * FSX;
        texture.trim.y = -padding * FSY;

        texture.orig.width = texture._frame.width - padding * 2 * FSX;
        texture.orig.height = texture._frame.height - padding * 2 * FSY;

        // call sprite onTextureUpdate to update scale if _width or _height were set
        this._onTextureUpdate();

        baseTexture.emit('update', baseTexture);

        this.dirty = false;
    }

    /**
     * 취소선 or 밑줄을 draw 하기 위한 함수.
     * @private
     * @param {CanvasRenderingContext2D} ctx
     * @param x
     * @param y
     * @param width
     * @param offsetY
     */
    _drawLineAt(ctx, x, y, width, offsetY) {
        ctx.fillRect(x, y + offsetY, width, 1);
    }

    destroy() {
        $(this.canvas).remove();
        PIXIGlobal.fontLoadChecker.unmanage(this);
        super.destroy({ children: false, baseTexture: true, texture: true });
    }
}

// PIXIText.STAGE_SCALE = 1.51;
PIXIText.STAGE_SCALE = 1.53;
// PIXIText.STAGE_SCALE = 1.41;
// console.log(`PIXIText.STAGE_SCALE1(${PIXIText.STAGE_SCALE})`);
