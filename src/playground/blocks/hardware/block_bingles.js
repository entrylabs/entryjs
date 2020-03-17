'use strict';

Entry.BINGLES = {
    id: '1.D',
    name: 'BINGLES',
    url: 'http://www.xbot.co.kr/',
    imageName: 'bingles.png',
    title: {
        ko: '빙글S',
        en: 'BINGLES',
    },
    PORT_MAP: {
        RIGHT_WHEEL: 0,
        LEFT_WHEEL: 0,
        HEAD: 90,
        ARMR: 90,
        ARML: 90,
        HEAD_LED: 0,
        ledR: 0,
        ledG: 0,
        ledB: 0,
        lcdNum: 0,
        lcdTxt: ' ',
        note: 'C4',
        duration: 0,
        motor_direction: 'Forward',
        motor_duration: 0,
        OLEDImage: 0,
    },
    setZero: function() {
        var portMap = Entry.BINGLES.PORT_MAP;
        var sq = Entry.hw.sendQueue;
        for (var port in portMap) {
            sq[port] = portMap[port];
        }
        Entry.hw.update();
        var BINGLES = Entry.BINGLES;
        BINGLES.removeAllTimeouts();
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

Entry.BINGLES.setLanguage = function() {
    return {
        ko: {
            Blocks: {
                Forward: '앞',
                Back: '뒤',
                Left: '좌회전',
                Right: '우회전',
                LightSensorValue: '광센서 값',
                MicSensorValue: '마이크 값',
                IR0Value: 'IR 0 값',
                IR1Value: 'IR 1 값',
                IR2Value: 'IR 2 값',
                IR3Value: 'IR 3 값',
                Remocon: '리모컨',
                Head: '머리',
                LeftArm: '왼 팔',
                RightArm: '오른 팔',
            },
            template: {
                bingles_analogValue: '%1',
                bingles_digitalOutput: '디지털 %1 핀, 출력 값 %2 %3',
                bingles_servo: '서보 모터 %1 , 각도 %2 %3',
                bingles_twoWheel: '바퀴(DC) 모터 오른쪽(2) 속도: %1 왼쪽(1) 속도: %2',
                bingles_lcd: 'LCD %1 번째 줄 ,  출력 값 %2 %3',
                bingles_remotecontrol: '리모콘',
                bingles_rgb: 'RGB LED 켜기 R 값 %1 G 값 %2 B 값 %3',
                bingles_rgb_picker: 'RGB LED색 %1로 정하기',
                bingles_buzzer: '%1 %2 음을 %3초 연주하기',
                bingles_oled: '얼굴 %1 번 표현 나타내기',
                bingles_motorgo: '방향 %1 %2 초 움직이기',
            },
        },
        en: {
            Blocks: {
                Forward: 'Forward',
                Back: 'Back',
                Left: 'Left Turn',
                Right: 'Right Turn',
                LightSensorValue: 'Light Sensor Value',
                MicSensorValue: 'Mic Sensor Value',
                IR0Value: 'IR 0 Value',
                IR1Value: 'IR 1 Value',
                IR2Value: 'IR 2 Value',
                IR3Value: 'IR 3 Value',
                Remocon: 'Remote control',
                Head: 'Head',
                LeftArm: 'Left',
                RightArm: 'Right',
            },
            template: {
                bingles_analogValue: '%1',
                bingles_digitalOutput: 'Digital %1 PIN, Output Value %2 %3',
                bingles_servo: 'Servo Motor %1 , Angle %2 %3',
                bingles_twoWheel: 'Wheel(DC) Motor %1 , Speed %2 %3',
                bingles_lcd: 'LCD Line %1 , Text %2 %3',
                bingles_remotecontrol: 'Remote control',
                bingles_rgb: 'RGB LED Color from Red %1 Green %2 Blue %3',
                bingles_rgb_picker: 'RGB LED Color from %1',
                bingles_buzzer: 'Play Tone %1 %2 for %3sec of Melody Playing',
                bingles_oled: 'Set Facial Icon %1',
                bingles_motorgo: 'Move Robot %1 %2 sec',
            },
        },
    };
};

Entry.BINGLES.blockMenuBlocks = [
    'bingles_analogValue',
    'bingles_digitalOutput',
    'bingles_rgb',
    'bingles_rgb_picker',
    'bingles_buzzer',
    'bingles_servo',
    'bingles_twoWheel',
    'bingles_lcd',
    'bingles_remotecontrol',
    'bingles_oled',
    'bingles_motorgo',
];

Entry.BINGLES.getBlocks = function() {
    return {
        //region xbot 엑스봇
        bingles_analogValue: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.LightSensorValue, 'light'],
                        [Lang.Blocks.MicSensorValue, 'mic'],
                        [Lang.Blocks.IR0Value, 'ir0'],
                        [Lang.Blocks.IR1Value, 'ir1'],
                        [Lang.Blocks.IR2Value, 'ir2'],
                        [Lang.Blocks.IR3Value, 'ir3'],
                    ],
                    value: 'light',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'bingles_analogValue',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class: 'bingles_sensor',
            isNotFor: ['BINGLES'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;
                var dev = script.getField('DEVICE');
                return pd[dev];
            },
            syntax: { js: [], py: ['bingles.analog_value(%1)'] },
        },

        bingles_remotecontrol: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            fontColor: '#ffffff',
            params: [
                {
                    type: 'default_value',
                    options: [[Lang.Blocks.Remocon, 'remocon']],
                    value: 'remocon',
                    fontSize: 11,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'bingles_remotecontrol',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class: 'bingles_sensor',
            isNotFor: ['BINGLES'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;
                var dev = script.getField('DEVICE');
                return pd[dev];
            },
            syntax: { js: [], py: ['bingles.analog_value(%1)'] },
        },

        bingles_digitalOutput: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['LED', 'HEAD_LED']],
                    value: 'HEAD_LED',
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
                type: 'bingles_digitalOutput',
            },
            paramsKeyMap: {
                DEVICE: 0,
                VALUE: 1,
            },
            class: 'bingles_sensor',
            isNotFor: ['BINGLES'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var dev = script.getStringField('DEVICE', script);
                var value = script.getStringField('VALUE', script);

                if (dev == 'HEAD_LED' && value == 'HIGH') {
                    sq.HEAD_LED = 1;
                } else {
                    sq.HEAD_LED = 0;
                }
                //sq.D13 = 1;
                return script.callReturn();
            },
            syntax: { js: [], py: ['bingles.digital_output(%1, %2)'] },
        },

        bingles_servo: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.Head, 'head'],
                        [Lang.Blocks.RightArm, 'right'],
                        [Lang.Blocks.LeftArm, 'left'],
                    ],
                    value: 'head',
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
                type: 'bingles_servo',
            },
            paramsKeyMap: {
                DEVICE: 0,
                VALUE: 1,
            },
            class: 'bingles_motor',
            isNotFor: ['BINGLES'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var mtype = script.getStringField('DEVICE', script);
                var angle = script.getNumberValue('VALUE', script);

                if (mtype == 'head') {
                    sq.HEAD = angle;
                } else if (mtype == 'right') {
                    sq.ARMR = angle;
                } else if (mtype == 'left') {
                    sq.ARML = angle;
                }
                return script.callReturn();
            },
            syntax: { js: [], py: ['bingles.servo(%1, %2)'] },
        },

        bingles_lcd: {
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
                type: 'bingles_lcd',
            },
            paramsKeyMap: {
                LINE: 0,
                VALUE: 1,
            },
            class: 'bingles_sensor',
            isNotFor: ['BINGLES'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var line = script.getNumberField('LINE', script);
                var str = script.getStringValue('VALUE', script);

                sq.lcdNum = line;
                sq.lcdTxt = str;
                return script.callReturn();
            },
            syntax: { js: [], py: ['bingles.lcd(%1, %2)'] },
        },

        bingles_buzzer: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.XBOT_c, 'C'],
                        [Lang.Blocks.XBOT_d, 'D'],
                        [Lang.Blocks.XBOT_e, 'E'],
                        [Lang.Blocks.XBOT_f, 'F'],
                        [Lang.Blocks.XBOT_g, 'G'],
                        [Lang.Blocks.XBOT_a, 'A'],
                        [Lang.Blocks.XBOT_b, 'B'],
                    ],
                    value: 'C',
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
                        ['5', '5'],
                        ['6', '6'],
                        ['7', '7'],
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
                params: [
                    null,
                    '4',
                    {
                        type: 'text',
                        params: ['0.5'],
                    },
                    null,
                ],
                type: 'bingles_buzzer',
            },
            paramsKeyMap: {
                NOTE: 0,
                OCTAVE: 1,
                VALUE: 2,
            },
            class: 'bingles_sensor',
            isNotFor: ['BINGLES'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;

                if (!script.isStart) {
                    var note = script.getStringField('NOTE', script);
                    var octave = script.getStringField('OCTAVE', script);
                    var duration = script.getNumberValue('VALUE', script);
                    var noteOctave = note + octave; // 'C'+ 2 = "C2"
                    //console.log('xbot_buzzer ' + noteOctave + ' ' + duration);

                    sq.note = noteOctave;

                    sq.duration = duration * 10; //  convert to 100mSec

                    script.isStart = true;
                    script.timeFlag = 1;

                    var timeValue = duration * 1000;
                    console.log('timeValue' + timeValue);
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.BINGLES.removeTimeout(timer);
                    }, timeValue);
                    Entry.BINGLES.timeouts.push(timer);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    Entry.engine.isContinue = false;
                    sq.duration = 0;

                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['bingles.buzzer(%1, %2, %3)'] },
        },

        bingles_rgb: {
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
                        type: 'text',
                        params: ['0'],
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
                type: 'bingles_rgb',
            },
            paramsKeyMap: {
                ledR: 0,
                ledG: 1,
                ledB: 2,
            },
            class: 'bingles_rgb',
            isNotFor: ['BINGLES'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;

                sq.ledR = script.getNumberValue('ledR');
                sq.ledG = script.getNumberValue('ledG');
                sq.ledB = script.getNumberValue('ledB');

                //console.log('ledR' + sq.ledR + ' ledG ' + sq.ledG +' ledB ' + sq.ledB);
                return script.callReturn();
            },
            syntax: { js: [], py: ['bingles.rgb(%1, %2, %3)'] },
        },

        bingles_rgb_picker: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Color',
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
                type: 'bingles_rgb_picker',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'bingles_rgb',
            isNotFor: ['BINGLES'],
            func: function(sprite, script) {
                var port = script.getStringField('VALUE');
                var sq = Entry.hw.sendQueue;

                sq.ledR = parseInt(parseInt(port.substr(1, 2), 16) * 0.3);
                sq.ledG = parseInt(parseInt(port.substr(3, 2), 16) * 0.3);
                sq.ledB = parseInt(parseInt(port.substr(5, 2), 16) * 0.3);

                return script.callReturn();
            },
            syntax: { js: [], py: ['bingles.rgb_picker(%1)'] },
        },

        bingles_twoWheel: {
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
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'bingles_twoWheel',
            },
            paramsKeyMap: {
                rightWheel: 0,
                leftWheel: 1,
            },
            class: 'bingles_motor',
            isNotFor: ['BINGLES'],
            func: function(sprite, script) {
                //console.log('xbot_move_forward_for_secs');
                var sq = Entry.hw.sendQueue;

                sq.RIGHT_WHEEL = script.getNumberValue('rightWheel');
                sq.LEFT_WHEEL = script.getNumberValue('leftWheel');

                return script.callReturn();
            },
            syntax: { js: [], py: ['bingles.two_wheel(%1, %2)'] },
        },

        bingles_motorgo: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.Forward, 'Forward'],
                        [Lang.Blocks.Back, 'Backward'],
                        [Lang.Blocks.Left, 'Left Turn'],
                        [Lang.Blocks.Right, 'Right Turn'],
                    ],
                    value: 'Forward',
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
                        params: ['1'],
                    },
                ],
                type: 'bingles_motorgo',
            },
            paramsKeyMap: {
                DEVICE: 0,
                VALUE: 1,
            },
            class: 'bingles_motor',
            isNotFor: ['BINGLES'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;

                var motorDir = script.getStringField('DEVICE', script);
                var motorDur = script.getNumberValue('VALUE', script);
                //console.log('xbot_direction ' + motorDir + ' ' + motorDur);

                sq.motor_direction = motorDir;
                sq.motor_duration = motorDur * 10; //  convert to 100mSec*/
                return script.callReturn();
            },
            syntax: { js: [], py: ['bingles.motorgo(%1, %2, %3)'] },
        },

        bingles_oled: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
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
                        ['6', '6'],
                        ['7', '7'],
                        ['8', '8'],
                        ['9', '9'],
                        ['10', '10'],
                        ['11', '11'],
                        ['12', '12'],
                        ['13', '13'],
                        ['14', '14'],
                        ['15', '15'],
                        ['16', '16'],
                        ['17', '17'],
                        ['18', '18'],
                        ['19', '19'],
                        ['20', '20'],
                        ['21', '21'],
                        ['22', '22'],
                        ['23', '23'],
                        ['24', '24'],
                        ['25', '25'],
                        ['26', '26'],
                        ['27', '27'],
                        ['28', '28'],
                        ['29', '29'],
                    ],
                    value: '0',
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
                params: [
                    null,
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'bingles_oled',
            },
            paramsKeyMap: {
                oledImage: 0,
            },
            class: 'bingles_sensor',
            isNotFor: ['BINGLES'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var OLEDImage = script.getNumberField('oledImage', script);

                sq.OLEDImage = OLEDImage;
                return script.callReturn();
            },
            syntax: { js: [], py: ['bingles.lcd(%1, %2)'] },
        },
        //endregion xbot 엑스봇
    };
};

module.exports = Entry.BINGLES;
