'use strict';

Entry.cp_moving = {
    id: '3E.1',
    name: 'cp_moving',
    url: 'https://cafe.naver.com/codingpl',
    imageName: 'cp_moving.png',
    title: {
        en: 'CP Moving Car',
        ko: 'CP 무빙카',
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
        LED: 9,
        TEMP: 10,
        MOTOR: 11,
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
    direction: {
        CENTER: 0,
        UP: 1,
        LEFT: 2,
        RIGHT: 3,
        DOWN: 4,
        LEFT_UP: 5,
        LEFT_DOWN: 6,
        RIGHT_UP: 7,
        RIGHT_DOWN: 8,
    },
    color: {
        RED: [1.0, 0.0, 0.0],
        GREEN: [0.0, 1.0, 0.0],
        BLUE: [0.0, 0.0, 1.0],
        TEAL: [0.0, 0.21, 0.26],
        PINK: [1.0, 0.0, 0.56],
        YELLOW: [1.0, 1.0, 0.0],
        WHITE: [1.0, 1.0, 1.0],
    },
    move: {
        FORWARD: [1.0, 1.0],
        BACKWARD: [-1.0, -1.0],
        LEFT: [0.5, 1.0],
        RIGHT: [1.0, 0.5],
    },
};
Entry.cp_moving.blockMenuBlocks = [
    'cp_moving_get_ultrasonic',
    'cp_moving_get_soil',
    'cp_moving_get_analog_value',
    'cp_moving_get_analog',
    'cp_moving_get_digital',
    'cp_moving_get_joystick',
    'cp_moving_get_joystick_button',
    'cp_moving_get_button',
    'cp_moving_get_ir',
    'cp_moving_set_vibrator',
    'cp_moving_set_fan',
    'cp_moving_set_led_color',
    'cp_moving_set_led',
    'cp_moving_stop_led',
    'cp_moving_set_audio_octave',
    'cp_moving_set_audio_freq',
    'cp_moving_stop_audio',
    'cp_moving_set_motor',
    'cp_moving_stop_motor',
    'cp_moving_set_move',
    'cp_moving_stop_move'
];
Entry.cp_moving.getBlocks = function() {
    return {
        cp_moving_set_vibrator: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [[Lang.Blocks.cp_moving_set_on, 'on'], [Lang.Blocks.cp_moving_set_off, 'off']],
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
                params: [null],
                type: 'cp_moving_set_vibrator',
            },
            paramsKeyMap: {
                OPERATOR: 0,
            },
            class: 'cp_moving',
            isNotFor: ['cp_moving'],
            func(sprite, script) {
                const operator = script.getField('OPERATOR');
                const value = operator == 'on' ? 255 : 0;
                Entry.hw.setDigitalPortValue(2, value);
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[2] = {
                    type: Entry.cp_moving.sensorTypes.DIGITAL,
                    data: value,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
        },
        cp_moving_set_fan: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [[0, 0], [20, 50], [40, 100], [60, 150], [80, 200], [100, 250]],
                    value: 150,
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
                params: [null],
                type: 'cp_moving_set_fan',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'cp_moving',
            isNotFor: ['cp_moving'],
            func(sprite, script) {
                let value = script.getField('VALUE');
                value = Math.round(value);
                value = Math.max(value, 0);
                value = Math.min(value, 255);
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[3] = {
                    type: Entry.cp_moving.sensorTypes.PWM,
                    data: value,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
        },
        cp_moving_set_motor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.cp_moving_motor_left, 0],
                        [Lang.Blocks.cp_moving_motor_right, 1],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [[0, 0], [20, 10], [40, 20], [60, 30], [80, 40], [100, 50]],
                    value: 30,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.cp_moving_motor_forward, 0],
                        [Lang.Blocks.cp_moving_motor_reverse, 1],
                    ],
                    value: 0,
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
                params: [null, null],
                type: 'cp_moving_set_motor',
            },
            paramsKeyMap: {
                WHICH: 0,
                SPEED: 1,
                DIRECTION: 2,
            },
            class: 'cp_moving',
            isNotFor: ['cp_moving'],
            func(sprite, script) {
                const which = script.getField('WHICH', script);
                const speed = script.getField('SPEED', script);
                const direction = script.getField('DIRECTION', script);
                let s1 = 100;
                let s2 = 100;

                if (which == 0) {
                    s1 = -speed;
                    if (direction == 1) {
                        s1 *= -1;
                    }
                } else {
                    s2 = speed;
                    if (direction == 1) {
                        s2 *= -1;
                    }
                }

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[0] = {
                    type: Entry.cp_moving.sensorTypes.MOTOR,
                    data: { s1, s2 },
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
        },
        cp_moving_stop_motor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.cp_moving_motor_left, 0],
                        [Lang.Blocks.cp_moving_motor_right, 1],
                    ],
                    value: 0,
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
                params: [null],
                type: 'cp_moving_stop_motor',
            },
            paramsKeyMap: {
                WHICH: 0,
            },
            class: 'cp_moving',
            isNotFor: ['cp_moving'],
            func(sprite, script) {
                const which = script.getField('WHICH', script);
                let s1 = 100;
                let s2 = 100;
                if (which == 0) {
                    s1 = 0;
                } else {
                    s2 = 0;
                }

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[0] = {
                    type: Entry.cp_moving.sensorTypes.MOTOR,
                    data: { s1, s2 },
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
        },
        cp_moving_set_move: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [[0, 0], [20, 10], [40, 20], [60, 30], [80, 40], [100, 50]],
                    value: 30,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.cp_moving_move_forward, Entry.cp_moving.move.FORWARD],
                        [Lang.Blocks.cp_moving_move_backward, Entry.cp_moving.move.BACKWARD],
                        [Lang.Blocks.cp_moving_move_left, Entry.cp_moving.move.LEFT],
                        [Lang.Blocks.cp_moving_move_right, Entry.cp_moving.move.RIGHT],
                    ],
                    value: Entry.cp_moving.move.FORWARD,
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
                params: [null, null],
                type: 'cp_moving_set_move',
            },
            paramsKeyMap: {
                SPEED: 0,
                DIRECTION: 1,
            },
            class: 'cp_moving',
            isNotFor: ['cp_moving'],
            func(sprite, script) {
                const direction = script.getField('DIRECTION', script);
                const speed = script.getField('SPEED', script);
                let s1 = -speed;
                let s2 = speed;
                if (direction == Entry.cp_moving.move.BACKWARD) {
                    s1 = speed;
                    s2 = -speed;
                } else if (direction == Entry.cp_moving.move.LEFT) {
                    s1 = speed;
                } else if (direction == Entry.cp_moving.move.RIGHT) {
                    s2 = -speed;
                }

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[0] = {
                    type: Entry.cp_moving.sensorTypes.MOTOR,
                    data: { s1, s2 },
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
        },
        cp_moving_stop_move: {
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
                params: [],
                type: 'cp_moving_stop_move',
            },
            paramsKeyMap: {},
            class: 'cp_moving',
            isNotFor: ['cp_moving'],
            func(sprite, script) {
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[0] = {
                    type: Entry.cp_moving.sensorTypes.MOTOR,
                    data: { s1: 0, s2: 0 },
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
        },
        cp_moving_set_servor: {
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
                params: [null],
                type: 'cp_moving_set_servor',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'cp_moving',
            isNotFor: ['cp_moving'],
            func(sprite, script) {
                let value = script.getNumberValue('VALUE', script);
                value = Math.min(180, value);
                value = Math.max(0, value);

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue = {
                        GET: {},
                        SET: {},
                    };
                }
                Entry.hw.sendQueue.SET[11] = {
                    type: Entry.cp_moving.sensorTypes.SERVO_PIN,
                    data: value,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
        },
        cp_moving_set_audio_octave: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.do_name, 1],
                        [Lang.Blocks.do_sharp_name, 2],
                        [Lang.Blocks.re_name, 3],
                        [Lang.Blocks.re_sharp_name, 4],
                        [Lang.Blocks.mi_name, 5],
                        [Lang.Blocks.fa_name, 6],
                        [Lang.Blocks.fa_sharp_name, 7],
                        [Lang.Blocks.sol_name, 8],
                        [Lang.Blocks.sol_sharp_name, 9],
                        [Lang.Blocks.la_name, 10],
                        [Lang.Blocks.la_sharp_name, 11],
                        [Lang.Blocks.si_name, 12],
                    ],
                    value: 1,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7]],
                    value: 4,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.cp_moving_buzzer_wn, 1000],
                        [Lang.Blocks.cp_moving_buzzer_hn, 500],
                        [Lang.Blocks.cp_moving_buzzer_qn, 250],
                        [Lang.Blocks.cp_moving_buzzer_en, 125],
                        [Lang.Blocks.cp_moving_buzzer_sn, 63],
                        [Lang.Blocks.cp_moving_buzzer_tn, 31],
                    ],
                    value: 250,
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
                type: 'cp_moving_set_audio_octave',
            },
            paramsKeyMap: {
                NOTE: 0,
                OCTAVE: 1,
                DURATION: 2,
            },
            class: 'cp_moving',
            isNotFor: ['cp_moving'],
            func(sprite, script) {
                if (!script.isStart) {
                    const note = script.getField('NOTE', script);
                    const octave = script.getField('OCTAVE', script) - 1;
                    const duration = script.getField('DURATION', script);
                    const value = Entry.cp_moving.toneMap[note][octave];

                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue = {
                            GET: {},
                            SET: {},
                        };
                    }

                    script.isStart = true;
                    script.timeFlag = 1;

                    Entry.hw.sendQueue.SET[8] = {
                        type: Entry.ArduinoExt.sensorTypes.TONE,
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
                    Entry.hw.sendQueue.SET[8] = {
                        type: Entry.ArduinoExt.sensorTypes.TONE,
                        data: 0,
                        time: new Date().getTime(),
                    };
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
        },
        cp_moving_set_audio_freq: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    value: 3000,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    value: 1,
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
                params: [null, null],
                type: 'cp_moving_set_audio_freq',
            },
            paramsKeyMap: {
                HZ: 0,
                SECOND: 1,
            },
            class: 'cp_moving',
            isNotFor: ['cp_moving'],
            func(sprite, script) {
                const value = script.getNumberValue('HZ', script);
                const duration = script.getNumberValue('SECOND', script) * 1000;

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue = {
                        GET: {},
                        SET: {},
                    };
                }
                Entry.hw.sendQueue.SET[8] = {
                    type: Entry.ArduinoExt.sensorTypes.TONE,
                    data: {
                        value,
                        duration,
                    },
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
        },
        cp_moving_stop_audio: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.cp_moving_buzzer_wn, 1000],
                        [Lang.Blocks.cp_moving_buzzer_hn, 500],
                        [Lang.Blocks.cp_moving_buzzer_qn, 250],
                        [Lang.Blocks.cp_moving_buzzer_en, 125],
                        [Lang.Blocks.cp_moving_buzzer_sn, 63],
                        [Lang.Blocks.cp_moving_buzzer_tn, 31],
                    ],
                    value: 250,
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
                params: [null],
                type: 'cp_moving_stop_audio',
            },
            paramsKeyMap: {
                DURATION: 0,
            },
            class: 'cp_moving',
            isNotFor: ['cp_moving'],
            func(sprite, script) {
                if (!script.isStart) {
                    const duration = script.getField('DURATION', script);

                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue = {
                            GET: {},
                            SET: {},
                        };
                    }

                    script.isStart = true;
                    script.timeFlag = 1;

                    Entry.hw.sendQueue.SET[8] = {
                        type: Entry.ArduinoExt.sensorTypes.TONE,
                        data: {
                            value: 0,
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
                    Entry.hw.sendQueue.SET[8] = {
                        type: Entry.ArduinoExt.sensorTypes.TONE,
                        data: 0,
                        time: new Date().getTime(),
                    };
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
        },
        cp_moving_get_ultrasonic: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [],
                type: 'cp_moving_get_ultrasonic',
            },
            paramsKeyMap: {},
            class: 'cp_moving',
            isNotFor: ['cp_moving'],
            func(sprite, script) {
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                delete Entry.hw.sendQueue.SET[9];
                delete Entry.hw.sendQueue.SET[10];

                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                Entry.hw.sendQueue.GET[Entry.cp_moving.sensorTypes.ULTRASONIC] = {
                    port: [10, 9],
                    time: new Date().getTime(),
                };

                return Entry.hw.portData.ULTRASONIC || 0;
            },
        },
        cp_moving_get_joystick: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.cp_moving_joystick_up, Entry.cp_moving.direction.UP],
                        [Lang.Blocks.cp_moving_joystick_down, Entry.cp_moving.direction.DOWN],
                        [Lang.Blocks.cp_moving_joystick_left, Entry.cp_moving.direction.LEFT],
                        [Lang.Blocks.cp_moving_joystick_right, Entry.cp_moving.direction.RIGHT],
                        [Lang.Blocks.cp_moving_joystick_left_up, Entry.cp_moving.direction.LEFT_UP],
                        [Lang.Blocks.cp_moving_joystick_left_down, Entry.cp_moving.direction.LEFT_DOWN],
                        [Lang.Blocks.cp_moving_joystick_right_up, Entry.cp_moving.direction.RIGHT_UP],
                        [Lang.Blocks.cp_moving_joystick_right_down, Entry.cp_moving.direction.RIGHT_DOWN],
                        [Lang.Blocks.cp_moving_joystick_center, Entry.cp_moving.direction.CENTER],
                    ],
                    value: Entry.cp_moving.direction.CENTER,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'cp_moving_get_joystick',
            },
            paramsKeyMap: {
                DIRECTION: 0,
            },
            class: 'cp_moving',
            isNotFor: ['cp_moving'],
            func(sprite, script) {
                const direction = script.getField('DIRECTION', script);
                const ANALOG = Entry.hw.portData.ANALOG;

                const getValue = function(w) {
                    return ANALOG[w] == 0 ? 0 : ANALOG[w] == 1023 ? 2 : 1;
                };

                if (
                    direction == Entry.cp_moving.direction.CENTER &&
                    getValue(0) == 1 &&
                    getValue(1) == 1
                ) {
                    return 1;
                } else if (
                    direction == Entry.cp_moving.direction.DOWN &&
                    getValue(0) == 1 &&
                    getValue(1) == 2
                ) {
                    return 1;
                } else if (
                    direction == Entry.cp_moving.direction.LEFT &&
                    getValue(0) == 0 &&
                    getValue(1) == 1
                ) {
                    return 1;
                } else if (
                    direction == Entry.cp_moving.direction.LEFT_DOWN &&
                    getValue(0) == 0 &&
                    getValue(1) == 2
                ) {
                    return 1;
                } else if (
                    direction == Entry.cp_moving.direction.LEFT_UP &&
                    getValue(0) == 0 &&
                    getValue(1) == 0
                ) {
                    return 1;
                } else if (
                    direction == Entry.cp_moving.direction.RIGHT &&
                    getValue(0) == 2 &&
                    getValue(1) == 1
                ) {
                    return 1;
                } else if (
                    direction == Entry.cp_moving.direction.RIGHT_DOWN &&
                    getValue(0) == 2 &&
                    getValue(1) == 2
                ) {
                    return 1;
                } else if (
                    direction == Entry.cp_moving.direction.RIGHT_UP &&
                    getValue(0) == 2 &&
                    getValue(1) == 0
                ) {
                    return 1;
                } else if (
                    direction == Entry.cp_moving.direction.UP &&
                    getValue(0) == 1 &&
                    getValue(1) == 0
                ) {
                    return 1;
                }

                return 0;
            },
        },
        cp_moving_get_joystick_button: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [],
                type: 'cp_moving_get_joystick_button',
            },
            paramsKeyMap: {},
            class: 'cp_moving',
            isNotFor: ['cp_moving'],
            func(sprite, script) {
                const ANALOG = Entry.hw.portData.ANALOG;
                return ANALOG ? ANALOG[1] && ANALOG[2] != 0 : 0;
            },
        },
        cp_moving_get_button: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.cp_moving_button_blue, 6],
                        [Lang.Blocks.cp_moving_button_red, 7],
                    ],
                    value: 6,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [],
                type: 'cp_moving_get_button',
            },
            paramsKeyMap: {
                WHICH: 0,
            },
            class: 'cp_moving',
            isNotFor: ['cp_moving'],
            func(sprite, script) {
                const which = script.getField('WHICH', script);
                const ANALOG = Entry.hw.portData.ANALOG;
                return ANALOG ? ANALOG[which] != 0 : 0;
            },
        },
        cp_moving_set_led: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    value: 100,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    value: 100,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    value: 100,
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
                type: 'cp_moving_set_led',
            },
            paramsKeyMap: {
                R: 0,
                G: 1,
                B: 2,
            },
            class: 'cp_moving',
            isNotFor: ['cp_moving'],
            func(sprite, script) {
                if (!script.isStart) {
                    let r = script.getNumberValue('R', script);
                    let g = script.getNumberValue('G', script);
                    let b = script.getNumberValue('B', script);

                    r = Math.max(Math.min(r, 255), 0);
                    g = Math.max(Math.min(g, 255), 0);
                    b = Math.max(Math.min(b, 255), 0);

                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue = {
                            GET: {},
                            SET: {},
                        };
                    }

                    Entry.hw.sendQueue.SET[13] = {
                        type: Entry.cp_moving.sensorTypes.LED,
                        data: {
                            r,
                            g,
                            b,
                        },
                        time: new Date().getTime(),
                    };

                    script.isStart = true;
                    script.timeFlag = 1;

                    setTimeout(() => {
                        script.timeFlag = 0;
                    }, 50);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
        },
        cp_moving_set_led_color: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.cp_moving_color_red, 'RED'],
                        [Lang.Blocks.cp_moving_color_green, 'GREEN'],
                        [Lang.Blocks.cp_moving_color_blue, 'BLUE'],
                        [Lang.Blocks.cp_moving_color_teal, 'TEAL'],
                        [Lang.Blocks.cp_moving_color_pink, 'PINK'],
                        [Lang.Blocks.cp_moving_color_yellow, 'YELLOW'],
                        [Lang.Blocks.cp_moving_color_white, 'WHITE'],
                    ],
                    value: 'RED',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    value: 100,
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
                params: [null, null],
                type: 'cp_moving_set_led_color',
            },
            paramsKeyMap: {
                COLOR: 0,
                BRIGHTNESS: 1,
            },
            class: 'cp_moving',
            isNotFor: ['cp_moving'],
            func(sprite, script) {
                if (!script.isStart) {
                    const colorType = script.getField('COLOR', script);
                    const color = Entry.cp_moving.color[colorType];
                    let brightness = script.getNumberValue('BRIGHTNESS', script);

                    brightness = Math.max(Math.min(brightness, 255), 0);

                    let r = parseInt(color[0] * brightness);
                    let g = parseInt(color[1] * brightness);
                    let b = parseInt(color[2] * brightness);
                    r = Math.max(Math.min(r, 255), 0);
                    g = Math.max(Math.min(g, 255), 0);
                    b = Math.max(Math.min(b, 255), 0);

                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue = {
                            GET: {},
                            SET: {},
                        };
                    }

                    Entry.hw.sendQueue.SET[13] = {
                        type: Entry.cp_moving.sensorTypes.LED,
                        data: {
                            r,
                            g,
                            b,
                        },
                        time: new Date().getTime(),
                    };

                    script.isStart = true;
                    script.timeFlag = 1;

                    setTimeout(() => {
                        script.timeFlag = 0;
                    }, 50);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
        },
        cp_moving_stop_led: {
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
                params: [],
                type: 'cp_moving_stop_led',
            },
            paramsKeyMap: {},
            class: 'cp_moving',
            isNotFor: ['cp_moving'],
            func(sprite, script) {
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue = {
                        GET: {},
                        SET: {},
                    };
                }

                Entry.hw.sendQueue.SET[13] = {
                    type: Entry.cp_moving.sensorTypes.LED,
                    data: {
                        r: 0,
                        g: 0,
                        b: 0,
                    },
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
        },
        cp_moving_get_soil: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [],
                type: 'cp_moving_get_soil',
            },
            paramsKeyMap: {},
            class: 'cp_moving',
            isNotFor: ['cp_moving'],
            func(sprite, script) {
                const ANALOG = Entry.hw.portData.ANALOG;
                return ANALOG ? ANALOG[3] || 0 : 0;
            },
        },
        cp_moving_get_analog: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [],
                type: 'cp_moving_get_analog',
            },
            paramsKeyMap: {},
            class: 'cp_moving',
            isNotFor: ['cp_moving'],
            func(sprite, script) {
                const ANALOG = Entry.hw.portData.ANALOG;
                return ANALOG ? ANALOG[5] || 0 : 0;
            },
        },
        cp_moving_get_digital: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [[1, 11], [2, 12]],
                    value: 11,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'cp_moving_get_digital',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'cp_moving',
            isNotFor: ['cp_moving'],
            func(sprite, script) {
                const port = script.getField('PORT', script);
                const DIGITAL = Entry.hw.portData.DIGITAL;
                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                Entry.hw.sendQueue.GET[Entry.cp_moving.sensorTypes.DIGITAL] = {
                    port,
                    time: new Date().getTime(),
                };
                return DIGITAL ? DIGITAL[port] || 0 : 0;
            },
        },
        cp_moving_set_digital: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [[11, 11], [12, 12]],
                    value: 11,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [[Lang.Blocks.cp_moving_set_on, 'on'], [Lang.Blocks.cp_moving_set_off, 'off']],
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
                params: [null, null],
                type: 'cp_moving_set_digital',
            },
            paramsKeyMap: {
                PORT: 0,
                OPERATOR: 1,
            },
            class: 'cp_moving',
            isNotFor: ['cp_moving'],
            func(sprite, script) {
                const port = script.getField('PORT', script);
                const operator = script.getField('OPERATOR');
                const value = operator == 'on' ? 255 : 0;
                Entry.hw.setDigitalPortValue(port, value);
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[port] = {
                    type: Entry.cp_moving.sensorTypes.DIGITAL,
                    data: value,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
        },
        cp_moving_get_analog_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [],
                type: 'cp_moving_get_analog_value',
            },
            paramsKeyMap: {},
            class: 'cp_moving',
            isNotFor: ['cp_moving'],
            func(sprite, script) {
                const ANALOG = Entry.hw.portData.ANALOG;
                return ANALOG ? ANALOG[4] || 0 : 0;
            },
        },
        cp_moving_get_ir: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [[Lang.Blocks.cp_moving_ir_left, 11], [Lang.Blocks.cp_moving_ir_right, 12]],
                    value: 11,
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
                params: [null, null],
                type: 'cp_moving_get_ir',
            },
            paramsKeyMap: {
                PORT: 0,
                OPERATOR: 1,
            },
            class: 'cp_moving',
            isNotFor: ['cp_moving'],
            func(sprite, script) {
                const port = script.getField('PORT', script);
                const DIGITAL = Entry.hw.portData.DIGITAL;
                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                Entry.hw.sendQueue.GET[Entry.cp_moving.sensorTypes.DIGITAL] = {
                    port,
                    time: new Date().getTime(),
                };
                return DIGITAL ? DIGITAL[port] || 0 : 0;
            },
        }
    };
};
Entry.cp_moving.setLanguage = function() {
    return {
        ko: {
            Blocks: {
                cp_moving_set_on: '켜기',
                cp_moving_set_off: '끄기',
                cp_moving_color_red: '빨간',
                cp_moving_color_green: '초록',
                cp_moving_color_blue: '파란',
                cp_moving_color_teal: '청록',
                cp_moving_color_pink: '분홍',
                cp_moving_color_yellow: '노란',
                cp_moving_color_white: '하얀',
                cp_moving_motor_left: '왼쪽',
                cp_moving_motor_right: '오른쪽',
                cp_moving_motor_forward: '정방향',
                cp_moving_motor_reverse: '역방향',
                cp_moving_move_forward: '전진',
                cp_moving_move_backward: '후진',
                cp_moving_move_left: '좌회전',
                cp_moving_move_right: '우회전',
                cp_moving_buzzer_hn: '2분음표',
                cp_moving_buzzer_qn: '4분음표',
                cp_moving_buzzer_en: '8분음표',
                cp_moving_buzzer_sn: '16분음표',
                cp_moving_buzzer_tn: '32분음표',
                cp_moving_buzzer_wn: '온음표',
                cp_moving_joystick_center: '가운데',
                cp_moving_joystick_down: '아래',
                cp_moving_joystick_left: '왼쪽',
                cp_moving_joystick_left_down: '왼쪽 아래',
                cp_moving_joystick_left_up: '왼쪽 위',
                cp_moving_joystick_right: '오른쪽',
                cp_moving_joystick_right_down: '오른쪽 아래',
                cp_moving_joystick_right_up: '오른쪽 위',
                cp_moving_joystick_up: '위',
                cp_moving_button_red: '빨강',
                cp_moving_button_blue: '파랑',
                cp_moving_ir_left: '왼쪽',
                cp_moving_ir_right: '오른쪽',
            },
            template: {
                cp_moving_set_vibrator: '진동 알림 %1 %2',
                cp_moving_set_fan: '팬을 속도 %1(으)로 회전 시키기 %2',
                cp_moving_set_servor: '서보모터의 각도를 %1도로 정하기 %2',
                cp_moving_set_motor: 'DC모터 %1을 %2의 속도로 %3으로 회전하기 %4',
                cp_moving_stop_motor: 'DC모터 %1을 정지하기 %2',
                cp_moving_set_move: '로봇을 %1의 속도로 %2 하기 %3',
                cp_moving_stop_move: '로봇 정지하기 %1',
                cp_moving_set_audio_octave: '계명 %1음을 %2옥타브 %3으로 연주하기 %4',
                cp_moving_set_audio_freq: '펄스 %1Hz 음을 %2초 연주하기 %3',
                cp_moving_stop_audio: '%1 만큼 연주쉬기 %2',
                cp_moving_get_ultrasonic: '초음파센서 값 읽기',
                cp_moving_get_joystick: '조이스틱 방향이 %1 인가?',
                cp_moving_get_joystick_button: '조이스틱 버튼이 눌렸는가?',
                cp_moving_get_button: '%1색 버튼이 눌렸는가?',
                cp_moving_set_led: '컬러 LED 켜기- 빨강%1 초록%2 파랑%3 %4',
                cp_moving_set_led_color: 'LED %1색을 밝기 %2으로 켜기 %3',
                cp_moving_stop_led: 'LED 끄기 %1',
                cp_moving_get_soil: '토양 센서 값 읽기',
                cp_moving_get_analog: '아날로그 값 읽기',
                cp_moving_get_digital: '디지털 %1번 포트가 참인가?',
                cp_moving_set_digital: '디지털 %1 포트에 %2 출력하기 %3',
                cp_moving_get_analog_value: '가변저항 값 읽기',
                cp_moving_get_ir: '%1 적외선 센서 값 읽기',
            },
        },
        en: {
            Blocks: {
                cp_moving_set_on: 'on',
                cp_moving_set_off: 'off',
                cp_moving_color_red: 'red',
                cp_moving_color_green: 'green',
                cp_moving_color_blue: 'blue',
                cp_moving_color_teal: 'teal',
                cp_moving_color_pink: 'pink',
                cp_moving_color_yellow: 'yellow',
                cp_moving_color_white: 'white',
                cp_moving_motor_left: 'left',
                cp_moving_motor_right: 'right',
                cp_moving_motor_forward: 'forward',
                cp_moving_motor_reverse: 'reverse',
                cp_moving_move_forward: 'forward',
                cp_moving_move_backward: 'backward',
                cp_moving_move_left: 'left',
                cp_moving_move_right: 'right',
                cp_moving_buzzer_hn: 'half note',
                cp_moving_buzzer_qn: 'quarter note',
                cp_moving_buzzer_en: 'eighth note',
                cp_moving_buzzer_sn: 'sixteenth note',
                cp_moving_buzzer_tn: 'thirtysecond note',
                cp_moving_buzzer_wn: 'whole note',
                cp_moving_joystick_center: 'center',
                cp_moving_joystick_down: 'bottom',
                cp_moving_joystick_left: 'left',
                cp_moving_joystick_left_down: 'left bottom',
                cp_moving_joystick_left_up: 'left top',
                cp_moving_joystick_right: 'right',
                cp_moving_joystick_right_down: 'right bottom',
                cp_moving_joystick_right_up: 'right top',
                cp_moving_joystick_up: 'top',
                cp_moving_button_red: 'red',
                cp_moving_button_blue: 'blue',
                cp_moving_ir_left: 'left',
                cp_moving_ir_right: 'right',
            },
            template: {
                cp_moving_set_vibrator: 'Set vibrator %1 %2',
                cp_moving_set_fan: 'Rotating fan at %1 speed %2',
                cp_moving_set_motor: 'Turn on motor %1 a %2 at speed of %3 %4',
                cp_moving_stop_motor: 'Turn off motor %1 %2',
                cp_moving_set_move: 'Moving robot %2 at %1 speed %3',
                cp_moving_stop_move: 'Stop robot %1',
                cp_moving_set_servor: 'Set servo motor angle to %1 degrees %2',
                cp_moving_set_audio_octave: 'Play note %1 octave %2 beat %3 %4',
                cp_moving_set_audio_freq: 'Play note %1Hz beat %3',
                cp_moving_stop_audio: 'Rest audio as %1 %2',
                cp_moving_get_ultrasonic: 'Get ultrasonic value',
                cp_moving_get_joystick: 'Get joystick value',
                cp_moving_get_joystick_button: 'Get joystick button pressed',
                cp_moving_get_button: 'Get switch %1 preesed',
                cp_moving_set_led: 'Turn on LED in red%1 green%2 blue%3 %4',
                cp_moving_set_led_color: 'Turn on LED in %1 with %2 brightness %3',
                cp_moving_stop_led: 'Turn off LED %1',
                cp_moving_get_soil: 'Get soil sensor value',
                cp_moving_get_analog: 'Read analog value',
                cp_moving_get_digital: 'Read digital port %1',
                cp_moving_set_digital: 'Write digital port %1 to value %2 %3',
                cp_moving_get_analog_value: 'Read variable resistance',
                cp_moving_get_ir: 'Read %1 infrared ray sensor value',
            },
        },
    };
};

module.exports = Entry.cp_moving;
