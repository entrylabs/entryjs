/*
 *
 */
"use strict";

goog.provide("Entry.Workspace");
goog.require("Entry.Model");

Entry.Workspace = function(blockMenu, board) {
    blockMenu.workspace = this;
    board.workspace = this;

    this._blockMenu = blockMenu;
    this._board = board;
};

(function(p) {

    p.getBoard = function(){return this._board;};
    p.getBlockMenu = function(){return this._blockMenu;};

})(Entry.Workspace.prototype);
