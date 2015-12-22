/*
 *
 */
"use strict";

goog.provide("Entry.Workspace");
goog.require("Entry.Model");

Entry.Workspace = function(options) {
    var option = options.blockMenu;
    if (option) {
        this.blockMenu = new Entry.BlockMenu(option.domId, option.align);
        this.blockMenu.workspace = this;
    }

    option = options.board;
    if (option) {
        this.board = new Entry.Board(option.domId);
        this.board.workspace = this;
    }

    option = options.vimBoard;
    if (option) {
        this.vimBoard = new Entry.Vim(option.domId);
        this.vimBoard.workspace = this;
    }

    this.mode = Entry.Workspace.MODE_BOARD;
};

Entry.Workspace.MODE_BOARD = 0;
Entry.Workspace.MODE_VIMBOARD = 1;



(function(p) {
    p.getBoard = function(){return this.board;};

    p.getBlockMenu = function(){return this.blockMenu;};

    p.getVimBoard = function(){return this.vimBoard;};

    p.getMode = function() {return this.mode;};

    p.setMode = function(mode){
        if (this.mode == mode) return;
        this.mode = mode;
        if (mode == Entry.Workspace.MODE_VIMBOARD) {
            this.board.hide();
            this.vimBoard.show();
        } else {
            this.vimBoard.hide();
            this.board.show();
        }
    };

    p.changeBoardCode = function(code) {
        var targetBoard = this.mode == Entry.Workspace.MODE_BOARD ?
            this.board : this.vimBoard;
        targetBoard.changeCode(code);
    };

    p.changeBlockMenuCode = function(code) {
        this.blockMenu.changeCode(code);
    };

    p.textToCode = function() {
        if (this.mode !== Entry.Workspace.MODE_VIMBOARD) return;
    };

    p.codeToText = function(code) {
        if (this.mode !== Entry.Workspace.MODE_VIMBOARD) return;
        this.vimBoard.codeToText(code);
    };


})(Entry.Workspace.prototype);
