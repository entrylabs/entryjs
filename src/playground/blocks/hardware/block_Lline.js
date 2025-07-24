'use strict';

Entry.Lline = {
    id: '6C.1',
    name: 'Lline',
    url: 'https://Lline.co.kr/',
    imageName: 'Lline.png',
    title: {
        ko: '엘라인',
        en: 'Lline',
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
        METRIX: 9, //점찍는거
        // 10은 비어있음
        METRIXCLEAR: 11,
        METRIXROWCOLCLEAR: 12,
        METRIXDRAW: 13,
        NEOPIXEL: 14,
        NEOPIXELCLEAR: 15,
        NEOPIXELINIT: 16,
        NEOPIXELRAINBOW: 17,
        NEOPIXELEACH: 18,

        LCDINIT: 19,
        LCD_BACKLIGHT:20,
        LCD: 21,
        LCDCLEAR: 22,


        TEMPCHECK: 23,
        HUMICHECK: 24,
    
        // Stepper Motor 관련 추가
        STEPPER_INIT: 25,       // steps & pin 설정
        STEPPER_SPEED: 26,      // 속도 설정
        STEPPER_STEP: 27,       // 회전
        STEPPER_STOP: 28,        // 정지

        IR: 29,  // 적외선센서
        
        COLOR_SENSOR_INIT: 30,
        COLOR_SENSOR: 31,
        
        DC_MOTOR_INIT: 32,
        DC_MOTOR_CONTROL: 33,
        
        DC_MOTOR_INIT2: 40,
        DC_MOTOR_CONTROL2: 41,


        HC06_INIT: 34,
        HC06_SEND: 35,
        HC06_RECEIVE: 36,


        HM10_INIT: 37,
        HM10_SEND: 38,
        HM10_RECEIVE: 39,


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

Entry.Lline.setLanguage = function() {

    return {
        ko: {
            template: {
                arduino_Lline_get_analog_value: '아날로그 %1 번 센서값',
                arduino_Lline_get_analog_value_map: '%1 의 범위를 %2 ~ %3 에서 %4 ~ %5 로 바꾼값',
                arduino_Lline_get_ultrasonic_value: '울트라소닉 Trig %1 Echo %2 센서값',
                arduino_Lline_toggle_led: '디지털 %1 번 핀 %2 %3',
                arduino_Lline_digital_pwm: '디지털 %1 번 핀을 %2 (으)로 정하기 %3',
                arduino_Lline_set_tone: '디지털 %1 번 핀의 버저를 %2 %3 음으로 %4 초 연주하기 %5',
                arduino_Lline_set_servo: '디지털 %1 번 핀의 서보모터를 %2 의 각도로 정하기 %3',
                arduino_Lline_get_digital: '디지털 %1 번 센서값',

                arduino_Lline_get_temp: '온습도 센서 %1 온도 값 ',
                arduino_Lline_get_humi: '온습도 센서 %1 습도 값 ',

                arduino_Lline_set_neopixel_init: '네오픽셀 설정 (%1 핀) led %2 개를 %3 밝기로 설정하기 %4',
                arduino_Lline_set_neopixel: '네오픽셀 (%1 핀) RGB ( %2, %3, %4) %5',
                arduino_Lline_set_neopixel_each: '네오픽셀(%1 핀) LED (%2 번 쨰) RGB ( %3, %4, %5) %6',
                arduino_Lline_set_neopixel_rainbow: '무지개 표현하기 (%1 핀)',
                arduino_Lline_set_neopixel_clear: '네오픽셀 지우기 (%1 핀) %2',

                arduino_Lline_set_metrix: '도트매트릭스 그리기 (열 %1 - 행 %2) %3',
                arduino_Lline_set_metrix_draw: '도트매트릭스 그리기 %1 %2',
                arduino_Lline_set_metrix_rowcol_clear: '도트매트릭스 지우기 (열 %1 - 행 %2) %3',
                arduino_Lline_set_metrix_clear: '도트매트릭스 전체 지우기 %1',

                arduino_Lline_set_lcd_init: 'I2C LCD 초기화 (주소 %1, 열: 16, 행: 2) %2',
                arduino_Lline_lcd_backlight: 'LCD 백라이트 %1 ',
                arduino_Lline_lcd_row_col: 'LCD %1 행 %2 열 부터 "%3" 출력 %4',
                arduino_Lline_lcd_clear: 'LCD 화면 지우기 %1',


                 // 스텝모터 관련
                arduino_Lline_stepper_init: '스텝모터 핀 steps/rev: %1 PIN1: %2 PIN2: %3 PIN3: %4 PIN4: %5 설정',
                arduino_Lline_stepper_speed: '스텝모터 속도 %1 rpm 설정 %2',
                arduino_Lline_stepper_step: '스텝모터 %1 스텝 회전 %2',
                arduino_Lline_stepper_stop: '스텝모터 정지 %1',

                arduino_Lline_get_ir_value: '적외선 센서 %1 센서값',

                arduino_Lline_init_color_sensor: '컬러 센서 초기화 (S0: %1, S1: %2, S2: %3, S3: %4, OUT: %5, LED: %6)',
                arduino_Lline_get_color_rgb: '컬러 센서에서 %1 값 읽기',
                

                //블루투스 HM10
                arduino_Lline_hm10_init: 'HM-10 연결 설정 TX: %1 RX: %2',
                arduino_Lline_hm10_send: 'HM-10 데이터 보내기 %1',
                arduino_Lline_hm10_receive: 'HM-10 수신 데이터',

                arduino_Lline_hc06_init: 'HC-06 연결 설정 TX: %1 RX: %2',
                arduino_Lline_hc06_send: 'HC-06 데이터 보내기 %1',
                arduino_Lline_hc06_receive: 'HC-06 수신 데이터',

                arduino_Lline_DC_motor_init: 'DC 모터A 설정 EN: %1 IN1: %2 IN2: %3',
                arduino_Lline_DC_motor_control: 'DC 모터A  %1 속도 %2',

                arduino_Lline_DC_motor_init2: 'DC 모터B 설정 EN: %1 IN3: %2 IN4: %3',
                arduino_Lline_DC_motor_control2: 'DC 모터B  %1 속도 %2',

                

            

            },
        },
        en: {
            template: {
                arduino_Lline_get_analog_value: 'Analog %1 Sensor value',
                arduino_Lline_get_analog_value_map: 'Map Value %1 %2 ~ %3 to %4 ~ %5',
                arduino_Lline_get_ultrasonic_value: 'Read ultrasonic sensor trig pin %1 echo pin %2',
                arduino_Lline_toggle_led: 'Digital %1 Pin %2 %3',
                arduino_Lline_digital_pwm: 'Digital %1 Pin %2 %3',
                arduino_Lline_set_tone: 'Play tone pin %1 on note %2 octave %3 beat %4 %5',
                arduino_Lline_set_servo: 'Set servo pin %1 angle as %2 %3',
                arduino_Lline_get_digital: 'Digital %1 Sensor value',

                arduino_Lline_get_temp: '온습도 센서 %1 온도 값 ',
                arduino_Lline_get_humi: '온습도 센서 %1 습도 값 ',


                arduino_Lline_set_neopixel_init: 'set neopixel pin: %1 led-count: %2 bright: %3 %4',
                arduino_Lline_set_neopixel: 'neopixel pin: %1 (R:%2 G:%3 B:%4) %5',
                arduino_Lline_set_neopixel_each: 'neopixel pin: %1 LED %2 RGB ( %3, %4, %5) %6',
                arduino_Lline_set_neopixel_rainbow: 'neopixel pin: %1 %2 %4',
                arduino_Lline_set_neopixel_clear: 'clear neopixel pin: %1 %2',

                arduino_Lline_set_metrix: '8x8 paint dot-merix (row : %1, col: %2) %3',
                arduino_Lline_set_metrix_draw: '8x8 paint dot-merix %1 %2',
                arduino_Lline_set_metrix_rowcol_clear: 'Clear dot-metrix (row : %1, col: %2) %3',
                arduino_Lline_set_metrix_clear: 'Clear all dot-metrix %1',

                arduino_Lline_set_lcd_init: 'I2C LCD 초기화 (주소 %1, 열: 16, 행: 2) %2',
                arduino_Lline_lcd_backlight: 'LCD 백라이트 %1 ',
                arduino_Lline_lcd_row_col: 'LCD %1 행 %2 열 부터 "%3" 출력 %4',
                arduino_Lline_lcd_clear: 'LCD 화면 지우기 %1',


                // Stepper motor related
                arduino_Lline_stepper_init: 'Setup Stepper motor pins (%1, %2, %3, %4) steps/rev: %5 %6',
                arduino_Lline_stepper_speed: 'Set stepper motor speed to %1 rpm %2',
                arduino_Lline_stepper_step: 'Rotate stepper motor %1 steps %2',
                arduino_Lline_stepper_stop: 'Stop stepper motor %1',

                arduino_Lline_get_ir_value: 'IR Sensor value from %1',

                arduino_Lline_init_color_sensor: 'Initialize color sensor (S0: %1, S1: %2, S2: %3, S3: %4, OUT: %5, LED: %6)',
                arduino_Lline_get_color_rgb: 'Read color sensor %1 value',

                arduino_Lline_hm10_init: 'Setup HM-10 TX: %1 RX: %2',
                arduino_Lline_hm10_send: 'Send HM-10 data %1',
                arduino_Lline_hm10_receive: 'HM-10 received data',


                arduino_Lline_hc06_init: 'Setup HC-06 TX: %1 RX: %2',
                arduino_Lline_hc06_send: 'Send HC-06 data %1',
                arduino_Lline_hc06_receive: 'HC-06 received data',

                arduino_Lline_DC_motor_init: 'Setup DC motorA EN: %1 IN1: %2 IN2: %3',
                arduino_Lline_DC_motor_control: 'DC motor A %1 speed %2',

                arduino_Lline_DC_motor_init2: 'Setup DC motorB EN: %1 IN3: %2 IN4: %3',
                arduino_Lline_DC_motor_control2: 'DC motor B %1 speed %2',




              
               
            },
        },
    };
};

Entry.Lline.blockMenuBlocks = [
    'arduino_Lline_get_analog_value',
    'arduino_Lline_get_analog_value_map',
    'arduino_Lline_get_ultrasonic_value',
    'arduino_Lline_get_digital',
    'arduino_Lline_toggle_led',
    'arduino_Lline_digital_pwm',
    'arduino_Lline_set_servo',
    'arduino_Lline_set_tone',
    'arduino_Lline_get_temp',
    'arduino_Lline_get_humi',
    'arduino_Lline_set_neopixel_init',
    'arduino_Lline_set_neopixel',
    'arduino_Lline_set_neopixel_each',
    'arduino_Lline_set_neopixel_rainbow',
    'arduino_Lline_set_neopixel_clear',
    'arduino_Lline_set_metrix',
    'arduino_Lline_set_metrix_draw',
    'arduino_Lline_set_metrix_rowcol_clear',
    'arduino_Lline_set_metrix_clear',
    'arduino_Lline_set_lcd_init',
    'arduino_Lline_lcd_backlight',
    'arduino_Lline_lcd_row_col',
    'arduino_Lline_lcd_clear',

    // ✅ 스텝모터 관련 블록 추가
    'arduino_Lline_stepper_init',
    'arduino_Lline_stepper_speed',
    'arduino_Lline_stepper_step',
    'arduino_Lline_stepper_stop',
    
    'arduino_Lline_get_ir_value',

    'arduino_Lline_init_color_sensor',
    'arduino_Lline_get_color_rgb',

    'arduino_Lline_hm10_init',
    'arduino_Lline_hm10_send',
    'arduino_Lline_hm10_receive',


    'arduino_Lline_hc06_init',
    'arduino_Lline_hc06_send',
    'arduino_Lline_hc06_receive',

    'arduino_Lline_DC_motor_init',
    'arduino_Lline_DC_motor_control',

    'arduino_Lline_DC_motor_init2',
    'arduino_Lline_DC_motor_control2',



   
];

//region Lline 아두이노 확장모드
Entry.Lline.getBlocks = function() {
    return {
        arduino_Lline_analog_list: {
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
                                codeMap: 'Entry.CodeMap.Arduino.arduino_Lline_analog_list[0]',
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'arduino_Lline_analog_list',
                    },
                ],
            },
        },
        arduino_Lline_get_analog_value: {
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
                        type: 'arduino_Lline_analog_list',
                    },
                ],
                type: 'arduino_Lline_get_analog_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'LlineGet',
            isNotFor: ['Lline'],
            func(sprite, script) {
                let port = script.getValue('PORT', script);
                const ANALOG = Entry.hw.portData.ANALOG;
                if (port[0] === 'A') {
                    port = port.substring(1);
                }
                return ANALOG ? ANALOG[port] || 0 : 0;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.analogRead(%1)',
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
        arduino_Lline_get_analog_value_map: {
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
                        type: 'arduino_Lline_get_analog_value',
                        params: [
                            {
                                type: 'arduino_Lline_analog_list',
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
                type: 'arduino_Lline_get_analog_value_map',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE2: 1,
                VALUE3: 2,
                VALUE4: 3,
                VALUE5: 4,
            },
            class: 'LlineGet',
            isNotFor: ['Lline'],
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
                        syntax: 'Arduino.map(%1, %2, %3, %4, %5)',
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
        arduino_Lline_get_ultrasonic_value: {
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
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'arduino_get_port_number',
                        params: ['6'],
                    },
                    {
                        type: 'arduino_get_port_number',
                        params: ['5'],
                    },
                ],
                type: 'arduino_Lline_get_ultrasonic_value',
            },
            paramsKeyMap: {
                PORT1: 0,
                PORT2: 1,
            },
            class: 'LlineGet',
            isNotFor: ['Lline'],
            func(sprite, script) {
                const port1 = script.getNumberValue('PORT1', script);
                const port2 = script.getNumberValue('PORT2', script);

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                delete Entry.hw.sendQueue.SET[port1];
                delete Entry.hw.sendQueue.SET[port2];

                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                


                Entry.hw.sendQueue.GET[Entry.Lline.sensorTypes.ULTRASONIC] = {
                    port: [port1, port2],
                    time: new Date().getTime(),
                };
                


                return Entry.hw.portData.ULTRASONIC || 0;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.ultrasonicRead(%1, %2)',
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
                        ],
                    },
                ],
            },
        },
        arduino_Lline_get_digital: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
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
                        type: 'arduino_get_port_number',
                        params: [2],
                    },
                ],
                type: 'arduino_Lline_get_digital',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'LlineGet',
            isNotFor: ['Lline'],
            func(sprite, script) {
                const { hwModule = {} } = Entry.hw;
                const { name } = hwModule;
                if (name === 'Lline' || name === 'ArduinoNano') {
                    const port = script.getNumberValue('PORT', script);
                    const DIGITAL = Entry.hw.portData.DIGITAL;
                    if (!Entry.hw.sendQueue.GET) {
                        Entry.hw.sendQueue.GET = {};
                    }
                    Entry.hw.sendQueue.GET[Entry.Lline.sensorTypes.DIGITAL] = {
                        port,
                        time: new Date().getTime(),
                    };
                    return DIGITAL ? DIGITAL[port] || 0 : 0;
                } else {
                    return Entry.block.arduino_get_digital_value.func(sprite, script);
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.digitalRead(%1)',
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
        arduino_get_digital_toggle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [[Lang.Blocks.ARDUINO_on, 'on'], [Lang.Blocks.ARDUINO_off, 'off']],
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
                                fontSize: 11,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValueUpperCase,
                                codeMap: 'Entry.CodeMap.Arduino.arduino_get_digital_toggle[0]',
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            },
                        ],
                        keyOption: 'arduino_get_digital_toggle',
                    },
                ],
            },
        },
        arduino_Lline_toggle_led: {
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
                        params: [3],
                    },
                    {
                        type: 'arduino_get_digital_toggle',
                        params: ['on'],
                    },
                    null,
                ],
                type: 'arduino_Lline_toggle_led',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'Lline',
            isNotFor: ['Lline'],
            func(sprite, script) {
                const port = script.getNumberValue('PORT');
                let value = script.getValue('VALUE');

                if (typeof value === 'string') {
                    value = value.toLowerCase();
                }
                if (Entry.Lline.highList.indexOf(value) > -1) {
                    value = 255;
                } else if (Entry.Lline.lowList.indexOf(value) > -1) {
                    value = 0;
                } else {
                    throw new Error();
                }
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[port] = {
                    type: Entry.Lline.sensorTypes.DIGITAL,
                    data: value,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.digitalWrite(%1, %2)',
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
        arduino_Lline_digital_pwm: {
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
                        type: 'arduino_get_pwm_port_number',
                    },
                    {
                        type: 'text',
                        params: ['255'],
                    },
                    null,
                ],
                type: 'arduino_Lline_digital_pwm',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'Lline',
            isNotFor: ['Lline'],
            func(sprite, script) {
                const port = script.getNumberValue('PORT');
                let value = script.getNumberValue('VALUE');
                value = Math.round(value);
                value = Math.max(value, 0);
                value = Math.min(value, 255);
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[port] = {
                    type: Entry.Lline.sensorTypes.PWM,
                    data: value,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.analogWrite(%1, %2)',
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
        arduino_Lline_tone_list: {
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
            func(sprite, script) {
                return script.getField('NOTE');
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
                                converter: Entry.block.converters.returnStringValueUpperCase,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'arduino_Lline_tone_list',
                    },
                ],
            },
        },
        arduino_Lline_tone_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
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
                        type: 'arduino_Lline_tone_list',
                    },
                ],
                type: 'arduino_Lline_tone_value',
            },
            paramsKeyMap: {
                NOTE: 0,
            },
            func(sprite, script) {
                return script.getNumberValue('NOTE');
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        keyOption: 'arduino_Lline_tone_value',
                    },
                ],
            },
        },
        arduino_Lline_octave_list: {
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
                    ],
                    value: '4',
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
            func(sprite, script) {
                return script.getField('OCTAVE');
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        keyOption: 'arduino_Lline_octave_list',
                    },
                ],
            },
        },
        arduino_Lline_set_tone: {
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
                        params: [3],
                    },
                    {
                        type: 'arduino_Lline_tone_list',
                    },
                    {
                        type: 'arduino_Lline_octave_list',
                    },
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'arduino_Lline_set_tone',
            },
            paramsKeyMap: {
                PORT: 0,
                NOTE: 1,
                OCTAVE: 2,
                DURATION: 3,
            },
            class: 'Lline',
            isNotFor: ['Lline'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = script.getNumberValue('PORT', script);

                if (!script.isStart) {
                    let note = script.getValue('NOTE', script);
                    if (!Entry.Utils.isNumber(note)) {
                        note = Entry.Lline.toneTable[note];
                    }

                    if (note < 0) {
                        note = 0;
                    } else if (note > 12) {
                        note = 12;
                    }

                    let duration = script.getNumberValue('DURATION', script);

                    if (duration < 0) {
                        duration = 0;
                    }

                    if (!sq.SET) {
                        sq.SET = {};
                    }

                    if (duration === 0) {
                        sq.SET[port] = {
                            type: Entry.Lline.sensorTypes.TONE,
                            data: 0,
                            time: new Date().getTime(),
                        };
                        return script.callReturn();
                    }

                    let octave = script.getNumberValue('OCTAVE', script) - 1;
                    if (octave < 0) {
                        octave = 0;
                    } else if (octave > 5) {
                        octave = 5;
                    }

                    let value = 0;

                    if (note != 0) {
                        value = Entry.Lline.toneMap[note][octave];
                    }

                    duration = duration * 1000;
                    script.isStart = true;
                    script.timeFlag = 1;

                    sq.SET[port] = {
                        type: Entry.Lline.sensorTypes.TONE,
                        data: {
                            value,
                            duration,
                        },
                        time: new Date().getTime(),
                    };

                    setTimeout(() => {
                        script.timeFlag = 0;
                    }, duration + 32);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    sq.SET[port] = {
                        type: Entry.Lline.sensorTypes.TONE,
                        data: 0,
                        time: new Date().getTime(),
                    };
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.tone(%1, %2, %3, %4)',
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
                        ],
                    },
                ],
            },
        },
        arduino_Lline_set_neopixel_init: {
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
                        params: [6],
                    },
                    {
                        type: 'number',
                        params: ['16'],
                    },
                    {
                        type: 'number',
                        params: ['10'],
                    },
                ],
                type: 'arduino_Lline_set_neopixel_init',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE1: 1,
                VALUE2: 2,
            },
            class: 'Lline',
            isNotFor: ['Lline'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = script.getNumberValue('PORT', script);
                let value1 = script.getNumberValue('VALUE1', script);
                let value2 = script.getNumberValue('VALUE2', script);

                if (!script.isStart) {
                    if (!sq.SET) {
                        sq.SET = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;


                    sq.SET[port] = {
                        type: Entry.Lline.sensorTypes.NEOPIXELINIT,
                        data:{value1,value2},
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                }else if (script.timeFlag == 1) {
                    return script;
                }else {
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
                        syntax: 'Arduino.neopixel_init(%1, %2, %3)',
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
                        ],
                    },
                ],
            },
        },
        arduino_Lline_set_neopixel: {
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
                        params: [6],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                ],
                type: 'arduino_Lline_set_neopixel',
            },
            paramsKeyMap: {
                PORT: 0,
                R: 1,
                G: 2,
                B: 3,
            },
            class: 'Lline',
            isNotFor: ['Lline'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = script.getNumberValue('PORT', script);
                let R_val = script.getNumberValue('R', script);
                let G_val = script.getNumberValue('G', script);
                let B_val = script.getNumberValue('B', script);

                if (!script.isStart) {
                    if (!sq.SET) {
                        sq.SET = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;

                    sq.SET[port] = {
                        type: Entry.Lline.sensorTypes.NEOPIXEL,
                        data:{R_val,G_val,B_val},
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                }else if (script.timeFlag == 1) {
                    return script;
                }else {
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
                        syntax: 'Arduino.neopixel(%1, %2, %3, %4)',
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
                        ],
                    },
                ],
            },
        },
        arduino_Lline_set_neopixel_each: {
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
                        params: [6],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                ],
                type: 'arduino_Lline_set_neopixel_each',
            },
            paramsKeyMap: {
                PORT: 0,
                CNT: 1,
                R: 2,
                G: 3,
                B: 4,
            },
            class: 'Lline',
            isNotFor: ['Lline'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = script.getNumberValue('PORT', script);
                let CNT_val = script.getNumberValue('CNT', script);
                let R_val = script.getNumberValue('R', script);
                let G_val = script.getNumberValue('G', script);
                let B_val = script.getNumberValue('B', script);

                if (!script.isStart) {
                    if (!sq.SET) {
                        sq.SET = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;

                    sq.SET[port] = {
                        type: Entry.Lline.sensorTypes.NEOPIXELEACH,
                        data:{CNT_val,R_val,G_val,B_val},
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                }else if (script.timeFlag == 1) {
                    return script;
                }else {
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
                        syntax: 'Arduino.neopixel_each(%1, %2, %3, %4, %5)',
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
        arduino_Lline_set_neopixel_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['무지개', '1'],
                        ['조명효과', '2'],
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
                VALUE: 0,
            },
            func(sprite, script) {
                return script.getField('VALUE');
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
                                    ['무지개', '1'],
                                    ['조명효과', '2'],
                                ],
                                value: '0',
                                fontSize: 11,
                                converter: Entry.block.converters.returnStringKey,
                                codeMap: 'Entry.CodeMap.Arduino.arduino_Lline_set_neopixel_list[0]',
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'arduino_Lline_set_neopixel_list',
                    },
                ],
            },
        },
        arduino_Lline_set_neopixel_rainbow: {
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
                        type: 'arduino_get_port_number',
                        params: [6],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                ],
                type: 'arduino_Lline_set_neopixel_rainbow',
            },
            paramsKeyMap: {
                PORT : 0,
                VALUE: 1,
            },
            class: 'Lline',
            isNotFor: ['Lline'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = script.getNumberValue('PORT', script);
                let value = script.getNumberValue('VALUE', script);
                
                if (!script.isStart) {
                    if (!sq.SET) {
                        sq.SET = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;


                    sq.SET[port] = {
                        type: Entry.Lline.sensorTypes.NEOPIXELRAINBOW,
                        data: value,
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                }else if (script.timeFlag == 1) {
                    return script;
                }else {
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
                        syntax: 'Arduino.neopixel_rainbow(%1)',
                        
                        textParams: 
                        [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ]
                    },
                ],
            },
        },
        arduino_Lline_set_neopixel_clear: {
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
                        params: [6],
                    },
                    
                ],
                type: 'arduino_Lline_set_neopixel_clear',
            },
            paramsKeyMap: {
                PORT : 0,
            },
            class: 'Lline',
            isNotFor: ['Lline'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port =  script.getNumberValue('PORT', script);

                if (!script.isStart) {
                    if (!sq.SET) {
                        sq.SET = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;

                    sq.SET[port] = {
                        type: Entry.Lline.sensorTypes.NEOPIXELCLEAR,
                        data: 0,
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                }else if (script.timeFlag == 1) {
                    return script;
                }else {
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

                        syntax: 'Arduino.neopixeclear(%1)',
                        textParams: 
                        [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ]
                    }
                ],
            },
        },
        arduino_Lline_set_metrix: {
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
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                ],
                type: 'arduino_Lline_set_metrix',
            },
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
            },
            class: 'Lline',
            isNotFor: ['Lline'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                let value1 = script.getNumberValue('VALUE1', script) +10;
                let value2 = script.getNumberValue('VALUE2', script) + 10;

                if (!script.isStart) {
                    if (!sq.SET) {
                        sq.SET = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;

                    sq.SET[12] = {
                        type: Entry.Lline.sensorTypes.METRIX,
                        data:{value1,value2},
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                }else if (script.timeFlag == 1) {
                    return script;
                }else {
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
                        syntax: 'Arduino.metrix(%1, %2)',
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
        arduino_Lline_set_metrix_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['0', '10'],
                        ['1', '1'],
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['5', '5'],
                        ['6', '6'],
                        ['7', '7'],
                        ['8', '8'],
                        ['9', '9'],
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
                VALUE: 0,
            },
            func(sprite, script) {
                return script.getField('VALUE');
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
                                    ['0', '10'],
                                    ['1', '1'],
                                    ['2', '2'],
                                    ['3', '3'],
                                    ['4', '4'],
                                    ['5', '5'],
                                    ['6', '6'],
                                    ['7', '7'],
                                    ['8', '8'],
                                    ['9', '9'],
                                ],
                                value: '0',
                                fontSize: 11,
                                converter: Entry.block.converters.returnStringKey,
                                codeMap: 'Entry.CodeMap.Arduino.arduino_Lline_set_metrix_list[0]',
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'arduino_Lline_set_metrix_list',
                    },
                ],
            },
        },
        arduino_Lline_set_metrix_draw: {
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [ 
                    {
                        type: 'arduino_Lline_set_metrix_list',
                    }
                ],
                type: 'arduino_Lline_set_metrix_draw',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'Lline',
            isNotFor: ['Lline'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;

                let value = script.getNumberValue('VALUE', script);
                
                if (!script.isStart) {
                    if (!sq.SET) {
                        sq.SET = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;


                    sq.SET[12] = {
                        type: Entry.Lline.sensorTypes.METRIXDRAW,
                        data: value,
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                }else if (script.timeFlag == 1) {
                    return script;
                }else {
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
                        syntax: 'Arduino.draw(%1)',
                        textParams: [
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                    ]
                    },
                ],
            },
        },
        arduino_Lline_set_metrix_rowcol_clear: {
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
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                ],
                type: 'arduino_Lline_set_metrix_rowcol_clear',
            },
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
            },
            class: 'Lline',
            isNotFor: ['Lline'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                let value1 = script.getNumberValue('VALUE1', script) + 10;
                let value2 = script.getNumberValue('VALUE2', script) + 10;

                if (!script.isStart) {
                    if (!sq.SET) {
                        sq.SET = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;

                    sq.SET[12] = {
                        type: Entry.Lline.sensorTypes.METRIXROWCOLCLEAR,
                        data:{value1,value2},
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                }else if (script.timeFlag == 1) {
                    return script;
                }else {
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
                        syntax: 'Arduino.metrix_rowcol_clear(%1, %2)',
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
        arduino_Lline_set_metrix_clear: {
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
                params: [
                    
                ],
                type: 'arduino_Lline_set_metrix_clear',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'Lline',
            isNotFor: ['Lline'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = 12;

                if (!script.isStart) {
             
                    if (!sq.SET) {
                        sq.SET = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;

                    sq.SET[port] = {
                        type: Entry.Lline.sensorTypes.METRIXCLEAR,
                        data: 0,
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                }else if (script.timeFlag == 1) {
                    return script;
                }else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [
                    { }
                ],
            },
        },
        arduino_Lline_lcd_list_init: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['0x27', '0'],
                        ['0x3F', '1'],
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
        arduino_Lline_lcd_row_list: {
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
                        ['14', '14'],
                        ['15', '15'],

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
        arduino_Lline_lcd_col_list: {
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
        arduino_Lline_set_lcd_init: {
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
                        type: 'arduino_Lline_lcd_list_init',
                        params: ['0'],
                    },
                ],
                type: 'arduino_Lline_set_lcd_init',
            },
            paramsKeyMap: {
                LIST: 0,
            },
            class: 'Lline',
            isNotFor: ['Lline'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const list = script.getNumberValue('LIST', script);

                if (!script.isStart) {
                    if (!sq.SET) {
                        sq.SET = {};
                    }
 
                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 100;


                    sq.SET[1] = {
                        type: Entry.Lline.sensorTypes.LCDINIT,
                        data: {
                            list: list,
                        },
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                }else if (script.timeFlag == 1) {
                    return script;
                }else {
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
                        syntax: 'Arduino.lcd_init(%1)',
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

        arduino_Lline_lcd_backlight: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'arduino_get_digital_toggle', // 기존 토글 블럭
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
                        type: 'arduino_get_digital_toggle',
                        params: ['on'],  // 기본은 ON
                    },
                    null,
                ],
                type: 'arduino_Lline_lcd_backlight',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'Lline',
            isNotFor: ['Lline'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const lcdAddress = 0x27;  // 고정 주소 또는 39

                let value = script.getValue('VALUE');  // 'on' / 'off' 가져옴
                if (typeof value === 'string') value = value.toLowerCase();

                if (Entry.Lline.highList.indexOf(value) > -1) {
                    value = 1;
                } else if (Entry.Lline.lowList.indexOf(value) > -1) {
                    value = 0;
                } else {
                    value = 0;  // 기본 OFF 처리
                }

                if (!sq.SET) sq.SET = {};

                sq.SET[1] = {
                    type: Entry.Lline.sensorTypes.LCD_BACKLIGHT,
                    data: value,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },

            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.lcd_backlight(%1)',
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








        arduino_Lline_lcd_row_col: {
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
                        type: 'arduino_Lline_lcd_row_list',
                        params: ['0'],
                    },
                    {
                        type: 'arduino_Lline_lcd_col_list',
                        params: ['0'],
                    },
                    {
                        type: 'text',
                        params: ['Lline'],
                    },
                ],
                type: 'arduino_Lline_lcd_row_col',
            },
            paramsKeyMap: {
                ROW: 0,
                COL: 1,
                VALUE: 2,
            },
            class: 'Lline',
            isNotFor: ['Lline'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;

                let row = script.getNumberValue('ROW', script);
                let col = script.getNumberValue('COL', script);
                let value = script.getValue('VALUE', script);
                value += '';
                if (!script.isStart) {
                    if (!sq.SET) {
                        sq.SET = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 100;


                    sq.SET[1] = {
                        type: Entry.Lline.sensorTypes.LCD,
                        data: {row, col, value},
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                }else if (script.timeFlag == 1) {
                    return script;
                }else {
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
                        syntax: 'Arduino.lcd(%1,%2,%3)',
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
                    ]
                    },
                ],
            },
        },
        arduino_Lline_lcd_clear: {
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
                params: [
                    
                ],
                type: 'arduino_Lline_lcd_clear',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'Lline',
            isNotFor: ['Lline'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = 1;

                if (!script.isStart) {
            
                    if (!sq.SET) {
                        sq.SET = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    var fps = Entry.FPS || 60;
                    var timeValue = (60 / fps) * 50;

                    sq.SET[port] = {
                        type: Entry.Lline.sensorTypes.LCDCLEAR,
                        data: 0,
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                }else if (script.timeFlag == 1) {
                    return script;
                }else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [
                    { }
                ],
            },
        },
        arduino_Lline_get_temp: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'arduino_Lline_analog_list',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'arduino_Lline_analog_list',
                    },
                ],
                type: 'arduino_Lline_get_temp',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'LlineGet',
            isNotFor: ['Lline'],
            func(sprite, script) {
                const port = Number(script.getValue('PORT', script));
                const tempValue = Entry.hw.portData.TEMPCHECK || 0;
        
                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
        
                Entry.hw.sendQueue.GET[Entry.Lline.sensorTypes.TEMPCHECK] = {
                    port,
                    time: new Date().getTime(),
                };
        
                return tempValue;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.temp_read(%1)',
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
        
        

        arduino_Lline_get_humi: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'arduino_Lline_analog_list',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'arduino_Lline_analog_list',
                    },
                ],
                type: 'arduino_Lline_get_humi',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'LlineGet',
            isNotFor: ['Lline'],
            func(sprite, script) {
                const port = Number(script.getValue('PORT', script));  // 드롭다운 값 받아오기
                const humiValue = Entry.hw.portData.HUMICHECK || 0;
        
                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
        
                Entry.hw.sendQueue.GET[Entry.Lline.sensorTypes.HUMICHECK] = {
                    port,
                    time: new Date().getTime(),
                };
        
                return humiValue;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.humi_read(%1)',
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
        
        

        

        arduino_Lline_set_servo: {
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
                        type: 'arduino_get_port_number',
                        params: ['4'],
                    },
                    null,
                ],
                type: 'arduino_Lline_set_servo',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'Lline',
            isNotFor: ['Lline'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = script.getNumberValue('PORT', script);
                let value = script.getNumberValue('VALUE', script);
                value = Math.min(180, value);
                value = Math.max(0, value);

                if (!sq.SET) {
                    sq.SET = {};
                }
                sq.SET[port] = {
                    type: Entry.Lline.sensorTypes.SERVO_PIN,
                    data: value,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.servomotorWrite(%1, %2)',
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

        arduino_Lline_stepper_init: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                }, // steps/rev 입력칸
                {
                    type: 'Dropdown',
                    options: [['2','2'], ['3','3'], ['4','4'], ['5','5'], ['6','6'], ['7','7'], ['8','8'], ['9','9'], ['10','10'], ['11','11'], ['12','12'], ['13','13']],
                    value: '8',
                }, // PIN1
                {
                    type: 'Dropdown',
                    options: [['2','2'], ['3','3'], ['4','4'], ['5','5'], ['6','6'], ['7','7'], ['8','8'], ['9','9'], ['10','10'], ['11','11'], ['12','12'], ['13','13']],
                    value: '9',
                }, // PIN2
                {
                    type: 'Dropdown',
                    options: [['2','2'], ['3','3'], ['4','4'], ['5','5'], ['6','6'], ['7','7'], ['8','8'], ['9','9'], ['10','10'], ['11','11'], ['12','12'], ['13','13']],
                    value: '10',
                }, // PIN3
                {
                    type: 'Dropdown',
                    options: [['2','2'], ['3','3'], ['4','4'], ['5','5'], ['6','6'], ['7','7'], ['8','8'], ['9','9'], ['10','10'], ['11','11'], ['12','12'], ['13','13']],
                    value: '11',
                }, // PIN4
            ],
            def: {
                params: [
                    { type: 'text', params: ['200'] },
                    { type: 'Dropdown', value: '8' },
                    { type: 'Dropdown', value: '9' },
                    { type: 'Dropdown', value: '10' },
                    { type: 'Dropdown', value: '11' },
                ],
                type: 'arduino_Lline_stepper_init',
            },
            paramsKeyMap: {
                STEPS: 0,
                PIN1: 1,
                PIN2: 2,
                PIN3: 3,
                PIN4: 4,
            },
            class: 'LlineMotor',
            isNotFor: ['Lline'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const steps = script.getNumberValue('STEPS');

                const pin1 = Number(script.getField('PIN1'));
                const pin2 = Number(script.getField('PIN2'));
                const pin3 = Number(script.getField('PIN3'));
                const pin4 = Number(script.getField('PIN4'));

                if (
                    isNaN(steps) || steps <= 0 ||
                    isNaN(pin1) || isNaN(pin2) || isNaN(pin3) || isNaN(pin4)
                ) {
                    console.warn('❗ [STEPPER_INIT] 유효하지 않은 값:', {
                        steps, pins: [pin1, pin2, pin3, pin4]
                    });
                    return script.callReturn();
                }

                if (!sq.SET) sq.SET = {};
                sq.SET[1] = {
                    type: Entry.Lline.sensorTypes.STEPPER_INIT,
                    data: {
                        steps,
                        pins: [pin1, pin2, pin3, pin4],
                    },
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },

            syntax: {
                text: '스텝모터 설정 steps/rev: %1 PIN1: %2 PIN2: %3 PIN3: %4 PIN4: %5',
                textParams: [
                  { type: 'Block', name: 'STEPS' },
                  { type: 'Dropdown', name: 'PIN1' },
                  { type: 'Dropdown', name: 'PIN2' },
                  { type: 'Dropdown', name: 'PIN3' },
                  { type: 'Dropdown', name: 'PIN4' },
                ],
              },
              
        },
        
        
        
        
        
        
        
        
        
        

        arduino_Lline_stepper_speed: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    name: 'SPEED',
                    defaultType: 'number',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            def: {
                params: [
                    { type: 'text', params: ['60'] },
                    null,
                ],
                type: 'arduino_Lline_stepper_speed',
            },
            paramsKeyMap: {
                SPEED: 0,
            },
            class: 'LlineMotor',
            isNotFor: ['Lline'],
            func(sprite, script) {
                const speed = script.getNumberValue('SPEED');
                if (!Entry.hw.sendQueue.SET) Entry.hw.sendQueue.SET = {};
                Entry.hw.sendQueue.SET[1] = {
                    type: Entry.Lline.sensorTypes.STEPPER_SPEED,
                    data: { speed },
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
        },
        

        
        arduino_Lline_stepper_step: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    name: 'STEP',
                    defaultType: 'number',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            def: {
                params: [
                    { type: 'text', params: ['200'] },
                    null,
                ],
                type: 'arduino_Lline_stepper_step',
            },
            paramsKeyMap: {
                STEP: 0,
            },
            class: 'LlineMotor',
            isNotFor: ['Lline'],
            func(sprite, script) {
                const step = script.getNumberValue('STEP');
                if (!Entry.hw.sendQueue.SET) Entry.hw.sendQueue.SET = {};
                Entry.hw.sendQueue.SET[1] = {
                    type: Entry.Lline.sensorTypes.STEPPER_STEP,
                    data: { step },
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
        },
        

        
        arduino_Lline_stepper_stop: {
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
            def: {
                params: [null],
                type: 'arduino_Lline_stepper_stop',
            },
            class: 'LlineMotor',
            isNotFor: ['Lline'],
            func(sprite, script) {
                if (!Entry.hw.sendQueue.SET) Entry.hw.sendQueue.SET = {};
                Entry.hw.sendQueue.SET[1] = {
                    type: Entry.Lline.sensorTypes.STEPPER_STOP,
                    data: 0,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
        },
        
        

        
        arduino_Lline_get_ir_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
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
                type: 'arduino_Lline_get_ir_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'LlineGet',
            isNotFor: ['Lline'],
            func(sprite, script) {
                const port = Number(script.getField('PORT'));
                const value = Entry.hw.portData.IR || 0;
        
                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
        
                Entry.hw.sendQueue.GET[Entry.Lline.sensorTypes.IR] = {
                    port,
                    time: new Date().getTime(),
                };
        
                return value;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.ir_read(%1)',
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
        
        

        arduino_Lline_init_color_sensor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'], ['6', '6'], ['7', '7'], ['8', '8']],
                    value: '6',
                },
                {
                    type: 'Dropdown',
                    options: [['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'], ['6', '6'], ['7', '7'], ['8', '8']],
                    value: '5',
                },
                {
                    type: 'Dropdown',
                    options: [['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'], ['6', '6'], ['7', '7'], ['8', '8']],
                    value: '4',
                },
                {
                    type: 'Dropdown',
                    options: [['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'], ['6', '6'], ['7', '7'], ['8', '8']],
                    value: '3',
                },
                {
                    type: 'Dropdown',
                    options: [['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'], ['6', '6'], ['7', '7'], ['8', '8']],
                    value: '2',
                },
                {
                    type: 'Dropdown',
                    options: [['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'], ['6', '6'], ['7', '7'], ['8', '8']],
                    value: '7',
                },
            ],
            events: {},
            def: {
                params: [
                    { type: 'Dropdown', value: '6' },
                    { type: 'Dropdown', value: '5' },
                    { type: 'Dropdown', value: '4' },
                    { type: 'Dropdown', value: '3' },
                    { type: 'Dropdown', value: '2' },
                    { type: 'Dropdown', value: '7' },
                ],
                type: 'arduino_Lline_init_color_sensor',
            },
            paramsKeyMap: {
                S0: 0,
                S1: 1,
                S2: 2,
                S3: 3,
                OUT: 4,
                LED: 5,
            },
            class: 'LlineGet',
            isNotFor: ['Lline'],
            func(sprite, script) {
                const s0 = Number(script.getField('S0'));
                const s1 = Number(script.getField('S1'));
                const s2 = Number(script.getField('S2'));
                const s3 = Number(script.getField('S3'));
                const out = Number(script.getField('OUT'));
                const led = Number(script.getField('LED'));

                if (!Entry.hw.sendQueue.SET) Entry.hw.sendQueue.SET = {};
                Entry.hw.sendQueue.SET[1] = {
                    type: Entry.Lline.sensorTypes.COLOR_SENSOR_INIT,
                    data: {
                        s0,
                        s1,
                        s2,
                        s3,
                        out,
                        led,
                    },
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.init_color_sensor(%1, %2, %3, %4, %5, %6)',
                        textParams: [
                            { type: 'Dropdown', options: [['2','2'],['3','3'],['4','4'],['5','5'],['6','6']], value: '6' },
                            { type: 'Dropdown', options: [['2','2'],['3','3'],['4','4'],['5','5'],['6','6']], value: '5' },
                            { type: 'Dropdown', options: [['2','2'],['3','3'],['4','4'],['5','5'],['6','6']], value: '4' },
                            { type: 'Dropdown', options: [['2','2'],['3','3'],['4','4'],['5','5'],['6','6']], value: '3' },
                            { type: 'Dropdown', options: [['2','2'],['3','3'],['4','4'],['5','5'],['6','6']], value: '2' },
                            { type: 'Dropdown', options: [['2','2'],['3','3'],['4','4'],['5','5'],['6','6']], value: '7' },
                        ],
                    },
                ],
            },
        },


        arduino_Lline_get_color_rgb: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['Red', 'R'],
                        ['Green', 'G'],
                        ['Blue', 'B'],
                    ],
                    value: 'R',
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'arduino_Lline_get_color_rgb',
            },
            paramsKeyMap: {
                COLOR: 0,
            },
            class: 'LlineGet',
            isNotFor: ['Lline'],
            func(sprite, script) {
                const color = script.getField('COLOR');
                const colorObj = Entry.hw.portData.COLOR || {}; // COLOR: {R, G, B}
        
                
                 // colorIndex: R=0, G=1, B=2로 매핑
                const colorIndexMap = { R: 0, G: 1, B: 2 };
                const colorIndex = colorIndexMap[color];


                if (!Entry.hw.sendQueue.GET) Entry.hw.sendQueue.GET = {};
                Entry.hw.sendQueue.GET[Entry.Lline.sensorTypes.COLOR_SENSOR] = {
                    port: [1],
                    data: colorIndex,
                    time: new Date().getTime(),
                };
        
                return colorObj[color] || 0; // colorObj['R'], 'G', 'B'
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.color_read(%1)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['Red', 'R'],
                                    ['Green', 'G'],
                                    ['Blue', 'B'],
                                ],
                                value: 'R',
                            },
                        ],
                    },
                ],
            },
        },


        
        
        

        arduino_Lline_hm10_init: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['0', '0'], ['1', '1'], ['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'], ['6', '6'], ['7', '7'], ['8', '8'], ['9', '9']],
                    value: '0',
                }, // TX 핀
                {
                    type: 'Dropdown',
                    options: [['0', '0'], ['1', '1'], ['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'], ['6', '6'], ['7', '7'], ['8', '8'], ['9', '9']],
                    value: '1',
                }, // RX 핀
            ],
            def: {
                params: [
                    { type: 'Dropdown', value: '0' },
                    { type: 'Dropdown', value: '1' },
                ],
                type: 'arduino_Lline_hm10_init',
            },
            paramsKeyMap: {
                TX: 0,
                RX: 1,
            },
            class: 'LlineComm',
            isNotFor: ['Lline'],
            func(sprite, script) {
                const tx = Number(script.getField('TX'));
                const rx = Number(script.getField('RX'));
        
                if (!Entry.hw.sendQueue.SET) Entry.hw.sendQueue.SET = {};
                Entry.hw.sendQueue.SET[1] = {
                    type: Entry.Lline.sensorTypes.HM10_INIT,
                    data: { tx, rx },
                    time: new Date().getTime(),
                };
        
                return script.callReturn();
            },
            syntax: {
                text: 'HM-10 연결 설정 TX: %1 RX: %2',
                textParams: [
                    { type: 'Dropdown', name: 'TX' },
                    { type: 'Dropdown', name: 'RX' },
                ],
            },
        },


        arduino_Lline_hm10_send: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                { type: 'Block', accept: 'string' }, // 보낼 문자열
            ],
            def: {
                params: [
                    { type: 'text', params: ['Hello'] },
                ],
                type: 'arduino_Lline_hm10_send',
            },
            paramsKeyMap: {
                DATA: 0,
            },
            class: 'LlineComm',
            isNotFor: ['Lline'],
            func(sprite, script) {
                const data = script.getStringValue('DATA');
        
                if (!Entry.hw.sendQueue.SET) Entry.hw.sendQueue.SET = {};
                Entry.hw.sendQueue.SET[1] = {
                    type: Entry.Lline.sensorTypes.HM10_SEND,
                    data: data,
                    time: new Date().getTime(),
                };
        
                return script.callReturn();
            },
            syntax: {
                text: 'HM-10 데이터 보내기 %1',
                textParams: [
                    { type: 'Block', name: 'DATA' },
                ],
            },
        },

        
        arduino_Lline_hm10_receive: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            def: {
                params: [],
                type: 'arduino_Lline_hm10_receive',
            },
            class: 'LlineComm',
            isNotFor: ['Lline'],
            func(sprite, script) {
                const value = Entry.hw.portData.HM10_RECEIVE || '';

                if (!Entry.hw.sendQueue.SET) Entry.hw.sendQueue.SET = {};
                Entry.hw.sendQueue.SET[1] = {
                    type: Entry.Lline.sensorTypes.HM10_RECEIVE,
                    time: new Date().getTime(),
                };


                return value;
            },
            syntax: {
                text: 'HM-10 수신 데이터',
                textParams: [],
            },
        },




        arduino_Lline_hc06_init: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['0', '0'], ['1', '1'], ['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'], ['6', '6'], ['7', '7'], ['8', '8'], ['9', '9']],
                    value: '0',
                }, // TX 핀
                {
                    type: 'Dropdown',
                    options: [['0', '0'], ['1', '1'], ['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'], ['6', '6'], ['7', '7'], ['8', '8'], ['9', '9']],
                    value: '1',
                }, // RX 핀
            ],
            def: {
                params: [
                    { type: 'Dropdown', value: '0' },
                    { type: 'Dropdown', value: '1' },
                ],
                type: 'arduino_Lline_hc06_init',
            },
            paramsKeyMap: {
                TX: 0,
                RX: 1,
            },
            class: 'LlineComm',
            isNotFor: ['Lline'],
            func(sprite, script) {
                const tx = Number(script.getField('TX'));
                const rx = Number(script.getField('RX'));
        
                if (!Entry.hw.sendQueue.SET) Entry.hw.sendQueue.SET = {};
                Entry.hw.sendQueue.SET[1] = {
                    type: Entry.Lline.sensorTypes.HC06_INIT,
                    data: { tx, rx },
                    time: new Date().getTime(),
                };
        
                return script.callReturn();
            },
            syntax: {
                text: 'HC-06 연결 설정 TX: %1 RX: %2',
                textParams: [
                    { type: 'Dropdown', name: 'TX' },
                    { type: 'Dropdown', name: 'RX' },
                ],
            },
        },

        

        arduino_Lline_hc06_send: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                { type: 'Block', accept: 'string' }, // 보낼 문자열
            ],
            def: {
                params: [
                    { type: 'text', params: ['Hello'] },
                ],
                type: 'arduino_Lline_hc06_send',
            },
            paramsKeyMap: {
                DATA: 0,
            },
            class: 'LlineComm',
            isNotFor: ['Lline'],
            func(sprite, script) {
                const data = script.getStringValue('DATA');
        
                if (!Entry.hw.sendQueue.SET) Entry.hw.sendQueue.SET = {};
                Entry.hw.sendQueue.SET[1] = {
                    type: Entry.Lline.sensorTypes.HC06_SEND,
                    data: data,
                    time: new Date().getTime(),
                };
        
                return script.callReturn();
            },
            syntax: {
                text: 'HC-06 데이터 보내기 %1',
                textParams: [
                    { type: 'Block', name: 'DATA' },
                ],
            },
        },
        

        arduino_Lline_hc06_receive: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            def: {
                params: [],
                type: 'arduino_Lline_hc06_receive',
            },
            class: 'LlineComm',
            isNotFor: ['Lline'],
            func(sprite, script) {
                const value = Entry.hw.portData.HC06_RECEIVE || '';

                if (!Entry.hw.sendQueue.SET) Entry.hw.sendQueue.SET = {};
                Entry.hw.sendQueue.SET[1] = {
                    type: Entry.Lline.sensorTypes.HC06_RECEIVE,
                    time: new Date().getTime(),
                };


                return value;
            },
            syntax: {
                text: 'HC-06 수신 데이터',
                textParams: [],
            },
        },



        arduino_Lline_DC_motor_init: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            params: [
                {
                    type: 'Dropdown',
                    options: [['2','2'], ['3','3'], ['4','4'], ['5','5'], ['6','6'], ['7','7'], ['8','8'], ['9','9'], ['10','10']],
                    value: '2',
                }, // ENA
                {
                    type: 'Dropdown',
                    options: [['2','2'], ['3','3'], ['4','4'], ['5','5'], ['6','6'], ['7','7'], ['8','8'], ['9','9'], ['10','10']],
                    value: '3',
                }, // A-1A

                {
                    type: 'Dropdown',
                    options: [['2','2'], ['3','3'], ['4','4'], ['5','5'], ['6','6'], ['7','7'], ['8','8'], ['9','9'], ['10','10']],
                    value: '4',
                }, // A-1B
               
            ],
            def: {
                params: [
                    { type: 'Dropdown', value: '2' },
                    { type: 'Dropdown', value: '3' },
                    { type: 'Dropdown', value: '4' },
                ],
                type: 'arduino_Lline_DC_motor_init',
            },
            paramsKeyMap: {
                ENA: 0,
                A1A: 1,
                A1B: 2,
            },
            class: 'LlineMotor',
            isNotFor: ['Lline'],
            func(sprite, script) {
                const ena = Number(script.getField('ENA'));
                const a1a = Number(script.getField('A1A'));
                const a1b = Number(script.getField('A1B'));
                
                if (!Entry.hw.sendQueue.SET) Entry.hw.sendQueue.SET = {};
                Entry.hw.sendQueue.SET[1] = {
                    type: Entry.Lline.sensorTypes.DC_MOTOR_INIT,
                    data: { ena, a1a, a1b},
                    time: new Date().getTime(),
                };
        
                return script.callReturn();
            },
            syntax: {
                text: 'DC 모터 설정 ENA: %1 IN1: %2 IN2: %3',
                textParams: [
                    { type: 'Dropdown', name: 'ENA' },
                    { type: 'Dropdown', name: 'A1A' },
                    { type: 'Dropdown', name: 'A1B' },
                ],
            },
        },

        
        


        arduino_Lline_DC_motor_control: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            params: [
                {
                    type: 'Dropdown',
                    options: [['정방향', 'FORWARD'], ['역방향', 'BACKWARD'], ['정지', 'STOP']],
                    value: 'FORWARD',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
            ],
            def: {
                params: [
                    { type: 'Dropdown', value: 'FORWARD' },
                    { type: 'text', params: ['150'] },
                ],
                type: 'arduino_Lline_DC_motor_control',
            },
            paramsKeyMap: {
                DIR_A: 0,
                SPEED_A: 1,
            },
            class: 'LlineMotor',
            isNotFor: ['Lline'],
            func(sprite, script) {
                const dirA = script.getField('DIR_A');
                const speedA = script.getNumberValue('SPEED_A');
                
        
                if (!Entry.hw.sendQueue.SET) Entry.hw.sendQueue.SET = {};
                Entry.hw.sendQueue.SET[1] = {
                    type: Entry.Lline.sensorTypes.DC_MOTOR_CONTROL,
                    data: { dirA, speedA},
                    time: new Date().getTime(),
                };
        
                return script.callReturn();
            },
            syntax: {
                text: 'DC 모터 A %1 속도 %2',
                textParams: [
                    { type: 'Dropdown', name: 'DIR_A' },
                    { type: 'Block', name: 'SPEED_A' },
                ],
            },
        },


        arduino_Lline_DC_motor_init2: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            params: [
                {
                    type: 'Dropdown',
                    options: [['2','2'], ['3','3'], ['4','4'], ['5','5'], ['6','6'], ['7','7'], ['8','8'], ['9','9'], ['10','10']],
                    value: '2',
                }, // ENA
                {
                    type: 'Dropdown',
                    options: [['2','2'], ['3','3'], ['4','4'], ['5','5'], ['6','6'], ['7','7'], ['8','8'], ['9','9'], ['10','10']],
                    value: '3',
                }, // A-1A

                {
                    type: 'Dropdown',
                    options: [['2','2'], ['3','3'], ['4','4'], ['5','5'], ['6','6'], ['7','7'], ['8','8'], ['9','9'], ['10','10']],
                    value: '4',
                }, // A-1B
               
            ],
            def: {
                params: [
                    { type: 'Dropdown', value: '2' },
                    { type: 'Dropdown', value: '3' },
                    { type: 'Dropdown', value: '4' },
                ],
                type: 'arduino_Lline_DC_motor_init2',
            },
            paramsKeyMap: {
                ENB: 0,
                B1A: 1,
                B1B: 2,
            },
            class: 'LlineMotor',
            isNotFor: ['Lline'],
            func(sprite, script) {
                const enb = Number(script.getField('ENB'));
                const b1a = Number(script.getField('B1A'));
                const b1b = Number(script.getField('B1B'));
                
                if (!Entry.hw.sendQueue.SET) Entry.hw.sendQueue.SET = {};
                Entry.hw.sendQueue.SET[1] = {
                    type: Entry.Lline.sensorTypes.DC_MOTOR_INIT2,
                    data: { enb, b1a, b1b},
                    time: new Date().getTime(),
                };
        
                return script.callReturn();
            },
            syntax: {
                text: 'DC 모터 설정 ENA: %1 IN3: %2 IN4: %3',
                textParams: [
                    { type: 'Dropdown', name: 'ENB' },
                    { type: 'Dropdown', name: 'B1A' },
                    { type: 'Dropdown', name: 'B1B' },
                ],
            },
        },

        
        


        arduino_Lline_DC_motor_control2: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            params: [
                {
                    type: 'Dropdown',
                    options: [['정방향', 'FORWARD'], ['역방향', 'BACKWARD'], ['정지', 'STOP']],
                    value: 'FORWARD',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
            ],
            def: {
                params: [
                    { type: 'Dropdown', value: 'FORWARD' },
                    { type: 'text', params: ['150'] },
                ],
                type: 'arduino_Lline_DC_motor_control2',
            },
            paramsKeyMap: {
                DIR_B: 0,
                SPEED_B: 1,
            },
            class: 'LlineMotor',
            isNotFor: ['Lline'],
            func(sprite, script) {
                const dirB = script.getField('DIR_B');
                const speedB = script.getNumberValue('SPEED_B');
                
        
                if (!Entry.hw.sendQueue.SET) Entry.hw.sendQueue.SET = {};
                Entry.hw.sendQueue.SET[1] = {
                    type: Entry.Lline.sensorTypes.DC_MOTOR_CONTROL2,
                    data: { dirB, speedB},
                    time: new Date().getTime(),
                };
        
                return script.callReturn();
            },
            syntax: {
                text: 'DC 모터 B %1 속도 %2',
                textParams: [
                    { type: 'Dropdown', name: 'DIR_B' },
                    { type: 'Block', name: 'SPEED_B' },
                ],
            },
        },
        

        

        
        
        


        


        




        

    };
};
//endregion Lline 아두이노 확장모드

module.exports = Entry.Lline;
