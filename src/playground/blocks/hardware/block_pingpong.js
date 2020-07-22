'use strict';

const Buffer = require('buffer').Buffer;

Entry.PingpongG1 = new (class PingpongG1 {
    constructor() {
        this.id = '35.1';
        this.name = 'PingpongG1';
        this.url = 'https://www.roborisen.com';
        this.imageName = 'pingpong_g1.png';
        this.delayTime = 50;
        this.title = {
            ko: '핑퐁 G1',
            en: 'Pingpong G1',
        };
        this.communicationType = 'manual';

        this.TILT_THRESHOLD = 20;
        this.MOVE_THRESHOLD = 30;
        this.send_cmd_id = 0;

        this.sensor_data = {
            MOVE_X: 0,
            MOVE_Y: 0,
            MOVE_Z: 0,
            TILT_X: 0,
            TILT_Y: 0,
            TILT_Z: 0,
            BUTTON: 0,
            PROXIMITY: 0,
            AIN: 0,
        };
        this.prev_sensor_data = {
            MOVE_X: 0,
            MOVE_Y: 0,
            MOVE_Z: 0,
            TILT_X: 0,
            TILT_Y: 0,
            TILT_Z: 0,
            BUTTON: 0,
            PROXIMITY: 0,
            AIN: 0,
        };

        this.blockMenuBlocks = [
            'pingpong_g1_when_button_pressed',
            'pingpong_g1_is_button_pressed',
            'pingpong_g1_when_tilted',
            'pingpong_g1_is_tilted',
            'pingpong_g1_get_tilt_value',
            'pingpong_g1_is_top_shape',
            'pingpong_g1_get_sensor_value',
            'pingpong_g1_motor_rotate',
            'pingpong_g1_start_motor_rotate',
            'pingpong_g1_stop_motor_rotate',
            'pingpong_g1_rotate_servo_mortor',
            'pingpong_g1_set_dot_pixel',
            'pingpong_g1_set_dot_string',
            'pingpong_g1_set_dot_clear',
            'pingpong_g1_playNoteForBeats',
            'pingpong_g1_restForBeats',
            'pingpong_g1_setTempo',
            'pingpong_g1_getTempo',
        ];

        this.tempo = 60;
    }

    setZero() {
        // all LED clear
        this.sendCommand(this.makePacket(0xa2, 0xe3, [0x70, 1, 0, ' ']));
        setTimeout(() => {
            // all cube stop
            this.sendCommand(this.makePacket(0xcc, 0x0004, [2, 0, 0, 1, 0, 0]));
            setTimeout(() => {
                Entry.hw.sendQueue.COMMAND = {
                    id: -1,
                };
                Entry.hw.update();

                this.send_cmd_id = 0;
            }, this.delayTime);
        }, this.delayTime);
    }

    sendCommand(packet) {
        Entry.hw.sendQueue.COMMAND = {
            id: ++this.send_cmd_id,
            data: packet,
        };
        Entry.hw.update();
    }

    afterReceive(pd) {
        //this.sensor_data = pd.SENSOR;

        if (!Entry.engine.isState('run')) {
            return;
        }

        if (this.prev_sensor_data.BUTTON != pd.BUTTON) {
            //console.log('Button:', this.prev_sensor_data.BUTTON, pd.BUTTON);
            this.prev_sensor_data.BUTTON = pd.BUTTON;
            Entry.engine.fireEvent('pp_when_button_pressed');
        }

        if (
            Math.abs(pd.TILT_X) >= this.TILT_THRESHOLD ||
            Math.abs(pd.TILT_Y) >= this.TILT_THRESHOLD
        ) {
            Entry.engine.fireEvent('pp_when_tilted');
        }
    }

    postCallReturn(script, myfunc) {
        if (myfunc == undefined) {
            return script.callReturn();
        }

        if (script.is_start == undefined) {
            script.is_start = true;

            const [packet, waitTime = this.delayTime] = myfunc();

            if (packet && packet.length > 0) {
                this.sendCommand(packet);
            }

            setTimeout(() => {
                script.is_start = false;
            }, waitTime);
            return script;
        } else if (script.is_start == true) {
            return script;
        } else {
            delete script.is_start;

            return script.callReturn();
        }
    }

    _clampBeats(beats) {
        return Math.min(Math.max(beats, 0), 40);
        //return MathUtil.clamp(beats, 0, 40);
    }

    _clampTempo(tempo) {
        return Math.min(Math.max(tempo, 20), 500);
        //return MathUtil.clamp(tempo, 20, 500);
    }

    _beatsToDuration(beats) {
        let duration = Math.round((60 / this.tempo) * beats * 100);
        return duration;
    }

    makePacket(opcode, taskid, opt) {
        // make heder - cubeid, cubecnt, op, size, method
        const header = Buffer.from([0xff, 0xff, 0xff, 0xff, 0, 0, opcode, 0, 0]);
        const property = Buffer.from(opt);

        //header.writeUInt16BE(0xFFFF, 0);
        //header.writeUInt16BE(0xFFFF, 2);	// cubdid

        header.writeUInt16BE(taskid, 4);
        header.writeUInt16BE(header.length + property.length, 7);

        return Buffer.concat([header, property]);
    }

    getBlocks() {
        return {
            pingpong_g1_when_button_pressed: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_event',
                statements: [],
                params: [
                    {
                        type: 'Indicator',
                        img: 'block_icon/start_icon_hardware.svg',
                        size: 14,
                        position: { x: 0, y: -2 },
                    },
                ],
                events: {},
                def: {
                    params: [],
                    type: 'pingpong_g1_when_button_pressed',
                },
                class: 'PingpongG1',
                isNotFor: ['PingpongG1'],
                event: 'pp_when_button_pressed',
                func(sprite, script) {
                    const buttonData = Entry.hw.portData.BUTTON;

                    if (buttonData != 1) {
                        return this.die();
                    }
                    return script.callReturn();
                },
            },
            pingpong_g1_when_tilted: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_event',
                statements: [],
                params: [
                    {
                        type: 'Indicator',
                        img: 'block_icon/start_icon_hardware.svg',
                        size: 14,
                        position: { x: 0, y: -2 },
                    },
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks.pingpong_opts_cube_tiltDir,
                        value: 'F_CIRCLE',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                def: {
                    params: [null],
                    type: 'pingpong_g1_when_tilted',
                },
                paramsKeyMap: {
                    TILT_DIR: 1,
                },
                class: 'PingpongG1',
                isNotFor: ['PingpongG1'],
                event: 'pp_when_tilted',
                func(sprite, script) {
                    const tiltDir = script.getStringField('TILT_DIR');
                    const pd = Entry.hw.portData;

                    let tiltValue = 0;
                    switch (tiltDir) {
                        case 'F_CIRCLE':
                            tiltValue = pd.TILT_X * -1;
                            break;
                        case 'B_TRIANGLE':
                            tiltValue = pd.TILT_X;
                            break;
                        case 'L_RECTANGLE':
                            tiltValue = pd.TILT_Y * -1;
                            break;
                        case 'R_STAR':
                            tiltValue = pd.TILT_Y;
                            break;
                        default:
                            break;
                    }

                    if (tiltValue >= Entry.PingpongG1.TILT_THRESHOLD) {
                        return script.callReturn();
                    } else {
                        return this.die();
                    }
                },
            },
            pingpong_g1_is_button_pressed: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_boolean_field',
                //statements: [],
                //params: [],
                //events: {},
                def: {
                    type: 'pingpong_g1_is_button_pressed',
                },
                //paramsKeyMap: { },
                class: 'PingpongG1',
                isNotFor: ['PingpongG1'],
                func(sprite, script) {
                    const pd = Entry.hw.portData;
                    //return Entry.PingpongG1.sensor_data.BUTTON == 1;
                    return pd.BUTTON == 1;
                },
            },
            pingpong_g1_is_tilted: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_boolean_field',
                //statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks.pingpong_opts_cube_tiltDir,
                        value: 'F_CIRCLE',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                //events: {},
                def: { params: [], type: 'pingpong_g1_is_tilted' },
                paramsKeyMap: {
                    TILT_DIR: 0,
                },
                class: 'PingpongG1',
                isNotFor: ['PingpongG1'],
                func(sprite, script) {
                    const tiltDir = script.getStringField('TILT_DIR', script);
                    const pd = Entry.hw.portData;
                    let tiltValue = 0;
                    switch (tiltDir) {
                        case 'F_CIRCLE':
                            tiltValue = pd.TILT_X * -1;
                            break;
                        case 'B_TRIANGLE':
                            tiltValue = pd.TILT_X;
                            break;
                        case 'L_RECTANGLE':
                            tiltValue = pd.TILT_Y * -1;
                            break;
                        case 'R_STAR':
                            tiltValue = pd.TILT_Y;
                            break;
                        default:
                            break;
                    }
                    return tiltValue >= Entry.PingpongG1.TILT_THRESHOLD;
                },
            },
            pingpong_g1_get_tilt_value: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_string_field',
                params: [
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks.pingpong_opts_cube_tiltDir,
                        value: 'F_CIRCLE',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {
                    viewAdd: [
                        function() {
                            //console.log('... viewAdd called!');
                        },
                    ],
                    viewDestroy: [
                        function() {
                            //console.log('... viewDestroy called!');
                        },
                    ],
                    dataAdd: [
                        function(block) {
                            //console.log(' ...... dataAdd called');
                        },
                    ],
                    dataDestroy: [
                        function(block) {
                            //console.log(' ...... dataDestroy called');
                        },
                    ],
                },
                def: {
                    params: [null],
                    type: 'pingpong_g1_get_tilt_value',
                },
                paramsKeyMap: { DIR: 0 },
                class: 'PingpongG1',
                isNotFor: ['PingpongG1'],
                func(sprite, script) {
                    const dir = script.getStringField('DIR', script);
                    const pd = Entry.hw.portData;
                    let value = 0;
                    switch (dir) {
                        case 'F_CIRCLE':
                            value = pd.TILT_X * -1;
                            break;
                        case 'B_TRIANGLE':
                            value = pd.TILT_X;
                            break;
                        case 'L_RECTANGLE':
                            value = pd.TILT_Y * -1;
                            break;
                        case 'R_STAR':
                            value = pd.TILT_Y;
                            break;
                        default:
                            break;
                    }
                    return value;
                },
            },
            pingpong_g1_get_sensor_value: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_string_field',
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.pingpong_sensor_proximity, 'PROXIMITY'],
                            [Lang.Blocks.pingpong_sensor_ain, 'AIN'],
                        ],
                        value: 'PROXIMITY',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                def: { params: [], type: 'pingpong_g1_get_sensor_value' },
                paramsKeyMap: { SENSOR: 0 },
                class: 'PingpongG1',
                isNotFor: ['PingpongG1'],
                func(sprite, script) {
                    const sensorType = script.getStringField('SENSOR', script);
                    const pd = Entry.hw.portData;
                    let value = 0;
                    switch (sensorType) {
                        case 'PROXIMITY':
                            value = pd.PROXIMITY;
                            break;
                        case 'AIN':
                            value = pd.AIN;
                            break;
                        default:
                            break;
                    }
                    return value;
                },
            },
            pingpong_g1_is_top_shape: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_boolean_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks.pingpong_opts_cube_dir6,
                        value: 'DF_RECTANGLE',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                def: { params: [], type: 'pingpong_g1_is_top_shape' },
                paramsKeyMap: {
                    TILT_DIR: 0,
                },
                class: 'PingpongG1',
                isNotFor: ['PingpongG1'],
                func(sprite, script) {
                    const tiltDir = script.getStringField('TILT_DIR', script);
                    const pd = Entry.hw.portData;
                    if (tiltDir == 'DF_RECTANGLE' && pd.TILT_Y > 70) return true;
                    if (tiltDir == 'DB_STAR' && pd.TILT_Y < -70) return true;
                    if (tiltDir == 'DR_CIRCLE' && pd.TILT_X > 70) return true;
                    if (tiltDir == 'DL_TRIANGLE' && pd.TILT_X < -70) return true;
                    if (tiltDir == 'DD_NONE' && pd.TILT_Z > 70) return true;
                    if (tiltDir == 'DU_HEART' && pd.TILT_Z < -70) return true;
                    return false;
                },
            },
            pingpong_g1_motor_rotate: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                //statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.pingpong_rotate_cw, 'RIGHT'],
                            [Lang.Blocks.pingpong_rotate_ccw, 'LEFT'],
                        ],
                        value: 'RIGHT',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
                ],
                //events: {},
                def: {
                    params: [
                        null,
                        {
                            type: 'number',
                            params: ['10'],
                        },
                    ],
                    type: 'pingpong_g1_motor_rotate',
                },
                paramsKeyMap: { DIR: 0, DEGREE: 1 },
                class: 'PingpongG1_motor',
                isNotFor: ['PingpongG1'],
                func(sprite, script) {
                    return Entry.PingpongG1.postCallReturn(script, () => {
                        const dir = script.getStringField('DIR');
                        let degree = script.getNumberValue('DEGREE');

                        let speed = 800;
                        if (dir == 'LEFT') {
                            speed *= -1;
                        }

                        degree = Math.min(Math.max(degree, 0), 5000);

                        let step = Math.round(degree * 5.5);
                        if (step > 32768) {
                            step = 32768;
                        }

                        const opt = [2, 1, 0, 2, 0, 0, 0, 0, 0, 0];
                        const packet = Entry.PingpongG1.makePacket(0xc1, 0x0004, opt); // SETP_MOTOR

                        packet.writeInt16BE(speed, 13);
                        packet.writeUInt16BE(step, 17);

                        const waitTime = Math.round(((1100 - Math.abs(speed)) / 99) * step) + 400;
                        return [packet, waitTime];
                    });
                },
            },

            pingpong_g1_start_motor_rotate: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                def: {
                    params: [
                        {
                            type: 'number',
                            params: ['100'],
                        },
                    ],
                    type: 'pingpong_g1_start_motor_rotate',
                },
                paramsKeyMap: { SPEED: 0 },
                class: 'PingpongG1_motor',
                isNotFor: ['PingpongG1'],
                func(sprite, script) {
                    return Entry.PingpongG1.postCallReturn(script, () => {
                        let speed = script.getNumberValue('SPEED');
                        if (speed > 100) {
                            speed = 100;
                        }
                        if (speed < -100) {
                            speed = -100;
                        }

                        let sps = 0;
                        if (speed != 0) {
                            if (speed < 0) {
                                sps = 65536 + (speed * 9 - 100);
                            } else {
                                sps = speed * 9 + 100;
                            }
                            sps = Math.round(sps);
                        }

                        const opt = [2, 0, 0, 2, sps / 256, sps % 256];
                        const packet = Entry.PingpongG1.makePacket(0xcc, 0x0004, opt);
                        //packet.writeInt16BE(sps, 13);

                        const waitTime = Math.round(((1100 - Math.abs(sps)) / 99) * 10) + 400;
                        return [packet, waitTime];
                    });
                },
            },
            pingpong_g1_stop_motor_rotate: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                params: [
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                def: {
                    params: [],
                    type: 'pingpong_g1_stop_motor_rotate',
                },
                paramsKeyMap: {},
                class: 'PingpongG1_motor',
                isNotFor: ['PingpongG1'],
                func(sprite, script) {
                    return Entry.PingpongG1.postCallReturn(script, () => {
                        const opt = [2, 0, 0, 1, 0, 0];
                        const packet = Entry.PingpongG1.makePacket(0xcc, 0x0004, opt);
                        return [packet];
                    });
                },
            },

            pingpong_g1_rotate_servo_mortor: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                //statements: [],
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                //events: {},
                def: { params: [{ type: 'angle' }], type: 'pingpong_g1_rotate_servo_mortor' },
                paramsKeyMap: { DEGREE: 0 },
                class: 'PingpongG1_motor',
                isNotFor: ['PingpongG1'],
                func(sprite, script) {
                    return Entry.PingpongG1.postCallReturn(script, () => {
                        let angle = script.getNumberValue('DEGREE', script);

                        angle = Math.min(Math.max(angle, 0), 180);

                        const packet = Entry.PingpongG1.makePacket(0xe1, 0x00, [2, 0, angle, 1]);
                        return [packet, 400];
                    });
                },
            },

            pingpong_g1_set_dot_pixel: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                //statements: [],
                params: [
                    { type: 'Block', accept: 'string', defaultType: 'number', value: '0' },
                    { type: 'Block', accept: 'string', defaultType: 'number', value: '0' },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.pingpong_dot_on, 1],
                            [Lang.Blocks.pingpong_dot_off, 0],
                        ],
                        value: 1,
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
                //events: {},
                def: {
                    params: [null, null, null],
                    type: 'pingpong_g1_set_dot_pixel',
                },
                paramsKeyMap: { X: 0, Y: 1, onoff: 2 },
                class: 'PingpongG1_peripheral_LED',
                isNotFor: ['PingpongG1'],
                func(sprite, script) {
                    return Entry.PingpongG1.postCallReturn(script, () => {
                        let dotX = script.getNumberValue('X', script);
                        let dotY = script.getNumberValue('Y', script);
                        const onoff = script.getNumberField('onoff', script);

                        dotX = Math.min(Math.max(dotX, 0), 7);
                        dotY = Math.min(Math.max(dotY, 0), 7);

                        const packet = Entry.PingpongG1.makePacket(0xa2, 0xe1, [
                            0x70,
                            dotY,
                            dotX,
                            onoff,
                        ]); // turn on
                        return [packet];
                    });
                },
            },
            pingpong_g1_set_dot_string: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                //statements: [],
                params: [
                    { type: 'Block', accept: 'string', value: 'Hello!' },
                    { type: 'Block', accept: 'string', defaultType: 'number', value: '2' },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                //events: {},
                def: { params: [null, null], type: 'pingpong_g1_set_dot_string' },
                paramsKeyMap: { STR: 0, DURATION: 1 },
                class: 'PingpongG1_peripheral_LED',
                isNotFor: ['PingpongG1'],
                func(sprite, script) {
                    return Entry.PingpongG1.postCallReturn(script, () => {
                        const str = script.getStringValue('STR', script);
                        const duration = script.getNumberValue('DURATION', script);

                        let period = Math.round((duration * 100) / (str.length * 8));
                        period = Math.min(Math.max(period, 1), 200);

                        const opt = Buffer.concat([
                            Buffer.from([0x70, period, 0]),
                            Buffer.from(str.substring(0, 20)),
                        ]);

                        const packet = Entry.PingpongG1.makePacket(0xa2, 0xe3, opt);
                        const waitTime = period * str.length * 8 * 10 + 400; // add wait for 400ms
                        return [packet, waitTime];
                    });
                },
            },
            pingpong_g1_set_dot_clear: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                //statements: [],
                params: [
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                //events: {},
                def: { params: [], type: 'pingpong_g1_set_dot_clear' },
                paramsKeyMap: {},
                class: 'PingpongG1_peripheral_LED',
                isNotFor: ['PingpongG1'],
                func(sprite, script) {
                    return Entry.PingpongG1.postCallReturn(script, () => {
                        const packet = Entry.PingpongG1.makePacket(0xa2, 0xe3, [0x70, 1, 0, ' ']);
                        return [packet, 400];
                    });
                },
            },
            pingpong_g1_playNoteForBeats: {
                //'%1 번 음을 %2 박자로 연주하기 %3',
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks.pingpong_opts_music_notes,
                        value: 48,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    { type: 'Block', accept: 'string', defaultType: 'number', value: '1' },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                def: { params: [], type: 'pingpong_g1_playNoteForBeats' },
                paramsKeyMap: { NOTE: 0, BEATS: 1 },
                class: 'PingpongG1_Music',
                isNotFor: ['PingpongG1'],
                func(sprite, script) {
                    return Entry.PingpongG1.postCallReturn(script, () => {
                        const NOTE = script.getNumberField('NOTE', script);
                        const BEATS = script.getNumberValue('BEATS', script);

                        const cBeats = Entry.PingpongG1._clampBeats(BEATS);
                        const durationSec = Entry.PingpongG1._beatsToDuration(cBeats);

                        const waitTime = durationSec * 10 + 30; //XXX
                        const opt = [0, 0x00 /*PLAY*/, NOTE - 8, durationSec, 0]; //type 1??
                        //const opt = [0, 0x00/*PLAY*/, note-8, 0, durationSec];	//type 2
                        const packet = Entry.PingpongG1.makePacket(0xe8, 0xa1, opt);

                        return [packet, waitTime];
                    });
                },
            },
            pingpong_g1_restForBeats: {
                //'%1 박자 쉬기 %2',
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                params: [
                    { type: 'Block', accept: 'string', defaultType: 'number', value: '1' },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                def: { params: [], type: 'pingpong_g1_restForBeats' },
                paramsKeyMap: { BEATS: 0 },
                class: 'PingpongG1_Music',
                isNotFor: ['PingpongG1'],
                func(sprite, script) {
                    return Entry.PingpongG1.postCallReturn(script, () => {
                        const BEATS = script.getNumberValue('BEATS', script);

                        const cBeats = Entry.PingpongG1._clampBeats(BEATS);
                        const durationSec = Entry.PingpongG1._beatsToDuration(cBeats);

                        const waitTime = durationSec * 10 + 30;

                        return [null, waitTime];
                    });
                },
            },
            pingpong_g1_setTempo: {
                //'악보 빠르기를 %1 으로 정하기 %2',
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                params: [
                    { type: 'Block', accept: 'string', defaultType: 'number', value: '60' },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                def: { params: [], type: 'pingpong_g1_setTempo' },
                paramsKeyMap: { TEMPO: 0 },
                class: 'PingpongG1_Music',
                isNotFor: ['PingpongG1'],
                func(sprite, script) {
                    let tempo = script.getNumberValue('TEMPO', script);
                    Entry.PingpongG1.tempo = Entry.PingpongG1._clampTempo(tempo);
                    //console.log('SET TEMPO = ', tempo, Entry.PingpongG1.tempo);
                    return script.callReturn();
                },
            },
            pingpong_g1_getTempo: {
                //'악보 빠르기',
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_string_field',
                params: [],
                def: { params: [], type: 'pingpong_g1_getTempo' },
                paramsKeyMap: {},
                class: 'PingpongG1_Music',
                isNotFor: ['PingpongG1'],
                func(sprite, script) {
                    return Entry.PingpongG1.tempo;
                },
            },
        };
    }

    setLanguage() {
        return {
            ko: {
                template: {
                    pingpong_g1_when_button_pressed: '%1 큐브 버튼을 눌렀을 때',
                    pingpong_g1_when_tilted: '%1 큐브를 %2 방향으로 기울였을 때',
                    pingpong_g1_is_button_pressed: '큐브 버튼이 눌렸는가?',
                    pingpong_g1_is_tilted: '큐브가 %1 방향으로 기울어졌는가?',
                    pingpong_g1_get_tilt_value: '%1 방향 큐브 기울기',
                    pingpong_g1_get_sensor_value: '%1 센서값',
                    pingpong_g1_motor_rotate: '모터를 %1 방향으로 %2 도 회전하기 %3',
                    pingpong_g1_start_motor_rotate: '모터의 속도를 %1으로 계속 회전하기 %2',
                    pingpong_g1_stop_motor_rotate: '모터 멈추기 %1',
                    pingpong_g1_rotate_servo_mortor: '서보모터를 %1도로 설정하기 %2',
                    pingpong_g1_is_top_shape: '큐브 윗면에 %1 모양이 있는가?',
                    pingpong_g1_set_dot_pixel: '도트 X:%1 Y:%2 %3 %4',
                    pingpong_g1_set_dot_string: '도트에 문자열 %1  %2초동안 출력 %3',
                    pingpong_g1_set_dot_clear: '도트 화면 지우기 %1',
                    pingpong_g1_playNoteForBeats: '%1 음을 %2 박자로 연주하기 %3',
                    pingpong_g1_restForBeats: '%1 박자 쉬기 %2',
                    pingpong_g1_setTempo: '악보 빠르기를 %1 으로 정하기 %2',
                    pingpong_g1_getTempo: '악보 빠르기',
                },
                Blocks: {
                    pingpong_right: '오른쪽',
                    pingpong_left: '왼쪽',

                    pingpong_rotate_cw: '시계',
                    pingpong_rotate_ccw: '반시계',

                    pingpong_sensor_proximity: '근접',
                    pingpong_sensor_ain: '아날로그',
                    pingpong_dot_on: '켜기',
                    pingpong_dot_off: '끄기',

                    pingpong_opts_cube_tiltDir: [
                        ['동그라미', 'F_CIRCLE'],
                        ['세모', 'B_TRIANGLE'],
                        ['네모', 'L_RECTANGLE'],
                        ['별', 'R_STAR'],
                    ],

                    pingpong_opts_cube_dir6: [
                        ['네모', 'DF_RECTANGLE'],
                        ['별', 'DB_STAR'],
                        ['세모', 'DL_TRIANGLE'],
                        ['동그라미', 'DR_CIRCLE'],
                        ['하트', 'DU_HEART'],
                        ['빈칸', 'DD_NONE'],
                    ],

                    pingpong_opts_music_notes: [
                        ['라  (A3)', 45],
                        ['라# (A3#)', 46],
                        ['시  (B3)', 47],
                        ['도  (C4)', 48],
                        ['도# (C4#)', 49],
                        ['레  (D4)', 50],
                        ['레# (D4#)', 51],
                        ['미  (E4)', 52],
                        ['파  (F4)', 53],
                        ['파# (F4#)', 54],
                        ['솔  (G4)', 55],
                        ['솔# (G4#)', 56],
                        ['라  (A4)', 57],
                        ['라# (A4#)', 58],
                        ['시  (B4)', 59],
                        ['도  (C5)', 60],
                        ['도# (C5#)', 61],
                        ['레  (D5)', 62],
                        ['레# (D5#)', 63],
                        ['미  (E5)', 64],
                        ['파  (F5)', 65],
                        ['파# (F5#)', 66],
                        ['솔  (G5)', 67],
                        ['솔# (G5#)', 68],
                        ['라  (A5)', 69],
                        ['라# (A5#)', 70],
                        ['시  (B5)', 71],
                        ['도  (C6)', 72],
                    ],
                },
            },
            en: {
                template: {
                    pingpong_g1_when_button_pressed: '%1 Button pressed',
                    pingpong_g1_when_tilted: '%1 Tilted to %2',
                    pingpong_g1_is_button_pressed: 'button pressed?',
                    pingpong_g1_is_tilted: 'cube tilted to %1',
                    pingpong_g1_get_tilt_value: 'tilt angle to %1',
                    pingpong_g1_get_sensor_value: 'read sensor %1',
                    pingpong_g1_motor_rotate: 'rotate %2 degrees %1 %3',
                    pingpong_g1_start_motor_rotate: 'set motor speed to %1 %2',
                    pingpong_g1_stop_motor_rotate: 'stop motor rotate %1',
                    pingpong_g1_rotate_servo_mortor: 'set servo mortor to %1 degrees %2',
                    pingpong_g1_is_top_shape: '%1 shown in top view?',
                    pingpong_g1_set_dot_pixel: 'set %3 DOT X:%1 Y:%2 %4',
                    pingpong_g1_set_dot_string: 'print string %1 during %2 seconds to DOT %3',
                    pingpong_g1_set_dot_clear: 'clear DOT %1',
                    pingpong_g1_playNoteForBeats: 'play note %1 for %2 beats %3',
                    pingpong_g1_restForBeats: 'rest for %1 beats %2',
                    pingpong_g1_setTempo: 'set tempo to %1 %2',
                    pingpong_g1_getTempo: 'tempo',
                },
                Blocks: {
                    pingpong_right: 'right',
                    pingpong_left: 'left',

                    pingpong_rotate_cw: 'clockwise',
                    pingpong_rotate_ccw: 'counter clockwise',

                    pingpong_sensor_proximity: 'proximity',
                    pingpong_sensor_ain: 'ain',
                    pingpong_dot_on: 'ON',
                    pingpong_dot_off: 'OFF',

                    pingpong_opts_cube_tiltDir: [
                        ['circle', 'F_CIRCLE'],
                        ['triangle', 'B_TRIANGLE'],
                        ['rectangle', 'L_RECTANGLE'],
                        ['star', 'R_STAR'],
                    ],

                    pingpong_opts_cube_dir6: [
                        ['rectangle', 'DF_RECTANGLE'],
                        ['star', 'DB_STAR'],
                        ['triangle', 'DL_TRIANGLE'],
                        ['circle', 'DR_CIRCLE'],
                        ['heart', 'DU_HEART'],
                        ['none', 'DD_NONE'],
                    ],
                    pingpong_opts_music_notes: [
                        ['La  (A3)', 45],
                        ['La# (A3#)', 46],
                        ['Ti  (B3)', 47],
                        ['Do  (C4)', 48],
                        ['Do# (C4#)', 49],
                        ['Re  (D4)', 50],
                        ['Re# (D4#)', 51],
                        ['Mi  (E4)', 52],
                        ['Fa  (F4)', 53],
                        ['Fa# (F4#)', 54],
                        ['Sol (G4)', 55],
                        ['Sol#(G4#)', 56],
                        ['La  (A4)', 57],
                        ['La# (A4#)', 58],
                        ['Ti  (B4)', 59],
                        ['Do  (C5)', 60],
                        ['Do# (C5#)', 61],
                        ['Re  (D5)', 62],
                        ['Re# (D5#)', 63],
                        ['Mi  (E5)', 64],
                        ['Fa  (F5)', 65],
                        ['Fa# (F5#)', 66],
                        ['Sol (G5)', 67],
                        ['Sol#(G5#)', 68],
                        ['La  (A5)', 69],
                        ['La# (A5#)', 70],
                        ['Ti  (B5)', 71],
                        ['Do  (C6)', 72],
                    ],
                },
            },
        };
    }

    monitorTemplate = {
        imgPath: 'hw/pingpong_g1.png',
        width: 400,
        height: 400,
        listPorts: {
            BUTTON: {
                name: 'button',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            MOVE_X: {
                name: 'move_x',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            MOVE_Y: {
                name: 'move_y',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            MOVE_Z: {
                name: 'move_z',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            TILT_X: {
                name: 'tilt_x',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            TILT_Y: {
                name: 'tilt_y',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            TILT_Z: {
                name: 'tilt_z',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            PROXIMITY: {
                name: 'proximity',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            AIN: {
                name: 'ain',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
        },
        ports: {},
        mode: 'both',
    };
})();

module.exports = Entry.PingpongG1;
