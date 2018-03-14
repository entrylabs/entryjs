'use strict';

Entry.Roborobo_Roduino = {
    name: 'roborobo_roduino',
    INSTRUCTION: {
        DIGITAL_READ: 1,
        DIGITAL_SET_MODE: 2,
        DIGITAL_WRITE: 3,
        ANALOG_WRITE: 4,
        ANALOG_READ: 5,
        MOTOR: 6,
        COLOR: 7,
    },
    setZero: function() {
        Entry.hw.sendQueue.colorPin = 0;
        for (var port = 0; port < 14; port++) {
            Entry.hw.sendQueue[port] = 0;
        }
        this.ColorPin = [0, 0, 0];
        Entry.hw.update();
    },
    ColorPin: [0, 0, 0],
};

Entry.Roborobo_SchoolKit = {
    name: 'roborobo_schoolkit',
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
        Entry.hw.sendQueue.servo = [false, false, false, false, false];
        for (var port = 0; port < 14; port++) {
            Entry.hw.sendQueue[port] = 0;
            Entry.hw.sendQueue.digitalPinMode[port] = 0;
        }
        Entry.hw.update();
    },
};

Entry.Roborobo_Roduino.getBlocks = function() {
    return {
        //region roduino 로두이노
        roduino_on_block: {
            color: '#00979D',
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
        },
        roduino_off_block: {
            color: '#00979D',
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
        },
        roduino_get_analog_number: {
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
                    ],
                    value: '0',
                    fontSize: 11,
                    arrowColor: EntryStatic.ARROW_COLOR_HW,
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
        },
        roduino_get_port_number: {
            color: '#00979D',
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
                    arrowColor: EntryStatic.ARROW_COLOR_HW,
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
        },
        roduino_get_analog_value: {
            color: '#00979D',
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
        },
        roduino_get_digital_value: {
            color: '#00979D',
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
                Entry.hw.sendQueue[0] =
                    Entry.Roborobo_Roduino.INSTRUCTION.DIGITAL_READ;
                Entry.hw.sendQueue[1] = signal;
                Entry.hw.update();
                return Entry.hw.getDigitalPortValue(signal - 2);
            },
        },
        roduino_get_color: {
            color: '#00979D',
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
                    arrowColor: EntryStatic.ARROW_COLOR_HW,
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
                    Entry.hw.portData[Entry.Roborobo_Roduino.ColorPin[0] - 2],
                    Entry.hw.portData[Entry.Roborobo_Roduino.ColorPin[1] - 2],
                    Entry.hw.portData[Entry.Roborobo_Roduino.ColorPin[2] - 2],
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
        },
        roduino_set_digital: {
            color: '#00979D',
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

                // Entry.hw.sendQueue[0] = Entry.Roborobo_Roduino.INSTRUCTION.DIGITAL_WRITE;
                // Entry.hw.sendQueue[1] = pin;
                Entry.hw.setDigitalPortValue(pin, value);
                return script.callReturn();
            },
        },
        roduino_motor: {
            color: '#00979D',
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
                    arrowColor: EntryStatic.ARROW_COLOR_HW,
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
                var pin1 = 0
                var pin2 = 0;
                var value1 = 0
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
                Entry.hw.setDigitalPortValue(pin1, value1);
                Entry.hw.setDigitalPortValue(pin2, value2);
                return script.callReturn();
            },
        },
        roduino_set_color_pin: {
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
                Entry.hw.sendQueue[0] =
                    Entry.Roborobo_Roduino.INSTRUCTION.COLOR;
                Entry.hw.sendQueue.colorPin = redPin;
                Entry.hw.update();
                return script.callReturn();
            },
        },
        //endregion roduino 로두이노
    };
};

Entry.Roborobo_SchoolKit.getBlocks = function() {
    return {
        //region schoolkit 스쿨키트
        schoolkit_on_block: {
            color: '#00979D',
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
        },
        schoolkit_off_block: {
            color: '#00979D',
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
        },
        schoolkit_get_out_port_number: {
            color: '#00979D',
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
                    arrowColor: EntryStatic.ARROW_COLOR_HW,
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
        },
        schoolkit_get_servo_port_number: {
            color: '#00979D',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['OUT1', 2], ['OUT2', 3], ['OUT3', 4]],
                    value: 2,
                    fontSize: 11,
                    arrowColor: EntryStatic.ARROW_COLOR_HW,
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
        },
        schoolkit_get_in_port_number: {
            color: '#00979D',
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
                    arrowColor: EntryStatic.ARROW_COLOR_HW,
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
        },
        schoolkit_set_output: {
            color: '#00979D',
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

                Entry.hw.sendQueue.digitalPinMode[pin] =
                    Entry.Roborobo_SchoolKit.pinMode.OUTPUT;
                Entry.hw.sendQueue[pin] = value;
                return script.callReturn();
            },
        },
        schoolkit_get_input_value: {
            color: '#00979D',
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
        },
        schoolkit_motor: {
            color: '#00979D',
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
                    arrowColor: EntryStatic.ARROW_COLOR_HW,
                },
                {
                    type: 'Block',
                    accept: 'string',
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
                    null,
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    null,
                    null,
                ],
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
                var value = script.getNumberValue('VALUE');

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

                Entry.hw.sendQueue.digitalPinMode[pin] =
                    Entry.Roborobo_SchoolKit.pinMode.PWM;
                Entry.hw.sendQueue.digitalPinMode[pin + 7] =
                    Entry.Roborobo_SchoolKit.pinMode.PWM;
                if (operator == 'cw') {
                    Entry.hw.sendQueue[pin] = value;
                } else if (operator == 'ccw') {
                    Entry.hw.sendQueue[pin] = -value;
                } else if (operator == 'stop') {
                    Entry.hw.sendQueue[pin] = 0x00;
                }
                return script.callReturn();
            },
        },
        schoolkit_set_servo_value: {
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

                if (!Entry.hw.sendQueue.servo) {
                    Entry.hw.sendQueue.servo = {};
                }

                Entry.hw.sendQueue.digitalPinMode[pin] =
                    Entry.Roborobo_SchoolKit.pinMode.SERVO;

                if (value < 0) {
                    value = 0;
                } else if (value > 180) {
                    value = 180;
                }
                Entry.hw.sendQueue.servo[pin - 2] = true;
                Entry.hw.sendQueue[pin] = value;
                return script.callReturn();
            },
        },
        //endregion schoolkit 스쿨키트
    };
};
