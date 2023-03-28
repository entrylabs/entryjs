'use strict';

Entry.Roborobo_RoE = {
    id: '48.1',
    name: 'roborobo_roe',
    url: 'http://www.roborobo.co.kr',
    imageName: 'roborobo_roe.png',
    title: {
        ko: '로이',
        en: 'Ro-E',
    },
    setZero: function () {
        Entry.hw.sendQueue['LED'] = 0;
        Entry.hw.sendQueue['Melody'] = [0, 0, 0];   //[octave, note, duration]
        Entry.hw.sendQueue['LeftMotor'] = [0, 0];   //[direction, value]
        Entry.hw.sendQueue['RightMotor'] = [0, 0];  //[direction, value]
        Entry.hw.update();
    },
    motorDiretion: {
        STOP: 0,
        CW: 1,
        CCW: 2
    },
    monitorTemplate: {
        imgPath: 'hw/roborobo_roe.png',
        keys: ['value'],
        width: 256,
        height: 256,
        listPorts: {
            lColor: {
                name: 'Color Sensor(Left)',
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
            rColor: {
                name: 'Color Sensor(Right)',
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
            ir: {
                name: 'IR Sensor',
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
            switch: {
                name: 'Switch Sensor',
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
        },
        mode: 'both',
    },
};

Entry.Roborobo_RoE.setLanguage = function () {
    return {
        ko: {
            template: {
                roe_set_led: '%1 LED 켜기 %2',
                roe_set_led_off: 'LED 끄기 %1',
                roe_set_motor: '로이 %1 %2',
                roe_set_motor_value: '%1 모터 : %2 만큼 %3 %4',
                roe_set_melody: '%1 옥타브 %2 을(를) %3 초 연주 %4',
                roe_get_input_switch: '접촉센서가 %1 ?',
                roe_get_input_ir: '적외선 센서가 %1 ?',
                roe_get_input_color: '%1 컬러센서 값이 %2 인가?',
                roe_led_color_dropdown: '%1',
                roe_melody_dropdown: '%1',
                roe_motor_dropdown: '%1',
                roe_movement_dropdown: '%1',
                roe_detect_dropdown: '%1',
                roe_color_select_dropdown: '%1',
                roe_color_color_dropdown: '%1',
            },
            Blocks: {
                roe_color_sensor_left: '왼쪽',
                roe_color_sensor_right: '오른쪽',
                roe_color_sensor_both: '양쪽',
                roe_color_red: '빨간색',
                roe_color_orange: '주황색',
                roe_color_yellow: '노란색',
                roe_color_yellowgreen: '연두색',
                roe_color_green: '초록색',
                roe_color_skyblue: '하늘색',
                roe_color_blue: '파란색',
                roe_color_purple: '보라색',
                roe_color_pink: '분홍색',
                roe_color_white: '흰색',
                roe_color_black: '검정색',
                roe_color_random: '무작위 색',
                roe_color_none: '미감지',
                roe_motor_both: '양쪽',
                roe_motor_left: '왼쪽',
                roe_motor_right: '오른쪽',
                roe_move_forward: '전진',
                roe_move_backward: '후진',
                roe_move_turnleft: '좌회전',
                roe_move_turnright: '우회전',
                roe_move_stop: '정지',
                roe_detected: '감지되었는가',
                roe_undetected: '감지되지 않았는가',
                roe_melody_do: '도',
                roe_melody_doS: '도#',
                roe_melody_re: '레',
                roe_melody_miF: '미b',
                roe_melody_mi: '미',
                roe_melody_pa: '파',
                roe_melody_paS: '파#',
                roe_melody_sol: '솔',
                roe_melody_solS: '솔#',
                roe_melody_la: '라',
                roe_melody_siF: '시b',
                roe_melody_si: '시',
            }
        },
        en: {
            template: {
                roe_set_led: 'Turn on %1 LED %2',
                roe_set_led_off: 'Turn off LED %1',
                roe_set_motor: 'Ro-E %1 %2',
                roe_set_motor_value: '%1 motor(s) : Move %3 by %2 %4',
                roe_set_melody: 'Play %1 octave %2 tone for %3 second(s) %4',
                roe_get_input_switch: 'Is the switch sensor %1 ?',
                roe_get_input_ir: 'Is the IR sensor %1 ?',
                roe_get_input_color: 'Is %1 color sensor value %2 ?',
                roe_led_color_dropdown: '%1',
                roe_melody_dropdown: '%1',
                roe_motor_dropdown: '%1',
                roe_movement_dropdown: '%1',
                roe_detect_dropdown: '%1',
                roe_color_select_dropdown: '%1',
                roe_color_color_dropdown: '%1',
            },
            Blocks: {
                roe_color_sensor_left: 'left',
                roe_color_sensor_right: 'right',
                roe_color_sensor_both: 'both',
                roe_color_red: 'Red',
                roe_color_orange: 'Orange',
                roe_color_yellow: 'Yellow',
                roe_color_yellowgreen: 'Yellow Green',
                roe_color_green: 'Green',
                roe_color_skyblue: 'Sky Blue',
                roe_color_blue: 'Blue',
                roe_color_purple: 'Purple',
                roe_color_pink: 'Pink',
                roe_color_white: 'White',
                roe_color_black: 'Black',
                roe_color_random: 'Random',
                roe_color_none: 'Undetected',
                roe_motor_both: 'Both',
                roe_motor_left: 'Left',
                roe_motor_right: 'Right',
                roe_move_forward: 'forward',
                roe_move_backward: 'backward',
                roe_move_turnleft: 'turn left',
                roe_move_turnright: 'turn right',
                roe_move_stop: 'stop',
                roe_detected: 'detected',
                roe_undetected: 'undetected',
                roe_melody_do: 'C',
                roe_melody_doS: 'C#',
                roe_melody_re: 'D',
                roe_melody_miF: 'Eb',
                roe_melody_mi: 'E',
                roe_melody_pa: 'F',
                roe_melody_paS: 'F#',
                roe_melody_sol: 'G',
                roe_melody_solS: 'G#',
                roe_melody_la: 'A',
                roe_melody_siF: 'Bb',
                roe_melody_si: 'B',
            },
        },
    };
};

Entry.Roborobo_RoE.blockMenuBlocks = [
    'roe_set_led',
    'roe_set_led_off',
    'roe_set_motor',
    'roe_set_motor_value',
    'roe_set_melody',
    'roe_get_input_switch',
    'roe_get_input_ir',
    'roe_get_input_color',
];

Entry.Roborobo_RoE.getBlocks = function () {
    return {
        //region roe 로이
        roe_led_color_dropdown: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.roe_color_red, 1],
                        [Lang.Blocks.roe_color_orange, 2],
                        [Lang.Blocks.roe_color_yellow, 3],
                        [Lang.Blocks.roe_color_yellowgreen, 4],
                        [Lang.Blocks.roe_color_green, 5],
                        [Lang.Blocks.roe_color_skyblue, 6],
                        [Lang.Blocks.roe_color_blue, 7],
                        [Lang.Blocks.roe_color_purple, 8],
                        [Lang.Blocks.roe_color_pink, 9],
                        [Lang.Blocks.roe_color_white, 10]
                    ],
                    value: 1,
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
                VALUE: 0,
            },
            func: function (sprite, script) {
                return script.getNumberField('VALUE');
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
                                    [Lang.Blocks.roe_color_red, 1],
                                    [Lang.Blocks.roe_color_orange, 2],
                                    [Lang.Blocks.roe_color_yellow, 3],
                                    [Lang.Blocks.roe_color_yellowgreen, 4],
                                    [Lang.Blocks.roe_color_green, 5],
                                    [Lang.Blocks.roe_color_skyblue, 6],
                                    [Lang.Blocks.roe_color_blue, 7],
                                    [Lang.Blocks.roe_color_purple, 8],
                                    [Lang.Blocks.roe_color_pink, 9],
                                    [Lang.Blocks.roe_color_white, 10]
                                ],
                                value: 1,
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        keyOption: 'roe_led_color_dropdown',
                    },
                ],
            },
        },
        roe_melody_dropdown: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.roe_melody_do, 1],
                        [Lang.Blocks.roe_melody_re, 2],
                        [Lang.Blocks.roe_melody_mi, 3],
                        [Lang.Blocks.roe_melody_pa, 4],
                        [Lang.Blocks.roe_melody_sol, 5],
                        [Lang.Blocks.roe_melody_la, 6],
                        [Lang.Blocks.roe_melody_si, 7],
                    ],
                    value: 1,
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
                VALUE: 0,
            },
            func: function (sprite, script) {
                return script.getNumberField('VALUE', script);
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
                                    [Lang.Blocks.roe_melody_do, 1],
                                    [Lang.Blocks.roe_melody_re, 2],
                                    [Lang.Blocks.roe_melody_mi, 3],
                                    [Lang.Blocks.roe_melody_pa, 4],
                                    [Lang.Blocks.roe_melody_sol, 5],
                                    [Lang.Blocks.roe_melody_la, 6],
                                    [Lang.Blocks.roe_melody_si, 7],
                                ],
                                value: 1,
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'roe_melody_dropdown',
                    },
                ],
            },
        },
        roe_motor_dropdown: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.roe_motor_both, 1],
                        [Lang.Blocks.roe_motor_left, 2],
                        [Lang.Blocks.roe_motor_right, 3],
                    ],
                    value: 1,
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
                VALUE: 0,
            },
            func: function (sprite, script) {
                return script.getNumberField('VALUE');
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
                                    [Lang.Blocks.roe_motor_both, 1],
                                    [Lang.Blocks.roe_motor_left, 2],
                                    [Lang.Blocks.roe_motor_right, 3],
                                ],
                                value: 1,
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        keyOption: 'roe_motor_dropdown',
                    },
                ],
            },
        },
        roe_movement_dropdown: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.roe_move_forward, 1],
                        [Lang.Blocks.roe_move_backward, 2],
                        [Lang.Blocks.roe_move_turnleft, 3],
                        [Lang.Blocks.roe_move_turnright, 4],
                        [Lang.Blocks.roe_move_stop, 5],
                    ],
                    value: 1,
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
                VALUE: 0,
            },
            func: function (sprite, script) {
                return script.getNumberField('VALUE');
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
                                    [Lang.Blocks.roe_move_forward, 1],
                                    [Lang.Blocks.roe_move_backward, 2],
                                    [Lang.Blocks.roe_move_turnleft, 3],
                                    [Lang.Blocks.roe_move_turnright, 4],
                                    [Lang.Blocks.roe_move_stop, 5],
                                ],
                                value: 1,
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        keyOption: 'roe_movement_dropdown',
                    },
                ],
            },
        },
        roe_detect_dropdown: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.roe_detected, 1],
                        [Lang.Blocks.roe_undetected, 0],
                    ],
                    value: 1,
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
                VALUE: 0,
            },
            func: function (sprite, script) {
                return script.getNumberField('VALUE');
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
                                    [Lang.Blocks.roe_detected, 1],
                                    [Lang.Blocks.roe_undetected, 2],
                                ],
                                value: 1,
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        keyOption: 'roe_detect_dropdown',
                    },
                ],
            },
        },
        roe_color_select_dropdown: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.roe_color_sensor_both, 1],
                        [Lang.Blocks.roe_color_sensor_left, 2],
                        [Lang.Blocks.roe_color_sensor_right, 3],
                    ],
                    value: 1,
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
                VALUE: 0,
            },
            func: function (sprite, script) {
                return script.getNumberField('VALUE');
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
                                    [Lang.Blocks.roe_color_sensor_both, 1],
                                    [Lang.Blocks.roe_color_sensor_left, 2],
                                    [Lang.Blocks.roe_color_sensor_right, 3],
                                ],
                                value: 1,
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        keyOption: 'roe_color_select_dropdown',
                    },
                ],
            },
        },
        roe_color_color_dropdown: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.roe_color_red, 1],
                        [Lang.Blocks.roe_color_orange, 2],
                        [Lang.Blocks.roe_color_yellow, 3],
                        [Lang.Blocks.roe_color_yellowgreen, 7],
                        [Lang.Blocks.roe_color_green, 4],
                        [Lang.Blocks.roe_color_skyblue, 8],
                        [Lang.Blocks.roe_color_blue, 5],
                        [Lang.Blocks.roe_color_purple, 6],
                        [Lang.Blocks.roe_color_pink, 9],
                        [Lang.Blocks.roe_color_black, 10],
                        [Lang.Blocks.roe_color_white, 11],
                        [Lang.Blocks.roe_color_none, 127],
                    ],
                    value: 1,
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
                VALUE: 0,
            },
            func: function (sprite, script) {
                return script.getNumberField('VALUE');
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
                                    [Lang.Blocks.roe_color_red, 1],
                                    [Lang.Blocks.roe_color_orange, 2],
                                    [Lang.Blocks.roe_color_yellow, 3],
                                    [Lang.Blocks.roe_color_yellowgreen, 7],
                                    [Lang.Blocks.roe_color_green, 4],
                                    [Lang.Blocks.roe_color_skyblue, 8],
                                    [Lang.Blocks.roe_color_blue, 5],
                                    [Lang.Blocks.roe_color_purple, 6],
                                    [Lang.Blocks.roe_color_pink, 9],
                                    [Lang.Blocks.roe_color_black, 10],
                                    [Lang.Blocks.roe_color_white, 11],
                                    [Lang.Blocks.roe_color_none, 127],
                                ],
                                value: 1,
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        keyOption: 'roe_color_color_dropdown',
                    },
                ],
            },
        },
        roe_set_led: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string'
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12
                }
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'roe_led_color_dropdown',
                    },
                    null
                ],
                type: 'roe_set_led',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'roe_set',
            isNotFor: ['roborobo_roe'],
            func: function (sprite, script) {
                var color = script.getNumberValue('VALUE', script);
                Entry.hw.sendQueue['LED'] = color;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roborobo_roe.roe_set_led(%1)',
                        textParams: [
                            {
                                type: "Block",
                                accept: "string"
                            },
                            {
                                type: 'roe_led_color_dropdown'
                            }
                        ],
                    },
                ],
            },
        },
        roe_set_led_off: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: "Indicator",
                    img: "block_icon/hardware_icon.svg",
                    size: 12
                }
            ],
            events: {},
            def: {
                params: [
                    null
                ],
                type: 'roe_set_led_off'
            },
            paramsKeyMap: {},
            class: 'roe_set',
            isNotFor: ['roborobo_roe'],
            func: function (sprite, script) {
                Entry.hw.sendQueue['LED'] = 0;
            },
            syntax: {
                js: [],
                py: ['Roborobo_roe.roe_set_led_off()'],
            },
        },
        roe_set_melody: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['4', '4'],
                        ['5', '5'],
                        ['6', '6'],
                        ['7', '7'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string'
                },
                {
                    type: 'Block',
                    accept: 'string'
                },
                {
                    type: "Indicator",
                    img: "block_icon/hardware_icon.svg",
                    size: 12
                }
            ],
            events: {},
            def: {
                params: [
                    '4',
                    {
                        type: 'roe_melody_dropdown',
                    },
                    '1',
                    null
                ],
                type: 'roe_set_melody',
            },
            paramsKeyMap: {
                OCTAVE: 0,
                NOTE: 1,
                DURATION: 2
            },
            class: 'roe_set',
            isNotFor: ['roborobo_roe'],
            func: function (sprite, script) {
                if (!script.isStart) {
                    var octave = script.getNumberValue('OCTAVE', script);
                    var note = script.getNumberValue('NOTE', script);
                    var duration = script.getNumberValue('DURATION', script);

                    if (octave < 4) {
                        octave = 4;
                    } else if (octave > 7) {
                        octave = 7;
                    }

                    if (note < 1) {
                        note = 1;
                    } else if (note > 7) {
                        note = 7;
                    }
                    duration = duration < 0 ? 0 : duration;
                    duration = duration * 1000;

                    script.isStart = true;
                    script.timeFlag = 1;

                    Entry.hw.sendQueue['Melody'] = [octave, note, duration];

                    setTimeout(function () {
                        script.timeFlag = 0;
                    }, duration);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roborobo_roe.roe_set_melody(%1 %2 %3)',
                        textParams: [
                            '4',
                            {
                                type: 'roe_melody_dropdown',
                            },
                            '1',
                        ],
                    },
                ],
            },
        },
        roe_set_motor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: "Block",
                    accept: "string"
                },
                {
                    type: "Indicator",
                    img: "block_icon/hardware_icon.svg",
                    size: 12
                }
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'roe_movement_dropdown'
                    },
                    null
                ],
                type: 'roe_set_motor'
            },
            paramsKeyMap: {
                OPERATOR: 0,
            },
            class: 'roe_set',
            isNotFor: ['roborobo_roe'],
            func: function (sprite, script) {
                var op = script.getNumberValue('OPERATOR', script);
                if (op == 1) {
                    Entry.hw.sendQueue['LeftMotor'] = [Entry.Roborobo_RoE.motorDiretion.CCW, 0];
                    Entry.hw.sendQueue['RightMotor'] = [Entry.Roborobo_RoE.motorDiretion.CW, 0];
                } else if (op == 2) {
                    Entry.hw.sendQueue['LeftMotor'] = [Entry.Roborobo_RoE.motorDiretion.CW, 0];
                    Entry.hw.sendQueue['RightMotor'] = [Entry.Roborobo_RoE.motorDiretion.CCW, 0];
                } else if (op == 3) {
                    Entry.hw.sendQueue['LeftMotor'] = [Entry.Roborobo_RoE.motorDiretion.CW, 0];
                    Entry.hw.sendQueue['RightMotor'] = [Entry.Roborobo_RoE.motorDiretion.CW, 0];
                } else if (op == 4) {
                    Entry.hw.sendQueue['LeftMotor'] = [Entry.Roborobo_RoE.motorDiretion.CCW, 0];
                    Entry.hw.sendQueue['RightMotor'] = [Entry.Roborobo_RoE.motorDiretion.CCW, 0];
                } else if (op == 5) {
                    Entry.hw.sendQueue['LeftMotor'] = [Entry.Roborobo_RoE.motorDiretion.STOP, 0];
                    Entry.hw.sendQueue['RightMotor'] = [Entry.Roborobo_RoE.motorDiretion.STOP, 0];
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roborobo_roe.roe_set_motor(%1)',
                        textParams: [
                            {
                                type: 'roe_movement_dropdown'
                            },
                        ],
                    },
                ],
            },
        },
        roe_set_motor_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: "Block",
                    accept: "string"
                },
                {
                    type: "Block",
                    accept: "string"
                },
                {
                    type: "Block",
                    accept: "string"
                },
                {
                    type: "Indicator",
                    img: "block_icon/hardware_icon.svg",
                    size: 12
                }
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'roe_motor_dropdown'
                    },
                    '100',
                    {
                        type: 'roe_movement_dropdown'
                    },
                    null
                ],
                type: 'roe_set_motor_value'
            },
            paramsKeyMap: {
                MOTOR: 0,
                VALUE: 1,
                OPERATOR: 2,
            },
            class: 'roe_set',
            isNotFor: ['roborobo_roe'],
            func: function (sprite, script) {
                var motor = script.getNumberValue('MOTOR', script);
                var value = script.getNumberValue('VALUE', script);
                var op = script.getNumberValue('OPERATOR', script);

                if (value < 0) {
                    value = 0;
                } else if (value > 100) {
                    value = 100;
                }

                if (motor == 1) {
                    if (op == 1) {
                        Entry.hw.sendQueue['LeftMotor'] = [Entry.Roborobo_RoE.motorDiretion.CCW, value];
                        Entry.hw.sendQueue['RightMotor'] = [Entry.Roborobo_RoE.motorDiretion.CW, value];
                    } else if (op == 2) {
                        Entry.hw.sendQueue['LeftMotor'] = [Entry.Roborobo_RoE.motorDiretion.CW, value];
                        Entry.hw.sendQueue['RightMotor'] = [Entry.Roborobo_RoE.motorDiretion.CCW, value];
                    } else if (op == 3) {
                        Entry.hw.sendQueue['LeftMotor'] = [Entry.Roborobo_RoE.motorDiretion.CW, value];
                        Entry.hw.sendQueue['RightMotor'] = [Entry.Roborobo_RoE.motorDiretion.CW, value];
                    } else if (op == 4) {
                        Entry.hw.sendQueue['LeftMotor'] = [Entry.Roborobo_RoE.motorDiretion.CCW, value];
                        Entry.hw.sendQueue['RightMotor'] = [Entry.Roborobo_RoE.motorDiretion.CCW, value];
                    } else if (op == 5) {
                        Entry.hw.sendQueue['LeftMotor'] = [Entry.Roborobo_RoE.motorDiretion.STOP, value];
                        Entry.hw.sendQueue['RightMotor'] = [Entry.Roborobo_RoE.motorDiretion.STOP, value];
                    }
                } else if (motor == 2) {
                    if (op == 1) {
                        Entry.hw.sendQueue['LeftMotor'] = [Entry.Roborobo_RoE.motorDiretion.CCW, value];
                    } else if (op == 2) {
                        Entry.hw.sendQueue['LeftMotor'] = [Entry.Roborobo_RoE.motorDiretion.CW, value];
                    } else if (op == 3) {
                        Entry.hw.sendQueue['LeftMotor'] = [Entry.Roborobo_RoE.motorDiretion.CW, value];
                    } else if (op == 4) {
                        Entry.hw.sendQueue['LeftMotor'] = [Entry.Roborobo_RoE.motorDiretion.CCW, value];
                    } else if (op == 5) {
                        Entry.hw.sendQueue['LeftMotor'] = [Entry.Roborobo_RoE.motorDiretion.STOP, value];
                    }
                } else if (motor == 3) {
                    if (op == 1) {
                        Entry.hw.sendQueue['RightMotor'] = [Entry.Roborobo_RoE.motorDiretion.CW, value];
                    } else if (op == 2) {
                        Entry.hw.sendQueue['RightMotor'] = [Entry.Roborobo_RoE.motorDiretion.CCW, value];
                    } else if (op == 3) {
                        Entry.hw.sendQueue['RightMotor'] = [Entry.Roborobo_RoE.motorDiretion.CW, value];
                    } else if (op == 4) {
                        Entry.hw.sendQueue['RightMotor'] = [Entry.Roborobo_RoE.motorDiretion.CCW, value];
                    } else if (op == 5) {
                        Entry.hw.sendQueue['RightMotor'] = [Entry.Roborobo_RoE.motorDiretion.STOP, value];
                    }
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roborobo_roe.roe_set_motor_value(%1 %2 %3)',
                        textParams: [
                            {
                                type: 'roe_motor_dropdown'
                            },
                            '100',
                            {
                                type: 'roe_movement_dropdown'
                            },
                        ],
                    },
                ],
            },
        },
        roe_get_input_switch: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string'
                },
                {
                    type: "Indicator",
                    img: "block_icon/hardware_icon.svg",
                    size: 12
                }
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'roe_detect_dropdown',
                    },
                    null
                ],
                type: 'roe_get_input_switch'
            },
            paramsKeyMap: {
                DETECT: 0
            },
            class: 'roe_get',
            isNotFor: ['roborobo_roe'],
            func: function (sprite, script) {
                var detect = script.getNumberValue('DETECT', script);
                var value = Entry.hw.portData['Switch'];
                // console.log('Switch Value : ' + value);
                return detect == value ? true : false;
            },
            syntax: {
                js: [],
                py: ['Roborobo_roe.roe_get_input_switch()'],
            },
        },
        roe_get_input_ir: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string'
                },
                {
                    type: "Indicator",
                    img: "block_icon/hardware_icon.svg",
                    size: 12
                }
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'roe_detect_dropdown',
                    },
                    null
                ],
                type: 'roe_get_input_ir'
            },
            paramsKeyMap: {
                DETECT: 0
            },
            class: 'roe_get',
            isNotFor: ['roborobo_roe'],
            func: function (sprite, script) {
                var detect = script.getNumberValue('DETECT', script);
                var value = Entry.hw.portData['IR'];
                // console.log('IR Value : ' + value);
                return detect == value ? true : false;
            },
            syntax: {
                js: [],
                py: ['Roborobo_roe.roe_get_input_ir()'],
            },
        },
        roe_get_input_color: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string'
                },
                {
                    type: 'Block',
                    accept: 'string'
                },
                {
                    type: "Indicator",
                    img: "block_icon/hardware_icon.svg",
                    size: 12
                }
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'roe_color_select_dropdown',
                    },
                    {
                        type: 'roe_color_color_dropdown',
                    },
                    null
                ],
                type: 'roe_get_input_color'
            },
            paramsKeyMap: {
                SENSOR: 0,
                COLOR: 1
            },
            class: 'roe_get',
            isNotFor: ['roborobo_roe'],
            func: function (sprite, script) {
                var result = false;
                var sensor = script.getNumberValue('SENSOR', script);
                var color = script.getNumberValue('COLOR', script);
                var left = Entry.hw.portData['LeftColor'];
                var right = Entry.hw.portData['RightColor'];

                if (sensor == 1) {
                    if (left == color && right == color) {
                        result = true;
                    }
                } else if (sensor == 2) {
                    result = left == color ? true : false;
                } else if (sensor == 3) {
                    result = right == color ? true : false;
                }
                return result;
            },
            syntax: {
                js: [],
                py: ['Roborobo_roe.roe_get_input_color()'],
            },
        },
        //endregion roe 로이
    };
};

module.exports = Entry.Roborobo_RoE;
