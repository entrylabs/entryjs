/*
 *
 */
"use strict";

goog.provide("Entry.Block");

goog.require("Entry.BlockModel");
goog.require("Entry.BlockRenderModel");
goog.require("Entry.skeleton");


/*
 *
 */
Entry.Block = function(block, thread) {
    this.thread = thread;

    this._schema = Entry.block[block.blockType];
    this._skeleton = Entry.skeleton[this._schema.skeleton];

    this._model = new Entry.BlockModel(block);

    this._renderModel = null;

    this.thread = thread;

    this.svgGroup = null;

    this.magnets = {};

    this._path = null;
};

(function(p) {
    p.renderStart = function() {
        this.svgGroup = this.thread.svgGroup.group();

        this._path = this.svgGroup.path(this._skeleton.path());
        this._path.attr('fill', this._schema.color);

        this.magnets = this._skeleton.magnets();
    };

})(Entry.Block.prototype);
