/*
 *
 */
"use strict";

goog.provide("Entry.Block");

goog.require('Entry.Utils');
goog.require('Entry.Model');
goog.require("Entry.BoxModel");
goog.require("Entry.skeleton");

/*
 *
 */
Entry.Block = function(block, thread) {
    Entry.Model(this, false);

    this.thread = thread;
    this._board = null;

    // block information
    this._schema = Entry.block[block.blockType];
    this._skeleton = Entry.skeleton[this._schema.skeleton];

    this.observe(this, "setThread", ['thread']);

    // Block model
    this.set({ x: block.x, y: block.y });
    this.observe(this, "measureSize", ['contentWidth', 'contentHeight']);
    this.observe(this, "render", ['contentWidth', 'contentHeight']);

    this.observe(this, "applyMagnet", ['magneting']);

    // content objects
    this._contents = [];
    this.magnets = {};

    // SVG Element
    this.svgGroup = null;
    this.contentSvgGroup = null;
    this._path = null;
    this._darkenPath = null;
};

Entry.Block.MAGNET_RANGE = 10;
Entry.Block.MAGNET_OFFSET = 0.4;

Entry.Block.HIDDEN = 0;
Entry.Block.SHOWN = 1;
Entry.Block.MOVE = 2;
Entry.Block.FOLLOW = 3;

(function(p) {
    p.schema = {
        type: Entry.STATIC.BLOCK_MODEL,
        state: Entry.Block.HIDDEN,
        thread: null,
        contents: null,
        /* render related property */
        board: null,
        x: 0,
        y: 0,
        offsetX: 0,
        offsetY: 0,
        width: 0,
        height: 0,
        contentWidth: 0,
        contentHeight: 0,
        magneting: false,
        highlight: false
    };

    p.initView = function() {
    };

    p.setThread = function() {
        if (this.thread.svgGroup) {
            this.thread.svgGroup.append(this.svgGroup);
        }
    };

    // method for board

    p.renderStart = function(board, startPos) {
        if (this.svgGroup) {
            this.thread.svgGroup.append(this.svgGroup);
            return;
        }
        this._board = board;
        this.svgGroup = this.thread.svgGroup.group();
        this.svgGroup.attr({
            class: "block"
        });
        this.svgGroup.block = this;
        if (startPos) {
            this.svgGroup.attr({
                transform: "t" + startPos.x + " " + startPos.y
            });
        }

        var path = this._skeleton.path(this);

        this._darkenPath = this.svgGroup.path(path);
        this._darkenPath.attr({
            transform: "t0 1.1",
            fill: Entry.Utils.colorDarken(this._schema.color)
        });

        this._path = this.svgGroup.path(path);
        this._path.attr({
            fill: this._schema.color
        });

        this.magnets = this._skeleton.magnets();
        this.fieldRenderStart();

        this.addControl();
    };

    /*
     *
     * @param {} animate
     */
    // not observer style
    p.moveTo = function(x, y, animate) {
        animate = animate === undefined ? true : animate;
        var transform = "t" + x + " " + y;
        if (animate) {
            this.svgGroup.animate({
                transform: transform
            }, 300, mina.easeinout);
        } else {
            this.svgGroup.attr({
                transform: transform
            });
        }
        this.set({ x: x, y: y });
    };

    p.moveBy = function(x, y, animate) {
        return this.moveTo(
            this.x + x,
            this.y + y,
            animate
        );
    };

    p.fieldRenderStart = function() {
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
        this.alignContent();
    };

    p.alignContent = function() {
        var cursor = {x: 0, y: 0};
        for (var i = 0; i < this._contents.length; i++) {
            var c = this._contents[i];
            c.align(cursor.x, cursor.y);

            // space between content
            if (i !== this._contents.length - 1)
                cursor.x += 5;

            var box = c.box;
            cursor.x += box.width;
        }

        this.contentWidth = cursor.x;
    };

    p.measureSize = function() {
        this.set(this._skeleton.box(this));
    };

    p.render = function() {
        var path = this._skeleton.path(this);
        this._path.animate({
            d: path
        }, 200);
        this._darkenPath.animate({
            d: path
        }, 200);
    };

    p.enableHighlight = function() {
        var pathLen = this._path.getTotalLength();
        var path = this._path;
        this._path.attr({
            stroke: "#F59900",
            strokeWidth: 2,
            "stroke-linecap": "round",
            "stroke-dasharray": pathLen + " " + pathLen,
            "stroke-dashoffset": pathLen
        });
        setInterval(function() {
            path.attr({"stroke-dashoffset": pathLen})
            .animate({"stroke-dashoffset": 0}, 300);
        }, 1400, mina.easeout);
        setTimeout(function() {
            setInterval(function() {
                path.animate({"stroke-dashoffset": - pathLen}, 300);
            }, 1400, mina.easeout);
        }, 500);
    };

    p.addControl = function() {
        var that = this;
        this.svgGroup.mousedown(function() {
            that.onMouseDown.apply(that, arguments);
        });
    };

    // this function is call by itself
    p.onMouseDown = function(e) {
        if (e.button === 0 || e instanceof Touch) {
                $(document).bind('mousemove.block', onMouseMove);
                $(document).bind('mouseup.block', onMouseUp);
                $(document).bind('touchmove.block', onMouseMove);
                $(document).bind('touchend.block', onMouseUp);
                this._board.dragBlock = this;
                this.dragInstance = new Entry.DragInstance({
                    startX: e.clientX,
                    startY: e.clientY,
                    offsetX: e.clientX,
                    offsetY: e.clientY,
                    mode: true
                });
                this.thread.dominate();
        } else if (e.button === 1) {
                this.enableHighlight();
        } else if (e.button === 2) {
        }

        var block = this;
        function onMouseMove(e) {
            if (e.originalEvent.touches) {
                e = e.originalEvent.touches[0];
            };
            var dragInstance = block.dragInstance;
            block.moveBy(
                e.clientX - dragInstance.offsetX,
                e.clientY - dragInstance.offsetY,
                false
            );
            dragInstance.set({
                 offsetX: e.clientX,
                 offsetY: e.clientY
            });
            block.thread.align(false);
            block._board.updateCloseMagnet(block);
        }

        function onMouseUp(e) {
            block.terminateDrag();

            $(document).unbind('.block');
            block._board.dragBlock = null;
        }
    };

    p.terminateDrag = function() {
        this._board.terminateDrag(this);
    };

    p.applyMagnet = function() {
        if (this.magneting) {
            this.magnets = this._skeleton.magnets();
            var targetBlock = this._board.dragBlock,
                targetThread = targetBlock.thread;
            var movingBlocks = targetThread._blocks.slice(targetThread._blocks.indexOf(targetBlock));
            var targetHeight = Entry.Block.MAGNET_RANGE;
            movingBlocks.map(function(b) {targetHeight += b.height;});
            this.height += targetHeight;
        } else {
            this.measureSize();
        }
    };

})(Entry.Block.prototype);
