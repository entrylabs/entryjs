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
    Entry.Model(this, false);

    this.code = code;

    this._blocks = new Entry.Collection();

    this.loadModel(thread);

    this.board = null;

    this.svgGroup = null;

    this.observe(this, "resizeBG", ['width', 'height']);
};

(function(p) {
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
        var firstBlock = this._blocks.at(0)
        if (firstBlock.type === event) {
            return {block: firstBlock}
        } else {
            return null;
        }
    };

    p.next = function(block) {
        var i = this._blocks.indexOf(block);
        if (this._blocks.length <= i)
            return null;
        else
            return this._blocks.at(i + 1);
    }

    // method for board

    p.renderStart = function(board, animate) {
        animate = animate === undefined ? true : animate;
        this.board = board;
        this.svgGroup = board.snap.group();
        this.svgGroup.transform("t5,5");
        this.svgGroup.block = this;

        this._bg = this.svgGroup.rect(0, 0, this.width, this.height);
        this._bg.attr({"fill": "transparent"})

        var firstBlockBox = this._blocks.at(0);
        this._blocks.map(function(b) {
            b.renderStart(board, firstBlockBox);
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
        var firstBlock = this._blocks.at(0);
        firstBlock.set({
            x: x, y: y
        });
        this.align(animate);
    };

    p.align = function(animate) {
        animate = animate === undefined ? true : animate;
        var firstBlockBox = this._blocks.at(0),
            cursor = {
                x: firstBlockBox.x,
                y: firstBlockBox.y,
                offsetX: 0,
                minWidth: firstBlockBox.width,
                width: 0,
                height: 0
            };
        for (var i = 0; i < this._blocks.length; i++) {
            var b = this._blocks.at(i);
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
            array.push(this._blocks.at(i).toJSON());
        }
        return array;
    }

    p.clone = function(code) {
        code == code || this.code;
        var clonedBlocks = [];
        for (var i = 0; i < this._blocks.length; i++) {
            clonedBlocks.push(this._blocks.at(i).clone());
        }

        return new Entry.Thread(
            clonedBlocks,
            code
        );
    }

    p.getBlocks = function() {
        return this._blocks;
    }

})(Entry.Thread.prototype);
