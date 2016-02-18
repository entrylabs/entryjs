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
    this.dummyBlock = null;

    this._position = content.position;

    this.box.observe(blockView, "alignContent", ["height"]);

    this.renderStart(blockView.getBoard());
    this.block.observe(this, "_updateThread", ["thread"]);
};


(function(p) {
    p.renderStart = function(board) {
        this.svgGroup = this._blockView.statementSvgGroup.group();
        this.box.set({
            x: 46,
            y: 0,
            width: 0,
            height: 20
        });
        this._thread = this.getValue();
        this.dummyBlock = new Entry.DummyBlock(this, this._blockView);
        this._thread.insertDummyBlock(this.dummyBlock);
        this._thread.createView(board);
        this._thread.changeEvent.attach(this, this.calcHeight);
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

        var transform = "t" + x + " " + y;

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
        var block = this.dummyBlock,
            height = - 1;
        while (block) {
            height += block.view.height + 1;
            block = block.next;
        }
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

    p.destroy = function() {};

})(Entry.FieldStatement.prototype);

Entry.DummyBlock = function(statementField, blockView) {
    Entry.Model(this, false);
    this.isDummy = true;

    this.view = this;
    this.originBlockView = blockView;
    this._schema = {};
    this._thread = statementField._thread;
    this.statementField = statementField;

    this.svgGroup = statementField.svgGroup.group();
    this.svgGroup.nextMagnet = this;

    var acceptBox = Entry.skeleton[statementField.acceptType].box();

    this.path = this.svgGroup.rect(
        acceptBox.offsetX,
        acceptBox.offsetY - 10,
        acceptBox.width,
        acceptBox.height
    );

    this.path.attr({
        fill: "transparent"
    });

    this.prevObserver = blockView.observe(
        this, "_align", ["x", "y"]
    );

    this.prevAnimatingObserver = blockView.observe(
        this, "_inheritAnimate", ["animating"]
    );

    this.observe(this, "_updateBG", ["magneting"]);

    this._align();
};

(function(p) {
    p.schema = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        next: null,
        animating: false,
        magneting: false
    };

    p._align = function(animate) {
        this.set({
            x: this.originBlockView.x,
            y: this.originBlockView.y
        });
    };

    p.insertAfter = function(blocks) {
        this._thread.insertByBlock(this, blocks);
        this.statementField.calcHeight();
    };

    p.createView = function() {
    };

    p.setThread = function() {
    };

    p.setPrev = function() {
    };

    p.setNext = function(block) {
        this.set({next: block});
    };

    p.getBoard = function() {
        return this.originBlockView.getBoard();
    };

    p._inheritAnimate = function() {
        this.set({animating: this.originBlockView.animating});
    };

    p._updateBG = function() {
        if (this.magneting) {
            var dragThreadHeight = this.getBoard().dragBlock.dragInstance.height;
            this.set({height: dragThreadHeight});
            var shadow = this.getBoard().dragBlock.getShadow();
            shadow.attr({transform: "t0 " + 0});
            this.svgGroup.prepend(shadow);
            this._clonedShadow = shadow;
        } else {
            if (this._clonedShadow) {
                this._clonedShadow.remove();
                delete this._clonedShadow;
            }
            this.set({height: this.schema.height});
        }
        this._thread.changeEvent.notify();
    };

    p.dominate = function() {
        this.originBlockView.dominate();
    };

    p.getRipplePosition = function() {
        return {cx:8, cy:5};
    };
})(Entry.DummyBlock.prototype);
