/*
 *
 */
'use strict';

(function (c) {
    var {
        COMMAND_TYPES,
        RECORDABLE,
    } = Entry.STATIC;

    function returnEmptyArr() {
        return [];
    }

    var {
        variableContainerSelectFilter,
        variableContainerClickVariableAddButton,
        variableContainerAddVariable,
        variableAddSetName,
        variableContainerRemoveVariable,
        variableContainerAddMessage,
        variableContainerRemoveMessage,
        messageSetName
    } = COMMAND_TYPES;

    c[variableContainerSelectFilter] = {
        do: function (newType, oldType) {
            Entry.variableContainer.selectFilter(newType);
        },
        state: function (newType, oldType) {
            return [oldType, newType];
        },
        log: function (newType, oldType) {
            oldType = oldType || 'all';
            return [['newType', newType], ['oldType', oldType]];
        },
        recordable: RECORDABLE.SUPPORT,
        undo: 'variableContainerSelectFilter',
        dom: ['variableContainer', 'filter', '&0'],
    };

    c[variableContainerClickVariableAddButton] = {
        do: function () {
            Entry.variableContainer.clickVariableAddButton();
        },
        state: returnEmptyArr,
        log: returnEmptyArr,
        recordable: RECORDABLE.SUPPORT,
        undo: 'variableContainerClickVariableAddButton',
        dom: ['variableContainer', 'variableAddButton'],
    };

    c[variableContainerAddVariable] = {
        do: function (variable) {
            var that = c[variableContainerAddVariable];
            var hashId = that.hashId;
            if (hashId) {
                variable.id_ = hashId;
                delete that.hashId;
            }
            Entry.variableContainer.addVariable(variable);
        },
        state: function (variable) {
            if (variable instanceof Entry.Variable)
                variable = variable.toJSON();
            var that = c[variableContainerAddVariable];
            var hashId = that.hashId;
            if (hashId) variable.id = hashId;
            return [variable];
        },
        log: function (variable) {
            if (variable instanceof Entry.Variable)
                variable = variable.toJSON();
            return [['variable', variable]];
        },
        recordable: RECORDABLE.SUPPORT,
        validate: false,
        undo: 'variableContainerRemoveVariable',
        restrict: function (data, domQuery, callback) {
            Entry.variableContainer.clickVariableAddButton(true, true);
            var dom = $('.entryVariableAddSpaceInputWorkspace');
            dom.val(data.content[1][1].name);

            this.hashId = data.content[1][1].id;

            var tooltip = new Entry.Tooltip(
                [
                    {
                        title: data.tooltip.title,
                        content: data.tooltip.content,
                        target: domQuery,
                    },
                ],
                {
                    restrict: true,
                    dimmed: true,
                    callBack: callback,
                }
            );
            callback();
            return tooltip;
        },
        dom: ['variableContainer', 'variableAddConfirmButton'],
    };

    c[variableAddSetName] = {
        do: function (value) {
            var that = c[variableAddSetName];
            var dom = $('.entryVariableAddSpaceInputWorkspace');
            dom[0].blurred = true;
            dom.blur();
            value = that._nextValue || value;
            dom.val(value);
            delete that._nextValue;
        },
        state: function (value) {
            return [''];
        },
        log: function (value) {
            return [
                [
                    'value',
                    c[variableAddSetName]._nextValue || value,
                ],
            ];
        },
        restrict: function (data, domQuery, callback) {
            Entry.variableContainer.clickVariableAddButton(true);
            this._nextValue = data.content[1][1];
            var dom = $('.entryVariableAddSpaceInputWorkspace');
            dom[0].enterKeyDisabled = true;
            var tooltip = new Entry.Tooltip(
                [
                    {
                        title: data.tooltip.title,
                        content: data.tooltip.content,
                        target: domQuery,
                    },
                ],
                {
                    restrict: true,
                    noDispose: true,
                    dimmed: true,
                    callBack: callback,
                }
            );
            return tooltip;
        },
        validate: false,
        recordable: RECORDABLE.SUPPORT,
        undo: 'variableAddSetName',
        dom: ['variableContainer', 'variableAddInput'],
    };

    c[variableContainerRemoveVariable] = {
        do: function (variable) {
            Entry.variableContainer.removeVariable(variable);
        },
        state: function (variable) {
            if (variable instanceof Entry.Variable)
                variable = variable.toJSON();
            return [variable];
        },
        log: function (variable) {
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
        do: function (message) {
            var that = c[variableContainerAddMessage];
            var { hashId } = that;
            if (hashId) {
                message.id = hashId;
                delete that.hashId;
            }
            Entry.variableContainer.addMessage(message);
        },
        state: function (message) {
            var { hashId } = c[variableContainerAddMessage];
            if (hashId) message.id = hashId;
            return [message];
        },
        log: function ({name, id}) {
            return [['message', {name, id}]];
        },
        restrict(data, domQuery, callback) {
            var { content: contentData, tooltip: { title, content } } = data;

            this.hashId = contentData[1][1].id;
            var tooltip = new Entry.Tooltip(
                [
                    {
                        title,
                        content,
                        target: domQuery,
                    },
                ],
                {
                    restrict: true,
                    dimmed: true,
                    callBack: callback,
                }
            );
            callback();
            return tooltip;
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
        state({id, name}) {
            return [{ id, name }];
        },
        log({id, name}) {
            return [['message', {name, id}]];
        },
        validate: false,
        recordable: RECORDABLE.SUPPORT,
        undo: 'variableContainerAddMessage',
        dom: ['variableContainer', 'messageAddButton'],
    };

    c[messageSetName] = {
        do(message, newName) {
            Entry.variableContainer.changeMessageName(message, newName);
        },
        state(message, newName) {
            return [message, message.name];
        },
        log({id, name}) {
            return [];

        },
        recordable: RECORDABLE.SUPPORT,
        undo: 'messageSetName',
        dom: ['variableContainer', 'messageAddButton'],
    };


})(Entry.Command);
