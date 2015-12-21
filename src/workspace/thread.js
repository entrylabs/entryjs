/*
 *
 */
"use strict";

goog.provide("Entry.Thread");

goog.require('Entry.Model');
goog.require("Entry.Collection");
goog.require("Entry.DummyBlock");

/*
 *
 */
Entry.Thread = function(thread, code) {
    this._data = new Entry.Collection();
    this._code = code;
    this.changeEvent = new Entry.Event(this);
    this.changeEvent.attach(this, this.inspectExist);

    this.load(thread);
};

(function(p) {
    p.load = function(thread) {
        if (thread === undefined)
            thread = [];
        if (!(thread instanceof Array)) {
            return console.error("thread must be array");
        }

        for (var i = 0; i < thread.length; i++) {
            var block = thread[i];
            if (block instanceof Entry.Block ||
               block instanceof Entry.DummyBlock) {
                block.setThread(this);
                this._data.push(block);
            } else {
                this._data.push(new Entry.Block(block, this));
            }
        }
        this._setRelation();

        var codeView = this._code.view;
        if (codeView) this.createView(codeView.board);
    };

    p._setRelation = function() {
        var blocks = this._data.getAll();
        if (blocks.length === 0) return;

        var prevBlock = blocks[0];
        prevBlock.setPrev(null);
        blocks[blocks.length - 1].setNext(null);
        for (var i = 1; i < blocks.length; i++) {
            var block = blocks[i];
            block.setPrev(prevBlock);
            prevBlock.setNext(block);
            prevBlock = block;
        }
    };

    p.registerEvent = function(block, eventType) {
        this._code.registerEvent(block, eventType);
    };

    p.createView = function(board) {
        if (!this.view)
            this.view = new Entry.ThreadView(this, board);
        this._data.map(function(b) {
            b.createView(board);
        });
    };

    p.separate = function(block) {
        if (!this._data.has(block.id))
            return;
        if (block.prev) {
            block.prev.setNext(null);
            block.setPrev(null);
        }
        var blocks = this._data.splice(this._data.indexOf(block));
        this._code.createThread(blocks);
        this.changeEvent.notify();
    };

    p.cut = function(block) {
        var index = this._data.indexOf(block);
        var splicedData = this._data.splice(index);
        if (this._data[index - 1])
            this._data[index - 1].setNext(null);
        this.changeEvent.notify();
        return splicedData;
    };

    p.insertDummyBlock = function(dummyBlock) {
        this._data.unshift(dummyBlock);
        if (this._data[1]) {
            this._data[1].setPrev(dummyBlock);
            dummyBlock.setNext(this._data[1]);
        }
    };

    p.insertByBlock = function(block, newBlocks) {
        var index = this._data.indexOf(block);
        block.setNext(newBlocks[0]);
        newBlocks[0].setPrev(block);
        for (var i in newBlocks) {
            newBlocks[i].setThread(this);
        }
        this._data.splice.apply(
            this._data,
            [index + 1, 0].concat(newBlocks)
        );
        this._setRelation();
        this.changeEvent.notify();
    };

    p.clone = function(code) {
        var code = code || this._code;
        var newThread = new Entry.Thread([], code);
        var data = this._data;
        var cloned = [];
        for (var i=0, len=data.length; i<len; i++) {
            cloned.push(data[i].clone(newThread));
        }
        newThread.load(cloned);
        return newThread;
    };

    p.toJSON = function(isNew, start) {
        var array = [];
        start = start === undefined ? 0 : start;
        for (var i = start; i < this._data.length; i++) {
            var block = this._data[i];
            if (block instanceof Entry.Block)
                array.push(this._data[i].toJSON(isNew));
        }
        return array;
    };

    p.destroy = function(animate) {
        this._code.destroyThread(this, false);
        if (this.view) this.view.destroy(animate);
    };

    p.getFirstBlock = function() {
        return this._data[0];
    };

    p.getBlocks = function() {
        return this._data;
    };

    p.countBlock = function() {
        var count = 0;
        for (var i = 0; i < this._data.length; i++) {
            var block = this._data[i];
            if (!block.type)
                continue;
            count++;

            var statements = block.statements;
            if (statements) {
                for (var j = 0; j < statements.length; j++) {
                    var statement = statements[j];
                    count += statement.countBlock();
                }
            }
        }
        return count;
    };

    p.inspectExist = function() {
        //if (this._data.length === 0) this.destroy();
    };

    p.getCode = function() {
        return this._code;
    };

    p.setCode = function(code) {
        this._code = code;
    };

    p.spliceBlock = function(block) {
        var blocks = this.getBlocks();
        blocks.remove(block);

        if (blocks.length !== 0) {
            if (block.prev === null)
                block.next.setPrev(null);
            else if (block.next === null)
                block.prev.setNext(null);
            else {
                block.prev.setNext(block.next);
                block.next.setPrev(block.prev);
            }
            this._setRelation();
        } else this.destroy();

        this.changeEvent.notify();
    };

})(Entry.Thread.prototype);
