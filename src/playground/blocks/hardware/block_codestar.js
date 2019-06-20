'use strict';

Entry.Codestar = {
    id: 'B.1',
    name: 'codestar',
    url: 'http://codestar.co.kr',
    imageName: 'codestar.png',
    title: {
        ko: '코드스타',
        en: 'Codestar',
    },
    setZero: function() {
        Entry.hw.sendQueue.readablePorts = [];
        for (var port = 0; port < 20; port++) {
            Entry.hw.sendQueue[port] = 0;
            Entry.hw.sendQueue.readablePorts.push(port);
        }
        Entry.hw.update();
    },
    monitorTemplate: {
        imgPath: 'hw/codestar.png',
        width: 333,
        height: 409,
        listPorts: {
            '13': { name: '진동모터', type: 'output', pos: { x: 0, y: 0 } },
            tilt: { name: '기울기센서', type: 'input', pos: { x: 0, y: 0 } },
        },
        ports: {
            '7': { name: '빨간색', type: 'output', pos: { x: 238, y: 108 } },
            '8': { name: '파란색', type: 'output', pos: { x: 265, y: 126 } },
            '9': { name: '3색 빨간색', type: 'output', pos: { x: 292, y: 34 } },
            '10': { name: '3색 녹색', type: 'output', pos: { x: 292, y: 34 } },
            '11': {
                name: '3색 파란색',
                type: 'output',
                pos: { x: 292, y: 34 },
            },
            '12': { name: '버튼', type: 'input', pos: { x: 248, y: 142 } },
            a0: { name: '왼쪽 벽감지', type: 'input', pos: { x: 24, y: 231 } },
            a2: { name: '마이크', type: 'input', pos: { x: 225, y: 67 } },
            a3: { name: '부저', type: 'output', pos: { x: 283, y: 105 } },
            a4: {
                name: '왼쪽 라인감지',
                type: 'input',
                pos: { x: 37, y: 353 },
            },
            a5: {
                name: '오른쪽 라인감지',
                type: 'input',
                pos: { x: 50, y: 368 },
            },
            a6: { name: '조도센서', type: 'input', pos: { x: 273, y: 22 } },
            a7: {
                name: '오른쪽 벽감지',
                type: 'input',
                pos: { x: 103, y: 381 },
            },
            temperature: {
                name: '온도센서',
                type: 'input',
                pos: { x: 311, y: 238 },
            },
            sonar: { name: '초음파센서', type: 'input', pos: { x: 7, y: 277 } },
            leftwheel: {
                name: '왼쪽 바퀴',
                type: 'output',
                pos: { x: 177, y: 370 },
            },
            rightwheel: {
                name: '오른쪽 바퀴',
                type: 'output',
                pos: { x: 83, y: 218 },
            },
        },
        mode: 'both',
    },
};
Entry.Codestar.blockMenuBlocks = [
    'codestar_color_single',
    'codestar_3color',
    'codestar_vibration',
    'codestar_buzzer',
    'codestar_buzzer_stop',
    'codestar_drive',
    'codestar_wheel',
    'codestar_light',
    'codestar_button',
    'codestar_ir',
    'codestar_sonar',
    'codestar_mic',
    'codestar_temperature',
    'codestar_tilt',
];
Entry.Codestar.getBlocks = function() {
    return {
        //region codestar 코드스타
        codestar_color_single: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            template: '%1 LED %2 %3',
            params: [
                {
                    type: 'Dropdown',
                    options: [['빨간색', 7], ['파란색', 8]],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [[Lang.Blocks.ARDUINO_on, 'on'], [Lang.Blocks.ARDUINO_off, 'off']],
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
                params: [7, 'on', null],
                type: 'codestar_color_single',
            },
            paramsKeyMap: {
                PORT: 0,
                ONOFF: 1,
            },
            class: 'codestar_output_sensor',
            isNotFor: ['codestar'],
            func: function(sprite, script) {
                var port = script.getField('PORT');
                var onoff = script.getField('ONOFF');
                var value = onoff == 'on' ? 255 : 0;
                Entry.hw.setDigitalPortValue(port, value);
                return script.callReturn();
            },
        },
        codestar_3color: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            template: '3색 LED %1 밝기 %2 %3',
            params: [
                {
                    type: 'Dropdown',
                    options: [['빨간색', 9], ['초록색', 10], ['파란색', 11]],
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
                params: [9, { type: 'number', params: [120] }, null],
                type: 'codestar_3color',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'codestar_output_sensor',
            isNotFor: ['codestar'],
            func: function(sprite, script) {
                var port = script.getField('PORT');
                var value = script.getNumberValue('VALUE');
                value = Math.round(value);
                value = Math.max(value, 0);
                value = Math.min(value, 255);
                Entry.hw.setDigitalPortValue(port, value);
                return script.callReturn();
            },
        },
        codestar_vibration: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            template: '진동모터 %1 %2',
            params: [
                {
                    type: 'Dropdown',
                    options: [[Lang.Blocks.ARDUINO_on, 'on'], [Lang.Blocks.ARDUINO_off, 'off']],
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
                params: ['on', null],
                type: 'codestar_vibration',
            },
            paramsKeyMap: {
                ONOFF: 0,
            },
            class: 'codestar_output_sensor',
            isNotFor: ['codestar'],
            func: function(sprite, script) {
                var port = 13;
                var onoff = script.getField('ONOFF');
                var value = onoff == 'on' ? 255 : 0;
                Entry.hw.setDigitalPortValue(port, value);
                return script.callReturn();
            },
        },
        codestar_buzzer: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            template: '부저 톤%1 %2',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['G3', 1],
                        ['A3', 2],
                        ['B3', 3],
                        ['C4', 4],
                        ['D4', 5],
                        ['E4', 6],
                        ['F4', 7],
                        ['G4', 8],
                        ['A4', 9],
                        ['B4', 10],
                        ['C5', 11],
                        ['D5', 12],
                        ['E5', 13],
                        ['F5', 14],
                    ],
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
                params: [4, null],
                type: 'codestar_buzzer',
            },
            paramsKeyMap: {
                TONE: 0,
            },
            class: 'codestar_output_sensor',
            isNotFor: ['codestar'],
            func: function(sprite, script) {
                var tone = script.getField('TONE');
                Entry.hw.setDigitalPortValue(15, tone);
                return script.callReturn();
            },
        },
        codestar_buzzer_stop: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            template: '부저 중지 %1',
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
                type: 'codestar_buzzer_stop',
            },
            paramsKeyMap: {},
            class: 'codestar_output_sensor',
            isNotFor: ['codestar'],
            func: function(sprite, script) {
                Entry.hw.setDigitalPortValue(15, 24);
                return script.callReturn();
            },
        },
        codestar_servo: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            template: '서보모터 %1 모터값 %2 %3',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['D3', 'D3'],
                        ['D5', 'D5'],
                        ['D6', 'D6'],
                        ['D9', 'D9'],
                        ['D10', 'D10'],
                        ['D11', 'D11'],
                    ],
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
                params: ['D3', { type: 'number', params: [90] }, null],
                type: 'codestar_servo',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'codestar_motor',
            isNotFor: ['codestar'],
            func: function(sprite, script) {
                var value = script.getNumberValue('VALUE');
                var sq = Entry.hw.sendQueue;
                sq.outport = script.getField('PORT');
                sq.value = 0;
                if (!isNaN(value)) {
                    var tmp = value;
                    if (value < 0) tmp = 0;
                    if (value > 255) tmp = 255;
                    sq.value = tmp;
                }
                return script.callReturn();
            },
        },
        codestar_drive: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            template: '방향 %1 속도 %2 %3',
            params: [
                {
                    type: 'Dropdown',
                    options: [['앞으로', '0'], ['뒤로', '1'], ['왼쪽', '2'], ['오른쪽', '3']],
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
                params: ['0', { type: 'number', params: [100] }, null],
                type: 'codestar_drive',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                VALUE: 1,
            },
            class: 'codestar_motor',
            isNotFor: ['codestar'],
            func: function(sprite, script) {
                var value = script.getNumberValue('VALUE');
                var dir = Number(script.getField('DIRECTION'));
                var id = 0;
                //if(value == 0) value = 1;
                value = Math.round(value);
                value = Math.max(value, 0);
                value = Math.min(value, 255);

                value = Math.round(value / 30);
                //if(value == 0) value = 1;
                var query = (id << 7) + (dir << 5) + value;
                Entry.hw.setDigitalPortValue(14, query);
                return script.callReturn();
            },
        },
        codestar_wheel: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            template: '방향 %1 바퀴속도 %2 %3',
            params: [
                {
                    type: 'Dropdown',
                    options: [['왼쪽', '0'], ['오른쪽', '1']],
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
                params: ['0', { type: 'number', params: [100] }, null],
                type: 'codestar_wheel',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                VALUE: 1,
            },
            class: 'codestar_motor',
            isNotFor: ['codestar'],
            func: function(sprite, script) {
                var value = script.getNumberValue('VALUE');
                var dir = Number(script.getField('DIRECTION'));
                var id = 1;
                //if(value == 0)value = 1;
                value = Math.round(value);
                value = Math.max(value, -255);
                value = Math.min(value, 255);
                if (value < 0) {
                    dir = 2 + dir;
                    value *= -1;
                }
                value = Math.round(value / 30);
                //if(value == 0) value = 1;
                var query = (id << 7) + (dir << 5) + value;
                Entry.hw.setDigitalPortValue(14, query);
                return script.callReturn();
            },
        },
        codestar_light: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: '조도센서',
            params: [],
            events: {},
            def: {
                params: [],
                type: 'codestar_light',
            },
            paramsKeyMap: {},
            class: 'codestar_input_sensor',
            isNotFor: ['codestar'],
            func: function(sprite, script) {
                return Entry.hw.getAnalogPortValue('6');
            },
        },
        codestar_button: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: '버튼',
            params: [],
            events: {},
            def: {
                params: [],
                type: 'codestar_button',
            },
            paramsKeyMap: {},
            class: 'codestar_input_sensor',
            isNotFor: ['codestar'],
            func: function(sprite, script) {
                return Entry.hw.getDigitalPortValue('12');
            },
        },
        codestar_ir: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: 'IR %1',
            params: [
                {
                    type: 'Dropdown',
                    options: [['A0', '0'], ['A4', '4'], ['A5', '5'], ['A7', '7']],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: ['0'],
                type: 'codestar_ir',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'codestar_input_sensor',
            isNotFor: ['codestar'],
            func: function(sprite, script) {
                var port = script.getField('PORT');
                return Entry.hw.getAnalogPortValue(port);
            },
        },
        codestar_sonar: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: '초음파센서',
            params: [],
            events: {},
            def: {
                params: [],
                type: 'codestar_sonar',
            },
            paramsKeyMap: {},
            class: 'codestar_input_sensor',
            isNotFor: ['codestar'],
            func: function(sprite, script) {
                return Entry.hw.portData.sonar;
            },
        },
        codestar_variable_R: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: '가변저항 %1',
            params: [
                {
                    type: 'Dropdown',
                    options: [['A0', '0'], ['A1', '1'], ['A4', '4'], ['A5', '5']],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: ['1'],
                type: 'codestar_variable_R',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'codestar_input_sensor',
            isNotFor: ['codestar'],
            func: function(sprite, script) {
                var port = script.getField('PORT');
                return Entry.hw.getAnalogPortValue(port);
            },
        },
        codestar_mic: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: '마이크',
            params: [],
            events: {},
            def: {
                params: [],
                type: 'codestar_mic',
            },
            paramsKeyMap: {},
            class: 'codestar_input_sensor',
            isNotFor: ['codestar'],
            func: function(sprite, script) {
                return Entry.hw.getAnalogPortValue('2');
            },
        },
        codestar_temperature: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: '온도센서',
            params: [],
            events: {},
            def: {
                params: [],
                type: 'codestar_temperature',
            },
            paramsKeyMap: {},
            class: 'codestar_input_sensor',
            isNotFor: ['codestar'],
            func: function(sprite, script) {
                return Entry.hw.portData.temperature;
            },
        },
        codestar_gyroscope: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: '3축 자이로 %1 축 %2',
            params: [
                {
                    type: 'Dropdown',
                    options: [['x', 'x'], ['y', 'y'], ['z', 'z']],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: ['x', null],
                type: 'codestar_gyroscope',
            },
            paramsKeyMap: {
                AXIS: 0,
            },
            class: 'codestar_input_sensor',
            isNotFor: ['codestar'],
            func: function(sprite, script) {
                var axis = script.getField('AXIS');
                return Entry.hw.getAnalogPortValue('gyro_' + axis);
            },
        },
        codestar_geomagnetic: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: '3축 지자기 %1 축 %2',
            params: [
                {
                    type: 'Dropdown',
                    options: [['x', 'x'], ['y', 'y'], ['z', 'z']],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: ['x', null],
                type: 'codestar_geomagnetic',
            },
            paramsKeyMap: {
                AXIS: 0,
            },
            class: 'codestar_input_sensor',
            isNotFor: ['codestar'],
            func: function(sprite, script) {
                var axis = script.getField('AXIS');
                return Entry.hw.getAnalogPortValue('geo_' + axis);
            },
        },
        codestar_irR: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: 'IR 리모콘',
            params: [],
            events: {},
            def: {
                params: [],
                type: 'codestar_irR',
            },
            paramsKeyMap: {},
            class: 'codestar_input_sensor',
            isNotFor: ['codestar'],
            func: function(sprite, script) {
                return Entry.hw.getDigitalPortValue('3');
            },
        },
        codestar_tilt: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: '기울기센서',
            params: [],
            events: {},
            def: {
                params: [],
                type: 'codestar_tilt',
            },
            paramsKeyMap: {},
            class: 'codestar_input_sensor',
            isNotFor: ['codestar'],
            func: function(sprite, script) {
                return Entry.hw.portData.tilt;
            },
        },
        //endregion codestar 코드스타
    };
};

module.exports = Entry.Codestar;
