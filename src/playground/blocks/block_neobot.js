'use strict';

Entry.Neobot = {
    name: 'neobot',
    url: 'http://www.neobot.co.kr',
    imageName: 'neobot.png',
    title: {
        "ko": "네오봇",
        "en": "Neo Bot"
    },
    LOCAL_MAP: ['IN1', 'IN2', 'IN3', 'IR', 'BAT'],
    REMOTE_MAP: ['OUT1', 'OUT2', 'OUT3', 'DCR', 'DCL', 'SND', 'FND', 'OPT'],
    setZero: function() {
        for (var port in Entry.Neobot.REMOTE_MAP) {
            Entry.hw.sendQueue[Entry.Neobot.REMOTE_MAP[port]] = 0;
        }
        Entry.hw.update();
    },
    monitorTemplate: {
        imgPath: 'hw/neobot.png',
        width: 700,
        height: 700,
        listPorts: {
            IR: { name: '리모컨', type: 'input', pos: { x: 0, y: 0 } },
            BAT: { name: '배터리', type: 'input', pos: { x: 0, y: 0 } },
            SND: { name: Lang.Hw.buzzer, type: 'output', pos: { x: 0, y: 0 } },
            FND: { name: 'FND', type: 'output', pos: { x: 0, y: 0 } },
        },
        ports: {
            IN1: { name: 'IN1', type: 'input', pos: { x: 270, y: 200 } },
            IN2: { name: 'IN2', type: 'input', pos: { x: 325, y: 200 } },
            IN3: { name: 'IN3', type: 'input', pos: { x: 325, y: 500 } },
            DCL: { name: 'L-Motor', type: 'output', pos: { x: 270, y: 500 } },
            DCR: { name: 'R-Motor', type: 'output', pos: { x: 435, y: 500 } },
            OUT1: { name: 'OUT1', type: 'output', pos: { x: 380, y: 200 } },
            OUT2: { name: 'OUT2', type: 'output', pos: { x: 435, y: 200 } },
            OUT3: { name: 'OUT3', type: 'output', pos: { x: 380, y: 500 } },
        },
        mode: 'both',
    },
};

