'use strict';

Entry.Roboid = {
    TURTLE_SENSOR: {
        floor: 0,
        accelerationX: 0,
        accelerationY: 0,
        accelerationZ: 0,
        button: 0,
        colorNumber: -1,
        colorPattern: -1,
    },
    robots: {},
    setZero: function() {
        var robots = Entry.Roboid.robots;
        for (var i in robots) {
            robots[i].setZero();
        }
        Entry.hw.update();
        Entry.Roboid.removeAllTimeouts();
    },
    createHamster: function(index) {
        var hamster = {
            packet: {
                module: 'hamster',
                index: index,
            },
            lineTracerModeId: 0,
            lineTracerStateId: -1,
            tempo: 60,
            boardCommand: 0,
            setZero: function() {
                var portMap = Entry.Hamster.PORT_MAP;
                var packet = this.packet;
                for (var p in portMap) {
                    packet[p] = portMap[p];
                }
                this.lineTracerModeId = 0;
                this.lineTracerStateId = -1;
                this.tempo = 60;
                this.boardCommand = 0;
            },
            setLineTracerMode: function(mode) {
                this.lineTracerModeId = this.lineTracerModeId % 255 + 1;
                this.packet.lineTracerMode = mode;
                this.packet.lineTracerModeId = this.lineTracerModeId;
            },
        };
        return hamster;
    },
    createTurtle: function(index) {
        var turtle = {
            packet: {
                module: 'turtle',
                index: index,
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
            setZero: function() {
                var portMap = Entry.Turtle.PORT_MAP;
                var packet = this.packet;
                for (var p in portMap) {
                    packet[p] = portMap[p];
                }
                this.pulseId = 0;
                this.soundId = 0;
                this.lineTracerModeId = 0;
                this.motionId = 0;
                this.clickedId = -1;
                this.doubleClickedId = -1;
                this.longPressedId = -1;
                this.colorPatternId = -1;
                this.wheelStateId = -1;
                this.soundStateId = -1;
                this.lineTracerStateId = -1;
                this.tempo = 60;
            },
            setPulse: function(pulse) {
                this.pulseId = this.pulseId % 255 + 1;
                var packet = this.packet;
                packet.pulse = pulse;
                packet.pulseId = this.pulseId;
            },
            setSound: function(sound, count) {
                if (typeof count != 'number') count = 1;
                if (count < 0) count = -1;
                if (count) {
                    this.soundId = this.soundId % 255 + 1;
                    var packet = this.packet;
                    packet.sound = sound;
                    packet.soundRepeat = count;
                    packet.soundId = this.soundId;
                }
            },
            setLineTracerMode: function(mode) {
                this.lineTracerModeId = this.lineTracerModeId % 255 + 1;
                var packet = this.packet;
                packet.lineTracerMode = mode;
                packet.lineTracerModeId = this.lineTracerModeId;
            },
            setMotion: function(type, unit, speed, value, radius) {
                this.motionId = this.motionId % 255 + 1;
                var packet = this.packet;
                packet.motionType = type;
                packet.motionUnit = unit;
                packet.motionSpeed = speed;
                packet.motionValue = value;
                packet.motionRadius = radius;
                packet.motionId = this.motionId;
            },
            setLedColor: function(color) {
                var packet = this.packet;
                if (color == 'RED') {
                    packet.ledRed = 255;
                    packet.ledGreen = 0;
                    packet.ledBlue = 0;
                } else if (color == 'ORANGE') {
                    packet.ledRed = 255;
                    packet.ledGreen = 63;
                    packet.ledBlue = 0;
                } else if (color == 'YELLOW') {
                    packet.ledRed = 255;
                    packet.ledGreen = 255;
                    packet.ledBlue = 0;
                } else if (color == 'GREEN') {
                    packet.ledRed = 0;
                    packet.ledGreen = 255;
                    packet.ledBlue = 0;
                } else if (color == 'CYAN') {
                    packet.ledRed = 0;
                    packet.ledGreen = 255;
                    packet.ledBlue = 255;
                } else if (color == 'BLUE') {
                    packet.ledRed = 0;
                    packet.ledGreen = 0;
                    packet.ledBlue = 255;
                } else if (color == 'VIOLET') {
                    packet.ledRed = 63;
                    packet.ledGreen = 0;
                    packet.ledBlue = 255;
                } else if (color == 'MAGENTA') {
                    packet.ledRed = 255;
                    packet.ledGreen = 0;
                    packet.ledBlue = 255;
                } else if (color == 'WHITE') {
                    packet.ledRed = 255;
                    packet.ledGreen = 255;
                    packet.ledBlue = 255;
                }
            },
        };
        return turtle;
    },
    getHamster: function(index) {
        var key = 'hamster' + index;
        var robot = this.robots[key];
        if (!robot) {
            robot = this.createHamster(index);
            this.robots[key] = robot;
            Entry.hw.sendQueue[key] = robot.packet;
        }
        return robot;
    },
    getTurtle: function(index) {
        var key = 'turtle' + index;
        var robot = this.robots[key];
        if (!robot) {
            robot = this.createTurtle(index);
            this.robots[key] = robot;
            Entry.hw.sendQueue[key] = robot.packet;
        }
        return robot;
    },
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
    name: 'roboid',
    url: 'http://robomation.net/',
    imageName: 'block_roboid.png',
    title: {
        en: 'Roboid',
        ko: '로보이드',
    },
    monitorTemplate: {
        imgPath: 'hw/transparent.png',
        width: 2,
        height: 2,
        listPorts: {
            hamster0leftProximity: {
                name:
                    Lang.Menus.hamster +
                    ' 0: ' +
                    Lang.Blocks.HAMSTER_sensor_left_proximity,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            hamster0rightProximity: {
                name:
                    Lang.Menus.hamster +
                    ' 0: ' +
                    Lang.Blocks.HAMSTER_sensor_right_proximity,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            hamster0leftFloor: {
                name:
                    Lang.Menus.hamster +
                    ' 0: ' +
                    Lang.Blocks.HAMSTER_sensor_left_floor,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            hamster0rightFloor: {
                name:
                    Lang.Menus.hamster +
                    ' 0: ' +
                    Lang.Blocks.HAMSTER_sensor_right_floor,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            hamster0accelerationX: {
                name:
                    Lang.Menus.hamster +
                    ' 0: ' +
                    Lang.Blocks.HAMSTER_sensor_acceleration_x,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            hamster0accelerationY: {
                name:
                    Lang.Menus.hamster +
                    ' 0: ' +
                    Lang.Blocks.HAMSTER_sensor_acceleration_y,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            hamster0accelerationZ: {
                name:
                    Lang.Menus.hamster +
                    ' 0: ' +
                    Lang.Blocks.HAMSTER_sensor_acceleration_z,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            hamster0light: {
                name:
                    Lang.Menus.hamster +
                    ' 0: ' +
                    Lang.Blocks.HAMSTER_sensor_light,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            hamster0temperature: {
                name:
                    Lang.Menus.hamster +
                    ' 0: ' +
                    Lang.Blocks.HAMSTER_sensor_temperature,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            hamster0inputA: {
                name:
                    Lang.Menus.hamster +
                    ' 0: ' +
                    Lang.Blocks.HAMSTER_sensor_input_a,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            hamster0inputB: {
                name:
                    Lang.Menus.hamster +
                    ' 0: ' +
                    Lang.Blocks.HAMSTER_sensor_input_b,
                type: 'input',
                pos: { x: 0, y: 0 },
            },

            turtle0colorNumber: {
                name:
                    Lang.Menus.turtle +
                    ' 0: ' +
                    Lang.Blocks.ROBOID_color_number,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            turtle0floor: {
                name: Lang.Menus.turtle + ' 0: ' + Lang.Blocks.ROBOID_floor,
                type: 'input',
                pos: { x: 193, y: 342 },
            },
            turtle0button: {
                name: Lang.Menus.turtle + ' 0: ' + Lang.Blocks.ROBOID_button,
                type: 'input',
                pos: { x: 290, y: 30 },
            },
            turtle0accelerationX: {
                name:
                    Lang.Menus.turtle +
                    ' 0: ' +
                    Lang.Blocks.ROBOID_acceleration_x,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            turtle0accelerationY: {
                name:
                    Lang.Menus.turtle +
                    ' 0: ' +
                    Lang.Blocks.ROBOID_acceleration_y,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            turtle0accelerationZ: {
                name:
                    Lang.Menus.turtle +
                    ' 0: ' +
                    Lang.Blocks.ROBOID_acceleration_z,
                type: 'input',
                pos: { x: 0, y: 0 },
            },

            hamster1leftProximity: {
                name:
                    Lang.Menus.hamster +
                    ' 1: ' +
                    Lang.Blocks.HAMSTER_sensor_left_proximity,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            hamster1rightProximity: {
                name:
                    Lang.Menus.hamster +
                    ' 1: ' +
                    Lang.Blocks.HAMSTER_sensor_right_proximity,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            hamster1leftFloor: {
                name:
                    Lang.Menus.hamster +
                    ' 1: ' +
                    Lang.Blocks.HAMSTER_sensor_left_floor,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            hamster1rightFloor: {
                name:
                    Lang.Menus.hamster +
                    ' 1: ' +
                    Lang.Blocks.HAMSTER_sensor_right_floor,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            hamster1accelerationX: {
                name:
                    Lang.Menus.hamster +
                    ' 1: ' +
                    Lang.Blocks.HAMSTER_sensor_acceleration_x,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            hamster1accelerationY: {
                name:
                    Lang.Menus.hamster +
                    ' 1: ' +
                    Lang.Blocks.HAMSTER_sensor_acceleration_y,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            hamster1accelerationZ: {
                name:
                    Lang.Menus.hamster +
                    ' 1: ' +
                    Lang.Blocks.HAMSTER_sensor_acceleration_z,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            hamster1light: {
                name:
                    Lang.Menus.hamster +
                    ' 1: ' +
                    Lang.Blocks.HAMSTER_sensor_light,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            hamster1temperature: {
                name:
                    Lang.Menus.hamster +
                    ' 1: ' +
                    Lang.Blocks.HAMSTER_sensor_temperature,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            hamster1inputA: {
                name:
                    Lang.Menus.hamster +
                    ' 1: ' +
                    Lang.Blocks.HAMSTER_sensor_input_a,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            hamster1inputB: {
                name:
                    Lang.Menus.hamster +
                    ' 1: ' +
                    Lang.Blocks.HAMSTER_sensor_input_b,
                type: 'input',
                pos: { x: 0, y: 0 },
            },

            turtle1colorNumber: {
                name:
                    Lang.Menus.turtle +
                    ' 1: ' +
                    Lang.Blocks.ROBOID_color_number,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            turtle1floor: {
                name: Lang.Menus.turtle + ' 1: ' + Lang.Blocks.ROBOID_floor,
                type: 'input',
                pos: { x: 193, y: 342 },
            },
            turtle1button: {
                name: Lang.Menus.turtle + ' 1: ' + Lang.Blocks.ROBOID_button,
                type: 'input',
                pos: { x: 290, y: 30 },
            },
            turtle1accelerationX: {
                name:
                    Lang.Menus.turtle +
                    ' 1: ' +
                    Lang.Blocks.ROBOID_acceleration_x,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            turtle1accelerationY: {
                name:
                    Lang.Menus.turtle +
                    ' 1: ' +
                    Lang.Blocks.ROBOID_acceleration_y,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            turtle1accelerationZ: {
                name:
                    Lang.Menus.turtle +
                    ' 1: ' +
                    Lang.Blocks.ROBOID_acceleration_z,
                type: 'input',
                pos: { x: 0, y: 0 },
            },

            hamster2leftProximity: {
                name:
                    Lang.Menus.hamster +
                    ' 2: ' +
                    Lang.Blocks.HAMSTER_sensor_left_proximity,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            hamster2rightProximity: {
                name:
                    Lang.Menus.hamster +
                    ' 2: ' +
                    Lang.Blocks.HAMSTER_sensor_right_proximity,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            hamster2leftFloor: {
                name:
                    Lang.Menus.hamster +
                    ' 2: ' +
                    Lang.Blocks.HAMSTER_sensor_left_floor,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            hamster2rightFloor: {
                name:
                    Lang.Menus.hamster +
                    ' 2: ' +
                    Lang.Blocks.HAMSTER_sensor_right_floor,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            hamster2accelerationX: {
                name:
                    Lang.Menus.hamster +
                    ' 2: ' +
                    Lang.Blocks.HAMSTER_sensor_acceleration_x,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            hamster2accelerationY: {
                name:
                    Lang.Menus.hamster +
                    ' 2: ' +
                    Lang.Blocks.HAMSTER_sensor_acceleration_y,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            hamster2accelerationZ: {
                name:
                    Lang.Menus.hamster +
                    ' 2: ' +
                    Lang.Blocks.HAMSTER_sensor_acceleration_z,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            hamster2light: {
                name:
                    Lang.Menus.hamster +
                    ' 2: ' +
                    Lang.Blocks.HAMSTER_sensor_light,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            hamster2temperature: {
                name:
                    Lang.Menus.hamster +
                    ' 2: ' +
                    Lang.Blocks.HAMSTER_sensor_temperature,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            hamster2inputA: {
                name:
                    Lang.Menus.hamster +
                    ' 2: ' +
                    Lang.Blocks.HAMSTER_sensor_input_a,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            hamster2inputB: {
                name:
                    Lang.Menus.hamster +
                    ' 2: ' +
                    Lang.Blocks.HAMSTER_sensor_input_b,
                type: 'input',
                pos: { x: 0, y: 0 },
            },

            turtle2colorNumber: {
                name:
                    Lang.Menus.turtle +
                    ' 2: ' +
                    Lang.Blocks.ROBOID_color_number,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            turtle2floor: {
                name: Lang.Menus.turtle + ' 2: ' + Lang.Blocks.ROBOID_floor,
                type: 'input',
                pos: { x: 193, y: 342 },
            },
            turtle2button: {
                name: Lang.Menus.turtle + ' 2: ' + Lang.Blocks.ROBOID_button,
                type: 'input',
                pos: { x: 290, y: 30 },
            },
            turtle2accelerationX: {
                name:
                    Lang.Menus.turtle +
                    ' 2: ' +
                    Lang.Blocks.ROBOID_acceleration_x,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            turtle2accelerationY: {
                name:
                    Lang.Menus.turtle +
                    ' 2: ' +
                    Lang.Blocks.ROBOID_acceleration_y,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            turtle2accelerationZ: {
                name:
                    Lang.Menus.turtle +
                    ' 2: ' +
                    Lang.Blocks.ROBOID_acceleration_z,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
        },
        mode: 'both',
    },
};

Entry.Roboid.setLanguage = function() {
    return {
        ko: {
            Blocks: {
                ROBOID_close_gripper: '닫기',
                ROBOID_open_gripper: '열기',
            },
            Helper: {
                roboid_hamster_gripper: '집게를 열거나 닫습니다.',
                roboid_hamster_release_gripper:
                    '집게의 전원을 끄고 자유롭게 움직일 수 있도록 합니다.',
            },
            template: {
                roboid_hamster_gripper: '햄스터 %1: 집게 %2 %3',
                roboid_hamster_release_gripper: '햄스터 %1: 집게 끄기 %2',
            },
        },
        en: {
            Blocks: {
                ROBOID_close_gripper: 'close',
                ROBOID_open_gripper: 'open',
            },
            Helper: {
                roboid_hamster_gripper: 'Opens or closes the gripper.',
                roboid_hamster_release_gripper:
                    'Turns off the gripper so that it can be moved freely.',
            },
            template: {
                roboid_hamster_gripper: 'Hamster %1: %2 gripper %3',
                roboid_hamster_release_gripper: 'Hamster %1: release gripper %2',
            },
        },
    };
};

Entry.Roboid.getBlocks = function() {
    return {
        //region roboid 로보이드
        roboid_hamster_hand_found: {
            color: '#00979D',
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
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
                        type: 'text',
                        params: ['0'],
                    },
                ],
                type: 'roboid_hamster_hand_found',
            },
            paramsKeyMap: {
                INDEX: 0,
            },
            class: 'hamster_sensor',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;
                var index = script.getNumberValue('INDEX');
                var key = 'hamster' + index;
                var leftProximity = pd[key + 'leftProximity'];
                var rightProximity = pd[key + 'rightProximity'];
                if (!leftProximity) leftProximity = 0;
                if (!rightProximity) rightProximity = 0;
                return leftProximity > 50 || rightProximity > 50;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_hand_found(%1)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                        blockType: 'param',
                    },
                ],
            },
        },
        roboid_hamster_value: {
            color: '#00979D',
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
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
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'roboid_hamster_value',
            },
            paramsKeyMap: {
                INDEX: 0,
                DEVICE: 1,
            },
            class: 'hamster_sensor',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;
                var index = script.getNumberValue('INDEX');
                var dev = script.getField('DEVICE');
                var value = pd['hamster' + index + dev];
                if (typeof value !== 'number') value = 0;
                return value;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_left_proximity(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, 'leftProximity'],
                    },
                    {
                        syntax: 'Roboid.hamster_right_proximity(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, 'rightProximity'],
                    },
                    {
                        syntax: 'Roboid.hamster_left_floor(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, 'leftFloor'],
                    },
                    {
                        syntax: 'Roboid.hamster_right_floor(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, 'rightFloor'],
                    },
                    {
                        syntax: 'Roboid.hamster_acceleration_x(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, 'accelerationX'],
                    },
                    {
                        syntax: 'Roboid.hamster_acceleration_y(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, 'accelerationY'],
                    },
                    {
                        syntax: 'Roboid.hamster_acceleration_z(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, 'accelerationZ'],
                    },
                    {
                        syntax: 'Roboid.hamster_light(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, 'light'],
                    },
                    {
                        syntax: 'Roboid.hamster_temperature(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, 'temperature'],
                    },
                    {
                        syntax: 'Roboid.hamster_signal_strength(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, 'signalStrength'],
                    },
                    {
                        syntax: 'Roboid.hamster_input_a(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, 'inputA'],
                    },
                    {
                        syntax: 'Roboid.hamster_input_b(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, 'inputB'],
                    },
                ],
            },
        },
        roboid_hamster_move_forward_once: {
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
                        params: ['0'],
                    },
                    null,
                ],
                type: 'roboid_hamster_move_forward_once',
            },
            paramsKeyMap: {
                INDEX: 0,
            },
            class: 'hamster_board',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getHamster(index);
                var packet = robot.packet;
                if (!script.isStart) {
                    script.isStart = true;
                    script.isMoving = true;
                    script.count = 0;
                    script.boardState = 1;
                    packet.motion = 0;
                    packet.leftWheel = 45;
                    packet.rightWheel = 45;
                    robot.boardCommand = 1;
                    robot.setLineTracerMode(0);
                    return script;
                } else if (script.isMoving) {
                    if (robot.boardCommand != 1) return script;
                    var leftFloor = pd['hamster' + index + 'leftFloor'];
                    var rightFloor = pd['hamster' + index + 'rightFloor'];
                    switch (script.boardState) {
                        case 1: {
                            if (script.count < 2) {
                                if (leftFloor < 50 && rightFloor < 50)
                                    script.count++;
                                else script.count = 0;
                                var diff = leftFloor - rightFloor;
                                packet.leftWheel = 45 + diff * 0.25;
                                packet.rightWheel = 45 - diff * 0.25;
                            } else {
                                script.count = 0;
                                script.boardState = 2;
                            }
                            break;
                        }
                        case 2: {
                            var diff = leftFloor - rightFloor;
                            packet.leftWheel = 45 + diff * 0.25;
                            packet.rightWheel = 45 - diff * 0.25;
                            script.boardState = 3;
                            var timer = setTimeout(function() {
                                script.boardState = 4;
                                Entry.Roboid.removeTimeout(timer);
                            }, 250);
                            Entry.Roboid.timeouts.push(timer);
                            break;
                        }
                        case 3: {
                            var diff = leftFloor - rightFloor;
                            packet.leftWheel = 45 + diff * 0.25;
                            packet.rightWheel = 45 - diff * 0.25;
                            break;
                        }
                        case 4: {
                            packet.leftWheel = 0;
                            packet.rightWheel = 0;
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
                    robot.boardCommand = 0;
                    packet.leftWheel = 0;
                    packet.rightWheel = 0;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_board_forward(%1)',
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
        roboid_hamster_turn_once: {
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
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    null,
                ],
                type: 'roboid_hamster_turn_once',
            },
            paramsKeyMap: {
                INDEX: 0,
                DIRECTION: 1,
            },
            class: 'hamster_board',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getHamster(index);
                var packet = robot.packet;
                if (!script.isStart) {
                    script.isStart = true;
                    script.isMoving = true;
                    script.count = 0;
                    script.boardState = 1;
                    packet.motion = 0;
                    var direction = script.getField('DIRECTION', script);
                    if (direction == 'LEFT') {
                        script.isLeft = true;
                        packet.leftWheel = -45;
                        packet.rightWheel = 45;
                    } else {
                        script.isLeft = false;
                        packet.leftWheel = 45;
                        packet.rightWheel = -45;
                    }
                    robot.boardCommand = 2;
                    robot.setLineTracerMode(0);
                    return script;
                } else if (script.isMoving) {
                    if (robot.boardCommand != 2) return script;
                    var leftFloor = pd['hamster' + index + 'leftFloor'];
                    var rightFloor = pd['hamster' + index + 'rightFloor'];
                    if (script.isLeft) {
                        switch (script.boardState) {
                            case 1: {
                                if (script.count < 2) {
                                    if (leftFloor > 50) script.count++;
                                } else {
                                    script.count = 0;
                                    script.boardState = 2;
                                }
                                break;
                            }
                            case 2: {
                                if (leftFloor < 20) {
                                    script.boardState = 3;
                                }
                                break;
                            }
                            case 3: {
                                if (script.count < 2) {
                                    if (leftFloor < 20) script.count++;
                                } else {
                                    script.count = 0;
                                    script.boardState = 4;
                                }
                                break;
                            }
                            case 4: {
                                if (leftFloor > 50) {
                                    script.boardState = 5;
                                }
                                break;
                            }
                            case 5: {
                                var diff = leftFloor - rightFloor;
                                if (diff > -15) {
                                    packet.leftWheel = 0;
                                    packet.rightWheel = 0;
                                    script.boardState = 0;
                                    script.isMoving = false;
                                } else {
                                    packet.leftWheel = diff * 0.5;
                                    packet.rightWheel = -diff * 0.5;
                                }
                                break;
                            }
                        }
                    } else {
                        switch (script.boardState) {
                            case 1: {
                                if (script.count < 2) {
                                    if (rightFloor > 50) script.count++;
                                } else {
                                    script.count = 0;
                                    script.boardState = 2;
                                }
                                break;
                            }
                            case 2: {
                                if (rightFloor < 20) {
                                    script.boardState = 3;
                                }
                                break;
                            }
                            case 3: {
                                if (script.count < 2) {
                                    if (rightFloor < 20) script.count++;
                                } else {
                                    script.count = 0;
                                    script.boardState = 4;
                                }
                                break;
                            }
                            case 4: {
                                if (rightFloor > 50) {
                                    script.boardState = 5;
                                }
                                break;
                            }
                            case 5: {
                                var diff = rightFloor - leftFloor;
                                if (diff > -15) {
                                    packet.leftWheel = 0;
                                    packet.rightWheel = 0;
                                    script.boardState = 0;
                                    script.isMoving = false;
                                } else {
                                    packet.leftWheel = -diff * 0.5;
                                    packet.rightWheel = diff * 0.5;
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
                    robot.boardCommand = 0;
                    packet.leftWheel = 0;
                    packet.rightWheel = 0;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_board_left(%1)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, 'LEFT'],
                    },
                    {
                        syntax: 'Roboid.hamster_board_right(%1)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, 'RIGHT'],
                    },
                ],
            },
        },
        roboid_hamster_move_forward_for_secs: {
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
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'roboid_hamster_move_forward_for_secs',
            },
            paramsKeyMap: {
                INDEX: 0,
                VALUE: 1,
            },
            class: 'hamster_wheel',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getHamster(index);
                var packet = robot.packet;
                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    packet.motion = 1;
                    packet.leftWheel = 30;
                    packet.rightWheel = 30;
                    robot.boardCommand = 0;
                    robot.setLineTracerMode(0);
                    var timeValue = script.getNumberValue('VALUE') * 1000;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.Roboid.removeTimeout(timer);
                    }, timeValue);
                    Entry.Roboid.timeouts.push(timer);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    Entry.engine.isContinue = false;
                    packet.motion = 0;
                    packet.leftWheel = 0;
                    packet.rightWheel = 0;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_move_forward(%1, %2)',
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
        roboid_hamster_move_backward_for_secs: {
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
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'roboid_hamster_move_backward_for_secs',
            },
            paramsKeyMap: {
                INDEX: 0,
                VALUE: 1,
            },
            class: 'hamster_wheel',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getHamster(index);
                var packet = robot.packet;
                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    packet.motion = 2;
                    packet.leftWheel = -30;
                    packet.rightWheel = -30;
                    robot.boardCommand = 0;
                    robot.setLineTracerMode(0);
                    var timeValue = script.getNumberValue('VALUE') * 1000;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.Roboid.removeTimeout(timer);
                    }, timeValue);
                    Entry.Roboid.timeouts.push(timer);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    Entry.engine.isContinue = false;
                    packet.motion = 0;
                    packet.leftWheel = 0;
                    packet.rightWheel = 0;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_move_backward(%1, %2)',
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
        roboid_hamster_turn_for_secs: {
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
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'roboid_hamster_turn_for_secs',
            },
            paramsKeyMap: {
                INDEX: 0,
                DIRECTION: 1,
                VALUE: 2,
            },
            class: 'hamster_wheel',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getHamster(index);
                var packet = robot.packet;
                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var direction = script.getField('DIRECTION', script);
                    if (direction == 'LEFT') {
                        packet.motion = 3;
                        packet.leftWheel = -30;
                        packet.rightWheel = 30;
                    } else {
                        packet.motion = 4;
                        packet.leftWheel = 30;
                        packet.rightWheel = -30;
                    }
                    robot.boardCommand = 0;
                    robot.setLineTracerMode(0);
                    var timeValue = script.getNumberValue('VALUE') * 1000;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.Roboid.removeTimeout(timer);
                    }, timeValue);
                    Entry.Roboid.timeouts.push(timer);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    Entry.engine.isContinue = false;
                    packet.motion = 0;
                    packet.leftWheel = 0;
                    packet.rightWheel = 0;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_turn_left(%1, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, 'LEFT'],
                    },
                    {
                        syntax: 'Roboid.hamster_turn_right(%1, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, 'RIGHT'],
                    },
                ],
            },
        },
        roboid_hamster_change_both_wheels_by: {
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
                        params: ['0'],
                    },
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
                type: 'roboid_hamster_change_both_wheels_by',
            },
            paramsKeyMap: {
                INDEX: 0,
                LEFT: 1,
                RIGHT: 2,
            },
            class: 'hamster_wheel',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getHamster(index);
                var packet = robot.packet;
                var left = script.getNumberValue('LEFT');
                var right = script.getNumberValue('RIGHT');
                packet.motion = 0;
                packet.leftWheel =
                    packet.leftWheel != undefined
                        ? packet.leftWheel + left
                        : left;
                packet.rightWheel =
                    packet.rightWheel != undefined
                        ? packet.rightWheel + right
                        : right;
                robot.boardCommand = 0;
                robot.setLineTracerMode(0);
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_wheels_by(%1, %2, %3)',
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
        roboid_hamster_set_both_wheels_to: {
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
                        params: ['0'],
                    },
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
                type: 'roboid_hamster_set_both_wheels_to',
            },
            paramsKeyMap: {
                INDEX: 0,
                LEFT: 1,
                RIGHT: 2,
            },
            class: 'hamster_wheel',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getHamster(index);
                var packet = robot.packet;
                packet.motion = 0;
                packet.leftWheel = script.getNumberValue('LEFT');
                packet.rightWheel = script.getNumberValue('RIGHT');
                robot.boardCommand = 0;
                robot.setLineTracerMode(0);
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_wheels(%1, %2, %3)',
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
        roboid_hamster_change_wheel_by: {
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
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    {
                        type: 'text',
                        params: ['10'],
                    },
                    null,
                ],
                type: 'roboid_hamster_change_wheel_by',
            },
            paramsKeyMap: {
                INDEX: 0,
                DIRECTION: 1,
                VALUE: 2,
            },
            class: 'hamster_wheel',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getHamster(index);
                var packet = robot.packet;
                var direction = script.getField('DIRECTION');
                var value = script.getNumberValue('VALUE');
                packet.motion = 0;
                if (direction == 'LEFT') {
                    packet.leftWheel =
                        packet.leftWheel != undefined
                            ? packet.leftWheel + value
                            : value;
                } else if (direction == 'RIGHT') {
                    packet.rightWheel =
                        packet.rightWheel != undefined
                            ? packet.rightWheel + value
                            : value;
                } else {
                    packet.leftWheel =
                        packet.leftWheel != undefined
                            ? packet.leftWheel + value
                            : value;
                    packet.rightWheel =
                        packet.rightWheel != undefined
                            ? packet.rightWheel + value
                            : value;
                }
                robot.boardCommand = 0;
                robot.setLineTracerMode(0);
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_left_wheel_by(%1, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, 'LEFT'],
                    },
                    {
                        syntax: 'Roboid.hamster_right_wheel_by(%1, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, 'RIGHT'],
                    },
                    {
                        syntax: 'Roboid.hamster_both_wheels_by(%1, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, 'BOTH'],
                    },
                ],
            },
        },
        roboid_hamster_set_wheel_to: {
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
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    {
                        type: 'text',
                        params: ['30'],
                    },
                    null,
                ],
                type: 'roboid_hamster_set_wheel_to',
            },
            paramsKeyMap: {
                INDEX: 0,
                DIRECTION: 1,
                VALUE: 2,
            },
            class: 'hamster_wheel',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getHamster(index);
                var packet = robot.packet;
                var direction = script.getField('DIRECTION');
                var value = script.getNumberValue('VALUE');
                packet.motion = 0;
                if (direction == 'LEFT') {
                    packet.leftWheel = value;
                } else if (direction == 'RIGHT') {
                    packet.rightWheel = value;
                } else {
                    packet.leftWheel = value;
                    packet.rightWheel = value;
                }
                robot.boardCommand = 0;
                robot.setLineTracerMode(0);
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_left_wheel(%1, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, 'LEFT'],
                    },
                    {
                        syntax: 'Roboid.hamster_right_wheel(%1, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, 'RIGHT'],
                    },
                    {
                        syntax: 'Roboid.hamster_both_wheels(%1, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, 'BOTH'],
                    },
                ],
            },
        },
        roboid_hamster_follow_line_using: {
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
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    null,
                    null,
                ],
                type: 'roboid_hamster_follow_line_using',
            },
            paramsKeyMap: {
                INDEX: 0,
                COLOR: 1,
                DIRECTION: 2,
            },
            class: 'hamster_wheel',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getHamster(index);
                var packet = robot.packet;
                var color = script.getField('COLOR');
                var direction = script.getField('DIRECTION');

                var mode = 1;
                if (direction == 'RIGHT') mode = 2;
                else if (direction == 'BOTH') mode = 3;
                if (color == 'WHITE') mode += 7;

                packet.motion = 0;
                packet.leftWheel = 0;
                packet.rightWheel = 0;
                robot.boardCommand = 0;
                robot.setLineTracerMode(mode);
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_follow_line(%1, %2, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                    },
                ],
            },
        },
        roboid_hamster_follow_line_until: {
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
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    null,
                    null,
                ],
                type: 'roboid_hamster_follow_line_until',
            },
            paramsKeyMap: {
                INDEX: 0,
                COLOR: 1,
                DIRECTION: 2,
            },
            class: 'hamster_wheel',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getHamster(index);
                var packet = robot.packet;
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
                    packet.motion = 0;
                    packet.leftWheel = 0;
                    packet.rightWheel = 0;
                    robot.boardCommand = 0;
                    robot.setLineTracerMode(mode);
                    return script;
                } else {
                    var lineTracerStateId =
                        pd['hamster' + index + 'lineTracerStateId'];
                    if (lineTracerStateId != robot.lineTracerStateId) {
                        robot.lineTracerStateId = lineTracerStateId;
                        var lineTracerState =
                            pd['hamster' + index + 'lineTracerState'];
                        if (lineTracerState == 0x40) {
                            delete script.isStart;
                            Entry.engine.isContinue = false;
                            robot.setLineTracerMode(0);
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
                        syntax: 'Roboid.hamster_follow_line_until(%1, %2, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                    },
                ],
            },
        },
        roboid_hamster_set_following_speed_to: {
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
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    '5',
                    null,
                ],
                type: 'roboid_hamster_set_following_speed_to',
            },
            paramsKeyMap: {
                INDEX: 0,
                SPEED: 1,
            },
            class: 'hamster_wheel',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getHamster(index);
                var packet = robot.packet;
                packet.lineTracerSpeed = Number(
                    script.getField('SPEED', script)
                );
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_line_tracer_speed(%1, %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
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
        roboid_hamster_stop: {
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
                        params: ['0'],
                    },
                    null,
                ],
                type: 'roboid_hamster_stop',
            },
            paramsKeyMap: {
                INDEX: 0,
            },
            class: 'hamster_wheel',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getHamster(index);
                var packet = robot.packet;
                packet.motion = 0;
                packet.leftWheel = 0;
                packet.rightWheel = 0;
                robot.boardCommand = 0;
                robot.setLineTracerMode(0);
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_stop(%1)',
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
        roboid_hamster_set_led_to: {
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
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    null,
                    null,
                ],
                type: 'roboid_hamster_set_led_to',
            },
            paramsKeyMap: {
                INDEX: 0,
                DIRECTION: 1,
                COLOR: 2,
            },
            class: 'hamster_led',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getHamster(index);
                var packet = robot.packet;
                var direction = script.getField('DIRECTION', script);
                var color = Number(script.getField('COLOR', script));
                if (direction == 'LEFT') {
                    packet.leftLed = color;
                } else if (direction == 'RIGHT') {
                    packet.rightLed = color;
                } else {
                    packet.leftLed = color;
                    packet.rightLed = color;
                }
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_left_led(%1, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                                    Entry.block.converters
                                        .returnValuePartialUpperCase,
                                codeMap: 'Entry.CodeMap.Hamster.colors',
                            },
                        ],
                        params: [null, 'LEFT'],
                    },
                    {
                        syntax: 'Roboid.hamster_right_led(%1, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                                    Entry.block.converters
                                        .returnValuePartialUpperCase,
                                codeMap: 'Entry.CodeMap.Hamster.colors',
                            },
                        ],
                        params: [null, 'RIGHT'],
                    },
                    {
                        syntax: 'Roboid.hamster_both_leds(%1, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                                    Entry.block.converters
                                        .returnValuePartialUpperCase,
                                codeMap: 'Entry.CodeMap.Hamster.colors',
                            },
                        ],
                        params: [null, 'BOTH'],
                    },
                ],
            },
        },
        roboid_hamster_clear_led: {
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
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    null,
                ],
                type: 'roboid_hamster_clear_led',
            },
            paramsKeyMap: {
                INDEX: 0,
                DIRECTION: 1,
            },
            class: 'hamster_led',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getHamster(index);
                var packet = robot.packet;
                var direction = script.getField('DIRECTION', script);
                if (direction == 'LEFT') {
                    packet.leftLed = 0;
                } else if (direction == 'RIGHT') {
                    packet.rightLed = 0;
                } else {
                    packet.leftLed = 0;
                    packet.rightLed = 0;
                }
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_left_led_off(%1)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, 'LEFT'],
                    },
                    {
                        syntax: 'Roboid.hamster_right_led_off(%1)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, 'RIGHT'],
                    },
                    {
                        syntax: 'Roboid.hamster_both_leds_off(%1)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, 'BOTH'],
                    },
                ],
            },
        },
        roboid_hamster_beep: {
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
                        params: ['0'],
                    },
                    null,
                ],
                type: 'roboid_hamster_beep',
            },
            paramsKeyMap: {
                INDEX: 0,
            },
            class: 'hamster_buzzer',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getHamster(index);
                var packet = robot.packet;
                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    packet.buzzer = 440;
                    packet.note = 0;
                    var timeValue = 0.2 * 1000;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.Roboid.removeTimeout(timer);
                    }, timeValue);
                    Entry.Roboid.timeouts.push(timer);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    Entry.engine.isContinue = false;
                    packet.buzzer = 0;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_beep(%1)',
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
        roboid_hamster_change_buzzer_by: {
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
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['10'],
                    },
                    null,
                ],
                type: 'roboid_hamster_change_buzzer_by',
            },
            paramsKeyMap: {
                INDEX: 0,
                VALUE: 1,
            },
            class: 'hamster_buzzer',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getHamster(index);
                var packet = robot.packet;
                var value = script.getNumberValue('VALUE');
                packet.buzzer =
                    packet.buzzer != undefined ? packet.buzzer + value : value;
                packet.note = 0;
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_buzzer_by(%1, %2)',
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
        roboid_hamster_set_buzzer_to: {
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
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['1000'],
                    },
                    null,
                ],
                type: 'roboid_hamster_set_buzzer_to',
            },
            paramsKeyMap: {
                INDEX: 0,
                VALUE: 1,
            },
            class: 'hamster_buzzer',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getHamster(index);
                var packet = robot.packet;
                packet.buzzer = script.getNumberValue('VALUE');
                packet.note = 0;
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_buzzer(%1, %2)',
                    },
                ],
            },
        },
        roboid_hamster_clear_buzzer: {
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
                        params: ['0'],
                    },
                    null,
                ],
                type: 'roboid_hamster_clear_buzzer',
            },
            paramsKeyMap: {
                INDEX: 0,
            },
            class: 'hamster_buzzer',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getHamster(index);
                var packet = robot.packet;
                packet.buzzer = 0;
                packet.note = 0;
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_buzzer_off(%1)',
                    },
                ],
            },
        },
        roboid_hamster_play_note_for: {
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
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    '4',
                    {
                        type: 'text',
                        params: ['0.5'],
                    },
                    null,
                ],
                type: 'roboid_hamster_play_note_for',
            },
            paramsKeyMap: {
                INDEX: 0,
                NOTE: 1,
                OCTAVE: 2,
                VALUE: 3,
            },
            class: 'hamster_buzzer',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getHamster(index);
                var packet = robot.packet;
                if (!script.isStart) {
                    var note = script.getNumberField('NOTE', script);
                    var octave = script.getNumberField('OCTAVE', script);
                    var beat = script.getNumberValue('VALUE', script);
                    note += (octave - 1) * 12;
                    var timeValue = beat * 60 * 1000 / robot.tempo;
                    script.isStart = true;
                    script.timeFlag = 1;
                    packet.buzzer = 0;
                    packet.note = note;
                    if (timeValue > 100) {
                        var timer1 = setTimeout(function() {
                            packet.note = 0;
                            Entry.Roboid.removeTimeout(timer1);
                        }, timeValue - 100);
                        Entry.Roboid.timeouts.push(timer1);
                    }
                    var timer2 = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.Roboid.removeTimeout(timer2);
                    }, timeValue);
                    Entry.Roboid.timeouts.push(timer2);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    Entry.engine.isContinue = false;
                    packet.note = 0;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_note(%1, %2, %3, %4)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
        roboid_hamster_rest_for: {
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
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['0.25'],
                    },
                    null,
                ],
                type: 'roboid_hamster_rest_for',
            },
            paramsKeyMap: {
                INDEX: 0,
                VALUE: 1,
            },
            class: 'hamster_buzzer',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getHamster(index);
                var packet = robot.packet;
                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timeValue = script.getNumberValue('VALUE');
                    timeValue = timeValue * 60 * 1000 / robot.tempo;
                    packet.buzzer = 0;
                    packet.note = 0;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.Roboid.removeTimeout(timer);
                    }, timeValue);
                    Entry.Roboid.timeouts.push(timer);
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
                        syntax: 'Roboid.hamster_note_off(%1, %2)',
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
        roboid_hamster_change_tempo_by: {
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
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['20'],
                    },
                    null,
                ],
                type: 'roboid_hamster_change_tempo_by',
            },
            paramsKeyMap: {
                INDEX: 0,
                VALUE: 1,
            },
            class: 'hamster_buzzer',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getHamster(index);
                var packet = robot.packet;
                robot.tempo += script.getNumberValue('VALUE');
                if (robot.tempo < 1) robot.tempo = 1;
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_tempo_by(%1, %2)',
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
        roboid_hamster_set_tempo_to: {
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
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['60'],
                    },
                    null,
                ],
                type: 'roboid_hamster_set_tempo_to',
            },
            paramsKeyMap: {
                INDEX: 0,
                VALUE: 1,
            },
            class: 'hamster_buzzer',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getHamster(index);
                var packet = robot.packet;
                robot.tempo = script.getNumberValue('VALUE');
                if (robot.tempo < 1) robot.tempo = 1;
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_tempo(%1, %2)',
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
        roboid_hamster_set_port_to: {
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
                        [Lang.Blocks.HAMSTER_analog_input, '1'],
                        [Lang.Blocks.HAMSTER_digital_input, '2'],
                        [Lang.Blocks.HAMSTER_servo_output, '9'],
                        [Lang.Blocks.HAMSTER_pwm_output, '10'],
                        [Lang.Blocks.HAMSTER_digital_output, '11'],
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
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    null,
                    null,
                ],
                type: 'roboid_hamster_set_port_to',
            },
            paramsKeyMap: {
                INDEX: 0,
                PORT: 1,
                MODE: 2,
            },
            class: 'hamster_port',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getHamster(index);
                var packet = robot.packet;
                var port = script.getField('PORT', script);
                var mode = Number(script.getField('MODE', script)) - 1;
                if (port == 'A') {
                    packet.ioModeA = mode;
                } else if (port == 'B') {
                    packet.ioModeB = mode;
                } else {
                    packet.ioModeA = mode;
                    packet.ioModeB = mode;
                }
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_io_mode_a(%1, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_analog_input, '1'],
                                    [Lang.Blocks.HAMSTER_digital_input, '2'],
                                    [Lang.Blocks.HAMSTER_servo_output, '9'],
                                    [Lang.Blocks.HAMSTER_pwm_output, '10'],
                                    [Lang.Blocks.HAMSTER_digital_output, '11'],
                                ],
                                value: '1',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters
                                        .returnValuePartialUpperCase,
                                codeMap: 'Entry.CodeMap.Hamster.modes',
                            },
                        ],
                        params: [null, 'A'],
                    },
                    {
                        syntax: 'Roboid.hamster_io_mode_b(%1, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_analog_input, '1'],
                                    [Lang.Blocks.HAMSTER_digital_input, '2'],
                                    [Lang.Blocks.HAMSTER_servo_output, '9'],
                                    [Lang.Blocks.HAMSTER_pwm_output, '10'],
                                    [Lang.Blocks.HAMSTER_digital_output, '11'],
                                ],
                                value: '1',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters
                                        .returnValuePartialUpperCase,
                                codeMap: 'Entry.CodeMap.Hamster.modes',
                            },
                        ],
                        params: [null, 'B'],
                    },
                    {
                        syntax: 'Roboid.hamster_io_modes(%1, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                converter:
                                    Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_analog_input, '1'],
                                    [Lang.Blocks.HAMSTER_digital_input, '2'],
                                    [Lang.Blocks.HAMSTER_servo_output, '9'],
                                    [Lang.Blocks.HAMSTER_pwm_output, '10'],
                                    [Lang.Blocks.HAMSTER_digital_output, '11'],
                                ],
                                value: '1',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters
                                        .returnValuePartialUpperCase,
                                codeMap: 'Entry.CodeMap.Hamster.modes',
                            },
                        ],
                        params: [null, 'AB'],
                    },
                ],
            },
        },
        roboid_hamster_change_output_by: {
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
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    {
                        type: 'text',
                        params: ['10'],
                    },
                    null,
                ],
                type: 'roboid_hamster_change_output_by',
            },
            paramsKeyMap: {
                INDEX: 0,
                PORT: 1,
                VALUE: 2,
            },
            class: 'hamster_port',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getHamster(index);
                var packet = robot.packet;
                var port = script.getField('PORT');
                var value = script.getNumberValue('VALUE');
                if (port == 'A') {
                    packet.outputA =
                        packet.outputA != undefined
                            ? packet.outputA + value
                            : value;
                } else if (port == 'B') {
                    packet.outputB =
                        packet.outputB != undefined
                            ? packet.outputB + value
                            : value;
                } else {
                    packet.outputA =
                        packet.outputA != undefined
                            ? packet.outputA + value
                            : value;
                    packet.outputB =
                        packet.outputB != undefined
                            ? packet.outputB + value
                            : value;
                }
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_output_a_by(%1, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, 'A'],
                    },
                    {
                        syntax: 'Roboid.hamster_output_b_by(%1, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, 'B'],
                    },
                    {
                        syntax: 'Roboid.hamster_outputs_by(%1, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, 'AB'],
                    },
                ],
            },
        },
        roboid_hamster_set_output_to: {
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
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    {
                        type: 'text',
                        params: ['100'],
                    },
                    null,
                ],
                type: 'roboid_hamster_set_output_to',
            },
            paramsKeyMap: {
                INDEX: 0,
                PORT: 1,
                VALUE: 2,
            },
            class: 'hamster_port',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getHamster(index);
                var packet = robot.packet;
                var port = script.getField('PORT');
                var value = script.getNumberValue('VALUE');
                if (port == 'A') {
                    packet.outputA = value;
                } else if (port == 'B') {
                    packet.outputB = value;
                } else {
                    packet.outputA = value;
                    packet.outputB = value;
                }
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_output_a(%1, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, 'A'],
                    },
                    {
                        syntax: 'Roboid.hamster_output_b(%1, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, 'B'],
                    },
                    {
                        syntax: 'Roboid.hamster_outputs(%1, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, 'AB'],
                    },
                ],
            },
        },
        roboid_hamster_gripper: {
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
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    null,
                ],
                type: 'roboid_hamster_gripper',
            },
            paramsKeyMap: {
                INDEX: 0,
                ACTION: 1,
            },
            class: 'hamster_port',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getHamster(index);
                var packet = robot.packet;
                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    packet.ioModeA = 10;
                    packet.ioModeB = 10;
                    var action = script.getField('ACTION');
                    if (action == 'OPEN') {
                        packet.outputA = 1;
                        packet.outputB = 0;
                    } else {
                        packet.outputA = 0;
                        packet.outputB = 1;
                    }
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.Roboid.removeTimeout(timer);
                    }, 500);
                    Entry.Roboid.timeouts.push(timer);
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
                        syntax: 'Roboid.hamster_open_gripper(%1)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, 'OPEN'],
                    },
                    {
                        syntax: 'Roboid.hamster_close_gripper(%1)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, 'CLOSE'],
                    },
                ],
            },
        },
        roboid_hamster_release_gripper: {
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
                        params: ['0'],
                    },
                    null,
                ],
                type: 'roboid_hamster_release_gripper',
            },
            paramsKeyMap: {
                INDEX: 0,
            },
            class: 'hamster_port',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getHamster(index);
                var packet = robot.packet;
                packet.ioModeA = 10;
                packet.ioModeB = 10;
                packet.outputA = 0;
                packet.outputB = 0;
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.hamster_release_gripper(%1)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                        params: [null],
                    },
                ],
            },
        },
        roboid_turtle_touching_color: {
            color: '#00979D',
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
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
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'roboid_turtle_touching_color',
            },
            paramsKeyMap: {
                INDEX: 0,
                COLOR: 1,
            },
            class: 'turtle_sensor',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;
                var index = script.getNumberValue('INDEX');
                return (
                    Number(script.getField('COLOR')) - 1 ===
                    pd['turtle' + index + 'colorNumber']
                );
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_touching(%1, %2)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
        roboid_turtle_is_color_pattern: {
            color: '#00979D',
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
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
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    null,
                ],
                type: 'roboid_turtle_is_color_pattern',
            },
            paramsKeyMap: {
                INDEX: 0,
                COLOR1: 1,
                COLOR2: 2,
            },
            class: 'turtle_sensor',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;
                var index = script.getNumberValue('INDEX');
                return (
                    Number(script.getField('COLOR1')) * 10 +
                        Number(script.getField('COLOR2')) ===
                    pd['turtle' + index + 'colorPattern']
                );
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_match_color_pattern(%1, %2, %3)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
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
        roboid_turtle_button_state: {
            color: '#00979D',
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
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
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'roboid_turtle_button_state',
            },
            paramsKeyMap: {
                INDEX: 0,
                EVENT: 1,
            },
            class: 'turtle_sensor',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;
                var index = script.getNumberValue('INDEX');
                var event = script.getField('EVENT');
                return pd['turtle' + index + event] === 1;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_clicked(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, 'clicked'],
                    },
                    {
                        syntax: 'Roboid.turtle_double_clicked(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, 'doubleClicked'],
                    },
                    {
                        syntax: 'Roboid.turtle_long_pressed(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, 'longPressed'],
                    },
                ],
            },
        },
        roboid_turtle_value: {
            color: '#00979D',
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
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
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'roboid_turtle_value',
            },
            paramsKeyMap: {
                INDEX: 0,
                DEVICE: 1,
            },
            class: 'turtle_sensor',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;
                var index = script.getNumberValue('INDEX');
                var dev = script.getField('DEVICE');
                var value = pd['turtle' + index + dev];
                if (typeof value !== 'number')
                    value = Entry.Roboid.TURTLE_SENSOR[dev];
                return value;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_color_number(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, 'colorNumber'],
                    },
                    {
                        syntax: 'Roboid.turtle_color_pattern(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, 'colorPattern'],
                    },
                    {
                        syntax: 'Roboid.turtle_floor(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, 'floor'],
                    },
                    {
                        syntax: 'Roboid.turtle_button(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, 'button'],
                    },
                    {
                        syntax: 'Roboid.turtle_acceleration_x(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, 'accelerationX'],
                    },
                    {
                        syntax: 'Roboid.turtle_acceleration_y(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, 'accelerationY'],
                    },
                    {
                        syntax: 'Roboid.turtle_acceleration_z(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, 'accelerationZ'],
                    },
                ],
            },
        },
        roboid_turtle_move_forward_unit: {
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
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['6'],
                    },
                    null,
                    null,
                ],
                type: 'roboid_turtle_move_forward_unit',
            },
            paramsKeyMap: {
                INDEX: 0,
                VALUE: 1,
                UNIT: 2,
            },
            class: 'turtle_wheel',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getTurtle(index);
                var packet = robot.packet;
                if (!script.isStart) {
                    script.isStart = true;
                    packet.leftWheel = 0;
                    packet.rightWheel = 0;
                    robot.setPulse(0);
                    robot.setLineTracerMode(0);
                    var field = script.getField('UNIT');
                    var unit = 1;
                    if (field == 'SEC') unit = 2;
                    else if (field == 'PULSE') unit = 3;
                    var value = script.getNumberValue('VALUE');
                    robot.setMotion(1, unit, 0, value, 0);
                    return script;
                } else {
                    var wheelStateId = pd['turtle' + index + 'wheelStateId'];
                    if (wheelStateId != robot.wheelStateId) {
                        robot.wheelStateId = wheelStateId;
                        var wheelState = pd['turtle' + index + 'wheelState'];
                        if (wheelState == 0) {
                            delete script.isStart;
                            Entry.engine.isContinue = false;
                            packet.leftWheel = 0;
                            packet.rightWheel = 0;
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
                        syntax: 'Roboid.turtle_move_forward(%1, %2, %3)',
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
        roboid_turtle_move_backward_unit: {
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
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['6'],
                    },
                    null,
                    null,
                ],
                type: 'roboid_turtle_move_backward_unit',
            },
            paramsKeyMap: {
                INDEX: 0,
                VALUE: 1,
                UNIT: 2,
            },
            class: 'turtle_wheel',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getTurtle(index);
                var packet = robot.packet;
                if (!script.isStart) {
                    script.isStart = true;
                    packet.leftWheel = 0;
                    packet.rightWheel = 0;
                    robot.setPulse(0);
                    robot.setLineTracerMode(0);
                    var field = script.getField('UNIT');
                    var unit = 1;
                    if (field == 'SEC') unit = 2;
                    else if (field == 'PULSE') unit = 3;
                    var value = script.getNumberValue('VALUE');
                    robot.setMotion(2, unit, 0, value, 0);
                    return script;
                } else {
                    var wheelStateId = pd['turtle' + index + 'wheelStateId'];
                    if (wheelStateId != robot.wheelStateId) {
                        robot.wheelStateId = wheelStateId;
                        var wheelState = pd['turtle' + index + 'wheelState'];
                        if (wheelState == 0) {
                            delete script.isStart;
                            Entry.engine.isContinue = false;
                            packet.leftWheel = 0;
                            packet.rightWheel = 0;
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
                        syntax: 'Roboid.turtle_move_backward(%1, %2, %3)',
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
        roboid_turtle_turn_unit_in_place: {
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
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    {
                        type: 'text',
                        params: ['90'],
                    },
                    null,
                    null,
                ],
                type: 'roboid_turtle_turn_unit_in_place',
            },
            paramsKeyMap: {
                INDEX: 0,
                DIRECTION: 1,
                VALUE: 2,
                UNIT: 3,
            },
            class: 'turtle_wheel',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getTurtle(index);
                var packet = robot.packet;
                if (!script.isStart) {
                    script.isStart = true;
                    packet.leftWheel = 0;
                    packet.rightWheel = 0;
                    robot.setPulse(0);
                    robot.setLineTracerMode(0);
                    var direction = script.getField('DIRECTION');
                    var field = script.getField('UNIT');
                    var unit = 1;
                    if (field == 'SEC') unit = 2;
                    else if (field == 'PULSE') unit = 3;
                    var value = script.getNumberValue('VALUE');
                    if (direction == 'LEFT')
                        robot.setMotion(3, unit, 0, value, 0);
                    else robot.setMotion(4, unit, 0, value, 0);
                    return script;
                } else {
                    var wheelStateId = pd['turtle' + index + 'wheelStateId'];
                    if (wheelStateId != robot.wheelStateId) {
                        robot.wheelStateId = wheelStateId;
                        var wheelState = pd['turtle' + index + 'wheelState'];
                        if (wheelState == 0) {
                            delete script.isStart;
                            Entry.engine.isContinue = false;
                            packet.leftWheel = 0;
                            packet.rightWheel = 0;
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
                        syntax: 'Roboid.turtle_turn_left(%1, %3, %4)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, 'LEFT'],
                    },
                    {
                        syntax: 'Roboid.turtle_turn_right(%1, %3, %4)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, 'RIGHT'],
                    },
                ],
            },
        },
        roboid_turtle_turn_unit_with_radius_in_direction: {
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
                    {
                        type: 'text',
                        params: ['0'],
                    },
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
                type: 'roboid_turtle_turn_unit_with_radius_in_direction',
            },
            paramsKeyMap: {
                INDEX: 0,
                DIRECTION: 1,
                VALUE: 2,
                UNIT: 3,
                RADIUS: 4,
                HEAD: 5,
            },
            class: 'turtle_wheel',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getTurtle(index);
                var packet = robot.packet;
                if (!script.isStart) {
                    script.isStart = true;
                    packet.leftWheel = 0;
                    packet.rightWheel = 0;
                    robot.setPulse(0);
                    robot.setLineTracerMode(0);
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
                            robot.setMotion(9, unit, 0, value, radius);
                        else robot.setMotion(10, unit, 0, value, radius);
                    } else {
                        if (head == 'HEAD')
                            robot.setMotion(11, unit, 0, value, radius);
                        else robot.setMotion(12, unit, 0, value, radius);
                    }
                    return script;
                } else {
                    var wheelStateId = pd['turtle' + index + 'wheelStateId'];
                    if (wheelStateId != robot.wheelStateId) {
                        robot.wheelStateId = wheelStateId;
                        var wheelState = pd['turtle' + index + 'wheelState'];
                        if (wheelState == 0) {
                            delete script.isStart;
                            Entry.engine.isContinue = false;
                            packet.leftWheel = 0;
                            packet.rightWheel = 0;
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
                        syntax: 'Roboid.turtle_swing_left(%1, %3, %4, %5, %6)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, 'LEFT'],
                    },
                    {
                        syntax: 'Roboid.turtle_swing_right(%1, %3, %4, %5, %6)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, 'RIGHT'],
                    },
                ],
            },
        },
        roboid_turtle_pivot_around_wheel_unit_in_direction: {
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
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    {
                        type: 'text',
                        params: ['90'],
                    },
                    null,
                    null,
                    null,
                ],
                type: 'roboid_turtle_pivot_around_wheel_unit_in_direction',
            },
            paramsKeyMap: {
                INDEX: 0,
                DIRECTION: 1,
                VALUE: 2,
                UNIT: 3,
                HEAD: 4,
            },
            class: 'turtle_wheel',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getTurtle(index);
                var packet = robot.packet;
                if (!script.isStart) {
                    script.isStart = true;
                    packet.leftWheel = 0;
                    packet.rightWheel = 0;
                    robot.setPulse(0);
                    robot.setLineTracerMode(0);
                    var direction = script.getField('DIRECTION');
                    var field = script.getField('UNIT');
                    var unit = 1;
                    if (field == 'SEC') unit = 2;
                    else if (field == 'PULSE') unit = 3;
                    var value = script.getNumberValue('VALUE');
                    var head = script.getField('HEAD');
                    if (direction == 'LEFT') {
                        if (head == 'HEAD')
                            robot.setMotion(5, unit, 0, value, 0);
                        else robot.setMotion(6, unit, 0, value, 0);
                    } else {
                        if (head == 'HEAD')
                            robot.setMotion(7, unit, 0, value, 0);
                        else robot.setMotion(8, unit, 0, value, 0);
                    }
                    return script;
                } else {
                    var wheelStateId = pd['turtle' + index + 'wheelStateId'];
                    if (wheelStateId != robot.wheelStateId) {
                        robot.wheelStateId = wheelStateId;
                        var wheelState = pd['turtle' + index + 'wheelState'];
                        if (wheelState == 0) {
                            delete script.isStart;
                            Entry.engine.isContinue = false;
                            packet.leftWheel = 0;
                            packet.rightWheel = 0;
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
                        syntax: 'Roboid.turtle_pivot_left(%1, %3, %4, %5)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, 'LEFT'],
                    },
                    {
                        syntax: 'Roboid.turtle_pivot_right(%1, %3, %4, %5)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, 'RIGHT'],
                    },
                ],
            },
        },
        roboid_turtle_change_wheels_by_left_right: {
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
                        params: ['0'],
                    },
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
                type: 'roboid_turtle_change_wheels_by_left_right',
            },
            paramsKeyMap: {
                INDEX: 0,
                LEFT: 1,
                RIGHT: 2,
            },
            class: 'turtle_wheel',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getTurtle(index);
                var packet = robot.packet;
                var left = script.getNumberValue('LEFT');
                var right = script.getNumberValue('RIGHT');
                robot.setPulse(0);
                robot.setLineTracerMode(0);
                robot.setMotion(0, 0, 0, 0, 0);
                packet.leftWheel =
                    packet.leftWheel != undefined
                        ? packet.leftWheel + left
                        : left;
                packet.rightWheel =
                    packet.rightWheel != undefined
                        ? packet.rightWheel + right
                        : right;
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_wheels_by(%1, %2, %3)',
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
        roboid_turtle_set_wheels_to_left_right: {
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
                        params: ['0'],
                    },
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
                type: 'roboid_turtle_set_wheels_to_left_right',
            },
            paramsKeyMap: {
                INDEX: 0,
                LEFT: 1,
                RIGHT: 2,
            },
            class: 'turtle_wheel',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getTurtle(index);
                var packet = robot.packet;
                robot.setPulse(0);
                robot.setLineTracerMode(0);
                robot.setMotion(0, 0, 0, 0, 0);
                packet.leftWheel = script.getNumberValue('LEFT');
                packet.rightWheel = script.getNumberValue('RIGHT');
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_wheels(%1, %2, %3)',
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
        roboid_turtle_change_wheel_by: {
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
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    {
                        type: 'text',
                        params: ['10'],
                    },
                    null,
                ],
                type: 'roboid_turtle_change_wheel_by',
            },
            paramsKeyMap: {
                INDEX: 0,
                DIRECTION: 1,
                VALUE: 2,
            },
            class: 'turtle_wheel',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getTurtle(index);
                var packet = robot.packet;
                var direction = script.getField('DIRECTION');
                var value = script.getNumberValue('VALUE');
                robot.setPulse(0);
                robot.setLineTracerMode(0);
                robot.setMotion(0, 0, 0, 0, 0);
                if (direction == 'LEFT') {
                    packet.leftWheel =
                        packet.leftWheel != undefined
                            ? packet.leftWheel + value
                            : value;
                } else if (direction == 'RIGHT') {
                    packet.rightWheel =
                        packet.rightWheel != undefined
                            ? packet.rightWheel + value
                            : value;
                } else {
                    packet.leftWheel =
                        packet.leftWheel != undefined
                            ? packet.leftWheel + value
                            : value;
                    packet.rightWheel =
                        packet.rightWheel != undefined
                            ? packet.rightWheel + value
                            : value;
                }
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_left_wheel_by(%1, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, 'LEFT'],
                    },
                    {
                        syntax: 'Roboid.turtle_right_wheel_by(%1, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, 'RIGHT'],
                    },
                    {
                        syntax: 'Roboid.turtle_both_wheels_by(%1, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, 'BOTH'],
                    },
                ],
            },
        },
        roboid_turtle_set_wheel_to: {
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
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    {
                        type: 'text',
                        params: ['50'],
                    },
                    null,
                ],
                type: 'roboid_turtle_set_wheel_to',
            },
            paramsKeyMap: {
                INDEX: 0,
                DIRECTION: 1,
                VALUE: 2,
            },
            class: 'turtle_wheel',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getTurtle(index);
                var packet = robot.packet;
                var direction = script.getField('DIRECTION');
                var value = script.getNumberValue('VALUE');
                robot.setPulse(0);
                robot.setLineTracerMode(0);
                robot.setMotion(0, 0, 0, 0, 0);
                if (direction == 'LEFT') {
                    packet.leftWheel = value;
                } else if (direction == 'RIGHT') {
                    packet.rightWheel = value;
                } else {
                    packet.leftWheel = value;
                    packet.rightWheel = value;
                }
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_left_wheel(%1, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, 'LEFT'],
                    },
                    {
                        syntax: 'Roboid.turtle_right_wheel(%1, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, 'RIGHT'],
                    },
                    {
                        syntax: 'Roboid.turtle_both_wheels(%1, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, 'BOTH'],
                    },
                ],
            },
        },
        roboid_turtle_follow_line: {
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
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    null,
                ],
                type: 'roboid_turtle_follow_line',
            },
            paramsKeyMap: {
                INDEX: 0,
                COLOR: 1,
            },
            class: 'turtle_wheel',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getTurtle(index);
                var packet = robot.packet;
                packet.leftWheel = 0;
                packet.rightWheel = 0;
                robot.setPulse(0);
                robot.setMotion(0, 0, 0, 0, 0);
                var mode = Number(script.getField('COLOR'));
                robot.setLineTracerMode(mode);
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_follow_line(%1, %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
        roboid_turtle_follow_line_until: {
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
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    null,
                ],
                type: 'roboid_turtle_follow_line_until',
            },
            paramsKeyMap: {
                INDEX: 0,
                COLOR: 1,
            },
            class: 'turtle_wheel',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getTurtle(index);
                var packet = robot.packet;
                if (!script.isStart) {
                    script.isStart = true;
                    packet.leftWheel = 0;
                    packet.rightWheel = 0;
                    robot.setPulse(0);
                    robot.setMotion(0, 0, 0, 0, 0);
                    var mode = Number(script.getField('COLOR'));
                    robot.setLineTracerMode(mode);
                    return script;
                } else {
                    var lineTracerStateId =
                        pd['turtle' + index + 'lineTracerStateId'];
                    if (lineTracerStateId != robot.lineTracerStateId) {
                        robot.lineTracerStateId = lineTracerStateId;
                        var lineTracerState =
                            pd['turtle' + index + 'lineTracerState'];
                        if (lineTracerState == 0x02) {
                            delete script.isStart;
                            Entry.engine.isContinue = false;
                            robot.setLineTracerMode(0);
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
                        syntax: 'Roboid.turtle_follow_black_line_until(%1, %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
        roboid_turtle_follow_line_until_black: {
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
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    null,
                ],
                type: 'roboid_turtle_follow_line_until_black',
            },
            paramsKeyMap: {
                INDEX: 0,
                COLOR: 1,
            },
            class: 'turtle_wheel',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getTurtle(index);
                var packet = robot.packet;
                if (!script.isStart) {
                    script.isStart = true;
                    packet.leftWheel = 0;
                    packet.rightWheel = 0;
                    robot.setPulse(0);
                    robot.setMotion(0, 0, 0, 0, 0);
                    var mode = Number(script.getField('COLOR'));
                    robot.setLineTracerMode(mode);
                    return script;
                } else {
                    var lineTracerStateId =
                        pd['turtle' + index + 'lineTracerStateId'];
                    if (lineTracerStateId != robot.lineTracerStateId) {
                        robot.lineTracerStateId = lineTracerStateId;
                        var lineTracerState =
                            pd['turtle' + index + 'lineTracerState'];
                        if (lineTracerState == 0x02) {
                            delete script.isStart;
                            Entry.engine.isContinue = false;
                            robot.setLineTracerMode(0);
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
                        syntax: 'Roboid.turtle_follow_line_until_black(%1, %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
        roboid_turtle_cross_intersection: {
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
                        params: ['0'],
                    },
                    null,
                ],
                type: 'roboid_turtle_cross_intersection',
            },
            paramsKeyMap: {
                INDEX: 0,
            },
            class: 'turtle_wheel',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getTurtle(index);
                var packet = robot.packet;
                if (!script.isStart) {
                    script.isStart = true;
                    packet.leftWheel = 0;
                    packet.rightWheel = 0;
                    robot.setPulse(0);
                    robot.setMotion(0, 0, 0, 0, 0);
                    robot.setLineTracerMode(40);
                    return script;
                } else {
                    var lineTracerStateId =
                        pd['turtle' + index + 'lineTracerStateId'];
                    if (lineTracerStateId != robot.lineTracerStateId) {
                        robot.lineTracerStateId = lineTracerStateId;
                        var lineTracerState =
                            pd['turtle' + index + 'lineTracerState'];
                        if (lineTracerState == 0x02) {
                            delete script.isStart;
                            Entry.engine.isContinue = false;
                            robot.setLineTracerMode(0);
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
                        syntax: 'Roboid.turtle_intersection_forward(%1)',
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
        roboid_turtle_turn_at_intersection: {
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
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    null,
                ],
                type: 'roboid_turtle_turn_at_intersection',
            },
            paramsKeyMap: {
                INDEX: 0,
                DIRECTION: 1,
            },
            class: 'turtle_wheel',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getTurtle(index);
                var packet = robot.packet;
                if (!script.isStart) {
                    script.isStart = true;
                    packet.leftWheel = 0;
                    packet.rightWheel = 0;
                    robot.setPulse(0);
                    robot.setMotion(0, 0, 0, 0, 0);
                    var mode = Number(script.getField('DIRECTION'));
                    robot.setLineTracerMode(mode);
                    return script;
                } else {
                    var lineTracerStateId =
                        pd['turtle' + index + 'lineTracerStateId'];
                    if (lineTracerStateId != robot.lineTracerStateId) {
                        robot.lineTracerStateId = lineTracerStateId;
                        var lineTracerState =
                            pd['turtle' + index + 'lineTracerState'];
                        if (lineTracerState == 0x02) {
                            delete script.isStart;
                            Entry.engine.isContinue = false;
                            robot.setLineTracerMode(0);
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
                        syntax: 'Roboid.turtle_intersection_left(%1)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, '20'],
                    },
                    {
                        syntax: 'Roboid.turtle_intersection_right(%1)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, '30'],
                    },
                    {
                        syntax: 'Roboid.turtle_intersection_uturn(%1)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                        params: [null, '50'],
                    },
                ],
            },
        },
        roboid_turtle_set_following_speed_to: {
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
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    '5',
                    null,
                ],
                type: 'roboid_turtle_set_following_speed_to',
            },
            paramsKeyMap: {
                INDEX: 0,
                SPEED: 1,
            },
            class: 'turtle_wheel',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getTurtle(index);
                var packet = robot.packet;
                var speed = Number(script.getField('SPEED'));
                packet.lineTracerSpeed = speed;
                packet.lineTracerGain = speed;
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_line_tracer_speed(%1, %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
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
        roboid_turtle_stop: {
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
                        params: ['0'],
                    },
                    null,
                ],
                type: 'roboid_turtle_stop',
            },
            paramsKeyMap: {
                INDEX: 0,
            },
            class: 'turtle_wheel',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getTurtle(index);
                var packet = robot.packet;
                packet.leftWheel = 0;
                packet.rightWheel = 0;
                robot.setPulse(0);
                robot.setLineTracerMode(0);
                robot.setMotion(0, 0, 0, 0, 0);
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_stop(%1)',
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
        roboid_turtle_set_head_led_to: {
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
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    null,
                ],
                type: 'roboid_turtle_set_head_led_to',
            },
            paramsKeyMap: {
                INDEX: 0,
                COLOR: 1,
            },
            class: 'turtle_led',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getTurtle(index);
                var packet = robot.packet;
                var color = script.getField('COLOR');
                robot.setLedColor(color);
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_led_color(%1, %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
        roboid_turtle_change_head_led_by_rgb: {
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
                        params: ['0'],
                    },
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
                type: 'roboid_turtle_change_head_led_by_rgb',
            },
            paramsKeyMap: {
                INDEX: 0,
                RED: 1,
                GREEN: 2,
                BLUE: 3,
            },
            class: 'turtle_led',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getTurtle(index);
                var packet = robot.packet;
                var red = script.getNumberValue('RED');
                var green = script.getNumberValue('GREEN');
                var blue = script.getNumberValue('BLUE');
                packet.ledRed =
                    packet.ledRed != undefined ? packet.ledRed + red : red;
                packet.ledGreen =
                    packet.ledGreen != undefined
                        ? packet.ledGreen + green
                        : green;
                packet.ledBlue =
                    packet.ledBlue != undefined ? packet.ledBlue + blue : blue;
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_led_by(%1, %2, %3, %4)',
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
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        roboid_turtle_set_head_led_to_rgb: {
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
                        params: ['0'],
                    },
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
                type: 'roboid_turtle_set_head_led_to_rgb',
            },
            paramsKeyMap: {
                INDEX: 0,
                RED: 1,
                GREEN: 2,
                BLUE: 3,
            },
            class: 'turtle_led',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getTurtle(index);
                var packet = robot.packet;
                packet.ledRed = script.getNumberValue('RED');
                packet.ledGreen = script.getNumberValue('GREEN');
                packet.ledBlue = script.getNumberValue('BLUE');
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_led(%1, %2, %3, %4)',
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
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        roboid_turtle_clear_head_led: {
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
                        params: ['0'],
                    },
                    null,
                ],
                type: 'roboid_turtle_clear_head_led',
            },
            paramsKeyMap: {
                INDEX: 0,
            },
            class: 'turtle_led',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getTurtle(index);
                var packet = robot.packet;
                packet.ledRed = 0;
                packet.ledGreen = 0;
                packet.ledBlue = 0;
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_led_off(%1)',
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
        roboid_turtle_play_sound_times: {
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
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'roboid_turtle_play_sound_times',
            },
            paramsKeyMap: {
                INDEX: 0,
                SOUND: 1,
                COUNT: 2,
            },
            class: 'turtle_sound',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getTurtle(index);
                var packet = robot.packet;
                packet.buzzer = 0;
                packet.note = 0;
                var sound = Number(script.getField('SOUND'));
                var count = script.getNumberValue('COUNT');
                if (count) robot.setSound(sound, count);
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_sound(%1, %2, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
        roboid_turtle_play_sound_times_until_done: {
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
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'roboid_turtle_play_sound_times_until_done',
            },
            paramsKeyMap: {
                INDEX: 0,
                SOUND: 1,
                COUNT: 2,
            },
            class: 'turtle_sound',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getTurtle(index);
                var packet = robot.packet;
                if (!script.isStart) {
                    script.isStart = true;
                    packet.buzzer = 0;
                    packet.note = 0;
                    var sound = Number(script.getField('SOUND'));
                    var count = script.getNumberValue('COUNT');
                    if (count) {
                        robot.setSound(sound, count);
                        return script;
                    } else {
                        robot.sound = 0;
                        robot.soundRepeat = 1;
                        delete script.isStart;
                        Entry.engine.isContinue = false;
                        return script.callReturn();
                    }
                } else {
                    var soundStateId = pd['turtle' + index + 'soundStateId'];
                    if (soundStateId != robot.soundStateId) {
                        robot.soundStateId = soundStateId;
                        var soundState = pd['turtle' + index + 'soundState'];
                        if (soundState == 0) {
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
                        syntax: 'Roboid.turtle_sound_until_done(%1, %2, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
        roboid_turtle_change_buzzer_by: {
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
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['10'],
                    },
                    null,
                ],
                type: 'roboid_turtle_change_buzzer_by',
            },
            paramsKeyMap: {
                INDEX: 0,
                VALUE: 1,
            },
            class: 'turtle_sound',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getTurtle(index);
                var packet = robot.packet;
                var value = script.getNumberValue('VALUE');
                packet.buzzer =
                    packet.buzzer != undefined ? packet.buzzer + value : value;
                packet.note = 0;
                robot.setSound(0);
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_buzzer_by(%1, %2)',
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
        roboid_turtle_set_buzzer_to: {
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
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['1000'],
                    },
                    null,
                ],
                type: 'roboid_turtle_set_buzzer_to',
            },
            paramsKeyMap: {
                INDEX: 0,
                VALUE: 1,
            },
            class: 'turtle_sound',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getTurtle(index);
                var packet = robot.packet;
                packet.buzzer = script.getNumberValue('VALUE');
                packet.note = 0;
                robot.setSound(0);
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_buzzer(%1, %2)',
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
        roboid_turtle_clear_sound: {
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
                        params: ['0'],
                    },
                    null,
                ],
                type: 'roboid_turtle_clear_sound',
            },
            paramsKeyMap: {
                INDEX: 0,
            },
            class: 'turtle_sound',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getTurtle(index);
                var packet = robot.packet;
                packet.buzzer = 0;
                packet.note = 0;
                robot.setSound(0);
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_sound_off(%1)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                        params: [null, null],
                    },
                ],
            },
        },
        roboid_turtle_play_note: {
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
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    '4',
                    null,
                ],
                type: 'roboid_turtle_play_note',
            },
            paramsKeyMap: {
                INDEX: 0,
                NOTE: 1,
                OCTAVE: 2,
            },
            class: 'turtle_sound',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getTurtle(index);
                var packet = robot.packet;
                var note = script.getNumberField('NOTE', script);
                var octave = script.getNumberField('OCTAVE', script);
                packet.buzzer = 0;
                note += (octave - 1) * 12;
                packet.note = note;
                robot.setSound(0);
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_pitch(%1, %2, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
        roboid_turtle_play_note_for_beats: {
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
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                    '4',
                    {
                        type: 'text',
                        params: ['0.5'],
                    },
                    null,
                ],
                type: 'roboid_turtle_play_note_for_beats',
            },
            paramsKeyMap: {
                INDEX: 0,
                NOTE: 1,
                OCTAVE: 2,
                VALUE: 3,
            },
            class: 'turtle_sound',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getTurtle(index);
                var packet = robot.packet;
                if (!script.isStart) {
                    var note = script.getNumberField('NOTE', script);
                    var octave = script.getNumberField('OCTAVE', script);
                    var beat = script.getNumberValue('VALUE', script);
                    note += (octave - 1) * 12;
                    var timeValue = beat * 60 * 1000 / robot.tempo;
                    script.isStart = true;
                    script.timeFlag = 1;
                    packet.buzzer = 0;
                    packet.note = note;
                    robot.setSound(0);
                    if (timeValue > 100) {
                        var timer1 = setTimeout(function() {
                            packet.note = 0;
                            Entry.Roboid.removeTimeout(timer1);
                        }, timeValue - 100);
                        Entry.Roboid.timeouts.push(timer1);
                    }
                    var timer2 = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.Roboid.removeTimeout(timer2);
                    }, timeValue);
                    Entry.Roboid.timeouts.push(timer2);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    Entry.engine.isContinue = false;
                    packet.note = 0;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_note(%1, %2, %3, %4)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
        roboid_turtle_rest_for_beats: {
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
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['0.25'],
                    },
                    null,
                ],
                type: 'roboid_turtle_rest_for_beats',
            },
            paramsKeyMap: {
                INDEX: 0,
                VALUE: 1,
            },
            class: 'turtle_sound',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getTurtle(index);
                var packet = robot.packet;
                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timeValue = script.getNumberValue('VALUE');
                    timeValue = timeValue * 60 * 1000 / robot.tempo;
                    packet.buzzer = 0;
                    packet.note = 0;
                    robot.setSound(0);
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.Roboid.removeTimeout(timer);
                    }, timeValue);
                    Entry.Roboid.timeouts.push(timer);
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
                        syntax: 'Roboid.turtle_note_off(%1, %2)',
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
        roboid_turtle_change_tempo_by: {
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
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['20'],
                    },
                    null,
                ],
                type: 'roboid_turtle_change_tempo_by',
            },
            paramsKeyMap: {
                INDEX: 0,
                VALUE: 1,
            },
            class: 'turtle_sound',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getTurtle(index);
                robot.tempo += script.getNumberValue('VALUE');
                if (robot.tempo < 1) robot.tempo = 1;
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_tempo_by(%1, %2)',
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
        roboid_turtle_set_tempo_to: {
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
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['60'],
                    },
                    null,
                ],
                type: 'roboid_turtle_set_tempo_to',
            },
            paramsKeyMap: {
                INDEX: 0,
                VALUE: 1,
            },
            class: 'turtle_sound',
            isNotFor: ['roboid'],
            func: function(sprite, script) {
                var index = script.getNumberValue('INDEX');
                var robot = Entry.Roboid.getTurtle(index);
                robot.tempo = script.getNumberValue('VALUE');
                if (robot.tempo < 1) robot.tempo = 1;
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Roboid.turtle_tempo(%1, %2)',
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
        // ----- akaii: add until here

        //endregion roboid 로두이노
    };
};
