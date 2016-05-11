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

    Entry.Command.editor = this.editor;
};


(function(p) {
    p.do = function(commandType) {
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
        // TODO: activity reporter
        return {
            value: Entry.Command[commandType].do.apply(this, argumentArray),
            isPass: this.isPass.bind(this)
        }
    };

    p.undo = function() {
        var argumentArray = Array.prototype.slice.call(arguments);
        var commandType = argumentArray.shift();
        var commandFunc = Entry.Command[commandType];
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
})(Entry.Commander.prototype)
