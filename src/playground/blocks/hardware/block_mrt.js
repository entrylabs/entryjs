'use strict';

Entry.MRT = {
    id: '23.1',
    name: 'MRT-X',
    url: 'http://www.myrobottime.com/',
    imageName: 'mrt.png',
    title: {
        ko: 'MRT-X',
        en: 'MRT-X',
    },
    PORT_MAP: {
        RIGHT_WHEEL1: 0,
        LEFT_WHEEL1: 0,
        RIGHT_WHEEL2: 0,
        LEFT_WHEEL2: 0,
        OUT1: 90,
        OUT2: 90,
        OUT3: 90,
        analogD5: 127, //D4
        analogD6: 127, //D5
        OUT4: 0,
        OUT5: 0,
        LED: 0,
        BUZZER: 0,
        lcdNum: 0,
        lcdTxt: '                ',
        note: 262,
        duration: 0,
    },
    setZero: function() {
        var portMap = Entry.MRT.PORT_MAP;
        var sq = Entry.hw.sendQueue;
        for (var port in portMap) {
            sq[port] = portMap[port];
        }
        Entry.hw.update();
        var MRT = Entry.MRT;
        MRT.removeAllTimeouts();
    },
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
};

Entry.MRT.setLanguage = function() {
    return {
        ko: {
            template: {
                mrt_digitalInput: '%1',
                mrt_analogValue: '%1',
                mrt_digitalOutput: '디지털 %1 핀, 출력 값 %2 %3',
                mrt_servo: '서보 모터 %1 , 각도 %2 %3',
                mrt_oneWheel: '바퀴(DC) 모터 %1 , 속도 %2 %3',
                mrt_buzzer: '%1   %2 음을 %3 초 연주하기 %4',
                mrt_lcd: 'LCD %1 번째 줄 ,  출력 값 %2 %3',
                mrt_ultra: '초음파 센서',
                mrt_gyro: '자이로 센서 %1',
                mrt_color: '컬러 센서',
                mrt_remotecontrol: '리모콘',
                mrt_keyvalue: '키 값',
            },
        },
        en: {
            template: {
                mrt_digitalInput: '%1',
                mrt_analogValue: '%1',
                mrt_digitalOutput: 'digital write pin %1 , value %2 %3',
                mrt_servo: 'servo write pin %1 , degrees %2 %3',
                mrt_oneWheel: 'set DC-motor %1 , speed %2 %3',
                mrt_buzzer: 'play Tone on note %1   %2  %3 duration %4',
                mrt_lcd: 'LCD %1 번째 줄 ,  출력 값 %2 %3',
                mrt_ultra: 'ultrasonic sensor',
                mrt_gyro: 'gyro sensor %1',
                mrt_color: 'color sensor',
                mrt_remotecontrol: 'remocon',
                mrt_keyvalue: 'key value',
            },
        },
    };
};

Entry.MRT.blockMenuBlocks = [
    //region MRT-X Blocks added
    'mrt_digitalInput',
    'mrt_digitalOutput',
    'mrt_analogValue',
    'mrt_ultra',
    'mrt_color',
    'mrt_gyro',
    'mrt_remotecontrol',
    'mrt_keyvalue',
    'mrt_buzzer',
    'mrt_servo',
    'mrt_oneWheel',
    'mrt_lcd',
    //endregion end of MRT-X Blocks added
];

