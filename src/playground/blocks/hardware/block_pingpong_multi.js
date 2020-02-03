'use strict';

class PingpongBase {
    constructor(cubecnt) {
        this.TILT_THRESHOLD = 20;
        this.MOVE_THRESHOLD = 30;

        this.send_cmd_id = 0;
        this.cube_cnt = cubecnt || 2;

        this.communicationType = 'manual';

        //this.sensor_data = new Array();
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

        console.log('pingpong base constructor');
    }

    setZero() {
        this.send_cmd_id = 0;

        Entry.hw.sendQueue.COMMAND = {
            id: -1,
        };
        Entry.hw.update();
    }

    afterReceive(pd) {
        //this.sensor_data = pd.SENSOR;

        if (!Entry.engine.isState('run')) {
            return;
        }

        //console.log('ar: ', pd);

        if (pd.c0_BUTTON == 1 || pd.c1_BUTTON == 1) {
            if (this.prev_sensor_data.BUTTON == 0) {
                Entry.engine.fireEvent('pp_when_button_pressed');
                this.prev_sensor_data.BUTTON = 1;
            }
        } else {
            this.prev_sensor_data.BUTTON = 0;
        }

        if (
            Math.abs(pd.c0_MOVE_Z) >= this.MOVE_THRESHOLD ||
            Math.abs(pd.c1_MOVE_Z) >= this.MOVE_THRESHOLD
        ) {
            //this.prev_sensor_data.MOVE_Z = MOVE_Z;
            Entry.engine.fireEvent('pp_when_moved');
        }
        if (
            Math.abs(pd.c0_TILT_X) >= this.TILT_THRESHOLD ||
            Math.abs(pd.c0_TILT_Y) >= this.TILT_THRESHOLD ||
            Math.abs(pd.c1_TILT_X) >= this.TILT_THRESHOLD ||
            Math.abs(pd.c1_TILT_Y) >= this.TILT_THRESHOLD
        ) {
            Entry.engine.fireEvent('pp_when_tilted');
        }
    }

    postCallReturn(script, packet, delay_ms = 0) {
        //console.log(' this.cmdid : ', this.send_cmd_id);
        if (delay_ms <= 0) {
            //FIXME
            Entry.hw.sendQueue.COMMAND = {
                id: ++this.send_cmd_id,
                data: packet,
            };
            Entry.hw.update();

            return script.callReturn();
        }

        if (!script.is_start) {
            script.is_start = true;
            script.step_flag = 1;

            //FIXME
            Entry.hw.sendQueue.COMMAND = {
                id: ++this.send_cmd_id,
                data: packet,
            };
            Entry.hw.update();

            setTimeout(function() {
                script.step_flag = 0;
            }, delay_ms);
            return script;
        } else if (script.step_flag == 1) {
            return script;
        } else {
            delete script.is_start;
            delete script.step_flag;

            //Entry.engine.isContinue = false;
            return script.callReturn();
        }
    }

    makePacket(opcode, task_id, cube_no, opt) {
        // make heder   ( cubeid, cubecnt, op, size, method
        var header = Buffer.from([0xff, 0xff, 0xff, 0xff, 0, 0, opcode, 0, 0]);
        var property = Buffer.from(opt);

        //header.writeUInt16BE(0xFFFF, 0);
        //header.writeUInt16BE(0xFFFF, 2);	// cubdid

        if (cube_no <= -1)
            // all cubes
            header[3] = 0xff;
        else if (cube_no >= this.cube_cnt) header[3] = 0;
        else header[3] = cube_no;

        header.writeUInt16BE(task_id, 4);
        header.writeUInt16BE(header.length + property.length, 7);

        return Buffer.concat([header, property]);
    }

