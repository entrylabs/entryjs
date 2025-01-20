'use strict';

Entry.SensorUno = {
    id: '57.1',
    name: 'SensorUno',
    url: 'https://excitetouch.com/', 
    imageName: 'suno.png',
    title: {
        ko: '센서우노',
        en: 'Sensor Uno',
    },
    
    setZero: function() {
        Entry.hw.sendQueue.readablePorts = [];
        for (var port = 0; port < 20; port++) {
            Entry.hw.sendQueue[port] = 0;
            Entry.hw.sendQueue.readablePorts.push(port);
        }
        Entry.hw.update();
    },
};

Entry.SensorUno.setLanguage = function() {
    return {
        ko: {
            template: {
                suno_sensor_title: '       센서 블록',
                suno_output_title: '       출력 블록',
                suno_ext_get_analog_value: ' %1 센서값',
                suno_ext_get_analog_value_map: '%1을  {%2~%3}의  범위에서  {%4~%5}의  범위로 변환한 값',
                suno_get_trig_number: '%1',
                suno_get_echo_number: '%1',
                suno_get_digital_toggle: '%1',
                suno_ext_get_ultrasonic_value: '초음파센서 / 📏(cm)  :   트리거(Trig)%1, 에코(Echo)%2',
                suno_get_output_number: '%1',
                suno_ext_toggle_output: ' %1  %2 %3',
                suno_get_pwm_port_number: '%1',
                suno_ext_digital_pwm: ' %1을 %2(으)로 정하기 (0~255) %3',
                suno_get_servo_number:  '%1',
                suno_ext_set_servo: ' %1핀에 연결된 서보모터를 %2º(으)로 정하기 (1~180) %3',
                suno_ext_get_digital: ' %1버튼이 눌렸는가',
                
            },
        },
        en: {
            template: {
                suno_sensor_title: '     Sensor Block',
                suno_output_title: '     Output Block',
                suno_sensor_title: 'Sensor Block',
                suno_ext_get_analog_value: ' %1 Sensor value',
                suno_ext_get_analog_value_map: 'Map Value %1 %2 ~ %3 to %4 ~ %5',
                suno_get_trig_number: '%1',
                suno_get_echo_number: '%1',
                suno_get_digital_toggle: '%1',
                suno_ext_get_ultrasonic_value: 'Reads 📏(cm) of ultrasonic sensor trig pin %1 echo pin %2',
                suno_get_output_number: '%1',
                suno_ext_toggle_output: ' %1 %2 %3',
                suno_get_pwm_port_number: '%1',
                suno_ext_digital_pwm: ' Set %1 with %2 (0~255) %3',
                suno_get_servo_number:  '%1',
                suno_ext_set_servo: ' Set servo pin as %1 and angle as %2º (1~180) %3',
                suno_ext_get_digital: ' %1Button is pressed',
                
            },
        },
    };
};


Entry.SensorUno.blockMenuBlocks = [
    'suno_sensor_title',
    'suno_ext_get_analog_value',
    'suno_ext_get_analog_value_map',
    'suno_ext_get_digital',
    'suno_output_title',
    'suno_ext_toggle_output',
    'suno_ext_digital_pwm',
    'suno_ext_set_servo',
  
];


