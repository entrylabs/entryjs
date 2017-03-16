/*
 *
 */
"use strict";

goog.require("Entry.Command");
goog.require("Entry.STATIC");
goog.require("Entry.Utils");

(function(c) {
    var COMMAND_TYPES = Entry.STATIC.COMMAND_TYPES;
    var obj;

    c[COMMAND_TYPES.addThread] = {
        do: function(blocks, index) {
            return this.editor.board.code.createThread(blocks, index);
        },
        state: function(blocks, index) {
            if (index === undefined)
                index = this.editor.board.code.getThreadCount();
            return [index];
        },
        log: function(blocks, index) {
            if (blocks instanceof Entry.Thread)
                blocks = blocks.toJSON();
            return [
                ['blocks', blocks],
                ['index', index]
            ];
        },
        undo: "destroyThread",
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        validate: false,
        dom: ['playground', 'blockMenu', '&0']
    };

    obj = Entry.cloneSimpleObject(c[COMMAND_TYPES.addThread])
    obj.showMe = function(restrictor) {
        if (restrictor.isTooltipFaded())
            return;
        restrictor.fadeOutTooltip();
        var svgGroup = Entry.getDom(restrictor.processDomQuery(this.dom));
        var targetDom = Entry.getDom(restrictor.processDomQuery([
            'playground', 'board', '&1', 'magnet', 'next', 0
        ], restrictor.requestNextData().content));
        var targetRect = targetDom.getBoundingClientRect();

        Entry.Utils.glideBlock(
            svgGroup, targetRect.left, targetRect.top,
            function() {
                restrictor.fadeInTooltip();
            }
        )
    };
    obj.followCmd = true;
    c[COMMAND_TYPES.addThreadFromBlockMenu] = obj;

    c[COMMAND_TYPES.destroyThread] = {
        do: function(thread) {// thread can be index
            if (!(thread instanceof Entry.Thread))
                thread = this.editor.board.code.getThread(thread);
            var block = thread.getFirstBlock();
            block.destroy(true, true);
        },
        state: function(thread) {
            if (!(thread instanceof Entry.Thread))
                thread = this.editor.board.code.getThread(thread);
            var index = this.editor.board.code.getThreadIndex(thread);
            return [thread.toJSON(), index];
        },
        log: function(threadIndex) {
            if (threadIndex instanceof Entry.Thread)
                threadIndex =this.editor.board.code.getThreadIndex(threadIndex);

            return [
                ['index', threadIndex]
            ];
        },
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        validate: false,
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

            data.push(block.targetPointer());

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
        restrict: function(data, domQuery, callback, restrictor) {
            var isDone = false;
            var tooltip = new Entry.Tooltip([{
                title: data.tooltip.title,
                content: data.tooltip.content,
                target: domQuery
            }], {
                dimmed: true,
                restrict: true,
                callBack: function(isFromInit) {
                    if (isDone || !isFromInit)
                        return;
                    isDone = true;
                    callback();
                    tooltip.init([{
                        title: data.tooltip.title,
                        content: data.tooltip.content,
                        target: restrictor.processDomQuery([
                            'playground', 'board', '&1', 'magnet'
                        ])
                    }], {
                        indicator: true,
                        callBack: function() {
                        }
                    });
                }
            });
            return tooltip;
        },
        showMe: function(restrictor) {
            if (restrictor.isTooltipFaded())
                return;
            restrictor.fadeOutTooltip();
            var svgGroup = Entry.getDom(restrictor.processDomQuery(this.dom));
            var targetDom = Entry.getDom(restrictor.processDomQuery([
                'playground', 'board', '&1', 'magnet', 'next', 0
            ]));
            var targetRect = targetDom.getBoundingClientRect();

            Entry.Utils.glideBlock(
                svgGroup, targetRect.left, targetRect.top,
                function() {
                    restrictor.fadeInTooltip();
                }
            )
        },
        dom: ['playground', 'board', '&0']
    };

    obj = Entry.cloneSimpleObject(c[COMMAND_TYPES.insertBlock])
    obj.restrict = function(data, domQuery, callback) {
        callback();
        return new Entry.Tooltip([{
            title: data.tooltip.title,
            content: data.tooltip.content,
            target: domQuery
        }], {
            indicator: true,
            callBack: function() {
            }
        });
    }
    obj.dom = ['playground', 'board', '&1', 'magnet']
    c[COMMAND_TYPES.insertBlockFromBlockMenu] = obj;

    c[COMMAND_TYPES.separateBlock] = {
        do: function(block, dragMode, y) {
            block = this.editor.board.findBlock(block);
            if (typeof y === "number") {
                console.log(dragMode,y);
                block.view._moveTo(dragMode, y);
                dragMode = undefined;
            }

            dragMode =
                dragMode === undefined ?
                Entry.DRAG_MODE_DRAG :
                dragMode;

            if (block.view)
                block.view._toGlobalCoordinate(dragMode);
            block.doSeparate();
        },
        state: function(block) {
            block = this.editor.board.findBlock(block);
            var data = [
                block
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
            var blockPointer = block.pointer();
            if (block.view)
                block = block.view

            return [
                ['block', blockPointer],
                ['x', block.x], ['y', block.y]
            ];
        },
        validate: false,
        undo: "insertBlock",
        dom: ['playground', 'board', '&0']
    };

    obj = Entry.cloneSimpleObject(c[COMMAND_TYPES.separateBlock])
    obj.restrict = function(data, domQuery, callback, restrictor) {
        var isDone = false;
        var tooltip = new Entry.Tooltip([{
            title: data.tooltip.title,
            content: data.tooltip.content,
            target: domQuery
        }], {
            dimmed: true,
            restrict: true,
            callBack: function(isFromInit) {
                if (isDone || !isFromInit)
                    return;
                callback();
                isDone = true;
                tooltip.init([{
                    title: data.tooltip.title,
                    content: data.tooltip.content,
                    target: [
                        'playground', 'board', 'trashcan'
                    ]
                }], {
                    indicator: true,
                    callBack: function() {
                        callback();
                    }
                });
            }
        });
        return tooltip;
    };
    obj.showMe = function(restrictor) {
        if (restrictor.isTooltipFaded())
            return;
        restrictor.fadeOutTooltip();
        var svgGroup = Entry.getDom(restrictor.processDomQuery(this.dom));
        var targetDom = Entry.getDom([
            'playground', 'board', 'trashcan'
        ]);
        var targetRect = targetDom.getBoundingClientRect();

        Entry.Utils.glideBlock(
            svgGroup, targetRect.left, targetRect.top,
            function() {
                restrictor.fadeInTooltip();
            }
        )
    };
    obj.followCmd = true;
    c[COMMAND_TYPES.separateBlockForDestroy] = obj;

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
        restrict: function(data, domQuery, callback, restrictor) {
            var isDone = false;
            var tooltip = new Entry.Tooltip([{
                title: data.tooltip.title,
                content: data.tooltip.content,
                target: domQuery
            }], {
                dimmed: true,
                restrict: true,
                callBack: function(isFromInit) {
                    if (isDone || !isFromInit)
                        return;
                    isDone = true;
                    callback();
                    tooltip.init([{
                        title: data.tooltip.title,
                        content: data.tooltip.content,
                        target: restrictor.processDomQuery([
                            'playground', 'board', '&1', 'magnet'
                        ])
                    }], {
                        indicator: true,
                        callBack: function() {
                        }
                    });
                }
            });
            return tooltip;
        },
        validate: false,
        log: function(block, x, y) {
            block = this.editor.board.findBlock(block);
            return [
                ['block', block.pointer()],
                ['x', block.view.x], ['y', block.view.y]
            ];
        },
        undo: "moveBlock",
        dom: ['playground', 'board', '&0']
    };

    obj = Entry.cloneSimpleObject(c[COMMAND_TYPES.moveBlock])
    obj.followCmd = true;
    obj.restrict = function(data, domQuery, callback, restrictor) {
        var isDone = false;
        var tooltip = new Entry.Tooltip([{
            title: data.tooltip.title,
            content: data.tooltip.content,
            target: domQuery
        }], {
            dimmed: true,
            restrict: true,
            callBack: function(isFromInit) {
                if (isDone || !isFromInit)
                    return;
                isDone = true;
                callback();
                tooltip.init([{
                    title: data.tooltip.title,
                    content: data.tooltip.content,
                    target: [
                        'playground', 'board', 'trashcan'
                    ]
                }], {
                    indicator: true,
                    callBack: function() {
                        callback();
                    }
                });
            }
        });
        return tooltip;
    };
    c[COMMAND_TYPES.moveBlockForDestroy] = obj;

    obj = Entry.cloneSimpleObject(c[COMMAND_TYPES.moveBlock]);
    obj.restrict = function(data, domQuery, callback) {
        callback();
        return new Entry.Tooltip([{
            title: data.tooltip.title,
            content: data.tooltip.content,
            target: domQuery
        }], {
            indicator: true,
            callBack: function() {
            }
        });
    };
    obj.dom = ['playground', 'board', 'coord', '&1', '&2']
    c[COMMAND_TYPES.moveBlockFromBlockMenu] = obj;

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
