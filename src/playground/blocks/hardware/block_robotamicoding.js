'use strict';

Entry.RobotamiCoding = {
    id: '2A.1',
    name: 'RobotamiCoding',
    url: 'http://robotron.co.kr/',
    imageName: 'robotamicoding.png', //thumbnail. 신규등록시 images/hw, images/hardware 에 이미지가 있어야합니다.
    title: {
        "ko": '로보타미코딩',
        "en": 'RobotamiCoding'
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
        NOTONE: 6,
        ULTRASONIC: 7,
        TIMER: 8,
        DC_MOTOR: 9,
        DC_STOP: 10,
        ROBOT: 11,
        ROBOT_STOP: 12,
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

Entry.RobotamiCoding.setLanguage = function() {
    return {
        ko: {
            Blocks: {
                ROBOTAMICODING_DCM_CLOCKWISE: '시계방향',
                ROBOTAMICODING_DCM_COUNTERCLOCKWISE: '반시계방향',
                ROBOTAMICODING_ROBOT_FORWARD: '전진',
                ROBOTAMICODING_ROBOT_BACKWARD: '후진',
                ROBOTAMICODING_ROBOT_LEFT: '좌회전',
                ROBOTAMICODING_ROBOT_RIGHT: '우회전',
                ROBOTAMICODING_ROBOT_GOLEFT: '전진좌회전',
                ROBOTAMICODING_ROBOT_GORIGHT: '전진우회전',
                ROBOTAMICODING_ROBOT_TURNLEFT: '제자리좌회전',
                ROBOTAMICODING_ROBOT_TURNRIGHT: '제자리우회전',
            },
            template: {
                robotami_coding_get_analog_value: '아날로그 %1 번 포트의 입력값',
                robotami_coding_get_digital_value: '디지털 %1 번 포트의 입력값',
                robotami_coding_set_digital_value: '디지털 %1 번 포트로 %2 출력하기 %3',
                robotami_coding_set_pwm: 'PWM %1 번 포트로 %2 출력하기 %3',
                robotami_coding_set_tone: '계명 %1 를 %2 옥타브로 %3 초 동안 연주하기 %4',
                robotami_coding_set_servo: '서보모터 %1 을 %2 도 위치로 회전 시키기 %3',
                robotami_coding_set_dcm_value: 'DC모터 %1 번을 %2 의 속도로 %3 으로 회전 시키기 %4',
                robotami_coding_set_dcm_stop: 'DC모터 %1 번 정지시키기 %2',
                robotami_coding_set_robot_value: '로봇을 %1 의 속도로 %2 시키기 %3',
                robotami_coding_set_robot_stop: '로봇 정지시키기 %1',
            },
        },
        en: {
            Blocks: {
                ROBOTAMICODING_DCM_CLOCKWISE: 'CW',
                ROBOTAMICODING_DCM_COUNTERCLOCKWISE: 'CCW',
                ROBOTAMICODING_ROBOT_FORWARD: 'go forward',
                ROBOTAMICODING_ROBOT_BACKWARD: 'go backward',
                ROBOTAMICODING_ROBOT_LEFT: 'turn left',
                ROBOTAMICODING_ROBOT_RIGHT: 'turn right',
                ROBOTAMICODING_ROBOT_GOLEFT: 'move forward to the left',
                ROBOTAMICODING_ROBOT_GORIGHT: 'move forward to the right',
                ROBOTAMICODING_ROBOT_TURNLEFT: 'turn left in place',
                ROBOTAMICODING_ROBOT_TURNRIGHT: 'turn right in place',
            },
            template: {
                robotami_coding_get_analog_value: 'value of analog %1',
                robotami_coding_get_digital_value: 'value of digital %1',
                robotami_coding_set_digital_value: 'set digital port %1 for output %2 %3',
                robotami_coding_set_pwm: 'set PWM port %1 for output %2 %3',
                robotami_coding_set_tone: 'play tone on note %1 octave %2 for %3 seconds %4',
                robotami_coding_set_servo: 'set servo motor %1 for angle %2 %3',
                robotami_coding_set_dcm_value: 'set DC motor %1 speed %2, direction %3 %4',
                robotami_coding_set_dcm_stop: 'stop DC motor %1 %2',
                robotami_coding_set_robot_value: 'move robot %2 at speed %1 %3',
                robotami_coding_set_robot_stop: 'stop robot %1',
            },
        },
    };
};

Entry.RobotamiCoding.blockMenuBlocks = [
    'robotami_coding_get_analog_value',
    'robotami_coding_get_digital_value',
    'robotami_coding_set_digital_value',
    'robotami_coding_set_pwm',
    'robotami_coding_set_tone',
    'robotami_coding_set_servo',
    'robotami_coding_set_dcm_value',
    'robotami_coding_set_dcm_stop',
    'robotami_coding_set_robot_value',
    'robotami_coding_set_robot_stop',
];

Entry.RobotamiCoding.getBlocks = function() {
    return {

        // 로보타미 코딩 아날로그 리스트
        robotami_coding_analog_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
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
            syntax: undefined,
        },
        
        robotami_coding_get_analog_value: {
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
                        type: 'robotami_coding_analog_list',
                    },
                ],
                type: 'robotami_coding_get_analog_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'RobotamiCodingGet',
            isNotFor: ['RobotamiCoding'],
            func: function(sprite, script) {
                var port = script.getValue('PORT', script);
                var ANALOG = Entry.hw.portData.ANALOG;
                if (port[0] === 'A') port = port.substring(1);
                return ANALOG ? ANALOG[port] || 0 : 0;
            },
            syntax: undefined,
        },

        // 로보타미 코딩 디지털 리스트
        robotami_coding_digital_list: {
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
                        ['8', '8'],
                        ['9', '9'],
                        ['10', '10'],
                        ['11', '11'],
                        ['12', '12'],
                        ['13', '13'],
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
                return script.getField('PORT');
            },
            syntax: undefined,
        },

        robotami_coding_get_digital_value: {
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
                        type: 'robotami_coding_digital_list',
                    },
                ],
                type: 'robotami_coding_get_digital_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'RobotamiCodingGet',
            isNotFor: ['RobotamiCoding'],
            func: function(sprite, script) {
                const { hwModule = {} } = Entry.hw;
                const { name } = hwModule;
                if (name === 'RobotamiCoding') {
                    var port = script.getNumberValue('PORT', script);
                    var DIGITAL = Entry.hw.portData.DIGITAL;
                    if (!Entry.hw.sendQueue['GET']) {
                        Entry.hw.sendQueue['GET'] = {};
                    }
                    Entry.hw.sendQueue['GET'][Entry.RobotamiCoding.sensorTypes.DIGITAL] = {
                        port: port,
                        time: new Date().getTime(),
                    };
                    return DIGITAL ? DIGITAL[port] || 0 : 0;
                } else {
                    return Entry.block.robotami_coding_get_digital_value.func(sprite, script);
                }
            },
            syntax: undefined,
        },

        // 로보타미 코딩 디지털 리스트
        robotami_coding_digital_value_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['0', '0'],
                        ['1', '1'],
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
                VALUE: 0,
            },
            func: function(sprite, script) {
                return script.getField('VALUE');
            },
            syntax: undefined,
        },

        robotami_coding_set_digital_value: {
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
                        type: 'robotami_coding_digital_list',
                    },
                    {
                        type: 'robotami_coding_digital_value_list',
                    },
                    null,
                ],
                type: 'robotami_coding_set_digital_value',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'RobotamiCoding',
            isNotFor: ['RobotamiCoding'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var value = script.getNumberValue('VALUE');

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.RobotamiCoding.sensorTypes.DIGITAL,
                    data: value,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: undefined,
        },

        // 로보타미 코딩 PWM 포트 리스트
        robotami_coding_pwm_list: {
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
            func: function(sprite, script) {
                return script.getField('PORT');
            },
            syntax: undefined,
        },

        robotami_coding_set_pwm: {
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
                        type: 'robotami_coding_pwm_list',
                    },
                    {
                        type: 'text',
                        params: ['255'],
                    },
                    null,
                ],
                type: 'robotami_coding_set_pwm',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'RobotamiCoding',
            isNotFor: ['RobotamiCoding'],
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
                    type: Entry.RobotamiCoding.sensorTypes.PWM,
                    data: value,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: undefined,
        },
        
        // 로보타미 코딩 계명 리스트
        robotami_coding_tone_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
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
            syntax: undefined,
        },

        robotami_coding_tone_value: {
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
                        type: 'robotami_coding_tone_list',
                    },
                ],
                type: 'robotami_coding_tone_value',
            },
            paramsKeyMap: {
                NOTE: 0,
            },
            func: function(sprite, script) {
                return script.getNumberValue('NOTE');
            },
            syntax: undefined,
        },

        // 로보타미 코딩 옥타브 리스트
        robotami_coding_octave_list: {
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
            syntax: undefined,
        },

        robotami_coding_set_tone: {
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
                        type: 'robotami_coding_tone_list',
                    },
                    {
                        type: 'robotami_coding_octave_list',
                    },
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'robotami_coding_set_tone',
            },
            paramsKeyMap: {
                NOTE: 0,
                OCTAVE: 1,
                DURATION: 2,
            },
            class: 'RobotamiCoding',
            isNotFor: ['RobotamiCoding'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var port = 13;

                if (!script.isStart) {
                    var note = script.getValue('NOTE', script);
                    if (!Entry.Utils.isNumber(note)) note = Entry.RobotamiCoding.toneTable[note];

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
                            type: Entry.RobotamiCoding.sensorTypes.TONE,
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
                        value = Entry.RobotamiCoding.toneMap[note][octave];
                    }

                    duration = duration * 1000;
                    script.isStart = true;
                    script.timeFlag = 1;

                    sq['SET'][port] = {
                        type: Entry.RobotamiCoding.sensorTypes.TONE,
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
                        type: Entry.RobotamiCoding.sensorTypes.TONE,
                        data: 0,
                        time: new Date().getTime(),
                    };
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: undefined,
        },

        robotami_coding_set_servo: {
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
                        type: 'robotami_coding_pwm_list',
                    },
                    {
                        type: 'text',
                        params: ['90'],
                    },
                    null,
                ],
                type: 'robotami_coding_set_servo',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'RobotamiCoding',
            isNotFor: ['RobotamiCoding'],
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
                    type: Entry.ArduinoExt.sensorTypes.SERVO_PIN,
                    data: value,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: undefined,
        },

        // 로보타미 코딩 DC 모터 리스트
        robotami_coding_dcm_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['0', '0'],
                        ['1', '1'],
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
            syntax: undefined,
        },

        // 로보타미 코딩 DC 모터 방향 리스트
        robotami_coding_dcm_dir_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOTAMICODING_DCM_CLOCKWISE, '0'],
                        [Lang.Blocks.ROBOTAMICODING_DCM_COUNTERCLOCKWISE, '1'],
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
                MOTOR_DIR: 0,
            },
            func: function(sprite, script) {
                return script.getField('MOTOR_DIR');
            },
            syntax: undefined,
        },

        robotami_coding_set_dcm_value: {
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
                        type: 'robotami_coding_dcm_list',
                    },
                    {
                        type: 'text',
                        params: ['255'],
                    },
                    {
                        type: 'robotami_coding_dcm_dir_list',
                    },
                    null,
                ],
                type: 'robotami_coding_set_dcm_value',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
                MOTOR_DIR: 2,
            },

            class: 'RobotamiCoding',
            isNotFor: ['RobotamiCoding'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT', script);
                var value = script.getNumberValue('VALUE', script);
                var motor_dir = script.getNumberValue('MOTOR_DIR', script);

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.RobotamiCoding.sensorTypes.DC_MOTOR,
                    data: {
                        value: value,
                        motor_dir: motor_dir,
                    },
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: undefined,
        },
        robotami_coding_set_dcm_stop: {
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'robotami_coding_dcm_list',
                    },
                    null,
                ],
                type: 'robotami_coding_set_dcm_stop',
            },
            paramsKeyMap: {
                PORT: 0,
            },

            class: 'RobotamiCoding',
            isNotFor: ['RobotamiCoding'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT', script);
                var value = 0;

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.RobotamiCoding.sensorTypes.DC_STOP,
                    data: value,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: undefined,
        },

        // 로보타미 코딩 로봇 동작 리스트
        robotami_coding_robot_move_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOTAMICODING_ROBOT_FORWARD,'0'],
                        [Lang.Blocks.ROBOTAMICODING_ROBOT_BACKWARD,'1'],
                        [Lang.Blocks.ROBOTAMICODING_ROBOT_LEFT,'2'],
                        [Lang.Blocks.ROBOTAMICODING_ROBOT_RIGHT,'3'],
                        [Lang.Blocks.ROBOTAMICODING_ROBOT_GOLEFT,'4'],
                        [Lang.Blocks.ROBOTAMICODING_ROBOT_GORIGHT,'5'],
                        [Lang.Blocks.ROBOTAMICODING_ROBOT_TURNLEFT,'6'],
                        [Lang.Blocks.ROBOTAMICODING_ROBOT_TURNRIGHT,'7'],
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
                ROBOT_MOVE: 0,
            },
            func: function(sprite, script) {
                return script.getField('ROBOT_MOVE');
            },
            syntax: undefined,
        },

        robotami_coding_set_robot_value: {
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
                        type: 'text',
                        params: ['255'],
                    },
                    {
                        type: 'robotami_coding_robot_move_list',
                    },
                    null,
                ],
                type: 'robotami_coding_set_robot_value',
            },
            paramsKeyMap: {
                VALUE: 0,
                ROBOT_MOVE: 1,
            },

            class: 'RobotamiCoding',
            isNotFor: ['RobotamiCoding'],
            func: function(sprite, script) {
                var port = 0;
                var value = script.getNumberValue('VALUE', script);
                var robot_move = script.getNumberValue('ROBOT_MOVE', script);

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.RobotamiCoding.sensorTypes.ROBOT,
                    data: {
                        value: value,
                        robot_move: robot_move,
                    },
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: undefined,
        },
        robotami_coding_set_robot_stop: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                ],
                type: 'robotami_coding_set_robot_stop',
            },
            paramsKeyMap: {

            },

            class: 'RobotamiCoding',
            isNotFor: ['RobotamiCoding'],
            func: function(sprite, script) {
                var port = 0;
                var value = 0;

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.RobotamiCoding.sensorTypes.ROBOT_STOP,
                    data: value,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: undefined,
        },
    };
};

module.exports = Entry.RobotamiCoding;
