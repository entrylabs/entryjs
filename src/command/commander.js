/*
 *
 */
"use strict";

goog.provide("Entry.Commander");

goog.require("Entry.Command");

Entry.Commander = function(injectType) {
    if (injectType == 'workspace' || injectType == 'phone') {
        /**
         * Initialize stateManager for redo and undo.
         * @type {!Entry.StateManager}
         * @type {!object}
         */
        Entry.stateManager = new Entry.StateManager();

    }
    Entry.do = this.do.bind(this);

    Entry.undo = this.undo.bind(this);

    this.editor = {};

    this.reporters = [];

    this._tempStorage = null;

    Entry.Command.editor = this.editor;

    this.doEvent = new Entry.Event(this);
    this.logEvent = new Entry.Event(this);
};

(function(p) {
    p.do = function(commandType) {
        if (typeof commandType === "string")
            commandType = Entry.STATIC.COMMAND_TYPES[commandType];
        var that = this;
        var argumentArray = Array.prototype.slice.call(arguments);
        argumentArray.shift();
        var command = Entry.Command[commandType];
        if (Entry.stateManager) {
            Entry.stateManager.addCommand.apply(
                Entry.stateManager,
                [commandType, this, this.do, command.undo]
                    .concat(command.state.apply(this, argumentArray))
            );
        }
        var value = Entry.Command[commandType].do.apply(this, argumentArray);
        this.doEvent.notify(commandType, argumentArray);

        //intentionally delay reporting
        that.report(Entry.STATIC.COMMAND_TYPES.do);
        that.report(commandType, argumentArray);

        return {
            value: value,
            isPass: this.isPass.bind(this)
        }
    };

    p.undo = function() {
        var argumentArray = Array.prototype.slice.call(arguments);
        var commandType = argumentArray.shift();
        var commandFunc = Entry.Command[commandType];

        this.report(Entry.STATIC.COMMAND_TYPES.undo);

        if (Entry.stateManager) {
            Entry.stateManager.addCommand.apply(
                Entry.stateManager,
                [commandType, this, this.do, commandFunc.undo]
                    .concat(commandFunc.state.apply(this, argumentArray))
            );
        }
        return {
            value: Entry.Command[commandType].do.apply(this, argumentArray),
            isPass: this.isPass.bind(this)
        }
    };

    p.redo = function() {
        var argumentArray = Array.prototype.slice.call(arguments);
        var commandType = argumentArray.shift();
        var commandFunc = Entry.Command[commandType];

        that.report(Entry.STATIC.COMMAND_TYPES.redo);

        if (Entry.stateManager) {
            Entry.stateManager.addCommand.apply(
                Entry.stateManager,
                [commandType, this, this.undo, commandType]
                    .concat(commandFunc.state.apply(null, argumentArray))
            );
        }
        commandFunc.undo.apply(this, argumentArray);
    };

    p.setCurrentEditor = function(key, object) {
        this.editor[key] = object;
    };

    p.isPass = function(isPass) {
        isPass = isPass === undefined ? true : isPass;
        if (Entry.stateManager) {
            var lastCommand = Entry.stateManager.getLastCommand();
            if (lastCommand) lastCommand.isPass = isPass;
        }
    };

    p.addReporter = function(reporter) {
        reporter.logEventListener = this.logEvent.attach(reporter, reporter.add);
    };

    p.removeReporter = function(reporter) {
        if (reporter.logEventListener)
            this.logEvent.detatch(reporter.logEventListener)
        delete reporter.logEventListener;
    };

    p.report = function(commandType, argumentsArray) {
        var data;

        if (commandType && Entry.Command[commandType] && Entry.Command[commandType].log)
            data = Entry.Command[commandType].log.apply(this, argumentsArray)
        else data = argumentsArray;
        data.unshift(commandType);
        this.logEvent.notify(data);
    };
})(Entry.Commander.prototype)

