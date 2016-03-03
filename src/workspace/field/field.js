/*
 *
 */
"use strict";

goog.provide("Entry.Field");

/*
 *
 */
Entry.Field = function() {};

(function(p) {
    p.TEXT_LIMIT_LENGTH = 20;

    p.destroy = function() {
         this.destroyOption();
    };

    p.destroyOption = function() {
        if (this.documentDownEvent) {
            Entry.documentMousedown.detach(this.documentDownEvent);
            delete this.documentDownEvent;
        }

        if (this.optionGroup) {
            this.optionGroup.remove();
            delete this.optionGroup;
        }
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

    //get absolute position of field from document
    p.getAbsolutePos = function() {
        var blockView = this._block.view;
        var matrix = blockView.svgGroup.transform().globalMatrix;
        var offset = blockView.getBoard().svgDom.offset();
        var contentPos = blockView.getContentPos();

        return {
            x: matrix.e + offset.left + this.box.x + contentPos.x,
            y: matrix.f + offset.top + this.box.y + contentPos.y
        };
    };

    //get relative position of field from blockView origin
    p.getRelativePos = function() {
        var blockView = this._block.view;
        var contentPos = blockView.getContentPos();
        var box = this.box;

        return {
            x: box.x + contentPos.x,
            y: box.y + contentPos.y
        };
    };

    p.truncate = function() {
        var value = String(this.getValue());
        var limit = this.TEXT_LIMIT_LENGTH;
        var ret = value.substring(0, limit);
        if (value.length > limit)
            ret += '...';
        return ret;
    };

    p.appendSvgOptionGroup = function() {
        return this._block.view.getBoard().svgGroup.elem('g');
    };

    p.getValue = function() {
        return this._block.params[this._index];
    };

    p.setValue = function(value) {
        this.value = value;
        this._block.params[this._index] = value;
    };

    p._isEditable = function() {
        var dragMode = this._block.view.dragMode;
        if (dragMode == Entry.DRAG_MODE_MOUSEDOWN) return true;
        var blockView = this._block.view;
        var board = blockView.getBoard();

        var selectedBlockView = board.selectedBlockView;
        if (!selectedBlockView) return false;

        return blockView.getSvgRoot() == selectedBlockView.svgGroup;
    };
})(Entry.Field.prototype);
