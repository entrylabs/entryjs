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
    this._blockView = blockView;
    this._index = index;

    var box = new Entry.BoxModel();
    this.box = box;

    this._fontSize = content.fontSize || blockView.getSkeleton().fontSize || 12;
    this._color = content.color || this._block.getSchema().fontColor ||
        blockView.getSkeleton().color || 'white';
    this._align = content.align || 'left';
    this._text = this.getValue() || content.text;
    this.setValue(null);

    this.textElement = null;

    this.renderStart(blockView);
};

Entry.Utils.inherit(Entry.Field, Entry.FieldText);

(function(p) {
    p.renderStart = function() {
        if (this.svgGroup) $(this.svgGroup).remove();
        var blockView = this._blockView;
        var that = this;

        this.svgGroup = blockView.contentSvgGroup.elem("g");

        this._text = this._text.replace(/(\r\n|\n|\r)/gm," ");
        this.textElement = this.svgGroup.elem("text").attr({
            'style': 'white-space: pre;',
            'font-size': that._fontSize + 'px',
            'font-family': 'nanumBarunRegular',
            "class": "dragNone",
            "fill": that._color
        });
        this.textElement.textContent = this._text;

        var x = 0;
        var bBox = this.textElement.getBoundingClientRect();
        if (this._align == 'center') x = -bBox.width/2;

        this.textElement.attr({
            x: x,
            y: bBox.height * 0.25
        });

        this.box.set({
            x: 0,
            y: 0,
            width: bBox.width,
            height: bBox.height
        });
    };


})(Entry.FieldText.prototype);
