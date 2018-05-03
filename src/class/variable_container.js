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

        $(listView).on(
            'mouseenter',
            '.entryVariableListElementWorkspace',
            function() {
                this.addClass('active');
            }
        );

        $(listView).on(
            'mouseleave',
            '.entryVariableListElementWorkspace',
            function() {
                this.removeClass('active');
            }
        );

        this.view_.appendChild(listView);
        this.listView_ = listView;

        var variableAddButton = Entry.createElement('li')
            .addClass('entryVariableAddWorkspace')
            .addClass('entryVariableListElementWorkspace')
            .bindOnClick((e) => {
                Entry.do('variableContainerClickVariableAddButton');
            });
        variableAddButton.innerHTML = '+ ' + Lang.Workspace.variable_add;
        var thisPointer = this;
        this.variableAddButton_ = variableAddButton;

        this.generateVariableAddView();
        this.generateListAddView();
        this.generateVariableSplitterView();
        this.generateVariableSettingView();
        this.generateListSettingView();

        var messageAddButton = Entry.createElement('li')
            .addClass('entryVariableAddWorkspace')
            .addClass('entryVariableListElementWorkspace')
            .bindOnClick((e) => {
                Entry.do('variableContainerAddMessage', {
                    id: Entry.generateHash(),
                    name: Entry.getOrderedName(
                        Lang.Workspace.message + ' ',
                        this.messages_,
                        'name'
                    ),
                });
            });
        messageAddButton.innerHTML = '+ ' + Lang.Workspace.message_create;
        this.messageAddButton_ = messageAddButton;

        var listAddButton = Entry.createElement('li')
            .addClass('entryVariableAddWorkspace')
            .addClass('entryVariableListElementWorkspace')
            .bindOnClick(() => Entry.do('variableContainerClickListAddButton'));

        listAddButton.innerHTML = '+ ' + Lang.Workspace.list_create;
        this.listAddButton_ = listAddButton;
        var functionAddButton = Entry.createElement('li')
            .addClass('entryVariableListElementWorkspace')
            .addClass('entryVariableAddWorkspace')
            .bindOnClick(() =>
                Entry.do('funcCreateStart', Entry.generateHash())
            );
        functionAddButton.innerHTML = '+ ' + Lang.Workspace.function_add;
        this.functionAddButton_ = functionAddButton;

        return view;
    };

    /**
     * @param {String} type
     * @param {?Boolean} isEnable
     */
    p.createSelectButton = function(type, isEnable = true) {
        var view = Entry.createElement('td')
            .addClass('entryVariableSelectButtonWorkspace', type)
            .bindOnClick(() =>
                Entry.do('variableContainerSelectFilter', type, this.viewMode_)
            );
        view.innerHTML = Lang.Workspace[type];

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
        var { info: { isCloud, object }, view, isOpen } = this._getAddPanel(
            type
        );
        view.addClass('entryRemove');
        view.cloudCheck.removeClass('entryVariableAddChecked');
        view.localCheck.removeClass('entryVariableAddChecked');
        view.globalCheck.removeClass('entryVariableAddChecked');
        view.cloudWrapper.removeClass(
            'entryVariableAddSpaceUnCheckedWorkspace'
        );
        if (isCloud) view.cloudCheck.addClass('entryVariableAddChecked');
        if (isOpen) {
            view.removeClass('entryRemove');
        }
        if (object) {
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
                'entryVariableListCallerWorkspace',
                'entryVariableListCallerNoneWorkspace'
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
        var listView = this.listView_;
        if (
            !listView ||
            !/^(variable|code)$/.test(_.result(Entry.playground, 'getViewMode'))
        )
            return;

        this.variableSettingView.addClass('entryRemove');
        this.listSettingView.addClass('entryRemove');

        var isPythonMode = this._isPythonMode();
        if (isPythonMode) listView.addClass('entryVariableContainerTextMode');
        else listView.removeClass('entryVariableContainerTextMode');

        while (listView.firstChild) listView.removeChild(listView.lastChild);

        var viewMode = this.viewMode_;

        if (viewMode == 'all' || viewMode == 'message') {
            if (viewMode == 'message') {
                listView.appendChild(this.messageAddButton_);
            }

            _each(this.messages_, this.createMessageView.bind(this));
        }

        if (viewMode == 'all' || viewMode == 'variable') {
            if (viewMode == 'variable') {
                var info = this.variableAddPanel.info;
                if (info.object && !Entry.playground.object) info.object = null;

                listView.appendChild(this.variableAddButton_);
                listView.appendChild(this.variableAddPanel.view);

                this.variableSplitters.top.innerHTML =
                    Lang.Workspace.Variable_used_at_all_objects;
                listView.appendChild(this.variableSplitters.top);

                var { globalV, localV } = _.groupBy(
                    this.variables_,
                    ({ object_ }) => (object_ ? 'localV' : 'globalV')
                );

                _each(globalV, this.createVariableView.bind(this));

                this.variableSplitters.bottom.innerHTML =
                    Lang.Workspace.Variable_used_at_special_object;
                listView.appendChild(this.variableSplitters.bottom);

                _each(localV, this.createVariableView.bind(this));

                this.updateVariableAddView('variable');
            } else {
                _each(this.variables_, this.createVariableView.bind(this));
            }
        }

        if (viewMode == 'all' || viewMode == 'list') {
            if (viewMode == 'list') {
                var info = this.listAddPanel.info;
                if (info.object && !Entry.playground.object) info.object = null;
                listView.appendChild(this.listAddButton_);
                listView.appendChild(this.listAddPanel.view);

                var { localV, globalV } = _.groupBy(
                    this.lists_,
                    ({ object_ }) => (object_ ? 'localV' : 'globalV')
                );
                this.variableSplitters.top.innerHTML =
                    Lang.Workspace.List_used_all_objects;
                listView.appendChild(this.variableSplitters.top);

                _each(globalV, this.createListView.bind(this));

                this.updateVariableAddView('list');
                this.variableSplitters.bottom.innerHTML =
                    Lang.Workspace.list_used_specific_objects;
                listView.appendChild(this.variableSplitters.bottom);

                _each(localV, this.createListView.bind(this));

                this.updateVariableAddView('variable');
            } else {
                _each(this.lists_, this.createListView.bind(this));
            }
        }

        if (viewMode == 'all' || viewMode == 'func') {
            if (viewMode == 'func') {
                var mode = _.result(Entry.getMainWS(), 'getMode');
                mode = _.isUndefined(mode) ? Entry.Workspace.MODE_BOARD : mode;

                mode = mode === Entry.Workspace.MODE_OVERLAYBOARD;

                if (mode || isPythonMode) {
                    this.functionAddButton_.addClass('disable');
                } else {
                    this.functionAddButton_.removeClass('disable');
                }

                listView.appendChild(this.functionAddButton_);
            }

            _each(this.functions_, this.createFunctionView.bind(this));
        }

        listView.appendChild(this.variableSettingView);
        listView.appendChild(this.listSettingView);

        function _each(arr, viewFunc) {
            return _.each(arr, (data) => {
                !data.listElement && viewFunc(data);

                listView.appendChild(data.listElement);
                if (data.callerListElement)
                    listView.appendChild(data.callerListElement);
            });
        }
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

        if (_.isEmpty(Entry.engine.projectTimer))
            Entry.variableContainer.generateTimer();
        if (_.isEmpty(Entry.container.inputValue))
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
        return info.reduce((acc, { name }) => (acc += name), '');
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
    p.getList = function(listId, { isClone, lists } = {}) {
        const criteria = { id_: listId };
        var list = _.findWhere(this.lists_, criteria);
        if (isClone && list.object_) {
            list = _.findWhere(lists, criteria);
        }

        return list;
    };

    /**
     * Create function
     */
    p.createFunction = function(data) {
        if (Entry.Func.isEdit) return;
        Entry.Func.edit(new Entry.Func(data));
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
        var className = '';
        className += 'entryVariableListElementWorkspace';
        className += ' entryFunctionElementWorkspace';
        className += ' function';
        var view = Entry.createElement('li')
            .addClass(className)
            .bindOnClick(function(e) {
                e.stopPropagation();
                that.select(func);
            });

        var removeButton = Entry.createElement('button')
            .addClass('entryVariableListElementDeleteWorkspace')
            .bindOnClick(function(e) {
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

        var blockMenu = this._getBlockMenu();
        var editButton = Entry.createElement('button')
            .addClass('entryVariableListElementEditWorkspace notForTextMode')
            .bindOnClick(function(e) {
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

    function _addVariableOrList(type, data) {
        if (!type) {
            return;
        }
        var panel = this._getAddPanel(type);
        var panelView = panel.view;
        var name = panel.view.name.value.trim();
        panelView.addClass('entryRemove');

        if (Entry.isTextMode) {
            var alert_msg = Entry.TextCodingUtil.isNameIncludeSpace(name, type);
            if (alert_msg) {
                entrylms.alert(alert_msg);
                this.resetVariableAddPanel(type);
                return;
            }
        }

        var variableContainer = this;
        var target = `${type}s_`;

        data = data || this._makeVariableData(type);

        this.resetVariableAddPanel(type);

        if (!(data instanceof Entry.Variable)) {
            data = new Entry.Variable(data);
        }

        if (type === 'variable') {
            this.createVariableView(data);
        } else {
            this.createListView(data);
        }

        data.generateView(this[target].length);

        this[target].unshift(data);

        var playground = Entry.playground;

        if (playground) {
            var { blockMenu } = playground;
            if (blockMenu) blockMenu.deleteRendered('variable');
            playground.reloadPlayground();
        }

        this.updateList();
    }

    p.addVariable = function(variable) {
        _addVariableOrList.call(this, 'variable', variable);
    };

    /**
     * Remove variable
     * @param {Entry.Variable} variable
     */
    p.removeVariable = function(variable) {
        if (!(variable instanceof Entry.Variable)) {
            variable = this.getVariable(variable.id);
        }

        if (this.selected == variable) {
            this.select(null);
        }
        variable.remove();
        var variables = this.variables_;
        variables.splice(variables.indexOf(variable), 1);
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
        variable.listElement.nameField.value = name;
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
        if (!(list instanceof Entry.Variable)) {
            list = this.getList(list.id);
        }

        if (this.selected == list) {
            this.select(null);
        }
        list.remove();
        var lists = this.lists_;
        lists.splice(lists.indexOf(list), 1);
        Entry.playground.reloadPlayground();
        this.updateList();
    };

    /**
     * @param {Entry.Variable} variable
     */
    p.createVariableView = function(variable) {
        var that = this;
        var view = Entry.createElement('li');

        var wrapper = Entry.createElement('div')
            .addClass('entryVariableListElementWrapperWorkspace', 'variable')
            .appendTo(view);

        var className = 'entryVariableListElementWorkspace';
        if (!variable.object_) {
            if (variable.isCloud_)
                className += ' entryVariableCloudElementWorkspace';
            else className += ' entryVariableGlobalElementWorkspace';
        } else className += ' entryVariableLocalElementWorkspace';

        view.addClass(className).bindOnClick((e) => this.select(variable));

        this._removeButton = view.removeButton = Entry.createElement('button')
            .addClass('entryVariableListElementDeleteWorkspace notForTextMode')
            .bindOnClick((e) => {
                e.stopPropagation();
                Entry.do('variableContainerRemoveVariable', variable);
                this.selectedVariable = null;
                this.variableSettingView.addClass('entryRemove');
            })
            .appendTo(wrapper);

        view.editButton = Entry.createElement('button')
            .addClass('entryVariableListElementEditWorkspace')
            .bindOnClick((e) => {
                e.stopPropagation();
                Entry.do(
                    'setVariableEditable',
                    variable.id_,
                    this.selectedVariable !== variable
                );
            })
            .appendTo(wrapper);

        var nameField = Entry.createElement('input')
            .addClass('entryVariableListElementNameWorkspace')
            .bindOnClick((e) => e.stopPropagation())
            .appendTo(wrapper);
        nameField.setAttribute('disabled', 'disabled');
        nameField.value = variable.name_;
        nameField.onfocus = Entry.Utils.setFocused;
        nameField.onblur = Entry.Utils.setBlurredTimer(function() {
            var value = this.value.trim();
            if (!value) {
                Entry.toast.alert(
                    Lang.Msgs.warn,
                    Lang.Workspace.variable_can_not_space
                );
                this.value = variable.getName();
                return this.focus();
            }

            variable = that.getVariable(variable.id_);
            variable && Entry.do('variableSetName', variable.id_, value);
        });
        nameField.onkeydown = Entry.Utils.blurWhenEnter;
        view.nameField = nameField;
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
        Entry.Utils.focusIfNotActive(nameField);
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
        var messages_ = this.messages_;
        messages_.splice(messages_.indexOf(message), 1);
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
        $(message.listElement)
            .find('.entryVariableListElementNameWorkspace')
            .removeAttr('disabled')
            .focus();
    };

    /**
     * @param {object} message
     */
    p.createMessageView = function(message) {
        var view = Entry.createElement('li')
            .addClass('entryVariableListElementWorkspace')
            .addClass('entryMessageElementWorkspace')
            .bindOnClick(() => this.select(message));

        var removeButton = Entry.createElement('button')
            .addClass('entryVariableListElementDeleteWorkspace')
            .bindOnClick((e) => {
                e.stopPropagation();
                Entry.do('variableContainerRemoveMessage', message);
            })
            .appendTo(view);

        var editButton = Entry.createElement('button')
            .addClass('entryVariableListElementEditWorkspace editButton')
            .bindOnClick((e) => {
                e.stopPropagation();
                Entry.do('setMessageEditable', message.id);
            })
            .appendTo(view);

        var nameField = Entry.createElement('input')
            .addClass('entryVariableListElementNameWorkspace')
            .bindOnClick((e) => e.stopPropagation())
            .appendTo(view);
        nameField.value = message.name;
        nameField.onfocus = Entry.Utils.setFocused;
        nameField.onblur = Entry.Utils.setBlurredTimer(function(e) {
            var value = this.value;
            if (!value.trim()) {
                Entry.toast.alert(Lang.Msgs.warn, Lang.Msgs.sign_can_not_space);
                this.value = message.name;
                return this.focus();
            }

            //check message exist currently
            message = Entry.variableContainer.getMessage(message.id);
            if (message && !(this.isFirst && value === message.name)) {
                Entry.do('messageSetName', message.id, value);
            }
            delete this.isFirst;
            nameField.setAttribute('disabled', 'disabled');
        }, 200);
        nameField.onkeydown = Entry.Utils.blurWhenEnter;

        view.nameField = nameField;
        message.listElement = view;
    };

    /**
     * Add list for block
     * @param {list model} list
     * @return {boolean} return true when success
     */
    p.addList = function(list) {
        _addVariableOrList.call(this, 'list', list);
    };

    /**
     * @param {Entry.Variable} list
     */
    p.createListView = function(list) {
        var CE = Entry.createElement;
        var that = this;
        var view = CE('li')
            .addClass('entryVariableListElementWorkspace')
            .bindOnClick(() => that.select(list));

        var wrapper = CE('div')
            .addClass('entryVariableListElementWrapperWorkspace list')
            .appendTo(view);
        if (!list.object_) {
            if (list.isCloud_) view.addClass('entryListCloudElementWorkspace');
            else view.addClass('entryListGlobalElementWorkspace');
        } else view.addClass('entryListLocalElementWorkspace');

        var removeButton = CE('button')
            .addClass('entryVariableListElementDeleteWorkspace notForTextMode')
            .bindOnClick((e) => {
                e.stopPropagation();
                Entry.do('variableContainerRemoveList', list);
                that.selectedList = null;
                that.listSettingView.addClass('entryRemove');
            })
            .appendTo(wrapper);

        var editButton = CE('button')
            .addClass('entryVariableListElementEditWorkspace')
            .bindOnClick(function(e) {
                e.stopPropagation();

                if (that.selectedList === list) {
                    nameField.blur();
                    nameField.setAttribute('disabled', 'disabled');
                    that.select(list);
                    that.updateSelectedVariable(null, 'list');
                } else {
                    Entry.do('setListEditable', list.id_);
                }
            })
            .appendTo(wrapper);
        view.editButton = editButton;

        var nameField = CE('input')
            .addClass('entryVariableListElementNameWorkspace')
            .bindOnClick((e) => e.stopPropagation())
            .appendTo(wrapper);
        nameField.setAttribute('disabled', 'disabled');
        nameField.value = list.name_;
        nameField.onblur = function(e) {
            var value = this.value.trim();
            if (!value) {
                Entry.toast.alert(Lang.Msgs.warn, Lang.Msgs.list_can_not_space);
                this.value = list.getName();
                return;
            }
            that.changeListName(list, this.value);
        };
        nameField.onkeydown = Entry.Utils.blurWhenEnter;
        view.nameField = nameField;
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
        return this.messages_.map(({ id, name }) => {
            return { id, name };
        });
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
        var panel = this._getAddPanel(type);
        if (!panel.view) return;
        var info = panel.info;
        info.isCloud = false;
        info.object = null;
        panel.view.name.value = '';
        panel.isOpen = false;
        this.updateVariableAddView(type);
    };

    p.generateVariableAddView = function() {
        var CE = Entry.createElement; //alias
        var _whenEnter = Entry.Utils.whenEnter;

        var that = this;

        var variableAddSpace = CE('li').addClass(
            'entryVariableAddSpaceWorkspace entryRemove'
        );
        this.variableAddPanel.view = variableAddSpace;
        this.variableAddPanel.isOpen = false;

        var addSpaceNameWrapper = CE('div').addClass(
            'entryVariableAddSpaceNameWrapperWorkspace'
        );
        variableAddSpace.appendChild(addSpaceNameWrapper);

        var addSpaceInput = CE('input').addClass(
            'entryVariableAddSpaceInputWorkspace'
        );
        addSpaceInput.setAttribute(
            'placeholder',
            Lang.Workspace.Variable_placeholder_name
        );
        addSpaceInput.variableContainer = this;
        addSpaceInput.onkeypress = _whenEnter(function() {
            if (this.enterKeyDisabled) this.blur();
            else that._addVariable();
        });
        addSpaceInput.onfocus = function() {
            this.blurred = false;
        };

        addSpaceInput.onblur = function(e) {
            if (!this.value || this.blurred) return;
            Entry.do('variableAddSetName', $(this).val());
            this.blurred = true;
        };

        this.variableAddPanel.view.name = addSpaceInput;
        addSpaceNameWrapper.appendChild(addSpaceInput);

        var addSpaceGlobalWrapper = CE('div')
            .addClass('entryVariableAddSpaceGlobalWrapperWorkspace')
            .bindOnClick(() => Entry.do('variableAddSetScope', 'global'));
        variableAddSpace.appendChild(addSpaceGlobalWrapper);

        var addVariableGlobalSpan = CE('span');
        addVariableGlobalSpan.innerHTML =
            Lang.Workspace.Variable_use_all_objects;
        addSpaceGlobalWrapper.appendChild(addVariableGlobalSpan);

        var addVariableGlobalCheck = CE('span').addClass(
            'entryVariableAddSpaceCheckWorkspace'
        );
        this.variableAddPanel.view.globalCheck = addVariableGlobalCheck;
        if (!this.variableAddPanel.info.object)
            addVariableGlobalCheck.addClass('entryVariableAddChecked');
        addSpaceGlobalWrapper.appendChild(addVariableGlobalCheck);

        var addSpaceLocalWrapper = CE('div')
            .addClass('entryVariableAddSpaceLocalWrapperWorkspace')
            .bindOnClick(() => Entry.do('variableAddSetScope', 'local'));
        variableAddSpace.appendChild(addSpaceLocalWrapper);
        var addVariableLocalSpan = CE('span');
        addVariableLocalSpan.innerHTML =
            Lang.Workspace.Variable_use_this_object;
        addSpaceLocalWrapper.appendChild(addVariableLocalSpan);

        var addVariableLocalCheck = CE('span').addClass(
            'entryVariableAddSpaceCheckWorkspace'
        );
        this.variableAddPanel.view.localCheck = addVariableLocalCheck;
        if (this.variableAddPanel.info.object)
            addVariableLocalCheck.addClass('entryVariableAddChecked');
        addSpaceLocalWrapper.appendChild(addVariableLocalCheck);

        var addSpaceCloudWrapper = CE('div')
            .addClass('entryVariableAddSpaceCloudWrapperWorkspace')
            .bindOnClick(() => {
                var { object, isCloud } = this.variableAddPanel.info;
                !object && Entry.do('variableAddSetCloud', !isCloud);
            });
        variableAddSpace.cloudWrapper = addSpaceCloudWrapper;
        variableAddSpace.appendChild(addSpaceCloudWrapper);
        var addSpaceCloudSpan = CE('span').addClass(
            'entryVariableAddSpaceCloudSpanWorkspace'
        );
        addSpaceCloudSpan.innerHTML = Lang.Workspace.Variable_create_cloud;
        addSpaceCloudWrapper.appendChild(addSpaceCloudSpan);
        var addVariableCloudCheck = CE('span').addClass(
            'entryVariableAddSpaceCheckWorkspace',
            'entryVariableAddSpaceCloudCheckWorkspace'
        );
        this.variableAddPanel.view.cloudCheck = addVariableCloudCheck;
        if (this.variableAddPanel.info.isCloud)
            addVariableCloudCheck.addClass('entryVariableAddChecked');

        addSpaceCloudWrapper.appendChild(addVariableCloudCheck);

        var addSpaceButtonWrapper = CE('div').addClass(
            'entryVariableAddSpaceButtonWrapperWorkspace'
        );
        variableAddSpace.appendChild(addSpaceButtonWrapper);

        var addSpaceCancelButton = CE('span')
            .addClass('entryVariableAddSpaceCancelWorkspace')
            .addClass('entryVariableAddSpaceButtonWorkspace')
            .bindOnClick(() => {
                that._getAddPanel().view.addClass('entryRemove');
                that.resetVariableAddPanel('variable');
            });
        addSpaceCancelButton.innerHTML = Lang.Buttons.cancel;
        addSpaceButtonWrapper.appendChild(addSpaceCancelButton);

        var addSpaceConfirmButton = CE('span')
            .addClass('entryVariableAddSpaceConfirmWorkspace')
            .addClass('entryVariableAddSpaceButtonWorkspace')
            .bindOnClick(() => that._addVariable());
        addSpaceConfirmButton.innerHTML = Lang.Buttons.save;
        addSpaceConfirmButton.variableContainer = this;
        addSpaceButtonWrapper.appendChild(addSpaceConfirmButton);
        this.variableAddConfirmButton = addSpaceConfirmButton;
    };

    p._addVariable = function() {
        $('.entryVariableAddSpaceInputWorkspace').blur();
        Entry.do(
            'variableContainerAddVariable',
            new Entry.Variable(this._makeVariableData('variable'))
        );
        var [variable] = this.variables_;
        this.updateSelectedVariable(variable);
        var { editButton, nameField } = variable.listElement;
        nameField.removeAttribute('disabled');
    };

    p._addList = function() {
        Entry.getDom(['variableContainer', 'listAddInput']).blur();
        Entry.do(
            'variableContainerAddList',
            new Entry.Variable(this._makeVariableData('list'))
        );
        var [list] = this.lists_;
        this.updateSelectedVariable(list);
        var { editButton, nameField } = list.listElement;
        nameField.removeAttribute('disabled');
    };

    p.generateListAddView = function() {
        var CE = Entry.createElement;
        var that = this;

        var _setFocused = Entry.Utils.setFocused;
        var _setBlurredTimer = Entry.Utils.setBlurredTimer;

        var listAddSpace = CE('li')
            .addClass('entryVariableAddSpaceWorkspace')
            .addClass('entryRemove');
        this.listAddPanel.view = listAddSpace;
        this.listAddPanel.isOpen = false;

        var addSpaceNameWrapper = CE('div')
            .addClass('entryVariableAddSpaceNameWrapperWorkspace')
            .addClass('entryListAddSpaceNameWrapperWorkspace');
        listAddSpace.appendChild(addSpaceNameWrapper);

        var addSpaceInput = CE('input').addClass(
            'entryVariableAddSpaceInputWorkspace'
        );
        addSpaceInput.setAttribute('placeholder', Lang.Workspace.list_name);
        this.listAddPanel.view.name = addSpaceInput;
        addSpaceInput.variableContainer = this;

        addSpaceInput.onkeypress = Entry.Utils.whenEnter(function() {
            if (this.enterKeyDisabled) this.blur();
            else that._addList();
        });
        addSpaceInput.onfocus = _setFocused;
        addSpaceInput.onblur = _setBlurredTimer(function() {
            Entry.do('listAddSetName', this.value);
        });
        addSpaceNameWrapper.appendChild(addSpaceInput);

        var addSpaceGlobalWrapper = CE('div')
            .addClass('entryVariableAddSpaceGlobalWrapperWorkspace')
            .bindOnClick(() => Entry.do('listAddSetScope', 'global'));
        listAddSpace.appendChild(addSpaceGlobalWrapper);

        var addListGlobalSpan = CE('span');
        addListGlobalSpan.innerHTML = Lang.Workspace.use_all_objects;
        addSpaceGlobalWrapper.appendChild(addListGlobalSpan);

        var addListGlobalCheck = CE('span').addClass(
            'entryVariableAddSpaceCheckWorkspace'
        );
        this.listAddPanel.view.globalCheck = addListGlobalCheck;
        if (!this.listAddPanel.info.object)
            addListGlobalCheck.addClass('entryVariableAddChecked');
        addSpaceGlobalWrapper.appendChild(addListGlobalCheck);

        var addSpaceLocalWrapper = CE('div')
            .addClass('entryVariableAddSpaceLocalWrapperWorkspace')
            .bindOnClick((e) => Entry.do('listAddSetScope', 'local'));
        listAddSpace.appendChild(addSpaceLocalWrapper);
        var addListLocalSpan = CE('span');
        addListLocalSpan.innerHTML = Lang.Workspace.Variable_use_this_object;
        addSpaceLocalWrapper.appendChild(addListLocalSpan);

        var addListLocalCheck = CE('span').addClass(
            'entryVariableAddSpaceCheckWorkspace'
        );
        this.listAddPanel.view.localCheck = addListLocalCheck;
        if (this.variableAddPanel.info.object)
            addListLocalCheck.addClass('entryVariableAddChecked');
        addSpaceLocalWrapper.appendChild(addListLocalCheck);

        var addSpaceCloudWrapper = CE('div');
        listAddSpace.cloudWrapper = addSpaceCloudWrapper;
        addSpaceCloudWrapper
            .addClass('entryVariableAddSpaceCloudWrapperWorkspace')
            .bindOnClick(() => {
                var { object, isCloud } = this.listAddPanel.info;
                !object && Entry.do('listAddSetCloud', !isCloud);
            });
        listAddSpace.appendChild(addSpaceCloudWrapper);
        var addSpaceCloudSpan = CE('span');
        addSpaceCloudSpan.addClass('entryVariableAddSpaceCloudSpanWorkspace');
        addSpaceCloudSpan.innerHTML = Lang.Workspace.List_create_cloud;

        addSpaceCloudWrapper.appendChild(addSpaceCloudSpan);
        var addListCloudCheck = CE('span')
            .addClass('entryVariableAddSpaceCheckWorkspace')
            .addClass('entryVariableAddSpaceCloudCheckWorkspace');
        this.listAddPanel.view.cloudCheck = addListCloudCheck;
        if (this.listAddPanel.info.isCloud)
            addListCloudCheck.addClass('entryVariableAddChecked');

        addSpaceCloudWrapper.appendChild(addListCloudCheck);

        var addSpaceButtonWrapper = CE('div').addClass(
            'entryVariableAddSpaceButtonWrapperWorkspace'
        );
        listAddSpace.appendChild(addSpaceButtonWrapper);

        var addSpaceCancelButton = CE('span')
            .addClass('entryVariableAddSpaceCancelWorkspace')
            .addClass('entryVariableAddSpaceButtonWorkspace')
            .bindOnClick(() => {
                this.listAddPanel.view.addClass('entryRemove');
                this.resetVariableAddPanel('list');
            });
        addSpaceCancelButton.innerHTML = Lang.Buttons.cancel;
        addSpaceButtonWrapper.appendChild(addSpaceCancelButton);

        var addSpaceConfirmButton = CE('span')
            .addClass('entryVariableAddSpaceConfirmWorkspace')
            .addClass('entryVariableAddSpaceButtonWorkspace')
            .bindOnClick(() => that._addList());
        addSpaceConfirmButton.innerHTML = Lang.Buttons.save;
        addSpaceConfirmButton.variableContainer = this;
        addSpaceButtonWrapper.appendChild(addSpaceConfirmButton);
        this.listAddConfirmButton = addSpaceConfirmButton;
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
            this._getAddPanel().isOpen = true;
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
        timer =
            timer ||
            new Entry.Variable({
                id: Entry.generateHash(),
                name: Lang.Workspace.Variable_Timer,
                value: 0,
                variableType: 'timer',
                visible: false,
                x: 150,
                y: -70,
            });

        timer.generateView();
        timer.tick = null;
        Entry.engine.projectTimer = timer;

        Entry.addEventListener('stop', () => {
            Entry.engine.stopProjectTimer();
        });
    };

    //generate Answer
    p.generateAnswer = function(answer) {
        answer =
            answer ||
            new Entry.Variable({
                id: Entry.generateHash(),
                name: Lang.Blocks.VARIABLE_get_canvas_input_value,
                value: 0,
                variableType: 'answer',
                visible: false,
                x: 150,
                y: -100,
            });

        answer.generateView();
        Entry.container.inputValue = answer;
    };

    p.generateVariableSettingView = function() {
        var that = this;

        var _setFocused = Entry.Utils.setFocused;
        var _setBlurredTimer = Entry.Utils.setBlurredTimer;

        var CE = Entry.createElement; //alias

        var element = CE('div')
            .addClass('entryVariableSettingWorkspace')
            .addClass('entryRemove')
            .bindOnClick((e) => e.stopPropagation())
            .appendTo(this.listView_);
        this.variableSettingView = element;

        var visibleWrapper = CE('div')
            .addClass('entryVariableSettingVisibleWrapperWorkspace')
            .bindOnClick(() => {
                var v = this.selectedVariable;
                Entry.do('variableSetVisibility', v.id_, !v.isVisible());
            })
            .appendTo(element);
        var visibleSpan = CE('span').appendTo(visibleWrapper);
        visibleSpan.innerHTML = Lang.Workspace.show_variable;
        var visibleCheck = CE('span')
            .addClass('entryVariableSettingCheckWorkspace')
            .appendTo(visibleWrapper);
        element.visibleCheck = visibleCheck;

        var initValueWrapper = CE('div')
            .addClass('entryVariableSettingInitValueWrapperWorkspace')
            .appendTo(element);
        var initValueSpan = CE('span').appendTo(initValueWrapper);
        initValueSpan.innerHTML = Lang.Workspace.default_value;
        var initValueInput = CE('input')
            .addClass('entryVariableSettingInitValueInputWorkspace')
            .appendTo(initValueWrapper);
        element.initValueInput = initValueInput;
        initValueInput.value = 0;
        initValueInput.onkeypress = Entry.Utils.blurWhenEnter;
        initValueInput.onfocus = _setFocused;
        initValueInput.onblur = _setBlurredTimer(function(e) {
            var v = that.selectedVariable;
            Entry.do('variableSetDefaultValue', v.id_, this.value);
        });
        element.initValueInput = initValueInput;

        var splitter = CE('div')
            .addClass('entryVariableSettingSplitterWorkspace')
            .appendTo(element);

        var slideWrapper = CE('div')
            .addClass('entryVariableSettingSlideWrapperWorkspace')
            .appendTo(element);
        var slideSpan = CE('span').appendTo(slideWrapper);
        slideSpan.innerHTML = Lang.Workspace.slide;
        var slideCheck = CE('span')
            .addClass('entryVariableSettingCheckWorkspace')
            .bindOnClick((e) => {
                var v = that.selectedVariable;
                Entry.do(
                    'variableSetSlidable',
                    v.id_,
                    v.getType() === 'variable' ? 'slide' : 'variable'
                );
            })
            .appendTo(slideWrapper);
        element.slideCheck = slideCheck;

        var minMaxWrapper = CE('div')
            .addClass('entryVariableSettingMinMaxWrapperWorkspace')
            .appendTo(element);
        element.minMaxWrapper = minMaxWrapper;
        var minValueSpan = CE('span').appendTo(minMaxWrapper);
        minValueSpan.innerHTML = Lang.Workspace.min_value;
        var minValueInput = CE('input')
            .addClass('entryVariableSettingMinValueInputWorkspace')
            .appendTo(minMaxWrapper);
        var v = that.selectedVariable;
        if (v && v.type == 'slide') minValueInput.value = v.minValue_;
        else minValueInput.value = 0;
        minValueInput.onkeypress = Entry.Utils.blurWhenEnter;
        minValueInput.onfocus = _setFocused;
        minValueInput.onblur = _setBlurredTimer(function(e) {
            var v = that.selectedVariable;
            var value = this.value;
            value = Entry.Utils.isNumber(value) ? value : v.getMinValue();
            Entry.do('variableSetMinValue', v.id_, value);
        });
        element.minValueInput = minValueInput;

        var maxValueSpan = CE('span')
            .addClass('entryVariableSettingMaxValueSpanWorkspace')
            .appendTo(minMaxWrapper);
        maxValueSpan.innerHTML = Lang.Workspace.max_value;
        var maxValueInput = CE('input')
            .addClass('entryVariableSettingMaxValueInputWorkspace')
            .appendTo(minMaxWrapper);
        if (v && v.type == 'slide') maxValueInput.value = v.maxValue_;
        else maxValueInput.value = 100;

        maxValueInput.onkeypress = Entry.Utils.blurWhenEnter;
        maxValueInput.onfocus = _setFocused;
        maxValueInput.onblur = _setBlurredTimer(function(e) {
            var v = that.selectedVariable;
            var value = this.value;
            value = Entry.Utils.isNumber(value) ? value : v.getMaxValue();
            Entry.do('variableSetMaxValue', v.id_, value);
        });
        element.maxValueInput = maxValueInput;
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
        var element = Entry.createElement('div')
            .bindOnClick((e) => e.stopPropagation())
            .addClass('entryListSettingWorkspace')
            .addClass('entryRemove')
            .appendTo(this.listView_);

        this.listSettingView = element;

        var visibleWrapper = Entry.createElement('div')
            .addClass('entryListSettingVisibleWrapperWorkspace')
            .bindOnClick((e) => {
                var v = that.selectedList;
                Entry.do('listSetVisibility', v.id_, !v.isVisible());
            })
            .appendTo(element);

        var visibleSpan = Entry.createElement('span').appendTo(visibleWrapper);
        visibleSpan.innerHTML = Lang.Workspace.show_list_workspace;

        var visibleCheck = Entry.createElement('span')
            .addClass('entryListSettingCheckWorkspace')
            .appendTo(visibleWrapper);
        element.visibleCheck = visibleCheck;

        var lengthWrapper = Entry.createElement('div')
            .addClass('entryListSettingLengthWrapperWorkspace')
            .appendTo(element);

        var lengthSpan = Entry.createElement('span')
            .addClass('entryListSettingLengthSpanWorkspace')
            .appendTo(lengthWrapper);
        lengthSpan.innerHTML = Lang.Workspace.number_of_list;

        var lengthController = Entry.createElement('div')
            .addClass('entryListSettingLengthControllerWorkspace')
            .appendTo(lengthWrapper);

        var minus = Entry.createElement('span')
            .addClass('entryListSettingMinusWorkspace')
            .bindOnClick((e) => {
                var { selectedList: { id_, array_ } } = that;
                Entry.do('listChangeLength', id_, 'minus');
            })
            .appendTo(lengthController);
        element.minus = minus;

        var lengthInput = Entry.createElement('input')
            .addClass('entryListSettingLengthInputWorkspace')
            .appendTo(lengthController);
        lengthInput.onblur = function() {
            var v = that.selectedList;
            var value = this.value;
            value = Entry.Utils.isNumber(value) ? value : v.array_.length;
            Entry.do('listChangeLength', v.id_, Number(value));
        };
        lengthInput.onkeypress = Entry.Utils.blurWhenEnter;
        element.lengthInput = lengthInput;

        var plus = Entry.createElement('span')
            .addClass('entryListSettingPlusWorkspace')
            .bindOnClick((e) => {
                var { selectedList: { id_, array_ } } = that;
                Entry.do('listChangeLength', id_, 'plus');
            })
            .appendTo(lengthController);
        element.plus = plus;

        var seperator = Entry.createElement('div')
            .addClass('entryListSettingSeperatorWorkspace')
            .appendTo(element);
        element.seperator = seperator;

        var listValues = Entry.createElement('div')
            .addClass('entryListSettingListValuesWorkspace')
            .appendTo(element);
        element.listValues = listValues;
    };

    p.updateListSettingView = function(list) {
        list = list || this.selectedList;
        var view = this.listSettingView,
            _whenEnter = Entry.Utils.blurWhenEnter;
        var { listValues, visibleCheck, lengthInput, seperator } = view;

        if (list.isVisible()) {
            visibleCheck.addClass('entryListSettingCheckedWorkspace');
        } else {
            visibleCheck.removeClass('entryListSettingCheckedWorkspace');
        }

        var arr = list.array_;
        lengthInput.value = arr.length;
        list.listElement.appendChild(view);

        //remove element and event bindings
        $(listValues).empty();

        if (arr.length === 0) {
            seperator.addClass('entryRemove');
        } else {
            seperator.removeClass('entryRemove');
        }

        var startIndex =
            Entry.getMainWS().mode === Entry.Workspace.MODE_VIMBOARD ? 0 : 1;

        var fragment = document.createDocumentFragment();

        arr.forEach(({ data }, i) => {
            var wrapper = Entry.createElement('div')
                .addClass('entryListSettingValueWrapperWorkspace')
                .appendTo(fragment);

            Entry.createElement('span')
                .addClass('entryListSettingValueNumberSpanWorkspace')
                .appendTo(wrapper).innerHTML =
                i + startIndex;

            var input = Entry.createElement('input')
                .addClass('entryListSettingEachInputWorkspace')
                .appendTo(wrapper);
            input.value = data;
            input.onfocus = Entry.Utils.setFocused;
            input.onblur = Entry.Utils.setBlurredTimer(function() {
                Entry.do('listSetDefaultValue', list.id_, i, this.value);
            });
            input.onkeypress = Entry.Utils.blurWhenEnter;

            Entry.createElement('span')
                .addClass('entryListSettingValueRemoveWorkspace')
                .bindOnClick(() => {
                    arr.splice(i, 1);
                    this.updateListSettingView();
                })
                .appendTo(wrapper);
        });
        listValues.appendChild(fragment);

        list.updateView();
        view.removeClass('entryRemove');
    };

    p.setListLength = function(list, value) {
        value = Number(value);
        var arr = this.selectedList.array_;
        var times = value - arr.length;
        if (times && Entry.Utils.isNumber(value)) {
            if (times > 0) {
                _.times(times, () => arr.push({ data: 0 }));
            } else {
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
            if (type == 'variable') {
                this.variableSettingView.addClass('entryRemove');
                this.selectedVariable = null;
            } else {
                this.listSettingView.addClass('entryRemove');
                this.selectedList = null;
            }
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

        var _filterFunc = _.partial(_.result, _, 'isCloud_');

        var { variables_, lists_ } = Entry.variableContainer;

        var variables = variables_.reduce((acc, v) => {
            if (_filterFunc(v)) return [...acc, v.toJSON()];
            return acc;
        }, []);

        var lists = lists_.reduce((acc, v) => {
            if (_filterFunc(v)) return [...acc, v.toJSON()];
            return acc;
        }, []);

        //no variable or list to save
        if (!variables.length && !lists.length) {
            return;
        }

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
            functions,
            variables,
            messages,
        };
    };

    p.getVariableJSONByBlockList = function(blockList) {
        var variableSet = {};
        var variables = [];
        var messages = [];

        [...this.variables_, ...this.lists_, ...this.messages_].forEach(
            (data) => (variableSet[data.id_ || data.id] = data)
        );

        blockList.forEach(function(block) {
            var data = block.data || {};
            var type = data.type;
            if (!type) {
                return;
            }
            var isMessage = _.contains(EntryStatic.messageBlockList, type);
            var isVariable = _.contains(EntryStatic.variableBlockList, type);

            if (isMessage || isVariable) {
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
            variables,
            messages,
        };
    };

    p.removeRef = function(type, block) {
        if (!Entry.playground.mainWorkspace) return;
        var wsMode = Entry.getMainWS().getMode();
        if (wsMode !== Entry.Workspace.MODE_BOARD) return;

        var arr = this[type];

        for (var i = 0; i < arr.length; i++) {
            if (arr[i].block == block) {
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
                func.content.getBlockList().forEach((block) => {
                    if (block.type.indexOf('func_') > -1) {
                        if (block.type.substr(5) == id) return;
                    }

                    [
                        ...(_.result(block.events, 'viewDestroy') || []),
                        ...(_.result(block.events, 'dataDestroy') || []),
                    ].forEach((fn) => {
                        if (fn) fn(block);
                    });
                });
            }
        }
    };

    p._getBlockMenu = function() {
        return Entry.getMainWS() && Entry.getMainWS().getBlockMenu();
    };

    p._truncName = function(name, type, maxLen) {
        maxLen = maxLen || this._maxNameLength;

        if (name.length <= maxLen) {
            return name;
        }

        Entry.toast.warning(
            Lang.Workspace[type + '_name_auto_edited_title'],
            Lang.Workspace[type + '_name_auto_edited_content']
        );

        return name.substring(0, maxLen);
    };

    p._maxNameLength = 10;

    p.clear = function() {
        var _removeFunc = _.partial(_.result, _, 'remove');
        var _destroyFunc = _.partial(_.result, _, 'destroy');

        var { engine = {}, container = {}, playground } = Entry;

        [...this.variables_, ...this.lists_].forEach(_removeFunc);
        _removeFunc(engine.projectTimer);
        _removeFunc(container.inputValue);
        _.each(this.functions_, _destroyFunc);

        this.variables_ = [];
        this.lists_ = [];
        this.messages_ = [];
        this.functions_ = {};

        playground.reloadPlayground();
        this.updateList();
    };

    p._isPythonMode = function() {
        return _.result(Entry.getMainWS(), 'isVimMode');
    };

    p.getDom = function(query) {
        if (_.isEmpty(query)) {
            return;
        }

        query = [...query];

        switch (query.shift()) {
            case 'filter':
                return this.filterElements[query.shift()];
            case 'functionAddButton':
                return this.functionAddButton_;
            case 'variableAddButton':
                return this.variableAddButton_;
            case 'listAddButton':
                return this.listAddButton_;
            case 'variableAddConfirmButton':
                return this.variableAddConfirmButton;
            case 'listAddConfirmButton':
                return this.listAddConfirmButton;
            case 'variableAddInput':
                return this.variableAddPanel.view.name;
            case 'listAddInput':
                return this.listAddPanel.view.name;
            case 'messageAddButton':
                return this.messageAddButton_;
            case 'variableSetVisibility':
                return this.variableSettingView.visibleCheck;
            case 'listSetVisibility':
                return this.listSettingView.visibleCheck;
            case 'variableSetDefaultValue':
                return this.variableSettingView.initValueInput;
            case 'slideCheck':
                return this.variableSettingView.slideCheck;
            case 'variableMinValue':
                return this.variableSettingView.minValueInput;
            case 'variableMaxValue':
                return this.variableSettingView.maxValueInput;
            case 'messageList':
                return this.getMessage(query.shift()).listElement.nameField;
            case 'variableScope':
                var { globalCheck, localCheck } = this._getAddPanel(
                    'variable'
                ).view;
                return query.shift() === 'global' ? globalCheck : localCheck;
            case 'listScope':
                var { globalCheck, localCheck } = this._getAddPanel(
                    'list'
                ).view;
                return query.shift() === 'global' ? globalCheck : localCheck;
            case 'variableCloud':
                return this._getAddPanel('variable').view.cloudCheck;
            case 'listCloud':
                return this._getAddPanel('list').view.cloudCheck;
            case 'listChangeLength':
                return this.listSettingView[query.shift()];
            case 'listDefaultValue':
                return $('.entryListSettingEachInputWorkspace')[query.shift()];
            case 'messageEditButton':
                return $(this.getMessage(query.shift()).listElement).find(
                    '.editButton'
                )[0];
            case 'variableEditButton':
                return $(this.getVariable(query.shift()).listElement).find(
                    '.entryVariableListElementEditWorkspace'
                )[0];
            case 'listEditButton':
                return $(this.getList(query.shift()).listElement).find(
                    '.entryVariableListElementEditWorkspace'
                )[0];
            case 'variableName':
                return this.getVariable(query.shift()).listElement.nameField;
        }
    };

    function _clickAddButton(type, doFunc, forceOpen, doNotFocus) {
        var panel = this._getAddPanel(type);
        var panelView = panel.view;
        var value = panelView.name.value.trim();
        if (panel.isOpen && !forceOpen) {
            if (_.isEmpty(value)) {
                panelView.addClass('entryRemove');
                panel.isOpen = false;
            } else {
                return doFunc();
            }
        } else {
            panelView.removeClass('entryRemove');
            if (!Entry.Utils.isDomActive(panelView.name) && !doNotFocus) {
                panelView.name.focus();
            }
            panel.isOpen = true;
        }
    }

    p.clickVariableAddButton = function(...args) {
        _clickAddButton.call(
            this,
            'variable',
            () => {
                Entry.do(
                    'variableContainerAddVariable',
                    new Entry.Variable(this._makeVariableData('variable'))
                );
            },
            ...args
        );
    };

    p.clickListAddButton = function(...args) {
        _clickAddButton.call(
            this,
            'list',
            () => {
                Entry.do(
                    'variableContainerAddList',
                    new Entry.Variable(this._makeVariableData('list'))
                );
            },
            ...args
        );
    };

    p._makeVariableData = function(type = 'variable') {
        var { view, info: { isCloud, object } } = this._getAddPanel(type);

        var name = view.name.value.trim();
        if (_.isEmpty(name)) {
            name = Lang.Workspace[type];
        }

        name = this._truncName(name, type, this._maxNameLength);

        var target = `${type}s_`;
        name = this.checkAllVariableName(name, target)
            ? Entry.getOrderedName(name, this[target], 'name_')
            : name;

        return {
            name,
            isCloud,
            object,
            variableType: type,
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
            } else {
                view.addClass('disable');
            }
            view.disabled = !value;
        }
    };

    p.setVariableSlidable = function(v, type, value) {
        //no type changed
        //just return
        if (v.getType() === type) {
            return;
        }

        var newVariable;

        var variables = this.variables_;
        var variableJSON = v.toJSON();

        if (type == 'slide') {
            variableJSON.variableType = type;
            newVariable = new Entry.Variable(variableJSON);
            variables.splice(variables.indexOf(v), 0, newVariable);

            if (newVariable.getValue() < 0) {
                newVariable.setValue(0);
            } else if (newVariable.getValue() > 100) {
                newVariable.setValue(100);
            }
        } else if (type == 'variable') {
            variableJSON.variableType = type;
            if (value !== undefined) {
                variableJSON.value = value;
            }
            newVariable = new Entry.Variable(variableJSON);
            variables.splice(variables.indexOf(v), 0, newVariable);
        }
        this.createVariableView(newVariable);
        this.removeVariable(v);
        this.updateSelectedVariable(newVariable);
        newVariable.generateView();
    };

    p._getAddPanel = function(type = 'variable') {
        return this[`${type}AddPanel`];
    };
})(Entry.VariableContainer.prototype);
