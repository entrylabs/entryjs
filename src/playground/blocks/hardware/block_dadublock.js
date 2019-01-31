'use strict';

Entry.DaduBlock = {
    id: 'C.1',
    name: 'dadublock',
    url: 'http://www.dadublock.com/',
    imageName: 'dadublock.png',
    title: {
        ko: '다두블럭',
        en: 'DaduBlock',
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
    BlockState: {},
};

Entry.DaduBlock_Car = {
    id: 'C.2',
    name: 'dadublock_car',
    url: 'http://www.dadublock.com/',
    imageName: 'dadublock_car.png',
    title: {
        ko: '다두블럭 자동차',
        en: 'DaduBlock Car',
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
    BlockState: {},
};
Entry.DaduBlock.blockMenuBlocks = [
    //dadublock 2016-12-19
    'dadublock_get_analog_value',
    'dadublock_get_analog_value_map',
    'dadublock_get_ultrasonic_value',
    'dadublock_get_digital',
    'dadublock_toggle_led',
    'dadublock_digital_pwm',
    'dadublock_set_servo',
    'dadublock_set_tone',
];
Entry.DaduBlock_Car.blockMenuBlocks = [
    //dadublock_car
    'dadublock_car_get_analog_value',
    'dadublock_car_get_analog_value_map',
    'dadublock_car_get_ultrasonic_value',
    'dadublock_car_get_digital',
    'dadublock_car_toggle_led',
    'dadublock_car_digital_pwm',
    'dadublock_car_set_servo',
    'dadublock_car_set_tone',
    'dadublock_car_motor_stop',
    'dadublock_car_motor',
    'dadublock_car_get_irsensor',
];
Entry.DaduBlock.getBlocks = function() {
    return {
        //region dadublock 다두블록
        dadublock_get_analog_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['A0', '0'], ['A1', '1'], ['A2', '2'], ['A3', '3']],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'dadublock_get_analog_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'dadublockget',
            isNotFor: ['dadublock'],
            func: function(sprite, script) {
                var port = script.getField('PORT', script);
                var ANALOG = Entry.hw.portData.ANALOG;
                return ANALOG ? ANALOG[port] || 0 : 0;
            },
        },
        dadublock_get_analog_value_map: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['A0', '0'], ['A1', '1'], ['A2', '2'], ['A3', '3']],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                    null,
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
                type: 'dadublock_get_analog_value_map',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE2: 1,
                VALUE3: 2,
                VALUE4: 3,
                VALUE5: 4,
            },
            class: 'dadublockget',
            isNotFor: ['dadublock'],
            func: function(sprite, script) {
                var port = script.getField('PORT', script);
                var ANALOG = Entry.hw.portData.ANALOG;
                var value2 = script.getNumberValue('VALUE2', script);
                var value3 = script.getNumberValue('VALUE3', script);
                var value4 = script.getNumberValue('VALUE4', script);
                var value5 = script.getNumberValue('VALUE5', script);

                var result = ANALOG[port] || 0;
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

                return result;
            },
        },
        dadublock_get_ultrasonic_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['7', '7'],
                        ['8', '8'],
                        ['14', '14'],
                        ['15', '15'],
                        ['16', '16'],
                        ['~5', '5'],
                        ['~6', '6'],
                        ['~9', '9'],
                        ['~10', '10'],
                    ],
                    value: '2',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['7', '7'],
                        ['8', '8'],
                        ['14', '14'],
                        ['15', '15'],
                        ['16', '16'],
                        ['~5', '5'],
                        ['~6', '6'],
                        ['~9', '9'],
                        ['~10', '10'],
                    ],
                    value: '3',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: ['2', '3'],
                type: 'dadublock_get_ultrasonic_value',
            },
            paramsKeyMap: {
                PORT1: 0,
                PORT2: 1,
            },
            class: 'dadublockget',
            isNotFor: ['dadublock'],
            func: function(sprite, script) {
                var port1 = script.getField('PORT1', script);
                var port2 = script.getField('PORT2', script);
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                delete Entry.hw.sendQueue['SET'][port1];
                delete Entry.hw.sendQueue['SET'][port2];

                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                Entry.hw.sendQueue['GET'][Entry.DaduBlock.sensorTypes.ULTRASONIC] = {
                    port: [port1, port2],
                    time: new Date().getTime(),
                };
                return Entry.hw.portData.ULTRASONIC || 0;
            },
        },
        dadublock_get_digital: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['7', '7'],
                        ['8', '8'],
                        ['14', '14'],
                        ['15', '15'],
                        ['16', '16'],
                        ['~5', '5'],
                        ['~6', '6'],
                        ['~9', '9'],
                        ['~10', '10'],
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
                type: 'dadublock_get_digital',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'dadublockget',
            isNotFor: ['dadublock'],
            func: function(sprite, script) {
                //var port = script.getNumberValue("PORT", script);
                var port = script.getField('PORT', script);
                var DIGITAL = Entry.hw.portData.DIGITAL;
                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                Entry.hw.sendQueue['GET'][Entry.DaduBlock.sensorTypes.DIGITAL] = {
                    port: port,
                    time: new Date().getTime(),
                };
                return DIGITAL ? DIGITAL[port] || 0 : 0;
            },
        },
        dadublock_toggle_led: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['7', '7'],
                        ['8', '8'],
                        ['14', '14'],
                        ['15', '15'],
                        ['16', '16'],
                        ['~5', '5'],
                        ['~6', '6'],
                        ['~9', '9'],
                        ['~10', '10'],
                    ],
                    value: '2',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [['켜기', 'on'], ['끄기', 'off']],
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
                params: [null, null, null],
                type: 'dadublock_toggle_led',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'dadublockset',
            isNotFor: ['dadublock'],
            func: function(sprite, script) {
                //var port = script.getNumberValue("PORT");
                var port = script.getField('PORT');
                var value = script.getField('VALUE');
                if (value == 'on') {
                    value = 255;
                } else {
                    value = 0;
                }
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.DaduBlock.sensorTypes.DIGITAL,
                    data: value,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
        },
        dadublock_digital_pwm: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['~5', '5'], ['~6', '6'], ['~9', '9'], ['~10', '10']],
                    value: '5',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                    null,
                    {
                        type: 'text',
                        params: ['255'],
                    },
                    null,
                ],
                type: 'dadublock_digital_pwm',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'dadublockset',
            isNotFor: ['dadublock'],
            func: function(sprite, script) {
                //var port = script.getNumberValue("PORT");
                var port = script.getField('PORT');
                var value = script.getNumberValue('VALUE');
                value = Math.round(value);
                value = Math.max(value, 0);
                value = Math.min(value, 255);
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.DaduBlock.sensorTypes.PWM,
                    data: value,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: { js: [], py: ['Arduino.analogWrite(%1, %2)'] },
        },
        dadublock_set_servo: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['7', '7'],
                        ['8', '8'],
                        ['14', '14'],
                        ['15', '15'],
                        ['16', '16'],
                        ['~5', '5'],
                        ['~6', '6'],
                        ['~9', '9'],
                        ['~10', '10'],
                    ],
                    value: '2',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                params: [null, null],
                type: 'dadublock_set_servo',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'dadublockset',
            isNotFor: ['dadublock'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                //var port = script.getNumberValue("PORT", script);
                var port = script.getField('PORT', script);
                var value = script.getNumberValue('VALUE', script);
                value = Math.min(180, value);
                value = Math.max(0, value);

                if (!sq['SET']) {
                    sq['SET'] = {};
                }
                sq['SET'][port] = {
                    type: Entry.DaduBlock.sensorTypes.SERVO_PIN,
                    data: value,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: { js: [], py: ['Arduino.servomotorWrite(%1, %2)'] },
        },
        dadublock_set_tone: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['7', '7'],
                        ['8', '8'],
                        ['14', '14'],
                        ['15', '15'],
                        ['16', '16'],
                        ['~5', '5'],
                        ['~6', '6'],
                        ['~9', '9'],
                        ['~10', '10'],
                    ],
                    value: '2',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['무음', '0'],
                        ['도', '1'],
                        ['도#(레♭)', '2'],
                        ['레', '3'],
                        ['레#(미♭)', '4'],
                        ['미', '5'],
                        ['파', '6'],
                        ['파#(솔♭)', '7'],
                        ['솔', '8'],
                        ['솔#(라♭)', '9'],
                        ['라', '10'],
                        ['라#(시♭)', '11'],
                        ['시', '12'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['1', '0'],
                        ['2', '1'],
                        ['3', '2'],
                        ['4', '3'],
                        ['5', '4'],
                        ['6', '5'],
                    ],
                    value: '3',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                    null,
                    null,
                    null,
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'dadublock_set_tone',
            },
            paramsKeyMap: {
                PORT: 0,
                NOTE: 1,
                OCTAVE: 2,
                DURATION: 3,
            },
            class: 'dadublockset',
            isNotFor: ['dadublock'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                //var port = script.getNumberValue("PORT", script);
                var port = script.getField('PORT', script);

                if (!script.isStart) {
                    var note = script.getNumberField('NOTE', script);
                    var duration = script.getNumberValue('DURATION', script);

                    if (duration < 0) {
                        duration = 0;
                    }

                    if (note === 0 || duration === 0) {
                        sq['SET'][port] = {
                            type: Entry.DaduBlock.sensorTypes.TONE,
                            data: 0,
                            time: new Date().getTime(),
                        };
                        return script.callReturn();
                    }

                    var octave = script.getNumberField('OCTAVE', script);
                    var value = Entry.DaduBlock.toneMap[note][octave];

                    duration = duration * 1000;
                    script.isStart = true;
                    script.timeFlag = 1;

                    if (!sq['SET']) {
                        sq['SET'] = {};
                    }

                    sq['SET'][port] = {
                        type: Entry.DaduBlock.sensorTypes.TONE,
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
                        type: Entry.DaduBlock.sensorTypes.TONE,
                        data: 0,
                        time: new Date().getTime(),
                    };
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
        },
        dadublock_car_get_analog_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['A0', '0'], ['A1', '1'], ['A2', '2'], ['A3', '3']],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'dadublock_car_get_analog_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'dadublock_car_get',
            isNotFor: ['dadublock_car'],
            func: function(sprite, script) {
                var port = script.getField('PORT', script);
                var ANALOG = Entry.hw.portData.ANALOG;
                return ANALOG ? ANALOG[port] || 0 : 0;
            },
        },
        dadublock_car_get_analog_value_map: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['A0', '0'], ['A1', '1'], ['A2', '2'], ['A3', '3']],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                    null,
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
                type: 'dadublock_car_get_analog_value_map',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE2: 1,
                VALUE3: 2,
                VALUE4: 3,
                VALUE5: 4,
            },
            class: 'dadublock_car_get',
            isNotFor: ['dadublock_car'],
            func: function(sprite, script) {
                var port = script.getField('PORT', script);
                var ANALOG = Entry.hw.portData.ANALOG;
                var value2 = script.getNumberValue('VALUE2', script);
                var value3 = script.getNumberValue('VALUE3', script);
                var value4 = script.getNumberValue('VALUE4', script);
                var value5 = script.getNumberValue('VALUE5', script);

                var result = ANALOG[port] || 0;
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

                return result;
            },
        },
        dadublock_car_get_ultrasonic_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['7', '7'],
                        ['8', '8'],
                        ['14', '14'],
                        ['15', '15'],
                        ['16', '16'],
                        ['~5', '5'],
                        ['~6', '6'],
                        ['~9', '9'],
                        ['~10', '10'],
                    ],
                    value: '2',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['7', '7'],
                        ['8', '8'],
                        ['14', '14'],
                        ['15', '15'],
                        ['16', '16'],
                        ['~5', '5'],
                        ['~6', '6'],
                        ['~9', '9'],
                        ['~10', '10'],
                    ],
                    value: '3',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: ['2', '3'],
                type: 'dadublock_car_get_ultrasonic_value',
            },
            paramsKeyMap: {
                PORT1: 0,
                PORT2: 1,
            },
            class: 'dadublock_car_get',
            isNotFor: ['dadublock_car'],
            func: function(sprite, script) {
                var port1 = script.getField('PORT1', script);
                var port2 = script.getField('PORT2', script);
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                delete Entry.hw.sendQueue['SET'][port1];
                delete Entry.hw.sendQueue['SET'][port2];

                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                Entry.hw.sendQueue['GET'][Entry.DaduBlock.sensorTypes.ULTRASONIC] = {
                    port: [port1, port2],
                    time: new Date().getTime(),
                };
                return Entry.hw.portData.ULTRASONIC || 0;
            },
        },
        dadublock_car_get_digital: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['7', '7'],
                        ['8', '8'],
                        ['14', '14'],
                        ['15', '15'],
                        ['16', '16'],
                        ['~5', '5'],
                        ['~6', '6'],
                        ['~9', '9'],
                        ['~10', '10'],
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
                type: 'dadublock_car_get_digital',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'dadublock_car_get',
            isNotFor: ['dadublock_car'],
            func: function(sprite, script) {
                //var port = script.getNumberValue("PORT", script);
                var port = script.getField('PORT', script);
                var DIGITAL = Entry.hw.portData.DIGITAL;
                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                Entry.hw.sendQueue['GET'][Entry.DaduBlock.sensorTypes.DIGITAL] = {
                    port: port,
                    time: new Date().getTime(),
                };
                return DIGITAL ? DIGITAL[port] || 0 : 0;
            },
        },
        dadublock_car_toggle_led: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['7', '7'],
                        ['8', '8'],
                        ['14', '14'],
                        ['15', '15'],
                        ['16', '16'],
                        ['~5', '5'],
                        ['~6', '6'],
                        ['~9', '9'],
                        ['~10', '10'],
                    ],
                    value: '2',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [['켜기', 'on'], ['끄기', 'off']],
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
                params: [null, null, null],
                type: 'dadublock_car_toggle_led',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'dadublock_car_set',
            isNotFor: ['dadublock_car'],
            func: function(sprite, script) {
                //var port = script.getNumberValue("PORT");
                var port = script.getField('PORT');
                var value = script.getField('VALUE');
                if (value == 'on') {
                    value = 255;
                } else {
                    value = 0;
                }
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.DaduBlock.sensorTypes.DIGITAL,
                    data: value,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
        },
        dadublock_car_digital_pwm: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['~5', '5'], ['~6', '6'], ['~9', '9'], ['~10', '10']],
                    value: '5',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                    null,
                    {
                        type: 'text',
                        params: ['255'],
                    },
                    null,
                ],
                type: 'dadublock_car_digital_pwm',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'dadublock_car_set',
            isNotFor: ['dadublock_car'],
            func: function(sprite, script) {
                //var port = script.getNumberValue("PORT");
                var port = script.getField('PORT');
                var value = script.getNumberValue('VALUE');
                value = Math.round(value);
                value = Math.max(value, 0);
                value = Math.min(value, 255);
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.DaduBlock.sensorTypes.PWM,
                    data: value,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: { js: [], py: ['Arduino.analogWrite(%1, %2)'] },
        },
        dadublock_car_set_servo: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['7', '7'],
                        ['8', '8'],
                        ['14', '14'],
                        ['15', '15'],
                        ['16', '16'],
                        ['~5', '5'],
                        ['~6', '6'],
                        ['~9', '9'],
                        ['~10', '10'],
                    ],
                    value: '2',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                params: [null, null],
                type: 'dadublock_car_set_servo',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'dadublock_car_set',
            isNotFor: ['dadublock_car'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                //var port = script.getNumberValue("PORT", script);
                var port = script.getField('PORT', script);
                var value = script.getNumberValue('VALUE', script);
                value = Math.min(180, value);
                value = Math.max(0, value);

                if (!sq['SET']) {
                    sq['SET'] = {};
                }
                sq['SET'][port] = {
                    type: Entry.DaduBlock.sensorTypes.SERVO_PIN,
                    data: value,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: { js: [], py: ['Arduino.servomotorWrite(%1, %2)'] },
        },
        dadublock_car_set_tone: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['7', '7'],
                        ['8', '8'],
                        ['14', '14'],
                        ['15', '15'],
                        ['16', '16'],
                        ['~5', '5'],
                        ['~6', '6'],
                        ['~9', '9'],
                        ['~10', '10'],
                    ],
                    value: '2',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['무음', '0'],
                        ['도', '1'],
                        ['도#(레♭)', '2'],
                        ['레', '3'],
                        ['레#(미♭)', '4'],
                        ['미', '5'],
                        ['파', '6'],
                        ['파#(솔♭)', '7'],
                        ['솔', '8'],
                        ['솔#(라♭)', '9'],
                        ['라', '10'],
                        ['라#(시♭)', '11'],
                        ['시', '12'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['1', '0'],
                        ['2', '1'],
                        ['3', '2'],
                        ['4', '3'],
                        ['5', '4'],
                        ['6', '5'],
                    ],
                    value: '3',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                    null,
                    null,
                    null,
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'dadublock_car_set_tone',
            },
            paramsKeyMap: {
                PORT: 0,
                NOTE: 1,
                OCTAVE: 2,
                DURATION: 3,
            },
            class: 'dadublock_car_set',
            isNotFor: ['dadublock_car'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                //var port = script.getNumberValue("PORT", script);
                var port = script.getField('PORT', script);

                if (!script.isStart) {
                    var note = script.getNumberField('NOTE', script);
                    var duration = script.getNumberValue('DURATION', script);

                    if (duration < 0) {
                        duration = 0;
                    }

                    if (note === 0 || duration === 0) {
                        sq['SET'][port] = {
                            type: Entry.DaduBlock.sensorTypes.TONE,
                            data: 0,
                            time: new Date().getTime(),
                        };
                        return script.callReturn();
                    }

                    var octave = script.getNumberField('OCTAVE', script);
                    var value = Entry.DaduBlock.toneMap[note][octave];

                    duration = duration * 1000;
                    script.isStart = true;
                    script.timeFlag = 1;

                    if (!sq['SET']) {
                        sq['SET'] = {};
                    }

                    sq['SET'][port] = {
                        type: Entry.DaduBlock.sensorTypes.TONE,
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
                        type: Entry.DaduBlock.sensorTypes.TONE,
                        data: 0,
                        time: new Date().getTime(),
                    };
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
        },
        dadublock_car_motor_stop: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['~5,~6', '1'], ['~9,~10', '2']],
                    value: '1',
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
                type: 'dadublock_car_motor_stop',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'dadublock_car_motor',
            isNotFor: ['dadublock_car'],
            func: function(sprite, script) {
                var port = script.getField('PORT');
                if (port == 1) {
                    //~5,~6번을 선택했을때
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
                    Entry.hw.sendQueue['SET'][5] = {
                        type: Entry.DaduBlock.sensorTypes.PWM,
                        data: 0,
                        time: new Date().getTime(),
                    };

                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
                    Entry.hw.sendQueue['SET'][6] = {
                        type: Entry.DaduBlock.sensorTypes.PWM,
                        data: 0,
                        time: new Date().getTime(),
                    };
                    return script.callReturn();
                } else if (port == 2) {
                    //~9,~10번을 선택했을때
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
                    Entry.hw.sendQueue['SET'][9] = {
                        type: Entry.DaduBlock.sensorTypes.PWM,
                        data: 0,
                        time: new Date().getTime(),
                    };

                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
                    Entry.hw.sendQueue['SET'][10] = {
                        type: Entry.DaduBlock.sensorTypes.PWM,
                        data: 0,
                        time: new Date().getTime(),
                    };
                    return script.callReturn();
                }
            },
        },
        dadublock_car_motor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['~5,~6', '1'], ['~9,~10', '2']],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [['정방향', '1'], ['역방향', '2']],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                    null,
                    null,
                    {
                        type: 'text',
                        params: ['50'], // %로 바꿈 0~100% 모터 속도
                    },
                    null,
                ],
                type: 'dadublock_car_motor',
            },
            paramsKeyMap: {
                PORT: 0,
                DIRECTION: 1,
                VALUE: 2,
            },
            class: 'dadublock_car_motor',
            isNotFor: ['dadublock_car'],
            func: function(sprite, script) {
                var port = script.getField('PORT');
                var direction = script.getField('DIRECTION');
                var value = script.getNumberValue('VALUE');
                value = Math.round(value);
                value = Math.max(value, 0);
                value = Math.min(value, 100);
                value = value * 1.5; //최대값을 150으로 제한
                if (port == 1) {
                    //~5,~6번을 선택했을때
                    if (direction == 1) {
                        if (!Entry.hw.sendQueue['SET']) {
                            Entry.hw.sendQueue['SET'] = {};
                        }
                        Entry.hw.sendQueue['SET'][5] = {
                            type: Entry.DaduBlock.sensorTypes.PWM,
                            data: value,
                            time: new Date().getTime(),
                        };

                        if (!Entry.hw.sendQueue['SET']) {
                            Entry.hw.sendQueue['SET'] = {};
                        }
                        Entry.hw.sendQueue['SET'][6] = {
                            type: Entry.DaduBlock.sensorTypes.PWM,
                            data: 0,
                            time: new Date().getTime(),
                        };
                        return script.callReturn();
                    } else if (direction == 2) {
                        if (!Entry.hw.sendQueue['SET']) {
                            Entry.hw.sendQueue['SET'] = {};
                        }
                        Entry.hw.sendQueue['SET'][5] = {
                            type: Entry.DaduBlock.sensorTypes.PWM,
                            data: 0,
                            time: new Date().getTime(),
                        };

                        if (!Entry.hw.sendQueue['SET']) {
                            Entry.hw.sendQueue['SET'] = {};
                        }
                        Entry.hw.sendQueue['SET'][6] = {
                            type: Entry.DaduBlock.sensorTypes.PWM,
                            data: value,
                            time: new Date().getTime(),
                        };
                        return script.callReturn();
                    }
                } else if (port == 2) {
                    //~9,~10번을 선택했을때
                    if (direction == 1) {
                        if (!Entry.hw.sendQueue['SET']) {
                            Entry.hw.sendQueue['SET'] = {};
                        }
                        Entry.hw.sendQueue['SET'][9] = {
                            type: Entry.DaduBlock.sensorTypes.PWM,
                            data: value,
                            time: new Date().getTime(),
                        };

                        if (!Entry.hw.sendQueue['SET']) {
                            Entry.hw.sendQueue['SET'] = {};
                        }
                        Entry.hw.sendQueue['SET'][10] = {
                            type: Entry.DaduBlock.sensorTypes.PWM,
                            data: 0,
                            time: new Date().getTime(),
                        };
                        return script.callReturn();
                    } else if (direction == 2) {
                        if (!Entry.hw.sendQueue['SET']) {
                            Entry.hw.sendQueue['SET'] = {};
                        }
                        Entry.hw.sendQueue['SET'][9] = {
                            type: Entry.DaduBlock.sensorTypes.PWM,
                            data: 0,
                            time: new Date().getTime(),
                        };

                        if (!Entry.hw.sendQueue['SET']) {
                            Entry.hw.sendQueue['SET'] = {};
                        }
                        Entry.hw.sendQueue['SET'][10] = {
                            type: Entry.DaduBlock.sensorTypes.PWM,
                            data: value,
                            time: new Date().getTime(),
                        };
                        return script.callReturn();
                    }
                }
            },
        },
        dadublock_car_get_irsensor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['7', '7'],
                        ['8', '8'],
                        ['14', '14'],
                        ['15', '15'],
                        ['16', '16'],
                        ['~5', '5'],
                        ['~6', '6'],
                        ['~9', '9'],
                        ['~10', '10'],
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
                type: 'dadublock_car_get_irsensor',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'dadublock_car_motor',
            isNotFor: ['dadublock_car'],
            func: function(sprite, script) {
                //var port = script.getNumberValue("PORT", script);
                var port = script.getField('PORT', script);
                var DIGITAL = Entry.hw.portData.DIGITAL;
                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                Entry.hw.sendQueue['GET'][Entry.DaduBlock.sensorTypes.DIGITAL] = {
                    port: port,
                    time: new Date().getTime(),
                };
                return DIGITAL ? DIGITAL[port] || 0 : 0;
            },
        },
        //endregion dadublock 다두블록
    };
};

module.exports = [Entry.DaduBlock, Entry.DaduBlock_Car];
