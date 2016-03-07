/*
 *
 */
"use strict";

goog.provide("Entry.ThreadView");

/*
 *
 */
Entry.ThreadView = function(thread, board) {
    Entry.Model(this, false);

    this.thread = thread;

    this.svgGroup = board.svgThreadGroup.elem("group");

    this._parent = board; // statement
};

(function(p) {
    p.schema = {
        height: 0
    };

    p.destroy = function() {
        this.svgGroup.remove();
    };

    p.setParent = function(parent) {
        this._parent = parent;
    };

    p.renderText = function() {
        var blocks = this.thread.getBlocks();
        for (var i=0; i<blocks.length; i++)
            blocks[i].view.renderText();
    };

    p.renderBlock = function() {
        var blocks = this.thread.getBlocks();
        for (var i=0; i<blocks.length; i++)
            blocks[i].view.renderBlock();
    };

    p.requestAbsoluteCoordinate = function(blockView) {
        var blocks = this.thread.getBlocks();
        var block = blocks.shift();
        var pos = {x: 0, y: 0};
        if (!(this._parent instanceof Entry.Board ||
              this._parent instanceof Entry.BlockMenu))
            pos = this._parent.requestAbsoluteCoordinate();

        while (block.view !== blockView && block.view) {
            var prevBlockView = block.view;
            pos.x += prevBlockView.x + prevBlockView.magnet.next.x;
            pos.y += prevBlockView.y + prevBlockView.magnet.next.y;
            block = blocks.shift();
        }
        return pos;
    };

    p.requestPartHeight = function(blockView, forAll) {
        var blocks = this.thread.getBlocks();
        var block = blocks.pop();
        var height = blockView ? blockView.magnet.next ? blockView.magnet.next.y : blockView.height : 0;
        while (block && block.view !== blockView && block.view) {
            var prevBlockView = block.view;
            if (prevBlockView.magnet.next)
                height += prevBlockView.magnet.next.y;
            else
                height += prevBlockView.height;
            if (prevBlockView.dragMode === Entry.DRAG_MODE_DRAG)
                height = 0;
            block = blocks.pop();
        }
        return height;
    };

    p.dominate = function() {
        this._parent.dominate(this.thread);
    };

    p.isGlobal = function() {
        return this._parent instanceof Entry.Board;
    };
})(Entry.ThreadView.prototype);
