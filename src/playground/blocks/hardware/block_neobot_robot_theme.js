
Entry.NeobotRobotTheme = {
    id: '5.3',
    name: 'neobot_robot_theme',
    url: 'http://www.neobot.co.kr',
    imageName: 'neobot_robot_theme.png',
    title: {
        en: 'NEOBOT Robot Theme',
        ko: '네오봇 로봇 테마',
    },
    LOCAL_MAP: ['IN1', 'IN2', 'IN3', 'IR', 'IN4'],
    REMOTE_MAP: ['OUT1', 'OUT2', 'OUT3', 'DCL', 'DCR', 'SND', 'LED', 'OPT'],
    setZero: function() {
        for (var port in Entry.NeobotRobotTheme.REMOTE_MAP) {
            if (port == 3 || port == 4) {
                // set motor values as 100. means stopping motors.
                Entry.hw.sendQueue[Entry.NeobotRobotTheme.REMOTE_MAP[port]] = 100;
            } else {
                Entry.hw.sendQueue[Entry.NeobotRobotTheme.REMOTE_MAP[port]] = 0;
            }
        }
        Entry.hw.update();
    },
    monitorTemplate: {
        imgPath: 'hw/neobot_robot_theme.png',
        width: 800,
        height: 800,
        listPorts: {},
        ports: {
            IN1: { name: 'PORT1', type: 'input', pos: { x: 145, y: 100 } },
            IN2: { name: 'PORT2', type: 'input', pos: { x: 314, y: 100 } },
            IN3: { name: 'PORT3', type: 'input', pos: { x: 484, y: 100 } },
            IN4: { name: 'PORT4', type: 'input', pos: { x: 653, y: 100 } },
        },
        mode: 'both',
    },
};

