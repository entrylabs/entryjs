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
    this._data = new Entry.Collection();

    this._eventMap = {};

    this.executors = [];

    this.load(code);
};

(function(p) {
    p.load = function(code) {
        if (!(code instanceof Array))
            return console.error("code must be array");

        for (var i = 0; i < code.length; i++) {
            this._data.push(new Entry.Thread(code[i], this));
        }
    };

    p.set = function(code) {
        /*
        var that = this;

        var threads = code.map(function(t) {
            return new Entry.Thread(t, that);
        });

        this.threads.set(threads);
        */
    };

    p.bindBoard = function(board) {
        /*
        this.board = board;

        this.threads.map(function(t) {
            t.renderStart(board);
        });
        */
    };

    p.registerEvent = function(block, eventType) {
        if (!this._eventMap[eventType])
            this._eventMap[eventType] = [];

        this._eventMap[eventType].push(block);
    };

    p.raiseEvent = function(eventType) {
        var blocks = this._eventMap[eventType];
        for (var i = 0; i < blocks.length; i++) {
            var executor = {block: blocks[i]};
            this.executors.push(executor);
        }
    };

    p.tick = function() {
        var executors = this.executors;
        for (var i = 0; i < executors.length; i++) {
            var executor = executors[i];
            while (executor.block &&
                   executor.block.execute(executor) == Entry.STATIC.RETURN) {
                executor.block = executor.block.next(executor.block);
            }
            if (executor.block === null) {
                executors.splice(i, 1);
                i--;
            }
        }
    };

    p.clearExecutors = function() {
        this.executors = [];
    };

    /*
    p.createThread = function(blocks) {
        var thread = new Entry.Thread(blocks, this);
        if (this.board)
            thread.renderStart(this.board);
        this.threads.push(thread);
        return thread;
    };

    // method for playground

    p.remove = function(thread) {
        this.threads.remove(thread);
    };

    */

    /*
    p.toJSON = function() {
        var array = [];
        for (var i = 0; i < this.threads.length; i++) {
            array.push(this.threads[i].toJSON());
        }
        return array;
    };

    p.getThreads = function() {
        return this.threads;
    };

    p.addThread = function(thread, animate) {
        if (this.board)
            thread.renderStart(this.board, animate);
        this.threads.push(thread);
        return thread;
    };
    */

})(Entry.Code.prototype);
