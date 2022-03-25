'use strict';

Entry.Choco = {
    id: '45.1',
    name: 'choco',
    url: 'http://jjomulrak.com',
    imageName: 'choco.png',
    title: {
        ko: '쪼코',
        en: 'Choco',
    },

    getHashKey: function() {
        let key = new Date().getSeconds().toString(16);
        if (key.length === 1) {
            key += ((Math.random() * 16) | 0).toString(16);
        }
        return Entry.generateHash() + key;
    },

    setZero: function() {
        Entry.hw.update(); // 해당 데이터를 하드웨어에 전달한다.
    },
};

Entry.Choco.setLanguage = function() {
    return {
        ko: {
            template: {
                choco_move_forward: '앞으로 %1 %2 이동 %3',
                choco_move_backward: '뒤로 %1 %2 이동 %3',
                choco_turn_left: '왼쪽으로 %1 %2 돌기 %3',
                choco_turn_right: '오른쪽으로 %1 %2 돌기 %3',
                choco_move_right_left: '오른쪽으로 %1 왼쪽으로 %2 %3 이동 %4',
                choco_onoff_led_rear: '뒤쪽 LED %1 %2',
                choco_set_led_color: '%1 LED %2 %3',
                choco_play_sound: '%1 소리내기 %2',
                choco_is_front_sensor: '전방센서',
                choco_is_bottom_sensor: '바닥센서',
                choco_is_light_sensor: '빛센서',
                choco_get_front_sensor: '전방센서',
                choco_get_bottom_sensor: '바닥센서',
                choco_get_light_sensor: '빛센서',
            },
            Blocks: {
                choco_move_step: '칸',
                choco_move_cm: 'cm',
                choco_trun_drgree: '도',
                choco_trun_round: '바퀴',
                choco_toggle_on: '켜기',
                choco_toggle_off: '끄기',
                choco_direction_right: '오른쪽',
                choco_direction_left: '왼쪽',
                choco_direction_dual: '양쪽(오른쪽,왼쪽)',

                choco_color_off: '끄기',
                choco_color_blue: '파란색',
                choco_color_red: '빨간색',
                choco_color_green: '초록색',
                choco_color_yellow: '노랑색',
                choco_color_pink: '분홍색',
                choco_color_bluegreen: '청록색',
                choco_color_white: '흰색',

                choco_sound_car: '자동차',
                choco_sound_robot: '로봇',
                choco_sound_dog: '강아지',
                choco_sound_cat: '고양이',
                choco_sound_chicken: '닭',
                choco_sound_tiger: '호랑이',
                choco_sound_lion: '사자',
                choco_sound_fart: '방귀소리',
                choco_sound_helicopter: '헬리콥터',
                choco_sound_train: '기차',
                choco_sound_frog: '개구리',
                choco_sound_jjajan: '짜잔(효과음)',
                choco_sound_sheep: '양',
                choco_sound_elephant: '코끼리',
                choco_sound_camel: '낙타',
                choco_sound_dolphin: '고래',
                choco_sound_ttiyong: '띠용(효과음)',
                choco_sound_hello_parrot: '헬로(앵무새)',
                choco_sound_hello_manga: '헬로(만화)',
                choco_sound_hello_man: '헬로(남자)',
                choco_sound_ppong: '뽕(효과음)',
                choco_sound_buzzer: '부저(효과음)',
                choco_sound_ttalilalan: '따라리라란~(효과음)',
                choco_sound_ttattattatta: '따따따따~(효과음)',
                choco_sound_laughter: '웃음소리',
                choco_sound_magic: '마술(효과음)',
                choco_sound_woodpecker: '딱따구리',
                choco_sound_bird: '새',
                choco_sound_burp: '트림',
                choco_sound_hiccup: '딸꾹질',
                choco_sound_doridori: '도리도리',
                choco_sound_firetruck: '소방차',
                choco_sound_police_car: '경찰차',
                choco_sound_applause: '박수환호',
                choco_sound_kiss: '뽀뽀',
                choco_sound_missile: '미사일',
                choco_sound_angry_duck: '화난오리',
                choco_sound_fly: '파리',
                choco_sound_ufo: 'UFO',
                choco_sound_fanfare: '팡파레',
                choco_sound_sigh: '한숨소리',
                choco_sound_alright: '올라잇~',
                choco_sound_genius: '지니어스~',
                choco_sound_no: '노우~',
                choco_sound_wow: '오우~',
                choco_sound_yahoo: '야호~',

                choco_sound_low_do: '낮은 도',
                choco_sound_low_dosharp: '낮은 도#',
                choco_sound_low_re: '낮은 레',
                choco_sound_low_resharp: '낮은 레#',
                choco_sound_low_mi: '낮은 미',
                choco_sound_low_fa: '낮은 파',
                choco_sound_low_fasharp: '낮은 파#',
                choco_sound_low_sol: '낮은 솔',
                choco_sound_low_solsharp: '낮은 솔#',
                choco_sound_low_ra: '낮은 라',
                choco_sound_low_rasharp: '낮은 라#',
                choco_sound_low_si: '낮은 시',
                choco_sound_do: '도',
                choco_sound_dosharp: '도#',
                choco_sound_re: '레',
                choco_sound_resharp: '레#',
                choco_sound_mi: '미',
                choco_sound_fasharp: '파',
                choco_sound_fa: '파#',
                choco_sound_sol: '솔',
                choco_sound_solsharp: '솔#',
                choco_sound_ra: '라',
                choco_sound_rasharp: '라#',
                choco_sound_si: '시',
                choco_sound_high_do: '높은 도',
                choco_sound_high_dosharp: '높은 도#',
                choco_sound_high_re: '높은 레',
                choco_sound_high_resharp: '높은 레#',
                choco_sound_high_mi: '높은 미',
                choco_sound_high_fa: '높은 파',
                choco_sound_high_fasharp: '높은 파#',
                choco_sound_high_sol: '높은 솔',
                choco_sound_high_solsharp: '높은 솔#',
                choco_sound_high_ra: '높은 라',
                choco_sound_high_rasharp: '높은 라#',
                choco_sound_high_si: '높은 시',
            },
        },
        en: {
            template: {
                choco_move_forward: 'move forward %1 %2 block %3',
                choco_move_backward: 'move backward %1 %2 block %3',
                choco_turn_left: '%1 %2 to the left %3',
                choco_turn_right: '%1 %2 to the right %3',
                choco_move_right_left: 'move right %1 left %2 %3 %4',
                choco_onoff_led_rear: 'Rear LED %1 %2',
                choco_set_led_color: '%1 LED %2 %3',
                choco_play_sound: 'play %1 %2',
                choco_is_front_sensor: 'front sensor',
                choco_is_bottom_sensor: 'bottom sensor',
                choco_is_light_sensor: 'light sensor',
                choco_get_front_sensor: 'front sensor',
                choco_get_bottom_sensor: 'bottom sensor',
                choco_get_light_sensor: 'light sensor',
            },
            Blocks: {
                choco_move_step: 'step',
                choco_move_cm: 'cm',
                choco_trun_drgree: 'degree',
                choco_trun_round: 'turns',
                choco_toggle_on: 'on',
                choco_toggle_off: 'off',
                choco_direction_right: 'right',
                choco_direction_left: 'left',
                choco_direction_dual: 'all(right,left)',

                choco_color_off: 'off',
                choco_color_blue: 'blue',
                choco_color_red: 'red',
                choco_color_green: 'green',
                choco_color_yellow: 'yellow',
                choco_color_pink: 'pink',
                choco_color_bluegreen: 'bluegreen',
                choco_color_white: 'white',

                choco_sound_car: 'car',
                choco_sound_robot: 'robot',
                choco_sound_dog: 'dog',
                choco_sound_cat: 'cat',
                choco_sound_chicken: 'chicken',
                choco_sound_tiger: 'tiger',
                choco_sound_lion: 'lion',
                choco_sound_fart: 'fart',
                choco_sound_helicopter: 'helicopter',
                choco_sound_train: 'train',
                choco_sound_frog: 'frog',
                choco_sound_jjajan: 'jjajan(effect)',
                choco_sound_sheep: 'sheep',
                choco_sound_elephant: 'elephant',
                choco_sound_camel: 'camel',
                choco_sound_dolphin: 'dolphin',
                choco_sound_ttiyong: 'ttiyong(effect)',
                choco_sound_hello_parrot: 'hello(parrot)',
                choco_sound_hello_manga: 'hello(manga)',
                choco_sound_hello_man: 'hello(man)',
                choco_sound_ppong: 'ppong(effect)',
                choco_sound_buzzer: 'buzzer(effect)',
                choco_sound_ttalilalan: 'ttalilalan(effect)',
                choco_sound_ttattattatta: 'ttattattatta(effect)',
                choco_sound_laughter: 'laughter',
                choco_sound_magic: 'magic(effect)',
                choco_sound_woodpecker: 'woodpecker',
                choco_sound_bird: 'bird',
                choco_sound_burp: 'burp',
                choco_sound_hiccup: 'hiccup',
                choco_sound_doridori: 'doridori',
                choco_sound_firetruck: 'fire truck',
                choco_sound_police_car: 'police car',
                choco_sound_applause: 'applause',
                choco_sound_kiss: 'kiss',
                choco_sound_missile: 'missile',
                choco_sound_angry_duck: 'angry duck',
                choco_sound_fly: 'fly',
                choco_sound_ufo: 'UFO',
                choco_sound_fanfare: 'fanfare',
                choco_sound_sigh: 'sigh',
                choco_sound_alright: 'alright',
                choco_sound_genius: 'genius',
                choco_sound_no: 'no',
                choco_sound_wow: 'wow',
                choco_sound_yahoo: 'yahoo',

                choco_sound_low_do: 'low do',
                choco_sound_low_dosharp: 'low do#',
                choco_sound_low_re: 'low re',
                choco_sound_low_resharp: 'low re#',
                choco_sound_low_mi: 'low mi',
                choco_sound_low_fa: 'low fa',
                choco_sound_low_fasharp: 'low fa#',
                choco_sound_low_sol: 'low sol',
                choco_sound_low_solsharp: 'low sol#',
                choco_sound_low_ra: 'low ra',
                choco_sound_low_rasharp: 'low ra#',
                choco_sound_low_si: 'low si',
                choco_sound_do: 'do',
                choco_sound_dosharp: 'do#',
                choco_sound_re: 're',
                choco_sound_resharp: 're#',
                choco_sound_mi: 'mi',
                choco_sound_fa: 'fa',
                choco_sound_fasharp: 'fa#',
                choco_sound_sol: 'sol',
                choco_sound_solsharp: 'sol#',
                choco_sound_ra: 'ra',
                choco_sound_rasharp: 'ra#',
                choco_sound_si: 'si',
                choco_sound_high_do: 'high do',
                choco_sound_high_dosharp: 'high do#',
                choco_sound_high_re: 'high re',
                choco_sound_high_resharp: 'high re#',
                choco_sound_high_mi: 'high mi',
                choco_sound_high_fa: 'high fa',
                choco_sound_high_fasharp: 'high fa#',
                choco_sound_high_sol: 'high sol',
                choco_sound_high_solsharp: 'high sol#',
                choco_sound_high_ra: 'high ra',
                choco_sound_high_rasharp: 'high ra#',
                choco_sound_high_si: 'high si',
            },
        },
    };
};

