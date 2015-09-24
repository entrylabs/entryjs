/*
 *
 */
"use strict";

goog.provide("Entry.Thread");

goog.require("Entry.Collection");

/*
 *
 */
Entry.Thread = function(thread, code) {
    this.code = code;

    this._blocks = new Entry.Collection();

    this.set(thread);

    this._playground = null;

    this.svgGroup = null;
};

(function(p) {
    p.set = function(thread) {
        var that = this;

        var blocks = thread.map(function(b) {
            return new Entry.Block(b, that);
        });

        this._blocks.set(blocks);
    };


    // method for playground

    p.renderStart = function(playground) {
        this._playground = playground;
        this.svgGroup = playground.snap.group();
        this.svgGroup.transform("t5,5");

        var firstBlockBox = this._blocks.at(0).box;
        this._blocks.map(function(b) {
            b.renderStart(playground, firstBlockBox);
        });

        this.align();
    };

    p.align = function(animate) {
        animate = animate === undefined ? true : animate;
        var firstBlockBox = this._blocks.at(0).box;
        var cursor = {
            x: firstBlockBox.x,
            y: firstBlockBox.y
        };
        this._blocks.map(function(b) {
            if (b.dragMode) {
                cursor.x = b.box.x;
                cursor.y = b.box.y;
            }
            b.moveTo(cursor.x, cursor.y, animate);

            var magnet = b.magnets.next;
            cursor.x += magnet.x;
            cursor.y += magnet.y;
        });
    };

})(Entry.Thread.prototype);
