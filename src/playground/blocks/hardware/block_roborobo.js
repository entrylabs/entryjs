'use strict';

Entry.Roborobo_Roduino = {
    id: '10.1',
    name: 'roborobo_roduino',
    url: 'http://www.roborobo.co.kr',
    imageName: 'roborobo_roduino.png',
    title: {
        ko: '로두이노',
        en: 'Roduino',
    },
    INSTRUCTION: {
        INPUT: 0,
        OUTPUT: 1,
        ANALOG: 2,
        PWM: 3,
        SERVO: 4,
        SONAR: 11,
    },
    setZero: function() {
        Entry.hw.sendQueue.colorPin = 0;
        Entry.hw.sendQueue.digitalPinMode = [];
        Entry.hw.sendQueue.preDigitalPinMode = [];
        Entry.hw.sendQueue.stopSend = false;

        for (var port = 0; port < 14; port++) {
            Entry.hw.sendQueue[port] = 0;
            Entry.hw.sendQueue.preDigitalPinMode[port] = -2;
            Entry.hw.sendQueue.digitalPinMode[port] = -1;
        }
        this.ColorPin = [0, 0, 0];
        Entry.hw.update();
    },
    ColorPin: [0, 0, 0],

    monitorTemplate: {
        imgPath: 'hw/roborobo_roduino.png',
        keys: ['value'],
        width: 256,
        height: 256,
        listPorts: {
            a0: {
                name: 'A0',
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
            a1: {
                name: 'A1',
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
            a2: {
                name: 'A2',
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
            a3: {
                name: 'A3',
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
            a4: {
                name: 'A4',
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
            a5: {
                name: 'A5',
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
            2: {
                name: 'D2',
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
            3: {
                name: 'D3',
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
            4: {
                name: 'D4',
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
            5: {
                name: 'D5',
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
            6: {
                name: 'D6',
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
            7: {
                name: 'D7',
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
            8: {
                name: 'D8',
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
            9: {
                name: 'D9',
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
            10: {
                name: 'D10',
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
        },
        mode: 'both',
    },
};

Entry.Roborobo_Roduino.setLanguage = function() {
    return {
        ko: {
            template: {
                roduino_get_analog_number: '%1  ',
                roduino_get_port_number: '%1  ',
                roduino_get_analog_value: '아날로그 %1 번 센서값  ',
                roduino_get_digital_value: '디지털 %1 번 센서값  ',
                roduino_set_digital: '디지털 %1 번 핀 %2 %3',
                roduino_motor: '%1 %2 %3',
                roduino_set_color_pin: '컬러센서 R : %1, G : %2, B : %3 %4',
                roduino_get_color: '컬러센서 %1 감지',
                roduino_on_block: ' On ',
                roduino_off_block: ' Off ',
                roduino_set_servo_value: '서보모터 %1 번 핀 %2˚ %3',
                roduino_set_pwm_value: 'PWM %1 번 핀 %2으로 전류조절 %3',
                roduino_get_sensor_analog_value: '아날로그 %1 %2 번 핀 값',
                roduino_get_sensor_digital_value: '디지털 %1 %2 번 핀 값',
            },
            Blocks: {
                roborobo_get_temperutre: '온도센서',
                roborobo_get_joystick_x: '조이스틱X',
                roborobo_get_joystick_y: '조이스틱Y',
                roborobo_get_light: '빛센서',
                roborobo_get_dial: '다이얼',
                roborobo_get_keypad_a: 'A키패트(키번호)',
                roborobo_get_ultrasonic: '초음파센서[cm]',
                roborobo_num_analog_value_1: '아날로그',
                roborobo_num_analog_value_2: '번 센서값',
                roborobo_get_digital_value_1: '디지털',
                roborobo_num_pin_1: '디지털',
                roborobo_num_pin_2: '번 핀',
                roborobo_on: '켜기',
                roborobo_off: '끄기',
                roborobo_motor1: '모터1',
                roborobo_motor2: '모터2',
                roborobo_motor_CW: '정회전',
                roborobo_motor_CCW: '역회전',
                roborobo_motor_stop: '정지',
                roborobo_input_mode: '입력',
                roborobo_output_mode: '출력',
                roborobo_pwm_mode: '전류조절(pwm)',
                roborobo_servo_mode: '서보모터',
                roborobo_color: '컬러센서',
                roborobo_color_red: ' 빨간색  ',
                roborobo_color_green: ' 녹색 ',
                roborobo_color_blue: ' 파란색 ',
                roborobo_color_yellow: ' 노란색 ',
                roborobo_color_detected: ' 감지 ',
                roborobo_degree: ' ˚',
            },
        },
        en: {
            template: {
                roduino_get_analog_number: '%1  ',
                roduino_get_port_number: '%1  ',
                roduino_get_analog_value: 'Analog %1 Sensor value  ',
                roduino_get_digital_value: 'Digital %1 Sensor value  ',
                roduino_set_digital: 'Digital %1 Pin %2 %3',
                roduino_motor: '%1 %2 %3',
                roduino_set_color_pin: 'Color Sensor R : %1, G : %2, B : %3 %4',
                roduino_get_color: 'Color Sensor %1 Detected ',
                roduino_on_block: ' On ',
                roduino_off_block: ' Off ',
                roduino_set_servo_value: 'Servo %1 Pin %2˚ %3',
                roduino_set_pwm_value: 'PWM Set pin %1 to %2',
                roduino_get_sensor_analog_value: 'analog %1 Pin %2 value',
                roduino_get_sensor_digital_value: 'digital %1 %2 번 핀 값',
            },
            Blocks: {
                roborobo_num_analog_value_1: 'Analog',
                roborobo_num_analog_value_2: 'Sensor Value',
                roborobo_get_digital_value_1: 'Digital',
                roborobo_num_pin_1: 'Digital',
                roborobo_num_pin_2: 'Pin',
                roborobo_on: 'On',
                roborobo_off: 'Off',
                roborobo_motor1: 'motor1',
                roborobo_motor2: 'motor2',
                roborobo_motor_CW: 'ClockWise',
                roborobo_motor_CCW: 'CounterClockWise',
                roborobo_motor_stop: 'Stop',
                roborobo_input_mode: 'Input',
                roborobo_output_mode: 'Output',
                roborobo_pwm_mode: 'PWM',
                roborobo_servo_mode: 'Servo',
                roborobo_color: 'Color Sensor ',
                roborobo_color_red: ' Red ',
                roborobo_color_green: ' Green ',
                roborobo_color_blue: ' Blue ',
                roborobo_color_yellow: ' Yellow ',
                roborobo_color_detected: ' Detected ',
                roborobo_degree: ' ˚',
                roborobo_get_temperutre: 'Temperature Sensor',
                roborobo_get_joystick_x: 'JoystickX',
                roborobo_get_joystick_y: 'JoystickY',
                roborobo_get_light: 'Light Sensor',
                roborobo_get_dial: 'Dial',
                roborobo_get_keypad_a: 'A Keypad(key number)',
                roborobo_get_ultrasonic: 'Ultrasonic Sensor[cm]',
            },
        },
    };
};

Entry.Roborobo_SchoolKit = {
    id: '10.2',
    name: 'roborobo_schoolkit',
    url: 'http://www.roborobo.co.kr',
    imageName: 'roborobo_schoolkit.png',
    title: {
        ko: '스쿨키트',
        en: 'School Kit',
    },
    pinMode: {
        INPUT: 0,
        OUTPUT: 1,
        ANALOG: 2,
        PWM: 3,
        SERVO: 4,
    },
    inputPort: {
        ir: 7,
        sound: 8,
        contact: 9,
        cds: 10,
    },
    setZero: function() {
        Entry.hw.sendQueue.digitalPinMode = [];
        Entry.hw.sendQueue.previousValue = [];

        for (var port = 0; port < 14; port++) {
            Entry.hw.sendQueue[port] = 0;
            Entry.hw.sendQueue.digitalPinMode[port] = 0;
            Entry.hw.sendQueue.previousValue[port] = -1;
        }
        Entry.hw.update();
    },
    monitorTemplate: {
        imgPath: 'hw/roborobo_schoolkit.png',
        keys: ['value'],
        width: 256,
        height: 256,
        listPorts: {
            '0': {
                name: 'D1',
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
            '1': {
                name: 'D2',
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
            '2': {
                name: 'D3',
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
            '3': {
                name: 'D4',
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
            '4': {
                name: 'D5',
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
            '5': {
                name: 'D6',
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
            '6': {
                name: 'D7',
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
        },
        mode: 'both',
    },
};

Entry.Roborobo_RoE = {
    id: '48.1',
    name: 'roborobo_roe',
    url: 'http://www.roborobo.co.kr',
    imageName: 'roborobo_roe.png',
    title: {
        ko: '로이',
        en: 'Ro-E',
    },
    setZero: function() {
        Entry.hw.sendQueue['LED'] = 0;
        Entry.hw.sendQueue['Melody'] = [0, 0, 0];   //[octave, note, duration]
        Entry.hw.sendQueue['LeftMotor'] = [0, 0];   //[direction, value]
        Entry.hw.sendQueue['RightMotor'] = [0, 0];  //[direction, value]
        Entry.hw.update();
    },
    motorDiretion: {
        STOP: 0,
        CW: 1,
        CCW: 2
    },
    monitorTemplate: {
        imgPath: 'hw/roborobo_roe.png',
        keys: ['value'],
        width: 256,
        height: 256,
        listPorts: {
            lColor: {
                name: 'Color Sensor(Left)',
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
            rColor: {
                name: 'Color Sensor(Right)',
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
            ir: {
                name: 'IR Sensor',
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
            switch: {
                name: 'Switch Sensor',
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
        },
        mode: 'both',
    },
};

Entry.Roborobo_Roduino.blockMenuBlocks = [
    'roduino_on_block',
    'roduino_off_block',
    'roduino_get_sensor_analog_value',
    'roduino_get_sensor_digital_value',
    'roduino_get_analog_value',
    'roduino_get_digital_value',
    'roduino_get_color',
    'roduino_set_digital',
    'roduino_motor',
    'roduino_set_color_pin',
    'roduino_set_servo_value',
    'roduino_set_pwm_value',
];

Entry.Roborobo_Roduino.getBlocks = function() {
    return {
        //region roduino 로두이노
        roduino_on_block: {
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
                params: [null],
                type: 'roduino_on_block',
            },
            paramsKeyMap: {},
            class: 'roduino_value',
            isNotFor: ['roborobo_roduino'],
            func: function(sprite, script) {
                return '1';
            },
            syntax: {
                js: [],
                py: ['Roborobo_roduino.roduino_on_block()'],
            },
        },
        roduino_off_block: {
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
                params: [null],
                type: 'roduino_off_block',
            },
            paramsKeyMap: {},
            class: 'roduino_value',
            isNotFor: ['roborobo_roduino'],
            func: function(sprite, script) {
                return '0';
            },
            syntax: {
                js: [],
                py: ['Roborobo_roduino.roduino_off_block()'],
            },
        },
        roduino_get_analog_number: {
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
                return script.getStringField('PORT');
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
                                    ['0', '0'],
                                    ['1', '1'],
                                    ['2', '2'],
                                    ['3', '3'],
                                    ['4', '4'],
                                    ['5', '5'],
                                ],
                                value: '0',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'roduino_get_analog_number',
                    },
                ],
            },
        },
        roduino_get_port_number: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['5', '5'],
                        ['6', '6'],
                        ['7', '7'],
                        ['8', '8'],
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
                return script.getStringField('PORT');
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
                                    ['2', '2'],
                                    ['3', '3'],
                                    ['4', '4'],
                                    ['5', '5'],
                                    ['6', '6'],
                                    ['7', '7'],
                                    ['8', '8'],
                                ],
                                value: '2',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'roduino_get_port_number',
                    },
                ],
            },
        },
        roduino_get_analog_value: {
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
                        type: 'roduino_get_analog_number',
                    },
                ],
                type: 'roduino_get_analog_value',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'roduino_value',
            isNotFor: ['roborobo_roduino'],
            func: function(sprite, script) {
                var signal = script.getValue('VALUE', script);
                return Entry.hw.getAnalogPortValue(signal);
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roborobo_roduino.read_analog(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        roduino_get_digital_value: {
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
                        type: 'roduino_get_port_number',
                    },
                ],
                type: 'roduino_get_digital_value',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'roduino_value',
            isNotFor: ['roborobo_roduino'],
            func: function(sprite, script) {
                var signal = script.getNumberValue('VALUE', script);
                if (!Entry.hw.sendQueue.digitalPinMode) {
                    Entry.hw.sendQueue.digitalPinMode = [
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                    ];
                }
                Entry.hw.sendQueue.digitalPinMode[signal] =
                    Entry.Roborobo_Roduino.INSTRUCTION.INPUT;
                Entry.hw.update();
                return Entry.hw.getDigitalPortValue(signal);
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roborobo_roduino.read_digital(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        roduino_get_color: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.roborobo_color_red, 'red'],
                        [Lang.Blocks.roborobo_color_green, 'green'],
                        [Lang.Blocks.roborobo_color_blue, 'blue'],
                        [Lang.Blocks.roborobo_color_yellow, 'yellow'],
                    ],
                    value: 'red',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'roduino_get_color',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'roduino_value',
            isNotFor: ['roborobo_roduino'],
            func: function(sprite, script) {
                var flag = 0;
                var signal = script.getField('VALUE', script);
                var value = [
                    Entry.hw.portData[Entry.Roborobo_Roduino.ColorPin[0]],
                    Entry.hw.portData[Entry.Roborobo_Roduino.ColorPin[1]],
                    Entry.hw.portData[Entry.Roborobo_Roduino.ColorPin[2]],
                ];

                switch (signal) {
                    case 'red':
                        if (value[0] == 1 && value[1] == 0 && value[2] == 0) {
                            flag = 1;
                        }
                        break;
                    case 'green':
                        if (value[0] == 0 && value[1] == 1 && value[2] == 0) {
                            flag = 1;
                        }
                        break;
                    case 'blue':
                        if (value[0] == 0 && value[1] == 0 && value[2] == 1) {
                            flag = 1;
                        }
                        break;
                    case 'yellow':
                        if (value[0] == 1 && value[1] == 1 && value[2] == 1) {
                            flag = 1;
                        }
                        break;
                }
                return flag;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roborobo_roduino.read_color(%1)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.roborobo_color_red, 'red'],
                                    [Lang.Blocks.roborobo_color_green, 'green'],
                                    [Lang.Blocks.roborobo_color_blue, 'blue'],
                                    [Lang.Blocks.roborobo_color_yellow, 'yellow'],
                                ],
                                value: 'red',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        roduino_get_sensor_analog_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.roborobo_get_temperutre, 'temperature'],
                        [Lang.Blocks.roborobo_get_joystick_x, 'joystickX'],
                        [Lang.Blocks.roborobo_get_joystick_y, 'joystickY'],
                        [Lang.Blocks.roborobo_get_light, 'light'],
                        [Lang.Blocks.roborobo_get_dial, 'dial'],
                        [Lang.Blocks.roborobo_get_keypad_a, 'keypad'],
                    ],
                    value: 'temperature',
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
                    {
                        type: 'roduino_get_analog_number',
                    },
                ],
                type: 'roduino_get_sensor_analog_value',
            },
            paramsKeyMap: {
                SENSOR: 0,
                VALUE: 1,
            },
            class: 'roduino_value',
            isNotFor: ['roborobo_roduino'],
            func: function(sprite, script) {
                var sensor = script.getField('SENSOR');
                var signal = script.getNumberValue('VALUE');
                var readData = Entry.hw.getAnalogPortValue(signal);
                var data = 0;
                switch (sensor) {
                    case 'temperature':
                        // var data = 5 / 51.0 * readData - 22;
                        data = readData;
                        break;
                    case 'joystickX':
                        readData = readData >> 6;
                        if (readData > 14) data = 2;
                        else if (readData > 9) data = 1;
                        else if (readData > 5) data = 0;
                        else if (readData > 1) data = -1;
                        else data = -2;
                        break;
                    case 'joystickY':
                        readData = readData >> 6;
                        if (readData > 14) data = 2;
                        else if (readData > 9) data = 1;
                        else if (readData > 5) data = 0;
                        else if (readData > 1) data = -1;
                        else data = -2;
                        break;
                    case 'light':
                        data = Math.round(readData / 10) * 10;
                        break;
                    case 'dial':
                        data = Math.round(readData / 10);
                        break;
                    case 'keypad':
                        if (readData >= 450) data = 1;
                        else if (readData >= 390) data = 2;
                        else if (readData >= 310) data = 3;
                        else if (readData >= 200) data = 4;
                        else if (readData >= 100) data = 5;
                        else data = 0;
                        break;
                }
                return data;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roborobo_roduino.read_analog_sensor(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.roborobo_get_temperutre, 'temperature'],
                                    [Lang.Blocks.roborobo_get_joystick_x, 'joystickX'],
                                    [Lang.Blocks.roborobo_get_joystick_y, 'joystickY'],
                                    [Lang.Blocks.roborobo_get_light, 'light'],
                                    [Lang.Blocks.roborobo_get_dial, 'dial'],
                                    [Lang.Blocks.roborobo_get_keypad_a, 'keypad'],
                                ],
                                value: 'temperature',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
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
        roduino_get_sensor_digital_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [[Lang.Blocks.roborobo_get_ultrasonic, 'ultrasonic']],
                    value: 'ultrasonic',
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
                    {
                        type: 'roduino_get_port_number',
                    },
                ],
                type: 'roduino_get_sensor_digital_value',
            },
            paramsKeyMap: {
                SENSOR: 0,
                VALUE: 1,
            },
            class: 'roduino_value',
            isNotFor: ['roborobo_roduino'],
            func: function(sprite, script) {
                var sensor = script.getField('SENSOR');
                var signal = script.getNumberValue('VALUE', script);
                switch (sensor) {
                    case 'ultrasonic':
                        if (!Entry.hw.sendQueue.digitalPinMode) {
                            Entry.hw.sendQueue.digitalPinMode = [
                                -1,
                                -1,
                                -1,
                                -1,
                                -1,
                                -1,
                                -1,
                                -1,
                                -1,
                                -1,
                                -1,
                                -1,
                                -1,
                                -1,
                            ];
                        }
                        Entry.hw.sendQueue.digitalPinMode[signal] =
                            Entry.Roborobo_Roduino.INSTRUCTION.SONAR;
                        Entry.hw.update();
                        break;
                }
                return Entry.hw.getDigitalPortValue(signal);
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roborobo_roduino.read_digital_sensor(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [[Lang.Blocks.roborobo_get_ultrasonic, 'ultrasonic']],
                                value: 'ultrasonic',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
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
        roduino_set_digital: {
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
                        [Lang.Blocks.roborobo_on, 'on'],
                        [Lang.Blocks.roborobo_off, 'off'],
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
                    {
                        type: 'roduino_get_port_number',
                    },
                    null,
                    null,
                ],
                type: 'roduino_set_digital',
            },
            paramsKeyMap: {
                VALUE: 0,
                OPERATOR: 1,
            },
            class: 'roduino_set',
            isNotFor: ['roborobo_roduino'],
            func: function(sprite, script) {
                var pin = script.getNumberValue('VALUE', script);
                var operator = script.getField('OPERATOR');
                var value = operator == 'on' ? 1 : 0;
                if (!Entry.hw.sendQueue.digitalPinMode) {
                    Entry.hw.sendQueue.digitalPinMode = [
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                    ];
                }
                Entry.hw.sendQueue.digitalPinMode[pin] = Entry.Roborobo_Roduino.INSTRUCTION.OUTPUT;

                Entry.hw.setDigitalPortValue(pin, value);
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roborobo_roduino.wirte_digital(%1, %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.roborobo_on, 'on'],
                                    [Lang.Blocks.roborobo_off, 'off'],
                                ],
                                value: 'on',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        roduino_get_pwm_port_number: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['3', 3],
                        ['5', 5],
                        ['6', 6],
                    ],
                    value: 3,
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
                return script.getNumberField('PORT');
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
                                    ['3', 3],
                                    ['5', 5],
                                    ['6', 6],
                                ],
                                value: 3,
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'roduino_get_pwm_port_number',
                    },
                ],
            },
        },
        roduino_get_pwm_output_value: {
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
                VALUE: '0',
            },
            func: function(sprite, script) {
                return script.getNumberField('VALUE');
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
                                value: '0',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'roduino_get_pwm_output_value',
                    },
                ],
            },
        },
        roduino_set_pwm_value: {
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
                        type: 'roduino_get_pwm_port_number',
                    },
                    {
                        type: 'roduino_get_pwm_output_value',
                    },
                    null,
                ],
                type: 'roduino_set_pwm_value',
            },
            paramsKeyMap: {
                PIN: 0,
                VALUE: 1,
            },
            class: 'roduino_set',
            isNotFor: ['roborobo_roduino'],
            func: function(sprite, script) {
                var pin = script.getNumberValue('PIN', script);
                var value = script.getNumberValue('VALUE');

                if (!Entry.hw.sendQueue.digitalPinMode) {
                    Entry.hw.sendQueue.digitalPinMode = [
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                    ];
                }

                Entry.hw.sendQueue.digitalPinMode[pin] = Entry.Roborobo_Roduino.INSTRUCTION.PWM;

                Entry.hw.setDigitalPortValue(pin, value);
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roborobo_roduino.write_analog(%1, %2)',
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
        roduino_get_servo_port_number: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['3', 3],
                        ['5', 5],
                        ['6', 6],
                    ],
                    value: 3,
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
                return script.getNumberField('PORT');
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
                                    ['3', 3],
                                    ['5', 5],
                                    ['6', 6],
                                ],
                                value: 3,
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'roduino_get_servo_port_number',
                    },
                ],
            },
        },
        roduino_set_servo_value: {
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
                        type: 'roduino_get_servo_port_number',
                    },
                    {
                        type: 'number',
                        params: ['90'],
                    },
                    null,
                ],
                type: 'roduino_set_servo_value',
            },
            paramsKeyMap: {
                PIN: 0,
                VALUE: 1,
            },
            class: 'roduino_set',
            isNotFor: ['roborobo_roduino'],
            func: function(sprite, script) {
                var pin = script.getNumberValue('PIN', script);
                var value = script.getNumberValue('VALUE');

                if (!Entry.hw.sendQueue.digitalPinMode) {
                    Entry.hw.sendQueue.digitalPinMode = [
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                    ];
                }

                Entry.hw.sendQueue.digitalPinMode[pin] = Entry.Roborobo_Roduino.INSTRUCTION.SERVO;

                if (value < 0) {
                    value = 0;
                } else if (value > 180) {
                    value = 180;
                }

                Entry.hw.setDigitalPortValue(pin, value);
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roborobo_roduino.move_servo(%1, %2)',
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
        roduino_motor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.roborobo_motor1, 'motor1'],
                        [Lang.Blocks.roborobo_motor2, 'motor2'],
                    ],
                    value: 'motor1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.roborobo_motor_CW, 'cw'],
                        [Lang.Blocks.roborobo_motor_CCW, 'ccw'],
                        [Lang.Blocks.roborobo_motor_stop, 'stop'],
                    ],
                    value: 'cw',
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
                params: [null, null, null],
                type: 'roduino_motor',
            },
            paramsKeyMap: {
                MODE: 0,
                OPERATOR: 1,
            },
            class: 'roduino_set',
            isNotFor: ['roborobo_roduino'],
            func: function(sprite, script) {
                var pin1 = 0;
                var pin2 = 0;
                var value1 = 0;
                var value2 = 0;
                var mode = script.getField('MODE');
                var operator = script.getField('OPERATOR');

                if (mode == 'motor1') {
                    pin1 = 9;
                    pin2 = 10;
                } else {
                    pin1 = 11;
                    pin2 = 12;
                }

                if (operator == 'cw') {
                    value1 = 1;
                    value2 = 0;
                } else if (operator == 'ccw') {
                    value1 = 0;
                    value2 = 1;
                } else {
                    value1 = 0;
                    value2 = 0;
                }

                if (!Entry.hw.sendQueue.digitalPinMode) {
                    Entry.hw.sendQueue.digitalPinMode = [
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                    ];
                }
                Entry.hw.sendQueue.digitalPinMode[pin1] = Entry.Roborobo_Roduino.INSTRUCTION.OUTPUT;
                Entry.hw.sendQueue.digitalPinMode[pin2] = Entry.Roborobo_Roduino.INSTRUCTION.OUTPUT;

                Entry.hw.setDigitalPortValue(pin1, value1);
                Entry.hw.setDigitalPortValue(pin2, value2);
                Entry.hw.update();
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roborobo_roduino.move_motor(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.roborobo_motor1, 'motor1'],
                                    [Lang.Blocks.roborobo_motor2, 'motor2'],
                                ],
                                value: 'motor1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.roborobo_motor_CW, 'cw'],
                                    [Lang.Blocks.roborobo_motor_CCW, 'ccw'],
                                    [Lang.Blocks.roborobo_motor_stop, 'stop'],
                                ],
                                value: 'cw',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        roduino_set_color_pin: {
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
                        type: 'number',
                        params: ['2'],
                    },
                    {
                        type: 'number',
                        params: ['3'],
                    },
                    {
                        type: 'number',
                        params: ['4'],
                    },
                    null,
                ],
                type: 'roduino_set_color_pin',
            },
            paramsKeyMap: {
                RED: 0,
                GREEN: 1,
                BLUE: 2,
            },
            class: 'roduino_set',
            isNotFor: ['roborobo_roduino'],
            func: function(sprite, script) {
                var redPin = script.getNumberValue('RED', script);
                var greenPin = script.getNumberValue('GREEN', script);
                var bluePin = script.getNumberValue('BLUE', script);

                Entry.Roborobo_Roduino.ColorPin = [redPin, greenPin, bluePin];
                if (!Entry.hw.sendQueue.digitalPinMode) {
                    Entry.hw.sendQueue.digitalPinMode = [
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                        -1,
                    ];
                }
                Entry.hw.sendQueue.digitalPinMode[redPin] =
                    Entry.Roborobo_Roduino.INSTRUCTION.INPUT;
                Entry.hw.sendQueue.digitalPinMode[greenPin] =
                    Entry.Roborobo_Roduino.INSTRUCTION.INPUT;
                Entry.hw.sendQueue.digitalPinMode[bluePin] =
                    Entry.Roborobo_Roduino.INSTRUCTION.INPUT;
                Entry.hw.update();
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: ['Roborobo_roduino.set_color_pin_mode(%1, %2, %3)'],
            },
        },
        //endregion roduino 로두이노
    };
};

