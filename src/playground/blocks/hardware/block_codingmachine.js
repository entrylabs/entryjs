'use strict';
Entry.Codingmachine = {
    id: '26.1',
    name: 'Codingmachine',
    url: 'http://wonn.co.kr/',
    imageName: 'codingmachine.png', //thumbnail
    title: {
        ko: '코딩머신',
        en: 'Codingmachine',
    },
    Cmd: {
        LED: 1,
        TUNE: 2,
        TUNEDUR: 3,
        ROLL: 4,
        PITCH: 5,
        YAW: 6,
        THROTTLE: 7,
        OPTION: 8,
        MOTOR0: 9,
        MOTOR1: 10,
        MOTOR2: 11,
        MOTOR3: 12,
        DIGITAL_OUT1: 13,
        DIGITAL_OUT2: 14,
        DIGITAL_OUT3: 15,
        DIGITAL_PWM: 16,
        SERVOPORT: 17,
        SERVODGREE: 18,
    },
    Sensor: {
        JOYSTICK_LLR: 1,
        JOYSTICK_LTB: 2,
        JOYSTICK_RLR: 3,
        JOYSTICK_RTB: 4,
        BUTTON: 5,
        DRONECONNECT: 6,
        ULTRASONIC: 7,
        GYRO_X: 8,
        GYRO_Y: 9,
        DRONEREADY: 10,
        /*추가*/
        DIGITAL_IN1: 11,
        DIGITAL_IN2: 12,
        ANALOG_A4: 13,
        ANALOG_A5: 14,
        /*추가*/
    },
    setZero: function() {
        Entry.hw.sendQueue.CMD = [
            0xf0,
            0x00,
            0x00,
            0x00,
            0x64,
            0x64,
            0x64,
            0x00,
            0x00,
            0x00,
            0x00,
            0x00,
            0x00,
            /* -------- 추가 ------- */
            0x00,
            0x00,
            0x00,
            0x00,
            0x00,
            0x00,
            0x00,
            /* -------- 추가 ------- */
        ];
        Entry.hw.update();
    },
    monitorTemplate: {
        imgPath: 'hw/coconut.png',
        width: 256,
        height: 256,
        listPorts: {
            'CMD[1]': {
                name: Lang.Blocks.coconut_sensor_temperature,
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
            accelerationX: {
                name: Lang.Blocks.coconut_sensor_acceleration_x,
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
            accelerationY: {
                name: Lang.Blocks.coconut_sensor_acceleration_y,
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
            accelerationZ: {
                name: Lang.Blocks.coconut_sensor_acceleration_z,
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
        },
        ports: {
            leftProximityValue: {
                name: Lang.Blocks.coconut_sensor_left_proximity,
                type: 'input',
                pos: {
                    x: 122,
                    y: 156,
                },
            },
            rightProximityValue: {
                name: Lang.Blocks.coconut_sensor_right_proximity,
                type: 'input',
                pos: {
                    x: 10,
                    y: 108,
                },
            },
            leftFloorValue: {
                name: Lang.Blocks.coconut_sensor_left_floor,
                type: 'input',
                pos: {
                    x: 100,
                    y: 234,
                },
            },
            rightFloorValue: {
                name: Lang.Blocks.coconut_sensor_right_floor,
                type: 'input',
                pos: {
                    x: 13,
                    y: 180,
                },
            },
            light: {
                name: Lang.Blocks.coconut_sensor_light,
                type: 'input',
                pos: {
                    x: 56,
                    y: 189,
                },
            },
        },
        mode: 'both',
    },
};
Entry.Codingmachine.setLanguage = function() {
    return {
        ko: {
            template: {
                codingmachine_altitude: '드론을 %1 높이만큼 날리기 %2',
                codingmachine_button: '%1번 버튼 값 읽어오기',
                codingmachine_connect: '드론 연결 상태 읽어오기',
                codingmachine_emergency: '드론을 즉시 멈추기 %1',
                codingmachine_gyro: '보드 %1 기울기 값 읽어오기',
                codingmachine_joystick: '조이스틱 %1 읽기',
                codingmachine_led: '%1 LED %2  %3',
                codingmachine_motor: '%1 모터를 %2 세기로 돌리기 %3',
                codingmachine_ready: '드론 비행 준비 상태 읽어오기',
                codingmachine_rollpitch: '드론을 %1 방향 %2 세기로 움직이기 %3',
                codingmachine_throttle: '드론 프로펠러를 %1 만큼 세기로 돌리기 %2',
                codingmachine_tune: '%1 음을  %2 초동안 소리내기 %3',
                codingmachine_ultrasonic: '거리(초음파)값 읽어오기',
                codingmachine_yaw: '드론을 %1 만큼 회전하기 %2',
                codingmachine_digital_out: '디지털 %1번 핀 %2 %3',
                codingmachine_digital_in: '디지털 %1 번값 읽어오기',
                codingmachine_analog_in: '아날로그 %1 번 센서값',
                codingmachine_digital_pwm: '디지털 출력 %1 번 세기로 출력하기 %2 %3',
                codingmachine_servo: '디지털  %1 핀의 서보모터를 %2 각도로 정하기 %3',
            },
        },
        en: {
            template: {
                codingmachine_altitude: '드론을 %1 높이만큼 날리기 %2',
                codingmachine_button: '%1번 버튼 값 읽어오기',
                codingmachine_connect: '드론 연결 상태 읽어오기',
                codingmachine_emergency: '드론을 즉시 멈추기 %1',
                codingmachine_gyro: '보드 %1 기울기 값 읽어오기',
                codingmachine_joystick: '조이스틱 %1 읽기',
                codingmachine_led: '%1 LED %2  %3',
                codingmachine_motor: '%1 모터를 %2 세기로 돌리기 %3',
                codingmachine_ready: '드론 비행 준비 상태 읽어오기',
                codingmachine_rollpitch: '드론을 %1 방향 %2 세기로 움직이기 %3',
                codingmachine_throttle: '드론 프로펠러를 %1 만큼 세기로 돌리기 %2',
                codingmachine_tune: '%1 음을  %2 초동안 소리내기 %3',
                codingmachine_ultrasonic: '거리(초음파)값 읽어오기',
                codingmachine_yaw: '드론을 %1 만큼 회전하기 %2',
                codingmachine_digital_out: '디지털 %1번 핀 %2 %3',
                codingmachine_digital_in: '디지털 %1 번값 읽어오기',
                codingmachine_analog_in: 'analog %1 sensor',
                codingmachine_digital_pwm: '디지털 출력 %1 번 세기로 출력하기 %2 %3',
                codingmachine_servo: '디지털  %1 핀의 서보모터를 %2 각도로 정하기 %3',
            }
        }
    };
};
Entry.Codingmachine.blockMenuBlocks = [
    //Codingmachine Blocks
    'codingmachine_led',
    'codingmachine_tune',
    'codingmachine_motor',
    'codingmachine_joystick',
    'codingmachine_button',
    'codingmachine_gyro',
    'codingmachine_ultrasonic',
    'codingmachine_connect',
    'codingmachine_ready',
    'codingmachine_throttle',
    'codingmachine_altitude',
    'codingmachine_rollpitch',
    'codingmachine_yaw',
    'codingmachine_emergency',
    'codingmachine_digital_out',
    'codingmachine_digital_in',
    'codingmachine_analog_in',
    'codingmachine_digital_pwm',
    'codingmachine_servo',
    //Added 2018-09-24
];
Entry.Codingmachine.getBlocks = function() {
    return {
        //region JDKit
        /* ----------- 추가 --------- */
        codingmachine_analog_in: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['A4', 1], ['A5', 2]],
                    value: 1,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'codingmachine_analog_in',
            },
            paramsKeyMap: {
                ANALOG_SENSOR: 0,
            },
            class: 'codingmachine_arduino',
            isNotFor: ['Codingmachine'],
            func: function(sprite, script) {
                var sensorData = Entry.hw.portData.CMD;
                var analog_sel = script.getField('ANALOG_SENSOR');
                if (analog_sel == 1) return sensorData[Entry.Codingmachine.Sensor.ANALOG_A4];
                else if (analog_sel == 2) return sensorData[Entry.Codingmachine.Sensor.ANALOG_A5];
                else return sensorData[Entry.Codingmachine.Sensor.ANALOG_A4];
            },
            syntax: { js: [], py: [] },
        },
        /* ----------- 추가 --------- */
        codingmachine_joystick: {
            template: Lang.template.jdkit_joystick,
            parent: 'jdkit_joystick',
            def: {
                params: [null],
                type: 'codingmachine_joystick',
            },
            isNotFor: ['Codingmachine'],
            syntax: { js: [], py: [] },
        },

        /* ----------- 추가 --------- */
        codingmachine_digital_in: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        //3,4,5,6,7,11,12,13
                        ['D3', 0] /*D3,D7*/,
                        ['D4', 1] /*D4*/,
                        ['D5', 2] /*D5*/,
                        ['D6', 3] /*D6*/,
                        ['D7', 4],
                        ['D11', 5],
                        ['D12', 6],
                        ['D13', 7],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'codingmachine_digital_in',
            },
            paramsKeyMap: {
                DIGITAL_PIN: 0,
            },
            class: 'codingmachine_arduino',
            isNotFor: ['Codingmachine'],
            func: function(sprite, script) {
                var sensorData = Entry.hw.portData.CMD;
                var digital_pin = script.getField('DIGITAL_PIN');
                if (digital_pin <= 3) {
                    return sensorData[Entry.Codingmachine.Sensor.DIGITAL_IN1] &
                        (0x01 << digital_pin)
                        ? 0
                        : 1;
                } else if (digital_pin == 4) {
                    return sensorData[Entry.JDKit.Codingmachine.DIGITAL_IN2] & (0x01 << 0) ? 0 : 1;
                } else {
                    return sensorData[Entry.Codingmachine.Sensor.DIGITAL_IN2] &
                        (0x01 << (digital_pin - 4))
                        ? 0
                        : 1;
                }
            },
            syntax: { js: [], py: [] },
        },
        /* ----------- 추가 --------- */
        codingmachine_button: {
            template: Lang.template.jdkit_button,
            parent: 'jdkit_button',
            def: {
                params: [null],
                type: 'codingmachine_button',
            },
            isNotFor: ['Codingmachine'],

            syntax: { js: [], py: [] },
        },

        codingmachine_gyro: {
            template: Lang.template.jdkit_gyro,
            parent: 'jdkit_gyro',
            def: {
                params: [null],
                type: 'codingmachine_gyro',
            },
            isNotFor: ['Codingmachine'],
            syntax: { js: [], py: [] },
        },

        codingmachine_ultrasonic: {
            template: Lang.template.jdkit_ultrasonic,
            parent: 'jdkit_ultrasonic',
            def: {
                params: [null],
                type: 'codingmachine_ultrasonic',
            },
            isNotFor: ['Codingmachine'],
            syntax: { js: [], py: [] },
        },

        codingmachine_connect: {
            template: Lang.template.jdkit_connect,
            parent: 'jdkit_connect',
            def: {
                params: [null],
                type: 'codingmachine_connect',
            },
            isNotFor: ['Codingmachine'],
            syntax: { js: [], py: [] },
        },

        codingmachine_ready: {
            template: Lang.template.jdkit_ready,
            parent: 'jdkit_ready',
            def: {
                params: [null],
                type: 'codingmachine_ready',
            },

            isNotFor: ['Codingmachine'],
            syntax: { js: [], py: [] },
        },

        /* -------- 추가 ------- */
        codingmachine_servo: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['D3', 3],
                        ['D4', 4],
                        ['D5', 5],
                        ['D6', 6],
                        ['D7', 7],
                        ['D11', 11],
                        ['D12', 12],
                        ['D13', 13],
                    ],
                    value: 3,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    value: '180',
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
                type: 'codingmachine_servo',
            },
            paramsKeyMap: {
                DIGITAL_PIN: 0,
                ACTION: 1,
            },
            class: 'codingmachine_arduino',
            isNotFor: ['Codingmachine'],
            func: function(sprite, script) {
                if (typeof Entry.hw.sendQueue.CMD == 'undefined')
                    Entry.hw.sendQueue.CMD = [
                        0xf0,
                        0,
                        0,
                        0,
                        100,
                        100,
                        100,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        /* -------- 추가 ------- */
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        /* -------- 추가 ------- */
                    ];
                var cmd = Entry.hw.sendQueue.CMD;
                var digital_pin = script.getField('DIGITAL_PIN', script);
                var act_val = script.getNumberValue('ACTION', script);
                cmd[Entry.Codingmachine.Cmd.SERVOPORT] |= digital_pin;
                cmd[Entry.Codingmachine.Cmd.SERVODGREE] = act_val;
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        /* -------- 추가 ------- */
        /* -------- 추가 ------- */
        codingmachine_digital_pwm: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['D3', 1], ['D5', 2], ['D6', 3], ['D11', 4]],
                    value: 1,
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'codingmachine_digital_pwm',
            },
            paramsKeyMap: {
                DIGITAL_PIN: 0,
                ACTION_VALUE: 1,
            },
            class: 'codingmachine_arduino',
            isNotFor: ['Codingmachine'],
            func: function(sprite, script) {
                if (typeof Entry.hw.sendQueue.CMD == 'undefined')
                    Entry.hw.sendQueue.CMD = [
                        0xf0,
                        0,
                        0,
                        0,
                        100,
                        100,
                        100,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        /* -------- 추가 ------- */
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        /* -------- 추가 ------- */
                    ];
                var cmd = Entry.hw.sendQueue.CMD;
                var digital_pin = script.getField('DIGITAL_PIN', script);
                var act_value = script.getNumberValue('ACTION_VALUE', script);
                cmd[Entry.Codingmachine.Cmd.DIGITAL_OUT3] = (digital_pin << 4) & 0xf0;
                cmd[Entry.Codingmachine.Cmd.DIGITAL_PWM] = act_value;
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        /* -------- 추가 ------- */
        /* -------- 추가 ------- */
        codingmachine_digital_out: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        //3,4,5,6,7,11,12,13
                        ['D3', 0] /*D3,D7*/,
                        ['D4', 1] /*D4*/,
                        ['D5', 2] /*D5*/,
                        ['D6', 3] /*D6*/,
                        ['D7', 4],
                        ['D11', 5],
                        ['D12', 6],
                        ['D13', 7],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.jdkit_led_turnon, 3],
                        [Lang.Blocks.jdkit_led_turnoff, 4],
                    ],
                    value: 3,
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
                type: 'codingmachine_digital_out',
            },
            paramsKeyMap: {
                DIGITAL_PIN: 0,
                ACTION: 1,
            },
            class: 'codingmachine_arduino',
            isNotFor: ['Codingmachine'],
            func: function(sprite, script) {
                if (typeof Entry.hw.sendQueue.CMD == 'undefined')
                    Entry.hw.sendQueue.CMD = [
                        0xf0,
                        0,
                        0,
                        0,
                        100,
                        100,
                        100,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        /* -------- 추가 ------- */
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        /* -------- 추가 ------- */
                    ];
                var cmd = Entry.hw.sendQueue.CMD;
                var digital_pin = script.getField('DIGITAL_PIN', script);
                var act = script.getField('ACTION', script);
                if (act == 3) {
                    if (digital_pin <= 2) {//D3, D4, D5
                        cmd[Entry.Codingmachine.Cmd.DIGITAL_OUT1] |= (0x01 << (digital_pin * 2 + 1));
                        cmd[Entry.Codingmachine.Cmd.DIGITAL_OUT1] |= (0x01 << digital_pin * 2);
                    } else if (digital_pin <= 5) {//D6, D7, D11
                        cmd[Entry.Codingmachine.Cmd.DIGITAL_OUT2] |= (0x01 << ((digital_pin - 3) * 2 + 1));
                        cmd[Entry.Codingmachine.Cmd.DIGITAL_OUT2] |= (0x01 << (digital_pin - 3) * 2);
                    } else {   //D12, D13
                        cmd[Entry.Codingmachine.Cmd.DIGITAL_OUT3] |= (0x01 << ((digital_pin - 6) * 2 + 1));
                        cmd[Entry.Codingmachine.Cmd.DIGITAL_OUT3] |= (0x01 << (digital_pin - 6) * 2);
                    }
                } else {
                    if (digital_pin <= 2) {
                        cmd[Entry.Codingmachine.Cmd.DIGITAL_OUT1] |= (0x01 << (digital_pin * 2 + 1));
                        cmd[Entry.Codingmachine.Cmd.DIGITAL_OUT1] &= ~(0x01 << digital_pin * 2);
                    } else if (digital_pin <= 5) {
                        cmd[Entry.Codingmachine.Cmd.DIGITAL_OUT2] |= (0x01 << ((digital_pin - 3) * 2 + 1));
                        cmd[Entry.Codingmachine.Cmd.DIGITAL_OUT2] &= ~(0x01 << (digital_pin - 3) * 2);
                    } else {
                        cmd[Entry.Codingmachine.Cmd.DIGITAL_OUT3] |= (0x01 << ((digital_pin - 6) * 2 + 1));
                        cmd[Entry.Codingmachine.Cmd.DIGITAL_OUT3] &= ~(0x01 << (digital_pin - 6) * 2);
                    }
                }
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        /* -------- 추가 ------- */
        codingmachine_led: {
            template: Lang.template.jdkit_led,
            parent: 'jdkit_led',
            def: {
                params: [null],
                type: 'codingmachine_led',
            },

            isNotFor: ['Codingmachine'],
            syntax: { js: [], py: [] },
        },

        codingmachine_tune: {
            template: Lang.template.jdkit_tune,
            parent: 'jdkit_tune',
            def: {
                params: [null],
                type: 'codingmachine_tune',
            },

            isNotFor: ['Codingmachine'],
            syntax: { js: [], py: [] },
        },

        codingmachine_motor: {
            template: Lang.template.jdkit_motor,
            parent: 'jdkit_motor',
            def: {
                params: [null],
                type: 'codingmachine_motor',
            },

            isNotFor: ['Codingmachine'],
            syntax: { js: [], py: [] },
        },

        codingmachine_throttle: {
            template: Lang.template.jdkit_throttle,
            parent: 'jdkit_throttle',
            def: {
                params: [null],
                type: 'codingmachine_throttle',
            },

            isNotFor: ['Codingmachine'],
            syntax: { js: [], py: [] },
        },

        codingmachine_altitude: {
            template: Lang.template.jdkit_altitude,
            parent: 'jdkit_altitude',
            def: {
                params: [null],
                type: 'codingmachine_altitude',
            },

            isNotFor: ['Codingmachine'],
            syntax: { js: [], py: [] },
        },

        codingmachine_rollpitch: {
            template: Lang.template.jdkit_rollpitch,
            parent: 'jdkit_rollpitch',
            def: {
                params: [null],
                type: 'codingmachine_rollpitch',
            },

            isNotFor: ['Codingmachine'],
            syntax: { js: [], py: [] },
        },

        codingmachine_yaw: {
            template: Lang.template.jdkit_yaw,
            parent: 'jdkit_yaw',
            def: {
                params: [null],
                type: 'codingmachine_yaw',
            },

            isNotFor: ['Codingmachine'],
            syntax: { js: [], py: [] },
        },

        codingmachine_emergency: {
            template: Lang.template.jdkit_emergency,
            parent: 'jdkit_emergency',
            def: {
                params: [null],
                type: 'codingmachine_emergency',
            },

            isNotFor: ['Codingmachine'],
            syntax: { js: [], py: [] },
        },

        //endregion JDKit
    };
};

module.exports = Entry.Codingmachine;
