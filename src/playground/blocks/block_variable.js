module.exports = {
    getBlocks() {
        return {
            variableAddButton: {
                skeleton: 'basic_button',
                color: EntryStatic.colorSet.common.BUTTON_BACKGROUND,
                params: [
                    {
                        type: 'Text',
                        text: Lang.Workspace.variable_create,
                        color: EntryStatic.colorSet.common.BUTTON,
                        align: 'center',
                    },
                ],
                def: {
                    type: 'variableAddButton',
                },
                events: {
                    mousedown: [
                        function() {
                            Entry.variableContainer.openVariableAddPanel('variable');
                        },
                    ],
                },
                syntax: { js: [], py: [''] },
            },
            listAddButton: {
                skeleton: 'basic_button',
                color: EntryStatic.colorSet.common.BUTTON_BACKGROUND,
                params: [
                    {
                        type: 'Text',
                        text: Lang.Workspace.create_list_block,
                        color: EntryStatic.colorSet.common.BUTTON,
                        align: 'center',
                    },
                ],
                def: {
                    type: 'listAddButton',
                },
                events: {
                    mousedown: [
                        function() {
                            Entry.variableContainer.openVariableAddPanel('list');
                        },
                    ],
                },
            },
            ask_and_wait: {
                color: EntryStatic.colorSet.block.default.VARIABLE,
                outerLine: EntryStatic.colorSet.block.darken.VARIABLE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/variable_icon.svg',
                        size: 11,
                    },
                ],
                events: {
                    viewAdd: [
                        function() {
                            if (Entry.container) {
                                Entry.container.showProjectAnswer();
                            }
                        },
                    ],
                    viewDestroy: [
                        function(block, notIncludeSelf) {
                            if (Entry.container) {
                                Entry.container.hideProjectAnswer(block, notIncludeSelf);
                            }
                        },
                    ],
                },
                def: {
                    params: [
                        {
                            type: 'text',
                            params: [Lang.Blocks.block_hi],
                        },
                        null,
                    ],
                    type: 'ask_and_wait',
                },
                pyHelpDef: {
                    params: [
                        {
                            type: 'text',
                            params: ['A&value'],
                        },
                        null,
                    ],
                    type: 'ask_and_wait',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                class: 'ask',
                isNotFor: [],
                func(sprite, script) {
                    const inputModel = Entry.container.inputValue;
                    const inputView = Entry.stage.inputField;
                    const message = script.getValue('VALUE', script);

                    if (_.isUndefined(message) || message === '') {
                        throw new Error('message can not be empty');
                    }

                    if (inputModel.sprite == sprite && inputView && !inputView._isHidden) {
                        return script;
                    } else if (inputModel.sprite != sprite && script.isInit) {
                        if (sprite.dialog) {
                            sprite.dialog.remove();
                        }
                        delete script.isInit;
                        return script.callReturn();
                    } else if (
                        inputModel.complete &&
                        inputModel.sprite == sprite &&
                        inputView._isHidden &&
                        script.isInit
                    ) {
                        if (sprite.dialog) {
                            sprite.dialog.remove();
                        }
                        delete inputModel.complete;
                        delete script.isInit;
                        return script.callReturn();
                    } else {
                        Entry.stage.showInputField();
                        new Entry.Dialog(sprite, Entry.convertToRoundedDecimals(message, 3), 'ask');
                        inputModel.script = script;
                        inputModel.sprite = sprite;
                        inputModel.complete = false;
                        script.isInit = true;
                        return script;
                    }
                },
                syntax: { js: [], py: ['Entry.input(%1)'] },
            },
            get_canvas_input_value: {
                color: EntryStatic.colorSet.block.default.VARIABLE,
                outerLine: EntryStatic.colorSet.block.darken.VARIABLE,
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'Text',
                        text: Lang.Blocks.VARIABLE_get_canvas_input_value,
                        color: '#fff',
                    },
                ],
                events: {
                    viewAdd: [
                        function() {
                            if (Entry.container) {
                                Entry.container.showProjectAnswer();
                            }
                        },
                    ],
                    viewDestroy: [
                        function(block, notIncludeSelf) {
                            if (Entry.container) {
                                Entry.container.hideProjectAnswer(block, notIncludeSelf);
                            }
                        },
                    ],
                },
                def: {
                    params: [null],
                    type: 'get_canvas_input_value',
                },
                class: 'ask',
                isNotFor: [],
                func(sprite, script) {
                    return Entry.container.getInputValue();
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            template: '%1',
                            syntax: 'Entry.answer()',
                            blockType: 'param',
                            textParams: [
                                {
                                    type: 'Text',
                                    text: 'Entry.answer()',
                                    color: '#fff',
                                },
                            ],
                        },
                    ],
                },
            },
            set_visible_answer: {
                color: EntryStatic.colorSet.block.default.VARIABLE,
                outerLine: EntryStatic.colorSet.block.darken.VARIABLE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.CALC_timer_visible_show, 'SHOW'],
                            [Lang.Blocks.CALC_timer_visible_hide, 'HIDE'],
                        ],
                        value: 'SHOW',
                        fontSize: 10,
                        bgColor: EntryStatic.colorSet.block.darken.VARIABLE,
                        arrowColor: EntryStatic.colorSet.arrow.default.DEFAULT,
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/variable_icon.svg',
                        size: 11,
                    },
                ],
                events: {
                    viewAdd: [
                        function() {
                            if (Entry.container) {
                                Entry.container.showProjectAnswer();
                            }
                        },
                    ],
                    viewDestroy: [
                        function(block, notIncludeSelf) {
                            if (Entry.container) {
                                Entry.container.hideProjectAnswer(block, notIncludeSelf);
                            }
                        },
                    ],
                },
                def: {
                    params: ['HIDE', null],
                    type: 'set_visible_answer',
                },
                pyHelpDef: {
                    params: ['A&value', null],
                    type: 'set_visible_answer',
                },
                paramsKeyMap: {
                    BOOL: 0,
                },
                class: 'ask',
                isNotFor: [],
                func(sprite, script) {
                    const bool = script.getField('BOOL', script);
                    if (bool === 'HIDE') {
                        Entry.container.inputValue.setVisible(false);
                    } else {
                        Entry.container.inputValue.setVisible(true);
                    }
                    return script.callReturn();
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            syntax: 'Entry.answer_view(%1)',
                            textParams: [
                                {
                                    type: 'Dropdown',
                                    options: [
                                        [Lang.Blocks.CALC_timer_visible_show, 'SHOW'],
                                        [Lang.Blocks.CALC_timer_visible_hide, 'HIDE'],
                                    ],
                                    value: 'SHOW',
                                    fontSize: 11,
                                    arrowColor: EntryStatic.colorSet.arrow.default.VARIABLE,
                                    converter: Entry.block.converters.returnStringValueLowerCase,
                                    codeMap: 'Entry.CodeMap.Entry.set_visible_answer[0]',
                                },
                            ],
                        },
                    ],
                },
            },
            get_variable: {
                color: EntryStatic.colorSet.block.default.VARIABLE,
                outerLine: EntryStatic.colorSet.block.darken.VARIABLE,
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'variables',
                        fontSize: 10,
                        bgColor: EntryStatic.colorSet.block.darken.VARIABLE,
                        arrowColor: EntryStatic.colorSet.arrow.default.DEFAULT,
                    },
                    {
                        type: 'Text',
                        text: Lang.Blocks.VARIABLE_get_variable_1,
                        color: 'white',
                    },
                ],
                events: {
                    dataAdd: [
                        function(block) {
                            const vc = Entry.variableContainer;
                            if (vc) {
                                vc.addRef('_variableRefs', block);
                            }
                        },
                    ],
                    dataDestroy: [
                        function(block) {
                            const vc = Entry.variableContainer;
                            if (vc) {
                                vc.removeRef('_variableRefs', block);
                            }
                        },
                    ],
                },
                def: {
                    params: [null],
                    type: 'get_variable',
                },
                pyHelpDef: {
                    params: ['A&value'],
                    type: 'get_variable',
                },
                paramsKeyMap: {
                    VARIABLE: 0,
                },
                class: 'variable',
                isNotFor: ['variableNotExist'],
                func(sprite, script) {
                    const variableId = script.getField('VARIABLE', script);
                    const variable = Entry.variableContainer.getVariable(variableId, sprite);
                    return variable.getValue();
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            syntax: '%1',
                            passTest: true,
                            keyOption: 'get_variable',
                            blockType: 'param',
                            textParams: [
                                {
                                    type: 'DropdownDynamic',
                                    value: null,
                                    menuName: 'variables',
                                    fontSize: 11,
                                    arrowColor: EntryStatic.colorSet.arrow.default.VARIABLE,
                                    converter: Entry.block.converters.returnRawStringKey,
                                },
                            ],
                        },
                    ],
                },
            },
            change_variable: {
                color: EntryStatic.colorSet.block.default.VARIABLE,
                outerLine: EntryStatic.colorSet.block.darken.VARIABLE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'variables',
                        fontSize: 10,
                        bgColor: EntryStatic.colorSet.block.darken.VARIABLE,
                        arrowColor: EntryStatic.colorSet.arrow.default.DEFAULT,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/variable_icon.svg',
                        size: 11,
                    },
                ],
                events: {
                    dataAdd: [
                        function(block) {
                            const vc = Entry.variableContainer;
                            if (vc) {
                                vc.addRef('_variableRefs', block);
                            }
                        },
                    ],
                    dataDestroy: [
                        function(block) {
                            const vc = Entry.variableContainer;
                            if (vc) {
                                vc.removeRef('_variableRefs', block);
                            }
                        },
                    ],
                },
                def: {
                    params: [
                        null,
                        {
                            type: 'text',
                            params: ['10'],
                        },
                        null,
                    ],
                    type: 'change_variable',
                },
                pyHelpDef: {
                    params: [
                        'A&value',
                        {
                            type: 'text',
                            params: ['B&value'],
                        },
                        null,
                    ],
                    type: 'change_variable',
                },
                paramsKeyMap: {
                    VARIABLE: 0,
                    VALUE: 1,
                },
                class: 'variable',
                isNotFor: ['variableNotExist'],
                func(sprite, script) {
                    const variableId = script.getField('VARIABLE', script);
                    let value = script.getValue('VALUE', script);
                    let fixed = 0;

                    if (value == false && typeof value === 'boolean') {
                        throw new Error('Type is not correct');
                    }

                    const variable = Entry.variableContainer.getVariable(variableId, sprite);
                    const { isRealTime_ } = variable;
                    let variableValue = variable.getValue();
                    let sumValue;
                    if (Entry.Utils.isNumber(value) && variable.isNumber()) {
                        value = Entry.parseNumber(value);
                        variableValue = Entry.parseNumber(variableValue);
                        fixed = Entry.getMaxFloatPoint([value, variable.getValue()]);
                        sumValue = new BigNumber(value)
                            .plus(variableValue)
                            .toNumber()
                            .toFixed(fixed);
                    } else {
                        sumValue = `${variableValue}${value}`;
                    }
                    if (!isRealTime_) {
                        variable.setValue(sumValue);
                        return script.callReturn();
                    } else {
                        return new Promise(async (resolve, reject) => {
                            try {
                                await variable.setValue(sumValue);
                                resolve();
                            } catch (e) {
                                reject(e);
                            }
                        });
                    }
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            syntax: '%1 += %2',
                            passTest: true,
                            textParams: [
                                {
                                    type: 'DropdownDynamic',
                                    value: null,
                                    menuName: 'variables',
                                    fontSize: 11,
                                    arrowColor: EntryStatic.colorSet.arrow.default.VARIABLE,
                                    converter: Entry.block.converters.returnRawStringKey,
                                },
                                {
                                    type: 'Block',
                                    accept: 'string',
                                },
                            ],
                        },
                        {
                            syntax: '%1 = %1 + %2',
                            textParams: [
                                {
                                    type: 'DropdownDynamic',
                                    value: null,
                                    menuName: 'variables',
                                    fontSize: 11,
                                    arrowColor: EntryStatic.colorSet.arrow.default.VARIABLE,
                                    converter: Entry.block.converters.returnRawStringKey,
                                },
                                {
                                    type: 'Block',
                                    accept: 'string',
                                },
                            ],
                        },
                    ],
                },
            },
            set_variable: {
                color: EntryStatic.colorSet.block.default.VARIABLE,
                outerLine: EntryStatic.colorSet.block.darken.VARIABLE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'variables',
                        fontSize: 10,
                        bgColor: EntryStatic.colorSet.block.darken.VARIABLE,
                        arrowColor: EntryStatic.colorSet.arrow.default.DEFAULT,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/variable_icon.svg',
                        size: 11,
                    },
                ],
                events: {
                    dataAdd: [
                        function(block) {
                            const vc = Entry.variableContainer;
                            if (vc) {
                                vc.addRef('_variableRefs', block);
                            }
                        },
                    ],
                    dataDestroy: [
                        function(block) {
                            const vc = Entry.variableContainer;
                            if (vc) {
                                vc.removeRef('_variableRefs', block);
                            }
                        },
                    ],
                },
                def: {
                    params: [
                        null,
                        {
                            type: 'text',
                            params: ['10'],
                        },
                        null,
                    ],
                    type: 'set_variable',
                },
                pyHelpDef: {
                    params: [
                        'A&value',
                        {
                            type: 'text',
                            params: ['B&value'],
                        },
                        null,
                    ],
                    type: 'set_variable',
                },
                paramsKeyMap: {
                    VARIABLE: 0,
                    VALUE: 1,
                },
                class: 'variable',
                isNotFor: ['variableNotExist'],
                func(sprite, script) {
                    const variableId = script.getField('VARIABLE', script);
                    const value = script.getValue('VALUE', script);
                    const variable = Entry.variableContainer.getVariable(variableId, sprite);
                    const { isRealTime_ } = variable;

                    if (!isRealTime_) {
                        variable.setValue(value);
                        return script.callReturn();
                    } else {
                        return new Promise(async (resolve, reject) => {
                            try {
                                await variable.setValue(value);
                                resolve();
                            } catch (e) {
                                reject(e);
                            }
                        });
                    }
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            syntax: '%1 = %2',
                            passTest: true,
                            blockType: 'variable',
                            textParams: [
                                {
                                    type: 'DropdownDynamic',
                                    value: null,
                                    menuName: 'variables',
                                    fontSize: 11,
                                    arrowColor: EntryStatic.colorSet.arrow.default.VARIABLE,
                                    converter: Entry.block.converters.returnRawStringKey,
                                },
                                {
                                    type: 'Block',
                                    accept: 'string',
                                },
                            ],
                        },
                    ],
                },
            },
            show_variable: {
                color: EntryStatic.colorSet.block.default.VARIABLE,
                outerLine: EntryStatic.colorSet.block.darken.VARIABLE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'variables',
                        fontSize: 10,
                        bgColor: EntryStatic.colorSet.block.darken.VARIABLE,
                        arrowColor: EntryStatic.colorSet.arrow.default.DEFAULT,
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/variable_icon.svg',
                        size: 11,
                    },
                ],
                events: {
                    dataAdd: [
                        function(block) {
                            const vc = Entry.variableContainer;
                            if (vc) {
                                vc.addRef('_variableRefs', block);
                            }
                        },
                    ],
                    dataDestroy: [
                        function(block) {
                            const vc = Entry.variableContainer;
                            if (vc) {
                                vc.removeRef('_variableRefs', block);
                            }
                        },
                    ],
                },
                def: {
                    params: [null, null],
                    type: 'show_variable',
                },
                pyHelpDef: {
                    params: ['A&value', null],
                    type: 'show_variable',
                },
                paramsKeyMap: {
                    VARIABLE: 0,
                },
                class: 'variable_visibility',
                isNotFor: ['variableNotExist'],
                func(sprite, script) {
                    const variableId = script.getField('VARIABLE', script);
                    const variable = Entry.variableContainer.getVariable(variableId, sprite);
                    variable.setVisible(true);
                    variable.updateView();
                    return script.callReturn();
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            syntax: 'Entry.show_variable(%1)',
                            textParams: [
                                {
                                    type: 'DropdownDynamic',
                                    value: null,
                                    menuName: 'variables',
                                    fontSize: 11,
                                    arrowColor: EntryStatic.colorSet.arrow.default.VARIABLE,
                                    converter: Entry.block.converters.returnStringKey,
                                },
                            ],
                        },
                    ],
                },
            },
            hide_variable: {
                color: EntryStatic.colorSet.block.default.VARIABLE,
                outerLine: EntryStatic.colorSet.block.darken.VARIABLE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'variables',
                        fontSize: 10,
                        bgColor: EntryStatic.colorSet.block.darken.VARIABLE,
                        arrowColor: EntryStatic.colorSet.arrow.default.DEFAULT,
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/variable_icon.svg',
                        size: 11,
                    },
                ],
                events: {
                    dataAdd: [
                        function(block) {
                            const vc = Entry.variableContainer;
                            if (vc) {
                                vc.addRef('_variableRefs', block);
                            }
                        },
                    ],
                    dataDestroy: [
                        function(block) {
                            const vc = Entry.variableContainer;
                            if (vc) {
                                vc.removeRef('_variableRefs', block);
                            }
                        },
                    ],
                },
                def: {
                    params: [null, null],
                    type: 'hide_variable',
                },
                pyHelpDef: {
                    params: ['A&value', null],
                    type: 'hide_variable',
                },
                paramsKeyMap: {
                    VARIABLE: 0,
                },
                class: 'variable_visibility',
                isNotFor: ['variableNotExist'],
                func(sprite, script) {
                    const variableId = script.getField('VARIABLE', script);
                    const variable = Entry.variableContainer.getVariable(variableId, sprite);
                    variable.setVisible(false);
                    return script.callReturn();
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            syntax: 'Entry.hide_variable(%1)',
                            textParams: [
                                {
                                    type: 'DropdownDynamic',
                                    value: null,
                                    menuName: 'variables',
                                    fontSize: 11,
                                    arrowColor: EntryStatic.colorSet.arrow.default.VARIABLE,
                                    converter: Entry.block.converters.returnStringKey,
                                },
                            ],
                        },
                    ],
                },
            },
            value_of_index_from_list: {
                color: EntryStatic.colorSet.block.default.VARIABLE,
                outerLine: EntryStatic.colorSet.block.darken.VARIABLE,
                fontColor: '#fff',
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'Text',
                        text: Lang.Blocks.VARIABLE_value_of_index_from_list_1,
                        color: 'white',
                    },
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'lists',
                        fontSize: 10,
                        bgColor: EntryStatic.colorSet.block.darken.VARIABLE,
                        arrowColor: EntryStatic.colorSet.arrow.default.DEFAULT,
                    },
                    {
                        type: 'Text',
                        text: Lang.Blocks.VARIABLE_value_of_index_from_list_2,
                        color: 'white',
                    },
                    {
                        type: 'Block',
                        isListIndex: true,
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Text',
                        text: Lang.Blocks.VARIABLE_value_of_index_from_list_3,
                        color: 'white',
                    },
                ],
                events: {
                    dataAdd: [
                        function(block) {
                            const vc = Entry.variableContainer;
                            if (vc) {
                                vc.addRef('_variableRefs', block);
                            }
                        },
                    ],
                    dataDestroy: [
                        function(block) {
                            const vc = Entry.variableContainer;
                            if (vc) {
                                vc.removeRef('_variableRefs', block);
                            }
                        },
                    ],
                },
                def: {
                    params: [
                        null,
                        null,
                        null,
                        {
                            type: 'number',
                            params: ['1'],
                        },
                    ],
                    type: 'value_of_index_from_list',
                },
                pyHelpDef: {
                    params: [
                        null,
                        'A&value',
                        null,
                        {
                            type: 'number',
                            params: ['B&value'],
                        },
                    ],
                    type: 'value_of_index_from_list',
                },
                paramsKeyMap: {
                    LIST: 1,
                    INDEX: 3,
                },
                class: 'list_element',
                isNotFor: ['listNotExist'],
                func(sprite, script) {
                    const listId = script.getField('LIST', script);
                    let index = script.getValue('INDEX', script);
                    const list = Entry.variableContainer.getList(listId, sprite);
                    index = Entry.getListRealIndex(index, list);
                    const array = list.getArray();
                    if (!array || !Entry.Utils.isNumber(index) || index > array.length) {
                        throw new Error('can not insert value to array');
                    }

                    return array[index - 1].data;
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            syntax: '%2[%4]',
                            passTest: true,
                            blockType: 'param',
                            textParams: [
                                undefined,
                                {
                                    type: 'DropdownDynamic',
                                    value: null,
                                    menuName: 'lists',
                                    fontSize: 11,
                                    arrowColor: EntryStatic.colorSet.arrow.default.VARIABLE,
                                    converter: Entry.block.converters.returnRawStringKey,
                                },
                                undefined,
                                {
                                    type: 'Block',
                                    accept: 'string',
                                    paramType: 'index',
                                },
                            ],
                        },
                    ],
                },
            },
            add_value_to_list: {
                color: EntryStatic.colorSet.block.default.VARIABLE,
                outerLine: EntryStatic.colorSet.block.darken.VARIABLE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                    },
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'lists',
                        fontSize: 10,
                        bgColor: EntryStatic.colorSet.block.darken.VARIABLE,
                        arrowColor: EntryStatic.colorSet.arrow.default.DEFAULT,
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/variable_icon.svg',
                        size: 11,
                    },
                ],
                events: {
                    dataAdd: [
                        function(block) {
                            const vc = Entry.variableContainer;
                            if (vc) {
                                vc.addRef('_variableRefs', block);
                            }
                        },
                    ],
                    dataDestroy: [
                        function(block) {
                            const vc = Entry.variableContainer;
                            if (vc) {
                                vc.removeRef('_variableRefs', block);
                            }
                        },
                    ],
                },
                def: {
                    params: [
                        {
                            type: 'text',
                            params: ['10'],
                        },
                        null,
                        null,
                    ],
                    type: 'add_value_to_list',
                },
                pyHelpDef: {
                    params: [
                        {
                            type: 'text',
                            params: ['B&value'],
                        },
                        'A&value',
                        null,
                    ],
                    type: 'add_value_to_list',
                },
                paramsKeyMap: {
                    VALUE: 0,
                    LIST: 1,
                },
                class: 'list',
                isNotFor: ['listNotExist'],
                func(sprite, script) {
                    const listId = script.getField('LIST', script);
                    const value = script.getValue('VALUE', script);
                    const list = Entry.variableContainer.getList(listId, sprite);

                    if (!list.isCloud_) {
                        list.appendValue(value);
                        return script.callReturn();
                    } else {
                        return new Promise(async (resolve, reject) => {
                            try {
                                await list.appendValue(value);
                                resolve();
                            } catch (e) {
                                reject(e);
                            }
                        });
                    }
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            passTest: true,
                            syntax: '%2.append(%1)',
                            textParams: [
                                {
                                    type: 'Block',
                                    accept: 'string',
                                },
                                {
                                    type: 'DropdownDynamic',
                                    value: null,
                                    menuName: 'lists',
                                    fontSize: 11,
                                    arrowColor: EntryStatic.colorSet.arrow.default.VARIABLE,
                                    converter: Entry.block.converters.returnRawStringKey,
                                },
                            ],
                        },
                    ],
                },
            },
            remove_value_from_list: {
                color: EntryStatic.colorSet.block.default.VARIABLE,
                outerLine: EntryStatic.colorSet.block.darken.VARIABLE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        isListIndex: true,
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'lists',
                        fontSize: 10,
                        bgColor: EntryStatic.colorSet.block.darken.VARIABLE,
                        arrowColor: EntryStatic.colorSet.arrow.default.DEFAULT,
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/variable_icon.svg',
                        size: 11,
                    },
                ],
                events: {
                    dataAdd: [
                        function(block) {
                            const vc = Entry.variableContainer;
                            if (vc) {
                                vc.addRef('_variableRefs', block);
                            }
                        },
                    ],
                    dataDestroy: [
                        function(block) {
                            const vc = Entry.variableContainer;
                            if (vc) {
                                vc.removeRef('_variableRefs', block);
                            }
                        },
                    ],
                },
                def: {
                    params: [
                        {
                            type: 'number',
                            params: ['1'],
                        },
                        null,
                        null,
                    ],
                    type: 'remove_value_from_list',
                },
                pyHelpDef: {
                    params: [
                        {
                            type: 'number',
                            params: ['B&value'],
                        },
                        'A&value',
                        null,
                    ],
                    type: 'remove_value_from_list',
                },
                paramsKeyMap: {
                    VALUE: 0,
                    LIST: 1,
                },
                class: 'list',
                isNotFor: ['listNotExist'],
                func(sprite, script) {
                    const listId = script.getField('LIST', script);
                    const value = script.getValue('VALUE', script);
                    const list = Entry.variableContainer.getList(listId, sprite);
                    const array = list.getArray();
                    if (!array || !Entry.Utils.isNumber(value) || value > array.length) {
                        throw new Error('can not remove value from array');
                    }

                    const { isRealTime_ } = list;
                    if (!isRealTime_) {
                        list.deleteValue(+value);
                        return script.callReturn();
                    } else {
                        return new Promise(async (resolve, reject) => {
                            try {
                                await list.deleteValue(+value);
                                resolve();
                            } catch (e) {
                                reject(e);
                            }
                        });
                    }
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            syntax: '%2.pop(%1)',
                            passTest: true,
                            textParams: [
                                {
                                    type: 'Block',
                                    accept: 'string',
                                    paramType: 'index',
                                },
                                {
                                    type: 'DropdownDynamic',
                                    value: null,
                                    menuName: 'lists',
                                    fontSize: 11,
                                    arrowColor: EntryStatic.colorSet.arrow.default.VARIABLE,
                                    converter: Entry.block.converters.returnRawStringKey,
                                },
                            ],
                        },
                    ],
                },
            },
            insert_value_to_list: {
                color: EntryStatic.colorSet.block.default.VARIABLE,
                outerLine: EntryStatic.colorSet.block.darken.VARIABLE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                    },
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'lists',
                        fontSize: 10,
                        bgColor: EntryStatic.colorSet.block.darken.VARIABLE,
                        arrowColor: EntryStatic.colorSet.arrow.default.DEFAULT,
                    },
                    {
                        type: 'Block',
                        isListIndex: true,
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/variable_icon.svg',
                        size: 11,
                    },
                ],
                events: {
                    dataAdd: [
                        function(block) {
                            const vc = Entry.variableContainer;
                            if (vc) {
                                vc.addRef('_variableRefs', block);
                            }
                        },
                    ],
                    dataDestroy: [
                        function(block) {
                            const vc = Entry.variableContainer;
                            if (vc) {
                                vc.removeRef('_variableRefs', block);
                            }
                        },
                    ],
                },
                def: {
                    params: [
                        {
                            type: 'text',
                            params: ['10'],
                        },
                        null,
                        {
                            type: 'text',
                            params: ['1'],
                        },
                        null,
                    ],
                    type: 'insert_value_to_list',
                },
                pyHelpDef: {
                    params: [
                        {
                            type: 'text',
                            params: ['C&value'],
                        },
                        'A&value',
                        {
                            type: 'text',
                            params: ['B&value'],
                        },
                        null,
                    ],
                    type: 'insert_value_to_list',
                },
                paramsKeyMap: {
                    DATA: 0,
                    LIST: 1,
                    INDEX: 2,
                },
                class: 'list',
                isNotFor: ['listNotExist'],
                func(sprite, script) {
                    const listId = script.getField('LIST', script);
                    const [data, index] = script.getValues(['DATA', 'INDEX'], script);
                    const list = Entry.variableContainer.getList(listId, sprite);
                    const array = list.getArray();
                    if (
                        !array ||
                        !Entry.Utils.isNumber(index) ||
                        index == 0 ||
                        index > array.length + 1
                    ) {
                        throw new Error('can not insert value to array');
                    }

                    const { isRealTime_ } = list;
                    if (!isRealTime_) {
                        list.insertValue(index, data);
                        return script.callReturn();
                    } else {
                        return new Promise(async (resolve, reject) => {
                            try {
                                await list.insertValue(index, data);
                                resolve();
                            } catch (e) {
                                reject(e);
                            }
                        });
                    }
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            syntax: '%2.insert(%3, %1)',
                            passTest: true,
                            textParams: [
                                {
                                    type: 'Block',
                                    accept: 'string',
                                },
                                {
                                    type: 'DropdownDynamic',
                                    value: null,
                                    menuName: 'lists',
                                    fontSize: 11,
                                    arrowColor: EntryStatic.colorSet.arrow.default.VARIABLE,
                                    converter: Entry.block.converters.returnRawStringKey,
                                },
                                {
                                    type: 'Block',
                                    accept: 'string',
                                    paramType: 'index',
                                },
                            ],
                        },
                    ],
                },
            },
            change_value_list_index: {
                color: EntryStatic.colorSet.block.default.VARIABLE,
                outerLine: EntryStatic.colorSet.block.darken.VARIABLE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'lists',
                        fontSize: 10,
                        bgColor: EntryStatic.colorSet.block.darken.VARIABLE,
                        arrowColor: EntryStatic.colorSet.arrow.default.DEFAULT,
                    },
                    {
                        type: 'Block',
                        isListIndex: true,
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/variable_icon.svg',
                        size: 11,
                    },
                ],
                events: {
                    dataAdd: [
                        function(block) {
                            const vc = Entry.variableContainer;
                            if (vc) {
                                vc.addRef('_variableRefs', block);
                            }
                        },
                    ],
                    dataDestroy: [
                        function(block) {
                            const vc = Entry.variableContainer;
                            if (vc) {
                                vc.removeRef('_variableRefs', block);
                            }
                        },
                    ],
                },
                def: {
                    params: [
                        null,
                        {
                            type: 'text',
                            params: ['1'],
                        },
                        {
                            type: 'text',
                            params: ['10'],
                        },
                        null,
                    ],
                    type: 'change_value_list_index',
                },
                pyHelpDef: {
                    params: [
                        'A&value',
                        {
                            type: 'text',
                            params: ['B&value'],
                        },
                        {
                            type: 'text',
                            params: ['C&value'],
                        },
                        null,
                    ],
                    type: 'change_value_list_index',
                },
                paramsKeyMap: {
                    LIST: 0,
                    INDEX: 1,
                    DATA: 2,
                },
                class: 'list',
                isNotFor: ['listNotExist'],
                func(sprite, script) {
                    const listId = script.getField('LIST', script);
                    const [data, index] = script.getValues(['DATA', 'INDEX'], script);
                    const list = Entry.variableContainer.getList(listId, sprite);
                    const array = list.getArray();
                    if (!array || !Entry.Utils.isNumber(index) || index > array.length) {
                        throw new Error('can not insert value to array');
                    }

                    const { isRealTime_ } = list;
                    if (!isRealTime_) {
                        list.replaceValue(index, data);
                        return script.callReturn();
                    } else {
                        return new Promise(async (resolve, reject) => {
                            try {
                                await list.replaceValue(index, data);
                                resolve();
                            } catch (e) {
                                reject(e);
                            }
                        });
                    }
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            syntax: '%1[%2] = %3',
                            passTest: true,
                            textParams: [
                                {
                                    type: 'DropdownDynamic',
                                    value: null,
                                    menuName: 'lists',
                                    fontSize: 11,
                                    arrowColor: EntryStatic.colorSet.arrow.default.VARIABLE,
                                    converter: Entry.block.converters.returnRawStringKey,
                                },
                                {
                                    type: 'Block',
                                    accept: 'string',
                                    paramType: 'index',
                                },
                                {
                                    type: 'Block',
                                    accept: 'string',
                                },
                            ],
                        },
                    ],
                },
            },
            length_of_list: {
                color: EntryStatic.colorSet.block.default.VARIABLE,
                outerLine: EntryStatic.colorSet.block.darken.VARIABLE,
                fontColor: '#fff',
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'Text',
                        text: Lang.Blocks.VARIABLE_length_of_list_1,
                        color: 'white',
                    },
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'lists',
                        fontSize: 10,
                        bgColor: EntryStatic.colorSet.block.darken.VARIABLE,
                        arrowColor: EntryStatic.colorSet.arrow.default.DEFAULT,
                    },
                    {
                        type: 'Text',
                        text: Lang.Blocks.VARIABLE_length_of_list_2,
                        color: 'white',
                    },
                ],
                events: {
                    dataAdd: [
                        function(block) {
                            const vc = Entry.variableContainer;
                            if (vc) {
                                vc.addRef('_variableRefs', block);
                            }
                        },
                    ],
                    dataDestroy: [
                        function(block) {
                            const vc = Entry.variableContainer;
                            if (vc) {
                                vc.removeRef('_variableRefs', block);
                            }
                        },
                    ],
                },
                def: {
                    params: [null, null, null],
                    type: 'length_of_list',
                },
                pyHelpDef: {
                    params: [null, 'A&value', null],
                    type: 'length_of_list',
                },
                paramsKeyMap: {
                    LIST: 1,
                },
                class: 'list',
                isNotFor: ['listNotExist'],
                func(sprite, script) {
                    const listId = script.getField('LIST', script);
                    const list = Entry.variableContainer.getList(listId, sprite);
                    return list.getArray().length;
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            syntax: 'len(%2)',
                            blockType: 'param',
                            passTest: true,
                            textParams: [
                                undefined,
                                {
                                    type: 'DropdownDynamic',
                                    value: null,
                                    menuName: 'lists',
                                    fontSize: 11,
                                    arrowColor: EntryStatic.colorSet.arrow.default.VARIABLE,
                                    converter: Entry.block.converters.returnRawStringKey,
                                },
                            ],
                        },
                    ],
                },
            },
            is_included_in_list: {
                color: EntryStatic.colorSet.block.default.VARIABLE,
                outerLine: EntryStatic.colorSet.block.darken.VARIABLE,
                fontColor: '#fff',
                skeleton: 'basic_boolean_field',
                statements: [],
                params: [
                    {
                        type: 'Text',
                        text: Lang.Blocks.VARIABLE_is_included_in_list_1,
                        color: 'white',
                    },
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'lists',
                        fontSize: 10,
                        bgColor: EntryStatic.colorSet.block.darken.VARIABLE,
                        arrowColor: EntryStatic.colorSet.arrow.default.DEFAULT,
                    },
                    {
                        type: 'Text',
                        text: Lang.Blocks.VARIABLE_is_included_in_list_2,
                        color: 'white',
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                    },
                    {
                        type: 'Text',
                        text: Lang.Blocks.VARIABLE_is_included_in_list_3,
                        color: 'white',
                    },
                ],
                events: {
                    dataAdd: [
                        function(block) {
                            const vc = Entry.variableContainer;
                            if (vc) {
                                vc.addRef('_variableRefs', block);
                            }
                        },
                    ],
                    dataDestroy: [
                        function(block) {
                            const vc = Entry.variableContainer;
                            if (vc) {
                                vc.removeRef('_variableRefs', block);
                            }
                        },
                    ],
                },
                def: {
                    params: [
                        null,
                        null,
                        null,
                        {
                            type: 'text',
                            params: ['10'],
                        },
                        null,
                    ],
                    type: 'is_included_in_list',
                },
                pyHelpDef: {
                    params: [
                        null,
                        'B&value',
                        null,
                        {
                            type: 'text',
                            params: ['A&value'],
                        },
                        null,
                    ],
                    type: 'is_included_in_list',
                },
                paramsKeyMap: {
                    LIST: 1,
                    DATA: 3,
                },
                class: 'list',
                isNotFor: ['listNotExist'],
                func(sprite, script) {
                    const listId = script.getField('LIST', script);
                    const data = script.getStringValue('DATA', script);
                    const list = Entry.variableContainer.getList(listId, sprite);
                    if (!list) {
                        return false;
                    }
                    const arr = list.getArray();

                    for (let i = 0, len = arr.length; i < len; i++) {
                        if (arr[i].data.toString() == data.toString()) {
                            return true;
                        }
                    }
                    return false;
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            syntax: '%4 in %2',
                            blockType: 'param',
                            passTest: true,
                            textParams: [
                                undefined,
                                {
                                    type: 'DropdownDynamic',
                                    value: null,
                                    menuName: 'lists',
                                    fontSize: 11,
                                    arrowColor: EntryStatic.colorSet.arrow.default.VARIABLE,
                                    converter: Entry.block.converters.returnRawStringKey,
                                },
                                undefined,
                                {
                                    type: 'Block',
                                    accept: 'string',
                                },
                            ],
                        },
                    ],
                },
            },
            show_list: {
                color: EntryStatic.colorSet.block.default.VARIABLE,
                outerLine: EntryStatic.colorSet.block.darken.VARIABLE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'lists',
                        fontSize: 10,
                        bgColor: EntryStatic.colorSet.block.darken.VARIABLE,
                        arrowColor: EntryStatic.colorSet.arrow.default.DEFAULT,
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/variable_icon.svg',
                        size: 11,
                    },
                ],
                events: {
                    dataAdd: [
                        function(block) {
                            const vc = Entry.variableContainer;
                            if (vc) {
                                vc.addRef('_variableRefs', block);
                            }
                        },
                    ],
                    dataDestroy: [
                        function(block) {
                            const vc = Entry.variableContainer;
                            if (vc) {
                                vc.removeRef('_variableRefs', block);
                            }
                        },
                    ],
                },
                def: {
                    params: [null, null],
                    type: 'show_list',
                },
                pyHelpDef: {
                    params: ['A&value', null],
                    type: 'show_list',
                },
                paramsKeyMap: {
                    LIST: 0,
                },
                class: 'list_visibility',
                isNotFor: ['listNotExist'],
                func(sprite, script) {
                    const listId = script.getField('LIST', script);
                    const list = Entry.variableContainer.getList(listId);

                    list.setVisible(true);
                    return script.callReturn();
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            syntax: 'Entry.show_list(%1)',
                            textParams: [
                                {
                                    type: 'DropdownDynamic',
                                    value: null,
                                    menuName: 'lists',
                                    fontSize: 11,
                                    arrowColor: EntryStatic.colorSet.arrow.default.VARIABLE,
                                    converter: Entry.block.converters.returnStringKey,
                                },
                            ],
                        },
                    ],
                },
            },
            hide_list: {
                color: EntryStatic.colorSet.block.default.VARIABLE,
                outerLine: EntryStatic.colorSet.block.darken.VARIABLE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'lists',
                        fontSize: 10,
                        bgColor: EntryStatic.colorSet.block.darken.VARIABLE,
                        arrowColor: EntryStatic.colorSet.arrow.default.DEFAULT,
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/variable_icon.svg',
                        size: 11,
                    },
                ],
                events: {
                    dataAdd: [
                        function(block) {
                            const vc = Entry.variableContainer;
                            if (vc) {
                                vc.addRef('_variableRefs', block);
                            }
                        },
                    ],
                    dataDestroy: [
                        function(block) {
                            const vc = Entry.variableContainer;
                            if (vc) {
                                vc.removeRef('_variableRefs', block);
                            }
                        },
                    ],
                },
                def: {
                    params: [null, null],
                    type: 'hide_list',
                },
                pyHelpDef: {
                    params: ['A&value', null],
                    type: 'hide_list',
                },
                paramsKeyMap: {
                    LIST: 0,
                },
                class: 'list_visibility',
                isNotFor: ['listNotExist'],
                func(sprite, script) {
                    const listId = script.getField('LIST', script);
                    const list = Entry.variableContainer.getList(listId);

                    list.setVisible(false);
                    return script.callReturn();
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            syntax: 'Entry.hide_list(%1)',
                            textParams: [
                                {
                                    type: 'DropdownDynamic',
                                    value: null,
                                    menuName: 'lists',
                                    fontSize: 11,
                                    arrowColor: EntryStatic.colorSet.arrow.default.VARIABLE,
                                    converter: Entry.block.converters.returnStringKey,
                                },
                            ],
                        },
                    ],
                },
            },
        };
    },
};
