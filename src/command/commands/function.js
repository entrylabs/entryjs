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
            return [getExpectedData('funcId', funcId), 'remove'];
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
        do(id, json, type) {
            const func = Entry.variableContainer.getFunction(id);
            if (func) {
                Entry.Func.edit(id);
            } else {
                Entry.variableContainer.createFunction({ id, type });
            }
            if (json) {
                Entry.Func.targetFunc.content.load(json);
            }
        },
        state(id, json, type = 'cancel', isExist) {
            if (type === 'save' && id && !isExist) {
                Entry.variableContainer.removeFunction({ id });
            }
            return [type];
        },
        log(funcId) {
            return [['funcId', funcId]];
        },
        validate: false,
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        dom: ['variableContainer', 'functionAddButton'],
        undo: 'funcEditEnd',
    };

    c[COMMAND_TYPES.funcEditEnd] = {
        do(type) {
            Entry.Func.isEdit = false;
            if (type === 'save') {
                Entry.getMainWS().setMode(Entry.Workspace.MODE_BOARD, 'save');
            } else {
                Entry.getMainWS().setMode(Entry.Workspace.MODE_BOARD, 'cancelEdit');
            }
        },
        state(type) {
            const json = Entry.Func.targetFunc.content.toJSON();
            const func = Entry.variableContainer.getFunction(Entry.Func.targetFunc.id);
            return [Entry.Func.targetFunc.id, json, type, !!func];
        },
        log(type) {
            return [['funcId', Entry.Func.targetFunc.id]];
        },
        validate: false,
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        dom: ['variableContainer', 'functionAddButton'],
        undo: 'funcEditStart',
    };

    c[COMMAND_TYPES.funcRemove] = {
        do({ id }) {
            Entry.variableContainer.removeFunction({ id });
        },
        state({ id }) {
            const func = Entry.variableContainer.getFunction(id);
            return [func];
        },
        log(func) {
            return [['funcId', func.id]];
        },
        validate: false,
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        dom: ['variableContainer', 'functionAddButton'],
        undo: 'funcCreate',
    };

    c[COMMAND_TYPES.funcCreate] = {
        do(func) {
            Entry.variableContainer.saveFunction(func);
            Entry.Func.registerFunction(func);
            Entry.Func.updateMenu();
        },
        state({ id }) {
            return [{ id }];
        },
        log(func) {
            return [['funcId', func.id]];
        },
        validate: false,
        recordable: Entry.STATIC.RECORDABLE.SUPPORT,
        dom: ['variableContainer', 'functionAddButton'],
        undo: 'funcRemove',
    };

    c[COMMAND_TYPES.funcChangeType] = {
        do(func) {
            let type = 'value';
            if (func.type === 'value') {
                type = 'normal';
            }
            Entry.Func.changeType(func, type);
        },
        state(func) {
            return [func];
        },
        log(func) {
            return [['funcId', func.id]];
        },
        validate: false,
        dom: ['variableContainer', 'functionAddButton'],
        undo: 'funcChangeType',
    };

    c[COMMAND_TYPES.funcLocalVarChangeLength] = {
        do(func, value) {
            if (value === 'minus') {
                func.removeLastLocalVariable();
            } else if (value === 'plus') {
                const value = func.defaultLocalVariable();
                func.appendLocalVariable(value);
            } else {
                let length = func.localVariables?.length || 0;
                if (Entry.Utils.isNumber(value) && value >= 0) {
                    length = value;
                }
                func.setLocalVariableLength(length);
            }
        },
        state(func, value) {
            let prevValue;
            if (value === 'minus') {
                prevValue = 'plus';
            } else if (value === 'plus') {
                prevValue = 'minus';
            } else {
                prevValue = func.localVariables?.length || 0;
            }
            return [func, prevValue];
        },
        log(func, value) {
            return [
                ['funcId', func.id],
                ['value', value],
            ];
        },
        validate: false,
        dom: ['variableContainer', 'funcLocalVarChangeLength', '&2'],
        undo: 'funcLocalVarChangeLength',
    };
    c[COMMAND_TYPES.toggleFuncUseLocalVariables] = {
        do(func) {
            func.toggleFunctionUseLocalVariables();
        },
        state(func) {
            return [func];
        },
        log(func, value) {
            return [
                ['funcId', func.id],
                ['value', value],
            ];
        },
        validate: false,
        dom: ['variableContainer', 'toggleFuncUseLocalVariables', '&2'],
        undo: 'toggleFuncUseLocalVariables',
    };
    c[COMMAND_TYPES.insertFuncLocalVariable] = {
        do(func, value, index) {
            func.insertFuncLocalVariable(value, index);
        },
        state(func, _value, index) {
            return [func, index];
        },
        log(func, value, index) {
            return [
                ['funcId', func.id],
                ['value', value],
                ['index', index],
            ];
        },
        validate: false,
        dom: ['variableContainer', 'insertFuncLocalVariable', '&2'],
        undo: 'removeFuncLocalVariableByIndex',
    };
    c[COMMAND_TYPES.removeFuncLocalVariableByIndex] = {
        do(func, index) {
            func.removeLocalVariable(index);
        },
        state(func, index) {
            const value = func.localVariables[index];
            return [func, value, index];
        },
        log(func, index) {
            return [
                ['funcId', func.id],
                ['index', index],
            ];
        },
        validate: false,
        dom: ['variableContainer', 'removeFuncLocalVariableByIndex', '&2'],
        undo: 'insertFuncLocalVariable',
    };
})(Entry.Command);
