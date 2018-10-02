/*
 *
 */
'use strict';

/*
 *
 */
Entry.ThreadView = function(thread, board) {
    Entry.Model(this, false);

    this.thread = thread;

    this.svgGroup = board.svgThreadGroup.elem('g');

    this.board = board;

    this.parent = board; // statement

    this._hasGuide = false;
};

(function(p) {
    p.schema = {
        height: 0,
        zIndex: 0,
    };

    p.destroy = function() {
        this.svgGroup.remove();
    };

    p.setParent = function(parent) {
        this.parent = parent;
    };

    p.getParent = function() {
        return this.parent;
    };

    p.renderText = function() {
        var blocks = this.thread.getBlocks();
        for (var i = 0; i < blocks.length; i++) blocks[i].view.renderText();
    };

    p.renderBlock = function() {
        var blocks = this.thread.getBlocks();
        for (var i = 0; i < blocks.length; i++) blocks[i].view.renderBlock();
    };

    p.requestAbsoluteCoordinate = function(blockView) {
        var blocks = this.thread.getBlocks();
        var block = blocks.shift();
        var pos = {
            x: 0,
            y: 0,
        };
        var parent = this.parent;
        if (
            !(
                parent instanceof Entry.Board ||
                parent instanceof Entry.BlockMenu
            ) &&
            parent.requestAbsoluteCoordinate
        ) {
            pos = parent.requestAbsoluteCoordinate();
        }

        while (block && block.view !== blockView && block.view) {
            var prevBlockView = block.view;
            pos.x += prevBlockView.x + prevBlockView.magnet.next.x;
            pos.y += prevBlockView.y + prevBlockView.magnet.next.y;
            block = blocks.shift();
        }
        return pos;
    };

    p.requestPartHeight = function(blockView, forAll) {
        var blocks = this.thread.getBlocks();
        var block = blocks.pop();
        var height = blockView
            ? blockView.magnet.next ? blockView.magnet.next.y : blockView.height
            : 0;
        while (block && block.view !== blockView && block.view) {
            var prevBlockView = block.view;
            if (prevBlockView.magnet.next)
                height += prevBlockView.magnet.next.y;
            else height += prevBlockView.height;
            if (prevBlockView.dragMode === Entry.DRAG_MODE_DRAG) height = 0;
            block = blocks.pop();
        }
        return height;
    };

    p.getMagnet = function(selector) {
        return {
            getBoundingClientRect: function() {
                var halfWidth = 20,
                    coord = this.parent.requestAbsoluteCoordinate(),
                    boardOffset = this.board.relativeOffset;
                return {
                    top: coord.y + boardOffset.top - halfWidth,
                    left: coord.x + boardOffset.left - halfWidth,
                    width: 2 * halfWidth,
                    height: 2 * halfWidth,
                };
            }.bind(this),
        };
    };

    p.dominate = function() {
        !this._hasGuide && this.parent.dominate(this.thread);
    };

    p.isGlobal = function() {
        return this.parent instanceof Entry.Board;
    };

    p.reDraw = function() {
        const blocks = this.thread._data;

        for (let i = blocks.length - 1; i >= 0; i--) {
            const b = blocks[i];
            if (b.view) {
                b.view.reDraw();
            } else {
                b.createView(this.thread._code.view.board);
            }
        }
    };

    p.setZIndex = function(zIndex) {
        this.set({ zIndex: zIndex });
    };

    p.setHasGuide = function(bool) {
        this._hasGuide = bool;
    };

    p.getFields = function() {
        var BLOCK = Entry.Block;

        return this.thread.getBlocks().reduce(function(fields, block) {
            if (!(block instanceof BLOCK)) {
                return fields;
            }

            return fields.concat(block.view.getFields());
        }, []);
    };
})(Entry.ThreadView.prototype);
