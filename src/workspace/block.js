/*
on*
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

    p.getThread = function() {
        return this._thread;
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

    p.clone = function() {
        return new Entry.Block(this.toJSON());
    };

    p.destory = function(animate) {
        if (this.view)
            this.view.destroy(animate);
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

    p.toJSON = function() {
        var json = this._toJSON();
        delete json.prev;
        delete json.next;
        delete json.view;
        return json;
    };

    /*
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
    */
})(Entry.Block.prototype);
