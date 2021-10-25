import { Destroyer } from '../util/destroyer/Destroyer';
import debounce from 'lodash/debounce';

Entry.Workspace = class Workspace {
    schema = {
        selectedBlockView: null,
        selectedBoard: null,
    };

    constructor(options) {
        Entry.Model(this, false);
        this._destroyer = this._destroyer || new Destroyer();
        this._destroyer.destroy();
        this.scale = 1;
        this.dSetMode = debounce(this.setMode, 200);
        this.dReDraw = debounce(this.reDraw, 150);

        this.observe(this, '_handleChangeBoard', ['selectedBoard'], false);
        this.trashcan = new Entry.FieldTrashcan();
        this.zoomController = new Entry.ZoomController();

        this.readOnly = options.readOnly === undefined ? false : options.readOnly;

        this.blockViewMouseUpEvent = new Entry.Event(this);
        this.widgetUpdateEvent = new Entry.Event(this);
        this.reDrawEvent = new Entry.Event(this);
        this._blockViewMouseUpEvent = null;
        this.widgetUpdateEveryTime = false;
        this._hoverBlockView = null;

        let option = options.blockMenu;
        if (option) {
            this.blockMenu = new Entry.BlockMenu(
                option.dom,
                option.align,
                option.categoryData,
                option.scroll
            );
            this._destroyer.add(this.blockMenu);
            this.blockMenu.workspace = this;
            this.blockMenu.observe(this, '_setSelectedBlockView', ['selectedBlockView'], false);
        }

        option = options.board;
        if (option) {
            option.workspace = this;
            option.readOnly = this.readOnly;
            this.board = new Entry.Board(option);
            this.board.observe(this, '_setSelectedBlockView', ['selectedBlockView'], false);
            this.set({ selectedBoard: this.board });

            if (this.blockMenu) {
                this.blockMenu.enableTrashcan();
            }
        }

        option = options.vimBoard;
        if (option) {
            this.vimBoard = new Entry.Vim(option.dom);
            this.vimBoard.workspace = this;
        }

        if (this.board && this.vimBoard) {
            this.vimBoard.hide();
        }

        Entry.GlobalSvg.createDom();

        this.mode = Entry.Workspace.MODE_BOARD;

        this.attachKeyboardCapture();

        // view state change event
        this.changeEvent = new Entry.Event(this);

        Entry.commander.setCurrentEditor('board', this.board);

        if (options.textType !== undefined) {
            this.textType = options.textType;
        } else {
            this.textType = Entry.Vim.TEXT_TYPE_PY;
        }

        this.oldMode = Entry.Workspace.MODE_BOARD;
        this.mode = Entry.Workspace.MODE_BOARD;
    }

    getBoard() {
        return this.board;
    }

    getSelectedBoard() {
        return this.selectedBoard;
    }

    getBlockMenu() {
        return this.blockMenu;
    }

    getVimBoard() {
        return this.vimBoard;
    }

    getMode() {
        return this.mode;
    }

    setMode(mode, message, isForce) {
        if (
            Entry.options &&
            !Entry.options.textCodingEnable &&
            Entry.Workspace.MODE_VIMBOARD === mode.boardType
        ) {
            return;
        }

        Entry.disposeEvent.notify();

        const playground = Entry.playground;

        if (!isForce && !checkObjectAndAlert(playground && playground.object)) {
            return false;
        } // change mode fail

        if (Entry.Utils.isNumber(mode)) {
            this.mode = mode;
        } else {
            this.mode = mode.boardType;
            this.runType = mode.runType;
            this.textType = mode.textType;
        }

        this.mode = Number(this.mode);
        if (this.oldMode === this.mode) {
            return;
        }
        Entry.variableContainer.updateList();

        const VIM = Entry.Vim;
        const WORKSPACE = Entry.Workspace;
        const blockMenu = this.blockMenu;
        const Util = Entry.TextCodingUtil;
        const dispatchChangeBoardEvent = () => {
            this.oldMode = this.mode;
            Entry.isTextMode = this.mode === WORKSPACE.MODE_VIMBOARD;

            blockMenu.align();
            Entry.dispatchEvent('workspaceChangeMode');
            this.changeEvent.notify(message);
            Entry.dispatchEvent('cancelBlockMenuDynamic');
        };

        const changeToPythonMode = () => {
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
                if (this.oldTextType === VIM.TEXT_TYPE_JS) {
                    mode.runType = VIM.MAZE_MODE;
                } else if (this.oldTextType === VIM.TEXT_TYPE_PY) {
                    mode.runType = VIM.WORKSPACE_MODE;
                }
                e.block && Entry.getMainWS() && Entry.getMainWS().board.activateBlock(e.block);
            } finally {
                this.oldMode = 1;
                this.mode = 1;
            }
        };

        switch (this.mode) {
            case WORKSPACE.MODE_VIMBOARD: {
                const alertMessage =
                    Util.validateVariableAndListToPython() ||
                    Util.validateFunctionToPython() ||
                    Util.hasNotSupportedBlocks();

                const invalidEditorModeErrorMessage = Util.canConvertTextModeForOverlayMode(
                    Entry.Workspace.MODE_VIMBOARD
                );
                if (invalidEditorModeErrorMessage) {
                    Entry.modal.alert(invalidEditorModeErrorMessage);
                    return;
                }

                if (alertMessage) {
                    if (alertMessage.type === 'warning') {
                        Entry.modal.confirm(alertMessage.message).then((result) => {
                            if (result) {
                                Entry.expansion.banExpansionBlocks(Entry.expansionBlocks);
                                Entry.aiUtilize.banAIUtilizeBlocks(Entry.aiUtilizeBlocks);
                                Entry.playground.dataTable.removeAllBlocks();
                                Entry.aiLearning.removeAllBlocks();
                                changeToPythonMode();
                                dispatchChangeBoardEvent();
                            } else {
                                const mode = {};
                                mode.boardType = WORKSPACE.MODE_BOARD;
                                mode.textType = -1;
                                Entry.getMainWS().setMode(mode);
                                dispatchChangeBoardEvent();
                            }
                        });
                    } else if (alertMessage.type === 'error') {
                        Entry.modal.alert(alertMessage.message);

                        const mode = {};
                        mode.boardType = WORKSPACE.MODE_BOARD;
                        mode.textType = -1;
                        Entry.getMainWS().setMode(mode);
                        dispatchChangeBoardEvent();
                        break;
                    }
                } else {
                    changeToPythonMode();
                    dispatchChangeBoardEvent();
                }
                break;
            }
            case WORKSPACE.MODE_BOARD:
                try {
                    this.board.show();
                    blockMenu.unbanClass('functionInit', true);
                    this.set({ selectedBoard: this.board });
                    this.textToCode(this.oldMode, this.oldTextType);
                    if (this.overlayBoard) {
                        this.overlayBoard.hide();
                    }
                    this.oldTextType = this.textType;
                    this.vimBoard && this.vimBoard.hide();
                } catch (e) {
                    if (this.board && this.board.code) {
                        this.board.code.clear();
                    }
                    if (this.board) {
                        this.board.hide();
                    }
                    this.set({ selectedBoard: this.vimBoard });
                    blockMenu.banClass('functionInit');

                    this.mode = WORKSPACE.MODE_VIMBOARD;

                    if (this.oldTextType === VIM.TEXT_TYPE_JS) {
                        this.boardType = WORKSPACE.MODE_VIMBOARD;
                        this.textType = VIM.TEXT_TYPE_JS;
                        this.runType = VIM.MAZE_MODE;
                    } else if (this.oldTextType === VIM.TEXT_TYPE_PY) {
                        this.boardType = WORKSPACE.MODE_VIMBOARD;
                        this.textType = VIM.TEXT_TYPE_PY;
                        this.runType = VIM.WORKSPACE_MODE;
                    }
                }
                Entry.commander.setCurrentEditor('board', this.board);
                dispatchChangeBoardEvent();
                break;

            case WORKSPACE.MODE_OVERLAYBOARD:
                if (this.oldMode === WORKSPACE.MODE_VIMBOARD) {
                    this.overlayModefrom = WORKSPACE.MODE_VIMBOARD;
                } else if (this.oldMode === WORKSPACE.MODE_BOARD) {
                    this.overlayModefrom = WORKSPACE.MODE_BOARD;
                }

                if (!this.overlayBoard) {
                    this.initOverlayBoard();
                }
                this.overlayBoard.show();
                this.set({ selectedBoard: this.overlayBoard });
                Entry.commander.setCurrentEditor('board', this.overlayBoard);
                dispatchChangeBoardEvent();
                break;
        }

        function checkObjectAndAlert(object, message) {
            if (Entry.type === 'workspace' && !object) {
                Entry.modal.alert(message || Lang.Workspace.object_not_exist_error);
                return false;
            }
            return true;
        }
    }

    changeBoardCode(code, cb) {
        this._syncTextCode();
        const isVim = this.mode === Entry.Workspace.MODE_VIMBOARD;
        this.board.changeCode(code, isVim, cb);
        if (isVim) {
            const mode = {};
            mode.textType = this.textType;
            mode.boardType = this.boardType;
            mode.runType = this.runType;
            this.codeToText(this.board.code, mode);
        }
    }

    changeOverlayBoardCode(code) {
        if (this.overlayBoard) {
            this.overlayBoard.changeCode(code);
        }
    }

    changeBlockMenuCode(code) {
        this.blockMenu.changeCode(code);
    }

    textToCode(mode, oldTextType) {
        if (!this.vimBoard || mode !== Entry.Workspace.MODE_VIMBOARD) {
            return;
        }

        const changedCode = this.vimBoard.textToCode(oldTextType);

        const board = this.board;
        const code = board.code;
        if (!code) {
            return;
        }

        code.load(changedCode);
        this.changeBoardCode(code);
        setTimeout(() => {
            if (code.view) {
                code.view.reDraw();
                this.board.alignThreads();
            }
        }, 0);
    }

    codeToText(code, mode) {
        if (!this.vimBoard) {
            return;
        }

        code = code || this.board.code;
        mode = mode || {
            textType: this.textType,
            boardType: this.boardType,
            runType: this.runType,
        };

        return this.vimBoard.codeToText(code, mode);
    }

    getCodeToText(code) {
        if (!this.vimBoard) {
            return;
        }

        return this.vimBoard.getCodeToText(code);
    }

    _setSelectedBlockView() {
        const view = 'selectedBlockView';
        const blockView =
            this.board[view] ||
            this.blockMenu[view] ||
            (this.overlayBoard ? this.overlayBoard[view] : null);

        this._unbindBlockViewMouseUpEvent();

        this.set({ selectedBlockView: blockView });

        if (!blockView) {
            return;
        }

        this.setHoverBlockView();
        this._blockViewMouseUpEvent = blockView.mouseUpEvent.attach(this, () => {
            this.blockViewMouseUpEvent.notify(blockView);
        });
    }

    initOverlayBoard() {
        this.overlayBoard = new Entry.Board({
            dom: this.board.view,
            workspace: this,
            isOverlay: true,
            scale: this.scale,
        });
        this.overlayBoard.changeCode(new Entry.Code([]));
        this.overlayBoard.workspace = this;
        this.overlayBoard.observe(this, '_setSelectedBlockView', ['selectedBlockView'], false);
    }

    _keyboardControl(e, isForce) {
        if (Entry.Loader && !Entry.Loader.isLoaded()) {
            return;
        }
        const keyCode = e.keyCode || e.which;
        const ctrlKey = e.ctrlKey;
        const shiftKey = e.shiftKey;
        const altKey = e.altKey;
        const playground = Entry.playground;
        const object = playground && playground.object ? playground.object : undefined;

        if (Entry.Utils.isInInput(e) && !isForce) {
            return;
        }

        const isVimMode = this._isVimMode();

        const blockView = this.selectedBlockView;
        const board = this.selectedBoard;
        const isBoardReadOnly = board.readOnly;
        let checkKeyCodes;

        if (ctrlKey) {
            checkKeyCodes = [219, 221];

            if (checkKeyCodes.indexOf(keyCode) > -1) {
                if (!checkObjectAndAlert(object)) {
                    return;
                }
            }
            const mainWorksapceMode = Entry.playground.mainWorkspace.getMode();
            const playgroundMode = Entry.playground.getViewMode();
            const isBlockCodeView =
                (mainWorksapceMode === Entry.Workspace.MODE_OVERLAYBOARD ||
                    mainWorksapceMode === Entry.Workspace.MODE_BOARD) &&
                (playgroundMode === 'code' || playgroundMode === 'variable');
            switch (keyCode) {
                case 86: //paste
                    if (
                        !isBoardReadOnly &&
                        board &&
                        board instanceof Entry.Board &&
                        Entry.clipboard &&
                        isBlockCodeView
                    ) {
                        Entry.do('addThread', Entry.clipboard)
                            .value.getFirstBlock()
                            .copyToClipboard();
                    }
                    break;
                case 219: {
                    //setMode(block) for textcoding ( ctrl + [ )
                    if (
                        !Entry.options.textCodingEnable ||
                        Entry.playground.getViewMode() === 'picture'
                    ) {
                        return;
                    }
                    const oldMode = Entry.getMainWS().oldMode;
                    if (oldMode === Entry.Workspace.MODE_OVERLAYBOARD) {
                        return;
                    }

                    this.dSetMode({
                        boardType: Entry.Workspace.MODE_BOARD,
                        textType: -1,
                    });
                    e.preventDefault();
                    break;
                }
                case 221: {
                    //setMode(python) for textcoding ( ctrl + ] )
                    if (
                        !Entry.options.textCodingEnable ||
                        Entry.playground.getViewMode() === 'picture'
                    ) {
                        return;
                    }

                    const message = Entry.TextCodingUtil.canConvertTextModeForOverlayMode(
                        Entry.Workspace.MODE_VIMBOARD
                    );
                    if (message) {
                        Entry.modal.alert(message);
                        return;
                    }

                    this.dSetMode({
                        boardType: Entry.Workspace.MODE_VIMBOARD,
                        textType: Entry.Vim.TEXT_TYPE_PY,
                        runType: Entry.Vim.WORKSPACE_MODE,
                    });
                    e.preventDefault();
                    break;
                }
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
                if (!checkObjectAndAlert(object)) {
                    return;
                }
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
                    if (
                        !isBoardReadOnly &&
                        blockView &&
                        !blockView.isInBlockMenu &&
                        blockView.block.isDeletable() &&
                        !blockView.isFieldEditing()
                    ) {
                        if (Entry.engine.isState('stop')) {
                            Entry.do('destroyBlock', blockView.block);
                            this.board.set({ selectedBlockView: null });
                            e.preventDefault();
                        }
                    }
                    break;
            }
        }

        //delay for fields value applied
        setTimeout(() => {
            Entry.disposeEvent && Entry.disposeEvent.notify(e);
        }, 0);

        function checkObjectAndAlert(object, message) {
            if (!object) {
                message = message || Lang.Workspace.object_not_exist_error;
                Entry.modal.alert(message);
                return false;
            }
            return true;
        }
    }

    _handleChangeBoard() {
        const board = this.selectedBoard;
        if (!board) {
            return;
        }
        if (board.constructor === Entry.Board) {
            this.zoomController.setBoard(board);
            this.trashcan.setBoard(board);
        }
    }

    _syncTextCode() {
        if (
            this.mode !== Entry.Workspace.MODE_VIMBOARD ||
            (Entry.engine && Entry.engine.isState('run'))
        ) {
            return;
        }

        const changedCode = this.vimBoard.textToCode(this.textType);

        const board = this.board;
        const code = board.code;
        if (code) {
            code.load(changedCode);
        }

        const event = Entry.creationChangedEvent;
        event && event.notify(true);
    }

    addVimBoard(dom) {
        if (this.vimBoard) {
            return;
        }
        this.vimBoard = new Entry.Vim(dom);
        this.vimBoard.workspace = this;
        this.vimBoard.hide();
    }

    getParserType() {
        return this.vimBoard._parserType;
    }

    getBlockViewRenderMode() {
        switch (this.mode) {
            case Entry.Workspace.MODE_BOARD:
            case Entry.Workspace.MODE_OVERLAYBOARD:
                return Entry.BlockView.RENDER_MODE_BLOCK;
            case Entry.Workspace.MODE_VIMBOARD:
                return Entry.BlockView.RENDER_MODE_TEXT;
        }
    }

    _isVimMode() {
        return this.oldMode === Entry.Workspace.MODE_VIMBOARD;
    }

    isVimMode = this._isVimMode;

    attachKeyboardCapture() {
        if (Entry.keyPressed) {
            this._keyboardEvent && this.detachKeyboardCapture();
            this._keyboardEvent = Entry.keyPressed.attach(this, this._keyboardControl);
        }
    }

    detachKeyboardCapture() {
        if (Entry.keyPressed && this._keyboardEvent) {
            this._keyboardEvent.destroy();
            delete this._keyboardEvent;
        }
    }

    _unbindBlockViewMouseUpEvent() {
        if (this._blockViewMouseUpEvent) {
            this._blockViewMouseUpEvent.destroy();
            this._blockViewMouseUpEvent = null;
        }
    }

    setWidgetUpdateEveryTime(val) {
        this.widgetUpdateEveryTime = !!val;
    }

    syncCode() {
        switch (this.mode) {
            case Entry.Workspace.MODE_VIMBOARD:
                this._syncTextCode();
                break;
        }
    }

    setHoverBlockView(blockView) {
        const oldBlockView = this._hoverBlockView;
        oldBlockView && oldBlockView.resetBackgroundPath();

        this._hoverBlockView = blockView;
        blockView && blockView.setBackgroundPath();
    }

    reDraw() {
        const blockMenu = this.blockMenu;
        const board = this.board;

        blockMenu && blockMenu.reDraw();
        board && board.reDraw();

        if (blockMenu || board) {
            this.reDrawEvent.notify();
        }
    }

    getCurrentBoard() {
        const { MODE_BOARD, MODE_VIMBOARD, MODE_OVERLAYBOARD } = Entry.Workspace;

        switch (this.mode) {
            case MODE_BOARD:
                return this.getBoard();
            case MODE_VIMBOARD:
                return this.getVimBoard();
            case MODE_OVERLAYBOARD:
                return this.overlayBoard;
        }
    }

    setScale(scale = 1) {
        this.scale = scale;
        this.board.setScale(scale);
        Entry.GlobalSvg.setScale(scale);
        if (this.overlayBoard) {
            this.overlayBoard.setScale(scale);
        }
    }

    destroy() {
        this._destroyer.destroy();
    }
};

Entry.Workspace.MODE_BOARD = 0;
Entry.Workspace.MODE_VIMBOARD = 1;
Entry.Workspace.MODE_OVERLAYBOARD = 2;
