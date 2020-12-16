'use strict';


const COMMAND_TYPE = {
    MOVE_FORWARD: 0x01,
    MOVE_BACKWARD: 0x02,
    TURN_LEFT: 0x03,
    TURN_RIGHT: 0x04,
    TURN_LEFT_RIGHT: 0x05,
    ONOFF_REAR_LED: 0x06,
    SET_LED_COLOR: 0x07,
    PLAY_SOUND: 0x08,
    GET_FORWARD_SENSOR: 0x09,
    GET_BOTTOM_SENSOR: 0x0A,
    GET_LIGHT_SENSOR: 0x0B,
};

Entry.Jjoggo = {
    id: '45.1',
    name: 'Jjoggo',
    url: "http://jjomulrak.com",
    imageName: 'jjoggo.png',
    title: {
        ko: '쪼꼬',
        en: 'JjoGgo',
    },

    getHashKey: function () {
        let key = new Date().getSeconds().toString(16);
        if (key.length === 1) {
            key += ((Math.random() * 16) | 0).toString(16);
        }
        return Entry.generateHash() + key;
    },

    setZero: function () {
        Entry.hw.update(); // 해당 데이터를 하드웨어에 전달한다.
    },
};

Entry.Jjoggo.setLanguage = function () {
    return {
        ko: {
            template: {
                jjoggo_move_forward: "앞으로 %1 %2 이동 %3",
                jjoggo_move_backward: "뒤로 %1 %2 이동 %3",
                jjoggo_turn_left: "왼쪽으로 %1 %2 돌기 %3",
                jjoggo_turn_right: "오른쪽으로 %1 %2 돌기 %3",
                jjoggo_move_left_right: "오른쪽으로 %1 %2,왼쪽 %3 %4 이동 %5",
                jjoggo_onoff_led_rear: "뒤쪽 LED %1 %2",
                jjoggo_set_led_color: "%1 LED %2 %3",
                jjoggo_play_sound: "%1 소리내기 %2",
                jjoggo_is_front_sensor : "전방센서",
                jjoggo_is_bottom_sensor : "바닥센서",
                jjoggo_is_light_sensor : "빛센서",
                jjoggo_get_front_sensor : "전방센서",
                jjoggo_get_bottom_sensor : "바닥센서",
                jjoggo_get_light_sensor : "빛센서",
            },
            Blocks: {
                jjoggo_move_step: '칸',
                jjoggo_move_cm: 'cm',
                jjoggo_trun_drgree: '도',
                jjoggo_trun_round: '바퀴',
                jjoggo_toggle_on: '켜기',
                jjoggo_toggle_off: '끄기',
                jjoggo_direction_right: '오른쪽',
                jjoggo_direction_left: '왼쪽',
                jjoggo_direction_dual: '양쪽(오른쪽,왼쪽)',
                
                jjoggo_color_off: '끄기',
                jjoggo_color_blue: '파란색',
                jjoggo_color_red: '빨간색',
                jjoggo_color_green: '초록색',
                jjoggo_color_yellow: '노랑색',
                jjoggo_color_pink: '분홍색',
                jjoggo_color_bluegreen: '청록색',
                jjoggo_color_white: '흰색',
                
                jjoggo_sound_car: '자동차',
                jjoggo_sound_robot: '로봇',
                jjoggo_sound_dog: '강아지',
                jjoggo_sound_cat: '고양이',
                jjoggo_sound_chicken: '닭',
                jjoggo_sound_tiger: '호랑이',
                jjoggo_sound_lion: '사자',
                jjoggo_sound_fart: '방귀소리',
                jjoggo_sound_helicopter: '헬리콥터',
                jjoggo_sound_train: '기차',
                jjoggo_sound_frog: '개구리',
                jjoggo_sound_jjajan: '짜잔(효과음)',
                jjoggo_sound_sheep: '양',
                jjoggo_sound_elephant: '코끼리',
                jjoggo_sound_camel: '낙타',
                jjoggo_sound_dolphin: '고래',
                jjoggo_sound_ttiyong: '띠용(효과음)',
                jjoggo_sound_hello_parrot: '헬로(앵무새)',
                jjoggo_sound_hello_manga: '헬로(만화)',
                jjoggo_sound_ppong: '뽕(효과음)',
                jjoggo_sound_buzzer: '부저(효과음)',
                jjoggo_sound_ttalilalan: '따라리라란~(효과음)',
                jjoggo_sound_ttattattatta: '따따따따~(효과음)',
                jjoggo_sound_laughter: '웃음소리',
                jjoggo_sound_magic: '마술(효과음)',
                jjoggo_sound_woodpecker: '딱다구리',
                jjoggo_sound_bird: '새',
                jjoggo_sound_hiccup: '딱국질',
                jjoggo_sound_doridori: '도리도리',
                jjoggo_sound_firetruck: '소방차',
                jjoggo_sound_police_car: '경찰차',
                jjoggo_sound_applause: '박수환호',
                jjoggo_sound_kiss: '뽀뽀',
                jjoggo_sound_missile: '미사일',
                jjoggo_sound_angry_duck: '화난오리',
                jjoggo_sound_fly: '파리',
                jjoggo_sound_ufo: 'UFO',
                jjoggo_sound_fanfare: '팡파레',
                jjoggo_sound_sigh: '한숨소리',
                jjoggo_sound_alright: '올라잇~',
                jjoggo_sound_genius: '지니어스~',
                jjoggo_sound_no: '노우~',
                jjoggo_sound_wow: '오우~',
                jjoggo_sound_yahoo: '야호~',
                
            }
        },
        en: {
            template: {
                jjoggo_move_forward: "move forward %1 %2 block %3",
                jjoggo_move_backward: "move backward %1 %2 block %3",
                jjoggo_turn_left: "%1 %2 to the left %3",
                jjoggo_turn_right: "%1 %2 to the right %3",
                jjoggo_move_left_right: "move right %1 %2,left %3 %4 %5",
                jjoggo_onoff_led_rear: "Rear LED %1 %2",
                jjoggo_set_led_color: "%1 LED %2 %3",
                jjoggo_play_sound: "play %1 %2",
                jjoggo_is_front_sensor : "front sensor",
                jjoggo_is_bottom_sensor : "bottom sensor",
                jjoggo_is_light_sensor : "light sensor",
                jjoggo_get_front_sensor : "front sensor",
                jjoggo_get_bottom_sensor : "bottom sensor",
                jjoggo_get_light_sensor : "light sensor",
            },
            Blocks: {
                jjoggo_move_step: 'step',
                jjoggo_move_cm: 'cm',
                jjoggo_trun_drgree: 'degree',
                jjoggo_trun_round: 'turns',
                jjoggo_toggle_on: 'on',
                jjoggo_toggle_off: 'off',
                jjoggo_direction_right: 'right',
                jjoggo_direction_left: 'left',
                jjoggo_direction_dual: 'all(right,left)',
                
                jjoggo_color_off: 'off',
                jjoggo_color_blue: 'blue',
                jjoggo_color_red: 'red',
                jjoggo_color_green: 'green',
                jjoggo_color_yellow: 'yellow',
                jjoggo_color_pink: 'pink',
                jjoggo_color_bluegreen: 'bluegreen',
                jjoggo_color_white: 'white',
                
                jjoggo_sound_car: 'car',
                jjoggo_sound_robot: 'robot',
                jjoggo_sound_dog: 'dog',
                jjoggo_sound_cat: 'cat',
                jjoggo_sound_chicken: 'chicken',
                jjoggo_sound_tiger: 'tiger',
                jjoggo_sound_lion: 'lion',
                jjoggo_sound_fart: 'fart',
                jjoggo_sound_helicopter: 'helicopter',
                jjoggo_sound_train: 'train',
                jjoggo_sound_frog: 'frog',
                jjoggo_sound_jjajan: 'jjajan(effect)',
                jjoggo_sound_sheep: 'sheep',
                jjoggo_sound_elephant: 'elephant',
                jjoggo_sound_camel: 'camel',
                jjoggo_sound_dolphin: 'dolphin',
                jjoggo_sound_ttiyong: 'ttiyong(effect)',
                jjoggo_sound_hello_parrot: 'hello(parrot)',
                jjoggo_sound_hello_manga: 'hello(manga)',
                jjoggo_sound_ppong: 'ppong(effect)',
                jjoggo_sound_buzzer: 'buzzer(effect)',
                jjoggo_sound_ttalilalan: 'ttalilalan(effect)',
                jjoggo_sound_ttattattatta: 'ttattattatta(effect)',
                jjoggo_sound_laughter: 'laughter',
                jjoggo_sound_magic: 'magic(effect)',
                jjoggo_sound_woodpecker: 'woodpecker',
                jjoggo_sound_bird: 'bird',
                jjoggo_sound_hiccup: 'hiccup',
                jjoggo_sound_doridori: 'doridori',
                jjoggo_sound_firetruck: 'fire truck',
                jjoggo_sound_police_car: 'police car',
                jjoggo_sound_applause: 'applause',
                jjoggo_sound_kiss: 'kiss',
                jjoggo_sound_missile: 'missile',
                jjoggo_sound_angry_duck: 'angry duck',
                jjoggo_sound_fly: 'fly',
                jjoggo_sound_ufo: 'UFO',
                jjoggo_sound_fanfare: 'fanfare',
                jjoggo_sound_sigh: 'sigh',
                jjoggo_sound_alright: 'alright',
                jjoggo_sound_genius: 'genius',
                jjoggo_sound_no: 'no',
                jjoggo_sound_wow: 'wow',
                jjoggo_sound_yahoo: 'yahoo',
            }
        },
    };
};

