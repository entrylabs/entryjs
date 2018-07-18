'use strict';

Entry.Turtle = {
    PORT_MAP: {
        module: 'turtle',
        leftWheel: 0,
        rightWheel: 0,
        ledRed: 0,
        ledGreen: 0,
        ledBlue: 0,
        buzzer: 0,
        pulse: 0,
        pulseId: 0,
        note: 0,
        sound: 0,
        soundRepeat: 1,
        soundId: 0,
        lineTracerMode: 0,
        lineTracerModeId: 0,
        lineTracerGain: 5,
        lineTracerSpeed: 5,
        motionId: 0,
        motionType: 0,
        motionUnit: 0,
        motionSpeed: 0,
        motionValue: 0,
        motionRadius: 0,
    },
    setZero: function() {
        var portMap = Entry.Turtle.PORT_MAP;
        var sq = Entry.hw.sendQueue;
        for (var port in portMap) {
            sq[port] = portMap[port];
        }
        Entry.hw.update();
        var turtle = Entry.Turtle;
        turtle.pulseId = 0;
        turtle.soundId = 0;
        turtle.lineTracerModeId = 0;
        turtle.motionId = 0;
        turtle.clickedId = -1;
        turtle.doubleClickedId = -1;
        turtle.longPressedId = -1;
        turtle.colorPatternId = -1;
        turtle.wheelStateId = -1;
        turtle.soundStateId = -1;
        turtle.lineTracerStateId = -1;
        turtle.tempo = 60;
        turtle.removeAllTimeouts();
    },
    pulseId: 0,
    soundId: 0,
    lineTracerModeId: 0,
    motionId: 0,
    clickedId: -1,
    doubleClickedId: -1,
    longPressedId: -1,
    colorPatternId: -1,
    wheelStateId: -1,
    soundStateId: -1,
    lineTracerStateId: -1,
    tempo: 60,
    timeouts: [],
    removeTimeout: function(id) {
        clearTimeout(id);
        var timeouts = this.timeouts;
        var index = timeouts.indexOf(id);
        if (index >= 0) {
            timeouts.splice(index, 1);
        }
    },
    removeAllTimeouts: function() {
        var timeouts = this.timeouts;
        for (var i in timeouts) {
            clearTimeout(timeouts[i]);
        }
        this.timeouts = [];
    },
    setModule: function(sq) {
        sq.module = 'turtle';
    },
    setPulse: function(sq, pulse) {
        this.pulseId = this.pulseId % 255 + 1;
        sq.pulse = pulse;
        sq.pulseId = this.pulseId;
    },
    setSound: function(sq, sound, count) {
        if (typeof count != 'number') count = 1;
        if (count < 0) count = -1;
        if (count) {
            this.soundId = this.soundId % 255 + 1;
            sq.sound = sound;
            sq.soundRepeat = count;
            sq.soundId = this.soundId;
        }
    },
    setLineTracerMode: function(sq, mode) {
        this.lineTracerModeId = this.lineTracerModeId % 255 + 1;
        sq.lineTracerMode = mode;
        sq.lineTracerModeId = this.lineTracerModeId;
    },
    setMotion: function(sq, type, unit, speed, value, radius) {
        this.motionId = this.motionId % 255 + 1;
        sq.motionType = type;
        sq.motionUnit = unit;
        sq.motionSpeed = speed;
        sq.motionValue = value;
        sq.motionRadius = radius;
        sq.motionId = this.motionId;
    },
    setLedColor: function(sq, color) {
        if (color == 'RED') {
            sq.ledRed = 255;
            sq.ledGreen = 0;
            sq.ledBlue = 0;
        } else if (color == 'ORANGE') {
            sq.ledRed = 255;
            sq.ledGreen = 63;
            sq.ledBlue = 0;
        } else if (color == 'YELLOW') {
            sq.ledRed = 255;
            sq.ledGreen = 255;
            sq.ledBlue = 0;
        } else if (color == 'GREEN') {
            sq.ledRed = 0;
            sq.ledGreen = 255;
            sq.ledBlue = 0;
        } else if (color == 'CYAN') {
            sq.ledRed = 0;
            sq.ledGreen = 255;
            sq.ledBlue = 255;
        } else if (color == 'BLUE') {
            sq.ledRed = 0;
            sq.ledGreen = 0;
            sq.ledBlue = 255;
        } else if (color == 'VIOLET') {
            sq.ledRed = 63;
            sq.ledGreen = 0;
            sq.ledBlue = 255;
        } else if (color == 'MAGENTA') {
            sq.ledRed = 255;
            sq.ledGreen = 0;
            sq.ledBlue = 255;
        } else if (color == 'WHITE') {
            sq.ledRed = 255;
            sq.ledGreen = 255;
            sq.ledBlue = 255;
        }
    },
    name: 'turtle',
    url: 'http://turtle.school',
    imageName: 'turtle.png',
    title: {
        "en": "Turtle",
        "ko": "거북이"
    },
    monitorTemplate: {
        imgPath: 'hw/turtle.png',
        width: 480,
        height: 354,
        listPorts: {
            colorNumber: {
                name: Lang.Blocks.ROBOID_color_number,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            accelerationX: {
                name: Lang.Blocks.ROBOID_acceleration_x,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            accelerationY: {
                name: Lang.Blocks.ROBOID_acceleration_y,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            accelerationZ: {
                name: Lang.Blocks.ROBOID_acceleration_z,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            buzzer: {
                name: Lang.Blocks.ROBOID_buzzer,
                type: 'output',
                pos: { x: 0, y: 0 },
            },
            note: {
                name: Lang.Blocks.ROBOID_note,
                type: 'output',
                pos: { x: 0, y: 0 },
            },
        },
        ports: {
            floor: {
                name: Lang.Blocks.ROBOID_floor,
                type: 'input',
                pos: { x: 193, y: 342 },
            },
            button: {
                name: Lang.Blocks.ROBOID_button,
                type: 'input',
                pos: { x: 290, y: 30 },
            },
            ledRed: {
                name: Lang.Blocks.ROBOID_head_color + ' R',
                type: 'output',
                pos: { x: 140, y: 280 },
            },
            ledGreen: {
                name: Lang.Blocks.ROBOID_head_color + ' G',
                type: 'output',
                pos: { x: 140, y: 280 },
            },
            ledBlue: {
                name: Lang.Blocks.ROBOID_head_color + ' B',
                type: 'output',
                pos: { x: 140, y: 280 },
            },
            leftWheel: {
                name: Lang.Blocks.ROBOID_left_wheel,
                type: 'output',
                pos: { x: 363, y: 319 },
            },
            rightWheel: {
                name: Lang.Blocks.ROBOID_right_wheel,
                type: 'output',
                pos: { x: 120, y: 86 },
            },
        },
        mode: 'both',
    },
};


Entry.Turtle.getBlocks = function() {
    return {
        //region turtle 터틀
        turtle_touching_color: {
            color: '#00979D',
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_color_red, '2'],
                        [Lang.Blocks.ROBOID_color_orange, '3'],
                        [Lang.Blocks.ROBOID_color_yellow, '4'],
                        [Lang.Blocks.ROBOID_color_green, '5'],
                        [Lang.Blocks.ROBOID_color_sky_blue, '6'],
                        [Lang.Blocks.ROBOID_color_blue, '7'],
                        [Lang.Blocks.ROBOID_color_purple, '8'],
                        [Lang.Blocks.ROBOID_color_black, '1'],
                        [Lang.Blocks.ROBOID_color_white, '9'],
                    ],
                    value: '2',
                    fontSize: 11,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'turtle_touching_color',
            },
            paramsKeyMap: {
                COLOR: 0,
            },
            class: 'turtle_sensor',
            isNotFor: ['turtle'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;
                return Number(script.getField('COLOR')) - 1 == pd.colorNumber;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.touching(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_color_red, '2'],
                                    [Lang.Blocks.ROBOID_color_orange, '3'],
                                    [Lang.Blocks.ROBOID_color_yellow, '4'],
                                    [Lang.Blocks.ROBOID_color_green, '5'],
                                    [Lang.Blocks.ROBOID_color_sky_blue, '6'],
                                    [Lang.Blocks.ROBOID_color_blue, '7'],
                                    [Lang.Blocks.ROBOID_color_purple, '8'],
                                    [Lang.Blocks.ROBOID_color_black, '1'],
                                    [Lang.Blocks.ROBOID_color_white, '9'],
                                ],
                                value: '2',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters
                                        .returnValuePartialUpperCase,
                                codeMap: 'Entry.CodeMap.Turtle.touching_colors',
                            },
                        ],
                    },
                ],
            },
        },
        turtle_is_color_pattern: {
            color: '#00979D',
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_color_red, '1'],
                        [Lang.Blocks.ROBOID_color_yellow, '3'],
                        [Lang.Blocks.ROBOID_color_green, '4'],
                        [Lang.Blocks.ROBOID_color_sky_blue, '5'],
                        [Lang.Blocks.ROBOID_color_blue, '6'],
                        [Lang.Blocks.ROBOID_color_purple, '7'],
                    ],
                    value: '1',
                    fontSize: 11,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_color_red, '1'],
                        [Lang.Blocks.ROBOID_color_yellow, '3'],
                        [Lang.Blocks.ROBOID_color_green, '4'],
                        [Lang.Blocks.ROBOID_color_sky_blue, '5'],
                        [Lang.Blocks.ROBOID_color_blue, '6'],
                        [Lang.Blocks.ROBOID_color_purple, '7'],
                    ],
                    value: '3',
                    fontSize: 11,
                },
            ],
            events: {},
            def: {
                params: [null, null],
                type: 'turtle_is_color_pattern',
            },
            paramsKeyMap: {
                COLOR1: 0,
                COLOR2: 1,
            },
            class: 'turtle_sensor',
            isNotFor: ['turtle'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;
                return (
                    Number(script.getField('COLOR1')) * 10 +
                        Number(script.getField('COLOR2')) ==
                    pd.colorPattern
                );
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.match_color_pattern(%1, %2)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_color_red, '1'],
                                    [Lang.Blocks.ROBOID_color_yellow, '3'],
                                    [Lang.Blocks.ROBOID_color_green, '4'],
                                    [Lang.Blocks.ROBOID_color_sky_blue, '5'],
                                    [Lang.Blocks.ROBOID_color_blue, '6'],
                                    [Lang.Blocks.ROBOID_color_purple, '7'],
                                ],
                                value: '1',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters
                                        .returnValuePartialUpperCase,
                                codeMap: 'Entry.CodeMap.Turtle.pattern_colors',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_color_red, '1'],
                                    [Lang.Blocks.ROBOID_color_yellow, '3'],
                                    [Lang.Blocks.ROBOID_color_green, '4'],
                                    [Lang.Blocks.ROBOID_color_sky_blue, '5'],
                                    [Lang.Blocks.ROBOID_color_blue, '6'],
                                    [Lang.Blocks.ROBOID_color_purple, '7'],
                                ],
                                value: '3',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters
                                        .returnValuePartialUpperCase,
                                codeMap: 'Entry.CodeMap.Turtle.pattern_colors',
                            },
                        ],
                    },
                ],
            },
        },
        turtle_button_state: {
            color: '#00979D',
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_clicked, 'clicked'],
                        [Lang.Blocks.ROBOID_double_clicked, 'doubleClicked'],
                        [Lang.Blocks.ROBOID_long_pressed, 'longPressed'],
                    ],
                    value: 'clicked',
                    fontSize: 11,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'turtle_button_state',
            },
            paramsKeyMap: {
                EVENT: 0,
            },
            class: 'turtle_sensor',
            isNotFor: ['turtle'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;
                var event = script.getField('EVENT');
                return pd[event] == 1;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.clicked()',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_clicked, 'clicked'],
                                    [
                                        Lang.Blocks.ROBOID_double_clicked,
                                        'doubleClicked',
                                    ],
                                    [
                                        Lang.Blocks.ROBOID_long_pressed,
                                        'longPressed',
                                    ],
                                ],
                                value: 'clicked',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['clicked'],
                    },
                    {
                        syntax: 'Turtle.double_clicked()',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_clicked, 'clicked'],
                                    [
                                        Lang.Blocks.ROBOID_double_clicked,
                                        'doubleClicked',
                                    ],
                                    [
                                        Lang.Blocks.ROBOID_long_pressed,
                                        'longPressed',
                                    ],
                                ],
                                value: 'clicked',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['doubleClicked'],
                    },
                    {
                        syntax: 'Turtle.long_pressed()',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_clicked, 'clicked'],
                                    [
                                        Lang.Blocks.ROBOID_double_clicked,
                                        'doubleClicked',
                                    ],
                                    [
                                        Lang.Blocks.ROBOID_long_pressed,
                                        'longPressed',
                                    ],
                                ],
                                value: 'clicked',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['longPressed'],
                    },
                ],
            },
        },
        turtle_value: {
            color: '#00979D',
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_color_number, 'colorNumber'],
                        [Lang.Blocks.ROBOID_color_pattern, 'colorPattern'],
                        [Lang.Blocks.ROBOID_floor, 'floor'],
                        [Lang.Blocks.ROBOID_button, 'button'],
                        [Lang.Blocks.ROBOID_acceleration_x, 'accelerationX'],
                        [Lang.Blocks.ROBOID_acceleration_y, 'accelerationY'],
                        [Lang.Blocks.ROBOID_acceleration_z, 'accelerationZ'],
                    ],
                    value: 'colorNumber',
                    fontSize: 11,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'turtle_value',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class: 'turtle_sensor',
            isNotFor: ['turtle'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;
                var dev = script.getField('DEVICE');
                return pd[dev];
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.color_number()',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [
                                        Lang.Blocks.ROBOID_color_number,
                                        'colorNumber',
                                    ],
                                    [
                                        Lang.Blocks.ROBOID_color_pattern,
                                        'colorPattern',
                                    ],
                                    [Lang.Blocks.ROBOID_floor, 'floor'],
                                    [Lang.Blocks.ROBOID_button, 'button'],
                                    [
                                        Lang.Blocks.ROBOID_acceleration_x,
                                        'accelerationX',
                                    ],
                                    [
                                        Lang.Blocks.ROBOID_acceleration_y,
                                        'accelerationY',
                                    ],
                                    [
                                        Lang.Blocks.ROBOID_acceleration_z,
                                        'accelerationZ',
                                    ],
                                ],
                                value: 'colorNumber',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['colorNumber'],
                    },
                    {
                        syntax: 'Turtle.color_pattern()',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [
                                        Lang.Blocks.ROBOID_color_number,
                                        'colorNumber',
                                    ],
                                    [
                                        Lang.Blocks.ROBOID_color_pattern,
                                        'colorPattern',
                                    ],
                                    [Lang.Blocks.ROBOID_floor, 'floor'],
                                    [Lang.Blocks.ROBOID_button, 'button'],
                                    [
                                        Lang.Blocks.ROBOID_acceleration_x,
                                        'accelerationX',
                                    ],
                                    [
                                        Lang.Blocks.ROBOID_acceleration_y,
                                        'accelerationY',
                                    ],
                                    [
                                        Lang.Blocks.ROBOID_acceleration_z,
                                        'accelerationZ',
                                    ],
                                ],
                                value: 'colorNumber',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['colorPattern'],
                    },
                    {
                        syntax: 'Turtle.floor()',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [
                                        Lang.Blocks.ROBOID_color_number,
                                        'colorNumber',
                                    ],
                                    [
                                        Lang.Blocks.ROBOID_color_pattern,
                                        'colorPattern',
                                    ],
                                    [Lang.Blocks.ROBOID_floor, 'floor'],
                                    [Lang.Blocks.ROBOID_button, 'button'],
                                    [
                                        Lang.Blocks.ROBOID_acceleration_x,
                                        'accelerationX',
                                    ],
                                    [
                                        Lang.Blocks.ROBOID_acceleration_y,
                                        'accelerationY',
                                    ],
                                    [
                                        Lang.Blocks.ROBOID_acceleration_z,
                                        'accelerationZ',
                                    ],
                                ],
                                value: 'colorNumber',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['floor'],
                    },
                    {
                        syntax: 'Turtle.button()',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [
                                        Lang.Blocks.ROBOID_color_number,
                                        'colorNumber',
                                    ],
                                    [
                                        Lang.Blocks.ROBOID_color_pattern,
                                        'colorPattern',
                                    ],
                                    [Lang.Blocks.ROBOID_floor, 'floor'],
                                    [Lang.Blocks.ROBOID_button, 'button'],
                                    [
                                        Lang.Blocks.ROBOID_acceleration_x,
                                        'accelerationX',
                                    ],
                                    [
                                        Lang.Blocks.ROBOID_acceleration_y,
                                        'accelerationY',
                                    ],
                                    [
                                        Lang.Blocks.ROBOID_acceleration_z,
                                        'accelerationZ',
                                    ],
                                ],
                                value: 'colorNumber',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['button'],
                    },
                    {
                        syntax: 'Turtle.acceleration_x()',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [
                                        Lang.Blocks.ROBOID_color_number,
                                        'colorNumber',
                                    ],
                                    [
                                        Lang.Blocks.ROBOID_color_pattern,
                                        'colorPattern',
                                    ],
                                    [Lang.Blocks.ROBOID_floor, 'floor'],
                                    [Lang.Blocks.ROBOID_button, 'button'],
                                    [
                                        Lang.Blocks.ROBOID_acceleration_x,
                                        'accelerationX',
                                    ],
                                    [
                                        Lang.Blocks.ROBOID_acceleration_y,
                                        'accelerationY',
                                    ],
                                    [
                                        Lang.Blocks.ROBOID_acceleration_z,
                                        'accelerationZ',
                                    ],
                                ],
                                value: 'colorNumber',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['accelerationX'],
                    },
                    {
                        syntax: 'Turtle.acceleration_y()',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [
                                        Lang.Blocks.ROBOID_color_number,
                                        'colorNumber',
                                    ],
                                    [
                                        Lang.Blocks.ROBOID_color_pattern,
                                        'colorPattern',
                                    ],
                                    [Lang.Blocks.ROBOID_floor, 'floor'],
                                    [Lang.Blocks.ROBOID_button, 'button'],
                                    [
                                        Lang.Blocks.ROBOID_acceleration_x,
                                        'accelerationX',
                                    ],
                                    [
                                        Lang.Blocks.ROBOID_acceleration_y,
                                        'accelerationY',
                                    ],
                                    [
                                        Lang.Blocks.ROBOID_acceleration_z,
                                        'accelerationZ',
                                    ],
                                ],
                                value: 'colorNumber',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['accelerationY'],
                    },
                    {
                        syntax: 'Turtle.acceleration_z()',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [
                                        Lang.Blocks.ROBOID_color_number,
                                        'colorNumber',
                                    ],
                                    [
                                        Lang.Blocks.ROBOID_color_pattern,
                                        'colorPattern',
                                    ],
                                    [Lang.Blocks.ROBOID_floor, 'floor'],
                                    [Lang.Blocks.ROBOID_button, 'button'],
                                    [
                                        Lang.Blocks.ROBOID_acceleration_x,
                                        'accelerationX',
                                    ],
                                    [
                                        Lang.Blocks.ROBOID_acceleration_y,
                                        'accelerationY',
                                    ],
                                    [
                                        Lang.Blocks.ROBOID_acceleration_z,
                                        'accelerationZ',
                                    ],
                                ],
                                value: 'colorNumber',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['accelerationZ'],
                    },
                ],
            },
        },
        turtle_move_forward_unit: {
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
                        [Lang.Blocks.ROBOID_unit_cm, 'CM'],
                        [Lang.Blocks.ROBOID_unit_sec, 'SEC'],
                        [Lang.Blocks.ROBOID_unit_pulse, 'PULSE'],
                    ],
                    value: 'CM',
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
                params: [
                    {
                        type: 'text',
                        params: ['6'],
                    },
                    null,
                    null,
                ],
                type: 'turtle_move_forward_unit',
            },
            paramsKeyMap: {
                VALUE: 0,
                UNIT: 1,
            },
            class: 'turtle_wheel',
            isNotFor: ['turtle'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                var turtle = Entry.Turtle;
                turtle.setModule(sq);
                if (!script.isStart) {
                    script.isStart = true;
                    sq.leftWheel = 0;
                    sq.rightWheel = 0;
                    turtle.setPulse(sq, 0);
                    turtle.setLineTracerMode(sq, 0);
                    var field = script.getField('UNIT');
                    var unit = 1;
                    if (field == 'SEC') unit = 2;
                    else if (field == 'PULSE') unit = 3;
                    var value = script.getNumberValue('VALUE');
                    turtle.setMotion(sq, 1, unit, 0, value, 0);
                    return script;
                } else {
                    if (pd.wheelStateId != turtle.wheelStateId) {
                        turtle.wheelStateId = pd.wheelStateId;
                        if (pd.wheelState == 0) {
                            delete script.isStart;
                            Entry.engine.isContinue = false;
                            sq.leftWheel = 0;
                            sq.rightWheel = 0;
                            return script.callReturn();
                        }
                    }
                    return script;
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.move_forward(%1, %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_unit_cm, 'CM'],
                                    [Lang.Blocks.ROBOID_unit_sec, 'SEC'],
                                    [Lang.Blocks.ROBOID_unit_pulse, 'PULSE'],
                                ],
                                value: 'CM',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters
                                        .returnValuePartialUpperCase,
                                codeMap: 'Entry.CodeMap.Turtle.units',
                            },
                        ],
                    },
                ],
            },
        },
        turtle_move_backward_unit: {
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
                        [Lang.Blocks.ROBOID_unit_cm, 'CM'],
                        [Lang.Blocks.ROBOID_unit_sec, 'SEC'],
                        [Lang.Blocks.ROBOID_unit_pulse, 'PULSE'],
                    ],
                    value: 'CM',
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
                params: [
                    {
                        type: 'text',
                        params: ['6'],
                    },
                    null,
                    null,
                ],
                type: 'turtle_move_backward_unit',
            },
            paramsKeyMap: {
                VALUE: 0,
                UNIT: 1,
            },
            class: 'turtle_wheel',
            isNotFor: ['turtle'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                var turtle = Entry.Turtle;
                turtle.setModule(sq);
                if (!script.isStart) {
                    script.isStart = true;
                    sq.leftWheel = 0;
                    sq.rightWheel = 0;
                    turtle.setPulse(sq, 0);
                    turtle.setLineTracerMode(sq, 0);
                    var field = script.getField('UNIT');
                    var unit = 1;
                    if (field == 'SEC') unit = 2;
                    else if (field == 'PULSE') unit = 3;
                    var value = script.getNumberValue('VALUE');
                    turtle.setMotion(sq, 2, unit, 0, value, 0);
                    return script;
                } else {
                    if (pd.wheelStateId != turtle.wheelStateId) {
                        turtle.wheelStateId = pd.wheelStateId;
                        if (pd.wheelState == 0) {
                            delete script.isStart;
                            Entry.engine.isContinue = false;
                            sq.leftWheel = 0;
                            sq.rightWheel = 0;
                            return script.callReturn();
                        }
                    }
                    return script;
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.move_backward(%1, %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_unit_cm, 'CM'],
                                    [Lang.Blocks.ROBOID_unit_sec, 'SEC'],
                                    [Lang.Blocks.ROBOID_unit_pulse, 'PULSE'],
                                ],
                                value: 'CM',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters
                                        .returnValuePartialUpperCase,
                                codeMap: 'Entry.CodeMap.Turtle.units',
                            },
                        ],
                    },
                ],
            },
        },
        turtle_turn_unit_in_place: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_left, 'LEFT'],
                        [Lang.Blocks.ROBOID_right, 'RIGHT'],
                    ],
                    value: 'LEFT',
                    fontSize: 11,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_unit_deg, 'DEG'],
                        [Lang.Blocks.ROBOID_unit_sec, 'SEC'],
                        [Lang.Blocks.ROBOID_unit_pulse, 'PULSE'],
                    ],
                    value: 'DEG',
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
                params: [
                    null,
                    {
                        type: 'text',
                        params: ['90'],
                    },
                    null,
                    null,
                ],
                type: 'turtle_turn_unit_in_place',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                VALUE: 1,
                UNIT: 2,
            },
            class: 'turtle_wheel',
            isNotFor: ['turtle'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                var turtle = Entry.Turtle;
                turtle.setModule(sq);
                if (!script.isStart) {
                    script.isStart = true;
                    sq.leftWheel = 0;
                    sq.rightWheel = 0;
                    turtle.setPulse(sq, 0);
                    turtle.setLineTracerMode(sq, 0);
                    var direction = script.getField('DIRECTION');
                    var field = script.getField('UNIT');
                    var unit = 1;
                    if (field == 'SEC') unit = 2;
                    else if (field == 'PULSE') unit = 3;
                    var value = script.getNumberValue('VALUE');
                    if (direction == 'LEFT')
                        turtle.setMotion(sq, 3, unit, 0, value, 0);
                    else turtle.setMotion(sq, 4, unit, 0, value, 0);
                    return script;
                } else {
                    if (pd.wheelStateId != turtle.wheelStateId) {
                        turtle.wheelStateId = pd.wheelStateId;
                        if (pd.wheelState == 0) {
                            delete script.isStart;
                            Entry.engine.isContinue = false;
                            sq.leftWheel = 0;
                            sq.rightWheel = 0;
                            return script.callReturn();
                        }
                    }
                    return script;
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.turn_left(%2, %3)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_left, 'LEFT'],
                                    [Lang.Blocks.ROBOID_right, 'RIGHT'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_unit_deg, 'DEG'],
                                    [Lang.Blocks.ROBOID_unit_sec, 'SEC'],
                                    [Lang.Blocks.ROBOID_unit_pulse, 'PULSE'],
                                ],
                                value: 'DEG',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters
                                        .returnValuePartialUpperCase,
                                codeMap: 'Entry.CodeMap.Turtle.units',
                            },
                        ],
                        params: ['LEFT'],
                    },
                    {
                        syntax: 'Turtle.turn_right(%2, %3)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_left, 'LEFT'],
                                    [Lang.Blocks.ROBOID_right, 'RIGHT'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_unit_deg, 'DEG'],
                                    [Lang.Blocks.ROBOID_unit_sec, 'SEC'],
                                    [Lang.Blocks.ROBOID_unit_pulse, 'PULSE'],
                                ],
                                value: 'DEG',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters
                                        .returnValuePartialUpperCase,
                                codeMap: 'Entry.CodeMap.Turtle.units',
                            },
                        ],
                        params: ['RIGHT'],
                    },
                ],
            },
        },
        turtle_turn_unit_with_radius_in_direction: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_left, 'LEFT'],
                        [Lang.Blocks.ROBOID_right, 'RIGHT'],
                    ],
                    value: 'LEFT',
                    fontSize: 11,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_unit_deg, 'DEG'],
                        [Lang.Blocks.ROBOID_unit_sec, 'SEC'],
                        [Lang.Blocks.ROBOID_unit_pulse, 'PULSE'],
                    ],
                    value: 'DEG',
                    fontSize: 11,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_head, 'HEAD'],
                        [Lang.Blocks.ROBOID_tail, 'TAIL'],
                    ],
                    value: 'HEAD',
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
                params: [
                    null,
                    {
                        type: 'text',
                        params: ['90'],
                    },
                    null,
                    {
                        type: 'text',
                        params: ['6'],
                    },
                    null,
                    null,
                ],
                type: 'turtle_turn_unit_with_radius_in_direction',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                VALUE: 1,
                UNIT: 2,
                RADIUS: 3,
                HEAD: 4,
            },
            class: 'turtle_wheel',
            isNotFor: ['turtle'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                var turtle = Entry.Turtle;
                turtle.setModule(sq);
                if (!script.isStart) {
                    script.isStart = true;
                    sq.leftWheel = 0;
                    sq.rightWheel = 0;
                    turtle.setPulse(sq, 0);
                    turtle.setLineTracerMode(sq, 0);
                    var direction = script.getField('DIRECTION');
                    var field = script.getField('UNIT');
                    var unit = 1;
                    if (field == 'SEC') unit = 2;
                    else if (field == 'PULSE') unit = 3;
                    var value = script.getNumberValue('VALUE');
                    var head = script.getField('HEAD');
                    var radius = script.getNumberValue('RADIUS');
                    if (direction == 'LEFT') {
                        if (head == 'HEAD')
                            turtle.setMotion(sq, 9, unit, 0, value, radius);
                        else turtle.setMotion(sq, 10, unit, 0, value, radius);
                    } else {
                        if (head == 'HEAD')
                            turtle.setMotion(sq, 11, unit, 0, value, radius);
                        else turtle.setMotion(sq, 12, unit, 0, value, radius);
                    }
                    return script;
                } else {
                    if (pd.wheelStateId != turtle.wheelStateId) {
                        turtle.wheelStateId = pd.wheelStateId;
                        if (pd.wheelState == 0) {
                            delete script.isStart;
                            Entry.engine.isContinue = false;
                            sq.leftWheel = 0;
                            sq.rightWheel = 0;
                            return script.callReturn();
                        }
                    }
                    return script;
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.swing_left(%2, %3, %4, %5)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_left, 'LEFT'],
                                    [Lang.Blocks.ROBOID_right, 'RIGHT'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_unit_deg, 'DEG'],
                                    [Lang.Blocks.ROBOID_unit_sec, 'SEC'],
                                    [Lang.Blocks.ROBOID_unit_pulse, 'PULSE'],
                                ],
                                value: 'DEG',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters
                                        .returnValuePartialUpperCase,
                                codeMap: 'Entry.CodeMap.Turtle.units',
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_head, 'HEAD'],
                                    [Lang.Blocks.ROBOID_tail, 'TAIL'],
                                ],
                                value: 'HEAD',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters
                                        .returnValuePartialUpperCase,
                                codeMap: 'Entry.CodeMap.Turtle.head_tail',
                            },
                        ],
                        params: ['LEFT'],
                    },
                    {
                        syntax: 'Turtle.swing_right(%2, %3, %4, %5)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_left, 'LEFT'],
                                    [Lang.Blocks.ROBOID_right, 'RIGHT'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_unit_deg, 'DEG'],
                                    [Lang.Blocks.ROBOID_unit_sec, 'SEC'],
                                    [Lang.Blocks.ROBOID_unit_pulse, 'PULSE'],
                                ],
                                value: 'DEG',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters
                                        .returnValuePartialUpperCase,
                                codeMap: 'Entry.CodeMap.Turtle.units',
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_head, 'HEAD'],
                                    [Lang.Blocks.ROBOID_tail, 'TAIL'],
                                ],
                                value: 'HEAD',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters
                                        .returnValuePartialUpperCase,
                                codeMap: 'Entry.CodeMap.Turtle.head_tail',
                            },
                        ],
                        params: ['RIGHT'],
                    },
                ],
            },
        },
        turtle_pivot_around_wheel_unit_in_direction: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_left, 'LEFT'],
                        [Lang.Blocks.ROBOID_right, 'RIGHT'],
                    ],
                    value: 'LEFT',
                    fontSize: 11,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_unit_deg, 'DEG'],
                        [Lang.Blocks.ROBOID_unit_sec, 'SEC'],
                        [Lang.Blocks.ROBOID_unit_pulse, 'PULSE'],
                    ],
                    value: 'DEG',
                    fontSize: 11,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_head, 'HEAD'],
                        [Lang.Blocks.ROBOID_tail, 'TAIL'],
                    ],
                    value: 'HEAD',
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
                params: [
                    null,
                    {
                        type: 'text',
                        params: ['90'],
                    },
                    null,
                    null,
                    null,
                ],
                type: 'turtle_pivot_around_wheel_unit_in_direction',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                VALUE: 1,
                UNIT: 2,
                HEAD: 3,
            },
            class: 'turtle_wheel',
            isNotFor: ['turtle'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                var turtle = Entry.Turtle;
                turtle.setModule(sq);
                if (!script.isStart) {
                    script.isStart = true;
                    sq.leftWheel = 0;
                    sq.rightWheel = 0;
                    turtle.setPulse(sq, 0);
                    turtle.setLineTracerMode(sq, 0);
                    var direction = script.getField('DIRECTION');
                    var field = script.getField('UNIT');
                    var unit = 1;
                    if (field == 'SEC') unit = 2;
                    else if (field == 'PULSE') unit = 3;
                    var value = script.getNumberValue('VALUE');
                    var head = script.getField('HEAD');
                    if (direction == 'LEFT') {
                        if (head == 'HEAD')
                            turtle.setMotion(sq, 5, unit, 0, value, 0);
                        else turtle.setMotion(sq, 6, unit, 0, value, 0);
                    } else {
                        if (head == 'HEAD')
                            turtle.setMotion(sq, 7, unit, 0, value, 0);
                        else turtle.setMotion(sq, 8, unit, 0, value, 0);
                    }
                    return script;
                } else {
                    if (pd.wheelStateId != turtle.wheelStateId) {
                        turtle.wheelStateId = pd.wheelStateId;
                        if (pd.wheelState == 0) {
                            delete script.isStart;
                            Entry.engine.isContinue = false;
                            sq.leftWheel = 0;
                            sq.rightWheel = 0;
                            return script.callReturn();
                        }
                    }
                    return script;
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.pivot_left(%2, %3, %4)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_left, 'LEFT'],
                                    [Lang.Blocks.ROBOID_right, 'RIGHT'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_unit_deg, 'DEG'],
                                    [Lang.Blocks.ROBOID_unit_sec, 'SEC'],
                                    [Lang.Blocks.ROBOID_unit_pulse, 'PULSE'],
                                ],
                                value: 'DEG',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters
                                        .returnValuePartialUpperCase,
                                codeMap: 'Entry.CodeMap.Turtle.units',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_head, 'HEAD'],
                                    [Lang.Blocks.ROBOID_tail, 'TAIL'],
                                ],
                                value: 'HEAD',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters
                                        .returnValuePartialUpperCase,
                                codeMap: 'Entry.CodeMap.Turtle.head_tail',
                            },
                        ],
                        params: ['LEFT'],
                    },
                    {
                        syntax: 'Turtle.pivot_right(%2, %3, %4)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_left, 'LEFT'],
                                    [Lang.Blocks.ROBOID_right, 'RIGHT'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_unit_deg, 'DEG'],
                                    [Lang.Blocks.ROBOID_unit_sec, 'SEC'],
                                    [Lang.Blocks.ROBOID_unit_pulse, 'PULSE'],
                                ],
                                value: 'DEG',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters
                                        .returnValuePartialUpperCase,
                                codeMap: 'Entry.CodeMap.Turtle.units',
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_head, 'HEAD'],
                                    [Lang.Blocks.ROBOID_tail, 'TAIL'],
                                ],
                                value: 'HEAD',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters
                                        .returnValuePartialUpperCase,
                                codeMap: 'Entry.CodeMap.Turtle.head_tail',
                            },
                        ],
                        params: ['RIGHT'],
                    },
                ],
            },
        },
        turtle_change_wheels_by_left_right: {
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
                        type: 'text',
                        params: ['10'],
                    },
                    {
                        type: 'text',
                        params: ['10'],
                    },
                    null,
                ],
                type: 'turtle_change_wheels_by_left_right',
            },
            paramsKeyMap: {
                LEFT: 0,
                RIGHT: 1,
            },
            class: 'turtle_wheel',
            isNotFor: ['turtle'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var left = script.getNumberValue('LEFT');
                var right = script.getNumberValue('RIGHT');
                var turtle = Entry.Turtle;
                turtle.setModule(sq);
                turtle.setPulse(sq, 0);
                turtle.setLineTracerMode(sq, 0);
                turtle.setMotion(sq, 0, 0, 0, 0, 0);
                sq.leftWheel =
                    sq.leftWheel != undefined ? sq.leftWheel + left : left;
                sq.rightWheel =
                    sq.rightWheel != undefined ? sq.rightWheel + right : right;
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.wheels_by(%1, %2)',
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
        turtle_set_wheels_to_left_right: {
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
                        type: 'text',
                        params: ['50'],
                    },
                    {
                        type: 'text',
                        params: ['50'],
                    },
                    null,
                ],
                type: 'turtle_set_wheels_to_left_right',
            },
            paramsKeyMap: {
                LEFT: 0,
                RIGHT: 1,
            },
            class: 'turtle_wheel',
            isNotFor: ['turtle'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var turtle = Entry.Turtle;
                turtle.setModule(sq);
                turtle.setPulse(sq, 0);
                turtle.setLineTracerMode(sq, 0);
                turtle.setMotion(sq, 0, 0, 0, 0, 0);
                sq.leftWheel = script.getNumberValue('LEFT');
                sq.rightWheel = script.getNumberValue('RIGHT');
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.wheels(%1, %2)',
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
        turtle_change_wheel_by: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_left, 'LEFT'],
                        [Lang.Blocks.ROBOID_right, 'RIGHT'],
                        [Lang.Blocks.ROBOID_both, 'BOTH'],
                    ],
                    value: 'LEFT',
                    fontSize: 11,
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
                        type: 'text',
                        params: ['10'],
                    },
                    null,
                ],
                type: 'turtle_change_wheel_by',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                VALUE: 1,
            },
            class: 'turtle_wheel',
            isNotFor: ['turtle'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var direction = script.getField('DIRECTION');
                var value = script.getNumberValue('VALUE');
                var turtle = Entry.Turtle;
                turtle.setModule(sq);
                turtle.setPulse(sq, 0);
                turtle.setLineTracerMode(sq, 0);
                turtle.setMotion(sq, 0, 0, 0, 0, 0);
                if (direction == 'LEFT') {
                    sq.leftWheel =
                        sq.leftWheel != undefined
                            ? sq.leftWheel + value
                            : value;
                } else if (direction == 'RIGHT') {
                    sq.rightWheel =
                        sq.rightWheel != undefined
                            ? sq.rightWheel + value
                            : value;
                } else {
                    sq.leftWheel =
                        sq.leftWheel != undefined
                            ? sq.leftWheel + value
                            : value;
                    sq.rightWheel =
                        sq.rightWheel != undefined
                            ? sq.rightWheel + value
                            : value;
                }
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.left_wheel_by(%2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_left, 'LEFT'],
                                    [Lang.Blocks.ROBOID_right, 'RIGHT'],
                                    [Lang.Blocks.ROBOID_both, 'BOTH'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                        params: ['LEFT'],
                    },
                    {
                        syntax: 'Turtle.right_wheel_by(%2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_left, 'LEFT'],
                                    [Lang.Blocks.ROBOID_right, 'RIGHT'],
                                    [Lang.Blocks.ROBOID_both, 'BOTH'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                        params: ['RIGHT'],
                    },
                    {
                        syntax: 'Turtle.wheels_by(%2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_left, 'LEFT'],
                                    [Lang.Blocks.ROBOID_right, 'RIGHT'],
                                    [Lang.Blocks.ROBOID_both, 'BOTH'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                        params: ['BOTH'],
                        keyOption: 'SAME',
                    },
                ],
            },
        },
        turtle_set_wheel_to: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_left, 'LEFT'],
                        [Lang.Blocks.ROBOID_right, 'RIGHT'],
                        [Lang.Blocks.ROBOID_both, 'BOTH'],
                    ],
                    value: 'LEFT',
                    fontSize: 11,
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
                        type: 'text',
                        params: ['50'],
                    },
                    null,
                ],
                type: 'turtle_set_wheel_to',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                VALUE: 1,
            },
            class: 'turtle_wheel',
            isNotFor: ['turtle'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var direction = script.getField('DIRECTION');
                var value = script.getNumberValue('VALUE');
                var turtle = Entry.Turtle;
                turtle.setModule(sq);
                turtle.setPulse(sq, 0);
                turtle.setLineTracerMode(sq, 0);
                turtle.setMotion(sq, 0, 0, 0, 0, 0);
                if (direction == 'LEFT') {
                    sq.leftWheel = value;
                } else if (direction == 'RIGHT') {
                    sq.rightWheel = value;
                } else {
                    sq.leftWheel = value;
                    sq.rightWheel = value;
                }
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.left_wheel(%2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_left, 'LEFT'],
                                    [Lang.Blocks.ROBOID_right, 'RIGHT'],
                                    [Lang.Blocks.ROBOID_both, 'BOTH'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                        params: ['LEFT'],
                    },
                    {
                        syntax: 'Turtle.right_wheel(%2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_left, 'LEFT'],
                                    [Lang.Blocks.ROBOID_right, 'RIGHT'],
                                    [Lang.Blocks.ROBOID_both, 'BOTH'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                        params: ['RIGHT'],
                    },
                    {
                        syntax: 'Turtle.wheels(%2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_left, 'LEFT'],
                                    [Lang.Blocks.ROBOID_right, 'RIGHT'],
                                    [Lang.Blocks.ROBOID_both, 'BOTH'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                        params: ['BOTH'],
                        keyOption: 'SAME',
                    },
                ],
            },
        },
        turtle_follow_line: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_color_black, '10'],
                        [Lang.Blocks.ROBOID_color_red, '11'],
                        [Lang.Blocks.ROBOID_color_green, '13'],
                        [Lang.Blocks.ROBOID_color_blue, '15'],
                        [Lang.Blocks.ROBOID_color_any, '17'],
                    ],
                    value: '10',
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
                type: 'turtle_follow_line',
            },
            paramsKeyMap: {
                COLOR: 0,
            },
            class: 'turtle_wheel',
            isNotFor: ['turtle'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var turtle = Entry.Turtle;
                turtle.setModule(sq);
                sq.leftWheel = 0;
                sq.rightWheel = 0;
                turtle.setPulse(sq, 0);
                turtle.setMotion(sq, 0, 0, 0, 0, 0);
                var mode = Number(script.getField('COLOR'));
                turtle.setLineTracerMode(sq, mode);
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.follow_line(%1)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_color_black, '10'],
                                    [Lang.Blocks.ROBOID_color_red, '11'],
                                    [Lang.Blocks.ROBOID_color_green, '13'],
                                    [Lang.Blocks.ROBOID_color_blue, '15'],
                                    [Lang.Blocks.ROBOID_color_any, '17'],
                                ],
                                value: '10',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters
                                        .returnValuePartialUpperCase,
                                codeMap: 'Entry.CodeMap.Turtle.line_colors',
                            },
                        ],
                    },
                ],
            },
        },
        turtle_follow_line_until: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_color_red, '61'],
                        [Lang.Blocks.ROBOID_color_yellow, '62'],
                        [Lang.Blocks.ROBOID_color_green, '63'],
                        [Lang.Blocks.ROBOID_color_sky_blue, '64'],
                        [Lang.Blocks.ROBOID_color_blue, '65'],
                        [Lang.Blocks.ROBOID_color_purple, '66'],
                        [Lang.Blocks.ROBOID_color_any, '67'],
                    ],
                    value: '61',
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
                type: 'turtle_follow_line_until',
            },
            paramsKeyMap: {
                COLOR: 0,
            },
            class: 'turtle_wheel',
            isNotFor: ['turtle'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                var turtle = Entry.Turtle;
                turtle.setModule(sq);
                if (!script.isStart) {
                    script.isStart = true;
                    sq.leftWheel = 0;
                    sq.rightWheel = 0;
                    turtle.setPulse(sq, 0);
                    turtle.setMotion(sq, 0, 0, 0, 0, 0);
                    var mode = Number(script.getField('COLOR'));
                    turtle.setLineTracerMode(sq, mode);
                    return script;
                } else {
                    if (pd.lineTracerStateId != turtle.lineTracerStateId) {
                        turtle.lineTracerStateId = pd.lineTracerStateId;
                        if (pd.lineTracerState == 0x02) {
                            delete script.isStart;
                            Entry.engine.isContinue = false;
                            turtle.setLineTracerMode(sq, 0);
                            return script.callReturn();
                        }
                    }
                    return script;
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.follow_black_line_until(%1)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_color_red, '61'],
                                    [Lang.Blocks.ROBOID_color_yellow, '62'],
                                    [Lang.Blocks.ROBOID_color_green, '63'],
                                    [Lang.Blocks.ROBOID_color_sky_blue, '64'],
                                    [Lang.Blocks.ROBOID_color_blue, '65'],
                                    [Lang.Blocks.ROBOID_color_purple, '66'],
                                    [Lang.Blocks.ROBOID_color_any, '67'],
                                ],
                                value: '61',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters
                                        .returnValuePartialUpperCase,
                                codeMap: 'Entry.CodeMap.Turtle.target_colors',
                            },
                        ],
                    },
                ],
            },
        },
        turtle_follow_line_until_black: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_color_red, '71'],
                        [Lang.Blocks.ROBOID_color_green, '73'],
                        [Lang.Blocks.ROBOID_color_blue, '75'],
                        [Lang.Blocks.ROBOID_color_any, '77'],
                    ],
                    value: '71',
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
                type: 'turtle_follow_line_until_black',
            },
            paramsKeyMap: {
                COLOR: 0,
            },
            class: 'turtle_wheel',
            isNotFor: ['turtle'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                var turtle = Entry.Turtle;
                turtle.setModule(sq);
                if (!script.isStart) {
                    script.isStart = true;
                    sq.leftWheel = 0;
                    sq.rightWheel = 0;
                    turtle.setPulse(sq, 0);
                    turtle.setMotion(sq, 0, 0, 0, 0, 0);
                    var mode = Number(script.getField('COLOR'));
                    turtle.setLineTracerMode(sq, mode);
                    return script;
                } else {
                    if (pd.lineTracerStateId != turtle.lineTracerStateId) {
                        turtle.lineTracerStateId = pd.lineTracerStateId;
                        if (pd.lineTracerState == 0x02) {
                            delete script.isStart;
                            Entry.engine.isContinue = false;
                            turtle.setLineTracerMode(sq, 0);
                            return script.callReturn();
                        }
                    }
                    return script;
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.follow_line_until_black(%1)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_color_red, '71'],
                                    [Lang.Blocks.ROBOID_color_green, '73'],
                                    [Lang.Blocks.ROBOID_color_blue, '75'],
                                    [Lang.Blocks.ROBOID_color_any, '77'],
                                ],
                                value: '71',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters
                                        .returnValuePartialUpperCase,
                                codeMap: 'Entry.CodeMap.Turtle.color_lines',
                            },
                        ],
                    },
                ],
            },
        },
        turtle_cross_intersection: {
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
                type: 'turtle_cross_intersection',
            },
            class: 'turtle_wheel',
            isNotFor: ['turtle'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                var turtle = Entry.Turtle;
                turtle.setModule(sq);
                if (!script.isStart) {
                    script.isStart = true;
                    sq.leftWheel = 0;
                    sq.rightWheel = 0;
                    turtle.setPulse(sq, 0);
                    turtle.setMotion(sq, 0, 0, 0, 0, 0);
                    turtle.setLineTracerMode(sq, 40);
                    return script;
                } else {
                    if (pd.lineTracerStateId != turtle.lineTracerStateId) {
                        turtle.lineTracerStateId = pd.lineTracerStateId;
                        if (pd.lineTracerState == 0x02) {
                            delete script.isStart;
                            Entry.engine.isContinue = false;
                            turtle.setLineTracerMode(sq, 0);
                            return script.callReturn();
                        }
                    }
                    return script;
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.intersection_forward()',
                    },
                ],
            },
        },
        turtle_turn_at_intersection: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_left, '20'],
                        [Lang.Blocks.ROBOID_right, '30'],
                        [Lang.Blocks.ROBOID_back, '50'],
                    ],
                    value: '20',
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
                type: 'turtle_turn_at_intersection',
            },
            paramsKeyMap: {
                DIRECTION: 0,
            },
            class: 'turtle_wheel',
            isNotFor: ['turtle'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                var turtle = Entry.Turtle;
                turtle.setModule(sq);
                if (!script.isStart) {
                    script.isStart = true;
                    sq.leftWheel = 0;
                    sq.rightWheel = 0;
                    turtle.setPulse(sq, 0);
                    turtle.setMotion(sq, 0, 0, 0, 0, 0);
                    var mode = Number(script.getField('DIRECTION'));
                    Entry.Turtle.setLineTracerMode(sq, mode);
                    return script;
                } else {
                    if (pd.lineTracerStateId != turtle.lineTracerStateId) {
                        turtle.lineTracerStateId = pd.lineTracerStateId;
                        if (pd.lineTracerState == 0x02) {
                            delete script.isStart;
                            Entry.engine.isContinue = false;
                            turtle.setLineTracerMode(sq, 0);
                            return script.callReturn();
                        }
                    }
                    return script;
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.intersection_left()',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_left, '20'],
                                    [Lang.Blocks.ROBOID_right, '30'],
                                    [Lang.Blocks.ROBOID_back, '50'],
                                ],
                                value: '20',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['20'],
                    },
                    {
                        syntax: 'Turtle.intersection_right()',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_left, '20'],
                                    [Lang.Blocks.ROBOID_right, '30'],
                                    [Lang.Blocks.ROBOID_back, '50'],
                                ],
                                value: '20',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['30'],
                    },
                    {
                        syntax: 'Turtle.intersection_uturn()',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_left, '20'],
                                    [Lang.Blocks.ROBOID_right, '30'],
                                    [Lang.Blocks.ROBOID_back, '50'],
                                ],
                                value: '20',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['50'],
                    },
                ],
            },
        },
        turtle_set_following_speed_to: {
            color: '#00979D',
            skeleton: 'basic',
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
                    ],
                    value: '1',
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
                params: ['5', null],
                type: 'turtle_set_following_speed_to',
            },
            paramsKeyMap: {
                SPEED: 0,
            },
            class: 'turtle_wheel',
            isNotFor: ['turtle'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                Entry.Turtle.setModule(sq);
                var speed = Number(script.getField('SPEED'));
                sq.lineTracerSpeed = speed;
                sq.lineTracerGain = speed;
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.line_tracer_speed(%1)',
                        textParams: [
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
                                ],
                                value: '1',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters
                                        .returnStringOrNumberByValue,
                            },
                        ],
                    },
                ],
            },
        },
        turtle_stop: {
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
                type: 'turtle_stop',
            },
            class: 'turtle_wheel',
            isNotFor: ['turtle'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var turtle = Entry.Turtle;
                turtle.setModule(sq);
                sq.leftWheel = 0;
                sq.rightWheel = 0;
                turtle.setPulse(sq, 0);
                turtle.setLineTracerMode(sq, 0);
                turtle.setMotion(sq, 0, 0, 0, 0, 0);
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.stop()',
                    },
                ],
            },
        },
        turtle_set_head_led_to: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_color_red, 'RED'],
                        [Lang.Blocks.ROBOID_color_orange, 'ORANGE'],
                        [Lang.Blocks.ROBOID_color_yellow, 'YELLOW'],
                        [Lang.Blocks.ROBOID_color_green, 'GREEN'],
                        [Lang.Blocks.ROBOID_color_sky_blue, 'CYAN'],
                        [Lang.Blocks.ROBOID_color_blue, 'BLUE'],
                        [Lang.Blocks.ROBOID_color_violet, 'VIOLET'],
                        [Lang.Blocks.ROBOID_color_purple, 'MAGENTA'],
                        [Lang.Blocks.ROBOID_color_white, 'WHITE'],
                    ],
                    value: 'RED',
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
                type: 'turtle_set_head_led_to',
            },
            paramsKeyMap: {
                COLOR: 0,
            },
            class: 'turtle_led',
            isNotFor: ['turtle'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var color = script.getField('COLOR');
                Entry.Turtle.setModule(sq);
                Entry.Turtle.setLedColor(sq, color);
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.led_color(%1)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_color_red, 'RED'],
                                    [Lang.Blocks.ROBOID_color_orange, 'ORANGE'],
                                    [Lang.Blocks.ROBOID_color_yellow, 'YELLOW'],
                                    [Lang.Blocks.ROBOID_color_green, 'GREEN'],
                                    [Lang.Blocks.ROBOID_color_sky_blue, 'CYAN'],
                                    [Lang.Blocks.ROBOID_color_blue, 'BLUE'],
                                    [Lang.Blocks.ROBOID_color_violet, 'VIOLET'],
                                    [
                                        Lang.Blocks.ROBOID_color_purple,
                                        'MAGENTA',
                                    ],
                                    [Lang.Blocks.ROBOID_color_white, 'WHITE'],
                                ],
                                value: 'RED',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters
                                        .returnValuePartialUpperCase,
                                codeMap: 'Entry.CodeMap.Turtle.led_colors',
                            },
                        ],
                    },
                ],
            },
        },
        turtle_change_head_led_by_rgb: {
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
                        type: 'text',
                        params: ['10'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'turtle_change_head_led_by_rgb',
            },
            paramsKeyMap: {
                RED: 0,
                GREEN: 1,
                BLUE: 2,
            },
            class: 'turtle_led',
            isNotFor: ['turtle'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                Entry.Turtle.setModule(sq);
                var red = script.getNumberValue('RED');
                var green = script.getNumberValue('GREEN');
                var blue = script.getNumberValue('BLUE');
                sq.ledRed = sq.ledRed != undefined ? sq.ledRed + red : red;
                sq.ledGreen =
                    sq.ledGreen != undefined ? sq.ledGreen + green : green;
                sq.ledBlue = sq.ledBlue != undefined ? sq.ledBlue + blue : blue;
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.led_by(%1, %2, %3)',
                        textParams: [
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
                    },
                ],
            },
        },
        turtle_set_head_led_to_rgb: {
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
                        type: 'text',
                        params: ['255'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'turtle_set_head_led_to_rgb',
            },
            paramsKeyMap: {
                RED: 0,
                GREEN: 1,
                BLUE: 2,
            },
            class: 'turtle_led',
            isNotFor: ['turtle'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                Entry.Turtle.setModule(sq);
                sq.ledRed = script.getNumberValue('RED');
                sq.ledGreen = script.getNumberValue('GREEN');
                sq.ledBlue = script.getNumberValue('BLUE');
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.led(%1, %2, %3)',
                        textParams: [
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
                    },
                ],
            },
        },
        turtle_clear_head_led: {
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
                type: 'turtle_clear_head_led',
            },
            class: 'turtle_led',
            isNotFor: ['turtle'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                Entry.Turtle.setModule(sq);
                sq.ledRed = 0;
                sq.ledGreen = 0;
                sq.ledBlue = 0;
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.led(0)',
                    },
                ],
            },
        },
        turtle_play_sound_times: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_sound_beep, '1'],
                        [Lang.Blocks.ROBOID_sound_random_beep, '2'],
                        [Lang.Blocks.ROBOID_sound_siren, '3'],
                        [Lang.Blocks.ROBOID_sound_engine, '4'],
                        [Lang.Blocks.ROBOID_sound_robot, '5'],
                        [Lang.Blocks.ROBOID_sound_march, '6'],
                        [Lang.Blocks.ROBOID_sound_birthday, '7'],
                        [Lang.Blocks.ROBOID_sound_dibidibidip, '8'],
                        [Lang.Blocks.ROBOID_sound_good_job, '9'],
                    ],
                    value: '1',
                    fontSize: 11,
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
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'turtle_play_sound_times',
            },
            paramsKeyMap: {
                SOUND: 0,
                COUNT: 1,
            },
            class: 'turtle_sound',
            isNotFor: ['turtle'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                Entry.Turtle.setModule(sq);
                sq.buzzer = 0;
                sq.note = 0;
                var sound = Number(script.getField('SOUND'));
                var count = script.getNumberValue('COUNT');
                if (count) Entry.Turtle.setSound(sq, sound, count);
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.sound(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_sound_beep, '1'],
                                    [Lang.Blocks.ROBOID_sound_random_beep, '2'],
                                    [Lang.Blocks.ROBOID_sound_siren, '3'],
                                    [Lang.Blocks.ROBOID_sound_engine, '4'],
                                    [Lang.Blocks.ROBOID_sound_robot, '5'],
                                    [Lang.Blocks.ROBOID_sound_march, '6'],
                                    [Lang.Blocks.ROBOID_sound_birthday, '7'],
                                    [Lang.Blocks.ROBOID_sound_dibidibidip, '8'],
                                    [Lang.Blocks.ROBOID_sound_good_job, '9'],
                                ],
                                value: '1',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters
                                        .returnValuePartialUpperCase,
                                codeMap: 'Entry.CodeMap.Turtle.sounds',
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
        turtle_play_sound_times_until_done: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_sound_beep, '1'],
                        [Lang.Blocks.ROBOID_sound_random_beep, '2'],
                        [Lang.Blocks.ROBOID_sound_siren, '3'],
                        [Lang.Blocks.ROBOID_sound_engine, '4'],
                        [Lang.Blocks.ROBOID_sound_robot, '5'],
                        [Lang.Blocks.ROBOID_sound_march, '6'],
                        [Lang.Blocks.ROBOID_sound_birthday, '7'],
                        [Lang.Blocks.ROBOID_sound_dibidibidip, '8'],
                        [Lang.Blocks.ROBOID_sound_good_job, '9'],
                    ],
                    value: '1',
                    fontSize: 11,
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
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'turtle_play_sound_times_until_done',
            },
            paramsKeyMap: {
                SOUND: 0,
                COUNT: 1,
            },
            class: 'turtle_sound',
            isNotFor: ['turtle'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                var turtle = Entry.Turtle;
                turtle.setModule(sq);
                if (!script.isStart) {
                    script.isStart = true;
                    sq.buzzer = 0;
                    sq.note = 0;
                    var sound = Number(script.getField('SOUND'));
                    var count = script.getNumberValue('COUNT');
                    if (count) {
                        turtle.setSound(sq, sound, count);
                        return script;
                    } else {
                        turtle.sound = 0;
                        turtle.soundRepeat = 1;
                        delete script.isStart;
                        Entry.engine.isContinue = false;
                        return script.callReturn();
                    }
                } else {
                    if (pd.soundStateId != turtle.soundStateId) {
                        turtle.soundStateId = pd.soundStateId;
                        if (pd.soundState == 0) {
                            delete script.isStart;
                            Entry.engine.isContinue = false;
                            return script.callReturn();
                        }
                    }
                    return script;
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.sound_until_done(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_sound_beep, '1'],
                                    [Lang.Blocks.ROBOID_sound_random_beep, '2'],
                                    [Lang.Blocks.ROBOID_sound_siren, '3'],
                                    [Lang.Blocks.ROBOID_sound_engine, '4'],
                                    [Lang.Blocks.ROBOID_sound_robot, '5'],
                                    [Lang.Blocks.ROBOID_sound_march, '6'],
                                    [Lang.Blocks.ROBOID_sound_birthday, '7'],
                                    [Lang.Blocks.ROBOID_sound_dibidibidip, '8'],
                                    [Lang.Blocks.ROBOID_sound_good_job, '9'],
                                ],
                                value: '1',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters
                                        .returnValuePartialUpperCase,
                                codeMap: 'Entry.CodeMap.Turtle.sounds',
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
        turtle_change_buzzer_by: {
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
                        type: 'text',
                        params: ['10'],
                    },
                    null,
                ],
                type: 'turtle_change_buzzer_by',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'turtle_sound',
            isNotFor: ['turtle'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                Entry.Turtle.setModule(sq);
                var value = script.getNumberValue('VALUE');
                sq.buzzer = sq.buzzer != undefined ? sq.buzzer + value : value;
                sq.note = 0;
                Entry.Turtle.setSound(sq, 0);
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.buzzer_by(%1)',
                    },
                ],
            },
        },
        turtle_set_buzzer_to: {
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
                        type: 'text',
                        params: ['1000'],
                    },
                    null,
                ],
                type: 'turtle_set_buzzer_to',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'turtle_sound',
            isNotFor: ['turtle'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                Entry.Turtle.setModule(sq);
                sq.buzzer = script.getNumberValue('VALUE');
                sq.note = 0;
                Entry.Turtle.setSound(sq, 0);
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.buzzer(%1)',
                    },
                ],
            },
        },
        turtle_clear_sound: {
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
                type: 'turtle_clear_sound',
            },
            class: 'turtle_sound',
            isNotFor: ['turtle'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                Entry.Turtle.setModule(sq);
                sq.buzzer = 0;
                sq.note = 0;
                Entry.Turtle.setSound(sq, 0);
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.sound(0)',
                        params: [null],
                    },
                    {
                        syntax: 'Turtle.sound(Turtle.SOUND_OFF)',
                        params: [null],
                    },
                    {
                        syntax: 'Turtle.buzzer(0)',
                        params: [null],
                    },
                ],
            },
        },
        turtle_play_note: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ALBERT_note_c + '', '4'],
                        [Lang.Blocks.ALBERT_note_c + '#', '5'],
                        [Lang.Blocks.ALBERT_note_d + '', '6'],
                        [Lang.Blocks.ALBERT_note_e + 'b', '7'],
                        [Lang.Blocks.ALBERT_note_e + '', '8'],
                        [Lang.Blocks.ALBERT_note_f + '', '9'],
                        [Lang.Blocks.ALBERT_note_f + '#', '10'],
                        [Lang.Blocks.ALBERT_note_g + '', '11'],
                        [Lang.Blocks.ALBERT_note_g + '#', '12'],
                        [Lang.Blocks.ALBERT_note_a + '', '13'],
                        [Lang.Blocks.ALBERT_note_b + 'b', '14'],
                        [Lang.Blocks.ALBERT_note_b + '', '15'],
                    ],
                    value: '4',
                    fontSize: 11,
                },
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
                    ],
                    value: '1',
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
                params: [null, '4', null],
                type: 'turtle_play_note',
            },
            paramsKeyMap: {
                NOTE: 0,
                OCTAVE: 1,
            },
            class: 'turtle_sound',
            isNotFor: ['turtle'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var note = script.getNumberField('NOTE', script);
                var octave = script.getNumberField('OCTAVE', script);
                Entry.Turtle.setModule(sq);
                sq.buzzer = 0;
                note += (octave - 1) * 12;
                sq.note = note;
                Entry.Turtle.setSound(sq, 0);
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.pitch(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ALBERT_note_c + '', '4'],
                                    [Lang.Blocks.ALBERT_note_c + '#', '5'],
                                    [Lang.Blocks.ALBERT_note_d + '', '6'],
                                    [Lang.Blocks.ALBERT_note_e + 'b', '7'],
                                    [Lang.Blocks.ALBERT_note_e + '', '8'],
                                    [Lang.Blocks.ALBERT_note_f + '', '9'],
                                    [Lang.Blocks.ALBERT_note_f + '#', '10'],
                                    [Lang.Blocks.ALBERT_note_g + '', '11'],
                                    [Lang.Blocks.ALBERT_note_g + '#', '12'],
                                    [Lang.Blocks.ALBERT_note_a + '', '13'],
                                    [Lang.Blocks.ALBERT_note_b + 'b', '14'],
                                    [Lang.Blocks.ALBERT_note_b + '', '15'],
                                ],
                                value: '4',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters
                                        .returnValuePartialUpperCase,
                                codeMap: 'Entry.CodeMap.Turtle.notes',
                            },
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
                                ],
                                value: '1',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters
                                        .returnStringOrNumberByValue,
                            },
                        ],
                    },
                ],
            },
        },
        turtle_play_note_for_beats: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ALBERT_note_c + '', '4'],
                        [Lang.Blocks.ALBERT_note_c + '#', '5'],
                        [Lang.Blocks.ALBERT_note_d + '', '6'],
                        [Lang.Blocks.ALBERT_note_e + 'b', '7'],
                        [Lang.Blocks.ALBERT_note_e + '', '8'],
                        [Lang.Blocks.ALBERT_note_f + '', '9'],
                        [Lang.Blocks.ALBERT_note_f + '#', '10'],
                        [Lang.Blocks.ALBERT_note_g + '', '11'],
                        [Lang.Blocks.ALBERT_note_g + '#', '12'],
                        [Lang.Blocks.ALBERT_note_a + '', '13'],
                        [Lang.Blocks.ALBERT_note_b + 'b', '14'],
                        [Lang.Blocks.ALBERT_note_b + '', '15'],
                    ],
                    value: '4',
                    fontSize: 11,
                },
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
                    ],
                    value: '1',
                    fontSize: 11,
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
                    '4',
                    {
                        type: 'text',
                        params: ['0.5'],
                    },
                    null,
                ],
                type: 'turtle_play_note_for_beats',
            },
            paramsKeyMap: {
                NOTE: 0,
                OCTAVE: 1,
                VALUE: 2,
            },
            class: 'turtle_sound',
            isNotFor: ['turtle'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var turtle = Entry.Turtle;
                turtle.setModule(sq);
                if (!script.isStart) {
                    var note = script.getNumberField('NOTE', script);
                    var octave = script.getNumberField('OCTAVE', script);
                    var beat = script.getNumberValue('VALUE', script);
                    note += (octave - 1) * 12;
                    var timeValue = beat * 60 * 1000 / turtle.tempo;
                    script.isStart = true;
                    script.timeFlag = 1;
                    sq.buzzer = 0;
                    sq.note = note;
                    turtle.setSound(sq, 0);
                    if (timeValue > 100) {
                        var timer1 = setTimeout(function() {
                            sq.note = 0;
                            turtle.removeTimeout(timer1);
                        }, timeValue - 100);
                        turtle.timeouts.push(timer1);
                    }
                    var timer2 = setTimeout(function() {
                        script.timeFlag = 0;
                        turtle.removeTimeout(timer2);
                    }, timeValue);
                    turtle.timeouts.push(timer2);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    Entry.engine.isContinue = false;
                    sq.note = 0;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.note(%1, %2, %3)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ALBERT_note_c + '', '4'],
                                    [Lang.Blocks.ALBERT_note_c + '#', '5'],
                                    [Lang.Blocks.ALBERT_note_d + '', '6'],
                                    [Lang.Blocks.ALBERT_note_e + 'b', '7'],
                                    [Lang.Blocks.ALBERT_note_e + '', '8'],
                                    [Lang.Blocks.ALBERT_note_f + '', '9'],
                                    [Lang.Blocks.ALBERT_note_f + '#', '10'],
                                    [Lang.Blocks.ALBERT_note_g + '', '11'],
                                    [Lang.Blocks.ALBERT_note_g + '#', '12'],
                                    [Lang.Blocks.ALBERT_note_a + '', '13'],
                                    [Lang.Blocks.ALBERT_note_b + 'b', '14'],
                                    [Lang.Blocks.ALBERT_note_b + '', '15'],
                                ],
                                value: '4',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters
                                        .returnValuePartialUpperCase,
                                codeMap: 'Entry.CodeMap.Turtle.notes',
                            },
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
                                ],
                                value: '1',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters
                                        .returnStringOrNumberByValue,
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
        turtle_rest_for_beats: {
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
                        type: 'text',
                        params: ['0.25'],
                    },
                    null,
                ],
                type: 'turtle_rest_for_beats',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'turtle_sound',
            isNotFor: ['turtle'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var turtle = Entry.Turtle;
                turtle.setModule(sq);
                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timeValue = script.getNumberValue('VALUE');
                    timeValue = timeValue * 60 * 1000 / turtle.tempo;
                    sq.buzzer = 0;
                    sq.note = 0;
                    turtle.setSound(sq, 0);
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        turtle.removeTimeout(timer);
                    }, timeValue);
                    turtle.timeouts.push(timer);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.note(0, %1)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                        keyOption: '0',
                    },
                    {
                        syntax: 'Turtle.note(Turtle.NOTE_OFF, %1)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                        keyOption: 'Turtle.NOTE_OFF',
                    },
                ],
            },
        },
        turtle_change_tempo_by: {
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
                        type: 'text',
                        params: ['20'],
                    },
                    null,
                ],
                type: 'turtle_change_tempo_by',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'turtle_sound',
            isNotFor: ['turtle'],
            func: function(sprite, script) {
                var turtle = Entry.Turtle;
                turtle.setModule(Entry.hw.sendQueue);
                turtle.tempo += script.getNumberValue('VALUE');
                if (turtle.tempo < 1) turtle.tempo = 1;
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.tempo_by(%1)',
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
        turtle_set_tempo_to: {
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
                        type: 'text',
                        params: ['60'],
                    },
                    null,
                ],
                type: 'turtle_set_tempo_to',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'turtle_sound',
            isNotFor: ['turtle'],
            func: function(sprite, script) {
                var turtle = Entry.Turtle;
                turtle.setModule(Entry.hw.sendQueue);
                turtle.tempo = script.getNumberValue('VALUE');
                if (turtle.tempo < 1) turtle.tempo = 1;
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Turtle.tempo(%1)',
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
        //endregion turtle 터틀
    };
};
