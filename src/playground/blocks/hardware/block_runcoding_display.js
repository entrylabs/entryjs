'use strict';

Entry.Runcoding_display = {
    id: '17.2',
    name: 'Runcoding_display',
    url: 'https://runcoding.co.kr/',
    imageName: 'runcoding_display.png',
    title: {
        ko: '코마크레 display',
        en: 'runcoding display',    
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
                const command = Entry.hw.sendQueue.SET[key];
                // OLED 관련 명령은 setZero에서 제외
                if (command && 
                    command.type !== Entry.Runcoding_led.sensorTypes.OLED_TEXT &&
                    command.type !== Entry.Runcoding_led.sensorTypes.OLED_CLEAR &&
                    command.type !== Entry.Runcoding_led.sensorTypes.OLED_SMILE &&
                    command.type !== Entry.Runcoding_led.sensorTypes.OLED_SAD &&
                    command.type !== Entry.Runcoding_led.sensorTypes.OLED_ANGRY &&
                    command.type !== Entry.Runcoding_led.sensorTypes.OLED_ANIM_STAR &&
                    command.type !== Entry.Runcoding_led.sensorTypes.OLED_ANIM_FLOWER &&
                    command.type !== Entry.Runcoding_led.sensorTypes.OLED_ANIM_SNOW &&
                    command.type !== Entry.Runcoding_led.sensorTypes.OLED_ANIM_STOP) {
                Entry.hw.sendQueue.SET[key].data = 0;
                Entry.hw.sendQueue.SET[key].time = new Date().getTime();
                } else {
                    // OLED 명령은 삭제
                    delete Entry.hw.sendQueue.SET[key];
                }
            });
        }

        Entry.hw.update();
    },
    sensorTypes: {
        ALIVE: 0,
        DIGITAL: 1,
        ANALOG: 2,
        PWM: 3,
        PULSEIN: 6,
        TIMER: 8,
        OLED_ADDR: 23,
        OLED_TEXT: 24,
        OLED_CLEAR: 25,
        OLED_SMILE: 26,
        OLED_SAD: 27,
        OLED_ANGRY: 28,
        OLED_ANIM_STAR: 29,
        OLED_ANIM_FLOWER: 30,
        OLED_ANIM_SNOW: 31,
        OLED_ANIM_STOP: 32,
    },
    highList: ['high', '1', 'on'],
    lowList: ['low', '0', 'off'],
    BlockState: {},
};

// Keep legacy namespace references working.
Entry.Runcoding_led = Entry.Runcoding_led || Entry.Runcoding_display;

