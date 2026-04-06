'use strict';

import _range from 'lodash/range';

(function() {
    const PingpongConnectLite = require('./block_pingpongConnect_lite');
    Entry.PingpongPracticalartsLite = new (class PingpongPracticalartsLite extends PingpongConnectLite {
        constructor() {
            super(1,'PingpongPracticalartsLite');
            this.id = '350501';
            this.imageName = 'PingpongPracticalartsLite.png';

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
                'set_steering_direction',
                'move_by_distance',
                'pingpong_g1_set_dot_pixel',
                'pingpong_g1_set_dot_string',
                'pingpong_g1_set_dot_clear',
                'pingpong_g1_playNoteForBeats',
                'pingpong_g1_restForBeats',
                'pingpong_g1_setTempo',
                'pingpong_g1_getTempo',
            ];
        }
        getBlocks() {
            const self = this;
            return {
                pingpong_lite_g1_when_button_pressed: {
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
                        type: 'pingpong_lite_g1_when_button_pressed',
                    },
                    class: 'PingpongG1',
                    isNotFor: ['PingpongG1Lite', 'PingpongPracticalartsLite'],
                    event: 'pp_when_button_pressed',
                    func(sprite, script) {
                        const cubeId = script.getNumberField('CUBEID');
                        const pd = self.sensor_data;

                        return (pd[cubeId]?.BUTTON == 1)
                            ? script.callReturn()
                            : this.die();
                    },
                },
                pingpong_lite_g1_when_tilted: {
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
                        type: 'pingpong_lite_g1_when_tilted',
                    },
                    paramsKeyMap: {
                        TILT_DIR: 1,
                    },
                    class: 'PingpongG1',
                    isNotFor: ['PingpongG1Lite', 'PingpongPracticalartsLite'],
                    event: 'pp_when_tilted',
                    func(sprite, script) {
                        const cubeId = script.getNumberField('CUBEID');
                        const tiltDir = script.getStringField('TILT_DIR');

                        const tiltValue = self._getTiltValue(cubeId, tiltDir);
                        if (tiltValue >= self.TILT_THRESHOLD) {
                            return script.callReturn();
                        }

                        return this.die();
                    },
                },
                pingpong_lite_g1_is_button_pressed: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_boolean_field',
                    def: {
                        type: 'pingpong_lite_g1_is_button_pressed',
                    },
                    class: 'PingpongG1',
                    isNotFor: ['PingpongG1Lite', 'PingpongPracticalartsLite'],
                    func(sprite, script) {
                        const cubeId = script.getNumberField('CUBEID');
                        return self.sensor_data[cubeId].BUTTON == 1;
                    },
                },
                pingpong_lite_g1_is_tilted: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_boolean_field',
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
                    def: { params: [], type: 'pingpong_lite_g1_is_tilted' },
                    paramsKeyMap: {
                        TILT_DIR: 0,
                    },
                    class: 'PingpongG1',
                    isNotFor: ['PingpongG1Lite', 'PingpongPracticalartsLite'],
                    func(sprite, script) {
                        const cubeId = script.getNumberField('CUBEID');
                        const tiltDir = script.getStringField('TILT_DIR');

                        const tiltValue = self._getTiltValue(cubeId, tiltDir);

                        return tiltValue >= self.TILT_THRESHOLD;
                    },
                },
                pingpong_lite_g1_get_tilt_value: {
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
                    events: {},
                    def: {
                        params: [null],
                        type: 'pingpong_lite_g1_get_tilt_value',
                    },
                    paramsKeyMap: { DIR: 0 },
                    class: 'PingpongG1',
                    isNotFor: ['PingpongG1Lite', 'PingpongPracticalartsLite'],
                    func(sprite, script) {
                        const cubeId = script.getNumberField('CUBEID');
                        const tiltDir = script.getStringField('DIR', script);

                        return self._getTiltValue(cubeId, tiltDir);
                    },
                },
                pingpong_lite_g1_get_sensor_value: {
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
                    def: { params: [], type: 'pingpong_lite_g1_get_sensor_value' },
                    paramsKeyMap: { SENSOR: 0 },
                    class: 'PingpongG1',
                    isNotFor: ['PingpongG1Lite', 'PingpongPracticalartsLite'],
                    func(sprite, script) {
                        const cubeId = script.getNumberField('CUBEID');
                        const sensorType = script.getStringField('SENSOR', script);
                        const pd = self.sensor_data;

                        return pd[cubeId][sensorType];
                    },
                },
                pingpong_lite_g1_is_top_shape: {
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
                    def: { params: [], type: 'pingpong_lite_g1_is_top_shape' },
                    paramsKeyMap: {
                        TILT_DIR: 0,
                    },
                    class: 'PingpongG1',
                    isNotFor: ['PingpongG1Lite', 'PingpongPracticalartsLite'],
                    func(sprite, script) {
                        const cubeId = script.getNumberField('CUBEID');
                        const tiltDir = script.getStringField('TILT_DIR', script);
                        return self._isUpperDir(cubeId, tiltDir);
                    },
                },
                pingpong_lite_g1_motor_rotate: {
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
                        },
                        { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
                    ],
                    def: {
                        params: [
                            null,
                            {
                                type: 'number',
                                params: ['10'],
                            },
                        ],
                        type: 'pingpong_lite_g1_motor_rotate',
                    },
                    paramsKeyMap: { DIR: 0, DEGREE: 1 },
                    class: 'PingpongG1_motor',
                    isNotFor: ['PingpongG1Lite', 'PingpongPracticalartsLite'],
                    func(sprite, script) {
                        return self.postCallReturn(script, () => {
                            const cubeId = script.getNumberField('CUBEID');
                            const dir = script.getStringField('DIR');
                            const degree = script.getNumberValue('DEGREE');
                            const speed = 80 * (dir === 'LEFT' ? -1 : 1);

                            const [arr, waitTime] = self.makeSingleStepPacket(cubeId,speed,degree);
                            const packet = Buffer.from(arr);
                            return [packet, waitTime];
                        });
                    },
                },

                pingpong_lite_g1_start_motor_rotate: {
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
                        type: 'pingpong_lite_g1_start_motor_rotate',
                    },
                    paramsKeyMap: { SPEED: 0 },
                    class: 'PingpongG1_motor',
                    isNotFor: ['PingpongG1Lite', 'PingpongPracticalartsLite'],
                    func(sprite, script) {
                        return self.postCallReturn(script, () => {
                            const cubeId = script.getNumberField('CUBEID');
                            const speed = script.getNumberValue('SPEED');

                            const arr = self.makeContStepPacket(cubeId, speed);
                            const packet = Buffer.from(arr);

                            return [packet];
                        });
                    },
                },
                pingpong_lite_g1_stop_motor_rotate: {
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
                        type: 'pingpong_lite_g1_stop_motor_rotate',
                    },
                    paramsKeyMap: {},
                    class: 'PingpongG1_motor',
                    isNotFor: ['PingpongG1Lite', 'PingpongPracticalartsLite'],
                    func(sprite, script) {
                        return self.postCallReturn(script, () => {
                            const cubeId = script.getNumberField('CUBEID');

                            const arr = self.makeContStepPacket(cubeId, 0);
                            const packet = Buffer.from(arr);

                            return [packet];
                        });
                    },
                },

                pingpong_lite_g1_rotate_servo_mortor: {
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
                    def: { params: [{ type: 'angle' }], type: 'pingpong_lite_g1_rotate_servo_mortor' },
                    paramsKeyMap: { DEGREE: 0 },
                    class: 'PingpongG1_motor',
                    isNotFor: ['PingpongG1Lite', 'PingpongPracticalartsLite'],
                    func(sprite, script) {
                        return self.postCallReturn(script, () => {
                            const cubeId = self._getCubeNoFromBlock(script);
                            let angle = script.getNumberValue('DEGREE', script);

                            angle = Math.min(Math.max(angle, 0), 180);

                            const opt = [1, 0, angle, 0];
                            const packet = self.makePacket(self.OPCODE.SERVO, 0x00, cubeId, opt);
                            return [packet];
                        });
                    },
                },

                pingpong_lite_g1_set_dot_pixel: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
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
                    def: {
                        params: [null, null, null],
                        type: 'pingpong_lite_g1_set_dot_pixel',
                    },
                    paramsKeyMap: { X: 0, Y: 1, onoff: 2 },
                    class: 'PingpongG1_peripheral_LED',
                    isNotFor: ['PingpongG1Lite', 'PingpongPracticalartsLite'],
                    func(sprite, script) {
                        return self.postCallReturn(script, () => {
                            const cubeId = self._getCubeNoFromBlock(script);
                            let dotX = script.getNumberValue('X', script);
                            let dotY = script.getNumberValue('Y', script);
                            const onoff = script.getNumberField('onoff', script);

                            dotX = Math.min(Math.max(dotX, 0), 7);
                            dotY = Math.min(Math.max(dotY, 0), 7);

                            const opt = [0x70, dotY, dotX, onoff];
                            const packet = self.makePacket(
                                self.OPCODE.LEDMATRIX,
                                0xe1,
                                cubeId,
                                opt
                            );
                            return [packet];
                        });
                    },
                },
                pingpong_lite_g1_set_dot_string: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    params: [
                        { type: 'Block', accept: 'string', value: 'Hello!' },
                        { type: 'Block', accept: 'string', defaultType: 'number', value: '2' },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardware_icon.svg',
                            size: 12,
                        },
                    ],
                    def: { params: [null, null], type: 'pingpong_lite_g1_set_dot_string' },
                    paramsKeyMap: { STR: 0, DURATION: 1 },
                    class: 'PingpongG1_peripheral_LED',
                    isNotFor: ['PingpongG1Lite', 'PingpongPracticalartsLite'],
                    func(sprite, script) {
                        return self.postCallReturn(script, () => {
                            const cubeId = self._getCubeNoFromBlock(script);
                            const str = script.getStringValue('STR', script);
                            const duration = script.getNumberValue('DURATION', script);

                            let period = Math.round((duration * 100) / (str.length * 8));
                            period = Math.min(Math.max(period, 1), 200);

                            const opt = Buffer.concat([
                                Buffer.from([0x70, period, 0]),
                                Buffer.from(str.substring(0, 20)),
                            ]);

                            const packet = self.makePacket(
                                self.OPCODE.LEDMATRIX,
                                0xe3,
                                cubeId,
                                opt
                            );
                            const waitTime = period * str.length * 8 * 10 + 400; // add wait for 400ms
                            return [packet, waitTime];
                        });
                    },
                },
                pingpong_lite_g1_set_dot_clear: {
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
                    def: { params: [], type: 'pingpong_lite_g1_set_dot_clear' },
                    paramsKeyMap: {},
                    class: 'PingpongG1_peripheral_LED',
                    isNotFor: ['PingpongG1Lite', 'PingpongPracticalartsLite'],
                    func(sprite, script) {
                        return self.postCallReturn(script, () => {
                            const cubeId = self._getCubeNoFromBlock(script);
                            const opt = [0x70, 1, 0, ' '];
                            const packet = self.makePacket(
                                self.OPCODE.LEDMATRIX,
                                0xe3,
                                cubeId,
                                opt
                            );
                            return [packet, 400];
                        });
                    },
                },
                pingpong_lite_g1_playNoteForBeats: {
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
                    def: { params: [], type: 'pingpong_lite_g1_playNoteForBeats' },
                    paramsKeyMap: { NOTE: 0, BEATS: 1 },
                    class: 'PingpongG1_Music',
                    isNotFor: ['PingpongG1Lite', 'PingpongPracticalartsLite'],
                    func(sprite, script) {
                        return self.postCallReturn(script, () => {
                            const cubeId = script.getNumberField('CUBEID');
                            const NOTE = script.getNumberField('NOTE', script);
                            const BEATS = script.getNumberValue('BEATS', script);

                            const cBeats = self._clampBeats(BEATS);
                            const durationSec = self._beatsToDuration(cBeats);

                            const waitTime = durationSec * 10 + 60;
                            const arr = self.makeMusicNotePacket(cubeId, NOTE, durationSec);
                            const packet = Buffer.from(arr);

                            return [packet, waitTime];
                        });
                    },
                },
                pingpong_lite_g1_restForBeats: {
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
                    def: { params: [], type: 'pingpong_lite_g1_restForBeats' },
                    paramsKeyMap: { BEATS: 0 },
                    class: 'PingpongG1_Music',
                    isNotFor: ['PingpongG1Lite', 'PingpongPracticalartsLite'],
                    func(sprite, script) {
                        return self.postCallReturn(script, () => {
                            const BEATS = script.getNumberValue('BEATS', script);

                            const cBeats = self._clampBeats(BEATS);
                            const durationSec = self._beatsToDuration(cBeats);

                            const waitTime = durationSec * 10 + 60;

                            return [null, waitTime];
                        });
                    },
                },
                pingpong_lite_g1_setTempo: {
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
                    def: { params: [], type: 'pingpong_lite_g1_setTempo' },
                    paramsKeyMap: { TEMPO: 0 },
                    class: 'PingpongG1_Music',
                    isNotFor: ['PingpongG1Lite', 'PingpongPracticalartsLite'],
                    func(sprite, script) {
                        let tempo = script.getNumberValue('TEMPO', script);
                        self.tempo = self._clampTempo(tempo);
                        return script.callReturn();
                    },
                },
                pingpong_lite_g1_getTempo: {
                    //'악보 빠르기',
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    params: [],
                    def: { params: [], type: 'pingpong_lite_g1_getTempo' },
                    paramsKeyMap: {},
                    class: 'PingpongG1_Music',
                    isNotFor: ['PingpongG1Lite', 'PingpongPracticalartsLite'],
                    func(sprite, script) {
                        return self.tempo;
                    },
                },

                set_steering_direction: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: Lang.Blocks.pingpong_opts_mono,
                            value: 90,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12, },
                    ],
                    events: {},
                    def: { params: [], type: 'set_steering_direction' },
                    paramsKeyMap: { DEGREE: 0,},
                    class: 'PingpongG1_motor',
                    isNotFor: ['PingpongPracticalArtsLite'],
                    func(sprite, script) {
                        return self.postCallReturn(script, () => {
                            let angle = script.getNumberValue('DEGREE', script);

                            angle = Math.min(Math.max(angle, 0), 180);

                            const packet = self.makePacket(0xe1, 0x00, [2, 0, angle, 1]);
                            return [packet, 400];
                        });
                    },
                },

                move_by_distance: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: Lang.Blocks.pingpong_direction,
                            value: Lang.Blocks.pingpong_direction[0][1],
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        { type: 'Block', accept: 'string', defaultType: 'number', value: 10 },
                        { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12, },
                    ],
                    events: {},
                    def: { params: [], type: 'move_by_distance' },
                    paramsKeyMap: { DIR: 0, CM: 1 },
                    class: 'PingpongG1_motor',
                    isNotFor: ['PingpongPracticalArtsLite'],
                    func(sprite, script) {
                        return self.postCallReturn(script, () => {
                            const direction = script.getStringField('DIR');
                            let degree = script.getNumberValue('CM');
                            degree = degree*9; // convert cm to degree

                            let speed = 800;
                            if (direction == 'back') {
                                speed *= -1;
                            }

                            degree = Math.min(Math.max(degree, 0), 5000);

                            let step = Math.round(degree * 5.5);
                            if (step > 32768) {
                                step = 32768;
                            }

                            const opt = [2, 1, 0, 2, 0, 0, 0, 0, 0, 0];
                            const packet = self.makePacket(0xc1, 0x0004, opt); // SETP_MOTOR

                            packet.writeInt16BE(speed, 13);
                            packet.writeUInt16BE(step, 17);

                            const waitTime = Math.round(((1100 - Math.abs(speed)) / 99) * step) + 400;
                            return [packet, waitTime];
                        });
                    },
                },
            };
        }
    })();
})();

module.exports = Entry.PingpongPracticalartsLite;