Entry.Jjoggo.blockMenuBlocks = [
    //jjoggo
    'jjoggo_move_forward',
    'jjoggo_move_backward',
    'jjoggo_turn_left',
    'jjoggo_turn_right',
    'jjoggo_move_left_right',
    'jjoggo_onoff_led_rear',
    'jjoggo_set_led_color',
    'jjoggo_play_sound',

    'jjoggo_is_front_sensor',
    'jjoggo_is_bottom_sensor',
    'jjoggo_is_light_sensor',
    'jjoggo_get_front_sensor',
    'jjoggo_get_bottom_sensor',
    'jjoggo_get_light_sensor',
];

Entry.Jjoggo.getBlocks = function () {
    return {
        jjoggo_move_forward: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [{
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.jjoggo_move_step, '칸'],
                        [Lang.Blocks.jjoggo_move_cm, 'cm'],
                    ],
                    value: '칸',
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
                params: [1, '칸', null],
                type: 'jjoggo_move_forward',
            },
            paramsKeyMap: {
                MOVE_CNT: 0,
                MOVE_UNIT: 1,
            },
            class: 'jjoggo_command',
            //isNotFor: ['jjoggo'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;
                const move_cnt = parseInt(script.getValue('MOVE_CNT'));
                let move_unit = script.getValue('MOVE_UNIT');
                if (move_unit === '칸') move_unit = 'step';

                if (!script.is_started) {
                    script.is_started = true;
                    const msgId = Entry.Jjoggo.getHashKey();
                    script.msg_id = msgId;
                    sq.msg_id = script.msg_id;
                    const msg = {
                        id: msgId,
                        type: COMMAND_TYPE.MOVE_FORWARD,
                        data: {
                            param1: move_cnt,
                            param2: move_unit,
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
        jjoggo_move_backward: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [{
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.jjoggo_move_step, '칸'],
                        [Lang.Blocks.jjoggo_move_cm, 'cm'],
                    ],
                    value: '칸',
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
                params: [1, '칸', null],
                type: 'jjoggo_move_backward',
            },
            paramsKeyMap: {
                MOVE_CNT: 0,
                MOVE_UNIT: 1,
            },
            class: 'jjoggo_command',
            //isNotFor: ['jjoggo'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;
                const move_cnt = parseInt(script.getValue('MOVE_CNT'));
                let move_unit = script.getValue('MOVE_UNIT');
                if (move_unit === '칸') move_unit = 'step';

                if (!script.is_started) {
                    script.is_started = true;
                    const msgId = Entry.Jjoggo.getHashKey();
                    script.msg_id = msgId;
                    sq.msg_id = script.msg_id;
                    const msg = {
                        id: msgId,
                        type: COMMAND_TYPE.MOVE_BACKWARD,
                        data: {
                            param1: move_cnt,
                            param2: move_unit,
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
        jjoggo_turn_left: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [{
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.jjoggo_trun_drgree, '도'],
                        [Lang.Blocks.jjoggo_trun_round, '바퀴'],
                    ],
                    value: '도',
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
                params: [90, '도', null],
                type: 'jjoggo_turn_left',
            },
            paramsKeyMap: {
                TURN_CNT: 0,
                TURN_UNIT: 1,
            },
            class: 'jjoggo_command',
            //isNotFor: ['jjoggo'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;
                const turn_cnt = parseInt(script.getValue('TURN_CNT'));
                let turn_unit = script.getValue('TURN_UNIT');
                if (turn_unit === '도') turn_unit = 'degree';
                else if (turn_unit === '바퀴') turn_unit = 'turns';
                if (turn_unit === 'degree') {
                    if (turn_cnt < 0) turn_cnt = 0;
                    else if (turn_cnt > 180) turn_cnt = 180;
                }

                if (!script.is_started) {
                    script.is_started = true;
                    const msgId = Entry.Jjoggo.getHashKey();
                    script.msg_id = msgId;
                    sq.msg_id = script.msg_id;
                    const msg = {
                        id: msgId,
                        type: COMMAND_TYPE.TURN_LEFT,
                        data: {
                            param1: turn_cnt,
                            param2: turn_unit,
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
        jjoggo_turn_right: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [{
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.jjoggo_trun_drgree, '도'],
                        [Lang.Blocks.jjoggo_trun_round, '바퀴'],
                    ],
                    value: '도',
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
                params: [90, '도', null],
                type: 'jjoggo_turn_right',
            },
            paramsKeyMap: {
                TURN_CNT: 0,
                TURN_UNIT: 1,
            },
            class: 'jjoggo_command',
            //isNotFor: ['jjoggo'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;
                const turn_cnt = parseInt(script.getValue('TURN_CNT'));
                if (turn_unit === '도') turn_unit = 'degree';
                else if (turn_unit === '바퀴') turn_unit = 'turns';
                if (turn_unit === 'degree') {
                    if (turn_cnt < 0) turn_cnt = 0;
                    else if (turn_cnt > 180) turn_cnt = 180;
                }

                if (!script.is_started) {
                    script.is_started = true;
                    const msgId = Entry.Jjoggo.getHashKey();
                    script.msg_id = msgId;
                    sq.msg_id = script.msg_id;
                    const msg = {
                        id: msgId,
                        type: COMMAND_TYPE.TURN_RIGHT,
                        data: {
                            param1: turn_cnt,
                            param2: turn_unit,
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
        jjoggo_move_left_right: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [{
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.jjoggo_move_step, '칸'],
                        [Lang.Blocks.jjoggo_move_cm, 'cm'],
                    ],
                    value: '칸',
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
                        [Lang.Blocks.jjoggo_move_step, '칸'],
                        [Lang.Blocks.jjoggo_move_cm, 'cm'],
                    ],
                    value: '칸',
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
                params: [1, '칸', 1, '칸', null],
                type: 'jjoggo_move_left_right',
            },
            paramsKeyMap: {
                MOVE_RIGHT_CNT: 0,
                MOVE_RIGHT_UNIT: 1,
                MOVE_LEFT_CNT: 2,
                MOVE_LEFT_UNIT: 3,
            },
            class: 'jjoggo_command',
            //isNotFor: ['jjoggo'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;
                const turn_right_cnt = parseInt(script.getValue('MOVE_RIGHT_CNT'));
                const turn_left_cnt = parseInt(script.getValue('MOVE_LEFT_CNT'));
                let move_right_unit = script.getValue('MOVE_RIGHT_UNIT');
                let move_left_unit = script.getValue('MOVE_LEFT_UNIT');

                if (move_right_unit === '칸') move_right_unit = 'step';
                if (move_left_unit === '칸') move_left_unit = 'step';

                if (!script.is_started) {
                    script.is_started = true;
                    const msgId = Entry.Jjoggo.getHashKey();
                    script.msg_id = msgId;
                    sq.msg_id = script.msg_id;
                    const msg = {
                        id: msgId,
                        type: COMMAND_TYPE.TURN_LEFT_RIGHT,
                        data: {
                            param1: turn_right_cnt,
                            param2: move_right_unit,
                            param3: turn_left_cnt,
                            param4: move_left_unit,
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
        jjoggo_onoff_led_rear: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [{
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.jjoggo_toggle_on, '켜기'],
                        [Lang.Blocks.jjoggo_toggle_off, '끄기'],
                    ],
                    value: '켜기',
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
                params: ['켜기', null],
                type: 'jjoggo_onoff_led_rear',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'jjoggo_command',
            //isNotFor: ['jjoggo'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;
                const led_onoff = script.getValue('VALUE');

                if (!script.is_started) {
                    script.is_started = true;
                    const msgId = Entry.Jjoggo.getHashKey();
                    script.msg_id = msgId;
                    sq.msg_id = script.msg_id;
                    const msg = {
                        id: msgId,
                        type: COMMAND_TYPE.ONOFF_REAR_LED,
                        data: {
                            param1: led_onoff,
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
        jjoggo_set_led_color: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [{
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.jjoggo_direction_right, '오른쪽'],
                        [Lang.Blocks.jjoggo_direction_left, '왼쪽'],
                        [Lang.Blocks.jjoggo_direction_dual, '왼쪽'],
                    ],
                    value: '오른쪽',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.jjoggo_color_off, '끄기'],
                        [Lang.Blocks.jjoggo_color_blue, '파란색'],
                        [Lang.Blocks.jjoggo_color_red, '빨간색'],
                        [Lang.Blocks.jjoggo_color_green, '초록색'],
                        [Lang.Blocks.jjoggo_color_yellow, '노랑색'],
                        [Lang.Blocks.jjoggo_color_pink, '분홍색'],
                        [Lang.Blocks.jjoggo_color_bluegreen, '청록색'],
                        [Lang.Blocks.jjoggo_color_white, '흰색'],
                    ],
                    value: '파란색',
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
                params: ['오른쪽', '파란색', null],
                type: 'jjoggo_set_led_color',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                COLOR:1,
            },
            class: 'jjoggo_command',
            //isNotFor: ['jjoggo'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;
                const led_dir = script.getValue('DIRECTION');
                const led_color = script.getValue('COLOR');

                if (!script.is_started) {
                    script.is_started = true;
                    const msgId = Entry.Jjoggo.getHashKey();
                    script.msg_id = msgId;
                    sq.msg_id = script.msg_id;
                    const msg = {
                        id: msgId,
                        type: COMMAND_TYPE.SET_LED_COLOR,
                        data: {
                            param1: led_dir,
                            param2: led_color,
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
        jjoggo_play_sound: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [{
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.jjoggo_sound_car, '자동차'],
                        [Lang.Blocks.jjoggo_sound_robot, '로봇'],
                        [Lang.Blocks.jjoggo_sound_dog, '강아지'],
                        [Lang.Blocks.jjoggo_sound_cat, '고양이'],
                        [Lang.Blocks.jjoggo_sound_chicken, '닭'],
                        [Lang.Blocks.jjoggo_sound_tiger, '호랑이'],
                        [Lang.Blocks.jjoggo_sound_lion, '사자'],
                        [Lang.Blocks.jjoggo_sound_fart, '방귀소리'],
                        [Lang.Blocks.jjoggo_sound_helicopter, '헬리콥터'],
                        [Lang.Blocks.jjoggo_sound_train, '기차'],
                        [Lang.Blocks.jjoggo_sound_frog, '개구리'],
                        [Lang.Blocks.jjoggo_sound_jjajan, '짜잔(효과음)'],
                        [Lang.Blocks.jjoggo_sound_sheep, '양'],
                        [Lang.Blocks.jjoggo_sound_elephant, '코끼리'],
                        [Lang.Blocks.jjoggo_sound_camel, '낙타'],
                        [Lang.Blocks.jjoggo_sound_dolphin, '고래'],
                        [Lang.Blocks.jjoggo_sound_ttiyong, '띠용(효과음)'],
                        [Lang.Blocks.jjoggo_sound_hello_parrot, '헬로(앵무새)'],
                        [Lang.Blocks.jjoggo_sound_hello_manga, '헬로(만화)'],
                        [Lang.Blocks.jjoggo_sound_ppong, '뽕(효과음)'],
                        [Lang.Blocks.jjoggo_sound_buzzer, '부저(효과음)'],
                        [Lang.Blocks.jjoggo_sound_ttalilalan, '따라리라란~(효과음)'],
                        [Lang.Blocks.jjoggo_sound_ttattattatta, '따따따따~(효과음)'],
                        [Lang.Blocks.jjoggo_sound_laughter, '웃음소리'],
                        [Lang.Blocks.jjoggo_sound_magic, '마술(효과음)'],
                        [Lang.Blocks.jjoggo_sound_woodpecker, '딱다구리'],
                        [Lang.Blocks.jjoggo_sound_bird, '새'],
                        [Lang.Blocks.jjoggo_sound_hiccup, '딱국질'],
                        [Lang.Blocks.jjoggo_sound_doridori, '도리도리'],
                        [Lang.Blocks.jjoggo_sound_firetruck, '소방차'],
                        [Lang.Blocks.jjoggo_sound_police_car, '경찰차'],
                        [Lang.Blocks.jjoggo_sound_applause, '박수환호'],
                        [Lang.Blocks.jjoggo_sound_kiss, '뽀뽀'],
                        [Lang.Blocks.jjoggo_sound_missile, '미사일'],
                        [Lang.Blocks.jjoggo_sound_angry_duck, '화난오리'],
                        [Lang.Blocks.jjoggo_sound_fly, '파리'],
                        [Lang.Blocks.jjoggo_sound_ufo, 'UFO'],
                        [Lang.Blocks.jjoggo_sound_fanfare, '팡파레'],
                        [Lang.Blocks.jjoggo_sound_sigh, '한숨소리'],
                        [Lang.Blocks.jjoggo_sound_alright, '올라잇~'],
                        [Lang.Blocks.jjoggo_sound_genius, '지니어스~'],
                        [Lang.Blocks.jjoggo_sound_no, '노우~'],
                        [Lang.Blocks.jjoggo_sound_wow, '오우~'],
                        [Lang.Blocks.jjoggo_sound_yahoo, '야호~'],
                    ],
                    value: '자동차',
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
                params: ['자동차', null],
                type: 'jjoggo_play_sound',
            },
            paramsKeyMap: {
                SOUND: 0,
            },
            class: 'jjoggo_command',
            //isNotFor: ['jjoggo'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;
                const sound = script.getValue('SOUND');

                if (!script.is_started) {
                    script.is_started = true;
                    const msgId = Entry.Jjoggo.getHashKey();
                    script.msg_id = msgId;
                    sq.msg_id = script.msg_id;
                    const msg = {
                        id: msgId,
                        type: COMMAND_TYPE.PLAY_SOUND,
                        data: {
                            param1: sound,
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
        jjoggo_is_front_sensor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [{
                    type: "Text",
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'jjoggo_is_front_sensor',
            },
            paramsKeyMap: {
            },
            class: 'jjoggo_command',
            //isNotFor: ['jjoggo'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;
                let retVal = 0;
                if (pd.sensorData) {
                    retVal = pd.sensorData.is_front_sensor;
                }
                return retVal;
            },
        },        
        jjoggo_is_bottom_sensor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [{
                    type: "Text",
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'jjoggo_is_bottom_sensor',
            },
            paramsKeyMap: {
            },
            class: 'jjoggo_command',
            //isNotFor: ['jjoggo'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;
                let retVal = 0;
                if (pd.sensorData) {
                    retVal = pd.sensorData.is_bottom_sensor;
                }
                return retVal;
            },
        },
        jjoggo_is_light_sensor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [{
                    type: "Text",
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'jjoggo_is_light_sensor',
            },
            paramsKeyMap: {
            },
            class: 'jjoggo_command',
            //isNotFor: ['jjoggo'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;
                let retVal = 0;
                if (pd.sensorData) {
                    retVal = pd.sensorData.is_light_sensor;
                }
                return retVal;
            },
        },

        jjoggo_get_front_sensor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [{
                    type: "Text",
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'jjoggo_get_front_sensor',
            },
            paramsKeyMap: {
            },
            class: 'jjoggo_command',
            //isNotFor: ['jjoggo'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;
                let retVal = 0;
                if (pd.sensorData) {
                    retVal = pd.sensorData.front_sensor;
                }
                return retVal;
            },
        },
        jjoggo_get_bottom_sensor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [{
                    type: "Text",
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'jjoggo_get_bottom_sensor',
            },
            paramsKeyMap: {
            },
            class: 'jjoggo_command',
            //isNotFor: ['jjoggo'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;
                let retVal = 0;
                if (pd.sensorData) {
                    retVal = pd.sensorData.bottom_sensor;
                }
                return retVal;
            },
        },
        jjoggo_get_light_sensor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [{
                    type: "Text",
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'jjoggo_get_light_sensor',
            },
            paramsKeyMap: {
            },
            class: 'jjoggo_command',
            //isNotFor: ['jjoggo'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;
                let retVal = 0;
                if (pd.sensorData) {
                    retVal = pd.sensorData.light_sensor;
                }
                return retVal;
            },
        },
    };
};

module.exports = Entry.Jjoggo;