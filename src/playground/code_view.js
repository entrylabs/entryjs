/*
 *
 */
'use strict';

/*
 *
 */
Entry.CodeView = function(code, board) {
    Entry.Model(this, false);

    this.code = code;
    this.set({ board: board });

    this.svgThreadGroup = board.svgGroup.elem('g');
    this.svgThreadGroup.attr({
        class: 'svgThreadGroup',
    });

    this.svgThreadGroup.board = board;

    this.svgBlockGroup = board.svgGroup.elem('g');
    this.svgBlockGroup.attr({
        class: 'svgBlockGroup',
    });
    this.svgBlockGroup.board = board;

    this.svgCommentGroup = board.svgGroup.elem('g');
    this.svgCommentGroup.attr({
        class: 'svgCommentGroup',
    });
    this.svgCommentGroup.board = board;

    board.bindCodeView(this);

    this.code._data.getAll().forEach(function(thread) {
        thread.createView(board);
    });
    code.observe(this, '_setBoard', ['board']);
};

(function(p) {
    p.schema = {
        board: null,
        scrollX: 0,
        scrollY: 0,
    };

    p._setBoard = function() {
        this.set({ board: this.code.board });
    };

    p.reDraw = function() {
        this.code.map(
            function(thread) {
                if (thread.view) thread.view.reDraw();
                else thread.createView(this.board);
            }.bind(this)
        );
    };

    p.destroy = function() {
        this.code.map(function(thread) {
            thread.destroyView();
        });
    };
})(Entry.CodeView.prototype);