Entry.NeobotRobotTheme.setLanguage = function() {
    return {
        ko: {
            template: {
                neobot_port_value: '%1값',
                neobot_ir_sensor_value: '적외선센서값',
                neobot_light_sensor_value: '빛센서값',
                neobot_sound_sensor_value: '소리센서값',
                neobot_top_sensor_value: '윗면센서값',
                neobot_bottom_sensor_value: '바닥면센서값',

                neobot_led_on_type1: 'LED를 %1 밝기로 켜기 %2',
                neobot_led_on_type2: 'LED를 %1 밝기로 %2 초 켠 후 끄기 %3',
                neobot_led_off: 'LED 끄기 %1',
                neobot_led_on_type3: '%1에 연결한 LED를 %2 밝기로 켜기 %3',
                neobot_led_on_type4: '%1에 연결한 LED를 %2 밝기로 %3초 켠 후 끄기 %4',
                neobot_led_off_type1:'%1에 연결한 LED 끄기 %2',
                
                neobot_output_type1: '%1에 연결한 외부포트에 %2만큼 출력하기 %3',

                neobot_motor_type1: '%1 모터를 %2 의 속도로 %3초 회전 후 정지 %4',
                neobot_motor_type2: '모터를 %1 %2 의 속도로 회전 %3',
                neobot_motor_type3: '%1 모터를 %2 의 속도로 회전 %3',
                neobot_motor_stop: '%1 모터 정지 %2',
                neobot_motor_type_select: '로봇 %1 %2',
                neobot_motor_type_stop: "로봇 정지 %1",

                neobot_ir_decision: '적외선센서 작동 (기준 값: %1)',
                neobot_light_decision: '빛센서 작동 (기준 값: %1)',
                neobot_sound_decision: '소리센서 작동 (기준 값: %1)',
                neobot_port_decision: ' %1 작동 (기준 값: %2)',
                neobot_top_decision: '윗면센서 작동 (기준 값: %1)',
                neobot_bottom_decision: '바닥면센서 작동 (기준 값: %1)',
                neobot_remote_decision : "무선리모컨의 %1 버튼을 누름",

                neobot_servo_init: '%1의 Servo모터를 현재 위치로 초기화하기 %2',
                neobot_servo_turn_type1: '%1의 Servo모터를 %2으로 %3도 회전하기 %4',
                neobot_servo_turn_type2: '%1의 Servo모터를 %2도 회전하기 %3',
                neobot_servo_turn_type3: '%1 Servo모터의 각도 회전방향 바꾸기(시계방향↔반시계방향) %2',
                neobot_servo_turn_type4: '%1 Servo모터의 각도 회전속도를 %2로 정하기 %3',
                neobot_servo_turn_type5: '%1의 Servo모터를 %2 %3 빠르기로 계속 회전하기 %4',
                neobot_servo_mode_manual: '%1의 Servo모터를 수동 제어모드로 바꾸기 %2',
                neobot_servo_stop: '%1의 Servo모터 멈추기 %2',

                neobot_led: '%1',
                neobot_time: '%1',
                neobot_time2: '%1',
                neobot_speed: '%1',
                neobot_speed2: '%1',
                neobot_surface: '%1',
            },
            Blocks: {
                neobot_port_1: '1번 포트',
                neobot_port_2: '2번 포트',
                neobot_port_3: '3번 포트',
                neobot_port_4: '4번 포트',
                neobot_port_top: '윗면 포트',
                neobot_port_bottom: '바닥면 포트',

                neobot_top_face: '윗면',
                neobot_bottom_face: '바닥면',

                neobot_motor_both: '양쪽',
                neobot_motor_left: '왼쪽',
                neobot_motor_right: '오른쪽',

                neobot_motor_dir_front: '앞으로',
                neobot_motor_dir_rear: '뒤로',
                neobot_motor_dir_left: '왼쪽으로',
                neobot_motor_dir_right: '오른쪽으로',
                neobot_motor_dir_stand_left: '제자리에서 왼쪽으로',
                neobot_motor_dir_stand_right: '제자리에서 오른쪽으로',

                neobot_motor_move_forward: '전진',
                neobot_motor_move_backward: '후진',
                neobot_motor_move_left: '좌회전',
                neobot_motor_move_right: '우회전',
                neobot_motor_move_stop: '정지',

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

                neobot_servo_dir_1: '시계방향',
                neobot_servo_dir_2: '반시계방향',
            },
        },
        en: {
            template: {
                neobot_port_value: '%1 value',
                neobot_ir_sensor_value: 'Infrared Sensor Value',
                neobot_light_sensor_value: 'Light Sensor value',
                neobot_sound_sensor_value: 'Sound Sensor value',
                neobot_top_sensor_value: 'Upper Sensor value',
                neobot_bottom_sensor_value: 'Bottom Sensor value',

                neobot_led_on_type1: 'Turn on the LED with %1 brightness %2',
                neobot_led_on_type2: 'Turn on the LED with %1 brightness for %2 seconds %3',
                neobot_led_off: 'Turn off the LED %1',
                neobot_led_on_type3: 'Turn on the LED on %1 with %2 briteness %3',
                neobot_led_on_type4: 'Turn on the LED on %1 with %2 briteness for %3 seconds %4',
                neobot_led_off_type1:'Turn off the LED on %1 %2',

                neobot_output_type1: "Output %2 to the external port connected to the %1 %3",

                neobot_motor_type1: "Move %1 motor ('s) at a speed of %2 for %3 seconds %4",
                neobot_motor_type2: "Move motor ('s) in a %1 direction at a speed of %2 %3",
                neobot_motor_type3: "Move %1 ('s) at a speed of %2 %3",
                neobot_motor_stop: "Stop %1 motor('s) %2",
                neobot_motor_type_select: "Go robot %1 %2",
                neobot_motor_type_stop: "Stop robot %1",

                neobot_ir_decision: 'IR Sensor detected (value: %1)',
                neobot_light_decision: 'Light Sensor detected (value: %1)',
                neobot_sound_decision: 'Sound Sensor detected (value: %1)',
                neobot_port_decision: ' %1 detected (value: %2)',
                neobot_top_decision: 'Top face Sensor detected (value: %1)',
                neobot_bottom_decision: 'Bottom face Sensor detected (value: %1)',
                neobot_remote_decision : 'Press %1 button on the remote control',
                
                // TODO
                neobot_servo_init: '%1의 Servo모터를 현재 위치로 초기화하기 %2',
                neobot_servo_turn_type1: '%1의 Servo모터를 %2으로 %3도 회전하기 %4',
                neobot_servo_turn_type2: '%1의 Servo모터를 %2도 회전하기 %3',
                neobot_servo_turn_type3: '%1 Servo모터의 각도 회전방향 바꾸기(시계방향↔반시계방향) %2',
                neobot_servo_turn_type4: '%1 Servo모터의 각도 회전속도를 %2로 정하기 %3',
                neobot_servo_turn_type5: '%1의 Servo모터를 %2 %3 빠르기로 계속 회전하기 %4',
                neobot_servo_mode_manual: '%1의 Servo모터를 수동 제어모드로 바꾸기 %2',
                neobot_servo_stop: '%1의 Servo모터 멈추기 %2',

                neobot_led: '%1',
                neobot_time: '%1',
                neobot_time2: '%1',
                neobot_speed: '%1',
                neobot_speed2: '%1',
                neobot_surface: '%1',
            },
            Blocks: {
                //for dropdown
                neobot_port_1: 'Port 1',
                neobot_port_2: 'Port 2',
                neobot_port_3: 'Port 3',
                neobot_port_4: 'Port 4',
                neobot_port_top: 'Port TOP',
                neobot_port_bottom: 'Port BOTTOM',

                neobot_top_face: 'Top face',
                neobot_bottom_face: 'Bottom face',

                neobot_motor_both: 'Both',
                neobot_motor_left: 'Left',
                neobot_motor_right: 'Right',

                neobot_motor_dir_front: 'Forward',
                neobot_motor_dir_rear: 'Backward',
                neobot_motor_dir_left: 'Left',
                neobot_motor_dir_right: 'Right',
                neobot_motor_dir_stand_left: 'Left in place',
                neobot_motor_dir_stand_right: 'Right in place',

                neobot_motor_move_forward: 'Go forward',
                neobot_motor_move_backward: 'Go backward',
                neobot_motor_move_left: 'Turn Left',
                neobot_motor_move_right: 'Turn Right',
                neobot_motor_move_stop: 'Stop',

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

                neobot_servo_dir_1: 'Clockwise',
                neobot_servo_dir_2: 'Counterclockwise',
            },
        }, 
    };
};

