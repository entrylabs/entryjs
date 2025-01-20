'use strict';

Entry.Firmtech2 = {
    Cmd: {
        CMD_LED: 1,
        CMD_TUNE: 2,
        CMD_TUNEDUR: 3,
        CMD_ROLL_LOW: 4,
        CMD_ROLL_HIGH: 5,
        CMD_PITCH_LOW: 6,
        CMD_PITCH_HIGH: 7,
        CMD_OPTION_LOW: 8,
        CMD_MOTOR0: 9,
        CMD_MOTOR1: 10,
        CMD_MOTOR2: 11,
        CMD_MOTOR3: 12,
        CMD_EXTPIN1: 13,
        CMD_EXTPIN2: 14,
        CMD_EXTPIN3: 15,
        CMD_PWM: 16,
        CMD_SERVOPORT: 17,
        CMD_SERVODGREE: 18,
        CMD_OPTION_HIGH: 19,
        CMD_YAW_LOW: 20,
        CMD_YAW_HIGH: 21,
        CMD_THROTTLE_LOW: 22,
        CMD_THROTTLE_HIGH: 23,
        CMD_POSVEL_LOW: 24,
        CMD_POSVEL_HIGH: 25,
        CMD_YAWVEL_LOW: 26,
        CMD_YAWVEL_HIGH: 27,
        CMD_ULTRASONIC: 28,
    },
    Sensor: {
        SENSOR_JOYSTICK_LLR: 1,
        SENSOR_JOYSTICK_LTB: 2,
        SENSOR_JOYSTICK_RLR: 3,
        SENSOR_JOYSTICK_RTB: 4,
        SENSOR_BUTTON: 5,
        SENSOR_DRONECONNECT: 6,
        SENSOR_DRONEALT: 7,
        SENSOR_GYRO_X: 8,
        SENSOR_GYRO_Y: 9,
        SENSOR_DRONEREADY: 10,
        SENSOR_EXTPIN1: 11,
        SENSOR_EXTPIN2: 12,
        SENSOR_ANALOG4: 13,
        SENSOR_ANALOG5: 14,
        SENSOR_JDKITMAX: 15,
        SENSOR_BATTERY: 15,
        SENSOR_POSX_L: 16,
        SENSOR_POSX_H: 17,
        SENSOR_POSY_L: 18,
        SENSOR_POSY_H: 19,
        SENSOR_ULTRASONIC: 20,
    },
    setZero: function() {
        Entry.hw.sendQueue.CMD = [
            0xf0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        ];
        Entry.hw.update();
    },
    id: '4E.1',
    name: 'Firmtech2',
    url: 'http://www.firmtech2.co.kr',
    imageName: 'firmtech2.png',
    title: {
        'en': 'Firmtech2',
        'ko': '펌테크 드론 2호',
    },
    monitorTemplate: {
    },
};


