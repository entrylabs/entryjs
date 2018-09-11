/**
 * 취소선, 밑줄, maxHeight 구현을 위해 PIXI.Text 를 상속함.
 * PIXI.Text 내부 함수 복사하여 수정/추가함.
 */

import PIXITextStyle from './PIXITextStyle';

//PIXI.Text 클래스 내부에서는 PIXI 네임스페이스로 접근을 안하기 때문에 요렇게 변수추가. ( 원본 수정을 최소화 하기 위함 )
var TextMetrics = PIXI.TextMetrics; 

export class PIXIText extends PIXI.Text {

    constructor(text, style, canvas) {
        super(text, style, canvas);
    }
    
    set style(style) // eslint-disable-line require-jsdoc
    {
        style = style || {};

        if (style instanceof PIXITextStyle)
        {
            this._style = style;
        }
        else
        {
            this._style = new PIXITextStyle(style);
        }

        this.localStyleID = -1;
        this.dirty = true;
    }
    get style()
    {
        return super.style;
    }


    /**
     * Renders text and updates it when needed.
     *
     * @private
     * @param {boolean} respectDirty - Whether to abort updating the text if the Text isn't dirty and the function is called.
     */
    updateText(respectDirty)
    {
        const style = this._style;

        // check if style has changed..
        if (this.localStyleID !== style.styleID)
        {
            this.dirty = true;
            this.localStyleID = style.styleID;
        }

        if (!this.dirty && respectDirty)
        {
            return;
        }

        this._font = this._style.toFontString();

        const context = this.context;
        const measured = TextMetrics.measureText(this._text, this._style, this._style.wordWrap, this.canvas);
        const width = measured.width;
        const height = measured.height;
        const lines = measured.lines;
        const lineHeight = measured.lineHeight;
        const lineWidths = measured.lineWidths;
        const maxLineWidth = measured.maxLineWidth;
        const fontProperties = measured.fontProperties;

        this.canvas.width = Math.ceil((Math.max(1, width) + (style.padding * 2)) * this.resolution);
        this.canvas.height = Math.ceil((Math.max(1, height) + (style.padding * 2)) * this.resolution);

        context.scale(this.resolution, this.resolution);

        context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        context.font = this._font;
        context.strokeStyle = style.stroke;
        context.lineWidth = style.strokeThickness;
        context.textBaseline = style.textBaseline;
        context.lineJoin = style.lineJoin;
        context.miterLimit = style.miterLimit;

        let linePositionX;
        let linePositionY;

        if (style.dropShadow)
        {
            context.fillStyle = style.dropShadowColor;
            context.globalAlpha = style.dropShadowAlpha;
            context.shadowBlur = style.dropShadowBlur;

            if (style.dropShadowBlur > 0)
            {
                context.shadowColor = style.dropShadowColor;
            }

            const xShadowOffset = Math.cos(style.dropShadowAngle) * style.dropShadowDistance;
            const yShadowOffset = Math.sin(style.dropShadowAngle) * style.dropShadowDistance;

            for (let i = 0; i < lines.length; i++)
            {
                linePositionX = style.strokeThickness / 2;
                linePositionY = ((style.strokeThickness / 2) + (i * lineHeight)) + fontProperties.ascent;

                if (style.align === 'right')
                {
                    linePositionX += maxLineWidth - lineWidths[i];
                }
                else if (style.align === 'center')
                {
                    linePositionX += (maxLineWidth - lineWidths[i]) / 2;
                }

                if (style.fill)
                {
                    this.drawLetterSpacing(
                        lines[i],
                        linePositionX + xShadowOffset + style.padding, linePositionY + yShadowOffset + style.padding
                    );

                    if (style.stroke && style.strokeThickness)
                    {
                        context.strokeStyle = style.dropShadowColor;
                        this.drawLetterSpacing(
                            lines[i],
                            linePositionX + xShadowOffset + style.padding, linePositionY + yShadowOffset + style.padding,
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
        const MAX_HEIGHT = style.maxHeight < 0 ? 0xffff : style.maxHeight;

        // draw lines line by line
        for (let i = 0; i < lines.length; i++)
        {
            linePositionX = style.strokeThickness / 2;
            linePositionY = ((style.strokeThickness / 2) + (i * lineHeight)) + fontProperties.ascent;

            if( WORD_WRAP && (linePositionY > MAX_HEIGHT) )
            {
                break;
            }

            if (style.align === 'right')
            {
                linePositionX += maxLineWidth - lineWidths[i];
            }
            else if (style.align === 'center')
            {
                linePositionX += (maxLineWidth - lineWidths[i]) / 2;
            }

            if (style.stroke && style.strokeThickness)
            {
                this.drawLetterSpacing(
                    lines[i],
                    linePositionX + style.padding,
                    linePositionY + style.padding,
                    true
                );
            }

            if (style.fill)
            {
                this.drawLetterSpacing(
                    lines[i],
                    linePositionX + style.padding,
                    linePositionY + style.padding
                );
            }

            //취소선 추가
            if (style.cancelLine) {
                this.drawLineAt(context, linePositionX, linePositionY, lineWidths[i], lineHeight * PIXIText.cancelLineOffset);
            }

            //밑줄
            if (style.underLine) {
                this.drawLineAt(context, linePositionX, linePositionY, lineWidths[i], lineHeight * PIXIText.underLineOffset);
            }
            
        }

        this.updateTexture();
    }

    /**
     * 취소선 or 밑줄을 draw 하기 위한 함수.
     * @param {CanvasRenderingContext2D} ctx
     * @param x
     * @param y
     * @param width
     * @param offsetY
     */
    drawLineAt(ctx, x, y, width, offsetY) {
        ctx.fillRect(x, y + offsetY, width, 2);
    }
}

PIXIText.cancelLineOffset = -0.23;
PIXIText.underLineOffset = 0.12;
window.PIXIText = PIXIText;
