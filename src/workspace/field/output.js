/*
 */
"use strict";

goog.provide("Entry.FieldOutput");
goog.provide("Entry.OutputDummyBlock");

goog.require("Entry.Field");
goog.require("Entry.DummyBlock");
/*
 *
 */
Entry.FieldOutput = function(content, blockView, index) {
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

Entry.Utils.inherit(Entry.Field, Entry.FieldOutput);

(function(p) {
    p.renderStart = function(board) {
        this.svgGroup = this._blockView.contentSvgGroup.group();
        this.box.set({
            width: - Entry.BlockView.PARAM_SPACE,
            height: 0
        });
        this._thread = this.getValue();
        this.dummyBlock = new Entry.OutputDummyBlock(this, this._blockView);
        this._thread.insertDummyBlock(this.dummyBlock);
        this._inspectThread();
        this._thread.createView(board);

        this.dummyBlock.observe(this, "_inspectThread", ["next"]);
        this.dummyBlock.observe(this, "calcWH", ["next"]);
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

        x -= 2;

        var block = this._thread.getFirstBlock();
        if (block.isDummy)
            block = block.next;

        if (block) {
            y = block.view.height * -0.5;
        }
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
        this._blockView.alignContent();
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
        if (!this.dummyBlock.next) {
            switch (this.acceptType) {
                case "basic_param":
                    //this._valueBlock = getBlock(this, {type: "function_field_label"});
                    break;
            }
            if (this._valueBlock)
                this.dummyBlock.insertAfter([this._valueBlock]);
        }

        function getBlock(field, data) {
            var thread = field._block.getThread();
            var board = field._blockView.getBoard();

            var block = new Entry.Block(data, thread);
            var workspace = board.workspace;
            var mode;
            if (workspace)
                mode = workspace.getMode();

            block.createView(board, mode);
            return block;
        }
    };

})(Entry.FieldOutput.prototype);

Entry.OutputDummyBlock = function(statementField, blockView) {
    Entry.Model(this, false);
    this.isDummy = true;

    this.view = this;
    this.originBlockView = blockView;
    this._thread = statementField._thread;
    this.statementField = statementField;

    this.svgGroup = statementField.svgGroup.group();

    var acceptType = statementField.acceptType;
    switch (acceptType) {
        case "basic_param":
            this.svgGroup.paramMagnet = this;
            break;
    }

    var acceptBox = Entry.skeleton[acceptType].box();

    this.path = this.svgGroup.rect(
        acceptBox.offsetX,
        acceptBox.offsetY - 10,
        acceptBox.width,
        acceptBox.height
    );

    this.path.attr({fill: "transparent"});

    this.prevObserver = blockView.observe(
        this, "_align", ["x", "y"]
    );

    this.observe(this, "_updateBG", ["magneting"]);

    this._align();
};

Entry.OutputDummyBlock.PRIMITIVE_TYPES = [
    'True', "text"
];

Entry.Utils.inherit(Entry.DummyBlock, Entry.OutputDummyBlock);

Entry.OutputDummyBlock.prototype.constructor = Entry.OutputDummyBlock;

Entry.OutputDummyBlock.prototype.schema = {
    x: 0,
    y: 0,
    width: 0,
    height: -1,
    next: null,
    animating: false,
    magneting: false
};

Entry.OutputDummyBlock.prototype._updateBG = function() {
    if (this.magneting) {
        var block = this.next;
        if (!block) return;

        var shadow = block.view.svgGroup.selectAll('.blockPath')[0].clone();
        shadow.attr({
            transform: "t0 " + 0,
            "opacity": 1,
            "fill": 'white',
            'fill-opacity': 0.5,
            'stroke': 'white',
            'stroke-width': 2,
            'stroke-opacity': 1
        });
        this.svgGroup.append(shadow);
        this._clonedShadow = shadow;
    } else {
        if (this._clonedShadow) {
            this._clonedShadow.remove();
            delete this._clonedShadow;
        }
    }
};