Entry.Firmtech2.setLanguage = function() {
    return {
        ko: {
            template: {
                'firmtech2_takeoff': '드론 이륙하기 %1',
                'firmtech2_landing': '드론 착륙하기 %1',
                'firmtech2_altitude': '%1cm 높이로 비행%2',
                'firmtech2_throttle': '프로펠러를 %1 % 세기로 돌리기 %2',
                'firmtech2_velocity': '%1(으)로 %2속도(cm/s)로 비행%3',
                'firmtech2_distance': '%1(으)로 %2cm 거리를 %3속도(cm/s)로 비행%4',
                'firmtech2_degree': '%1으로 %2도를 %3각속도(deg/s)로 회전 %4',
                'firmtech2_motor': '%1 모터를 %2 세기로 돌리기 %3',
                'firmtech2_emergency': '드론 즉시멈추기 %1',
                'firmtech2_connect': '드론 연결상태',
                'firmtech2_ready': '드론 준비상태',
                'firmtech2_battery': '배터리(%)',
                'firmtech2_dronealt': '드론 높이',
                'firmtech2_gyrox': '드론 좌우 기울기',
                'firmtech2_gyroy': '드론 앞뒤 기울기',
                'firmtech2_posx': '드론 좌우 이동',
                'firmtech2_posy': '드론 앞뒤 이동',
                'firmtech2_dir_front': '앞',
                'firmtech2_dir_back': '뒤',
                'firmtech2_dir_right': '오른쪽',
                'firmtech2_dir_left': '왼쪽',
                'firmtech2_alt': '드론 높이',
                'firmtech2_tiltx': '드론좌우기울기',
                'firmtech2_tilty': '드론앞뒤기울기',
                'firmtech2_battery': '배터리',
            },
        },
        en: {
            template: {
                'firmtech2_takeoff': '드론 이륙하기 %1',
                'firmtech2_landing': '드론 착륙하기 %1',
                'firmtech2_altitude': '%1cm 높이로 비행%2',
                'firmtech2_throttle': '프로펠러를 %1 % 세기로 돌리기 %2',
                'firmtech2_velocity': '%1(으)로 %2속도(cm/s)로 비행%3',
                'firmtech2_distance': '%1(으)로 %2cm 거리를 %3속도(cm/s)로 비행%4',
                'firmtech2_degree': '%1으로 %2도를 %3각속도(deg/s)로 회전 %4',
                'firmtech2_motor': '%1 모터를 %2 세기로 돌리기 %3',
                'firmtech2_emergency': '드론 즉시멈추기 %1',
                'firmtech2_connect': '드론 연결상태',
                'firmtech2_ready': '드론 준비상태',
                'firmtech2_battery': '배터리(%)',
                'firmtech2_dronealt': '드론 높이',
                'firmtech2_gyrox': '드론 좌우 기울기',
                'firmtech2_gyroy': '드론 앞뒤 기울기',
                'firmtech2_posx': '드론 좌우 이동',
                'firmtech2_posy': '드론 앞뒤 이동',
                'firmtech2_dir_front': '앞',
                'firmtech2_dir_back': '뒤',
                'firmtech2_dir_right': '오른쪽',
                'firmtech2_dir_left': '왼쪽',
                'firmtech2_alt': '드론 높이',
                'firmtech2_tiltx': '드론좌우기울기',
                'firmtech2_tilty': '드론앞뒤기울기',
                'firmtech2_battery': '배터리',
            },
        },
    };
};


Entry.Firmtech2.blockMenuBlocks = [
    'firmtech2_takeoff',
    'firmtech2_landing',
    'firmtech2_altitude',
    'firmtech2_throttle',
    'firmtech2_velocity',
    'firmtech2_distance',
    'firmtech2_degree',
    'firmtech2_emergency',
    'firmtech2_connect',
    'firmtech2_ready',
    'firmtech2_battery',
    'firmtech2_dronealt',
    'firmtech2_gyrox',
    'firmtech2_gyroy',
    'firmtech2_posx',
    'firmtech2_posy',
];


