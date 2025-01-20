'use strict';

Entry.RobotamiCoding = {
    id: '2A.1',
    name: 'RobotamiCoding',
    url: 'http://robotron.co.kr/',
    imageName: 'robotamicoding.png', //thumbnail. 신규등록시 images/hw, images/hardware 에 이미지가 있어야합니다.
    title: {
        "ko": '로보타미코딩',
        "en": 'RobotamiCoding'
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
        NOTONE: 6,
        ULTRASONIC: 7,
        TIMER: 8,
        DC_MOTOR: 9,
        DC_STOP: 10,
        ROBOT: 11,
        ROBOT_STOP: 12,
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
    direction: {
        CENTER: 0,
        UP: 1,
        DOWN: 2,
        LEFT: 3,
        LEFT_UP: 4,
        LEFT_DOWN: 5,
        RIGHT: 6,
        RIGHT_UP: 7,
        RIGHT_DOWN: 8,
    },
    move: {
        FORWARD: [1.0, 1.0],
        BACKWARD: [-1.0, -1.0],
        LEFT: [0.5, 1.0],
        RIGHT: [1.0, 0.5],
    },
    color: {
        RED: [1.0, 0.0, 0.0],
        ORANGE: [1.0, 0.6, 0.0],
        YELLOW: [1.0, 1.0, 0.0],
        GREEN: [0.0, 1.0, 0.0],
        BLUE: [0.0, 0.0, 1.0],
        INDIGO: [0.2, 0.2, 1.0],
        PURPLE: [1.0, 0.0, 1.0],
        PINK: [1.0, 0.6, 1.0],
        SKYBLUE: [0.2, 1.0, 1.0],        
        WHITE: [1.0, 1.0, 1.0],
        ALL: [1.0, 1.0, 1.0],
    },
    highList: ['high', '1', 'on'],
    lowList: ['low', '0', 'off'],
    BlockState: {},
};

Entry.RobotamiCoding.setLanguage = function() {
    return {
        ko: {
            Blocks: {
                ROBOTAMICODING_DCM_CLOCKWISE: '시계방향',
                ROBOTAMICODING_DCM_COUNTERCLOCKWISE: '반시계방향',
                ROBOTAMICODING_ROBOT_FORWARD: '전진',
                ROBOTAMICODING_ROBOT_BACKWARD: '후진',
                ROBOTAMICODING_ROBOT_LEFT: '좌회전',
                ROBOTAMICODING_ROBOT_RIGHT: '우회전',
                ROBOTAMICODING_ROBOT_GOLEFT: '전진좌회전',
                ROBOTAMICODING_ROBOT_GORIGHT: '전진우회전',
                ROBOTAMICODING_ROBOT_TURNLEFT: '제자리좌회전',
                ROBOTAMICODING_ROBOT_TURNRIGHT: '제자리우회전',

                ROBOTAMICODING_JOYSTICK_CENTER: '가운데',
	            ROBOTAMICODING_JOYSTICK_UP: '위',
                ROBOTAMICODING_JOYSTICK_DOWN: '아래',
                ROBOTAMICODING_JOYSTICK_LEFT: '왼쪽',
	            ROBOTAMICODING_JOYSTICK_LEFT_UP: '왼쪽 위',
                ROBOTAMICODING_JOYSTICK_LEFT_DOWN: '왼쪽 아래',                
                ROBOTAMICODING_JOYSTICK_RIGHT: '오른쪽',
                ROBOTAMICODING_JOYSTICK_RIGHT_UP: '오른쪽 위',
                ROBOTAMICODING_JOYSTICK_RIGHT_DOWN: '오른쪽 아래',

                ROBOTAMICODING_COLOR_RED: '빨강',
                ROBOTAMICODING_COLOR_ORANGE: '주황',
                ROBOTAMICODING_COLOR_YELLOW: '노랑',
                ROBOTAMICODING_COLOR_GREEN: '초록',
                ROBOTAMICODING_COLOR_BLUE: '파랑',
                ROBOTAMICODING_COLOR_INDIGO: '남색',
                ROBOTAMICODING_COLOR_PURPLE: '보라',
                ROBOTAMICODING_COLOR_PINK: '분홍',
                ROBOTAMICODING_COLOR_SKYBLUE: '하늘색',  
                ROBOTAMICODING_COLOR_WHITE: '하양',
                ROBOTAMICODING_COLOR_ALL: '모두',                

                ROBOTAMICODING_BUZZER_WN: '온음표',
                ROBOTAMICODING_BUZZER_HN: '2분음표',
                ROBOTAMICODING_BUZZER_QN: '4분음표',
                ROBOTAMICODING_BUZZER_EN: '8분음표',
                ROBOTAMICODING_BUZZER_SN: '16분음표',
                ROBOTAMICODING_BUZZER_TN: '32분음표',                

            },
            template: {
                robotami_coding_get_analog_value: '아날로그 %1 번 포트 입력값',
                robotami_coding_get_analog_value_map: '%1 의 범위를 %2 ~ %3 에서 %4 ~ %5 로 변환값',                
                robotami_coding_get_digital_value: '디지털 %1 번 포트 입력값이 참',                
                robotami_coding_get_joystick:'조이스틱 방향이 %1',
                robotami_coding_get_joystick_button: '조이스틱 버튼 %1 번이 눌러져 있다',
                robotami_coding_set_digital_value: '디지털 %1 번 포트로 %2 출력하기 %3',
                robotami_coding_toggle_led:  'LED %1 번 포트로 %2 %3',
                robotami_coding_set_pwm: 'PWM %1 번 포트로 %2 출력하기 %3',
                robotami_coding_set_rgb: 'RGB LED 빨강을 %1번 포트로 %4%  초록을 %2번 포트로 %5%  파랑을 %3번 포트로 %6% 켜기 %7',
                robotami_coding_set_rgb_color: 'RGB LED %1색을 밝기 %2%로 켜기 %3',
                robotami_coding_set_tone_octav_time: '계명 %1 를 %2 옥타브로 %3 초 동안 연주하기 %4',
                robotami_coding_set_tone_octav_beat: '계명 %1 를 %2 옥타브로 %3  로 연주하기 %4',
                robotami_coding_set_tone_freq: '주파수 %1 Hz음을 %2 초 연주하기 %3',
                robotami_coding_set_tone_off: '%1 민큼 연주쉬기 %2',
                robotami_coding_set_servo: '서보모터 %1 을 %2 도 위치로 회전 시키기 %3',
                robotami_coding_set_dcm_value: 'DC모터 %1 번을 %2 의 속도로 %3 으로 회전 시키기 %4',
                robotami_coding_set_dcm_stop: 'DC모터 %1 번 정지시키기 %2',
                robotami_coding_set_robot_value: '로봇을 %1 의 속도로 %2 시키기 %3',
                robotami_coding_set_robot_stop: '로봇 정지시키기 %1',
            },
        },
        en: {
            Blocks: {
                ROBOTAMICODING_DCM_CLOCKWISE: 'CW',
                ROBOTAMICODING_DCM_COUNTERCLOCKWISE: 'CCW',
                ROBOTAMICODING_ROBOT_FORWARD: 'go forward',
                ROBOTAMICODING_ROBOT_BACKWARD: 'go backward',
                ROBOTAMICODING_ROBOT_LEFT: 'turn left',
                ROBOTAMICODING_ROBOT_RIGHT: 'turn right',
                ROBOTAMICODING_ROBOT_GOLEFT: 'move forward to the left',
                ROBOTAMICODING_ROBOT_GORIGHT: 'move forward to the right',
                ROBOTAMICODING_ROBOT_TURNLEFT: 'turn left in place',
                ROBOTAMICODING_ROBOT_TURNRIGHT: 'turn right in place',

                ROBOTAMICODING_JOYSTICK_CENTER: 'CENTER데',
	            ROBOTAMICODING_JOYSTICK_UP: 'UP',
                ROBOTAMICODING_JOYSTICK_DOWN: 'DOWN',
                ROBOTAMICODING_JOYSTICK_LEFT: 'LEF',
	            ROBOTAMICODING_JOYSTICK_LEFT_UP: 'LEFT_UP',
                ROBOTAMICODING_JOYSTICK_LEFT_DOWN: 'ㅣEFT_DOWN',                
                ROBOTAMICODING_JOYSTICK_RIGHT: 'RIGHT',
                ROBOTAMICODING_JOYSTICK_RIGHT_UP: 'RIGHT_UP',
                ROBOTAMICODING_JOYSTICK_RIGHT_DOWN: 'RIGHT_DOWN',

                ROBOTAMICODING_COLOR_RED: 'RED',
                ROBOTAMICODING_COLOR_ORANGE: 'ORANGE',
                ROBOTAMICODING_COLOR_YELLOW: 'YELLOW',
                ROBOTAMICODING_COLOR_GREEN: 'GREEN',
                ROBOTAMICODING_COLOR_BLUE: 'BLUE',
                ROBOTAMICODING_COLOR_INDIGO: 'INDIGO',
                ROBOTAMICODING_COLOR_PURPLE: 'PURPLE',
                ROBOTAMICODING_COLOR_PINK: 'PINK',
                ROBOTAMICODING_COLOR_SKYBLUE: 'SKYBLUE',  
                ROBOTAMICODING_COLOR_WHITE: 'WHITE',
                ROBOTAMICODING_COLOR_ALL: 'ALL', 

                ROBOTAMICODING_BUZZER_WN: '온음표',
                ROBOTAMICODING_BUZZER_HN: '2분음표',
                ROBOTAMICODING_BUZZER_QN: '4분음표',
                ROBOTAMICODING_BUZZER_EN: '8분음표',
                ROBOTAMICODING_BUZZER_SN: '16분음표',
                ROBOTAMICODING_BUZZER_TN: '32분음표',
            },
            template: {
                robotami_coding_get_analog_value: 'value of analog %1',
                robotami_coding_get_analog_value_map: 'Map value %1 %2 ~ %3 to %4 ~ %5',
                robotami_coding_get_digital_value: 'value of digital %1',                
                robotami_coding_get_joystick:'Joystic Direction %1?',
                robotami_coding_get_joystick_button: 'joystic button %1 pressed',
                robotami_coding_set_digital_value: 'set digital port %1 for output %2 %3',
                robotami_coding_toggle_led: 'turn LED port %1 for output %2 %3',
                robotami_coding_set_pwm: 'set PWM port %1 for output %2 %3',
                robotami_coding_set_rgb: 'set RGB LED Red %1 port %4%, Green %2 port %5%, Blue %3 port %6% output %7',
                robotami_coding_set_rgb_color: 'turn on RGB  %1color  %2 brightness %3',
                robotami_coding_set_tone_octav_time: 'play tone on note %1 octave %2 for %3 seconds %4',
                robotami_coding_set_tone_octav_beat: 'play tone on note %1 octave %2 for %3 beat %4',
                robotami_coding_set_tone_freq: 'frequency %1 Hz note %2 play tone %3',
                robotami_coding_set_tone_off: '%1  no play tone %2',
                robotami_coding_set_servo: 'set servo motor %1 for angle %2 %3',
                robotami_coding_set_dcm_value: 'set DC motor %1 speed %2, direction %3 %4',
                robotami_coding_set_dcm_stop: 'stop DC motor %1 %2',
                robotami_coding_set_robot_value: 'move robot %2 at speed %1 %3',
                robotami_coding_set_robot_stop: 'stop robot %1',
            },
        },
    };
};

Entry.RobotamiCoding.blockMenuBlocks = [
    'robotami_coding_get_analog_value',
    'robotami_coding_get_analog_value_map',
    'robotami_coding_get_digital_value',
    'robotami_coding_get_joystick',
    'robotami_coding_get_joystick_button',
    'robotami_coding_set_digital_value',
    'robotami_coding_toggle_led',
    'robotami_coding_set_pwm',
    'robotami_coding_set_rgb',
    'robotami_coding_set_rgb_color',
    'robotami_coding_set_tone_octav_time',
    'robotami_coding_set_tone_octav_beat',
    'robotami_coding_set_tone_freq',
    'robotami_coding_set_tone_off',
    'robotami_coding_set_servo',
    'robotami_coding_set_dcm_value',
    'robotami_coding_set_dcm_stop',
    'robotami_coding_set_robot_value',
    'robotami_coding_set_robot_stop',
];

Entry.RobotamiCoding.getBlocks = function() {
    return {

        // 로보타미 코딩 아날로그 리스트
        robotami_coding_analog_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['A0', '0'],
                        ['A1', '1'],
                        ['A2', '2'],
                        ['A3', '3'],
                        ['A4', '4'],
                        ['A5', '5'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                PORT: 0,
            },
            func: function(sprite, script) {
                return script.getField('PORT');
            },
            syntax: undefined,
        },
        
        robotami_coding_get_analog_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'robotami_coding_analog_list',
                    },
                ],
                type: 'robotami_coding_get_analog_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'RobotamiCodingGet',
            isNotFor: ['RobotamiCoding'],
            func: function(sprite, script) {
                var port = script.getValue('PORT', script);
                var ANALOG = Entry.hw.portData.ANALOG;
                if (port[0] === 'A') port = port.substring(1);
                return ANALOG ? ANALOG[port] || 0 : 0;
            },
            syntax: undefined,
        },
        robotami_coding_get_analog_value_map: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
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
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'robotami_coding_get_analog_value',
                        params: [
                            {
                                type: 'robotami_coding_analog_list',
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
                type: 'robotami_coding_get_analog_value_map',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE2: 1,
                VALUE3: 2,
                VALUE4: 3,
                VALUE5: 4,
            },
            class: 'RobotamiCodingGet',
            isNotFor: ['RobotamiCoding'],
            func(sprite, script) {
                let result = script.getValue('PORT', script);
                const ANALOG = Entry.hw.portData.ANALOG;
                let value2 = script.getNumberValue('VALUE2', script);
                let value3 = script.getNumberValue('VALUE3', script);
                let value4 = script.getNumberValue('VALUE4', script);
                let value5 = script.getNumberValue('VALUE5', script);
                const stringValue4 = script.getValue('VALUE4', script);
                const stringValue5 = script.getValue('VALUE5', script);
                let isFloat = false;

                if (
                    (Entry.Utils.isNumber(stringValue4) && stringValue4.indexOf('.') > -1) ||
                    (Entry.Utils.isNumber(stringValue5) && stringValue5.indexOf('.') > -1)
                ) {
                    isFloat = true;
                }

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

                if (isFloat) {
                    result = Math.round(result * 100) / 100;
                } else {
                    result = Math.round(result);
                }
                return result;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.map(%1, %2, %3, %4, %5)',
                        blockType: 'param',
                        textParams: [
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
                        ],
                    },
                ],
            },
        },
        // 로보타미 코딩 디지털 리스트
        robotami_coding_digital_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['2', '2'],
                        ['3', '3'],
                        ['8', '8'],
                        ['9', '9'],
                        ['10', '10'],
                        ['11', '11'],
                        ['12', '12'],
                        ['13', '13'],
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
            },
            paramsKeyMap: {
                PORT: 0,
            },
            func: function(sprite, script) {
                return script.getField('PORT');
            },
            syntax: undefined,
        },

        robotami_coding_get_digital_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'robotami_coding_digital_list',
                    },
                ],
                type: 'robotami_coding_get_digital_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'RobotamiCodingGet',
            isNotFor: ['RobotamiCoding'],
            func: function(sprite, script) {
                const { hwModule = {} } = Entry.hw;
                const { name } = hwModule;
                if (name === 'RobotamiCoding') {
                    var port = script.getNumberValue('PORT', script);
                    var DIGITAL = Entry.hw.portData.DIGITAL;
                    if (!Entry.hw.sendQueue['GET']) {
                        Entry.hw.sendQueue['GET'] = {};
                    }
                    Entry.hw.sendQueue['GET'][Entry.RobotamiCoding.sensorTypes.DIGITAL] = {
                        port: port,
                        time: new Date().getTime(),
                    };
                    return DIGITAL ? DIGITAL[port] || 0 : 0;
                } else {
                    return Entry.block.robotami_coding_get_digital_value.func(sprite, script);
                }
            },
            syntax: undefined,
        },
        
        robotami_coding_get_joystick: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
		                [Lang.Blocks.ROBOTAMICODING_JOYSTICK_CENTER, '0'],
                        [Lang.Blocks.ROBOTAMICODING_JOYSTICK_UP, '1'],
                        [Lang.Blocks.ROBOTAMICODING_JOYSTICK_DOWN, '2'],
                        [Lang.Blocks.ROBOTAMICODING_JOYSTICK_LEFT, '3'],                        
                        [Lang.Blocks.ROBOTAMICODING_JOYSTICK_LEFT_UP, '4'],
                        [Lang.Blocks.ROBOTAMICODING_JOYSTICK_LEFT_DOWN,'5'],
                        [Lang.Blocks.ROBOTAMICODING_JOYSTICK_RIGHT,'6'],
                        [Lang.Blocks.ROBOTAMICODING_JOYSTICK_RIGHT_UP, '7'],
                        [Lang.Blocks.ROBOTAMICODING_JOYSTICK_RIGHT_DOWN, '8'],                        
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'robotami_coding_get_joystick',
            },
            paramsKeyMap: {
                DIRECTION: 0,
            },
            class: 'RobotamiCodingGet',
            isNotFor: ['RobotamiCoding'],
            func(sprite, script) {
                const direction = script.getField('DIRECTION', script);
                const ANALOG = Entry.hw.portData.ANALOG;

                const getValue = function(w) {
                    return ANALOG[w] <= 20 ? 0 : ANALOG[w] >= 42 ? 2 : 1;
                };

                if (
                    direction == Entry.RobotamiCoding.direction.CENTER &&
                    getValue(0) == 1 &&
                    getValue(1) == 1
                ) {
                    return 1;
                } else if (
                    direction == Entry.RobotamiCoding.direction.UP &&
                    getValue(0) == 1 &&
                    getValue(1) == 0
                ) {
                    return 1;
                } else if (
                    direction == Entry.RobotamiCoding.direction.DOWN &&
                    getValue(0) == 1 &&
                    getValue(1) == 2
                ) {
                    return 1;
                } else if (
                    direction == Entry.RobotamiCoding.direction.LEFT &&
                    getValue(0) == 0 &&
                    getValue(1) == 1
                ) {
                    return 1;
                } else if (
                    direction == Entry.RobotamiCoding.direction.LEFT_UP &&
                    getValue(0) == 0 &&
                    getValue(1) == 0
                ) {
                    return 1;
                }  else if (
                    direction == Entry.RobotamiCoding.direction.LEFT_DOWN &&
                    getValue(0) == 0 &&
                    getValue(1) == 2
                ) {
                    return 1;
                }else if (
                    direction == Entry.RobotamiCoding.direction.RIGHT &&
                    getValue(0) == 2 &&
                    getValue(1) == 1
                ) {
                    return 1;
                } else if (
                    direction == Entry.RobotamiCoding.direction.RIGHT_UP &&
                    getValue(0) == 2 &&
                    getValue(1) == 0
                ) {
                    return 1;
                } else if (
                    direction == Entry.RobotamiCoding.direction.RIGHT_DOWN &&
                    getValue(0) == 2 &&
                    getValue(1) == 2
                ) {
                    return 1;
                }
                return 0;
            },
        },              
        robotami_coding_get_joystick_button: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
		                ['A2', '2'],                                               
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
                type: 'robotami_coding_get_joystick_button',
            },
            paramsKeyMap: {},        
            class: 'RobotamiCodingGet',
            isNotFor: ['RobotamiCoding'],
            func(sprite, script) {
                const ANALOG = Entry.hw.portData.ANALOG;
                return ANALOG ? ANALOG[2] == 0 : 1;
            },
        },
        // 로보타미 코딩 디지털 리스트
        robotami_coding_digital_value_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['0', '0'],
                        ['1', '1'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            func: function(sprite, script) {
                return script.getField('VALUE');
            },
            syntax: undefined,
        },

        robotami_coding_set_digital_value: {
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
                    defaultType: 'number',
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
                        type: 'robotami_coding_digital_list',
                    },
                    {
                        type: 'robotami_coding_digital_value_list',
                    },
                    null,
                ],
                type: 'robotami_coding_set_digital_value',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'RobotamiCoding',
            isNotFor: ['RobotamiCoding'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var value = script.getNumberValue('VALUE');

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.RobotamiCoding.sensorTypes.DIGITAL,
                    data: value,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: undefined,
        },
        robotami_coding_toggle_led_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['2', '2'],                       
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
            },
            paramsKeyMap: {
                PORT: 0,
            },
            func: function(sprite, script) {
                return script.getField('PORT');
            },
            syntax: undefined,
        },
        robotami_coding_toggle_led: {
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
                        type: 'robotami_coding_toggle_led_list',                       
                    },
                    {
                        type: 'arduino_get_digital_toggle',
                        params: ['on'],
                    },
                    null,
                ],
                type: 'robotami_coding_toggle_led',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'RobotamiCoding',
            isNotFor: ['RobotamiCoding'],
            func(sprite, script) {
                const port = script.getNumberValue('PORT');
                let value = script.getValue('VALUE');

                if (typeof value === 'string') {
                    value = value.toLowerCase();
                }
                if (Entry.RobotamiCoding.highList.indexOf(value) > -1) {
                    value = 255;
                } else if (Entry.RobotamiCoding.lowList.indexOf(value) > -1) {
                    value = 0;
                } else {
                    throw new Error();
                }
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[port] = {
                    type: Entry.RobotamiCoding.sensorTypes.DIGITAL,
                    data: value,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.digitalWrite(%1, %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        // 로보타미 코딩 PWM 포트 리스트
        robotami_coding_pwm_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['3', '3'],
                        ['9', '9'],
                        ['10', '10'],
                        ['11', '11'],
                    ],
                    value: '3',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                PORT: 0,
            },
            func: function(sprite, script) {
                return script.getField('PORT');
            },
            syntax: undefined,
        },

        robotami_coding_set_pwm: {
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
                    defaultType: 'number',
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
                        type: 'robotami_coding_pwm_list',
                    },
                    {
                        type: 'text',
                        params: ['255'],
                    },
                    null,
                ],
                type: 'robotami_coding_set_pwm',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'RobotamiCoding',
            isNotFor: ['RobotamiCoding'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var value = script.getNumberValue('VALUE');
                value = Math.round(value);
                value = Math.max(value, 0);
                value = Math.min(value, 255);
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.RobotamiCoding.sensorTypes.PWM,
                    data: value,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: undefined,
        },        
                
        robotami_coding_set_rgb: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            //template: Lang.template.robotami_coding_set_rgb,
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['11', '11'],                       
                    ],
                    value: '11',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['10', '10'],                       
                    ],
                    value: '10',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['9', '9'],                       
                    ],
                    value: '9',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    value: '0',
                    fontSize: 11,                    
                },
                {
                    type: 'Block',
                    accept: 'string',
                    value: '0',
                    fontSize: 11,                    
                },
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
                params: [],
                type: 'robotami_coding_set_rgb',
            },
            paramsKeyMap: {
                PORT1: 0,
                PORT2: 1,
                PORT3: 2,
                VALUE1: 3,
                VALUE2: 4,
                VALUE3: 5,
            },
            class: 'RobotamiCoding',
            isNotFor: ['RobotamiCoding'],
            func: function(sprite, script) {
                var port1 = script.getNumberValue('PORT1', script);
                var port2 = script.getNumberValue('PORT2', script);
                var port3 = script.getNumberValue('PORT3', script);

                var value1 = script.getNumberValue('VALUE1', script);
                    value1 = Math.round(2.55*value1);
                    value1 =Math.max(Math.min(value1, 255), 0);                    

                var value2 = script.getNumberValue('VALUE2', script);
                    value2 = Math.round(2.55*value2);
                    value2 =Math.max(Math.min(value2, 255), 0);
                    
                var value3 = script.getNumberValue('VALUE3', script);
                    value3 = Math.round(2.55*value3);
                    value3 =Math.max(Math.min(value3, 255), 0);                                                   

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[8] = {
                    type: Entry.RobotamiCoding.sensorTypes.DIGITAL,
                    data: 0,
                    time: new Date().getTime(),
                };
                Entry.hw.sendQueue.SET[port1] = {
                    type: Entry.RobotamiCoding.sensorTypes.PWM,
                    data: value1,
                    time: new Date().getTime(),
                };
                Entry.hw.sendQueue.SET[port2] = {
                    type: Entry.RobotamiCoding.sensorTypes.PWM,
                    data: value2,
                    time: new Date().getTime(),
                };
                Entry.hw.sendQueue.SET[port3] = {
                    type: Entry.RobotamiCoding.sensorTypes.PWM,
                    data: value3,
                    time: new Date().getTime(),
                };
                 return script.callReturn();
            },
            syntax: { js: [], py: [{}] },
        },
        robotami_coding_set_rgb_color: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOTAMICODING_COLOR_RED, '빨강'],
                        [Lang.Blocks.ROBOTAMICODING_COLOR_ORANGE, '주황'],
                        [Lang.Blocks.ROBOTAMICODING_COLOR_YELLOW, '노랑'],
                        [Lang.Blocks.ROBOTAMICODING_COLOR_GREEN, '초록'],
                        [Lang.Blocks.ROBOTAMICODING_COLOR_BLUE, '파랑'],
                        [Lang.Blocks.ROBOTAMICODING_COLOR_INDIGO, '남색'],
                        [Lang.Blocks.ROBOTAMICODING_COLOR_PURPLE, '보라'],
                        [Lang.Blocks.ROBOTAMICODING_COLOR_PINK, '분홍'],
                        [Lang.Blocks.ROBOTAMICODING_COLOR_SKYBLUE, '하늘색'],         
                        [Lang.Blocks.ROBOTAMICODING_COLOR_WHITE, '하양'],
                        [Lang.Blocks.ROBOTAMICODING_COLOR_ALL, '모두'],
                    ],
                    value: '빨강',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
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
                params: [],
                type: 'robotami_coding_set_rgb_color',
            },
            paramsKeyMap: {
                COLOR: 0,
                BRIGHTNESS: 1,
            },
            class: 'RobotamiCoding',
            isNotFor: ['RobotamiCoding'],
            func(sprite, script) {               
                const colorType = script.getField('COLOR', script);
                const color = Entry.RobotamiCoding.color[colorType];
                let brightness = script.getNumberValue('BRIGHTNESS', script);
                brightness = Math.round(2.55*brightness);
                brightness = Math.max(Math.min(brightness, 255), 0);
                let r = brightness;
                let g = brightness;
                let b = brightness;

                if (colorType == '빨강') {
                    r = 1*brightness; g = 0*brightness; b = 0*brightness;
                } else if (colorType == '주황') {
                    r = 1*brightness; g = 0.6*brightness; b = 0*brightness;
                } else if (colorType == '노랑') {
                    r = 1*brightness; g = 1*brightness; b = 0*brightness;
                }  else if (colorType == '초록') {
                    r = 0*brightness; g = 1*brightness; b = 0*brightness;
                } else if (colorType == '파랑') {
                    r = 0*brightness; g = 0*brightness; b = 1*brightness;
                }  else if (colorType == '남색') {
                    r = 0.2*brightness; g = 0.2*brightness; b = 1*brightness;
                } else if (colorType == '보라') {
                    r = 1*brightness; g = 0*brightness; b = 1*brightness;
                } else if (colorType == '분홍') {
                    r = 1*brightness; g = 0.6*brightness; b = 1*brightness;
                }  else if (colorType == '하늘색') {
                    r = 0.2*brightness; g = 1*brightness; b = 1*brightness;
                } else if (colorType == '하양') {
                    r = 1*brightness; g = 1*brightness; b = 1*brightness;
                } else if (colorType == '모두') {
                    r = 1*brightness; g = 1*brightness; b = 1*brightness;
                }                  

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[8] = {
                    type: Entry.RobotamiCoding.sensorTypes.DIGITAL,
                    data: 0,
                    time: new Date().getTime(),
                };
                Entry.hw.sendQueue.SET[11] = {
                    type: Entry.RobotamiCoding.sensorTypes.PWM,
                    data: r,
                    time: new Date().getTime(),
                };
                Entry.hw.sendQueue.SET[10] = {
                    type: Entry.RobotamiCoding.sensorTypes.PWM,
                    data: g,
                    time: new Date().getTime(),
                };
                Entry.hw.sendQueue.SET[9] = {
                    type: Entry.RobotamiCoding.sensorTypes.PWM,
                    data: b,
                    time: new Date().getTime(),
                };                                                          
                return script.callReturn();                             
            },
        },
        // 로보타미 코딩 계명 리스트
        robotami_coding_tone_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.do_name, 'C'],
                        [Lang.Blocks.do_sharp_name, 'CS'],
                        [Lang.Blocks.re_name, 'D'],
                        [Lang.Blocks.re_sharp_name, 'DS'],
                        [Lang.Blocks.mi_name, 'E'],
                        [Lang.Blocks.fa_name, 'F'],
                        [Lang.Blocks.fa_sharp_name, 'FS'],
                        [Lang.Blocks.sol_name, 'G'],
                        [Lang.Blocks.sol_sharp_name, 'GS'],
                        [Lang.Blocks.la_name, 'A'],
                        [Lang.Blocks.la_sharp_name, 'AS'],
                        [Lang.Blocks.si_name, 'B'],
                    ],
                    value: 'C',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                NOTE: 0,
            },
            func: function(sprite, script) {
                return script.getField('NOTE');
            },
            syntax: undefined,
        },

        robotami_coding_tone_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'robotami_coding_tone_list',
                    },
                ],
                type: 'robotami_coding_tone_value',
            },
            paramsKeyMap: {
                NOTE: 0,
            },
            func: function(sprite, script) {
                return script.getNumberValue('NOTE');
            },
            syntax: undefined,
        },

        // 로보타미 코딩 옥타브 리스트
        robotami_coding_octave_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', '1'],
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['5', '5'],
                        ['6', '6'],
                        ['7', '7'],
                    ],
                    value: '4',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                OCTAVE: 0,
            },
            func: function(sprite, script) {
                return script.getField('OCTAVE');
            },
            syntax: undefined,
        },

        robotami_coding_set_tone_octav_time: {
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
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
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
                        type: 'robotami_coding_tone_list',
                    },
                    {
                        type: 'robotami_coding_octave_list',
                    },
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'robotami_coding_set_tone_octav_time',
            },
            paramsKeyMap: {
                NOTE: 0,
                OCTAVE: 1,
                DURATION: 2,
            },
            class: 'RobotamiCoding',
            isNotFor: ['RobotamiCoding'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var port = 13;

                if (!script.isStart) {
                    var note = script.getValue('NOTE', script);                    
                    var octave = script.getNumberValue('OCTAVE', script) - 1;
                    var duration = script.getNumberValue('DURATION', script);
                    var value = 0;
                    if (!Entry.Utils.isNumber(note)) note = Entry.RobotamiCoding.toneTable[note];

                    if (note < 0) {
                        note = 0;
                    } else if (note > 12) {
                        note = 12;
                    }
                    if (octave < 0) {
                        octave = 0;
                    } else if (octave > 5) {
                        octave = 5;
                    }                
                    if (duration < 0) {
                        duration = 0;
                    }
                    if (!sq['SET']) {
                        sq['SET'] = {};
                    }
                    if (duration === 0) {
                        sq['SET'][port] = {
                            type: Entry.RobotamiCoding.sensorTypes.TONE,
                            data: 0,
                            time: new Date().getTime(),
                        };
                        return script.callReturn();
                    }
                    if (note != 0) {
                        value = Entry.RobotamiCoding.toneMap[note][octave];
                    }

                    duration = duration * 1000;
                    script.isStart = true;
                    script.timeFlag = 1;

                    sq['SET'][port] = {
                        type: Entry.RobotamiCoding.sensorTypes.TONE,
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
                        type: Entry.RobotamiCoding.sensorTypes.TONE,
                        data: 0,
                        time: new Date().getTime(),
                    };
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: undefined,
        },
        robotami_coding_set_tone_octav_beat: {
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
                    defaultType: 'number',
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOTAMICODING_BUZZER_WN, 1000],
                        [Lang.Blocks.ROBOTAMICODING_BUZZER_HN, 500],
                        [Lang.Blocks.ROBOTAMICODING_BUZZER_QN, 250],
                        [Lang.Blocks.ROBOTAMICODING_BUZZER_EN, 125],
                        [Lang.Blocks.ROBOTAMICODING_BUZZER_SN, 63],
                        [Lang.Blocks.ROBOTAMICODING_BUZZER_TN, 31],
                    ],
                    value: 250,
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
                    {
                        type: 'robotami_coding_tone_list',
                    },
                    {
                        type: 'robotami_coding_octave_list',
                    },
                    null, null,
                ],
                type: 'robotami_coding_set_tone_octav_beat',
            },
            paramsKeyMap: {
                NOTE: 0,
                OCTAVE: 1,
                DURATION: 2,
            },
            class: 'RobotamiCoding',
            isNotFor: ['RobotamiCoding'],            
            func(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var port = 13;

                if (!script.isStart) {
                    var note = script.getValue('NOTE', script);
                    var octave = script.getNumberValue('OCTAVE', script) - 1;
                    var duration = script.getNumberValue('DURATION', script);
                    var value = 0;

                    if (!Entry.Utils.isNumber(note)) note = Entry.RobotamiCoding.toneTable[note];

                    if (note < 0) {
                        note = 0;
                    } else if (note > 12) {
                        note = 12;
                    }
                    if (octave < 0) {
                        octave = 0;
                    } else if (octave > 5) {
                        octave = 5;
                    }                   

                    if (note != 0) {
                        value = Entry.RobotamiCoding.toneMap[note][octave];
                    }                    

                    if (duration < 0) {
                        duration = 0;
                    }

                    if (!sq['SET']) {
                        sq['SET'] = {};
                    }

                    if (duration === 0) {
                        sq['SET'][port] = {
                            type: Entry.RobotamiCoding.sensorTypes.TONE,
                            data: 0,
                            time: new Date().getTime(),
                        };
                        return script.callReturn();
                    }          
                    //duration = duration * 1000;
                    script.isStart = true;
                    script.timeFlag = 1;

                    sq['SET'][port] = {
                        type: Entry.RobotamiCoding.sensorTypes.TONE,
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
                        type: Entry.RobotamiCoding.sensorTypes.TONE,
                        data: 0,
                        time: new Date().getTime(),
                    };
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: undefined,
        },
        robotami_coding_set_tone_freq: {            
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
                    defaultType: 'number',
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
                        params: ['3000'],
                    },
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'robotami_coding_set_tone_freq',
            },
            paramsKeyMap: {
                FREQ: 0,
                DURATION: 1,
            },           
            class: 'RobotamiCoding',
            isNotFor: ['RobotamiCoding'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var port = 13;

                var freq = script.getValue('FREQ');
                var duration = parseInt(parseFloat(script.getValue('DURATION')) * 1000);

                if (duration < 0) {
                    duration = 0;
                }
                if (!sq.SET) {
                    sq.SET = {};
                }
                if (duration === 0) {
                    sq.SET[port] = {
                        type: Entry.RobotamiCoding.sensorTypes.TONE,
                        data: 0,
                        time: new Date().getTime(),
                    };
                    return script.callReturn();
                }
                let value = freq;

                script.isStart = true;
                script.timeFlag = 1;

                sq.SET[port] = {
                    type: Entry.RobotamiCoding.sensorTypes.TONE,
                    data: {
                        value,
                        duration,
                    },
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: undefined,
        },
        robotami_coding_set_tone_off: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOTAMICODING_BUZZER_WN, 1000],
                        [Lang.Blocks.ROBOTAMICODING_BUZZER_HN, 500],
                        [Lang.Blocks.ROBOTAMICODING_BUZZER_QN, 250],
                        [Lang.Blocks.ROBOTAMICODING_BUZZER_EN, 125],
                        [Lang.Blocks.ROBOTAMICODING_BUZZER_SN, 63],
                        [Lang.Blocks.ROBOTAMICODING_BUZZER_TN, 31],
                    ],
                    value: 250,
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
                type: 'robotami_coding_set_tone_off',
            },
            paramsKeyMap: {         
                DURATION: 0,
            },
            class: 'RobotamiCoding',
            isNotFor: ['RobotamiCoding'],
            func(sprite, script) {
                if (!script.isStart) {
                    const duration = script.getField('DURATION', script);

                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue = {
                            GET: {},
                            SET: {},
                        };
                    }

                    script.isStart = true;
                    script.timeFlag = 1;

                    Entry.hw.sendQueue.SET[13] = {
                        type: Entry.RobotamiCoding.sensorTypes.TONE,
                        data: {
                            value: 0,
                            duration,
                        },
                        time: new Date().getTime(),
                    };

                    setTimeout(() => {
                        script.timeFlag = 0;
                    }, duration + 32);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.hw.sendQueue.SET[13] = {
                        type: Entry.RobotamiCoding.sensorTypes.TONE,
                        data: 0,
                        time: new Date().getTime(),
                    };
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
        },
        robotami_coding_set_servo: {
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
                    defaultType: 'number',
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
                        type: 'robotami_coding_pwm_list',
                    },
                    {
                        type: 'text',
                        params: ['90'],
                    },
                    null,
                ],
                type: 'robotami_coding_set_servo',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'RobotamiCoding',
            isNotFor: ['RobotamiCoding'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var port = script.getNumberValue('PORT', script);
                var value = script.getNumberValue('VALUE', script);
                value = Math.min(180, value);
                value = Math.max(0, value);

                if (!sq['SET']) {
                    sq['SET'] = {};
                }
                sq['SET'][port] = {
                    type: Entry.ArduinoExt.sensorTypes.SERVO_PIN,
                    data: value,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: undefined,
        },

        // 로보타미 코딩 DC 모터 리스트
        robotami_coding_dcm_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['0', '0'],
                        ['1', '1'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                PORT: 0,
            },
            func: function(sprite, script) {
                return script.getField('PORT');
            },
            syntax: undefined,
        },

        // 로보타미 코딩 DC 모터 방향 리스트
        robotami_coding_dcm_dir_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOTAMICODING_DCM_CLOCKWISE, '0'],
                        [Lang.Blocks.ROBOTAMICODING_DCM_COUNTERCLOCKWISE, '1'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                MOTOR_DIR: 0,
            },
            func: function(sprite, script) {
                return script.getField('MOTOR_DIR');
            },
            syntax: undefined,
        },

        robotami_coding_set_dcm_value: {
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
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
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
                        type: 'robotami_coding_dcm_list',
                    },
                    {
                        type: 'text',
                        params: ['255'],
                    },
                    {
                        type: 'robotami_coding_dcm_dir_list',
                    },
                    null,
                ],
                type: 'robotami_coding_set_dcm_value',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
                MOTOR_DIR: 2,
            },

            class: 'RobotamiCoding',
            isNotFor: ['RobotamiCoding'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT', script);
                var value = script.getNumberValue('VALUE', script);
                var motor_dir = script.getNumberValue('MOTOR_DIR', script);

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.RobotamiCoding.sensorTypes.DC_MOTOR,
                    data: {
                        value: value,
                        motor_dir: motor_dir,
                    },
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: undefined,
        },
        robotami_coding_set_dcm_stop: {
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'robotami_coding_dcm_list',
                    },
                    null,
                ],
                type: 'robotami_coding_set_dcm_stop',
            },
            paramsKeyMap: {
                PORT: 0,
            },

            class: 'RobotamiCoding',
            isNotFor: ['RobotamiCoding'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT', script);
                var value = 0;

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.RobotamiCoding.sensorTypes.DC_STOP,
                    data: value,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: undefined,
        },

        // 로보타미 코딩 로봇 동작 리스트
        robotami_coding_robot_move_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOTAMICODING_ROBOT_FORWARD,'0'],
                        [Lang.Blocks.ROBOTAMICODING_ROBOT_BACKWARD,'1'],
                        [Lang.Blocks.ROBOTAMICODING_ROBOT_LEFT,'2'],
                        [Lang.Blocks.ROBOTAMICODING_ROBOT_RIGHT,'3'],
                        [Lang.Blocks.ROBOTAMICODING_ROBOT_GOLEFT,'4'],
                        [Lang.Blocks.ROBOTAMICODING_ROBOT_GORIGHT,'5'],
                        [Lang.Blocks.ROBOTAMICODING_ROBOT_TURNLEFT,'6'],
                        [Lang.Blocks.ROBOTAMICODING_ROBOT_TURNRIGHT,'7'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                ROBOT_MOVE: 0,
            },
            func: function(sprite, script) {
                return script.getField('ROBOT_MOVE');
            },
            syntax: undefined,
        },

        robotami_coding_set_robot_value: {
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
                    defaultType: 'number',
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
                        type: 'robotami_coding_robot_move_list',
                    },
                    null,
                ],
                type: 'robotami_coding_set_robot_value',
            },
            paramsKeyMap: {
                VALUE: 0,
                ROBOT_MOVE: 1,
            },

            class: 'RobotamiCoding',
            isNotFor: ['RobotamiCoding'],
            func: function(sprite, script) {
                var port = 0;
                var value = script.getNumberValue('VALUE', script);
                var robot_move = script.getNumberValue('ROBOT_MOVE', script);

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.RobotamiCoding.sensorTypes.ROBOT,
                    data: {
                        value: value,
                        robot_move: robot_move,
                    },
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: undefined,
        },
        robotami_coding_set_robot_stop: {
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
                type: 'robotami_coding_set_robot_stop',
            },
            paramsKeyMap: {

            },

            class: 'RobotamiCoding',
            isNotFor: ['RobotamiCoding'],
            func: function(sprite, script) {
                var port = 0;
                var value = 0;

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.RobotamiCoding.sensorTypes.ROBOT_STOP,
                    data: value,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: undefined,
        },
    };
};

module.exports = Entry.RobotamiCoding;
