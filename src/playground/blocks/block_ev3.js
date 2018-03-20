'use strict';

Entry.EV3 = {
    PORT_MAP: {
        A: 0,
        B: 0,
        C: 0,
        D: 0,
        '1': undefined,
        '2': undefined,
        '3': undefined,
        '4': undefined,
    },
    motorMovementTypes: {
        Degrees: 0,
        Power: 1,
    },
    deviceTypes: {
        NxtTouch: 1,
        NxtLight: 2,
        NxtSound: 3,
        NxtColor: 4,
        NxtUltrasonic: 5,
        NxtTemperature: 6,
        LMotor: 7,
        MMotor: 8,
        Touch: 16,
        Color: 29,
        Ultrasonic: 30,
        Gyroscope: 32,
        Infrared: 33,
        Initializing: 0x7d,
        Empty: 0x7e,
        WrongPort: 0x7f,
        Unknown: 0xff,
    },
    colorSensorValue: [
        '',
        '000000',
        '0000FF',
        '00FF00',
        'FFFF00',
        'FF0000',
        'FFFFFF',
        'A52A2A',
    ],
    timeouts: [],
    removeTimeout: function(id) {
        clearTimeout(id);
        var timeouts = this.timeouts;
        var index = timeouts.indexOf(id);
        if (index >= 0) {
            timeouts.splice(index, 1);
        }
    },
    removeAllTimeouts: function() {
        var timeouts = this.timeouts;
        for (var i in timeouts) {
            clearTimeout(timeouts[i]);
        }
        this.timeouts = [];
    },
    setZero: function() {
        var portMap = this.PORT_MAP;
        Object.keys(portMap).forEach(function(port) {
            var regex = /[A-D]/i;
            if (regex.test(port)) {
                Entry.hw.sendQueue[port] = {
                    type: Entry.EV3.motorMovementTypes.Power,
                    power: 0,
                };
            } else {
                Entry.hw.sendQueue[port] = portMap[port];
            }
        });
        Entry.hw.update();
    },
    name: 'EV3',
    url: 'http://www.lego.com/ko-kr/mindstorms/about-ev3',
    imageName: 'ev3.png',
};