Entry.Roborobo_SchoolKit.setLanguage = function() {
    return {
        ko: {
            template: {
                schoolkit_get_in_port_number: '%1  ',
                schoolkit_get_out_port_number: '%1  ',
                schoolkit_get_servo_port_number: '%1  ',
                schoolkit_get_input_value: '디지털 %1 번 센서값  ',
                schoolkit_set_output: '디지털 %1 번 핀 %2 %3',
                schoolkit_motor: '%1 속도 %2(으)로 %3 %4',
                schoolkit_set_servo_value: '서보모터 %1 번 핀 %2˚ %3',
                schoolkit_on_block: ' On ',
                schoolkit_off_block: ' Off ',
            },
        },
        en: {
            template: {
                schoolkit_get_in_port_number: '%1  ',
                schoolkit_get_out_port_number: '%1  ',
                schoolkit_get_servo_port_number: '%1  ',
                schoolkit_get_input_value: 'Digital %1 Sensor value  ',
                schoolkit_set_output: 'Digital %1 Pin %2 %3',
                schoolkit_motor: '%1 Speed %2 %3 %4',
                schoolkit_set_servo_value: 'Servo %1 Pin %2˚ %3',
                schoolkit_on_block: ' On ',
                schoolkit_off_block: ' Off ',
            },
        },
    };
};