    _getTiltValue(cube_no, tilt_dir) {
        var pd = Entry.hw.portData;
        var tilt_value = 0;

        if (cube_no == 1) {
            if (tilt_dir == 'FRONT') tilt_value = pd.c0_TILT_X * -1;
            else if (tilt_dir == 'BACK') tilt_value = pd.c0_TILT_X;
            else if (tilt_dir == 'LEFT') tilt_value = pd.c0_TILT_Y * -1;
            else if (tilt_dir == 'RIGHT') tilt_value = pd.c0_TILT_Y;
        } else if (cube_no == 2) {
            if (tilt_dir == 'FRONT') tilt_value = pd.c1_TILT_X * -1;
            else if (tilt_dir == 'BACK') tilt_value = pd.c1_TILT_X;
            else if (tilt_dir == 'LEFT') tilt_value = pd.c1_TILT_Y * -1;
            else if (tilt_dir == 'RIGHT') tilt_value = pd.c1_TILT_Y;
        } else if (cube_no == 3) {
            if (tilt_dir == 'FRONT') tilt_value = pd.c2_TILT_X * -1;
            else if (tilt_dir == 'BACK') tilt_value = pd.c2_TILT_X;
            else if (tilt_dir == 'LEFT') tilt_value = pd.c2_TILT_Y * -1;
            else if (tilt_dir == 'RIGHT') tilt_value = pd.c2_TILT_Y;
        } else if (cube_no == 4) {
            if (tilt_dir == 'FRONT') tilt_value = pd.c3_TILT_X * -1;
            else if (tilt_dir == 'BACK') tilt_value = pd.c3_TILT_X;
            else if (tilt_dir == 'LEFT') tilt_value = pd.c3_TILT_Y * -1;
            else if (tilt_dir == 'RIGHT') tilt_value = pd.c3_TILT_Y;
        }

        return tilt_value;
    }
}

