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

                Parodule_Custom_title: '커스텀 제어 블럭\0',
                Parodule_Custom_LED: '%1 에 연결된 픽셀을 %2 으로 설정 %3',
                Parodule_Custom_Motor: '%1 에 연결된 모터를 %2 의 파워로 %3 %4',
                Parodule_Custom_Buzzer: '%1 에 연결된 부저를 %2 옥타브 %3 (으)로 재생 %4',

                Parodule_title: '제어 블럭\0',
                Parodule_Set: '세모 : %1 원 : %4 네모 : %2  십자 : %3 으로 설정 %5',
                Parodule_LED: '%1 (으)로 픽셀 설정 %2',
                Parodule_Motor: '%1 의 파워로 %2 %3',
                Parodule_Buzzer: '%1 옥타브 %2 (으)로 재생 %3',

                Parodule_Update: '파로듈 업데이트 %1',
            },
            Helper: { // 블록 선택시 나타나는 한글 설명
                Parodule_LED: '다양한 색상을 표현할수 있는 LED 블럭입니다',
                Parodule_Motor: '모터를 제어할 수 있는 블록입니다',
                Parodule_Buzzer: '부저를 이용해 음을 재생할 수 있는 블록입니다',

                Parodule_Custom_Set: '메인모듈에 연결된 모듈들을 정의합니다.',
                Parodule_Custom_Motor: '모터 모듈을 움직입니다.',

                //Parodule_Update: '파로듈 업데이트',
            },
            Blocks: {
                sensor1: ' 세모 ',
                sensor2: ' 네모 ',
                sensor3: ' 십자 ',
                sensor4: '  원  ',
                light: '빛',
                sound: '소리',
                button: '버튼',
                isSensor: 'NON',
            }
        },
        en: {
            template: {
                Parodule_Input_title: '센서 블럭\0',
                Parodule_Sensor_Data: '%1 센서',
                Parodule_Sensor_Kind: '%1 모듈 종류',

                Parodule_Custom_title: '커스텀 제어 블럭\0',
                Parodule_Custom_LED: '%1 에 연결된 픽셀을 %2 으로 설정 %3',
                Parodule_Custom_Motor: '%1 에 연결된 모터를 %2 의 파워로 %3 %4',
                Parodule_Custom_Buzzer: '%1 에 연결된 부저를 %2 옥타브 %3 (으)로 재생 %4',

                Parodule_title: '제어 블럭\0',
                Parodule_Set: '세모 : %1 원 : %4 네모 : %2  십자 : %3 으로 설정 %5',
                Parodule_LED: '%1 (으)로 픽셀 설정 %2',
                Parodule_Motor: '%1 의 파워로 %2 %3',
                Parodule_Buzzer: '%1 옥타브 %2 (으)로 재생 %3',

                Parodule_Update: '파로듈 업데이트 %1',
            },
            Helper: {
                Parodule_LED: '다양한 색상을 표현할수 있는 LED 블럭입니다',
                Parodule_Motor: '모터를 제어할 수 있는 블록입니다',
                Parodule_Buzzer: '부저를 이용해 음을 재생할 수 있는 블록입니다',

                Parodule_Custom_Set: '메인모듈에 연결된 모듈들을 정의합니다.',
                Parodule_Custom_Motor: '모터 모듈을 움직입니다.',

                //Parodule_Update: '파로듈 업데이트',
            },
            Blocks: {
                sensor1: '세모',
                sensor2: '네모',
                sensor3: '십자',
                sensor4: '원',
                light: '빛',
                sound: '소리',
                button: '버튼',
                isSensor: 'NON',
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
                name: Lang.Blocks.sensor1,
                type: 'input',
                pos: { x: [140], y: [100] },
            },
            MODULE2: {
                name: Lang.Blocks.sensor2,
                type: 'input',
                pos: { x: [140], y: [500 - 100] },
            },
            MODULE3: {
                name: Lang.Blocks.sensor3,
                type: 'input',
                pos: { x: [500 - 140], y: [500 - 100] },
            },
            MODULE4: {
                name: Lang.Blocks.sensor4,
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
        'Parodule_Sensor_Data',
        'Parodule_Sensor_Kind',

        'Parodule_title',
        'Parodule_Set',
        'Parodule_LED',
        'Parodule_Motor',
        'Parodule_Buzzer',

        'Parodule_Custom_title',
        'Parodule_Custom_LED',
        'Parodule_Custom_Motor',
        'Parodule_Custom_Buzzer',

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
                        ['세모', 0],
                        ['원', 3],
                        ['네모', 1],
                        ['십자', 2],
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
                        ['세모', 0],
                        ['원', 3],
                        ['네모', 1],
                        ['십자', 2],
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
                const LED = 209;
                const MOTOR = 210;
                const BUZZER = 211;
                const port = script.getNumberValue('PORT');
                const module_data = Entry.hw.portData.MODULE;
                let value = "";
                if (module_data[port] === LED) {
                    value = "LED";
                }
                else if (module_data[port] === MOTOR) {
                    value = "모터";
                }
                else if (module_data[port] === BUZZER) {
                    value = "부저";
                }
                else if (module_data[port] === NONE) {
                    value = "없음";
                }
                else if (module_data[port] == UNKNOWN) {
                    value = "모름";
                }
                return value;
            },
            syntax: {
                js: [],
                py: [],
            },
        },

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

        /* Paroduel Custom LED Start */
        Parodule_Custom_LED: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['세모', 0],
                        ['원', 3],
                        ['네모', 1],
                        ['십자', 2],
                    ],
                    value: [0],
                    fontSize: 12,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['무색', 200],
                        ['아우라', 18],
                        ['빨강색', 19],
                        ['다홍색', 20],
                        ['주황색', 21],
                        ['귤색', 22],
                        ['노랑색', 23],
                        ['연두색', 24],
                        ['녹색', 25],
                        ['청록색', 26],
                        ['파랑색', 27],
                        ['감청색', 28],
                        ['남색', 29],
                        ['남보라색', 30],
                        ['보라색', 31],
                        ['자주색', 32],
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
                type: 'Parodule_Custom_LED',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1
            },
            class: 'SET',
            isNotFor: ['Robotry_Parodule'],
            func(sprite, script) {
                const port = script.getNumberValue('PORT');
                const value = script.getNumberValue('VALUE');
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
        /* Parodule Custom LED End */

        /* Paroduel Custom Motor Start */
        Parodule_Custom_Motor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['세모', 0],
                        ['원', 3],
                        ['네모', 1],
                        ['십자', 2],
                    ],
                    value: [0],
                    fontSize: 12,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },

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
                        ['정회전', 0],
                        ['역회전', 4],
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
                type: 'Parodule_Custom_Motor',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
                STATE: 2,

            },
            class: 'SET',
            isNotFor: ['Robotry_Parodule'],
            func(sprite, script) {
                const port = script.getNumberValue('PORT');
                var state = script.getNumberValue('STATE');
                const value = script.getNumberValue('VALUE');

                if (value === 200) {
                    state = 0;
                }

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[port] = {
                    type: Entry.Robotry_Parodule.controlTypes.DIGITAL,
                    data: state + value,
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
                    type: 'Dropdown',
                    options: [
                        ['세모', 0],
                        ['원', 3],
                        ['네모', 1],
                        ['십자', 2],
                    ],
                    value: [0],
                    fontSize: 12,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                        ['무음', 200],
                        ['도', 47],
                        ['도#', 48],
                        ['레', 49],
                        ['레#', 50],
                        ['미', 51],
                        ['파', 52],
                        ['파#', 53],
                        ['솔', 54],
                        ['솔#', 55],
                        ['라', 56],
                        ['라#', 57],
                        ['시', 58],
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
                        ['없음', 'NONE'],
                        ['LED', 'LED'],
                        ['모터', 'MOTOR'],
                        ['부저', 'BUZZER'],
                    ],
                    value: 'LED',
                    fontSize: 12,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['없음', 'NONE'],
                        ['LED', 'LED'],
                        ['모터', 'MOTOR'],
                        ['부저', 'BUZZER'],
                    ],
                    value: 'MOTOR',
                    fontSize: 12,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['없음', 'NONE'],
                        ['LED', 'LED'],
                        ['모터', 'MOTOR'],
                        ['부저', 'BUZZER'],
                    ],
                    value: 'MOTOR',
                    fontSize: 12,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['없음', 'NONE'],
                        ['LED', 'LED'],
                        ['모터', 'MOTOR'],
                        ['부저', 'BUZZER'],
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


        /* Paroduel LED Start */
        Parodule_LED: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['무색', 200],
                        ['아우라', 18],
                        ['빨강색', 19],
                        ['다홍색', 20],
                        ['주황색', 21],
                        ['귤색', 22],
                        ['노랑색', 23],
                        ['연두색', 24],
                        ['녹색', 25],
                        ['청록색', 26],
                        ['파랑색', 27],
                        ['감청색', 28],
                        ['남색', 29],
                        ['남보라색', 30],
                        ['보라색', 31],
                        ['자주색', 32],
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
                type: 'Parodule_LED',
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
                    if (Entry.Robotry_Parodule.getTerminal(i) === 'LED') {
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
        /* Parodule LED End */

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
                        ['전진', 0],
                        ['후진', 1],
                        ['좌회전', 2],
                        ['우회전', 3],
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
                var motor1 = 0;
                var motor2 = 0;
                if (state === 1) {
                    motor1 = 0;
                    motor2 = 0;
                }
                else if (state === 2) {
                    motor1 = 4;
                    motor2 = 4;
                }
                else if (state === 3) {
                    motor1 = 0;
                    motor2 = 4;
                }
                else if (state === 4) {
                    motor1 = 4;
                    motor2 = 0;
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
                        ['무음', 200],
                        ['도', 47],
                        ['도#', 48],
                        ['레', 49],
                        ['레#', 50],
                        ['미', 51],
                        ['파', 52],
                        ['파#', 53],
                        ['솔', 54],
                        ['솔#', 55],
                        ['라', 56],
                        ['라#', 57],
                        ['시', 58],
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