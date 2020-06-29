Entry.NeobotRobotTheme = {
    name: 'neobot_robot_theme',
    url: 'http://www.neobot.co.kr',
    imageName: 'neobot_robot_theme.png',
    title: {
        "en": "NEOBOT Robot Theme",
        "ko": "네오봇 로봇 테마"
    },
    LOCAL_MAP: [
        'IN1',
        'IN2',
        'IN3',
        'IR',
        'IN4'
    ],
    REMOTE_MAP: [
        'OUT1',
        'OUT2',
        'OUT3',
        'DCL',
        'DCR',
        'SND',
        'LED',
        'OPT'
    ],
    setZero: function () {
        for(var port in Entry.NeobotRobotTheme.REMOTE_MAP) {
            if (port == 3 || port == 4) {
                // set motor values as 100. means stopping motors.
                Entry.hw.sendQueue[Entry.NeobotRobotTheme.REMOTE_MAP[port]] = 100;
            }
            else {
                Entry.hw.sendQueue[Entry.NeobotRobotTheme.REMOTE_MAP[port]] = 0;
            }

        }
        Entry.hw.update();
    },
    monitorTemplate: {
        imgPath: 'hw/neobot_robot_theme.png',
        width: 800,
        height: 800,
        listPorts: {
        },
        ports: {
            'IN1':{name: 'PORT1', type: 'input', pos: {x: 145, y: 100}},
            'IN2':{name: 'PORT2', type: 'input', pos: {x: 314, y: 100}},
            'IN3':{name: 'PORT3', type: 'input', pos: {x: 484, y: 100}},
            'IN4':{name: 'PORT4', type: 'input', pos: {x: 653, y: 100}},
        },
        mode: 'both'
    }
}


Entry.NeobotRobotTheme.setLanguage = function () {
    return {
        ko: {
            template: {
                neobot_port_value: "%1",
                neobot_ir_sensor_value: "적외선센서값",
                neobot_light_sensor_value: "빛센서값",
                neobot_sound_sensor_value: "소리센서값",

                neobot_led_on_type1: "LED를 %1 밝기로 켜기 %2",
                neobot_led_on_type2: "LED를 %1 밝기로 %2 초 켠 후 끄기 %3",
                neobot_led_off: "LED 끄기 %1",

                neobot_motor_type1: "%1 모터를 %2 의 속도로 %3초 회전 후 정지 %4",
                neobot_motor_type2: "모터를 %1 %2 의 속도로 회전 %3",
                neobot_motor_type3: "%1 모터를 %2 의 속도로 회전 %3",
                neobot_motor_stop: "%1 모터 정지 %2",

                neobot_ir_decision: "적외선센서 작동 (기준 값: %1)",
                neobot_light_decision: "빛센서 작동 (기준 값: %1)",
                neobot_sound_decision: "소리센서 작동 (기준 값: %1)",
                neobot_port_decision: " %1 작동 (기준 값: %2)",

                neobot_led: "%1",
                neobot_time: "%1",
                neobot_time2: "%1",
                neobot_speed: "%1",
                neobot_speed2: "%1",
            },
            Blocks : {
                //for dropdown
                neobot_port_1 : "1번 포트",
                neobot_port_2 : "2번 포트",
                neobot_port_3 : "3번 포트",
                neobot_port_4 : "4번 포트",

                neobot_led_level_1: "10%",
                neobot_led_level_2: "20%",
                neobot_led_level_3: "30%",
                neobot_led_level_4: "40%",
                neobot_led_level_5: "50%",
                neobot_led_level_6: "60%",
                neobot_led_level_7: "70%",
                neobot_led_level_8: "80%",
                neobot_led_level_9: "90%",
                neobot_led_level_10: "100%",

                neobot_motor_both:  "양쪽",
                neobot_motor_left:  "왼쪽",
                neobot_motor_right: "오른쪽",

                neobot_motor_dir_front:         "앞으로",
                neobot_motor_dir_rear:          "뒤로",
                neobot_motor_dir_left:          "왼쪽으로",
                neobot_motor_dir_right:         "오른쪽으로",
                neobot_motor_dir_stand_left:    "제자리에서 왼쪽으로",
                neobot_motor_dir_stand_right:   "제자리에서 오른쪽으로",
            }
        },
        en: {
            // en.js에 작성하던 내용
            template: {
                neobot_port_value: "%1 value",
                neobot_ir_sensor_value: "IR Sensor value",
                neobot_light_sensor_value: "Light Sensor value",
                neobot_sound_sensor_value: "Sound Sensor value",

                neobot_led_on_type1: "Turn on the LED with %1 brightness %2",
                neobot_led_on_type2: "Turn on the LED with %1 brightness for %2 seconds %3",
                neobot_led_off: "Turn off the LED %1",

                neobot_motor_type1: "Move %1 motor ('s) at a speed of %2 for %3 seconds %4",
                neobot_motor_type2: "Move motor ('s) in a %1 direction at a speed of %2 %3",
                neobot_motor_type3: "Move %1 ('s) at a speed of %2 %3",
                neobot_motor_stop: "Stop %1 motor('s) %2",

                neobot_ir_decision: "IR Sensor detected (value: %1)",
                neobot_light_decision: "Light Sensor detected (value: %1)",
                neobot_sound_decision: "Sound Sensor detected (value: %1)",
                neobot_port_decision: " %1 detected (기준 값: %2)",

                neobot_led: "%1",
                neobot_time: "%1",
                neobot_time2: "%1",
                neobot_speed: "%1",
                neobot_speed2: "%1",
            },
            Blocks : {
                //for dropdown
                neobot_port_1 : "Port 1",
                neobot_port_2 : "Port 2",
                neobot_port_3 : "Port 3",
                neobot_port_4 : "Port 4",

                neobot_led_level_1: "10%",
                neobot_led_level_2: "20%",
                neobot_led_level_3: "30%",
                neobot_led_level_4: "40%",
                neobot_led_level_5: "50%",
                neobot_led_level_6: "60%",
                neobot_led_level_7: "70%",
                neobot_led_level_8: "80%",
                neobot_led_level_9: "90%",
                neobot_led_level_10: "100%",

                neobot_motor_both:  "Both",
                neobot_motor_left:  "Left",
                neobot_motor_right: "Right",

                neobot_motor_dir_front:         "Forward",
                neobot_motor_dir_rear:          "Backward",
                neobot_motor_dir_left:          "Left",
                neobot_motor_dir_right:         "Right",
                neobot_motor_dir_stand_left:    "Left in place",
                neobot_motor_dir_stand_right:   "Right in place",
            }
        }   //
    }
};

