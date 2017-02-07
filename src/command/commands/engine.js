/*
 *
 */
"use strict";

goog.require("Entry.Command");
goog.require("Entry.STATIC");

(function(c) {
    c.toggleRun = (function() {
        var commandType = "toggleRun";
        return {
            type: commandType,
            do: function(callerName) {
                Entry.engine.toggleRun();
            },
            state: function() {
            },
            log: function() {
                return [];
            },
            undo: "toggleStop",
            dom: ['engine', '&0']
        };
    })();

    c.toggleStop = (function() {
        var commandType = "toggleStop";
        return {
            type: commandType,
            do: function(callerName) {
                Entry.engine.toggleStop();
            },
            state: function() {
            },
            log: function() {
                return [];
            },
            undo: "toggleStart",
            dom: ['engine', '&0']
        };
    })();

})(Entry.Command);

