/*
 *
 */
"use strict";

goog.require("Entry.Command");

(function(c) {
    c.addThread = {
        type: 101,
        do: function(thread) {
            return this.editor.board.code.createThread(thread);
        },
        state: function(thread) {
            if (thread.length > 0)
                thread[0].id = Entry.Utils.generateId();
            return [thread];
        },
        log: function(block) {
            return [block.id, block.toJSON()];
        },
        undo: "destroyThread"
    };

    c.destroyThread = {
        type: 106,
        do: function(thread) {
            var blockId = thread[0].id;
            var block = this.editor.board.findById(blockId);
            block.destroy(true, true);
        },
        state: function(thread) {
            var blockId = thread[0].id;
            var block = this.editor.board.findById(blockId);
            return [block.toJSON()];
        },
        log: function(block) {
        },
        undo: "addThread"
    };

    c.destroyBlock = {
        type: 106,
        do: function(block) {
            if (typeof block === "string")
                block = this.editor.board.findById(block);
            block.doDestroy(true);
        },
        state: function(block) {
            if (typeof block === "string")
                block = this.editor.board.findById(block);
            return [block.toJSON(), block.pointer()];
        },
        log: function(block) {
        },
        undo: "recoverBlock"
    };

    c.recoverBlock = {
        type: 106,
        do: function(blockModel, pointer) {
            var block = this.editor.board.code.createThread([blockModel]).getFirstBlock();
            if (typeof block === "string")
                block = this.editor.board.findById(block);
            this.editor.board.insert(block, pointer);
        },
        state: function(block) {
            if (typeof block !== "string")
                block = block.id;
            return [block];
        },
        log: function(block) {
        },
        undo: "destroyBlock"
    };

    c.insertBlock = {
        type: 102,
        do: function(block, targetBlock, count) {
            if (typeof block === "string")
                block = this.editor.board.findById(block);
            this.editor.board.insert(block, targetBlock, count);
        },
        state: function(block, targetBlock) {
            if (typeof block === "string")
                block = this.editor.board.findById(block);
            var data = [
                block.id
            ];
            var pointer = block.targetPointer()
            data.push(pointer);

            if (typeof block !== "string" && block.getBlockType() === "basic")
                data.push(block.thread.getCount(block));
            return data;
        },
        log: function(block) {
        },
        undo: "insertBlock"
    };

    c.separateBlock = {
        type: 103,
        do: function(block) {
            if (block.view)
                block.view._toGlobalCoordinate(Entry.DRAG_MODE_DRAG);
            block.doSeparate();
        },
        state: function(block) {
            var data = [
                block.id
            ];
            var pointer = block.targetPointer()
            data.push(pointer);

            if (block.getBlockType() === "basic")
                data.push(block.thread.getCount(block));
            return data;
        },
        log: function(block) {
        },
        undo: "insertBlock"
    };

    c.moveBlock = {
        type: 104,
        do: function(block, x, y) {
            if (x !== undefined) { // do from undo stack
                block = this.editor.board.findById(block);
                block.moveTo(x, y);
            } else {
                block._updatePos();
            }
        },
        state: function(block) {
            if (typeof block === "string")
                block = this.editor.board.findById(block);
            return [
                block.id,
                block.x,
                block.y
            ];
        },
        log: function(block) {
            return [block.id, block.toJSON()];
        },
        undo: "moveBlock"
    };

    c.cloneBlock = {
        type: 105,
        do: function(block) {
            if (typeof block === "string")
                block = this.editor.board.findById(block);
            this.editor.board.code.createThread(block.copy());
        },
        state: function(block) {
            if (typeof block !== "string")
                block = block.id;
            return [block];
        },
        log: function(block) {
            return [block.id, block.toJSON()];
        },
        undo: "uncloneBlock"
    };

    c.uncloneBlock = {
        type: 105,
        do: function(block) {
            var threads = this.editor.board.code.getThreads();
            var lastBlock = threads.pop().getFirstBlock();
            lastBlock.destroy(true, true);
        },
        state: function(block) {
            return [block];
        },
        log: function(block) {
            return [block.id, block.toJSON()];
        },
        undo: "cloneBlock"
    };

    c.scrollBoard = {
        type: 105,
        do: function(dx, dy) {
            this.editor.board.scroller._scroll(dx, dy);
        },
        state: function(dx, dy) {
            return [-dx, -dy];
        },
        log: function(block) {
            return [block.id, block.toJSON()];
        },
        undo: "scrollBoard"
    };

})(Entry.Command);
