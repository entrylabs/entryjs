'use strict';

const PromiseManager = require('../../../core/promiseManager');

Entry.CodeWiz = {
    id: '1.12',
    name: 'CodeWiz',
    url: 'http://codable.co.kr/page/?pid=codewiz',
    imageName: 'codewiz.png',
    title: {
        ko: '코드위즈',
        en: 'CodeWiz',
    },
    timeOutList: [],
    removeTimeout: function(id) {
        clearTimeout(id);
        var timeOutList = this.timeOutList;
        var index = timeOutList.indexOf(id);
        if (index >= 0) {
            timeOutList.splice(index, 1);
        }
    },
    removeAllTimeouts: function() {
        var timeOutList = this.timeOutList;
        for (var i in timeOutList) {
            clearTimeout(timeOutList[i]);
        }
        this.timeOutList = [];
    },

    setZero: function() {
        Entry.hw.sendQueue = {
            GET: {},
            SET: {},
            RESET: 0,
        };

        Entry.hw.sendQueue = {
            RESET: 1,
        };
        Entry.hw.update();
        Entry.hw.update();

        delete Entry.hw.sendQueue.RESET;
        Entry.CodeWiz.removeAllTimeouts();
    },
    monitorTemplate: {
        imgPath: 'hw/codeino.png',
        width: 431,
        height: 354,

        mode: 'both',
    },
    sensorTypes: {
        BUZZER: 1,
        NEOPIXEL: 2,
        OLED: 3,
        DIGITAL_OUTPUT: 4,
    },
    BlockState: {},
    defaultWaitTime: 90,
};

Entry.CodeWiz.setLanguage = function() {
    return {
        ko: {
            template: {
                CodeWiz_get_sensor: '%1센서 값',
                CodeWiz_get_gyroSensor: '자이로 센서 %1값',
                CodeWiz_isPushedButton: '%1 스위치 버튼 값',
                CodeWiz_touchPin: '터치핀 %1 값',

                CodeWiz_default_buzzer: '부저를 %1옥타브, %2음, %3분음표로 연주하기 %4',

                CodeWiz_neopixel_brightness: '네오픽셀 밝기를 %1로 설정(0~255)%2',
                CodeWiz_neopixel_setColor_one: '네오픽셀 %1번 LED를 %2(으)로 켜기%3',
                CodeWiz_neopixel_setColor_one2: "네오픽셀 %1번 LED를 빨강%2초록%3파랑%4(으)로 켜기%5",
                CodeWiz_neopixel_off_one: '네오픽셀 %1번 LED 끄기%2',
                CodeWiz_neopixel_setColor_all: '네오픽셀 %1(으)로 모두 켜기%2',
                CodeWiz_neopixel_setColor_all2: "네오픽셀 빨강%1초록%2파랑%3(으)로 모두 켜기%4",
                CodeWiz_neopixel_off_all: '네오픽셀 모두 끄기%1',

                CodeWiz_OLED_clear: 'OLED 클리어%1',
                CodeWiz_OLED_mirror: 'OLED 반전%1 %2',
                CodeWiz_OLED_setSize: 'OLED 문자열 크기를 %1(으)로 설정%2',
                CodeWiz_OLED_setPosition: 'OLED 커서위치(%1,%2)(으)로 지정%3',
                CodeWiz_OLED_println: 'OLED에 %1 출력%2',
                CodeWiz_OLED_isCollision: 'OLED 문자열겹치기%1%2',
                CodeWiz_OLED_specialChar: 'OLED에 특수기호%1 출력하기%2',
                CodeWiz_OLED_setFont: 'OLED 폰트%1를 크기%2(으)로 설정%3',
                CodeWiz_OLED_startScroll: 'OLED 스크롤%1 시작페이지%2 종료페이지%3%4',
                CodeWiz_OLED_stopScroll: 'OLED 스크롤 정지%1',
                CodeWiz_OLED_drawPoint: 'OLED의 좌표(%1,%2)에 점 그리기 색%3%4',
                CodeWiz_OLED_drawLine1: 'OLED에 선 그리기 시작(%1,%2) 끝(%3,%4) 색%5%6',
                CodeWiz_OLED_drawLine2: 'OLED에 수직 선 그리기 시작(%1,%2) 길이%3 색%4%5',
                CodeWiz_OLED_drawLine3: 'OLED에 수평 선 그리기 시작(%1,%2) 길이%3 색%4%5',
                CodeWiz_OLED_drawRect:
                    'OLED에 시작(%1,%2)에서 가로%3 세로%4인 직사각형 그리기(채우기%5)색%6%7',
                CodeWiz_OLED_drawCircle:
                    'OLED에 중심(%1,%2)에서 반지름%3인 원 그리기(채우기%4)색%5%6',
                CodeWiz_OLED_drawPoligon:
                    'OLED에 점1(%1,%2) 점2(%3,%4) 점3(%5,%6)으로 삼각형 그리기(채우기%7)색%8%9',

                CodeWiz_DIGITAL_OUTPUT_setup: '터치센서 출력으로 사용%1',
                CodeWiz_DIGITAL_OUTPUT_digitalWrite: '터치센서 디지털 %1으로 %2내보내기%3',
                CodeWiz_DIGITAL_OUTPUT_pwmWrite: '터치센서 PWM %1으로 %2내보내기(0~255)%3',
            },
        },
    };
};
Entry.CodeWiz.blockMenuBlocks = [
    'CodeWiz_get_sensor',
    'CodeWiz_get_gyroSensor',
    'CodeWiz_isPushedButton',
    'CodeWiz_touchPin',

    'CodeWiz_default_buzzer',

    'CodeWiz_neopixel_brightness',
    'CodeWiz_neopixel_setColor_one',
    'CodeWiz_neopixel_setColor_one2',
    'CodeWiz_neopixel_off_one',
    'CodeWiz_neopixel_setColor_all',
    'CodeWiz_neopixel_setColor_all2',
    'CodeWiz_neopixel_off_all',

    'CodeWiz_OLED_clear',
    'CodeWiz_OLED_mirror',
    'CodeWiz_OLED_setSize',
    'CodeWiz_OLED_setPosition',
    'CodeWiz_OLED_println',
    'CodeWiz_OLED_isCollision',
    'CodeWiz_OLED_specialChar',
    'CodeWiz_OLED_setFont',
    'CodeWiz_OLED_startScroll',
    'CodeWiz_OLED_stopScroll',
    'CodeWiz_OLED_drawPoint',
    'CodeWiz_OLED_drawLine1',
    'CodeWiz_OLED_drawLine2',
    'CodeWiz_OLED_drawLine3',
    'CodeWiz_OLED_drawRect',
    'CodeWiz_OLED_drawCircle',
    'CodeWiz_OLED_drawPoligon',

    'CodeWiz_DIGITAL_OUTPUT_setup',
    'CodeWiz_DIGITAL_OUTPUT_digitalWrite',
    'CodeWiz_DIGITAL_OUTPUT_pwmWrite',
];

