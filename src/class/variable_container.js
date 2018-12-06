/**
 * @fileoverview Variable container for variable object
 */
'use strict';

/**
 * Block variable constructor
 * @param {variable model} variable
 * @constructor
 */
Entry.VariableContainer = class VariableContainer {
    constructor() {
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
        this.listView_ = null;
        this.globalList = null;
        this.globalListBox = null;

        Entry.addEventListener('workspaceChangeMode', this.updateList.bind(this));
    }

    createDom(view) {
        const createElement = Entry.createElement;
        const that = this;

        this.filterElements = {};
        this.view_ = view;
        const selectView = createElement('table')
            .addClass('entryVariableSelectorWorkspace')
            .appendTo(this.view_);

        $(selectView).on('click tab', 'td', function() {
            if (this.disabled) {
                return;
            }

            Entry.do(
                'variableContainerSelectFilter',
                this.getAttribute('data-type'),
                that.viewMode_
            );
        });

        let selectTrView = createElement('tr').appendTo(selectView);

        const allButton = this.createSelectButton('all')
            .addClass('selected', 'allButton')
            .appendTo(selectTrView);
        this.filterElements.all = allButton;

        allButton.setAttribute('rowspan', '2');
        this.filterElements.variable = this.createSelectButton(
            'variable',
            Entry.variableEnable
        ).appendTo(selectTrView);
        this.filterElements.message = this.createSelectButton(
            'message',
            Entry.messageEnable
        ).appendTo(selectTrView);

        selectTrView = createElement('tr').appendTo(selectView);
        this.filterElements.list = this.createSelectButton('list', Entry.listEnable).appendTo(
            selectTrView
        );
        this.filterElements.func = this.createSelectButton('func', Entry.functionEnable).appendTo(
            selectTrView
        );

        const listViewContainer = createElement('div').addClass('entryVariableListWorkspace');
        const listView = createElement('div').addClass('entryVariableAdd_box');

        $(listView).on('mouseenter', '.entryVariableListElementWorkspace', function() {
            this.addClass('active');
        });

        $(listView).on('mouseleave', '.entryVariableListElementWorkspace', function() {
            this.removeClass('active');
        });

        listViewContainer.appendChild(listView);
        this.view_.appendChild(listViewContainer);
        this.listView_ = listView;

        const variableAddButton = createElement('a')
            .addClass('entryVariableAddWorkspace')
            .addClass('entryVariableListElementWorkspace')
            .bindOnClick(() => {
                return Entry.do('variableContainerClickVariableAddButton');
            });
        variableAddButton.innerHTML = `+ ${Lang.Workspace.variable_add}`;
        this.variableAddButton_ = variableAddButton;

        this.generateVariableAddView();
        this.generateListAddView();
        this.generateVariableSettingView();
        this.generateListSettingView();

        const messageAddButton = createElement('a')
            .addClass('entryVariableAddWorkspace')
            .addClass('entryVariableListElementWorkspace')
            .bindOnClick(() => {
                Entry.do('variableContainerAddMessage', {
                    id: Entry.generateHash(),
                    name: Entry.getOrderedName(Lang.Workspace.message, this.messages_, 'name'),
                });
            });
        messageAddButton.innerHTML = `+ ${Lang.Workspace.message_create}`;
        this.messageAddButton_ = messageAddButton;

        const listAddButton = createElement('a')
            .addClass('entryVariableAddWorkspace')
            .bindOnClick(() => {
                return Entry.do('variableContainerClickListAddButton');
            });
        listAddButton.innerHTML = `${Lang.Workspace.list_create}`;
        listAddButton.href = '#';
        this.listAddButton_ = listAddButton;

        const functionAddButton = createElement('a')
            .addClass('entryVariableListElementWorkspace')
            .addClass('entryVariableAddWorkspace')
            .bindOnClick(() => {
                return Entry.do('funcCreateStart', Entry.generateHash());
            });
        functionAddButton.innerHTML = `${Lang.Workspace.function_add}`;
        this.functionAddButton_ = functionAddButton;

        return view;
    }

    /**
     * @param {String} type
     * @param {?Boolean} isEnable
     */
    createSelectButton(type, isEnable = true) {
        const view = Entry.createElement('td').addClass('entryVariableSelectButtonWorkspace', type);
        const textView = Entry.createElement('div');

        view.setAttribute('data-type', type);
        view.appendChild(textView);
        textView.innerText = Lang.Workspace[type];

        if (isEnable === false) {
            view.addClass('disable');
            view.disabled = true;
        }

        this._filterTabs[type] = view;
        return view;
    }

    /**
     * @param {String} type
     */
    selectFilter(type) {
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
    }

    updateVariableAddView(type = 'variable') {
        const { info: { isCloud, object }, view, isOpen } = this._getAddPanel(type);

        // view.addClass('entryRemove');

        const { cloudCheck, globalCheck, localCheck, cloudWrapper } = view;

        if (isCloud) {
            cloudCheck.addClass('on');
        } else {
            cloudCheck.removeClass('on');
        }

        // if (isOpen) {
        //     view.removeClass('entryRemove');
        // }
        if (object) {
            globalCheck.removeClass('on');
            localCheck.addClass('on');
            cloudWrapper.addClass('entryVariableAddSpaceUnCheckedWorkspace');
        } else {
            globalCheck.addClass('on');
            localCheck.removeClass('on');
            cloudWrapper.removeClass('entryVariableAddSpaceUnCheckedWorkspace');
        }
    }

    /**
     * @param {object|Entry.Variable} object
     */
    select(object) {
        object = this.selected == object ? null : object;
        if (this.selected) {
            this.selected.listElement.removeClass('selected');
            if (this.selected.callerListElement) {
                // this.listView_.removeChild(this.selected.callerListElement);
                delete this.selected.callerListElement;
            }
            this.selected = null;
        }
        if (!object) {
            return;
        }
        object.listElement.addClass('selected');
        this.selected = object;
        if (object instanceof Entry.Variable) {
            this.renderVariableReference(object);
            if (object.object_) {
                Entry.container.selectObject(object.object_, true);
            }
        } else if (object instanceof Entry.Func) {
            this.renderFunctionReference(object);
        } else {
            this.renderMessageReference(object);
        }
    }

    getMessage(id) {
        return _.find(this.messages_, { id });
    }

    /**
     * @param {object} message
     */
    // 사용된 곳을 알려주는 뷰
    renderMessageReference(message) {
        const messageId = message.id;

        const callers = this._messageRefs.filter(({ block: { params } }) => {
            return _.includes(params, messageId);
        });

        const listView = Entry.createElement('ul').addClass('entryVariableListCallerListWorkspace');

        if (callers.length) {
            const fragment = document.createDocumentFragment();
            callers.forEach(({ object, block }) => {
                const element = Entry.createElement('li').addClass(
                    'entryVariableListCallerWorkspace'
                );
                !object.thumbnailView_ && object.generateView();
                element.appendChild(object.thumbnailView_.cloneNode());
                Entry.createElement('div')
                    .addClass('entryVariableListCallerNameWorkspace')
                    .appendTo(element).innerHTML = `${object.name} : ${
                    Lang.Blocks[`START_${block.type}`]
                }`;
                element.bindOnClick(() => {
                    if (Entry.playground.object !== object) {
                        Entry.container.selectObject();
                        Entry.container.selectObject(object.id, true);
                        this.select(null);
                        this.select(message);
                    }

                    Entry.playground.toggleOnVariableView();
                    Entry.playground.changeViewMode('variable');
                });
                fragment.appendChild(element);
            });
            listView.appendChild(fragment);
        } else {
            Entry.createElement('li')
                .addClass(
                    'entryVariableListCallerWorkspace',
                    'entryVariableListCallerNoneWorkspace'
                )
                .appendTo(listView).innerHTML =
                Lang.Workspace.no_use;
        }

        message.callerListElement = listView;
        this.listView_.insertBefore(listView, message.listElement);
        this.listView_.insertBefore(message.listElement, listView);
    }

    /**
     * @param {object} variable
     */
    renderVariableReference(variable) {
        const that = this;
        const variableId = variable.id_;

        const callers = this._variableRefs.filter(({ block: { params } }) => {
            return _.includes(params, variableId);
        });

        const listView = Entry.createElement('ul').addClass('entryVariableListCallerListWorkspace');

        if (callers.length) {
            const fragment = document.createDocumentFragment();

            callers.forEach((caller) => {
                const element = Entry.createElement('li').addClass(
                    'entryVariableListCallerWorkspace'
                );
                !caller.object.thumbnailView_ && caller.object.generateView();
                element.appendChild(caller.object.thumbnailView_.cloneNode());
                Entry.createElement('div')
                    .addClass('entryVariableListCallerNameWorkspace')
                    .appendTo(element).innerHTML = `${caller.object.name} : ${
                    Lang.Blocks[`VARIABLE_${caller.block.type}`]
                }`;
                element.variable = variable;
                element.bindOnClick(() => {
                    if (Entry.playground.object != caller.object) {
                        Entry.container.selectObject();
                        Entry.container.selectObject(caller.object.id, true);
                        that.select(null);
                    }
                    const block = caller.funcBlock || caller.block;
                    const board = _.result(block.view, 'getBoard');
                    if (board) {
                        board.activateBlock(block);
                    }
                    Entry.playground.toggleOnVariableView();
                    Entry.playground.changeViewMode('variable');
                });
                fragment.appendChild(element);
            });
            listView.appendChild(fragment);
        } else {
            Entry.createElement('li')
                .addClass('entryVariableListCallerWorkspace entryVariableListCallerNoneWorkspace')
                .appendTo(listView).innerHTML =
                Lang.Workspace.no_use;
        }

        variable.callerListElement = listView;
        // this.listView_.insertBefore(listView, variable.listElement);
        // this.listView_.insertBefore(variable.listElement, listView);
    }

    /**
     * @param {object} variable
     */
    renderFunctionReference(func) {
        const that = this;

        const callers = [...this._functionRefs];

        const listView = Entry.createElement('ul').addClass('entryVariableListCallerListWorkspace');

        if (callers.length) {
            const fragment = document.createDocumentFragment();
            callers.forEach((caller) => {
                const element = Entry.createElement('li').addClass(
                    'entryVariableListCallerWorkspace'
                );
                !caller.object.thumbnailView_ && caller.object.generateView();
                element.appendChild(caller.object.thumbnailView_.cloneNode());
                const nameElement = Entry.createElement('div').addClass(
                    'entryVariableListCallerNameWorkspace'
                );
                nameElement.innerHTML = caller.object.name;
                element.appendChild(nameElement);
                element.bindOnClick(function() {
                    if (Entry.playground.object != caller.object) {
                        Entry.container.selectObject();
                        Entry.container.selectObject(caller.object.id, true);
                        that.select(null);
                        that.select(func);
                    }
                    Entry.playground.toggleOnVariableView();
                    const block = caller.block;
                    const blockView = block.view;
                    blockView && blockView.getBoard().activateBlock(block);
                    Entry.playground.changeViewMode('variable');
                });
                fragment.appendChild(element);
            });
            listView.appendChild(fragment);
        } else {
            Entry.createElement('li')
                .addClass('entryVariableListCallerWorkspace entryVariableListCallerNoneWorkspace')
                .appendTo(listView).innerHTML =
                Lang.Workspace.no_use;
        }

        func.callerListElement = listView;
        this.listView_.insertBefore(listView, func.listElement);
        this.listView_.insertBefore(func.listElement, listView);
    }

    /**
     * update list view
     * todo
     */
    updateList() {
        const listView = this.listView_;
        if (!listView || !/^(variable|code)$/.test(_.result(Entry.playground, 'getViewMode'))) {
            return;
        }

        if (!this.variableSplitters) {
            this.generateVariableSplitterView();
        }

        // this.variableSettingView.addClass('entryRemove');
        // this.listSettingView.addClass('entryRemove');

        const isPythonMode = this._isPythonMode();
        if (isPythonMode) {
            listView.addClass('entryVariableContainerTextMode');
        } else {
            listView.removeClass('entryVariableContainerTextMode');
        }

        this.clearListElement();

        switch (this.viewMode_) {
            case 'all':
                this.updateAllTab();
                break;
            case 'message':
                this.updateMessageTab();
                break;
            case 'variable':
                this.updateVariableTab();
                break;
            case 'list':
                this.updateListTab();
                break;
            case 'func':
                this.updateFuncTab();
                break;
        }

        // listView.appendChild(this.variableSettingView);
        // listView.appendChild(this.listSettingView);
    }

    _each(arr, viewFunc, parent = this.listView_) {
        return _.each(arr, (data) => {
            !data.listElement && viewFunc(data);

            parent.appendChild(data.listElement);
            if (data.callerListElement) {
                parent.appendChild(data.callerListElement);
            }
        });
    }

    clearListElement() {
        const clearList = [this.listView_, this.globalListBox];
        for (const elem of clearList) {
            while (elem && elem.firstChild) {
                elem.removeChild(elem.lastChild);
            }
        }
    }

    updateAllTab() {
        this._each(this.messages_, this.createMessageView.bind(this));
        this._each(this.variables_, this.createVariableView.bind(this));
        this._each(this.lists_, this.createListView.bind(this));
        this._each(this.functions_, this.createFunctionView.bind(this));
    }

    updateMessageTab() {
        const listView = this.listView_;
        listView.appendChild(this.messageAddButton_);
        this._each(this.messages_, this.createMessageView.bind(this));
    }

    updateVariableTab() {
        const listView = this.listView_;
        const info = this.variableAddPanel.info;
        if (info.object && !Entry.playground.object) {
            info.object = null;
        }

        listView.appendChild(this.variableAddButton_);
        listView.appendChild(this.variableAddPanel.view);

        this.variableSplitters.top.innerHTML = Lang.Workspace.Variable_used_at_all_objects;
        listView.appendChild(this.variableSplitters.top);

        const { globalV, localV } = _.groupBy(this.variables_, ({ object_ }) => {
            return object_ ? 'localV' : 'globalV';
        });

        this._each(globalV, this.createVariableView.bind(this));

        this.variableSplitters.bottom.innerHTML = Lang.Workspace.Variable_used_at_special_object;
        listView.appendChild(this.variableSplitters.bottom);

        this._each(localV, this.createVariableView.bind(this));

        this.updateVariableAddView('variable');
    }

    updateListTab() {
        const listView = this.listView_;
        const info = this.listAddPanel.info;
        if (info.object && !Entry.playground.object) {
            info.object = null;
        }
        listView.appendChild(this.listAddButton_);
        listView.appendChild(this.listAddPanel.view);

        const { localV, globalV } = _.groupBy(this.lists_, ({ object_ }) => {
            return object_ ? 'localV' : 'globalV';
        });

        this._each(globalV, this.createListView.bind(this), this.globalListBox);
        this._each(localV, this.createListView.bind(this), this.localList);
        // this.updateVariableAddView('list');
        // this.updateVariableAddView('variable');

        listView.appendChild(this.globalList);
        listView.appendChild(this.localList);
    }
    updateFuncTab() {
        const isPythonMode = this._isPythonMode();
        const listView = this.listView_;
        let mode = _.result(Entry.getMainWS(), 'getMode');
        mode = _.isUndefined(mode) ? Entry.Workspace.MODE_BOARD : mode;
        mode = mode === Entry.Workspace.MODE_OVERLAYBOARD || isPythonMode;

        if (mode) {
            this.functionAddButton_.addClass('disable');
        } else {
            this.functionAddButton_.removeClass('disable');
        }

        listView.appendChild(this.functionAddButton_);
        this._each(this.functions_, this.createFunctionView.bind(this));
    }

    /**
     * @param {!Array.<message model>} objectModels
     */
    setMessages(messages = []) {
        this.messages_ = messages.map((message) => {
            if (!message.id) {
                message.id = Entry.generateHash();
            }
            return message;
        });
        Entry.playground.reloadPlayground();
    }

    /**
     * @param {!Array.<message model>} objectModels
     */
    appendMessages(messages) {
        for (const i in messages) {
            const message = messages[i];
            if (!message.id) {
                message.id = Entry.generateHash();
            } else if (
                this.messages_.some((item) => {
                    return item.id === message.id;
                })
            ) {
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
    }

    /**
     * @param {!Array.<variable model>} variables
     */
    setVariables(variables = []) {
        variables.forEach((variable) => {
            variable = new Entry.Variable(variable);
            switch (variable.getType()) {
                case 'variable':
                case 'slide':
                    variable.generateView(this.variables_.length);
                    this.variables_.push(variable);
                    break;
                case 'list':
                    variable.generateView(this.lists_.length);
                    this.lists_.push(variable);
                    break;
                case 'timer':
                    this.generateTimer(variable);
                    break;
                case 'answer':
                    this.generateAnswer(variable);
                    break;
            }
        });

        if (_.isEmpty(Entry.engine.projectTimer)) {
            this.generateTimer();
        }
        if (_.isEmpty(Entry.container.inputValue)) {
            this.generateAnswer();
        }

        Entry.playground.reloadPlayground();
    }

    generateVariable(variable, data, key) {
        const name = variable.name_;
        variable.generateView(data.length);
        variable.name_ = this.checkAllVariableName(name, key)
            ? Entry.getOrderedName(name, data, 'name_')
            : name;
    }

    /**
     * @param {!Array.<variable model>} variables
     */
    appendVariables(variables) {
        for (const i in variables) {
            const variable = new Entry.Variable(variables[i]);
            if (!variable.id_) {
                variable.id_ = Entry.generateHash();
            }
            const type = variable.getType();
            if (type === 'variable' || type === 'slide') {
                if (
                    this.variables_.some((item) => {
                        return item.id_ === variable.id_;
                    })
                ) {
                    continue;
                }
                this.generateVariable(variable, this.variables_, 'variables_');
                this.variables_.push(variable);
            } else if (type === 'list') {
                if (
                    this.lists_.some((item) => {
                        return item.id_ === variable.id_;
                    })
                ) {
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
    }

    /**
     * @param {!Array.<function model>} variables
     */
    setFunctions(functions = []) {
        functions.forEach((func) => {
            func = new Entry.Func(func);
            func.generateBlock();
            this.functions_[func.id] = func;
        });
    }

    /**
     * @param {!Array.<function model>} variables
     */
    appendFunctions(functions = []) {
        for (const i in functions) {
            const func = functions[i];
            if (!func.id) {
                func.id = Entry.generateHash();
            } else if (`${func.id}` in this.functions_) {
                continue;
            }
            const parseFunc = new Entry.Func(func);
            this.changeFunctionName(parseFunc);
            parseFunc.generateBlock();
            this.functions_[parseFunc.id] = parseFunc;
        }
    }

    changeFunctionName(func) {
        const params = func.content.getEventMap('funcDef')[0].params[0].data.params;
        const funcParamInfo = this.getFunctionParamInfo(params);
        const funcParamName = this.getFunctionParamName(funcParamInfo);
        const funcKeys = Object.keys(this.functions_);
        const funcsParamNames = funcKeys.map((key) => {
            const func = this.functions_[key];
            const params = func.content.getEventMap('funcDef')[0].params[0].data.params;
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
                const info = funcParamInfo[i];
                if (info.type === 'string') {
                    info.parent[0] += orderedNumber;
                    break;
                }
            }

            Entry.Func.generateWsBlock(func);
        }
    }

    getFunctionParamName(info) {
        return info.reduce((acc, { name }) => {
            return (acc += name);
        }, '');
    }

    getFunctionParamInfo(parentParams) {
        const info = [];
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

                if (type.indexOf('stringParam') === 0 || type.indexOf('booleanParam') === 0) {
                    const name = type.slice(0, -5);
                    info[index] = {
                        name,
                        type: name,
                        parent: parentParams,
                    };
                } else {
                    const childParamInfo = this.getFunctionParamInfo(params);
                    childParamInfo.forEach((childInfo, childIndex) => {
                        info[childIndex + index] = childInfo;
                    });
                }
            }
        });
        return info;
    }

    /**
     * get func
     * @return {Entry.Func}
     */
    getFunction(funcId) {
        return this.functions_[funcId];
    }

    /**
     * get variable on canvas
     * @return {Entry.Variable}
     */
    getVariable(id_, entity = {}) {
        const criteria = { id_ };
        let variable = _.find(this.variables_, criteria);
        if (entity.isClone && variable.object_) {
            variable = _.find(entity.variables, criteria);
        }

        return variable;
    }

    /**
     * get variable on canvas
     * @return {Entry.List}
     */
    getList(listId, { isClone, lists } = {}) {
        const criteria = { id_: listId };
        let list = _.find(this.lists_, criteria);
        if (isClone && list.object_) {
            list = _.find(lists, criteria);
        }

        return list;
    }

    /**
     * Create function
     */
    createFunction(data) {
        if (Entry.Func.isEdit) {
            return;
        }
        Entry.Func.edit(new Entry.Func(data));
        //this.saveFunction(func);
    }

    /**
     * Remove variable
     * @param {Entry.Variable} variable
     */
    removeFunction({ id: functionId }) {
        const functions = this.functions_;
        functions[functionId].destroy();
        delete functions[functionId];
        const functionType = `func_${functionId}`;

        Entry.container.removeFuncBlocks(functionType);
        for (const id in functions) {
            functions[id].content.removeBlocksByType(functionType);
        }
        this.updateList();
    }

    checkListPosition(list, mouse) {
        const pos = {
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
    }

    getListById(mouseevt) {
        const lists = this.lists_;
        const returnList = [];
        if (lists.length > 0) {
            for (let i = 0; i < lists.length; i++) {
                if (this.checkListPosition(lists[i], mouseevt)) {
                    returnList.push(lists[i]);
                }
            }
            return returnList;
        }
        return false;
    }

    _getVariableByName(arr, variableName, isSelf, currentObjectId) {
        const object = _.result(Entry.playground, 'object');
        if (!currentObjectId && object) {
            currentObjectId = object.id;
        }

        for (let i = 0; i < arr.length; i++) {
            const v = arr[i];
            if (isSelf === true) {
                if (!v.object_ || v.object_ !== currentObjectId) {
                    continue;
                }
            } else if (isSelf === false) {
                if (v.object_) {
                    continue;
                }
            }

            if (v.getName() === variableName) {
                return v;
            }
        }
    }

    getVariableByName(variableName, isSelf, currentObjectId) {
        return this._getVariableByName(this.variables_, variableName, isSelf, currentObjectId);
    }

    getListByName(name, isSelf, currentObjectId) {
        return this._getVariableByName(this.lists_, name, isSelf, currentObjectId);
    }

    /**
     * Save variable
     * @param {Entry.Func} func
     */
    saveFunction(func) {
        /* add to function list when not exist */
        const ws = Entry.getMainWS();

        if (ws && ws.overlayModefrom == Entry.Workspace.MODE_VIMBOARD) {
            if (func && func.description) {
                const funcName = func.description.substring(1, func.description.length - 1);
                const alertMsg = Entry.TextCodingUtil.isNameIncludeSpace(funcName, 'function');
                if (alertMsg) {
                    entrylms.alert(alertMsg);
                    Entry.Func.cancelEdit();
                    return;
                }
            }
        }

        if (!this.functions_[func.id]) {
            this.functions_[func.id] = func;
            this.createFunctionView(func);
        }
        if (func.listElement) {
            func.listElement.nameField.innerHTML = func.description;
        }

        this.updateList();
    }

    /**
     * @param {Entry.Func} func
     */
    createFunctionView(func) {
        const that = this;
        if (!this.view_) {
            return;
        }
        let className = 'entryVariableListElementWorkspace';
        className += ' entryFunctionElementWorkspace';
        className += ' function';
        const view = Entry.createElement('li')
            .addClass(className)
            .bindOnClick((e) => {
                e.stopPropagation();
                that.select(func);
            });

        Entry.createElement('button')
            .addClass('entryVariableListElementDeleteWorkspace')
            .bindOnClick(function(e) {
                e.stopPropagation();
                entrylms.confirm(Lang.Workspace.will_you_delete_function).then((result) => {
                    if (result === true) {
                        that.removeFunction(func);
                        that.selected = null;
                    }
                });
            })
            .appendTo(view);

        Entry.createElement('button')
            .addClass('entryVariableListElementEditWorkspace notForTextMode')
            .bindOnClick((e) => {
                e.stopPropagation();
                const playground = Entry.playground;
                if (playground) {
                    playground.changeViewMode('code');
                    const blockMenu = this._getBlockMenu();
                    if (blockMenu.lastSelector !== 'func') {
                        blockMenu.selectMenu('func');
                    }
                }
                Entry.Func.edit(func);
            })
            .appendTo(view);

        const nameField = Entry.createElement('div')
            .addClass('entryVariableFunctionElementNameWorkspace')
            .appendTo(view);
        nameField.innerHTML = func.description;
        view.nameField = nameField;
        func.listElement = view;
    }

    /**
     * Add variable
     * @param {Entry.Variable} variable
     * @return {boolean} return true when success
     */
    checkAllVariableName(name, variable) {
        return this[variable].some(({ name_ }) => {
            return name_ === name;
        });
    }

    _addVariableOrList(type, data) {
        if (!type) {
            return;
        }
        const panel = this._getAddPanel(type);
        const name = panel.view.name.value.trim();
        // panelView.addClass('entryRemove');

        if (Entry.isTextMode) {
            const alertMsg = Entry.TextCodingUtil.isNameIncludeSpace(name, type);
            if (alertMsg) {
                entrylms.alert(alertMsg);
                this.resetVariableAddPanel(type);
                return;
            }
        }

        const target = `${type}s_`;

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

        const playground = Entry.playground;

        if (playground) {
            const { blockMenu } = playground;
            if (blockMenu) {
                blockMenu.deleteRendered('variable');
            }
            playground.reloadPlayground();
        }

        this.updateList();
    }

    addVariable(variable) {
        this._addVariableOrList.call(this, 'variable', variable);
    }

    /**
     * Remove variable
     * @param {Entry.Variable} variable
     */
    removeVariable(variable) {
        if (!(variable instanceof Entry.Variable)) {
            variable = this.getVariable(variable.id);
        }

        if (this.selected == variable) {
            this.select(null);
        }

        variable.remove();
        const variables = this.variables_;
        variables.splice(variables.indexOf(variable), 1);
        Entry.playground.reloadPlayground();
        this.updateList();
    }

    /**
     * @param {Entry.Variable} variable
     * @param {String} name
     */
    changeVariableName(variable, name) {
        if (variable.name_ == name) {
            return;
        }

        if (Entry.isTextMode) {
            const alertMsg = Entry.TextCodingUtil.isNameIncludeSpace(name, 'variable');
            if (alertMsg) {
                entrylms.alert(alertMsg);
                variable.listElement.nameField.value = variable.name_;
                return;
            }
        }

        if (Entry.isExist(name, 'name_', this.variables_)) {
            variable.listElement.nameField.value = variable.name_;
            return Entry.toast.alert(
                Lang.Workspace.variable_rename_failed,
                Lang.Workspace.variable_dup
            );
        } else if (name.length > 10) {
            variable.listElement.nameField.value = variable.name_;
            return Entry.toast.alert(
                Lang.Workspace.variable_rename_failed,
                Lang.Workspace.variable_too_long
            );
        }
        variable.setName(name);
        variable.listElement.nameField.value = name;
        Entry.playground.reloadPlayground();
        Entry.toast.success(Lang.Workspace.variable_rename, Lang.Workspace.variable_rename_ok);
    }

    /**
     * @param {Entry.Variable} list
     * @param {String} name
     */
    changeListName(list, name) {
        if (list.name_ == name) {
            return;
        }

        if (Entry.isTextMode) {
            const alertMsg = Entry.TextCodingUtil.isNameIncludeSpace(name, 'list');
            if (alertMsg) {
                entrylms.alert(alertMsg);
                list.listElement.nameField.value = list.name_;
                return;
            }
        }

        if (Entry.isExist(name, 'name_', this.lists_)) {
            Entry.toast.alert(Lang.Workspace.list_rename_failed, Lang.Workspace.list_dup);
        } else if (name.length > 10) {
            Entry.toast.alert(Lang.Workspace.list_rename_failed, Lang.Workspace.list_too_long);
        } else {
            //name successfully changed
            list.name_ = name;
            list.updateView();
            Entry.playground.reloadPlayground();
            Entry.toast.success(Lang.Workspace.list_rename, Lang.Workspace.list_rename_ok);
        }

        list.listElement.nameField.value = list.name_;
    }

    /**
     * Remove list
     * @param {Entry.Variable} list
     */
    removeList(list) {
        if (!(list instanceof Entry.Variable)) {
            list = this.getList(list.id);
        }

        if (this.selected == list) {
            this.select(null);
        }
        list.remove();
        const lists = this.lists_;
        lists.splice(lists.indexOf(list), 1);
        Entry.playground.reloadPlayground();
        this.updateList();
    }

    /**
     * @param {Entry.Variable} variable
     */
    createVariableView(variable) {
        const that = this;

        const view = Entry.createElement('li');

        const wrapper = Entry.createElement('div')
            .addClass('entryVariableListElementWrapperWorkspace', 'variable')
            .appendTo(view);

        let className = 'entryVariableListElementWorkspace';
        if (!variable.object_) {
            if (variable.isCloud_) {
                className += ' entryVariableCloudElementWorkspace';
            } else {
                className += ' entryVariableGlobalElementWorkspace';
            }
        } else {
            className += ' entryVariableLocalElementWorkspace';
        }

        view.addClass(className).bindOnClick(() => {
            return this.select(variable);
        });

        view.removeButton = Entry.createElement('button')
            .addClass('entryVariableListElementDeleteWorkspace notForTextMode')
            .bindOnClick((e) => {
                e.stopPropagation();
                Entry.do('variableContainerRemoveVariable', variable);
                this.selectedVariable = null;
                // this.variableSettingView.addClass('entryRemove');
            })
            .appendTo(wrapper);

        this._removeButton = view.removeButton;

        view.editButton = Entry.createElement('button')
            .addClass('entryVariableListElementEditWorkspace')
            .bindOnClick((e) => {
                e.stopPropagation();
                Entry.do('setVariableEditable', variable.id_, this.selectedVariable !== variable);
            })
            .appendTo(wrapper);

        const nameField = Entry.createElement('input')
            .addClass('entryVariableListElementNameWorkspace')
            .bindOnClick((e) => {
                return e.stopPropagation();
            })
            .appendTo(wrapper);
        nameField.setAttribute('disabled', 'disabled');
        nameField.value = variable.name_;
        nameField.onfocus = Entry.Utils.setFocused;
        nameField.onblur = Entry.Utils.setBlurredTimer(function() {
            const value = this.value.trim();
            if (!value) {
                Entry.toast.alert(Lang.Msgs.warn, Lang.Workspace.variable_can_not_space);
                this.value = variable.getName();
                return this.focus();
            }

            variable = that.getVariable(variable.id_);
            variable && Entry.do('variableSetName', variable.id_, value);
        });
        nameField.onkeydown = Entry.Utils.blurWhenEnter;
        view.nameField = nameField;
        variable.listElement = view;
    }

    /**
     * Add event for block
     * @param {message model} message
     * @return {boolean} return true when success
     */
    addMessage(message = {}) {
        const messages = this.messages_;
        if (!message.name) {
            message.name = `${Lang.Workspace.message} ${messages.length + 1}`;
        }
        if (!message.id) {
            message.id = Entry.generateHash();
        }
        this.createMessageView(message);
        messages.unshift(message);

        const { playground } = Entry;

        if (playground) {
            const { blockMenu } = playground;
            if (blockMenu) {
                blockMenu.deleteRendered('start');
            }
            playground.reloadPlayground();
        }
        this.updateList();
        const nameField = message.listElement.nameField;

        //flag for first time blur command
        //focus first and value not changed
        //command will be skipped
        nameField.isFirst = true;
        Entry.Utils.focusIfNotActive(nameField);
    }

    /**
     * Add event
     * @param {message model} message
     */
    removeMessage({ id }) {
        const message = this.getMessage(id);
        if (this.selected == message) {
            this.select(null);
        }
        const messages_ = this.messages_;
        messages_.splice(messages_.indexOf(message), 1);
        this.updateList();
        Entry.playground.reloadPlayground();
    }

    /**
     * @param {object} message
     * @param {String} name
     */
    changeMessageName({ id }, name) {
        const message = this.getMessage(id);
        if (message.name == name) {
            return;
        }

        const messages = this.messages_;
        const exist = Entry.isExist(name, 'name', messages);

        const { listElement: { nameField } } = message;
        const { playground, toast } = Entry;

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
        toast.success(Lang.Workspace.message_rename, Lang.Workspace.message_rename_ok);

        function failFunc(value, title, message) {
            nameField.value = value;
            return toast.alert(title, message);
        }
    }

    activateMessageEditView(message) {
        $(message.listElement)
            .find('.entryVariableListElementNameWorkspace')
            .removeAttr('disabled')
            .focus();
    }

    /**
     * @param {object} message
     */
    createMessageView(message) {
        const view = Entry.createElement('li')
            .addClass('entryVariableListElementWorkspace')
            .addClass('entryMessageElementWorkspace')
            .bindOnClick(() => {
                return this.select(message);
            });

        const removeButton = Entry.createElement('button')
            .addClass('entryVariableListElementDeleteWorkspace')
            .bindOnClick((e) => {
                e.stopPropagation();
                Entry.do('variableContainerRemoveMessage', message);
            })
            .appendTo(view);

        const editButton = Entry.createElement('button')
            .addClass('entryVariableListElementEditWorkspace editButton')
            .bindOnClick((e) => {
                e.stopPropagation();
                Entry.do('setMessageEditable', message.id);
            })
            .appendTo(view);

        const nameField = Entry.createElement('input')
            .addClass('entryVariableListElementNameWorkspace')
            .bindOnClick((e) => {
                return e.stopPropagation();
            })
            .appendTo(view);
        nameField.value = message.name;
        nameField.onfocus = Entry.Utils.setFocused;
        nameField.onblur = Entry.Utils.setBlurredTimer(function(e) {
            const value = this.value;
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
    }

    /**
     * Add list for block
     * @param {list model} list
     * @return {boolean} return true when success
     */
    addList(list) {
        this._addVariableOrList.call(this, 'list', list);
    }

    /**
     * @param {Entry.Variable} list
     */
    createListView1(list) {
        const createElement = Entry.createElement;
        const that = this;
        const view = createElement('div')
            .addClass('entryVariableListElementWorkspace')
            .bindOnClick(() => {
                return that.select(list);
            });

        const wrapper = createElement('div')
            .addClass('entryVariableListElementWrapperWorkspace list')
            .appendTo(view);
        if (!list.object_) {
            if (list.isCloud_) {
                view.addClass('entryListCloudElementWorkspace');
            } else {
                view.addClass('entryListGlobalElementWorkspace');
            }
        } else {
            view.addClass('entryListLocalElementWorkspace');
        }

        createElement('button')
            .addClass('entryVariableListElementDeleteWorkspace notForTextMode')
            .bindOnClick((e) => {
                e.stopPropagation();
                Entry.do('variableContainerRemoveList', list);
                that.selectedList = null;
                // that.listSettingView.addClass('entryRemove');
            })
            .appendTo(wrapper);

        const nameField = createElement('input')
            .addClass('entryVariableListElementNameWorkspace')
            .bindOnClick((e) => {
                return e.stopPropagation();
            })
            .appendTo(wrapper);
        view.editButton = createElement('button')
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

        nameField.setAttribute('disabled', 'disabled');
        nameField.value = list.name_;
        nameField.onfocus = Entry.Utils.setFocused;
        nameField.onblur = Entry.Utils.setBlurredTimer(function() {
            const value = this.value.trim();
            if (!value) {
                Entry.toast.alert(Lang.Msgs.warn, Lang.Msgs.list_can_not_space);
                this.value = list.getName();
                return this.focus();
            }
            list = that.getList(list.getId());
            list && Entry.do('listSetName', list.getId(), value);
        });
        nameField.onkeydown = Entry.Utils.blurWhenEnter;

        view.nameField = nameField;
        list.listElement = view;
    }

    createListView(list) {
        const that = this;
        const createElement = Entry.createElement;

        const listWrapper = createElement('div')
            .addClass('list unfold')
            .bindOnClick(() => {
                const editBoxes = document.getElementsByClassName('list');
                for (const box of editBoxes) {
                    box.removeClass('unfold');
                }
                editBoxWrapper.addClass('unfold');
            })
            .appendTo(this.globalListBox);

        if (!list.object_) {
            if (list.isCloud_) {
                listWrapper.addClass('global_list');
            } else {
                listWrapper.addClass('default_list');
            }
        } else {
            listWrapper.addClass('local_list');
        }

        const editBoxWrapper = createElement('div')
            .addClass('inpt_box')
            .bindOnClick(function(e) {
                e.stopPropagation();

                if (that.selectedList === list) {
                    editBoxInput.blur();
                    that.select(list);
                    that.updateSelectedVariable(null, 'list');
                } else {
                    Entry.do('setListEditable', list.id_);
                }
            })
            .appendTo(listWrapper);
        const editBoxInputWrapper = createElement('div')
            .addClass('inpt')
            .appendTo(editBoxWrapper);
        const editBoxInput = createElement('input')
            .addClass('input')
            .appendTo(editBoxInputWrapper);
        editBoxInput.setAttribute('type', 'text');
        editBoxInput.setAttribute('name', 'inpt_name');
        editBoxInput.value = list.name_;
        editBoxInput.onblur = function() {
            const value = this.value.trim();
            if (!value) {
                Entry.toast.alert(Lang.Msgs.warn, Lang.Msgs.list_can_not_space);
                this.value = list.getName();
                return this.focus();
            }
            const targetList = that.getList(list.getId());
            targetList && Entry.do('listSetName', targetList.getId(), value);
        };
        editBoxInput.onkeydown = Entry.Utils.blurWhenEnter;
        const watchButton = createElement('a')
            .addClass('watch')
            .bindOnClick(() => {
                Entry.do('listSetVisibility', list.id_, !list.isVisible());
                if (list.isVisible()) {
                    watchButton.addClass('on');
                } else {
                    watchButton.removeClass('on');
                }
            })
            .appendTo(editBoxWrapper);
        if (list.isVisible()) {
            watchButton.addClass('on');
        } else {
            watchButton.removeClass('on');
        }
        watchButton.href = '#';
        const delButton = createElement('a')
            .addClass('del')
            .bindOnClick((e) => {
                e.stopPropagation();
                Entry.do('variableContainerRemoveList', list);
            })
            .appendTo(editBoxWrapper);
        delButton.href = '#';
        listWrapper.nameField = editBoxInput;
        list.listElement = listWrapper;
    }

    /**
     * Apply map function to variables. But this not replace object with returned one.
     * So giving map function don't have to return object.
     * And this support another arguments.
     * @param {!function} mapFunction
     * @param {} param
     */
    mapVariable(mapFunction, param) {
        this.variables_.forEach(_.partial(mapFunction, _, param));
    }

    /**
     * @param {!function} mapFunction
     * @param {} param
     */
    mapList(mapFunction, param) {
        this.lists_.forEach(_.partial(mapFunction, _, param));
    }

    /**
     * convert this variable's data to JSON.
     * @return {JSON}
     */
    getVariableJSON() {
        return [
            ...this.variables_,
            ...this.lists_,
            _.result(Entry.engine, 'projectTimer'),
            _.result(Entry.container, 'inputValue'),
        ]
            .filter(_.identity)
            .map((v) => {
                return v.toJSON ? v.toJSON() : v;
            });
    }

    /**
     * convert this message's data to JSON.
     * @return {JSON}
     */
    getMessageJSON() {
        return this.messages_.map(_.partial(_.pick, _, 'id', 'name'));
    }

    /**
     * convert this function's data to JSON.
     * @return {JSON}
     */
    getFunctionJSON() {
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
    }

    resetVariableAddPanel(type = 'variable') {
        const panel = this._getAddPanel(type);
        if (!panel.view) {
            return;
        }
        const info = panel.info;
        info.isCloud = false;
        info.object = null;
        panel.view.name.value = '';
        panel.isOpen = false;
        this.updateVariableAddView(type);
    }

    generateVariableAddView() {
        const createElement = Entry.createElement;
        const _whenEnter = Entry.Utils.whenEnter;
        const _setFocused = Entry.Utils.setFocused;
        const _setBlurredTimer = Entry.Utils.setBlurredTimer;

        const that = this;

        // const variableAddSpace = createElement('li').addClass(
        //     'entryVariableAddSpaceWorkspace entryRemove'
        // );
        const variableAddSpace = createElement('li').addClass('entryVariableAddSpaceWorkspace');
        this.variableAddPanel.view = variableAddSpace;
        this.variableAddPanel.isOpen = false;

        const addSpaceNameWrapper = createElement('div')
            .addClass('entryVariableAddSpaceNameWrapperWorkspace')
            .appendTo(variableAddSpace);
        const addSpaceInputLabel = createElement('label')
            .addClass('entryVariableAddSpaceInputLabelWorkspace')
            .appendTo(addSpaceNameWrapper);
        addSpaceInputLabel.innerText = Lang.Workspace.Variable_placeholder_name;

        const addSpaceInput = createElement('input')
            .addClass('entryVariableAddSpaceInputWorkspace')
            .appendTo(addSpaceNameWrapper);
        addSpaceInput.setAttribute('placeholder', Lang.Workspace.Variable_placeholder_name);
        addSpaceInput.variableContainer = this;
        addSpaceInput.onkeypress = _whenEnter(function() {
            if (this.enterKeyDisabled) {
                this.blur();
            } else {
                that._addVariable();
            }
        });
        addSpaceInput.onfocus = _setFocused;
        const doBlur = _setBlurredTimer(function() {
            this.isBlurred = false;
            Entry.do('variableAddSetName', this.value);
            this.blurCallback && this.blurCallback();
        });
        addSpaceInput.onblur = () => {
            this.isBlurred = true;
            doBlur.apply(this);
        };

        this.variableAddPanel.view.name = addSpaceInput;

        const addSpaceGlobalWrapper = createElement('div')
            .addClass('entryVariableAddSpaceGlobalWrapperWorkspace')
            .bindOnClick(() => {
                return Entry.do('variableAddSetScope', 'global');
            })
            .appendTo(variableAddSpace);

        createElement('span').appendTo(addSpaceGlobalWrapper).innerHTML =
            Lang.Workspace.Variable_use_all_objects;

        this.variableAddPanel.view.globalCheck = createElement('span')
            .addClass('entryVariableAddSpaceCheckWorkspace')
            .addClass(!this.variableAddPanel.info.object ? 'entryVariableAddChecked' : '')
            .appendTo(addSpaceGlobalWrapper);

        const addSpaceLocalWrapper = createElement('div')
            .addClass('entryVariableAddSpaceLocalWrapperWorkspace')
            .bindOnClick(() => {
                return Entry.do('variableAddSetScope', 'local');
            })
            .appendTo(variableAddSpace);

        createElement('span').appendTo(addSpaceLocalWrapper).innerHTML =
            Lang.Workspace.Variable_use_this_object;

        this.variableAddPanel.view.localCheck = createElement('span')
            .addClass('entryVariableAddSpaceCheckWorkspace')
            .addClass(this.variableAddPanel.info.object ? 'entryVariableAddChecked' : '')
            .appendTo(addSpaceLocalWrapper);

        const addSpaceCloudWrapper = createElement('div')
            .addClass('entryVariableAddSpaceCloudWrapperWorkspace')
            .bindOnClick(() => {
                const { object, isCloud } = this.variableAddPanel.info;
                !object && Entry.do('variableAddSetCloud', !isCloud);
            })
            .appendTo(variableAddSpace);
        variableAddSpace.cloudWrapper = addSpaceCloudWrapper;

        createElement('span')
            .addClass('entryVariableAddSpaceCloudSpanWorkspace')
            .appendTo(addSpaceCloudWrapper).innerHTML =
            Lang.Workspace.Variable_create_cloud;

        this.variableAddPanel.view.cloudCheck = createElement('span')
            .addClass(
                'entryVariableAddSpaceCheckWorkspace',
                'entryVariableAddSpaceCloudCheckWorkspace',
                this.variableAddPanel.info.isCloud ? 'entryVariableAddChecked' : ''
            )
            .appendTo(addSpaceCloudWrapper);

        const addSpaceButtonWrapper = createElement('div')
            .addClass('entryVariableAddSpaceButtonWrapperWorkspace')
            .appendTo(variableAddSpace);

        createElement('span')
            .addClass('entryVariableAddSpaceCancelWorkspace')
            .addClass('entryVariableAddSpaceButtonWorkspace')
            .bindOnClick(() => {
                // that._getAddPanel().view.addClass('entryRemove');
                that.resetVariableAddPanel('variable');
            })
            .appendTo(addSpaceButtonWrapper).innerHTML =
            Lang.Buttons.cancel;

        const addSpaceConfirmButton = createElement('span')
            .addClass('entryVariableAddSpaceConfirmWorkspace')
            .addClass('entryVariableAddSpaceButtonWorkspace')
            .bindOnClick(this._addVariable.bind(this))
            .appendTo(addSpaceButtonWrapper);
        addSpaceConfirmButton.innerHTML = Lang.Buttons.save;
        this.variableAddConfirmButton = addSpaceConfirmButton;
    }

    _addVariable() {
        const variableInput = Entry.getDom(['variableContainer', 'variableAddInput']);
        const blurCallback = () => {
            delete variableInput.blurCallback;
            Entry.do(
                'variableContainerAddVariable',
                new Entry.Variable(this._makeVariableData('variable'))
            );
            const [variable] = this.variables_;
            this.updateSelectedVariable(variable);
            const { nameField } = variable.listElement;
            nameField.removeAttribute('disabled');
        };
        if (variableInput.isBlurred) {
            variableInput.blurCallback = blurCallback;
        } else {
            blurCallback();
        }
    }

    _addList() {
        const listInput = Entry.getDom(['variableContainer', 'listAddInput']);
        const blurCallback = () => {
            Entry.do(
                'variableContainerAddList',
                new Entry.Variable(this._makeVariableData('list'))
            );
            const [list] = this.lists_;
            this.updateSelectedVariable(list);
            const { nameField } = list.listElement;
            nameField.removeAttribute('disabled');
        };

        if (listInput.isBlurred) {
            listInput.blurCallback = blurCallback;
        } else {
            blurCallback();
        }
    }

    generateListAddView() {
        const createElement = Entry.createElement;
        const that = this;

        const _setFocused = Entry.Utils.setFocused;
        const _setBlurredTimer = Entry.Utils.setBlurredTimer;

        // 리스트 만들기 폼
        const listAddSpace = createElement('div').addClass('entryVariableAddSpaceWorkspace off');
        this.listAddPanel.view = listAddSpace;
        this.listAddPanel.isOpen = false;

        // 리스트 만들기
        const addSpaceNameWrapper = createElement('div')
            .addClass('entryVariableAddSpaceNameWrapperWorkspace')
            .appendTo(listAddSpace);

        const addSpaceInputLabel = createElement('label')
            .addClass('entryVariableAddSpaceInputLabelWorkspace')
            .appendTo(addSpaceNameWrapper);
        addSpaceInputLabel.innerText = Lang.Workspace.list_name;
        addSpaceInputLabel.setAttribute('for', 'entryVariableAddSpaceInputWorkspace');

        const addSpaceInput = createElement('input')
            .addClass('entryVariableAddSpaceInputWorkspace')
            .appendTo(addSpaceNameWrapper);
        addSpaceInput.setAttribute('placeholder', Lang.Workspace.list_name);
        addSpaceInput.id = 'entryVariableAddSpaceInputWorkspace';
        this.listAddPanel.view.name = addSpaceInput;

        addSpaceInput.onkeypress = Entry.Utils.whenEnter(function() {
            if (this.enterKeyDisabled) {
                this.blur();
            } else {
                that._addList();
            }
        });
        addSpaceInput.onfocus = _setFocused;
        const doBlur = _setBlurredTimer(function() {
            this.isBlurred = false;
            Entry.do('listAddSetName', this.value);
            this.blurCallback && this.blurCallback();
        });
        addSpaceInput.onblur = () => {
            this.isBlurred = true;
            doBlur.apply(this);
        };

        // 모든 오브젝트에서 사용
        const addSpaceGlobalWrapper = createElement('div')
            .addClass('entryVariableAddSpaceGlobalWrapperWorkspace on')
            .bindOnClick(() => {
                addSpaceLocalWrapper.removeClass('on');
                addSpaceGlobalWrapper.addClass('on');
                return Entry.do('listAddSetScope', 'global');
            })
            .appendTo(listAddSpace);

        createElement('span')
            .addClass('Workspace_text')
            .appendTo(addSpaceGlobalWrapper).innerHTML =
            Lang.Workspace.use_all_objects;

        this.listAddPanel.view.globalCheck = createElement('span')
            .addClass('entryVariableAddSpaceCheckWorkspace')
            .appendTo(addSpaceGlobalWrapper);

        // 공유 리스트
        const addSpaceCloudWrapper = createElement('div')
            .appendTo(addSpaceGlobalWrapper)
            .addClass('entryVariableAddSpaceCloudWrapperWorkspace')
            .bindOnClick(() => {
                const { object, isCloud } = this.listAddPanel.info;
                !object && Entry.do('listAddSetCloud', !isCloud);
                if (isCloud) {
                    addSpaceCloudWrapper.removeClass('on');
                } else {
                    addSpaceCloudWrapper.addClass('on');
                }
            });
        listAddSpace.cloudWrapper = addSpaceCloudWrapper;

        createElement('span')
            .addClass('entryVariableAddSpaceCloudSpanWorkspace')
            .appendTo(addSpaceCloudWrapper).innerHTML =
            Lang.Workspace.List_create_cloud;

        const addListCloudCheck = createElement('span')
            .addClass('entryVariableAddSpaceCheckWorkspace')
            .appendTo(addSpaceCloudWrapper);
        this.listAddPanel.view.cloudCheck = addListCloudCheck;

        // 이 오브젝트에서 사용
        const addSpaceLocalWrapper = createElement('div')
            .addClass('entryVariableAddSpaceGlobalWrapperWorkspace')
            .bindOnClick(() => {
                addSpaceGlobalWrapper.removeClass('on');
                addSpaceCloudWrapper.removeClass('on');
                addSpaceLocalWrapper.addClass('on');
                return Entry.do('listAddSetScope', 'local');
            })
            .appendTo(listAddSpace);

        createElement('span').appendTo(addSpaceLocalWrapper).innerHTML =
            Lang.Workspace.Variable_use_this_object;

        this.listAddPanel.view.localCheck = createElement('span')
            .addClass('entryVariableAddSpaceCheckWorkspace')
            .addClass(this.variableAddPanel.info.object ? 'entryVariableAddChecked' : '')
            .appendTo(addSpaceLocalWrapper);

        // 확인 취소 버튼
        const addSpaceButtonWrapper = createElement('div')
            .addClass('entryVariableAddSpaceButtonWrapperWorkspace')
            .appendTo(listAddSpace);

        const addSpaceCancelButton = createElement('a')
            .addClass('entryVariableAddSpaceCancelWorkspace')
            .addClass('entryVariableAddSpaceButtonWorkspace')
            .bindOnClick(() => {
                // this.listAddPanel.view.addClass('entryRemove');
                this.resetVariableAddPanel('list');
            })
            .appendTo(addSpaceButtonWrapper);
        addSpaceCancelButton.href = '#';
        addSpaceCancelButton.innerHTML = Lang.Buttons.cancel;

        const addSpaceConfirmButton = createElement('a')
            .addClass('entryVariableAddSpaceConfirmWorkspace')
            .addClass('entryVariableAddSpaceButtonWorkspace')
            .bindOnClick(() => {
                return that._addList();
            })
            .appendTo(addSpaceButtonWrapper);
        addSpaceConfirmButton.href = '#';
        addSpaceConfirmButton.innerHTML = Lang.Buttons.save;
        this.listAddConfirmButton = addSpaceConfirmButton;

        //global list container
        this.globalList = createElement('div').addClass('entryVariableSplitterWorkspace unfold');

        const globalListTitle = Entry.createElement('a').addClass('attr_link');
        globalListTitle.innerHTML = Lang.Workspace.List_used_all_objects;
        this.globalList.appendChild(globalListTitle);

        this.globalListBox = createElement('div')
            .addClass('attr_box')
            .appendTo(this.globalList);

        //local list container
        this.localList = createElement('div').addClass('entryVariableSplitterWorkspace unfold');

        const localListTitle = Entry.createElement('a').addClass('attr_link');
        localListTitle.innerHTML = Lang.Workspace.list_used_specific_objects;
        this.localList.appendChild(localListTitle);
    }

    generateVariableSplitterView() {
        this.variableSplitters = {
            top: Entry.createElement('div').addClass('entryVariableSplitterWorkspace'),
            bottom: Entry.createElement('div').addClass('entryVariableSplitterWorkspace'),
        };
    }

    openVariableAddPanel(type = 'variable') {
        Entry.playground.toggleOnVariableView();
        Entry.playground.changeViewMode('variable');
        if (type === 'variable') {
            this._getAddPanel().isOpen = true;
            this.selectFilter(type);
        } else {
            this.listAddPanel.isOpen = true;
            this.selectFilter(type);
        }
        this.updateVariableAddView(type);
    }

    addCloneLocalVariables(param) {
        const that = this;

        //variables
        this.variables_
            .reduce((acc, variable) => {
                const cloned = clone(variable, param, 'variables_');
                cloned && acc.push(cloned);
                return acc;
            }, [])
            .forEach(this.addVariable.bind(this));

        //lists
        this.lists_
            .reduce((acc, list) => {
                const cloned = clone(list, param, 'lists_');
                cloned && acc.push(cloned);
                return acc;
            }, [])
            .forEach(this.addList.bind(this));

        function clone(variable, param, nameSpace) {
            //not a local variable
            const _object = variable.object_;
            if (!_object || _object !== param.objectId) {
                return;
            }

            const cloned = variable.toJSON();
            cloned.originId = cloned.id;
            cloned.id = Entry.generateHash();
            cloned.object = param.newObjectId;
            cloned.name = that.checkAllVariableName(cloned.name, nameSpace)
                ? Entry.getOrderedName(cloned.name, that[nameSpace], 'name_')
                : cloned.name;
            delete cloned.x;
            delete cloned.y;

            const json = param.json;
            json.script = json.script.replace(new RegExp(cloned.originId, 'g'), cloned.id);
            return cloned;
        }
    }

    generateTimer(timer) {
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
    }

    //generate Answer
    generateAnswer(answer) {
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
        Entry.container.inputValue.setName(Lang.Blocks.VARIABLE_get_canvas_input_value);
    }

    generateVariableSettingView() {
        const that = this;

        const _setFocused = Entry.Utils.setFocused;
        const _setBlurredTimer = Entry.Utils.setBlurredTimer;

        const createElement = Entry.createElement; //alias

        const element = createElement('div')
            .addClass('entryVariableSettingWorkspace')
            // .addClass('entryRemove')
            .bindOnClick((e) => {
                return e.stopPropagation();
            })
            .appendTo(this.listView_);
        this.variableSettingView = element;

        const visibleWrapper = createElement('div')
            .addClass('entryVariableSettingVisibleWrapperWorkspace')
            .bindOnClick(() => {
                const v = this.selectedVariable;
                Entry.do('variableSetVisibility', v.id_, !v.isVisible());
            })
            .appendTo(element);

        createElement('span').appendTo(visibleWrapper).innerHTML = Lang.Workspace.show_variable;

        element.visibleCheck = createElement('span')
            .addClass('entryVariableSettingCheckWorkspace')
            .appendTo(visibleWrapper);

        const initValueWrapper = createElement('div')
            .addClass('entryVariableSettingInitValueWrapperWorkspace')
            .appendTo(element);

        createElement('span').appendTo(initValueWrapper).innerHTML = Lang.Workspace.default_value;

        const initValueInput = createElement('input')
            .addClass('entryVariableSettingInitValueInputWorkspace')
            .appendTo(initValueWrapper);
        element.initValueInput = initValueInput;
        initValueInput.value = 0;
        initValueInput.onkeypress = Entry.Utils.blurWhenEnter;
        initValueInput.onfocus = _setFocused;
        initValueInput.onblur = _setBlurredTimer(function() {
            const v = that.selectedVariable;
            Entry.do('variableSetDefaultValue', v.id_, this.value);
        });
        element.initValueInput = initValueInput;

        createElement('div')
            .addClass('entryVariableSettingSplitterWorkspace')
            .appendTo(element);

        const slideWrapper = createElement('div')
            .addClass('entryVariableSettingSlideWrapperWorkspace')
            .appendTo(element);
        createElement('span').appendTo(slideWrapper).innerHTML = Lang.Workspace.slide;
        element.slideCheck = createElement('span')
            .addClass('entryVariableSettingCheckWorkspace')
            .bindOnClick(() => {
                const v = that.selectedVariable;
                Entry.do(
                    'variableSetSlidable',
                    v.id_,
                    v.getType() === 'variable' ? 'slide' : 'variable'
                );
            })
            .appendTo(slideWrapper);

        const minMaxWrapper = createElement('div')
            .addClass('entryVariableSettingMinMaxWrapperWorkspace')
            .appendTo(element);
        element.minMaxWrapper = minMaxWrapper;
        createElement('span').appendTo(minMaxWrapper).innerHTML = Lang.Workspace.min_value;
        const minValueInput = createElement('input')
            .addClass('entryVariableSettingMinValueInputWorkspace')
            .appendTo(minMaxWrapper);

        const v = that.selectedVariable;
        const vType = _.result(v, 'type');

        if (vType === 'slide') {
            minValueInput.value = v.minValue_;
        } else {
            minValueInput.value = 0;
        }
        minValueInput.onkeypress = Entry.Utils.blurWhenEnter;
        minValueInput.onfocus = _setFocused;
        minValueInput.onblur = _setBlurredTimer(function() {
            const v = that.selectedVariable;
            let value = this.value;
            value = Entry.Utils.isNumber(value) ? value : v.getMinValue();
            Entry.do('variableSetMinValue', v.id_, value);
        });
        element.minValueInput = minValueInput;

        createElement('span')
            .addClass('entryVariableSettingMaxValueSpanWorkspace')
            .appendTo(minMaxWrapper).innerHTML =
            Lang.Workspace.max_value;
        const maxValueInput = createElement('input')
            .addClass('entryVariableSettingMaxValueInputWorkspace')
            .appendTo(minMaxWrapper);
        if (vType === 'slide') {
            maxValueInput.value = v.maxValue_;
        } else {
            maxValueInput.value = 100;
        }

        maxValueInput.onkeypress = Entry.Utils.blurWhenEnter;
        maxValueInput.onfocus = _setFocused;
        maxValueInput.onblur = _setBlurredTimer(function() {
            const v = that.selectedVariable;
            let value = this.value;
            value = Entry.Utils.isNumber(value) ? value : v.getMaxValue();
            Entry.do('variableSetMaxValue', v.id_, value);
        });
        element.maxValueInput = maxValueInput;
    }

    /**
     * @param {object|Entry.Variable} object
     */
    updateVariableSettingView(v) {
        const view = this.variableSettingView;
        const {
            visibleCheck,
            initValueInput: initValue,
            slideCheck: slide,
            minValueInput: minValue,
            maxValueInput: maxValue,
            minMaxWrapper,
        } = view;

        if (v.isVisible()) {
            visibleCheck.addClass('entryVariableSettingChecked');
        } else {
            visibleCheck.removeClass('entryVariableSettingChecked');
        }

        slide.removeClass('entryVariableSettingChecked');
        if (v.getType() === 'slide') {
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

        // view.removeClass('entryRemove');
    }

    /**
     * 속성 > 리스트 편집창 표기
     */
    generateListSettingView() {
        const that = this;
        const element = Entry.createElement('div')
            .bindOnClick((e) => {
                return e.stopPropagation();
            })
            .addClass('entryListSettingWorkspace')
            // .addClass('entryRemove')
            .appendTo(this.listView_);

        this.listSettingView = element;

        // list import, export 버튼 영역
        const listTransferWrapper = Entry.createElement('div')
            .addClass('entryListSettingTransferWrapperWorkspace')
            .appendTo(element);

        const exportButton = Entry.createElement('button')
            .addClass('entryListSettingExportButton')
            .appendTo(listTransferWrapper)
            .bindOnClick((e) => {
                e.stopPropagation();
                const { array_, name_ } = that.selectedList;

                if (array_.length === 0) {
                    entrylms.alert(Lang.Menus.nothing_to_export);
                } else {
                    Entry.dispatchEvent('openExportListModal', array_, name_);
                }
            });
        exportButton.innerHTML = Lang.Workspace.list_export;

        const importButton = Entry.createElement('button')
            .addClass('entryListSettingImportButton')
            .appendTo(listTransferWrapper)
            .bindOnClick((e) => {
                e.stopPropagation();
                Entry.dispatchEvent('openImportListModal');
            });
        importButton.innerHTML = Lang.Workspace.list_import;

        // list import, export 버튼 영역 종료

        // padding wrapper (list wrapper) 시작
        const paddingWrapper = Entry.createElement('div')
            .addClass('entryListSettingPaddingWrapper')
            .appendTo(element);

        const visibleWrapper = Entry.createElement('div')
            .addClass('entryListSettingVisibleWrapperWorkspace')
            .bindOnClick(() => {
                const v = that.selectedList;
                Entry.do('listSetVisibility', v.id_, !v.isVisible());
            })
            .appendTo(paddingWrapper);

        Entry.createElement('span').appendTo(visibleWrapper).innerHTML =
            Lang.Workspace.show_list_workspace;

        element.visibleCheck = Entry.createElement('span')
            .addClass('entryListSettingCheckWorkspace')
            .appendTo(visibleWrapper);

        const lengthWrapper = Entry.createElement('div')
            .addClass('entryListSettingLengthWrapperWorkspace')
            .appendTo(paddingWrapper);

        Entry.createElement('span')
            .addClass('entryListSettingLengthSpanWorkspace')
            .appendTo(lengthWrapper).innerHTML =
            Lang.Workspace.number_of_list;

        const lengthController = Entry.createElement('div')
            .addClass('entryListSettingLengthControllerWorkspace')
            .appendTo(lengthWrapper);

        element.minus = Entry.createElement('span')
            .addClass('entryListSettingMinusWorkspace')
            .bindOnClick(() => {
                const { selectedList: { id_ } } = that;
                Entry.do('listChangeLength', id_, 'minus');
            })
            .appendTo(lengthController);

        const lengthInput = Entry.createElement('input')
            .addClass('entryListSettingLengthInputWorkspace')
            .appendTo(lengthController);
        lengthInput.onblur = () => {
            const v = that.selectedList;
            let value = this.value;
            value = Entry.Utils.isNumber(value) ? value : v.array_.length;
            Entry.do('listChangeLength', v.id_, Number(value));
        };
        lengthInput.onkeypress = Entry.Utils.blurWhenEnter;
        element.lengthInput = lengthInput;

        element.plus = Entry.createElement('span')
            .addClass('entryListSettingPlusWorkspace')
            .bindOnClick(() => {
                const { selectedList: { id_ } } = that;
                Entry.do('listChangeLength', id_, 'plus');
            })
            .appendTo(lengthController);

        element.seperator = Entry.createElement('div')
            .addClass('entryListSettingSeperatorWorkspace')
            .appendTo(paddingWrapper);

        element.listValues = Entry.createElement('div')
            .addClass('entryListSettingListValuesWorkspace')
            .appendTo(paddingWrapper);

        // padding wrapper (list wrapper) 영역 종료
    }

    updateListSettingView(list) {
        // list = list || this.selectedList;
        // const view = this.listSettingView;
        // const { listValues, visibleCheck, lengthInput, seperator } = view;
        // if (list.isVisible()) {
        //     visibleCheck.addClass('entryListSettingCheckedWorkspace');
        // } else {
        //     visibleCheck.removeClass('entryListSettingCheckedWorkspace');
        // }
        // const arr = list.array_;
        // lengthInput.value = arr.length;
        // list.listElement.appendChild(view);
        // //remove element and event bindings
        // $(listValues).empty();
        // if (arr.length === 0) {
        //     seperator.addClass('entryRemove');
        // } else {
        //     seperator.removeClass('entryRemove');
        // }
        // const startIndex = Entry.getMainWS().mode === Entry.Workspace.MODE_VIMBOARD ? 0 : 1;
        // const fragment = document.createDocumentFragment();
        // arr.forEach(({ data }, i) => {
        //     const wrapper = Entry.createElement('div')
        //         .addClass('entryListSettingValueWrapperWorkspace')
        //         .appendTo(fragment);
        //     Entry.createElement('span')
        //         .addClass('entryListSettingValueNumberSpanWorkspace')
        //         .appendTo(wrapper).innerHTML =
        //         i + startIndex;
        //     const input = Entry.createElement('input')
        //         .addClass('entryListSettingEachInputWorkspace')
        //         .appendTo(wrapper);
        //     input.value = data;
        //     input.onfocus = Entry.Utils.setFocused;
        //     input.onblur = Entry.Utils.setBlurredTimer(function() {
        //         Entry.do('listSetDefaultValue', list.id_, i, this.value);
        //     });
        //     input.onkeypress = Entry.Utils.blurWhenEnter;
        //     Entry.createElement('span')
        //         .addClass('entryListSettingValueRemoveWorkspace')
        //         .bindOnClick(() => {
        //             arr.splice(i, 1);
        //             this.updateListSettingView();
        //         })
        //         .appendTo(wrapper);
        // });
        // listValues.appendChild(fragment);
        // list.updateView();
        // view.removeClass('entryRemove');
    }

    setListLength(list, value) {
        value = Number(value);
        const arr = this.selectedList.array_;
        const times = value - arr.length;
        if (times && Entry.Utils.isNumber(value)) {
            if (times > 0) {
                _.times(times, () => {
                    return arr.push({ data: 0 });
                });
            } else {
                arr.length = value;
            }
        }
        this.updateListSettingView();
    }

    updateViews() {
        [...this.variables_, ...this.lists_].forEach((v) => {
            return v.updateView();
        });
    }

    updateSelectedVariable(object, type = 'variable') {
        const objectType = _.result(object, 'type');
        if (!object) {
            if (type === 'variable') {
                // this.variableSettingView.addClass('entryRemove');
                this.selectedVariable = null;
            } else {
                // this.listSettingView.addClass('entryRemove');
                this.selectedList = null;
            }
        } else if (objectType === 'variable' || objectType === 'slide') {
            this.selectedVariable = object;
            this.updateVariableSettingView(object);
        } else if (objectType === 'list') {
            this.selectedList = object;
            this.updateListSettingView(object);
        }
    }

    removeLocalVariables(objectId) {
        if (!objectId) {
            return;
        }

        [...this.variables_].forEach((v) => {
            if (v.object_ == objectId) {
                this.removeVariable(v);
            }
        });
    }

    updateCloudVariables() {
        const projectId = Entry.projectId;
        if (!Entry.cloudSavable || !projectId) {
            return;
        }

        const _filterFunc = _.partial(_.result, _, 'isCloud_');

        const { variables_, lists_ } = Entry.variableContainer;

        const variables = variables_.reduce((acc, v) => {
            if (_filterFunc(v)) {
                return [...acc, v.toJSON()];
            }
            return acc;
        }, []);

        const lists = lists_.reduce((acc, v) => {
            if (_filterFunc(v)) {
                return [...acc, v.toJSON()];
            }
            return acc;
        }, []);

        //no variable or list to save
        if (!variables.length && !lists.length) {
            return;
        }

        let csrfToken = '';
        try {
            csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        } catch (e) {}

        $.ajax({
            url: `/api/project/variable/${projectId}`,
            type: 'PUT',
            headers: { 'csrf-token': csrfToken },
            data: {
                variables,
                lists,
            },
        });
    }

    addRef(type, blockData) {
        const wsMode = _.result(Entry.getMainWS(), 'getMode');
        if (!this.view_ || wsMode !== Entry.Workspace.MODE_BOARD) {
            return;
        }

        const datum = {
            object: blockData.getCode().object,
            block: blockData,
        };

        if (blockData.funcBlock) {
            datum.funcBlock = blockData.funcBlock;
            delete blockData.funcBlock;
        }

        this[type].push(datum);

        if (type == '_functionRefs') {
            const id = blockData.type.substr(5);
            const func = Entry.variableContainer.functions_[id];
            if (func.isAdded) {
                return;
            }
            func.isAdded = true;
            func.content.getBlockList().forEach((block) => {
                const blockType = block.type;
                if (blockType.indexOf('func_') > -1 && blockType.substr(5) == id) {
                    return;
                }

                [
                    ...(_.result(block.events, 'viewAdd') || []),
                    ...(_.result(block.events, 'dataAdd') || []),
                ].forEach((fn) => {
                    block.getCode().object = datum.object;
                    if (fn) {
                        block.funcBlock = datum.block;
                        fn(block);
                    }
                });
            });
        }

        return datum;
    }

    getObjectVariables(blockList, keys) {
        const findFuncKeys = keys || {};
        let functions = [];
        const jsonData = this.getVariableJSONByBlockList(blockList);
        let variables = jsonData.variables;
        let messages = jsonData.messages;

        blockList.forEach(
            function(block) {
                const type = block.type;
                if (type && type.indexOf('func_') === 0) {
                    const id = type.substr(5);
                    if (!findFuncKeys[id]) {
                        const func = this.functions_[id];
                        findFuncKeys[id] = true;
                        functions.push({
                            id,
                            content: JSON.stringify(func.content.toJSON()),
                        });

                        blockList = func.content.getBlockList();
                        const jsonData = this.getObjectVariables(blockList, findFuncKeys);
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
    }

    getVariableJSONByBlockList(blockList) {
        const variables = [];
        const messages = [];
        const variableSet = [...this.variables_, ...this.lists_, ...this.messages_].reduce(
            (acc, data) => {
                acc[data.id_ || data.id] = data;
                return acc;
            },
            {}
        );

        blockList.forEach(function(block) {
            const data = block.data || {};
            const type = data.type;
            if (!type) {
                return;
            }
            const isMessage = _.includes(EntryStatic.messageBlockList, type);
            const isVariable = _.includes(EntryStatic.variableBlockList, type);

            if (isMessage || isVariable) {
                block.data.params.forEach(function(param) {
                    if (typeof param === 'string' && !!variableSet[param]) {
                        const item = variableSet[param];
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
    }

    removeRef(type, block) {
        if (!Entry.playground.mainWorkspace) {
            return;
        }
        const wsMode = Entry.getMainWS().getMode();
        if (wsMode !== Entry.Workspace.MODE_BOARD) {
            return;
        }

        const arr = this[type];

        for (let i = 0; i < arr.length; i++) {
            if (arr[i].block == block) {
                arr.splice(i, 1);
                break;
            }
        }

        if (type === '_functionRefs') {
            const id = block.type.substr(5);
            const func = Entry.variableContainer.functions_[id];
            if (!func || func.isRemoved) {
                return;
            }
            func.isRemoved = true;
            if (func) {
                func.content.getBlockList().forEach((block) => {
                    if (block.type.indexOf('func_') > -1) {
                        if (block.type.substr(5) == id) {
                            return;
                        }
                    }

                    [
                        ...(_.result(block.events, 'viewDestroy') || []),
                        ...(_.result(block.events, 'dataDestroy') || []),
                    ].forEach((fn) => {
                        if (fn) {
                            fn(block);
                        }
                    });
                });
            }
        }
    }

    _getBlockMenu() {
        return _.result(Entry.getMainWS(), 'getBlockMenu');
    }

    _truncName(name, type, maxLen) {
        maxLen = maxLen || this._maxNameLength;

        if (name.length <= maxLen) {
            return name;
        }

        Entry.toast.warning(
            Lang.Workspace[`${type}_name_auto_edited_title`],
            Lang.Workspace[`${type}_name_auto_edited_content`]
        );

        return name.substring(0, maxLen);
    }

    _maxNameLength = 10;

    clear() {
        const _removeFunc = _.partial(_.result, _, 'remove');
        const _destroyFunc = _.partial(_.result, _, 'destroy');

        const { engine = {}, container = {}, playground } = Entry;

        [...this.variables_, ...this.lists_].forEach(_removeFunc);
        _removeFunc(engine.projectTimer);
        _removeFunc(container.inputValue);
        _.each(this.functions_, _destroyFunc);

        this.viewMode_ = 'all';
        this.variables_ = [];
        this.lists_ = [];
        this.messages_ = [];
        this.functions_ = {};

        playground.reloadPlayground();
        this.updateList();
    }

    _isPythonMode() {
        return _.result(Entry.getMainWS(), 'isVimMode');
    }

    getDom(query) {
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
            case 'variableScope': {
                const { globalCheck, localCheck } = this._getAddPanel('variable').view;
                return query.shift() === 'global' ? globalCheck : localCheck;
            }
            case 'listScope': {
                const { globalCheck, localCheck } = this._getAddPanel('list').view;
                return query.shift() === 'global' ? globalCheck : localCheck;
            }
            case 'variableCloud':
                return this._getAddPanel('variable').view.cloudCheck;
            case 'listCloud':
                return this._getAddPanel('list').view.cloudCheck;
            case 'listChangeLength':
                return this.listSettingView[query.shift()];
            case 'listDefaultValue':
                return $('.entryListSettingEachInputWorkspace')[query.shift()];
            case 'messageEditButton':
                return $(this.getMessage(query.shift()).listElement).find('.editButton')[0];
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
    }

    _clickAddButton(type, doFunc, forceOpen, doNotFocus) {
        const panel = this._getAddPanel(type);
        const panelView = panel.view;
        const panelViewName = panelView.name;
        const value = panelViewName.value.trim();
        if (panel.isOpen && !forceOpen) {
            if (_.isEmpty(value)) {
                panelView.addClass('off');
                panel.isOpen = false;
            } else {
                return doFunc();
            }
        } else {
            panelView.removeClass('off');
            !doNotFocus && Entry.Utils.focusIfNotActive(panelViewName);
            panel.isOpen = true;
        }
    }

    clickVariableAddButton(...args) {
        this._clickAddButton.call(
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
    }

    clickListAddButton(...args) {
        this._clickAddButton.call(
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
    }

    _makeVariableData(type = 'variable') {
        const { view, info: { isCloud, object } } = this._getAddPanel(type);

        let name = view.name.value.trim();
        if (_.isEmpty(name)) {
            name = Lang.Workspace[type];
        }

        name = this._truncName(name, type, this._maxNameLength);

        const target = `${type}s_`;
        name = this.checkAllVariableName(name, target)
            ? Entry.getOrderedName(name, this[target], 'name_')
            : name;

        return {
            name,
            isCloud,
            object,
            variableType: type,
        };
    }

    applyOption() {
        const { variable, message, list, func } = this._filterTabs;

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
    }

    setVariableSlidable(v, type, value) {
        //no type changed
        //just return
        if (v.getType() === type) {
            return;
        }

        let newVariable;

        const variables = this.variables_;
        const variableJSON = v.toJSON();

        if (type === 'slide') {
            variableJSON.variableType = type;
            newVariable = new Entry.Variable(variableJSON);
            variables.splice(variables.indexOf(v), 0, newVariable);

            if (newVariable.getValue() < 0) {
                newVariable.setValue(0);
            } else if (newVariable.getValue() > 100) {
                newVariable.setValue(100);
            }
        } else if (type === 'variable') {
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
    }

    _getAddPanel(type = 'variable') {
        return this[`${type}AddPanel`];
    }
};
