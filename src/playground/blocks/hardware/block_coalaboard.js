'use strict';

Entry.Coalaboard = {
    SENSOR_MAP: {
        1: 'light',
        2: 'IR',
        3: 'touch',
        4: 'potentiometer',
        5: 'MIC',
        6: 'ultrasonicSensor',
        7: 'temperature',
        10: 'vibrationSensor',
        21: 'UserSensor',
        11: 'UserInput',
        20: 'LED',
        19: 'SERVO',
        18: 'DC',
    },
    PORT_MAP: {
        buzzer: 2,
        '5': 4,
        '6': 6,
        '7': 8,
        '8': 10,
        LEDR: 12,
        LEDG: 14,
        LEDB: 16,
    },
    INEQ_SIGN: [
        ['<', '<'],
        ['>', '>'],
        ['=', '='],
    ],
    sensorList: function() {
        var list = [];
        var portData = Entry.hw.portData;
        for (var i = 1; i < 5; i++) {
            var data = portData[i];
            if (data && (data.value || data.value === 0)) {
                list.push([i + ' - ' + Lang.Blocks['COALABOARD_' + data.type], i.toString()]);
            }
        }

        if (list.length == 0) return [[Lang.Blocks.no_target, 'null']];
        return list;
    },
    touchList: function() {
        var list = [];
        var portData = Entry.hw.portData;
        for (var i = 1; i < 5; i++) {
            var data = portData[i];
            if (data && data.type === 'touch') list.push([i.toString(), i.toString()]);
        }
        if (list.length == 0) return [[Lang.Blocks.no_target, 'null']];
        return list;
    },
    servoList: function() {
        var list = [];
        var portData = Entry.hw.portData;
        for (var i = 5; i < 9; i++) {
            var data = portData[i];
            if (data && data.type === 'SERVO') list.push(['ABCD'[i - 5], i.toString()]);
        }
        if (list.length == 0) return [[Lang.Blocks.no_target, 'null']];
        return list;
    },
    dcList: function() {
        var list = [];
        var portData = Entry.hw.portData;
        for (var i = 5; i < 9; i++) {
            var data = portData[i];
            if (data && data.type === 'DC') list.push(['ABCD'[i - 5], i.toString()]);
        }
        if (list.length == 0) return [[Lang.Blocks.no_target, 'null']];
        return list;
    },
    /**
     * 엔트리가 중지 되면 호출된다.
     */
    setZero: function() {
        let sq = Entry.hw.sendQueue;
        for (let port in Entry.Coalaboard.PORT_MAP) {
            let portData = Entry.hw.portData[port];
            if (portData != null) {
                if (portData.type == Entry.Coalaboard.SENSOR_MAP[18]) {
                    // DC모터 인 경우, 129로 세팅하여 바로 멈추기
                    sq[port] = 129;
                } else {
                    sq[port] = 0;
                }
            } else {
                sq[port] = 0;
            }
        }
        Entry.hw.update();
    },
    id: '3.3',
    name: 'coalaboard',
    url: 'http://www.bitbrick.cc/',
    imageName: 'coalaboard.png',
    title: {
        ko: '코알라보드',
        en: 'coalaboard',
    },
    servoMaxValue: 181,
    servoMinValue: 1,
    dcMaxValue: 100,
    dcMinValue: -100,
    /**
     * 콜백 함수. 계속해서 센서 데이터를 받는다.
     * @param {*} pd
     */
    afterReceive(pd) {
        for (let i = 1; i < 5; i++) {
            // 오직 센서만 받기
            let obj = pd[i]; // ex) null or { type: "touch", value: 1023 }
            if (obj != null) {
                if (obj.type == 'touch' && obj.value == 0) {
                    Entry.engine.fireEvent('coalaboardButtonEventReceive');
                }
                Entry.engine.fireEvent('coalaboardSensorGetValueEventReceive');
            }
        }
    },
    calculateDCMotorValue: function(value) {
        let val = 0;
        if (value > 0) {
            val = Math.floor(value * 0.8 + 16);
        } else if (value < 0) {
            val = Math.ceil(value * 0.8 - 19);
        } else {
            val = 0;
        }
        // DC_MOTOR_ADJUSTMENT  128
        val = 128 + val;
        if (val == 128) {
            val = 129;
        }
        return val;
    },
};

