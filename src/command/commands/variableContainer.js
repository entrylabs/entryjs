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
    var { COMMAND_TYPES, RECORDABLE } = Entry.STATIC;

    var {
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
    } = COMMAND_TYPES;

    c[variableContainerSelectFilter] = {
        do: function(newType, oldType) {
            getVC().selectFilter(newType);
        },
        state: function(newType, oldType) {
            return [oldType, newType];
        },
        log: function(newType, oldType = 'all') {
            return [['newType', newType], ['oldType', oldType]];
        },
        recordable: RECORDABLE.SUPPORT,
        undo: 'variableContainerSelectFilter',
        dom: ['variableContainer', 'filter', '&0'],
    };

    c[variableContainerClickVariableAddButton] = {
        do: function() {
            getVC().clickVariableAddButton();
        },
        state: returnEmptyArr,
        log: returnEmptyArr,
        recordable: RECORDABLE.SUPPORT,
        get undo() {
            try{
                getVC()._getAddPanel().view.name.value = ""
            } catch(e) {}
            return 'variableContainerClickVariableAddButton';
        },
        dom: ['variableContainer', 'variableAddButton'],
    };

    c[variableContainerAddVariable] = {
        do: function(variable) {
            var id = _.result(getExpectedData('variable'), 'id');
            if (id) {
                variable.id_ = id;
            }

            getVC().addVariable(variable);
        },
        state: function(variable) {
            variable = _toJSON(variable);
            variable.id =
                _.result(getExpectedData('variable'), 'id') || variable.id;

            return [variable];
        },
        log: function(variable) {
            return [['variable', _toJSON(variable)]];
        },
        recordable: RECORDABLE.SUPPORT,
        validate: false,
        undo: 'variableContainerRemoveVariable',
        restrict: function(data, domQuery, callback) {
            getVC().clickVariableAddButton(true, true);
            $('.entryVariableAddSpaceInputWorkspace').val(
                _.result(getExpectedData('variable'), 'name') || ''
            );

            var { title, content } = data.tooltip;

            callback();
            return createTooltip(title, content, domQuery, callback);
        },
        dom: ['variableContainer', 'variableAddConfirmButton'],
    };

    c[variableAddSetName] = {
        do: function(value) {
            var { dom } = c[variableAddSetName];

            dom = Entry.getDom(dom);
            dom._focused = false;
            dom.value = getExpectedData('value', value);
        },
        state: function(value) {
            return [''];
        },
        log: function(value) {
            return [['value', getExpectedData('value', value)]];
        },
        restrict: function(data, domQuery, callback) {
            getVC().clickVariableAddButton(true);
            var dom = Entry.getDom(this.dom);
            Entry.Utils.focusIfNotActive(dom);
            dom.enterKeyDisabled = true;
            var { title, content } = data.tooltip;
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
        do: function(variable) {
            getVC().removeVariable(variable);
        },
        state: function(variable) {
            return [_toJSON(variable)];
        },
        log: function(variable) {
            return [['variable', _toJSON(variable)]];
        },
        recordable: RECORDABLE.SUPPORT,
        validate: false,
        undo: 'variableContainerAddVariable',
        dom: ['variableContainer', 'variableAddConfirmButton'],
    };

    c[variableContainerAddMessage] = {
        do: function(message) {
            message.id =
                _.result(getExpectedData('message'), 'id') || message.id;
            getVC().addMessage(message);
        },
        state: function(message) {
            message.id =
                _.result(getExpectedData('message'), 'id') || message.id;
            return [message];
        },
        log: function({ name, id }) {
            return [['message', { name, id }]];
        },
        validate: false,
        recordable: RECORDABLE.SUPPORT,
        undo: 'variableContainerRemoveMessage',
        dom: ['variableContainer', 'messageAddButton'],
    };

    c[variableContainerRemoveMessage] = {
        do({ id }) {
            var VC = getVC();
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
            var VC = getVC();
            var message = VC.getMessage(id);
            var nameField = message.listElement.nameField;

            nameField._focused = false;
            VC.changeMessageName(message, newName);
        },
        state(id) {
            var { name } = getVC().getMessage(id);
            return [id, name];
        },
        log(id, newName) {
            return [['id', id], ['newName', newName]];
        },
        restrict(data, domQuery, callback) {
            var {
                content: contentData,
                tooltip: { title, content },
            } = data;

            callback();
            var VC = getVC();
            var message = VC.getMessage(domQuery[2]);
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
            var VC = getVC();
            var info = VC.variableAddPanel.info;
            if (type === 'global') {
                info.object = null;
                info.isCloud = isCloud;
            } else if (type === 'local') {
                var { object } = Entry.playground;
                if (!object) return;
                info.object = object.id;
                info.isCloud = false;
            }
            VC.updateVariableAddView('variable');
        },
        state() {
            var {
                variableAddPanel: { object, isCloud },
            } = getVC();
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
            var VC = getVC();
            VC.variableAddPanel.info.isCloud = value;
            VC.updateVariableAddView('variable');
        },
        state() {
            var {
                variableAddPanel: {
                    info: { isCloud },
                },
            } = getVC();
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
            var VC = getVC();
            var variable = VC.getVariable(id);
            variable.setVisible(value);
            VC.updateVariableSettingView(variable);
        },
        state(id, value) {
            var VC = getVC();
            var variable = VC.getVariable(id);
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
            var VC = getVC();
            var variable = VC.getVariable(id);
            Entry.getDom([
                'variableContainer',
                'variableSetDefaultValue',
            ])._focused = false;
            variable.setValue(value);
            VC.updateVariableSettingView(variable);
        },
        state(id, value) {
            var VC = getVC();
            var variable = VC.getVariable(id);
            return [id, variable.getValue()];
        },
        log(id, value) {
            return [['id', id], ['value', value]];
        },
        restrict({ tooltip, content }, domQuery, callback) {
            var { title: tooltipTitle, content: tooltipContent } = tooltip;
            return createTooltip(
                tooltipTitle,
                tooltipContent,
                domQuery,
                callback,
                { noDispose: true }
            );
        },
        recordable: RECORDABLE.SUPPORT,
        undo: 'variableSetDefaultValue',
        dom: ['variableContainer', 'variableSetDefaultValue'],
    };

    c[variableSetSlidable] = {
        do(id, type, cValue) {
            var VC = getVC();
            var variable = VC.getVariable(id);
            VC.setVariableSlidable(variable, type, cValue);
        },
        state(id, value) {
            var VC = getVC();
            var variable = VC.getVariable(id);
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
            var VC = getVC();
            var variable = VC.getVariable(id);
            variable.setMinValue(value);
            VC.updateVariableSettingView(variable);
        },
        state(id, value) {
            var VC = getVC();
            var variable = VC.getVariable(id);
            return [id, variable.getMinValue()];
        },
        log(id, value) {
            var VC = getVC();
            var variable = VC.getVariable(id);
            return [['id', id], ['value', variable.getMinValue()]];
        },
        recordable: RECORDABLE.SUPPORT,
        undo: 'variableSetMinValue',
        dom: ['variableContainer', 'variableMinValue'],
    };

    c[variableSetMaxValue] = {
        do(id, value) {
            var VC = getVC();
            var variable = VC.getVariable(id);
            variable.setMaxValue(value);
            VC.updateVariableSettingView(variable);
        },
        state(id, value) {
            var VC = getVC();
            var variable = VC.getVariable(id);
            return [id, variable.getMaxValue()];
        },
        log(id, value) {
            var VC = getVC();
            var variable = VC.getVariable(id);
            return [['id', id], ['value', variable.getMaxValue()]];
        },
        recordable: RECORDABLE.SUPPORT,
        undo: 'variableSetMaxValue',
        dom: ['variableContainer', 'variableMaxValue'],
    };

    c[variableContainerClickListAddButton] = {
        do: function() {
            getVC().clickListAddButton();
        },
        state: returnEmptyArr,
        log: returnEmptyArr,
        recordable: RECORDABLE.SUPPORT,
        get undo() {
            try{
                getVC()._getAddPanel('list').view.name.value = ""
            } catch(e) {}
            return 'variableContainerClickListAddButton';
        },
        dom: ['variableContainer', 'listAddButton'],
    };

    c[variableContainerAddList] = {
        do(list) {
            var id = _.result(getExpectedData('list'), 'id');
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

            var { title, content } = data.tooltip;
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
        do: function(value) {
            var { dom } = c[listAddSetName];

            dom = Entry.getDom(dom);
            dom._focused = false;
            dom.value = getExpectedData('value', value);
        },
        state: function(value) {
            return [''];
        },
        log: function(value) {
            return [['value', getExpectedData('value', value)]];
        },
        restrict: function(data, domQuery, callback) {
            getVC().clickListAddButton(true);
            var dom = Entry.getDom(this.dom);
            Entry.Utils.focusIfNotActive(dom);
            dom.enterKeyDisabled = true;
            var { title, content } = data.tooltip;
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
            var VC = getVC();
            var info = VC.listAddPanel.info;
            if (type === 'global') {
                info.object = null;
                info.isCloud = isCloud;
            } else if (type === 'local') {
                var { object } = Entry.playground;
                if (!object) return;
                info.object = object.id;
                info.isCloud = false;
            }
            VC.updateVariableAddView('list');
        },
        state() {
            var {
                listAddPanel: { object, isCloud },
            } = getVC();
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
            var VC = getVC();
            VC.listAddPanel.info.isCloud = value;
            VC.updateVariableAddView('list');
        },
        state() {
            var {
                listAddPanel: {
                    info: { isCloud },
                },
            } = getVC();
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
            var VC = getVC();
            var list = VC.getList(id);
            list.setVisible(value);
            VC.updateListSettingView(list);
        },
        state(id, value) {
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
        do(id, value) {
            var VC = getVC();
            var list = VC.getList(id);
            var length = list.array_.length;

            if (value === 'minus') {
                value = Math.max(0, length - 1);
            } else if (value === 'plus') {
                value = length + 1;
            } else if (Entry.Utils.isNumber(value)) {
                value = value;
            } else {
                value = length;
            }

            VC.setListLength(list, value);
        },
        state(id, value) {
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
            var { title: tooltipTitle, content: tooltipContent } = tooltip;
            return createTooltip(
                tooltipTitle,
                tooltipContent,
                domQuery,
                callback,
                { noDispose: true }
            );
        },
        dom: ['variableContainer', 'listChangeLength', '&2'],
    };

    c[listSetDefaultValue] = {
        do(id, idx, data) {
            var VC = getVC();
            var list = VC.getList(id);
            list.array_[idx] = { data };

            VC.updateListSettingView();
            list.updateView();
        },
        state(id, idx, data) {
            var { array_ } = getVC().getList(id);
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
            var { title, content } = data.tooltip;
            return createTooltip(title, content, domQuery, callback, {
                noDispose: true,
            });
        },
        dom: ['variableContainer', 'listDefaultValue', '&1'],
    };

    c[setMessageEditable] = {
        do(id) {
            var VC = getVC();
            var message = VC.getMessage(id);
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
            var { title, content } = data.tooltip;
            return createTooltip(title, content, domQuery, callback);
        },
        dom: ['variableContainer', 'messageEditButton', '&0'],
    };

    c[setVariableEditable] = {
        do(id, value = true) {
            var VC = getVC();
            var variable = VC.getVariable(id);
            var { nameField } = variable.listElement;

            if (value) {
                nameField.removeAttribute('disabled');
                VC.updateSelectedVariable(variable);
                Entry.Utils.focusIfNotActive(nameField);
            } else {
                nameField.blur();
                nameField.setAttribute('disabled', 'disabled');
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
            var VC = getVC();
            VC.updateSelectedVariable(null, 'variable');
            VC.getVariable(data.content[1][1]).listElement.addClass(
                'activeForce'
            );
            var { title, content } = data.tooltip;
            return createTooltip(title, content, domQuery, callback);
        },
        dom: ['variableContainer', 'variableEditButton', '&0'],
    };

    c[setListEditable] = {
        do(id) {
            var VC = getVC();
            var variable = VC.getList(id);
            var { nameField } = variable.listElement;

            nameField.removeAttribute('disabled');
            VC.updateSelectedVariable(variable);
            nameField.focus();
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
            var { title, content } = data.tooltip;
            return createTooltip(title, content, domQuery, callback);
        },
        dom: ['variableContainer', 'listEditButton', '&0'],
    };

    c[variableSetName] = {
        do(id, value) {
            var VC = getVC();
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

            var { title: tooltipTitle, content: tooltipContent } = tooltip;
            return createTooltip(
                tooltipTitle,
                tooltipContent,
                domQuery,
                callback,
                { noDispose: true }
            );
        },
        recordable: RECORDABLE.SUPPORT,
        undo: 'variableSetName',
        dom: ['variableContainer', 'variableName', '&0'],
    };

    c[listSetName] = {
        do(id, value) {
            var VC = getVC();
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

            var { title: tooltipTitle, content: tooltipContent } = tooltip;
            return createTooltip(
                tooltipTitle,
                tooltipContent,
                domQuery,
                callback,
                { noDispose: true }
            );
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
        var VC = getVC();
        var vId = content[1][1];
        var v = VC.getVariable(vId) || VC.getList(vId);
        if (v) {
            VC.updateSelectedVariable(v);
        }
    }

    function _listActiveRestrictor({ tooltip, content }, domQuery, callback) {
        _updateSelected(content);
        var { title: tooltipTitle, content: tooltipContent } = tooltip;
        return createTooltip(tooltipTitle, tooltipContent, domQuery, callback);
    }
})(Entry.Command);