Entry.Neobot.setLanguage = function () {
    return {
        ko: {
            // ko.js에 작성하던 내용
            template: {
                neobot_sensor_value: "%1",
                neobot_sensor_convert_scale : "%1 값의 범위를 %2 ~ %3 에서 %4 ~ %5 (으)로 변환",
                neobot_sensor_color : "%1",
                neobot_equal_with_sensor : "%1 의 센서값이 %2",
                get_motor_speed : "%1",
                neobot_left_motor : "왼쪽 모터를 %1 %2 의 속도로 회전 %3",
                neobot_stop_left_motor : "왼쪽 모터를 정지 %1",
                neobot_right_motor : "오른쪽 모터를 %1 %2 의 속도로 회전 %3",
                neobot_stop_right_motor : "오른쪽 모터를 정지 %1",
                neobot_all_motor : "양쪽 모터를 %1 %2의 속도로 %3초 동안 회전 %4",
                neobot_stop_all_motor : "양쪽 모터를 정지 %1",
                neobot_set_servo : "%1 포트의 서보모터를 %2 도 이동 %3",
                neobot_set_output : "%1 번 포트의 값을 %2 만큼 출력 %3",
                neobot_set_fnd : "FND에 %1 출력 %2",
                neobot_set_fnd_off : "FND 출력 끄기 %1",
                neobot_play_note_for : "멜로디 %1 을(를) %2 옥타브로 %3 길이만큼 소리내기 %4",
                neobot_play_note_with_sensor : "컨트롤러에서 %1 센서의 %2 ~ %3 값으로 멜로디 연주하기 %4",
                neobot_change_color_with_color_picker : "%1 LED의 색깔을 %2(으)로 정하기 %3",
                neobot_change_color_with_sensor_value : "%1 LED의 색깔을 %2 센서 값으로 바꾸기 %3",
            },
            Blocks : {
                 //for dropdown
                neobot_port_1 : "1번 포트",
                neobot_port_2 : "2번 포트",
                neobot_port_3 : "3번 포트",
                neobot_port_4 : "4번 포트",
                neobot_port_bat : "배터리",
                neobot_port_remot : "리모컨",
                neobot_color_white : "흰색",
                neobot_color_red : "빨간색",
                neobot_color_yellow : "노란색",
                neobot_color_green : "초록색(연두색)",
                neobot_color_blue : "파란색",
                neobot_direction_forward : "앞으로",
                neobot_direction_backward : "뒤로",
                neobot_direction_stop : "멈추기",
                neobot_direction_turn_left_p : "제자리에서 왼쪽 돌기",
                neobot_direction_turn_right_p : "제자리에서 오른쪽 돌기",
                neobot_direction_turn_left : "왼쪽으로 돌기",
                neobot_direction_turn_right : "오른쪽으로 돌기",
                neobot_sound_silent : "무음",
                neobot_sound_do : "도",
                neobot_sound_do_shop : "도#",
                neobot_sound_re : "레",
                neobot_sound_re_shop : "레#",
                neobot_sound_mi : "미",
                neobot_sound_fa : "파",
                neobot_sound_fa_shop : "파#",
                neobot_sound_so : "솔",
                neobot_sound_so_shop : "솔#",
                neobot_sound_la : "라",
                neobot_sound_la_shop:"라#",
                neobot_sound_ti : "시",
                neobot_sound_half_note : "2분 음표",
                neobot_sound_quarter_note : "4분 음표",
                neobot_sound_eighth_note : "8븐 음표",
                neobot_sound_sixteenth_note : "16분 음표"
            }   
        },
        en: {
            // en.js에 작성하던 내용
            template: {
                neobot_sensor_value : "%1 value",
                neobot_sensor_convert_scale : "Change %1's area from %2 ~ %3 to %4 ~ %5",
                neobot_sensor_color : "%1",
                neobot_equal_with_sensor : "%1's sensor value is %2",
                get_motor_speed : "%1",
                neobot_left_motor : "Move left motor %1 for speed %2 %3",
                neobot_stop_left_motor : "Stop left motor",
                neobot_right_motor : "Move right motor %1 for speed %2 %3",
                neobot_stop_right_motor : "Stop right motor %1",
                neobot_all_motor : "Move both motors %2 speeds at %1 for %3 seconds %4",
                neobot_stop_all_motor : "Stop both motors",
                neobot_set_servo : "%1 port servo motor moves to %2 degrees %3",
                neobot_set_output : "Output the value of the %1 port by %2 %3",
                neobot_set_fnd : "Display %1 to FND %2",
                neobot_set_fnd_off : "Turn off the FND %1",
                neobot_play_note_for : "Sound melody %1 at %2 octave for %3 %4",
                neobot_play_note_with_sensor : "Sound melody for value %2 ~ %3 on the controller's %1 %4",
                neobot_change_color_with_color_picker : "Select %2 for %1 LED %3",
                neobot_change_color_with_sensor_value : "Change %1 LED's color according to %2 sensor's value %3",
            },
            Blocks : {
                //for dropdown
                neobot_port_1 : "Port 1",
                neobot_port_2 : "Port 2",
                neobot_port_3 : "Port 3",
                neobot_port_4 : "Port 4",
                neobot_port_bat : "Battery",
                neobot_port_remot : "Remote",
                neobot_color_white : "White",
                neobot_color_red : "Red",
                neobot_color_yellow : "Yellow",
                neobot_color_green : "Green",
                neobot_color_blue : "Blue",
                neobot_direction_forward : "Forward",
                neobot_direction_backward : "Backward",
                neobot_direction_stop : "Stop",
                neobot_direction_turn_left_p : "Left in place",
                neobot_direction_turn_right_p : "Right in place",
                neobot_direction_turn_left : "Left",
                neobot_direction_turn_right : "Right",
                neobot_sound_silent : "Silent",
                neobot_sound_do : "Do",
                neobot_sound_do_shop : "Do#",
                neobot_sound_re : "Re",
                neobot_sound_re_shop : "Re#",
                neobot_sound_mi : "Mi",
                neobot_sound_fa : "Fa",
                neobot_sound_fa_shop : "Fa#",
                neobot_sound_so : "So",
                neobot_sound_so_shop : "So#",
                neobot_sound_la : "La",
                neobot_sound_la_shop:"La#",
                neobot_sound_ti : "Ti",
                neobot_sound_half_note : "Half note",
                neobot_sound_quarter_note : "Quarter note",
                neobot_sound_eighth_note : "Eighth note",
                neobot_sound_sixteenth_note : "Sixteenth note"
            }
        }   //
    }
};

