'use strict';

Entry.AIoT = {
    id: '26.2',
    name: 'AIoT',
    url: 'http://wonn.co.kr/',
    imageName: 'aiot.png',
    title: {
        ko: 'AIoT 보드',
        en: 'AIoT board',
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
        PULSE_IN: 6,
        ULTRASONIC: 7,
        TIMER: 8,
        NEOPIXEL_INIT: 9,
        NEOPIXEL_COLOR: 10,
        DHT_INIT: 21,
        DHT_TEMP: 22,
        DHT_HUMI: 23,
        NO_TONE: 24,
        LCD_INIT: 41,
        LCD: 42,
        LCD_CLEAR: 43,
        LCD_EMOTICON: 44,		
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
// 하드웨어 블록 등록
// 여기에 등록된 블록이 순서대로 나열되며 설정한 이름으로 화면에 보임
Entry.AIoT.blockMenuBlocks = [
    'aiot_get_analog_value',        // 아날로그 값 읽기
    'aiot_get_analog_value_map',
    'aiot_get_ultrasonic_value', 
    'aiot_get_digital',       // 디지털 입력                     
    'aiot_toggle_led',
    'aiot_digital_pwm',     
    'aiot_set_tone',
	'aiot_set_noTone',
    'aiot_set_servo',    
	'aiot_set_neopixel_init',
	'aiot_set_neopixel',
	'aiot_set_dht_init',
	'aiot_get_dht_temp_value',
	'aiot_get_dht_humi_value',
	'aiot_get_lcd_row',
	'aiot_get_lcd_col',
	'aiot_set_I2CLCD_init',
	'aiot_set_I2CLCD_print',
	'aiot_set_I2CLCD_clear',
	'aiot_set_I2CLCD_emoticon',
];
// 블록 이름  번역
Entry.AIoT.setLanguage = function() {
    return {
        ko: {
            template: {
                aiot_get_analog_value: '아날로그 %1 번 센서값',
                aiot_get_analog_value_map: '%1 의 범위를 %2 ~ %3 에서 %4 ~ %5 로 변환값',
                aiot_get_ultrasonic_value: '초음파센서 Trig %1 Echo %2 거리값',                 
                aiot_get_digital: '디지털 %1 번 입력값',               
                aiot_toggle_led: '디지털 %1 번 핀 %2 %3',                
                aiot_digital_pwm: '디지털 %1 번 핀을 %2 (으)로 정하기 %3',                
                aiot_set_tone: '디지털 %1 번 핀의 부저를 %3 옥타브 %2 음으로 %4 초 연주하기 %5',
				aiot_set_noTone: '디지털 %1 번 핀의 부저 소리 끄기 %2',
                aiot_set_servo: '디지털 %1 번 핀의 서보모터를 %2도 각도로 회전하기 %3',                                
				aiot_set_neopixel_init: '디지털 %1 번 핀에 연결된 %2 개의 네오픽셀 사용하기 %3',
				aiot_set_neopixel: '디지털 %1 번 핀에 연결된 %2 번째 네오픽셀 LED를 R: %3 , G: %4 , B: %5 색으로 켜기 %6',
				aiot_set_dht_init: '디지털 %1 번 핀에 연결된 DHT11 온습도센서 사용하기 %2',
				aiot_get_dht_temp_value: 'DHT11 온습도센서의 온도값',
				aiot_get_dht_humi_value: 'DHT11 온습도센서의 습도값',				
				aiot_get_lcd_row: '%1',
				aiot_get_lcd_col: '%1',
				aiot_set_I2CLCD_init: 'I2C LCD 사용하기 %3',
				aiot_set_I2CLCD_print: 'I2C LCD %1 번째 줄, %2 번째 칸에 %3 출력하기 %4',
				aiot_set_I2CLCD_clear: 'I2C LCD 화면 모두 지우기 %3',
				aiot_set_I2CLCD_emoticon: 'I2C LCD %1 번째 줄, %2 번째 칸에 %3 이모티콘 출력하기 %4',
            },
        },
        en: {
            template: {
                aiot_get_analog_value: 'Analog %1 Sensor value',
                aiot_get_analog_value_map: 'Map Value %1 %2 ~ %3 to %4 ~ %5',
                aiot_get_ultrasonic_value: 'Read ultrasonic sensor trig pin %1 echo pin %2',                
                aiot_get_digital: 'Digital %1 Input value',
                aiot_toggle_led: 'Digital %1 Pin %2 %3',                
                aiot_digital_pwm: 'Digital %1 Pin %2 %3',                
                aiot_set_tone: 'Play tone pin %1 on note %2 octave %3 beat %4 %5',
				aiot_set_noTone: 'Digital %1 No.Pin Buzzer Off %2',
                aiot_set_servo: 'Set Servo Motor pin %1 angle as %2 %3',                
				aiot_set_neopixel_init: 'Digital %1 No.Pin %2 NeonPixel Initialize %3',
				aiot_set_neopixel: 'Digital %1 No.Pin %2  NeonPixel LED R: %3 , G: %4 , B: %5 색으로 켜기 %6',
				aiot_set_dht_init: 'Digital %1 No. Pin DHT11 Senosr Module Initialize %2',
				aiot_get_dht_temp_value: 'DHT11 Snesor Temp.Value',
				aiot_get_dht_humi_value: 'DHT11 Sensor Humidity Value',				
				aiot_get_lcd_row: '%1',
				aiot_get_lcd_col: '%1',
				aiot_set_I2CLCD_init: 'I2C LCD Initialize %3',
				aiot_set_I2CLCD_print: 'I2C LCD %1 Row, %2 Col %3 Print %4',
				aiot_set_I2CLCD_clear: 'I2C LCD Screen All Clean %3',
				aiot_set_I2CLCD_emoticon: 'I2C LCD의 %1 Row, %2 Col %3 Emoticon Print %4',
            },
        },
    };
};
//region arduinoExt 아두이노 확장모드
Entry.AIoT.getBlocks = function() {
    return {
        aiot_analog_list: {
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
                                codeMap: 'Entry.CodeMap.Arduino.aiot_analog_list[0]',
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'aiot_analog_list',
                    },
                ],
            },
        },

        aiot_get_analog_value: {
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
                        type: 'aiot_analog_list',
                    },
                ],
                type: 'aiot_get_analog_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'AIoTGet',
            isNotFor: ['AIoT'],
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

        aiot_get_analog_value_map: {
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
                        type: 'aiot_get_analog_value',
                        params: [
                            {
                                type: 'aiot_analog_list',
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
                type: 'aiot_get_analog_value_map',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE2: 1,
                VALUE3: 2,
                VALUE4: 3,
                VALUE5: 4,
            },
            class: 'AIoTGet',
            isNotFor: ['AIoT'],
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
        aiot_get_ultrasonic_value: {
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
                type: 'aiot_get_ultrasonic_value',
            },
            paramsKeyMap: {
                PORT1: 0,
                PORT2: 1,
            },
            class: 'AIoTGet',
            isNotFor: ['AIoT'],
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
                Entry.hw.sendQueue.GET[Entry.AIoT.sensorTypes.ULTRASONIC] = {
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
        aiot_get_digital: {
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
                type: 'aiot_get_digital',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'AIoTGet',
            isNotFor: ['AIoT'],
            func(sprite, script) {
                const { hwModule = {} } = Entry.hw;
                const { name } = hwModule;
                if (name === 'AIoT' || name === 'ArduinoNano') {
                    const port = script.getNumberValue('PORT', script);
                    const DIGITAL = Entry.hw.portData.DIGITAL;
                    if (!Entry.hw.sendQueue.GET) {
                        Entry.hw.sendQueue.GET = {};
                    }
                    Entry.hw.sendQueue.GET[Entry.AIoT.sensorTypes.DIGITAL] = {
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
                                codeMap: 'Entry.CodeMap.Arduino.arduino_digital_toggle[0]',
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            },
                        ],
                        keyOption: 'arduino_get_digital_toggle',
                    },
                ],
            },
        },
      
        aiot_toggle_led: {
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
                type: 'aiot_toggle_led',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'AIoT',
            isNotFor: ['AIoT'],
            func(sprite, script) {
                const port = script.getNumberValue('PORT');
                let value = script.getValue('VALUE');

                if (typeof value === 'string') {
                    value = value.toLowerCase();
                }
                if (Entry.AIoT.highList.indexOf(value) > -1) {
                    value = 0;
                } else if (Entry.AIoT.lowList.indexOf(value) > -1) {
                    value = 255;
                } else {
                    throw new Error();
                }
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[port] = {
                    type: Entry.AIoT.sensorTypes.DIGITAL,
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

        aiot_digital_pwm: {
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
                type: 'aiot_digital_pwm',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'AIoT',
            isNotFor: ['AIoT'],
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
                    type: Entry.AIoT.sensorTypes.PWM,
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

        aiot_tone_list: {
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
                        keyOption: 'aiot_tone_list',
                    },
                ],
            },
        },

        aiot_octave_list: {
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
                        keyOption: 'aiot_octave_list',
                    },
                ],
            },
        },

        aiot_tone_value: {
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
                        type: 'aiot_tone_list',
                    },
                ],
                type: 'aiot_tone_value',
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
                        keyOption: 'aiot_tone_value',
                    },
                ],
            },
        },
        
        aiot_set_tone: {
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
                        type: 'aiot_tone_list',
                    },
                    {
                        type: 'aiot_octave_list',
                    },
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'aiot_set_tone',
            },
            paramsKeyMap: {
                PORT: 0,
                NOTE: 1,
                OCTAVE: 2,
                DURATION: 3,
            },
            class: 'AIoT',
            isNotFor: ['AIoT'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = script.getNumberValue('PORT', script);

                if (!script.isStart) {
                    let note = script.getValue('NOTE', script);
                    if (!Entry.Utils.isNumber(note)) {
                        note = Entry.AIoT.toneTable[note];
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
                        sq.SET[port] = {
                            type: Entry.AIoT.sensorTypes.TONE,
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
                        value = Entry.AIoT.toneMap[note][octave];
                    }

                    duration = duration * 1000;
                    script.isStart = true;
                    script.timeFlag = 1;

                    sq.SET[port] = {
                        type: Entry.AIoT.sensorTypes.TONE,
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
                    sq.SET[port] = {
                        type: Entry.AIoT.sensorTypes.TONE,
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

		aiot_set_noTone: {
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
                type: 'aiot_set_noTone',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'AIoT',
            isNotFor: ['AIoT'],
            func(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var port = script.getNumberValue('PORT', script);

				if (!script.isStart) 
                {
					if (!sq.SET) {
						sq.SET = {};
					}
					
					var duration = Entry.AIoT.duration.TIME_100ms;
                    script.isStart = true;
                    script.timeFlag = 1;
					
					sq.SET[port] = {
							type: Entry.AIoT.sensorTypes.NO_TONE,
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
		        
        aiot_set_servo: {
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
                type: 'aiot_set_servo',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'AIoT',
            isNotFor: ['AIoT'],
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
                    type: Entry.AIoT.sensorTypes.SERVO_PIN,
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
		        
		aiot_set_neopixel_init: {
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
                type: 'aiot_set_neopixel_init',
            },
            paramsKeyMap: {
                PORT: 0,
                NUM: 1,
            },
            class: 'other',
            isNotFor: ['AIoT'],
            func(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var port = script.getNumberValue('PORT', script);
                var value = script.getNumberValue('NUM', script);

				if (!script.isStart)
                {
					if (!sq.SET) {
						sq.SET = {};
					}
					
					var duration = Entry.AIoT.duration.TIME_200ms;
                    script.isStart = true;
                    script.timeFlag = 1; 
					
					sq.SET[port] = {
							type: Entry.AIoT.sensorTypes.NEOPIXEL_INIT,
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

		aiot_set_neopixel: {
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
                type: 'aiot_set_neopixel',
            },
            paramsKeyMap: {
                PORT: 0,
                NUM: 1,
				RED: 2,
				GREEN: 3,
				BLUE: 4,
            },
            class: 'other',
            isNotFor: ['AIoT'],
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
					
					var duration = Entry.AIoT.duration.TIME_10ms;
						script.isStart = true;
						script.timeFlag = 1;
					
					sq.SET[num] = {
						type: Entry.AIoT.sensorTypes.NEOPIXEL_COLOR,
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

		aiot_set_dht_init: {
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
                type: 'aiot_set_dht_init',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'dht',
            isNotFor: ['AIoT'],
            func(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var port = script.getNumberValue('PORT', script);

				if (!script.isStart) 
                {
					if (!sq.SET) {
						sq.SET = {};
					}
					
					var duration = Entry.AIoT.duration.TIME_500ms;
                    script.isStart = true;
                    script.timeFlag = 1;
					
					sq.SET[port] = {
							type: Entry.AIoT.sensorTypes.DHT_INIT,
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

		aiot_get_dht_temp_value: {
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
                type: 'aiot_get_dht_temp_value',
            },
            paramsKeyMap: {
                TEMP: 0,
            },
            class: 'dht',
            isNotFor: ['AIoT'],
            func(sprite, script) {
                const temp = script.getNumberValue('TEMP', script);

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                delete Entry.hw.sendQueue.SET[temp];

                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
				
                Entry.hw.sendQueue.GET[Entry.AIoT.sensorTypes.DHT_TEMP] = {
                    port: temp,
                    time: new Date().getTime(),
                };
                return Entry.hw.portData.DHT_TEMP || 0;
            },
            syntax: {
                js: [],
                py: [
                    {
                       
                    },
                ],
            },
        },
		
		aiot_get_dht_humi_value: {
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
                type: 'aiot_get_dht_humi_value',
            },
            paramsKeyMap: {
                HUMI: 0,
            },
            class: 'dht',
            isNotFor: ['AIoT'],
            func(sprite, script) {
                const humi = script.getNumberValue('HUMI', script);

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                delete Entry.hw.sendQueue.SET[humi];

                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
				
                Entry.hw.sendQueue.GET[Entry.AIoT.sensorTypes.DHT_HUMI] = {
                    port: humi,
                    time: new Date().getTime(),
                };
                return Entry.hw.portData.DHT_HUMI || 0;
            },
            syntax: {
                js: [],
                py: [
                    {
                       
                    },
                ],
            },
        },		
        
		aiot_get_lcd_row: {
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
                        keyOption: 'aiot_get_lcd_row',
                    },
                ],
            },
        },
		
		aiot_get_lcd_col: {
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
                        keyOption: 'aiot_get_lcd_col',
                    },
                ],
            },
        },
		
		aiot_set_I2CLCD_init: {
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
						params: ['14'],
					},
					{
						type: 'number',
						params: ['1'],
					},
					null,
                ],
                type: 'aiot_set_I2CLCD_init',
            },
            paramsKeyMap: {
				PORT: 0,
				PORT1: 1,
            },
            class: 'LCD',
            isNotFor: ['AIoT'],
            func(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var port = script.getNumberValue('PORT', script);
				var port1 = script.getNumberValue('PORT1', script);

				if (!script.isStart) 
                {
					if (!sq.SET) {
						sq.SET = {};
					}
					
					var duration = Entry.AIoT.duration.TIME_200ms;
                    script.isStart = true;
                    script.timeFlag = 1;
					
					sq.SET[port] = {
							type: Entry.AIoT.sensorTypes.LCD_INIT,
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
		
		aiot_set_I2CLCD_print: {
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
                        type: 'aiot_get_lcd_row',
						params: ['0'],

                    },
					{
                        type: 'aiot_get_lcd_col',
                        params: ['0'],
                    },
					{
                        type: 'text',
                        params: ['Wonn'],
                    },
                    null,
                ],
                type: 'aiot_set_I2CLCD_print',
            },
            paramsKeyMap: {
				ROW: 0,
				COL: 1,
				STRING: 2,
            },
            class: 'LCD',
            isNotFor: ['AIoT'],
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
                            text[i] = Entry.AIoT.toByte(string[i]);
                        }
                    }
                    else if (typeof string === 'number') 
                    {
                        //console.log("string");
                        //console.log(string);
                        var num_to_string = string.toString();
                        for (var i = 0; i < num_to_string.length; i++) {
                            text[i] = Entry.AIoT.toByte(num_to_string[i]);
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
					
					var duration = Entry.AIoT.duration.TIME_500ms;
                    script.isStart = true;
                    script.timeFlag = 1;
					
					sq.SET['15'] = {
							type: Entry.AIoT.sensorTypes.LCD,
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
		
		aiot_set_I2CLCD_clear: {
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
                type: 'aiot_set_I2CLCD_clear',
            },
            paramsKeyMap: {
				PORT: 0,
				PORT1: 1,
            },
            class: 'LCD',
            isNotFor: ['AIoT'],
            func(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var port = script.getNumberValue('PORT', script);
				var port1 = script.getNumberValue('PORT1', script);

				if (!script.isStart) 
                {
					if (!sq.SET) {
						sq.SET = {};
					}
					
					var duration = Entry.AIoT.duration.TIME_200ms;
                    script.isStart = true;
                    script.timeFlag = 1;
					
					sq.SET[port] = {
							type: Entry.AIoT.sensorTypes.LCD_CLEAR,
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
		
		aiot_set_I2CLCD_emoticon: {
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
                        type: 'aiot_get_lcd_row',
						params: ['0'],

                    },
					{
                        type: 'aiot_get_lcd_col',
                        params: ['0'],
                    },
					'1',
                    null,
                ],
                type: 'aiot_set_I2CLCD_emoticon',
            },
            paramsKeyMap: {
				ROW: 0,
				COL: 1,
				EMOTICON: 2,
            },
            class: 'LCD',
            isNotFor: ['AIoT'],
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
					
					var duration = Entry.AIoT.duration.TIME_200ms;
                    script.isStart = true;
                    script.timeFlag = 1;
					
					sq.SET['15'] = {
							type: Entry.AIoT.sensorTypes.LCD_EMOTICON,
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
//endregion arduinoExt 아두이노 확장모드

module.exports = Entry.AIoT;
