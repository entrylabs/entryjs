/*
 *
 */
"use strict";

goog.require("Entry.Command");
goog.require("Entry.STATIC");

(function(c) {
    var COMMAND_TYPES = Entry.STATIC.COMMAND_TYPES;
    c[COMMAND_TYPES.variableContainerSelectFilter] = {
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

    c[COMMAND_TYPES.variableContainerClickVariableAddButton] = {
        do: function() {
            Entry.variableContainer.clickVariableAddButton();
        },
        state: function() {
            return [];
        },
        log: function() {
            return [
            ];
        },
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        undo: "variableContainerClickVariableAddButton",
        dom: ['variableContainer', 'variableAddButton']
    };
})(Entry.Command);

