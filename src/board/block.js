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

    // content objects
    this._contents = [];
    this.magnets = {};

    // SVG Element
    this.svgGroup = null;
    this.fieldSvgGroup = null;
    this._path = null;
    this._darkenPath = null;
};

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
        if (startPos) {
            this.svgGroup.attr({
                transform: "t" + startPos.x + " " + startPos.y
            });
        }

        this._darkenPath = this.svgGroup.path(path);
        this._darkenPath.attr({
            transform: "t0 1.1",
            fill: Entry.Utils.colorDarken(this._schema.color)
        });

        var path = this._skeleton.path(this);
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
        this.fieldSvgGroup = this.svgGroup.group();
        var contentPos = this._skeleton.contentPos();
        this.fieldSvgGroup.transform("t" + contentPos.x + ' ' + contentPos.y);

        var contents = this._schema.contents;
        for (var i = 0; i < contents.length; i++) {
            var content = contents[i];
            if (typeof content === "string")
                this._contents.push(new Entry.FieldText(content, this));
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
        this.set({
            width: this.contentWidth + 30,
            height: 30
        });
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

    p.highlight = function() {
        var pathLen = this._path.getTotalLength();
        var path = this._path;
        this._path.attr({
            stroke: "#f00",
            strokeWidth: 2,
            "stroke-linecap": "round",
            "stroke-dasharray": pathLen + " " + pathLen,
            "stroke-dashoffset": pathLen
        });
        setInterval(function() {
            path.attr({"stroke-dashoffset": pathLen})
            .animate({"stroke-dashoffset": 0}, 600);
        }, 1800, mina.easeout);
        setTimeout(function() {
            setInterval(function() {
                path.animate({"stroke-dashoffset": - pathLen}, 600);
            }, 1800, mina.easeout);
        }, 1200);
    };

    p.addControl = function() {
        var that = this;
        this.svgGroup.mousedown(function() {
            that.onMouseDown.apply(that, arguments);
        });
    };

    // this function is call by itself
    p.onMouseDown = function(e) {
        switch(e.button) {
            case 0: // left button
                $(document).bind('mousemove.block', onMouseMove);
                $(document).bind('mouseup.block', onMouseUp);
                this._board.dragBlock = this;
                this.dragInstance = new Entry.DragInstance({
                    startX: e.clientX,
                    startY: e.clientY,
                    offsetX: e.clientX,
                    offsetY: e.clientY,
                    mode: true
                });
                this.thread.dominate();
                break;
            case 1: // middle button
                break;
            case 2: // left button
                break;
        }

        var block = this;
        function onMouseMove(e) {
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

})(Entry.Block.prototype);
