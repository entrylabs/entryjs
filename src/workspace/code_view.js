/*
 *
 */
"use strict";

goog.provide("Entry.CodeView");

/*
 *
 */
Entry.CodeView = function(code, board) {
    Entry.Model(this, false);

    this.code = code;
    this.set({board: board});


    this.svgThreadGroup = board.svgGroup.group();
    this.svgThreadGroup.attr({
        class: 'svgThreadGroup'
    });

    this.svgThreadGroup.board = board;

    this.svgBlockGroup = board.svgGroup.group();
    this.svgBlockGroup.attr({
        class: 'svgBlockGroup'
    });
    this.svgBlockGroup.board = board;

    board.bindCodeView(this);

    this.code.map(function(thread) {
        thread.createView(board);
    });

    code.observe(this, "_setBoard", ['board']);
};

(function(p) {
    p.schema = {
        board: null,
        scrollX: 0,
        scrollY: 0
    };

    p._setBoard = function() {
        this.set({board:this.code.board});
    };

})(Entry.CodeView.prototype);
