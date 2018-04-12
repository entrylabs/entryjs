/**
 * @fileoverview Variable container for variable object
 */
'use strict';

/**
 * Block variable constructor
 * @param {variable model} variable
 * @constructor
 */
Entry.VariableContainer = function() {
    this.variables_ = [];
    this.messages_ = [];
    this.lists_ = [];
    this.functions_ = {};
    this.viewMode_ = 'all';
    this.selected = null;
    this.variableAddPanel = {
        isOpen: false,
        info: {
            object: null,
            isCloud: false,
        },
    };
    this.listAddPanel = {
        isOpen: false,
        info: {
            object: null,
            isCloud: false,
        },
    };
    this.selectedVariable = null;
    this._variableRefs = [];
    this._messageRefs = [];
    this._functionRefs = [];
    this._filterTabs = {};
    Entry.addEventListener('workspaceChangeMode', this.updateList.bind(this));
};

(function(p) {
    p.createDom = function(view) {
        var that = this;
        this.filterElements = {};
        this.view_ = view;
        var selectView = Entry.createElement('table');
        selectView.addClass('entryVariableSelectorWorkspace');
        this.view_.appendChild(selectView);
        var selectTrView = Entry.createElement('tr');
        selectView.appendChild(selectTrView);

        var allButton = this.createSelectButton('all');
        this.filterElements.all = allButton;

        allButton.setAttribute('rowspan', '2');
        allButton.addClass('selected', 'allButton');
        selectTrView.appendChild(allButton);
        this.filterElements.variable = this.createSelectButton(
            'variable',
            Entry.variableEnable
        );
        selectTrView.appendChild(this.filterElements.variable);
        this.filterElements.message = this.createSelectButton(
            'message',
            Entry.messageEnable
        );
        selectTrView.appendChild(this.filterElements.message);
        var selectTrView = Entry.createElement('tr');
        this.filterElements.list = this.createSelectButton(
            'list',
            Entry.listEnable
        );
        selectTrView.appendChild(this.filterElements.list);
        this.filterElements.func = this.createSelectButton(
            'func',
            Entry.functionEnable
        );
        selectTrView.appendChild(this.filterElements.func);
        selectView.appendChild(selectTrView);

        var listView = Entry.createElement('ul');
        listView.addClass('entryVariableListWorkspace');
        this.view_.appendChild(listView);
        this.listView_ = listView;

        var variableAddButton = Entry.createElement('li');
        variableAddButton.addClass(
            'entryVariableAddWorkspace entryVariableListElementWorkspace'
        );
        variableAddButton.innerHTML = '+ ' + Lang.Workspace.variable_add;
        var thisPointer = this;
        this.variableAddButton_ = variableAddButton;

        variableAddButton.bindOnClick(function(e) {
            Entry.do('variableContainerClickVariableAddButton');
        });

        this.generateVariableAddView();
        this.generateListAddView();
        this.generateVariableSplitterView();
        this.generateVariableSettingView();
        this.generateListSettingView();

        var messageAddButton = Entry.createElement('li');
        messageAddButton.addClass(
            'entryVariableAddWorkspace entryVariableListElementWorkspace'
        );
        messageAddButton.innerHTML = '+ ' + Lang.Workspace.message_create;
        this.messageAddButton_ = messageAddButton;
        messageAddButton.bindOnClick(function(e) {
            let name = Entry.getOrderedName(Lang.Workspace.message + ' ', that.messages_, 'name');
            that.addMessage({
                name: name,
            });
        });

        var listAddButton = Entry.createElement('li');
        listAddButton.addClass(
            'entryVariableAddWorkspace entryVariableListElementWorkspace'
        );
        listAddButton.innerHTML = '+ ' + Lang.Workspace.list_create;
        this.listAddButton_ = listAddButton;
        listAddButton.bindOnClick(function(e) {
            var panel = thisPointer.listAddPanel;
            var value = panel.view.name.value.trim();
            if (panel.isOpen) {
                if (!value || value.length === 0) {
                    panel.view.addClass('entryRemove');
                    panel.isOpen = false;
                } else that.addList();
            } else {
                panel.view.removeClass('entryRemove');
                panel.view.name.focus();
                panel.isOpen = true;
            }
        });

        var functionAddButton = Entry.createElement('li');
        functionAddButton.addClass(
            'entryVariableAddWorkspace entryVariableListElementWorkspace'
        );
        functionAddButton.innerHTML = '+ ' + Lang.Workspace.function_add;
        //functionAddButton.innerHTML = '+ ' + Lang.Msgs.to_be_continue;
        this.functionAddButton_ = functionAddButton;
        functionAddButton.bindOnClick(function(e) {
            var playground = Entry.playground;
            var blockMenu = that._getBlockMenu();
            playground.changeViewMode('code');
            if (blockMenu.lastSelector != 'func') blockMenu.selectMenu('func');
            that.createFunction();
        });

        return view;
    };

    /**
     * @param {String} type
     * @param {?Boolean} isEnable
     */
    p.createSelectButton = function(type, isEnable) {
        var that = this;
        if (isEnable === undefined) isEnable = true;
        var view = Entry.createElement('td');
        view.addClass('entryVariableSelectButtonWorkspace', type);
        view.innerHTML = Lang.Workspace[type];
        view.bindOnClick(function(e) {
            Entry.do('variableContainerSelectFilter', type, this.viewMode_);
        });

        if (isEnable === false) {
            view.addClass('disable');
            view.disabled = true;
        }

        this._filterTabs[type] = view;
        return view;
    };

    /**
     * @param {String} type
     */
    p.selectFilter = function(type) {
        var elements = this.view_.getElementsByTagName('td');
        for (var i = 0; i < elements.length; i++) {
            elements[i].removeClass('selected');
            if (elements[i].hasClass(type)) {
                elements[i].addClass('selected');
            }
        }
        this.viewMode_ = type;
        this.select();
        this.updateList();
    };

    p.updateVariableAddView = function(type) {
        type = type ? type : 'variable';
        var panel =
            type == 'variable' ? this.variableAddPanel : this.listAddPanel;
        var info = panel.info;
        var view = panel.view;
        panel.view.addClass('entryRemove');
        view.cloudCheck.removeClass('entryVariableAddChecked');
        view.localCheck.removeClass('entryVariableAddChecked');
        view.globalCheck.removeClass('entryVariableAddChecked');
        view.cloudWrapper.removeClass(
            'entryVariableAddSpaceUnCheckedWorkspace'
        );
        if (info.isCloud) view.cloudCheck.addClass('entryVariableAddChecked');
        if (panel.isOpen) {
            view.removeClass('entryRemove');
            view.name.focus();
        }
        if (info.object) {
            view.localCheck.addClass('entryVariableAddChecked');
            view.cloudWrapper.addClass(
                'entryVariableAddSpaceUnCheckedWorkspace'
            );
        } else view.globalCheck.addClass('entryVariableAddChecked');
    };

    /**
     * @param {object|Entry.Variable} object
     */
    p.select = function(object) {
        object = this.selected == object ? null : object;
        if (this.selected) {
            this.selected.listElement.removeClass('selected');
            if (this.selected.callerListElement) {
                this.listView_.removeChild(this.selected.callerListElement);
                delete this.selected.callerListElement;
            }
            this.selected = null;
        }
        if (!object) return;
        object.listElement.addClass('selected');
        this.selected = object;
        if (object instanceof Entry.Variable) {
            this.renderVariableReference(object);
            if (object.object_)
                Entry.container.selectObject(object.object_, true);
        } else if (object instanceof Entry.Func) {
            this.renderFunctionReference(object);
        } else {
            this.renderMessageReference(object);
        }
    };

    p.getMessage = function(messageId) {
        return this.messages_.filter(function(m) {
            return m.id === messageId;
        })[0];
    };

    /**
     * @param {object} message
     */
    p.renderMessageReference = function(message) {
        var that = this;
        var refs = this._messageRefs;
        var messageId = message.id;
        var callers = [];

        for (var i = 0; i < refs.length; i++) {
            var params = refs[i].block.params;
            var index = params.indexOf(messageId);
            if (index > -1) callers.push(refs[i]);
        }

        var listView = Entry.createElement('ul');
        listView.addClass('entryVariableListCallerListWorkspace');

        for (var i in callers) {
            var caller = callers[i];
            var element = Entry.createElement('li');
            element.addClass('entryVariableListCallerWorkspace');
            !caller.object.thumbnailView_ && caller.object.generateView();
            element.appendChild(caller.object.thumbnailView_.cloneNode());
            var nameElement = Entry.createElement('div');
            nameElement.addClass('entryVariableListCallerNameWorkspace');
            nameElement.innerHTML =
                caller.object.name +
                ' : ' +
                Lang.Blocks['START_' + caller.block.type];
            element.appendChild(nameElement);
            element.caller = caller;
            element.message = message;
            element.bindOnClick(function(e) {
                if (Entry.playground.object != this.caller.object) {
                    Entry.container.selectObject();
                    Entry.container.selectObject(this.caller.object.id, true);
                    that.select(null);
                    that.select(this.message);
                }

                var caller = this.caller;
                Entry.playground.toggleOnVariableView();
                Entry.playground.changeViewMode('variable');
            });
            listView.appendChild(element);
        }
        if (callers.length === 0) {
            var element = Entry.createElement('li');
            element.addClass(
                'entryVariableListCallerWorkspace entryVariableListCallerNoneWorkspace'
            );
            element.innerHTML = Lang.Workspace.no_use;
            listView.appendChild(element);
        }
        message.callerListElement = listView;
        this.listView_.insertBefore(listView, message.listElement);
        this.listView_.insertBefore(message.listElement, listView);
    };

    /**
     * @param {object} variable
     */
    p.renderVariableReference = function(variable) {
        var that = this;
        var refs = this._variableRefs;
        var variableId = variable.id_;
        var callers = [];

        for (var i = 0; i < refs.length; i++) {
            var params = refs[i].block.params;
            var index = params.indexOf(variableId);
            if (index > -1) callers.push(refs[i]);
        }

        var listView = Entry.createElement('ul');
        listView.addClass('entryVariableListCallerListWorkspace');

        for (var i in callers) {
            var caller = callers[i];
            var element = Entry.createElement('li');
            element.addClass('entryVariableListCallerWorkspace');
            !caller.object.thumbnailView_ && caller.object.generateView();
            element.appendChild(caller.object.thumbnailView_.cloneNode());
            var nameElement = Entry.createElement('div');
            nameElement.addClass('entryVariableListCallerNameWorkspace');
            nameElement.innerHTML =
                caller.object.name +
                ' : ' +
                Lang.Blocks['VARIABLE_' + caller.block.type];
            element.appendChild(nameElement);
            element.caller = caller;
            element.variable = variable;
            element.bindOnClick(function(e) {
                if (Entry.playground.object != this.caller.object) {
                    Entry.container.selectObject();
                    Entry.container.selectObject(this.caller.object.id, true);
                    that.select(null);
                }
                var caller = this.caller;
                var block = caller.funcBlock || caller.block;
                var blockView = block.view;
                blockView && blockView.getBoard().activateBlock(block);
                Entry.playground.toggleOnVariableView();
                Entry.playground.changeViewMode('variable');
            });
            listView.appendChild(element);
        }

        if (callers.length === 0) {
            var element = Entry.createElement('li');
            element.addClass(
                'entryVariableListCallerWorkspace entryVariableListCallerNoneWorkspace'
            );
            element.innerHTML = Lang.Workspace.no_use;
            listView.appendChild(element);
        }
        variable.callerListElement = listView;
        this.listView_.insertBefore(listView, variable.listElement);
        this.listView_.insertBefore(variable.listElement, listView);
    };

    /**
     * @param {object} variable
     */
    p.renderFunctionReference = function(func) {
        var that = this;
        var refs = this._functionRefs;
        var funcId = func.id_;
        var callers = [];

        for (var i = 0; i < refs.length; i++) callers.push(refs[i]);

        var listView = Entry.createElement('ul');
        listView.addClass('entryVariableListCallerListWorkspace');

        for (var i in callers) {
            var caller = callers[i];
            var element = Entry.createElement('li');
            element.addClass('entryVariableListCallerWorkspace');
            !caller.object.thumbnailView_ && caller.object.generateView();
            element.appendChild(caller.object.thumbnailView_.cloneNode());
            var nameElement = Entry.createElement('div');
            nameElement.addClass('entryVariableListCallerNameWorkspace');
            nameElement.innerHTML = caller.object.name;
            element.appendChild(nameElement);
            element.caller = caller;
            element.bindOnClick(function(e) {
                if (Entry.playground.object != this.caller.object) {
                    Entry.container.selectObject();
                    Entry.container.selectObject(this.caller.object.id, true);
                    that.select(null);
                    that.select(func);
                }
                Entry.playground.toggleOnVariableView();
                var block = this.caller.block;
                var blockView = block.view;
                blockView && blockView.getBoard().activateBlock(block);
                Entry.playground.changeViewMode('variable');
            });
            listView.appendChild(element);
        }
        if (callers.length === 0) {
            var element = Entry.createElement('li');
            element.addClass(
                'entryVariableListCallerWorkspace entryVariableListCallerNoneWorkspace'
            );
            element.innerHTML = Lang.Workspace.no_use;
            listView.appendChild(element);
        }
        func.callerListElement = listView;
        this.listView_.insertBefore(listView, func.listElement);
        this.listView_.insertBefore(func.listElement, listView);
    };

    /**
     * update list view
     */
    p.updateList = function() {
        var playground = Entry.playground;
        if (
            !this.listView_ ||
            (playground &&
                (playground.getViewMode() !== 'variable' &&
                    playground.getViewMode() !== 'code'))
        )
            return;

        this.variableSettingView.addClass('entryRemove');
        this.listSettingView.addClass('entryRemove');

        var isPythonMode = this._isPythonMode();
        if (isPythonMode)
            this.listView_.addClass('entryVariableContainerTextMode');
        else this.listView_.removeClass('entryVariableContainerTextMode');

        while (this.listView_.firstChild)
            this.listView_.removeChild(this.listView_.lastChild);

        var viewMode = this.viewMode_;
        var elementList = [];
        if (viewMode == 'all' || viewMode == 'message') {
            if (viewMode == 'message') {
                this.listView_.appendChild(this.messageAddButton_);
            }
            for (var i in this.messages_) {
                var message = this.messages_[i];
                elementList.push(message);
                !message.listElement && this.createMessageView(message);
                var view = message.listElement;

                this.listView_.appendChild(view);
                if (message.callerListElement)
                    this.listView_.appendChild(message.callerListElement);
            }
        }

        if (viewMode == 'all' || viewMode == 'variable') {
            if (viewMode == 'variable') {
                var info = this.variableAddPanel.info;
                if (info.object && !Entry.playground.object) info.object = null;

                this.listView_.appendChild(this.variableAddButton_);
                this.listView_.appendChild(this.variableAddPanel.view);

                this.variableSplitters.top.innerHTML =
                    Lang.Workspace.Variable_used_at_all_objects;
                this.listView_.appendChild(this.variableSplitters.top);
                for (var i in this.variables_) {
                    var variable = this.variables_[i];
                    if (variable.object_) continue;
                    elementList.push(variable);
                    !variable.listElement && this.createVariableView(variable);
                    var view = variable.listElement;
                    this.listView_.appendChild(view);
                    if (variable.callerListElement)
                        this.listView_.appendChild(variable.callerListElement);
                }

                this.variableSplitters.bottom.innerHTML =
                    Lang.Workspace.Variable_used_at_special_object;
                this.listView_.appendChild(this.variableSplitters.bottom);
                for (var i in this.variables_) {
                    var variable = this.variables_[i];
                    if (!variable.object_) continue;
                    elementList.push(variable);
                    !variable.listElement && this.createVariableView(variable);
                    var view = variable.listElement;
                    this.listView_.appendChild(view);
                    if (variable.callerListElement)
                        this.listView_.appendChild(variable.callerListElement);
                }
                this.updateVariableAddView('variable');
            } else {
                for (var i in this.variables_) {
                    var variable = this.variables_[i];
                    elementList.push(variable);
                    !variable.listElement && this.createVariableView(variable);
                    var view = variable.listElement;
                    this.listView_.appendChild(view);
                    if (variable.callerListElement)
                        this.listView_.appendChild(variable.callerListElement);
                }
            }
        }

        if (viewMode == 'all' || viewMode == 'list') {
            if (viewMode == 'list') {
                var info = this.listAddPanel.info;
                if (info.object && !Entry.playground.object) info.object = null;
                this.listView_.appendChild(this.listAddButton_);
                this.listView_.appendChild(this.listAddPanel.view);
                this.variableSplitters.top.innerHTML =
                    Lang.Workspace.List_used_all_objects;
                this.listView_.appendChild(this.variableSplitters.top);

                this.updateVariableAddView('list');
                for (var i in this.lists_) {
                    var list = this.lists_[i];
                    if (list.object_) continue;
                    elementList.push(list);
                    !list.listElement && this.createListView(list);
                    var view = list.listElement;
                    this.listView_.appendChild(view);
                    if (list.callerListElement)
                        this.listView_.appendChild(list.callerListElement);
                }
                this.variableSplitters.bottom.innerHTML =
                    Lang.Workspace.list_used_specific_objects;
                this.listView_.appendChild(this.variableSplitters.bottom);
                for (var i in this.lists_) {
                    var list = this.lists_[i];
                    if (!list.object_) continue;
                    elementList.push(list);
                    !list.listElement && this.createListView(list);
                    var view = list.listElement;
                    this.listView_.appendChild(view);
                    if (list.callerListElement)
                        this.listView_.appendChild(list.callerListElement);
                }
                this.updateVariableAddView('variable');
            } else {
                for (var i in this.lists_) {
                    var list = this.lists_[i];
                    elementList.push(list);
                    !list.listElement && this.createListView(list);
                    var view = list.listElement;
                    this.listView_.appendChild(view);
                    if (list.callerListElement)
                        this.listView_.appendChild(list.callerListElement);
                }
            }
        }

        if (viewMode == 'all' || viewMode == 'func') {
            if (viewMode == 'func') {
                var mode = Entry.Workspace.MODE_BOARD;
                if (Entry.getMainWS()) mode = Entry.getMainWS().getMode();

                if (
                    mode === Entry.Workspace.MODE_OVERLAYBOARD ||
                    isPythonMode
                ) {
                    this.functionAddButton_.addClass('disable');
                } else this.functionAddButton_.removeClass('disable');

                this.listView_.appendChild(this.functionAddButton_);
            }
            for (var i in this.functions_) {
                var func = this.functions_[i];
                elementList.push(func);
                !func.funcElement && this.createFunctionView(func);
                var view = func.listElement;
                this.listView_.appendChild(view);
                if (func.callerListElement)
                    this.listView_.appendChild(func.callerListElement);
            }
        }

        //select the first element(view) if exist
        this.listView_.appendChild(this.variableSettingView);
        this.listView_.appendChild(this.listSettingView);
        //if (elementList.length !== 0)
        //this.select(elementList[0]);
        elementList = null;
    };

    /**
     * @param {!Array.<message model>} objectModels
     */
    p.setMessages = function(messages) {
        for (var i in messages) {
            var message = messages[i];
            if (!message.id) {
                message.id = Entry.generateHash();
            }
            this.messages_.push(message);
        }
        Entry.playground.reloadPlayground();
    };

    /**
     * @param {!Array.<message model>} objectModels
     */
    p.appendMessages = function(messages) {
        for (let i in messages) {
            const message = messages[i];
            if (!message.id) {
                message.id = Entry.generateHash();
            } else if (this.messages_.some((item) => item.id === message.id)) {
                continue;
            }
            let name = message.name;
            name = this.checkAllVariableName(name, 'messages_', 'name')
                ? Entry.getOrderedName(name, this.messages_, 'name')
                : name;
            message.name = name;
            this.messages_.push(message);
        }
        Entry.playground.reloadPlayground();
    };

    /**
     * @param {!Array.<variable model>} variables
     */
    p.setVariables = function(variables) {
        var that = this;
        for (var i in variables) {
            var variable = new Entry.Variable(variables[i]);
            var type = variable.getType();
            if (type == 'variable' || type == 'slide') {
                variable.generateView(this.variables_.length);
                this.variables_.push(variable);
            } else if (type == 'list') {
                variable.generateView(this.lists_.length);
                this.lists_.push(variable);
            } else if (type == 'timer') that.generateTimer(variable);
            else if (type == 'answer') that.generateAnswer(variable);
        }
        if (Entry.isEmpty(Entry.engine.projectTimer))
            Entry.variableContainer.generateTimer();
        if (Entry.isEmpty(Entry.container.inputValue))
            Entry.variableContainer.generateAnswer();
        Entry.playground.reloadPlayground();
    };

    p.generateVariable = function(variable, data, key) {
        let name = variable.name_;
        variable.generateView(data.length);
        name = this.checkAllVariableName(name, key)
            ? Entry.getOrderedName(name, data, 'name_')
            : name;
        variable.name_ = name;
    };

    /**
     * @param {!Array.<variable model>} variables
     */
    p.appendVariables = function(variables) {
        for (var i in variables) {
            var variable = new Entry.Variable(variables[i]);
            if (!variable.id_) {
                variable.id_ = Entry.generateHash();
            }
            let name = variable.name_;
            var type = variable.getType();
            if (type == 'variable' || type == 'slide') {
                if (this.variables_.some((item) => item.id_ === variable.id_)) {
                    continue;
                }
                this.generateVariable(variable, this.variables_, 'variables_');
                this.variables_.push(variable);
            } else if (type == 'list') {
                if (this.lists_.some((item) => item.id_ === variable.id_)) {
                    continue;
                }
                this.generateVariable(variable, this.lists_, 'lists_');
                this.lists_.push(variable);
            }
        }
        if (Entry.isEmpty(Entry.engine.projectTimer)) {
            Entry.variableContainer.generateTimer();
        }
        if (Entry.isEmpty(Entry.container.inputValue)) {
            Entry.variableContainer.generateAnswer();
        }
        Entry.playground.reloadPlayground();
    };

    /**
     * @param {!Array.<function model>} variables
     */
    p.setFunctions = function(functions) {
        for (var i in functions) {
            var func = new Entry.Func(functions[i]);
            func.generateBlock();
            this.functions_[func.id] = func;
        }
    };

    /**
     * @param {!Array.<function model>} variables
     */
    p.appendFunctions = function(functions) {
        for (var i in functions) {
            var func = functions[i];
            if (!func.id) {
                func.id = Entry.generateHash();
            } else if (`${func.id}` in this.functions_) {
                continue;
            }
            var parseFunc = new Entry.Func(func);
            this.changeFunctionName(parseFunc);
            parseFunc.generateBlock();
            this.functions_[parseFunc.id] = parseFunc;
        }
    };

    p.changeFunctionName = function(func) {
        const params = func.content.getEventMap('funcDef')[0].params[0].data
            .params;
        const funcParamInfo = this.getFunctionParamInfo(params);
        const funcParamName = this.getFunctionParamName(funcParamInfo);
        const funcKeys = Object.keys(this.functions_);
        const funcsParamNames = funcKeys.map((key) => {
            const func = this.functions_[key];
            const params = func.content.getEventMap('funcDef')[0].params[0].data
                .params;
            const info = this.getFunctionParamInfo(params);
            return {
                name: this.getFunctionParamName(info),
            };
        });

        const isDuplecate = funcsParamNames.some(({ name }) => {
            return funcParamName === name;
        });

        if (isDuplecate) {
            const orderedNumber = Entry.getOrderedNameNumber(
                funcParamName,
                funcsParamNames,
                'name'
            );
            for (let i = funcParamInfo.length - 1; ; i--) {
                let info = funcParamInfo[i];
                if (info.type === 'string') {
                    info.parent[0] += orderedNumber;
                    break;
                }
            }

            Entry.Func.generateWsBlock(func);
        }
    };

    p.getFunctionParamName = function(info) {
        let name = '';
        info.forEach((item) => {
            name += item.name;
        });
        return name;
    };

    p.getFunctionParamInfo = function(parentParams) {
        let info = [];
        parentParams.forEach((param, index) => {
            if (typeof param === 'string') {
                info[index] = {
                    name: param,
                    type: 'string',
                    parent: parentParams,
                };
                // name += param;
            } else if (param instanceof Entry.Block) {
                const { data = {} } = param;
                const { params = [], type } = data;

                if (
                    type.indexOf('stringParam') === 0 ||
                    type.indexOf('booleanParam') === 0
                ) {
                    const name = type.slice(0, -5);
                    info[index] = {
                        name,
                        type: name,
                        parent: parentParams,
                    };
                } else {
                    const childParamInfo = this.getFunctionParamInfo(params);
                    const keys = Object.keys(childParamInfo);
                    childParamInfo.forEach((childInfo, childIndex) => {
                        info[childIndex + index] = childInfo;
                    });
                }
            }
        });
        return info;
    };

    /**
     * get func
     * @return {Entry.Func}
     */
    p.getFunction = function(funcId) {
        return this.functions_[funcId];
    };

    /**
     * get variable on canvas
     * @return {Entry.Variable}
     */
    p.getVariable = function(variableId, entity) {
        var keyName = 'id_';
        var variable = Entry.findObjsByKey(
            this.variables_,
            keyName,
            variableId
        )[0];
        if (entity && entity.isClone && variable.object_)
            variable = Entry.findObjsByKey(
                entity.variables,
                keyName,
                variableId
            )[0];

        return variable;
    };

    p.getVariableByName = function(variableName, isSelf, currentObjectId) {
        if (!currentObjectId && Entry.playground && Entry.playground.object)
            currentObjectId = Entry.playground.object.id;

        for (var i = 0; i < this.variables_.length; i++) {
            var v = this.variables_[i];
            if (isSelf === true) {
                if (!v.object_ || v.object_ !== currentObjectId) continue;
            } else if (isSelf === false) {
                if (v.object_) continue;
            }

            if (v.getName() === variableName) return v;
        }
    };

    /**
     * get variable on canvas
     * @return {Entry.List}
     */
    p.getList = function(listId, entity) {
        var keyName = 'id_';
        var list = Entry.findObjsByKey(this.lists_, keyName, listId)[0];
        if (entity && entity.isClone && list.object_)
            list = Entry.findObjsByKey(entity.lists, keyName, listId)[0];

        return list;
    };

    /**
     * Create function
     */
    p.createFunction = function() {
        if (Entry.Func.isEdit) return;
        var func = new Entry.Func();
        Entry.Func.edit(func);
        //this.saveFunction(func);
    };

    /**
     * Add variable
     * @param {Entry.Variable} variable
     * @return {boolean} return true when success
     */
    p.addFunction = function(variable) {};

    /**
     * Remove variable
     * @param {Entry.Variable} variable
     */
    p.removeFunction = function(func) {
        var functionId = func.id;
        var functions = this.functions_;
        functions[functionId].destroy();
        delete functions[functionId];
        var functionType = 'func_' + functionId;

        Entry.container.removeFuncBlocks(functionType);
        for (var id in functions)
            functions[id].content.removeBlocksByType(functionType);
        this.updateList();
    };

    p.checkListPosition = function(list, mouse) {
        var pos = {
            start_w: list.x_,
            area_w: list.x_ + list.width_,
            start_h: -list.y_,
            area_h: -list.y_ + -list.height_,
        };

        if (mouse.x > pos.start_w && mouse.x < pos.area_w) {
            if (mouse.y < pos.start_h && mouse.y > pos.area_h) {
                return true;
            }
        }
        return false;
    };

    p.getListById = function(mouseevt) {
        var lists = this.lists_;
        var returnList = [];
        if (lists.length > 0) {
            for (var i = 0; i < lists.length; i++) {
                if (this.checkListPosition(lists[i], mouseevt))
                    returnList.push(lists[i]);
            }
            return returnList;
        }
        return false;
    };

    p.getListByName = function(name, isSelf, currentObjectId) {
        var lists = this.lists_;
        if (!currentObjectId && Entry.playground && Entry.playground.object)
            currentObjectId = Entry.playground.object.id;

        for (var i = 0; i < lists.length; i++) {
            var l = lists[i];

            if (isSelf === true) {
                if (!l.object_ || l.object_ !== currentObjectId) continue;
            } else if (isSelf === false) {
                if (l.object_) continue;
            }

            if (l.getName() === name) return l;
        }
    };

    /**
     * @param {Entry.Variable} variable
     * @param {String} name
     */
    p.editFunction = function(variable, name) {};

    /**
     * Save variable
     * @param {Entry.Func} func
     */
    p.saveFunction = function(func) {
        /* add to function list when not exist */
        var ws = Entry.getMainWS();

        if (ws && ws.overlayModefrom == Entry.Workspace.MODE_VIMBOARD) {
            if (func && func.description) {
                var funcName = func.description.substring(
                    1,
                    func.description.length - 1
                );
                var alert_msg = Entry.TextCodingUtil.isNameIncludeSpace(
                    funcName,
                    'function'
                );
                if (alert_msg) {
                    entrylms.alert(alert_msg);
                    Entry.Func.cancelEdit();
                    return;
                }
            }
        }

        if (!this.functions_[func.id]) {
            this.functions_[func.id] = func;
            this.createFunctionView(func);
        }
        if (func.listElement)
            func.listElement.nameField.innerHTML = func.description;

        this.updateList();
    };

    /**
     * @param {Entry.Func} func
     */
    p.createFunctionView = function(func) {
        var that = this;
        if (!this.view_) return;
        var view = Entry.createElement('li');
        var className = '';
        className += 'entryVariableListElementWorkspace';
        className += ' entryFunctionElementWorkspace';
        className += ' function';
        view.addClass(className);
        view.bindOnClick(function(e) {
            e.stopPropagation();
            that.select(func);
        });

        var removeButton = Entry.createElement('button');
        removeButton.addClass('entryVariableListElementDeleteWorkspace');
        removeButton.bindOnClick(function(e) {
            e.stopPropagation();
            entrylms
                .confirm(Lang.Workspace.will_you_delete_function)
                .then(function(result) {
                    if (result === true) {
                        that.removeFunction(func);
                        that.selected = null;
                    }
                });
        });

        var editButton = Entry.createElement('button');
        editButton.addClass(
            'entryVariableListElementEditWorkspace notForTextMode'
        );
        var blockMenu = this._getBlockMenu();
        editButton.bindOnClick(function(e) {
            e.stopPropagation();
            var playground = Entry.playground;
            if (playground) {
                playground.changeViewMode('code');
                if (blockMenu.lastSelector != 'func')
                    blockMenu.selectMenu('func');
            }
            Entry.Func.edit(func);
        });

        var nameField = Entry.createElement('div');
        nameField.addClass('entryVariableFunctionElementNameWorkspace');
        nameField.innerHTML = func.description;
        view.nameField = nameField;
        view.appendChild(nameField);
        view.appendChild(editButton);
        view.appendChild(removeButton);
        func.listElement = view;
    };

    /**
     * Add variable
     * @param {Entry.Variable} variable
     * @return {boolean} return true when success
     */
    p.checkAllVariableName = function(name, variable) {
        var variable = this[variable];
        for (var i = 0; i < variable.length; i++) {
            if (variable[i].name_ == name) {
                return true;
            }
        }
        return false;
    };

    p.addVariable = function(variable) {
        if (Entry.isTextMode) {
            var panel = this.variableAddPanel;
            var variableName = panel.view.name.value;
            var alert_msg = Entry.TextCodingUtil.isNameIncludeSpace(
                variableName,
                'variable'
            );
            if (alert_msg) {
                entrylms.alert(alert_msg);
                this.variableAddPanel.view.addClass('entryRemove');
                this.resetVariableAddPanel('variable');
                return;
            }
        }

        var variableContainer = this;
        var panel = this.variableAddPanel;
        if (!variable) {
            var name = panel.view.name.value.trim();
            if (!name || name.length === 0) name = Lang.Workspace.variable;

            if (name.length > this._maxNameLength)
                name = this._truncName(name, 'variable');

            name = this.checkAllVariableName(name, 'variables_')
                ? Entry.getOrderedName(name, this.variables_, 'name_')
                : name;

            var info = panel.info;
            variable = {
                name: name,
                isCloud: info.isCloud,
                object: info.object,
                variableType: 'variable',
            };
        }
        if (panel.view) panel.view.addClass('entryRemove');
        this.resetVariableAddPanel('variable');
        if (!(variable instanceof Entry.Variable))
            variable = new Entry.Variable(variable);

        variable.generateView(this.variables_.length);
        this.createVariableView(variable);
        this.variables_.unshift(variable);
        if (Entry.playground && Entry.playground.blockMenu)
            Entry.playground.blockMenu.deleteRendered('variable');
        Entry.playground.reloadPlayground();
        if (panel.view) panel.view.name.value = '';
        this.updateList();
    };

    /**
     * Remove variable
     * @param {Entry.Variable} variable
     */
    p.removeVariable = function(variable) {
        if (!(variable instanceof Entry.Variable)) {
            variable = this.variables_.filter(function(v) {
                return variable.id === v.id_;
            })[0];
        }

        var index = this.variables_.indexOf(variable);
        var variableJSON = variable.toJSON();

        if (this.selected == variable) this.select(null);
        variable.remove();
        this.variables_.splice(index, 1);
        Entry.playground.reloadPlayground();
        this.updateList();
    };

    /**
     * @param {Entry.Variable} variable
     * @param {String} name
     */
    p.changeVariableName = function(variable, name) {
        if (variable.name_ == name) return;

        if (Entry.isTextMode) {
            var alert_msg = Entry.TextCodingUtil.isNameIncludeSpace(
                name,
                'variable'
            );
            if (alert_msg) {
                entrylms.alert(alert_msg);
                variable.listElement.nameField.value = variable.name_;
                return;
            }
        }

        var variables = this.variables_;
        var exist = Entry.isExist(name, 'name_', variables);

        if (exist) {
            variable.listElement.nameField.value = variable.name_;
            Entry.toast.alert(
                Lang.Workspace.variable_rename_failed,
                Lang.Workspace.variable_dup
            );
            return;
        } else if (name.length > 10) {
            variable.listElement.nameField.value = variable.name_;
            Entry.toast.alert(
                Lang.Workspace.variable_rename_failed,
                Lang.Workspace.variable_too_long
            );
            return;
        }
        variable.setName(name);
        Entry.playground.reloadPlayground();
        Entry.toast.success(
            Lang.Workspace.variable_rename,
            Lang.Workspace.variable_rename_ok
        );
    };

    /**
     * @param {Entry.Variable} list
     * @param {String} name
     */
    p.changeListName = function(list, name) {
        if (list.name_ == name) return;

        if (Entry.isTextMode) {
            var alert_msg = Entry.TextCodingUtil.isNameIncludeSpace(
                name,
                'list'
            );
            if (alert_msg) {
                entrylms.alert(alert_msg);
                list.listElement.nameField.value = list.name_;
                return;
            }
        }

        var lists = this.lists_;
        var exist = Entry.isExist(name, 'name_', lists);

        if (exist) {
            list.listElement.nameField.value = list.name_;
            Entry.toast.alert(
                Lang.Workspace.list_rename_failed,
                Lang.Workspace.list_dup
            );
            return;
        } else if (name.length > 10) {
            list.listElement.nameField.value = list.name_;
            Entry.toast.alert(
                Lang.Workspace.list_rename_failed,
                Lang.Workspace.list_too_long
            );
            return;
        }
        list.name_ = name;
        list.updateView();
        Entry.playground.reloadPlayground();
        Entry.toast.success(
            Lang.Workspace.list_rename,
            Lang.Workspace.list_rename_ok
        );
    };

    /**
     * Remove list
     * @param {Entry.Variable} list
     */
    p.removeList = function(list) {
        var index = this.lists_.indexOf(list);
        var listJSON = list.toJSON();
        if (Entry.stateManager)
            Entry.stateManager.addCommand(
                'remove list',
                this,
                this.addList,
                listJSON
            );
        if (this.selected == list) this.select(null);
        list.remove();
        this.lists_.splice(index, 1);
        Entry.playground.reloadPlayground();
        this.updateList();
        return new Entry.State(this, this.addList, listJSON);
    };

    /**
     * @param {Entry.Variable} variable
     */
    p.createVariableView = function(variable) {
        var that = this;
        var view = Entry.createElement('li');
        var wrapper = Entry.createElement('div');
        wrapper.addClass('entryVariableListElementWrapperWorkspace variable');
        view.appendChild(wrapper);
        var className = 'entryVariableListElementWorkspace';
        if (!variable.object_) {
            if (variable.isCloud_)
                className += ' entryVariableCloudElementWorkspace';
            else className += ' entryVariableGlobalElementWorkspace';
        } else className += ' entryVariableLocalElementWorkspace';

        view.addClass(className);
        view.bindOnClick(function(e) {
            that.select(variable);
        });
        var removeButton = Entry.createElement('button');
        removeButton.addClass(
            'entryVariableListElementDeleteWorkspace notForTextMode'
        );
        removeButton.bindOnClick(function(e) {
            e.stopPropagation();
            that.removeVariable(variable);
            that.selectedVariable = null;
            that.variableSettingView.addClass('entryRemove');
        });
        view.removeButton = removeButton;
        this._removeButton = removeButton;

        var editButton = Entry.createElement('button');
        editButton.addClass('entryVariableListElementEditWorkspace');
        editButton.bindOnClick(function(e) {
            e.stopPropagation();
            nameField.removeAttribute('disabled');
            editSaveButton.removeClass('entryRemove');
            this.addClass('entryRemove');
            that.updateSelectedVariable(variable);
            nameField.focus();
        });
        view.editButton = editButton;

        var editSaveButton = Entry.createElement('button');
        editSaveButton.addClass(
            'entryVariableListElementEditWorkspace entryRemove'
        );
        editSaveButton.bindOnClick(function(e) {
            e.stopPropagation();
            nameField.blur();
            nameField.setAttribute('disabled', 'disabled');
            editButton.removeClass('entryRemove');
            this.addClass('entryRemove');
            that.updateSelectedVariable(null, 'variable');
        });
        view.editSaveButton = editSaveButton;

        var nameField = Entry.createElement('input');
        nameField.addClass('entryVariableListElementNameWorkspace');
        nameField.setAttribute('disabled', 'disabled');
        nameField.value = variable.name_;
        nameField.bindOnClick(function(e) {
            e.stopPropagation();
        });
        nameField.onblur = function(e) {
            var value = this.value.trim();
            if (!value || value.length === 0) {
                Entry.toast.alert(
                    Lang.Msgs.warn,
                    Lang.Workspace.variable_can_not_space
                );
                this.value = variable.getName();
                return;
            }
            that.changeVariableName(variable, this.value);
        };
        nameField.onkeydown = function(e) {
            if (e.keyCode == 13) this.blur();
        };
        view.nameField = nameField;
        wrapper.appendChild(nameField);
        wrapper.appendChild(editButton);
        wrapper.appendChild(editSaveButton);
        wrapper.appendChild(removeButton);
        variable.listElement = view;
    };

    /**
     * Add event for block
     * @param {message model} message
     * @return {boolean} return true when success
     */
    p.addMessage = function(message) {
        if (!message.id) message.id = Entry.generateHash();
        if (Entry.stateManager)
            Entry.stateManager.addCommand(
                'add message',
                this,
                this.removeMessage,
                message
            );
        this.createMessageView(message);
        this.messages_.unshift(message);
        if (Entry.playground && Entry.playground.blockMenu)
            Entry.playground.blockMenu.deleteRendered('start');
        Entry.playground.reloadPlayground();
        this.updateList();
        message.listElement.nameField.focus();
        return new Entry.State(this, this.removeMessage, message);
    };

    /**
     * Add event
     * @param {message model} message
     */
    p.removeMessage = function(message) {
        if (this.selected == message) this.select(null);
        if (Entry.stateManager)
            Entry.stateManager.addCommand(
                'remove message',
                this,
                this.addMessage,
                message
            );
        var index = this.messages_.indexOf(message);
        this.messages_.splice(index, 1);
        this.updateList();
        Entry.playground.reloadPlayground();
        return new Entry.State(this, this.addMessage, message);
    };

    /**
     * @param {object} message
     * @param {String} name
     */
    p.changeMessageName = function(message, name) {
        if (message.name == name) return;

        var messages = this.messages_;
        var exist = Entry.isExist(name, 'name', messages);

        if (exist) {
            message.listElement.nameField.value = message.name;
            Entry.toast.alert(
                Lang.Workspace.message_rename_failed,
                Lang.Workspace.message_dup
            );
            return;
        } else if (name.length > 10) {
            message.listElement.nameField.value = message.name;
            Entry.toast.alert(
                Lang.Workspace.message_rename_failed,
                Lang.Workspace.message_too_long
            );
            return;
        }
        message.name = name;
        if (Entry.playground && Entry.playground.blockMenu)
            Entry.playground.blockMenu.deleteRendered('start');
        Entry.playground.reloadPlayground();
        Entry.toast.success(
            Lang.Workspace.message_rename,
            Lang.Workspace.message_rename_ok
        );
    };

    /**
     * @param {object} message
     */
    p.createMessageView = function(message) {
        var that = this;
        var view = Entry.createElement('li');
        view.addClass(
            'entryVariableListElementWorkspace entryMessageElementWorkspace'
        );
        view.bindOnClick(function(e) {
            that.select(message);
        });

        var removeButton = Entry.createElement('button');
        removeButton.addClass('entryVariableListElementDeleteWorkspace');
        removeButton.bindOnClick(function(e) {
            e.stopPropagation();
            that.removeMessage(message);
        });

        var editButton = Entry.createElement('button');
        editButton.addClass('entryVariableListElementEditWorkspace');
        editButton.bindOnClick(function(e) {
            e.stopPropagation();
            nameField.removeAttribute('disabled');
            nameField.focus();
            editSaveButton.removeClass('entryRemove');
            this.addClass('entryRemove');
        });

        var editSaveButton = Entry.createElement('button');
        editSaveButton.addClass(
            'entryVariableListElementEditWorkspace entryRemove'
        );
        editSaveButton.bindOnClick(function(e) {
            e.stopPropagation();
            nameField.blur();
            editButton.removeClass('entryRemove');
            this.addClass('entryRemove');
        });

        var nameField = Entry.createElement('input');
        nameField.addClass('entryVariableListElementNameWorkspace');
        nameField.value = message.name;
        nameField.bindOnClick(function(e) {
            e.stopPropagation();
        });
        nameField.onblur = function(e) {
            var value = this.value.trim();
            if (!value || value.length === 0) {
                Entry.toast.alert(Lang.Msgs.warn, Lang.Msgs.sign_can_not_space);
                this.value = message.name;
                return;
            }
            that.changeMessageName(message, this.value);
            editButton.removeClass('entryRemove');
            editSaveButton.addClass('entryRemove');
            nameField.setAttribute('disabled', 'disabled');
        };
        nameField.onkeydown = function(e) {
            if (e.keyCode == 13) this.blur();
        };
        view.nameField = nameField;
        view.appendChild(nameField);
        view.appendChild(editButton);
        view.appendChild(editSaveButton);
        view.appendChild(removeButton);
        message.listElement = view;
    };

    /**
     * Add list for block
     * @param {list model} list
     * @return {boolean} return true when success
     */
    p.addList = function(list) {
        if (Entry.isTextMode) {
            var panel = this.listAddPanel;
            var listName = panel.view.name.value;
            var alert_msg = Entry.TextCodingUtil.isNameIncludeSpace(
                listName,
                'list'
            );
            if (alert_msg) {
                entrylms.alert(alert_msg);
                this.listAddPanel.view.addClass('entryRemove');
                this.resetVariableAddPanel('list');
                return;
            }
        }

        if (!list) {
            var variableContainer = this;
            var panel = this.listAddPanel;
            var name = panel.view.name.value.trim();
            if (!name || name.length === 0) name = Lang.Workspace.list;

            var info = panel.info;

            if (name.length > this._maxNameLength)
                name = this._truncName(name, 'list');

            name = this.checkAllVariableName(name, 'lists_')
                ? Entry.getOrderedName(name, this.lists_, 'name_')
                : name;

            list = {
                name: name,
                isCloud: info.isCloud,
                object: info.object,
                variableType: 'list',
            };
            panel.view.addClass('entryRemove');
            this.resetVariableAddPanel('list');
        }

        var list = new Entry.Variable(list);
        if (Entry.stateManager)
            Entry.stateManager.addCommand(
                'add list',
                this,
                this.removeList,
                list
            );
        list.generateView(this.lists_.length);
        this.createListView(list);
        this.lists_.unshift(list);
        if (Entry.playground && Entry.playground.blockMenu)
            Entry.playground.blockMenu.deleteRendered('variable');
        Entry.playground.reloadPlayground();

        this.updateList();
        return new Entry.State(this, this.removelist, list);
    };

    /**
     * @param {Entry.Variable} list
     */
    p.createListView = function(list) {
        var that = this;
        var view = Entry.createElement('li');
        var wrapper = Entry.createElement('div');
        wrapper.addClass('entryVariableListElementWrapperWorkspace list');
        view.appendChild(wrapper);
        view.addClass('entryVariableListElementWorkspace');
        if (!list.object_) {
            if (list.isCloud_) view.addClass('entryListCloudElementWorkspace');
            else view.addClass('entryListGlobalElementWorkspace');
        } else view.addClass('entryListLocalElementWorkspace');

        view.bindOnClick(function(e) {
            that.select(list);
        });

        var removeButton = Entry.createElement('button');
        removeButton.addClass(
            'entryVariableListElementDeleteWorkspace notForTextMode'
        );
        removeButton.bindOnClick(function(e) {
            e.stopPropagation();
            that.removeList(list);
            that.selectedList = null;
            that.listSettingView.addClass('entryRemove');
        });

        var editButton = Entry.createElement('button');
        editButton.addClass('entryVariableListElementEditWorkspace');
        editButton.bindOnClick(function(e) {
            e.stopPropagation();
            nameField.removeAttribute('disabled');
            editSaveButton.removeClass('entryRemove');
            this.addClass('entryRemove');
            that.updateSelectedVariable(list);
            nameField.focus();
        });
        view.editButton = editButton;

        var editSaveButton = Entry.createElement('button');
        editSaveButton.addClass(
            'entryVariableListElementEditWorkspace entryRemove'
        );
        editSaveButton.bindOnClick(function(e) {
            e.stopPropagation();
            nameField.blur();
            nameField.setAttribute('disabled', 'disabled');
            editButton.removeClass('entryRemove');
            this.addClass('entryRemove');
            that.select(list);
            that.updateSelectedVariable(null, 'list');
        });
        view.editSaveButton = editSaveButton;

        var nameField = Entry.createElement('input');
        nameField.setAttribute('disabled', 'disabled');
        nameField.addClass('entryVariableListElementNameWorkspace');
        nameField.value = list.name_;
        nameField.bindOnClick(function(e) {
            e.stopPropagation();
        });
        nameField.onblur = function(e) {
            var value = this.value.trim();
            if (!value || value.length === 0) {
                Entry.toast.alert(Lang.Msgs.warn, Lang.Msgs.list_can_not_space);
                this.value = list.getName();
                return;
            }
            that.changeListName(list, this.value);
        };
        nameField.onkeydown = function(e) {
            if (e.keyCode == 13) this.blur();
        };
        view.nameField = nameField;
        wrapper.appendChild(nameField);
        wrapper.appendChild(editButton);
        wrapper.appendChild(editSaveButton);
        wrapper.appendChild(removeButton);
        list.listElement = view;
    };

    /**
     * Apply map function to variables. But this not replace object with returned one.
     * So giving map function don't have to return object.
     * And this support another arguments.
     * @param {!function} mapFunction
     * @param {} param
     */
    p.mapVariable = function(mapFunction, param) {
        var length = this.variables_.length;
        for (var i = 0; i < length; i++) {
            var variable = this.variables_[i];
            mapFunction(variable, param);
        }
    };

    /**
     * @param {!function} mapFunction
     * @param {} param
     */
    p.mapList = function(mapFunction, param) {
        var length = this.lists_.length;
        for (var i = 0; i < length; i++) {
            var list = this.lists_[i];
            mapFunction(list, param);
        }
    };

    /**
     * convert this variable's data to JSON.
     * @return {JSON}
     */
    p.getVariableJSON = function() {
        var json = [];
        for (var i = 0; i < this.variables_.length; i++) {
            var variable = this.variables_[i];
            json.push(variable.toJSON());
        }
        for (var i = 0; i < this.lists_.length; i++) {
            var list = this.lists_[i];
            json.push(list.toJSON());
        }

        if (Entry.engine.projectTimer)
            json.push(Entry.engine.projectTimer.toJSON());

        var answer = Entry.container.inputValue;
        if (!Entry.isEmpty(answer)) json.push(answer.toJSON());
        return json;
    };

    /**
     * convert this message's data to JSON.
     * @return {JSON}
     */
    p.getMessageJSON = function() {
        var json = [];
        for (var i = 0; i < this.messages_.length; i++) {
            var message = {
                id: this.messages_[i].id,
                name: this.messages_[i].name,
            };
            json.push(message);
        }
        return json;
    };

    /**
     * convert this function's data to JSON.
     * @return {JSON}
     */
    p.getFunctionJSON = function() {
        var json = [];
        for (var i in this.functions_) {
            var func = this.functions_[i];
            var funcJSON = {
                id: func.id,
                content: JSON.stringify(func.content.toJSON()),
            };
            json.push(funcJSON);
        }
        return json;
    };

    p.resetVariableAddPanel = function(type) {
        type = type || 'variable';
        var panel =
            type == 'variable' ? this.variableAddPanel : this.listAddPanel;
        if (!panel.view) return;
        var info = panel.info;
        (info.isCloud = false), (info.object = null);
        panel.view.name.value = '';
        panel.isOpen = false;
        this.updateVariableAddView(type);
    };

    p.generateVariableAddView = function() {
        var that = this;
        var variableAddSpace = Entry.createElement('li');
        this.variableAddPanel.view = variableAddSpace;
        this.variableAddPanel.isOpen = false;
        variableAddSpace.addClass('entryVariableAddSpaceWorkspace entryRemove');

        var addSpaceNameWrapper = Entry.createElement('div');
        addSpaceNameWrapper.addClass(
            'entryVariableAddSpaceNameWrapperWorkspace'
        );
        variableAddSpace.appendChild(addSpaceNameWrapper);

        var addSpaceInput = Entry.createElement('input');
        addSpaceInput.addClass('entryVariableAddSpaceInputWorkspace');
        addSpaceInput.setAttribute(
            'placeholder',
            Lang.Workspace.Variable_placeholder_name
        );
        addSpaceInput.variableContainer = this;
        addSpaceInput.onkeypress = function(e) {
            if (e.keyCode !== 13) return;
            if (this.enterKeyDisabled) this.blur();
            else that._addVariable();
        };

        addSpaceInput.onfocus = function(e) {
            this.blurred = false;
        };

        addSpaceInput.onblur = function(e) {
            if (this.value === '' || this.blurred) return;
            Entry.do(
                'variableAddSetName',
                $('.entryVariableAddSpaceInputWorkspace').val()
            );
            this.blurred = true;
        };

        this.variableAddPanel.view.name = addSpaceInput;
        addSpaceNameWrapper.appendChild(addSpaceInput);

        var addSpaceGlobalWrapper = Entry.createElement('div');
        addSpaceGlobalWrapper.addClass(
            'entryVariableAddSpaceGlobalWrapperWorkspace'
        );
        addSpaceGlobalWrapper.bindOnClick(function(e) {
            var info = that.variableAddPanel.info;
            info.object = null;
            that.updateVariableAddView('variable');
        });
        variableAddSpace.appendChild(addSpaceGlobalWrapper);

        var addVariableGlobalSpan = Entry.createElement('span');
        addVariableGlobalSpan.innerHTML =
            Lang.Workspace.Variable_use_all_objects;
        addSpaceGlobalWrapper.appendChild(addVariableGlobalSpan);

        var addVariableGlobalCheck = Entry.createElement('span');
        addVariableGlobalCheck.addClass('entryVariableAddSpaceCheckWorkspace');
        this.variableAddPanel.view.globalCheck = addVariableGlobalCheck;
        if (!this.variableAddPanel.info.object)
            addVariableGlobalCheck.addClass('entryVariableAddChecked');
        addSpaceGlobalWrapper.appendChild(addVariableGlobalCheck);

        var addSpaceLocalWrapper = Entry.createElement('div');
        addSpaceLocalWrapper.addClass(
            'entryVariableAddSpaceLocalWrapperWorkspace'
        );
        addSpaceLocalWrapper.bindOnClick(function(e) {
            if (!Entry.playground.object) return;
            var info = that.variableAddPanel.info;
            info.object = Entry.playground.object.id;
            info.isCloud = false;
            that.updateVariableAddView('variable');
        });
        variableAddSpace.appendChild(addSpaceLocalWrapper);
        var addVariableLocalSpan = Entry.createElement('span');
        addVariableLocalSpan.innerHTML =
            Lang.Workspace.Variable_use_this_object;
        addSpaceLocalWrapper.appendChild(addVariableLocalSpan);

        var addVariableLocalCheck = Entry.createElement('span');
        addVariableLocalCheck.addClass('entryVariableAddSpaceCheckWorkspace');
        this.variableAddPanel.view.localCheck = addVariableLocalCheck;
        if (this.variableAddPanel.info.object)
            addVariableLocalCheck.addClass('entryVariableAddChecked');
        addSpaceLocalWrapper.appendChild(addVariableLocalCheck);

        var addSpaceCloudWrapper = Entry.createElement('div');
        variableAddSpace.cloudWrapper = addSpaceCloudWrapper;
        addSpaceCloudWrapper.addClass(
            'entryVariableAddSpaceCloudWrapperWorkspace'
        );
        addSpaceCloudWrapper.bindOnClick(function(e) {
            var info = that.variableAddPanel.info;
            if (info.object) return;

            info.isCloud = !info.isCloud;
            that.updateVariableAddView('variable');
        });
        variableAddSpace.appendChild(addSpaceCloudWrapper);
        var addSpaceCloudSpan = Entry.createElement('span');
        addSpaceCloudSpan.addClass('entryVariableAddSpaceCloudSpanWorkspace');
        addSpaceCloudSpan.innerHTML = Lang.Workspace.Variable_create_cloud;
        addSpaceCloudWrapper.appendChild(addSpaceCloudSpan);
        var addVariableCloudCheck = Entry.createElement('span');
        this.variableAddPanel.view.cloudCheck = addVariableCloudCheck;
        addVariableCloudCheck.addClass(
            'entryVariableAddSpaceCheckWorkspace entryVariableAddSpaceCloudCheckWorkspace'
        );
        if (this.variableAddPanel.info.isCloud)
            addVariableCloudCheck.addClass('entryVariableAddChecked');

        addSpaceCloudWrapper.appendChild(addVariableCloudCheck);

        var addSpaceButtonWrapper = Entry.createElement('div');
        addSpaceButtonWrapper.addClass(
            'entryVariableAddSpaceButtonWrapperWorkspace'
        );
        variableAddSpace.appendChild(addSpaceButtonWrapper);

        var addSpaceCancelButton = Entry.createElement('span');
        addSpaceCancelButton.addClass(
            'entryVariableAddSpaceCancelWorkspace entryVariableAddSpaceButtonWorkspace'
        );
        addSpaceCancelButton.innerHTML = Lang.Buttons.cancel;
        addSpaceCancelButton.bindOnClick(function(e) {
            that.variableAddPanel.view.addClass('entryRemove');
            that.resetVariableAddPanel('variable');
        });
        addSpaceButtonWrapper.appendChild(addSpaceCancelButton);

        var addSpaceConfirmButton = Entry.createElement('span');
        addSpaceConfirmButton.addClass(
            'entryVariableAddSpaceConfirmWorkspace entryVariableAddSpaceButtonWorkspace'
        );
        addSpaceConfirmButton.innerHTML = Lang.Buttons.save;
        addSpaceConfirmButton.variableContainer = this;
        addSpaceConfirmButton.bindOnClick(function(e) {
            that._addVariable();
        });
        addSpaceButtonWrapper.appendChild(addSpaceConfirmButton);
        this.variableAddConfirmButton = addSpaceConfirmButton;
    };

    p._addVariable = function() {
        $('.entryVariableAddSpaceInputWorkspace').blur();
        var variable = this._makeVariableData();
        variable = new Entry.Variable(variable);
        Entry.do('variableContainerAddVariable', variable);
        this.updateSelectedVariable(this.variables_[0]);
        var view = this.variables_[0].listElement;
        view.editButton.addClass('entryRemove');
        view.editSaveButton.removeClass('entryRemove');
        view.nameField.removeAttribute('disabled');
    };

    p.generateListAddView = function() {
        var that = this;
        var listAddSpace = Entry.createElement('li');
        this.listAddPanel.view = listAddSpace;
        this.listAddPanel.isOpen = false;
        listAddSpace.addClass('entryVariableAddSpaceWorkspace entryRemove');

        var addSpaceNameWrapper = Entry.createElement('div');
        addSpaceNameWrapper.addClass(
            'entryVariableAddSpaceNameWrapperWorkspace entryListAddSpaceNameWrapperWorkspace'
        );
        listAddSpace.appendChild(addSpaceNameWrapper);

        var addSpaceInput = Entry.createElement('input');
        addSpaceInput.addClass('entryVariableAddSpaceInputWorkspace');
        addSpaceInput.setAttribute('placeholder', Lang.Workspace.list_name);
        this.listAddPanel.view.name = addSpaceInput;
        addSpaceInput.variableContainer = this;
        addSpaceInput.onkeypress = function(e) {
            if (e.keyCode == 13) {
                that.addList();
                var list = that.lists_[0];
                that.updateSelectedVariable(list);
                var view = list.listElement;
                view.editButton.addClass('entryRemove');
                view.editSaveButton.removeClass('entryRemove');
                view.nameField.removeAttribute('disabled');
            }
        };
        addSpaceNameWrapper.appendChild(addSpaceInput);

        var addSpaceGlobalWrapper = Entry.createElement('div');
        addSpaceGlobalWrapper.addClass(
            'entryVariableAddSpaceGlobalWrapperWorkspace'
        );
        addSpaceGlobalWrapper.bindOnClick(function(e) {
            var info = that.listAddPanel.info;
            info.object = null;
            that.updateVariableAddView('list');
        });
        listAddSpace.appendChild(addSpaceGlobalWrapper);

        var addListGlobalSpan = Entry.createElement('span');
        addListGlobalSpan.innerHTML = Lang.Workspace.use_all_objects;
        addSpaceGlobalWrapper.appendChild(addListGlobalSpan);

        var addListGlobalCheck = Entry.createElement('span');
        addListGlobalCheck.addClass('entryVariableAddSpaceCheckWorkspace');
        this.listAddPanel.view.globalCheck = addListGlobalCheck;
        if (!this.listAddPanel.info.object)
            addListGlobalCheck.addClass('entryVariableAddChecked');
        addSpaceGlobalWrapper.appendChild(addListGlobalCheck);

        var addSpaceLocalWrapper = Entry.createElement('div');
        addSpaceLocalWrapper.addClass(
            'entryVariableAddSpaceLocalWrapperWorkspace'
        );
        addSpaceLocalWrapper.bindOnClick(function(e) {
            if (!Entry.playground.object) return;
            var info = that.listAddPanel.info;
            info.object = Entry.playground.object.id;
            info.isCloud = false;
            that.updateVariableAddView('list');
        });
        listAddSpace.appendChild(addSpaceLocalWrapper);
        var addListLocalSpan = Entry.createElement('span');
        addListLocalSpan.innerHTML = Lang.Workspace.Variable_use_this_object;
        addSpaceLocalWrapper.appendChild(addListLocalSpan);

        var addListLocalCheck = Entry.createElement('span');
        addListLocalCheck.addClass('entryVariableAddSpaceCheckWorkspace');
        this.listAddPanel.view.localCheck = addListLocalCheck;
        if (this.variableAddPanel.info.object)
            addListLocalCheck.addClass('entryVariableAddChecked');
        addSpaceLocalWrapper.appendChild(addListLocalCheck);

        var addSpaceCloudWrapper = Entry.createElement('div');
        listAddSpace.cloudWrapper = addSpaceCloudWrapper;
        addSpaceCloudWrapper.addClass(
            'entryVariableAddSpaceCloudWrapperWorkspace'
        );
        addSpaceCloudWrapper.bindOnClick(function(e) {
            var info = that.listAddPanel.info;
            if (info.object) return;

            info.isCloud = !info.isCloud;
            that.updateVariableAddView('list');
        });
        listAddSpace.appendChild(addSpaceCloudWrapper);
        var addSpaceCloudSpan = Entry.createElement('span');
        addSpaceCloudSpan.addClass('entryVariableAddSpaceCloudSpanWorkspace');
        addSpaceCloudSpan.innerHTML = Lang.Workspace.List_create_cloud;

        addSpaceCloudWrapper.appendChild(addSpaceCloudSpan);
        var addListCloudCheck = Entry.createElement('span');
        this.listAddPanel.view.cloudCheck = addListCloudCheck;
        addListCloudCheck.addClass(
            'entryVariableAddSpaceCheckWorkspace entryVariableAddSpaceCloudCheckWorkspace'
        );
        if (this.listAddPanel.info.isCloud)
            addListCloudCheck.addClass('entryVariableAddChecked');

        addSpaceCloudWrapper.appendChild(addListCloudCheck);

        var addSpaceButtonWrapper = Entry.createElement('div');
        addSpaceButtonWrapper.addClass(
            'entryVariableAddSpaceButtonWrapperWorkspace'
        );
        listAddSpace.appendChild(addSpaceButtonWrapper);

        var addSpaceCancelButton = Entry.createElement('span');
        addSpaceCancelButton.addClass(
            'entryVariableAddSpaceCancelWorkspace entryVariableAddSpaceButtonWorkspace'
        );
        addSpaceCancelButton.innerHTML = Lang.Buttons.cancel;
        addSpaceCancelButton.bindOnClick(function(e) {
            that.listAddPanel.view.addClass('entryRemove');
            that.resetVariableAddPanel('list');
        });
        addSpaceButtonWrapper.appendChild(addSpaceCancelButton);

        var addSpaceConfirmButton = Entry.createElement('span');
        addSpaceConfirmButton.addClass(
            'entryVariableAddSpaceConfirmWorkspace entryVariableAddSpaceButtonWorkspace'
        );
        addSpaceConfirmButton.innerHTML = Lang.Buttons.save;
        addSpaceConfirmButton.variableContainer = this;
        addSpaceConfirmButton.bindOnClick(function(e) {
            that.addList();
            var list = that.lists_[0];
            that.updateSelectedVariable(list);
            var view = list.listElement;
            view.editButton.addClass('entryRemove');
            view.editSaveButton.removeClass('entryRemove');
            view.nameField.removeAttribute('disabled');
        });
        addSpaceButtonWrapper.appendChild(addSpaceConfirmButton);
    };

    p.generateVariableSplitterView = function() {
        var topSplitter = Entry.createElement('li');
        topSplitter.addClass('entryVariableSplitterWorkspace');
        var bottomSplitter = Entry.createElement('li');
        bottomSplitter.addClass('entryVariableSplitterWorkspace');

        this.variableSplitters = {
            top: topSplitter,
            bottom: bottomSplitter,
        };
    };

    p.openVariableAddPanel = function(type) {
        type = type ? type : 'variable';
        Entry.playground.toggleOnVariableView();
        Entry.playground.changeViewMode('variable');
        if (type == 'variable') {
            this.variableAddPanel.isOpen = true;
            this.selectFilter(type);
        } else {
            this.listAddPanel.isOpen = true;
            this.selectFilter(type);
        }
        this.updateVariableAddView(type);
    };

    p.getMenuXml = function(xmlList) {
        var blocks = [];
        var hasVariable = this.variables_.length !== 0;
        var hasList = this.lists_.length !== 0;
        var category;
        for (var i = 0, xml; (xml = xmlList[i]); i++) {
            var tagName = xml.tagName;
            if (tagName && tagName.toUpperCase() == 'BLOCK') {
                category = xml.getAttribute('bCategory');
                if (!hasVariable && category == 'variable') continue;
                if (!hasList && category == 'list') continue;
                blocks.push(xml);
            } else if (
                tagName &&
                (tagName.toUpperCase() == 'SPLITTER' ||
                    tagName.toUpperCase() == 'BTN')
            ) {
                if (!hasVariable && category == 'variable') continue;
                if (!hasList && category == 'list') continue;
                blocks.push(xml);
            }
        }
        return blocks;
    };

    p.addCloneLocalVariables = function(param) {
        var that = this;

        //variables
        var variables = [];
        var VARIABLE = 'variables_';
        this.mapVariable(function(variable, param) {
            var cloned = clone(variable, param, VARIABLE);
            cloned && variables.push(cloned);
        }, param);

        //lists
        var lists = [];
        var LISTS = 'lists_';
        this.mapList(function(variable, param) {
            var cloned = clone(variable, param, LISTS);
            cloned && lists.push(cloned);
        }, param);

        variables.map(this.addVariable.bind(this));
        lists.map(this.addList.bind(this));

        function clone(variable, param, nameSpace) {
            //not a local variable
            var _object = variable.object_;
            if (!_object || _object !== param.objectId) return;

            var cloned = variable.toJSON();
            cloned.originId = cloned.id;
            cloned.id = Entry.generateHash();
            cloned.object = param.newObjectId;
            cloned.name = that.checkAllVariableName(cloned.name, nameSpace)
                ? Entry.getOrderedName(cloned.name, that[nameSpace], 'name_')
                : cloned.name;
            delete cloned.x;
            delete cloned.y;

            var json = param.json;
            json.script = json.script.replace(
                new RegExp(cloned.originId, 'g'),
                cloned.id
            );
            return cloned;
        }
    };

    p.generateTimer = function(timer) {
        if (!timer) {
            timer = {};
            timer.id = Entry.generateHash();
            timer.name = Lang.Workspace.Variable_Timer;
            timer.value = 0;
            timer.variableType = 'timer';
            timer.visible = false;
            timer.x = 150;
            timer.y = -70;
            timer = new Entry.Variable(timer);
        }

        timer.generateView();
        timer.tick = null;
        Entry.engine.projectTimer = timer;

        Entry.addEventListener(
            'stop',
            function() {
                Entry.engine.stopProjectTimer();
            }.bind(this)
        );
    };

    //generate Answer
    p.generateAnswer = function(answer) {
        if (!answer) {
            answer = new Entry.Variable({
                id: Entry.generateHash(),
                name: Lang.Blocks.VARIABLE_get_canvas_input_value,
                value: 0,
                variableType: 'answer',
                visible: false,
                x: 150,
                y: -100,
            });
        }

        answer.generateView();
        Entry.container.inputValue = answer;
    };

    p.generateVariableSettingView = function() {
        var that = this;
        var element = Entry.createElement('div');
        element.bindOnClick(function(e) {
            e.stopPropagation();
        });
        this.variableSettingView = element;
        element.addClass('entryVariableSettingWorkspace');
        this.listView_.appendChild(element);
        element.addClass('entryRemove');

        var visibleWrapper = Entry.createElement('div');
        visibleWrapper.addClass('entryVariableSettingVisibleWrapperWorkspace');
        visibleWrapper.bindOnClick(function(e) {
            var v = that.selectedVariable;
            var view = that.variableSettingView.visibleCheck;
            v.setVisible(!v.isVisible());

            if (v.isVisible()) view.addClass('entryVariableSettingChecked');
            else view.removeClass('entryVariableSettingChecked');
        });
        element.appendChild(visibleWrapper);
        var visibleSpan = Entry.createElement('span');
        visibleSpan.innerHTML = Lang.Workspace.show_variable;
        visibleWrapper.appendChild(visibleSpan);
        var visibleCheck = Entry.createElement('span');
        visibleCheck.addClass('entryVariableSettingCheckWorkspace');
        element.visibleCheck = visibleCheck;
        visibleWrapper.appendChild(visibleCheck);

        var initValueWrapper = Entry.createElement('div');
        initValueWrapper.addClass(
            'entryVariableSettingInitValueWrapperWorkspace'
        );
        element.appendChild(initValueWrapper);
        var initValueSpan = Entry.createElement('span');
        initValueSpan.innerHTML = Lang.Workspace.default_value;
        initValueWrapper.appendChild(initValueSpan);
        var initValueInput = Entry.createElement('input');
        initValueInput.addClass('entryVariableSettingInitValueInputWorkspace');
        element.initValueInput = initValueInput;
        initValueInput.value = 0;
        initValueInput.onkeyup = function(e) {
            var v = that.selectedVariable;
            var value = this.value;
            v.setValue(this.value);
        };
        initValueInput.onblur = function(e) {
            var v = that.selectedVariable;
            var value = this.value;
            v.setValue(this.value);
        };
        element.initValueInput = initValueInput;
        initValueWrapper.appendChild(initValueInput);

        var splitter = Entry.createElement('div');
        splitter.addClass('entryVariableSettingSplitterWorkspace');
        element.appendChild(splitter);

        var slideWrapper = Entry.createElement('div');
        slideWrapper.addClass('entryVariableSettingSlideWrapperWorkspace');
        element.appendChild(slideWrapper);
        var slideSpan = Entry.createElement('span');
        slideSpan.innerHTML = Lang.Workspace.slide;
        slideWrapper.appendChild(slideSpan);
        var slideCheck = Entry.createElement('span');
        slideCheck.addClass('entryVariableSettingCheckWorkspace');
        element.slideCheck = slideCheck;
        slideWrapper.appendChild(slideCheck);
        slideWrapper.bindOnClick(function(e) {
            var newVariable;
            var v = that.selectedVariable;
            var variables = that.variables_;
            var type = v.getType();
            if (type == 'variable') {
                var variableJSON = v.toJSON();
                variableJSON.variableType = 'slide';
                newVariable = new Entry.Variable(variableJSON);
                variables.splice(variables.indexOf(v), 0, newVariable);
                if (newVariable.getValue() < 0) newVariable.setValue(0);
                if (newVariable.getValue() > 100) newVariable.setValue(100);
                minValueInput.removeAttribute('disabled');
                maxValueInput.removeAttribute('disabled');
            } else if (type == 'slide') {
                var variableJSON = v.toJSON();
                variableJSON.variableType = 'variable';
                newVariable = new Entry.Variable(variableJSON);
                variables.splice(variables.indexOf(v), 0, newVariable);
                minValueInput.setAttribute('disabled', 'disabled');
                maxValueInput.setAttribute('disabled', 'disabled');
            }
            that.createVariableView(newVariable);

            that.removeVariable(v);
            that.updateSelectedVariable(newVariable);
            newVariable.generateView();
        });

        var minMaxWrapper = Entry.createElement('div');
        element.minMaxWrapper = minMaxWrapper;
        minMaxWrapper.addClass('entryVariableSettingMinMaxWrapperWorkspace');
        element.appendChild(minMaxWrapper);
        var minValueSpan = Entry.createElement('span');
        minValueSpan.innerHTML = Lang.Workspace.min_value;
        minMaxWrapper.appendChild(minValueSpan);
        var minValueInput = Entry.createElement('input');
        minValueInput.addClass('entryVariableSettingMinValueInputWorkspace');
        var v = that.selectedVariable;
        if (v && v.type == 'slide') minValueInput.value = v.minValue_;
        else minValueInput.value = 0;
        minValueInput.onkeypress = function(e) {
            e.keyCode === 13 && this.blur();
        };
        minValueInput.onblur = function(e) {
            if (Entry.Utils.isNumber(this.value)) {
                var v = that.selectedVariable;
                v.setMinValue(this.value);
                that.updateVariableSettingView(v);
            }
        };
        element.minValueInput = minValueInput;
        minMaxWrapper.appendChild(minValueInput);

        var maxValueSpan = Entry.createElement('span');
        maxValueSpan.addClass('entryVariableSettingMaxValueSpanWorkspace');
        maxValueSpan.innerHTML = Lang.Workspace.max_value;
        minMaxWrapper.appendChild(maxValueSpan);
        var maxValueInput = Entry.createElement('input');
        maxValueInput.addClass('entryVariableSettingMaxValueInputWorkspace');
        if (v && v.type == 'slide') maxValueInput.value = v.maxValue_;
        else maxValueInput.value = 100;
        maxValueInput.onkeypress = function(e) {
            e.keyCode === 13 && this.blur();
        };
        maxValueInput.onblur = function(e) {
            if (Entry.Utils.isNumber(this.value)) {
                var v = that.selectedVariable;
                v.setMaxValue(this.value);
                that.updateVariableSettingView(v);
            }
        };
        element.maxValueInput = maxValueInput;
        minMaxWrapper.appendChild(maxValueInput);
    };

    /**
     * @param {object|Entry.Variable} object
     */
    p.updateVariableSettingView = function(v) {
        var view = this.variableSettingView,
            visibleCheck = view.visibleCheck,
            initValue = view.initValueInput,
            slide = view.slideCheck,
            minValue = view.minValueInput,
            maxValue = view.maxValueInput,
            minMaxWrapper = view.minMaxWrapper;

        visibleCheck.removeClass('entryVariableSettingChecked');
        if (v.isVisible()) visibleCheck.addClass('entryVariableSettingChecked');

        slide.removeClass('entryVariableSettingChecked');
        if (v.getType() == 'slide') {
            slide.addClass('entryVariableSettingChecked');
            minValue.removeAttribute('disabled');
            maxValue.removeAttribute('disabled');
            minValue.value = v.getMinValue();
            maxValue.value = v.getMaxValue();
            minMaxWrapper.removeClass('entryVariableMinMaxDisabledWorkspace');
        } else {
            minMaxWrapper.addClass('entryVariableMinMaxDisabledWorkspace');
            minValue.setAttribute('disabled', 'disabled');
            maxValue.setAttribute('disabled', 'disabled');
        }

        initValue.value = v.getValue();
        v.listElement.appendChild(view);

        view.removeClass('entryRemove');
    };

    p.generateListSettingView = function() {
        var that = this;
        var element = Entry.createElement('div');
        element.bindOnClick(function(e) {
            e.stopPropagation();
        });
        this.listSettingView = element;
        element.addClass('entryListSettingWorkspace');
        this.listView_.appendChild(element);
        element.addClass('entryRemove');

        var visibleWrapper = Entry.createElement('div');
        visibleWrapper.addClass('entryListSettingVisibleWrapperWorkspace');
        visibleWrapper.bindOnClick(function(e) {
            var v = that.selectedList;
            var view = that.listSettingView.visibleCheck;
            v.setVisible(!v.isVisible());

            if (v.isVisible())
                view.addClass('entryListSettingCheckedWorkspace');
            else view.removeClass('entryListSettingCheckedWorkspace');
        });
        element.appendChild(visibleWrapper);
        var visibleSpan = Entry.createElement('span');
        visibleSpan.innerHTML = Lang.Workspace.show_list_workspace;
        visibleWrapper.appendChild(visibleSpan);
        var visibleCheck = Entry.createElement('span');
        visibleCheck.addClass('entryListSettingCheckWorkspace');
        element.visibleCheck = visibleCheck;
        visibleWrapper.appendChild(visibleCheck);

        var lengthWrapper = Entry.createElement('div');
        lengthWrapper.addClass('entryListSettingLengthWrapperWorkspace');
        var lengthSpan = Entry.createElement('span');
        lengthSpan.addClass('entryListSettingLengthSpanWorkspace');
        lengthSpan.innerHTML = Lang.Workspace.number_of_list;
        lengthWrapper.appendChild(lengthSpan);
        element.appendChild(lengthWrapper);
        var lengthController = Entry.createElement('div');
        lengthController.addClass('entryListSettingLengthControllerWorkspace');
        lengthWrapper.appendChild(lengthController);
        var minus = Entry.createElement('span');
        minus.addClass('entryListSettingMinusWorkspace');
        minus.bindOnClick(function(e) {
            var v = that.selectedList;
            var arr = that.selectedList.array_;
            arr.pop();
            that.updateListSettingView(that.selectedList);
        });
        lengthController.appendChild(minus);
        var lengthInput = Entry.createElement('input');
        lengthInput.addClass('entryListSettingLengthInputWorkspace');
        lengthInput.onblur = function() {
            that.setListLength(this.value);
        };

        lengthInput.onkeypress = function(e) {
            if (e.keyCode == 13) this.blur();
        };
        element.lengthInput = lengthInput;
        lengthController.appendChild(lengthInput);
        var plus = Entry.createElement('span');
        plus.addClass('entryListSettingPlusWorkspace');
        plus.bindOnClick(function(e) {
            var v = that.selectedList;
            var arr = that.selectedList.array_;
            arr.push({ data: 0 });
            that.updateListSettingView(that.selectedList);
        });
        lengthController.appendChild(plus);
        var seperator = Entry.createElement('div');
        element.seperator = seperator;
        element.appendChild(seperator);
        seperator.addClass('entryListSettingSeperatorWorkspace');

        var listValues = Entry.createElement('div');
        listValues.addClass('entryListSettingListValuesWorkspace');
        element.listValues = listValues;
        element.appendChild(listValues);
    };

    p.updateListSettingView = function(list) {
        var that = this;
        list = list || this.selectedList;
        var view = this.listSettingView,
            listValues = view.listValues,
            visibleCheck = view.visibleCheck,
            lengthInput = view.lengthInput,
            seperator = view.seperator;

        visibleCheck.removeClass('entryListSettingCheckedWorkspace');
        if (list.isVisible())
            visibleCheck.addClass('entryListSettingCheckedWorkspace');

        lengthInput.value = list.array_.length;
        list.listElement.appendChild(view);

        while (listValues.firstChild)
            listValues.removeChild(listValues.firstChild);
        var arr = list.array_;
        if (arr.length === 0) seperator.addClass('entryRemove');
        else seperator.removeClass('entryRemove');

        var startIndex = 1;
        if (
            Entry.playground.mainWorkspace.mode ===
            Entry.Workspace.MODE_VIMBOARD
        )
            startIndex = 0;

        for (var i = 0; i < arr.length; i++) {
            (function(i) {
                var wrapper = Entry.createElement('div');
                wrapper.addClass('entryListSettingValueWrapperWorkspace');
                var numberSpan = Entry.createElement('span');
                numberSpan.addClass('entryListSettingValueNumberSpanWorkspace');
                numberSpan.innerHTML = i + startIndex;
                wrapper.appendChild(numberSpan);
                var input = Entry.createElement('input');
                input.value = arr[i].data;
                input.onblur = function() {
                    arr[i].data = this.value;
                    list.updateView();
                };
                input.onkeypress = function(e) {
                    if (e.keyCode == 13) this.blur();
                };
                input.addClass('entryListSettingEachInputWorkspace');
                wrapper.appendChild(input);
                var removeButton = Entry.createElement('span');
                removeButton.bindOnClick(function() {
                    arr.splice(i, 1);
                    that.updateListSettingView();
                });
                removeButton.addClass('entryListSettingValueRemoveWorkspace');
                wrapper.appendChild(removeButton);
                listValues.appendChild(wrapper);
            })(i);
        }

        list.updateView();
        view.removeClass('entryRemove');
    };

    p.setListLength = function(value) {
        value = Number(value);
        var arr = this.selectedList.array_;
        if (Entry.Utils.isNumber(value)) {
            var arrLen = arr.length;
            if (arrLen < value) {
                var len = value - arrLen;
                for (var i = 0; i < len; i++) arr.push({ data: 0 });
            } else if (arrLen > value) {
                arr.length = value;
            }
        }
        this.updateListSettingView();
    };

    p.updateViews = function() {
        var variables = this.variables_,
            lists = this.lists_;

        variables.map(function(v) {
            v.updateView();
        });

        lists.map(function(l) {
            l.updateView();
        });
    };

    p.updateSelectedVariable = function(object, type) {
        if (!object) {
            type = type || 'variable';
            this.selectedVariable = null;
            if (type == 'variable')
                this.variableSettingView.addClass('entryRemove');
            else this.listSettingView.addClass('entryRemove');
        } else if (object.type == 'variable') {
            this.selectedVariable = object;
            this.updateVariableSettingView(object);
        } else if (object.type == 'slide') {
            this.selectedVariable = object;
            this.updateVariableSettingView(object);
        } else if (object.type == 'list') {
            this.selectedList = object;
            this.updateListSettingView(object);
        }
    };

    p.removeLocalVariables = function(objectId) {
        var variables = [];
        var that = this;
        this.mapVariable(function(variable, objectId) {
            if (variable.object_ && variable.object_ == objectId)
                variables.push(variable);
        }, objectId);

        variables.map(function(variable) {
            that.removeVariable(variable);
        });
    };

    p.updateCloudVariables = function() {
        var projectId = Entry.projectId;
        if (!Entry.cloudSavable || !projectId) return;

        var that = Entry.variableContainer;
        var cloudVariables = that.variables_.filter(function(v) {
            return v.isCloud_;
        });
        cloudVariables = cloudVariables.map(function(v) {
            return v.toJSON();
        });

        var cloudLists = that.lists_.filter(function(v) {
            return v.isCloud_;
        });
        cloudLists = cloudLists.map(function(v) {
            return v.toJSON();
        });

        if (!cloudVariables.length && !cloudLists.length) return;

        $.ajax({
            url: '/api/project/variable/' + Entry.projectId,
            type: 'PUT',
            data: {
                variables: cloudVariables,
                lists: cloudLists,
            },
        }).done(function() {});
    };

    p.addRef = function(type, blockData) {
        if (
            !this.view_ ||
            !Entry.playground.mainWorkspace ||
            Entry.getMainWS().getMode() !== Entry.Workspace.MODE_BOARD
        )
            return;

        var datum = {
            object: blockData.getCode().object,
            block: blockData,
        };

        if (blockData.funcBlock) {
            datum.funcBlock = blockData.funcBlock;
            delete blockData.funcBlock;
        }

        this[type].push(datum);

        if (type == '_functionRefs') {
            var id = blockData.type.substr(5);
            var func = Entry.variableContainer.functions_[id];
            if (func.isAdded) return;
            func.isAdded = true;
            var blocks = func.content.getBlockList();

            for (var i = 0; i < blocks.length; i++) {
                var block = blocks[i];
                var events = block.events;

                if (block.type.indexOf('func_') > -1) {
                    var funcId = block.type.substr(5);
                    if (funcId == id) continue;
                }

                if (events && events.viewAdd) {
                    events.viewAdd.forEach(function(fn) {
                        block.getCode().object = datum.object;
                        if (fn) {
                            block.funcBlock = datum.block;
                            fn(block);
                        }
                    });
                }

                if (events && events.dataAdd) {
                    events.dataAdd.forEach(function(fn) {
                        block.getCode().object = datum.object;
                        if (fn) {
                            block.funcBlock = datum.block;
                            fn(block);
                        }
                    });
                }
            }
        }

        return datum;
    };

    // p.getObjectVariables = function (object) {
    //     var blockList = object.script.getBlockList();

    //     var a = this.getFunctionJSONByBlockList(blockList);

    //     return a;
    // }

    p.getObjectVariables = function(blockList, keys) {
        var findFuncKeys = keys || {};
        var functions = [];
        var jsonData = this.getVariableJSONByBlockList(blockList);
        var variables = jsonData.variables;
        var messages = jsonData.messages;

        blockList.forEach(
            function(block) {
                var type = block.type;
                if (type && type.indexOf('func_') === 0) {
                    var id = type.substr(5);
                    if (!findFuncKeys[id]) {
                        var func = this.functions_[id];
                        findFuncKeys[id] = true;
                        functions.push({
                            id: id,
                            content: JSON.stringify(func.content.toJSON()),
                        });

                        blockList = func.content.getBlockList();
                        var jsonData = this.getObjectVariables(
                            blockList,
                            findFuncKeys
                        );
                        functions = functions.concat(jsonData.functions);
                        variables = variables.concat(jsonData.variables);
                        messages = messages.concat(jsonData.messages);
                    }
                }
            }.bind(this)
        );

        return {
            functions: functions,
            variables: variables,
            messages: messages,
        };
    };

    p.getVariableJSONByBlockList = function(blockList) {
        var variableSet = {};
        var variables = [];
        var messages = [];

        this.variables_.forEach(function(variable) {
            variableSet[variable.id_] = variable;
        });

        this.lists_.forEach(function(list) {
            variableSet[list.id_] = list;
        });

        this.messages_.forEach(function(message) {
            variableSet[message.id] = message;
        });

        blockList.forEach(function(block) {
            var data = block.data || {};
            var type = data.type;
            var isMessage;
            var isVariable;
            if (type) {
                isMessage = EntryStatic.messageBlockList.indexOf(type) > -1;
                isVariable = EntryStatic.variableBlockList.indexOf(type) > -1;
            }

            if (type && (isMessage || isVariable)) {
                block.data.params.forEach(function(param) {
                    if (typeof param === 'string' && !!variableSet[param]) {
                        var item = variableSet[param];
                        if (isVariable) {
                            variables.push(item.toJSON());
                        } else {
                            messages.push({
                                id: item.id,
                                name: item.name,
                            });
                        }
                        variableSet[param] = undefined;
                    }
                });
            }
        });

        return {
            variables: variables,
            messages: messages,
        };
    };

    p.removeRef = function(type, block) {
        if (!Entry.playground.mainWorkspace) return;
        var wsMode = Entry.getMainWS().getMode();
        if (wsMode !== Entry.Workspace.MODE_BOARD) return;

        var arr = this[type];

        for (var i = 0; i < arr.length; i++) {
            var current = arr[i];
            if (current.block == block) {
                arr.splice(i, 1);
                break;
            }
        }

        if (type == '_functionRefs') {
            var id = block.type.substr(5);
            var func = Entry.variableContainer.functions_[id];
            if (!func || func.isRemoved) return;
            func.isRemoved = true;
            if (func) {
                var blocks = func.content.getBlockList();
                for (var i = 0; i < blocks.length; i++) {
                    var block = blocks[i];
                    var events = block.events;
                    if (block.type.indexOf('func_') > -1) {
                        var funcId = block.type.substr(5);
                        if (funcId == id) continue;
                    }

                    if (events && events.viewDestroy) {
                        events.viewDestroy.forEach(function(fn) {
                            if (fn) fn(block);
                        });
                    }

                    if (events && events.dataDestroy) {
                        events.dataDestroy.forEach(function(fn) {
                            if (fn) fn(block);
                        });
                    }
                }
            }
        }
    };

    p._getBlockMenu = function() {
        return Entry.playground.mainWorkspace.getBlockMenu();
    };

    p._truncName = function(name, type) {
        name = name.substring(0, this._maxNameLength);
        var title, content;

        title = Lang.Workspace[type + '_name_auto_edited_title'];
        content = Lang.Workspace[type + '_name_auto_edited_content'];

        Entry.toast.warning(title, content);

        return name;
    };

    p._maxNameLength = 10;

    p.clear = function() {
        this.variables_.map(function(v) {
            v.remove();
        });
        this.variables_ = [];

        this.lists_.map(function(v) {
            v.remove();
        });
        this.lists_ = [];

        Entry.engine &&
            Entry.engine.projectTimer &&
            Entry.engine.projectTimer.remove();

        if (Entry.container && Entry.container.inputValue) {
            Entry.container.inputValue.remove &&
                Entry.container.inputValue.remove();
        }

        this.messages_ = [];

        for (var key in this.functions_) {
            var func = this.functions_[key];
            func.destroy();
            delete this.functions_[key];
        }

        Entry.playground.reloadPlayground();
        this.updateList();
    };

    p._isPythonMode = function() {
        var ws = Entry.getMainWS();
        return ws && ws.isVimMode();
    };

    p.getDom = function(query) {
        if (query.length >= 1) {
            switch (query.shift()) {
                case 'filter':
                    return this.filterElements[query.shift()];
                case 'variableAddButton':
                    return this.variableAddButton_;
                case 'variableAddConfirmButton':
                    return this.variableAddConfirmButton;
                case 'variableAddInput':
                    return this.variableAddPanel.view.name;
            }
        } else {
        }
    };

    p.clickVariableAddButton = function(forceOpen, doNotFocus) {
        var panel = this.variableAddPanel;
        var value = panel.view.name.value.trim();
        if (panel.isOpen && !forceOpen) {
            if (!value || value.length === 0) {
                panel.view.addClass('entryRemove');
                panel.isOpen = false;
            } else {
                var variable = this._makeVariableData();
                variable = new Entry.Variable(variable);
                Entry.do('variableContainerAddVariable', variable);
            }
        } else {
            panel.view.removeClass('entryRemove');
            if (document.activeElement !== panel.view.name && !doNotFocus)
                panel.view.name.focus();
            panel.isOpen = true;
        }
    };

    p._makeVariableData = function() {
        var panel = this.variableAddPanel;
        var name = panel.view.name.value.trim();
        if (!name || name.length === 0) name = Lang.Workspace.variable;

        if (name.length > this._maxNameLength)
            name = this._truncName(name, 'variable');

        name = this.checkAllVariableName(name, 'variables_')
            ? Entry.getOrderedName(name, this.variables_, 'name_')
            : name;

        var info = panel.info;
        return {
            name: name,
            isCloud: info.isCloud,
            object: info.object,
            variableType: 'variable',
        };
    };

    p.applyOption = function() {
        process(this._filterTabs.variable, Entry.variableEnable);
        process(this._filterTabs.message, Entry.messageEnable);
        process(this._filterTabs.list, Entry.listEnable);
        process(this._filterTabs.func, Entry.functionEnable);

        function process(view, value) {
            if (value) {
                view.removeClass('disable');
                view.disabled = false;
            } else {
                view.addClass('disable');
                view.disabled = true;
            }
        }
    };
})(Entry.VariableContainer.prototype);
