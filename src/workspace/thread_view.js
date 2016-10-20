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

    this.svgGroup = board.svgThreadGroup.elem("g");

    this.parent = board; // statement

    this._hasGuide = false;
};

(function(p) {
    p.schema = {
        height: 0,
        zIndex: 0
    };

    p.destroy = function() {
        this.svgGroup.remove();
    };

    p.setParent = function(parent) {
        this.parent = parent;
    };

    p.getParent = function() {
        return this.parent;
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
        if (!(this.parent instanceof Entry.Board ||
              this.parent instanceof Entry.BlockMenu))
            pos = this.parent.requestAbsoluteCoordinate();

        while (block && block.view !== blockView && block.view) {
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
        !this._hasGuide && this.parent.dominate(this.thread);
    };

    p.isGlobal = function() {
        return this.parent instanceof Entry.Board;
    };

    p.reDraw = function() {
        var blocks = this.thread._data;

        for (var i=blocks.length-1; i>=0; i--)
            blocks[i].view.reDraw();
    };

    p.setZIndex = function(zIndex) {
        this.set({zIndex: zIndex});
    };

    p.setHasGuide = function(bool) {
        this._hasGuide = bool;
    };

})(Entry.ThreadView.prototype);
