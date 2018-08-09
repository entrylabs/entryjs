/*
 *
 */
'use strict';

var {
    createTooltip,
    returnEmptyArr,
    getExpectedData,
} = require('../command_util');

(function(c) {
    var COMMAND_TYPES = Entry.STATIC.COMMAND_TYPES;

    c[COMMAND_TYPES.funcCreateStart] = {
        do: function(funcId) {
            funcId = getExpectedData('funcId') || funcId;
            Entry.playground.changeViewMode('code');
            var blockMenu = Entry.variableContainer._getBlockMenu();
            if (blockMenu.lastSelector != 'func') {
                blockMenu.selectMenu('func');
            }
            Entry.variableContainer.createFunction({ id: funcId });
        },
        state: function(funcId) {
            return [getExpectedData('funcId', funcId)];
        },
        log: function(funcId) {
            return [['funcId', getExpectedData('funcId') || funcId]];
        },
        restrict(data, domQuery, callback) {
            Entry.playground.changeViewMode('variable');
            Entry.variableContainer.selectFilter('func');

            var { content: contentData, tooltip: { title, content } } = data;
            return createTooltip(title, content, domQuery, callback);
        },
        validate: false,
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        dom: ['variableContainer', 'functionAddButton'],
        undo: 'funcEditCancel',
    };

    c[COMMAND_TYPES.funcEditStart] = {
        do: function(funcId) {
            Entry.Func.edit(funcId);
        },
        state: returnEmptyArr,
        log: function(funcId) {
            return [['funcId', funcId]];
        },
        validate: false,
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        dom: ['variableContainer', 'functionAddButton'],
        undo: 'funcEditCancel',
    };

    c[COMMAND_TYPES.funcEditCancel] = {
        do: function() {
            Entry.getMainWS().setMode(Entry.Workspace.MODE_BOARD, 'cancelEdit');
        },
        state: returnEmptyArr,
        log: returnEmptyArr,
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        dom: ['playground', 'overlayBoard', 'cancelEditButton'],
        undo: 'funcCreateStart',
    };

    c[COMMAND_TYPES.funcCreate] = {
        do: function() {
            Entry.getMainWS().setMode(Entry.Workspace.MODE_BOARD, 'save');
        },
        state: function() {
            return [Entry.Func.targetFunc.id];
        },
        log: returnEmptyArr,
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        dom: ['playground', 'overlayBoard', 'saveButton'],
        undo: 'funcEditStart',
    };

    c[COMMAND_TYPES.funcEdit] = {
        do: function() {
            Entry.getMainWS().setMode(Entry.Workspace.MODE_BOARD, 'save');
        },
        state: returnEmptyArr,
        log: returnEmptyArr,
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        dom: ['playground', 'overlayBoard', 'saveButton'],
        undo: 'funcEditStart',
    };
})(Entry.Command);
