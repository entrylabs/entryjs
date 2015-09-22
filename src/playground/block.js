/*
 *
 */
"use strict";

goog.provide("Entry.Block");

goog.require("Entry.BlockModel");
goog.require("Entry.BoxModel");
goog.require("Entry.skeleton");


/*
 *
 */
Entry.Block = function(block, thread) {
    this.thread = thread;

    // block information
    this._schema = Entry.block[block.blockType];
    this._skeleton = Entry.skeleton[this._schema.skeleton];

    // Block model
    this._model = new Entry.BlockModel(block);
    this.contentBox = new Entry.BoxModel();
    this.contentBox.observe(this, "render", ['width', 'height']);

    // content objects
    this._contents = [];
    this.magnets = {};

    // SVG Element
    this.svgGroup = null;
    this.fieldSvgGroup = null;
    this._path = null;
};

(function(p) {
    p.renderStart = function() {
        this.svgGroup = this.thread.svgGroup.group();

        this._path = this.svgGroup.path(this._skeleton.path(this));
        this._path.attr('fill', this._schema.color);

        this.magnets = this._skeleton.magnets();
        this.fieldRenderStart();
    };

    p.fieldRenderStart = function() {
        this.fieldSvgGroup = this.svgGroup.group();
        var contentPos = this._skeleton.contentPos();
        this.fieldSvgGroup.transform("t" + contentPos.x + ',' + contentPos.y);

        var contents = this._schema.contents;
        for (var i = 0; i < contents.length; i++) {
            var content = contents[i];
            if (typeof content === "string")
                this._contents.push(new Entry.FieldText(content, this));
        }
        this.alignContent();
    };

    p.alignContent = function() {
        var cursor = {x: 0, y: 0};
        for (var i = 0; i < this._contents.length; i++) {
            var c = this._contents[i];
            c.align(cursor.x, cursor.y);

            var box = c.box;
            cursor.x += box.width;
        }

        this.contentBox.width = cursor.x;
    };

    p.render = function() {
        var path = this._skeleton.path(this);
        this._path.attr({
            d: path
        });
    };

})(Entry.Block.prototype);
