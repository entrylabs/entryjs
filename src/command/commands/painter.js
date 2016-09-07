/*
 *
 */
"use strict";

goog.require("Entry.Command");
goog.require("Entry.STATIC");

(function(c) {
    c.editPicture = {
        type: Entry.STATIC.COMMAND_TYPES.editPicture,
        do: function(action, lc) {
            if (Entry.playground.painter.lc.canRedo())
                Entry.playground.painter.lc.redo()
        },
        state: function(objectId) {
        },
        log: function(objectId) {
            return [objectId];
        },
        undo: "uneditPicture"
    };

    c.uneditPicture = {
        type: Entry.STATIC.COMMAND_TYPES.uneditPicture,
        do: function(action, lc) {
            Entry.playground.painter.lc.undo()
        },
        state: function(objectId) {
        },
        log: function(objectId) {
            return [objectId];
        },
        undo: "editPicture"
    };

    c.processPicture = {
        type: Entry.STATIC.COMMAND_TYPES.processPicture,
        do: function(action, lc) {
            if (Entry.playground.painter.lc.canRedo())
                Entry.playground.painter.lc.redo()
        },
        state: function(objectId) {
        },
        log: function(objectId) {
            return [objectId];
        },
        undo: "unprocessPicture",
        isPass: true
    };

    c.unprocessPicture = {
        type: Entry.STATIC.COMMAND_TYPES.unprocessPicture,
        do: function(action, lc) {
            Entry.playground.painter.lc.undo()
        },
        state: function(objectId) {
        },
        log: function(objectId) {
            return [objectId];
        },
        undo: "processPicture",
        isPass: true
    };
})(Entry.Command);

