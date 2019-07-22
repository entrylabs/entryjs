'use strict';

Entry.Mechatronics_4D = {
    id: '1A.1',
    name: 'Mechatronics_4D',
    url: 'http://4dblock.com/',
    imageName: 'mechatronics_4d.png',
    title: {
        'ko': '4D 메카트로닉스',
        'en': '4D Mechatronics'
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
    highList: ['high', '1', 'on', 'left', 'clock', 'front'],
    lowList: ['low', '0', 'off', 'right', 'counter_clock', 'rear'],
    BlockState: {},
};

Entry.Mechatronics_4D.blockMenuBlocks = [ //작성할 블록의 이름을 이곳에 추가합니다.
    'Mechatronics_4D_get_analog_value',
    'Mechatronics_4D_get_analog_value_map',
    'Mechatronics_4D_get_ultrasonic_value',
    'Mechatronics_4D_get_digital',
    "Mechatronics_4D_toggle_led",
    "Mechatronics_4D_digital_pwm",
    "Mechatronics_4D_set_tone",
    "Mechatronics_4D_get_digital",
    "Mechatronics_4D_on_motor",
    "Mechatronics_4D_controll_motor_speed1",
    "Mechatronics_4D_controll_motor_speed2",
    "Mechatronics_4D_off_motor",
    "Mechatronics_4D_set_servo",
];

Entry.Mechatronics_4D.setLanguage = () => { //블록 언어 템플릿
    return {
        ko: {
            template: {
                Mechatronics_4D_get_analog_value: '아날로그 %1 번 센서값',
                Mechatronics_4D_get_analog_value_map: '%1 의 범위를 %2 ~ %3 에서 %4 ~ %5 로 바꾼값',
                Mechatronics_4D_get_ultrasonic_value: '울트라소닉 Trig %1 Echo %2 센서값',
                Mechatronics_4D_get_digital: '디지털 %1 번 센서값',
                Mechatronics_4D_toggle_led: '디지털 %1번 핀 %2 %3',
                Mechatronics_4D_digital_pwm: '디지털 %1번 핀을 %2(으)로 정하기 %3',
                Mechatronics_4D_set_tone: '디지털 %1번 핀의 버저를 %2 %3 음으로 %4초 연주하기 %5',
                Mechatronics_4D_get_digital: '디지털 %1번 센서값',
                Mechatronics_4D_on_motor: '%1 %2 %3 DC모터를 %4으로 움직이기 %5',
                Mechatronics_4D_controll_motor_speed1: '%1 %2 뒤 DC모터를 %3 %4 속도로 움직이기 %5',
                Mechatronics_4D_controll_motor_speed2: '%1 %2 뒤 DC모터를 %3 %4 속도로 움직이기 %5',
                Mechatronics_4D_off_motor: '%1 %2 %3 DC모터를 멈추기 %4',   
                Mechatronics_4D_set_servo: '%1 %2 서보 모터의 각도를 %3(으)로 정하기 %4',
            }
        },
        en: {
            template: {
                Mechatronics_4D_get_analog_value: 'Analog %1 Sensor value',
                Mechatronics_4D_get_analog_value_map: 'Map Value %1 %2 ~ %3 to %4 ~ %5',
                Mechatronics_4D_get_ultrasonic_value: 'Read ultrasonic sensor trig pin %1 echo pin %2',
                Mechatronics_4D_get_digital: 'Digital %1 Sensor value',
                Mechatronics_4D_toggle_led: 'Digital %1 Pin %2 %3',
                Mechatronics_4D_digital_pwm: 'Digital %1 Pin %2 %3',
                Mechatronics_4D_set_tone: 'Play tone pin %1 on note %2 octave %3 beat %4 %5',
                Mechatronics_4D_get_digital: 'Digital %1 Sensor value',
                Mechatronics_4D_on_motor: 'Turn on %1 %2 DC motor %3wise %4',
                Mechatronics_4D_controll_motor_speed1: 'Turn on %1 rear DC motor %2 at the speed of %3 %4',
                Mechatronics_4D_controll_motor_speed2: 'Turn on %1 rear DC motor %2 at the speed of %3 %4',
                Mechatronics_4D_off_motor: 'Turn off %1 $2 DC motor %3',
                Mechatronics_4D_set_servo: 'Set %1 servo motor angle as %2 %3',
            }
        }
    }
}

Entry.Mechatronics_4D.getBlocks = () => {
    return {
        //region Mechatronics_4D 메카트로닉스4D
        Mechatronics_4D_analog_list: {
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
        },

        Mechatronics_4D_get_analog_value: {
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
                        type: 'Mechatronics_4D_analog_list',
                    },
                ],
                type: 'Mechatronics_4D_get_analog_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'Mechatronics_4D_Get',
            isNotFor: ['Mechatronics_4D'],
            func: function(sprite, script) {
                var port = script.getValue('PORT', script);
                var ANALOG = Entry.hw.portData.ANALOG;
                if (port[0] === 'A') port = port.substring(1);
                return ANALOG ? ANALOG[port] || 0 : 0;
            },
        },

        Mechatronics_4D_get_analog_value_map: {
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
                        type: 'Mechatronics_4D_get_analog_value',
                        params: [
                            {
                                type: 'Mechatronics_4D_analog_list',
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
                type: 'Mechatronics_4D_get_analog_value_map',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE2: 1,
                VALUE3: 2,
                VALUE4: 3,
                VALUE5: 4,
            },
            class: 'Mechatronics_4D_Get',
            isNotFor: ['Mechatronics_4D'],
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
                    (Entry.Utils.isNumber(stringValue4) && stringValue4.indexOf('.') > -1) ||
                    (Entry.Utils.isNumber(stringValue5) && stringValue5.indexOf('.') > -1)
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
        },

        Mechatronics_4D_get_ultrasonic_value: {
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
                type: 'Mechatronics_4D_get_ultrasonic_value',
            },
            paramsKeyMap: {
                PORT1: 0,
                PORT2: 1,
            },
            class: 'Mechatronics_4D_Get',
            isNotFor: ['Mechatronics_4D'],
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
                Entry.hw.sendQueue['GET'][Entry.Mechatronics_4D.sensorTypes.ULTRASONIC] = {
                    port: [port1, port2],
                    time: new Date().getTime(),
                };
                return Entry.hw.portData.ULTRASONIC || 0;
            },
        },

        Mechatronics_4D_get_digital: {
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
                type: 'Mechatronics_4D_get_digital',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'Mechatronics_4D_Get',
            isNotFor: ['Mechatronics_4D'],
            func: function(sprite, script) {
                const { hwModule = {} } = Entry.hw;
                const { name } = hwModule;
                if (name === 'Mechatronics_4D') {
                    var port = script.getNumberValue('PORT', script);
                    var DIGITAL = Entry.hw.portData.DIGITAL;
                    if (!Entry.hw.sendQueue['GET']) {
                        Entry.hw.sendQueue['GET'] = {};
                    }
                    Entry.hw.sendQueue['GET'][Entry.Mechatronics_4D.sensorTypes.DIGITAL] = {
                        port: port,
                        time: new Date().getTime(),
                    };
                    return DIGITAL ? DIGITAL[port] || 0 : 0;
                } else {
                    return Entry.block.arduino_get_digital_value.func(sprite, script);
                }
            },
        },

        Mechatronics_4D_toggle_led: {
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
                type: 'Mechatronics_4D_toggle_led',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'Mechatronics_4D',
            isNotFor: ['Mechatronics_4D'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var value = script.getValue('VALUE');

                if (typeof value === 'string') {
                    value = value.toLowerCase();
                }
                if (Entry.Mechatronics_4D.highList.indexOf(value) > -1) {
                    value = 255;
                } else if (Entry.Mechatronics_4D.lowList.indexOf(value) > -1) {
                    value = 0;
                } else {
                    throw new Error();
                }
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.Mechatronics_4D.sensorTypes.DIGITAL,
                    data: value,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
        },

        Mechatronics_4D_digital_pwm: {
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
                type: 'Mechatronics_4D_digital_pwm',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'Mechatronics_4D',
            isNotFor: ['Mechatronics_4D'],
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
                    type: Entry.Mechatronics_4D.sensorTypes.PWM,
                    data: value,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
        },

        Mechatronics_4D_tone_list: {
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

        Mechatronics_4D_tone_value: {
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
                        type: 'Mechatronics_4D_tone_list',
                    },
                ],
                type: 'Mechatronics_4D_tone_value',
            },
            paramsKeyMap: {
                NOTE: 0,
            },
            func: function(sprite, script) {
                return script.getNumberValue('NOTE');
            },
        },

        Mechatronics_4D_set_tone: {
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
                        params: [3],
                    },
                    {
                        type: 'Mechatronics_4D_tone_list',
                    },
                    {
                        type: 'Mechatronics_4D_tone_value',
                    },
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'Mechatronics_4D_set_tone',
            },
            paramsKeyMap: {
                PORT: 0,
                NOTE: 1,
                OCTAVE: 2,
                DURATION: 3,
            },
            class: 'Mechatronics_4D',
            isNotFor: ['Mechatronics_4D'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var port = script.getNumberValue('PORT', script);

                if (!script.isStart) {
                    var note = script.getValue('NOTE', script);
                    if (!Entry.Utils.isNumber(note)) note = Entry.Mechatronics_4D.toneTable[note];

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
                            type: Entry.Mechatronics_4D.sensorTypes.TONE,
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
                        value = Entry.Mechatronics_4D.toneMap[note][octave];
                    }

                    duration = duration * 1000;
                    script.isStart = true;
                    script.timeFlag = 1;

                    sq['SET'][port] = {
                        type: Entry.Mechatronics_4D.sensorTypes.TONE,
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
                        type: Entry.Mechatronics_4D.sensorTypes.TONE,
                        data: 0,
                        time: new Date().getTime(),
                    };
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
        },

        Mechatronics_4D_board_version_list: { //보드 버전 리스트
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statement: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['V3', '3'],
                        ['V4', '4'],
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
                VERSION: 0,
            },
            func: function(sprite, script) {
                return script.getField('VERSION');
            },
        },

        Mechatronics_4D_motor_list: {//왼쪽 모터, 오른쪽 모터 드랍다운 블록
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statement: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.General.left, 'left'],
                        [Lang.General.right, 'right'],
                    ],
                    value: 'left',
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
                MOTOR: 0,
            },
            func: function(sprite, script) {
                return script.getField('MOTOR');
            },
        },

        Mechatronics_4D_motor_side_list: { // 앞쪽 모터, 오른쪽 모터 드랍다운 블록
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statement: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['앞', 'front'],
                        ['뒤', 'rear'],
                    ],
                    value: 'front',
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
                SIDE: 0,
            },
            func: function(sprite, script) {
                return script.getField('SIDE');
            },
        },
        
        Mechatronics_4D_rotation_list: { //시계방향, 반시계방향 드랍다운 블록
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statement: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['정방향', 'clock'],
                        ['역방향', 'counter_clock'],
                    ],
                    value: 'clock',
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
                ROTATION: 0,
            },
            func: function(sprite, script) {
                return script.getField('ROTATION');
            },
        },

        Mechatronics_4D_on_motor: { //모터 작동 블록(속도 조절 불가능)
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            def: {
                params: [
                    {
                        type: 'Mechatronics_4D_board_version_list',
                    },
                    {
                        type: 'Mechatronics_4D_motor_list',
                    },
                    {
                        type: 'Mechatronics_4D_motor_side_list',
                    },
                    {
                        type: 'Mechatronics_4D_rotation_list',
                    },
                ],
                type: 'Mechatronics_4D_on_motor'
            },
            paramsKeyMap: {
                VERSION: 0,
                MOTOR: 1,
                SIDE: 2,
                ROTATION: 3,
            },
            class: 'Mechatronics_4D',
            isNotFor: ['Mechatronics_4D'],
            func: function(sprite, script) {
                //보드의 버전
                var version = script.getNumberValue('VERSION');
                //제어할 DC모터의 방향
                var motor = script.getValue('MOTOR');
                //제어할 DC모터의 위치
                var side = script.getValue('SIDE');
                //DC모터의 회전 방향
                var rotation = script.getValue('ROTATION');
                
                //제어할 DC모터의 핀 번호
                var port1, port2;

                //회전 방향을 제어할 변수
                var value1, value2;


                if(typeof motor === 'string') {
                    motor = motor.toLowerCase();
                }
                
                if(typeof rotation === 'string') {
                    rotation = rotation.toLowerCase();
                }

                switch(version){  //보드의 버전을 구분
                    case 3: //v3
                        if(Entry.Mechatronics_4D.highList.indexOf(motor) > -1) {
                            if(Entry.Mechatronics_4D.highList.indexOf(side) > -1) {
                                //왼쪽 앞단 DC모터를 제어하는 14번핀과 15번핀(A0, A1)
                                port1 = '14';
                                port2 = '15';
                            }
                            else if(Entry.Mechatronics_4D.lowList.indexOf(side) > -1) {
                                //왼쪽 뒷단 DC모터를 제어하는 5번핀과 6번핀
                                port1 = '5';
                                port2 = '6';
                            }
                        }
                        else if(Entry.Mechatronics_4D.lowList.indexOf(motor) > -1) {
                            if(Entry.Mechatronics_4D.highList.indexOf(side) > -1) {
                                //오른쪽 앞단 DC모터를 제어하는 16번 핀과 17번핀(A3, A4)
                                port1 = '17';
                                port2 = '16';
                            }
                                else if(Entry.Mechatronics_4D.lowList.indexOf(side) > -1) {
                                //오른쪽 뒷단 DC모터를 제어하는 9번핀과 10번핀
                                port1 = '10';
                                port2 = '9';
                            }
                        }
                        else {
                            throw new Error();
                        }
                        break;

                    case 4: //v4
                        if(Entry.Mechatronics_4D.highList.indexOf(motor) > -1) {
                            if(Entry.Mechatronics_4D.highList.indexOf(side) > -1) {
                                //왼쪽 앞단 DC모터를 제어하는 16번핀과 17번핀
                                port1 = '16';
                                port2 = '17';
                            }
                            else if(Entry.Mechatronics_4D.lowList.indexOf(side) > -1) {
                                //왼쪽 뒷단 DC모터를 제어하는 9번핀과 10번핀
                                port1 = '9';
                                port2 = '10';                                
                            }
                        }
                        else if(Entry.Mechatronics_4D.lowList.indexOf(motor) > -1) {
                            if(Entry.Mechatronics_4D.highList.indexOf(side) > -1) {
                                //오른쪽 앞단 DC모터를 제어하는 14번핀과 15번핀(A3, A4)
                                port1 = '14';
                                port2 = '15';
                            }
                            else if(Entry.Mechatronics_4D.lowList.indexOf(side) > -1) {
                                //오른쪽 뒷단 DC모터를 제어하는 5번핀과 6번핀
                                port1 = '5';
                                port2 = '6';
                            }
                        }
                        else {
                            throw new Error();
                        }
                        break;
                }
            
                if(Entry.Mechatronics_4D.highList.indexOf(rotation) > -1) {
                    //정방향 회전
                    value1 = 0;
                    value2 = 1;
                }
                else if(Entry.Mechatronics_4D.lowList.indexOf(rotation) > -1) {
                    //역방향 회전
                    value1 = 1;
                    value2 = 0;
                }
                else {
                    throw new Error();
                }
               
                if(!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }

                //각 핀에 데이터 보냄
                Entry.hw.sendQueue['SET'][port1] = {
                    type : Entry.Mechatronics_4D.sensorTypes.DIGITAL,
                    data : value1,
                    time: new Date().getTime(),
                };

                Entry.hw.sendQueue['SET'][port2] = {
                    type : Entry.Mechatronics_4D.sensorTypes.DIGITAL,
                    data : value2,
                    time: new Date().getTime(),
                };
            }
        },

        // 14~17(A0~A3)번 핀은 속도 조절이 불가능함 
        Mechatronics_4D_controll_motor_speed1: { //모터 작동 블록(속도 조절 가능)
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
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
                    defaultType: 'number',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            def: {
                params: [
                    {
                        type: 'Mechatronics_4D_board_version_list',
                    },
                    {
                        type: 'Mechatronics_4D_motor_list',
                    },
                    {
                        type: 'Mechatronics_4D_rotation_list',
                    },
                    {
                        type: 'text',
                        params: ['255'],
                    },
                ],
                type: 'Mechatronics_4D_controll_motor_speed1'
            },
            paramsKeyMap: {
                VERSION: 0,
                MOTOR: 1,
                ROTATION: 2,
                VALUE: 3,
            },
            class: 'Mechatronics_4D',
            isNotFor: ['Mechatronics_4D'],
            func: function(sprite, script) {
                //보드의 버전
                var version = script.getNumberValue('VERSION');
                //제어할 DC모터의 위치
                var motor = script.getValue('MOTOR');
                //DC모터의 회전 방향
                var rotation = script.getValue('ROTATION');
                var value = script.getNumberValue('VALUE');

                value = Math.round(value);
                value = Math.max(value, 0);
                value = Math.min(value, 255);
                
                //제어할 DC모터의 핀 번호
                var port1, port2;

                //회전 방향을 제어할 변수
                var value1, value2;

                if(typeof motor === 'string') {
                    motor = motor.toLowerCase();
                }
                switch(version){ //보드의 버전을 구분
                    case 3: //v3
                        if(Entry.Mechatronics_4D.highList.indexOf(motor) > -1) {
                            //왼쪽 DC모터를 제어하는 5번핀과 6번핀
                            port1 = '5';
                            port2 = '6';
                        }
                        else if(Entry.Mechatronics_4D.lowList.indexOf(motor) > -1) {
                            //오른쪽 DC모터를 제어하는 9번핀과 10번핀
                            port1 = '10';
                            port2 = '9';
                        }
                        else {
                            throw new Error();
                        }
                        break;

                    case 4: //v4
                        if(Entry.Mechatronics_4D.highList.indexOf(motor) > -1) {
                            //왼쪽 DC모터를 제어하는 9번핀과 10번핀
                            port1 = '9';
                            port2 = '10';
                        }
                        else if(Entry.Mechatronics_4D.lowList.indexOf(motor) > -1) {
                            //오른쪽 DC모터를 제어하는 5번핀과 6번핀
                            port1 = '5';
                            port2 = '6';
                        }
                        else {
                            throw new Error();
                        }
                        break;
                }
               

                if(typeof rotation === 'string') {
                    rotation = rotation.toLowerCase();
                }

                if(Entry.Mechatronics_4D.highList.indexOf(rotation) > -1) {
                    //정방향 회전
                    value1 = 0;
                    value2 = value;
                }
                else if(Entry.Mechatronics_4D.lowList.indexOf(rotation) > -1) {
                    //역방향 회전
                    value1 = value;
                    value2 = 0;
                }
                else {
                    throw new Error();
                }

                if(!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }

                //각 핀에 데이터 보냄
                Entry.hw.sendQueue['SET'][port1] = {
                    type : Entry.Mechatronics_4D.sensorTypes.PWM,
                    data : value1,
                    time: new Date().getTime(),
                };

                Entry.hw.sendQueue['SET'][port2] = {
                    type : Entry.Mechatronics_4D.sensorTypes.PWM,
                    data : value2,
                    time: new Date().getTime(),
                };
            }
        },
        
        Mechatronics_4D_motor_speed_list: { //시계방향, 반시계방향 드랍다운 블록
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statement: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['아주 느린', '60'],
                        ['느린', '100'],
                        ['보통', '140'],
                        ['빠른', '180'],
                        ['아주 빠른', '255'],
                    ],
                    value: '140',
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
                SPEED: 0,
            },
            func: function(sprite, script) {
                return script.getField('SPEED');
            },
        },

        Mechatronics_4D_controll_motor_speed2: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            def: {
                params: [
                    {
                        type: 'Mechatronics_4D_board_version_list',
                    },
                    {
                        type: 'Mechatronics_4D_motor_list',
                    },
                    {
                        type: 'Mechatronics_4D_rotation_list',
                    },
                    {
                        type: 'Mechatronics_4D_motor_speed_list',
                    },
                ],
                type: 'Mechatronics_4D_controll_motor_speed2'
            },
            paramsKeyMap: {
                VERSION: 0,
                MOTOR: 1,
                ROTATION: 2,
                SPEED: 3,
            },
            class: 'Mechatronics_4D',
            isNotFor: ['Mechatronics_4D'],
            func: function(sprite, script) {
                //보드의 버전
                var version = script.getNumberValue('VERSION');
                //제어할 DC모터의 위치
                var motor = script.getValue('MOTOR');
                //DC모터의 회전 방향
                var rotation = script.getValue('ROTATION');
                var speed = script.getNumberValue('SPEED');
                
                //제어할 DC모터의 핀 번호
                var port1, port2;

                //회전 방향을 제어할 변수
                var value1, value2;

                if(typeof motor === 'string') {
                    motor = motor.toLowerCase();
                }
                
                switch(version){
                    case 3: //v3
                        if(Entry.Mechatronics_4D.highList.indexOf(motor) > -1) {
                            //왼쪽 DC모터를 제어하는 5번핀과 6번핀
                            port1 = '5';
                            port2 = '6';
                        }
                        else if(Entry.Mechatronics_4D.lowList.indexOf(motor) > -1) {
                            //오른쪽 DC모터를 제어하는 9번핀과 10번핀
                            port1 = '10';
                            port2 = '9';
                        }
                        else {
                            throw new Error();
                        }
                        break;

                    case 4: //v4
                        if(Entry.Mechatronics_4D.highList.indexOf(motor) > -1) {
                            //왼쪽 DC모터를 제어하는 9번핀과 10번핀
                            port1 = '9';
                            port2 = '10';
                        }
                        else if(Entry.Mechatronics_4D.lowList.indexOf(motor) > -1) {
                            //오른쪽 DC모터를 제어하는 5번핀과 6번핀
                            port1 = '5';
                            port2 = '6';
                        }
                        else {
                            throw new Error();
                        }
                        break;
                }

                if(typeof rotation === 'string') {
                    rotation = rotation.toLowerCase();
                }

                if(Entry.Mechatronics_4D.highList.indexOf(rotation) > -1) {
                    //정방향 회전
                    value1 = 0;
                    value2 = speed;
                }
                else if(Entry.Mechatronics_4D.lowList.indexOf(rotation) > -1) {
                    //역방향 회전
                    value1 = speed;
                    value2 = 0;
                }
                else {
                    throw new Error();
                }

                if(!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }

                //각 핀에 데이터 보냄
                Entry.hw.sendQueue['SET'][port1] = {
                    type : Entry.Mechatronics_4D.sensorTypes.PWM,
                    data : value1,
                    time: new Date().getTime(),
                };

                Entry.hw.sendQueue['SET'][port2] = {
                    type : Entry.Mechatronics_4D.sensorTypes.PWM,
                    data : value2,
                    time: new Date().getTime(),
                };
            }
        },

        Mechatronics_4D_off_motor: { //모터 작동 중지 블록
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
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
            def: {
                params: [
                    {
                        type: 'Mechatronics_4D_board_version_list',
                    },
                    {
                        type: 'Mechatronics_4D_motor_list',
                    },
                    {
                        type: 'Mechatronics_4D_motor_side_list',
                    },
                ],
                type: 'Mechatronics_4D_off_motor'
            },
            paramsKeyMap: {
                VERSION: 0,
                MOTOR: 1,
                SIDE: 2,
            },
            class: 'Mechatronics_4D',
            isNotFor: ['Mechatronics_4D'],
            func: function(sprite, script) {
                //보드의 버전
                var version = script.getNumberValue('VERSION');
                //제어할 DC모터의 방향
                var motor = script.getValue('MOTOR');
                //제어할 DC모터의 위치
                var side = script.getValue('SIDE');
                //제어할 DC모터의 핀 번호
                var port1, port2;
                //핀 번호에 보내줄 값, 정지할 것이므로 0으로 설정
                var value = 0;

                if(typeof motor === 'string') {
                    motor = motor.toLowerCase();
                }
                
                switch(version){  //보드의 버전을 구분
                    case 3: //v3
                        if(Entry.Mechatronics_4D.highList.indexOf(motor) > -1) {
                            if(Entry.Mechatronics_4D.highList.indexOf(side) > -1) {
                                //왼쪽 앞단 DC모터를 제어하는 14번핀과 15번핀(A0, A1)
                                port1 = '14';
                                port2 = '15';
                            }
                            else if(Entry.Mechatronics_4D.lowList.indexOf(side) > -1) {
                                //왼쪽 뒷단 DC모터를 제어하는 5번핀과 6번핀
                                port1 = '5';
                                port2 = '6';
                            }
                        }
                        else if(Entry.Mechatronics_4D.lowList.indexOf(motor) > -1) {
                            if(Entry.Mechatronics_4D.highList.indexOf(side) > -1) {
                                //오른쪽 앞단 DC모터를 제어하는 16번 핀과 17번핀(A3, A4)
                                port1 = '17';
                                port2 = '16';
                            }
                                else if(Entry.Mechatronics_4D.lowList.indexOf(side) > -1) {
                                //오른쪽 뒷단 DC모터를 제어하는 9번핀과 10번핀
                                port1 = '10';
                                port2 = '9';
                            }
                        }
                        else {
                            throw new Error();
                        }
                        break;

                    case 4: //v4
                        if(Entry.Mechatronics_4D.highList.indexOf(motor) > -1) {
                            if(Entry.Mechatronics_4D.highList.indexOf(side) > -1) {
                                //왼쪽 앞단 DC모터를 제어하는 16번핀과 17번핀
                                port1 = '16';
                                port2 = '17';
                            }
                            else if(Entry.Mechatronics_4D.lowList.indexOf(side) > -1) {
                                //왼쪽 뒷단 DC모터를 제어하는 9번핀과 10번핀
                                port1 = '9';
                                port2 = '10';                                
                            }
                        }
                        else if(Entry.Mechatronics_4D.lowList.indexOf(motor) > -1) {
                            if(Entry.Mechatronics_4D.highList.indexOf(side) > -1) {
                                //오른쪽 앞단 DC모터를 제어하는 14번핀과 15번핀(A3, A4)
                                port1 = '14';
                                port2 = '15';
                            }
                            else if(Entry.Mechatronics_4D.lowList.indexOf(side) > -1) {
                                //오른쪽 뒷단 DC모터를 제어하는 5번핀과 6번핀
                                port1 = '5';
                                port2 = '6';
                            }
                        }
                        else {
                            throw new Error();
                        }
                        break;
                }
                
                if(!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }

                //각 핀에 데이터 보냄
                Entry.hw.sendQueue['SET'][port1] = {
                    type : Entry.Mechatronics_4D.sensorTypes.DIGITAL,
                    data : value,
                    time: new Date().getTime(),
                };

                Entry.hw.sendQueue['SET'][port2] = {
                    type : Entry.Mechatronics_4D.sensorTypes.DIGITAL,
                    data : value,
                    time: new Date().getTime(),
                };
            }
        },

        Mechatronics_4D_set_servo: { //서보모터 작동 블록
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
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
                    defaultType: 'number',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            def: {
                params: [
                    {
                        type: 'Mechatronics_4D_board_version_list',
                    },
                    {
                        type: 'Mechatronics_4D_motor_list',
                    },
                    null,
                ],
                type: 'Mechatronics_4D_set_servo',
            },
            paramsKeyMap: {
                VERSION: 0,
                MOTOR: 1,
                ANGLE: 2,
            },
            class: 'Mechatronics_4D',
            isNotFor: ['Mechatronics_4D'],
            func: function(sprite, script) {
                //보드의 버전
                var version = script.getNumberValue('VERSION');
                //제어할 서보모터의 위치
                var motor = script.getValue('MOTOR');
                //제어할 서보모터의 핀 번호
                var port;
                //서보모터를 설정할 각도
                var angle = script.getValue('ANGLE');

                if(typeof motor === 'string') {
                    motor = motor.toLowerCase();
                }

                if(Entry.Mechatronics_4D.highList.indexOf(motor) > -1) {
                    //왼쪽 서보모터를 제어하는 11번핀
                    port = '11';
                }
                else if(Entry.Mechatronics_4D.lowList.indexOf(motor) > -1) {
                    //오른쪽 서보모터를 제어하는 3번핀
                    port = '3';
                }
                else {
                    throw new Error();
                }

                if(!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }

                //핀에 데이터 보냄
                Entry.hw.sendQueue['SET'][port] = {
                    type : Entry.Mechatronics_4D.sensorTypes.SERVO_PIN,
                    data : angle,
                    time: new Date().getTime(),
                };
            }
        },

    }
     //endregion Mechatronics_4D 메카트로닉스4D
}

module.exports = Entry.Mechatronics_4D;