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
    this._thread = thread;
    this._schema = null;

    this.load(block);
};

Entry.Block.MAGNET_RANGE = 10;
Entry.Block.MAGNET_OFFSET = 0.4;

Entry.Block.HIDDEN = 0;
Entry.Block.SHOWN = 1;
Entry.Block.MOVE = 2;
Entry.Block.FOLLOW = 3;

(function(p) {
    p.schema = {
        id: null,
        x: 0,
        y: 0,
        type: null,
        params: {},
        statements: {},
        prev: null,
        next: null,
        view: null
    };

    p.load = function(block) {
        if (!block.id)
            block.id = Entry.Utils.generateId();

        this.set(block);
        this.getSchema();
    };

    p.getSchema = function() {
        this._schema = Entry.block[this.type];
        if (this._schema.event)
            this._thread.registerEvent(this, this._schema.event);
    };

    p.setThread = function(thread) {
        this._thread = thread;
    };

    p.setPrev = function(block) {
        this.set({prev: block});
    };

    p.setNext = function(block) {
        this.set({next: block});
    };

    p.execute = function(executor) {
         return this._schema.func.call(executor);
    };

    p.next = function() {
        return this.next;
    };

    p.insertAfter = function(blocks) {
        this._thread.insertByBlock(this, blocks);
    };

    p._updatePos = function() {
        if (this.view)
            this.set({
                x: this.view.x,
                y: this.view.y
            });
        if (this.next)
            this.next._updatePos();
    };

    p.createView = function(board) {
        if (!this.view) {
            this.set({view: new Entry.BlockView(this, board)});
        }
    };

    // make view
    p.bindBoard = function(board) {
        if (this.view) {
            this.view.changeBoard(board);
        } else {
            var blockView = new Entry.BlockView(this, board);
            this.set({
                view: blockView,
                x: blockView.x,
                y: blockView.y
            });
        }
    };

    // command func
    p.doMove = function() {
        console.log(
            "doMove",
            this.id,
            this.view.x - this.x,
            this.view.y - this.y);
        this._updatePos();
    };

    p.doSeparate = function() {
        console.log(
            "separate",
            this.id,
            this.x,
            this.y
        );
        this._thread.separate(this);
        this._updatePos();
    };

    p.doInsert = function(targetBlock) {
        console.log(
            "insert",
            this.id,
            targetBlock.id,
            this.x,
            this.y
        );
        var blocks = this._thread.cut(this);
        if (this.prev)
            this.prev.setNext(null);
        targetBlock.insertAfter(blocks);
        this._updatePos();
    };

    p.doDestroy = function() {
    };

    /*
    p.initView = function() {
    };

    p.setThread = function() {
        if (this.thread.svgGroup) {
            this.thread.svgGroup.append(this.svgGroup);
        }
    };

    // method for board

    p.renderStart = function(board, startPos, animate) {
    };

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

    p.fieldRenderStart = function(animate) {
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
        this.alignContent(animate);
    };

    p.alignContent = function(animate) {
        var cursor = {x: 0, y: 0};
        for (var i = 0; i < this._contents.length; i++) {
            var c = this._contents[i];
            c.align(cursor.x, cursor.y, animate);

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

    p.terminateDrag = function() {
        this._board.terminateDrag(this);
    };

    p.checkMagnet = function(targetBlock) {
        var matrix = {
            x: this.x,
            y: this.y + this.height * Entry.Block.MAGNET_OFFSET,
            width: this.width,
            height: this.height
        };
        var targetMatrix = {
            x: targetBlock.x,
            y: targetBlock.y
        };
        if (Entry.Utils.isPointInMatrix(
            this, targetMatrix, Entry.Block.MAGNET_RANGE
        )) {
            this.magneting = true;
        } else {
            this.magneting = false;
        }
    };

    p.applyMagnet = function() {
        if (this.magneting) {
            this.magnets = this._skeleton.magnets();
            var targetBlock = this._board.dragBlock,
                targetThread = targetBlock.thread;

            var movingBlocks = targetThread._blocks.slice(targetThread._blocks.indexOf(targetBlock));
            var targetHeight = Entry.Block.MAGNET_RANGE;
            movingBlocks.map(function(b) {targetHeight += b.height;});
            this.marginBottom = targetHeight;
        } else {
            this.measureSize();
        }
    };

    p.toJSON = function() {
        return {
            type: this.type,
            x: this.x,
            y: this.y
        };
    };

    p.clone = function() {
        return new Entry.Block(this);
    };

    p.getThread = function() {
        return this.thread;
    };

    p.getBoard = function() {
        return this._board;
    };
    */

})(Entry.Block.prototype);
