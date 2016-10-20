/*
 */
"use strict";

goog.provide("Entry.FieldOutput");

goog.require("Entry.Field");
/*
 *
 */
Entry.FieldOutput = function(content, blockView, index, mode, contentIndex) {
    Entry.Model(this, false);

    this._blockView = blockView;
    this._block = blockView.block;
    this._valueBlock = null;

    var box = new Entry.BoxModel();
    this.box = box;

    this.changeEvent = new Entry.Event(this);

    this._index = index;
    this.contentIndex = contentIndex;
    this._content = content;

    this.acceptType = content.accept;

    this.view = this;

    this.svgGroup = null;

    this._position = content.position;

    this.box.observe(blockView, "alignContent", ["width", "height"]);
    this.observe(this, "_updateBG", ["magneting"], false);

    this.renderStart(blockView.getBoard(), mode);
};

Entry.Utils.inherit(Entry.Field, Entry.FieldOutput);

(function(p) {
    p.schema = {
        magneting: false
    };

    p.renderStart = function(board, mode) {
        if (this.svgGroup)
            $(this.svgGroup).remove();

        this.svgGroup =
            this._blockView.contentSvgGroup.elem("g");
        this.view = this;
        this._nextGroup = this.svgGroup;
        this.box.set({
            x: 0,
            y: 0,
            width: 0,
            height: 20
        });
        var block = this.getValue();
        if (block && !block.view) {
            block.setThread(this);
            block.createView(board, mode);
        } else if (block && block.view) {
            block.destroyView();
            block.createView(this._blockView.getBoard());
        }
        this._updateValueBlock(block);

        if (this._blockView.getBoard().constructor == Entry.BlockMenu &&
            this._valueBlock)
            this._valueBlock.view.removeControl();
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

        var block = this._valueBlock;

        if (block) {
            y = block.view.height * -0.5;
        }
        var transform = "translate(" + x + "," + y + ")";

        if (animate)
            svgGroup.animate({
                transform: transform
            }, 300, mina.easeinout);
        else
            svgGroup.attr({
                transform: transform
            });

        this.box.set({
            x: x,
            y: y
        });
    };

    p.calcWH = function() {
        var block = this._valueBlock;

        if (block) {
            var blockView = block.view;
            this.box.set({
                width: blockView.width,
                height: blockView.height
            });
        } else {
            this.box.set({
                width: 0,
                height: 20
            });
        }
    };

    p.calcHeight = p.calcWH;

    p.destroy = function() {};

    p._inspectBlock = function() {
    };

    p._setValueBlock = function(block) {
        if (block != this._valueBlock || !this._valueBlock) {

            this._valueBlock = block;
            this.setValue(block);

            if (block)
                block.setThread(this);

            return this._valueBlock;
        }
    };

    p._updateValueBlock = function(block) {
        if (!(block instanceof Entry.Block))
            block = undefined;

        if (this._sizeObserver) this._sizeObserver.destroy();
        if (this._posObserver) this._posObserver.destroy();

        block = this._setValueBlock(block);
        if (block) {
            var view = block.view;
            view.bindPrev();
            this._posObserver = view.observe(this, "_updateValueBlock", ["x", "y"], false);
            this._sizeObserver = view.observe(this, "calcWH", ["width", "height"]);
            this.calcWH();
        } else {
            this.calcWH();
        }
        this._blockView.alignContent();
    };

    p.getPrevBlock = function(block) {
        if (this._valueBlock === block) return this;
        else return null;
    };

    p.getNextBlock = function() {
        return null;
    };

    p.requestAbsoluteCoordinate = function(blockView) {
        var blockView = this._blockView;
        var contentPos = blockView.contentPos;
        var pos = blockView.getAbsoluteCoordinate();
        pos.x += this.box.x + contentPos.x;
        pos.y += this.box.y + contentPos.y;
        return pos;
    };

    p.dominate = function() {
        this._blockView.dominate();
    };

    p.isGlobal = function() {
        return false;
    };

    p.separate = function(block) {
        this.getCode().createThread([block]);
        this.changeEvent.notify();
    };

    p.getCode = function() {
        return this._block.thread.getCode();
    };

    p.cut = function(block) {
        if (this._valueBlock === block) {
            delete this._valueBlock;
            return [block];
        }
        else return null;
    };

    p._updateBG = function() {
        if (this.magneting) {
            this._bg = this.svgGroup.elem("path", {
                d: "m -4,-12 h 3 l 2,2 0,3 3,0 1,1 0,12 -1,1 -3,0 0,3 -2,2 h -3 ",
                fill: "#fff",
                stroke: "#fff",
                'fill-opacity': 0.7,
                transform: "translate(0," + (this._valueBlock ? 12 : 0) + ")"
            });
        } else {
            if (this._bg) {
                this._bg.remove();
                delete this._bg;
            }
        }
    };

    p.replace = function(block) {
        var valueBlock = this._valueBlock;
        if (valueBlock) {
            valueBlock.view._toGlobalCoordinate();
            block.getTerminateOutputBlock().view._contents[1].replace(
                valueBlock
            );
        }
        this._updateValueBlock(block);
        block.view._toLocalCoordinate(this.svgGroup);
        this.calcWH();
    };

    p.setParent = function(parent) {
        this._parent = parent;
    };

    p.getParent = function() {
        return this._parent;
    };

    p.getThread = function() {
         return this;
    };

    p.getValueBlock = function() {return this._valueBlock;};

    p.pointer = function(pointer) {
        pointer.unshift(this._index);
        pointer.unshift(Entry.PARAM);
        return this._block.pointer(pointer);
    };

})(Entry.FieldOutput.prototype);
