/*
 *
 */
"use strict";

goog.provide("Entry.Workspace");
goog.require("Entry.Model");

Entry.Workspace = function(blockMenu, board) {
    Entry.Model(this, false);

    blockMenu.workspace = this;
    board.workspace = this;

    this._blockMenu = blockMenu;
    this._board = board;
   

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

        if (help.dest.name)
            var destBlock = this._board.findByName(help.dest.name);

        var blockView = targetBlock.view;
        var board = blockView.getBoard();

        // mousedown
        board.set({dragBlock:blockView});
        blockView._moveTo(0,0);
        var observer = blockView.moveBoardBlockObserver;
        if (observer) observer.destroy();

        blockView.dragMode = Entry.DRAG_MODE_MOUSEDOWN;


        // mousemove
        if (blockView.block.prev) {
            blockView.block.prev.setNext(null);
            blockView.block.setPrev(null);
        }

        var distanceX = this.getBlockMenu()._svgWidth + destBlock.view.x;
        var distanceY = destBlock.view.y + destBlock.view.height;

        blockView._moveTo(distanceX,
                          distanceY,
                          true,
                          help.duration - 300);

        this.getBoard().dragBlock._moveTo(
                          distanceX,
                          distanceY,
                          true,
                          help.duration - 300);

        setTimeout(function() {
            blockView._align(true);

            return;
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

            if (self._playEvent) {
                self._playEvent.detach(this._playEvent);
            }
            self._stopEvent.notify(help);

        }, help.duration - 300);

    };

    p.playClick = function(help) {
        var self = this;

        var target = $('#'+help.target);
        if (target) {
            var pos = target.position();
            target.click();
            setTimeout(function() {
                console.log('notify playClick finish');
                self._stopEvent.notify(help);
            }, help.duration);
        } else {
            self._stopEvent.notify(help);
        }
    };

    p.playMove = function(help) {
        var self = this;
        console.log('playMove help');
        //TODO
        setTimeout(function() {
            console.log('stop playMove');
            self._stopEvent.notify(help);
        }, help.duration);
    };

    p.playDelete = function(help) {
        var self = this;
        console.log('playDelete help');
        //TODO
        setTimeout(function() {
            console.log('stop playDelete');
            self._stopEvent.notify(help);
        }, help.duration);
    };



})(Entry.Workspace.prototype);
