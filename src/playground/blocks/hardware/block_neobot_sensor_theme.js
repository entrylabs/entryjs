Entry.NeobotSensorTheme = {
    id: '5.2',
    name: 'neobot_sensor_theme',
    url: 'http://www.neobot.co.kr',
    imageName: 'neobot_sensor_theme.png',
    title: {
        "en": "NEOCODING SensorTheme",
        "ko": "네오코딩 센서테마"
    },
    LOCAL_MAP: [
        'IN1',
        'IN2',
        'IN3',
        'IR',
        'BAT'
    ],
    REMOTE_MAP: [
        'OUT1',
        'OUT2',
        'OUT3',
        'DCR',
        'DCL',
        'SND',
        'FND',
        'OPT'
    ],
    setZero: function () {
        for(var port in Entry.NeobotSensorTheme.REMOTE_MAP) {
            Entry.hw.sendQueue[Entry.NeobotSensorTheme.REMOTE_MAP[port]] = 0;
        }
        Entry.hw.update();
    },
    monitorTemplate: {
        imgPath: 'hw/neobot_sensor_theme.png',
        width: 800,
        height: 800,
        listPorts: {
        },
        ports: {
            'IN1':{name: 'PORT1', type: 'input', pos: {x: 145, y: 429}},
            'IN2':{name: 'PORT2', type: 'input', pos: {x : 314, y: 429}},
            'IN3':{name: 'PORT3', type: 'input', pos: {x: 484, y: 429}},
            'BAT':{name: 'PORT4', type: 'input', pos: {x: 653, y: 429}}
        },
        mode: 'both'
    }
};

 Entry.NeobotSensorTheme.setLanguage = function() {
    return {
        ko: {
            template: {
                neobot_st_sensor_value: '%1 값', 
                neobot_st_sensor_connect_external: '%1 에 연결한 %2 값', 
                neobot_st_sensor_convert_scale: '%1 센서값 %2 ~ %3 를 %4 ~ %5 (으)로 바꾼 값',

                neobot_st_compare_symbol: '%1',
                neobot_st_decision_sensor_is_over: '%1 의 센서값이 %2 %3',
                neobot_st_decision_equal_with_sensor: '%1 에 연결한 컬러센서가 %2 을 감지함',

                neobot_st_output_led_on: '%1 에 연결한 LED 켜기 %2', 
                neobot_st_output_led_off: '%1 에 연결한 LED 끄기 %2',
                neobot_st_set_output: '%1 에 %2 값만큼 출력 %3',
            },
            Blocks: {
                //for dropdown
                neobot_st_port_1 : "1번 포트",
                neobot_st_port_2 : "2번 포트",
                neobot_st_port_3 : "3번 포트",
                neobot_st_port_4 : "4번 포트",
                neobot_st_color_white : "흰색",
                neobot_st_color_red : "빨간색",
                neobot_st_color_yellow : "노란색",
                neobot_st_color_green : "초록색(연두색)",
                neobot_st_color_blue : "파란색",
                neobot_st_sensor_infrared : '적외선센서',
                neobot_st_sensor_light : '빛센서',
                neobot_st_sensor_sound : '소리센서',
                neobot_st_compare_symbol1 : '＝',
                neobot_st_compare_symbol2 : '＞',
                neobot_st_compare_symbol3 : '＜',
                neobot_st_compare_symbol4 : '≥',
                neobot_st_compare_symbol5 : '≤',
            }
        },
        en: {
            template: {
                neobot_st_sensor_value: '%1 value',
                neobot_st_sensor_connect_external: 'the %2 value connected %1',
                neobot_st_sensor_convert_scale: "the value that is changed %1 sensor value %2 ~%3 to %4 ~ %5",
                
                neobot_st_compare_symbol: '%1',
                neobot_st_decision_sensor_is_over: "%1 sensor value %2 %3", 
                neobot_st_decision_equal_with_sensor: "being detected %2 by %1 color sensor",
                neobot_st_remote_button : 'pressing button %1 of remote controller',

                neobot_st_output_led_on: 'Turn on the LED connected %1 %2',
                neobot_st_output_led_off: 'Turn off the LED connected %1 %2',
                neobot_st_set_output: 'Output %1 port value to %2 %3',
            },
            Blocks: {
                //for dropdown
                neobot_st_port_1: 'port1',
                neobot_st_port_2: 'port2',
                neobot_st_port_3: 'port3',
                neobot_st_port_4: 'port4',
                neobot_st_color_white: 'white',
                neobot_st_color_red: 'red',
                neobot_st_color_yellow: 'yellow',
                neobot_st_color_green: 'green',
                neobot_st_color_blue: 'blue',
                neobot_st_sensor_infrared : 'IR sensor',
                neobot_st_sensor_light : 'light sensor',
                neobot_st_sensor_sound : 'sound sensor',
                neobot_st_compare_symbol1 : '＝',
                neobot_st_compare_symbol2 : '＞',
                neobot_st_compare_symbol3 : '＜',
                neobot_st_compare_symbol4 : '≥',
                neobot_st_compare_symbol5 : '≤',
            },
        }, //
    };
};

