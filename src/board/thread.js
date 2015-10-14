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
};

(function(p) {
    p.schema = {
        type: Entry.STATIC.THREAD_MODEL,
        x: 0,
        y: 0,
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

    // method for board

    p.renderStart = function(board) {
        this.board = board;
        this.svgGroup = board.snap.group();
        this.svgGroup.transform("t5,5");

        var firstBlockBox = this._blocks.at(0);
        this._blocks.map(function(b) {
            b.renderStart(board, firstBlockBox);
        });

        this.align();
        this.updateMagnetMap(this._blocks.at(0));
    };

    p.align = function(animate) {
        animate = animate === undefined ? true : animate;
        var firstBlockBox = this._blocks.at(0);
        var cursor = {
            x: firstBlockBox.x,
            y: firstBlockBox.y,
            minWidth: firstBlockBox.width,
            width: 0
        };
        for (var i = 0; i < this._blocks.length; i++) {
            var b = this._blocks.at(i);
            if (b.dragInstance && animate)
                break;
            var prevMagnet = b.magnets.previous;
            cursor.x -= prevMagnet.x;
            cursor.y -= prevMagnet.y;
            if (b.dragInstance) {
                cursor.x = b.x;
                cursor.y = b.y;
            }
            b.moveTo(cursor.x, cursor.y, animate);

            var magnet = b.magnets.next;
            cursor.x += magnet.x;
            cursor.y += magnet.y;

            cursor.width = Math.max(cursor.width, b.width);
            cursor.minWidth = Math.min(cursor.minWidth, b.width);
        };
        this.set({
            x: firstBlockBox.x,
            y: firstBlockBox.y,
            minWidth: cursor.minWidth,
            width: cursor.width,
            height: cursor.y - firstBlockBox.y
        });
    };

    p.updateMagnetMap = function(block) {

        var minIndex = 0;
        var maxIndex = this.length - 1;
        var currentIndex;
        var currentElement;

        while (minIndex <= maxIndex) {
            currentIndex = (minIndex + maxIndex) / 2 | 0;
            currentElement = this[currentIndex];

            if (currentElement < searchElement) {
                minIndex = currentIndex + 1;
            }
            else if (currentElement > searchElement) {
                maxIndex = currentIndex - 1;
            }
            else {
                return currentIndex;
            }
        }

    };

    p.dominate = function() {
         this.board.dominate(this);
    };

    p.destroy = function() {
        if (this.svgGroup)
            this.svgGroup.remove();
        this.code.remove(this);
    };

})(Entry.Thread.prototype);
