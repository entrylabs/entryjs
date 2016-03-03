/*
 */
"use strict";

goog.provide("Entry.FieldStatement");
goog.provide("Entry.DummyBlock");

/*
 *
 */
Entry.FieldStatement = function(content, blockView, index) {
    this._blockView = blockView;
    this.block = blockView.block;


    var box = new Entry.BoxModel();
    this.box = box;

    this._index = index;

    this.acceptType = content.accept;

    this.svgGroup = null;
    this._thread = null;

    this._position = content.position;

    this.box.observe(blockView, "alignContent", ["height"]);

    this.renderStart(blockView.getBoard());
    this.block.observe(this, "_updateThread", ["thread"]);
};


(function(p) {
    p.renderStart = function(board) {
        this.svgGroup = this._blockView.statementSvgGroup.elem('g');
        this.box.set({
            x: 46,
            y: 0,
            width: 0,
            height: 20
        });
        this._initThread(board);
    };

    p._initThread = function(board) {
        var thread = this.getValue();
        this._thread = thread;
        thread.createView(board);
        thread.view.setParent(this);
        var firstBlock = thread.getFirstBlock();
        if (firstBlock) {
            firstBlock.view._toLocalCoordinate(this.svgGroup);
        }
        thread.changeEvent.attach(this, this.calcHeight);
        this.calcHeight();
    }

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

        this.box.set({x: x, y: y});

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
        var height = this._thread.view.requestPartHeight();
        this.box.set({height:Math.max(height, 20)});
    };

    p._updateThread = function() {
        if (this._threadChangeEvent)
            this._thread.changeEvent.detach(this._threadChangeEvent);
        var thread = this.block.thread;
        this._threadChangeEvent = this._thread.changeEvent.attach(this, function() {
            thread.changeEvent.notify();
        });
    };

    p.getValue = function() {
        return this.block.statements[this._index];
    };

    p.requestAbsoluteCoordinate = function() {
        var pos = this._blockView.getAbsoluteCoordinate();
        pos.x += this.box.x;
        pos.y += this.box.y;
        return pos;
    };

    p.dominate = function() {
        this._blockView.dominate();
    };

    p.destroy = function() {};

})(Entry.FieldStatement.prototype);
