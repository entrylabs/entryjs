/*
 *
 */
"use strict";

goog.provide("Entry.Thread");

goog.require('Entry.Model');
goog.require("Entry.Collection");

/*
 *
 */
Entry.Thread = function(thread, code) {
    this._data = new Entry.Collection();
    this._code = code;
    this.changeEvent = new Entry.Event(this);
    this.changeEvent.attach(this, this.handleChange);
    this._event = null;

    this.load(thread);
};

(function(p) {
    p.load = function(thread, mode) {
        if (thread === undefined)
            thread = [];
        if (!(thread instanceof Array)) {
            return console.error("thread must be array");
        }

        for (var i = 0; i < thread.length; i++) {
            var block = thread[i];
            if (block instanceof Entry.Block || block.isDummy) {
                block.setThread(this);
                this._data.push(block);
            } else this._data.push(new Entry.Block(block, this));
        }

        var codeView = this._code.view;
        if (codeView) this.createView(codeView.board, mode);
    };

    p.registerEvent = function(block, eventType) {
        this._event = eventType;
        this._code.registerEvent(block, eventType);
    };

    p.unregisterEvent = function(block, eventType) {
        this._code.unregisterEvent(block, eventType);
    };

    p.createView = function(board, mode) {
        if (!this.view)
            this.view = new Entry.ThreadView(this, board);
        var prevBlock = null;
        this._data.map(function(b) {
            b.createView(board, mode);
        });
    };

    p.separate = function(block) {
        if (!this._data.has(block.id)) return;

        var blocks = this._data.splice(this._data.indexOf(block));
        this._code.createThread(blocks);
        this.changeEvent.notify();
    };

    p.cut = function(block) {
        var index = this._data.indexOf(block);
        var splicedData = this._data.splice(index);
        this.changeEvent.notify();
        return splicedData;
    };

    p.insertByBlock = function(block, newBlocks) {
        var index = block ? this._data.indexOf(block) : -1;
        for (var i in newBlocks) {
            newBlocks[i].setThread(this);
        }
        this._data.splice.apply(
            this._data,
            [index + 1, 0].concat(newBlocks)
        );
        this.changeEvent.notify();
    };

    p.clone = function(code, mode) {
        var code = code || this._code;
        var newThread = new Entry.Thread([], code);
        var data = this._data;
        var cloned = [];
        for (var i=0, len=data.length; i<len; i++) {
            var block = data[i];
            cloned.push(data[i].clone(newThread));
        }
        newThread.load(cloned, mode);
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

        var blocks = this._data;

        for (var i=blocks.length-1; i>=0; i--)
            blocks[i].destroy(animate);
    };

    p.getBlocks = function() {
        return this._data.map(function(b){return b;});
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

    p.handleChange = function() {
        if (this._data.length === 0) this.destroy();
    };

    p.getCode = function() {
        return this._code;
    };

    p.setCode = function(code) {
        this._code = code;
    };

    p.spliceBlock = function(block) {
        var blocks = this._data;
        blocks.remove(block);

        if (blocks.length !== 0) {
        } else this.destroy();

        this.changeEvent.notify();
    };

    p.getFirstBlock = function() {
        return this._data[0];
    };

    p.getPrevBlock = function(block) {
        var index = this._data.indexOf(block);
        return this._data.at(index - 1);
    };

    p.getNextBlock = function(block) {
        var index = this._data.indexOf(block);
        return this._data.at(index + 1);
    };

    p.getLastBlock = function() {
        return this._data.at(this._data.length - 1);
    };

    p.getRootBlock = function() {
        return this._data.at(0);
    };
})(Entry.Thread.prototype);
