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
    },
    highList: ['high', '1', 'on'],
    lowList: ['low', '0', 'off'],
    BlockState: {},
};

Entry.jikko.setLanguage = function() {
    return {
        ko: {
            template: {
                jikko_on_digital_value: '디지털 핀 %1 번을 켜기 %2',
                jikko_off_digital_value: '디지털 핀 %1 번을 끄기 %2',
                jikko_toggle_pwm: '디지털 %1 번 핀을 %2 (으)로 정하기 %3',
                jikko_toggle_led: '디지털 %1 번 핀 %2 %3',
            },
        },
        en: {
            template: {
                jikko_on_digital_value: 'turn on digital pin %1 %2',
                jikko_off_digital_value: 'turn off digital pin %1 %2',
                jikko_toggle_pwm: 'Digital %1 Pin %2 %3',
                jikko_toggle_led: 'Digital %1 Pin %2 %3',
            },
        },
    };
};

Entry.jikko.blockMenuBlocks = [
    'jikko_on_digital_value',
    'jikko_off_digital_value',
    'jikko_toggle_pwm',
    'jikko_toggle_led',
];

Entry.jikko.getBlocks = function() {
    return {
        jikko_on_digital_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic', // 블록 모양 템플릿. 자세한 목록은 docs 를 참고해주세요
            statements: [],
            params: [
                //입력될 파라미터들의 속성을 정의
                {
                    type: 'Block',
                    accept: 'string', //숫자만 들어가도 string 입니다. 엔트리엔 이를 구분하지 않습니다.
                },
                // basic skeleton 의 마지막엔 인디케이터를 추가해주셔야 합니다.
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            def: {
                params: [
                    //파라미터에 들어갈 기본 값.
                    {
                        type: 'number',
                        params: [2],
                    },
                ],
                type: 'jikko_on_digital_value', // 블록 상속과 관련된 값입니다. 블록명과 동일하게 해주면 됩니다.
            },
            paramsKeyMap: {
                // 실제 블록의 로직인 func 에서 해당 인덱스의 파라미터를 가져올때 쓸 key 값
                PORT: 0,
            },
            events: {},
            class: 'jikkoBlock', // 블록을 묶어서 보여줄 단위값. 이 값이 바뀌면 사이에 가로줄이 생깁니다.
            //isNotFor: ['jikko'], // 하드웨어가 연결되었을 경우만 블록을 보여주겠다는 판단값입니다. name 과 동일해야 합니다.
            func(sprite, script) {
                // paramsKeyMap 에서 PORT 는 파라미터의 0번 인덱스 값이었습니다.
                const portNumber = script.getNumberValue('PORT');
                Entry.hw.sendQueue[portNumber] = 1;
                // 값을 반환해야하는 경우는 return 할 수 있습니다.
            },
            syntax: {
                // 파이썬 문법 변환에 사용되고 있습니다.
                js: [],
                py: [
                    {
                        syntax: 'jikko.turnOnDigitalPort(%1)',
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
        jikko_off_digital_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            def: {
                params: [
                    {
                        type: 'number',
                        params: [2],
                    },
                ],
                type: 'jikko_off_digital_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            events: {},
            class: 'jikkoBlock',
            //NotFor: ['jikko'],
            func(sprite, script) {
                const portNumber = script.getNumberValue('PORT');
                Entry.hw.sendQueue[portNumber] = 0;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'jikko.turnOffDigitalPort(%1)',
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
                    null,
                    null,
                ],
                type: 'jikko_toggle_led',
            },
            paramsKeyMap: {
                VALUE: 0,
                OPERATOR: 1,
            },
            class: 'jikkoBlock',
            // isNotFor: ['arduino'],
            func(sprite, script) {
                const port = script.getNumberValue('VALUE');
                const operator = script.getField('OPERATOR');
                const value = operator == 'on' ? 255 : 0;
                Entry.hw.setDigitalPortValue(port, value);
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.pin_digital(%1, %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
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
                                converter: Entry.block.converters.returnStringValue,
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
                Entry.hw.setDigitalPortValue(port, value);
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
    };
};

//Entry.jikko = new jikko();
module.exports = Entry.jikko;