Entry.NeobotSensorTheme.blockMenuBlocks = [
    // class sensor
    'neobot_st_sensor_value',
    'neobot_st_sensor_connect_external',
    'neobot_st_sensor_convert_scale',
    // class decision
    'neobot_st_decision_sensor_is_over',
    'neobot_st_decision_equal_with_sensor',
    // class output
    'neobot_st_output_led_on',
    'neobot_st_output_led_off',
    'neobot_st_set_output',
];

Entry.NeobotSensorTheme.getBlocks = function() {
    return { // region neobot sensor theme

        // class sensor
        neobot_st_sensor_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_st_port_1, 'IN1'],
                        [Lang.Blocks.neobot_st_port_2, 'IN2'],
                        [Lang.Blocks.neobot_st_port_3, 'IN3'],
                        [Lang.Blocks.neobot_st_port_4, 'BAT'],
                    ],
                    value: 'IN1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'neobot_st_sensor_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'sensor',
            isNotFor: ['neobot_sensor_theme'],
            func: function(sprite, script) {
                var port = script.getStringField('PORT');
                return Entry.hw.portData[port];
            },
        },

        neobot_st_sensor_connect_external: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_st_port_1, 'IN1'],
                        [Lang.Blocks.neobot_st_port_2, 'IN2'],
                        [Lang.Blocks.neobot_st_port_3, 'IN3'],
                        [Lang.Blocks.neobot_st_port_4, 'BAT'],

                    ],
                    value: 'IN1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_st_sensor_infrared, '1'],
                        [Lang.Blocks.neobot_st_sensor_light, '2'],
                        [Lang.Blocks.neobot_st_sensor_sound, '3'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null, null],
                type: 'neobot_st_sensor_connect_external',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'sensor',
            isNotFor: ['neobot_sensor_theme'],
            func: function(sprite, script) {
                var port = script.getStringField('PORT');
                return Entry.hw.portData[port];
            },
        },

        neobot_st_sensor_convert_scale: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_st_port_1, 'IN1'],
                        [Lang.Blocks.neobot_st_port_2, 'IN2'],
                        [Lang.Blocks.neobot_st_port_3, 'IN3'],
                        [Lang.Blocks.neobot_st_port_4, 'BAT'],
                    ],
                    value: 'IN1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                    null,
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
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['100'],
                    },
                ],
                type: 'neobot_st_sensor_convert_scale',
            },
            paramsKeyMap: {
                PORT: 0,
                OMIN: 1,
                OMAX: 2,
                MIN: 3,
                MAX: 4,
            },
            class: 'sensor',
            isNotFor: ['neobot_sensor_theme'],
            func: function(sprite, script) {
                var port = script.getStringField('PORT');
                var value = Entry.hw.portData[port];
                var omin = script.getNumberValue('OMIN', script);
                var omax = script.getNumberValue('OMAX', script);
                var min = script.getNumberValue('MIN', script);
                var max = script.getNumberValue('MAX', script);

                if (omin > omax) {
                    var temp = omin;
                    omin = omax;
                    omax = temp;
                }

                if (min > max) {
                    var temp = min;
                    min = max;
                    max = temp;
                }

                value -= omin;
                value = value * ((max - min) / (omax - omin));
                value += min;
                value = Math.min(max, value);
                value = Math.max(min, value);

                return Math.round(value);
            },
        },

        // class decision
        // un-used. use if required pluggable block.
        neobot_st_compare_symbol :{
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_st_compare_symbol1, '='],
                        [Lang.Blocks.neobot_st_compare_symbol2, '>'],
                        [Lang.Blocks.neobot_st_compare_symbol3, '<'],
                        [Lang.Blocks.neobot_st_compare_symbol4, '>='],
                        [Lang.Blocks.neobot_st_compare_symbol5, '<='],
                    ],
                    value: '>',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'neobot_st_compare_symbol',
            },
            paramsKeyMap: {
                SYMBOL: 0,
            },
            class: 'decision',
            isNotFor: ['neobot_sensor_theme'],
            func: function(sprite, script) {
                return  script.getStringField('SYMBOL');
            },
        },

        neobot_st_decision_sensor_is_over: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_st_port_1, 'IN1'],
                        [Lang.Blocks.neobot_st_port_2, 'IN2'],
                        [Lang.Blocks.neobot_st_port_3, 'IN3'],
                        [Lang.Blocks.neobot_st_port_4, 'BAT'],
                    ],
                    value: 'IN1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_st_compare_symbol1, '='],
                        [Lang.Blocks.neobot_st_compare_symbol2, '>'],
                        [Lang.Blocks.neobot_st_compare_symbol3, '<'],
                        [Lang.Blocks.neobot_st_compare_symbol4, '>='],
                        [Lang.Blocks.neobot_st_compare_symbol5, '<='],
                    ],
                    value: '>',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            events: {},
            def: {
                params: [null, null, 10],
                type: 'neobot_st_decision_sensor_is_over',
            },
            paramsKeyMap: {
                SENSOR: 0,
                SYMBOL: 1,
                VALUE: 2,
            },
            class: 'decision',
            isNotFor: ['neobot_sensor_theme'],
            func: function(sprite, script) {
                var sensorTemp = script.getStringField('SENSOR');
                var sensor = Entry.hw.portData[sensorTemp];
                var symbol = script.getStringField('SYMBOL');
                var value = Entry.parseNumber(script.getStringValue('VALUE'));

                if (symbol == '=') {
                    if(sensor == value) return true;
                    else return false;
                } else if (symbol == '>') {
                    if(sensor > value) return true;
                    else return false;
                } else if (symbol == '<') {
                    if(sensor < value) return true;
                    else return false;
                } else if (symbol == '>=') {
                    if(sensor >= value) return true;
                    else return false;
                } else if (symbol == '<=') {
                    if(sensor <= value) return true;
                    else return false;
                }
                return false;
            },
        },

        neobot_st_decision_equal_with_sensor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_st_port_1, 'IN1'],
                        [Lang.Blocks.neobot_st_port_2, 'IN2'],
                        [Lang.Blocks.neobot_st_port_3, 'IN3'],
                        [Lang.Blocks.neobot_st_port_4, 'BAT'],
                    ],
                    value: 'IN1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.neobot_st_color_white, 0],
                        [Lang.Blocks.neobot_st_color_red, 1],
                        [Lang.Blocks.neobot_st_color_yellow, 2],
                        [Lang.Blocks.neobot_st_color_green, 3],
                        [Lang.Blocks.neobot_st_color_blue, 4],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null, null],
                type: 'neobot_st_decision_equal_with_sensor',
            },
            paramsKeyMap: {
                SENSOR: 0,
                COLOR: 1,
            },
            class: 'decision',
            isNotFor: ['neobot_sensor_theme'],
            func: function(sprite, script) {
                var sensorTemp = script.getStringField('SENSOR');
                var sensor = Entry.hw.portData[sensorTemp];
                var color = script.getNumberField('COLOR');

                if (sensor >= 10 && sensor <= 50) {
                    if (color == 0) return true;
                    else return false;
                } else if (sensor >= 51 && sensor <= 90) {
                    if (color == 1) return true;
                    else return false;
                } else if (sensor >= 91 && sensor <= 130) {
                    if (color == 2) return true;
                    else return false;
                } else if (sensor >= 131 && sensor <= 170) {
                    if (color == 3) return true;
                    else return false;
                } else if (sensor >= 171 && sensor <= 210) {
                    if (color == 4) return true;
                    else return false;
                }
                return false;
            },
        },

        // class output
        neobot_st_output_led_on : {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1번 포트', 'OUT1'],
                        ['2번 포트', 'OUT2'],
                        ['3번 포트', 'OUT3'],
                        ['4번 포트', 'FND'],
                    ],
                    value: 'OUT1',
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
                params: [null, null],
                type: 'neobot_st_output_led_on',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'output',
            isNotFor: ['neobot_sensor_theme'],
            func: function(sprite, script) {
                var port = script.getStringField('PORT', script);
                var option = port;
                if (option === 3) {
                    option = 4;
                }
                Entry.hw.sendQueue[port] = 255;
                Entry.hw.sendQueue['OPT'] = Entry.hw.sendQueue['OPT'] & ~option;
                return script.callReturn();
            },
        },
        neobot_st_output_led_off : {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1번 포트', 'OUT1'],
                        ['2번 포트', 'OUT2'],
                        ['3번 포트', 'OUT3'],
                        ['4번 포트', 'FND'],
                    ],
                    value: 'OUT1',
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
                params: [null, null],
                type: 'neobot_st_output_led_off',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'output',
            isNotFor: ['neobot_sensor_theme'],
            func: function(sprite, script) {
                var port = script.getStringField('PORT', script);
                var option = port;
                if (option === 3) {
                    option = 4;
                }
                Entry.hw.sendQueue[port] = 0;
                Entry.hw.sendQueue['OPT'] = Entry.hw.sendQueue['OPT'] & ~option;
                return script.callReturn();
            },
        },
        neobot_st_set_output: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1번 포트', 'OUT1'],
                        ['2번 포트', 'OUT2'],
                        ['3번 포트', 'OUT3'],
                        ['4번 포트', 'FND'],
                    ],
                    value: 'OUT1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                    null,
                    {
                        type: 'number',
                        params: ['255'],
                    },
                    null,
                ],
                type: 'neobot_st_set_output',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'output',
            isNotFor: ['neobot_sensor_theme'],
            func: function(sprite, script) {
                var port = script.getStringField('PORT', script);
                var value = script.getNumberValue('VALUE', script);
                var option = port;
                if (value < 0) {
                    value = 0;
                } else if (value > 255) {
                    value = 255;
                }
                var option = port;
                if (option === 3) {
                    option = 4;
                }
                Entry.hw.sendQueue[port] = value;
                Entry.hw.sendQueue['OPT'] = Entry.hw.sendQueue['OPT'] & ~option;
                return script.callReturn();
            },
        },
    }; // end region neobot sensor theme
}; 
module.exports = Entry.NeobotSensorTheme;