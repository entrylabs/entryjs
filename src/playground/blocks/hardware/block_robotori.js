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
        RIGHT_MOTOR: 0xFF,  //default stop
        LEFT_MOTOR: 0xFF,   //default stop
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
                    options: [[Lang.Blocks.robotori_On, 'ON'], [Lang.Blocks.robotori_Off, 'OFF']],
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

                if(dev == 'D10')
                {
                    if(value == 'ON'){
                        sq.D10 = 1;
                    } else {
                        sq.D10 = 0;
                    }
                }
                else if(dev == 'D11')
                {
                    if(value == 'ON'){
                        sq.D11 = 1;
                    } else {
                        sq.D11 = 0;
                    }
                }
                else if(dev == 'D12') 
                {
                    if(value == 'ON'){
                        sq.D12 = 1;
                    } else {
                        sq.D12 = 0;
                    }
                }
                else if(dev == 'D13') 
                {
                    if(value == 'ON'){
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