Entry.Roborobo_SchoolKit.blockMenuBlocks = [
    'schoolkit_on_block',
    'schoolkit_off_block',
    'schoolkit_get_input_value',
    'schoolkit_set_output',
    'schoolkit_motor',
    'schoolkit_set_servo_value',
];

Entry.Roborobo_SchoolKit.getBlocks = function() {
    return {
        //region schoolkit 스쿨키트
        schoolkit_on_block: {
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
                params: [null],
                type: 'schoolkit_on_block',
            },
            paramsKeyMap: {},
            class: 'schoolkit_value',
            isNotFor: ['roborobo_schoolkit'],
            func: function(sprite, script) {
                return '1';
            },
            syntax: {
                js: [],
                py: ['Roborobo_SchoolKit.schoolkit_on_block()'],
            },
        },
        schoolkit_off_block: {
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
                params: [null],
                type: 'schoolkit_off_block',
            },
            paramsKeyMap: {},
            class: 'schoolkit_value',
            isNotFor: ['roborobo_schoolkit'],
            func: function(sprite, script) {
                return '0';
            },
            syntax: {
                js: [],
                py: ['Roborobo_SchoolKit.schoolkit_off_block()'],
            },
        },
        schoolkit_get_out_port_number: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['OUT1', 2],
                        ['OUT2', 3],
                        ['OUT3', 4],
                        ['OUT4', 5],
                        ['OUT5', 6],
                    ],
                    value: 2,
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
                return script.getNumberField('PORT');
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
                                    ['OUT1', 2],
                                    ['OUT2', 3],
                                    ['OUT3', 4],
                                    ['OUT4', 5],
                                    ['OUT5', 6],
                                ],
                                value: 2,
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        keyOption: 'schoolkit_get_out_port_number',
                    },
                ],
            },
        },
        schoolkit_get_servo_port_number: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['OUT1', 2],
                        ['OUT2', 3],
                        ['OUT3', 4],
                    ],
                    value: 2,
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
                return script.getNumberField('PORT');
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
                                    ['OUT1', 2],
                                    ['OUT2', 3],
                                    ['OUT3', 4],
                                ],
                                value: 2,
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        keyOption: 'schoolkit_get_servo_port_number',
                    },
                ],
            },
        },
        schoolkit_get_in_port_number: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['IN1', 7],
                        ['IN2', 8],
                        ['IN3', 9],
                        ['IN4', 10],
                        ['IN5', 11],
                        ['IN6', 12],
                        ['IN7', 13],
                    ],
                    value: 7,
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
                return script.getNumberField('PORT');
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
                                    ['IN1', 7],
                                    ['IN2', 8],
                                    ['IN3', 9],
                                    ['IN4', 10],
                                    ['IN5', 11],
                                    ['IN6', 12],
                                    ['IN7', 13],
                                ],
                                value: 7,
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        keyOption: 'schoolkit_get_in_port_number',
                    },
                ],
            },
        },
        schoolkit_set_output: {
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
                        [Lang.Blocks.roborobo_on, 'on'],
                        [Lang.Blocks.roborobo_off, 'off'],
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
                    {
                        type: 'schoolkit_get_out_port_number',
                    },
                    null,
                    null,
                ],
                type: 'schoolkit_set_output',
            },
            paramsKeyMap: {
                VALUE: 0,
                OPERATOR: 1,
            },
            class: 'schoolkit_set',
            isNotFor: ['roborobo_schoolkit'],
            func: function(sprite, script) {
                var pin = script.getNumberValue('VALUE', script);
                var operator = script.getField('OPERATOR');
                var value = operator == 'on' ? 1 : 0;

                if (!Entry.hw.sendQueue.digitalPinMode) {
                    Entry.hw.sendQueue.digitalPinMode = {};
                }

                Entry.hw.sendQueue.digitalPinMode[pin] = Entry.Roborobo_SchoolKit.pinMode.OUTPUT;
                Entry.hw.sendQueue[pin] = value;
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roborobo_schoolkit.wirte_digital(%1, %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.roborobo_on, 'on'],
                                    [Lang.Blocks.roborobo_off, 'off'],
                                ],
                                value: 'on',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        schoolkit_get_input_value: {
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
                        type: 'schoolkit_get_in_port_number',
                    },
                ],
                type: 'schoolkit_get_input_value',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'schoolkit_value',
            isNotFor: ['roborobo_schoolkit'],
            func: function(sprite, script) {
                var signal = script.getNumberValue('VALUE', script);
                return Entry.hw.portData[signal - 7];
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roborobo_schoolkit.read_digital(%1)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        schoolkit_motor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.roborobo_motor1, 'motor1'],
                        [Lang.Blocks.roborobo_motor2, 'motor2'],
                    ],
                    value: 'motor1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['0', '45'],
                        ['1', '59'],
                        ['2', '73'],
                        ['3', '87'],
                        ['4', '101'],
                        ['5', '115'],
                        ['6', '129'],
                        ['7', '143'],
                        ['8', '157'],
                        ['9', '171'],
                        ['10', '185'],
                        ['11', '199'],
                        ['12', '213'],
                        ['13', '227'],
                        ['14', '241'],
                        ['15', '255'],
                    ],
                    value: '45',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.roborobo_motor_CW, 'cw'],
                        [Lang.Blocks.roborobo_motor_CCW, 'ccw'],
                        [Lang.Blocks.roborobo_motor_stop, 'stop'],
                    ],
                    value: 'cw',
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
                type: 'schoolkit_motor',
            },
            paramsKeyMap: {
                MODE: 0,
                VALUE: 1,
                OPERATOR: 2,
            },
            class: 'schoolkit_set',
            isNotFor: ['roborobo_schoolkit'],
            func: function(sprite, script) {
                var mode = script.getField('MODE');
                var pin = 0;
                var operator = script.getField('OPERATOR');
                var value = script.getField('VALUE');

                if (mode == 'motor1') {
                    pin = 0;
                } else {
                    pin = 1;
                }

                if (value > 255) {
                    value = 255;
                } else if (value < 0) {
                    value = 0;
                }

                if (!Entry.hw.sendQueue.digitalPinMode) {
                    Entry.hw.sendQueue.digitalPinMode = {};
                }

                Entry.hw.sendQueue.digitalPinMode[pin] = Entry.Roborobo_SchoolKit.pinMode.PWM;
                Entry.hw.sendQueue.digitalPinMode[pin + 7] = Entry.Roborobo_SchoolKit.pinMode.PWM;
                if (operator == 'cw') {
                    Entry.hw.sendQueue[pin] = value;
                } else if (operator == 'ccw') {
                    Entry.hw.sendQueue[pin] = -value;
                } else if (operator == 'stop') {
                    Entry.hw.sendQueue[pin] = 0x00;
                }
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roborobo_schoolkit.move_motor_speed(%1, %2, %3)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.roborobo_motor1, 'motor1'],
                                    [Lang.Blocks.roborobo_motor2, 'motor2'],
                                ],
                                value: 'motor1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    ['0', '45'],
                                    ['1', '59'],
                                    ['2', '73'],
                                    ['3', '87'],
                                    ['4', '101'],
                                    ['5', '115'],
                                    ['6', '129'],
                                    ['7', '143'],
                                    ['8', '157'],
                                    ['9', '171'],
                                    ['10', '185'],
                                    ['11', '199'],
                                    ['12', '213'],
                                    ['13', '227'],
                                    ['14', '241'],
                                    ['15', '255'],
                                ],
                                value: '45',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.roborobo_motor_CW, 'cw'],
                                    [Lang.Blocks.roborobo_motor_CCW, 'ccw'],
                                    [Lang.Blocks.roborobo_motor_stop, 'stop'],
                                ],
                                value: 'cw',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        schoolkit_set_servo_value: {
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
                        type: 'schoolkit_get_servo_port_number',
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'schoolkit_set_servo_value',
            },
            paramsKeyMap: {
                PIN: 0,
                VALUE: 1,
            },
            class: 'schoolkit_set',
            isNotFor: ['roborobo_schoolkit'],
            func: function(sprite, script) {
                var pin = script.getNumberValue('PIN', script);
                var value = script.getNumberValue('VALUE');

                if (!Entry.hw.sendQueue.digitalPinMode) {
                    Entry.hw.sendQueue.digitalPinMode = {};
                }
                Entry.hw.sendQueue.digitalPinMode[pin] = Entry.Roborobo_SchoolKit.pinMode.SERVO;

                if (value < 0) {
                    value = 0;
                } else if (value > 180) {
                    value = 180;
                }
                Entry.hw.sendQueue[pin] = value;
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roborobo_schoolkit.move_servo(%1, %2)',
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
        //endregion schoolkit 스쿨키트
    };
};

