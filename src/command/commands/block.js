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
            if (thread.length) {
                var block = thread[0];
                if (this.editor.board.findBlock(block.id))
                    block.id = Entry.Utils.generateId();
            }
            return [thread];
        },
        log: function(thread) {
            if (thread instanceof Entry.Thread)
                thread = thread.toJSON();
            return [
                ['thread', thread]
            ];
        },
        undo: "destroyThread",
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        validate: false,
        dom: ['playground', 'blockMenu', '&0']
    };

    c[COMMAND_TYPES.destroyThread] = {
        do: function(thread) {
            var block;
            if (thread instanceof Entry.Thread)
                block = thread.getFirstBlock();
            else
                block = this.editor.board.findBlock(thread[0].id);
            block.destroy(true, true);
        },
        state: function(thread) {
            if (!(thread instanceof Entry.Thread))
                thread = this.editor.board.findBlock(thread[0].id).thread;
            return [thread.toJSON()];
        },
        log: function(thread, callerName) {
            var block;
            if (thread instanceof Entry.Thread) {
                block = thread.getFirstBlock();
            } else block = thread[0];

            return [
                ['block', block.pointer ?  block.pointer() : block],
                ['thread', thread.toJSON ? thread.toJSON() : thread],
                ['callerName', callerName]
            ];
        },
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        validate: false,
        restrict: function(data, domQuery, callback) {
            callback();
        },
        dom: ['playground', 'board', '&0'],
        undo: "addThread"
    };

    c[COMMAND_TYPES.destroyBlock] = {
        do: function(block) {
            block = this.editor.board.findBlock(block);
            block.doDestroy(true);
        },
        state: function(block) {
            block = this.editor.board.findBlock(block);
            return [block.toJSON(), block.pointer()];
        },
        log: function(block) {
            block = this.editor.board.findBlock(block);
            return [
                ['block', block.pointer ? block.pointer() : block]
            ];
        },
        undo: "recoverBlock"
    };

    c[COMMAND_TYPES.recoverBlock] = {
        do: function(blockModel, pointer) {
            var block = this.editor.board.code.createThread([blockModel]).getFirstBlock();
            this.editor.board.insert(block, pointer);
        },
        state: function(block) {
            if (typeof block !== "string")
                block = block.id;
            return [block];
        },
        log: function(block, pointer) {
            block = this.editor.board.findBlock(block.id);
            return [
                ['block', block],
                ['pointer', pointer]
            ];
        },
        undo: "destroyBlock"
    };

    c[COMMAND_TYPES.insertBlock] = {
        do: function(block, targetBlock, count) {
            block = this.editor.board.findBlock(block);
            this.editor.board.insert(block, targetBlock, count);
        },
        state: function(block, targetBlock) {
            block = this.editor.board.findBlock(block);
            var data = [ block ];

            var pointer = block.targetPointer();
            data.push(pointer);

            if (typeof block !== "string" && block.getBlockType() === "basic")
                data.push(block.thread.getCount(block));
            return data;
        },
        log: function(block, targetBlock, count) {
            block = this.editor.board.findBlock(block);
            if (!(targetBlock instanceof Array))
                targetBlock = targetBlock.pointer();

            var result = [
                ['block', block ? block.pointer() : ""],
                ['targetPointer', targetBlock]
            ];
            if (count)
                result.push(['count', count ? count : null]);
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
        do: function(block, dragMode) {
            dragMode =
                dragMode === undefined ?
                Entry.DRAG_MODE_DRAG :
                dragMode;

            if (block.view)
                block.view._toGlobalCoordinate(dragMode);
            block.doSeparate();
        },
        state: function(block) {
            var data = [
                block.id
            ];
            var pointer = block.targetPointer();
            data.push(pointer);

            if (block.getBlockType() === "basic")
                data.push(block.thread.getCount(block));
            return data;
        },
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        log: function(block) {
            block = this.editor.board.findBlock(block);

            return [
                ['block', block.pointer()],
                ['x', block.x], ['y', block.y]
            ];
        },
        validate: false,
        undo: "insertBlock",
        dom: ['playground', 'board', '&0']
    };

    c[COMMAND_TYPES.moveBlock] = {
        do: function(block, x, y) {
            if (x !== undefined) { // do from undo stack
                block = this.editor.board.findBlock(block);
                block.moveTo(x, y);
            } else {
                block._updatePos();
            }
        },
        state: function(block) {
            block = this.editor.board.findBlock(block);
            return [
                block,
                block.x,
                block.y
            ];
        },
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        log: function(block, x, y) {
            block = this.editor.board.findBlock(block);
            return [
                ['block', block.pointer()],
                ['x', block.x], ['y', block.y]
            ];
        },
        undo: "moveBlock"
    };

    c[COMMAND_TYPES.cloneBlock] = {
        do: c[COMMAND_TYPES.addThread].do,
        state: c[COMMAND_TYPES.addThread].state,
        log: c[COMMAND_TYPES.addThread].log,
        undo: "uncloneBlock"
    };

    c[COMMAND_TYPES.uncloneBlock] = {
        do: c[COMMAND_TYPES.destroyThread].do,
        state: c[COMMAND_TYPES.destroyThread].state,
        log: c[COMMAND_TYPES.destroyThread].log,
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
        skipUndoStack: true,
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        dom: ['playground', 'blockMenu', 'category', '&0'],
        undo: "selectBlockMenu"
    };

    c[COMMAND_TYPES.destroyThreads] = {
        do: function() {
            var threads =
                this.editor.board.code.getThreads()
                    .filter(function(t) {
                        return t.getFirstBlock().isDeletable();
                    })
                    .forEach(function(t) {
                        t.destroy();
                    });
        },
        state: function() {
            var threads =
                this.editor.board.code.getThreads()
                    .filter(function(t) {
                        return t.getFirstBlock().isDeletable();
                    })
                    .map(function(t) {
                        return t.toJSON();
                    });

            return [threads];
        },
        log: function() {
            return [];
        },
        undo: 'addThreads'
    };

    c[COMMAND_TYPES.addThreads] = {
        do: function(threads) {
            var code = this.editor.board.code;
            threads.forEach(function(t) {
                code.createThread(t);
            });
        },
        state: function() {
            return [];
        },
        log: function() {
            return [];
        },
        undo: 'destroyThreads'
    };

    c[COMMAND_TYPES.destroyBlockBelow] = {
        do: function(block) {
            block = this.editor.board.findBlock(block);
            block.doDestroyBelow(true);
        },
        state: function(block) {
            block = this.editor.board.findBlock(block);
            var thread = block.thread;
            var data;
            if (thread instanceof Entry.Thread) {
                data = thread.toJSON(false, block);
            } else data = [block.toJSON()];

            return [
                data,
                block.targetPointer()
            ];
        },
        log: function(block) {
            return [
            ];
        },
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        undo: "recoverBlockBelow"
    };

    c[COMMAND_TYPES.recoverBlockBelow] = {
        do: function(thread, targetPointer) {
            var board = this.editor.board;
            var thread = board.code.createThread(thread);
            board.insert(thread.getFirstBlock(), targetPointer);
        },
        state: function(thread, targetPointer) {
            return [
                thread[0]
            ];
        },
        log: function(thread, targetPointer) {
            return [];
        },
        undo: "destroyBlockBelow"
    };

})(Entry.Command);
