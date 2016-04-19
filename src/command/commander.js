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
                [commandType, Entry.Command, commandFunc.undo]
                    .concat(commandFunc.state.apply(null, argumentArray))
            );
        }
        // TODO: activity reporter
        return Entry.Command[commandType].do.apply(Entry.Command, argumentArray);
    };

    p.undo = function() {

    };

    p.redo = function() {

    };

    p.setCurrentEditor = function(key, object) {
        this.editor[key] = object;
    };
})(Entry.Commander.prototype)