Entry.Roborobo_RoE.setLanguage = function() {
    return {
        ko: {
            template: {
                roe_set_led: '%1 LED 켜기 %2',
                roe_set_led_off: 'LED 끄기 %1',
                roe_set_motor: '로이 %1 %2',
                roe_set_motor_value: '%1 모터 : %2 만큼 %3 %4',
                roe_set_melody: '%1 옥타브 %2 을(를) %3 초 연주 %4',
                roe_get_input_switch: '접촉센서가 %1 ?',
                roe_get_input_ir: '적외선 센서가 %1 ?',
                roe_get_input_color: '%1 컬러센서 값이 %2 인가?',
                roe_led_color_dropdown: '%1',
                roe_melody_dropdown: '%1',
                roe_motor_dropdown: '%1',
                roe_movement_dropdown: '%1',
                roe_detect_dropdown: '%1',
                roe_color_select_dropdown: '%1',
                roe_color_color_dropdown: '%1',
            },
            Blocks: {
                roe_color_sensor_left: '왼쪽',
                roe_color_sensor_right: '오른쪽',
                roe_color_sensor_both: '양쪽',
                roe_color_red: '빨간색',
                roe_color_orange: '주황색',
                roe_color_yellow: '노란색',
                roe_color_yellowgreen: '연두색',
                roe_color_green: '초록색',
                roe_color_skyblue: '하늘색',
                roe_color_blue: '파란색',
                roe_color_purple: '보라색',
                roe_color_pink: '분홍색',
                roe_color_white: '흰색',
                roe_color_black: '검정색',
                roe_color_random: '무작위 색',
                roe_color_none: '미감지',
                roe_motor_both: '양쪽',
                roe_motor_left: '왼쪽',
                roe_motor_right: '오른쪽',
                roe_move_forward: '전진',
                roe_move_backward: '후진',
                roe_move_turnleft: '좌회전',
                roe_move_turnright: '우회전',
                roe_move_stop: '정지',
                roe_detected: '감지되었는가',
                roe_undetected: '감지되지 않았는가',
                roe_melody_do: '도',
                roe_melody_doS: '도#',
                roe_melody_re: '레',
                roe_melody_miF: '미b',
                roe_melody_mi: '미',
                roe_melody_pa: '파',
                roe_melody_paS: '파#',
                roe_melody_sol: '솔',
                roe_melody_solS: '솔#',
                roe_melody_la: '라',
                roe_melody_siF: '시b',
                roe_melody_si: '시',
            }
        },
        en: {
            template: {
                roe_set_led: 'Turn on %1 LED %2',
                roe_set_led_off: 'Turn off LED %1',
                roe_set_motor: 'Ro-E %1 %2',
                roe_set_motor_value: '%1 motor(s) : Move %3 by %2 %4',
                roe_set_melody: 'Play %1 octave %2 tone for %3 second(s) %4',
                roe_get_input_switch: 'Is the switch sensor %1 ?',
                roe_get_input_ir: 'Is the IR sensor %1 ?',
                roe_get_input_color: 'Is %1 color sensor value %2 ?',
                roe_led_color_dropdown: '%1',
                roe_melody_dropdown: '%1',
                roe_motor_dropdown: '%1',
                roe_movement_dropdown: '%1',
                roe_detect_dropdown: '%1',
                roe_color_select_dropdown: '%1',
                roe_color_color_dropdown: '%1',
            },
            Blocks: {
                roe_color_sensor_left: 'left',
                roe_color_sensor_right: 'right',
                roe_color_sensor_both: 'both',
                roe_color_red: 'Red',
                roe_color_orange: 'Orange',
                roe_color_yellow: 'Yellow',
                roe_color_yellowgreen: 'Yellow Green',
                roe_color_green: 'Green',
                roe_color_skyblue: 'Sky Blue',
                roe_color_blue: 'Blue',
                roe_color_purple: 'Purple',
                roe_color_pink: 'Pink',
                roe_color_white: 'White',
                roe_color_black: 'Black',
                roe_color_random: 'Random',
                roe_color_none: 'Undetected',
                roe_motor_both: 'Both',
                roe_motor_left: 'Left',
                roe_motor_right: 'Right',
                roe_move_forward: 'forward',
                roe_move_backward: 'backward',
                roe_move_turnleft: 'turn left',
                roe_move_turnright: 'turn right',
                roe_move_stop: 'stop',
                roe_detected: 'detected',
                roe_undetected: 'undetected',
                roe_melody_do: 'C',
                roe_melody_doS: 'C#',
                roe_melody_re: 'D',
                roe_melody_miF: 'Eb',
                roe_melody_mi: 'E',
                roe_melody_pa: 'F',
                roe_melody_paS: 'F#',
                roe_melody_sol: 'G',
                roe_melody_solS: 'G#',
                roe_melody_la: 'A',
                roe_melody_siF: 'Bb',
                roe_melody_si: 'B',
            },
        },
    };
};