Entry.NeobotRobotTheme.getBlocks = function() {
    return {
        // class sensor
        neobot_port_value: {
            color: '#00979D',
            fontColor: '#FFFFFF',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_port_1, 'IN1'],
                        [Lang.Blocks.neobot_port_2, 'IN2'],
                        [Lang.Blocks.neobot_port_3, 'IN3'],
                        [Lang.Blocks.neobot_port_4, 'IN4'],
                    ],
                    value: 'IN1',
                    fontSize: 11,
                    arrowColor: EntryStatic.ARROW_COLOR_HW,
                },
            ],
            def: {
                params: [null],
                type: 'neobot_port_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            events: {},
            class: 'sensor',
            isNotFor: ['neobot_robot_theme'],
            func: function(sprite, script) {
                var port = script.getStringField('PORT');
                return Entry.hw.portData[port];
            },
        },

        neobot_ir_sensor_value: {
            color: '#00979D',
            fontColor: '#FFFFFF',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                }
            ],
            def: {
                params: [null],
                type: 'neobot_ir_sensor_value',
            },
            paramsKeyMap: {
            },
            events: {},
            class: 'sensor',
            isNotFor: ['neobot_robot_theme'],
            func: function(sprite, script) {
                var sensor1 = Entry.hw.portData['IN1'];
                var sensor2 = Entry.hw.portData['IN2'];
                return sensor1 >= sensor2 ? sensor1 : sensor2;;
            },
        },

        neobot_light_sensor_value: {
            color: '#00979D',
            fontColor: '#FFFFFF',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                }
            ],
            def: {
                params: [null],
                type: 'neobot_light_sensor_value',
            },
            paramsKeyMap: {
            },
            events: {},
            class: 'sensor',
            isNotFor: ['neobot_robot_theme'],
            func: function(sprite, script) {
                return Entry.hw.portData['IN3'];
            }
        },

        neobot_sound_sensor_value: {
            color: '#00979D',
            fontColor: '#FFFFFF',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                }
            ],
            def: {
                params: [null],
                type: 'neobot_sound_sensor_value',
            },
            paramsKeyMap: {
            },
            events: {},
            class: 'sensor',
            isNotFor: ['neobot_robot_theme'],
            func: function(sprite, script) {
                return Entry.hw.portData['IN4'];
            }
        },

        // class motor
        neobot_speed: {
            color: '#73C0C3',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['+100', '+100'],
                        ['+90', '+90'],
                        ['+80', '+80'],
                        ['+70', '+70'],
                        ['+60', '+60'],
                        ['+50', '+50'],
                        ['+40', '+40'],
                        ['+30', '+30'],
                        ['+20', '+20'],
                        ['+10', '+10'],
                        ['-10', '-10'],
                        ['-20', '-20'],
                        ['-30', '-30'],
                        ['-40', '-40'],
                        ['-50', '-50'],
                        ['-60', '-60'],
                        ['-70', '-70'],
                        ['-80', '-80'],
                        ['-90', '-90'],
                        ['-100', '-100'],
                    ],
                    value: '+100',
                    fontSize: 11,
                    arrowColor: EntryStatic.ARROW_COLOR_HW,
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
                return script.getStringField('VALUE');
            },
        },
        neobot_speed2: {
            color: '#73C0C3',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['10', '10'],
                        ['20', '20'],
                        ['30', '30'],
                        ['40', '40'],
                        ['50', '50'],
                        ['60', '60'],
                        ['70', '70'],
                        ['80', '80'],
                        ['90', '90'],
                        ['100', '100'],
                    ],
                    value: '10',
                    fontSize: 11,
                    arrowColor: EntryStatic.ARROW_COLOR_HW,
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
                return script.getStringField('VALUE');
            },
        },
        neobot_time: {
            color: '#73C0C3',
            skeleton: 'basic_string_field',
            statements: [],
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
                        ['8', '8'],
                        ['9', '9'],
                        ['10', '10'],
                    ],
                    value: '10',
                    fontSize: 11,
                    arrowColor: EntryStatic.ARROW_COLOR_HW,
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
                return script.getStringField('VALUE');
            },
        },
        neobot_time2: {
            color: '#73C0C3',
            skeleton: 'basic_string_field',
            statements: [],
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
                        ['8', '8'],
                        ['9', '9'],
                        ['10', '10'],
                    ],
                    value: '1',
                    fontSize: 11,
                    arrowColor: EntryStatic.ARROW_COLOR_HW,
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
                return script.getStringField('VALUE');
            },
        },
        neobot_motor_type1: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_motor_both, '1'],
                        [Lang.Blocks.neobot_motor_left, '2'],
                        [Lang.Blocks.neobot_motor_right, '3'],
                    ],
                    value: '1',
                    fontSize: 11,
                    arrowColor: EntryStatic.ARROW_COLOR_HW,
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
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    '1',
                    {
                        type: 'neobot_speed',
                        id: 'm100',
                    },
                    {
                        type: 'neobot_time',
                        id: 'm200',
                    },
                ],
                type: 'neobot_motor_type1',
            },
            paramsKeyMap: {
                MOTOR: 0,
                SPEED: 1,
                DURATION: 2,
            },
            class: 'motor',
            isNotFor: ['neobot_robot_theme'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;

                if (!script.isStart) {
                    var speed = Entry.parseNumber(
                        script.getNumberValue('SPEED')
                    );
                    var motor = script.getNumberField('MOTOR');
                    var duration = script.getNumberValue('DURATION');

                    if(speed > 100) {
                        speed = 100;
                    }
                    else if(speed < -100) {
                        speed = -100;
                    }

                    speed += 100;

                    if (duration < 0) {
                        duration = 0;
                    }

                    switch (motor) {
                        case 1:
                            Entry.hw.sendQueue['DCL'] = speed;
                            Entry.hw.sendQueue['DCR'] = speed;
                            break;
                        case 2:
                            Entry.hw.sendQueue['DCL'] = speed;
                            break;
                        case 3:
                            Entry.hw.sendQueue['DCR'] = speed;
                            break;
                    }

                    if (duration === 0) {
                        return script.callReturn();
                    } else {
                        script.isStart = true;
                        script.timeFlag = 1;
                        setTimeout(function() {
                            script.timeFlag = 0;
                        }, duration * 1000);
                        return script;
                    }
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.hw.sendQueue['DCL'] = 100;
                    Entry.hw.sendQueue['DCR'] = 100;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
        },

        neobot_motor_type2: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_motor_dir_front, '1'],
                        [Lang.Blocks.neobot_motor_dir_rear, '2'],
                        [Lang.Blocks.neobot_motor_dir_left, '3'],
                        [Lang.Blocks.neobot_motor_dir_right, '4'],
                        [Lang.Blocks.neobot_motor_dir_stand_left, '5'],
                        [Lang.Blocks.neobot_motor_dir_stand_right, '6'],
                    ],
                    value: '1',
                    fontSize: 11,
                    arrowColor: EntryStatic.ARROW_COLOR_HW,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    '1',
                    {
                        type: 'neobot_speed2',
                        id: 'm300',
                    },
                ],
                type: 'neobot_motor_type2',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                SPEED: 1,
            },
            class: 'motor',
            isNotFor: ['neobot_robot_theme'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var direction = script.getNumberField('DIRECTION');
                var speed = Entry.parseNumber(script.getNumberValue('SPEED'));

                if(speed > 100) {
                    speed = 100;
                }
                else if(speed < -100) {
                    speed = -100;
                }

                switch (direction) {
                    case 1: // forward
                        Entry.hw.sendQueue['DCL'] = speed + 100;
                        Entry.hw.sendQueue['DCR'] = speed + 100;
                        break;
                    case 2: // backward
                        Entry.hw.sendQueue['DCL'] = 100 - speed;
                        Entry.hw.sendQueue['DCR'] = 100 - speed;
                        break;
                    case 3: // left
                        Entry.hw.sendQueue['DCL'] = (speed / 10) + 100;
                        Entry.hw.sendQueue['DCR'] = speed + 100;
                        break;
                    case 4: // right
                        Entry.hw.sendQueue['DCL'] = speed + 100;
                        Entry.hw.sendQueue['DCR'] = (speed/10) + 100;
                        break;
                    case 5: // left in place
                        Entry.hw.sendQueue['DCL'] = 100 - speed;
                        Entry.hw.sendQueue['DCR'] = speed + 100;
                        break;
                    case 6: // right in place
                        Entry.hw.sendQueue['DCL'] = speed + 100;
                        Entry.hw.sendQueue['DCR'] = 100 - speed;
                        break;
                }
            },
        },

        neobot_motor_type3: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_motor_both, '1'],
                        [Lang.Blocks.neobot_motor_left, '2'],
                        [Lang.Blocks.neobot_motor_right, '3'],
                    ],
                    value: '1',
                    fontSize: 11,
                    arrowColor: EntryStatic.ARROW_COLOR_HW,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_port_1, 'IN1'],
                        [Lang.Blocks.neobot_port_2, 'IN2'],
                        [Lang.Blocks.neobot_port_3, 'IN3'],
                        [Lang.Blocks.neobot_port_4, 'IN4'],
                    ],
                    value: 'IN1',
                    fontSize: 11,
                    arrowColor: EntryStatic.ARROW_COLOR_HW,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    '1',
                    'IN1',
                ],
                type: 'neobot_motor_type3',
            },
            paramsKeyMap: {
                MOTOR: 0,
                PORT: 1,
            },
            class: 'motor',
            isNotFor: ['neobot_robot_theme'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var motor = script.getNumberField('MOTOR');
                var port = script.getStringField('PORT');
                var speed = Entry.hw.portData[port];

                if(speed > 100) {
                    speed = 100;
                }
                else if(speed < -100) {
                    speed = -100;
                }
                speed += 100;

                switch (motor) {
                    case 1:
                        Entry.hw.sendQueue['DCL'] = speed;
                        Entry.hw.sendQueue['DCR'] = speed;
                        break;
                    case 2:
                        Entry.hw.sendQueue['DCL'] = speed;
                        break;
                    case 3:
                        Entry.hw.sendQueue['DCR'] = speed;
                        break;
                }

            },
        },

        neobot_motor_stop: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_motor_both, '1'],
                        [Lang.Blocks.neobot_motor_left, '2'],
                        [Lang.Blocks.neobot_motor_right, '3'],
                    ],
                    value: '1',
                    fontSize: 11,
                    arrowColor: EntryStatic.ARROW_COLOR_HW,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: ['1',],
                type: 'neobot_motor_stop',
            },
            paramsKeyMap: {
                MOTOR: 0,
            },
            class: 'motor',
            isNotFor: ['neobot_robot_theme'],
            func: function(sprite, script) {
                var motor = script.getNumberField('MOTOR');

                switch (motor) {
                    case 1:
                        Entry.hw.sendQueue['DCL'] = 100;
                        Entry.hw.sendQueue['DCR'] = 100;
                        break;
                    case 2:
                        Entry.hw.sendQueue['DCL'] = 100;
                        Entry.hw.sendQueue['DCR'] = 255;
                        break;
                    case 3:
                        Entry.hw.sendQueue['DCL'] = 255;
                        Entry.hw.sendQueue['DCR'] = 100;
                        break;
                }
                return script.callReturn();
            },
        },

        // class led
        neobot_led: {
            color: '#73C0C3',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['10%', '10'],
                        ['20%', '20'],
                        ['30%', '30'],
                        ['40%', '40'],
                        ['50%', '50'],
                        ['60%', '60'],
                        ['70%', '70'],
                        ['80%', '80'],
                        ['90%', '90'],
                        ['100%', '100'],
                    ],
                    value: '100',
                    fontSize: 11,
                    arrowColor: EntryStatic.ARROW_COLOR_HW,
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
                return script.getStringField('VALUE');
            },
        },

        neobot_led_on_type1: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'neobot_led',
                        id: 'm400',
                    },
                ],
                type: 'neobot_led_on_type1',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'led',
            isNotFor: ['neobot_robot_theme'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var value = script.getNumberValue('VALUE');
                if(value > 100) {
                    value = 100;
                } else if (value  < 0) {
                    value = 0;
                }
                Entry.hw.sendQueue['LED'] = value;
                return script.callReturn();
            },
        },

        neobot_led_on_type2: {
            color: '#00979D',
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
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'neobot_led',
                        id: 'm400',
                    },
                    {
                        type: 'neobot_time2',
                        id: 'm200',
                    },
                ],
                type: 'neobot_led_on_type2',
            },
            paramsKeyMap: {
                VALUE: 0,
                DURATION: 1,
            },
            class: 'led',
            isNotFor: ['neobot_robot_theme'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;

                if (!script.isStart) {
                    var value = script.getNumberValue('VALUE');
                    var duration = script.getNumberValue('DURATION');

                    if(value > 100) {
                        value = 100;
                    } else if (value  < 0) {
                        value = 0;
                    }

                    if (duration < 0) {
                        duration = 0;
                    }

                    Entry.hw.sendQueue['LED'] = value;

                    if (duration === 0) {
                        return script.callReturn();
                    } else {
                        script.isStart = true;
                        script.timeFlag = 1;
                        setTimeout(function() {
                            script.timeFlag = 0;
                        }, duration * 1000);
                        return script;
                    }
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.hw.sendQueue['LED'] = 0;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
        },
        neobot_led_off: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'neobot_led_off',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'led',
            isNotFor: ['neobot_robot_theme'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                Entry.hw.sendQueue['LED'] = 0;
                return script.callReturn();
            },
        },

        // class decision
        neobot_ir_decision: {
            color: '#00979D',
            fontColor: '#FFFFFF',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    value: '10',
                },
            ],
            events: {},
            def: {
                params: [null,],
                type: 'neobot_ir_decision',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'decision',
            isNotFor: ['neobot_robot_theme'],
            func: function(sprite, script) {
                var value = script.getNumberValue('VALUE');
                var sensor1 = Entry.hw.portData['IN1'];
                var sensor2 = Entry.hw.portData['IN2'];
                var sensor =  sensor1 >= sensor2 ? sensor1 : sensor2;;

                if(sensor >= value) {
                    return true;
                }
                else {
                    return false;
                }
            },
        },
        neobot_light_decision: {
            color: '#00979D',
            fontColor: '#FFFFFF',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    value: '10',
                },
            ],
            events: {},
            def: {
                params: [null,],
                type: 'neobot_light_decision',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'decision',
            isNotFor: ['neobot_robot_theme'],
            func: function(sprite, script) {
                var value = script.getNumberValue('VALUE');
                var sensor = Entry.hw.portData['IN3'];

                if(sensor >= value) {
                    return true;
                }
                else {
                    return false;
                }
            },
        },

        neobot_sound_decision: {
            color: '#00979D',
            fontColor: '#FFFFFF',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    value: '10',
                },
            ],
            events: {},
            def: {
                params: [null,],
                type: 'neobot_sound_decision',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'decision',
            isNotFor: ['neobot_robot_theme'],
            func: function(sprite, script) {
                var value = script.getNumberValue('VALUE');
                var sensor = Entry.hw.portData['IN4'];

                if(sensor >= value) {
                    return true;
                }
                else {
                    return false;
                }
            },
        },

        neobot_port_decision: {
            color: '#00979D',
            fontColor: '#FFFFFF',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_port_1, 'IN1'],
                        [Lang.Blocks.neobot_port_2, 'IN2'],
                        [Lang.Blocks.neobot_port_3, 'IN3'],
                        [Lang.Blocks.neobot_port_4, 'IN4'],
                    ],
                    value: 'IN1',
                    fontSize: 11,
                    arrowColor: EntryStatic.ARROW_COLOR_HW,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    value: '10',
                },
            ],
            events: {},
            def: {
                params: ['IN1', '10'],
                type: 'neobot_port_decision',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'decision',
            isNotFor: ['neobot_robot_theme'],
            func: function(sprite, script) {
                var port = script.getStringField('PORT');
                var sensor = Entry.hw.portData[port];
                var value = script.getNumberValue('VALUE');

                if(sensor >= value) {
                    return true;
                }
                else {
                    return false;
                }
            },
        },
        // end neobot robot theme region
    };
};