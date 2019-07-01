'use strict';

Entry.memaker = {
    id: '6.2',
    name: 'memaker',
    url: 'http://www.jkelec.co.kr/',
    imageName: 'memaker.png',
    title: {
        ko: '미메이커',
        en: 'memaker',
    },
    setZero: function() {
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
        LCD: 9,
        LCD_COMMAND: 10,
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
    directionTable: {
        Forward: 0,
        Backward: 1,
    },
    highList: ['high', '1', 'on'],
    lowList: ['low', '0', 'off'],
    BlockState: {},
};
Entry.memaker.blockMenuBlocks = [
    // memaker Added 2017-10-01
    'memaker_get_analog_value',
    'memaker_get_analog_value_map',
    'memaker_get_ultrasonic_value',
    'memaker_get_digital',
    'memaker_toggle_led',
    'memaker_digital_pwm',
    'memaker_set_servo',
    'memaker_set_lcd',
    'memaker_lcd_command',
    // memaker Added 2017-10-01
];
Entry.memaker.getBlocks = function() {
    return {
        //region memaker 미메이커
        memaker_analog_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['A0', '0'],
                        ['A1', '1'],
                        ['A2', '2'],
                        ['A3', '3'],
                        ['A4', '4'],
                        ['A5', '5'],
                        ['A6', '6'],
                        ['A7', '7'],
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
            syntax: { js: [], py: [] },
        },
        memaker_get_analog_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
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
                        type: 'memaker_analog_list',
                    },
                ],
                type: 'memaker_get_analog_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'memakerGet',
            isNotFor: ['memaker'],
            func: function(sprite, script) {
                var port = script.getValue('PORT', script);
                var ANALOG = Entry.hw.portData.ANALOG;
                if (port[0] === 'A') port = port.substring(1);
                return ANALOG ? ANALOG[port] || 0 : 0;
            },
            syntax: { js: [], py: [] },
        },
        memaker_get_analog_value_map: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
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
                        type: 'memaker_get_analog_value',
                        params: [
                            {
                                type: 'memaker_analog_list',
                            },
                        ],
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
                type: 'memaker_get_analog_value_map',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE2: 1,
                VALUE3: 2,
                VALUE4: 3,
                VALUE5: 4,
            },
            class: 'memakerGet',
            isNotFor: ['memaker'],
            func: function(sprite, script) {
                var result = script.getValue('PORT', script);
                var ANALOG = Entry.hw.portData.ANALOG;
                var value2 = script.getNumberValue('VALUE2', script);
                var value3 = script.getNumberValue('VALUE3', script);
                var value4 = script.getNumberValue('VALUE4', script);
                var value5 = script.getNumberValue('VALUE5', script);

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
            syntax: { js: [], py: [] },
        },
        memaker_get_ultrasonic_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
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
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'arduino_get_port_number',
                        params: ['7'],
                    },
                    {
                        type: 'arduino_get_port_number',
                        params: ['8'],
                    },
                ],
                type: 'memaker_get_ultrasonic_value',
            },
            paramsKeyMap: {
                PORT1: 0,
                PORT2: 1,
            },
            class: 'memakerGet',
            isNotFor: ['memaker'],
            func: function(sprite, script) {
                var port1 = script.getNumberValue('PORT1', script);
                var port2 = script.getNumberValue('PORT2', script);

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                delete Entry.hw.sendQueue['SET'][port1];
                delete Entry.hw.sendQueue['SET'][port2];

                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                Entry.hw.sendQueue['GET'][Entry.memaker.sensorTypes.ULTRASONIC] = {
                    port: [port1, port2],
                    time: new Date().getTime(),
                };
                return Entry.hw.portData.ULTRASONIC || 0;
            },
            syntax: { js: [], py: [] },
        },
        memaker_get_digital: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
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
                        type: 'arduino_get_port_number',
                    },
                ],
                type: 'memaker_get_digital',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'memakerGet',
            isNotFor: ['memaker'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT', script);
                var DIGITAL = Entry.hw.portData.DIGITAL;
                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                Entry.hw.sendQueue['GET'][Entry.memaker.sensorTypes.DIGITAL] = {
                    port: port,
                    time: new Date().getTime(),
                };
                return DIGITAL ? DIGITAL[port] || 0 : 0;
            },
            syntax: { js: [], py: [] },
        },
        memaker_toggle_led: {
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
                params: [
                    {
                        type: 'arduino_get_port_number',
                    },
                    {
                        type: 'arduino_get_digital_toggle',
                        params: ['on'],
                    },
                    null,
                ],
                type: 'memaker_toggle_led',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'memaker',
            isNotFor: ['memaker'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var value = script.getValue('VALUE');

                if (typeof value === 'string') {
                    value = value.toLowerCase();
                }
                if (Entry.memaker.highList.indexOf(value) > -1) {
                    value = 255;
                } else if (Entry.memaker.lowList.indexOf(value) > -1) {
                    value = 0;
                } else {
                    throw new Error();
                }
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.memaker.sensorTypes.DIGITAL,
                    data: value,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        memaker_digital_pwm: {
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
                params: [
                    {
                        type: 'arduino_get_pwm_port_number',
                    },
                    {
                        type: 'text',
                        params: ['255'],
                    },
                    null,
                ],
                type: 'memaker_digital_pwm',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'memaker',
            isNotFor: ['memaker'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var value = script.getNumberValue('VALUE');
                value = Math.round(value);
                value = Math.max(value, 0);
                value = Math.min(value, 255);
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.memaker.sensorTypes.PWM,
                    data: value,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        memaker_set_servo: {
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
                params: [
                    {
                        type: 'arduino_get_port_number',
                        params: ['10'],
                    },
                    null,
                ],
                type: 'memaker_set_servo',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'memaker',
            isNotFor: ['memaker'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var port = script.getNumberValue('PORT', script);
                var value = script.getNumberValue('VALUE', script);
                value = Math.min(180, value);
                value = Math.max(0, value);

                if (!sq['SET']) {
                    sq['SET'] = {};
                }
                sq['SET'][port] = {
                    type: Entry.memaker.sensorTypes.SERVO_PIN,
                    data: value,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        memaker_list_digital_lcd_line: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [['LINE1', '0'], ['LINE2', '1']],
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
        memaker_list_digital_lcd_column: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['COL1', '0'],
                        ['COL2', '1'],
                        ['COL3', '2'],
                        ['COL4', '3'],
                        ['COL5', '4'],
                        ['COL6', '5'],
                        ['COL7', '6'],
                        ['COL8', '7'],
                        ['COL9', '8'],
                        ['COL10', '9'],
                        ['COL11', '10'],
                        ['COL12', '11'],
                        ['COL13', '12'],
                        ['COL14', '13'],
                        ['COL15', '14'],
                        ['COL16', '15'],
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
                COLUMN: 0,
            },
            func: function(sprite, script) {
                return script.getField('COLUMN');
            },
        },
        memaker_set_lcd: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            template: Lang.template.memaker_set_lcd,
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
                        type: 'memaker_list_digital_lcd_line',
                    },
                    {
                        type: 'memaker_list_digital_lcd_column',
                    },
                    {
                        type: 'text',
                        params: ['Type text !!'],
                    },
                    null,
                ],
                type: 'memaker_set_lcd',
            },
            paramsKeyMap: {
                LINE: 0,
                COLUMN: 1,
                STRING: 2,
            },
            class: 'memakerLcd',
            isNotFor: ['memaker'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var line = script.getValue('LINE', script);
                var column = script.getValue('COLUMN', script);
                var string = script.getValue('STRING', script);
                var text = [];

                if (!script.isStart) {
                    if (typeof string === 'string') {
                        for (var i = 0; i < string.length; i++) {
                            text[i] = Entry.memaker.toByte(string[i]);
                        }
                    } else if (typeof string === 'number') {
                        var num_to_string = string.toString();
                        for (var i = 0; i < num_to_string.length; i++) {
                            text[i] = Entry.memaker.toByte(num_to_string[i]);
                        }
                    } else {
                        text[0] = string;
                    }

                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = 60 / fps * 50;

                    Entry.hw.sendQueue['SET'][line] = {
                        type: Entry.memaker.sensorTypes.LCD,
                        data: {
                            line: line,
                            column: column,
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
                    }, timeValue);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = true;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['memaker.memaker_set_lcd(%1, %2, %3)'] },
        },
        memaker_list_lcd_command: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [['LCD_BLUE', '0'], ['LCD_GREEN', '1'], ['LCD_CLEAR', '2']],
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
                COMMAND: 0,
            },
            func: function(sprite, script) {
                return script.getField('COMMAND');
            },
        },

        memaker_lcd_command: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            template: Lang.template.memaker_lcd_command,
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
                        type: 'memaker_list_lcd_command',
                    },
                    null,
                ],
                type: 'memaker_lcd_command',
            },
            paramsKeyMap: {
                COMMAND: 0,
            },
            class: 'memakerLcd',
            isNotFor: ['memaker'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var value = script.getNumberValue('COMMAND', script);
                var command = script.getNumberValue('COMMAND', script);

                if (!sq['SET']) {
                    sq['SET'] = {};
                }
                sq['SET'][0] = {
                    type: Entry.memaker.sensorTypes.LCD_COMMAND,
                    data: {
                        value: value,
                        command: command,
                    },
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        //endregion memaker 미메이커
    };
};

module.exports = Entry.memaker;
