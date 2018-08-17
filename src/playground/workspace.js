/*
 *
 */
'use strict';

Entry.Workspace = function(options) {
    Entry.Model(this, false);

    this.dSetMode = Entry.Utils.debounce(this.setMode, 200);
    this.dReDraw = Entry.Utils.debounce(this.reDraw, 150);

    this.observe(this, '_handleChangeBoard', ['selectedBoard'], false);
    this.trashcan = new Entry.FieldTrashcan();

    this.readOnly = options.readOnly === undefined ? false : options.readOnly;

    this.blockViewMouseUpEvent = new Entry.Event(this);
    this.widgetUpdateEvent = new Entry.Event(this);
    this.reDrawEvent = new Entry.Event(this);
    this._blockViewMouseUpEvent = null;
    this.widgetUpdateEveryTime = false;
    this._hoverBlockView = null;

    var option = options.blockMenu;
    if (option) {
        this.blockMenu = new Entry.BlockMenu(
            option.dom,
            option.align,
            option.categoryData,
            option.scroll,
            this.readOnly
        );
        this.blockMenu.workspace = this;
        this.blockMenu.observe(
            this,
            '_setSelectedBlockView',
            ['selectedBlockView'],
            false
        );
    }

    option = options.board;
    if (option) {
        option.workspace = this;
        option.readOnly = this.readOnly;
        this.board = new Entry.Board(option);
        this.board.observe(
            this,
            '_setSelectedBlockView',
            ['selectedBlockView'],
            false
        );
        this.set({ selectedBoard: this.board });
    }

    option = options.vimBoard;
    if (option) {
        this.vimBoard = new Entry.Vim(option.dom);
        this.vimBoard.workspace = this;
    }

    if (this.board && this.vimBoard) this.vimBoard.hide();

    Entry.GlobalSvg.createDom();

    this.mode = Entry.Workspace.MODE_BOARD;

    this.attachKeyboardCapture();

    // view state change event
    this.changeEvent = new Entry.Event(this);

    Entry.commander.setCurrentEditor('board', this.board);

    if (options.textType !== undefined) this.textType = options.textType;
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
        selectedBoard: null,
    };

    p.getBoard = function() {
        return this.board;
    };

    p.getSelectedBoard = function() {
        return this.selectedBoard;
    };

    p.getBlockMenu = function() {
        return this.blockMenu;
    };

    p.getVimBoard = function() {
        return this.vimBoard;
    };

    p.getMode = function() {
        return this.mode;
    };

    p.setMode = function(mode, message, isForce) {
        if (
            Entry.options &&
            !Entry.options.textCodingEnable &&
            Entry.Workspace.MODE_VIMBOARD === mode.boardType
        ) {
            return;
        }

        Entry.disposeEvent.notify();

        var playground = Entry.playground;

        if (!isForce && !checkObjectAndAlert(playground && playground.object))
            return false; // change mode fail

        if (Entry.Utils.isNumber(mode)) this.mode = mode;
        else {
            this.mode = mode.boardType;
            this.runType = mode.runType;
            this.textType = mode.textType;
        }

        this.mode = Number(this.mode);
        if (this.oldMode === this.mode) return;

        const VIM = Entry.Vim;
        const WORKSPACE = Entry.Workspace;
        const blockMenu = this.blockMenu;
        const Util = Entry.TextCodingUtil;

        switch (this.mode) {
            case WORKSPACE.MODE_VIMBOARD:
                const alertMessage =
                    Util.validateVariableToPython() ||
                    Util.validateFunctionToPython();
                
                if (alertMessage && alertMessage.message) {
                    entrylms.alert(alertMessage.message);
                    
                    if(alertMessage.type === 'error') {
                        const mode = {};
                        mode.boardType = WORKSPACE.MODE_BOARD;
                        mode.textType = -1;
                        Entry.getMainWS().setMode(mode);
                        break;
                    }
                }

                const invalidEditorModeErrorMessage = Util.canConvertTextModeForOverlayMode(
                    Entry.Workspace.MODE_VIMBOARD
                );
                if (invalidEditorModeErrorMessage) {
                    entrylms.alert(invalidEditorModeErrorMessage);
                    return;
                }

                try {
                    this.board && this.board.hide();
                    this.overlayBoard && this.overlayBoard.hide();
                    this.set({ selectedBoard: this.vimBoard });
                    this.vimBoard.show();
                    blockMenu.banClass('functionInit', true);
                    this.codeToText(this.board.code, mode);
                    this.oldTextType = this.textType;
                    this.board.clear();
                } catch (e) {
                    this.vimBoard.hide();
                    this.board.show();
                    blockMenu.unbanClass('functionInit');
                    this.set({ selectedBoard: this.board });
                    this.mode = WORKSPACE.MODE_BOARD;
                    mode.boardType = WORKSPACE.MODE_BOARD;
                    if (this.oldTextType == VIM.TEXT_TYPE_JS) {
                        mode.runType = VIM.MAZE_MODE;
                    } else if (this.oldTextType == VIM.TEXT_TYPE_PY) {
                        mode.runType = VIM.WORKSPACE_MODE;
                    }
                    e.block &&
                        Entry.getMainWS() &&
                        Entry.getMainWS().board.activateBlock(e.block);
                }
                break;
            case WORKSPACE.MODE_BOARD:
                try {
                    this.board.show();
                    blockMenu.unbanClass('functionInit', true);
                    this.set({ selectedBoard: this.board });
                    this.textToCode(this.oldMode, this.oldTextType);
                    if (this.overlayBoard) this.overlayBoard.hide();
                    this.oldTextType = this.textType;
                    this.vimBoard && this.vimBoard.hide();
                } catch (e) {
                    if (this.board && this.board.code) this.board.code.clear();
                    if (this.board) this.board.hide();
                    this.set({ selectedBoard: this.vimBoard });
                    blockMenu.banClass('functionInit');
                    this.mode = WORKSPACE.MODE_VIMBOARD;

                    if (this.oldTextType == VIM.TEXT_TYPE_JS) {
                        mode.boardType = WORKSPACE.MODE_VIMBOARD;
                        mode.textType = VIM.TEXT_TYPE_JS;
                        mode.runType = VIM.MAZE_MODE;
                        this.oldTextType = VIM.TEXT_TYPE_JS;
                    } else if (this.oldTextType == VIM.TEXT_TYPE_PY) {
                        mode.boardType = WORKSPACE.MODE_VIMBOARD;
                        mode.textType = VIM.TEXT_TYPE_PY;
                        mode.runType = VIM.WORKSPACE_MODE;
                        this.oldTextType = VIM.TEXT_TYPE_PY;
                    }
                }
                Entry.commander.setCurrentEditor('board', this.board);
                break;

            case WORKSPACE.MODE_OVERLAYBOARD:
                if (this.oldMode == WORKSPACE.MODE_VIMBOARD)
                    this.overlayModefrom = WORKSPACE.MODE_VIMBOARD;
                else if (this.oldMode == WORKSPACE.MODE_BOARD)
                    this.overlayModefrom = WORKSPACE.MODE_BOARD;

                if (!this.overlayBoard) this.initOverlayBoard();
                this.overlayBoard.show();
                this.set({ selectedBoard: this.overlayBoard });
                Entry.commander.setCurrentEditor('board', this.overlayBoard);
                break;
        }

        this.oldMode = this.mode;
        Entry.isTextMode = this.mode == WORKSPACE.MODE_VIMBOARD;

        blockMenu.align();
        Entry.dispatchEvent('workspaceChangeMode');
        this.changeEvent.notify(message);
        Entry.dispatchEvent('cancelBlockMenuDynamic');

        function checkObjectAndAlert(object, message) {
            if (Entry.type === 'workspace' && !object) {
                entrylms.alert(
                    message || Lang.Workspace.object_not_exist_error
                );
                return false;
            }
            return true;
        }
    };

    p.changeBoardCode = function(code, cb) {
        this._syncTextCode();
        var isVim = this.mode === Entry.Workspace.MODE_VIMBOARD;
        this.board.changeCode(code, isVim, cb);
        if (isVim) {
            var mode = {};
            mode.textType = this.textType;
            mode.boardType = this.boardType;
            mode.runType = this.runType;
            this.codeToText(this.board.code, mode);
        }
    };

    p.changeOverlayBoardCode = function(code) {
        if (this.overlayBoard) this.overlayBoard.changeCode(code);
    };

    p.changeBlockMenuCode = function(code) {
        this.blockMenu.changeCode(code);
    };

    p.textToCode = function(mode, oldTextType) {
        if (!this.vimBoard || mode !== Entry.Workspace.MODE_VIMBOARD) return;

        var changedCode = this.vimBoard.textToCode(oldTextType);

        var board = this.board;
        var code = board.code;
        if (!code) return;

        code.load(changedCode);
        this.changeBoardCode(code);
        setTimeout(
            function() {
                if (code.view) {
                    code.view.reDraw();
                    this.board.alignThreads();
                }
            }.bind(this),
            0
        );
    };

    p.codeToText = function(code, mode) {
        if (!this.vimBoard) return;

        code = code || this.board.code;
        mode = mode || {
            textType: this.textType,
            boardType: this.boardType,
            runType: this.runType,
        };

        return this.vimBoard.codeToText(code, mode);
    };

    p.getCodeToText = function(code) {
        if (!this.vimBoard) return;

        return this.vimBoard.getCodeToText(code);
    };

    p._setSelectedBlockView = function() {
        var view = 'selectedBlockView';
        var blockView =
            this.board[view] ||
            this.blockMenu[view] ||
            (this.overlayBoard ? this.overlayBoard[view] : null);

        this._unbindBlockViewMouseUpEvent();

        this.set({ selectedBlockView: blockView });

        if (!blockView) return;

        this.setHoverBlockView();
        var that = this;
        this._blockViewMouseUpEvent = blockView.mouseUpEvent.attach(
            this,
            function() {
                that.blockViewMouseUpEvent.notify(blockView);
            }
        );
    };

    p.initOverlayBoard = function() {
        this.overlayBoard = new Entry.Board({
            dom: this.board.view,
            workspace: this,
            isOverlay: true,
        });
        this.overlayBoard.changeCode(new Entry.Code([]));
        this.overlayBoard.workspace = this;
        this.overlayBoard.observe(
            this,
            '_setSelectedBlockView',
            ['selectedBlockView'],
            false
        );
    };

    p._keyboardControl = function(e, isForce) {
        if (Entry.Loader && !Entry.Loader.isLoaded()) return;
        var keyCode = e.keyCode || e.which,
            ctrlKey = e.ctrlKey,
            shiftKey = e.shiftKey,
            altKey = e.altKey;
        var playground = Entry.playground;
        var object =
            playground && playground.object ? playground.object : undefined;

        if (Entry.Utils.isInInput(e) && !isForce) return;

        var isVimMode = this._isVimMode();

        var blockView = this.selectedBlockView;
        var board = this.selectedBoard;
        var isBoardReadOnly = board.readOnly;
        var checkKeyCodes;

        if (ctrlKey) {
            checkKeyCodes = [219, 221];

            if (checkKeyCodes.indexOf(keyCode) > -1) {
                if (!checkObjectAndAlert(object)) return;
            }

            switch (keyCode) {
                case 86: //paste
                    if (
                        !isBoardReadOnly &&
                        board &&
                        board instanceof Entry.Board &&
                        Entry.clipboard
                    ) {
                        Entry.do('addThread', Entry.clipboard)
                            .value.getFirstBlock()
                            .copyToClipboard();
                    }
                    break;
                case 219: //setMode(block) for textcoding ( ctrl + [ )
                    if (!Entry.options.textCodingEnable) {
                        return;
                    }
                    const oldMode = Entry.getMainWS().oldMode;
                    if (oldMode === Entry.Workspace.MODE_OVERLAYBOARD) return;

                    this.dSetMode({
                        boardType: Entry.Workspace.MODE_BOARD,
                        textType: -1,
                    });
                    e.preventDefault();
                    break;
                case 221: //setMode(python) for textcoding ( ctrl + ] )
                    if (!Entry.options.textCodingEnable) {
                        return;
                    }
                    
                    const message = Entry.TextCodingUtil.canConvertTextModeForOverlayMode(
                        Entry.Workspace.MODE_VIMBOARD
                    );
                    if (message) {
                        entrylms.alert(message);
                        return;
                    }

                    this.dSetMode({
                        boardType: Entry.Workspace.MODE_VIMBOARD,
                        textType: Entry.Vim.TEXT_TYPE_PY,
                        runType: Entry.Vim.WORKSPACE_MODE,
                    });
                    e.preventDefault();
                    break;
                case 67:
                    if (
                        blockView &&
                        !blockView.isInBlockMenu &&
                        blockView.block.isDeletable() &&
                        blockView.block.isCopyable()
                    ) {
                        blockView.block.copyToClipboard();
                    }
                    break;
                case 88:
                    if (
                        !isBoardReadOnly &&
                        blockView &&
                        !blockView.isInBlockMenu &&
                        blockView.block.isDeletable()
                    ) {
                        (function(block) {
                            block.copyToClipboard();
                            block.destroy(true, true);
                            blockView.getBoard().setSelectedBlock(null);
                        })(blockView.block);
                    }
                    break;
            }
        } else if (altKey) {
            checkKeyCodes = [49, 50, 51, 52, 219, 221];

            if (checkKeyCodes.indexOf(keyCode) > -1) {
                if (!checkObjectAndAlert(object)) return;
            }

            switch (keyCode) {
                case 49:
                    playground.changeViewMode('code');
                    e.preventDefault();
                    break;
                case 50:
                    playground.changeViewMode('picture');
                    e.preventDefault();
                    break;
                case 51:
                    playground.changeViewMode('sound');
                    e.preventDefault();
                    break;
                case 52:
                    playground.toggleOnVariableView();
                    playground.changeViewMode('variable');
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
        } else if (shiftKey) {
            switch (keyCode) {
                case 9:
                    if (isVimMode) {
                        CodeMirror.commands.indentLess(
                            this.vimBoard.codeMirror
                        );
                        e.preventDefault();
                    }
                    break;
            }
        } else {
            switch (keyCode) {
                case 9:
                    if (isVimMode) {
                        CodeMirror.commands.indentMore(
                            this.vimBoard.codeMirror
                        );
                        e.preventDefault();
                    }
                    break;
                case 8:
                case 46:
                    if (
                        !isBoardReadOnly &&
                        blockView &&
                        !blockView.isInBlockMenu &&
                        blockView.block.isDeletable() &&
                        !blockView.isFieldEditing()
                    ) {
                        Entry.do('destroyBlock', blockView.block);
                        this.board.set({ selectedBlockView: null });
                        e.preventDefault();
                    }
                    break;
            }
        }

        //delay for fields value applied
        setTimeout(function() {
            Entry.disposeEvent && Entry.disposeEvent.notify(e);
        }, 0);

        function checkObjectAndAlert(object, message) {
            if (!object) {
                message =
                    message ||
                    '오브젝트가 존재하지 않습니다. 오브젝트를 추가한 후 시도해주세요.';
                entrylms.alert(message);
                return false;
            }
            return true;
        }
    };

    p._handleChangeBoard = function() {
        var board = this.selectedBoard;
        if (!board) return;
        if (board.constructor === Entry.Board) this.trashcan.setBoard(board);
    };

    p._syncTextCode = function() {
        if (
            this.mode !== Entry.Workspace.MODE_VIMBOARD ||
            (Entry.engine && Entry.engine.isState('run'))
        )
            return;

        var changedCode = this.vimBoard.textToCode(this.textType);

        var board = this.board;
        var code = board.code;
        if (code) code.load(changedCode);

        var event = Entry.creationChangedEvent;
        event && event.notify(true);
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

    p.isVimMode = p._isVimMode;

    p.attachKeyboardCapture = function() {
        if (Entry.keyPressed) {
            this._keyboardEvent && this.detachKeyboardCapture();
            this._keyboardEvent = Entry.keyPressed.attach(
                this,
                this._keyboardControl
            );
        }
    };

    p.detachKeyboardCapture = function() {
        if (Entry.keyPressed && this._keyboardEvent) {
            this._keyboardEvent.destroy();
            delete this._keyboardEvent;
        }
    };

    p._unbindBlockViewMouseUpEvent = function() {
        if (this._blockViewMouseUpEvent) {
            this._blockViewMouseUpEvent.destroy();
            this._blockViewMouseUpEvent = null;
        }
    };

    p.setWidgetUpdateEveryTime = function(val) {
        this.widgetUpdateEveryTime = !!val;
    };

    p.syncCode = function() {
        switch (this.mode) {
            case Entry.Workspace.MODE_VIMBOARD:
                this._syncTextCode();
                break;
        }
    };

    p.setHoverBlockView = function(blockView) {
        var oldBlockView = this._hoverBlockView;
        oldBlockView && oldBlockView.resetBackgroundPath();

        this._hoverBlockView = blockView;
        blockView && blockView.setBackgroundPath();
    };

    p.reDraw = function() {
        var blockMenu = this.blockMenu;
        var board = this.board;

        blockMenu && blockMenu.reDraw();
        board && board.reDraw();

        if (blockMenu || board) {
            this.reDrawEvent.notify();
        }
    };

    p.getCurrentBoard = function() {
        const {
            MODE_BOARD,
            MODE_VIMBOARD,
            MODE_OVERLAYBOARD,
        } = Entry.Workspace;

        switch (this.mode) {
            case MODE_BOARD:
                return this.getBoard();
            case MODE_VIMBOARD:
                return this.getVimBoard();
            case MODE_OVERLAYBOARD:
                return this.overlayBoard;
        }
    };
})(Entry.Workspace.prototype);
