'use strict';

Entry.jikko = {
    id: 'FF.FF',
    url: 'http://www.my-company.org/',
    name: 'jikko',
    imageName: 'jikko.png',
    title: {
        ko: '직코',
        en: 'jikko',
    },
    setZero() {
        if (!Entry.hw.sendQueue.SET) {
            Entry.hw.sendQueue = {
                GET: {},
                SET: {},
            };
        } else {
            var keySet = Object.keys(Entry.hw.sendQueue.SET);
            keySet.forEach(function(key) {
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
        SERVO_PIN: 4,
        TONE: 5,
        PULSEIN: 6,
        ULTRASONIC: 7,
        TIMER: 8,
        LCDINIT: 41,
        LCD: 42,
        LCDCLEAR: 43,
        LCDEMOTION: 44,
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
    highList: ['high', '1', 'on'],
    lowList: ['low', '0', 'off'],
    duration: {
        TIME_1ms: 1,
        TIME_5ms: 5,
        TIME_10ms: 10,
        TIME_20ms: 20,
        TIME_50ms: 50,
        TIME_100ms: 100,
        TIME_200ms: 200, 
        TIME_500ms: 500,    
        TIME_600ms: 600,   
    }, 
    toByte: function(data) {
        switch (data) {
            case ' ':
                data = 32;
                break;
            case '!':
                data = 33;
                break;
            case '"':
                data = 34;
                break;
            case '#':
                data = 35;
                break;
            case '$':
                data = 36;
                break;
            case '%':
                data = 37;
                break;
            case '&':
                data = 38;
                break;
            case "'":
                data = 39;
                break;
            case '(':
                data = 40;
                break;
            case ')':
                data = 41;
                break;
            case '*':
                data = 42;
                break;
            case '+':
                data = 43;
                break;
            case ',':
                data = 44;
                break;
            case '-':
                data = 45;
                break;
            case '.':
                data = 46;
                break;
            case '/':
                data = 47;
                break;
            case '0':
                data = 48;
                break;
            case '1':
                data = 49;
                break;
            case '2':
                data = 50;
                break;
            case '3':
                data = 51;
                break;
            case '4':
                data = 52;
                break;
            case '5':
                data = 53;
                break;
            case '6':
                data = 54;
                break;
            case '7':
                data = 55;
                break;
            case '8':
                data = 56;
                break;
            case '9':
                data = 57;
                break;
            case ':':
                data = 58;
                break;
            case ';':
                data = 59;
                break;
            case '<':
                data = 60;
                break;
            case '=':
                data = 61;
                break;
            case '>':
                data = 62;
                break;
            case '?':
                data = 63;
                break;
            case '@':
                data = 64;
                break;
            case 'A':
                data = 65;
                break;
            case 'B':
                data = 66;
                break;
            case 'C':
                data = 67;
                break;
            case 'D':
                data = 68;
                break;
            case 'E':
                data = 69;
                break;
            case 'F':
                data = 70;
                break;
            case 'G':
                data = 71;
                break;
            case 'H':
                data = 72;
                break;
            case 'I':
                data = 73;
                break;
            case 'J':
                data = 74;
                break;
            case 'K':
                data = 75;
                break;
            case 'L':
                data = 76;
                break;
            case 'M':
                data = 77;
                break;
            case 'N':
                data = 78;
                break;
            case 'O':
                data = 79;
                break;
            case 'P':
                data = 80;
                break;
            case 'Q':
                data = 81;
                break;
            case 'R':
                data = 82;
                break;
            case 'S':
                data = 83;
                break;
            case 'T':
                data = 84;
                break;
            case 'U':
                data = 85;
                break;
            case 'V':
                data = 86;
                break;
            case 'W':
                data = 87;
                break;
            case 'X':
                data = 88;
                break;
            case 'Y':
                data = 89;
                break;
            case 'Z':
                data = 90;
                break;
            case '[':
                data = 91;
                break;
            case '\\':
                data = 92;
                break;
            case ']':
                data = 93;
                break;
            case '^':
                data = 94;
                break;
            case '_':
                data = 95;
                break;
            case '`':
                data = 96;
                break;
            case 'a':
                data = 97;
                break;
            case 'b':
                data = 98;
                break;
            case 'c':
                data = 99;
                break;
            case 'd':
                data = 100;
                break;
            case 'e':
                data = 101;
                break;
            case 'f':
                data = 102;
                break;
            case 'g':
                data = 103;
                break;
            case 'h':
                data = 104;
                break;
            case 'i':
                data = 105;
                break;
            case 'j':
                data = 106;
                break;
            case 'k':
                data = 107;
                break;
            case 'l':
                data = 108;
                break;
            case 'm':
                data = 109;
                break;
            case 'n':
                data = 110;
                break;
            case 'o':
                data = 111;
                break;
            case 'p':
                data = 112;
                break;
            case 'q':
                data = 113;
                break;
            case 'r':
                data = 114;
                break;
            case 's':
                data = 115;
                break;
            case 't':
                data = 116;
                break;
            case 'u':
                data = 117;
                break;
            case 'v':
                data = 118;
                break;
            case 'w':
                data = 119;
                break;
            case 'x':
                data = 120;
                break;
            case 'y':
                data = 121;
                break;
            case 'z':
                data = 122;
                break;
            case '{':
                data = 123;
                break;
            case '|':
                data = 124;
                break;
            case '}':
                data = 125;
                break;
            case '~':
                data = 126;
                break;
        }

        return data;
    },
    BlockState: {},
};

Entry.jikko.setLanguage = function() {
    return {
        ko: {
            template: {
                jikko_toggle_pwm: '디지털 %1 번 핀을 %2 (으)로 정하기 %3',
                jikko_toggle_led: '디지털 %1 번 핀 %2 %3',
                jikko_set_tone: '디지털 %1 번 핀의 버저를 %2 %3 음으로 %4 초 연주하기 %5',
                jikko_set_servo: '디지털 %1 번 핀의 서보모터를 %2 의 각도로 정하기 %3',
                jikko_get_ultrasonic_value: '초음파센서 (trig %1 echo %2) 거리(cm)',
                jikko_get_lcd_row: '%1',
				jikko_get_lcd_col: '%1',
				//jikko_set_I2CLCD_init: 'I2C LCD 시작하기 설정 (주소 0x%1, 열 %2, 행 %3) %4',
                jikko_set_I2CLCD_init: 'I2C LCD 시작하기 설정 %3',
                jikko_set_I2CLCD_print: 'I2C LCD의 %1 번째 줄, %2 번째 칸에 %3 출력하기 %4',
				jikko_set_I2CLCD_clear: 'I2C LCD의 화면 모두 지우기 %3',
				jikko_set_I2CLCD_emotion: 'I2C LCD의 %1 번째 줄, %2 번째 칸에 %3 이모티콘 출력하기 %4',
            },
        },
        en: {
            template: {
                jikko_toggle_pwm: 'Digital %1 Pin %2 %3',
                jikko_toggle_led: 'Digital %1 Pin %2 %3',
                jikko_set_tone: 'Play tone pin %1 on note %2 octave %3 beat %4 %5',
                jikko_set_servo: 'Set servo pin %1 angle as %2 %3',
                jikko_get_ultrasonic_value: 'Ultrasonic sensor (trig pin %1 echo pin %2) distance(cm)',
                jikko_get_lcd_row: '%1',
				jikko_get_lcd_col: '%1',
				//jikko_set_I2CLCD_init: 'Start I2C LCD setting (address 0x%1, col %2, row %3) %4',
                jikko_set_I2CLCD_init: 'Start I2C LCD setting %3',
                jikko_set_I2CLCD_print: 'I2C LCD의 %1 번째 줄, %2 번째 칸에 %3 출력하기 %4',
				jikko_set_I2CLCD_clear: 'I2C LCD의 화면 모두 지우기 %3',
				jikko_set_I2CLCD_emotion: 'I2C LCD의 %1 번째 줄, %2 번째 칸에 %3 이모티콘 출력하기 %4',
            },
        },
    };
};

Entry.jikko.blockMenuBlocks = [
    'jikko_toggle_pwm',
    'jikko_toggle_led',
    'jikko_set_tone',
    'jikko_set_servo',
    'jikko_get_ultrasonic_value',
    'jikko_get_lcd_row',
	'jikko_get_lcd_col',
	'jikko_set_I2CLCD_init',
	'jikko_set_I2CLCD_print',
	'jikko_set_I2CLCD_clear',
	'jikko_set_I2CLCD_emotion',
];

Entry.jikko.getBlocks = function() {
    return {
        arduino_get_digital_toggle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ARDUINO_on, 'on'],
                        [Lang.Blocks.ARDUINO_off, 'off'],
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
            func(sprite, script) {
                return script.getStringField('OPERATOR');
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
                                    [Lang.Blocks.ARDUINO_on, 'on'],
                                    [Lang.Blocks.ARDUINO_off, 'off'],
                                ],
                                value: 'on',
                                fontSize: 11,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValueUpperCase,
                                codeMap: 'Entry.CodeMap.Arduino.arduino_get_digital_toggle[0]',
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            },
                        ],
                        keyOption: 'arduino_get_digital_toggle',
                    },
                ],
            },
        },

        jikko_toggle_led: {
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
                        type: 'arduino_get_port_number',
                        params: [3],
                    },
                    {
                        type: 'arduino_get_digital_toggle',
                        params: ['on'],
                    },
                    null,
                ],
                type: 'jikko_toggle_led',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'jikkoBlock',
            //isNotFor: ['ArduinoExt'],
            func(sprite, script) {
                const port = script.getNumberValue('PORT');
                let value = script.getValue('VALUE');

                if (typeof value === 'string') {
                    value = value.toLowerCase();
                }
                if (Entry.ArduinoExt.highList.indexOf(value) > -1) {
                    value = 255;
                } else if (Entry.ArduinoExt.lowList.indexOf(value) > -1) {
                    value = 0;
                } else {
                    throw new Error();
                }
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[port] = {
                    type: Entry.ArduinoExt.sensorTypes.DIGITAL,
                    data: value,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.digitalWrite(%1, %2)',
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
                    },
                ],
            },
        },
        jikko_toggle_pwm: {
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
                        type: 'arduino_get_pwm_port_number',
                    },
                    {
                        type: 'arduino_text',
                        params: ['255'],
                    },
                    null,
                ],
                type: 'jikko_toggle_pwm',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'jikkoBlock',
            //isNotFor: ['arduino'],
            func(sprite, script) {
                const port = script.getNumberValue('PORT');
                let value = script.getNumberValue('VALUE');
                value = Math.round(value);
                value = Math.max(value, 0);
                value = Math.min(value, 255);
                Entry.hw.sendQueue.SET[port] = {
                    type: Entry.ArduinoExt.sensorTypes.PWM,
                    data: value,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.set_pin_digital(%1, %2)',
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
                    },
                ],
            },
        },
        jikko_tone_list: {
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
            func(sprite, script) {
                return script.getField('NOTE');
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
                                converter: Entry.block.converters.returnStringValueUpperCase,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'jikko_tone_list',
                    },
                ],
            },
        },
        jikko_tone_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
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
                        type: 'jikko_tone_list',
                    },
                ],
                type: 'jikko_tone_value',
            },
            paramsKeyMap: {
                NOTE: 0,
            },
            func(sprite, script) {
                return script.getNumberValue('NOTE');
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        keyOption: 'jikko_tone_value',
                    },
                ],
            },
        },
        jikko_octave_list: {
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
                    ],
                    value: '4',
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
            func(sprite, script) {
                return script.getField('OCTAVE');
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        keyOption: 'jikko_octave_list',
                    },
                ],
            },
        },
        jikko_set_tone: {
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
                        type: 'arduino_get_port_number',
                        params: [3],
                    },
                    {
                        type: 'jikko_tone_list',
                    },
                    {
                        type: 'jikko_octave_list',
                    },
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'jikko_set_tone',
            },
            paramsKeyMap: {
                PORT: 0,
                NOTE: 1,
                OCTAVE: 2,
                DURATION: 3,
            },
            class: 'jikkoBlock',
            //isNotFor: ['ArduinoExt'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = script.getNumberValue('PORT', script);

                if (!script.isStart) {
                    let note = script.getValue('NOTE', script);
                    if (!Entry.Utils.isNumber(note)) {
                        note = Entry.jikko.toneTable[note];
                    }

                    if (note < 0) {
                        note = 0;
                    } else if (note > 12) {
                        note = 12;
                    }

                    let duration = script.getNumberValue('DURATION', script);

                    if (duration < 0) {
                        duration = 0;
                    }

                    if (!sq.SET) {
                        sq.SET = {};
                    }

                    if (duration === 0) {
                        //  Entry.hw.sendQueue[port] = 0;

                        sq.SET[port] = {
                            type: Entry.jikko.sensorTypes.TONE,
                            data: 0,
                            time: new Date().getTime(),
                        };
                        return script.callReturn();
                    }

                    let octave = script.getNumberValue('OCTAVE', script) - 1;
                    if (octave < 0) {
                        octave = 0;
                    } else if (octave > 5) {
                        octave = 5;
                    }

                    let value = 0;

                    if (note != 0) {
                        value = Entry.jikko.toneMap[note][octave];
                    }

                    duration = duration * 1000;
                    script.isStart = true;
                    script.timeFlag = 1;

                    //check
                    //Entry.hw.sendQueue[port] = { value, duration };
                    Entry.hw.sendQueue[port] = value;
                    // sq['SET'][port] = {
                    //     type: Entry.DaduBlock.sensorTypes.TONE,
                    //     data: {
                    //         value: value,
                    //         duration: duration,
                    //     },
                    //     time: new Date().getTime(),
                    // };
                    sq.SET[port] = {
                        type: Entry.jikko.sensorTypes.TONE,
                        data: {
                            value,
                            duration,
                        },
                        time: new Date().getTime(),
                    };

                    setTimeout(() => {
                        script.timeFlag = 0;
                    }, duration + 32);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    //  Entry.hw.sendQueue[port] = 0;

                    sq.SET[port] = {
                        type: Entry.ArduinoExt.sensorTypes.TONE,
                        data: 0,
                        time: new Date().getTime(),
                    };
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.tone(%1, %2, %3, %4)',
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
                    },
                ],
            },
        },
        jikko_set_servo: {
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
                        type: 'arduino_get_port_number',
                        params: ['3'],
                    },
                    null,
                ],
                type: 'jikko_set_servo',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'jikkoBlock',
            //isNotFor: ['ArduinoExt'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = script.getNumberValue('PORT', script);
                let value = script.getNumberValue('VALUE', script);
                value = Math.min(180, value);
                value = Math.max(0, value);

                if (!sq.SET) {
                    sq.SET = {};
                }
                sq.SET[port] = {
                    type: Entry.ArduinoExt.sensorTypes.SERVO_PIN,
                    data: value,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.servomotorWrite(%1, %2)',
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
                    },
                ],
            },
        },
        jikko_get_ultrasonic_value: {
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
                        type: 'arduino_get_port_number',
                        params: ['13'],
                    },
                    {
                        type: 'arduino_get_port_number',
                        params: ['12'],
                    },
                ],
                type: 'jikko_get_ultrasonic_value',
            },
            paramsKeyMap: {
                PORT1: 0,
                PORT2: 1,
            },
            class: 'jikkoBlock',
            //isNotFor: ['ArduinoExt'],
            func(sprite, script) {
                const port1 = script.getNumberValue('PORT1', script);
                const port2 = script.getNumberValue('PORT2', script);

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                delete Entry.hw.sendQueue.SET[port1];
                delete Entry.hw.sendQueue.SET[port2];

                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                Entry.hw.sendQueue.GET[Entry.ArduinoExt.sensorTypes.ULTRASONIC] = {
                    port: [port1, port2],
                    time: new Date().getTime(),
                };
                return Entry.hw.portData.ULTRASONIC || 0;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.ultrasonicRead(%1, %2)',
                        blockType: 'param',
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
                    },
                ],
            },
        },
        jikko_get_lcd_row: {
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
                        keyOption: 'jikko_get_lcd_row',
                    },
                ],
            },
        },
		
		jikko_get_lcd_col: {
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
                        keyOption: 'jikko_get_lcd_col',
                    },
                ],
            },
        },
        /*
		jikko_list_lcd_init: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['27', '39'],
                        ['3f', '63']
                    ],
                    value: '39',
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
                LCD_INIT: 0,
            },
            func: function(sprite, script) {
                return script.getStringField('LCD_INIT');
                // return script.getField('LCD_INIT');
            },
        },
        */
        /*
		jikko_set_I2CLCD_init: {
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
                        type: 'jikko_list_lcd_init',
                        params: ['39'],
                    },
					{
						type: 'number',
                        params: ['14'],
                        // 16
					},
					{
						type: 'number',
                        params: ['1'],
                        // 2
					},
					null,
                ],
                type: 'jikko_set_I2CLCD_init',
            },
            paramsKeyMap: {
                LCD_INIT: 0,
				PORT: 1,
				PORT1: 2,
            },
            class: 'LCD',
            //isNotFor: ['Orange'],
            func(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var value = script.getNumberValue('LCD_INIT', script);
                var port = script.getNumberValue('PORT', script);
				var port1 = script.getNumberValue('PORT1', script);

				if (!script.isStart) 
                {
                    
					if (!sq.SET) {
						sq.SET = {};
					}
                    
					var duration = Entry.jikko.duration.TIME_200ms;
                    script.isStart = true;
                    script.timeFlag = 1;
                    
                    
                    
					sq.SET[port] = {
							type: Entry.jikko.sensorTypes.LCDINIT,
							data: port1,
							time: new Date().getTime(),
                    };
                    
                    // 이 밑으로는 모두 동일
					setTimeout(function() {
                        script.timeFlag = 0;
                    }, duration );
                    return script;
                }
				else if (script.timeFlag == 1)
                {
                    return script;
                }
                else 
                {
                    delete script.timeFlag;
                    delete script.isStart;

                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [
                    {
						
                    },
                ],
            },
        },
        */
        jikko_set_I2CLCD_init: {
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
						params: ['16'],
					},
					{
						type: 'number',
						params: ['2'],
					},
					null,
                ],
                type: 'jikko_set_I2CLCD_init',
            },
            paramsKeyMap: {
				PORT: 0,
				PORT1: 1,
            },
            class: 'LCD',
            //isNotFor: ['Orange'],
            func(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var port = script.getNumberValue('PORT', script);
				var port1 = script.getNumberValue('PORT1', script);

				if (!script.isStart) 
                {
					if (!sq.SET) {
						sq.SET = {};
					}
					
					var duration = Entry.jikko.duration.TIME_200ms;
                    script.isStart = true;
                    script.timeFlag = 1;
					
					sq.SET[port] = {
							type: Entry.jikko.sensorTypes.LCDINIT,
							data: port1,
							time: new Date().getTime(),
					};
					setTimeout(function() {
                        script.timeFlag = 0;
                    }, duration );
                    return script;
				}
				else if (script.timeFlag == 1)
                {
                    return script;
                }
                else 
                {
                    delete script.timeFlag;
                    delete script.isStart;

                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [
                    {
						
                    },
                ],
            },
        },
        
		jikko_set_I2CLCD_print: {
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
                        type: 'jikko_get_lcd_row',
						params: ['0'],

                    },
					{
                        type: 'jikko_get_lcd_col',
                        params: ['0'],
                    },
					{
                        type: 'text',
                        params: ['kocoafab'],
                    },
                    null,
                ],
                type: 'jikko_set_I2CLCD_print',
            },
            paramsKeyMap: {
				ROW: 0,
				COL: 1,
				STRING: 2,
            },
            class: 'LCD',
            //isNotFor: ['Orange'],
            func(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var port = script.getNumberValue('ROW', script);
				var col = script.getNumberValue('COL', script);
				var string = script.getValue('STRING', script);
				var text = [];

				if (!script.isStart) 
                {
					if (typeof string === 'string') 
                    {
                        for (var i = 0; i < string.length; i++) {
                            text[i] = Entry.jikko.toByte(string[i]);
                        }
                    }
                    else if (typeof string === 'number') 
                    {
                        //console.log("string");
                        //console.log(string);
                        var num_to_string = string.toString();
                        for (var i = 0; i < num_to_string.length; i++) {
                            text[i] = Entry.jikko.toByte(num_to_string[i]);
                        }
                        //console.log("num_to_string");
                        //console.log(num_to_string);
                        //text[0] = 1;
                        //text[1] = string / 1;
                    } 
                    else 
                    {
                        text[0] = string;
                    }
					
					if (!sq.SET) {
						sq.SET = {};
					}
					
					var duration = Entry.jikko.duration.TIME_500ms;
                    script.isStart = true;
                    script.timeFlag = 1;
					
					sq.SET['15'] = {
							type: Entry.jikko.sensorTypes.LCD,
							data: {
								row: port,
								col: col,
								text0: text[0],
								text1: text[1],
								text2: text[2],
								text3: text[3],
								text4: text[4],
								text5: text[5],
								text6: text[6],
								text7: text[7],
								text8: text[8],
								text9: text[9],
								text10: text[10],
								text11: text[11],
								text12: text[12],
								text13: text[13],
								text14: text[14],
								text15: text[15],
							},
							time: new Date().getTime(),
					};
					setTimeout(function() {
                        script.timeFlag = 0;
                    }, duration );
                    return script;
				}
				else if (script.timeFlag == 1)
                {
                    return script;
                }
                else 
                {
                    delete script.timeFlag;
                    delete script.isStart;

                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [
                    {
						
                    },
                ],
            },
        },
		
		jikko_set_I2CLCD_clear: {
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
						params: ['15'],
					},
					{
						type: 'number',
						params: ['1'],
					},
					null,
                ],
                type: 'jikko_set_I2CLCD_clear',
            },
            paramsKeyMap: {
				PORT: 0,
				PORT1: 1,
            },
            class: 'LCD',
            //isNotFor: ['Orange'],
            func(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var port = script.getNumberValue('PORT', script);
				var port1 = script.getNumberValue('PORT1', script);

				if (!script.isStart) 
                {
					if (!sq.SET) {
						sq.SET = {};
					}
					
					var duration = Entry.jikko.duration.TIME_200ms;
                    script.isStart = true;
                    script.timeFlag = 1;
					
					sq.SET[port] = {
							type: Entry.jikko.sensorTypes.LCDCLEAR,
							data: port1,
							time: new Date().getTime(),
					};
					setTimeout(function() {
                        script.timeFlag = 0;
                    }, duration );
                    return script;
				}
				else if (script.timeFlag == 1)
                {
                    return script;
                }
                else 
                {
                    delete script.timeFlag;
                    delete script.isStart;

                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [
                    {
						
                    },
                ],
            },
        },
		
		jikko_set_I2CLCD_emotion: {
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
                    type: "Dropdown",
					options: [
						[ "온도", '1' ],
						[ "습도", '2' ],
						[ "미세먼지", '3' ],
						[ "하트", '4' ],
					],
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
                        type: 'jikko_get_lcd_row',
						params: ['0'],

                    },
					{
                        type: 'jikko_get_lcd_col',
                        params: ['0'],
                    },
					'1',
                    null,
                ],
                type: 'jikko_set_I2CLCD_emotion',
            },
            paramsKeyMap: {
				ROW: 0,
				COL: 1,
				EMOTICON: 2,
            },
            class: 'LCD',
            //isNotFor: ['Orange'],
            func(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var row = script.getNumberValue('ROW', script);
				var col = script.getNumberValue('COL', script);
				var emoticon = script.getValue('EMOTICON', script);

				if (!script.isStart) 
                {
					if (!sq.SET) {
						sq.SET = {};
					}
					
					var duration = Entry.jikko.duration.TIME_200ms;
                    script.isStart = true;
                    script.timeFlag = 1;
					
					sq.SET['15'] = {
							type: Entry.jikko.sensorTypes.LCDEMOTICON,
							data: {
								row: row,
								col: col,
								emoticon: emoticon,
							},
							time: new Date().getTime(),
					};
					setTimeout(function() {
                        script.timeFlag = 0;
                    }, duration );
                    return script;
				}
				else if (script.timeFlag == 1)
                {
                    return script;
                }
                else 
                {
                    delete script.timeFlag;
                    delete script.isStart;

                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [
                    {
						
                    },
                ],
            },
        },
    };
};

//Entry.jikko = new jikko();
module.exports = Entry.jikko;
