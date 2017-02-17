/*
 *
 */
"use strict";

goog.require("Entry.Command");
goog.require("Entry.STATIC");

(function(c) {
    var COMMAND_TYPES = Entry.STATIC.COMMAND_TYPES;

    c[COMMAND_TYPES.toggleRun] = {
        do: function(callerName) {
            Entry.engine.toggleRun();
        },
        state: function() {
        },
        log: function(callerName) {
            return [
                ['callerName', callerName]
            ];
        },
        restrict: function (data, domQuery, callback) {
             return new Entry.Tooltip([{
                title: data.tooltip.title,
                content: data.tooltip.content,
                target: domQuery,
                direction: "down"
            }], {
                restrict: true,
                dimmed: true,
            });
        },
        skipUndoStack: true,
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        undo: "toggleStop",
        dom: ['engine', '&0']
    };

    c[COMMAND_TYPES.toggleStop] = {
        do: function(callerName) {
            Entry.engine.toggleStop();
        },
        state: function() {
        },
        log: function(callerName) {
            return [
                ['callerName', callerName]
            ];
        },
        skipUndoStack: true,
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        undo: "toggleStart",
        dom: ['engine', '&0']
    };

})(Entry.Command);

