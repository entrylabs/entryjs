'use strict';

import _range from 'lodash/range';

(function() {
    const PingpongConnectLite = require('./block_pingpongConnect_lite');

    function createBlockMenuList(cubeCount) {
        return [
            `pingpong_lite_g${cubeCount}_when_button_pressed`,
            `pingpong_lite_g${cubeCount}_when_tilted`,
            `pingpong_lite_g${cubeCount}_is_button_pressed`,
            `pingpong_lite_g${cubeCount}_is_tilted`,
            `pingpong_lite_g${cubeCount}_get_tilt_value`,
            `pingpong_lite_g${cubeCount}_is_top_shape`,
            `pingpong_lite_g${cubeCount}_get_sensor_value`,
            `pingpong_lite_g${cubeCount}_motor_rotate`,
            `pingpong_lite_g${cubeCount}_start_motor_rotate`,
            `pingpong_lite_g${cubeCount}_stop_motor_rotate`,
            `pingpong_lite_g${cubeCount}_multi_motor_rotate`,
            `pingpong_lite_g${cubeCount}_multi_start_motor_rotate`,
            `pingpong_lite_g${cubeCount}_rotate_servo_mortor`,
            `pingpong_lite_g${cubeCount}_set_dot_pixel`,
            `pingpong_lite_g${cubeCount}_set_dot_string`,
            `pingpong_lite_g${cubeCount}_set_dot_clear`,
            `pingpong_lite_g${cubeCount}_playNoteForBeats`,
            `pingpong_lite_g${cubeCount}_multi_playChordForBeats`,
            `pingpong_lite_g${cubeCount}_restForBeats`,
            `pingpong_lite_g${cubeCount}_setTempo`,
            `pingpong_lite_g${cubeCount}_getTempo`,
        ];
    }

        //#region getBlocks
    function getBlocks(self) {
        const blocks = {
            [`pingpong_lite_g${self.cubeCount}_when_button_pressed`]: {
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
                        options: Lang.Blocks[`pingpong_lite_g${self.cubeCount}_cube_id`],
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                def: {
                    params: [null],
                    type: `pingpong_lite_g${self.cubeCount}_when_button_pressed`,
                },
                paramsKeyMap: {
                    CUBEID: 1,
                },
                class: 'PingpongGN',
                isNotFor: [`PingpongG${self.cubeCount}Lite`],
                event: 'pp_when_button_pressed',
                func(sprite, script) {
                    const cubeId = script.getNumberField('CUBEID');
                    const pd = self.sensor_data;

                    return (pd[cubeId]?.BUTTON == 1)
                        ? script.callReturn()
                        : this.die();
                },
            },
            [`pingpong_lite_g${self.cubeCount}_when_tilted`]: {
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
                        options: Lang.Blocks[`pingpong_lite_g${self.cubeCount}_cube_id`],
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
                    type: `pingpong_lite_g${self.cubeCount}_when_tilted`,
                },
                paramsKeyMap: {
                    CUBEID: 1,
                    TILT_DIR: 2,
                },
                class: 'PingpongGN',
                isNotFor: [`PingpongG${self.cubeCount}Lite`],
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
            [`pingpong_lite_g${self.cubeCount}_is_button_pressed`]: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_boolean_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks[`pingpong_lite_g${self.cubeCount}_cube_id`],
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                def: {
                    params: [null],
                    type: `pingpong_lite_g${self.cubeCount}_is_button_pressed`,
                },
                paramsKeyMap: {
                    CUBEID: 0,
                },
                class: 'PingpongGN',
                isNotFor: [`PingpongG${self.cubeCount}Lite`],
                func(sprite, script) {
                    const cubeId = script.getNumberField('CUBEID');
                    return self.sensor_data[cubeId].BUTTON == 1;
                },
            },
            [`pingpong_lite_g${self.cubeCount}_is_tilted`]: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_boolean_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks[`pingpong_lite_g${self.cubeCount}_cube_id`],
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
                def: { params: [], type: `pingpong_lite_g${self.cubeCount}_is_tilted` },
                paramsKeyMap: {
                    CUBEID: 0,
                    TILT_DIR: 1,
                },
                class: 'PingpongGN',
                isNotFor: [`PingpongG${self.cubeCount}Lite`],
                func(sprite, script) {
                    const cubeId = script.getNumberField('CUBEID');
                    const tiltDir = script.getStringField('TILT_DIR');

                    const tiltValue = self._getTiltValue(cubeId, tiltDir);

                    return tiltValue >= self.TILT_THRESHOLD;
                },
            },
            [`pingpong_lite_g${self.cubeCount}_get_tilt_value`]: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_string_field',
                params: [
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks[`pingpong_lite_g${self.cubeCount}_cube_id`],
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
                    type: `pingpong_lite_g${self.cubeCount}_get_tilt_value`,
                },
                paramsKeyMap: { CUBEID: 0, DIR: 1 },
                class: 'PingpongGN',
                isNotFor: [`PingpongG${self.cubeCount}Lite`],
                func(sprite, script) {
                    const cubeId = script.getNumberField('CUBEID');
                    const tiltDir = script.getStringField('DIR', script);

                    return self._getTiltValue(cubeId, tiltDir);
                },
            },
            [`pingpong_lite_g${self.cubeCount}_get_sensor_value`]: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_string_field',
                params: [
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks[`pingpong_lite_g${self.cubeCount}_cube_id`],
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
                def: { params: [], type: `pingpong_lite_g${self.cubeCount}_get_sensor_value` },
                paramsKeyMap: { CUBEID: 0, SENSOR: 1 },
                class: 'PingpongGN',
                isNotFor: [`PingpongG${self.cubeCount}Lite`],
                func(sprite, script) {
                    const cubeId = script.getNumberField('CUBEID');
                    const sensorType = script.getStringField('SENSOR', script);
                    const pd = self.sensor_data;

                    return pd[cubeId][sensorType];
                },
            },
            [`pingpong_lite_g${self.cubeCount}_is_top_shape`]: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_boolean_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks[`pingpong_lite_g${self.cubeCount}_cube_id`],
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
                def: { params: [], type: `pingpong_lite_g${self.cubeCount}_is_top_shape` },
                paramsKeyMap: { CUBEID: 0, TILT_DIR: 1 },
                class: 'PingpongGN',
                isNotFor: [`PingpongG${self.cubeCount}Lite`],
                func(sprite, script) {
                    const cubeId = script.getNumberField('CUBEID');
                    const tiltDir = script.getStringField('TILT_DIR', script);
                    return self._isUpperDir(cubeId, tiltDir);
                },
            },
            [`pingpong_lite_g${self.cubeCount}_motor_rotate`]: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks[`pingpong_lite_g${self.cubeCount}_cube_all`],
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
                    type: `pingpong_lite_g${self.cubeCount}_motor_rotate`,
                },
                paramsKeyMap: { CUBEID: 0, DIR: 1, DEGREE: 2 },
                class: 'PingpongGN_motor',
                isNotFor: [`PingpongG${self.cubeCount}Lite`],
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
            [`pingpong_lite_g${self.cubeCount}_start_motor_rotate`]: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                params: [
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks[`pingpong_lite_g${self.cubeCount}_cube_all`],
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
                    type: `pingpong_lite_g${self.cubeCount}_start_motor_rotate`,
                },
                paramsKeyMap: { CUBEID: 0, SPEED: 1 },
                class: 'PingpongGN_motor',
                isNotFor: [`PingpongG${self.cubeCount}Lite`],
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
            [`pingpong_lite_g${self.cubeCount}_stop_motor_rotate`]: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                params: [
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks[`pingpong_lite_g${self.cubeCount}_cube_all`],
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
                    type: `pingpong_lite_g${self.cubeCount}_stop_motor_rotate`,
                },
                paramsKeyMap: { CUBEID: 0 },
                class: 'PingpongGN_motor',
                isNotFor: [`PingpongG${self.cubeCount}Lite`],
                func(sprite, script) {
                    return self.postCallReturn(script, () => {
                        const cubeId = script.getNumberField('CUBEID');

                        const arr = self.makeContStepPacket(cubeId, 0);
                        const packet = Buffer.from(arr);

                        return [packet];
                    });
                },
            },
            [`pingpong_lite_g${self.cubeCount}_rotate_servo_mortor`]: {
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
                def: { params: [null, { type: 'angle' }], type: `pingpong_lite_g${self.cubeCount}_rotate_servo_mortor` },
                paramsKeyMap: { cubeno: 0, DEGREE: 1 },
                class: 'PingpongGN_motor',
                isNotFor: [`PingpongG${self.cubeCount}Lite`],
                func(sprite, script) {
                    return self.postCallReturn(script, () => {
                        const cubeId = self._getCubeNoFromBlock(script);
                        let angle = script.getNumberValue('DEGREE', script);

                        angle = Math.min(Math.max(angle, 0), 180);

                        const opt = [2, 0, angle, 1];
                        const packet = self.makePacket(self.OPCODE.SERVO, 0x00, cubeId, opt);
                        return [packet];
                    });
                },
            },
            [`pingpong_lite_g${self.cubeCount}_set_dot_pixel`]: {
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
                    type: `pingpong_lite_g${self.cubeCount}_set_dot_pixel`,
                },
                paramsKeyMap: { cubeno: 0, X: 1, Y: 2, onoff: 3 },
                class: 'PingpongGN_peripheral_LED',
                isNotFor: [`PingpongG${self.cubeCount}Lite`],
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
            [`pingpong_lite_g${self.cubeCount}_set_dot_string`]: {
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
                def: { params: [null, null], type: `pingpong_lite_g${self.cubeCount}_set_dot_string` },
                paramsKeyMap: { cubeno: 0, STR: 1, DURATION: 2 },
                class: 'PingpongGN_peripheral_LED',
                isNotFor: [`PingpongG${self.cubeCount}Lite`],
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
            [`pingpong_lite_g${self.cubeCount}_set_dot_clear`]: {
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
                def: { params: [], type: `pingpong_lite_g${self.cubeCount}_set_dot_clear` },
                paramsKeyMap: { cubeno: 0 },
                class: 'PingpongGN_peripheral_LED',
                isNotFor: [`PingpongG${self.cubeCount}Lite`],
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
            [`pingpong_lite_g${self.cubeCount}_playNoteForBeats`]: {
                //'%1 큐브의 %2 번 음을 %3 박자로 연주하기 %4',
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: Lang.Blocks[`pingpong_lite_g${self.cubeCount}_cube_id`],
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
                def: { params: [], type: `pingpong_lite_g${self.cubeCount}_playNoteForBeats` },
                paramsKeyMap: { CUBEID: 0, NOTE: 1, BEATS: 2 },
                class: 'PingpongGN_Music',
                isNotFor: [`PingpongG${self.cubeCount}Lite`],
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
            [`pingpong_lite_g${self.cubeCount}_restForBeats`]: {
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
                def: { params: [], type: `pingpong_lite_g${self.cubeCount}_restForBeats` },
                paramsKeyMap: { BEATS: 0 },
                class: 'PingpongGN_Music',
                isNotFor: [`PingpongG${self.cubeCount}Lite`],
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
            [`pingpong_lite_g${self.cubeCount}_setTempo`]: {
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
                def: { params: [], type: `pingpong_lite_g${self.cubeCount}_setTempo` },
                paramsKeyMap: { TEMPO: 0 },
                class: 'PingpongGN_Music',
                isNotFor: [`PingpongG${self.cubeCount}Lite`],
                func(sprite, script) {
                    let tempo = script.getNumberValue('TEMPO', script);
                    self.tempo = self._clampTempo(tempo);
                    return script.callReturn();
                },
            },
            [`pingpong_lite_g${self.cubeCount}_getTempo`]: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_string_field',
                params: [],
                def: { params: [], type: `pingpong_lite_g${self.cubeCount}_getTempo` },
                paramsKeyMap: {},
                class: 'PingpongGN_Music',
                isNotFor: [`PingpongG${self.cubeCount}Lite`],
                func(sprite, script) {
                    return self.tempo;
                },
            },
            pingpong_lite_g2_multi_motor_rotate: {
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
                    type: 'pingpong_lite_g2_multi_motor_rotate',
                },
                paramsKeyMap: { DIR_1: 0, DEGREE_1: 1, DIR_2: 2, DEGREE_2: 3 },
                class: 'PingpongGN_motor',
                isNotFor: ['PingpongG2Lite'],
                func(sprite, script) {
                    return self.postCallReturn(script, () => {
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

                        const [arr1, delay1] = self.makeSingleStepPacket(0,speed1,degree1);
                        const [arr2, delay2] = self.makeSingleStepPacket(1,speed2,degree2);
                        const [arr3, delay3] = self.makeSingleStepPacket(2,speed3,degree3);
                        const [arr4, delay4] = self.makeSingleStepPacket(3,speed4,degree4);

                        const opt = [self.MODE.MULTIROLE, 1, 0, 2];
                        const packet = self.makeAggregatePacket(self.OPCODE.AGGREGATE_STEPS,0,[arr1, arr2, arr3, arr4],opt);
                        const waitTime = Math.max(delay1, delay2, delay3, delay4);

                        return [packet, waitTime];
                    });
                },
            },
            pingpong_lite_g2_multi_start_motor_rotate: {
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
                    type: 'pingpong_lite_g2_multi_start_motor_rotate',
                },
                paramsKeyMap: { SPEED_1: 0, SPEED_2: 1 },
                class: 'PingpongGN_motor',
                isNotFor: ['PingpongG2Lite'],
                func(sprite, script) {
                    return self.postCallReturn(script, () => {
                        const speed1 = script.getNumberValue('SPEED_1');
                        const speed2 = script.getNumberValue('SPEED_2');
                        const speed3 = script.getNumberValue('SPEED_3');
                        const speed4 = script.getNumberValue('SPEED_4');

                        const arr1 = self.makeContStepPacket(0, speed1);
                        const arr2 = self.makeContStepPacket(1, speed2);
                        const arr3 = self.makeContStepPacket(2, speed3);
                        const arr4 = self.makeContStepPacket(3, speed4);

                        const opt = [self.MODE.MULTIROLE, 0, 0, 2];
                        const packet = self.makeAggregatePacket(self.OPCODE.AGGREGATE_STEPS,0,[arr1, arr2, arr3, arr4],opt);

                        return [packet];
                    });
                },
            },
            pingpong_lite_g2_multi_playChordForBeats: {
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
                def: { params: [], type: 'pingpong_lite_g2_multi_playChordForBeats' },
                paramsKeyMap: {
                    NOTE_1: 0,
                    NOTE_2: 1,
                    BEATS: 2,
                },
                class: 'PingpongGN_Music',
                isNotFor: ['PingpongG2Lite'],
                func(sprite, script) {
                    return self.postCallReturn(script, () => {
                        const NOTE1 = script.getNumberField('NOTE_1', script);
                        const NOTE2 = script.getNumberField('NOTE_2', script);
                        const NOTE3 = script.getNumberField('NOTE_3', script);
                        const NOTE4 = script.getNumberField('NOTE_4', script);

                        const BEATS = script.getNumberValue('BEATS', script);
                        const cBeats = self._clampBeats(BEATS);
                        const durationSec = self._beatsToDuration(cBeats);

                        const waitTime = durationSec * 10 + 60;

                        const arr1 = self.makeMusicNotePacket(0,NOTE1,durationSec);
                        const arr2 = self.makeMusicNotePacket(1,NOTE2,durationSec);
                        const arr3 = self.makeMusicNotePacket(2,NOTE3,durationSec);
                        const arr4 = self.makeMusicNotePacket(3,NOTE4,durationSec);

                        const packet = self.makeAggregatePacket(self.OPCODE.MUSIC,0xa2,[arr1, arr2, arr3, arr4],[0, 0]);

                        return [packet, waitTime];
                    });
                },
            },
            pingpong_lite_g3_multi_motor_rotate: {
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
                    type: 'pingpong_lite_g3_multi_motor_rotate',
                },
                paramsKeyMap: {
                    DIR_1: 0,
                    DEGREE_1: 1,
                    DIR_2: 2,
                    DEGREE_2: 3,
                    DIR_3: 4,
                    DEGREE_3: 5,
                },
                class: 'PingpongGN_motor',
                isNotFor: ['PingpongG3Lite'],
                func(sprite, script) {
                    return self.postCallReturn(script, () => {
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

                        const [arr1, delay1] = self.makeSingleStepPacket(0,speed1,degree1);
                        const [arr2, delay2] = self.makeSingleStepPacket(1,speed2,degree2);
                        const [arr3, delay3] = self.makeSingleStepPacket(2,speed3,degree3);
                        const [arr4, delay4] = self.makeSingleStepPacket(3,speed4,degree4);

                        const opt = [self.MODE.MULTIROLE, 1, 0, 2];
                        const packet = self.makeAggregatePacket(self.OPCODE.AGGREGATE_STEPS,0,[arr1, arr2, arr3, arr4],opt);
                        const waitTime = Math.max(delay1, delay2, delay3, delay4);

                        return [packet, waitTime];
                    });
                },
            },
            pingpong_lite_g3_multi_start_motor_rotate: {
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
                    type: 'pingpong_lite_g3_multi_start_motor_rotate',
                },
                paramsKeyMap: { SPEED_1: 0, SPEED_2: 1, SPEED_3: 2 },
                class: 'PingpongGN_motor',
                isNotFor: ['PingpongG3Lite'],
                func(sprite, script) {
                    return self.postCallReturn(script, () => {
                        const speed1 = script.getNumberValue('SPEED_1');
                        const speed2 = script.getNumberValue('SPEED_2');
                        const speed3 = script.getNumberValue('SPEED_3');
                        const speed4 = script.getNumberValue('SPEED_4');

                        const arr1 = self.makeContStepPacket(0, speed1);
                        const arr2 = self.makeContStepPacket(1, speed2);
                        const arr3 = self.makeContStepPacket(2, speed3);
                        const arr4 = self.makeContStepPacket(3, speed4);

                        const opt = [self.MODE.MULTIROLE, 0, 0, 2];
                        const packet = self.makeAggregatePacket(self.OPCODE.AGGREGATE_STEPS,0,[arr1, arr2, arr3, arr4],opt);

                        return [packet];
                    });
                },
            },
            pingpong_lite_g3_multi_playChordForBeats: {
                //'%1 큐브 %2, %3 큐브 %4, %5 큐브 %6 %7 박자로 연주하기 %8',
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
                def: { params: [], type: 'pingpong_lite_g3_multi_playChordForBeats' },
                paramsKeyMap: {
                    NOTE_1: 0,
                    NOTE_2: 1,
                    NOTE_3: 2,
                    BEATS: 3,
                },
                class: 'PingpongGN_Music',
                isNotFor: ['PingpongG3Lite'],
                func(sprite, script) {
                    return self.postCallReturn(script, () => {
                        const NOTE1 = script.getNumberField('NOTE_1', script);
                        const NOTE2 = script.getNumberField('NOTE_2', script);
                        const NOTE3 = script.getNumberField('NOTE_3', script);
                        const NOTE4 = script.getNumberField('NOTE_4', script);

                        const BEATS = script.getNumberValue('BEATS', script);
                        const cBeats = self._clampBeats(BEATS);
                        const durationSec = self._beatsToDuration(cBeats);

                        const waitTime = durationSec * 10 + 60;

                        const arr1 = self.makeMusicNotePacket(0,NOTE1,durationSec);
                        const arr2 = self.makeMusicNotePacket(1,NOTE2,durationSec);
                        const arr3 = self.makeMusicNotePacket(2,NOTE3,durationSec);
                        const arr4 = self.makeMusicNotePacket(3,NOTE4,durationSec);

                        const packet = self.makeAggregatePacket(self.OPCODE.MUSIC,0xa2,[arr1, arr2, arr3, arr4],[0, 0]);

                        return [packet, waitTime];
                    });
                },
            },
            pingpong_lite_g4_multi_motor_rotate: {
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
                    type: 'pingpong_lite_g4_multi_motor_rotate',
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
                class: 'PingpongGN_motor',
                isNotFor: ['PingpongG4Lite'],
                func(sprite, script) {
                    return self.postCallReturn(script, () => {
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

                        const [arr1, delay1] = self.makeSingleStepPacket(0,speed1,degree1);
                        const [arr2, delay2] = self.makeSingleStepPacket(1,speed2,degree2);
                        const [arr3, delay3] = self.makeSingleStepPacket(2,speed3,degree3);
                        const [arr4, delay4] = self.makeSingleStepPacket(3,speed4,degree4);

                        const opt = [self.MODE.MULTIROLE, 1, 0, 2];
                        const packet = self.makeAggregatePacket(self.OPCODE.AGGREGATE_STEPS,0,[arr1, arr2, arr3, arr4],opt);
                        const waitTime = Math.max(delay1, delay2, delay3, delay4);

                        return [packet, waitTime];
                    });
                },
            },
            pingpong_lite_g4_multi_start_motor_rotate: {
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
                    type: 'pingpong_lite_g4_multi_start_motor_rotate',
                },
                paramsKeyMap: { SPEED_1: 0, SPEED_2: 1, SPEED_3: 2, SPEED_4: 3 },
                class: 'PingpongGN_motor',
                isNotFor: ['PingpongG4Lite'],
                func(sprite, script) {
                    return self.postCallReturn(script, () => {
                        const speed1 = script.getNumberValue('SPEED_1');
                        const speed2 = script.getNumberValue('SPEED_2');
                        const speed3 = script.getNumberValue('SPEED_3');
                        const speed4 = script.getNumberValue('SPEED_4');

                        const arr1 = self.makeContStepPacket(0, speed1);
                        const arr2 = self.makeContStepPacket(1, speed2);
                        const arr3 = self.makeContStepPacket(2, speed3);
                        const arr4 = self.makeContStepPacket(3, speed4);

                        const opt = [self.MODE.MULTIROLE, 0, 0, 2];
                        const packet = self.makeAggregatePacket(self.OPCODE.AGGREGATE_STEPS,0,[arr1, arr2, arr3, arr4],opt);

                        return [packet];
                    });
                },
            },
            pingpong_lite_g4_multi_playChordForBeats: {
                //'%1 큐브 %2, %3 큐브 %4, %5 큐브 %6 %7 박자로 연주하기 %8',
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
                        options: Lang.Blocks.pingpong_opts_music_notes,
                        value: 48,
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
                def: { params: [], type: 'pingpong_lite_g4_multi_playChordForBeats' },
                paramsKeyMap: {
                    NOTE_1: 0,
                    NOTE_2: 1,
                    NOTE_3: 2,
                    NOTE_4: 3,
                    BEATS: 4,
                },
                class: 'PingpongGN_Music',
                isNotFor: ['PingpongG4Lite'],
                func(sprite, script) {
                    return self.postCallReturn(script, () => {
                        const NOTE1 = script.getNumberField('NOTE_1', script);
                        const NOTE2 = script.getNumberField('NOTE_2', script);
                        const NOTE3 = script.getNumberField('NOTE_3', script);
                        const NOTE4 = script.getNumberField('NOTE_4', script);

                        const BEATS = script.getNumberValue('BEATS', script);
                        const cBeats = self._clampBeats(BEATS);
                        const durationSec = self._beatsToDuration(cBeats);

                        const waitTime = durationSec * 10 + 60;

                        const arr1 = self.makeMusicNotePacket(0,NOTE1,durationSec);
                        const arr2 = self.makeMusicNotePacket(1,NOTE2,durationSec);
                        const arr3 = self.makeMusicNotePacket(2,NOTE3,durationSec);
                        const arr4 = self.makeMusicNotePacket(3,NOTE4,durationSec);

                        const packet = self.makeAggregatePacket(self.OPCODE.MUSIC,0xa2,[arr1, arr2, arr3, arr4],[0, 0]);

                        return [packet, waitTime];
                    });
                },
            },
        };
        return blocks;
    }

    function createPingpongLite(cubeCount, className, hardwareId, imageName) {
        return new (class extends PingpongConnectLite {
            constructor() {
                super(cubeCount, className);
                this.id = hardwareId;
                this.imageName = imageName;
                this.blockMenuBlocks = createBlockMenuList(this.cubeCount);
            }
            getBlocks() {return getBlocks(this);}
        })();
    }

    Entry.PingpongG2Lite = createPingpongLite(2, 'PingpongG2Lite', '350201', 'PingpongG2Lite.png');
    Entry.PingpongG3Lite = createPingpongLite(3, 'PingpongG3Lite', '350301', 'PingpongG3Lite.png');
    Entry.PingpongG4Lite = createPingpongLite(4, 'PingpongG4Lite', '350401', 'PingpongG4Lite.png');
})();

module.exports = [Entry.PingpongG2Lite, Entry.PingpongG3Lite, Entry.PingpongG4Lite];