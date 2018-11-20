'use strict';

(function(c) {
    const COMMAND_TYPES = Entry.STATIC.COMMAND_TYPES;

    c[COMMAND_TYPES.createCommentBlock] = {
        do(block, board, point = { x: 0, y: 0 }) {
            if (block) {
                block._comment = new Entry.Comment(block, board);
            } else {
                const comment = new Entry.Comment(undefined, board, point);
                board.code.createThread([comment], 0);
            }
            board.set({ isVisibleComment: true });
        },
        state(block, board) {
            return [block, board];
        },
        log() {
            return [];
        },
        undo: 'removeCommentBlock',
    };

    c[COMMAND_TYPES.removeCommentBlock] = {
        do(comment, board) {
            if (comment instanceof Entry.Comment) {
                comment.destroy();
            } else if (comment instanceof Entry.Block) {
                comment._comment.destroy();
            } else {
                const { code } = board || {};
                code.destroyThread(code.getThread(0));
            }
        },
        state(comment) {
            return [comment.block, comment.board, comment.toJSON()];
        },
        log() {
            return [];
        },
        undo: 'createCommentBlock',
    };

    c[COMMAND_TYPES.showAllCommentBlock] = {
        do(board) {
            board.set({ isVisibleComment: true });
        },
        state(board) {
            return [board];
        },
        log() {
            return [];
        },
        undo: 'hideAllCommentBlock',
    };

    c[COMMAND_TYPES.hideAllCommentBlock] = {
        do(board) {
            board.set({ isVisibleComment: false });
        },
        state(board) {
            return [board];
        },
        log() {
            return [];
        },
        undo: 'showAllCommentBlock',
    };

    c[COMMAND_TYPES.moveComment] = {
        do(comment, x, y) {
            comment.moveTo(x, y);
        },
        state(comment) {
            return [comment, comment.x, comment.y];
        },
        log() {
            return [];
        },
        undo: 'moveComment',
    };

    c[COMMAND_TYPES.toggleCommentBlock] = {
        do(comment) {
            comment.set({
                isOpened: !comment.isOpened,
            });
        },
        state(comment) {
            return [comment];
        },
        log() {
            return [];
        },
        undo: 'toggleCommentBlock',
    };

    c[COMMAND_TYPES.cloneCommentBlock] = {
        do(schema, board) {
            const comment = new Entry.Comment(undefined, board, schema);
            board.code.createThread([comment], 0);
            board.set({ isVisibleComment: true });
        },
        state(comment) {
            return [comment];
        },
        log() {
            return [];
        },
        undo: 'uncloneCommentBlock',
    };

    c[COMMAND_TYPES.uncloneCommentBlock] = {
        do(comment) {
            comment.destroy();
        },
        state(comment) {
            return [comment, comment.board];
        },
        log() {
            return [];
        },
        undo: 'cloneCommentBlock',
    };

    c[COMMAND_TYPES.separateCommentBlock] = {
        do(object) {
            const comment = this.editor.board.findBlock(object);
            comment.separateFromBlock();
        },
        state(comment) {
            const data = comment instanceof Entry.Comment ? comment.toJSON() : comment;
            return [data, comment.block];
        },
        log() {
            return [];
        },
        undo: 'connectCommentBlock',
    };

    c[COMMAND_TYPES.connectCommentBlock] = {
        do(object, block) {
            const comment = this.editor.board.findBlock(object);
            comment.connectToBlock(block);
        },
        state(comment) {
            const data = comment instanceof Entry.Comment ? comment.toJSON() : comment;
            return [data];
        },
        log() {
            return [];
        },
        undo: 'separateCommentBlock',
    };
})(Entry.Command);
