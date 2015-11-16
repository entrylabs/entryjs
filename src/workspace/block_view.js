/*
 *
 */
"use strict";

goog.provide("Entry.BlockView");

/*
 *
 */
Entry.BlockView = function(block, board) {
    Entry.Model(this, false);
    this.block = block;
    this._board = board;
    this.set(block);
    this.svgGroup = board.svgBlockGroup.group();
    this.svgGroup.block = this.block;

    this._schema = Entry.block[block.type];
    this._skeleton = Entry.skeleton[this._schema.skeleton];
    this._contents = [];

    if (this._skeleton.morph) {
        this.block.observe(this, "_renderPath", this._skeleton.morph, false);
    }

    this.prevObserver = null;
    this.prevAnimatingObserver = null;

    this._startRender(block);

    // observe
    this.block.observe(this, "_bindPrev", ["prev"]);
    this.observe(this, "_updateBG", ["magneting"]);

    this.dragMode = Entry.DRAG_MODE_NONE;
};

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
        animating: false
    };

    p._startRender = function(block) {
        this.svgGroup.attr({
            class: "block"
        });

        var path = this._skeleton.path(this);

        this._darkenPath = this.svgGroup.path(path);
        this._darkenPath.attr({
            transform: "t0 1",
            fill: Entry.Utils.colorDarken(this._schema.color)
        });

        this._path = this.svgGroup.path(path);
        this._path.attr({
            fill: this._schema.color
        });

        this._moveTo(this.x, this.y, false);
        this._startContentRender();
        this._addControl();
    };

    p._startContentRender = function() {
        this.contentSvgGroup = this.svgGroup.group();
        var contentPos = this._skeleton.contentPos();
        this.contentSvgGroup.transform("t" + contentPos.x + ' ' + contentPos.y);

        var contents = this._schema.contents;
        for (var i = 0; i < contents.length; i++) {
            var content = contents[i];
            if (typeof content === "string")
                this._contents.push(new Entry.FieldText(content, this));
            else
                this._contents.push(
                    new Entry['Field' + content.type](content, this)
                );
        }
        this._alignContent(false);
    };

    p._alignContent = function(animate) {
        if (animate !== true) animate = false;
        var cursor = {x: 0, y: 0, height: 0};
        for (var i = 0; i < this._contents.length; i++) {
            var c = this._contents[i];
            c.align(cursor.x, cursor.y, animate);

            // space between content
            if (i !== this._contents.length - 1)
                cursor.x += 5;

            var box = c.box;
            cursor.height = Math.max(box.y + box.height);
            cursor.x += box.width;
        }

        this.set({
            contentWidth: cursor.x,
            contentHeight: cursor.height
        });
        this._render();
    };

    p._bindPrev = function() {
        if (this.prevObserver) this.prevObserver.destroy();
        if (this.prevAnimatingObserver) this.prevAnimatingObserver.destroy();
        if (this.block.prev) {
            this._toLocalCoordinate(this.block.prev.view.svgGroup);
            var prevView = this.block.prev.view;
            this.prevAnimatingObserver = prevView.observe(
                this, "_inheritAnimate", ["animating"]
            );
            this.prevObserver = prevView.observe(
                this, "_align", ["height"]
            );
        } else {
            this._toGlobalCoordinate();
            delete this.prevObserver;
            delete this.prevAnimatingObserver;
        }
    };

    p._render = function() {
        this._renderPath();
        this.set(this._skeleton.box(this));
    };

    p._renderPath = function() {
        var path = this._skeleton.path(this);
        var that = this;

        if (Entry.ANIMATION_DURATION !== 0) {
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
            this.svgGroup.attr({
                transform: transform
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
            that.onMouseDown.apply(that, arguments);
        });
    };

    p.onMouseDown = function(e) {
        if (e.button === 0 || e instanceof Touch) {
            this.dominate();
            var doc = $(document);
            doc.bind('mousemove.block', onMouseMove);
            doc.bind('mouseup.block', onMouseUp);
            doc.bind('touchmove.block', onMouseMove);
            doc.bind('touchend.block', onMouseUp);
            this.getBoard().set({dragBlock:this});
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
        }

        var blockView = this;
        var board = this.getBoard();
        function onMouseMove(e) {
            e.stopPropagation();
            e.preventDefault();
            if (!blockView.block.isMovable()) return;

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

            var magnetedBlock = blockView._getCloseBlock();
            if (magnetedBlock) {
                board = magnetedBlock.view.getBoard();
                board.setMagnetedBlock(magnetedBlock.view);
            } else {
                board.setMagnetedBlock(null);
            }
        }

        function onMouseUp(e) {
            $(document).unbind('.block');
            blockView.terminateDrag();
            if (board) board.set({dragBlock: null});
            delete blockView.dragInstance;
        }
        e.stopPropagation();
    };

    p.terminateDrag = function() {
        var board = this.getBoard();
        var dragMode = this.dragMode;
        var block = this.block;
        this.removeDragging();
        this.dragMode = Entry.DRAG_MODE_NONE;
        if (board instanceof Entry.BlockMenu) {
            board.terminateDrag();
        } else {
            var distance = Math.sqrt(
                Math.pow(this.dragInstance.startX - this.dragInstance.offsetX, 2) +
                Math.pow(this.dragInstance.startY - this.dragInstance.offsetY, 2)
            );
            if (distance < 30) {
                if (this.dragInstance.prev) {
                    this.dragInstance.prev.setNext(this.block);
                    this.block.setPrev(this.dragInstance.prev)
                    this.block.thread.changeEvent.notify();
                }
                board.setMagnetedBlock(null);
                return;
            }
            if (!this.dragInstance) {
                block.doAdd();
            }
            var prevBlock = this.dragInstance && this.dragInstance.prev;
            var closeBlock = this._getCloseBlock();
            if (!prevBlock && !closeBlock) {
                if (dragMode == Entry.DRAG_MODE_DRAG)
                    block.doMove();
            } else {
                if (closeBlock) {
                    this.set({animating: true});
                    block.doInsert(closeBlock);
                } else block.doSeparate();
            }
            board.setMagnetedBlock(null);
        }

        return;
    };

    p._getCloseBlock = function() {
        var board = this.getBoard();
        var isInBlockMenu = board instanceof Entry.BlockMenu;
        var x = this.x,
            y = this.y;

        if (isInBlockMenu)
            x -= board._svgWidth;

        var targetElement = Snap.getElementByPoint(
                x + 690, y + 130
            );
        if (targetElement === null) return;

        var targetBlock = targetElement.block;

        while (!targetBlock &&
               targetElement.type !== "svg" &&
               targetElement.type !== "BODY") {
            targetElement = targetElement.parent();
            targetBlock = targetElement.block;
        }
        if (targetBlock === undefined) return null;
        if (targetBlock === this.block) return null;
        if (isInBlockMenu) return targetBlock;
        return targetBlock.view.getBoard() ==
            board ? targetBlock : null;
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

            svgGroup.prepend(nextBg);
            nextBg.attr({
                fill: 'transparent'
            });

            var bg = svgGroup.rect(
                0 - blockView.width/2,
                0,
                blockView.width,
                height
            );
            blockView.background = bg;

            svgGroup.prepend(bg);
            bg.attr({
                fill: 'transparent'
            });

            blockView.originalHeight = blockView.height;
            blockView.set({
                height: height
            });
        } else {
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

    p.addDragging = function() {
        this.svgGroup.addClass('dragging');
    };

    p.removeDragging = function() {
        this.svgGroup.removeClass('dragging');
    };

})(Entry.BlockView.prototype);