Entry.CodeWiz.getBlocks = function() {
    const promiseManager = new PromiseManager();
    return {
        //region codeino 코드위즈
        CodeWiz_get_sensor: {
            // Block UI : %1센서 값
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['소리', 'SOUND'],
                        ['빛', 'LIGHT'],
                        ['거리', 'DIST'],
                        ['홀', 'HALL'],
                        ['온도', 'tempSensor'],
                    ],
                    value: 'SOUND',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: [null],
                type: 'CodeWiz_get_sensor',
            },
            paramsKeyMap: {
                SENSOR: 0,
            },
            isNotFor: ['CodeWiz'],
            class: 'CodeWiz_default_sensor',
            func: function(sprite, script) {
                var sensor = script.getField('SENSOR', script);
                var hw_sensorData = Entry.hw.portData;
                return hw_sensorData ? hw_sensorData[sensor] : 0;
            },
        },
        CodeWiz_get_gyroSensor: {
            // Block UI : 자이로 센서 %1값
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['X', 'GYRO_X'],
                        ['Y', 'GYRO_Y'],
                        ['Z', 'GYRO_Z'],
                    ],
                    value: 'GYRO_X',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: [null],
                type: 'CodeWiz_get_gyroSensor',
            },
            paramsKeyMap: {
                GYRO_TYPE: 0,
            },
            isNotFor: ['CodeWiz'],
            class: 'CodeWiz_default_sensor',
            func: function(sprite, script) {
                var sensor = script.getField('GYRO_TYPE', script);
                var hw_sensorData = Entry.hw.portData;
                return hw_sensorData ? hw_sensorData[sensor] : 0;
            },
        },
        CodeWiz_isPushedButton: {
            // Block UI : %1 스위치 버튼 값
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['왼쪽', 'switchButton_26'],
                        ['오른쪽', 'switchButton_4'],
                    ],
                    value: 'switchButton_26',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'CodeWiz_isPushedButton',
            },
            paramsKeyMap: {
                SWITCH: 0,
            },
            isNotFor: ['CodeWiz'],
            class: 'CodeWiz_default_sensor',
            func: function(sprite, script) {
                var sensor = script.getField('SWITCH', script);
                var hw_sensorData = Entry.hw.portData;
                return hw_sensorData ? hw_sensorData[sensor] : 0;
            },
        },
        CodeWiz_touchPin: {
            // Block UI : "터치핀 %1 값",
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['IO32', 'touchPin_32'],
                        ['IO33', 'touchPin_33'],
                        ['IO13', 'touchPin_13'],
                        ['IO14', 'touchPin_14'],
                        ['IO15', 'touchPin_15'],
                        ['IO27', 'touchPin_27'],
                    ],
                    value: 'touchPin_32',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'CodeWiz_touchPin',
            },
            paramsKeyMap: {
                SWITCH: 0,
            },
            isNotFor: ['CodeWiz'],
            class: 'CodeWiz_default_sensor',
            func: function(sprite, script) {
                var sensor = script.getField('SWITCH', script);
                var hw_sensorData = Entry.hw.portData;
                return hw_sensorData ? hw_sensorData[sensor] : 0;
            },
        },
        CodeWiz_default_buzzer: {
            // Block UI : "부저를 %1옥타브, %2음, %3분음표로 연주하기%4",
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
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
                        ['6', '6'],
                        ['7', '7'],
                    ],
                    value: '4',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['C', '0'],
                        ['Cs', '1'],
                        ['D', '2'],
                        ['Eb', '3'],
                        ['E', '4'],
                        ['F', '5'],
                        ['Fs', '6'],
                        ['G', '7'],
                        ['Gs', '8'],
                        ['A', '9'],
                        ['Bb', '10'],
                        ['B', '11'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['2', '2'],
                        ['4', '4'],
                        ['8', '8'],
                        ['16', '16'],
                        ['32', '32'],
                    ],
                    value: '4',
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
                params: [null, null, null],
                type: 'CodeWiz_default_buzzer',
            },
            paramsKeyMap: {
                OCTAVE: 0,
                NOTE: 1,
                BEAT: 2,
            },
            class: 'CodeWiz_buzzer',
            isNotFor: ['CodeWiz'],
            func(sprite, script) {
                
                const sq = Entry.hw.sendQueue;
                const port = 0xdf;
                let octave = Number.parseInt(script.getValue('OCTAVE', script));
                let note = Number.parseInt(script.getValue('NOTE', script));
                let beat = Number.parseInt(script.getValue('BEAT', script));
                
                if (!sq['SET']) {
                    sq['SET'] = {};
                }
                sq['SET'][port] = {
                    type: Entry.CodeWiz.sensorTypes.BUZZER,
                    value: {
                        octave: octave,
                        note: note,
                        beat: beat,
                    },
                };
                Entry.hw.update();
                sq['SET'] = {};
                return promiseManager.sleep((1000 / beat) * 1.3 + Entry.CodeWiz.defaultWaitTime);
            },
        },
        CodeWiz_neopixel_brightness: {
            // Block UI : "네오픽셀 밝기를 %1로 설정(0~255)%2",
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                    value: 22,
                },

                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null, null],
                type: 'CodeWiz_neopixel_brightness',
            },
            paramsKeyMap: {
                BRIGHTNESS: 0,
            },
            class: 'CodeWiz_neopixel',
            isNotFor: ['CodeWiz'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = 0xff;
                let value = script.getNumberValue('BRIGHTNESS', script);

                value = Math.round(value);
                if (value < 0) {
                    value = 0;
                } else if (value > 255) {
                    value = 255;
                }

                if (!sq['SET']) {
                    sq['SET'] = {};
                }
                sq['SET'][port] = {
                    type: Entry.CodeWiz.sensorTypes.NEOPIXEL,
                    value: {
                        opcode: 0,
                        value: value,
                    },
                };
                Entry.hw.update();
                sq['SET'] = {};
                return promiseManager.sleep(Entry.CodeWiz.defaultWaitTime);
            },
        },
        CodeWiz_neopixel_setColor_one: {
            // Block UI : "네오픽셀 %1번 LED를 <색상표>%2(으)로 켜기%3",
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
                    type: 'Color',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: ['1', null,null],
                type: 'CodeWiz_neopixel_setColor_one',
            },
            paramsKeyMap: {
                NUM: 0,
                COLOR: 1,
            },
            class: 'CodeWiz_neopixel',
            isNotFor: ['CodeWiz'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = 0xfe;
                let num = script.getNumberValue('NUM', script)-1;
                let value = script.getStringField('COLOR', script);

                let colorValue = [
                    parseInt(value.substr(1, 2), 16),
                    parseInt(value.substr(3, 2), 16),
                    parseInt(value.substr(5, 2), 16),
                ];
                if (!sq['SET']) {
                    sq['SET'] = {};
                }
                sq['SET'][port] = {
                    type: Entry.CodeWiz.sensorTypes.NEOPIXEL,
                    value: {
                        opcode: 1,
                        num: num,
                        value: {
                            r: colorValue[0],
                            g: colorValue[1],
                            b: colorValue[2],
                        },
                    },
                };
                Entry.hw.update();
                sq['SET'] = {};
                return promiseManager.sleep(Entry.CodeWiz.defaultWaitTime);
            },
        },
        CodeWiz_neopixel_setColor_one2: {
            // Block UI : "네오픽셀 %1번 LED를 빨강%2초록%3파랑%4(으)로 켜기%5",
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
                },
            ],
            events: {},
            def: {
                params: [
                    '1',
                    '255',
                    '255',
                    '255',
                    null,
                ],
                type: 'CodeWiz_neopixel_setColor_one2',
            },
            paramsKeyMap: {
                NUM: 0,
                R:1,
                G:2,
                B:3,
            },
            class: 'CodeWiz_neopixel',
            isNotFor: ['CodeWiz'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = 0xe6;
                let num = script.getNumberValue('NUM', script)-1;
                let r = script.getNumberValue('R', script);
                let g = script.getNumberValue('G', script);
                let b = script.getNumberValue('B', script);                
                
                if (!sq['SET']) {
                    sq['SET'] = {};
                }
                sq['SET'][port] = {
                    type: Entry.CodeWiz.sensorTypes.NEOPIXEL,
                    value: {
                        opcode:1,
                        num:num,
                        value:{
                            r:r,
                            g:g,
                            b:b
                        }
                    }
                }
                Entry.hw.update();
                sq['SET'] = {};
                return promiseManager.sleep(Entry.CodeWiz.defaultWaitTime);
            },
        },
        CodeWiz_neopixel_off_one: {
            // Block UI : "네오픽셀 %1번 LED 끄기%2",
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: ['1', null],
                type: 'CodeWiz_neopixel_off_one',
            },
            paramsKeyMap: {
                NUM: 0,
            },
            class: 'CodeWiz_neopixel',
            isNotFor: ['CodeWiz'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = 0xfd;
                let num = script.getNumberValue('NUM', script)-1;

                if (!sq['SET']) {
                    sq['SET'] = {};
                }
                sq['SET'][port] = {
                    type: Entry.CodeWiz.sensorTypes.NEOPIXEL,
                    value: {
                        opcode: 2,
                        num: num,
                    },
                };
                Entry.hw.update();
                sq['SET'] = {};
                return promiseManager.sleep(Entry.CodeWiz.defaultWaitTime);
            },
        },
        CodeWiz_neopixel_setColor_all: {
            // Block UI : "네오픽셀 %1(으)로 모두 켜기%2",
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Color',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'CodeWiz_neopixel_setColor_all',
            },
            paramsKeyMap: {
                COLOR: 0,
            },
            class: 'CodeWiz_neopixel',
            isNotFor: ['CodeWiz'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = 0xfc;
                let value = script.getStringField('COLOR', script);

                let colorValue = [
                    parseInt(value.substr(1, 2), 16),
                    parseInt(value.substr(3, 2), 16),
                    parseInt(value.substr(5, 2), 16),
                ];
                if (!sq['SET']) {
                    sq['SET'] = {};
                }
                sq['SET'][port] = {
                    type: Entry.CodeWiz.sensorTypes.NEOPIXEL,
                    value: {
                        opcode: 3,
                        value: {
                            r: colorValue[0],
                            g: colorValue[1],
                            b: colorValue[2],
                        },
                    },
                };
                Entry.hw.update();
                sq['SET'] = {};
                return promiseManager.sleep(Entry.CodeWiz.defaultWaitTime);
            },
        },
        CodeWiz_neopixel_setColor_all2: {
            // Block UI : "네오픽셀 빨강%1초록%2파랑%3(으)로 모두 켜기%4",
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    '255',
                    '255',
                    '255',
                    null
                ],
                type: 'CodeWiz_neopixel_setColor_all2',
            },
            paramsKeyMap: {
                R:0,
                G:1,
                B:2,
            },
            class: 'CodeWiz_neopixel',
            isNotFor: ['CodeWiz'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = 0xe5;
                let r = script.getNumberValue('R', script);
                let g = script.getNumberValue('G', script);
                let b = script.getNumberValue('B', script);
               
                if (!sq['SET']) {
                    sq['SET'] = {};
                }
                sq['SET'][port] = {
                    type: Entry.CodeWiz.sensorTypes.NEOPIXEL,
                    value: {
                        opcode:3,
                        value:{
                            r:r,
                            g:g,
                            b:b
                        }
                    }
                }
                Entry.hw.update();
                sq['SET'] = {};
                return promiseManager.sleep(Entry.CodeWiz.defaultWaitTime);
            },
        },
        CodeWiz_neopixel_off_all: {
            // Block UI : "네오픽셀 모두 끄기%1",
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
                params: [],
                type: 'CodeWiz_neopixel_off_all',
            },
            paramsKeyMap: {},
            class: 'CodeWiz_neopixel',
            isNotFor: ['CodeWiz'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = 0xfb;

                if (!sq['SET']) {
                    sq['SET'] = {};
                }
                sq['SET'][port] = {
                    type: Entry.CodeWiz.sensorTypes.NEOPIXEL,
                    value: {
                        opcode: 4,
                    },
                };
                Entry.hw.update();
                sq['SET'] = {};
                return promiseManager.sleep(Entry.CodeWiz.defaultWaitTime);
            },
        },
        CodeWiz_OLED_clear: {
            // Block UI : "OLED 클리어%1",
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
                params: [],
                type: 'CodeWiz_OLED_clear',
            },
            paramsKeyMap: {},
            class: 'CodeWiz_OLED',
            isNotFor: ['CodeWiz'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = 0xfa;

                if (!sq['SET']) {
                    sq['SET'] = {};
                }
                sq['SET'][port] = {
                    type: Entry.CodeWiz.sensorTypes.OLED,
                    value: {
                        opcode: 0,
                    },
                };
                Entry.hw.update();
                sq['SET'] = {};
                return promiseManager.sleep(Entry.CodeWiz.defaultWaitTime);
            },
        },
        CodeWiz_OLED_mirror: {
            // Block UI : "OLED 반전%1 %2",
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['false', '0'],
                        ['true', '1'],
                    ],
                    value: '0',
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
                params: [null],
                type: 'CodeWiz_OLED_mirror',
            },
            paramsKeyMap: {
                SWITCH: 0,
            },
            class: 'CodeWiz_OLED',
            isNotFor: ['CodeWiz'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = 0xf9;
                let _value = script.getNumberValue('SWITCH', script);
                if (!sq['SET']) {
                    sq['SET'] = {};
                }
                sq['SET'][port] = {
                    type: Entry.CodeWiz.sensorTypes.OLED,
                    value: {
                        opcode: 1,
                        isTrue: _value,
                    },
                };
                Entry.hw.update();
                sq['SET'] = {};
                return promiseManager.sleep(Entry.CodeWiz.defaultWaitTime);
            },
        },
        CodeWiz_OLED_setSize: {
            // Block UI : "OLED 문자열 크기를 %1(으)로 설정%2",
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [3],
                type: 'CodeWiz_OLED_setSize',
            },
            paramsKeyMap: {
                SIZE: 0,
            },
            class: 'CodeWiz_OLED',
            isNotFor: ['CodeWiz'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = 0xf8;
                let _value = script.getNumberValue('SIZE', script);
                _value = Math.round(_value);
                if (_value < 1) {
                    _value = 1;
                } else if (_value > 10) {
                    _value = 10;
                }
                if (!sq['SET']) {
                    sq['SET'] = {};
                }
                sq['SET'][port] = {
                    type: Entry.CodeWiz.sensorTypes.OLED,
                    value: {
                        opcode: 2,
                        size: _value,
                    },
                };
                Entry.hw.update();
                sq['SET'] = {};
                return promiseManager.sleep(Entry.CodeWiz.defaultWaitTime);
            },
        },
        CodeWiz_OLED_setPosition: {
            // Block UI : "OLED 커서위치(%1,%2)(으)로 지정%3",
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: ['0', '0'],
                type: 'CodeWiz_OLED_setPosition',
            },
            paramsKeyMap: {
                X: 0,
                Y: 1,
            },
            class: 'CodeWiz_OLED',
            isNotFor: ['CodeWiz'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = 0xf7;
                let _x = script.getNumberValue('X', script);
                _x = Math.round(_x);
                if (_x < 0) {
                    _x = 0;
                } else if (_x > 255) {
                    _x = 255;
                }

                let _y = script.getNumberValue('Y', script);
                _y = Math.round(_y);
                if (_y < 0) {
                    _y = 0;
                } else if (_y > 255) {
                    _y = 255;
                }

                if (!sq['SET']) {
                    sq['SET'] = {};
                }
                sq['SET'][port] = {
                    type: Entry.CodeWiz.sensorTypes.OLED,
                    value: {
                        opcode: 3,
                        x: _x,
                        y: _y,
                    },
                };
                Entry.hw.update();
                sq['SET'] = {};
                return promiseManager.sleep(Entry.CodeWiz.defaultWaitTime);
            },
        },
        CodeWiz_OLED_println: {
            // Block UI : "OLED에 %1출력%2",
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: ['Hello, World!!'],
                type: 'CodeWiz_OLED_println',
            },
            paramsKeyMap: {
                TEXT: 0,
            },
            class: 'CodeWiz_OLED',
            isNotFor: ['CodeWiz'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = 0xf6;
                let _value = script.getStringValue('TEXT');
                if (!sq['SET']) {
                    sq['SET'] = {};
                }
                
                sq['SET'][port] = {
                    type: Entry.CodeWiz.sensorTypes.OLED,
                    value: {
                        opcode: 4,
                        text: _value,
                    },
                };
                Entry.hw.update();
                sq['SET'] = {};
                return promiseManager.sleep(Entry.CodeWiz.defaultWaitTime);
            },
        },
        CodeWiz_OLED_isCollision: {
            // Block UI : "OLED 문자열겹치기%1%2",
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['false', '0'],
                        ['true', '1'],
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
                params: [null],
                type: 'CodeWiz_OLED_isCollision',
            },
            paramsKeyMap: {
                SWITCH: 0,
            },
            class: 'CodeWiz_OLED',
            isNotFor: ['CodeWiz'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = 0xf5;
                let _value = script.getNumberValue('SWITCH', script);
                if (!sq['SET']) {
                    sq['SET'] = {};
                }
                sq['SET'][port] = {
                    type: Entry.CodeWiz.sensorTypes.OLED,
                    value: {
                        opcode: 5,
                        isTrue: _value,
                    },
                };
                Entry.hw.update();
                sq['SET'] = {};
                return promiseManager.sleep(Entry.CodeWiz.defaultWaitTime);
            },
        },
        CodeWiz_OLED_specialChar: {
            // Block UI : "OLED에 특수기호%1 출력하기%2",
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['♥', '3'],
                        ['◆', '4'],
                        ['♣', '5'],
                        ['♠', '6'],
                        ['♬', '14'],
                        ['▲', '30'],
                        ['▼', '31'],
                    ],
                    value: '14',
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
                params: [null],
                type: 'CodeWiz_OLED_specialChar',
            },
            paramsKeyMap: {
                CHAR: 0,
            },
            class: 'CodeWiz_OLED',
            isNotFor: ['CodeWiz'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = 0xf4;
                let _value = script.getNumberValue('CHAR', script);
                if (!sq['SET']) {
                    sq['SET'] = {};
                }
                sq['SET'][port] = {
                    type: Entry.CodeWiz.sensorTypes.OLED,
                    value: {
                        opcode: 6,
                        c: _value,
                    },
                };
                Entry.hw.update();
                sq['SET'] = {};
                return promiseManager.sleep(Entry.CodeWiz.defaultWaitTime);
            },
        },
        CodeWiz_OLED_setFont: {
            // Block UI : "OLED 폰트%1를 크기%2(으)로 설정",
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['Serif', '0'],
                        ['Sans', '1'],
                        ['Mono', '2'],
                    ],
                    value: '2',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['9', '0'],
                        ['12', '1'],
                        ['18', '2'],
                    ],
                    value: '0',
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
                params: [null, null],
                type: 'CodeWiz_OLED_setFont',
            },
            paramsKeyMap: {
                FONT: 0,
                SIZE: 1,
            },
            class: 'CodeWiz_OLED',
            isNotFor: ['CodeWiz'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = 0xf3;
                let _value = script.getNumberValue('FONT', script);
                let _size = script.getNumberValue('SIZE', script);
                if (!sq['SET']) {
                    sq['SET'] = {};
                }
                sq['SET'][port] = {
                    type: Entry.CodeWiz.sensorTypes.OLED,
                    value: {
                        opcode: 7,
                        font: _value,
                        size: _size,
                    },
                };
                Entry.hw.update();
                sq['SET'] = {};
                return promiseManager.sleep(Entry.CodeWiz.defaultWaitTime);
            },
        },
        CodeWiz_OLED_startScroll: {
            // Block UI : "OLED 스크롤%1 시작페이지%2 종료페이지%3%4",
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['left to right', '0'],
                        ['right to left', '1'],
                        ['right bottom to upper left', '2'],
                        ['left bottom to upper right', '3'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                },
            ],
            events: {},
            def: {
                params: [null, '0', '0'],
                type: 'CodeWiz_OLED_startScroll',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                START: 1,
                END: 2,
            },
            class: 'CodeWiz_OLED',
            isNotFor: ['CodeWiz'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = 0xf2;
                let _value = script.getNumberValue('DIRECTION', script);
                let _st = script.getNumberValue('START', script);
                _st = Math.round(_st);
                if (_st < 0) {
                    _x = 0;
                } else if (_st > 7) {
                    _st = 7;
                }
                let _ed = script.getNumberValue('END', script);
                _ed = Math.round(_ed);
                if (_ed < 0) {
                    _ed = 0;
                } else if (_ed > 7) {
                    _ed = 7;
                }

                if (!sq['SET']) {
                    sq['SET'] = {};
                }
                sq['SET'][port] = {
                    type: Entry.CodeWiz.sensorTypes.OLED,
                    value: {
                        opcode: 8,
                        direction: _value,
                        start: _st,
                        end: _ed,
                    },
                };
                Entry.hw.update();
                sq['SET'] = {};
                return promiseManager.sleep(Entry.CodeWiz.defaultWaitTime);
            },
        },
        CodeWiz_OLED_stopScroll: {
            // Block UI : "OLED 스크롤 정지%1",
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
                params: [],
                type: 'CodeWiz_OLED_stopScroll',
            },
            paramsKeyMap: {},
            class: 'CodeWiz_OLED',
            isNotFor: ['CodeWiz'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = 0xf1;

                if (!sq['SET']) {
                    sq['SET'] = {};
                }
                sq['SET'][port] = {
                    type: Entry.CodeWiz.sensorTypes.OLED,
                    value: {
                        opcode: 9,
                    },
                };
                
                Entry.hw.update();
                sq['SET'] = {};
                return promiseManager.sleep(Entry.CodeWiz.defaultWaitTime);
            },
        },
        CodeWiz_OLED_drawPoint: {
            // Block UI : "OLED의 좌표(%1,%2)에 점 그리기 색%3%4",
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
                    type: 'Dropdown',
                    options: [
                        ['black', '0'],
                        ['white', '1'],
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
                params: [63, 31, null],
                type: 'CodeWiz_OLED_drawPoint',
            },
            paramsKeyMap: {
                X: 0,
                Y: 1,
                COLOR: 2,
            },
            class: 'CodeWiz_OLED',
            isNotFor: ['CodeWiz'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = 0xf0;

                let _x = script.getNumberValue('X', script);
                _x = Math.round(_x);
                if (_x < 0) {
                    _x = 0;
                } else if (_x > 128) {
                    _x = 128;
                }

                let _y = script.getNumberValue('Y', script);
                _y = Math.round(_y);
                if (_y < 0) {
                    _y = 0;
                } else if (_y > 64) {
                    _y = 64;
                }

                let _color = script.getNumberValue('COLOR', script);

                if (!sq['SET']) {
                    sq['SET'] = {};
                }
                sq['SET'][port] = {
                    type: Entry.CodeWiz.sensorTypes.OLED,
                    value: {
                        opcode: 10,
                        x: _x,
                        y: _y,
                        color: _color,
                    },
                };
                Entry.hw.update();
                sq['SET'] = {};
                return promiseManager.sleep(Entry.CodeWiz.defaultWaitTime);
            },
        },
        CodeWiz_OLED_drawLine1: {
            // Block UI : "OLED에 선 그리기 시작(%1,%2) 끝(%3,%4) 색%5%6",
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
                    type: 'Dropdown',
                    options: [
                        ['black', '0'],
                        ['white', '1'],
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
                params: ['0', '0', '10', '0', null],
                type: 'CodeWiz_OLED_drawLine1',
            },
            paramsKeyMap: {
                SX: 0,
                SY: 1,
                EX: 2,
                EY: 3,
                COLOR: 4,
            },
            class: 'CodeWiz_OLED',
            isNotFor: ['CodeWiz'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = 0xef;
                let _sx = script.getNumberValue('SX', script);
                _sx = Math.round(_sx);
                if (_sx < 0) {
                    _sx = 0;
                } else if (_sx > 128) {
                    _sx = 128;
                }
                let _sy = script.getNumberValue('SY', script);
                _sy = Math.round(_sy);
                if (_sy < 0) {
                    _sy = 0;
                } else if (_sy > 64) {
                    _sy = 64;
                }
                let _ex = script.getNumberValue('EX', script);
                _ex = Math.round(_ex);
                if (_ex < 0) {
                    _ex = 0;
                } else if (_ex > 128) {
                    _ex = 128;
                }
                let _ey = script.getNumberValue('EY', script);
                _ey = Math.round(_ey);
                if (_ey < 0) {
                    _ey = 0;
                } else if (_ey > 64) {
                    _ey = 64;
                }
                let _color = script.getNumberValue('COLOR', script);
                if (!sq['SET']) {
                    sq['SET'] = {};
                }
                sq['SET'][port] = {
                    type: Entry.CodeWiz.sensorTypes.OLED,
                    value: {
                        opcode: 11,
                        sx: _sx,
                        sy: _sy,
                        ex: _ex,
                        ey: _ey,
                        color: _color,
                    },
                };
                Entry.hw.update();
                sq['SET'] = {};
                return promiseManager.sleep(Entry.CodeWiz.defaultWaitTime);
            },
        },
        CodeWiz_OLED_drawLine2: {
            // Block UI : "OLED에 수직 선 그리기 시작(%1,%2) 길이%3 색%4%5",
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
                    type: 'Dropdown',
                    options: [
                        ['black', '0'],
                        ['white', '1'],
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
                params: ['0', '0', '10', null],
                type: 'CodeWiz_OLED_drawLine2',
            },
            paramsKeyMap: {
                SX: 0,
                SY: 1,
                LEN: 2,
                COLOR: 3,
            },
            class: 'CodeWiz_OLED',
            isNotFor: ['CodeWiz'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = 0xee;
                let _sx = script.getNumberValue('SX', script);
                _sx = Math.round(_sx);
                if (_sx < 0) {
                    _sx = 0;
                } else if (_sx > 128) {
                    _sx = 128;
                }
                let _sy = script.getNumberValue('SY', script);
                _sy = Math.round(_sy);
                if (_sy < 0) {
                    _sy = 0;
                } else if (_sy > 64) {
                    _sy = 64;
                }
                let _len = script.getNumberValue('LEN', script);
                _len = Math.round(_len);
                if (_len < 0) {
                    _len = 0;
                } else if (_len > 64) {
                    _len = 64;
                }
                let _color = script.getNumberValue('COLOR', script);
                if (!sq['SET']) {
                    sq['SET'] = {};
                }
                sq['SET'][port] = {
                    type: Entry.CodeWiz.sensorTypes.OLED,
                    value: {
                        opcode: 12,
                        sx: _sx,
                        sy: _sy,
                        len: _len,
                        color: _color,
                    },
                };
                Entry.hw.update();
                sq['SET'] = {};
                return promiseManager.sleep(Entry.CodeWiz.defaultWaitTime);
            },
        },
        CodeWiz_OLED_drawLine3: {
            // Block UI : "OLED에 수평 선 그리기 시작(%1,%2) 길이%3 색%4%5",
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
                    type: 'Dropdown',
                    options: [
                        ['black', '0'],
                        ['white', '1'],
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
                params: ['0', '0', '10', null],
                type: 'CodeWiz_OLED_drawLine3',
            },
            paramsKeyMap: {
                SX: 0,
                SY: 1,
                LEN: 2,
                COLOR: 3,
            },
            class: 'CodeWiz_OLED',
            isNotFor: ['CodeWiz'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = 0xed;
                let _sx = script.getNumberValue('SX', script);
                _sx = Math.round(_sx);
                if (_sx < 0) {
                    _sx = 0;
                } else if (_sx > 128) {
                    _sx = 128;
                }
                let _sy = script.getNumberValue('SY', script);
                _sy = Math.round(_sy);
                if (_sy < 0) {
                    _sy = 0;
                } else if (_sy > 64) {
                    _sy = 64;
                }
                let _len = script.getNumberValue('LEN', script);
                _len = Math.round(_len);
                if (_len < 0) {
                    _len = 0;
                } else if (_len > 128) {
                    _len = 128;
                }
                let _color = script.getNumberValue('COLOR', script);
                if (!sq['SET']) {
                    sq['SET'] = {};
                }
                sq['SET'][port] = {
                    type: Entry.CodeWiz.sensorTypes.OLED,
                    value: {
                        opcode: 13,
                        sx: _sx,
                        sy: _sy,
                        len: _len,
                        color: _color,
                    },
                };
                Entry.hw.update();
                sq['SET'] = {};
                return promiseManager.sleep(Entry.CodeWiz.defaultWaitTime);
            },
        },
        CodeWiz_OLED_drawRect: {
            // Block UI : "OLED에 시작(%1,%2)에서 가로%3 세로%4인 직사각형 그리기(채우기%5)색%6%7",
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
                    type: 'Dropdown',
                    options: [
                        ['false', '0'],
                        ['true', '1'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['black', '0'],
                        ['white', '1'],
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
                params: ['0', '0', '10', '10', null, null],
                type: 'CodeWiz_OLED_drawRect',
            },
            paramsKeyMap: {
                SX: 0,
                SY: 1,
                WIDTH: 2,
                HEIGHT: 3,
                ISFILL: 4,
                COLOR: 5,
            },
            class: 'CodeWiz_OLED',
            isNotFor: ['CodeWiz'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = 0xec;
                let _sx = script.getNumberValue('SX', script);
                _sx = Math.round(_sx);
                if (_sx < 0) {
                    _sx = 0;
                } else if (_sx > 128) {
                    _sx = 128;
                }
                let _sy = script.getNumberValue('SY', script);
                _sy = Math.round(_sy);
                if (_sy < 0) {
                    _sy = 0;
                } else if (_sy > 64) {
                    _sy = 64;
                }
                let _width = script.getNumberValue('WIDTH', script);
                _width = Math.round(_width);
                if (_width < 0) {
                    _width = 0;
                } else if (_width > 128) {
                    _width = 128;
                }
                let _height = script.getNumberValue('HEIGHT', script);
                _height = Math.round(_height);
                if (_height < 0) {
                    _height = 0;
                } else if (_height > 64) {
                    _height = 64;
                }
                let _isFill = script.getNumberValue('ISFILL', script);
                let _color = script.getNumberValue('COLOR', script);
                if (!sq['SET']) {
                    sq['SET'] = {};
                }
                sq['SET'][port] = {
                    type: Entry.CodeWiz.sensorTypes.OLED,
                    value: {
                        opcode: 14,
                        x: _sx,
                        y: _sy,
                        width: _width,
                        height: _height,
                        isFill: _isFill,
                        color: _color,
                    },
                };
                Entry.hw.update();
                sq['SET'] = {};
                return promiseManager.sleep(Entry.CodeWiz.defaultWaitTime);
            },
        },
        CodeWiz_OLED_drawCircle: {
            // Block UI : "OLED에 시작(%1,%2)에서 반지름%3인 원 그리기(채우기%4)색%5%6",
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
                    type: 'Dropdown',
                    options: [
                        ['false', '0'],
                        ['true', '1'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['black', '0'],
                        ['white', '1'],
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
                params: ['30', '30', '10', null, null],
                type: 'CodeWiz_OLED_drawCircle',
            },
            paramsKeyMap: {
                RX: 0,
                RY: 1,
                RAD: 2,
                ISFILL: 3,
                COLOR: 4,
            },
            class: 'CodeWiz_OLED',
            isNotFor: ['CodeWiz'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = 0xeb;
                let _rx = script.getNumberValue('RX', script);
                _rx = Math.round(_rx);
                if (_rx < 0) {
                    _rx = 0;
                } else if (_rx > 128) {
                    _rx = 128;
                }
                let _ry = script.getNumberValue('RY', script);
                _ry = Math.round(_ry);
                if (_ry < 0) {
                    _ry = 0;
                } else if (_ry > 64) {
                    _ry = 64;
                }
                let _rad = script.getNumberValue('RAD', script);
                _rad = Math.round(_rad);
                if (_rad < 0) {
                    _rad = 0;
                } else if (_rad > 255) {
                    _rad = 255;
                }
                let _isFill = script.getNumberValue('ISFILL', script);
                let _color = script.getNumberValue('COLOR', script);
                if (!sq['SET']) {
                    sq['SET'] = {};
                }
                sq['SET'][port] = {
                    type: Entry.CodeWiz.sensorTypes.OLED,
                    value: {
                        opcode: 15,
                        x: _rx,
                        y: _ry,
                        rad: _rad,
                        isFill: _isFill,
                        color: _color,
                    },
                };
                Entry.hw.update();
                sq['SET'] = {};
                return promiseManager.sleep(Entry.CodeWiz.defaultWaitTime);
            },
        },
        CodeWiz_OLED_drawPoligon: {
            // Block UI : "OLED에 왼쪽(%1,%2) 위(%3,%4) 오른쪽(%5,%6) 점으로 삼각형 그리기(채우기%7)색%8%9",
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
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['false', '0'],
                        ['true', '1'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['black', '0'],
                        ['white', '1'],
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
                params: ['0', '40', '60', '0', '123', '0', null, null],
                type: 'CodeWiz_OLED_drawPoligon',
            },
            paramsKeyMap: {
                X1: 0,
                Y1: 1,
                X2: 2,
                Y2: 3,
                X3: 4,
                Y3: 5,
                ISFILL: 6,
                COLOR: 7,
            },
            class: 'CodeWiz_OLED',
            isNotFor: ['CodeWiz'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = 0xea;
                let _x1 = script.getNumberValue('X1', script);
                _x1 = Math.round(_x1);
                if (_x1 < 0) {
                    _x1 = 0;
                } else if (_x1 > 128) {
                    _x1 = 128;
                }
                let _y1 = script.getNumberValue('Y1', script);
                _y1 = Math.round(_y1);
                if (_y1 < 0) {
                    _y1 = 0;
                } else if (_y1 > 64) {
                    _y1 = 64;
                }
                let _x2 = script.getNumberValue('X2', script);
                _x2 = Math.round(_x2);
                if (_x2 < 0) {
                    _x2 = 0;
                } else if (_x2 > 128) {
                    _x2 = 128;
                }
                let _y2 = script.getNumberValue('Y2', script);
                _y2 = Math.round(_y2);
                if (_y2 < 0) {
                    _y2 = 0;
                } else if (_y2 > 64) {
                    _y2 = 64;
                }
                let _x3 = script.getNumberValue('X3', script);
                _x3 = Math.round(_x3);
                if (_x3 < 0) {
                    _x3 = 0;
                } else if (_x3 > 128) {
                    _x3 = 128;
                }
                let _y3 = script.getNumberValue('Y3', script);
                _y3 = Math.round(_y3);
                if (_y3 < 0) {
                    _y3 = 0;
                } else if (_y3 > 64) {
                    _y3 = 64;
                }
                let _isFill = script.getNumberValue('ISFILL', script);
                let _color = script.getNumberValue('COLOR', script);
                if (!sq['SET']) {
                    sq['SET'] = {};
                }
                sq['SET'][port] = {
                    type: Entry.CodeWiz.sensorTypes.OLED,
                    value: {
                        opcode: 16,
                        x1: _x1,
                        y1: _y1,
                        x2: _x2,
                        y2: _y2,
                        x3: _x3,
                        y3: _y3,
                        isFill: _isFill,
                        color: _color,
                    },
                };
                Entry.hw.update();
                sq['SET'] = {};
                return promiseManager.sleep(Entry.CodeWiz.defaultWaitTime);
            },
        },

        CodeWiz_DIGITAL_OUTPUT_setup: {
            // Block UI : "터치센서 출력으로 사용%1",
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
                params: [],
                type: 'CodeWiz_DIGITAL_OUTPUT_setup',
            },
            paramsKeyMap: {},
            class: 'CodeWiz_DIGITAL_OUTPUT',
            isNotFor: ['CodeWiz'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = 0xe9;

                if (!sq['SET']) {
                    sq['SET'] = {};
                }
                sq['SET'][port] = {
                    type: Entry.CodeWiz.sensorTypes.DIGITAL_OUTPUT,
                    value: {
                        opcode: 0,
                    },
                };
                Entry.hw.update();
                sq['SET'] = {};
                return promiseManager.sleep(Entry.CodeWiz.defaultWaitTime);
            },
        },
        CodeWiz_DIGITAL_OUTPUT_digitalWrite: {
            // Block UI : "터치센서 디지털 %1(으)로 %2내보내기%3",
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['13', '13'],
                        ['14', '14'],
                        ['15', '15'],
                        ['27', '27'],
                        ['32', '32'],
                        ['33', '33'],
                    ],
                    value: '13',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['LOW', '0'],
                        ['HIGH', '1'],
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
                params: [null, null],
                type: 'CodeWiz_DIGITAL_OUTPUT_digitalWrite',
            },
            paramsKeyMap: {
                PIN: 0,
                VALUE: 1,
            },
            class: 'CodeWiz_DIGITAL_OUTPUT',
            isNotFor: ['CodeWiz'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = 0xe8;
                let _pin = script.getNumberValue('PIN', script);
                let _val = script.getNumberValue('VALUE', script);
                if (!sq['SET']) {
                    sq['SET'] = {};
                }
                sq['SET'][port] = {
                    type: Entry.CodeWiz.sensorTypes.DIGITAL_OUTPUT,
                    value: {
                        opcode: 1,
                        pin: _pin,
                        output: _val,
                    },
                };
                Entry.hw.update();
                sq['SET'] = {};
                return promiseManager.sleep(Entry.CodeWiz.defaultWaitTime);
            },
        },
        CodeWiz_DIGITAL_OUTPUT_pwmWrite: {
            // Block UI : "터치센서 PWM %1(으)로 %2내보내기(0~255)%3",
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['13', '13'],
                        ['14', '14'],
                        ['15', '15'],
                        ['27', '27'],
                        ['32', '32'],
                        ['33', '33'],
                    ],
                    value: '13',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null, '0'],
                type: 'CodeWiz_DIGITAL_OUTPUT_pwmWrite',
            },
            paramsKeyMap: {
                PIN: 0,
                VALUE: 1,
            },
            class: 'CodeWiz_DIGITAL_OUTPUT',
            isNotFor: ['CodeWiz'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = 0xe7; // 위에서 ff~e5까지 씀 추가할거면 e4부터 쓸것

                let _pin = script.getNumberValue('PIN', script);

                let _val = script.getNumberValue('VALUE', script);
                _val = Math.round(_val);
                if (_val < 0) {
                    _val = 0;
                } else if (_val > 255) {
                    _val = 255;
                }

                if (!sq['SET']) {
                    sq['SET'] = {};
                }
                sq['SET'][port] = {
                    type: Entry.CodeWiz.sensorTypes.DIGITAL_OUTPUT,
                    value: {
                        opcode: 2,
                        pin: _pin,
                        writeVal: _val,
                    },
                };
                Entry.hw.update();
                sq['SET'] = {};
                return promiseManager.sleep(Entry.CodeWiz.defaultWaitTime);
            },
        },

        //endregion CodeWiz 코드위즈
    };
};

module.exports = Entry.CodeWiz;
