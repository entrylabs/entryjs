'use strict';

Entry.robotori = {
    PORT_MAP: {
        A0: 0,
        A1: 0,
        A2: 0,
        A3: 0,
        A4: 0,
        A5: 0,
        D2: 0,
        D3: 0,
        D10: 0,
        D11: 0,
        D12: 0,
        D13: 0,
        AOUT5: 0,
        AOUT6: 0,
        AOUT9: 0,
        SERVO: 90,
        RIGHT_MOTOR: 0xff, //default stop
        LEFT_MOTOR: 0xff, //default stop
    },
    setZero: function () {
        //Entry.hw.sendQueue.readablePorts = [];

        var portMap = Entry.robotori.PORT_MAP;
        var sq = Entry.hw.sendQueue;
        for (var port in portMap) {
            sq[port] = portMap[port];
            //sq[portMap[port] = 0;

            //Entry.hw.sendQueue.readablePorts.push(port);
        }
        Entry.hw.update();
        var Robotori = Entry.robotori;
    },
    id: 'D.1',
    name: 'robotori',
    url: 'http://www.robotori.com/',
    imageName: 'robotori.png',
    title: {
        ko: '로보토리',
        en: 'robotori',
    },
    monitorTemplate: {
        imgPath: 'hw/robotori.png',
        width: 395,
        height: 372,
        listPorts: {
            A0: { name: 'A1', type: 'input', pos: { x: 0, y: 0 } },
            A1: { name: 'A2', type: 'input', pos: { x: 0, y: 0 } },
            A2: { name: 'A3', type: 'input', pos: { x: 0, y: 0 } },
            A3: { name: 'A4', type: 'input', pos: { x: 0, y: 0 } },
            A4: { name: 'A5', type: 'input', pos: { x: 0, y: 0 } },
            A5: { name: 'A6', type: 'input', pos: { x: 0, y: 0 } },
            D2: { name: 'D7', type: 'input', pos: { x: 0, y: 0 } },
            D3: { name: 'D8', type: 'input', pos: { x: 0, y: 0 } },
        },
        mode: 'both',
    },
};