Entry.Neobot.getBlocks = function() {
    return {
        //region neobot 네오봇
        neobot_sensor_value: {
            color: '#00979D',
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_port_1, 'IN1'],
                        [Lang.Blocks.neobot_port_2, 'IN2'],
                        [Lang.Blocks.neobot_port_3, 'IN3'],
                        [Lang.Blocks.neobot_port_4, 'BAT'],
                        [Lang.Blocks.neobot_port_remot, 'IR'],
                        [Lang.Blocks.neobot_port_bat, 'BAT'],
                    ],
                    value: 'IN1',
                    fontSize: 11,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'neobot_sensor_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'neobot_value',
            isNotFor: ['neobot', 'neobot_sensor_theme'],
            func: function(sprite, script) {
                var port = script.getStringField('PORT');
                return Entry.hw.portData[port];
            },
            syntax: { js: [], py: ['Neobot.sensor_value(%1)'] },
        },
        neobot_sensor_convert_scale: {
            color: '#00979D',
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_port_1, 'IN1'],
                        [Lang.Blocks.neobot_port_2, 'IN2'],
                        [Lang.Blocks.neobot_port_3, 'IN3'],
                        [Lang.Blocks.neobot_port_4, 'BAT'],
                        [Lang.Blocks.neobot_port_remot, 'IR'],
                        [Lang.Blocks.neobot_port_bat, 'BAT'],
                    ],
                    value: 'IN1',
                    fontSize: 11,
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
            events: {},
            def: {
                params: [
                    null,
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['255'],
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
                type: 'neobot_sensor_convert_scale',
            },
            paramsKeyMap: {
                PORT: 0,
                OMIN: 1,
                OMAX: 2,
                MIN: 3,
                MAX: 4,
            },
            class: 'neobot_value',
            isNotFor: ['neobot', 'neobot_sensor_theme'],
            func: function(sprite, script) {
                var port = script.getStringField('PORT');
                var value = Entry.hw.portData[port];
                var omin = script.getNumberValue('OMIN', script);
                var omax = script.getNumberValue('OMAX', script);
                var min = script.getNumberValue('MIN', script);
                var max = script.getNumberValue('MAX', script);

                if (omin > omax) {
                    var temp = omin;
                    omin = omax;
                    omax = temp;
                }

                if (min > max) {
                    var temp = min;
                    min = max;
                    max = temp;
                }

                value -= omin;
                value = value * ((max - min) / (omax - omin));
                value += min;
                value = Math.min(max, value);
                value = Math.max(min, value);

                return Math.round(value);
            },
        },
        neobot_sensor_color: {
            color: '#00979D',
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_color_white, 0],
                        [Lang.Blocks.neobot_color_red, 1],
                        [Lang.Blocks.neobot_color_yellow, 2],
                        [Lang.Blocks.neobot_color_green, 3],
                        [Lang.Blocks.neobot_color_blue, 4],
                    ],
                    value: 'WHITE',
                    fontSize: 11,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'neobot_sensor_color',
            },
            paramsKeyMap: {
                COLOR: 0,
            },
            class: 'neobot_value',
            isNotFor: ['neobot', 'neobot_sensor_theme'],
            func: function(sprite, script) {
                var value = script.getNumberField('COLOR');
                return value;
            },
            syntax: { js: [], py: ['Neobot.sensor_color(%1)'] },
        },
        neobot_equal_with_sensor: {
            //MinjuneL
            color: '#00979D',
            fontColor: '#ffffff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_port_1, 'IN1'],
                        [Lang.Blocks.neobot_port_2, 'IN2'],
                        [Lang.Blocks.neobot_port_3, 'IN3'],
                        [Lang.Blocks.neobot_port_4, 'BAT'],
                        [Lang.Blocks.neobot_port_remot, 'IR'],
                        [Lang.Blocks.neobot_port_bat, 'BAT'],
                    ],
                    value: 'IN1',
                    fontSize: 11,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_color_white, 0],
                        [Lang.Blocks.neobot_color_red, 1],
                        [Lang.Blocks.neobot_color_yellow, 2],
                        [Lang.Blocks.neobot_color_green, 3],
                        [Lang.Blocks.neobot_color_blue, 4],
                    ],
                    value: '0',
                    fontSize: 11,
                },
            ],
            events: {},
            def: {
                params: [null, null],
                type: 'neobot_equal_with_sensor',
            },
            paramsKeyMap: {
                SENSOR: 0,
                COLOR: 1,
            },
            class: 'neobot_value',
            isNotFor: ['neobot', 'neobot_sensor_theme'],
            func: function(sprite, script) {
                var sensorTemp = script.getStringField('SENSOR');
                var sensor = Entry.hw.portData[sensorTemp];
                var color = script.getNumberField('COLOR');

                if (sensor >= 10 && sensor <= 50) {
                    if (color == 0) return true;
                    else return false;
                } else if (sensor >= 51 && sensor <= 90) {
                    if (color == 1) return true;
                    else return false;
                } else if (sensor >= 91 && sensor <= 130) {
                    if (color == 2) return true;
                    else return false;
                } else if (sensor >= 131 && sensor <= 170) {
                    if (color == 3) return true;
                    else return false;
                } else if (sensor >= 171 && sensor <= 210) {
                    if (color == 4) return true;
                    else return false;
                }
                return false;
            },
            syntax: { js: [], py: ['Entry.neobot_equal_check()'] },
        },
        get_motor_speed: {
            color: '#00979D',
            skeleton: 'basic_string_field',
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
                    ],
                    value: '15',
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
            syntax: { js: [], py: ['%1get_motor_speed#'] },
        },
        neobot_left_motor: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [[Lang.Blocks.neobot_direction_forward, '16'], [Lang.Blocks.neobot_direction_backward, '32']],
                    value: '16',
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
                    null,
                    {
                        type: 'get_motor_speed',
                        id: 'm111',
                    },
                    null,
                ],
                type: 'neobot_left_motor',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                SPEED: 1,
            },
            class: 'neobot_motor',
            isNotFor: ['neobot'],
            func: function(sprite, script) {
                var speed = Entry.parseNumber(script.getStringValue('SPEED'));
                var direction = script.getNumberField('DIRECTION');
                Entry.hw.sendQueue['DCL'] = speed + direction;
                return script.callReturn();
            },
            syntax: { js: [], py: ['Neobot.turn_left(%1, %2)'] },
        },
        neobot_stop_left_motor: {
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
                type: 'neobot_stop_left_motor',
            },
            class: 'neobot_motor',
            isNotFor: ['neobot'],
            func: function(sprite, script) {
                Entry.hw.sendQueue['DCL'] = 0;
                return script.callReturn();
            },
            syntax: { js: [], py: ['Neobot.stop_left()'] },
        },
        neobot_right_motor: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [[Lang.Blocks.neobot_direction_forward, '16'], [Lang.Blocks.neobot_direction_backward, '32']],
                    value: '16',
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
                    null,
                    {
                        type: 'get_motor_speed',
                        id: 'm112',
                    },
                    null,
                ],
                type: 'neobot_right_motor',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                SPEED: 1,
            },
            class: 'neobot_motor',
            isNotFor: ['neobot'],
            func: function(sprite, script) {
                var speed = Entry.parseNumber(script.getStringValue('SPEED'));
                var direction = script.getNumberField('DIRECTION');
                Entry.hw.sendQueue['DCR'] = speed + direction;
                return script.callReturn();
            },
            syntax: { js: [], py: ['Neobot.turn_right(%1, %2)'] },
        },
        neobot_stop_right_motor: {
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
                type: 'neobot_stop_right_motor',
            },
            class: 'neobot_motor',
            isNotFor: ['neobot'],
            func: function(sprite, script) {
                Entry.hw.sendQueue['DCR'] = 0;
                return script.callReturn();
            },
            syntax: { js: [], py: ['Neobot.stop_right()'] },
        },
        neobot_all_motor: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_direction_forward, '1'],
                        [Lang.Blocks.neobot_direction_backward, '2'],
                        [Lang.Blocks.neobot_direction_turn_left_p, '3'],
                        [Lang.Blocks.neobot_direction_turn_right_p, '4'],
                        [Lang.Blocks.neobot_direction_turn_left, '5'],
                        [Lang.Blocks.neobot_direction_turn_right, '6'],
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
                        type: 'get_motor_speed',
                        id: 'm113',
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                ],
                type: 'neobot_all_motor',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                SPEED: 1,
                DURATION: 2,
            },
            class: 'neobot_motor',
            isNotFor: ['neobot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;

                if (!script.isStart) {
                    var speed = Entry.parseNumber(
                        script.getStringValue('SPEED')
                    );
                    var direction = script.getNumberField('DIRECTION');
                    var duration = script.getNumberValue('DURATION');

                    if (duration < 0) {
                        duration = 0;
                    }

                    switch (direction) {
                        case 1:
                            Entry.hw.sendQueue['DCL'] = 0x10 + speed;
                            Entry.hw.sendQueue['DCR'] = 0x10 + speed;
                            break;
                        case 2:
                            Entry.hw.sendQueue['DCL'] = 0x20 + speed;
                            Entry.hw.sendQueue['DCR'] = 0x20 + speed;
                            break;
                        case 3:
                            Entry.hw.sendQueue['DCL'] = 0x20 + speed;
                            Entry.hw.sendQueue['DCR'] = 0x10 + speed;
                            break;
                        case 4:
                            Entry.hw.sendQueue['DCL'] = 0x10 + speed;
                            Entry.hw.sendQueue['DCR'] = 0x20 + speed;
                            break;
                        case 5:
                            Entry.hw.sendQueue['DCL'] = 0;
                            Entry.hw.sendQueue['DCR'] = 0x10 + speed;
                            break;
                        case 6:
                            Entry.hw.sendQueue['DCL'] = 0x10 + speed;
                            Entry.hw.sendQueue['DCR'] = 0;
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
                    Entry.hw.sendQueue['DCL'] = 0;
                    Entry.hw.sendQueue['DCR'] = 0;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
        },
        neobot_stop_all_motor: {
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
                type: 'neobot_stop_all_motor',
            },
            class: 'neobot_motor',
            isNotFor: ['neobot'],
            func: function(sprite, script) {
                Entry.hw.sendQueue['DCL'] = 0;
                Entry.hw.sendQueue['DCR'] = 0;
                return script.callReturn();
            },
            syntax: { js: [], py: ['Neobot.run_motor(%1, %2, %3, %4)'] },
        },
        neobot_set_servo: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['OUT1', 'OUT1'],
                        ['OUT2', 'OUT2'],
                        ['OUT3', 'OUT3'],
                    ],
                    value: 'OUT1',
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
                params: [null, null, null],
                type: 'neobot_set_servo',
            },
            paramsKeyMap: {
                PORT: 0,
                DEGREE: 1,
            },
            class: 'neobot_output',
            isNotFor: ['neobot'],
            func: function(sprite, script) {
                var port = script.getStringField('PORT', script);
                var degree = script.getNumberValue('DEGREE');
                if (degree < 0) {
                    degree = 0;
                } else if (degree > 180) {
                    degree = 180;
                }
                Entry.hw.sendQueue[port] = degree;
                var option = port;
                if (option === 3) {
                    option = 4;
                }
                Entry.hw.sendQueue['OPT'] = Entry.hw.sendQueue['OPT'] | option;
                return script.callReturn();
            },
            syntax: { js: [], py: ['Neobot.servo_1(%1, %2)'] },
        },
        neobot_set_output: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['OUT1', 'OUT1'],
                        ['OUT2', 'OUT2'],
                        ['OUT3', 'OUT3'],
                        ['OUT4', 'FND'],
                    ],
                    value: 'OUT1',
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
                    null,
                    {
                        type: 'number',
                        params: ['255'],
                    },
                    null,
                ],
                type: 'neobot_set_output',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'neobot_output',
            isNotFor: ['neobot', 'neobot_sensor_theme'],
            func: function(sprite, script) {
                var port = script.getStringField('PORT', script);
                var value = script.getNumberValue('VALUE', script);
                var option = port;
                if (value < 0) {
                    value = 0;
                } else if (value > 255) {
                    value = 255;
                }
                if (option === 3) {
                    option = 4;
                }
                Entry.hw.sendQueue[port] = value;
                Entry.hw.sendQueue['OPT'] = Entry.hw.sendQueue['OPT'] & ~option;
                return script.callReturn();
            },
            syntax: { js: [], py: ['Neobot.servo_2(%1, %2)'] },
        },
        neobot_set_fnd: {
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
                        type: 'number',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'neobot_set_fnd',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'neobot_output',
            isNotFor: ['neobot'],
            func: function(sprite, script) {
                var value = script.getNumberValue('VALUE', script);
                if (value > 99) {
                    value = 99;
                }
                Entry.hw.sendQueue['FND'] = parseInt('0x' + value);
                Entry.hw.sendQueue['OPT'] = Entry.hw.sendQueue['OPT'] | 8;
                return script.callReturn();
            },
        },
        neobot_set_fnd_off: {
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
                type: 'neobot_set_fnd_off',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'neobot_output',
            isNotFor: ['neobot'],
            func: function(sprite, script) {
                Entry.hw.sendQueue['FND'] = parseInt('0x00');
                Entry.hw.sendQueue['OPT'] = Entry.hw.sendQueue['OPT'] & ~8;
                return script.callReturn();
            },
        },
        neobot_play_note_for: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_sound_silent, '0'],
                        [Lang.Blocks.neobot_sound_do, '1'],
                        [Lang.Blocks.neobot_sound_do_shop, '2'],
                        [Lang.Blocks.neobot_sound_re, '3'],
                        [Lang.Blocks.neobot_sound_re_shop, '4'],
                        [Lang.Blocks.neobot_sound_mi, '5'],
                        [Lang.Blocks.neobot_sound_fa, '6'],
                        [Lang.Blocks.neobot_sound_fa_shop, '7'],
                        [Lang.Blocks.neobot_sound_so, '8'],
                        [Lang.Blocks.neobot_sound_so_shop, '9'],
                        [Lang.Blocks.neobot_sound_la, '10'],
                        [Lang.Blocks.neobot_sound_la_shop, '11'],
                        [Lang.Blocks.neobot_sound_ti, '12'],
                    ],
                    value: '0',
                    fontSize: 11,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['1', '0'],
                        ['2', '1'],
                        ['3', '2'],
                        ['4', '3'],
                        ['5', '4'],
                        ['6', '5'],
                    ],
                    value: '0',
                    fontSize: 11,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_sound_half_note, '2'],
                        [Lang.Blocks.neobot_sound_quarter_note, '4'],
                        [Lang.Blocks.neobot_sound_eighth_note, '8'],
                        [Lang.Blocks.neobot_sound_sixteenth_note, '16'],
                    ],
                    value: '2',
                    fontSize: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: ['1', '2', '4', null],
                type: 'neobot_play_note_for',
            },
            paramsKeyMap: {
                NOTE: 0,
                OCTAVE: 1,
                DURATION: 2,
            },
            class: 'neobot_note',
            isNotFor: ['neobot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;

                if (!script.isStart) {
                    var note = script.getNumberField('NOTE', script);
                    var octave = script.getNumberField('OCTAVE', script);
                    var duration = script.getNumberField('DURATION', script);
                    var value = note > 0 ? note + 12 * octave : 0;

                    script.isStart = true;
                    script.timeFlag = 1;
                    if (value > 65) {
                        value = 65; //이게 원래 코드 이민준
                    }
                    sq.SND = value;
                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, 1 / duration * 2000);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.hw.sendQueue['SND'] = 0;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['Neobot.play_note(%1, %2, %3)'] },
        },
        neobot_play_note_with_sensor: {
            //MinjuneL
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_port_1, 'IN1'],
                        [Lang.Blocks.neobot_port_2, 'IN2'],
                        [Lang.Blocks.neobot_port_3, 'IN3'],
                        [Lang.Blocks.neobot_port_remot, 'IR'],
                        [Lang.Blocks.neobot_port_bat, 'BAT'],
                    ],
                    value: 'IN1',
                    fontSize: 11,
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
                    null,
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['255'],
                    },
                    null,
                ],
                type: 'neobot_play_note_with_sensor',
            },
            paramsKeyMap: {
                PORT: 0,
                MIN_VALUE: 1,
                MAX_VALUE: 2,
                VALUE: 3,
            },
            class: 'neobot_note',
            isNotFor: ['neobot'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;

                //Value Translate
                var port = script.getStringField('PORT', script);
                var value = Entry.hw.portData[port];
                var omin = script.getNumberValue('MIN_VALUE', script);
                var omax = script.getNumberValue('MAX_VALUE', script);
                var min = 0;
                var max = 72; //밑에가 65면 얘도 65로

                if (omin > omax) {
                    var temp = omin;
                    omin = omax;
                    omax = temp;
                }

                if (min > max) {
                    var temp = min;
                    min = max;
                    max = temp;
                }

                value -= omin;
                value = value * ((max - min) / (omax - omin));
                value += min;
                value = Math.min(max, value);
                value = Math.max(min, value);

                value = Math.round(value);

                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    if (value > 72) {
                        value = 72; //72 이민준 새거
                    }
                    sq.SND = value;
                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, 1 / 4 * 2000);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.hw.sendQueue['SND'] = 0;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: ['Neobot.play_note_with_sensor(%1, %2, %3)'],
            },
        },
        neobot_change_color_with_color_picker: {
            //MinjuneL
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['OUT1', 'OUT1'],
                        ['OUT2', 'OUT2'],
                        ['OUT3', 'OUT3'],
                        ['OUT4', 'FND'],
                    ],
                    value: 'OUT1',
                    fontSize: 11,
                    arrowColor: EntryStatic.ARROW_COLOR_HW,
                },
                {
                    type: 'Color',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null, null, null],
                type: 'neobot_change_color_with_color_picker',
            },
            paramsKeyMap: {
                PORT: 0,
                COLOR: 1,
                VALUE: 2,
            },
            class: 'neobot_output',
            isNotFor: ['neobot', 'neobot_sensor_theme'],
            func: function(sprite, script) {
                var port = script.getStringField('PORT', script);
                var colour = script.getField('COLOR', script);

                Entry.hw.sendQueue[port] = colour;
                return script.callReturn();
            },
        },
        neobot_change_color_with_sensor_value: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['OUT1', 'OUT1'],
                        ['OUT2', 'OUT2'],
                        ['OUT3', 'OUT3'],
                        ['OUT4', 'FND'],
                    ],
                    value: 'OUT1',
                    fontSize: 11,
                    arrowColor: EntryStatic.ARROW_COLOR_HW,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_port_1, 'IN1'],
                        [Lang.Blocks.neobot_port_2, 'IN2'],
                        [Lang.Blocks.neobot_port_3, 'IN3'],
                        [Lang.Blocks.neobot_port_4, 'BAT'],
                        [Lang.Blocks.neobot_port_remot, 'IR'],
                        [Lang.Blocks.neobot_port_bat, 'BAT'],
                    ],
                    value: 'IN1',
                    fontSize: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null, null],
                type: 'neobot_change_color_with_sensor_value',
            },
            paramsKeyMap: {
                PORT_OUT: 0,
                PORT_IN: 1,
                VALUE: 2,
            },
            class: 'neobot_output',
            isNotFor: ['neobot', 'neobot_sensor_theme'],
            func: function(sprite, script) {
                var port = script.getStringField('PORT_IN');
                var inputPortValue = Entry.hw.portData[port];

                var portOut = script.getStringField('PORT_OUT', script);
                Entry.hw.sendQueue[portOut] = inputPortValue;

                return script.callReturn();
            },
        },
        //endregion neobot 네오봇
    };
};
