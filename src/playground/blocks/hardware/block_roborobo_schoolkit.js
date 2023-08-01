'use strict';

Entry.Roborobo_SchoolKit = {
    hasPracticalCourse: true,
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
    setZero: function () {
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

Entry.Roborobo_SchoolKit.setLanguage = function () {
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

Entry.Roborobo_SchoolKit.practicalBlockMenuBlocks = {
    hw_motor: [
        // 'roborobo_motor_speed',
        'roborobo_move_for_secs',
        'roborobo_move_for',
        'roborobo_turn_for',
        'roborobo_stop_for',
    ],
    hw_melody: [

    ],
    hw_sensor: [
        'roborobo_touch_value',
        'roborobo_touch_value_boolean',
        'roborobo_light_value',
        'roborobo_light_value_boolean',
        'roborobo_sound_value',
        'roborobo_sound_value_boolean',
        'roborobo_irs_value',
        'roborobo_irs_value_boolean',
    ],
    hw_led: [
        'roborobo_diode_secs_toggle',
        'roborobo_diode_toggle',
        'roborobo_diode_inout_toggle',
        'roborobo_diode_set_output',
        'roborobo_diode_input_value',
    ],
}

Entry.Roborobo_SchoolKit.getBlocks = function () {
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
            func: function (sprite, script) {
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
            func: function (sprite, script) {
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
            func: function (sprite, script) {
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
            func: function (sprite, script) {
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
            func: function (sprite, script) {
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
            func: function (sprite, script) {
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
            func: function (sprite, script) {
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
            func: function (sprite, script) {
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
            func: function (sprite, script) {
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

Entry.Roborobo_SchoolKit.getPracticalBlocks = function () {
    return {
        // roborobo_mini
        roborobo_motor_speed: {
            color: '#00B200',
            outerLine: '#019101',
            skeleton: 'basic_string_field',
            statements: [],
            isNotFor: ['roborobo_schoolkit'],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', '52'],
                        ['2', '66'],
                        ['3', '80'],
                        ['4', '94'],
                        ['5', '107'],
                        ['6', '120'],
                        ['7', '134'],
                        ['8', '148'],
                        ['9', '162'],
                        ['10', '176'],
                        ['11', '190'],
                        ['12', '204'],
                        ['13', '218'],
                        ['14', '232'],
                        ['15', '255'],
                    ],
                    value: '255',
                    fontSize: 11,
                    bgColor: '#019101',
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            func (sprite, script) {
                return script.getStringField('VALUE');
            },
        },
        roborobo_move_for_secs: {
            color: '#00B200',
            outerLine: '#019101',
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            isNotFor: ['roborobo_schoolkit'],
            template: '%1모터를 %2 %3의 속도로 %4초 동안 회전 %5',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['양쪽', '1'],
                        ['오른쪽', '2'],
                        ['왼쪽', '3'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: '#019101',
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['앞으로', '1'],
                        ['뒤로', '2'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: '#019101',
                    arrowColor: EntryStatic.colorSet.common.WHITE,
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
                    img: 'block_icon/practical_course/dcmotor.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    null,
                    {
                        type: 'roborobo_motor_speed',
                    },
                    {
                        type: 'number',
                        params: ['2'],
                    },
                    null,
                ],
                type: 'roborobo_move_for_secs',
            },
            paramsKeyMap: {
                WHEEL: 0,
                DIRECTION: 1,
                SPEED: 2,
                DURATION: 3,
            },
            class: 'roborobo_motor',
            func (sprite, script) {
                const motor1 = 0;
                const motor2 = 1;
                const wheel = script.getNumberField('WHEEL');
                const speed = script.getNumberValue('SPEED');
                const direction = script.getNumberField('DIRECTION');
                const duration = script.getNumberValue('DURATION');

                if (!Entry.hw.sendQueue.digitalPinMode) {
                    Entry.hw.sendQueue.digitalPinMode = {};
                }

                if (!script.isStart) {
                    if (wheel == 1) {
                        Entry.hw.sendQueue.digitalPinMode[7] = Entry.Roborobo_SchoolKit.pinMode.PWM;
                        Entry.hw.sendQueue.digitalPinMode[0] = Entry.Roborobo_SchoolKit.pinMode.PWM;
                        Entry.hw.sendQueue.digitalPinMode[8] = Entry.Roborobo_SchoolKit.pinMode.PWM;
                        Entry.hw.sendQueue.digitalPinMode[1] = Entry.Roborobo_SchoolKit.pinMode.PWM;

                        if (direction == 1) {
                            Entry.hw.sendQueue[motor1] = speed;
                            Entry.hw.sendQueue[motor2] = speed;
                        } else if (direction == 2) {
                            Entry.hw.sendQueue[motor1] = -speed;
                            Entry.hw.sendQueue[motor2] = -speed;
                        }
                    } else if (wheel == 2) {
                        Entry.hw.sendQueue.digitalPinMode[8] = Entry.Roborobo_SchoolKit.pinMode.PWM;
                        Entry.hw.sendQueue.digitalPinMode[1] = Entry.Roborobo_SchoolKit.pinMode.PWM;

                        if (direction == 1) {
                            Entry.hw.sendQueue[motor1] = 0x00;
                            Entry.hw.sendQueue[motor2] = speed;
                        } else if (direction == 2) {
                            Entry.hw.sendQueue[motor1] = 0x00;
                            Entry.hw.sendQueue[motor2] = -speed;
                        }
                    } else if (wheel == 3) {
                        Entry.hw.sendQueue.digitalPinMode[7] = Entry.Roborobo_SchoolKit.pinMode.PWM;
                        Entry.hw.sendQueue.digitalPinMode[0] = Entry.Roborobo_SchoolKit.pinMode.PWM;

                        if (direction == 1) {
                            Entry.hw.sendQueue[motor1] = speed;
                            Entry.hw.sendQueue[motor2] = 0x00;
                        } else if (direction == 2) {
                            Entry.hw.sendQueue[motor1] = -speed;
                            Entry.hw.sendQueue[motor2] = 0x00;
                        }
                    }

                    script.wheelMode = wheel;
                    script.isStart = true;
                    script.timeFlag = 1;
                    setTimeout(() => {
                        script.timeFlag = 0;
                    }, duration * 1000);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    Entry.hw.sendQueue[motor1] = 0x00;
                    Entry.hw.sendQueue[motor2] = 0x00;

                    delete script.timeFlag;
                    delete script.isStart;
                    delete script.wheelMode;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
        },
        roborobo_move_for: {
            color: '#00B200',
            outerLine: '#019101',
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            isNotFor: ['roborobo_schoolkit'],
            template: '%1모터를 %2 %3의 속도로 계속 회전 %4',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['양쪽', '1'],
                        ['오른쪽', '2'],
                        ['왼쪽', '3'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: '#019101',
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['앞으로', '1'],
                        ['뒤로', '2'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: '#019101',
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/practical_course/dcmotor.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    null,
                    {
                        type: 'roborobo_motor_speed',
                    },
                    null,
                ],
                type: 'roborobo_move_for',
            },
            paramsKeyMap: {
                WHEEL: 0,
                DIRECTION: 1,
                SPEED: 2,
            },
            class: 'roborobo_motor',
            //'isNotFor': ['mini'],
            func (sprite, script) {
                const motor1 = 0;
                const motor2 = 1;
                const wheel = script.getNumberField('WHEEL');
                const speed = script.getNumberValue('SPEED');
                const direction = script.getNumberField('DIRECTION');

                if (!Entry.hw.sendQueue.digitalPinMode) {
                    Entry.hw.sendQueue.digitalPinMode = {};
                }

                if (wheel == 1) {
                    Entry.hw.sendQueue.digitalPinMode[7] = Entry.Roborobo_SchoolKit.pinMode.PWM;
                    Entry.hw.sendQueue.digitalPinMode[0] = Entry.Roborobo_SchoolKit.pinMode.PWM;
                    Entry.hw.sendQueue.digitalPinMode[8] = Entry.Roborobo_SchoolKit.pinMode.PWM;
                    Entry.hw.sendQueue.digitalPinMode[1] = Entry.Roborobo_SchoolKit.pinMode.PWM;

                    if (direction == 1) {
                        Entry.hw.sendQueue[motor1] = speed;
                        Entry.hw.sendQueue[motor2] = speed;
                    } else if (direction == 2) {
                        Entry.hw.sendQueue[motor1] = -speed;
                        Entry.hw.sendQueue[motor2] = -speed;
                    }
                } else if (wheel == 2) {
                    Entry.hw.sendQueue.digitalPinMode[8] = Entry.Roborobo_SchoolKit.pinMode.PWM;
                    Entry.hw.sendQueue.digitalPinMode[1] = Entry.Roborobo_SchoolKit.pinMode.PWM;

                    if (direction == 1) {
                        Entry.hw.sendQueue[motor1] = 0x00;
                        Entry.hw.sendQueue[motor2] = speed;
                    } else if (direction == 2) {
                        Entry.hw.sendQueue[motor1] = 0x00;
                        Entry.hw.sendQueue[motor2] = -speed;
                    }
                } else if (wheel == 3) {
                    Entry.hw.sendQueue.digitalPinMode[7] = Entry.Roborobo_SchoolKit.pinMode.PWM;
                    Entry.hw.sendQueue.digitalPinMode[0] = Entry.Roborobo_SchoolKit.pinMode.PWM;

                    if (direction == 1) {
                        Entry.hw.sendQueue[motor1] = speed;
                        Entry.hw.sendQueue[motor2] = 0x00;
                    } else if (direction == 2) {
                        Entry.hw.sendQueue[motor1] = -speed;
                        //Entry.hw.sendQueue[motor2] = 0x00;
                    }
                }

                return script.callReturn();
            },
        },
        roborobo_turn_for: {
            color: '#00B200',
            outerLine: '#019101',
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            isNotFor: ['roborobo_schoolkit'],
            template: '오른쪽 모터를 %1 %2, 왼쪽 모터를 %3 %4의 속도로 계속 회전 %5',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['앞으로', '1'],
                        ['뒤로', '2'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: '#019101',
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['앞으로', '1'],
                        ['뒤로', '2'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: '#019101',
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/practical_course/dcmotor.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    {type: 'roborobo_motor_speed'},
                    null,
                    {type: 'roborobo_motor_speed'},
                    null,
                ],
                type: 'roborobo_turn_for',
            },
            paramsKeyMap: {
                RDIR: 0,
                RSPEED: 1,
                LDIR: 2,
                LSPEED: 3,
            },
            class: 'roborobo_motor',
            //'isNotFor': ['mini'],
            func (sprite, script) {
                const motor1 = 0;
                const motor2 = 1;

                const rightDir = script.getNumberField('RDIR');
                const rightSpeed = script.getNumberValue('RSPEED');
                const leftDir = script.getNumberField('LDIR');
                const leftSpeed = script.getNumberValue('LSPEED');

                if (!Entry.hw.sendQueue.digitalPinMode) {
                    Entry.hw.sendQueue.digitalPinMode = {};
                }

                Entry.hw.sendQueue.digitalPinMode[7] = Entry.Roborobo_SchoolKit.pinMode.PWM;
                Entry.hw.sendQueue.digitalPinMode[0] = Entry.Roborobo_SchoolKit.pinMode.PWM;
                Entry.hw.sendQueue.digitalPinMode[8] = Entry.Roborobo_SchoolKit.pinMode.PWM;
                Entry.hw.sendQueue.digitalPinMode[1] = Entry.Roborobo_SchoolKit.pinMode.PWM;

                if (leftDir == 1) {
                    Entry.hw.sendQueue[motor1] = leftSpeed;
                } else {
                    Entry.hw.sendQueue[motor1] = -leftSpeed;
                }

                if (rightDir == 1) {
                    Entry.hw.sendQueue[motor2] = rightSpeed;
                } else {
                    Entry.hw.sendQueue[motor2] = -rightSpeed;
                }

                return script.callReturn();
            },
        },
        roborobo_stop_for: {
            color: '#00B200',
            outerLine: '#019101',
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            isNotFor: ['roborobo_schoolkit'],
            template: '%1모터를 정지 %2',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['양쪽', '1'],
                        ['오른쪽', '2'],
                        ['왼쪽', '3'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: '#019101',
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/practical_course/dcmotor.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null, null],
                type: 'roborobo_stop_for',
            },
            paramsKeyMap: {
                WHEEL: 0,
            },
            class: 'roborobo_motor',
            func (sprite, script) {
                const motor1 = 0;
                const motor2 = 1;
                const wheel = script.getNumberField('WHEEL');

                if (!Entry.hw.sendQueue.digitalPinMode) {
                    Entry.hw.sendQueue.digitalPinMode = {};
                }

                if (wheel == 1) {
                    Entry.hw.sendQueue.digitalPinMode[7] = Entry.Roborobo_SchoolKit.pinMode.PWM;
                    Entry.hw.sendQueue.digitalPinMode[0] = Entry.Roborobo_SchoolKit.pinMode.PWM;
                    Entry.hw.sendQueue.digitalPinMode[8] = Entry.Roborobo_SchoolKit.pinMode.PWM;
                    Entry.hw.sendQueue.digitalPinMode[1] = Entry.Roborobo_SchoolKit.pinMode.PWM;

                    Entry.hw.sendQueue[motor1] = 0x00;
                    Entry.hw.sendQueue[motor2] = 0x00;
                } else if (wheel == 2) {
                    Entry.hw.sendQueue.digitalPinMode[8] = Entry.Roborobo_SchoolKit.pinMode.PWM;
                    Entry.hw.sendQueue.digitalPinMode[1] = Entry.Roborobo_SchoolKit.pinMode.PWM;

                    Entry.hw.sendQueue[motor2] = 0x00;
                } else if (wheel == 3) {
                    Entry.hw.sendQueue.digitalPinMode[7] = Entry.Roborobo_SchoolKit.pinMode.PWM;
                    Entry.hw.sendQueue.digitalPinMode[0] = Entry.Roborobo_SchoolKit.pinMode.PWM;

                    Entry.hw.sendQueue[motor1] = 0x00;
                }

                return script.callReturn();
            },
        },
        roborobo_touch_value: {
            color: '#2AB4D3',
            outerLine: '#0e93b1',
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            statements: [],
            isNotFor: ['roborobo_schoolkit'],
            template: '접촉 센서 값',
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'roborobo_touch_value',
            },
            paramsKeyMap: {},
            class: 'roborobo_touch',
            func (sprite, script) {
                const port = Entry.Roborobo_SchoolKit.inputPort.contact;
                Entry.hw.sendQueue.digitalPinMode[port] = Entry.Roborobo_SchoolKit.pinMode.INPUT;
                Entry.hw.update();
                return Entry.hw.portData[port - 7];
            },
        },
        roborobo_touch_value_boolean: {
            color: '#2AB4D3',
            outerLine: '#0e93b1',
            skeleton: 'basic_boolean_field',
            fontColor: '#fff',
            isNotFor: ['roborobo_schoolkit'],
            template: '접촉 센서가 %1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['접촉 되면', '1'],
                        ['접촉 안되면', '0'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: '#0e93b1',
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
            ],
            def: {
                params: [null],
                type: 'roborobo_touch_value_boolean',
            },
            paramsKeyMap: {
                TOUCH: 0,
            },
            class: 'roborobo_touch',
            func (sprite, script) {
                const port = Entry.Roborobo_SchoolKit.inputPort.contact;
                const touch = script.getNumberField('TOUCH', script);

                Entry.hw.sendQueue.digitalPinMode[port] = Entry.Roborobo_SchoolKit.pinMode.INPUT;
                Entry.hw.update();

                const value = Entry.hw.portData[port - 7];
                const isTouch = touch == value;

                return isTouch;
            },
        },
        roborobo_light_value: {
            color: '#ff8d0f',
            outerLine: '#e37100',
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            statements: [],
            isNotFor: ['roborobo_schoolkit'],
            template: 'CDS 센서 값',
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'roborobo_light_value',
            },
            paramsKeyMap: {},
            class: 'roborobo_light',
            func (sprite, script) {
                const port = Entry.Roborobo_SchoolKit.inputPort.cds;
                return Entry.hw.portData[port - 7];
            },
        },
        roborobo_light_value_boolean: {
            color: '#ff8d0f',
            outerLine: '#e37100',
            skeleton: 'basic_boolean_field',
            fontColor: '#fff',
            isNotFor: ['roborobo_schoolkit'],
            template: 'CDS 센서 값 %1 %2',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['=', 'EQUAL'],
                        ['>', 'GREATER'],
                        ['<', 'LESS'],
                        ['≥', 'GREATER_OR_EQUAL'],
                        ['≤', 'LESS_OR_EQUAL'],
                    ],
                    value: 'LESS',
                    fontSize: 11,
                    bgColor: '#e37100',
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                    noaRrow: true,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            def: {
                params: [
                    null,
                    {
                        type: 'number',
                        params: ['512'],
                    },
                ],
                type: 'roborobo_light_value_boolean',
            },
            paramsKeyMap: {
                OPERATOR: 0,
                RIGHTVALUE: 1,
            },
            class: 'roborobo_light',
            func (sprite, script) {
                const port = Entry.Roborobo_SchoolKit.inputPort.cds;
                const operator = script.getField('OPERATOR', script);
                let rightValue = script.getNumberValue('RIGHTVALUE', script);
                const leftValue = Entry.hw.portData[port - 7];
                let isCheck = false;

                if (rightValue < 0) {
                    rightValue = 0;
                } else if (rightValue > 1023) {
                    rightValue = 1023;
                }
                switch (operator) {
                    case 'EQUAL':
                        isCheck = leftValue == rightValue;
                        break;
                    case 'GREATER':
                        isCheck = Number(leftValue) > Number(rightValue);
                        break;
                    case 'LESS':
                        isCheck = Number(leftValue) < Number(rightValue);
                        break;
                    case 'GREATER_OR_EQUAL':
                        isCheck = Number(leftValue) >= Number(rightValue);
                        break;
                    case 'LESS_OR_EQUAL':
                        isCheck = Number(leftValue) <= Number(rightValue);
                        break;
                }
                return isCheck;
            },
        },
        roborobo_sound_value: {
            color: '#01d67f',
            outerLine: '#00b36a',
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            statements: [],
            isNotFor: ['roborobo_schoolkit'],
            template: '소리 센서에 감지되는 소리 값',
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'roborobo_sound_value',
            },
            paramsKeyMap: {},
            class: 'roborobo_sound',
            func (sprite, script) {
                const port = Entry.Roborobo_SchoolKit.inputPort.sound;
                return Entry.hw.portData[port - 7];
            },
        },
        roborobo_sound_value_boolean: {
            color: '#01d67f',
            outerLine: '#00b36a',
            skeleton: 'basic_boolean_field',
            fontColor: '#fff',
            isNotFor: ['roborobo_schoolkit'],
            template: '소리 센서에 감지되는 소리 값 %1 %2',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['=', 'EQUAL'],
                        ['>', 'GREATER'],
                        ['<', 'LESS'],
                        ['≥', 'GREATER_OR_EQUAL'],
                        ['≤', 'LESS_OR_EQUAL'],
                    ],
                    value: 'LESS',
                    fontSize: 11,
                    bgColor: '#00b36a',
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                    noaRrow: true,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            def: {
                params: [
                    null,
                    {
                        type: 'number',
                        params: ['512'],
                    },
                ],
                type: 'roborobo_sound_value_boolean',
            },
            paramsKeyMap: {
                OPERATOR: 0,
                RIGHTVALUE: 1,
            },
            class: 'roborobo_sound',
            func (sprite, script) {
                const port = Entry.Roborobo_SchoolKit.inputPort.sound;
                const operator = script.getField('OPERATOR', script);
                let rightValue = script.getNumberValue('RIGHTVALUE', script);
                const leftValue = Entry.hw.portData[port - 7];
                let isCheck = false;

                if (rightValue < 0) {
                    rightValue = 0;
                } else if (rightValue > 1023) {
                    rightValue = 1023;
                }

                switch (operator) {
                    case 'EQUAL':
                        isCheck = leftValue == rightValue;
                        break;
                    case 'GREATER':
                        isCheck = Number(leftValue) > Number(rightValue);
                        break;
                    case 'LESS':
                        isCheck = Number(leftValue) < Number(rightValue);
                        break;
                    case 'GREATER_OR_EQUAL':
                        isCheck = Number(leftValue) >= Number(rightValue);
                        break;
                    case 'LESS_OR_EQUAL':
                        isCheck = Number(leftValue) <= Number(rightValue);
                        break;
                }

                return isCheck;
            },
        },
        roborobo_irs_value: {
            color: '#C4065C',
            outerLine: '#9a0045',
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            statements: [],
            isNotFor: ['roborobo_schoolkit'],
            template: '적외선 센서 값',
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'roborobo_irs_value',
            },
            paramsKeyMap: {},
            class: 'roborobo_irs',
            //'isNotFor': ['mini'],
            func (sprite, script) {
                const port = Entry.Roborobo_SchoolKit.inputPort.ir;
                const value =
                    Entry.hw.portData[port - 7] == undefined ? 0 : Entry.hw.portData[port - 7];
                return value;
            },
        },
        roborobo_irs_value_boolean: {
            color: '#C4065C',
            outerLine: '#9a0045',
            skeleton: 'basic_boolean_field',
            fontColor: '#fff',
            isNotFor: ['roborobo_schoolkit'],
            template: '적외선 센서가 %1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['감지 되면', '1'],
                        ['감지 안되면', '0'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: '#9a0045',
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
            ],
            def: {
                params: [null],
                type: 'roborobo_irs_value_boolean',
            },
            paramsKeyMap: {
                DETECT: 0,
            },
            class: 'roborobo_irs',
            //'isNotFor': ['mini'],
            func (sprite, script) {
                const port = Entry.Roborobo_SchoolKit.inputPort.ir;
                const detect = script.getNumberField('DETECT', script);

                Entry.hw.sendQueue.digitalPinMode[port] = Entry.Roborobo_SchoolKit.pinMode.INPUT;
                Entry.hw.update();

                const value = Entry.hw.portData[port - 7];
                const isDetect = detect == value;

                return isDetect;
            },
        },
        roborobo_diode_secs_toggle: {
            color: '#ff8d0f',
            outerLine: '#e37100',
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            isNotFor: ['roborobo_schoolkit'],
            template: '%1번 포트의 발광다이오드를 %2초 동안 %3 %4',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['LED 1', '5'],
                        ['LED 2', '4'],
                        ['R - A', '3'],
                        ['R - B', '2'],
                    ],
                    value: '5',
                    fontSize: 11,
                    bgColor: '#e37100',
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['켜기', '255'],
                        ['끄기', '0'],
                    ],
                    value: '255',
                    fontSize: 11,
                    bgColor: '#e37100',
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/practical_course/diode.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    {
                        type: 'number',
                        params: ['2'],
                    },
                    null,
                    null,
                ],
                type: 'roborobo_diode_secs_toggle',
            },
            paramsKeyMap: {
                PORT: 0,
                DURATION: 1,
                VALUE: 2,
            },
            class: 'roborobo_diode',
            func (sprite, script) {
                const port = script.getNumberField('PORT');
                const duration = script.getNumberValue('DURATION');
                const value = script.getNumberField('VALUE');
                if (!Entry.hw.sendQueue.digitalPinMode) {
                    Entry.hw.sendQueue.digitalPinMode = {};
                }
                Entry.hw.sendQueue.digitalPinMode[port] = Entry.Roborobo_SchoolKit.pinMode.PWM;

                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    Entry.hw.sendQueue[port] = value;

                    setTimeout(() => {
                        script.timeFlag = 0;
                    }, duration * 1000);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    Entry.hw.sendQueue[port] = 0;
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
        },
        roborobo_diode_toggle: {
            color: '#ff8d0f',
            outerLine: '#e37100',
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            isNotFor: ['roborobo_schoolkit'],
            template: '%1번 포트의 발광다이오드를 %2 %3',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['LED 1', '5'],
                        ['LED 2', '4'],
                        ['R - A', '3'],
                        ['R - B', '2'],
                    ],
                    value: '5',
                    fontSize: 11,
                    bgColor: '#e37100',
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['켜기', '255'],
                        ['끄기', '0'],
                    ],
                    value: '255',
                    fontSize: 11,
                    bgColor: '#e37100',
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/practical_course/diode.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null, null, null],
                type: 'roborobo_diode_toggle',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'roborobo_diode',
            //'isNotFor': ['mini'],
            func (sprite, script) {
                const port = script.getNumberField('PORT');
                const value = script.getNumberField('VALUE');

                if (!Entry.hw.sendQueue.digitalPinMode) {
                    Entry.hw.sendQueue.digitalPinMode = {};
                }

                Entry.hw.sendQueue.digitalPinMode[port] = Entry.Roborobo_SchoolKit.pinMode.PWM;
                Entry.hw.sendQueue[port] = value;

                return script.callReturn();
            },
        },
        roborobo_diode_inout_toggle: {
            color: '#ff8d0f',
            outerLine: '#e37100',
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            isNotFor: ['roborobo_schoolkit'],
            template: '%1번 포트의 발광다이오드를 %2번 포트의 %3~%4의 범위로 켜기%5',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['LED 1', '5'],
                        ['LED 2', '4'],
                        ['R - A', '3'],
                        ['R - B', '2'],
                    ],
                    value: '5',
                    fontSize: 11,
                    bgColor: '#e37100',
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['소 리', '8'],
                        ['CDS', '10'],
                    ],
                    value: '8',
                    fontSize: 11,
                    bgColor: '#e37100',
                    arrowColor: EntryStatic.colorSet.common.WHITE,
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
                    img: 'block_icon/practical_course/diode.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    null,
                    {type: 'number', params: ['0']},
                    {type: 'number', params: ['255']},
                    null,
                ],
                type: 'roborobo_diode_inout_toggle',
            },
            paramsKeyMap: {
                OUTPUT: 0,
                INPUT: 1,
                MIN: 2,
                MAX: 3,
            },
            class: 'roborobo_diode',
            //'isNotFor': ['mini'],
            func (sprite, script) {
                const outputPort = script.getNumberField('OUTPUT');
                const inputPort = script.getNumberField('INPUT');

                const oMin = script.getNumberValue('MIN');
                const oMax = script.getNumberValue('MAX');
                const nMin = 0;
                const nMax = 255;
                const x = Entry.hw.portData[inputPort - 7] / 4;
                const percent = (x - oMin) / (oMax - oMin);
                let result = percent * (nMax - nMin) + nMin;
                if (result > nMax) {
                    result = nMax;
                }
                if (result < nMin) {
                    result = nMin;
                }

                if (!Entry.hw.sendQueue.digitalPinMode) {
                    Entry.hw.sendQueue.digitalPinMode = {};
                }

                Entry.hw.sendQueue.digitalPinMode[outputPort] = Entry.Roborobo_SchoolKit.pinMode.PWM;
                Entry.hw.sendQueue[outputPort] = result;

                return script.callReturn();
            },
        },
        roborobo_diode_set_output: {
            color: '#ff8d0f',
            outerLine: '#e37100',
            skeleton: 'basic',
            statements: [],
            isNotFor: ['roborobo_schoolkit'],
            template: '%1번 포트의 발광다이오드를 %2의 밝기로 켜기 %3',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['LED 1', '5'],
                        ['LED 2', '4'],
                        ['R - A', '3'],
                        ['R - B', '2'],
                    ],
                    value: '5',
                    fontSize: 11,
                    bgColor: '#e37100',
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/practical_course/diode.png',
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
                type: 'roborobo_diode_set_output',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'roborobo_diode',
            //'isNotFor': ['mini'],
            func (sprite, script) {
                const port = script.getStringField('PORT', script);
                let value = script.getNumberValue('VALUE', script);

                if (value < 0) {
                    value = 0;
                } else if (value > 255) {
                    value = 255;
                }
                if (!Entry.hw.sendQueue.digitalPinMode) {
                    Entry.hw.sendQueue.digitalPinMode = {};
                }
                Entry.hw.sendQueue.digitalPinMode[port] = Entry.Roborobo_SchoolKit.pinMode.PWM;
                Entry.hw.sendQueue[port] = value;

                return script.callReturn();
            },
        },
        roborobo_diode_input_value: {
            color: '#ff8d0f',
            outerLine: '#e37100',
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            statements: [],
            isNotFor: ['roborobo_schoolkit'],
            template: '%1 포트의 값',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['적외선', '7'],
                        ['소 리', '8'],
                        ['접 촉', '9'],
                        ['CDS', '10'],
                    ],
                    value: '8',
                    fontSize: 11,
                    bgColor: '#e37100',
                    arrowColor: EntryStatic.colorSet.common.WHITE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'roborobo_diode_input_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'roborobo_diode',
            func (sprite, script) {
                const port = script.getNumberField('PORT');
                return Entry.hw.portData[port - 7];
            },
        },
    }
}

module.exports = Entry.Roborobo_SchoolKit;
