/*
 *
 */
"use strict";

goog.provide("Entry.Workspace");
goog.require("Entry.Model");

Entry.Workspace = function(options) {
    Entry.Model(this, false);

    var option = options.blockMenu;
    if (option) {
        this.blockMenu = new Entry.BlockMenu(
            option.dom,
            option.align,
            option.categoryData
        );
        this.blockMenu.workspace = this;
        this.blockMenu.observe(this, "_setSelectedBlockView", ["selectedBlockView"], false);
    }

    option = options.board;
    if (option) {
        option.workspace = this;
        this.board = new Entry.Board(option);
        this.board.observe(this, "_setSelectedBlockView", ["selectedBlockView"], false);
    }

    option = options.vimBoard;
    if (option) {
        this.vimBoard = new Entry.Vim(option.dom);
        this.vimBoard.workspace = this;
    }

    if (this.board && this.vimBoard)
        this.vimBoard.hide();

    Entry.GlobalSvg.createDom();

    this.mode = Entry.Workspace.MODE_BOARD;
    this.selectedBoard = this.board;
};

Entry.Workspace.MODE_BOARD = 0;
Entry.Workspace.MODE_VIMBOARD = 1;
Entry.Workspace.MODE_OVERLAYBOARD = 2;

(function(p) {
    p.schema = {
        selectedBlockView: null
    };
    p.getBoard = function(){return this.board;};

    p.getSelectedBoard = function(){return this.selectedBoard;};

    p.getBlockMenu = function(){return this.blockMenu;};

    p.getVimBoard = function(){return this.vimBoard;};

    p.getMode = function() {return this.mode;};

    p.setMode = function(mode){
        mode = Number(mode);
        switch (mode) {
            case this.mode:
                return;
            case Entry.Workspace.MODE_VIMBOARD:
                if (this.board) this.board.hide();
                if (this.overlayBoard) this.overlayBoard.hide();
                this.selectedBoard = this.vimBoard;
                this.vimBoard.show();
                this.vimBoard.codeToText(this.board.code);
                this.blockMenu.renderText();
                this.board.clear();
                break;
            case Entry.Workspace.MODE_BOARD:
                if (this.vimBoard) this.vimBoard.hide();
                if (this.overlayBoard) this.overlayBoard.hide();
                this.selectedBoard = this.board;
                this.board.show();
                this.textToCode();
                this.blockMenu.renderBlock();
                break;
            case Entry.Workspace.MODE_OVERLAYBOARD:
                if (!this.overlayBoard)
                    this.initOverlayBoard();
                this.overlayBoard.show();
                break;
        }
        this.mode = mode;
    };

    p.changeBoardCode = function(code) {
        this.selectedBoard.changeCode(code);
    };

    p.changeBlockMenuCode = function(code) {
        this.blockMenu.changeCode(code);
    };

    p.textToCode = function() {
        if (this.mode != Entry.Workspace.MODE_VIMBOARD) return;
        var changedCode = this.vimBoard.textToCode();
        this.board.code.load(changedCode);
        this.board.alignThreads();
    };

    p.codeToText = function(code) {
        return this.vimBoard.codeToText(code);
    };

    p.getCodeToText = function(code) {
        return this.vimBoard.getCodeToText(code);
    };

    p._setSelectedBlockView = function() {
        var blockView = this.board.selectedBlockView || this.blockMenu.selectedBlockView;
        this.set({selectedBlockView:blockView});
    };

    p.initOverlayBoard = function() {
        this.overlayBoard = new Entry.Board({
            dom: this.board.view,
            workspace: this
        });
        this.overlayBoard.changeCode(new Entry.Code([]));
        this.overlayBoard.workspace = this;
    };

})(Entry.Workspace.prototype);
