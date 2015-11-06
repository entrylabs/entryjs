/**
 * @fileoverview State Manager class for undo and redo.
 */
'use strict';

/**
 * @constructor
 */
Entry.StateManager = function() {
    this.undoStack_ = [];
    this.redoStack_ = [];
    /** prevent add command when undo and redo */
    this.isRestore = false;
    this.isIgnore = false;
    Entry.addEventListener('cancelLastCommand', function(e) {
        Entry.stateManager.cancelLastCommand();});
    Entry.addEventListener('run', function(e) {
        Entry.stateManager.updateView();});
    Entry.addEventListener('stop', function(e) {
        Entry.stateManager.updateView();});
    Entry.addEventListener('saveWorkspace', function(e) {
        Entry.stateManager.addStamp();});
    Entry.addEventListener('undo', function(e) {
        Entry.stateManager.undo();});
    Entry.addEventListener('redo', function(e) {
        Entry.stateManager.redo();});
};

/**
 * @param {!Element} stateManagerView stateManagerView for undo redo control.
 * @param {?string} option for choose type of view.
 */
Entry.StateManager.prototype.generateView = function (stateManagerView, option) {
    /*
    this.view_ = stateManagerView;
    this.view_.addClass('entryStateManagerWorkspace')

    this.undoButton = Entry.createElement('button');
    this.undoButton.addClass('entryStateManagerButtonWorkspace');
    this.undoButton.addClass('entryUndoButtonWorkspace');
    this.undoButton.innerHTML = '되돌리기';
    this.undoButton.object = this;
    this.view_.appendChild(this.undoButton);
    this.undoButton.bindOnClick(function(e) {
        if (this.object.canUndo())
            this.object.undo();
    };

    this.redoButton = Entry.createElement('button');
    this.redoButton.addClass('entryStateManagerButtonWorkspace');
    this.redoButton.addClass('entryRedoButtonWorkspace');
    this.redoButton.innerHTML = '다시실행';
    this.redoButton.object = this;
    this.view_.appendChild(this.redoButton);
    this.redoButton.bindOnClick(function(e) {
        if (this.object.canRedo())
            this.object.redo();
    };
    */
};

/**
 * Add command to record
 * @param {String} type command type
 * @param {!object} caller function caller
 * @param {!func} func function to restore
 * @param {} params function's parameters or state data
 */
Entry.StateManager.prototype.addCommand =
    function(type, caller, func, params) {
    if (this.isIgnoring())
        return;
    if (this.isRestoring()) {
        var state = new Entry.State();
        var argumentArray = Array.prototype.slice.call(arguments);
        Entry.State.prototype.constructor.apply(state, argumentArray);
        this.redoStack_.push(state);
        if (Entry.reporter)
            Entry.reporter.report(state);
    } else {
        var state = new Entry.State();
        var argumentArray = Array.prototype.slice.call(arguments);
        Entry.State.prototype.constructor.apply(state, argumentArray);
        this.undoStack_.push(state);
        if (Entry.reporter)
            Entry.reporter.report(state);
        this.updateView();
    }
    Entry.dispatchEvent('saveLocalStorageProject');
};

/**
 * Cancel last command
 */
Entry.StateManager.prototype.cancelLastCommand = function() {
    if (!this.canUndo())
        return;
    this.undoStack_.pop();
    this.updateView();
    Entry.dispatchEvent('saveLocalStorageProject');
};

/**
 * Do undo
 */
Entry.StateManager.prototype.undo = function() {
    if (!this.canUndo() || this.isRestoring())
        return;
    this.addActivity("undo");
    this.startRestore();
    var state = this.undoStack_.pop();
    state.func.apply(state.caller, state.params);
    this.updateView();
    this.endRestore();
    Entry.dispatchEvent('saveLocalStorageProject');
};

/**
 * Do redo
 */
Entry.StateManager.prototype.redo = function() {
    if (!this.canRedo() || this.isRestoring())
        return;
    this.addActivity("redo");
    var state = this.redoStack_.pop();
    state.func.apply(state.caller, state.params);
    this.updateView();
    Entry.dispatchEvent('saveLocalStorageProject');
};

/**
 * update view.
 * toggle undo and redo button active when available.
 */
Entry.StateManager.prototype.updateView = function () {
    if (this.undoButton && this.redoButton) {

        if (this.canUndo())
            this.undoButton.addClass('active');
        else
            this.undoButton.removeClass('active');
        if (this.canRedo())
            this.redoButton.addClass('active');
        else
            this.redoButton.removeClass('active');

    }
};

/**
 * Start restoring
 */
Entry.StateManager.prototype.startRestore = function () {
    this.isRestore = true;
};

/**
 * End restoring
 */
Entry.StateManager.prototype.endRestore = function () {
    this.isRestore = false;
};

/**
 * Return true when restoring is not progress
 * @return {boolean} true when restoring is doing
 */
Entry.StateManager.prototype.isRestoring = function () {
    return this.isRestore;
};

/**
 * Start ignoring
 */
Entry.StateManager.prototype.startIgnore = function () {
    this.isIgnore = true;
};

/**
 * End ignoring
 */
Entry.StateManager.prototype.endIgnore = function () {
    this.isIgnore = false;
};

/**
 * Return true when restoring is not progress
 * @return {boolean} true when restoring is doing
 */
Entry.StateManager.prototype.isIgnoring = function () {
    return this.isIgnore;
};

/**
 * @return {!boolean} return true when undo is available
 */
Entry.StateManager.prototype.canUndo = function () {
    return this.undoStack_.length > 0 && Entry.engine.isState('stop');
};

/**
 * @return {!boolean} return true when redo is available
 */
Entry.StateManager.prototype.canRedo = function () {
    return this.redoStack_.length > 0 && Entry.engine.isState('stop');
};

/**
 * mark state which one saved
 */
Entry.StateManager.prototype.addStamp = function () {
    this.stamp = Entry.generateHash();
    if (this.undoStack_.length)
        this.undoStack_[this.undoStack_.length-1].stamp = this.stamp;
};

/**
 * @return {!boolean} return true when project is up-to-date
 */
Entry.StateManager.prototype.isSaved = function () {
    return this.undoStack_.length == 0 ||
        (this.undoStack_[this.undoStack_.length-1].stamp == this.stamp &&
        typeof this.stamp == 'string');
};

/**
 * @param {String} activityType
 */
Entry.StateManager.prototype.addActivity = function (activityType) {
    if (Entry.reporter)
        Entry.reporter.report(new Entry.State(activityType));
};
