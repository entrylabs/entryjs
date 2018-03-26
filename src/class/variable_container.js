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
        var selectView = Entry.createElement('table').addClass(
            'entryVariableSelectorWorkspace'
        );
        this.view_.appendChild(selectView);
        var selectTrView = Entry.createElement('tr');
        selectView.appendChild(selectTrView);

        var allButton = this.createSelectButton('all').addClass(
            'selected',
            'allButton'
        );
        this.filterElements.all = allButton;

        allButton.setAttribute('rowspan', '2');
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

        var listView = Entry.createElement('ul').addClass(
            'entryVariableListWorkspace'
        );
        this.view_.appendChild(listView);
        this.listView_ = listView;

        var variableAddButton = Entry.createElement('li').addClass(
            'entryVariableAddWorkspace entryVariableListElementWorkspace'
        );
        variableAddButton.innerHTML = '+ ' + Lang.Workspace.variable_add;
        var thisPointer = this;
        this.variableAddButton_ = variableAddButton;

        variableAddButton.bindOnClick((e) => {
            Entry.do('variableContainerClickVariableAddButton');
        });

        this.generateVariableAddView();
        this.generateListAddView();
        this.generateVariableSplitterView();
        this.generateVariableSettingView();
        this.generateListSettingView();

        var messageAddButton = Entry.createElement('li').addClass(
            'entryVariableAddWorkspace entryVariableListElementWorkspace'
        );
        messageAddButton.innerHTML = '+ ' + Lang.Workspace.message_create;
        this.messageAddButton_ = messageAddButton;
        messageAddButton.bindOnClick((e) => {
            Entry.do('variableContainerAddMessage', {
                id: Entry.generateHash(),
                name: `${Lang.Workspace.message} ${this.messages_.length + 1}`,
            });
        });

        var listAddButton = Entry.createElement('li').addClass(
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

        var functionAddButton = Entry.createElement('li').addClass(
            'entryVariableAddWorkspace entryVariableListElementWorkspace'
        );
        functionAddButton.innerHTML = '+ ' + Lang.Workspace.function_add;
        this.functionAddButton_ = functionAddButton;
        functionAddButton.bindOnClick(function(e) {
            Entry.do("funcEditStart")
        });

        return view;
    };

    /**
     * @param {String} type
     * @param {?Boolean} isEnable
     */
    p.createSelectButton = function(type, isEnable = true) {
        var view = Entry.createElement('td').addClass(
            'entryVariableSelectButtonWorkspace',
            type
        );
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
        _.each(this.view_.getElementsByTagName('td'), (elem) => {
            if (elem.hasClass(type)) {
                elem.addClass('selected');
            } else {
                elem.removeClass('selected');
            }
        });
        this.viewMode_ = type;
        this.select();
        this.updateList();
    };

    p.updateVariableAddView = function(type = 'variable') {
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

    p.getMessage = function(id) {
        return _.findWhere(this.messages_, { id });
    };

    /**
     * @param {object} message
     */
    p.renderMessageReference = function(message) {
        var that = this;
        var messageId = message.id;

        var callers = this._messageRefs.filter(({ block: { params } }) => {
            return _.contains(params, messageId);
        });

        var listView = Entry.createElement('ul').addClass(
            'entryVariableListCallerListWorkspace'
        );

        if (callers.length) {
            var fragment = document.createDocumentFragment();
            callers.forEach((caller) => {
                var element = Entry.createElement('li').addClass(
                    'entryVariableListCallerWorkspace'
                );
                !caller.object.thumbnailView_ && caller.object.generateView();
                element.appendChild(caller.object.thumbnailView_.cloneNode());
                var nameElement = Entry.createElement('div').addClass(
                    'entryVariableListCallerNameWorkspace'
                );
                nameElement.innerHTML = `${caller.object.name} : ${
                    Lang.Blocks['START_' + caller.block.type]
                }`;
                element.appendChild(nameElement);
                element.caller = caller;
                element.message = message;
                element.bindOnClick(function(e) {
                    var caller = this.caller;
                    if (Entry.playground.object != caller.object) {
                        Entry.container.selectObject();
                        Entry.container.selectObject(caller.object.id, true);
                        that.select(null);
                        that.select(this.message);
                    }

                    Entry.playground.toggleOnVariableView();
                    Entry.playground.changeViewMode('variable');
                });
                fragment.appendChild(element);
            });
            listView.appendChild(fragment);
        } else {
            var element = Entry.createElement('li').addClass(
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
        var variableId = variable.id_;

        var callers = this._variableRefs.filter(({ block: { params } }) => {
            return _.contains(params, variableId);
        });

        var listView = Entry.createElement('ul').addClass(
            'entryVariableListCallerListWorkspace'
        );

        if (callers.length) {
            var fragment = document.createDocumentFragment();
            callers.forEach((caller) => {
                var element = Entry.createElement('li').addClass(
                    'entryVariableListCallerWorkspace'
                );
                !caller.object.thumbnailView_ && caller.object.generateView();
                element.appendChild(caller.object.thumbnailView_.cloneNode());
                var nameElement = Entry.createElement('div').addClass(
                    'entryVariableListCallerNameWorkspace'
                );
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
                        Entry.container.selectObject(
                            this.caller.object.id,
                            true
                        );
                        that.select(null);
                    }
                    var caller = this.caller;
                    var block = caller.funcBlock || caller.block;
                    var blockView = block.view;
                    blockView && blockView.getBoard().activateBlock(block);
                    Entry.playground.toggleOnVariableView();
                    Entry.playground.changeViewMode('variable');
                });
                fragment.appendChild(element);
            });
            listView.appendChild(fragment);
        } else {
            var element = Entry.createElement('li').addClass(
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
        var funcId = func.id_;

        var callers = [...this._functionRefs];

        var listView = Entry.createElement('ul').addClass(
            'entryVariableListCallerListWorkspace'
        );

        if (callers.length) {
            var fragment = document.createDocumentFragment();
            callers.forEach((caller) => {
                var element = Entry.createElement('li').addClass(
                    'entryVariableListCallerWorkspace'
                );
                !caller.object.thumbnailView_ && caller.object.generateView();
                element.appendChild(caller.object.thumbnailView_.cloneNode());
                var nameElement = Entry.createElement('div').addClass(
                    'entryVariableListCallerNameWorkspace'
                );
                nameElement.innerHTML = caller.object.name;
                element.appendChild(nameElement);
                element.caller = caller;
                element.bindOnClick(function(e) {
                    if (Entry.playground.object != this.caller.object) {
                        Entry.container.selectObject();
                        Entry.container.selectObject(
                            this.caller.object.id,
                            true
                        );
                        that.select(null);
                        that.select(func);
                    }
                    Entry.playground.toggleOnVariableView();
                    var block = this.caller.block;
                    var blockView = block.view;
                    blockView && blockView.getBoard().activateBlock(block);
                    Entry.playground.changeViewMode('variable');
                });
                fragment.appendChild(element);
            });
            listView.appendChild(fragment);
        } else {
            var element = Entry.createElement('li').addClass(
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
    p.setMessages = function(messages = []) {
        this.messages_ = messages.map((message) => {
            if (!message.id) {
                message.id = Entry.generateHash();
            }
            return message;
        });
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
    p.setVariables = function(variables = []) {
        var that = this;
        variables.forEach((variable) => {
            variable = new Entry.Variable(variable);
            var type = variable.getType();
            if (type == 'variable' || type == 'slide') {
                variable.generateView(this.variables_.length);
                this.variables_.push(variable);
            } else if (type == 'list') {
                variable.generateView(this.lists_.length);
                this.lists_.push(variable);
            } else if (type == 'timer') {
                that.generateTimer(variable);
            } else if (type == 'answer') {
                that.generateAnswer(variable);
            }
        });

        if (Entry.isEmpty(Entry.engine.projectTimer))
            Entry.variableContainer.generateTimer();
        if (Entry.isEmpty(Entry.container.inputValue))
            Entry.variableContainer.generateAnswer();

        Entry.playground.reloadPlayground();
    };

    p.generateVariable = function(variable, data, key) {
        let name = variable.name_;
        variable.generateView(data.length);
        variable.name_ = this.checkAllVariableName(name, key)
            ? Entry.getOrderedName(name, data, 'name_')
            : name;
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
    p.setFunctions = function(functions = []) {
        functions.forEach((func) => {
            func = new Entry.Func(func);
            func.generateBlock();
            this.functions_[func.id] = func;
        });
    };

    /**
     * @param {!Array.<function model>} variables
     */
    p.appendFunctions = function(functions = []) {
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
    p.getVariable = function(id_, entity = {}) {
        const criteria = { id_ };
        var variable = _.findWhere(this.variables_, criteria);
        if (entity.isClone && variable.object_) {
            variable = _.findWhere(entity.variables, criteria);
        }

        return variable;
    };

    /**
     * get variable on canvas
     * @return {Entry.List}
     */
    p.getList = function(listId, entity = {}) {
        const criteria = { id_: listId };
        var list = _.findWhere(this.lists, criteria);
        if (entity.isClone && list.object_) {
            list = _.findWhere(entity.lists, criteria);
        }

        return list;
    };

    /**
     * Create function
     */
    p.createFunction = function() {
        if (Entry.Func.isEdit) return;
        Entry.Func.edit(new Entry.Func());
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
    p.removeFunction = function({ id: functionId }) {
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

    function _getVariableByName(arr, variableName, isSelf, currentObjectId) {
        var { playground } = Entry;
        if (!currentObjectId && playground && playground.object)
            currentObjectId = playground.object.id;

        for (var i = 0; i < arr.length; i++) {
            var v = arr[i];
            if (isSelf === true) {
                if (!v.object_ || v.object_ !== currentObjectId) continue;
            } else if (isSelf === false) {
                if (v.object_) continue;
            }

            if (v.getName() === variableName) return v;
        }
    }

    p.getVariableByName = function(variableName, isSelf, currentObjectId) {
        return _getVariableByName(
            this.variables_,
            variableName,
            isSelf,
            currentObjectId
        );
    };

    p.getListByName = function(name, isSelf, currentObjectId) {
        return _getVariableByName(this.lists_, name, isSelf, currentObjectId);
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

        var removeButton = Entry.createElement('button').addClass(
            'entryVariableListElementDeleteWorkspace'
        );
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

        var editButton = Entry.createElement('button').addClass(
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

        var nameField = Entry.createElement('div').addClass(
            'entryVariableFunctionElementNameWorkspace'
        );
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
        return this[variable].some(({ name_ }) => {
            return name_ === name;
        });
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
        var variables = this.variables_;
        if (!(variable instanceof Entry.Variable)) {
            variable = _.findWhere(variables, { id_: variable.id });
        }

        var index = this.variables_.indexOf(variable);

        if (this.selected == variable) this.select(null);
        variable.remove();
        variables.splice(index, 1);
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
        var wrapper = Entry.createElement('div').addClass(
            'entryVariableListElementWrapperWorkspace variable'
        );
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
        var removeButton = Entry.createElement('button').addClass(
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

        var editButton = Entry.createElement('button').addClass(
            'entryVariableListElementEditWorkspace'
        );
        editButton.bindOnClick(function(e) {
            e.stopPropagation();
            nameField.removeAttribute('disabled');
            editSaveButton.removeClass('entryRemove');
            this.addClass('entryRemove');
            that.updateSelectedVariable(variable);
            nameField.focus();
        });
        view.editButton = editButton;

        var editSaveButton = Entry.createElement('button').addClass(
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

        var nameField = Entry.createElement('input').addClass(
            'entryVariableListElementNameWorkspace'
        );
        nameField.setAttribute('disabled', 'disabled');
        nameField.value = variable.name_;
        nameField.bindOnClick(function(e) {
            e.stopPropagation();
        });
        nameField.onblur = function(e) {
            var value = this.value.trim();
            if (!value) {
                Entry.toast.alert(
                    Lang.Msgs.warn,
                    Lang.Workspace.variable_can_not_space
                );
                this.value = variable.getName();
                return;
            }
            that.changeVariableName(variable, this.value);
        };
        nameField.onkeydown = function({ keyCode }) {
            if (keyCode == 13) this.blur();
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
    p.addMessage = function(message = {}) {
        var messages = this.messages_;
        if (!message.name) {
            message.name = `${Lang.Workspace.message} ${messages.length + 1}`;
        }
        if (!message.id) {
            message.id = Entry.generateHash();
        }
        this.createMessageView(message);
        messages.unshift(message);

        var { playground } = Entry;

        if (playground) {
            var { blockMenu } = playground;
            if (blockMenu) {
                blockMenu.deleteRendered('start');
            }
            playground.reloadPlayground();
        }
        this.updateList();
        var nameField = message.listElement.nameField;

        //flag for first time blur command
        //focus first and value not changed
        //command will be skipped
        nameField.isFirst = true;
        nameField.focus();
        return new Entry.State(this, this.removeMessage, message);
    };

    /**
     * Add event
     * @param {message model} message
     */
    p.removeMessage = function({ id }) {
        var message = this.getMessage(id);
        if (this.selected == message) {
            this.select(null);
        }
        this.messages_.splice(this.messages_.indexOf(message), 1);
        this.updateList();
        Entry.playground.reloadPlayground();
    };

    /**
     * @param {object} message
     * @param {String} name
     */
    p.changeMessageName = function({ id }, name) {
        var message = this.getMessage(id);
        if (message.name == name) return;

        var messages = this.messages_;
        var exist = Entry.isExist(name, 'name', messages);

        var { listElement: { nameField } } = message;
        var { playground, toast } = Entry;

        if (exist) {
            return failFunc(
                message.name,
                Lang.Workspace.message_rename_failed,
                Lang.Workspace.message_dup
            );
        } else if (name.length > 10) {
            return failFunc(
                message.name,
                Lang.Workspace.message_rename_failed,
                Lang.Workspace.message_too_long
            );
        }

        message.name = name;
        nameField.value = message.name;
        if (playground) {
            playground.blockMenu.deleteRendered('start');
            playground.reloadPlayground();
        }
        toast.success(
            Lang.Workspace.message_rename,
            Lang.Workspace.message_rename_ok
        );

        function failFunc(value, title, message) {
            nameField.value = value;
            toast.alert(title, message);
            return;
        }
    };

    p.activateMessageEditView = function(message) {
        var { listElement } = message;
        var $listElement = $(listElement);

        var $nameField = $listElement.find(
            '.entryVariableListElementNameWorkspace'
        );
        var $editSaveButton = $listElement.find(
            '.entryVariableListElementEditWorkspace.editSaveButton'
        );
        var $editButton = $listElement.find(
            '.entryVariableListElementEditWorkspace.editButton'
        );

        $nameField.removeAttr('disabled');
        $nameField.focus();
        $editSaveButton.removeClass('entryRemove');
        $editButton.addClass('entryRemove');

        var { playground } = Entry;

        if (playground) {
            var { blockMenu } = playground;
            if (blockMenu) {
                blockMenu.deleteRendered('start');
            }
            playground.reloadPlayground();
        }
    };

    /**
     * @param {object} message
     */
    p.createMessageView = function(message) {
        var that = this;
        var view = Entry.createElement('li').addClass(
            'entryVariableListElementWorkspace entryMessageElementWorkspace'
        );
        view.bindOnClick(function(e) {
            that.select(message);
        });

        var removeButton = Entry.createElement('button').addClass(
            'entryVariableListElementDeleteWorkspace'
        );
        removeButton.bindOnClick(function(e) {
            e.stopPropagation();
            Entry.do('variableContainerRemoveMessage', message);
        });

        var editButton = Entry.createElement('button').addClass(
            'entryVariableListElementEditWorkspace editButton'
        );
        editButton.bindOnClick((e) => {
            e.stopPropagation();
            this.activateMessageEditView(message);
        });

        var editSaveButton = Entry.createElement('button').addClass(
            'entryVariableListElementEditWorkspace entryRemove editSaveButton'
        );
        editSaveButton.bindOnClick(function(e) {
            e.stopPropagation();
            nameField.blur();
            editButton.removeClass('entryRemove');
            this.addClass('entryRemove');
        });

        var nameField = Entry.createElement('input').addClass(
            'entryVariableListElementNameWorkspace'
        );
        nameField.value = message.name;
        nameField.bindOnClick(function(e) {
            e.stopPropagation();
        });

        nameField.onfocus = function(e) {
            this.blurred = false;
        };

        nameField.onblur = _.debounce(function(e) {
            if (this.blurred) {
                return;
            }

            this.blurred = true;
            var value = this.value.trim();
            if (!value) {
                Entry.toast.alert(Lang.Msgs.warn, Lang.Msgs.sign_can_not_space);
                this.value = message.name;
                return this.focus();
            }

            //message
            //so check message exist currently
            message = Entry.variableContainer.getMessage(message.id);
            if (message && !(this.isFirst && value === message.name)) {
                Entry.do('messageSetName', message.id, value);
            }
            delete this.isFirst;
            editButton.removeClass('entryRemove');
            editSaveButton.addClass('entryRemove');
            nameField.setAttribute('disabled', 'disabled');
        }, 200);

        nameField.onkeydown = function({ keyCode }) {
            if (keyCode == 13) this.blur();
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
            if (!name) name = Lang.Workspace.list;

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
        var view = Entry.createElement('li').addClass(
            'entryVariableListElementWorkspace'
        );
        var wrapper = Entry.createElement('div').addClass(
            'entryVariableListElementWrapperWorkspace list'
        );
        view.appendChild(wrapper);
        if (!list.object_) {
            if (list.isCloud_) view.addClass('entryListCloudElementWorkspace');
            else view.addClass('entryListGlobalElementWorkspace');
        } else view.addClass('entryListLocalElementWorkspace');

        view.bindOnClick(function(e) {
            that.select(list);
        });

        var removeButton = Entry.createElement('button').addClass(
            'entryVariableListElementDeleteWorkspace notForTextMode'
        );
        removeButton.bindOnClick(function(e) {
            e.stopPropagation();
            that.removeList(list);
            that.selectedList = null;
            that.listSettingView.addClass('entryRemove');
        });

        var editButton = Entry.createElement('button').addClass(
            'entryVariableListElementEditWorkspace'
        );
        editButton.bindOnClick(function(e) {
            e.stopPropagation();
            nameField.removeAttribute('disabled');
            editSaveButton.removeClass('entryRemove');
            this.addClass('entryRemove');
            that.updateSelectedVariable(list);
            nameField.focus();
        });
        view.editButton = editButton;

        var editSaveButton = Entry.createElement('button').addClass(
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

        var nameField = Entry.createElement('input').addClass(
            'entryVariableListElementNameWorkspace'
        );
        nameField.setAttribute('disabled', 'disabled');
        nameField.value = list.name_;
        nameField.bindOnClick(function(e) {
            e.stopPropagation();
        });
        nameField.onblur = function(e) {
            var value = this.value.trim();
            if (!value) {
                Entry.toast.alert(Lang.Msgs.warn, Lang.Msgs.list_can_not_space);
                this.value = list.getName();
                return;
            }
            that.changeListName(list, this.value);
        };
        nameField.onkeydown = function({ keyCode }) {
            if (keyCode == 13) this.blur();
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
        this.variables_.forEach((variable) => {
            mapFunction(variable, param);
        });
    };

    /**
     * @param {!function} mapFunction
     * @param {} param
     */
    p.mapList = function(mapFunction, param) {
        this.lists_.forEach((list) => {
            mapFunction(list, param);
        });
    };

    /**
     * convert this variable's data to JSON.
     * @return {JSON}
     */
    p.getVariableJSON = function() {
        return [
            ...this.variables_,
            ...this.lists_,
            Entry.engine.projectTimer,
            Entry.container.inputValue,
        ].reduce((acc, v) => {
            return v ? [...acc, v.toJSON()] : acc;
        }, []);
    };

    /**
     * convert this message's data to JSON.
     * @return {JSON}
     */
    p.getMessageJSON = function() {
        return this.messages_.reduce((acc, { id, name }) => {
            return [...acc, { id, name }];
        }, []);
    };

    /**
     * convert this function's data to JSON.
     * @return {JSON}
     */
    p.getFunctionJSON = function() {
        return _.reduce(
            this.functions_,
            (acc, { id, content }) => {
                return [
                    ...acc,
                    {
                        id,
                        content: content.stringify(),
                    },
                ];
            },
            []
        );
    };

    p.resetVariableAddPanel = function(type = 'variable') {
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
        var variableAddSpace = Entry.createElement('li').addClass(
            'entryVariableAddSpaceWorkspace entryRemove'
        );
        this.variableAddPanel.view = variableAddSpace;
        this.variableAddPanel.isOpen = false;

        var addSpaceNameWrapper = Entry.createElement('div').addClass(
            'entryVariableAddSpaceNameWrapperWorkspace'
        );
        variableAddSpace.appendChild(addSpaceNameWrapper);

        var addSpaceInput = Entry.createElement('input').addClass(
            'entryVariableAddSpaceInputWorkspace'
        );
        addSpaceInput.setAttribute(
            'placeholder',
            Lang.Workspace.Variable_placeholder_name
        );
        addSpaceInput.variableContainer = this;
        addSpaceInput.onkeypress = function({ keyCode }) {
            if (keyCode !== 13) return;

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

        var addSpaceGlobalWrapper = Entry.createElement('div').addClass(
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

        var addVariableGlobalCheck = Entry.createElement('span').addClass(
            'entryVariableAddSpaceCheckWorkspace'
        );
        this.variableAddPanel.view.globalCheck = addVariableGlobalCheck;
        if (!this.variableAddPanel.info.object)
            addVariableGlobalCheck.addClass('entryVariableAddChecked');
        addSpaceGlobalWrapper.appendChild(addVariableGlobalCheck);

        var addSpaceLocalWrapper = Entry.createElement('div').addClass(
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

        var addVariableLocalCheck = Entry.createElement('span').addClass(
            'entryVariableAddSpaceCheckWorkspace'
        );
        this.variableAddPanel.view.localCheck = addVariableLocalCheck;
        if (this.variableAddPanel.info.object)
            addVariableLocalCheck.addClass('entryVariableAddChecked');
        addSpaceLocalWrapper.appendChild(addVariableLocalCheck);

        var addSpaceCloudWrapper = Entry.createElement('div').addClass(
            'entryVariableAddSpaceCloudWrapperWorkspace'
        );
        variableAddSpace.cloudWrapper = addSpaceCloudWrapper;
        addSpaceCloudWrapper.bindOnClick(function(e) {
            var info = that.variableAddPanel.info;
            if (info.object) return;

            info.isCloud = !info.isCloud;
            that.updateVariableAddView('variable');
        });
        variableAddSpace.appendChild(addSpaceCloudWrapper);
        var addSpaceCloudSpan = Entry.createElement('span').addClass(
            'entryVariableAddSpaceCloudSpanWorkspace'
        );
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

        var addSpaceButtonWrapper = Entry.createElement('div').addClass(
            'entryVariableAddSpaceButtonWrapperWorkspace'
        );
        variableAddSpace.appendChild(addSpaceButtonWrapper);

        var addSpaceCancelButton = Entry.createElement('span').addClass(
            'entryVariableAddSpaceCancelWorkspace entryVariableAddSpaceButtonWorkspace'
        );
        addSpaceCancelButton.innerHTML = Lang.Buttons.cancel;
        addSpaceCancelButton.bindOnClick(function(e) {
            that.variableAddPanel.view.addClass('entryRemove');
            that.resetVariableAddPanel('variable');
        });
        addSpaceButtonWrapper.appendChild(addSpaceCancelButton);

        var addSpaceConfirmButton = Entry.createElement('span').addClass(
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
        Entry.do(
            'variableContainerAddVariable',
            new Entry.Variable(this._makeVariableData())
        );
        var [variable] = this.variables_;
        this.updateSelectedVariable(variable);
        var { editButton, editSaveButton, nameField } = variable.listElement;
        editButton.addClass('entryRemove');
        editSaveButton.removeClass('entryRemove');
        nameField.removeAttribute('disabled');
    };

    p._addList = function() {
        this.addList();
        var [list] = this.lists_;
        this.updateSelectedVariable(list);
        var { editButton, editSaveButton, nameField } = list.listElement;
        editButton.addClass('entryRemove');
        editSaveButton.removeClass('entryRemove');
        nameField.removeAttribute('disabled');
    };

    p.generateListAddView = function() {
        var that = this;
        var listAddSpace = Entry.createElement('li').addClass(
            'entryVariableAddSpaceWorkspace entryRemove'
        );
        this.listAddPanel.view = listAddSpace;
        this.listAddPanel.isOpen = false;

        var addSpaceNameWrapper = Entry.createElement('div');
        addSpaceNameWrapper.addClass(
            'entryVariableAddSpaceNameWrapperWorkspace entryListAddSpaceNameWrapperWorkspace'
        );
        listAddSpace.appendChild(addSpaceNameWrapper);

        var addSpaceInput = Entry.createElement('input').addClass(
            'entryVariableAddSpaceInputWorkspace'
        );
        addSpaceInput.setAttribute('placeholder', Lang.Workspace.list_name);
        this.listAddPanel.view.name = addSpaceInput;
        addSpaceInput.variableContainer = this;
        addSpaceInput.onkeypress = function({ keyCode }) {
            if (keyCode !== 13) return;
            that._addList();
        };
        addSpaceNameWrapper.appendChild(addSpaceInput);

        var addSpaceGlobalWrapper = Entry.createElement('div').addClass(
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

        var addListGlobalCheck = Entry.createElement('span').addClass(
            'entryVariableAddSpaceCheckWorkspace'
        );
        this.listAddPanel.view.globalCheck = addListGlobalCheck;
        if (!this.listAddPanel.info.object)
            addListGlobalCheck.addClass('entryVariableAddChecked');
        addSpaceGlobalWrapper.appendChild(addListGlobalCheck);

        var addSpaceLocalWrapper = Entry.createElement('div').addClass(
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

        var addListLocalCheck = Entry.createElement('span').addClass(
            'entryVariableAddSpaceCheckWorkspace'
        );
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

        var addSpaceButtonWrapper = Entry.createElement('div').addClass(
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

        var addSpaceConfirmButton = Entry.createElement('span').addClass(
            'entryVariableAddSpaceConfirmWorkspace entryVariableAddSpaceButtonWorkspace'
        );
        addSpaceConfirmButton.innerHTML = Lang.Buttons.save;
        addSpaceConfirmButton.variableContainer = this;
        addSpaceConfirmButton.bindOnClick(function(e) {
            that.addList();
            var list = that.lists_[0];
            that.updateSelectedVariable(list);
            var { editButton, editSaveButton, nameField } = list.listElement;
            editButton.addClass('entryRemove');
            editSaveButton.removeClass('entryRemove');
            nameField.removeAttribute('disabled');
        });
        addSpaceButtonWrapper.appendChild(addSpaceConfirmButton);
    };

    p.generateVariableSplitterView = function() {
        this.variableSplitters = {
            top: Entry.createElement('li').addClass(
                'entryVariableSplitterWorkspace'
            ),
            bottom: Entry.createElement('li').addClass(
                'entryVariableSplitterWorkspace'
            ),
        };
    };

    p.openVariableAddPanel = function(type = 'variable') {
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
            timer = new Entry.Variable({
                id: Entry.generateHash(),
                name: Lang.Workspace.Variable_Timer,
                value: 0,
                variableType: 'timer',
                visible: false,
                x: 150,
                y: -70,
            });
        }

        timer.generateView();
        timer.tick = null;
        Entry.engine.projectTimer = timer;

        Entry.addEventListener('stop', () => {
            Entry.engine.stopProjectTimer();
        });
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

        var visibleWrapper = Entry.createElement('div').addClass(
            'entryVariableSettingVisibleWrapperWorkspace'
        );
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
        var visibleCheck = Entry.createElement('span').addClass(
            'entryVariableSettingCheckWorkspace'
        );
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
        var initValueInput = Entry.createElement('input').addClass(
            'entryVariableSettingInitValueInputWorkspace'
        );
        element.initValueInput = initValueInput;
        initValueInput.value = 0;
        initValueInput.onkeyup = function(e) {
            var v = that.selectedVariable;
            v.setValue(this.value);
        };
        initValueInput.onblur = function(e) {
            var v = that.selectedVariable;
            v.setValue(this.value);
        };
        element.initValueInput = initValueInput;
        initValueWrapper.appendChild(initValueInput);

        var splitter = Entry.createElement('div').addClass(
            'entryVariableSettingSplitterWorkspace'
        );
        element.appendChild(splitter);

        var slideWrapper = Entry.createElement('div').addClass(
            'entryVariableSettingSlideWrapperWorkspace'
        );
        element.appendChild(slideWrapper);
        var slideSpan = Entry.createElement('span');
        slideSpan.innerHTML = Lang.Workspace.slide;
        slideWrapper.appendChild(slideSpan);
        var slideCheck = Entry.createElement('span').addClass(
            'entryVariableSettingCheckWorkspace'
        );
        element.slideCheck = slideCheck;
        slideWrapper.appendChild(slideCheck);
        slideWrapper.bindOnClick(function(e) {
            var newVariable;
            var v = that.selectedVariable;
            var variables = that.variables_;
            var type = v.getType();
            var variableJSON = v.toJSON();
            if (type == 'variable') {
                variableJSON.variableType = 'slide';
                newVariable = new Entry.Variable(variableJSON);
                variables.splice(variables.indexOf(v), 0, newVariable);
                if (newVariable.getValue() < 0) newVariable.setValue(0);
                if (newVariable.getValue() > 100) newVariable.setValue(100);
                minValueInput.removeAttribute('disabled');
                maxValueInput.removeAttribute('disabled');
            } else if (type == 'slide') {
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

        var minMaxWrapper = Entry.createElement('div').addClass(
            'entryVariableSettingMinMaxWrapperWorkspace'
        );
        element.minMaxWrapper = minMaxWrapper;
        element.appendChild(minMaxWrapper);
        var minValueSpan = Entry.createElement('span');
        minValueSpan.innerHTML = Lang.Workspace.min_value;
        minMaxWrapper.appendChild(minValueSpan);
        var minValueInput = Entry.createElement('input').addClass(
            'entryVariableSettingMinValueInputWorkspace'
        );
        var v = that.selectedVariable;
        if (v && v.type == 'slide') minValueInput.value = v.minValue_;
        else minValueInput.value = 0;
        minValueInput.onkeypress = function({ keyCode }) {
            keyCode === 13 && this.blur();
        };
        minValueInput.onblur = function(e) {
            var value = this.value;
            if (Entry.Utils.isNumber(value)) {
                var v = that.selectedVariable;
                v.setMinValue(value);
                that.updateVariableSettingView(v);
            }
        };
        element.minValueInput = minValueInput;
        minMaxWrapper.appendChild(minValueInput);

        var maxValueSpan = Entry.createElement('span').addClass(
            'entryVariableSettingMaxValueSpanWorkspace'
        );
        maxValueSpan.innerHTML = Lang.Workspace.max_value;
        minMaxWrapper.appendChild(maxValueSpan);
        var maxValueInput = Entry.createElement('input').addClass(
            'entryVariableSettingMaxValueInputWorkspace'
        );
        if (v && v.type == 'slide') maxValueInput.value = v.maxValue_;
        else maxValueInput.value = 100;
        maxValueInput.onkeypress = function({ keyCode }) {
            keyCode === 13 && this.blur();
        };
        maxValueInput.onblur = function(e) {
            var value = this.value;
            if (Entry.Utils.isNumber(value)) {
                var v = that.selectedVariable;
                v.setMaxValue(value);
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
        var view = this.variableSettingView;
        var {
            visibleCheck,
            initValueInput: initValue,
            slideCheck: slide,
            minValueInput: minValue,
            maxValueInput: maxValue,
            minMaxWrapper,
        } = view;

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
        var visibleCheck = Entry.createElement('span').addClass(
            'entryListSettingCheckWorkspace'
        );
        element.visibleCheck = visibleCheck;
        visibleWrapper.appendChild(visibleCheck);

        var lengthWrapper = Entry.createElement('div').addClass(
            'entryListSettingLengthWrapperWorkspace'
        );
        var lengthSpan = Entry.createElement('span').addClass(
            'entryListSettingLengthSpanWorkspace'
        );
        lengthSpan.innerHTML = Lang.Workspace.number_of_list;
        lengthWrapper.appendChild(lengthSpan);
        element.appendChild(lengthWrapper);
        var lengthController = Entry.createElement('div').addClass(
            'entryListSettingLengthControllerWorkspace'
        );
        lengthWrapper.appendChild(lengthController);
        var minus = Entry.createElement('span').addClass(
            'entryListSettingMinusWorkspace'
        );
        minus.bindOnClick(function(e) {
            var { selectedList: v } = that;
            v.array_.pop();
            that.updateListSettingView(v);
        });
        lengthController.appendChild(minus);
        var lengthInput = Entry.createElement('input').addClass(
            'entryListSettingLengthInputWorkspace'
        );
        lengthInput.onblur = function() {
            that.setListLength(this.value);
        };

        lengthInput.onkeypress = function({ keyCode }) {
            if (keyCode == 13) this.blur();
        };
        element.lengthInput = lengthInput;
        lengthController.appendChild(lengthInput);
        var plus = Entry.createElement('span').addClass(
            'entryListSettingPlusWorkspace'
        );
        plus.bindOnClick(function(e) {
            var { selectedList: v } = that;
            v.array_.push({ data: 0 });
            that.updateListSettingView(v);
        });
        lengthController.appendChild(plus);
        var seperator = Entry.createElement('div').addClass(
            'entryListSettingSeperatorWorkspace'
        );
        element.seperator = seperator;
        element.appendChild(seperator);

        var listValues = Entry.createElement('div').addClass(
            'entryListSettingListValuesWorkspace'
        );
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

        var startIndex =
            Entry.playground.mainWorkspace.mode ===
            Entry.Workspace.MODE_VIMBOARD
                ? 0
                : 1;

        arr.forEach((item, i) => {
            var wrapper = Entry.createElement('div');
            wrapper.addClass('entryListSettingValueWrapperWorkspace');
            var numberSpan = Entry.createElement('span').addClass(
                'entryListSettingValueNumberSpanWorkspace'
            );
            numberSpan.innerHTML = i + startIndex;
            wrapper.appendChild(numberSpan);
            var input = Entry.createElement('input');
            input.value = item.data;
            input.onblur = function() {
                item.data = this.value;
                list.updateView();
            };
            input.onkeypress = function({ keyCode }) {
                if (keyCode == 13) this.blur();
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
        });

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
        [...this.variables_, ...this.lists_].forEach((v) => {
            v.updateView();
        });
    };

    p.updateSelectedVariable = function(object, type = 'variable') {
        if (!object) {
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
        if (!objectId) {
            return;
        }

        [...this.variables_].forEach((v) => {
            if (v.object_ == objectId) {
                this.removeVariable(v);
            }
        });
    };

    p.updateCloudVariables = function() {
        var projectId = Entry.projectId;
        if (!Entry.cloudSavable || !projectId) return;

        var { variables_, lists_ } = Entry.variableContainer;
        var variables = variables_
            .filter(function({ isCloud_ }) {
                return isCloud_;
            })
            .map(function(v) {
                return v.toJSON();
            });

        var lists = lists_
            .filter(function({ isCloud_ }) {
                return isCloud_;
            })
            .map(function(v) {
                return v.toJSON();
            });

        if (!variables.length && !lists.length) return;

        $.ajax({
            url: '/api/project/variable/' + Entry.projectId,
            type: 'PUT',
            data: {
                variables,
                lists,
            },
        });
    };

    p.addRef = function(type, blockData) {
        if (
            !this.view_ ||
            !Entry.getMainWS() ||
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
                isMessage = _.contains(EntryStatic.messageBlockList, type);
                isVariable = _.contains(EntryStatic.variableBlockList, type);
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
                    if (block.type.indexOf('func_') > -1) {
                        var funcId = block.type.substr(5);
                        if (funcId == id) continue;
                    }

                    var events = block.events;
                    if (events) {
                        if (events.viewDestroy) {
                            events.viewDestroy.forEach((fn) => {
                                if (fn) fn(block);
                            });
                        }

                        if (events.dataDestroy) {
                            events.dataDestroy.forEach((fn) => {
                                if (fn) fn(block);
                            });
                        }
                    }
                }
            }
        }
    };

    p._getBlockMenu = function() {
        return Entry.getMainWS() && Entry.getMainWS().getBlockMenu();
    };

    p._truncName = function(name, type) {
        Entry.toast.warning(
            Lang.Workspace[type + '_name_auto_edited_title'],
            Lang.Workspace[type + '_name_auto_edited_content']
        );

        return name.substring(0, this._maxNameLength);
    };

    p._maxNameLength = 10;

    p.clear = function() {
        [...this.variables_, ...this.lists_].forEach((v) => {
            v.remove();
        });

        var { engine, container, playground } = Entry;

        engine && engine.projectTimer && engine.projectTimer.remove();

        if (container && container.inputValue) {
            container.inputValue.remove && container.inputValue.remove();
        }

        this.variables_ = [];
        this.lists_ = [];
        this.messages_ = [];

        for (var key in this.functions_) {
            var func = this.functions_[key];
            func.destroy();
            delete this.functions_[key];
        }

        playground.reloadPlayground();
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
                case 'functionAddButton':
                    return this.functionAddButton_;
                case 'variableAddButton':
                    return this.variableAddButton_;
                case 'variableAddConfirmButton':
                    return this.variableAddConfirmButton;
                case 'variableAddInput':
                    return this.variableAddPanel.view.name;
                case 'messageAddButton':
                    return this.messageAddButton_;
                case 'messageList':
                    return this.getMessage(query.shift()).listElement.nameField;
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
                Entry.do(
                    'variableContainerAddVariable',
                    new Entry.Variable(this._makeVariableData())
                );
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
        var { variable, message, list, func } = this._filterTabs;

        process(variable, Entry.variableEnable);
        process(message, Entry.messageEnable);
        process(list, Entry.listEnable);
        process(func, Entry.functionEnable);

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