Entry.Runcoding_led.setLanguage = function() {
    return {
        ko: {
            template: {
                runcoding_led_get_analog_value: '아날로그 %1 번 센서값',
                runcoding_led_get_analog_value_map: '%1 의 범위를 %2 ~ %3 에서 %4 ~ %5 로 바꾼값',
                runcoding_led_get_digital: '디지털 %1 번 센서값',
                runcoding_led_toggle_led: '디지털 %1 번 핀 %2 %3',
                runcoding_led_digital_pwm: '디지털 %1 번 핀을 %2 (으)로 정하기 %3',

                runcoding_led_display: 'OLED %1 표현하기 X: %2 Y: %3 크기: %4 %5',
                runcoding_led_display_clear: 'OLED 화면 지우기 %1',
                runcoding_led_display_smile: '웃는얼굴 표현하기 %1',
                runcoding_led_display_sad: '슬픈표정 표현하기 %1',
                runcoding_led_display_angry: '화난얼굴 표현하기 %1',
                runcoding_led_display_emotion: '%1 표정 표현하기 %2',
                runcoding_led_animation_star: 'OLED 별 떨어지기 개수:%1(max:20) 속도:%2(max:10) %3',
                runcoding_led_animation_flower: 'OLED 꽃송이 떨어지기 개수:%1(max:20) 속도:%2(max:10) %3',
                runcoding_led_animation_snow: 'OLED 눈송이 떨어지기 개수:%1(max:20) 속도:%2(max:10) %3',
                runcoding_led_animation_stop: 'OLED 애니메이션 정지하기 %1',
            },
        },
        en: {
            template: {
                runcoding_led_get_analog_value: 'analog %1 sensor value',
                runcoding_led_get_analog_value_map: 'map %1 from %2 ~ %3 to %4 ~ %5',
                runcoding_led_get_digital: 'digital %1 sensor value',
                runcoding_led_toggle_led: 'digital %1 pin %2 %3',
                runcoding_led_digital_pwm: 'set digital %1 pin to %2 %3',

                runcoding_led_display: 'display %1 on OLED X:%2 Y:%3 size:%4 %5',
                runcoding_led_display_clear: 'clear OLED display %1',
                runcoding_led_display_smile: 'display smile face %1',
                runcoding_led_display_sad: 'display sad face %1',
                runcoding_led_display_angry: 'display angry face %1',
                runcoding_led_display_emotion: 'display %1 emotion %2',
                runcoding_led_animation_star: 'OLED falling stars count:%1(max:20) speed:%2(max:10) %3',
                runcoding_led_animation_flower: 'OLED falling flowers count:%1(max:20) speed:%2(max:10) %3',
                runcoding_led_animation_snow: 'OLED falling snowflakes count:%1(max:20) speed:%2(max:10) %3',
                runcoding_led_animation_stop: 'stop OLED animation %1',
            },
        },
    };
};

Entry.Runcoding_led.blockMenuBlocks = [
    'runcoding_led_get_analog_value',
    'runcoding_led_get_analog_value_map',
    'runcoding_led_get_digital',
    'runcoding_led_toggle_led',
    'runcoding_led_digital_pwm',
    'runcoding_led_display',
    'runcoding_led_display_emotion',
    'runcoding_led_display_clear',
    'runcoding_led_animation_star',
    'runcoding_led_animation_flower',
    'runcoding_led_animation_snow',
    'runcoding_led_animation_stop',
];

