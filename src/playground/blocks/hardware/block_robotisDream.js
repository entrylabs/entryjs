'use strict';

Entry.Robotis_DREAM2 = {
    MODULE_VALUE:{
        DEFAULT: 0,
        PASSIVE: 1,
        IR: 2,
        LED: 3,
        COLOR: 4,
        MOISTURE: 5,
        IRARRAY: 6,
        SERVO: 7,
    },
    INSTRUCTION: {
        NONE: 0,
        WRITE: 3,
        READ: 2,
    },
    CONTROL_TABLE: {
        // [default address, default length, address (when reads together), length (when reads together)]
        CM_LED: [212, 1, 213, 1],
        CM_SPRING_RIGHT: [69, 1, 69, 2],
        CM_SPRING_LEFT: [70, 1, 69, 2],
        CM_SWITCH: [71, 1],
        CM_SOUND_DETECTED: [86, 1],
        CM_SOUND_DETECTING: [87, 1],
        CM_IR_LEFT: [91, 2],
        CM_IR_RIGHT: [93, 2],
        CM_IR_CENTER: [95, 2],
        CM_IR_SENSOR: [172, 2, 174, 2],
        CM_TOUCH_SENSOR: [204, 1, 205, 1],
        CM_TEMPERATURE_SENSOR: [236, 1, 237, 1],
        CM_ULTRASONIC_SENSOR: [244, 1, 245, 1],
        CM_MAGNETIC_SENSOR: [252, 1, 253, 1],
        CM_MOTION_SENSOR: [260, 1, 261, 1],
        CM_COLOR_SENSOR: [268, 1, 269, 1],
        CM_HUMIDITY_SENSOR: [276, 1, 277, 1],
        CM_HTEMPERATURE_SENSOR: [284, 1, 285, 1],
        CM_BRIGHTNESS_SENSOR: [292, 2, 294, 2],
        CM_MODULE_CLASS: [104, 105],

        AUX_SERVO_MODE: [128, 1, 129, 1],
        AUX_SERVO_SPEED: [136, 2, 138, 2],
        AUX_SERVO_POSITION: [156, 2, 158, 2],
        AUX_MOTOR_SPEED: [152, 2, 154, 2],
    },
    IRS_MODULEWRITE: {
        PORT3: false,
        PORT4: false,
    },
    SERVO_MODULEWRITE: {
        PORT3: false,
        PORT4: false,
    },
    SERVO_WHEELWRITE: {
        PORT3: false,
        PORT4: false,
    },
    SERVO_POSITIONWRITE: {
        PORT3: false,
        PORT4: false,
    },
    COLOR_MODULEWRITE: {
        PORT3: false,
        PORT4: false,
    },
    TEMPER_MOISTURE_MODULEWRITE: {
        PORT3: false,
        PORT4: false,
    },
    setZero: function () {
        // instruction / address / length / value / default length
        Entry.hw.sendQueue['setZero'] = [1];
        this.update();
        this.setRobotisData(null);
        Entry.hw.sendQueue['setZero'] = null;
        this.update();
        this.setRobotisData([
            [Entry.Robotis_DREAM2.INSTRUCTION.WRITE, 86, 1, 0],
            [Entry.Robotis_DREAM2.INSTRUCTION.WRITE, 136, 4, 0],
            [Entry.Robotis_DREAM2.INSTRUCTION.WRITE, 152, 4, 0],
            [Entry.Robotis_DREAM2.INSTRUCTION.WRITE, Entry.Robotis_DREAM2.CONTROL_TABLE.CM_MODULE_CLASS[0], 2, 0],
            //[Entry.Robotis_DREAM2.INSTRUCTION.WRITE, 154, 2, 0],
        ]);

        this.update();


        Entry.Robotis_DREAM2.IRS_MODULEWRITE.PORT3 = false;
        Entry.Robotis_DREAM2.IRS_MODULEWRITE.PORT4 = false;

        Entry.Robotis_DREAM2.SERVO_MODULEWRITE.PORT3 = false;
        Entry.Robotis_DREAM2.SERVO_MODULEWRITE.PORT4 = false;

        Entry.Robotis_DREAM2.SERVO_WHEELWRITE.PORT3 = false;
        Entry.Robotis_DREAM2.SERVO_WHEELWRITE.PORT4 = false;

        Entry.Robotis_DREAM2.SERVO_POSITIONWRITE.PORT3 = false;
        Entry.Robotis_DREAM2.SERVO_POSITIONWRITE.PORT4 = false;

        Entry.Robotis_DREAM2.COLOR_MODULEWRITE.PORT3 = false;
        Entry.Robotis_DREAM2.COLOR_MODULEWRITE.PORT4 = false;

        Entry.Robotis_DREAM2.TEMPER_MOISTURE_MODULEWRITE.PORT3 = false;
        Entry.Robotis_DREAM2.TEMPER_MOISTURE_MODULEWRITE.PORT4 = false;

    },
    id: '7.4',
    name: 'Robotis_DREAM2',
    url: 'http://www.robotis.com/index/product.php?cate_code=111310',
    imageName: 'robotis_carCont.png',
    title: {
        "ko": "로보티즈 드림",
        "en": "Robotis Robot car"
    },
    delay: 15,
    postCallReturn: function (script, data, ms) {
        if (ms <= 0) {
            this.setRobotisData(data);
            this.update();
            return script.callReturn();
        }

        if (!script.isStart) {
            script.isStart = true;
            script.timeFlag = 1;
            //data setting
            this.setRobotisData(data);
            this.update();

            //delay xx ms
            setTimeout(function () {
                script.timeFlag = 0;
            }, ms);

            return script;
        } else if (script.timeFlag == 1) {
            this.setRobotisData(null);
            this.update();
            return script;
        } else {
            delete script.timeFlag;
            delete script.isStart;
            Entry.engine.isContinue = false;
            this.update();
            return script.callReturn();
        }
    },
    wait: function (sq, ms) {
        Entry.hw.socket.send(JSON.stringify(sq));

        var start = new Date().getTime();
        var end = start;
        while (end < start + ms) {
            //wait XX ms
            end = new Date().getTime();
        }
    },

    update: function () {
        Entry.hw.update();
        var ROBOTIS_DATA = Entry.hw.sendQueue['ROBOTIS_DATA'];
        if (ROBOTIS_DATA) {
            ROBOTIS_DATA.forEach(function (data) {
                data['send'] = true;
            });
        }
        this.setRobotisData(null);
    },
    filterSendData: function () {
        var ROBOTIS_DATA = Entry.hw.sendQueue['ROBOTIS_DATA'];
        if (ROBOTIS_DATA) {
            return ROBOTIS_DATA.filter(function (data) {
                return data.send !== true;
            });
        } else {
            return null;
        }
    },
    setRobotisData: function (data) {
        var filterData = this.filterSendData();
        if (data == null) {
            Entry.hw.sendQueue['ROBOTIS_DATA'] = filterData;
        } else {
            Entry.hw.sendQueue['ROBOTIS_DATA'] = filterData
                ? filterData.concat(data)
                : data;
        }
    },
};

