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

    this.load(thread);

    this.changeEvent = new Entry.Event(this);
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
        if (blocks.length === 0)
            return;

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
        var clonedBlocks = [];
        var newThread = new Entry.Thread([], code);
        var blocks = this._data;
        for (var i = 0; i < blocks.length; i++) {
            clonedBlocks.push(
                blocks[i].clone(newThread)
            );
        }
        newThread.load(clonedBlocks);
        return newThread;
    };

    p.toJSON = function(isNew) {
        var array = [];
        for (var i = 0; i < this._data.length; i++) {
            var block = this._data[i];
            if (block instanceof Entry.Block)
                array.push(this._data[i].toJSON(isNew));
        }
        return array;
    };

    p.destroy = function(animate) {
        this._code.getThreads().remove(this);
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
            var schema = Entry.block[block.type];
            var contents = schema.contents;
            for (var j = 0; j < contents.length; j++) {
                var content = contents[j];
                if (content.type == "Statement") {
                    count += block.values[content.key].countBlock();
                }
            }
        }
        return count;
    };

})(Entry.Thread.prototype);
