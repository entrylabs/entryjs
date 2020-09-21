'use strict';

Entry.SensorBoard = {
    id: '1.2',
    name: 'sensorBoard',
    url: 'http://www.neweducation.co.kr/',
    imageName: 'entrybt.png',
    title: {
        ko: 'E-센서보드',
        en: 'E-Sensorboard',
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

Entry.SensorBoard.blockMenuBlocks = [
    //sensorBoard
    'sensorBoard_get_named_sensor_value',
    'sensorBoard_is_button_pressed',
    'sensorBoard_led',
    'sensorBoard_get_number_sensor_value',
    'sensorBoard_get_digital_value',
    'sensorBoard_toggle_led',
    'sensorBoard_toggle_pwm',
    'sensorBoard_convert_scale',
];

Entry.SensorBoard.getBlocks = function() {
    return {
        //region sensorBoard e센서보드
        sensorBoard_get_named_sensor_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['소리', '0'], ['빛 감지', '1'], ['슬라이더', '2'], ['온도', '3']],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'sensorBoard_get_named_sensor_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'sensorBoard',
            isNotFor: ['sensorBoard'],
            func: function(sprite, script) {
                return Entry.hw.getAnalogPortValue(script.getField('PORT', script));
            },
            syntax: { js: [], py: ['Sensorboard.sensor_value(%1)'] },
        },
        sensorBoard_is_button_pressed: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['빨간', '8'], ['파란', '9'], ['노랑', '10'], ['초록', '11']],
                    value: '8',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'sensorBoard_is_button_pressed',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'sensorBoard',
            isNotFor: ['sensorBoard'],
            func: function(sprite, script) {
                return Entry.hw.getDigitalPortValue(script.getNumberField('PORT', script));
            },
            syntax: { js: [], py: ['Sensorboard.is_button_pressed(%1)'] },
        },
        sensorBoard_led: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['빨간', '2'], ['초록', '3'], ['파란', '4'], ['노랑', '5']],
                    value: '2',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [['켜기', '255'], ['끄기', '0']],
                    value: '255',
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
                params: [null, null, null],
                type: 'sensorBoard_led',
            },
            paramsKeyMap: {
                PORT: 0,
                OPERATOR: 1,
            },
            class: 'sensorBoard',
            isNotFor: ['sensorBoard'],
            func: function(sprite, script) {
                Entry.hw.setDigitalPortValue(
                    script.getField('PORT'),
                    script.getNumberField('OPERATOR')
                );
                return script.callReturn();
            },
            syntax: { js: [], py: ['Sensorboard.led(%1, %2)'] },
        },
        //endregion sensorBoard e센서보드
        //region sensorBoard e센서보드
        sensorBoard_get_number_sensor_value: {
            parent: 'arduino_get_number_sensor_value',
            isNotFor: ['sensorBoard'],
            def: {
                params: [
                    {
                        type: 'arduino_get_sensor_number',
                    },
                ],
                type: 'sensorBoard_get_number_sensor_value',
            },
            class: 'arduino_value',
            syntax: { js: [], py: ['SensorBoard.get_number_sensor_value(%1)'] },
        },
        sensorBoard_get_digital_value: {
            parent: 'arduino_get_digital_value',
            isNotFor: ['sensorBoard'],
            def: {
                params: [
                    {
                        type: 'arduino_get_port_number',
                    },
                ],
                type: 'sensorBoard_get_digital_value',
            },
            class: 'arduino_value',
            syntax: { js: [], py: ['SensorBoard.get_digital_value(%1)'] },
        },
        sensorBoard_toggle_led: {
            parent: 'arduino_toggle_led',
            isNotFor: ['sensorBoard'],
            def: {
                params: [
                    {
                        type: 'arduino_get_port_number',
                    },
                    null,
                    null,
                ],
                type: 'sensorBoard_toggle_led',
            },
            class: 'arduino_set',
            syntax: { js: [], py: ['SensorBoard.toggle_led(%1)'] },
        },
        sensorBoard_toggle_pwm: {
            parent: 'arduino_toggle_pwm',
            isNotFor: ['sensorBoard'],
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
                type: 'sensorBoard_toggle_pwm',
            },
            class: 'arduino_set',
            syntax: { js: [], py: ['SensorBoard.toggle_pwm(%1, %2)'] },
        },
        sensorBoard_convert_scale: {
            parent: 'arduino_convert_scale',
            isNotFor: ['sensorBoard'],
            def: {
                params: [
                    {
                        type: 'arduino_get_number_sensor_value',
                        params: [
                            {
                                type: 'arduino_get_sensor_number',
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
                type: 'sensorBoard_convert_scale',
            },
            class: 'arduino',
            syntax: {
                js: [],
                py: ['SensorBoard.convert_scale(%1, %2, %3, %4, %5)'],
            },
        },
        //endregion sensorBoard e센서보드
    };
};

module.exports = Entry.SensorBoard;
