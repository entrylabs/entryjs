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
    this._observers = [];
    this.set(block);
    this.svgGroup = board.svgBlockGroup.elem("g");

    this._schema = Entry.block[block.type];
    if (this._schema.changeEvent)
        this._schemaChangeEvent = this._schema.changeEvent.attach(
            this, this._updateSchema);
    var skeleton = this._skeleton = Entry.skeleton[this._schema.skeleton];
    this._contents = [];
    this._statements = [];
    this.magnet = {};
    this._paramMap = {};

    if (skeleton.magnets && skeleton.magnets(this).next) {
        this.svgGroup.nextMagnet = this.block;
        this._nextGroup = this.svgGroup.elem("g");
        this._observers.push(this.observe(this, "_updateMagnet", ["contentHeight"]));
    }

    this.isInBlockMenu = this.getBoard() instanceof Entry.BlockMenu;

    if (skeleton.morph)
        this._observers.push(this.block.observe(this, "_renderPath", skeleton.morph, false));

    var that = this;
    this.mouseHandler = function() {
        var events = that.block.events;
        if (events && events.mousedown)
            events.mousedown.forEach(function(fn){fn();});

        that.onMouseDown.apply(that, arguments);
    };
    this._startRender(block, mode);

    // observe
    this._observers.push(this.block.observe(this, "_setMovable", ["movable"]));
    this._observers.push(this.block.observe(this, "_setReadOnly", ["movable"]));
    this._observers.push(this.block.observe(this, "_setCopyable", ["copyable"]));
    this._observers.push(this.block.observe(this, "_updateColor", ["deletable"], false));
    this._observers.push(this.observe(this, "_updateBG", ["magneting"], false));

    this._observers.push(this.observe(this, "_updateOpacity", ["visible"], false));
    this._observers.push(this.observe(this, "_updateDisplay", ["display"], false));
    this._observers.push(this.observe(this, "_updateShadow", ["shadow"]));
    this._observers.push(this.observe(this, "_updateMagnet", ["offsetY"]));
    this._observers.push(board.code.observe(this, '_setBoard', ['board'], false));

    this.dragMode = Entry.DRAG_MODE_NONE;
    Entry.Utils.disableContextmenu(this.svgGroup.node);
    this._targetType = this._getTargetType();
    var events = block.events.whenBlockAdd;
    if (events && !this.isInBlockMenu) {
        events.forEach(function(fn) {
            if (Entry.Utils.isFunction(fn)) fn(block);
        });
    }
};

