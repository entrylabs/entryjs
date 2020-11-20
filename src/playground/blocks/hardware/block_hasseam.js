'use strict';

Entry.Hasseam = {
    id: '1.11',
    name: 'hasseam',
    url: 'http://www.hanibot.com',
    imageName: 'hasseam.png',
    title: {
        ko: '하쌤 보드',
        en: 'Hasseam Board',
    },
    setZero: function() {
        if (!Entry.hw.sendQueue.SET) {
            Entry.hw.sendQueue = {
                SET: {},
            };
        } else {
            var keySet = Object.keys(Entry.hw.sendQueue.SET);
            keySet.forEach(function(key) {
                if(Entry.hw.sendQueue.SET[key].type==Entry.Hasseam.sensorTypes.DCMOTOR){
                    Entry.hw.sendQueue.SET[key].data.value1=0;
                    Entry.hw.sendQueue.SET[key].time = new Date().getTime();
                }else{
                    Entry.hw.sendQueue.SET[key].data = 0;
                    Entry.hw.sendQueue.SET[key].time = new Date().getTime();
                }
            });
        }
        Entry.hw.sendQueue.GET={};
        Entry.hw.update();
    },
    sensorTypes: {
        ALIVE: 0,
        DIGITAL: 1,
        ANALOG: 2,
        PWM: 3,
        SERVO: 4,
        TONE: 5,
        PULSEIN: 6,
        ULTRASONIC: 7,
        TIMER: 8,
        READ_BLUETOOTH: 9,
        WRITE_BLUETOOTH: 10,
        LCD: 11,
        RGBLED: 12,
        DCMOTOR: 13,
        OLED: 14,
        PIR : 15,
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
Entry.Hasseam.setLanguage = function() {
    return {
        ko: {
            template: {
                hasseam_pulldown:'기본',
                hasseam_pullup:'풀업',
                hasseam_toggle_on: '켜기',
                hasseam_toggle_off: '끄기',
                hasseam_lcd_first_line: '첫 번째',
                hasseam_lcd_seconds_line: '두 번째',
                hasseam_dcmotor_direction_forward: '정방향',
                hasseam_dcmotor_direction_reverse: '역방향',
                hasseam_btData_select_number: '숫자',
                hasseam_btData_select_character: '문자',
                hasseam_get_analog_value: '아날로그 %1 번 핀 센서 %2 값',
                hasseam_get_analog_mapping:
                    '아날로그 %1 번 핀 센서 %2 값의 범위를 %3 ~ %4 에서 %5 ~ %6 로 바꾼 값',
                hasseam_get_digital_bluetooth: '블루투스 RX 2 핀 데이터 값',
                hasseam_get_digital_ultrasonic: '초음파 Trig %1 핀 Echo %2 핀 센서 값',
                hasseam_get_digital: '디지털 %1 번 핀 센서 %2 값',
                hasseam_get_digital_toggle: '디지털 %1 번 핀 센서 %2 값',
                hasseam_get_digital_pir: 'PIR %1 번 핀 센서 값',
                hasseam_set_digital_toggle: '디지털 %1 번 핀 %2 %3',
                hasseam_set_digital_pwm: '디지털 %1 번 핀을 %2 (으)로 정하기 %3',
                hasseam_set_digital_rgbled:
                    '디지털 %1 번 핀의 RGB LED를 빨강 %2 초록 %3 파랑 %4 로 정하기 %5',
                hasseam_set_digital_servo: '디지털 %1 번 핀의 서보모터를 %2 의 각도로 정하기 %3',
                hasseam_set_digital_buzzer:
                    '디지털 %1 번 핀의 버저를 %2 %3 음으로 %4 초 연주하기 %5',
                hasseam_set_digital_dcmotor:
                    'DC모터 %1 번 핀을 %2 %3 번 핀의 속도를 %4 로 정하기 %5',
                hasseam_module_digital_lcd: 'LCD화면 %1 줄에 %2 나타내기 %3',
                hasseam_module_digital_bluetooth: '블루투스 TX 3 핀에 %1 데이터 보내기 %2',
                hasseam_module_digital_oled: 'OLED화면 X 좌표 %1  Y 좌표 %2 에 %3 나타내기 %4',
            },
        },
        en: {
            template: {
                hasseam_pulldown:'pulldown',
                hasseam_pullup:'pullup',
                hasseam_toggle_on: 'on',
                hasseam_toggle_off: 'off',
                hasseam_lcd_first_line: 'first',
                hasseam_lcd_seconds_line: 'seconds',
                hasseam_dcmotor_direction_forward: 'forward',
                hasseam_dcmotor_direction_reverse: 'reverse',
                hasseam_btData_select_number: 'number',
                hasseam_btData_select_character: 'character',
                hasseam_get_analog_value: 'Read analog %1 pin sensor value %2',
                hasseam_get_analog_mapping:
                    'Map analog %1 pin sensor value %2 from %3 ~ %4 to %5 ~ %6',
                hasseam_get_digital_bluetooth: 'Bluetooth RX 2 value',
                hasseam_get_digital_ultrasonic: 'Read ultrasonic Trig %1 Echo %2 sensor value',
                hasseam_get_digital: 'Digital %1 pin sensor value %2',
                hasseam_get_digital_toggle: 'Digital %1 pin sensor value %2',
                hasseam_set_digital_toggle: 'Digital %1 pin %2 %3',
                hasseam_set_digital_pwm: 'Digital pwm %1 Pin %2 %3',
                hasseam_set_digital_rgbled: 'Digital %1 pin RGB LED Red %2 Green %3 Blue %4 %5',
                hasseam_set_digital_servo: 'Set servo pin %1 angle as %2 %3',
                hasseam_set_digital_buzzer: 'Play tone pin %1 on note %2 octave %3 beat %4 %5',
                hasseam_set_digital_dcmotor: 'DC Motor %1 pin direction %2 %3 pin speed %4 %5',
                hasseam_module_digital_lcd: 'LCD %1 line %2 appear %3',
                hasseam_module_digital_bluetooth: 'Bluetooth TX 3 Pin %1 data send %2',
                hasseam_module_digital_oled: 'OLED X codinate %1 Y coodinate %2 appear %3 %4',
            },
        },
    };
};
Entry.Hasseam.blockMenuBlocks = [
    'hasseam_get_analog_value',
    'hasseam_get_analog_mapping',
    'hasseam_get_digital_bluetooth',
    'hasseam_get_digital_ultrasonic',
    'hasseam_get_digital',
    'hasseam_get_digital_toggle',
    'hasseam_get_digital_pir',
    'hasseam_set_digital_toggle',
    'hasseam_set_digital_pwm',
    'hasseam_set_digital_rgbled',
    'hasseam_set_digital_servo',
    'hasseam_set_digital_buzzer',
    'hasseam_set_digital_dcmotor',
    'hasseam_module_digital_lcd',
    'hasseam_module_digital_bluetooth',
    'hasseam_module_digital_oled',
];
Entry.Hasseam.getBlocks = function() {
    return {
        //region hasseam 한쌤보드
        hasseam_list_analog_basic: {
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
        },
        hasseam_list_pullup_setting: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.hasseam_pulldown, '0'],
                        [Lang.template.hasseam_pullup, '2'],
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
                OPERATOR: 0,
            },
            func: function(sprite, script) {
                return script.getStringField('OPERATOR');
            },
        },
        hasseam_list_digital_basic: {
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
                    ],
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
        },
        hasseam_list_digital_octave: {
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
                        ['7', '7'],
                        ['8', '8'],
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
                OCTAVE: 0,
            },
            func: function(sprite, script) {
                return script.getField('OCTAVE');
            },
        },
        hasseam_list_digital_pwm: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['~3', '3'],
                        ['~5', '5'],
                        ['~6', '6'],
                        ['~9', '9'],
                        ['~10', '10'],
                        ['~11', '11'],
                    ],
                    value: '11',
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
        },
        hasseam_list_digital_toggle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.hasseam_toggle_on, 'on'],
                        [Lang.template.hasseam_toggle_off, 'off'],
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
        },
        hasseam_list_digital_tone: {
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
        },
        hasseam_list_digital_lcd: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.hasseam_lcd_first_line, '0'],
                        [Lang.template.hasseam_lcd_seconds_line, '1'],
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
                LINE: 0,
            },
            func: function(sprite, script) {
                return script.getField('LINE');
            },
        },
        hasseam_list_digital_dcmotor_direction: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.hasseam_dcmotor_direction_reverse, '0'],
                        [Lang.template.hasseam_dcmotor_direction_forward, '1'],
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
                return script.getField('DIRECTION');
            },
        },
        hasseam_list_digital_btData_select: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.hasseam_btData_select_number, '0'],
                        [Lang.template.hasseam_btData_select_character, '1'],
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
                DIRECTION: 0,
            },
            func: function(sprite, script) {
                return script.getField('DIRECTION');
            },
        },
        hasseam_get_analog_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: Lang.template.hasseam_get_analog_value,
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
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'hasseam_list_analog_basic',
                    },
                    {
                        type: 'hasseam_list_pullup_setting',
                    },
                ],
                type: 'hasseam_get_analog_value',
            },
            paramsKeyMap: {
                PORT: 0,
                OPERATOR: 1,
            },
            class: 'hasseamGet',
            isNotFor: ['hasseam'],
            func: function(sprite, script) {
                var port = script.getValue('PORT', script);
                var opr = script.getNumberValue('OPERATOR');
                var ANALOG = Entry.hw.portData.ANALOG;

                if (port[0] === 'A') port = port.substring(1);

                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                Entry.hw.sendQueue['GET'][Entry.Hasseam.sensorTypes.ANALOG] = {
                    port: port,
                    data: opr,
                    time: new Date().getTime(),
                };

                return ANALOG ? ANALOG[port] || 0 : 0;
            },
            syntax: { js: [], py: ['hasseam.get_analog_value(%1 %2)'] },
        },
        hasseam_get_analog_mapping: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: Lang.template.hasseam_get_analog_mapping,
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
                        type: 'hasseam_list_analog_basic',
                    },
                    {
                        type: 'hasseam_list_pullup_setting',
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
                type: 'hasseam_get_analog_mapping',
            },
            paramsKeyMap: {
                PORT: 0,
                OPERATOR: 1,
                VALUE2: 2,
                VALUE3: 3,
                VALUE4: 4,
                VALUE5: 5,
            },
            class: 'hasseamGet',
            isNotFor: ['hasseam'],
            func: function(sprite, script) {
                var port = script.getValue('PORT', script);
                var opr = script.getNumberValue('OPERATOR');
                var result = 0;
                var ANALOG = Entry.hw.portData.ANALOG;
                var value2 = script.getNumberValue('VALUE2', script);
                var value3 = script.getNumberValue('VALUE3', script);
                var value4 = script.getNumberValue('VALUE4', script);
                var value5 = script.getNumberValue('VALUE5', script);

                if (port[0] === 'A') {
                    port = port.substring(1);
                }
                result = ANALOG ? ANALOG[port] || 0 : 0;
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

                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                if(Entry.hw.sendQueue.SET[port]){
                    return Entry.hw.sendQueue.SET[port].data;
                }else{
                    Entry.hw.sendQueue['GET'][Entry.Hasseam.sensorTypes.DIGITAL] = {
                        port: port,
                        data: opr,
                        time: new Date().getTime(),
                    };
                }

                return result;
            },
            syntax: {
                js: [],
                py: ['hasseam.get_analog_mapping(%1, %2, %3, %4, %5, %6)'],
            },
        },
        hasseam_get_digital_bluetooth: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: Lang.template.hasseam_get_digital_bluetooth,
            statements: [],
            params: [
            ],
            events: {},
            def: {
                params: [
                ],
                type: 'hasseam_get_digital_bluetooth',
            },
            paramsKeyMap: {
            },
            class: 'hasseamGet',
            isNotFor: ['hasseam'],
            func: function(sprite, script) {
                var port = 2;
                var getString = Entry.hw.portData.READ_BLUETOOTH;
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                delete Entry.hw.sendQueue['SET'][port];
                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                Entry.hw.sendQueue['GET'][Entry.Hasseam.sensorTypes.READ_BLUETOOTH] = {
                    port: port,
                    time: new Date().getTime(),
                };

                return getString ? getString.slice(0,getString.length-1) : ' ';
            },
            syntax: { js: [], py: ['hasseam.get_digital_bluetooth()'] },
        },
        hasseam_get_digital_ultrasonic: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: Lang.template.hasseam_get_digital_ultrasonic,
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
                        type: 'text',
                        params: ['4'],
                    },
                    {
                        type: 'text',
                        params: ['5'],
                    },
                ],
                type: 'hasseam_get_digital_ultrasonic',
            },
            paramsKeyMap: {
                PORT1: 0,
                PORT2: 1,
            },
            class: 'hasseamGet',
            isNotFor: ['hasseam'],
            func: function(sprite, script) {
                var port1 = script.getNumberValue('PORT1');
                var port2 = script.getNumberValue('PORT2');

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                delete Entry.hw.sendQueue['SET'][port1];
                delete Entry.hw.sendQueue['SET'][port2];
                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                Entry.hw.sendQueue['GET'][Entry.Hasseam.sensorTypes.ULTRASONIC] = {
                    port: [port1, port2],
                    time: new Date().getTime(),
                };

                return Entry.hw.portData.ULTRASONIC || 0;
            },
            syntax: {
                js: [],
                py: ['hasseam.get_digital_ultrasonic(%1, %2)'],
            },
        },
        hasseam_get_digital: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: Lang.template.hasseam_get_digital,
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
                        type: 'hasseam_list_digital_basic',
                    },
                    {
                        type: 'hasseam_list_pullup_setting',
                    },
                ],
                type: 'hasseam_get_digital',
            },
            paramsKeyMap: {
                PORT: 0,
                OPERATOR: 1,
            },
            class: 'hasseamGet',
            isNotFor: ['hasseam'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var opr = script.getNumberValue('OPERATOR');
                //"down = 0" or "up = 2"
                var DIGITAL = Entry.hw.portData.DIGITAL;

                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                if(Entry.hw.sendQueue.SET[port]){
                    return Entry.hw.sendQueue.SET[port].data;
                }else{
                    Entry.hw.sendQueue['GET'][Entry.Hasseam.sensorTypes.DIGITAL] = {
                        port: port,
                        data: opr,
                        time: new Date().getTime(),
                    };
                }
                return DIGITAL ? DIGITAL[port] || 0 : 0;
            },
            syntax: { js: [], py: ['hasseam.get_digital(%1,%2)'] },
        },
        hasseam_get_digital_toggle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            template: Lang.template.hasseam_get_digital_toggle,
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
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'hasseam_list_digital_basic',
                    },
                    {
                        type: 'hasseam_list_pullup_setting',
                    },
                ],
                type: 'hasseam_get_digital_toggle',
            },
            paramsKeyMap: {
                PORT: 0,
                OPERATOR: 1,
            },
            class: 'hasseamGet',
            isNotFor: ['hasseam'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var opr = script.getNumberValue('OPERATOR');
                var DIGITAL = Entry.hw.portData.DIGITAL;

                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                if(Entry.hw.sendQueue.SET[port]){
                    return Entry.hw.sendQueue.SET[port].data;
                }else{
                    Entry.hw.sendQueue['GET'][Entry.Hasseam.sensorTypes.DIGITAL] = {
                        port: port,
                        data: opr,
                        time: new Date().getTime(),
                    };
                }

                return DIGITAL ? DIGITAL[port] || 0 : 0;
            },
            syntax: { js: [], py: ['hasseam.get_digital_toggle(%1 %2)'] },
        },
        hasseam_get_digital_pir: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            template: Lang.template.hasseam_get_digital_pir,
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
                        type: 'hasseam_list_digital_basic',
                    },
                ],
                type: 'hasseam_get_digital_pir',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'hasseamGet',
            isNotFor: ['hasseam'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var DIGITAL = Entry.hw.portData.DIGITAL;

                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                Entry.hw.sendQueue['GET'][Entry.Hasseam.sensorTypes.PIR] = {
                    port: port,
                    time: new Date().getTime(),
                };

                return DIGITAL ? DIGITAL[port] || 0 : 0;
            },
            syntax: { js: [], py: ['hasseam.get_digital_pir(%1)'] },
        },
        hasseam_set_digital_toggle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.hasseam_set_digital_toggle,
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
                        type: 'hasseam_list_digital_basic',
                    },
                    {
                        type: 'hasseam_list_digital_toggle',
                    },
                    null,
                ],
                type: 'hasseam_set_digital_toggle',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'hasseamSet',
            isNotFor: ['hasseam'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var value = script.getValue('VALUE');

                if (typeof value === 'string') {
                    value = value.toLowerCase();
                }
                if (Entry.Hasseam.highList.indexOf(value) > -1) {
                    value = 255;
                } else if (Entry.Hasseam.lowList.indexOf(value) > -1) {
                    value = 0;
                } else {
                    throw new Error();
                }
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.Hasseam.sensorTypes.DIGITAL,
                    data: value,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: { js: [], py: ['hasseam.set_digital_toggle(%1, %2)'] },
        },
        hasseam_set_digital_pwm: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.hasseam_set_digital_pwm,
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
                        type: 'hasseam_list_digital_pwm',
                    },
                    {
                        type: 'text',
                        params: ['255'],
                    },
                    null,
                ],
                type: 'hasseam_set_digital_pwm',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'hasseamSet',
            isNotFor: ['hasseam'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var value = script.getNumberValue('VALUE');

                value = Math.round(value);
                value = Math.min(value, 255);
                value = Math.max(value, 0);
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.Hasseam.sensorTypes.PWM,
                    data: value,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: { js: [], py: ['hasseam.set_digital_pwm(%1, %2)'] },
        },
        hasseam_set_digital_rgbled: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.hasseam_set_digital_rgbled,
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
                        type: 'hasseam_list_digital_basic',
                    },
                    {
                        type: 'text',
                        params: ['255'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'hasseam_set_digital_rgbled',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE0: 1,
                VALUE1: 2,
                VALUE2: 3,
            },
            class: 'hasseamSet',
            isNotFor: ['hasseam'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var value = [3];
                value[0] = script.getNumberValue('VALUE0');
                value[1] = script.getNumberValue('VALUE1');
                value[2] = script.getNumberValue('VALUE2');

                for (var i = 0; i < 3; i++) {
                    value[i] = Math.round(value[i]);
                    value[i] = Math.min(value[i], 200);
                    value[i] = Math.max(value[i], 0);
                }
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.Hasseam.sensorTypes.RGBLED,
                    data: {
                        redValue: value[0],
                        greenValue: value[1],
                        blueValue: value[2],
                    },
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: { js: [], py: ['hasseam.set_digital_pwm(%1, %2)'] },
        },
        hasseam_set_digital_servo: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.hasseam_set_digital_servo,
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
                        type: 'hasseam_list_digital_basic',
                    },
                    {
                        type: 'text',
                        params: ['90'],
                    },
                    null,
                ],
                type: 'hasseam_set_digital_servo',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'hasseamSet',
            isNotFor: ['hasseam'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var value = script.getNumberValue('VALUE');
                value = Math.min(value, 180);
                value = Math.max(value, 0);

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.Hasseam.sensorTypes.SERVO,
                    data: value,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: { js: [], py: ['hasseam.set_digital_servo(%1, %2)'] },
        },
        hasseam_set_digital_buzzer: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.hasseam_set_digital_buzzer,
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
                        type: 'hasseam_list_digital_basic',
                    },
                    {
                        type: 'hasseam_list_digital_tone',
                    },
                    {
                        type: 'hasseam_list_digital_octave',
                    },
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'hasseam_set_digital_buzzer',
            },
            paramsKeyMap: {
                PORT: 0,
                NOTE: 1,
                OCTAVE: 2,
                DURATION: 3,
            },
            class: 'hasseamSet',
            isNotFor: ['hasseam'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var duration = script.getNumberValue('DURATION');
                var octave = script.getNumberValue('OCTAVE') - 1;
                var value = 0;

                if (!script.isStart) {
                    var note = script.getValue('NOTE');
                    if (!Entry.Utils.isNumber(note)) {
                        note = Entry.Hasseam.toneTable[note];
                    }
                    if (note < 0) {
                        note = 0;
                    } else if (note > 12) {
                        note = 12;
                    }
                    if (duration < 0) {
                        duration = 0;
                    }
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
                    if (duration === 0) {
                        Entry.hw.sendQueue['SET'][port] = {
                            type: Entry.Hasseam.sensorTypes.TONE,
                            data: 0,
                            time: new Date().getTime(),
                        };
                        return script.callReturn();
                    }
                    if (octave < 0) {
                        octave = 0;
                    } else if (octave > 8) {
                        octave = 8;
                    }
                    if (note != 0) {
                        value = Entry.Hasseam.toneMap[note][octave];
                    }

                    duration = duration * 1000;
                    script.isStart = true;
                    script.timeFlag = 1;

                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.Hasseam.sensorTypes.TONE,
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
                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.Hasseam.sensorTypes.TONE,
                        data: 0,
                        time: new Date().getTime(),
                    };
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: ['hasseam.set_digital_toggle(%1, %2, %3, %4)'],
            },
        },
        hasseam_set_digital_dcmotor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.hasseam_set_digital_dcmotor,
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
                        type: 'hasseam_list_digital_basic',
                    },
                    {
                        type: 'hasseam_list_digital_dcmotor_direction',
                    },
                    {
                        type: 'hasseam_list_digital_pwm',
                    },
                    {
                        type: 'text',
                        params: ['255'],
                    },
                    null,
                ],
                type: 'hasseam_set_digital_dcmotor',
            },
            paramsKeyMap: {
                PORT0: 0,
                VALUE0: 1,
                PORT1: 2,
                VALUE1: 3,
            },
            class: 'hasseamSet',
            isNotFor: ['hasseam'],
            func: function(sprite, script) {
                var port = 0; // port value is dummy;
                var directionPort = script.getNumberValue('PORT0');
                var speedPort = script.getNumberValue('PORT1');
                var directionValue = script.getNumberValue('VALUE0');
                var speedValue = script.getNumberValue('VALUE1');

                speedValue = Math.round(speedValue);
                speedValue = Math.min(speedValue, 255);
                speedValue = Math.max(speedValue, 0);
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.Hasseam.sensorTypes.DCMOTOR,
                    data: {
                        port0: directionPort,
                        port1: speedPort,
                        value0: directionValue,
                        value1: speedValue,
                    },
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: { js: [], py: ['hasseam.set_digital_dcmotor(%1, %2, %3, %4)'] },
        },
        hasseam_module_digital_lcd: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            template: Lang.template.hasseam_module_digital_lcd,
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
                        type: 'hasseam_list_digital_lcd',
                    },
                    {
                        type: 'text',
                        params: ['My Entry!!'],
                    },
                    null,
                ],
                type: 'hasseam_module_digital_lcd',
            },
            paramsKeyMap: {
                LINE: 0,
                STRING: 1,
            },
            class: 'hasseamModule',
            isNotFor: ['hasseam'],
            func: function(sprite, script) {
                var line = script.getNumberValue('LINE');
                var string = script.getValue('STRING');
                var text = [];

                if (!script.isStart) {
                    if (typeof string === 'string') {
                        for (var i = 0; i < string.length; i++) {
                            text[i] = string.charCodeAt(i);
                        }
                    } else if (typeof string === 'number') {
                        text[0] = 1;
                        text[1] = string / 1;
                    } else {
                        text[0] = string;
                    }

                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = 60 / fps * 50;

                    Entry.hw.sendQueue['SET'][line] = {
                        type: Entry.Hasseam.sensorTypes.LCD,
                        data: {
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
            syntax: { js: [], py: ['hasseam.module_digital_lcd(%1, %2)'] },
        },
        hasseam_module_digital_oled: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.hasseam_module_digital_oled,
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
                        type: 'text',
                        params: ['20'],
                    },
                    {
                        type: 'text',
                        params: ['20'],
                    },
                    {
                        type: 'text',
                        params: ['My Entry!!'],
                    },
                    null,
                ],
                type: 'hasseam_module_digital_oled',
            },
            paramsKeyMap: {
                VALUE0: 0,
                VALUE1: 1,
                STRING: 2,
            },
            class: 'hasseamModule',
            isNotFor: ['hasseam'],
            func: function(sprite, script) {
                var port = 0; // port value is dummy;
                var coodinate_x = script.getNumberValue('VALUE0');
                var coodinate_y = script.getNumberValue('VALUE1');
                var string = script.getValue('STRING');
                var text = [];

                if (!script.isStart) {
                    if (typeof string === 'string') {
                        for (var i = 0; i < string.length; i++) {
                            text[i] = string.charCodeAt(i);
                        }
                    } else if (typeof string === 'number') {
                        text[0] = 1;
                        text[1] = string / 1;
                    } else {
                        text[0] = string;
                    }
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = 60 / fps * 50;

                    coodinate_x = Math.min(coodinate_x, 127);
                    coodinate_x = Math.max(coodinate_x, 0);
                    coodinate_y = Math.min(coodinate_y, 63);
                    coodinate_y = Math.max(coodinate_y, 0);

                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.Hasseam.sensorTypes.OLED,
                        data: {
                            value0: coodinate_x,
                            value1: coodinate_y,
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
            syntax: { js: [], py: ['hasseam.Module_digital_oled(%1, %2, %3)'] },
        },
        hasseam_module_digital_bluetooth: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            template: Lang.template.hasseam_module_digital_bluetooth,
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
                        type: 'text',
                        params: ['My Entry!!'],
                    },
                    null,
                ],
                type: 'hasseam_module_digital_bluetooth',
            },
            paramsKeyMap: {
                STRING: 0,
            },
            class: 'hasseamModule',
            isNotFor: ['hasseam'],
            func: function(sprite, script) {
                var string = script.getValue('STRING');
                var port = 3;
                var text = [];

                if (!script.isStart) {
                    if (typeof string === 'string') {
                        for (var i = 0; i < string.length; i++) {
                            text[i] = string.charCodeAt(i);
                        }
                    } else {
                        text[0] = string;
                    }
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = 60 / fps * 50;

                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.Hasseam.sensorTypes.WRITE_BLUETOOTH,
                        data: {
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
            syntax: { js: [], py: ['hasseam.module_digital_bluetooth(%1)'] },
        },
        //endregion hasseam 하쌤보드
    };
};

module.exports = Entry.Hasseam;