Entry.robotori.setLanguage = function () {
    return {
        ko: {
            template: {
                robotori_digitalInput: '%1',
                robotori_analogInput: '%1',
                robotori_digitalOutput: '디지털 %1 핀, 출력 값 %2 %3',
                robotori_analogOutput: '아날로그 %1 %2 %3',
                robotori_servo: '서보모터 각도 %1 %2',
                robotori_dc_direction: 'DC모터 %1 회전 %2 %3',
                robotori_dc_forward: 'DC모터 %1 %2 %3',
                robotori_dc_stop: 'DC모터 정지   ',
                robotori_temperature_sensor: '%1 보드, 온도 센서 %2 핀',
                robotori_gas_sensor: '%1 보드, 가스 센서 %2 핀',
            },
            Blocks: {
                robotori_D2_Input: '디지털 7번 핀 입력 값',
                robotori_D3_Input: '디지털 8번 핀 입력 값',
                robotori_A0_Input: '아날로그 1번',
                robotori_A1_Input: '아날로그 2번',
                robotori_A2_Input: '아날로그 3번',
                robotori_A3_Input: '아날로그 4번',
                robotori_A4_Input: '아날로그 5번',
                robotori_A5_Input: '아날로그 6번',
                robotori_board_type_1: 'BASE(E5-1)',
                robotori_board_type_2: 'TORIANO(E10)',
                robotori_digital: '디지털',
                robotori_D10_Output: '11번',
                robotori_D11_Output: '12번',
                robotori_D12_Output: '13번',
                robotori_D13_Output: '14번',
                robotori_pin_OutputValue: '핀, 출력 값',
                robotori_On: '켜짐',
                robotori_Off: '꺼짐',
                robotori_analog: '아날로그',
                robotori_analog5: '15번 핀 출력 값',
                robotori_analog6: '16번 핀 출력 값',
                robotori_analog9: '17번 핀 출력 값',
                robotori_Servo: '서보모터',
                robotori_DC: 'DC모터',
                robotori_DC_rightmotor: '오른쪽',
                robotori_DC_leftmotor: '왼쪽',
                robotori_DC_forward: '전진',
                robotori_DC_backward: '후진',
                robotori_DC_STOP: '정지',
                robotori_DC_CW: '시계방향',
                robotori_DC_CCW: '반시계방향',
                robotori_DC_select: '회전',

            },
        },
        en: {
            template: {
                robotori_digitalInput: '%1',
                robotori_analogInput: '%1',
                robotori_digitalOutput: 'Digital %1 PIN, Output Value %2 %3',
                robotori_analogOutput: 'Analog %1 %2 %3',
                robotori_servo: 'Servo Motor Angle %1 %2',
                robotori_dc_direction: 'DC Motor %1 Direction %2 %3',
                robotori_dc_forward: 'DC Motor Forward',
                robotori_dc_backward: 'DC Motor Backward',
                robotori_temperature_sensor: '%1 Board, Tempture Sensor %2 PIN',
                robotori_gas_sensor: '%1 Board, Gas Sensor %2 PIN',
            },
            Blocks: {
                robotori_D2_Input: 'Digital Pin 7 Input Value',
                robotori_D3_Input: 'Digital Pin 8 Input Value',
                robotori_A0_Input: 'Analog Pin 1 Input Value',
                robotori_A1_Input: 'Analog Pin 2 Input Value',
                robotori_A2_Input: 'Analog Pin 3 Input Value',
                robotori_A3_Input: 'Analog Pin 4 Input Value',
                robotori_A4_Input: 'Analog Pin 5 Input Value',
                robotori_A5_Input: 'Analog Pin 6 Input Value',
                robotori_board_type_1: 'BASE(E5-1)',
                robotori_board_type_2: 'TORIANO(E10)',
                robotori_digital: 'Digital',
                robotori_D10_Output: 'Pin 11',
                robotori_D11_Output: 'Pin 12',
                robotori_D12_Output: 'Pin 13',
                robotori_D13_Output: 'Pin 14',
                robotori_pin_OutputValue: 'Output Value',
                robotori_On: 'On',
                robotori_Off: 'Off',
                robotori_analog: 'Analog',
                robotori_analog5: 'Pin 15 Output Value',
                robotori_analog6: 'Pin 16 Output Value',
                robotori_analog9: 'Pin 17 Output Value',
                robotori_Servo: 'Servo Motor',
                robotori_DC: 'DC Motor',
                robotori_DC_rightmotor: 'Right',
                robotori_DC_leftmotor: 'Left',
                robotori_DC_forward: 'Forward',
                robotori_DC_backward: 'Backward',
                robotori_DC_STOP: 'Stop',
                robotori_DC_CW: 'clockwise',
                robotori_DC_CCW: 'anticlockwise',
                robotori_DC_select: 'direction',
            },
        },
    };
};

Entry.robotori.blockMenuBlocks = [
    //robotori Add 20161129 begin
    'robotori_digitalInput',
    'robotori_analogInput',
    'robotori_digitalOutput',
    'robotori_analogOutput',
    'robotori_servo',
    'robotori_dc_direction',
    'robotori_dc_forward',
    'robotori_dc_stop',
    'robotori_temperature_sensor',
    'robotori_gas_sensor'
    //robotori add 20161129 end
];

