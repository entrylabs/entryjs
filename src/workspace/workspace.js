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


    this._stopEvent = new Entry.Event(this);
};

(function(p) {

    p.getBoard = function(){return this._board;};
    p.getBlockMenu = function(){return this._blockMenu;};

    p.playAddBlock = function(help) {
        var self = this;
        var targetBlock;
        if (help.cloneId) {
            targetBlock = this._blockMenu.findById(help.cloneId);
            if (!targetBlock)
                targetBlock = this._board.findById(help.cloneId);
        } else {
            targetBlock = this._blockMenu.findById(help.target);
        }

        if (!targetBlock)
            return;

        if (help.dest.id) { // find x,y by id
            var destBlock = this._board.findById(help.dest.id);
            help.dest.x = this.getBlockMenu()._svgWidth + destBlock.view.x;
            help.dest.y = destBlock.view.y + destBlock.view.height;
        } //else x,y was already known

        var blockView = targetBlock.view;
        var board = blockView.getBoard();

        // mousedown
        board.set({dragBlock:blockView});
        var cloneId = board.cloneThread();
        help.cloneId = cloneId;
        //var cloneId = clonedThread.getFirstBlock().id;
        //console.log('cloneId=',cloneId);
        //help.cloneId = cloneId;
        var observer = blockView.moveBoardBlockObserver;
        if (observer) observer.destroy();

        var distanceX = help.dest.x;
        var distanceY = help.dest.y;

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

            self._stopEvent.notify(help);

        }, help.duration - 300);
    };

    p.playMoveBlock = function(help) {
        var self = this;
        var targetBlock;
        console.log('cloneId=',help.cloneId);
        if (help.cloneId) {
            targetBlock = this._board.findById(help.cloneId);
        } else {
            targetBlock = this._board.findById(help.target);
        }

        if (help.dest.id) { // find x,y by id
            var destBlock = this._board.findById(help.dest.id);
            help.dest.x = this.getBlockMenu()._svgWidth + destBlock.view.x;
            help.dest.y = destBlock.view.y + destBlock.view.height;
        } //else x,y was already known

        var blockView = targetBlock.view;
        var board = blockView.getBoard();

        // mousedown
        board.set({dragBlock:blockView});
        //board.cloneThread();
        var observer = blockView.moveBoardBlockObserver;
        if (observer) observer.destroy();

        var distanceX = help.dest.x;
        var distanceY = help.dest.y;

        blockView._moveTo(distanceX,
                          distanceY,
                          true,
                          help.duration - 300);

        var boardOffset = this.getBoard().offset;
        var blockMenuOffset = this.getBlockMenu().offset;

        var offsetX = boardOffset.left - blockMenuOffset.left,
            offsetY = boardOffset.top - blockMenuOffset.top;

        blockView._moveTo(
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

            self._stopEvent.notify(help);

        }, help.duration - 300);

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
