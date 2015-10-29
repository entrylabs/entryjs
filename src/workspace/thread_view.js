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

    this.svgGroup = board.svgThreadGroup.group();

    this.svgGroup.rect(0,0,20,20);
};

(function(p) {
    p.schema = {
        scrollX: 0,
        scrollY: 0
    };

})(Entry.ThreadView.prototype);
