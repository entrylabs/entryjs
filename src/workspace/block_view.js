/*
 *
 */
"use strict";

goog.provide("Entry.BlockView");

/*
 *
 */
Entry.BlockView = function(block, board, mode) {
    Entry.Model(this, false);
    this.block = block;
    this._board = board;
    this.set(block);
    this.svgGroup = board.svgBlockGroup.group();

    this._schema = Entry.block[block.type];
    var skeleton = this._skeleton = Entry.skeleton[this._schema.skeleton];
    this._contents = [];
    this._statements = [];

    if (skeleton.magnets && skeleton.magnets().next)
        this.svgGroup.nextMagnet = this.block;

    this.isInBlockMenu = this.getBoard() instanceof Entry.BlockMenu;

    if (skeleton.morph)
        this.block.observe(this, "_renderPath", skeleton.morph, false);

    this.prevObserver = null;
    this._startRender(block, mode);

    // observe
    this.block.observe(this, "_bindPrev", ["prev"]);
    this.block.observe(this, "_createEmptyBG", ["next"]);
    this.block.observe(this, "_setMovable", ["movable"]);
    this.block.observe(this, "_setReadOnly", ["movable"]);
    this.observe(this, "_updateBG", ["magneting"]);
    this.observe(this, "_updateOpacity", ["visible"]);
    this.observe(this, "_updateShadow", ["shadow"]);
    board.code.observe(this, '_setBoard', ['board'], false);

    this.dragMode = Entry.DRAG_MODE_NONE;
    Entry.Utils.disableContextmenu(this.svgGroup.node);
};

Entry.BlockView.PARAM_SPACE = 5;

