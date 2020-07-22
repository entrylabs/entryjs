'use strict';

Entry.Neobot = {
    id: '5.1',
    name: 'neobot',
    url: 'http://www.neobot.co.kr',
    imageName: 'neobot.png',
    title: {
        ko: '네오봇',
        en: 'NeoBot',
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

Entry.Neobot.setLanguage = function() {
    return {
        ko: {
            template: {
                neobot_sensor_value: '%1 값', 
                neobot_sensor_connect_external: '%1 에 연결한 %2 값', 
                neobot_sensor_convert_scale: '%1 센서값 %2 ~ %3 를 %4 ~ %5 (으)로 바꾼 값',

                neobot_compare_symbol: '%1',
                neobot_decision_sensor_is_over: "%1 의 센서값이 %2 %3",
                neobot_decision_equal_with_sensor: '%1 에 연결한 컬러센서가 %2 을 감지함',
                neobot_remote_button : "리모컨의 %1 버튼을 누름",

                get_motor_speed: '%1',
                neobot_left_motor: '왼쪽 모터를 %1 %2 의 속도로 회전 %3',
                neobot_stop_left_motor: '왼쪽 모터를 정지 %1',
                neobot_right_motor: '오른쪽 모터를 %1 %2 의 속도로 회전 %3',
                neobot_stop_right_motor: '오른쪽 모터를 정지 %1',
                neobot_both_motor: '왼쪽 모터를 %1 %2 & 오른쪽 모터를 %3 %4 의 속도로 회전 %5',
                neobot_all_motor: '양쪽 모터를 %1 %2의 속도로 %3 회전 %4',
                neobot_stop_all_motor: '양쪽 모터를 정지 %1',
                neobot_robot: '로봇 %1 %2',

                neobot_output_led_type1: '%1 에 연결한 LED를 %2 밝기로 %3 켜기 %4',
                neobot_output_led_on: '%1 에 연결한 LED 켜기 %2', 
                neobot_output_led_off: '%1 에 연결한 LED 끄기 %2',
                neobot_set_output: '%1 에 %2값만큼 출력 %3',

                get_servo_degree: '%1',
                neobot_servo_init: '%1 Servo모터 리셋 %2',
                neobot_servo_change_degree: 'Servo모터 각도 바꾸기 : %1 %2 %3 %4 %5',
                neobot_servo_rotate: 'Servo모터 회전하기 : %1 %2 %3 %4',
                neobot_servo_stop: '%1 Servo모터 멈추기 %2',

                neobot_play_note_for: '멜로디 %1 을(를) %2 옥타브로 %3 길이만큼 소리내기 %4',
                neobot_play_note_with_sensor: '컨트롤러에서 %1 센서의 %2 ~ %3 값으로 멜로디 연주하기 %4',
            },
            Blocks: {
                //for dropdown
                neobot_port_1 : "IN1",
                neobot_port_2 : "IN2",
                neobot_port_3 : "IN3",
                neobot_port_4 : "IN4",
                neobot_port_bat : "배터리",
                neobot_port_remot : "리모컨",
                neobot_color_white : "흰색",
                neobot_color_red : "빨간색",
                neobot_color_yellow : "노란색",
                neobot_color_green : "초록색(연두색)",
                neobot_color_blue : "파란색",
                neobot_direction_forward : "앞으로",
                neobot_direction_backward : "뒤로",
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
                neobot_sound_sixteenth_note : "16분 음표",
                neobot_sensor_infrared : '적외선센서',
                neobot_sensor_light : '빛센서',
                neobot_sensor_sound : '소리센서',
                neobot_compare_symbol1 : '＝',
                neobot_compare_symbol2 : '＞',
                neobot_compare_symbol3 : '＜',
                neobot_compare_symbol4 : '≥',
                neobot_compare_symbol5 : '≤',
                neobot_remote_btn_a: 'A',
                neobot_remote_btn_b: 'B',
                neobot_remote_btn_c: 'C',
                neobot_remote_btn_d: 'D',
                neobot_remote_btn_1: '1',
                neobot_remote_btn_2: '2',
                neobot_remote_btn_3: '3',
                neobot_remote_btn_4: '4',
                neobot_remote_btn_up: '▲',
                neobot_remote_btn_down: '▼',
                neobot_remote_btn_left: '◀',
                neobot_remote_btn_right: '▶',
                neobot_duration_cont: '계속',
                neobot_duration_1s: '1초',
                neobot_duration_2s: '2초',
                neobot_duration_3s: '3초',
                neobot_duration_4s: '4초',
                neobot_duration_5s: '5초',
                neobot_duration_6s: '6초',
                neobot_duration_7s: '7초',
                neobot_duration_8s: '8초',
                neobot_duration_9s: '9초',
                neobot_motor_both: '양쪽',
                neobot_motor_left: '왼쪽',
                neobot_motor_right: '오른쪽',
                neobot_motor_move_forward: '전진',
                neobot_motor_move_backward: '후진',
                neobot_motor_move_left: '좌회전',
                neobot_motor_move_right: '우회전',
                neobot_motor_move_stop: '정지',
                // modified string by cky 191205
                neobot_servo_dir_1: '정방향', 
                neobot_servo_dir_2: '역방향',
                // added by cky 191205
                neobot_percent_10: '10%속도',
                neobot_percent_20: '20%속도',
                neobot_percent_30: '30%속도',
                neobot_percent_40: '40%속도',
                neobot_percent_50: '50%속도',
                neobot_percent_60: '60%속도',
                neobot_percent_70: '70%속도',
                neobot_percent_80: '80%속도',
                neobot_percent_90: '90%속도',
                neobot_percent_100: '100%속도',

                neobot_degree_0: '0도',
                neobot_degree_5: '5도',
                neobot_degree_10: '10도',
                neobot_degree_15: '15도',
                neobot_degree_20: '20도',
                neobot_degree_25: '25도',
                neobot_degree_30: '30도',
                neobot_degree_35: '35도',
                neobot_degree_40: '40도',
                neobot_degree_45: '45도',
                neobot_degree_50: '50도',
                neobot_degree_55: '55도',
                neobot_degree_60: '60도',
                neobot_degree_65: '65도',
                neobot_degree_70: '70도',
                neobot_degree_75: '75도',
                neobot_degree_80: '80도',
                neobot_degree_85: '85도',
                neobot_degree_90: '90도',
                neobot_degree_95: '95도',
                neobot_degree_100: '100도',
                neobot_degree_105: '105도',
                neobot_degree_110: '110도',
                neobot_degree_115: '115도',
                neobot_degree_120: '120도',
                neobot_degree_125: '125도',
                neobot_degree_130: '130도',
                neobot_degree_135: '135도',
                neobot_degree_140: '140도',
                neobot_degree_145: '145도',
                neobot_degree_150: '150도',
                neobot_degree_155: '155도',
                neobot_degree_160: '160도',
                neobot_degree_165: '165도',
                neobot_degree_170: '170도',
                neobot_degree_175: '175도',
                neobot_degree_180: '180도',
            }
        },
        en: {
            // en.js에 작성하던 내용
            template: {
                neobot_sensor_value: '%1 value',
                neobot_sensor_connect_external: 'the %2 value connected %1',
                neobot_sensor_convert_scale: "the value that is changed %1 sensor value %2 ~%3 to %4 ~ %5",
                
                neobot_compare_symbol: '%1',
                neobot_decision_sensor_is_over: "%1 sensor value %2 %3", 
                neobot_decision_equal_with_sensor: "being detected %2 by %1 color sensor",
                neobot_remote_button : 'pressing button %1 of remote controller',

                get_motor_speed: '%1',
                neobot_left_motor: 'Rotate the left motor in %2 for speed %1 %3',
                neobot_stop_left_motor: 'Stop the left motor %1',
                neobot_right_motor: 'Rotate the right motor in %2 for speed %1 %3',
                neobot_stop_right_motor: 'Stop right motor %1',
                neobot_both_motor: 'Rotate the left motor in %2 speed %1 & the right motor in %4 for speed %3 %5',
                neobot_all_motor: 'Rotate both motors %2 speed %1 for %3 second(s) %4',
                neobot_stop_all_motor: 'Stop both motors %1',
                neobot_robot: 'Go %1 the robot %2',

                neobot_output_led_type1: 'Turn on the LED connected %1 in %2 brightness for %3 %4',
                neobot_output_led_on: 'Turn on the LED connected %1 %2',
                neobot_output_led_off: 'Turn off the LED connected %1 %2',
                neobot_set_output: 'Output %1 port value to %2 %3',

                get_servo_degree: '%1',
                neobot_servo_init: 'Reset the %1 servo motor %2',
                neobot_servo_change_degree: 'Change servo angle : %1 %2 %3 %4 %5',
                neobot_servo_rotate: 'Rotate the servo motor : %1 %2 %3 %4',
                neobot_servo_stop: 'Stop the %1 servo motor %2',

                neobot_play_note_for: 'Make a sound the melody %1 to %2 octave(s) as %3 %4',
                neobot_play_note_with_sensor: "Play the melody as %2 ~ %3 value of %1 sensor in the controller %4",
            },
            Blocks: {
                //for dropdown
                neobot_port_1: 'port1',
                neobot_port_2: 'port2',
                neobot_port_3: 'port3',
                neobot_port_4: 'port4',
                neobot_port_bat: 'battery',
                neobot_port_remot: 'remote',
                neobot_color_white: 'white',
                neobot_color_red: 'red',
                neobot_color_yellow: 'yellow',
                neobot_color_green: 'green',
                neobot_color_blue: 'blue',
                neobot_direction_forward: 'forward',
                neobot_direction_backward: 'backward',
                neobot_sound_silent: 'silent',
                neobot_sound_do: 'Do',
                neobot_sound_do_shop: 'Do#',
                neobot_sound_re: 'Re',
                neobot_sound_re_shop: 'Re#',
                neobot_sound_mi: 'Mi',
                neobot_sound_fa: 'Fa',
                neobot_sound_fa_shop: 'Fa#',
                neobot_sound_so: 'So',
                neobot_sound_so_shop: 'So#',
                neobot_sound_la: 'La',
                neobot_sound_la_shop: 'La#',
                neobot_sound_ti: 'Ti',
                neobot_sound_half_note: 'a half note',
                neobot_sound_quarter_note: 'a quarter note',
                neobot_sound_eighth_note: 'a eighth note',
                neobot_sound_sixteenth_note: 'a sixteenth note',
                neobot_sensor_infrared : 'IR sensor',
                neobot_sensor_light : 'light sensor',
                neobot_sensor_sound : 'sound sensor',
                neobot_compare_symbol1 : '＝',
                neobot_compare_symbol2 : '＞',
                neobot_compare_symbol3 : '＜',
                neobot_compare_symbol4 : '≥',
                neobot_compare_symbol5 : '≤',
                neobot_remote_btn_a: 'A',
                neobot_remote_btn_b: 'B',
                neobot_remote_btn_c: 'C',
                neobot_remote_btn_d: 'D',
                neobot_remote_btn_1: '1',
                neobot_remote_btn_2: '2',
                neobot_remote_btn_3: '3',
                neobot_remote_btn_4: '4',
                neobot_remote_btn_up: '▲',
                neobot_remote_btn_down: '▼',
                neobot_remote_btn_left: '◀',
                neobot_remote_btn_right: '▶',
                neobot_duration_cont: 'constantly',
                neobot_duration_1s: '1 second',
                neobot_duration_2s: '2 seconds',
                neobot_duration_3s: '3 seconds',
                neobot_duration_4s: '4 seconds',
                neobot_duration_5s: '5 seconds',
                neobot_duration_6s: '6 seconds',
                neobot_duration_7s: '7 seconds',
                neobot_duration_8s: '8 seconds',
                neobot_duration_9s: '9 seconds',
                neobot_motor_both: 'both',
                neobot_motor_left: 'left',
                neobot_motor_right: 'right',
                neobot_motor_move_forward: 'go forward',
                neobot_motor_move_backward: 'go backward',
                neobot_motor_move_left: 'turn Left',
                neobot_motor_move_right: 'turn Right',
                neobot_motor_move_stop: 'stop',
                // modified string by cky 191205
                neobot_servo_dir_1: 'forward',
                neobot_servo_dir_2: 'backward',
                // added by cky 191205
                neobot_percent_10: '10% speed',
                neobot_percent_20: '20% speed',
                neobot_percent_30: '30% speed',
                neobot_percent_40: '40% speed',
                neobot_percent_50: '50% speed',
                neobot_percent_60: '60% speed',
                neobot_percent_70: '70% speed',
                neobot_percent_80: '80% speed',
                neobot_percent_90: '90% speed',
                neobot_percent_100: '100% speed',

                neobot_degree_0: '0 degree',
                neobot_degree_5: '5 degrees',
                neobot_degree_10: '10 degrees',
                neobot_degree_15: '15 degrees',
                neobot_degree_20: '20 degrees',
                neobot_degree_25: '25 degrees',
                neobot_degree_30: '30 degrees',
                neobot_degree_35: '35 degrees',
                neobot_degree_40: '40 degrees',
                neobot_degree_45: '45 degrees',
                neobot_degree_50: '50 degrees',
                neobot_degree_55: '55 degrees',
                neobot_degree_60: '60 degrees',
                neobot_degree_65: '65 degrees',
                neobot_degree_70: '70 degrees',
                neobot_degree_75: '75 degrees',
                neobot_degree_80: '80 degrees',
                neobot_degree_85: '85 degrees',
                neobot_degree_90: '90 degrees',
                neobot_degree_95: '95 degrees',
                neobot_degree_100: '100 degrees',
                neobot_degree_105: '105 degrees',
                neobot_degree_110: '110 degrees',
                neobot_degree_115: '115 degrees',
                neobot_degree_120: '120 degrees',
                neobot_degree_125: '125 degrees',
                neobot_degree_130: '130 degrees',
                neobot_degree_135: '135 degrees',
                neobot_degree_140: '140 degrees',
                neobot_degree_145: '145 degrees',
                neobot_degree_150: '150 degrees',
                neobot_degree_155: '155 degrees',
                neobot_degree_160: '160 degrees',
                neobot_degree_165: '165 degrees',
                neobot_degree_170: '170 degrees',
                neobot_degree_175: '175 degrees',
                neobot_degree_180: '180degrees',
            },
        }, //
    };
};

Entry.Neobot.blockMenuBlocks = [
    // class sensor
    'neobot_sensor_value',
    'neobot_sensor_connect_external',
    'neobot_sensor_convert_scale',
    // class decision
    'neobot_decision_sensor_is_over',
    'neobot_decision_equal_with_sensor',
    // class remote
    'neobot_remote_button',
    // class motor
    'neobot_left_motor',
    'neobot_stop_left_motor',
    'neobot_right_motor',
    'neobot_stop_right_motor',
    'neobot_both_motor',
    'neobot_all_motor',
    // removed by cky 190423
    //'neobot_motor_with_sensor',
    'neobot_stop_all_motor',
    'neobot_robot',
    // class output
    'neobot_output_led_type1',
    'neobot_output_led_on',
    'neobot_output_led_off',
    'neobot_set_output',
    // class servo
    'neobot_servo_init',
    'neobot_servo_change_degree',
    'neobot_servo_rotate',
    'neobot_servo_stop',
    // class note
    'neobot_play_note_for',
    'neobot_play_note_with_sensor',
];

Entry.Neobot.getBlocks = function() {
    return {
        //region neobot 네오봇
        neobot_sensor_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
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
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
            isNotFor: ['neobot'],
            func: function(sprite, script) {
                var port = script.getStringField('PORT');
                return Entry.hw.portData[port];
            },
            syntax: { js: [], py: ['Neobot.sensor_value(%1)'] },
        },

        // un-used. use if required pluggable block.
        neobot_compare_symbol :{
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_compare_symbol1, '='],
                        [Lang.Blocks.neobot_compare_symbol2, '>'],
                        [Lang.Blocks.neobot_compare_symbol3, '<'],
                        [Lang.Blocks.neobot_compare_symbol4, '>='],
                        [Lang.Blocks.neobot_compare_symbol5, '<='],
                    ],
                    value: '>',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'neobot_compare_symbol',
            },
            paramsKeyMap: {
                SYMBOL: 0,
            },
            class: 'neobot_value',
            isNotFor: ['neobot'],
            func: function(sprite, script) {
                return  script.getStringField('SYMBOL');
            },
        },

        neobot_sensor_connect_external: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
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
                    ],
                    value: 'IN1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_sensor_infrared, '1'],
                        [Lang.Blocks.neobot_sensor_light, '2'],
                        [Lang.Blocks.neobot_sensor_sound, '3'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null, null],
                type: 'neobot_sensor_connect_external',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'neobot_value',
            isNotFor: ['neobot'],
            func: function(sprite, script) {
                var port = script.getStringField('PORT');
                return Entry.hw.portData[port];
            },
        },

        neobot_sensor_convert_scale: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
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
                    ],
                    value: 'IN1',
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
            isNotFor: ['neobot'],
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
        
        neobot_decision_sensor_is_over: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
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
                    ],
                    value: 'IN1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_compare_symbol1, '='],
                        [Lang.Blocks.neobot_compare_symbol2, '>'],
                        [Lang.Blocks.neobot_compare_symbol3, '<'],
                        [Lang.Blocks.neobot_compare_symbol4, '>='],
                        [Lang.Blocks.neobot_compare_symbol5, '<='],
                    ],
                    value: '>',
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
                params: [null, null, 10],
                type: 'neobot_decision_sensor_is_over',
            },
            paramsKeyMap: {
                SENSOR: 0,
                SYMBOL: 1,
                VALUE: 2,
            },
            class: 'decision',
            isNotFor: ['neobot'],
            func: function(sprite, script) {
                var sensorTemp = script.getStringField('SENSOR');
                var sensor = Entry.hw.portData[sensorTemp];
                var symbol = script.getStringField('SYMBOL');
                var value = Entry.parseNumber(script.getStringValue('VALUE'));

                if (symbol == '=') {
                    if(sensor == value) return true;
                    else return false;
                } else if (symbol == '>') {
                    if(sensor > value) return true;
                    else return false;
                } else if (symbol == '<') {
                    if(sensor < value) return true;
                    else return false;
                } else if (symbol == '>=') {
                    if(sensor >= value) return true;
                    else return false;
                } else if (symbol == '<=') {
                    if(sensor <= value) return true;
                    else return false;
                }
                return false;
            },
        },

        neobot_decision_equal_with_sensor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
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
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null, null],
                type: 'neobot_decision_equal_with_sensor',
            },
            paramsKeyMap: {
                SENSOR: 0,
                COLOR: 1,
            },
            class: 'decision',
            isNotFor: ['neobot'],
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
        neobot_remote_button: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#FFFFFF',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_remote_btn_a, '1'],
                        [Lang.Blocks.neobot_remote_btn_b, '2'],
                        [Lang.Blocks.neobot_remote_btn_c, '3'],
                        [Lang.Blocks.neobot_remote_btn_d, '4'],
                        [Lang.Blocks.neobot_remote_btn_1, '5'],
                        [Lang.Blocks.neobot_remote_btn_2, '6'],
                        [Lang.Blocks.neobot_remote_btn_3, '7'],
                        [Lang.Blocks.neobot_remote_btn_4, '8'],
                        [Lang.Blocks.neobot_remote_btn_up, '11'],
                        [Lang.Blocks.neobot_remote_btn_down, '12'],
                        [Lang.Blocks.neobot_remote_btn_left, '14'],
                        [Lang.Blocks.neobot_remote_btn_right, '13'],
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
                type: 'neobot_remote_button',
            },
            paramsKeyMap: {
                KEY: 0,
            },
            class: 'remote',
            isNotFor: ['neobot'],
            func: function(sprite, script) {
                var key = script.getNumberField('KEY');
                var value = Entry.hw.portData['IR'];
                if(key >= 5 && key <= 8)
                    key -= 4;
                if(key == value){
                    return true;
                } else {
                    return false;
                }
            },
        },

        get_motor_speed: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
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
                    value: '5',
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
                return script.getStringField('VALUE');
            },
            syntax: { js: [], py: ['%1get_motor_speed#'] },
        },
        neobot_left_motor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_direction_forward, '16'],
                        [Lang.Blocks.neobot_direction_backward, '32'],
                    ],
                    value: '16',
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
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_direction_forward, '16'],
                        [Lang.Blocks.neobot_direction_backward, '32'],
                    ],
                    value: '16',
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
        neobot_both_motor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_direction_forward, '16'],
                        [Lang.Blocks.neobot_direction_backward, '32'],
                    ],
                    value: '16',
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
                        [Lang.Blocks.neobot_direction_forward, '16'],
                        [Lang.Blocks.neobot_direction_backward, '32'],
                    ],
                    value: '16',
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
                    '16',
                    {
                        type: 'get_motor_speed',
                        id: 'm113',
                    },
                    '16',
                    {
                        type: 'get_motor_speed',
                        id: 'm114',
                    },
                    null,
                ],
                type: 'neobot_both_motor',
            },
            paramsKeyMap: {
                DIRECTION_LEFT: 0,
                SPEED_LEFT: 1,
                DIRECTION_RIGHT: 2,
                SPEED_RIGHT:3
            },
            class: 'neobot_motor',
            isNotFor: ['neobot'],
            func: function(sprite, script) {
                var speed_left = Entry.parseNumber(script.getStringValue('SPEED_LEFT'));
                var direction_left = script.getNumberField('DIRECTION_LEFT');
                var speed_right = Entry.parseNumber(script.getStringValue('SPEED_RIGHT'));
                var direction_right = script.getNumberField('DIRECTION_RIGHT');
                Entry.hw.sendQueue['DCL'] = speed_left + direction_left;
                Entry.hw.sendQueue['DCR'] = speed_right + direction_right;
                return script.callReturn();
            },
        },
        neobot_all_motor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_direction_forward, '1'],
                        [Lang.Blocks.neobot_direction_backward, '2'],
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
                        [Lang.Blocks.neobot_duration_cont, '0'],
                        [Lang.Blocks.neobot_duration_1s, '1'],
                        [Lang.Blocks.neobot_duration_2s, '2'],
                        [Lang.Blocks.neobot_duration_3s, '3'],
                        [Lang.Blocks.neobot_duration_4s, '4'],
                        [Lang.Blocks.neobot_duration_5s, '5'],
                        [Lang.Blocks.neobot_duration_6s, '6'],
                        [Lang.Blocks.neobot_duration_7s, '7'],
                        [Lang.Blocks.neobot_duration_8s, '8'],
                        [Lang.Blocks.neobot_duration_9s, '9'],
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
                    '1',
                    {
                        type: 'get_motor_speed',
                        id: 'm115',
                    },
                    '0',
                    null,
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
                    var speed = Entry.parseNumber(script.getStringValue('SPEED'));
                    var direction = script.getNumberField('DIRECTION');
                    var duration = script.getNumberField('DURATION');

                    switch (direction) {
                        case 1:
                        Entry.hw.sendQueue['DCL'] = 0x10 + speed;
                        Entry.hw.sendQueue['DCR'] = 0x10 + speed;
                        break;
                        case 2:
                        Entry.hw.sendQueue['DCL'] = 0x20 + speed;
                        Entry.hw.sendQueue['DCR'] = 0x20 + speed;
                        break;
                    }
                    
                    if(duration == 0)
                        return script.callReturn();
                    
                    script.isStart = true;
                    script.timeFlag = 1;
                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, duration * 1000);
                    return script;
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
        // removed by cky 190423
        /*neobot_motor_with_sensor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_port_1, 'IN1'],
                        [Lang.Blocks.neobot_port_2, 'IN2'],
                        [Lang.Blocks.neobot_port_3, 'IN3'],
                    ],
                    value: 'IN1',
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
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_motor_both, '1'],
                        [Lang.Blocks.neobot_motor_left, '2'],
                        [Lang.Blocks.neobot_motor_right, '3'],
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
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['255'],
                    },
                    null,
                    null,
                ],
                type: 'neobot_motor_with_sensor',
            },
            paramsKeyMap: {
                SENSOR: 0,
                MIN_VALUE: 1,
                MAX_VALUE: 2,
                MOTOR: 3,
            },
            class: 'neobot_motor',
            isNotFor: ['neobot'],
            func: function(sprite, script) {
                var port = script.getStringField('PORT', script);
                var min = script.getNumberValue('MIN_VALUE', script);
                var max = script.getNumberValue('MAX_VALUE', script);
                var motor = script.getNumberField('MOTOR', script);
                var sensorValue =  Entry.hw.portData[port];
                var sectionUnit = (max - min) / 15;
                var value = 0;

                if(min > max
                    || sensorValue > max
                    || sensorValue < min) {
                    return script.callReturn();
                }

                sensorValue = sensorValue - min;
                value = Math.round(sensorValue / sectionUnit);
                
                if(value > 15)
                    value = 15;
                else (value < 0)
                    value = 0;

                switch (motor) {
                    case 1: 
                    Entry.hw.sendQueue['DCL'] = 0x10 + value;
                    Entry.hw.sendQueue['DCR'] = 0x10 + value;
                    break;
                    case 2:
                    Entry.hw.sendQueue['DCL'] = 0x10 + value;
                    break;
                    case 3:
                    Entry.hw.sendQueue['DCR'] = 0x10 + value;
                    break;
                }
            },
        },*/
        neobot_stop_all_motor: {
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
        neobot_robot: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_motor_move_forward, '1'],
                        [Lang.Blocks.neobot_motor_move_backward, '2'],
                        [Lang.Blocks.neobot_motor_move_left, '3'],
                        [Lang.Blocks.neobot_motor_move_right, '4'],
                        [Lang.Blocks.neobot_motor_move_stop, '5'],
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
                ],
                type: 'neobot_robot',
            },
            paramsKeyMap: {
                MOVE: 0,
            },
            class: 'neobot_motor',
            isNotFor: ['neobot'],
            func: function(sprite, script) {
                var move = script.getNumberField('MOVE');
                switch (move) {
                    case 1:
                    Entry.hw.sendQueue['DCL'] = 0x10 + 10;
                    Entry.hw.sendQueue['DCR'] = 0x10 + 10;
                    break;
                    case 2:
                    Entry.hw.sendQueue['DCL'] = 0x20 + 10;
                    Entry.hw.sendQueue['DCR'] = 0x20 + 10;
                    break;
                    case 3:
                    Entry.hw.sendQueue['DCL'] = 0x20 + 5;
                    Entry.hw.sendQueue['DCR'] = 0x10 + 5;
                    break;
                    case 4:
                    Entry.hw.sendQueue['DCL'] = 0x10 + 5;
                    Entry.hw.sendQueue['DCR'] = 0x20 + 5;
                    break;
                    case 5:
                    Entry.hw.sendQueue['DCL'] = 0;
                    Entry.hw.sendQueue['DCR'] = 0;
                    break;
                }
                return script.callReturn();
            },
        },
        
        neobot_output_led_type1 : {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
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
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['100%', '255'],
                        ['90%', '230'],
                        ['80%', '204'],
                        ['70%', '179'],
                        ['60%', '153'],
                        ['50%', '128'],
                        ['40%', '102'],
                        ['30%', '77'],
                        ['20%', '51'],
                        ['10%', '26'],
                    ],
                    value: '255',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_duration_cont, '0'],
                        [Lang.Blocks.neobot_duration_1s, '1'],
                        [Lang.Blocks.neobot_duration_2s, '2'],
                        [Lang.Blocks.neobot_duration_3s, '3'],
                        [Lang.Blocks.neobot_duration_4s, '4'],
                        [Lang.Blocks.neobot_duration_5s, '5'],
                        [Lang.Blocks.neobot_duration_6s, '6'],
                        [Lang.Blocks.neobot_duration_7s, '7'],
                        [Lang.Blocks.neobot_duration_8s, '8'],
                        [Lang.Blocks.neobot_duration_9s, '9'],
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
                params: [null, null, null, null],
                type: 'neobot_output_led_type1',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
                DURATION: 2,
            },
            class: 'neobot_output',
            isNotFor: ['neobot'],
            func: function(sprite, script) {
                if (!script.isStart) {
                    var port = script.getStringField('PORT', script);
                    var value = script.getNumberField('VALUE', script);
                    var duration = script.getNumberField('DURATION', script);

                    Entry.hw.sendQueue[port] = value;
                    if(duration == 0) {
                        return script.callReturn();
                    }
                    
                    script.isStart = true;
                    script.timeFlag = 1;
                    setTimeout(function() {
                        Entry.hw.sendQueue[port] = 0;
                        script.timeFlag = 0;
                    }, duration * 1000);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
        },
        neobot_output_led_on : {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
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
                type: 'neobot_output_led_on',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'neobot_output',
            isNotFor: ['neobot'],
            func: function(sprite, script) {
                var port = script.getStringField('PORT', script);
                Entry.hw.sendQueue[port] = 255;
                return script.callReturn();
            },
        },
        neobot_output_led_off : {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
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
                type: 'neobot_output_led_off',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'neobot_output',
            isNotFor: ['neobot'],
            func: function(sprite, script) {
                var port = script.getStringField('PORT', script);
                var option = port;
                Entry.hw.sendQueue[port] = 0;
                return script.callReturn();
            },
        },
        neobot_set_output: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
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
            isNotFor: ['neobot'],
            func: function(sprite, script) {
                var port = script.getStringField('PORT', script);
                var value = script.getNumberValue('VALUE', script);
                var option = port;
                if (value < 0) {
                    value = 0;
                } else if (value > 255) {
                    value = 255;
                }
                Entry.hw.sendQueue[port] = value;
                return script.callReturn();
            },
        },
        
        // class note
        neobot_play_note_for: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
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
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                        value = 65;
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
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
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

                var port = script.getStringField('PORT', script);
                var value = Entry.hw.portData[port];
                var omin = script.getNumberValue('MIN_VALUE', script);
                var omax = script.getNumberValue('MAX_VALUE', script);
                var min = 0;
                var max = 72;

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
                        value = 72;
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

        // class servo
        get_servo_degree: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_degree_0, '0'],
                        [Lang.Blocks.neobot_degree_5, '5'],
                        [Lang.Blocks.neobot_degree_10, '10'],
                        [Lang.Blocks.neobot_degree_15, '15'],
                        [Lang.Blocks.neobot_degree_20, '20'],
                        [Lang.Blocks.neobot_degree_25, '25'],
                        [Lang.Blocks.neobot_degree_30, '30'],
                        [Lang.Blocks.neobot_degree_35, '35'],
                        [Lang.Blocks.neobot_degree_40, '40'],
                        [Lang.Blocks.neobot_degree_45, '45'],
                        [Lang.Blocks.neobot_degree_50, '50'],
                        [Lang.Blocks.neobot_degree_55, '55'],
                        [Lang.Blocks.neobot_degree_60, '60'],
                        [Lang.Blocks.neobot_degree_65, '65'],
                        [Lang.Blocks.neobot_degree_70, '70'],
                        [Lang.Blocks.neobot_degree_75, '75'],
                        [Lang.Blocks.neobot_degree_80, '80'],
                        [Lang.Blocks.neobot_degree_85, '85'],
                        [Lang.Blocks.neobot_degree_90, '90'],
                        [Lang.Blocks.neobot_degree_95, '95'],
                        [Lang.Blocks.neobot_degree_100, '100'],
                        [Lang.Blocks.neobot_degree_105, '105'],
                        [Lang.Blocks.neobot_degree_110, '110'],
                        [Lang.Blocks.neobot_degree_115, '115'],
                        [Lang.Blocks.neobot_degree_120, '120'],
                        [Lang.Blocks.neobot_degree_125, '125'],
                        [Lang.Blocks.neobot_degree_130, '130'],
                        [Lang.Blocks.neobot_degree_135, '135'],
                        [Lang.Blocks.neobot_degree_140, '140'],
                        [Lang.Blocks.neobot_degree_145, '145'],
                        [Lang.Blocks.neobot_degree_150, '150'],
                        [Lang.Blocks.neobot_degree_155, '155'],
                        [Lang.Blocks.neobot_degree_160, '160'],
                        [Lang.Blocks.neobot_degree_165, '165'],
                        [Lang.Blocks.neobot_degree_170, '170'],
                        [Lang.Blocks.neobot_degree_175, '175'],
                        [Lang.Blocks.neobot_degree_180, '180'],
                    ],
                    value: '90',
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
                return script.getStringField('VALUE');
            },
            syntax: { js: [], py: ['%1get_servo_degree#'] },
        },
        neobot_servo_init: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['OUT1', 'OUT1'], ['OUT2', 'OUT2'], ['OUT1&2', 'ALL']],
                    value: 'OUT1',
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
                type: 'neobot_servo_init',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'neobot_servo',
            isNotFor: ['neobot'],
            func: function(sprite, script) {
                if (!script.isStart) {
                    var port = script.getStringField('PORT', script);
                    if (port == 'ALL') {
                        Entry.hw.sendQueue['OUT1'] = 0xBA;
                        Entry.hw.sendQueue['OUT2'] = 0xBA;
                        
                        script.isStart = true;
                        script.timeFlag = 1;
                        setTimeout(function() {
                            Entry.hw.sendQueue['OUT1'] = 0x01;
                            Entry.hw.sendQueue['OUT2'] = 0x01;
                            script.timeFlag = 0;
                        }, 200);
                    } else {
                        Entry.hw.sendQueue[port] = 0xBA;
                        
                        script.isStart = true;
                        script.timeFlag = 1;
                        setTimeout(function() {
                            Entry.hw.sendQueue[port] = 0x01;
                            script.timeFlag = 0;
                        }, 200);
                    }
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
        },
        
        // integrated by cky 191205 from neobot_servo_turn_typeX
        neobot_servo_change_degree: {
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
                    options: [['OUT1', 'OUT1'], ['OUT2', 'OUT2'], ['OUT1&2', 'ALL']],
                    value: 'OUT1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_servo_dir_1, '1'],
                        [Lang.Blocks.neobot_servo_dir_2, '2'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_percent_10, '9'],
                        [Lang.Blocks.neobot_percent_20, '8'],
                        [Lang.Blocks.neobot_percent_30, '7'],
                        [Lang.Blocks.neobot_percent_40, '6'],
                        [Lang.Blocks.neobot_percent_50, '5'],
                        [Lang.Blocks.neobot_percent_60, '4'],
                        [Lang.Blocks.neobot_percent_70, '3'],
                        [Lang.Blocks.neobot_percent_80, '2'],
                        [Lang.Blocks.neobot_percent_90, '1'],
                        [Lang.Blocks.neobot_percent_100, '0'],
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
                    {
                        type: 'get_servo_degree',
                        id: 'm211',
                    },
                    null,
                    null,
                    null,
                    null,
                ],
                type: 'neobot_servo_change_degree',
            },
            paramsKeyMap: {
                DEGREE: 0,
                PORT: 1,
                DIRECTION: 2,
                SPEED: 3
            },
            class: 'neobot_servo',
            isNotFor: ['neobot'],
            func: function(sprite, script) {
                if (!script.isStart) {
                    var degree = Entry.parseNumber(script.getStringValue('DEGREE'));
                    var port = script.getStringField('PORT', script);
                    var direction = script.getNumberField('DIRECTION');
                    var speed = script.getNumberField('SPEED');

                    if (port == 'ALL') {
                        switch (direction) {
                            case 1:
                            Entry.hw.sendQueue['OUT1'] = 0xBC;
                            Entry.hw.sendQueue['OUT2'] = 0xBC;
                            break;
                            case 2:
                            Entry.hw.sendQueue['OUT1'] = 0xBD;
                            Entry.hw.sendQueue['OUT2'] = 0xBD;
                            break;
                        }
                        
                        script.isStart = true;
                        script.timeFlag = 1;
                        setTimeout(function() { // for speed
                            Entry.hw.sendQueue['OUT1'] = 0xFA - speed;
                            Entry.hw.sendQueue['OUT2'] = 0xFA - speed;
                            setTimeout(function() { // for degree
                                if(degree > 180) {
                                    degree = 180;
                                }
                                if (degree < 0){
                                    degree = 0;
                                }
                                degree = degree + 0x01;
                                degree *= 1;
                                Entry.hw.sendQueue['OUT1'] = degree;
                                Entry.hw.sendQueue['OUT2'] = degree;
                                script.timeFlag = 0;
                            }, 200);
                        }, 200);
                    } else {
                        switch (direction) {
                            case 1:
                            Entry.hw.sendQueue[port] = 0xBC;
                            break;
                            case 2:
                            Entry.hw.sendQueue[port] = 0xBD;
                            break;
                        }
                        
                        script.isStart = true;
                        script.timeFlag = 1;
                        setTimeout(function() { // for speed
                            Entry.hw.sendQueue[port] = 0xFA - speed;
                            setTimeout(function() { // for degree
                                if(degree > 180) {
                                    degree = 180;
                                }
                                if (degree < 0){
                                    degree = 0;
                                }
                                degree = degree + 0x01;
                                degree *= 1;
                                Entry.hw.sendQueue[port] = degree;
                                script.timeFlag = 0;
                            }, 200);
                        }, 200);    
                    }
                    
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
        },
        neobot_servo_rotate: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['OUT1', 'OUT1'], ['OUT2', 'OUT2'], ['OUT1&2', 'ALL']],
                    value: 'OUT1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_servo_dir_1, '1'],
                        [Lang.Blocks.neobot_servo_dir_2, '2'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_percent_10, '0'],
                        [Lang.Blocks.neobot_percent_20, '1'],
                        [Lang.Blocks.neobot_percent_30, '2'],
                        [Lang.Blocks.neobot_percent_40, '3'],
                        [Lang.Blocks.neobot_percent_50, '4'],
                        [Lang.Blocks.neobot_percent_60, '5'],
                        [Lang.Blocks.neobot_percent_70, '6'],
                        [Lang.Blocks.neobot_percent_80, '7'],
                        [Lang.Blocks.neobot_percent_90, '8'],
                        [Lang.Blocks.neobot_percent_100, '9'],
                    ],
                    value: '9',
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
                    null,
                    null,
                ],
                type: 'neobot_servo_rotate',
            },
            paramsKeyMap: {
                PORT: 0,
                DIRECTION: 1,
                SPEED: 2
            },
            class: 'neobot_servo',
            isNotFor: ['neobot'],
            func: function(sprite, script) {
                var port = script.getStringField('PORT', script);
                var direction = script.getNumberField('DIRECTION');
                var speed = script.getNumberField('SPEED');
                
                if (port == 'ALL') {
                    switch (direction) {
                        case 1:
                        Entry.hw.sendQueue['OUT1'] = 0xC0 + (speed + 0x01);
                        Entry.hw.sendQueue['OUT2'] = 0xC0 + (speed + 0x01);
                        break;
                        case 2:
                        Entry.hw.sendQueue['OUT1'] = 0xD0 + (speed + 0x01);
                        Entry.hw.sendQueue['OUT2'] = 0xD0 + (speed + 0x01);
                        break;
                    }
                } else {
                    switch (direction) {
                        case 1:
                        Entry.hw.sendQueue[port] = 0xC0 + (speed + 0x01);
                        break;
                        case 2:
                        Entry.hw.sendQueue[port] = 0xD0 + (speed + 0x01);
                        break;
                    }
                }
                return script.callReturn();
            },
        },
        neobot_servo_stop: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['OUT1', 'OUT1'], ['OUT2', 'OUT2'], ['OUT1&2', 'ALL']],
                    value: 'OUT1',
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
                type: 'neobot_servo_stop',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'neobot_servo',
            isNotFor: ['neobot'],
            func: function(sprite, script) {
                var port = script.getStringField('PORT', script);
                if (port == 'ALL') {
                    Entry.hw.sendQueue['OUT1'] = 0xFE;
                    Entry.hw.sendQueue['OUT2'] = 0xFE;
                } else {
                    Entry.hw.sendQueue[port] = 0xFE;
                }
                return script.callReturn();
            },
        },

      /*   // deprecated by cky 191205
        neobot_servo_turn_type1: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['OUT1', 'OUT1'], ['OUT2', 'OUT2'], ['OUT3', 'OUT3']],
                    value: 'OUT1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_servo_dir_1, '1'],
                        [Lang.Blocks.neobot_servo_dir_2, '2'],
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
                    180,
                    null,
                ],
                type: 'neobot_servo_turn_type1',
            },
            paramsKeyMap: {
                PORT: 0,
                DIRECTION: 1,
                DEGREE: 2
            },
            class: 'neobot_servo',
            isNotFor: ['neobot'],
            func: function(sprite, script) {
                if (!script.isStart) {
                    var port = script.getStringField('PORT', script);
                    var direction = script.getNumberField('DIRECTION');
                    var value = script.getNumberValue('DEGREE');
                    
                    switch (direction) {
                        case 1:
                        Entry.hw.sendQueue[port] = 0xBC;
                        break;
                        case 2:
                        Entry.hw.sendQueue[port] = 0xBD;
                        break;
                    }
                    
                    script.isStart = true;
                    script.timeFlag = 1;
                    setTimeout(function() {
                        if(value > 180) {
                            value = 180;
                        }
                        if (value < 0){
                            value = 0;
                        }
                        value = value + 1;
                        Entry.hw.sendQueue[port] = value;
                        setTimeout(function() {
                            script.timeFlag = 0;
                        }, 1000);
                    }, 200);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
        },
        // deprecated by cky 191205
        neobot_servo_turn_type2: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['OUT1', 'OUT1'], ['OUT2', 'OUT2'], ['OUT3', 'OUT3']],
                    value: 'OUT1',
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
                    180,
                    null,
                ],
                type: 'neobot_servo_turn_type2',
            },
            paramsKeyMap: {
                PORT: 0,
                DEGREE: 1
            },
            class: 'neobot_servo',
            isNotFor: ['neobot'],
            func: function(sprite, script) {
                if (!script.isStart) {
                    var port = script.getStringField('PORT', script);
                    var value = script.getNumberValue('DEGREE');
                    
                    if(value > 0xB4) {
                        value = 0xB4;
                    }
                    if (value < 0x00){
                        value = 0x00;
                    }
                    value = value + 0x01;
                    Entry.hw.sendQueue[port] = value;
                    script.isStart = true;
                    script.timeFlag = 1;
                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, 200);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
        },

        // deprecated by cky 191205
        neobot_servo_turn_type4: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['OUT1', 'OUT1'], ['OUT2', 'OUT2'], ['OUT3', 'OUT3']],
                    value: 'OUT1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['100%', '0'],
                        ['90%', '1'],
                        ['80%', '2'],
                        ['70%', '3'],
                        ['60%', '4'],
                        ['50%', '5'],
                        ['40%', '6'],
                        ['30%', '7'],
                        ['20%', '8'],
                        ['10%', '9'],
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
                    null,
                ],
                type: 'neobot_servo_turn_type4',
            },
            paramsKeyMap: {
                PORT: 0,
                LEVEL: 1,
            },
            class: 'neobot_servo',
            isNotFor: ['neobot'],
            func: function(sprite, script) {
                if (!script.isStart) {
                    var port = script.getStringField('PORT', script);
                    var level = script.getNumberField('LEVEL');
                    Entry.hw.sendQueue[port] = 0xFA - level;
                    script.isStart = true;
                    script.timeFlag = 1;
                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, 200);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
        },

        // deprecated by cky 191205
        neobot_servo_turn_type5: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['OUT1', 'OUT1'], ['OUT2', 'OUT2'], ['OUT3', 'OUT3']],
                    value: 'OUT1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_servo_dir_1, '1'],
                        [Lang.Blocks.neobot_servo_dir_2, '2'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['100%', '0'],
                        ['90%', '1'],
                        ['80%', '2'],
                        ['70%', '3'],
                        ['60%', '4'],
                        ['50%', '5'],
                        ['40%', '6'],
                        ['30%', '7'],
                        ['20%', '8'],
                        ['10%', '9'],
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
                    null,
                    null,
                ],
                type: 'neobot_servo_turn_type5',
            },
            paramsKeyMap: {
                PORT: 0,
                DIRECTION: 1,
                LEVEL: 2,
            },
            class: 'neobot_servo',
            isNotFor: ['neobot'],
            func: function(sprite, script) {
                if (!script.isStart) {
                    var port = script.getStringField('PORT', script);
                    var direction = script.getNumberField('DIRECTION');
                    var level = script.getNumberField('LEVEL');
    
                    switch (direction) {
                        case 1:
                            Entry.hw.sendQueue[port] = 0xCA - level;
                            break;
                        case 2:
                            Entry.hw.sendQueue[port] = 0xDA - level;
                            break;
                    }
                    
                    script.isStart = true;
                    script.timeFlag = 1;
                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, 200);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
        },

        // deprecated by cky 191205
        neobot_servo_mode_manual: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['OUT1', 'OUT1'], ['OUT2', 'OUT2'], ['OUT3', 'OUT3']],
                    value: 'OUT1',
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
                type: 'neobot_servo_mode_manual',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'neobot_servo',
            isNotFor: ['neobot'],
            func: function(sprite, script) {
                if (!script.isStart) {
                    var port = script.getStringField('PORT', script);
                    
                    Entry.hw.sendQueue[port] = 0x00;
                    script.isStart = true;
                    script.timeFlag = 1;
                    setTimeout(function() {
                        timeFlag = 0;
                    }, 200);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
        }, */

        //endregion neobot 네오봇
    };
};

module.exports = Entry.Neobot;
