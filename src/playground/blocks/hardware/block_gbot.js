'use strict';

Entry.GBot = {
    id: '49.1',
    name: 'GBot',
    url: 'https://www.gbot123.com/',
    imageName: 'Gbot.png',
    title: {
        ko: 'G.Bot',
        en: 'G.Bot',
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
		LED_INIT: 9,
        LED_BRIGHT: 10,
        LED_ONOFF: 11,
        LED_OUTPUT: 12,
        LED_OFF: 13,
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
        if (data == '0') {
            data = 48;
        } else if (data == '1') {
            data = 49;
        }
        return data;
    },

    BlockState: {},
};

Entry.GBot.setLanguage = function() {
    return {
        ko: {
            template: {
                g_bot_get_analog_value: '아날로그 %1 번 센서값',
                g_bot_get_analog_value_map: '%1 의 범위를 %2 ~ %3 에서 %4 ~ %5 로 바꾼값',
                g_bot_get_ultrasonic_value: '초음파 센서 Trig %1 Echo %2 센서값',
                g_bot_toggle_led: '디지털 %1 번 핀 %2 %3',
                g_bot_digital_pwm: '디지털 %1 번 핀을 %2 (으)로 정하기 %3',
                g_bot_set_tone: '디지털 %1 번 핀의 버저를 %2 %3 음으로 %4 초 연주하기 %5',
                g_bot_set_servo: '디지털 %1 번 핀의 서보모터를 %2 의 각도로 정하기 %3',
                g_bot_get_digital: '디지털 %1 번 센서값',
				g_bot_set_led_init: '디지털 DIN 10, CS 11, CLK 12 핀으로 설정하기',
				g_bot_set_brightness: '밝기를 %1 (으)로 정하기',
                g_bot_get_brightness: '%1',
                g_bot_get_led_row: '%1',
                g_bot_get_led_col: '%1',
				g_bot_led_onoff: '%1 행 - %2 열의 LED %3',
				g_bot_led_output: '%1 %2 에 %3 출력하기',
				g_bot_led_off_all: 'LED 모두 끄기',
            },
        },
        en: {
            template: {
                g_bot_get_analog_value: 'Analog %1 Sensor value',
                g_bot_get_analog_value_map: 'Map Value %1 %2 ~ %3 to %4 ~ %5',
                g_bot_get_ultrasonic_value: 'Read ultrasonic sensor trig pin %1 echo pin %2',
                g_bot_toggle_led: 'Digital %1 Pin %2 %3',
                g_bot_digital_pwm: 'Digital %1 Pin %2 %3',
                g_bot_set_tone: 'Play tone pin %1 on note %2 octave %3 beat %4 %5',
                g_bot_set_servo: 'Set servo pin %1 angle as %2 %3',
                g_bot_get_digital: 'Digital %1 Sensor value',
				g_bot_set_led_init: 'Set Digital DIN 10, CS 11, CLK 12 pin',
				g_bot_set_brightness: 'Set brightness as %1',
                g_bot_get_brightness: '%1',
                g_bot_get_led_row: '%1',
                g_bot_get_led_col: '%1',
				g_bot_led_onoff: 'Turn on LED in row %1 - col %2',
				g_bot_led_output: 'Output %1 %2 %3',
				g_bot_led_off_all: 'Turn off all LEDs',
            },
        },
    };
};

Entry.GBot.blockMenuBlocks = [
    'g_bot_get_analog_value',
    'g_bot_get_analog_value_map',
    'g_bot_get_ultrasonic_value',
    'g_bot_get_digital',
    'g_bot_toggle_led',
    'g_bot_digital_pwm',
    'g_bot_set_servo',
    'g_bot_set_tone',
	'g_bot_set_led_init',
	'g_bot_set_brightness',
    'g_bot_get_brightness',
    'g_bot_get_led_row',
    'g_bot_get_led_col',
	'g_bot_led_onoff',
	'g_bot_led_output',
	'g_bot_led_off_all',
];

