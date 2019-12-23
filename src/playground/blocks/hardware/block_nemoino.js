'use strict';

Entry.nemoino = {
    id: '1.6',
    name: 'nemoino',
    imageName: 'nemoino.png',
    title: {
        ko: '네모이노',
        en: 'NEMOino',
    },
    setZero: function() {
        Entry.hw.sendQueue.readablePorts = [];
        for (var port = 0; port < 20; port++) {
            Entry.hw.sendQueue[port] = 0;
            Entry.hw.sendQueue.readablePorts.push(port);
        }
        Entry.hw.update();
    },
};

Entry.nemoino.blockMenuBlocks = [
    //nemoino
    'nemoino_get_named_sensor_value',
    'nemoino_get_sound_status',
    'nemoino_is_button_pressed',
    'nemoino_get_accelerometer_direction',
    'nemoino_get_accelerometer_value',
    'nemoino_get_number_sensor_value',
    'nemoino_get_digital_value',
    'nemoino_toggle_led',
    'nemoino_toggle_pwm',
    'nemoino_convert_scale',
];

Entry.nemoino.getBlocks = function() {
    return {
        //region nemoino 네모이노
        nemoino_get_named_sensor_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1 센서값',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['소리', '0'],
                        ['빛', '1'],
                        ['슬라이더', '2'],
                        ['저항-A', '3'],
                        ['저항-B', '4'],
                        ['저항-C', '5'],
                        ['저항-D', '6'],
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
                type: 'nemoino_get_named_sensor_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'nemoino',
            isNotFor: ['nemoino'],
            func: function(sprite, script) {
                return Entry.hw.getAnalogPortValue(script.getField('PORT', script));
            },
        },
        nemoino_get_sound_status: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            template: '소리센서 %1',
            params: [
                {
                    type: 'Dropdown',
                    options: [['소리큼', 'GREAT'], ['소리작음', 'SMALL']],
                    value: 'GREAT',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'nemoino_get_sound_status',
            },
            paramsKeyMap: {
                STATUS: 0,
            },
            class: 'nemoino',
            isNotFor: ['nemoino'],
            func: function(sprite, script) {
                var value1 = script.getField('STATUS', script);
                var value2 = 0;
                if (value1 == 'GREAT') return Entry.hw.getAnalogPortValue(value2) > 600 ? 1 : 0;
                else return Entry.hw.getAnalogPortValue(value2) < 600 ? 1 : 0;
            },
        },
        nemoino_is_button_pressed: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            template: '보드의 %1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['버튼누름', '4'],
                        ['A연결됨', '17'],
                        ['B연결됨', '18'],
                        ['C연결됨', '19'],
                        ['D연결됨', '20'],
                    ],
                    value: '4',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'nemoino_is_button_pressed',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'nemoino',
            isNotFor: ['nemoino'],
            func: function(sprite, script) {
                var value = script.getNumberField('PORT', script);
                if (value > 14) {
                    value = value - 14;
                    return !Entry.hw.getAnalogPortValue(value);
                } else return !Entry.hw.getDigitalPortValue(value);
            },
        },
        nemoino_get_accelerometer_direction: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            template: '3축 가속도센서 %1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['왼쪽 기울임', 'LEFT'],
                        ['오른쪽 기울임', 'RIGHT'],
                        ['위쪽 기울임', 'FRONT'],
                        ['아래쪽 기울임', 'REAR'],
                        ['뒤집힘', 'REVERSE'],
                    ],
                    value: 'LEFT',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'nemoino_get_accelerometer_direction',
            },
            paramsKeyMap: {
                DIRECTION: 0,
            },
            class: 'nemoino',
            isNotFor: ['nemoino'],
            func: function(sprite, script) {
                var value1 = script.getField('DIRECTION', script);
                var value2 = 0;
                if (value1 == 'LEFT' || value1 == 'RIGHT') value2 = 3;
                else if (value1 == 'FRONT' || value1 == 'REAR') value2 = 4;
                else if (value1 == 'REVERSE') value2 = 5;
                var value3 = Entry.hw.getAnalogPortValue(value2);
                var value4 = 265;
                var value5 = 402;
                var value6 = -90;
                var value7 = 90;
                var result = value3;
                result -= value4;
                result = result * ((value7 - value6) / (value5 - value4));
                result += value6;
                result = Math.min(value7, result);
                result = Math.max(value6, result);
                result = Math.round(result);
                if (value1 == 'LEFT' || value1 == 'REAR') return result < -30 ? 1 : 0;
                else if (value1 == 'RIGHT' || value1 == 'FRONT') return result > 30 ? 1 : 0;
                else if (value1 == 'REVERSE') return result < -50 ? 1 : 0;
            },
        },
        nemoino_get_accelerometer_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: '3축 가속도센서 %1 축의 센서값',
            params: [
                {
                    type: 'Dropdown',
                    options: [['X', '3'], ['Y', '4'], ['Z', '5']],
                    value: '3',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'nemoino_get_accelerometer_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'nemoino',
            isNotFor: ['nemoino'],
            func: function(sprite, script) {
                var value1 = Entry.hw.getAnalogPortValue(script.getField('PORT', script));
                var value2 = 265;
                var value3 = 402;
                var value4 = -90;
                var value5 = 90;
                var result = value1;
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
                return Math.round(result);
            },
        },
        //endregion nemoino 네모이노
        //region nemoino 네모이노
        nemoino_get_number_sensor_value: {
            parent: 'arduino_get_number_sensor_value',
            isNotFor: ['nemoino'],
            def: {
                params: [
                    {
                        type: 'arduino_get_sensor_number',
                    },
                ],
                type: 'nemoino_get_number_sensor_value',
            },
            class: 'arduino_value',
            syntax: { js: [], py: ['Nemoino.sensor_value(%1)'] },
        },
        nemoino_get_digital_value: {
            parent: 'arduino_get_digital_value',
            isNotFor: ['nemoino'],
            def: {
                params: [
                    {
                        type: 'arduino_get_port_number',
                    },
                ],
                type: 'nemoino_get_digital_value',
            },
            class: 'arduino_value',
            syntax: { js: [], py: ['Nemoino.digital_value(%1)'] },
        },
        nemoino_toggle_led: {
            parent: 'arduino_toggle_led',
            isNotFor: ['nemoino'],
            def: {
                params: [
                    {
                        type: 'arduino_get_port_number',
                    },
                    null,
                    null,
                ],
                type: 'nemoino_toggle_led',
            },
            class: 'arduino_set',
            syntax: { js: [], py: ['Nemoino.toggle_led(%1)'] },
        },
        nemoino_toggle_pwm: {
            parent: 'arduino_toggle_pwm',
            isNotFor: ['nemoino'],
            def: {
                params: [
                    {
                        type: 'arduino_get_pwm_port_number',
                    },
                    {
                        type: 'arduino_text',
                        params: ['255'],
                    },
                    null,
                ],
                type: 'nemoino_toggle_pwm',
            },
            class: 'arduino_set',
            syntax: { js: [], py: ['Nemoino.toggle_pwm(%1, %2)'] },
        },
        nemoino_convert_scale: {
            parent: 'arduino_convert_scale',
            isNotFor: ['nemoino'],
            def: {
                params: [
                    {
                        type: 'arduino_get_number_sensor_value',
                        params: [
                            {
                                type: 'arduino_get_sensor_number',
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
                type: 'nemoino_convert_scale',
            },
            class: 'arduino',
            syntax: {
                js: [],
                py: ['Nemoino.convert_scale(%1, %2, %3, %4, %5)'],
            },
        },
        //endregion nemoino 네모이노
    };
};

module.exports = Entry.nemoino;