Entry.EV3.getBlocks = function() {
    return {
        //region ev3 이브이3
        ev3_color_sensor: {
            color: '#00979D',
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['1', '1'], ['2', '2'], ['3', '3'], ['4', '4']],
                    value: '1',
                    fontSize: 11,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['RGB', 'RGB'],
                        ['R', 'R'],
                        ['G', 'G'],
                        ['B', 'B'],
                    ],
                    value: 'RGB',
                    fontSize: 11,
                },
            ],
            events: {},
            def: {
                params: [null, null],
                type: 'ev3_color_sensor',
            },
            paramsKeyMap: {
                PORT: 0,
                RGB: 1,
            },
            class: 'ev3_sensor',
            isNotFor: ['EV3'],
            func: function(sprite, script) {
                var port = script.getStringField('PORT', script);
                var rgb = script.getStringField('RGB', script);
                var portData = Entry.hw.getDigitalPortValue(
                    script.getNumberField('PORT', script)
                );
                var result = '';
                if (portData.type == Entry.EV3.deviceTypes.Color) {
                    if (portData.siValue == 0) {
                        result = '';
                    } else {
                        switch (rgb) {
                            case 'RGB':
                                result =
                                    Entry.EV3.colorSensorValue[
                                        portData.siValue
                                    ];
                                break;
                            case 'R':
                                result = Entry.EV3.colorSensorValue[
                                    portData.siValue
                                ].substring(0, 2);
                                break;
                            case 'G':
                                result = Entry.EV3.colorSensorValue[
                                    portData.siValue
                                ].substring(2, 4);
                                break;
                            case 'B':
                                result = Entry.EV3.colorSensorValue[
                                    portData.siValue
                                ].substring(4, 6);
                                break;
                        }
                    }
                } else {
                    result = '컬러 센서 아님';
                }
                return result;
            },
        },
        ev3_get_sensor_value: {
            color: '#00979D',
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['1', '1'], ['2', '2'], ['3', '3'], ['4', '4']],
                    value: '1',
                    fontSize: 11,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'ev3_get_sensor_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'ev3_sensor',
            isNotFor: ['EV3'],
            func: function(sprite, script) {
                var port = script.getStringField('PORT', script);
                var portData = Entry.hw.getDigitalPortValue(
                    script.getNumberField('PORT', script)
                );
                var result;
                if ($.isPlainObject(portData)) {
                    result = portData.siValue || 0;
                }
                return result;
            },
        },
        ev3_motor_degrees: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['A', 'A'], ['B', 'B'], ['C', 'C'], ['D', 'D']],
                    value: 'A',
                    fontSize: 11,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ev3_cw, 'CW'],
                        [Lang.Blocks.ev3_ccw, 'CCW'],
                    ],
                    value: 'CW',
                    fontSize: 11,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    null,
                    {
                        type: 'angle',
                    },
                ],
                type: 'ev3_motor_degrees',
            },
            paramsKeyMap: {
                PORT: 0,
                DIRECTION: 1,
                DEGREE: 2,
            },
            class: 'ev3_output',
            isNotFor: ['EV3'],
            func: function(sprite, script) {
                var port = script.getStringField('PORT', script);
                var degree = script.getValue('DEGREE', script);
                if (degree <= 0) {
                    degree = 0;
                } else if (degree >= 720) {
                    degree = 720;
                }
                var direction = script.getStringField('DIRECTION', script);
                Entry.hw.sendQueue[port] = {
                    id: Math.floor(Math.random() * 100000, 0),
                    type: Entry.EV3.motorMovementTypes.Degrees,
                    degree: degree,
                    power: direction == 'CW' ? 50 : -50,
                };
                return script.callReturn();
            },
        },
        ev3_motor_power: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['A', 'A'], ['B', 'B'], ['C', 'C'], ['D', 'D']],
                    value: 'A',
                    fontSize: 11,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    {
                        type: 'number',
                        params: ['50'],
                    },
                ],
                type: 'ev3_motor_power',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'ev3_output',
            isNotFor: ['EV3'],
            func: function(sprite, script) {
                var port = script.getStringField('PORT', script);
                var value = script.getValue('VALUE', script);
                Entry.hw.sendQueue[port] = {
                    id: Math.floor(Math.random() * 100000, 0),
                    type: Entry.EV3.motorMovementTypes.Power,
                    power: value,
                };
                return script.callReturn();
            },
        },
        ev3_motor_power_on_time: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['A', 'A'], ['B', 'B'], ['C', 'C'], ['D', 'D']],
                    value: 'A',
                    fontSize: 11,
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
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    {
                        type: 'number',
                        params: ['2'],
                    },
                    {
                        type: 'number',
                        params: ['50'],
                    },
                ],
                type: 'ev3_motor_power_on_time',
            },
            paramsKeyMap: {
                PORT: 0,
                TIME: 1,
                VALUE: 2,
            },
            class: 'ev3_output',
            isNotFor: ['EV3'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var port = script.getStringField('PORT', script);
                if (!script.isStart) {
                    var time = script.getValue('TIME', script);
                    var value = script.getValue('VALUE', script);
                    script.isStart = true;
                    script.timeFlag = 1;
                    Entry.hw.sendQueue[port] = {
                        id: Math.floor(Math.random() * 100000, 0),
                        type: Entry.EV3.motorMovementTypes.Power,
                        power: value,
                    };
                    var timeValue = time * 1000;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.EV3.removeTimeout(timer);
                    }, timeValue);
                    Entry.EV3.timeouts.push(timer);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    Entry.engine.isContinue = false;
                    Entry.hw.sendQueue[port] = {
                        id: Math.floor(Math.random() * 100000, 0),
                        type: Entry.EV3.motorMovementTypes.Power,
                        power: 0,
                    };
                    return script.callReturn();
                }
            },
        },
        ev3_touch_sensor: {
            color: '#00979D',
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['1', '1'], ['2', '2'], ['3', '3'], ['4', '4']],
                    value: '1',
                    fontSize: 11,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'ev3_touch_sensor',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'ev3_sensor',
            isNotFor: ['EV3'],
            func: function(sprite, script) {
                var port = script.getStringField('PORT', script);
                var portData = Entry.hw.getDigitalPortValue(
                    script.getNumberField('PORT', script)
                );
                var result = false;
                if (portData.type == Entry.EV3.deviceTypes.Touch) {
                    if (Number(portData.siValue) >= 1) {
                        result = true;
                    }
                }

                return result;
            },
        },
        //endregion ev3 이브이3
    };
};
