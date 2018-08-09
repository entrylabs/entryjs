'use strict';

Entry.Hamster = {
    PORT_MAP: {
        motion: 0,
        leftWheel: 0,
        rightWheel: 0,
        buzzer: 0,
        outputA: 0,
        outputB: 0,
        leftLed: 0,
        rightLed: 0,
        note: 0,
        lineTracerMode: 0,
        lineTracerModeId: 0,
        lineTracerSpeed: 5,
        ioModeA: 0,
        ioModeB: 0,
    },
    setZero: function() {
        var portMap = Entry.Hamster.PORT_MAP;
        var sq = Entry.hw.sendQueue;
        for (var port in portMap) {
            sq[port] = portMap[port];
        }
        Entry.hw.update();
        var hamster = Entry.Hamster;
        hamster.lineTracerModeId = 0;
        hamster.lineTracerStateId = -1;
        hamster.tempo = 60;
        hamster.boardCommand = 0;
        hamster.removeAllTimeouts();
    },
    lineTracerModeId: 0,
    lineTracerStateId: -1,
    tempo: 60,
    boardCommand: 60,
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
        sq.module = 'hamster';
    },
    setLineTracerMode: function(sq, mode) {
        this.lineTracerModeId = this.lineTracerModeId % 255 + 1;
        sq.lineTracerMode = mode;
        sq.lineTracerModeId = this.lineTracerModeId;
    },
    name: 'hamster',
    url: 'http://www.robomation.net',
    imageName: 'hamster.png',
    title: {
        ko: '햄스터',
        en: 'Hamster',
    },
    monitorTemplate: {
        imgPath: 'hw/hamster.png',
        width: 256,
        height: 256,
        listPorts: {
            temperature: {
                name: Lang.Blocks.HAMSTER_sensor_temperature,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            inputA: {
                name: Lang.Blocks.HAMSTER_sensor_input_a,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            inputB: {
                name: Lang.Blocks.HAMSTER_sensor_input_b,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            accelerationX: {
                name: Lang.Blocks.HAMSTER_sensor_acceleration_x,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            accelerationY: {
                name: Lang.Blocks.HAMSTER_sensor_acceleration_y,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            accelerationZ: {
                name: Lang.Blocks.HAMSTER_sensor_acceleration_z,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            buzzer: {
                name: Lang.Hw.buzzer,
                type: 'output',
                pos: { x: 0, y: 0 },
            },
            note: { name: Lang.Hw.note, type: 'output', pos: { x: 0, y: 0 } },
            outputA: {
                name: Lang.Hw.output + 'A',
                type: 'output',
                pos: { x: 0, y: 0 },
            },
            outputB: {
                name: Lang.Hw.output + 'B',
                type: 'output',
                pos: { x: 0, y: 0 },
            },
        },
        ports: {
            leftProximity: {
                name: Lang.Blocks.HAMSTER_sensor_left_proximity,
                type: 'input',
                pos: { x: 122, y: 156 },
            },
            rightProximity: {
                name: Lang.Blocks.HAMSTER_sensor_right_proximity,
                type: 'input',
                pos: { x: 10, y: 108 },
            },
            leftFloor: {
                name: Lang.Blocks.HAMSTER_sensor_left_floor,
                type: 'input',
                pos: { x: 100, y: 234 },
            },
            rightFloor: {
                name: Lang.Blocks.HAMSTER_sensor_right_floor,
                type: 'input',
                pos: { x: 13, y: 180 },
            },
            light: {
                name: Lang.Blocks.HAMSTER_sensor_light,
                type: 'input',
                pos: { x: 56, y: 189 },
            },
            leftWheel: {
                name: Lang.Hw.leftWheel,
                type: 'output',
                pos: { x: 209, y: 115 },
            },
            rightWheel: {
                name: Lang.Hw.rightWheel,
                type: 'output',
                pos: { x: 98, y: 30 },
            },
            leftLed: {
                name: Lang.Hw.left + ' ' + Lang.Hw.led_en,
                type: 'output',
                pos: { x: 87, y: 210 },
            },
            rightLed: {
                name: Lang.Hw.right + ' ' + Lang.Hw.led_en,
                type: 'output',
                pos: { x: 24, y: 168 },
            },
        },
        mode: 'both',
    },
};

Entry.Hamster.setLanguage = function() {
    return {
        ko: {
            Helper: {
                hamster_gripper: '집게를 열거나 닫습니다.',
                hamster_release_gripper:
                    '집게의 전원을 끄고 자유롭게 움직일 수 있도록 합니다.',
            },
            template: {
                hamster_gripper: '집게 %1 %2',
                hamster_release_gripper: '집게 끄기 %1',
            },
        },
        en: {
            Helper: {
                hamster_gripper: 'Opens or closes the gripper.',
                hamster_release_gripper:
                    'Turns off the gripper so that it can be moved freely.',
            },
            template: {
                hamster_gripper: '%1 gripper %2',
                hamster_release_gripper: 'release gripper %1',
            },
        },
    };
};

Entry.Hamster.getBlocks = function() {
    return {
        //region hamster 햄스터
        hamster_hand_found: {
            color: '#00979D',
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [],
                type: 'hamster_hand_found',
            },
            class: 'hamster_sensor',
            isNotFor: ['hamster'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;
                return pd.leftProximity > 50 || pd.rightProximity > 50;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Hamster.hand_found()',
                        blockType: 'param',
                    },
                ],
            },
        },
        hamster_value: {
            color: '#00979D',
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [
                            Lang.Blocks.HAMSTER_sensor_left_proximity,
                            'leftProximity',
                        ],
                        [
                            Lang.Blocks.HAMSTER_sensor_right_proximity,
                            'rightProximity',
                        ],
                        [Lang.Blocks.HAMSTER_sensor_left_floor, 'leftFloor'],
                        [Lang.Blocks.HAMSTER_sensor_right_floor, 'rightFloor'],
                        [
                            Lang.Blocks.HAMSTER_sensor_acceleration_x,
                            'accelerationX',
                        ],
                        [
                            Lang.Blocks.HAMSTER_sensor_acceleration_y,
                            'accelerationY',
                        ],
                        [
                            Lang.Blocks.HAMSTER_sensor_acceleration_z,
                            'accelerationZ',
                        ],
                        [Lang.Blocks.HAMSTER_sensor_light, 'light'],
                        [Lang.Blocks.HAMSTER_sensor_temperature, 'temperature'],
                        [
                            Lang.Blocks.HAMSTER_sensor_signal_strength,
                            'signalStrength',
                        ],
                        [Lang.Blocks.HAMSTER_sensor_input_a, 'inputA'],
                        [Lang.Blocks.HAMSTER_sensor_input_b, 'inputB'],
                    ],
                    value: 'leftProximity',
                    fontSize: 11,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'hamster_value',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class: 'hamster_sensor',
            isNotFor: ['hamster'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;
                var dev = script.getField('DEVICE');
                return pd[dev];
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Hamster.left_proximity()',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_left_proximity,
                                        'leftProximity',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_right_proximity,
                                        'rightProximity',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_left_floor,
                                        'leftFloor',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_right_floor,
                                        'rightFloor',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_acceleration_x,
                                        'accelerationX',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_acceleration_y,
                                        'accelerationY',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_acceleration_z,
                                        'accelerationZ',
                                    ],
                                    [Lang.Blocks.HAMSTER_sensor_light, 'light'],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_temperature,
                                        'temperature',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_signal_strength,
                                        'signalStrength',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_input_a,
                                        'inputA',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_input_b,
                                        'inputB',
                                    ],
                                ],
                                value: 'leftProximity',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['leftProximity'],
                    },
                    {
                        syntax: 'Hamster.right_proximity()',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_left_proximity,
                                        'leftProximity',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_right_proximity,
                                        'rightProximity',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_left_floor,
                                        'leftFloor',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_right_floor,
                                        'rightFloor',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_acceleration_x,
                                        'accelerationX',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_acceleration_y,
                                        'accelerationY',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_acceleration_z,
                                        'accelerationZ',
                                    ],
                                    [Lang.Blocks.HAMSTER_sensor_light, 'light'],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_temperature,
                                        'temperature',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_signal_strength,
                                        'signalStrength',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_input_a,
                                        'inputA',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_input_b,
                                        'inputB',
                                    ],
                                ],
                                value: 'leftProximity',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['rightProximity'],
                    },
                    {
                        syntax: 'Hamster.left_floor()',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_left_proximity,
                                        'leftProximity',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_right_proximity,
                                        'rightProximity',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_left_floor,
                                        'leftFloor',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_right_floor,
                                        'rightFloor',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_acceleration_x,
                                        'accelerationX',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_acceleration_y,
                                        'accelerationY',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_acceleration_z,
                                        'accelerationZ',
                                    ],
                                    [Lang.Blocks.HAMSTER_sensor_light, 'light'],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_temperature,
                                        'temperature',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_signal_strength,
                                        'signalStrength',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_input_a,
                                        'inputA',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_input_b,
                                        'inputB',
                                    ],
                                ],
                                value: 'leftProximity',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['leftFloor'],
                    },
                    {
                        syntax: 'Hamster.right_floor()',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_left_proximity,
                                        'leftProximity',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_right_proximity,
                                        'rightProximity',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_left_floor,
                                        'leftFloor',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_right_floor,
                                        'rightFloor',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_acceleration_x,
                                        'accelerationX',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_acceleration_y,
                                        'accelerationY',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_acceleration_z,
                                        'accelerationZ',
                                    ],
                                    [Lang.Blocks.HAMSTER_sensor_light, 'light'],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_temperature,
                                        'temperature',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_signal_strength,
                                        'signalStrength',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_input_a,
                                        'inputA',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_input_b,
                                        'inputB',
                                    ],
                                ],
                                value: 'leftProximity',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['rightFloor'],
                    },
                    {
                        syntax: 'Hamster.acceleration_x()',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_left_proximity,
                                        'leftProximity',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_right_proximity,
                                        'rightProximity',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_left_floor,
                                        'leftFloor',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_right_floor,
                                        'rightFloor',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_acceleration_x,
                                        'accelerationX',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_acceleration_y,
                                        'accelerationY',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_acceleration_z,
                                        'accelerationZ',
                                    ],
                                    [Lang.Blocks.HAMSTER_sensor_light, 'light'],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_temperature,
                                        'temperature',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_signal_strength,
                                        'signalStrength',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_input_a,
                                        'inputA',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_input_b,
                                        'inputB',
                                    ],
                                ],
                                value: 'leftProximity',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['accelerationX'],
                    },
                    {
                        syntax: 'Hamster.acceleration_y()',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_left_proximity,
                                        'leftProximity',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_right_proximity,
                                        'rightProximity',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_left_floor,
                                        'leftFloor',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_right_floor,
                                        'rightFloor',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_acceleration_x,
                                        'accelerationX',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_acceleration_y,
                                        'accelerationY',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_acceleration_z,
                                        'accelerationZ',
                                    ],
                                    [Lang.Blocks.HAMSTER_sensor_light, 'light'],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_temperature,
                                        'temperature',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_signal_strength,
                                        'signalStrength',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_input_a,
                                        'inputA',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_input_b,
                                        'inputB',
                                    ],
                                ],
                                value: 'leftProximity',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['accelerationY'],
                    },
                    {
                        syntax: 'Hamster.acceleration_z()',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_left_proximity,
                                        'leftProximity',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_right_proximity,
                                        'rightProximity',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_left_floor,
                                        'leftFloor',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_right_floor,
                                        'rightFloor',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_acceleration_x,
                                        'accelerationX',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_acceleration_y,
                                        'accelerationY',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_acceleration_z,
                                        'accelerationZ',
                                    ],
                                    [Lang.Blocks.HAMSTER_sensor_light, 'light'],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_temperature,
                                        'temperature',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_signal_strength,
                                        'signalStrength',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_input_a,
                                        'inputA',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_input_b,
                                        'inputB',
                                    ],
                                ],
                                value: 'leftProximity',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['accelerationZ'],
                    },
                    {
                        syntax: 'Hamster.light()',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_left_proximity,
                                        'leftProximity',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_right_proximity,
                                        'rightProximity',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_left_floor,
                                        'leftFloor',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_right_floor,
                                        'rightFloor',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_acceleration_x,
                                        'accelerationX',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_acceleration_y,
                                        'accelerationY',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_acceleration_z,
                                        'accelerationZ',
                                    ],
                                    [Lang.Blocks.HAMSTER_sensor_light, 'light'],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_temperature,
                                        'temperature',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_signal_strength,
                                        'signalStrength',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_input_a,
                                        'inputA',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_input_b,
                                        'inputB',
                                    ],
                                ],
                                value: 'leftProximity',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['light'],
                    },
                    {
                        syntax: 'Hamster.temperature()',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_left_proximity,
                                        'leftProximity',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_right_proximity,
                                        'rightProximity',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_left_floor,
                                        'leftFloor',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_right_floor,
                                        'rightFloor',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_acceleration_x,
                                        'accelerationX',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_acceleration_y,
                                        'accelerationY',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_acceleration_z,
                                        'accelerationZ',
                                    ],
                                    [Lang.Blocks.HAMSTER_sensor_light, 'light'],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_temperature,
                                        'temperature',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_signal_strength,
                                        'signalStrength',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_input_a,
                                        'inputA',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_input_b,
                                        'inputB',
                                    ],
                                ],
                                value: 'leftProximity',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['temperature'],
                    },
                    {
                        syntax: 'Hamster.signal_strength()',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_left_proximity,
                                        'leftProximity',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_right_proximity,
                                        'rightProximity',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_left_floor,
                                        'leftFloor',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_right_floor,
                                        'rightFloor',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_acceleration_x,
                                        'accelerationX',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_acceleration_y,
                                        'accelerationY',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_acceleration_z,
                                        'accelerationZ',
                                    ],
                                    [Lang.Blocks.HAMSTER_sensor_light, 'light'],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_temperature,
                                        'temperature',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_signal_strength,
                                        'signalStrength',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_input_a,
                                        'inputA',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_input_b,
                                        'inputB',
                                    ],
                                ],
                                value: 'leftProximity',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['signalStrength'],
                    },
                    {
                        syntax: 'Hamster.input_a()',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_left_proximity,
                                        'leftProximity',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_right_proximity,
                                        'rightProximity',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_left_floor,
                                        'leftFloor',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_right_floor,
                                        'rightFloor',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_acceleration_x,
                                        'accelerationX',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_acceleration_y,
                                        'accelerationY',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_acceleration_z,
                                        'accelerationZ',
                                    ],
                                    [Lang.Blocks.HAMSTER_sensor_light, 'light'],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_temperature,
                                        'temperature',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_signal_strength,
                                        'signalStrength',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_input_a,
                                        'inputA',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_input_b,
                                        'inputB',
                                    ],
                                ],
                                value: 'leftProximity',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['inputA'],
                    },
                    {
                        syntax: 'Hamster.input_b()',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_left_proximity,
                                        'leftProximity',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_right_proximity,
                                        'rightProximity',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_left_floor,
                                        'leftFloor',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_right_floor,
                                        'rightFloor',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_acceleration_x,
                                        'accelerationX',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_acceleration_y,
                                        'accelerationY',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_acceleration_z,
                                        'accelerationZ',
                                    ],
                                    [Lang.Blocks.HAMSTER_sensor_light, 'light'],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_temperature,
                                        'temperature',
                                    ],
                                    [
                                        Lang.Blocks
                                            .HAMSTER_sensor_signal_strength,
                                        'signalStrength',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_input_a,
                                        'inputA',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_sensor_input_b,
                                        'inputB',
                                    ],
                                ],
                                value: 'leftProximity',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['inputB'],
                    },
                ],
            },
        },
        hamster_move_forward_once: {
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
                type: 'hamster_move_forward_once',
            },
            class: 'hamster_board',
            isNotFor: ['hamster'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                Entry.Hamster.setModule(sq); // akaii: add
                if (!script.isStart) {
                    script.isStart = true;
                    script.isMoving = true;
                    script.count = 0;
                    script.boardState = 1;
                    sq.motion = 0; // akaii: add
                    sq.leftWheel = 45;
                    sq.rightWheel = 45;
                    Entry.Hamster.boardCommand = 1; // akaii: add
                    Entry.Hamster.setLineTracerMode(sq, 0);
                    return script;
                } else if (script.isMoving) {
                    if (Entry.Hamster.boardCommand != 1) return script; // akaii: add
                    switch (script.boardState) {
                        case 1: {
                            if (script.count < 2) {
                                if (pd.leftFloor < 50 && pd.rightFloor < 50)
                                    script.count++;
                                else script.count = 0;
                                var diff = pd.leftFloor - pd.rightFloor;
                                sq.leftWheel = 45 + diff * 0.25;
                                sq.rightWheel = 45 - diff * 0.25;
                            } else {
                                script.count = 0;
                                script.boardState = 2;
                            }
                            break;
                        }
                        case 2: {
                            var diff = pd.leftFloor - pd.rightFloor;
                            sq.leftWheel = 45 + diff * 0.25;
                            sq.rightWheel = 45 - diff * 0.25;
                            script.boardState = 3;
                            var timer = setTimeout(function() {
                                script.boardState = 4;
                                Entry.Hamster.removeTimeout(timer);
                            }, 250);
                            Entry.Hamster.timeouts.push(timer);
                            break;
                        }
                        case 3: {
                            var diff = pd.leftFloor - pd.rightFloor;
                            sq.leftWheel = 45 + diff * 0.25;
                            sq.rightWheel = 45 - diff * 0.25;
                            break;
                        }
                        case 4: {
                            sq.leftWheel = 0;
                            sq.rightWheel = 0;
                            script.boardState = 0;
                            script.isMoving = false;
                            break;
                        }
                    }
                    return script;
                } else {
                    delete script.isStart;
                    delete script.isMoving;
                    delete script.count;
                    delete script.boardState;
                    Entry.engine.isContinue = false;
                    Entry.Hamster.boardCommand = 0; // akaii: add
                    sq.leftWheel = 0;
                    sq.rightWheel = 0;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Hamster.board_forward()',
                    },
                ],
            },
        },
        hamster_turn_once: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.HAMSTER_turn_once_left, 'LEFT'],
                        [Lang.Blocks.HAMSTER_turn_right, 'RIGHT'],
                    ],
                    value: 'LEFT',
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
                type: 'hamster_turn_once',
            },
            paramsKeyMap: {
                DIRECTION: 0,
            },
            class: 'hamster_board',
            isNotFor: ['hamster'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var pd = Entry.hw.portData;
                Entry.Hamster.setModule(sq); // akaii: add
                if (!script.isStart) {
                    script.isStart = true;
                    script.isMoving = true;
                    script.count = 0;
                    script.boardState = 1;
                    sq.motion = 0; // akaii: add
                    var direction = script.getField('DIRECTION', script);
                    if (direction == 'LEFT') {
                        script.isLeft = true;
                        sq.leftWheel = -45;
                        sq.rightWheel = 45;
                    } else {
                        script.isLeft = false;
                        sq.leftWheel = 45;
                        sq.rightWheel = -45;
                    }
                    Entry.Hamster.boardCommand = 2; // akaii: add
                    Entry.Hamster.setLineTracerMode(sq, 0);
                    return script;
                } else if (script.isMoving) {
                    if (Entry.Hamster.boardCommand != 2) return script; // akaii: add
                    if (script.isLeft) {
                        switch (script.boardState) {
                            case 1: {
                                if (script.count < 2) {
                                    if (pd.leftFloor > 50) script.count++;
                                } else {
                                    script.count = 0;
                                    script.boardState = 2;
                                }
                                break;
                            }
                            case 2: {
                                if (pd.leftFloor < 20) {
                                    script.boardState = 3;
                                }
                                break;
                            }
                            case 3: {
                                if (script.count < 2) {
                                    if (pd.leftFloor < 20) script.count++;
                                } else {
                                    script.count = 0;
                                    script.boardState = 4;
                                }
                                break;
                            }
                            case 4: {
                                if (pd.leftFloor > 50) {
                                    script.boardState = 5;
                                }
                                break;
                            }
                            case 5: {
                                var diff = pd.leftFloor - pd.rightFloor;
                                if (diff > -15) {
                                    sq.leftWheel = 0;
                                    sq.rightWheel = 0;
                                    script.boardState = 0;
                                    script.isMoving = false;
                                } else {
                                    sq.leftWheel = diff * 0.5;
                                    sq.rightWheel = -diff * 0.5;
                                }
                                break;
                            }
                        }
                    } else {
                        switch (script.boardState) {
                            case 1: {
                                if (script.count < 2) {
                                    if (pd.rightFloor > 50) script.count++;
                                } else {
                                    script.count = 0;
                                    script.boardState = 2;
                                }
                                break;
                            }
                            case 2: {
                                if (pd.rightFloor < 20) {
                                    script.boardState = 3;
                                }
                                break;
                            }
                            case 3: {
                                if (script.count < 2) {
                                    if (pd.rightFloor < 20) script.count++;
                                } else {
                                    script.count = 0;
                                    script.boardState = 4;
                                }
                                break;
                            }
                            case 4: {
                                if (pd.rightFloor > 50) {
                                    script.boardState = 5;
                                }
                                break;
                            }
                            case 5: {
                                var diff = pd.rightFloor - pd.leftFloor;
                                if (diff > -15) {
                                    sq.leftWheel = 0;
                                    sq.rightWheel = 0;
                                    script.boardState = 0;
                                    script.isMoving = false;
                                } else {
                                    sq.leftWheel = -diff * 0.5;
                                    sq.rightWheel = diff * 0.5;
                                }
                                break;
                            }
                        }
                    }
                    return script;
                } else {
                    delete script.isStart;
                    delete script.isMoving;
                    delete script.count;
                    delete script.boardState;
                    delete script.isLeft;
                    Entry.engine.isContinue = false;
                    Entry.Hamster.boardCommand = 0; // akaii: add
                    sq.leftWheel = 0;
                    sq.rightWheel = 0;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Hamster.board_left()',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [
                                        Lang.Blocks.HAMSTER_turn_once_left,
                                        'LEFT',
                                    ],
                                    [Lang.Blocks.HAMSTER_turn_right, 'RIGHT'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['LEFT'],
                    },
                    {
                        syntax: 'Hamster.board_right()',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [
                                        Lang.Blocks.HAMSTER_turn_once_left,
                                        'LEFT',
                                    ],
                                    [Lang.Blocks.HAMSTER_turn_right, 'RIGHT'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['RIGHT'],
                    },
                ],
            },
        },
        hamster_move_forward_for_secs: {
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
                        params: ['1'],
                    },
                    null,
                ],
                type: 'hamster_move_forward_for_secs',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'hamster_wheel',
            isNotFor: ['hamster'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                Entry.Hamster.setModule(sq); // akaii: add
                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    sq.motion = 1; // akaii: add
                    sq.leftWheel = 30;
                    sq.rightWheel = 30;
                    Entry.Hamster.boardCommand = 0; // akaii: add
                    Entry.Hamster.setLineTracerMode(sq, 0);
                    var timeValue = script.getNumberValue('VALUE') * 1000;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.Hamster.removeTimeout(timer);
                    }, timeValue);
                    Entry.Hamster.timeouts.push(timer);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    Entry.engine.isContinue = false;
                    sq.motion = 0; // akaii: add
                    sq.leftWheel = 0;
                    sq.rightWheel = 0;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Hamster.move_forward(%1)',
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
        hamster_move_backward_for_secs: {
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
                        params: ['1'],
                    },
                    null,
                ],
                type: 'hamster_move_backward_for_secs',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'hamster_wheel',
            isNotFor: ['hamster'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                Entry.Hamster.setModule(sq); // akaii: add
                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    sq.motion = 2; // akaii: add
                    sq.leftWheel = -30;
                    sq.rightWheel = -30;
                    Entry.Hamster.boardCommand = 0; // akaii: add
                    Entry.Hamster.setLineTracerMode(sq, 0);
                    var timeValue = script.getNumberValue('VALUE') * 1000;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.Hamster.removeTimeout(timer);
                    }, timeValue);
                    Entry.Hamster.timeouts.push(timer);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    Entry.engine.isContinue = false;
                    sq.motion = 0; // akaii: add
                    sq.leftWheel = 0;
                    sq.rightWheel = 0;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Hamster.move_backward(%1)',
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
        hamster_turn_for_secs: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.HAMSTER_turn_once_left, 'LEFT'],
                        [Lang.Blocks.HAMSTER_turn_right, 'RIGHT'],
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
                        params: ['1'],
                    },
                    null,
                ],
                type: 'hamster_turn_for_secs',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                VALUE: 1,
            },
            class: 'hamster_wheel',
            isNotFor: ['hamster'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                Entry.Hamster.setModule(sq); // akaii: add
                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var direction = script.getField('DIRECTION', script);
                    if (direction == 'LEFT') {
                        sq.motion = 3; // akaii: add
                        sq.leftWheel = -30;
                        sq.rightWheel = 30;
                    } else {
                        sq.motion = 4; // akaii: add
                        sq.leftWheel = 30;
                        sq.rightWheel = -30;
                    }
                    Entry.Hamster.boardCommand = 0; // akaii: add
                    Entry.Hamster.setLineTracerMode(sq, 0);
                    var timeValue = script.getNumberValue('VALUE') * 1000;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.Hamster.removeTimeout(timer);
                    }, timeValue);
                    Entry.Hamster.timeouts.push(timer);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    Entry.engine.isContinue = false;
                    sq.motion = 0; // akaii: add
                    sq.leftWheel = 0;
                    sq.rightWheel = 0;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Hamster.turn_left(%2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [
                                        Lang.Blocks.HAMSTER_turn_once_left,
                                        'LEFT',
                                    ],
                                    [Lang.Blocks.HAMSTER_turn_right, 'RIGHT'],
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
                        syntax: 'Hamster.turn_right(%2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [
                                        Lang.Blocks.HAMSTER_turn_once_left,
                                        'LEFT',
                                    ],
                                    [Lang.Blocks.HAMSTER_turn_right, 'RIGHT'],
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
                ],
            },
        },
        hamster_change_both_wheels_by: {
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
                type: 'hamster_change_both_wheels_by',
            },
            paramsKeyMap: {
                LEFT: 0,
                RIGHT: 1,
            },
            class: 'hamster_wheel',
            isNotFor: ['hamster'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                Entry.Hamster.setModule(sq); // akaii: add
                var left = script.getNumberValue('LEFT');
                var right = script.getNumberValue('RIGHT');
                sq.motion = 0; // akaii: add
                sq.leftWheel =
                    sq.leftWheel != undefined ? sq.leftWheel + left : left;
                sq.rightWheel =
                    sq.rightWheel != undefined ? sq.rightWheel + right : right;
                Entry.Hamster.boardCommand = 0; // akaii: add
                Entry.Hamster.setLineTracerMode(sq, 0);
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Hamster.wheels_by(%1, %2)',
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
        hamster_set_both_wheels_to: {
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
                        params: ['30'],
                    },
                    {
                        type: 'text',
                        params: ['30'],
                    },
                    null,
                ],
                type: 'hamster_set_both_wheels_to',
            },
            paramsKeyMap: {
                LEFT: 0,
                RIGHT: 1,
            },
            class: 'hamster_wheel',
            isNotFor: ['hamster'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                Entry.Hamster.setModule(sq); // akaii: add
                sq.motion = 0; // akaii: add
                sq.leftWheel = script.getNumberValue('LEFT');
                sq.rightWheel = script.getNumberValue('RIGHT');
                Entry.Hamster.boardCommand = 0; // akaii: add
                Entry.Hamster.setLineTracerMode(sq, 0);
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Hamster.wheels(%1, %2)',
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
        hamster_change_wheel_by: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.HAMSTER_left_wheel, 'LEFT'],
                        [Lang.Blocks.HAMSTER_right_wheel, 'RIGHT'],
                        [Lang.Blocks.HAMSTER_both_wheels, 'BOTH'],
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
                type: 'hamster_change_wheel_by',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                VALUE: 1,
            },
            class: 'hamster_wheel',
            isNotFor: ['hamster'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                Entry.Hamster.setModule(sq); // akaii: add
                var direction = script.getField('DIRECTION');
                var value = script.getNumberValue('VALUE');
                sq.motion = 0; // akaii: add
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
                Entry.Hamster.boardCommand = 0; // akaii: add
                Entry.Hamster.setLineTracerMode(sq, 0);
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Hamster.left_wheel_by(%2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_wheel, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_wheel, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_wheels, 'BOTH'],
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
                        syntax: 'Hamster.right_wheel_by(%2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_wheel, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_wheel, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_wheels, 'BOTH'],
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
                        syntax: 'Hamster.wheels_by(%2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_wheel, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_wheel, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_wheels, 'BOTH'],
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
        hamster_set_wheel_to: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.HAMSTER_left_wheel, 'LEFT'],
                        [Lang.Blocks.HAMSTER_right_wheel, 'RIGHT'],
                        [Lang.Blocks.HAMSTER_both_wheels, 'BOTH'],
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
                        params: ['30'],
                    },
                    null,
                ],
                type: 'hamster_set_wheel_to',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                VALUE: 1,
            },
            class: 'hamster_wheel',
            isNotFor: ['hamster'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                Entry.Hamster.setModule(sq); // akaii: add
                var direction = script.getField('DIRECTION');
                var value = script.getNumberValue('VALUE');
                sq.motion = 0; // akaii: add
                if (direction == 'LEFT') {
                    sq.leftWheel = value;
                } else if (direction == 'RIGHT') {
                    sq.rightWheel = value;
                } else {
                    sq.leftWheel = value;
                    sq.rightWheel = value;
                }
                Entry.Hamster.boardCommand = 0; // akaii: add
                Entry.Hamster.setLineTracerMode(sq, 0);
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Hamster.left_wheel(%2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_wheel, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_wheel, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_wheels, 'BOTH'],
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
                        syntax: 'Hamster.right_wheel(%2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_wheel, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_wheel, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_wheels, 'BOTH'],
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
                        syntax: 'Hamster.wheels(%2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_wheel, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_wheel, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_wheels, 'BOTH'],
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
        hamster_follow_line_using: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.HAMSTER_color_black, 'BLACK'],
                        [Lang.Blocks.HAMSTER_color_white, 'WHITE'],
                    ],
                    value: 'BLACK',
                    fontSize: 11,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.HAMSTER_left_floor_sensor, 'LEFT'],
                        [Lang.Blocks.HAMSTER_right_floor_sensor, 'RIGHT'],
                        [Lang.Blocks.HAMSTER_both_floor_sensors, 'BOTH'],
                    ],
                    value: 'LEFT',
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
                params: [null, null, null],
                type: 'hamster_follow_line_using',
            },
            paramsKeyMap: {
                COLOR: 0,
                DIRECTION: 1,
            },
            class: 'hamster_wheel',
            isNotFor: ['hamster'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                Entry.Hamster.setModule(sq); // akaii: add
                var color = script.getField('COLOR');
                var direction = script.getField('DIRECTION');

                var mode = 1;
                if (direction == 'RIGHT') mode = 2;
                else if (direction == 'BOTH') mode = 3;
                if (color == 'WHITE') mode += 7;

                sq.motion = 0; // akaii: add
                sq.leftWheel = 0;
                sq.rightWheel = 0;
                Entry.Hamster.boardCommand = 0; // akaii: add
                Entry.Hamster.setLineTracerMode(sq, mode);
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax:
                            'Hamster.line_tracer_mode(Hamster.LINE_TRACER_MODE_BLACK_LEFT_SENSOR)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_color_black, 'BLACK'],
                                    [Lang.Blocks.HAMSTER_color_white, 'WHITE'],
                                ],
                                value: 'BLACK',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [
                                        Lang.Blocks.HAMSTER_left_floor_sensor,
                                        'LEFT',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_right_floor_sensor,
                                        'RIGHT',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_both_floor_sensors,
                                        'BOTH',
                                    ],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['BLACK', 'LEFT'],
                    },
                    {
                        syntax:
                            'Hamster.line_tracer_mode(Hamster.LINE_TRACER_MODE_WHITE_LEFT_SENSOR)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_color_black, 'BLACK'],
                                    [Lang.Blocks.HAMSTER_color_white, 'WHITE'],
                                ],
                                value: 'BLACK',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [
                                        Lang.Blocks.HAMSTER_left_floor_sensor,
                                        'LEFT',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_right_floor_sensor,
                                        'RIGHT',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_both_floor_sensors,
                                        'BOTH',
                                    ],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['WHITE', 'LEFT'],
                    },
                    {
                        syntax:
                            'Hamster.line_tracer_mode(Hamster.LINE_TRACER_MODE_BLACK_RIGHT_SENSOR)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_color_black, 'BLACK'],
                                    [Lang.Blocks.HAMSTER_color_white, 'WHITE'],
                                ],
                                value: 'BLACK',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [
                                        Lang.Blocks.HAMSTER_left_floor_sensor,
                                        'LEFT',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_right_floor_sensor,
                                        'RIGHT',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_both_floor_sensors,
                                        'BOTH',
                                    ],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['BLACK', 'RIGHT'],
                    },
                    {
                        syntax:
                            'Hamster.line_tracer_mode(Hamster.LINE_TRACER_MODE_BLACK_BOTH_SENSORS)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_color_black, 'BLACK'],
                                    [Lang.Blocks.HAMSTER_color_white, 'WHITE'],
                                ],
                                value: 'BLACK',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [
                                        Lang.Blocks.HAMSTER_left_floor_sensor,
                                        'LEFT',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_right_floor_sensor,
                                        'RIGHT',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_both_floor_sensors,
                                        'BOTH',
                                    ],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['BLACK', 'BOTH'],
                    },
                    {
                        syntax:
                            'Hamster.line_tracer_mode(Hamster.LINE_TRACER_MODE_WHITE_RIGHT_SENSOR)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_color_black, 'BLACK'],
                                    [Lang.Blocks.HAMSTER_color_white, 'WHITE'],
                                ],
                                value: 'BLACK',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [
                                        Lang.Blocks.HAMSTER_left_floor_sensor,
                                        'LEFT',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_right_floor_sensor,
                                        'RIGHT',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_both_floor_sensors,
                                        'BOTH',
                                    ],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['WHITE', 'RIGHT'],
                    },
                    {
                        syntax:
                            'Hamster.line_tracer_mode(Hamster.LINE_TRACER_MODE_WHITE_BOTH_SENSORS)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_color_black, 'BLACK'],
                                    [Lang.Blocks.HAMSTER_color_white, 'WHITE'],
                                ],
                                value: 'BLACK',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [
                                        Lang.Blocks.HAMSTER_left_floor_sensor,
                                        'LEFT',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_right_floor_sensor,
                                        'RIGHT',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_both_floor_sensors,
                                        'BOTH',
                                    ],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['WHITE', 'BOTH'],
                    },
                ],
            },
        },
        hamster_follow_line_until: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.HAMSTER_color_black, 'BLACK'],
                        [Lang.Blocks.HAMSTER_color_white, 'WHITE'],
                    ],
                    value: 'BLACK',
                    fontSize: 11,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.HAMSTER_left_floor_sensor, 'LEFT'],
                        [Lang.Blocks.HAMSTER_right_floor_sensor, 'RIGHT'],
                        [Lang.Blocks.HAMSTER_front, 'FRONT'],
                        [Lang.Blocks.HAMSTER_rear, 'REAR'],
                    ],
                    value: 'LEFT',
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
                params: [null, null, null],
                type: 'hamster_follow_line_until',
            },
            paramsKeyMap: {
                COLOR: 0,
                DIRECTION: 1,
            },
            class: 'hamster_wheel',
            isNotFor: ['hamster'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                Entry.Hamster.setModule(sq); // akaii: add
                var pd = Entry.hw.portData;
                var color = script.getField('COLOR');
                var direction = script.getField('DIRECTION');

                var mode = 4;
                if (direction == 'RIGHT') mode = 5;
                else if (direction == 'FRONT') mode = 6;
                else if (direction == 'REAR') mode = 7;
                if (color == 'WHITE') mode += 7;

                if (!script.isStart) {
                    script.isStart = true;
                    sq.motion = 0; // akaii: add
                    sq.leftWheel = 0;
                    sq.rightWheel = 0;
                    Entry.Hamster.boardCommand = 0; // akaii: add
                    Entry.Hamster.setLineTracerMode(sq, mode);
                    return script;
                } else {
                    var hamster = Entry.Hamster;
                    if (pd.lineTracerStateId != hamster.lineTracerStateId) {
                        hamster.lineTracerStateId = pd.lineTracerStateId;
                        if (pd.lineTracerState == 0x40) {
                            delete script.isStart;
                            Entry.engine.isContinue = false;
                            hamster.setLineTracerMode(sq, 0);
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
                        syntax:
                            'Hamster.line_tracer_mode(Hamster.LINE_TRACER_MODE_BLACK_TURN_LEFT)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_color_black, 'BLACK'],
                                    [Lang.Blocks.HAMSTER_color_white, 'WHITE'],
                                ],
                                value: 'BLACK',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [
                                        Lang.Blocks.HAMSTER_left_floor_sensor,
                                        'LEFT',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_right_floor_sensor,
                                        'RIGHT',
                                    ],
                                    [Lang.Blocks.HAMSTER_front, 'FRONT'],
                                    [Lang.Blocks.HAMSTER_rear, 'REAR'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['BLACK', 'LEFT'],
                    },
                    {
                        syntax:
                            'Hamster.line_tracer_mode(Hamster.LINE_TRACER_MODE_WHITE_TURN_LEFT)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_color_black, 'BLACK'],
                                    [Lang.Blocks.HAMSTER_color_white, 'WHITE'],
                                ],
                                value: 'BLACK',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [
                                        Lang.Blocks.HAMSTER_left_floor_sensor,
                                        'LEFT',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_right_floor_sensor,
                                        'RIGHT',
                                    ],
                                    [Lang.Blocks.HAMSTER_front, 'FRONT'],
                                    [Lang.Blocks.HAMSTER_rear, 'REAR'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['WHITE', 'LEFT'],
                    },
                    {
                        syntax:
                            'Hamster.line_tracer_mode(Hamster.LINE_TRACER_MODE_BLACK_TURN_RIGHT)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_color_black, 'BLACK'],
                                    [Lang.Blocks.HAMSTER_color_white, 'WHITE'],
                                ],
                                value: 'BLACK',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [
                                        Lang.Blocks.HAMSTER_left_floor_sensor,
                                        'LEFT',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_right_floor_sensor,
                                        'RIGHT',
                                    ],
                                    [Lang.Blocks.HAMSTER_front, 'FRONT'],
                                    [Lang.Blocks.HAMSTER_rear, 'REAR'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['BLACK', 'RIGHT'],
                    },
                    {
                        syntax:
                            'Hamster.line_tracer_mode(Hamster.LINE_TRACER_MODE_BLACK_MOVE_FORWARD)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_color_black, 'BLACK'],
                                    [Lang.Blocks.HAMSTER_color_white, 'WHITE'],
                                ],
                                value: 'BLACK',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [
                                        Lang.Blocks.HAMSTER_left_floor_sensor,
                                        'LEFT',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_right_floor_sensor,
                                        'RIGHT',
                                    ],
                                    [Lang.Blocks.HAMSTER_front, 'FRONT'],
                                    [Lang.Blocks.HAMSTER_rear, 'REAR'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['BLACK', 'FRONT'],
                    },
                    {
                        syntax:
                            'Hamster.line_tracer_mode(Hamster.LINE_TRACER_MODE_BLACK_UTURN)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_color_black, 'BLACK'],
                                    [Lang.Blocks.HAMSTER_color_white, 'WHITE'],
                                ],
                                value: 'BLACK',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [
                                        Lang.Blocks.HAMSTER_left_floor_sensor,
                                        'LEFT',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_right_floor_sensor,
                                        'RIGHT',
                                    ],
                                    [Lang.Blocks.HAMSTER_front, 'FRONT'],
                                    [Lang.Blocks.HAMSTER_rear, 'REAR'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['BLACK', 'REAR'],
                    },
                    {
                        syntax:
                            'Hamster.line_tracer_mode(Hamster.LINE_TRACER_MODE_WHITE_TURN_RIGHT)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_color_black, 'BLACK'],
                                    [Lang.Blocks.HAMSTER_color_white, 'WHITE'],
                                ],
                                value: 'BLACK',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [
                                        Lang.Blocks.HAMSTER_left_floor_sensor,
                                        'LEFT',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_right_floor_sensor,
                                        'RIGHT',
                                    ],
                                    [Lang.Blocks.HAMSTER_front, 'FRONT'],
                                    [Lang.Blocks.HAMSTER_rear, 'REAR'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['WHITE', 'RIGHT'],
                    },
                    {
                        syntax:
                            'Hamster.line_tracer_mode(Hamster.LINE_TRACER_MODE_WHITE_MOVE_FORWARD)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_color_black, 'BLACK'],
                                    [Lang.Blocks.HAMSTER_color_white, 'WHITE'],
                                ],
                                value: 'BLACK',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [
                                        Lang.Blocks.HAMSTER_left_floor_sensor,
                                        'LEFT',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_right_floor_sensor,
                                        'RIGHT',
                                    ],
                                    [Lang.Blocks.HAMSTER_front, 'FRONT'],
                                    [Lang.Blocks.HAMSTER_rear, 'REAR'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['WHITE', 'FRONT'],
                    },
                    {
                        syntax:
                            'Hamster.line_tracer_mode(Hamster.LINE_TRACER_MODE_WHITE_UTURN)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_color_black, 'BLACK'],
                                    [Lang.Blocks.HAMSTER_color_white, 'WHITE'],
                                ],
                                value: 'BLACK',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [
                                        Lang.Blocks.HAMSTER_left_floor_sensor,
                                        'LEFT',
                                    ],
                                    [
                                        Lang.Blocks.HAMSTER_right_floor_sensor,
                                        'RIGHT',
                                    ],
                                    [Lang.Blocks.HAMSTER_front, 'FRONT'],
                                    [Lang.Blocks.HAMSTER_rear, 'REAR'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['WHITE', 'REAR'],
                    },
                ],
            },
        },
        hamster_set_following_speed_to: {
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
                type: 'hamster_set_following_speed_to',
            },
            paramsKeyMap: {
                SPEED: 0,
            },
            class: 'hamster_wheel',
            isNotFor: ['hamster'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                Entry.Hamster.setModule(sq); // akaii: add
                sq.lineTracerSpeed = Number(script.getField('SPEED', script));
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Hamster.line_tracer_speed(%1)',
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
        hamster_stop: {
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
                type: 'hamster_stop',
            },
            class: 'hamster_wheel',
            isNotFor: ['hamster'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                Entry.Hamster.setModule(sq); // akaii: add
                sq.motion = 0; // akaii: add
                sq.leftWheel = 0;
                sq.rightWheel = 0;
                Entry.Hamster.boardCommand = 0; // akaii: add
                Entry.Hamster.setLineTracerMode(sq, 0);
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Hamster.stop()',
                    },
                ],
            },
        },
        hamster_set_led_to: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.HAMSTER_left_led, 'LEFT'],
                        [Lang.Blocks.HAMSTER_right_led, 'RIGHT'],
                        [Lang.Blocks.HAMSTER_both_leds, 'BOTH'],
                    ],
                    value: 'LEFT',
                    fontSize: 11,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.HAMSTER_color_red, '4'],
                        [Lang.Blocks.HAMSTER_color_yellow, '6'],
                        [Lang.Blocks.HAMSTER_color_green, '2'],
                        [Lang.Blocks.HAMSTER_color_cyan, '3'],
                        [Lang.Blocks.HAMSTER_color_blue, '1'],
                        [Lang.Blocks.HAMSTER_color_magenta, '5'],
                        [Lang.Blocks.HAMSTER_color_white, '7'],
                    ],
                    value: '4',
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
                params: [null, null, null],
                type: 'hamster_set_led_to',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                COLOR: 1,
            },
            class: 'hamster_led',
            isNotFor: ['hamster'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                Entry.Hamster.setModule(sq); // akaii: add
                var direction = script.getField('DIRECTION', script);
                var color = Number(script.getField('COLOR', script));
                if (direction == 'LEFT') {
                    sq.leftLed = color;
                } else if (direction == 'RIGHT') {
                    sq.rightLed = color;
                } else {
                    sq.leftLed = color;
                    sq.rightLed = color;
                }
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Hamster.left_led(Hamster.LED_RED)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_led, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_led, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_leds, 'BOTH'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_color_red, '4'],
                                    [Lang.Blocks.HAMSTER_color_yellow, '6'],
                                    [Lang.Blocks.HAMSTER_color_green, '2'],
                                    [Lang.Blocks.HAMSTER_color_cyan, '3'],
                                    [Lang.Blocks.HAMSTER_color_blue, '1'],
                                    [Lang.Blocks.HAMSTER_color_magenta, '5'],
                                    [Lang.Blocks.HAMSTER_color_white, '7'],
                                ],
                                value: '4',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['LEFT', '4'],
                    },

                    {
                        syntax: 'Hamster.left_led(Hamster.LED_YELLOW)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_led, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_led, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_leds, 'BOTH'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_color_red, '4'],
                                    [Lang.Blocks.HAMSTER_color_yellow, '6'],
                                    [Lang.Blocks.HAMSTER_color_green, '2'],
                                    [Lang.Blocks.HAMSTER_color_cyan, '3'],
                                    [Lang.Blocks.HAMSTER_color_blue, '1'],
                                    [Lang.Blocks.HAMSTER_color_magenta, '5'],
                                    [Lang.Blocks.HAMSTER_color_white, '7'],
                                ],
                                value: '4',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['LEFT', '6'],
                    },
                    {
                        syntax: 'Hamster.left_led(Hamster.LED_GREEN)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_led, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_led, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_leds, 'BOTH'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_color_red, '4'],
                                    [Lang.Blocks.HAMSTER_color_yellow, '6'],
                                    [Lang.Blocks.HAMSTER_color_green, '2'],
                                    [Lang.Blocks.HAMSTER_color_cyan, '3'],
                                    [Lang.Blocks.HAMSTER_color_blue, '1'],
                                    [Lang.Blocks.HAMSTER_color_magenta, '5'],
                                    [Lang.Blocks.HAMSTER_color_white, '7'],
                                ],
                                value: '4',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['LEFT', '2'],
                    },
                    {
                        syntax: 'Hamster.left_led(Hamster.LED_CYAN)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_led, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_led, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_leds, 'BOTH'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_color_red, '4'],
                                    [Lang.Blocks.HAMSTER_color_yellow, '6'],
                                    [Lang.Blocks.HAMSTER_color_green, '2'],
                                    [Lang.Blocks.HAMSTER_color_cyan, '3'],
                                    [Lang.Blocks.HAMSTER_color_blue, '1'],
                                    [Lang.Blocks.HAMSTER_color_magenta, '5'],
                                    [Lang.Blocks.HAMSTER_color_white, '7'],
                                ],
                                value: '4',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['LEFT', '3'],
                    },
                    {
                        syntax: 'Hamster.left_led(Hamster.LED_BLUE)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_led, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_led, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_leds, 'BOTH'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_color_red, '4'],
                                    [Lang.Blocks.HAMSTER_color_yellow, '6'],
                                    [Lang.Blocks.HAMSTER_color_green, '2'],
                                    [Lang.Blocks.HAMSTER_color_cyan, '3'],
                                    [Lang.Blocks.HAMSTER_color_blue, '1'],
                                    [Lang.Blocks.HAMSTER_color_magenta, '5'],
                                    [Lang.Blocks.HAMSTER_color_white, '7'],
                                ],
                                value: '4',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['LEFT', '1'],
                    },
                    {
                        syntax: 'Hamster.left_led(Hamster.LED_MAGENTA)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_led, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_led, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_leds, 'BOTH'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_color_red, '4'],
                                    [Lang.Blocks.HAMSTER_color_yellow, '6'],
                                    [Lang.Blocks.HAMSTER_color_green, '2'],
                                    [Lang.Blocks.HAMSTER_color_cyan, '3'],
                                    [Lang.Blocks.HAMSTER_color_blue, '1'],
                                    [Lang.Blocks.HAMSTER_color_magenta, '5'],
                                    [Lang.Blocks.HAMSTER_color_white, '7'],
                                ],
                                value: '4',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['LEFT', '5'],
                    },
                    {
                        syntax: 'Hamster.left_led(Hamster.LED_WHITE)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_led, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_led, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_leds, 'BOTH'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_color_red, '4'],
                                    [Lang.Blocks.HAMSTER_color_yellow, '6'],
                                    [Lang.Blocks.HAMSTER_color_green, '2'],
                                    [Lang.Blocks.HAMSTER_color_cyan, '3'],
                                    [Lang.Blocks.HAMSTER_color_blue, '1'],
                                    [Lang.Blocks.HAMSTER_color_magenta, '5'],
                                    [Lang.Blocks.HAMSTER_color_white, '7'],
                                ],
                                value: '4',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['LEFT', '7'],
                    },
                    {
                        syntax: 'Hamster.right_led(Hamster.LED_RED)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_led, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_led, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_leds, 'BOTH'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_color_red, '4'],
                                    [Lang.Blocks.HAMSTER_color_yellow, '6'],
                                    [Lang.Blocks.HAMSTER_color_green, '2'],
                                    [Lang.Blocks.HAMSTER_color_cyan, '3'],
                                    [Lang.Blocks.HAMSTER_color_blue, '1'],
                                    [Lang.Blocks.HAMSTER_color_magenta, '5'],
                                    [Lang.Blocks.HAMSTER_color_white, '7'],
                                ],
                                value: '4',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['RIGHT', '4'],
                    },
                    {
                        syntax: 'Hamster.right_led(Hamster.LED_YELLOW)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_led, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_led, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_leds, 'BOTH'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_color_red, '4'],
                                    [Lang.Blocks.HAMSTER_color_yellow, '6'],
                                    [Lang.Blocks.HAMSTER_color_green, '2'],
                                    [Lang.Blocks.HAMSTER_color_cyan, '3'],
                                    [Lang.Blocks.HAMSTER_color_blue, '1'],
                                    [Lang.Blocks.HAMSTER_color_magenta, '5'],
                                    [Lang.Blocks.HAMSTER_color_white, '7'],
                                ],
                                value: '4',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['RIGHT', '6'],
                    },
                    {
                        syntax: 'Hamster.right_led(Hamster.LED_GREEN)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_led, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_led, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_leds, 'BOTH'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_color_red, '4'],
                                    [Lang.Blocks.HAMSTER_color_yellow, '6'],
                                    [Lang.Blocks.HAMSTER_color_green, '2'],
                                    [Lang.Blocks.HAMSTER_color_cyan, '3'],
                                    [Lang.Blocks.HAMSTER_color_blue, '1'],
                                    [Lang.Blocks.HAMSTER_color_magenta, '5'],
                                    [Lang.Blocks.HAMSTER_color_white, '7'],
                                ],
                                value: '4',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['RIGHT', '2'],
                    },
                    {
                        syntax: 'Hamster.right_led(Hamster.LED_CYAN)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_led, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_led, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_leds, 'BOTH'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_color_red, '4'],
                                    [Lang.Blocks.HAMSTER_color_yellow, '6'],
                                    [Lang.Blocks.HAMSTER_color_green, '2'],
                                    [Lang.Blocks.HAMSTER_color_cyan, '3'],
                                    [Lang.Blocks.HAMSTER_color_blue, '1'],
                                    [Lang.Blocks.HAMSTER_color_magenta, '5'],
                                    [Lang.Blocks.HAMSTER_color_white, '7'],
                                ],
                                value: '4',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['RIGHT', '3'],
                    },
                    {
                        syntax: 'Hamster.right_led(Hamster.LED_BLUE)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_led, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_led, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_leds, 'BOTH'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_color_red, '4'],
                                    [Lang.Blocks.HAMSTER_color_yellow, '6'],
                                    [Lang.Blocks.HAMSTER_color_green, '2'],
                                    [Lang.Blocks.HAMSTER_color_cyan, '3'],
                                    [Lang.Blocks.HAMSTER_color_blue, '1'],
                                    [Lang.Blocks.HAMSTER_color_magenta, '5'],
                                    [Lang.Blocks.HAMSTER_color_white, '7'],
                                ],
                                value: '4',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['RIGHT', '1'],
                    },
                    {
                        syntax: 'Hamster.right_led(Hamster.LED_MAGENTA)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_led, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_led, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_leds, 'BOTH'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_color_red, '4'],
                                    [Lang.Blocks.HAMSTER_color_yellow, '6'],
                                    [Lang.Blocks.HAMSTER_color_green, '2'],
                                    [Lang.Blocks.HAMSTER_color_cyan, '3'],
                                    [Lang.Blocks.HAMSTER_color_blue, '1'],
                                    [Lang.Blocks.HAMSTER_color_magenta, '5'],
                                    [Lang.Blocks.HAMSTER_color_white, '7'],
                                ],
                                value: '4',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['RIGHT', '5'],
                    },
                    {
                        syntax: 'Hamster.right_led(Hamster.LED_WHITE)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_led, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_led, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_leds, 'BOTH'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_color_red, '4'],
                                    [Lang.Blocks.HAMSTER_color_yellow, '6'],
                                    [Lang.Blocks.HAMSTER_color_green, '2'],
                                    [Lang.Blocks.HAMSTER_color_cyan, '3'],
                                    [Lang.Blocks.HAMSTER_color_blue, '1'],
                                    [Lang.Blocks.HAMSTER_color_magenta, '5'],
                                    [Lang.Blocks.HAMSTER_color_white, '7'],
                                ],
                                value: '4',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['RIGHT', '7'],
                    },
                    {
                        syntax: 'Hamster.leds(Hamster.LED_RED)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_led, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_led, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_leds, 'BOTH'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_color_red, '4'],
                                    [Lang.Blocks.HAMSTER_color_yellow, '6'],
                                    [Lang.Blocks.HAMSTER_color_green, '2'],
                                    [Lang.Blocks.HAMSTER_color_cyan, '3'],
                                    [Lang.Blocks.HAMSTER_color_blue, '1'],
                                    [Lang.Blocks.HAMSTER_color_magenta, '5'],
                                    [Lang.Blocks.HAMSTER_color_white, '7'],
                                ],
                                value: '4',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['BOTH', '4'],
                    },
                    {
                        syntax: 'Hamster.leds(Hamster.LED_YELLOW)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_led, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_led, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_leds, 'BOTH'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_color_red, '4'],
                                    [Lang.Blocks.HAMSTER_color_yellow, '6'],
                                    [Lang.Blocks.HAMSTER_color_green, '2'],
                                    [Lang.Blocks.HAMSTER_color_cyan, '3'],
                                    [Lang.Blocks.HAMSTER_color_blue, '1'],
                                    [Lang.Blocks.HAMSTER_color_magenta, '5'],
                                    [Lang.Blocks.HAMSTER_color_white, '7'],
                                ],
                                value: '4',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['BOTH', '6'],
                    },
                    {
                        syntax: 'Hamster.leds(Hamster.LED_GREEN)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_led, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_led, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_leds, 'BOTH'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_color_red, '4'],
                                    [Lang.Blocks.HAMSTER_color_yellow, '6'],
                                    [Lang.Blocks.HAMSTER_color_green, '2'],
                                    [Lang.Blocks.HAMSTER_color_cyan, '3'],
                                    [Lang.Blocks.HAMSTER_color_blue, '1'],
                                    [Lang.Blocks.HAMSTER_color_magenta, '5'],
                                    [Lang.Blocks.HAMSTER_color_white, '7'],
                                ],
                                value: '4',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['BOTH', '2'],
                    },
                    {
                        syntax: 'Hamster.leds(Hamster.LED_CYAN)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_led, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_led, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_leds, 'BOTH'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_color_red, '4'],
                                    [Lang.Blocks.HAMSTER_color_yellow, '6'],
                                    [Lang.Blocks.HAMSTER_color_green, '2'],
                                    [Lang.Blocks.HAMSTER_color_cyan, '3'],
                                    [Lang.Blocks.HAMSTER_color_blue, '1'],
                                    [Lang.Blocks.HAMSTER_color_magenta, '5'],
                                    [Lang.Blocks.HAMSTER_color_white, '7'],
                                ],
                                value: '4',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['BOTH', '3'],
                    },
                    {
                        syntax: 'Hamster.leds(Hamster.LED_BLUE)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_led, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_led, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_leds, 'BOTH'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_color_red, '4'],
                                    [Lang.Blocks.HAMSTER_color_yellow, '6'],
                                    [Lang.Blocks.HAMSTER_color_green, '2'],
                                    [Lang.Blocks.HAMSTER_color_cyan, '3'],
                                    [Lang.Blocks.HAMSTER_color_blue, '1'],
                                    [Lang.Blocks.HAMSTER_color_magenta, '5'],
                                    [Lang.Blocks.HAMSTER_color_white, '7'],
                                ],
                                value: '4',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['BOTH', '1'],
                    },
                    {
                        syntax: 'Hamster.leds(Hamster.LED_MAGENTA)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_led, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_led, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_leds, 'BOTH'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_color_red, '4'],
                                    [Lang.Blocks.HAMSTER_color_yellow, '6'],
                                    [Lang.Blocks.HAMSTER_color_green, '2'],
                                    [Lang.Blocks.HAMSTER_color_cyan, '3'],
                                    [Lang.Blocks.HAMSTER_color_blue, '1'],
                                    [Lang.Blocks.HAMSTER_color_magenta, '5'],
                                    [Lang.Blocks.HAMSTER_color_white, '7'],
                                ],
                                value: '4',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['BOTH', '5'],
                    },
                    {
                        syntax: 'Hamster.leds(Hamster.LED_WHITE)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_led, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_led, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_leds, 'BOTH'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_color_red, '4'],
                                    [Lang.Blocks.HAMSTER_color_yellow, '6'],
                                    [Lang.Blocks.HAMSTER_color_green, '2'],
                                    [Lang.Blocks.HAMSTER_color_cyan, '3'],
                                    [Lang.Blocks.HAMSTER_color_blue, '1'],
                                    [Lang.Blocks.HAMSTER_color_magenta, '5'],
                                    [Lang.Blocks.HAMSTER_color_white, '7'],
                                ],
                                value: '4',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['BOTH', '7'],
                    },
                ],
            },
        },
        hamster_clear_led: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.HAMSTER_left_led, 'LEFT'],
                        [Lang.Blocks.HAMSTER_right_led, 'RIGHT'],
                        [Lang.Blocks.HAMSTER_both_leds, 'BOTH'],
                    ],
                    value: 'LEFT',
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
                type: 'hamster_clear_led',
            },
            paramsKeyMap: {
                DIRECTION: 0,
            },
            class: 'hamster_led',
            isNotFor: ['hamster'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                Entry.Hamster.setModule(sq); // akaii: add
                var direction = script.getField('DIRECTION', script);
                if (direction == 'LEFT') {
                    sq.leftLed = 0;
                } else if (direction == 'RIGHT') {
                    sq.rightLed = 0;
                } else {
                    sq.leftLed = 0;
                    sq.rightLed = 0;
                }
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Hamster.left_led(0)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_led, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_led, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_leds, 'BOTH'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['LEFT'],
                    },
                    {
                        syntax: 'Hamster.left_led(Hamster.LED_OFF)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_led, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_led, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_leds, 'BOTH'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['LEFT'],
                    },
                    {
                        syntax:
                            'Hamster.left_led(Hamster.LED_OFF, Hamster.LED_OFF)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_led, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_led, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_leds, 'BOTH'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['LEFT'],
                    },
                    {
                        syntax: 'Hamster.right_led(0)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_led, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_led, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_leds, 'BOTH'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['RIGHT'],
                    },
                    {
                        syntax: 'Hamster.right_led(Hamster.LED_OFF)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_led, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_led, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_leds, 'BOTH'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['RIGHT'],
                    },
                    {
                        syntax:
                            'Hamster.right_led(Hamster.LED_OFF, Hamster.LED_OFF)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_led, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_led, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_leds, 'BOTH'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['RIGHT'],
                    },
                    {
                        syntax: 'Hamster.leds(0)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_led, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_led, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_leds, 'BOTH'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['BOTH'],
                    },
                    {
                        syntax: 'Hamster.leds(Hamster.LED_OFF)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_led, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_led, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_leds, 'BOTH'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['BOTH'],
                    },
                    {
                        syntax:
                            'Hamster.leds(Hamster.LED_OFF, Hamster.LED_OFF)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_led, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_led, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_leds, 'BOTH'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['BOTH'],
                    },
                ],
            },
        },
        hamster_beep: {
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
                type: 'hamster_beep',
            },
            class: 'hamster_buzzer',
            isNotFor: ['hamster'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                Entry.Hamster.setModule(sq); // akaii: add
                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    sq.buzzer = 440;
                    sq.note = 0;
                    var timeValue = 0.2 * 1000;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.Hamster.removeTimeout(timer);
                    }, timeValue);
                    Entry.Hamster.timeouts.push(timer);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    Entry.engine.isContinue = false;
                    sq.buzzer = 0;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Hamster.beep()',
                    },
                ],
            },
        },
        hamster_change_buzzer_by: {
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
                type: 'hamster_change_buzzer_by',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'hamster_buzzer',
            isNotFor: ['hamster'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                Entry.Hamster.setModule(sq); // akaii: add
                var value = script.getNumberValue('VALUE');
                sq.buzzer = sq.buzzer != undefined ? sq.buzzer + value : value;
                sq.note = 0;
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Hamster.buzzer_by(%1)', // akaii: modify
                    },
                ],
            },
        },
        hamster_set_buzzer_to: {
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
                type: 'hamster_set_buzzer_to',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'hamster_buzzer',
            isNotFor: ['hamster'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                Entry.Hamster.setModule(sq); // akaii: add
                sq.buzzer = script.getNumberValue('VALUE');
                sq.note = 0;
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Hamster.buzzer(%1)',
                    },
                ],
            },
        },
        hamster_clear_buzzer: {
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
                type: 'hamster_clear_buzzer',
            },
            class: 'hamster_buzzer',
            isNotFor: ['hamster'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                Entry.Hamster.setModule(sq); // akaii: add
                sq.buzzer = 0;
                sq.note = 0;
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Hamster.buzzer(0)',
                        params: [null],
                    },
                ],
            },
        },
        hamster_play_note_for: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.do_name, '4'],
                        [Lang.Blocks.do_sharp_name, '5'],
                        [Lang.Blocks.re_name, '6'],
                        [Lang.Blocks.re_sharp_name, '7'],
                        [Lang.Blocks.mi_name, '8'],
                        [Lang.Blocks.fa_name, '9'],
                        [Lang.Blocks.fa_sharp_name, '10'],
                        [Lang.Blocks.sol_name, '11'],
                        [Lang.Blocks.sol_sharp_name, '12'],
                        [Lang.Blocks.la_name, '13'],
                        [Lang.Blocks.la_sharp_name, '14'],
                        [Lang.Blocks.si_name, '15'],
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
                type: 'hamster_play_note_for',
            },
            paramsKeyMap: {
                NOTE: 0,
                OCTAVE: 1,
                VALUE: 2,
            },
            class: 'hamster_buzzer',
            isNotFor: ['hamster'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                Entry.Hamster.setModule(sq); // akaii: add
                if (!script.isStart) {
                    var note = script.getNumberField('NOTE', script);
                    var octave = script.getNumberField('OCTAVE', script);
                    var beat = script.getNumberValue('VALUE', script);
                    var tempo = Entry.Hamster.tempo;
                    note += (octave - 1) * 12;
                    var timeValue = beat * 60 * 1000 / tempo;
                    script.isStart = true;
                    script.timeFlag = 1;
                    sq.buzzer = 0;
                    sq.note = note;
                    if (timeValue > 100) {
                        var timer1 = setTimeout(function() {
                            sq.note = 0;
                            Entry.Hamster.removeTimeout(timer1);
                        }, timeValue - 100);
                        Entry.Hamster.timeouts.push(timer1);
                    }
                    var timer2 = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.Hamster.removeTimeout(timer2);
                    }, timeValue);
                    Entry.Hamster.timeouts.push(timer2);
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
                        syntax: 'Hamster.note(%1, %2, %3)',
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
                                        .returnValuePartialUpperCase, // akaii: modify
                                codeMap:
                                    'Entry.CodeMap.Hamster.hamster_play_note_for[0]',
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
        hamster_rest_for: {
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
                type: 'hamster_rest_for',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'hamster_buzzer',
            isNotFor: ['hamster'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                Entry.Hamster.setModule(sq); // akaii: add
                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timeValue = script.getNumberValue('VALUE');
                    timeValue = timeValue * 60 * 1000 / Entry.Hamster.tempo;
                    sq.buzzer = 0;
                    sq.note = 0;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.Hamster.removeTimeout(timer);
                    }, timeValue);
                    Entry.Hamster.timeouts.push(timer);
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
                        syntax: 'Hamster.note(0, %1)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                        keyOption: '0',
                    },
                    {
                        syntax: 'Hamster.note(Hamster.NOTE_OFF, %1)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                        keyOption: 'Hamster.NOTE_OFF',
                    },
                ],
            },
        },
        hamster_change_tempo_by: {
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
                type: 'hamster_change_tempo_by',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'hamster_buzzer',
            isNotFor: ['hamster'],
            func: function(sprite, script) {
                Entry.Hamster.setModule(Entry.hw.sendQueue); // akaii: add
                Entry.Hamster.tempo += script.getNumberValue('VALUE');
                if (Entry.Hamster.tempo < 1) Entry.Hamster.tempo = 1;
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Hamster.tempo_by(%1)',
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
        hamster_set_tempo_to: {
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
                type: 'hamster_set_tempo_to',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'hamster_buzzer',
            isNotFor: ['hamster'],
            func: function(sprite, script) {
                Entry.Hamster.setModule(Entry.hw.sendQueue); // akaii: add
                Entry.Hamster.tempo = script.getNumberValue('VALUE');
                if (Entry.Hamster.tempo < 1) Entry.Hamster.tempo = 1;
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Hamster.tempo(%1)',
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
        hamster_set_port_to: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.HAMSTER_port_a, 'A'],
                        [Lang.Blocks.HAMSTER_port_b, 'B'],
                        [Lang.Blocks.HAMSTER_port_ab, 'AB'],
                    ],
                    value: 'A',
                    fontSize: 11,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.HAMSTER_analog_input, '0'],
                        [Lang.Blocks.HAMSTER_digital_input, '1'],
                        [Lang.Blocks.HAMSTER_servo_output, '8'],
                        [Lang.Blocks.HAMSTER_pwm_output, '9'],
                        [Lang.Blocks.HAMSTER_digital_output, '10'],
                    ],
                    value: '0',
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
                params: [null, null, null],
                type: 'hamster_set_port_to',
            },
            paramsKeyMap: {
                PORT: 0,
                MODE: 1,
            },
            class: 'hamster_port',
            isNotFor: ['hamster'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                Entry.Hamster.setModule(sq); // akaii: add
                var port = script.getField('PORT', script);
                var mode = Number(script.getField('MODE', script));
                if (port == 'A') {
                    sq.ioModeA = mode;
                } else if (port == 'B') {
                    sq.ioModeB = mode;
                } else {
                    sq.ioModeA = mode;
                    sq.ioModeB = mode;
                }
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax:
                            'Hamster.io_mode_a(Hamster.IO_MODE_ANALOG_INPUT)',
                        textParams: [
                            {
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['A', '0'],
                    },
                    {
                        syntax:
                            'Hamster.io_mode_a(Hamster.IO_MODE_DIGITAL_INPUT)',
                        textParams: [
                            {
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['A', '1'],
                    },
                    {
                        syntax:
                            'Hamster.io_mode_a(Hamster.IO_MODE_SERVO_OUTPUT)',
                        textParams: [
                            {
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['A', '8'],
                    },
                    {
                        syntax: 'Hamster.io_mode_a(Hamster.IO_MODE_PWM_OUTPUT)',
                        textParams: [
                            {
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['A', '9'],
                    },
                    {
                        syntax:
                            'Hamster.io_mode_a(Hamster.IO_MODE_DIGITAL_OUTPUT)',
                        textParams: [
                            {
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['A', '10'],
                    },
                    {
                        syntax:
                            'Hamster.io_mode_b(Hamster.IO_MODE_ANALOG_INPUT)',
                        textParams: [
                            {
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['B', '0'],
                    },
                    {
                        syntax:
                            'Hamster.io_mode_b(Hamster.IO_MODE_DIGITAL_INPUT)',
                        textParams: [
                            {
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['B', '1'],
                    },
                    {
                        syntax:
                            'Hamster.io_mode_b(Hamster.IO_MODE_SERVO_OUTPUT)',
                        textParams: [
                            {
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['B', '8'],
                    },
                    {
                        syntax: 'Hamster.io_mode_b(Hamster.IO_MODE_PWM_OUTPUT)',
                        textParams: [
                            {
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['B', '9'],
                    },
                    {
                        syntax:
                            'Hamster.io_mode_b(Hamster.IO_MODE_DIGITAL_OUTPUT)',
                        textParams: [
                            {
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['B', '10'],
                    },
                    {
                        syntax:
                            'Hamster.io_modes(Hamster.IO_MODE_ANALOG_INPUT)',
                        textParams: [
                            {
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['AB', '0'],
                    },
                    {
                        syntax:
                            'Hamster.io_modes(Hamster.IO_MODE_DIGITAL_INPUT)',
                        textParams: [
                            {
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['AB', '1'],
                    },
                    {
                        syntax:
                            'Hamster.io_modes(Hamster.IO_MODE_SERVO_OUTPUT)',
                        textParams: [
                            {
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['AB', '8'],
                    },
                    {
                        syntax: 'Hamster.io_modes(Hamster.IO_MODE_PWM_OUTPUT)',
                        textParams: [
                            {
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['AB', '9'],
                    },
                    {
                        syntax:
                            'Hamster.io_modes(Hamster.IO_MODE_DIGITAL_OUTPUT)',
                        textParams: [
                            {
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: ['AB', '10'],
                    },
                ],
            },
        },
        hamster_change_output_by: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.HAMSTER_port_a, 'A'],
                        [Lang.Blocks.HAMSTER_port_b, 'B'],
                        [Lang.Blocks.HAMSTER_port_ab, 'AB'],
                    ],
                    value: 'A',
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
                type: 'hamster_change_output_by',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'hamster_port',
            isNotFor: ['hamster'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                Entry.Hamster.setModule(sq); // akaii: add
                var port = script.getField('PORT');
                var value = script.getNumberValue('VALUE');
                if (port == 'A') {
                    sq.outputA =
                        sq.outputA != undefined ? sq.outputA + value : value;
                } else if (port == 'B') {
                    sq.outputB =
                        sq.outputB != undefined ? sq.outputB + value : value;
                } else {
                    sq.outputA =
                        sq.outputA != undefined ? sq.outputA + value : value;
                    sq.outputB =
                        sq.outputB != undefined ? sq.outputB + value : value;
                }
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Hamster.output_a_by(%2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_port_a, 'A'],
                                    [Lang.Blocks.HAMSTER_port_b, 'B'],
                                    [Lang.Blocks.HAMSTER_port_ab, 'AB'],
                                ],
                                value: 'A',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                        params: ['A'],
                    },
                    {
                        syntax: 'Hamster.output_b_by(%2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_port_a, 'A'],
                                    [Lang.Blocks.HAMSTER_port_b, 'B'],
                                    [Lang.Blocks.HAMSTER_port_ab, 'AB'],
                                ],
                                value: 'A',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                        params: ['B'],
                    },
                    {
                        syntax: 'Hamster.outputs_by(%2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_port_a, 'A'],
                                    [Lang.Blocks.HAMSTER_port_b, 'B'],
                                    [Lang.Blocks.HAMSTER_port_ab, 'AB'],
                                ],
                                value: 'A',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                        params: ['AB'],
                    },
                ],
            },
        },
        hamster_set_output_to: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.HAMSTER_port_a, 'A'],
                        [Lang.Blocks.HAMSTER_port_b, 'B'],
                        [Lang.Blocks.HAMSTER_port_ab, 'AB'],
                    ],
                    value: 'A',
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
                        params: ['100'],
                    },
                    null,
                ],
                type: 'hamster_set_output_to',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'hamster_port',
            isNotFor: ['hamster'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                Entry.Hamster.setModule(sq); // akaii: add
                var port = script.getField('PORT');
                var value = script.getNumberValue('VALUE');
                if (port == 'A') {
                    sq.outputA = value;
                } else if (port == 'B') {
                    sq.outputB = value;
                } else {
                    sq.outputA = value;
                    sq.outputB = value;
                }
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Hamster.output_a(%2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_port_a, 'A'],
                                    [Lang.Blocks.HAMSTER_port_b, 'B'],
                                    [Lang.Blocks.HAMSTER_port_ab, 'AB'],
                                ],
                                value: 'A',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                        params: ['A'],
                    },
                    {
                        syntax: 'Hamster.output_b(%2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_port_a, 'A'],
                                    [Lang.Blocks.HAMSTER_port_b, 'B'],
                                    [Lang.Blocks.HAMSTER_port_ab, 'AB'],
                                ],
                                value: 'A',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                        params: ['B'],
                    },
                    {
                        syntax: 'Hamster.outputs(%2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_port_a, 'A'],
                                    [Lang.Blocks.HAMSTER_port_b, 'B'],
                                    [Lang.Blocks.HAMSTER_port_ab, 'AB'],
                                ],
                                value: 'A',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                        params: ['AB'],
                    },
                ],
            },
        },
        hamster_gripper: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ROBOID_open_gripper, 'OPEN'],
                        [Lang.Blocks.ROBOID_close_gripper, 'CLOSE'],
                    ],
                    value: 'OPEN',
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
                type: 'hamster_gripper',
            },
            paramsKeyMap: {
                ACTION: 0,
            },
            class: 'hamster_port',
            isNotFor: ['hamster'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                Entry.Hamster.setModule(sq);
                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    sq.ioModeA = 10;
                    sq.ioModeB = 10;
                    var action = script.getField('ACTION');
                    if (action == 'OPEN') {
                        sq.outputA = 1;
                        sq.outputB = 0;
                    } else {
                        sq.outputA = 0;
                        sq.outputB = 1;
                    }
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.Hamster.removeTimeout(timer);
                    }, 500);
                    Entry.Hamster.timeouts.push(timer);
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
                        syntax: 'Hamster.open_gripper()',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_open_gripper, 'OPEN'],
                                    [Lang.Blocks.ROBOID_close_gripper, 'CLOSE'],
                                ],
                                value: 'OPEN',
                                fontSize: 11,
                            },
                        ],
                        params: ['OPEN'],
                    },
                    {
                        syntax: 'Hamster.close_gripper()',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.ROBOID_open_gripper, 'OPEN'],
                                    [Lang.Blocks.ROBOID_close_gripper, 'CLOSE'],
                                ],
                                value: 'OPEN',
                                fontSize: 11,
                            },
                        ],
                        params: ['CLOSE'],
                    },
                ],
            },
        },
        hamster_release_gripper: {
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
                type: 'hamster_release_gripper',
            },
            class: 'hamster_port',
            isNotFor: ['hamster'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                Entry.Hamster.setModule(sq);
                sq.ioModeA = 10;
                sq.ioModeB = 10;
                sq.outputA = 0;
                sq.outputB = 0;
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Hamster.release_gripper()',
                    },
                ],
            },
        },
        //endregion hamster 햄스터
    };
};
