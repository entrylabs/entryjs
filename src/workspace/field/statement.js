/*
 */
"use strict";

goog.provide("Entry.FieldStatement");
goog.provide("Entry.DummyBlock");

/*
 *
 */
Entry.FieldStatement = function(content, blockView) {
    this._blockView = blockView;

    this.key = content.key;

    var box = new Entry.BoxModel();
    this.box = box;

    this.acceptType = content.accept;

    this.svgGroup = null;
    this.dummyBlock = null;

    this.box.observe(blockView, "_alignContent", ["height"]);

    this.renderStart(blockView.getBoard());
};

(function(p) {
    p.renderStart = function(board) {
        this.svgGroup = this._blockView.contentSvgGroup.group();
        this.box.set({
            x: 46,
            y: 0,
            width: 20,
            height: 20
        });
        this.dummyBlock = new Entry.DummyBlock(this, this._blockView);
        this._thread = this._blockView.block.values[this.key];
        this._thread.insertDummyBlock(this.dummyBlock);
        this._thread.createView(board);
        this._thread.changeEvent.attach(this, this.calcHeight);
    };

    p.insertAfter = function(blocks) {
        this._thread.insertByBlock(this.dummyBlock, blocks);
        this.calcHeight();
    };

    p.calcHeight = function() {
        var block = this.dummyBlock.next,
            height = 0;
        while (block) {
            height += block.view.height + 1;
            block = block.next;
        }
        this.box.set({height: height});
    };

    p.align = function(x, y, animate) {
        animate = animate === undefined ? true : animate;
        var svgGroup = this.svgGroup;
        var transform = "t" + 46 + " " + 15;

        if (animate)
            svgGroup.animate({
                transform: transform
            }, 300, mina.easeinout);
        else
            svgGroup.attr({
                transform: transform
            });
    };

    p.getView = function() {return this._blockView;};

})(Entry.FieldStatement.prototype);

Entry.DummyBlock = function(statementField, blockView) {
    Entry.Model(this, false);

    this.view = this;
    this.originBlockView = blockView;

    this.svgGroup = statementField.svgGroup.group();
    this.svgGroup.block = statementField;

    var skeleton = Entry.skeleton[statementField.acceptType];

    var path = skeleton.path(this);

    this.path = this.svgGroup.path(path);
    this.path.attr({
        transform: "t0 -10",
        fill: "transparent"
    });

    this.prevObserver = blockView.observe(
        this, "_align", ["x", "y"]
    );

    this.prevAnimatingObserver = blockView.observe(
        this, "_inheritAnimate", ["animating"]
    );

    this._align();
};

(function(p) {
    p.schema = {
        x: 0,
        y: 0,
        width: 0,
        height: 40 - 1,
        animating: false
    };

    p._align = function(animate) {
        this.set({
            x: this.originBlockView.x,
            y: this.originBlockView.y
        });
    };

    p.createView = function() {
    };

    p.setThread = function() {
    };

    p.setPrev = function() {
    };

    p.setNext = function(block) {
        this.next = block;
    };

    p._inheritAnimate = function() {
        this.set({animating: this.originBlockView.animating});
    };

})(Entry.DummyBlock.prototype);
