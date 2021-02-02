'use strict';

Entry.ArduinoCake = {
    id: ['40.1'],
    name: 'ArduinoCake',
    url: 'http://www.arduino.cc/',
    imageName: 'ArduinoCake.png',
    title: {
        ko: '아두이노 케이크',
        en: 'Arduino Cake',
    },
    setZero() {
        if (!Entry.hw.sendQueue.SET) {
            Entry.hw.sendQueue = {
                GET: {},
                SET: {},
            };
        } else {
            // const keySet = Object.keys(Entry.hw.sendQueue.SET);
            // keySet.forEach((key) => {
            //     Entry.hw.sendQueue.SET[key].data = 0;
            //     Entry.hw.sendQueue.SET[key].time = new Date().getTime();
            // });
            for (var port = 0; port < 14; port++) {
                Entry.hw.sendQueue[port] = 0;
            }
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

Entry.ArduinoCake.setLanguage = function() {
    return {
        ko: {
            template: {
                arduino_cake_get_analog_value: '아날로그 %1 번 센서값',
                arduino_cake_get_analog_value_map: '%1 의 범위를 %2 ~ %3 에서 %4 ~ %5 로 바꾼값',
                arduino_cake_get_ultrasonic_value: '울트라소닉 Trig %1 Echo %2 센서값',
                arduino_cake_toggle_led: '디지털 %1 번 핀 %2 %3',
                arduino_cake_digital_pwm: '디지털 %1 번 핀을 %2 (으)로 정하기 %3',
                arduino_cake_set_tone: '디지털 %1 번 핀의 버저를 %2 %3 음으로 %4 초 연주하기 %5',
                arduino_cake_set_servo: '디지털 %1 번 핀의 서보모터를 %2 의 각도로 정하기 %3',
                arduino_cake_get_digital: '디지털 %1 번 센서값',
            },
        },
        en: {
            template: {
                arduino_cake_get_analog_value: 'Analog %1 Sensor value',
                arduino_cake_get_analog_value_map: 'Map Value %1 %2 ~ %3 to %4 ~ %5',
                arduino_cake_get_ultrasonic_value: 'Read ultrasonic sensor trig pin %1 echo pin %2',
                arduino_cake_toggle_led: 'Digital %1 Pin %2 %3',
                arduino_cake_digital_pwm: 'Digital %1 Pin %2 %3',
                arduino_cake_set_tone: 'Play tone pin %1 on note %2 octave %3 beat %4 %5',
                arduino_cake_set_servo: 'Set servo pin %1 angle as %2 %3',
                arduino_cake_get_digital: 'Digital %1 Sensor value',
            },
        },
    };
};

Entry.ArduinoCake.blockMenuBlocks = [
    'arduino_cake_get_analog_value',
    'arduino_cake_get_analog_value_map',
    'arduino_cake_get_ultrasonic_value',
    'arduino_cake_get_digital',
    'arduino_cake_toggle_led',
    'arduino_cake_digital_pwm',
    'arduino_cake_set_servo',
    'arduino_cake_set_tone',
];

Entry.ArduinoCake.getBlocks = function() {
    return {
        //region arduinoCake 아두이노 나노
        arduino_cake_analog_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['pinA1', '2'],
                        ['pinA2', '3'],
                        ['pinA3', '6'],
                        ['pinA4', '7'],
                        ['pinB1', '0'],
                        ['pinB2', '1'],
                        ['pinSD', '4'],
                        ['pinSC', '5'],
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
            func(sprite, script) {
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
                                    ['pinA1', '2'],
                                    ['pinA2', '3'],
                                    ['pinA3', '6'],
                                    ['pinA4', '7'],
                                    ['pinB1', '0'],
                                    ['pinB2', '1'],
                                    ['pinSD', '4'],
                                    ['pinSC', '5'],
                                ],
                                value: '2',
                                fontSize: 11,
                                converter: Entry.block.converters.returnStringKey,
                                codeMap: 'Entry.CodeMap.Arduino.arduino_cake_analog_list[0]',
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'arduino_cake_analog_list',
                    },
                ],
            },
        },

        arduino_cake_digital_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['pinBD', '10'],
                        ['pinA1', '16'],
                        ['pinA2', '17'],
                        ['pinB1', '14'],
                        ['pinB2', '15'],
                        ['pinB3', '2'],
                        ['pinB4', '9'],
                        ['pinC1', '3'],
                        ['pinC2', '12'],
                        ['pinC3', '11'],
                        ['pinC4', '13'],
                        ['pinC5', '5'],
                        ['pinC6', '4'],
                        ['pinC7', '6'],
                        ['pinC8', '7'],
                        ['pinSD', '18'],
                        ['pinSC', '19'],
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
                                    ['pinBD', '10'],
                                    ['pinA1', '16'],
                                    ['pinA2', '17'],
                                    ['pinB1', '14'],
                                    ['pinB2', '15'],
                                    ['pinB3', '2'],
                                    ['pinB4', '9'],
                                    ['pinC1', '3'],
                                    ['pinC2', '12'],
                                    ['pinC3', '11'],
                                    ['pinC4', '13'],
                                    ['pinC5', '5'],
                                    ['pinC6', '4'],
                                    ['pinC7', '6'],
                                    ['pinC8', '7'],
                                    ['pinSD', '18'],
                                    ['pinSC', '19'],
                                ],
                                value: '3',
                                fontSize: 11,
                                converter: Entry.block.converters.returnStringKey,
                                codeMap: 'Entry.CodeMap.Arduino.arduino_cake_digital_list[0]',
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'arduino_cake_digital_list',
                    },
                ],
            },
        },

        arduino_cake_pwm_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['pinBD', '10'],
                        ['pinB4', '9'],
                        ['pinC1', '3'],
                        ['pinC3', '11'],
                        ['pinC5', '5'],
                        ['pinC6', '4'],
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
            func(sprite, script) {
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
                                    ['pinBD', '10'],
                                    ['pinB4', '9'],
                                    ['pinC1', '3'],
                                    ['pinC3', '11'],
                                    ['pinC5', '5'],
                                    ['pinC6', '4'],
                                ],
                                value: '10',
                                fontSize: 11,
                                converter: Entry.block.converters.returnStringKey,
                                codeMap: 'Entry.CodeMap.Arduino.arduino_cake_pwm_list[0]',
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'arduino_cake_pwm_list',
                    },
                ],
            },
        },

        arduino_cake_buz_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [['pinBD', '8']],
                    value: '8',
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
                                options: [['pinBD', '8']],
                                value: '8',
                                fontSize: 11,
                                converter: Entry.block.converters.returnStringKey,
                                codeMap: 'Entry.CodeMap.Arduino.arduino_cake_pwm_list[0]',
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'arduino_cake_buz_list',
                    },
                ],
            },
        },

        arduino_cake_get_analog_value: {
            parent: 'arduino_ext_get_analog_value',
            template: Lang.template.arduino_ext_get_analog_value,
            def: {
                params: [
                    {
                        type: 'arduino_cake_analog_list',
                    },
                ],
                type: 'arduino_cake_get_analog_value',
            },
            isNotFor: ['ArduinoCake'],
            syntax: undefined,
        },
        arduino_cake_get_analog_value_map: {
            parent: 'arduino_ext_get_analog_value_map',
            template: Lang.template.arduino_ext_get_analog_value_map,
            def: {
                params: [
                    {
                        type: 'arduino_cake_get_analog_value',
                        params: [
                            {
                                type: 'arduino_cake_analog_list',
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
                type: 'arduino_cake_get_analog_value_map',
            },
            isNotFor: ['ArduinoCake'],
            syntax: undefined,
        },
        arduino_cake_get_ultrasonic_value: {
            template: Lang.template.arduino_ext_get_ultrasonic_value,
            parent: 'arduino_ext_get_ultrasonic_value',
            def: {
                params: [
                    {
                        type: 'arduino_cake_digital_list',
                        params: ['16'],
                    },
                    {
                        type: 'arduino_cake_digital_list',
                        params: ['17'],
                    },
                ],
                type: 'arduino_cake_get_ultrasonic_value',
            },
            isNotFor: ['ArduinoCake'],
            syntax: undefined,
        },
        arduino_cake_get_digital: {
            template: Lang.template.arduino_ext_get_digital,
            parent: 'arduino_ext_get_digital',
            def: {
                params: [
                    {
                        type: 'arduino_cake_digital_list',
                    },
                ],
                type: 'arduino_cake_get_digital',
            },
            isNotFor: ['ArduinoCake'],
            syntax: undefined,
        },
        arduino_cake_toggle_led: {
            template: Lang.template.arduino_ext_toggle_led,
            parent: 'arduino_ext_toggle_led',
            def: {
                params: [
                    {
                        type: 'arduino_cake_digital_list',
                    },
                    {
                        type: 'arduino_get_digital_toggle',
                        params: ['on'],
                    },
                    null,
                ],
                type: 'arduino_cake_toggle_led',
            },
            isNotFor: ['ArduinoCake'],
            syntax: undefined,
        },
        arduino_cake_digital_pwm: {
            template: Lang.template.arduino_ext_digital_pwm,
            parent: 'arduino_ext_digital_pwm',
            def: {
                params: [
                    {
                        type: 'arduino_cake_pwm_list',
                    },
                    {
                        type: 'text',
                        params: ['255'],
                    },
                    null,
                ],
                type: 'arduino_cake_digital_pwm',
            },
            isNotFor: ['ArduinoCake'],
            syntax: undefined,
        },
        arduino_cake_set_tone: {
            template: Lang.template.arduino_ext_set_tone,
            parent: 'arduino_ext_set_tone',
            def: {
                params: [
                    {
                        type: 'arduino_cake_buz_list',
                        params: ['8'],
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
                type: 'arduino_cake_set_tone',
            },
            isNotFor: ['ArduinoCake'],
            syntax: undefined,
        },
        arduino_cake_set_servo: {
            template: Lang.template.arduino_ext_set_servo,
            parent: 'arduino_ext_set_servo',
            def: {
                params: [
                    {
                        type: 'arduino_cake_digital_list',
                        params: ['9'],
                    },
                    null,
                ],
                type: 'arduino_cake_set_servo',
            },
            isNotFor: ['ArduinoCake'],
            syntax: undefined,
        },
        //endregion arduinoCake 아두이노 케이크
    };
};

module.exports = Entry.ArduinoCake;
