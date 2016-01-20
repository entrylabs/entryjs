/*
 */
"use strict";

goog.provide("Entry.FieldBlock");
goog.provide("Entry.FieldDummyBlock");

goog.require("Entry.Field");
goog.require("Entry.DummyBlock");
/*
 *
 */
Entry.FieldBlock = function(content, blockView, index) {
    this._blockView = blockView;
    this._block = blockView.block;
    this._valueBlock = null;

    var box = new Entry.BoxModel();
    this.box = box;

    this._index = index;
    this._content = content;
    this.dummyBlock = null;

    this.acceptType = content.accept;

    this.svgGroup = null;

    this._position = content.position;

    this.box.observe(blockView, "alignContent", ["width", "height"]);

    this.renderStart(blockView.getBoard());
    this._block.observe(this, "_updateThread", ["thread"]);
};

Entry.Utils.inherit(Entry.Field, Entry.FieldBlock);

(function(p) {
    p.renderStart = function(board) {
        this.svgGroup = this._blockView.contentSvgGroup.group();
        this.box.set({
            x: 0,
            y: 0,
            width: 0,
            height: 20
        });
        this._thread = this.getValue();
        this.dummyBlock = new Entry.FieldDummyBlock(this, this._blockView);
        this._thread.insertDummyBlock(this.dummyBlock);
        this._thread.createView(board);

        this._thread.changeEvent.attach(this, this.calcWH);
        this._thread.changeEvent.attach(this, this._inspectThread);
        this.calcWH();
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

        var block = this._thread.getFirstBlock();
        if (block.isDummy)
            block = block.next;

        y = block.view.height * -0.5;
        var transform = "t" + x + " " + y;

        if (block != this._valueBlock) {
            if (this._valueBlock)
                this._valueBlock.view.set({shadow:true});

            this._valueBlock = block;
            if (this._valueBlockObserver) this._valueBlockObserver.destroy();
            if (this._valueBlock) {
                var blockView = this._valueBlock.view;
                this._valueBlockObserver =
                    blockView.observe(this, "calcWH", ["width", "height"]);

                if (blockView.shadow) blockView.set({shadow:false});
            }
        }

        if (animate)
            svgGroup.animate({
                transform: transform
            }, 300, mina.easeinout);
        else
            svgGroup.attr({
                transform: transform
            });
    };

    p.calcWH = function() {
        var block = this._thread.getFirstBlock();
        if (block.isDummy) block = block.next;

        if (block) {
            var blockView = block.view;
            this.box.set({
                width: blockView.width,
                height: blockView.height
            });
        } else {
            this.box.set({
                width: 15,
                height: 20
            });
        }
    };

    p.calcHeight = p.calcWH;

    p._updateThread = function() {
        if (this._threadChangeEvent)
            this._thread.changeEvent.detach(this._threadChangeEvent);
        var thread = this._block.thread;
        this._threadChangeEvent = this._thread.changeEvent.attach(this, function() {
            thread.changeEvent.notify();
        });
    };

    p.destroy = function() {};

    p._inspectThread = function() {
        if (this._valueBlock === null) {
            switch (this.acceptType) {
                case "basic_boolean_field":
                    this.dummyBlock.insertAfter([getBlock(this, {type: "True"})]);
                    break;
                case "basic_string_field":
                    this.dummyBlock.insertAfter([getBlock(this, {type: "text"})]);
                    break;
            }
        } else {
        }

        function getBlock(field, data) {
            var thread = field._block.getThread();
            var board = field._blockView.getBoard();

            var block = new Entry.Block(data, thread);
            block.createView(board, board.workspace.getMode());
            return block;
        }
    };

})(Entry.FieldBlock.prototype);

Entry.FieldDummyBlock = function(statementField, blockView) {
    Entry.Model(this, false);
    this.schema = {
        x: 0,
        y: 0,
        width: 0,
        height: -1,
        animating: false,
        magneting: false
    };
    this.isDummy = true;

    this.view = this;
    this.originBlockView = blockView;
    this._schema = {};
    this._thread = statementField._thread;
    this.statementField = statementField;

    this.svgGroup = statementField.svgGroup.group();

    var acceptType = statementField.acceptType;
    switch (acceptType) {
        case "basic_string_field":
            this.svgGroup.stringMagnet = this;
            break;
        case "basic_boolean_field":
            this.svgGroup.booleanMagnet = this;
            break;
    }

    var acceptBox = Entry.skeleton[acceptType].box();

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

Entry.FieldDummyBlock.PRIMITIVE_TYPES = [
    'True', "text"
];

Entry.Utils.inherit(Entry.DummyBlock, Entry.FieldDummyBlock);

Entry.FieldDummyBlock.prototype.constructor = Entry.FieldDummyBlock;

