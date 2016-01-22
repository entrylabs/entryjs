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

    this.executeEndEvent = new Entry.Event(this);
    this.changeEvent = new Entry.Event(this);

    this.load(code);
};

(function(p) {
    p.schema = {
        view: null,
        board: null
    };

    p.load = function(code) {
        if (!(code instanceof Array))
            return console.error("code must be array");

        this.clear();

        for (var i = 0; i < code.length; i++)
            this._data.push(new Entry.Thread(code[i], this));

        return this;
    };

    p.clear = function() {
        for (var i = this._data.length - 1; i >= 0; i--)
            this._data[i].getFirstBlock().destroy();

        this.clearExecutors();

        this._eventMap = {};
    };

    p.createView = function(board) {
        if (this.view === null) {
            this.set({
                view: new Entry.CodeView(this, board),
                board: board
            });
        } else {
            this.set({board : board});
            board.bindCodeView(this.view);
        }
    };

    p.registerEvent = function(block, eventType) {
        if (!this._eventMap[eventType])
            this._eventMap[eventType] = [];

        this._eventMap[eventType].push(block);
    };

    p.unregisterEvent = function(block, eventType) {
        var blocks = this._eventMap[eventType];
        if (!blocks || blocks.length === 0) return;

        var index = blocks.indexOf(block);
        if (index < 0) return;
        blocks.splice(index,1);
    };

    p.raiseEvent = function(eventType, entity) {
        var blocks = this._eventMap[eventType];
        if (blocks === undefined) return;
        for (var i = 0; i < blocks.length; i++) {
            this.executors.push(new Entry.Executor(blocks[i], entity));
        }
    };

    p.getEventMap = function(eventType) {return this._eventMap[eventType];};

    p.map = function(func) {
        this._data.map(func);
    };

    p.tick = function() {
        var executors = this.executors;
        for (var i = 0; i < executors.length; i++) {
            var executor = executors[i];
            executor.execute();
            if (executor.scope.block === null) {
                executors.splice(i, 1);
                i--;
                if (executors.length === 0)
                    this.executeEndEvent.notify();
            }
        }
    };

    p.clearExecutors = function() {
        this.executors = [];
    };

    p.createThread = function(blocks) {
        if (!(blocks instanceof Array))
            return console.error("blocks must be array");

        var thread = new Entry.Thread(blocks, this);
        this._data.push(thread);
        return thread;
    };

    p.cloneThread = function(thread, mode) {
        var newThread = thread.clone(this, mode);
        this._data.push(newThread);
        return newThread;
    };

    p.destroyThread = function(thread, animate) {
        var data = this._data;
        var index = data.indexOf(thread);
        // case of statement thread
        if (index < 0) return;
        data.splice(index, 1);
    };

    p.doDestroyThread = function(thread, animate) {
        var data = this._data;
        var index = data.indexOf(thread);
        // case of statement thread
        if (index < 0) return;
        data.splice(index, 1);
    };

    p.getThreads = function() {
        return this._data.map(function(t){return t;});
    };

    p.toJSON = function() {
        var threads = this.getThreads();
        var json = [];
        for (var i=0, len=threads.length; i<len; i++)
            json.push(threads[i].toJSON());
        return json;
    };

    p.countBlock = function() {
        var threads = this.getThreads();
        var count = 0;
        for (var i = 0; i < threads.length; i++)
            count += threads[i].countBlock();
        return count;
    };

    p.moveBy = function(x, y) {
        var threads = this.getThreads();
        for (var i=0, len=threads.length; i<len; i++) {
            var firstBlock = threads[i].getFirstBlock();
            if (firstBlock)
                firstBlock.view._moveBy(x, y, false);
        }
    };

    p.stringify = function() {
        return JSON.stringify(this.toJSON());
    };

})(Entry.Code.prototype);
