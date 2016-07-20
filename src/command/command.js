/*
 *
 */
"use strict";

goog.provide("Entry.Command");
goog.require("Entry.STATIC");

Entry.Command = {};

(function(c) {
    c.do = {
        type: Entry.STATIC.COMMAND_TYPES['do'],
        log: function(objectId) {
            return [ c['do'].type ];
        }
    };

    c.undo = {
        type: Entry.STATIC.COMMAND_TYPES['undo'],
        log: function(objectId) {
            return [ c['undo'].type ];
        }
    };

    c.redo = {
        type: Entry.STATIC.COMMAND_TYPES['redo'],
        log: function(objectId) {
            return [ c['redo'].type ];
        }
    };

})(Entry.Command);
