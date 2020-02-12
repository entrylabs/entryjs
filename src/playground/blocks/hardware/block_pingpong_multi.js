'use strict';

const Buffer = require('buffer').Buffer;

const OPCODE = {
    SINGLE_STEPS: 0xc1,
    SCHEDULED_STEPS: 0xca,
    SCHEDULED_POINTS: 0xcb,
    CONTINUOUS_STEPS: 0xcc,
    AGGREGATE_STEPS: 0xcd,
    LEDMATRIX: 0xa2,
    SERVO: 0xe1,
};

const METHOD = {
    CONTINOUS: 0,
    RELATIVE_SINGLE: 1,
    ABSOLUTE_SINGLE: 2,
    SCHED_STEPS: 3,
    sCHED_POINT: 4,
};

class PingpongBase {
    constructor(cubecnt) {
        this.TILT_THRESHOLD = 20;
        this.MOVE_THRESHOLD = 30;

        this.send_cmd_id = 0;
        this.cubeCnt = cubecnt || 2;

        this.communicationType = 'manual';

        this.prev_sensor_data = {
            c0_TILT_X: false,
            c0_TILT_Y: false,
            c0_BUTTON: 0,
            c1_TILT_X: false,
            c1_TILT_Y: false,
            c1_BUTTON: 0,
            c2_TILT_X: false,
            c2_TILT_Y: false,
            c2_BUTTON: 0,
            c3_TILT_X: false,
            c3_TILT_Y: false,
            c3_BUTTON: 0,
        };

        //console.log('pingpong base constructor', cubecnt);

        this.lang_defblock = {
            ko: {
                pingpong_right: '오른쪽',
                pingpong_left: '왼쪽',
                pingpong_circle: '동그라미',
                pingpong_star: '별',
                pingpong_rectangle: '네모',
                pingpong_triangle: '세모',

                pingpong_rotate_cw: '시계',
                pingpong_rotate_ccw: '반시계',

                pingpong_sensor_proximity: '근접',
                pingpong_sensor_ain: '아날로그',
                pingpong_dot_on: '켜기',
                pingpong_dot_off: '끄기',
            },
            en: {
                pingpong_right: 'right',
                pingpong_left: 'left',
                pingpong_circle: 'circle',
                pingpong_star: 'star',
                pingpong_rectangle: 'rectangle',
                pingpong_triangle: 'triangle',

                pingpong_rotate_cw: 'clockwise',
                pingpong_rotate_ccw: 'counter clockwise',

                pingpong_sensor_proximity: 'proximity',
                pingpong_sensor_ain: 'ain',
                pingpong_dot_on: 'ON',
                pingpong_dot_off: 'OFF',
            },
        };
    }

    setZero() {
        this.send_cmd_id = 0;

        Entry.hw.sendQueue.COMMAND = {
            id: -1,
        };
        Entry.hw.update();
    }

    afterReceive(pd) {
        if (!Entry.engine.isState('run')) {
            return;
        }

        if (
            this.prev_sensor_data.c0_BUTTON != pd.c0_BUTTON ||
            this.prev_sensor_data.c1_BUTTON != pd.c1_BUTTON ||
            this.prev_sensor_data.c2_BUTTON != pd.c2_BUTTON ||
            this.prev_sensor_data.c3_BUTTON != pd.c3_BUTTON
        ) {
            Entry.engine.fireEvent('pp_when_button_pressed');

            this.prev_sensor_data.c0_BUTTON = pd.c0_BUTTON;
            this.prev_sensor_data.c1_BUTTON = pd.c1_BUTTON;
            this.prev_sensor_data.c2_BUTTON = pd.c2_BUTTON;
            this.prev_sensor_data.c3_BUTTON = pd.c3_BUTTON;
        }

        const tiltXc0 = Math.abs(pd.c0_TILT_X) >= this.TILT_THRESHOLD;
        const tiltYc0 = Math.abs(pd.c0_TILT_Y) >= this.TILT_THRESHOLD;
        const tiltXc1 = Math.abs(pd.c1_TILT_X) >= this.TILT_THRESHOLD;
        const tiltYc1 = Math.abs(pd.c1_TILT_Y) >= this.TILT_THRESHOLD;
        const tiltXc2 = Math.abs(pd.c2_TILT_X) >= this.TILT_THRESHOLD;
        const tiltYc2 = Math.abs(pd.c2_TILT_Y) >= this.TILT_THRESHOLD;
        const tiltXc3 = Math.abs(pd.c3_TILT_X) >= this.TILT_THRESHOLD;
        const tiltYc3 = Math.abs(pd.c3_TILT_Y) >= this.TILT_THRESHOLD;

        if (
            tiltXc0 != this.prev_sensor_data.c0_TILT_X ||
            tiltYc0 != this.prev_sensor_data.c0_TILT_Y ||
            tiltXc1 != this.prev_sensor_data.c1_TILT_X ||
            tiltYc1 != this.prev_sensor_data.c1_TILT_Y ||
            tiltXc2 != this.prev_sensor_data.c2_TILT_X ||
            tiltYc2 != this.prev_sensor_data.c2_TILT_Y ||
            tiltXc3 != this.prev_sensor_data.c3_TILT_X ||
            tiltYc3 != this.prev_sensor_data.c3_TILT_Y
        ) {
            Entry.engine.fireEvent('pp_when_tilted');
        }
        this.prev_sensor_data.c0_TILT_X = tiltXc0;
        this.prev_sensor_data.c0_TILT_Y = tiltYc0;
        this.prev_sensor_data.c1_TILT_X = tiltXc1;
        this.prev_sensor_data.c1_TILT_Y = tiltYc1;
        this.prev_sensor_data.c2_TILT_X = tiltXc2;
        this.prev_sensor_data.c2_TILT_Y = tiltYc2;
        this.prev_sensor_data.c3_TILT_X = tiltXc3;
        this.prev_sensor_data.c3_TILT_Y = tiltYc3;
    }

    postCallReturn(script, myfunc) {
        if (myfunc == undefined) {
            return script.callReturn();
        }

        if (script.is_start == undefined) {
            script.is_start = true;

            const [packet, waitTime = 400] = myfunc();

            if (packet.length > 0) {
                //FIXME
                Entry.hw.sendQueue.COMMAND = {
                    id: ++this.send_cmd_id,
                    data: packet,
                };
                Entry.hw.update();
            }

            setTimeout(() => {
                script.is_start = false;
            }, waitTime);
            return script;
        } else if (script.is_start == true) {
            return script;
        } else {
            delete script.is_start;

            //Entry.engine.isContinue = false;
            return script.callReturn();
        }
    }

    makePacket(opcode, taskid, cubeNo, opt) {
        // make heder   ( cubeid, cubecnt, op, size, method
        const header = Buffer.from([0xff, 0xff, 0xff, 0xff, 0, 0, opcode, 0, 0]);
        const property = Buffer.from(opt);

        //header.writeUInt16BE(0xFFFF, 0);
        //header.writeUInt16BE(0xFFFF, 2);	// cubdid

        if (cubeNo <= -1) {
            header[3] = 0xff;
        } else {
            header[3] = cubeNo;
        }

        header.writeUInt16BE(taskid, 4);
        header.writeUInt16BE(header.length + property.length, 7);

        return Buffer.concat([header, property]);
    }

    _fillPacketIntoArray(data, opcode, taskid, cubeNo, size) {
        data[0] = 0xff;
        data[1] = 0xff;
        data[2] = 0xff;

        if (cubeNo <= -1) {
            data[3] = 0xff;
        } else {
            data[3] = cubeNo;
        }

        data[4] = taskid / 256;
        data[5] = taskid % 256;

        data[6] = opcode;

        data[7] = size / 256;
        data[8] = size % 256;
    }

    makeSingleStepPacket(cubeNo, speed, degree) {
        const packet = new Uint8Array(9 + 10);

        this._fillPacketIntoArray(packet, OPCODE.SINGLE_STEPS, 0 /*cubeCnt*/, cubeNo, 19);

        const sps = this._calcSpsFromSpeed(speed);
        let step = Math.round(Math.min(Math.max(degree, 0), 360) * 5.5);
        if (step > 32768) {
            step = 32768;
        }

        packet[9] = 2; // MODE?? MULTIROLE=2, CRCHECK=3
        packet[10] = METHOD.RELATIVE_SINGLE;
        packet[11] = 0; //step_type; full=0, servo=4
        packet[12] = 2; //pause_state; PAUSE=1, RESUME=2

        packet[13] = sps / 256;
        packet[14] = sps % 256;
        packet[15] = 0;
        packet[16] = 0;
        packet[17] = step / 256;
        packet[18] = step % 256;

        const waitTime = Math.round(((1000 - Math.abs(speed) * 9) / 99) * step) + 400;

        return [packet, waitTime];
    }

    makeContStepPacket(cubeNo, cubeCnt, speed) {
        const packet = new Uint8Array(9 + 6);

        this._fillPacketIntoArray(packet, OPCODE.CONTINUOUS_STEPS, 0, cubeNo, 15);

        const sps = this._calcSpsFromSpeed(speed);

        packet[9] = 2; // MODE?? MULTIROLE=2, CRCHECK=3
        packet[10] = METHOD.CONTINOUS;
        packet[11] = 0; //step_type; full=0, servo=4
        packet[12] = 2; //pause_state; PAUSE=1, RESUME=2

        if (sps == 0) {
            packet[12] = 1;
        }

        packet[13] = sps / 256;
        packet[14] = sps % 256;

        return packet;
    }

