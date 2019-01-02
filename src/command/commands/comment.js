'use strict';

(function(c) {
    const COMMAND_TYPES = Entry.STATIC.COMMAND_TYPES;

    c[COMMAND_TYPES.createComment] = {
        do(data, board, block) {
            const comment = new Entry.Comment(data, board, block);
            if (block) {
                block.connectComment(comment);
            } else {
                board.code.createThread([comment], 0);
            }
            board.set({ isVisibleComment: true });
        },
        state(data) {
            return [data];
        },
        log() {
            return [];
        },
        undo: 'removeComment',
    };

    c[COMMAND_TYPES.removeComment] = {
        do(target) {
            const comment = this.editor.board.findBlock(target);
            comment.destroy();
        },
        state(target) {
            const comment = this.editor.board.findBlock(target);
            return [comment.toJSON(), comment.board, comment.block];
        },
        log() {
            return [];
        },
        undo: 'createComment',
    };

    c[COMMAND_TYPES.showAllComment] = {
        do(board) {
            board.set({ isVisibleComment: true });
        },
        state(board) {
            return [board];
        },
        log() {
            return [];
        },
        undo: 'hideAllComment',
    };

    c[COMMAND_TYPES.hideAllComment] = {
        do(board) {
            board.set({ isVisibleComment: false });
        },
        state(board) {
            return [board];
        },
        log() {
            return [];
        },
        undo: 'showAllComment',
    };

    c[COMMAND_TYPES.moveComment] = {
        do(target, x, y) {
            const comment = this.editor.board.findBlock(target);
            if (x) {
                comment.moveTo(x, y);
            } else {
                comment.updatePos();
            }
        },
        state(target) {
            const comment = this.editor.board.findBlock(target);
            return [comment, comment.x, comment.y];
        },
        log() {
            return [];
        },
        undo: 'moveComment',
    };

    c[COMMAND_TYPES.toggleComment] = {
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
        undo: 'toggleComment',
    };

    c[COMMAND_TYPES.cloneComment] = {
        do(data, board) {
            const comment = new Entry.Comment(data, board);
            board.code.createThread([comment], 0);
            board.set({ isVisibleComment: true });
        },
        state(comment) {
            return [comment];
        },
        log() {
            return [];
        },
        undo: 'uncloneComment',
    };

    c[COMMAND_TYPES.uncloneComment] = {
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
        undo: 'cloneComment',
    };

    c[COMMAND_TYPES.separateComment] = {
        do(target) {
            const comment = this.editor.board.findBlock(target);
            comment.separateFromBlock();
        },
        state(target) {
            const comment = this.editor.board.findBlock(target);
            return [comment.toJSON(), comment.block];
        },
        log() {
            return [];
        },
        undo: 'connectComment',
    };

    c[COMMAND_TYPES.connectComment] = {
        do(target, block) {
            const comment = this.editor.board.findBlock(target);
            comment.connectToBlock(block);
        },
        state(target) {
            const comment = this.editor.board.findBlock(target);
            return [comment.toJSON()];
        },
        log() {
            return [];
        },
        undo: 'separateComment',
    };

    c[COMMAND_TYPES.writeComment] = {
        do(target, value) {
            const comment = this.editor.board.findBlock(target);
            comment.writeComment(value);
        },
        state(target) {
            const comment = this.editor.board.findBlock(target);
            const json = comment.toJSON();
            return [json, json.value];
        },
        log() {
            return [];
        },
        undo: 'writeComment',
    };
})(Entry.Command);
