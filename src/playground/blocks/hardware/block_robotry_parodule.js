'use strict';

Entry.Robotry_Parodule = {
    id: ['4B.2'],
    name: 'Robotry_Parodule',
    url: 'http://robotry.co.kr',
    imageName: 'arduinoNano.png',
    title: {
        ko: '파로듈',
        en: 'Parodule',
    },
    setZero() {
        if (!Entry.hw.sendQueue.SET) {
            Entry.hw.sendQueue = {
                SET: {},
                CMD: {},
                GET: {},
            };
        } else {
            const keySet = Object.keys(Entry.hw.sendQueue.SET);
            keySet.forEach((key) => {
                Entry.hw.sendQueue.SET[key].data = 0;
                Entry.hw.sendQueue.SET[key].time = new Date().getTime();
            });
        }
        Entry.hw.update();
    },
    getOffsetX(str) {
        return str.indexOf('\0') * 5 - 10;
    },
    getTerminal(port) {
        return this.Terminal[port];
    },
    setTerminal(port1, port2, port3, port4) {
        this.Terminal = [port1, port2, port3, port4];
    },
    Terminal: ['', '', '', ''],
    moduleType: {
        NONE: 0,
        PIXEL: 1,
        MOTOR: 2,
        BUZZER: 3,
    },
    controlTypes: {
        DIGITAL: 0,
        ANALOG: 1,
        STRING: 2,
    },
    BlockState: {},
};

Entry.Robotry_Parodule.setLanguage = function () {
    return {
        ko: {
            template: {
                Parodule_Input_title: '센서 블럭\0',
                Parodule_Sensor_Data: '%1 센서',
                Parodule_Sensor_Kind: '%1 모듈 종류',

                Parodule_title: '제어 블럭\0',
                Parodule_Set: '세모 : %1 원 : %4 네모 : %2  십자 : %3 으로 설정 %5',
                Parodule_PIXEL: '%1 (으)로 픽셀 설정 %2',
                Parodule_Motor: '%1 의 파워로 %2 %3',
                Parodule_Buzzer: '%1 옥타브 %2 (으)로 재생 %3',

                Parodule_Custom_title: '커스텀 제어 블럭\0',
                Parodule_Custom_PIXEL: '%1 에 연결된 픽셀을 %2 으로 설정 %3',

                Parodule_Custom_Motor: '%1 에 연결된 모터를 %2 의 파워로 %3 %4',
                Parodule_Custom_Buzzer: '%1 에 연결된 부저를 %2 옥타브 %3 (으)로 재생 %4',
                Parodule_Custom_Module_OFF: '%1 에 연결된 모듈 중지 %2',

                Parodule_Update: '파로듈 업데이트 %1',
            },
            Helper: { // 블록 선택시 나타나는 한글 설명

                //Parodule_Update: '파로듈 업데이트',
            },
            Blocks: {
                parodule_triangle: '세모',
                parodule_square: '네모',
                parodule_cross: '십자',
                parodule_circle: '원',
                parodule_light: '빛',
                parodule_sound: '소리',
                parodule_pixel: '픽셀',
                parodule_motor: '모터',
                parodule_buzzer: '부저',
                parodule_none: '없음',
                parodule_unknown: '모름',

                parodule_off: '없음',
                parodule_aura: '아우라',
                parodule_red: '빨강색',
                parodule_vermilion: '주홍색',
                parodule_orange: '주황색',
                parodule_tangerine: '귤색',
                parodule_yellow: '노랑색',
                parodule_green_yellow: '연두색',
                parodule_green: '녹색',
                parodule_blue_green: '청록색',
                parodule_blue: '파랑색',
                parodule_prussian_blue: '감청색',
                parodule_indigo: '남색',
                parodule_blue_violet: '남보라색',
                parodule_purple: '보라색',
                parodule_reddish_purple: '자주색',

                parodule_forward: '정회전',
                parodule_backward: '역회전',
                parodule_left: '좌회전',
                parodule_right: '우회전',

                parodule_silent: '무음',
                parodule_do: '도',
                parodule_do_sharp: '도#(레♭)',
                parodule_re: '레',
                parodule_re_sharp: '레#(미♭)',
                parodule_mi: '미',
                parodule_fa: '파',
                parodule_fa_sharp: '파#(솔♭)',
                parodule_sol: '솔',
                parodule_sol_sharp: '솔#(라♭)',
                parodule_la: '라',
                parodule_la_sharp: '라#(시♭)',
                parodule_si: '시',
            },
        },
        en: {
            template: {
                Parodule_Input_title: 'Sensor Block\0',
                Parodule_Sensor_Data: 'Sensor values ​of %1',
                Parodule_Sensor_Kind: 'kind of %1 ?',

                Parodule_title: 'Controll Block\0',
                Parodule_Set: 'Set to triangle : %1 circle : %4 square : %2  cross : %3 %5',
                Parodule_PIXEL: 'Set pixel to %1 %2',
                Parodule_Motor: '%2 with power and move %1 %3',
                Parodule_Buzzer: 'Play %1 octave %2 %3',

                Parodule_Custom_title: 'Custom Control Block\0',
                Parodule_Custom_PIXEL: 'Set pixels of  %1 to %2 %3',
                Parodule_Custom_Motor: 'Set the motor of  %1 to %2 power and move %3 %4',
                Parodule_Custom_Buzzer: 'Play the buzzer of  %1 in %2 octave %3 %4',
                Parodule_Custom_Module_OFF: 'Stop module of  %1 %2',

                Parodule_Update: '파로듈 업데이트 %1',
            },
            Helper: {

                //Parodule_Update: '파로듈 업데이트',
            },
            Blocks: {
                parodule_triangle: 'triangle',
                parodule_square: 'square',
                parodule_cross: 'cross',
                parodule_circle: 'circle',
                parodule_light: 'light',
                parodule_sound: 'sound',
                parodule_pixel: 'pixel',
                parodule_motor: 'motor',
                parodule_buzzer: 'buzzer',
                parodule_none: 'none',
                parodule_unknown: 'unknown',

                parodule_off: 'off',
                parodule_aura: 'aura',
                parodule_red: 'red',
                parodule_vermilion: 'vermilion',
                parodule_orange: 'orange',
                parodule_tangerine: 'tangerine',
                parodule_yellow: 'yellow',
                parodule_green_yellow: 'green yellow',
                parodule_green: 'green',
                parodule_blue_green: 'blue green',
                parodule_blue: 'blue',
                parodule_prussian_blue: 'prussian blue',
                parodule_indigo: 'indigo',
                parodule_blue_violet: 'blue violet',
                parodule_purple: 'purple',
                parodule_reddish_purple: 'reddish purple',

                parodule_forward: 'forward',
                parodule_backward: 'backward',
                parodule_left: 'left',
                parodule_right: 'right',

                parodule_silent: 'Silent',
                parodule_do: 'C',
                parodule_do_sharp: 'C#(D♭)',
                parodule_re: 'D',
                parodule_re_sharp: 'D#(E♭)',
                parodule_mi: 'E',
                parodule_fa: 'F',
                parodule_fa_sharp: 'F#(G♭)',
                parodule_sol: 'G',
                parodule_sol_sharp: 'G#(A♭)',
                parodule_la: 'A',
                parodule_la_sharp: 'A#(B♭)',
                parodule_si: 'B',
            },
        },
    };
};

