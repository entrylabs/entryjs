'use strict';

Entry.iboard = {
    id: '9.1',
    name: 'iboard',
    url: 'http://www.io-tech.co.kr',
    imageName: 'iboard.png',
    title: {
        en: 'iboard',
        ko: '아이보드',
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
Entry.iboard.blockMenuBlocks = [
    'iboard_tmp',
    'iboard_var_res',
    'iboard_cds',
    'iboard_mic',
    'iboard_button',
    'iboard_led',
    'iboard_rgb_led',
    'iboard_pwm_led',
    'iboard_set_tone',
    'iboard_motor',
    'iboard_get_analog_value',
    'iboard_get_analog_value_map',
    'iboard_get_digital',
    'iboard_toggle_led',
    'iboard_digital_pwm',
];
Entry.iboard.setLanguage = function() {
    return {
        ko: {
            template: {
                iboard_button: '%1  버튼을 눌렀는가?',
                iboard_digital_pwm: '디지털 %1 번 핀을 %2 (으)로 정하기 %3',
                iboard_get_analog_value: '아날로그 %1 번 센서값  ',
                iboard_get_analog_value_map: '%1 값의 범위를 %2 ~ %3 에서 %4 ~ %5 (으)로 바꾼값  ',
                iboard_get_digital: '디지털 %1 번 센서값  ',
                iboard_led: 'LED %1 번을 %2 %3',
                iboard_motor: '모터를 %2 으로 동작하기 %3',
                iboard_pwm_led: 'LED %1 번의 밝기를 %2 (으)로 정하기 %3',
                iboard_rgb_led: 'RGB LED의 %1 LED %2 %3',
                iboard_set_tone: '디지털 %1 번 핀의 버저를 %2 %3 음으로 %4 초 연주하기 %5',
                iboard_toggle_led: '디지털 %1 번 핀 %2 %3',
            },
            Blocks: {
                iboard_analog_number_0: 'A0',
                iboard_analog_number_1: 'A1',
                iboard_analog_number_2: 'A2',
                iboard_analog_number_3: 'A3',
                iboard_analog_number_4: 'A4',
                iboard_analog_number_5: 'A5',
                iboard_light: '빛센서가 ',
                iboard_num_pin_1: 'LED 상태를',
                iboard_num_pin_2: '번 스위치가',
                iboard_num_pin_3: '아날로그',
                iboard_num_pin_4: '번 ',
                iboard_num_pin_5: '센서값',
                iboard_string_1: '켜짐',
                iboard_string_2: '꺼짐',
                iboard_string_3: '밝음',
                iboard_string_4: '어두움',
                iboard_string_5: '눌림',
                iboard_string_6: '열림',
                iboard_switch: '스위치 ',
                iboard_tilt: '기울기센서 상태가',
            },
            Device: {
                iboard: '아이보드',
            },
            Menus: {
                iboard: '아이보드',
            },
        },
        en: {
            template: {
                iboard_button: 'Pressed %1 button?',
                iboard_digital_pwm: 'Digital %1 Pin %2 %3',
                iboard_get_analog_value: 'Analog %1 Sensor value  ',
                iboard_get_analog_value_map: 'Map Value %1 %2 ~ %3 to %4 ~ %5  ',
                iboard_get_digital: 'Digital %1 Sensor value  ',
                iboard_led: 'Digital %1 Pin %2 %3',
                iboard_motor: 'Digital %1 Pin %2 %3',
                iboard_pwm_led: 'Digital %1 Pin %2 %3',
                iboard_rgb_led: ' %1 LED %2 %3',
                iboard_set_tone: 'Play tone pin %1 on note %2 octave %3 beat %4 %5',
                iboard_toggle_led: 'Digital %1 Pin %2 %3',
            },
            Blocks: {
                iboard_analog_number_0: 'A0',
                iboard_analog_number_1: 'A1',
                iboard_analog_number_2: 'A2',
                iboard_analog_number_3: 'A3',
                iboard_analog_number_4: 'A4',
                iboard_analog_number_5: 'A5',
                iboard_light: 'Light sensor is ',
                iboard_num_pin_1: 'LED status',
                iboard_num_pin_2: 'switch',
                iboard_num_pin_3: 'analogue',
                iboard_num_pin_4: ' ',
                iboard_num_pin_5: 'sensor value',
                iboard_string_1: 'on',
                iboard_string_2: 'off',
                iboard_string_3: 'bright',
                iboard_string_4: 'dark',
                iboard_string_5: 'pressed',
                iboard_string_6: 'opened',
                iboard_switch: 'switch ',
                iboard_tilt: 'Slope sensor status is',
            },
            Device: {
                iboard: 'iboard',
            },
            Menus: {
                iboard: 'iboard',
            },
        },
    };
};

Entry.iboard.getBlocks = function() {
    return {
        //region iboard 아이보드
        iboard_analog_list: {
            parent: 'arduino_ext_analog_list',
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
                        ['A6', '6'],
                        ['A7', '7'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
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
                                    ['A6', '6'],
                                    ['A7', '7'],
                                ],
                                value: '0',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringKey,
                                codeMap: 'Entry.CodeMap.Arduino.iboard_analog_list[0]',
                            },
                        ],
                        keyOption: 'iboard_analog_list',
                    },
                ],
            },
        },
        iboard_temp_sensor_get_value: {
            parent: 'arduino_ext_analog_list',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['A0', '0'],
                        ['A1', '1'],
                    ],
                    value: '1',
                    fontSize: 11,
                },
            ],
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
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringKey,
                                codeMap: 'Entry.CodeMap.Arduino.iboard_temp_sensor_get_value[0]',
                            },
                        ],
                        keyOption: 'iboard_temp_sensor_get_value',
                    },
                ],
            },
        },
        iboard_cds_sensor_get_value: {
            parent: 'arduino_ext_analog_list',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['A2', '2'],
                        ['A3', '3'],
                    ],
                    value: '2',
                    fontSize: 11,
                },
            ],
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
                                    ['A2', '2'],
                                    ['A3', '3'],
                                ],
                                value: '2',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringKey,
                                codeMap: 'Entry.CodeMap.Arduino.iboard_cds_sensor_get_value[0]',
                            },
                        ],
                        keyOption: 'iboard_cds_sensor_get_value',
                    },
                ],
            },
        },
        iboard_mic_get_value: {
            parent: 'arduino_ext_analog_list',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['A3', '3'],
                        ['A4', '4'],
                    ],
                    value: '3',
                    fontSize: 11,
                },
            ],
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
                                    ['A3', '3'],
                                    ['A4', '4'],
                                ],
                                value: '3',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringKey,
                                codeMap: 'Entry.CodeMap.Arduino.iboard_mic_get_value[0]',
                            },
                        ],
                        keyOption: 'iboard_mic_get_value',
                    },
                ],
            },
        },
        iboard_button_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['D2', '2'],
                        ['D3', '3'],
                        ['D4', '4'],
                    ],
                    value: '2',
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
                return script.getStringField('PORT');
            },
        },
        iboard_pwm_led_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['D5', '5'],
                        ['D6', '6'],
                    ],
                    value: '5',
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
                return script.getStringField('PORT');
            },
        },
        iboard_led_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['D10', '10'],
                        ['D11', '11'],
                    ],
                    value: '10',
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
                return script.getStringField('PORT');
            },
        },
        iboard_rgb_led_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['빨간', '5'],
                        ['초록', '6'],
                        ['파란', '9'],
                    ],
                    value: '5',
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
                return script.getStringField('PORT');
            },
        },
        iboard_motor_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    fontSize: 11,
                },
            ],
            events: {},
            def: {
                params: ['6'],
            },
            paramsKeyMap: {
                PORT: 0,
            },
            func: function(sprite, script) {
                return script.getStringField('PORT');
            },
        },
        iboard_motor_list2: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['정지', '0'],
                        ['미풍', '100'],
                        ['약풍', '170'],
                        ['강풍', '255'],
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
                VALUE: 0,
            },
            func: function(sprite, script) {
                return script.getField('VALUE', script);
            },
        },
        iboard_tmp: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: '현재 섭씨온도',
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
                        type: 'iboard_temp_sensor_get_value',
                    },
                ],
                type: 'iboard_tmp',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'iboard_sensor',
            isNotFor: ['iboard'],
            func: function(sprite, script) {
                var port = script.getValue('PORT', script);
                var ANALOG = Entry.hw.portData.ANALOG;
                if (port[0] === 'A') port = port.substring(1);
                var value1 = ANALOG ? ANALOG[port] || 0 : 0;
                var value2 = 5;
                var value3 = 1024;
                var value4 = 100;
                var value5 = 50;
                var result = ((value1 * value2) / value3) * value4 - value5;
                return result;
            },
        },
        iboard_mic: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: '소리센서 값',
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
                        type: 'iboard_mic_get_value',
                    },
                ],
                type: 'iboard_mic',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'iboard_sensor',
            isNotFor: ['iboard'],
            func: function(sprite, script) {
                var port = script.getValue('PORT', script);
                var ANALOG = Entry.hw.portData.ANALOG;
                if (port[0] === 'A') port = port.substring(1);
                var value = ANALOG ? ANALOG[port] || 0 : 0;
                var value2 = 100;
                var value3 = value - value2;
                var result = Math.abs(value3);
                return result;
            },
        },
        iboard_var_res: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: '가변저항 값',
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
                        type: 'iboard_analog_list',
                    },
                ],
                type: 'iboard_var_res',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'iboard_sensor',
            isNotFor: ['iboard'],
            func: function(sprite, script) {
                var port = script.getValue('PORT', script);
                var ANALOG = Entry.hw.portData.ANALOG;
                if (port[0] === 'A') port = port.substring(1);
                return ANALOG ? ANALOG[port] || 0 : 0;
            },
        },
        iboard_cds: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: '현재밝기',
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
                        type: 'iboard_cds_sensor_get_value',
                    },
                ],
                type: 'iboard_cds',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'iboard_sensor',
            isNotFor: ['iboard'],
            func: function(sprite, script) {
                var port = script.getValue('PORT', script);
                var ANALOG = Entry.hw.portData.ANALOG;
                if (port[0] === 'A') port = port.substring(1);
                return ANALOG ? ANALOG[port] || 0 : 0;
            },
        },
        iboard_motor: {
            template: '모터를 %2 으로 동작하기 %3',
            parent: 'arduino_ext_digital_pwm',
            def: {
                params: [
                    {
                        type: 'iboard_motor_list',
                    },
                    {
                        type: 'iboard_motor_list2',
                    },
                    null,
                ],
                type: 'iboard_motor',
            },
            class: 'iboard',
            isNotFor: ['iboard'],
        },
        iboard_button: {
            template: '%1 버튼을 눌렀는가?',
            parent: 'arduino_ext_get_digital',
            def: {
                params: [
                    {
                        type: 'iboard_button_list',
                    },
                ],
                type: 'iboard_button',
            },
            class: 'iboard_sensor',
            isNotFor: ['iboard'],
        },
        iboard_led: {
            template: 'LED %1 번을 %2 %3',
            parent: 'arduino_ext_toggle_led',
            def: {
                params: [
                    {
                        type: 'iboard_led_list',
                    },
                    {
                        type: 'arduino_get_digital_toggle',
                        params: ['on'],
                    },
                    null,
                ],
                type: 'iboard_led',
            },
            class: 'iboard',
            isNotFor: ['iboard'],
        },
        iboard_rgb_led: {
            template: 'RGB LED의 %1 LED %2 %3',
            parent: 'arduino_ext_toggle_led',
            def: {
                params: [
                    {
                        type: 'iboard_rgb_led_list',
                    },
                    {
                        type: 'arduino_get_digital_toggle',
                        params: ['on'],
                    },
                    null,
                ],
                type: 'iboard_rgb_led',
            },
            class: 'iboard',
            isNotFor: ['iboard'],
        },
        iboard_pwm_led: {
            template: 'LED %1 번의 밝기를 %2 (으)로 정하기 %3',
            parent: 'arduino_ext_digital_pwm',
            def: {
                params: [
                    {
                        type: 'iboard_pwm_led_list',
                    },
                    {
                        type: 'text',
                        params: ['255'],
                    },
                    null,
                ],
                type: 'iboard_pwm_led',
            },
            class: 'iboard',
            isNotFor: ['iboard'],
        },
        iboard_set_tone: {
            template: '버저를 %2 %3 음으로 %4 초 연주하기 %5',
            parent: 'arduino_ext_set_tone',
            def: {
                params: [
                    {
                        type: 'arduino_get_port_number',
                        params: ['5'],
                    },
                    {
                        type: 'arduino_ext_tone_list',
                    },
                    {
                        type: 'arduino_ext_octave_list',
                    },
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'iboard_set_tone',
            },
            class: 'iboard',
            isNotFor: ['iboard'],
        },
        iboard_get_digital: {
            template: '디지털 %1 번 센서값  ',
            parent: 'arduino_ext_get_digital',
            def: {
                params: [
                    {
                        type: 'arduino_get_port_number',
                    },
                ],
                type: 'iboard_get_digital',
            },
            class: 'arduino_ori',
            isNotFor: ['iboard'],
        },
        iboard_get_analog_value: {
            parent: 'arduino_ext_get_analog_value',
            template: '아날로그 %1 번 센서값  ',
            def: {
                params: [
                    {
                        type: 'iboard_analog_list',
                    },
                ],
                type: 'iboard_get_analog_value',
            },
            class: 'arduino_ori',
            isNotFor: ['iboard'],
        },
        iboard_get_analog_value_map: {
            parent: 'arduino_ext_get_analog_value_map',
            template: '%1 값의 범위를 %2 ~ %3 에서 %4 ~ %5 (으)로 바꾼값  ',
            def: {
                params: [
                    {
                        type: 'iboard_get_analog_value',
                        params: [
                            {
                                type: 'iboard_analog_list',
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
                        params: ['255'],
                    },
                ],
                type: 'iboard_get_analog_value_map',
            },
            class: 'arduino_ori',
            isNotFor: ['iboard'],
        },
        iboard_toggle_led: {
            template: '디지털 %1 번 핀 %2 %3',
            parent: 'arduino_ext_toggle_led',
            def: {
                params: [
                    {
                        type: 'arduino_get_port_number',
                    },
                    {
                        type: 'arduino_get_digital_toggle',
                        params: ['on'],
                    },
                    null,
                ],
                type: 'iboard_toggle_led',
            },
            class: 'arduino_ori',
            isNotFor: ['iboard'],
        },
        iboard_digital_pwm: {
            template: '디지털 %1 번 핀을 %2 (으)로 정하기 %3',
            parent: 'arduino_ext_digital_pwm',
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
                type: 'iboard_digital_pwm',
            },
            class: 'arduino_ori',
            isNotFor: ['iboard'],
        },
        //endregion iboard 아이보드
    };
};

module.exports = Entry.iboard;
