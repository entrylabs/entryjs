/*
 */
"use strict";

goog.provide("Entry.FieldDropdown");

/*
 *
 */
Entry.FieldDropdown = function(content, block) {
    this._block = block;

    var box = new Entry.BoxModel();
    this.box = box;

    this.svgGroup = null;

    this.renderStart();
};

(function(p) {
    p.renderStart = function() {
        this.svgGroup = this._block.contentSvgGroup.group();

        this.svgGroup.rect(0,-10, 20, 20);

        this.box.set({
            x: 0,
            y: 0,
            width: 20,
            height: 20
        });
    };

    p.align = function(x, y, animate) {
        animate = animate === undefined ? true : animate;
        var svgGroup = this.svgGroup;
        if (this._position) x = this._position.x;
        var transform = "t" + x + " " + y;

        if (animate)
            svgGroup.animate({
                transform: transform
            }, 300, mina.easeinout);
        else
            svgGroup.attr({
                transform: transform
            });

        this.box.set({
            x: x,
            y: y
        });
    };

})(Entry.FieldDropdown.prototype);