Entry.Robotry_Parodule.monitorTemplate = function () {

    return {

        imgPath: 'hw/robotry_parodule.png',
        width: 500,
        height: 500,
        listPorts: {
        },
        ports: {
            MODULE1: {
                name: Lang.Blocks.parodule_triangle,
                type: 'input',
                pos: { x: [140], y: [100] },
            },
            MODULE2: {
                name: Lang.Blocks.parodule_square,
                type: 'input',
                pos: { x: [140], y: [500 - 100] },
            },
            MODULE3: {
                name: Lang.Blocks.parodule_cross,
                type: 'input',
                pos: { x: [500 - 140], y: [500 - 100] },
            },
            MODULE4: {
                name: Lang.Blocks.parodule_circle,
                type: 'input',
                pos: { x: [500 - 140], y: [100] },
            },
        },
        mode: 'both',

    }
},

    // 블록의 배치 순서
    Entry.Robotry_Parodule.blockMenuBlocks = [
        'Parodule_Input_title',
        //'Parodule_Sensor_Data', // 센서 모듈은 아직 출시 예정 없음
        'Parodule_Sensor_Kind',

        'Parodule_title',
        'Parodule_Set',
        'Parodule_PIXEL',
        'Parodule_Motor',
        'Parodule_Buzzer',

        'Parodule_Custom_title',
        'Parodule_Custom_PIXEL',
        'Parodule_Custom_Motor',
        'Parodule_Custom_Buzzer',
        'Parodule_Custom_Module_OFF',

        //'Parodule_Update',
    ];

/* 
 *  로보트리의 아두이노 제어 블록 리스트
 *  주석에 블록이라고 표시된것만 제어 블록임 나머진 포트 리스트
 */
