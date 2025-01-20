/**
 * @fileoverview Variable container for variable object
 */
'use strict';

import SimpleBar from 'simplebar';
import xssFilters from 'xss-filters';
import CloudVariable from '../extensions/CloudVariable';
import _get from 'lodash/get';
import _isFunction from 'lodash/isFunction';
import _find from 'lodash/find';
import _includes from 'lodash/includes';
import _some from 'lodash/some';
import _memoize from 'lodash/memoize';

/**
 * Block variable constructor
 * @param {variable model} variable
 * @constructor
 */
Entry.VariableContainer = class VariableContainer {
    constructor() {
        this.cloudVariable = CloudVariable.getInstance();
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
                isRealTime: false,
            },
        };
        this.listAddPanel = {
            isOpen: false,
            info: {
                object: null,
                isCloud: false,
                isRealTime: false,
            },
        };
        this.messageAddPanel = {
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

        Entry.addEventListener('workspaceChangeMode', this.updateList.bind(this));
        Entry.addEventListener(
            'changeFuncVariableListSize',
            this.updateFuncVariableList.bind(this)
        );
    }

    #removeChildrenClass({ children }, className) {
        for (const index in children) {
            const dom = children[index];
            if (dom.removeClass) {
                dom.removeClass(className);
            }
        }
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
        this.view_.appendChild(listViewContainer);

        const listView = createElement('div')
            .addClass('entryVariableAdd_box')
            .appendTo(listViewContainer);

        $(listView).on('mouseenter', '.entryVariableListElementWorkspace', function() {
            this.addClass('active');
        });

        $(listView).on('mouseleave', '.entryVariableListElementWorkspace', function() {
            this.removeClass('active');
        });

        this.listView_ = listView;

        this.generateAddButtons();
        this.generateVariableAddView();
        this.generateListAddView();
        this.generateMessageAddView();

        return view;
    }

    generateAddButtons() {
        const createElement = Entry.createElement;
        const variableAddButton = createElement('button').addClass('entryVariableAddWorkspace');
        variableAddButton.textContent = Lang.Workspace.variable_add;
        this.variableAddButton_ = variableAddButton;

        const messageAddButton = createElement('button').addClass('entryVariableAddWorkspace');
        messageAddButton.textContent = Lang.Workspace.message_add;
        this.messageAddButton_ = messageAddButton;

        const listAddButton = createElement('button').addClass('entryVariableAddWorkspace');
        listAddButton.textContent = Lang.Workspace.list_create;
        this.listAddButton_ = listAddButton;

        const functionAddButton = createElement('button')
            .addClass('entryVariableAddWorkspace')
            .addClass('funcAddButton');
        functionAddButton.textContent = Lang.Workspace.function_add;
        this.functionAddButton_ = functionAddButton;
    }

    /**
     * @param {String} type
     * @param {?Boolean} isEnable
     */
    createSelectButton(type, isEnable = true) {
        const view = Entry.createElement('td').addClass('entryVariableSelectButtonWorkspace', type);
        const textView = Entry.createElement('div');
        const text = Entry.createElement('span')
            .addClass('text')
            .appendTo(textView);

        view.setAttribute('data-type', type);
        view.appendChild(textView);
        text.innerText = Lang.Workspace[type];

        if (isEnable === false) {
            view.addClass('disabled');
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
        const {
            info: { isCloud, object, isRealTime },
            view,
        } = this._getAddPanel(type);
        const { cloudCheck, globalCheck, localCheck, cloudWrapper } = view;

        this.#removeChildrenClass(cloudCheck, 'on');
        const [normal, cloud, realtime] = cloudCheck.children;
        if (isCloud) {
            cloud.addClass('on');
        } else if (isRealTime) {
            realtime.addClass('on');
        } else {
            normal.addClass('on');
        }

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
            this.selected.listElement.removeClass('unfold');
            this.selected.listElement.addClass('fold');
            this.selected.listElement.removeClass('selected');
            if (this.selected.callerListElement) {
                $(this.selected.callerListElement).remove();
                delete this.selected.callerListElement;
            }
            this.selected = null;
        }
        if (!object) {
            return;
        }
        object.listElement.addClass('selected');
        this.selected = object;
        this.selected.listElement.removeClass('fold');
        this.selected.listElement.addClass('unfold');
        if (object instanceof Entry.Variable) {
            if (object.type === 'variable') {
                this.generateVariableSettingView(object);
                this.updateVariableSettingView(object);
            } else if (object.type === 'list') {
                this.generateListSettingView(object);
                this.updateListSettingView(object);
            }
            if (object.object_) {
                Entry.container.selectObject(object.object_, true);
            }
        } else if (object instanceof Entry.Func) {
            this.generateFuncSettingView(object);
            this.updateFuncSettingView(object);
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
    renderMessageReference(message) {
        const messageId = message.id;

        const hasInFunction = this.hasParamBlockInFunction(messageId);
        const callers = this._messageRefs.filter(({ block: { params } }) =>
            _includes(params, messageId)
        );

        message.usedView && $(message.usedView).remove();
        const usedWrapper = Entry.createElement('div').addClass('use_block');

        const boxSubject = Entry.createElement('span')
            .addClass('box_sjt')
            .appendTo(usedWrapper);

        if (callers.length) {
            boxSubject.textContent = Entry.Utils.stringFormat(
                Lang.Workspace.use_block_objects1,
                callers.length
            );

            const listView = Entry.createElement('ul')
                .addClass('obj_list')
                .appendTo(usedWrapper);
            const fragment = document.createDocumentFragment();
            callers.forEach((caller) => {
                const element = Entry.createElement('li');
                const object = caller.object;
                if (!object.entity) {
                    return;
                }
                !caller.object.thumbnailView_ && caller.object.generateView();
                const thumb = element.appendChild(caller.object.thumbnailView_.cloneNode());
                thumb.addClass('thmb');
                element.appendChild(thumb);
                Entry.createElement('span')
                    .addClass('text')
                    .appendTo(element).textContent = `${caller.object.name} : ${
                    Lang.Blocks[`START_${caller.block.type}`]
                }`;
                element.bindOnClick((e) => {
                    e.stopPropagation();
                    if (Entry.playground.object !== caller.object) {
                        Entry.container.selectObject();
                        Entry.container.selectObject(caller.object.id, true);
                    }
                    const block = caller.block;
                    const board = _.result(block.view, 'getBoard');
                    if (board) {
                        board.setSelectedBlock(block.view);
                    }
                    Entry.playground.toggleOnVariableView();
                    Entry.playground.changeViewMode('variable');
                });
                fragment.appendChild(element);
            });
            listView.appendChild(fragment);
        } else {
            const caution = Entry.createElement('div')
                .addClass('caution_dsc')
                .appendTo(usedWrapper);
            caution.textContent = Lang.Workspace.no_use;

            boxSubject.textContent = Entry.Utils.stringFormat(
                Lang.Workspace.use_block_objects2,
                callers.length
            );
        }

        if (hasInFunction) {
            const usedInFunction = Entry.createElement('div')
                .addClass('used_function_dsc')
                .appendTo(usedWrapper);
            usedInFunction.textContent = Lang.Workspace.use_block_function;
        }

        message.usedView = usedWrapper;
        message.listElement.appendChild(usedWrapper);
    }

    /**
     * @param {object} variable
     */
    renderVariableReference(variable) {
        const variableId = variable.id_;

        const hasInFunction = this.hasParamBlockInFunction(variableId);
        const callers = this._variableRefs.filter(({ block: { params } }) =>
            _includes(params, variableId)
        );

        const usedWrapper = Entry.createElement('div').addClass('use_obj');
        const usedSubject = Entry.createElement('span')
            .addClass('box_sjt')
            .appendTo(usedWrapper);

        const listView = Entry.createElement('ul')
            .addClass('obj_list')
            .appendTo(usedWrapper);

        if (callers.length) {
            usedSubject.textContent = Entry.Utils.stringFormat(
                Lang.Workspace.use_block_objects1,
                callers.length
            );
            const fragment = document.createDocumentFragment();

            callers.forEach((caller) => {
                const element = Entry.createElement('li');
                const object = caller.object;
                if (!object.entity) {
                    return;
                }
                !caller.object.thumbnailView_ && caller.object.generateView();
                const thumb = caller.object.thumbnailView_.cloneNode();
                thumb.addClass('thmb');
                element.appendChild(thumb);
                Entry.createElement('span')
                    .addClass('text')
                    .appendTo(element).textContent = `${caller.object.name} : ${
                    Lang.Blocks[`VARIABLE_${caller.block.type}`]
                }`;
                element.variable = variable;
                element.bindOnClick((e) => {
                    e.stopPropagation();
                    if (Entry.playground.object != caller.object) {
                        Entry.container.selectObject();
                        Entry.container.selectObject(caller.object.id, true);
                    }
                    const block = caller.block;
                    const board = _.result(block.view, 'getBoard');
                    if (board) {
                        board.setSelectedBlock(block.view);
                    }
                    Entry.playground.toggleOnVariableView();
                    Entry.playground.changeViewMode('variable');
                });
                fragment.appendChild(element);
            });
            listView.appendChild(fragment);
        } else {
            usedSubject.textContent = Entry.Utils.stringFormat(
                Lang.Workspace.use_block_objects2,
                callers.length
            );
            Entry.createElement('div')
                .addClass('caution_dsc')
                .appendTo(listView).textContent = Lang.Workspace.no_use;
        }

        if (hasInFunction) {
            const usedInFunction = Entry.createElement('div')
                .addClass('used_function_dsc')
                .appendTo(listView);
            usedInFunction.textContent = Lang.Workspace.use_block_function;
        }

        this.variableSettingView && this.variableSettingView.appendChild(usedWrapper);
        this.listSettingView && this.listSettingView.appendChild(usedWrapper);
    }

    generateFuncSettingView(func) {
        const createElement = Entry.createElement;

        const element = createElement('div')
            .addClass('attr_inner_box')
            .bindOnClick((e) => e.stopPropagation());

        if (this.funcSettingView) {
            $(this.funcSettingView).remove();
            delete this.funcSettingView;
        }
        this.funcSettingView = element;

        const funcAttr = createElement('div')
            .addClass('func_attr')
            .appendTo(element);
        if (this._isPythonMode()) {
            funcAttr.addClass('hidden');
        }
        const boxSubject = createElement('span')
            .addClass('box_sjt')
            .appendTo(funcAttr);
        boxSubject.textContent = Lang.Workspace.func_property;

        this.generateFuncDefaultView(funcAttr, func);
        this.generateFuncLocalVariableView(funcAttr, func);
        this.generateFuncValuesView(funcAttr, func);
        this.renderFunctionReference(func);

        this.funcSettingView.func = funcAttr;
        func.listElement.appendChild(this.funcSettingView);
    }

    isUsedFunction(func) {
        if ([...this._functionRefs].some((item) => item.block.data.type === `func_${func.id}`)) {
            return true;
        } else if (
            Object.keys(this.functions_).some((key) => {
                const item = this.functions_[key]?.content.findByType(`func_${func.id}`);
                return Boolean(item);
            })
        ) {
            return true;
        }

        return false;
    }

    generateFuncDefaultView(element, func) {
        const createElement = Entry.createElement;

        // 슬라이드 입력창
        const checkInputBox = createElement('div')
            .addClass('check_inpt')
            .appendTo(element);

        const resultCheckBox = createElement('div')
            .addClass('chk_box')
            .appendTo(checkInputBox);
        element.resultCheck = createElement('span')
            .addClass('entryFuncAddResultCheckWorkspace')
            .bindOnClick(() => {
                if (this.isUsedFunction(func)) {
                    return Entry.modal.alert(Lang.Msgs.cannot_delete_function);
                }
                Entry.do('funcChangeType', func);
            })
            .appendTo(resultCheckBox);

        const resultCheckText = createElement('span')
            .addClass('chk_text')
            .bindOnClick(() => {
                if (this.isUsedFunction(func)) {
                    return Entry.modal.alert(Lang.Msgs.cannot_delete_function);
                }
                Entry.do('funcChangeType', func);
            })
            .appendTo(resultCheckBox);
        resultCheckText.textContent = Lang.Workspace.check_result_value;
    }

    generateFuncLocalVariableView(element, func) {
        const createElement = Entry.createElement;

        const checkInputBox = createElement('div')
            .addClass('check_inpt')
            .appendTo(element);

        const localVarCheckBox = createElement('div')
            .addClass('chk_box')
            .appendTo(checkInputBox);

        element.localVarCheck = createElement('span')
            .addClass('entryFuncAddLocalVarCheckWorkspace')
            .bindOnClick(() => {
                const isUseBlock = func.content.hasBlockType([
                    'set_func_variable',
                    'get_func_variable',
                ]);
                if (isUseBlock) {
                    Entry.modal
                        .confirm(Lang.Msgs.local_variable_deletion_warning)
                        .then((result) => {
                            if (result) {
                                func.content
                                    .getBlockList(false, ['set_func_variable', 'get_func_variable'])
                                    .map(
                                        Entry.Utils.runAsyncCurry(async (block) => {
                                            Entry.do('destroyBlock', block).isPass(true);
                                        })
                                    );
                                Entry.do('toggleFuncUseLocalVariables', func);
                            }
                        });
                } else {
                    Entry.do('toggleFuncUseLocalVariables', func);
                }
            })
            .appendTo(localVarCheckBox);

        const localVarCheckText = createElement('span')
            .addClass('chk_text')
            .bindOnClick(() => {
                element.localVarCheck.click();
            })
            .appendTo(localVarCheckBox);
        localVarCheckText.textContent = Lang.Workspace.check_local_variable;

        const countInputBox = createElement('div')
            .addClass('cnt_inpt')
            .appendTo(checkInputBox);

        const buttonMinus = createElement('a')
            .addClass('btn_cnt')
            .bindOnClick((e) => {
                const disabled = e?.target?.hasAttribute('disabled');
                if (disabled) {
                    return;
                }
                Entry.do('funcLocalVarChangeLength', func, 'minus');
                Entry.dispatchEvent('changeFuncVariableListSize');
            })
            .appendTo(countInputBox);
        this.funcSettingView.minus = buttonMinus;

        const limitValue = 10;
        const maxlength = 2;

        const countInput = createElement('input').appendTo(countInputBox);
        countInput.setAttribute('autocomplete', 'off');
        countInput.setAttribute('type', 'text');
        countInput.setAttribute('maxlength', maxlength);
        countInput.value = func.localVariables?.length || 0;

        countInput.onblur = (e) => {
            const disabled = e?.target?.hasAttribute('disabled');
            if (disabled) {
                return;
            }
            let value = _get(e, 'target.value', 0);
            if (value >= limitValue) {
                value = limitValue;
            }
            Entry.do('funcLocalVarChangeLength', func, value);
            Entry.dispatchEvent('changeFuncVariableListSize');
        };
        countInput.onkeypress = Entry.Utils.blurWhenEnter;

        const buttonPlus = createElement('a')
            .addClass('btn_cnt')
            .addClass('plus')
            .bindOnClick((e) => {
                const disabled = e?.target?.hasAttribute('disabled');
                if (disabled) {
                    return;
                }
                const variableLength = func.localVariables.length;
                if (variableLength < limitValue) {
                    Entry.do('funcLocalVarChangeLength', func, 'plus');
                    Entry.dispatchEvent('changeFuncVariableListSize');
                }
            })
            .appendTo(countInputBox);
        this.funcSettingView.plus = buttonPlus;

        this.funcSettingView.lengthInput = countInput;
    }

    generateFuncValuesView(element, func) {
        const localVariables = func.getLocalVariables() || [];

        if (localVariables?.length === 0) {
            return;
        }

        const createElement = Entry.createElement;

        const countGroup = createElement('div')
            .addClass('cnt_group')
            .appendTo(element);
        const countLabel = createElement('div')
            .addClass('cnt_label')
            .appendTo(countGroup);
        countLabel.textContent = Lang.Workspace.local_variable;
        const scrollBox = createElement('div')
            .addClass('scroll_box simplebar-content-wrapper')
            .appendTo(countGroup);
        const el = new SimpleBar(scrollBox, { autoHide: false });
        const parent = /* html */ `<ol class="cnt_list">{1}</ol>`;
        this.funcSettingView.countGroup = countGroup;
        this.funcSettingView.scrollBox = scrollBox;
        this.funcSettingView.simpleBar = el;
        const listValues = el.getContentElement();
        this.funcSettingView.listValues = listValues;
        const infinityScroll = new Entry.VirtualScroll(listValues, {
            dataWrapper: parent,
            itemHeight: 24,
            groupSize: 10,
        });
        this.funcSettingView.infinityScroll = infinityScroll;

        const $listValues = $(listValues);
        $listValues.empty();
        $listValues.off();

        const data = localVariables?.map((data, i) => {
            const value = String(data.name).replace(/\$/g, '&#36;');
            return this.createListValueElement(i, value, 1);
        });

        infinityScroll.assignData(data);
        infinityScroll.show();
        $listValues.on(
            'change',
            'input',
            _.debounce((e) => {
                const { target } = e;
                const index = target.getAttribute('data-index');
                func.changeNameLocalVariable(target.value, index);
            })
        );
        $listValues.on('focus', 'input', Entry.Utils.setFocused);
        $listValues.on('keypress', 'input', Entry.Utils.blurWhenEnter);
        $listValues.on('click', 'a', function() {
            const index = this.getAttribute('data-index');
            Entry.do('removeFuncLocalVariableByIndex', func, index);
            Entry.dispatchEvent('changeFuncVariableListSize');
        });
    }

    updateFuncScrollBar(func) {
        const view = this.funcSettingView;
        if (!view) {
            return;
        }

        if (!view.infinityScroll) {
            this.generateFuncValuesView(this.funcSettingView.func, func);
            requestAnimationFrame(() => {
                this.updateFuncScrollBar(func);
            });
            return;
        }

        const localVariables = func.getLocalVariables() || [];
        const { infinityScroll, countGroup, lengthInput, simpleBar, scrollBox } = view;

        lengthInput.value = func.localVariables?.length || 0;

        if (localVariables?.length === 0) {
            countGroup?.addClass('entryRemove');
            return;
        }
        countGroup?.removeClass('entryRemove');

        const data = localVariables?.map((data, i) => {
            const value = String(data.name).replace(/\$/g, '&#36;');
            return this.createListValueElement(i, value, 1);
        });

        infinityScroll.assignData(data);
        infinityScroll.show();

        if (localVariables?.length > 4) {
            scrollBox.addClass('on');
        } else {
            scrollBox.removeClass('on');
        }
        simpleBar.recalculate();
    }

    updateFuncSettingView(func) {
        const view = this.funcSettingView;
        if (!view) {
            return;
        }

        if (func.type === 'value') {
            view.func.resultCheck.addClass('on');
        } else {
            view.func.resultCheck.removeClass('on');
        }

        if (func.useLocalVariables) {
            view.func.localVarCheck.addClass('on');
            this.funcSettingView.minus.removeAttribute('disabled');
            this.funcSettingView.plus.removeAttribute('disabled');
            this.funcSettingView.lengthInput.removeAttribute('disabled');
            this.funcSettingView?.countGroup?.removeAttribute('disabled');
        } else {
            view.func.localVarCheck.removeClass('on');
            this.funcSettingView.minus.setAttribute('disabled', '');
            this.funcSettingView.plus.setAttribute('disabled', '');
            this.funcSettingView.lengthInput.setAttribute('disabled', '');
            this.funcSettingView?.countGroup?.setAttribute('disabled', '');
        }

        this.updateFuncScrollBar(func);
    }

    /**
     * @param {object} variable
     */
    renderFunctionReference(func) {
        const createElement = Entry.createElement;
        const funcId = func.id;
        const hasInFunction = this.hasFuncBlockInFunction(funcId);
        const callers = [...this._functionRefs].filter(
            (item) => item.block.data.type === `func_${funcId}`
        );

        func.usedView && $(func.usedView).remove();
        const wrapper = createElement('div').addClass('use_block');

        const boxSubject = createElement('span')
            .addClass('box_sjt')
            .appendTo(wrapper);

        if (callers.length) {
            boxSubject.textContent = Entry.Utils.stringFormat(
                Lang.Workspace.use_block_objects1,
                callers.length
            );
            const listView = createElement('ul')
                .addClass('obj_list')
                .appendTo(wrapper);
            const fragment = document.createDocumentFragment();
            callers.forEach((caller) => {
                const element = createElement('li');
                const object = caller.object;
                if (!object.entity) {
                    return;
                }
                !caller.object.thumbnailView_ && caller.object.generateView();
                const thumb = element.appendChild(caller.object.thumbnailView_.cloneNode());
                thumb.addClass('thmb');
                element.appendChild(thumb);
                const nameElement = createElement('span').addClass('text');
                nameElement.textContent = caller.object.name;
                element.appendChild(nameElement);
                element.bindOnClick(() => {
                    if (Entry.playground.object != caller.object) {
                        Entry.container.selectObject();
                        Entry.container.selectObject(caller.object.id, true);
                    }
                    Entry.playground.toggleOnVariableView();
                    const block = caller.block;
                    const blockView = block.view;
                    blockView && blockView.getBoard().setSelectedBlock(block.view);
                    Entry.playground.changeViewMode('variable');
                });
                fragment.appendChild(element);
            });
            listView.appendChild(fragment);
        } else {
            const caution = createElement('div')
                .addClass('caution_dsc')
                .appendTo(wrapper);
            caution.textContent = Lang.Workspace.no_use;
            boxSubject.textContent = Lang.Workspace.use_block_objects2;
        }

        if (hasInFunction) {
            const usedInFunction = createElement('div')
                .addClass('used_function_dsc')
                .appendTo(wrapper);
            usedInFunction.textContent = Lang.Workspace.use_block_function;
        }

        func.usedView = wrapper;
        this.funcSettingView && this.funcSettingView.appendChild(wrapper);
    }

    /**
     * update list view
     */
    updateList() {
        const listView = this.listView_;
        if (!listView) {
            return;
        }

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
        this.updateSelected();
    }

    updateFuncVariableList() {
        [
            ...(Entry.block?.set_func_variable?.events?.updateFuncVariableList || []),
            ...(Entry.block?.get_func_variable?.events?.updateFuncVariableList || []),
        ].forEach((fn) => {
            if (_isFunction(fn)) {
                fn();
            }
        });
    }

    makeChildVariableViews(arr, viewFunc, parent = this.listView_) {
        return _.each(arr, (data) => {
            !data.listElement && viewFunc(data);
            if (this._isPythonMode()) {
                $(data.listElement)
                    .find('input')
                    .each(function() {
                        $(this).attr('disabled', 'disabled');
                    });
            } else {
                $(data.listElement)
                    .find('input')
                    .each(function() {
                        $(this).removeAttr('disabled');
                    });
            }
            parent.appendChild(data.listElement);
        });
    }

    clearListElement() {
        const clearList = [this.listView_];
        for (const elem of clearList) {
            while (elem && elem.firstChild) {
                elem.removeChild(elem.lastChild);
            }
        }

        const arrItems = [this.messages_, this.variables_, this.lists_, this.functions_];
        arrItems.forEach((items) => {
            Object.values(items).forEach((item) => {
                if (item.listElement) {
                    item.listElement
                        .removeClass('unfold')
                        .removeClass('selected')
                        .addClass('fold');
                }
            });
        });

        if (this.listSettingView) {
            $(this.listSettingView).remove();
            delete this.listSettingView;
        }
        if (this.variableSettingView) {
            $(this.variableSettingView).remove();
            delete this.variableSettingView;
        }
        if (this.funcSettingView) {
            $(this.funcSettingView).remove();
            delete this.funcSettingView;
        }
    }

    updateAllTab() {
        const createElement = Entry.createElement;
        const listView = this.listView_;
        const listWrapper = createElement('div').addClass(
            'entryVariableSplitterWorkspace unfold all'
        );

        const listBox = createElement('div')
            .addClass('attr_box unfold')
            .appendTo(listWrapper);

        const list = createElement('div')
            .addClass('list')
            .appendTo(listBox);

        this.makeChildVariableViews(this.messages_, this.createMessageView.bind(this), list);
        this.makeChildVariableViews(this.variables_, this.createVariableView.bind(this), list);
        this.makeChildVariableViews(this.lists_, this.createListView.bind(this), list);
        this.makeChildVariableViews(this.functions_, this.createFunctionView.bind(this), list);
        listView.appendChild(listWrapper);
    }

    updateMessageTab() {
        const createElement = Entry.createElement;
        const listView = this.listView_;

        if (Entry.isTextMode) {
            this.messageAddButton_.unBindOnClick().addClass('disabled');
        } else {
            this.messageAddButton_
                .unBindOnClick()
                .bindOnClick(() => Entry.do('variableContainerClickMessageAddButton'))
                .removeClass('disabled');
        }
        listView.appendChild(this.messageAddButton_);
        listView.appendChild(this.messageAddPanel.view);

        const messageList = createElement('div').addClass(
            'entryVariableSplitterWorkspace message unfold'
        );

        const messageListBox = createElement('div')
            .addClass('attr_box')
            .appendTo(messageList);

        const list = createElement('div')
            .addClass('list')
            .appendTo(messageListBox);

        this.makeChildVariableViews(this.messages_, this.createMessageView.bind(this), list);
        listView.appendChild(messageList);
    }

    updateVariableTab() {
        const createElement = Entry.createElement;
        const listView = this.listView_;
        const info = this.variableAddPanel.info;
        if (info.object && !Entry.playground.object) {
            info.object = null;
        }

        if (Entry.isTextMode) {
            this.variableAddButton_.unBindOnClick().addClass('disabled');
        } else {
            this.variableAddButton_
                .unBindOnClick()
                .bindOnClick(() => Entry.do('variableContainerClickVariableAddButton'))
                .removeClass('disabled');
        }

        listView.appendChild(this.variableAddButton_);
        listView.appendChild(this.variableAddPanel.view);

        //global list container
        const globalList = createElement('div').addClass(
            'entryVariableSplitterWorkspace variable global'
        );
        let isGlobalFolded = false;

        const globalListTitle = Entry.createElement('a')
            .addClass('attr_link')
            .bindOnClick(() => {
                isGlobalFolded = !isGlobalFolded;
                this.foldTab(globalList, isGlobalFolded, gLength);
            })
            .appendTo(globalList);

        const globalListBox = createElement('div')
            .addClass('attr_box')
            .appendTo(globalList);

        //local list container
        const localList = createElement('div').addClass(
            'entryVariableSplitterWorkspace variable local'
        );
        let isLocalFolded = false;

        const localListTitle = Entry.createElement('a')
            .addClass('attr_link')
            .bindOnClick(() => {
                isLocalFolded = !isLocalFolded;
                this.foldTab(localList, isLocalFolded, lLength);
            })
            .appendTo(localList);

        const localListBox = createElement('div')
            .addClass('attr_box')
            .appendTo(localList);

        const { globalV, localV } = _.groupBy(this.variables_, ({ object_ }) =>
            object_ ? 'localV' : 'globalV'
        );

        const gLength = (globalV || []).length;
        const lLength = (localV || []).length;
        globalListTitle.textContent = `${Lang.Workspace.Variable_used_at_all_objects} (${gLength})`;
        // eslint-disable-next-line max-len
        localListTitle.textContent = `${Lang.Workspace.Variable_used_at_special_object} (${lLength})`;
        this.foldTab(globalList, isGlobalFolded, gLength);
        this.foldTab(localList, isLocalFolded, lLength);

        listView.appendChild(globalList);
        this.makeChildVariableViews(globalV, this.createVariableView.bind(this), globalListBox);
        listView.appendChild(localList);
        this.makeChildVariableViews(localV, this.createVariableView.bind(this), localListBox);
        this.updateVariableAddView('variable');
    }

    foldTab(tab, isFold, count = 0) {
        if (!count) {
            return;
        }
        if (isFold) {
            tab.removeClass('unfold');
            tab.addClass('fold');
        } else {
            tab.addClass('unfold');
            tab.removeClass('fold');
        }
    }

    updateListTab() {
        const createElement = Entry.createElement;
        const listView = this.listView_;
        const info = this.listAddPanel.info;
        if (info.object && !Entry.playground.object) {
            info.object = null;
        }

        if (Entry.isTextMode) {
            this.listAddButton_.unBindOnClick().addClass('disabled');
        } else {
            this.listAddButton_
                .unBindOnClick()
                .bindOnClick(() => Entry.do('variableContainerClickListAddButton'))
                .removeClass('disabled');
        }
        listView.appendChild(this.listAddButton_);
        listView.appendChild(this.listAddPanel.view);

        //global list container
        const globalList = createElement('div').addClass(
            'entryVariableSplitterWorkspace list global'
        );
        let isGlobalFolded = false;

        const globalListTitle = Entry.createElement('a')
            .addClass('attr_link')
            .bindOnClick(() => {
                isGlobalFolded = !isGlobalFolded;
                this.foldTab(globalList, isGlobalFolded, gLength);
            })
            .appendTo(globalList);

        const globalListBox = createElement('div')
            .addClass('attr_box')
            .appendTo(globalList);

        //local list container
        const localList = createElement('div').addClass(
            'entryVariableSplitterWorkspace list local'
        );
        let isLocalFolded = false;

        const localListTitle = Entry.createElement('a')
            .addClass('attr_link')
            .bindOnClick(() => {
                isLocalFolded = !isLocalFolded;
                this.foldTab(localList, isLocalFolded, lLength);
            })
            .appendTo(localList);

        const localListBox = createElement('div')
            .addClass('attr_box')
            .appendTo(localList);

        const { localV, globalV } = _.groupBy(this.lists_, ({ object_ }) =>
            object_ ? 'localV' : 'globalV'
        );

        const gLength = (globalV || []).length;
        const lLength = (localV || []).length;
        globalListTitle.textContent = `${Lang.Workspace.List_used_all_objects} (${gLength})`;
        localListTitle.textContent = `${Lang.Workspace.list_used_specific_objects} (${lLength})`;
        this.foldTab(globalList, isGlobalFolded, gLength);
        this.foldTab(localList, isLocalFolded, lLength);

        listView.appendChild(globalList);
        this.makeChildVariableViews(globalV, this.createListView.bind(this), globalListBox);
        listView.appendChild(localList);
        this.makeChildVariableViews(localV, this.createListView.bind(this), localListBox);
        this.updateVariableAddView('variable');
    }

    updateFuncTab() {
        const createElement = Entry.createElement;
        const listView = this.listView_;

        if (Entry.isTextMode) {
            this.functionAddButton_.unBindOnClick().addClass('disabled');
        } else {
            this.functionAddButton_
                .unBindOnClick()
                .bindOnClick(() => Entry.do('funcEditStart', Entry.generateHash()))
                .removeClass('disabled');
        }
        listView.appendChild(this.functionAddButton_);

        const funcList = createElement('div').addClass(
            'entryVariableSplitterWorkspace func unfold'
        );

        const funcListBox = createElement('div')
            .addClass('attr_box')
            .appendTo(funcList);

        this.makeChildVariableViews(
            this.functions_,
            this.createFunctionView.bind(this),
            funcListBox
        );
        listView.appendChild(funcList);
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
    }

    /**
     * @param {!Array.<variable model>} variables
     */
    setVariables(variables = [], options) {
        variables.forEach((variable) => {
            variable = Entry.Variable.create(variable);
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
        if (_.isEmpty(Entry.container.sttValue)) {
            this.generateStt();
            if (options?.aiUtilizeBlocks?.includes('audio')) {
                Entry.container.sttValue.setVisible(true);
            }
        }

        Entry.playground.reloadPlayground();
    }

    generateVariable(variable, data, key) {
        const name = variable.name_;
        variable.name_ = this.checkAllVariableName(name, key)
            ? Entry.getOrderedName(name, data, 'name_')
            : name;
        variable.generateView(data.length);
    }

    /**
     * @param {!Array.<variable model>} variables
     */
    appendVariables(variables) {
        for (const i in variables) {
            const variable = Entry.Variable.create(variables[i]);
            if (!variable.id_) {
                variable.id_ = Entry.generateHash();
            }
            const type = variable.getType();
            if (type === 'variable' || type === 'slide') {
                if (this.variables_.some((item) => item.id_ === variable.id_)) {
                    continue;
                }
                this.generateVariable(variable, this.variables_, 'variables_');
                this.variables_.push(variable);
            } else if (type === 'list') {
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
        if (Entry.isEmpty(Entry.container.sttValue)) {
            Entry.variableContainer.generateStt();
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

        const isDuplecate = funcsParamNames.some(({ name }) => funcParamName === name);

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
        return info.reduce((acc, { name }) => (acc += name), '');
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
            Entry.modal.alert(
                Lang.Msgs.warning_function_aleady_being_edited,
                Lang.Workspace.function_create
            );
            return;
        }
        Entry.Func.edit(new Entry.Func(data));
        Entry.Func.save();
        this.select(Entry.Func.targetFunc);
    }

    removeBlocksInFunctionByType(blockType) {
        Object.values(this.functions_).forEach((func) => {
            Entry.do('funcEditStart', func.id).isPass(true);
            func.content.getBlockList(false, blockType).forEach((b, index) => {
                Entry.do('destroyBlock', b).isPass(true);
            });
            Entry.do('funcEditEnd', 'save').isPass(true);
        });
    }

    removeBlocksInFunctionByType2(blockType) {
        Object.values(this.functions_).forEach((func) => {
            func.content.getBlockList(false, blockType).forEach((block, index) => {
                block.destroy();
            });
        });
    }

    async removeBlocksInFunctionByTypeAsync(blockType) {
        await Promise.all(
            Object.values(this.functions_).map(async (func) => {
                await Promise.all(
                    func.content.getBlockList(false, blockType).map(
                        Entry.Utils.runAsyncCurry((block) => {
                            block.destroy();
                        })
                    )
                );
            })
        );
    }

    isUsedBlockTypeInFunction(blockType) {
        return Object.values(this.functions_).some(
            (func) => func.content.getBlockList(false, blockType).length
        );
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

    removeNotPythonSupportedFunction() {
        const functions = this.functions_;
        Object.values(functions).forEach((func) => {
            const isNotPythonSupport = func.useLocalVariables || func.type === 'value';
            if (isNotPythonSupport) {
                const functionId = func.id;
                func.destroy();
                delete functions[functionId];
                const functionType = `func_${functionId}`;
                Entry.container.removeFuncBlocks(functionType);
                for (const id in functions) {
                    functions[id].content.removeBlocksByType(functionType);
                }
            }
        });
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
        this.hasBlockInFunction.cache.clear();
        this.hasParamBlockInFunction.cache.clear();
        this.hasFuncBlockInFunction.cache.clear();
        /* add to function list when not exist */
        const ws = Entry.getMainWS();

        if (ws && ws.overlayModefrom == Entry.Workspace.MODE_VIMBOARD) {
            if (func && func.description) {
                const funcName = func.description.substring(1, func.description.length - 1);
                const alertMsg = Entry.TextCodingUtil.validateNameIncludeSpace(
                    funcName,
                    'function'
                );
                if (alertMsg) {
                    Entry.modal.alert(alertMsg);
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
            func.listElement.nameField.textContent = func.description;
        }

        this.updateList();
    }

    /**
     * @param {Entry.Func} func
     */
    createFunctionView(func) {
        const createElement = Entry.createElement;

        const view = Entry.createElement('div').addClass('list default_func');

        const that = this;
        const editBoxWrapper = createElement('div')
            .addClass('inpt_box')
            .bindOnClick((e) => {
                e.stopPropagation();
                if (!Entry.isTextMode) {
                    if (Entry.Func.isEdit) {
                        Entry.Func._backupContent = null;
                        Entry.Func.save();
                    }
                    Entry.do('funcEditStart', func.id);
                }

                return this.select(func);
            })
            .appendTo(view);
        const editBoxInputWrapper = createElement('div')
            .addClass('inpt')
            .appendTo(editBoxWrapper);
        const editBoxInput = createElement('span')
            .addClass('input')
            .appendTo(editBoxInputWrapper);
        editBoxInput.textContent = func.description;
        editBoxInput.setAttribute('autocomplete', 'off');

        const ArrowDownButton = createElement('div')
            .addClass('arrowDown')
            .appendTo(editBoxWrapper);

        const delButton = createElement('a')
            .addClass('del')
            .bindOnClick((e) => {
                e.stopPropagation();
                Entry.modal.confirm(Lang.Workspace.will_you_delete_function).then((result) => {
                    if (result === true) {
                        this.destroyFunction(func);
                        this.selected = null;
                    }
                });
            })
            .appendTo(editBoxWrapper);
        delButton.href = '#';
        view.nameField = editBoxInput;
        func.listElement = view;
    }

    async destroyFunction(func) {
        if (Entry.Func.targetFunc) {
            Entry.do('funcEditEnd', 'cancel');
        }
        const currentObjectId = Entry.playground.object.id;
        Entry.do('selectObject', currentObjectId);
        const functionType = `func_${func.id}`;
        await Entry.Utils.removeBlockByTypeAsync(functionType);
        Entry.do('funcRemove', func).isPass(true);
        Entry.do('selectObject', currentObjectId).isPass(true);
    }

    /**
     * Add variable
     * @param {Entry.Variable} variable
     * @return {boolean} return true when success
     */
    checkAllVariableName(name, variable, key = 'name_') {
        return this[variable].some(({ [key]: name_ }) => name_ === name);
    }

    _addVariableOrList(type, data) {
        if (!type) {
            return;
        }
        const panel = this._getAddPanel(type);
        const name = panel.view.name.value.trim();

        if (Entry.isTextMode) {
            const alertMsg = Entry.TextCodingUtil.validateNameIncludeSpace(name, type);
            if (alertMsg) {
                Entry.modal.alert(alertMsg);
                this.resetVariableAddPanel(type);
                return;
            }
        }

        const target = `${type}s_`;

        data = data || this._makeVariableData(type);

        this.resetVariableAddPanel(type);

        if (!(data instanceof Entry.Variable)) {
            data = Entry.Variable.create(data);
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

        this.select(data);
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
            const alertMsg = Entry.TextCodingUtil.validateNameIncludeSpace(name, 'variable');
            if (alertMsg) {
                Entry.modal.alert(alertMsg);
                variable.listElement.nameField.value = variable.name_;
                return;
            }
        }

        if (Entry.isExist(name, 'name_', this.variables_)) {
            return this.changeVariableNameDuplicated(variable, 'variable', name);
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
            const alertMsg = Entry.TextCodingUtil.validateNameIncludeSpace(name, 'list');
            if (alertMsg) {
                Entry.modal.alert(alertMsg);
                list.listElement.nameField.value = list.name_;
                return;
            }
        }

        if (Entry.isExist(name, 'name_', this.lists_)) {
            return this.changeVariableNameDuplicated(list, 'list', name);
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
     * @param {Entry.Variable} variable or list
     * @param {string} type [variable, list]
     * @param {string} name
     */
    changeVariableNameDuplicated(variable, type, name) {
        const variables = this[`${type}s_`].filter(({ id_ }) => id_ !== variable.id_);
        const newName = Entry.getOrderedName(
            this._truncName(name, type, this._maxNameLength),
            variables,
            'name_'
        );

        variable.setName(newName);
        variable.listElement.nameField.value = newName;

        Entry.playground.reloadPlayground();
        Entry.toast.warning(Lang.Workspace[`${type}_rename`], Lang.Workspace[`${type}_dup`]);
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
        const createElement = Entry.createElement;

        const variableWrapper = createElement('div').addClass('list fold');

        if (!variable.object_) {
            if (variable.isCloud_) {
                variableWrapper.addClass('cloud_variable');
            } else if (variable.isRealTime_) {
                variableWrapper.addClass('real_time_variable');
            } else {
                variableWrapper.addClass('default_val');
            }
        } else {
            variableWrapper.addClass('local_val');
        }

        const editBoxWrapper = createElement('div')
            .addClass('inpt_box')
            .bindOnClick((e) => {
                e.stopPropagation();

                if (that.variableSettingView) {
                    $(that.variableSettingView).remove();
                    delete that.variableSettingView;
                }

                if (that.selected === variable) {
                    if (!that._isPythonMode()) {
                        editBoxInput.blur();
                    }
                    that.select(variable);
                    that.updateSelectedVariable(null, 'variable');
                } else {
                    Entry.do('setVariableEditable', variable.id_);
                }
            })
            .appendTo(variableWrapper);
        const watchButton = createElement('a')
            .addClass('watch')
            .bindOnClick((e) => {
                e.stopPropagation();
                Entry.do('variableSetVisibility', variable.id_, !variable.isVisible());
                if (variable.isVisible()) {
                    watchButton.addClass('on');
                } else {
                    watchButton.removeClass('on');
                }
            })
            .appendTo(editBoxWrapper);
        if (variable.isVisible()) {
            watchButton.addClass('on');
        } else {
            watchButton.removeClass('on');
        }
        watchButton.href = '#';
        const editBoxInputWrapper = createElement('div')
            .addClass('inpt')
            .appendTo(editBoxWrapper);
        const editBoxInput = createElement('input')
            .addClass('editBoxInput')
            .bindOnClick((e) => {
                e.stopPropagation();
            })
            .appendTo(editBoxInputWrapper);
        editBoxInput.setAttribute('autocomplete', 'off');
        editBoxInput.setAttribute('type', 'text');
        editBoxInput.setAttribute('name', 'inpt_name');
        editBoxInput.value = variable.name_;
        editBoxInput.onblur = function() {
            const value = this.value.trim();
            if (!value) {
                Entry.toast.alert(Lang.Msgs.warn, Lang.Msgs.variable_can_not_space);
                this.value = variable.getName();
                return this.focus();
            }
            const targetVariable = that.getVariable(variable.getId());
            targetVariable && Entry.do('variableSetName', targetVariable.getId(), value);
        };
        editBoxInput.onkeydown = Entry.Utils.blurWhenEnter;
        const ArrowDownButton = createElement('div')
            .addClass('arrowDown')
            .appendTo(editBoxWrapper);
        const delButton = createElement('a')
            .addClass('del')
            .bindOnClick((e) => {
                e.stopPropagation();
                Entry.do('variableContainerRemoveVariable', variable);
            })
            .appendTo(editBoxWrapper);
        delButton.href = '#';
        variableWrapper.nameField = editBoxInput;
        variable.listElement = variableWrapper;
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

        const {
            listElement: { nameField },
        } = message;
        const { playground, toast } = Entry;

        if (exist) {
            return failFunc(
                message.name,
                Lang.Workspace.message_rename_failed,
                Lang.Workspace.message_dup
            );
        } else if (name.length > EntryStatic.messageMaxLength) {
            return failFunc(
                message.name,
                Lang.Workspace.message_rename_failed,
                Lang.Workspace.message_too_long_to_change
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
        const createElement = Entry.createElement;

        const view = Entry.createElement('div').addClass('list default_message');

        const editBoxWrapper = createElement('div')
            .addClass('inpt_box')
            .bindOnClick((e) => {
                e.stopPropagation();
                return this.select(message);
            })
            .appendTo(view);
        const editBoxInputWrapper = createElement('div')
            .addClass('inpt')
            .appendTo(editBoxWrapper);
        const editBoxInput = createElement('input')
            .addClass('editBoxInput')
            .bindOnClick((e) => {
                e.stopPropagation();
            })
            .appendTo(editBoxInputWrapper);
        editBoxInput.setAttribute('autocomplete', 'off');
        editBoxInput.setAttribute('type', 'text');
        editBoxInput.value = message.name;
        editBoxInput.onfocus = Entry.Utils.setFocused;
        editBoxInput.onblur = Entry.Utils.setBlurredTimer(function() {
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
        }, 200);
        editBoxInput.onkeydown = Entry.Utils.blurWhenEnter;

        const ArrowDownButton = createElement('div')
            .addClass('arrowDown')
            .appendTo(editBoxWrapper);

        const delButton = createElement('a')
            .addClass('del')
            .bindOnClick((e) => {
                e.stopPropagation();
                Entry.do('variableContainerRemoveMessage', message);
            })
            .appendTo(editBoxWrapper);
        delButton.href = '#';
        view.nameField = editBoxInput;
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
    createListView(list) {
        const that = this;
        const createElement = Entry.createElement;

        const listWrapper = createElement('div')
            .addClass('list fold')
            .appendTo(this.globalListBox);

        if (!list.object_) {
            if (list.isCloud_) {
                listWrapper.addClass('cloud_list');
            } else if (list.isRealTime_) {
                listWrapper.addClass('real_time_list');
            } else {
                listWrapper.addClass('default_list');
            }
        } else {
            listWrapper.addClass('local_list');
        }

        const editBoxWrapper = createElement('div')
            .addClass('inpt_box')
            .bindOnClick((e) => {
                e.stopPropagation();

                if (that.listSettingView) {
                    $(that.listSettingView).remove();
                    delete that.listSettingView;
                }

                if (that.selected === list) {
                    editBoxInput.blur();
                    that.select(list);
                    that.updateSelectedVariable(null, 'list');
                } else {
                    Entry.do('setListEditable', list.id_);
                }
            })
            .appendTo(listWrapper);
        const watchButton = createElement('a')
            .addClass('watch')
            .bindOnClick((e) => {
                e.stopPropagation();
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
        const editBoxInputWrapper = createElement('div')
            .addClass('inpt')
            .appendTo(editBoxWrapper);
        const editBoxInput = createElement('input')
            .addClass('editBoxInput')
            .bindOnClick((e) => {
                e.stopPropagation();
            })
            .appendTo(editBoxInputWrapper);
        editBoxInput.setAttribute('autocomplete', 'off');
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
        const ArrowDownButton = createElement('div')
            .addClass('arrowDown')
            .appendTo(editBoxWrapper);
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

    mapFunc(mapFunction, param) {
        Object.values(this.functions_).forEach(_.partial(mapFunction, _, param));
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
            .map((v) => (v.toJSON ? v.toJSON() : v));
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
            (acc, { id, content, type = 'normal', useLocalVariables, localVariables }) => [
                ...acc,
                {
                    id,
                    type,
                    localVariables,
                    useLocalVariables,
                    content: content.stringify(),
                },
            ],
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
        info.isRealTime = false;
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

        // 변수 만들기 폼
        const variableAddSpace = createElement('div').addClass(
            'entryVariableAddSpaceWorkspace off'
        );
        this.variableAddPanel.view = variableAddSpace;
        this.variableAddPanel.isOpen = false;

        const variableAddSpaceDataWrapper = createElement('div')
            .addClass('entryVariableAddSpaceDataWrapperWorkspace')
            .appendTo(variableAddSpace);

        // 입력 폼
        const addSpaceNameWrapper = createElement('div')
            .addClass('entryVariableAddSpaceNameWrapperWorkspace')
            .appendTo(variableAddSpaceDataWrapper);

        const addSpaceInputLabel = createElement('label')
            .addClass('entryVariableAddSpaceInputLabelWorkspace')
            .appendTo(addSpaceNameWrapper);
        addSpaceInputLabel.setAttribute('for', 'entryVariableAddSpaceInputWorkspace');
        addSpaceInputLabel.innerText = Lang.Workspace.Variable_placeholder_name;

        const addSpaceInput = createElement('input')
            .addClass('entryVariableAddSpaceInputWorkspace')
            .appendTo(addSpaceNameWrapper);
        addSpaceInput.setAttribute('autocomplete', 'off');
        addSpaceInput.setAttribute('type', 'text');
        addSpaceInput.id = 'entryVariableAddSpaceInputWorkspace';
        addSpaceInput.setAttribute('placeholder', Lang.Workspace.Variable_placeholder_content);
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

        const addSpaceSelectWrapper = createElement('div')
            .addClass('entryVariableAddSpaceSelectWrapperWorkspace')
            .appendTo(variableAddSpaceDataWrapper);
        const addSpaceGlobalButton = createElement('a')
            .addClass('button entryVariableAddSpaceGlobalButtonrWorkspace on')
            .bindOnClick(() => {
                addSpaceLocalButton.removeClass('on');
                addSpaceGlobalButton.addClass('on');
                variableTypeWrapper.addClass('on');
                return Entry.do('variableAddSetScope', 'global');
            })
            .appendTo(addSpaceSelectWrapper);
        addSpaceGlobalButton.textContent = Lang.Workspace.use_all_objects;
        this.variableAddPanel.view.globalCheck = addSpaceGlobalButton;

        const addSpaceLocalButton = createElement('a')
            .addClass('button entryVariableAddSpaceLocalButtonrWorkspace')
            .bindOnClick(() => {
                addSpaceGlobalButton.removeClass('on');
                addSpaceLocalButton.addClass('on');
                variableTypeWrapper.removeClass('on');
                return Entry.do('variableAddSetScope', 'local');
            })
            .appendTo(addSpaceSelectWrapper);
        addSpaceLocalButton.textContent = Lang.Workspace.Variable_use_this_object;
        this.variableAddPanel.view.localCheck = addSpaceLocalButton;

        const variableTypeWrapper = createElement('div')
            .addClass('entryVariableTypeBoxWrapper on')
            .appendTo(variableAddSpaceDataWrapper);

        ['normal', 'cloud', 'real_time'].forEach((type) => {
            const wrapper = createElement('div')
                .addClass(`entryVariableTypeWrapper`)
                .appendTo(variableTypeWrapper)
                .bindOnClick((e) => {
                    e.stopImmediatePropagation();
                    const { object, isCloud, isRealTime } = this.variableAddPanel.info;
                    !object && Entry.do('variableAddSetCloud', type);
                    this.#removeChildrenClass(variableTypeWrapper, 'on');
                    wrapper.addClass('on');
                });
            if (type === 'normal') {
                wrapper.addClass('on');
            }
            createElement('span')
                .addClass(`entryVariable${type}RadioButton radioButton`)
                .appendTo(wrapper);
            createElement('span')
                .addClass(`entryVariable${type}Text`, 'entryVariableAddSpaceCheckWorkspace')
                .appendTo(wrapper).textContent = Lang.Workspace[`variable_create_${type}`];
        });
        variableAddSpace.cloudWrapper = variableTypeWrapper;
        this.variableAddPanel.view.cloudCheck = variableTypeWrapper;

        // 확인 취소 버튼
        const addSpaceButtonWrapper = createElement('div')
            .addClass('entryVariableAddSpaceButtonWrapperWorkspace')
            .appendTo(variableAddSpace);

        const addSpaceCancelButton = createElement('a')
            .addClass('entryVariableAddSpaceCancelWorkspace')
            .addClass('entryVariableAddSpaceButtonWorkspace')
            .bindOnClick(() => {
                this.variableAddPanel.view.addClass('off');
                this.resetVariableAddPanel('variable');
            })
            .appendTo(addSpaceButtonWrapper);
        addSpaceCancelButton.href = '#';
        addSpaceCancelButton.textContent = Lang.Buttons.cancel;

        const addSpaceConfirmButton = createElement('a')
            .addClass('entryVariableAddSpaceConfirmWorkspace')
            .addClass('entryVariableAddSpaceButtonWorkspace')
            .bindOnClick(() => {
                that._addVariable();
            })
            .appendTo(addSpaceButtonWrapper);
        addSpaceConfirmButton.textContent = Lang.Buttons.add_variable;
        this.variableAddConfirmButton = addSpaceConfirmButton;
    }

    _addVariable() {
        const variableInput = Entry.getDom(['variableContainer', 'variableAddInput']);
        this.variableAddPanel.view.addClass('off');
        const blurCallback = () => {
            delete variableInput.blurCallback;
            Entry.do(
                'variableContainerAddVariable',
                Entry.Variable.create(this._makeVariableData('variable'))
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
        this.resetVariableAddPanel('variable');
    }

    _addList() {
        const listInput = Entry.getDom(['variableContainer', 'listAddInput']);
        this.listAddPanel.view.addClass('off');
        const blurCallback = () => {
            Entry.do(
                'variableContainerAddList',
                Entry.Variable.create(this._makeVariableData('list'))
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
        this.resetVariableAddPanel('list');
    }

    generateListAddView() {
        const createElement = Entry.createElement;
        const _setFocused = Entry.Utils.setFocused;
        const _setBlurredTimer = Entry.Utils.setBlurredTimer;

        const that = this;

        // 리스트 만들기 폼
        const listAddSpace = createElement('div').addClass('entryVariableAddSpaceWorkspace off');
        this.listAddPanel.view = listAddSpace;
        this.listAddPanel.isOpen = false;

        const variableAddSpaceDataWrapper = createElement('div')
            .addClass('entryVariableAddSpaceDataWrapperWorkspace')
            .appendTo(listAddSpace);

        // 리스트 만들기
        const addSpaceNameWrapper = createElement('div')
            .addClass('entryVariableAddSpaceNameWrapperWorkspace')
            .appendTo(variableAddSpaceDataWrapper);

        const addSpaceInputLabel = createElement('label')
            .addClass('entryVariableAddSpaceInputLabelWorkspace')
            .appendTo(addSpaceNameWrapper);
        addSpaceInputLabel.innerText = Lang.Workspace.list_name;
        addSpaceInputLabel.setAttribute('for', 'entryVariableAddSpaceInputWorkspace');

        const addSpaceInput = createElement('input')
            .addClass('entryVariableAddSpaceInputWorkspace')
            .appendTo(addSpaceNameWrapper);
        addSpaceInput.setAttribute('autocomplete', 'off');
        addSpaceInput.setAttribute('type', 'text');
        addSpaceInput.id = 'entryVariableAddSpaceInputWorkspace';
        addSpaceInput.setAttribute('placeholder', Lang.Workspace.list_create_placeholder);
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
        this.listAddPanel.view.name = addSpaceInput;

        const addSpaceSelectWrapper = createElement('div')
            .addClass('entryVariableAddSpaceSelectWrapperWorkspace')
            .appendTo(variableAddSpaceDataWrapper);

        const addSpaceGlobalButton = createElement('a')
            .addClass('button entryVariableAddSpaceGlobalButtonrWorkspace on')
            .bindOnClick(() => {
                addSpaceLocalButton.removeClass('on');
                addSpaceGlobalButton.addClass('on');
                variableTypeWrapper.addClass('on');
                return Entry.do('listAddSetScope', 'global');
            })
            .appendTo(addSpaceSelectWrapper);
        addSpaceGlobalButton.textContent = Lang.Workspace.use_all_objects;
        this.listAddPanel.view.globalCheck = addSpaceGlobalButton;

        const addSpaceLocalButton = createElement('a')
            .addClass('button entryVariableAddSpaceLocalButtonrWorkspace')
            .bindOnClick(() => {
                addSpaceGlobalButton.removeClass('on');
                addSpaceLocalButton.addClass('on');
                variableTypeWrapper.removeClass('on');
                return Entry.do('listAddSetScope', 'local');
            })
            .appendTo(addSpaceSelectWrapper);
        addSpaceLocalButton.textContent = Lang.Workspace.Variable_use_this_object;
        this.listAddPanel.view.localCheck = addSpaceLocalButton;

        const variableTypeWrapper = createElement('div')
            .addClass('entryVariableTypeBoxWrapper on')
            .appendTo(variableAddSpaceDataWrapper);

        ['normal', 'cloud', 'real_time'].forEach((type) => {
            const wrapper = createElement('div')
                .addClass(`entryVariableTypeWrapper`)
                .appendTo(variableTypeWrapper)
                .bindOnClick((e) => {
                    e.stopImmediatePropagation();
                    const { object } = this.listAddPanel.info;
                    !object && Entry.do('listAddSetCloud', type);
                    this.#removeChildrenClass(variableTypeWrapper, 'on');
                    wrapper.addClass('on');
                });
            if (type === 'normal') {
                wrapper.addClass('on');
            }
            createElement('span')
                .addClass(`entryVariable${type}RadioButton radioButton`)
                .appendTo(wrapper);
            createElement('span')
                .addClass(`entryVariable${type}Text`, 'entryVariableAddSpaceCheckWorkspace')
                .appendTo(wrapper).textContent = Lang.Workspace[`list_create_${type}`];
        });
        listAddSpace.cloudWrapper = variableTypeWrapper;
        this.listAddPanel.view.cloudCheck = variableTypeWrapper;

        // 확인 취소 버튼
        const addSpaceButtonWrapper = createElement('div')
            .addClass('entryVariableAddSpaceButtonWrapperWorkspace')
            .appendTo(listAddSpace);

        const addSpaceCancelButton = createElement('a')
            .addClass('entryVariableAddSpaceCancelWorkspace')
            .addClass('entryVariableAddSpaceButtonWorkspace')
            .bindOnClick(() => {
                this.listAddPanel.view.addClass('off');
                this.resetVariableAddPanel('list');
            })
            .appendTo(addSpaceButtonWrapper);
        addSpaceCancelButton.href = '#';
        addSpaceCancelButton.textContent = Lang.Buttons.cancel;

        const addSpaceConfirmButton = createElement('a')
            .addClass('entryVariableAddSpaceConfirmWorkspace')
            .addClass('entryVariableAddSpaceButtonWorkspace')
            .bindOnClick(() => {
                that._addList();
            })
            .appendTo(addSpaceButtonWrapper);
        addSpaceConfirmButton.href = '#';
        addSpaceConfirmButton.textContent = Lang.Buttons.add_list;
        this.listAddConfirmButton = addSpaceConfirmButton;
    }

    generateMessageAddView() {
        const createElement = Entry.createElement;
        const that = this;

        // 신호 만들기 폼
        const msgAddSpace = createElement('div').addClass('message_inpt off');
        this.messageAddPanel.view = msgAddSpace;
        this.messageAddPanel.isOpen = false;

        const msdAddSpaceWrapper = createElement('div')
            .addClass('msdAddSpaceWrapper')
            .appendTo(msgAddSpace);

        const boxSubject = Entry.createElement('span')
            .addClass('box_sjt')
            .appendTo(msdAddSpaceWrapper);
        boxSubject.textContent = Lang.Workspace.Message_placeholder_name;

        const msgNameInput = createElement('input').appendTo(msdAddSpaceWrapper);
        msgNameInput.setAttribute('autocomplete', 'off');
        msgNameInput.setAttribute('type', 'text');
        msgNameInput.setAttribute('placeholder', Lang.Workspace.message_create_placeholder);
        msgNameInput.onkeydown = Entry.Utils.whenEnter(function() {
            if (this.enterKeyDisabled) {
                this.blur();
            } else {
                const value = msgNameInput.value;
                if (value.length > EntryStatic.messageMaxLength) {
                    return Entry.toast.alert(
                        Lang.Workspace.message_add_fail,
                        Lang.Workspace.message_too_long
                    );
                }
                that.messageAddPanel.isOpen = false;
                msgAddSpace.addClass('off');
                msgNameInput.value = '';
                Entry.do('variableContainerAddMessage', {
                    id: Entry.generateHash(),
                    name: Entry.getOrderedName(
                        value || Lang.Workspace.message,
                        that.messages_,
                        'name'
                    ),
                });
            }
        });
        this.messageAddPanel.view.name = msgNameInput;

        const buttonWrapper = createElement('div')
            .addClass('entryVariableAddSpaceButtonWrapperWorkspace')
            .appendTo(msgAddSpace);

        const msgCancel = createElement('a')
            .addClass('entryVariableAddSpaceCancelWorkspace')
            .addClass('entryVariableAddSpaceButtonWorkspace')
            .bindOnClick(() => {
                msgAddSpace.addClass('off');
                msgNameInput.value = '';
                this.messageAddPanel.isOpen = false;
            })
            .appendTo(buttonWrapper);
        msgCancel.href = '#';
        msgCancel.textContent = Lang.Buttons.cancel;

        const msgConfirm = createElement('a')
            .addClass('entryVariableAddSpaceConfirmWorkspace')
            .addClass('entryVariableAddSpaceButtonWorkspace')
            .bindOnClick(() => {
                const value = msgNameInput.value;
                if (value.length > EntryStatic.messageMaxLength) {
                    return Entry.toast.alert(
                        Lang.Workspace.message_add_fail,
                        Lang.Workspace.message_too_long
                    );
                }
                this.messageAddPanel.isOpen = false;
                msgAddSpace.addClass('off');
                msgNameInput.value = '';
                Entry.do('variableContainerAddMessage', {
                    id: Entry.generateHash(),
                    name: Entry.getOrderedName(
                        value || Lang.Workspace.message,
                        this.messages_,
                        'name'
                    ),
                });
            })
            .appendTo(buttonWrapper);
        msgConfirm.href = '#';
        msgConfirm.textContent = Lang.Buttons.add_message;

        msgAddSpace.nameField = msgNameInput;
    }

    /**
     * 자료형 블록메뉴에서 변수, 리스트 추가 버튼 클릭시 발생하는 함수
     * 패널을 속성탭으로 옮기고 해당 타입의 컨테이너를 오픈한다.
     * @param type {'variable'|'list'|'message'}
     */
    openVariableAddPanel(type = 'variable') {
        Entry.playground.toggleOnVariableView();
        Entry.playground.changeViewMode('variable');
        switch (type) {
            case 'variable':
                this.selectFilter(type);
                this.updateVariableAddView(type);
                this.clickVariableAddButton(true);
                break;
            case 'list':
                this.selectFilter(type);
                this.updateVariableAddView(type);
                this.clickListAddButton(true);
                break;
            case 'message':
                this.selectFilter(type);
                this.clickMessageAddButton(true);
                break;
        }
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
        const x = 240 - (Lang.Workspace.Variable_Timer.length * 12 + 70);
        timer =
            timer ||
            Entry.Variable.create({
                id: Entry.generateHash(),
                name: Lang.Workspace.Variable_Timer,
                value: 0,
                variableType: 'timer',
                visible: false,
                x,
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
            Entry.Variable.create({
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

    generateStt(answer) {
        answer =
            answer ||
            Entry.Variable.create({
                id: Entry.generateHash(),
                name: Lang.template.voice_title_text,
                value: '-',
                variableType: 'stt',
                visible: false,
            });
        answer.generateView();
        Entry.container.sttValue = answer;
    }

    generateVariableSettingView(variable) {
        const that = this;
        const createElement = Entry.createElement;
        const _setFocused = Entry.Utils.setFocused;
        const _setBlurredTimer = Entry.Utils.setBlurredTimer;

        // 변수 속성 설정
        const element = createElement('div')
            .addClass('attr_inner_box')
            .bindOnClick((e) => e.stopPropagation());
        if (this.variableSettingView) {
            $(this.variableSettingView).remove();
            delete this.variableSettingView;
        }
        this.variableSettingView = element;

        const varAttr = createElement('div')
            .addClass('val_attr')
            .appendTo(element);
        const boxSubject = createElement('span')
            .addClass('box_sjt')
            .appendTo(varAttr);
        boxSubject.textContent = Lang.Workspace.Variable_property;

        const valTypeText = Entry.createElement('span')
            .addClass('val_type_txt')
            .appendTo(varAttr);

        if (variable.isRealTime_) {
            valTypeText.textContent = Lang.Menus.realtime;
        } else if (variable.isCloud_) {
            valTypeText.textContent = Lang.Menus.cloud;
        }

        // 기본 값 입력 창
        const attrInputBox = createElement('div')
            .addClass('attr_inpt')
            .appendTo(varAttr);
        if (this._isPythonMode()) {
            attrInputBox.addClass('hidden');
        }

        const attrInputLabel = createElement('label').appendTo(attrInputBox);
        attrInputLabel.setAttribute('for', 'attr_cnt');
        attrInputLabel.textContent = Lang.Workspace.variable_default_value;

        const attrInputWrapper = createElement('span')
            .appendTo(attrInputBox)
            .addClass('val_inptbox');
        const attrInput = createElement('input').appendTo(attrInputWrapper);
        attrInput.setAttribute('autocomplete', 'off');
        attrInput.setAttribute('type', 'text');
        attrInput.value = 0;
        attrInput.onkeypress = Entry.Utils.blurWhenEnter;
        attrInput.onfocus = _setFocused;
        attrInput.onblur = _setBlurredTimer(function() {
            const v = that.selected;
            if (!v) {
                console.error('error: not selected');
                return;
            }
            Entry.do('variableSetDefaultValue', v.id_, this.value);
        });
        element.initValueInput = attrInput;

        // 슬라이드 입력창
        const slideInputBox = createElement('div')
            .addClass('slide_inpt')
            .appendTo(varAttr);

        const slideCheckBox = createElement('div')
            .addClass('chk_box')
            .appendTo(slideInputBox);
        element.slideCheck = createElement('span')
            .addClass('entryVariableAddSpaceCheckWorkspace')
            .bindOnClick(() => {
                const v = that.selected;
                Entry.do(
                    'variableSetSlidable',
                    v.id_,
                    v.getType() === 'variable' ? 'slide' : 'variable'
                );
            })
            .appendTo(slideCheckBox);
        const slideCheckText = createElement('span')
            .addClass('chk_text')
            .appendTo(slideCheckBox);
        slideCheckText.textContent = Lang.Workspace.slide;

        // 최소 최대 영역
        const slideCountBox = createElement('div')
            .addClass('cnt_box')
            .appendTo(slideInputBox);

        const minValueInput = createElement('input').appendTo(slideCountBox);
        minValueInput.textContent = Lang.Workspace.min_value;
        minValueInput.setAttribute('autocomplete', 'off');
        minValueInput.setAttribute('type', 'text');

        const v = that.selected;
        const vType = _.result(v, 'type');

        if (vType === 'slide') {
            minValueInput.value = v.minValue_;
        } else {
            minValueInput.value = 0;
        }
        minValueInput.onkeypress = Entry.Utils.blurWhenEnter;
        minValueInput.onfocus = _setFocused;
        minValueInput.onblur = _setBlurredTimer(function() {
            const v = that.selected;
            let value = this.value;
            value = Entry.Utils.isNumber(value) ? value : v.getMinValue();
            Entry.do('variableSetMinValue', v.id_, value);
        });
        element.minValueInput = minValueInput;

        createElement('span')
            .addClass('dash')
            .appendTo(slideCountBox).textContent = '~';

        const maxValueInput = createElement('input').appendTo(slideCountBox);
        maxValueInput.textContent = Lang.Workspace.max_value;
        maxValueInput.setAttribute('type', 'text');
        maxValueInput.setAttribute('autocomplete', 'off');

        if (vType === 'slide') {
            maxValueInput.value = v.maxValue_;
        } else {
            maxValueInput.value = 100;
        }

        maxValueInput.onkeypress = Entry.Utils.blurWhenEnter;
        maxValueInput.onfocus = _setFocused;
        maxValueInput.onblur = _setBlurredTimer(function() {
            const v = that.selected;
            let value = this.value;
            value = Entry.Utils.isNumber(value) ? value : v.getMaxValue();
            Entry.do('variableSetMaxValue', v.id_, value);
        });
        element.maxValueInput = maxValueInput;
        this.renderVariableReference(variable);
    }

    /**
     * @param {object|Entry.Variable} object
     */
    updateVariableSettingView(v) {
        const view = this.variableSettingView;
        if (!view) {
            return;
        }
        const {
            initValueInput: initValue,
            slideCheck: slide,
            minValueInput: minValue,
            maxValueInput: maxValue,
        } = view;

        slide.removeClass('on');
        if (v.getType() === 'slide') {
            slide.addClass('on');
            minValue.removeAttribute('disabled');
            maxValue.removeAttribute('disabled');
            minValue.value = v.getMinValue();
            maxValue.value = v.getMaxValue();
        } else {
            minValue.setAttribute('disabled', 'disabled');
            maxValue.setAttribute('disabled', 'disabled');
        }

        initValue.value = v.getValue();
        v.listElement.appendChild(view);
    }

    /**
     * 속성 > 리스트 편집창 표기
     */
    generateListSettingView(list) {
        const createElement = Entry.createElement;

        // 리스트 속성 설정
        const element = createElement('div')
            .addClass('attr_inner_box')
            .bindOnClick((e) => e.stopPropagation());
        if (this.listSettingView) {
            $(this.listSettingView).remove();
            delete this.listSettingView;
        }
        this.listSettingView = element;

        const listAttr = createElement('div')
            .addClass('list_attr')
            .appendTo(element);
        if (this._isPythonMode()) {
            listAttr.addClass('hidden');
        }
        const boxSubject = createElement('span')
            .addClass('box_sjt')
            .appendTo(listAttr);
        boxSubject.textContent = Lang.Workspace.list_property;

        const valTypeText = Entry.createElement('span')
            .addClass('val_type_txt')
            .appendTo(listAttr);

        if (list.isRealTime_) {
            valTypeText.textContent = Lang.Menus.realtime;
        } else if (list.isCloud_) {
            valTypeText.textContent = Lang.Menus.cloud;
        }

        this.generateListImportExportView(listAttr);
        this.generateListCountView(listAttr);
        this.generateListValuesView(listAttr);
        this.renderVariableReference(list);
    }

    generateListImportExportView(element) {
        const that = this;
        const createElement = Entry.createElement;

        const buttonBox = createElement('div')
            .addClass('btn_box')
            .appendTo(element);

        const buttonExport = createElement('a')
            .addClass('btn_list')
            .bindOnClick((e) => {
                e.stopPropagation();
                const { name_ } = that.selected;
                const array_ = that.selected.getArray();
                if (array_.length === 0) {
                    Entry.modal.alert(Lang.Menus.nothing_to_export);
                } else {
                    Entry.dispatchEvent('openExportListModal', array_, name_);
                }
            })
            .appendTo(buttonBox);
        buttonExport.textContent = Lang.Workspace.list_export;

        const buttonImport = createElement('a')
            .addClass('btn_list')
            .bindOnClick((e) => {
                e.stopPropagation();
                Entry.dispatchEvent('openImportListModal');
            })
            .appendTo(buttonBox);
        buttonImport.textContent = Lang.Workspace.list_import;
    }

    generateListCountView(element) {
        const that = this;
        const createElement = Entry.createElement;

        const listCount = createElement('div')
            .addClass('list_cnt')
            .appendTo(element);

        const countSubject = createElement('span')
            .addClass('cnt_sjt')
            .appendTo(listCount);
        countSubject.textContent = Lang.Workspace.number_of_list;

        const countInputBox = createElement('div')
            .addClass('cnt_inpt')
            .appendTo(listCount);

        const buttonMinus = createElement('a')
            .addClass('btn_cnt')
            .bindOnClick(() => {
                const {
                    selected: { id_ },
                } = that;
                Entry.do('listChangeLength', id_, 'minus');
            })
            .appendTo(countInputBox);
        buttonMinus.href = '#';
        buttonMinus.setAttribute('tabindex', '-1');
        this.listSettingView.minus = buttonMinus;

        //List limit setting. [default value:5000, length: 4]
        let limitValue = 5000;
        let maxlength = 4;

        const countInput = createElement('input').appendTo(countInputBox);
        countInput.setAttribute('autocomplete', 'off');
        countInput.setAttribute('type', 'text');
        countInput.setAttribute('maxlength', maxlength);

        countInput.onblur = function() {
            const v = that.selected;
            let value = this.value;
            const array_ = v.getArray();
            value = Entry.Utils.isNumber(value) ? value : array_.length;

            if (value >= limitValue) {
                value = limitValue;
            }

            Entry.do('listChangeLength', v.id_, Number(value));
        };
        countInput.onkeypress = Entry.Utils.blurWhenEnter;
        this.listSettingView.lengthInput = countInput;

        const array_ = that.selected.getArray();
        if (array_ && array_.length > 0) {
            const currentLeng = array_.length.toString().length;
            // 리스트 카운트가 5000 일떄만 설정
            maxlength = currentLeng > maxlength ? currentLeng : maxlength;
            limitValue = array_.length > limitValue ? array_.length : limitValue;
        }

        const buttonPlus = createElement('a')
            .addClass('btn_cnt plus')
            .bindOnClick(() => {
                const {
                    selected: { id_ },
                } = that;

                const array_ = Entry.variableContainer.selected.getArray();
                const selectedLength = array_.length;

                if (selectedLength >= limitValue) {
                    Entry.do('listChangeLength', id_, '');
                } else {
                    Entry.do('listChangeLength', id_, 'plus');
                }
            })
            .appendTo(countInputBox);
        buttonPlus.href = '#';
        buttonPlus.setAttribute('tabindex', '-1');
        this.listSettingView.plus = buttonPlus;
    }

    generateListValuesView(element) {
        const createElement = Entry.createElement;

        const countGroup = createElement('div')
            .addClass('cnt_group')
            .appendTo(element);
        const countLabel = createElement('div')
            .addClass('cnt_label')
            .appendTo(countGroup);
        countLabel.textContent = Lang.Workspace.list_default_value;
        const scrollBox = createElement('div')
            .addClass('scroll_box')
            .appendTo(countGroup);
        const el = new SimpleBar(scrollBox, { autoHide: false });
        const parent = /* html */ `<ol class="cnt_list">{1}</ol>`;
        this.listSettingView.countGroup = countGroup;
        this.listSettingView.scrollBox = scrollBox;
        this.listSettingView.simpleBar = el;
        this.listSettingView.listValues = el.getContentElement();
        this.listSettingView.infinityScroll = new Entry.VirtualScroll(
            this.listSettingView.listValues,
            {
                dataWrapper: parent,
                itemHeight: 35,
                groupSize: 10,
            }
        );
    }

    createListValueElement(index, value, startIndex = 0) {
        return `
        <li>
            <span class="cnt">${+index + startIndex}</span>
            <input value="${xssFilters.inDoubleQuotedAttr(
                value
            )}" type="text" data-index="${index}"/>
            <a class="del" data-index="${index}"></a>
        </li>`.trim();
    }

    updateListSettingView(list) {
        const view = this.listSettingView;
        const that = this;
        if (!view) {
            return;
        }
        list = list || this.selected;
        const { infinityScroll, countGroup, listValues, lengthInput, simpleBar, scrollBox } = view;
        const arr = list.getArray() || [];
        lengthInput.value = arr.length;

        if (arr.length > 4) {
            scrollBox.addClass('on');
        } else {
            scrollBox.removeClass('on');
        }
        list.listElement.appendChild(view);
        //remove element and event bindings
        const $listValues = $(listValues);
        $listValues.empty();
        $listValues.off();
        const startIndex = Entry.getMainWS().mode === Entry.Workspace.MODE_VIMBOARD ? 0 : 1;

        if (arr?.length === 0) {
            countGroup?.addClass('entryRemove');
            return;
        }
        countGroup?.removeClass('entryRemove');

        if (arr.length) {
            const data = arr.map((data, i) => {
                const item = data?.data || '';
                const value = String(item).replace(/\$/g, '&#36;');
                return this.createListValueElement(i, value, startIndex);
            });
            infinityScroll.assignData(data);
            infinityScroll.show();
            $listValues.on(
                'keyup',
                'input',
                _.debounce((e) => {
                    const { target } = e;
                    const index = target.getAttribute('data-index');
                    data[index] = this.createListValueElement(index, target.value, startIndex);
                    list.getArray()[index] = { data: target.value };
                    list.updateView();
                })
            );
            $listValues.on('focus', 'input', Entry.Utils.setFocused);
            $listValues.on('keypress', 'input', Entry.Utils.blurWhenEnter);
            $listValues.on('click', 'a', function() {
                const index = this.getAttribute('data-index');
                arr.splice(index, 1);
                that.updateListSettingView();
            });
        }
        simpleBar.recalculate();
        list.updateView();
    }

    setListLength(list, value) {
        value = Number(value);
        const arr = this.selected.getArray();
        const times = value - arr.length;
        if (times && Entry.Utils.isNumber(value)) {
            if (times > 0) {
                _.times(times, () => this.selected.appendValue(0));
            } else {
                arr.length = value;
            }
        }
        this.updateListSettingView();
    }

    updateViews() {
        [...this.variables_, ...this.lists_].forEach((v) => v.updateView());
    }

    updateSelectedVariable(object, type = 'variable') {
        const objectType = _.result(object, 'type');
        if (this.selected) {
            this.selected.listElement.removeClass('unfold');
            this.selected.listElement.addClass('fold');
        }
        if (!object) {
            if (type === 'variable') {
                this.selected = null;
            } else {
                this.selected = null;
            }
        } else if (objectType === 'variable' || objectType === 'slide') {
            this.selected = object;
            this.selected.listElement.removeClass('fold');
            this.selected.listElement.addClass('unfold');
            if (!this.variableSettingView) {
                this.generateVariableSettingView(object);
            }
            this.updateVariableSettingView(object);
        } else if (objectType === 'list') {
            this.selected = object;
            this.selected.listElement.removeClass('fold');
            this.selected.listElement.addClass('unfold');
            if (!this.listSettingView) {
                this.generateListSettingView(object);
            }
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

    addRef(type, blockData) {
        const wsMode = _.result(Entry.getMainWS(), 'getMode');
        if (!this.view_ || wsMode !== Entry.Workspace.MODE_BOARD) {
            return;
        }

        const datum = {
            object: blockData.getCode().object,
            block: blockData,
        };

        this[type].push(datum);
        Entry.playground.viewMode_ !== 'default' && this.updateList();
        return datum;
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

        Entry.playground.viewMode_ !== 'default' && this.updateList();
    }

    updateSelected() {
        if (this.selected) {
            const selected = this.selected;
            this.selected = null;
            this.select(selected);
        }
    }

    getObjectVariables(blockList, keys) {
        const findFuncKeys = keys || {};
        let functions = [];
        const jsonData = this.getVariableJSONByBlockList(blockList);
        let variables = jsonData.variables;
        let messages = jsonData.messages;

        blockList.forEach((block) => {
            const type = block.type;
            if (type && type.indexOf('func_') === 0) {
                const id = type.substr(5);
                if (!findFuncKeys[id]) {
                    const func = this.functions_[id];
                    findFuncKeys[id] = true;
                    functions.push({
                        id,
                        content: JSON.stringify(func.content.toJSON()),
                        type: func.type,
                        localVariables: func.localVariables,
                        useLocalVariables: func.useLocalVariables,
                    });

                    const contentBlockList = func.content.getBlockList();
                    const jsonData = this.getObjectVariables(contentBlockList, findFuncKeys);
                    functions = _.unionBy(functions, jsonData.functions, 'id');
                    variables = _.unionBy(variables, jsonData.variables, 'id');
                    messages = _.unionBy(messages, jsonData.messages, 'id');
                }
            }
        });

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

        blockList.forEach((block) => {
            const data = block.data || {};
            const type = data.type;
            if (!type) {
                return;
            }
            const isMessage = _includes(EntryStatic.messageBlockList, type);
            const isVariable = _includes(EntryStatic.variableBlockList, type);

            if (isMessage || isVariable) {
                block.data.params.forEach((param) => {
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
            Lang.Workspace[`${type}_too_long`]
        );

        return name.substring(0, maxLen);
    }

    _maxNameLength = 10;

    clear() {
        this.select(null);
        const _removeFunc = _.partial(_.result, _, 'remove');
        const { engine = {}, container = {}, playground } = Entry;

        [...this.variables_, ...this.lists_].forEach(_removeFunc);
        _removeFunc(engine.projectTimer);
        _removeFunc(container.inputValue);
        _.each(this.functions_, this.removeFunction.bind(this));

        this.viewMode_ = 'all';
        this.variables_ = [];
        this.lists_ = [];
        this.messages_ = [];
        this.functions_ = {};

        this._variableRefs = [];
        this._messageRefs = [];
        this._functionRefs = [];

        Entry.Func.reset();
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

    _clickAddButton(type, forceOpen, doNotFocus) {
        const panel = this._getAddPanel(type);
        const panelView = panel.view;
        const panelViewName = panelView.name;
        if (panel.isOpen && !forceOpen) {
            panelView.addClass('off');
            panel.isOpen = false;
        } else {
            panelViewName.value = '';
            panelView.removeClass('off');
            !doNotFocus && Entry.Utils.focusIfNotActive(panelViewName);
            panel.isOpen = true;
        }
    }

    clickVariableAddButton(...args) {
        this._clickAddButton.call(this, 'variable', ...args);
        this.variableAddPanel.view.cloudCheck.addClass('on');
    }

    clickListAddButton(...args) {
        this._clickAddButton.call(this, 'list', ...args);
        this.listAddPanel.view.cloudCheck.addClass('on');
    }

    clickMessageAddButton(...args) {
        this._clickAddButton.call(this, 'message', ...args);
    }

    _makeVariableData(type = 'variable') {
        const {
            view,
            info: { isCloud, object, isRealTime },
        } = this._getAddPanel(type);

        let name = view.name.value.trim();
        if (_.isEmpty(name)) {
            name = Lang.Workspace[type];
        }

        name = this._truncName(name, type, this._maxNameLength);

        const target = `${type}s_`;
        if (this.checkAllVariableName(name, target)) {
            name = Entry.getOrderedName(name, this[target], 'name_');
            Entry.toast.warning(Lang.Workspace[`${type}_rename`], Lang.Workspace[`${type}_dup`]);
        }

        return {
            name,
            isCloud,
            isRealTime,
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
        const variables = this.variables_;
        const variableJSON = v.toJSON();
        variableJSON.variableType = type;
        const newVariable = Entry.Variable.create(variableJSON);
        variables.splice(variables.indexOf(v), 0, newVariable);
        if (value !== undefined) {
            variableJSON.value = value;
        }
        if (type === 'slide') {
            if (newVariable.getValue() < 0) {
                newVariable.setValue(0);
            } else if (newVariable.getValue() > 100) {
                newVariable.setValue(100);
            }
        }
        this.createVariableView(newVariable);
        this.removeVariable(v);
        this.updateSelectedVariable(newVariable);
        newVariable.generateView();
    }

    _getAddPanel(type = 'variable') {
        return this[`${type}AddPanel`];
    }

    getFunctionByBlockId(blockId) {
        return _find(this.functions_, (func) => func.getBlockById(blockId));
    }

    hasBlockInFunction = _memoize((blockId) =>
        _some(this.functions_, (func) => Boolean(func.getBlockById(blockId)))
    );

    hasParamBlockInFunction = _memoize((paramId) =>
        _some(this.functions_, (func) => Boolean(func.getBlockByParamId(paramId)))
    );

    hasFuncBlockInFunction = _memoize((funcId) =>
        _some(this.functions_, (func) => Boolean(func.getFuncBlockByFuncId(`func_${funcId}`)))
    );
};
