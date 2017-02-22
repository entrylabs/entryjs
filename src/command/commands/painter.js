/*
 *
 */
"use strict";

goog.require("Entry.Command");
goog.require("Entry.STATIC");

(function(c) {
    var COMMAND_TYPES = Entry.STATIC.COMMAND_TYPES;

    c[COMMAND_TYPES.editPicture] = {
        do: function(action, lc) {
            if (Entry.playground.painter.lc.canRedo())
                Entry.playground.painter.lc.redo()
        },
        state: function(objectId) {
        },
        log: function(objectId) {
            return [objectId];
        },
        recordable: Entry.STATIC.RECORDABLE.SKIP,
        undo: "uneditPicture"
    };

    c[COMMAND_TYPES.uneditPicture] = {
        type: Entry.STATIC.COMMAND_TYPES.uneditPicture,
        do: function(action, lc) {
            Entry.playground.painter.lc.undo()
        },
        state: function(objectId) {
        },
        log: function(objectId) {
            return [objectId];
        },
        recordable: Entry.STATIC.RECORDABLE.SKIP,
        undo: "editPicture"
    };

    c[COMMAND_TYPES.processPicture] = {
        do: function(action, lc) {
            if (Entry.playground.painter.lc.canRedo())
                Entry.playground.painter.lc.redo()
        },
        state: function(objectId) {
        },
        log: function(objectId) {
            return [objectId];
        },
        recordable: Entry.STATIC.RECORDABLE.SKIP,
        undo: "unprocessPicture",
        isPass: true
    };

    c[COMMAND_TYPES.unprocessPicture] = {
        do: function(action, lc) {
            Entry.playground.painter.lc.undo()
        },
        state: function(objectId) {
        },
        log: function(objectId) {
            return [objectId];
        },
        recordable: Entry.STATIC.RECORDABLE.SKIP,
        undo: "processPicture",
        isPass: true
    };
})(Entry.Command);

