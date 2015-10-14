/*
 *
 */
"use strict";

goog.provide("Entry.Code");

goog.require("Entry.Collection");

/*
 *
 */
Entry.Code = function(code) {
    if (!(code instanceof Array))
        return console.error("code must be array");

    this.threads = new Entry.Collection();

    this.board = null;

    this.set(code);
};

(function(p) {
    p.set = function(code) {
        var that = this;

        var threads = code.map(function(t) {
            return new Entry.Thread(t, that);
        });

        this.threads.set(threads);
    };

    /* for alive blocks */
    p.createThread = function(blocks) {
        var thread = new Entry.Thread(blocks, this);
        if (this.board)
            thread.renderStart(board);
        this.threads.push(thread);
        return thread;
    };

    // method for playground

    p.bindBoard = function(board) {
        this.board = board;

        this.threads.map(function(t) {
            t.renderStart(board);
        });
    };

    p.remove = function(thread) {
        this.threads.remove(thread);
    };

})(Entry.Code.prototype);
