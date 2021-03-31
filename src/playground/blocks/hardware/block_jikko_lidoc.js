'use strict';

Entry.jikko_lidoc = {
    id: '47.2',
    name: 'jikko_lidoc',
    url: 'http://www.makeitall.co.kr',
    imageName: 'jikko_lidoc.png',
    title: {
        ko: '직코&리닥 CPR',
        en: 'jikko_lidoc',
    },
    Static: {
        BUTTON_PRESS_VALUE: 0,
    },

    //정지시 초기화 함수
    setZero: function() {
        if (!Entry.hw.sendQueue.SET) {
            Entry.hw.sendQueue = {
                GET: {},
                SET: {},
            };
        } else {
            var keySet = Object.keys(Entry.hw.sendQueue.SET);
            keySet.forEach((key) => {
                Entry.hw.sendQueue.SET[key].data = 0;
                Entry.hw.sendQueue.SET[key].time = new Date().getTime();
            });
        }
        Entry.hw.update();
    },
    sensorTypes: {
        ALIVE: 0,
        DIGITAL: 1,
        ANALOG: 2,
        PWM: 3,
        TONE: 5,
        LCD: 11,
        LCDCLEAR: 12,
        LCDINIT: 17,
        NEOPIXELINIT: 20,
        NEOPIXELBRIGHT: 21,
        NEOPIXEL: 22,
        NEOPIXELALL: 23,
        NEOPIXELCLEAR: 24,
        LOADINIT: 35,
        LOADSCALE: 36,
        LOADVALUE: 37,
    },
    toneTable: {
        '0': 0,
        C: 1,
        CS: 2,
        D: 3,
        DS: 4,
        E: 5,
        F: 6,
        FS: 7,
        G: 8,
        GS: 9,
        A: 10,
        AS: 11,
        B: 12,
    },
    toneMap: {
        '1': [33, 65, 131, 262, 523, 1046, 2093, 4186],
        '2': [35, 69, 139, 277, 554, 1109, 2217, 4435],
        '3': [37, 73, 147, 294, 587, 1175, 2349, 4699],
        '4': [39, 78, 156, 311, 622, 1245, 2849, 4978],
        '5': [41, 82, 165, 330, 659, 1319, 2637, 5274],
        '6': [44, 87, 175, 349, 698, 1397, 2794, 5588],
        '7': [46, 92, 185, 370, 740, 1480, 2960, 5920],
        '8': [49, 98, 196, 392, 784, 1568, 3136, 6272],
        '9': [52, 104, 208, 415, 831, 1661, 3322, 6645],
        '10': [55, 110, 220, 440, 880, 1760, 3520, 7040],
        '11': [58, 117, 233, 466, 932, 1865, 3729, 7459],
        '12': [62, 123, 247, 494, 988, 1976, 3951, 7902],
    },
    direction: {
        CENTER: 0,
        UP: 1,
        LEFT: 2,
        RIGHT: 3,
        DOWN: 4,
        LEFT_UP: 5,
        LEFT_DOWN: 6,
        RIGHT_UP: 7,
        RIGHT_DOWN: 8,
    },
    highList: ['high', '1', 'on'],
    lowList: ['low', '0', 'off'],
    BlockState: {},
};
Entry.jikko_lidoc.setLanguage = function() {
    return {
        ko: {
            template: {
                jikko_lidoc_toggle_on: '켜기',
                jikko_lidoc_toggle_off: '끄기',
                jikko_lidoc_lcd_first_line: '첫 번째',
                jikko_lidoc_lcd_seconds_line: '두 번째',
                jikko_lidoc_get_analog_value: '아날로그 %1 핀 읽기',
                jikko_lidoc_get_pullup: '풀업 저항 사용 버튼 %1 핀 눌림 상태',
                jikko_lidoc_get_button: '버튼 %1 핀 눌림 상태',
                jikko_lidoc_get_analog_mapping:
                    '아날로그 %1 번 핀 센서 값의 범위를 %2 ~ %3 에서 %4 ~ %5 로 바꾼 값',
                jikko_lidoc_mapping1: '%1 값을 %2 ~ %3 사이로 제한한 값',
                jikko_lidoc_mapping2: '%1 값을 %2 ~ %3 범위에서 %4 ~ %5 범위로 변환',
                jikko_lidoc_get_digital: '디지털 %1 핀 읽기',
                jikko_lidoc_get_digital_toggle: '디지털 %1 핀 센서 값',
                jikko_lidoc_set_digital_toggle: '디지털 %1 핀 %2 %3',
                jikko_lidoc_set_led_toggle: 'LED 13 핀 %1 %2',
                jikko_lidoc_set_digital_pwm: 'LED (PWM %1 핀)밝기 %2 출력 (0 ~ 255)%3',

                jikko_lidoc_set_digital_buzzer_toggle: '피에조부저 12핀 %1 %2',
                jikko_lidoc_set_digital_buzzer_volume:
                    '피에조부저 (PWM %1 핀) 음량 %2 출력 (0 ~ 255) %3',
                jikko_lidoc_set_digital_buzzer: '피에조부저 12핀 %1 %2 음 %3 박자 연주 %4',

                jikko_lidoc_set_neopixel_init:
                    '네오픽셀 LED 시작하기 설정 (10 핀에 %1 개의 LED 연결) %2',
                jikko_lidoc_set_neopixel_bright: '네오픽셀 LED 밝기 %1 으로 설정 (0 ~ 255) %2',
                jikko_lidoc_set_neopixel: '네오픽셀 LED %1 번째 LED 색 %2 출력 %3',
                jikko_lidoc_set_neopixel_all: '네오픽셀 LED 모든 LED 색 %1 출력 %2',
                jikko_lidoc_set_neopixel_clear: '네오픽셀 LED 모든 LED 끄기 %1',

                jikko_lidoc_lcd_init: 'I2C LCD 시작하기 설정 (주소 %1 ,열 %2, 행 %3) %4',
                jikko_lidoc_get_lcd_row: '%1',
                jikko_lidoc_get_lcd_col: '%1',
                jikko_lidoc_module_digital_lcd: 'LCD화면 %1 열 %2 행 부터 %3 출력 %4',
                jikko_lidoc_lcd_clear: 'LCD 화면 지우기 %1',

                jikko_lidoc_load_init: 'HX711 로드셀 시작하기 설정 (DOUT 6핀, SCK 7핀) %1',
                jikko_lidoc_load_scale: 'HX711 로드셀 보정하기 %1 %2',
                jikko_lidoc_load_value: 'HX711 로드셀 값',
            },
        },
        en: {
            template: {
                jikko_lidoc_toggle_on: '켜기',
                jikko_lidoc_toggle_off: '끄기',
                jikko_lidoc_lcd_first_line: '첫 번째',
                jikko_lidoc_lcd_seconds_line: '두 번째',
                jikko_lidoc_get_analog_value: '아날로그 %1 핀 읽기',
                jikko_lidoc_get_pullup: '풀업 저항 사용 버튼 %1 핀 눌림 상태',
                jikko_lidoc_get_button: '버튼 %1 핀 눌림 상태',
                jikko_lidoc_get_analog_mapping:
                    '아날로그 %1 번 핀 센서 값의 범위를 %2 ~ %3 에서 %4 ~ %5 로 바꾼 값',
                jikko_lidoc_mapping1: '%1 값을 %2 ~ %3 사이로 제한한 값',
                jikko_lidoc_mapping2: '%1 값을 %2 ~ %3 범위에서 %4 ~ %5 범위로 변환',
                jikko_lidoc_get_digital: '디지털 %1 핀 읽기',
                jikko_lidoc_get_digital_toggle: '디지털 %1 핀 센서 값',
                jikko_lidoc_set_digital_toggle: '디지털 %1 핀 %2 %3',
                jikko_lidoc_set_led_toggle: 'LED 13 핀 %1 %2',
                jikko_lidoc_set_digital_pwm: 'LED (PWM %1 핀)밝기 %2 출력 (0 ~ 255)%3',

                jikko_lidoc_set_digital_buzzer_toggle: '피에조부저 12핀 %1 %2',
                jikko_lidoc_set_digital_buzzer_volume:
                    '피에조부저 (PWM %1 핀) 음량 %2 출력 (0 ~ 255) %3',
                jikko_lidoc_set_digital_buzzer: '피에조부저 12핀 %1 %2 음 %3 박자 연주 %4',

                jikko_lidoc_set_neopixel_init:
                    '네오픽셀 LED 시작하기 설정 (10 핀에 %1 개의 LED 연결) %2',
                jikko_lidoc_set_neopixel_bright: '네오픽셀 LED 밝기 %1 으로 설정 (0 ~ 255) %2',
                jikko_lidoc_set_neopixel: '네오픽셀 LED %1 번째 LED 색 %2 출력 %3',
                jikko_lidoc_set_neopixel_all: '네오픽셀 LED 모든 LED 색 %1 출력 %2',
                jikko_lidoc_set_neopixel_clear: '네오픽셀 LED 모든 LED 끄기 %1',

                jikko_lidoc_lcd_init: 'I2C LCD 시작하기 설정 (주소 %1 ,열 %2, 행 %3) %4',
                jikko_lidoc_get_lcd_row: '%1',
                jikko_lidoc_get_lcd_col: '%1',
                jikko_lidoc_module_digital_lcd: 'LCD화면 %1 열 %2 행 부터 %3 출력 %4',
                jikko_lidoc_lcd_clear: 'LCD 화면 지우기 %1',

                jikko_lidoc_load_init: 'HX711 로드셀 시작하기 설정 (DOUT 6핀, SCK 7핀) %1',
                jikko_lidoc_load_scale: 'HX711 로드셀 보정하기 %1 %2',
                jikko_lidoc_load_value: 'HX711 로드셀 값',
            },
        },
    };
};
Entry.jikko_lidoc.blockMenuBlocks = [
    'jikko_lidoc_set_digital_toggle',
    'jikko_lidoc_set_led_toggle',
    //  'jikko_lidoc_set_digital_pwm',

    'jikko_lidoc_set_digital_buzzer_toggle',
    'jikko_lidoc_set_digital_buzzer',
    'jikko_lidoc_set_neopixel_init',
    'jikko_lidoc_set_neopixel_bright',
    'jikko_lidoc_set_neopixel',
    'jikko_lidoc_set_neopixel_all',
    'jikko_lidoc_set_neopixel_clear',

    'jikko_lidoc_lcd_init',
    'jikko_lidoc_module_digital_lcd',
    'jikko_lidoc_get_lcd_row',
    'jikko_lidoc_get_lcd_col',
    'jikko_lidoc_lcd_clear',

    'jikko_lidoc_load_init',
    'jikko_lidoc_load_scale',
    'jikko_lidoc_load_value',

    // 'jikko_lidoc_get_digital_bluetooth',
    // 'jikko_lidoc_module_digital_bluetooth',
];
Entry.jikko_lidoc.getBlocks = function() {
    var tx;
    var din;
    // var clk;
    // var cs;
    var dout;
    var sck;
    var joyx, joyy, joyz;
    var joyx2, joyy2, joyz2;
    var portpin1, portpin2, portpin3;
    var ss;
    var speed1 = 14;
    var speed2 = 14;
    var speed3 = 14;
    var num = 0;

    return {
        jikko_lidoc_list_analog_basic: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['0', '0'],
                        ['1', '1'],
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['5', '5'],
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
                PORT: 0,
            },
            func: function(sprite, script) {
                return script.getField('PORT');
            },
        },
        jikko_lidoc_list_digital_basic: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['0', '0'],
                        ['1', '1'],
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['5', '5'],
                        ['6', '6'],
                        ['7', '7'],
                        ['8', '8'],
                        ['9', '9'],
                        ['10', '10'],
                        ['11', '11'],
                        ['12', '12'],
                        ['13', '13'],
                    ],
                    value: '10',
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
        },
        jikko_lidoc_list_digital_octave: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
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
                        ['8', '8'],
                    ],
                    value: '3',
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
                OCTAVE: 0,
            },
            func: function(sprite, script) {
                return script.getField('OCTAVE');
            },
        },
        jikko_lidoc_list_digital_pwm: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['3', '3'],
                        ['5', '5'],
                        ['6', '6'],
                        ['9', '9'],
                        ['10', '10'],
                        ['11', '11'],
                    ],
                    value: '11',
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
        },
        jikko_lidoc_list_digital_toggle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.jikko_lidoc_toggle_on, 'on'],
                        [Lang.template.jikko_lidoc_toggle_off, 'off'],
                    ],
                    value: 'on',
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
                OPERATOR: 0,
            },
            func: function(sprite, script) {
                return script.getStringField('OPERATOR');
            },
        },
        jikko_lidoc_list_digital_toggle_en: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['HIGH', 'on'],
                        ['LOW', 'off'],
                    ],
                    value: 'on',
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
                OPERATOR: 0,
            },
            func: function(sprite, script) {
                return script.getStringField('OPERATOR');
            },
        },
        jikko_lidoc_list_digital_tone: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.silent, '0'],
                        [Lang.Blocks.do_name, 'C'],
                        [Lang.Blocks.do_sharp_name, 'CS'],
                        [Lang.Blocks.re_name, 'D'],
                        [Lang.Blocks.re_sharp_name, 'DS'],
                        [Lang.Blocks.mi_name, 'E'],
                        [Lang.Blocks.fa_name, 'F'],
                        [Lang.Blocks.fa_sharp_name, 'FS'],
                        [Lang.Blocks.sol_name, 'G'],
                        [Lang.Blocks.sol_sharp_name, 'GS'],
                        [Lang.Blocks.la_name, 'A'],
                        [Lang.Blocks.la_sharp_name, 'AS'],
                        [Lang.Blocks.si_name, 'B'],
                    ],
                    value: 'C',
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
        jikko_lidoc_set_neopixel_init: {
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
                        params: ['4'],
                    },
                    null,
                ],
                type: 'jikko_lidoc_set_neopixel_init',
            },
            paramsKeyMap: {
                NUM: 0,
            },
            class: 'neo',
            isNotFor: ['jikko_lidoc'],
            func: function(sprite, script) {
                var port = 10;
                var value = script.getNumberValue('NUM');
                if (!script.isStart) {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;

                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.jikko_lidoc.sensorTypes.NEOPIXELINIT,
                        data: value,
                        time: new Date().getTime(),
                    };
                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [{}],
            },
        },
        jikko_lidoc_set_neopixel_bright: {
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
                        params: ['255'],
                    },
                    null,
                ],
                type: 'jikko_lidoc_set_neopixel_bright',
            },
            paramsKeyMap: {
                NUM: 0,
            },
            class: 'neo',
            isNotFor: ['jikko_lidoc'],
            func: function(sprite, script) {
                var port = 10;
                var value = script.getNumberValue('NUM');

                value = Math.round(value);
                value = Math.min(value, 255);
                value = Math.max(value, 0);

                if (!script.isStart) {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;

                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.jikko_lidoc.sensorTypes.NEOPIXELBRIGHT,
                        data: value,
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [{}],
            },
        },
        jikko_lidoc_set_neopixel: {
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
                params: [
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    null,
                    null,
                ],
                type: 'jikko_lidoc_set_neopixel',
            },
            paramsKeyMap: {
                NUM: 0,
                COLOR: 1,
            },
            class: 'neo',
            isNotFor: ['jikko_lidoc'],
            func: function(sprite, script) {
                //var sq = Entry.hw.sendQueue;
                var port = 10;
                var num = script.getNumberValue('NUM', script);
                var value = script.getStringField('COLOR', script);

                let r = parseInt(value.substr(1, 2), 16);
                let g = parseInt(value.substr(3, 2), 16);
                let b = parseInt(value.substr(5, 2), 16);

                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;

                    r = Math.round(r);
                    r = Math.min(r, 255);
                    r = Math.max(r, 0);

                    g = Math.round(g);
                    g = Math.min(g, 255);
                    g = Math.max(g, 0);

                    b = Math.round(b);
                    b = Math.min(b, 255);
                    b = Math.max(b, 0);

                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.jikko_lidoc.sensorTypes.NEOPIXEL,
                        data: {
                            num: num,
                            r: r,
                            g: g,
                            b: b,
                        },
                        time: new Date().getTime(),
                    };
                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, 10);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [{}],
            },
        },
        jikko_lidoc_set_neopixel_all: {
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
                params: [null, null],
                type: 'jikko_lidoc_set_neopixel_all',
            },
            paramsKeyMap: {
                COLOR: 0,
            },
            class: 'neo',
            isNotFor: ['jikko_lidoc'],
            func: function(sprite, script) {
                var port = 10;
                var value = script.getStringField('COLOR', script);

                let r = parseInt(value.substr(1, 2), 16);
                let g = parseInt(value.substr(3, 2), 16);
                let b = parseInt(value.substr(5, 2), 16);

                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;
                    r = Math.round(r);
                    r = Math.min(r, 255);
                    r = Math.max(r, 0);

                    g = Math.round(g);
                    g = Math.min(g, 255);
                    g = Math.max(g, 0);

                    b = Math.round(b);
                    b = Math.min(b, 255);
                    b = Math.max(b, 0);

                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.jikko_lidoc.sensorTypes.NEOPIXELALL,
                        data: {
                            r: r,
                            g: g,
                            b: b,
                        },
                        time: new Date().getTime(),
                    };
                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, 10);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [{}],
            },
        },

        jikko_lidoc_set_neopixel_clear: {
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
                params: [null],
                type: 'jikko_lidoc_set_neopixel_clear',
            },
            paramsKeyMap: {},
            class: 'neo',
            isNotFor: ['jikko_lidoc'],
            func: function(sprite, script) {
                var port = 10;
                if (!script.isStart) {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;

                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.jikko_lidoc.sensorTypes.NEOPIXELCLEAR,
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [{}],
            },
        },
        jikko_lidoc_lcd_list_init: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['0x27', '0'],
                        ['0x3F', '1'],
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
                LINE: 0,
            },
            func: function(sprite, script) {
                return script.getField('LINE');
            },
        },
        jikko_lidoc_list_digital_lcd: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.jikko_lidoc_lcd_first_line, '0'],
                        [Lang.template.jikko_lidoc_lcd_seconds_line, '1'],
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
                LINE: 0,
            },
            func: function(sprite, script) {
                return script.getField('LINE');
            },
        },
        jikko_lidoc_get_lcd_row: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['0', '0'],
                        ['1', '1'],
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
                ROW: 0,
            },
            func(sprite, script) {
                return script.getStringField('ROW');
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
                                    ['0', '0'],
                                    ['1', '1'],
                                ],
                                value: '0',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'jikko_lidoc_get_lcd_row',
                    },
                ],
            },
        },

        jikko_lidoc_get_lcd_col: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['0', '0'],
                        ['1', '1'],
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['5', '5'],
                        ['6', '6'],
                        ['7', '7'],
                        ['8', '8'],
                        ['9', '9'],
                        ['10', '10'],
                        ['11', '11'],
                        ['12', '12'],
                        ['13', '13'],
                        ['14', '14'],
                        ['15', '15'],
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
                ROW: 0,
            },
            func(sprite, script) {
                return script.getStringField('ROW');
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
                                    ['0', '0'],
                                    ['1', '1'],
                                    ['2', '2'],
                                    ['3', '3'],
                                    ['4', '4'],
                                    ['5', '5'],
                                    ['6', '6'],
                                    ['7', '7'],
                                    ['8', '8'],
                                    ['9', '9'],
                                    ['10', '10'],
                                    ['11', '11'],
                                    ['12', '12'],
                                    ['13', '13'],
                                    ['14', '14'],
                                    ['15', '15'],
                                ],
                                value: '0',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'jikko_lidoc_get_lcd_col',
                    },
                ],
            },
        },
        jikko_lidoc_get_analog_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: Lang.template.jikko_lidoc_get_analog_value,
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'jikko_lidoc_list_analog_basic',
                    },
                ],
                type: 'jikko_lidoc_get_analog_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'jikko_lidocPin',
            isNotFor: ['jikko_lidoc'],
            func: function(sprite, script) {
                var port = script.getValue('PORT', script);
                var ANALOG = Entry.hw.portData.ANALOG;

                if (port[0] === 'A') port = port.substring(1);

                return ANALOG ? ANALOG[port] || 0 : 0;
            },
            syntax: { js: [], py: ['jikko_lidoc.get_analog_value(%1)'] },
        },

        jikko_lidoc_get_analog_mapping: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: Lang.template.jikko_lidoc_get_analog_mapping,
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
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'jikko_lidoc_list_analog_basic',
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['1023'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['100'],
                    },
                ],
                type: 'jikko_lidoc_get_analog_mapping',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE2: 1,
                VALUE3: 2,
                VALUE4: 3,
                VALUE5: 4,
            },
            class: 'jikko_lidocPin',
            isNotFor: ['jikko_lidoc'],
            func: function(sprite, script) {
                var port = script.getValue('PORT', script);
                var result = 0;
                var ANALOG = Entry.hw.portData.ANALOG;
                var value2 = script.getNumberValue('VALUE2', script);
                var value3 = script.getNumberValue('VALUE3', script);
                var value4 = script.getNumberValue('VALUE4', script);
                var value5 = script.getNumberValue('VALUE5', script);

                if (port[0] === 'A') {
                    port = port.substring(1);
                }
                result = ANALOG ? ANALOG[port] || 0 : 0;
                if (value2 > value3) {
                    var swap = value2;
                    value2 = value3;
                    value3 = swap;
                }
                if (value4 > value5) {
                    var swap = value4;
                    value4 = value5;
                    value5 = swap;
                }
                result -= value2;
                result = result * ((value5 - value4) / (value3 - value2));
                result += value4;
                result = Math.min(value5, result);
                result = Math.max(value4, result);

                return result;
            },
            syntax: {
                js: [],
                py: ['jikko_lidoc.get_analog_mapping(%1, %2, %3, %4, %5)'],
            },
        },

        jikko_lidoc_get_digital: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: Lang.template.jikko_lidoc_get_digital,
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
                        type: 'jikko_lidoc_list_digital_basic',
                    },
                ],
                type: 'jikko_lidoc_get_digital',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'jikko_lidocPin',
            isNotFor: ['jikko_lidoc'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var DIGITAL = Entry.hw.portData.DIGITAL;

                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                if (Entry.hw.sendQueue.SET[port]) {
                    return Entry.hw.sendQueue.SET[port].data;
                } else {
                    Entry.hw.sendQueue['GET'][Entry.jikko_lidoc.sensorTypes.DIGITAL] = {
                        port: port,
                        time: new Date().getTime(),
                    };
                }

                return DIGITAL ? DIGITAL[port] || 0 : 0;
            },
            syntax: { js: [], py: ['jikko_lidoc.get_digital(%1)'] },
        },
        jikko_lidoc_get_digital_toggle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: Lang.template.jikko_lidoc_get_digital_toggle,
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'jikko_lidoc_list_digital_basic',
                    },
                ],
                type: 'jikko_lidoc_get_digital_toggle',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'jikko_lidocGet',
            isNotFor: ['jikko_lidoc'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var DIGITAL = Entry.hw.portData.DIGITAL;

                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                Entry.hw.sendQueue['GET'][Entry.jikko_lidoc.sensorTypes.DIGITAL] = {
                    port: port,
                    time: new Date().getTime(),
                };

                return DIGITAL ? DIGITAL[port] || 0 : 0;
            },
            syntax: { js: [], py: ['jikko_lidoc.get_digital_toggle(%1)'] },
        },

        jikko_lidoc_set_digital_toggle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.jikko_lidoc_set_digital_toggle,
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
                params: [
                    {
                        type: 'jikko_lidoc_list_digital_basic',
                    },
                    {
                        type: 'jikko_lidoc_list_digital_toggle_en',
                    },
                    null,
                ],
                type: 'jikko_lidoc_set_digital_toggle',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'jikko_lidocPin',
            isNotFor: ['jikko_lidoc'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var value = script.getValue('VALUE');

                if (typeof value === 'string') {
                    value = value.toLowerCase();
                }
                if (Entry.jikko_lidoc.highList.indexOf(value) > -1) {
                    value = 255;
                } else if (Entry.jikko_lidoc.lowList.indexOf(value) > -1) {
                    value = 0;
                } else {
                    throw new Error();
                }
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.jikko_lidoc.sensorTypes.DIGITAL,
                    data: value,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: { js: [], py: ['jikko_lidoc.set_digital_toggle(%1, %2)'] },
        },
        jikko_lidoc_set_led_toggle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
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
                params: [
                    {
                        type: 'jikko_lidoc_list_digital_toggle',
                    },
                    null,
                ],
                type: 'jikko_lidoc_set_led_toggle',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'jikko_lidocLed',
            isNotFor: ['jikko_lidoc'],
            func: function(sprite, script) {
                var port = 13;
                var value = script.getValue('VALUE');

                if (typeof value === 'string') {
                    value = value.toLowerCase();
                }
                if (Entry.jikko_lidoc.highList.indexOf(value) > -1) {
                    value = 255;
                } else if (Entry.jikko_lidoc.lowList.indexOf(value) > -1) {
                    value = 0;
                } else {
                    throw new Error();
                }
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.jikko_lidoc.sensorTypes.DIGITAL,
                    data: value,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: { js: [], py: ['jikko_lidoc.set_digital_toggle(%1, %2)'] },
        },
        jikko_lidoc_set_digital_pwm: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.jikko_lidoc_set_digital_pwm,
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
                params: [
                    {
                        type: 'jikko_lidoc_list_digital_pwm',
                        params: ['5'],
                    },
                    {
                        type: 'text',
                        params: ['255'],
                    },
                    null,
                ],
                type: 'jikko_lidoc_set_digital_pwm',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'jikko_lidocLed',
            isNotFor: ['jikko_lidoc'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var value = script.getNumberValue('VALUE');

                value = Math.round(value);
                value = Math.min(value, 255);
                value = Math.max(value, 0);
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.jikko_lidoc.sensorTypes.PWM,
                    data: value,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: { js: [], py: ['jikko_lidoc.set_digital_pwm(%1, %2)'] },
        },

        jikko_lidoc_set_digital_buzzer_toggle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
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
                params: [
                    {
                        type: 'jikko_lidoc_list_digital_toggle',
                    },

                    null,
                ],
                type: 'jikko_lidoc_set_digital_buzzer_toggle',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'jikko_lidocBuzzer',
            isNotFor: ['jikko_lidoc'],
            func: function(sprite, script) {
                var port = 12;
                var value = script.getValue('VALUE');

                if (typeof value === 'string') {
                    value = value.toLowerCase();
                }
                if (Entry.jikko_lidoc.highList.indexOf(value) > -1) {
                    value = 255;
                } else if (Entry.jikko_lidoc.lowList.indexOf(value) > -1) {
                    value = 0;
                } else {
                    throw new Error();
                }
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.jikko_lidoc.sensorTypes.DIGITAL,
                    data: value,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: {
                js: [],
                py: ['jikko_lidoc.set_digital_toggle(%1, %2, %3, %4)'],
            },
        },
        jikko_lidoc_set_digital_buzzer_volume: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
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
                params: [
                    {
                        type: 'jikko_lidoc_list_digital_pwm',
                        params: ['6'],
                    },
                    {
                        type: 'text',
                        params: ['255'],
                    },
                    null,
                ],
                type: 'jikko_lidoc_set_digital_buzzer_volume',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'jikko_lidocBuzzer',
            isNotFor: ['jikko_lidoc'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var value = script.getNumberValue('VALUE');

                value = Math.round(value);
                value = Math.min(value, 255);
                value = Math.max(value, 0);
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.jikko_lidoc.sensorTypes.PWM,
                    data: value,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: {
                js: [],
                py: ['jikko_lidoc.set_digital_toggle(%1, %2, %3, %4)'],
            },
        },
        jikko_lidoc_set_digital_buzzer: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.jikko_lidoc_set_digital_buzzer,
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
                    {
                        type: 'jikko_lidoc_list_digital_tone',
                    },
                    {
                        type: 'jikko_lidoc_list_digital_octave',
                    },
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'jikko_lidoc_set_digital_buzzer',
            },
            paramsKeyMap: {
                NOTE: 0,
                OCTAVE: 1,
                DURATION: 2,
            },
            class: 'jikko_lidocBuzzer',
            isNotFor: ['jikko_lidoc'],
            func: function(sprite, script) {
                var port = 12;
                var duration = script.getNumberValue('DURATION');
                var octave = script.getNumberValue('OCTAVE') - 1;
                var value = 0;

                if (!script.isStart) {
                    var note = script.getValue('NOTE');
                    if (!Entry.Utils.isNumber(note)) {
                        note = Entry.jikko_lidoc.toneTable[note];
                    }
                    if (note < 0) {
                        note = 0;
                    } else if (note > 12) {
                        note = 12;
                    }
                    if (duration < 0) {
                        duration = 0;
                    }
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
                    if (duration === 0) {
                        Entry.hw.sendQueue['SET'][port] = {
                            type: Entry.jikko_lidoc.sensorTypes.TONE,
                            data: 0,
                            time: new Date().getTime(),
                        };
                        return script.callReturn();
                    }
                    if (octave < 0) {
                        octave = 0;
                    } else if (octave > 8) {
                        octave = 8;
                    }
                    if (note != 0) {
                        value = Entry.jikko_lidoc.toneMap[note][octave];
                    }

                    duration = duration * 1000;
                    script.isStart = true;
                    script.timeFlag = 1;
                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.jikko_lidoc.sensorTypes.TONE,
                        data: {
                            value: value,
                            duration: duration,
                        },
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, duration + 32);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.jikko_lidoc.sensorTypes.TONE,
                        data: 0,
                        time: new Date().getTime(),
                    };
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: ['jikko_lidoc.set_digital_toggle(%1, %2, %3, %4)'],
            },
        },
        jikko_lidoc_lcd_init: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
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
                    {
                        type: 'jikko_lidoc_lcd_list_init',
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['16'],
                    },
                    {
                        type: 'text',
                        params: ['2'],
                    },
                    null,
                ],
                type: 'jikko_lidoc_lcd_init',
            },
            paramsKeyMap: {
                LIST: 0,
                COL: 1,
                LINE: 2,
            },
            class: 'jikko_lidocModule',
            isNotFor: ['jikko_lidoc'],
            func: function(sprite, script) {
                var list = script.getNumberValue('LIST');
                var col = script.getNumberValue('COL');
                var line = script.getValue('LINE');

                if (!script.isStart) {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 0.1 * 1000;

                    Entry.hw.sendQueue['SET'][1] = {
                        type: Entry.jikko_lidoc.sensorTypes.LCDINIT,
                        data: {
                            list: list,
                            col: col,
                            line: line,
                        },
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['jikko_lidoc.module_digital_lcd(%1, %2)'] },
        },
        jikko_lidoc_module_digital_lcd: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
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
                        type: 'jikko_lidoc_get_lcd_col',
                        params: ['0'],
                    },
                    {
                        type: 'jikko_lidoc_get_lcd_row',
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['Hello, jikko_lidoc'],
                    },
                    null,
                ],
                type: 'jikko_lidoc_module_digital_lcd',
            },
            paramsKeyMap: {
                COL: 0,
                ROW: 1,
                STRING: 2,
            },
            class: 'jikko_lidocModule',
            isNotFor: ['jikko_lidoc'],
            func: function(sprite, script) {
                var row = script.getNumberValue('ROW');
                var col = script.getNumberValue('COL');
                var text = script.getValue('STRING');

                if (!script.isStart) {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 100;

                    Entry.hw.sendQueue['SET'][1] = {
                        type: Entry.jikko_lidoc.sensorTypes.LCD,
                        data: {
                            line: row,
                            column: col,
                            text: text,
                        },
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['jikko_lidoc.module_digital_lcd(%1, %2)'] },
        },
        jikko_lidoc_lcd_clear: {
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
                type: 'jikko_lidoc_lcd_clear',
            },
            class: 'jikko_lidocModule',
            isNotFor: ['jikko_lidoc'],
            func(sprite, script) {
                if (!script.isStart) {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;

                    Entry.hw.sendQueue['SET'][1] = {
                        type: Entry.jikko_lidoc.sensorTypes.LCDCLEAR,
                        data: 0,
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [{}],
            },
        },

        jikko_lidoc_load_init: {
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
                params: [null],
                type: 'jikko_lidoc_load_init',
            },
            paramsKeyMap: {},
            class: 'load',
            isNotFor: ['jikko_lidoc'],
            func: function(sprite, script) {
                var port1 = 6;
                var port2 = 7;

                dout = port1;
                sck = port2;

                if (!script.isStart) {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;

                    Entry.hw.sendQueue['SET'][sck] = {
                        type: Entry.jikko_lidoc.sensorTypes.LOADINIT,
                        data: {
                            port1: port1,
                            port2: port2,
                        },
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [{}],
            },
        },

        jikko_lidoc_load_scale: {
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
                        params: ['-20000'],
                    },
                    null,
                ],
                type: 'jikko_lidoc_load_scale',
            },
            paramsKeyMap: {
                NUM: 0,
            },
            class: 'load',
            isNotFor: ['jikko_lidoc'],
            func: function(sprite, script) {
                var num = script.getNumberValue('NUM', script);

                if (!script.isStart) {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;

                    Entry.hw.sendQueue['SET'][sck] = {
                        type: Entry.jikko_lidoc.sensorTypes.LOADSCALE,
                        data: {
                            num: num,
                        },
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [{}],
            },
        },

        jikko_lidoc_load_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                type: 'jikko_lidoc_load_value',
            },
            paramsKeyMap: {},
            class: 'load',
            isNotFor: ['jikko_lidoc'],
            func: function(sprite, script) {
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                delete Entry.hw.sendQueue['SET'][sck];

                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                Entry.hw.sendQueue['GET'][Entry.jikko_lidoc.sensorTypes.LOADVALUE] = {
                    port: sck,
                    time: new Date().getTime(),
                };

                return Entry.hw.portData.LOADVALUE || 0;
            },
            syntax: {
                js: [],
                py: [{}],
            },
        },
    };
};

module.exports = Entry.jikko_lidoc;
