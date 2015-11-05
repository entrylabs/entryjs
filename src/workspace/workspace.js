/*
 *
 */
"use strict";

goog.provide("Entry.Workspace");

Entry.Workspace = function(blockMenu, board) {
    this._blockMenu = blockMenu;
    this._board = board;
    blockMenu.workspace = this;
    board.workspace = this;
};

(function(p) {
    p.getBoard = function(){return this._board;};
    p.getBlockMenu = function(){return this._blockMenu;};
})(Entry.Workspace.prototype);
