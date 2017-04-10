/*
 */
"use strict";

goog.provide("Entry.Board");

goog.require("Entry.Dom");
goog.require("Entry.Model");
goog.require("Entry.Utils");
goog.require("Entry.FieldBlock");
goog.require("Entry.Scroller");
goog.require("Entry.SVG");

/*
 *
 * @param {object} dom which to inject playground
 */
Entry.Board = function(option) {
    Entry.Model(this, false);
    this.readOnly = option.readOnly === undefined ? false : option.readOnly;
    this.changeEvent = new Entry.Event(this);

    this.createView(option);
    this.updateOffset();

    this.scroller = new Entry.Scroller(this, true, true);

    this._magnetMap = {};

    Entry.ANIMATION_DURATION = 200;
    Entry.BOARD_PADDING = 100;


    this._initContextOptions();
    Entry.Utils.disableContextmenu(this.svgDom);

    this._addControl();
    this._bindEvent();
};

Entry.Board.OPTION_PASTE = 0;
Entry.Board.OPTION_ALIGN = 1;
Entry.Board.OPTION_CLEAR = 2;
Entry.Board.OPTION_DOWNLOAD = 3;

Entry.Board.DRAG_RADIUS = 5;

(function(p) {
    p.schema = {
        code: null,
        dragBlock: null,
        magnetedBlockView: null,
        selectedBlockView: null
    };

    p.createView = function(option) {
        var dom = option.dom;
        if (typeof dom === "string")
            dom = $('#' + dom);
        else
            dom = $(dom);

        if (dom.prop("tagName") !== "DIV")
            return console.error("Dom is not div element");

        this.view = dom;
        this._svgId = 'play' + new Date().getTime();

        this.workspace = option.workspace;

        this._activatedBlockView = null;

        this.wrapper = Entry.Dom('div', {
            parent: dom,
            class: 'entryBoardWrapper'
        });

        this.svgDom = Entry.Dom(
            $('<svg id="' + this._svgId + '" class="entryBoard" width="100%" height="100%"' +
              'version="1.1" xmlns="http://www.w3.org/2000/svg"></svg>'),
            { parent: this.wrapper }
        );

        this.visible = true;
        var that = this;
        this.svg = Entry.SVG(this._svgId);
        $(window).scroll(function() {
            that.updateOffset();
        });

        this.svgGroup = this.svg.elem("g");

        this.svgThreadGroup = this.svgGroup.elem("g");
        this.svgThreadGroup.board = this;

        this.svgBlockGroup = this.svgGroup.elem("g");
        this.svgBlockGroup.board = this;

        if (option.isOverlay) {
            this.wrapper.addClass("entryOverlayBoard");
            this.generateButtons();
            this.suffix = 'overlayBoard';
        } else this.suffix = 'board';

        Entry.Utils.addFilters(this.svg, this.suffix);
        var returnVal = Entry.Utils.addBlockPattern(this.svg, this.suffix);
        this.pattern = returnVal.pattern;
    };

    p.changeCode = function(code, shouldNotCreateView, cb) {
        if (this.code && this.codeListener)
            this.code.changeEvent.detach(this.codeListener);

        this.set({code: code});

        var that = this;
        if (code && !shouldNotCreateView) {
            this.codeListener = this.code.changeEvent.attach(
                this, function() {that.changeEvent.notify();}
            );
            this.svgBlockGroup.remove();
            this.svgThreadGroup.remove();
            code.createView(this);
            if (code.isAllThreadsInOrigin())
                this.alignThreads();
            cb && cb();
        }
        this.scroller.resizeScrollBar();
    };

    p.bindCodeView = function(codeView) {
        this.svgBlockGroup.remove();
        this.svgThreadGroup.remove();
        this.svgBlockGroup = codeView.svgBlockGroup;
        this.svgThreadGroup = codeView.svgThreadGroup;
        this.svgGroup.appendChild(this.svgThreadGroup);
        this.svgGroup.appendChild(this.svgBlockGroup);
    };

    p.setMagnetedBlock = function(block, magnetType) {
        if (this.magnetedBlockView === block)
            return;

        this.magnetedBlockView && this.magnetedBlockView.set({magneting: false});
        this.set({magnetedBlockView: block});
        if (block) {
            block.set({magneting: magnetType});
            block.dominate();
        }
    };

    p.getCode = function() { return this.code; };

    p.findById = function(id) { return this.code.findById(id); };

    p._addControl = function() {
        var dom = this.svgDom;
        var that = this;
        dom.mousedown(function() {
            that.onMouseDown.apply(that, arguments);
        });
        dom.bind('touchstart', function() {
            that.onMouseDown.apply(that, arguments);
        });
        dom.on('wheel', function(){
            that.mouseWheel.apply(that, arguments);
        });

        var scroller = that.scroller;
        if (scroller) {
            dom.mouseenter(function(e) {scroller.setOpacity(1);});
            dom.mouseleave(function(e) {scroller.setOpacity(0);});
        }
    };

    p.removeControl = function(eventType) {
        this.svgDom.off(eventType);
    };

    p.onMouseDown = function(e) {
        if (this.workspace.getMode() == Entry.Workspace.MODE_VIMBOARD)
            return;

        if (e.stopPropagation) e.stopPropagation();
        if (e.preventDefault) e.preventDefault();

        var board = this;
        var longPressTimer = null;
        if (e.button === 0 || (e.originalEvent && e.originalEvent.touches)) {
            var eventType = e.type;
            var mouseEvent = Entry.Utils.convertMouseEvent(e);
            if (Entry.documentMousedown)
                Entry.documentMousedown.notify(mouseEvent);
            var doc = $(document);

            this.mouseDownCoordinate = {
                x: mouseEvent.pageX, y: mouseEvent.pageY
            };

            doc.bind('mousemove.entryBoard', onMouseMove);
            doc.bind('mouseup.entryBoard', onMouseUp);
            doc.bind('touchmove.entryBoard', onMouseMove);
            doc.bind('touchend.entryBoard', onMouseUp);
            this.dragInstance = new Entry.DragInstance({
                startX: mouseEvent.pageX,
                startY: mouseEvent.pageY,
                offsetX: mouseEvent.pageX,
                offsetY: mouseEvent.pageY
            });

            if (eventType === 'touchstart') {
                longPressTimer = setTimeout(function() {
                    if (longPressTimer) {
                        longPressTimer = null;
                        onMouseUp();
                        board._rightClick(e);
                    }
                }, 1000);
            }
        } else if (Entry.Utils.isRightButton(e)) this._rightClick(e);

        function onMouseMove(e) {
            if (e.stopPropagation) e.stopPropagation();
            if (e.preventDefault) e.preventDefault();

            var mouseEvent = Entry.Utils.convertMouseEvent(e);

            var mouseDownCoordinate = board.mouseDownCoordinate;
            var diff = Math.sqrt(Math.pow(mouseEvent.pageX - mouseDownCoordinate.x, 2) +
                            Math.pow(mouseEvent.pageY - mouseDownCoordinate.y, 2));
            if (diff < Entry.Board.DRAG_RADIUS) return;
            if (longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }


            var dragInstance = board.dragInstance;
            board.scroller.scroll(
                mouseEvent.pageX - dragInstance.offsetX,
                mouseEvent.pageY - dragInstance.offsetY
            );
            dragInstance.set({
                offsetX: mouseEvent.pageX,
                offsetY: mouseEvent.pageY
            });
        }

        function onMouseUp(e) {
            if (longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }
            $(document).unbind('.entryBoard');
            delete board.mouseDownCoordinate;
            delete board.dragInstance;
        }
    };

    p.mouseWheel = function(e) {
        e = e.originalEvent;
        e.preventDefault();
        var disposeEvent = Entry.disposeEvent;
        if (disposeEvent)
            disposeEvent.notify(e);

        this.scroller.scroll(
            e.wheelDeltaX || -e.deltaX,
            e.wheelDeltaY || -e.deltaY
        );
    };

    p.setSelectedBlock = function(blockView) {
        var old = this.selectedBlockView;

        if (old) old.removeSelected();

        if (blockView instanceof Entry.BlockView) {
            blockView.addSelected();
        } else blockView = null;

        this.set({selectedBlockView:blockView});
    };

    p.hide = function() {
        this.wrapper.addClass('entryRemove');
        this.visible = false;
    };

    p.show = function() {
        this.wrapper.removeClass('entryRemove');
        this.visible = true;
    };

    p.alignThreads = function(reDraw) {
        var domHeight = this.svgDom.height();
        var threads = this.code.getThreads();

        var verticalGap = 15;
        var acculmulatedTop = 15;
        var columWidth = 0;
        var limitTopPosition = domHeight - 30;
        var left = 50;

        for (var i =0; i < threads.length; i++) {
            var thread = threads[i];
            var block = thread.getFirstBlock();
            if (!block) continue;
            reDraw && thread.view.reDraw();
            var blockView = block.view;
            if (!blockView.movable) continue;
            var bBox = blockView.svgGroup.getBBox();
            var top = acculmulatedTop + verticalGap;
            if (top > limitTopPosition) {
                left = left + columWidth + 10;
                columWidth = 0;
                acculmulatedTop = 15;
            }
            columWidth = Math.max(columWidth, bBox.width);
            top = acculmulatedTop + verticalGap;
            blockView._moveTo(left - bBox.x, top, false);
            acculmulatedTop = acculmulatedTop + bBox.height + verticalGap;
        }
        this.scroller.resizeScrollBar();
    };

    p.clear = function() {
        this.svgBlockGroup.remove();
        this.svgThreadGroup.remove();
    };

    p.updateOffset = function () {
        this._offset = this.svg.getBoundingClientRect();
        var w = $(window),
            scrollTop = w.scrollTop(),
            scrollLeft = w.scrollLeft(),
            offset = this._offset;

        this.relativeOffset = {
            top: offset.top - scrollTop,
            left: offset.left - scrollLeft
        };

        if (this.btnWrapper) {
            this.btnWrapper.attr({
                "transform": "translate(" +
                    (offset.width / 2 - 65) + "," +
                    (offset.height - 200) +")"
            });
        }
    };

    p.generateButtons = function() {
        var that = this;
        var btnWrapper = this.svgGroup.elem("g");
        this.btnWrapper = btnWrapper;

        var saveText = btnWrapper.elem('text', {
            x: 27, y: 33, class: 'entryFunctionButtonText'
        });
        saveText.textContent = Lang.Buttons.save;

        var cancelText = btnWrapper.elem('text', {
            x: 102.5, y: 33, class: 'entryFunctionButtonText'
        });
        cancelText.textContent = Lang.Buttons.cancel;

        var saveButton = btnWrapper.elem('circle', {
            cx: 27.5, cy: 27.5, r: 27.5, class: 'entryFunctionButton'
        });

        var cancelButton = btnWrapper.elem('circle', {
            cx: 102.5, cy: 27.5, r: 27.5, class: 'entryFunctionButton'
        });

        $(saveButton).bind('mousedown touchstart', function() {that.save();});
        $(saveText).bind('mousedown touchstart', function() {that.save();});
        $(cancelButton).bind('mousedown touchstart', function() {that.cancelEdit();});
        $(cancelText).bind('mousedown touchstart', function() {that.cancelEdit();});
    };

    p.cancelEdit = function() {
        var mode = {};
        mode.boardType = Entry.Workspace.MODE_BOARD;
        this.workspace.setMode(Entry.Workspace.MODE_BOARD, "cancelEdit");
    };

    p.save = function() {
        var mode = {};
        mode.boardType = Entry.Workspace.MODE_BOARD;
        this.workspace.setMode(mode, "save");
    };

    p.generateCodeMagnetMap = function() {
        var code = this.code;
        var dragBlock = this.dragBlock;
        if (!(code && dragBlock)) return;

        //reset magnetMap
        this._magnetMap = {};

        for (var targetType in dragBlock.magnet) {
            if (targetType === 'next' &&
                dragBlock.block.getLastBlock().view.magnet.next === undefined) {
                    continue;
            }

            var metaData = this._getCodeBlocks(code, targetType);
            metaData.sort(function(a, b) {return a.point - b.point;});

            metaData.unshift({
                point: - Number.MAX_VALUE,
                blocks: []
            });
            for (var i = 1; i < metaData.length; i++) {
                var pointData = metaData[i];
                var includeData = pointData;
                var block = pointData.startBlock;
                if (block) {
                    var limit = pointData.endPoint,
                        index = i;
                    while (limit > includeData.point) {
                        includeData.blocks.push(block);
                        index++;
                        includeData = metaData[index];
                        if (!includeData)
                            break;
                    }
                    delete pointData.startBlock;
                }
                pointData.endPoint = Number.MAX_VALUE;
                metaData[i - 1].endPoint = pointData.point;
            }

            this._magnetMap[targetType] = metaData;
        }
    };

    p._getCodeBlocks = function(code, targetType) {
        var threads = code.getThreads();
        var blocks = [];
        var func;
        switch (targetType) {
            case "previous":
                func = this._getNextMagnets;
                break;
            case "next":
                func = this._getPreviousMagnets;
                break;
            case "string":
            case "boolean":
                func = this._getFieldMagnets;
                break;
            case "param":
                func = this._getOutputMagnets;
                break;
            default:
                return [];
        }
        for (var i = 0; i < threads.length; i++) {
            var thread = threads[i];
            blocks = blocks.concat(func.call(this, thread, thread.view.zIndex, null, targetType));
        }
        return blocks;
    };

    p._getNextMagnets = function(thread, zIndex, offset, targetType) {
        var blocks = thread.getBlocks();
        var statementBlocks = [];
        var metaData = [];
        if (!offset) offset = {x: 0, y: 0};
        var cursorX = offset.x;
        var cursorY = offset.y;

        for (var i = 0; i < blocks.length; i++) {
            var block = blocks[i];
            var blockView = block.view;
            blockView.zIndex = zIndex;
            if (blockView.dragInstance) {
                break;
            }
            cursorY += blockView.y;
            cursorX += blockView.x;
            var endPoint = cursorY + 1;
            if (blockView.magnet.next) {
                endPoint += blockView.height;
                metaData.push({
                    point: cursorY,
                    endPoint: endPoint,
                    startBlock: block,
                    blocks: []
                });
                metaData.push({
                    point: endPoint,
                    blocks: []
                });
                blockView.absX = cursorX;
            }
            if (block.statements)
                zIndex += 0.01;
                for (var j = 0; j < block.statements.length; j++) {
                    var thread = block.statements[j];
                    var statement = block.view._statements[j];
                    statement.zIndex = zIndex;
                    statement.absX = cursorX + statement.x;
                    metaData.push({
                        point: statement.y + cursorY - 30,
                        endPoint: statement.y + cursorY,
                        startBlock: statement,
                        blocks: []
                    });
                    metaData.push({
                        point: statement.y + cursorY + statement.height,
                        blocks: []
                    });
                    zIndex += 0.01;
                    statementBlocks = statementBlocks.concat(
                        this._getNextMagnets(thread, zIndex, {
                            x: statement.x + cursorX,
                            y: statement.y + cursorY
                        }, targetType)
                    );
                }
            if (blockView.magnet.next) {
                cursorY += blockView.magnet.next.y;
                cursorX += blockView.magnet.next.x;
            }
        }
        return statementBlocks.concat(metaData);
    };

    p._getPreviousMagnets = function(thread, zIndex, offset, targetType) {
        var blocks = thread.getBlocks();
        var metaData = [];
        if (!offset) offset = {x: 0, y: 0};
        var cursorX = offset.x;
        var cursorY = offset.y;

        var block = blocks[0];
        var blockView = block.view;
        blockView.zIndex = zIndex;
        if (blockView.dragInstance)
            return [];
        cursorY += blockView.y - 15;
        cursorX += blockView.x;
        var endPoint = cursorY + 1;
        if (blockView.magnet.previous) {
            endPoint += blockView.height;
            metaData.push({
                point: cursorY,
                endPoint: endPoint,
                startBlock: block,
                blocks: []
            });
            metaData.push({
                point: endPoint,
                blocks: []
            });
            blockView.absX = cursorX;
            return metaData;
        }
        return [];
    };

    p._getFieldMagnets = function(thread, zIndex, offset, targetType) {
        var blocks = thread.getBlocks();
        var statementBlocks = [];
        var metaData = [];
        var that = this;
        if (!offset) offset = {x: 0, y: 0};
        var cursorX = offset.x;
        var cursorY = offset.y;
        for (var i = 0; i < blocks.length; i++) {
            var block = blocks[i];
            var blockView = block.view;
            if (blockView.dragInstance)
                break;
            blockView.zIndex = zIndex;
            cursorY += blockView.y;
            cursorX += blockView.x;
            var endPoint = cursorY + 1;
            if (blockView.magnet.next)
                endPoint += blockView.magnet.next.y;
            metaData = metaData.concat(
                this._getFieldBlockMetaData(blockView, cursorX, cursorY, zIndex, targetType)
            );
            if (block.statements)
                zIndex += 0.01;
                for (var j = 0; j < block.statements.length; j++) {
                    var thread = block.statements[j];
                    var statement = block.view._statements[j];
                    statementBlocks = statementBlocks.concat(
                        this._getFieldMagnets(thread, zIndex, {
                            x: statement.x + cursorX,
                            y: statement.y + cursorY
                        }, targetType)
                    );
                }
            if (blockView.magnet.next) {
                cursorY += blockView.magnet.next.y;
                cursorX += blockView.magnet.next.x;
            }
        }
        return statementBlocks.concat(metaData);
    };

    p._getFieldBlockMetaData = function(blockView, cursorX, cursorY, zIndex, targetType) {
        var contents = blockView._contents;
        var metaData = [];
        cursorY += blockView.contentPos.y;
        for (var i = 0; i < contents.length; i++) {
            var content = contents[i];
            if (!(content instanceof Entry.FieldBlock))
                continue;
            var contentBlock = content._valueBlock;
            if (contentBlock.view.dragInstance)
                continue;
            if (content.acceptType !== targetType && content.acceptType !== "boolean") {
                continue;
            }
            var startX = cursorX + content.box.x;
            var startY = cursorY + content.box.y + (blockView.contentHeight % 1000) * -0.5;
            var endY = cursorY + content.box.y + content.box.height;
            if (content.acceptType === targetType) {
                metaData.push({
                    point: startY,
                    endPoint: endY,
                    startBlock: contentBlock,
                    blocks: []
                });
                metaData.push({
                    point: endY,
                    blocks: []
                });
            }
            var contentBlockView = contentBlock.view;
            contentBlockView.absX = startX;
            contentBlockView.zIndex = zIndex;
            metaData = metaData.concat(
                this._getFieldBlockMetaData(contentBlockView,
                                          startX + contentBlockView.contentPos.x,
                                          startY + contentBlockView.contentPos.y,
                                          zIndex + 0.01,
                                          targetType)
            );
        }
        return metaData;
    };

    p._getOutputMagnets = function(thread, zIndex, offset, targetType) {
        var blocks = thread.getBlocks();
        var statementBlocks = [];
        var metaData = [];
        var that = this;
        if (!offset) offset = {x: 0, y: 0};
        var cursorX = offset.x;
        var cursorY = offset.y;
        for (var i = 0; i < blocks.length; i++) {
            var block = blocks[i];
            var blockView = block.view;
            if (blockView.dragInstance)
                break;
            blockView.zIndex = zIndex;
            cursorY += blockView.y;
            cursorX += blockView.x;
            var endPoint = cursorY + 1;
            if (blockView.magnet.next)
                endPoint += blockView.magnet.next.y;
            metaData = metaData.concat(
                this._getOutputMetaData(blockView, cursorX, cursorY, zIndex, targetType)
            );
            if (block.statements)
                zIndex += 0.01;
                for (var j = 0; j < block.statements.length; j++) {
                    var thread = block.statements[j];
                    var statement = block.view._statements[j];
                    statementBlocks = statementBlocks.concat(
                        this._getOutputMagnets(thread, zIndex, {
                            x: statement.x + cursorX,
                            y: statement.y + cursorY
                        }, targetType)
                    );
                }
            if (blockView.magnet.next) {
                cursorY += blockView.magnet.next.y;
                cursorX += blockView.magnet.next.x;
            }
        }
        return statementBlocks.concat(metaData);
    };

    p._getOutputMetaData = function(blockView, cursorX, cursorY, zIndex, targetType) {
        var contents = blockView._contents;
        var metaData = [];
        cursorX += blockView.contentPos.x;
        cursorY += blockView.contentPos.y;
        for (var i = 0; i < contents.length; i++) {
            var content = contents[i];
            var startX = cursorX + content.box.x;
            var startY = cursorY - 24;
            var endY = cursorY;
            if (content instanceof Entry.FieldBlock) {
                if (content.acceptType === targetType) {
                    metaData.push({
                        point: startY,
                        endPoint: endY,
                        startBlock: content,
                        blocks: []
                    });
                    metaData.push({
                        point: endY,
                        blocks: []
                    });
                        content.absX = startX;
                        content.zIndex = zIndex;
                        content.width = 20;
                }

                var contentBlock = content._valueBlock;
                if (contentBlock) {
                    metaData = metaData.concat(
                        this._getOutputMetaData(contentBlock.view,
                                                  startX,
                                                  cursorY + content.box.y,
                                                  zIndex + 0.01,
                                                  targetType)
                    );
                }
                continue;
            } else if (content instanceof Entry.FieldOutput) {
                if (content.acceptType !== targetType)
                    continue;
                metaData.push({
                    point: startY,
                    endPoint: endY,
                    startBlock: content,
                    blocks: []
                });
                metaData.push({
                    point: endY,
                    blocks: []
                });
                content.absX = startX;
                content.zIndex = zIndex;
                content.width = 20;
                var contentBlock = content._valueBlock;
                if (!contentBlock)
                    continue;
                if (contentBlock.view.dragInstance)
                    continue;
                var contentBlockView = contentBlock.view;
                metaData = metaData.concat(
                    this._getOutputMetaData(contentBlockView,
                                              cursorX + content.box.x,
                                              cursorY + content.box.y,
                                              zIndex + 0.01,
                                              targetType)
                );
            }
        }
        return metaData;
    };


    p.getNearestMagnet = function(x, y, targetType) {
        var targetArray = this._magnetMap[targetType];
        if (!targetArray || targetArray.length ===0) return;

        var minIndex = 0,
            maxIndex = targetArray.length - 1,
            index,
            pointData,
            result = null,
            searchValue = targetType === "previous" ? y - 15 : y,
            leftOffset = ["previous", "next"].indexOf(targetType) > - 1 ? 20 : 0;
        while (minIndex <= maxIndex) {
            index = (minIndex + maxIndex) / 2 | 0;
            pointData = targetArray[index];

            if (searchValue < pointData.point) {
                maxIndex = index - 1;
            } else if (searchValue > pointData.endPoint) {
                minIndex = index + 1;
            } else {
                var blocks = pointData.blocks;
                for (var i = 0; i < blocks.length; i++) {
                    var blockView = blocks[i].view;
                    if (blockView.absX - leftOffset < x && x < blockView.absX + blockView.width) {
                        var resultBlock = pointData.blocks[i];
                        if (!result || result.view.zIndex < resultBlock.view.zIndex)
                            result = pointData.blocks[i];
                    }
                }
                return result;
            }
        }
        return null;
    };

    p.dominate = function(thread) {
        if (!thread) return;
        var block = thread.getFirstBlock();
        if (!block) return;
        this.svgBlockGroup
            .appendChild(block.view.svgGroup);
        this.code.dominate(block.thread);
    };

    p.enablePattern = function() {
        this.pattern.removeAttribute('style');
    };

    p.disablePattern = function() {
        this.pattern.attr({
            style: "display: none"
        });
    };

    p._removeActivated = function() {
        if (!this._activatedBlockView) return;

        this._activatedBlockView.removeActivated();
        this._activatedBlockView = null;
    };

    p.activateBlock = function(block) {
        var view = block.view;
        var pos = view.getAbsoluteCoordinate();
        var svgDom = this.svgDom;
        var blockX = pos.x,
            blockY = pos.y;

        var dx = svgDom.width()/2 - blockX;
        var dy = svgDom.height()/2 - blockY - 100;
        this.scroller.scroll(
            dx, dy
        );

        view.addActivated();

        this._activatedBlockView = view;
    };

    p.reDraw = function() {
        this.code && this.code.view && this.code.view.reDraw();
    };

    p.separate = function(block, count, index) {
        if (typeof block === "string")
            block = this.findById(block);
        if (block.view)
            block.view._toGlobalCoordinate();
        var prevBlock = block.getPrevBlock();
        block.separate(count, index);
        if (prevBlock && prevBlock.getNextBlock())
            prevBlock.getNextBlock().view.bindPrev();
    };

    p.insert = function(block, pointer, count) { // pointer can be target
        if (typeof block === "string")
            block = this.findById(block);


        if (pointer.length === 3) { // for global
            this.separate(block, count, pointer[2]);
            block.moveTo(pointer[0], pointer[1]);
        }
        else {
            this.separate(block, count);
            var targetObj;
            if (pointer instanceof Array)
                targetObj = this.code.getByPointer(pointer);
            else
                targetObj = pointer;
            if (targetObj instanceof Entry.Block) {
                if (block.getBlockType() === "basic")
                    block.view.bindPrev(targetObj);
                block.doInsert(targetObj);
            } else if (targetObj instanceof Entry.FieldStatement) {
                block.view.bindPrev(targetObj);
                targetObj.insertTopBlock(block);
            } else if (targetObj instanceof Entry.Thread) {
                targetObj = targetObj.view.getParent();
                block.view.bindPrev(targetObj);
                targetObj.insertTopBlock(block);
            } else {
                block.doInsert(targetObj);
            }
        }
    };

    p.adjustThreadsPosition = function() {
        var code = this.code;
        if (!code) return;
        if (!code.view) return;

        var threads = code.getThreads();
        if (!threads || threads.length === 0) return;

        threads = threads.sort(function(a,b) {
            return a.getFirstBlock().view.x - b.getFirstBlock().view.x;
        });

        var block  = threads[0].getFirstBlock();
        if (block) {
            block = block.view;
            var pos = block.getAbsoluteCoordinate();

            this.scroller.scroll(
                50 - pos.x, 30 - pos.y,
                true
            );
        }
    };

    p._initContextOptions = function() {
        var that = this;
        this._contextOptions = [
            {
                activated: true,
                option: {
                    text: Lang.Blocks.Paste_blocks,
                    enable: !!Entry.clipboard && !this.readOnly,
                    callback: function() {
                        Entry.do('addThread', Entry.clipboard).value
                            .getFirstBlock().copyToClipboard();
                    }
                }
            },
            {
                activated: true,
                option: {
                    text: Lang.Blocks.tidy_up_block,
                    enable: !this.readOnly,
                    callback: function(){
                        that.alignThreads();
                    }
                }
            },
            {
                activated: true,
                option: {
                    text: Lang.Blocks.Clear_all_blocks,
                    enable: !this.readOnly,
                    callback: function() {
                        Entry.do('destroyThreads');
                    }
                }
            },
            {
                activated: Entry.type === 'workspace' && Entry.Utils.isChrome() && !Entry.isMobile(),
                option: {
                    text: Lang.Menus.save_as_image_all,
                    enable: !this.readOnly,
                    callback: function(){
                        var threads = that.code.getThreads();
                        var images = [];
                        threads.forEach(function(t,i) {
                            var topBlock = t.getFirstBlock();
                            if (!topBlock) return;
                            console.log('threads.length=',threads.length);
                            if (threads.length > 1 && Entry.isOffline) {
                                topBlock.view.getDataUrl().then(function(data) {
                                    images.push(data);
                                    if (images.length == threads.length) {
                                        Entry.dispatchEvent(
                                            'saveBlockImages',
                                            { images: images }
                                        );
                                    }
                                });
                            } else {
                                topBlock.view.downloadAsImage(++i);
                            }
                        });
                    }
                }
            }
        ];
    };

    p.activateContextOption = function(option) {
        this._contextOptions[option].activated = true;
    };

    p.deActivateContextOption = function(option) {
        this._contextOptions[option].activated = false;
    };

    p._bindEvent = function() {
        if (Entry.documentMousedown) {
            Entry.documentMousedown.attach(this, this.setSelectedBlock);
            Entry.documentMousedown.attach(this, this._removeActivated);
        }
        if (Entry.windowResized) {
            Entry.windowResized
                .attach(this, _.debounce(this.updateOffset, 200));
        }
    };

    p.offset = function() {
        if (!this._offset || (this._offset.top === 0 && this._offset.left === 0))  {
            this.updateOffset();
            return this._offset;
        }
        return this._offset;
    };

    p._rightClick = function(e) {
        var disposeEvent = Entry.disposeEvent;
        disposeEvent && disposeEvent.notify(e);
        if (!this.visible) return;
        var that = this;

        var options = [];
        var contextOptions = this._contextOptions;

        contextOptions[Entry.Board.OPTION_PASTE].option.enable = !!Entry.clipboard;
        contextOptions[Entry.Board.OPTION_DOWNLOAD].option.enable =
            this.code.getThreads().length !== 0;

        for (var i=0; i<this._contextOptions.length; i++) {
            if (contextOptions[i].activated)
                options.push(contextOptions[i].option);
        }

        e = Entry.Utils.convertMouseEvent(e);
        Entry.ContextMenu.show(options, null,
            { x: e.clientX, y: e.clientY }
        );
    };

    p.getDom = function(query) {
        var key = query.shift();
        if (key === 'trashcan')
            return this.workspace.trashcan.svgGroup;
        else if (key === 'coord')
            return {
                getBoundingClientRect: function() {
                    var halfWidth = 20,
                        boardOffset = this.relativeOffset;
                    return {
                        top: query[1] + boardOffset.top - halfWidth,
                        left: query[0] + boardOffset.left - halfWidth,
                        width: 2 * halfWidth,
                        height: 2 * halfWidth
                    }
                }.bind(this)
            }
        else if (key instanceof Array) {
            var targetObj = this.code.getByPointer(key);
            if (targetObj.getDom) {
                return targetObj.getDom(query);
            } else {
                return targetObj.svgGroup;
            }
        }
    };

    p.findBlock = function(block) {
        if (typeof block === 'string')
            return this.findById(block);
        else if (block && block.id)
            return this.findById(block.id);
        else if (block instanceof Array)
            return this.code.getByPointer(block);
        return block;
    };

    p.scrollToPointer = function(pointer, query) {
        var obj = this.code.getByPointer(pointer);
        //var dom = obj.getDom? obj.getDom(query) : obj.svgGroup;
        //var rect = dom.getBoundingClientRect();
        var pos;
        if (obj instanceof Entry.Block) {
            pos = obj.view.getAbsoluteCoordinate();
            obj.view.dominate();
        } else if (obj.getAbsolutePosFromBoard)
            pos = obj.getAbsolutePosFromBoard();

        var newX = 0, newY = 0;
        if (pos.x > this._offset.width - 200)
            newX = this._offset.width - 200 - pos.x;
        else if (pos.x < 100)
            newX = 100 - pos.x;
        if (pos.y > this._offset.height - 200)
            newY = this._offset.height - 200 - pos.y;
        else if (pos.y < 100)
            newY = 100 - pos.y;

        this.scroller.scroll(newX, newY);

        this._offset;
    };

})(Entry.Board.prototype);
