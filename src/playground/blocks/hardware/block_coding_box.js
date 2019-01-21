'use strict';

Entry.CodingBox = {
    id: '1.C',
    name: 'CodingBox',
    url: 'http://smartstore.naver.com/domekit',
    imageName: 'codingbox.png',
    title: {
        ko: '코딩박스',
        en: 'CodingBox',
    },
    setZero: function() {
        if (!Entry.hw.sendQueue.SET) {
            Entry.hw.sendQueue = {
                GET: {},
                SET: {},
            };
            Entry.hw.sendQueue['SET'][Entry.CodingBox.sensorTypes.LCD_INIT] = {
                port: 0,
                time: new Date().getTime(),
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
    pins: {
        POTENTIOMETER: 0,
        MIC: 1,
        SWITCH_1: 2,
        SWITCH_2: 3,
        BUZZER: 2,
        LINE: 3,
        ULTRASONIC_TRIG: 4,
        ULTRASONIC_ECHO: 7,
        SERVO: 5,
        DCM_A: 6,
        DCM_B: 9,
        LED_1: 10,
        LED_2: 11,
        RGB_R: 8,
        RGB_B: 12,
        RGB_G: 13,
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
        LCD_PRINT: 9,
        LCD_CLEAR: 10,
        LCD_INIT: 11,
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
    BlockState: {},
};

Entry.CodingBox.setLanguage = function() {
    return {
        ko: {
            Blocks: {
                CBX_LED_ON: '켜짐',
                CBX_LED_OFF: '꺼짐',
                CBX_DCM_FORWARD: '정회전',
                CBX_DCM_BACKWARD: '역회전',
                CBX_DCM_SPEED_MAX: '최대속도',
                CBX_DCM_SPEED_STOP: '정지',
            },
            template: {
                cbx_arduino_get_analog_value: '아날로그 %1 번 센서값',
                cbx_arduino_get_analog_value_map:
                    '%1 의 범위를 %2 ~ %3 에서 %4 ~ %5 로 바꾼값',
                cbx_arudino_read_ultrasonic_value:
                    '울트라소닉 Trig %1 Echo %2 센서값',
                cbx_arduino_toggle_led: '디지털 %1 번 핀 %2 %3',
                cbx_arduino_digital_pwm:
                    '디지털 %1 번 핀을 %2 (으)로 정하기 %3',
                cbx_arduino_write_tone:
                    '디지털 %1 번 핀의 버저를 %2 %3 음으로 %4 초 연주하기 %5',
                cbx_arduino_write_servo:
                    '디지털 %1 번 핀의 서보모터를 %2 의 각도로 정하기 %3',
                cbx_arduino_read_digital: '디지털 %1 번 센서값',
                cbx_write_servo: '서보모터 각도를 %1 도로 정하기 %2',
                cbx_write_tone: '부저를 %1 %2 음으로 %3 초 연주하기 %4',
                cbx_write_led: '%1 을 %2 로 정하기 %3',
                cbx_write_dcm: 'DC모터를 %1 방향, 속도 %2 로 정하기 %3',
                cbx_write_rgb_led:
                    '빨강을 %1 으로, 초록을 %2 으로, 파랑 %3 으로 정하기 %4',
                cbx_write_lcd: 'LCD %1 줄 %2 칸에 %3 을 쓰기 %4',
                cbx_clear_lcd: 'LCD 화면 지우기 %1',
                cbx_read_line: '라인센서 값',
                cbx_read_switch: '%1 값',
                cbx_read_mic: '마이크 값',
                cbx_read_potentiometer: '가변저항 값',
                cbx_read_ultrasonic: '초음파센서 값',
            },
        },
        en: {
            Blocks: {
                CBX_LED_ON: 'On',
                CBX_LED_OFF: 'Off',
                CBX_DCM_FORWARD: 'Forward',
                CBX_DCM_BACKWARD: 'Backward',
                CBX_DCM_SPEED_MAX: 'MaxSpeed',
                CBX_DCM_SPEED_STOP: 'Stop',
            },
            template: {
                cbx_arduino_get_analog_value: 'Analog %1 Sensor value',
                cbx_arduino_get_analog_value_map:
                    'Map Value %1 %2 ~ %3 to %4 ~ %5',
                cbx_arudino_read_ultrasonic_value:
                    'Read ultrasonic sensor trig pin %1 echo pin %2',
                cbx_arduino_toggle_led: 'Digital %1 Pin %2 %3',
                cbx_arduino_digital_pwm: 'Digital %1 Pin %2 %3',
                cbx_arduino_write_tone:
                    'Play tone pin %1 on note %2 octave %3 beat %4 %5',
                cbx_arduino_write_servo: 'Set servo pin %1 angle as %2 %3',
                cbx_arduino_read_digital: 'Digital %1 Sensor value',
                cbx_write_led: '%1 set to %2 %3',
                cbx_write_rgb_led: 'set red %1 , green %2 , blue %3 %4',
                cbx_write_tone: 'note %1 octave %2 beat %3 %4',
                cbx_write_servo: 'set servo angle %1 %2',
                cbx_write_dcm: 'write DC motor direction %1 , speed %2 %3',
                cbx_write_lcd: 'write on %1 line %2 column %3  %4',
                cbx_clear_lcd: 'clear LCD screen %1',
                cbx_read_line: 'line sensor value',
                cbx_read_mic: 'mic value',
                cbx_read_switch: '%1 value',
                cbx_read_potentiometer: 'potentiometer value',
                cbx_read_ultrasonic: ' Ultrasonic value',
            },
        },
    };
};
Entry.CodingBox.blockMenuBlocks = [
    'cbx_read_line',
    'cbx_read_mic',
    'cbx_read_switch',
    'cbx_read_potentiometer',
    'cbx_read_ultrasonic',
    'cbx_write_led',
    'cbx_write_rgb_led',
    'cbx_write_tone',
    'cbx_write_dcm',
    'cbx_write_servo',
    'cbx_write_lcd',
    'cbx_clear_lcd',
    'cbx_arduino_get_analog_value',
    'cbx_arduino_get_analog_value_map',
    'cbx_arudino_read_ultrasonic_value',
    'cbx_arduino_read_digital',
    'cbx_arduino_toggle_led',
    'cbx_arduino_digital_pwm',
    'cbx_arduino_write_servo',
    'cbx_arduino_write_tone',
];
//region CodingBox 아두이노 확장모드
Entry.CodingBox.getBlocks = function() {
    return {
        coding_box_analog_list: {
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
            func: function(sprite, script) {
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
                                converter:
                                    Entry.block.converters.returnStringKey,
                                codeMap:
                                    'Entry.CodeMap.Arduino.arduino_ext_analog_list[0]',
                                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'coding_box_analog_list',
                    },
                ],
            },
        },
        cbx_arduino_get_analog_value: {
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
                        type: 'coding_box_analog_list',
                    },
                ],
                type: 'cbx_arduino_get_analog_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'CodingBoxArduinoRead',
            isNotFor: ['CodingBox'],
            func: function(sprite, script) {
                var port = script.getValue('PORT', script);
                var ANALOG = Entry.hw.portData.ANALOG;
                if (port[0] === 'A') port = port.substring(1);
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
        cbx_arduino_get_analog_value_map: {
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
                        type: 'cbx_arduino_get_analog_value',
                        params: [
                            {
                                type: 'coding_box_analog_list',
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
                type: 'cbx_arduino_get_analog_value_map',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE2: 1,
                VALUE3: 2,
                VALUE4: 3,
                VALUE5: 4,
            },
            class: 'CodingBoxArduinoRead',
            isNotFor: ['CodingBox'],
            func: function(sprite, script) {
                var result = script.getValue('PORT', script);
                var ANALOG = Entry.hw.portData.ANALOG;
                var value2 = script.getNumberValue('VALUE2', script);
                var value3 = script.getNumberValue('VALUE3', script);
                var value4 = script.getNumberValue('VALUE4', script);
                var value5 = script.getNumberValue('VALUE5', script);
                var stringValue4 = script.getValue('VALUE4', script);
                var stringValue5 = script.getValue('VALUE5', script);
                var isFloat = false;

                if (
                    (Entry.Utils.isNumber(stringValue4) &&
                        stringValue4.indexOf('.') > -1) ||
                    (Entry.Utils.isNumber(stringValue5) &&
                        stringValue5.indexOf('.') > -1)
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
        cbx_arudino_read_ultrasonic_value: {
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
                        params: ['2'],
                    },
                    {
                        type: 'arduino_get_port_number',
                        params: ['4'],
                    },
                ],
                type: 'cbx_arudino_read_ultrasonic_value',
            },
            paramsKeyMap: {
                PORT1: 0,
                PORT2: 1,
            },
            class: 'CodingBoxArduinoRead',
            isNotFor: ['CodingBox'],
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
                Entry.hw.sendQueue['GET'][
                    Entry.CodingBox.sensorTypes.ULTRASONIC
                ] = {
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
        cbx_arduino_read_digital: {
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
                        params: [2],
                    },
                ],
                type: 'cbx_arduino_read_digital',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'CodingBoxArduinoRead',
            isNotFor: ['CodingBox'],
            func: function(sprite, script) {
                const { hwModule = {} } = Entry.hw;
                const { name } = hwModule;

                if (name === 'CodingBox') {
                    var port = script.getNumberValue('PORT', script);
                    var DIGITAL = Entry.hw.portData.DIGITAL;
                    if (!Entry.hw.sendQueue['GET']) {
                        Entry.hw.sendQueue['GET'] = {};
                    }
                    Entry.hw.sendQueue['GET'][
                        Entry.CodingBox.sensorTypes.DIGITAL
                    ] = {
                        port: port,
                        time: new Date().getTime(),
                    };
                    return DIGITAL ? DIGITAL[port] || 0 : 0;
                } else {
                    return Entry.block.arduino_get_digital_value.func(
                        sprite,
                        script
                    );
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
            func: function(sprite, script) {
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
                                converter:
                                    Entry.block.converters
                                        .returnStringValueUpperCase,
                                codeMap:
                                    'Entry.CodeMap.Arduino.arduino_get_digital_toggle[0]',
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'arduino_get_digital_toggle',
                    },
                ],
            },
        },
        cbx_arduino_toggle_led: {
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
                        params: [3],
                    },
                    {
                        type: 'arduino_get_digital_toggle',
                        params: ['on'],
                    },
                    null,
                ],
                type: 'cbx_arduino_toggle_led',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'CodingBoxArduinoWrite',
            isNotFor: ['CodingBox'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var value = script.getValue('VALUE');

                if (typeof value === 'string') {
                    value = value.toLowerCase();
                }
                if (Entry.CodingBox.highList.indexOf(value) > -1) {
                    value = 255;
                } else if (Entry.CodingBox.lowList.indexOf(value) > -1) {
                    value = 0;
                } else {
                    throw new Error();
                }
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.CodingBox.sensorTypes.DIGITAL,
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
        cbx_arduino_digital_pwm: {
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
                type: 'cbx_arduino_digital_pwm',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'CodingBoxArduinoWrite',
            isNotFor: ['CodingBox'],
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
                    type: Entry.CodingBox.sensorTypes.PWM,
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
        coding_box_tone_list: {
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
                                converter:
                                    Entry.block.converters
                                        .returnStringValueUpperCase,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'coding_box_tone_list',
                    },
                ],
            },
        },
        coding_box_tone_value: {
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
                        type: 'coding_box_tone_list',
                    },
                ],
                type: 'coding_box_tone_value',
            },
            paramsKeyMap: {
                NOTE: 0,
            },
            func: function(sprite, script) {
                return script.getNumberValue('NOTE');
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        keyOption: 'coding_box_tone_value',
                    },
                ],
            },
        },
        coding_box_octave_list: {
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
            func: function(sprite, script) {
                return script.getField('OCTAVE');
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        keyOption: 'coding_box_octave_list',
                    },
                ],
            },
        },
        cbx_arduino_write_tone: {
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
                    {
                        type: 'arduino_get_port_number',
                        params: [3],
                    },
                    {
                        type: 'coding_box_tone_list',
                    },
                    {
                        type: 'coding_box_octave_list',
                    },
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'cbx_arduino_write_tone',
            },
            paramsKeyMap: {
                PORT: 0,
                NOTE: 1,
                OCTAVE: 2,
                DURATION: 3,
            },
            class: 'CodingBoxArduinoWrite',
            isNotFor: ['CodingBox'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var port = script.getNumberValue('PORT', script);

                if (!script.isStart) {
                    var note = script.getValue('NOTE', script);
                    if (!Entry.Utils.isNumber(note))
                        note = Entry.CodingBox.toneTable[note];

                    if (note < 0) {
                        note = 0;
                    } else if (note > 12) {
                        note = 12;
                    }

                    var duration = script.getNumberValue('DURATION', script);

                    if (duration < 0) {
                        duration = 0;
                    }

                    if (!sq['SET']) {
                        sq['SET'] = {};
                    }

                    if (duration === 0) {
                        sq['SET'][port] = {
                            type: Entry.CodingBox.sensorTypes.TONE,
                            data: 0,
                            time: new Date().getTime(),
                        };
                        return script.callReturn();
                    }

                    var octave = script.getNumberValue('OCTAVE', script) - 1;
                    if (octave < 0) {
                        octave = 0;
                    } else if (octave > 5) {
                        octave = 5;
                    }

                    var value = 0;

                    if (note != 0) {
                        value = Entry.CodingBox.toneMap[note][octave];
                    }

                    duration = duration * 1000;
                    script.isStart = true;
                    script.timeFlag = 1;

                    sq['SET'][port] = {
                        type: Entry.CodingBox.sensorTypes.TONE,
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
                    sq['SET'][port] = {
                        type: Entry.CodingBox.sensorTypes.TONE,
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
        cbx_arduino_write_servo: {
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
                        params: ['3'],
                    },
                    null,
                ],
                type: 'cbx_arduino_write_servo',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'CodingBoxArduinoWrite',
            isNotFor: ['CodingBox'],
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
                    type: Entry.CodingBox.sensorTypes.SERVO_PIN,
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
        //////
        //CodingBox Only
        //////
        cbx_read_ultrasonic: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            events: {},
            class: 'CodingBoxRead',
            isNotFor: ['CodingBox'],
            func: function(sprite, script) {
                var port1 = Entry.CodingBox.pins.ULTRASONIC_TRIG;
                var port2 = Entry.CodingBox.pins.ULTRASONIC_ECHO;

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                delete Entry.hw.sendQueue['SET'][port1];
                delete Entry.hw.sendQueue['SET'][port2];

                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                Entry.hw.sendQueue['GET'][
                    Entry.CodingBox.sensorTypes.ULTRASONIC
                ] = {
                    port: [port1, port2],
                    time: new Date().getTime(),
                };
                return Entry.hw.portData.ULTRASONIC || 0;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.ultrasonicRead(4, 7)',
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
        cbx_read_switch: {
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
                        type: 'cbx_switch_list',
                    },
                ],
                type: 'cbx_read_switch',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'CodingBoxRead',
            isNotFor: ['CodingBox'],
            func: function(sprite, script) {
                var port = script.getValue('PORT', script);
                var ANALOG = Entry.hw.portData.ANALOG;
                var value = ANALOG ? ANALOG[port] || 0 : 0;
                var isPush = 0;

                if (port[0] === 'A') port = port.substring(1);
                if (value > 600) {
                    isPush = 0;
                } else {
                    isPush = 1;
                }

                return isPush;
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
        cbx_read_potentiometer: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            //      statements: [],
            //      params: [
            //        {}
            //      ],
            //      events: {},
            def: {
                params: [],
                type: 'cbx_read_potentiometer',
            },
            class: 'CodingBoxRead',
            isNotFor: ['CodingBox'],
            func: function(sprite, script) {
                var port = Entry.CodingBox.pins.POTENTIOMETER;
                var ANALOG = Entry.hw.portData.ANALOG;

                if (port[0] === 'A') port = port.substring(1);
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
        cbx_read_mic: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            events: {},
            def: {
                params: [],
                type: 'cbx_read_mic',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'CodingBoxRead',
            isNotFor: ['CodingBox'],
            func: function(sprite, script) {
                var port = Entry.CodingBox.pins.MIC;
                var ANALOG = Entry.hw.portData.ANALOG;

                if (port[0] === 'A') port = port.substring(1);
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
        cbx_read_line: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            events: {},
            paramsKeyMap: {},
            class: 'CodingBoxRead',
            isNotFor: ['CodingBox'],
            func: function(sprite, script) {
                const port = 3;
                const { hwModule = {} } = Entry.hw;
                const { name } = hwModule;
                var DIGITAL = Entry.hw.portData.DIGITAL;

                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                Entry.hw.sendQueue['GET'][
                    Entry.CodingBox.sensorTypes.DIGITAL
                ] = {
                    port: port,
                    time: new Date().getTime(),
                };
                return DIGITAL ? DIGITAL[port] || 0 : 0;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.digitalRead(3)',
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
        cbx_write_led: {
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
                        type: 'cbx_led_number_list',
                    },
                    {
                        type: 'cbx_led_value_list',
                    },
                    null,
                ],
                type: 'cbx_write_led',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'CodingBoxWrite',
            isNotFor: ['CodingBox'],
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
                    type: Entry.CodingBox.sensorTypes.PWM,
                    data: value,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
        },
        cbx_write_lcd: {
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
                    {
                        type: 'cbx_lcd_row_list',
                    },
                    {
                        type: 'cbx_lcd_column_list',
                    },
                    {
                        type: 'text',
                        params: ['Hello, CodingBox'],
                    },
                    null,
                ],
                type: 'cbx_write_lcd',
            },
            paramsKeyMap: {
                ROW: 0,
                COLUMN: 1,
                TEXT: 2,
            },
            class: 'CodingBoxWrite',
            isNotFor: ['CodingBox'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var row = script.getNumberValue('ROW');
                var column = script.getNumberValue('COLUMN');
                var text = script.getValue('TEXT');
                let time = new Date().getTime();

                //      아래코드에서 보조 변수들(script.isStart, script.timeFlag등)이 들어간 이유는 fps(초당프레임)를 위해서입니다.
                //      해당 코드가 없을 경우 최소 딜레이가 없기때문에 흐리게 나오는 문제가 발생합니다.
                if (!script.isStart) {
                    if (!sq['SET']) {
                        sq['SET'] = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = 60 / fps * 50;

                    sq['SET'][15] = {
                        type: Entry.CodingBox.sensorTypes.LCD_PRINT,
                        data: {
                            row,
                            column,
                            text,
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

                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '',
                        textParams: [],
                    },
                ],
            },
        },
        cbx_clear_lcd: {
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
                type: 'cbx_clear_lcd',
            },
            paramsKeyMap: {},
            class: 'CodingBoxWrite',
            isNotFor: ['CodingBox'],
            func: function(sprite, script) {
                let sq = Entry.hw.sendQueue;
                let time = new Date().getTime();

                if (!sq['SET']) {
                    sq['SET'] = {};
                }
                sq['SET'][14] = {
                    type: Entry.CodingBox.sensorTypes.LCD_CLEAR,
                    data: 255,
                    time: time,
                };

                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '',
                        textParams: [],
                    },
                ],
            },
        },
        cbx_write_rgb_led: {
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
                    {
                        type: 'cbx_rgb_led_value_list',
                    },
                    {
                        type: 'cbx_rgb_led_value_list',
                    },
                    {
                        type: 'cbx_rgb_led_value_list',
                    },
                    null,
                ],
                type: 'cbx_write_rgb_led',
            },
            paramsKeyMap: {
                R: 0,
                G: 1,
                B: 2,
            },
            class: 'CodingBoxWrite',
            isNotFor: ['CodingBox'],
            func: function(sprite, script) {
                var redPort = Entry.CodingBox.pins.RGB_R;
                var greenPort = Entry.CodingBox.pins.RGB_G;
                var bluePort = Entry.CodingBox.pins.RGB_B;
                var redPWM = script.getNumberValue('R');
                var greenPWM = script.getNumberValue('G');
                var bluePWM = script.getNumberValue('B');

                redPWM = Math.round(redPWM);
                redPWM = Math.max(redPWM, 0);
                redPWM = Math.min(redPWM, 1);
                greenPWM = Math.round(greenPWM);
                greenPWM = Math.max(greenPWM, 0);
                greenPWM = Math.min(greenPWM, 1);
                bluePWM = Math.round(bluePWM);
                bluePWM = Math.max(bluePWM, 0);
                bluePWM = Math.min(bluePWM, 1);

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][redPort] = {
                    type: Entry.CodingBox.sensorTypes.DIGITAL,
                    data: redPWM,
                    time: new Date().getTime(),
                };
                Entry.hw.sendQueue['SET'][greenPort] = {
                    type: Entry.CodingBox.sensorTypes.DIGITAL,
                    data: greenPWM,
                    time: new Date().getTime(),
                };
                Entry.hw.sendQueue['SET'][bluePort] = {
                    type: Entry.CodingBox.sensorTypes.DIGITAL,
                    data: bluePWM,
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
        cbx_led_number_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [['LED1', '10'], ['LED2', '11']],
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
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [['LED1', '10'], ['LED2', '11']],
                                value: '3',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters
                                        .returnStringOrNumberByValue,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'cbx_led_number_list',
                    },
                ],
            },
        },
        cbx_rgb_led_value_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.CBX_LED_ON, '1'],
                        [Lang.Blocks.CBX_LED_OFF, '0'],
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
                VALUE: 0,
            },
            func: function(sprite, script) {
                return script.getStringField('VALUE');
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
                                    [Lang.Blocks.CBX_LED_ON, '1'],
                                    [Lang.Blocks.CBX_LED_OFF, '0'],
                                ],
                                value: '3',
                                fontSize: 11,
                                converter:
                                    Entry.block.converters
                                        .returnStringOrNumberByValue,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'cbx_led_value_list',
                    },
                ],
            },
        },
        cbx_led_value_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.CBX_LED_ON, '255'],
                        [Lang.Blocks.CBX_LED_OFF, '0'],
                        ['50', '50'],
                        ['100', '100'],
                        ['150', '150'],
                        ['200', '200'],
                    ],
                    value: '255',
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
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['On', '255'],
                                    ['Off', '0'],
                                    ['0', '0'],
                                    ['50', '50'],
                                    ['100', '100'],
                                    ['150', '150'],
                                    ['200', '200'],
                                    ['255', '255'],
                                ],
                                value: '3',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter:
                                    Entry.block.converters
                                        .returnStringOrNumberByValue,
                            },
                        ],
                        keyOption: 'cbx_led_value_list',
                    },
                ],
            },
        },
        cbx_dcm_speed_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.CBX_DCM_SPEED_MAX, '255'],
                        [Lang.Blocks.CBX_DCM_SPEED_STOP, '0'],
                        ['50', '50'],
                        ['100', '100'],
                        ['150', '150'],
                        ['200', '200'],
                    ],
                    value: '255',
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
                SPEED: 0,
            },
            func: function(sprite, script) {
                return script.getStringField('SPEED');
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
                                    ['Max', '255'],
                                    ['Off', '0'],
                                    ['50', '50'],
                                    ['100', '100'],
                                    ['150', '150'],
                                    ['200', '200'],
                                ],
                                value: '3',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter:
                                    Entry.block.converters
                                        .returnStringOrNumberByValue,
                            },
                        ],
                        keyOption: 'cbx_dcm_speed_list',
                    },
                ],
            },
        },
        cbx_servo_angle_list: {
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
                        ['30', '30'],
                        ['60', '60'],
                        ['90', '90'],
                        ['120', '120'],
                        ['150', '150'],
                        ['180', '180'],
                    ],
                    value: '255',
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
                ANGLE: 0,
            },
            func: function(sprite, script) {
                return script.getStringField('ANGLE');
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
                                    [Lang.Blocks.CBX_SERVO_MAX, '255'],
                                    [Lang.Blocks.CBX_SERVO_MIN, '0'],
                                    ['50', '50'],
                                    ['100', '100'],
                                    ['150', '150'],
                                    ['200', '200'],
                                ],
                                value: '3',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter:
                                    Entry.block.converters
                                        .returnStringOrNumberByValue,
                            },
                        ],
                        keyOption: 'cbx_dcm_speed_list',
                    },
                ],
            },
        },
        cbx_lcd_column_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', '0'],
                        ['2', '1'],
                        ['3', '2'],
                        ['4', '3'],
                        ['5', '4'],
                        ['6', '5'],
                        ['7', '6'],
                        ['8', '7'],
                        ['9', '8'],
                        ['10', '9'],
                        ['11', '10'],
                        ['12', '11'],
                        ['13', '12'],
                        ['14', '13'],
                        ['15', '14'],
                        ['16', '15'],
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
                return script.getStringField('COLUMN');
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
                                    ['1', '0'],
                                    ['2', '1'],
                                    ['3', '2'],
                                    ['4', '3'],
                                    ['5', '4'],
                                    ['6', '5'],
                                    ['7', '6'],
                                    ['8', '7'],
                                    ['9', '8'],
                                    ['10', '9'],
                                    ['11', '10'],
                                    ['12', '11'],
                                    ['13', '12'],
                                    ['14', '13'],
                                    ['15', '14'],
                                    ['16', '15'],
                                ],
                                value: '3',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter:
                                    Entry.block.converters
                                        .returnStringOrNumberByValue,
                            },
                        ],
                        keyOption: 'cbx_dcm_speed_list',
                    },
                ],
            },
        },
        cbx_lcd_row_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [['1', '0'], ['2', '1']],
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
            func: function(sprite, script) {
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
                                options: [['1', '0'], ['2', '1']],
                                value: '3',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter:
                                    Entry.block.converters
                                        .returnStringOrNumberByValue,
                            },
                        ],
                        keyOption: 'cbx_dcm_speed_list',
                    },
                ],
            },
        },
        cbx_switch_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['switch1', Entry.CodingBox.pins.SWITCH_1],
                        ['switch2', Entry.CodingBox.pins.SWITCH_2],
                    ],
                    value: Entry.CodingBox.pins.SWITCH_1,
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
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['switch1', Entry.CodingBox.pins.SWITCH_1],
                                    ['switch2', Entry.CodingBox.pins.SWITCH_2],
                                ],
                                value: Entry.CodingBox.pins.SWITCH_1,
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter:
                                    Entry.block.converters
                                        .returnStringOrNumberByValue,
                            },
                        ],
                        keyOption: 'cbx_dcm_speed_list',
                    },
                ],
            },
        },
        cbx_dcm_direction_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.CBX_DCM_FORWARD, '1'],
                        [Lang.Blocks.CBX_DCM_BACKWARD, '0'],
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
                DIRECTION: 0,
            },
            func: function(sprite, script) {
                return script.getStringField('DIRECTION');
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [['forward', '1'], ['reverse', '0']],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter:
                                    Entry.block.converters
                                        .returnStringOrNumberByValue,
                            },
                        ],
                        keyOption: 'cbx_dcm_value_list',
                    },
                ],
            },
        },
        cbx_write_servo: {
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
                params: [
                    {
                        type: 'cbx_servo_angle_list',
                        params: [180],
                    },
                    null,
                ],
                type: 'cbx_write_servo',
            },
            paramsKeyMap: {
                ANGLE: 0,
            },
            class: 'CodingBoxWrite',
            isNotFor: ['CodingBox'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var port = Entry.CodingBox.pins.SERVO;
                var angle = script.getNumberValue('ANGLE', script);

                angle = Math.min(180, angle);
                angle = Math.max(0, angle);

                if (!sq['SET']) {
                    sq['SET'] = {};
                }
                sq['SET'][port] = {
                    type: Entry.CodingBox.sensorTypes.SERVO_PIN,
                    data: angle,
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
        cbx_write_tone: {
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
                    {
                        type: 'coding_box_tone_list',
                    },
                    {
                        type: 'coding_box_octave_list',
                    },
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'cbx_write_tone',
            },
            paramsKeyMap: {
                NOTE: 0,
                OCTAVE: 1,
                DURATION: 2,
            },
            class: 'CodingBoxWrite',
            isNotFor: ['CodingBox'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var port = Entry.CodingBox.pins.BUZZER;

                if (!script.isStart) {
                    var note = script.getValue('NOTE', script);
                    if (!Entry.Utils.isNumber(note))
                        note = Entry.CodingBox.toneTable[note];

                    if (note < 0) {
                        note = 0;
                    } else if (note > 12) {
                        note = 12;
                    }

                    var duration = script.getNumberValue('DURATION', script);

                    if (duration < 0) {
                        duration = 0;
                    }

                    if (!sq['SET']) {
                        sq['SET'] = {};
                    }

                    if (duration === 0) {
                        sq['SET'][port] = {
                            type: Entry.CodingBox.sensorTypes.TONE,
                            data: 0,
                            time: new Date().getTime(),
                        };
                        return script.callReturn();
                    }

                    var octave = script.getNumberValue('OCTAVE', script) - 1;
                    if (octave < 0) {
                        octave = 0;
                    } else if (octave > 5) {
                        octave = 5;
                    }

                    var value = 0;

                    if (note != 0) {
                        value = Entry.CodingBox.toneMap[note][octave];
                    }

                    duration = duration * 1000;
                    script.isStart = true;
                    script.timeFlag = 1;

                    sq['SET'][port] = {
                        type: Entry.CodingBox.sensorTypes.TONE,
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
                    sq['SET'][port] = {
                        type: Entry.CodingBox.sensorTypes.TONE,
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
        cbx_write_dcm: {
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
                        type: 'cbx_dcm_direction_list',
                    },
                    {
                        type: 'cbx_dcm_speed_list',
                    },
                    null,
                ],
                type: 'cbx_write_dcm',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                SPEED: 1,
            },
            class: 'CodingBoxWrite',
            isNotFor: ['CodingBox'],
            func: function(sprite, script) {
                var dcmAPin = Entry.CodingBox.pins.DCM_A;
                var dcmBPin = Entry.CodingBox.pins.DCM_B;
                var direction = script.getNumberValue('DIRECTION');
                var speed = script.getNumberValue('SPEED', script);
                var dcmASpeed = 0;
                var dcmBSpeed = 0;

                speed = Math.round(speed);
                speed = Math.max(speed, 0);
                speed = Math.min(speed, 255);

                if (direction === 1) {
                    dcmASpeed = speed;
                    dcmBSpeed = 0;
                } else {
                    dcmASpeed = 0;
                    dcmBSpeed = speed;
                }

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][dcmAPin] = {
                    type: Entry.CodingBox.sensorTypes.PWM,
                    data: dcmASpeed,
                    time: new Date().getTime(),
                };
                Entry.hw.sendQueue['SET'][dcmBPin] = {
                    type: Entry.CodingBox.sensorTypes.PWM,
                    data: dcmBSpeed,
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
        //endregion CodingBox
    };
};
//endregion CodingBox

module.exports = Entry.CodingBox;
