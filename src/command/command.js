/*
 *
 */
"use strict";

goog.provide("Entry.Command");
goog.require("Entry.STATIC");

Entry.Command = {};

(function(c) {
    c[Entry.STATIC.COMMAND_TYPES.do] = {
        recordable: Entry.STATIC.RECORDABLE.SKIP,
        log: function(objectId) {
            return [];
        }
    };

    c[Entry.STATIC.COMMAND_TYPES.undo] = {
        recordable: Entry.STATIC.RECORDABLE.SKIP,
        log: function(objectId) {
            return [];
        }
    };

    c[Entry.STATIC.COMMAND_TYPES.redo] = {
        recordable: Entry.STATIC.RECORDABLE.SKIP,
        log: function(objectId) {
            return [];
        }
    };

})(Entry.Command);
