'use strict';

Entry.joystick = {
    id: '1.4',
    name: 'joystick',
    url: 'http://www.kocoafab.cc/',
    imageName: 'joystick.png',
    title: {
        "ko": "조이스틱 센서 쉴드",
        "en": "Joystick Sensor Shield"
    },
    setZero: function() {
        if (!Entry.hw.sendQueue.SET) {
            Entry.hw.sendQueue = {
                GET: {},
                SET: {},
            };
        } else {
            var keySet = Object.keys(Entry.hw.sendQueue.SET);
            keySet.forEach(function(key) {
                Entry.hw.sendQueue.SET[key].data = 0;
                Entry.hw.sendQueue.SET[key].time = new Date().getTime();
            });
        }
        Entry.hw.update();
    },
	sensorTypes: {
        ALIVE: 0,
        DIGITAL: 1,
        ANALOG: 2,
        PWM: 3,
        SERVO_PIN: 4,
        TONE: 5,
        PULSEIN: 6,
        ULTRASONIC: 7,
        TIMER: 8,
    },
    toneTable: {
        '0': 0,
        C: 1,
        CS: 2,
        D: 3,
        DS: 4,
        E: 5,
        F: 6,
        FS: 7,
        G: 8,
        GS: 9,
        A: 10,
        AS: 11,
        B: 12,
    },
    toneMap: {
        '1': [33, 65, 131, 262, 523, 1046, 2093, 4186],
        '2': [35, 69, 139, 277, 554, 1109, 2217, 4435],
        '3': [37, 73, 147, 294, 587, 1175, 2349, 4699],
        '4': [39, 78, 156, 311, 622, 1245, 2849, 4978],
        '5': [41, 82, 165, 330, 659, 1319, 2637, 5274],
        '6': [44, 87, 175, 349, 698, 1397, 2794, 5588],
        '7': [46, 92, 185, 370, 740, 1480, 2960, 5920],
        '8': [49, 98, 196, 392, 784, 1568, 3136, 6272],
        '9': [52, 104, 208, 415, 831, 1661, 3322, 6645],
        '10': [55, 110, 220, 440, 880, 1760, 3520, 7040],
        '11': [58, 117, 233, 466, 932, 1865, 3729, 7459],
        '12': [62, 123, 247, 494, 988, 1976, 3951, 7902],
    },
    highList: ['high', '1', 'on'],
    lowList: ['low', '0', 'off'],
    BlockState: {},
};

Entry.joystick.setLanguage = function() {
    return {
        ko: {
            template: {
                joystick_get_analog_value: '아날로그 %1 번 센서값',
                joystick_get_analog_value_map:
                    '%1 의 범위를 %2 ~ %3 에서 %4 ~ %5 로 바꾼값',
                joystick_get_ultrasonic_value:
                    '울트라소닉 Trig %1 Echo %2 센서값',
                joystick_toggle_led: '디지털 %1 번 핀 %2 %3',
                joystick_digital_pwm: '디지털 %1 번 핀을 %2 (으)로 정하기 %3',
                joystick_set_tone:
                    '피에조부저를 %1 %2 음으로 %3 초 연주하기 %4',
                joystick_set_servo:
                    '디지털 %1 번 핀의 서보모터를 %2 의 각도로 정하기 %3',
                joystick_get_digital: '디지털 %1 번 센서값',
		joystick_is_button_pressed: '%1 버튼이 눌렸는가?',
		joystick_get_joystick_value: '조이스틱을 %1 으로 움직였는가?',
		joystick_get_sensor_value: '%1 의 측정값',
		joystick_toggle_motor: '진동모터 %1 %2',
		joystick_toggle_shield_led: '%1 번째 LED를 %2 %3',
		joystick_get_led_number: '%1',
            }
        },
        en: {
            template: {
                joystick_get_analog_value: 'Analog %1 Sensor value',
                joystick_get_analog_value_map:
                    'Map Value %1 %2 ~ %3 to %4 ~ %5',
                joystick_get_ultrasonic_value:
                    'Read ultrasonic sensor trig pin %1 echo pin %2',
                joystick_toggle_led: 'Digital %1 Pin %2 %3',
                joystick_digital_pwm: 'Digital %1 Pin %2 %3',
                joystick_set_tone:
                    'Play tone on note %1 octave %2 beat %3 %4',
                joystick_set_servo: 'Set servo pin %1 angle as %2 %3',
                joystick_get_digital: 'Digital %1 Sensor value',
		joystick_is_button_pressed: 'button pressed %1',
		joystick_get_joystick_value: 'when the joystick move to %1',
		joystick_get_sensor_value: '%1 value',
		joystick_toggle_motor: 'vibrator motor %1 %2',
		joystick_toggle_shield_led: '%2 the sensorshield %1 LED %3',
		joystick_get_led_number: '%1',
            }
        },
    };
};

