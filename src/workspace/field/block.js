/*
 */
"use strict";

goog.provide("Entry.FieldBlock");

goog.require("Entry.Field");
/*
 *
 */
Entry.FieldBlock = function(content, blockView, index, mode, contentIndex) {
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
    this._restoreCurrent = content.restore;

    this.view = this;

    this.svgGroup = null;

    this._position = content.position;

    this.box.observe(blockView, "dAlignContent", ["width", "height"]);
    this.observe(this, "_updateBG", ["magneting"], false);

    this.renderStart(blockView.getBoard(), mode);
};

Entry.Utils.inherit(Entry.Field, Entry.FieldBlock);

(function(p) {
    p.schema = {
        magneting: false
    };

    p.renderStart = function(board, mode, renderMode) {
        if (!this.svgGroup)
            this.svgGroup =
                this._blockView.contentSvgGroup.elem("g");
        this.renderMode = mode !== undefined ?
            mode : this._blockView.renderMode;

        this.view = this;
        this._nextGroup = this.svgGroup;
        this.box.set({
            x: 0,
            y: 0,
            width: 0,
            height: 20
        });

        var block = this.getValue();
        if (block) {
            if (block.constructor !== Entry.Block)
                block = new Entry.Block(block, this._block.thread);

            if (!block.view) {
                block.setThread(this);
                block.createView(board, this.renderMode);
                block.getThread().view.setParent(this);
            }
        }

        this.updateValueBlock(block);
        this._valueBlock.view._startContentRender(this.renderMode);

        if (this._blockView.getBoard().constructor !== Entry.Board)
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

        if (block && (block && block.view)) {
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
        if (block && (block && block.view)) {
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

    p.destroy = function() {
        this._valueBlock && this._valueBlock.destroyView();
    };

    p.inspectBlock = function() {
        var blockType = null;
        if (this._originBlock) {
            blockType = this._originBlock.type;
            delete this._originBlock;
        } else {
            switch (this.acceptType) {
                case "boolean":
                    blockType = "True";
                    break;
                case "string":
                    blockType = "text";
                    break;
                case "param":
                    blockType = "function_field_label";
                    break;
            }
        }
        return this._createBlockByType(blockType);
    };

    p._setValueBlock = function(block) {
        if (this._restoreCurrent)
            this._originBlock = this._valueBlock;
        if (!block)
            block = this.inspectBlock();
        this._valueBlock = block;
        this.setValue(block);

        block.setThread(this);
        block.getThread().view.setParent(this);

        return this._valueBlock;
    };

    p.getValueBlock = function() {return this._valueBlock;};

    p.updateValueBlock = function(block) {
        if (!(block instanceof Entry.Block))
            block = undefined;

        if (block && block === this._valueBlock) {
            this.calcWH();
            return;
        }

        this._destroyObservers();

        var view = this._setValueBlock(block).view;
        view.bindPrev(this);
        this._blockView.alignContent();
        this._posObserver = view.observe(this, "updateValueBlock", ["x", "y"], false);
        this._sizeObserver = view.observe(this, "calcWH", ["width", "height"]);
        var board = this._blockView.getBoard();// performance issue
        if (board.constructor === Entry.Board)
            board.generateCodeMagnetMap();
    };

    p._destroyObservers = function() {
        if (this._sizeObserver) this._sizeObserver.destroy();
        if (this._posObserver) this._posObserver.destroy();
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
        this.calcWH();
        this.changeEvent.notify();
    };

    p.getCode = function() {
        return this._block.thread.getCode();
    };

    p.cut = function(block) {
        if (this._valueBlock === block) return [block];
        else return null;
    };

    p.replace = function(block) {
        if (typeof block === "string")
            block = this._createBlockByType(block);

        var valueBlock = this._valueBlock;

        if (Entry.block[valueBlock.type].isPrimitive) {
            valueBlock.doNotSplice = true;
            valueBlock.destroy();
        } else if (this.acceptType === "param") {
            this._destroyObservers();
            valueBlock.view._toGlobalCoordinate();
            block.getTerminateOutputBlock().view._contents[1].replace(
                valueBlock
            );
        } else {
            this._destroyObservers();
            valueBlock.view._toGlobalCoordinate();
            Entry.do(
                'separateBlock',
                valueBlock
            ).isPass(true);
            valueBlock.view.bumpAway(30, 150);
        }
        this.updateValueBlock(block);
        block.view._toLocalCoordinate(this.svgGroup);
        this.calcWH();
        this.changeEvent.notify();
    };

    p.setParent = function(parent) {
        this._parent = parent;
    };

    p.getParent = function() {
        return this._parent;
    };

    p._createBlockByType = function(blockType) {
        var thread = this._block.getThread();
        var board = this._blockView.getBoard();

        var block = new Entry.Block({type: blockType}, this);
        block.createView(board, this.renderMode);
        return block;
    };

    p.spliceBlock = function() {
        this.updateValueBlock();
    };

    p._updateBG = function() {
        if (this.magneting) {
            this._bg = this.svgGroup.elem("path", {
                d: "m 8,12 l -4,0 -2,-2 0,-3 3,0 1,-1 0,-12 -1,-1 -3,0 0,-3 2,-2 l 4,0 z",
                fill: "#fff",
                stroke: "#fff",
                'fill-opacity': 0.7,
                transform: "translate(0,12)"
            });
        } else {
            if (this._bg) {
                this._bg.remove();
                delete this._bg;
            }
        }
    };

    p.getThread = function() {return this;};

    p.pointer = function(pointer) {
        pointer = pointer || [];
        pointer.unshift(this._index);
        pointer.unshift(Entry.PARAM);
        return this._block.pointer(pointer);
    };

})(Entry.FieldBlock.prototype);
