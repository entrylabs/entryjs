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
            //'pingpong_g1_is_top_shape',
            'pingpong_g1_get_sensor_value',
            'pingpong_g1_motor_rotate',
            'pingpong_g1_start_motor_rotate',
            'pingpong_g1_stop_motor_rotate',
            'pingpong_g1_rotate_servo_mortor',
            'pingpong_g1_set_dot_pixel',
            'pingpong_g1_set_dot_string',
            'pingpong_g1_set_dot_clear',
        ];
    }

    setZero() {
        // all LED clear
        this.sendCommand(this.makePacket(0xa2, 0xe3, [0x70, 1, 0, ' ']));
        setTimeout(() => {
            // all cube stop
            this.sendCommand(this.makePacket(0xcc, 0x0004, [2, 0, 0, 1, 0, 0]));
            setTimeout(()=> {
                Entry.hw.sendQueue.COMMAND = {
                    id: -1,
                };
                Entry.hw.update();

                this.send_cmd_id = 0;
            }, this.delayTime);
        },  this.delayTime);
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

    postCallReturn(script, packet, waitTime = this.delayTime) {
        if (waitTime <= 0) {
            this.sendCommand(packet);
            return script.callReturn();
        }

        if (!script.is_start) {
            script.is_start = true;
            script.step_flag = 1;

            this.sendCommand(packet);

            setTimeout(() => {
                script.step_flag = 0;
            }, waitTime);
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
                        case 'FRONT':
                            tiltValue = pd.TILT_X * -1;
                            break;
                        case 'BACK':
                            tiltValue = pd.TILT_X;
                            break;
                        case 'LEFT':
                            tiltValue = pd.TILT_Y * -1;
                            break;
                        case 'RIGHT':
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
                        case 'FRONT':
                            tiltValue = pd.TILT_X * -1;
                            break;
                        case 'BACK':
                            tiltValue = pd.TILT_X;
                            break;
                        case 'LEFT':
                            tiltValue = pd.TILT_Y * -1;
                            break;
                        case 'RIGHT':
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
                        case 'FRONT':
                            value = pd.TILT_X * -1;
                            break;
                        case 'BACK':
                            value = pd.TILT_X;
                            break;
                        case 'LEFT':
                            value = pd.TILT_Y * -1;
                            break;
                        case 'RIGHT':
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
            //pingpong_g1_is_top_shape: '큐브 윗면에 %1 모양이 있는가?',
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
                    const dir = script.getStringField('DIR');
                    let degree = script.getNumberValue('DEGREE');

                    console.log('motor: ', dir, degree);
                    let speed = 800;
                    if (dir == 'LEFT') {
                        speed *= -1;
                    }

                    degree = Math.min(Math.max(degree, 0), 360);

                    let step = Math.round(degree * 5.5);
                    if (step > 32768) {
                        step = 32768;
                    }

                    const opt = [2, 1, 0, 2, 0, 0, 0, 0, 0, 0];
                    const packet = Entry.PingpongG1.makePacket(0xc1, 0x0004, opt); // SETP_MOTOR

                    packet.writeInt16BE(speed, 13);
                    packet.writeUInt16BE(step, 17);

                    const waitTime = Math.round(((1100 - Math.abs(speed)) / 99) * step) + 400;

                    return Entry.PingpongG1.postCallReturn(script, packet, waitTime);
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
                            sps = speed * 9 - 100;
                        } else {
                            sps = speed * 9 + 100;
                        }
                        sps = Math.round(sps);
                    }

                    const packet = Entry.PingpongG1.makePacket(0xcc, 0x0004, [2, 0, 0, 2, 0, 0]);
                    packet.writeInt16BE(sps, 13);

                    const waitTime = Math.round(((1100 - Math.abs(sps)) / 99) * 10) + 400;
                    return Entry.PingpongG1.postCallReturn(script, packet, waitTime);
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
                    const packet = Entry.PingpongG1.makePacket(0xcc, 0x0004, [2, 0, 0, 1, 0, 0]);
                    return Entry.PingpongG1.postCallReturn(script, packet);
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
                    let angle = script.getNumberValue('DEGREE', script);

                    angle = Math.min(Math.max(angle, 0), 180);

                    const packet = Entry.PingpongG1.makePacket(0xe1, 0x00, [2, 0, angle, 1]);
                    return Entry.PingpongG1.postCallReturn(script, packet, 400);
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
                    return Entry.PingpongG1.postCallReturn(script, packet);
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
                    return Entry.PingpongG1.postCallReturn(script, packet, waitTime);
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
                    const packet = Entry.PingpongG1.makePacket(0xa2, 0xe3, [0x70, 1, 0, ' ']);
                    return Entry.PingpongG1.postCallReturn(script, packet);
                },
            },
        };
    }

    setLanguage() {
        return {
            ko: {
                template: {
                    pingpong_g1_when_button_pressed: '%1 큐브 단추를 눌렀을 때',
                    pingpong_g1_when_tilted: '%1 큐브가 %2 방향으로 기울였을 때',
                    pingpong_g1_is_button_pressed: '큐브 단추를 눌렀는가?',
                    pingpong_g1_is_tilted: '큐브가 %1 방향으로 기울여졌는가?',
                    pingpong_g1_get_tilt_value: '%1 방향 큐브 기울기',
                    pingpong_g1_get_sensor_value: '%1 센서값',
                    pingpong_g1_motor_rotate: '모터를 %1 방향으로 %2 도 회전하기 %3',
                    pingpong_g1_start_motor_rotate: '모터의 속도를 %1 으로 정하기 %2',
                    pingpong_g1_stop_motor_rotate: '모터 멈추기 %1',
                    pingpong_g1_rotate_servo_mortor: '서보모터를 %1도로 설정하기 %2',
                    pingpong_g1_is_top_shape: '큐브 윗면에 %1 모양이 있는가?',
                    pingpong_g1_set_dot_pixel: '도트 X:%1 Y:%2 %3 %4',
                    pingpong_g1_set_dot_string: '도트에 문자열 %1  %2초동안 출력 %3',
                    pingpong_g1_set_dot_clear: '도트 화면 삭제 %1',
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
