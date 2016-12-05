/*
 *
 */
"use strict";

goog.provide("Entry.Workspace");

goog.require("Entry.Model");
goog.require("Entry.FieldTrashcan");
goog.require("Entry.TextCodingUtil");

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

    if (options.textType !== undefined)
        this.textType = options.textType;
    else this.textType = Entry.Vim.TEXT_TYPE_PY;

    this.oldMode = Entry.Workspace.MODE_BOARD;
    this.mode = Entry.Workspace.MODE_BOARD;
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

    p.setMode = function(mode, message) {
        if (!isNaN(mode)) this.mode = mode;
        else {
            this.mode = mode.boardType;
            this.runType = mode.runType;
            this.textType = mode.textType;
        }

        this.mode = Number(this.mode);
        if (this.oldMode === this.mode)
            return;


        switch (this.mode) {
            case Entry.Workspace.MODE_VIMBOARD:
                    /*if(Entry.playground && Entry.playground.object) {
                        Entry.TextCodingUtil._currentObject = Entry.playground.object;
                        Entry.TextCodingUtil._oldObject = Entry.TextCodingUtil._currentObject;
                    }*/
                    if (this.board) this.board.hide();
                    if (this.overlayBoard) this.overlayBoard.hide();
                    this.blockMenu.banClass('textMode');
                    this.set({selectedBoard:this.vimBoard});
                    this.vimBoard.show();
                    this.codeToText(this.board.code, mode);
                    this.blockMenu.renderText();
                    this.board.clear();
                    this.oldTextType = this.textType;
                break;

            case Entry.Workspace.MODE_BOARD: 
                try {
                    this.board.show();
                    this.blockMenu.unbanClass('textMode');
                    this.set({selectedBoard:this.board});
                    if (this.vimBoard) {
                        this.textToCode(this.oldMode, this.oldTextType);
                    }
                    if (this.overlayBoard)
                        this.overlayBoard.hide();
                    this.blockMenu.renderBlock();
                    this.oldTextType = this.textType;
                    this.vimBoard && this.vimBoard.hide();
                    this.vimBoard._parser._isError = false; 
                } catch(e) {
                    this.vimBoard._parser._isError = true; 
                    if(this.board && this.board.code)
                        this.board.code.clear();
                    if (this.board) this.board.hide();
                    this.set({selectedBoard:this.vimBoard});
                    this.blockMenu.banClass('textMode');
                    this.mode = Entry.Workspace.MODE_VIMBOARD;

                    //console.log(("this.oldTextType", this.oldTextType);

                    if(this.oldTextType == Entry.Vim.TEXT_TYPE_JS) {
                        mode.boardType = Entry.Workspace.MODE_VIMBOARD;
                        mode.textType = Entry.Vim.TEXT_TYPE_JS;
                        mode.runType = Entry.Vim.MAZE_MODE;
                        this.oldTextType = Entry.Vim.TEXT_TYPE_JS;
                    } else if(this.oldTextType == Entry.Vim.TEXT_TYPE_PY) {
                        mode.boardType = Entry.Workspace.MODE_VIMBOARD;
                        mode.textType = Entry.Vim.TEXT_TYPE_PY;
                        mode.runType = Entry.Vim.WORKSPACE_MODE;
                        this.oldTextType = Entry.Vim.TEXT_TYPE_PY;
                        //console.log(("mode", mode);
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
                break;
        }

        this.oldMode = this.mode;

        this.changeEvent.notify(message);
    };

    p.changeBoardCode = function(code) {
        this._syncTextCode();
        this.board.changeCode(code);
        if (this.mode === Entry.Workspace.MODE_VIMBOARD) {
            var mode = {};
            mode.textType = this.textType;
            mode.boardType = this.boardType;
            mode.runType = this.runType;
            this.codeToText(this.board.code, mode);
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
        if (mode != Entry.Workspace.MODE_VIMBOARD)
            return;

        var that = this;

        var changedCode = this.vimBoard.textToCode(oldTextType);
        console.log("changedCode", changedCode);
        if(changedCode.length != 0) {
            var board = this.board;
            var code = board.code;
            code.load(changedCode);
            this.changeBoardCode(code);
            console.log("here come in4");
            setTimeout(function() {
                code.view.reDraw();
                that.board.alignThreads();
            }, 0);
        }
    };

    p.loadCodeFromText = function(mode) {
        if (mode != Entry.Workspace.MODE_VIMBOARD) return;
        var changedCode = this.vimBoard.textToCode(this.textType);
        var board = this.board;
        var code = board.code;
        code.load(changedCode);
    };

    p.codeToText = function(code, mode) {
        if (!this.vimBoard)
            return;
        return this.vimBoard.codeToText(code, mode);

    };

    p.getCodeToText = function(code) {
        if (!this.vimBoard) return;

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

    p._keyboardControl = function(e, isForce) {
        var keyCode = e.keyCode || e.which,
            ctrlKey = e.ctrlKey,
            shiftKey = e.shiftKey,
            altKey = e.altKey;

        if (Entry.Utils.isInInput(e) && !isForce)
            return;

        var isVimMode = this._isVimMode();

        var blockView = this.selectedBlockView;

        if (ctrlKey) {
            switch (keyCode) {
                case 86:  //paste
                    var board = this.selectedBoard;
                    if (board && board instanceof Entry.Board && Entry.clipboard)
                        Entry.do('addThread', Entry.clipboard).value
                            .getFirstBlock().copyToClipboard();
                    break;
                case 219: //setMode(block) for textcoding
                    if (Entry.playground && !Entry.playground.object) {
                        if (isVimMode) {
                            var message = "오브젝트가 존재하지 않습니다. 오브젝트를 추가한 후 시도해주세요.";
                            alert(message);
                            return;
                        }
                    }

                    var oldMode = Entry.getMainWS().oldMode;
                    if(oldMode == Entry.Workspace.MODE_OVERLAYBOARD)
                        return;

                    var message = Entry.TextCodingUtil.isNamesIncludeSpace()
                    if(message) {
                        alert(message);
                        return;
                    }

                    var mode = {};
                    mode.boardType = Entry.Workspace.MODE_BOARD;
                    mode.textType = -1;
                    this.setMode(mode);
                    break;
                case 221: //setMode(python) for textcoding
                    if (Entry.playground && !Entry.playground.object) {
                        if (this.oldMode === Entry.Workspace.MODE_BOARD) {
                            var message = "오브젝트가 존재하지 않습니다. 오브젝트를 추가한 후 시도해주세요.";
                            alert(message);
                            return;
                        }
                    }

                    var message;
                    message = Entry.TextCodingUtil.canConvertTextModeForOverlayMode(Entry.Workspace.MODE_VIMBOARD);
                    if(message) {
                        alert(message);
                        return;
                    }

                    var message =Entry.TextCodingUtil.isNamesIncludeSpace()
                    if(message) {
                        alert(message);
                        return;
                    }

                    var mode = {};
                    mode.boardType = Entry.Workspace.MODE_VIMBOARD;
                    mode.textType = Entry.Vim.TEXT_TYPE_PY;
                    mode.runType = Entry.Vim.WORKSPACE_MODE;
                    this.setMode(mode);
                    break;
                case 67:
                    if (blockView && !blockView.isInBlockMenu && blockView.block.isDeletable()) {
                        blockView.block.copyToClipboard();
                    }
                    break;
                case 88:
                    if (blockView && !blockView.isInBlockMenu && blockView.block.isDeletable()) {
                        (function(block) {
                            block.copyToClipboard();
                            block.destroy(true, true);
                            blockView.getBoard().setSelectedBlock(null);
                        })(blockView.block);
                    }
                    break;
            }
        } else if (altKey) {
            if (Entry.playground) {
                if(!Entry.playground.object) {
                    var message = "오브젝트가 존재하지 않습니다. 오브젝트를 추가한 후 시도해주세요.";
                    alert(message);
                    return;
                }

                switch (keyCode) {
                    case 49:
                        Entry.playground.changeViewMode('code');
                        e.preventDefault();
                        break;
                    case 50:
                        Entry.playground.changeViewMode('picture');
                        e.preventDefault();
                        break;
                    case 51:
                        Entry.playground.changeViewMode('sound');
                        e.preventDefault();
                        break;
                    case 52:
                        Entry.playground.toggleOnVariableView();
                        Entry.playground.changeViewMode('variable');
                        e.preventDefault();
                        break;
                    case 219:
                        if (Entry.container) {
                            e.preventDefault();
                            Entry.container.selectNeighborObject('prev');
                        }
                        break;
                    case 221:
                        if (Entry.container) {
                            e.preventDefault();
                            Entry.container.selectNeighborObject('next');
                        }
                        break;
                }
            }
        } else if (shiftKey) {
            switch (keyCode) {
                case 9:
                    if (isVimMode) {
                        CodeMirror.commands.indentLess(this.vimBoard.codeMirror);
                        e.preventDefault();
                    }
                    break;
            }
        } else {
            switch (keyCode) {
                case 9:
                    if (isVimMode) {
                        CodeMirror.commands.indentMore(this.vimBoard.codeMirror);
                        e.preventDefault();
                    }
                    break;
                case 8:
                case 46:
                    if (blockView && !blockView.isInBlockMenu && blockView.block.isDeletable()) {
                        Entry.do("destroyBlock", blockView.block);
                        e.preventDefault();
                    }
                    break;
            }
        }
        setTimeout(function() { 
            Entry.disposeEvent && Entry.disposeEvent.notify(e);
        }, 0);
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
        console.log("syncTextCode", code);
        if(code) {
            code.load(changedCode);
            code.createView(board);
            this.board.alignThreads();
        }
    };

    p.addVimBoard = function(dom) {
        if (this.vimBoard) return;
        this.vimBoard = new Entry.Vim(dom);
        this.vimBoard.workspace = this;
        this.vimBoard.hide();
    };

    p.getParserType = function() {
        return this.vimBoard._parserType;
    };

    p.getBlockViewRenderMode = function() {
        switch (this.mode) {
            case Entry.Workspace.MODE_BOARD:
            case Entry.Workspace.MODE_OVERLAYBOARD:
                return Entry.BlockView.RENDER_MODE_BLOCK;
            case Entry.Workspace.MODE_VIMBOARD:
                return Entry.BlockView.RENDER_MODE_TEXT;
        }
    };

    p._isVimMode = function() {
        return this.oldMode === Entry.Workspace.MODE_VIMBOARD;
    };

})(Entry.Workspace.prototype);
