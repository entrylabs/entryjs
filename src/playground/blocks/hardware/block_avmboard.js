'use strict';

Entry.avmboard = {
    id: ['99.1'],
    name: 'avmboard',
    url: 'http://avatarmecha.co.kr',
    imageName: 'avmboard.png',
    title: {
        ko: 'AVM-BOARD',
        en: 'AVM-BOARD',
    },
    setZero() {
        Entry.hw.sendQueue.readablePorts = [];
        for (let port = 0; port < 20; port++) {
            Entry.hw.sendQueue[port] = 0;
            Entry.hw.sendQueue.readablePorts.push(port);
        }
        Entry.hw.update();
    },
    monitorTemplate: {
        imgPath: 'hardware/avmboard.png',
        width: 605,
        height: 434,
        listPorts: {
            '2': {
                name: `${Lang.Hw.port_en} 2 ${Lang.Hw.port_ko}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '3': {
                name: `${Lang.Hw.port_en} 3 ${Lang.Hw.port_ko}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '4': {
                name: `${Lang.Hw.port_en} 4 ${Lang.Hw.port_ko}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '5': {
                name: `${Lang.Hw.port_en} 5 ${Lang.Hw.port_ko}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '6': {
                name: `${Lang.Hw.port_en} 6 ${Lang.Hw.port_ko}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '7': {
                name: `${Lang.Hw.port_en} 7 ${Lang.Hw.port_ko}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '8': {
                name: `${Lang.Hw.port_en} 8 ${Lang.Hw.port_ko}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '9': {
                name: `${Lang.Hw.port_en} 9 ${Lang.Hw.port_ko}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '10': {
                name: `${Lang.Hw.port_en} 10 ${Lang.Hw.port_ko}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '11': {
                name: `${Lang.Hw.port_en} 11 ${Lang.Hw.port_ko}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '12': {
                name: `${Lang.Hw.port_en} 12 ${Lang.Hw.port_ko}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '13': {
                name: `${Lang.Hw.port_en} 13 ${Lang.Hw.port_ko}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            a0: {
                name: `${Lang.Hw.port_en} A0 ${Lang.Hw.port_ko}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            a1: {
                name: `${Lang.Hw.port_en} A1 ${Lang.Hw.port_ko}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            a2: {
                name: `${Lang.Hw.port_en} A2 ${Lang.Hw.port_ko}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            a3: {
                name: `${Lang.Hw.port_en} A3 ${Lang.Hw.port_ko}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            a4: {
                name: `${Lang.Hw.port_en} A4 ${Lang.Hw.port_ko}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            a5: {
                name: `${Lang.Hw.port_en} A5 ${Lang.Hw.port_ko}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
        },
        mode: 'both',
    },
};

Entry.avmboard.setLanguage = function() {
    return {
        ko: {
            template: {
                avmboard_get_number_sensor_value: '아날로그 %1 번 센서값  ',
                avmboard_get_digital_value: '디지털 %1 번 센서값  ',
                avmboard_toggle_led: '디지털 %1 번 핀 %2 %3',
                avmboard_toggle_pwm: '디지털 %1 번 핀을 %2 (으)로 정하기 %3',
                avmboard_convert_scale: '%1 값의 범위를 %2 ~ %3 에서 %4 ~ %5 (으)로 바꾼값  ',
            },
            Device: {
                avmboard: 'avmboard',
            },
            Menus: {
                avmboard: 'avmboard',
            },
        },
        en: {
            template: {
                avmboard_get_number_sensor_value: 'Analog %1 Sensor value  ',
                avmboard_get_digital_value: 'Digital %1 Sensor value  ',
                avmboard_toggle_led: 'Digital %1 Pin %2 %3',
                avmboard_toggle_pwm: 'Digital %1 Pin %2 %3',
                avmboard_convert_scale: 'Map Value %1 %2 ~ %3 to %4 ~ %5  ',
            },
            Device: {
                avmboard: 'avmboard',
            },
            Menus: {
                avmboard: 'avmboard',
            },
        },
    };
};

Entry.avmboard.blockMenuBlocks = [
    'avmboard_get_number_sensor_value',
    'avmboard_get_digital_value',
    'avmboard_toggle_led',
    'avmboard_toggle_pwm',
    'avmboard_convert_scale',
];

Entry.avmboard.getBlocks = function() {
    return {
        //region avmboard 아두이노
        avmboard_text: {
            color: '#FFD974',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'TextInput',
                },
            ],
            events: {},
            def: {
                params: ['10'],
            },
            paramsKeyMap: {
                NAME: 0,
            },
            func(sprite, script) {
                return script.getStringField('NAME');
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        textParams: [
                            {
                                type: 'TextInput',
                                value: 10,
                                converter: Entry.block.converters.returnStringOrNumberByValue,
                            },
                        ],
                        keyOption: 'avmboard_text',
                    },
                ],
            },
        },
        avmboard_get_sensor_number: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['0', 'A0'],
                        ['1', 'A1'],
                        ['2', 'A2'],
                        ['3', 'A3'],
                        ['4', 'A4'],
                        ['5', 'A5'],
                    ],
                    value: 'A0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                PORT: 0,
            },
            func(sprite, script) {
                return script.getStringField('PORT');
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['0', 'A0'],
                                    ['1', 'A1'],
                                    ['2', 'A2'],
                                    ['3', 'A3'],
                                    ['4', 'A4'],
                                    ['5', 'A5'],
                                ],
                                value: 'A0',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        keyOption: 'avmboard_get_sensor_number',
                    },
                ],
            },
        },
        avmboard_get_port_number: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
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
                        ['10', '10'],
                        ['11', '11'],
                        ['12', '12'],
                        ['13', '13'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                PORT: 0,
            },
            func(sprite, script) {
                return script.getStringField('PORT');
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
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
                                    ['10', '10'],
                                    ['11', '11'],
                                    ['12', '12'],
                                    ['13', '13'],
                                ],
                                value: '0',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'avmboard_get_port_number',
                    },
                ],
            },
        },
        avmboard_get_pwm_port_number: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['3', '3'],
                        ['5', '5'],
                        ['6', '6'],
                        ['9', '9'],
                        ['10', '10'],
                        ['11', '11'],
                    ],
                    value: '3',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                PORT: 0,
            },
            func(sprite, script) {
                return script.getStringField('PORT');
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['3', '3'],
                                    ['5', '5'],
                                    ['6', '6'],
                                    ['9', '9'],
                                    ['10', '10'],
                                    ['11', '11'],
                                ],
                                value: '3',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringOrNumberByValue,
                            },
                        ],
                        keyOption: 'avmboard_get_pwm_port_number',
                    },
                ],
            },
        },
        avmboard_get_number_sensor_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'avmboard_get_sensor_number',
                    },
                ],
                type: 'avmboard_get_number_sensor_value',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'avmboard_value',
            isNotFor: ['avmboard'],
            func(sprite, script) {
                const signal = script.getValue('VALUE', script);
                return Entry.hw.getAnalogPortValue(signal[1]);
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'avmboard.sensor_value(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        avmboard_get_digital_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'avmboard_get_port_number',
                    },
                ],
                type: 'avmboard_get_digital_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'avmboard_value',
            isNotFor: ['avmboard'],
            func(sprite, script) {
                const { hwModule = {} } = Entry.hw;
                const { name } = hwModule;
                if (name === 'avmboardExt') {
                    return Entry.block.avmboard_ext_get_digital.func(sprite, script);
                } else {
                    const signal = script.getNumberValue('PORT', script);
                    return Entry.hw.getDigitalPortValue(signal);
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'avmboard.digitalRead(%1)',
                        blockType: 'param',
                        replaceBlockType: 'avmboard_ext_get_digital',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        avmboard_toggle_led: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ARDUINO_on, 'on'],
                        [Lang.Blocks.ARDUINO_off, 'off'],
                    ],
                    value: 'on',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'avmboard_get_port_number',
                    },
                    null,
                    null,
                ],
                type: 'avmboard_toggle_led',
            },
            paramsKeyMap: {
                VALUE: 0,
                OPERATOR: 1,
            },
            class: 'avmboard_set',
            isNotFor: ['avmboard'],
            func(sprite, script) {
                const port = script.getNumberValue('VALUE');
                const operator = script.getField('OPERATOR');
                const value = operator == 'on' ? 255 : 0;
                Entry.hw.setDigitalPortValue(port, value);
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'avmboard.pin_digital(%1, %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ARDUINO_on, 'on'],
                                    [Lang.Blocks.ARDUINO_off, 'off'],
                                ],
                                value: 'on',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        avmboard_toggle_pwm: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'avmboard_get_pwm_port_number',
                    },
                    {
                        type: 'avmboard_text',
                        params: ['255'],
                    },
                    null,
                ],
                type: 'avmboard_toggle_pwm',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'avmboard_set',
            isNotFor: ['avmboard'],
            func(sprite, script) {
                const port = script.getNumberValue('PORT');
                let value = script.getNumberValue('VALUE');
                value = Math.round(value);
                value = Math.max(value, 0);
                value = Math.min(value, 255);
                Entry.hw.setDigitalPortValue(port, value);
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'avmboard.set_pin_digital(%1, %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
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
        avmboard_convert_scale: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'avmboard_get_number_sensor_value',
                        params: [
                            {
                                type: 'avmboard_get_sensor_number',
                                id: 'bl5e',
                            },
                        ],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['1023'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['100'],
                    },
                ],
                type: 'avmboard_convert_scale',
            },
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
                VALUE3: 2,
                VALUE4: 3,
                VALUE5: 4,
            },
            class: 'avmboard',
            isNotFor: ['avmboard'],
            func(sprite, script) {
                const value1 = script.getNumberValue('VALUE1', script);
                let value2 = script.getNumberValue('VALUE2', script);
                let value3 = script.getNumberValue('VALUE3', script);
                let value4 = script.getNumberValue('VALUE4', script);
                let value5 = script.getNumberValue('VALUE5', script);

                const stringValue4 = script.getValue('VALUE4', script);
                const stringValue5 = script.getValue('VALUE5', script);
                let isFloat = false;

                if (
                    (Entry.Utils.isNumber(stringValue4) && stringValue4.indexOf('.') > -1) ||
                    (Entry.Utils.isNumber(stringValue5) && stringValue5.indexOf('.') > -1)
                ) {
                    isFloat = true;
                }

                let result = value1;
                if (value2 > value3) {
                    var swap = value2;
                    value2 = value3;
                    value3 = swap;
                }
                if (value4 > value5) {
                    var swap = value4;
                    value4 = value5;
                    value5 = swap;
                }
                result -= value2;
                result = result * ((value5 - value4) / (value3 - value2));
                result += value4;
                result = Math.min(value5, result);
                result = Math.max(value4, result);

                if (isFloat) {
                    result = Math.round(result * 100) / 100;
                } else {
                    result = Math.round(result);
                }

                return result;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'avmboard.convert_scale(%1, %2, %3, %4, %5)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Block',
                                accept: 'string',
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
        //endregion avmboard 아두이노
    };
};

module.exports = Entry.avmboard;
