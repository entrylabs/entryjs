'use strict';

const COMMAND_TYPE = {
    BLOCK_MOVE_FORWARD: 0x01,
    BLOCK_MOVE_BACKWARD: 0x21,
    BLOCK_TURN_LEFT: 0x02,
    BLOCK_TURN_RIGHT: 0x03,
    BLOCK_TURN_BACK: 0x04,
    /** */
    MOVE_FORWARD_LINE: 0x22,
    TURN_LEFT_LINE: 0x23,
    TURN_RIGHT_LINE: 0x24,
    TURN_BACK_LINE: 0x25,
    /** */
    TOGGLE_LINERRACER: 0x05,
    MOVE_FORWARD_SPEED: 0x06,
    MOVE_LEFT_SPEED: 0x07,
    MOVE_RIGHT_SPEED: 0x08,
    MOVE_BACKWARD_SPEED: 0x09,
    MOVE_FORWARD_LRSPEED: 0x0A,
    MOVE_BACKWARD_LRSPEED: 0x0B,
    MOVE_LRSPEED: 0x26,

    MOVE_UNIT:0x27,
    SPIN_DEGREE:0x28,

    TOPMOTOR_TURN:0x29,
    TOPMOTOR_MOVE_ABSOLUTE: 0x2A,
    TOPMOTOR_MOVE_RELATIVE: 0x2B,
    TOPMOTOR_STOP: 0x2C,

    STOP_KAMIBOT: 0x0C,
    RESET_KAMIBOT: 0x0D,
    SET_LED_COLOR: 0x0E,
    LED_TURN:0x2D,

    DRAW_SHAPE: 0x31,
    DRAW_CIRCLE:  0x32,
    MELODY_BEEP: 0x33,
    MELODY_MUTE: 0x34,

    EMERGENCY_STOP: 0x35,
    RESET_INITIALIZE: 0x36,

    KAMIBOT_CLEAR: 0x17,
    PING: 0x18,
    RESET:0xFF
};


Entry.KamibotPi = {
    id: '42.2',
    name: 'kamibotPi',
    url: 'http://www.kamibot.com/',
    imageName: 'kamibotPi.png',
    title: {
        ko: '카미봇Pi',
        en: 'KamibotPi',
    },
    moveSpeed: 100,

    getHashKey: function() {
        let key = new Date().getSeconds().toString(16);
        if (key.length === 1) {
            key += ((Math.random() * 16) | 0).toString(16);
        }
        return Entry.generateHash() + key;
    },

    /**
     * 정지버튼을 누르면 실행
     */
    setZero: function() {
        const sq = Entry.hw.sendQueue;
        const pd = Entry.hw.portData;

        const msgId = Entry.KamibotPi.getHashKey();
        sq.msg_id = msgId;
        const msg = {
            id: msgId,
            type: COMMAND_TYPE.EMERGENCY_STOP,
            data: {
            },
            time: Date.now()
        };
        sq.msg = msg;

        Entry.hw.update(); // 해당 데이터를 하드웨어에 전달한다.
    },

    clamp: function(n, min, max) {
        return Math.min(Math.max(n, min), max);
    }
};

