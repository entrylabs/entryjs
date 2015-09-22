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

    p.renderStart = function() {
        this.svgGroup = this.code.playground.snap.group();

        this._blocks.map(function(b) {
            b.renderStart();
        });

        this.align();
    };

    p.align = function() {
        var cursor = {x: 0, y: 0};
        this._blocks.map(function(b) {
            var transform = "t" + cursor.x + "," + cursor.y;
            b.svgGroup.animate({
                transform: transform
            }, 200);

            var magnet = b.magnets.next;
            cursor.x += magnet.x;
            cursor.y += magnet.y;
        });
    };

})(Entry.Thread.prototype);
