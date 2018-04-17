'use strict';

Entry.SmartBoard = {
    name: 'smartBoard',
    url: 'http://www.sciencebox.co.kr',
    imageName: 'smartboard.png',
    title: {
        "ko": "과학상자 코딩보드",
        "en": "Sciencebox Codingboard"
    },
    setZero: function() {
        for (var port = 2; port < 9; port++) {
            Entry.hw.sendQueue[port] = 0;
        }
        Entry.hw.update();
    },
    monitorTemplate: {
        listPorts: {
            '2': {
                name: Lang.Hw.port_en + ' GS2 ',
                type: 'output',
                pos: { x: 0, y: 0 },
            },
            '3': {
                name: Lang.Hw.port_en + ' GS1 ',
                type: 'output',
                pos: { x: 0, y: 0 },
            },
            '4': {
                name: Lang.Hw.port_en + ' MT1 회전 방향 ',
                type: 'output',
                pos: { x: 0, y: 0 },
            },
            '5': {
                name: Lang.Hw.port_en + ' MT1 PWM ',
                type: 'output',
                pos: { x: 0, y: 0 },
            },
            '6': {
                name: Lang.Hw.port_en + ' MT2 PWM ',
                type: 'output',
                pos: { x: 0, y: 0 },
            },
            '7': {
                name: Lang.Hw.port_en + ' MT2 회전 방향 ',
                type: 'output',
                pos: { x: 0, y: 0 },
            },
            '8': {
                name: Lang.Hw.port_en + ' RELAY ',
                type: 'output',
                pos: { x: 0, y: 0 },
            },
            '9': {
                name: Lang.Hw.port_en + ' SM3 각도 ',
                type: 'output',
                pos: { x: 0, y: 0 },
            },
            '10': {
                name: Lang.Hw.port_en + ' SM2 각도 ',
                type: 'output',
                pos: { x: 0, y: 0 },
            },
            '11': {
                name: Lang.Hw.port_en + 'SM1 각도 ',
                type: 'output',
                pos: { x: 0, y: 0 },
            },
            '12': {
                name: Lang.Hw.port_en + ' 빨간 ' + Lang.Hw.button,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '13': {
                name: Lang.Hw.port_en + ' 노란 ' + Lang.Hw.button,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '14': {
                name: Lang.Hw.port_en + ' 초록 ' + Lang.Hw.button,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '15': {
                name: Lang.Hw.port_en + ' 파란 ' + Lang.Hw.button,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            a2: {
                name: Lang.Hw.port_en + ' 1번 ' + Lang.Hw.sensor,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            a3: {
                name: Lang.Hw.port_en + ' 2번 ' + Lang.Hw.sensor,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            a4: {
                name: Lang.Hw.port_en + ' 3번 ' + Lang.Hw.sensor,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            a5: {
                name: Lang.Hw.port_en + ' 4번 ' + Lang.Hw.sensor,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
        },
        mode: 'both',
    },
};

Entry.SmartBoard.getBlocks = function() {
    return {
        //region smartBoard 스마트보드
        smartBoard_get_named_sensor_value: {
            color: '#00979D',
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['SEN1', '2'],
                        ['SEN2', '3'],
                        ['SEN3', '4'],
                        ['SEN4', '5'],
                    ],
                    value: '2',
                    fontSize: 11,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'smartBoard_get_named_sensor_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'smartBoard_sensor',
            isNotFor: ['smartBoard'],
            func: function(sprite, script) {
                return Entry.hw.getAnalogPortValue(
                    script.getField('PORT', script)
                );
            },
        },
        smartBoard_convert_scale: {
            color: '#00979D',
            fontColor: '#fff',
            skeleton: 'basic_string_field',
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
                        type: 'smartBoard_get_named_sensor_value',
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
                type: 'smartBoard_convert_scale',
            },
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
                VALUE3: 2,
                VALUE4: 3,
                VALUE5: 4,
            },
            class: 'smartBoard_sensor',
            isNotFor: ['smartBoard'],
            func: function(sprite, script) {
                var value1 = script.getNumberValue('VALUE1', script);
                var value2 = script.getNumberValue('VALUE2', script);
                var value3 = script.getNumberValue('VALUE3', script);
                var value4 = script.getNumberValue('VALUE4', script);
                var value5 = script.getNumberValue('VALUE5', script);
                var result = value1;
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
                return Math.round(result);
            },
            syntax: {
                js: [],
                py: ['smartBoard.convert_scale(%1, %2, %3, %4, %5)'],
            },
        },
        smartBoard_is_button_pressed: {
            color: '#00979D',
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['빨간', '12'],
                        ['노란', '13'],
                        ['초록', '14'],
                        ['파랑', '15'],
                    ],
                    value: '12',
                    fontSize: 11,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'smartBoard_is_button_pressed',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'smartBoard_button',
            isNotFor: ['smartBoard'],
            func: function(sprite, script) {
                return Entry.hw.getDigitalPortValue(
                    script.getNumberField('PORT', script)
                );
            },
        },
        smartBoard_set_dc_motor_direction: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['MT1', '4'], ['MT2', '7']],
                    value: '4',
                    fontSize: 11,
                },
                {
                    type: 'Dropdown',
                    options: [['정', '0'], ['역', '255']],
                    value: '0',
                    fontSize: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null, null],
                type: 'smartBoard_set_dc_motor_direction',
            },
            paramsKeyMap: {
                PORT: 0,
                OPERATOR: 1,
            },
            class: 'dc_motor',
            isNotFor: ['smartBoard'],
            func: function(sprite, script) {
                Entry.hw.setDigitalPortValue(
                    script.getField('PORT'),
                    script.getNumberField('OPERATOR')
                );
                return script.callReturn();
            },
        },
        smartBoard_set_dc_motor_speed: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['MT1', '5'], ['MT2', '6']],
                    value: '5',
                    fontSize: 11,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['정지 시키기', '0'],
                        ['매우 느린 속도로 돌리기', '70'],
                        ['느린 속도로 돌리기', '115'],
                        ['보통 속도로 돌리기', '160'],
                        ['빠른 속도로 돌리기', '205'],
                        ['매우 빠른 속도로 돌리기', '255'],
                    ],
                    value: '160',
                    fontSize: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null, null, null],
                type: 'smartBoard_set_dc_motor_speed',
            },
            paramsKeyMap: {
                PORT: 0,
                OPERATOR: 1,
            },
            class: 'dc_motor',
            isNotFor: ['smartBoard'],
            func: function(sprite, script) {
                Entry.hw.setDigitalPortValue(
                    script.getField('PORT'),
                    script.getNumberField('OPERATOR')
                );
                return script.callReturn();
            },
        },
        smartBoard_set_dc_motor_pwm: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['MT1', '5'], ['MT2', '6']],
                    value: '5',
                    fontSize: 11,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    {
                        type: 'arduino_text',
                        params: ['255'],
                    },
                    null,
                ],
                type: 'smartBoard_set_dc_motor_pwm',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'dc_motor',
            isNotFor: ['smartBoard'],
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
        smartBoard_set_servo_speed: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['SM3', '9'], ['SM2', '10'], ['SM1', '11']],
                    value: '9',
                    fontSize: 11,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['느린 속도로', '187'],
                        ['보통 속도로', '193'],
                        ['빠른 속도로', '243'],
                    ],
                    value: '193',
                    fontSize: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null, null, null],
                type: 'smartBoard_set_servo_speed',
            },
            paramsKeyMap: {
                PORT: 0,
                OPERATOR: 1,
            },
            class: 'smartBoard_servo_motor',
            isNotFor: ['smartBoard'],
            func: function(sprite, script) {
                Entry.hw.setDigitalPortValue(
                    script.getField('PORT'),
                    script.getNumberField('OPERATOR')
                );
                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, 250);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    return script.callReturn();
                }
            },
        },
        smartBoard_set_servo_angle: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['SM3', '9'], ['SM2', '10'], ['SM1', '11']],
                    value: '9',
                    fontSize: 11,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    {
                        type: 'arduino_text',
                        params: ['180'],
                    },
                    null,
                ],
                type: 'smartBoard_set_servo_angle',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'smartBoard_servo_motor',
            isNotFor: ['smartBoard'],
            func: function(sprite, script) {
                var port = script.getField('PORT');
                var value = script.getNumberValue('VALUE');
                value = Math.round(value);
                value = Math.max(value, 1);
                value = Math.min(value, 180);
                Entry.hw.setDigitalPortValue(port, value);
                return script.callReturn();
            },
        },
        smartBoard_set_number_eight_pin: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['GS1', '3'], ['GS2', '2'], ['RELAY', '8']],
                    value: '3',
                    fontSize: 11,
                },
                {
                    type: 'Dropdown',
                    options: [['끄기', '0'], ['켜기', '255']],
                    value: '0',
                    fontSize: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null, null],
                type: 'smartBoard_set_number_eight_pin',
            },
            paramsKeyMap: {
                PORT: 0,
                OPERATOR: 1,
            },
            class: 'ext',
            isNotFor: ['smartBoard'],
            func: function(sprite, script) {
                Entry.hw.setDigitalPortValue(
                    script.getField('PORT'),
                    script.getNumberField('OPERATOR')
                );
                return script.callReturn();
            },
        },
        smartBoard_set_gs1_pwm: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'arduino_text',
                        params: ['255'],
                    },
                ],
                type: 'smartBoard_set_gs1_pwm',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'ext',
            isNotFor: ['smartBoard'],
            func: function(sprite, script) {
                var port = 3;
                var value = script.getNumberValue('VALUE');
                value = Math.round(value);
                value = Math.max(value, 0);
                value = Math.min(value, 255);
                Entry.hw.setDigitalPortValue(port, value);
                return script.callReturn();
            },
        },
        //endregion smartBoard 스마트보드
    };
};
