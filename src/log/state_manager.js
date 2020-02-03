'use strict';

/**
 * Initialize stateManager for redo and undo.
 */
Entry.StateManager = function() {
    this.undoStack_ = [];
    this.redoStack_ = [];
    /** prevent add command when undo and redo */
    this.isRestore = false;
    this._isRedoing = false;
    this.isIgnore = false;
    Entry.addEventListener('cancelLastCommand', (e) => {
        Entry.stateManager.cancelLastCommand();
    });
    Entry.addEventListener('saveWorkspace', (e) => {
        Entry.stateManager.addStamp();
    });
    Entry.addEventListener('undo', (e) => {
        Entry.stateManager.undo();
    });
    Entry.addEventListener('redo', (e) => {
        Entry.stateManager.redo();
    });
};

/**
 * @param {!Element} stateManagerView stateManagerView for undo redo control.
 * @param {?string} option for choose type of view.
 */
Entry.StateManager.prototype.generateView = function(stateManagerView, option) {};

/**
 * Add command to record
 * @param {String} type command type
 * @param {!object} caller function caller
 * @param {!func} func function to restore
 * @param {} params function's parameters or state data
 */
Entry.StateManager.prototype.addCommand = function(type, caller, func, params) {
    if (this.isIgnoring()) {
        return;
    }
    const state = new Entry.State();
    Entry.State.prototype.constructor.apply(state, Array.prototype.slice.call(arguments));

    if (this.isRestoring()) {
        this.redoStack_.push(state);
    } else {
        this.undoStack_.push(state);
        if (!this._isRedoing) {
            this.redoStack_ = [];
        }
    }
    if (Entry.reporter) {
        Entry.reporter.report(state);
    }
    if (Entry.creationChangedEvent) {
        Entry.creationChangedEvent.notify();
    }
    return state;
};

/**
 * Cancel last command
 */
Entry.StateManager.prototype.cancelLastCommand = function() {
    if (!this.canUndo()) {
        return;
    }
    this.undoStack_.pop();
    if (Entry.creationChangedEvent) {
        Entry.creationChangedEvent.notify();
    }
};

Entry.StateManager.prototype.getLastCommand = function() {
    return this.undoStack_[this.undoStack_.length - 1];
};

Entry.StateManager.prototype.getLastCommandById = function(id) {
    const undoStack = this.undoStack_;
    const len = undoStack.length - 1;
    for (let i = len; i >= 0; i--) {
        const state = undoStack[i];
        if (state.id === id) {
            return state;
        }
    }
};

Entry.StateManager.prototype.getLastRedoCommand = function() {
    return this.redoStack_[this.redoStack_.length - 1];
};

Entry.StateManager.prototype.removeAllPictureCommand = function() {
    this.undoStack_ = this.undoStack_.filter(
        (stack) => !(stack.message >= 400 && stack.message < 500)
    );
    this.redoStack_ = this.redoStack_.filter(
        (stack) => !(stack.message >= 400 && stack.message < 500)
    );
};

/**
 * Do undo
 */
Entry.StateManager.prototype.undo = function(count) {
    if (!this.canUndo() || this.isRestoring()) {
        return;
    }
    this.addActivity('undo');
    this.startRestore();
    let isFirst = true;
    while (this.undoStack_.length) {
        const state = this.undoStack_.pop();
        state.func.apply(state.caller, state.params);

        const command = this.getLastRedoCommand();

        if (isFirst) {
            command.isPass = false;
            isFirst = !isFirst;
        } else {
            command.isPass = true;
        }

        if (count) {
            count--;
        }

        if (!count && state.isPass !== true) {
            break;
        }
    }
    this.endRestore();
    if (Entry.disposeEvent) {
        Entry.disposeEvent.notify();
    }
    if (Entry.creationChangedEvent) {
        Entry.creationChangedEvent.notify();
    }
};

/**
 * Do redo
 */
Entry.StateManager.prototype.redo = function() {
    if (!this.canRedo() || this.isRestoring()) {
        return;
    }

    this._isRedoing = true;
    this.addActivity('undo');
    this.addActivity('redo');
    let isFirst = true;
    while (this.redoStack_.length) {
        const state = this.redoStack_.pop();
        const ret = state.func.apply(state.caller, state.params);

        if (isFirst) {
            ret.isPass(false);
            isFirst = !isFirst;
        } else {
            ret.isPass(true);
        }

        if (state.isPass !== true) {
            break;
        }
    }
    this._isRedoing = false;
    if (Entry.creationChangedEvent) {
        Entry.creationChangedEvent.notify();
    }
};

/**
 * update view.
 * toggle undo and redo button active when available.
 */
Entry.StateManager.prototype.updateView = function() {
    return;
    if (this.undoButton && this.redoButton) {
        if (this.canUndo()) {
            this.undoButton.addClass('active');
        } else {
            this.undoButton.removeClass('active');
        }

        if (this.canRedo()) {
            this.redoButton.addClass('active');
        } else {
            this.redoButton.removeClass('active');
        }
    }
};

/**
 * Start restoring
 */
Entry.StateManager.prototype.startRestore = function() {
    this.isRestore = true;
};

/**
 * End restoring
 */
Entry.StateManager.prototype.endRestore = function() {
    this.isRestore = false;
};

/**
 * Return true when restoring is not progress
 * @return {boolean} true when restoring is doing
 */
Entry.StateManager.prototype.isRestoring = function() {
    return this.isRestore;
};

/**
 * Start ignoring
 */
Entry.StateManager.prototype.startIgnore = function() {
    this.isIgnore = true;
};

/**
 * End ignoring
 */
Entry.StateManager.prototype.endIgnore = function() {
    this.isIgnore = false;
};

/**
 * Return true when restoring is not progress
 * @return {boolean} true when restoring is doing
 */
Entry.StateManager.prototype.isIgnoring = function() {
    return this.isIgnore;
};

/**
 * @return {!boolean} return true when undo is available
 */
Entry.StateManager.prototype.canUndo = function() {
    return this.undoStack_.length > 0 && Entry.engine.isState('stop');
};

/**
 * @return {!boolean} return true when redo is available
 */
Entry.StateManager.prototype.canRedo = function() {
    return this.redoStack_.length > 0 && Entry.engine.isState('stop');
};

/**
 * mark state which one saved
 */
Entry.StateManager.prototype.addStamp = function() {
    this.stamp = Entry.generateHash();
    if (this.undoStack_.length) {
        this.undoStack_[this.undoStack_.length - 1].stamp = this.stamp;
    }
};

/**
 * @return {!boolean} return true when project is up-to-date
 */
Entry.StateManager.prototype.isSaved = function() {
    return (
        this.undoStack_.length === 0 ||
        (this.undoStack_[this.undoStack_.length - 1].stamp == this.stamp &&
            typeof this.stamp == 'string')
    );
};

/**
 * @param {String} activityType
 */
Entry.StateManager.prototype.addActivity = function(activityType) {
    if (Entry.reporter) {
        Entry.reporter.report(new Entry.State(activityType));
    }
};

Entry.StateManager.prototype.getUndoStack = function() {
    return this.undoStack_.slice(0);
};

Entry.StateManager.prototype.changeLastCommandType = function(type) {
    const cmd = this.getLastCommand();
    if (cmd) {
        cmd.message = type;
    }
    return cmd;
};

Entry.StateManager.prototype.clear = function() {
    while (this.undoStack_.length) {
        this.undoStack_.pop();
    }
    while (this.redoStack_.length) {
        this.redoStack_.pop();
    }

    if (Entry.creationChangedEvent) {
        Entry.creationChangedEvent.notify();
    }
};
