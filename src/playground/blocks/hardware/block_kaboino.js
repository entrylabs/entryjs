'use strict';

let last_wheel_left_speed = 0;
let last_wheel_right_speed = 0;
let last_line1_string = '                     ';
let last_line2_string = '                     ';
let last_line3_string = '                     ';
let last_line4_string = '                     ';
let last_line5_string = '                     ';
let last_line6_string = '                     ';
let lcd_clear = 'cleared';

Entry.Kaboino = {
    id: '560101',
    name: 'Kaboino',
    url: 'http://www.kabotel.com/',
    imageName: 'kaboino.png',
    title: {
        ko: '카보이노',
        en: 'Kaboino',
    },
    setZero() {
        last_line1_string = '                     ';
        last_line2_string = '                     ';
        last_line3_string = '                     ';
        last_line4_string = '                     ';
        last_line5_string = '                     ';
        last_line6_string = '                     ';
        last_wheel_left_speed = 0;
        last_wheel_right_speed = 0;
        if (!Entry.hw.sendQueue.SET) {
            Entry.hw.sendQueue = {
                GET: {},
                SET: {},
            };
        }
        else {
            const keySet = Object.keys(Entry.hw.sendQueue.SET);
            keySet.forEach((key) => {
                if ((key == Entry.Kaboino.PORT_MAP.SET_BODY_SPEED_TURN_PORT) ||
                    (key == Entry.Kaboino.PORT_MAP.SET_BODY_WHEEL_SPIN_PORT) ||
                    (key == Entry.Kaboino.PORT_MAP.SET_WHEEL_SPEED_PORT)) {
                    Entry.hw.sendQueue.SET[key].data = [0, 0];
                }
                else if((key == Entry.Kaboino.PORT_MAP.SET_ULTRASONIC_ANGLE_PORT) ||
                        (key == Entry.Kaboino.PORT_MAP.SET_ROBOT_ARM_ROTATOR_PORT) ||
                        (key == Entry.Kaboino.PORT_MAP.SET_ROBOT_ARM_RAISER_PORT)) {
                    Entry.hw.sendQueue.SET[key].data = 90;
                }
                else if(key == Entry.Kaboino.PORT_MAP.SET_ROBOT_ARM_PUSHER_PORT) {
                    Entry.hw.sendQueue.SET[key].data = 110;
                }
                else {
                    Entry.hw.sendQueue.SET[key].data = 0;
                }
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
        PULSEIN: 6,
        ULTRASONIC: 7,
        TIMER: 8,
        SET_LGT: 9,
        SET_TONE: 10,
        SET_BODY_SPEED_TURN: 11,
        SET_BODY_WHEEL_SPIN: 12,
        SET_WHEEL_BALANCE: 13,
        SET_WHEEL_SPEED: 14,
        SET_DISPLAY_STRING: 15,
        SET_DISPLAY_CLEAR: 16,
        SET_SEARCH_LIGHT:17,
        GET_DUST_SENSOR: 22,
        GET_ULTRASONIC_SENSOR: 23,
        GET_COLOR_SENSOR: 24,
        GET_SND_SENSOR: 25,
        SET_BALL_HOLDER: 26,
        SET_ROBOT_ARM: 28,
        SET_ULTRASONIC_ANGLE: 29,
        SET_COLOR_SEN_LED: 30,
    },
    PORT_MAP: {
        GET_IR_BOT_CENTER_PORT: 0,
        GET_IR_BOT_LEFT_PORT: 1,
        GET_IR_BOT_RIGHT_PORT: 2,
        GET_IR_FOR_CENTER_PORT: 3,      //0
        GET_IR_FOR_LEFT_PORT: 4,        //1
        GET_IR_FOR_RIGHT_PORT: 5,       //2
        GET_LIGHT_SENSOR_PORT: 6,       //3
        GET_MID_SENSOR_PORT: 7,         //4
        GET_COLOR_SENSOR_PORT: 8,       //5
        GET_TEMP_SND_SENSOR_PORT: 9,    //6
        GET_HUMIDITY_SENSOR_PORT: 10,   //7
        GET_DUST_ULTRA_SENSOR_PORT: 11, //8

        SET_TONE_PORT: 12,
        SET_ANY_PORT: 13,
        SET_CENTER_LGT_PORT: 14,
        SET_LEFT_LGT_PORT: 15,
        SET_RIGHT_LGT_PORT: 16,
        SET_BODY_SPEED_TURN_PORT: 17,
        SET_BODY_WHEEL_SPIN_PORT: 18,
        SET_WHEEL_SPEED_PORT: 19,
        SET_DISPLAY_LINE_PORT: 20,
        SET_DISPLAY_CLEAR_PORT: 21,
        SET_SEARCH_LIGHT_PORT: 22,
        SET_BALL_HOLDER_PORT: 27,
        SET_ULTRASONIC_ANGLE_PORT: 29,
        SET_ROBOT_ARM_GRIPPER_PORT: 30,
        SET_ROBOT_ARM_PUSHER_PORT: 31,
        SET_ROBOT_ARM_RAISER_PORT: 32,
        SET_ROBOT_ARM_ROTATOR_PORT: 33,
        SET_COLOR_LED_PORT: 34,
    },
    CONST_VAL: {
        MAX_SPEED: 126,
    },
    MID_VALUE: {
        BASIC_MODEL: 1,
        BT_RC_CAR: 2,
        BALL_HOLDER_CAR: 3,
        TEMP_HUM_DUST_CAR: 4,
        ULTRASONIC_CAR: 5,
        SHOOTING_CAR: 6,
        ROBOT_ARM_CAR: 8,
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
    highList: ['high', '1', 'on', 'up'],
    lowList: ['low', '0', 'off', 'down'],
    BlockState: {},
};

Entry.Kaboino.setLanguage = function() {
    globalThis.isFirstAlertStatement = false;
    return {
        ko: {
            Blocks: {
                KABOINO_on: '켜기',
                KABOINO_off: '끄기',
                KABOINO_front_LED: '전방전조등',
                KABOINO_left_LED: '왼쪽회전등',
                KABOINO_right_LED: '오른쪽회전등',
                KABOINO_front_center_ir_sensor: '중앙 적외선 센서',
                KABOINO_front_left_ir_sensor: '왼쪽 적외선 센서',
                KABOINO_front_right_ir_sensor: '오른쪽 적외선 센서',
                KABOINO_bottom_center_ir_sensor: '중앙 적외선 센서',
                KABOINO_bottom_left_ir_sensor: '왼쪽 적외선 센서',
                KABOINO_bottom_right_ir_sensor: '오른쪽 적외선 센서',
                KABOINO_forward_wheel: '직진',
                KABOINO_backward_wheel: '후진',
                KABOINO_turn_right: '우회전',
                KABOINO_turn_left: '좌회전',
                KABOINO_spin_right: '우측돌기',
                KABOINO_spin_left: '좌측돌기',
                KABOINO_color_white: '흰색',
                KABOINO_color_red: '빨강',
                KABOINO_color_green: '녹색',
                KABOINO_color_blue: '파랑',
                KABOINO_color_black: '검정',
                KABOINO_environment_temp_sensor: '온도 센서',
                KABOINO_environment_humidity_sensor: '습도 센서',
                KABOINO_up: '올리기',
                KABOINO_down: '내리기',
                KABOINO_ultrasonic_angle_center: '정면',
                KABOINO_ultrasonic_angle_left: '왼쪽',
                KABOINO_ultrasonic_angle_right: '오른쪽',
                KABOINO_robot_arm_gripper: '집게',
                KABOINO_robot_arm_pusher: '내밀기',
                KABOINO_robot_arm_raiser: '들어올리기',
                KABOINO_robot_arm_rotator: '회전하기',
            },
            template: {
                kaboino_get_obstacle_sensor_value: '카보이노 장애물 감지 %1 값',
                kaboino_get_light_sensor_value: '카보이노 빛 감지 센서 값',
                kaboino_get_color_sensor_value: '카보이노 색상 감지 센서 값',
                kaboino_get_line_trace_sensor_value: '카보이노 라인 트레이서 감지 %1 값',
                kaboino_get_analog_value_map: '카보이노 값 범위 조정 %1 를 %2 ~ %3 에서 %4 ~ %5 로 바꾼 값',
                kaboino_set_light: '카보이노 라이트 %1 을(를) %2 %3',
                kaboino_set_tone: '카보이노 음소리 %1 옥타브 %2 음으로 %3 초 연주하기 %4',
                kaboino_set_body_speed_straight: '카보이노 차체 %1 속도 %2 , 회전 %3 속도 %4 로 이동 %5',
                kaboino_set_wheel_spin: '카보이노 제자리 %1 속도 %2 로 돌기 %3',
                kaboino_set_wheel_balance: '카보이노 바퀴 균형 방향 %1 속도 %2 로 맞추기 %3',
                kaboino_set_wheel_speed: '카보이노 좌 바퀴 %1 %2 , 우 바퀴 %3 %4 로 이동 %5',
                kaboino_set_display: '카보이노 OLED 라인 %1 위치에 %2 표시하기 %3',
                kaboino_set_display_clear: '카보이노 OLED 화면 지우기 %1',
                kaboino_get_color_sensor_value: '카보이노 색깔 감지 %1',
                kaboino_set_color_sensor_led: '카보이노 색깔 감지 LED %1 %2',
                kaboino_set_search_light: '카보이노 확장 1 서치라이트 %1 %2',
                kaboino_set_ball_holder: '카보이노 확장 2 볼 홀더 %1 %2',
                kaboino_get_environmnet_sensor_value: '카보이노 확장 3 환경 감지 %1 값',
                kaboino_get_dust_sensor_value: '카보이노 확장 3 미세먼지 감지 센서 값',
                kaboino_get_ultrasonic_value: '카보이노 확장 4 원거리 장애물 감지 센서값',
                kaboino_set_ultrasonic_angle: '카보이노 확장 4 원거리 장애물 감지 센서 방향 %1 각도 %2 %3',
                kaboino_get_sound_sensor_value: '카보이노 확장 5 타겟 감지 센서 값',
                kaboino_set_robot_arm: '카보이노 확장 7 로봇 팔 %1 조정 %2 %3',
            },
        },
        en: {
            Blocks: {
                KABOINO_on: 'on',
                KABOINO_off: 'off',
                KABOINO_front_LED: 'center LED',
                KABOINO_left_LED: 'left LED',
                KABOINO_right_LED: 'right LED',
                KABOINO_front_center_ir_sensor: 'center ir sensor',
                KABOINO_front_left_ir_sensor: 'left ir sensor',
                KABOINO_front_right_ir_sensor: 'right ir sensor',
                KABOINO_bottom_center_ir_sensor: 'center ir sensor',
                KABOINO_bottom_left_ir_sensor: 'left ir sensor',
                KABOINO_bottom_right_ir_sensor: 'right ir sensor',
                KABOINO_spin_right: 'spin right',
                KABOINO_spin_left: 'spin left',
                KABOINO_forward_wheel: 'straight wheel',
                KABOINO_backward_wheel: 'reverse wheel',
                KABOINO_turn_right: 'turn right',
                KABOINO_turn_left: 'turn left',
                KABOINO_spin_right: 'spin right',
                KABOINO_spin_left: 'spin left',
                KABOINO_color_white: 'white',
                KABOINO_color_red: 'red',
                KABOINO_color_green: 'green',
                KABOINO_color_blue: 'blue',
                KABOINO_color_black: 'black',
                KABOINO_environment_temp_sensor: 'temperature sensor',
                KABOINO_environment_humidity_sensor: 'humidity sensor',
                KABOINO_up: 'up',
                KABOINO_down: 'down',
                KABOINO_ultrasonic_angle_center: 'center',
                KABOINO_ultrasonic_angle_left: 'left',
                KABOINO_ultrasonic_angle_right: 'right',
                KABOINO_robot_arm_gripper: 'gripper',
                KABOINO_robot_arm_pusher: 'pusher',
                KABOINO_robot_arm_raiser: 'raiser',
                KABOINO_robot_arm_rotator: 'rotator',
            },
            template: {
                kaboino_get_obstacle_sensor_value: 'Obstacle sensor %1 value',
                kaboino_get_light_sensor_value: 'Light sensor value',
                kaboino_get_color_sensor_value: 'Color sensor value',
                kaboino_get_line_trace_sensor_value: 'Line Trace sensor %1 value',
                kaboino_get_analog_value_map: 'Map Value %1 %2 ~ %3 to %4 ~ %5',
                kaboino_set_light: 'Set light %1 as %2 %3',
                kaboino_set_tone: 'Play tone on note %1 octave %2 beat %3 %4',
                kaboino_set_body_speed_straight: 'Move Whell straight %1 Speed %2 Turn %3 Speed %4 %5',
                kaboino_set_wheel_spin: 'Wheel spin direction %1 speed %2 %3',
                kaboino_set_wheel_balance:'Wheel balance direction %1 speed %2 %3',
                kaboino_set_wheel_speed: 'Move Left wheel direction %1 Speed %2 Right wheel direction %3 Speed %4 %5',
                kaboino_set_display: 'Display height %1 string %2 %3',
                kaboino_set_display_clear: 'Clear display %1',
                kaboino_get_color_sensor_value: 'Color sensor value %1',
                kaboino_set_color_sensor_led: 'Set color led light %1 %2',
                kaboino_set_search_light: 'Extension 1 Set search light %1 %2',
                kaboino_set_ball_holder: 'Extension 2 Set ball holder %1 %2',
                kaboino_get_environmnet_sensor_value: 'Extension 3 Environment sensor %1 value',
                kaboino_get_dust_sensor_value: 'Extension 3 Dust Sensor value',
                kaboino_get_ultrasonic_value: 'Extension 4 Read ULTRASONIC sensor value',
                kaboino_set_ultrasonic_angle: 'Extension 4 set ULTRASONIC sensor direction %1 , angle %2 %3',
                kaboino_get_sound_sensor_value: 'Extension 5 Target sensor value',
                kaboino_set_robot_arm: 'Extension 7 Robot arm %1 control %2 %3',
            },
        },
    };
};

Entry.Kaboino.blockMenuBlocks = [
    'kaboino_get_obstacle_sensor_value',
    'kaboino_get_light_sensor_value',
    'kaboino_get_line_trace_sensor_value',
    'kaboino_get_analog_value_map',
    'kaboino_get_color_sensor_value',
    'kaboino_set_light',
    'kaboino_set_tone',
    'kaboino_set_spin_speed',
    'kaboino_set_body_speed_straight',
    'kaboino_set_wheel_spin',
    'kaboino_set_wheel_balance',
    'kaboino_set_wheel_speed',
    'kaboino_set_display',
    'kaboino_set_display_clear',
    'kaboino_get_color_sensor_value',
    'kaboino_set_color_sensor_led',
    'kaboino_set_search_light',
    'kaboino_set_ball_holder',
    'kaboino_get_environmnet_sensor_value',
    'kaboino_get_dust_sensor_value',
    'kaboino_get_ultrasonic_value',
    'kaboino_set_ultrasonic_angle',
    'kaboino_get_sound_sensor_value',
    'kaboino_set_robot_arm',
];

Entry.Kaboino.getBlocks = function() {
    return {
        kaboino_obstacle_sensor_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.KABOINO_front_center_ir_sensor, "frontCenterIR"],
                        [Lang.Blocks.KABOINO_front_left_ir_sensor, "frontLeftIR"],
                        [Lang.Blocks.KABOINO_front_right_ir_sensor, "frontRightIR"],
                    ],
                    value: "frontCenterIR",
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
            func(sprite, script) {
                var port = script.getStringField('PORT', script);
                return port;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.KABOINO_front_center_ir_sensor, "frontCenterIR"],
                                    [Lang.Blocks.KABOINO_front_left_ir_sensor, "frontLeftIR"],
                                    [Lang.Blocks.KABOINO_front_right_ir_sensor, "frontRightIR"],
                                ],
                                value: "frontCenterIR",
                                fontSize: 11,
                                converter: Entry.block.converters.returnStringValue,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'kaboino_obstacle_sensor_list',
                    },
                ],
            },
        },
        kaboino_get_obstacle_sensor_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
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
                        type: 'kaboino_obstacle_sensor_list',
                    },
                ],
                type: 'kaboino_get_obstacle_sensor_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'KaboinoGet',
            isNotFor: ['Kaboino'],
            func(sprite, script) {
                let receivedStringKey = script.getValue('PORT', script);
                let port = 0;
                if (receivedStringKey == "frontCenterIR") {
                    port = Entry.Kaboino.PORT_MAP.GET_IR_FOR_CENTER_PORT - 3;
                }
                else if (receivedStringKey == "frontLeftIR") {
                    port = Entry.Kaboino.PORT_MAP.GET_IR_FOR_LEFT_PORT - 3;
                }
                else if (receivedStringKey == "frontRightIR") {
                    port = Entry.Kaboino.PORT_MAP.GET_IR_FOR_RIGHT_PORT -3;
                }
                
                const ANALOG = Entry.hw.portData.ANALOG;
                
                return String(ANALOG[port]);
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Kaboino.readObstacleSensor(%1)',
                    },
                ],
            },
        },
        kaboino_get_light_sensor_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [],
                type: 'kaboino_get_light_sensor_value',
            },
            paramsKeyMap: {},
            class: 'KaboinoGet',
            isNotFor: ['Kaboino'],
            func(sprite, script) {
                let port = Entry.Kaboino.PORT_MAP.GET_LIGHT_SENSOR_PORT - 3;
                const ANALOG = Entry.hw.portData.ANALOG;
                return String(ANALOG[port]);
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Kaboino.readLightSensor()',
                    },
                ],
            },
        },
        kaboino_get_line_trace_sensor_value_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.KABOINO_bottom_center_ir_sensor, "lineCenterIR"],
                        [Lang.Blocks.KABOINO_bottom_left_ir_sensor, "lineLeftIR"],
                        [Lang.Blocks.KABOINO_bottom_right_ir_sensor, "lineRightIR"],
                    ],
                    value: "lineCenterIR",
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
            func(sprite, script) {
                var port = script.getStringField('PORT', script);
                return port;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.KABOINO_bottom_center_ir_sensor, "lineCenterIR"],
                                    [Lang.Blocks.KABOINO_bottom_left_ir_sensor, "lineLeftIR"],
                                    [Lang.Blocks.KABOINO_bottom_right_ir_sensor, "lineRightIR"],
                                ],
                                value: "lineCenterIR",
                                fontSize: 11,
                                converter: Entry.block.converters.returnStringValue,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'kaboino_get_line_trace_sensor_value_list',
                    },
                ],
            },
        },
        kaboino_get_line_trace_sensor_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
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
                        type: 'kaboino_get_line_trace_sensor_value_list',
                    },
                ],
                type: 'kaboino_get_line_trace_sensor_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'KaboinoGet',
            isNotFor: ['Kaboino'],
            func(sprite, script) {
                let receivedStringKey = script.getValue('PORT', script);
                let port = 0;

                if (receivedStringKey == "lineCenterIR") {
                    port = 0;
                }
                else if (receivedStringKey == "lineLeftIR") {
                    port = 1;
                }
                else if (receivedStringKey == "lineRightIR") {
                    port = 2;
                }

                const DIGITAL = Entry.hw.portData.DIGITAL;
                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                Entry.hw.sendQueue.GET[Entry.Kaboino.sensorTypes.DIGITAL] = {
                    port,
                    time: new Date().getTime(),
                };

                return DIGITAL ? DIGITAL[port] || 0 : 0;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Kaboino.readLineTraceSensor(%1)',
                    },
                ],
            },
        },
        
        kaboino_get_analog_value_map: {
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
                        type: 'kaboino_get_analog_value',
                        params: [
                            {
                                type: 'kaboino_analog_list',
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
                type: 'kaboino_get_analog_value_map',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE2: 1,
                VALUE3: 2,
                VALUE4: 3,
                VALUE5: 4,
            },
            class: 'KaboinoGet',
            isNotFor: ['Kaboino'],
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

                if ((Entry.Utils.isNumber(stringValue4) && stringValue4.indexOf('.') > -1) ||
                    (Entry.Utils.isNumber(stringValue5) && stringValue5.indexOf('.') > -1)) {
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
                        syntax: 'Kaboino.map(%1, %2, %3, %4, %5)',
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
        kaboino_light_port_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.KABOINO_front_LED, "centerLED"],
                        [Lang.Blocks.KABOINO_left_LED, "leftLED"],
                        [Lang.Blocks.KABOINO_right_LED, "rightLED"],
                    ],
                    value: "centerLED",
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
            func(sprite, script) {
                var port = script.getStringField('PORT', script);
                return port;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.KABOINO_front_LED, "centerLED"],
                                    [Lang.Blocks.KABOINO_left_LED, "leftLED"],
                                    [Lang.Blocks.KABOINO_right_LED, "rightLED"],
                                ],
                                value: "centerLED",
                                fontSize: 11,
                                converter: Entry.block.converters.returnStringValue,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'kaboino_light_port_list',
                    },
                ]
            },
        },
        kaboino_on_off_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.KABOINO_on, 'on'],
                        [Lang.Blocks.KABOINO_off, 'off'],
                    ],
                    value: 'on',
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
            func(sprite, script) {
                var value = script.getStringField('VALUE', script);
                return value;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.KABOINO_on, 'on'],
                                    [Lang.Blocks.KABOINO_off, 'off'],
                                ],
                                value: 'on',
                                fontSize: 11,
                                converter: Entry.block.converters.returnStringValue,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'kaboino_on_off_list',
                    },
                ]
            },
        },
        kaboino_set_light: {
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
                        type: 'kaboino_light_port_list',
                    },
                    {
                        type: 'kaboino_on_off_list',
                    },
                    null,
                ],
                type: 'kaboino_set_light',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'KaboinoSet',
            isNotFor: ['Kaboino'],
            func(sprite, script) {
                let receivedPortStringKey = script.getValue('PORT', script);
                let port = 0;
                if (receivedPortStringKey == "centerLED") {
                    port = Entry.Kaboino.PORT_MAP.SET_CENTER_LGT_PORT;
                }
                else if (receivedPortStringKey == "leftLED") {
                    port = Entry.Kaboino.PORT_MAP.SET_LEFT_LGT_PORT;
                }
                else if (receivedPortStringKey == "rightLED") {
                    port = Entry.Kaboino.PORT_MAP.SET_RIGHT_LGT_PORT;
                }

                let receivedValueStringKey = script.getValue('VALUE', script);
                let value = 0;
                
                if (receivedValueStringKey == 'on') {
                    value = 0xf;
                }
                else if (receivedValueStringKey == 'off') {
                    value = 0;
                }

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[port] = {
                    type: Entry.Kaboino.sensorTypes.SET_LGT,
                    data: value,
                    time: new Date().getTime(),
                };
                
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Kaboino.setLight(%1, %2)',
                    },
                ],
            },
        },
        kaboino_tone_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.silent, '0'],
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
            func(sprite, script) {
                return script.getField('NOTE');
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.silent, '0'],
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
                                converter: Entry.block.converters.returnStringValueUpperCase,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'kaboino_tone_list',
                    },
                ],
            },
        },
        kaboino_tone_value: {
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
                        type: 'kaboino_tone_list',
                    },
                ],
                type: 'kaboino_tone_value',
            },
            paramsKeyMap: {
                NOTE: 0,
            },
            func(sprite, script) {
                return script.getNumberValue('NOTE');
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        keyOption: 'kaboino_tone_value',
                    },
                ],
            },
        },
        kaboino_octave_list: {
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
            func(sprite, script) {
                return script.getField('OCTAVE');
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        keyOption: 'kaboino_octave_list',
                    },
                ],
            },
        },
        kaboino_set_tone: {
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
                        type: 'kaboino_tone_list',
                    },
                    {
                        type: 'kaboino_octave_list',
                    },
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'kaboino_set_tone',
            },
            paramsKeyMap: {
                NOTE: 0,
                OCTAVE: 1,
                DURATION: 2,
            },
            class: 'KaboinoSet',
            isNotFor: ['Kaboino'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = Entry.Kaboino.PORT_MAP.SET_TONE_PORT;

                if (!script.isStart) {
                    let note = script.getValue('NOTE', script);
                    if (!Entry.Utils.isNumber(note)) {
                        note = Entry.Kaboino.toneTable[note];
                    }
                    
                    if (note < 0) {
                        note = 0;
                    }
                    else if (note > 12) {
                        note = 12;
                    }

                    let duration = script.getNumberValue('DURATION', script);

                    if (duration < 0) {
                        duration = 0;
                    }

                    if (!sq.SET) {
                        sq.SET = {};
                    }

                    if (duration === 0) {
                        sq.SET[port] = {
                            type: Entry.Kaboino.sensorTypes.SET_TONE,
                            data: 0,
                            time: new Date().getTime(),
                        };
                        return script.callReturn();
                    }

                    let octave = script.getNumberValue('OCTAVE', script) - 1;
                    if (octave < 0) {
                        octave = 0;
                    }
                    else if (octave > 7) {
                        octave = 7;
                    }

                    let value = 0;

                    if (note != 0) {
                        value = Entry.Kaboino.toneMap[note][octave];
                    }

                    duration = duration * 1000;
                    script.isStart = true;
                    script.timeFlag = 1;

                    sq.SET[port] = {
                        type: Entry.Kaboino.sensorTypes.SET_TONE,
                        data: {
                            value,
                            duration,
                        },
                        time: new Date().getTime(),
                    };

                    setTimeout(() => {
                        script.timeFlag = 0;
                    }, duration + 32);
                    return script;
                }
                else if (script.timeFlag == 1) {
                    return script;
                }
                else {
                    delete script.timeFlag;
                    delete script.isStart;
                    sq.SET[port] = {
                        type: Entry.Kaboino.sensorTypes.SET_TONE,
                        data: 0,
                        time: new Date().getTime(),
                    };
                    Entry.engine.isContinue = false;

                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Kaboino.setTone(%1, %2, %3)',
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
                        ],
                    },
                ],
            },
        },
        kaboino_set_wheel_straight_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.KABOINO_forward_wheel, "forward"],
                        [Lang.Blocks.KABOINO_backward_wheel, "reverse"],
                    ],
                    value: "forward",
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
            func(sprite, script) {
                return script.getStringField('PORT');
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.KABOINO_forward_wheel, "forward"],
                                    [Lang.Blocks.KABOINO_backward_wheel, "reverse"],
                                ],
                                value: "forward",
                                fontSize: 11,
                                converter: Entry.block.converters.returnStringValue,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'kaboino_set_wheel_straight_list',
                    },
                ]
            },
        },
        kaboino_set_wheel_turn_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.KABOINO_turn_left, "leftTurn"],
                        [Lang.Blocks.KABOINO_turn_right, "rightTurn"],
                    ],
                    value: "leftTurn",
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
            func(sprite, script) {
                return script.getStringField('PORT');
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.KABOINO_turn_left, "leftTurn"],
                                    [Lang.Blocks.KABOINO_turn_right, "rightTurn"],
                                ],
                                value: "leftTurn",
                                fontSize: 11,
                                converter: Entry.block.converters.returnStringValue,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'kaboino_set_wheel_turn_list',
                    },
                ]
            },
        },
        kaboino_set_body_speed_straight: {
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
                        type: 'kaboino_set_wheel_straight_list',
                    },
                    {
                        type: 'text',
                        params: ['10'],
                    },
                    {
                        type: 'kaboino_set_wheel_turn_list',
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'kaboino_set_body_speed_straight',
            },
            paramsKeyMap: {
                CAR_BODY_STRAIGHT: 0,
                CAR_BODY_SPEED: 1,
                CAR_BODY_TURN: 2,
                CAR_BODY_TURN_SPEED: 3,
            },
            class: 'KaboinoSet',
            isNotFor: ['Kaboino'],
            func(sprite, script) {
                let car_body_straight = script.getValue('CAR_BODY_STRAIGHT', script);
                let car_body_speed = script.getValue('CAR_BODY_SPEED', script);
                let car_body_turn = script.getValue('CAR_BODY_TURN', script);
                let car_body_turn_speed = script.getValue('CAR_BODY_TURN_SPEED', script);
                const port = Entry.Kaboino.PORT_MAP.SET_BODY_SPEED_TURN_PORT;

                car_body_speed = Math.round(car_body_speed);
                car_body_speed = Math.max(car_body_speed, 0);
                car_body_speed = Math.min(car_body_speed, 125);

                car_body_turn_speed = Math.round(car_body_turn_speed);
                car_body_turn_speed = Math.max(car_body_turn_speed, 0);
                car_body_turn_speed = Math.min(car_body_turn_speed, 25);

                let wheel_left_speed;
                let wheel_right_speed;

                if (car_body_straight == "forward") {
                    if (car_body_turn == "leftTurn") {
                        wheel_left_speed = car_body_speed - car_body_speed * Math.round(car_body_turn_speed/25);
                        wheel_right_speed = car_body_speed;
                    }
                    else if (car_body_turn == "rightTurn") {
                        wheel_left_speed = car_body_speed;
                        wheel_right_speed = car_body_speed - car_body_speed * Math.round(car_body_turn_speed/25);
                    }
                }
                else if (car_body_straight == "reverse") {
                    if (car_body_turn == "leftTurn") {
                        wheel_left_speed = car_body_speed - car_body_speed * Math.round(car_body_turn_speed/25);
                        wheel_right_speed = car_body_speed;
                    }
                    else if (car_body_turn == "rightTurn") {
                        wheel_left_speed = car_body_speed;
                        wheel_right_speed = car_body_speed - car_body_speed * Math.round(car_body_turn_speed/25);
                    }
                    if (wheel_left_speed == 0) wheel_left_speed = 0;
                    else wheel_left_speed = wheel_left_speed + Entry.Kaboino.CONST_VAL.MAX_SPEED;
                    if (wheel_right_speed == 0) wheel_right_speed = 0;
                    else wheel_right_speed = wheel_right_speed + Entry.Kaboino.CONST_VAL.MAX_SPEED;
                }

                if (!(last_wheel_left_speed == wheel_left_speed) || !(last_wheel_right_speed == wheel_right_speed)) {
                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }
                    Entry.hw.sendQueue.SET[port] = {
                        type: Entry.Kaboino.sensorTypes.SET_BODY_SPEED_TURN,
                        data: [wheel_left_speed, wheel_right_speed],
                        time: new Date().getTime(),
                    };
                    last_wheel_left_speed = wheel_left_speed;
                    last_wheel_right_speed = wheel_right_speed;
                    return script;
                }
                else return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Kaboino.writeBodySpeedStraight(%1, %2, %3, %4)',
                    },
                ],
            },
        },
        kaboino_set_wheel_spin_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.KABOINO_spin_left, "leftSpin"],
                        [Lang.Blocks.KABOINO_spin_right, "rightSpin"],
                    ],
                    value: "leftSpin",
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
            func(sprite, script) {
                return script.getStringField('PORT');
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.KABOINO_spin_left, "leftSpin"],
                                    [Lang.Blocks.KABOINO_spin_right, "rightSpin"],
                                ],
                                value: "leftSpin",
                                fontSize: 11,
                                converter: Entry.block.converters.returnStringValue,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'kaboino_set_wheel_spin_list',
                    },
                ]
            },
        },
        kaboino_set_wheel_spin: {
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'kaboino_set_wheel_spin_list',
                    },
                    {
                        type: 'text',
                        params: ['10'],
                    },
                    null,
                ],
                type: 'kaboino_set_wheel_spin',
            },
            paramsKeyMap: {
                SPIN_DIR: 0,
                SPIN_SPEED: 1,
            },
            class: 'KaboinoSet',
            isNotFor: ['Kaboino'],
            func(sprite, script) {
                let spin_dir = script.getValue('SPIN_DIR', script);
                let spin_speed = script.getValue('SPIN_SPEED', script);
                const port = Entry.Kaboino.PORT_MAP.SET_BODY_WHEEL_SPIN_PORT;

                spin_speed = Math.round(spin_speed);
                spin_speed = Math.max(spin_speed, 0);
                spin_speed = Math.min(spin_speed, 125);
                
                let wheel_left_speed;
                let wheel_right_speed;

                if (spin_dir == "leftSpin") {
                    wheel_left_speed = spin_speed + Entry.Kaboino.CONST_VAL.MAX_SPEED;
                    wheel_right_speed = spin_speed;
                }
                else if (spin_dir == "rightSpin") {
                    wheel_left_speed = spin_speed;
                    wheel_right_speed = spin_speed + Entry.Kaboino.CONST_VAL.MAX_SPEED;
                }

                if (!(last_wheel_left_speed == wheel_left_speed) || !(last_wheel_right_speed == wheel_right_speed)) {
                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }
                    Entry.hw.sendQueue.SET[port] = {
                        type: Entry.Kaboino.sensorTypes.SET_BODY_WHEEL_SPIN,
                        data: [wheel_left_speed, wheel_right_speed],
                        time: new Date().getTime(),
                    };
                    last_wheel_left_speed = wheel_left_speed;
                    last_wheel_right_speed = wheel_right_speed;
                    return script;
                }
                else return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Kaboino.writeSpinPWM(%1, %2)',
                    },
                ],
            },
        },

        kaboino_set_wheel_speed: {
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
                        type: 'kaboino_set_wheel_straight_list',
                    },
                    {
                        type: 'text',
                        params: ['10'],
                    },
                    {
                        type: 'kaboino_set_wheel_straight_list',
                    },
                    {
                        type: 'text',
                        params: ['10'],
                    },
                    null,
                ],
                type: 'kaboino_set_wheel_speed',
            },
            paramsKeyMap: {
                WHEEL_LEFT_STRAIGHT: 0,
                WHEEL_LEFT_SPEED: 1,
                WHEEL_RIGHT_STRAIGHT: 2,
                WHEEL_RIGHT_SPEED: 3,
            },
            class: 'KaboinoSet',
            isNotFor: ['Kaboino'],
            func(sprite, script) {
                let wheel_left_straight = script.getValue('WHEEL_LEFT_STRAIGHT', script);
                let wheel_left_speed = script.getValue('WHEEL_LEFT_SPEED', script);
                let wheel_right_straight = script.getValue('WHEEL_RIGHT_STRAIGHT', script);
                let wheel_right_speed = script.getValue('WHEEL_RIGHT_SPEED', script);
                let port = Entry.Kaboino.PORT_MAP.SET_WHEEL_SPEED_PORT;
                
                wheel_left_speed = Math.round(wheel_left_speed);
                wheel_left_speed = Math.max(wheel_left_speed, 0);
                wheel_left_speed = Math.min(wheel_left_speed, (Entry.Kaboino.CONST_VAL.MAX_SPEED - 1));

                wheel_right_speed = Math.round(wheel_right_speed);
                wheel_right_speed = Math.max(wheel_right_speed, 0);
                wheel_right_speed = Math.min(wheel_right_speed, (Entry.Kaboino.CONST_VAL.MAX_SPEED - 1));

                if(wheel_left_straight == "forward")
                {
                    wheel_left_speed = wheel_left_speed;
                }
                else if (wheel_left_straight == "reverse")
                {
                    wheel_left_speed = wheel_left_speed + Entry.Kaboino.CONST_VAL.MAX_SPEED;
                }

                if(wheel_right_straight == "forward")
                {
                    wheel_right_speed = wheel_right_speed;
                }
                else if (wheel_right_straight == "reverse")
                {
                    wheel_right_speed = wheel_right_speed + Entry.Kaboino.CONST_VAL.MAX_SPEED;
                }

                if (!(last_wheel_left_speed == wheel_left_speed) || !(last_wheel_right_speed == wheel_right_speed)) {
                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }
                    Entry.hw.sendQueue.SET[port] = {
                        type: Entry.Kaboino.sensorTypes.SET_WHEEL_SPEED,
                        data: [wheel_left_speed, wheel_right_speed],
                        time: new Date().getTime(),
                    };
                    last_wheel_left_speed = wheel_left_speed;
                    last_wheel_right_speed = wheel_right_speed;
                    return script;
                }
                else return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Kaboino.writeMotorSpeed(%1, %2, %3, %4)',
                    },
                ],
            },
        },
        kaboino_set_display: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
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
                        type: 'number',
                        params: ['1'],
                    },
                    {
                        type: 'text', 
                        params: ['Welcome to Kaboino!'],
                    },
                    null,
                ],
                type: 'kaboino_set_display',
            },
            paramsKeyMap: {
                HEIGHT: 0,
                STRING: 1,
            },
            class: 'KaboinoSet',
            isNotFor: ['Kaboino'],
            func(sprite, script) {
                let port = Entry.Kaboino.PORT_MAP.SET_DISPLAY_LINE_PORT;
                let width = 0;
                let line = script.getValue('HEIGHT', script);
                let height = line;
                let current_string = script.getValue('STRING', script);
                let character = [];
                let buf;
                line = Math.round(line);
                line = Math.max(line, 1);
                line = Math.min(line, 6);
                let line1_string = '';
                let line2_string = '';
                let line3_string = '';
                let line4_string = '';
                let line5_string = '';
                let line6_string = '';
                lcd_clear = 'not_cleared';
                height = (line - 1) * 10;

                if (line == 1) {
                    line1_string = current_string;
                }
                else if (line == 2) {
                    line2_string = current_string;
                }
                else if (line == 3) {
                    line3_string = current_string;
                }
                else if (line == 4) {
                    line4_string = current_string;
                }
                else if (line == 5) {
                    line5_string = current_string;
                }
                else if (line == 6) {
                    line6_string = current_string;
                }
                
                if (typeof current_string === 'string') {
                    for (var i = 0; i < current_string.length; i++) {
                        buf = Entry.memaker.toByte(current_string[parseInt(i, 10)]);
                        character[parseInt(i, 10)] = buf;
                    }
                } else {
                    character[0] = current_string;
                }
                
                if ((!(last_line1_string == line1_string) && (line == 1)) ||
                    (!(last_line2_string == line2_string) && (line == 2)) ||
                    (!(last_line3_string == line3_string) && (line == 3)) ||
                    (!(last_line4_string == line4_string) && (line == 4)) ||
                    (!(last_line5_string == line5_string) && (line == 5)) ||
                    (!(last_line6_string == line6_string) && (line == 6))) {
                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }
                    Entry.hw.sendQueue.SET[port] = {
                        type: Entry.Kaboino.sensorTypes.SET_DISPLAY_STRING,
                        data: [
                            width,
                            height,
                            character[0],
                            character[1],
                            character[2],
                            character[3],
                            character[4],
                            character[5],
                            character[6],
                            character[7],
                            character[8],
                            character[9],
                            character[10],
                            character[11],
                            character[12],
                            character[13],
                            character[14],
                            character[15],
                            character[16],
                            character[17],
                            character[18],
                            character[19],
                            character[20]
                        ],
                        time: new Date().getTime(),
                    };
                    
                    if (line == 1) {
                        last_line1_string = current_string;
                    }
                    else if (line == 2) {
                        last_line2_string = current_string;
                    }
                    else if (line == 3) {
                        last_line3_string = current_string;
                    }
                    else if (line == 4) {
                        last_line4_string = current_string;
                    }
                    else if (line == 5) {
                        last_line5_string = current_string;
                    }
                    else if (line == 6) {
                        last_line6_string = current_string;
                    }

                    return script;
                }
                else return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Kaboino.displayLineString(%1, %2)',
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
        kaboino_set_display_clear: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
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
                type: 'kaboino_set_display_clear',
            },
            paramsKeyMap: {
                
            },
            class: 'KaboinoSet',
            isNotFor: ['Kaboino'],
            func(sprite, script) {
                const port = Entry.Kaboino.PORT_MAP.SET_DISPLAY_CLEAR_PORT;
                if (!(lcd_clear == 'cleared')) {
                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }
                    Entry.hw.sendQueue.SET[port] = {
                        type: Entry.Kaboino.sensorTypes.SET_DISPLAY_CLEAR,
                        data: {
                            data: 0,
                        },
                        time: new Date().getTime(),
                    };
                    lcd_clear = 'cleared';
                    last_line1_string = '                     ';
                    last_line2_string = '                     ';
                    last_line3_string = '                     ';
                    last_line4_string = '                     ';
                    last_line5_string = '                     ';
                    last_line6_string = '                     ';
                    return script;
                }
                else return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Kaboino.displayClearLine()',
                    },
                ],
            },
        },
        kaboino_get_color_sensor_value_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.KABOINO_color_white, "white"],
                        [Lang.Blocks.KABOINO_color_red, "red"],
                        [Lang.Blocks.KABOINO_color_green, "green"],
                        [Lang.Blocks.KABOINO_color_blue, "blue"],
                        [Lang.Blocks.KABOINO_color_black, "black"],
                    ],
                    value: "white",
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
            func(sprite, script) {
                var port = script.getStringField('PORT', script);
                
                return port;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.KABOINO_color_white, "white"],
                                    [Lang.Blocks.KABOINO_color_red, "red"],
                                    [Lang.Blocks.KABOINO_color_green, "green"],
                                    [Lang.Blocks.KABOINO_color_blue, "blue"],
                                    [Lang.Blocks.KABOINO_color_black, "black"],
                                ],
                                value: "white",
                                fontSize: 11,
                                converter: Entry.block.converters.returnStringValue,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'kaboino_get_color_sensor_value_list',
                    },
                ],
            },
        },
        kaboino_get_color_sensor_value: {
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
                        type: 'kaboino_get_color_sensor_value_list',
                    },
                ],
                type: 'kaboino_get_color_sensor_value',
            },
            paramsKeyMap: {
                COLOR_NUMBER: 0,
            },
            class: 'KaboinoGet',
            isNotFor: ['Kaboino'],
            func(sprite, script) {
                let receivedPortStringValue = script.getValue('COLOR_NUMBER', script);
                let color_number;

                if (receivedPortStringValue == "white")
                    color_number = 4;
                else if (receivedPortStringValue == "red")
                    color_number = 1;
                else if (receivedPortStringValue == "green")
                    color_number = 2;
                else if (receivedPortStringValue == "blue")
                    color_number = 3;
                else if (receivedPortStringValue == "black")
                    color_number = 5;

                const ColorPort = Entry.Kaboino.PORT_MAP.GET_COLOR_SENSOR_PORT - 3;
                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                Entry.hw.sendQueue.GET[Entry.Kaboino.sensorTypes.GET_COLOR_SENSOR] = {
                    port: ColorPort,
                    time: new Date().getTime(),
                };
                const COLOR_VALUE = Entry.hw.portData.COLOR;

                if (color_number == COLOR_VALUE) {
                    
                }
                else {

                }

                return (color_number == COLOR_VALUE) || 0;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Kaboino.readColorSensor(%1)',
                    },
                ],
            },
        },
        kaboino_set_color_sensor_led: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.KABOINO_on, 'on'],
                        [Lang.Blocks.KABOINO_off, 'off'],
                    ],
                    value: 'off',
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
                    null,
                ],
                type: 'kaboino_set_color_sensor_led',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'KaboinoSet',
            isNotFor: ['Kaboino'],
            func(sprite, script) {
                let port = Entry.Kaboino.PORT_MAP.SET_COLOR_LED_PORT;
                let value = script.getValue('VALUE', script);

                if (typeof value === 'string') {
                    value = value.toLowerCase();
                }
                if (value == 'on') {
                    value = 0xf;
                } else if (value == 'off') {
                    value = 0;
                }

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[port] = {
                    type: Entry.Kaboino.sensorTypes.SET_COLOR_SEN_LED,
                    data: value,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Kaboino.setColorSenLED(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.KABOINO_on, 'on'],
                                    [Lang.Blocks.KABOINO_off, 'off'],
                                ],
                                value: 'off',
                                fontSize: 11,
                                converter: Entry.block.converters.returnStringValue,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                    },
                ],
            },
        },
        kaboino_set_search_light: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.KABOINO_on, 'on'],
                        [Lang.Blocks.KABOINO_off, 'off'],
                    ],
                    value: 'on',
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
                    null,
                ],
                type: 'kaboino_set_search_light',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'KaboinoSet_2',
            isNotFor: ['Kaboino'],
            func(sprite, script) {
                let port = Entry.Kaboino.PORT_MAP.SET_SEARCH_LIGHT_PORT;
                let value = script.getValue('VALUE', script);

                if (typeof value === 'string') {
                    value = value.toLowerCase();
                }

                if (value == 'on') {
                    value = 0xf;
                } else if (value == 'off') {
                    value = 0;
                }

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[port] = {
                    type: Entry.Kaboino.sensorTypes.SET_SEARCH_LIGHT,
                    data: value,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Kaboino.turnSearchLight(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.KABOINO_on, 'on'],
                                    [Lang.Blocks.KABOINO_off, 'off'],
                                ],
                                value: 'on',
                                fontSize: 11,
                                converter: Entry.block.converters.returnStringValue,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                    },
                ],
            },
        },
        kaboino_set_ball_holder: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.KABOINO_up, "up"],
                        [Lang.Blocks.KABOINO_down, "down"],
                    ],
                    value: "up",
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
                    null,
                ],
                type: 'kaboino_set_ball_holder',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'KaboinoSet_3',
            isNotFor: ['Kaboino'],
            func(sprite, script) {
                let port = '0';
                let value = script.getValue('VALUE', script);

                if (typeof value === 'string') {
                    value = value.toLowerCase();
                }

                if (value == "up") value = 180;
                else if (value == "down") value = 0;

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[port] = {
                    type: Entry.Kaboino.sensorTypes.SET_BALL_HOLDER,
                    data: value,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Kaboino.liftBallHolder(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.KABOINO_up, "up"],
                                    [Lang.Blocks.KABOINO_down, "down"],
                                ],
                                value: "up",
                                fontSize: 11,
                                converter: Entry.block.converters.returnStringValue,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                    },
                ],
            },
        },
        kaboino_get_environmnet_sensor_value_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.KABOINO_environment_temp_sensor, "tempSensor"],
                        [Lang.Blocks.KABOINO_environment_humidity_sensor, "humSensor"],
                    ],
                    value: "tempSensor",
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
            func(sprite, script) {
                var port = script.getStringField('PORT', script);
                return port;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.KABOINO_environment_temp_sensor, "tempSensor"],
                                    [Lang.Blocks.KABOINO_environment_humidity_sensor, "humSensor"],
                                ],
                                value: "tempSensor",
                                fontSize: 11,
                                converter: Entry.block.converters.returnStringValue,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'kaboino_get_environmnet_sensor_value_list',
                    },
                ],
            },
        },
        kaboino_get_environmnet_sensor_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
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
                        type: 'kaboino_get_environmnet_sensor_value_list',
                    },
                ],
                type: 'kaboino_get_environmnet_sensor_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'KaboinoGet_4',
            isNotFor: ['Kaboino'],
            func(sprite, script) {
                const ANALOG = Entry.hw.portData.ANALOG;
                let port = script.getValue('PORT', script);

                if (port == "tempSensor") {
                    port = Entry.Kaboino.PORT_MAP.GET_TEMP_SND_SENSOR_PORT - 3;
                } else if (port == "humSensor" ){
                    port = Entry.Kaboino.PORT_MAP.GET_HUMIDITY_SENSOR_PORT - 3;
                }
                
                if (port[0] === 'A') {
                    port = port.substring(1);
                }

                return String(ANALOG[port]/100);
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Kaboino.readEnvironmentSensor(%1)',
                    },
                ],
            },
        },
        kaboino_get_dust_sensor_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [],
                type: 'kaboino_get_dust_sensor_value',
            },
            paramsKeyMap: {},
            class: 'KaboinoGet_4',
            isNotFor: ['Kaboino'],
            func(sprite, script) {
                const DustPort = Entry.Kaboino.PORT_MAP.GET_DUST_ULTRA_SENSOR_PORT - 3;

                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                Entry.hw.sendQueue.GET[Entry.Kaboino.sensorTypes.GET_DUST_SENSOR] = {
                    port: DustPort,
                    time: new Date().getTime(),
                };
                const DUST_VALUE = Entry.hw.portData.DUST;

                return String(DUST_VALUE || 0);
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Kaboino.readDustSensor()',
                    },
                ],
            },
        },
        kaboino_get_ultrasonic_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [],
                type: 'kaboino_get_ultrasonic_value',
            },
            paramsKeyMap: {},
            class: 'KaboinoGet_5',
            isNotFor: ['Kaboino'],
            func(sprite, script) {
                
                const UltrasonicPort = Entry.Kaboino.PORT_MAP.GET_DUST_ULTRA_SENSOR_PORT - 3;

                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                Entry.hw.sendQueue.GET[Entry.Kaboino.sensorTypes.GET_ULTRASONIC_SENSOR] = {
                    port: UltrasonicPort,
                    time: new Date().getTime(),
                };
                const ULTRASONIC_VALUE = Entry.hw.portData.ULTRASONIC;

                return String(ULTRASONIC_VALUE || 0);
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Kaboino.readUltrasonicSensor()',
                    },
                ],
            },
        },
        kaboino_set_ultrasonic_angle_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.KABOINO_ultrasonic_angle_center, "ultraCenterAng"],
                        [Lang.Blocks.KABOINO_ultrasonic_angle_left, "ultraLeftAng"],
                        [Lang.Blocks.KABOINO_ultrasonic_angle_right, "ultraRightAng"],
                    ],
                    value: "ultraCenterAng",
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
            func(sprite, script) {
                var port = script.getStringField('PORT', script);

                return port;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.KABOINO_ultrasonic_angle_center, "ultraCenterAng"],
                                    [Lang.Blocks.KABOINO_ultrasonic_angle_left, "ultraLeftAng"],
                                    [Lang.Blocks.KABOINO_ultrasonic_angle_right, "ultraRightAng"],
                                ],
                                value: "ultraCenterAng",
                                fontSize: 11,
                                converter: Entry.block.converters.returnStringValue,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'kaboino_set_ultrasonic_angle_list',
                    },
                ],
            },
        },
        kaboino_set_ultrasonic_angle: {
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'kaboino_set_ultrasonic_angle_list',
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'kaboino_set_ultrasonic_angle',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                VALUE: 1,
            },
            class: 'KaboinoSet_5',
            isNotFor: ['Kaboino'],
            func(sprite, script) {
                let port = Entry.Kaboino.PORT_MAP.SET_ULTRASONIC_ANGLE_PORT;
                let direction = script.getValue('DIRECTION', script);
                let value = script.getValue('VALUE', script);
                let ultrasonic_angle = 90;

                value = Math.round(value);
                value = Math.max(value, 0);
                value = Math.min(value, 90);
                
                if (direction == "ultraCenterAng") {
                    ultrasonic_angle = 90;
                }
                else if (direction == "ultraLeftAng") {
                    ultrasonic_angle = 90 + value;
                }
                else if (direction == "ultraRightAng") {
                    ultrasonic_angle = 90 - value;
                }
                
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[port] = {
                    type: Entry.Kaboino.sensorTypes.SET_ULTRASONIC_ANGLE,
                    data: ultrasonic_angle,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Kaboino.setUltrasonicAngle(%1)',
                    },
                ],
            },
        },
        kaboino_get_sound_sensor_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [],
                type: 'kaboino_get_sound_sensor_value',
            },
            paramsKeyMap: {},
            class: 'KaboinoGet_6',
            isNotFor: ['Kaboino'],
            func(sprite, script) {
                const SNDPort = Entry.Kaboino.PORT_MAP.GET_TEMP_SND_SENSOR_PORT - 3;

                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                Entry.hw.sendQueue.GET[Entry.Kaboino.sensorTypes.GET_SND_SENSOR] = {
                    port: SNDPort,
                    time: new Date().getTime(),
                };

                const SND_VALUE = Entry.hw.portData.SND;

                return String(SND_VALUE || 0);
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Kaboino.readShootingValue()',
                    },
                ],
            },
        },

        kaboino_set_robot_arm_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.KABOINO_robot_arm_gripper, "armGripper"],
                        [Lang.Blocks.KABOINO_robot_arm_pusher, "armPusher"],
                        [Lang.Blocks.KABOINO_robot_arm_raiser, "armRaiser"],
                        [Lang.Blocks.KABOINO_robot_arm_rotator, "armRotator"],
                    ],
                    value: "armGripper",
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
            func(sprite, script) {
                return script.getStringField('PORT', script);
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.KABOINO_robot_arm_gripper, "armGripper"],
                                    [Lang.Blocks.KABOINO_robot_arm_pusher, "armPusher"],
                                    [Lang.Blocks.KABOINO_robot_arm_raiser, "armRaiser"],
                                    [Lang.Blocks.KABOINO_robot_arm_rotator, "armRotator"],
                                ],
                                value: "armGripper",
                                fontSize: 11,
                                converter: Entry.block.converters.returnStringValue,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'kaboino_set_robot_arm_list',
                    },
                ],
            },
        },
        kaboino_set_robot_arm: {
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'kaboino_set_robot_arm_list',
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'kaboino_set_robot_arm',
            },
            paramsKeyMap: {
                ACTOR: 0,
                VALUE: 1,
            },
            class: 'KaboinoSet_8',
            isNotFor: ['Kaboino'],
            func(sprite, script) {
                let port;
                let actorPort = script.getValue('ACTOR', script);
                let value = script.getValue('VALUE', script);

                value = Math.round(value);
                value = Math.max(value, 0);
                value = Math.min(value, 180);
                
                if (actorPort == "armGripper") {
                    port = Entry.Kaboino.PORT_MAP.SET_ROBOT_ARM_GRIPPER_PORT;
                }
                else if (actorPort == "armPusher") {
                    port = Entry.Kaboino.PORT_MAP.SET_ROBOT_ARM_PUSHER_PORT;
                }
                else if (actorPort == "armRaiser") {
                    port = Entry.Kaboino.PORT_MAP.SET_ROBOT_ARM_RAISER_PORT;
                }
                else if (actorPort == "armRotator") {
                    port = Entry.Kaboino.PORT_MAP.SET_ROBOT_ARM_ROTATOR_PORT;
                }
                
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[port] = {
                    type: Entry.Kaboino.sensorTypes.SET_ROBOT_ARM,
                    data: value,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Kaboino.controlRobotArm(%1, %2)',
                    },
                ],
            },
        },
    };
};

module.exports = Entry.Kaboino;
