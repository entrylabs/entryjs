'use strict';

const COMMAND_TYPE = {
    MOVE_FORWARD: 0x01,
    TURN_LEFT: 0x02,
    TURN_RIGHT: 0x03,
    TURN_BACK: 0x04,
    TOGGLE_LINERRACER: 0x05,
    MOVE_FORWARD_SPEED: 0x06,
    MOVE_LEFT_SPEED: 0x07,
    MOVE_RIGHT_SPEED: 0x08,
    MOVE_BACKWARD_SPEED: 0x09,
    MOVE_FORWARD_LRSPEED: 0x0A,
    MOVE_BACKWARD_LRSPEED: 0x0B,
    STOP_KAMIBOT: 0x0C,
    RESET_KAMIBOT: 0x0D,
    SET_LED_COLOR: 0x0E,
    SET_SERVER_MOTOR: 0x10,
    GET_ULTRASONIC: 0x11,
    GET_IR: 0x12,
    KAMIBOT_CLEAR: 0x17,
    RESET:0xFF
};

Entry.Kamibot = {
    id: '42.1',
    name: 'kamibot',
    url: 'http://www.kamibot.com/',
    imageName: 'kamibot.png',
    title: {
        ko: '카미봇',
        en: 'Kamibot',
    },

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
        Entry.hw.update(); // 해당 데이터를 하드웨어에 전달한다.
    },
};

Entry.Kamibot.setLanguage = function() {
    return {
        ko: {
            template: {
                kamibot_move_forward: "{ 블록 }: 앞으로 %1 칸 가기 %2",
                kamibot_turn_left: "{ 블록 }: 왼쪽으로 돌기 %1",
                kamibot_turn_right: "{ 블록 }: 오른쪽으로 돌기 %1",
                kamibot_turn_back: "{ 블록 }: 뒤로 돌기 %1",
                kamibot_linetracer_speed: "선따라 이동 속도 %1 로 정하기 %2",
                kamibot_linetracer: "선따라 이동하기 %1 %2",
                kamibot_forward_speed: "앞으로 %1 속도로 가기 %2",
                kamibot_left_speed: "왼쪽으로 %1 속도로 돌기 %2",
                kamibot_right_speed: "오른쪽으로 %1 속도로 돌기 %2",
                kamibot_backward_speed: "뒤로 %1 속도로 가기 %2",
                kamibot_forward_lr_speed: "앞으로 속도 왼쪽: %1 오른쪽: %2 %3",
                kamibot_backward_lr_speed: "뒤로 속도 왼쪽: %1 오른쪽: %2 %3",
                kamibot_stop: "멈추기 %1",
                kamibot_color: "LED %1 으로 바꾸기 %2",
                kamibot_servor: "서보모터 %1 도 위치로 설정 %2",
                kamibot_ultrasonic: "초음파센서 %1",
                kamibot_infrared: "적외선 센서 %1 번 %2"
            },
            Blocks: {
                kamibot_toggle_on: '켜기',
                kamibot_toggle_off: '끄기',
                kamibot_color_red: '빨강',
                kamibot_color_pink: '분홍',
                kamibot_color_blue: '파랑',
                kamibot_color_sky: '하늘',
                kamibot_color_green: '초록',
                kamibot_color_yellow: '노랑',
                kamibot_color_white: '하양',
            }
        },
        en: {
            template: {
                kamibot_move_forward: "{block}: move forward %1 block %2",
                kamibot_turn_left: "{block}: turn left %1",
                kamibot_turn_right: "{block}: turn right %1",
                kamibot_turn_back: "{block}: turn back %1",
                kamibot_linetracer_speed: "set linetracer speed %1 %2",
                kamibot_linetracer: "turn linetracer %1 %2",
                kamibot_forward_speed: "move forward speed: %1 %2",
                kamibot_left_speed: "move left speed: %1 %2",
                kamibot_right_speed: "move right speed: %1 %2",
                kamibot_backward_speed: "move backward speed: %1 %2",
                kamibot_forward_lr_speed: "move forward speed Left: %1 Right: %2 %3",
                kamibot_backward_lr_speed: "move backward speed Left: %1 Right: %2 %3",
                kamibot_stop: "stop %1",
                kamibot_color: "set LED color to %1 %2",
                kamibot_servor: "set servor motor to %1 %2",
                kamibot_ultrasonic: "ultrasonic sensor %1",
                kamibot_infrared: "%1 infrared sensor %2"
            },
            Blocks: {
                kamibot_toggle_on: 'on',
                kamibot_toggle_off: 'off',
                kamibot_color_red: 'red',
                kamibot_color_pink: 'pink',
                kamibot_color_blue: 'blue',
                kamibot_color_sky: 'sky',
                kamibot_color_green: 'green',
                kamibot_color_yellow: 'yellow',
                kamibot_color_white: 'white',
            }
        },
    };
};