Entry.joystick.blockMenuBlocks = [
	'joystick_get_analog_value',
	'joystick_get_analog_value_map',
	'joystick_get_ultrasonic_value',
	'joystick_get_digital',
	'joystick_toggle_led',
	'joystick_digital_pwm',
	'joystick_set_servo',
	'joystick_toggle_shield_led',
	'joystick_set_tone',
	'joystick_toggle_motor',
	'joystick_is_button_pressed',
	'joystick_get_joystick_value',
	'joystick_get_sensor_value',


	
];

Entry.joystick.getBlocks = function() {
    return {
        joystick_analog_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['A0', '0'],
                        ['A1', '1'],
                        ['A2', '2'],
                        ['A3', '3'],
                        ['A4', '4'],
                        ['A5', '5'],
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
            func: function(sprite, script) {
                return script.getField('PORT');
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
                                    ['A0', '0'],
                                    ['A1', '1'],
                                    ['A2', '2'],
                                    ['A3', '3'],
                                    ['A4', '4'],
                                    ['A5', '5'],
                                ],
                                value: '0',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringKey,
                                codeMap:
                                    'Entry.CodeMap.Arduino.joystick_analog_list[0]',
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'joystick_analog_list',
                    },
                ],
            },
        },
        joystick_get_analog_value: {
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
                        type: 'joystick_analog_list',
                    },
                ],
                type: 'joystick_get_analog_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'joystickGet',
            isNotFor: ['joystick'],
            func: function(sprite, script) {
                var port = script.getValue('PORT', script);
                var ANALOG = Entry.hw.portData.ANALOG;
                if (port[0] === 'A') port = port.substring(1);
                return ANALOG ? ANALOG[port] || 0 : 0;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.analogRead(%1)',
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
        joystick_get_analog_value_map: {
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
                        type: 'joystick_get_analog_value',
                        params: [
                            {
                                type: 'joystick_analog_list',
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
                type: 'joystick_get_analog_value_map',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE2: 1,
                VALUE3: 2,
                VALUE4: 3,
                VALUE5: 4,
            },
            class: 'joystickGet',
            isNotFor: ['joystick'],
            func: function(sprite, script) {
                var result = script.getValue('PORT', script);
                var ANALOG = Entry.hw.portData.ANALOG;
                var value2 = script.getNumberValue('VALUE2', script);
                var value3 = script.getNumberValue('VALUE3', script);
                var value4 = script.getNumberValue('VALUE4', script);
                var value5 = script.getNumberValue('VALUE5', script);
                var stringValue4 = script.getValue('VALUE4', script);
                var stringValue5 = script.getValue('VALUE5', script);
                var isFloat = false;

                if (
                    (Entry.Utils.isNumber(stringValue4) &&
                        stringValue4.indexOf('.') > -1) ||
                    (Entry.Utils.isNumber(stringValue5) &&
                        stringValue5.indexOf('.') > -1)
                ) {
                    isFloat = true;
                }

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
                        syntax: 'Arduino.map(%1, %2, %3, %4, %5)',
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
        joystick_get_ultrasonic_value: {
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
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'arduino_get_port_number',
                        params: ['2'],
                    },
                    {
                        type: 'arduino_get_port_number',
                        params: ['4'],
                    },
                ],
                type: 'joystick_get_ultrasonic_value',
            },
            paramsKeyMap: {
                PORT1: 0,
                PORT2: 1,
            },
            class: 'joystickGet',
            isNotFor: ['joystick'],
            func: function(sprite, script) {
                var port1 = script.getNumberValue('PORT1', script);
                var port2 = script.getNumberValue('PORT2', script);

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                delete Entry.hw.sendQueue['SET'][port1];
                delete Entry.hw.sendQueue['SET'][port2];

                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                Entry.hw.sendQueue['GET'][
                    Entry.joystick.sensorTypes.ULTRASONIC
                ] = {
                    port: [port1, port2],
                    time: new Date().getTime(),
                };
                return Entry.hw.portData.ULTRASONIC || 0;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.ultrasonicRead(%1, %2)',
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
                        ],
                    },
                ],
            },
        },
        joystick_get_digital: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
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
                        type: 'arduino_get_port_number',
                        params: [2],
                    },
                ],
                type: 'joystick_get_digital',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'joystickGet',
            isNotFor: ['joystick'],
            func: function(sprite, script) {
                const { hwModule = {} } = Entry.hw;
                const { name } = hwModule;
                if(name === 'joystick') {
                    var port = script.getNumberValue('PORT', script);
                    var DIGITAL = Entry.hw.portData.DIGITAL;
                    if (!Entry.hw.sendQueue['GET']) {
                        Entry.hw.sendQueue['GET'] = {};
                    }
                    Entry.hw.sendQueue['GET'][
                        Entry.joystick.sensorTypes.DIGITAL
                    ] = {
                        port: port,
                        time: new Date().getTime(),
                    };
                    return DIGITAL ? DIGITAL[port] || 0 : 0;
                } else {
                    return Entry.block.arduino_get_digital_value.func(sprite, script);
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.digitalRead(%1)',
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
        joystick_toggle_led: {
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
                        type: 'arduino_get_port_number',
                        params: [3],
                    },
                    {
                        type: 'arduino_get_digital_toggle',
                        params: ['on'],
                    },
                    null,
                ],
                type: 'joystick_toggle_led',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'joystick',
            isNotFor: ['joystick'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var value = script.getValue('VALUE');

                if (typeof value === 'string') {
                    value = value.toLowerCase();
                }
                if (Entry.joystick.highList.indexOf(value) > -1) {
                    value = 255;
                } else if (Entry.joystick.lowList.indexOf(value) > -1) {
                    value = 0;
                } else {
                    throw new Error();
                }
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.joystick.sensorTypes.DIGITAL,
                    data: value,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.digitalWrite(%1, %2)',
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
        joystick_digital_pwm: {
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
                        type: 'arduino_get_pwm_port_number',
                    },
                    {
                        type: 'text',
                        params: ['255'],
                    },
                    null,
                ],
                type: 'joystick_digital_pwm',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'joystick',
            isNotFor: ['joystick'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var value = script.getNumberValue('VALUE');
                value = Math.round(value);
                value = Math.max(value, 0);
                value = Math.min(value, 255);
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.joystick.sensorTypes.PWM,
                    data: value,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.analogWrite(%1, %2)',
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
        joystick_tone_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.silent, '0'],
                        [Lang.Blocks.do_name, 'C'],
                        [Lang.Blocks.do_sharp_name, 'CS'],
                        [Lang.Blocks.re_name, 'D'],
                        [Lang.Blocks.re_sharp_name, 'DS'],
                        [Lang.Blocks.mi_name, 'E'],
                        [Lang.Blocks.fa_name, 'F'],
                        [Lang.Blocks.fa_sharp_name, 'FS'],
                        [Lang.Blocks.sol_name, 'G'],
                        [Lang.Blocks.sol_sharp_name, 'GS'],
                        [Lang.Blocks.la_name, 'A'],
                        [Lang.Blocks.la_sharp_name, 'AS'],
                        [Lang.Blocks.si_name, 'B'],
                    ],
                    value: 'C',
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
                NOTE: 0,
            },
            func: function(sprite, script) {
                return script.getField('NOTE');
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
                                    [Lang.Blocks.silent, '0'],
                                    [Lang.Blocks.do_name, 'C'],
                                    [Lang.Blocks.do_sharp_name, 'CS'],
                                    [Lang.Blocks.re_name, 'D'],
                                    [Lang.Blocks.re_sharp_name, 'DS'],
                                    [Lang.Blocks.mi_name, 'E'],
                                    [Lang.Blocks.fa_name, 'F'],
                                    [Lang.Blocks.fa_sharp_name, 'FS'],
                                    [Lang.Blocks.sol_name, 'G'],
                                    [Lang.Blocks.sol_sharp_name, 'GS'],
                                    [Lang.Blocks.la_name, 'A'],
                                    [Lang.Blocks.la_sharp_name, 'AS'],
                                    [Lang.Blocks.si_name, 'B'],
                                ],
                                value: 'C',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters
                                        .returnStringValueUpperCase,
                            },
                        ],
                        keyOption: 'joystick_tone_list',
                    },
                ],
            },
        },
        joystick_tone_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'joystick_tone_list',
                    },
                ],
                type: 'joystick_tone_value',
            },
            paramsKeyMap: {
                NOTE: 0,
            },
            func: function(sprite, script) {
                return script.getNumberValue('NOTE');
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        keyOption: 'joystick_tone_value',
                    },
                ],
            },
        },
        joystick_octave_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', '1'],
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['5', '5'],
                        ['6', '6'],
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
            },
            paramsKeyMap: {
                OCTAVE: 0,
            },
            func: function(sprite, script) {
                return script.getField('OCTAVE');
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        keyOption: 'joystick_octave_list',
                    },
                ],
            },
        },
        joystick_set_tone: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'joystick_tone_list',
                    },
                    {
                        type: 'joystick_octave_list',
                    },
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'joystick_set_tone',
            },
            paramsKeyMap: {
                NOTE: 0,
                OCTAVE: 1,
                DURATION: 2,
            },
            class: 'joysticksensor',
            isNotFor: ['joystick'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var port = 6;

                if (!script.isStart) {
                    var note = script.getValue('NOTE', script);
                    if (!Entry.Utils.isNumber(note))
						
                        note = Entry.joystick.toneTable[note];

                    if (note < 0) {
                        note = 0;
                    } else if (note > 12) {
                        note = 12;
                    }

                    var duration = script.getNumberValue('DURATION', script);

                    if (duration < 0) {
                        duration = 0;
                    }

                    if (!sq['SET']) {
                        sq['SET'] = {};
                    }

                    if (duration === 0) {
                        sq['SET'][port] = {
                            type: Entry.joystick.sensorTypes.TONE,
                            data: 0,
                            time: new Date().getTime(),
                        };
                        return script.callReturn();
                    }

                    var octave = script.getNumberValue('OCTAVE', script) - 1;
                    if (octave < 0) {
                        octave = 0;
                    } else if (octave > 5) {
                        octave = 5;
                    }

                    var value = 0;

                    if (note != 0) {
                        value = Entry.joystick.toneMap[note][octave];
                    }

                    duration = duration * 1000;
                    script.isStart = true;
                    script.timeFlag = 1;

                    sq['SET'][port] = {
                        type: Entry.joystick.sensorTypes.TONE,
                        data: {
                            value: value,
                            duration: duration,
                        },
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, duration + 32);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    sq['SET'][port] = {
                        type: Entry.joystick.sensorTypes.TONE,
                        data: 0,
                        time: new Date().getTime(),
                    };
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.tone(%1, %2, %3, %4)',
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
                        ],
                    },
                ],
            },
        },
        joystick_set_servo: {
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
                        type: 'arduino_get_port_number',
                        params: ['3'],
                    },
                    null,
                ],
                type: 'joystick_set_servo',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'joystick',
            isNotFor: ['joystick'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var port = script.getNumberValue('PORT', script);
                var value = script.getNumberValue('VALUE', script);
                value = Math.min(180, value);
                value = Math.max(0, value);

                if (!sq['SET']) {
                    sq['SET'] = {};
                }
                sq['SET'][port] = {
                    type: Entry.joystick.sensorTypes.SERVO_PIN,
                    data: value,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.servomotorWrite(%1, %2)',
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
		joystick_is_button_pressed: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['흰색', '16'],
                        ['노랑', '9'],
                        ['빨강', '8'],
                        ['파랑', '17'],
                        ['왼쪽 위', '4'],
                        ['오른쪽 위', '5'],
			['조이스틱', '10'],
                    ],
                    value: '16',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'joystick_is_button_pressed',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'joysticksensor',
            isNotFor: ['joystick'],
            func: function(sprite, script) {
                const { hwModule = {} } = Entry.hw;
                const { name } = hwModule;
                if(name === 'joystick') {
                    var port = script.getNumberField('PORT', script)
                    var DIGITAL = Entry.hw.portData.DIGITAL;
                    if (!Entry.hw.sendQueue['GET']) {
                        Entry.hw.sendQueue['GET'] = {};
                    }
                    Entry.hw.sendQueue['GET'][
                        Entry.joystick.sensorTypes.DIGITAL
                    ] = {
                        port: port,
                        time: new Date().getTime(),
                    };
                    return DIGITAL ? !DIGITAL[port] || 0 : 0;
                } else {
                    return Entry.block.arduino_get_digital_value.func(sprite, script);
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.digitalRead(%1)',
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
		joystick_get_joystick_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
             params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['오른쪽', '1'],
                        ['왼쪽', '2'],
                        ['위', '3'],
                        ['아래', '4'],
			['오른쪽 위', '5'],
                        ['오른쪽 아래', '6'],
                        ['왼쪽 위', '7'],
                        ['왼쪽 아래', '8'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'joystick_get_joystick_value',
            },
            paramsKeyMap: {
                STICK: 0,
            },
            class: 'joysticksensor',
            isNotFor: ['joystick'],
            func: function(sprite, script) {
		var stick = script.getNumberField('STICK', script)
                var ANALOG = Entry.hw.portData.ANALOG;
		if(stick === 1 && ANALOG[0] > 800) {
			return 1;
		} else if(stick === 2 && ANALOG[0] < 100) {
			return 1;
		} else if(stick === 3 && ANALOG[1] > 800) {
			return 1;
		} else if(stick === 4 && ANALOG[1] < 100) {
			return 1;
		} else if(stick === 5 && ANALOG[0] > 700 && ANALOG[1] > 700) {
			return 1;
		} else if(stick === 6 && ANALOG[0] > 700 && ANALOG[1] < 300) {
			return 1;
		} else if(stick === 7 && ANALOG[0] < 300 && ANALOG[1] > 700) {
			return 1;
		} else if(stick === 8 && ANALOG[0] < 300 && ANALOG[1] < 300) {
			return 1;
		} else { 
			return 0;
		}
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.analogRead(%1)',
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
		joystick_get_sensor_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
				{
					type: 'Dropdown',
                    options: [
                        ['가변저항', '1'],
                        ['빛감지센서', '2'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
				}
            ],
            events: {},
            def: {
				params: [null],
                type: 'joystick_get_sensor_value',
            },
            paramsKeyMap: {
				PORT: 0,
            },
            class: 'joysticksensor',
            isNotFor: ['joystick'],
            func: function(sprite, script) {
                var port = script.getNumberField('PORT', script)
				if(port === 1) {
					port = 'A4';
				} else if(port === 2) {
					port = 'A5';
				} else {
					port = '0';
				}
                var ANALOG = Entry.hw.portData.ANALOG;
                if (port[0] === 'A') port = port.substring(1);
                return ANALOG ? ANALOG[port] || 0 : 0;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.analogRead(%1)',
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
		joystick_toggle_motor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
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
                        type: 'arduino_get_digital_toggle',
                        params: ['on'],
                    },
                    null,
                ],
                type: 'joystick_toggle_motor',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'joysticksensor',
            isNotFor: ['joystick'],
            func: function(sprite, script) {
                var port = 7;
                var value = script.getValue('VALUE');

                if (typeof value === 'string') {
                    value = value.toLowerCase();
                }
                if (Entry.joystick.highList.indexOf(value) > -1) {
                    value = 255;
                } else if (Entry.joystick.lowList.indexOf(value) > -1) {
                    value = 0;
                } else {
                    throw new Error();
                }
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.joystick.sensorTypes.DIGITAL,
                    data: value,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.digitalWrite(7, %1)',
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
		joystick_get_led_number: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', '1'],
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['5', '5'],
                    ],
                    value: '1',
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
                OPERATOR: 0,
            },
            isNotFor: ['joystick'],
            func: function(sprite, script) {
                return script.getStringField('OPERATOR');
            },
            syntax: {
                js: [],
                py: [],
            },
        },
		joystick_toggle_shield_led: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
					defaultType: 'number'
                },
                {
                    type: 'Block',
                    accept: 'string',
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
                        	type: 'joystick_get_led_number',
				params: [null],
                    	},
                    	{
                      	  	type: 'arduino_get_digital_toggle',
                     	   	params: ['on'],
                  	},
                 	   	null,
                ],
                type: 'joystick_toggle_shield_led',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'joysticksensor',
            isNotFor: ['joystick'],
            func: function(sprite, script) {
                var port = script.getValue('PORT');
		if(port === '1') {
			port = 2;
		} else if (port === '2') {
			port = 3;
		} else if (port === '3') {
			port = 11;
		} else if (port === '4') {
			port = 12;
		} else if (port === '5') {
			port = 13;
		} else {
			port = null;
		}
                var value = script.getValue('VALUE');

                if (typeof value === 'string') {
                    value = value.toLowerCase();
                }
                if (Entry.joystick.highList.indexOf(value) > -1) {
                    value = 255;
                } else if (Entry.joystick.lowList.indexOf(value) > -1) {
                    value = 0;
                } else {
                    throw new Error();
                }
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.joystick.sensorTypes.DIGITAL,
                    data: value,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.digitalWrite(%1, %2)',
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
        //endregion joystick 조이스틱
    };
};

module.exports = Entry.joystick;
