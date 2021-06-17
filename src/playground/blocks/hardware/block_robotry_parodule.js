'use strict';

Entry.Robotry_Parodule = {
    id: ['44.2'], // 하드웨어 마다 따로 발급 받아야함
    name: 'Robotry_Parodule', // isNotFor 속성과 대소문자까지 정확하게 매치되어야 합니다.
    url: 'http://robotry.co.kr', // 생략 가능합니다. 엔트리 사이트에서 홍보시 사용됩니다.
    imageName: 'arduinoNano.png', // images/hardware, images/hw 폴더 내에 존재하는 이미지입니다.
    title: {
        ko: '로보트리 파로듈',
        en: 'Robotry Parodule',
    },
// 엔트리 정지시 하드웨어 초기화 로직
   setZero() { 
        if (!Entry.hw.sendQueue.SET) {
            Entry.hw.sendQueue = {
                GET: {},
                SET: {},
            };
        } 
        else {
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
        NEO_LED: 9,
    },
    BlockState: {},
};

// 언어 적용
Entry.Robotry_Parodule.setLanguage = function() {
    return {
        ko: {
            template: {
                Robotry_Parodule_get_analog_value_map: '%1 의 범위를 %2 ~ %3 에서 %4 ~ %5 로 바꾼값',
                Robotry_Parodule_get_sensor_value: '%1 의 센서 값',
                Robotry_Parodule_set_neopixel:'%1 의 색상을 %2 (으)로 지정 %3',
                Robotry_Parodule_set_led:'%1 LED %2 %3',
                Robotry_Parodule_set_custom_neopixel: '%1 의 색상을 %2 (으)로 지정 %3',
            },
            Helper: {
                Robotry_Parodule_get_analog_value_map: 
                "센서 값의 범위를 다른 범위로 변환해주는 블럭입니다.",
                Robotry_Parodule_get_sensor_value: 
                "센서 블럭은 0 부터 1023까지의 값을 표현할 수 있습니다.",
                Robotry_Parodule_set_neopixel:
                '선택된 색상을 LED에 출력합니다.',
                Robotry_Parodule_set_custom_neopixel: 
                '0 부터 360 값을 입력하여 색상을 표현할 수 있습니다.',
                Robotry_Parodule_set_led:
                'LED 를 켜고 끌수 있습니다',               
            },
            Blocks: {

            }
        },
        en: {
            template: {
                Robotry_Parodule_get_analog_value_map: '%1 의 범위를 %2 ~ %3 에서 %4 ~ %5 로 바꾼값',
                Robotry_Parodule_get_sensor_value: '%1 의 센서 값',
                Robotry_Parodule_set_neopixel:'%1 의 색상을 %2 (으)로 지정 %3',
                Robotry_Parodule_set_led:'%1 LED %2 %3',
                Robotry_Parodule_set_custom_neopixel: '%1 의 색상을 %2 (으)로 지정 %3',
            },
            Helper: {
                Robotry_Parodule_get_analog_value_map: 
                "센서 값의 범위를 다른 범위로 변환해주는 블럭입니다.",
                Robotry_Parodule_get_sensor_value: 
                "센서 블럭은 0 부터 1023까지의 값을 표현할 수 있습니다.",
                Robotry_Parodule_set_neopixel:
                '선택된 색상을 LED에 출력합니다.',
                Robotry_Parodule_set_custom_neopixel: 
                '0 부터 360 값을 입력하여 색상을 표현할 수 있습니다.',
                Robotry_Parodule_set_led:
                'LED 를 켜고 끌수 있습니다',     
            },
            Blocks: {

            }
        },
    };
};

// 엔트리에 등록할 블럭들의 블럭명 작성
// 이 곳에 작성된 순서대로 블럭들이 나열됩니다.
Entry.Robotry_Parodule.blockMenuBlocks = [
    'Robotry_Parodule_get_analog_value_map',
    'Robotry_Parodule_get_sensor_value',
    'Robotry_Parodule_set_neopixel',
    'Robotry_Parodule_set_led',
    'Robotry_Parodule_set_custom_neopixel',
    

];

// 블럭 생성
Entry.Robotry_Parodule.getBlocks = function() {
    return { 
        Robotry_Parodule_text: {
            color: '#FFD974',
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'TextInput',
                },
            ],
            events: {},
            def: {
            },
            paramsKeyMap: {
                NAME: 0,
            },
            func(sprite, script) {
                return script.getStringField('NAME');
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        textParams: [
                            {
                                type: 'TextInput',
                                value: 10,
                                converter: Entry.block.converters.returnStringOrNumberByValue,
                            },
                        ],
                        keyOption: 'Robotry_Parodule_text',
                    },
                ],
            },
        },

        // Analog value Mapping Start
        Robotry_Parodule_get_analog_value_map: {
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
                        type: 'number',
                        params: ['센서'],
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
                        params: ['255'],
                    },
                ],
                type: 'Robotry_Parodule_get_analog_value_map',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE2: 1,
                VALUE3: 2,
                VALUE4: 3,
                VALUE5: 4,
            },
            class: 'Get',
            isNotFor: ['Robotry_Parodule'],
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
                        syntax: 'Robotry.map(%1, %2, %3, %4, %5)',
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
        // Analog value Mapping End

        // 센서 입력 블럭  Start
        Robotry_Parodule_get_sensor_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['A2', 2], ['A3', 3]],
                    value: [3],
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
                type: 'Robotry_Parodule_get_sensor_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'Get',
            isNotFor: ['Robotry_Parodule'],
            func(sprite, script) {
                let port = script.getValue('PORT', script);
                const ANALOG = Entry.hw.portData.ANALOG;
                if (port[0] === 'A') {
                    port = port.substring(1);
                }
                return ANALOG ? ANALOG[port] || 0 : 0;
            },
        }, // 센서 입력 블럭 End

        // 네오 픽셀 LED 제어 블럭 Start
        Robotry_Parodule_set_neopixel: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['D2', 2],
                        ['D3', 3],
                        ['D4', 4],
                        ['D5', 5],
                        ['D6', 6],
                        ['D7', 7],
                        ['D8', 8],
                        ['D9', 9],
                        ['D10', 10],
                        ['D11', 11],
                        ['D12', 12],
                        ['D13', 13],
                    ],
                    value: 3,
                    fontSize: 12,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                    null,
                    null,
                ],
                type: 'Robotry_Parodule_set_neopixel',
            },
            paramsKeyMap: {
                PORT: 0,
                COLOR: 1,
            },
            class: 'Set',
            isNotFor: ['Robotry_Parodule'],
            func(sprite, script) {
                const port = script.getNumberValue('PORT');
                const color = script.getField('COLOR', script);
                const rgb = Entry.hex2rgb(color);
                console.log(Entry.Utils.hexToHsl(color));

                var red = rgb.r;
                var green = rgb.g;
                var blue = rgb.b;

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[port] = {
                    type: Entry.Robotry_Parodule.sensorTypes.NEO_LED,
                    data: {
                        r:red,
                        g:green,
                        b:blue,
                    },
                    time: new Date().getTime(),
                };
                
                return script.callReturn();
            },
        }, // 네오 픽셀 LED 제어 블럭 End

        // 커스텀 네오 픽셀 LED 제어 블럭 Start
        Robotry_Parodule_set_custom_neopixel: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['D2', 2],
                        ['D3', 3],
                        ['D4', 4],
                        ['D5', 5],
                        ['D6', 6],
                        ['D7', 7],
                        ['D8', 8],
                        ['D9', 9],
                        ['D10', 10],
                        ['D11', 11],
                        ['D12', 12],
                        ['D13', 13],
                    ],
                    value: 3,
                    fontSize: 12,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type : 'Block',
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
                    null,
                    {
                        type: 'Robotry_Parodule_text',
                        params: ['360'],
                    },
                ],
                type: 'Robotry_Parodule_set_custom_neopixel',
            },
            paramsKeyMap: {
                PORT: 0,
                HUE: 1,
            },
            class: 'Set',
            isNotFor: ['Robotry_Parodule'],
            func(sprite, script) {
                let h, s, l;
                
                const port = script.getNumberValue('PORT');
                const hue = script.getNumberValue('HUE');
                const hsl = { h, s, l };
                
                hsl.h = hue;    // 색상 0~360
                hsl.s = 1;      // 채도 0~1
                hsl.l = 0.5;    // 명도 0~1 

                const rgb = Entry.hex2rgb(Entry.Utils.hslToHex(hsl));

                var red = rgb.r;
                var green = rgb.g;
                var blue = rgb.b;

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[port] = {
                    type: Entry.Robotry_Parodule.sensorTypes.NEO_LED,
                    data: {
                        r:red,
                        g:green,
                        b:blue,
                    },
                    time: new Date().getTime(),
                };
                
                return script.callReturn();
            },
        }, // 커스텀 네오 픽셀 LED 제어 블럭 End

        // LED ON/OFF Start
        Robotry_Parodule_set_led: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['D13', 13], ['D13', 13]],
                    value: [13],
                    fontSize: 12,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [[Lang.Blocks.ARDUINO_on, 'on'], [Lang.Blocks.ARDUINO_off, 'off']],
                    value: 'on',
                    fontSize: 12,
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
                    null,
                    null,
                    null,
                ],
                type: 'Robotry_Parodule_set_led',
            },
            paramsKeyMap: {
                VALUE: 0,
                OPERATOR: 1,
            },
            class: 'Set',
            isNotFor: ['Robotry_Parodule'],
            func(sprite, script) {
                const port = script.getNumberValue('VALUE');
                const operator = script.getField('OPERATOR');
                const value = operator == 'on' ? 255 : 0;
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[port] = {
                    type: Entry.Robotry_Parodule.sensorTypes.DIGITAL,
                    data: value,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
        }, // LED ON/OFF Block End 

        /*
         * LED 모터 등을 PWM 신호로 제어할수 있는 블럭
         * IC 에서 PWM 제어를 지원하느 포트에서만 사용할수 있으니 
         * 데이터 시트를 참고해서 파라미터를 지정해줘야한다.
         */
        // PWM 제어블럭 Start
        Robotry_Parodule_set_PWM: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    // 블럭 파라미터 타입 설정
                },
                {   // 하드웨어 제어블럭 뒤에 붙는 아이콘
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    // 파라미터 참조 함수 정의 없으면 null
                ],
                type: 'Robotry_Parodule_set_PWM',
            },
            paramsKeyMap: {
                // 파라미터의 키값을 맵핑 한다.
            },
            class: 'Set',
            isNotFor: ['Robotry_Parodule'],
            func(sprite, script) {
                // 이 곳에 블럭의 함수 로직 작성
            },
        }, // PWM 제어블럭 End
    };
};

// 엔트리에서 하드웨어 블럭 클래스를 인식할 수 있도록 내보내기
module.exports = Entry.Robotry_Parodule;