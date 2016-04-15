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
            block.doInsert(targetBlock);
        },
        state: function(block, targetBlock) {
            var data = [
                block.id,
                {
                    x: block.x,
                    y: block.y
                }
            ];
            if (block.getBlockType() === "basic") {
                data.push(block.thread.getCount(block));
                if (block.getPrevBlock())
                    data.push(block.getPrevBlock().id);
            } else {
                if (!(block.getThread() instanceof Entry.Thread)) {
                    var parent = block.getThread();
                    data.push(parent._block.id);
                    data.push(parent._index);
                }
            }
            return data;
        },
        log: function(block) {
        },
        undo: function(blockId, prevPos, originBlock, count) {
            var block = Entry.playground.mainWorkspace.board.findById(blockId);
            if (block.getBlockType() === "basic") {
                var prevBlock = block.getPrevBlock();
                if (originBlock) {
                    originBlock = Entry.playground.mainWorkspace.board.findById(originBlock);
                    block.separate(count);
                    block.insert(originBlock);
                    block.view.bindPrev(originBlock);
                } else {
                    if (block.view)
                        block.view._toGlobalCoordinate();
                    block.separate(count);
                    block.moveTo(prevPos.x, prevPos.y);
                }
                if (prevBlock && prevBlock.getNextBlock())
                    prevBlock.getNextBlock().view.bindPrev();
            } else {
                if (originBlock) {
                    var param = block.view._contents[count];
                    block.separate();
                    block.doInsert(param);
                }
            }
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
        },
        log: function(block) {
        },
        undo: function(blockId) {
        }
    };

    c.moveBlock = {
        type: 104,
        do: function(block) {
        },
        state: function(block) {
        },
        log: function(block) {
        },
        undo: function(blockId) {
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
