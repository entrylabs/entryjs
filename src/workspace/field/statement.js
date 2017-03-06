/*
 */
"use strict";

goog.provide("Entry.FieldStatement");

goog.require("Entry.BlockView");

/*
 *
 */
Entry.FieldStatement = function(content, blockView, index) {
    Entry.Model(this, false);

    this._blockView = blockView;
    this.block = blockView.block;

    this.view = this;

    this._index = index;

    this.acceptType = content.accept;

    this.svgGroup = null;
    this.statementSvgGroup = null;
    this._thread = null;

    this._position = content.position;

    this._events = [];

    this.observe(blockView, "alignContent", ["height"], false);
    this.observe(this, "_updateBG", ["magneting"], false);

    this.renderStart(blockView.getBoard());
};

(function(p) {
    p.schema = {
        x: 0,
        y: 0,
        width: 100,
        height: 20,
        magneting: false
    };

    p.magnet = { next: {x: 0, y: 0} };

    p.renderStart = function(board) {
        this.svgGroup =
            this._blockView.statementSvgGroup.elem('g');
        this.statementSvgGroup =
            this.svgGroup.elem('g');
        this._nextGroup = this.statementSvgGroup;
        this._initThread(board);
        this._board = board;
    };

    p._initThread = function(board) {
        var thread = this.getValue();
        this._thread = thread;
        thread.createView(board);
        thread.view.setParent(this);
        var firstBlock = thread.getFirstBlock();
        if (firstBlock) {
            firstBlock.view._toLocalCoordinate(this.statementSvgGroup);
            this.firstBlock = firstBlock;
        }

        var calcEvent = thread.changeEvent.attach(this, this.calcHeight);
        var checkTopEvent = thread.changeEvent.attach(this, this.checkTopBlock);
        this._events.push([thread.changeEvent, calcEvent]);
        this._events.push([thread.changeEvent, checkTopEvent]);
        this.calcHeight();
    };

    p.align = function(x, y, animate) {
        animate = animate === undefined ? true : animate;
        var svgGroup = this.svgGroup;
        if (this._position) {
            if (this._position.x)
                x = this._position.x;
            if (this._position.y)
                y = this._position.y;
        }

        var transform = "translate(" + x + "," + y + ")";

        this.set({x: x, y: y});

        if (animate)
            svgGroup.animate({
                transform: transform
            }, 300, mina.easeinout);
        else
            svgGroup.attr({
                transform: transform
            });
    };

    p.calcHeight = function() {
        var height = this._thread.view.requestPartHeight(null);
        this.set({height: height});
    };

    p.getValue = function() {
        return this.block.statements[this._index];
    };

    p.requestAbsoluteCoordinate = function() {
        var pos = this._blockView.getAbsoluteCoordinate();
        pos.x += this.x;
        pos.y += this.y;
        return pos;
    };

    p.dominate = function() {
        this._blockView.dominate();
    };

    p.destroy = function() {
        while (this._events.length) {
            var evt = this._events.pop();
            evt[0].detach(evt[1])
        }
    };

    p._updateBG = function() {
        if (!this._board.dragBlock || !this._board.dragBlock.dragInstance)
            return;
        var blockView = this;
        var magneting = blockView.magneting;
        var block = blockView.block;
        var svgGroup = blockView.svgGroup;

        if (magneting) {
            var shadow = this._board.dragBlock.getShadow();
            var pos = this.requestAbsoluteCoordinate();
            var transform  = 'translate(' + pos.x + ',' + pos.y + ')';
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
            var height = this._board.dragBlock.getBelowHeight();

            this.statementSvgGroup.attr({
                transform: 'translate(0,' + height + ')'
            });

            this.set({height: this.height + height});
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
                delete blockView.originalHeight;
            }
            this.statementSvgGroup.attr({
                transform: 'translate(0,0)'
            });
            this.calcHeight();
        }
        var changeEvent = blockView.block.thread.changeEvent;
        if (changeEvent) changeEvent.notify();
    };

    p.insertTopBlock = function(newBlock) {
        if (this._posObserver) this._posObserver.destroy();

        var block = this.firstBlock;
        this.firstBlock = newBlock;
        if (newBlock) {
            newBlock.doInsert(this._thread);

        }
        return block;
    };

    p.getNextBlock = function () {
        return this.firstBlock;
    };

    p.checkTopBlock = function() {
        var firstBlock = this._thread.getFirstBlock();
        if (firstBlock && this.firstBlock !== firstBlock) {
            this.firstBlock = firstBlock;
            firstBlock.view.bindPrev(this);
            firstBlock._updatePos();
        } else if (!firstBlock){
            this.firstBlock = null;
        }
    };

    p.pointer = function(pointer) {
        pointer = pointer || [];
        pointer.unshift(this._index);
        return this.block.pointer(pointer);
    };

})(Entry.FieldStatement.prototype);