Entry.robotori.getBlocks = function () {
    return {
        //region robotori 로보토리
        robotori_digitalInput: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotori_D2_Input, 'D2'],
                        [Lang.Blocks.robotori_D3_Input, 'D3'],
                    ],
                    value: 'D2',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'robotori_digitalInput',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class: 'robotori_sensor',
            isNotFor: ['robotori'],
            func: function (sprite, script) {
                var pd = Entry.hw.portData;
                var dev = script.getField('DEVICE');
                return pd[dev];
            },
        },
        robotori_analogInput: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotori_A0_Input, 'A0'],
                        [Lang.Blocks.robotori_A1_Input, 'A1'],
                        [Lang.Blocks.robotori_A2_Input, 'A2'],
                        [Lang.Blocks.robotori_A3_Input, 'A3'],
                        [Lang.Blocks.robotori_A4_Input, 'A4'],
                        [Lang.Blocks.robotori_A5_Input, 'A5'],
                    ],
                    value: 'A0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'robotori_analogInput',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class: 'robotori_sensor',
            isNotFor: ['robotori'],
            func: function (sprite, script) {
                var pd = Entry.hw.portData;
                var dev = script.getField('DEVICE');
                return pd[dev];
            },
        },
        robotori_digitalOutput: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotori_D10_Output, 'D10'],
                        [Lang.Blocks.robotori_D11_Output, 'D11'],
                        [Lang.Blocks.robotori_D12_Output, 'D12'],
                        [Lang.Blocks.robotori_D13_Output, 'D13'],
                    ],
                    value: 'D10',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotori_On, 'ON'],
                        [Lang.Blocks.robotori_Off, 'OFF'],
                    ],
                    value: 'ON',
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
                type: 'robotori_digitalOutput',
            },
            paramsKeyMap: {
                DEVICE: 0,
                VALUE: 1,
            },
            class: 'robotori_sensor',
            isNotFor: ['robotori'],
            func: function (sprite, script) {
                var sq = Entry.hw.sendQueue;
                var dev = script.getStringField('DEVICE', script);
                var value = script.getStringField('VALUE', script);

                if (dev == 'D10') {
                    if (value == 'ON') {
                        sq.D10 = 1;
                    } else {
                        sq.D10 = 0;
                    }
                } else if (dev == 'D11') {
                    if (value == 'ON') {
                        sq.D11 = 1;
                    } else {
                        sq.D11 = 0;
                    }
                } else if (dev == 'D12') {
                    if (value == 'ON') {
                        sq.D12 = 1;
                    } else {
                        sq.D12 = 0;
                    }
                } else if (dev == 'D13') {
                    if (value == 'ON') {
                        sq.D13 = 1;
                    } else {
                        sq.D13 = 0;
                    }
                }
                return script.callReturn();
            },
        },
        robotori_analogOutput: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotori_analog5, 'AOUT5'],
                        [Lang.Blocks.robotori_analog6, 'AOUT6'],
                        [Lang.Blocks.robotori_analog9, 'AOUT9'],
                    ],
                    value: 'AOUT5',
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
                        type: 'text',
                        params: ['255'],
                    },
                    null,
                ],
                type: 'robotori_analogOutput',
            },
            paramsKeyMap: {
                DEVICE: 0,
                VALUE: 1,
            },
            class: 'robotori_sensor',
            isNotFor: ['robotori'],
            func: function (sprite, script) {
                var sq = Entry.hw.sendQueue;
                var dev = script.getStringField('DEVICE', script);
                var value = script.getNumberValue('VALUE', script);

                if (dev == 'AOUT5') {
                    sq.AOUT5 = value;
                } else if (dev == 'AOUT6') {
                    sq.AOUT6 = value;
                } else if (dev == 'AOUT9') {
                    sq.AOUT9 = value;
                }

                return script.callReturn();
            },
        },
        robotori_servo: {
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
                        type: 'text',
                        params: ['90'],
                    },
                    null,
                ],
                type: 'robotori_servo',
            },
            paramsKeyMap: {
                SERVO: 0,
            },
            class: 'robotori_motor',
            isNotFor: ['robotori'],
            func: function (sprite, script) {
                var sq = Entry.hw.sendQueue;
                sq.SERVO = script.getNumberValue('SERVO');

                return script.callReturn();
            },
        },
        robotori_dc_direction: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotori_DC_rightmotor, 'RIGHT_MOTOR'],
                        [Lang.Blocks.robotori_DC_leftmotor, 'LEFT_MOTOR'],
                    ],
                    value: 'RIGHT_MOTOR',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotori_DC_STOP, 'STOP'],
                        [Lang.Blocks.robotori_DC_CW, 'CW'],
                        [Lang.Blocks.robotori_DC_CCW, 'CCW'],
                    ],
                    value: 'STOP',
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
                type: 'robotori_dc_direction',
            },
            paramsKeyMap: {
                DEVICE: 0,
                VALUE: 1,
            },
            class: 'robotori_motor',
            isNotFor: ['robotori'],
            func: function (sprite, script) {
                var sq = Entry.hw.sendQueue;
                var dev = script.getStringField('DEVICE', script);
                var value = script.getStringField('VALUE', script);
                if (dev == 'RIGHT_MOTOR') {
                    if (value == 'STOP') {
                        sq.RIGHT_MOTOR = 0xff;
                    } else if (value == 'CW') {
                        sq.RIGHT_MOTOR = 0x00;
                    } else if (value == 'CCW') {
                        sq.RIGHT_MOTOR = 0xb4;
                    }
                }
                if (dev == 'LEFT_MOTOR') {
                    if (value == 'STOP') {
                        sq.LEFT_MOTOR = 0xff;
                    } else if (value == 'CW') {
                        sq.LEFT_MOTOR = 0x00;
                    } else if (value == 'CCW') {
                        sq.LEFT_MOTOR = 0xb4;
                    }
                }
                return script.callReturn();
            },
        },
        robotori_dc_forward: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotori_DC_forward, 'FORWARD'],
                        [Lang.Blocks.robotori_DC_backward, 'BACKWARD'],
                    ],
                    value: 'FORWARD',
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
                type: 'robotori_dc_forward',
            },
            paramsKeyMap: {
                DEVICE: 0,
                VALUE: 1,
            },
            class: 'robotori_motor',
            isNotFor: ['robotori'],
            func: function (sprite, script) {
                var sq = Entry.hw.sendQueue;
                var dev = script.getStringField('DEVICE', script);
                var value = script.getStringField('VALUE', script);
                if (dev == 'FORWARD') {
                    sq.RIGHT_MOTOR = 0x00;
                    sq.LEFT_MOTOR = 0xb4;

                }
                else {
                    sq.RIGHT_MOTOR = 0xb4;
                    sq.LEFT_MOTOR = 0x00;
                }


                return script.callReturn();
            },
        },
        robotori_dc_stop: {
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
                params: [],
                type: 'robotori_dc_stop',
            },
            paramsKeyMap: {
                DEVICE: 0,
                VALUE: 1,
            },
            class: 'robotori_motor',
            isNotFor: ['robotori'],
            func: function (sprite, script) {
                var sq = Entry.hw.sendQueue;
                var dev = script.getStringField('DEVICE', script);
                var value = script.getStringField('VALUE', script);

                sq.RIGHT_MOTOR = 0xff;
                sq.LEFT_MOTOR = 0xff;

                return script.callReturn();
            },
        },
        robotori_temperature_sensor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotori_board_type_1, 'AT128'],
                        [Lang.Blocks.robotori_board_type_2, 'TORIANO'],
                    ],
                    value: 'AT128',
                    fontSize: 12,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotori_A0_Input, 'A0'],
                        [Lang.Blocks.robotori_A1_Input, 'A1'],
                        [Lang.Blocks.robotori_A2_Input, 'A2'],
                        [Lang.Blocks.robotori_A3_Input, 'A3'],
                        [Lang.Blocks.robotori_A4_Input, 'A4'],
                        [Lang.Blocks.robotori_A5_Input, 'A5'],
                    ],
                    value: 'A0',
                    fontSize: 12,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null, null],
                type: 'robotori_temperature_sensor',  // 블록의 타입 이름을 변경
            },
            paramsKeyMap: {
                board: 0,
                pin: 1,

            },
            class: 'robotori_sensor',
            isNotFor: ['robotori'],
            func: function (sprite, script) {
                var pd = Entry.hw.portData;
                var board_type = script.getField('board', script);
                var dev = script.getField('pin', script);

                var originValue = pd[dev];
                var temperature;

                if (board_type == 'AT128') {
                    temperature = originValue * 0.42;
                }
                if (board_type == 'TORIANO') {
                    temperature = originValue * 0.30;
                }

                return temperature;
            },
        },
        robotori_gas_sensor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotori_board_type_1, 'AT128'],
                        [Lang.Blocks.robotori_board_type_2, 'TORIANO'],
                    ],
                    value: 'AT128',
                    fontSize: 12,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotori_A0_Input, 'A0'],
                        [Lang.Blocks.robotori_A1_Input, 'A1'],
                        [Lang.Blocks.robotori_A2_Input, 'A2'],
                        [Lang.Blocks.robotori_A3_Input, 'A3'],
                        [Lang.Blocks.robotori_A4_Input, 'A4'],
                        [Lang.Blocks.robotori_A5_Input, 'A5'],
                    ],
                    value: 'A0',
                    fontSize: 12,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null, null],
                type: 'robotori_gas_sensor',  // 블록의 타입 이름을 변경
            },
            paramsKeyMap: {
                board: 0,
                pin: 1,

            },
            class: 'robotori_sensor',
            isNotFor: ['robotori'],
            func: function (sprite, script) {
                var pd = Entry.hw.portData;
                var board_type = script.getField('board', script);
                var dev = script.getField('pin', script);

                var originValue = pd[dev];
                var temperature;

                if (board_type == 'AT128') {
                    temperature = originValue * 0.42;
                }
                if (board_type == 'TORIANO') {
                    temperature = originValue * 0.30;
                }

                return temperature;
            },
        },

        //endregion robotori 로보토리
    };
};

module.exports = Entry.robotori;
