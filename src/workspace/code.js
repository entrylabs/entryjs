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
Entry.Code = function(code, object) {
    Entry.Model(this, false);

    if (object) this.object = object;

    this._data = new Entry.Collection();

    this._eventMap = {};
    this._blockMap = {};

    this.executors = [];

    this.executeEndEvent = new Entry.Event(this);
    this.changeEvent = new Entry.Event(this);
    this.changeEvent.attach(this, this._handleChange);

    this._maxZIndex = 0;

    this.load(code);
};

Entry.STATEMENT = 0;
Entry.PARAM = -1;

(function(p) {
    p.schema = {
        view: null,
        board: null
    };

    p.load = function(code) {
        if (!(code instanceof Array))
            code = JSON.parse(code);

        this.clear();

        for (var i = 0; i < code.length; i++)
            this._data.push(new Entry.Thread(code[i], this));

        return this;
    };

    p.clear = function() {
        for (var i = this._data.length - 1; i >= 0; i--)
            this._data[i].destroy(false);

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

    p.raiseEvent = function(eventType, entity, value) {
        var blocks = this._eventMap[eventType];
        var executors = [];
        if (blocks === undefined) return;
        for (var i = 0; i < blocks.length; i++) {
            var block = blocks[i];
            if (value === undefined ||
                block.params.indexOf(value) > -1) {
                    var executor = new Entry.Executor(blocks[i], entity);
                    this.executors.push(executor);
                    executors.push(executor);
                }
        }
        return executors;
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
            if (executor.isEnd()) {
                executors.splice(i, 1);
                i--;
                if (executors.length === 0)
                    this.executeEndEvent.notify();
            }
        }
    };

    p.removeExecutor = function(executor) {
        var index = this.executors.indexOf(executor);
        if (index > -1)
            this.executors.splice(index, 1);
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

        var board = this.board;
        if (board instanceof Entry.BlockMenu) board.updateSplitters(y);
    };

    p.stringify = function() {
        return JSON.stringify(this.toJSON());
    };

    p.dominate = function(thread) {
        thread.view.setZIndex(this._maxZIndex++);
    };

    p.indexOf = function(thread) {
        return this._data.indexOf(thread);
    };

    p._handleChange = function() {
        if (Entry.creationChangedEvent)
            Entry.creationChangedEvent.notify();
    };

    p.hasBlockType = function(type) {
        var threads = this.getThreads();

        for (var i = 0; i < threads.length; i ++)
            if (threads[i].hasBlockType(type)) return true;

        return false;
    };

    p.findById = function(id) {
        return this._blockMap[id];
    };

    p.registerBlock = function(block) {
        this._blockMap[block.id] = block;
    };

    p.unregisterBlock = function(block) {
        delete this._blockMap[block.id];
    };

    p.getByPointer = function(pointer) {
        pointer = pointer.concat();
        pointer.shift();
        pointer.shift();
        var thread = this._data[pointer.shift()];
        var block = thread.getBlock(pointer.shift());
        while (pointer.length) {
            if (!(block instanceof Entry.Block))
                block = block.getValueBlock();
            var type = pointer.shift();
            var index = pointer.shift();
            if (type > -1) {
                var statements = block.statements[type];
                block = statements.getBlock(index);
            } else if (type === -1) {
                block = block.view.getParam(index);
            }
        }
        return block;
    };

    p.getTargetByPointer = function(pointer) {
        pointer = pointer.concat();
        pointer.shift();
        pointer.shift();
        var thread = this._data[pointer.shift()];
        var block;
        if (pointer.length === 1) {
            block = thread.getBlock(pointer.shift() - 1);
        } else {
            block = thread.getBlock(pointer.shift());
            while (pointer.length) {
                if (!(block instanceof Entry.Block))
                    block = block.getValueBlock();
                var type = pointer.shift();
                var index = pointer.shift();
                if (type > -1) {
                    var statement = block.statements[type];
                    if (!pointer.length) {
                        if (index === 0)
                            block = statement.view.getParent();
                        else
                            block = statement.getBlock(index - 1);
                    } else {
                        block = statement.getBlock(index);
                    }
                } else if (type === -1) {
                    block = block.view.getParam(index);
                }
            }
        }
        return block;
    };

    p.getBlockList = function() {
        var threads = this.getThreads();
        var blocks = [];

        for (var i = 0; i < threads.length; i ++)
            blocks = blocks.concat(threads[i].getBlockList());

        return blocks;
    };
})(Entry.Code.prototype);