Entry.Pingpong_G2 = new (class extends PingpongBase {
    constructor() {
        super(2);

        this.id = '35.2';
        this.name = 'Pingpong_G2';
        this.url = 'https://www.roborisen.com';
        this.imageName = 'pingpong_g2.png';
        //this.delayTime: 30,
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
                func: function(sprite, script) {
                    const cube_id = script.getNumberField('CUBEID');
                    var pd = Entry.hw.portData;

                    if (
                        (cube_id == 0 && pd.c0_BUTTON == 1) ||
                        (cube_id == 1 && pd.c1_BUTTON == 1)
                    ) {
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
                func: function(sprite, script) {
                    const cube_id = script.getNumberField('CUBEID');
                    const tilt_dir = script.getStringField('TILT_DIR');
                    //var pd = Entry.hw.portData;

                    var tilt_value = Entry.Pingpong_G2._getTiltValue(cube_id, tilt_dir);

                    if (tilt_value >= Entry.Pingpong_G2.TILT_THRESHOLD) return script.callReturn();

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
                func: function(sprite, script) {
                    const cube_id = script.getNumberField('CUBEID');
                    var pd = Entry.hw.portData;

                    return (
                        (cube_id == 1 && pd.c0_BUTTON == 1) || (cube_id == 2 && pd.c1_BUTTON == 1)
                    );
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
                func: function(sprite, script) {
                    const cube_id = script.getNumberField('CUBEID');
                    const tilt_dir = script.getStringField('TILT_DIR', script);

                    var tilt_value = Entry.Pingpong_G2._getTiltValue(cube_id, tilt_dir);

                    return tilt_value >= Entry.Pingpong_G2.TILT_THRESHOLD;
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
                func: function(sprite, script) {
                    const cube_id = script.getNumberField('CUBEID');
                    const tilt_dir = script.getStringField('DIR', script);

                    return Entry.Pingpong_G2._getTiltValue(cube_id, tilt_dir);
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
                func: function(sprite, script) {
                    const cube_id = script.getNumberField('CUBEID');
                    const sensor_type = script.getStringField('SENSOR', script);
                    var pd = Entry.hw.portData;
                    var value = 0;

                    if (sensor_type == 'PROXIMITY') {
                        if (cube_id == 0) value = pd.c0_PROXIMITY;
                        else if (cube_id == 1) value = pd.c1_PROXIMITY;
                    } else if (sensor_type == 'AIN') {
                        if (cube_id == 0) value = pd.c0_AIN;
                        else if (cube_id == 1) value = pd.c1_AIN;
                    }

                    return value;
                },
            },
            //pingpong_g2_is_top_shape: '큐브 %1 의 윗면에 %2 모양이 있는가?',

            //TODO: pingpong_g2_multi_motor_rotate: '모터1을 %1 방향으로 %2 도 회전하고 모터2를 %3 방향으로 %4 도 회전하기 %5',
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
                //events: {},
                def: {
                    params: [null],
                    type: 'pingpong_g2_multi_motor_rotate',
                },
                paramsKeyMap: { DIR_1: 0, DEGREE_1: 1, DIR_2: 2, DEGREE_2: 3 },
                class: 'Pingpong_G2_motor',
                isNotFor: ['Pingpong_G2'],
                func: function(sprite, script) {
                    const dir1 = script.getStringField('DIR_1');
                    const dir2 = script.getStringField('DIR_2');
                    var degree1 = script.getNumberValue('DEGREE_1');
                    var degree2 = script.getNumberValue('DEGREE_2');

                    var speed1 = 800;
                    var speed2 = 800;

                    if (dir1 == 'LEFT') {
                        speed1 *= -1;
                    }
                    if (dir2 == 'LEFT') {
                        speed2 *= -1;
                    }

                    degree1 = Math.min(Math.max(degree1, 0), 360);
                    degree2 = Math.min(Math.max(degree2, 0), 360);

                    var step1 = Math.round(degree1 * 5.5);
                    var step2 = Math.round(degree2 * 5.5);
                    if (step1 > 32768) step1 = 32768;
                    if (step2 > 32768) step2 = 32768;

                    //TODO: aggregate steps
                    var opt = [2, 1, 0, 2, 0, 0, 0, 0, 0, 0];
                    var packet = Entry.Pingpong_G2.makePacket(0xcd, 0x0004, -1, opt); // SETP_MOTOR
                    packet.writeInt16BE(speed1, 13);
                    packet.writeUInt16BE(step1, 17);

                    /*
					packet[6] = 0xc1; // opcode  SINGLE_STEP
					packet[9] = 2; // mode?? MULTIROLE=2, CRCHECK=3
					packet[10] = 1; // method, CONTINOUS=0, RELATIVE_SINGLE=1, ABSOLUTE_SINGLE=2, sched_steps=3, sched_point=4
					packet[11] = 0;	//step_type; full=0, servo=4
					packet[12] = 2;	//pause_state; PAUSE=1, RESUME=2
					*/

                    var delay_ms1 = Math.round(((1100 - Math.abs(speed1)) / 99) * step1) + 400;
                    var delay_ms2 = Math.round(((1100 - Math.abs(speed2)) / 99) * step2) + 400;
                    var delay_ms = delay_ms1;
                    if (delay_ms2 > delay_ms1) delay_ms = delay_ms2;

                    return Entry.Pingpong_G2.postCallReturn(script, packet, delay_ms);
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
                func: function(sprite, script) {
                    const cube_id = script.getNumberField('CUBEID');
                    const dir = script.getStringField('DIR');
                    var degree = script.getNumberValue('DEGREE');

                    var speed = 800;
                    if (dir == 'LEFT') {
                        speed *= -1;
                    }

                    degree = Math.min(Math.max(degree, 0), 360);

                    var step = Math.round(degree * 5.5);
                    if (step > 32768) step = 32768;

                    var opt = [2, 1, 0, 2, 0, 0, 0, 0, 0, 0];
                    var packet = Entry.Pingpong_G2.makePacket(0xc1, 0x0004, cube_id, opt); // SETP_MOTOR

                    packet.writeInt16BE(speed, 13);
                    packet.writeUInt16BE(step, 17);

                    var delay_ms = Math.round(((1100 - Math.abs(speed)) / 99) * step) + 400;

                    return Entry.Pingpong_G2.postCallReturn(script, packet, delay_ms);
                },
            },

            //TODO: pingpong_g2_start_multi_motor_rotate: '모터1 속도를 %1 모터2 속도를 %2 (으)로 정하기 %3',
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
                func: function(sprite, script) {
                    var speed = script.getNumberValue('SPEED');
                    speed = Math.min(Math.max(speed, 100), 1000);

                    var packet = Entry.Pingpong_G2.makePacket(0xcc, 0x0004, 0, [2, 0, 0, 2, 0, 0]); // CONTINUOUS STEP_MOTOR
                    packet.writeInt16BE(speed, 13);

                    var delay_ms = Math.round(((1100 - Math.abs(speed)) / 99) * 10) + 400;
                    return Entry.Pingpong_G2.postCallReturn(script, packet, delay_ms);
                },
            },
            //TODO: pingpong_g2_start_motor_rotate: '%1 모터의 속도를 %2 으로 정하기 %3',
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
                func: function(sprite, script) {
                    const cube_id = script.getNumberField('CUBEID');
                    var speed = script.getNumberValue('SPEED');
                    speed = Math.min(Math.max(speed, 100), 1000);

                    var packet = Entry.Pingpong_G2.makePacket(0xcc, 0x0004, cube_id, [
                        2,
                        0,
                        0,
                        2,
                        0,
                        0,
                    ]); // CONTINUOUS STEP_MOTOR
                    packet.writeInt16BE(speed, 13);

                    var delay_ms = Math.round(((1100 - Math.abs(speed)) / 99) * 10) + 400;
                    return Entry.Pingpong_G2.postCallReturn(script, packet, delay_ms);
                },
            },
            //TODO: pingpong_g2_stop_motor_rotate: '%1 모터 멈추기 %2',
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
                func: function(sprite, script) {
                    const cube_id = script.getNumberField('CUBEID');
                    var packet = Entry.Pingpong_G2.makePacket(0xcc, 0x0004, cube_id, [
                        2,
                        0,
                        0,
                        1,
                        0,
                        0,
                    ]); // CONTINUOUS STEP_MOTOR
                    return Entry.Pingpong_G2.postCallReturn(script, packet);
                },
            },

            //TODO: pingpong_g2_rotate_servo_mortor: '%1 번째 큐브의 서보모터 %2도로 설정하기 %3',
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
                func: function(sprite, script) {
                    const cube_id = script.getNumberValue('cubeno');
                    var angle = script.getNumberValue('DEGREE', script);

                    angle = Math.min(Math.max(angle, 0), 180);

                    var packet = Entry.Pingpong_G2.makePacket(0xe1, 0x00, cube_id, [
                        2,
                        0,
                        angle,
                        1,
                    ]); // SERVO_MOTOR
                    return Entry.Pingpong_G2.postCallReturn(script, packet, 400);
                },
            },

            //TODO: pingpong_g2_set_dot_pixel: '%1 번째 큐브의 LED %2 X:%3 Y:%4 %5',
            pingpong_g2_set_dot_pixel: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    { type: 'Block', accept: 'string', defaultType: 'number', value: '1' },
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
                    { type: 'Block', accept: 'string', defaultType: 'number', value: '0' },
                    { type: 'Block', accept: 'string', defaultType: 'number', value: '0' },
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
                paramsKeyMap: { cubeno: 0, X: 2, Y: 3, onoff: 1 },
                class: 'Pingpong_G2_peripheral_LED',
                isNotFor: ['Pingpong_G2'],
                func: function(sprite, script) {
                    const cube_id = script.getNumberValue('cubeno');
                    var dot_x = script.getNumberValue('X', script);
                    var dot_y = script.getNumberValue('Y', script);
                    var onoff = script.getNumberField('onoff', script);

                    dot_x = Math.min(Math.max(dot_x, 0), 7);
                    dot_y = Math.min(Math.max(dot_y, 0), 7);

                    var packet = Entry.Pingpong_G2.makePacket(0xa2, 0xe1, cube_id, [
                        0x70,
                        dot_y,
                        dot_x,
                        onoff,
                    ]); // turn on
                    return Entry.Pingpong_G2.postCallReturn(script, packet);
                },
            },
            //TODO: pingpong_g2_set_dot_string: '%1 번째 큐브의 글자 %2 보여주기 %3',
            pingpong_g2_set_dot_string: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    { type: 'Block', accept: 'string', defaultType: 'number', value: '1' },
                    { type: 'Block', accept: 'string', value: 'Hello!' },
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
                func: function(sprite, script) {
                    const cube_id = script.getNumberValue('cubeno');
                    var str = script.getStringValue('STR', script);
                    var duration = script.getNumberValue('DURATION', script);

                    var period = Math.round((duration * 100) / (str.length * 8));
                    period = Math.min(Math.max(period, 1), 200);

                    var opt = Buffer.concat([
                        Buffer.from([0x70, period, 0]),
                        Buffer.from(str.substring(0, 20)),
                    ]);

                    var packet = Entry.Pingpong_G2.makePacket(0xa2, 0xe3, cube_id, opt);
                    var delay_ms = period * str.length * 8 * 10 + 400; // add wait for 400ms
                    return Entry.Pingpong_G2.postCallReturn(script, packet, delay_ms);
                },
            },
            //TODO: pingpong_g2_set_dot_clear: '%1 번째 큐브의 화면 지우기 %2',
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
                func: function(sprite, script) {
                    const cube_id = script.getNumberValue('cubeno');
                    var packet = Entry.Pingpong_G2.makePacket(0xa2, 0xe4, cube_id, [0x70, 2]);
                    return Entry.Pingpong_G2.postCallReturn(script, packet);
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
                    pingpong_g2_set_dot_pixel: '%1 번째 큐브의 LED %2 X:%3 Y:%4 %5',
                    pingpong_g2_set_dot_string: '%1 번째 큐브의 글자 %2 보여주기 %3',
                    pingpong_g2_set_dot_clear: '%1 번째 큐브의 화면 지우기 %2',
                    pingpong_g2_rotate_servo_mortor: '%1 번째 큐브의 서보모터 %2도로 설정하기 %3',
                },
                Blocks: {
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
                    //pingpong_g2_is_top_shape: '%1 shown in top view?',
                    pingpong_g2_get_tilt_value: '%1 cube tilt angle to %2',
                    pingpong_g2_get_sensor_value: '%1 cube read sensor %2',
                    pingpong_g2_multi_motor_rotate:
                        '모터1을 %1 방향으로 %2 도 회전하고 모터2를 %3 방향으로 %4 도 회전하기 %5',
                    pingpong_g2_motor_rotate: 'rotate %2 degrees %1 %3',
                    pingpong_g2_start_multi_motor_rotate:
                        '모터1 속도를 %1 모터2 속도를 %2 (으)로 정하기 %3',
                    pingpong_g2_start_motor_rotate: 'set motor speed to %1 %2',
                    pingpong_g2_stop_motor_rotate: 'stop motor rotate %1',
                    pingpong_g2_rotate_servo_mortor: 'set servo mortor to %1 degrees %2',
                    pingpong_g2_set_dot_pixel: 'set %3 DOT X:%1 Y:%2 %4',
                    pingpong_g2_set_dot_string: 'print string %1 during %2 seconds to DOT %3',
                    pingpong_g2_set_dot_clear: 'clear DOT %1',
                },
                Blocks: {
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

module.exports = Entry.Pingpong_G2;
//module.exports = [Entry.Pingpong_G2, Entry.Pingpong_G3, Entry.Pingpong_G4];