    _getTiltValue(cubeNo, tiltDir) {
        const pd = Entry.hw.portData;
        let tiltValue = 0;

        if (cubeNo == 0) {
            if (tiltDir == 'FRONT') {
                tiltValue = pd.c0_TILT_X * -1;
            } else if (tiltDir == 'BACK') {
                tiltValue = pd.c0_TILT_X;
            } else if (tiltDir == 'LEFT') {
                tiltValue = pd.c0_TILT_Y * -1;
            } else if (tiltDir == 'RIGHT') {
                tiltValue = pd.c0_TILT_Y;
            }
        } else if (cubeNo == 1) {
            if (tiltDir == 'FRONT') {
                tiltValue = pd.c1_TILT_X * -1;
            } else if (tiltDir == 'BACK') {
                tiltValue = pd.c1_TILT_X;
            } else if (tiltDir == 'LEFT') {
                tiltValue = pd.c1_TILT_Y * -1;
            } else if (tiltDir == 'RIGHT') {
                tiltValue = pd.c1_TILT_Y;
            }
        } else if (cubeNo == 2) {
            if (tiltDir == 'FRONT') {
                tiltValue = pd.c2_TILT_X * -1;
            } else if (tiltDir == 'BACK') {
                tiltValue = pd.c2_TILT_X;
            } else if (tiltDir == 'LEFT') {
                tiltValue = pd.c2_TILT_Y * -1;
            } else if (tiltDir == 'RIGHT') {
                tiltValue = pd.c2_TILT_Y;
            }
        } else if (cubeNo == 3) {
            if (tiltDir == 'FRONT') {
                tiltValue = pd.c3_TILT_X * -1;
            } else if (tiltDir == 'BACK') {
                tiltValue = pd.c3_TILT_X;
            } else if (tiltDir == 'LEFT') {
                tiltValue = pd.c3_TILT_Y * -1;
            } else if (tiltDir == 'RIGHT') {
                tiltValue = pd.c3_TILT_Y;
            }
        }

        return tiltValue;
    }

    _getCubeNoFromBlock(script) {
        let cubeNo = script.getNumberValue('cubeno') - 1;
        if (cubeNo < 0) {
            cubeNo = 0;
        }
        if (cubeNo >= this.cubeCnt) {
            cubeNo = this.cubeCnt - 1;
        }
        return cubeNo;
    }

    _calcSpsFromSpeed(speed_) {
        let speed = speed_;
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
        return sps;
    }
}

