/*
 *
 */
"use strict";

goog.provide("Entry.Code");

goog.require("Entry.Collection");
goog.require('Entry.STATIC');

/*
 *
 */
Entry.Code = function(code) {
    if (!(code instanceof Array))
        return console.error("code must be array");

    this.threads = new Entry.Collection();

    this.board = null;

    this.executors = [];

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
            thread.renderStart(this.board);
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

    p.raiseEvent = function(event) {
        for (var i = 0; i < this.threads.length; i++) {
            var executor = this.threads.at(i).raiseEvent(event);
            if (executor !== null) this.executors.push(executor);
        }
    };

    p.tick = function() {
        var executors = this.executors;
        for (var i = 0; i < executors.length; i++) {
            var executor = executors[i];
            while (executor.block &&
                   executor.block.func.call(executor) == Entry.STATIC.RETURN) {
                executor.block = executor.block.thread.next(executor.block);
            };
            if (executor === null) {
                executors.splice(i, 1);
                i--;
            }
        }
    }

})(Entry.Code.prototype);
