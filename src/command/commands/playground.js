/*
 *
 */
"use strict";

goog.require("Entry.Command");
goog.require("Entry.STATIC");

(function(c) {
    c[Entry.STATIC.COMMAND_TYPES.playgroundChangeViewMode] = {
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
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        undo: "playgroundChangeViewMode",
        dom: ['playground', '&1']
    };
})(Entry.Command);