Entry.Pingpong_G2 = new (class extends PingpongBase {
    constructor() {
        super(2);

        this.id = '35.2';
        this.name = 'Pingpong_G2';
        this.url = 'https://www.roborisen.com';
        this.imageName = 'pingpong_g2.png';
        this.title = {
            ko: '핑퐁 G2',
            en: 'Pingpong G2',
        };
        this.blockMenuBlocks = [
            'pingpong_g2_when_button_pressed',
            'pingpong_g2_when_tilted',
            'pingpong_g2_is_button_pressed',
            'pingpong_g2_is_tilted',
            'pingpong_g2_get_tilt_value',
            'pingpong_g2_get_sensor_value',
            'pingpong_g2_multi_motor_rotate',
            'pingpong_g2_motor_rotate',
            'pingpong_g2_start_multi_motor_rotate',
            'pingpong_g2_start_motor_rotate',
            'pingpong_g2_stop_motor_rotate',
            'pingpong_g2_rotate_servo_mortor',
            'pingpong_g2_set_dot_pixel',
            'pingpong_g2_set_dot_string',
            'pingpong_g2_set_dot_clear',
        ];
    }

    getBlocks() {
        return {
            pingpong_g2_when_button_pressed: {
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
                        options: Lang.Blocks.pingpong_g2_cube_id,
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                def: {
                    params: [null],
                    type: 'pingpong_g2_when_button_pressed',
                },
                paramsKeyMap: {
                    CUBEID: 1,
                },
                class: 'Pingpong_G2',
                isNotFor: ['Pingpong_G2'],
                event: 'pp_when_button_pressed',
                func(sprite, script) {
                    const cubeId = script.getNumberField('CUBEID');
                    const pd = Entry.hw.portData;

                    if ((cubeId == 0 && pd.c0_BUTTON == 1) || (cubeId == 1 && pd.c1_BUTTON == 1)) {
                        return script.callReturn();
                    }
                    return this.die();
                },
            },
            pingpong_g2_when_tilted: {
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
                        options: Lang.Blocks.pingpong_g2_cube_id,
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.pingpong_circle, 'FRONT'],
                            [Lang.Blocks.pingpong_triangle, 'BACK'],
                            [Lang.Blocks.pingpong_rectangle, 'LEFT'],
                            [Lang.Blocks.pingpong_star, 'RIGHT'],
                        ],
                        value: 'FRONT',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                def: {
                    params: [null, null],
                    type: 'pingpong_g2_when_tilted',
                },
                paramsKeyMap: {
                    CUBEID: 1,
                    TILT_DIR: 2,
                },
                class: 'Pingpong_G2',
                isNotFor: ['Pingpong_G2'],
                event: 'pp_when_tilted',
                func(sprite, script) {
                    const cubeId = script.getNumberField('CUBEID');
                    const tiltDir = script.getStringField('TILT_DIR');

                    const tiltValue = Entry.Pingpong_G2._getTiltValue(cubeId, tiltDir);
                    if (tiltValue >= Entry.Pingpong_G2.TILT_THRESHOLD) {
                        return script.callReturn();
                    }

                    return this.die();
                },
            },
            pingpong_g2_is_button_pressed: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_boolean_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks.pingpong_g2_cube_id,
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                def: {
                    params: [null],
                    type: 'pingpong_g2_is_button_pressed',
                },
                paramsKeyMap: {
                    CUBEID: 0,
                },
                class: 'Pingpong_G2',
                isNotFor: ['Pingpong_G2'],
                func(sprite, script) {
                    const cubeId = script.getNumberField('CUBEID');
                    const pd = Entry.hw.portData;

                    return (cubeId == 0 && pd.c0_BUTTON == 1) || (cubeId == 1 && pd.c1_BUTTON == 1);
                },
            },
            pingpong_g2_is_tilted: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_boolean_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks.pingpong_g2_cube_id,
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.pingpong_circle, 'FRONT'],
                            [Lang.Blocks.pingpong_triangle, 'BACK'],
                            [Lang.Blocks.pingpong_rectangle, 'LEFT'],
                            [Lang.Blocks.pingpong_star, 'RIGHT'],
                        ],
                        value: 'FRONT',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                def: { params: [], type: 'pingpong_g2_is_tilted' },
                paramsKeyMap: {
                    CUBEID: 0,
                    TILT_DIR: 1,
                },
                class: 'Pingpong_G2',
                isNotFor: ['Pingpong_G2'],
                func(sprite, script) {
                    const cubeId = script.getNumberField('CUBEID');
                    const tiltDir = script.getStringField('TILT_DIR', script);

                    const tiltValue = Entry.Pingpong_G2._getTiltValue(cubeId, tiltDir);

                    return tiltValue >= Entry.Pingpong_G2.TILT_THRESHOLD;
                },
            },
            pingpong_g2_get_tilt_value: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_string_field',
                params: [
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks.pingpong_g2_cube_id,
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.pingpong_circle, 'FRONT'],
                            [Lang.Blocks.pingpong_triangle, 'BACK'],
                            [Lang.Blocks.pingpong_rectangle, 'LEFT'],
                            [Lang.Blocks.pingpong_star, 'RIGHT'],
                        ],
                        value: 'FRONT',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                def: {
                    params: [null],
                    type: 'pingpong_g2_get_tilt_value',
                },
                paramsKeyMap: { CUBEID: 0, DIR: 1 },
                class: 'Pingpong_G2',
                isNotFor: ['Pingpong_G2'],
                func(sprite, script) {
                    const cubeId = script.getNumberField('CUBEID');
                    const tiltDir = script.getStringField('DIR', script);

                    return Entry.Pingpong_G2._getTiltValue(cubeId, tiltDir);
                },
            },
            pingpong_g2_get_sensor_value: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_string_field',
                params: [
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks.pingpong_g2_cube_id,
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
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
                def: { params: [], type: 'pingpong_g2_get_sensor_value' },
                paramsKeyMap: { CUBEID: 0, SENSOR: 1 },
                class: 'Pingpong_G2',
                isNotFor: ['Pingpong_G2'],
                func(sprite, script) {
                    const cubeId = script.getNumberField('CUBEID');
                    const sensorType = script.getStringField('SENSOR', script);
                    const pd = Entry.hw.portData;
                    let value = 0;

                    if (sensorType == 'PROXIMITY') {
                        if (cubeId == 0) {
                            value = pd.c0_PROXIMITY;
                        } else if (cubeId == 1) {
                            value = pd.c1_PROXIMITY;
                        }
                    } else if (sensorType == 'AIN') {
                        if (cubeId == 0) {
                            value = pd.c0_AIN;
                        } else if (cubeId == 1) {
                            value = pd.c1_AIN;
                        }
                    }

                    return value;
                },
            },
            //pingpong_g2_is_top_shape: '큐브 %1 의 윗면에 %2 모양이 있는가?',
            pingpong_g2_multi_motor_rotate: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
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
                        value: 10,
                    },
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
                        value: 10,
                    },
                    { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
                ],
                def: {
                    params: [null],
                    type: 'pingpong_g2_multi_motor_rotate',
                },
                paramsKeyMap: { DIR_1: 0, DEGREE_1: 1, DIR_2: 2, DEGREE_2: 3 },
                class: 'Pingpong_G2_motor',
                isNotFor: ['Pingpong_G2'],
                func(sprite, script) {
                    return Entry.Pingpong_G2.postCallReturn(script, () => {
                        const dir1 = script.getStringField('DIR_1');
                        const dir2 = script.getStringField('DIR_2');
                        const degree1 = script.getNumberValue('DEGREE_1');
                        const degree2 = script.getNumberValue('DEGREE_2');

                        const speed1 = 80 * (dir1 === 'LEFT' ? -1 : 1);
                        const speed2 = 80 * (dir2 === 'LEFT' ? -1 : 1);

                        const [arr1, delay1] = Entry.Pingpong_G2.makeSingleStepPacket(
                            0,
                            speed1,
                            degree1
                        );
                        const [arr2, delay2] = Entry.Pingpong_G2.makeSingleStepPacket(
                            1,
                            speed2,
                            degree2
                        );

                        const packet1 = Buffer.from(arr1);
                        const packet2 = Buffer.from(arr2);

                        const opt = [2, 1, 0, 2];
                        const cmd = Entry.Pingpong_G2.makePacket(
                            OPCODE.AGGREGATE_STEPS,
                            2 << 12,
                            0xaa,
                            opt
                        );
                        cmd.writeUInt16BE(cmd.length + packet1.length + packet2.length, 7);

                        const packet = Buffer.concat([cmd, packet1, packet2]);

                        const waitTime = Math.max(delay1, delay2);
                        return [packet, waitTime];
                    });
                },
            },
            pingpong_g2_motor_rotate: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks.pingpong_g2_cube_all,
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
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
                        value: 10,
                    },
                    { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
                ],
                events: {},
                def: {
                    params: [null, null, null],
                    type: 'pingpong_g2_motor_rotate',
                },
                paramsKeyMap: { CUBEID: 0, DIR: 1, DEGREE: 2 },
                class: 'Pingpong_G2_motor',
                isNotFor: ['Pingpong_G2'],
                func(sprite, script) {
                    return Entry.Pingpong_G2.postCallReturn(script, () => {
                        const cubeId = script.getNumberField('CUBEID');
                        const dir = script.getStringField('DIR');
                        const degree = script.getNumberValue('DEGREE');

                        const speed = 80 * (dir === 'LEFT' ? -1 : 1);

                        const [arr, waitTime] = Entry.Pingpong_G2.makeSingleStepPacket(
                            cubeId,
                            speed,
                            degree
                        );
                        const packet = Buffer.from(arr);
                        return [packet, waitTime];
                    });
                },
            },
            pingpong_g2_start_multi_motor_rotate: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                params: [
                    { type: 'Block', accept: 'string', defaultType: 'number', value: 100 },
                    { type: 'Block', accept: 'string', defaultType: 'number', value: 100 },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                def: {
                    params: [],
                    type: 'pingpong_g2_start_multi_motor_rotate',
                },
                paramsKeyMap: { SPEED_1: 0, SPEED_2: 1 },
                class: 'Pingpong_G2_motor',
                isNotFor: ['Pingpong_G2'],
                func(sprite, script) {
                    return Entry.Pingpong_G2.postCallReturn(script, () => {
                        const speed1 = script.getNumberValue('SPEED_1');
                        const speed2 = script.getNumberValue('SPEED_2');

                        const sps1 = Entry.Pingpong_G2._calcSpsFromSpeed(speed1);
                        const sps2 = Entry.Pingpong_G2._calcSpsFromSpeed(speed2);

                        const opt1 = [2, 0, 0, 2, sps1 / 256, sps1 % 256];
                        const packet1 = Entry.Pingpong_G2.makePacket(
                            OPCODE.CONTINUOUS_STEPS,
                            0,
                            0,
                            opt1
                        );

                        const opt2 = [2, 0, 0, 2, sps2 / 256, sps2 % 256];
                        const packet2 = Entry.Pingpong_G2.makePacket(
                            OPCODE.CONTINUOUS_STEPS,
                            0,
                            1,
                            opt2
                        );

                        const opt = [2, 0, 0, 2];
                        const cmd = Entry.Pingpong_G2.makePacket(
                            OPCODE.AGGREGATE_STEPS,
                            2 << 12,
                            0xaa,
                            opt
                        );
                        cmd.writeUInt16BE(cmd.length + packet1.length + packet2.length, 7);

                        const packet = Buffer.concat([cmd, packet1, packet2]);
                        return [packet];
                    });
                },
            },
            pingpong_g2_start_motor_rotate: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                params: [
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks.pingpong_g2_cube_all,
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                        value: 100,
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                def: {
                    params: [null, null],
                    type: 'pingpong_g2_start_motor_rotate',
                },
                paramsKeyMap: { CUBEID: 0, SPEED: 1 },
                class: 'Pingpong_G2_motor',
                isNotFor: ['Pingpong_G2'],
                func(sprite, script) {
                    return Entry.Pingpong_G2.postCallReturn(script, () => {
                        const cubeId = script.getNumberField('CUBEID');
                        const speed = script.getNumberValue('SPEED');
                        const sps = Entry.Pingpong_G2._calcSpsFromSpeed(speed);

                        const opt = [2, 0, 0, 2, sps / 256, sps % 256];
                        const packet = Entry.Pingpong_G2.makePacket(
                            OPCODE.CONTINUOUS_STEPS,
                            0,
                            cubeId,
                            opt
                        );

                        const waitTime = Math.round(((1100 - Math.abs(speed)) / 99) * 10) + 400;
                        return [packet, waitTime];
                    });
                },
            },
            pingpong_g2_stop_motor_rotate: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                params: [
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks.pingpong_g2_cube_all,
                        value: 0,
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
                def: {
                    params: [],
                    type: 'pingpong_g2_stop_motor_rotate',
                },
                paramsKeyMap: { CUBEID: 0 },
                class: 'Pingpong_G2_motor',
                isNotFor: ['Pingpong_G2'],
                func(sprite, script) {
                    return Entry.Pingpong_G2.postCallReturn(script, () => {
                        const cubeId = script.getNumberField('CUBEID');

                        const opt = [2, 0, 0, 1, 0, 0];
                        const packet = Entry.Pingpong_G2.makePacket(
                            OPCODE.CONTINUOUS_STEPS,
                            0,
                            cubeId,
                            opt
                        );
                        return [packet];
                    });
                },
            },
            pingpong_g2_rotate_servo_mortor: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    { type: 'Block', accept: 'string', defaultType: 'number', value: '1' },
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
                events: {},
                def: { params: [null, { type: 'angle' }], type: 'pingpong_g2_rotate_servo_mortor' },
                paramsKeyMap: { cubeno: 0, DEGREE: 1 },
                class: 'Pingpong_G2_motor',
                isNotFor: ['Pingpong_G2'],
                func(sprite, script) {
                    return Entry.Pingpong_G2.postCallReturn(script, () => {
                        const cubeId = Entry.Pingpong_G2._getCubeNoFromBlock(script);
                        let angle = script.getNumberValue('DEGREE', script);

                        angle = Math.min(Math.max(angle, 0), 180);

                        const opt = [2, 0, angle, 1];
                        const packet = Entry.Pingpong_G2.makePacket(
                            OPCODE.SERVO,
                            0x00,
                            cubeId,
                            opt
                        );
                        return [packet];
                    });
                },
            },
            pingpong_g2_set_dot_pixel: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    { type: 'Block', accept: 'string', defaultType: 'number', value: '1' },
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
                events: {},
                def: {
                    params: [null, null, null],
                    type: 'pingpong_g2_set_dot_pixel',
                },
                paramsKeyMap: { cubeno: 0, X: 1, Y: 2, onoff: 3 },
                class: 'Pingpong_G2_peripheral_LED',
                isNotFor: ['Pingpong_G2'],
                func(sprite, script) {
                    return Entry.Pingpong_G2.postCallReturn(script, () => {
                        const cubeId = Entry.Pingpong_G2._getCubeNoFromBlock(script);
                        let dotX = script.getNumberValue('X', script);
                        let dotY = script.getNumberValue('Y', script);
                        const onoff = script.getNumberField('onoff', script);

                        dotX = Math.min(Math.max(dotX, 0), 7);
                        dotY = Math.min(Math.max(dotY, 0), 7);

                        const opt = [0x70, dotY, dotX, onoff];
                        const packet = Entry.Pingpong_G2.makePacket(
                            OPCODE.LEDMATRIX,
                            0xe1,
                            cubeId,
                            opt
                        );
                        return [packet];
                    });
                },
            },
            pingpong_g2_set_dot_string: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    { type: 'Block', accept: 'string', defaultType: 'number', value: '1' },
                    { type: 'Block', accept: 'string', value: 'Hello!' },
                    { type: 'Block', accept: 'string', defaultType: 'number', value: '2' },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                def: { params: [null, null], type: 'pingpong_g2_set_dot_string' },
                paramsKeyMap: { cubeno: 0, STR: 1, DURATION: 2 },
                class: 'Pingpong_G2_peripheral_LED',
                isNotFor: ['Pingpong_G2'],
                func(sprite, script) {
                    return Entry.Pingpong_G2.postCallReturn(script, () => {
                        const cubeId = Entry.Pingpong_G2._getCubeNoFromBlock(script);
                        const str = script.getStringValue('STR', script);
                        const duration = script.getNumberValue('DURATION', script);

                        let period = Math.round((duration * 100) / (str.length * 8));
                        period = Math.min(Math.max(period, 1), 200);

                        const opt = Buffer.concat([
                            Buffer.from([0x70, period, 0]),
                            Buffer.from(str.substring(0, 20)),
                        ]);

                        const packet = Entry.Pingpong_G2.makePacket(
                            OPCODE.LEDMATRIX,
                            0xe3,
                            cubeId,
                            opt
                        );
                        // add delay time for matrix stability (about 400ms)
                        const waitTime = period * (str.length + 1) * 8 * 10 + 400;
                        return [packet, waitTime];
                    });
                },
            },
            pingpong_g2_set_dot_clear: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    { type: 'Block', accept: 'string', defaultType: 'number', value: '1' },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                def: { params: [], type: 'pingpong_g2_set_dot_clear' },
                paramsKeyMap: { cubeno: 0 },
                class: 'Pingpong_G2_peripheral_LED',
                isNotFor: ['Pingpong_G2'],
                func(sprite, script) {
                    return Entry.Pingpong_G2.postCallReturn(script, () => {
                        const cubeId = Entry.Pingpong_G2._getCubeNoFromBlock(script);
                        const opt = [0x70, 1, 0, ' '];
                        const packet = Entry.Pingpong_G2.makePacket(
                            OPCODE.LEDMATRIX,
                            0xe3,
                            cubeId,
                            opt
                        );
                        return [packet];
                    });
                },
            },
        };
    }

    setLanguage() {
        return {
            ko: {
                template: {
                    pingpong_g2_when_button_pressed: '%1 %2 큐브의 단추를 눌렀을 때',
                    pingpong_g2_when_tilted: '%1 %2 큐브가 %3 (으)로 기울였을 때',
                    pingpong_g2_is_button_pressed: '%1 큐브의 단추가 눌렸는가?',
                    pingpong_g2_is_tilted: '%1 큐브가 %2 (으)로 기울여졌는가?',
                    //pingpong_g2_is_top_shape: '큐브 %1 의 윗면에 %2 모양이 있는가?',
                    pingpong_g2_get_tilt_value: '%1 큐브의 %2 방향 기울기',
                    pingpong_g2_get_sensor_value: '%1 큐브의 %2 센서값',
                    pingpong_g2_multi_motor_rotate:
                        '모터1을 %1 방향으로 %2 도 회전하고 모터2를 %3 방향으로 %4 도 회전하기 %5',
                    pingpong_g2_motor_rotate: '%1 모터를 %2 방향으로 %3 도 회전하기 %4',
                    pingpong_g2_start_multi_motor_rotate:
                        '모터1 속도를 %1 모터2 속도를 %2 (으)로 정하기 %3',
                    pingpong_g2_start_motor_rotate: '%1 모터의 속도를 %2 으로 정하기 %3',
                    pingpong_g2_stop_motor_rotate: '%1 모터 멈추기 %2',
                    pingpong_g2_set_dot_pixel: '%1 번째 큐브의 도트 X:%2 Y:%3 %4 %5',
                    pingpong_g2_set_dot_string:
                        '%1 번째 큐브에 도트 문자열 %2 %3초동안 보여주기 %4',
                    pingpong_g2_set_dot_clear: '%1 번째 큐브의 화면 지우기 %2',
                    pingpong_g2_rotate_servo_mortor: '%1 번째 큐브의 서보모터 %2도로 설정하기 %3',
                },
                Blocks: {
                    ...this.lang_defblock.ko,

                    pingpong_g2_cube_id: [['1번', 0], ['2번', 1]],
                    pingpong_g2_cube_all: [['1번', 0], ['2번', 1], ['모든', -1]],
                },
            },
            en: {
                template: {
                    pingpong_g2_when_button_pressed: '%1 %2 cube button pressed',
                    pingpong_g2_when_tilted: '%1 %2 cube tilted to %3',
                    pingpong_g2_is_button_pressed: '%1 cube button pressed?',
                    pingpong_g2_is_tilted: '%1 cube tilted to %2',
                    //pingpong_g2_is_top_shape: '%1 shown in top view?',
                    pingpong_g2_get_tilt_value: '%1 cube tilt angle to %2',
                    pingpong_g2_get_sensor_value: '%1 cube read sensor %2',
                    pingpong_g2_multi_motor_rotate:
                        'rotate motor1 %2 degrees %1, motor2 %4 degrees %3 %5',
                    pingpong_g2_motor_rotate: 'rotate %2 degrees %1 %3',
                    pingpong_g2_start_multi_motor_rotate:
                        'set motor1 speed to %1, motor2 speed to %2 %3',
                    pingpong_g2_start_motor_rotate: 'set motor speed to %1 %2',
                    pingpong_g2_stop_motor_rotate: 'stop motor rotate %1',
                    pingpong_g2_rotate_servo_mortor: 'set servo mortor to %1 degrees %2',
                    pingpong_g2_set_dot_pixel: '%1 cube set DOT X:%2 Y:%3 %4 %5',
                    pingpong_g2_set_dot_string:
                        'print %1 cube string %2 during %3 seconds to DOT %4',
                    pingpong_g2_set_dot_clear: '%1 cube clear DOT %2',
                },
                Blocks: {
                    ...this.lang_defblock.en,

                    pingpong_g2_cube_id: [['1st', 0], ['2nd', 1]],
                    pingpong_g2_cube_all: [['1st', 0], ['2nd', 1], ['All', -1]],
                },
            },
        };
    }
})();