Entry.Robotis_DREAM2.blockMenuBlocks = [
    'robotis_dream_drive',
    'robotis_dream_stop',
    'robotis_gm_control',

    'robotis_sm_setting',
    'robotis_sm_joint_move',
    'robotis_sm_wheel_move',

    'robotis_internal_led_control',
    'robotis_led_module_control',

    'robotis_internal_ir_compare',
    'robotis_port_ir_compare',
    'robotis_port_touch_compare',
    'robotis_sound_count_compare',

    'robotis_detected_sound_initialize',
    'robotis_play_piano',
    'robotis_play_melody',
    'robotis_play_melody_wait',

    'robotis_internal_ir_value',
    'robotis_port_ir_value',
    'robotis_sound_count',
    'robotis_sm_position',
    'robotis_user_device'

];

Entry.Robotis_DREAM2.setLanguage = function() {
    return {
        ko: {
            template: {
                robotis_dream_drive: "로봇 %1 속도로 %2하기 %3",
                robotis_dream_stop: "로봇 정지하기%1",
                robotis_gm_control: "%1 번 감속모터 %2 속도, %3 으로 %4 하기 %5",

                robotis_sm_setting: "%1번 서보모터 %2모드로 설정하기 %3",
                robotis_sm_joint_move: "%1번 서보모터 %2 속도, %3도 위치로 이동하기(관절모드) %4",
                robotis_sm_wheel_move: "%1번 서보모터 %2 속도, %3으로 %4하기(바퀴모드) %5",
                
                robotis_internal_led_control: "제어기 내장 초록 LED %1 %2",
                robotis_led_module_control: "%1번 LED 모듈 %2 %3",

                robotis_internal_ir_compare: "%1 적외선 센서 값 %2 %3 이면",
                robotis_port_ir_compare: "%1번 적외선 센서 %2 %3 이면",
                robotis_port_touch_compare: "%1번 접촉 센서가 %2 이면",
                robotis_sound_count_compare: "%1 소리 감지 횟수 %2 %3 이면",

                robotis_detected_sound_initialize: "최종 소리 감지 횟수 초기화%1",
                robotis_play_piano: "%1 옥타브 %2 음계를 %3초 동안 연주하기 %4",
                robotis_play_melody: "%1 번 멜로디 연주하기 %2",
                robotis_play_melody_wait: "%1 번 멜로디 연주하고 기다리기 %2",

                robotis_internal_ir_value: "%1 내장 적외선 센서 값",
                robotis_port_ir_value: "%1 번 %2 값",
                robotis_sound_count: "%1 소리 횟수",
                robotis_sm_position: "%1 번 서보모터 위치",
                robotis_user_device: "%1번 사용자 장치" 
            },
            Helper: {

            },
            Blocks: {
                robotis_moveF: "전진",
                robotis_moveB: "후진",
                robotis_moveL: "좌회전",
                robotis_moveR: "우회전",

                robotis_direction_cw: "시계방향",
                robotis_direction_ccw: "반시계방향",

                robotis_rotate: "회전",
                robotis_stop: "정지",

                robotis_joint: "관절",
                robotis_wheel: "바퀴",

                robotis_on: "켜기",
                robotis_off: "끄기",

                robotis_ir: "적외선 센서",
                robotis_touch: "터치 센서",

                robotis_final: "최종",
                robotis_sync: "실시간",

                robotis_left: "왼쪽",
                robotis_center: "중앙",
                robotis_right: "오른쪽",

                robotis_touched: "눌림",
                robotis_no_touched: "안눌림",

                robotis_on_on: "주황 켜기, 파랑 켜기",
                robotis_on_off: "주황 켜기, 파랑 끄기",
                robotis_off_on: "주황 끄기, 파랑 켜기",
                robotis_off_off: "주황 끄기, 파랑 끄기"
            },
        },
        en: {
            template: {
                robotis_dream_drive: "Robot with %1 speed %2 %3",
                robotis_dream_stop: "Robot stop",
                robotis_gm_control: "%1 GM Motor with %2 speed, %3 direction %4 %5",

                robotis_sm_setting: "%1 Servo Motor setting with %2 %3",
                robotis_sm_joint_move: "%1 Servo Motor %2 Speed %3 angle(joint mode) %4",
                robotis_sm_wheel_move: "%1 Servo Motor %2 Speed %3 direction %4 %5",

                robotis_internal_led_control: "Internal green LED %1 %2",
                robotis_led_module_control: "%1 port LED module %2 %3",

                robotis_internal_ir_compare: "%1 IR sensor value is %2 %3 ",
                robotis_port_ir_compare: "%1 port IR sensor value is %2 %3 ",
                robotis_port_touch_compare: "%1 port touch sensor value is %2 ",
                robotis_sound_count_compare: "%1 detected sound count %2 %3 ",

                robotis_detected_sound_initialize: "Initialize detected sound %1",
                robotis_play_piano: "%1 octave %2 sound during %3 play %4",
                robotis_play_melody: "%1 melody play %2",
                robotis_play_melody_wait: "%1 melody play and wait %2",

                robotis_internal_ir_value: "%1 internal ir value",
                robotis_port_ir_value: "%1 port %2 value ",
                robotis_sound_count: "%1 sound count ",
                robotis_sm_position: "%1 port servo motor position ",
                robotis_user_device: "%1 port user device " 
            },
            Helper: {

            },
            Blocks: {
                robotis_moveF: "Forward",
                robotis_moveB: "Backward",
                robotis_moveL: "LeftTurn",
                robotis_moveR: "RightTurn",

                robotis_direction_cw: "clockwise",
                robotis_direction_ccw: "counterclockwise",

                robotis_rotate: "rotate",
                robotis_stop: "stop",

                robotis_joint: "joint",
                robotis_wheel: "wheel",
                
                robotis_on: "on",
                robotis_off: "off",
                
                robotis_ir: "IR sensor",
                robotis_touch: "Touch sensor",

                robotis_final: "final",
                robotis_sync: "sync",

                robotis_left: "left",
                robotis_center: "center",
                robotis_right: "right",

                robotis_touched: "touched",
                robotis_no_touched: "no touched",

                robotis_on_on: "Orange LED on, Blue LED on",
                robotis_on_off: "Orange LED on, Blue LED off",
                robotis_off_on: "Orange LED off, Blue LED on",
                robotis_off_off: "Orange LED off, Blue LED off"
            }
        },
    };
};

