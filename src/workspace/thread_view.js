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
};

(function(p) {
    p.schema = {
        scrollX: 0,
        scrollY: 0
    };

    p.destroy = function() {
        this.svgGroup.remove();
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
        while (block.view !== blockView && block.view) {
            var prevBlockView = block.view;
            pos.x += prevBlockView.x + prevBlockView.magnet.next.x;
            pos.y += prevBlockView.y + prevBlockView.magnet.next.y;
            block = blocks.shift();
        }
        return pos;
    };
})(Entry.ThreadView.prototype);