Entry.KamibotPi.setLanguage = function() {
    return {
        ko: {
            template: {
                kamibot_move_forward: "{ 블록 }: %1 %2 칸 가기 %3",
                kamibot_turn_left: "{ 블록 }: %1으로 돌기 %2",
                kamibot_turn_right: "{ 블록 }: 오른쪽으로 돌기 %1",
                kamibot_turn_back: "{ 블록 }: 뒤로 돌기 %1",
                /** */
                kamibot_move_forward_line: "{ 라인 }: 앞으로 %1칸 가기 %2",
                kamibot_turn_left_line: "{ 라인 }: %1으로 돌기 %2",
                /** */
                kamibot_linetracer_speed: "선따라 이동 속도 %1 로 정하기 %2",
                kamibot_linetracer: "선따라 이동하기 %1 %2",

                kamibot_forward_speed: "%1 %2 속도로 가기 %3",
                kamibot_left_speed: "%1으로 %2 속도로 돌기 %3",

                kamibot_lspeed_rspeed: "왼쪽바퀴:속도 %1 %2, 오른쪽바퀴:속도 %3 %4 %5",
                kamibot_move_unit: "%1 속도: %2으로 %3 cm 이동 %4",
                kamibot_spin_unit: "%1 도 %2으로 제자리 돌기 %3",

                kamibot_topmotor_turn:"머리 %1으로 돌리기 %2",
                kamibot_topmotor_move_abs:"머리 %1도 위치로 이동 %2",
                kamibot_topmotor_move_relative:"머리 %1도 만큼 회전 %2",
                kamibot_topmotor_stop:"머리 멈추기 %1",
                kamibot_stop: "이동 멈추기 %1",

                kamibot_draw_shape:"한 변(지름) %1cm인 %2 그리기 %3",

                kamibot_color_rgb:'LED R:%1 G:%2 B:%3 으로 바꾸기 %4',
                kamibot_color: "LED %1 으로 바꾸기 %2",
                
                kamibot_melody_beep: "%1번 음계 %2초동안 연주하기 %3",

                kamibot_distance_sensor:"%1 근접센서 %2",
                kamibot_line_sensor:"%1 바닥센서 %2",
                kamibot_color_sensor:"컬러센서 %1값 %2",

                kamibot_all_stop:"모두 멈추기 %1",
                kamibot_initialize:"상태 초기화 %1"

            },
            Blocks: {
                kamibot_dir_forward: '앞으로',
                kamibot_dir_backward: '뒤로',
                kamibot_dir_left: '왼쪽',
                kamibot_dir_right: '오른쪽',
                kamibot_dir_center: '중앙',
                kamibot_toggle_on: '켜기',
                kamibot_toggle_off: '끄기',
                kamibot_color_red: '빨강',
                kamibot_color_pink: '분홍',
                kamibot_color_blue: '파랑',
                kamibot_color_sky: '하늘',
                kamibot_color_green: '초록',
                kamibot_color_yellow: '노랑',
                kamibot_color_white: '하양',
                kamibot_color_tri: '삼각형',
                kamibot_color_rec: '사각형',
                kamibot_color_penta: '오각형',
                kamibot_color_hexa: '육각형',
                kamibot_color_star: '별',
                kamibot_color_circle: '원',
                kamibot_color_r:'R',
                kamibot_color_g:'G',
                kamibot_color_b:'B',
            }
        },
        en: {
            template: {
                kamibot_move_forward: "{block}: move %1 %2 block %3",
                kamibot_turn_left: "{block}: turn %1 %2",
                kamibot_turn_right: "{block}: turn right %1",
                kamibot_turn_back: "{block}: turn back %1",
                /** */
                kamibot_move_forward_line: "{ line }: move forward %1 %2",
                kamibot_turn_left_line: "{ line }: turn %1 %2",
                /** */
                kamibot_linetracer_speed: "set linetracer speed %1 %2",
                kamibot_linetracer: "turn linetracer %1 %2",

                kamibot_forward_speed: "move %1 speed: %2 %3",
                kamibot_left_speed: "move %1 speed: %2 %3",

                kamibot_lspeed_rspeed: "left wheel:speed %1 %2, right wheel:speed %3 %4 %5",
                kamibot_move_unit: "move %1 speed:%2 %3 cm %4",
                kamibot_spin_unit: "%1 degree, turn %2 %3",

                kamibot_topmotor_turn:"top-motor turn %1 %2",
                kamibot_topmotor_move_abs:"turn top-motor abs position %1 %2",
                kamibot_topmotor_move_relative:"turn top-motor relative position %1 %2",
                kamibot_topmotor_stop:"stop top-motor %1",
                kamibot_stop: "stop %1",

                kamibot_draw_shape:"length %1 cm draw %2 %3",

                kamibot_color: "set LED color to %1 %2",
                kamibot_color_rgb: "set LED color to R:%1, G:%2, B:%3 %4",

                kamibot_melody_beep: "make sound number %1, %2sec %3",

                kamibot_distance_sensor:"%1 distance sensor %2",
                kamibot_line_sensor:"%1 line seonsor %2",
                kamibot_color_sensor:"color sensor %1 %2",

                kamibot_all_stop:"all stop %1",
                kamibot_initialize:"state reset %1"
            },
            Blocks: {
                kamibot_dir_forward: 'forward',
                kamibot_dir_backward: 'backward',
                kamibot_dir_left: 'left',
                kamibot_dir_right: 'right',
                kamibot_dir_center: 'center',
                kamibot_toggle_on: 'on',
                kamibot_toggle_off: 'off',
                kamibot_color_red: 'red',
                kamibot_color_pink: 'pink',
                kamibot_color_blue: 'blue',
                kamibot_color_sky: 'sky',
                kamibot_color_green: 'green',
                kamibot_color_yellow: 'yellow',
                kamibot_color_white: 'white',
                kamibot_color_tri: 'triangle',
                kamibot_color_rec: 'rectangle',
                kamibot_color_penta: 'pentagon',
                kamibot_color_hexa: 'hexagon',
                kamibot_color_star: 'star',
                kamibot_color_circle: 'circle',
                kamibot_color_r:'R',
                kamibot_color_g:'G',
                kamibot_color_b:'B',
            }
        },
    };
};

