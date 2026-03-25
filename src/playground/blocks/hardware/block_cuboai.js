'use strict';

Entry.cuboai = {
    id: '6E.1',
    name: 'cuboai',
    url: 'http://www.cuborobot.com/',
    imageName: 'cuboai.png',
    title: {
        ko: '큐보 AI',
        en: 'CUBO AI',
    },
    cmdIdx: 0,
    packetStack: [],
    flushStack: function() {
        if (this.packetStack.length === 0) return;
        if (!Entry.hw.sendQueue.SET) Entry.hw.sendQueue.SET = {};
        this.packetStack.forEach(packet => {
            const currentIdx = this.cmdIdx++;
            const uniqueKey = `${packet.cmd}_${currentIdx}`;
            Entry.hw.sendQueue.SET[uniqueKey] = packet.payload;
        });
        
        this.updateAndClear();
        this.packetStack = [];
    },
    updateAndClear: function(){
        Entry.hw.update();
        Entry.hw.sendQueue.SET = {};
    },
    setZero: function() {
        Entry.hw.sendQueue.SET = {};
        Entry.hw.sendQueue.SET[Entry.cuboai.constants.CMD_DC_MOTOR_OFF] = {
            data: true                       
        };
        this.updateAndClear();
    },
    monitorTemplate: {
        imgPath: 'hw/cuboai.png',
        width: 1184,
        height: 864,
        listPorts: {
            'p1': {
                name: `핀 1`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            'p2': {
                name: `핀 2`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            'p3': {
                name: `핀 3`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            'p4': {
                name: `핀 4`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            'p5': {
                name: `핀 5`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            'p6': {
                name: `핀 6`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            'rmc': {
                name: `리모컨`,
                type: 'input',
                pos: { x: 0, y: 0 },
            }
        },
        mode: 'both',
    },
    constants: {
        CMD_GPIO_OUT: 0x80,
        CMD_SERVO_MOTOR: 0x81,
        CMD_DC_MOTOR_ALL_ON: 0x82,
        CMD_DC_MOTOR_OFF: 0x83,
        CMD_IN_KEYBOARD: 0x84,
        CMD_DC_MOTOR_1_ON: 0x85,
        CMD_DC_MOTOR_2_ON: 0x86,

        CMD_FLOW_COND_NUM: 0xB0,
        CMD_FLOW_COND_IF: 0xB1,
        CMD_FLOW_COND_IF_START: 0xB2,
        CMD_FLOW_COND_ELSE_START: 0xB3,
        CMD_FLOW_COND_IF_END: 0xB4,
        CMD_FLOW_LOOP_COND_START: 0xB5,
        CMD_FLOW_LOOP_COND_END: 0xB6,
        CMD_FLOW_LOOP_START: 0xB7,
        CMD_FLOW_LOOP_END: 0xB8,
        CMD_FLOW_LOOP_CNT_START: 0xB9,
        CMD_FLOW_LOOP_CNT_END: 0xBA,
        CMD_FLOW_LOOP_DELAY_SEC: 0xBB,
        CMD_FLOW_WRITE_VARIABLE: 0xBC,
        CMD_FLOW_READ_VARIABLE: 0xBD,
        CMD_FLOW_SET_VARIABLE: 0xBE,
        CMD_IOT_SERVO_MOTOR_ANGLE_VALUE: 0xBF,
        CMD_FLOW_LOOP_BREAK_CONTINUE: 0xC0,
        CMD_FLOW_JGMT_SIGN: 0xC1,
        CMD_FLOW_JGMT_BOOL: 0xC2,
        CMD_FLOW_JGMT_LOGIC: 0xC3,
        CMD_IOT_READ_REMOTE: 0xC4,
        CMD_IOT_DC_MOTOR_OFF: 0xC5,
        CMD_IOT_DC_MOTOR_SPEED: 0xC6,
        CMD_IOT_SERVO_MOTOR_ANGLE: 0xC7,
        CMD_IOT_DIGIT_OUTPUT: 0xC8,
        CMD_IOT_ANALOG_INPUT: 0xC9,
        CMD_IOT_DIGIT_INPUT: 0xCA,
        CMD_IOT_DC_MOTOR_1_ON: 0xCB,
        CMD_IOT_DC_MOTOR_2_ON: 0xCC,
        CMD_IOT_DC_ALL_MOTOR_VALUE: 0xCD,
        CMD_IOT_DC_MOTOR_1_VALUE: 0xCE,
        CMD_IOT_DC_MOTOR_2_VALUE: 0xCF,
        CMD_BLOCK_SAVE_START: 0xD0,
        CMD_BLOCK_SAVE_END: 0xD1,
    },
    getOffsetX(str) {
        return this.getByteLength(str) * 1.5 - 5;
    },
    getByteLength(s, b, i, c) {
        for (b = i = 0; (c = s.charCodeAt(i++)); b += c >> 11 ? 3 : c >> 7 ? 2 : 1);
        return b;
    },
    BlockState: {},
};
Entry.cuboai.setLanguage = function () {
    return {
        ko: {
            template: {
                cuboai_get_iot_title:'AI IoT 명령어',
                cuboai_set_digital_value: '디지털%1번 핀%2(으)로 정하기%3%4',    
                cuboai_get_digital_value: '디지털%1번 핀 읽기%2',
                cuboai_get_analog_value: '아날로그%1번 핀 읽기%2',
                cuboai_set_motor1_speed: '모터1 속도 L1:%1 R1:%2(으)로 정하기%3%4',
                cuboai_set_motor2_speed: '모터2 속도 L2:%1 R2:%2(으)로 정하기%3%4',
                cuboai_set_motor_speed: '모터 속도 L1:%1 L2:%2 R1:%3 R2:%4(으)로 정하기%5%6',
                cuboai_set_servo_motor: '%1번 서보모터 각도:%2 속도:%3(으)로 정하기%4%5',
                cuboai_stop_motor: '모든 DC 모터 끄기%1%2',
                cuboai_set_keyboard_value: '%1키보드 값 전달%2%3',
                cuboai_get_remote_value: '리모컨 값 읽기%1',     

                cuboai_get_save_title:'AI LAMP 저장',
                cuboai_block_save_start: '%1번으로 저장 시작%2',
                cuboai_block_save_end: '저장 끝%1',

                cuboai_get_cond_title:'AI LAMP 조건',
                cuboai_block_flow_if_start: '만약 %1하기{%2',
                cuboai_block_flow_else_start: '아니라면 하기{%1',
                cuboai_block_flow_else_end: '}아니라면 끝%1',
                cuboai_block_flow_if_end: '}만약 끝%1',

                cuboai_get_loop_title:'AI LAMP 반복',
                cuboai_block_flow_loop_start: '무한 반복 하기{%1',
                cuboai_block_flow_loop_end: '}무한 반복 끝%1',
                cuboai_block_flow_loop_cnt_start: '%1회 반복 하기{%2',
                cuboai_block_flow_loop_cnt_end: '}횟 수 반복 끝%1',
                cuboai_block_flow_loop_delay_sec: '멈추기 %1 %2 %3',
                cuboai_block_flow_loop_break_continue: '%1 %2',

                cuboai_get_jgmt_title:'AI LAMP 판단',
                cuboai_block_flow_jgmt_logic: '%1 %2 %3',
                cuboai_block_flow_jgmt_sign: '%1 %2 %3',

                cuboai_get_value_title:'AI LAMP 값',
                cuboai_block_flow_write_variable: '%1번%2(으)로 정하기%3',
                cuboai_block_flow_set_variable: '%1번%2(으)로%3하고 적용%4',                
                cuboai_block_flow_read_variable: '%1읽기',
                cuboai_block_flow_remote_value: '리모컨 값%1',
                                
                cuboai_get_command_title:'AI LAMP 명령어',
                cuboai_block_iotkit_digit_output: '디지털%1번 핀%2(으)로 정하기%3',
                cuboai_block_iotkit_digit_input: '디지털%1번 핀 읽기',
                cuboai_block_iotkit_analog_input: '아날로그%1번 핀 읽기',
                cuboai_block_iotkit_read_remote: '리모컨 값 읽기',
                cuboai_block_iotkit_dc_motor_1: '모터1 속도 L1:%1 R1:%2(으)로 정하기%3',
                cuboai_block_iotkit_dc_motor_1_: '모터1 속도 L1:%1 R1:%2(으)로 정하기%3',
                cuboai_block_iotkit_dc_motor_2: '모터2 속도 L2:%1 R2:%2(으)로 정하기%3',
                cuboai_block_iotkit_dc_motor_2_: '모터2 속도 L2:%1 R2:%2(으)로 정하기%3',
                cuboai_block_iotkit_dc_motor_speed: '모터 속도 L1:%1 L2:%2 R1:%3 R2:%4(으)로 정하기%5',
                cuboai_block_iotkit_dc_motor_off: '모든 DC 모터 끄기%1',                
                cuboai_block_iotkit_servo_motor: '%1번 서보모터 각도:%2 속도:%3(으)로 정하기%4',
            },
            Helper: { 
            },
            Device: {
                cuboai: 'cuboai',
            },
            Menus: {
                cuboai: 'cuboai',
            },
        },
    };
};
Entry.cuboai.blockMenuBlocks = [
    'cuboai_get_iot_title',
    'cuboai_set_digital_value',
    'cuboai_get_digital_value',
    'cuboai_get_analog_value',
    'cuboai_set_motor1_speed',
    'cuboai_set_motor2_speed',
    'cuboai_set_motor_speed',
    'cuboai_set_servo_motor',
    'cuboai_stop_motor',
    'cuboai_set_keyboard_value',
    'cuboai_get_remote_value',

    'cuboai_get_save_title',
    'cuboai_block_save_start',
    'cuboai_block_save_end',

    'cuboai_get_cond_title',
    'cuboai_block_flow_if_start',
    'cuboai_block_flow_else_start',
    'cuboai_block_flow_else_end',
    'cuboai_block_flow_if_end',

    'cuboai_get_loop_title',
    'cuboai_block_flow_loop_start',
    'cuboai_block_flow_loop_end',
    'cuboai_block_flow_loop_cnt_start',
    'cuboai_block_flow_loop_cnt_end',
    'cuboai_block_flow_loop_delay_sec',
    'cuboai_block_flow_loop_break_continue',

    'cuboai_get_jgmt_title',
    'cuboai_block_flow_jgmt_logic',
    'cuboai_block_flow_jgmt_sign',

    'cuboai_get_value_title',
    
    'cuboai_block_flow_write_variable',
    'cuboai_block_flow_set_variable',                
    'cuboai_block_flow_read_variable',
    'cuboai_block_flow_remote_value',

    'cuboai_get_command_title',
    'cuboai_block_iotkit_digit_output',
    'cuboai_block_iotkit_digit_input',
    'cuboai_block_iotkit_analog_input',
    'cuboai_block_iotkit_read_remote',
    'cuboai_block_iotkit_dc_motor_1',
    'cuboai_block_iotkit_dc_motor_1_',
    'cuboai_block_iotkit_dc_motor_2',
    'cuboai_block_iotkit_dc_motor_2_',
    'cuboai_block_iotkit_dc_motor_speed',
    'cuboai_block_iotkit_dc_motor_off',
    'cuboai_block_iotkit_servo_motor',
];
Entry.cuboai.getBlocks = function () {
    return {
        // AI IoT 명령어 카테고리
        cuboai_get_iot_title: {
            skeleton: 'basic_text',
            skeletonOptions: {
                box: {
                    offsetX: this.getOffsetX(Lang.template.cuboai_get_iot_title),
                    offsetY: 3,
                },
            },
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#d1702a',
            params: [
                {
                    type: 'Text',
                    text: Lang.template.cuboai_get_iot_title,
                    color: '#d1702a',
                    align: 'left',
                },
            ],
            def: {
                type: 'cuboai_get_iot_title',
            },
            class: 'AI_IoT_Command',
            isNotFor: ['cuboai'],
            events: {},
        },
        //디지털 핀, 값 설정
        cuboai_set_digital_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/moving_icon.svg',
                    size: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'cuboai_digital_out_list',
                        params: [1],
                    },
                    {
                        type: 'cuboai_highlow_list',
                        params: [1],
                    },
                    null,
                    null
                ],
                type: 'cuboai_set_digital_value',
            },
            paramsKeyMap: {
                port: 0,
                value: 1,
            },
            class: 'AI_IoT_Command',
            isNotFor: ['cuboai'],
            func: function(sprite, script) {
                if (!Entry.hw.sendQueue) {
                    Entry.hw.sendQueue = {};
                }
                let port = script.getNumberValue('port');
                let value = script.getNumberValue('value');
                Entry.hw.sendQueue.SET[Entry.cuboai.constants.CMD_GPIO_OUT] = {
                    port: port,
                    value: value,                       
                };
                Entry.cuboai.updateAndClear();
                return script.callReturn(); 
            },
            syntax: { js: [], py: ['cuboai.cuboai_set_digital_value(%1,%2)'] },
        },
        //디지털 핀 값 읽기
        cuboai_get_digital_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/moving_icon.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'cuboai_digital_in_list',
                        params: [1],
                    },
                    null
                ],
                type: 'cuboai_get_digital_value',
            },
            paramsKeyMap: {
                port: 0,
            },
            class: 'AI_IoT_Command',
            isNotFor: ['cuboai'],
            func: function(sprite, script) {
                const port = script.getNumberValue('port', script);
                const sensorKey = 'p' + port;
                const value = Entry.hw.portData[sensorKey];
                if(!Entry.hw.portData || Entry.hw.portData[sensorKey] === undefined){
                    return 1;
                }
                const rawValue = Entry.hw.portData[sensorKey];
                return rawValue > 100 ? 1 : 0;
            },
            syntax: { js: [], py: ['cuboai.cuboai_get_digital_value(%1)'] },
        },
        //아날로그 핀 값 읽기
        cuboai_get_analog_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/moving_icon.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'cuboai_digital_in_list',
                        params: [1],
                    },
                    null
                ],
                type: 'cuboai_get_analog_value',
            },
            paramsKeyMap: {
                port: 0,
            },
            class: 'AI_IoT_Command',
            isNotFor: ['cuboai'],
            func: function(sprite, script) {
                const port = script.getNumberValue('port', script);
                const sensorKey = 'p' + port;
                const value = Entry.hw.portData[sensorKey];
                if(!Entry.hw.portData || Entry.hw.portData[sensorKey] === undefined){
                    return 255;
                }
                const rawValue = Entry.hw.portData[sensorKey];
                return rawValue;
            },
            syntax: { js: [], py: ['cuboai.cuboai_get_analog_value(%1)'] },
        },
        //모터1 속도 설정
        cuboai_set_motor1_speed: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/moving_icon.svg',
                    size: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'cuboai_motor_speed_list',
                        params: [100],
                    },
                    {
                        type: 'cuboai_motor_speed_list',
                        params: [100],
                    },
                    null,
                    null
                ],
                type: 'cuboai_set_motor1_speed',
            },
            paramsKeyMap: {
                l1: 0,
                r1: 1,
            },
            class: 'AI_IoT_Command',
            isNotFor: ['cuboai'],
            func: function(sprite, script) {                
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                let l1 = script.getNumberValue('l1');
                let r1 = script.getNumberValue('r1');
                l1 = Math.max(-100, Math.min(l1, 100));
                r1 = Math.max(-100, Math.min(r1, 100));
                Entry.hw.sendQueue.SET[Entry.cuboai.constants.CMD_DC_MOTOR_1_ON] = {
                    l1: l1,
                    r1: r1,                       
                };
                Entry.cuboai.updateAndClear();
                return script.callReturn(); 
            },
            syntax: {
                js: [],
                py: ['cuboai.cuboai_set_motor1_speed(%1, %2)'],
            },
        },
        //모터2 속도 설정
        cuboai_set_motor2_speed: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/moving_icon.svg',
                    size: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'cuboai_motor_speed_list',
                        params: [100],
                    },
                    {
                        type: 'cuboai_motor_speed_list',
                        params: [100],
                    },
                    null,
                    null,
                ],
                type: 'cuboai_set_motor2_speed',
            },
            paramsKeyMap: {
                l2: 0,
                r2: 1,
            },
            class: 'AI_IoT_Command',
            isNotFor: ['cuboai'],
            func: function(sprite, script) {
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                let l2 = script.getNumberValue('l2');
                let r2 = script.getNumberValue('r2');
                l2 = Math.max(-100, Math.min(l2, 100));
                r2 = Math.max(-100, Math.min(r2, 100));
                Entry.hw.sendQueue.SET[Entry.cuboai.constants.CMD_DC_MOTOR_2_ON] = {
                    l2: l2,
                    r2: r2,                       
                };
                Entry.cuboai.updateAndClear();
                return script.callReturn(); 
            },
            syntax: {
                js: [],
                py: ['cuboai.cuboai_set_motor2_speed(%1, %2)'],
            },
        },
        //모터1, 2 속도 설정
        cuboai_set_motor_speed: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/moving_icon.svg',
                    size: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    100,
                    100,
                    100,
                    100,
                    null,
                    null,
                ],
                type: 'cuboai_set_motor_speed',
            },
            paramsKeyMap: {
                l1: 0,
                l2: 1,
                r1: 2,
                r2: 3,
            },
            class: 'AI_IoT_Command',
            isNotFor: ['cuboai'],
            func: function(sprite, script) {
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                let l1 = script.getNumberValue('l1');
                let r1 = script.getNumberValue('r1');
                let l2 = script.getNumberValue('l2');
                let r2 = script.getNumberValue('r2');
                l1 = Math.max(-100, Math.min(l1, 100));
                r1 = Math.max(-100, Math.min(r1, 100));
                l2 = Math.max(-100, Math.min(l2, 100));
                r2 = Math.max(-100, Math.min(r2, 100));
                Entry.hw.sendQueue.SET[Entry.cuboai.constants.CMD_DC_MOTOR_ALL_ON] = {
                    l1: l1,
                    r1: r1,                       
                    l2: l2,
                    r2: r2,
                };    
                Entry.cuboai.updateAndClear();          
                return script.callReturn(); 
            },
            syntax: {
                js: [],
                py: ['cuboai.cuboai_set_motor_speed(%1, %2, %3, %4)'],
            },
        },
        //서보모터 각도, 속도 설정
        cuboai_set_servo_motor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    value: '0',
                    fontSize: 11,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    value: '20',
                    fontSize: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/moving_icon.svg',
                    size: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'cuboai_servo_out_list',
                        params: [3],
                    },
                    null,
                    null,
                    null,
                    null,
                ],
                type: 'cuboai_set_servo_motor',
            },
            paramsKeyMap: {
                port: 0,
                angle: 1,
                speed: 2,
            },
            class: 'AI_IoT_Command',
            isNotFor: ['cuboai'],
            func: function(sprite, script) {
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                let port = script.getNumberValue('port');
                let angle = script.getNumberValue('angle');
                let speed = script.getNumberValue('speed');
                port = Math.max(3, Math.min(port, 6));
                angle = Math.max(-90, Math.min(angle, 90));
                if(angle < 0){
                    angle = 255 + angle;
                }
                Entry.hw.sendQueue.SET[Entry.cuboai.constants.CMD_SERVO_MOTOR] = {
                    port: port,
                    angle: angle,
                    speed: speed,
                };
                Entry.cuboai.updateAndClear();
                return script.callReturn(); 
            },
            syntax: { js: [], py: ['cuboai.cuboai_set_servo_motor(%1,%2,%3)'] },
        },
        //모든 DC모터 끄기
        cuboai_stop_motor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/moving_icon.svg',
                    size: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    null,
                ],
                type: 'cuboai_stop_motor',
            },
            paramsKeyMap: {},
            class: 'AI_IoT_Command',
            isNotFor: ['cuboai'],
            func: function(sprite, script) {
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[Entry.cuboai.constants.CMD_DC_MOTOR_OFF] = {
                    data: true,
                };
                Entry.cuboai.updateAndClear();
                return script.callReturn(); 
            },
            syntax: { js: [], py: ['cuboai.cuboai_stop_motor()'] },
        },
        //키보드 값 전달
        cuboai_set_keyboard_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            class: 'AI_IoT_Command',
            isNotFor: ['cuboai'],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },   
                {
                    type: 'Indicator',
                    img: 'block_icon/moving_icon.svg',
                    size: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 11,
                },            
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'cuboai_keyboard_list',
                    },
                    null,
                    null,
                ],
                type: 'cuboai_set_keyboard_value',
            },
            paramsKeyMap: {
                value: 0,
            },
             func: function(sprite, script) {
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                let value = script.getNumberValue('value');               
                Entry.hw.sendQueue.SET[Entry.cuboai.constants.CMD_IN_KEYBOARD] = {
                    value: value,
                };
                Entry.cuboai.updateAndClear();
                return script.callReturn(); 
            },
            syntax: { js: [], py: ['cuboai.cuboai_set_keyboard_value(%1)'] },
        },
        //리모컨 값 읽기
        cuboai_get_remote_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/moving_icon.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                ],
                type: 'cuboai_get_remote_value',
            },
            class: 'AI_IoT_Command',
            isNotFor: ['cuboai'],
            func: function(sprite, script) {               
                if(!Entry.hw.portData || Entry.hw.portData['rmc'] === undefined){
                    return 0;
                }
                const rawValue = Entry.hw.portData['rmc'];
                return rawValue;
            },
            syntax: { js: [], py: ['cuboai.cuboai_get_remote_value()'] },
        },

        // AI LAMP 저장 카테고리
        cuboai_get_save_title: {
            skeleton: 'basic_text',
            skeletonOptions: {
                box: {
                    offsetX: this.getOffsetX(Lang.template.cuboai_get_save_title),
                    offsetY: 3,
                },
            },
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#d1702a',
            params: [
                {
                    type: 'Text',
                    text: Lang.template.cuboai_get_iot_title,
                    color: '#d1702a',
                    align: 'left',
                },
            ],
            def: {
                type: 'cuboai_get_save_title',
            },
            class: 'AI_Save_Command',
            isNotFor: ['cuboai'],
            events: {},
        },
        // 저장 시작
        cuboai_block_save_start: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [   
                    {
                        type: 'cuboai_block_save_list',
                        params: [0],
                    },
                    null,
                ],
                type: 'cuboai_block_save_start',
            },
            paramsKeyMap: {
                value: 0,
            },
            class: 'AI_Save_Command',
            isNotFor: ['cuboai'],
            func: function(sprite, script) {
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                let value = script.getNumberValue('value');
                value = Math.max(0, Math.min(value, 1));
                const currentIdx = Entry.cuboai.cmdIdx++;
                const uniqueKey = `${Entry.cuboai.constants.CMD_BLOCK_SAVE_START}_${currentIdx}`;
                Entry.hw.sendQueue.SET[uniqueKey] = {
                    value: value,
                };
                Entry.cuboai.updateAndClear();
                return script.callReturn(); 
            },
            syntax: { js: [], py: ['cuboai.cuboai_block_save_start(%1)'] },
        },
        // 저장 끝
        cuboai_block_save_end: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_without_next',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                ],
                type: 'cuboai_block_save_end',
            },
            class: 'AI_Save_Command',
            isNotFor: ['cuboai'],
            func: function(sprite, script) {
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                const currentIdx = Entry.cuboai.cmdIdx++;
                const uniqueKey = `${Entry.cuboai.constants.CMD_BLOCK_SAVE_END}_${currentIdx}`;
                Entry.hw.sendQueue.SET[uniqueKey] = {
                    data: true,
                };
                Entry.cuboai.updateAndClear();
                if (Entry.engine && Entry.engine.toggleStop) {
                    Entry.engine.toggleStop(); 
                } else if (Entry.engine && Entry.engine.stopProject) {
                    Entry.engine.stopProject();
                }
                return script.callReturn(); 
            },
            syntax: { js: [], py: ['cuboai.cuboai_block_save_end()'] },
        },
        
        // AI LAMP 조건
        cuboai_get_cond_title:{
            skeleton: 'basic_text',
            skeletonOptions: {
                box: {
                    offsetX: this.getOffsetX(Lang.template.cuboai_get_cond_title),
                    offsetY: 3,
                },
            },
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#d1702a',
            params: [
                {
                    type: 'Text',
                    text: Lang.template.cuboai_get_cond_title,
                    color: '#d1702a',
                    align: 'left',
                },
            ],
            def: {
                type: 'cuboai_get_cond_title',
            },
            class: 'AI_Cond_Command',
            isNotFor: ['cuboai'],
            events: {},
        },

        cuboai_block_flow_if_start: {  
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE, 
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'boolean',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [   
                    null,
                    null,           
                ],
                type: 'cuboai_block_flow_if_start',
            },
            paramsKeyMap: {},
            class: 'AI_Cond_Command',
            isNotFor: ['cuboai'],
            func: function(sprite, script) {
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.cuboai.packetStack.unshift({
                    cmd: Entry.cuboai.constants.CMD_FLOW_COND_IF,
                    payload: { data: true }
                });

                Entry.cuboai.flushStack();
                Entry.cuboai.packetStack.unshift({
                    cmd: Entry.cuboai.constants.CMD_FLOW_COND_IF_START,
                    payload: { data: true }
                });

                Entry.cuboai.flushStack();
                return script.callReturn(); 
            },
            syntax: { js: [], py: ['cuboai.cuboai_block_flow_if_start(%1)'] },
        },
        cuboai_block_flow_else_start: {  
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE, 
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [   
                    null,           
                ],
                type: 'cuboai_block_flow_else_start',
            },
            class: 'AI_Cond_Command',
            isNotFor: ['cuboai'],
            func: function(sprite, script) {
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                const currentIdx = Entry.cuboai.cmdIdx++;
                const uniqueKey = `${Entry.cuboai.constants.CMD_FLOW_COND_ELSE_START}_${currentIdx}`;
                Entry.hw.sendQueue.SET[uniqueKey] = {
                    data: true,
                };
                Entry.cuboai.updateAndClear();
                return script.callReturn(); 
            },
            syntax: { js: [], py: ['cuboai.cuboai_block_flow_else_start()'] },
        },
        cuboai_block_flow_else_end: {  
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE, 
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [   
                    null,           
                ],
                type: 'cuboai_block_flow_else_end',
            },
            class: 'AI_Cond_Command',
            isNotFor: ['cuboai'],
            func: function(sprite, script) {
                return script.callReturn(); 
            },
            syntax: { js: [], py: ['cuboai.cuboai_block_flow_else_end()'] },
        },
        cuboai_block_flow_if_end: {  
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE, 
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [   
                    null,           
                ],
                type: 'cuboai_block_flow_if_end',
            },
            class: 'AI_Cond_Command',
            isNotFor: ['cuboai'],
            func: function(sprite, script) {
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                
                const currentIdx = Entry.cuboai.cmdIdx++;
                const uniqueKey = `${Entry.cuboai.constants.CMD_FLOW_COND_IF_END}_${currentIdx}`;
                Entry.hw.sendQueue.SET[uniqueKey] = {
                    data: true,
                };
                Entry.cuboai.updateAndClear();
                return script.callReturn(); 
            },
            syntax: { js: [], py: ['cuboai.cuboai_block_flow_if_end()'] },
        },

        //AI LAMP 반복
        cuboai_get_loop_title: {
            skeleton: 'basic_text',
            skeletonOptions: {
                box: {
                    offsetX: this.getOffsetX(Lang.template.cuboai_get_loop_title),
                    offsetY: 3,
                },
            },
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#d1702a',
            params: [
                {
                    type: 'Text',
                    text: Lang.template.cuboai_get_loop_title,
                    color: '#d1702a',
                    align: 'left',
                },
            ],
            def: {
                type: 'cuboai_get_loop_title',
            },
            class: 'AI_Loop_Command',
            isNotFor: ['cuboai'],
            events: {},
        },
        cuboai_block_flow_loop_start: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [   
                    null,
                ],
                type: 'cuboai_block_flow_loop_start',
            },
            paramsKeyMap: {},
            class: 'AI_Loop_Command',
            isNotFor: ['cuboai'],
            func: function(sprite, script) {
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                const currentIdx = Entry.cuboai.cmdIdx++;
                const uniqueKey = `${Entry.cuboai.constants.CMD_FLOW_LOOP_START}_${currentIdx}`;
                Entry.hw.sendQueue.SET[uniqueKey] = {
                    data: true,
                };
                Entry.cuboai.updateAndClear();
                return script.callReturn(); 
            },
            syntax: { js: [], py: ['cuboai.cuboai_block_flow_loop_start()'] },
        },
        cuboai_block_flow_loop_end: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [   
                    null,                               
                ],
                type: 'cuboai_block_flow_loop_end',
            },
            paramsKeyMap: {},
            class: 'AI_Loop_Command',
            isNotFor: ['cuboai'],
            func: function(sprite, script) {
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                const currentIdx = Entry.cuboai.cmdIdx++;
                const uniqueKey = `${Entry.cuboai.constants.CMD_FLOW_LOOP_END}_${currentIdx}`;
                Entry.hw.sendQueue.SET[uniqueKey] = {
                    data: true,
                };
                Entry.cuboai.updateAndClear();
                return script.callReturn(); 
            },
            syntax: { js: [], py: ['cuboai.cuboai_block_flow_loop_end()'] },
        },
        cuboai_block_flow_loop_cnt_start: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    fontSize: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [   
                    0,
                    null,
                ],
                type: 'cuboai_block_flow_loop_cnt_start',
            },
            paramsKeyMap: {
                value: 0,
            },
            class: 'AI_Loop_Command',
            isNotFor: ['cuboai'],
            func: function(sprite, script) {
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                const value = script.getNumberValue('value', script);
                const currentIdx = Entry.cuboai.cmdIdx++;
                const uniqueKey = `${Entry.cuboai.constants.CMD_FLOW_LOOP_CNT_START}_${currentIdx}`;
                Entry.hw.sendQueue.SET[uniqueKey] = {
                    value: value
                };
                Entry.cuboai.updateAndClear();
                return script.callReturn(); 
            },
            syntax: { js: [], py: ['cuboai.cuboai_block_flow_loop_cnt_start(%1)'] },
        },
        cuboai_block_flow_loop_cnt_end: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [   
                    null,
                ],
                type: 'cuboai_block_flow_loop_cnt_end',
            },
            paramsKeyMap: {},
            class: 'AI_Loop_Command',
            isNotFor: ['cuboai'],
            func: function(sprite, script) {
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                const currentIdx = Entry.cuboai.cmdIdx++;
                const uniqueKey = `${Entry.cuboai.constants.CMD_FLOW_LOOP_CNT_END}_${currentIdx}`;
                Entry.hw.sendQueue.SET[uniqueKey] = {
                    data: true,
                };
                Entry.cuboai.updateAndClear();
                return script.callReturn(); 
            },
            syntax: { js: [], py: ['cuboai.cuboai_block_flow_loop_cnt_end()'] },
        },
        cuboai_block_flow_loop_delay_sec: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    fontSize: 11,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [   
                    0,
                    {
                        type: 'cuboai_block_delay_list',
                        params: [1],
                    },
                    null,
                ],
                type: 'cuboai_block_flow_loop_delay_sec',
            },
            paramsKeyMap: {
                value: 0,
                type: 1,
            },
            class: 'AI_Loop_Command',
            isNotFor: ['cuboai'],
            func: function(sprite, script) {
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                const value = script.getNumberValue('value', script);
                const type = script.getNumberValue('type', script);
                const currentIdx = Entry.cuboai.cmdIdx++;
                const uniqueKey = `${Entry.cuboai.constants.CMD_FLOW_LOOP_DELAY_SEC}_${currentIdx}`;
                Entry.hw.sendQueue.SET[uniqueKey] = {
                    value: value,
                    type: type
                };
                Entry.cuboai.updateAndClear();
                return script.callReturn(); 
            },
            syntax: { js: [], py: ['cuboai.cuboai_block_flow_loop_delay_sec(%1,%2)'] },
        },
        cuboai_block_flow_loop_break_continue: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [   
                    {
                        type: 'cuboai_block_loop_break_list',
                        params: [0],
                    },
                    null,
                ],
                type: 'cuboai_block_flow_loop_break_continue',
            },
            paramsKeyMap: {
                value: 0,
            },
            class: 'AI_Loop_Command',
            isNotFor: ['cuboai'],
            func: function(sprite, script) {
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                const value = script.getNumberValue('value', script);
                const currentIdx = Entry.cuboai.cmdIdx++;
                const uniqueKey = `${Entry.cuboai.constants.CMD_FLOW_LOOP_BREAK_CONTINUE}_${currentIdx}`;
                Entry.hw.sendQueue.SET[uniqueKey] = {
                    value: value,
                };
                Entry.cuboai.updateAndClear();
                return script.callReturn(); 
            },
            syntax: { js: [], py: ['cuboai.cuboai_block_flow_loop_break_continue(%1)'] },
        },

        //AI LAMP 판단
        cuboai_get_jgmt_title: {    
            skeleton: 'basic_text',
            skeletonOptions: {
                box: {
                    offsetX: this.getOffsetX(Lang.template.cuboai_get_jgmt_title),
                    offsetY: 3,
                },
            },
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#d1702a',
            params: [
                {
                    type: 'Text',
                    text: Lang.template.cuboai_get_jgmt_title,
                    color: '#d1702a',
                    align: 'left',
                },
            ],
            def: {
                type: 'cuboai_get_jgmt_title',
            },
            class: 'AI_Jgmt_Command',
            isNotFor: ['cuboai'],
            events: {},
        },
        cuboai_block_flow_jgmt_logic: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            params: [
                {
                    type: 'Block',
                    accept: 'boolean',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'boolean',
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    {
                        type: 'cuboai_block_logic_list',
                        params: [1],
                    },,
                    null,
                ],
                type: 'cuboai_block_flow_jgmt_logic',
            },
            paramsKeyMap: {
                value: 1,
            },
            class: 'AI_Jgmt_Command',
            isNotFor: ['cuboai'],
            func: function(sprite, script) {
                let value = script.getNumberValue('value');
                Entry.cuboai.packetStack.unshift({
                    cmd: Entry.cuboai.constants.CMD_FLOW_JGMT_LOGIC,
                    payload: { 
                        value: value,
                    }
                });
                return script.callReturn(); 
            },
            syntax: { js: [], py: ['cuboai.cuboai_block_flow_jgmt_logic(%2)'] },
        },
        cuboai_block_flow_jgmt_sign: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                    value: '0',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                    value: '0',
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    {
                        type: 'cuboai_block_jgmt_list',
                        params: [0],
                    },,
                    null,
                ],
                type: 'cuboai_block_flow_jgmt_sign',
            },
            paramsKeyMap: {
                left: 0,
                jgmt: 1,
                right: 2,
            },
            class: 'AI_Jgmt_Command',
            isNotFor: ['cuboai'],
            func: function(sprite, script) {
                const left = script.getValue('left');
                const jgmt = script.getNumberValue('jgmt');
                const right = script.getValue('right');

                if(right && right.cmd){
                    Entry.cuboai.packetStack.unshift(right);
                }
                else if(right !== undefined && right !== null){
                    const val = isNaN(Number(right)) ? right : Number(right);
                    Entry.cuboai.packetStack.unshift({
                        cmd: Entry.cuboai.constants.CMD_FLOW_COND_NUM,
                        payload: { 
                            value: val,
                        }
                    });    
                }

                if(left && left.cmd){
                    Entry.cuboai.packetStack.unshift(left);
                }
                else if(left !== undefined && left !== null){
                    const val = isNaN(Number(left)) ? left : Number(left);
                    Entry.cuboai.packetStack.unshift({
                        cmd: Entry.cuboai.constants.CMD_FLOW_COND_NUM,
                        payload: { 
                            value: val,
                        }
                    });
                }
                Entry.cuboai.packetStack.unshift({
                    cmd: Entry.cuboai.constants.CMD_FLOW_JGMT_SIGN,
                    payload: { 
                        jgmt: jgmt,
                    }
                });
                return script.callReturn(); 
            },
            syntax: { js: [], py: ['cuboai.cuboai_block_flow_jgmt_sign(%2)'] },
        },
        
        
        //AI LAMP 값
        cuboai_get_value_title: {
            skeleton: 'basic_text',
            skeletonOptions: {
                box: {
                    offsetX: this.getOffsetX(Lang.template.cuboai_get_value_title),
                    offsetY: 3,
                },
            },
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#d1702a',
            params: [
                {
                    type: 'Text',
                    text: Lang.template.cuboai_get_value_title,
                    color: '#d1702a',
                    align: 'left',
                },
            ],
            def: {
                type: 'cuboai_get_value_title',
            },
            class: 'AI_Value_Command',
            isNotFor: ['cuboai'],
            events: {},
        },        
        cuboai_block_flow_write_variable: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                    value: '0',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'cuboai_block_variable_list',
                        params: [0],
                    },
                    null,
                    null,
                ],
                type: 'cuboai_block_flow_write_variable',
            },
            paramsKeyMap: {
                variable: 0,
                value: 1,
            },
            class: 'AI_Value_Command',
            isNotFor: ['cuboai'],
            func: function(sprite, script) {
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                let variable = script.getNumberValue('variable');
                let value = script.getNumberValue('value');
                const currentIdx = Entry.cuboai.cmdIdx++;
                const uniqueKey = `${Entry.cuboai.constants.CMD_FLOW_WRITE_VARIABLE}_${currentIdx}`;
                Entry.hw.sendQueue.SET[uniqueKey] = {
                    variable: variable,
                    value: value,                       
                };
                Entry.cuboai.updateAndClear();
                return script.callReturn(); 
            },
            syntax: { js: [], py: ['cuboai.cuboai_block_flow_write_variable(%1,%2)'] },
        },
        cuboai_block_flow_set_variable: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                    value: '0',
                    fontSize: 11,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'cuboai_block_variable_list',
                        params: [0],
                    },
                    null,
                    {
                        type: 'cuboai_block_calc_list',
                        params: [0],
                    },
                    null,
                ],
                type: 'cuboai_block_flow_set_variable',
            },
            paramsKeyMap: {
                variable: 0,
                value: 1,
                calc: 2,
            },
            class: 'AI_Value_Command',
            isNotFor: ['cuboai'],
            func: function(sprite, script) {
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                let variable = script.getNumberValue('variable');
                let value = script.getNumberValue('value');
                let calc = script.getNumberValue('calc');
                const currentIdx = Entry.cuboai.cmdIdx++;
                const uniqueKey = `${Entry.cuboai.constants.CMD_FLOW_SET_VARIABLE}_${currentIdx}`;
                Entry.hw.sendQueue.SET[uniqueKey] = {
                    variable: variable,
                    value: value,      
                    calc: calc,                 
                };
                Entry.cuboai.updateAndClear();
                return script.callReturn(); 
            },
            syntax: { js: [], py: ['cuboai.cuboai_block_flow_set_variable(%1,%2)'] },
        },  
        cuboai_block_flow_read_variable: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'cuboai_block_variable_list',
                        params: [0],
                    },
                ],
                type: 'cuboai_block_flow_read_variable',
            },
            paramsKeyMap: {
                variable: 0,
            },
            class: 'AI_Value_Command',
            isNotFor: ['cuboai'],
            func: function(sprite, script) {
                let variable = script.getNumberValue('variable');
                return {
                    cmd: Entry.cuboai.constants.CMD_FLOW_READ_VARIABLE,
                    payload: { 
                        variable: variable,
                    }                        
                }
            },
            syntax: { js: [], py: ['cuboai.cuboai_block_flow_read_variable(%1)'] },
        },     
        cuboai_block_flow_remote_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'cuboai_block_remocon_list',
                        params: [34],
                    },
                ],
                type: 'cuboai_block_flow_remote_value',
            },
            paramsKeyMap: {
                value: 0,
            },
            class: 'AI_Value_Command',
            isNotFor: ['cuboai'],
            func: function(sprite, script) {
                let value = script.getNumberValue('value');
                return {
                    cmd: Entry.cuboai.constants.CMD_FLOW_COND_NUM,
                    payload: { 
                        value: value,
                    }                        
                } 
            },
            syntax: { js: [], py: ['cuboai.cuboai_block_flow_remote_value(%1)'] },
        },
        cuboai_get_command_title: {
            skeleton: 'basic_text',
            skeletonOptions: {
                box: {
                    offsetX: this.getOffsetX(Lang.template.cuboai_get_command_title),
                    offsetY: 3,
                },
            },
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#d1702a',
            params: [
                {
                    type: 'Text',
                    text: Lang.template.cuboai_get_value_title,
                    color: '#d1702a',
                    align: 'left',
                },
            ],
            def: {
                type: 'cuboai_get_command_title',
            },
            class: 'AI_Command_Command',
            isNotFor: ['cuboai'],
            events: {},
        },
        //디지털 핀, 값 설정
        cuboai_block_iotkit_digit_output: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'cuboai_digital_out_list',
                        params: [1],
                    },
                    {
                        type: 'cuboai_highlow_list',
                        params: [1],
                    },
                    null,
                ],
                type: 'cuboai_block_iotkit_digit_output',
            },
            paramsKeyMap: {
                port: 0,
                value: 1,
            },
            class: 'AI_Command_Command',
            isNotFor: ['cuboai'],
            func: function(sprite, script) {
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                let port = script.getNumberValue('port');
                let value = script.getNumberValue('value');
                const currentIdx = Entry.cuboai.cmdIdx++;
                const uniqueKey = `${Entry.cuboai.constants.CMD_IOT_DIGIT_OUTPUT}_${currentIdx}`;
                Entry.hw.sendQueue.SET[uniqueKey] = {
                    port: port,
                    value: value,                       
                };
                Entry.cuboai.updateAndClear();
                return script.callReturn(); 
            },
            syntax: { js: [], py: ['cuboai.cuboai_block_iotkit_digit_output(%1,%2)'] },
        },
        //디지털 핀 값 읽기
        cuboai_block_iotkit_digit_input: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'cuboai_digital_in_list',
                        params: [1],
                    },
                ],
                type: 'cuboai_block_iotkit_digit_input',
            },
            paramsKeyMap: {
                port: 0,
            },
            class: 'AI_Command_Command',
            isNotFor: ['cuboai'],
            func: function(sprite, script) {
                let port = script.getNumberValue('port');
                return {
                    cmd: Entry.cuboai.constants.CMD_IOT_DIGIT_INPUT,
                    payload: {
                        port: port-1,
                    }                            
                };
                // Entry.cuboai.packetStack.unshift({
                //     cmd: Entry.cuboai.constants.CMD_IOT_DIGIT_INPUT,
                //     payload: { 
                //         port: port,
                //     }
                // });
                // return script.callReturn(); 
            },
            syntax: { js: [], py: ['cuboai.cuboai_block_iotkit_digit_input(%1)'] },
        },
        //아날로그 핀 값 읽기
        cuboai_block_iotkit_analog_input: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'cuboai_digital_in_list',
                        params: [1],
                    },
                ],
                type: 'cuboai_block_iotkit_analog_input',
            },
            paramsKeyMap: {
                port: 0,
            },
            class: 'AI_Command_Command',
            isNotFor: ['cuboai'],
            func: function(sprite, script) {
                let port = script.getNumberValue('port');
                return {
                    cmd: Entry.cuboai.constants.CMD_IOT_ANALOG_INPUT,
                    payload: { 
                        port: port-1,
                    }                        
                }
            },
            syntax: { js: [], py: ['cuboai.cuboai_block_iotkit_analog_input(%1)'] },
        },
        //모터1 속도 설정
        cuboai_block_iotkit_dc_motor_1: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'cuboai_motor_speed_list',
                        params: [100],
                    },
                    {
                        type: 'cuboai_motor_speed_list',
                        params: [100],
                    },
                    null,
                ],
                type: 'cuboai_block_iotkit_dc_motor_1',
            },
            paramsKeyMap: {
                l1: 0,
                r1: 1,
            },
            class: 'AI_Command_Command',
            isNotFor: ['cuboai'],
            func: function(sprite, script) {                
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                let l1 = script.getNumberValue('l1');
                let r1 = script.getNumberValue('r1');
                l1 = Math.max(-100, Math.min(l1, 100));
                r1 = Math.max(-100, Math.min(r1, 100));
                const currentIdx = Entry.cuboai.cmdIdx++;
                const uniqueKey = `${Entry.cuboai.constants.CMD_IOT_DC_MOTOR_1_ON}_${currentIdx}`;
                Entry.hw.sendQueue.SET[uniqueKey] = {
                    l1: l1,
                    r1: r1,                       
                };
                Entry.cuboai.updateAndClear();
                return script.callReturn(); 
            },
            syntax: {
                js: [],
                py: ['cuboai.cuboai_block_iotkit_dc_motor_1(%1, %2)'],
            },
        },
        cuboai_block_iotkit_dc_motor_1_: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                    value: '100',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                    value: '100',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    null,
                    null,
                ],
                type: 'cuboai_block_iotkit_dc_motor_1_',
            },
            paramsKeyMap: {
                l1: 0,
                r1: 1,
            },
            class: 'AI_Command_Command',
            isNotFor: ['cuboai'],
            func: function(sprite, script) {                
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                let l1 = script.getNumberValue('l1');
                let r1 = script.getNumberValue('r1');
                l1 = Math.max(-100, Math.min(l1, 100));
                r1 = Math.max(-100, Math.min(r1, 100));
                const currentIdx = Entry.cuboai.cmdIdx++;
                const uniqueKey = `${Entry.cuboai.constants.CMD_IOT_DC_MOTOR_1_ON}_${currentIdx}`;
                Entry.hw.sendQueue.SET[uniqueKey] = {
                    l1: l1,
                    r1: r1,                       
                };
                Entry.cuboai.updateAndClear();
                return script.callReturn(); 
            },
            syntax: {
                js: [],
                py: ['cuboai.cuboai_block_iotkit_dc_motor_1_(%1, %2)'],
            },
        },
        //모터2 속도 설정
        cuboai_block_iotkit_dc_motor_2: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'cuboai_motor_speed_list',
                        params: [100],
                    },
                    {
                        type: 'cuboai_motor_speed_list',
                        params: [100],
                    },
                    null,
                ],
                type: 'cuboai_block_iotkit_dc_motor_2',
            },
            paramsKeyMap: {
                l2: 0,
                r2: 1,
            },
            class: 'AI_Command_Command',
            isNotFor: ['cuboai'],
            func: function(sprite, script) {
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                let l2 = script.getNumberValue('l2');
                let r2 = script.getNumberValue('r2');
                l2 = Math.max(-100, Math.min(l2, 100));
                r2 = Math.max(-100, Math.min(r2, 100));
                const currentIdx = Entry.cuboai.cmdIdx++;
                const uniqueKey = `${Entry.cuboai.constants.CMD_IOT_DC_MOTOR_2_ON}_${currentIdx}`;
                Entry.hw.sendQueue.SET[uniqueKey] = {
                    l2: l2,
                    r2: r2,                       
                };
                Entry.cuboai.updateAndClear();
                return script.callReturn(); 
            },
            syntax: {
                js: [],
                py: ['cuboai.cuboai_block_iotkit_dc_motor_2(%1, %2)'],
            },
        },
        cuboai_block_iotkit_dc_motor_2_: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                    value: '100',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                    value: '100',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    null,
                    null,
                ],
                type: 'cuboai_block_iotkit_dc_motor_2_',
            },
            paramsKeyMap: {
                l2: 0,
                r2: 1,
            },
            class: 'AI_Command_Command',
            isNotFor: ['cuboai'],
            func: function(sprite, script) {
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                let l2 = script.getNumberValue('l2');
                let r2 = script.getNumberValue('r2');
                l2 = Math.max(-100, Math.min(l2, 100));
                r2 = Math.max(-100, Math.min(r2, 100));
                const currentIdx = Entry.cuboai.cmdIdx++;
                const uniqueKey = `${Entry.cuboai.constants.CMD_IOT_DC_MOTOR_2_ON}_${currentIdx}`;
                Entry.hw.sendQueue.SET[uniqueKey] = {
                    l2: l2,
                    r2: r2,                       
                };
                Entry.cuboai.updateAndClear();
                return script.callReturn(); 
            },
            syntax: {
                js: [],
                py: ['cuboai.cuboai_block_iotkit_dc_motor_2_(%1, %2)'],
            },
        },
        //모터1, 2 속도 설정
        cuboai_block_iotkit_dc_motor_speed: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                    value: '100',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                    value: '100',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                    value: '100',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                    value: '100',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    null,
                    null,
                    null,
                    null,
                ],
                type: 'cuboai_block_iotkit_dc_motor_speed',
            },
            paramsKeyMap: {
                l1: 0,
                l2: 1,
                r1: 2,
                r2: 3,
            },
            class: 'AI_Command_Command',
            isNotFor: ['cuboai'],
            func: function(sprite, script) {
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                let l1 = script.getNumberValue('l1');
                let r1 = script.getNumberValue('r1');
                let l2 = script.getNumberValue('l2');
                let r2 = script.getNumberValue('r2');
                l1 = Math.max(-100, Math.min(l1, 100));
                r1 = Math.max(-100, Math.min(r1, 100));
                l2 = Math.max(-100, Math.min(l2, 100));
                r2 = Math.max(-100, Math.min(r2, 100));
                const currentIdx = Entry.cuboai.cmdIdx++;
                const uniqueKey = `${Entry.cuboai.constants.CMD_IOT_DC_MOTOR_SPEED}_${currentIdx}`;
                Entry.hw.sendQueue.SET[uniqueKey] = {
                    l1: l1,
                    r1: r1,                       
                    l2: l2,
                    r2: r2,
                };    
                Entry.cuboai.updateAndClear();           
                return script.callReturn(); 
            },
            syntax: {
                js: [],
                py: ['cuboai.cuboai_block_iotkit_dc_motor_speed(%1, %2, %3, %4)'],
            },
        },
        //서보모터 각도, 속도 설정
        cuboai_block_iotkit_servo_motor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                    value: '0',
                    fontSize: 11,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                    value: '20',
                    fontSize: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'cuboai_servo_out_list',
                        params: [3],
                    },
                    null,
                    null,
                    null,
                ],
                type: 'cuboai_block_iotkit_servo_motor',
            },
            paramsKeyMap: {
                port: 0,
                angle: 1,
                speed: 2,
            },
            class: 'AI_Command_Command',
            isNotFor: ['cuboai'],
            func: function(sprite, script) {
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                let port = script.getNumberValue('port');
                let angle = script.getNumberValue('angle');
                let speed = script.getNumberValue('speed');
                port = Math.max(3, Math.min(port, 6));
                angle = Math.max(-90, Math.min(angle, 90));
                if(angle < 0){
                    angle = 255 + angle;
                }
                const currentIdx = Entry.cuboai.cmdIdx++;
                const uniqueKey = `${Entry.cuboai.constants.CMD_IOT_SERVO_MOTOR_ANGLE}_${currentIdx}`;
                Entry.hw.sendQueue.SET[uniqueKey] = {
                    port: port,
                    angle: angle,
                    speed: speed,
                };
                Entry.cuboai.updateAndClear();
                return script.callReturn(); 
            },
            syntax: { js: [], py: ['cuboai.cuboai_block_iotkit_servo_motor(%1,%2,%3)'] },
        },
        //모든 DC모터 끄기
        cuboai_block_iotkit_dc_motor_off: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [   
                    null,
                ],
                type: 'cuboai_block_iotkit_dc_motor_off',
            },
            class: 'AI_Command_Command',
            isNotFor: ['cuboai'],
            func: function(sprite, script) {
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                const currentIdx = Entry.cuboai.cmdIdx++;
                const uniqueKey = `${Entry.cuboai.constants.CMD_IOT_DC_MOTOR_OFF}_${currentIdx}`;
                Entry.hw.sendQueue.SET[uniqueKey] = {
                    data: true,
                };
                Entry.cuboai.updateAndClear();
                return script.callReturn(); 
            },
            syntax: { js: [], py: ['cuboai.cuboai_block_iotkit_dc_motor_off()'] },
        },
        //리모컨 값 읽기
        cuboai_block_iotkit_read_remote: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            events: {},
            class: 'AI_Command_Command',
            isNotFor: ['cuboai'],
            func: function(sprite, script) { 
                return { 
                    cmd: Entry.cuboai.constants.CMD_IOT_READ_REMOTE, 
                    payload: { data: true } 
                };
            },
            syntax: { js: [], py: ['cuboai.cuboai_block_iotkit_read_remote()'] },
        },
        
        // ETC Block
        cuboai_digital_out_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['OUT1', 1],
                        ['OUT2', 2],
                        ['OUT3', 3],
                        ['OUT4', 4],
                        ['OUT5', 5],
                    ],
                    value: 1,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                port: 0,
            },
            func: function(sprite, script) {
                return script.getStringField('port');
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['OUT1', 1],
                                    ['OUT2', 2],
                                    ['OUT3', 3],
                                    ['OUT4', 4],
                                    ['OUT5', 5],
                                ],
                                value: 1,
                                fontSize: 11,
                                converter: Entry.block.converters.returnStringKey,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'cuboai_digital_out_list',
                    },
                ],
            },
        },
        cuboai_digital_in_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['IN1', 1],
                        ['IN2', 2],
                        ['IN3', 3],
                        ['IN4', 4],
                        ['IN5', 5],
                    ],
                    value: 1,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                port: 0,
            },
            func: function(sprite, script) {
                return script.getStringField('port');
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['IN1', 1],
                                    ['IN2', 2],
                                    ['IN3', 3],
                                    ['IN4', 4],
                                    ['IN5', 5],
                                ],
                                value: 1,
                                fontSize: 11,
                                converter: Entry.block.converters.returnStringKey,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'cuboai_digital_in_list',
                    },
                ],
            },
        },
        cuboai_highlow_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['켜기', 1], 
                        ['끄기', 0]
                    ],
                    value: 1,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                value: 0,
            },
            func: function(sprite, script) {
                return script.getField('value');
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        keyOption: 'cuboai_highlow_list',
                    },
                ],
            },
        },
        cuboai_servo_out_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['OUT3', 3],
                        ['OUT4', 4],
                        ['OUT5', 5],
                        ['OUT6', 6],
                    ],
                    value: 3,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                port: 0,
            },
            func: function(sprite, script) {
                return script.getStringField('port');
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['OUT3', 3],
                                    ['OUT4', 4],
                                    ['OUT5', 5],
                                    ['OUT6', 6],
                                ],
                                value: 3,
                                fontSize: 11,
                                converter: Entry.block.converters.returnStringKey,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'cuboai_servo_out_list',
                    },
                ],
            },
        },
        cuboai_keyboard_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'DropdownExtra',
                    options: [
                        ['space', 32],
                        ['enter', 13],
                        ['↑', 9],
                        ['↓', 10],
                        ['←', 11],
                        ['→', 12],
                        ['a', 97],
                        ['b', 98],
                        ['c', 99],
                        ['d', 100],
                        ['e', 101],
                        ['f', 102],
                        ['g', 103],
                        ['h', 104],
                        ['i', 105],
                        ['j', 106],
                        ['k', 107],
                        ['l', 108],
                        ['m', 109],
                        ['n', 110],
                        ['o', 111],
                        ['p', 112],
                        ['q', 113],
                        ['r', 114],
                        ['s', 115],
                        ['t', 116],
                        ['u', 117],
                        ['v', 118],
                        ['w', 119],
                        ['x', 120],
                        ['y', 121],
                        ['z', 122],
                    ],
                    value: 32,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                }
            ],
            def: {
                params: [null],
            },
            paramsKeyMap: {
                value: 0,
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('value');
            }
        },
        cuboai_motor_speed_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['100', '100'],
                        ['90', '90'],
                        ['80', '80'],
                        ['70', '70'],
                        ['60', '60'],
                        ['50', '50'],
                        ['40', '40'],
                        ['30', '30'],
                        ['20', '20'],
                        ['10', '10'],
                        ['0', '0'],
                        ['-10', '-10'],
                        ['-20', '-20'],
                        ['-30', '-30'],
                        ['-40', '-40'],
                        ['-50', '-50'],
                        ['-60', '-60'],
                        ['-70', '-70'],
                        ['-80', '-80'],
                        ['-90', '-90'],
                        ['-100', '-100'],                        
                    ],
                    value: '100',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                PORT: 0,
            },
            func: function(sprite, script) {
                return script.getStringField('PORT');
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['100', '100'],
                                    ['90', '90'],
                                    ['80', '80'],
                                    ['70', '70'],
                                    ['60', '60'],
                                    ['50', '50'],
                                    ['40', '40'],
                                    ['30', '30'],
                                    ['20', '20'],
                                    ['10', '10'],
                                    ['0', '0'],
                                    ['-10', '-10'],
                                    ['-20', '-20'],
                                    ['-30', '-30'],
                                    ['-40', '-40'],
                                    ['-50', '-50'],
                                    ['-60', '-60'],
                                    ['-70', '-70'],
                                    ['-80', '-80'],
                                    ['-90', '-90'],
                                    ['-100', '-100'],   
                                ],
                                value: '100',
                                fontSize: 11,
                                converter: Entry.block.converters.returnStringKey,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'cuboai_motor_speed_list',
                    },
                ],
            },
        },
        cuboai_block_save_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['저장소1', 0],
                        ['저장소2', 1],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                PORT: 0,
            },
            func: function(sprite, script) {
                return script.getStringField('PORT');
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                     ['저장소1', '0'],
                                     ['저장소2', '1'],
                                ],
                                value: '0',
                                fontSize: 11,
                                converter: Entry.block.converters.returnStringKey,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'cuboai_block_save_list',
                    },
                ],
            },
        },
        cuboai_block_variable_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['변수1', 0],
                        ['변수2', 1],
                        ['변수3', 2],
                        ['변수4', 3],
                        ['변수5', 4],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                PORT: 0,
            },
            func: function(sprite, script) {
                return script.getStringField('PORT');
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['변수1', 0],
                                    ['변수2', 1],
                                    ['변수3', 2],
                                    ['변수4', 3],
                                    ['변수5', 4],
                                ],
                                value: '0',
                                fontSize: 11,
                                converter: Entry.block.converters.returnStringKey,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'cuboai_block_variable_list',
                    },
                ],
            },
        },
        cuboai_block_calc_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['더하기', 0],
                        ['빼기', 1],
                        ['곱하기', 2],
                        ['나누기', 3],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                PORT: 0,
            },
            func: function(sprite, script) {
                return script.getStringField('PORT');
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['더하기', 0],
                                    ['빼기', 1],
                                    ['곱하기', 2],
                                    ['나누기', 3],
                                ],
                                value: '0',
                                fontSize: 11,
                                converter: Entry.block.converters.returnStringKey,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'cuboai_block_calc_list',
                    },
                ],
            },
        },
        cuboai_block_remocon_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'DropdownExtra',
                    options: [
                        ['↑', 34],
                        ['↓', 42],
                        ['←', 58],
                        ['→', 50],
                        ['↑+F1', 5],
                        ['↑+F2', 41],
                        ['↑+F3', 21],
                        ['↑+F4', 57],
                        ['↓+F1', 13],
                        ['↓+F2', 61],
                        ['↓+F3', 29],
                        ['↓+F4', 45],
                        ['KEY OFF', 0],
                        ['R', 33],
                        ['F1', 38],
                        ['F2', 54],
                        ['F3', 46],
                        ['F4', 62],
                        ['↑+R', 49],
                        ['↓+R', 37],
                        ['←+R', 25],
                        ['→+R', 9],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                PORT: 0,
            },
            func: function(sprite, script) {
                return script.getStringField('PORT');
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['↑', 34],
                                    ['↓', 42],
                                    ['←', 58],
                                    ['→', 50],
                                    ['↑+F1', 5],
                                    ['↑+F2', 41],
                                    ['↑+F3', 21],
                                    ['↑+F4', 57],
                                    ['↓+F1', 13],
                                    ['↓+F2', 61],
                                    ['↓+F3', 29],
                                    ['↓+F4', 45],
                                    ['KEY OFF', 0],
                                    ['R', 33],
                                    ['F1', 38],
                                    ['F2', 54],
                                    ['F3', 46],
                                    ['F4', 62],
                                    ['↑+R', 49],
                                    ['↓+R', 37],
                                    ['←+R', 25],
                                    ['→+R', 9],
                                ],
                                value: '0',
                                fontSize: 11,
                                converter: Entry.block.converters.returnStringKey,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'cuboai_block_remocon_list',
                    },
                ],
            },
        },
        cuboai_block_logic_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['그리고', 1],
                        ['또는', 0],
                    ],
                    value: 1,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                PORT: 0,
            },
            func: function(sprite, script) {
                return script.getStringField('PORT');
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['그리고', 1],
                                    ['또는', 0],
                                ],
                                value: 1,
                                fontSize: 11,
                                converter: Entry.block.converters.returnStringKey,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'cuboai_block_logic_list',
                    },
                ],
            },
        },
        cuboai_block_jgmt_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['=', 0],
                        ['≠', 1],
                        ['<', 2],
                        ['≤', 3],
                        ['>', 4],
                        ['≥', 5],
                    ],
                    value: 1,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                PORT: 0,
            },
            func: function(sprite, script) {
                return script.getStringField('PORT');
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['=', 0],
                                    ['≠', 1],
                                    ['<', 2],
                                    ['≤', 3],
                                    ['>', 4],
                                    ['≥', 5],
                                ],
                                value: 1,
                                fontSize: 11,
                                converter: Entry.block.converters.returnStringKey,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'cuboai_block_jgmt_list',
                    },
                ],
            },
        },
        cuboai_block_delay_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['초', 1],
                        ['밀리초', 0],
                    ],
                    value: 1,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                PORT: 0,
            },
            func: function(sprite, script) {
                return script.getStringField('PORT');
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['초', 1],
                                    ['밀리초', 0],
                                ],
                                value: 1,
                                fontSize: 11,
                                converter: Entry.block.converters.returnStringKey,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'cuboai_block_delay_list',
                    },
                ],
            },
        },
        cuboai_block_loop_break_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['반복 중단', 0],
                        ['다음 반복', 1],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                PORT: 0,
            },
            func: function(sprite, script) {
                return script.getStringField('PORT');
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['반복 중단', 0],
                                    ['다음 반복', 1],
                                ],
                                value: 0,
                                fontSize: 11,
                                converter: Entry.block.converters.returnStringKey,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'cuboai_block_loop_break_list',
                    },
                ],
            },
        },
    };
};
module.exports = Entry.cuboai;
