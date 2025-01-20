'use strict';

Entry.makermate = {
    id: '5B.1',
    name: 'makermate',
    url: 'https://makermate.kr/store',
    imageName: 'makermate.png',
    title: {
        ko: '휴몬랩 메이커메이트',
        en: 'makermate',
    },
    setZero() {
        if (!Entry.hw.sendQueue.SET) {
            Entry.hw.sendQueue = {
                GET: {},
                SET: {},
            };
        } else {
            const keySet = Object.keys(Entry.hw.sendQueue.SET);
            keySet.forEach((key) => {
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

Entry.makermate.setLanguage = function() {
    return {
        ko: {
            template: {
                makermate_toggle_on: '켜기',
                makermate_toggle_off: '끄기',

                // values
                makermate_get_digital_bool: '디지털 %1 번 센서값',
                makermate_get_digital_string: '디지털 %1 번 센서 값',
                makermate_get_analog: '아날로그 %1 번 센서 값',
                makermate_sonar_read: '초음파 Trig %1 Echo %2 센서 값', // sonar sensor
                makermate_light_read: '빛감지센서 %1 값',
                makermate_map_value: '%1 값을 %2 ~ %3 범위에서 %4 ~ %5 범위로 변환',
                makermate_touch_read: '터치센서 %1 를 터치했는가?',

                // default blocks
                makermate_set_digital: '디지털 %1 핀 %2 %3',

                // rgb led
                makermate_rgbled_set_color:
                    'R %4 + G %5 + B %6 색으로 RGB LED 켜기 (R %1 핀, G %2 핀, B %3 핀) %7',

                makermate_rgbled_off: 'RGB LED 끄기 (R %1 핀, G %2 핀, B %3 핀) %4',

                // buzzer
                makermate_buzzer_on: '%1 핀 부저를 %3 옥타브 %2 음으로 %4 초 연주 %5',

                // servo
                makermate_servo_set: '%1 핀 서보모터를 %2 각도로 움직이기 %3',
            },
        },
        en: {
            template: {
                makermate_toggle_on: 'on',
                makermate_toggle_off: 'off',

                // values
                makermate_get_digital_bool: 'Digital %1 Sensor value',
                makermate_get_digital_string: 'Digital %1 Sensor value',
                makermate_get_analog: 'Analog %1 Sensor value',
                makermate_touch_read: 'Touch Sensor %1 value',
                makermate_sonar_read: 'Ultrasonic Trig %1 Echo %2 pin Sensor value',
                makermate_light_read: 'Light Sensor %1 value',

                makermate_map_value: 'Map %1 value from %2 ~ %3 range to %4 ~ %5 range',

                // default blocks
                makermate_set_digital: 'Digital %1 Pin %2 %3',

                // rgbled
                makermate_rgbled_set_color:
                    'Turn on RGB LED (R Pin: %1 , G Pin: %2 , B Pin: %3 ) with values R %4, G %5, B %6 %7',
                makermate_rgbled_off: 'Turn off RGB LED (R %1 핀, G %2 핀, B %3 핀) %4',

                // buzzer
                makermate_buzzer_on: 'Play buzzer pin %1 on note %2 octave %3 beat %4 %5',

                // servo
                makermate_servo_set: 'Set servo pin %1 angle as %2 %3',
            },
        },
    };
};

Entry.makermate.blockMenuBlocks = [
    // get values
    'makermate_get_digital_bool', // 디지털 0번 센서값 읽기 (boolean)
    'makermate_get_digital_string', // 디지털 0번 센서 값 읽기 (string)
    'makermate_get_analog', // 아날로그 0번 센서 값 읽기 (string)
    'makermate_sonar_read', // 초음파센서 값 읽기
    'makermate_touch_read', // 터치센서 값 읽기
    'makermate_light_read', // 빛감지센서 값 읽기
    'makermate_map_value', // 값 매핑

    // default
    'makermate_set_digital', // 디지털 0번 핀 켜기/끄기

    // rgb led
    'makermate_rgbled_set_color', // rgb led 켜기/끄기
    'makermate_rgbled_off',

    // buzzer
    'makermate_buzzer_on', // 부저를 0음 0옥타브로 0초 연주

    // servo
    'makermate_servo_set', // 서보모터 각도 지정
];

Entry.makermate.getBlocks = function() {
    return {
        makermate_list_digital_pin: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
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
                    value: '13',
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

        makermate_list_digital_pwm: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
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
                    value: '9',
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

        makermate_list_digital_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.makermate_toggle_on, 'on'],
                        [Lang.template.makermate_toggle_off, 'off'],
                    ],
                    value: 'on',
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
            func: function(sprite, script) {
                return script.getStringField('OPERATOR');
            },
        },

        makermate_list_analog_pin: {
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
            func(sprite, script) {
                return script.getField('PORT');
            },
        },

        makermate_list_tone: {
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
        },

        makermate_list_octave: {
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
                        ['7', '7'],
                        ['8', '8'],
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
        },

        /** GET VALUES */
        makermate_get_digital_bool: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            template: Lang.template.makermate_get_digital_bool,
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
                        type: 'makermate_list_digital_pin',
                        params: [5],
                    },
                ],
                type: 'makermate_get_digital_bool',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'makermateValues',
            isNotFor: ['makermate'],
            func: function(sprite, script) {
                const port = script.getNumberValue('PORT', script);
                const DIGITAL = Entry.hw.portData.DIGITAL;
                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                Entry.hw.sendQueue.GET[Entry.makermate.sensorTypes.DIGITAL] = {
                    port,
                    time: new Date().getTime(),
                };
                return DIGITAL ? DIGITAL[port] || 0 : 0;
            },
        },

        makermate_get_digital_string: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: Lang.template.makermate_get_digital_bool,
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
                        type: 'makermate_list_digital_pin',
                        params: [5],
                    },
                ],
                type: 'makermate_get_digital_string',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'makermateValues',
            isNotFor: ['makermate'],
            func: function(sprite, script) {
                const port = script.getNumberValue('PORT', script);
                const DIGITAL = Entry.hw.portData.DIGITAL;
                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                Entry.hw.sendQueue.GET[Entry.makermate.sensorTypes.DIGITAL] = {
                    port,
                    time: new Date().getTime(),
                };
                return DIGITAL ? DIGITAL[port] || 0 : 0;
            },
        },

        makermate_get_analog: {
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
                        type: 'makermate_list_analog_pin',
                    },
                ],
                type: 'makermate_get_analog',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'makermateValues',
            isNotFor: ['makermate'],
            func: function(sprite, script) {
                let port = script.getValue('PORT', script);
                const ANALOG = Entry.hw.portData.ANALOG;
                if (port[0] === 'A') {
                    port = port.substring(1);
                }
                return ANALOG ? ANALOG[port] || 0 : 0;
            },
        },

        makermate_touch_read: {
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
                        type: 'makermate_list_digital_pin',
                        params: [5],
                    },
                ],
                type: 'makermate_touch_read',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'makermateValues',
            isNotFor: ['makermate'],
            func: function(sprite, script) {
                const port = script.getNumberValue('PORT', script);
                const DIGITAL = Entry.hw.portData.DIGITAL;
                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                Entry.hw.sendQueue.GET[Entry.makermate.sensorTypes.DIGITAL] = {
                    port,
                    time: new Date().getTime(),
                };
                return DIGITAL ? DIGITAL[port] || 0 : 0;
            },
        },

        makermate_light_read: {
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
                        type: 'makermate_list_analog_pin',
                    },
                ],
                type: 'makermate_light_read',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'makermateValues',
            isNotFor: ['makermate'],
            func: function(sprite, script) {
                let port = script.getValue('PORT', script);
                const ANALOG = Entry.hw.portData.ANALOG;
                if (port[0] === 'A') {
                    port = port.substring(1);
                }
                return ANALOG ? ANALOG[port] || 0 : 0;
            },
        },

        makermate_sonar_read: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: Lang.template.makermate_sonar_read,
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'makermate_list_digital_pin',
                        params: ['5'],
                    },
                    {
                        type: 'makermate_list_digital_pin',
                        params: ['6'],
                    },
                ],
                type: 'makermate_sonar_read',
            },
            paramsKeyMap: {
                PORT1: 0,
                PORT2: 1,
            },
            class: 'makermateValues',
            isNotFor: ['makermate'],
            func(sprite, script) {
                const port1 = script.getNumberValue('PORT1', script);
                const port2 = script.getNumberValue('PORT2', script);

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                delete Entry.hw.sendQueue.SET[port1];
                delete Entry.hw.sendQueue.SET[port2];

                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                Entry.hw.sendQueue.GET[Entry.makermate.sensorTypes.ULTRASONIC] = {
                    port: [port1, port2],
                    time: new Date().getTime(),
                };
                return Entry.hw.portData.ULTRASONIC || 0;
            },
        },

        makermate_map_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
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
            events: {},
            def: {
                params: [
                    {
                        type: 'number',
                        params: ['0'],
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
                        params: ['180'],
                    },
                ],
                type: 'makermate_map_value',
            },
            paramsKeyMap: {
                NUM: 0,
                VALUE2: 1,
                VALUE3: 2,
                VALUE4: 3,
                VALUE5: 4,
            },
            class: 'makermateValues',
            isNotFor: ['makermate'],
            func: function(sprite, script) {
                var num = script.getNumberValue('NUM', script);
                var flag = 0;

                var value2 = script.getNumberValue('VALUE2', script);
                var value3 = script.getNumberValue('VALUE3', script);
                var value4 = script.getNumberValue('VALUE4', script);
                var value5 = script.getNumberValue('VALUE5', script);

                var value4_1 = value4;
                var value5_1 = value5;

                if (value2 > value3) {
                    var swap = value2;
                    value2 = value3;
                    value3 = swap;
                }

                if (value4 > value5) {
                    flag = 1;
                    var swap = value4;
                    value4_1 = value5;
                    value5_1 = swap;
                }

                num -= value2;
                num = num * ((value5_1 - value4_1) / (value3 - value2));

                if (flag == 1) {
                    num = value4 - num;
                    num = Math.min(value4, num);
                    num = Math.max(value5, num);
                } else {
                    num = num + value4;
                    num = Math.min(value5, num);
                    num = Math.max(value4, num);
                }

                return parseInt(num);
            },
        },

        /** SET VALUES */
        // Default Blocks
        makermate_set_digital: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
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
                        type: 'makermate_list_digital_pin',
                        params: [13],
                    },
                    {
                        type: 'makermate_list_digital_value',
                        params: ['on'],
                    },
                    null,
                ],
                type: 'makermate_set_digital',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'makermateValues',
            isNotFor: ['makermate'],
            func(sprite, script) {
                const port = script.getNumberValue('PORT');
                let value = script.getValue('VALUE');

                if (typeof value === 'string') {
                    value = value.toLowerCase();
                }
                if (Entry.makermate.highList.indexOf(value) > -1) {
                    value = 255;
                } else if (Entry.makermate.lowList.indexOf(value) > -1) {
                    value = 0;
                } else {
                    throw new Error();
                }
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[port] = {
                    type: Entry.makermate.sensorTypes.DIGITAL,
                    data: value,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
        },

        // RGB LED
        makermate_rgbled_set_color: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
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
                        type: 'makermate_list_digital_pwm',
                        params: ['9'],
                    },
                    {
                        type: 'makermate_list_digital_pwm',
                        params: ['10'],
                    },
                    {
                        type: 'makermate_list_digital_pwm',
                        params: ['11'],
                    },
                    {
                        type: 'text',
                        params: ['255'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'makermate_rgbled_set_color',
            },
            paramsKeyMap: {
                PORT1: 0,
                PORT2: 1,
                PORT3: 2,
                VALUE1: 3,
                VALUE2: 4,
                VALUE3: 5,
            },
            class: 'makermateRgbled',
            isNotFor: ['makermate'],
            func: function(sprite, script) {
                var port1 = script.getNumberValue('PORT1', script);
                var port2 = script.getNumberValue('PORT2', script);
                var port3 = script.getNumberValue('PORT3', script);
                var value1 = script.getNumberValue('VALUE1', script);
                var value2 = script.getNumberValue('VALUE2', script);
                var value3 = script.getNumberValue('VALUE3', script);

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port1] = {
                    type: Entry.makermate.sensorTypes.PWM,
                    data: value1,
                    time: new Date().getTime(),
                };
                Entry.hw.sendQueue['SET'][port2] = {
                    type: Entry.makermate.sensorTypes.PWM,
                    data: value2,
                    time: new Date().getTime(),
                };
                Entry.hw.sendQueue['SET'][port3] = {
                    type: Entry.makermate.sensorTypes.PWM,
                    data: value3,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
        },

        makermate_rgbled_off: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
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
                        type: 'makermate_list_digital_pwm',
                        params: ['9'],
                    },
                    {
                        type: 'makermate_list_digital_pwm',
                        params: ['10'],
                    },
                    {
                        type: 'makermate_list_digital_pwm',
                        params: ['11'],
                    },
                    null,
                ],
                type: 'makermate_rgbled_off',
            },
            paramsKeyMap: {
                PORT1: 0,
                PORT2: 1,
                PORT3: 2,
            },
            class: 'makermateRgbled',
            isNotFor: ['makermate'],
            func: function(sprite, script) {
                var port1 = script.getNumberValue('PORT1', script);
                var port2 = script.getNumberValue('PORT2', script);
                var port3 = script.getNumberValue('PORT3', script);

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port1] = {
                    type: Entry.makermate.sensorTypes.PWM,
                    data: 0,
                    time: new Date().getTime(),
                };
                Entry.hw.sendQueue['SET'][port2] = {
                    type: Entry.makermate.sensorTypes.PWM,
                    data: 0,
                    time: new Date().getTime(),
                };
                Entry.hw.sendQueue['SET'][port3] = {
                    type: Entry.makermate.sensorTypes.PWM,
                    data: 0,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
        },

        // Buzzer
        makermate_buzzer_on: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.makermate_buzzer_on,
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
                        type: 'makermate_list_digital_pin',
                        params: [13],
                    },
                    {
                        type: 'makermate_list_tone',
                    },
                    {
                        type: 'makermate_list_octave',
                    },
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'makermate_buzzer_on',
            },
            paramsKeyMap: {
                PORT: 0,
                NOTE: 1,
                OCTAVE: 2,
                DURATION: 3,
            },
            class: 'makermateBuzzer',
            isNotFor: ['makermate'],
            func: function(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = script.getNumberValue('PORT', script);

                if (!script.isStart) {
                    let note = script.getValue('NOTE', script);
                    if (!Entry.Utils.isNumber(note)) {
                        note = Entry.makermate.toneTable[note];
                    }

                    if (note < 0) {
                        note = 0;
                    } else if (note > 12) {
                        note = 12;
                    }

                    let duration = script.getNumberValue('DURATION', script);

                    if (duration < 0) {
                        duration = 0;
                    }

                    if (!sq.SET) {
                        sq.SET = {};
                    }

                    if (duration === 0) {
                        sq.SET[port] = {
                            type: Entry.makermate.sensorTypes.TONE,
                            data: 0,
                            time: new Date().getTime(),
                        };
                        return script.callReturn();
                    }

                    let octave = script.getNumberValue('OCTAVE', script) - 1;
                    if (octave < 0) {
                        octave = 0;
                    } else if (octave > 8) {
                        octave = 8;
                    }

                    let value = 0;

                    if (note != 0) {
                        value = Entry.makermate.toneMap[note][octave];
                    }

                    duration = duration * 1000;
                    script.isStart = true;
                    script.timeFlag = 1;

                    sq.SET[port] = {
                        type: Entry.makermate.sensorTypes.TONE,
                        data: {
                            value,
                            duration,
                        },
                        time: new Date().getTime(),
                    };

                    setTimeout(() => {
                        script.timeFlag = 0;
                    }, duration + 32);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    sq.SET[port] = {
                        type: Entry.makermate.sensorTypes.TONE,
                        data: 0,
                        time: new Date().getTime(),
                    };
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
        },

        // Servo
        makermate_servo_set: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            template: Lang.template.makermate_servo_set,
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
                        type: 'makermate_list_digital_pin',
                        params: ['7'],
                    },
                    {
                        type: 'text',
                        params: ['180'],
                    },
                    null,
                ],
                type: 'makermate_servo_set',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'makermateServo',
            isNotFor: ['makermate'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = script.getNumberValue('PORT', script);
                let value = script.getNumberValue('VALUE', script);
                value = Math.min(180, value);
                value = Math.max(0, value);

                if (!sq.SET) {
                    sq.SET = {};
                }

                sq.SET[port] = {
                    type: Entry.makermate.sensorTypes.SERVO_PIN,
                    data: value,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
        },
    };
};

module.exports = Entry.makermate;
