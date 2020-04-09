'use strict';

Entry.Altino = {
    PORT_MAP: {
        rightWheel: 0,
        leftWheel: 0,
        steering: 0,
        ascii: 0,
        led: 0,
        led2: 0,
        note: 0,
        dot1: 0,
        dot2: 0,
        dot3: 0,
        dot4: 0,
        dot5: 0,
        dot6: 0,
        dot7: 0,
        dot8: 0,
    },
    setZero: function() {
        var portMap = Entry.Altino.PORT_MAP;
        var sq = Entry.hw.sendQueue;
        for (var port in portMap) {
            sq[port] = portMap[port];
        }
        Entry.hw.update();
        var Altino = Entry.Altino;
        Altino.removeAllTimeouts();
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
    id: '18.1',
    name: 'altino',
    url: 'http://saeon.co.kr/',
    imageName: 'altino.png',
    title: {
        en: 'Altino',
        ko: '알티노',
    },
};

Entry.Altino.blockMenuBlocks = [
    'altino_analogValue',
    'altino_stopAll',
    'altino_rear_wheel',
    'altino_steering',
    'altino_sound',
    'altino_light',
    'altino_dot_display',
    'altino_dot_display_line',
    'altino_steering_hex',
    'altino_light_hex',    
    'altino_sound_hex',              
    'altino_dot_display_hex',
    'altino_dot_display_matrix_on',
    'altino_dot_display_matrix_off',
];

Entry.Altino.setLanguage = function () {
    return {
        ko: {
            // ko.js에 작성하던 내용
            Blocks: {
                ALTINO_ACCX: "가속도-X",
                ALTINO_ACCY: "가속도-Y",
                ALTINO_ACCZ: "가속도-Z",
                ALTINO_BAT: "배터리 전압",
                ALTINO_CDS: "조도",
                ALTINO_GYROX: "자이로-X",
                ALTINO_GYROY: "자이로-Y",
                ALTINO_GYROZ: "자이로-Z",
                ALTINO_IR1: "적외선-1",
                ALTINO_IR2: "적외선-2",
                ALTINO_IR3: "적외선-3",
                ALTINO_IR4: "적외선-4",
                ALTINO_IR5: "적외선-5",
                ALTINO_IR6: "적외선-6",
                ALTINO_Led_Brake_Light: "브레이크",
                ALTINO_Led_Forward_Light: "전방",
                ALTINO_Led_Reverse_Light: "후진",
                ALTINO_Led_Turn_Left_Light: "왼쪽 방향지시",
                ALTINO_Led_Turn_Right_Light: "오른쪽 방향지시",
                ALTINO_Line: "번째 줄",
                ALTINO_MAGX: "지자기-X",
                ALTINO_MAGY: "지자기-Y",
                ALTINO_MAGZ: "지자기-Z",
                ALTINO_REMOTE: "리모콘 수신 값",
                ALTINO_STTOR: "조향전류",
                ALTINO_STVAR: "조향 가변저항",
                ALTINO_Steering_Angle_Center: "중앙",
                ALTINO_Steering_Angle_Left10: "왼쪽으로-10",
                ALTINO_Steering_Angle_Left15: "왼쪽으로-15",
                ALTINO_Steering_Angle_Left20: "왼쪽으로-20",
                ALTINO_Steering_Angle_Left5: "왼쪽으로-5",
                ALTINO_Steering_Angle_Right10: "오른쪽으로-10",
                ALTINO_Steering_Angle_Right15: "오른쪽으로-15",
                ALTINO_Steering_Angle_Right20: "오른쪽으로-20",
                ALTINO_Steering_Angle_Right5: "오른쪽으로-5",
                ALTINO_TEM: "온도",
                ALTINO_TOR1: "오른쪽 뒷바퀴 전류",
                ALTINO_TOR2: "왼쪽 뒷바퀴 전류",
                ALTINO_Value: "출력 값",
                ALTINO_a: "A(라)",
                ALTINO_a2: "A#(라#)",
                ALTINO_b: "B(시)",
                ALTINO_c: "C(도)",
                ALTINO_c2: "C#(도#)",
                ALTINO_d: "D(레)",
                ALTINO_d2: "D#(레#)",
                ALTINO_dot_display_1: "한문자",
                ALTINO_dot_display_2: "출력하기",
                ALTINO_e: "E(미)",
                ALTINO_f: "F(파)",
                ALTINO_f2: "F#(파#)",
                ALTINO_g: "G(솔)",
                ALTINO_g2: "G#(솔#)",
                ALTINO_sound_oct: "옥타브",
                ALTINO_h: "끄기",
                ALTINO_h2: "켜기",
                ALTINO_leftWheel: "왼쪽",
                ALTINO_melody_ms: "연주하기",
                ALTINO_outputValue: "출력 값",
                ALTINO_rightWheel: "오른쪽",
                ALTINO_set: "로 정하기",
                ALTINO_stopAll: "모두",
                ALTINO_stopDrive: "주행",
                ALTINO_stopSteering: "조향",
                ALTINO_stopSound: "소리",
                ALTINO_stopLight: "라이트",
                ALTINO_stopDisplay: "표시하기",
                ALTINO_dot_line_1: "1행",
                ALTINO_dot_line_2: "2행",
                ALTINO_dot_line_3: "3행",
                ALTINO_dot_line_4: "4행",
                ALTINO_dot_line_5: "5행",
                ALTINO_dot_line_6: "6행",
                ALTINO_dot_line_7: "7행",
                ALTINO_dot_line_8: "8행",
            },
            template: {
                altino_analogValue: "알티노 %1 센서값",
                altino_stopAll: "정지 %1°%2",
                altino_dot_display: "표시하기 %1 %2",
                altino_dot_display_line: "표시하기 %1 %2 %3 %4 %5 %6 %7 %8 %9 %10",
                altino_dot_display_hex: "표시하기 %1 %2 %3 %4 %5 %6 %7 %8 %9",
                altino_dot_display_matrix_on: "표시하기 켜기 X:%1 Y:%2 %3",
                altino_dot_display_matrix_off: "표시하기 끄기 X:%1 Y:%2 %3",
                altino_light: "라이트%1 %2 %3",
                altino_light_hex: "라이트%1 %2 %3",
                altino_sound_hex: "소리%1 %2",
                altino_rear_wheel: "뒷바퀴 구동 좌:%1 우:%2%3",
                altino_sound: "소리 %1 %2 %3",
                altino_steering_hex: "조향 %1%2",
                altino_steering: "조향 %1°%2",
            }
        },
        en: {
            // en.js에 작성하던 내용
            Blocks: {
                ALTINO_ACCX: "Accel-X",
                ALTINO_ACCY: "Accel-Y",
                ALTINO_ACCZ: "Accel-Z",
                ALTINO_BAT: "BAT",
                ALTINO_CDS: "CDS",
                ALTINO_GYROX: "Gyro-X",
                ALTINO_GYROY: "Gyro-Y",
                ALTINO_GYROZ: "Gyro-Z",
                ALTINO_IR1: "IR-1",
                ALTINO_IR2: "IR-2",
                ALTINO_IR3: "IR-3",
                ALTINO_IR4: "IR-4",
                ALTINO_IR5: "IR-5",
                ALTINO_IR6: "IR-6",
                ALTINO_Led_Brake_Light: "Brake",
                ALTINO_Led_Forward_Light: "Forward",
                ALTINO_Led_Reverse_Light: "Reverse",
                ALTINO_Led_Turn_Left_Light: "Turn Left",
                ALTINO_Led_Turn_Right_Light: "Turn Right",
                ALTINO_Line: "line",
                ALTINO_MAGX: "Magnet-X",
                ALTINO_MAGY: "Magnet-Y",
                ALTINO_MAGZ: "Magnet-Z",
                ALTINO_REMOTE: "remote control",
                ALTINO_STTOR: "S-Current",
                ALTINO_STVAR: "steering potentiometer",
                ALTINO_Steering_Angle_Center: "Center-0",
                ALTINO_Steering_Angle_Left10: "Left-10",
                ALTINO_Steering_Angle_Left15: "Left-15",
                ALTINO_Steering_Angle_Left20: "Left-20",
                ALTINO_Steering_Angle_Left5: "Left-5",
                ALTINO_Steering_Angle_Right10: "Right-10",
                ALTINO_Steering_Angle_Right15: "Right-15",
                ALTINO_Steering_Angle_Right20: "Right-20",
                ALTINO_Steering_Angle_Right5: "Right-5",
                ALTINO_TEM: "Temperature",
                ALTINO_TOR1: "M-Current Right",
                ALTINO_TOR2: "M-Current Left",
                ALTINO_Value: "output value",
                ALTINO_a: "A(la)",
                ALTINO_a2: "A#(la#)",
                ALTINO_b: "B(si)",
                ALTINO_c: "C(do)",
                ALTINO_c2: "C#(do#)",
                ALTINO_d: "D(re)",
                ALTINO_d2: "D#(re#)",
                ALTINO_dot_display_1: "one char",
                ALTINO_dot_display_2: "display",
                ALTINO_e: "E(mi)",
                ALTINO_f: "F(fa)",
                ALTINO_f2: "F#(fa#)",
                ALTINO_g: "G(sol)",
                ALTINO_g2: "G#(sol#)",
                ALTINO_sound_oct: "Oct",
                ALTINO_h: "Off",
                ALTINO_h2: "On",
                ALTINO_leftWheel: "left",
                ALTINO_melody_ms: "play",
                ALTINO_outputValue: "output",
                ALTINO_rightWheel: "right",
                ALTINO_set: " display",
                ALTINO_stopAll: "All",
                ALTINO_stopDrive: "Drive",
                ALTINO_stopSteering: "Steering",
                ALTINO_stopSound: "Sound",
                ALTINO_stopLight: "Light",
                ALTINO_stopDisplay: "Display",
                ALTINO_dot_line_1: "Line-1",
                ALTINO_dot_line_2: "Line-2",
                ALTINO_dot_line_3: "Line-3",
                ALTINO_dot_line_4: "Line-4",
                ALTINO_dot_line_5: "Line-5",
                ALTINO_dot_line_6: "Line-6",
                ALTINO_dot_line_7: "Line-7",
                ALTINO_dot_line_8: "Line-8",
            },
            template: {                
                ALTINO_analogValue: "altino %1 sensor value",
                ALTINO_stopAll: "Stop %1°%2",
                ALTINO_dot_display: "Display %1 %2",
                ALTINO_dot_display_line: "Display %1 %2 %3 %4 %5 %6 %7 %8 %9 %10",
                ALTINO_dot_display_hex: "Display %1 %2 %3 %4 %5 %6 %7 %8 %9",
                ALTINO_dot_display_matrix_on: "Display On X:%1 Y:%2 %3",
                ALTINO_dot_display_matrix_off: "Display Off X:%1 Y:%2 %3",
                ALTINO_light: "Light %1 %2 %3",
                ALTINO_light_hex: "Light %1 %2 %3",
                ALTINO_sound_hex: "Sound %1 %2",
                ALTINO_rear_wheel: "Go L:%1 R:%2%3",
                ALTINO_sound: "Sound %1 %2 %3",
                ALTINO_steering_hex: "Steering %1%2",
                ALTINO_steering: "Steering %1°%2",
            }
        }
    }
};

Entry.Altino.getBlocks = function() {
    return {
        //region Altino 알티노
        altino_analogValue: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [

                        [Lang.Blocks.ALTINO_CDS, 'cds'],
                        [Lang.Blocks.ALTINO_ACCX, 'accx'],
                        [Lang.Blocks.ALTINO_ACCY, 'accy'],
                        [Lang.Blocks.ALTINO_ACCZ, 'accz'],
                        [Lang.Blocks.ALTINO_MAGX, 'magx'],
                        [Lang.Blocks.ALTINO_MAGY, 'magy'],
                        [Lang.Blocks.ALTINO_MAGZ, 'magz'],
                        [Lang.Blocks.ALTINO_GYROX, 'gyrox'],
                        [Lang.Blocks.ALTINO_GYROY, 'gyroy'],
                        [Lang.Blocks.ALTINO_GYROZ, 'gyroz'],
                        [Lang.Blocks.ALTINO_IR1, 'ir1'],
                        [Lang.Blocks.ALTINO_IR2, 'ir2'],
                        [Lang.Blocks.ALTINO_IR3, 'ir3'],
                        [Lang.Blocks.ALTINO_IR4, 'ir4'],
                        [Lang.Blocks.ALTINO_IR5, 'ir5'],
                        [Lang.Blocks.ALTINO_IR6, 'ir6'],
                        [Lang.Blocks.ALTINO_TEM, 'tem'],                        
                        [Lang.Blocks.ALTINO_TOR2, 'tor2'],
                        [Lang.Blocks.ALTINO_TOR1, 'tor1'],
                        //[Lang.Blocks.ALTINO_STVAR, 'stvar'],
                        [Lang.Blocks.ALTINO_STTOR, 'sttor'],
                        [Lang.Blocks.ALTINO_BAT, 'bat'],
                        //[Lang.Blocks.ALTINO_REMOTE, 'remote'],
                    ],
                    value: 'cds',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'altino_analogValue',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class: 'altino_sensor',
            isNotFor: ['altino'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;
                var dev = script.getField('DEVICE');
                return pd[dev];
            },
            syntax: { js: [], py: ['Altino.analog_value(%1)'] },
        },
        altino_stopAll: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ALTINO_stopAll, 'All'],
                        [Lang.Blocks.ALTINO_stopDrive, 'Drive'],
                        [Lang.Blocks.ALTINO_stopSteering, 'Steering'],
                        [Lang.Blocks.ALTINO_stopSound, 'Sound'],
                        [Lang.Blocks.ALTINO_stopLight, 'Light'],
                        [Lang.Blocks.ALTINO_stopDisplay, 'Display'],
                    ],
                    value: 'All',
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
                type: 'altino_stopAll',
            },
            paramsKeyMap: {
                DIRECTION: 0,
            },
            class: 'altino_output',
            isNotFor: ['altino'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var direction = script.getField('DIRECTION', script);

                if (direction == 'All') {
                    sq.steering = 0;
                    sq.rightWheel = 0;
                    sq.leftWheel = 0;
                    sq.note = 0;
                    sq.led = 0;
                    sq.led2 = sq.led2 & 0x3f;
                    sq.ascii = 0;
                    sq.dot1 = 0;
                    sq.dot2 = 0;
                    sq.dot3 = 0;
                    sq.dot4 = 0;
                    sq.dot5 = 0;
                    sq.dot6 = 0;
                    sq.dot7 = 0;
                    sq.dot8 = 0;
                } else if (direction == 'Drive') {
                    sq.rightWheel = 0;
                    sq.leftWheel = 0;
                } else if (direction == 'Steering') {
                    sq.steering = 0;
                } else if (direction == 'Sound') {
                    sq.note = 0;
                } else if (direction == 'Light') {
                    sq.led = 0;
                    sq.led2 = sq.led2 & 0x3f;
                    /*
                    sq.led = sq.led & 0xfc;
                    sq.led = sq.led & 0xf3;
                    sq.led2 = sq.led2 & 0x3f;
                    sq.led = sq.led & 0x5f;
                    sq.led = sq.led & 0xaf;
                    */
                } else if (direction == 'Display') {
                    sq.ascii = 0;
                    sq.dot1 = 0;
                    sq.dot2 = 0;
                    sq.dot3 = 0;
                    sq.dot4 = 0;
                    sq.dot5 = 0;
                    sq.dot6 = 0;
                    sq.dot7 = 0;
                    sq.dot8 = 0;
                } 
                
                return script.callReturn();
            },
            syntax: { js: [], py: ['Altino.stop(%1)'] },
        },
        altino_steering: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ALTINO_Steering_Angle_Center, 'Center'],
                        [Lang.Blocks.ALTINO_Steering_Angle_Left5, 'Left5'],
                        [Lang.Blocks.ALTINO_Steering_Angle_Left10, 'Left10'],
                        [Lang.Blocks.ALTINO_Steering_Angle_Left15, 'Left15'],
                        [Lang.Blocks.ALTINO_Steering_Angle_Left20, 'Left20'],
                        [Lang.Blocks.ALTINO_Steering_Angle_Right5, 'Right5'],
                        [Lang.Blocks.ALTINO_Steering_Angle_Right10, 'Right10'],
                        [Lang.Blocks.ALTINO_Steering_Angle_Right15, 'Right15'],
                        [Lang.Blocks.ALTINO_Steering_Angle_Right20, 'Right20'],
                    ],
                    value: 'Center',
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
                type: 'altino_steering',
            },
            paramsKeyMap: {
                DIRECTION: 0,
            },
            class: 'altino_output',
            isNotFor: ['altino'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var direction = script.getField('DIRECTION', script);

                if (direction == 'Center') {
                    sq.steering = 2;
                } else if (direction == 'Left5') {
                    sq.steering = 160;
                } else if (direction == 'Left10') {
                    sq.steering = 192;
                } else if (direction == 'Left15') {
                    sq.steering = 224;
                } else if (direction == 'Left20') {
                    sq.steering = 255;
                } else if (direction == 'Right5') {
                    sq.steering = 32;
                } else if (direction == 'Right10') {
                    sq.steering = 64;
                } else if (direction == 'Right15') {
                    sq.steering = 96;
                } else if (direction == 'Right20') {
                    sq.steering = 127;
                }
                return script.callReturn();
            },
            syntax: { js: [], py: ['Altino.steering(%1)'] },
        },
        altino_steering_hex: {
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
                    null,
                ],
                type: 'altino_steering_hex',
            },
            paramsKeyMap: {
                steerVal: 0,
            },
            class: 'altino_expert',
            isNotFor: ['altino'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                sq.steering = script.getNumberValue('steerVal');
                return script.callReturn();
            },
            syntax: { js: [], py: ['Altino.steering_hex(%1)'] },
        },  
        altino_sound_hex: {
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
                    null,
                ],
                type: 'altino_sound_hex',
            },
            paramsKeyMap: {
                soundVal: 0,
            },
            class: 'altino_expert',
            isNotFor: ['altino'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                sq.note = script.getNumberValue('soundVal');
                return script.callReturn();
            },
            syntax: { js: [], py: ['Altino.sound_hex(%1)'] },
        },      
        altino_rear_wheel: {
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
                        params: ['400'],
                    },
                    {
                        type: 'text',
                        params: ['400'],
                    },
                    null,
                ],
                type: 'altino_rear_wheel',
            },
            paramsKeyMap: {
                leftWheel: 0,
                rightWheel: 1,
            },
            class: 'altino_output',
            isNotFor: ['altino'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;

                sq.rightWheel = script.getNumberValue('rightWheel');
                sq.leftWheel = script.getNumberValue('leftWheel');
                return script.callReturn();
            },
            syntax: { js: [], py: ['Altino.rear_wheel(%1, %2)'] },
        },       
        altino_sound: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1-' + Lang.Blocks.ALTINO_sound_oct, '1'],
                        ['2-' + Lang.Blocks.ALTINO_sound_oct, '2'],
                        ['3-' + Lang.Blocks.ALTINO_sound_oct, '3'],
                        ['4-' + Lang.Blocks.ALTINO_sound_oct, '4'],
                        ['5-' + Lang.Blocks.ALTINO_sound_oct, '5'],
                        ['6-' + Lang.Blocks.ALTINO_sound_oct, '6'],
                        ['7-' + Lang.Blocks.ALTINO_sound_oct, '7'],
                        ['8-' + Lang.Blocks.ALTINO_sound_oct, '8'],
                    ],
                    value: '4',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ALTINO_h, 'NOT'],
                        [Lang.Blocks.ALTINO_c, 'C'],
                        [Lang.Blocks.ALTINO_c2, 'C#'],
                        [Lang.Blocks.ALTINO_d, 'D'],
                        [Lang.Blocks.ALTINO_d2, 'D#'],
                        [Lang.Blocks.ALTINO_e, 'E'],
                        [Lang.Blocks.ALTINO_f, 'F'],
                        [Lang.Blocks.ALTINO_f2, 'F#'],
                        [Lang.Blocks.ALTINO_g, 'G'],
                        [Lang.Blocks.ALTINO_g2, 'G#'],
                        [Lang.Blocks.ALTINO_a, 'A'],
                        [Lang.Blocks.ALTINO_a2, 'A#'],
                        [Lang.Blocks.ALTINO_b, 'B'],
                    ],
                    value: 'NOT',
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
                type: 'altino_sound',
            },
            paramsKeyMap: {
                OCTAVE: 0,
                NOTE: 1,
            },
            class: 'altino_output',
            isNotFor: ['altino'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var octave = script.getStringField('OCTAVE', script);
                var note = script.getStringField('NOTE', script);
                var octave_int = octave + note;

                if (note == 'NOT') sq.note = 0;
                else if (octave_int == '1C') sq.note = 1;
                else if (octave_int == '1C#') sq.note = 2;
                else if (octave_int == '1D') sq.note = 3;
                else if (octave_int == '1D#') sq.note = 4;
                else if (octave_int == '1E') sq.note = 5;
                else if (octave_int == '1F') sq.note = 6;
                else if (octave_int == '1F#') sq.note = 7;
                else if (octave_int == '1G') sq.note = 8;
                else if (octave_int == '1G#') sq.note = 9;
                else if (octave_int == '1A') sq.note = 10;
                else if (octave_int == '1A#') sq.note = 11;
                else if (octave_int == '1B') sq.note = 12;
                else if (octave_int == '2C') sq.note = 13;
                else if (octave_int == '2C#') sq.note = 14;
                else if (octave_int == '2D') sq.note = 15;
                else if (octave_int == '2D#') sq.note = 16;
                else if (octave_int == '2E') sq.note = 17;
                else if (octave_int == '2F') sq.note = 18;
                else if (octave_int == '2F#') sq.note = 19;
                else if (octave_int == '2G') sq.note = 20;
                else if (octave_int == '2G#') sq.note = 21;
                else if (octave_int == '2A') sq.note = 22;
                else if (octave_int == '2A#') sq.note = 23;
                else if (octave_int == '2B') sq.note = 24;
                else if (octave_int == '3C') sq.note = 25;
                else if (octave_int == '3C#') sq.note = 26;
                else if (octave_int == '3D') sq.note = 27;
                else if (octave_int == '3D#') sq.note = 28;
                else if (octave_int == '3E') sq.note = 29;
                else if (octave_int == '3F') sq.note = 30;
                else if (octave_int == '3F#') sq.note = 31;
                else if (octave_int == '3G') sq.note = 32;
                else if (octave_int == '3G#') sq.note = 33;
                else if (octave_int == '3A') sq.note = 34;
                else if (octave_int == '3A#') sq.note = 35;
                else if (octave_int == '3B') sq.note = 36;
                else if (octave_int == '4C') sq.note = 37;
                else if (octave_int == '4C#') sq.note = 38;
                else if (octave_int == '4D') sq.note = 39;
                else if (octave_int == '4D#') sq.note = 40;
                else if (octave_int == '4E') sq.note = 41;
                else if (octave_int == '4F') sq.note = 42;
                else if (octave_int == '4F#') sq.note = 43;
                else if (octave_int == '4G') sq.note = 44;
                else if (octave_int == '4G#') sq.note = 45;
                else if (octave_int == '4A') sq.note = 46;
                else if (octave_int == '4A#') sq.note = 47;
                else if (octave_int == '4B') sq.note = 48;
                else if (octave_int == '5C') sq.note = 49;
                else if (octave_int == '5C#') sq.note = 50;
                else if (octave_int == '5D') sq.note = 51;
                else if (octave_int == '5D#') sq.note = 52;
                else if (octave_int == '5E') sq.note = 53;
                else if (octave_int == '5F') sq.note = 54;
                else if (octave_int == '5F#') sq.note = 55;
                else if (octave_int == '5G') sq.note = 56;
                else if (octave_int == '5G#') sq.note = 57;
                else if (octave_int == '5A') sq.note = 58;
                else if (octave_int == '5A#') sq.note = 59;
                else if (octave_int == '5B') sq.note = 60;
                else if (octave_int == '6C') sq.note = 61;
                else if (octave_int == '6C#') sq.note = 62;
                else if (octave_int == '6D') sq.note = 63;
                else if (octave_int == '6D#') sq.note = 64;
                else if (octave_int == '6E') sq.note = 65;
                else if (octave_int == '6F') sq.note = 66;
                else if (octave_int == '6F#') sq.note = 67;
                else if (octave_int == '6G') sq.note = 68;
                else if (octave_int == '6G#') sq.note = 69;
                else if (octave_int == '6A') sq.note = 70;
                else if (octave_int == '6A#') sq.note = 71;
                else if (octave_int == '6B') sq.note = 72;
                else if (octave_int == '7C') sq.note = 73;
                else if (octave_int == '7C#') sq.note = 74;
                else if (octave_int == '7D') sq.note = 75;
                else if (octave_int == '7D#') sq.note = 76;
                else if (octave_int == '7E') sq.note = 77;
                else if (octave_int == '7F') sq.note = 78;
                else if (octave_int == '7F#') sq.note = 79;
                else if (octave_int == '7G') sq.note = 80;
                else if (octave_int == '7G#') sq.note = 81;
                else if (octave_int == '7A') sq.note = 82;
                else if (octave_int == '7A#') sq.note = 83;
                else if (octave_int == '7B') sq.note = 84;
                else if (octave_int == '8C') sq.note = 85;
                else if (octave_int == '8C#') sq.note = 86;
                else if (octave_int == '8D') sq.note = 87;
                else if (octave_int == '8D#') sq.note = 88;
                else if (octave_int == '8E') sq.note = 89;
                else if (octave_int == '8F') sq.note = 90;
                else if (octave_int == '8F#') sq.note = 91;
                else if (octave_int == '8G') sq.note = 92;
                else if (octave_int == '8G#') sq.note = 93;
                else if (octave_int == '8A') sq.note = 94;
                else if (octave_int == '8A#') sq.note = 95;
                else if (octave_int == '8B') sq.note = 96;
                return script.callReturn();
            },
            syntax: { js: [], py: ['Altino.sound(%1, %2)'] },
        },
        altino_light: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ALTINO_Led_Forward_Light, '2'],
                        [Lang.Blocks.ALTINO_Led_Turn_Left_Light, '5'],
                        [Lang.Blocks.ALTINO_Led_Turn_Right_Light, '6'],
                        [Lang.Blocks.ALTINO_Led_Brake_Light, '4'],
                        [Lang.Blocks.ALTINO_Led_Reverse_Light, '3'],
                    ],
                    value: '2',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [[Lang.Blocks.ALTINO_h2, '255'], [Lang.Blocks.ALTINO_h, '0']],
                    value: '255',
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
                type: 'altino_light',
            },
            paramsKeyMap: {
                SELECT: 0,
                ONOFF: 1,
            },
            class: 'altino_output',
            isNotFor: ['altino'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var select = script.getStringField('SELECT', script);
                var onoff = script.getStringField('ONOFF', script);

                if (select == '2' && onoff == '255') {
                    sq.led = sq.led | 0x03;
                } else if (select == '2' && onoff == '0') {
                    sq.led = sq.led & 0xfc;
                }

                if (select == '3' && onoff == '255') {
                    sq.led = sq.led | 0x0c;
                } else if (select == '3' && onoff == '0') {
                    sq.led = sq.led & 0xf3;
                }

                if (select == '4' && onoff == '255') {
                    sq.led2 = sq.led2 | 0xc0;
                } else if (select == '4' && onoff == '0') {
                    sq.led2 = sq.led2 & 0x3f;
                }

                if (select == '5' && onoff == '255') {
                    sq.led = sq.led | 0xa0;
                } else if (select == '5' && onoff == '0') {
                    sq.led = sq.led & 0x5f;
                }

                if (select == '6' && onoff == '255') {
                    sq.led = sq.led | 0x50;
                } else if (select == '6' && onoff == '0') {
                    sq.led = sq.led & 0xaf;
                }

                //sq.led = 0xff;
                return script.callReturn();
            },
            syntax: { js: [], py: ['Altino.light(%1, %2)'] },
        },
        altino_dot_display_matrix_on: {
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
                        params: ['1'],
                    },
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'altino_dot_display_matrix_on',
            },
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
            },
            class: 'altino_expert',
            isNotFor: ['altino'],
            func: function(sprite, script) {
                
                var sq = Entry.hw.sendQueue;
                var nx = script.getNumberValue('VALUE1');
                var ny = script.getNumberValue('VALUE2');
                var mask = 1;
                
                if((ny >= 1) && (ny <= 8)){
                    ny = ny - 1;
                    mask = mask << ny;
                    if(nx == 1){
                        sq.dot8 |= mask;
                    }else if(nx == 2){
                        sq.dot7 |= mask;
                    }else if(nx == 3){
                        sq.dot6 |= mask;
                    }else if(nx == 4){
                        sq.dot5 |= mask;
                    }else if(nx == 5){
                        sq.dot4 |= mask;
                    }else if(nx == 6){
                        sq.dot3 |= mask;
                    }else if(nx == 7){
                        sq.dot2 |= mask;
                    }else if(nx == 8){
                        sq.dot1 |= mask;
                    }
                }
                
                return script.callReturn();
            },
            syntax: { js: [], py: ['Altino.dot_display_matrix_on(%1, %2)'] },
        },
        altino_dot_display_matrix_off: {
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
                        params: ['1'],
                    },
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'altino_dot_display_matrix_off',
            },
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
            },
            class: 'altino_expert',
            isNotFor: ['altino'],
            func: function(sprite, script) {
                
                var sq = Entry.hw.sendQueue;
                var nx = script.getNumberValue('VALUE1');
                var ny = script.getNumberValue('VALUE2');
                var mask = 1;

                if((ny >= 1) && (ny <= 8)){
                    ny = ny - 1;
                    mask = mask << ny;
                    if(nx == 1){
                        sq.dot8 &= ~mask;
                    }else if(nx == 2){
                        sq.dot7 &= ~mask;
                    }else if(nx == 3){
                        sq.dot6 &= ~mask;
                    }else if(nx == 4){
                        sq.dot5 &= ~mask;
                    }else if(nx == 5){
                        sq.dot4 &= ~mask;
                    }else if(nx == 6){
                        sq.dot3 &= ~mask;
                    }else if(nx == 7){
                        sq.dot2 &= ~mask;
                    }else if(nx == 8){
                        sq.dot1 &= ~mask;
                    }
                }
                return script.callReturn();
            },
            syntax: { js: [], py: ['Altino.dot_display_matrix_off(%1, %2)'] },
        },
        altino_light_hex: {
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
                        params: ['0x00'],
                    },
                    {
                        type: 'text',
                        params: ['0x00'],
                    },
                    null,
                ],
                type: 'altino_light_hex',
            },
            paramsKeyMap: {
                MSB: 0,
                LSB: 1,
            },
            class: 'altino_expert',
            isNotFor: ['altino'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var msb = script.getNumberValue('MSB');
                var lsb = script.getNumberValue('LSB');

                sq.led2 = (msb & 0xC0) | (sq.led2 & 0x3F); 
                sq.led = lsb;

                return script.callReturn();
            },
            syntax: { js: [], py: ['Altino.light_hex(%1, %2)'] },
        },    
        altino_dot_display: {
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
                        params: ['A'],
                    },
                    null,
                ],
                type: 'altino_dot_display',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'altino_output',
            isNotFor: ['altino'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var str = script.getStringValue('VALUE');
                sq.ascii = str.charCodeAt(0);

                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Altino.dot_display(%1)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        altino_dot_display_line: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ALTINO_dot_line_1, '1'],
                        [Lang.Blocks.ALTINO_dot_line_2, '2'],
                        [Lang.Blocks.ALTINO_dot_line_3, '3'],
                        [Lang.Blocks.ALTINO_dot_line_4, '4'],
                        [Lang.Blocks.ALTINO_dot_line_5, '5'],
                        [Lang.Blocks.ALTINO_dot_line_6, '6'],
                        [Lang.Blocks.ALTINO_dot_line_7, '7'],
                        [Lang.Blocks.ALTINO_dot_line_8, '8'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [[Lang.Blocks.ALTINO_h2, '1'], [Lang.Blocks.ALTINO_h, '0']],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [[Lang.Blocks.ALTINO_h2, '1'], [Lang.Blocks.ALTINO_h, '0']],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [[Lang.Blocks.ALTINO_h2, '1'], [Lang.Blocks.ALTINO_h, '0']],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [[Lang.Blocks.ALTINO_h2, '1'], [Lang.Blocks.ALTINO_h, '0']],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [[Lang.Blocks.ALTINO_h2, '1'], [Lang.Blocks.ALTINO_h, '0']],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [[Lang.Blocks.ALTINO_h2, '1'], [Lang.Blocks.ALTINO_h, '0']],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [[Lang.Blocks.ALTINO_h2, '1'], [Lang.Blocks.ALTINO_h, '0']],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [[Lang.Blocks.ALTINO_h2, '1'], [Lang.Blocks.ALTINO_h, '0']],
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
                params: [null, null, null, null, null, null, null, null, null, null],
                type: 'altino_dot_display_line',
            },
            paramsKeyMap: {
                LINE: 0,
                SW1: 1,
                SW2: 2,
                SW3: 3,
                SW4: 4,
                SW5: 5,
                SW6: 6,
                SW7: 7,
                SW8: 8,
            },
            class: 'altino_output',
            isNotFor: ['altino'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var line = script.getStringField('LINE', script);
                var dots = [
                    script.getStringField('SW1', script),
                    script.getStringField('SW2', script),
                    script.getStringField('SW3', script),
                    script.getStringField('SW4', script),
                    script.getStringField('SW5', script),
                    script.getStringField('SW6', script),
                    script.getStringField('SW7', script),
                    script.getStringField('SW8', script)
            ];

                var mask = 0;

                if(line == '1'){
                    mask = 0x01;
                }else if(line == '2'){
                    mask = 0x02;
                }else if(line == '3'){
                    mask = 0x04;
                }else if(line == '4'){
                    mask = 0x08;
                }else if(line == '5'){
                    mask = 0x10;
                }else if(line == '6'){
                    mask = 0x20;
                }else if(line == '7'){
                    mask = 0x40;
                }else if(line == '8'){
                    mask = 0x80;
                }
                
                if(dots[7] == "1"){
                    sq.dot1 |= mask;
                }else{
                    sq.dot1 &= ~mask;
                }

                if(dots[6] == "1"){
                    sq.dot2 |= mask;
                }else{
                    sq.dot2 &= ~mask;
                }

                if(dots[5] == "1"){
                    sq.dot3 |= mask;
                }else{
                    sq.dot3 &= ~mask;
                }

                if(dots[4] == "1"){
                    sq.dot4 |= mask;
                }else{
                    sq.dot4 &= ~mask;
                }

                if(dots[3] == "1"){
                    sq.dot5 |= mask;
                }else{
                    sq.dot5 &= ~mask;
                }

                if(dots[2] == "1"){
                    sq.dot6 |= mask;
                }else{
                    sq.dot6 &= ~mask;
                }

                if(dots[1] == "1"){
                    sq.dot7 |= mask;
                }else{
                    sq.dot7 &= ~mask;
                }

                if(dots[0] == "1"){
                    sq.dot8 |= mask;
                }else{
                    sq.dot8 &= ~mask;
                }

                //sq.led = 0xff;
                return script.callReturn();
            },
            syntax: { js: [], py: ['Altino.dot_display_line(%1, %2, %3, %4, %5, %6, %7, %8)'] },
        },
        altino_dot_display_hex: {
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
                        params: ['0x00'],
                    },
                    {
                        type: 'text',
                        params: ['0x00'],
                    },
                    {
                        type: 'text',
                        params: ['0x00'],
                    },
                    {
                        type: 'text',
                        params: ['0x00'],
                    },
                    {
                        type: 'text',
                        params: ['0x00'],
                    },
                    {
                        type: 'text',
                        params: ['0x00'],
                    },
                    {
                        type: 'text',
                        params: ['0x00'],
                    },
                    {
                        type: 'text',
                        params: ['0x00'],
                    },
                    null,
                ],
                type: 'altino_dot_display_hex',
            },
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
                VALUE3: 2,
                VALUE4: 3,
                VALUE5: 4,
                VALUE6: 5,
                VALUE7: 6,
                VALUE8: 7,
            },
            class: 'altino_expert',
            isNotFor: ['altino'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                sq.ascii = 0;
                sq.dot1 = script.getNumberValue('VALUE8');
                sq.dot2 = script.getNumberValue('VALUE7');
                sq.dot3 = script.getNumberValue('VALUE6');
                sq.dot4 = script.getNumberValue('VALUE5');
                sq.dot5 = script.getNumberValue('VALUE4');
                sq.dot6 = script.getNumberValue('VALUE3');
                sq.dot7 = script.getNumberValue('VALUE2');
                sq.dot8 = script.getNumberValue('VALUE1');

                return script.callReturn();
            },
            syntax: { js: [], py: ['Altino.dot_display_hex(%1, %2, %3, %4, %5, %6, %7, %8)'] },
        },
        //endregion Altino 알티노
    };
};

module.exports = Entry.Altino;