Entry.Roborobo_RoE.blockMenuBlocks = [
    'roe_set_led',
    'roe_set_led_off',
    'roe_set_motor',
    'roe_set_motor_value',
    'roe_set_melody',
    'roe_get_input_switch',
    'roe_get_input_ir',
    'roe_get_input_color',
];

Entry.Roborobo_RoE.getBlocks = function() {
    return {
        //region roe 로이
        roe_led_color_dropdown: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.roe_color_red, 1],
                        [Lang.Blocks.roe_color_orange, 2],
                        [Lang.Blocks.roe_color_yellow, 3],
                        [Lang.Blocks.roe_color_yellowgreen, 4],
                        [Lang.Blocks.roe_color_green, 5],
                        [Lang.Blocks.roe_color_skyblue, 6],
                        [Lang.Blocks.roe_color_blue, 7],
                        [Lang.Blocks.roe_color_purple, 8],
                        [Lang.Blocks.roe_color_pink, 9],
                        [Lang.Blocks.roe_color_white, 10]
                    ],
                    value: 1,
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
                return script.getNumberField('VALUE');
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
                                    [Lang.Blocks.roe_color_red, 1],
                                    [Lang.Blocks.roe_color_orange, 2],
                                    [Lang.Blocks.roe_color_yellow, 3],
                                    [Lang.Blocks.roe_color_yellowgreen, 4],
                                    [Lang.Blocks.roe_color_green, 5],
                                    [Lang.Blocks.roe_color_skyblue, 6],
                                    [Lang.Blocks.roe_color_blue, 7],
                                    [Lang.Blocks.roe_color_purple, 8],
                                    [Lang.Blocks.roe_color_pink, 9],
                                    [Lang.Blocks.roe_color_white, 10]
                                ],
                                value: 1,
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        keyOption: 'roe_led_color_dropdown',
                    },
                ],
            },
        },
        roe_melody_dropdown: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.roe_melody_do, 1],
                        [Lang.Blocks.roe_melody_re, 2],
                        [Lang.Blocks.roe_melody_mi, 3],
                        [Lang.Blocks.roe_melody_pa, 4],
                        [Lang.Blocks.roe_melody_sol, 5],
                        [Lang.Blocks.roe_melody_la, 6],
                        [Lang.Blocks.roe_melody_si, 7],
                    ],
                    value: 1,
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
                return script.getNumberField('VALUE', script);
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
                                    [Lang.Blocks.roe_melody_do, 1],
                                    [Lang.Blocks.roe_melody_re, 2],
                                    [Lang.Blocks.roe_melody_mi, 3],
                                    [Lang.Blocks.roe_melody_pa, 4],
                                    [Lang.Blocks.roe_melody_sol, 5],
                                    [Lang.Blocks.roe_melody_la, 6],
                                    [Lang.Blocks.roe_melody_si, 7],
                                ],
                                value: 1,
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'roe_melody_dropdown',
                    },
                ],
            },
        },
        roe_motor_dropdown: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.roe_motor_both, 1],
                        [Lang.Blocks.roe_motor_left, 2],
                        [Lang.Blocks.roe_motor_right, 3],
                    ],
                    value: 1,
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
                return script.getNumberField('VALUE');
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
                                    [Lang.Blocks.roe_motor_both, 1],
                                    [Lang.Blocks.roe_motor_left, 2],
                                    [Lang.Blocks.roe_motor_right, 3],
                                ],
                                value: 1,
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        keyOption: 'roe_motor_dropdown',
                    },
                ],
            },
        },
        roe_movement_dropdown: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.roe_move_forward, 1],
                        [Lang.Blocks.roe_move_backward, 2],
                        [Lang.Blocks.roe_move_turnleft, 3],
                        [Lang.Blocks.roe_move_turnright, 4],
                        [Lang.Blocks.roe_move_stop, 5],
                    ],
                    value: 1,
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
                return script.getNumberField('VALUE');
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
                                    [Lang.Blocks.roe_move_forward, 1],
                                    [Lang.Blocks.roe_move_backward, 2],
                                    [Lang.Blocks.roe_move_turnleft, 3],
                                    [Lang.Blocks.roe_move_turnright, 4],
                                    [Lang.Blocks.roe_move_stop, 5],
                                ],
                                value: 1,
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        keyOption: 'roe_movement_dropdown',
                    },
                ],
            },
        },
        roe_detect_dropdown: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.roe_detected, 1],
                        [Lang.Blocks.roe_undetected, 0],
                    ],
                    value: 1,
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
                return script.getNumberField('VALUE');
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
                                    [Lang.Blocks.roe_detected, 1],
                                    [Lang.Blocks.roe_undetected, 2],
                                ],
                                value: 1,
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        keyOption: 'roe_detect_dropdown',
                    },
                ],
            },
        },
        roe_color_select_dropdown: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.roe_color_sensor_both, 1],
                        [Lang.Blocks.roe_color_sensor_left, 2],
                        [Lang.Blocks.roe_color_sensor_right, 3],
                    ],
                    value: 1,
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
                return script.getNumberField('VALUE');
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
                                    [Lang.Blocks.roe_color_sensor_both, 1],
                                    [Lang.Blocks.roe_color_sensor_left, 2],
                                    [Lang.Blocks.roe_color_sensor_right, 3],
                                ],
                                value: 1,
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        keyOption: 'roe_color_select_dropdown',
                    },
                ],
            },
        },
        roe_color_color_dropdown: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.roe_color_red, 1],
                        [Lang.Blocks.roe_color_orange, 2],
                        [Lang.Blocks.roe_color_yellow, 3],
                        [Lang.Blocks.roe_color_yellowgreen, 7],
                        [Lang.Blocks.roe_color_green, 4],
                        [Lang.Blocks.roe_color_skyblue, 8],
                        [Lang.Blocks.roe_color_blue, 5],
                        [Lang.Blocks.roe_color_purple, 6],
                        [Lang.Blocks.roe_color_pink, 9],
                        [Lang.Blocks.roe_color_black, 10],
                        [Lang.Blocks.roe_color_white, 11],
                        [Lang.Blocks.roe_color_none, 127],
                    ],
                    value: 1,
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
                return script.getNumberField('VALUE');
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
                                    [Lang.Blocks.roe_color_red, 1],
                                    [Lang.Blocks.roe_color_orange, 2],
                                    [Lang.Blocks.roe_color_yellow, 3],
                                    [Lang.Blocks.roe_color_yellowgreen, 7],
                                    [Lang.Blocks.roe_color_green, 4],
                                    [Lang.Blocks.roe_color_skyblue, 8],
                                    [Lang.Blocks.roe_color_blue, 5],
                                    [Lang.Blocks.roe_color_purple, 6],
                                    [Lang.Blocks.roe_color_pink, 9],
                                    [Lang.Blocks.roe_color_black, 10],
                                    [Lang.Blocks.roe_color_white, 11],
                                    [Lang.Blocks.roe_color_none, 127],
                                ],
                                value: 1,
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        keyOption: 'roe_color_color_dropdown',
                    },
                ],
            },
        },
        roe_set_led: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string'
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12
                }
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'roe_led_color_dropdown',
                    },
                    null
                ],
                type: 'roe_set_led',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'roe_set',
            isNotFor: ['roborobo_roe'],
            func: function(sprite, script) {
                var color = script.getNumberValue('VALUE', script);
                Entry.hw.sendQueue['LED'] = color;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roborobo_roe.roe_set_led(%1)',
                        textParams: [
                            {
                                type: "Block",
                                accept: "string"
                            },
                            {
                                type: 'roe_led_color_dropdown'
                            }
                        ],
                    },
                ],
            },
        },
        roe_set_led_off: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: "Indicator",
                    img: "block_icon/hardware_icon.svg",
                    size: 12
                }
            ],
            events: {},
            def: {
                params: [
                    null
                ],
                type: 'roe_set_led_off'
            },
            paramsKeyMap: {},
            class: 'roe_set',
            isNotFor: ['roborobo_roe'],
            func: function(sprite, script) {
                Entry.hw.sendQueue['LED'] = 0;
            },
            syntax: {
                js: [],
                py: ['Roborobo_roe.roe_set_led_off()'],
            },
        },
        roe_set_melody: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['4', '4'],
                        ['5', '5'],
                        ['6', '6'],
                        ['7', '7'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string'
                },
                {
                    type: 'Block',
                    accept: 'string'
                },
                {
                    type: "Indicator",
                    img: "block_icon/hardware_icon.svg",
                    size: 12
                }
            ],
            events: {},
            def: {
                params: [
                    '4',
                    {
                        type: 'roe_melody_dropdown',
                    },
                    '1',
                    null
                ],
                type: 'roe_set_melody',
            },
            paramsKeyMap: {
                OCTAVE: 0,
                NOTE: 1,
                DURATION: 2
            },
            class: 'roe_set',
            isNotFor: ['roborobo_roe'],
            func: function(sprite, script) {
                if (!script.isStart) {
                    var octave = script.getNumberValue('OCTAVE', script);
                    var note = script.getNumberValue('NOTE', script);
                    var duration = script.getNumberValue('DURATION', script);

                    if(octave < 4) {
                        octave = 4;
                    } else  if (octave > 7) {
                        octave = 7;
                    }

                    if(note < 1) {
                        note = 1;
                    } else if (note > 7) {
                        note = 7;
                    }
                    duration = duration < 0 ? 0 : duration;
                    duration = duration * 1000;

                    script.isStart = true;
                    script.timeFlag = 1;

                    Entry.hw.sendQueue['Melody'] = [octave, note, duration];

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, duration);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roborobo_roe.roe_set_melody(%1 %2 %3)',
                        textParams: [
                            '4',
                            {
                                type: 'roe_melody_dropdown',
                            },
                            '1',
                        ],
                    },
                ],
            },
        },
        roe_set_motor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: "Block",
                    accept: "string"
                },
                {
                    type: "Indicator",
                    img: "block_icon/hardware_icon.svg",
                    size: 12
                }
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'roe_movement_dropdown'
                    },
                    null
                ],
                type: 'roe_set_motor'
            },
            paramsKeyMap: {
                OPERATOR: 0,
            },
            class: 'roe_set',
            isNotFor: ['roborobo_roe'],
            func: function(sprite, script) {
                var op = script.getNumberValue('OPERATOR', script);
                if(op == 1) {
                    Entry.hw.sendQueue['LeftMotor'] = [ Entry.Roborobo_RoE.motorDiretion.CCW, 0 ];
                    Entry.hw.sendQueue['RightMotor'] = [ Entry.Roborobo_RoE.motorDiretion.CW, 0 ];
                } else if (op == 2) {
                    Entry.hw.sendQueue['LeftMotor'] = [ Entry.Roborobo_RoE.motorDiretion.CW, 0] ;
                    Entry.hw.sendQueue['RightMotor'] = [ Entry.Roborobo_RoE.motorDiretion.CCW, 0 ];
                } else if (op == 3) {
                    Entry.hw.sendQueue['LeftMotor'] = [ Entry.Roborobo_RoE.motorDiretion.CW, 0 ];
                    Entry.hw.sendQueue['RightMotor'] = [ Entry.Roborobo_RoE.motorDiretion.CW, 0 ];
                } else if (op == 4) {
                    Entry.hw.sendQueue['LeftMotor'] = [ Entry.Roborobo_RoE.motorDiretion.CCW, 0 ];
                    Entry.hw.sendQueue['RightMotor'] = [ Entry.Roborobo_RoE.motorDiretion.CCW, 0 ];
                } else if (op == 5) {
                    Entry.hw.sendQueue['LeftMotor'] = [ Entry.Roborobo_RoE.motorDiretion.STOP, 0 ];
                    Entry.hw.sendQueue['RightMotor'] = [ Entry.Roborobo_RoE.motorDiretion.STOP,0 ];
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roborobo_roe.roe_set_motor(%1)',
                        textParams: [
                            {
                                type: 'roe_movement_dropdown'
                            },
                        ],
                    },
                ],
            },
        },
        roe_set_motor_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: "Block",
                    accept: "string"
                },
                {
                    type: "Block",
                    accept: "string"
                },
                {
                    type: "Block",
                    accept: "string"
                },
                {
                    type: "Indicator",
                    img: "block_icon/hardware_icon.svg",
                    size: 12
                }
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'roe_motor_dropdown'
                    },
                    '100',
                    {
                        type: 'roe_movement_dropdown'
                    },
                    null
                ],
                type: 'roe_set_motor_value'
            },
            paramsKeyMap: {
                MOTOR: 0,
                VALUE: 1,
                OPERATOR: 2,
            },
            class: 'roe_set',
            isNotFor: ['roborobo_roe'],
            func: function(sprite, script) {
                var motor = script.getNumberValue('MOTOR', script);
                var value = script.getNumberValue('VALUE', script);
                var op = script.getNumberValue('OPERATOR', script);

                if(value < 0) {
                    value = 0;
                } else if(value > 100) {
                    value = 100;
                }

                if(motor == 1) {
                    if(op == 1) {
                        Entry.hw.sendQueue['LeftMotor'] = [ Entry.Roborobo_RoE.motorDiretion.CCW, value ];
                        Entry.hw.sendQueue['RightMotor'] = [ Entry.Roborobo_RoE.motorDiretion.CW, value ];
                    } else if (op == 2) {
                        Entry.hw.sendQueue['LeftMotor'] = [ Entry.Roborobo_RoE.motorDiretion.CW, value ] ;
                        Entry.hw.sendQueue['RightMotor'] = [ Entry.Roborobo_RoE.motorDiretion.CCW, value ];
                    } else if (op == 3) {
                        Entry.hw.sendQueue['LeftMotor'] = [ Entry.Roborobo_RoE.motorDiretion.CW, value ];
                        Entry.hw.sendQueue['RightMotor'] = [ Entry.Roborobo_RoE.motorDiretion.CW, value ];
                    } else if (op == 4) {
                        Entry.hw.sendQueue['LeftMotor'] = [ Entry.Roborobo_RoE.motorDiretion.CCW, value ];
                        Entry.hw.sendQueue['RightMotor'] = [ Entry.Roborobo_RoE.motorDiretion.CCW, value ];
                    } else if (op == 5) {
                        Entry.hw.sendQueue['LeftMotor'] = [ Entry.Roborobo_RoE.motorDiretion.STOP, value ];
                        Entry.hw.sendQueue['RightMotor'] = [ Entry.Roborobo_RoE.motorDiretion.STOP, value ];
                    }
                } else if (motor == 2) {
                    if(op == 1) {
                        Entry.hw.sendQueue['LeftMotor'] = [ Entry.Roborobo_RoE.motorDiretion.CCW, value ];
                    } else if (op == 2) {
                        Entry.hw.sendQueue['LeftMotor'] = [ Entry.Roborobo_RoE.motorDiretion.CW, value ] ;
                    } else if (op == 3) {
                        Entry.hw.sendQueue['LeftMotor'] = [ Entry.Roborobo_RoE.motorDiretion.CW, value ];
                    } else if (op == 4) {
                        Entry.hw.sendQueue['LeftMotor'] = [ Entry.Roborobo_RoE.motorDiretion.CCW, value ];
                    } else if (op == 5) {
                        Entry.hw.sendQueue['LeftMotor'] = [ Entry.Roborobo_RoE.motorDiretion.STOP, value ];
                    }
                } else if (motor == 3) {
                    if(op == 1) {
                        Entry.hw.sendQueue['RightMotor'] = [ Entry.Roborobo_RoE.motorDiretion.CW, value ];
                    } else if (op == 2) {
                        Entry.hw.sendQueue['RightMotor'] = [ Entry.Roborobo_RoE.motorDiretion.CCW, value ];
                    } else if (op == 3) {
                        Entry.hw.sendQueue['RightMotor'] = [ Entry.Roborobo_RoE.motorDiretion.CW, value ];
                    } else if (op == 4) {
                        Entry.hw.sendQueue['RightMotor'] = [ Entry.Roborobo_RoE.motorDiretion.CCW, value ];
                    } else if (op == 5) {
                        Entry.hw.sendQueue['RightMotor'] = [ Entry.Roborobo_RoE.motorDiretion.STOP, value ];
                    }
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roborobo_roe.roe_set_motor_value(%1 %2 %3)',
                        textParams: [
                            {
                                type: 'roe_motor_dropdown'
                            },
                            '100',
                            {
                                type: 'roe_movement_dropdown'
                            },
                        ],
                    },
                ],
            },
        },
        roe_get_input_switch: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string'
                },
                {
                    type: "Indicator",
                    img: "block_icon/hardware_icon.svg",
                    size: 12
                }
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'roe_detect_dropdown',
                    },
                    null
                ],
                type: 'roe_get_input_switch'
            },
            paramsKeyMap: {
                DETECT: 0
            },
            class: 'roe_get',
            isNotFor: ['roborobo_roe'],
            func: function(sprite, script) {
                var detect = script.getNumberValue('DETECT', script);
                var value = Entry.hw.portData['Switch'];
                // console.log('Switch Value : ' + value);
                return detect == value ? true : false;
            },
            syntax: {
                js: [],
                py: ['Roborobo_roe.roe_get_input_switch()'],
            },
        },
        roe_get_input_ir: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string'
                },
                {
                    type: "Indicator",
                    img: "block_icon/hardware_icon.svg",
                    size: 12
                }
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'roe_detect_dropdown',
                    },
                    null
                ],
                type: 'roe_get_input_ir'
            },
            paramsKeyMap: {
                DETECT: 0
            },
            class: 'roe_get',
            isNotFor: ['roborobo_roe'],
            func: function(sprite, script) {
                var detect = script.getNumberValue('DETECT', script);
                var value = Entry.hw.portData['IR'];
                // console.log('IR Value : ' + value);
                return detect == value ? true : false;
            },
            syntax: {
                js: [],
                py: ['Roborobo_roe.roe_get_input_ir()'],
            },
        },
        roe_get_input_color: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string'
                },
                {
                    type: 'Block',
                    accept: 'string'
                },
                {
                    type: "Indicator",
                    img: "block_icon/hardware_icon.svg",
                    size: 12
                }
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'roe_color_select_dropdown',
                    },
                    {
                        type: 'roe_color_color_dropdown',
                    },
                    null
                ],
                type: 'roe_get_input_color'
            },
            paramsKeyMap: {
                SENSOR: 0,
                COLOR: 1
            },
            class: 'roe_get',
            isNotFor: ['roborobo_roe'],
            func: function(sprite, script) {
                var result = false;
                var sensor = script.getNumberValue('SENSOR', script);
                var color = script.getNumberValue('COLOR', script);
                var left = Entry.hw.portData['LeftColor'];
                var right = Entry.hw.portData['RightColor'];
                
                if(sensor == 1) {
                    if(left == color && right == color) {
                        result = true;
                    }
                } else if (sensor == 2) {
                    result = left == color ? true : false;
                } else if (sensor == 3) {
                    result = right == color ? true : false;
                }
                return result;
            },
            syntax: {
                js: [],
                py: ['Roborobo_roe.roe_get_input_color()'],
            },
        },
        //endregion roe 로이
    };
};

module.exports = [Entry.Roborobo_Roduino, Entry.Roborobo_SchoolKit, Entry.Roborobo_RoE];
