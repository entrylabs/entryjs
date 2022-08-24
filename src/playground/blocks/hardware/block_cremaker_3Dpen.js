'use strict';

Entry.cremaker_3Dpen = {
    id       : 'EF.1',
    name     : 'cremaker_3Dpen',
    url      : 'http://www.cremaker.com/',
    imageName: 'Testino.png',
    title    : {
        en: 'cremaker_3Dpen',
        ko: '크리메이커 3D 펜',
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
        MOTOR_ENABLE: 5,
        MOTOR_DIR: 6,
        SCREEN: 8,
        HEATER: 9,
        MOTOR_SPEED: 10,
        LED: 13,
    },
    temptype: {        
        VALUE_TEMPTABLE: 0,
        CELSIUS_TEMPTABLE: 1,
    },
    temperTable: {
        '1': [1023, 0],
        '2': [1008,10],
        '3': [994,20],
        '4': [990,30],
        '5': [985,40],
        '6': [983,50],
        '7': [981,60],
        '8': [978,70],
        '9': [975,80],
        '10': [965,90],
        '11': [959,100],
        '12': [952,110],
        '13': [948,120],
        '14': [941,130],
        '15': [932,140],
        '16': [920,150],
        '17': [908,160],
        '18': [890,170],
        '19': [875,180],
        '20': [845,190],
        '21': [820,200],
        '22': [790,210],
        '23': [765,220],
    },
    BlockState: {},
};

Entry.cremaker_3Dpen.setLanguage = function() {
    return {
        ko: {
            Blocks: {
                cremaker3Dpen_btn_A: 'A',
                cremaker3Dpen_btn_B: 'B',
                cremaker3Dpen_btn_C: 'C',
                cremaker3Dpen_btn_D: 'D',
                cremaker3Dpen_temp_sensor:  '온도센서',
                cremaker3Dpen_motor_ccw_dir: '반시계',
                cremaker3Dpen_motor_cw_dir: '시계',
                cremaker3Dpen_motor_enable_on: '활성화',
                cremaker3Dpen_motor_enable_off: '비활성화',
                cremaker3Dpen_motor_heater_on: '시작',
                cremaker3Dpen_motor_heater_off: '종료',
                cremaker3Dpen_screen_text_ok: 'ok',
                cremaker3Dpen_screen_text_heating: 'heating',
                cremaker3Dpen_screen_text_cooling: 'cooling',
                cremaker3Dpen_led_on: '켜기',
                cremaker3Dpen_led_off: '끄기',
            },
            template: {
                cremaker3Dpen_get_analog_value: '%1 신호 값',
                cremaker3Dpen_get_button_state: '%1 버튼이 눌렸는가?',
                cremaker3Dpen_set_motor_enable: '모터 %1',
                cremaker3Dpen_set_motor_direction: '모터를 %1 방향으로 설정',
                cremaker3Dpen_set_motor_speed: '모터 속도를 %1 으로 설정',
                cremaker3Dpen_set_heater: '노즐 예열 %1',
                cremaker3Dpen_calculate_temperature: '%1 온도 계산',    
                cremaker3Dpen_show_text_to_screen: '%1 를 화면에 표시',
                cremaker3Dpen_set_led_toggle: 'LED를 %1',
            },
        },
        en: {
            Blocks: {
                cremaker3Dpen_btn_A: 'A',
                cremaker3Dpen_btn_B: 'B',
                cremaker3Dpen_btn_C: 'C',
                cremaker3Dpen_btn_D: 'D',
                cremaker3Dpen_temp_sensor:  'Temp Sensor',
                cremaker3Dpen_motor_ccw_dir: 'countclockwise',
                cremaker3Dpen_motor_cw_dir: 'clockwise',
                cremaker3Dpen_motor_enable_on: 'on',
                cremaker3Dpen_motor_enable_off: 'off',                
                cremaker3Dpen_motor_heater_on: 'turn on',
                cremaker3Dpen_motor_heater_off: 'turn off',            
                cremaker3Dpen_screen_text_ok: 'ok',
                cremaker3Dpen_screen_text_heating: 'heating',
                cremaker3Dpen_screen_text_cooling: 'cooling',
                cremaker3Dpen_led_on: 'turn on',
                cremaker3Dpen_led_off: 'turn off',
            },
            template: {
                cremaker3Dpen_get_analog_value: '1% sensor value',
                cremaker3Dpen_get_button_state: 'is pressed %1 button?',
                cremaker3Dpen_set_motor_enable: 'motor %1',
                cremaker3Dpen_set_motor_direction: 'set the direction of rotation of the motor to %1',
                cremaker3Dpen_set_motor_speed: 'set motor speed to %1',
                cremaker3Dpen_set_heater: '%1 nozzle heater',     
                cremaker3Dpen_calculate_temperature: 'calculate temperature of %1',    
                cremaker3Dpen_show_text_to_screen: 'show %1 to screen',
                cremaker3Dpen_set_led_toggle: '%1 LED',
            },
        },
    };
};

