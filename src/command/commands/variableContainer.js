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
                ['newType', newType],
                ['oldType', oldType],
            ];
        },
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        undo: "variableContainerSelectFilter",
        dom: ['variableContainer', 'filter', '&0']
    };

    c[COMMAND_TYPES.variableContainerClickVariableAddButton] = {
        do: function() {
            Entry.variableContainer.clickVariableAddButton();
        },
        state: function() {
            return [];
        },
        log: function() {
            return [];
        },
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
            return [
                [ 'variable', variable ]
            ];
        },
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        validate: false,
        undo: "variableContainerRemoveVariable",
        restrict: function(data, domQuery, callback) {
            Entry.variableContainer.clickVariableAddButton(true, true);
            var dom = $('.entryVariableAddSpaceInputWorkspace');
            dom.val(data.content[1][1].name);
            var tooltip = new Entry.Tooltip([{
                title: data.tooltip.title,
                content: data.tooltip.content,
                target: domQuery
            }], {
                restrict: true,
                dimmed: true,
                callBack: callback
            });
            return tooltip;
        },
        dom: ['variableContainer', 'variableAddConfirmButton']
    };

    c[COMMAND_TYPES.variableAddSetName] = {
        do: function(value) {
            var dom = $('.entryVariableAddSpaceInputWorkspace');
            dom.val(value);
        },
        state: function(value) {
            return [
                ''
            ];
        },
        log: function(value) {
            return [
                [ 'value', value ]
            ];
        },
        restrict: function(data, domQuery, callback) {
            Entry.variableContainer.clickVariableAddButton(true);
            var tooltip = new Entry.Tooltip([{
                title: data.tooltip.title,
                content: data.tooltip.content,
                target: domQuery
            }], {
                restrict: true,
                noDispose: true,
                dimmed: true,
                callBack: callback
            });
            return tooltip;
        },
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        undo: "variableAddSetName",
        dom: ['variableContainer', 'variableAddInput']
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
            return [
                [ 'variable', variable ]
            ];
        },
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        validate: false,
        undo: "variableContainerAddVariable",
        dom: ['variableContainer', 'variableAddConfirmButton']
    };
})(Entry.Command);