Entry.GBot.getBlocks = function() {
    return {
        //region GBot
        g_bot_analog_list: {
            parent: 'arduino_ext_analog_list',
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
            syntax: undefined,
        },
        g_bot_ext_analog_list: {
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
            },
            func(sprite, script) {
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
                                codeMap: 'Entry.CodeMap.Arduino.arduino_ext_analog_list[0]',
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'arduino_ext_analog_list',
                    },
                ],
            },
        },
        g_bot_get_analog_value: {
            parent: 'arduino_ext_get_analog_value',
            template: Lang.template.arduino_ext_get_analog_value,
            def: {
                params: [
                    {
                        type: 'g_bot_analog_list',
                    },
                ],
                type: 'g_bot_get_analog_value',
            },
            isNotFor: ['GBot'],
            syntax: undefined,
        },
        g_bot_get_analog_value_map: {
            parent: 'arduino_ext_get_analog_value_map',
            template: Lang.template.arduino_ext_get_analog_value_map,
            def: {
                params: [
                    {
                        type: 'g_bot_get_analog_value',
                        params: [
                            {
                                type: 'g_bot_analog_list',
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
                type: 'g_bot_get_analog_value_map',
            },
            isNotFor: ['GBot'],
            syntax: undefined,
        },
        g_bot_get_ultrasonic_value: {
            template: Lang.template.arduino_ext_get_ultrasonic_value,
            parent: 'arduino_ext_get_ultrasonic_value',
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
                type: 'g_bot_get_ultrasonic_value',
            },
            isNotFor: ['GBot'],
            syntax: undefined,
        },
        g_bot_get_digital: {
            template: Lang.template.arduino_ext_get_digital,
            parent: 'arduino_ext_get_digital',
            def: {
                params: [
                    {
                        type: 'arduino_get_port_number',
                    },
                ],
                type: 'g_bot_get_digital',
            },
            isNotFor: ['GBot'],
            syntax: undefined,
        },
        g_bot_toggle_led: {
            template: Lang.template.arduino_ext_toggle_led,
            parent: 'arduino_ext_toggle_led',
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
                type: 'g_bot_toggle_led',
            },
            isNotFor: ['GBot'],
            syntax: undefined,
        },
        g_bot_digital_pwm: {
            template: Lang.template.arduino_ext_digital_pwm,
            parent: 'arduino_ext_digital_pwm',
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
                type: 'g_bot_digital_pwm',
            },
            isNotFor: ['GBot'],
            syntax: undefined,
        },
        g_bot_set_tone: {
            template: Lang.template.arduino_ext_set_tone,
            parent: 'arduino_ext_set_tone',
            def: {
                params: [
                    {
                        type: 'arduino_get_port_number',
                        value: 4,
                    },
                    {
                        type: 'arduino_ext_tone_list',
                    },
                    {
                        type: 'arduino_ext_octave_list',
                    },
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'g_bot_set_tone',
            },
            isNotFor: ['GBot'],
            syntax: undefined,
        },
        g_bot_set_servo: {
            template: Lang.template.arduino_ext_set_servo,
            parent: 'arduino_ext_set_servo',
            def: {
                params: [
                    {
                        type: 'arduino_get_port_number',
                    },
                    null,
                ],
                type: 'g_bot_set_servo',
            },
            isNotFor: ['GBot'],
            syntax: undefined,
        },
        // GBot
        g_bot_set_led_init: {
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
                        params: ['10'],
                    },
                    {
                        type: 'arduino_get_port_number',
                        params: ['11'],
                    },
                    {
                        type: 'arduino_get_port_number',
                        params: ['12'],
                    },
                    null,
                ],
                type: 'g_bot_set_led_init',
            },
            paramsKeyMap: {
                PORT1: 0,
                PORT2: 1,
                PORT3: 2,
            },
            class: 'GBotLED',
            isNotFor: ['GBot'],
            func(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var port1 = script.getNumberValue('PORT1', script)
                var port2 = script.getNumberValue('PORT2', script);
                var port3 = script.getNumberValue('PORT3', script);

                if (!script.isStart) 
                {
					if (!sq.SET) {
						sq.SET = {};
					}
					
					var duration = Entry.GBot.duration.TIME_200ms;
                    script.isStart = true;
                    script.timeFlag = 1;
					
					sq.SET['14'] = {
							type: Entry.GBot.sensorTypes.LED_INIT,
							data: {
                                port1: port1,
                                port2: port2,
                                port3: port3,
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
        g_bot_get_brightness: {
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
                BRIGHT: 0,
            },
            func(sprite, script) {
                return script.getStringField('BRIGHT');
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
                                value: '3',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'g_bot_get_brightness',
                    },
                ],
            },
        },
        g_bot_get_led_row: {
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
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'g_bot_get_led_row',
                    },
                ],
            },
        },
        g_bot_get_led_col: {
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
                COL: 0,
            },
            func(sprite, script) {
                return script.getStringField('COL');
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
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'g_bot_get_led_col',
                    },
                ],
            },
        },
        g_bot_set_brightness: {
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'g_bot_get_brightness',
                        params: ['3'],
                    },
                    null,
                ],
                type: 'g_bot_set_brightness',
            },
            paramsKeyMap: {
                LEVEL: 0,
            },
            class: 'GBotLED',
            isNotFor: ['GBot'],
            func(sprite, script) {
                var level = script.getNumberValue('LEVEL', script);

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET['15'] = {
                    type: Entry.GBot.sensorTypes.LED_BRIGHT,
                    data: level,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        
                    },
                ],
            },
        },
        g_bot_get_row_col: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [[Lang.Blocks.table_row, 'row'], [Lang.Blocks.table_col, 'column']],
                    value: 'row',
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
                                    [Lang.Blocks.table_row, 'row'],
                                    [Lang.Blocks.table_row, 'column'],
                                ],
                                value: 'row',
                                fontSize: 11,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValueUpperCase,
                                codeMap: 'Entry.CodeMap.Arduino.g_bot_get_row_col[0]',
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            },
                        ],
                        keyOption: 'g_bot_get_row_col',
                    },
                ],
            },
        },
        g_bot_led_onoff: {
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
                    type: 'Dropdown',
                    options: [[Lang.Blocks.ARDUINO_on, 'on'], [Lang.Blocks.ARDUINO_off, 'off']],
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
                        type: 'g_bot_get_led_row',
                        params: [0],
                    },
                    {
                        type: 'g_bot_get_led_col',
                        params: [0],
                    },
                    null,
                    null,
                ],
                type: 'g_bot_led_onoff',
            },
            paramsKeyMap: {
                ROW: 0,
                COL: 1,
                OPERATOR: 2,
            },
            class: 'GBotLED',
            isNotFor: ['GBot'],
            func(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var row = script.getNumberValue('ROW');
                var col = script.getNumberValue('COL');
                var operator = script.getField('OPERATOR');
                let onoff = operator == 'on' ? 255 : 0;

                if (!script.isStart) 
                {					
					if (!sq.SET) {
						sq.SET = {};
					}
					
					var duration = Entry.GBot.duration.TIME_100ms;
                    script.isStart = true;
                    script.timeFlag = 1;
					
					sq.SET['16'] = {
							type: Entry.GBot.sensorTypes.LED_ONOFF,
							data: {
                                row: row,
								col: col,
								onoff: onoff,
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
        g_bot_led_output: {
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
                    options: [[Lang.Blocks.table_row, 'row'], [Lang.Blocks.table_col, 'column']],
                    value: 'row',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                        type: 'g_bot_get_led_row',
                        params: [0],
                    },
                    null,
                    {
                        type: 'text',
                        params: ['11111111'],
                    },
                    null,
                ],
                type: 'g_bot_led_output',
            },
            paramsKeyMap: {
                ROW: 0,
                OPERATOR: 1,
                STRING: 2,
            },
            class: 'GBotLED',
            isNotFor: ['GBot'],
            func(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var row = script.getNumberValue('ROW', script);
                var operator = script.getField('OPERATOR', script);
                var string = script.getValue('STRING', script);
                var text = [];

                if (!script.isStart) 
                {
					if (typeof string === 'string') 
                    {
                        for (var i = 0; i < string.length; i++) {
                            text[i] = Entry.GBot.toByte(string[i]);
                        }
                    }
                    else if (typeof string === 'number') 
                    {
                        var num_to_string = string.toString();
                        for (var i = 0; i < num_to_string.length; i++) {
                            text[i] = Entry.GBot.toByte(num_to_string[i]);
                        }
                    } 
                    else 
                    {
                        text[0] = string;
                    }

                    if (operator === 'row')
                    {
                        operator = 0;
                    }
                    else if (operator === 'column')
                    {
                        operator = 1;
                    }
					
					if (!sq.SET) {
						sq.SET = {};
					}
					
					var duration = Entry.GBot.duration.TIME_500ms;
                    script.isStart = true;
                    script.timeFlag = 1;
					
					sq.SET['17'] = {
							type: Entry.GBot.sensorTypes.LED_OUTPUT,
							data: {
                                row_col: row,
								sel: operator,
								text0: text[0],
								text1: text[1],
								text2: text[2],
								text3: text[3],
								text4: text[4],
								text5: text[5],
								text6: text[6],
								text7: text[7],
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
        g_bot_led_off_all: {
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
						params: ['18'],
					},
					{
						type: 'number',
						params: ['1'],
					},
					null,
                ],
                type: 'g_bot_led_off_all',
            },
            paramsKeyMap: {
                PORT: 0,
				PORT1: 1,
            },
            class: 'GBotLED',
            isNotFor: ['GBot'],
            func(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var port = script.getNumberValue('PORT', script);
				var port1 = script.getNumberValue('PORT1', script);

				if (!script.isStart) 
                {
					if (!sq.SET) {
						sq.SET = {};
					}
					
					var duration = Entry.GBot.duration.TIME_200ms;
                    script.isStart = true;
                    script.timeFlag = 1;
					
					sq.SET[port] = {
							type: Entry.GBot.sensorTypes.LED_OFF,
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
        //endregion GBot
    };
};

module.exports = Entry.GBot;
