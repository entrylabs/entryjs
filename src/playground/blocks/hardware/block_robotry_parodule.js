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
                    type: 'Dropdown',
                    options: [
                        [[Lang.Blocks.parodule_triangle], 0],
                        [[Lang.Blocks.parodule_circle], 3],
                        [[Lang.Blocks.parodule_square], 1],
                        [[Lang.Blocks.parodule_cross], 2],
                    ],
                    value: [0],
                    fontSize: 12,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
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
                    type: 'Dropdown',
                    options: [
                        [[Lang.Blocks.parodule_triangle], 0],
                        [[Lang.Blocks.parodule_circle], 3],
                        [[Lang.Blocks.parodule_square], 1],
                        [[Lang.Blocks.parodule_cross], 2],
                    ],
                    value: [0],
                    fontSize: 12,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
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
                const port = script.getNumberValue('PORT');
                const module_data = Entry.hw.portData.MODULE;
                let value = "";
                if (module_data[port] === PIXEL) {
                    value = [Lang.Blocks.parodule_pixel];
                }
                else if (module_data[port] === MOTOR) {
                    value = [Lang.Blocks.parodule_motor];
                }
                else if (module_data[port] === BUZZER) {
                    value = [Lang.Blocks.parodule_buzzer];
                }
                else if (module_data[port] === NONE) {
                    value = [Lang.Blocks.parodule_none];
                }
                else if (module_data[port] == UNKNOWN) {
                    value = [Lang.Blocks.parodule_unknown];
                }
                return value;
            },
            syntax: {
                js: [],
                py: [],
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
                    type: 'Dropdown',
                    options: [
                        [[Lang.Blocks.parodule_none], 'NONE'],
                        [[Lang.Blocks.parodule_pixel], 'PIXEL'],
                        [[Lang.Blocks.parodule_motor], 'MOTOR'],
                        [[Lang.Blocks.parodule_buzzer], 'BUZZER'],
                    ],
                    value: 'PIXEL',
                    fontSize: 12,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [[Lang.Blocks.parodule_none], 'NONE'],
                        [[Lang.Blocks.parodule_pixel], 'PIXEL'],
                        [[Lang.Blocks.parodule_motor], 'MOTOR'],
                        [[Lang.Blocks.parodule_buzzer], 'BUZZER'],
                    ],
                    value: 'MOTOR',
                    fontSize: 12,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [[Lang.Blocks.parodule_none], 'NONE'],
                        [[Lang.Blocks.parodule_pixel], 'PIXEL'],
                        [[Lang.Blocks.parodule_motor], 'MOTOR'],
                        [[Lang.Blocks.parodule_buzzer], 'BUZZER'],
                    ],
                    value: 'MOTOR',
                    fontSize: 12,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [[Lang.Blocks.parodule_none], 'NONE'],
                        [[Lang.Blocks.parodule_pixel], 'PIXEL'],
                        [[Lang.Blocks.parodule_motor], 'MOTOR'],
                        [[Lang.Blocks.parodule_buzzer], 'BUZZER'],
                    ],
                    value: 'BUZZER',
                    fontSize: 12,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                }
            ],
            events: {},
            def: {
                params: [],
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
                var port1 = script.getField('PORT1', script); // 1번 모터
                var port2 = script.getField('PORT2', script); // 1번 모터
                var port3 = script.getField('PORT3', script); // 1번 모터
                var port4 = script.getField('PORT4', script); // 1번 모터
                Entry.Robotry_Parodule.setTerminal(port1, port2, port3, port4);
            },
            syntax: {
                js: [],
                py: [],
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
                    type: 'Dropdown',
                    options: [
                        [[Lang.Blocks.parodule_off], 200],
                        [[Lang.Blocks.parodule_aura], 18],
                        [[Lang.Blocks.parodule_red], 19],
                        [[Lang.Blocks.parodule_vermilion], 20],
                        [[Lang.Blocks.parodule_orange], 21],
                        [[Lang.Blocks.parodule_tangerine], 22],
                        [[Lang.Blocks.parodule_yellow], 23],
                        [[Lang.Blocks.parodule_green_yellow], 24],
                        [[Lang.Blocks.parodule_green], 25],
                        [[Lang.Blocks.parodule_blue_green], 26],
                        [[Lang.Blocks.parodule_blue], 27],
                        [[Lang.Blocks.parodule_prussian_blue], 28],
                        [[Lang.Blocks.parodule_indigo], 29],
                        [[Lang.Blocks.parodule_blue_violet], 30],
                        [[Lang.Blocks.parodule_purple], 31],
                        [[Lang.Blocks.parodule_reddish_purple], 32],
                    ],
                    value: [19],
                    fontSize: 12,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_led.svg',
                    size: 12,
                }
            ],
            events: {},
            def: {
                params: [],
                type: 'Parodule_PIXEL',
            },
            paramsKeyMap: {
                VALUE: 0
            },
            class: 'SET',
            isNotFor: ['Robotry_Parodule'],
            func(sprite, script) {
                const value = script.getNumberValue('VALUE');
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                for (var i = 0; i < 4; i++) {
                    if (Entry.Robotry_Parodule.getTerminal(i) === 'PIXEL') {
                        Entry.hw.sendQueue.SET[i] = {
                            type: Entry.Robotry_Parodule.controlTypes.DIGITAL,
                            data: value,
                            time: new Date().getTime(),
                        }
                    }
                }
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [],
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
                    type: 'Dropdown',
                    options: [
                        ['100%', 39],
                        ['75%', 38],
                        ['50%', 37],
                        ['25%', 36],
                        ['0%', 200],
                    ],
                    value: [39],
                    fontSize: 12,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [[Lang.Blocks.parodule_forward], 0],
                        [[Lang.Blocks.parodule_backward], 1],
                        [[Lang.Blocks.parodule_left], 2],
                        [[Lang.Blocks.parodule_right], 3],
                    ],
                    value: [0],
                    fontSize: 12,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_dc.svg',
                    size: 12,
                }
            ],
            events: {},
            def: {
                params: [],
                type: 'Parodule_Motor',
            },
            paramsKeyMap: {
                VALUE: 0,
                STATE: 1,
            },
            class: 'SET',
            isNotFor: ['Robotry_Parodule'],
            func(sprite, script) {
                const value = script.getNumberValue('VALUE');
                var state = script.getNumberValue('STATE');
                var normal = 0;
                var shift = 4; // 회전 반향 반전
                var motor1 = 0;
                var motor2 = 0;
                if (state === 0) {
                    motor1 = 0;
                    motor2 = 0;
                }
                else if (state === 1) {
                    motor1 = shift;
                    motor2 = shift;
                }
                else if (state === 2) {
                    motor1 = normal;
                    motor2 = shift;
                }
                else if (state === 3) {
                    motor1 = shift;
                    motor2 = normal;
                }
                else { }

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }

                if (value === 200) {
                    motor1 = 0;
                    motor2 = 0;
                }

                for (var i = 0; i < 4; i++) {
                    if (Entry.Robotry_Parodule.getTerminal(i) === 'MOTOR') {
                        if (i === 0 || i === 1) {
                            Entry.hw.sendQueue.SET[i] = {
                                type: Entry.Robotry_Parodule.controlTypes.DIGITAL,
                                data: motor1 + value,
                                time: new Date().getTime(),
                            }
                        }
                        else if (i === 2 || i === 3) {
                            Entry.hw.sendQueue.SET[i] = {
                                type: Entry.Robotry_Parodule.controlTypes.DIGITAL,
                                data: motor2 + value,
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
                py: [],
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
                    type: 'Dropdown',
                    options: [
                        ['3', 0],
                        ['4', 12],
                        ['5', 24],
                        ['6', 36],
                    ],
                    value: [0],
                    fontSize: 12,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [[Lang.Blocks.parodule_silent], 200],
                        [[Lang.Blocks.parodule_do], 47],
                        [[Lang.Blocks.parodule_do_sharp], 48],
                        [[Lang.Blocks.parodule_re], 49],
                        [[Lang.Blocks.parodule_re_sharp], 50],
                        [[Lang.Blocks.parodule_mi], 51],
                        [[Lang.Blocks.parodule_fa], 52],
                        [[Lang.Blocks.parodule_fa_sharp], 53],
                        [[Lang.Blocks.parodule_sol], 54],
                        [[Lang.Blocks.parodule_sol_sharp], 55],
                        [[Lang.Blocks.parodule_la], 56],
                        [[Lang.Blocks.parodule_la_sharp], 57],
                        [[Lang.Blocks.parodule_si], 58],
                    ],
                    value: [47],
                    fontSize: 12,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_bzr2.svg',
                    size: 12,
                }
            ],
            events: {},
            def: {
                params: [],
                type: 'Parodule_Buzzer',
            },
            paramsKeyMap: {
                OCTAVE: 0,
                TONE: 1
            },
            class: 'SET',
            isNotFor: ['Robotry_Parodule'],
            func(sprite, script) {
                var octave = script.getNumberValue('OCTAVE');
                const tone = script.getNumberValue('TONE');
                if (tone === 200) {
                    octave = 0;
                }
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                for (var i = 0; i < 4; i++) {
                    if (Entry.Robotry_Parodule.getTerminal(i) === 'BUZZER') {
                        Entry.hw.sendQueue.SET[i] = {
                            type: Entry.Robotry_Parodule.controlTypes.DIGITAL,
                            data: octave + tone,
                            time: new Date().getTime(),
                        }
                    }
                }
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [],
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

        /* Parodule_Custom_Port_List Start */
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
                        [[Lang.Blocks.parodule_triangle], 0], // 0
                        [[Lang.Blocks.parodule_circle], 1], // 3
                        [[Lang.Blocks.parodule_square], 2], // 1
                        [[Lang.Blocks.parodule_cross], 3], // 2
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
                const port = script.getNumberValue('PORT') % 4;
                let correction_port = port === 1 ? 3 : port === 2 ? 1 : port === 3 ? 2 : 0;
                return correction_port;
            },
            syntax: {
                js: [],
                py: [],
            },
        },
        /* Parodule_Custom_Port_List End */

        /* Parodule_Custom_PIXEL_List Start */
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
                        [[Lang.Blocks.parodule_red], 0],//19
                        [[Lang.Blocks.parodule_vermilion], 1],//20
                        [[Lang.Blocks.parodule_orange], 2],//21
                        [[Lang.Blocks.parodule_tangerine], 3],//22
                        [[Lang.Blocks.parodule_yellow], 4],//23
                        [[Lang.Blocks.parodule_green_yellow], 5],//24
                        [[Lang.Blocks.parodule_green], 6],//25
                        [[Lang.Blocks.parodule_blue_green], 7],//26
                        [[Lang.Blocks.parodule_blue], 8],//27
                        [[Lang.Blocks.parodule_prussian_blue], 9],//28
                        [[Lang.Blocks.parodule_indigo], 10],//29
                        [[Lang.Blocks.parodule_blue_violet], 11],//30
                        [[Lang.Blocks.parodule_purple], 12],//31
                        [[Lang.Blocks.parodule_reddish_purple], 13],//32
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
                const color = script.getNumberValue('COLOR') % 15 + 19
                return color;
            },
            syntax: {
                js: [],
                py: [],
            },
        },
        /* Parodule_Custom_PIXEL_List End */

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
                    },
                    {
                        type: 'Parodule_Custom_PIXEL_List',
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
                const port = script.getNumberValue('PORT');
                const color = script.getNumberValue('COLOR');
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[port] = {
                    type: Entry.Robotry_Parodule.controlTypes.DIGITAL,
                    data: color,
                    time: new Date().getTime(),
                }
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [],
            }
        },
        /* Parodule Custom PIXEL End */

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
                        ['100%', 0], // 39
                        ['75%', 1], // 38
                        ['50%', 2], // 37
                        ['25%', 3],// 36
                        ['0%', 4],  // 200
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
                let correction_power = power % 5 === 4 ? 200 : 39 - power % 5;
                return correction_power;
            },
            syntax: {
                js: [],
                py: [],
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
                        [[Lang.Blocks.parodule_forward], 0], // 0
                        [[Lang.Blocks.parodule_backward], 1], // 4
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
                const sign = script.getNumberValue('SIGN') % 2;
                let correction_sign = sign ? 4 : 0;
                return correction_sign;
            },
            syntax: {
                js: [],
                py: [],
            },
        },

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
                    },
                    {
                        type: 'Parodule_Custom_Motor_List',
                    },
                    {
                        type: 'Parodule_Custom_Motor_Sign',
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
                const port = script.getNumberValue('PORT');
                const power = script.getNumberValue('POWER');
                var sign = script.getNumberValue('SIGNED');

                if (power === 200) {
                    sign = 0;
                }

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[port] = {
                    type: Entry.Robotry_Parodule.controlTypes.DIGITAL,
                    data: power + sign,
                    time: new Date().getTime(),
                }
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [],
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
                    type: 'Dropdown',
                    options: [
                        ['3', 0],
                        ['4', 12],
                        ['5', 24],
                        ['6', 36],
                    ],
                    value: [0],
                    fontSize: 12,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [[Lang.Blocks.parodule_silent], 200],
                        [[Lang.Blocks.parodule_do], 47],
                        [[Lang.Blocks.parodule_do_sharp], 48],
                        [[Lang.Blocks.parodule_re], 49],
                        [[Lang.Blocks.parodule_re_sharp], 50],
                        [[Lang.Blocks.parodule_mi], 51],
                        [[Lang.Blocks.parodule_fa], 52],
                        [[Lang.Blocks.parodule_fa_sharp], 53],
                        [[Lang.Blocks.parodule_sol], 54],
                        [[Lang.Blocks.parodule_sol_sharp], 55],
                        [[Lang.Blocks.parodule_la], 56],
                        [[Lang.Blocks.parodule_la_sharp], 57],
                        [[Lang.Blocks.parodule_si], 58],
                    ],
                    value: [47],
                    fontSize: 12,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                const port = script.getNumberValue('PORT');
                var octave = script.getNumberValue('OCTAVE');
                const tone = script.getNumberValue('TONE');

                if (tone === 200) {
                    octave = 0;
                }

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[port] = {
                    type: Entry.Robotry_Parodule.controlTypes.DIGITAL,
                    data: octave + tone,
                    time: new Date().getTime(),
                }
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [],
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
                    img: 'block_icon/hardware_led.svg',
                    size: 12,
                }
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'Parodule_Custom_Port_List',
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
                const port = script.getNumberValue('PORT');
                const value = 200; // 끄기
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[port] = {
                    type: Entry.Robotry_Parodule.controlTypes.DIGITAL,
                    data: value,
                    time: new Date().getTime(),
                }
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [],
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