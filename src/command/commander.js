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
};


(function(p) {
    p.do = function(commandType) {
        var argumentArray = Array.prototype.slice.call(arguments);
        argumentArray.shift();
        var commandFunc = Entry.Command[commandType];
        if (Entry.stateManager) {
            Entry.stateManager.addCommand.apply(
                Entry.stateManager,
                [commandType, this, this.undo, commandType]
                    .concat(commandFunc.state.apply(null, argumentArray))
            );
        }
        // TODO: activity reporter
        return {
            value: Entry.Command[commandType].do.apply(Entry.Command, argumentArray),
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
                [commandType, this, this.redo, commandType]
                    .concat(commandFunc.state.apply(null, argumentArray))
            );
        }
        commandFunc.undo.apply(this, argumentArray);
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

    p.isPass = function() {
        Entry.stateManager.getLastCommand().isPass = true;
    };
})(Entry.Commander.prototype)
