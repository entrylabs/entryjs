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

    this.observe(this, "_changeBoard", ["board"]);

    this.svgThreadGroup = board.svgGroup.group();
    this.svgThreadGroup.board = board;

    this.svgBlockGroup = board.svgGroup.group();
    this.svgBlockGroup.board = board;

    board.bindCodeView(this);

    this.code.map(function(thread) {
        thread.createView(board);
    });
};

(function(p) {
    p.schema = {
        board: null,
        scrollX: 0,
        scrollY: 0
    };

    p._changeBoard = function() {
        var board = this.board;
        var threads = this.code.getThreads();
        for (var i = 0; i < threads.length; i++) {
            if (threads[i].view)
                threads[i].view.changeBoard(board);
        }
    };


})(Entry.CodeView.prototype);