(function(p) {
    p.schema = {
        id: 0,
        type: Entry.STATIC.BLOCK_RENDER_MODEL,
        x: 0,
        y: 0,
        offsetX: 0,
        offsetY: 0,
        width: 0,
        height: 0,
        contentWidth: 0,
        contentHeight: 0,
        magneting: false,
        visible: true,
        animating: false,
        shadow: true
    };

    p._startRender = function(block, mode) {
        this.svgGroup.attr({class: "block"});

        var path = this._skeleton.path(this);

        this._darkenPath = this.svgGroup.path(path);
        this._darkenPath.attr({
            transform: "t0 1",
            fill: Entry.Utils.colorDarken(this._schema.color, 0.7),
            class: 'blockPathDarken'
        });

        this._path = this.svgGroup.path(path);
        var pathStyle = {fill: this._schema.color};
        if (this._skeleton.outerLine) {
            pathStyle.strokeWidth = "0.5";
            pathStyle.stroke = Entry.Utils.colorDarken(this._schema.color, 0.8);
        }
        pathStyle.class = 'blockPath';
        this._path.attr(pathStyle);

        this._moveTo(this.x, this.y, false);
        this._startContentRender(mode);
        this._addControl();
    };

    p._startContentRender = function(mode) {
        mode = mode === undefined ?
            Entry.Workspace.MODE_BOARD : mode;
        if (this.contentSvgGroup)
            this.contentSvgGroup.remove();
        var schema = this._schema;
        if (schema.statements && schema.statements.length && this.statementSvgGroup)
            this.statementSvgGroup.remove();
        this._contents = [];

        this.contentSvgGroup = this.svgGroup.group();
        if (schema.statements && schema.statements.length)
            this.statementSvgGroup = this.svgGroup.group();
        switch (mode) {
            case Entry.Workspace.MODE_BOARD:
            case Entry.Workspace.MODE_OVERLAYBOARD:
                var reg = /(%\d)/mi;
                var templateParams = schema.template.split(reg);
                var params = schema.params;
                for (var i=0; i<templateParams.length; i++) {
                    var param = templateParams[i].trim();
                    if (param.length === 0) continue;
                    if (reg.test(param)) {
                        var paramIndex = Number(param.split('%')[1]) - 1;
                        param = params[paramIndex];
                        this._contents.push(
                            new Entry['Field' + param.type](param, this, paramIndex)
                        );
                    } else this._contents.push(new Entry.FieldText({text: param}, this));
                }

                var statements = schema.statements;
                if (statements && statements.length) {
                    for (i=0; i<statements.length; i++)
                        this._statements.push(new Entry.FieldStatement(statements[i], this, i));
                }
                break;
            case Entry.Workspace.MODE_VIMBOARD:
                var text = this.getBoard().workspace.getCodeToText(this.block);
                this._contents.push(
                    new Entry.FieldText({text: text, color: 'white'}, this)
                );
                break;
        }
        this.alignContent(false);
    };

    p.alignContent = function(animate) {
        if (animate !== true) animate = false;
        var cursor = {x: 0, y: 0, height: 0};
        for (var i = 0; i < this._contents.length; i++) {
            var c = this._contents[i];
            c.align(cursor.x, cursor.y, animate);

            // space between content
            if (i !== this._contents.length - 1)
                cursor.x += Entry.BlockView.PARAM_SPACE;

            var box = c.box;
            cursor.height = Math.max(box.y + box.height, cursor.height);
            cursor.x += box.width;
        }

        if (this._statements.length) {
            var positions = this._skeleton.statementPos ?
                this._skeleton.statementPos(this) : [];
            for (var i = 0; i < this._statements.length; i++) {
                var s = this._statements[i];
                var pos = positions[i];
                if (pos)
                    s.align(pos.x, pos.y, animate);
            }
        }

        this.set({
            contentWidth: cursor.x,
            contentHeight: cursor.height
        });

        var contentPos = this.getContentPos();
        this.contentSvgGroup.transform("t" + contentPos.x + ' ' + contentPos.y);
        this._render();
    };

    p._bindPrev = function() {
        if (this.prevObserver) this.prevObserver.destroy();
        if (this.block.prev) {
            this._toLocalCoordinate(this.block.prev.view.svgGroup);
            var prevView = this.block.prev.view;
            this.prevObserver = prevView.observe(
                this, "_align", ["height"]
            );
        } else {
            this._toGlobalCoordinate();
            delete this.prevObserver;
        }
    };

    p._render = function() {
        this._renderPath();
        this.set(this._skeleton.box(this));

        var block = this.block;
        var events = block.events.blockAdd;
        if (events && !this.isInBlockMenu)
            events.forEach(function(fn){fn(block);});
    };

    p._renderPath = function() {
        var path = this._skeleton.path(this);
        var that = this;

        if (false && Entry.ANIMATION_DURATION !== 0) {
            setTimeout(function() {
                that._darkenPath.animate({
                    d: path
                }, Entry.ANIMATION_DURATION, mina.easeinout, function() {
                    that.set({animating: false});
                });

                that._path.animate({
                    d: path
                }, Entry.ANIMATION_DURATION, mina.easeinout);
            }, 0);
        } else {
            this._darkenPath.attr({
                d: path
            });

            this._path.attr({
                d: path
            });

            this.set({animating: false});
        }
    };

    p._align = function(animate) {
        if (this.block.prev === null)
            return;
        var prevBlockView = this.block.prev.view;
        if (animate === true)
            this.set({animating: true});
        this.set({
            x: 0,
            y: prevBlockView.height + 1
        });

        this._setPosition(animate === true || this.animating);
    };

    p._setPosition = function(animate) {
        animate = animate === undefined ? true : animate;
        var transform = "t" +
            (this.x) + " " +
            (this.y);
        this.svgGroup.stop();
        if (animate && Entry.ANIMATION_DURATION !== 0) {
            this.svgGroup.animate({
                transform: transform
            }, Entry.ANIMATION_DURATION, mina.easeinout);
        } else {
            $(this.svgGroup.node).attr({
                 transform: 'translate(' + this.x + ' ' + this.y + ')'
            });
        }
    };

    p._toLocalCoordinate = function(parentSvgGroup) {
        var parentMatrix = parentSvgGroup.transform().globalMatrix;
        var matrix = this.svgGroup.transform().globalMatrix;
        this._moveTo(matrix.e - parentMatrix.e, matrix.f - parentMatrix.f, false);
        parentSvgGroup.append(this.svgGroup);
    };

    p._toGlobalCoordinate = function() {
        var matrix = this.svgGroup.transform().globalMatrix;
        this._moveTo(matrix.e, matrix.f, false);
        this._board.svgBlockGroup.append(this.svgGroup);
    };

    p._moveTo = function(x, y, animate) {
        this.set({ x: x, y: y });
        this._setPosition(animate);
    };

    p._moveBy = function(x, y, animate) {
        return this._moveTo(
            this.x + x,
            this.y + y,
            animate
        );
    };

    p._addControl = function() {
        var that = this;
        this.svgGroup.mousedown(function() {
            var events = that.block.events;
            if (events && events.mousedown)
                events.mousedown.forEach(function(fn){fn();});

            that.onMouseDown.apply(that, arguments);
        });
    };

    p.onMouseDown = function(e) {
        e.stopPropagation();
        e.preventDefault();
        var board = this.getBoard();
        if (Entry.documentMousedown)
            Entry.documentMousedown.notify();
        if (this.readOnly || board.viewOnly) return;

        board.setSelectedBlock(this);
        this.dominate();
        if (e.button === 0 || e instanceof Touch) {
            this.mouseDownCoordinate = {
                x: e.pageX, y: e.pageY
            };
            var doc = $(document);
            doc.bind('mousemove.block', onMouseMove);
            doc.bind('mouseup.block', onMouseUp);
            doc.bind('touchmove.block', onMouseMove);
            doc.bind('touchend.block', onMouseUp);
            board.set({dragBlock:this});
            this.dragInstance = new Entry.DragInstance({
                startX: e.pageX,
                startY: e.pageY,
                offsetX: e.pageX,
                offsetY: e.pageY,
                prev: this.block.prev,
                height: 0,
                mode: true
            });
            this.addDragging();
            this.dragMode = Entry.DRAG_MODE_MOUSEDOWN;
        } else if (Entry.Utils.isRightButton(e)) {
            var that = this;
            var block = that.block;
            if (this.isInBlockMenu) return;

            var options = [];

            var copyAndPaste = {
                text: '블록 복사 & 붙여넣기',
                callback: function(){
                    board.code.createThread(block.copy());
                }
            };

            var copy = {
                text: '블록 복사',
                callback: function(){
                    that.block.copyToClipboard();
                }
            };

            var remove = {
                text: '블록 삭제',
                enable: block.isDeletable(),
                callback: function(){
                    that.block.doDestroyAlone(true);
                }
            };

            options.push(copyAndPaste);
            options.push(copy);
            options.push(remove);

            Entry.ContextMenu.show(options);
        }

        var blockView = this;

        if(board.workspace.getMode() === Entry.Workspace.MODE_VIMBOARD) {
            if(e) {
                var dragEnd = new MouseEvent('dragStart', {
                    'view': window,
                    'bubbles': true,
                    'cancelable': true,
                    'clientX' : e.clientX,
                    'clientY' : e.clientY
                });

                document.getElementsByClassName('CodeMirror')[0].dispatchEvent(dragEnd);
            }
        }

        function onMouseMove(e) {
            var workspaceMode = board.workspace.getMode();

            if (workspaceMode === Entry.Workspace.MODE_VIMBOARD)
                p.vimBoardEvent(e, 'dragOver');

            var mouseDownCoordinate = blockView.mouseDownCoordinate;
            if (blockView.dragMode == Entry.DRAG_MODE_DRAG ||
                e.pageX !== mouseDownCoordinate.x ||
                e.pageY !== mouseDownCoordinate.y) {
                if (!blockView.movable) return;

                if (!blockView.isInBlockMenu) {
                    if(blockView.block.prev) {
                        blockView.block.prev.setNext(null);
                        blockView.block.setPrev(null);
                        blockView.block.thread.changeEvent.notify();
                    }

                    if (this.animating)
                        this.set({animating: false});

                    if (blockView.dragInstance.height === 0) {
                        var block = blockView.block;
                        var height = - 1;
                        while (block) {
                            height += block.view.height + 1;
                            block = block.next;
                        }
                        blockView.dragInstance.set({
                            height: height
                        });
                    }

                    if (e.originalEvent.touches) {
                        e = e.originalEvent.touches[0];
                    }
                    var dragInstance = blockView.dragInstance;
                    blockView._moveBy(
                        e.pageX - dragInstance.offsetX,
                        e.pageY - dragInstance.offsetY,
                        false
                    );
                    dragInstance.set({
                        offsetX: e.pageX,
                        offsetY: e.pageY
                    });
                    blockView.dragMode = Entry.DRAG_MODE_DRAG;

                    if(!Entry.GlobalSvg.setView(blockView, workspaceMode))
                        Entry.GlobalSvg.position();
                    var magnetedBlock = blockView._getCloseBlock();
                    if (magnetedBlock) {
                        board = magnetedBlock.view.getBoard();
                        board.setMagnetedBlock(magnetedBlock.view);
                    } else board.setMagnetedBlock(null);
                    if (!blockView.originPos)
                        blockView.originPos = {x: blockView.x, y: blockView.y};
                } else board.cloneToGlobal(e);
            }
        }

        function onMouseUp(e) {
            Entry.GlobalSvg.remove();
            $(document).unbind('.block');
            delete this.mouseDownCoordinate;
            blockView.terminateDrag(e);
            if (board) board.set({dragBlock: null});
            delete blockView.dragInstance;
        }
        e.stopPropagation();
    };

    p.vimBoardEvent = function(event, type, block) {
        if (event) {
            var dragEvent = new MouseEvent(type, {
                'view': window,
                'bubbles': true,
                'cancelable': true,
                'clientX' : event.clientX,
                'clientY' : event.clientY
            });

            if (block) dragEvent.block = block;

            var _vimBoard = document.getElementsByClassName('CodeMirror')[0];
            _vimBoard.dispatchEvent(dragEvent);
        }
    };

    p.terminateDrag = function(e) {
        var board = this.getBoard();
        var dragMode = this.dragMode;
        var block = this.block;
        var workspaceMode = board.workspace.getMode();
        this.removeDragging();

        if (workspaceMode === Entry.Workspace.MODE_VIMBOARD) {
            if (board instanceof Entry.BlockMenu) {
                board.terminateDrag();
                this.vimBoardEvent(e, 'dragEnd', block);
            } else board.clear();
        } else {
            if (dragMode !== Entry.DRAG_MODE_MOUSEDOWN) {
                var fromBlockMenu = this.dragInstance && this.dragInstance.isNew;
                if (fromBlockMenu) {
                    var removed = board.workspace.blockMenu.terminateDrag();
                    if (!removed) block.doAdd();
                }

                var gs = Entry.GlobalSvg;
                var prevBlock = this.dragInstance && this.dragInstance.prev;
                switch (Entry.GlobalSvg.terminateDrag(this)) {
                    case gs.DONE:
                        var closeBlock = this._getCloseBlock();
                        if (!prevBlock && !closeBlock) {
                            if (dragMode == Entry.DRAG_MODE_DRAG && !fromBlockMenu)
                                block.doMove();
                        } else {
                            if (closeBlock) {
                                this.set({animating: true});
                                if (closeBlock.next)
                                    closeBlock.next.view.set({animating: true});

                                block.doInsert(closeBlock);
                                createjs.Sound.play('entryMagneting');
                                //Entry.ConnectionRipple.setView(block.view);

                                if (closeBlock.constructor == Entry.FieldDummyBlock) {
                                    var orphan = block.next;
                                    if (orphan) {
                                        if (Entry.FieldDummyBlock.PRIMITIVE_TYPES.indexOf(orphan.type) > -1) {
                                            orphan.getThread().cut(orphan);
                                            orphan.destroy(false);
                                        } else {
                                            orphan.separate();
                                            orphan.view._moveBy(10, 10, false);
                                        }
                                    }
                                }
                            } else block.doSeparate();
                        }
                        break;
                        case gs.RETURN:
                            var originPos = this.originPos;
                            if (prevBlock) {
                                this.set({animating: false});
                                createjs.Sound.play('entryMagneting');
                                block.insert(prevBlock);
                            } else this._moveTo(originPos.x, originPos.y, false);
                            break;
                        case gs.REMOVE:
                            createjs.Sound.play('entryDelete');
                            if (!fromBlockMenu) {
                                if (prevBlock) block.doSeparate();
                                this.block.doDestroy(false);
                            } else {
                                if (prevBlock) block.separate();
                                this.block.destroy(false);
                            }
                            break;
                }
                board.setMagnetedBlock(null);
            }
        }

        this.dragMode = Entry.DRAG_MODE_NONE;
        this.destroyShadow();
        delete this.originPos;
        return;
    };

    p._getCloseBlock = function() {
        if (!this._skeleton.magnets)
            return;
        var targetType = this._skeleton.magnets();

        if (targetType.previous) targetType = 'nextMagnet';
        else if (targetType.string) targetType = 'stringMagnet';
        else if (targetType.bool) targetType = 'booleanMagnet';
        else if (targetType.param) targetType = 'paramMagnet';
        else targetType = null;

        if (!targetType) return;

        var board = this.getBoard();
        var x = this.x,
            y = this.y;

        var offset = board.relativeOffset;
        x += offset.left;

        //below the board
        if (x + this.offsetX < board.offset.left) return null;

        var targetElement = Snap.getElementByPoint(x, y + offset.top - 2);

        if (targetElement === null) return;

        var targetBlock = targetElement[targetType];

        while (!targetBlock && targetElement.parent() &&
               targetElement.type !== "svg" && targetElement.type !== "BODY") {
            targetElement = targetElement.parent();
            targetBlock = targetElement[targetType];
        }

        if (targetBlock === undefined || targetBlock === this.block ||
               targetBlock.view.getBoard() !== board)
           return null;

        return targetBlock;
    };

    p._inheritAnimate = function() {
        var prevBlockView = this.block.prev.view;
        if (prevBlockView)
            this.set({animating: prevBlockView.animating});
    };

    p.dominate = function() {
        var svgBlockGroup = this.getBoard().svgBlockGroup;

        var node = this.svgGroup;
        while (node.parent() !== svgBlockGroup)
            node = node.parent();

        svgBlockGroup.append(node);
    };

    p.getBoard = function() {return this._board;};

    p._setBoard = function() {
        this._board = this._board.code.board;
    };

    p.destroy = function(animate) {
        var svgGroup = this.svgGroup;

        if (animate) {
            svgGroup.animate(
                { opacity: 0 },
                100,
                null,
                function(){
                    this.remove();
                }
            );
        } else svgGroup.remove();

        this._contents.forEach(function(c) {
            c.destroy();
        });

        this._statements.forEach(function(c) {
            c.destroy();
        });

        var block = this.block;
        var events = block.events.blockDestroy;
        if (events && !this.isInBlockMenu)
            events.forEach(function(fn){fn(block);});
    };

    p.getShadow = function() {
        if (!this._shadow) {
            this._shadow = this.svgGroup.clone();
            this._shadow.attr({
                opacity: 0.5
            });
        }
        return this._shadow;
    };

    p.destroyShadow = function() {
        delete this._shadow;
    };

    p._updateBG = function() {
        if (!this._board.dragBlock || !this._board.dragBlock.dragInstance)
            return;
        var dragThreadHeight = this._board.dragBlock.dragInstance.height;
        var blockView = this;
        var magneting = blockView.magneting;
        var block = blockView.block;
        var svgGroup = blockView.svgGroup;
        if (magneting) {
            var shadow = this._board.dragBlock.getShadow();
            $(shadow.node).attr({
                 transform: 'translate(0 ' + (this.height + 1) + ')'
            });
            this.svgGroup.prepend(shadow);
            this._clonedShadow = shadow;
            console.log(shadow);

            if (blockView.background) {
                blockView.background.remove();
                blockView.nextBackground.remove();
                delete blockView.background;
                delete blockView.nextBackground;
            }
            var height = blockView.height + dragThreadHeight;

            var nextBg = svgGroup.rect(
                0 - blockView.width/2,
                blockView.height * 1.5 + 1,
                blockView.width,
                Math.max(0, height - blockView.height * 1.5)
            );
            nextBg.block = blockView.block.next;
            blockView.nextBackground = nextBg;

            nextBg.attr({
                fill: 'transparent'
            });
            svgGroup.prepend(nextBg);

            var bg = svgGroup.rect(
                0 - blockView.width/2,
                0,
                blockView.width,
                height
            );
            blockView.background = bg;

            bg.attr({
                fill: 'transparent'
            });
            svgGroup.prepend(bg);

            blockView.originalHeight = blockView.height;
            blockView.set({
                height: height,
                animating: false
            });
        } else {
            if (this._clonedShadow) {
                this._clonedShadow.remove();
                delete this._clonedShadow;
            }

            var height = blockView.originalHeight;
            if (height) {
                setTimeout(function() {
                    if (blockView.background) {
                        blockView.background.remove();
                        blockView.nextBackground.remove();
                        delete blockView.background;
                        delete blockView.nextBackground;
                    }
                }, Entry.ANIMATION_DURATION);
                blockView.set({
                    height: height
                });
                delete blockView.originalHeight;
            }

        }
        blockView.block.thread.changeEvent.notify();
    };

    p._createEmptyBG = function() {
        var blockView = this;
        if (this.svgGroup.nextMagnet && !this.block.next) {
            var bg = this.svgGroup.rect(
                0 + blockView.offsetX,
                blockView.height,
                blockView.width,
                20
            );
            blockView.emptyBackground = bg;

            bg.attr({
                fill: 'transparent'
            });
            this.svgGroup.prepend(bg);
        } else {
            if (blockView.emptyBackground) {
                blockView.emptyBackground.remove();
                delete blockView.emptyBackground;
            }
        }
    };

    p.addDragging = function() {
        this.svgGroup.addClass('dragging');
    };

    p.removeDragging = function() {
        this.svgGroup.removeClass('dragging');
    };

    p.addSelected = function() {
        this.svgGroup.addClass('selected');
    };

    p.removeSelected = function() {
        this.svgGroup.removeClass('selected');
    };

    p.getSkeleton = function() {return this._skeleton;};

    p.getContentPos = function() {
        return this._skeleton.contentPos(this);
    };

    p.renderText = function() {
        this._startContentRender(Entry.Workspace.MODE_VIMBOARD);
    };

    p.renderBlock = function() {
        this._startContentRender(Entry.Workspace.MODE_BOARD);
    };

    p._updateOpacity = function() {
        this.svgGroup.attr({
            opacity:this.visible === false ? 0 : 1
        });
    };

    p._updateShadow = function() {
        var shadow = this.shadow;
        var fill;

        if (shadow) fill = Entry.Utils.colorDarken(this._schema.color, 0.7);
        else fill = 'transparent';

        this._darkenPath.attr({fill: fill});
    };

    p._setMovable = function() {
        this.movable = this.block.isMovable() !== null ? this.block.isMovable() :
            (this._skeleton.movable !== undefined ? this._skeleton.movable : true);
    };

    p._setReadOnly = function() {
        this.readOnly = this.block.isReadOnly() !== null ? this.block.isReadOnly() :
            (this._skeleton.readOnly !== undefined ? this._skeleton.readOnly : false);
    };

})(Entry.BlockView.prototype);
