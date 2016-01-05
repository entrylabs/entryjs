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

    this.svgGroup = board.svgThreadGroup.group();
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

})(Entry.ThreadView.prototype);
