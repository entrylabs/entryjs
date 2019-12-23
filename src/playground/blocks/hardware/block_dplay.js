'use strict';

Entry.dplay = {
    id: '1.5',
    name: 'dplay',
    url: 'http://dplay.cc',
    imageName: 'dplay.png',
    title: {
        ko: '디플레이',
        en: 'DPLAY',
    },
    vel_value: 255,
    Left_value: 255,
    Right_value: 255,
    setZero: Entry.Arduino.setZero,
    timeouts: [],
    removeTimeout: function(id) {
        clearTimeout(id);
        var timeouts = this.timeouts;
        var index = timeouts.indexOf(id);
        if (index >= 0) {
            timeouts.splice(index, 1);
        }
    },
    removeAllTimeouts: function() {
        var timeouts = this.timeouts;
        for (var i in timeouts) {
            clearTimeout(timeouts[i]);
        }
        this.timeouts = [];
    },
    monitorTemplate: {
        imgPath: 'hw/dplay.png',
        width: 500,
        height: 600,
        listPorts: {
            '2': {
                name: Lang.Hw.port_en + ' 2 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '3': {
                name: Lang.Hw.port_en + ' 3 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '4': {
                name: Lang.Hw.port_en + ' 4 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '5': {
                name: Lang.Hw.port_en + ' 5 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '6': {
                name: Lang.Hw.port_en + ' 6 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '7': {
                name: Lang.Hw.port_en + ' 7 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '8': {
                name: Lang.Hw.port_en + ' 8 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '9': {
                name: Lang.Hw.port_en + ' 9 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '10': {
                name: Lang.Hw.port_en + ' 10 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '11': {
                name: Lang.Hw.port_en + ' 11 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '12': {
                name: Lang.Hw.port_en + ' 12 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '13': {
                name: Lang.Hw.port_en + ' 13 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            a0: {
                name: Lang.Hw.port_en + ' A0 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            a1: {
                name: Lang.Hw.port_en + ' A1 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            a2: {
                name: Lang.Hw.port_en + ' A2 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            a3: {
                name: Lang.Hw.port_en + ' A3 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            a4: {
                name: Lang.Hw.port_en + ' A4 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            a5: {
                name: Lang.Hw.port_en + ' A5 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
        },
        mode: 'both',
    },
};
Entry.dplay.blockMenuBlocks = [
    //dplay
    'dplay_get_number_sensor_value',
    'dplay_get_value',
    'dplay_get_gas_sensor_value',
    'dplay_get_dust_sensor_value',
    'dplay_get_CO2_sensor_value',
    'dplay_convert_scale',
    'dplay_get_digital_value',
    'dplay_get_switch_status',
    'dplay_get_tilt',
    'dplay_toggle_led',
    'dplay_toggle_pwm',
    'dplay_select_led',
    'dplay_DCmotor',
    'dplay_DCmotor_speed',
    'dplay_buzzer',
    'dplay_servo',
    'dplay_Robot_run',
    'dplay_Robot_run_sec',
    'dplay_robot_speed_sel',
    'dplay_robot_speed_set',
    'dplay_robot_stop',
];
Entry.dplay.getBlocks = function() {
    return {
        //region dplay 디플레이
        dplay_get_number_sensor_value: {
            parent: 'arduino_get_number_sensor_value',
            isNotFor: ['dplay'],
            def: {
                params: [
                    {
                        type: 'arduino_get_sensor_number',
                    },
                ],
                type: 'dplay_get_number_sensor_value',
            },
            class: 'dplay_get',
            syntax: { js: [], py: ['Dplay.sensor_value(%1)'] },
        },
        dplay_get_dust_sensor_value: {
            parent: 'arduino_get_number_sensor_value',
            template: '아날로그 %1 번  먼지 센서값',
            isNotFor: ['dplay'],
            def: {
                params: [
                    {
                        type: 'arduino_get_sensor_number',
                    },
                ],
                type: 'dplay_get_dust_sensor_value',
            },
            class: 'dplay_get',
            syntax: { js: [], py: ['Dplay.dust_sensor_value(%1)'] },
        },
        dplay_get_CO2_sensor_value: {
            parent: 'arduino_get_number_sensor_value',
            template: '아날로그 %1 번  이산화탄소 센서값',
            isNotFor: ['dplay'],
            def: {
                params: [
                    {
                        type: 'arduino_get_sensor_number',
                    },
                ],
                type: 'dplay_get_CO2_sensor_value',
            },
            class: 'dplay_get',
            syntax: { js: [], py: ['Dplay.co2_sensor_value(%1)'] },
        },
        dplay_get_gas_sensor_value: {
            parent: 'arduino_get_number_sensor_value',
            isNotFor: ['dplay'],
            template: '아날로그 %1 번 가스 센서값',
            def: {
                params: [
                    {
                        type: 'arduino_get_sensor_number',
                    },
                ],
                type: 'dplay_get_gas_sensor_value',
                id: 'hh5b',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'dplay_get',
            func: function(sprite, script) {
                var signal = script.getValue('VALUE', script);
                return Entry.hw.getAnalogPortValue(signal[1]);
            },
            syntax: { js: [], py: ['Dplay.gas_sensor_value(%1)'] },
        },
        dplay_convert_scale: {
            parent: 'arduino_convert_scale',
            isNotFor: ['dplay'],
            def: {
                params: [
                    {
                        type: 'arduino_get_number_sensor_value',
                        params: [
                            {
                                type: 'arduino_get_sensor_number',
                                id: 'bl5e',
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
                type: 'dplay_convert_scale',
            },
            class: 'dplay_get',
            syntax: { js: [], py: ['Dplay.convert_scale(%1, %2, %3, %4, %5)'] },
        },
        dplay_get_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#FFF',
            skeleton: 'basic_string_field',
            statements: [],
            template: '아날로그 %1 번  %2 센서값',
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['적외선', 'INFR'],
                        ['가변저항', 'ADJU'],
                        ['빛센서', 'LIGHT'],
                        ['온도센서', 'TEMP'],
                        ['조이스틱 X', 'JOYSX'],
                        ['조이스틱 Y', 'JOYSY'],
                    ],
                    value: 'INFR',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'arduino_get_sensor_number',
                    },
                    null,
                ],
                type: 'dplay_get_value',
                id: 'hh5b',
            },
            paramsKeyMap: {
                VALUE: 0,
                OPERATOR: 1,
            },
            class: 'dplay_get',
            isNotFor: ['dplay'],
            func: function(sprite, script) {
                var signal = script.getValue('VALUE', script);
                return Entry.hw.getAnalogPortValue(signal[1]);
            },
            syntax: { js: [], py: ['Dplay.value(%1, %2)'] },
        },
        dplay_get_digital_value: {
            parent: 'arduino_get_digital_value',
            isNotFor: ['dplay'],
            def: {
                params: [
                    {
                        type: 'arduino_get_port_number',
                    },
                ],
                type: 'dplay_get_digital_value',
            },
            class: 'dplay_get',
            syntax: { js: [], py: ['Dplay.digital_value(%1)'] },
        },
        dplay_get_switch_status: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#FFF',
            skeleton: 'basic_boolean_field',
            statements: [],
            template: '디지털 %1 번 스위치가 %2  ',
            params: [
                {
                    type: 'Dropdown',
                    options: [['2', '2'], ['4', '4']],
                    value: '2',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [['눌림', 'ON'], ['열림', 'OFF']],
                    value: 'ON',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null, null],
                type: 'dplay_get_switch_status',
            },
            paramsKeyMap: {
                PORT: 0,
                STATUS: 1,
            },
            class: 'dplay_get',
            isNotFor: ['dplay'],
            func: function(sprite, script) {
                var port1 = script.getField('PORT');
                var port = 2;
                if (port1 == '2') port = 2;
                else if (port1 == '4') port = 4;
                var value1 = script.getField('STATUS');
                if (value1 == 'ON') return Entry.hw.getDigitalPortValue(port) == 1 ? 1 : 0;
                else return Entry.hw.getDigitalPortValue(port) == 0 ? 1 : 0;
            },
            syntax: { js: [], py: ['Dplay.switch_status(%1, %2)'] },
        },
        dplay_get_tilt: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#FFF',
            skeleton: 'basic_boolean_field',
            statements: [],
            template: '디지털  %1 번 기울기센서가 %2  ',
            params: [
                {
                    type: 'Dropdown',
                    options: [['2', '2'], ['4', '4']],
                    value: '2',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [['왼쪽', 'LEFT'], ['오른쪽', 'LIGHT']],
                    value: 'LEFT',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null, null],
                type: 'dplay_get_tilt',
            },
            paramsKeyMap: {
                PORT: 0,
                STATUS: 1,
            },
            class: 'dplay_get',
            isNotFor: ['dplay'],
            func: function(sprite, script) {
                var port1 = script.getField('PORT');
                var port = 2;
                if (port1 == '2') port = 2;
                else if (port1 == '4') port = 4;
                var value1 = script.getField('STATUS');
                if (value1 == 'LIGHT') return Entry.hw.getDigitalPortValue(port) == 1 ? 1 : 0;
                else return Entry.hw.getDigitalPortValue(port) == 0 ? 1 : 0;
            },
            syntax: { js: [], py: ['Dplay.tilt(%1, %2)'] },
        },
        dplay_toggle_led: {
            parent: 'arduino_toggle_led',
            isNotFor: ['dplay'],
            def: {
                params: [
                    {
                        type: 'arduino_get_port_number',
                    },
                    null,
                    null,
                ],
                type: 'dplay_toggle_led',
            },
            class: 'dplay_set',
            syntax: { js: [], py: ['Dplay.toggle_led(%1)'] },
        },
        dplay_toggle_pwm: {
            parent: 'arduino_toggle_pwm',
            isNotFor: ['dplay'],
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
                type: 'dplay_toggle_pwm',
            },
            class: 'dplay_set',
            syntax: { js: [], py: ['Dplay.toggle_pwm(%1, %2)'] },
        },
        dplay_select_led: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#FFF',
            skeleton: 'basic',
            statements: [],
            template: '디지털 %1 LED 상태를 %2 %3',
            params: [
                {
                    type: 'Dropdown',
                    options: [['7', '7'], ['8', '8'], ['12', '12'], ['13', '13']],
                    value: '7',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [['켜기', 'ON'], ['끄기', 'OFF']],
                    value: 'ON',
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
                params: [null, null, null],
                type: 'dplay_select_led',
            },
            paramsKeyMap: {
                PORT: 0,
                OPERATOR: 1,
            },
            class: 'dplay_set',
            isNotFor: ['dplay'],
            func: function(sprite, script) {
                var port1 = script.getField('PORT');
                var port = 7;
                if (port1 == '7') port = 7;
                else if (port1 == '8') port = 8;
                else if (port1 == '12') port = 12;
                else if (port1 == '13') port = 13;
                var operator = script.getField('OPERATOR');
                var value = operator == 'ON' ? 255 : 0;
                Entry.hw.setDigitalPortValue(port, value);
                return script.callReturn();
            },
            syntax: { js: [], py: ['Dplay.select_led(%1, %2)'] },
        },
        dplay_DCmotor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#FFF',
            skeleton: 'basic',
            statements: [],
            template: '%1  DC모터 상태를 %2 %3',
            params: [
                {
                    type: 'Dropdown',
                    options: [['왼쪽', '1'], ['오른쪽', '2'], ['양쪽', '3']],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [['정방향', 'FRONT'], ['역방향', 'REAR'], ['정지', 'OFF']],
                    value: 'FRONT',
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
                params: [null, null, null],
                type: 'dplay_DCmotor',
            },
            paramsKeyMap: {
                PORT: 0,
                OPERATOR: 1,
            },
            class: 'dplay_set',
            isNotFor: ['dplay'],
            func: function(sprite, script) {
                var port = script.getField('PORT');
                var port1 = 0;
                var port2 = 0;
                var port3 = 0;
                var port4 = 0;
                if (port == '1') {
                    port1 = 3;
                    port2 = 5;
                } else if (port == '2') {
                    port1 = 6;
                    port2 = 11;
                } else if (port == '3') {
                    port1 = 3;
                    port2 = 5;
                    port3 = 11;
                    port4 = 6;
                }
                var temp = Entry.dplay.vel_value;
                var operator = script.getField('OPERATOR');
                var value1 = 0;
                var value2 = 0;
                var value3 = 0;
                var value4 = 0;
                if (operator == 'FRONT') {
                    value1 = temp;
                    value2 = 0;
                } else if (operator == 'REAR') {
                    value1 = 0;
                    value2 = temp;
                } else if (operator == 'OFF') {
                    value1 = 0;
                    value2 = 0;
                }
                Entry.hw.setDigitalPortValue(port1, value2);
                Entry.hw.setDigitalPortValue(port2, value1);
                Entry.hw.setDigitalPortValue(port3, value2);
                Entry.hw.setDigitalPortValue(port4, value1);
                return script.callReturn();
            },
            syntax: { js: [], py: ['Dplay.dc_motor(%1, %2)'] },
        },
        dplay_DCmotor_speed: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#FFF',
            skeleton: 'basic',
            statements: [],
            template: '%1 DC모터 속도를 %2(으)로 정하기 %3',
            params: [
                {
                    type: 'Dropdown',
                    options: [['왼쪽', '1'], ['오른쪽', '2'], ['양쪽', '3']],
                    value: '1',
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
                        type: 'text',
                        params: ['100'],
                    },
                    null,
                ],
                type: 'dplay_DCmotor_speed',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'dplay_set',
            isNotFor: ['dplay'],
            func: function(sprite, script) {
                var port1 = 0;
                var port2 = 0;
                var port3 = 0;
                var port4 = 0;
                var value1 = 0;
                var value2 = 0;
                var result = 0;
                var port = script.getField('PORT');
                if (port == '1') {
                    port1 = 3;
                    port2 = 5;
                } else if (port == '2') {
                    port1 = 11;
                    port2 = 6;
                } else if (port == '3') {
                    port1 = 3;
                    port2 = 5;
                    port3 = 11;
                    port4 = 6;
                }
                var operator = script.getNumberValue('VALUE', script);
                operator = Math.max(operator, -100);
                operator = Math.min(operator, 100);
                if (operator == 0) {
                    value1 = 0;
                    value2 = 0;
                    Entry.dplay.vel_value = value2;
                } else if (operator > 0) {
                    result = operator + 155;
                    result = Math.round(result);
                    value1 = 0;
                    value2 = result;
                    Entry.dplay.vel_value = value2;
                } else if (operator < 0) {
                    result = operator - 155;
                    result = Math.round(result);
                    value1 = -result;
                    value2 = 0;
                    Entry.dplay.vel_value = value1;
                }
                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timeValue = 50;
                    var timer = setTimeout(function() {
                        script.timeFlag = 2;
                        Entry.dplay.removeTimeout(timer);
                    }, timeValue);
                    Entry.dplay.timeouts.push(timer);
                    return script;
                } else if (script.timeFlag == 1) {
                    Entry.hw.setDigitalPortValue(3, 0);
                    Entry.hw.setDigitalPortValue(5, 0);
                    Entry.hw.setDigitalPortValue(6, 0);
                    Entry.hw.setDigitalPortValue(11, 0);
                    return script;
                } else if (script.timeFlag == 2) {
                    Entry.hw.setDigitalPortValue(port1, value1);
                    Entry.hw.setDigitalPortValue(port2, value2);
                    Entry.hw.setDigitalPortValue(port3, value1);
                    Entry.hw.setDigitalPortValue(port4, value2);
                    delete script.isStart;
                    delete script.timeFlag;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['Dplay.dc_motor_speed(%1, %2)'] },
        },
        dplay_buzzer: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#FFF',
            skeleton: 'basic',
            statements: [],
            template: '디지털 10번 부저를 %1 %2 %3 박자로 연주하기',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['도', '1'],
                        ['도#', '2'],
                        ['레', '3'],
                        ['미b', '4'],
                        ['미', '5'],
                        ['파', '6'],
                        ['파#', '7'],
                        ['솔', '8'],
                        ['솔#', '9'],
                        ['라', '10'],
                        ['시b', '11'],
                        ['시', '12'],
                        ['무음', '100'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [['1', '1'], ['2', '2'], ['3', '3']],
                    value: '1',
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
                    '1',
                    '1',
                    {
                        type: 'text',
                        params: ['0.5'],
                    },
                    null,
                ],
                type: 'dplay_buzzer',
            },
            paramsKeyMap: {
                NOTE: 0,
                OCTAVE: 1,
                VALUE: 2,
            },
            class: 'dplay_set',
            isNotFor: ['dplay'],
            func: function(sprite, script) {
                if (!script.isStart) {
                    var note = script.getNumberField('NOTE', script);
                    var octave = script.getNumberField('OCTAVE', script);
                    var beat = script.getNumberValue('VALUE');
                    var tempo = 60;
                    var note_go = note + (octave - 1) * 12;
                    var timeValue = beat * 60 * 1000 / tempo;
                    script.isStart = true;
                    script.timeFlag = 1;
                    if (note == 100) Entry.hw.setDigitalPortValue(10, 100);
                    else Entry.hw.setDigitalPortValue(10, note_go);
                    if (timeValue > 100) {
                        var timer1 = setTimeout(function() {
                            Entry.hw.setDigitalPortValue(10, 100);
                            Entry.dplay.removeTimeout(timer1);
                        }, timeValue - 100);
                        Entry.dplay.timeouts.push(timer1);
                    }
                    var timer2 = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.dplay.removeTimeout(timer2);
                    }, timeValue);
                    Entry.dplay.timeouts.push(timer2);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    Entry.hw.setDigitalPortValue(10, 100);
                    delete script.isStart;
                    delete script.timeFlag;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['Dplay.buzzer(%1, %2, %3)'] },
        },
        dplay_servo: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#FFF',
            skeleton: 'basic',
            statements: [],
            template: '디지털 9번 서보모터 각도를 %1 (도)로 이동',
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
                        params: ['180'],
                    },
                    null,
                ],
                type: 'dplay_servo',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'dplay_set',
            isNotFor: ['dplay'],
            func: function(sprite, script) {
                var port = 9;
                var value = script.getNumberValue('VALUE');
                value = Math.round(value);
                value = Math.max(value, 1);
                value = Math.min(value, 179);
                Entry.hw.setDigitalPortValue(9, value);
                return script.callReturn();
            },
            syntax: { js: [], py: ['Dplay.servo(%1)'] },
        },
        dplay_Robot_run: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#FFF',
            skeleton: 'basic',
            statements: [],
            template: '로봇을 %1 하기 %2',
            params: [
                {
                    type: 'Dropdown',
                    options: [['전진', '1'], ['후진', '2'], ['우회전', '3'], ['좌회전', '4']],
                    value: '1',
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
                type: 'dplay_Robot_run',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'dplay_robot',
            isNotFor: ['dplay'],
            func: function(sprite, script) {
                var port = script.getField('PORT');
                var port1 = 3;
                var port2 = 5;
                var port3 = 6;
                var port4 = 11;
                var value1 = 0;
                var value2 = 0;
                var value3 = 0;
                var value4 = 0;
                var temp_Left = Entry.dplay.Left_value;
                var temp_Right = Entry.dplay.Right_value;
                if (port == '1') {
                    value1 = 0;
                    value2 = temp_Left;
                    value3 = temp_Right;
                    value4 = 0;
                } else if (port == '2') {
                    value1 = temp_Left;
                    value2 = 0;
                    value3 = 0;
                    value4 = temp_Right;
                } else if (port == '3') {
                    value1 = 0;
                    value2 = temp_Left;
                    value3 = 0;
                    value4 = 0;
                } else if (port == '4') {
                    value1 = 0;
                    value2 = 0;
                    value3 = temp_Right;
                    value4 = 0;
                }
                Entry.hw.setDigitalPortValue(port1, value1);
                Entry.hw.setDigitalPortValue(port2, value2);
                Entry.hw.setDigitalPortValue(port3, value3);
                Entry.hw.setDigitalPortValue(port4, value4);
                return script.callReturn();
            },
            syntax: { js: [], py: ['Dplay.robot_run(%1)'] },
        },
        dplay_Robot_run_sec: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#FFF',
            skeleton: 'basic',
            statements: [],
            template: '로봇을 %1 초 동안 %2 하기 %3',
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Dropdown',
                    options: [['전진', '1'], ['후진', '2'], ['우회전', '3'], ['좌회전', '4']],
                    value: '1',
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
                        params: ['1'],
                    },
                    null,
                    null,
                ],
                type: 'dplay_Robot_run_sec',
            },
            paramsKeyMap: {
                VALUE: 0,
                PORT: 1,
            },
            class: 'dplay_robot',
            isNotFor: ['dplay'],
            func: function(sprite, script) {
                var port1 = 3;
                var port2 = 5;
                var port3 = 6;
                var port4 = 11;
                var value1 = 0;
                var value2 = 0;
                var value3 = 0;
                var value4 = 0;
                var temp_Left = Entry.dplay.Left_value;
                var temp_Right = Entry.dplay.Right_value;
                var port = script.getField('PORT');
                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timeValue = script.getNumberValue('VALUE') * 1000;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.dplay.removeTimeout(timer);
                    }, timeValue);
                    Entry.dplay.timeouts.push(timer);
                    return script;
                } else if (script.timeFlag == 1) {
                    if (port == '1') {
                        value1 = 0;
                        value2 = temp_Left;
                        value3 = temp_Right;
                        value4 = 0;
                    } else if (port == '2') {
                        value1 = temp_Left;
                        value2 = 0;
                        value3 = 0;
                        value4 = temp_Right;
                    } else if (port == '3') {
                        value1 = 0;
                        value2 = temp_Left;
                        value3 = 0;
                        value4 = 0;
                    } else if (port == '4') {
                        value1 = 0;
                        value2 = 0;
                        value3 = temp_Right;
                        value4 = 0;
                    }
                    Entry.hw.setDigitalPortValue(port1, value1);
                    Entry.hw.setDigitalPortValue(port2, value2);
                    Entry.hw.setDigitalPortValue(port3, value3);
                    Entry.hw.setDigitalPortValue(port4, value4);
                    return script;
                } else {
                    delete script.isStart;
                    delete script.timeFlag;
                    Entry.engine.isContinue = false;
                    value1 = 0;
                    value2 = 0;
                    value3 = 0;
                    value4 = 0;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['Dplay.robot_run_sec(%1, %2)'] },
        },
        dplay_robot_speed_sel: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#FFF',
            skeleton: 'basic',
            statements: [],
            template: '%1 바퀴 속도를 %2(으)로 정하기 %3',
            params: [
                {
                    type: 'Dropdown',
                    options: [['왼쪽', '1'], ['오른쪽', '2'], ['양쪽', '3']],
                    value: '1',
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
                        type: 'text',
                        params: ['100'],
                    },
                    null,
                ],
                type: 'dplay_robot_speed_sel',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'dplay_robot',
            isNotFor: ['dplay'],
            func: function(sprite, script) {
                var port1 = 0;
                var port2 = 0;
                var port3 = 0;
                var port4 = 0;
                var value1 = 0;
                var value2 = 0;
                var value3 = 0;
                var value4 = 0;
                var result = 0;
                var port = script.getField('PORT');
                var operator = script.getNumberValue('VALUE', script);
                operator = Math.max(operator, -100);
                operator = Math.min(operator, 100);
                if (port == '1') {
                    port1 = 3;
                    port2 = 5;
                    if (operator > 0) {
                        result = operator + 155;
                        result = Math.round(result);
                        value1 = 0;
                        value2 = result;
                        Entry.dplay.Left_value = value2;
                    } else if (operator < 0) {
                        result = operator - 155;
                        result = Math.round(result);
                        value1 = -result;
                        value2 = 0;
                        Entry.dplay.Left_value = value1;
                    } else if (operator == 0) {
                        value1 = 0;
                        value2 = 0;
                        Entry.dplay.Left_value = 0;
                    }
                }
                if (port == '2') {
                    port3 = 6;
                    port4 = 11;
                    if (operator > 0) {
                        result = operator + 155;
                        result = Math.round(result);
                        value3 = 0;
                        value4 = result;
                        Entry.dplay.Right_value = value4;
                    } else if (operator < 0) {
                        result = operator - 155;
                        result = Math.round(result);
                        value3 = -result;
                        value4 = 0;
                        Entry.dplay.Right_value = value3;
                    } else if (operator == 0) {
                        value3 = 0;
                        value4 = 0;
                        Entry.dplay.Right_value = value3;
                    }
                }
                if (port == '3') {
                    port1 = 3;
                    port2 = 5;
                    port3 = 6;
                    port4 = 11;
                    if (operator > 0) {
                        result = operator + 155;
                        result = Math.round(result);
                        value1 = 0;
                        value2 = result;
                        value3 = 0;
                        value4 = result;
                        Entry.dplay.Left_value = value2;
                        Entry.dplay.Right_value = value4;
                    } else if (operator < 0) {
                        result = operator - 155;
                        result = Math.round(result);
                        value1 = -result;
                        value2 = 0;
                        value3 = -result;
                        value4 = 0;
                        Entry.dplay.Left_value = value1;
                        Entry.dplay.Right_value = value3;
                    } else if (operator == 0) {
                        value1 = 0;
                        value2 = 0;
                        value3 = 0;
                        value4 = 0;
                        Entry.dplay.Left_value = 0;
                        Entry.dplay.Right_value = 0;
                    }
                }
                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timeValue = 50;
                    var timer = setTimeout(function() {
                        script.timeFlag = 2;
                        Entry.dplay.removeTimeout(timer);
                    }, timeValue);
                    Entry.dplay.timeouts.push(timer);
                    return script;
                } else if (script.timeFlag == 1) {
                    Entry.hw.setDigitalPortValue(3, 0);
                    Entry.hw.setDigitalPortValue(5, 0);
                    Entry.hw.setDigitalPortValue(6, 0);
                    Entry.hw.setDigitalPortValue(11, 0);
                    return script;
                } else if (script.timeFlag == 2) {
                    Entry.hw.setDigitalPortValue(port1, value1);
                    Entry.hw.setDigitalPortValue(port2, value2);
                    Entry.hw.setDigitalPortValue(port3, value4);
                    Entry.hw.setDigitalPortValue(port4, value3);
                    delete script.isStart;
                    delete script.timeFlag;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
        },
        dplay_robot_speed_set: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#FFF',
            skeleton: 'basic',
            statements: [],
            template: '오른쪽 바퀴 %1 왼쪽 바퀴 %2(으)로 정하기 %3',
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
                        type: 'text',
                        params: ['100'],
                    },
                    {
                        type: 'text',
                        params: ['100'],
                    },
                    null,
                ],
                type: 'dplay_robot_speed_set',
            },
            paramsKeyMap: {
                R_VALUE: 0,
                L_VALUE: 1,
            },
            class: 'dplay_robot',
            isNotFor: ['dplay'],
            func: function(sprite, script) {
                var port1 = 3;
                var port2 = 5;
                var port3 = 6;
                var port4 = 11;
                var value1 = 0;
                var value2 = 0;
                var value3 = 0;
                var value4 = 0;
                var result_R = 0;
                var result_L = 0;
                var value_L = script.getNumberValue('L_VALUE', script);
                value_L = Math.max(value_L, -100);
                value_L = Math.min(value_L, 100);
                if (value_L > 0) {
                    result_L = value_L + 155;
                    result_L = Math.round(result_L);
                    value1 = 0;
                    value2 = result_L;
                    Entry.dplay.Left_value = value2;
                } else if (value_L < 0) {
                    result_L = value_L - 155;
                    result_L = Math.round(result_L);
                    value1 = -result_L;
                    value2 = 0;
                    Entry.dplay.Left_value = value1;
                } else if (value_L == 0) {
                    value1 = 0;
                    value2 = 0;
                    Entry.dplay.Left_value = 0;
                }
                var value_R = script.getNumberValue('R_VALUE', script);
                value_R = Math.max(value_R, -100);
                value_R = Math.min(value_R, 100);
                if (value_R > 0) {
                    result_R = value_R + 155;
                    result_R = Math.round(result_R);
                    value3 = 0;
                    value4 = result_R;
                    Entry.dplay.Right_value = value4;
                } else if (value_R < 0) {
                    result_R = value_R - 155;
                    result_R = Math.round(result_R);
                    value3 = -result_R;
                    value4 = 0;
                    Entry.dplay.Right_value = value3;
                } else if (value_R == 0) {
                    value3 = 0;
                    value4 = 0;
                    Entry.dplay.Right_value = 0;
                }
                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timeValue = 50;
                    var timer = setTimeout(function() {
                        script.timeFlag = 2;
                        Entry.dplay.removeTimeout(timer);
                    }, timeValue);
                    Entry.dplay.timeouts.push(timer);
                    return script;
                } else if (script.timeFlag == 1) {
                    Entry.hw.setDigitalPortValue(3, 0);
                    Entry.hw.setDigitalPortValue(5, 0);
                    Entry.hw.setDigitalPortValue(6, 0);
                    Entry.hw.setDigitalPortValue(11, 0);
                    return script;
                } else if (script.timeFlag == 2) {
                    Entry.hw.setDigitalPortValue(port1, value1);
                    Entry.hw.setDigitalPortValue(port2, value2);
                    Entry.hw.setDigitalPortValue(port3, value4);
                    Entry.hw.setDigitalPortValue(port4, value3);
                    delete script.isStart;
                    delete script.timeFlag;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['Dplay.robot_speed_sel(%1, %2)'] },
        },
        dplay_robot_stop: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#FFF',
            skeleton: 'basic',
            statements: [],
            template: '로봇을 정지하기 %1',
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
                type: 'dplay_robot_stop',
            },
            paramsKeyMap: {},
            class: 'dplay_robot',
            isNotFor: ['dplay'],
            func: function(sprite, script) {
                var port1 = 3;
                var port2 = 5;
                var port3 = 6;
                var port4 = 11;
                var value1 = 0;
                var value2 = 0;
                Entry.hw.setDigitalPortValue(port1, value1);
                Entry.hw.setDigitalPortValue(port2, value2);
                Entry.hw.setDigitalPortValue(port4, value1);
                Entry.hw.setDigitalPortValue(port3, value2);
                return script.callReturn();
            },
            syntax: { js: [], py: ['Dplay.robot_stop()'] },
        },
        //endregion dplay 디플레이
    };
};

module.exports = Entry.dplay;
