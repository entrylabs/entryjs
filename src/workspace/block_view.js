/*
 *
 */
"use strict";

goog.provide("Entry.BlockView");

/*
 *
 */
Entry.BlockView = function(block, board, mode) {
    var that = this;
    Entry.Model(this, false);
    this.block = block;
    this._lazyUpdatePos = _.debounce(block._updatePos.bind(block), 200);
    this._board = board;
    this._observers = [];
    this.set(block);
    this.svgGroup = board.svgBlockGroup.elem("g");

    this._schema = Entry.skinContainer.getSkin(block);
    if (this._schema === undefined) {
        this.block.destroy(false, false);
        return;
    }

    if (this._schema.deletable)
        this.block.setDeletable(this._schema.deletable)
    if (this._schema.copyable)
        this.block.setCopyable(this._schema.copyable)
    if (this._schema.display === false)
        this.set({display: false})
    if (this._schema.changeEvent)
        this._schemaChangeEvent = this._schema.changeEvent.attach(
            this, this._updateSchema);

    var skeleton = this._skeleton = Entry.skeleton[this._schema.skeleton];
    this._contents = [];
    this._statements = [];
    this._extensions = [];
    this.magnet = {};
    this._paramMap = {};

    if (skeleton.magnets && skeleton.magnets(this).next) {
        this.svgGroup.nextMagnet = this.block;
        this._nextGroup = this.svgGroup.elem("g", {class: 'entryBlockNextGroup'});
        this._observers.push(this.observe(this, "_updateMagnet", ["contentHeight"]));
    }

    this.isInBlockMenu = this.getBoard() instanceof Entry.BlockMenu;

    this.mouseHandler = function() {
        var events = that.block.events;
        if (events && events.mousedown)
            events.mousedown.forEach(function(fn){fn(that);});

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
    var events = block.events.viewAdd;
    if (Entry.type == 'workspace' && events && !this.isInBlockMenu) {
        events.forEach(function(fn) {
            if (Entry.Utils.isFunction(fn)) fn(block);
        });
    }
};

Entry.BlockView.PARAM_SPACE = 5;
Entry.BlockView.DRAG_RADIUS = 5;
Entry.BlockView.pngMap = {};

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

        if (this._schema.css)
            this.svgGroup.attr({
                style: this._schema.css
            });

        var classes = skeleton.classes;
        if (classes && classes.length !== 0)
            classes.forEach(function(c){that.svgGroup.addClass(c);});

        var path = skeleton.path(this);

        this.pathGroup = this.svgGroup.elem("g");
        this._updateMagnet();

        this._path = this.pathGroup.elem("path");

        //enable mouse pattern only for desktou
        if (!Entry.isMobile()) {
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
        if (this.block.deletable === Entry.Block.DELETABLE_FALSE_LIGHTEN)
            fillColor = Entry.Utils.colorLighten(fillColor);
        this._fillColor = fillColor;
        var pathStyle = {
            d: path,
            fill: fillColor,
            class: 'blockPath'
        };
        if (this.magnet.next || this._skeleton.nextShadow) {
            var suffix = this.getBoard().suffix;
            this.pathGroup.attr({
                filter: 'url(#entryBlockShadowFilter_' + suffix + ')'
            });
        } else if (this.magnet.string || this.magnet.boolean)
            pathStyle.stroke = skeleton.outerLine;

        if (skeleton.outerLine) {
            pathStyle['stroke-width'] = "0.6";
        }
        this._path.attr(pathStyle);

        this._moveTo(this.x, this.y, false);
        this._startContentRender(mode);
        this._startExtension(mode)
        if (this._board.disableMouseEvent !== true) {
            this._addControl();
        }

        var guide = this.guideSvgGroup;
        guide && this.svgGroup.insertBefore(guide, this.svgGroup.firstChild);

        this.bindPrev();
    };

    p._startContentRender = function(mode) {
        mode = mode === undefined ?
            Entry.Workspace.MODE_BOARD : mode;

        var schema = this._schema;
        if (this.contentSvgGroup)
            this.contentSvgGroup.remove();
        if (this.statementSvgGroup)
            this.statementSvgGroup.remove();

        this._contents = [];

        this.contentSvgGroup = this.svgGroup.elem("g", {class:'contentsGroup'});
        if (schema.statements && schema.statements.length) {
            this.statementSvgGroup = this.svgGroup.elem("g", {
                class: 'statementGroup'
            });
        }

        switch (mode) {
            case Entry.Workspace.MODE_BOARD:
            case Entry.Workspace.MODE_OVERLAYBOARD:
                var reg = /(%\d)/mi;
                var template = schema.template ? schema.template : Lang.template[this.block.type];
                var templateParams = template.split(reg);
                var params = schema.params;
                for (var i=0; i<templateParams.length; i++) {
                    var param = templateParams[i];
                    if (param[0] === " ") param = param.substring(1);
                    if (param[param.length - 1] === " ") param = param.substring(0, param.length - 1);
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
                if (this._schema.skeleton === 'basic_button') {
                    this._startContentRender(Entry.Workspace.MODE_BOARD);
                    return;
                }

                var text = this.getBoard().workspace.getCodeToText(this.block);
                var lineBreak = false;
                var secondLineText;
                if (/(if)+(.|\n)+(else)+/.test(text)) {
                    var contents = text.split('\n');
                    text = contents.shift() + ' ' + contents.shift();

                    lineBreak = true;
                    secondLineText = contents.join(" ");
                }

                var fieldText = {text:text, color: 'white'};
                if (this.block._schema.vimModeFontColor)
                    fieldText.color = this.block._schema.vimModeFontColor;
                this._contents.push(
                    new Entry.FieldText(fieldText, this)
                );

                if (lineBreak) {
                    this._contents.push(new Entry.FieldLineBreak(null, this));
                    fieldText.text = secondLineText;
                    this._contents.push(new Entry.FieldText(fieldText, this));
                }
                break;
        }
        this.alignContent(false);
    };

    p._startExtension = function(mode) {
        this._extensions = this.block.extensions.map(function(e) {
            return new Entry['Ext' + e.type](e, this, mode);
        }.bind(this));
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
                if (i !== this._contents.length - 1 &&
                    (!(c instanceof Entry.FieldText && c._text.length == 0)))
                    cursor.x += Entry.BlockView.PARAM_SPACE;
            }

            var box = c.box;
            if (statementIndex !== 0) {
                secondLineHeight = Math.max(Math.round(box.height)*1000000, secondLineHeight);
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
        this._setBackgroundPath();
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
        if (this.display)
            this.set({ x: x, y: y });
        else
            this.set({ x: -99999, y: -99999 });
        this._lazyUpdatePos();
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

        var events = that.block.events;
        if (events && events.dblclick) {
            $(this.svgGroup).dblclick(function() {
                events.dblclick.forEach(function(fn){
                    if (fn) fn(that);});
            });
        }
    };

    p.removeControl = function() {
        this._mouseEnable = false;
        $(this.svgGroup).unbind('.blockViewMousedown');
    };

    p.onMouseDown = function(e) {
        if (e.stopPropagation) e.stopPropagation();
        if (e.preventDefault) e.preventDefault();
        var longPressTimer = null;

        var blockView = this;
        this._changeFill(false);
        var board = this.getBoard();
        if (Entry.documentMousedown)
            Entry.documentMousedown.notify(e);
        if (this.readOnly || board.viewOnly) return;

        board.setSelectedBlock(this);
        this.dominate();
        //left mousedown
        if (e.button === 0 || (e.originalEvent && e.originalEvent.touches)) {
            var eventType = e.type;
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

            if (eventType === 'touchstart') {
                longPressTimer = setTimeout(function() {
                    if (longPressTimer) {
                        longPressTimer = null;
                        onMouseUp();
                        blockView._rightClick(e);
                    }
                }, 1000);
            }
        } else if (Entry.Utils.isRightButton(e))
            this._rightClick(e);


        if(board.workspace.getMode() === Entry.Workspace.MODE_VIMBOARD) {
            if(e) {
                vimBoard = $('.entryVimBoard>.CodeMirror')[0];
                document.getElementsByClassName('CodeMirror')[0]
                    .dispatchEvent(Entry.Utils.createMouseEvent('dragStart', event));
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
                if (longPressTimer) {
                    clearTimeout(longPressTimer);
                    longPressTimer = null;
                }
                if (!blockView.movable) return;

                if (!blockView.isInBlockMenu) {
                    var isFirst = false;
                    if (blockView.dragMode != Entry.DRAG_MODE_DRAG) {
                        blockView._toGlobalCoordinate();
                        blockView.dragMode = Entry.DRAG_MODE_DRAG;
                        blockView.block.getThread().changeEvent.notify();
                        Entry.GlobalSvg.setView(blockView, workspaceMode);
                        isFirst = true;
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
                    if (!blockView.originPos)
                        blockView.originPos = {x: blockView.x, y: blockView.y};
                    if (isFirst)
                        board.generateCodeMagnetMap();
                    blockView._updateCloseBlock();
                } else {
                    board.cloneToGlobal(e);
                }
            }
        }

        function onMouseUp(e) {
            if (longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }
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
            var dragEvent = Entry.Utils.createMouseEvent(type, event);

            if (block) dragEvent.block = block;

            var _vimBoard =
                document.getElementsByClassName('CodeMirror')[0];
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
                var gs = Entry.GlobalSvg;
                var ripple = false;
                var prevBlock = this.block.getPrevBlock(this.block);
                switch (gs.terminateDrag(this)) {
                    case gs.DONE:
                        var closeBlock = board.magnetedBlockView;
                        if (closeBlock instanceof Entry.BlockView)
                            closeBlock = closeBlock.block;
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
                                if (closeBlock.view.magneting === "next") {
                                    var lastBlock = block.getLastBlock();
                                    this.dragMode = dragMode;
                                    board.separate(block);
                                    this.dragMode = Entry.DRAG_MODE_NONE;
                                    Entry.do("insertBlock", closeBlock, lastBlock).isPass(fromBlockMenu);
                                    Entry.ConnectionRipple
                                        .setView(closeBlock.view)
                                        .dispose();
                                } else {
                                    Entry.do("insertBlock", block, closeBlock).isPass(fromBlockMenu);
                                    ripple = true;
                                }
                                createjs.Sound.play('entryMagneting');
                            } else {
                                Entry.do("moveBlock", block).isPass(fromBlockMenu);
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

                            if (!(parent instanceof Entry.Board)) {
                                createjs.Sound.play('entryMagneting');
                                Entry.do("insertBlock", block, parent);
                            } else this._moveTo(originPos.x, originPos.y, false);
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
        this.dominate();
        return;
    };

    p._updateCloseBlock = function() {
        var board = this.getBoard(),
            closeBlock;
        if (!this._skeleton.magnets) return;
        for (var type in this.magnet) {
            var magnet = this.magnet[type];
            if (type === "next") {
                closeBlock = this.getBoard().getNearestMagnet(
                    this.x, this.y + this.getBelowHeight(), type);
            } else {
                closeBlock = this.getBoard().getNearestMagnet(
                    this.x, this.y, type);
            }
            if (closeBlock)
                return board.setMagnetedBlock(closeBlock.view, type);
        }
        board.setMagnetedBlock(null);
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
        $(this.svgGroup).unbind('.blockViewMousedown');
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

        this._statements.forEach(function(s) {
            s.destroy();
        });

        var block = this.block;
        var events = block.events.viewDestroy;
        if (Entry.type == 'workspace' && events && !this.isInBlockMenu)
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
        if (!(this.magnet.next || this.magnet.previous)) {// field block
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
            var magnet, transform;
            if (magneting === "previous") {
                magnet = this.magnet.next;
                transform  = 'translate(' + (pos.x + magnet.x) + ',' + (pos.y + magnet.y) + ')';
            } else if (magneting === "next") {
                magnet = this.magnet.previous;
                var dragHeight = this._board.dragBlock.getBelowHeight();
                transform  = 'translate(' + (pos.x + magnet.x) + ',' + (pos.y + magnet.y - dragHeight) + ')';
            }
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

            if (magneting === "previous") {
                var height = this._board.dragBlock.getBelowHeight() + this.offsetY;

                blockView.originalHeight = blockView.offsetY;
                blockView.set({
                    offsetY: height,
                });
            }
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

    p.bindPrev = function(prevBlock, isDestroy) {
        if (prevBlock) {
            this._toLocalCoordinate(prevBlock.view._nextGroup);
            var nextBlock = prevBlock.getNextBlock();
            if (nextBlock)
            if (nextBlock && nextBlock !== this.block) {
                var endBlock = this.block.getLastBlock();
                if (isDestroy)
                    nextBlock.view._toLocalCoordinate(prevBlock.view._nextGroup);
                else if (endBlock.view.magnet.next)
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
        if (this.block.deletable === Entry.Block.DELETABLE_FALSE_LIGHTEN)
            fillColor = Entry.Utils.colorLighten(fillColor);
        this._fillColor = fillColor;
        this._path.attr({fill:fillColor});
        this._updateContents();
    };

    p._updateContents = function() {
        this._contents.forEach(function(c) {
            c.renderStart();
        }.bind(this));
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
        if (board.dragBlock) return;
        var fillColor = this._fillColor;
        var path = this._path;

        var board = this.getBoard();
        if (isPattern) {
            fillColor = "url(#blockHoverPattern_" + this.getBoard().suffix +")";
            board.enablePattern();
        } else board.disablePattern();
        path.attr({fill:fillColor});
    };

    p.addActivated = function() {
        this.svgGroup.addClass('activated');
    };

    p.removeActivated = function() {
        this.svgGroup.removeClass('activated');
    };

    p.reDraw = function() {
        if (!(this.visible && this.display))
            return;

        var block = this.block;
        this._updateContents();
        var statements = block.statements;
        if (statements) {
            for (var i=0; i<statements.length; i++) {
                var statement = statements[i];
                statement.view.reDraw();
            }
        }
        var extensions = this._extensions;
        if (extensions) {
            for (var i=0; i<extensions.length; i++) {
                var ext = extensions[i];
                ext.updatePos && ext.updatePos();
            }
        }
    };

    p.getParam = function(index) { return this._paramMap[index]; };


    p.getDataUrl = function(notClone, notPng) {
        var deferred = $.Deferred();
        var svgData = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %W %H">(svgGroup)(defs)</svg>';
        var bBox = this.svgGroup.getBoundingClientRect();
        var svgGroup = notClone ? this.svgGroup : this.svgGroup.cloneNode(true);
        var box = this._skeleton.box(this)
        var scale = notPng ? 1 : 1.5;
        var fontWeight = isWindow7() ? 0.9 : 0.95;
        if (this.type.indexOf('func_') > -1)
            fontWeight *= 0.99;
        svgGroup.setAttribute(
            'transform',
            'scale(%SCALE) translate(%X,%Y)'
                .replace('%X', -box.offsetX)
                .replace('%Y', -box.offsetY)
                .replace('%SCALE', scale)
        );

        var defs = this.getBoard().svgDom.find('defs');

        var images = svgGroup.getElementsByTagName('image');
        var texts = svgGroup.getElementsByTagName('text');

        var fontFamily =  "'nanumBarunRegular', 'NanumGothic', '나눔고딕','NanumGothicWeb', '맑은 고딕', 'Malgun Gothic', Dotum";
        var boldTypes = ['≥', '≤'];
        var notResizeTypes = ['≥', '≤', '-', '>', '<', '=', '+', '-', 'x', '/'];

        for (var i=0; i<texts.length; i++) {
            (function (text) {
                text.setAttribute('font-family', fontFamily);
                var size = parseInt(text.getAttribute('font-size'));
                var content = $(text).text();
                if (boldTypes.indexOf(content) > -1) {
                    text.setAttribute('font-weight', '500');
                }

                if (content == 'q') {
                    var y = parseInt(text.getAttribute('y'));
                    text.setAttribute('y', y-1);
                }

                if (notResizeTypes.indexOf(content) > -1)
                    text.setAttribute('font-size', (size) + 'px');
                else
                    text.setAttribute('font-size', (size * fontWeight) + 'px');
                text.setAttribute('alignment-baseline', 'baseline');
            })(texts[i]);
        }

        var counts = 0;
        if (images.length === 0) processSvg();
        else {
            for (var i=0; i<images.length; i++) {
                var img = images[i];
                (function (img) {
                    var href = img.getAttribute('href');
                    loadImage(href, img.getAttribute('width'), img.getAttribute('height'))
                        .then(function(src) {
                            img.setAttribute('href', src)
                            if (++counts == images.length) return processSvg();
                        });
                })(img);
            }
        }
        return deferred.promise();

        function processSvg() {
            svgData = svgData
                        .replace('(svgGroup)', new XMLSerializer().serializeToString( svgGroup ))
                        .replace('%W', bBox.width * scale)
                        .replace('%H', bBox.height * scale)
                        .replace('(defs)', new XMLSerializer().serializeToString( defs[0] ))
                        .replace(/>\s+/g, ">").replace(/\s+</g, "<");
            var src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
            svgData = null;
            if (notPng) {
                deferred.resolve({
                    src: src,
                    width: bBox.width,
                    height: bBox.height
                });
                svgGroup = null;
            } else {
                loadImage( src, bBox.width, bBox.height, 1.5)
                    .then(function(src) {
                        svgGroup = null;
                        deferred.resolve({
                            src: src,
                            width: bBox.width,
                            height: bBox.height
                        });
                }, function(err) {
                    deferred.reject('error occured');
                });
            }
            src = null;
        }

        function loadImage(src, width, height, multiplier) {
            var deferred = $.Deferred();
            if (!multiplier) multiplier = 1;
            if (Entry.BlockView.pngMap[src] !== undefined)
                deferred.resolve(Entry.BlockView.pngMap[src]);

            width *= multiplier;
            height *= multiplier;
            //float point cropped
            width = Math.ceil(width);
            height = Math.ceil(height);

            var img = document.createElement( "img" );
            img.crossOrigin = 'Anonymous';
            var canvas = document.createElement( "canvas" );

            canvas.width = width;
            canvas.height = height;
            var ctx = canvas.getContext( "2d" );

            img.onload = function() {
                ctx.drawImage(img, 0, 0, width, height);
                var data = canvas.toDataURL( "image/png" );
                if (/\.png$/.test(src))
                    Entry.BlockView.pngMap[src] = data;
                deferred.resolve(data);
            };

            img.onerror = function() {
                deferred.reject('error occured');
            };
            img.src = src;
            return deferred.promise();
        }

        function isWindow7() {
            var platform = window.platform;
            if (platform && platform.name.toLowerCase() === 'windows' &&
                    platform.version[0] === '7') {
                return true;
            }
            return false;
        }
    };

    p.downloadAsImage = function(i) {
        this.getDataUrl().then(function(data) {
            var download = document.createElement('a');
            download.href = data.src;
            var name = '엔트리 블록';
            if (i)
                name += i;
            download.download = name+'.png';
            download.click();
        });
    };

    p._rightClick = function(e) {
        var disposeEvent = Entry.disposeEvent;
        if (disposeEvent)
            disposeEvent.notify(e);
        var that = this;
        var block = that.block;
        if (this.isInBlockMenu) return;

        var options = [];

        var copyAndPaste = {
            text: Lang.Blocks.Duplication_option,
            enable: this.copyable,
            callback: function(){
                Entry.do("cloneBlock", block);
            }
        };

        var copy = {
            text: Lang.Blocks.CONTEXT_COPY_option,
            enable: this.copyable,
            callback: function(){
                that.block.copyToClipboard();
            }
        };

        var remove = {
            text: Lang.Blocks.Delete_Blocks,
            enable: block.isDeletable(),
            callback: function(){
                Entry.do("destroyBlock", that.block);
            }
        };

        var download = {
            text: Lang.Menus.save_as_image,
            callback: function(){
                that.downloadAsImage();
            }
        };

        options.push(copyAndPaste);
        options.push(copy);
        options.push(remove);

        if (Entry.Utils.isChrome() && Entry.type == 'workspace' && !Entry.isMobile())
            options.push(download);

        if (e.originalEvent && e.originalEvent.touches)
            e = e.originalEvent.touches[0];

        Entry.ContextMenu.show(options, null,
            { x: e.clientX, y: e.clientY }
        );
    };

    p.clone = function() {
        return this.svgGroup.cloneNode(true);
    };

    p._setBackgroundPath = function() {
        this._backgroundPath && $(this._backgroundPath).remove();

        var backgroundPath = this._path.cloneNode(true);
        backgroundPath.setAttribute('class', 'blockBackgroundPath');
        backgroundPath.setAttribute('fill', this._fillColor);

        this._backgroundPath = backgroundPath;
        this.pathGroup.insertBefore(backgroundPath, this._path);
    };

})(Entry.BlockView.prototype);
