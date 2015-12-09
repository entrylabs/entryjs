/*
 *
 */
"use strict";

goog.provide("Entry.FieldText");

goog.require("Entry.Field");

/*
 *
 */
Entry.FieldText = function(content, block) {
    this._block = block;

    var box = new Entry.BoxModel();
    this.box = box;

    this._fontSize = content.fontSize || block.getSkeleton().fontSize || 12;
    this._text = content.text;

    this.textElement = null;

    this.renderStart();
};

Entry.Utils.inherit(Entry.Field, Entry.FieldText);

(function(p) {
    p.renderStart = function() {
        var that = this;

        this.svgGroup = this._block.contentSvgGroup.group();

        this.textElement = this.svgGroup.text(0, 0, this._text);
        this.textElement.attr({
            'style': 'white-space: pre; font-size:' + that._fontSize + 'px',
            "class": "dragNone",
            "fill": "white"
        });
        var bBox = this.textElement.getBBox();
        this.textElement.attr({
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