Entry.Pingpong_G3 = new (class extends PingpongBase {
    constructor() {
        super(3);

        this.id = '35.3';
        this.name = 'Pingpong_G3';
        this.url = 'https://www.roborisen.com';
        this.imageName = 'pingpong_g2.png';
        this.title = {
            ko: '핑퐁 G3',
            en: 'Pingpong G3',
        };
        this.blockMenuBlocks = [
            'pingpong_g3_when_button_pressed',
            'pingpong_g3_when_tilted',
            'pingpong_g3_is_button_pressed',
            'pingpong_g3_is_tilted',
            'pingpong_g3_get_tilt_value',
            'pingpong_g3_get_sensor_value',
            'pingpong_g3_multi_motor_rotate',
            'pingpong_g3_motor_rotate',
            'pingpong_g3_start_multi_motor_rotate',
            'pingpong_g3_start_motor_rotate',
            'pingpong_g3_stop_motor_rotate',
            'pingpong_g3_rotate_servo_mortor',
            'pingpong_g3_set_dot_pixel',
            'pingpong_g3_set_dot_string',
            'pingpong_g3_set_dot_clear',
        ];
    }

    getBlocks() {
        return {
            pingpong_g3_when_button_pressed: {
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
                        options: Lang.Blocks.pingpong_g3_cube_id,
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                def: {
                    params: [null],
                    type: 'pingpong_g3_when_button_pressed',
                },
                paramsKeyMap: {
                    CUBEID: 1,
                },
                class: 'Pingpong_G3',
                isNotFor: ['Pingpong_G3'],
                event: 'pp_when_button_pressed',
                func(sprite, script) {
                    const cubeId = script.getNumberField('CUBEID');
                    const pd = Entry.hw.portData;

                    if (
                        (cubeId == 0 && pd.c0_BUTTON == 1) ||
                        (cubeId == 1 && pd.c1_BUTTON == 1) ||
                        (cubeId == 2 && pd.c2_BUTTON == 1)
                    ) {
                        return script.callReturn();
                    }
                    return this.die();
                },
            },
            pingpong_g3_when_tilted: {
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
                        options: Lang.Blocks.pingpong_g3_cube_id,
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.pingpong_circle, 'FRONT'],
                            [Lang.Blocks.pingpong_triangle, 'BACK'],
                            [Lang.Blocks.pingpong_rectangle, 'LEFT'],
                            [Lang.Blocks.pingpong_star, 'RIGHT'],
                        ],
                        value: 'FRONT',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                def: {
                    params: [null, null],
                    type: 'pingpong_g3_when_tilted',
                },
                paramsKeyMap: {
                    CUBEID: 1,
                    TILT_DIR: 2,
                },
                class: 'Pingpong_G3',
                isNotFor: ['Pingpong_G3'],
                event: 'pp_when_tilted',
                func(sprite, script) {
                    const cubeId = script.getNumberField('CUBEID');
                    const tiltDir = script.getStringField('TILT_DIR');

                    const tiltValue = Entry.Pingpong_G3._getTiltValue(cubeId, tiltDir);
                    if (tiltValue >= Entry.Pingpong_G3.TILT_THRESHOLD) {
                        return script.callReturn();
                    }

                    return this.die();
                },
            },
            pingpong_g3_is_button_pressed: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_boolean_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks.pingpong_g3_cube_id,
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                def: {
                    params: [null],
                    type: 'pingpong_g3_is_button_pressed',
                },
                paramsKeyMap: {
                    CUBEID: 0,
                },
                class: 'Pingpong_G3',
                isNotFor: ['Pingpong_G3'],
                func(sprite, script) {
                    const cubeId = script.getNumberField('CUBEID');
                    const pd = Entry.hw.portData;

                    return (
                        (cubeId == 0 && pd.c0_BUTTON == 1) ||
                        (cubeId == 1 && pd.c1_BUTTON == 1) ||
                        (cubeId == 2 && pd.c2_BUTTON == 1)
                    );
                },
            },
            pingpong_g3_is_tilted: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_boolean_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks.pingpong_g3_cube_id,
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.pingpong_circle, 'FRONT'],
                            [Lang.Blocks.pingpong_triangle, 'BACK'],
                            [Lang.Blocks.pingpong_rectangle, 'LEFT'],
                            [Lang.Blocks.pingpong_star, 'RIGHT'],
                        ],
                        value: 'FRONT',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                def: { params: [], type: 'pingpong_g3_is_tilted' },
                paramsKeyMap: {
                    CUBEID: 0,
                    TILT_DIR: 1,
                },
                class: 'Pingpong_G3',
                isNotFor: ['Pingpong_G3'],
                func(sprite, script) {
                    const cubeId = script.getNumberField('CUBEID');
                    const tiltDir = script.getStringField('TILT_DIR', script);

                    const tiltValue = Entry.Pingpong_G3._getTiltValue(cubeId, tiltDir);

                    return tiltValue >= Entry.Pingpong_G3.TILT_THRESHOLD;
                },
            },
            pingpong_g3_get_tilt_value: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_string_field',
                params: [
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks.pingpong_g3_cube_id,
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.pingpong_circle, 'FRONT'],
                            [Lang.Blocks.pingpong_triangle, 'BACK'],
                            [Lang.Blocks.pingpong_rectangle, 'LEFT'],
                            [Lang.Blocks.pingpong_star, 'RIGHT'],
                        ],
                        value: 'FRONT',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                def: {
                    params: [null],
                    type: 'pingpong_g3_get_tilt_value',
                },
                paramsKeyMap: { CUBEID: 0, DIR: 1 },
                class: 'Pingpong_G3',
                isNotFor: ['Pingpong_G3'],
                func(sprite, script) {
                    const cubeId = script.getNumberField('CUBEID');
                    const tiltDir = script.getStringField('DIR', script);

                    return Entry.Pingpong_G3._getTiltValue(cubeId, tiltDir);
                },
            },
            pingpong_g3_get_sensor_value: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_string_field',
                params: [
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks.pingpong_g3_cube_id,
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
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
                def: { params: [], type: 'pingpong_g3_get_sensor_value' },
                paramsKeyMap: { CUBEID: 0, SENSOR: 1 },
                class: 'Pingpong_G3',
                isNotFor: ['Pingpong_G3'],
                func(sprite, script) {
                    const cubeId = script.getNumberField('CUBEID');
                    const sensorType = script.getStringField('SENSOR', script);
                    const pd = Entry.hw.portData;
                    let value = 0;

                    if (sensorType == 'PROXIMITY') {
                        if (cubeId == 0) {
                            value = pd.c0_PROXIMITY;
                        } else if (cubeId == 1) {
                            value = pd.c1_PROXIMITY;
                        } else if (cubeId == 2) {
                            value = pd.c2_PROXIMITY;
                        }
                    } else if (sensorType == 'AIN') {
                        if (cubeId == 0) {
                            value = pd.c0_AIN;
                        } else if (cubeId == 1) {
                            value = pd.c1_AIN;
                        } else if (cubeId == 2) {
                            value = pd.c2_AIN;
                        }
                    }

                    return value;
                },
            },
            //pingpong_g3_is_top_shape: '큐브 %1 의 윗면에 %2 모양이 있는가?',
            pingpong_g3_multi_motor_rotate: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
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
                    { type: 'Block', accept: 'string', defaultType: 'number', value: 10 },
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
                        value: 10,
                    },
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
                    { type: 'Block', accept: 'string', defaultType: 'number', value: 10 },
                    { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
                ],
                def: {
                    params: [],
                    type: 'pingpong_g3_multi_motor_rotate',
                },
                paramsKeyMap: {
                    DIR_1: 0,
                    DEGREE_1: 1,
                    DIR_2: 2,
                    DEGREE_2: 3,
                    DIR_3: 4,
                    DEGREE_3: 5,
                },
                class: 'Pingpong_G3_motor',
                isNotFor: ['Pingpong_G3'],
                func(sprite, script) {
                    return Entry.Pingpong_G3.postCallReturn(script, () => {
                        const dir1 = script.getStringField('DIR_1');
                        const dir2 = script.getStringField('DIR_2');
                        const dir3 = script.getStringField('DIR_3');
                        const degree1 = script.getNumberValue('DEGREE_1');
                        const degree2 = script.getNumberValue('DEGREE_2');
                        const degree3 = script.getNumberValue('DEGREE_3');

                        const speed1 = 80 * (dir1 === 'LEFT' ? -1 : 1);
                        const speed2 = 80 * (dir2 === 'LEFT' ? -1 : 1);
                        const speed3 = 80 * (dir3 === 'LEFT' ? -1 : 1);

                        const [arr1, delay1] = Entry.Pingpong_G3.makeSingleStepPacket(
                            0,
                            speed1,
                            degree1
                        );
                        const [arr2, delay2] = Entry.Pingpong_G3.makeSingleStepPacket(
                            1,
                            speed2,
                            degree2
                        );
                        const [arr3, delay3] = Entry.Pingpong_G3.makeSingleStepPacket(
                            2,
                            speed3,
                            degree3
                        );

                        const packet1 = Buffer.from(arr1);
                        const packet2 = Buffer.from(arr2);
                        const packet3 = Buffer.from(arr3);

                        const opt = [2, 1, 0, 2];
                        const cmd = Entry.Pingpong_G3.makePacket(
                            OPCODE.AGGREGATE_STEPS,
                            3 << 12,
                            0xaa,
                            opt
                        );
                        cmd.writeUInt16BE(
                            cmd.length + packet1.length + packet2.length + packet3.length,
                            7
                        );

                        const packet = Buffer.concat([cmd, packet1, packet2, packet3]);

                        const waitTime = Math.max(delay1, delay2, delay3);
                        return [packet, waitTime];
                    });
                },
            },
            pingpong_g3_motor_rotate: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks.pingpong_g3_cube_all,
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
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
                    { type: 'Block', accept: 'string', defaultType: 'number', value: 10 },
                    { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
                ],
                events: {},
                def: {
                    params: [],
                    type: 'pingpong_g3_motor_rotate',
                },
                paramsKeyMap: { CUBEID: 0, DIR: 1, DEGREE: 2 },
                class: 'Pingpong_G3_motor',
                isNotFor: ['Pingpong_G3'],
                func(sprite, script) {
                    return Entry.Pingpong_G3.postCallReturn(script, () => {
                        const cubeId = script.getNumberField('CUBEID');
                        const dir = script.getStringField('DIR');
                        const degree = script.getNumberValue('DEGREE');

                        const speed = 80 * (dir === 'LEFT' ? -1 : 1);
                        const [arr, waitTime] = Entry.Pingpong_G3.makeSingleStepPacket(
                            cubeId,
                            speed,
                            degree
                        );
                        const packet = Buffer.from(arr);
                        return [packet, waitTime];
                    });
                },
            },
            pingpong_g3_start_multi_motor_rotate: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                params: [
                    { type: 'Block', accept: 'string', defaultType: 'number', value: 100 },
                    { type: 'Block', accept: 'string', defaultType: 'number', value: 100 },
                    { type: 'Block', accept: 'string', defaultType: 'number', value: 100 },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                def: {
                    params: [],
                    type: 'pingpong_g3_start_multi_motor_rotate',
                },
                paramsKeyMap: { SPEED_1: 0, SPEED_2: 1, SPEED_3: 2 },
                class: 'Pingpong_G3_motor',
                isNotFor: ['Pingpong_G3'],
                func(sprite, script) {
                    return Entry.Pingpong_G3.postCallReturn(script, () => {
                        const speed1 = script.getNumberValue('SPEED_1');
                        const speed2 = script.getNumberValue('SPEED_2');
                        const speed3 = script.getNumberValue('SPEED_3');

                        const arr1 = Entry.Pingpong_G3.makeContStepPacket(0, 0, speed1);
                        const arr2 = Entry.Pingpong_G3.makeContStepPacket(1, 0, speed2);
                        const arr3 = Entry.Pingpong_G3.makeContStepPacket(2, 0, speed3);

                        const packet1 = Buffer.from(arr1);
                        const packet2 = Buffer.from(arr2);
                        const packet3 = Buffer.from(arr3);

                        const opt = [2, 0, 0, 2];
                        const cmd = Entry.Pingpong_G3.makePacket(
                            OPCODE.AGGREGATE_STEPS,
                            3 << 12,
                            0xaa,
                            opt
                        );
                        cmd.writeUInt16BE(
                            cmd.length + packet1.length + packet2.length + packet3.length,
                            7
                        );

                        const packet = Buffer.concat([cmd, packet1, packet2, packet3]);
                        return [packet];
                    });
                },
            },
            pingpong_g3_start_motor_rotate: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                params: [
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks.pingpong_g3_cube_all,
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                        value: 100,
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                def: {
                    params: [null, null],
                    type: 'pingpong_g3_start_motor_rotate',
                },
                paramsKeyMap: { CUBEID: 0, SPEED: 1 },
                class: 'Pingpong_G3_motor',
                isNotFor: ['Pingpong_G3'],
                func(sprite, script) {
                    return Entry.Pingpong_G3.postCallReturn(script, () => {
                        const cubeId = script.getNumberField('CUBEID');
                        let speed = script.getNumberValue('SPEED');
                        speed = Entry.Pingpong_G3._calcSpsFromSpeed(speed);

                        const opt = [2, 0, 0, 2, speed / 256, speed % 256];
                        const packet = Entry.Pingpong_G3.makePacket(
                            OPCODE.CONTINUOUS_STEPS,
                            0,
                            cubeId,
                            opt
                        );
                        return [packet];
                    });
                },
            },
            pingpong_g3_stop_motor_rotate: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                params: [
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks.pingpong_g3_cube_all,
                        value: 0,
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
                def: {
                    params: [],
                    type: 'pingpong_g3_stop_motor_rotate',
                },
                paramsKeyMap: { CUBEID: 0 },
                class: 'Pingpong_G3_motor',
                isNotFor: ['Pingpong_G3'],
                func(sprite, script) {
                    return Entry.Pingpong_G3.postCallReturn(script, () => {
                        const cubeId = script.getNumberField('CUBEID');

                        const opt = [2, 0, 0, 1, 0, 0];
                        const packet = Entry.Pingpong_G3.makePacket(
                            OPCODE.CONTINUOUS_STEPS,
                            0,
                            cubeId,
                            opt
                        );
                        return [packet];
                    });
                },
            },
            pingpong_g3_rotate_servo_mortor: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    { type: 'Block', accept: 'string', defaultType: 'number', value: '1' },
                    { type: 'Block', accept: 'string', defaultType: 'number' },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                def: { params: [null, { type: 'angle' }], type: 'pingpong_g3_rotate_servo_mortor' },
                paramsKeyMap: { cubeno: 0, DEGREE: 1 },
                class: 'Pingpong_G3_motor',
                isNotFor: ['Pingpong_G3'],
                func(sprite, script) {
                    return Entry.Pingpong_G3.postCallReturn(script, () => {
                        const cubeId = Entry.Pingpong_G3._getCubeNoFromBlock(script);
                        let angle = script.getNumberValue('DEGREE', script);

                        angle = Math.min(Math.max(angle, 0), 180);

                        const opt = [2, 0, angle, 1];
                        const packet = Entry.Pingpong_G3.makePacket(
                            OPCODE.SERVO,
                            0x00,
                            cubeId,
                            opt
                        );
                        return [packet];
                    });
                },
            },
            pingpong_g3_set_dot_pixel: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    { type: 'Block', accept: 'string', defaultType: 'number', value: '1' },
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
                events: {},
                def: {
                    params: [null, null, null],
                    type: 'pingpong_g3_set_dot_pixel',
                },
                paramsKeyMap: { cubeno: 0, X: 1, Y: 2, onoff: 3 },
                class: 'Pingpong_G3_peripheral_LED',
                isNotFor: ['Pingpong_G3'],
                func(sprite, script) {
                    return Entry.Pingpong_G3.postCallReturn(script, () => {
                        const cubeId = Entry.Pingpong_G3._getCubeNoFromBlock(script);
                        let dotX = script.getNumberValue('X', script);
                        let dotY = script.getNumberValue('Y', script);
                        const onoff = script.getNumberField('onoff', script);

                        dotX = Math.min(Math.max(dotX, 0), 7);
                        dotY = Math.min(Math.max(dotY, 0), 7);

                        const opt = [0x70, dotY, dotX, onoff];
                        const packet = Entry.Pingpong_G3.makePacket(
                            OPCODE.LEDMATRIX,
                            0xe1,
                            cubeId,
                            opt
                        );
                        return [packet];
                    });
                },
            },
            pingpong_g3_set_dot_string: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    { type: 'Block', accept: 'string', defaultType: 'number', value: '1' },
                    { type: 'Block', accept: 'string', value: 'Hello!' },
                    { type: 'Block', accept: 'string', defaultType: 'number', value: '2' },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                def: { params: [null, null], type: 'pingpong_g3_set_dot_string' },
                paramsKeyMap: { cubeno: 0, STR: 1, DURATION: 2 },
                class: 'Pingpong_G3_peripheral_LED',
                isNotFor: ['Pingpong_G3'],
                func(sprite, script) {
                    return Entry.Pingpong_G3.postCallReturn(script, () => {
                        const cubeId = Entry.Pingpong_G3._getCubeNoFromBlock(script);
                        const str = script.getStringValue('STR', script);
                        const duration = script.getNumberValue('DURATION', script);

                        let period = Math.round((duration * 100) / (str.length * 8));
                        period = Math.min(Math.max(period, 1), 200);

                        const opt = Buffer.concat([
                            Buffer.from([0x70, period, 0]),
                            Buffer.from(str.substring(0, 20)),
                        ]);

                        const packet = Entry.Pingpong_G3.makePacket(
                            OPCODE.LEDMATRIX,
                            0xe3,
                            cubeId,
                            opt
                        );
                        const waitTime = period * str.length * 8 * 10 + 400; // add wait for 400ms
                        return [packet, waitTime];
                    });
                },
            },
            pingpong_g3_set_dot_clear: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    { type: 'Block', accept: 'string', defaultType: 'number', value: '1' },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                def: { params: [], type: 'pingpong_g3_set_dot_clear' },
                paramsKeyMap: { cubeno: 0 },
                class: 'Pingpong_G3_peripheral_LED',
                isNotFor: ['Pingpong_G3'],
                func(sprite, script) {
                    return Entry.Pingpong_G3.postCallReturn(script, () => {
                        const cubeId = Entry.Pingpong_G3._getCubeNoFromBlock(script);
                        const opt = [0x70, 1, 0, ' '];
                        const packet = Entry.Pingpong_G3.makePacket(
                            OPCODE.LEDMATRIX,
                            0xe3,
                            cubeId,
                            opt
                        );
                        return [packet];
                    });
                },
            },
        };
    }

    setLanguage() {
        return {
            ko: {
                template: {
                    pingpong_g3_when_button_pressed: '%1 %2 큐브의 단추를 눌렀을 때',
                    pingpong_g3_when_tilted: '%1 %2 큐브가 %3 (으)로 기울였을 때',
                    pingpong_g3_is_button_pressed: '%1 큐브의 단추가 눌렸는가?',
                    pingpong_g3_is_tilted: '%1 큐브가 %2 (으)로 기울여졌는가?',
                    //pingpong_g3_is_top_shape: '큐브 %1 의 윗면에 %2 모양이 있는가?',
                    pingpong_g3_get_tilt_value: '%1 큐브의 %2 방향 기울기',
                    pingpong_g3_get_sensor_value: '%1 큐브의 %2 센서값',
                    pingpong_g3_multi_motor_rotate:
                        '모터1을 %1 방향으로 %2 도 회전하고 모터2를 %3 방향으로 %4 도 회전하고 모터3을 %5방향으로 %6도 회전하기 %7',
                    pingpong_g3_motor_rotate: '%1 모터를 %2 방향으로 %3 도 회전하기 %4',
                    pingpong_g3_start_multi_motor_rotate:
                        '모터1 속도를 %1 모터2 속도를 %2 모터3 속도를 %3 (으)로 정하기 %4',
                    pingpong_g3_start_motor_rotate: '%1 모터의 속도를 %2 으로 정하기 %3',
                    pingpong_g3_stop_motor_rotate: '%1 모터 멈추기 %2',
                    pingpong_g3_set_dot_pixel: '%1 번째 큐브의 도트 X:%2 Y:%3 %4 %5',
                    pingpong_g3_set_dot_string:
                        '%1 번째 큐브에 도트 문자열 %2 %3초동안 보여주기 %4',
                    pingpong_g3_set_dot_clear: '%1 번째 큐브의 화면 지우기 %2',
                    pingpong_g3_rotate_servo_mortor: '%1 번째 큐브의 서보모터 %2도로 설정하기 %3',
                },
                Blocks: {
                    ...this.lang_defblock.ko,

                    pingpong_g3_cube_id: [['1번', 0], ['2번', 1], ['3번', 2]],
                    pingpong_g3_cube_all: [['1번', 0], ['2번', 1], ['3번', 2], ['모든', -1]],
                },
            },
            en: {
                template: {
                    pingpong_g3_when_button_pressed: '%1 %2 cube button pressed',
                    pingpong_g3_when_tilted: '%1 %2 cube tilted to %3',
                    pingpong_g3_is_button_pressed: '%1 cube button pressed?',
                    pingpong_g3_is_tilted: '%1 cube tilted to %2',
                    //pingpong_g3_is_top_shape: '%1 shown in top view?',
                    pingpong_g3_get_tilt_value: '%1 cube tilt angle to %2',
                    pingpong_g3_get_sensor_value: '%1 cube read sensor %2',
                    pingpong_g3_multi_motor_rotate:
                        'rotate motor1 %2 degrees %1, ' +
                        'motor2 %4 degrees %3, motor3 %6 degrees %5 %7',
                    pingpong_g3_motor_rotate: 'rotate %2 degrees %1 %3',
                    pingpong_g3_start_multi_motor_rotate:
                        'set motor1 speed to %1, motor2 speed to %2, motor3 speed to %3 %4',
                    pingpong_g3_start_motor_rotate: 'set motor speed to %1 %2',
                    pingpong_g3_stop_motor_rotate: 'stop motor rotate %1',
                    pingpong_g3_rotate_servo_mortor: 'set servo mortor to %1 degrees %2',
                    pingpong_g3_set_dot_pixel: '%1 cube set DOT X:%2 Y:%3 %4 %5',
                    pingpong_g3_set_dot_string:
                        'print %1 cube string %2 during %3 seconds to DOT %4',
                    pingpong_g3_set_dot_clear: '%1 cube clear DOT %2',
                },
                Blocks: {
                    ...this.lang_defblock.en,

                    pingpong_g3_cube_id: [['1st', 0], ['2nd', 1], ['3rd', 2]],
                    pingpong_g3_cube_all: [['1st', 0], ['2nd', 1], ['3rd', 2], ['All', -1]],
                },
            },
        };
    }
})();

