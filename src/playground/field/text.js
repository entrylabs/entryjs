/*
 *
 */
"use strict";

goog.provide("Entry.FieldText");

/*
 *
 */
Entry.FieldText = function(text, block) {
    this._block = block;

    var box = new Entry.BoxModel();
    box.observe(block, "alignContent", ['width']);
    this.box = box;

    this._text = text;

    this.textElement = null;

    this.renderStart();
};

(function(p) {
    p.renderStart = function() {
        this.textElement = this._block.fieldSvgGroup.text(0, 0, this._text);
        this.textElement.attr({
            "alignment-baseline": "central",
            "class": "dragNone"
        });
        var bBox = this.textElement.getBBox();
        this.box.set({
            x: 0,
            y: 0,
            width: bBox.width,
            height: bBox.height
        });
    };

    p.align = function(x, y) {
        this.textElement.animate({
            x: x,
            y: y
        }, 300, mina.easeinout);

        this.box.set({
            x: x,
            y: y
        });
    };

})(Entry.FieldText.prototype);
