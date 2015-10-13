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

    p.createThread = function(threadModel) {
        var thread = new Entry.Thread(threadModel);
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

})(Entry.Code.prototype);
