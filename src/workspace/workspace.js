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


    this.svgGroup = blockMenu.snap.group();

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
        board.cloneThread(false);

        var distanceX = this.getBlockMenu()._svgWidth + destBlock.view.x;
        var distanceY = destBlock.view.y + destBlock.view.height;

        blockView._moveTo(distanceX,
                          distanceY,
                          true,
                          help.duration - 300);

        var boardOffset = this.getBoard().offset;
        var blockMenuOffset = this.getBlockMenu().offset;

        var offsetX = boardOffset.left - blockMenuOffset.left,
            offsetY = boardOffset.top - blockMenuOffset.top;

        this.getBoard().dragBlock._moveTo(
                          distanceX-offsetX,
                          distanceY-offsetY,
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

    p.moveMouse = function(startpos, endPos) {

    };

    p.generateImage = function(imagePath) {
        var block = this.getBoard();
        var dom = block.svgDom[0];
        var PosX = dom.clientWidth / 2;
        var PosY = dom.clientHeight / 2;

        this.svgGroup = this._board.snap.group();
        this.image = this.svgGroup.image (
                imagePath , PosX, PosY, 30, 30
            );
    };

})(Entry.Workspace.prototype);
