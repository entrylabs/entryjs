'use strict';

Entry.SmartBoard = {
    id: 'A.1',
    name: 'smartBoard',
    url: 'http://www.sciencebox.co.kr',
    imageName: 'smartboard.png',
    title: {
        ko: '과학상자 코딩보드',
        en: 'Sciencebox Codingboard',
        vn: 'Sciencebox Codingboard'
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
                name: ' GS2 ',
                type: 'output',
                pos: { x: 0, y: 0 },
            },
            '3': {
                name: ' GS1 ',
                type: 'output',
                pos: { x: 0, y: 0 },
            },
            '4': {
                name: ' MT1 direction',
                type: 'output',
                pos: { x: 0, y: 0 },
            },
            '5': {
                name: ' MT1 PWM ',
                type: 'output',
                pos: { x: 0, y: 0 },
            },
            '6': {
                name: ' MT2 PWM ',
                type: 'output',
                pos: { x: 0, y: 0 },
            },
            '7': {
                name: ' MT2 direction ',
                type: 'output',
                pos: { x: 0, y: 0 },
            },
            '8': {
                name: ' RELAY ',
                type: 'output',
                pos: { x: 0, y: 0 },
            },
            '9': {
                name: ' SM3 angle ',
                type: 'output',
                pos: { x: 0, y: 0 },
            },
            '10': {
                name: ' SM2 angle ',
                type: 'output',
                pos: { x: 0, y: 0 },
            },
            '11': {
                name: ' SM1 angle ',
                type: 'output',
                pos: { x: 0, y: 0 },
            },
            '12': {
                name: ' RED button ',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '13': {
                name: ' YELLOW button ',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '14': {
                name: ' GREEN button ',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '15': {
                name: ' BLUE button ',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            a2: {
                name: ' SENSOR 1 ',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            a3: {
                name: ' SENSOR 2 ',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            a4: {
                name: ' SENSOR 3 ',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            a5: {
                name: ' SENSOR 4 ',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            a0: {
                name: ' SENSOR 5 ',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            a1: {
                name: ' SENSOR 6 ',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            a6: {
                name: ' SENSOR 7 ',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            a7: {
                name: ' SENSOR 8 ',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
        },
        mode: 'both',
    },
};

Entry.SmartBoard.setLanguage = function() {
    return {
        en: {
            Blocks: {
              MT1direction: 'MT1 Direction of rotation',
              MT2direction: 'MT2 Direction of rotation',
              SM3angle: 'SM3 angle',
              SM2angle: 'SM2 angle',
              SM13angle: 'SM1 angle',
              Red: 'Red',
              Yellow: 'Yellow',
              Green: 'Green',
              Blue: 'Blue',
              One: 'Number 1',
              Two: 'Number 2',
              Three: 'Number 3',
              Four: 'Number 4',
              Five: 'Number 5',
              Six: 'Number 6',
              Seven: 'Number 7',
              Eight: 'Number 8',
              Clockwise: 'Forward',
              Counterclockwise: 'Backward',
              Stopmotor: 'Stop',
              Slowermotor: 'Very slow',
              Slowmotor: 'Slow',
              Normalmotor: 'Normal',
              Fastmotor: 'Fast',
              Fastermotor: 'Very fast',
              Slowservo: 'Slow',
              Normalservo: 'Normal',
              Fastservo: 'Fast',
              On: 'On',
              Off: 'Off',
            },
            template: {
              smartBoard_convert_scale: "Map Value %1 %2 ~ %3 to %4 ~ %5",
              smartBoard_get_named_sensor_value: "%1 Sensor value",
              smartBoard_is_button_pressed: "Pressed %1 button?",
              smartBoard_set_dc_motor_direction: "%1 DC Motor direction %2 %3",
              smartBoard_set_dc_motor_speed: "%1 DC Motor Speed %2 %3",
              smartBoard_set_dc_motor_pwm: "%1 DC Motor set speed %2 %3",
              smartBoard_set_servo_speed: "%1 RC Servo Motor Speed %2 %3",
              smartBoard_set_servo_angle: "%1 RC Servo Motor set angle %2 %3",
              smartBoard_set_number_eight_pin: "%1 port %2 %3",
              smartBoard_set_gs1_pwm: "Set PWM port of GS1 port %1 %2",
            },
        },
        ko: {
            Blocks: {
              MT1direction: 'MT1 회전 방향',
              MT2direction: 'MT2 회전 방향',
              SM3angle: 'SM3 각도',
              SM2angle: 'SM2 각도',
              SM13angle: 'SM1 각도',
              Red: '빨간',
              Yellow: '노란',
              Green: '초록',
              Blue: '파란',
              One: '1번',
              Two: '2번',
              Three: '3번',
              Four: '4번',
              Five: '5번',
              Six: '6번',
              Seven: '7번',
              Eight: '8번',
              Clockwise: '정',
              Counterclockwise: '역',
              Stopmotor: '정지 시키기',
              Slowermotor: '매우 느린 속도로 돌리기',
              Slowmotor: '느린 속도로 돌리기',
              Normalmotor: '보통 속도로 돌리기',
              Fastmotor: '빠른 속도로 돌리기',
              Fastermotor: '매우 빠른 속도로 돌리기',
              Slowservo: '느린 속도로',
              Normalservo: '보통 속도로',
              Fastservo: '빠른 속도로',
              On: '켜기',
              Off: '끄기',
            },
            template: {
              smartBoard_convert_scale: "%1 값의 범위를 %2 ~ %3 에서 %4 ~ %5 (으)로 바꾼값",
              smartBoard_get_named_sensor_value: "%1 센서값",
              smartBoard_is_button_pressed: "%1 버튼을 눌렀는가?",
              smartBoard_set_dc_motor_direction: "%1 DC 모터를 %2 방향으로 정하기 %3",
              smartBoard_set_dc_motor_speed: "%1 DC모터를 %2 %3",
              smartBoard_set_dc_motor_pwm: "%1 DC모터를 %2 속도로 돌리기 %3",
              smartBoard_set_servo_speed: "%1 번 서보모터의 속도를 %2 %3",
              smartBoard_set_servo_angle: "%1 번 서보모터를 %2 도 로 움직이기 %3",
              smartBoard_set_number_eight_pin: "%1 포트를 %2 %3",
              smartBoard_set_gs1_pwm: "GS1 포트의 PWM을 %1 로 정하기 %2",
            },
        },
        vn: {
            Blocks: {
              MT1direction: 'Hướng quay tròn MT1',
              MT2direction: 'Hướng quay tròn MT1',
              SM3angle: 'Góc độ SM3',
              SM2angle: 'Góc độ SM2',
              SM13angle: 'Góc độ SM1',
              Red: 'Đỏ',
              Yellow: 'Vàng',
              Green: 'Xanh lá cây',
              Blue: 'Xanh da trời',
              One: '1 lần',
              Two: '2 lần',
              Three: '3 lần',
              Four: '4 lần',
              Five: '5 lần',
              Six: '6 lần',
              Seven: '7 lần',
              Eight: '8 lần',
              Clockwise: 'Thuận',
              Counterclockwise: 'Ngược',
              Stopmotor: 'Ngừng lại',
              Slowermotor: 'Quay với tốc độ rất chậm',
              Slowmotor: 'Quay với tốc độ chậm',
              Normalmotor: 'Quay với tốc độ thường',
              Fastmotor: 'Quay với tốc độ nhanh',
              Fastermotor: 'Quay với tốc độ rất nhanh',
              Slowservo: 'với tốc độ chậm',
              Normalservo: 'với tốc độ thường',
              Fastservo: 'với tốc độ nhanh',
              On: 'Tắt',
              Off: 'Mở',
            },
            template: {
              smartBoard_convert_scale: "Phạm vi của giá trị %1 đã thay đổi từ %2 ~ %3 thành %4 ~ %5",
              smartBoard_get_named_sensor_value: "%1 Giá trị cảm biến",
              smartBoard_is_button_pressed: "Bạn đã nhấn chọn %1?",
              smartBoard_set_dc_motor_direction: "Chỉnh Mô tơ DC %1 theo hướng %2 %3",
              smartBoard_set_dc_motor_speed: "%2 mô tơ DC %1 %3",
              smartBoard_set_dc_motor_pwm: "Quay Mô tơ DC %1 với tốc độ %2 %3",
              smartBoard_set_servo_speed: "%1 tốc độ của Mô tơ Servo %2 %3",
              smartBoard_set_servo_angle: "Di chuyển Mô tơ Servo %1 theo hướng %2 độ %3",
              smartBoard_set_number_eight_pin: "%2 cổng %1 %3",
              smartBoard_set_gs1_pwm: "Chỉnh PWM của cổng GS1 thành %1 %2",
            },
        },
    };
};

Entry.SmartBoard.blockMenuBlocks = [
    //jeil science smartBoard. 2016-11-03
    //smartBoard
    'smartBoard_get_named_sensor_value',
    'smartBoard_convert_scale',
    'smartBoard_is_button_pressed',
    'smartBoard_set_dc_motor_direction',
    'smartBoard_set_dc_motor_speed',
    'smartBoard_set_dc_motor_pwm',
    'smartBoard_set_servo_speed',
    'smartBoard_set_servo_angle',
    'smartBoard_set_number_eight_pin',
    'smartBoard_set_gs1_pwm',
];

Entry.SmartBoard.getBlocks = function() {
    return {
        //region smartBoard 스마트보드
        smartBoard_get_named_sensor_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
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
                        ['SEN5', '0'],
                        ['SEN6', '1'],
                        ['SEN7', '6'],
                        ['SEN8', '7'],
                    ],
                    value: '2',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                return Entry.hw.getAnalogPortValue(script.getField('PORT', script));
            },
        },
        smartBoard_convert_scale: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
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
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [[Lang.Blocks.Red, '12'], [Lang.Blocks.Yellow, '13'], [Lang.Blocks.Green, '14'], [Lang.Blocks.Blue, '15']],
                    value: '12',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                return Entry.hw.getDigitalPortValue(script.getNumberField('PORT', script));
            },
        },
        smartBoard_set_dc_motor_direction: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['MT1', '4'], ['MT2', '7']],
                    value: '4',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [[Lang.Blocks.Clockwise, '0'], [Lang.Blocks.Counterclockwise, '255']],
                    value: '0',
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
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['MT1', '5'], ['MT2', '6']],
                    value: '5',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.Stopmotor, '0'],
                        [Lang.Blocks.Slowermotor, '70'],
                        [Lang.Blocks.Slowmotor, '115'],
                        [Lang.Blocks.Normalmotor, '160'],
                        [Lang.Blocks.Fastmotor, '205'],
                        [Lang.Blocks.Fastermotor, '255'],
                    ],
                    value: '160',
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
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['MT1', '5'], ['MT2', '6']],
                    value: '5',
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
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['SM3', '9'], ['SM2', '10'], ['SM1', '11']],
                    value: '9',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.Slowservo, '187'],
                        [Lang.Blocks.Normalservo, '193'],
                        [Lang.Blocks.Fastservo, '243'],
                    ],
                    value: '193',
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
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['SM3', '9'], ['SM2', '10'], ['SM1', '11']],
                    value: '9',
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
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['GS1', '3'], ['GS2', '2'], ['RELAY', '8']],
                    value: '3',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [[Lang.Blocks.On, '0'], [Lang.Blocks.Off, '255']],
                    value: '0',
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

module.exports = Entry.SmartBoard;
