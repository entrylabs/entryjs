/*
 *
 */
"use strict";

goog.provide("Entry.Command");

Entry.Command = {};

(function(c) {
    c['do'] = {
        type: EntryStatic.COMMAND_TYPES['do'],
        log: function(objectId) {
            return [ c['do'].type ];
        }
    };

    c['undo'] = {
        type: EntryStatic.COMMAND_TYPES['undo'],
        log: function(objectId) {
            return [ c['undo'].type ];
        }
    };

    c['redo'] = {
        type: EntryStatic.COMMAND_TYPES['redo'],
        log: function(objectId) {
            return [ c['redo'].type ];
        }
    };

})(Entry.Command);
