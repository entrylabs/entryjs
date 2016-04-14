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
    Entry.do = this.do;

    Entry.undo = this.undo;
};


(function(p) {
    p.do = function(commandType) {
        var argumentArray = Array.prototype.slice.call(arguments);
        argumentArray.shift();
        Entry.Command[commandType].apply(Entry.Command, argumentArray);
    };

    p.undo = function() {

    };

    p.redo = function() {

    };
})(Entry.Commander.prototype)
