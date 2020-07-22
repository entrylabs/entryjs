module.exports = {
    getBlocks() {
        return {
            when_run_button_click: {
                color: EntryStatic.colorSet.block.default.START,
                outerLine: EntryStatic.colorSet.block.darken.START,
                skeleton: 'basic_event',
                statements: [],
                params: [
                    {
                        type: 'Indicator',
                        img: 'block_icon/start_icon_play.svg',
                        size: 14,
                        position: {
                            x: 0,
                            y: -2,
                        },
                    },
                ],
                events: {},
                def: {
                    params: [null],
                    type: 'when_run_button_click',
                },
                class: 'event',
                isNotFor: [],
                func(sprite, script) {
                    return script.callReturn();
                },
                event: 'start',
                syntax: {
                    js: [],
                    py: [
                        {
                            syntax: 'def when_start():',
                            blockType: 'event',
                        },
                    ],
                },
            },
            when_some_key_pressed: {
                color: EntryStatic.colorSet.block.default.START,
                outerLine: EntryStatic.colorSet.block.darken.START,
                skeleton: 'basic_event',
                statements: [],
                params: [
                    {
                        type: 'Indicator',
                        img: 'block_icon/start_icon_keyboard.svg',
                        size: 14,
                        position: {
                            x: 0,
                            y: -2,
                        },
                    },
                    {
                        type: 'Keyboard',
                        options: [
                            [Lang.Blocks.START_press_some_key_up, '38'],
                            [Lang.Blocks.START_press_some_key_down, '40'],
                            [Lang.Blocks.START_press_some_key_right, '39'],
                            [Lang.Blocks.START_press_some_key_left, '37'],
                            [Lang.Blocks.START_press_some_key_space, '32'],
                            [Lang.Blocks.START_press_some_key_enter, '13'],
                            ['ctrl', '17'],
                            ['shift', '16'],
                            ['alt', '18'],
                            ['tab', '9'],
                            ['esc', '27'],
                            ['back-space', '8'],
                            ['0', '48'],
                            ['1', '49'],
                            ['2', '50'],
                            ['3', '51'],
                            ['4', '52'],
                            ['5', '53'],
                            ['6', '54'],
                            ['7', '55'],
                            ['8', '56'],
                            ['9', '57'],
                            ['a', '65'],
                            ['b', '66'],
                            ['c', '67'],
                            ['d', '68'],
                            ['e', '69'],
                            ['f', '70'],
                            ['g', '71'],
                            ['h', '72'],
                            ['i', '73'],
                            ['j', '74'],
                            ['k', '75'],
                            ['l', '76'],
                            ['m', '77'],
                            ['n', '78'],
                            ['o', '79'],
                            ['p', '80'],
                            ['q', '81'],
                            ['r', '82'],
                            ['s', '83'],
                            ['t', '84'],
                            ['u', '85'],
                            ['v', '86'],
                            ['w', '87'],
                            ['x', '88'],
                            ['y', '89'],
                            ['z', '90'],
                        ],
                        value: 'next',
                        fontSize: 10,
                        bgColor: EntryStatic.colorSet.block.darken.START,
                        arrowColor: EntryStatic.colorSet.arrow.default.START,
                    },
                ],
                events: {},
                def: {
                    params: [null, '81'],
                    type: 'when_some_key_pressed',
                },
                pyHelpDef: {
                    params: [null, 'A&value'],
                    type: 'when_some_key_pressed',
                },
                paramsKeyMap: {
                    VALUE: 1,
                },
                class: 'event',
                isNotFor: [],
                func(sprite, script) {
                    return script.callReturn();
                },
                event: 'keyPress',
                syntax: {
                    js: [],
                    py: [
                        {
                            syntax: 'def when_press_key(%2):',
                            passTest: true,
                            blockType: 'event',
                            textParams: [
                                undefined,
                                {
                                    type: 'Dropdown',
                                    value: 'next',
                                    options: [
                                        [Lang.Blocks.START_press_some_key_up, 'ArrowUp'],
                                        [Lang.Blocks.START_press_some_key_down, 'ArrowDown'],
                                        [Lang.Blocks.START_press_some_key_right, 'ArrowRight'],
                                        [Lang.Blocks.START_press_some_key_left, 'ArrowLeft'],
                                        [Lang.Blocks.START_press_some_key_space, 'Space'],
                                        [Lang.Blocks.START_press_some_key_enter, 'Enter'],
                                        ['ctrl', 'Control'],
                                        ['shift', 'Shift'],
                                        ['alt', 'Alt'],
                                        ['tab', 'Tab'],
                                        ['esc', 'Escape'],
                                        ['back-space', 'Backspace'],
                                        ['0', '0'],
                                        ['1', '1'],
                                        ['2', '2'],
                                        ['3', '3'],
                                        ['4', '4'],
                                        ['5', '5'],
                                        ['6', '6'],
                                        ['7', '7'],
                                        ['8', '8'],
                                        ['9', '9'],
                                        ['a', 'KeyA'],
                                        ['b', 'KeyB'],
                                        ['c', 'KeyC'],
                                        ['d', 'KeyD'],
                                        ['e', 'KeyE'],
                                        ['f', 'KeyF'],
                                        ['g', 'KeyG'],
                                        ['h', 'KeyH'],
                                        ['i', 'KeyI'],
                                        ['j', 'KeyJ'],
                                        ['k', 'KeyK'],
                                        ['l', 'KeyL'],
                                        ['m', 'KeyM'],
                                        ['n', 'KeyN'],
                                        ['o', 'KeyO'],
                                        ['p', 'KeyP'],
                                        ['q', 'KeyQ'],
                                        ['r', 'KeyR'],
                                        ['s', 'KeyS'],
                                        ['t', 'KeyT'],
                                        ['u', 'KeyU'],
                                        ['v', 'KeyV'],
                                        ['w', 'KeyW'],
                                        ['x', 'KeyX'],
                                        ['y', 'KeyY'],
                                        ['z', 'KeyZ'],
                                    ],
                                    arrowColor: EntryStatic.colorSet.arrow.default.START,
                                    converter: Entry.block.converters.keyboardCode,
                                },
                            ],
                        },
                    ],
                },
            },
            mouse_clicked: {
                color: EntryStatic.colorSet.block.default.START,
                outerLine: EntryStatic.colorSet.block.darken.START,
                skeleton: 'basic_event',
                statements: [],
                params: [
                    {
                        type: 'Indicator',
                        img: 'block_icon/start_icon_mouse.svg',
                        size: 14,
                        position: {
                            x: 0,
                            y: -2,
                        },
                    },
                ],
                events: {},
                def: {
                    params: [null],
                    type: 'mouse_clicked',
                },
                class: 'event',
                isNotFor: [],
                func(sprite, script) {
                    return script.callReturn();
                },
                event: 'mouse_clicked',
                syntax: {
                    js: [],
                    py: [
                        {
                            syntax: 'def when_click_mouse_on():',
                            blockType: 'event',
                        },
                    ],
                },
            },
            mouse_click_cancled: {
                color: EntryStatic.colorSet.block.default.START,
                outerLine: EntryStatic.colorSet.block.darken.START,
                skeleton: 'basic_event',
                statements: [],
                params: [
                    {
                        type: 'Indicator',
                        img: 'block_icon/start_icon_mouse.svg',
                        size: 14,
                        position: {
                            x: 0,
                            y: -2,
                        },
                    },
                ],
                events: {},
                def: {
                    params: [null],
                    type: 'mouse_click_cancled',
                },
                class: 'event',
                isNotFor: [],
                func(sprite, script) {
                    return script.callReturn();
                },
                event: 'mouse_click_cancled',
                syntax: {
                    js: [],
                    py: [
                        {
                            syntax: 'def when_click_mouse_off():',
                            blockType: 'event',
                        },
                    ],
                },
            },
            when_object_click: {
                color: EntryStatic.colorSet.block.default.START,
                outerLine: EntryStatic.colorSet.block.darken.START,
                skeleton: 'basic_event',
                statements: [],
                params: [
                    {
                        type: 'Indicator',
                        img: 'block_icon/start_icon_mouse.svg',
                        size: 14,
                        position: {
                            x: 0,
                            y: -2,
                        },
                    },
                ],
                events: {},
                def: {
                    params: [null],
                    type: 'when_object_click',
                },
                class: 'event',
                isNotFor: [],
                func(sprite, script) {
                    return script.callReturn();
                },
                event: 'when_object_click',
                syntax: {
                    js: [],
                    py: [
                        {
                            syntax: 'def when_click_object_on():',
                            blockType: 'event',
                        },
                    ],
                },
            },
            when_object_click_canceled: {
                color: EntryStatic.colorSet.block.default.START,
                outerLine: EntryStatic.colorSet.block.darken.START,
                skeleton: 'basic_event',
                statements: [],
                params: [
                    {
                        type: 'Indicator',
                        img: 'block_icon/start_icon_mouse.svg',
                        size: 14,
                        position: {
                            x: 0,
                            y: -2,
                        },
                    },
                ],
                events: {},
                def: {
                    params: [null],
                    type: 'when_object_click_canceled',
                },
                class: 'event',
                isNotFor: [],
                func(sprite, script) {
                    return script.callReturn();
                },
                event: 'when_object_click_canceled',
                syntax: {
                    js: [],
                    py: [
                        {
                            syntax: 'def when_click_object_off():',
                            blockType: 'event',
                        },
                    ],
                },
            },
            when_message_cast: {
                color: EntryStatic.colorSet.block.default.START,
                outerLine: EntryStatic.colorSet.block.darken.START,
                skeleton: 'basic_event',
                statements: [],
                params: [
                    {
                        type: 'Indicator',
                        img: 'block_icon/start_icon_signal.svg',
                        size: 14,
                        position: {
                            x: 0,
                            y: -2,
                        },
                    },
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'messages',
                        fontSize: 10,
                        textColor: '#FFFFFF',
                        bgColor: EntryStatic.colorSet.block.darken.START,
                        arrowColor: EntryStatic.colorSet.arrow.default.START,
                    },
                ],
                events: {
                    dataAdd: [
                        function(block) {
                            const vc = Entry.variableContainer;
                            if (vc) {
                                vc.addRef('_messageRefs', block);
                            }
                        },
                    ],
                    viewDestroy: [
                        function(block) {
                            const vc = Entry.variableContainer;
                            if (vc) {
                                vc.removeRef('_messageRefs', block);
                            }
                        },
                    ],
                },
                def: {
                    params: [null, null],
                    type: 'when_message_cast',
                },
                pyHelpDef: {
                    params: [null, 'A&value'],
                    type: 'when_message_cast',
                },
                paramsKeyMap: {
                    VALUE: 1,
                },
                class: 'message',
                isNotFor: ['message'],
                func(sprite, script) {
                    return script.callReturn();
                },
                event: 'when_message_cast',

                //"syntax": {"js": [], "py": ["def entry_event_signal():\n\tif signal == %2:"]}
                syntax: {
                    js: [],
                    py: [
                        {
                            syntax: 'def when_get_signal(%2):',
                            blockType: 'event',
                            passTest: true,
                            textParams: [
                                undefined,
                                {
                                    type: 'DropdownDynamic',
                                    value: null,
                                    menuName: 'messages',
                                    fontSize: 11,
                                    arrowColor: EntryStatic.colorSet.arrow.default.START,
                                    converter: Entry.block.converters.returnStringKey,
                                },
                            ],
                        },
                    ],
                },
            },
            message_cast: {
                color: EntryStatic.colorSet.block.default.START,
                outerLine: EntryStatic.colorSet.block.darken.START,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'messages',
                        fontSize: 10,
                        textColor: '#fff',
                        bgColor: EntryStatic.colorSet.block.darken.START,
                        arrowColor: EntryStatic.colorSet.arrow.default.START,
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/start_icon.svg',
                        size: 11,
                    },
                ],
                events: {
                    dataAdd: [
                        function(block) {
                            const vc = Entry.variableContainer;
                            if (vc) {
                                vc.addRef('_messageRefs', block);
                            }
                        },
                    ],
                    viewDestroy: [
                        function(block) {
                            const vc = Entry.variableContainer;
                            if (vc) {
                                vc.removeRef('_messageRefs', block);
                            }
                        },
                    ],
                },
                def: {
                    params: [null, null],
                    type: 'message_cast',
                },
                pyHelpDef: {
                    params: ['A&value', null],
                    type: 'message_cast',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                class: 'message',
                isNotFor: ['message'],
                func(sprite, script) {
                    const value = script.getField('VALUE', script);

                    const arr = Entry.variableContainer.messages_;
                    const isExist = Entry.isExist(value, 'id', arr);

                    if (value == 'null' || !isExist) {
                        throw new Error('value can not be null or undefined');
                    }

                    setTimeout(() => {
                        Entry.engine.raiseMessage(value);
                    });
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            syntax: 'Entry.send_signal(%1)',
                            textParams: [
                                {
                                    type: 'DropdownDynamic',
                                    value: null,
                                    menuName: 'messages',
                                    fontSize: 11,
                                    arrowColor: EntryStatic.colorSet.arrow.default.START,
                                    converter: Entry.block.converters.returnStringKey,
                                    paramType: 'signal',
                                },
                                undefined,
                            ],
                        },
                    ],
                },
            },
            message_cast_wait: {
                color: EntryStatic.colorSet.block.default.START,
                outerLine: EntryStatic.colorSet.block.darken.START,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'messages',
                        fontSize: 10,
                        textColor: '#fff',
                        bgColor: EntryStatic.colorSet.block.darken.START,
                        arrowColor: EntryStatic.colorSet.arrow.default.START,
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/start_icon.svg',
                        size: 11,
                    },
                ],
                events: {
                    dataAdd: [
                        function(block) {
                            const vc = Entry.variableContainer;
                            if (vc) {
                                vc.addRef('_messageRefs', block);
                            }
                        },
                    ],
                    dataDestroy: [
                        function(block) {
                            const vc = Entry.variableContainer;
                            if (vc) {
                                vc.removeRef('_messageRefs', block);
                            }
                        },
                    ],
                },
                def: {
                    params: [null, null],
                    type: 'message_cast_wait',
                },
                pyHelpDef: {
                    params: ['A&value', null],
                    type: 'message_cast_wait',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                class: 'message',
                isNotFor: ['message'],
                func(sprite, script) {
                    if (script.runningScript) {
                        const runningScript = script.runningScript;
                        const length = runningScript.length;
                        for (let i = 0; i < length; i++) {
                            const executor = runningScript.shift();
                            if (executor && !executor.isEnd()) {
                                runningScript.push(executor);
                            }
                        }
                        if (runningScript.length) {
                            return script;
                        } else {
                            return script.callReturn();
                        }
                    } else {
                        const value = script.getField('VALUE', script);
                        const arr = Entry.variableContainer.messages_;
                        const isExist = Entry.isExist(value, 'id', arr);
                        if (value == 'null' || !isExist) {
                            throw new Error('value can not be null or undefined');
                        }
                        const data = Entry.engine.raiseMessage(value);
                        let runningScript = [];
                        while (data.length) {
                            const executor = data.shift();
                            if (executor) {
                                runningScript = runningScript.concat(executor);
                            }
                        }

                        script.runningScript = runningScript;
                        return script;
                    }
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            syntax: 'Entry.send_signal_wait(%1)',
                            textParams: [
                                {
                                    type: 'DropdownDynamic',
                                    value: null,
                                    menuName: 'messages',
                                    fontSize: 11,
                                    arrowColor: EntryStatic.colorSet.arrow.default.START,
                                    converter: Entry.block.converters.returnStringKey,
                                },
                            ],
                        },
                    ],
                },
            },
            when_scene_start: {
                color: EntryStatic.colorSet.block.default.START,
                outerLine: EntryStatic.colorSet.block.darken.START,
                skeleton: 'basic_event',
                statements: [],
                params: [
                    {
                        type: 'Indicator',
                        img: 'block_icon/start_icon_scene.svg',
                        size: 14,
                        position: {
                            x: 0,
                            y: -2,
                        },
                    },
                ],
                events: {},
                def: {
                    params: [null],
                    type: 'when_scene_start',
                },
                class: 'scene',
                isNotFor: ['scene'],
                func(sprite, script) {
                    return script.callReturn();
                },
                event: 'when_scene_start',
                syntax: {
                    js: [],
                    py: [
                        {
                            syntax: 'def when_start_scene():',
                            blockType: 'event',
                        },
                    ],
                },
            },
            start_scene: {
                color: EntryStatic.colorSet.block.default.START,
                outerLine: EntryStatic.colorSet.block.darken.START,
                skeleton: 'basic_without_next',
                statements: [],
                params: [
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'scenes',
                        fontSize: 10,
                        textColor: '#fff',
                        bgColor: EntryStatic.colorSet.block.darken.START,
                        arrowColor: EntryStatic.colorSet.arrow.default.START,
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/start_icon.svg',
                        size: 11,
                    },
                ],
                events: {},
                def: {
                    params: [null, null],
                    type: 'start_scene',
                },
                pyHelpDef: {
                    params: ['A&value', null],
                    type: 'start_scene',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                class: 'scene',
                isNotFor: ['scene'],
                func(sprite, script) {
                    const value = script.getField('VALUE', script);
                    const scene = Entry.scene.getSceneById(value);
                    if (scene) {
                        Entry.scene.selectScene(scene);
                        Entry.engine.fireEvent('when_scene_start');
                    }
                    return null;
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            syntax: 'Entry.start_scene(%1)',
                            blockType: 'last',
                            textParams: [
                                {
                                    type: 'DropdownDynamic',
                                    value: null,
                                    menuName: 'scenes',
                                    fontSize: 11,
                                    arrowColor: EntryStatic.colorSet.arrow.default.START,
                                    converter: Entry.block.converters.returnStringKey,
                                },
                            ],
                        },
                    ],
                },
            },
            start_neighbor_scene: {
                color: EntryStatic.colorSet.block.default.START,
                outerLine: EntryStatic.colorSet.block.darken.START,
                skeleton: 'basic_without_next',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.SCENE_start_scene_next, 'next'],
                            [Lang.Blocks.SCENE_start_scene_pre, 'prev'],
                        ],
                        value: 'next',
                        fontSize: 10,
                        textColor: '#fff',
                        bgColor: EntryStatic.colorSet.block.darken.START,
                        arrowColor: EntryStatic.colorSet.arrow.default.START,
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/start_icon.svg',
                        size: 11,
                    },
                ],
                events: {},
                def: {
                    params: [null, null],
                    type: 'start_neighbor_scene',
                },
                pyHelpDef: {
                    params: ['A&value', null],
                    type: 'start_neighbor_scene',
                },
                paramsKeyMap: {
                    OPERATOR: 0,
                },
                class: 'scene',
                isNotFor: ['scene'],
                func(sprite, script) {
                    const currentScene = Entry.scene.selectedScene;
                    const scenes = Entry.scene.getScenes();
                    const index = scenes.indexOf(currentScene);
                    const o = script.getField('OPERATOR', script);
                    if (o == 'next') {
                        if (index + 1 < scenes.length) {
                            const nextScene = Entry.scene.getSceneById(scenes[index + 1].id);
                            if (nextScene) {
                                Entry.scene.selectScene(nextScene);
                                Entry.engine.fireEvent('when_scene_start');
                            }
                        }
                    } else {
                        if (index > 0) {
                            const nextScene = Entry.scene.getSceneById(scenes[index - 1].id);
                            if (nextScene) {
                                Entry.scene.selectScene(nextScene);
                                Entry.engine.fireEvent('when_scene_start');
                            }
                        }
                    }
                    return null;
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            syntax: 'Entry.start_scene_of(%1)',
                            blockType: 'last',
                            textParams: [
                                {
                                    type: 'Dropdown',
                                    options: [
                                        [Lang.Blocks.SCENE_start_scene_next, 'next'],
                                        [Lang.Blocks.SCENE_start_scene_pre, 'prev'],
                                    ],
                                    value: 'next',
                                    fontSize: 11,
                                    arrowColor: EntryStatic.colorSet.arrow.default.START,
                                    converter: Entry.block.converters.returnStringValue,
                                    codeMap: 'Entry.CodeMap.Entry.start_neighbor_scene[0]',
                                },
                            ],
                        },
                    ],
                },
            },
            check_object_property: {
                color: '#7C7C7C',
                skeleton: 'basic',
                template: '%1 가 %2 %3 %4 %5 %6',
                statements: [],
                params: [
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'sprites',
                        fontSize: 11,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            ['언젠가', 0],
                            ['지금', 1],
                        ],
                        value: '0',
                        fontSize: 11,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            ['x', 'x'],
                            ['y', 'y'],
                            ['크기', 'size'],
                            ['방향', 'rotation'],
                            ['이동 방향', 'direction'],
                            ['텍스트', 'text'],
                        ],
                        value: 'x',
                        fontSize: 11,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            ['=', 'EQUAL'],
                            ['>', 'GREATER'],
                            ['<', 'LESS'],
                            ['≥', 'GREATER_OR_EQUAL'],
                            ['≤', 'LESS_OR_EQUAL'],
                        ],
                        value: 'EQUAL',
                        fontSize: 11,
                        noArrow: true,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                    },
                    {
                        type: 'Indicator',
                        color: '#6B6B6B',
                        size: 12,
                    },
                ],
                events: {},
                def: {
                    params: [null],
                    type: 'check_object_property',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                class: 'checker',
                isNotFor: ['checker'],
                func(sprite, script) {
                    const obj = Entry.container.getObject(this.block.params[0]);
                    const flow = this.block.params[1];
                    let propertyKey = this.block.params[2];
                    const rightValue = this.getParam(4);
                    propertyKey = propertyKey[0].toUpperCase() + propertyKey.substr(1);
                    const leftValue = obj.entity[`get${propertyKey}`].call(obj.entity);
                    let returnVal;

                    switch (this.block.params[3]) {
                        case 'EQUAL':
                            returnVal = leftValue == rightValue;
                            break;
                        case 'GREATER':
                            returnVal = Number(leftValue) > Number(rightValue);
                            break;
                        case 'LESS':
                            returnVal = Number(leftValue) < Number(rightValue);
                            break;
                        case 'GREATER_OR_EQUAL':
                            returnVal = Number(leftValue) >= Number(rightValue);
                            break;
                        case 'LESS_OR_EQUAL':
                            returnVal = Number(leftValue) <= Number(rightValue);
                            break;
                    }
                    if (returnVal) {
                        return;
                    } else if (flow == 0) {
                        return Entry.STATIC.BREAK;
                    } else {
                        this.die();
                    }
                },
            },
            check_block_execution: {
                color: '#7C7C7C',
                skeleton: 'basic_loop',
                template: '%1 에서 아래 블록이 %2 %3 번 실행되었는가 %4',
                statements: [
                    {
                        accept: 'basic',
                    },
                ],
                params: [
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'allSprites',
                        fontSize: 11,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            ['비슷하게', 0],
                            ['똑같이', 1],
                        ],
                        value: '16',
                        fontSize: 11,
                    },
                    {
                        type: 'TextInput',
                        value: 1,
                    },
                    {
                        type: 'Indicator',
                        color: '#6B6B6B',
                        size: 12,
                    },
                ],
                events: {},
                def: {
                    params: [null, 0, '1'],
                    type: 'check_block_execution',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                class: 'checker',
                isNotFor: ['checker'],
                func(sprite, script) {
                    const { block = {} } = this;
                    const { data = {} } = block;
                    const { id = '' } = data;
                    if (this.entity.listener[id]) {
                        if (this.remainCheck === 0) {
                            this.entity.listener[id].destroy();
                            delete this.entity.listener[id];
                            return;
                        } else {
                            return Entry.STATIC.BREAK;
                        }
                    }
                    const code = Entry.container.getObject(this.block.params[0]).script;
                    const accuracy = this.block.params[1];
                    const statements = this.block.statements[0].getBlocks();
                    let lastBlock = null;
                    this.remainCheck = Number(this.block.params[2]);
                    let index = 0;
                    this.entity.listener[id] = code.watchEvent.attach(this, (blocks) => {
                        //dangerous
                        blocks = blocks.concat();
                        let block;
                        let isFirst = true;
                        while (blocks.length && index < statements.length) {
                            block = blocks.shift();
                            if (isFirst && block === lastBlock) {
                                continue;
                            }
                            if (accuracy === 0 && statements[index].type === block.type) {
                                index++;
                            } else if (accuracy === 1 && statements[index].isSameParamWith(block)) {
                                index++;
                            } else {
                                index = 0;
                            }
                            isFirst = false;
                        }
                        lastBlock = block;
                        if (index === statements.length) {
                            this.remainCheck = this.remainCheck - 1;
                            index = 0;
                        }
                    });
                    return Entry.STATIC.BREAK;
                },
            },
            switch_scope: {
                color: '#7C7C7C',
                skeleton: 'basic',
                template: '%1 오브젝트 기준으로 실행하기 %2',
                statements: [],
                params: [
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'sprites',
                        fontSize: 11,
                    },
                    {
                        type: 'Indicator',
                        color: '#6B6B6B',
                        size: 12,
                    },
                ],
                events: {},
                def: {
                    params: [null],
                    type: 'switch_scope',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                class: 'checker',
                isNotFor: ['checker'],
                func(sprite, script) {
                    const obj = Entry.container.getObject(this.block.params[0]);
                    this.executor.entity = obj.entity;
                },
            },
            is_answer_submited: {
                color: '#7C7C7C',
                skeleton: 'basic',
                template: '대답을 입력 받을때 까지 기다리기 %1',
                statements: [],
                params: [
                    {
                        type: 'Indicator',
                        color: '#6B6B6B',
                        size: 12,
                    },
                ],
                events: {},
                def: {
                    params: [null],
                    type: 'is_answer_submited',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                class: 'checker',
                isNotFor: ['checker'],
                func(sprite, script) {
                    if (this.isSubmitted) {
                        Entry.removeEventListener('answerSubmitted', checkFunc);
                        return;
                    } else if (this.isSubmitted === false) {
                        return Entry.STATIC.BREAK;
                    }
                    const checkFunc = function() {
                        that.isSubmitted = true;
                    };
                    this.isSubmitted = false;
                    const that = this;
                    Entry.addEventListener('answerSubmitted', checkFunc);
                    return Entry.STATIC.BREAK;
                },
            },
            check_lecture_goal: {
                color: '#7C7C7C',
                skeleton: 'basic',
                template: '목표 %1 %2 ( %3 ) %4',
                statements: [],
                params: [
                    {
                        type: 'TextInput',
                        value: 0,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            ['달성', 1],
                            ['실패', 0],
                        ],
                        fontSize: 11,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            ['공식', 1],
                            ['비공식', 0],
                        ],
                        value: 1,
                        fontSize: 11,
                    },
                    {
                        type: 'Indicator',
                        color: '#6B6B6B',
                        size: 12,
                    },
                ],
                events: {
                    dataAdd: [
                        function(block) {
                            Entry.registerAchievement(block);
                        },
                    ],
                },
                def: {
                    params: [0, 1, 1],
                    type: 'check_lecture_goal',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                class: 'checker',
                isNotFor: ['checker'],
                func(sprite, script) {
                    Entry.targetChecker.achieveCheck(
                        this.block.params[1],
                        `${this.block.params[0]}`
                    );
                },
            },
            check_variable_by_name: {
                color: '#7C7C7C',
                skeleton: 'basic_string_field',
                template: '%1 이름의 변수',
                statements: [],
                params: [
                    {
                        type: 'TextInput',
                        value: '?',
                    },
                ],
                events: {},
                def: {
                    params: ['변수'],
                    type: 'check_variable_by_name',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                class: 'checker',
                isNotFor: ['checker'],
                func(sprite, script) {
                    const variableName = `${this.block.params[0]}`;
                    const variable = Entry.variableContainer.getVariableByName(variableName);
                    if (variable) {
                        return variable.getValue();
                    } else {
                        return;
                    }
                },
            },
            show_prompt: {
                color: '#7C7C7C',
                skeleton: 'basic',
                template: '%1 안내하기 %2',
                statements: [],
                params: [
                    {
                        type: 'TextInput',
                        value: '',
                    },
                    {
                        type: 'Indicator',
                        color: '#6B6B6B',
                        size: 12,
                    },
                ],
                events: {},
                def: {
                    params: [' '],
                    type: 'show_prompt',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                class: 'checker',
                isNotFor: ['checker'],
                func(sprite, script) {
                    if (Entry.targetChecker) {
                        Entry.targetChecker.showStatusMessage(this.block.params[0]);
                    }
                },
            },
            check_goal_success: {
                color: '#7C7C7C',
                skeleton: 'basic_boolean_field',
                template: '목표 %1 이 성공?',
                statements: [],
                params: [
                    {
                        type: 'TextInput',
                        value: '',
                    },
                ],
                events: {},
                def: {
                    params: ['0'],
                    type: 'check_goal_success',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                class: 'checker',
                isNotFor: ['checker'],
                func(sprite, script) {
                    const goalName = `${this.block.params[0]}`;
                    return Entry.targetChecker.checkGoal(goalName);
                },
            },
            positive_number: {
                color: '#7C7C7C',
                skeleton: 'basic_string_field',
                template: '양수',
                fontColor: '#fff',
                statements: [],
                params: ['positive'],
                events: {},
                def: {
                    params: ['positive'],
                    type: 'positive_number',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                class: 'checker',
                isNotFor: ['checker'],
                func(sprite, script) {
                    return 'positive';
                },
            },
            negative_number: {
                color: '#7C7C7C',
                skeleton: 'basic_string_field',
                template: '음수',
                fontColor: '#fff',
                statements: [],
                params: ['negative'],
                events: {},
                def: {
                    params: ['negative'],
                    type: 'negative_number',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                class: 'checker',
                isNotFor: ['checker'],
                func(sprite, script) {
                    return 'negative';
                },
            },
            wildcard_string: {
                color: '#7C7C7C',
                skeleton: 'basic_string_field',
                template: '    *    ',
                fontColor: '#fff',
                statements: [],
                params: [],
                events: {},
                def: {
                    params: [],
                    type: 'wildcard_string',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                class: 'checker',
                isNotFor: ['checker'],
                func(sprite, script) {},
            },
            wildcard_boolean: {
                color: '#7C7C7C',
                skeleton: 'basic_boolean_field',
                template: '    *    ',
                fontColor: '#fff',
                statements: [],
                params: [],
                events: {},
                def: {
                    params: [],
                    type: 'wildcard_boolean',
                },
                paramsKeyMap: {},
                class: 'checker',
                isNotFor: ['checker'],
                func(sprite, script) {},
            },
            register_score: {
                color: '#7C7C7C',
                skeleton: 'basic',
                template: '%1를 %2로 정하기 %3',
                statements: [],
                params: [
                    {
                        type: 'TextInput',
                        value: 'score',
                    },
                    {
                        type: 'TextInput',
                        value: '1',
                    },
                    {
                        type: 'Indicator',
                        color: '#6B6B6B',
                        size: 12,
                    },
                ],
                events: {},
                def: {
                    params: ['score', 1],
                    type: 'register_score',
                },
                class: 'checker',
                isNotFor: ['checker'],
                func(sprite, script) {
                    const obj = {};
                    obj[this.block.params[0]] = this.block.params[1];
                    if (typeof entrylms !== 'undefined') {
                        entrylms.emit('registerScore', obj);
                    }
                    return script.callReturn();
                },
            },
        };
    },
};