Entry.Kamibot.blockMenuBlocks = [
    
    'kamibot_move_forward',
    'kamibot_turn_left',
    'kamibot_turn_right',
    'kamibot_turn_back',
    'kamibot_forward_speed',
    'kamibot_left_speed',
    'kamibot_right_speed',
    'kamibot_backward_speed',
    'kamibot_forward_lr_speed',
    'kamibot_backward_lr_speed',
    'kamibot_stop',
    'kamibot_color',
    'kamibot_servor',
    'kamibot_ultrasonic',
    'kamibot_infrared',
];

Entry.Kamibot.getBlocks = function() {
    return {
        kamibot_move_forward: {
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
                type: 'kamibot_move_forward',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'kamibot_mapboard',
            isNotFor: ['kamibot'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;
                const value = parseInt( script.getValue('VALUE'));

                if (!script.is_started) {
                    script.is_started = true;
                    const msgId = Entry.Kamibot.getHashKey();
                    script.msg_id = msgId;
                    sq.msg_id = script.msg_id;
                    const msg = {
                        id: msgId,
                        type: COMMAND_TYPE.MOVE_FORWARD,
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
                type: 'kamibot_turn_left',
            },
            paramsKeyMap: {
            },
            class: 'kamibot_mapboard',
            isNotFor: ['kamibot'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;

                if (!script.is_started) {
                    script.is_started = true;
                    const msgId = Entry.Kamibot.getHashKey();
                    script.msg_id = msgId;
                    sq.msg_id = script.msg_id;
                    const msg = {
                        id: msgId,
                        type: COMMAND_TYPE.TURN_LEFT,
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
        kamibot_turn_right: {
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
                type: 'kamibot_turn_right',
            },
            paramsKeyMap: {
            },
            class: 'kamibot_mapboard',
            isNotFor: ['kamibot'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;


                if (!script.is_started) {
                    script.is_started = true;
                    const msgId = Entry.Kamibot.getHashKey();
                    script.msg_id = msgId;
                    sq.msg_id = script.msg_id;
                    const msg = {
                        id: msgId,
                        type: COMMAND_TYPE.TURN_RIGHT,
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
        kamibot_turn_back: {
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
                type: 'kamibot_turn_back',
            },
            paramsKeyMap: {
            },
            class: 'kamibot_mapboard',
            isNotFor: ['kamibot'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;


                if (!script.is_started) {
                    script.is_started = true;
                    const msgId = Entry.Kamibot.getHashKey();
                    script.msg_id = msgId;
                    sq.msg_id = script.msg_id;
                    const msg = {
                        id: msgId,
                        type: COMMAND_TYPE.TURN_BACK,
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
        kamibot_forward_speed: {
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
                        params: [30],
                    },
                    null,
                ],
                type: 'kamibot_forward_speed',
            },
            paramsKeyMap: {
                SPEED: 0,
            },
            class: 'kamibot_control',
            isNotFor: ['kamibot'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;

                const speed = script.getValue('SPEED');

                if (!script.is_started) {
                    script.is_started = true;
                    const msgId = Entry.Kamibot.getHashKey();
                    script.msg_id = msgId;
                    sq.msg_id = script.msg_id;
                    const msg = {
                        id: msgId,
                        type: COMMAND_TYPE.MOVE_FORWARD_SPEED,
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
                        params: [30],
                    },
                    null,
                ],
                type: 'kamibot_left_speed',
            },
            paramsKeyMap: {
                SPEED: 0,
            },
            class: 'kamibot_control',
            isNotFor: ['kamibot'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;

                const speed = script.getValue('SPEED');

                if (!script.is_started) {
                    script.is_started = true;
                    const msgId = Entry.Kamibot.getHashKey();
                    script.msg_id = msgId;
                    sq.msg_id = script.msg_id;
                    const msg = {
                        id: msgId,
                        type: COMMAND_TYPE.MOVE_LEFT_SPEED,
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
        kamibot_right_speed: {
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
                        params: [30],
                    },
                    null,
                ],
                type: 'kamibot_right_speed',
            },
            paramsKeyMap: {
                SPEED: 0,
            },
            class: 'kamibot_control',
            isNotFor: ['kamibot'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;
                const speed = script.getValue('SPEED');
                if (!script.is_started) {
                    script.is_started = true;
                    const msgId = Entry.Kamibot.getHashKey();
                    script.msg_id = msgId;
                    sq.msg_id = script.msg_id;
                    const msg = {
                        id: msgId,
                        type: COMMAND_TYPE.MOVE_RIGHT_SPEED,
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
        kamibot_backward_speed: {
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
                        params: [30],
                    },
                    null,
                ],
                type: 'kamibot_backward_speed',
            },
            paramsKeyMap: {
                SPEED: 0,
            },
            class: 'kamibot_control',
            isNotFor: ['kamibot'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;

                const speed = script.getValue('SPEED');

                if (!script.is_started) {
                    script.is_started = true;
                    const msgId = Entry.Kamibot.getHashKey();
                    script.msg_id = msgId;
                    sq.msg_id = script.msg_id;
                    const msg = {
                        id: msgId,
                        type: COMMAND_TYPE.MOVE_BACKWARD_SPEED,
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
        // '----------------------------------------------------------------------------'
        kamibot_forward_lr_speed: {
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
                        params: [30],
                    },
                    {
                        type: 'number',
                        params: [30],
                    },
                    null,
                ],
                type: 'kamibot_forward_lr_speed',
            },
            paramsKeyMap: {
                LSPEED: 0,
                RSPEED: 1,
            },
            class: 'kamibot_control',
            isNotFor: ['kamibot'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;

                const lspeed = script.getValue('LSPEED');
                const rspeed = script.getValue('RSPEED');

                if (!script.is_started) {
                    script.is_started = true;
                    const msgId = Entry.Kamibot.getHashKey();
                    script.msg_id = msgId;
                    sq.msg_id = script.msg_id;
                    const msg = {
                        id: msgId,
                        type: COMMAND_TYPE.MOVE_FORWARD_LRSPEED,
                        data: {
                            param1:lspeed,
                            param2:rspeed,
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
        kamibot_backward_lr_speed: {
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
                        params: [30],
                    },
                    {
                        type: 'number',
                        params: [30],
                    },
                    null,
                ],
                type: 'kamibot_backward_lr_speed',
            },
            paramsKeyMap: {
                LSPEED:0,
                RSPEED:1,
            },
            class: 'kamibot_control',
            isNotFor: ['kamibot'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;

                const lspeed = script.getValue('LSPEED');
                const rspeed = script.getValue('RSPEED');

                if (!script.is_started) {
                    script.is_started = true;
                    const msgId = Entry.Kamibot.getHashKey();
                    script.msg_id = msgId;
                    sq.msg_id = script.msg_id;
                    const msg = {
                        id: msgId,
                        type: COMMAND_TYPE.MOVE_BACKWARD_LRSPEED,
                        data: {
                            param1:lspeed,
                            param2:rspeed,
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
            isNotFor: ['kamibot'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;

                if (!script.is_started) {
                    script.is_started = true;
                    const msgId = Entry.Kamibot.getHashKey();
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
            isNotFor: ['kamibot'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;

                const color = script.getField('COLOR');

                if (!script.is_started) {
                    script.is_started = true;
                    const msgId = Entry.Kamibot.getHashKey();
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
        kamibot_servor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['0', '0'],
                        ['15', '15'],
                        ['30', '30'],
                        ['45', '45'],
                        ['60', '60'],
                        ['75', '75'],
                        ['90', '90'],
                        ['105', '105'],
                        ['120', '120'],
                        ['135', '135'],
                        ['150', '150'],
                        ['165', '165'],
                        ['180', '180'],
                    ],
                    value: '90',
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
                type: 'kamibot_servor',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'kamibot_sensor',
            isNotFor: ['kamibot'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;

                const angle = parseInt(script.getField('VALUE'), 10);

                if (!script.is_started) {
                    script.is_started = true;
                    const msgId = Entry.Kamibot.getHashKey();
                    script.msg_id = msgId;
                    sq.msg_id = script.msg_id;
                    const msg = {
                        id: msgId,
                        type: COMMAND_TYPE.SET_SERVER_MOTOR,
                        data: {
                            param1:angle,
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
        kamibot_ultrasonic: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
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
                type: 'kamibot_ultrasonic',
            },
            paramsKeyMap: {
            },
            class: 'kamibot_sensor',
            isNotFor: ['kamibot'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;
                let retVal = 0;
                if (pd.sensorData) {
                    retVal = pd.sensorData.ultra;
                }
                return retVal;
            },
        },
        kamibot_infrared: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', '1'],
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['5', '5'],
                    ],
                    value: '1',
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
                type: 'kamibot_infrared',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'kamibot_sensor',
            isNotFor: ['kamibot'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;
                const no = parseInt(script.getField('VALUE'), 10);
                
                let retVal = 0;
                if (pd.sensorData) {
                    if (no === 1) {
                        retVal = pd.sensorData.lir1;
                    } else if (no === 2) {
                        retVal = pd.sensorData.lir2;
                    } else if (no === 3) {
                        retVal = pd.sensorData.cir;
                    } else if (no === 4) {
                        retVal = pd.sensorData.rir1;
                    } else if (no === 5) {
                        retVal = pd.sensorData.rir2;
                    }
                }
                return retVal.toString(10);
            },
        },
    };
};

module.exports = Entry.Kamibot;
