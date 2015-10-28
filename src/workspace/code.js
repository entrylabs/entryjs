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
    Entry.Model(this, false);

    this._data = new Entry.Collection();

    this._eventMap = {};

    this.executors = [];

    this.load(code);
};

(function(p) {
    p.schema = {
        board: null
    };

    p.load = function(code) {
        if (!(code instanceof Array))
            return console.error("code must be array");

        for (var i = 0; i < code.length; i++) {
            this._data.push(new Entry.Thread(code[i], this));
        }
    };

    p.changeBoard = function(board) {
        this.set({board: board});
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
                executor.block = executor.block.next;
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

    p.createThread = function(blocks) {
        if (!(blocks instanceof Array))
            return console.error("blocks must be array");

        this._data.push(new Entry.Thread(blocks, this));
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