Entry.Firmtech2.getBlocks = function() {
    return {
        //region Firmtech2
        firmtech2_takeoff: {
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
                params: [null],
                type: 'firmtech2_takeoff',
            },
            paramsKeyMap: {},
            class: 'Firmtech2_Command',
            isNotFor: ['Firmtech2'],

            func: function(sprite, script) {
                if (typeof Entry.hw.sendQueue.CMD == 'undefined') {
                    Entry.hw.sendQueue.CMD = [
                        0xf0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    ];
                }
                var cmd = Entry.hw.sendQueue.CMD;
                cmd[Entry.Firmtech2.Cmd.CMD_THROTTLE_LOW] = 70;
                cmd[Entry.Firmtech2.Cmd.CMD_ROLL_LOW] = 0;
                cmd[Entry.Firmtech2.Cmd.CMD_PITCH_LOW] = 0;
                cmd[Entry.Firmtech2.Cmd.CMD_OPTION_LOW] = 0x2F;
                cmd[Entry.Firmtech2.Cmd.CMD_OPTION_HIGH] = 0;

                Entry.hw.sendQueue.rollCnt = 0;
                Entry.hw.sendQueue.pitchCnt = 0;
                Entry.hw.sendQueue.yawCnt = 0;

                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        firmtech2_landing: {
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
                params: [null],
                type: 'firmtech2_landing',
            },
            paramsKeyMap: {},
            class: 'Firmtech2_Command',
            isNotFor: ['Firmtech2'],

            func: function(sprite, script) {
                if (typeof Entry.hw.sendQueue.CMD == 'undefined')
                    Entry.hw.sendQueue.CMD = [
                        0xf0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    ];

                var cmd = Entry.hw.sendQueue.CMD;
                cmd[Entry.Firmtech2.Cmd.CMD_THROTTLE_LOW] = 0;
                cmd[Entry.Firmtech2.Cmd.CMD_ROLL_LOW] = 0;
                cmd[Entry.Firmtech2.Cmd.CMD_PITCH_LOW] = 0;
                cmd[Entry.Firmtech2.Cmd.CMD_OPTION_LOW] = 0x2F;
                cmd[Entry.Firmtech2.Cmd.CMD_OPTION_HIGH] = 0;

                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        firmtech2_altitude: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    value: '100',
                    fontSize: 11,
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
                type: 'firmtech2_altitude',
            },
            paramsKeyMap: {
                THROTTLE: 0,
            },
            class: 'Firmtech2_Command',
            isNotFor: ['Firmtech2'],

            func: function(sprite, script) {
                if (typeof Entry.hw.sendQueue.CMD == 'undefined')
                    Entry.hw.sendQueue.CMD = [
                        0xf0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    ];

                var cmd = Entry.hw.sendQueue.CMD;
                var throttle = script.getNumberValue('THROTTLE', script);
                cmd[Entry.Firmtech2.Cmd.CMD_THROTTLE_LOW] = throttle & 0xFF;
                cmd[Entry.Firmtech2.Cmd.CMD_THROTTLE_HIGH] = (throttle >> 8) & 0xFF;
                cmd[Entry.Firmtech2.Cmd.CMD_OPTION_LOW] = 0x2F;
                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        firmtech2_throttle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    value: '0',
                    fontSize: 11,
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
                type: 'firmtech2_throttle',
            },
            paramsKeyMap: {
                THROTTLE: 0,
            },
            class: 'Firmtech2_Command',
            isNotFor: ['Firmtech2'],

            func: function(sprite, script) {
                if (typeof Entry.hw.sendQueue.CMD == 'undefined')
                    Entry.hw.sendQueue.CMD = [
                        0xf0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    ];

                var cmd = Entry.hw.sendQueue.CMD;
                var throttle = script.getNumberValue('THROTTLE', script);
                throttle = (throttle < 0) ? 0 : (throttle > 100) ? 1000 : throttle * 10;
                cmd[Entry.Firmtech2.Cmd.CMD_THROTTLE_LOW] = throttle & 0xFF;
                cmd[Entry.Firmtech2.Cmd.CMD_THROTTLE_HIGH] = (throttle >> 8) & 0xFF;
                cmd[Entry.Firmtech2.Cmd.CMD_OPTION_LOW] = 0x09;
                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },

        firmtech2_velocity: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.firmtech2_dir_front, 0],
                        [Lang.template.firmtech2_dir_back, 1],
                        [Lang.template.firmtech2_dir_right, 2],
                        [Lang.template.firmtech2_dir_left, 3],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    value: '70',
                    fontSize: 11,
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
                type: 'firmtech2_velocity',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                VELOCITY: 1,
            },
            class: 'Firmtech2_Command',
            isNotFor: ['Firmtech2'],

            func: function(sprite, script) {
                if (typeof Entry.hw.sendQueue.CMD == 'undefined')
                    Entry.hw.sendQueue.CMD = [
                        0xf0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    ];

                var cmd = Entry.hw.sendQueue.CMD;
                var direction = script.getField('DIRECTION', script);
                var velocity = script.getNumberValue('VELOCITY', script);
                if ((direction == 1) || (direction == 3))
                    velocity = velocity * -1;
                if (direction < 2) {
                    cmd[Entry.Firmtech2.Cmd.CMD_PITCH_LOW] = velocity & 0xFF;
                    cmd[Entry.Firmtech2.Cmd.CMD_PITCH_HIGH] = (velocity >> 8) & 0xFF;
                } else {
                    cmd[Entry.Firmtech2.Cmd.CMD_ROLL_LOW] = velocity & 0xFF;
                    cmd[Entry.Firmtech2.Cmd.CMD_ROLL_HIGH] = (velocity >> 8) & 0xFF;
                }
                cmd[Entry.Firmtech2.Cmd.CMD_OPTION_LOW] = cmd[Entry.Firmtech2.Cmd.CMD_OPTION_LOW] & 0xDF;
                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        firmtech2_distance: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.firmtech2_dir_front, 0],
                        [Lang.template.firmtech2_dir_back, 1],
                        [Lang.template.firmtech2_dir_right, 2],
                        [Lang.template.firmtech2_dir_left, 3],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    value: '100',
                    fontSize: 11,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    value: '70',
                    fontSize: 11,
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
                type: 'firmtech2_distance',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                DISTANCE: 1,
                VELOCITY: 2,
            },
            class: 'Firmtech2_Command',
            isNotFor: ['Firmtech2'],

            func: function(sprite, script) {
                if (typeof Entry.hw.sendQueue.CMD == 'undefined')
                    Entry.hw.sendQueue.CMD = [
                        0xf0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    ];

                var cmd = Entry.hw.sendQueue.CMD;
                var direction = script.getField('DIRECTION', script);
                var distance = script.getNumberValue('DISTANCE', script);
                var velocity = script.getNumberValue('VELOCITY', script);
                if ((direction == 1) || (direction == 3))
                    distance = distance * -1;
                if (direction < 2) {
                    cmd[Entry.Firmtech2.Cmd.CMD_PITCH_LOW] = distance & 0xFF;
                    cmd[Entry.Firmtech2.Cmd.CMD_PITCH_HIGH] = (distance >> 8) & 0xFF;
                    var pitchCnt = Entry.hw.sendQueue.pitchCnt;
                    Entry.hw.sendQueue.pitchCnt = typeof pitchCnt == 'undefined' ? 1 : pitchCnt + 1;

                } else {
                    cmd[Entry.Firmtech2.Cmd.CMD_ROLL_LOW] = distance & 0xFF;
                    cmd[Entry.Firmtech2.Cmd.CMD_ROLL_HIGH] = (distance >> 8) & 0xFF;
                    var rollCnt = Entry.hw.sendQueue.rollCnt;
                    Entry.hw.sendQueue.rollCnt = typeof rollCnt == 'undefined' ? 1 : rollCnt + 1;
                }
                cmd[Entry.Firmtech2.Cmd.CMD_POSVEL_LOW] = velocity & 0xFF;
                cmd[Entry.Firmtech2.Cmd.CMD_POSVEL_HIGH] = (velocity >> 8) & 0xFF;
                cmd[Entry.Firmtech2.Cmd.CMD_OPTION_LOW] = 0x2F;
                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        firmtech2_degree: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.jdkit_clockwise, 0],
                        [Lang.Blocks.jdkit_counterclockwise, 1],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    value: '90',
                    fontSize: 11,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    value: '70',
                    fontSize: 11,
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
                type: 'firmtech2_degree',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                DEGREE: 1,
                VELOCITY: 2,
            },
            class: 'Firmtech2_Command',
            isNotFor: ['Firmtech2'],

            func: function(sprite, script) {
                if (typeof Entry.hw.sendQueue.CMD == 'undefined')
                    Entry.hw.sendQueue.CMD = [
                        0xf0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    ];

                var cmd = Entry.hw.sendQueue.CMD;
                var direction = script.getField('DIRECTION', script);
                var degree = script.getNumberValue('DEGREE', script);
                var velocity = script.getNumberValue('VELOCITY', script);
                if (direction == 1)
                    degree = degree * -1;
                cmd[Entry.Firmtech2.Cmd.CMD_YAW_LOW] = degree & 0xFF;
                cmd[Entry.Firmtech2.Cmd.CMD_YAW_HIGH] = (degree >> 8) & 0xFF;
                cmd[Entry.Firmtech2.Cmd.CMD_YAWVEL_LOW] = velocity & 0xFF;
                cmd[Entry.Firmtech2.Cmd.CMD_YAWVEL_HIGH] = (velocity >> 8) & 0xFF;
                var yawCnt = Entry.hw.sendQueue.yawCnt;
                Entry.hw.sendQueue.yawCnt = typeof yawCnt == 'undefined' ? 1 : yawCnt + 1;

                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        firmtech2_emergency: {
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
                params: [null],
                type: 'firmtech2_emergency',
            },
            paramsKeyMap: {},
            class: 'Firmtech2_Command',
            isNotFor: ['Firmtech2'],

            func: function(sprite, script) {
                if (typeof Entry.hw.sendQueue.CMD == 'undefined')
                    Entry.hw.sendQueue.CMD = [
                        0xf0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    ];
                var cmd = Entry.hw.sendQueue.CMD;
                cmd[Entry.Firmtech2.Cmd.CMD_THROTTLE_LOW] = 0;
                cmd[Entry.Firmtech2.Cmd.CMD_ROLL_LOW] = 0;
                cmd[Entry.Firmtech2.Cmd.CMD_PITCH_LOW] = 0;
                cmd[Entry.Firmtech2.Cmd.CMD_OPTION_LOW] = 0x00;
                cmd[Entry.Firmtech2.Cmd.CMD_OPTION_HIGH] = 0;
                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        firmtech2_connect: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [null],
                type: 'firmtech2_connect',
            },
            class: 'Firmtech2_Sensor',
            isNotFor: ['Firmtech2'],
            func: function(sprite, script) {
                var sensorData = Entry.hw.portData.CMD;
                return sensorData[Entry.Firmtech2.Sensor.SENSOR_DRONECONNECT];
            },
            syntax: { js: [], py: [] },
        },
        firmtech2_ready: {
            parent: 'jdkit_ready',
            def: {
                params: [null],
                type: 'firmtech2_ready',
            },
            class: 'Firmtech2_Sensor',
            isNotFor: ['Firmtech2'],
            syntax: { js: [], py: [] },
        },
        firmtech2_battery: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [null],
                type: 'firmtech2_battery',
            },
            class: 'Firmtech2_Sensor',
            isNotFor: ['Firmtech2'],
            func: function(sprite, script) {
                var sensorData = Entry.hw.portData.CMD;
                return sensorData[Entry.Firmtech2.Sensor.SENSOR_BATTERY];
            },
            syntax: { js: [], py: [] },
        },
        firmtech2_dronealt: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [null],
                type: 'firmtech2_dronealt',
            },
            class: 'Firmtech2_Sensor',
            isNotFor: ['Firmtech2'],
            func: function(sprite, script) {
                var sensorData = Entry.hw.portData.CMD;
                return sensorData[Entry.Firmtech2.Sensor.SENSOR_DRONEALT];
            },
            syntax: { js: [], py: [] },
        },
        firmtech2_gyrox: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [null],
                type: 'firmtech2_gyrox',
            },
            class: 'Firmtech2_Sensor',
            isNotFor: ['Firmtech2'],
            func: function(sprite, script) {
                var sensorData = Entry.hw.portData.CMD;
                var x = sensorData[Entry.Firmtech2.Sensor.SENSOR_GYRO_X];
                if (x > 127)
                    x = -1 * (256 - x);
                return x;
            },
            syntax: { js: [], py: [] },
        },
        firmtech2_gyroy: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [null],
                type: 'firmtech2_gyroy',
            },
            class: 'Firmtech2_Sensor',
            isNotFor: ['Firmtech2'],
            func: function(sprite, script) {
                var sensorData = Entry.hw.portData.CMD;
                var y = sensorData[Entry.Firmtech2.Sensor.SENSOR_GYRO_Y];
                if (y > 127)
                    y = -1 * (256 - y);
                return y;
            },
            syntax: { js: [], py: [] },
        },
        firmtech2_posx: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [null],
                type: 'firmtech2_posx',
            },
            class: 'Firmtech2_Sensor',
            isNotFor: ['Firmtech2'],
            func: function(sprite, script) {
                var sensorData = Entry.hw.portData.CMD;
                var posx = sensorData[Entry.Firmtech2.Sensor.SENSOR_POSX_L] + sensorData[Entry.Firmtech2.Sensor.SENSOR_POSX_H] * 256;
                if (posx > 32767)
                    posx = -1 * (65536 - posx);
                return posx;
            },
            syntax: { js: [], py: [] },
        },
        firmtech2_posy: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [null],
                type: 'firmtech2_posy',
            },
            class: 'Firmtech2_Sensor',
            isNotFor: ['Firmtech2'],
            func: function(sprite, script) {
                var sensorData = Entry.hw.portData.CMD;
                var posy = sensorData[Entry.Firmtech2.Sensor.SENSOR_POSY_L] + sensorData[Entry.Firmtech2.Sensor.SENSOR_POSY_H] * 256;
                if (posy > 32767)
                    posy = -1 * (65536 - posy);
                return posy;

            },
            syntax: { js: [], py: [] },
        },
        //endregion Firmtech2
    };
};

module.exports = Entry.Firmtech2;