Entry.NeobotRobotTheme.blockMenuBlocks = [
    /* 
        class order : sensor - motor - decision - remote - led - servo
    */
    // class sensor
    'neobot_port_value',
    'neobot_ir_sensor_value',
    'neobot_light_sensor_value',
    'neobot_sound_sensor_value',
    'neobot_top_sensor_value',
    'neobot_bottom_sensor_value',
    // class motor
    'neobot_motor_type1',
    'neobot_motor_type2',
    'neobot_motor_type3',
    'neobot_motor_stop',
    'neobot_motor_type_select',
    'neobot_motor_type_stop',
    // class decision
    'neobot_ir_decision',
    'neobot_light_decision',
    'neobot_sound_decision',
    'neobot_top_decision',
    'neobot_bottom_decision',
    'neobot_port_decision',
    // class remote
    'neobot_remote_decision',
    // class led
    'neobot_led_on_type1',
    'neobot_led_on_type2',
    'neobot_led_off',
    'neobot_led_on_type3',
    'neobot_led_on_type4',
    'neobot_led_off_type1',
    'neobot_output_type1',
    // class servo
    'neobot_servo_init',
    'neobot_servo_turn_type1',
    'neobot_servo_turn_type2',
    'neobot_servo_turn_type3',
    'neobot_servo_turn_type4',
    'neobot_servo_turn_type5',
    'neobot_servo_mode_manual',
    'neobot_servo_stop',
];