Entry.SensorUno.getBlocks = function() {
    return {
        suno_sensor_title: {
            skeleton: 'basic_text',
            skeletonOptions: {
                box: {
                    offsetX: 0,
                    offsetY: 5,
                },
            },
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#4682B4',

            params: [
                {
                    type: 'Text',
                    text: Lang.template.suno_sensor_title,
                    color: '#4682B4',
                    align: 'left',

                },
            ],
            def: {
                type: 'suno_sensor_title',
            },
            class: 'SensorUnoGet',
            isNotFor: ['SensorUno'],
            
            events: {},


        },


        suno_output_title: {
            skeleton: 'basic_text',
            skeletonOptions: {
                box: {
                    offsetX: 0,
                    offsetY: 5,
                },
            },
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#4682B4',

            params: [
                {
                    type: 'Text',
                    text: Lang.template.suno_output_title,
                    color: '#4682B4',
                    align: 'left',

                },
            ],
            def: {
                type: 'suno_output_title',
            },
            class: 'SensorUno',
            isNotFor: ['SensorUno'],
            
            events: {},


        },


        suno_ext_analog_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['초음파   📏(cm)',    'A7'],
                        ['조이스틱 X축',        'A2'],
                        ['조이스틱 Y축',        'A6'],
                        ['마이크      ',        'A0'],
                        ['빛 (A1)      🔶',    'A1'],
                        ['빛 (A4)      🔷',    'A4'],
                        ['라인/온도 (A3)💚',    'A3'],
                        ['라인/온도 (A5)💛',    'A5'],
                    ],
                    value: 'A7',
                    fontSize: 12,
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
                                    ['초음파   📏(cm)',    'A7'],
                                    ['조이스틱 X축',        'A2'],
                                    ['조이스틱 Y축',        'A6'],
                                    ['마이크      ',        'A0'],
                                    ['빛 (A1)      🔶',    'A1'],
                                    ['빛 (A4)      🔷',    'A4'],
                                    ['라인/온도 (A3)💚',    'A3'],
                                    ['라인/온도 (A5)💛',    'A5'],
                                ],
                                value: 'A7',
                                fontSize: 12,
                                converter: Entry.block.converters.returnStringKey,
                                codeMap: 'Entry.CodeMap.Arduino.suno_ext_analog_list[0]',
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'suno_ext_analog_list',
                    },
                ],
            },
        },
        suno_ext_get_analog_value: {
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
                        type: 'suno_ext_analog_list',
                    },
                ],
                type: 'suno_ext_get_analog_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'SensorUnoGet',
            isNotFor: ['SensorUno'],
                        
            
            func(sprite, script) {
                const signal = script.getValue('PORT', script);
                return Entry.hw.getAnalogPortValue(signal[1]);
            },
            

            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'SensorUno.analogRead(%1)',
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
        suno_ext_get_analog_value_map: {
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
                        type: 'suno_ext_get_analog_value',
                        params: [
                            {
                                type: 'suno_ext_analog_list',
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
                type: 'suno_ext_get_analog_value_map',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE2: 1,
                VALUE3: 2,
                VALUE4: 3,
                VALUE5: 4,
            },
            class: 'SensorUnoGet',
            isNotFor: ['SensorUno'],
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
                        syntax: 'SensorUno.map(%1, %2, %3, %4, %5)',
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

        suno_get_trig_number: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['D2', '2'],
                    
                    ],
                    value: '2',
                    fontSize: 12,
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
                                    ['D2', '2'],
                                
                                ],
                                value: '2',
                                fontSize: 12,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'suno_get_trig_number',
                    },
                ],
            },
        },
        suno_get_echo_number: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['D4', '4'],
                    
                    ],
                    value: '4',
                    fontSize: 12,
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
                                    ['D4', '4'],
                                
                                ],
                                value: '4',
                                fontSize: 12,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'suno_get_echo_number',
                    },
                ],
            },
        },
  
        suno_get_output_number: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['DC 모터 ( ⚙ )',  '7'],
                        ['빨간 LED (📏❌)', '2'],
                        ['초록 LED (⚙2❌)', '3'],
                        ['파란 LED (📏❌)', '4'],
                        ['노란 LED', '5'],
                    ],
                    value: '7',
                    fontSize: 12,
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
                                    ['DC 모터 ( ⚙ )',  '7'],
                                    ['빨간 LED (📏❌)', '2'],
                                    ['초록 LED (⚙2❌)', '3'],
                                    ['파란 LED (📏❌)', '4'],
                                    ['노란 LED', '5'],
                                ], 
                                value: '7',
                                fontSize: 12,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'suno_get_output_number',
                    },
                ],
            },
        },
 
        suno_ext_get_digital: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['빨간 / 조이스틱',     '8'],
                        ['초록 (⚙❌)', '11'],
                        ['파란 (⚙❌)', '9'],
                        ['노란 (⚙❌)', '10'],
                    ],
                    value: '8',
                    fontSize: 12,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'suno_ext_get_digital',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'SensorUnoGet',
            isNotFor: ['SensorUno'],
            func: function(sprite, script) {
                return Entry.hw.getDigitalPortValue(script.getNumberField('PORT', script));
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'SensorUno.servomotorWrite(%1, %2)',
                        textParam: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['빨간 / 조이스틱',     '8'],
                                    ['초록(⚙❌)', '11'],
                                    ['파란(⚙❌)', '9'],
                                    ['노란(⚙❌)', '10'],
                                ],
                                value: '8',
                                fontSize: 12,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                    },
                ],
            },
        },


        suno_get_digital_toggle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],

            
            params: [
                {
                    type: 'Dropdown',
                    options: [[Lang.Blocks.ARDUINO_on, 'on'], [Lang.Blocks.ARDUINO_off, 'off']],
                    value: 'on',
                    fontSize: 12,
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
                                fontSize: 12,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValueUpperCase,
                                codeMap: 'Entry.CodeMap.Arduino.suno_get_digital_toggle[0]',
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            },
                        ],
                        keyOption: 'suno_get_digital_toggle',
                    },
                ],
            },
        },
        
        suno_toggle_led: {
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
                        type: 'suno_get_output_number',
                    },
                    null,
                    null,
                ],
                type: 'suno_toggle_led',
            },
            paramsKeyMap: {
                VALUE: 0,
                OPERATOR: 1,
            },
            class: 'SensorUno',
            isNotFor: ['SensorUno'],
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
                        syntax: 'SensorUno.pin_digital(%1, %2)',
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

        suno_ext_toggle_output: {
            parent: 'suno_toggle_led',
            isNotFor: ['SensorUno'],
            def: {
                params: [
                    {
                        type: 'suno_get_output_number',
                    },
                    null,
                    null,
                ],
                type: 'suno_ext_toggle_output',
            },
            class: 'SensorUno',
            syntax: { js: [], py: ['SensorUno.toggle_led(%1)'] },
        },


        suno_get_pwm_port_number: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['⚙1(🔴)', '11'],
                        ['⚙1(🔵)', '10'],
                        ['⚙2(🔴)', '3'],
                        ['⚙2(🔵)', '9'],
                    ],
                    value: '11',
                    fontSize: 16,
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
                                    ['⚙1(🔴)', '11'],
                                    ['⚙1(🔵)', '10'],
                                    ['⚙2(🔴)', '3'],
                                    ['⚙2(🔵)', '9'],
                                ], 
                                value: '11',
                                fontSize: 16,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'suno_get_pwm_port_number',
                    },
                ],
            },
        },

        
        suno_ext_digital_pwm: {
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
                        type: 'suno_get_pwm_port_number',
                    },
                    {
                        type: 'text',
                        params: ['255'],
                    },
                    null,
                ],
                type: 'suno_ext_digital_pwm',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'SensorUno',
            isNotFor: ['SensorUno'],

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
                        syntax: 'SensorUno.analogWrite(%1, %2)',
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
        suno_get_servo_number: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['D6', '6'],
                    
                    ],
                    value: '6',
                    fontSize: 12,
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
                                    ['D6', '6'],
                                
                                ],
                                value: '6',
                                fontSize: 12,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'suno_get_servo_number',
                    },
                ],
            },
        },
       

        suno_ext_set_servo: {
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
                        type: 'suno_get_servo_number',
                        
                    },
                    {
                        type: 'text',
                        params: ['10'],
                    },
                    null,
                ],
                type: 'suno_ext_set_servo',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'SensorUno',
            isNotFor: ['SensorUno'],

            func(sprite, script) {
                const port = script.getNumberValue('PORT');
                let value = script.getNumberValue('VALUE');
                value = Math.round(value);
                value = Math.max(value, 0);
                value = Math.min(value, 180);
                Entry.hw.setDigitalPortValue(port, value);
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'SensorUno.servomotorWrite(%1, %2)',
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

module.exports = Entry.SensorUno;