Entry.Coalaboard.monitorTemplate = function() {
    return {
        keys: ['value'],
        imgPath: 'hw/coalaboard.png',
        width: 400,
        height: 400,
        listPorts: {
            UserInput: {
                name: Lang.Blocks.COALABOARD_UserInput,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            potentiometer: {
                name: Lang.Blocks.COALABOARD_potentiometer,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            MIC: {
                name: Lang.Blocks.COALABOARD_MIC,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            IR: {
                name: Lang.Blocks.COALABOARD_IR,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            temperature: {
                name: Lang.Blocks.COALABOARD_temperature,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            light: {
                name: Lang.Blocks.COALABOARD_light,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            touch: {
                name: Lang.Blocks.COALABOARD_touch,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
        },
        mode: 'both',
    };
};

Entry.Coalaboard.blockMenuBlocks = [
    'coalaboard_when_button_pressed',
    'coalaboard_when_sensor_get_value',
    'coalaboard_is_touch_pressed',
    'coalaboard_is_sensor_value_compare',
    'coalaboard_sensor_value',
    'coalaboard_convert_scale',
    'coalaboard_turn_on_color_led_by_rgb',
    'coalaboard_turn_on_color_led_by_picker',
    'coalaboard_turn_on_color_led_by_value',
    'coalaboard_turn_off_color_led',
    'coalaboard_buzzer',
    'coalaboard_servomotor_angle',
    'coalaboard_dc_direction_speed',
    'coalaboard_dc_speed',
    'coalaboard_turn_off_all_motors',
];

Entry.Coalaboard.getBlocks = function() {
    let options_COALABOARD_button2 = [
        [Lang.Blocks.COALABOARD_button_pressed, 'pressed'],
        [Lang.Blocks.COALABOARD_button_released, 'released'],
    ];
    return {
        //region coalaboard 코알라보드
        coalaboard_when_button_pressed: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_event',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
                {
                    type: 'DropdownDynamic',
                    value: null,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    menuName: Entry.Coalaboard.touchList,
                },
            ],
            events: {},
            def: {
                params: [null, null],
                type: 'coalaboard_when_button_pressed',
            },
            paramsKeyMap: {
                DUMMY: 0,
                PORT: 1,
            },
            class: 'event',
            isNotFor: ['coalaboard'],
            event: 'coalaboardButtonEventReceive',
            func: function(sprite, script) {
                let selectedSensor = script.values[1];
                let port = script.getStringField('PORT');
                let type = Entry.hw.portData[port].type;
                let val = Entry.hw.portData[port].value; // 0이면 누름, 1023이면 누르지 않음
                if (selectedSensor == port) {
                    if (val == 0) {
                        return script.callReturn();
                    } else {
                        return this.die();
                    }
                } else {
                    return this.die();
                }
            },
            syntax: { js: [], py: ['Coalaboard.when_button_pressed(%2, %3)'] },
        },
        coalaboard_when_sensor_get_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_event',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
                {
                    type: 'DropdownDynamic',
                    value: null,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    menuName: Entry.Coalaboard.sensorList,
                },
                {
                    type: 'Dropdown',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    options: Entry.Coalaboard.INEQ_SIGN,
                    value: '>',
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
                    null,
                    null,
                    {
                        type: 'text',
                        params: ['100'],
                    },
                ],
                type: 'coalaboard_when_sensor_get_value',
            },
            paramsKeyMap: {
                DUMMY: 0,
                PORT: 1,
                INEQ_SIGN: 2,
                VALUE: 3,
            },
            class: 'event',
            isNotFor: ['coalaboard'],
            event: 'coalaboardSensorGetValueEventReceive',
            func: function(sprite, script) {
                let selectedPort = script.values[1];
                let ineqSign = script.values[2];
                let value = script.values[3];
                let port = script.getStringField('PORT');
                let val = Entry.hw.portData[port].value;
                if (selectedPort == port && ineqSign == '<' && val < value) {
                    return script.callReturn();
                } else if (selectedPort == port && ineqSign == '>' && val > value) {
                    return script.callReturn();
                } else if (selectedPort == port && ineqSign == '=' && val == value) {
                    return script.callReturn();
                } else {
                    return this.die();
                }
            },
            syntax: { js: [], py: ['Coalaboard.when_sensor_get_value(%2,%3,%4)'] },
        },
        coalaboard_sensor_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'DropdownDynamic',
                    value: null,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    menuName: Entry.Coalaboard.sensorList,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'coalaboard_sensor_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'button',
            isNotFor: ['coalaboard'],
            func: function(sprite, script) {
                var port = script.getStringField('PORT');
                return Entry.hw.portData[port].value;
            },
            syntax: { js: [], py: ['Coalaboard.sensor_value(%1)'] },
        },
        coalaboard_convert_scale: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'DropdownDynamic',
                    value: null,
                    fontSize: 11,
                    menuName: Entry.Coalaboard.sensorList,
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
                type: 'coalaboard_convert_scale',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE2: 1,
                VALUE3: 2,
                VALUE4: 3,
                VALUE5: 4,
            },
            class: 'button',
            isNotFor: ['coalaboard'],
            func: function(sprite, script) {
                var port = script.getNumberField('PORT');
                var value1 = Entry.hw.portData[port].value;
                var value2 = script.getNumberValue('VALUE2', script);
                var value3 = script.getNumberValue('VALUE3', script);
                var value4 = script.getNumberValue('VALUE4', script);
                var value5 = script.getNumberValue('VALUE5', script);
                var result = value1;

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
                return Math.round(result);
            },
            syntax: {
                js: [],
                py: ['Coalaboard.convert_scale(%1, %2, %3, %4, %5)'],
            },
        },
        coalaboard_is_touch_pressed: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'DropdownDynamic',
                    value: null,
                    fontSize: 11,
                    menuName: Entry.Coalaboard.touchList,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: options_COALABOARD_button2,
                    value: 'pressed',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null, null],
                type: 'coalaboard_is_touch_pressed',
            },
            paramsKeyMap: {
                PORT: 0,
                PRESSED: 1,
            },
            class: 'button',
            isNotFor: ['coalaboard'],
            func: function(sprite, script) {
                let port = script.getStringField('PORT');
                let val = Entry.hw.portData[port].value;
                let pressed = script.getStringField('PRESSED');
                if (pressed == 'pressed' && val == 0) {
                    return true;
                } else if (pressed == 'released' && val == 1023) {
                    return true;
                } else {
                    return false;
                }
            },
            syntax: { js: [], py: ['Coalaboard.is_touch_pressed(%1, %2)'] },
        },
        coalaboard_is_sensor_value_compare: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'DropdownDynamic',
                    value: null,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    menuName: Entry.Coalaboard.sensorList,
                },
                {
                    type: 'Dropdown',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    options: Entry.Coalaboard.INEQ_SIGN,
                    value: '>',
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
                    null,
                    {
                        type: 'text',
                        params: ['100'],
                    },
                ],
                type: 'coalaboard_is_sensor_value_compare',
            },
            paramsKeyMap: {
                PORT: 0,
                INEQ_SIGN: 1,
                VALUE: 2,
            },
            class: 'button',
            isNotFor: ['coalaboard'],
            func: function(sprite, script) {
                let selectedPort = script.values[0];
                let ineqSign = script.values[1];
                let value = script.values[2];
                let port = script.getStringField('PORT');
                let val = Entry.hw.portData[port].value;
                if (selectedPort == port && ineqSign == '<' && val < value) {
                    return true;
                } else if (selectedPort == port && ineqSign == '>' && val > value) {
                    return true;
                } else if (selectedPort == port && ineqSign == '=' && val == value) {
                    return true;
                } else {
                    return false;
                }
            },
            syntax: { js: [], py: ['Bitbrick.is_sensor_value_compare(%1,%2,%3)'] },
        },
        coalaboard_turn_off_color_led: {
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
                type: 'coalaboard_turn_off_color_led',
                id: 'i3je',
            },
            class: 'led',
            isNotFor: ['coalaboard'],
            func: function(sprite, script) {
                Entry.hw.sendQueue['LEDR'] = 0;
                Entry.hw.sendQueue['LEDG'] = 0;
                Entry.hw.sendQueue['LEDB'] = 0;
                return script.callReturn();
            },
            syntax: { js: [], py: ['Coalaboard.turn_off_color_led()'] },
        },
        coalaboard_turn_on_color_led_by_rgb: {
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
                        params: ['255'],
                    },
                    {
                        type: 'text',
                        params: ['255'],
                    },
                    {
                        type: 'text',
                        params: ['255'],
                    },
                    null,
                ],
                type: 'coalaboard_turn_on_color_led_by_rgb',
            },
            paramsKeyMap: {
                rValue: 0,
                gValue: 1,
                bValue: 2,
            },
            class: 'led',
            isNotFor: ['coalaboard'],
            func: function(sprite, script) {
                var red = script.getNumberValue('rValue'),
                    green = script.getNumberValue('gValue'),
                    blue = script.getNumberValue('bValue'),
                    min = 0,
                    max = 255,
                    adjustor = Entry.adjustValueWithMaxMin,
                    sq = Entry.hw.sendQueue;

                sq['LEDR'] = adjustor(red, min, max);
                sq['LEDG'] = adjustor(green, min, max);
                sq['LEDB'] = adjustor(blue, min, max);
                return script.callReturn();
            },
            syntax: { js: [], py: ['Coalaboard.color_led_by_rgb(%1, %2, %3)'] },
        },
        coalaboard_turn_on_color_led_by_picker: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
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
                params: [null],
                type: 'coalaboard_turn_on_color_led_by_picker',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'led',
            isNotFor: ['coalaboard'],
            func: function(sprite, script) {
                var port = script.getStringField('VALUE');
                Entry.hw.sendQueue['LEDR'] = parseInt(port.substr(1, 2), 16);
                Entry.hw.sendQueue['LEDG'] = parseInt(port.substr(3, 2), 16);
                Entry.hw.sendQueue['LEDB'] = parseInt(port.substr(5, 2), 16);
                return script.callReturn();
            },
            syntax: { js: [], py: ['Coalaboard.color_led_by_picker(%1)'] },
        },
        coalaboard_turn_on_color_led_by_value: {
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
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'coalaboard_turn_on_color_led_by_value',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'led',
            isNotFor: ['coalaboard'],
            func: function(sprite, script) {
                var value = script.getNumberValue('VALUE');
                var red, green, blue;
                value = value % 200;
                if (value < 67) {
                    red = 200 - value * 3;
                    green = value * 3;
                    blue = 0;
                } else if (value < 134) {
                    value = value - 67;
                    red = 0;
                    green = 200 - value * 3;
                    blue = value * 3;
                } else if (value < 201) {
                    value = value - 134;
                    red = value * 3;
                    green = 0;
                    blue = 200 - value * 3;
                }
                Entry.hw.sendQueue['LEDR'] = red;
                Entry.hw.sendQueue['LEDG'] = green;
                Entry.hw.sendQueue['LEDB'] = blue;
                return script.callReturn();
            },
            syntax: { js: [], py: ['Coalaboard.color_led_by_value(%1)'] },
        },
        coalaboard_buzzer: {
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
                        type: 'text',
                        params: ['60'],
                    },
                    null,
                ],
                type: 'coalaboard_buzzer',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'buzzer',
            isNotFor: ['coalaboard'],
            func: function(sprite, script) {
                if (!script.isStart) {
                    var value = script.getNumberValue('VALUE');
                    Entry.hw.sendQueue['buzzer'] = value;
                    script.isStart = true;
                    return script;
                } else {
                    Entry.hw.sendQueue['buzzer'] = 0;
                    delete script.isStart;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: ['Coalaboard.buzzer(%1)'] },
        },
        coalaboard_turn_off_all_motors: {
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
                type: 'coalaboard_turn_off_all_motors',
            },
            class: 'motor',
            isNotFor: ['coalaboard'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var coalaboard = Entry.Coalaboard;
                coalaboard.servoList().map(function(servo) {
                    sq[servo[1]] = 0;
                });
                coalaboard.dcList().map(function(dc) {
                    sq[dc[1]] = 129;
                });
                return script.callReturn();
            },
            syntax: { js: [], py: ['Coalaboard.turn_off_all_motors()'] },
        },
        coalaboard_dc_speed: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'DropdownDynamic',
                    value: null,
                    fontSize: 11,
                    menuName: Entry.Coalaboard.dcList,
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
                type: 'coalaboard_dc_speed',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'motor',
            isNotFor: ['coalaboard'],
            func: function(sprite, script) {
                var value = script.getNumberValue('VALUE');
                value = Math.min(value, Entry.Coalaboard.dcMaxValue);
                value = Math.max(value, Entry.Coalaboard.dcMinValue);
                let val = Entry.Coalaboard.calculateDCMotorValue(value);
                Entry.hw.sendQueue[script.getStringField('PORT')] = val;
                return script.callReturn();
            },
            syntax: { js: [], py: ['Coalaboard.dc_speed(%1, %2)'] },
        },
        coalaboard_dc_direction_speed: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'DropdownDynamic',
                    value: null,
                    fontSize: 11,
                    menuName: Entry.Coalaboard.dcList,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.COALABOARD_dc_direction_cw, 'CW'],
                        [Lang.Blocks.COALABOARD_dc_direction_ccw, 'CCW'],
                    ],
                    value: 'CW',
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
                    null,
                    {
                        type: 'text',
                        params: ['100'],
                    },
                    null,
                ],
                type: 'coalaboard_dc_direction_speed',
            },
            paramsKeyMap: {
                PORT: 0,
                DIRECTION: 1,
                VALUE: 2,
            },
            class: 'motor',
            isNotFor: ['coalaboard'],
            func: function(sprite, script) {
                let isFront = script.getStringField('DIRECTION') === 'CW';
                let value = script.getNumberValue('VALUE');
                value = Math.min(value, Entry.Coalaboard.dcMaxValue);
                value = Math.max(value, 0);
                if (!isFront) {
                    value = -1 * value;
                }
                let val = Entry.Coalaboard.calculateDCMotorValue(value);
                Entry.hw.sendQueue[script.getStringField('PORT')] = val;
                return script.callReturn();
            },
            syntax: { js: [], py: ['Coalaboard.dc_direction_speed(%1, %2, %3)'] },
        },
        coalaboard_servomotor_angle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'DropdownDynamic',
                    value: null,
                    fontSize: 11,
                    menuName: Entry.Coalaboard.servoList,
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
                        params: ['0'],
                    },
                    null,
                ],
                type: 'coalaboard_servomotor_angle',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'motor',
            isNotFor: ['coalaboard'],
            func: function(sprite, script) {
                var value = Entry.Coalaboard.servoMaxValue - (script.getNumberValue('VALUE') + 1);
                value = Math.min(value, Entry.Coalaboard.servoMaxValue);
                value = Math.max(value, Entry.Coalaboard.servoMinValue);
                Entry.hw.sendQueue[script.getStringField('PORT')] = value;
                return script.callReturn();
            },
            syntax: { js: [], py: ['Coalaboard.servomotor_angle(%1, %2)'] },
        },
        //endregion coalaboard 코알라보드
    };
};
// 언어 적용
Entry.Coalaboard.setLanguage = function() {
    return {
        ko: {
            // ko.js에 작성하던 내용
            template: {
                coalaboard_when_button_pressed: '%1 버튼 %2 눌러졌을 때',
                coalaboard_when_sensor_get_value: '%1 %2 값 %3 %4 일 때',
                coalaboard_is_touch_pressed: '버튼 %1 이(가) %2 인가?',
                coalaboard_is_sensor_value_compare: '%1 값 %2 %3 인가?',
                coalaboard_sensor_value: '%1 값',
                coalaboard_convert_scale: '변환 %1 값 %2 ~ %3 에서 %4 ~ %5',
                coalaboard_turn_on_color_led_by_rgb:
                    '엘이디를 빨강 %1 초록 %2 파랑 %3 %4 (으)로 켜기',
                coalaboard_turn_on_color_led_by_picker: '엘이디를 %1 (으)로 켜기 %2',
                coalaboard_turn_on_color_led_by_value: '엘이디를 %1 (으)로 켜기 %2',
                coalaboard_turn_off_color_led: '엘이디 끄기 %1',
                coalaboard_buzzer: '버저음 %1 내기 %2',
                coalaboard_servomotor_angle: '서보모터 %1 각도 %2 %3',
                coalaboard_dc_direction_speed: '디씨모터 %1 방향 %2 속력 %3 %4',
                coalaboard_dc_speed: '디씨모터 %1 속도 %2 %3',
                coalaboard_turn_off_all_motors: '모든 모터 멈추기 %1',
            },
            Blocks: {
                COALABOARD_button_pressed: '누름',
                COALABOARD_button_released: '누르지 않음',
                COALABOARD_light: '밝기 센서',
                COALABOARD_IR: '적외선 센서',
                COALABOARD_touch: '버튼',
                COALABOARD_temperature: '온도 센서',
                COALABOARD_ultrasonicSensor: '초음파 센서',
                COALABOARD_vibrationSensor: '진동 센서',
                COALABOARD_potentiometer: '가변저항',
                COALABOARD_MIC: '소리 센서',
                COALABOARD_UserSensor: '사용자 입력',
                COALABOARD_UserInput: '사용자 입력',
                COALABOARD_dc_direction_ccw: '반시계',
                COALABOARD_dc_direction_cw: '시계',
            },
            Menus: {
                coalaboard: '코알라보드',
            },
            Device: {
                coalaboard: '코알라보드',
            },
            Helper: {
                coalaboard_when_button_pressed:
                    '비트브릭 버튼을 누르면 아래에 연결된 블록들을 실행합니다.',
                coalaboard_when_sensor_get_value:
                    '비트브릭 센서의 값과 오른쪽에 입력한 값을 비교합니다.\n< : 센서 값이 오른쪽에 위치한 값보다 작은 경우 ‘참’으로 판단합니다.\n> : 센서 값이 오른쪽에 위치한 값보다 큰 경우 ‘참으로 판단합니다.\n= :  센서 값이 오른쪽에 위치한 값과 같은 경우 ‘참으로 판단합니다.',
                coalaboard_sensor_value:
                    '비트브릭 센서를 사용할 수 있는 블록입니다. 센서값의 범위는 0 ~1023입니다. 메인보드에 연결된 센서의 종류와 포트번호를 자동으로 인식합니다. 블록 안의 화살표를 눌러 사용하려고 하는 센서를 선택하세요.',
                coalaboard_convert_scale: '비트브릭 센서의 값의 범위를 바꿀 수 있습니다.',
                coalaboard_is_touch_pressed:
                    '비트브릭 센서 중 버튼을 눌렀을 경우 ‘참’으로 판단합니다.',
                coalaboard_turn_off_color_led: '비트브릭 엘이디를 끕니다.',
                coalaboard_turn_on_color_led_by_rgb:
                    '비트브릭 엘이디를 빛의 삼원색인 빨강,초록,파랑을 혼합하여 켭니다. 값의 범위는 0 ~ 255입니다.',
                coalaboard_turn_on_color_led_by_picker:
                    '비트브릭 엘이디를 색상 창을 사용해 켭니다.',
                coalaboard_turn_on_color_led_by_value:
                    '비트브릭 엘이디를 색상 값으로 켭니다. 값의 범위는 0 ~ 199입니다.',
                coalaboard_buzzer:
                    '비트브릭 버저를 사용하여 소리를 냅니다. 값의 범위는 0 ~ 96입니다. 값이 0일 때는 버저 소리를 끕니다.',
                coalaboard_turn_off_all_motors: '비트브릭 모터를 모두 끕니다.',
                coalaboard_dc_speed:
                    '비트브릭 디씨모터의 속도를 제어합니다. 속도 값의 범위는 –100 ~ 100입니다. 음수(-)일 때는 반시계방향으로 회전합니다. 양수(+)일 때는 시계방향으로 회전합니다. 속도가 0일 때는 회전을 멈춥니다.',
                coalaboard_dc_direction_speed:
                    '비트브릭 디씨모터의 방향과 속력을 제어합니다. 방향은 시계방향과 반시계방향을 선택할 수 있습니다. 속력 값의 범위는 0 ~ 100입니다. 속력이 0일 때는 회전을 멈춥니다.',
                coalaboard_servomotor_angle:
                    '비트브릭 서보모터의 각도를 제어합니다. 각도 값의 범위는 0 ~ 180입니다.',
            },
        },
        en: {
            // en.js에 작성하던 내용
            template: {
                coalaboard_when_button_pressed: '%1 when button %2',
                coalaboard_when_sensor_get_value: '%1 when %2 value %3 %4',
                coalaboard_is_touch_pressed: 'button %1 %2?',
                coalaboard_is_sensor_value_compare: '%1 %2 %3? ',
                coalaboard_sensor_value: '%1 value',
                coalaboard_convert_scale: 'map %1 value from %2 ~ %3 to %4 ~ %5',
                coalaboard_turn_on_color_led_by_rgb: 'set LED color to Red %1 Green %2 Blue %3 %4',
                coalaboard_turn_on_color_led_by_picker: 'set LED color to %1 %2',
                coalaboard_turn_on_color_led_by_value: 'set LED color %1 %2',
                coalaboard_turn_off_color_led: 'turn off LED %1',
                coalaboard_buzzer: 'buzz note %1 %2',
                coalaboard_servomotor_angle: 'servo motor %1 degree %2 %3',
                coalaboard_dc_direction_speed: 'dc motor %1 direction %2 speed %3 %4',
                coalaboard_dc_speed: 'dc motor %1 velocity %2 %3',
                coalaboard_turn_off_all_motors: 'stop all motors %1',
            },
            Blocks: {
                COALABOARD_button_pressed: 'pressed',
                COALABOARD_button_released: 'released',
                COALABOARD_light: 'light',
                COALABOARD_IR: 'IR',
                COALABOARD_touch: 'touch',
                COALABOARD_temperature: 'temperature',
                COALABOARD_ultrasonicSensor: 'ultrasonicSenso',
                COALABOARD_vibrationSensor: 'vibrationSensor',
                COALABOARD_potentiometer: 'potentiometer',
                COALABOARD_MIC: 'MIC',
                COALABOARD_UserSensor: 'UserSensor',
                COALABOARD_UserInput: 'UserInput',
                COALABOARD_dc_direction_ccw: 'CCW',
                COALABOARD_dc_direction_cw: 'CW',
            },
            Menus: {
                coalaboard: 'coalaboard',
            },
        },
    };
};

module.exports = Entry.Coalaboard;
