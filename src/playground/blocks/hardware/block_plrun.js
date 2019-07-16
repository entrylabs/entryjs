'use strict';

Entry.plrun = {
    id: 'FF.1',
    name: 'plrun',
    url: 'http://robotron.co.kr',
    imageName: 'plrun.png',
    title: {
        en: 'coding plrun',
        ko: '코딩 플런',
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
        LED: 9,
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
        FORWARD: [1.0 ,1.0],
        BACKWARD: [-1.0, -1.0],
        LEFT: [0.5, 1.0],
        RIGHT: [1.0, 0.5],
    },
};
Entry.plrun.blockMenuBlocks = [
    'get_ultrasonic',
    'get_soil',
    'get_analog_value',
    'get_analog',
    'get_digital',
    'get_joystick',
    'get_joystick_button',
    'get_button',    
    'set_vibrator',
    'set_fan',
    'set_led_color',
    'set_led',
    'stop_led',
    'set_audio_octave',
    'set_audio_freq',
    'stop_audio',    

    /*
    'set_servor',    
    'set_digital',
    'set_motor',
    'stop_motor',
    'set_move',
    'stop_move',
    */
];
Entry.plrun.getBlocks = function() {
    return {
        set_vibrator: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [[Lang.Blocks.plrun_set_on, 'on'], [Lang.Blocks.plrun_set_off, 'off']],
                    value: 'on',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'set_vibrator',
            },
            paramsKeyMap: {
                OPERATOR: 0,
            },
            class: 'plrun',
            isNotFor: ['plrun'],
            func: function(sprite, script) {
                var operator = script.getField('OPERATOR');
                var value = operator == 'on' ? 255 : 0;
                Entry.hw.setDigitalPortValue(2, value);
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][2] = {
                    type: Entry.plrun.sensorTypes.DIGITAL,
                    data: value,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
        },
        set_fan: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [0, 0],
                        [20, 50],
                        [40, 100],
                        [60, 150],
                        [80, 200],
                        [100, 250],
                    ],
                    value: 150,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'set_fan',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'plrun',
            isNotFor: ['plrun'],
            func: function(sprite, script) {
                var value = script.getField('VALUE');
                value = Math.round(value);
                value = Math.max(value, 0);
                value = Math.min(value, 255);
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][3] = {
                    type: Entry.plrun.sensorTypes.PWM,
                    data: value,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
        },
        set_motor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.plrun_motor_left, 0],
                        [Lang.Blocks.plrun_motor_right, 1],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [0, 0],
                        [20, 50],
                        [40, 100],
                        [60, 150],
                        [80, 200],
                        [100, 250],
                    ],
                    value: 150,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.plrun_motor_forward, 0],
                        [Lang.Blocks.plrun_motor_reverse, 1],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null, null],
                type: 'set_motor',
            },
            paramsKeyMap: {
                WHICH: 0,
                SPEED: 1,
                DIRECTION: 2,
            },
            class: 'plrun',
            isNotFor: ['plrun'],
            func: function(sprite, script) {
                var which = script.getField('WHICH', script);
                var speed = script.getField('SPEED', script);
                var direction = script.getField('DIRECTION', script);
                var port = which == 0 ? [4, 5] : [7, 6];
                var value = direction == 0 ? which == 0 ? 0 : 1 :  which == 0 ? 1 : 0;

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port[0]] = {
                    type: Entry.plrun.sensorTypes.DIGITAL,
                    data: value,
                    time: new Date().getTime(),
                };
                Entry.hw.sendQueue['SET'][port[1]] = {
                    type: Entry.plrun.sensorTypes.PWM,
                    data: speed,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
        },
        stop_motor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.plrun_motor_left, 0],
                        [Lang.Blocks.plrun_motor_right, 1],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'stop_motor',
            },
            paramsKeyMap: {
                WHICH: 0,
            },
            class: 'plrun',
            isNotFor: ['plrun'],
            func: function(sprite, script) {
                var which = script.getField('WHICH', script);
                var port = which == 0 ? [4, 5] : [7, 6];

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port[1]] = {
                    type: Entry.plrun.sensorTypes.PWM,
                    data: 0,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
        },
        set_move: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [0, 0],
                        [20, 50],
                        [40, 100],
                        [60, 150],
                        [80, 200],
                        [100, 250],
                    ],
                    value: 150,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.plrun_move_forward, Entry.plrun.move.FORWARD],
                        [Lang.Blocks.plrun_move_backward, Entry.plrun.move.BACKWARD],
                        [Lang.Blocks.plrun_move_left, Entry.plrun.move.LEFT],
                        [Lang.Blocks.plrun_move_right, Entry.plrun.move.RIGHT],
                    ],
                    value: Entry.plrun.move.FORWARD,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null, null],
                type: 'set_move',
            },
            paramsKeyMap: {
                SPEED: 0,
                DIRECTION: 1,
            },
            class: 'plrun',
            isNotFor: ['plrun'],
            func: function(sprite, script) {
                var direction = script.getField('DIRECTION', script);
                var speed = script.getField('SPEED', script);
                var value = [direction[0] * speed, direction[1] * speed];

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][4] = {
                    type: Entry.plrun.sensorTypes.DIGITAL,
                    data: value[0] > 0 ? 0 : 1,
                    time: new Date().getTime(),
                };
                Entry.hw.sendQueue['SET'][5] = {
                    type: Entry.plrun.sensorTypes.PWM,
                    data: Math.abs(value[0]),
                    time: new Date().getTime(),
                };
                Entry.hw.sendQueue['SET'][7] = {
                    type: Entry.plrun.sensorTypes.DIGITAL,
                    data: value[1] > 0 ? 1 : 0,
                    time: new Date().getTime(),
                };
                Entry.hw.sendQueue['SET'][6] = {
                    type: Entry.plrun.sensorTypes.PWM,
                    data: Math.abs(value[1]),
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
        },
        stop_move: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
            ],
            events: {},
            def: {
                params: [],
                type: 'stop_move',
            },
            paramsKeyMap: {
            },
            class: 'plrun',
            isNotFor: ['plrun'],
            func: function(sprite, script) {
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][5] = {
                    type: Entry.plrun.sensorTypes.PWM,
                    data: 0,
                    time: new Date().getTime(),
                };
                Entry.hw.sendQueue['SET'][6] = {
                    type: Entry.plrun.sensorTypes.PWM,
                    data: 0,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
        },
        set_servor: {
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
            ],
            events: {},
            def: {
                params: [null],
                type: 'set_servor',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'plrun',
            isNotFor: ['plrun'],
            func: function(sprite, script) {
                var value = script.getNumberValue('VALUE', script);
                value = Math.min(180, value);
                value = Math.max(0, value);

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue = {
                        GET: {},
                        SET: {},
                    };
                }
                Entry.hw.sendQueue['SET'][11] = {
                    type: Entry.plrun.sensorTypes.SERVO_PIN,
                    data: value,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
        },
        set_audio_octave: {
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
                    options: [
                        [1, 1],
                        [2, 2],
                        [3, 3],
                        [4, 4],
                        [5, 5],
                        [6, 6],
                        [7, 7],
                    ],
                    value: 4,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.plrun_buzzer_wn, 1000],
                        [Lang.Blocks.plrun_buzzer_hn, 500],
                        [Lang.Blocks.plrun_buzzer_qn, 250],
                        [Lang.Blocks.plrun_buzzer_en, 125],
                        [Lang.Blocks.plrun_buzzer_sn, 63],
                        [Lang.Blocks.plrun_buzzer_tn, 31],
                    ],
                    value: 250,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                }
            ],
            events: {},
            def: {
                params: [null, null, null],
                type: 'set_audio_octave',
            },
            paramsKeyMap: {
                NOTE: 0,
                OCTAVE: 1,
                DURATION: 2,
            },
            class: 'plrun',
            isNotFor: ['plrun'],
            func: function(sprite, script) {
                if (!script.isStart) {
                    var note = script.getField('NOTE', script);
                    var octave = script.getField('OCTAVE', script) - 1;
                    var duration = script.getField('DURATION', script);
                    var value = Entry.plrun.toneMap[note][octave];
    
                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue = {
                            GET: {},
                            SET: {},
                        };
                    }

                    script.isStart = true;
                    script.timeFlag = 1;

                    Entry.hw.sendQueue['SET'][8] = {
                        type: Entry.ArduinoExt.sensorTypes.TONE,
                        data: {
                            value: value,
                            duration: duration
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
                    Entry.hw.sendQueue['SET'][8] = {
                        type: Entry.ArduinoExt.sensorTypes.TONE,
                        data: 0,
                        time: new Date().getTime(),
                    };    
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
        },
        set_audio_freq: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: "Block",
                    accept: "string",
                    value: 3000,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: "Block",
                    accept: "string",
                    value: 1,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null, null],
                type: 'set_audio_freq',
            },
            paramsKeyMap: {
                HZ: 0,
                SECOND: 1,
            },
            class: 'plrun',
            isNotFor: ['plrun'],
            func: function(sprite, script) {
                var value = script.getNumberValue('HZ', script);
                var duration = script.getNumberValue('SECOND', script) * 1000;

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue = {
                        GET: {},
                        SET: {},
                    };
                }
                Entry.hw.sendQueue['SET'][8] = {
                    type: Entry.ArduinoExt.sensorTypes.TONE,
                    data: {
                        value: value,
                        duration: duration
                    },
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
        },
        stop_audio: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.plrun_buzzer_wn, 1000],
                        [Lang.Blocks.plrun_buzzer_hn, 500],
                        [Lang.Blocks.plrun_buzzer_qn, 250],
                        [Lang.Blocks.plrun_buzzer_en, 125],
                        [Lang.Blocks.plrun_buzzer_sn, 63],
                        [Lang.Blocks.plrun_buzzer_tn, 31],
                    ],
                    value: 250,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                }
            ],
            events: {},
            def: {
                params: [null],
                type: 'stop_audio',
            },
            paramsKeyMap: {
                DURATION: 0,
            },
            class: 'plrun',
            isNotFor: ['plrun'],
            func: function(sprite, script) {
                if (!script.isStart) {
                    var duration = script.getField('DURATION', script);

                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue = {
                            GET: {},
                            SET: {},
                        };
                    }

                    script.isStart = true;
                    script.timeFlag = 1;

                    Entry.hw.sendQueue['SET'][8] = {
                        type: Entry.ArduinoExt.sensorTypes.TONE,
                        data: {
                            value: 0,
                            duration: duration
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
                    Entry.hw.sendQueue['SET'][8] = {
                        type: Entry.ArduinoExt.sensorTypes.TONE,
                        data: 0,
                        time: new Date().getTime(),
                    };    
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
        },
        get_ultrasonic: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
            ],
            events: {},
            def: {
                params: [
                ],
                type: 'get_ultrasonic',
            },
            paramsKeyMap: {
            },
            class: 'plrun',
            isNotFor: ['plrun'],
            func: function(sprite, script) {
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                delete Entry.hw.sendQueue['SET'][9];
                delete Entry.hw.sendQueue['SET'][10];

                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                Entry.hw.sendQueue['GET'][Entry.plrun.sensorTypes.ULTRASONIC] = {
                    port: [10, 9],
                    time: new Date().getTime(),
                };

                return Entry.hw.portData.ULTRASONIC || 0;
            },
        },
        get_joystick: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.plrun_joystick_up, Entry.plrun.direction.UP],
                        [Lang.Blocks.plrun_joystick_down, Entry.plrun.direction.DOWN],
                        [Lang.Blocks.plrun_joystick_left, Entry.plrun.direction.LEFT],
                        [Lang.Blocks.plrun_joystick_right, Entry.plrun.direction.RIGHT],
                        [Lang.Blocks.plrun_joystick_left_up, Entry.plrun.direction.LEFT_UP],
                        [Lang.Blocks.plrun_joystick_left_down, Entry.plrun.direction.LEFT_DOWN],
                        [Lang.Blocks.plrun_joystick_right_up, Entry.plrun.direction.RIGHT_UP],
                        [Lang.Blocks.plrun_joystick_right_down, Entry.plrun.direction.RIGHT_DOWN],
                        [Lang.Blocks.plrun_joystick_center, Entry.plrun.direction.CENTER],
                    ],
                    value: Entry.plrun.direction.CENTER,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'get_joystick',
            },
            paramsKeyMap: {
                DIRECTION: 0,
            },
            class: 'plrun',
            isNotFor: ['plrun'],
            func: function(sprite, script) {
                var direction = script.getField('DIRECTION', script);
                var ANALOG = Entry.hw.portData.ANALOG;

                var getValue = function(w) {
                    return ANALOG[w] == 0 ? 0 : ANALOG[w] == 1023 ? 2 : 1;
                };

                if (direction == Entry.plrun.direction.CENTER && getValue(0) == 1 && getValue(1) == 1) {
                    return 1;
                } else if (direction == Entry.plrun.direction.DOWN && getValue(0) == 1 && getValue(1) == 2) {
                    return 1;
                } else if (direction == Entry.plrun.direction.LEFT && getValue(0) == 0 && getValue(1) == 1) {
                    return 1;
                } else if (direction == Entry.plrun.direction.LEFT_DOWN && getValue(0) == 0 && getValue(1) == 2) {
                    return 1;
                } else if (direction == Entry.plrun.direction.LEFT_UP && getValue(0) == 0 && getValue(1) == 0) {
                    return 1;
                } else if (direction == Entry.plrun.direction.RIGHT && getValue(0) == 2 && getValue(1) == 1) {
                    return 1;
                } else if (direction == Entry.plrun.direction.RIGHT_DOWN && getValue(0) == 2 && getValue(1) == 2) {
                    return 1;
                } else if (direction == Entry.plrun.direction.RIGHT_UP && getValue(0) == 2 && getValue(1) == 0) {
                    return 1;
                } else if (direction == Entry.plrun.direction.UP && getValue(0) == 1 && getValue(1) == 0) {
                    return 1;
                }

                return 0;
            },
        },
        get_joystick_button: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
            ],
            events: {},
            def: {
                params: [],
                type: 'get_joystick_button',
            },
            paramsKeyMap: {
            },
            class: 'plrun',
            isNotFor: ['plrun'],
            func: function(sprite, script) {
                var ANALOG = Entry.hw.portData.ANALOG;
                return ANALOG ? ANALOG[1] && ANALOG[2] != 0 : 0;
            },
        },
        get_button: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.plrun_button_blue, 6],
                        [Lang.Blocks.plrun_button_red, 7],
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
                type: 'get_button',
            },
            paramsKeyMap: {
                WHICH: 0,
            },
            class: 'plrun',
            isNotFor: ['plrun'],
            func: function(sprite, script) {
                var which = script.getField("WHICH", script);
                var ANALOG = Entry.hw.portData.ANALOG;
                return ANALOG ? ANALOG[which] != 0 : 0;
            },
        },
        set_led: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: "Block",
                    accept: "string",
                    value: 100,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: "Block",
                    accept: "string",
                    value: 100,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: "Block",
                    accept: "string",
                    value: 100,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null, null, null],
                type: 'set_led',
            },
            paramsKeyMap: {
                R: 0,
                G: 1,
                B: 2,
            },
            class: 'plrun',
            isNotFor: ['plrun'],
            func: function(sprite, script) {
                if (!script.isStart) {
                    var r = script.getNumberValue('R', script);
                    var g = script.getNumberValue('G', script);
                    var b = script.getNumberValue('B', script);

                    r = Math.max(Math.min(r, 255), 0);
                    g = Math.max(Math.min(g, 255), 0);
                    b = Math.max(Math.min(b, 255), 0);

                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue = {
                            GET: {},
                            SET: {},
                        };
                    }

                    Entry.hw.sendQueue['SET'][13] = {
                        type: Entry.plrun.sensorTypes.LED,
                        data: {
                            r: r,
                            g: g,
                            b: b
                        },
                        time: new Date().getTime(),
                    };

                    script.isStart = true;
                    script.timeFlag = 1;

                    setTimeout(function() {
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
        set_led_color: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.plrun_color_red, 'RED'],
                        [Lang.Blocks.plrun_color_green, 'GREEN'],
                        [Lang.Blocks.plrun_color_blue, 'BLUE'],
                        [Lang.Blocks.plrun_color_teal, 'TEAL'],
                        [Lang.Blocks.plrun_color_pink, 'PINK'],
                        [Lang.Blocks.plrun_color_yellow, 'YELLOW'],
                        [Lang.Blocks.plrun_color_white, 'WHITE'],
                    ],
                    value: 'RED',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: "Block",
                    accept: "string",
                    value: 100,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null, null],
                type: 'set_led_color',
            },
            paramsKeyMap: {
                COLOR: 0,
                BRIGHTNESS: 1,
            },
            class: 'plrun',
            isNotFor: ['plrun'],
            func: function(sprite, script) {
                if (!script.isStart) {
                    var color_type = script.getField('COLOR', script);
                    var color = Entry.plrun.color[color_type];
                    var brightness = script.getNumberValue('BRIGHTNESS', script);

                    brightness = Math.max(Math.min(brightness, 255), 0);

                    var r = parseInt(color[0] * brightness);
                    var g = parseInt(color[1] * brightness);
                    var b = parseInt(color[2] * brightness);
                    r = Math.max(Math.min(r, 255), 0);
                    g = Math.max(Math.min(g, 255), 0);
                    b = Math.max(Math.min(b, 255), 0);

                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue = {
                            GET: {},
                            SET: {},
                        };
                    }

                    Entry.hw.sendQueue['SET'][13] = {
                        type: Entry.plrun.sensorTypes.LED,
                        data: {
                            r: r,
                            g: g,
                            b: b
                        },
                        time: new Date().getTime(),
                    };

                    script.isStart = true;
                    script.timeFlag = 1;

                    setTimeout(function() {
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
        stop_led: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
            ],
            events: {},
            def: {
                params: [],
                type: 'stop_led',
            },
            paramsKeyMap: {
            },
            class: 'plrun',
            isNotFor: ['plrun'],
            func: function(sprite, script) {
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue = {
                        GET: {},
                        SET: {},
                    };
                }

                Entry.hw.sendQueue['SET'][13] = {
                    type: Entry.plrun.sensorTypes.LED,
                    data: {
                        r: 0,
                        g: 0,
                        b: 0
                    },
                    time: new Date().getTime(),
                };
                
                return script.callReturn();
            },
        },
        get_soil: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
            ],
            events: {},
            def: {
                params: [],
                type: 'get_soil',
            },
            paramsKeyMap: {
            },
            class: 'plrun',
            isNotFor: ['plrun'],
            func: function(sprite, script) {
                var ANALOG = Entry.hw.portData.ANALOG;
                return ANALOG ? ANALOG[3] || 0 : 0;
            },
        },
        get_analog: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
            ],
            events: {},
            def: {
                params: [],
                type: 'get_analog',
            },
            paramsKeyMap: {
            },
            class: 'plrun',
            isNotFor: ['plrun'],
            func: function(sprite, script) {
                var ANALOG = Entry.hw.portData.ANALOG;
                return ANALOG ? ANALOG[5] || 0 : 0;
            },
        },
        get_digital: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [1, 11],
                        [2, 12],
                    ],
                    value: 11,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'get_digital',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'plrun',
            isNotFor: ['plrun'],
            func: function(sprite, script) {
                var port = script.getField('PORT', script);
                var DIGITAL = Entry.hw.portData.DIGITAL;
                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                Entry.hw.sendQueue['GET'][Entry.plrun.sensorTypes.DIGITAL] = {
                    port: port,
                    time: new Date().getTime(),
                };
                return DIGITAL ? DIGITAL[port] || 0 : 0;
            },
        },
        set_digital: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [11, 11],
                        [12, 12],
                    ],
                    value: 11,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [[Lang.Blocks.plrun_set_on, 'on'], [Lang.Blocks.plrun_set_off, 'off']],
                    value: 'on',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null, null],
                type: 'set_digital',
            },
            paramsKeyMap: {
                PORT: 0,
                OPERATOR: 1,
            },
            class: 'plrun',
            isNotFor: ['plrun'],
            func: function(sprite, script) {
                var port = script.getField('PORT', script);
                var operator = script.getField('OPERATOR');
                var value = operator == 'on' ? 255 : 0;
                Entry.hw.setDigitalPortValue(port, value);
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.plrun.sensorTypes.DIGITAL,
                    data: value,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
        },
        get_analog_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
            ],
            events: {},
            def: {
                params: [],
                type: 'get_analog_value',
            },
            paramsKeyMap: {
            },
            class: 'plrun',
            isNotFor: ['plrun'],
            func: function(sprite, script) {
                var ANALOG = Entry.hw.portData.ANALOG;
                return ANALOG ? ANALOG[4] || 0 : 0;
            },
        },
        /*
        plrun_set_motor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['M0', 'M0'],
                        ['M1', 'M1'],
                    ],
                    value: 'M0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['앞', 'forward'],
                        ['뒤', 'backward'],
                    ],
                    value: 'forward',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    value: 255,
                    accept: 'number',
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
                params: [null, null, null, null],
                type: 'plrun_set_motor',
            },
            paramsKeyMap: {
                MODE: 0,
                DIRECTION: 1,
                VALUE: 2,
            },
            class: 'plrun',
            isNotFor: ['plrun'],
            func: function(sprite, script) {
                var pin1 = 0;
                var pin2 = 0;
                var mode = script.getField('MODE');
                var direction = script.getField('DIRECTION');
                var value1 = 0;
                var value2 = script.getNumberValue('VALUE');

                if (mode == 'M0') {
                    pin1 = 4;
                    pin2 = 5;
                    value1 = direction == 'forward' ? 0 : 1;
                } else {
                    pin1 = 7;
                    pin2 = 6;
                    value1 = direction == 'forward' ? 1 : 0;
                }

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][pin1] = {
                    type: Entry.plrun.pinTypes.DIGITAL,
                    data: value1,
                    time: new Date().getTime(),
                };
                Entry.hw.sendQueue['SET'][pin2] = {
                    type: Entry.plrun.pinTypes.PWM,
                    data: value2,
                    time: new Date().getTime(),
                };
                return script.callReturn();

                if (!Entry.hw.sendQueue.digitalPinMode) {
                    Entry.hw.sendQueue.digitalPinMode = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
                }
                Entry.hw.sendQueue.digitalPinMode[pin1] = Entry.plrun.pinTypes.DIGITAL;
                Entry.hw.sendQueue.digitalPinMode[pin2] = Entry.plrun.pinTypes.PWM;

                Entry.hw.setDigitalPortValue(pin1, value1);
                Entry.hw.setDigitalPortValue(pin2, value2);
                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        */
    };
};
Entry.plrun.setLanguage = function () {
    return {
        ko: {
            template: {
                set_vibrator: "진동 알림 %1",
                set_fan: "팬을 속도 %1(으)로 회전 시키기",
                set_servor: "서보모터의 각도를 %1도로 정하기",
                set_motor: "DC모터 %1을 %2의 속도로 %3으로 회전하기",
                stop_motor: "DC모터 %1을 정지하기",
                set_move: "로봇을 %1의 속도로 %2 하기",
                stop_move: "로봇 정지하기",
                set_audio_octave: "계명 %1음을 %2옥타브 %3으로 연주하기",
                set_audio_freq: "펄스 %1Hz 음을 %2초 연주하기",
                stop_audio: "%1 만큼 연주쉬기",
                get_ultrasonic: "초음파센서 값 읽기",
                get_joystick: "조이스틱 방향이 %1 인가?",
                get_joystick_button: "조이스틱 버튼이 눌렸는가?",
                get_button: "%1색 버튼이 눌렸는가?",
                set_led: "컬러 LED 켜기- 빨강%1 초록%2 파랑%3",
                set_led_color: "LED %1색을 밝기 %2으로 켜기",
                stop_led: "LED 끄기",
                get_soil: "토양 센서 값 읽기",
                get_analog: "아날로그 값 읽기",
                get_digital: "디지털 %1번 포트가 참인가?",
                set_digital: "디지털 %1 포트에 %2 출력하기",
                get_analog_value: "가변저항 값 읽기",
            }
        },
        en: {
            template: {
                set_vibrator: "Set vibrator %1",
                set_fan: "Rotating fan at %1 speed",
                set_motor: "Turn on motor %1 a %2 at speed of %3",
                stop_motor: "Turn off motor %1",
                set_move: "Moving robot %2 at %1 speed ",
                stop_move: "Stop robot",
                set_servor: "Set servo motor angle to %1 degrees",
                set_audio_octave: "Play note %1 octave %2 beat %3",
                set_audio_freq: "Play note %1Hz beat %3",
                stop_audio: "Rest audio as %3",
                get_ultrasonic: "Get ultrasonic value",
                get_joystick: "Get joystick value",
                get_joystick_button: "Get joystick button pressed",
                get_button: "Get switch %1 preesed",
                set_led: "Turn on LED in red%1 green%2 blue%3",
                set_led_color: "Turn on LED in %1 with %2 brightness",
                stop_led: "Turn off LED",
                get_soil: "Get soil sensor value",
                get_analog: "Read analog %1 value",
                get_digital: "Read digital port %1",
                set_digital: "Write digital port %1 to value %2",
                get_analog_value: "Read variable resistance",
            }
        }
    }
};

module.exports = Entry.plrun;
