/*
 *
 */
'use strict';

/*
 *
 */
Entry.FieldText = function({fontSize, align, text, color}, blockView, index) {
    this._block = blockView.block;
    this._blockView = blockView;
    this._index = index;

    this.box = new Entry.BoxModel();

    this._font_size =
        fontSize || blockView.getSkeleton().fontSize || 12;
    this._color =
        color ||
        this._block.getSchema().fontColor ||
        blockView.getSkeleton().color ||
        'white';
    this._align = align || 'left';
    this._text = this.getValue() || text;
    this.setValue(null);

    this.textElement = null;

    this.renderStart(blockView);
};

Entry.Utils.inherit(Entry.Field, Entry.FieldText);

(function(p) {
    p.renderStart = function() {
        var that = this;
        var { contentSvgGroup } = this._blockView;

        if (!this.textElement) {
            this.svgGroup = this.textElement = contentSvgGroup
                .elem('text')
                .attr({
                    style: 'white-space: pre;',
                    'font-size': that._font_size + 'px',
                    'font-family': 'nanumBarunRegular',
                    class: 'dragNone',
                    fill: that._color,
                });
        }

        var old = this.textElement.textContent;
        this._text = this._text.replace(/(\r\n|\n|\r)/gm, ' ');
        if (old !== this._text) {
            this.textElement.textContent = this._text;
        }

        var x = 0;
        var { width, height } = this.getTextBBox();
        if (this._align == 'center') x = -width / 2;

        this.textElement.attr({
            x: x,
            y: height * 0.25,
        });

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
