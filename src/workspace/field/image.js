/*
 */
"use strict";

goog.provide("Entry.FieldImage");

goog.require("Entry.Field");
/*
 *
 */
Entry.FieldImage = function(content, blockView, index) {
    this._block = blockView.block;
    this._blockView = blockView;
    this._content = content;

    var box = new Entry.BoxModel();
    this.box = box;

    this._size = content.size;
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
        if (this.svgGroup) this.svgGroup.remove();

        var block = this._block;
        if(!block.isDeletable()) this._imgUrl = this._content.img.replace('.png', '_un.png');
        else this._imgUrl = this._content.img;

        this.svgGroup = this._blockView.contentSvgGroup.elem("g");
        this._imgElement = this.svgGroup.elem("image", {
            href: this._imgUrl,
            x: 0,
            y: this._size * -0.5,
            width: this._size,
            height: this._size
        });

        this.box.set({
            x: this._size,
            y: 0,
            width: this._size,
            height: this._size
        });
    };

})(Entry.FieldImage.prototype);
