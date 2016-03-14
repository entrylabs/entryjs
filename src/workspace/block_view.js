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
    this.svgGroup = board.svgBlockGroup.elem("g");

    this._schema = Entry.block[block.type];
    var skeleton = this._skeleton = Entry.skeleton[this._schema.skeleton];
    this._contents = [];
    this._statements = [];
    this.magnet = {};

    if (skeleton.magnets && skeleton.magnets(this).next) {
        this.svgGroup.nextMagnet = this.block;
        this._nextGroup = this.svgGroup.elem("g");
        this.observe(this, "_updateMagnet", ["contentHeight"]);
    }

    this.isInBlockMenu = this.getBoard() instanceof Entry.BlockMenu;

    if (skeleton.morph)
        this.block.observe(this, "_renderPath", skeleton.morph, false);

    var that = this;
    this.mouseHandler = function() {
        var events = that.block.events;
        if (events && events.mousedown)
            events.mousedown.forEach(function(fn){fn();});

        that.onMouseDown.apply(that, arguments);
    };
    this._startRender(block, mode);

    // observe
    this.block.observe(this, "_setMovable", ["movable"]);
    this.block.observe(this, "_setReadOnly", ["movable"]);
    this.observe(this, "_updateBG", ["magneting"], false);

    this.observe(this, "_updateOpacity", ["visible"], false);
    this.observe(this, "_updateDisplay", ["display"], false);
    this.observe(this, "_updateShadow", ["shadow"]);
    this.observe(this, "_updateMagnet", ["offsetY"]);
    board.code.observe(this, '_setBoard', ['board'], false);

    this.dragMode = Entry.DRAG_MODE_NONE;
    Entry.Utils.disableContextmenu(this.svgGroup.node);
    this._targetType = this._getTargetType();
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
        shadow: true,
        display: true
    };

    p._startRender = function(block, mode) {
        var that = this;
        var skeleton = this._skeleton;
        this.svgGroup.attr({
            class: "block"
        });

        var classes = skeleton.classes;
        if (classes && classes.length !== 0)
            classes.forEach(function(c){that.svgGroup.addClass(c);});

        var path = skeleton.path(this);

        this.pathGroup = this.svgGroup.elem("g");
        this._updateMagnet();

        this._path = this.pathGroup.elem("path");
        var fillColor = this._schema.color;
        if (!this.block.isDeletable())
            fillColor = Entry.Utils.colorLighten(fillColor);
        var pathStyle = {
            d: path,
            fill: fillColor,
            class: 'blockPath'
        };
        if (this.magnet.next)
            this.pathGroup.attr({
                filter: 'url(#entryBlockShadowFilter)'
            });
        else if (this.magnet.string || this.magnet.bool)
            pathStyle.stroke = Entry.Utils.colorDarken(this._schema.color, 0.9);

        if (skeleton.outerLine) {
            pathStyle.strokeWidth = "0.5";
        }
        this._path.attr(pathStyle);

        this._moveTo(this.x, this.y, false);
        this._startContentRender(mode);
        this._addControl();

        this.bindPrev();
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

        this.contentSvgGroup = this.svgGroup.elem("g");
        if (schema.statements && schema.statements.length)
            this.statementSvgGroup = this.svgGroup.elem("g");
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
                            new Entry['Field' + param.type](param, this, paramIndex, mode)
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
            cursor.height = Math.max(box.height, cursor.height);
            cursor.x += box.width;
        }

        this.set({
            contentWidth: cursor.x,
            contentHeight: cursor.height
        });

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

        var contentPos = this.getContentPos();
        this.contentSvgGroup.attr("transform",
            "translate(" + contentPos.x + "," + contentPos.y + ")"
        );
        this.contentPos = contentPos;
        this._render();
        this._updateMagnet();
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
                that._path.animate({
                    d: path
                }, Entry.ANIMATION_DURATION, mina.easeinout);
            }, 0);
        } else {
            this._path.attr({
                d: path
            });

            this.set({animating: false});
        }
    };

    p._setPosition = function(animate) {
        animate = animate === undefined ? true : animate;
        //this.svgGroup.stop();
        var transform = "translate(" +
            (this.x) + "," +
            (this.y) + ")";
        if (animate && Entry.ANIMATION_DURATION !== 0) {
            this.svgGroup.attr(
                "transform", transform
            );
            /*
            this.svgGroup.animate({
                transform: transform
            }, Entry.ANIMATION_DURATION, mina.easeinout);
            */
        } else {
            this.svgGroup.attr(
                "transform", transform
            );
        }
    };

    p._toLocalCoordinate = function(parentSvgGroup) {
        this._moveTo(0, 0, false);
        parentSvgGroup.appendChild(this.svgGroup);
    };

    p._toGlobalCoordinate = function(dragMode) {
        var pos = this.getAbsoluteCoordinate(dragMode);
        this._moveTo(pos.x, pos.y, false);
        this.getBoard().svgBlockGroup.appendChild(this.svgGroup);
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
        $(this.svgGroup).mousedown(function() {
            that.mouseHandler.apply(that, arguments);
        });
        $(this.svgGroup).bind('touchstart', function() {
            that.mouseHandler.apply(that, arguments);
        });
    };

    p.removeControl = function() {
        this.svgGroup.removeEventListener('mousedown', this.mouseHandler, false);
    };

    p.onMouseDown = function(e) {
        if (e instanceof Touch) {
            e.button = 0;
        } else {
            e.stopPropagation();
            e.preventDefault();
        }
        var board = this.getBoard();
        if (Entry.documentMousedown)
            Entry.documentMousedown.notify();
        if (this.readOnly || board.viewOnly) return;

        board.setSelectedBlock(this);
        this.dominate();
        if (e.button === 0 || e.originalEvent instanceof TouchEvent) {
            if (e.originalEvent && e.originalEvent.touches)
                e = e.originalEvent.touches[0];
            this.mouseDownCoordinate = {
                x: e.pageX, y: e.pageY
            };
            var doc = $(document);
            doc.bind('mousemove.block', onMouseMove);
            doc.bind('mouseup.block', onMouseUp);
            doc.bind('touchmove.block', onMouseMove);
            doc.bind('touchend.block', onMouseUp);
            this.dragInstance = new Entry.DragInstance({
                startX: e.pageX,
                startY: e.pageY,
                offsetX: e.pageX,
                offsetY: e.pageY,
                height: 0,
                mode: true
            });
            board.set({dragBlock:this});
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
                    that.block.doDestroy(true);
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
            if (e.originalEvent.touches)
                e = e.originalEvent.touches[0];

            var mouseDownCoordinate = blockView.mouseDownCoordinate;
            if (blockView.dragMode == Entry.DRAG_MODE_DRAG ||
                e.pageX !== mouseDownCoordinate.x ||
                e.pageY !== mouseDownCoordinate.y) {
                if (!blockView.movable) return;

                if (!blockView.isInBlockMenu) {
                    if (blockView.dragMode != Entry.DRAG_MODE_DRAG) {
                        blockView._toGlobalCoordinate();
                        blockView.dragMode = Entry.DRAG_MODE_DRAG;
                        blockView.block.getThread().changeEvent.notify();
                        Entry.GlobalSvg.setView(blockView, workspaceMode);
                    }

                    if (this.animating)
                        this.set({animating: false});

                    if (blockView.dragInstance.height === 0) {
                        var block = blockView.block;
                        var height = - 1 + blockView.height;
                        blockView.dragInstance.set({
                            height: height
                        });
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

                    Entry.GlobalSvg.position();
                    var magnetedBlock = blockView._getCloseBlock();
                    if (magnetedBlock) {
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
        this.set({visible:true});
        this.removeDragging();
        this.dragMode = Entry.DRAG_MODE_NONE;

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
                    if (!removed) {
                        block._updatePos();
                        block.doAdd();
                    }
                }

                var gs = Entry.GlobalSvg;
                var ripple = false;
                var prevBlock = this.block.getPrevBlock(this.block);
                var ripple = false;
                switch (Entry.GlobalSvg.terminateDrag(this)) {
                    case gs.DONE:
                        var closeBlock = this._getCloseBlock();
                        if (!prevBlock && !closeBlock) {
                            if (!block.getThread().view.isGlobal()) {
                                this._toGlobalCoordinate(dragMode);
                                block.doSeparate();
                            } else if (dragMode == Entry.DRAG_MODE_DRAG && !fromBlockMenu)
                                block.doMove();
                        } else {
                            if (closeBlock) {
                                if (closeBlock.view.magnet.next) {
                                    this.bindPrev(closeBlock);
                                    if (!(closeBlock instanceof Entry.Block)) {
                                        closeBlock = closeBlock.insertTopBlock(block);
                                    } else block.doInsert(closeBlock);
                                } else {// field block
                                    block.doInsert(closeBlock, true);
                                }
                                createjs.Sound.play('entryMagneting');
                                ripple = true;
                            } else {
                                this._toGlobalCoordinate(dragMode);
                                block.doSeparate();
                            }
                        }
                        break;
                    case gs.RETURN:
                        //TODO retrn block to origin position
                        var block = this.block;

                        var originPos = this.originPos;
                        if (prevBlock) {
                            this.set({animating: false});
                            createjs.Sound.play('entryMagneting');
                            block.view.bindPrev(prevBlock);
                        } else this._moveTo(originPos.x, originPos.y, false);
                        break;
                    case gs.REMOVE:
                        createjs.Sound.play('entryDelete');
                        if (!fromBlockMenu) {
                            if (prevBlock) block.doSeparate();
                            this.block.doDestroyBelow(false);
                        } else {
                            if (prevBlock) block.separate();
                            this.block.destroy(false, true);
                        }
                        break;
                }
                board.setMagnetedBlock(null);
                if (ripple) {
                    Entry.ConnectionRipple
                        .setView(block.view)
                        .dispose();
                }
            }
        }

        this.destroyShadow();
        delete this.originPos;
        return;
    };

    p._getCloseBlock = function() {
        if (!this._skeleton.magnets) return;
        var targetType = this._targetType;
        if (!targetType) return;
        return this.getBoard().getNearestMagnet(this.x, this.y, targetType);
    };

    p.dominate = function() {
        var threadView = this.block.getThread().view;
        threadView.dominate();
    };

    p.getSvgRoot = function() {
        var svgBlockGroup = this.getBoard().svgBlockGroup;
        var node = this.svgGroup;
        while (node.parentNode !== svgBlockGroup)
            node = node.parentNode;
        return node;
    };

    p.getBoard = function() {return this._board;};

    p._setBoard = function() {
        this._board = this._board.code.board;
    };

    p.destroy = function(animate) {
        var svgGroup = this.svgGroup;

        if (animate) {
            $(svgGroup).velocity(
                {opacity:0},
                {
                    duration:100,
                    complete: function() {
                        svgGroup.remove();
                    }
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
            this._shadow = Entry.SVG.createElement(
                this.svgGroup.cloneNode(true),
                { opacity: 0.5 }
            );
        }
        return this._shadow;
    };

    p.destroyShadow = function() {
        delete this._shadow;
    };

    p._updateMagnet = function() {
        if (!this._skeleton.magnets) return;
        var magnet = this._skeleton.magnets(this);
        if (magnet.next)
            this._nextGroup.attr(
                "transform", "translate(" + magnet.next.x + ',' + magnet.next.y + ")"
            );
        this.magnet = magnet;
        this.block.getThread().changeEvent.notify();
    };

    p._updateBG = function() {
        if (!this._board.dragBlock || !this._board.dragBlock.dragInstance)
            return;
        if (!this.magnet.next) {// field block
            if (this.magneting)
                this.svgGroup.attr({
                    filter: 'url(#entryBlockHighlightFilter)'
                });
            else
                this.svgGroup.attr({
                    filter: 'initial'
                });
            return;
        }
        var blockView = this;
        var magneting = blockView.magneting;
        var block = blockView.block;
        var svgGroup = blockView.svgGroup;
        if (magneting) {
            var shadow = this._board.dragBlock.getShadow();
            $(shadow).attr({
                 transform: 'translate(0,' + (this.height + 1) + ')'
            });
            this.svgGroup.appendChild(shadow);
            this._clonedShadow = shadow;

            if (blockView.background) {
                blockView.background.remove();
                blockView.nextBackground.remove();
                delete blockView.background;
                delete blockView.nextBackground;
            }
            var height = this._board.dragBlock.getBelowHeight() + this.offsetY;

            blockView.originalHeight = blockView.offsetY;
            blockView.set({
                offsetY: height,
            });
        } else {
            if (this._clonedShadow) {
                this._clonedShadow.remove();
                delete this._clonedShadow;
            }

            var height = blockView.originalHeight;
            if (height !== undefined) {
                if (blockView.background) {
                    blockView.background.remove();
                    blockView.nextBackground.remove();
                    delete blockView.background;
                    delete blockView.nextBackground;
                }
                blockView.set({
                    offsetY: height
                });
                delete blockView.originalHeight;
            }
        }
        var changeEvent = blockView.block.thread.changeEvent;
        if (changeEvent) changeEvent.notify();
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
    };

    p._setMovable = function() {
        this.movable = this.block.isMovable() !== null ? this.block.isMovable() :
            (this._skeleton.movable !== undefined ? this._skeleton.movable : true);
    };

    p._setReadOnly = function() {
        this.readOnly = this.block.isReadOnly() !== null ? this.block.isReadOnly() :
            (this._skeleton.readOnly !== undefined ? this._skeleton.readOnly : false);
    };

    p.bumpAway = function(distance, delay) {
        var that = this;
        distance = distance || 15;
        if (delay) {
            window.setTimeout(function() {
                that._moveBy(distance, distance, false);
            }, delay);
        } else that._moveBy(distance, distance, false);
    };

    p.bindPrev = function(prevBlock) {
        if (prevBlock) {
            this._toLocalCoordinate(prevBlock.view._nextGroup);
            var nextBlock = prevBlock.getNextBlock();
            if (nextBlock && nextBlock !== this.block) {
                var endBlock = this.block.getLastBlock();
                if (endBlock.view.magnet.next)
                    nextBlock.view._toLocalCoordinate(endBlock.view._nextGroup);
                else {
                    nextBlock.view._toGlobalCoordinate();
                    nextBlock.separate();
                    nextBlock.view.bumpAway(null, 100);
                }
            }
        } else {
            prevBlock = this.block.getPrevBlock();
            if (prevBlock) {
                var prevBlockView = prevBlock.view;

                this._toLocalCoordinate(prevBlockView._nextGroup);
                var nextBlock = this.block.getNextBlock();
                if (nextBlock && nextBlock.view)
                    nextBlock.view._toLocalCoordinate(this._nextGroup);
            }
        }
    };

    p.getAbsoluteCoordinate = function(dragMode) {
        dragMode = dragMode !== undefined ? dragMode : this.dragMode;
        if (dragMode === Entry.DRAG_MODE_DRAG)
            return {x: this.x, y: this.y};
        var threadView = this.block.getThread().view;
        var pos = threadView.requestAbsoluteCoordinate(this);
        pos.x += this.x;
        pos.y += this.y;
        return pos;
    };

    p._getTargetType = function() {
        var targetType = this._skeleton.magnets ? this._skeleton.magnets(this) : {};

        if (targetType.previous) targetType = 'nextMagnet';
        else if (targetType.string) targetType = 'stringMagnet';
        else if (targetType.bool) targetType = 'booleanMagnet';
        else if (targetType.param) targetType = 'paramMagnet';
        else targetType = null;

        return targetType;
    };

    p.getBelowHeight = function() {
        var threadView = this.block.getThread().view;
        return threadView.requestPartHeight(this);
    };

    p._updateDisplay = function() {
        this.svgGroup.attr({
            display:this.display === false ? 'none' : 'block'
        });
    };

})(Entry.BlockView.prototype);
