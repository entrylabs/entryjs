/*
 *
 */
"use strict";

goog.provide("Entry.Workspace");

goog.require("Entry.Model");
goog.require("Entry.FieldTrashcan");

Entry.Workspace = function(options) {
    Entry.Model(this, false);
    this.observe(this, "_handleChangeBoard", ["selectedBoard"], false);
    this.trashcan = new Entry.FieldTrashcan();
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
        this.set({selectedBoard:this.board});
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

    if (Entry.keyPressed)
        Entry.keyPressed.attach(this, this._keyboardControl);

    // view state change event
    this.changeEvent = new Entry.Event(this);

    Entry.commander.setCurrentEditor("board", this.board);

    this.textType = Entry.Vim.TEXT_TYPE_PY;
};

Entry.Workspace.MODE_BOARD = 0;
Entry.Workspace.MODE_VIMBOARD = 1;
Entry.Workspace.MODE_OVERLAYBOARD = 2;

(function(p) {
    p.schema = {
        selectedBlockView: null,
        selectedBoard: null
    };

    p.getBoard = function(){return this.board;};

    p.getSelectedBoard = function(){return this.selectedBoard;};

    p.getBlockMenu = function(){return this.blockMenu;};

    p.getVimBoard = function(){return this.vimBoard;};

    p.getMode = function() {return this.mode;};

    p.setMode = function(mode, message){
        if (typeof mode === 'number') {
            this.mode = mode;
        } else {
            this.mode = mode.boardType;
            this.runType = mode.runType || this.runType;
            this.textType = mode.textType || this.textType;
        }

        switch (this.mode) {
            case this.oldMode:
                return;

            case Entry.Workspace.MODE_VIMBOARD:
                try {
                    if (this.board) this.board.hide();
                    if (this.overlayBoard) this.overlayBoard.hide();
                    this.set({selectedBoard:this.vimBoard});
                    this.vimBoard.show();
                    this.codeToText(this.board.code, mode);
                    this.blockMenu.renderText();
                    this.board.clear();
                    this.oldMode = this.mode;
                    this.oldTextType = this.textType;
                } catch(e) {}

                break;

            case Entry.Workspace.MODE_BOARD:
                try {
                    this.board.show();
                    this.set({selectedBoard:this.board});
                    this.textToCode(this.oldMode, this.oldTextType);
                    if (this.vimBoard) this.vimBoard.hide();
                    if (this.overlayBoard) this.overlayBoard.hide();
                    this.blockMenu.renderBlock();
                    this.oldMode = this.mode;
                    this.oldTextType = this.textType;
                } catch(e) {
                    if (this.board) this.board.hide();
                    this.set({selectedBoard:this.vimBoard});
                    this.mode = Entry.Workspace.MODE_VIMBOARD;

                    if(this.oldTextType == Entry.Vim.PARSER_TYPE_JS_TO_BLOCK) {
                        mode.boardType = Entry.Workspace.MODE_VIMBOARD;
                        mode.textType = Entry.Vim.TEXT_TYPE_JS;
                        mode.runType = Entry.Vim.MAZE_MODE;
                        this.oldTextType = Entry.Vim.PARSER_TYPE_JS_TO_BLOCK;
                        Entry.dispatchEvent("changeMode", mode);
                        Ntry.dispatchEvent("textError", mode);
                    } else if(this.oldTextType == Entry.Vim.PARSER_TYPE_PY_TO_BLOCK) {
                        mode.boardType = Entry.Workspace.MODE_VIMBOARD;
                        mode.textType = Entry.Vim.TEXT_TYPE_PY;
                        mode.runType = Entry.Vim.WORKSPACE_MODE;
                        this.oldTextType = Entry.Vim.PARSER_TYPE_PY_TO_BLOCK;
                        //console.log(("mode", mode);
                        Entry.dispatchEvent("changeMode", mode);
                    }

                    //throw e;
                }
                Entry.commander.setCurrentEditor("board", this.board);
                break;

            case Entry.Workspace.MODE_OVERLAYBOARD:
                if (!this.overlayBoard)
                    this.initOverlayBoard();
                this.overlayBoard.show();
                this.set({selectedBoard:this.overlayBoard});
                Entry.commander.setCurrentEditor("board", this.overlayBoard);
                this.oldMode = this.mode;
                break;
        }

        this.changeEvent.notify(message);
    };

    p.changeBoardCode = function(code) {
        this._syncTextCode();
        this.board.changeCode(code);
        if (this.mode === Entry.Workspace.MODE_VIMBOARD) {

            this.codeToText(this.board.code);
        }
    };

    p.changeOverlayBoardCode = function(code) {
        if (this.overlayBoard)
            this.overlayBoard.changeCode(code);
    };

    p.changeBlockMenuCode = function(code) {
        this.blockMenu.changeCode(code);
    };

    p.textToCode = function(mode, oldTextType) {
        if (mode != Entry.Workspace.MODE_VIMBOARD) return;
        var that = this;

        var changedCode = this.vimBoard.textToCode(oldTextType);
        var board = this.board;
        var code = board.code;

        code.load(changedCode);
        code.createView(board);

        this.board.reDraw();
        setTimeout(function() {
            that.board.alignThreads();
        }, 0);
    };

    p.loadCodeFromText = function(mode) {
        if (mode != Entry.Workspace.MODE_VIMBOARD) return;
        var changedCode = this.vimBoard.textToCode(this.textType);
        var board = this.board;
        var code = board.code;
        code.load(changedCode);
    };

    p.codeToText = function(code, mode) {
        return this.vimBoard.codeToText(code, mode);
    };

    p.getCodeToText = function(code) {
        return this.vimBoard.getCodeToText(code);
    };

    p._setSelectedBlockView = function() {
        var view = 'selectedBlockView';
        var blockView = this.board[view] ||
            this.blockMenu[view] ||
            (this.overlayBoard ? this.overlayBoard[view] : null);
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
        this.overlayBoard.observe(this, "_setSelectedBlockView", ["selectedBlockView"], false);
    };

    p._keyboardControl = function(e) {
        var keyCode = e.keyCode || e.which,
            ctrlKey = e.ctrlKey;

        if (Entry.Utils.isInInput(e)) return;

        var blockView = this.selectedBlockView;

        if (blockView && !blockView.isInBlockMenu && blockView.block.isDeletable()) {
            if (keyCode == 8 || keyCode == 46) { //destroy
                Entry.do("destroyBlock", blockView.block);
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
                Entry.do('addThread', Entry.clipboard).value
                    .getFirstBlock().copyToClipboard();
        }
    };

    p._handleChangeBoard = function() {
        var board = this.selectedBoard;
        if (!board) return;
        if (board.constructor === Entry.Board)
            this.trashcan.setBoard(board);
    };


    p._syncTextCode = function() {
        if (this.mode !== Entry.Workspace.MODE_VIMBOARD)
            return;

        var changedCode = this.vimBoard.textToCode(this.textType);
        var board = this.board;
        var code = board.code;
        code.load(changedCode);
        code.createView(board);
        this.board.alignThreads();
    };

    p.addVimBoard = function(dom) {
        if (this.vimBoard) return;
        this.vimBoard = new Entry.Vim(dom);
        this.vimBoard.workspace = this;
        this.vimBoard.hide();
    };

})(Entry.Workspace.prototype);
