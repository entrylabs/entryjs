'use strict';

Entry.HyACT_Xylobot = {
    id: '33.1',
    name: 'hyact_xylobot',
    url: 'http://www.naver.com/',
    imageName: 'hyact_xylobot.png',
    title: {
        ko: '하이엑트 실로봇',
        en: 'HyACT Xylobot',
    },

    delayTime: 20,
    timeouts: [],
    array: {
        SET_ZERO: 0,
        GET_NOW_AIXS: 1,
        GET_NOTE_AIXS: 2,
        SET_LED_MOVEMENT: 3,
        SET_LED_COLOR: 4,
        SET_LED_RGB: 5,
        SET_TORQUE_TOGGLE: 6,
        SET_POSITION_SINGLE: 7,
        SET_POSITION_MANY: 8,
        SET_SPEED: 9,
        SET_TORQUE: 10,
        SET_PLAY_NOTE: 11,
        SET_MOVE_NOTE: 12,
        SET_MOVE_DEFAULT: 13,
    },
    note: {
        C: 1,
        D: 2,
        E: 3,
        F: 4,
        G: 5,
        A: 6,
        B: 7,
        HIGH_C: 8,
    },
    removeTimeout: function(id) {
        clearTimeout(id);
        var timeouts = this.timeouts;
        var index = timeouts.indexOf(id);
        if (index >= 0) {
            timeouts.splice(index, 1);
        }
    },
    removeAllTimeouts: function() {
        var timeouts = this.timeouts;
        for (var i in timeouts) {
            clearTimeout(timeouts[i]);
        }
        this.timeouts = [];
    },
    setZero: function() {    
        Entry.hw.sendQueue['SEND'] = {};
        Entry.hw.sendQueue['SEND'][Entry.HyACT_Xylobot.array.SET_ZERO] = {
            Time: new Date().getTime(),
        };
        Entry.hw.update();
    },
};
Entry.HyACT_Xylobot.setLanguage = function() {
    return {
        ko: {
            template: {
                hyact_xylobot_list_aixs_1: '1 축',
                hyact_xylobot_list_aixs_2: '2 축',
                hyact_xylobot_list_aixs_3: '3 축',
                hyact_xylobot_list_aixs_all: '모든 축',
                hyact_xylobot_list_octave_4_do: '도',
                hyact_xylobot_list_octave_4_re: '레',
                hyact_xylobot_list_octave_4_mi: '미',
                hyact_xylobot_list_octave_4_fa: '파',
                hyact_xylobot_list_octave_4_sol: '솔',
                hyact_xylobot_list_octave_4_la: '라',
                hyact_xylobot_list_octave_4_si: '시',
                hyact_xylobot_list_octave_5_do: '높은 도',
                hyact_xylobot_list_movement_on: '켜기',
                hyact_xylobot_list_movement_twinkle: '반짝',
                hyact_xylobot_list_movement_standby: '대기',
                hyact_xylobot_list_toggle_on: '켜기',
                hyact_xylobot_list_toggle_off: '끄기',
                hyact_xylobot_list_color_off: '끄기',
                hyact_xylobot_list_color_red: '빨간색',
                hyact_xylobot_list_color_orange: '주황색',
                hyact_xylobot_list_color_yellow: '노란색',
                hyact_xylobot_list_color_green: '초록색',
                hyact_xylobot_list_color_blue: '파란색',
                hyact_xylobot_list_color_navy: '남색',
                hyact_xylobot_list_color_purple: '보라색',
                hyact_xylobot_list_color_white: '흰색',
                hyact_xylobot_list_position_ready: '준비위치',
                hyact_xylobot_list_position_target: '목표위치',
                hyact_xylobot_get_now_aixs_block: '지금 %1 위치값',
                hyact_xylobot_get_note_aixs_block: '%1 음의 %2 위치값',
                hyact_xylobot_set_led_movement_block: 'LED 모드를 %1 모드로 정하기 %2',
                hyact_xylobot_set_led_color_block: 'LED 색을 %1 으로 정하기 %2',
                hyact_xylobot_set_led_rgb_block: 'LED 색을 R : %1% G : %2% B : %3% 으로 정하기 %4',
                hyact_xylobot_set_torque_toggle_block: '%1 토크를 %2 %3',
                hyact_xylobot_set_position_single_block: '%1 의 목표 위치값을 %2º(도) 로 정하기 %3',
                hyact_xylobot_set_position_many_block: '목표 위치값을 1축 : %1º(도)  2축 : %2º(도)  3축 : %3º(도) 으로 정하기 %4',
                hyact_xylobot_set_speed_block: '%1 의 속도를 %2% 으로 정하기 %3',
                hyact_xylobot_set_torque_block: '%1 의 토크값을 %2% 으로 정하기 %3',
                hyact_xylobot_set_play_note_block: '%1 음을 치기 %2',
                hyact_xylobot_set_move_note_block: '%1 음의 %2 로 가기 %3',
                hyact_xylobot_set_move_default_block: '모든 축이 기본 위치로 가기 %1',

            },
        },
        en: {
            template: {
                hyact_xylobot_list_aixs_1: 'First axis',
                hyact_xylobot_list_aixs_2: 'Second axis',
                hyact_xylobot_list_aixs_3: 'Third axis',
                hyact_xylobot_list_aixs_all: 'All axis',
                hyact_xylobot_list_octave_4_do: 'C',
                hyact_xylobot_list_octave_4_re: 'D',
                hyact_xylobot_list_octave_4_mi: 'E',
                hyact_xylobot_list_octave_4_fa: 'F',
                hyact_xylobot_list_octave_4_sol: 'G',
                hyact_xylobot_list_octave_4_la: 'A',
                hyact_xylobot_list_octave_4_si: 'B',
                hyact_xylobot_list_octave_5_do: 'High C',
                hyact_xylobot_list_movement_on: 'On',
                hyact_xylobot_list_movement_twinkle: 'Twinkle',
                hyact_xylobot_list_movement_standby: 'Stand by',
                hyact_xylobot_list_toggle_on: 'On',
                hyact_xylobot_list_toggle_off: 'Off',
                hyact_xylobot_list_color_off: 'Off',
                hyact_xylobot_list_color_red: 'Red',
                hyact_xylobot_list_color_orange: 'Orange',
                hyact_xylobot_list_color_yellow: 'Yellow',
                hyact_xylobot_list_color_green: 'Green',
                hyact_xylobot_list_color_blue: 'Blue',
                hyact_xylobot_list_color_navy: 'Navy',
                hyact_xylobot_list_color_purple: 'Purple',
                hyact_xylobot_list_color_white: 'White',
                hyact_xylobot_list_position_ready: 'Ready position',
                hyact_xylobot_list_position_target: 'Target position',
                hyact_xylobot_get_now_aixs_block: 'Current %1 position value',
                hyact_xylobot_get_note_aixs_block: '%1 note\'s %2 position value',
                hyact_xylobot_set_led_movement_block: 'LED mode setting to %1 %2',
                hyact_xylobot_set_led_color_block: 'LED color setting to %1 %2',
                hyact_xylobot_set_led_rgb_block: 'LED color setting to R : %1% G : %2% B : %3% %4',
                hyact_xylobot_set_torque_toggle_block: '%1 torque %2 %3',
                hyact_xylobot_set_position_single_block: '%1 \'s target position setting to %2º(degree) %3',
                hyact_xylobot_set_position_many_block: 'Target position setting to first axis : %1º(degree)  second axis : %2º(degree)  third axis : %3º(degree) %4',
                hyact_xylobot_set_speed_block: '%1 \'s speed setting to %2% %3',
                hyact_xylobot_set_torque_block: '%1 \'s torque value setting to %2% %3',
                hyact_xylobot_set_play_note_block: 'Play %1 %2',
                hyact_xylobot_set_move_note_block: 'Go to %1 \'s %2 %3',
                hyact_xylobot_set_move_default_block: 'Go to all axis default position %1',
            },
        },
        jp: {
            template: {
                hyact_xylobot_list_aixs_1: '第1関節',
                hyact_xylobot_list_aixs_2: '第２関節',
                hyact_xylobot_list_aixs_3: '第３関節',
                hyact_xylobot_list_aixs_all: '全ての関節',
                hyact_xylobot_list_octave_4_do: 'ド',
                hyact_xylobot_list_octave_4_re: 'レ',
                hyact_xylobot_list_octave_4_mi: 'ミ',
                hyact_xylobot_list_octave_4_fa: 'ファ',
                hyact_xylobot_list_octave_4_sol: 'ソ',
                hyact_xylobot_list_octave_4_la: 'ラ',
                hyact_xylobot_list_octave_4_si: 'シ',
                hyact_xylobot_list_octave_5_do: '上のド',
                hyact_xylobot_list_movement_on: '点灯',
                hyact_xylobot_list_movement_twinkle: '点滅',
                hyact_xylobot_list_movement_standby: '待機',
                hyact_xylobot_list_toggle_on: '点灯',
                hyact_xylobot_list_toggle_off: 'オフ',
                hyact_xylobot_list_color_off: 'オフ',
                hyact_xylobot_list_color_red: '赤',
                hyact_xylobot_list_color_orange: '黄緑',
                hyact_xylobot_list_color_yellow: '黄色',
                hyact_xylobot_list_color_green: '緑',
                hyact_xylobot_list_color_blue: '青',
                hyact_xylobot_list_color_navy: '藍色',
                hyact_xylobot_list_color_purple: '紫',
                hyact_xylobot_list_color_white: '白',
                hyact_xylobot_list_position_ready: '準備位置',
                hyact_xylobot_list_position_target: '目標位置',
                hyact_xylobot_get_now_aixs_block: '現在の %1 角度',
                hyact_xylobot_get_note_aixs_block: '%1 音の %2 角度',
                hyact_xylobot_set_led_movement_block: 'LEDモードを %1 モードにする %2',
                hyact_xylobot_set_led_color_block: 'LED色を %1 にする。 %2',
                hyact_xylobot_set_led_rgb_block: 'LED色を R : %1% G : %2% B : %3% に設定 %4',
                hyact_xylobot_set_torque_toggle_block: '%1 トルク %2 %3',
                hyact_xylobot_set_position_single_block: '%1 の角度を %2º(度) にする。 %3',
                hyact_xylobot_set_position_many_block: '姿勢を第1関節: %1º(度)  第２関節: %2º(度)  第３関節: %3º(度) にする。 %4',
                hyact_xylobot_set_speed_block: '%1 の速度を %2% にする。 %3',
                hyact_xylobot_set_torque_block: '%1 のトルクを %2% にする。 %3',
                hyact_xylobot_set_play_note_block: '%1 を叩く。 %2',
                hyact_xylobot_set_move_note_block: '%1 音の %2 に動く。 %3',
                hyact_xylobot_set_move_default_block: '初期姿勢に戻る。 %1',
            },
        },
    };
};
Entry.HyACT_Xylobot.blockMenuBlocks = [
    'hyact_xylobot_get_now_aixs_block',
    'hyact_xylobot_get_note_aixs_block',
    'hyact_xylobot_set_led_movement_block',
    'hyact_xylobot_set_led_color_block',
    'hyact_xylobot_set_led_rgb_block',
    'hyact_xylobot_set_torque_toggle_block',
    'hyact_xylobot_set_position_single_block',
    'hyact_xylobot_set_position_many_block',
    'hyact_xylobot_set_speed_block',
    'hyact_xylobot_set_torque_block',
    'hyact_xylobot_set_play_note_block',
    'hyact_xylobot_set_move_note_block',
    'hyact_xylobot_set_move_default_block',
];
Entry.HyACT_Xylobot.getBlocks = function() {
    return {
        //region HyACT 하이액트 Xylobot
        hyact_xylobot_list_aixs_block: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.hyact_xylobot_list_aixs_1, '0'],
                        [Lang.template.hyact_xylobot_list_aixs_2, '1'],
                        [Lang.template.hyact_xylobot_list_aixs_3, '2'],
                    ],
                    value: '0',
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
                AXIS: 0,
            },
            func: function(sprite, script) {
                return script.getField('AXIS');
            },
        },
        hyact_xylobot_list_aixs_ex_block: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.hyact_xylobot_list_aixs_1, '0'],
                        [Lang.template.hyact_xylobot_list_aixs_2, '1'],
                        [Lang.template.hyact_xylobot_list_aixs_3, '2'],
                        [Lang.template.hyact_xylobot_list_aixs_all, '3'],
                    ],
                    value: '0',
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
                AXIS: 0,
            },
            func: function(sprite, script) {
                return script.getField('AXIS');
            },
        },
        hyact_xylobot_list_note_block: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.hyact_xylobot_list_octave_4_do, '1'],
                        [Lang.template.hyact_xylobot_list_octave_4_re, '2'],
                        [Lang.template.hyact_xylobot_list_octave_4_mi, '3'],
                        [Lang.template.hyact_xylobot_list_octave_4_fa, '4'],
                        [Lang.template.hyact_xylobot_list_octave_4_sol, '5'],
                        [Lang.template.hyact_xylobot_list_octave_4_la, '6'],
                        [Lang.template.hyact_xylobot_list_octave_4_si, '7'],
                        [Lang.template.hyact_xylobot_list_octave_5_do, '8'],
                    ],
                    value: '1',
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
                NOTE: 0,
            },
            func: function(sprite, script) {
                return script.getField('NOTE');
            },
        },
        hyact_xylobot_list_movement_block: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.hyact_xylobot_list_movement_on, '0'],
                        [Lang.template.hyact_xylobot_list_movement_twinkle, '1'],
                        [Lang.template.hyact_xylobot_list_movement_standby, '2'],
                    ],
                    value: '0',
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
                MOVEMENT: 0,
            },
            func: function(sprite, script) {
                return script.getField('MOVEMENT');
            },
        },
        hyact_xylobot_list_toggle_block: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.hyact_xylobot_list_toggle_off, '0'],
                        [Lang.template.hyact_xylobot_list_toggle_on, '1'],
                    ],
                    value: '1',
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
                MOVEMENT: 0,
            },
            func: function(sprite, script) {
                return script.getField('MOVEMENT');
            },
        },
        hyact_xylobot_list_color_block: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.hyact_xylobot_list_color_off, '0'],
                        [Lang.template.hyact_xylobot_list_color_red, '1'],
                        [Lang.template.hyact_xylobot_list_color_orange, '2'],
                        [Lang.template.hyact_xylobot_list_color_yellow, '3'],
                        [Lang.template.hyact_xylobot_list_color_green, '4'],
                        [Lang.template.hyact_xylobot_list_color_blue, '5'],
                        [Lang.template.hyact_xylobot_list_color_navy, '6'],
                        [Lang.template.hyact_xylobot_list_color_purple, '7'],
                        [Lang.template.hyact_xylobot_list_color_white, '9'],
                    ],
                    value: '1',
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
                COLOR: 0,
            },
            func: function(sprite, script) {
                return script.getField('COLOR');
            },
        },
        hyact_xylobot_list_position_block: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.hyact_xylobot_list_position_ready, '0'],
                        [Lang.template.hyact_xylobot_list_position_target, '1'],
                    ],
                    value: '1',
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
                POSITION: 0,
            },
            func: function(sprite, script) {
                return script.getField('POSITION');
            },
        },
        hyact_xylobot_get_now_aixs_block: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            statements: [],
            template: Lang.template.hyact_xylobot_get_now_aixs_block,
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
            ],
            def: {
                params: [
                    {
                        type: 'hyact_xylobot_list_aixs_block',
                    },
                ],
                type: 'hyact_xylobot_get_now_aixs_block',
            },
            paramsKeyMap: {
                AXIS: 0,
            },
            events: {},
            class: 'GetBlock',
            isNotFor: ['hyact_xylobot'],
            func: function(sprite, script) {
                var axisData = script.getNumberValue('AXIS');
                var xylobotDatas = new Object();
                var axis = 0;

                xylobotDatas = Entry.hw.portData;

                if (axisData == 0) axis = xylobotDatas.positionNow.aixs1;
                else if (axisData == 1) axis = xylobotDatas.positionNow.aixs2;
                else if (axisData == 2) axis = xylobotDatas.positionNow.aixs3;
                axis = Math.floor((axis / 1023) * 300);
                axis = (axis - 150) * -1;

                return axis;
            },
        },
        hyact_xylobot_get_note_aixs_block: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            statements: [],
            template: Lang.template.hyact_xylobot_get_note_aixs_block,
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
            ],
            def: {
                params: [
                    {
                        type: 'hyact_xylobot_list_note_block',
                    },
                    {
                        type: 'hyact_xylobot_list_aixs_block',
                    },
                ],
                type: 'hyact_xylobot_get_note_aixs_block',
            },
            paramsKeyMap: {
                NOTE: 0,
                AXIS: 1,
            },
            events: {},
            class: 'GetBlock',
            isNotFor: ['hyact_xylobot'],
            func: function(sprite, script) {
                var noteData = script.getNumberValue('NOTE');
                var axisData = script.getNumberValue('AXIS');
                var xylobotDatas = 0;
                var axis = 0;

                xylobotDatas = Entry.hw.portData;

                switch(noteData)
                {
                    case Entry.HyACT_Xylobot.note.C:
                        if(axisData == 0) axis = xylobotDatas.positionC.aixs1;
                        else if(axisData == 1) axis = xylobotDatas.positionC.aixs2;
                        else if(axisData == 2) axis = xylobotDatas.positionC.aixs3;
                        break;
                    case Entry.HyACT_Xylobot.note.D:                        
                        if(axisData == 0) axis = xylobotDatas.positionD.aixs1;
                        else if(axisData == 1) axis = xylobotDatas.positionD.aixs2;
                        else if(axisData == 2) axis = xylobotDatas.positionD.aixs3;
                        break; 
                    case Entry.HyACT_Xylobot.note.E:
                        if(axisData == 0) axis = xylobotDatas.positionE.aixs1;
                        else if(axisData == 1) axis = xylobotDatas.positionE.aixs2;
                        else if(axisData == 2) axis = xylobotDatas.positionE.aixs3;
                        break; 
                    case Entry.HyACT_Xylobot.note.F:
                        if(axisData == 0) axis = xylobotDatas.positionF.aixs1;
                        else if(axisData == 1) axis = xylobotDatas.positionF.aixs2;
                        else if(axisData == 2) axis = xylobotDatas.positionF.aixs3;
                        break; 
                    case Entry.HyACT_Xylobot.note.G:
                        if(axisData == 0) axis = xylobotDatas.positionG.aixs1;
                        else if(axisData == 1) axis = xylobotDatas.positionG.aixs2;
                        else if(axisData == 2) axis = xylobotDatas.positionG.aixs3;
                        break; 
                    case Entry.HyACT_Xylobot.note.A:
                        if(axisData == 0) axis = xylobotDatas.positionA.aixs1;
                        else if(axisData == 1) axis = xylobotDatas.positionA.aixs2;
                        else if(axisData == 2) axis = xylobotDatas.positionA.aixs3;
                        break; 
                    case Entry.HyACT_Xylobot.note.B:
                        if(axisData == 0) axis = xylobotDatas.positionB.aixs1;
                        else if(axisData == 1) axis = xylobotDatas.positionB.aixs2;
                        else if(axisData == 2) axis = xylobotDatas.positionB.aixs3;
                        break; 
                    case Entry.HyACT_Xylobot.note.HIGH_C:
                        if(axisData == 0) axis = xylobotDatas.positionHighC.aixs1;
                        else if(axisData == 1) axis = xylobotDatas.positionHighC.aixs2;
                        else if(axisData == 2) axis = xylobotDatas.positionHighC.aixs3;
                        break; 
                }
                axis = Math.floor((axis / 1023) * 300);
                axis = (axis - 150) * -1;

                return axis;
            },
        },
        hyact_xylobot_set_led_movement_block: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: Lang.template.hyact_xylobot_set_led_movement_block,
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
                        type: 'hyact_xylobot_list_movement_block',
                    },
                    null,
                ],
                type: 'hyact_xylobot_set_led_movement_block',
            },
            paramsKeyMap: {
                MOVEMENT: 0,
            },
            events: {},
            class: 'SetBlock',
            isNotFor: ['hyact_xylobot'],
            func: function(sprite, script) {
                var movementData = script.getNumberValue('MOVEMENT');

                if(!script.isStart)
                {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.HyACT_Xylobot.removeTimeout(timer);
                    }, Entry.HyACT_Xylobot.delayTime);
                    Entry.HyACT_Xylobot.timeouts.push(timer);
                    return script;

                }
                else if(script.timeFlag == 1)
                {
                    return script;
                }
                else
                {
                    Entry.hw.sendQueue['SEND'] = {};
                    Entry.hw.sendQueue['SEND'][Entry.HyACT_Xylobot.array.SET_LED_MOVEMENT] = {
                        Movement: movementData,
                        Time: new Date().getTime(),
                    };
                    return script.callReturn();
                }
            },
        },
        hyact_xylobot_set_led_color_block: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: Lang.template.hyact_xylobot_set_led_color_block,
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
                        type: 'hyact_xylobot_list_color_block',
                    },
                    null,
                ],
                type: 'hyact_xylobot_set_led_color_block',
            },
            paramsKeyMap: {
                COLOR: 0,
            },
            events: {},
            class: 'SetBlock',
            isNotFor: ['hyact_xylobot'],
            func: function(sprite, script) {
                var colorData = script.getNumberValue('COLOR');

                if(!script.isStart)
                {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.HyACT_Xylobot.removeTimeout(timer);
                    }, Entry.HyACT_Xylobot.delayTime);
                    Entry.HyACT_Xylobot.timeouts.push(timer);
                    return script;

                }
                else if(script.timeFlag == 1)
                {
                    return script;
                }
                else
                {
                    Entry.hw.sendQueue['SEND'] = {};
                    Entry.hw.sendQueue['SEND'][Entry.HyACT_Xylobot.array.SET_LED_COLOR] = {
                        Color: colorData,
                        Time: new Date().getTime(),
                    };

                    return script.callReturn();
                }
            },
        },
        hyact_xylobot_set_led_rgb_block: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: Lang.template.hyact_xylobot_set_led_rgb_block,
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
            def: {
                params: [
                    {
                        type: 'number',
                        params: ['100'],
                    },
                    {
                        type: 'number',
                        params: ['100'],
                    },
                    {
                        type: 'number',
                        params: ['100'],
                    },
                    null,
                ],
                type: 'hyact_xylobot_set_led_rgb_block',
            },
            paramsKeyMap: {
                RED: 0,
                GREEN: 1,
                BLUE: 2,
            },
            events: {},
            class: 'SetBlock',
            isNotFor: ['hyact_xylobot'],
            func: function(sprite, script) {
                var red = script.getNumberValue('RED');
                var green = script.getNumberValue('GREEN');
                var blue = script.getNumberValue('BLUE');
                var redData = 0;
                var greenData = 0;
                var blueData =  0;

                if(red > 100) red = 100;
                else if(red < 0) red = 0;
                if(green > 100) green = 100;
                else if(green < 0) green = 0;
                if(blue > 100) blue = 100;
                else if(blue < 0) blue = 0;
                redData = Math.floor((255 * red) / 100);
                greenData = Math.floor((255 * green) / 100);
                blueData = Math.floor((255 * blue) / 100);


                if(!script.isStart)
                {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.HyACT_Xylobot.removeTimeout(timer);
                    }, Entry.HyACT_Xylobot.delayTime);
                    Entry.HyACT_Xylobot.timeouts.push(timer);
                    return script;

                }
                else if(script.timeFlag == 1)
                {
                    return script;
                }
                else
                {
                    Entry.hw.sendQueue['SEND'] = {};
                    Entry.hw.sendQueue['SEND'][Entry.HyACT_Xylobot.array.SET_LED_RGB] = {
                        Red: redData,
                        Green: greenData,
                        Blue: blueData,
                        Time: new Date().getTime(),
                    };
                    return script.callReturn();
                }
            },
        },
        hyact_xylobot_set_torque_toggle_block: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: Lang.template.hyact_xylobot_set_torque_toggle_block,
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
            def: {
                params: [
                    {
                        type: 'hyact_xylobot_list_aixs_ex_block',
                    },
                    {
                        type: 'hyact_xylobot_list_toggle_block',
                    },
                    null,
                ],
                type: 'hyact_xylobot_set_torque_toggle_block',
            },
            paramsKeyMap: {
                AIXS: 0,
                TOGGLE: 1,
            },
            events: {},
            class: 'SetBlock',
            isNotFor: ['hyact_xylobot'],
            func: function(sprite, script) {
                var axisData = script.getNumberValue('AIXS');
                var toggleData = script.getNumberValue("TOGGLE");

                if(!script.isStart)
                {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.HyACT_Xylobot.removeTimeout(timer);
                    }, Entry.HyACT_Xylobot.delayTime);
                    Entry.HyACT_Xylobot.timeouts.push(timer);
                    return script;
                }
                else if(script.timeFlag == 1)
                {
                    return script;
                }
                else
                {
                    Entry.hw.sendQueue['SEND'] = {};
                    Entry.hw.sendQueue['SEND'][Entry.HyACT_Xylobot.array.SET_TORQUE_TOGGLE] = {
                        Axis: axisData,
                        Toggle: toggleData,
                        Time: new Date().getTime(),
                    };
                    return script.callReturn();
                }
            },
        },
        hyact_xylobot_set_position_single_block: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: Lang.template.hyact_xylobot_set_position_single_block,
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
            def: {
                params: [
                    {
                        type: 'hyact_xylobot_list_aixs_block',
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'hyact_xylobot_set_position_single_block',
            },
            paramsKeyMap: {
                AIXS: 0,
                POSITION: 1,
            },
            events: {},
            class: 'SetBlock',
            isNotFor: ['hyact_xylobot'],
            func: function(sprite, script) {
                var axisData = script.getNumberValue('AIXS');
                var position = script.getNumberValue("POSITION");
                var positionData = 0;

                if(position > 150) position = 150;
                else if(position < -150) position = -150;
                position = (position * -1) + 150;
                positionData = Math.floor((1023 * position) / 300);

                if(!script.isStart)
                {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.HyACT_Xylobot.removeTimeout(timer);
                    }, Entry.HyACT_Xylobot.delayTime);
                    Entry.HyACT_Xylobot.timeouts.push(timer);
                    return script;

                }
                else if(script.timeFlag == 1)
                {
                    return script;
                }
                else
                {
                    Entry.hw.sendQueue['SEND'] = {};
                    Entry.hw.sendQueue['SEND'][Entry.HyACT_Xylobot.array.SET_POSITION_SINGLE] = {
                        Axis: axisData,
                        Position: positionData,
                        Time: new Date().getTime(),
                    };
                    return script.callReturn();
                }
            },
        },
        hyact_xylobot_set_position_many_block: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: Lang.template.hyact_xylobot_set_position_many_block,
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
            def: {
                params: [
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'hyact_xylobot_set_position_many_block',
            },
            paramsKeyMap: {

                POSITION1: 0,
                POSITION2: 1,
                POSITION3: 2,
            },
            events: {},
            class: 'SetBlock',
            isNotFor: ['hyact_xylobot'],
            func: function(sprite, script) {
                var position1 = script.getNumberValue("POSITION1");
                var position2 = script.getNumberValue("POSITION2");
                var position3 = script.getNumberValue("POSITION3");
                var position1Data = 0;
                var position2Data = 0;
                var position3Data = 0;

                if(position1 > 150) position1 = 150;
                else if(position1 < -150) position1 = -150;
                if(position2 > 150) position2 = 150;
                else if(position2 < -150) position2 = -150;
                if(position3 > 150) position3 = 150;
                else if(position3 < -150) position3 = -150;
                position1 = (position1 * -1) + 150;
                position1Data = Math.floor((1023 * position1) / 300);
                position2 = (position2 * -1) + 150;
                position2Data = Math.floor((1023 * position2) / 300);
                position3 = (position3 * -1) + 150;
                position3Data = Math.floor((1023 * position3) / 300);

                 if(!script.isStart)
                {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.HyACT_Xylobot.removeTimeout(timer);
                    }, Entry.HyACT_Xylobot.delayTime);
                    Entry.HyACT_Xylobot.timeouts.push(timer);
                    return script;

                }
                else if(script.timeFlag == 1)
                {
                    return script;
                }
                else
                {
                    Entry.hw.sendQueue['SEND'] = {};
                    Entry.hw.sendQueue['SEND'][Entry.HyACT_Xylobot.array.SET_POSITION_MANY] = {
                        Position1: position1Data,
                        Position2: position2Data,
                        Position3: position3Data,
                        Time: new Date().getTime(),
                    };
                    return script.callReturn();
                }
            },
        },
        hyact_xylobot_set_speed_block: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: Lang.template.hyact_xylobot_set_speed_block,
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
            def: {
                params: [
                    {
                        type: 'hyact_xylobot_list_aixs_ex_block',
                    },
                    {
                        type: 'number',
                        params: ['100'],
                    },
                    null,
                ],
                type: 'hyact_xylobot_set_speed_block',
            },
            paramsKeyMap: {
                AIXS: 0,
                SPEED: 1,
            },
            events: {},
            class: 'SetBlock',
            isNotFor: ['hyact_xylobot'],
            func: function(sprite, script) {
                var axisData = script.getNumberValue("AIXS");
                var speed = script.getNumberValue("SPEED");
                var speedData = 0;
                
                if(speed >= 100) speed = 0;    // 0 값이 최대 속력
                else if(speed < 0) speed = 1;
                speedData = Math.floor((1023 * speed) / 100);

                if(!script.isStart)
                {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.HyACT_Xylobot.removeTimeout(timer);
                    }, Entry.HyACT_Xylobot.delayTime);
                    Entry.HyACT_Xylobot.timeouts.push(timer);
                    return script;

                }
                else if(script.timeFlag == 1)
                {
                    return script;
                }
                else
                {
                    Entry.hw.sendQueue['SEND'] = {};
                    Entry.hw.sendQueue['SEND'][Entry.HyACT_Xylobot.array.SET_SPEED] = {
                        Axis: axisData,
                        Speed: speedData,
                        Time: new Date().getTime(),
                    };
                    return script.callReturn();
                }
            },
        },
        hyact_xylobot_set_torque_block: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: Lang.template.hyact_xylobot_set_torque_block,
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
            def: {
                params: [
                    {
                        type: 'hyact_xylobot_list_aixs_ex_block',
                    },
                    {
                        type: 'number',
                        params: ['100'],
                    },
                    null,
                ],
                type: 'hyact_xylobot_set_torque_block',
            },
            paramsKeyMap: {
                AIXS: 0,
                TORQUE: 1,
            },
            events: {},
            class: 'SetBlock',
            isNotFor: ['hyact_xylobot'],
            func: function(sprite, script) {
                var axisData = script.getNumberValue("AIXS");
                var torque = script.getNumberValue("TORQUE");
                var torqueData = 0;

                if(torque > 100) torque = 100;
                else if(torque < 0) torque = 0;
                torqueData = Math.floor((1023 * torque) / 100);

                if(!script.isStart)
                {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.HyACT_Xylobot.removeTimeout(timer);
                    }, Entry.HyACT_Xylobot.delayTime);
                    Entry.HyACT_Xylobot.timeouts.push(timer);
                    return script;
                }
                else if(script.timeFlag == 1)
                {
                    return script;
                }
                else
                {
                    Entry.hw.sendQueue['SEND'] = {};
                    Entry.hw.sendQueue['SEND'][Entry.HyACT_Xylobot.array.SET_TORQUE] = {
                        Axis: axisData,
                        Torque: torqueData,
                        Time: new Date().getTime(),
                    };
                    return script.callReturn();
                }
            },
        },
        hyact_xylobot_set_play_note_block: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: Lang.template.hyact_xylobot_set_play_note_block,
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
                        type: 'hyact_xylobot_list_note_block',
                    },
                    null,
                ],
                type: 'hyact_xylobot_set_play_note_block',
            },
            paramsKeyMap: {
                NOTE: 0,
            },
            events: {},
            class: 'SetBlock',
            isNotFor: ['hyact_xylobot'],
            func: function(sprite, script) {
                var noteData = script.getNumberValue("NOTE");

                if(!script.isStart)
                {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.HyACT_Xylobot.removeTimeout(timer);
                    }, Entry.HyACT_Xylobot.delayTime);
                    Entry.HyACT_Xylobot.timeouts.push(timer);
                    return script;

                }
                else if(script.timeFlag == 1)
                {
                    return script;
                }
                else
                {
                    Entry.hw.sendQueue['SEND'] = {};
                    Entry.hw.sendQueue['SEND'][Entry.HyACT_Xylobot.array.SET_PLAY_NOTE] = {
                        Note: noteData,
                        Time: new Date().getTime(),
                    };
                    return script.callReturn();
                }
            },
        },
        hyact_xylobot_set_move_note_block: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: Lang.template.hyact_xylobot_set_move_note_block,
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
            def: {
                params: [
                    {
                        type: 'hyact_xylobot_list_note_block',
                    },
                    {
                        type: 'hyact_xylobot_list_position_block',
                    },
                    null,
                ],
                type: 'hyact_xylobot_set_move_note_block',
            },
            paramsKeyMap: {
                NOTE: 0,
                LOCATION: 1,
            },
            events: {},
            class: 'SetBlock',
            isNotFor: ['hyact_xylobot'],
            func: function(sprite, script) {
                var noteData = script.getNumberValue("NOTE");
                var locationData = script.getNumberValue("LOCATION");

                if(!script.isStart)
                {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.HyACT_Xylobot.removeTimeout(timer);
                    }, Entry.HyACT_Xylobot.delayTime);
                    Entry.HyACT_Xylobot.timeouts.push(timer);
                    return script;
                }
                else if(script.timeFlag == 1)
                {
                    return script;
                }
                else
                {
                    Entry.hw.sendQueue['SEND'] = {};
                    Entry.hw.sendQueue['SEND'][Entry.HyACT_Xylobot.array.SET_MOVE_NOTE] = {
                        Note: noteData,
                        Location: locationData,
                        Time: new Date().getTime(),
                    };
                    return script.callReturn();
                }
            },
        },
        hyact_xylobot_set_move_default_block: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: Lang.template.hyact_xylobot_set_move_default_block,
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            def: {
                params: [
                    null,
                ],
                type: 'hyact_xylobot_set_move_default_block',
            },
            paramsKeyMap: {
            },
            events: {},
            class: 'SetBlock',
            isNotFor: ['hyact_xylobot'],
            func: function(sprite, script) {
                if(!script.isStart)
                {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.HyACT_Xylobot.removeTimeout(timer);
                    }, Entry.HyACT_Xylobot.delayTime);
                    Entry.HyACT_Xylobot.timeouts.push(timer);
                    return script;

                }
                else if(script.timeFlag == 1)
                {
                    return script;
                }
                else
                {
                    Entry.hw.sendQueue['SEND'] = {};
                    Entry.hw.sendQueue['SEND'][Entry.HyACT_Xylobot.array.SET_MOVE_DEFAULT] = {
                        Time: new Date().getTime(),
                    };
                    return script.callReturn();
                }
            },
        },
        //endregion HyACT 하이액트 Xylobot
    };
};

module.exports = Entry.HyACT_Xylobot;