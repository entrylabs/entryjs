/*
 *
 */
"use strict";

goog.provide("Entry.Workspace");
goog.require("Entry.Model");

Entry.Workspace = function(options) {
    Entry.Model(this, false);
    var that = this;

    var option = options.blockMenu;
    if (option) {
        this.blockMenu = new Entry.BlockMenu(
            option.dom,
            option.align,
            option.categoryData,
            option.scroll
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

    if (Entry.keyPressed)
        Entry.keyPressed.attach(this, this._keyboardControl);
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
                try {
                    this.selectedBoard = this.board;
                    this.board.show();
                    this.textToCode();
                    if (this.vimBoard) this.vimBoard.hide();
                    if (this.overlayBoard) this.overlayBoard.hide();
                    this.blockMenu.renderBlock();
                } catch(e) {
                    if (this.board) this.board.hide();
                    this.selectedBoard = this.vimBoard;
                    Entry.dispatchEvent('setProgrammingMode', Entry.Workspace.MODE_VIMBOARD);
                    throw e;
                }
                break;
            case Entry.Workspace.MODE_OVERLAYBOARD:
                if (!this.overlayBoard)
                    this.initOverlayBoard();
                this.selectedBoard = this.overlayBoard;
                this.overlayBoard.show();
                break;
        }
        this.mode = mode;
    };

    p.changeBoardCode = function(code) {
        this.board.changeCode(code);
    };

    p.changeOverlayBoardCode = function(code) {
        if (this.overlayBoard)
            this.overlayBoard.changeCode(code);
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
            workspace: this,
            isOverlay: true
        });
        this.overlayBoard.changeCode(new Entry.Code([]));
        this.overlayBoard.workspace = this;
    };

    p._keyboardControl = function(e) {
        var keyCode = e.keyCode || e.which,
            ctrlKey = e.ctrlKey;

        if (Entry.Utils.isInInput(e)) return;

        var blockView = this.selectedBlockView;

        if (blockView && !blockView.isInBlockMenu && blockView.block.isDeletable()) {
            if (keyCode == 8 || keyCode == 46) { //destroy
                blockView.block.doDestroy(true);
                e.preventDefault();
            } else if (ctrlKey) {
                if (keyCode == 67) //copy
                    blockView.block.copyToClipboard();
                else if (keyCode == 88) { //cut
                    (function(block) {
                        block.copyToClipboard();
                        block.destroy(true, true);
                        blockView.getBoard().setSelectedBlock(null);
                    })(blockView.block);
                }
            }
        }

        if (ctrlKey && keyCode == 86) { //paste
            var board = this.selectedBoard;
            if (board && board instanceof Entry.Board && Entry.clipboard)
                board.code.createThread(Entry.clipboard)
                    .getFirstBlock().copyToClipboard();
        }
    };

})(Entry.Workspace.prototype);
