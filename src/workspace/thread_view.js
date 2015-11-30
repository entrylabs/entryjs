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

})(Entry.ThreadView.prototype);
