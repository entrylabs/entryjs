/*
 *
 */
"use strict";

goog.provide("Entry.FieldText");

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

(function(p) {
    p.renderStart = function() {
        var that = this;
        this.textElement = this._block.contentSvgGroup.text(0, 0, this._text);
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

    p.align = function(x, y, animate) {
        if (animate !== true) animate = false;
        var elem = this.textElement;

        var attr = {x: x};

        if (animate)
            elem.animate(
                attr,
                300,
                mina.easeinout
            );
        else elem.attr(attr);


        this.box.set({
            x: x,
            width: this.textElement.node.getComputedTextLength(),
            y: y
        });
    };

    p.destroy = function() {};

})(Entry.FieldText.prototype);
