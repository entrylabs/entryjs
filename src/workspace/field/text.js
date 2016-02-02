/*
 *
 */
"use strict";

goog.provide("Entry.FieldText");

goog.require("Entry.Field");

/*
 *
 */
Entry.FieldText = function(content, blockView, index) {
    this._block = blockView.block;
    this._index = index;

    var box = new Entry.BoxModel();
    this.box = box;

    this._fontSize = content.fontSize || blockView.getSkeleton().fontSize || 12;
    this._color = content.color || blockView.getSkeleton().color || 'white';
    this._align = content.align || 'left';
    this._text = this.getValue() || content.text;

    this.textElement = null;

    this.renderStart(blockView);
};

Entry.Utils.inherit(Entry.Field, Entry.FieldText);

(function(p) {
    p.renderStart = function(blockView) {
        var that = this;

        this.svgGroup = blockView.contentSvgGroup.group();

        this._text = this._text.replace(/(\r\n|\n|\r)/gm," ");
        this.textElement = this.svgGroup.text(0, 0, this._text);
        this.textElement.attr({
            'style': 'white-space: pre; font-size:' + that._fontSize + 'px',
            "class": "dragNone",
            "fill": that._color
        });

        var bBox = this.textElement.getBBox();
        var x = 0;
        if (this._align == 'center') x = -bBox.width/2;

        this.textElement.attr({
            'x': x,
            'y': bBox.height * 0.25
        });

        this.box.set({
            x: 0,
            y: 0,
            width: this.textElement.node.getComputedTextLength(),
            height: bBox.height
        });
    };


})(Entry.FieldText.prototype);