Entry.Robotry_Parodule.getBlocks = function () {
    return {
        /* Parodule_Custom_List Start */
        Parodule_Custom_Port_List: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.parodule_triangle, 0], // 0
                        [Lang.Blocks.parodule_circle, 1], // 3
                        [Lang.Blocks.parodule_square, 2], // 1
                        [Lang.Blocks.parodule_cross, 3], // 2
                    ],
                    value: [0],
                    fontSize: 12,
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
            func(sprite, script) {
                const port = script.getNumberValue('PORT');
                return port;
            },
            syntax: {
                js: [],
                py: [{
                    syntax: '%1',
                    textParams: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.parodule_triangle, 0], // 0
                                [Lang.Blocks.parodule_circle, 1], // 3
                                [Lang.Blocks.parodule_square, 2], // 1
                                [Lang.Blocks.parodule_cross, 3], // 2
                            ],
                            value: [0],
                            fontSize: 12,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    keyOption: 'Parodule_Custom_Port_List',
                }],
            },
        },

        Parodule_Module_List: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.parodule_none, Entry.Robotry_Parodule.moduleType.NONE],
                        [Lang.Blocks.parodule_pixel, Entry.Robotry_Parodule.moduleType.PIXEL],
                        [Lang.Blocks.parodule_motor, Entry.Robotry_Parodule.moduleType.MOTOR],
                        [Lang.Blocks.parodule_buzzer, Entry.Robotry_Parodule.moduleType.BUZZER],
                    ],
                    value: Entry.Robotry_Parodule.moduleType.NONE,
                    fontSize: 12,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                MODULE: 0,
            },
            func(sprite, script) {
                const module = script.getNumberValue('MODULE');
                return module;
            },
            syntax: {
                js: [],
                py: [{
                    syntax: '%1',
                    textParams: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.parodule_none, Entry.Robotry_Parodule.moduleType.NONE],
                                [Lang.Blocks.parodule_pixel, Entry.Robotry_Parodule.moduleType.PIXEL],
                                [Lang.Blocks.parodule_motor, Entry.Robotry_Parodule.moduleType.MOTOR],
                                [Lang.Blocks.parodule_buzzer, Entry.Robotry_Parodule.moduleType.BUZZER],
                            ],
                            value: Entry.Robotry_Parodule.moduleType.NONE,
                            fontSize: 12,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    keyOption: 'Parodule_Module_List',
                }],
            },
        },

        Parodule_Custom_PIXEL_List: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.parodule_off, 0],//200
                        [Lang.Blocks.parodule_aura, 1],//18
                        [Lang.Blocks.parodule_red, 2],//19
                        [Lang.Blocks.parodule_vermilion, 3],//20
                        [Lang.Blocks.parodule_orange, 4],//21
                        [Lang.Blocks.parodule_tangerine, 5],//22
                        [Lang.Blocks.parodule_yellow, 6],//23
                        [Lang.Blocks.parodule_green_yellow, 7],//24
                        [Lang.Blocks.parodule_green, 8],//25
                        [Lang.Blocks.parodule_blue_green, 9],//26
                        [Lang.Blocks.parodule_blue, 10],//27
                        [Lang.Blocks.parodule_prussian_blue, 11],//28
                        [Lang.Blocks.parodule_indigo, 12],//29
                        [Lang.Blocks.parodule_blue_violet, 13],//30
                        [Lang.Blocks.parodule_purple, 14],//31
                        [Lang.Blocks.parodule_reddish_purple, 15],//32
                    ],
                    value: [0],
                    fontSize: 12,
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
            func(sprite, script) {
                const color = script.getNumberValue('COLOR');
                return color;
            },
            syntax: {
                js: [],
                py: [{
                    syntax: '%1',
                    textParams: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.parodule_off, 0],//200
                                [Lang.Blocks.parodule_aura, 1],//18
                                [Lang.Blocks.parodule_red, 2],//19
                                [Lang.Blocks.parodule_vermilion, 3],//20
                                [Lang.Blocks.parodule_orange, 4],//21
                                [Lang.Blocks.parodule_tangerine, 5],//22
                                [Lang.Blocks.parodule_yellow, 6],//23
                                [Lang.Blocks.parodule_green_yellow, 7],//24
                                [Lang.Blocks.parodule_green, 8],//25
                                [Lang.Blocks.parodule_blue_green, 9],//26
                                [Lang.Blocks.parodule_blue, 10],//27
                                [Lang.Blocks.parodule_prussian_blue, 11],//28
                                [Lang.Blocks.parodule_indigo, 12],//29
                                [Lang.Blocks.parodule_blue_violet, 13],//30
                                [Lang.Blocks.parodule_purple, 14],//31
                                [Lang.Blocks.parodule_reddish_purple, 15],//32
                            ],
                            value: [0],
                            fontSize: 12,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    keyOption: 'Parodule_Custom_PIXEL_List',
                }],
            },
        },

        Parodule_Custom_Motor_List: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['100%', 100], // 39
                        ['75%', 75], // 38
                        ['50%', 50], // 37
                        ['25%', 25],// 36
                        ['0%', 0],  // 200
                    ],
                    value: [0],
                    fontSize: 12,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                POWER: 0,
            },
            func(sprite, script) {
                const power = script.getNumberValue('POWER');
                return power;
            },
            syntax: {
                js: [],
                py: [{
                    syntax: '%1',
                    textParams: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['100%', 100], // 39
                                ['75%', 75], // 38
                                ['50%', 50], // 37
                                ['25%', 25],// 36
                                ['0%', 0],  // 200
                            ],
                            value: [100],
                            fontSize: 12,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    keyOption: 'Parodule_Custom_Motor_List',
                }],
            },
        },

        Parodule_Motor_Sign: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.parodule_forward, 0],
                        [Lang.Blocks.parodule_backward, 1],
                        [Lang.Blocks.parodule_left, 2],
                        [Lang.Blocks.parodule_right, 3],
                    ],
                    value: [0],
                    fontSize: 12,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                SIGN: 0,
            },
            func(sprite, script) {
                const sign = script.getNumberValue('SIGN');
                return sign;
            },
            syntax: {
                js: [],
                py: [{
                    syntax: '%1',
                    textParams: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.parodule_forward, 0],
                                [Lang.Blocks.parodule_backward, 1],
                                [Lang.Blocks.parodule_left, 2],
                                [Lang.Blocks.parodule_right, 3],
                            ],
                            value: [0],
                            fontSize: 12,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    keyOption: 'Parodule_Custom_Motor_Sign',
                }],
            },
        },

        Parodule_Custom_Motor_Sign: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.parodule_forward, 0], // 0
                        [Lang.Blocks.parodule_backward, 1], // 4
                    ],
                    value: [0],
                    fontSize: 12,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                SIGN: 0,
            },
            func(sprite, script) {
                const sign = script.getNumberValue('SIGN');
                return sign;
            },
            syntax: {
                js: [],
                py: [{
                    syntax: '%1',
                    textParams: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.parodule_forward, 0], // 0
                                [Lang.Blocks.parodule_backward, 1], // 4
                            ],
                            value: [0],
                            fontSize: 12,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    keyOption: 'Parodule_Custom_Motor_Sign',
                }],
            },
        },

        Parodule_Custom_Octaves_List: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['3', 3], // 0
                        ['4', 4], //12
                        ['5', 5], //24
                        ['6', 6], //36
                    ],
                    value: [0],
                    fontSize: 12,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                OCTAVE: 0,
            },
            func(sprite, script) {
                const octave = script.getNumberValue('OCTAVE');
                return octave;
            },
            syntax: {
                js: [],
                py: [{
                    syntax: '%1',
                    textParams: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['3', 3], // 0
                                ['4', 4], //12
                                ['5', 5], //24
                                ['6', 6], //36
                            ],
                            value: [3],
                            fontSize: 12,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    keyOption: 'Parodule_Custom_Octaves_List',
                }],
            },
        },

        Parodule_Custom_Tone_List: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.parodule_silent, 0], // 200
                        [Lang.Blocks.parodule_do, 1],// 47
                        [Lang.Blocks.parodule_do_sharp, 2], // 48
                        [Lang.Blocks.parodule_re, 3], // 49
                        [Lang.Blocks.parodule_re_sharp, 4], // 50
                        [Lang.Blocks.parodule_mi, 5], // 51
                        [Lang.Blocks.parodule_fa, 6], //52
                        [Lang.Blocks.parodule_fa_sharp, 7],  //53
                        [Lang.Blocks.parodule_sol, 8],  //54
                        [Lang.Blocks.parodule_sol_sharp, 9],  //55
                        [Lang.Blocks.parodule_la, 10],  //56
                        [Lang.Blocks.parodule_la_sharp, 11],  //57
                        [Lang.Blocks.parodule_si, 12],  //58
                    ],
                    value: [0],
                    fontSize: 12,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                TONE: 0,
            },
            func(sprite, script) {
                const tone = script.getNumberValue('TONE');
                return tone;
            },
            syntax: {
                js: [],
                py: [{
                    syntax: '%1',
                    textParams: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.parodule_silent, 0], // 200
                                [Lang.Blocks.parodule_do, 1],// 47
                                [Lang.Blocks.parodule_do_sharp, 2], // 48
                                [Lang.Blocks.parodule_re, 3], // 49
                                [Lang.Blocks.parodule_re_sharp, 4], // 50
                                [Lang.Blocks.parodule_mi, 5], // 51
                                [Lang.Blocks.parodule_fa, 6], //52
                                [Lang.Blocks.parodule_fa_sharp, 7],  //53
                                [Lang.Blocks.parodule_sol, 8],  //54
                                [Lang.Blocks.parodule_sol_sharp, 9],  //55
                                [Lang.Blocks.parodule_la, 10],  //56
                                [Lang.Blocks.parodule_la_sharp, 11],  //57
                                [Lang.Blocks.parodule_si, 12],  //58
                            ],
                            value: [0],
                            fontSize: 12,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    keyOption: 'Parodule_Custom_Tone_List',
                }],
            },
        },
        /* Parodule_Custom_List End */

        Parodule_Input_title: {
            skeleton: 'basic_text',
            skeletonOptions: {
                box: {
                    offsetX: Entry.Robotry_Parodule.getOffsetX(Lang.template.Parodule_Input_title),
                },
            },
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: EntryStatic.colorSet.common.TEXT,
            params: [
                {
                    type: 'Text',
                    text: Lang.template.Parodule_Input_title,
                    color: EntryStatic.colorSet.common.TEXT,
                    align: 'left',
                },
            ],
            def: {
                type: 'Parodule_Input_title',
            },
            class: 'TITLE',
            isNotFor: ['Robotry_Parodule'],
            events: {},
        },

        Parodule_Sensor_Data: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
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
                        type: 'Parodule_Custom_Port_List',
                        params: [0],
                    }
                ],
                type: 'Parodule_Sensor_Data',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'Get',
            isNotFor: ['Robotry_Parodule'],
            func(sprite, script) {
                const port = script.getNumberValue('PORT');
                const sensor_data = Entry.hw.portData.SENSOR
                let value = false;
                if (sensor_data[port] === 48) {
                    value = false;
                }
                else if (sensor_data[port] === 49) {
                    value = true;
                }
                return value;
            },
            syntax: {
                js: [],
                py: [],
            },
        },

        Parodule_Sensor_Kind: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
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
                        type: 'Parodule_Custom_Port_List',
                        params: [0],
                    }
                ],
                type: 'Parodule_Sensor_Kind',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'Get',
            isNotFor: ['Robotry_Parodule'],
            func(sprite, script) {
                const UNKNOWN = 207;
                const NONE = 208;
                const PIXEL = 209;
                const MOTOR = 210;
                const BUZZER = 211;
                const port = script.getNumberValue('PORT') % 4;
                const module_data = Entry.hw.portData.MODULE;
                let correction_port = port === 1 ? 3 : port === 2 ? 1 : port === 3 ? 2 : 0;
                let value = "";

                if (module_data[correction_port] === PIXEL) {
                    value = [Lang.Blocks.parodule_pixel];
                }
                else if (module_data[correction_port] === MOTOR) {
                    value = [Lang.Blocks.parodule_motor];
                }
                else if (module_data[correction_port] === BUZZER) {
                    value = [Lang.Blocks.parodule_buzzer];
                }
                else if (module_data[correction_port] === NONE) {
                    value = [Lang.Blocks.parodule_none];
                }
                else if (module_data[correction_port] == UNKNOWN) {
                    value = [Lang.Blocks.parodule_unknown];
                }
                return value;
            },
            syntax: {
                js: [],
                py: [{
                    syntax: 'Parodule.get_Module(%1)',
                    blockType: 'param',
                    replaceBlockType: 'Parodule_Sensor_Kind',
                    textParams: [
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                    ],
                }],
            },
        },

        Parodule_title: {
            skeleton: 'basic_text',
            skeletonOptions: {
                box: {
                    offsetX: Entry.Robotry_Parodule.getOffsetX(Lang.template.Parodule_title),
                },
            },
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: EntryStatic.colorSet.common.TEXT,
            params: [
                {
                    type: 'Text',
                    text: Lang.template.Parodule_title,
                    color: EntryStatic.colorSet.common.TEXT,
                    align: 'left',
                },
            ],
            def: {
                type: 'Parodule_title',
            },
            class: 'TITLE',
            isNotFor: ['Robotry_Parodule'],
            events: {},
        },

        /* Paroduel Set Start */
        Parodule_Set: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                }
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'Parodule_Module_List',
                        params: [Entry.Robotry_Parodule.moduleType.PIXEL],
                    },
                    {
                        type: 'Parodule_Module_List',
                        params: [Entry.Robotry_Parodule.moduleType.MOTOR],
                    },
                    {
                        type: 'Parodule_Module_List',
                        params: [Entry.Robotry_Parodule.moduleType.MOTOR],
                    },
                    {
                        type: 'Parodule_Module_List',
                        params: [Entry.Robotry_Parodule.moduleType.BUZZER],
                    },
                ],
                type: 'Parodule_Set',
            },
            paramsKeyMap: {
                PORT1: 0,
                PORT2: 1,
                PORT3: 2,
                PORT4: 3,
            },
            class: 'SET',
            isNotFor: ['Robotry_Parodule'],
            func(sprite, script) {
                const port1 = script.getNumberValue('PORT1'); // 1번 모터
                const port2 = script.getNumberValue('PORT2'); // 1번 모터
                const port3 = script.getNumberValue('PORT3'); // 1번 모터
                const port4 = script.getNumberValue('PORT4'); // 1번 모터
                //let port4 = script.getField('PORT4', script); // 1번 모터
                Entry.Robotry_Parodule.setTerminal(port1, port2, port3, port4);
            },
            syntax: {
                js: [],
                py: [{
                    syntax: 'Parodule.set_Port(%1, %2, %3, %4)',
                    textParams: [
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                    ],
                }],
            }
        },
        /* Paroduel Set Start */

        /* Paroduel PIXEL Start */
        Parodule_PIXEL: {
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
                    img: 'block_icon/hardware_led.svg',
                    size: 12,
                }
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'Parodule_Custom_PIXEL_List',
                        params: [2],
                    },
                ],
                type: 'Parodule_PIXEL',
            },
            paramsKeyMap: {
                COLOR: 0
            },
            class: 'SET',
            isNotFor: ['Robotry_Parodule'],
            func(sprite, script) {
                const color = script.getNumberValue('COLOR');
                let correction_color = !color ? 200 : color + 17;
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                for (let i = 0; i < 4; i++) {
                    if (Entry.Robotry_Parodule.getTerminal(i) === Entry.Robotry_Parodule.moduleType.PIXEL) {
                        Entry.hw.sendQueue.SET[i] = {
                            type: Entry.Robotry_Parodule.controlTypes.DIGITAL,
                            data: correction_color,
                            time: new Date().getTime(),
                        }
                    }
                }
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [{
                    syntax: 'Parodule.set_Pixel(%1)',
                    textParams: [
                        {
                            type: 'Block',
                            accept: 'string',
                        }
                    ],
                }],
            }
        },
        /* Parodule PIXEL End */

        /* Paroduel Motor Start */
        Parodule_Motor: {
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
                    img: 'block_icon/hardware_dc.svg',
                    size: 12,
                }
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'Parodule_Custom_Motor_List',
                        params: [100],
                    },
                    {
                        type: 'Parodule_Motor_Sign',
                        params: [0],
                    }
                ],
                type: 'Parodule_Motor',
            },
            paramsKeyMap: {
                POWER: 0,
                SIGNED: 1,
            },
            class: 'SET',
            isNotFor: ['Robotry_Parodule'],
            func(sprite, script) {
                const power = script.getNumberValue('POWER');
                const sign = script.getNumberValue('SIGNED') % 4;
                let correction_power = power === 100 ? 39 : power === 75 ? 38 : power === 50 ? 37 : power === 25 ? 36 : 200;
                let normal = 0;
                let shift = 4; // 회전 반향 반전
                let motorR = 0;
                let motorL = 0;

                if (sign === 0) {
                    motorR = normal;
                    motorL = shift;
                }
                else if (sign === 1) {
                    motorR = shift;
                    motorL = normal;
                }
                else if (sign === 2) {
                    motorR = normal;
                    motorL = normal;
                }
                else if (sign === 3) {
                    motorR = shift;
                    motorL = shift;
                }
                else { }

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }

                if (correction_power === 200) {
                    motorR = 0;
                    motorL = 0;
                }

                for (let i = 0; i < 4; i++) {
                    if (Entry.Robotry_Parodule.getTerminal(i) === Entry.Robotry_Parodule.moduleType.MOTOR) {
                        if (i === 0 || i === 1) {
                            Entry.hw.sendQueue.SET[i] = {
                                type: Entry.Robotry_Parodule.controlTypes.DIGITAL,
                                data: motorR + correction_power,
                                time: new Date().getTime(),
                            }
                        }
                        else if (i === 2 || i === 3) {
                            Entry.hw.sendQueue.SET[i] = {
                                type: Entry.Robotry_Parodule.controlTypes.DIGITAL,
                                data: motorL + correction_power,
                                time: new Date().getTime(),
                            }
                        }
                        else { }

                    }
                }
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [{
                    syntax: 'Parodule.set_Motor(%1, %2)',
                    textParams: [
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        }
                    ],
                }],
            }
        },
        /* Parodule Motor End */

        /* Paroduel Buzzer Start */
        Parodule_Buzzer: {
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
                    img: 'block_icon/hardware_bzr2.svg',
                    size: 12,
                }
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'Parodule_Custom_Octaves_List',
                        params: ['3'],
                    },
                    {
                        type: 'Parodule_Custom_Tone_List',
                        params: ['0'],
                    },
                ],
                type: 'Parodule_Buzzer',
            },
            paramsKeyMap: {
                OCTAVE: 0,
                TONE: 1
            },
            class: 'SET',
            isNotFor: ['Robotry_Parodule'],
            func(sprite, script) {
                const octave = (script.getNumberValue('OCTAVE') - 3) % 4;
                const tone = script.getNumberValue('TONE') % 12;
                let correction_octave = octave * 12;
                let correction_tone = tone ? tone + 46 : 200;

                if (correction_tone === 200) {
                    correction_octave = 0;
                }
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                for (let i = 0; i < 4; i++) {
                    if (Entry.Robotry_Parodule.getTerminal(i) === Entry.Robotry_Parodule.moduleType.BUZZER) {
                        Entry.hw.sendQueue.SET[i] = {
                            type: Entry.Robotry_Parodule.controlTypes.DIGITAL,
                            data: correction_octave + correction_tone,
                            time: new Date().getTime(),
                        }
                    }
                }
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [{
                    syntax: 'Parodule.set_Buzzer(%1, %2)',
                    textParams: [
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        }
                    ],
                }],
            }
        },
        /* Parodule Buzzer End */


        Parodule_Custom_title: {
            skeleton: 'basic_text',
            skeletonOptions: {
                box: {
                    offsetX: Entry.Robotry_Parodule.getOffsetX(Lang.template.Parodule_Custom_title),
                },
            },
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: EntryStatic.colorSet.common.TEXT,
            params: [
                {
                    type: 'Text',
                    text: Lang.template.Parodule_Custom_title,
                    color: EntryStatic.colorSet.common.TEXT,
                    align: 'left',
                },
            ],
            def: {
                type: 'Parodule_Custom_title',
            },
            class: 'TITLE',
            isNotFor: ['Robotry_Parodule'],
            events: {},
        },



        /* Paroduel Custom PIXEL Start */
        Parodule_Custom_PIXEL: {
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
                    img: 'block_icon/hardware_led.svg',
                    size: 12,
                }
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'Parodule_Custom_Port_List',
                        params: ['0'],
                    },
                    {
                        type: 'Parodule_Custom_PIXEL_List',
                        params: ['2'],
                    }
                ],
                type: 'Parodule_Custom_PIXEL',
            },
            paramsKeyMap: {
                PORT: 0,
                COLOR: 1
            },
            class: 'SET',
            isNotFor: ['Robotry_Parodule'],
            func(sprite, script) {
                const port = script.getNumberValue('PORT') % 4;
                const color = script.getNumberValue('COLOR') % 14;
                let correction_port = port === 1 ? 3 : port === 2 ? 1 : port === 3 ? 2 : 0;
                let correction_color = !color ? 200 : color + 17;

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[correction_port] = {
                    type: Entry.Robotry_Parodule.controlTypes.DIGITAL,
                    data: correction_color,
                    time: new Date().getTime(),
                }
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [{
                    syntax: 'Parodule.set_Custom_Pixel(%1, %2)',
                    textParams: [
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                    ],
                },],
            }
        },
        /* Parodule Custom PIXEL End */



        /* Paroduel Custom Motor Start */
        Parodule_Custom_Motor: {
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
                    img: 'block_icon/hardware_dc.svg',
                    size: 12,
                }
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'Parodule_Custom_Port_List',
                        params: [0],
                    },
                    {
                        type: 'Parodule_Custom_Motor_List',
                        params: [100],
                    },
                    {
                        type: 'Parodule_Custom_Motor_Sign',
                        params: [0],
                    }
                ],
                type: 'Parodule_Custom_Motor',
            },
            paramsKeyMap: {
                PORT: 0,
                POWER: 1,
                SIGNED: 2,

            },
            class: 'SET',
            isNotFor: ['Robotry_Parodule'],
            func(sprite, script) {
                const port = script.getNumberValue('PORT') % 4;
                const power = script.getNumberValue('POWER');
                const sign = script.getNumberValue('SIGNED') % 2;
                let correction_port = port === 1 ? 3 : port === 2 ? 1 : port === 3 ? 2 : 0;
                let correction_power = power === 100 ? 39 : power === 75 ? 38 : power === 50 ? 37 : power === 25 ? 36 : 200;
                let correction_sign = sign ? 4 : 0;

                if (correction_power === 200) {
                    correction_sign = 0;
                }

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[correction_port] = {
                    type: Entry.Robotry_Parodule.controlTypes.DIGITAL,
                    data: correction_power + correction_sign,
                    time: new Date().getTime(),
                }
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [{
                    syntax: 'Parodule.set_Custom_Motor(%1, %2, %3)',
                    textParams: [
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                    ],
                }],
            }
        },
        /* Parodule Custom Motor End */

        /* Paroduel Custom Buzzer Start */
        Parodule_Custom_Buzzer: {
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
                    img: 'block_icon/hardware_bzr2.svg',
                    size: 12,
                }
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'Parodule_Custom_Port_List',
                        params: ['0'],
                    },
                    {
                        type: 'Parodule_Custom_Octaves_List',
                        params: ['3'],
                    },
                    {
                        type: 'Parodule_Custom_Tone_List',
                        params: ['0'],
                    },
                ],
                type: 'Parodule_Custom_Buzzer',
            },
            paramsKeyMap: {
                PORT: 0,
                OCTAVE: 1,
                TONE: 2
            },
            class: 'SET',
            isNotFor: ['Robotry_Parodule'],
            func(sprite, script) {
                const port = script.getNumberValue('PORT') % 4;
                const octave = (script.getNumberValue('OCTAVE') - 3) % 4;
                const tone = script.getNumberValue('TONE') % 12;
                let correction_port = port === 1 ? 3 : port === 2 ? 1 : port === 3 ? 2 : 0;
                let correction_octave = octave * 12;
                let correction_tone = tone ? tone + 46 : 200;

                if (correction_tone === 200) {
                    correction_octave = 0;
                }

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[correction_port] = {
                    type: Entry.Robotry_Parodule.controlTypes.DIGITAL,
                    data: correction_octave + correction_tone,
                    time: new Date().getTime(),
                }
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [{
                    syntax: 'Parodule.set_Custom_Buzzer(%1, %2, %3)',
                    textParams: [
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                    ],
                }],
            }
        },
        /* Parodule Custom Buzzer End */

        /* Paroduel Custom Module Off Start */
        Parodule_Custom_Module_OFF: {
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
                }
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'Parodule_Custom_Port_List',
                        params: ['0'],
                    }
                ],
                type: 'Parodule_Custom_Module_OFF',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'SET',
            isNotFor: ['Robotry_Parodule'],
            func(sprite, script) {
                const port = script.getNumberValue('PORT') % 4;
                const value = 200; // 끄기
                let correction_port = port === 1 ? 3 : port === 2 ? 1 : port === 3 ? 2 : 0;

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[correction_port] = {
                    type: Entry.Robotry_Parodule.controlTypes.DIGITAL,
                    data: value,
                    time: new Date().getTime(),
                }
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [{
                    syntax: 'Parodule.set_Stop(%1)',
                    textParams: [
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                    ],
                }],
            }
        },
        /* Parodule Custom Module Off End */

        /* Parodule Upadate Start */
        Parodule_Update: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                }
            ],
            events: {},
            def: {
                params: [],
                type: 'Parodule_Update',
            },
            paramsKeyMap: {},
            class: 'CMD',
            isNotFor: ['Robotry_Parodule'],
            func(sprite, script) {
                const update = "update\r\n";
                if (!Entry.hw.sendQueue.CMD) {
                    Entry.hw.sendQueue.CMD = {};
                }
                Entry.hw.sendQueue.CMD = {
                    type: Entry.Robotry_Parodule.controlTypes.STRING,
                    data: update,
                    time: new Date().getTime(),
                }
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [],
            }
        },
        /* Parodule Update END */
    };
};


module.exports = Entry.Robotry_Parodule;