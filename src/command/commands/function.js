/*
 *
 */
'use strict';

const { createTooltip, returnEmptyArr, getExpectedData } = require('../command_util');

(function(c) {
    const COMMAND_TYPES = Entry.STATIC.COMMAND_TYPES;

    c[COMMAND_TYPES.funcCreateStart] = {
        do(funcId) {
            Entry.getMainWS().setMode(Entry.Workspace.MODE_BOARD, 'cancelEdit');
            funcId = getExpectedData('funcId') || funcId;
            Entry.playground.changeViewMode('code');
            const blockMenu = Entry.variableContainer._getBlockMenu();
            if (blockMenu.lastSelector !== 'func') {
                blockMenu.selectMenu('func');
            }
            Entry.variableContainer.createFunction({ id: funcId });
        },
        state(funcId) {
            return [getExpectedData('funcId', funcId)];
        },
        log(funcId) {
            return [['funcId', getExpectedData('funcId') || funcId]];
        },
        restrict(data, domQuery, callback) {
            Entry.playground.changeViewMode('variable');
            Entry.variableContainer.selectFilter('func');

            const {
                tooltip: { title, content },
            } = data;
            return createTooltip(title, content, domQuery, callback);
        },
        validate: false,
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        dom: ['variableContainer', 'functionAddButton'],
        undo: 'funcEditCancel',
    };

    c[COMMAND_TYPES.funcEditStart] = {
        do(funcId) {
            Entry.Func.edit(funcId);
        },
        state: returnEmptyArr,
        log(funcId) {
            return [['funcId', funcId]];
        },
        validate: false,
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        dom: ['variableContainer', 'functionAddButton'],
        undo: 'funcEditCancel',
    };

    c[COMMAND_TYPES.funcEditCancel] = {
        do() {
            Entry.Func.isEdit = false;
            Entry.getMainWS().setMode(Entry.Workspace.MODE_BOARD, 'cancelEdit');
        },
        state: returnEmptyArr,
        log: returnEmptyArr,
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        dom: ['playground', 'overlayBoard', 'cancelEditButton'],
        undo: 'funcCreateStart',
    };

    c[COMMAND_TYPES.funcCreate] = {
        do() {
            Entry.Func.isEdit = false;
            Entry.getMainWS().setMode(Entry.Workspace.MODE_BOARD, 'save');
        },
        state() {
            return [Entry.Func.targetFunc.id];
        },
        log: returnEmptyArr,
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        dom: ['playground', 'overlayBoard', 'saveButton'],
        undo: 'funcEditStart',
    };

    c[COMMAND_TYPES.funcEdit] = {
        do() {
            Entry.getMainWS().setMode(Entry.Workspace.MODE_BOARD, 'save');
        },
        state: returnEmptyArr,
        log: returnEmptyArr,
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        dom: ['playground', 'overlayBoard', 'saveButton'],
        undo: 'funcEditStart',
    };
})(Entry.Command);
