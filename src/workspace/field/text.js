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
    this.box = box;

    this._text = text;

    this.textElement = null;

    this.renderStart();
};

(function(p) {
    p.renderStart = function() {
        this.textElement = this._block.contentSvgGroup.text(0, 0, this._text);
        this.textElement.attr({
            'style': 'white-space: pre; font-size: 16px',
            "alignment-baseline": "central",
            "class": "dragNone",
            "fill": "white"
        });
        var bBox = this.textElement.getBBox();
        this.box.set({
            x: 0,
            y: 0,
            width: bBox.width,
            height: bBox.height
        });
    };

    p.align = function(x, y, animate) {
        if (animate !== true) animate = false;
        var elem = this.textElement;

        var attr = {x: x, y: y};

        if (animate)
            elem.animate(
                attr,
                300,
                mina.easeinout
            );
        else elem.attr(attr);


        this.box.set({
            x: x,
            y: y
        });
    };

})(Entry.FieldText.prototype);