Entry.BlockView.PARAM_SPACE = 5;
Entry.BlockView.DRAG_RADIUS = 5;

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

        if (this.getBoard().patternRect) {
            $(this._path).mouseenter(function(e) {
                if (!that._mouseEnable) return;
                that._changeFill(true);
            });

            $(this._path).mouseleave(function(e) {
                if (!that._mouseEnable) return;
                that._changeFill(false);
            });
        }

        var fillColor = this._schema.color;
        if (!this.block.isDeletable())
            fillColor = Entry.Utils.colorLighten(fillColor);
        this._fillColor = fillColor;
        var pathStyle = {
            d: path,
            fill: fillColor,
            class: 'blockPath'
        };
        if (this.magnet.next) {
            var suffix = this.getBoard().suffix;
            this.pathGroup.attr({
                filter: 'url(#entryBlockShadowFilter_' + suffix + ')'
            });
        } else if (this.magnet.string || this.magnet.bool)
            pathStyle.stroke = Entry.Utils.colorDarken(this._schema.color, 0.9);

        if (skeleton.outerLine) {
            pathStyle.strokeWidth = "0.5";
        }
        this._path.attr(pathStyle);

        this._moveTo(this.x, this.y, false);
        this._startContentRender(mode);
        if (this._board.disableMouseEvent !== true)
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
                        var field = new Entry['Field' + param.type](param, this, paramIndex, mode, i);
                        this._contents.push(field);
                        this._paramMap[paramIndex] = field;
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

    p._updateSchema = function() {
        this._startContentRender();
    };

    p.changeType = function(type) {
        if (this._schemaChangeEvent)
            this._schemaChangeEvent.destroy();
        this._schema = Entry.block[type];
        if (this._schema.changeEvent)
            this._schemaChangeEvent = this._schema.changeEvent.attach(
                this, this._updateSchema);
        this._updateSchema();
    };

    p.alignContent = function(animate) {
        if (animate !== true) animate = false;
        var cursor = {x: 0, y: 0, height: 0};
        var statementIndex = 0;
        var width = 0;
        var secondLineHeight = 0;
        for (var i = 0; i < this._contents.length; i++) {
            var c = this._contents[i];

            if (c instanceof Entry.FieldLineBreak) {
                this._alignStatement(animate, statementIndex);
                c.align(statementIndex);
                statementIndex++;
                cursor.y = c.box.y;
                cursor.x = 8;
            } else {
                c.align(cursor.x, cursor.y, animate);
                // space between content
                if (i !== this._contents.length - 1)
                    cursor.x += Entry.BlockView.PARAM_SPACE;
            }

            var box = c.box;
            if (statementIndex !== 0) {
                secondLineHeight = Math.max(box.height*1000, secondLineHeight);
            } else
                cursor.height = Math.max(box.height, cursor.height);

            cursor.x += box.width;
            width = Math.max(width, cursor.x);
            this.set({
                contentWidth: width,
                contentHeight: cursor.height
            });
        }

        this.set({
            contentHeight: cursor.height + secondLineHeight
        });

        if (this._statements.length != statementIndex)
            this._alignStatement(animate, statementIndex);

        var contentPos = this.getContentPos();
        this.contentSvgGroup.attr("transform",
            "translate(" + contentPos.x + "," + contentPos.y + ")"
        );
        this.contentPos = contentPos;
        this._render();
        this._updateMagnet();
    };

    p._alignStatement = function(animate, index) {
        var positions = this._skeleton.statementPos ?
            this._skeleton.statementPos(this) : [];
        var statement = this._statements[index];
        if (!statement) return;
        var pos = positions[index];
        if (pos) statement.align(pos.x, pos.y, animate);
    };

    p._render = function() {
        this._renderPath();
        this.set(this._skeleton.box(this));

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
        if (this.visible && this.display)
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
        this._mouseEnable = true;
        $(this.svgGroup).bind(
            'mousedown.blockViewMousedown touchstart.blockViewMousedown',
            that.mouseHandler
        );
    };

    p.removeControl = function() {
        this._mouseEnable = false;
        $(this.svgGroup).unbind('.blockViewMousedown');
    };

    p.onMouseDown = function(e) {
        console.log(this.block.pointer());
        if (e.stopPropagation) e.stopPropagation();
        if (e.preventDefault) e.preventDefault();

        this._changeFill(false);
        var board = this.getBoard();
        if (Entry.documentMousedown)
            Entry.documentMousedown.notify(e);
        if (this.readOnly || board.viewOnly) return;

        board.setSelectedBlock(this);
        this.dominate();
        if (e.button === 0 || (e.originalEvent && e.originalEvent.touches)) {
            var mouseEvent;
            if (e.originalEvent && e.originalEvent.touches) {
                mouseEvent = e.originalEvent.touches[0];
            } else mouseEvent = e;

            this.mouseDownCoordinate = {
                x: mouseEvent.pageX, y: mouseEvent.pageY
            };
            var doc = $(document);
            doc.bind('mousemove.block touchmove.block', onMouseMove);
            doc.bind('mouseup.block touchend.block', onMouseUp);
            this.dragInstance = new Entry.DragInstance({
                startX: mouseEvent.pageX,
                startY: mouseEvent.pageY,
                offsetX: mouseEvent.pageX,
                offsetY: mouseEvent.pageY,
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
                enable: this.copyable,
                callback: function(){
                    board.code.createThread(block.copy());
                }
            };

            var copy = {
                text: '블록 복사',
                enable: this.copyable,
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
                    'clientX' : event.clientX,
                    'clientY' : event.clientY
                });

                document.getElementsByClassName('CodeMirror')[0].dispatchEvent(dragEnd);
            }
        }

        function onMouseMove(e) {
            e.stopPropagation();
            var workspaceMode = board.workspace.getMode();

            var mouseEvent;
            if (workspaceMode === Entry.Workspace.MODE_VIMBOARD)
                p.vimBoardEvent(e, 'dragOver');
            if (e.originalEvent && e.originalEvent.touches)
                mouseEvent = e.originalEvent.touches[0];
            else mouseEvent = e;

            var mouseDownCoordinate = blockView.mouseDownCoordinate;
            var diff = Math.sqrt(Math.pow(mouseEvent.pageX - mouseDownCoordinate.x, 2) +
                            Math.pow(mouseEvent.pageY - mouseDownCoordinate.y, 2));
            if (blockView.dragMode == Entry.DRAG_MODE_DRAG ||
                diff > Entry.BlockView.DRAG_RADIUS) {
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
                        mouseEvent.pageX - dragInstance.offsetX,
                        mouseEvent.pageY - dragInstance.offsetY,
                        false
                    );
                    dragInstance.set({
                        offsetX: mouseEvent.pageX,
                        offsetY: mouseEvent.pageY
                    });

                    Entry.GlobalSvg.position();
                    var magnetedBlock = blockView._getCloseBlock();
                    if (magnetedBlock) {
                        board.setMagnetedBlock(magnetedBlock.view);
                    } else board.setMagnetedBlock(null);
                    if (!blockView.originPos)
                        blockView.originPos = {x: blockView.x, y: blockView.y};
                } else {
                    board.cloneToGlobal(e);
                }
            }
        }

        function onMouseUp(e) {
            $(document).unbind('.block');
            blockView.terminateDrag(e);
            if (board) board.set({dragBlock: null});
            blockView._changeFill(false);
            Entry.GlobalSvg.remove();
            delete this.mouseDownCoordinate;
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
        this.removeDragging();
        this.set({visible:true});
        this.dragMode = Entry.DRAG_MODE_NONE;

        if (workspaceMode === Entry.Workspace.MODE_VIMBOARD) {
            if (board instanceof Entry.BlockMenu) {
                board.terminateDrag();
                this.vimBoardEvent(e, 'dragEnd', block);
            } else board.clear();
        } else {
            if (dragMode === Entry.DRAG_MODE_DRAG) {
                var fromBlockMenu = this.dragInstance && this.dragInstance.isNew;
                if (fromBlockMenu) {
                    var removed = board.workspace.blockMenu.terminateDrag();
                    if (!removed) {
                        block._updatePos();
                        Entry.do("addBlock", block);
                    }
                }

                var gs = Entry.GlobalSvg;
                var ripple = false;
                var prevBlock = this.block.getPrevBlock(this.block);
                var ripple = false;
                switch (Entry.GlobalSvg.terminateDrag(this)) {
                    case gs.DONE:
                        var closeBlock = this._getCloseBlock();
                        if (prevBlock && !closeBlock) {
                            Entry.do("separateBlock", block);
                        } else if (!prevBlock && !closeBlock && !fromBlockMenu) {
                            if (!block.getThread().view.isGlobal()) {
                                Entry.do("separateBlock", block);
                            } else {
                                Entry.do("moveBlock", block);
                            }
                        } else {
                            if (closeBlock) {
                                if (closeBlock.view.magnet && closeBlock.view.magnet.next) {
                                    this.bindPrev(closeBlock);
                                    if (!(closeBlock instanceof Entry.Block)) {
                                        closeBlock = closeBlock.insertTopBlock(block);
                                    } else {
                                        Entry.do("insertBlock", block, closeBlock);
                                    }
                                } else {// field block
                                    Entry.do("insertBlock", block, closeBlock);
                                }
                                createjs.Sound.play('entryMagneting');
                                ripple = true;
                            } else {
                                Entry.do("separateBlock", block);
                            }
                        }
                        break;
                    case gs.RETURN:
                        var block = this.block;
                        var originPos = this.originPos;
                        if (prevBlock) {
                            this.set({animating: false});
                            createjs.Sound.play('entryMagneting');
                            this.bindPrev(prevBlock);
                            block.insert(prevBlock);
                        } else {
                            var parent = block.getThread().view.getParent();

                            if (parent instanceof Entry.FieldStatement) {
                                this.bindPrev(parent);
                                parent.insertTopBlock(block);
                            } else if (parent instanceof Entry.FieldBlock)
                                block.replace(parent._valueBlock);
                            else this._moveTo(originPos.x, originPos.y, false);
                        }
                        break;
                    case gs.REMOVE:
                        createjs.Sound.play('entryDelete');
                        if (!fromBlockMenu) {
                            this.block.doDestroyBelow(false);
                        } else {
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
        this._destroyObservers();
        var svgGroup = this.svgGroup;

        if (animate) {
            $(svgGroup).fadeOut(100, function() {
                svgGroup.remove();
            });
        } else svgGroup.remove();

        this._contents.forEach(function(c) {
            if (c.constructor !== Entry.Block) c.destroy();
        });

        var block = this.block;
        var events = block.events.whenBlockDestroy;
        if (events && !this.isInBlockMenu)
            events.forEach(function(fn){
                if (Entry.Utils.isFunction(fn)) fn(block);
            });

        if (this._schemaChangeEvent)
            this._schemaChangeEvent.destroy();
    };

    p.getShadow = function() {
        if (!this._shadow) {
            this._shadow = Entry.SVG.createElement(
                this.svgGroup.cloneNode(true),
                { opacity: 0.5 }
            );
            this.getBoard().svgGroup.appendChild(this._shadow);
        }
        return this._shadow;
    };

    p.destroyShadow = function() {
        if (this._shadow) {
            this._shadow.remove();
            delete this._shadow;
        }
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
        var blockView = this;
        var svgGroup = blockView.svgGroup;
        if (!this.magnet.next) {// field block
            if (this.magneting) {
                svgGroup.attr({
                    filter: 'url(#entryBlockHighlightFilter_' + this.getBoard().suffix + ')'
                });
                svgGroup.addClass('outputHighlight');
            } else {
                svgGroup.removeClass('outputHighlight');
                svgGroup.removeAttr('filter');
            }
            return;
        }
        var magneting = blockView.magneting;
        var block = blockView.block;
        if (magneting) {
            var shadow = this._board.dragBlock.getShadow();
            var pos = this.getAbsoluteCoordinate();
            var magnet = this.magnet.next;
            var transform  = 'translate(' + (pos.x + magnet.x) + ',' + (pos.y + magnet.y) + ')';
            $(shadow).attr({
                transform: transform,
                display: 'block'
            });

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
                this._clonedShadow.attr({display: 'none'});
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

        if (this.visible) this._setPosition();
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

    p._setCopyable = function() {
        this.copyable = this.block.isCopyable() !== null ? this.block.isCopyable() :
            (this._skeleton.copyable !== undefined ? this._skeleton.copyable : true);
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

        if (this.display) this._setPosition();
    };

    p._updateColor = function() {
        var fillColor = this._schema.color;
        if (!this.block.isDeletable())
            fillColor = Entry.Utils.colorLighten(fillColor);
        this._path.attr({fill:fillColor});
        //update block inner images

        this._updateContents();
    };

    p._updateContents = function() {
        for (var i=0; i<this._contents.length; i++)
            this._contents[i].renderStart();
        this.alignContent(false);
    };

    p._destroyObservers = function() {
        var observers = this._observers;
        while(observers.length) {
            var o = observers.pop();
            o.destroy();
        }
    };

    p._changeFill = function(isPattern) {
        var board = this.getBoard();
        if (!board.patternRect || board.dragBlock) return;
        var path = this._path;
        var fillColor = this._fillColor;

        if (isPattern) {
            var board = this.getBoard();
            board.setPatternRectFill(fillColor);
            fillColor = "url(#blockHoverPattern_" + this.getBoard().suffix +")";
        }
        path.attr({fill:fillColor});
    };

    p.addActivated = function() {
        this.svgGroup.addClass('activated');
    };

    p.removeActivated = function() {
        this.svgGroup.removeClass('activated');
    };

    p.reDraw = function() {
        var block = this.block;
        this._updateContents();
        var params = block.params;
        if (params) {
            for (var i=0; i<params.length; i++) {
                var param = params[i];
                if (param instanceof Entry.Block) {
                    param.view.reDraw();
                }
            }
        }
        var statements = block.statements;
        if (statements) {
            for (var i=0; i<statements.length; i++) {
                var statement = statements[i];
                statement.view.reDraw();
            }
        }
    };

    p.getParam = function(index) {
        return this._paramMap[index];
    };

})(Entry.BlockView.prototype);
