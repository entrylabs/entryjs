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
            if (thread.length)
                thread[0].id = Entry.Utils.generateId();
            return [thread];
        },
        log: function(thread) {
            return [
                c.addThread.type,
                ['thread', JSON.stringify(thread)],
                ['code', this.editor.board.code.stringify()]
            ];
        },
        undo: "destroyThread"
    };

    c.destroyThread = {
        type: 102,
        do: function(thread) {
            var blockId = thread[0].id;
            var block = this.editor.board.findById(blockId);
            block.destroy(true, true);
        },
        state: function(thread) {
            var blockId = thread[0].id;
            var block = this.editor.board.findById(blockId);
            return [block.thread.toJSON()];
        },
        log: function(thread) {
            var blockId = thread[0].id;
            var block = this.editor.board.findById(blockId);
            return [
                c.destroyThread.type,
                ['blockId', blockId],
                ['code', this.editor.board.code.stringify()]
            ];
        },
        undo: "addThread"
    };

    c.destroyBlock = {
        type: 103,
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
            if (typeof block === "string")
                block = this.editor.board.findById(block);
            return [
                c.destroyBlock.type,
                ['blockId', block.id],
                ['code', this.editor.board.code.stringify()]
            ];
        },
        undo: "recoverBlock"
    };

    c.recoverBlock = {
        type: 104,
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
        log: function(block, pointer) {
            return [
                c.recoverBlock.type,
                ['block', block.stringify()],
                ['pointer', pointer],
                ['code', this.editor.board.code.stringify()]
            ];
        },
        undo: "destroyBlock"
    };

    c.insertBlock = {
        type: 105,
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
        log: function(block, targetBlock, count) {
            if (typeof block === "string")
                block = this.editor.board.findById(block);
            return [
                c.insertBlock.type,
                ['blockId', block.id],
                ['targetBlockId', targetBlock.id],
                ['count', count],
                ['code', this.editor.board.code.stringify()]
            ];
        },
        undo: "insertBlock"
    };

    c.separateBlock = {
        type: 106,
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
            if (typeof block === "string")
                block = this.editor.board.findById(block);
            var thread = block.getThread();
            var index = thread.indexOf(block);

            return [
                c.separateBlock.type,
                ['blockId', block.id],
                ['targetPointer', block.targetPointer()],
                ['code', this.editor.board.code.stringify()]
            ];
        },
        undo: "insertBlock"
    };

    c.moveBlock = {
        type: 107,
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
        log: function(block, x, y) {
            return [
                c.moveBlock.type,
                ['blockId', block.id],
                ['x', block.x], ['y', block.y],
                ['code', this.editor.board.code.stringify()]
            ];
        },
        undo: "moveBlock"
    };

    c.cloneBlock = {
        type: 108,
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
            if (typeof block === "string")
                block = this.editor.board.findById(block);
            var threads = this.editor.board.code.getThreads();
            var lastBlock = threads.pop().getFirstBlock();
            return [
                c.cloneBlock.type,
                ['blockId', block.id],
                ['clonedBlockId', lastBlock.id],
                ['code', this.editor.board.code.stringify()]
            ];
        },
        undo: "uncloneBlock"
    };

    c.uncloneBlock = {
        type: 109,
        do: function(block) {
            var threads = this.editor.board.code.getThreads();
            var lastBlock = threads.pop().getFirstBlock();
            lastBlock.destroy(true, true);
        },
        state: function(block) {
            return [block];
        },
        log: function(block) {
            return [
                c.unclondeBlock.type,
                ['blockId', block.id],
                ['code', this.editor.board.code.stringify()]
            ];
        },
        undo: "cloneBlock"
    };

    c.scrollBoard = {
        type: 110,
        do: function(dx, dy) {
            this.editor.board.scroller._scroll(dx, dy);
        },
        state: function(dx, dy) {
            return [-dx, -dy];
        },
        log: function(dx, dy) {
            return;
            //return [
                //c.scrollBoard.type,
                //['dx', dx], ['dy', dy]
            //];
        },
        undo: "scrollBoard"
    };

    c.setFieldValue = {
        type: 111,
        do: function(block, field, pointer, oldValue, newValue) {
            field.setValue(newValue, true);
        },
        state: function(block, field, pointer, oldValue, newValue) {
            return [block, field, pointer, newValue, oldValue];
        },
        log: function(block, field, pointer, oldValue, newValue) {
            return [
                c.setFieldValue.type,
                ['pointer', pointer],
                ['newValue', newValue],
                ['code', this.editor.board.code.stringify()]
            ];
        },
        undo: "setFieldValue"
    };

})(Entry.Command);
