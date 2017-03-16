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
Entry.Thread = function(thread, code, parent) {
    this._data = new Entry.Collection();
    this._code = code;
    this.changeEvent = new Entry.Event(this);
    this.changeEvent.attach(this, this.handleChange);
    this._event = null;
    this.parent = parent ? parent : code;

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
        this._data.getAll().forEach(function(b) {
            b.createView(board, mode);
        });
    };

    p.destroyView = function() {
        this.view = null;
        this._data.map(function(b) {
            b.destroyView();
        });
    };

    p.separate = function(block, count) {
        if (!this._data.has(block.id)) return;

        var blocks = this._data.splice(this._data.indexOf(block), count);
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
        for (var i = 0; i < newBlocks.length; i++) {
            newBlocks[i].setThread(this);
        }
        this._data.splice.apply(
            this._data,
            [index + 1, 0].concat(newBlocks)
        );
        this.changeEvent.notify();
    };

    p.insertToTop = function(newBlock) {
        newBlock.setThread(this);
        this._data.unshift.apply(
            this._data,
            [newBlock]
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

    p.toJSON = function(isNew, index, excludeData) {
        var array = [];

        if (index === undefined) index = 0;
        else if (index instanceof Entry.Block)
            index = this.indexOf(index);

        var data = this._data;
        for (index; index < data.length; index++) {
            var block = data[index];
            if (block instanceof Entry.Block)
                array.push(block.toJSON(isNew, excludeData));
        }
        return array;
    };

    p.destroy = function(animate, isNotForce) {
        if (this.view) this.view.destroy(animate);

        var blocks = this._data;

        for (var i=blocks.length-1; i>=0; i--)
            blocks[i].destroy(animate, null, isNotForce);

        !blocks.length && this._code.destroyThread(this, false);
    };

    p.getBlock = function(index) {
        return this._data[index];
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
        this._data.remove(block);
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

    p.hasBlockType = function(type) {
        for (var i = 0; i < this._data.length; i++)
            if (inspectBlock(this._data[i])) return true;
        return false;

        function inspectBlock(block) {
            if (type == block.type) return true;

            var params = block.params;
            for (var k = 0; k < params.length; k++) {
                var param = params[k];
                if (param && param.constructor == Entry.Block) {
                    if (inspectBlock(param)) return true;
                }
            }
            var statements = block.statements;
            if (statements) {
                for (var j = 0; j < statements.length; j++) {
                    if (statements[j].hasBlockType(type))
                        return true;
                }
            }
            return false;
        }
    };

    p.getCount = function(startBlock) {
        var result = this._data.length;
        if (startBlock)
            result -= this._data.indexOf(startBlock);
        return result;
    };

    p.indexOf = function(block) {
        return this._data.indexOf(block);
    };

    p.pointer = function(pointer, block) {
        pointer = pointer || [];
        if (block)
            pointer.unshift(this.indexOf(block));

        var parent = this.parent;

        if (parent instanceof Entry.Block)
            pointer.unshift(parent.indexOfStatements(this));

        if (this._code === parent) {
            pointer.unshift(this._code.indexOf(this));
            var topBlock = this._data[0];
            pointer.unshift(topBlock.y);
            pointer.unshift(topBlock.x);
            return pointer;
        }
        return parent.pointer(pointer);
    };

    p.getBlockList = function(excludePrimitive, type) {
        var blocks = [];
        for (var i = 0; i < this._data.length; i++) {
            var block = this._data[i];
            if (block.constructor !== Entry.Block)
                continue;
            blocks = blocks.concat(block.getBlockList(excludePrimitive, type));
        }

        return blocks;
    };

    p.stringify = function(excludeData) {
        return JSON.stringify(this.toJSON(undefined, undefined, excludeData));
    };

    p.isInOrigin = function() {
        var block = this.getFirstBlock();
        return block && block.isInOrigin();
    };

    p.getDom = function(query) {
        if (query.length > 0) {
            var key = query.shift();
            if (key === "magnet")
                return this.view.getMagnet("next");
        } else {
            return this.view.svgGroup;
        }
    };

})(Entry.Thread.prototype);
