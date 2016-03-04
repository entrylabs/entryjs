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

    p.requestPartHeight = function(blockView) {
        if (!blockView) {
            var firstBlock = this.thread.getFirstBlock();
            if (!firstBlock) return 0;
            else blockView = firstBlock.view;
        }
        var blocks = this.thread.getBlocks();
        var block = blocks.pop();
        var height = blockView.magnet.next.y;
        while (block.view !== blockView && block.view) {
            var prevBlockView = block.view;
            if (prevBlockView.dragMode === Entry.DRAG_MODE_DRAG)
                height = 0;
            height += prevBlockView.magnet.next.y;
            block = blocks.pop();
        }
        return height;
    };

    p.dominate = function() {
        this._parent.dominate(this.thread);
    };
})(Entry.ThreadView.prototype);
