'use strict';

(function(c) {
    const COMMAND_TYPES = Entry.STATIC.COMMAND_TYPES;

    c[COMMAND_TYPES.createCommentBlock] = {
        do(schema, block, board) {
            const comment = new Entry.Comment(block, board, schema);
            if (block) {
                block.connectComment(comment);
            } else {
                board.code.createThread([comment], 0);
            }
            board.set({ isVisibleComment: true });
        },
        state(schema) {
            return [schema];
        },
        log() {
            return [];
        },
        undo: 'removeCommentBlock',
    };

    c[COMMAND_TYPES.removeCommentBlock] = {
        do(target) {
            const comment = this.editor.board.findBlock(target);
            comment.destroy();
        },
        state(target) {
            const comment = this.editor.board.findBlock(target);
            return [comment.toJSON(), comment.block, comment.board];
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
        do(target, x, y) {
            const comment = this.editor.board.findBlock(target);
            if (x) {
                comment.moveTo(x, y);
            }
            comment.updatePos();
        },
        state(target) {
            const comment = this.editor.board.findBlock(target);
            return [comment, comment.originX, comment.originY];
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
        do(target) {
            const comment = this.editor.board.findBlock(target);
            comment.destroy();
        },
        state(target) {
            const comment = this.editor.board.findBlock(target);
            return [target, comment.board];
        },
        log() {
            return [];
        },
        undo: 'cloneCommentBlock',
    };

    c[COMMAND_TYPES.separateCommentBlock] = {
        do(target) {
            const comment = this.editor.board.findBlock(target);
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
        do(target, block) {
            const comment = this.editor.board.findBlock(target);
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
