/*
 */
"use strict";

goog.provide("Entry.FieldImage");

goog.require("Entry.Field");
/*
 *
 */
Entry.FieldImage = function(content, block, index) {
    this._block = block;

    var box = new Entry.BoxModel();
    this.box = box;

    this._size = content.size;
    if(!block.block.isDeletable()) {
        this._imgUrl = content.img.replace('.png', '_un.png');
    } else {
        this._imgUrl = content.img;
    }
    this._highlightColor =
        content.highlightColor? content.highlightColor : "#F59900";
    this._position = content.position;

    this.svgGroup = null;
    this._path = null;
    this._imgElement = null;
    this._index = index;

    this.renderStart();
};

Entry.Utils.inherit(Entry.Field, Entry.FieldImage);

(function(p) {
    p.renderStart = function() {
        this.svgGroup = this._block.contentSvgGroup.group();
        this._imgElement = this.svgGroup.image(
            this._imgUrl,
            0,
            this._size * -0.5,
            this._size,
            this._size
        );

        this.box.set({
            x: this._size,
            y: 0,
            width: this._size,
            height: this._size
        });
    };

    p.enableHighlight = function() {
        var pathLen = this._path.getTotalLength();
        var path = this._path;
        this._path.attr({
            stroke: this._highlightColor,
            strokeWidth: 2,
            "stroke-linecap": "round",
            "stroke-dasharray": pathLen + " " + pathLen,
            "stroke-dashoffset": pathLen
        });
        setInterval(function() {
            path.attr({"stroke-dashoffset": pathLen})
            .animate({"stroke-dashoffset": 0}, 300);
        }, 1400, mina.easeout);
        setTimeout(function() {
            setInterval(function() {
                path.animate({"stroke-dashoffset": - pathLen}, 300);
            }, 1400, mina.easeout);
        }, 500);
    };

})(Entry.FieldImage.prototype);
