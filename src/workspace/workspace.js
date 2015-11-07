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

    this._playEvent = new Entry.Event(this);
    this._stopEvent = new Entry.Event(this);
};

(function(p) {

    p.getBoard = function(){return this._board;};
    p.getBlockMenu = function(){return this._blockMenu;};

    p.playAddBlock = function(help) {
        var self = this;
        this._playEvent.notify(help);
        var targetBlock = this._blockMenu.findByName(help.target);
        var destBlock;
        if (help.dest.name)
            destBlock = this._board.findByName(help.dest.name);

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

        blockView._moveTo(distanceX,
                          distanceY,
                          true,
                          help.duration - 300);

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

            if (self._playEvent) {
                self._playEvent.detach(this._playEvent);
            }
            self._stopEvent.notify(help);

        }, help.duration - 300);

    };


})(Entry.Workspace.prototype);
