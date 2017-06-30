/*
 *
 */
"use strict";

goog.provide("Entry.FieldLineBreak");

goog.require("Entry.Field");

/*
 *
 */
Entry.FieldLineBreak = function(content, blockView, index) {
    this._block = blockView.block;
    this._blockView = blockView;
    this._index = index;

    var box = new Entry.BoxModel();
    this.box = box;

    this.setValue(null);
    this.renderStart();
};

Entry.Utils.inherit(Entry.Field, Entry.FieldLineBreak);

(function(p) {
    p.renderStart = function() {
        return;
    };

    p.align = function(targetStatementIndex) {
        var blockView = this._blockView;

        if (blockView._statements.length === 0) return;

        this.box.set({
            y: (blockView._statements[targetStatementIndex].height || 20) +
                Math.max(blockView.contentHeight%1000, 30)
        });
    };



})(Entry.FieldLineBreak.prototype);
