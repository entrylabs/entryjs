/*
 *
 */
'use strict';

var { createTooltip, returnEmptyArr } = require('../command_util');

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
    } = COMMAND_TYPES;

    c[variableContainerSelectFilter] = {
        do: function(newType, oldType) {
            Entry.variableContainer.selectFilter(newType);
        },
        state: function(newType, oldType) {
            return [oldType, newType];
        },
        log: function(newType, oldType) {
            oldType = oldType || 'all';
            return [['newType', newType], ['oldType', oldType]];
        },
        recordable: RECORDABLE.SUPPORT,
        undo: 'variableContainerSelectFilter',
        dom: ['variableContainer', 'filter', '&0'],
    };

    c[variableContainerClickVariableAddButton] = {
        do: function() {
            Entry.variableContainer.clickVariableAddButton();
        },
        state: returnEmptyArr,
        log: returnEmptyArr,
        recordable: RECORDABLE.SUPPORT,
        undo: 'variableContainerClickVariableAddButton',
        dom: ['variableContainer', 'variableAddButton'],
    };

    c[variableContainerAddVariable] = {
        do: function(variable) {
            var that = c[variableContainerAddVariable];
            var hashId = that.hashId;
            if (hashId) {
                variable.id_ = hashId;
                delete that.hashId;
            }
            Entry.variableContainer.addVariable(variable);
        },
        state: function(variable) {
            if (variable instanceof Entry.Variable)
                variable = variable.toJSON();
            var that = c[variableContainerAddVariable];
            var hashId = that.hashId;
            if (hashId) variable.id = hashId;
            return [variable];
        },
        log: function(variable) {
            if (variable instanceof Entry.Variable)
                variable = variable.toJSON();
            return [['variable', variable]];
        },
        recordable: RECORDABLE.SUPPORT,
        validate: false,
        undo: 'variableContainerRemoveVariable',
        restrict: function(data, domQuery, callback) {
            Entry.variableContainer.clickVariableAddButton(true, true);
            var dom = $('.entryVariableAddSpaceInputWorkspace');
            dom.val(data.content[1][1].name);

            this.hashId = data.content[1][1].id;

            var { title, content } = data.tooltip;
            callback();
            return createTooltip(title, content, domQuery, callback);
        },
        dom: ['variableContainer', 'variableAddConfirmButton'],
    };

    c[variableAddSetName] = {
        do: function(value) {
            var that = c[variableAddSetName];
            var dom = $('.entryVariableAddSpaceInputWorkspace');
            dom[0].blurred = true;
            dom.blur();
            value = that._nextValue || value;
            dom.val(value);
            delete that._nextValue;
        },
        state: function(value) {
            return [''];
        },
        log: function(value) {
            return [['value', c[variableAddSetName]._nextValue || value]];
        },
        restrict: function(data, domQuery, callback) {
            Entry.variableContainer.clickVariableAddButton(true);
            this._nextValue = data.content[1][1];
            var dom = _.head($('.entryVariableAddSpaceInputWorkspace'));
            dom.enterKeyDisabled = true;
            if (!Entry.Utils.isDomActive(dom)) {
                dom.focus();
            }
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
            return [['variable', variable]];
        },
        recordable: RECORDABLE.SUPPORT,
        validate: false,
        undo: 'variableContainerAddVariable',
        dom: ['variableContainer', 'variableAddConfirmButton'],
    };

    c[variableContainerAddMessage] = {
        do: function(message) {
            var that = c[variableContainerAddMessage];
            var { hashId } = that;
            if (hashId) {
                message.id = hashId;
                delete that.hashId;
            }

            Entry.variableContainer.addMessage(message);
        },
        state: function(message) {
            var { hashId } = c[variableContainerAddMessage];
            if (hashId) message.id = hashId;
            return [message];
        },
        log: function({ name, id }) {
            return [['message', { name, id }]];
        },
        restrict(data, domQuery, callback) {
            var { content: contentData, tooltip: { title, content } } = data;

            this.hashId = contentData[1][1].id;
            callback();
            return createTooltip(title, content, domQuery, callback);
        },
        validate: false,
        recordable: RECORDABLE.SUPPORT,
        undo: 'variableContainerRemoveMessage',
        dom: ['variableContainer', 'messageAddButton'],
    };

    c[variableContainerRemoveMessage] = {
        do({ id }) {
            var { variableContainer } = Entry;
            variableContainer.removeMessage(variableContainer.getMessage(id));
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
            var { variableContainer } = Entry;
            var message = variableContainer.getMessage(id);
            var nameField = message.listElement.nameField;

            nameField.blurred = true;
            variableContainer.changeMessageName(message, newName);
        },
        state(id) {
            var { name } = Entry.variableContainer.getMessage(id);
            return [id, name];
        },
        log(id, newName) {
            return [['id', id], ['newName', newName]];
        },
        restrict(data, domQuery, callback) {
            var { content: contentData, tooltip: { title, content } } = data;

            callback();
            var { variableContainer } = Entry;
            var message = variableContainer.getMessage(domQuery[2]);
            delete message.listElement.nameField.isFirst;
            variableContainer.activateMessageEditView(message);
            return createTooltip(title, content, domQuery, callback);
        },
        recordable: RECORDABLE.SUPPORT,
        undo: 'messageSetName',
        dom: ['variableContainer', 'messageList', '&0'],
    };

    c[variableAddSetScope] = {
        do(type = 'global', isCloud = false) {
            var VC = Entry.variableContainer;
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
            } = Entry.variableContainer;
            return [object ? 'local' : 'global', isCloud];
        },
        log(type) {
            return [['type', type]];
        },
        validate: false,
        recordable: RECORDABLE.SUPPORT,
        undo: 'variableAddSetScope',
        dom: ['variableContainer', 'variableScope', '&0'],
    };

    c[variableAddSetCloud] = {
        do(value) {
            var VC = Entry.variableContainer;
            VC.variableAddPanel.info.isCloud = value;
            VC.updateVariableAddView('variable');
        },
        state() {
            var {
                variableAddPanel: { info: { isCloud } },
            } = Entry.variableContainer;
            return [isCloud];
        },
        log(value) {
            return [['value', value]];
        },
        validate: false,
        recordable: RECORDABLE.SUPPORT,
        undo: 'variableAddSetCloud',
        dom: ['variableContainer', 'variableCloud'],
    };
})(Entry.Command);
