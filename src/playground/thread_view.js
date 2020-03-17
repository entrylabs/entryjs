'use strict';

Entry.ThreadView = class ThreadView {
    schema = {
        height: 0,
        zIndex: 0,
    };

    constructor(thread, board) {
        Entry.Model(this, false);

        this.thread = thread;

        this.svgGroup = board.svgThreadGroup.elem('g');

        this.board = board;

        this.parent = board; // statement

        this._hasGuide = false;
    }

    destroy() {
        this.svgGroup.remove();
    }

    setParent(parent) {
        this.parent = parent;
    }

    getParent() {
        return this.parent;
    }

    renderText() {
        const blocks = this.thread.getBlocks();
        for (let i = 0; i < blocks.length; i++) {
            blocks[i].view.renderText();
        }
    }

    renderBlock() {
        const blocks = this.thread.getBlocks();
        for (let i = 0; i < blocks.length; i++) {
            blocks[i].view.renderBlock();
        }
    }

    requestAbsoluteCoordinate(blockView) {
        const board = this.board;
        const { scale = 1 } = board || {};
        const blocks = this.thread.getBlocks();
        let block = blocks.shift();
        let pos = {
            x: 0,
            y: 0,
        };
        const parent = this.parent;
        if (
            !(parent instanceof Entry.Board || parent instanceof Entry.BlockMenu) &&
            parent.requestAbsoluteCoordinate
        ) {
            pos = parent.requestAbsoluteCoordinate();
        }

        while (block && block.view !== blockView && block.view) {
            const prevBlockView = block.view;
            pos.x += prevBlockView.x + prevBlockView.magnet.next.x * scale;
            pos.y += prevBlockView.y + prevBlockView.magnet.next.y * scale;
            block = blocks.shift();
        }
        return pos;
    }

    requestPartHeight(blockView) {
        const blocks = this.thread.getBlocks();
        let block = blocks.pop();
        let height = 0;
        if (blockView) {
            height = blockView.magnet.next ? blockView.magnet.next.y : blockView.height;
        }
        while (block && block.view !== blockView && block.view) {
            const prevBlockView = block.view;
            if (prevBlockView.magnet.next) {
                height += prevBlockView.magnet.next.y;
            } else {
                height += prevBlockView.height;
            }
            if (prevBlockView.dragMode === Entry.DRAG_MODE_DRAG) {
                height = 0;
            }
            block = blocks.pop();
        }
        return height;
    }

    getMagnet() {
        return {
            getBoundingClientRect: function() {
                const halfWidth = 20;
                const coord = this.parent.requestAbsoluteCoordinate();
                const boardOffset = this.board.relativeOffset;
                return {
                    top: coord.y + boardOffset.top - halfWidth,
                    left: coord.x + boardOffset.left - halfWidth,
                    width: 2 * halfWidth,
                    height: 2 * halfWidth,
                };
            }.bind(this),
        };
    }

    dominate() {
        !this._hasGuide && this.parent.dominate(this.thread);
    }

    isGlobal() {
        return this.parent instanceof Entry.Board;
    }

    reDraw() {
        const blocks = this.thread._data;

        for (let i = blocks.length - 1; i >= 0; i--) {
            const b = blocks[i];
            if (b.view) {
                b.view.reDraw();
            } else {
                b.createView(this.thread._code.view.board);
            }
        }
    }

    setZIndex(zIndex) {
        this.set({ zIndex });
    }

    setHasGuide(bool) {
        this._hasGuide = bool;
    }

    getFields() {
        const BLOCK = Entry.Block;

        return this.thread.getBlocks().reduce(function(fields, block) {
            if (!(block instanceof BLOCK)) {
                return fields;
            }

            return fields.concat(block.view.getFields());
        }, []);
    }
};