Entry.Choco.blockMenuBlocks = [
    //choco
    'choco_move_forward',
    'choco_move_backward',
    'choco_turn_left',
    'choco_turn_right',
    'choco_move_right_left',
    'choco_onoff_led_rear',
    'choco_set_led_color',
    'choco_play_sound',

    'choco_is_front_sensor',
    'choco_is_bottom_sensor',
    'choco_is_light_sensor',
    'choco_get_front_sensor',
    'choco_get_bottom_sensor',
    'choco_get_light_sensor',
];

Entry.Choco.getBlocks = function() {
    return {
        choco_move_forward: {
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
                        [Lang.Blocks.choco_move_step, 'step'],
                        [Lang.Blocks.choco_move_cm, 'cm'],
                    ],
                    value: 'step',
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
                params: [1, 'step', null],
                type: 'choco_move_forward',
            },
            paramsKeyMap: {
                MOVE_CNT: 0,
                MOVE_UNIT: 1,
            },
            class: 'choco_command',
            isNotFor: ['choco'],
            func: function(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;

                const move_cnt = script.getValue('MOVE_CNT');
                let move_unit = script.getValue('MOVE_UNIT');
                if (move_cnt === 0) return script.callReturn();

                if (!script.is_started) {
                    script.is_started = true;
                    const msgId = Entry.Choco.getHashKey();
                    script.msg_id = msgId;
                    sq.msg_id = script.msg_id;
                    const msg = {
                        id: msgId,
                        type: 'move_forward',
                        data: {
                            param1: move_cnt,
                            param2: move_unit,
                        },
                        time: Date.now(),
                    };
                    sq.msg = msg;
                    return script;
                }

                if (pd.msg_id && pd.msg_id.indexOf(script.msg_id) >= 0) {
                    delete script.is_started;
                    delete script.msg_id;
                    delete pd.msgId;

                    return script.callReturn();
                }
                return script;
            },
        },
        choco_move_backward: {
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
                        [Lang.Blocks.choco_move_step, 'step'],
                        [Lang.Blocks.choco_move_cm, 'cm'],
                    ],
                    value: 'step',
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
                params: [1, 'step', null],
                type: 'choco_move_backward',
            },
            paramsKeyMap: {
                MOVE_CNT: 0,
                MOVE_UNIT: 1,
            },
            class: 'choco_command',
            isNotFor: ['choco'],
            func: function(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;

                const move_cnt = script.getValue('MOVE_CNT');
                let move_unit = script.getValue('MOVE_UNIT');
                if (move_cnt === 0) return script.callReturn();

                if (!script.is_started) {
                    script.is_started = true;
                    const msgId = Entry.Choco.getHashKey();
                    script.msg_id = msgId;
                    sq.msg_id = script.msg_id;
                    const msg = {
                        id: msgId,
                        type: 'move_backward',
                        data: {
                            param1: move_cnt,
                            param2: move_unit,
                        },
                        time: Date.now(),
                    };
                    sq.msg = msg;
                    return script;
                }

                if (pd.msg_id && pd.msg_id.indexOf(script.msg_id) >= 0) {
                    delete script.is_started;
                    delete script.msg_id;
                    delete pd.msgId;
                    return script.callReturn();
                }
                return script;
            },
        },
        choco_turn_left: {
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
                        [Lang.Blocks.choco_trun_drgree, 'degree'],
                        [Lang.Blocks.choco_trun_round, 'turns'],
                    ],
                    value: 'degree',
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
                params: [90, 'degree', null],
                type: 'choco_turn_left',
            },
            paramsKeyMap: {
                TURN_CNT: 0,
                TURN_UNIT: 1,
            },
            class: 'choco_command',
            isNotFor: ['choco'],
            func: function(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;

                const turn_cnt = script.getValue('TURN_CNT');
                let turn_unit = script.getValue('TURN_UNIT');
                if (turn_cnt < 0) turn_cnt = 0;
                if (turn_cnt === 0) return script.callReturn();

                if (!script.is_started) {
                    script.is_started = true;
                    const msgId = Entry.Choco.getHashKey();
                    script.msg_id = msgId;
                    sq.msg_id = script.msg_id;
                    const msg = {
                        id: msgId,
                        type: 'turn_left',
                        data: {
                            param1: turn_cnt,
                            param2: turn_unit,
                        },
                        time: Date.now(),
                    };
                    sq.msg = msg;
                    return script;
                }

                if (pd.msg_id && pd.msg_id.indexOf(script.msg_id) >= 0) {
                    delete script.is_started;
                    delete script.msg_id;
                    delete pd.msgId;
                    return script.callReturn();
                }
                return script;
            },
        },
        choco_turn_right: {
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
                        [Lang.Blocks.choco_trun_drgree, 'degree'],
                        [Lang.Blocks.choco_trun_round, 'turns'],
                    ],
                    value: 'degree',
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
                params: [90, 'degree', null],
                type: 'choco_turn_right',
            },
            paramsKeyMap: {
                TURN_CNT: 0,
                TURN_UNIT: 1,
            },
            class: 'choco_command',
            isNotFor: ['choco'],
            func: function(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;

                const turn_cnt = script.getValue('TURN_CNT');
                let turn_unit = script.getValue('TURN_UNIT');
                if (turn_cnt < 0) turn_cnt = 0;
                if (turn_cnt === 0) return script.callReturn();

                if (!script.is_started) {
                    script.is_started = true;
                    const msgId = Entry.Choco.getHashKey();
                    script.msg_id = msgId;
                    sq.msg_id = script.msg_id;
                    const msg = {
                        id: msgId,
                        type: 'turn_right',
                        data: {
                            param1: turn_cnt,
                            param2: turn_unit,
                        },
                        time: Date.now(),
                    };
                    sq.msg = msg;
                    return script;
                }

                if (pd.msg_id && pd.msg_id.indexOf(script.msg_id) >= 0) {
                    delete script.is_started;
                    delete script.msg_id;
                    delete pd.msgId;
                    return script.callReturn();
                }
                return script;
            },
        },
        choco_move_right_left: {
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
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.choco_move_step, 'step'],
                        [Lang.Blocks.choco_move_cm, 'cm'],
                    ],
                    value: 'step',
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
                params: [1, 1, 'step', null],
                type: 'choco_move_right_left',
            },
            paramsKeyMap: {
                MOVE_RIGHT_CNT: 0,
                MOVE_LEFT_CNT: 1,
                MOVE_UNIT: 2,
            },
            class: 'choco_command',
            isNotFor: ['choco'],
            func: function(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;

                const move_right_cnt = script.getValue('MOVE_RIGHT_CNT');
                const move_left_cnt = script.getValue('MOVE_LEFT_CNT');
                let move_unit = script.getValue('MOVE_UNIT');

                if (!script.is_started) {
                    script.is_started = true;
                    const msgId = Entry.Choco.getHashKey();
                    script.msg_id = msgId;
                    sq.msg_id = script.msg_id;
                    const msg = {
                        id: msgId,
                        type: 'move_right_left',
                        data: {
                            param1: move_right_cnt,
                            param2: move_left_cnt,
                            param3: move_unit,
                        },
                        time: Date.now(),
                    };
                    sq.msg = msg;
                    return script;
                }

                if (pd.msg_id && pd.msg_id.indexOf(script.msg_id) >= 0) {
                    delete script.is_started;
                    delete script.msg_id;
                    delete pd.msgId;
                    return script.callReturn();
                }
                return script;
            },
        },
        choco_onoff_led_rear: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.choco_toggle_on, 'On'],
                        [Lang.Blocks.choco_toggle_off, 'Off'],
                    ],
                    value: 'On',
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
                params: ['On', null],
                type: 'choco_onoff_led_rear',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'choco_command',
            isNotFor: ['choco'],
            func: function(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;
                const led_onoff = script.getValue('VALUE');

                if (!script.is_started) {
                    script.is_started = true;
                    const msgId = Entry.Choco.getHashKey();
                    script.msg_id = msgId;
                    sq.msg_id = script.msg_id;
                    const msg = {
                        id: msgId,
                        type: 'onoff_led_rear',
                        data: {
                            param1: led_onoff,
                        },
                        time: Date.now(),
                    };
                    sq.msg = msg;
                    return script;
                }

                if (pd.msg_id && pd.msg_id.indexOf(script.msg_id) >= 0) {
                    delete script.is_started;
                    delete script.msg_id;
                    delete pd.msgId;
                    return script.callReturn();
                }
                return script;
            },
        },
        choco_set_led_color: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.choco_direction_right, 'right'],
                        [Lang.Blocks.choco_direction_left, 'left'],
                        [Lang.Blocks.choco_direction_dual, 'dual'],
                    ],
                    value: 'right',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.choco_color_off, 0],
                        [Lang.Blocks.choco_color_blue, 1],
                        [Lang.Blocks.choco_color_red, 2],
                        [Lang.Blocks.choco_color_green, 3],
                        [Lang.Blocks.choco_color_yellow, 4],
                        [Lang.Blocks.choco_color_pink, 5],
                        [Lang.Blocks.choco_color_bluegreen, 6],
                        [Lang.Blocks.choco_color_white, 7],
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
                params: ['right', 1, null],
                type: 'choco_set_led_color',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                COLOR: 1,
            },
            class: 'choco_command',
            isNotFor: ['choco'],
            func: function(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;
                const led_dir = script.getValue('DIRECTION');
                const led_color = script.getValue('COLOR');

                if (!script.is_started) {
                    script.is_started = true;
                    const msgId = Entry.Choco.getHashKey();
                    script.msg_id = msgId;
                    sq.msg_id = script.msg_id;
                    const msg = {
                        id: msgId,
                        type: 'set_led_color',
                        data: {
                            param1: led_dir,
                            param2: led_color,
                        },
                        time: Date.now(),
                    };
                    sq.msg = msg;
                    return script;
                }

                if (pd.msg_id && pd.msg_id.indexOf(script.msg_id) >= 0) {
                    delete script.is_started;
                    delete script.msg_id;
                    delete pd.msgId;
                    return script.callReturn();
                }
                return script;
            },
        },
        choco_play_sound: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.choco_sound_car, 1],
                        [Lang.Blocks.choco_sound_robot, 2],
                        [Lang.Blocks.choco_sound_dog, 3],
                        [Lang.Blocks.choco_sound_cat, 4],
                        [Lang.Blocks.choco_sound_chicken, 5],
                        [Lang.Blocks.choco_sound_tiger, 6],
                        [Lang.Blocks.choco_sound_lion, 7],
                        [Lang.Blocks.choco_sound_fart, 8],
                        [Lang.Blocks.choco_sound_helicopter, 9],
                        [Lang.Blocks.choco_sound_train, 10],
                        [Lang.Blocks.choco_sound_frog, 11],
                        [Lang.Blocks.choco_sound_jjajan, 12],
                        [Lang.Blocks.choco_sound_sheep, 13],
                        [Lang.Blocks.choco_sound_elephant, 14],
                        [Lang.Blocks.choco_sound_camel, 15],
                        [Lang.Blocks.choco_sound_dolphin, 16],
                        [Lang.Blocks.choco_sound_ttiyong, 17],
                        [Lang.Blocks.choco_sound_hello_parrot, 18],
                        [Lang.Blocks.choco_sound_hello_manga, 19],
                        [Lang.Blocks.choco_sound_hello_man, 20],
                        [Lang.Blocks.choco_sound_ppong, 21],
                        [Lang.Blocks.choco_sound_buzzer, 22],
                        [Lang.Blocks.choco_sound_ttalilalan, 23],
                        [Lang.Blocks.choco_sound_ttattattatta, 24],
                        [Lang.Blocks.choco_sound_laughter, 25],
                        [Lang.Blocks.choco_sound_magic, 26],
                        [Lang.Blocks.choco_sound_woodpecker, 27],
                        [Lang.Blocks.choco_sound_bird, 28],
                        [Lang.Blocks.choco_sound_burp, 29],
                        [Lang.Blocks.choco_sound_hiccup, 30],
                        [Lang.Blocks.choco_sound_doridori, 31],
                        [Lang.Blocks.choco_sound_firetruck, 32],
                        [Lang.Blocks.choco_sound_police_car, 33],
                        [Lang.Blocks.choco_sound_applause, 34],
                        [Lang.Blocks.choco_sound_kiss, 35],
                        [Lang.Blocks.choco_sound_missile, 36],
                        [Lang.Blocks.choco_sound_angry_duck, 37],
                        [Lang.Blocks.choco_sound_fly, 38],
                        [Lang.Blocks.choco_sound_ufo, 39],
                        [Lang.Blocks.choco_sound_fanfare, 40],
                        [Lang.Blocks.choco_sound_sigh, 41],
                        [Lang.Blocks.choco_sound_alright, 42],
                        [Lang.Blocks.choco_sound_genius, 43],
                        [Lang.Blocks.choco_sound_no, 44],
                        [Lang.Blocks.choco_sound_wow, 45],
                        [Lang.Blocks.choco_sound_yahoo, 46],

                        [Lang.Blocks.choco_sound_low_do, 47],
                        [Lang.Blocks.choco_sound_low_dosharp, 48],
                        [Lang.Blocks.choco_sound_low_re, 49],
                        [Lang.Blocks.choco_sound_low_resharp, 50],
                        [Lang.Blocks.choco_sound_low_mi, 51],
                        [Lang.Blocks.choco_sound_low_fa, 52],
                        [Lang.Blocks.choco_sound_low_fasharp, 53],
                        [Lang.Blocks.choco_sound_low_sol, 54],
                        [Lang.Blocks.choco_sound_low_solsharp, 55],
                        [Lang.Blocks.choco_sound_low_ra, 56],
                        [Lang.Blocks.choco_sound_low_rasharp, 57],
                        [Lang.Blocks.choco_sound_low_si, 58],
                        [Lang.Blocks.choco_sound_do, 59],
                        [Lang.Blocks.choco_sound_dosharp, 60],
                        [Lang.Blocks.choco_sound_re, 61],
                        [Lang.Blocks.choco_sound_resharp, 62],
                        [Lang.Blocks.choco_sound_mi, 63],
                        [Lang.Blocks.choco_sound_fa, 64],
                        [Lang.Blocks.choco_sound_fasharp, 65],
                        [Lang.Blocks.choco_sound_sol, 66],
                        [Lang.Blocks.choco_sound_solsharp, 67],
                        [Lang.Blocks.choco_sound_ra, 68],
                        [Lang.Blocks.choco_sound_rasharp, 69],
                        [Lang.Blocks.choco_sound_si, 70],
                        [Lang.Blocks.choco_sound_high_do, 71],
                        [Lang.Blocks.choco_sound_high_dosharp, 72],
                        [Lang.Blocks.choco_sound_high_re, 73],
                        [Lang.Blocks.choco_sound_high_resharp, 74],
                        [Lang.Blocks.choco_sound_high_mi, 75],
                        [Lang.Blocks.choco_sound_high_fa, 76],
                        [Lang.Blocks.choco_sound_high_fasharp, 77],
                        [Lang.Blocks.choco_sound_high_sol, 78],
                        [Lang.Blocks.choco_sound_high_solsharp, 79],
                        [Lang.Blocks.choco_sound_high_ra, 80],
                        [Lang.Blocks.choco_sound_high_rasharp, 81],
                        [Lang.Blocks.choco_sound_high_si, 82],
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
                params: [1, null],
                type: 'choco_play_sound',
            },
            paramsKeyMap: {
                SOUND: 0,
            },
            class: 'choco_command',
            isNotFor: ['choco'],
            func: function(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;
                const sound = script.getValue('SOUND');

                if (!script.is_started) {
                    script.is_started = true;
                    const msgId = Entry.Choco.getHashKey();
                    script.msg_id = msgId;
                    sq.msg_id = script.msg_id;
                    const msg = {
                        id: msgId,
                        type: 'play_sound',
                        data: {
                            param1: sound,
                        },
                        time: Date.now(),
                    };
                    sq.msg = msg;
                    return script;
                }

                if (pd.msg_id && pd.msg_id.indexOf(script.msg_id) >= 0) {
                    delete script.is_started;
                    delete script.msg_id;
                    delete pd.msgId;
                    return script.callReturn();
                }
                return script;
            },
        },
        choco_is_front_sensor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Text',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'choco_is_front_sensor',
            },
            paramsKeyMap: {},
            class: 'choco_command',
            isNotFor: ['choco'],
            func: function(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;
                let retVal = false;
                if (pd.sensorData) {
                    retVal = pd.sensorData.is_front_sensor;
                }
                return retVal;
            },
        },
        choco_is_bottom_sensor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Text',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'choco_is_bottom_sensor',
            },
            paramsKeyMap: {},
            class: 'choco_command',
            isNotFor: ['choco'],
            func: function(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;
                let retVal = false;
                if (pd.sensorData) {
                    retVal = pd.sensorData.is_bottom_sensor;
                }
                return retVal;
            },
        },
        choco_is_light_sensor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Text',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'choco_is_light_sensor',
            },
            paramsKeyMap: {},
            class: 'choco_command',
            isNotFor: ['choco'],
            func: function(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;
                let retVal = false;
                if (pd.sensorData) {
                    retVal = pd.sensorData.is_light_sensor;
                }
                return retVal;
            },
        },

        choco_get_front_sensor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Text',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'choco_get_front_sensor',
            },
            paramsKeyMap: {},
            class: 'choco_command',
            isNotFor: ['choco'],
            func: function(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;
                let retVal = 0;
                if (pd.sensorData) {
                    retVal = pd.sensorData.front_sensor;
                }
                return retVal;
            },
        },
        choco_get_bottom_sensor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Text',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'choco_get_bottom_sensor',
            },
            paramsKeyMap: {},
            class: 'choco_command',
            isNotFor: ['choco'],
            func: function(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const pd = Entry.hw.portData;
                let retVal = 0;
                if (pd.sensorData) {
                    retVal = pd.sensorData.bottom_sensor;
                }
                return retVal;
            },
        },
        choco_get_light_sensor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Text',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'choco_get_light_sensor',
            },
            paramsKeyMap: {},
            class: 'choco_command',
            isNotFor: ['choco'],
            func: function(sprite, script) {
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
module.exports = Entry.Choco;
