/*
 *
 */
'use strict';

(function(c) {
    const COMMAND_TYPES = Entry.STATIC.COMMAND_TYPES;
    let obj;

    c[COMMAND_TYPES.addThread] = {
        do(blocks, index) {
            return this.editor.board.code.createThread(blocks, index);
        },
        state(blocks, index) {
            if (index === undefined || index === null) {
                index = this.editor.board.code.getThreadCount();
            }
            return [index];
        },
        log(blocks, index) {
            if (blocks instanceof Entry.Thread) {
                blocks = blocks.toJSON();
            }
            return [['blocks', blocks], ['index', index]];
        },
        undo: 'destroyThread',
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        validate: false,
        dom: ['playground', 'blockMenu', '&0'],
    };

    obj = _.clone(c[COMMAND_TYPES.addThread]);
    obj.showMe = function(restrictor) {
        if (restrictor.isTooltipFaded()) {
            return;
        }
        restrictor.fadeOutTooltip();
        const svgGroup = Entry.getDom(restrictor.processDomQuery(this.dom));
        const nextCmd = restrictor.requestNextData().content;
        const cmdType = nextCmd[0];
        let targetDomQuery;
        if (cmdType === COMMAND_TYPES.moveBlockFromBlockMenu) {
            targetDomQuery = ['playground', 'board', 'coord', '&1', '&2'];
        } else {
            targetDomQuery = ['playground', 'board', '&1', 'magnet', 'next', 0];
        }

        const targetDom = Entry.getDom(restrictor.processDomQuery(targetDomQuery, nextCmd));
        const { left, top } = targetDom.getBoundingClientRect();

        Entry.Utils.glideBlock(svgGroup, left, top, () => {
            restrictor.fadeInTooltip();
        });
    };
    obj.followCmd = true;
    obj.restrict = function(data, domQuery, callback, restrictor) {
        const nextCmd = restrictor.requestNextData().content;
        if (nextCmd[0] === Entry.STATIC.COMMAND_TYPES.insertBlockFromBlockMenu) {
            Entry.Command.editor.board.scrollToPointer(nextCmd[2][1]);
        }

        const isDone = false;
        const tooltip = new Entry.Tooltip(
            [
                {
                    title: data.tooltip.title,
                    content: data.tooltip.content,
                    target: domQuery,
                },
            ],
            {
                dimmed: true,
                restrict: true,
                callBack: callback,
            }
        );
        return tooltip;
    };
    c[COMMAND_TYPES.addThreadFromBlockMenu] = obj;

    c[COMMAND_TYPES.destroyThread] = {
        do(thread) {
            // thread can be index
            if (!(thread instanceof Entry.Thread)) {
                thread = this.editor.board.code.getThread(thread);
            }
            if (thread) {
                const block = thread.getFirstBlock();
                block.destroy(true, true);
            }
        },
        state(thread) {
            if (!(thread instanceof Entry.Thread)) {
                thread = this.editor.board.code.getThread(thread);
            }
            const index = this.editor.board.code.getThreadIndex(thread);
            const json = thread ? thread.toJSON() : {};
            return [json, index];
        },
        log(threadIndex) {
            if (threadIndex instanceof Entry.Thread) {
                threadIndex = this.editor.board.code.getThreadIndex(threadIndex);
            }

            return [['index', threadIndex]];
        },
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        restrict(data, domQuery, callback) {
            callback();
        },
        validate: false,
        undo: 'addThread',
    };

    c[COMMAND_TYPES.destroyBlock] = {
        do(block) {
            block = this.editor.board.findBlock(block);
            block.doDestroy();
        },
        state(block) {
            let isThread = false;
            block = this.editor.board.findBlock(block);
            const pointer = block.targetPointer();
            const blockJSON = block.toJSON();
            if (pointer.length === 3) {
                // 첫번째 블록 삭제
                if (block.thread.getCount() === 1) {
                    // 단일 블록 쓰레드 삭제
                    isThread = true;
                } else {
                    pointer.push(-1);
                } // targetPointer 결과값 보정
            }
            if (block.getBlockType() === 'output') {
                blockJSON.params[1] = undefined;
            }
            return [blockJSON, pointer, isThread];
        },
        log(block) {
            block = this.editor.board.findBlock(block);
            return [['block', block.pointer ? block.pointer() : block]];
        },
        undo: 'recoverBlock',
    };

    c[COMMAND_TYPES.recoverBlock] = {
        do(blockModel, pointer, isThread) {
            if (isThread) {
                return this.editor.board.code.createThread([blockModel], pointer[2]);
            } else {
                const block = this.editor.board.code.createThread([blockModel]).getFirstBlock();
                this.editor.board.insert(block, pointer);
            }
        },
        state(block) {
            if (typeof block !== 'string') {
                block = block.id;
            }
            return [block];
        },
        log(block, pointer) {
            block = this.editor.board.findBlock(block.id);
            return [['block', block], ['pointer', pointer]];
        },
        undo: 'destroyBlock',
    };

    c[COMMAND_TYPES.insertBlock] = {
        do(block, targetBlock, count) {
            block = this.editor.board.findBlock(block);
            let blockArgument;
            if (block instanceof Entry.FieldBlock) {
                blockArgument = block.value;
            } else {
                blockArgument = block;
            }
            this.editor.board.insert(blockArgument, targetBlock, count);
        },
        state(block, targetBlock, count) {
            block = this.editor.board.findBlock(block);
            const data = [block, block.targetPointer()];

            if (typeof block !== 'string' && block.getBlockType() === 'basic') {
                data.push(block.thread.getCount(block));
            } else if (typeof block !== 'string' && block.getBlockType() === 'output') {
                data.push(count || block.getOutputBlockCount() + 1);
            }
            return data;
        },
        log(block, targetBlock, count) {
            block = this.editor.board.findBlock(block);
            if (!(targetBlock instanceof Array)) {
                targetBlock = targetBlock.pointer();
            }

            const result = [
                ['block', block ? block.pointer() : ''],
                ['targetPointer', targetBlock],
            ];
            if (count) {
                result.push(['count', count ? count : null]);
            }
            return result;
        },
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        undo: 'insertBlock',
        restrict(data, domQuery, callback, restrictor) {
            const board = Entry.Command.editor.board;
            const block = board.code.getByPointer(data.content[1][1]);
            let blockView;
            board.scrollToPointer(data.content[1][1]);

            if (restrictor.toolTipRender) {
                restrictor.toolTipRender.titleIndex = 0;
                restrictor.toolTipRender.contentIndex = 0;
            }
            const isDefault = data.tooltip.isDefault;
            let isDone = false;
            const tooltip = new Entry.Tooltip(
                [
                    {
                        title: data.tooltip.title,
                        content: data.tooltip.content,
                        target: domQuery,
                    },
                ],
                {
                    dimmed: true,
                    restrict: true,
                    callBack(isFromInit) {
                        if (isDone || !isFromInit) {
                            return;
                        }
                        isDone = true;
                        callback();

                        const ret = board.scrollToPointer(data.content[2][1]);
                        if (block) {
                            blockView = block.view;
                        }
                        if (blockView) {
                            blockView = blockView.getSvgRoot().blockView;
                            if (blockView && ret) {
                                blockView.moveBy(-ret[0], -ret[1]);
                            }
                        }

                        restrictor.toolTipRender.titleIndex = 1;

                        if (restrictor.toolTipRender) {
                            if (!isDefault) {
                                restrictor.toolTipRender.contentIndex = 1;
                            } else {
                                const target = Entry.Command.editor.board.code.getTargetByPointer(
                                    data.content[2][1]
                                );

                                if (target && target.isParamBlockType()) {
                                    restrictor.toolTipRender.contentIndex = 2;
                                } else {
                                    restrictor.toolTipRender.contentIndex = 1;
                                }
                            }
                        }

                        const processedDomQuery = restrictor.processDomQuery([
                            'playground',
                            'board',
                            '&1',
                            'magnet',
                        ]);

                        tooltip.init(
                            [
                                {
                                    title: data.tooltip.title,
                                    content: data.tooltip.content,
                                    target: processedDomQuery,
                                },
                            ],
                            {
                                indicator: true,
                                callBack() {},
                            }
                        );
                    },
                }
            );
            return tooltip;
        },
        showMe(restrictor) {
            if (restrictor.isTooltipFaded()) {
                return;
            }
            restrictor.fadeOutTooltip();
            const svgGroup = Entry.getDom(restrictor.processDomQuery(this.dom));
            const targetDom = Entry.getDom(
                restrictor.processDomQuery(['playground', 'board', '&1', 'magnet', 'next', 0])
            );
            const targetRect = targetDom.getBoundingClientRect();

            Entry.Utils.glideBlock(svgGroup, targetRect.left, targetRect.top, () => {
                restrictor.fadeInTooltip();
            });
        },
        dom: ['playground', 'board', '&0'],
    };

    obj = _.clone(c[COMMAND_TYPES.insertBlock]);
    obj.followCmd = true;
    c[COMMAND_TYPES.insertBlockFollowSeparate] = obj;

    obj = _.clone(c[COMMAND_TYPES.insertBlock]);
    obj.restrict = function(data, domQuery, callback, restrictor) {
        if (restrictor.toolTipRender) {
            if (restrictor.toolTipRender) {
                const target = Entry.Command.editor.board.code.getByPointer(data.content[2][1]);

                if (!target || target.isParamBlockType()) {
                    restrictor.toolTipRender.contentIndex = 1;
                } else {
                    restrictor.toolTipRender.contentIndex = 0;
                }
            }
        }
        callback();
        return new Entry.Tooltip(
            [
                {
                    title: data.tooltip.title,
                    content: data.tooltip.content,
                    target: domQuery,
                },
            ],
            {
                indicator: true,
                callBack() {},
            }
        );
    };
    obj.dom = ['playground', 'board', '&1', 'magnet'];
    c[COMMAND_TYPES.insertBlockFromBlockMenu] = obj;

    obj = _.clone(c[COMMAND_TYPES.insertBlockFromBlockMenu]);
    obj.followCmd = true;
    c[COMMAND_TYPES.insertBlockFromBlockMenuFollowSeparate] = obj;

    c[COMMAND_TYPES.separateBlock] = {
        do(block, dragMode, y) {
            block = this.editor.board.findBlock(block);
            let blockView;
            let blockArgument;
            if (block instanceof Entry.FieldBlock) {
                blockView = block.value.view;
                blockArgument = block.value;
            } else {
                blockView = block.view;
            }
            if (typeof y === 'number') {
                blockView.moveTo(dragMode, y);
                dragMode = undefined;
            }

            dragMode = dragMode === undefined ? Entry.DRAG_MODE_DRAG : dragMode;

            if (blockView) {
                blockView._toGlobalCoordinate(dragMode);
            }
            block.doSeparate(blockArgument);
        },
        state(block) {
            block = this.editor.board.findBlock(block);
            let blockArgument;
            if (block instanceof Entry.FieldBlock) {
                blockArgument = block.value;
            } else {
                blockArgument = block;
            }
            const data = [blockArgument];
            const pointer = block.targetPointer();
            data.push(pointer);

            if (block.getBlockType() === 'basic') {
                data.push(block.thread.getCount(block));
            }
            return data;
        },
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        log(block) {
            block = this.editor.board.findBlock(block);
            const blockPointer = block.pointer();
            if (block.view) {
                block = block.view;
            }

            return [['block', blockPointer], ['x', block.x], ['y', block.y]];
        },
        restrict(data, domQuery, callback, restrictor) {
            Entry.Command.editor.board.scrollToPointer(data.content[1][1]);
            let isDone = false;
            if (restrictor.toolTipRender) {
                restrictor.toolTipRender.titleIndex = 0;
                restrictor.toolTipRender.contentIndex = 0;
            }
            const tooltip = new Entry.Tooltip(
                [
                    {
                        title: data.tooltip.title,
                        content: data.tooltip.content,
                        target: domQuery,
                    },
                ],
                {
                    dimmed: true,
                    restrict: true,
                    callBack(isFromInit) {
                        if (isDone || !isFromInit) {
                            return;
                        }
                        if (restrictor.toolTipRender) {
                            restrictor.toolTipRender.titleIndex = 1;
                            restrictor.toolTipRender.contentIndex = 1;
                        }
                        callback();
                        isDone = true;
                        tooltip.init(
                            [
                                {
                                    title: data.tooltip.title,
                                    content: data.tooltip.content,
                                    target: restrictor.processDomQuery([
                                        'playground',
                                        'board',
                                        'coord',
                                        '&1',
                                        '&2',
                                    ]),
                                },
                            ],
                            {
                                indicator: true,
                                callBack() {
                                    callback();
                                },
                            }
                        );
                    },
                }
            );
            return tooltip;
        },
        undo: 'insertBlock',
        dom: ['playground', 'board', '&0'],
    };

    obj = _.clone(c[COMMAND_TYPES.separateBlock]);
    obj.restrict = function(data, domQuery, callback, restrictor) {
        Entry.Command.editor.board.scrollToPointer(data.content[1][1]);
        let isDone = false;
        if (restrictor.toolTipRender) {
            restrictor.toolTipRender.titleIndex = 0;
            restrictor.toolTipRender.contentIndex = 0;
        }
        const tooltip = new Entry.Tooltip(
            [
                {
                    title: data.tooltip.title,
                    content: data.tooltip.content,
                    target: domQuery,
                },
            ],
            {
                dimmed: true,
                restrict: true,
                callBack(isFromInit) {
                    if (isDone || !isFromInit) {
                        return;
                    }
                    callback();
                    if (restrictor.toolTipRender) {
                        restrictor.toolTipRender.titleIndex = 1;
                        restrictor.toolTipRender.contentIndex = 1;
                    }
                    isDone = true;
                    tooltip.init(
                        [
                            {
                                title: data.tooltip.title,
                                content: data.tooltip.content,
                                target: ['playground', 'board', 'trashcan'],
                            },
                        ],
                        {
                            indicator: true,
                            callBack() {
                                callback();
                            },
                        }
                    );
                },
            }
        );
        return tooltip;
    };
    obj.showMe = function(restrictor) {
        if (restrictor.isTooltipFaded()) {
            return;
        }
        restrictor.fadeOutTooltip();
        const svgGroup = Entry.getDom(restrictor.processDomQuery(this.dom));
        const targetDom = Entry.getDom(['playground', 'board', 'trashcan']);
        const targetRect = targetDom.getBoundingClientRect();

        Entry.Utils.glideBlock(svgGroup, targetRect.left, targetRect.top, () => {
            restrictor.fadeInTooltip();
        });
    };
    obj.followCmd = true;
    c[COMMAND_TYPES.separateBlockForDestroy] = obj;

    c[COMMAND_TYPES.moveBlock] = {
        do(block, x, y) {
            if (x !== undefined) {
                // do from undo stack
                block = this.editor.board.findBlock(block);
                block.moveTo(x, y);
            } else {
                block._updatePos();
            }
        },
        state(block) {
            block = this.editor.board.findBlock(block);
            return [block, block.x, block.y];
        },
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        restrict(data, domQuery, callback, restrictor) {
            let isDone = false;
            const tooltip = new Entry.Tooltip(
                [
                    {
                        title: data.tooltip.title,
                        content: data.tooltip.content,
                        target: domQuery,
                    },
                ],
                {
                    dimmed: true,
                    restrict: true,
                    callBack(isFromInit) {
                        if (isDone || !isFromInit) {
                            return;
                        }
                        isDone = true;
                        callback();
                        tooltip.init(
                            [
                                {
                                    title: data.tooltip.title,
                                    content: data.tooltip.content,
                                    target: restrictor.processDomQuery([
                                        'playground',
                                        'board',
                                        'coord',
                                        '&1',
                                        '&2',
                                    ]),
                                },
                            ],
                            {
                                indicator: true,
                                callBack() {},
                            }
                        );
                    },
                }
            );
            return tooltip;
        },
        validate: false,
        log(block, x, y) {
            block = this.editor.board.findBlock(block);
            return [['block', block.pointer()], ['x', block.view.x], ['y', block.view.y]];
        },
        undo: 'moveBlock',
        dom: ['playground', 'board', '&0'],
    };

    obj = _.clone(c[COMMAND_TYPES.moveBlock]);
    obj.followCmd = true;
    obj.restrict = function(data, domQuery, callback, restrictor) {
        Entry.Command.editor.board.scrollToPointer(data.content[1][1]);
        let isDone = false;
        if (restrictor.toolTipRender) {
            restrictor.toolTipRender.titleIndex = 0;
            restrictor.toolTipRender.contentIndex = 0;
        }
        const tooltip = new Entry.Tooltip(
            [
                {
                    title: data.tooltip.title,
                    content: data.tooltip.content,
                    target: domQuery,
                },
            ],
            {
                dimmed: true,
                restrict: true,
                callBack(isFromInit) {
                    if (isDone || !isFromInit) {
                        return;
                    }
                    isDone = true;
                    callback();
                    if (restrictor.toolTipRender) {
                        restrictor.toolTipRender.titleIndex = 1;
                        restrictor.toolTipRender.contentIndex = 1;
                    }
                    tooltip.init(
                        [
                            {
                                title: data.tooltip.title,
                                content: data.tooltip.content,
                                target: ['playground', 'board', 'trashcan'],
                            },
                        ],
                        {
                            indicator: true,
                            callBack() {
                                callback();
                            },
                        }
                    );
                },
            }
        );
        return tooltip;
    };
    c[COMMAND_TYPES.moveBlockForDestroy] = obj;

    obj = _.clone(c[COMMAND_TYPES.moveBlock]);
    obj.restrict = function(data, domQuery, callback) {
        callback();
        return new Entry.Tooltip(
            [
                {
                    title: data.tooltip.title,
                    content: data.tooltip.content,
                    target: domQuery,
                },
            ],
            {
                callBack() {},
            }
        );
    };
    obj.dom = ['playground', 'board', 'coord', '&1', '&2'];
    c[COMMAND_TYPES.moveBlockFromBlockMenu] = obj;

    cloneCommand(COMMAND_TYPES.cloneBlock, COMMAND_TYPES.addThread, [
        ['undo', 'uncloneBlock'],
        ['dom', undefined],
    ]);

    cloneCommand(COMMAND_TYPES.uncloneBlock, COMMAND_TYPES.destroyThread, [['undo', 'cloneBlock']]);

    c[COMMAND_TYPES.scrollBoard] = {
        do(dx, dy, isPass) {
            if (!isPass) {
                this.editor.board.scroller._scroll(dx, dy);
            }
            delete this.editor.board.scroller._diffs;
        },
        state(dx, dy) {
            return [-dx, -dy];
        },
        log(dx, dy) {
            return [['dx', dx], ['dy', dy]];
        },
        recordable: Entry.STATIC.RECORDABLE.SKIP,
        undo: 'scrollBoard',
    };

    c[COMMAND_TYPES.setFieldValue] = {
        do(pointer, value, code) {
            let field;
            if (code) {
                field = code.getByPointer(pointer);
            } else {
                field = this.editor.board.findBlock(pointer);
            }

            field.setValue(value, true);
            Entry.disposeEvent.notify(true);
            field._blockView.disableMouseEvent = false;
        },
        state(pointer, value, code) {
            let field;
            if (code) {
                field = code.getByPointer(pointer);
            } else {
                field = this.editor.board.findBlock(pointer);
            }
            return [pointer, field._startValue || field.getValue()];
        },
        log(pointer, value) {
            return [['pointer', pointer], ['value', value]];
        },
        restrict(data, domQuery, callback, restrictor) {
            let isDone = false;
            const isDefault = data.tooltip.isDefault;

            Entry.Command.editor.board.scrollToPointer(data.content[1][1]);

            const field = Entry.Command.editor.board.findBlock(data.content[1][1]);
            const blockView = field._blockView;
            blockView.disableMouseEvent = true;
            const fieldType = field.getFieldRawType();

            if (restrictor.toolTipRender) {
                if (!isDefault) {
                    restrictor.toolTipRender.contentIndex = 0;
                } else {
                    switch (fieldType) {
                        case 'textInput':
                            restrictor.toolTipRender.contentIndex = 0;
                            break;
                        case 'dropdown':
                        case 'dropdownDynamic':
                            restrictor.toolTipRender.contentIndex = 1;
                            break;
                        case 'keyboard':
                            restrictor.toolTipRender.contentIndex = 2;
                            break;
                    }
                }
            }

            const nextValue = data.content[2][1];
            if (field instanceof Entry.FieldTextInput) {
                field.fixNextValue(nextValue);
            }

            const tooltip = new Entry.Tooltip(
                [
                    {
                        title: data.tooltip.title,
                        content: data.tooltip.content,
                        direction: 'left',
                        target: domQuery,
                    },
                ],
                {
                    dimmed: true,
                    restrict: true,
                    callBack(isFromInit) {
                        if (isDone || !isFromInit) {
                            return;
                        }
                        isDone = true;
                        callback();
                        callback();
                        restrictor.toolTipRender.replaceContent(
                            /&value&/gi,
                            field.getTextValueByValue(nextValue)
                        );

                        if (restrictor.toolTipRender) {
                            const { renderData = {} } = restrictor.toolTipRender;
                            renderData.isPrev = false;
                            if (!isDefault) {
                                restrictor.toolTipRender.titleIndex = 1;
                                restrictor.toolTipRender.contentIndex = 1;
                            } else {
                                switch (fieldType) {
                                    case 'textInput':
                                        restrictor.toolTipRender.contentIndex = 3;
                                        break;
                                    case 'dropdown':
                                    case 'dropdownDynamic':
                                        restrictor.toolTipRender.contentIndex = 4;
                                        break;
                                    case 'keyboard':
                                        restrictor.toolTipRender.contentIndex = 5;
                                        break;
                                }
                            }
                        }

                        tooltip.init(
                            [
                                {
                                    title: data.tooltip.title,
                                    content: data.tooltip.content,
                                    target: restrictor.processDomQuery([
                                        'playground',
                                        'board',
                                        '&0',
                                        'option',
                                    ]),
                                },
                            ],
                            {
                                dimmed: true,
                                restrict: true,
                                callBack() {
                                    blockView.disableMouseEvent = false;
                                },
                            }
                        );
                    },
                }
            );
            return tooltip;
        },
        disableMouseUpDispose: true,
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        dom: ['playground', 'board', '&0'],
        undo: 'setFieldValue',
    };

    c[COMMAND_TYPES.selectBlockMenu] = {
        do(selector, doNotFold, doNotAlign) {
            const blockMenu = Entry.getMainWS().blockMenu;
            blockMenu.selectMenu(selector, doNotFold, doNotAlign);
            blockMenu.align();
        },
        state(selector, doNotFold, doNotAlign) {
            const blockMenu = Entry.getMainWS().blockMenu;
            return [blockMenu.lastSelector, doNotFold, doNotAlign];
        },
        log(selector, doNotFold, doNotAlign) {
            return [['selector', selector]];
        },
        skipUndoStack: true,
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        dom: ['playground', 'blockMenu', 'category', '&0'],
        undo: 'selectBlockMenu',
    };

    c[COMMAND_TYPES.destroyThreads] = {
        do() {
            const threads = this.editor.board.code
                .getThreads()
                .filter((t) => t.getFirstBlock().isDeletable())
                .forEach((t) => {
                    t.destroy();
                });
        },
        state() {
            const threads = this.editor.board.code
                .getThreads()
                .filter((t) => t.getFirstBlock().isDeletable())
                .map((t) => t.toJSON());

            return [threads];
        },
        log() {
            return [];
        },
        undo: 'addThreads',
    };

    c[COMMAND_TYPES.addThreads] = {
        do(threads) {
            const code = this.editor.board.code;
            threads.forEach((t) => {
                code.createThread(t);
            });
        },
        state() {
            return [];
        },
        log() {
            return [];
        },
        undo: 'destroyThreads',
    };

    c[COMMAND_TYPES.destroyBlockBelow] = {
        do(block) {
            block = this.editor.board.findBlock(block);
            block.doDestroyBelow(true);
        },
        state(block) {
            block = this.editor.board.findBlock(block);
            const thread = block.thread;
            let data;
            if (thread instanceof Entry.Thread) {
                data = thread.toJSON(false, block);
            } else {
                data = [block.toJSON()];
            }

            return [data, block.targetPointer()];
        },
        log(block) {
            return [];
        },
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        undo: 'recoverBlockBelow',
    };

    c[COMMAND_TYPES.recoverBlockBelow] = {
        do(thread, targetPointer) {
            const board = this.editor.board;
            var thread = board.code.createThread(thread);
            board.insert(thread.getFirstBlock(), targetPointer);
        },
        state(thread, targetPointer) {
            return [thread[0]];
        },
        log(thread, targetPointer) {
            return [];
        },
        undo: 'destroyBlockBelow',
    };

    cloneCommand(COMMAND_TYPES.separateBlockByCommand, COMMAND_TYPES.separateBlock);

    function cloneCommand(newType, oldType, props) {
        c[newType] = _.clone(c[oldType]);
        if (props && props instanceof Array) {
            props.forEach((prop) => {
                c[newType][prop[0]] = prop[1];
            });
        }
        return c[newType];
    }
})(Entry.Command);
