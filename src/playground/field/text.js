/*
 *
 */
'use strict';

/*
 *
 */
Entry.FieldText = function(content, blockView, index) {
    this._block = blockView.block;
    this._blockView = blockView;
    this._index = index;

    this.box = new Entry.BoxModel();

    this._font_size =
        content.fontSize || blockView.getSkeleton().fontSize || 12;
    this._color =
        content.color ||
        this._block.getSchema().fontColor ||
        blockView.getSkeleton().color ||
        'white';
    this._align = content.align || 'left';
    this._text = this.getValue() || content.text;
    this.setValue(null);

    this.textElement = null;

    this.renderStart(blockView);
};

Entry.Utils.inherit(Entry.Field, Entry.FieldText);

(function(p) {
    p.renderStart = function() {
        var that = this;
        var blockView = this._blockView;

        if (!this.textElement) {
            this.svgGroup = this.textElement = blockView.contentSvgGroup
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
        var bBox = this.getTextBBox();
        if (this._align == 'center') x = -bBox.width / 2;

        this.textElement.attr({
            x: x,
            y: bBox.height * 0.25,
        });

        this.box.set({
            x: 0,
            y: 0,
            width: bBox.width,
            height: bBox.height,
        });
    };

    p.getTextValue = function() {
        return this._text;
    };
})(Entry.FieldText.prototype);
