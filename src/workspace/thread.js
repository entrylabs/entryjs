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

    this.load(thread);

    if (code.view)
        this.createView(code.view.board);

    /*
    Entry.Model(this, false);

    this.code = code;

    this._blocks = new Entry.Collection();

    this.loadModel(thread);

    this.board = null;

    this.svgGroup = null;

    this.observe(this, "resizeBG", ['width', 'height']);
    */
};

(function(p) {
    p.load = function(thread) {
        if (!(thread instanceof Array))
            return console.error("thread must be array");

        for (var i = 0; i < thread.length; i++) {
            var block = thread[i];
            if (block instanceof Entry.Block) {
                block.setThread(this);
                this._data.push(block);
            } else {
                this._data.push(new Entry.Block(block, this));
            }
        }

        this._setRelation();
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
        console.log(board);
        if (!this.view)
            this.view = new Entry.ThreadView(this, board);
        this._data.map(function(b) {
            b.createView(board);
        });
    };

    p.separate = function(block) {
        if (!this._data.has(block.id) || !block.prev)
            return;
        block.prev.setNext(null);
        block.setPrev(null);
        var blocks = this._data.splice(this._data.indexOf(block));
        this._code.createThread(blocks);
    };

    p.cut = function(block) {
        var index = this._data.indexOf(block);
        var splicedData = this._data.splice(index);
        return splicedData;
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
    };

    /*
    p.schema = {
        type: Entry.STATIC.THREAD_MODEL,
        x: 0,
        y: 0,
        offsetX: 0,
        width: 0,
        minWidth: 0,
        height: 0,
    };

    p.loadModel = function(thread) {

        var that = this;

        var blocks = thread.map(function(b) {
            if (b instanceof Entry.Block) {
                b.thread = that;
                return b;
            }
            else
                return new Entry.Block(b, that);
        });

        this._blocks.set(blocks);
    };

    p.indexOf = function(block) {
        return this._blocks.indexOf(block);
    };

    p.cut = function(block) {
        var index = this._blocks.indexOf(block);
        var splicedData = this._blocks.splice(index);
        return splicedData;
    };

    p.raiseEvent = function(event) {
        var firstBlock = this._blocks[0];
        if (firstBlock.type === event) {
            return {block: firstBlock};
        } else {
            return null;
        }
    };

    p.next = function(block) {
        var i = this._blocks.indexOf(block);
        if (this._blocks.length <= i)
            return null;
        else
            return this._blocks[i + 1];
    };

    // method for board

    p.renderStart = function(board, animate) {
        animate = animate === undefined ? true : animate;
        this.board = board;
        this.svgGroup = board.snap.group();
        this.svgGroup.transform("t5,5");
        this.svgGroup.block = this;

        this._bg = this.svgGroup.rect(0, 0, this.width, this.height);
        this._bg.attr({"fill": "transparent"});

        var firstBlockBox = this._blocks[0];
        this._blocks.map(function(b) {
            b.renderStart(board, firstBlockBox, animate);
        });

        this.align(animate);
    };

    p.resizeBG = function() {
        this._bg.attr({
            x: this.x + this.offsetX,
            y: this.y,
            width: this.width,
            height: this.height
        });
    };

    p.moveTo = function(x, y, animate) {
        animate = animate === undefined ? true : animate;
        var firstBlock = this._blocks[0];
        firstBlock.set({
            x: x, y: y
        });
        this.align(animate);
    };

    p.align = function(animate) {
        animate = animate === undefined ? true : animate;
        var firstBlockBox = this._blocks[0],
            cursor = {
                x: firstBlockBox.x,
                y: firstBlockBox.y,
                offsetX: 0,
                minWidth: firstBlockBox.width,
                width: 0,
                height: 0
            };
        for (var i = 0; i < this._blocks.length; i++) {
            var b = this._blocks[i];
            if (b.dragInstance && animate) {
                break;
            } // this code sucks
            if (b.dragInstance) {
                cursor.height = cursor.y - firstBlockBox.y;
                cursor.x = b.x;
                cursor.y = b.y;
            }
            b.moveTo(cursor.x, cursor.y, animate);

            var magnet = b.magnets.next;
            if (magnet) {
                cursor.y += b.height + 1;
                cursor.y += b.marginBottom;
            }

            cursor.width = Math.max(cursor.width, b.width);
            cursor.minWidth = Math.min(cursor.minWidth, b.width);
            cursor.offsetX = Math.min(cursor.offsetX, b.offsetX);
        }
        cursor.height = cursor.height || cursor.y - firstBlockBox.y;
        this.set({
            x: firstBlockBox.x,
            y: firstBlockBox.y,
            offsetX: cursor.offsetX,
            minWidth: cursor.minWidth,
            width: cursor.width,
            height: cursor.height
        });
    };

    p.dominate = function() {
         this.board.dominate(this);
    };

    p.destroy = function() {
        if (this.svgGroup)
            this.svgGroup.remove();
        this.code.remove(this);
    };

    p.toJSON = function() {
        var array = [];
        for (var i = 0; i < this._blocks.length; i++) {
            array.push(this._blocks[i].toJSON());
        }
        return array;
    };

    p.clone = function(code) {
        code = code || this.getCode();
        var clonedBlocks = [];
        for (var i = 0; i < this._blocks.length; i++) {
            clonedBlocks.push(this._blocks[i].clone());
        }

        return new Entry.Thread(
            clonedBlocks,
            code
        );
    };

    p.getBlocks = function() {
        return this._blocks;
    };

    p.getCode = function() {
        return this.code;
    };
    */

})(Entry.Thread.prototype);