Entry.Pingpong_G4 = new (class extends PingpongBase {
    constructor() {
        super(4);

        this.id = '35.4';
        this.name = 'Pingpong_G4';
        this.url = 'https://www.roborisen.com';
        this.imageName = 'pingpong_g4.png';
        this.title = {
            ko: '핑퐁 G4',
            en: 'Pingpong G4',
        };
        this.blockMenuBlocks = [
            'pingpong_g4_when_button_pressed',
            'pingpong_g4_when_tilted',
            'pingpong_g4_is_button_pressed',
            'pingpong_g4_is_tilted',
            'pingpong_g4_get_tilt_value',
            'pingpong_g4_get_sensor_value',
            'pingpong_g4_multi_motor_rotate',
            'pingpong_g4_motor_rotate',
            'pingpong_g4_start_multi_motor_rotate',
            'pingpong_g4_start_motor_rotate',
            'pingpong_g4_stop_motor_rotate',
            'pingpong_g4_rotate_servo_mortor',
            'pingpong_g4_set_dot_pixel',
            'pingpong_g4_set_dot_string',
            'pingpong_g4_set_dot_clear',
        ];
    }

    getBlocks() {
        return {
            pingpong_g4_when_button_pressed: {
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
                        options: Lang.Blocks.pingpong_g4_cube_id,
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                def: {
                    params: [null],
                    type: 'pingpong_g4_when_button_pressed',
                },
                paramsKeyMap: {
                    CUBEID: 1,
                },
                class: 'Pingpong_G4',
                isNotFor: ['Pingpong_G4'],
                event: 'pp_when_button_pressed',
                func(sprite, script) {
                    const cubeId = script.getNumberField('CUBEID');
                    const pd = Entry.hw.portData;

                    if (
                        (cubeId == 0 && pd.c0_BUTTON == 1) ||
                        (cubeId == 1 && pd.c1_BUTTON == 1) ||
                        (cubeId == 2 && pd.c2_BUTTON == 1)
                    ) {
                        return script.callReturn();
                    }
                    return this.die();
                },
            },
            pingpong_g4_when_tilted: {
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
                        options: Lang.Blocks.pingpong_g4_cube_id,
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.pingpong_circle, 'FRONT'],
                            [Lang.Blocks.pingpong_triangle, 'BACK'],
                            [Lang.Blocks.pingpong_rectangle, 'LEFT'],
                            [Lang.Blocks.pingpong_star, 'RIGHT'],
                        ],
                        value: 'FRONT',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                def: {
                    params: [null, null],
                    type: 'pingpong_g4_when_tilted',
                },
                paramsKeyMap: {
                    CUBEID: 1,
                    TILT_DIR: 2,
                },
                class: 'Pingpong_G4',
                isNotFor: ['Pingpong_G4'],
                event: 'pp_when_tilted',
                func(sprite, script) {
                    const cubeId = script.getNumberField('CUBEID');
                    const tiltDir = script.getStringField('TILT_DIR');

                    const tiltValue = Entry.Pingpong_G4._getTiltValue(cubeId, tiltDir);
                    if (tiltValue >= Entry.Pingpong_G4.TILT_THRESHOLD) {
                        return script.callReturn();
                    }

                    return this.die();
                },
            },
            pingpong_g4_is_button_pressed: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_boolean_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks.pingpong_g4_cube_id,
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                def: {
                    params: [null],
                    type: 'pingpong_g4_is_button_pressed',
                },
                paramsKeyMap: {
                    CUBEID: 0,
                },
                class: 'Pingpong_G4',
                isNotFor: ['Pingpong_G4'],
                func(sprite, script) {
                    const cubeId = script.getNumberField('CUBEID');
                    const pd = Entry.hw.portData;

                    return (
                        (cubeId == 0 && pd.c0_BUTTON == 1) ||
                        (cubeId == 1 && pd.c1_BUTTON == 1) ||
                        (cubeId == 2 && pd.c2_BUTTON == 1) ||
                        (cubeId == 3 && pd.c3_BUTTON == 1)
                    );
                },
            },
            pingpong_g4_is_tilted: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_boolean_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks.pingpong_g4_cube_id,
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.pingpong_circle, 'FRONT'],
                            [Lang.Blocks.pingpong_triangle, 'BACK'],
                            [Lang.Blocks.pingpong_rectangle, 'LEFT'],
                            [Lang.Blocks.pingpong_star, 'RIGHT'],
                        ],
                        value: 'FRONT',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                def: { params: [], type: 'pingpong_g4_is_tilted' },
                paramsKeyMap: {
                    CUBEID: 0,
                    TILT_DIR: 1,
                },
                class: 'Pingpong_G4',
                isNotFor: ['Pingpong_G4'],
                func(sprite, script) {
                    const cubeId = script.getNumberField('CUBEID');
                    const tiltDir = script.getStringField('TILT_DIR', script);

                    const tiltValue = Entry.Pingpong_G4._getTiltValue(cubeId, tiltDir);

                    return tiltValue >= Entry.Pingpong_G4.TILT_THRESHOLD;
                },
            },
            pingpong_g4_get_tilt_value: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_string_field',
                params: [
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks.pingpong_g4_cube_id,
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.pingpong_circle, 'FRONT'],
                            [Lang.Blocks.pingpong_triangle, 'BACK'],
                            [Lang.Blocks.pingpong_rectangle, 'LEFT'],
                            [Lang.Blocks.pingpong_star, 'RIGHT'],
                        ],
                        value: 'FRONT',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                def: {
                    params: [null],
                    type: 'pingpong_g4_get_tilt_value',
                },
                paramsKeyMap: { CUBEID: 0, DIR: 1 },
                class: 'Pingpong_G4',
                isNotFor: ['Pingpong_G4'],
                func(sprite, script) {
                    const cubeId = script.getNumberField('CUBEID');
                    const tiltDir = script.getStringField('DIR', script);

                    return Entry.Pingpong_G4._getTiltValue(cubeId, tiltDir);
                },
            },
            pingpong_g4_get_sensor_value: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_string_field',
                params: [
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks.pingpong_g4_cube_id,
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
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
                def: { params: [], type: 'pingpong_g4_get_sensor_value' },
                paramsKeyMap: { CUBEID: 0, SENSOR: 1 },
                class: 'Pingpong_G4',
                isNotFor: ['Pingpong_G4'],
                func(sprite, script) {
                    const cubeId = script.getNumberField('CUBEID');
                    const sensorType = script.getStringField('SENSOR', script);
                    const pd = Entry.hw.portData;
                    let value = 0;

                    if (sensorType == 'PROXIMITY') {
                        if (cubeId == 0) {
                            value = pd.c0_PROXIMITY;
                        } else if (cubeId == 1) {
                            value = pd.c1_PROXIMITY;
                        } else if (cubeId == 2) {
                            value = pd.c2_PROXIMITY;
                        } else if (cubeId == 3) {
                            value = pd.c3_PROXIMITY;
                        }
                    } else if (sensorType == 'AIN') {
                        if (cubeId == 0) {
                            value = pd.c0_AIN;
                        } else if (cubeId == 1) {
                            value = pd.c1_AIN;
                        } else if (cubeId == 2) {
                            value = pd.c2_AIN;
                        } else if (cubeId == 3) {
                            value = pd.c3_AIN;
                        }
                    }

                    return value;
                },
            },
            //pingpong_g4_is_top_shape: '큐브 %1 의 윗면에 %2 모양이 있는가?',
            pingpong_g4_multi_motor_rotate: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
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
                    { type: 'Block', accept: 'string', defaultType: 'number', value: 10 },
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
                    { type: 'Block', accept: 'string', defaultType: 'number', value: 10 },
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
                    { type: 'Block', accept: 'string', defaultType: 'number', value: 10 },
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
                    { type: 'Block', accept: 'string', defaultType: 'number', value: 10 },
                    { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
                ],
                def: {
                    params: [],
                    type: 'pingpong_g4_multi_motor_rotate',
                },
                paramsKeyMap: {
                    DIR_1: 0,
                    DEGREE_1: 1,
                    DIR_2: 2,
                    DEGREE_2: 3,
                    DIR_3: 4,
                    DEGREE_3: 5,
                    DIR_4: 6,
                    DEGREE_4: 7,
                },
                class: 'Pingpong_G4_motor',
                isNotFor: ['Pingpong_G4'],
                func(sprite, script) {
                    return Entry.Pingpong_G4.postCallReturn(script, () => {
                        const dir1 = script.getStringField('DIR_1');
                        const dir2 = script.getStringField('DIR_2');
                        const dir3 = script.getStringField('DIR_3');
                        const dir4 = script.getStringField('DIR_4');
                        const degree1 = script.getNumberValue('DEGREE_1');
                        const degree2 = script.getNumberValue('DEGREE_2');
                        const degree3 = script.getNumberValue('DEGREE_3');
                        const degree4 = script.getNumberValue('DEGREE_4');

                        const speed1 = 80 * (dir1 === 'LEFT' ? -1 : 1);
                        const speed2 = 80 * (dir2 === 'LEFT' ? -1 : 1);
                        const speed3 = 80 * (dir3 === 'LEFT' ? -1 : 1);
                        const speed4 = 80 * (dir4 === 'LEFT' ? -1 : 1);

                        const [arr1, delay1] = Entry.Pingpong_G4.makeSingleStepPacket(
                            0,
                            speed1,
                            degree1
                        );
                        const [arr2, delay2] = Entry.Pingpong_G4.makeSingleStepPacket(
                            1,
                            speed2,
                            degree2
                        );
                        const [arr3, delay3] = Entry.Pingpong_G4.makeSingleStepPacket(
                            2,
                            speed3,
                            degree3
                        );
                        const [arr4, delay4] = Entry.Pingpong_G4.makeSingleStepPacket(
                            3,
                            speed4,
                            degree4
                        );

                        const packet1 = Buffer.from(arr1);
                        const packet2 = Buffer.from(arr2);
                        const packet3 = Buffer.from(arr3);
                        const packet4 = Buffer.from(arr4);

                        const opt = [2, 1, 0, 2];
                        const cmd = Entry.Pingpong_G4.makePacket(
                            OPCODE.AGGREGATE_STEPS,
                            4 << 12,
                            0xaa,
                            opt
                        );
                        cmd.writeUInt16BE(
                            cmd.length +
                                packet1.length +
                                packet2.length +
                                packet3.length +
                                packet4.length,
                            7
                        );

                        const packet = Buffer.concat([cmd, packet1, packet2, packet3, packet4]);

                        const waitTime = Math.max(delay1, delay2, delay3, delay4);
                        return [packet, waitTime];
                    });
                },
            },
            pingpong_g4_motor_rotate: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks.pingpong_g4_cube_all,
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
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
                    { type: 'Block', accept: 'string', defaultType: 'number', value: 10 },
                    { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
                ],
                events: {},
                def: {
                    params: [],
                    type: 'pingpong_g4_motor_rotate',
                },
                paramsKeyMap: { CUBEID: 0, DIR: 1, DEGREE: 2 },
                class: 'Pingpong_G4_motor',
                isNotFor: ['Pingpong_G4'],
                func(sprite, script) {
                    return Entry.Pingpong_G4.postCallReturn(script, () => {
                        const cubeId = script.getNumberField('CUBEID');
                        const dir = script.getStringField('DIR');
                        const degree = script.getNumberValue('DEGREE');
                        const speed = 80 * (dir === 'LEFT' ? -1 : 1);

                        const [arr, waitTime] = Entry.Pingpong_G4.makeSingleStepPacket(
                            cubeId,
                            speed,
                            degree
                        );
                        const packet = Buffer.from(arr);
                        return [packet, waitTime];
                    });
                },
            },
            pingpong_g4_start_multi_motor_rotate: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                params: [
                    { type: 'Block', accept: 'string', defaultType: 'number', value: 100 },
                    { type: 'Block', accept: 'string', defaultType: 'number', value: 100 },
                    { type: 'Block', accept: 'string', defaultType: 'number', value: 100 },
                    { type: 'Block', accept: 'string', defaultType: 'number', value: 100 },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                def: {
                    params: [],
                    type: 'pingpong_g4_start_multi_motor_rotate',
                },
                paramsKeyMap: { SPEED_1: 0, SPEED_2: 1, SPEED_3: 2, SPEED_4: 3 },
                class: 'Pingpong_G4_motor',
                isNotFor: ['Pingpong_G4'],
                func(sprite, script) {
                    return Entry.Pingpong_G4.postCallReturn(script, () => {
                        let speed1 = script.getNumberValue('SPEED_1');
                        let speed2 = script.getNumberValue('SPEED_2');
                        let speed3 = script.getNumberValue('SPEED_3');
                        let speed4 = script.getNumberValue('SPEED_4');
                        speed1 = Entry.Pingpong_G4._calcSpsFromSpeed(speed1);
                        speed2 = Entry.Pingpong_G4._calcSpsFromSpeed(speed2);
                        speed3 = Entry.Pingpong_G4._calcSpsFromSpeed(speed3);
                        speed4 = Entry.Pingpong_G4._calcSpsFromSpeed(speed4);

                        const opt1 = [2, 0, 0, 2, speed1 / 256, speed1 % 256];
                        const packet1 = Entry.Pingpong_G4.makePacket(
                            OPCODE.CONTINUOUS_STEPS,
                            0,
                            0,
                            opt1
                        );

                        const opt2 = [2, 0, 0, 2, speed2 / 256, speed2 % 256];
                        const packet2 = Entry.Pingpong_G4.makePacket(
                            OPCODE.CONTINUOUS_STEPS,
                            0,
                            1,
                            opt2
                        );

                        const opt3 = [2, 0, 0, 2, speed3 / 256, speed3 % 256];
                        const packet3 = Entry.Pingpong_G4.makePacket(
                            OPCODE.CONTINUOUS_STEPS,
                            0,
                            2,
                            opt3
                        );

                        const opt4 = [2, 0, 0, 2, speed4 / 256, speed4 % 256];
                        const packet4 = Entry.Pingpong_G4.makePacket(
                            OPCODE.CONTINUOUS_STEPS,
                            0,
                            3,
                            opt4
                        );

                        const opt = [2, 0, 0, 2];
                        const cmd = Entry.Pingpong_G4.makePacket(
                            OPCODE.AGGREGATE_STEPS,
                            4 << 12,
                            0xaa,
                            opt
                        );
                        cmd.writeUInt16BE(
                            cmd.length +
                                packet1.length +
                                packet2.length +
                                packet3.length +
                                packet4.length,
                            7
                        );

                        const packet = Buffer.concat([cmd, packet1, packet2, packet3, packet4]);
                        return [packet];
                    });
                },
            },
            pingpong_g4_start_motor_rotate: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                params: [
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks.pingpong_g4_cube_all,
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                        value: 100,
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                def: {
                    params: [null, null],
                    type: 'pingpong_g4_start_motor_rotate',
                },
                paramsKeyMap: { CUBEID: 0, SPEED: 1 },
                class: 'Pingpong_G4_motor',
                isNotFor: ['Pingpong_G4'],
                func(sprite, script) {
                    return Entry.Pingpong_G4.postCallReturn(script, () => {
                        const cubeId = script.getNumberField('CUBEID');
                        const speed = script.getNumberValue('SPEED');
                        const sps = Entry.Pingpong_G4._calcSpsFromSpeed(speed);

                        const opt = [2, 0, 0, 2, sps / 256, sps % 256];
                        const packet = Entry.Pingpong_G4.makePacket(
                            OPCODE.CONTINUOUS_STEPS,
                            0,
                            cubeId,
                            opt
                        );

                        return [packet];
                    });
                },
            },
            pingpong_g4_stop_motor_rotate: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                params: [
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks.pingpong_g4_cube_all,
                        value: 0,
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
                def: {
                    params: [],
                    type: 'pingpong_g4_stop_motor_rotate',
                },
                paramsKeyMap: { CUBEID: 0 },
                class: 'Pingpong_G4_motor',
                isNotFor: ['Pingpong_G4'],
                func(sprite, script) {
                    return Entry.Pingpong_G4.postCallReturn(script, () => {
                        const cubeId = script.getNumberField('CUBEID');

                        const opt = [2, 0, 0, 1, 0, 0];
                        const packet = Entry.Pingpong_G4.makePacket(
                            OPCODE.CONTINUOUS_STEPS,
                            0,
                            cubeId,
                            opt
                        );
                        return [packet];
                    });
                },
            },
            pingpong_g4_rotate_servo_mortor: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    { type: 'Block', accept: 'string', defaultType: 'number', value: '1' },
                    { type: 'Block', accept: 'string', defaultType: 'number' },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                def: { params: [null, { type: 'angle' }], type: 'pingpong_g4_rotate_servo_mortor' },
                paramsKeyMap: { cubeno: 0, DEGREE: 1 },
                class: 'Pingpong_G4_motor',
                isNotFor: ['Pingpong_G4'],
                func(sprite, script) {
                    return Entry.Pingpong_G4.postCallReturn(script, () => {
                        const cubeId = Entry.Pingpong_G4._getCubeNoFromBlock(script);
                        let angle = script.getNumberValue('DEGREE', script);

                        angle = Math.min(Math.max(angle, 0), 180);

                        const opt = [2, 0, angle, 1];
                        const packet = Entry.Pingpong_G4.makePacket(
                            OPCODE.SERVO,
                            0x00,
                            cubeId,
                            opt
                        );
                        return [packet];
                    });
                },
            },
            pingpong_g4_set_dot_pixel: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    { type: 'Block', accept: 'string', defaultType: 'number', value: '1' },
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
                events: {},
                def: {
                    params: [null, null, null],
                    type: 'pingpong_g4_set_dot_pixel',
                },
                paramsKeyMap: { cubeno: 0, X: 1, Y: 2, onoff: 3 },
                class: 'Pingpong_G4_peripheral_LED',
                isNotFor: ['Pingpong_G4'],
                func(sprite, script) {
                    return Entry.Pingpong_G4.postCallReturn(script, () => {
                        const cubeId = Entry.Pingpong_G4._getCubeNoFromBlock(script);
                        let dotX = script.getNumberValue('X', script);
                        let dotY = script.getNumberValue('Y', script);
                        const onoff = script.getNumberField('onoff', script);

                        dotX = Math.min(Math.max(dotX, 0), 7);
                        dotY = Math.min(Math.max(dotY, 0), 7);

                        const opt = [0x70, dotY, dotX, onoff];
                        const packet = Entry.Pingpong_G4.makePacket(
                            OPCODE.LEDMATRIX,
                            0xe1,
                            cubeId,
                            opt
                        );
                        return [packet];
                    });
                },
            },
            pingpong_g4_set_dot_string: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    { type: 'Block', accept: 'string', defaultType: 'number', value: '1' },
                    { type: 'Block', accept: 'string', value: 'Hello!' },
                    { type: 'Block', accept: 'string', defaultType: 'number', value: '2' },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                def: { params: [null, null], type: 'pingpong_g4_set_dot_string' },
                paramsKeyMap: { cubeno: 0, STR: 1, DURATION: 2 },
                class: 'Pingpong_G4_peripheral_LED',
                isNotFor: ['Pingpong_G4'],
                func(sprite, script) {
                    return Entry.Pingpong_G4.postCallReturn(script, () => {
                        const cubeId = Entry.Pingpong_G4._getCubeNoFromBlock(script);
                        const str = script.getStringValue('STR', script);
                        const duration = script.getNumberValue('DURATION', script);

                        let period = Math.round((duration * 100) / (str.length * 8));
                        period = Math.min(Math.max(period, 1), 200);

                        const opt = Buffer.concat([
                            Buffer.from([0x70, period, 0]),
                            Buffer.from(str.substring(0, 20)),
                        ]);

                        const packet = Entry.Pingpong_G4.makePacket(
                            OPCODE.LEDMATRIX,
                            0xe3,
                            cubeId,
                            opt
                        );
                        const waitTime = period * str.length * 8 * 10 + 400; // add wait for 400ms
                        return [packet, waitTime];
                    });
                },
            },
            pingpong_g4_set_dot_clear: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    { type: 'Block', accept: 'string', defaultType: 'number', value: '1' },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                events: {},
                def: { params: [], type: 'pingpong_g4_set_dot_clear' },
                paramsKeyMap: { cubeno: 0 },
                class: 'Pingpong_G4_peripheral_LED',
                isNotFor: ['Pingpong_G4'],
                func(sprite, script) {
                    return Entry.Pingpong_G4.postCallReturn(script, () => {
                        const cubeId = Entry.Pingpong_G4._getCubeNoFromBlock(script);
                        const opt = [0x70, 1, 0, ' '];
                        const packet = Entry.Pingpong_G4.makePacket(
                            OPCODE.LEDMATRIX,
                            0xe3,
                            cubeId,
                            opt
                        );
                        return [packet];
                    });
                },
            },
        };
    }

    setLanguage() {
        return {
            ko: {
                template: {
                    pingpong_g4_when_button_pressed: '%1 %2 큐브의 단추를 눌렀을 때',
                    pingpong_g4_when_tilted: '%1 %2 큐브가 %3 (으)로 기울였을 때',
                    pingpong_g4_is_button_pressed: '%1 큐브의 단추가 눌렸는가?',
                    pingpong_g4_is_tilted: '%1 큐브가 %2 (으)로 기울여졌는가?',
                    //pingpong_g4_is_top_shape: '큐브 %1 의 윗면에 %2 모양이 있는가?',
                    pingpong_g4_get_tilt_value: '%1 큐브의 %2 방향 기울기',
                    pingpong_g4_get_sensor_value: '%1 큐브의 %2 센서값',
                    pingpong_g4_multi_motor_rotate:
                        '모터1은 %1 방향으로 %2 도, 모터2는 %3 방향으로 %4 도, ' +
                        '모터3은 %5방향으로 %6도, 모터4는 %7방향으로 %8도 회전하기 %9',
                    pingpong_g4_motor_rotate: '%1 모터를 %2 방향으로 %3 도 회전하기 %4',
                    pingpong_g4_start_multi_motor_rotate:
                        '모터1 속도를 %1 모터2 속도를 %2 모터3 속도를 %3 모터4 속도를 %4 (으)로 정하기 %5',
                    pingpong_g4_start_motor_rotate: '%1 모터의 속도를 %2 으로 정하기 %3',
                    pingpong_g4_stop_motor_rotate: '%1 모터 멈추기 %2',
                    pingpong_g4_set_dot_pixel: '%1 번째 큐브의 도트 X:%2 Y:%3 %4 %5',
                    pingpong_g4_set_dot_string:
                        '%1 번째 큐브에 도트 문자열 %2 %3초동안 보여주기 %4',
                    pingpong_g4_set_dot_clear: '%1 번째 큐브의 화면 지우기 %2',
                    pingpong_g4_rotate_servo_mortor: '%1 번째 큐브의 서보모터 %2도로 설정하기 %3',
                },
                Blocks: {
                    ...this.lang_defblock.ko,

                    pingpong_g4_cube_id: [['1번', 0], ['2번', 1], ['3번', 2], ['4번', 3]],
                    pingpong_g4_cube_all: [
                        ['1번', 0],
                        ['2번', 1],
                        ['3번', 2],
                        ['4번', 3],
                        ['모든', -1],
                    ],
                },
            },
            en: {
                template: {
                    pingpong_g4_when_button_pressed: '%1 %2 cube button pressed',
                    pingpong_g4_when_tilted: '%1 %2 cube tilted to %3',
                    pingpong_g4_is_button_pressed: '%1 cube button pressed?',
                    pingpong_g4_is_tilted: '%1 cube tilted to %2',
                    //pingpong_g4_is_top_shape: '%1 shown in top view?',
                    pingpong_g4_get_tilt_value: '%1 cube tilt angle to %2',
                    pingpong_g4_get_sensor_value: '%1 cube read sensor %2',
                    pingpong_g4_multi_motor_rotate:
                        'rotate motor1 %2 degrees %1, motor2 %4 degrees %3, ' +
                        'motor3 %6 degrees %5, motor4 %8 degrees %7 %9',
                    pingpong_g4_motor_rotate: 'rotate %2 degrees %1 %3',
                    pingpong_g4_start_multi_motor_rotate:
                        'set motor1 speed to %1, motor2 speed to %2, ' +
                        'motor3 speed to %3, motor3 speed to %4, motor4 speed to %5 %6',
                    pingpong_g4_start_motor_rotate: 'set motor speed to %1 %2',
                    pingpong_g4_stop_motor_rotate: 'stop motor rotate %1',
                    pingpong_g4_rotate_servo_mortor: 'set servo mortor to %1 degrees %2',
                    pingpong_g4_set_dot_pixel: '%1 cube set DOT X:%2 Y:%3 %4 %5',
                    pingpong_g4_set_dot_string:
                        'print %1 cube string %2 during %3 seconds to DOT %4',
                    pingpong_g4_set_dot_clear: '%1 cube clear DOT %2',
                },
                Blocks: {
                    ...this.lang_defblock.en,

                    pingpong_g4_cube_id: [['1st', 0], ['2nd', 1], ['3rd', 2], ['4th', 3]],
                    pingpong_g4_cube_all: [
                        ['1st', 0],
                        ['2nd', 1],
                        ['3rd', 2],
                        ['4th', 3],
                        ['All', -1],
                    ],
                },
            },
        };
    }
})();

module.exports = [Entry.Pingpong_G2, Entry.Pingpong_G3, Entry.Pingpong_G4];
