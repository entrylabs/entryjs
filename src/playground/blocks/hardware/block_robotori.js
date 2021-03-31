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
    setZero: function() {
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
            A0: { name: 'A0', type: 'input', pos: { x: 0, y: 0 } },
            A1: { name: 'A1', type: 'input', pos: { x: 0, y: 0 } },
            A2: { name: 'A2', type: 'input', pos: { x: 0, y: 0 } },
            A3: { name: 'A3', type: 'input', pos: { x: 0, y: 0 } },
            A4: { name: 'A4', type: 'input', pos: { x: 0, y: 0 } },
            A5: { name: 'A5', type: 'input', pos: { x: 0, y: 0 } },
            D2: { name: 'D2', type: 'input', pos: { x: 0, y: 0 } },
            D3: { name: 'D3', type: 'input', pos: { x: 0, y: 0 } },
        },
        mode: 'both',
    },
};

Entry.robotori.setLanguage = function() {
    return {
        ko: {
            template: {
                robotori_digitalInput: '%1',
                robotori_analogInput: '%1',
                robotori_digitalOutput: '디지털 %1 핀, 출력 값 %2 %3',
                robotori_analogOutput: '아날로그 %1 %2 %3',
                robotori_servo: '서보모터 각도 %1 %2',
                robotori_dc_direction: 'DC모터 %1 회전 %2 %3',
            },
            Blocks: {
                robotori_D2_Input: '디지털 2번 핀 입력 값',
                robotori_D3_Input: '디지털 3번 핀 입력 값',
                robotori_A0_Input: '아날로그 0번 핀 입력 값',
                robotori_A1_Input: '아날로그 1번 핀 입력 값',
                robotori_A2_Input: '아날로그 2번 핀 입력 값',
                robotori_A3_Input: '아날로그 3번 핀 입력 값',
                robotori_A4_Input: '아날로그 4번 핀 입력 값',
                robotori_A5_Input: '아날로그 5번 핀 입력 값',
                robotori_digital: '디지털',
                robotori_D10_Output: '10번',
                robotori_D11_Output: '11번',
                robotori_D12_Output: '12번',
                robotori_D13_Output: '13번',
                robotori_pin_OutputValue: '핀, 출력 값',
                robotori_On: '켜짐',
                robotori_Off: '꺼짐',
                robotori_analog: '아날로그',
                robotori_analog5: '5번 핀 출력 값',
                robotori_analog6: '6번 핀 출력 값',
                robotori_analog9: '9번 핀 출력 값',
                robotori_Servo: '서보모터',
                robotori_DC: 'DC모터',
                robotori_DC_rightmotor: '오른쪽',
                robotori_DC_leftmotor: '왼쪽',
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
            },
            Blocks: {
                robotori_D2_Input: 'Digital Pin 2 Input Value',
                robotori_D3_Input: 'Digital Pin 3 Input Value',
                robotori_A0_Input: 'Analog Pin 0 Input Value',
                robotori_A1_Input: 'Analog Pin 1 Input Value',
                robotori_A2_Input: 'Analog Pin 2 Input Value',
                robotori_A3_Input: 'Analog Pin 3 Input Value',
                robotori_A4_Input: 'Analog Pin 4 Input Value',
                robotori_A5_Input: 'Analog Pin 5 Input Value',
                robotori_digital: 'Digital',
                robotori_D10_Output: 'Pin 10',
                robotori_D11_Output: 'Pin 11',
                robotori_D12_Output: 'Pin 12',
                robotori_D13_Output: 'Pin 13',
                robotori_pin_OutputValue: 'Output Value',
                robotori_On: 'On',
                robotori_Off: 'Off',
                robotori_analog: 'Analog',
                robotori_analog5: 'Pin 5 Output Value',
                robotori_analog6: 'Pin 6 Output Value',
                robotori_analog9: 'Pin 9 Output Value',
                robotori_Servo: 'Servo Motor',
                robotori_DC: 'DC Motor',
                robotori_DC_rightmotor: 'Right',
                robotori_DC_leftmotor: 'Left',
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
    //robotori add 20161129 end
];

Entry.robotori.getBlocks = function() {
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
            func: function(sprite, script) {
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
            func: function(sprite, script) {
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
            func: function(sprite, script) {
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
            func: function(sprite, script) {
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
            func: function(sprite, script) {
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
            func: function(sprite, script) {
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
        //endregion robotori 로보토리
    };
};

module.exports = Entry.robotori;
