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
            },
        },
        en: {
            template: {
                roduino_set_servo_value: 'Servo %1 Pin %2˚ %3',
                roduino_set_pwm_value: 'PWM Set pin %1 to %2',
                roduino_get_sensor_analog_value: 'analog %1 Pin %2 value',
                roduino_get_sensor_digital_value: 'digital %1 %2 번 핀 값',
            },
            Blocks: {
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
                    options: [[Lang.Blocks.roborobo_on, 'on'], [Lang.Blocks.roborobo_off, 'off']],
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
                    options: [['3', 3], ['5', 5], ['6', 6]],
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
                                options: [['3', 3], ['5', 5], ['6', 6]],
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
                    options: [['3', 3], ['5', 5], ['6', 6]],
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
                                options: [['3', 3], ['5', 5], ['6', 6]],
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
                    options: [['OUT1', 2], ['OUT2', 3], ['OUT3', 4], ['OUT4', 5], ['OUT5', 6]],
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
                    options: [['OUT1', 2], ['OUT2', 3], ['OUT3', 4]],
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
                                options: [['OUT1', 2], ['OUT2', 3], ['OUT3', 4]],
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
                    options: [[Lang.Blocks.roborobo_on, 'on'], [Lang.Blocks.roborobo_off, 'off']],
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

module.exports = [Entry.Roborobo_Roduino, Entry.Roborobo_SchoolKit];
