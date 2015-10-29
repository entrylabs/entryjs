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
};

(function(p) {
    p.schema = {
        scrollX: 0,
        scrollY: 0
    };

})(Entry.ThreadView.prototype);
