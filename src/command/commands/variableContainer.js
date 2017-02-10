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
        skipUndoStack: true,
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
        skipUndoStack: true,
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        undo: "variableContainerClickVariableAddButton",
        dom: ['variableContainer', 'variableAddButton']
    };

    c[COMMAND_TYPES.variableContainerAddVariable] = {
        do: function(variable) {
            Entry.variableContainer.addVariable(variable);
        },
        state: function(variable) {
            if (variable instanceof Entry.Variable)
                variable = variable.toJSON();
            return [variable];
        },
        log: function(variable) {
            if (variable instanceof Entry.Variable)
                variable = variable.toJSON();
            return [ 'variable', variable ];
        },
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        validate: false,
        undo: "variableContainerRemoveVariable",
        dom: ['variableContainer', 'variableAddConfirmButton']
    };

    c[COMMAND_TYPES.variableContainerRemoveVariable] = {
        do: function(variable) {
            Entry.variableContainer.removeVariable(variable);
        },
        state: function(variable) {
            if (variable instanceof Entry.Variable)
                variable = variable.toJSON();
            return [variable];
        },
        log: function(variable) {
            if (variable instanceof Entry.Variable)
                variable = variable.toJSON();
            return [ 'variable', variable ];
        },
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        validate: false,
        undo: "variableContainerAddVariable",
        dom: ['variableContainer', 'variableAddConfirmButton']
    };
})(Entry.Command);

