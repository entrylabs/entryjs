'use strict';

Entry.Dalgona = {
    id: 'FF.FF',
    name: 'Dalgona',
    url: 'https://www.kocoafab.cc/',
    imageName: 'dalgona.png',
    title: {
        ko: '달고나 에듀',
        en: 'Dalgona edu',
    },
    setZero() {
        if (!Entry.hw.sendQueue.SET) {
            Entry.hw.sendQueue = {
                GET: {},
                SET: {},
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
	NEOPIXELINIT: 9,
	NEOPIXELCOLOR: 10,
	DHTINIT: 21,
	DHTTEMP: 22,
	DHTHUMI: 23,
	NOTONE: 24,
	PMINIT: 31,
	PMVALUE: 32,
	LCDINIT: 41,
	LCD: 42,
	LCDCLEAR: 43,
	LCDEMOTICON: 44,
		
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

Entry.Dalgona.setLanguage = function() {
    return {
        ko: {
            template: {
                dalgona_get_analog_value: '달고나 아날로그 %1 번 센서값',
                dalgona_get_analog_value_map: '달고나 %1 의 범위를 %2 ~ %3 에서 %4 ~ %5 로 바꾼값',
                dalgona_get_ultrasonic_value: '달고나 울트라소닉 Trig %1 Echo %2 센서값',
                dalgona_toggle_led: '달고나 디지털 %1 번 핀 %2 %3',
                dalgona_digital_pwm: '달고나 디지털 %1 번 핀을 %2 (으)로 정하기 %3',
                dalgona_get_digital: '달고나 디지털 %1 번 센서값',
				dalgona_set_neopixelinit: '달고나 디지털 %1 번 핀에 연결된 %2 개의 네오픽셀 LED 사용하기 %3',
				dalgona_set_neopixel: '달고나 디지털 %1 번 핀에 연결된 %2 번째 네오픽셀 LED를 R: %3 , G: %4 , B: %5 색으로 켜기 %6',
				dalgona_set_dht_init: '달고나 디지털 %1 번 핀에 연결된 온습도센서 사용하기 %2',
				dalgona_get_dht_temp_value: '달고나 온습도센서의 온도값',
				dalgona_get_dht_humi_value: '달고나 온습도센서의 습도값',
            },
        },
        en: {
            template: {
                dalgona_get_analog_value: 'Analog %1 Sensor value',
                dalgona_get_analog_value_map: 'Map Value %1 %2 ~ %3 to %4 ~ %5',
                dalgona_get_ultrasonic_value: 'Read ultrasonic sensor trig pin %1 echo pin %2',
                dalgona_toggle_led: 'Digital %1 Pin %2 %3',
                dalgona_digital_pwm: 'Digital %1 Pin %2 %3',
                dalgona_get_digital: 'Digital %1 Sensor value',
				dalgona_set_neopixelinit: '디지털 %1 번 핀에 연결된 %2 개의 네오픽셀 LED 사용하기 %3',
				dalgona_set_neopixel: '디지털 %1 번 핀에 연결된 %2 번째 네오픽셀 LED를 R: %3 , G: %4 , B: %5 색으로 켜기 %6',
				dalgona_set_dht_init: '디지털 %1 번 핀에 연결된 온습도센서 사용하기 %2',
				dalgona_get_dht_temp_value: '온습도센서의 온도값',
				dalgona_get_dht_humi_value: '온습도센서의 습도값',

            },
        },
    };
};

Entry.Dalgona.blockMenuBlocks = [
    'dalgona_get_analog_value',
    'dalgona_get_analog_value_map',
    'dalgona_get_ultrasonic_value',
    'dalgona_get_digital',
    'dalgona_toggle_led',
    'dalgona_digital_pwm',
	'dalgona_set_neopixelinit',
	'dalgona_set_neopixel',
	'dalgona_set_dht_init',
	'dalgona_get_dht_temp_value',
	'dalgona_get_dht_humi_value',
];

//region arduinoExt 아두이노 확장모드
Entry.Dalgona.getBlocks = function() {
    return {
        dalgona_analog_list: {
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
            func(sprite, script) {
                return script.getField('PORT');
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['A0', '0'],
                                    ['A1', '1'],
                                    ['A2', '2'],
                                    ['A3', '3'],
                                    ['A4', '4'],
                                    ['A5', '5'],
                                ],
                                value: '0',
                                fontSize: 11,
                                converter: Entry.block.converters.returnStringKey,
                                codeMap: 'Entry.CodeMap.Arduino.orange_analog_list[0]',
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'orange_analog_list',
                    },
                ],
            },
        },

        // 아날로그 %1 번 센서값
        dalgona_get_analog_value: {
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
                        type: 'dalgona_analog_list',
                    },
                ],
                type: 'dalgona_get_analog_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'OrangeGet',
            isNotFor: ['Dalgona'],
            func(sprite, script) {
                let port = script.getValue('PORT', script);
                const ANALOG = Entry.hw.portData.ANALOG;
                if (port[0] === 'A') {
                    port = port.substring(1);
                }
                return ANALOG ? ANALOG[port] || 0 : 0;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.analogRead(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },

        // %1 의 범위를 %2 ~ %3 에서 %4 ~ %5 로 바꾼값
        dalgona_get_analog_value_map: {
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
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'dalgona_get_analog_value',
                        params: [
                            {
                                type: 'dalgona_analog_list',
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
                type: 'dalgona_get_analog_value_map',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE2: 1,
                VALUE3: 2,
                VALUE4: 3,
                VALUE5: 4,
            },
            class: 'OrangeGet',
            isNotFor: ['Dalgona'],
            func(sprite, script) {
                let result = script.getValue('PORT', script);
                const ANALOG = Entry.hw.portData.ANALOG;
                let value2 = script.getNumberValue('VALUE2', script);
                let value3 = script.getNumberValue('VALUE3', script);
                let value4 = script.getNumberValue('VALUE4', script);
                let value5 = script.getNumberValue('VALUE5', script);
                const stringValue4 = script.getValue('VALUE4', script);
                const stringValue5 = script.getValue('VALUE5', script);
                let isFloat = false;

                if (
                    (Entry.Utils.isNumber(stringValue4) && stringValue4.indexOf('.') > -1) ||
                    (Entry.Utils.isNumber(stringValue5) && stringValue5.indexOf('.') > -1)
                ) {
                    isFloat = true;
                }

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

                if (isFloat) {
                    result = Math.round(result * 100) / 100;
                } else {
                    result = Math.round(result);
                }

                return result;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.map(%1, %2, %3, %4, %5)',
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

        // 울트라소닉 Trig %1 Echo %2 센서값
        dalgona_get_ultrasonic_value: {
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
                        params: ['2'],
                    },
                    {
                        type: 'arduino_get_port_number',
                        params: ['4'],
                    },
                ],
                type: 'dalgona_get_ultrasonic_value',
            },
            paramsKeyMap: {
                PORT1: 0,
                PORT2: 1,
            },
            class: 'OrangeGet',
            isNotFor: ['Dalgona'],
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
                Entry.hw.sendQueue.GET[Entry.Dalgona.sensorTypes.ULTRASONIC] = {
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

        // 디지털 %1 번 센서값
        dalgona_get_digital: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
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
                        type: 'arduino_get_port_number',
                        params: [2],
                    },
                ],
                type: 'dalgona_get_digital',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'OrangeGet',
            isNotFor: ['Dalgona'],
            func(sprite, script) {
                const { hwModule = {} } = Entry.hw;
                const { name } = hwModule;
                if (name === 'Orange' || name === 'ArduinoNano') {
                    const port = script.getNumberValue('PORT', script);
                    const DIGITAL = Entry.hw.portData.DIGITAL;
                    if (!Entry.hw.sendQueue.GET) {
                        Entry.hw.sendQueue.GET = {};
                    }
                    Entry.hw.sendQueue.GET[Entry.Dalgona.sensorTypes.DIGITAL] = {
                        port,
                        time: new Date().getTime(),
                    };
                    return DIGITAL ? DIGITAL[port] || 0 : 0;
                } else {
                    return Entry.block.arduino_get_digital_value.func(sprite, script);
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.digitalRead(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        arduino_get_digital_toggle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [[Lang.Blocks.ARDUINO_on, 'on'], [Lang.Blocks.ARDUINO_off, 'off']],
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

        // 디지털 %1 번 핀 %2 %3
        dalgona_toggle_led: {
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
                type: 'dalgona_toggle_led',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'Orange',
            isNotFor: ['Dalgona'],
            func(sprite, script) {
                const port = script.getNumberValue('PORT');
                let value = script.getValue('VALUE');

                if (typeof value === 'string') {
                    value = value.toLowerCase();
                }
                if (Entry.Dalgona.highList.indexOf(value) > -1) {
                    value = 255;
                } else if (Entry.Dalgona.lowList.indexOf(value) > -1) {
                    value = 0;
                } else {
                    throw new Error();
                }
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[port] = {
                    type: Entry.Dalgona.sensorTypes.DIGITAL,
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

        // 디지털 %1 번 핀을 %2 (으)로 정하기 %3
        dalgona_digital_pwm: {
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
                        type: 'text',
                        params: ['255'],
                    },
                    null,
                ],
                type: 'dalgona_digital_pwm',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'Orange',
            isNotFor: ['Dalgona'],
            func(sprite, script) {
                const port = script.getNumberValue('PORT');
                let value = script.getNumberValue('VALUE');
                value = Math.round(value);
                value = Math.max(value, 0);
                value = Math.min(value, 255);
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[port] = {
                    type: Entry.Orange.sensorTypes.PWM,
                    data: value,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.analogWrite(%1, %2)',
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

        // 디지털 %1 번 핀에 연결된 %2 개의 네오픽셀 LED 사용하기 %3
		dalgona_set_neopixelinit: {
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
                        params: ['6'],
                    },
					{
                        type: 'number',
                        params: ['25'],
                    },
                    null,
                ],
                type: 'dalgona_set_neopixelinit',
            },
            paramsKeyMap: {
                PORT: 0,
                NUM: 1,
            },
            class: 'other',
            isNotFor: ['Dalgona'],
            func(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var port = script.getNumberValue('PORT', script);
                var value = script.getNumberValue('NUM', script);

				if (!script.isStart)
                {
					if (!sq.SET) {
						sq.SET = {};
					}
					
					var duration = Entry.Dalgona.duration.TIME_200ms;
                    script.isStart = true;
                    script.timeFlag = 1; 
					
					sq.SET[port] = {
							type: Entry.Dalgona.sensorTypes.NEOPIXELINIT,
							data: value,
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

        // 디지털 %1 번 핀에 연결된 %2 번째 네오픽셀 LED를 R: %3 , G: %4 , B: %5 색으로 켜기 %6
		dalgona_set_neopixel: {
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
                        params: ['6'],
                    },
					{
                        type: 'number',
                        params: ['0'],
                    },
					{
                        type: 'number',
                        params: ['255'],
                    },
					{
                        type: 'number',
                        params: ['255'],
                    },
					{
                        type: 'number',
                        params: ['255'],
                    },
                    null,
                ],
                type: 'dalgona_set_neopixel',
            },
            paramsKeyMap: {
                PORT: 0,
                NUM: 1,
				RED: 2,
				GREEN: 3,
				BLUE: 4,
            },
            class: 'other',
            isNotFor: ['Dalgona'],
            func(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var port = script.getNumberValue('PORT', script);
                var num = script.getNumberValue('NUM', script);
				var r = script.getNumberValue('RED', script);
				var g = script.getNumberValue('GREEN', script);
				var b = script.getNumberValue('BLUE', script);

				if (!script.isStart) 
                {
					if (!sq.SET) {
						sq.SET = {};
					}
					
					var duration = Entry.Dalgona.duration.TIME_10ms;
						script.isStart = true;
						script.timeFlag = 1;
					
					sq.SET[num] = {
						type: Entry.Dalgona.sensorTypes.NEOPIXELCOLOR,
						data: {
								port: port,
								num: num,
								r: r,
								g: g,
								b: b,
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

        // 디지털 %1 번 핀에 연결된 온습도센서 사용하기 %2
		dalgona_set_dht_init: {
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
                        type: 'arduino_get_port_number',
                        params: ['3'],
                    },
                    null,
                ],
                type: 'dalgona_set_dht_init',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'dht',
            isNotFor: ['Dalgona'],
            func(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var port = script.getNumberValue('PORT', script);

				if (!script.isStart) 
                {
					if (!sq.SET) {
						sq.SET = {};
					}
					
					var duration = Entry.Dalgona.duration.TIME_500ms;
                    script.isStart = true;
                    script.timeFlag = 1;
					
					sq.SET[port] = {
							type: Entry.Dalgona.sensorTypes.DHTINIT,
							data: port,
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

        // 온습도센서의 온도값
		dalgona_get_dht_temp_value: {
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
					'0',
                ],
                type: 'dalgona_get_dht_temp_value',
            },
            paramsKeyMap: {
                TEMP: 0,
            },
            class: 'dht',
            isNotFor: ['Dalgona'],
            func(sprite, script) {
                const temp = script.getNumberValue('TEMP', script);

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                delete Entry.hw.sendQueue.SET[temp];

                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
				
                Entry.hw.sendQueue.GET[Entry.Dalgona.sensorTypes.DHTTEMP] = {
                    port: temp,
                    time: new Date().getTime(),
                };
                return Entry.hw.portData.DHTTEMP || 0;
            },
            syntax: {
                js: [],
                py: [],
            },
        },

        // 온습도센서의 습도값
		dalgona_get_dht_humi_value: {
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
					'1',
                ],
                type: 'dalgona_get_dht_humi_value',
            },
            paramsKeyMap: {
                HUMI: 0,
            },
            class: 'dht',
            isNotFor: ['Dalgona'],
            func(sprite, script) {
                const humi = script.getNumberValue('HUMI', script);

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                delete Entry.hw.sendQueue.SET[humi];

                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
				
                Entry.hw.sendQueue.GET[Entry.dalgona.sensorTypes.DHTHUMI] = {
                    port: humi,
                    time: new Date().getTime(),
                };
                return Entry.hw.portData.DHTHUMI || 0;
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
//endregion arduinoExt 아두이노 확장모드

module.exports = Entry.Dalgona;