Entry.cremaker_3Dpen.blockMenuBlocks = [
    'cremaker3Dpen_get_analog_value',
    'cremaker3Dpen_calculate_temperature',
    'cremaker3Dpen_get_button_state',
    'cremaker3Dpen_set_motor_enable',
    'cremaker3Dpen_set_motor_direction',
    'cremaker3Dpen_set_motor_speed',
    'cremaker3Dpen_set_heater',
    'cremaker3Dpen_set_led_toggle',
    'cremaker3Dpen_show_text_to_screen',
];

Entry.cremaker_3Dpen.getBlocks = function() {
    return {
        cremaker3Dpen_analog_list: {
            parent: 'arduino_ext_analog_list',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.cremaker3Dpen_temp_sensor, '0'],
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
        cremaker3Dpen_get_analog_value: {
            parent: 'arduino_ext_get_analog_value',
            template: Lang.template.cremaker3Dpen_get_analog_value,
            def: {
                params: [
                     {
                         type: 'cremaker3Dpen_analog_list',
                     },
                ],
                type: 'cremaker3Dpen_get_analog_value',
            },
            class: 'cremaker_3Dpen_value_set',
            isNotFor: ['cremaker_3Dpen'],
            syntax: undefined,
        },
        cremaker3Dpen_calculate_temperature: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
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
                params: [null],
                type: 'cremaker3Dpen_calculate_temperature',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'cremaker_3Dpen_value_set',
            func(sprite, script) {
                let value = script.getNumberValue('VALUE');
                let ratioTemp =0;
                let cmt = Entry.cremaker_3Dpen.temptype;
                let cmtt = Entry.cremaker_3Dpen.temperTable;
                let value_temp = cmt.VALUE_TEMPTABLE;
                let celsius_temp = cmt.CELSIUS_TEMPTABLE;
                for(var i = 1; i < 23; i++)
                {                    
                    if(value > cmtt[i][value_temp])
                    {
                        ratioTemp = (value - cmtt[i][value_temp])/(cmtt[i-1][value_temp] - cmtt[i][value_temp])

                        return cmtt[i][celsius_temp] - ratioTemp*(cmtt[i][celsius_temp] - cmtt[i-1][celsius_temp]);
                    }
                }
                return 0;
            },
            isNotFor: ['cremaker_3Dpen'],
            syntax: undefined,
        },
        cremaker3Dpen_get_button_state: {
            color     : EntryStatic.colorSet.block.default.HARDWARE,
            outerLine : EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton  : 'basic_boolean_field',
            statements: [],
            params    : [
                {
                    type   : 'Dropdown',
                    options: [
                        [Lang.Blocks.cremaker3Dpen_btn_A,  '8'],
                        [Lang.Blocks.cremaker3Dpen_btn_B,  '7'],
                        [Lang.Blocks.cremaker3Dpen_btn_C,  '11'],
                        [Lang.Blocks.cremaker3Dpen_btn_D,  '12'],
                    ],
                    value     : '8',
                    fontSize  : 11,
                    bgColor   : EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            events: {},
            def   : {
                params: [null, null],
                type  : 'cremaker3Dpen_get_button_state',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'cremaker_3Dpen_set',
            func(sprite, script) {
                const port = script.getNumberValue('PORT', script);
                const DIGITAL = Entry.hw.portData.DIGITAL;
                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                Entry.hw.sendQueue.GET[Entry.cremaker_3Dpen.sensorTypes.DIGITAL] = {
                    port,
                    time: new Date().getTime(),
                };
                return DIGITAL[port] == 0 ? 1 : 0;
            },
            isNotFor: ['cremaker_3Dpen'],
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'cremaker_3Dpen.digitalRead(%1)',
                        blockType: 'param',
                        //replaceBlockType: 'arduino_ext_get_digital',
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
        cremaker3Dpen_set_motor_enable: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.cremaker3Dpen_motor_enable_on, 'on'],
                        [Lang.Blocks.cremaker3Dpen_motor_enable_off, 'off'],
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
                type: 'cremaker3Dpen_set_motor_enable',
            },
            paramsKeyMap: {
                OPERATOR: 0,
            },
            class: 'cremaker_3Dpen_set',
            func(sprite, script) {                
                const operator = script.getField('OPERATOR');
                let value = 0;
                if(operator == 'on')
                {
                    value = 255;
                }
                else
                {
                    value =  0;
                }
                const port = Entry.cremaker_3Dpen.sensorTypes.MOTOR_ENABLE;

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }

                Entry.hw.sendQueue.SET[port] = {
                    type: Entry.cremaker_3Dpen.sensorTypes.DIGITAL,
                    data: value,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            isNotFor: ['cremaker_3Dpen'],
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'cremaker_3Dpen.set_motor_enable(%1)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.cremaker3Dpen_motor_enable_on, 'on'],
                                    [Lang.Blocks.cremaker3Dpen_motor_enable_off, 'off'],
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
        cremaker3Dpen_set_motor_direction: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.cremaker3Dpen_motor_ccw_dir, 'on'],
                        [Lang.Blocks.cremaker3Dpen_motor_cw_dir, 'off'],
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
                type: 'cremaker3Dpen_set_motor_direction',
            },
            paramsKeyMap: {
                OPERATOR: 1,
            },
            class: 'cremaker_3Dpen_set',
            func(sprite, script) {                
                const operator = script.getField('OPERATOR');
                let value = 0;
                if(operator == 'on')
                {
                    value = 255;
                }
                else
                {
                    value =  0;
                }
                const port = Entry.cremaker_3Dpen.sensorTypes.MOTOR_DIR;

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }

                Entry.hw.sendQueue.SET[port] = {
                    type: Entry.cremaker_3Dpen.sensorTypes.DIGITAL,
                    data: value,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            isNotFor: ['cremaker_3Dpen'],
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'cremaker_3Dpen.set_motor_dir(%1)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.cremaker3Dpen_motor_ccw_dir, 'on'],
                                    [Lang.Blocks.cremaker3Dpen_motor_cw_dir, 'off'],
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
        cremaker3Dpen_set_motor_speed: {
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
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['255'],
                    },
                    null,
                ],
                type: 'cremaker3Dpen_set_motor_speed',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'cremaker_3Dpen_set',
            func(sprite, script) {
                const port = Entry.cremaker_3Dpen.sensorTypes.MOTOR_SPEED;
                let value = script.getNumberValue('VALUE');
                console.log(value);
                value = Math.round(value);
                value = Math.max(value, 0);
                value = Math.min(value, 255);
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[port] = {
                    type: Entry.cremaker_3Dpen.sensorTypes.PWM,
                    data: value,
                    time: new Date().getTime(),
                };
                console.log(value);
                return script.callReturn();
            },
            isNotFor: ['cremaker_3Dpen'],
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'cremaker_3Dpen.set_motor_speed(%1)',
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
        cremaker3Dpen_set_heater: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.cremaker3Dpen_motor_heater_on, 'on'],
                        [Lang.Blocks.cremaker3Dpen_motor_heater_off, 'off'],
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
                type: 'cremaker3Dpen_set_heater',
            },
            paramsKeyMap: {
                OPERATOR: 0,
            },
            class: 'cremaker_3Dpen_set',
            func(sprite, script) {                
                const operator = script.getField('OPERATOR');
                let value = 0;
                if(operator == 'on')
                {
                    value = 255;
                }
                else
                {
                    value =  0;
                }
                const port = Entry.cremaker_3Dpen.sensorTypes.HEATER;

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }

                Entry.hw.sendQueue.SET[port] = {
                    type: Entry.cremaker_3Dpen.sensorTypes.PWM,
                    data: value,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            isNotFor: ['cremaker_3Dpen'],
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'cremaker_3Dpen.set_heater(%1)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.cremaker3Dpen_motor_heater_on, 'on'],
                                    [Lang.Blocks.cremaker3Dpen_motor_heater_off, 'off'],
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
        cremaker3Dpen_set_led_toggle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.cremaker3Dpen_led_on, 'on'],
                        [Lang.Blocks.cremaker3Dpen_led_off, 'off'],
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
                type: 'cremaker3Dpen_set_led_toggle',
            },
            paramsKeyMap: {
                OPERATOR: 0,
            },
            class: 'cremaker_3Dpen_set',
            func(sprite, script) {                
                const operator = script.getField('OPERATOR');
                let value = 0;
                if(operator == 'on')
                {
                    value = 255;
                }
                else
                {
                    value =  0;
                }
                const port = Entry.cremaker_3Dpen.sensorTypes.LED;

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }

                Entry.hw.sendQueue.SET[port] = {
                    type: Entry.cremaker_3Dpen.sensorTypes.DIGITAL,
                    data: value,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            isNotFor: ['cremaker_3Dpen'],
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'cremaker_3Dpen.set_led(%1)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.cremaker3Dpen_led_on, 'on'],
                                    [Lang.Blocks.cremaker3Dpen_led_off, 'off'],
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
        cremaker3Dpen_show_text_to_screen: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.cremaker3Dpen_screen_text_ok, '0'],
                        [Lang.Blocks.cremaker3Dpen_screen_text_heating, '1'],
                        [Lang.Blocks.cremaker3Dpen_screen_text_cooling, '2'],
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
                type: 'cremaker3Dpen_show_text_to_screen',
            },
            paramsKeyMap: {
                TEXT: 0,
            },
            class: 'cremaker_3Dpen_screen_set',
            func(sprite, script) {                
                const value = script.getField('TEXT');
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[0] = {
                    type: Entry.cremaker_3Dpen.sensorTypes.SCREEN,
                    data: value,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            isNotFor: ['cremaker_3Dpen'],
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'cremaker_3Dpen.set_text_screen(%1)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.cremaker3Dpen_screen_text_ok, '1'],
                                    [Lang.Blocks.cremaker3Dpen_screen_text_heating, '2'],
                                    [Lang.Blocks.cremaker3Dpen_screen_text_cooling, '3'],
                                ],
                                value: '1',
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
    };
};

module.exports = Entry.cremaker_3Dpen;

