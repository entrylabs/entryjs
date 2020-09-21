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
    MUSIC: 0xe8,
};

const METHOD = {
    CONTINOUS: 0,
    RELATIVE_SINGLE: 1,
    ABSOLUTE_SINGLE: 2,
    SCHED_STEPS: 3,
    sCHED_POINT: 4,
};

const MODE = {
    MULTIROLE: 2,
    CHECKCRC: 3,
};

const PROPERTY = {
    PERI: 0x01,
    MULTI: 0x02,
    PORT: 0x80,
    ADDRESS: 0x70,
    PAUSE: 1,
    RESUME: 2,
    MUSIC_PLAY: 0,
};

const DEFAULT_TEMPO = 60;

class PingpongBase {
    constructor(cubecnt) {
        this.TILT_THRESHOLD = 20;
        this.MOVE_THRESHOLD = 30;

        this.delayTime = 100;
        this.send_cmd_id = 0;
        this.cubeCnt = cubecnt || 2;

        this.tempo = DEFAULT_TEMPO;

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

        this.lang_defblock = {
            ko: {
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
            en: {
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
                    ['star', 'B_STAR'],
                    ['triangle', 'L_TRIANGLE'],
                    ['circle', 'R_CIRCLE'],
                    ['heart', 'U_HEART'],
                    ['none', 'D_NONE'],
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
        };
    }

    setZero() {
        this.tempo = DEFAULT_TEMPO;

        this.sendCommand(this.makePacket(OPCODE.LEDMATRIX, 0xe3, -1, [0x70, 1, 0, ' ']));
        setTimeout(() => {
            this.sendCommand(this.makePacket(OPCODE.CONTINUOUS_STEPS, 0, -1, [2, 0, 0, 1, 0, 0]));
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
        let step = Math.round(Math.min(Math.max(degree, 0), 5000) * 5.5);
        if (step > 32768) {
            step = 32768;
        }

        packet[9] = MODE.MULTIROLE;
        packet[10] = METHOD.RELATIVE_SINGLE;
        packet[11] = 0; //step_type; full=0, servo=4
        packet[12] = PROPERTY.RESUME;

        packet[13] = sps / 256;
        packet[14] = sps % 256;
        packet[15] = 0;
        packet[16] = 0;
        packet[17] = step / 256;
        packet[18] = step % 256;

        const waitTime = Math.round(((1000 - Math.abs(speed) * 9) / 99) * step) + 400;

        return [packet, waitTime];
    }

    makeContStepPacket(cubeNo, speed) {
        const packet = new Uint8Array(9 + 6);

        this._fillPacketIntoArray(packet, OPCODE.CONTINUOUS_STEPS, 0, cubeNo, 15);

        const sps = this._calcSpsFromSpeed(speed);

        packet[9] = MODE.MULTIROLE;
        packet[10] = METHOD.CONTINOUS;
        packet[11] = 0; //step_type; full=0, servo=4

        if (sps == 0) {
            packet[12] = PROPERTY.PAUSE;
            packet[13] = 0;
            packet[14] = 0;
        } else {
            packet[12] = PROPERTY.RESUME;
            packet[13] = sps / 256;
            packet[14] = sps % 256;
        }

        return packet;
    }

    makeMusicNotePacket(cubeNo, note, duration) {
        const packet = new Uint8Array(9 + 5);
        this._fillPacketIntoArray(packet, OPCODE.MUSIC, 0xa1, cubeNo, 9 + 5);

        packet[9] = 0;
        packet[10] = PROPERTY.MUSIC_PLAY;
        packet[11] = note - 8;
        // type == 1
        packet[12] = duration;
        packet[13] = 0;

        return packet;
    }

    makeAggregatePacket(opcode, taskid, packets, opt = []) {
        let size = 9 + opt.length;
        let options = opt;
        let usedCubeIds = [];

        packets.forEach((n) => {
            size += n.length;
            Array.prototype.push.apply(options, n);
            usedCubeIds.push(n[3]);
        });

        // aggregate command must have cubeCount commands. add dummy packet
        if (packets.length < this.cubeCnt) {
            for (let i = 0; i < this.cubeCnt; i++) {
                if (usedCubeIds.includes(i) == false) {
                    let dummyPacket = packets[0].slice();
                    dummyPacket[3] = i;
                    dummyPacket[6] = 0; // set opcode to zero
                    Array.prototype.push.apply(options, dummyPacket);
                }
            }
        }

        const cmd = this.makePacket(opcode, (packets.length << 12) | taskid, 0xaa, options);
        return cmd;
    }

    _getTiltValue(cubeNo, tiltDir) {
        const pd = Entry.hw.portData;
        let tiltValue = 0;

        if (cubeNo == 0) {
            if (tiltDir == 'F_CIRCLE') {
                tiltValue = pd.c0_TILT_X * -1;
            } else if (tiltDir == 'B_TRIANGLE') {
                tiltValue = pd.c0_TILT_X;
            } else if (tiltDir == 'L_RECTANGLE') {
                tiltValue = pd.c0_TILT_Y * -1;
            } else if (tiltDir == 'R_STAR') {
                tiltValue = pd.c0_TILT_Y;
            }
        } else if (cubeNo == 1) {
            if (tiltDir == 'F_CIRCLE') {
                tiltValue = pd.c1_TILT_X * -1;
            } else if (tiltDir == 'B_TRIANGLE') {
                tiltValue = pd.c1_TILT_X;
            } else if (tiltDir == 'L_RECTANGLE') {
                tiltValue = pd.c1_TILT_Y * -1;
            } else if (tiltDir == 'R_STAR') {
                tiltValue = pd.c1_TILT_Y;
            }
        } else if (cubeNo == 2) {
            if (tiltDir == 'F_CIRCLE') {
                tiltValue = pd.c2_TILT_X * -1;
            } else if (tiltDir == 'B_TRIANGLE') {
                tiltValue = pd.c2_TILT_X;
            } else if (tiltDir == 'L_RECTANGLE') {
                tiltValue = pd.c2_TILT_Y * -1;
            } else if (tiltDir == 'R_STAR') {
                tiltValue = pd.c2_TILT_Y;
            }
        } else if (cubeNo == 3) {
            if (tiltDir == 'F_CIRCLE') {
                tiltValue = pd.c3_TILT_X * -1;
            } else if (tiltDir == 'B_TRIANGLE') {
                tiltValue = pd.c3_TILT_X;
            } else if (tiltDir == 'L_RECTANGLE') {
                tiltValue = pd.c3_TILT_Y * -1;
            } else if (tiltDir == 'R_STAR') {
                tiltValue = pd.c3_TILT_Y;
            }
        }

        return tiltValue;
    }

    _isUpperDir(cubeNo, tiltDir) {
        const pd = Entry.hw.portData;
        if (cubeNo == 0) {
            if (tiltDir == 'DF_RECTANGLE' && pd.c0_TILT_Y > 70) return true;
            if (tiltDir == 'DB_STAR' && pd.c0_TILT_Y < -70) return true;
            if (tiltDir == 'DR_CIRCLE' && pd.c0_TILT_X > 70) return true;
            if (tiltDir == 'DL_TRIANGLE' && pd.c0_TILT_X < -70) return true;
            if (tiltDir == 'DD_NONE' && pd.c0_TILT_Z > 70) return true;
            if (tiltDir == 'DU_HEART' && pd.c0_TILT_Z < -70) return true;
            return false;
        } else if (cubeNo == 1) {
            if (tiltDir == 'DF_RECTANGLE' && pd.c1_TILT_Y > 70) return true;
            if (tiltDir == 'DB_STAR' && pd.c1_TILT_Y < -70) return true;
            if (tiltDir == 'DR_CIRCLE' && pd.c1_TILT_X > 70) return true;
            if (tiltDir == 'DL_TRIANGLE' && pd.c1_TILT_X < -70) return true;
            if (tiltDir == 'DD_NONE' && pd.c1_TILT_Z > 70) return true;
            if (tiltDir == 'DU_HEART' && pd.c1_TILT_Z < -70) return true;
            return false;
        } else if (cubeNo == 2) {
            if (tiltDir == 'DF_RECTANGLE' && pd.c2_TILT_Y > 70) return true;
            if (tiltDir == 'DB_STAR' && pd.c2_TILT_Y < -70) return true;
            if (tiltDir == 'DR_CIRCLE' && pd.c2_TILT_X > 70) return true;
            if (tiltDir == 'DL_TRIANGLE' && pd.c2_TILT_X < -70) return true;
            if (tiltDir == 'DD_NONE' && pd.c2_TILT_Z > 70) return true;
            if (tiltDir == 'DU_HEART' && pd.c2_TILT_Z < -70) return true;
            return false;
        } else if (cubeNo == 3) {
            if (tiltDir == 'DF_RECTANGLE' && pd.c3_TILT_Y > 70) return true;
            if (tiltDir == 'DB_STAR' && pd.c3_TILT_Y < -70) return true;
            if (tiltDir == 'DR_CIRCLE' && pd.c3_TILT_X > 70) return true;
            if (tiltDir == 'DL_TRIANGLE' && pd.c3_TILT_X < -70) return true;
            if (tiltDir == 'DD_NONE' && pd.c3_TILT_Z > 70) return true;
            if (tiltDir == 'DU_HEART' && pd.c3_TILT_Z < -70) return true;
            return false;
        }
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

    _clampBeats(beats) {
        return Math.min(Math.max(beats, 0), 40);
    }

    _clampTempo(tempo) {
        return Math.min(Math.max(tempo, 20), 500);
    }

    _beatsToDuration(beats) {
        let duration = Math.round((60 / this.tempo) * beats * 100);
        return duration;
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

Entry.PingpongG2 = new (class extends PingpongBase {
    constructor() {
        super(2);

        this.id = '35.2';
        this.name = 'PingpongG2';
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
            'pingpong_g2_is_top_shape',
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
            'pingpong_g2_playNoteForBeats',
            'pingpong_g2_playChordForBeats',
            'pingpong_g2_restForBeats',
            'pingpong_g2_setTempo',
            'pingpong_g2_getTempo',
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
                class: 'PingpongG2',
                isNotFor: ['PingpongG2'],
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
                        options: Lang.Blocks.pingpong_opts_cube_tiltDir,
                        value: 'F_CIRCLE',
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
                class: 'PingpongG2',
                isNotFor: ['PingpongG2'],
                event: 'pp_when_tilted',
                func(sprite, script) {
                    const cubeId = script.getNumberField('CUBEID');
                    const tiltDir = script.getStringField('TILT_DIR');

                    const tiltValue = Entry.PingpongG2._getTiltValue(cubeId, tiltDir);
                    if (tiltValue >= Entry.PingpongG2.TILT_THRESHOLD) {
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
                class: 'PingpongG2',
                isNotFor: ['PingpongG2'],
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
                        options: Lang.Blocks.pingpong_opts_cube_tiltDir,
                        value: 'F_CIRCLE',
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
                class: 'PingpongG2',
                isNotFor: ['PingpongG2'],
                func(sprite, script) {
                    const cubeId = script.getNumberField('CUBEID');
                    const tiltDir = script.getStringField('TILT_DIR', script);

                    const tiltValue = Entry.PingpongG2._getTiltValue(cubeId, tiltDir);

                    return tiltValue >= Entry.PingpongG2.TILT_THRESHOLD;
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
                    type: 'pingpong_g2_get_tilt_value',
                },
                paramsKeyMap: { CUBEID: 0, DIR: 1 },
                class: 'PingpongG2',
                isNotFor: ['PingpongG2'],
                func(sprite, script) {
                    const cubeId = script.getNumberField('CUBEID');
                    const tiltDir = script.getStringField('DIR', script);

                    return Entry.PingpongG2._getTiltValue(cubeId, tiltDir);
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
                class: 'PingpongG2',
                isNotFor: ['PingpongG2'],
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
            pingpong_g2_is_top_shape: {
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
                        options: Lang.Blocks.pingpong_opts_cube_dir6,
                        value: 'DF_RECTANGLE',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                def: { params: [], type: 'pingpong_g2_is_top_shape' },
                paramsKeyMap: { CUBEID: 0, TILT_DIR: 1 },
                class: 'PingpongG2',
                isNotFor: ['PingpongG2'],
                func(sprite, script) {
                    const cubeId = script.getNumberField('CUBEID');
                    const tiltDir = script.getStringField('TILT_DIR', script);
                    return Entry.PingpongG2._isUpperDir(cubeId, tiltDir);
                },
            },
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
                class: 'PingpongG2_motor',
                isNotFor: ['PingpongG2'],
                func(sprite, script) {
                    return Entry.PingpongG2.postCallReturn(script, () => {
                        const dir1 = script.getStringField('DIR_1');
                        const dir2 = script.getStringField('DIR_2');
                        const degree1 = script.getNumberValue('DEGREE_1');
                        const degree2 = script.getNumberValue('DEGREE_2');

                        const speed1 = 80 * (dir1 === 'LEFT' ? -1 : 1);
                        const speed2 = 80 * (dir2 === 'LEFT' ? -1 : 1);

                        const [arr1, delay1] = Entry.PingpongG2.makeSingleStepPacket(
                            0,
                            speed1,
                            degree1
                        );
                        const [arr2, delay2] = Entry.PingpongG2.makeSingleStepPacket(
                            1,
                            speed2,
                            degree2
                        );

                        const opt = [2, 1, 0, 2];
                        const packet = Entry.PingpongG2.makeAggregatePacket(
                            OPCODE.AGGREGATE_STEPS,
                            0,
                            [arr1, arr2],
                            opt
                        );

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
                class: 'PingpongG2_motor',
                isNotFor: ['PingpongG2'],
                func(sprite, script) {
                    return Entry.PingpongG2.postCallReturn(script, () => {
                        const cubeId = script.getNumberField('CUBEID');
                        const dir = script.getStringField('DIR');
                        const degree = script.getNumberValue('DEGREE');

                        const speed = 80 * (dir === 'LEFT' ? -1 : 1);

                        const [arr, waitTime] = Entry.PingpongG2.makeSingleStepPacket(
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
                class: 'PingpongG2_motor',
                isNotFor: ['PingpongG2'],
                func(sprite, script) {
                    return Entry.PingpongG2.postCallReturn(script, () => {
                        const speed1 = script.getNumberValue('SPEED_1');
                        const speed2 = script.getNumberValue('SPEED_2');

                        const arr1 = Entry.PingpongG2.makeContStepPacket(0, speed1);
                        const arr2 = Entry.PingpongG2.makeContStepPacket(1, speed2);

                        const opt = [MODE.MULTIROLE, 0, 0, 2];
                        const packet = Entry.PingpongG2.makeAggregatePacket(
                            OPCODE.AGGREGATE_STEPS,
                            0,
                            [arr1, arr2],
                            opt
                        );

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
                class: 'PingpongG2_motor',
                isNotFor: ['PingpongG2'],
                func(sprite, script) {
                    return Entry.PingpongG2.postCallReturn(script, () => {
                        const cubeId = script.getNumberField('CUBEID');
                        const speed = script.getNumberValue('SPEED');

                        const arr = Entry.PingpongG2.makeContStepPacket(cubeId, speed);

                        const packet = Buffer.from(arr);
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
                class: 'PingpongG2_motor',
                isNotFor: ['PingpongG2'],
                func(sprite, script) {
                    return Entry.PingpongG2.postCallReturn(script, () => {
                        const cubeId = script.getNumberField('CUBEID');

                        const arr = Entry.PingpongG2.makeContStepPacket(cubeId, 0);
                        const packet = Buffer.from(arr);

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
                class: 'PingpongG2_motor',
                isNotFor: ['PingpongG2'],
                func(sprite, script) {
                    return Entry.PingpongG2.postCallReturn(script, () => {
                        const cubeId = Entry.PingpongG2._getCubeNoFromBlock(script);
                        let angle = script.getNumberValue('DEGREE', script);

                        angle = Math.min(Math.max(angle, 0), 180);

                        const opt = [2, 0, angle, 1];
                        const packet = Entry.PingpongG2.makePacket(OPCODE.SERVO, 0x00, cubeId, opt);
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
                class: 'PingpongG2_peripheral_LED',
                isNotFor: ['PingpongG2'],
                func(sprite, script) {
                    return Entry.PingpongG2.postCallReturn(script, () => {
                        const cubeId = Entry.PingpongG2._getCubeNoFromBlock(script);
                        let dotX = script.getNumberValue('X', script);
                        let dotY = script.getNumberValue('Y', script);
                        const onoff = script.getNumberField('onoff', script);

                        dotX = Math.min(Math.max(dotX, 0), 7);
                        dotY = Math.min(Math.max(dotY, 0), 7);

                        const opt = [0x70, dotY, dotX, onoff];
                        const packet = Entry.PingpongG2.makePacket(
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
                class: 'PingpongG2_peripheral_LED',
                isNotFor: ['PingpongG2'],
                func(sprite, script) {
                    return Entry.PingpongG2.postCallReturn(script, () => {
                        const cubeId = Entry.PingpongG2._getCubeNoFromBlock(script);
                        const str = script.getStringValue('STR', script);
                        const duration = script.getNumberValue('DURATION', script);

                        let period = Math.round((duration * 100) / (str.length * 8));
                        period = Math.min(Math.max(period, 1), 200);

                        const opt = Buffer.concat([
                            Buffer.from([0x70, period, 0]),
                            Buffer.from(str.substring(0, 20)),
                        ]);

                        const packet = Entry.PingpongG2.makePacket(
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
                class: 'PingpongG2_peripheral_LED',
                isNotFor: ['PingpongG2'],
                func(sprite, script) {
                    return Entry.PingpongG2.postCallReturn(script, () => {
                        const cubeId = Entry.PingpongG2._getCubeNoFromBlock(script);
                        const opt = [0x70, 1, 0, ' '];
                        const packet = Entry.PingpongG2.makePacket(
                            OPCODE.LEDMATRIX,
                            0xe3,
                            cubeId,
                            opt
                        );
                        return [packet, 400];
                    });
                },
            },
            pingpong_g2_playNoteForBeats: {
                //'%1 큐브의 %2 번 음을 %3 박자로 연주하기 %4',
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
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
                def: { params: [], type: 'pingpong_g2_playNoteForBeats' },
                paramsKeyMap: { CUBEID: 0, NOTE: 1, BEATS: 2 },
                class: 'PingpongG2_Music',
                isNotFor: ['PingpongG2'],
                func(sprite, script) {
                    return Entry.PingpongG2.postCallReturn(script, () => {
                        const cubeId = script.getNumberField('CUBEID');
                        const NOTE = script.getNumberField('NOTE', script);
                        const BEATS = script.getNumberValue('BEATS', script);

                        const cBeats = Entry.PingpongG2._clampBeats(BEATS);
                        const durationSec = Entry.PingpongG2._beatsToDuration(cBeats);

                        const waitTime = durationSec * 10 + 30; //XXX
                        const arr = Entry.PingpongG2.makeMusicNotePacket(cubeId, NOTE, durationSec);
                        const packet = Buffer.from(arr);

                        return [packet, waitTime];
                    });
                },
            },
            pingpong_g2_playChordForBeats: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
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
                        options: Lang.Blocks.pingpong_opts_music_notes,
                        value: 48,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks.pingpong_g2_cube_id,
                        value: 1,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
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
                def: { params: [], type: 'pingpong_g2_playChordForBeats' },
                paramsKeyMap: {
                    CUBEID_1: 0,
                    NOTE_1: 1,
                    CUBEID_2: 2,
                    NOTE_2: 3,
                    BEATS: 4,
                },
                class: 'PingpongG2_Music',
                isNotFor: ['PingpongG2'],
                func(sprite, script) {
                    return Entry.PingpongG2.postCallReturn(script, () => {
                        const cubeId1 = script.getNumberField('CUBEID_1');
                        const cubeId2 = script.getNumberField('CUBEID_2');
                        const NOTE1 = script.getNumberField('NOTE_1', script);
                        const NOTE2 = script.getNumberField('NOTE_2', script);

                        const BEATS = script.getNumberValue('BEATS', script);
                        const cBeats = Entry.PingpongG2._clampBeats(BEATS);
                        const durationSec = Entry.PingpongG2._beatsToDuration(cBeats);

                        const waitTime = durationSec * 10 + 30;

                        const arr1 = Entry.PingpongG2.makeMusicNotePacket(
                            cubeId1,
                            NOTE1,
                            durationSec
                        );
                        const arr2 = Entry.PingpongG2.makeMusicNotePacket(
                            cubeId2,
                            NOTE2,
                            durationSec
                        );

                        const packet = Entry.PingpongG2.makeAggregatePacket(
                            OPCODE.MUSIC,
                            0xa2,
                            [arr1, arr2],
                            [0, 0]
                        );

                        return [packet, waitTime];
                    });
                },
            },
            pingpong_g2_restForBeats: {
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
                def: { params: [], type: 'pingpong_g2_restForBeats' },
                paramsKeyMap: { BEATS: 0 },
                class: 'PingpongG2_Music',
                isNotFor: ['PingpongG2'],
                func(sprite, script) {
                    return Entry.PingpongG2.postCallReturn(script, () => {
                        const BEATS = script.getNumberValue('BEATS', script);

                        const cBeats = Entry.PingpongG2._clampBeats(BEATS);
                        const durationSec = Entry.PingpongG2._beatsToDuration(cBeats);

                        const waitTime = durationSec * 10 + 30;

                        //XXX
                        return [null, waitTime];
                    });
                },
            },
            pingpong_g2_setTempo: {
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
                def: { params: [], type: 'pingpong_g2_setTempo' },
                paramsKeyMap: { TEMPO: 0 },
                class: 'PingpongG2_Music',
                isNotFor: ['PingpongG2'],
                func(sprite, script) {
                    let tempo = script.getNumberValue('TEMPO', script);
                    Entry.PingpongG2.tempo = Entry.PingpongG2._clampTempo(tempo);
                    return script.callReturn();
                },
            },
            pingpong_g2_getTempo: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_string_field',
                params: [],
                def: { params: [], type: 'pingpong_g2_getTempo' },
                paramsKeyMap: {},
                class: 'PingpongG2_Music',
                isNotFor: ['PingpongG2'],
                func(sprite, script) {
                    return Entry.PingpongG2.tempo;
                },
            },
        };
    }

    setLanguage() {
        return {
            ko: {
                template: {
                    pingpong_g2_when_button_pressed: '%1 %2 큐브 버튼을 눌렀을 때',
                    pingpong_g2_when_tilted: '%1 %2 큐브를 %3로 기울였을 때',
                    pingpong_g2_is_button_pressed: '%1 큐브 버튼이 눌렸는가?',
                    pingpong_g2_is_tilted: '%1 큐브가 %2로 기울어졌는가?',
                    pingpong_g2_is_top_shape: '%1 큐브의 윗면에 %2 모양이 있는가?',
                    pingpong_g2_get_tilt_value: '%1 큐브의 %2 방향 기울기',
                    pingpong_g2_get_sensor_value: '%1 큐브의 %2 센서값',
                    pingpong_g2_multi_motor_rotate:
                        '모터1을 %1 방향 %2 도, 모터2를 %3 방향 %4 도 회전하기 %5',
                    pingpong_g2_motor_rotate: '%1 모터를 %2 방향으로 %3 도 회전하기 %4',
                    pingpong_g2_start_multi_motor_rotate:
                        '모터1 속도를 %1, 모터2 속도를 %2으로 계속 회전하기 %3',
                    pingpong_g2_start_motor_rotate: '%1 모터의 속도를 %2으로 계속 회전하기 %3',
                    pingpong_g2_stop_motor_rotate: '%1 모터 멈추기 %2',
                    pingpong_g2_set_dot_pixel: '%1 번째 큐브의 도트 X:%2 Y:%3 %4 %5',
                    pingpong_g2_set_dot_string:
                        '%1 번째 큐브에 도트 문자열 %2 %3초동안 보여주기 %4',
                    pingpong_g2_set_dot_clear: '%1 번째 큐브의 화면 지우기 %2',
                    pingpong_g2_rotate_servo_mortor: '%1 번째 큐브의 서보모터 %2도로 설정하기 %3',
                    pingpong_g2_playNoteForBeats: '%1 큐브의 %2 음을 %3 박자로 연주하기 %4',
                    pingpong_g2_playChordForBeats: '%1 큐브 %2, %3 큐브 %4, %5 박자로 연주하기 %6',
                    pingpong_g2_restForBeats: '%1 박자 쉬기 %2',
                    pingpong_g2_setTempo: '악보 빠르기를 %1 으로 정하기 %2',
                    pingpong_g2_getTempo: '악보 빠르기',
                },
                Blocks: {
                    ...this.lang_defblock.ko,

                    pingpong_g2_cube_id: [
                        ['1번', 0],
                        ['2번', 1],
                    ],
                    pingpong_g2_cube_all: [
                        ['1번', 0],
                        ['2번', 1],
                        ['모든', -1],
                    ],
                },
            },
            en: {
                template: {
                    pingpong_g2_when_button_pressed: '%1 %2 cube button pressed',
                    pingpong_g2_when_tilted: '%1 %2 cube tilted to %3',
                    pingpong_g2_is_button_pressed: '%1 cube button pressed?',
                    pingpong_g2_is_tilted: '%1 cube tilted to %2',
                    pingpong_g2_is_top_shape: '%1 cube shown %2 in top view?',
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
                    pingpong_g2_playNoteForBeats: '%1 cube play note %2 for %3 beats %4',
                    pingpong_g2_playChordForBeats: '%1 cube %2, %3 cube %4 for %5 beats %6',
                    pingpong_g2_restForBeats: 'rest for %1 beats %2',
                    pingpong_g2_setTempo: 'set tempo to %1 %2',
                    pingpong_g2_getTempo: 'tempo',
                },
                Blocks: {
                    ...this.lang_defblock.en,

                    pingpong_g2_cube_id: [
                        ['1st', 0],
                        ['2nd', 1],
                    ],
                    pingpong_g2_cube_all: [
                        ['1st', 0],
                        ['2nd', 1],
                        ['All', -1],
                    ],
                },
            },
        };
    }
})();

Entry.PingpongG3 = new (class extends PingpongBase {
    constructor() {
        super(3);

        this.id = '35.3';
        this.name = 'PingpongG3';
        this.url = 'https://www.roborisen.com';
        this.imageName = 'pingpong_g3.png';
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
            'pingpong_g3_is_top_shape',
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
            'pingpong_g3_playNoteForBeats',
            'pingpong_g3_playChordForBeats',
            'pingpong_g3_restForBeats',
            'pingpong_g3_setTempo',
            'pingpong_g3_getTempo',
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
                class: 'PingpongG3',
                isNotFor: ['PingpongG3'],
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
                        options: Lang.Blocks.pingpong_opts_cube_tiltDir,
                        value: 'F_CIRCLE',
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
                class: 'PingpongG3',
                isNotFor: ['PingpongG3'],
                event: 'pp_when_tilted',
                func(sprite, script) {
                    const cubeId = script.getNumberField('CUBEID');
                    const tiltDir = script.getStringField('TILT_DIR');

                    const tiltValue = Entry.PingpongG3._getTiltValue(cubeId, tiltDir);
                    if (tiltValue >= Entry.PingpongG3.TILT_THRESHOLD) {
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
                class: 'PingpongG3',
                isNotFor: ['PingpongG3'],
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
                        options: Lang.Blocks.pingpong_opts_cube_tiltDir,
                        value: 'F_CIRCLE',
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
                class: 'PingpongG3',
                isNotFor: ['PingpongG3'],
                func(sprite, script) {
                    const cubeId = script.getNumberField('CUBEID');
                    const tiltDir = script.getStringField('TILT_DIR', script);

                    const tiltValue = Entry.PingpongG3._getTiltValue(cubeId, tiltDir);

                    return tiltValue >= Entry.PingpongG3.TILT_THRESHOLD;
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
                    type: 'pingpong_g3_get_tilt_value',
                },
                paramsKeyMap: { CUBEID: 0, DIR: 1 },
                class: 'PingpongG3',
                isNotFor: ['PingpongG3'],
                func(sprite, script) {
                    const cubeId = script.getNumberField('CUBEID');
                    const tiltDir = script.getStringField('DIR', script);

                    return Entry.PingpongG3._getTiltValue(cubeId, tiltDir);
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
                class: 'PingpongG3',
                isNotFor: ['PingpongG3'],
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
            pingpong_g3_is_top_shape: {
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
                        options: Lang.Blocks.pingpong_opts_cube_dir6,
                        value: 'DF_RECTANGLE',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                def: { params: [], type: 'pingpong_g3_is_top_shape' },
                paramsKeyMap: { CUBEID: 0, TILT_DIR: 1 },
                class: 'PingpongG3',
                isNotFor: ['PingpongG3'],
                func(sprite, script) {
                    const cubeId = script.getNumberField('CUBEID');
                    const tiltDir = script.getStringField('TILT_DIR', script);
                    return Entry.PingpongG3._isUpperDir(cubeId, tiltDir);
                },
            },
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
                class: 'PingpongG3_motor',
                isNotFor: ['PingpongG3'],
                func(sprite, script) {
                    return Entry.PingpongG3.postCallReturn(script, () => {
                        const dir1 = script.getStringField('DIR_1');
                        const dir2 = script.getStringField('DIR_2');
                        const dir3 = script.getStringField('DIR_3');
                        const degree1 = script.getNumberValue('DEGREE_1');
                        const degree2 = script.getNumberValue('DEGREE_2');
                        const degree3 = script.getNumberValue('DEGREE_3');

                        const speed1 = 80 * (dir1 === 'LEFT' ? -1 : 1);
                        const speed2 = 80 * (dir2 === 'LEFT' ? -1 : 1);
                        const speed3 = 80 * (dir3 === 'LEFT' ? -1 : 1);

                        const [arr1, delay1] = Entry.PingpongG3.makeSingleStepPacket(
                            0,
                            speed1,
                            degree1
                        );
                        const [arr2, delay2] = Entry.PingpongG3.makeSingleStepPacket(
                            1,
                            speed2,
                            degree2
                        );
                        const [arr3, delay3] = Entry.PingpongG3.makeSingleStepPacket(
                            2,
                            speed3,
                            degree3
                        );

                        const opt = [2, 1, 0, 2];
                        const packet = Entry.PingpongG3.makeAggregatePacket(
                            OPCODE.AGGREGATE_STEPS,
                            0,
                            [arr1, arr2, arr3],
                            opt
                        );

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
                class: 'PingpongG3_motor',
                isNotFor: ['PingpongG3'],
                func(sprite, script) {
                    return Entry.PingpongG3.postCallReturn(script, () => {
                        const cubeId = script.getNumberField('CUBEID');
                        const dir = script.getStringField('DIR');
                        const degree = script.getNumberValue('DEGREE');

                        const speed = 80 * (dir === 'LEFT' ? -1 : 1);
                        const [arr, waitTime] = Entry.PingpongG3.makeSingleStepPacket(
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
                class: 'PingpongG3_motor',
                isNotFor: ['PingpongG3'],
                func(sprite, script) {
                    return Entry.PingpongG3.postCallReturn(script, () => {
                        const speed1 = script.getNumberValue('SPEED_1');
                        const speed2 = script.getNumberValue('SPEED_2');
                        const speed3 = script.getNumberValue('SPEED_3');

                        const arr1 = Entry.PingpongG3.makeContStepPacket(0, speed1);
                        const arr2 = Entry.PingpongG3.makeContStepPacket(1, speed2);
                        const arr3 = Entry.PingpongG3.makeContStepPacket(2, speed3);

                        const opt = [2, 0, 0, 2];
                        const packet = Entry.PingpongG3.makeAggregatePacket(
                            OPCODE.AGGREGATE_STEPS,
                            0,
                            [arr1, arr2, arr3],
                            opt
                        );

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
                class: 'PingpongG3_motor',
                isNotFor: ['PingpongG3'],
                func(sprite, script) {
                    return Entry.PingpongG3.postCallReturn(script, () => {
                        const cubeId = script.getNumberField('CUBEID');
                        const speed = script.getNumberValue('SPEED');

                        const arr = Entry.PingpongG3.makeContStepPacket(cubeId, speed);
                        const packet = Buffer.from(arr);

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
                class: 'PingpongG3_motor',
                isNotFor: ['PingpongG3'],
                func(sprite, script) {
                    return Entry.PingpongG3.postCallReturn(script, () => {
                        const cubeId = script.getNumberField('CUBEID');

                        const arr = Entry.PingpongG3.makeContStepPacket(cubeId, 0);
                        const packet = Buffer.from(arr);

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
                class: 'PingpongG3_motor',
                isNotFor: ['PingpongG3'],
                func(sprite, script) {
                    return Entry.PingpongG3.postCallReturn(script, () => {
                        const cubeId = Entry.PingpongG3._getCubeNoFromBlock(script);
                        let angle = script.getNumberValue('DEGREE', script);

                        angle = Math.min(Math.max(angle, 0), 180);

                        const opt = [2, 0, angle, 1];
                        const packet = Entry.PingpongG3.makePacket(OPCODE.SERVO, 0x00, cubeId, opt);
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
                class: 'PingpongG3_peripheral_LED',
                isNotFor: ['PingpongG3'],
                func(sprite, script) {
                    return Entry.PingpongG3.postCallReturn(script, () => {
                        const cubeId = Entry.PingpongG3._getCubeNoFromBlock(script);
                        let dotX = script.getNumberValue('X', script);
                        let dotY = script.getNumberValue('Y', script);
                        const onoff = script.getNumberField('onoff', script);

                        dotX = Math.min(Math.max(dotX, 0), 7);
                        dotY = Math.min(Math.max(dotY, 0), 7);

                        const opt = [0x70, dotY, dotX, onoff];
                        const packet = Entry.PingpongG3.makePacket(
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
                class: 'PingpongG3_peripheral_LED',
                isNotFor: ['PingpongG3'],
                func(sprite, script) {
                    return Entry.PingpongG3.postCallReturn(script, () => {
                        const cubeId = Entry.PingpongG3._getCubeNoFromBlock(script);
                        const str = script.getStringValue('STR', script);
                        const duration = script.getNumberValue('DURATION', script);

                        let period = Math.round((duration * 100) / (str.length * 8));
                        period = Math.min(Math.max(period, 1), 200);

                        const opt = Buffer.concat([
                            Buffer.from([0x70, period, 0]),
                            Buffer.from(str.substring(0, 20)),
                        ]);

                        const packet = Entry.PingpongG3.makePacket(
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
                class: 'PingpongG3_peripheral_LED',
                isNotFor: ['PingpongG3'],
                func(sprite, script) {
                    return Entry.PingpongG3.postCallReturn(script, () => {
                        const cubeId = Entry.PingpongG3._getCubeNoFromBlock(script);
                        const opt = [0x70, 1, 0, ' '];
                        const packet = Entry.PingpongG3.makePacket(
                            OPCODE.LEDMATRIX,
                            0xe3,
                            cubeId,
                            opt
                        );
                        return [packet, 400];
                    });
                },
            },
            pingpong_g3_playNoteForBeats: {
                //'%1 큐브의 %2 번 음을 %3 박자로 연주하기 %4',
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
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
                def: { params: [], type: 'pingpong_g3_playNoteForBeats' },
                paramsKeyMap: { CUBEID: 0, NOTE: 1, BEATS: 2 },
                class: 'PingpongG3_Music',
                isNotFor: ['PingpongG3'],
                func(sprite, script) {
                    return Entry.PingpongG3.postCallReturn(script, () => {
                        const cubeId = script.getNumberField('CUBEID');
                        const NOTE = script.getNumberField('NOTE', script);
                        const BEATS = script.getNumberValue('BEATS', script);

                        const cBeats = Entry.PingpongG3._clampBeats(BEATS);
                        const durationSec = Entry.PingpongG3._beatsToDuration(cBeats);

                        const waitTime = durationSec * 10 + 30; //XXX
                        const arr = Entry.PingpongG3.makeMusicNotePacket(cubeId, NOTE, durationSec);
                        const packet = Buffer.from(arr);

                        return [packet, waitTime];
                    });
                },
            },
            pingpong_g3_playChordForBeats: {
                //'%1 큐브 %2, %3 큐브 %4, %5 큐브 %6 %7 박자로 연주하기 %8',
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
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
                        options: Lang.Blocks.pingpong_opts_music_notes,
                        value: 48,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks.pingpong_g3_cube_id,
                        value: 1,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks.pingpong_opts_music_notes,
                        value: 48,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks.pingpong_g3_cube_id,
                        value: 2,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
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
                def: { params: [], type: 'pingpong_g3_playChordForBeats' },
                paramsKeyMap: {
                    CUBEID_1: 0,
                    NOTE_1: 1,
                    CUBEID_2: 2,
                    NOTE_2: 3,
                    CUBEID_3: 4,
                    NOTE_3: 5,
                    BEATS: 6,
                },
                class: 'PingpongG3_Music',
                isNotFor: ['PingpongG3'],
                func(sprite, script) {
                    return Entry.PingpongG3.postCallReturn(script, () => {
                        const cubeId1 = script.getNumberField('CUBEID_1');
                        const cubeId2 = script.getNumberField('CUBEID_2');
                        const cubeId3 = script.getNumberField('CUBEID_3');
                        const NOTE1 = script.getNumberField('NOTE_1', script);
                        const NOTE2 = script.getNumberField('NOTE_2', script);
                        const NOTE3 = script.getNumberField('NOTE_3', script);

                        const BEATS = script.getNumberValue('BEATS', script);
                        const cBeats = Entry.PingpongG3._clampBeats(BEATS);
                        const durationSec = Entry.PingpongG3._beatsToDuration(cBeats);

                        const waitTime = durationSec * 10 + 30;

                        const arr1 = Entry.PingpongG3.makeMusicNotePacket(
                            cubeId1,
                            NOTE1,
                            durationSec
                        );
                        const arr2 = Entry.PingpongG3.makeMusicNotePacket(
                            cubeId2,
                            NOTE2,
                            durationSec
                        );
                        const arr3 = Entry.PingpongG3.makeMusicNotePacket(
                            cubeId3,
                            NOTE3,
                            durationSec
                        );

                        const packet = Entry.PingpongG3.makeAggregatePacket(
                            OPCODE.MUSIC,
                            0xa2,
                            [arr1, arr2, arr3],
                            [0, 0]
                        );

                        return [packet, waitTime];
                    });
                },
            },
            pingpong_g3_restForBeats: {
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
                def: { params: [], type: 'pingpong_g3_restForBeats' },
                paramsKeyMap: { BEATS: 0 },
                class: 'PingpongG3_Music',
                isNotFor: ['PingpongG3'],
                func(sprite, script) {
                    return Entry.PingpongG3.postCallReturn(script, () => {
                        const BEATS = script.getNumberValue('BEATS', script);

                        const cBeats = Entry.PingpongG3._clampBeats(BEATS);
                        const durationSec = Entry.PingpongG3._beatsToDuration(cBeats);

                        const waitTime = durationSec * 10 + 30;

                        //XXX
                        return [null, waitTime];
                    });
                },
            },
            pingpong_g3_setTempo: {
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
                def: { params: [], type: 'pingpong_g3_setTempo' },
                paramsKeyMap: { TEMPO: 0 },
                class: 'PingpongG3_Music',
                isNotFor: ['PingpongG3'],
                func(sprite, script) {
                    let tempo = script.getNumberValue('TEMPO', script);
                    Entry.PingpongG3.tempo = Entry.PingpongG3._clampTempo(tempo);
                    return script.callReturn();
                },
            },
            pingpong_g3_getTempo: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_string_field',
                params: [],
                def: { params: [], type: 'pingpong_g3_getTempo' },
                paramsKeyMap: {},
                class: 'PingpongG3_Music',
                isNotFor: ['PingpongG3'],
                func(sprite, script) {
                    return Entry.PingpongG3.tempo;
                },
            },
        };
    }

    setLanguage() {
        return {
            ko: {
                template: {
                    pingpong_g3_when_button_pressed: '%1 %2 큐브 버튼을 눌렀을 때',
                    pingpong_g3_when_tilted: '%1 %2 큐브를 %3로 기울였을 때',
                    pingpong_g3_is_button_pressed: '%1 큐브 버튼이 눌렸는가?',
                    pingpong_g3_is_tilted: '%1 큐브가 %2로 기울어졌는가?',
                    pingpong_g3_is_top_shape: '%1 큐브의 윗면에 %2 모양이 있는가?',
                    pingpong_g3_get_tilt_value: '%1 큐브의 %2 방향 기울기',
                    pingpong_g3_get_sensor_value: '%1 큐브의 %2 센서값',
                    pingpong_g3_multi_motor_rotate:
                        '모터1을 %1 방향 %2 도, 모터2를 %3 방향 %4 도, 모터3을 %5방향 %6도 회전하기 %7',
                    pingpong_g3_motor_rotate: '%1 모터를 %2 방향으로 %3 도 회전하기 %4',
                    pingpong_g3_start_multi_motor_rotate:
                        '모터1 속도를 %1, 모터2 속도를 %2, 모터3 속도를 %3으로 계속 회전하기 %4',
                    pingpong_g3_start_motor_rotate: '%1 모터의 속도를 %2으로 계속 회전하기 %3',
                    pingpong_g3_stop_motor_rotate: '%1 모터 멈추기 %2',
                    pingpong_g3_set_dot_pixel: '%1 번째 큐브의 도트 X:%2 Y:%3 %4 %5',
                    pingpong_g3_set_dot_string:
                        '%1 번째 큐브에 도트 문자열 %2 %3초동안 보여주기 %4',
                    pingpong_g3_set_dot_clear: '%1 번째 큐브의 화면 지우기 %2',
                    pingpong_g3_rotate_servo_mortor: '%1 번째 큐브의 서보모터 %2도로 설정하기 %3',
                    pingpong_g3_playNoteForBeats: '%1 큐브의 %2 음을 %3 박자로 연주하기 %4',
                    pingpong_g3_playChordForBeats:
                        '%1 큐브 %2, %3 큐브 %4, %5 큐브 %6 %7 박자로 연주하기 %8',
                    pingpong_g3_restForBeats: '%1 박자 쉬기 %2',
                    pingpong_g3_setTempo: '악보 빠르기를 %1 으로 정하기 %2',
                    pingpong_g3_getTempo: '악보 빠르기',
                },
                Blocks: {
                    ...this.lang_defblock.ko,

                    pingpong_g3_cube_id: [
                        ['1번', 0],
                        ['2번', 1],
                        ['3번', 2],
                    ],
                    pingpong_g3_cube_all: [
                        ['1번', 0],
                        ['2번', 1],
                        ['3번', 2],
                        ['모든', -1],
                    ],
                },
            },
            en: {
                template: {
                    pingpong_g3_when_button_pressed: '%1 %2 cube button pressed',
                    pingpong_g3_when_tilted: '%1 %2 cube tilted to %3',
                    pingpong_g3_is_button_pressed: '%1 cube button pressed?',
                    pingpong_g3_is_tilted: '%1 cube tilted to %2',
                    pingpong_g3_is_top_shape: '%1 cube shown %2 in top view?',
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
                    pingpong_g3_playNoteForBeats: '%1 cube play note %2 for %3 beats %4',
                    pingpong_g3_playChordForBeats:
                        '%1 cube %2, %3 cube %4, %5 cube %6 for %7 beats %8',
                    pingpong_g3_restForBeats: 'rest for %1 beats %2',
                    pingpong_g3_setTempo: 'set tempo to %1 %2',
                    pingpong_g3_getTempo: 'tempo',
                },
                Blocks: {
                    ...this.lang_defblock.en,

                    pingpong_g3_cube_id: [
                        ['1st', 0],
                        ['2nd', 1],
                        ['3rd', 2],
                    ],
                    pingpong_g3_cube_all: [
                        ['1st', 0],
                        ['2nd', 1],
                        ['3rd', 2],
                        ['All', -1],
                    ],
                },
            },
        };
    }
})();

Entry.PingpongG4 = new (class extends PingpongBase {
    constructor() {
        super(4);

        this.id = '35.4';
        this.name = 'PingpongG4';
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
            'pingpong_g4_is_top_shape',
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
            'pingpong_g4_playNoteForBeats',
            'pingpong_g4_playChordForBeats',
            'pingpong_g4_restForBeats',
            'pingpong_g4_setTempo',
            'pingpong_g4_getTempo',
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
                class: 'PingpongG4',
                isNotFor: ['PingpongG4'],
                event: 'pp_when_button_pressed',
                func(sprite, script) {
                    const cubeId = script.getNumberField('CUBEID');
                    const pd = Entry.hw.portData;

                    if (
                        (cubeId == 0 && pd.c0_BUTTON == 1) ||
                        (cubeId == 1 && pd.c1_BUTTON == 1) ||
                        (cubeId == 2 && pd.c2_BUTTON == 1) ||
                        (cubeId == 3 && pd.c3_BUTTON == 1)
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
                        options: Lang.Blocks.pingpong_opts_cube_tiltDir,
                        value: 'F_CIRCLE',
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
                class: 'PingpongG4',
                isNotFor: ['PingpongG4'],
                event: 'pp_when_tilted',
                func(sprite, script) {
                    const cubeId = script.getNumberField('CUBEID');
                    const tiltDir = script.getStringField('TILT_DIR');

                    const tiltValue = Entry.PingpongG4._getTiltValue(cubeId, tiltDir);
                    if (tiltValue >= Entry.PingpongG4.TILT_THRESHOLD) {
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
                class: 'PingpongG4',
                isNotFor: ['PingpongG4'],
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
                        options: Lang.Blocks.pingpong_opts_cube_tiltDir,
                        value: 'F_CIRCLE',
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
                class: 'PingpongG4',
                isNotFor: ['PingpongG4'],
                func(sprite, script) {
                    const cubeId = script.getNumberField('CUBEID');
                    const tiltDir = script.getStringField('TILT_DIR', script);

                    const tiltValue = Entry.PingpongG4._getTiltValue(cubeId, tiltDir);

                    return tiltValue >= Entry.PingpongG4.TILT_THRESHOLD;
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
                    type: 'pingpong_g4_get_tilt_value',
                },
                paramsKeyMap: { CUBEID: 0, DIR: 1 },
                class: 'PingpongG4',
                isNotFor: ['PingpongG4'],
                func(sprite, script) {
                    const cubeId = script.getNumberField('CUBEID');
                    const tiltDir = script.getStringField('DIR', script);

                    return Entry.PingpongG4._getTiltValue(cubeId, tiltDir);
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
                class: 'PingpongG4',
                isNotFor: ['PingpongG4'],
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
            pingpong_g4_is_top_shape: {
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
                        options: Lang.Blocks.pingpong_opts_cube_dir6,
                        value: 'DF_RECTANGLE',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                def: { params: [], type: 'pingpong_g4_is_top_shape' },
                paramsKeyMap: { CUBEID: 0, TILT_DIR: 1 },
                class: 'PingpongG4',
                isNotFor: ['PingpongG4'],
                func(sprite, script) {
                    const cubeId = script.getNumberField('CUBEID');
                    const tiltDir = script.getStringField('TILT_DIR', script);
                    return Entry.PingpongG4._isUpperDir(cubeId, tiltDir);
                },
            },
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
                class: 'PingpongG4_motor',
                isNotFor: ['PingpongG4'],
                func(sprite, script) {
                    return Entry.PingpongG4.postCallReturn(script, () => {
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

                        const [arr1, delay1] = Entry.PingpongG4.makeSingleStepPacket(
                            0,
                            speed1,
                            degree1
                        );
                        const [arr2, delay2] = Entry.PingpongG4.makeSingleStepPacket(
                            1,
                            speed2,
                            degree2
                        );
                        const [arr3, delay3] = Entry.PingpongG4.makeSingleStepPacket(
                            2,
                            speed3,
                            degree3
                        );
                        const [arr4, delay4] = Entry.PingpongG4.makeSingleStepPacket(
                            3,
                            speed4,
                            degree4
                        );

                        const opt = [MODE.MULTIROLE, 1, 0, 2];
                        const packet = Entry.PingpongG4.makeAggregatePacket(
                            OPCODE.AGGREGATE_STEPS,
                            0,
                            [arr1, arr2, arr3, arr4],
                            opt
                        );
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
                class: 'PingpongG4_motor',
                isNotFor: ['PingpongG4'],
                func(sprite, script) {
                    return Entry.PingpongG4.postCallReturn(script, () => {
                        const cubeId = script.getNumberField('CUBEID');
                        const dir = script.getStringField('DIR');
                        const degree = script.getNumberValue('DEGREE');
                        const speed = 80 * (dir === 'LEFT' ? -1 : 1);

                        const [arr, waitTime] = Entry.PingpongG4.makeSingleStepPacket(
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
                class: 'PingpongG4_motor',
                isNotFor: ['PingpongG4'],
                func(sprite, script) {
                    return Entry.PingpongG4.postCallReturn(script, () => {
                        const speed1 = script.getNumberValue('SPEED_1');
                        const speed2 = script.getNumberValue('SPEED_2');
                        const speed3 = script.getNumberValue('SPEED_3');
                        const speed4 = script.getNumberValue('SPEED_4');

                        const arr1 = Entry.PingpongG4.makeContStepPacket(0, speed1);
                        const arr2 = Entry.PingpongG4.makeContStepPacket(1, speed2);
                        const arr3 = Entry.PingpongG4.makeContStepPacket(2, speed3);
                        const arr4 = Entry.PingpongG4.makeContStepPacket(3, speed4);

                        const opt = [MODE.MULTIROLE, 0, 0, 2];
                        const packet = Entry.PingpongG4.makeAggregatePacket(
                            OPCODE.AGGREGATE_STEPS,
                            0,
                            [arr1, arr2, arr3, arr4],
                            opt
                        );

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
                class: 'PingpongG4_motor',
                isNotFor: ['PingpongG4'],
                func(sprite, script) {
                    return Entry.PingpongG4.postCallReturn(script, () => {
                        const cubeId = script.getNumberField('CUBEID');
                        const speed = script.getNumberValue('SPEED');

                        const arr = Entry.PingpongG4.makeContStepPacket(cubeId, speed);
                        const packet = Buffer.from(arr);

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
                class: 'PingpongG4_motor',
                isNotFor: ['PingpongG4'],
                func(sprite, script) {
                    return Entry.PingpongG4.postCallReturn(script, () => {
                        const cubeId = script.getNumberField('CUBEID');

                        const arr = Entry.PingpongG4.makeContStepPacket(cubeId, 0);
                        const packet = Buffer.from(arr);

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
                class: 'PingpongG4_motor',
                isNotFor: ['PingpongG4'],
                func(sprite, script) {
                    return Entry.PingpongG4.postCallReturn(script, () => {
                        const cubeId = Entry.PingpongG4._getCubeNoFromBlock(script);
                        let angle = script.getNumberValue('DEGREE', script);

                        angle = Math.min(Math.max(angle, 0), 180);

                        const opt = [2, 0, angle, 1];
                        const packet = Entry.PingpongG4.makePacket(OPCODE.SERVO, 0x00, cubeId, opt);
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
                class: 'PingpongG4_peripheral_LED',
                isNotFor: ['PingpongG4'],
                func(sprite, script) {
                    return Entry.PingpongG4.postCallReturn(script, () => {
                        const cubeId = Entry.PingpongG4._getCubeNoFromBlock(script);
                        let dotX = script.getNumberValue('X', script);
                        let dotY = script.getNumberValue('Y', script);
                        const onoff = script.getNumberField('onoff', script);

                        dotX = Math.min(Math.max(dotX, 0), 7);
                        dotY = Math.min(Math.max(dotY, 0), 7);

                        const opt = [0x70, dotY, dotX, onoff];
                        const packet = Entry.PingpongG4.makePacket(
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
                class: 'PingpongG4_peripheral_LED',
                isNotFor: ['PingpongG4'],
                func(sprite, script) {
                    return Entry.PingpongG4.postCallReturn(script, () => {
                        const cubeId = Entry.PingpongG4._getCubeNoFromBlock(script);
                        const str = script.getStringValue('STR', script);
                        const duration = script.getNumberValue('DURATION', script);

                        let period = Math.round((duration * 100) / (str.length * 8));
                        period = Math.min(Math.max(period, 1), 200);

                        const opt = Buffer.concat([
                            Buffer.from([0x70, period, 0]),
                            Buffer.from(str.substring(0, 20)),
                        ]);

                        const packet = Entry.PingpongG4.makePacket(
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
                class: 'PingpongG4_peripheral_LED',
                isNotFor: ['PingpongG4'],
                func(sprite, script) {
                    return Entry.PingpongG4.postCallReturn(script, () => {
                        const cubeId = Entry.PingpongG4._getCubeNoFromBlock(script);
                        const opt = [0x70, 1, 0, ' '];
                        const packet = Entry.PingpongG4.makePacket(
                            OPCODE.LEDMATRIX,
                            0xe3,
                            cubeId,
                            opt
                        );
                        return [packet, 400];
                    });
                },
            },
            pingpong_g4_playNoteForBeats: {
                //'%1 큐브의 %2 번 음을 %3 박자로 연주하기 %4',
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
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
                def: { params: [], type: 'pingpong_g4_playNoteForBeats' },
                paramsKeyMap: { CUBEID: 0, NOTE: 1, BEATS: 2 },
                class: 'PingpongG4_Music',
                isNotFor: ['PingpongG4'],
                func(sprite, script) {
                    return Entry.PingpongG4.postCallReturn(script, () => {
                        const cubeId = script.getNumberField('CUBEID');
                        const NOTE = script.getNumberField('NOTE', script);
                        const BEATS = script.getNumberValue('BEATS', script);

                        const cBeats = Entry.PingpongG4._clampBeats(BEATS);
                        const durationSec = Entry.PingpongG4._beatsToDuration(cBeats);

                        const waitTime = durationSec * 10 + 30; //XXX
                        const arr = Entry.PingpongG4.makeMusicNotePacket(cubeId, NOTE, durationSec);
                        const packet = Buffer.from(arr);

                        return [packet, waitTime];
                    });
                },
            },
            pingpong_g4_playChordForBeats: {
                //'%1 큐브 %2, %3 큐브 %4, %5 큐브 %6 %7 박자로 연주하기 %8',
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
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
                        options: Lang.Blocks.pingpong_opts_music_notes,
                        value: 48,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks.pingpong_g4_cube_id,
                        value: 1,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks.pingpong_opts_music_notes,
                        value: 48,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks.pingpong_g4_cube_id,
                        value: 2,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
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
                def: { params: [], type: 'pingpong_g4_playChordForBeats' },
                paramsKeyMap: {
                    CUBEID_1: 0,
                    NOTE_1: 1,
                    CUBEID_2: 2,
                    NOTE_2: 3,
                    CUBEID_3: 4,
                    NOTE_3: 5,
                    BEATS: 6,
                },
                class: 'PingpongG4_Music',
                isNotFor: ['PingpongG4'],
                func(sprite, script) {
                    return Entry.PingpongG4.postCallReturn(script, () => {
                        const cubeId1 = script.getNumberField('CUBEID_1');
                        const cubeId2 = script.getNumberField('CUBEID_2');
                        const cubeId3 = script.getNumberField('CUBEID_3');
                        const NOTE1 = script.getNumberField('NOTE_1', script);
                        const NOTE2 = script.getNumberField('NOTE_2', script);
                        const NOTE3 = script.getNumberField('NOTE_3', script);

                        const BEATS = script.getNumberValue('BEATS', script);
                        const cBeats = Entry.PingpongG4._clampBeats(BEATS);
                        const durationSec = Entry.PingpongG4._beatsToDuration(cBeats);

                        const waitTime = durationSec * 10 + 30;

                        const arr1 = Entry.PingpongG4.makeMusicNotePacket(
                            cubeId1,
                            NOTE1,
                            durationSec
                        );
                        const arr2 = Entry.PingpongG4.makeMusicNotePacket(
                            cubeId2,
                            NOTE2,
                            durationSec
                        );
                        const arr3 = Entry.PingpongG4.makeMusicNotePacket(
                            cubeId3,
                            NOTE3,
                            durationSec
                        );

                        const packet = Entry.PingpongG4.makeAggregatePacket(
                            OPCODE.MUSIC,
                            0xa2,
                            [arr1, arr2, arr3],
                            [0, 0]
                        );

                        return [packet, waitTime];
                    });
                },
            },
            pingpong_g4_restForBeats: {
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
                def: { params: [], type: 'pingpong_g4_restForBeats' },
                paramsKeyMap: { BEATS: 0 },
                class: 'PingpongG4_Music',
                isNotFor: ['PingpongG4'],
                func(sprite, script) {
                    return Entry.PingpongG4.postCallReturn(script, () => {
                        const BEATS = script.getNumberValue('BEATS', script);

                        const cBeats = Entry.PingpongG4._clampBeats(BEATS);
                        const durationSec = Entry.PingpongG4._beatsToDuration(cBeats);

                        const waitTime = durationSec * 10 + 30;

                        //XXX
                        return [null, waitTime];
                    });
                },
            },
            pingpong_g4_setTempo: {
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
                def: { params: [], type: 'pingpong_g4_setTempo' },
                paramsKeyMap: { TEMPO: 0 },
                class: 'PingpongG4_Music',
                isNotFor: ['PingpongG4'],
                func(sprite, script) {
                    let tempo = script.getNumberValue('TEMPO', script);
                    Entry.PingpongG4.tempo = Entry.PingpongG4._clampTempo(tempo);
                    return script.callReturn();
                },
            },
            pingpong_g4_getTempo: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_string_field',
                params: [],
                def: { params: [], type: 'pingpong_g4_getTempo' },
                paramsKeyMap: {},
                class: 'PingpongG4_Music',
                isNotFor: ['PingpongG4'],
                func(sprite, script) {
                    return Entry.PingpongG4.tempo;
                },
            },
        };
    }

    setLanguage() {
        return {
            ko: {
                template: {
                    pingpong_g4_when_button_pressed: '%1 %2 큐브 버튼을 눌렀을 때',
                    pingpong_g4_when_tilted: '%1 %2 큐브를 %3로 기울였을 때',
                    pingpong_g4_is_button_pressed: '%1 큐브 버튼이 눌렸는가?',
                    pingpong_g4_is_tilted: '%1 큐브가 %2로 기울어졌는가?',
                    pingpong_g4_is_top_shape: '%1 큐브의 윗면에 %2 모양이 있는가?',
                    pingpong_g4_get_tilt_value: '%1 큐브의 %2 방향 기울기',
                    pingpong_g4_get_sensor_value: '%1 큐브의 %2 센서값',
                    pingpong_g4_multi_motor_rotate:
                        '모터1은 %1방향 %2도, 모터2는 %3방향 %4도, ' +
                        '모터3은 %5방향 %6도, 모터4는 %7방향 %8도 회전하기 %9',
                    pingpong_g4_motor_rotate: '%1 모터를 %2 방향으로 %3 도 회전하기 %4',
                    pingpong_g4_start_multi_motor_rotate:
                        '모터1 속도를 %1, 모터2 속도를 %2, 모터3 속도를 %3, 모터4 속도를 %4으로 계속 회전하기 %5',
                    pingpong_g4_start_motor_rotate: '%1 모터의 속도를 %2으로 계속 회전하기 %3',
                    pingpong_g4_stop_motor_rotate: '%1 모터 멈추기 %2',
                    pingpong_g4_set_dot_pixel: '%1 번째 큐브의 도트 X:%2 Y:%3 %4 %5',
                    pingpong_g4_set_dot_string:
                        '%1 번째 큐브에 도트 문자열 %2 %3초동안 보여주기 %4',
                    pingpong_g4_set_dot_clear: '%1 번째 큐브의 화면 지우기 %2',
                    pingpong_g4_rotate_servo_mortor: '%1 번째 큐브의 서보모터 %2도로 설정하기 %3',
                    pingpong_g4_playNoteForBeats: '%1 큐브의 %2 음을 %3 박자로 연주하기 %4',
                    pingpong_g4_playChordForBeats:
                        '%1 큐브 %2, %3 큐브 %4, %5 큐브 %6 %7 박자로 연주하기 %8',
                    pingpong_g4_restForBeats: '%1 박자 쉬기 %2',
                    pingpong_g4_setTempo: '악보 빠르기를 %1 으로 정하기 %2',
                    pingpong_g4_getTempo: '악보 빠르기',
                },
                Blocks: {
                    ...this.lang_defblock.ko,

                    pingpong_g4_cube_id: [
                        ['1번', 0],
                        ['2번', 1],
                        ['3번', 2],
                        ['4번', 3],
                    ],
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
                    pingpong_g4_is_top_shape: '%1 cube shown %2 in top view?',
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
                    pingpong_g4_playNoteForBeats: '%1 cube play note %2 for %3 beats %4',
                    pingpong_g4_playChordForBeats:
                        '%1 cube %2, %3 cube %4, %5 cube %6 for %7 beats %8',
                    pingpong_g4_restForBeats: 'rest for %1 beats %2',
                    pingpong_g4_setTempo: 'set tempo to %1 %2',
                    pingpong_g4_getTempo: 'tempo',
                },
                Blocks: {
                    ...this.lang_defblock.en,

                    pingpong_g4_cube_id: [
                        ['1st', 0],
                        ['2nd', 1],
                        ['3rd', 2],
                        ['4th', 3],
                    ],
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

module.exports = [Entry.PingpongG2, Entry.PingpongG3, Entry.PingpongG4];
