/*
 *
 */
"use strict";

goog.require("Entry.Command");
goog.require("Entry.STATIC");

(function(c) {
    c[Entry.STATIC.COMMAND_TYPES.variableContainerSelectFilter] = {
        do: function(newType, oldType) {
            Entry.variableContainer.selectFilter(newType);
        },
        state: function(newType, oldType) {
            return [oldType, newType];
        },
        log: function(newType, oldType) {
            oldType = oldType || 'all';
            return [
                ['oldType', oldType],
                ['newType', newType]
            ];
        },
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        undo: "variableContainerSelectFilter",
        dom: ['variableContainer', 'filter', '&1']
    };
})(Entry.Command);

