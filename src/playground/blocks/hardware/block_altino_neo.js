'use strict';

Entry.AltinoNeo = {
    PORT_MAP: {
        rightWheel: 0,
        leftWheel: 0,
        steering: 0,
        led1: 0,
        led2: 0,
        note: 0,
        ascii: 0,
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
        var portMap = Entry.AltinoNeo.PORT_MAP;
        var sq = Entry.hw.sendQueue;
        for (var port in portMap) {
            sq[port] = portMap[port];
        }
        Entry.hw.update();
        // var Altino = Entry.Altino;
        // Altino.removeAllTimeouts();
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
    id: '18.4',
    name: 'altino_neo',
    url: 'http://saeon.co.kr/',
    imageName: 'altino_neo.png',
    title: {
        en: 'Altino Neo',
        ko: '알티노 네오',
    },
};

Entry.AltinoNeo.blockMenuBlocks = [
    'altino_neo_analogValue',
    'altino_neo_stopAll',
    'altino_neo_rear_wheel',
    'altino_neo_steering',
    'altino_neo_sound',
    'altino_neo_light',
    'altino_neo_dot_display',
    'altino_neo_dot_display_line',
    'altino_neo_steering_hex',
    'altino_neo_light_hex',
    'altino_neo_sound_hex',
    'altino_neo_dot_display_hex',
    'altino_neo_dot_display_matrix_on',
    'altino_neo_dot_display_matrix_off',
];

Entry.AltinoNeo.setLanguage = function() {
    return {
        ko: {
            // ko.js에 작성하던 내용
            Blocks: {
                altino_neo_BAT: '배터리',
                altino_neo_CDS: '조도',
                altino_neo_TOF1: 'TOF-1',
                altino_neo_TOF2: 'TOF-2',
                altino_neo_TOF3: 'TOF-3',
                altino_neo_TOF4: 'TOF-4',
                altino_neo_TOF5: 'TOF-5',
                altino_neo_TOF6: 'TOF-6',
                altino_neo_ACC_X: '가속도-X',
                altino_neo_ACC_Y: '가속도-Y',
                altino_neo_ACC_Z: '가속도-Z',
                altino_neo_MAG_X: '지자기-X',
                altino_neo_MAG_Y: '지자기-Y',
                altino_neo_MAG_Z: '지자기-Z',
                altino_neo_GYRO_X: '자이로-X',
                altino_neo_GYRO_Y: '자이로-Y',
                altino_neo_GYRO_Z: '자이로-Z',
                altino_neo_AHRS_Roll: '횡전각',
                altino_neo_AHRS_Pitch: '종전각',
                altino_neo_AHRS_Yaw: '편향각',
                altino_neo_Temp: '온도',
                altino_neo_Left_Wheel_Torque: '왼쪽 뒷바퀴 전류',
                altino_neo_Right_Wheel_Torque: '오른쪽 뒷바퀴 전류',
                altino_neo_Led_Brake_Light: '브레이크',
                altino_neo_Led_Forward_Light: '전방',
                altino_neo_Led_Backward_Light: '후방',
                altino_neo_Led_Turn_Left_Light: '왼쪽 방향지시',
                altino_neo_Led_Turn_Right_Light: '오른쪽 방향지시',
                altino_neo_Line: '번째 줄',
                altino_neo_Steering_Angle_Center: '중앙',
                altino_neo_Steering_Angle_Left10: '왼쪽으로-10',
                altino_neo_Steering_Angle_Left15: '왼쪽으로-15',
                altino_neo_Steering_Angle_Left20: '왼쪽으로-20',
                altino_neo_Steering_Angle_Left5: '왼쪽으로-5',
                altino_neo_Steering_Angle_Right10: '오른쪽으로-10',
                altino_neo_Steering_Angle_Right15: '오른쪽으로-15',
                altino_neo_Steering_Angle_Right20: '오른쪽으로-20',
                altino_neo_Steering_Angle_Right5: '오른쪽으로-5',
                altino_neo_Value: '출력 값',
                altino_neo_a: 'A(라)',
                altino_neo_a2: 'A#(라#)',
                altino_neo_b: 'B(시)',
                altino_neo_c: 'C(도)',
                altino_neo_c2: 'C#(도#)',
                altino_neo_d: 'D(레)',
                altino_neo_d2: 'D#(레#)',
                altino_neo_dot_display_1: '한문자',
                altino_neo_dot_display_2: '출력하기',
                altino_neo_e: 'E(미)',
                altino_neo_f: 'F(파)',
                altino_neo_f2: 'F#(파#)',
                altino_neo_g: 'G(솔)',
                altino_neo_g2: 'G#(솔#)',
                altino_neo_sound_oct: '옥타브',
                altino_neo_h: '끄기',
                altino_neo_h2: '켜기',
                altino_neo_leftWheel: '왼쪽',
                altino_neo_melody_ms: '연주하기',
                altino_neo_outputValue: '출력 값',
                altino_neo_rightWheel: '오른쪽',
                altino_neo_set: '로 정하기',
                altino_neo_stopAll: '모두',
                altino_neo_stopDrive: '주행',
                altino_neo_stopSteering: '조향',
                altino_neo_stopSound: '소리',
                altino_neo_stopLight: '라이트',
                altino_neo_stopDisplay: '표시하기',
                altino_neo_dot_line_1: '1행',
                altino_neo_dot_line_2: '2행',
                altino_neo_dot_line_3: '3행',
                altino_neo_dot_line_4: '4행',
                altino_neo_dot_line_5: '5행',
                altino_neo_dot_line_6: '6행',
                altino_neo_dot_line_7: '7행',
                altino_neo_dot_line_8: '8행',
            },
            template: {
                altino_neo_analogValue: '알티노 네오 %1 센서값',
                altino_neo_stopAll: '정지 %1 %2',
                altino_neo_dot_display: '표시하기 %1 %2',
                altino_neo_dot_display_line: '표시하기 %1 %2 %3 %4 %5 %6 %7 %8 %9 %10',
                altino_neo_dot_display_hex: '표시하기 %1 %2 %3 %4 %5 %6 %7 %8 %9',
                altino_neo_dot_display_matrix_on: '표시하기 켜기 X:%1 Y:%2 %3',
                altino_neo_dot_display_matrix_off: '표시하기 끄기 X:%1 Y:%2 %3',
                altino_neo_light: '라이트%1 %2 %3',
                altino_neo_light_hex: '라이트%1 %2 %3',
                altino_neo_sound_hex: '소리%1 %2',
                altino_neo_rear_wheel: '뒷바퀴 구동 좌:%1 우:%2%3',
                altino_neo_sound: '소리 %1 %2 %3',
                altino_neo_steering_hex: '조향 %1%2',
                altino_neo_steering: '조향 %1°%2',
            },
        },
        en: {
            // en.js에 작성하던 내용
            Blocks: {
                altino_neo_BAT: 'BAT',
                altino_neo_CDS: 'CDS',
                altino_neo_TOF1: 'TOF-1',
                altino_neo_TOF2: 'TOF-2',
                altino_neo_TOF3: 'TOF-3',
                altino_neo_TOF4: 'TOF-4',
                altino_neo_TOF5: 'TOF-5',
                altino_neo_TOF6: 'TOF-6',
                altino_neo_ACC_X: 'ACC-X',
                altino_neo_ACC_Y: 'ACC-Y',
                altino_neo_ACC_Z: 'ACC-Z',
                altino_neo_MAG_X: 'MAG-X',
                altino_neo_MAG_Y: 'MAG-Y',
                altino_neo_MAG_Z: 'MAG-Z',
                altino_neo_GYRO_X: 'GYRO-X',
                altino_neo_GYRO_Y: 'GYRO-Y',
                altino_neo_GYRO_Z: 'GYRO-Z',
                altino_neo_AHRS_Roll: 'ROLL',
                altino_neo_AHRS_Pitch: 'PITCH',
                altino_neo_AHRS_Yaw: 'YAW',
                altino_neo_Temp: 'TEMP',
                altino_neo_Left_Wheel_Torque: 'LEFT TORQUE',
                altino_neo_Right_Wheel_Torque: 'RIGHT TORQUE',
                altino_neo_Led_Brake_Light: 'Brake',
                altino_neo_Led_Forward_Light: 'Forward',
                altino_neo_Led_Backward_Light: 'Backward',
                altino_neo_Led_Turn_Left_Light: 'Turn Left',
                altino_neo_Led_Turn_Right_Light: 'Turn Right',
                altino_neo_Line: 'line',
                altino_neo_Steering_Angle_Center: 'Center-0',
                altino_neo_Steering_Angle_Left10: 'Left-10',
                altino_neo_Steering_Angle_Left15: 'Left-15',
                altino_neo_Steering_Angle_Left20: 'Left-20',
                altino_neo_Steering_Angle_Left5: 'Left-5',
                altino_neo_Steering_Angle_Right10: 'Right-10',
                altino_neo_Steering_Angle_Right15: 'Right-15',
                altino_neo_Steering_Angle_Right20: 'Right-20',
                altino_neo_Steering_Angle_Right5: 'Right-5',
                altino_neo_Value: 'output value',
                altino_neo_a: 'A(la)',
                altino_neo_a2: 'A#(la#)',
                altino_neo_b: 'B(si)',
                altino_neo_c: 'C(do)',
                altino_neo_c2: 'C#(do#)',
                altino_neo_d: 'D(re)',
                altino_neo_d2: 'D#(re#)',
                altino_neo_dot_display_1: 'one char',
                altino_neo_dot_display_2: 'display',
                altino_neo_e: 'E(mi)',
                altino_neo_f: 'F(fa)',
                altino_neo_f2: 'F#(fa#)',
                altino_neo_g: 'G(sol)',
                altino_neo_g2: 'G#(sol#)',
                altino_neo_sound_oct: 'Oct',
                altino_neo_h: 'Off',
                altino_neo_h2: 'On',
                altino_neo_leftWheel: 'left',
                altino_neo_melody_ms: 'play',
                altino_neo_outputValue: 'output',
                altino_neo_rightWheel: 'right',
                altino_neo_set: ' display',
                altino_neo_stopAll: 'All',
                altino_neo_stopDrive: 'Drive',
                altino_neo_stopSteering: 'Steering',
                altino_neo_stopSound: 'Sound',
                altino_neo_stopLight: 'Light',
                altino_neo_stopDisplay: 'Display',
                altino_neo_dot_line_1: 'Line-1',
                altino_neo_dot_line_2: 'Line-2',
                altino_neo_dot_line_3: 'Line-3',
                altino_neo_dot_line_4: 'Line-4',
                altino_neo_dot_line_5: 'Line-5',
                altino_neo_dot_line_6: 'Line-6',
                altino_neo_dot_line_7: 'Line-7',
                altino_neo_dot_line_8: 'Line-8',
            },
            template: {
                altino_neo_analogValue: 'Altino neo %1 sensor value',
                altino_neo_stopAll: 'Stop %1°%2',
                altino_neo_dot_display: 'Display %1 %2',
                altino_neo_dot_display_line: 'Display %1 %2 %3 %4 %5 %6 %7 %8 %9 %10',
                altino_neo_dot_display_hex: 'Display %1 %2 %3 %4 %5 %6 %7 %8 %9',
                altino_neo_dot_display_matrix_on: 'Display On X:%1 Y:%2 %3',
                altino_neo_dot_display_matrix_off: 'Display Off X:%1 Y:%2 %3',
                altino_neo_light: 'Light %1 %2 %3',
                altino_neo_light_hex: 'Light %1 %2 %3',
                altino_neo_sound_hex: 'Sound %1 %2',
                altino_neo_rear_wheel: 'Go L:%1 R:%2%3',
                altino_neo_sound: 'Sound %1 %2 %3',
                altino_neo_steering_hex: 'Steering %1%2',
                altino_neo_steering: 'Steering %1°%2',
            },
        },
    };
};

Entry.AltinoNeo.getBlocks = function() {
    return {
        //region Altino 알티노
        altino_neo_analogValue: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.altino_neo_CDS, 'cds'],
                        [Lang.Blocks.altino_neo_TOF1, 'tof1'],
                        [Lang.Blocks.altino_neo_TOF2, 'tof2'],
                        [Lang.Blocks.altino_neo_TOF3, 'tof3'],
                        [Lang.Blocks.altino_neo_TOF4, 'tof4'],
                        [Lang.Blocks.altino_neo_TOF5, 'tof5'],
                        [Lang.Blocks.altino_neo_TOF6, 'tof6'],
                        [Lang.Blocks.altino_neo_BAT, 'bat'],
                        [Lang.Blocks.altino_neo_ACC_X, 'accx'],
                        [Lang.Blocks.altino_neo_ACC_Y, 'accy'],
                        [Lang.Blocks.altino_neo_ACC_Z, 'accz'],
                        [Lang.Blocks.altino_neo_MAG_X, 'magx'],
                        [Lang.Blocks.altino_neo_MAG_Y, 'magy'],
                        [Lang.Blocks.altino_neo_MAG_Z, 'magz'],
                        [Lang.Blocks.altino_neo_GYRO_X, 'gyrox'],
                        [Lang.Blocks.altino_neo_GYRO_Y, 'gyroy'],
                        [Lang.Blocks.altino_neo_GYRO_Z, 'gyroz'],
                        [Lang.Blocks.altino_neo_AHRS_Roll, 'roll'],
                        [Lang.Blocks.altino_neo_AHRS_Pitch, 'pitch'],
                        [Lang.Blocks.altino_neo_AHRS_Yaw, 'yaw'],
                        [Lang.Blocks.altino_neo_Temp, 'temp'],
                        [Lang.Blocks.altino_neo_Left_Wheel_Torque, 'leftTorque'],
                        [Lang.Blocks.altino_neo_Right_Wheel_Torque, 'rightTorque'],
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
                type: 'altino_neo_analogValue',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class: 'altino_neo_sensor',
            isNotFor: ['altino_neo'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;
                var dev = script.getField('DEVICE');
                return pd[dev];
            },
            syntax: { js: [], py: ['AltinoNeo.analog_value(%1)'] },
        },
        altino_neo_stopAll: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.altino_neo_stopAll, 'All'],
                        [Lang.Blocks.altino_neo_stopDrive, 'Drive'],
                        [Lang.Blocks.altino_neo_stopSteering, 'Steering'],
                        [Lang.Blocks.altino_neo_stopSound, 'Sound'],
                        [Lang.Blocks.altino_neo_stopLight, 'Light'],
                        [Lang.Blocks.altino_neo_stopDisplay, 'Display'],
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
                type: 'altino_neo_stopAll',
            },
            paramsKeyMap: {
                DIRECTION: 0,
            },
            class: 'altino_neo_output',
            isNotFor: ['altino_neo'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var direction = script.getField('DIRECTION', script);

                if (direction == 'All') {
                    sq.steering = 0;
                    sq.rightWheel = 0;
                    sq.leftWheel = 0;
                    sq.note = 0;
                    sq.led1 = 0;
                    sq.led2 = 0;
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
                    sq.led1 = 0;
                    sq.led2 = 0;
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
            syntax: { js: [], py: ['AltinoNeo.stop(%1)'] },
        },
        altino_neo_steering: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.altino_neo_Steering_Angle_Center, 'Center'],
                        [Lang.Blocks.altino_neo_Steering_Angle_Left5, 'Left5'],
                        [Lang.Blocks.altino_neo_Steering_Angle_Left10, 'Left10'],
                        [Lang.Blocks.altino_neo_Steering_Angle_Left15, 'Left15'],
                        [Lang.Blocks.altino_neo_Steering_Angle_Left20, 'Left20'],
                        [Lang.Blocks.altino_neo_Steering_Angle_Right5, 'Right5'],
                        [Lang.Blocks.altino_neo_Steering_Angle_Right10, 'Right10'],
                        [Lang.Blocks.altino_neo_Steering_Angle_Right15, 'Right15'],
                        [Lang.Blocks.altino_neo_Steering_Angle_Right20, 'Right20'],
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
                type: 'altino_neo_steering',
            },
            paramsKeyMap: {
                DIRECTION: 0,
            },
            class: 'altino_neo_output',
            isNotFor: ['altino_neo'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var direction = script.getField('DIRECTION', script);

                if (direction == 'Center') {
                    sq.steering = 0;
                } else if (direction == 'Left5') {
                    sq.steering = 0xe0;
                } else if (direction == 'Left10') {
                    sq.steering = 0xc0;
                } else if (direction == 'Left15') {
                    sq.steering = 0xa1;
                } else if (direction == 'Left20') {
                    sq.steering = 0x81;
                } else if (direction == 'Right5') {
                    sq.steering = 31;
                } else if (direction == 'Right10') {
                    sq.steering = 63;
                } else if (direction == 'Right15') {
                    sq.steering = 94;
                } else if (direction == 'Right20') {
                    sq.steering = 126;
                }
                return script.callReturn();
            },
            syntax: { js: [], py: ['AltinoNeo.steering(%1)'] },
        },
        altino_neo_steering_hex: {
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
                type: 'altino_neo_steering_hex',
            },
            paramsKeyMap: {
                steerVal: 0,
            },
            class: 'altino_neo_expert',
            isNotFor: ['altino_neo'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                sq.steering = parseInt(Number(script.getStringValue('steerVal')), 10);
                return script.callReturn();
            },
            syntax: { js: [], py: ['AltinoNeo.steering_hex(%1)'] },
        },
        altino_neo_sound_hex: {
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
                type: 'altino_neo_sound_hex',
            },
            paramsKeyMap: {
                soundVal: 0,
            },
            class: 'altino_neo_expert',
            isNotFor: ['altino_neo'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                sq.note = parseInt(Number(script.getStringValue('soundVal')), 10);
                return script.callReturn();
            },
            syntax: { js: [], py: ['AltinoNeo.sound_hex(%1)'] },
        },
        altino_neo_rear_wheel: {
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
                        params: ['300'],
                    },
                    {
                        type: 'text',
                        params: ['300'],
                    },
                    null,
                ],
                type: 'altino_neo_rear_wheel',
            },
            paramsKeyMap: {
                leftWheel: 0,
                rightWheel: 1,
            },
            class: 'altino_neo_output',
            isNotFor: ['altino_neo'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;

                sq.rightWheel = script.getNumberValue('rightWheel');
                sq.leftWheel = script.getNumberValue('leftWheel');
                return script.callReturn();
            },
            syntax: { js: [], py: ['AltinoNeo.rear_wheel(%1, %2)'] },
        },
        altino_neo_sound: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {                    
                    type: 'Dropdown',
                    options: [
                        ['1-' + Lang.Blocks.altino_neo_sound_oct, '1'],
                        ['2-' + Lang.Blocks.altino_neo_sound_oct, '2'],
                        ['3-' + Lang.Blocks.altino_neo_sound_oct, '3'],
                        ['4-' + Lang.Blocks.altino_neo_sound_oct, '4'],
                        ['5-' + Lang.Blocks.altino_neo_sound_oct, '5'],
                        ['6-' + Lang.Blocks.altino_neo_sound_oct, '6'],
                        ['7-' + Lang.Blocks.altino_neo_sound_oct, '7'],
                        ['8-' + Lang.Blocks.altino_neo_sound_oct, '8'],
                    ],
                    value: '4',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.altino_neo_h, 'NOT'],
                        [Lang.Blocks.altino_neo_c, 'C'],
                        [Lang.Blocks.altino_neo_c2, 'C#'],
                        [Lang.Blocks.altino_neo_d, 'D'],
                        [Lang.Blocks.altino_neo_d2, 'D#'],
                        [Lang.Blocks.altino_neo_e, 'E'],
                        [Lang.Blocks.altino_neo_f, 'F'],
                        [Lang.Blocks.altino_neo_f2, 'F#'],
                        [Lang.Blocks.altino_neo_g, 'G'],
                        [Lang.Blocks.altino_neo_g2, 'G#'],
                        [Lang.Blocks.altino_neo_a, 'A'],
                        [Lang.Blocks.altino_neo_a2, 'A#'],
                        [Lang.Blocks.altino_neo_b, 'B'],
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
                type: 'altino_neo_sound',
            },
            paramsKeyMap: {
                OCTAVE: 0,
                NOTE: 1,
            },
            class: 'altino_neo_output',
            isNotFor: ['altino_neo'],
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
            syntax: { js: [], py: ['AltinoNeo.sound(%1, %2)'] },
        },
        altino_neo_light: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.altino_neo_Led_Forward_Light, '2'],
                        [Lang.Blocks.altino_neo_Led_Turn_Left_Light, '5'],
                        [Lang.Blocks.altino_neo_Led_Turn_Right_Light, '6'],
                        [Lang.Blocks.altino_neo_Led_Brake_Light, '4'],
                        [Lang.Blocks.altino_neo_Led_Backward_Light, '3'],
                    ],
                    value: '2',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.altino_neo_h2, '255'],
                        [Lang.Blocks.altino_neo_h, '0'],
                    ],
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
                type: 'altino_neo_light',
            },
            paramsKeyMap: {
                SELECT: 0,
                ONOFF: 1,
            },
            class: 'altino_neo_output',
            isNotFor: ['altino_neo'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var select = script.getStringField('SELECT', script);
                var onoff = script.getStringField('ONOFF', script);

                if (select == '2' && onoff == '255') {
                    sq.led2 = sq.led2 | 0x03;
                } else if (select == '2' && onoff == '0') {
                    sq.led2 = sq.led2 & 0xfc;
                }

                if (select == '3' && onoff == '255') {
                    sq.led2 = sq.led2 | 0x0c;
                } else if (select == '3' && onoff == '0') {
                    sq.led2 = sq.led2 & 0xf3;
                }

                if (select == '4' && onoff == '255') {
                    sq.led1 = sq.led1 | 0x03;
                } else if (select == '4' && onoff == '0') {
                    sq.led1 = sq.led1 & 0xfc;
                }

                if (select == '5' && onoff == '255') {
                    sq.led2 = sq.led2 | 0xa0;
                } else if (select == '5' && onoff == '0') {
                    sq.led2 = sq.led2 & 0x5f;
                }

                if (select == '6' && onoff == '255') {
                    sq.led2 = sq.led2 | 0x50;
                } else if (select == '6' && onoff == '0') {
                    sq.led2 = sq.led2 & 0xaf;
                }
                //sq.led = 0xff;
                return script.callReturn();
            },
            syntax: { js: [], py: ['AltinoNeo.light(%1, %2)'] },
        },
        altino_neo_dot_display_matrix_on: {
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
                type: 'altino_neo_dot_display_matrix_on',
            },
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
            },
            class: 'altino_neo_expert',
            isNotFor: ['altino_neo'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var nx = script.getNumberValue('VALUE1');
                var ny = script.getNumberValue('VALUE2');
                var mask = 1;

                sq.ascii = 0xff;

                if (ny >= 1 && ny <= 8) {
                    ny = ny - 1;
                    mask = mask << ny;
                    if (nx == 1) {
                        sq.dot8 |= mask;
                    } else if (nx == 2) {
                        sq.dot7 |= mask;
                    } else if (nx == 3) {
                        sq.dot6 |= mask;
                    } else if (nx == 4) {
                        sq.dot5 |= mask;
                    } else if (nx == 5) {
                        sq.dot4 |= mask;
                    } else if (nx == 6) {
                        sq.dot3 |= mask;
                    } else if (nx == 7) {
                        sq.dot2 |= mask;
                    } else if (nx == 8) {
                        sq.dot1 |= mask;
                    }
                }

                return script.callReturn();
            },
            syntax: { js: [], py: ['AltinoNeo.dot_display_matrix_on(%1, %2)'] },
        },
        altino_neo_dot_display_matrix_off: {
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
                type: 'altino_neo_dot_display_matrix_off',
            },
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
            },
            class: 'altino_neo_expert',
            isNotFor: ['altino_neo'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var nx = script.getNumberValue('VALUE1');
                var ny = script.getNumberValue('VALUE2');
                var mask = 1;

                sq.ascii = 0xff;

                if (ny >= 1 && ny <= 8) {
                    ny = ny - 1;
                    mask = mask << ny;
                    if (nx == 1) {
                        sq.dot8 &= ~mask;
                    } else if (nx == 2) {
                        sq.dot7 &= ~mask;
                    } else if (nx == 3) {
                        sq.dot6 &= ~mask;
                    } else if (nx == 4) {
                        sq.dot5 &= ~mask;
                    } else if (nx == 5) {
                        sq.dot4 &= ~mask;
                    } else if (nx == 6) {
                        sq.dot3 &= ~mask;
                    } else if (nx == 7) {
                        sq.dot2 &= ~mask;
                    } else if (nx == 8) {
                        sq.dot1 &= ~mask;
                    }
                }
                return script.callReturn();
            },
            syntax: { js: [], py: ['AltinoNeo.dot_display_matrix_off(%1, %2)'] },
        },
        altino_neo_light_hex: {
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
                }
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
                type: 'altino_neo_light_hex'
            },
            paramsKeyMap: {
                MSB: 0,
                LSB: 1,            
            },
            class: 'altino_neo_expert',
            isNotFor: ['altino_neo'],
            func: function(sprite, script) {
                // var sq = Entry.hw.sendQueue;
                // var lsb = parseInt(Number(script.getStringValue('LSB')), 10);
                // sq.led = lsb;

                var sq = Entry.hw.sendQueue;
                var msb = parseInt(Number(script.getStringValue('MSB')), 10);
                var lsb = parseInt(Number(script.getStringValue('LSB')), 10);

                sq.led1 = (msb & 0x03) | (sq.led1 & 0xfc);
                sq.led2 = lsb;

                return script.callReturn();
            },
            syntax: { js: [], py: ['AltinoNeo.light_hex(%1, %2)'] },
        },
        altino_neo_dot_display: {
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
                type: 'altino_neo_dot_display',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'altino_neo_output',
            isNotFor: ['altino_neo'],
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
                        syntax: 'AltinoNeo.dot_display(%1)',
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
        altino_neo_dot_display_line: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.altino_neo_dot_line_1, '1'],
                        [Lang.Blocks.altino_neo_dot_line_2, '2'],
                        [Lang.Blocks.altino_neo_dot_line_3, '3'],
                        [Lang.Blocks.altino_neo_dot_line_4, '4'],
                        [Lang.Blocks.altino_neo_dot_line_5, '5'],
                        [Lang.Blocks.altino_neo_dot_line_6, '6'],
                        [Lang.Blocks.altino_neo_dot_line_7, '7'],
                        [Lang.Blocks.altino_neo_dot_line_8, '8'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.altino_neo_h2, '1'],
                        [Lang.Blocks.altino_neo_h, '0'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.altino_neo_h2, '1'],
                        [Lang.Blocks.altino_neo_h, '0'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.altino_neo_h2, '1'],
                        [Lang.Blocks.altino_neo_h, '0'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.altino_neo_h2, '1'],
                        [Lang.Blocks.altino_neo_h, '0'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.altino_neo_h2, '1'],
                        [Lang.Blocks.altino_neo_h, '0'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.altino_neo_h2, '1'],
                        [Lang.Blocks.altino_neo_h, '0'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.altino_neo_h2, '1'],
                        [Lang.Blocks.altino_neo_h, '0'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.altino_neo_h2, '1'],
                        [Lang.Blocks.altino_neo_h, '0'],
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
                params: [null, null, null, null, null, null, null, null, null, null],
                type: 'altino_neo_dot_display_line',
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
            class: 'altino_neo_output',
            isNotFor: ['altino_neo'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var line = script.getStringField('LINE', script);

                sq.ascii = 0xff;

                var dots = [
                    script.getStringField('SW1', script),
                    script.getStringField('SW2', script),
                    script.getStringField('SW3', script),
                    script.getStringField('SW4', script),
                    script.getStringField('SW5', script),
                    script.getStringField('SW6', script),
                    script.getStringField('SW7', script),
                    script.getStringField('SW8', script),
                ];

                var mask = 0;

                if (line == '1') {
                    mask = 0x01;
                } else if (line == '2') {
                    mask = 0x02;
                } else if (line == '3') {
                    mask = 0x04;
                } else if (line == '4') {
                    mask = 0x08;
                } else if (line == '5') {
                    mask = 0x10;
                } else if (line == '6') {
                    mask = 0x20;
                } else if (line == '7') {
                    mask = 0x40;
                } else if (line == '8') {
                    mask = 0x80;
                }

                if (dots[7] == '1') {
                    sq.dot1 |= mask;
                } else {
                    sq.dot1 &= ~mask;
                }

                if (dots[6] == '1') {
                    sq.dot2 |= mask;
                } else {
                    sq.dot2 &= ~mask;
                }

                if (dots[5] == '1') {
                    sq.dot3 |= mask;
                } else {
                    sq.dot3 &= ~mask;
                }

                if (dots[4] == '1') {
                    sq.dot4 |= mask;
                } else {
                    sq.dot4 &= ~mask;
                }

                if (dots[3] == '1') {
                    sq.dot5 |= mask;
                } else {
                    sq.dot5 &= ~mask;
                }

                if (dots[2] == '1') {
                    sq.dot6 |= mask;
                } else {
                    sq.dot6 &= ~mask;
                }

                if (dots[1] == '1') {
                    sq.dot7 |= mask;
                } else {
                    sq.dot7 &= ~mask;
                }

                if (dots[0] == '1') {
                    sq.dot8 |= mask;
                } else {
                    sq.dot8 &= ~mask;
                }

                //sq.led = 0xff;
                return script.callReturn();
            },
            syntax: { js: [], py: ['AltinoNeo.dot_display_line(%1, %2, %3, %4, %5, %6, %7, %8)'] },
        },
        altino_neo_dot_display_hex: {
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
                type: 'altino_neo_dot_display_hex',
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
            class: 'altino_neo_expert',
            isNotFor: ['altino_neo'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                sq.ascii = 0xff;
                sq.dot1 = parseInt(Number(script.getStringValue('VALUE8')), 10);
                sq.dot2 = parseInt(Number(script.getStringValue('VALUE7')), 10);
                sq.dot3 = parseInt(Number(script.getStringValue('VALUE6')), 10);
                sq.dot4 = parseInt(Number(script.getStringValue('VALUE5')), 10);
                sq.dot5 = parseInt(Number(script.getStringValue('VALUE4')), 10);
                sq.dot6 = parseInt(Number(script.getStringValue('VALUE3')), 10);
                sq.dot7 = parseInt(Number(script.getStringValue('VALUE2')), 10);
                sq.dot8 = parseInt(Number(script.getStringValue('VALUE1')), 10);

                return script.callReturn();
            },
            syntax: { js: [], py: ['AltinoNeo.dot_display_hex(%1, %2, %3, %4, %5, %6, %7, %8)'] },
        },
        altino_neo_ir_reset: {
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
                type: 'altino_neo_ir_reset',
            },
            paramsKeyMap: {
                DEVICE : 0,
            },
            class: 'altino_neo_output',
            isNotFor: ['altino_neo'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;

                sq.ir = 6;
                return script.callReturn();
            },
            syntax: { js: [], py: ['AltinoNeo.ir_reset'] },
        },
        //endregion Altino 알티노
    };
};

module.exports = Entry.AltinoNeo;