Entry.Robotis_DREAM2.getBlocks = function() {
    return {
        robotis_dream_drive: {
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
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_moveF, '0'],
                        [Lang.Blocks.robotis_moveB, '1'],
                        [Lang.Blocks.robotis_moveL, '2'],
                        [Lang.Blocks.robotis_moveR, '3']
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
                    '50',
                    null,
                    null
                ],
                type: 'robotis_dream_drive',
            },
            paramsKeyMap: {
                SPEED: 0,
                DIRECTION: 1,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_DREAM2'],
            func: function(sprite, script) {
                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_DREAM2.INSTRUCTION.WRITE;
                var data_address1 = 0;
                var data_address2 = 0;

                var data_length1 = 0;
                var data_length2 = 0;

                var direction = 0;

                var data_value = 0;

                data_address1 = Entry.Robotis_DREAM2.CONTROL_TABLE.AUX_MOTOR_SPEED[0];
                data_address2 = Entry.Robotis_DREAM2.CONTROL_TABLE.AUX_MOTOR_SPEED[2];

                data_length1 = Entry.Robotis_DREAM2.CONTROL_TABLE.AUX_MOTOR_SPEED[1];
                data_length2 = Entry.Robotis_DREAM2.CONTROL_TABLE.AUX_MOTOR_SPEED[3];

                direction = script.getNumberValue('DIRECTION', script);
                data_value = script.getNumberValue('SPEED', script) * 10;

                var data_sendqueue = [];
                switch(direction) {
                    case 0:
                    case '0':
                        //console.log(direction, data_value);
                        data_sendqueue = [
                            [data_instruction, data_address1, data_length1, data_value],
                            [data_instruction, data_address2, data_length2, data_value + 1024],
                        ];
                        break;
                    case 1:
                        data_sendqueue = [
                            [data_instruction, data_address1, data_length1, data_value + 1024],
                            [data_instruction, data_address2, data_length2, data_value],
                        ];
                        break;
                    case 2:
                        data_sendqueue = [
                            [data_instruction, data_address1, data_length1, data_value + 1024],
                            [data_instruction, data_address2, data_length2, data_value + 1024],
                        ];
                        break;
                    case 3:
                        data_sendqueue = [
                            [data_instruction, data_address1, data_length1, data_value],
                            [data_instruction, data_address2, data_length2, data_value],
                        ];
                        break;
                }

                //console.log(data_sendqueue)
                
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_carCont.delay
                );
            },
            syntax: { js: [], py: ['Robotis.carcont_cm_sound_clear()'] },
        },

        robotis_dream_stop: {
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
                type:'robotis_dream_stop',
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_DREAM2'],
            func: function(sprite, script) {
                var data_instruction = Entry.Robotis_DREAM2.INSTRUCTION.WRITE;
                var data_address1 = Entry.Robotis_DREAM2.CONTROL_TABLE.AUX_MOTOR_SPEED[0];
                var data_length = 4;
                var data_value = 0;

                var data_sendqueue = [[data_instruction, data_address1, data_length, data_value]];

                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_carCont.delay
                );
            }
        },

        //%1 번 감속모터 %2 속도, %3 으로 %4 하기 %5
        robotis_gm_control: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', '1'],
                        ['2', '2'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_direction_cw, '0'],
                        [Lang.Blocks.robotis_direction_ccw, '1'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_rotate, '0'],
                        [Lang.Blocks.robotis_stop, '1'],
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
                    '50',
                    null,
                    null,
                    null
                ],
                type: 'robotis_gm_control',
            },
            paramsKeyMap: {
                PORT: 0,
                SPEED: 1,
                DIRECTION: 2,
                OP: 3
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_DREAM2'],
            func: function(sprite, script) {
                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_DREAM2.INSTRUCTION.WRITE;

                var port = script.getNumberValue('PORT', script);
                var speed = script.getNumberValue('SPEED', script) * 10;
                var direction = script.getNumberValue('DIRECTION', script);
                var op = script.getNumberValue('OP', script);

                var data_address = 152; //포트 1번 감속 모터 주소 
                var data_length = 2;
                var data_value = speed;

                switch(port) {
                    case 1:
                        data_address = 152;
                        break;
                    case 2:
                        data_address = 154;
                        break;
                }
                
                if(direction == 0) {
                    data_value += 1024;
                }
                
                if(op == 1) {
                    data_value = 0;
                }

            
                var data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
                
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_carCont.delay
                );
            },
            syntax: { js: [], py: ['Robotis.carcont_cm_sound_clear()'] },
        },

        //%1번 서보모터 %2모드로 설정하기 %3
        robotis_sm_setting: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['3', '3'],
                        ['4', '4']
                    ],
                    value: '3',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_joint, '1'],
                        [Lang.Blocks.robotis_wheel, '0'],
                    ],
                    value: '1',
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
                    null
                ],
                type: 'robotis_sm_setting',
            },
            paramsKeyMap: {
                PORT: 0,
                MODE: 1,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_DREAM2'],
            func: function(sprite, script) {
                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_DREAM2.INSTRUCTION.WRITE;

                var port = script.getNumberValue('PORT', script);
                var mode = script.getNumberValue('MODE', script);

                var data_address = 128;
                var data_length = 1;
                var data_value = mode;

                switch(port) {
                    case 3:
                        data_address = 128;
                        break;
                    case 4:
                        data_address = 129;
                        break;
                }

                var data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
                
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_carCont.delay
                );
            },
            syntax: { js: [], py: ['Robotis.carcont_cm_sound_clear()'] },
        },

        //%1번 서보모터 %2 속도 %3도 위치로 이동하기(관절모드) %4
        robotis_sm_joint_move: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['3', '3'],
                        ['4', '4']
                    ],
                    value: '3',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                    null,
                    '50',
                    '0',
                    null,
                ],
                type: 'robotis_sm_joint_move',
            },
            paramsKeyMap: {
                PORT: 0,
                SPEED: 1,
                ANGLE: 2,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_DREAM2'],
            func: function(sprite, script) {
                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_DREAM2.INSTRUCTION.WRITE;

                var port = script.getNumberValue('PORT', script);
                var speed = script.getNumberValue('SPEED', script);
                var angle = script.getNumberValue('ANGLE', script);

                var data_address1 = 136;
                var data_address2 = 156;

                var data_length = 2;

                if(angle < -150) {
                    angle = -150;
                }
                if(angle > 150) {
                    angle = 150;
                }

                var data_value1 = speed * 10;
                var data_value2 = angle * (-1024);
                data_value2 = Math.floor(data_value2 / 300);
                data_value2 += 512;

                if(port == 3) {
                    data_address1 = 136;
                    data_address2 = 156;
                } else {
                    data_address1 = 138;
                    data_address2 = 158;
                }


                var data_sendqueue = [
                    [data_instruction, data_address1, data_length, data_value1],
                    [data_instruction, data_address2, data_length, data_value2]
                ];
                
                //console.log(data_sendqueue);
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_carCont.delay
                );
            },
            syntax: { js: [], py: ['Robotis.carcont_cm_sound_clear()'] },
        },

        //%1번 서보모터 %2 속도, %3으로 %4하기(바퀴모드) %5
        robotis_sm_wheel_move: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['3', '3'],
                        ['4', '4']
                    ],
                    value: '3',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_direction_cw, '0'],
                        [Lang.Blocks.robotis_direction_ccw, '1'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_rotate, '0'],
                        [Lang.Blocks.robotis_stop, '1'],
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
                    '50',
                    null,
                    null,
                    null
                ],
                type: 'robotis_sm_wheel_move',
            },
            paramsKeyMap: {
                PORT: 0,
                SPEED: 1,
                DIRECTION: 2,
                OP: 3
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_DREAM2'],
            func: function(sprite, script) {
                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_DREAM2.INSTRUCTION.WRITE;

                var port = script.getNumberValue('PORT', script);
                var speed = script.getNumberValue('SPEED', script);
                var direction = script.getNumberValue('DIRECTION', script);
                var op = script.getNumberValue('OP', script);

                var data_address = 136;
                var data_length = 2;
                var data_value = speed * 10;

                if(port == 3) {
                    data_address = 136;
                } else {
                    data_address = 138;
                }
                
                if(direction == 0) {
                    data_value += 1024;
                }

                if(op == 1) {
                    data_value = 0; 
                }

                var data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
                
                //console.log(data_sendqueue);
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_carCont.delay
                );
            },
            syntax: { js: [], py: ['Robotis.carcont_cm_sound_clear()'] }, 
        },

        // 제어기 내장 초록 LED %1 %2
        robotis_internal_led_control: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_on, '1'],
                        [Lang.Blocks.robotis_off, '0'],
                    ],
                    value: '1',
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
                    null
                ],
                type: 'robotis_internal_led_control',
            },
            paramsKeyMap: {
                OP: 0
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_DREAM2'],
            func: function(sprite, script) {
                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_DREAM2.INSTRUCTION.WRITE;

                var on_off = script.getNumberValue('OP', script);

                var data_address = 79;
                var data_length = 1;
                var data_value = on_off;

                var data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
                
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_carCont.delay
                );
            },
            syntax: { js: [], py: ['Robotis.carcont_cm_sound_clear()'] },
        },

        // 
        robotis_led_module_control: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['3', '3'],
                        ['4', '4']
                    ],
                    value: '3',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_on_on, '3'],
                        [Lang.Blocks.robotis_on_off, '1'],
                        [Lang.Blocks.robotis_off_on, '2'],
                        [Lang.Blocks.robotis_off_off, '0'],

                    ],
                    value: '3',
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
                    null
                ],
                type: 'robotis_led_module_control',
            },
            paramsKeyMap: {
                PORT: 0,
                OP: 1,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_DREAM2'],
            func: function(sprite, script) {
                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_DREAM2.INSTRUCTION.WRITE;

                var port = script.getNumberValue('PORT', script);
                var op = script.getNumberValue('OP', script);

                var data_address = 212; 
                var data_length = 1;
                var data_value = op;

                if(port == 3) {
                    data_address = 212;
                } else {
                    data_address = 213;
                }

                var data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
                
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_carCont.delay
                );
            },
            syntax: { js: [], py: ['Robotis.carcont_cm_sound_clear()'] },
        },

        //최종 소리 감지 횟수 초기화%1
        robotis_detected_sound_initialize: {
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
                    null
                ],
                type: 'robotis_detected_sound_initialize',
            },
            paramsKeyMap: {
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_DREAM2'],
            func: function(sprite, script) {
                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_DREAM2.INSTRUCTION.WRITE;
                var data_address = 86;
                var data_length = 1;
                var data_value = 0;

                var data_sendqueue = [[data_instruction, data_address, data_length, data_value]];
                
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_carCont.delay
                );
            },
            syntax: { js: [], py: ['Robotis.carcont_cm_sound_clear()'] },
        },

        //%1 옥타브 %2 음계를 %3초 동안 연주하기 %4
        robotis_play_piano: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', '0'],
                        ['2', '1'],
                        ['3', '2'],
                        ['4', '3'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.General.note_c + '', '3'],
                        [Lang.General.note_c + '#', '4'],
                        [Lang.General.note_d + '', '5'],
                        [Lang.General.note_d + '#', '6'],
                        [Lang.General.note_e + '', '7'],
                        [Lang.General.note_f + '', '8'],
                        [Lang.General.note_f + '#', '9'],
                        [Lang.General.note_g + '', '10'],
                        [Lang.General.note_g + '#', '11'],
                        [Lang.General.note_a + '', '12'],
                        [Lang.General.note_a + '#', '13'],
                        [Lang.General.note_b + '', '14'],
                    ],
                    value: '3',
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
                    null,
                    '0.2',
                    null
                ],
                type: 'robotis_play_piano',
            },
            paramsKeyMap: {
                OCTAVE: 0,
                KEY: 1,
                TIME: 2,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_DREAM2'],
            func: function(sprite, script) {
                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_DREAM2.INSTRUCTION.WRITE;
                var data_address1 = 84; //부저 인덱스
                var data_address2 = 85; //시간 

                var interval = 100;

                var data_length = 1;

                var octave = script.getNumberValue('OCTAVE', script);
                var key = script.getNumberValue('KEY', script);
                var time = script.getNumberValue('TIME', script);

                var data_value2 = parseInt(time * 10);
                
                if(data_value2 > 50) {
                    data_value2 = 50;
                }

                var data_value1 = Number(key) + Number(octave * 12);

                var data_sendqueue = [
                    [data_instruction, data_address2, data_length, data_value2],
                    [data_instruction, data_address1, data_length, data_value1]
                ];
                
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    time * 1000 + interval 
                );
            },
            syntax: { js: [], py: ['Robotis.carcont_cm_sound_clear()'] },
        },

        // %1 번 멜로디 연주하기 %2
        robotis_play_melody: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', '0'],
                        ['2', '1'],
                        ['3', '2'],
                        ['4', '3'],
                        ['5', '4'],
                        ['6', '5'],
                        ['7', '6'],
                        ['8', '7'],
                        ['9', '8'],
                        ['10', '9'],

                        ['11', '10'],
                        ['12', '11'],
                        ['13', '12'],
                        ['14', '13'],
                        ['15', '14'],
                        ['16', '15'],
                        ['17', '16'],
                        ['18', '17'],
                        ['19', '18'],
                        ['20', '19'],

                        ['21', '20'],
                        ['22', '21'],
                        ['23', '22'],
                        ['24', '23'],
                        ['25', '24'],
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
                    null,
                    
                ],
                type: 'robotis_play_melody',
            },
            paramsKeyMap: {
                MELODY: 0
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_DREAM2'],
            func: function(sprite, script) {
                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_DREAM2.INSTRUCTION.WRITE;

                var melody = script.getNumberValue('MELODY', script);

                var data_address = 84;
                var data_length = 1;
                var data_value = melody;

                var data_sendqueue = [
                    [data_instruction, 85, 1, 255],
                    [data_instruction, data_address, data_length, data_value]
                ];
                
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_carCont.delay
                );
            },
            syntax: { js: [], py: ['Robotis.carcont_cm_sound_clear()'] },
        },

        // %1 번 멜로디 연주하고 기다리기 %2
        robotis_play_melody_wait: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', '0'],
                        ['2', '1'],
                        ['3', '2'],
                        ['4', '3'],
                        ['5', '4'],
                        ['6', '5'],
                        ['7', '6'],
                        ['8', '7'],
                        ['9', '8'],
                        ['10', '9'],

                        ['11', '10'],
                        ['12', '11'],
                        ['13', '12'],
                        ['14', '13'],
                        ['15', '14'],
                        ['16', '15'],
                        ['17', '16'],
                        ['18', '17'],
                        ['19', '18'],
                        ['20', '19'],

                        ['21', '20'],
                        ['22', '21'],
                        ['23', '22'],
                        ['24', '23'],
                        ['25', '24'],
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
                    null
                ],
                type: 'robotis_play_melody_wait',
            },
            paramsKeyMap: {
                MELODY: 0
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_DREAM2'],
            func: function(sprite, script) {
                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_DREAM2.INSTRUCTION.WRITE;

                var melody = script.getNumberValue('MELODY', script);

                var data_address = 84;
                var data_length = 1;
                var data_value = melody;

                var data_sendqueue = [
                    [data_instruction, 85, 1, 255],
                    [data_instruction, data_address, data_length, data_value]
                ];
                
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    3000
                );
            },
            syntax: { js: [], py: ['Robotis.carcont_cm_sound_clear()'] },
        },

        robotis_internal_ir_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_left, '2'],
                        [Lang.Blocks.robotis_center, '4'],
                        [Lang.Blocks.robotis_right, '0'],
                    ],
                    value: '2',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    
                ],
                type: 'robotis_internal_ir_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'robotis_openCM70_custom',
            isNotFor: ['Robotis_DREAM2'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.READ;
                var data_address = 91;
                var data_length = 2;
                var data_value = 0;

                var data_default_address = 0;
                var data_default_length = 0;
                
                var port = script.getNumberValue('PORT', script);

                data_address += port;

                data_default_address = data_address;
                data_default_length = data_length;

                if (
                    Entry.hw.sendQueue.prevAddress &&
                    Entry.hw.sendQueue.prevAddress == data_default_address
                ) {
                    if (
                        Entry.hw.sendQueue.prevTime &&
                        new Date() - Entry.hw.sendQueue.prevTime < Entry.Robotis_openCM70.readDelay//200
                    ) {
                        //throw new Entry.Utils.AsyncError();
                        var innerValue = Entry.hw.sendQueue.prevResult;
                        
                        if(innerValue > 400) {
                            innerValue = 400;
                        }

                        return innerValue;
                        
                    }
                }

                Entry.Robotis_carCont.setRobotisData([
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                        data_default_length,
                    ],
                ]);
                // Entry.hw.socket.send(JSON.stringify(Entry.hw.sendQueue));
                Entry.Robotis_carCont.update();

                var result = Entry.hw.portData[data_default_address];
                Entry.hw.sendQueue.prevAddress = data_default_address;
                Entry.hw.sendQueue.prevTime = new Date();
                Entry.hw.sendQueue.prevResult = result;

                
                
                if(result > 400) {
                    result = 400;
                }
                return result;
            },
            syntax: {
                js: [],
                py: ['Robotis.robotis_RB_cm_ir_compare(%1)'],
            },
        },

        //%1 번 %2 값 %3
        robotis_port_ir_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['3', '3'],
                        ['4', '4'],
                    ],
                    value: '3',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_ir, '0'],
                        [Lang.Blocks.robotis_touch, '1'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                
               
            ],
            events: {},
            def: {
                params: [
                    null,
                    null,
                    
                ],
                type: 'robotis_port_ir_value',
            },
            paramsKeyMap: {
                PORT: 0,
                SENSOR: 1
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_DREAM2'],
            func: function(sprite, script) {
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.READ;
                var data_address = 0;
                var data_length = 2;
                var data_value = 0;

                var data_default_address = 0;
                var data_default_length = 0;

                var port = script.getNumberValue('PORT', script);
                var sensor = script.getNumberValue('SENSOR', script);

                if(port == 3) {
                    if(sensor == 0) {
                        data_address = 172;
                        data_length = 2;
                    } else {
                        data_address = 204;
                        data_length = 1;
                    }
                } else {
                    if(sensor == 0) {
                        data_address = 174;
                        data_length = 2;
                    } else {
                        data_address = 205;
                        data_length = 1;
                    }
                }

                data_default_address = data_address;
                data_default_length = data_length;

                if (
                    Entry.hw.sendQueue.prevAddress &&
                    Entry.hw.sendQueue.prevAddress == data_default_address
                ) {
                    if (
                        Entry.hw.sendQueue.prevTime &&
                        new Date() - Entry.hw.sendQueue.prevTime < Entry.Robotis_openCM70.readDelay//200
                    ) {
                        if(typeof Entry.hw.sendQueue.prevResult == 'undefined') {
                            return 0;
                        }
                        
                        var innerValue = Entry.hw.sendQueue.prevResult;
                        innerValue *= 4;
                        innerValue = Math.floor(innerValue / 10);

                        if(innerValue > 400) {
                            innerValue = 400;
                        }


                        return innerValue;
                    }
                }

                Entry.Robotis_carCont.setRobotisData([
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                        data_default_length,
                    ],
                ]);
                // Entry.hw.socket.send(JSON.stringify(Entry.hw.sendQueue));
                Entry.Robotis_carCont.update();

                var result = Entry.hw.portData[data_default_address];
                Entry.hw.sendQueue.prevAddress = data_default_address;
                Entry.hw.sendQueue.prevTime = new Date();
                Entry.hw.sendQueue.prevResult = result;

                if(typeof result == 'undefined') {
                    //console.log('result is undefined')
                    return 0;
                }
                result *= 4;
                result = Math.floor(result / 10);

                if(result > 400) {
                    result = 400;
                }
                return result;
            }
        },

        //%1 sound count %2
        robotis_sound_count: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_final, '0'], //최종
                        [Lang.Blocks.robotis_sync, '1'],  //실시간 
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                
             
            ],
            events: {},
            def: {
                params: [
                    null,
                    
                ],
                type: 'robotis_sound_count',
            },
            paramsKeyMap: {
                METHOD: 0
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_DREAM2'],
            func: function(sprite, script) {
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.READ;
                var data_address = 0;
                var data_length = 1;
                var data_value = 0;

                var data_default_address = 0;
                var data_default_length = 0;

                var method = script.getNumberValue('METHOD', script);

                if(method == 0) {
                    data_address = 86;
                } else {
                    data_address = 87;
                }

                data_default_address = data_address;
                data_default_length = data_length;

                if (
                    Entry.hw.sendQueue.prevAddress &&
                    Entry.hw.sendQueue.prevAddress == data_default_address
                ) {
                    if (
                        Entry.hw.sendQueue.prevTime &&
                        new Date() - Entry.hw.sendQueue.prevTime < Entry.Robotis_openCM70.readDelay//200
                    ) {
                        if(typeof Entry.hw.sendQueue.prevResult == 'undefined') {
                            return 0;
                        }
                        
                        return Entry.hw.sendQueue.prevResult;
                    }
                }

                Entry.Robotis_carCont.setRobotisData([
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                        data_default_length,
                    ],
                ]);
                // Entry.hw.socket.send(JSON.stringify(Entry.hw.sendQueue));
                Entry.Robotis_carCont.update();

                var result = Entry.hw.portData[data_default_address];
                Entry.hw.sendQueue.prevAddress = data_default_address;
                Entry.hw.sendQueue.prevTime = new Date();
                Entry.hw.sendQueue.prevResult = result;

                if(typeof result == 'undefined') {
                    //console.log('result is undefined')
                    return 0;
                }
                
                return result;
            }
        },

        //%1 번 서보모터 위치 %2
        robotis_sm_position: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['3', '0'], 
                        ['4', '2'],   
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                
               
            ],
            events: {},
            def: {
                params: [
                    null,
                    
                ],
                type: 'robotis_sm_position',
            },
            paramsKeyMap: {
                PORT: 0
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_DREAM2'],
            func: function(sprite, script) {
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.READ;
                var data_address = 156;
                var data_length = 2;
                var data_value = 0;

                var data_default_address = 0;
                var data_default_length = 0;

                var port = script.getNumberValue('PORT', script);

                data_address += port;

                data_default_address = data_address;
                data_default_length = data_length;

                if (
                    Entry.hw.sendQueue.prevAddress &&
                    Entry.hw.sendQueue.prevAddress == data_default_address
                ) {
                    if (
                        Entry.hw.sendQueue.prevTime &&
                        new Date() - Entry.hw.sendQueue.prevTime < Entry.Robotis_openCM70.readDelay//200
                    ) {
                        if(typeof Entry.hw.sendQueue.prevResult == 'undefined') {
                            return 0;
                        }
                        
                        return Entry.hw.sendQueue.prevResult;
                    }
                }

                Entry.Robotis_carCont.setRobotisData([
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                        data_default_length,
                    ],
                ]);
                // Entry.hw.socket.send(JSON.stringify(Entry.hw.sendQueue));
                Entry.Robotis_carCont.update();

                var result = Entry.hw.portData[data_default_address];
                Entry.hw.sendQueue.prevAddress = data_default_address;
                Entry.hw.sendQueue.prevTime = new Date();
                Entry.hw.sendQueue.prevResult = result;

                if(typeof result == 'undefined') {
                    //console.log('result is undefined')
                    return 0;
                }
                
                result -= 512;
                result *= 300;
                result = Math.floor(result / -1024);

                return result;
            }
        },
        
        robotis_user_device: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['3', '0'], 
                        ['4', '2'],   
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                
              
            ],
            events: {},
            def: {
                params: [
                    null,
                    
                ],
                type: 'robotis_user_device',
            },
            paramsKeyMap: {
                PORT: 0
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_DREAM2'],
            func: function(sprite, script) {
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.READ;
                var data_address = 220;
                var data_length = 2;
                var data_value = 0;

                var data_default_address = 0;
                var data_default_length = 0;

                var port = script.getNumberValue('PORT', script);

                data_address += port;

                data_default_address = data_address;
                data_default_length = data_length;

                if (
                    Entry.hw.sendQueue.prevAddress &&
                    Entry.hw.sendQueue.prevAddress == data_default_address
                ) {
                    if (
                        Entry.hw.sendQueue.prevTime &&
                        new Date() - Entry.hw.sendQueue.prevTime < Entry.Robotis_openCM70.readDelay//200
                    ) {
                        if(typeof Entry.hw.sendQueue.prevResult == 'undefined') {
                            return 0;
                        }
                        
                        return Entry.hw.sendQueue.prevResult;
                    }
                }

                Entry.Robotis_carCont.setRobotisData([
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                        data_default_length,
                    ],
                ]);
                // Entry.hw.socket.send(JSON.stringify(Entry.hw.sendQueue));
                Entry.Robotis_carCont.update();

                var result = Entry.hw.portData[data_default_address];
                Entry.hw.sendQueue.prevAddress = data_default_address;
                Entry.hw.sendQueue.prevTime = new Date();
                Entry.hw.sendQueue.prevResult = result;

                if(typeof result == 'undefined') {
                    //console.log('result is undefined')
                    return 0;
                }
            

                return result;
            }
        },

        //%1 적외선 센서 값 %2 %3 이면 %4
        robotis_internal_ir_compare: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_left, '2'],
                        [Lang.Blocks.robotis_center, '4'],
                        [Lang.Blocks.robotis_right, '0'],
                    ],
                    value: '2',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['>', '0'],
                        ['<', '1'],
                        ['=', '2'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    null,
                    200,
                    
                ],
                type: 'robotis_internal_ir_compare',
            },
            paramsKeyMap: {
                PORT: 0,
                COMPARE_OP: 1,
                COMPARE_VAL: 2,
            },
            class: 'robotis_openCM70_custom',
            isNotFor: ['Robotis_DREAM2'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.READ;
                var data_address = 91;
                var data_length = 2;
                var data_value = 0;

                var data_default_address = 0;
                var data_default_length = 0;
                
                var port = script.getNumberValue('PORT', script);
                var compareOP = script.getNumberValue('COMPARE_OP', script);
                var compareValue = script.getNumberValue('COMPARE_VAL', script);

                data_address += port;

                data_default_address = data_address;
                data_default_length = data_length;

                if (
                    Entry.hw.sendQueue.prevAddress &&
                    Entry.hw.sendQueue.prevAddress == data_default_address
                ) {
                    if (
                        Entry.hw.sendQueue.prevTime &&
                        new Date() - Entry.hw.sendQueue.prevTime < Entry.Robotis_openCM70.readDelay//200
                    ) {
                        //throw new Entry.Utils.AsyncError();
                        var innerValue = Entry.hw.sendQueue.prevResult;
                        
                        if(innerValue > 400) {
                            innerValue = 400;
                        }

                        switch(compareOP) {
                            case 0:
                                return innerValue > compareValue;
                            case 1:
                                return innerValue < compareValue;
                            case 2:
                                return innerValue == compareValue;
                        }

                        
                    }
                }

                Entry.Robotis_carCont.setRobotisData([
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                        data_default_length,
                    ],
                ]);
                // Entry.hw.socket.send(JSON.stringify(Entry.hw.sendQueue));
                Entry.Robotis_carCont.update();

                var result = Entry.hw.portData[data_default_address];
                Entry.hw.sendQueue.prevAddress = data_default_address;
                Entry.hw.sendQueue.prevTime = new Date();
                Entry.hw.sendQueue.prevResult = result;

                
                
                if(result > 400) {
                    result = 400;
                }
                switch(compareOP) {
                    case 0:
                        return result > compareValue;
                    case 1:
                        return result < compareValue;
                    case 2:
                        return result == compareValue;
                }
            },
            syntax: {
                js: [],
                py: ['Robotis.robotis_RB_cm_ir_compare(%1)'],
            },
        },

        robotis_port_ir_compare: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['3', '0'],
                        ['4', '2'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['>', '0'],
                        ['<', '1'],
                        ['=', '2'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
               
            ],
            events: {},
            def: {
                params: [
                    null,
                    null,
                    200,
                    
                ],
                type: 'robotis_port_ir_compare',
            },
            paramsKeyMap: {
                PORT: 0,
                COMPARE_OP: 1,
                COMPARE_VAL: 2,
            },
            class: 'robotis_openCM70_custom',
            isNotFor: ['Robotis_DREAM2'],
            func: function (sprite, script) {
                var scope = script.executor.scope;

                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.READ;
                var data_address = 172;
                var data_length = 2;
                var data_value = 0;

                var data_default_address = 0;
                var data_default_length = 0;

                var port = script.getNumberValue('PORT', script);
                data_address += port;

                var compareValue = script.getNumberValue('COMPARE_VAL');
                var compareOP = script.getNumberValue('COMPARE_OP');

                data_default_address = data_address;
                data_default_length = data_length;

                if (
                    Entry.hw.sendQueue.prevAddress &&
                    Entry.hw.sendQueue.prevAddress == data_default_address
                ) {
                    if (
                        Entry.hw.sendQueue.prevTime &&
                        new Date() - Entry.hw.sendQueue.prevTime < Entry.Robotis_openCM70.readDelay//200
                    ) {
                        //throw new Entry.Utils.AsyncError();
                        var innerValue = Entry.hw.sendQueue.prevResult;
                        innerValue *= 4;
                        innerValue = Math.floor(innerValue / 10);

                        if(innerValue > 400) {
                            innerValue = 400;
                        }

                        switch(compareOP) {
                            case 0:
                                return innerValue > compareValue;
                            case 1:
                                return innerValue < compareValue;
                            case 2:
                                return innerValue == compareValue;
                        }

                        
                    }
                }

                Entry.Robotis_carCont.setRobotisData([
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                        data_default_length,
                    ],
                ]);
                // Entry.hw.socket.send(JSON.stringify(Entry.hw.sendQueue));
                Entry.Robotis_carCont.update();


                var result = Entry.hw.portData[data_default_address];
                Entry.hw.sendQueue.prevAddress = data_default_address;
                Entry.hw.sendQueue.prevTime = new Date();
                Entry.hw.sendQueue.prevResult = result;

                result *= 4;
                result = Math.floor(result / 10);

                if(result > 400) {
                    result = 400;
                }
                //console.log(result)
                switch(compareOP) {
                    case 0:
                        return result > compareValue;
                    case 1:
                        return result < compareValue;
                    case 2:
                        return result == compareValue;
                }
            },
            syntax: {
                js: [],
                py: ['Robotis.robotis_RB_cm_ir_compare(%1)'],
            },
        },

        robotis_port_touch_compare: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['3', '0'],
                        ['4', '1'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_touched, '1'],
                        [Lang.Blocks.robotis_no_touched, '0'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                
            ],
            events: {},
            def: {
                params: [
                    null,
                    null,
                    
                ],
                type: 'robotis_port_touch_compare',
            },
            paramsKeyMap: {
                PORT: 0,
                TOUCHED: 1,
            },
            class: 'robotis_openCM70_custom',
            isNotFor: ['Robotis_DREAM2'],
            func: function (sprite, script) {
                var scope = script.executor.scope;

                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.READ;
                var data_address = 204;
                var data_length = 1;
                var data_value = 0;

                var data_default_address = 0;
                var data_default_length = 0;

                var port = script.getNumberValue('PORT');
                var touched = script.getNumberValue('TOUCHED');
               

                data_address += port;

                data_default_address = data_address;
                data_default_length = data_length;

                if (
                    Entry.hw.sendQueue.prevAddress &&
                    Entry.hw.sendQueue.prevAddress == data_default_address
                ) {
                    if (
                        Entry.hw.sendQueue.prevTime &&
                        new Date() - Entry.hw.sendQueue.prevTime < Entry.Robotis_openCM70.readDelay//200
                    ) {
                        //throw new Entry.Utils.AsyncError();
                        return Entry.hw.sendQueue.prevResult == touched;
                    }
                }

                Entry.Robotis_carCont.setRobotisData([
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                        data_default_length,
                    ],
                ]);
                // Entry.hw.socket.send(JSON.stringify(Entry.hw.sendQueue));
                Entry.Robotis_carCont.update();

                var result = Entry.hw.portData[data_default_address];
                Entry.hw.sendQueue.prevAddress = data_default_address;
                Entry.hw.sendQueue.prevTime = new Date();
                Entry.hw.sendQueue.prevResult = result;

                return result == touched;
            },
            syntax: {
                js: [],
                py: ['Robotis.robotis_RB_cm_ir_compare(%1)'],
            },
        },

        robotis_sound_count_compare: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_final, '0'],
                        [Lang.Blocks.robotis_sync, '1'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['>', '0'],
                        ['<', '1'],
                        ['=', '2'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
               
            ],
            events: {},
            def: {
                params: [
                    null,
                    null,
                    '0',
                    
                ],
                type: 'robotis_sound_count_compare',
            },
            paramsKeyMap: {
                METHOD: 0,
                COMPARE_OP: 1,
                COMPARE_VAL: 2,
            },
            class: 'robotis_openCM70_custom',
            isNotFor: ['Robotis_DREAM2'],
            func: function (sprite, script) {
                var scope = script.executor.scope;

                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.READ;
                var data_address = 86;
                var data_length =1;
                var data_value = 0;

                var data_default_address = 0;
                var data_default_length = 0;

                var method = script.getNumberValue('METHOD');
                var compareValue = script.getNumberValue('COMPARE_VAL');
                var compareOP = script.getNumberValue('COMPARE_OP');

                data_address += method;

                data_default_address = data_address;
                data_default_length = data_length;

                if (
                    Entry.hw.sendQueue.prevAddress &&
                    Entry.hw.sendQueue.prevAddress == data_default_address
                ) {
                    if (
                        Entry.hw.sendQueue.prevTime &&
                        new Date() - Entry.hw.sendQueue.prevTime < Entry.Robotis_openCM70.readDelay//200
                    ) {
                        //throw new Entry.Utils.AsyncError();
                        switch(compareOP) {
                            case 0:
                                return Entry.hw.sendQueue.prevResult > compareValue;
                            case 1:
                                return Entry.hw.sendQueue.prevResult < compareValue;
                            case 2:
                                return Entry.hw.sendQueue.prevResult == compareValue;
                        }

                        
                    }
                }

                Entry.Robotis_carCont.setRobotisData([
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                        data_default_length,
                    ],
                ]);
                // Entry.hw.socket.send(JSON.stringify(Entry.hw.sendQueue));
                Entry.Robotis_carCont.update();

                var result = Entry.hw.portData[data_default_address];
                Entry.hw.sendQueue.prevAddress = data_default_address;
                Entry.hw.sendQueue.prevTime = new Date();
                Entry.hw.sendQueue.prevResult = result;

                switch(compareOP) {
                    case 0:
                        return result > compareValue;
                    case 1:
                        return result < compareValue;
                    case 2:
                        return result == compareValue;
                }
            },
            syntax: {
                js: [],
                py: ['Robotis.robotis_RB_cm_ir_compare(%1)'],
            },
        }
    };
}

module.exports = Entry.Robotis_DREAM2;