Entry.Runcoding_led.getBlocks = function() {
    return {
        runcoding_led_analog_list: {
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
                                codeMap: 'Entry.CodeMap.Arduino.arduino_runcoding_analog_list[0]',
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'arduino_runcoding_analog_list',
                    },
                ],
            },
        },
        runcoding_led_emotion_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['웃는얼굴', 'smile'],
                        ['슬픈표정', 'sad'],
                        ['화난얼굴', 'angry'],
                    ],
                    value: 'smile',
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
                EMOTION: 0,
            },
            func(sprite, script) {
                return script.getField('EMOTION');
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
                                    ['웃는얼굴', 'smile'],
                                    ['슬픈표정', 'sad'],
                                    ['화난얼굴', 'angry'],
                                ],
                                value: 'smile',
                                fontSize: 11,
                                converter: Entry.block.converters.returnStringKey,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'runcoding_led_emotion_list',
                    },
                ],
            },
        },
        runcoding_led_get_analog_value: {
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
                        type: 'runcoding_led_analog_list',
                    },
                ],
                type: 'runcoding_led_get_analog_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'runcoding_led_get',
            isNotFor: ['Runcoding_display'],
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
        runcoding_led_get_analog_value_map: {
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
                        type: 'runcoding_led_get_analog_value',
                        params: [
                            {
                                type: 'runcoding_led_analog_list',
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
                type: 'runcoding_led_get_analog_value_map',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE2: 1,
                VALUE3: 2,
                VALUE4: 3,
                VALUE5: 4,
            },
            class: 'runcoding_led_get',
            isNotFor: ['Runcoding_display'],
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
        runcoding_led_get_digital: {
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
                type: 'runcoding_led_get_digital',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'RuncodingGet',
            isNotFor: ['Runcoding_display'],
            func(sprite, script) {
                const { hwModule = {} } = Entry.hw;
                const { name } = hwModule;
                if (name === 'Runcoding' || name === 'ArduinoNano') {
                    const port = script.getNumberValue('PORT', script);
                    const DIGITAL = Entry.hw.portData.DIGITAL;
                    if (!Entry.hw.sendQueue.GET) {
                        Entry.hw.sendQueue.GET = {};
                    }
                    Entry.hw.sendQueue.GET[Entry.Runcoding_led.sensorTypes.DIGITAL] = {
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
        runcoding_led_get_digital_toggle: {
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
                        keyOption: 'runcoding_led_get_digital_toggle',
                    },
                ],
            },
        },
        runcoding_led_get_pulse: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
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
                type: 'runcoding_led_get_pulse',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'runcoding_led_get',
            isNotFor: ['Runcoding_display'],
            func(sprite, script) {
                const port = script.getNumberValue('PORT', script);
                const PULSEIN = Entry.hw.portData.PULSEIN;
                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                Entry.hw.sendQueue.GET[Entry.Runcoding_led.sensorTypes.PULSEIN] = {
                    port,
                    time: new Date().getTime(),
                };
                return PULSEIN ? PULSEIN[port] || 0 : 0;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.pulseIn(%1)',
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
        runcoding_led_get_timer: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            params: [],
            events: {},
            def: {
                params: [null],
                type: 'runcoding_led_get_timer',
            },
            paramsKeyMap: {},
            class: 'runcoding_led_get',
            isNotFor: ['Runcoding_display'],
            func(sprite, script) {
                const TIMER = Entry.hw.portData.TIMER;
                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                Entry.hw.sendQueue.GET[Entry.Runcoding_led.sensorTypes.TIMER] = {
                    port: 0,
                    time: new Date().getTime(),
                };
                return TIMER || 0;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.timer()',
                        blockType: 'param',
                        textParams: [],
                            },
                        ],
                    },
            },
        runcoding_led_toggle_led: {
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
                type: 'runcoding_led_toggle_led',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'Runcoding',
            isNotFor: ['Runcoding_display'],
            func(sprite, script) {
                const port = script.getNumberValue('PORT');
                let value = script.getValue('VALUE');

                if (typeof value === 'string') {
                    value = value.toLowerCase();
                }
                if (Entry.Runcoding_led.highList.indexOf(value) > -1) {
                    value = 255;
                } else if (Entry.Runcoding_led.lowList.indexOf(value) > -1) {
                    value = 0;
                } else {
                    throw new Error();
                }
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                    }
                Entry.hw.sendQueue.SET[port] = {
                    type: Entry.Runcoding_led.sensorTypes.DIGITAL,
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
        runcoding_led_digital_pwm: {
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
                type: 'runcoding_led_digital_pwm',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'Runcoding',
            isNotFor: ['Runcoding_display'],
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
                    type: Entry.Runcoding_led.sensorTypes.PWM,
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
        runcoding_led_display: {
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
                    type: 'Dropdown',
                    options: [
                        ['1 (작게)', '1'],
                        ['2 (중간)', '2'],
                        ['3 (크게)', '3'],
                        ['4 (매우크게)', '4'],
                    ],
                    value: '3',
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
                        type: 'text',
                        params: ['PLAY'],
                    },
                    {
                        type: 'number',
                        params: ['2'],
                    },
                    {
                        type: 'number',
                        params: ['10'],
                    },
                    null,
                ],
                type: 'runcoding_led_display',
            },
            paramsKeyMap: {
                TEXT: 0,
                X: 1,
                Y: 2,
                SIZE: 3,
            },
            class: 'Runcoding_display',
            isNotFor: ['Runcoding_display'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                let text = script.getValue('TEXT', script);
                text += '';
                const x = script.getNumberValue('X', script);
                const y = script.getNumberValue('Y', script);
                const size = script.getNumberValue('SIZE', script);

                if (!script.isStart) {
                    if (!sq.SET) {
                        sq.SET = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 200;

                    console.log('[OLED Display] 텍스트 표시 요청:', text, 'X:', x, 'Y:', y, 'Size:', size);
                    sq.SET[0] = {
                        type: Entry.Runcoding_led.sensorTypes.OLED_TEXT,
                        data: { 
                            x: x,
                            y: y,
                            size: size,
                            value: text 
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
                    console.log('[OLED Display] 블록 완료');
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
                        syntax: 'Arduino.runcoding_led_display(%1, %2, %3, %4)',
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
                                type: 'Dropdown',
                                options: [
                                    ['1 (작게)', '1'],
                                    ['2 (중간)', '2'],
                                    ['3 (크게)', '3'],
                                    ['4 (매우크게)', '4'],
                                ],
                                value: '3',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                    },
                ],
            },
        },
        runcoding_led_display_clear: {
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
                type: 'runcoding_led_display_clear',
            },
            paramsKeyMap: {},
            class: 'Runcoding_display',
            isNotFor: ['Runcoding_display'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                
                if (!script.isStart) {
                    if (!sq.SET) {
                        sq.SET = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;

                    sq.SET[0] = {
                        type: Entry.Runcoding_led.sensorTypes.OLED_CLEAR,
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
                py: [
                    {
                        syntax: 'Arduino.runcoding_led_display_clear()',
                        textParams: [],
                    },
                ],
            },
        },
        runcoding_led_display_smile: {
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
                type: 'runcoding_led_display_smile',
            },
            paramsKeyMap: {},
            class: 'Runcoding_display',
            isNotFor: ['Runcoding_display'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                
                if (!script.isStart) {
                    if (!sq.SET) {
                        sq.SET = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    // 명령 전송 후 짧은 시간만 대기 (1초 기다리기 블록과 함께 사용)
                    var timeValue = (60 / fps) * 50; // 약 50ms 대기 (명령 전송 확인용)

                    // 호출 횟수 확인을 위한 로그
                    const callCount = script.callCount || 0;
                    script.callCount = callCount + 1;
                    console.log('[OLED Display] 웃는얼굴 표시 요청 - 호출 횟수:', script.callCount, '타임스탬프:', new Date().getTime());
                    
                    // 포트 0 사용 (isRecentData에서 OLED_SMILE은 항상 허용하도록 수정됨)
                    sq.SET[0] = {
                        type: Entry.Runcoding_led.sensorTypes.OLED_SMILE,
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
                    console.log('[OLED Display] 웃는얼굴 블록 완료 - 호출 횟수:', script.callCount, '타임스탬프:', new Date().getTime());
                    // 상태 초기화 - 다음 반복을 위해
                    delete script.timeFlag;
                    delete script.isStart;
                    // callCount는 유지하여 다음 반복에서도 추적 가능
                    // Entry.engine.isContinue = false; 제거 - 반복 블록과 호환을 위해
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.runcoding_led_display_smile()',
                        textParams: [],
                            },
                        ],
                    },
            },
        runcoding_led_display_sad: {
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
                type: 'runcoding_led_display_sad',
            },
            paramsKeyMap: {},
            class: 'Runcoding_display',
            isNotFor: ['Runcoding_display'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                
                if (!script.isStart) {
                    if (!sq.SET) {
                        sq.SET = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;

                    console.log('[OLED Display] 슬픈표정 표시 요청');
                    sq.SET[0] = {
                        type: Entry.Runcoding_led.sensorTypes.OLED_SAD,
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
                    console.log('[OLED Display] 슬픈표정 블록 완료');
                    delete script.timeFlag;
                    delete script.isStart;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.runcoding_led_display_sad()',
                        textParams: [],
                    },
                ],
            },
        },
        runcoding_led_display_emotion: {
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
                        type: 'runcoding_led_emotion_list',
                    },
                ],
                type: 'runcoding_led_display_emotion',
            },
            paramsKeyMap: {
                EMOTION: 0,
            },
            class: 'Runcoding_display',
            isNotFor: ['Runcoding_display'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const emotion = script.getValue('EMOTION', script);

                if (!script.isStart) {
                    if (!sq.SET) {
                        sq.SET = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;

                    console.log('[OLED Display] 표정 표현하기 요청:', emotion);
                    
                    // emotion 값에 따라 다른 센서 타입 사용
                    let sensorType;
                    if (emotion === 'smile') {
                        sensorType = Entry.Runcoding_led.sensorTypes.OLED_SMILE;
                    } else if (emotion === 'sad') {
                        sensorType = Entry.Runcoding_led.sensorTypes.OLED_SAD;
                    } else if (emotion === 'angry') {
                        sensorType = Entry.Runcoding_led.sensorTypes.OLED_ANGRY;
                    } else {
                        sensorType = Entry.Runcoding_led.sensorTypes.OLED_SMILE; // 기본값
                    }
                    
                    sq.SET[0] = {
                        type: sensorType,
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
                    console.log('[OLED Display] 표정 표현하기 블록 완료');
                    delete script.timeFlag;
                    delete script.isStart;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.runcoding_led_display_emotion(%1)',
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
        runcoding_led_animation_star: {
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
                        params: ['10'],
                    },
                    {
                        type: 'number',
                        params: ['3'],
                    },
                    null,
                ],
                type: 'runcoding_led_animation_star',
            },
            paramsKeyMap: {
                COUNT: 0,
                SPEED: 1,
            },
            class: 'Runcoding_animation',
            isNotFor: ['Runcoding_display'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const count = script.getNumberValue('COUNT', script);
                const speed = script.getNumberValue('SPEED', script);

                if (!script.isStart) {
                    if (!sq.SET) {
                        sq.SET = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;

                    // 값 제한 (범위: 1~20, 1~10)
                    const limitedCount = Math.max(1, Math.min(20, count));
                    const limitedSpeed = Math.max(1, Math.min(10, speed));
                    
                    // 범위를 벗어난 입력 시 경고 로그
                    if (count < 1) {
                        console.log(`[OLED Animation] 개수 ${count}는 최소값 1 미만이므로 1로 조정되었습니다.`);
                    } else if (count > 20) {
                        console.log(`[OLED Animation] 개수 ${count}는 최대값 20을 초과하여 20으로 조정되었습니다.`);
                    }
                    
                    if (speed < 1) {
                        console.log(`[OLED Animation] 속도 ${speed}는 최소값 1 미만이므로 1로 조정되었습니다.`);
                    } else if (speed > 10) {
                        console.log(`[OLED Animation] 속도 ${speed}는 최대값 10을 초과하여 10으로 조정되었습니다.`);
                    }
                    
                    console.log('[OLED Animation] 별 떨어지기 시작 - 개수:', limitedCount, '속도:', limitedSpeed);
                    
                    sq.SET[0] = {
                        type: Entry.Runcoding_led.sensorTypes.OLED_ANIM_STAR,
                        data: {
                            count: limitedCount,
                            speed: limitedSpeed
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
                    console.log('[OLED Animation] 별 떨어지기 블록 완료');
                    delete script.timeFlag;
                    delete script.isStart;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.oled_animation_star(%1, %2)',
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
        runcoding_led_animation_flower: {
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
                        params: ['10'],
                    },
                    {
                        type: 'number',
                        params: ['3'],
                    },
                    null,
                ],
                type: 'runcoding_led_animation_flower',
            },
            paramsKeyMap: {
                COUNT: 0,
                SPEED: 1,
            },
            class: 'Runcoding_animation',
            isNotFor: ['Runcoding_display'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const count = script.getNumberValue('COUNT', script);
                const speed = script.getNumberValue('SPEED', script);

                if (!script.isStart) {
                    if (!sq.SET) {
                        sq.SET = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;

                    // 값 제한 (범위: 1~20, 1~10)
                    const limitedCount = Math.max(1, Math.min(20, count));
                    const limitedSpeed = Math.max(1, Math.min(10, speed));
                    
                    // 범위를 벗어난 입력 시 경고 로그
                    if (count < 1) {
                        console.log(`[OLED Animation] 개수 ${count}는 최소값 1 미만이므로 1로 조정되었습니다.`);
                    } else if (count > 20) {
                        console.log(`[OLED Animation] 개수 ${count}는 최대값 20을 초과하여 20으로 조정되었습니다.`);
                    }
                    
                    if (speed < 1) {
                        console.log(`[OLED Animation] 속도 ${speed}는 최소값 1 미만이므로 1로 조정되었습니다.`);
                    } else if (speed > 10) {
                        console.log(`[OLED Animation] 속도 ${speed}는 최대값 10을 초과하여 10으로 조정되었습니다.`);
                    }
                    
                    console.log('[OLED Animation] 꽃송이 떨어지기 시작 - 개수:', limitedCount, '속도:', limitedSpeed);
                    
                    sq.SET[0] = {
                        type: Entry.Runcoding_led.sensorTypes.OLED_ANIM_FLOWER,
                        data: {
                            count: limitedCount,
                            speed: limitedSpeed
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
                    console.log('[OLED Animation] 꽃송이 떨어지기 블록 완료');
                    delete script.timeFlag;
                    delete script.isStart;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.oled_animation_flower(%1, %2)',
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
        runcoding_led_animation_snow: {
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
                        params: ['10'],
                    },
                    {
                        type: 'number',
                        params: ['3'],
                    },
                    null,
                ],
                type: 'runcoding_led_animation_snow',
            },
            paramsKeyMap: {
                COUNT: 0,
                SPEED: 1,
            },
            class: 'Runcoding_animation',
            isNotFor: ['Runcoding_display'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const count = script.getNumberValue('COUNT', script);
                const speed = script.getNumberValue('SPEED', script);

                if (!script.isStart) {
                    if (!sq.SET) {
                        sq.SET = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;

                    // 값 제한 (범위: 1~20, 1~10)
                    const limitedCount = Math.max(1, Math.min(20, count));
                    const limitedSpeed = Math.max(1, Math.min(10, speed));
                    
                    // 범위를 벗어난 입력 시 경고 로그
                    if (count < 1) {
                        console.log(`[OLED Animation] 개수 ${count}는 최소값 1 미만이므로 1로 조정되었습니다.`);
                    } else if (count > 20) {
                        console.log(`[OLED Animation] 개수 ${count}는 최대값 20을 초과하여 20으로 조정되었습니다.`);
                    }
                    
                    if (speed < 1) {
                        console.log(`[OLED Animation] 속도 ${speed}는 최소값 1 미만이므로 1로 조정되었습니다.`);
                    } else if (speed > 10) {
                        console.log(`[OLED Animation] 속도 ${speed}는 최대값 10을 초과하여 10으로 조정되었습니다.`);
                    }
                    
                    console.log('[OLED Animation] 눈송이 떨어지기 시작 - 개수:', limitedCount, '속도:', limitedSpeed);
                    
                    sq.SET[0] = {
                        type: Entry.Runcoding_led.sensorTypes.OLED_ANIM_SNOW,
                        data: {
                            count: limitedCount,
                            speed: limitedSpeed
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
                    console.log('[OLED Animation] 눈송이 떨어지기 블록 완료');
                    delete script.timeFlag;
                    delete script.isStart;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.oled_animation_snow(%1, %2)',
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
        runcoding_led_animation_stop: {
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
                type: 'runcoding_led_animation_stop',
            },
            paramsKeyMap: {},
            class: 'Runcoding_animation',
            isNotFor: ['Runcoding_display'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                
                if (!script.isStart) {
                    if (!sq.SET) {
                        sq.SET = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;

                    console.log('[OLED Animation] 애니메이션 정지');
                    
                    sq.SET[0] = {
                        type: Entry.Runcoding_led.sensorTypes.OLED_ANIM_STOP,
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
                    console.log('[OLED Animation] 정지 블록 완료');
                    delete script.timeFlag;
                    delete script.isStart;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.oled_animation_stop()',
                        textParams: [],
                    },
                ],
            },
        },
    };
};

module.exports = Entry.Runcoding_display;
