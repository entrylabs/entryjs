'use strict';

Entry.AsomeBoard = {
    id: ['FF.FF', '1A.1'],
    name: 'AsomeBoard',
    url: 'http://www.arduino.cc/',
    imageName: 'AsomeBoard.png',
    title: {
        ko: 'AsomeBoard',
        en: 'AsomeBoard',
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
    getHashKey: function() {
        let key = new Date().getSeconds().toString(16);
        if (key.length === 1) {
            key += ((Math.random() * 16) | 0).toString(16);
        }
        return Entry.generateHash() + key;
    },
    asyncFlowControl: function({ script, data }, scope) {
        if (!this.isExecBlock && !scope.isStart) {
            const blockId = this.getHashKey();
            this.isExecBlock = true;
            scope.isStart = true;
            scope.timeFlag = 1;
            this.nowBlockId = blockId;
            this.blockIds[blockId] = false;
            _merge(Entry.hw.sendQueue, {
                [blockId]: data,
            });
            Entry.hw.update();
            setTimeout(() => {
                scope.timeFlag = 0;
            });
            return false;
        } else if (this.blockIds[this.nowBlockId] && scope.timeFlag === 0) {
            delete this.blockIds[this.nowBlockId];
            delete scope.isStart;
            this.execTimeFlag = 0;
            this.execTimeFlag = undefined;
            this.isExecBlock = false;
            Entry.engine.isContinue = false;
            return true;
        }
        return false;
    },
    postCallReturn: function(args) {
        const { script } = args;
        if (!this.asyncFlowControl(args, script)) {
            return Entry.STATIC.BREAK;
        }
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

Entry.AsomeBoard.setLanguage = function() {
    return {
        ko: {
            template: {
                asomeboard_get_analog_value: 'Analog %1 번 센서값',
                asomeboard_get_analog_value_map: '%1 의 범위를 %2 ~ %3 에서 %4 ~ %5 로 바꾼값',
                asomeboard_get_ultrasonic_value: '울트라소닉 Trig %1 Echo %2 센서값',
                asomeboard_toggle_led: '디지털 %1 번 핀 %2 %3',
                asomeboard_digital_pwm: '디지털 %1 번 핀을 %2 (으)로 정하기 %3',
                asomeboard_set_tone: '디지털 %1 번 핀의 버저를 %2 %3 음으로 %4 초 연주하기 %5',
                asomeboard_set_servo: '디지털 %1 번 핀의 서보모터를 %2 의 각도로 정하기 %3',
                asomeboard_get_digital: '디지털 %1 번 센서값',
            },
        },
        en: {
            template: {
                asomeboard_get_analog_value: 'Analog %1 Sensor value',
                asomeboard_get_analog_value_map: 'Map Value %1 %2 ~ %3 to %4 ~ %5',
                asomeboard_get_ultrasonic_value: 'Read ultrasonic sensor trig pin %1 echo pin %2',
                asomeboard_toggle_led: 'Digital %1 Pin %2 %3',
                asomeboard_digital_pwm: 'Digital %1 Pin %2 %3',
                asomeboard_set_tone: 'Play tone pin %1 on note %2 octave %3 beat %4 %5',
                asomeboard_set_servo: 'Set servo pin %1 angle as %2 %3',
                asomeboard_get_digital: 'Digital %1 Sensor value',
            },
        },
    };
};

Entry.AsomeBoard.blockMenuBlocks = [
    // 'asomeboard_get_analog_value_map',
    // 'asomeboard_get_ultrasonic_value',
    // 'asomeboard_get_digital',
    'asomeboard_toggle_led',
    // 'asomeboard_digital_pwm',
    // 'asomeboard_set_servo',
    // 'asomeboard_set_tone',
];

Entry.AsomeBoard.getBlocks = function() {
    return {
        //region AsomeBoard 아두이노 나노
        asomeboard_analog_list: {
            parent: 'arduino_ext_analog_list',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['A0', '0'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            syntax: undefined,
        },
        asomeboard_get_analog_value: {
            parent: 'arduino_ext_get_analog_value',
            template: Lang.template.arduino_ext_get_analog_value,
            def: {
                params: [
                    {
                        type: 'asomeboard_analog_list',
                    },
                ],
                type: 'asomeboard_get_analog_value',
            },
            // isNotFor: ['AsomeBoard'],
            syntax: undefined,
        },
        asomeboard_get_analog_value_map: {
            parent: 'arduino_ext_get_analog_value_map',
            template: Lang.template.arduino_ext_get_analog_value_map,
            def: {
                params: [
                    {
                        type: 'asomeboard_get_analog_value',
                        params: [
                            {
                                type: 'asomeboard_analog_list',
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
                type: 'asomeboard_get_analog_value_map',
            },
            isNotFor: ['AsomeBoard'],
            syntax: undefined,
        },
        asomeboard_get_ultrasonic_value: {
            template: Lang.template.arduino_ext_get_ultrasonic_value,
            parent: 'arduino_ext_get_ultrasonic_value',
            def: {
                params: [
                    {
                        type: 'arduino_get_port_number',
                        params: ['4'],
                    },
                    {
                        type: 'arduino_get_port_number',
                        params: ['3'],
                    },
                ],
                type: 'asomeboard_get_ultrasonic_value',
            },
            isNotFor: ['AsomeBoard'],
            syntax: undefined,
        },
        asomeboard_get_digital: {
            template: Lang.template.arduino_ext_get_digital,
            parent: 'arduino_ext_get_digital',
            def: {
                params: [
                    {
                        type: 'arduino_get_port_number',
                    },
                ],
                type: 'asomeboard_get_digital',
            },
            isNotFor: ['AsomeBoard'],
            syntax: undefined,
        },
        asomeboard_toggle_led: {
            template: Lang.template.arduino_ext_toggle_led,
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
                    },
                    {
                        type: 'arduino_get_digital_toggle',
                        params: ['on'],
                    },
                    null,
                ],
                type: 'asomeboard_toggle_led',
            },
            isNotFor: ['AsomeBoard'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var value = script.getValue('VALUE');

                if (typeof value === 'string') {
                    value = value.toLowerCase();
                }
                if (Entry.ArduinoExt.highList.indexOf(value) > -1) {
                    value = 255;
                } else if (Entry.ArduinoExt.lowList.indexOf(value) > -1) {
                    value = 0;
                } else {
                    throw new Error();
                }
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.ArduinoExt.sensorTypes.DIGITAL,
                    data: value,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: undefined,
        },
        asomeboard_digital_pwm: {
            template: Lang.template.arduino_ext_digital_pwm,
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
                type: 'asomeboard_digital_pwm',
            },
            isNotFor: ['AsomeBoard'],
            syntax: undefined,
        },
        asomeboard_set_tone: {
            template: Lang.template.arduino_ext_set_tone,
            parent: 'arduino_ext_set_tone',
            def: {
                params: [
                    {
                        type: 'arduino_get_port_number',
                        value: 4,
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
                type: 'asomeboard_set_tone',
            },
            isNotFor: ['AsomeBoard'],
            syntax: undefined,
        },
        asomeboard_set_servo: {
            template: Lang.template.arduino_ext_set_servo,
            parent: 'arduino_ext_set_servo',
            def: {
                params: [
                    {
                        type: 'arduino_get_port_number',
                    },
                    null,
                ],
                type: 'asomeboard_set_servo',
            },
            isNotFor: ['AsomeBoard'],
            syntax: undefined,
        },
        //endregion AsomeBoard 아두이노 나노
    };
};

module.exports = Entry.AsomeBoard;
