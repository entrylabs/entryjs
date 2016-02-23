/*
 */
"use strict";

goog.provide("Entry.FieldIndicator");

goog.require("Entry.Field");
/*
 *
 */
Entry.FieldIndicator = function(content, block, index) {
    this._block = block;

    var box = new Entry.BoxModel();
    this.box = box;

    this._size = content.size;
    this._imgUrl = content.img;
    this._boxMultiplier = content.boxMultiplier || 2;
    this._highlightColor =
        content.highlightColor? content.highlightColor : "#F59900";
    this._position = content.position;

    this._index = index;
    this.svgGroup = null;
    this._path = null;
    this._imgElement = null;

    this.renderStart();
};

Entry.Utils.inherit(Entry.Field, Entry.FieldIndicator);

(function(p) {
    p.renderStart = function() {
        this.svgGroup = this._block.contentSvgGroup.group();
        this._imgElement = this.svgGroup.image(
            this._imgUrl,
            this._size * 2,
            this._size * 2
        ).move(
            this._position ? this._size * -1 : 0,
            this._size * -1
        );

        var path = "m 0,-%s a %s,%s 0 1,1 -0.1,0 z"
            .replace(/%s/gi, this._size);
        this._path = this.svgGroup.path(path);
        this._path.attr({
            stroke: "none",
            fill: "none"
        });

        this.box.set({
            width: this._size * this._boxMultiplier +
                (this._position ? - this._size : 0),
            height: this._size * this._boxMultiplier
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

})(Entry.FieldIndicator.prototype);