// macro function
function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}


Entry.NeobotRobotTheme.getBlocks = function() {
    return {
        // class sensor
        neobot_port_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
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
                        [Lang.Blocks.neobot_port_top, 'TOP'],
                        [Lang.Blocks.neobot_port_bottom, 'BOTTOM'],
                    ],
                    value: 'IN1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                if(port == 'TOP') {
                    port = 'IN1';
                }
                if(port == 'BOTTOM') {
                    port = 'IN2';
                }
                return Entry.hw.portData[port];
            },
        },

        neobot_ir_sensor_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#FFFFFF',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            def: {
                params: [null],
                type: 'neobot_ir_sensor_value',
            },
            paramsKeyMap: {},
            events: {},
            class: 'sensor',
            isNotFor: ['neobot_robot_theme'],
            func: function(sprite, script) {
                var sensor1 = Entry.hw.portData['IN1'];
                var sensor2 = Entry.hw.portData['IN2'];
                return sensor1 >= sensor2 ? sensor1 : sensor2;
            },
        },

        neobot_light_sensor_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#FFFFFF',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            def: {
                params: [null],
                type: 'neobot_light_sensor_value',
            },
            paramsKeyMap: {},
            events: {},
            class: 'sensor',
            isNotFor: ['neobot_robot_theme'],
            func: function(sprite, script) {
                return Entry.hw.portData['IN3'];
            },
        },

        neobot_sound_sensor_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#FFFFFF',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            def: {
                params: [null],
                type: 'neobot_sound_sensor_value',
            },
            paramsKeyMap: {},
            events: {},
            class: 'sensor',
            isNotFor: ['neobot_robot_theme'],
            func: function(sprite, script) {
                return Entry.hw.portData['IN4'];
            },
        },

        neobot_top_sensor_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#FFFFFF',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            def: {
                params: [null],
                type: 'neobot_top_sensor_value',
            },
            paramsKeyMap: {},
            events: {},
            class: 'sensor',
            isNotFor: ['neobot_robot_theme'],
            func: function(sprite, script) {
                return Entry.hw.portData['IN1'];
            },
        },

        neobot_bottom_sensor_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#FFFFFF',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            def: {
                params: [null],
                type: 'neobot_bottom_sensor_value',
            },
            paramsKeyMap: {},
            events: {},
            class: 'sensor',
            isNotFor: ['neobot_robot_theme'],
            func: function(sprite, script) {
                return Entry.hw.portData['IN2'];
            },
        },

        // class motor
        neobot_speed: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
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
                    value: '+50',
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
        },
        neobot_speed2: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['100', '100'],
                        ['90', '90'],
                        ['80', '80'],
                        ['70', '70'],
                        ['60', '60'],
                        ['50', '50'],
                        ['40', '40'],
                        ['30', '30'],
                        ['20', '20'],
                        ['10', '10'],
                    ],
                    value: '100',
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
        },
        neobot_time: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
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
                VALUE: 0,
            },
            func: function(sprite, script) {
                return script.getStringField('VALUE');
            },
        },
        neobot_time2: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
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
                VALUE: 0,
            },
            func: function(sprite, script) {
                return script.getStringField('VALUE');
            },
        },
        neobot_motor_type1: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
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
                    '1',
                    {
                        type: 'neobot_speed',
                        id: 'm41',
                    },
                    {
                        type: 'neobot_time',
                        id: 'm21',
                    },
                    null,
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
                    var speed = Entry.parseNumber(script.getNumberValue('SPEED'));
                    var motor = script.getNumberField('MOTOR');
                    var duration = script.getNumberValue('DURATION');

                    if (speed > 100) {
                        speed = 100;
                    } else if (speed < -100) {
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
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
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
                    '1',
                    {
                        type: 'neobot_speed2',
                        id: 'm51',
                    },
                    null,
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

                if (speed > 100) {
                    speed = 100;
                } else if (speed < -100) {
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
                        Entry.hw.sendQueue['DCL'] = 100;
                        Entry.hw.sendQueue['DCR'] = speed + 100;
                        break;
                    case 4: // right
                        Entry.hw.sendQueue['DCL'] = speed + 100;
                        Entry.hw.sendQueue['DCR'] = 100;
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
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
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
                    '1',
                    {
                        type: 'neobot_port_value',
                        id: 'm500',
                    },
                    null,
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

                if (speed > 100) {
                    speed = 100;
                } else if (speed < -100) {
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

        neobot_motor_type_select: {
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
                type: 'neobot_motor_type_select',
            },
            paramsKeyMap: {
                MOVE: 0,
            },
            class: 'motor',
            isNotFor: ['neobot_robot_theme'],
            func: function(sprite, script) {
                var move = script.getNumberField('MOVE');
                switch (move) {
                    case 1:
                        Entry.hw.sendQueue['DCL'] = 100 + 100;
                        Entry.hw.sendQueue['DCR'] = 100 + 100;
                        break;
                    case 2:
                        Entry.hw.sendQueue['DCL'] = 100 - 100;
                        Entry.hw.sendQueue['DCR'] = 100 - 100;
                        break;
                    case 3:
                        Entry.hw.sendQueue['DCL'] = 100 - 100;
                        Entry.hw.sendQueue['DCR'] = 100 + 100;
                        break;
                    case 4:
                        Entry.hw.sendQueue['DCL'] = 100 + 100;
                        Entry.hw.sendQueue['DCR'] = 100 - 100;
                        break;
                }
                return script.callReturn();
            },
        },

        neobot_motor_type_stop: {
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
                type: 'neobot_motor_type_stop',
            },
            paramsKeyMap: {},
            class: 'motor',
            isNotFor: ['neobot_robot_theme'],
            func: function(sprite, script) {
                Entry.hw.sendQueue['DCL'] = 100;
                Entry.hw.sendQueue['DCR'] = 100;
                return script.callReturn();
            },
        },

        neobot_motor_stop: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
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
                    null,
                ],
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
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
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
        },

        neobot_surface: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_top_face, '1'],
                        [Lang.Blocks.neobot_bottom_face, '2'],
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
                return script.getStringField('VALUE');
            },
        },

        neobot_led_on_type1: {
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
                        type: 'neobot_led',
                        id: 'm16',
                    },
                    null,
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
                if (value > 100) {
                    value = 100;
                } else if (value < 0) {
                    value = 0;
                }
                Entry.hw.sendQueue['LED'] = value;
                return script.callReturn();
            },
        },

        neobot_led_on_type2: {
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
                        type: 'neobot_led',
                        id: 'm12',
                    },
                    {
                        type: 'neobot_time2',
                        id: 'm31',
                    },
                    null,
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

                    if (value > 100) {
                        value = 100;
                    } else if (value < 0) {
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

        neobot_led_on_type3: {
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
                        type: 'neobot_surface',
                        id: 'm61',
                    },
                    {
                        type: 'neobot_led',
                        id: 'm13',
                    },
                    null,
                ],
                type: 'neobot_led_on_type3',
            },
            paramsKeyMap: {
                SURFACE: 0,
                VALUE: 1,
            },
            class: 'led',
            isNotFor: ['neobot_robot_theme'],
            func: function(sprite, script) {
                var surface = script.getNumberField('SURFACE');
                var value = script.getNumberValue('VALUE');

                if (value > 100) {
                    value = 100;
                } else if (value < 0) {
                    value = 0;
                }
                    
                switch (surface) {
                    case 1:
                        Entry.hw.sendQueue['OUT1'] = value;
                    break;
                    case 2:
                        Entry.hw.sendQueue['OUT2'] = value;
                    break;
                }
            },
        },

        neobot_led_on_type4: {
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'neobot_surface',
                        id: 'm62',
                    },
                    {
                        type: 'neobot_led',
                        id: 'm14',
                    },
                    {
                        type: 'neobot_time2',
                        id: 'm32',
                    },
                    null,
                ],
                type: 'neobot_led_on_type4',
            },
            paramsKeyMap: {
                SURFACE: 0,
                VALUE: 1,
                DURATION: 2,
            },
            class: 'led',
            isNotFor: ['neobot_robot_theme'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;

                if (!script.isStart) {
                    var surface = script.getNumberField('SURFACE');
                    var value = script.getNumberValue('VALUE');
                    var duration = script.getNumberValue('DURATION');

                    if (value > 100) {
                        value = 100;
                    } else if (value < 0) {
                        value = 0;
                    }
                    
                    if (duration < 0) {
                        duration = 0;
                    }

                    switch (surface) {
                        case 1:
                            Entry.hw.sendQueue['OUT1'] = value;
                            break;
                        case 2:
                            Entry.hw.sendQueue['OUT2'] = value;
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
                    switch (surface) {
                        case 1:
                            Entry.hw.sendQueue['OUT1'] = 0;
                            break;
                        case 2:
                            Entry.hw.sendQueue['OUT2'] = 0;
                            break;
                    }
                    
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
        },

        neobot_led_off_type1: {
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
                        type: 'neobot_surface',
                        id: 'm63',
                    },
                    null,
                ],
                type: 'neobot_led_off_type1',
            },
            paramsKeyMap: {
                SURFACE: 0,
            },
            class: 'led',
            isNotFor: ['neobot_robot_theme'],
            func: function(sprite, script) {
                var surface = script.getNumberField('SURFACE');
                switch (surface) {
                    case 1:
                        Entry.hw.sendQueue['OUT1'] = 0;
                        break;
                    case 2:
                        Entry.hw.sendQueue['OUT2'] = 0;
                        break;
                }
                return script.callReturn();
            },
        },

        neobot_output_type1 : {
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
                        type: 'neobot_surface',
                        id: 'm64',
                    },
                    100,
                    null,
                ],
                type: 'neobot_output_type1',
            },
            paramsKeyMap: {
                SURFACE: 0,
                VALUE: 1,
            },
            class: 'led',
            isNotFor: ['neobot_robot_theme'],
            func: function(sprite, script) {
                var surface = script.getNumberField('SURFACE');
                var value = script.getNumberValue('VALUE');
                
                if(value > 255) {
                    value = 255;
                }
                if(value < 0) {
                    value = 0;
                }

                switch (surface) {
                    case 1:
                        Entry.hw.sendQueue['OUT1'] = value;
                    break;
                    case 2:
                        Entry.hw.sendQueue['OUT2'] = value;
                    break;
                }
            },
        },

        // class decision
        neobot_ir_decision: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
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
                params: [null],
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
                var sensor = sensor1 >= sensor2 ? sensor1 : sensor2;

                if (sensor >= value) {
                    return true;
                } else {
                    return false;
                }
            },
        },
        neobot_light_decision: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
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
                params: [null],
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

                if (sensor >= value) {
                    return true;
                } else {
                    return false;
                }
            },
        },

        neobot_sound_decision: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
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
                params: [null],
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

                if (sensor >= value) {
                    return true;
                } else {
                    return false;
                }
            },
        },

        neobot_top_decision: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
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
                params: [null],
                type: 'neobot_top_decision',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'decision',
            isNotFor: ['neobot_robot_theme'],
            func: function(sprite, script) {
                var value = script.getNumberValue('VALUE');
                var sensor = Entry.hw.portData['IN1'];

                if (sensor >= value) {
                    return true;
                } else {
                    return false;
                }
            },
        },

        neobot_bottom_decision: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
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
                params: [null],
                type: 'neobot_bottom_decision',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'decision',
            isNotFor: ['neobot_robot_theme'],
            func: function(sprite, script) {
                var value = script.getNumberValue('VALUE');
                var sensor = Entry.hw.portData['IN2'];

                if (sensor >= value) {
                    return true;
                } else {
                    return false;
                }
            },
        },

        neobot_port_decision: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
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
                        [Lang.Blocks.neobot_port_top, 'TOP'],
                        [Lang.Blocks.neobot_port_bottom, 'BOTTOM'],
                    ],
                    value: 'IN1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    value: '10',
                },
            ],
            events: {},
            def: {
                params: [
                    'IN1',
                    '10',
                    null,
                ],
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
                // change port from TOP/BOTTOM face to IN1/IN2.
                if(port == 'TOP') {
                    port = 'IN1';
                }
                if(port == 'BOTTOM') {
                    port = 'IN2';
                }

                var sensor = Entry.hw.portData[port];
                var value = script.getNumberValue('VALUE');

                if (sensor >= value) {
                    return true;
                } else {
                    return false;
                }
            },
        },

        // class remote
        neobot_remote_decision: {
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
                type: 'neobot_remote_decision',
            },
            paramsKeyMap: {
                KEY: 0,
            },
            class: 'remote',
            isNotFor: ['neobot_robot_theme'],
            func: function(sprite, script) {
                var key = script.getNumberField('KEY');
                var value = Entry.hw.portData['IR'];
                if(key == value){
                    return true;
                } else {
                    return false;
                }
            },
        },

        // class servo
        neobot_servo_init: {
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
                type: 'neobot_servo_init',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'servo',
            isNotFor: ['neobot_robot_theme'],
            func: function(sprite, script) {
                if (!script.isStart) {
                    var port = script.getStringField('PORT', script);
                    Entry.hw.sendQueue[port] = 0xBA;
                    
                    script.isStart = true;
                    script.timeFlag = 1;
                    setTimeout(function() {
                        Entry.hw.sendQueue[port] = 0x01;
                        setTimeout(function() {
                            script.timeFlag = 0;
                        }, 200);
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
            class: 'servo',
            isNotFor: ['neobot_robot_theme'],
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
            class: 'servo',
            isNotFor: ['neobot_robot_theme'],
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
                    }, 1000);
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

        neobot_servo_turn_type3: {
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
                type: 'neobot_servo_turn_type3',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'servo',
            isNotFor: ['neobot_robot_theme'],
            func: function(sprite, script) {
                if (!script.isStart) {
                    var port = script.getStringField('PORT', script);
                    
                    Entry.hw.sendQueue[port] = 0xBB;
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
            class: 'servo',
            isNotFor: ['neobot_robot_theme'],
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
            class: 'servo',
            isNotFor: ['neobot_robot_theme'],
            func: function(sprite, script) {
                if (!script.isStart) {
                    var port = script.getStringField('PORT', script);
                    var direction = script.getNumberField('DIRECTION');
                    var level = script.getNumberField('LEVEL');
    
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
                        Entry.hw.sendQueue[port] = 0xFA - level;
                        setTimeout(function() {
                            script.timeFlag = 0;
                        }, 200);
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
            class: 'servo',
            isNotFor: ['neobot_robot_theme'],
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
        },

        neobot_servo_stop: {
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
                type: 'neobot_servo_stop',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'servo',
            isNotFor: ['neobot_robot_theme'],
            func: function(sprite, script) {
                if (!script.isStart) {
                    var port = script.getStringField('PORT', script);
                    
                    Entry.hw.sendQueue[port] = 0xFE;
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
        },
        // end neobot robot theme region
    };
};

module.exports = Entry.NeobotRobotTheme;