Entry.KamibotPi.blockMenuBlocks = [
    
    'kamibot_move_forward',
    'kamibot_turn_left',

    'kamibot_move_forward_line',
    'kamibot_turn_left_line',
    // '-----------------------------' 
    'kamibot_color',
    'kamibot_color_rgb',

    'kamibot_draw_shape',
    'kamibot_melody_beep',

    'kamibot_distance_sensor',
    'kamibot_line_sensor',
    'kamibot_color_sensor',
    // '-----------------------------' 
    'kamibot_forward_speed',
    'kamibot_left_speed',
    'kamibot_lspeed_rspeed',
    'kamibot_move_unit',
    'kamibot_spin_unit',
    'kamibot_stop',

    'kamibot_topmotor_turn',
    'kamibot_topmotor_move_abs',
    'kamibot_topmotor_move_relative',
    'kamibot_topmotor_stop',

    'kamibot_all_stop',
    'kamibot_initialize',

];

Entry.KamibotPi.getBlocks = function() {
    return {
        kamibot_move_forward: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.kamibot_dir_forward, 'forward'],
                        [Lang.Blocks.kamibot_dir_backward, 'backward'],
                    ],
                    value: 'forward',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
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
            def: {
                params: [
                    null,
                    {
                        type: 'number',
                        params: [1],
                    },
                    null,
                ],
                type: 'kamibot_move_forward',
            },
            paramsKeyMap: {
                MOVE_DIR:0,
                VALUE: 1,
            },
            class: 'kamibot_mapboard',
            isNotFor: ['kamibotPi'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;

                const moveDir = script.getField('MOVE_DIR');
                const value = parseInt( script.getValue('VALUE'));
                let type = COMMAND_TYPE.BLOCK_MOVE_FORWARD;
                if(moveDir == 'backward') {
                    type = COMMAND_TYPE.BLOCK_MOVE_BACKWARD;
                }

                if (!script.is_started) {
                    script.is_started = true;
                    const msgId = Entry.KamibotPi.getHashKey();
                    script.msg_id = msgId;
                    sq.msg_id = script.msg_id;
                    const msg = {
                        id: msgId,
                        type: type,
                        data: {
                            param1:value,
                        },
                        time: Date.now()
                    };
                    sq.msg = msg;
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    delete pd.msgId;
                    return script.callReturn();
                }
                return script;
            },
        },
        kamibot_turn_left: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.kamibot_dir_left, 'left'],
                        [Lang.Blocks.kamibot_dir_right, 'right'],
                        [Lang.Blocks.kamibot_dir_backward, 'backward'],
                    ],
                    value: 'left',
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
                params: [
                    null,
                    null,
                ],
                type: 'kamibot_turn_left',
            },
            paramsKeyMap: {
                MOVE_DIR:0,
            },
            class: 'kamibot_mapboard',
            isNotFor: ['kamibotPi'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;

                const moveDir = script.getField('MOVE_DIR');
                let type = COMMAND_TYPE.BLOCK_TURN_LEFT;
                if(moveDir == 'right') {
                    type = COMMAND_TYPE.BLOCK_TURN_RIGHT;
                } else if(moveDir == 'backward') {
                    type = COMMAND_TYPE.BLOCK_TURN_BACK;
                }

                if (!script.is_started) {
                    script.is_started = true;
                    const msgId = Entry.KamibotPi.getHashKey();
                    script.msg_id = msgId;
                    sq.msg_id = script.msg_id;
                    const msg = {
                        id: msgId,
                        type: type,
                        data: {
                        },
                        time: Date.now()
                    };
                    sq.msg = msg;
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    delete pd.msgId;
                    return script.callReturn();
                }
                return script;
            },
        },
        // '----------------------------------------------------------------------------'
        kamibot_move_forward_line: {
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
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'number',
                        params: [1],
                    },
                    null,
                ],
                type: 'kamibot_move_forward_line',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'kamibot_mapboard',
            isNotFor: ['kamibotPi'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;

                const value = parseInt( script.getValue('VALUE'));
                let type = COMMAND_TYPE.MOVE_FORWARD_LINE;

                if (!script.is_started) {
                    script.is_started = true;
                    const msgId = Entry.KamibotPi.getHashKey();
                    script.msg_id = msgId;
                    sq.msg_id = script.msg_id;
                    const msg = {
                        id: msgId,
                        type: type,
                        data: {
                            param1:value,
                        },
                        time: Date.now()
                    };
                    sq.msg = msg;
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    delete pd.msgId;
                    return script.callReturn();
                }
                return script;
            },
        },
        kamibot_turn_left_line: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.kamibot_dir_left, 'left'],
                        [Lang.Blocks.kamibot_dir_right, 'right'],
                        [Lang.Blocks.kamibot_dir_backward, 'backward'],
                    ],
                    value: 'left',
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
                params: [
                    null,
                    null,
                ],
                type: 'kamibot_turn_left_line',
            },
            paramsKeyMap: {
                MOVE_DIR:0,
            },
            class: 'kamibot_mapboard',
            isNotFor: ['kamibotPi'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;

                const moveDir = script.getField('MOVE_DIR');
                console.log('moveDir', moveDir)
                let type = COMMAND_TYPE.TURN_LEFT_LINE;
                if(moveDir == 'right') {
                    type = COMMAND_TYPE.TURN_RIGHT_LINE;
                } else if(moveDir == 'backward') {
                    type = COMMAND_TYPE.TURN_BACK_LINE;
                }

                if (!script.is_started) {
                    script.is_started = true;
                    const msgId = Entry.KamibotPi.getHashKey();
                    script.msg_id = msgId;
                    sq.msg_id = script.msg_id;
                    const msg = {
                        id: msgId,
                        type: type,
                        data: {
                        },
                        time: Date.now()
                    };
                    sq.msg = msg;
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    delete pd.msgId;
                    return script.callReturn();
                }
                return script;
            },
        },
        // '----------------------------------------------------------------------------'
        kamibot_set_speed:{
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
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'number',
                        params: [100],
                    },
                    null,
                ],
                type: 'kamibot_set_speed',
            },
            paramsKeyMap: {
                SPEED:0,
            },
            class: 'kamibotpi_control',
            isNotFor: ['kamibotPi'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;

                const speed = parseInt( script.getValue('SPEED'));
                Entry.KamibotPi.moveSpeed = speed;
                return null;
            },
        },
        // '----------------------------------------------------------------------------'
        kamibot_forward_speed: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.kamibot_dir_forward, 'forward'],
                        [Lang.Blocks.kamibot_dir_backward, 'backward'],
                    ],
                    value: 'forward',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
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
            def: {
                params: [
                    null,
                    {
                        type: 'number',
                        params: [30],
                    },
                    null,
                ],
                type: 'kamibot_forward_speed',
            },
            paramsKeyMap: {
                MOVE_DIR:0,
                SPEED: 1,
            },
            class: 'kamibot_control',
            isNotFor: ['kamibotPi'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;

                const moveDir = script.getField('MOVE_DIR');
                const speed = script.getValue('SPEED');
                let type = COMMAND_TYPE.MOVE_FORWARD_SPEED;
                if(moveDir == 'backward') {
                    type = COMMAND_TYPE.MOVE_BACKWARD_SPEED;
                }

                if (!script.is_started) {
                    script.is_started = true;
                    const msgId = Entry.KamibotPi.getHashKey();
                    script.msg_id = msgId;
                    sq.msg_id = script.msg_id;
                    const msg = {
                        id: msgId,
                        type: type,
                        data: {
                            param1:speed,
                            param2:speed,
                        },
                        time: Date.now()
                    };
                    sq.msg = msg;
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    delete pd.msgId;
                    return script.callReturn();
                }
                return script;
            },
        },
        kamibot_left_speed: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.kamibot_dir_left, 'left'],
                        [Lang.Blocks.kamibot_dir_right, 'right'],
                    ],
                    value: 'left',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
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
            def: {
                params: [
                    null,
                    {
                        type: 'number',
                        params: [30],
                    },
                    null,
                ],
                type: 'kamibot_left_speed',
            },
            paramsKeyMap: {
                MOVE_DIR:0,
                SPEED: 1,
            },
            class: 'kamibot_control',
            isNotFor: ['kamibotPi'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;

                const speed = script.getValue('SPEED');
                const moveDir = script.getField('MOVE_DIR');
                console.log('moveDir', moveDir)
                let type = COMMAND_TYPE.MOVE_LEFT_SPEED;
                if(moveDir == 'right') {
                    type = COMMAND_TYPE.MOVE_RIGHT_SPEED;
                } 

                if (!script.is_started) {
                    script.is_started = true;
                    const msgId = Entry.KamibotPi.getHashKey();
                    script.msg_id = msgId;
                    sq.msg_id = script.msg_id;
                    const msg = {
                        id: msgId,
                        type: type,
                        data: {
                            param1:speed,
                        },
                        time: Date.now()
                    };
                    sq.msg = msg;
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    delete pd.msgId;
                    return script.callReturn();
                }
                return script;
            },
        },
        kamibot_lspeed_rspeed: {
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
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.kamibot_dir_forward, 'forward'],
                        [Lang.Blocks.kamibot_dir_backward, 'backward'],
                    ],
                    value: 'forward',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.kamibot_dir_forward, 'forward'],
                        [Lang.Blocks.kamibot_dir_backward, 'backward'],
                    ],
                    value: 'forward',
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
                params: [
                    {
                        type: 'number',
                        params: [30],
                    },
                    null,
                    {
                        type: 'number',
                        params: [30],
                    },
                    null,
                    null,
                ],
                type: 'kamibot_lspeed_rspeed',
            },
            paramsKeyMap: {
                LSPEED: 0,
                L_DIR:1,
                RSPEED: 2,
                R_DIR:3,
            },
            class: 'kamibot_control',
            isNotFor: ['kamibotPi'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;

                const lspeed = script.getValue('LSPEED');
                const rspeed = script.getValue('RSPEED');
                let leftDir = script.getField('L_DIR');
                let rightDir = script.getField('R_DIR');
                
                if(leftDir == 'backward') {
                    leftDir = 0x01
                } else {
                    leftDir = 0x00
                }
                if(rightDir == 'backward') {
                    rightDir = 0x01
                }else {
                    rightDir = 0x00
                }

                if (!script.is_started) {
                    script.is_started = true;
                    const msgId = Entry.KamibotPi.getHashKey();
                    script.msg_id = msgId;
                    sq.msg_id = script.msg_id;
                    const msg = {
                        id: msgId,
                        type: COMMAND_TYPE.MOVE_LRSPEED,
                        data: {
                            param1:lspeed,
                            param2:leftDir,
                            param3:rspeed,
                            param4:rightDir,
                        },
                        time: Date.now()
                    };
                    sq.msg = msg;
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    delete pd.msgId;
                    return script.callReturn();
                }
                return script;
            },
        },
        kamibot_move_unit: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.kamibot_dir_forward, 'forward'],
                        [Lang.Blocks.kamibot_dir_backward, 'backward'],
                    ],
                    value: 'forward',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    {
                        type: 'number',
                        params: [30],
                    },
                    {
                        type: 'number',
                        params: [5],
                    },
                    null,
                ],
                type: 'kamibot_move_unit',
            },
            paramsKeyMap: {
                MOVE_DIR:0,
                SPEED:1,
                VALUE: 2,
            },
            class: 'kamibot_control',
            isNotFor: ['kamibotPi'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;

                let moveDir = script.getField('MOVE_DIR');
                const value = parseInt( script.getValue('VALUE'));
                const speed = parseInt( script.getValue('SPEED'));

                let type = COMMAND_TYPE.MOVE_UNIT;

                if(moveDir == 'backward') {
                    moveDir = 0x04;    // 뒤로
                } else {
                    moveDir = 0x01;    // 앞으로
                }

                if (!script.is_started) {
                    script.is_started = true;
                    const msgId = Entry.KamibotPi.getHashKey();
                    script.msg_id = msgId;
                    sq.msg_id = script.msg_id;
                    const msg = {
                        id: msgId,
                        type: type,
                        data: {
                            param1:moveDir,
                            param2:value,
                            param3:speed,
                        },
                        time: Date.now()
                    };
                    sq.msg = msg;
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    delete pd.msgId;
                    return script.callReturn();
                }
                return script;
            },
        },
        kamibot_spin_unit: {
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
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.kamibot_dir_left, 'left'],
                        [Lang.Blocks.kamibot_dir_right, 'right'],
                    ],
                    value: 'left',
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
                params: [
                    {
                        type: 'number',
                        params: [90],
                    },
                    null,
                    null,
                ],
                type: 'kamibot_spin_unit',
            },
            paramsKeyMap: {
                DEGREE:0,
                SPIN_DIR:1,
            },
            class: 'kamibot_control',
            isNotFor: ['kamibotPi'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;

                let spinDir = script.getField('SPIN_DIR');
                const degree = parseInt( script.getValue('DEGREE'));

                let type = COMMAND_TYPE.SPIN_DEGREE;

                let ldir=0x01;
                let rdir=0x01;
                if(spinDir == 'left') {
                    ldir=0x02;
                    rdir=0x01;
                } else {
                    ldir=0x01;
                    rdir=0x02;
                }

                if (!script.is_started) {
                    script.is_started = true;
                    const msgId = Entry.KamibotPi.getHashKey();
                    script.msg_id = msgId;
                    sq.msg_id = script.msg_id;
                    const msg = {
                        id: msgId,
                        type: type,
                        data: {
                            param1:ldir,
                            param2:rdir,
                            param3:degree,
                        },
                        time: Date.now()
                    };
                    sq.msg = msg;
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    delete pd.msgId;
                    return script.callReturn();
                }
                return script;
            },
        },
        kamibot_stop: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
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
                ],
                type: 'kamibot_stop',
            },
            paramsKeyMap: {
            },
            class: 'kamibot_control',
            isNotFor: ['kamibotPi'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;

                if (!script.is_started) {
                    script.is_started = true;
                    const msgId = Entry.KamibotPi.getHashKey();
                    script.msg_id = msgId;
                    sq.msg_id = script.msg_id;
                    const msg = {
                        id: msgId,
                        type: COMMAND_TYPE.STOP_KAMIBOT,
                        data: {
                        },
                        time: Date.now()
                    };
                    sq.msg = msg;
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    delete pd.msgId;
                    return script.callReturn();
                }
                return script;
            },
        },
        // '-------------------------------------------------------------------------------------'
        kamibot_topmotor_turn: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.kamibot_dir_left, 'left'],
                        [Lang.Blocks.kamibot_dir_right, 'right'],
                    ],
                    value: 'left',
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
                params: [
                    null,
                    null,
                ],
                type: 'kamibot_topmotor_turn',
            },
            paramsKeyMap: {
                MOVE_DIR:0,
            },
            class: 'kamibot_topmotor_control',
            isNotFor: ['kamibotPi'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;

                let moveDir = script.getField('MOVE_DIR');
                let type = COMMAND_TYPE.TOPMOTOR_TURN;

                if(moveDir == 'left') {
                    moveDir = 0x02;    // 왼쪽
                } else {
                    moveDir = 0x01;    // 오른쪽
                }
                const speed = 9;   // 1 ~ 10
                const torque = 3;

                if (!script.is_started) {
                    script.is_started = true;
                    const msgId = Entry.KamibotPi.getHashKey();
                    script.msg_id = msgId;
                    sq.msg_id = script.msg_id;
                    const msg = {
                        id: msgId,
                        type: type,
                        data: {
                            param1:moveDir,
                            param2:speed,
                            param3:torque,
                        },
                        time: Date.now()
                    };
                    sq.msg = msg;
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    delete pd.msgId;
                    return script.callReturn();
                }
                return script;
            },
        },
        kamibot_topmotor_move_abs: {
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
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'number',
                        params: [90],
                    },
                    null,
                ],
                type: 'kamibot_topmotor_move_abs',
            },
            paramsKeyMap: {
                DEGREE:0,
            },
            class: 'kamibot_topmotor_control',
            isNotFor: ['kamibotPi'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;

                const degree = script.getValue('DEGREE');
                let type = COMMAND_TYPE.TOPMOTOR_MOVE_ABSOLUTE;

                const speed = 9;   // 1 ~ 10
                
                const torque = 3;

                if (!script.is_started) {
                    script.is_started = true;
                    const msgId = Entry.KamibotPi.getHashKey();
                    script.msg_id = msgId;
                    sq.msg_id = script.msg_id;
                    const msg = {
                        id: msgId,
                        type: type,
                        data: {
                            param1:speed,
                            param2:degree,
                            param3:torque,
                        },
                        time: Date.now()
                    };
                    sq.msg = msg;
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    delete pd.msgId;
                    return script.callReturn();
                }
                return script;
            },
        },
        kamibot_topmotor_move_relative: {
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
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'number',
                        params: [90],
                    },
                    null,
                ],
                type: 'kamibot_topmotor_move_relative',
            },
            paramsKeyMap: {
                DEGREE:0,
            },
            class: 'kamibot_topmotor_control',
            isNotFor: ['kamibotPi'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;

                const degree = script.getValue('DEGREE');
                let type = COMMAND_TYPE.TOPMOTOR_MOVE_RELATIVE;

                const speed = 9;   // 1 ~ 10
                const torque = 3;

                if (!script.is_started) {
                    script.is_started = true;
                    const msgId = Entry.KamibotPi.getHashKey();
                    script.msg_id = msgId;
                    sq.msg_id = script.msg_id;
                    const msg = {
                        id: msgId,
                        type: type,
                        data: {
                            param1:speed,
                            param2:degree,
                            param3:torque,
                        },
                        time: Date.now()
                    };
                    sq.msg = msg;
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    delete pd.msgId;
                    return script.callReturn();
                }
                return script;
            },
        },
        kamibot_topmotor_stop: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
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
                ],
                type: 'kamibot_topmotor_stop',
            },
            paramsKeyMap: {
                MOVE_DIR:0,
            },
            class: 'kamibot_topmotor_control',
            isNotFor: ['kamibotPi'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;

                let type = COMMAND_TYPE.TOPMOTOR_STOP;

                if (!script.is_started) {
                    script.is_started = true;
                    const msgId = Entry.KamibotPi.getHashKey();
                    script.msg_id = msgId;
                    sq.msg_id = script.msg_id;
                    const msg = {
                        id: msgId,
                        type: type,
                        data: {
                        },
                        time: Date.now()
                    };
                    sq.msg = msg;
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    delete pd.msgId;
                    return script.callReturn();
                }
                return script;
            },
        },
        // '-------------------------------------------------------------------------------------'
        kamibot_color: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.kamibot_color_red, 'red'],
                        [Lang.Blocks.kamibot_color_pink, 'pink'],
                        [Lang.Blocks.kamibot_color_blue, 'blue'],
                        [Lang.Blocks.kamibot_color_sky, 'sky'],
                        [Lang.Blocks.kamibot_color_green, 'green'],
                        [Lang.Blocks.kamibot_color_yellow, 'yellow'],
                        [Lang.Blocks.kamibot_color_white, 'white'],
                    ],
                    value: 'green',
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
                params: [
                    null,
                ],
                type: 'kamibot_color',
            },
            paramsKeyMap: {
                COLOR: 0,
            },
            class: 'kamibot_sensor',
            isNotFor: ['kamibotPi'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;

                const color = script.getField('COLOR');

                if (!script.is_started) {
                    script.is_started = true;
                    const msgId = Entry.KamibotPi.getHashKey();
                    script.msg_id = msgId;
                    sq.msg_id = script.msg_id;
                    const msg = {
                        id: msgId,
                        type: COMMAND_TYPE.SET_LED_COLOR,
                        data: {
                            param1:color,
                        },
                        time: Date.now()
                    };
                    sq.msg = msg;
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    delete pd.msgId;
                    return script.callReturn();
                }
                return script;
            },
            syntax: undefined,
        },
        kamibot_color_rgb: {
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'number',
                        params: [0],
                    },
                    {
                        type: 'number',
                        params: [250],
                    },
                    {
                        type: 'number',
                        params: [0],
                    },
                    null,
                ],
                type: 'kamibot_color_rgb',
            },
            paramsKeyMap: {
                R_VALUE: 0,
                G_VALUE: 1,
                B_VALUE: 2,
            },
            class: 'kamibot_sensor',
            isNotFor: ['kamibotPi'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;

                let rvalue = parseInt(script.getValue('R_VALUE'));
                let gvalue = parseInt(script.getValue('G_VALUE'));
                let bvalue = parseInt(script.getValue('B_VALUE'));
                
                rvalue = Entry.KamibotPi.clamp(rvalue, 0, 255)
                gvalue = Entry.KamibotPi.clamp(gvalue, 0, 255)
                bvalue = Entry.KamibotPi.clamp(bvalue, 0, 255)

                if (!script.is_started) {
                    script.is_started = true;
                    const msgId = Entry.KamibotPi.getHashKey();
                    script.msg_id = msgId;
                    sq.msg_id = script.msg_id;
                    const msg = {
                        id: msgId,
                        type: COMMAND_TYPE.LED_TURN,
                        data: {
                            param1:rvalue,
                            param2:gvalue,
                            param3:bvalue,
                        },
                        time: Date.now()
                    };
                    sq.msg = msg;
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    delete pd.msgId;
                    return script.callReturn();
                }
                return script;
            },
            syntax: undefined,
        },
        kamibot_draw_shape: {
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
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.kamibot_color_tri, 'tri'],
                        [Lang.Blocks.kamibot_color_rec, 'rect'],
                        [Lang.Blocks.kamibot_color_penta, 'penta'],
                        [Lang.Blocks.kamibot_color_hexa, 'hexa'],
                        [Lang.Blocks.kamibot_color_star, 'star'],
                        [Lang.Blocks.kamibot_color_circle, 'circle'],
                    ],
                    value: 'tri',
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
                params: [
                    {
                        type: 'number',
                        params: [5],
                    },
                    null,
                    null,
                ],
                type: 'kamibot_draw_shape',
            },
            paramsKeyMap: {
                LENGTH: 0,
                SHAPE: 1,
            },
            class: 'kamibot_sensor',
            isNotFor: ['kamibotPi'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;

                let value = parseInt(script.getValue('LENGTH'));
                let shape = script.getField('SHAPE');

                console.log(shape);

                if (shape === 'tri') {
                    shape = 0x01;
                } else if (shape === 'rect') {
                    shape = 0x02;
                } else if (shape === 'penta') {
                    shape = 0x03;
                } else if (shape === 'hexa') {
                    shape = 0x04;
                } else if (shape === 'star') {
                    shape = 0x06;
                } else if (shape == 'circle') {
                    shape = 0x07;
                }
                value = Entry.KamibotPi.clamp(value, 0, 100)
                console.log(value);

                if (!script.is_started) {
                    script.is_started = true;
                    const msgId = Entry.KamibotPi.getHashKey();
                    script.msg_id = msgId;
                    sq.msg_id = script.msg_id;
                    const msg = {
                        id: msgId,
                        type: COMMAND_TYPE.DRAW_SHAPE,
                        data: {
                            param1:shape,
                            param2:value,
                        },
                        time: Date.now()
                    };
                    sq.msg = msg;
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    delete pd.msgId;
                    return script.callReturn();
                }
                return script;
            },
            syntax: undefined,
        },
        kamibot_melody_beep: {
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
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'number',
                        params: [45],
                    },
                    {
                        type: 'number',
                        params: [1],
                    },
                    null,
                ],
                type: 'kamibot_melody_beep',
            },
            paramsKeyMap: {
                FREQUENCY:0,
                DURATION:1,
            },
            class: 'kamibot_sensor',
            isNotFor: ['kamibotPi'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;

                let frequency = parseInt(script.getValue('FREQUENCY'));
                let duration = parseInt(script.getValue('DURATION'));

                if (!script.is_started) {
                    script.is_started = true;
                    const msgId = Entry.KamibotPi.getHashKey();
                    script.msg_id = msgId;
                    sq.msg_id = script.msg_id;
                    const msg = {
                        id: msgId,
                        type: COMMAND_TYPE.MELODY_BEEP,
                        data: {
                            param1:frequency,
                            param2:duration,
                        },
                        time: Date.now()
                    };
                    sq.msg = msg;
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    delete pd.msgId;
                    return script.callReturn();
                }
                return script;
            },
            syntax: undefined,
        },
        // '-------------------------------------------------------------------------------------'
        kamibot_distance_sensor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.kamibot_dir_left, 'left'],
                        [Lang.Blocks.kamibot_dir_right, 'right'],
                    ],
                    value: 'left',
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
                params: [
                    null,
                    null,
                ],
                type: 'kamibot_distance_sensor',
            },
            paramsKeyMap: {
                DIRECTION:0,
            },
            class: 'kamibot_sensor',
            isNotFor: ['kamibotPi'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;
                let retVal = 0;

                const dir = script.getField('DIRECTION');
                if (pd.sensorData) {
                    if (dir == 'left') {
                        retVal = pd.sensorData.leftObject;
                        console.log('left>>>', retVal)
                    } else {
                        retVal = pd.sensorData.rigthObject;
                        console.log('right>>>', retVal)
                    }
                }
                return retVal;
            },
        },
        kamibot_line_sensor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.kamibot_dir_left, 'left'],
                        [Lang.Blocks.kamibot_dir_center, 'center'],
                        [Lang.Blocks.kamibot_dir_right, 'right'],
                    ],
                    value: 'left',
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
                params: [
                    null,
                    null,
                ],
                type: 'kamibot_line_sensor',
            },
            paramsKeyMap: {
                DIRECTION:0,
            },
            class: 'kamibot_sensor',
            isNotFor: ['kamibotPi'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;
                let retVal = 0;

                const dir = script.getField('DIRECTION');
                if (pd.sensorData) {
                    if (dir == 'left') {
                        retVal = pd.sensorData.leftLine;
                    } else if (dir == 'center'){
                        retVal = pd.sensorData.centerLine;
                    } else {
                        retVal = pd.sensorData.rightLine;
                    }
                }
                return retVal;
            },
        },
        kamibot_color_sensor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.kamibot_color_r, 'color_r'],
                        [Lang.Blocks.kamibot_color_g, 'color_g'],
                        [Lang.Blocks.kamibot_color_b, 'color_b'],
                    ],
                    value: 'color_r',
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
                params: [
                    null,
                    null,
                ],
                type: 'kamibot_color_sensor',
            },
            paramsKeyMap: {
                DIRECTION:0,
            },
            class: 'kamibot_sensor',
            isNotFor: ['kamibotPi'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;
                let retVal = 0;

                const dir = script.getField('DIRECTION');
                if (pd.sensorData) {
                    if (dir == 'color_r') {
                        retVal = pd.sensorData.r;
                    } else if (dir == 'color_g'){
                        retVal = pd.sensorData.g;
                    } else {
                        retVal = pd.sensorData.b;
                    }
                }
                return retVal;
            },
        },
        // '--------------------------------------------------------------------------------------'
        kamibot_all_stop: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
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
                ],
                type: 'kamibot_all_stop',
            },
            paramsKeyMap: {
            },
            class: 'kamibot_control_stop',
            isNotFor: ['kamibotPi'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;

                if (!script.is_started) {
                    script.is_started = true;
                    const msgId = Entry.KamibotPi.getHashKey();
                    script.msg_id = msgId;
                    sq.msg_id = script.msg_id;
                    const msg = {
                        id: msgId,
                        type: COMMAND_TYPE.EMERGENCY_STOP,
                        data: {
                        },
                        time: Date.now()
                    };
                    sq.msg = msg;
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    delete pd.msgId;
                    return script.callReturn();
                }
                return script;
            },
        },
        kamibot_initialize: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
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
                ],
                type: 'kamibot_initialize',
            },
            paramsKeyMap: {
            },
            class: 'kamibot_control_stop',
            isNotFor: ['kamibotPi'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;

                if (!script.is_started) {
                    script.is_started = true;
                    const msgId = Entry.KamibotPi.getHashKey();
                    script.msg_id = msgId;
                    sq.msg_id = script.msg_id;
                    const msg = {
                        id: msgId,
                        type: COMMAND_TYPE.RESET_INITIALIZE,
                        data: {
                        },
                        time: Date.now()
                    };
                    sq.msg = msg;
                    return script;
                } 
                
                if ((pd.msg_id) && (pd.msg_id.indexOf(script.msg_id) >= 0)) {
                    delete script.is_started;
                    delete script.msg_id;
                    delete pd.msgId;
                    return script.callReturn();
                }
                return script;
            },
        },
    };
};

module.exports = Entry.KamibotPi;

