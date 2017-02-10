/*
 *
 */
"use strict";

goog.require("Entry.Command");
goog.require("Entry.STATIC");

(function(c) {
    var COMMAND_TYPES = Entry.STATIC.COMMAND_TYPES;
    c[COMMAND_TYPES.playgroundChangeViewMode] = {
        do: function(newType, oldType) {
            Entry.playground.changeViewMode(newType);
        },
        state: function(newType, oldType) {
            return [oldType, newType];
        },
        log: function(newType, oldType) {
            oldType = oldType || 'code';
            return [
                ['oldType', oldType],
                ['newType', newType]
            ];
        },
        skipUndoStack: true,
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        undo: "playgroundChangeViewMode",
        dom: ['playground', 'tabViewElements', '&1']
    };

    c[COMMAND_TYPES.playgroundClickAddPicture] = {
        do: function(newType, oldType) {
            Entry.playground.changeViewMode(newType);
        },
        state: function(newType, oldType) {
            return [oldType, newType];
        },
        log: function(newType, oldType) {
            oldType = oldType || 'code';
            return [
                ['oldType', oldType],
                ['newType', newType]
            ];
        },
        skipUndoStack: true,
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        undo: "playgroundChangeViewMode",
        dom: ['playground', 'tabViewElements', '&1']
    };
})(Entry.Command);

