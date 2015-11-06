/*
 *
 */
"use strict";

goog.provide("Entry.Workspace");

goog.require("Entry.Model");

Entry.Workspace = function(blockMenu, board) {
    Entry.Model(this, false);

    this._blockMenu = blockMenu;
    this._board = board;
    blockMenu.workspace = this;
    board.workspace = this;
};

(function(p) {

    p.getBoard = function(){return this._board;};
    p.getBlockMenu = function(){return this._blockMenu;};

    p.playAdd = function(target, dest) {
        var targetBlock = this._blockMenu.findByName(target);
        var destBlock;
        if (dest.name)
            destBlock = this._board.findByName(dest.name);

        blockView = targetBlock.view;

        // mousedown
        blockView.getBoard().set({dragBlock:blockView});

        blockView.dragInstance = new Entry.DragInstance({
            startX: targetBlock.view.x,
            startY: targetBlock.view.y,
            offsetX: 0,
            offsetY: 0,
            mode: true
        });
        blockView.dominate();
        blockView.dragMode= Entry.DRAG_MODE_MOUSEDOWN;

        var board = blockView.getBoard();

        // mousemove
        if (blockView.block.prev) {
            blockView.block.prev.setNext(null);
            blockView.block.setPrev(null);
        }

        var dragInstance = blockView.dragInstance;

        var distanceX = this.getBlockMenu()._svgWidth + destBlock.view.x;
        var distanceY = destBlock.view.y + destBlock.view.height;

        var timeout = 3000;
        blockView._moveTo(distanceX,
                          distanceY,
                          true,
                          timeout);

        setTimeout(function() {
            blockView._align(true);

            var magnetedBlock = blockView._getCloseBlock();
            if (magnetedBlock) {
                board.setMagnetedBlock(magnetedBlock.view);
            } else {
                board.setMagnetedBlock(null);
            }

            // mouseup
            $(document).unbind('.block');
            blockView.terminateDrag();
            if (board) board.set({dragBoard: null});
            delete blockView.dragInstance;

        }, timeout);

    };


})(Entry.Workspace.prototype);