Entry.MRT.getBlocks = function() {
    return {
        //region xbot 엑스봇
        mrt_analogValue: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['IN1', 'adc0'],
                        ['IN2', 'adc1'],
                        ['IN3', 'adc2'],
                        ['IN4', 'adc3'],
                        ['IN5', 'adc4'],
                    ],
                    value: 'adc0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'mrt_analogValue',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class: 'mrt_sensor',
            isNotFor: ['MRT-X'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;
                var dev = script.getField('DEVICE');
                return pd[dev];
            },
            syntax: { js: [], py: ['MRT.analog_value(%1)'] },
        },
        mrt_ultra: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            fontColor: '#ffffff',
            params: [
                {
                    type: 'default_value',
                    options: [['ultra', 'ultra']],
                    value: 'ultra',
                    fontSize: 11,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'mrt_ultra',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class: 'mrt_sensor',
            isNotFor: ['MRT-X'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;
                var dev = script.getField('DEVICE');
                return pd[dev];
            },
            syntax: { js: [], py: ['MRT.analog_value(%1)'] },
        },

        mrt_color: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            fontColor: '#ffffff',
            params: [
                {
                    type: 'default_value',
                    options: [['color', 'color']],
                    value: 'color',
                    fontSize: 11,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'mrt_color',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class: 'mrt_sensor',
            isNotFor: ['MRT-X'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;
                var dev = script.getField('DEVICE');
                return pd[dev];
            },
            syntax: { js: [], py: ['MRT.analog_value(%1)'] },
        },

        mrt_remotecontrol: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            fontColor: '#ffffff',
            params: [
                {
                    type: 'default_value',
                    options: [['remocon', 'remocon']],
                    value: 'remocon',
                    fontSize: 11,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'mrt_remotecontrol',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class: 'mrt_sensor',
            isNotFor: ['MRT-X'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;
                var dev = script.getField('DEVICE');
                return pd[dev];
            },
            syntax: { js: [], py: ['MRT.analog_value(%1)'] },
        },

        mrt_keyvalue: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            fontColor: '#ffffff',
            params: [
                {
                    type: 'default_value',
                    options: [['key', 'key']],
                    value: 'key',
                    fontSize: 11,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'mrt_keyvalue',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class: 'mrt_sensor',
            isNotFor: ['MRT-X'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;
                var dev = script.getField('DEVICE');
                return pd[dev];
            },
            syntax: { js: [], py: ['MRT.analog_value(%1)'] },
        },

        mrt_gyro: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            fontColor: '#ffffff',
            params: [
                {
                    type: 'Dropdown',
                    options: [['X', 'gyroX'], ['Y', 'gyroY'], ['Z', 'gyroZ']],
                    value: 'gyroX',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'mrt_gyro',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class: 'mrt_sensor',
            isNotFor: ['MRT-X'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;
                var dev = script.getField('DEVICE');
                return pd[dev];
            },
            syntax: { js: [], py: ['MRT.analog_value(%1)'] },
        },

        mrt_digitalOutput: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['OUT4', 'OUT4'],
                        ['OUT5', 'OUT5'],
                        ['LED', 'LED'],
                        ['BUZZER ', 'BUZZER'],
                    ],
                    value: 'LED',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [[Lang.Blocks.XBOT_High, 'HIGH'], [Lang.Blocks.XBOT_Low, 'LOW']],
                    value: 'HIGH',
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
                type: 'mrt_digitalOutput',
            },
            paramsKeyMap: {
                DEVICE: 0,
                VALUE: 1,
            },
            class: 'mrt_sensor',
            isNotFor: ['MRT-X'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var dev = script.getStringField('DEVICE', script);
                var value = script.getStringField('VALUE', script);

                if (dev == 'BUZZER' && value == 'HIGH') {
                    sq.BUZZER = 1;
                } else {
                    sq.BUZZER = 0;
                }

                if (dev == 'OUT4' && value == 'HIGH') {
                    sq.OUT4 = 1;
                } else {
                    sq.OUT4 = 0;
                }

                if (dev == 'OUT5' && value == 'HIGH') {
                    sq.OUT5 = 1;
                } else {
                    sq.OUT5 = 0;
                }

                if (dev == 'LED' && value == 'HIGH') {
                    sq.LED = 1;
                } else {
                    sq.LED = 0;
                }
                //sq.D13 = 1;
                return script.callReturn();
            },
            syntax: { js: [], py: ['MRT.digital_output(%1, %2)'] },
        },

        mrt_servo: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['OUT1', 'OUT1'], ['OUT2', 'OUT2'], ['OUT3', 'OUT3']],
                    value: 'OUT1',
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
                        params: ['90'],
                    },
                    null,
                ],
                type: 'mrt_servo',
            },
            paramsKeyMap: {
                DEVICE: 0,
                VALUE: 1,
            },
            class: 'mrt_motor',
            isNotFor: ['MRT-X'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var mtype = script.getStringField('DEVICE', script);
                var angle = script.getNumberValue('VALUE', script);

                if (mtype == 'OUT1') {
                    sq.OUT1 = angle;
                } else if (mtype == 'OUT2') {
                    sq.OUT2 = angle;
                } else if (mtype == 'OUT3') {
                    sq.OUT3 = angle;
                }

                return script.callReturn();
            },
            syntax: { js: [], py: ['MRT.servo(%1, %2)'] },
        },
        mrt_oneWheel: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['RIGHT_WHEEL1', 'RIGHT_WHEEL1'],
                        ['LEFT_WHEEL1', 'LEFT_WHEEL1'],
                        ['RIGHT_WHEEL2', 'RIGHT_WHEEL2'],
                        ['LEFT_WHEEL2', 'LEFT_WHEEL2'],
                    ],
                    value: 'RIGHT_WHEEL1',
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
                        params: ['0'],
                    },
                    null,
                ],
                type: 'mrt_oneWheel',
            },
            paramsKeyMap: {
                DEVICE: 0,
                VALUE: 1,
            },
            class: 'mrt_motor',
            isNotFor: ['MRT-X'],
            func: function(sprite, script) {
                //console.log('xbot_move_forward_for_secs');
                var sq = Entry.hw.sendQueue;
                var dir = script.getStringField('DEVICE', script);
                var speed = script.getNumberValue('VALUE', script);

                if (dir == 'RIGHT_WHEEL1') sq.RIGHT_WHEEL1 = speed;
                if (dir == 'LEFT_WHEEL1') sq.LEFT_WHEEL1 = speed;
                if (dir == 'RIGHT_WHEEL2') sq.RIGHT_WHEEL2 = speed;
                if (dir == 'LEFT_WHEEL2') sq.LEFT_WHEEL2 = speed;

                return script.callReturn();
            },
            syntax: { js: [], py: ['MRT.one_wheel(%1, %2)'] },
        },

        mrt_lcd: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['0', '0'], ['1', '1']],
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
                        params: ['Hello'],
                    },
                    null,
                ],
                type: 'mrt_lcd',
            },
            paramsKeyMap: {
                LINE: 0,
                VALUE: 1,
            },
            class: 'mrt_sensor',
            isNotFor: ['MRT-X'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var line = script.getNumberField('LINE', script);
                var str = script.getStringValue('VALUE', script);

                if (line == 0) {
                    sq.lcdNum = 0;
                    sq.lcdTxt = str;
                } else if (line == 1) {
                    sq.lcdNum = 1;
                    sq.lcdTxt = str;
                }
                //console.log('ledR' + sq.ledR + ' ledG ' + sq.ledG +' ledB ' + sq.ledB);
                return script.callReturn();
            },
            syntax: { js: [], py: ['MRT.lcd(%1, %2)'] },
        },
        //endregion xbot 엑스봇
    };
};

module.exports = Entry.MRT;
