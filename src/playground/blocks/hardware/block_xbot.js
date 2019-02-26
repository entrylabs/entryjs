'use strict';

Entry.Xbot = {
    PORT_MAP: {
        rightWheel: 0,
        leftWheel: 0,
        head: 90,
        armR: 90,
        armL: 90,
        analogD5: 127, //D4
        analogD6: 127, //D5
        D4: 0,
        D7: 0,
        D12: 0,
        D13: 0,
        ledR: 0,
        ledG: 0,
        ledB: 0,
        lcdNum: 0,
        lcdTxt: '                ',
        note: 262,
        duration: 0,
    },
    setZero: function() {
        var portMap = Entry.Xbot.PORT_MAP;
        var sq = Entry.hw.sendQueue;
        for (var port in portMap) {
            sq[port] = portMap[port];
        }
        Entry.hw.update();
        var Xbot = Entry.Xbot;
        Xbot.removeAllTimeouts();
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
    id: '1.7',
    name: 'xbot_epor_edge',
    url: 'http://xbot.co.kr/',
    imageName: 'xbot.png',
    title: {
        ko: '엑스봇(원터치 동글/USB)',
        en: 'XBOT(OneTouch Dongle/USB)',
    },
};
Entry.Xbot.blockMenuBlocks = [
    //XBOT Blocks added
    'xbot_analogValue',
    'xbot_digitalInput',
    'xbot_digitalOutput',
    'xbot_analogOutput',
    'xbot_rgb',
    'xbot_rgb_picker',
    'xbot_buzzer',
    'xbot_servo',
    'xbot_oneWheel',
    'xbot_twoWheel',
    'xbot_lcd',
    //end of XBOT Blocks added
];
Entry.Xbot.getBlocks = function() {
    return {
        //region xbot 엑스봇
        xbot_digitalInput: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.XBOT_D2_digitalInput, 'D2'],
                        [Lang.Blocks.XBOT_D3_digitalInput, 'D3'],
                        [Lang.Blocks.XBOT_D11_digitalInput, 'D11'],
                    ],
                    value: 'D2',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'xbot_digitalInput',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class: 'xbot_sensor',
            isNotFor: ['xbot_epor_edge'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;
                var dev = script.getField('DEVICE');
                return pd[dev];
            },
            syntax: { js: [], py: ['Xbot.digital_input(%1)'] },
        },
        xbot_analogValue: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.XBOT_CDS, 'light'],
                        [Lang.Blocks.XBOT_MIC, 'mic'],
                        [Lang.Blocks.XBOT_analog0, 'adc0'],
                        [Lang.Blocks.XBOT_analog1, 'adc1'],
                        [Lang.Blocks.XBOT_analog2, 'adc2'],
                        [Lang.Blocks.XBOT_analog3, 'adc3'],
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
                type: 'xbot_analogValue',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class: 'xbot_sensor',
            isNotFor: ['xbot_epor_edge'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;
                var dev = script.getField('DEVICE');
                return pd[dev];
            },
            syntax: { js: [], py: ['Xbot.analog_value(%1)'] },
        },
        xbot_digitalOutput: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['LED', 'D13'], ['D4', 'D4'], ['D7', 'D7'], ['D12 ', 'D12']],
                    value: 'D13',
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
                type: 'xbot_digitalOutput',
            },
            paramsKeyMap: {
                DEVICE: 0,
                VALUE: 1,
            },
            class: 'xbot_sensor',
            isNotFor: ['xbot_epor_edge'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var dev = script.getStringField('DEVICE', script);
                var value = script.getStringField('VALUE', script);

                if (dev == 'D13' && value == 'HIGH') {
                    sq.D13 = 1;
                } else {
                    sq.D13 = 0;
                }

                if (dev == 'D4' && value == 'HIGH') {
                    sq.D4 = 1;
                } else {
                    sq.D4 = 0;
                }

                if (dev == 'D7' && value == 'HIGH') {
                    sq.D7 = 1;
                } else {
                    sq.D7 = 0;
                }

                if (dev == 'D12' && value == 'HIGH') {
                    sq.D12 = 1;
                } else {
                    sq.D12 = 0;
                }
                //sq.D13 = 1;
                return script.callReturn();
            },
            syntax: { js: [], py: ['Xbot.digital_output(%1, %2)'] },
        },
        xbot_analogOutput: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['D5', 'analogD5'], ['D6', 'analogD6']],
                    value: 'analogD5',
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
                type: 'xbot_analogOutput',
            },
            paramsKeyMap: {
                DEVICE: 0,
                VALUE: 1,
            },
            class: 'xbot_sensor',
            isNotFor: ['xbot_epor_edge'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var dev = script.getStringField('DEVICE', script);
                var value = script.getNumberValue('VALUE', script);

                if (dev == 'analogD5') {
                    sq.analogD5 = value;
                } else if (dev == 'analogD6') {
                    sq.analogD6 = value;
                }
                return script.callReturn();
            },
            syntax: { js: [], py: ['Xbot.analog_output(%1, %2)'] },
        },
        xbot_servo: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.XBOT_Head, 'head'],
                        [Lang.Blocks.XBOT_ArmR, 'right'],
                        [Lang.Blocks.XBOT_ArmL, 'left'],
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
                type: 'xbot_servo',
            },
            paramsKeyMap: {
                DEVICE: 0,
                VALUE: 1,
            },
            class: 'xbot_motor',
            isNotFor: ['xbot_epor_edge'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var mtype = script.getStringField('DEVICE', script);
                var angle = script.getNumberValue('VALUE', script);

                if (mtype == 'head') {
                    sq.head = angle;
                } else if (mtype == 'right') {
                    sq.armR = angle;
                } else if (mtype == 'left') {
                    sq.armL = angle;
                }

                return script.callReturn();
            },
            syntax: { js: [], py: ['Xbot.servo(%1, %2)'] },
        },
        xbot_oneWheel: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.XBOT_rightWheel, 'rightWheel'],
                        [Lang.Blocks.XBOT_leftWheel, 'leftWheel'],
                        [Lang.Blocks.XBOT_bothWheel, 'bothWheel'],
                    ],
                    value: 'rightWheel',
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
                type: 'xbot_oneWheel',
            },
            paramsKeyMap: {
                DEVICE: 0,
                VALUE: 1,
            },
            class: 'xbot_motor',
            isNotFor: ['xbot_epor_edge'],
            func: function(sprite, script) {
                //console.log('xbot_move_forward_for_secs');
                var sq = Entry.hw.sendQueue;
                var dir = script.getStringField('DEVICE', script);
                var speed = script.getNumberValue('VALUE', script);

                if (dir == 'rightWheel') sq.rightWheel = speed;
                else if (dir == 'leftWheel') sq.leftWheel = speed;
                else sq.rightWheel = sq.leftWheel = speed;

                return script.callReturn();
            },
            syntax: { js: [], py: ['Xbot.one_wheel(%1, %2)'] },
        },
        xbot_twoWheel: {
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
                type: 'xbot_twoWheel',
            },
            paramsKeyMap: {
                rightWheel: 0,
                leftWheel: 1,
            },
            class: 'xbot_motor',
            isNotFor: ['xbot_epor_edge'],
            func: function(sprite, script) {
                //console.log('xbot_move_forward_for_secs');
                var sq = Entry.hw.sendQueue;

                sq.rightWheel = script.getNumberValue('rightWheel');
                sq.leftWheel = script.getNumberValue('leftWheel');

                return script.callReturn();
            },
            syntax: { js: [], py: ['Xbot.two_wheel(%1, %2)'] },
        },
        xbot_rgb: {
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
                        params: ['255'],
                    },
                    {
                        type: 'text',
                        params: ['255'],
                    },
                    {
                        type: 'text',
                        params: ['255'],
                    },
                    null,
                ],
                type: 'xbot_rgb',
            },
            paramsKeyMap: {
                ledR: 0,
                ledG: 1,
                ledB: 2,
            },
            class: 'xbot_rgb',
            isNotFor: ['xbot_epor_edge'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;

                sq.ledR = script.getNumberValue('ledR');
                sq.ledG = script.getNumberValue('ledG');
                sq.ledB = script.getNumberValue('ledB');

                //console.log('ledR' + sq.ledR + ' ledG ' + sq.ledG +' ledB ' + sq.ledB);
                return script.callReturn();
            },
            syntax: { js: [], py: ['Xbot.rgb(%1, %2, %3)'] },
        },
        xbot_rgb_picker: {
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
                type: 'xbot_rgb_picker',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'xbot_rgb',
            isNotFor: ['xbot_epor_edge'],
            func: function(sprite, script) {
                var port = script.getStringField('VALUE');
                var sq = Entry.hw.sendQueue;

                sq.ledR = parseInt(parseInt(port.substr(1, 2), 16) * 0.3);
                sq.ledG = parseInt(parseInt(port.substr(3, 2), 16) * 0.3);
                sq.ledB = parseInt(parseInt(port.substr(5, 2), 16) * 0.3);

                return script.callReturn();
            },
            syntax: { js: [], py: ['Xbot.rgb_picker(%1)'] },
        },
        xbot_buzzer: {
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
                type: 'xbot_buzzer',
            },
            paramsKeyMap: {
                NOTE: 0,
                OCTAVE: 1,
                VALUE: 2,
            },
            class: 'xbot_sensor',
            isNotFor: ['xbot_epor_edge'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;

                if (!script.isStart) {
                    var note = script.getStringField('NOTE', script);
                    var octave = script.getStringField('OCTAVE', script);
                    var duration = script.getNumberValue('VALUE', script);
                    var noteOctave = note + octave; // 'C'+ 2 = "C2"
                    //console.log('xbot_buzzer noteOctave' + note + ' ' + octave + ' ' + duration);

                    if (noteOctave == 'C2') sq.note = 65;
                    else if (noteOctave == 'D2') sq.note = 73;
                    else if (noteOctave == 'E2') sq.note = 82;
                    else if (noteOctave == 'F2') sq.note = 87;
                    else if (noteOctave == 'G2') sq.note = 98;
                    else if (noteOctave == 'A2') sq.note = 110;
                    else if (noteOctave == 'B2') sq.note = 123;
                    else if (noteOctave == 'C3') sq.note = 131;
                    else if (noteOctave == 'D3') sq.note = 147;
                    else if (noteOctave == 'E3') sq.note = 165;
                    else if (noteOctave == 'F3') sq.note = 175;
                    else if (noteOctave == 'G3') sq.note = 196;
                    else if (noteOctave == 'A3') sq.note = 220;
                    else if (noteOctave == 'B3') sq.note = 247;
                    else if (noteOctave == 'C4') sq.note = 262;
                    else if (noteOctave == 'D4') sq.note = 294;
                    else if (noteOctave == 'E4') sq.note = 330;
                    else if (noteOctave == 'F4') sq.note = 349;
                    else if (noteOctave == 'G4') sq.note = 392;
                    else if (noteOctave == 'A4') sq.note = 440;
                    else if (noteOctave == 'B4') sq.note = 494;
                    else if (noteOctave == 'C5') sq.note = 523;
                    else if (noteOctave == 'D5') sq.note = 587;
                    else if (noteOctave == 'E5') sq.note = 659;
                    else if (noteOctave == 'F5') sq.note = 698;
                    else if (noteOctave == 'G5') sq.note = 784;
                    else if (noteOctave == 'A5') sq.note = 880;
                    else if (noteOctave == 'B5') sq.note = 988;
                    else if (noteOctave == 'C6') sq.note = 1047;
                    else if (noteOctave == 'D6') sq.note = 1175;
                    else if (noteOctave == 'E6') sq.note = 1319;
                    else if (noteOctave == 'F6') sq.note = 1397;
                    else if (noteOctave == 'G6') sq.note = 1568;
                    else if (noteOctave == 'A6') sq.note = 1760;
                    else if (noteOctave == 'B6') sq.note = 1976;
                    else if (noteOctave == 'C7') sq.note = 2093;
                    else if (noteOctave == 'D7') sq.note = 2349;
                    else if (noteOctave == 'E7') sq.note = 2637;
                    else if (noteOctave == 'F7') sq.note = 2794;
                    else if (noteOctave == 'G7') sq.note = 3136;
                    else if (noteOctave == 'A7') sq.note = 3520;
                    else if (noteOctave == 'B7') sq.note = 3951;
                    else sq.note = 262;

                    //sq.duration = 200;
                    //duration *= 40; //  convert to mSec
                    sq.duration = duration * 40;

                    script.isStart = true;
                    script.timeFlag = 1;

                    var timeValue = duration * 1000;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.Xbot.removeTimeout(timer);
                    }, timeValue);
                    Entry.Xbot.timeouts.push(timer);
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
            syntax: { js: [], py: ['Xbot.buzzer(%1, %2, %3)'] },
        },
        xbot_lcd: {
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
                type: 'xbot_lcd',
            },
            paramsKeyMap: {
                LINE: 0,
                VALUE: 1,
            },
            class: 'xbot_sensor',
            isNotFor: ['xbot_epor_edge'],
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
            syntax: { js: [], py: ['Xbot.lcd(%1, %2)'] },
        },
        //endregion xbot 엑스봇
    };
};

module.exports = Entry.Xbot;
