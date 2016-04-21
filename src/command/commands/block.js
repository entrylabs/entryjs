/*
 *
 */
"use strict";

goog.require("Entry.Command");

(function(c) {
    c.addBlock = {
        type: 101,
        do: function(block) {
            block.doAdd();
        },
        state: function(block) {
            return [block.id];
        },
        log: function(block) {
            return [block.id, block.toJSON()];
        },
        undo: function(blockId) {
            Entry.playground.mainWorkspace.board.findById(blockId).destroy();
        }
    };

    c.insertBlock = {
        type: 102,
        do: function(block, targetBlock) {
            var board = Entry.commander.editor.board;
            board.insert(block, targetBlock);
        },
        state: function(block, targetBlock) {
            var data = [
                block.id
            ];
            var pointer = block.pointer()
            data.push(pointer);

            if (block.getBlockType() === "basic")
                data.push(block.thread.getCount(block));
            return data;
        },
        log: function(block) {
        },
        undo: function(blockId, pointer, count) {
            var block = Entry.playground.mainWorkspace.board.findById(blockId);
            var board = Entry.commander.editor.board;
            board.insert(block, pointer, count);
        }
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
            var pointer = block.pointer()
            data.push(pointer);

            if (block.getBlockType() === "basic")
                data.push(block.thread.getCount(block));
            return data;
        },
        log: function(block) {
        },
        undo: function(blockId, pointer, count) {
            var block = Entry.playground.mainWorkspace.board.findById(blockId);
            var board = Entry.commander.editor.board;
            board.insert(block, pointer, count);
        }
    };

    c.moveBlock = {
        type: 104,
        do: function(block) {
            block.doMove();
        },
        state: function(block) {
            return [block.id, block.x, block.y];
        },
        log: function(block) {
            return [block.id, block.toJSON()];
        },
        undo: function(blockId, x, y) {
            Entry.playground.mainWorkspace.board
                .findById(blockId)
                .moveTo(x, y);
        }
    };

    c.cloneBlock = {
        type: 105,
        do: function(block) {
        },
        state: function(block) {
        },
        log: function(block) {
        },
        undo: function(blockId) {
        }
    };

    c.removeBlock = {
        type: 106,
        do: function(block) {
        },
        state: function(block) {
        },
        log: function(block) {
        },
        undo: function(blockId) {
        }
    };
})(Entry.Command);
