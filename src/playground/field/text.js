/*
 *
 */
'use strict';

/*
 *
 */
Entry.FieldText = function({ fontSize, align = 'left', text, color }, blockView, index) {
    this._block = blockView.block;
    this._blockView = blockView;
    this._index = index;

    this.box = new Entry.BoxModel();

    this._font_size = fontSize || blockView.getSkeleton().fontSize || 12;
    this._color =
        color || this._block.getSchema().fontColor || blockView.getSkeleton().color || 'white';
    this._align = align;
    this._text = this.getValue() || text;
    this.setValue(null);

    this.textElement = null;

    this.renderStart();
};

Entry.Utils.inherit(Entry.Field, Entry.FieldText);

(function(p) {
    p.renderStart = function() {
        var { contentSvgGroup } = this._blockView;

        if (!this.textElement) {
            this.svgGroup = this.textElement = contentSvgGroup.elem('text').attr({
                style: 'white-space: pre;',
                'font-size': this._font_size + 'px',
                'font-weight': 'bold',
                'font-family': EntryStatic.fontFamily || 'NanumGothic',
                class: 'dragNone',
                fill: this._color,
            });
        }

        var old = this.textElement.textContent;
        // this._text = this._text.replace(/(\r\n|\n|\r)/gm, ' ');
        const text = this._text || '';
        if (old !== text.replace(/(\r\n|\n|\r)/gm, '')) {
            const textList = this._text.split(/\r\n|\n|\r/gm);
            textList.forEach((text, i) => {
                this.textElement.elem('tspan').attr({
                    dy: `${i ? 14 : 0}px`,
                }).textContent = text;
            });
            // this.textElement.textContent = this._text;
        }

        var { width, height } = this.getTextBBox();
        const x = this._align == 'center' ? -width / 2 : 0;
        const offsetY = EntryStatic.fontOffsetY || 0;
        this.textElement.attr({
            x,
            y: height * 0.5 + offsetY,
        });

        if (this.textElement.childElementCount > 1) {
            const { childNodes } = this.textElement;
            for (let i = 0; i < childNodes.length; i++) {
                childNodes[i].attr({
                    x,
                });
            }
        }

        this.box.set({
            x: 0,
            y: 0,
            width,
            height,
        });
    };

    p.getTextValue = function() {
        return this._text;
    };
})(Entry.FieldText.prototype);
