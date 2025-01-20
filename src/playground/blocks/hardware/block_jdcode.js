'use strict';

Entry.JDCode = {
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
    id: '1D.2',
    name: 'JDCode',
    url: 'http://www.junilab.co.kr',
    imageName: 'jdcode.png',
    title: {
        'en': 'JDCode',
        'ko': '제이디코드',
    },
    monitorTemplate: {
        imgPath: 'hw/jdrc.png',
        width: 600,
        height: 355,
        listPorts: {
            'A6': {
                name: '드론연결상태',
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
            'A10': {
                name: '드론준비상태',
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
            'A15': {
                name: '배터리(%)',
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
            'A8': {
                name: '드론좌우기울기',
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
            'A9': {
                name: '드론앞뒤기울기',
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
            'A7': {
                name: '드론높이',
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
            'A16': {
                name: '드론좌우이동',
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
            'A18': {
                name: '드론앞뒤이동',
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
        },
        ports: {
            'A1': {
                name: Lang.Blocks.jdkit_joystick_leftleftright,
                type: 'input',
                pos: {
                    x: 140,
                    y: 140,
                },
            },

            'A2': {
                name: Lang.Blocks.jdkit_joystick_lefttopbottom,
                type: 'input',
                pos: {
                    x: 140,
                    y: 140,
                },
            },
            'A3': {
                name: Lang.Blocks.jdkit_joystick_rightleftright,
                type: 'input',
                pos: {
                    x: 450,
                    y: 140,
                },
            },

            'A4': {
                name: Lang.Blocks.jdkit_joystick_righttopbottom,
                type: 'input',
                pos: {
                    x: 450,
                    y: 140,
                },
            },
            'A5': {
                name: '버튼',
                type: 'input',
                pos: {
                    x: 430,
                    y: 250,
                },
            },


        },
        mode: 'both',
    },
};


Entry.JDCode.setLanguage = function() {
    return {
        ko: {
            template: {
                'jdcode_takeoff': '드론 이륙하기 %1',
                'jdcode_landing': '드론 착륙하기 %1',
                'jdcode_altitude': '%1cm 높이로 비행%2',
                'jdcode_throttle': '프로펠러를 %1 % 세기로 돌리기 %2',
                'jdcode_velocity': '%1(으)로 %2속도(cm/s)로 비행%3',
                'jdcode_distance': '%1(으)로 %2cm 거리를 %3속도(cm/s)로 비행%4',
                'jdcode_degree': '%1으로 %2도를 %3각속도(deg/s)로 회전 %4',
                'jdcode_motor': '%1 모터를 %2 세기로 돌리기 %3',
                'jdcode_emergency': '드론 즉시멈추기 %1',
                'jdcode_connect': '드론 연결상태',
                'jdcode_ready': '드론 준비상태',
                'jdcode_battery': '배터리(%)',
                'jdcode_dronealt': '드론 높이',
                'jdcode_gyrox': '드론 좌우 기울기',
                'jdcode_gyroy': '드론 앞뒤 기울기',
                'jdcode_posx': '드론 좌우 이동',
                'jdcode_posy': '드론 앞뒤 이동',
                'jdcode_led': '%1 LED %2 %3',
                'jdcode_tune': '%1 음을  %2 초동안 소리내기 %3',
                'jdcode_joystick': '조이스틱 %1 읽기',
                'jdcode_button': '%1번 버튼 값 읽어오기',
                'jdcode_dir_front': '앞',
                'jdcode_dir_back': '뒤',
                'jdcode_dir_right': '오른쪽',
                'jdcode_dir_left': '왼쪽',
                'jdcode_alt': '드론 높이',
                'jdcode_tiltx': '드론좌우기울기',
                'jdcode_tilty': '드론앞뒤기울기',
                'jdcode_battery': '배터리',
            },
        },
        en: {
            template: {
                'jdcode_takeoff': '드론 이륙하기 %1',
                'jdcode_landing': '드론 착륙하기 %1',
                'jdcode_altitude': '%1cm 높이로 비행%2',
                'jdcode_throttle': '프로펠러를 %1 % 세기로 돌리기 %2',
                'jdcode_velocity': '%1(으)로 %2속도(cm/s)로 비행%3',
                'jdcode_distance': '%1(으)로 %2cm 거리를 %3속도(cm/s)로 비행%4',
                'jdcode_degree': '%1으로 %2도를 %3각속도(deg/s)로 회전 %4',
                'jdcode_motor': '%1 모터를 %2 세기로 돌리기 %3',
                'jdcode_emergency': '드론 즉시멈추기 %1',
                'jdcode_connect': '드론 연결상태',
                'jdcode_ready': '드론 준비상태',
                'jdcode_battery': '배터리(%)',
                'jdcode_dronealt': '드론 높이',
                'jdcode_gyrox': '드론 좌우 기울기',
                'jdcode_gyroy': '드론 앞뒤 기울기',
                'jdcode_posx': '드론 좌우 이동',
                'jdcode_posy': '드론 앞뒤 이동',
                'jdcode_led': '%1 LED %2 %3',
                'jdcode_tune': '%1 음을  %2 초동안 소리내기 %3',
                'jdcode_joystick': '조이스틱 %1 읽기',
                'jdcode_button': '%1번 버튼 값 읽어오기',
                'jdcode_dir_front': '앞',
                'jdcode_dir_back': '뒤',
                'jdcode_dir_right': '오른쪽',
                'jdcode_dir_left': '왼쪽',
                'jdcode_alt': '드론 높이',
                'jdcode_tiltx': '드론좌우기울기',
                'jdcode_tilty': '드론앞뒤기울기',
                'jdcode_battery': '배터리',
            },
        },
    };
};


Entry.JDCode.blockMenuBlocks = [
    'jdcode_takeoff',
    'jdcode_landing',
    'jdcode_altitude',
    'jdcode_throttle',
    'jdcode_velocity',
    'jdcode_distance',
    'jdcode_degree',
    'jdcode_emergency',
    'jdcode_connect',
    'jdcode_ready',
    'jdcode_battery',
    'jdcode_dronealt',
    'jdcode_gyrox',
    'jdcode_gyroy',
    'jdcode_posx',
    'jdcode_posy',
    'jdcode_led',
    'jdcode_tune',
    'jdcode_motor',
    'jdcode_joystick',
    'jdcode_button',
];


Entry.JDCode.getBlocks = function() {
    return {
        //region JDCode
        jdcode_takeoff: {
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
                type: 'jdcode_takeoff',
            },
            paramsKeyMap: {},
            class: 'JDCode_Command',
            isNotFor: ['JDCode'],

            func: function(sprite, script) {
                if (typeof Entry.hw.sendQueue.CMD == 'undefined') {
                    Entry.hw.sendQueue.CMD = [
                        0xf0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    ];
                }
                var cmd = Entry.hw.sendQueue.CMD;
                cmd[Entry.JDCode.Cmd.CMD_THROTTLE_LOW] = 70;
                cmd[Entry.JDCode.Cmd.CMD_ROLL_LOW] = 0;
                cmd[Entry.JDCode.Cmd.CMD_PITCH_LOW] = 0;
                cmd[Entry.JDCode.Cmd.CMD_OPTION_LOW] = 0x2F;
                cmd[Entry.JDCode.Cmd.CMD_OPTION_HIGH] = 0;

                Entry.hw.sendQueue.rollCnt = 0;
                Entry.hw.sendQueue.pitchCnt = 0;
                Entry.hw.sendQueue.yawCnt = 0;

                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        jdcode_landing: {
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
                type: 'jdcode_landing',
            },
            paramsKeyMap: {},
            class: 'JDCode_Command',
            isNotFor: ['JDCode'],

            func: function(sprite, script) {
                if (typeof Entry.hw.sendQueue.CMD == 'undefined')
                    Entry.hw.sendQueue.CMD = [
                        0xf0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    ];

                var cmd = Entry.hw.sendQueue.CMD;
                cmd[Entry.JDCode.Cmd.CMD_THROTTLE_LOW] = 0;
                cmd[Entry.JDCode.Cmd.CMD_ROLL_LOW] = 0;
                cmd[Entry.JDCode.Cmd.CMD_PITCH_LOW] = 0;
                cmd[Entry.JDCode.Cmd.CMD_OPTION_LOW] = 0x2F;
                cmd[Entry.JDCode.Cmd.CMD_OPTION_HIGH] = 0;

                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        jdcode_altitude: {
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
                type: 'jdcode_altitude',
            },
            paramsKeyMap: {
                THROTTLE: 0,
            },
            class: 'JDCode_Command',
            isNotFor: ['JDCode'],

            func: function(sprite, script) {
                if (typeof Entry.hw.sendQueue.CMD == 'undefined')
                    Entry.hw.sendQueue.CMD = [
                        0xf0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    ];

                var cmd = Entry.hw.sendQueue.CMD;
                var throttle = script.getNumberValue('THROTTLE', script);
                cmd[Entry.JDCode.Cmd.CMD_THROTTLE_LOW] = throttle & 0xFF;
                cmd[Entry.JDCode.Cmd.CMD_THROTTLE_HIGH] = (throttle >> 8) & 0xFF;
                cmd[Entry.JDCode.Cmd.CMD_OPTION_LOW] = 0x2F;
                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        jdcode_throttle: {
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
                type: 'jdcode_throttle',
            },
            paramsKeyMap: {
                THROTTLE: 0,
            },
            class: 'JDCode_Command',
            isNotFor: ['JDCode'],

            func: function(sprite, script) {
                if (typeof Entry.hw.sendQueue.CMD == 'undefined')
                    Entry.hw.sendQueue.CMD = [
                        0xf0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    ];

                var cmd = Entry.hw.sendQueue.CMD;
                var throttle = script.getNumberValue('THROTTLE', script);
                throttle = (throttle < 0) ? 0 : (throttle > 100) ? 1000 : throttle * 10;
                cmd[Entry.JDCode.Cmd.CMD_THROTTLE_LOW] = throttle & 0xFF;
                cmd[Entry.JDCode.Cmd.CMD_THROTTLE_HIGH] = (throttle >> 8) & 0xFF;
                cmd[Entry.JDCode.Cmd.CMD_OPTION_LOW] = 0x09;
                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },

        jdcode_velocity: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.jdcode_dir_front, 0],
                        [Lang.template.jdcode_dir_back, 1],
                        [Lang.template.jdcode_dir_right, 2],
                        [Lang.template.jdcode_dir_left, 3],
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
                type: 'jdcode_velocity',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                VELOCITY: 1,
            },
            class: 'JDCode_Command',
            isNotFor: ['JDCode'],

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
                    cmd[Entry.JDCode.Cmd.CMD_PITCH_LOW] = velocity & 0xFF;
                    cmd[Entry.JDCode.Cmd.CMD_PITCH_HIGH] = (velocity >> 8) & 0xFF;
                } else {
                    cmd[Entry.JDCode.Cmd.CMD_ROLL_LOW] = velocity & 0xFF;
                    cmd[Entry.JDCode.Cmd.CMD_ROLL_HIGH] = (velocity >> 8) & 0xFF;
                }
                cmd[Entry.JDCode.Cmd.CMD_OPTION_LOW] = cmd[Entry.JDCode.Cmd.CMD_OPTION_LOW] & 0xDF;
                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        jdcode_distance: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.jdcode_dir_front, 0],
                        [Lang.template.jdcode_dir_back, 1],
                        [Lang.template.jdcode_dir_right, 2],
                        [Lang.template.jdcode_dir_left, 3],
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
                type: 'jdcode_distance',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                DISTANCE: 1,
                VELOCITY: 2,
            },
            class: 'JDCode_Command',
            isNotFor: ['JDCode'],

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
                    cmd[Entry.JDCode.Cmd.CMD_PITCH_LOW] = distance & 0xFF;
                    cmd[Entry.JDCode.Cmd.CMD_PITCH_HIGH] = (distance >> 8) & 0xFF;
                    var pitchCnt = Entry.hw.sendQueue.pitchCnt;
                    Entry.hw.sendQueue.pitchCnt = typeof pitchCnt == 'undefined' ? 1 : pitchCnt + 1;

                } else {
                    cmd[Entry.JDCode.Cmd.CMD_ROLL_LOW] = distance & 0xFF;
                    cmd[Entry.JDCode.Cmd.CMD_ROLL_HIGH] = (distance >> 8) & 0xFF;
                    var rollCnt = Entry.hw.sendQueue.rollCnt;
                    Entry.hw.sendQueue.rollCnt = typeof rollCnt == 'undefined' ? 1 : rollCnt + 1;
                }
                cmd[Entry.JDCode.Cmd.CMD_POSVEL_LOW] = velocity & 0xFF;
                cmd[Entry.JDCode.Cmd.CMD_POSVEL_HIGH] = (velocity >> 8) & 0xFF;
                cmd[Entry.JDCode.Cmd.CMD_OPTION_LOW] = 0x2F;
                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        jdcode_degree: {
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
                type: 'jdcode_degree',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                DEGREE: 1,
                VELOCITY: 2,
            },
            class: 'JDCode_Command',
            isNotFor: ['JDCode'],

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
                cmd[Entry.JDCode.Cmd.CMD_YAW_LOW] = degree & 0xFF;
                cmd[Entry.JDCode.Cmd.CMD_YAW_HIGH] = (degree >> 8) & 0xFF;
                cmd[Entry.JDCode.Cmd.CMD_YAWVEL_LOW] = velocity & 0xFF;
                cmd[Entry.JDCode.Cmd.CMD_YAWVEL_HIGH] = (velocity >> 8) & 0xFF;
                var yawCnt = Entry.hw.sendQueue.yawCnt;
                Entry.hw.sendQueue.yawCnt = typeof yawCnt == 'undefined' ? 1 : yawCnt + 1;

                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        jdcode_emergency: {
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
                type: 'jdcode_emergency',
            },
            paramsKeyMap: {},
            class: 'JDCode_Command',
            isNotFor: ['JDCode'],

            func: function(sprite, script) {
                if (typeof Entry.hw.sendQueue.CMD == 'undefined')
                    Entry.hw.sendQueue.CMD = [
                        0xf0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    ];
                var cmd = Entry.hw.sendQueue.CMD;
                cmd[Entry.JDCode.Cmd.CMD_THROTTLE_LOW] = 0;
                cmd[Entry.JDCode.Cmd.CMD_ROLL_LOW] = 0;
                cmd[Entry.JDCode.Cmd.CMD_PITCH_LOW] = 0;
                cmd[Entry.JDCode.Cmd.CMD_OPTION_LOW] = 0x00;
                cmd[Entry.JDCode.Cmd.CMD_OPTION_HIGH] = 0;
                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        jdcode_connect: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [null],
                type: 'jdcode_connect',
            },
            class: 'JDCode_Sensor',
            isNotFor: ['JDCode'],
            func: function(sprite, script) {
                var sensorData = Entry.hw.portData.CMD;
                return sensorData[Entry.JDCode.Sensor.SENSOR_DRONECONNECT];
            },
            syntax: { js: [], py: [] },
        },
        jdcode_ready: {
            parent: 'jdkit_ready',
            def: {
                params: [null],
                type: 'jdcode_ready',
            },
            class: 'JDCode_Sensor',
            isNotFor: ['JDCode'],
            syntax: { js: [], py: [] },
        },
        jdcode_battery: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [null],
                type: 'jdcode_battery',
            },
            class: 'JDCode_Sensor',
            isNotFor: ['JDCode'],
            func: function(sprite, script) {
                var sensorData = Entry.hw.portData.CMD;
                return sensorData[Entry.JDCode.Sensor.SENSOR_BATTERY];
            },
            syntax: { js: [], py: [] },
        },
        jdcode_dronealt: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [null],
                type: 'jdcode_dronealt',
            },
            class: 'JDCode_Sensor',
            isNotFor: ['JDCode'],
            func: function(sprite, script) {
                var sensorData = Entry.hw.portData.CMD;
                return sensorData[Entry.JDCode.Sensor.SENSOR_DRONEALT];
            },
            syntax: { js: [], py: [] },
        },
        jdcode_gyrox: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [null],
                type: 'jdcode_gyrox',
            },
            class: 'JDCode_Sensor',
            isNotFor: ['JDCode'],
            func: function(sprite, script) {
                var sensorData = Entry.hw.portData.CMD;
                var x = sensorData[Entry.JDCode.Sensor.SENSOR_GYRO_X];
                if (x > 127)
                    x = -1 * (256 - x);
                return x;
            },
            syntax: { js: [], py: [] },
        },
        jdcode_gyroy: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [null],
                type: 'jdcode_gyroy',
            },
            class: 'JDCode_Sensor',
            isNotFor: ['JDCode'],
            func: function(sprite, script) {
                var sensorData = Entry.hw.portData.CMD;
                var y = sensorData[Entry.JDCode.Sensor.SENSOR_GYRO_Y];
                if (y > 127)
                    y = -1 * (256 - y);
                return y;
            },
            syntax: { js: [], py: [] },
        },
        jdcode_posx: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [null],
                type: 'jdcode_posx',
            },
            class: 'JDCode_Sensor',
            isNotFor: ['JDCode'],
            func: function(sprite, script) {
                var sensorData = Entry.hw.portData.CMD;
                var posx = sensorData[Entry.JDCode.Sensor.SENSOR_POSX_L] + sensorData[Entry.JDCode.Sensor.SENSOR_POSX_H] * 256;
                if (posx > 32767)
                    posx = -1 * (65536 - posx);
                return posx;
            },
            syntax: { js: [], py: [] },
        },
        jdcode_posy: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [null],
                type: 'jdcode_posy',
            },
            class: 'JDCode_Sensor',
            isNotFor: ['JDCode'],
            func: function(sprite, script) {
                var sensorData = Entry.hw.portData.CMD;
                var posy = sensorData[Entry.JDCode.Sensor.SENSOR_POSY_L] + sensorData[Entry.JDCode.Sensor.SENSOR_POSY_H] * 256;
                if (posy > 32767)
                    posy = -1 * (65536 - posy);
                return posy;

            },
            syntax: { js: [], py: [] },
        },

        jdcode_led: {
            parent: 'jdkit_led',
            def: {
                params: [null],
                type: 'jdcode_led',
            },
            class: 'JDCode_CodeRC',
            isNotFor: ['JDCode'],
            syntax: { js: [], py: [] },
        },
        jdcode_tune: {
            parent: 'jdkit_tune',
            def: {
                params: [null],
                type: 'jdcode_tune',
            },
            class: 'JDCode_CodeRC',
            isNotFor: ['JDCode'],
            syntax: { js: [], py: [] },
        },
        jdcode_motor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.jdkit_motor_lefttop, 1],
                        [Lang.Blocks.jdkit_motor_leftbottom, 2],
                        [Lang.Blocks.jdkit_motor_righttop, 0],
                        [Lang.Blocks.jdkit_motor_rightbottom, 3],
                    ],
                    value: 1,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    value: '15',
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
                type: 'jdcode_motor',
            },
            paramsKeyMap: {
                MOTOR: 0,
                POWER: 1,
            },
            class: 'JDCode_CodeRC',
            isNotFor: ['JDCode'],

            func: function(sprite, script) {
                if (typeof Entry.hw.sendQueue.CMD == 'undefined')
                    Entry.hw.sendQueue.CMD = [
                        0xf0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    ];
                var cmd = Entry.hw.sendQueue.CMD;
                var motor = script.getField('MOTOR', script);
                var power = script.getNumberValue('POWER', script);

                cmd[Entry.JDKit.Cmd.MOTOR0 + motor] =
                    power > 100 ? 100 : power < 0 ? 0 : power;
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },

        jdcode_joystick: {
            parent: 'jdkit_joystick',
            def: {
                params: [null],
                type: 'jdcode_joystick',
            },
            class: 'JDCode_CodeRC',
            isNotFor: ['JDCode'],
            syntax: { js: [], py: [] },
        },
        jdcode_button: {
            parent: 'jdkit_button',
            def: {
                params: [null],
                type: 'jdcode_button',
            },
            class: 'JDCode_CodeRC',
            isNotFor: ['JDCode'],
            syntax: { js: [], py: [] },
        },

        //endregion JDCode
    };
};

module.exports = Entry.JDCode;
