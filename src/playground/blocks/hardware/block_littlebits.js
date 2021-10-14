'use strict';

class LittleBits {
    id = '1.F';
    name = 'littlebits';
    url = 'https://playentry.org';
    imageName = 'littlebits.png';
    title = {
        ko: '리틀비츠',
        en: 'littleBits',
    };

    blockMenuBlocks = [
        'littlebits_get_number_sensor_value',
        'littlebits_get_digital_value',
        'littlebits_toggle_led',
        'littlebits_toggle_pwm',
        'littlebits_convert_scale',
    ];

    setZero() {
        Entry.hw.sendQueue.readablePorts = [];
        for (let port = 0; port < 20; port++) {
            Entry.hw.sendQueue[port] = 0;
            Entry.hw.sendQueue.readablePorts.push(port);
        }
        Entry.hw.update();
    }

    setLanguage() {
        return {
            ko: {
                template: {
                    littlebits_text: '%1',
                    littlebits_get_sensor_number: '%1  ',
                    littlebits_get_port_number: '%1  ',
                    littlebits_get_pwm_port_number: '%1  ',
                    littlebits_get_number_sensor_value: '아날로그 %1 번 센서값  ',
                    littlebits_get_digital_value: '디지털 %1 번 센서값  ',
                    littlebits_toggle_led: '디지털 %1 번 핀 %2 %3',
                    littlebits_toggle_pwm: '디지털 %1 번 핀을 %2 (으)로 정하기 %3',
                    littlebits_convert_scale: '%1 값의 범위를 %2 ~ %3 에서 %4 ~ %5 (으)로 바꾼값  ',
                },
                Menus: {
                    littlebits: '리틀비츠',
                },
            },
            en: {
                template: {
                    littlebits_text: '%1',
                    littlebits_get_sensor_number: '%1  ',
                    littlebits_get_port_number: '%1  ',
                    littlebits_get_pwm_port_number: '%1  ',
                    littlebits_get_number_sensor_value: '아날로그 %1 번 센서값  ',
                    littlebits_get_digital_value: '디지털 %1 번 센서값  ',
                    littlebits_toggle_led: '디지털 %1 번 핀 %2 %3',
                    littlebits_toggle_pwm: '디지털 %1 번 핀을 %2 (으)로 정하기 %3',
                    littlebits_convert_scale: '%1 값의 범위를 %2 ~ %3 에서 %4 ~ %5 (으)로 바꾼값  ',
                },
                Menus: {
                    littlebits: 'Littlebits',
                },
            },
        };
    }

    getBlocks() {
        return {
            littlebits_text: {
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
                            keyOption: 'littlebits_text',
                        },
                    ],
                },
            },
            littlebits_get_sensor_number: {
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
                            keyOption: 'littlebits_get_sensor_number',
                        },
                    ],
                },
            },
            littlebits_get_port_number: {
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
                            keyOption: 'littlebits_get_port_number',
                        },
                    ],
                },
            },
            littlebits_get_pwm_port_number: {
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
                            keyOption: 'littlebits_get_pwm_port_number',
                        },
                    ],
                },
            },
            littlebits_get_number_sensor_value: {
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
                            type: 'littlebits_get_sensor_number',
                        },
                    ],
                    type: 'littlebits_get_number_sensor_value',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                class: 'littlebits_value',
                isNotFor: ['littlebits'],
                func(sprite, script) {
                    const signal = script.getValue('VALUE', script);
                    return Entry.hw.getAnalogPortValue(signal[1]);
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            syntax: 'Arduino.sensor_value(%1)',
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
            littlebits_get_digital_value: {
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
                            type: 'littlebits_get_port_number',
                        },
                    ],
                    type: 'littlebits_get_digital_value',
                },
                paramsKeyMap: {
                    PORT: 0,
                },
                class: 'littlebits_value',
                isNotFor: ['littlebits'],
                func(sprite, script) {
                    const { hwModule = {} } = Entry.hw;
                    const { name } = hwModule;
                    if (name === 'ArduinoExt') {
                        return Entry.block.littlebits_ext_get_digital.func(sprite, script);
                    } else {
                        const signal = script.getNumberValue('PORT', script);
                        return Entry.hw.getDigitalPortValue(signal);
                    }
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            syntax: 'Arduino.digitalRead(%1)',
                            blockType: 'param',
                            replaceBlockType: 'littlebits_ext_get_digital',
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
            littlebits_toggle_led: {
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
                            type: 'littlebits_get_port_number',
                        },
                        null,
                        null,
                    ],
                    type: 'littlebits_toggle_led',
                },
                paramsKeyMap: {
                    VALUE: 0,
                    OPERATOR: 1,
                },
                class: 'littlebits_set',
                isNotFor: ['littlebits'],
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
                            syntax: 'Arduino.pin_digital(%1, %2)',
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
            littlebits_toggle_pwm: {
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
                            type: 'littlebits_get_pwm_port_number',
                        },
                        {
                            type: 'littlebits_text',
                            params: ['255'],
                        },
                        null,
                    ],
                    type: 'littlebits_toggle_pwm',
                },
                paramsKeyMap: {
                    PORT: 0,
                    VALUE: 1,
                },
                class: 'littlebits_set',
                isNotFor: ['littlebits'],
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
                            syntax: 'Arduino.set_pin_digital(%1, %2)',
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
            littlebits_convert_scale: {
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
                            type: 'littlebits_get_number_sensor_value',
                            params: [
                                {
                                    type: 'littlebits_get_sensor_number',
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
                    type: 'littlebits_convert_scale',
                },
                paramsKeyMap: {
                    VALUE1: 0,
                    VALUE2: 1,
                    VALUE3: 2,
                    VALUE4: 3,
                    VALUE5: 4,
                },
                class: 'littlebits',
                isNotFor: ['littlebits'],
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
                            syntax: 'Arduino.convert_scale(%1, %2, %3, %4, %5)',
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
        };
    }
}

module.exports = new LittleBits();
