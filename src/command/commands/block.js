/*
 *
 */
"use strict";

goog.require("Entry.Command");
goog.require("Entry.STATIC");

(function(c) {
    var COMMAND_TYPES = Entry.STATIC.COMMAND_TYPES;

    c[COMMAND_TYPES.addThread] = {
        do: function(thread) {
            return this.editor.board.code.createThread(thread);
        },
        state: function(thread) {
            if (thread.length)
                thread[0].id = Entry.Utils.generateId();
            return [thread];
        },
        log: function(thread) {
            var lastThread = this.editor.board.code.getThreads().pop();
            return [
                ['thread', lastThread.toJSON()]
            ];
        },
        undo: "destroyThread",
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        validate: false,
        dom: ['playground', 'blockMenu', '&0']
    };

    c[COMMAND_TYPES.destroyThread] = {
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
            return [
                ['block', thread[0].pointer ?  thread[0].pointer() : thread[0]]
            ];
        },
        undo: "addThread"
    };

    c[COMMAND_TYPES.destroyBlock] = {
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
                ['block', block.pointer ? block.pointer() : block]
            ];
        },
        undo: "recoverBlock"
    };

    c[COMMAND_TYPES.recoverBlock] = {
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
            block = this.editor.board.findById(block.id);
            return [
                ['block', block.pointer()],
                ['pointer', pointer]
            ];
        },
        undo: "destroyBlock"
    };

    c[COMMAND_TYPES.insertBlock] = {
        type: Entry.STATIC.COMMAND_TYPES.insertBlock,
        do: function(block, targetBlock, count) {
            if (typeof block === "string")
                block = this.editor.board.findById(block);
            this.editor.board.insert(block, targetBlock, count);
        },
        state: function(block, targetBlock) {
            if (typeof block === "string")
                block = this.editor.board.findById(block);
            var data = [
                block
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

            result = [
                ['block', block ? block.pointer() : ""],
                ['targetPointer', block.targetPointer()]
            ];
            if (count)
                result.push(['count', count ? count : null])
            return result;
        },
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        undo: "insertBlock",
        restrict: function(data, domQuery, callback) {
            callback();
            return new Entry.Tooltip([{
                content: "여기 밑에 끼워넣으셈",
                target: domQuery,
                direction: "right"
            }], {
                callBack: function() {
                }
            });
        },
        dom: ['playground', 'board', '&1']
    };

    c[COMMAND_TYPES.separateBlock] = {
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

            return [
                ['block', block.pointer()],
                ['x', block.x], ['y', block.y]
            ];
        },
        undo: "insertBlock"
    };

    c[COMMAND_TYPES.moveBlock] = {
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
                Entry.STATIC.COMMAND_TYPES.moveBlock,
                ['block', block.pointer()],
                ['x', block.x], ['y', block.y]
            ];
        },
        undo: "moveBlock"
    };

    c[COMMAND_TYPES.cloneBlock] = {
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
            var lastThread = this.editor.board.code.getThreads().pop();
            return [
                ['block', block.pointer()],
                ['thread', lastThread.stringify()]
            ];
        },
        undo: "uncloneBlock"
    };

    c[COMMAND_TYPES.uncloneBlock] = {
        do: function(block) {
            var threads = this.editor.board.code.getThreads();
            var lastBlock = threads.pop().getFirstBlock();
            this._tempStorage = lastBlock.id;
            lastBlock.destroy(true, true);
        },
        state: function(block) {
            return [block];
        },
        log: function(block) {
            var blockId = this._tempStorage;
            this._tempStorage = null;
            return [
                ['blockId', blockId]
            ];
        },
        undo: "cloneBlock"
    };

    c[COMMAND_TYPES.scrollBoard] = {
        do: function(dx, dy, isPass) {
            if (!isPass)
                this.editor.board.scroller._scroll(dx, dy);
            delete this.editor.board.scroller._diffs;
        },
        state: function(dx, dy) {
            return [-dx, -dy];
        },
        log: function(dx, dy) {
            return [
                ['dx', dx], ['dy', dy]
            ];
        },
        recordable: Entry.STATIC.RECORDABLE.SKIP,
        undo: "scrollBoard"
    };

    c[COMMAND_TYPES.setFieldValue] = {
        do: function(block, field, pointer, oldValue, newValue) { //TODO
            field.setValue(newValue, true);
        },
        state: function(block, field, pointer, oldValue, newValue) {
            return [block, field, pointer, newValue, oldValue];
        },
        log: function(block, field, pointer, oldValue, newValue) {
            return [
                ['pointer', pointer],
                ['newValue', newValue]
            ];
        },
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        dom: ['playground', 'board', '&0'],
        undo: "setFieldValue"
    };

    c[COMMAND_TYPES.selectBlockMenu] = {
        do: function(selector, doNotFold, doNotAlign) {
            var blockMenu = Entry.getMainWS().blockMenu;
            blockMenu.selectMenu(selector, doNotFold, doNotAlign);
            blockMenu.align();
        },
        state: function(selector, doNotFold, doNotAlign) {
            var blockMenu = Entry.getMainWS().blockMenu;
            return [blockMenu.lastSelector, doNotFold, doNotAlign];
        },
        log: function(selector, doNotFold, doNotAlign) {
            return [
                ['selector', selector]
            ];
        },
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        dom: ['playground', 'blockMenu', 'category', '&0'],
        undo: "selectBlockMenu"
    };

})(Entry.Command);
