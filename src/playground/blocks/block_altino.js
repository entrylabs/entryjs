'use strict';

Entry.Altino = {
    PORT_MAP: {
        rightWheel: 0,
        leftWheel: 0,
        steering: 0,
        ascii: 0,
        led: 0,
        led2: 0,
        note: 0,
        dot1: 0,
        dot2: 0,
        dot3: 0,
        dot4: 0,
        dot5: 0,
        dot6: 0,
        dot7: 0,
        dot8: 0,
    },
    setZero: function() {
        var portMap = Entry.Altino.PORT_MAP;
        var sq = Entry.hw.sendQueue;
        for (var port in portMap) {
            sq[port] = portMap[port];
        }
        Entry.hw.update();
        var Altino = Entry.Altino;
        Altino.removeAllTimeouts();
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
    name: 'altino',
    url: 'http://saeon.co.kr/',
    imageName: 'altino.png',
    title: {
        "en": "Altino",
        "ko": "알티노",
    },
};

Entry.Altino.getBlocks = function() {
    return {
        //region Altino 알티노
        altino_analogValue: {
            color: '#00979D',
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ALTINO_CDS, 'cds'],
                        [Lang.Blocks.ALTINO_IR1, 'ir1'],
                        [Lang.Blocks.ALTINO_IR2, 'ir2'],
                        [Lang.Blocks.ALTINO_IR3, 'ir3'],
                        [Lang.Blocks.ALTINO_IR4, 'ir4'],
                        [Lang.Blocks.ALTINO_IR5, 'ir5'],
                        [Lang.Blocks.ALTINO_IR6, 'ir6'],
                        [Lang.Blocks.ALTINO_TOR1, 'tor1'],
                        [Lang.Blocks.ALTINO_TOR2, 'tor2'],
                        [Lang.Blocks.ALTINO_TEM, 'tem'],
                        [Lang.Blocks.ALTINO_ACCX, 'accx'],
                        [Lang.Blocks.ALTINO_ACCY, 'accy'],
                        [Lang.Blocks.ALTINO_ACCZ, 'accz'],
                        [Lang.Blocks.ALTINO_MAGX, 'magx'],
                        [Lang.Blocks.ALTINO_MAGY, 'magy'],
                        [Lang.Blocks.ALTINO_MAGZ, 'magz'],
                        [Lang.Blocks.ALTINO_GYROX, 'gyrox'],
                        [Lang.Blocks.ALTINO_GYROY, 'gyroy'],
                        [Lang.Blocks.ALTINO_GYROZ, 'gyroz'],
                        [Lang.Blocks.ALTINO_STVAR, 'stvar'],
                        [Lang.Blocks.ALTINO_STTOR, 'sttor'],
                        [Lang.Blocks.ALTINO_BAT, 'bat'],
                        [Lang.Blocks.ALTINO_REMOTE, 'remote'],
                    ],
                    value: 'cds',
                    fontSize: 11,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'altino_analogValue',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class: 'altino_sensor',
            isNotFor: ['altino'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;
                var dev = script.getField('DEVICE');
                return pd[dev];
            },
            syntax: { js: [], py: ['Altino.analog_value(%1)'] },
        },
        altino_steering: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ALTINO_Steering_Angle_Center, 'Center'],
                        [Lang.Blocks.ALTINO_Steering_Angle_Left5, 'Left5'],
                        [Lang.Blocks.ALTINO_Steering_Angle_Left10, 'Left10'],
                        [Lang.Blocks.ALTINO_Steering_Angle_Left15, 'Left15'],
                        [Lang.Blocks.ALTINO_Steering_Angle_Left20, 'Left20'],
                        [Lang.Blocks.ALTINO_Steering_Angle_Right5, 'Right5'],
                        [Lang.Blocks.ALTINO_Steering_Angle_Right10, 'Right10'],
                        [Lang.Blocks.ALTINO_Steering_Angle_Right15, 'Right15'],
                        [Lang.Blocks.ALTINO_Steering_Angle_Right20, 'Right20'],
                    ],
                    value: 'Center',
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
                type: 'altino_steering',
            },
            paramsKeyMap: {
                DIRECTION: 0,
            },
            class: 'altino_motor',
            isNotFor: ['altino'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var direction = script.getField('DIRECTION', script);

                if (direction == 'Center') {
                    sq.steering = 2;
                } else if (direction == 'Left5') {
                    sq.steering = 160;
                } else if (direction == 'Left10') {
                    sq.steering = 192;
                } else if (direction == 'Left15') {
                    sq.steering = 224;
                } else if (direction == 'Left20') {
                    sq.steering = 255;
                } else if (direction == 'Right5') {
                    sq.steering = 32;
                } else if (direction == 'Right10') {
                    sq.steering = 64;
                } else if (direction == 'Right15') {
                    sq.steering = 96;
                } else if (direction == 'Right20') {
                    sq.steering = 127;
                }
                return script.callReturn();
            },
            syntax: { js: [], py: ['Altino.steering(%1,%2)'] },
        },
        altino_rear_wheel: {
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
                        params: ['300'],
                    },
                    {
                        type: 'text',
                        params: ['300'],
                    },
                    null,
                ],
                type: 'altino_rear_wheel',
            },
            paramsKeyMap: {
                rightWheel: 0,
                leftWheel: 1,
            },
            class: 'altino_motor',
            isNotFor: ['altino'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;

                sq.rightWheel = script.getNumberValue('rightWheel');
                sq.leftWheel = script.getNumberValue('leftWheel');

                return script.callReturn();
            },
            syntax: { js: [], py: ['Altino.rear_wheel(%1, %2)'] },
        },
        altino_sound: {
            color: '#00979D',
            skeleton: 'basic',
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
                    ],
                    value: '4',
                    fontSize: 11,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ALTINO_h, 'NOT'],
                        [Lang.Blocks.ALTINO_c, 'C'],
                        [Lang.Blocks.ALTINO_c2, 'C#'],
                        [Lang.Blocks.ALTINO_d, 'D'],
                        [Lang.Blocks.ALTINO_d2, 'D#'],
                        [Lang.Blocks.ALTINO_e, 'E'],
                        [Lang.Blocks.ALTINO_f, 'F'],
                        [Lang.Blocks.ALTINO_f2, 'F#'],
                        [Lang.Blocks.ALTINO_g, 'G'],
                        [Lang.Blocks.ALTINO_g2, 'G#'],
                        [Lang.Blocks.ALTINO_a, 'A'],
                        [Lang.Blocks.ALTINO_a2, 'A#'],
                        [Lang.Blocks.ALTINO_b, 'B'],
                    ],
                    value: 'NOT',
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
                type: 'altino_sound',
            },
            paramsKeyMap: {
                OCTAVE: 0,
                NOTE: 1,
            },
            class: 'altino_display',
            isNotFor: ['altino'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var octave = script.getStringField('OCTAVE', script);
                var note = script.getStringField('NOTE', script);
                var octave_int = octave + note;

                if (note == 'NOT') sq.note = 0;
                else if (octave_int == '2C') sq.note = 13;
                else if (octave_int == '2C#') sq.note = 14;
                else if (octave_int == '2D') sq.note = 15;
                else if (octave_int == '2D#') sq.note = 16;
                else if (octave_int == '2E') sq.note = 17;
                else if (octave_int == '2F') sq.note = 18;
                else if (octave_int == '2F#') sq.note = 19;
                else if (octave_int == '2G') sq.note = 20;
                else if (octave_int == '2G#') sq.note = 21;
                else if (octave_int == '2A') sq.note = 22;
                else if (octave_int == '2A#') sq.note = 23;
                else if (octave_int == '2B') sq.note = 24;
                else if (octave_int == '3C') sq.note = 25;
                else if (octave_int == '3C#') sq.note = 26;
                else if (octave_int == '3D') sq.note = 27;
                else if (octave_int == '3D#') sq.note = 28;
                else if (octave_int == '3E') sq.note = 29;
                else if (octave_int == '3F') sq.note = 30;
                else if (octave_int == '3F#') sq.note = 31;
                else if (octave_int == '3G') sq.note = 32;
                else if (octave_int == '3G#') sq.note = 33;
                else if (octave_int == '3A') sq.note = 34;
                else if (octave_int == '3A#') sq.note = 35;
                else if (octave_int == '3B') sq.note = 36;
                else if (octave_int == '4C') sq.note = 37;
                else if (octave_int == '4C#') sq.note = 38;
                else if (octave_int == '4D') sq.note = 39;
                else if (octave_int == '4D#') sq.note = 40;
                else if (octave_int == '4E') sq.note = 41;
                else if (octave_int == '4F') sq.note = 42;
                else if (octave_int == '4F#') sq.note = 43;
                else if (octave_int == '4G') sq.note = 44;
                else if (octave_int == '4G#') sq.note = 45;
                else if (octave_int == '4A') sq.note = 46;
                else if (octave_int == '4A#') sq.note = 47;
                else if (octave_int == '4B') sq.note = 48;
                else if (octave_int == '5C') sq.note = 49;
                else if (octave_int == '5C#') sq.note = 50;
                else if (octave_int == '5D') sq.note = 51;
                else if (octave_int == '5D#') sq.note = 52;
                else if (octave_int == '5E') sq.note = 53;
                else if (octave_int == '5F') sq.note = 54;
                else if (octave_int == '5F#') sq.note = 55;
                else if (octave_int == '5G') sq.note = 56;
                else if (octave_int == '5G#') sq.note = 57;
                else if (octave_int == '5A') sq.note = 58;
                else if (octave_int == '5A#') sq.note = 59;
                else if (octave_int == '5B') sq.note = 60;
                else if (octave_int == '6C') sq.note = 61;
                else if (octave_int == '6C#') sq.note = 62;
                else if (octave_int == '6D') sq.note = 63;
                else if (octave_int == '6D#') sq.note = 64;
                else if (octave_int == '6E') sq.note = 65;
                else if (octave_int == '6F') sq.note = 66;
                else if (octave_int == '6F#') sq.note = 67;
                else if (octave_int == '6G') sq.note = 68;
                else if (octave_int == '6G#') sq.note = 69;
                else if (octave_int == '6A') sq.note = 70;
                else if (octave_int == '6A#') sq.note = 71;
                else if (octave_int == '6B') sq.note = 72;
                else if (octave_int == '7C') sq.note = 73;
                else if (octave_int == '7C#') sq.note = 74;
                else if (octave_int == '7D') sq.note = 75;
                else if (octave_int == '7D#') sq.note = 76;
                else if (octave_int == '7E') sq.note = 77;
                else if (octave_int == '7F') sq.note = 78;
                else if (octave_int == '7F#') sq.note = 79;
                else if (octave_int == '7G') sq.note = 80;
                else if (octave_int == '7G#') sq.note = 81;
                else if (octave_int == '7A') sq.note = 82;
                else if (octave_int == '7A#') sq.note = 83;
                else if (octave_int == '7B') sq.note = 84;
                return script.callReturn();
            },
            syntax: { js: [], py: ['Altino.sound(%1, %2)'] },
        },
        altino_light: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ALTINO_Led_Forward_Light, '2'],
                        [Lang.Blocks.ALTINO_Led_Reverse_Light, '3'],
                        [Lang.Blocks.ALTINO_Led_Brake_Light, '4'],
                        [Lang.Blocks.ALTINO_Led_Turn_Left_Light, '5'],
                        [Lang.Blocks.ALTINO_Led_Turn_Right_Light, '6'],
                    ],
                    value: '2',
                    fontSize: 11,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ALTINO_h2, '255'],
                        [Lang.Blocks.ALTINO_h, '0'],
                    ],
                    value: '255',
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
                type: 'altino_light',
            },
            paramsKeyMap: {
                SELECT: 0,
                ONOFF: 1,
            },
            class: 'altino_display',
            isNotFor: ['altino'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var select = script.getStringField('SELECT', script);
                var onoff = script.getStringField('ONOFF', script);

                if (select == '2' && onoff == '255') {
                    sq.led = sq.led | 0x03;
                } else if (select == '2' && onoff == '0') {
                    sq.led = sq.led & 0xfc;
                }

                if (select == '3' && onoff == '255') {
                    sq.led = sq.led | 0x0c;
                } else if (select == '3' && onoff == '0') {
                    sq.led = sq.led & 0xf3;
                }

                if (select == '4' && onoff == '255') {
                    sq.led2 = sq.led2 | 0xc1;
                } else if (select == '4' && onoff == '0') {
                    sq.led2 = sq.led2 & 0x3f;
                }

                if (select == '5' && onoff == '255') {
                    sq.led = sq.led | 0xa0;
                } else if (select == '5' && onoff == '0') {
                    sq.led = sq.led & 0x5f;
                }

                if (select == '6' && onoff == '255') {
                    sq.led = sq.led | 0x50;
                } else if (select == '6' && onoff == '0') {
                    sq.led = sq.led & 0xaf;
                }

                //sq.led = 0xff;
                return script.callReturn();
            },
            syntax: { js: [], py: ['Altino.light(%1, %2)'] },
        },
        altino_dot_display: {
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
                        params: ['A'],
                    },
                    null,
                ],
                type: 'altino_dot_display',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'altino_display',
            isNotFor: ['altino'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var str = script.getStringValue('VALUE');
                sq.ascii = str.charCodeAt(0);

                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Altino.dot_display(%1)',
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
        altino_dot_display_line: {
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
                        params: ['0xff'],
                    },
                    {
                        type: 'text',
                        params: ['0xff'],
                    },
                    {
                        type: 'text',
                        params: ['0xff'],
                    },
                    {
                        type: 'text',
                        params: ['0xff'],
                    },
                    {
                        type: 'text',
                        params: ['0xff'],
                    },
                    {
                        type: 'text',
                        params: ['0xff'],
                    },
                    {
                        type: 'text',
                        params: ['0xff'],
                    },
                    {
                        type: 'text',
                        params: ['0xff'],
                    },
                    null,
                ],
                type: 'altino_dot_display_line',
            },
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
                VALUE3: 2,
                VALUE4: 3,
                VALUE5: 4,
                VALUE6: 5,
                VALUE7: 6,
                VALUE8: 7,
            },
            class: 'altino_display',
            isNotFor: ['altino'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                sq.ascii = 0;
                sq.dot1 = script.getNumberValue('VALUE1');
                sq.dot2 = script.getNumberValue('VALUE2');
                sq.dot3 = script.getNumberValue('VALUE3');
                sq.dot4 = script.getNumberValue('VALUE4');
                sq.dot5 = script.getNumberValue('VALUE5');
                sq.dot6 = script.getNumberValue('VALUE6');
                sq.dot7 = script.getNumberValue('VALUE7');
                sq.dot8 = script.getNumberValue('VALUE8');

                return script.callReturn();
            },
        },
        //endregion Altino 알티노
    };
};
