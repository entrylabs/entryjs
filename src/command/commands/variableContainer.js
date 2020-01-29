/*
 *
 */
'use strict';

const { createTooltip, returnEmptyArr, getExpectedData } = require('../command_util');

(function(c) {
    const { COMMAND_TYPES, RECORDABLE } = Entry.STATIC;

    const {
        variableContainerSelectFilter,
        variableContainerClickVariableAddButton,
        variableContainerAddVariable,
        variableAddSetName,
        variableContainerRemoveVariable,
        variableContainerAddMessage,
        variableContainerRemoveMessage,
        messageSetName,
        variableAddSetScope,
        variableAddSetCloud,
        variableSetVisibility,
        variableSetDefaultValue,
        variableSetSlidable,
        variableSetMinValue,
        variableSetMaxValue,
        variableContainerClickListAddButton,
        variableContainerAddList,
        variableContainerRemoveList,
        listAddSetName,
        listAddSetScope,
        listAddSetCloud,
        listSetVisibility,
        listChangeLength,
        listSetDefaultValue,
        setMessageEditable,
        setVariableEditable,
        setListEditable,
        variableSetName,
        listSetName,
        variableContainerClickMessageAddButton,
    } = COMMAND_TYPES;

    c[variableContainerSelectFilter] = {
        do(newType) {
            getVC().selectFilter(newType);
        },
        state(newType, oldType) {
            return [oldType, newType];
        },
        log(newType, oldType = 'all') {
            return [['newType', newType], ['oldType', oldType]];
        },
        recordable: RECORDABLE.SUPPORT,
        undo: 'variableContainerSelectFilter',
        dom: ['variableContainer', 'filter', '&0'],
    };

    c[variableContainerClickVariableAddButton] = {
        do() {
            getVC().clickVariableAddButton();
        },
        state: returnEmptyArr,
        log: returnEmptyArr,
        recordable: RECORDABLE.SUPPORT,
        get undo() {
            try {
                getVC()._getAddPanel().view.name.value = '';
            } catch (e) {}
            return 'variableContainerClickVariableAddButton';
        },
        dom: ['variableContainer', 'variableAddButton'],
    };

    c[variableContainerClickMessageAddButton] = {
        do() {
            getVC().clickMessageAddButton();
        },
        state: returnEmptyArr,
        log: returnEmptyArr,
        recordable: RECORDABLE.SUPPORT,
        get undo() {
            try {
                getVC()._getAddPanel().view.name.value = '';
            } catch (e) {}
            return 'variableContainerClickMessageAddButton';
        },
        dom: ['variableContainer', 'variableAddButton'],
    };

    c[variableContainerAddVariable] = {
        do(variable) {
            const id = _.result(getExpectedData('variable'), 'id');
            if (id) {
                variable.id_ = id;
            }

            getVC().addVariable(variable);
        },
        state(variable) {
            variable = _toJSON(variable);
            variable.id = _.result(getExpectedData('variable'), 'id') || variable.id;

            return [variable];
        },
        log(variable) {
            return [['variable', _toJSON(variable)]];
        },
        recordable: RECORDABLE.SUPPORT,
        validate: false,
        undo: 'variableContainerRemoveVariable',
        restrict(data, domQuery, callback) {
            getVC().clickVariableAddButton(true, true);
            $('.entryVariableAddSpaceInputWorkspace').val(
                _.result(getExpectedData('variable'), 'name') || ''
            );

            const { title, content } = data.tooltip;

            callback();
            return createTooltip(title, content, domQuery, callback);
        },
        dom: ['variableContainer', 'variableAddConfirmButton'],
    };

    c[variableAddSetName] = {
        do(value) {
            let { dom } = c[variableAddSetName];

            dom = Entry.getDom(dom);
            dom._focused = false;
            dom.value = getExpectedData('value', value);
        },
        state() {
            return [''];
        },
        log(value) {
            return [['value', getExpectedData('value', value)]];
        },
        restrict(data, domQuery, callback) {
            getVC().clickVariableAddButton(true);
            const dom = Entry.getDom(this.dom);
            Entry.Utils.focusIfNotActive(dom);
            dom.enterKeyDisabled = true;
            const { title, content } = data.tooltip;
            return createTooltip(title, content, domQuery, callback, {
                noDispose: true,
            });
        },
        validate: false,
        recordable: RECORDABLE.SUPPORT,
        undo: 'variableAddSetName',
        dom: ['variableContainer', 'variableAddInput'],
    };

    c[variableContainerRemoveVariable] = {
        do(variable) {
            getVC().removeVariable(variable);
        },
        state(variable) {
            return [_toJSON(variable)];
        },
        log(variable) {
            return [['variable', _toJSON(variable)]];
        },
        recordable: RECORDABLE.SUPPORT,
        validate: false,
        undo: 'variableContainerAddVariable',
        dom: ['variableContainer', 'variableAddConfirmButton'],
    };

    c[variableContainerAddMessage] = {
        do(message) {
            message.id = _.result(getExpectedData('message'), 'id') || message.id;
            getVC().addMessage(message);
        },
        state(message) {
            message.id = _.result(getExpectedData('message'), 'id') || message.id;
            return [message];
        },
        log({ name, id }) {
            return [['message', { name, id }]];
        },
        validate: false,
        recordable: RECORDABLE.SUPPORT,
        undo: 'variableContainerRemoveMessage',
        dom: ['variableContainer', 'messageAddButton'],
    };

    c[variableContainerRemoveMessage] = {
        do({ id }) {
            const VC = getVC();
            VC.removeMessage(VC.getMessage(id));
        },
        state({ id, name }) {
            return [{ id, name }];
        },
        log({ id, name }) {
            return [['message', { name, id }]];
        },
        validate: false,
        recordable: RECORDABLE.SUPPORT,
        undo: 'variableContainerAddMessage',
        dom: ['variableContainer', 'messageAddButton'],
    };

    c[messageSetName] = {
        do(id, newName) {
            const VC = getVC();
            const message = VC.getMessage(id);
            const nameField = message.listElement.nameField;

            nameField._focused = false;
            VC.changeMessageName(message, newName);
        },
        state(id) {
            const { name } = getVC().getMessage(id);
            return [id, name];
        },
        log(id, newName) {
            return [['id', id], ['newName', newName]];
        },
        restrict(data, domQuery, callback) {
            const { tooltip: { title, content } } = data;

            callback();
            const VC = getVC();
            const message = VC.getMessage(domQuery[2]);
            delete message.listElement.nameField.isFirst;
            VC.activateMessageEditView(message);
            return createTooltip(title, content, domQuery, callback);
        },
        recordable: RECORDABLE.SUPPORT,
        undo: 'messageSetName',
        dom: ['variableContainer', 'messageList', '&0'],
    };

    c[variableAddSetScope] = {
        do(type = 'global', isCloud = false) {
            const VC = getVC();
            const info = VC.variableAddPanel.info;
            if (type === 'global') {
                info.object = null;
                info.isCloud = isCloud;
            } else if (type === 'local') {
                const { object } = Entry.playground;
                if (!object) {
                    return;
                }
                info.object = object.id;
                info.isCloud = false;
            }
            VC.updateVariableAddView('variable');
        },
        state() {
            const { variableAddPanel: { object, isCloud } } = getVC();
            return [object ? 'local' : 'global', isCloud];
        },
        log(type) {
            return [['type', type]];
        },
        recordable: RECORDABLE.SUPPORT,
        undo: 'variableAddSetScope',
        dom: ['variableContainer', 'variableScope', '&0'],
    };

    c[variableAddSetCloud] = {
        do(value) {
            const VC = getVC();
            VC.variableAddPanel.info.isCloud = value;
            VC.updateVariableAddView('variable');
        },
        state() {
            const { variableAddPanel: { info: { isCloud } } } = getVC();
            return [isCloud];
        },
        log(value) {
            return [['value', value]];
        },
        recordable: RECORDABLE.SUPPORT,
        undo: 'variableAddSetCloud',
        dom: ['variableContainer', 'variableCloud'],
    };

    c[variableSetVisibility] = {
        do(id, value) {
            const VC = getVC();
            const variable = VC.getVariable(id);
            variable.setVisible(value);
            VC.updateVariableSettingView(variable);
        },
        state(id) {
            const VC = getVC();
            const variable = VC.getVariable(id);
            return [id, variable.isVisible()];
        },
        log(id, value) {
            return [['id', id], ['value', value]];
        },
        recordable: RECORDABLE.SUPPORT,
        undo: 'variableSetVisibility',
        dom: ['variableContainer', 'variableSetVisibility'],
    };

    c[variableSetDefaultValue] = {
        do(id, value) {
            const VC = getVC();
            const variable = VC.getVariable(id);
            Entry.getDom(['variableContainer', 'variableSetDefaultValue'])._focused = false;
            variable.setValue(value);
            VC.updateVariableSettingView(variable);
        },
        state(id) {
            const VC = getVC();
            const variable = VC.getVariable(id);
            return [id, variable.getValue()];
        },
        log(id, value) {
            return [['id', id], ['value', value]];
        },
        restrict({ tooltip }, domQuery, callback) {
            const { title: tooltipTitle, content: tooltipContent } = tooltip;
            return createTooltip(tooltipTitle, tooltipContent, domQuery, callback, {
                noDispose: true,
            });
        },
        recordable: RECORDABLE.SUPPORT,
        undo: 'variableSetDefaultValue',
        dom: ['variableContainer', 'variableSetDefaultValue'],
    };

    c[variableSetSlidable] = {
        do(id, type, cValue) {
            const VC = getVC();
            const variable = VC.getVariable(id);
            VC.setVariableSlidable(variable, type, cValue);
        },
        state(id) {
            const VC = getVC();
            const variable = VC.getVariable(id);
            return [id, variable.getType(), variable.getValue()];
        },
        log(id, value) {
            return [['id', id], ['value', value]];
        },
        recordable: RECORDABLE.SUPPORT,
        undo: 'variableSetSlidable',
        dom: ['variableContainer', 'slideCheck'],
    };

    c[variableSetMinValue] = {
        do(id, value) {
            const VC = getVC();
            const variable = VC.getVariable(id);
            variable.setMinValue(value);
            VC.updateVariableSettingView(variable);
        },
        state(id) {
            const VC = getVC();
            const variable = VC.getVariable(id);
            return [id, variable.getMinValue()];
        },
        log(id) {
            const VC = getVC();
            const variable = VC.getVariable(id);
            return [['id', id], ['value', variable.getMinValue()]];
        },
        recordable: RECORDABLE.SUPPORT,
        undo: 'variableSetMinValue',
        dom: ['variableContainer', 'variableMinValue'],
    };

    c[variableSetMaxValue] = {
        do(id, value) {
            const VC = getVC();
            const variable = VC.getVariable(id);
            variable.setMaxValue(value);
            VC.updateVariableSettingView(variable);
        },
        state(id) {
            const VC = getVC();
            const variable = VC.getVariable(id);
            return [id, variable.getMaxValue()];
        },
        log(id) {
            const VC = getVC();
            const variable = VC.getVariable(id);
            return [['id', id], ['value', variable.getMaxValue()]];
        },
        recordable: RECORDABLE.SUPPORT,
        undo: 'variableSetMaxValue',
        dom: ['variableContainer', 'variableMaxValue'],
    };

    c[variableContainerClickListAddButton] = {
        do() {
            getVC().clickListAddButton();
        },
        state: returnEmptyArr,
        log: returnEmptyArr,
        recordable: RECORDABLE.SUPPORT,
        get undo() {
            try {
                getVC()._getAddPanel('list').view.name.value = '';
            } catch (e) {}
            return 'variableContainerClickListAddButton';
        },
        dom: ['variableContainer', 'listAddButton'],
    };

    c[variableContainerAddList] = {
        do(list) {
            const id = _.result(getExpectedData('list'), 'id');
            if (id) {
                if (list.setId) {
                    list.setId(id);
                } else {
                    list.id = id;
                }
            }
            getVC().addList(list);
        },
        state(list) {
            list = _toJSON(list);
            list.id = _.result(getExpectedData('list'), 'id') || list.id;
            return [list];
        },
        log(list) {
            list = _toJSON(list);
            list.id = _.result(getExpectedData('list'), 'id') || list.id;
            return [['list', list]];
        },
        recordable: RECORDABLE.SUPPORT,
        validate: false,
        undo: 'variableContainerRemoveList',
        restrict(data, domQuery, callback) {
            getVC().clickListAddButton(true, true);
            Entry.getDom(['variableContainer', 'listAddInput']).value =
                _.result(getExpectedData('list'), 'name') || '';

            const { title, content } = data.tooltip;
            callback();
            return createTooltip(title, content, domQuery, callback);
        },
        dom: ['variableContainer', 'listAddConfirmButton'],
    };

    c[variableContainerRemoveList] = {
        do(list) {
            getVC().removeList(list);
        },
        state(list) {
            return [_toJSON(list)];
        },
        log(list) {
            return [['list', _toJSON(list)]];
        },
        recordable: RECORDABLE.SUPPORT,
        validate: false,
        undo: 'variableContainerAddList',
        dom: ['variableContainer', 'listAddConfirmButton'],
    };

    c[listAddSetName] = {
        do(value) {
            let { dom } = c[listAddSetName];

            dom = Entry.getDom(dom);
            dom._focused = false;
            dom.value = getExpectedData('value', value);
        },
        state() {
            return [''];
        },
        log(value) {
            return [['value', getExpectedData('value', value)]];
        },
        restrict(data, domQuery, callback) {
            getVC().clickListAddButton(true);
            const dom = Entry.getDom(this.dom);
            Entry.Utils.focusIfNotActive(dom);
            dom.enterKeyDisabled = true;
            const { title, content } = data.tooltip;
            return createTooltip(title, content, domQuery, callback, {
                noDispose: true,
            });
        },
        validate: false,
        recordable: RECORDABLE.SUPPORT,
        undo: 'listAddSetName',
        dom: ['variableContainer', 'listAddInput'],
    };

    c[listAddSetScope] = {
        do(type = 'global', isCloud = false) {
            const VC = getVC();
            const info = VC.listAddPanel.info;
            if (type === 'global') {
                info.object = null;
                info.isCloud = isCloud;
            } else if (type === 'local') {
                const { object } = Entry.playground;
                if (!object) {
                    return;
                }
                info.object = object.id;
                info.isCloud = false;
            }
            VC.updateVariableAddView('list');
        },
        state() {
            const { listAddPanel: { object, isCloud } } = getVC();
            return [object ? 'local' : 'global', isCloud];
        },
        log(type) {
            return [['type', type]];
        },
        recordable: RECORDABLE.SUPPORT,
        undo: 'listAddSetScope',
        dom: ['variableContainer', 'listScope', '&0'],
    };

    c[listAddSetCloud] = {
        do(value) {
            const VC = getVC();
            VC.listAddPanel.info.isCloud = value;
            VC.updateVariableAddView('list');
        },
        state() {
            const { listAddPanel: { info: { isCloud } } } = getVC();
            return [isCloud];
        },
        log(value) {
            return [['value', value]];
        },
        recordable: RECORDABLE.SUPPORT,
        undo: 'listAddSetCloud',
        dom: ['variableContainer', 'listCloud'],
    };

    c[listSetVisibility] = {
        do(id, value) {
            const VC = getVC();
            const list = VC.getList(id);
            list.setVisible(value);
            VC.updateListSettingView(list);
        },
        state(id) {
            return [
                id,
                getVC()
                    .getList(id)
                    .isVisible(),
            ];
        },
        log(id, value) {
            return [['id', id], ['value', value]];
        },
        restrict: _listActiveRestrictor,
        recordable: RECORDABLE.SUPPORT,
        undo: 'listSetVisibility',
        dom: ['variableContainer', 'listSetVisibility'],
    };

    c[listChangeLength] = {
        async do(id, value) {
            const VC = getVC();
            const list = VC.getList(id);
            const length = list.getArray().length;
            let result;
            if (value === 'minus') {
                result = Math.max(0, length - 1);
                await list.deleteValue(result);
            } else if (value === 'plus') {
                result = length + 1;
                await list.appendValue(0);
            } else if (Entry.Utils.isNumber(value) && value >= 0) {
                result = value;
            } else {
                result = length;
            }

            VC.setListLength(list, result);
        },
        state(id) {
            return [id, getVC().getList(id).array_.length];
        },
        log(id, value) {
            return [
                ['id', id],
                ['value', value],
                ['dom', Entry.Utils.isNumber(value) ? 'lengthInput' : value],
            ];
        },
        recordable: RECORDABLE.SUPPORT,
        undo: 'listChangeLength',
        restrict({ tooltip, content }, domQuery, callback) {
            _updateSelected(content);
            const { title: tooltipTitle, content: tooltipContent } = tooltip;
            return createTooltip(tooltipTitle, tooltipContent, domQuery, callback, {
                noDispose: true,
            });
        },
        dom: ['variableContainer', 'listChangeLength', '&2'],
    };

    c[listSetDefaultValue] = {
        do(id, idx = 0, data = '0') {
            const VC = getVC();
            const list = VC.getList(id);
            list.getArray()[idx] = { data };
            VC.updateListSettingView();
            //list.updateView();
        },
        state(id, idx) {
            const { array_ } = getVC().getList(id);
            return [id, idx, array_[idx].data];
        },
        log(id, idx, data) {
            return [['id', id], ['idx', idx], ['data', data]];
        },
        recordable: RECORDABLE.SUPPORT,
        undo: 'listSetDefaultValue',
        restrict(data, domQuery, callback) {
            _updateSelected(data.content);
            Entry.Utils.focusIfNotActive(Entry.getDom(domQuery));
            const { title, content } = data.tooltip;
            return createTooltip(title, content, domQuery, callback, {
                noDispose: true,
            });
        },
        dom: ['variableContainer', 'listDefaultValue', '&1'],
    };

    c[setMessageEditable] = {
        do(id) {
            const VC = getVC();
            const message = VC.getMessage(id);
            VC.activateMessageEditView(message);
            message.listElement.removeClass('activeForce');
        },
        state(id) {
            return [id];
        },
        log(id) {
            return [['id', id]];
        },
        recordable: RECORDABLE.SUPPORT,
        undo: 'setMessageEditable',
        restrict(data, domQuery, callback) {
            Entry.Utils.blur();
            getVC()
                .getMessage(data.content[1][1])
                .listElement.addClass('activeForce');
            const { title, content } = data.tooltip;
            return createTooltip(title, content, domQuery, callback);
        },
        dom: ['variableContainer', 'messageEditButton', '&0'],
    };

    c[setVariableEditable] = {
        do(id, value = true) {
            const VC = getVC();
            const variable = VC.getVariable(id);
            const { nameField } = variable.listElement;

            if (value) {
                VC.updateSelectedVariable(variable);
            } else {
                nameField.blur();
                VC.updateSelectedVariable(null, 'variable');
            }
        },
        state(id) {
            return [id];
        },
        log(id) {
            return [['id', id]];
        },
        recordable: RECORDABLE.SUPPORT,
        undo: 'setVariableEditable',
        restrict(data, domQuery, callback) {
            Entry.Utils.blur();
            const VC = getVC();
            VC.updateSelectedVariable(null, 'variable');
            VC.getVariable(data.content[1][1]).listElement.addClass('activeForce');
            const { title, content } = data.tooltip;
            return createTooltip(title, content, domQuery, callback);
        },
        dom: ['variableContainer', 'variableEditButton', '&0'],
    };

    c[setListEditable] = {
        do(id) {
            const VC = getVC();
            const variable = VC.getList(id);
            // const { nameField } = variable.listElement;

            // nameField.removeAttribute('disabled');
            VC.updateSelectedVariable(variable);
            // nameField.focus();
        },
        state(id) {
            return [id];
        },
        log(id) {
            return [['id', id]];
        },
        recordable: RECORDABLE.SUPPORT,
        undo: 'setListEditable',
        restrict(data, domQuery, callback) {
            Entry.Utils.blur();
            getVC()
                .getList(data.content[1][1])
                .listElement.addClass('activeForce');
            const { title, content } = data.tooltip;
            return createTooltip(title, content, domQuery, callback);
        },
        dom: ['variableContainer', 'listEditButton', '&0'],
    };

    c[variableSetName] = {
        do(id, value) {
            const VC = getVC();
            VC.changeVariableName(VC.getVariable(id), value);
        },
        state(id) {
            return [
                id,
                getVC()
                    .getVariable(id)
                    .getName(),
            ];
        },
        log(id, value) {
            return [['id', id], ['value', value]];
        },
        restrict({ tooltip, content }, domQuery, callback) {
            _updateSelected(content);

            Entry.Utils.focusIfNotActive(domQuery);

            const { title: tooltipTitle, content: tooltipContent } = tooltip;
            return createTooltip(tooltipTitle, tooltipContent, domQuery, callback, {
                noDispose: true,
            });
        },
        recordable: RECORDABLE.SUPPORT,
        undo: 'variableSetName',
        dom: ['variableContainer', 'variableName', '&0'],
    };

    c[listSetName] = {
        do(id, value) {
            const VC = getVC();
            VC.changeListName(VC.getList(id), value);
        },
        state(id) {
            return [
                id,
                getVC()
                    .getList(id)
                    .getName(),
            ];
        },
        log(id, value) {
            return [['id', id], ['value', value]];
        },
        restrict({ tooltip, content }, domQuery, callback) {
            _updateSelected(content);

            Entry.Utils.focusIfNotActive(domQuery);

            const { title: tooltipTitle, content: tooltipContent } = tooltip;
            return createTooltip(tooltipTitle, tooltipContent, domQuery, callback, {
                noDispose: true,
            });
        },
        recordable: RECORDABLE.SUPPORT,
        undo: 'listSetName',
        dom: ['variableContainer', 'listName', '&0'],
    };

    //utilities

    //if data has toJSON method
    //return data.toJSON()
    //else just return data as is
    function _toJSON(data) {
        return _.result(data, 'toJSON') || data;
    }

    function getVC() {
        return Entry.variableContainer;
    }

    function _updateSelected(content) {
        const VC = getVC();
        const vId = content[1][1];
        const v = VC.getVariable(vId) || VC.getList(vId);
        if (v) {
            VC.updateSelectedVariable(v);
        }
    }

    function _listActiveRestrictor({ tooltip, content }, domQuery, callback) {
        _updateSelected(content);
        const { title: tooltipTitle, content: tooltipContent } = tooltip;
        return createTooltip(tooltipTitle, tooltipContent, domQuery, callback);
    }
})(Entry.Command);
