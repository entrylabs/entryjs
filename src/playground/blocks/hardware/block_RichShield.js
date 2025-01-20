'use strict';

Entry.RichShield = {
    id: '36.2',
    name: 'RichShield',
    url: 'https://gorillacell.kr/',
    imageName: 'RichShield.png',
    title: {
        ko: '아두이노 부자실드',
        en: 'Arduino RichShield',
    },
    setZero() {
        if (!Entry.hw.sendQueue.SET) {
            Entry.hw.sendQueue = {
                SET: {},
            };
        } else {
            const keySet = Object.keys(Entry.hw.sendQueue.SET);
            keySet.forEach((key) => {
                if (Entry.hw.sendQueue.SET[key].type == Entry.RichShield.sensorTypes.DCMOTOR) {
                    Entry.hw.sendQueue.SET[key].data.value1 = 0;
                    Entry.hw.sendQueue.SET[key].time = new Date().getTime();
                } else {
                    Entry.hw.sendQueue.SET[key].data = 0;
                    Entry.hw.sendQueue.SET[key].time = new Date().getTime();
                }
            });
        }
        Entry.hw.sendQueue.GET = {};
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
        DHT: 12,
        DCMOTOR: 13,
        OLED: 14,
        PIR: 15,
        FND: 16,
        IRREMOTE : 19,
        DHT2 : 17,
        RGBLED: 18,
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

Entry.RichShield.setLanguage = function() {
    return {
        ko: {
            Blocks: {
                RichShield_pulldown: '기본',
                RichShield_pullup: '풀업',
                chocopi_control_event_pressed: '누를 때',
                chocopi_control_event_released: '뗄 때',
                chocopi_joystick_X: '조이스틱 좌우',
                chocopi_joystick_Y: '조이스틱 상하',
                chocopi_motion_photogate_event_blocked: '막았을 때',
                chocopi_motion_photogate_event_unblocked: '열었을 때',
                chocopi_motion_photogate_time_blocked: '막은 시간',
                chocopi_motion_photogate_time_unblocked: '연 시간',
                chocopi_motion_angle_x: '각도X',
                chocopi_motion_angle_y: '각도Y',
                chocopi_motion_angle_z: '각도Z',
                chocopi_port: '포트',
                chocopi_pot: '볼륨',
                chocopi_touch_event_touch: '만질 때',
                chocopi_touch_event_untouch: '뗄 때',
                RichShield_lcd_first_line: '첫 번째',
                RichShield_lcd_seconds_line: '두 번째',
                RichShield_toggle_on: '켜기',
                RichShield_toggle_off: '끄기',
            },
            template: {
                RichShield_get_Analog_value: '아날로그 %1 번 핀의 값',
                RichShield_set_digital_toggle: '디지털 %1 번 핀 %2 %3',
                RichShield_get_digital: '디지털 %1 번 핀 센서 %2 값',
                RichShield_get_digital_toggle: '디지털 %1 번 핀 센서 %2 값',
                RichShield_set_digital_pwm: '디지털 PWM %1 번 핀을 %2 (으)로 정하기 %3',

                RichShield_get_digital_ultrasonic: '초음파 Trig %1 핀 Echo %2 핀 센서 값',

                RichShield_set_digital_servo: '디지털 %1 번 핀의 서보모터를 %2 의 각도로 정하기 %3',
                RichShield_set_digital_buzzer: '디지털 %1 번 핀의 버저를 %2 %3 음으로 %4 초 연주하기 %5',

                RichShield_rgbled_event: '네오픽셀 ( 8 Cell ) - 디지털 13번 핀',
                RichShield_rgbled_clr: '네오픽셀  off',
                RichShield_rgbled_set: '%1번 네오픽셀을 빨강 %2 초록 %3 파랑 %4 로 정하기 %5',
                RichShield_rgbled_show: '네오픽셀 적용(표시)',

                RichShield_LCD_event: 'LCD Display(1602-)-I2C',
                RichShield_LCD_Control_init: 'LCD %1 번 : 주소 %2 로 설정',
                RichShield_LCD_Control_Display: 'LCD %1 번 : %2 행 %3 열에 %4 출력 %5',
                RichShield_LCD_Control_Clear: 'LCD %1 번 : 지우기',
                RichShield_LCD_Control_Scroll: 'LCD %1 번 : 화면스크롤 %2',

                RichShield_FND_event: 'FND 4digit (TM1637)- CLK:D5, DIO:D4',
                RichShield_FND_Control_init: 'FND %1 번 : 디지털 CLK %2, DIO %3 번 핀으로 설정',
                RichShield_FND_Control_diplay_brightness: 'FND %1 번 : 밝기 %2 단계로 설정',
                RichShield_FND_Control_display_onoff: 'FND %1 번 : 전원 %2',
                RichShield_FND_Control_diplay_char:
                    'FND %1 번 : %2 출력하기:나머지0채우기 %3  %4 초 대기',
                RichShield_DHT_event: '온습도센서(DHT11/22)-디지털 12번 핀',
                RichShield_DHT_Control_Init_Process: '온습도 %1 번 : 디지털 %2 번 핀 / 버전 %3',
                RichShield_DHT_Control_Get_Temper: '온습도 %1 번  온도값  읽기',
                RichShield_DHT2: '온습도 %1 번 : 습도값 읽기',

                RichShield_OLED_event: 'OLED Display(0.96"16*08)-I2C',
                RichShield_OLED_init: 'OLED : I2C 주소 0X3C로 설정하고, 초기화',
                RichShield_OLED_Display_String: 'OLED : %1 행, %2 열 %3 출력',

                RichShield_IRREMOTE_event: '적외선수신-RECV',
                RichShield_IRREMOTE_init: '적외선 %1번: 디지털 %2번 핀으로 설정~',
                RichShield_IRREMOTE_recv: '적외선 %1 번: 자료 읽기',

            },

        },
        en: {
            Blocks: {
                RichShield_pulldown: 'Pull Down',
                RichShield_pullup: 'Pull Up',
                chocopi_control_event_pressed: 'pressed',
                chocopi_control_event_released: 'released',
                chocopi_joystick_X: 'joystick X',
                chocopi_joystick_Y: 'joystick Y',
                chocopi_motion_photogate_event_blocked: 'blocked',
                chocopi_motion_photogate_event_unblocked: 'unblocked',
                chocopi_motion_photogate_time_blocked: 'blocked',
                chocopi_motion_photogate_time_unblocked: 'unblocked',
                chocopi_motion_angle_x: 'angle X',
                chocopi_motion_angle_y: 'angle Y',
                chocopi_motion_angle_z: 'angle Z',
                chocopi_port: 'P',
                chocopi_pot: 'potentiometer',
                chocopi_touch_event_touch: 'touched',
                chocopi_touch_event_untouch: 'untouched',
                RichShield_lcd_first_line: 'first',
                RichShield_lcd_seconds_line: 'second',
                RichShield_toggle_on: 'on',
                RichShield_toggle_off: 'off',
            },
            template: {
                RichShield_get_Analog_value: 'Get Analog %1 pin value',
                RichShield_set_digital_toggle: 'Digital %1 pin %2 %3',
                RichShield_get_digital: 'Digital %1 pin sensor value %2',
                RichShield_get_digital_toggle: 'Digital %1 pin sensor value %2',
                RichShield_set_digital_pwm: 'Digital pwm %1 Pin %2 %3',

                RichShield_get_digital_ultrasonic: 'Read ultrasonic Trig %1 Echo %2 sensor value',

                RichShield_set_digital_servo: 'Set servo pin %1 angle as %2 %3',
                RichShield_set_digital_buzzer: 'Play tone pin %1 on note %2 octave %3 beat %4 %5',

                RichShield_rgbled_event: 'NeoPixel ( 8 Cell ) - Digital 13 pin',
                RichShield_rgbled_clr: 'NeoPixel off',
                RichShield_rgbled_set: '#%1 NeoPixel Red %2 Green %3 Blue %4 %5',
                RichShield_rgbled_show: 'NeoPixel Update',

                RichShield_LCD_event: 'LCD Display(1602-)-I2C',
                RichShield_LCD_Control_init: 'LCD %1 :  Address set to %2',
                RichShield_LCD_Control_Display: 'LCD %1  : row %2  column %3 display %4 %5',
                RichShield_LCD_Control_Clear: 'LCD %1 : Clear Display',
                RichShield_LCD_Control_Scroll: 'LCD %1 : Display Scroll to %2',

                RichShield_FND_event: 'FND 4digit (TM1637)- CLK:D5, DIO:D4',
                RichShield_FND_Control_init: 'FND %1 : Digital CLK %2  , DIO %3 pin setting',
                RichShield_FND_Control_diplay_brightness: 'FND %1 : Brightness %2 level setting',
                RichShield_FND_Control_display_onoff: 'FND %1 : Power %2',
                RichShield_FND_Control_diplay_char:
                    'FND %1 : %2 display:zero-fill %3  %4 sec waiting',
                RichShield_DHT_event: 'Humidity/Temperature(DHT11/22)-Digital 12 pin',
                RichShield_DHT_Control_Init_Process:
                    'Humidity/Temperature %1 : Digital %2 Pin, Version %3',
                RichShield_DHT_Control_Get_Temper: 'DHT %1 : read Temperature',
                RichShield_DHT2: 'DHT %1 : read Humid',

                RichShield_OLED_event: 'OLED Display(0.96"16*08)-I2C',
                RichShield_OLED_init: 'OLED : I2C adress 0X3C set, initialize',
                RichShield_OLED_Display_String: 'OLED : %1 Row, %2 Col %3 Display',

                RichShield_IRREMOTE_event: 'IR RECV-RECV pin:D2',
                RichShield_IRREMOTE_init: 'IR %1 : Digital recv pin set to %2',
                RichShield_IRREMOTE_recv: 'IR %1 : IR recv',

            },
         },
    };
};

Entry.RichShield.blockMenuBlocks = [
    'RichShield_get_digital',
    'RichShield_get_Analog_value',
    'RichShield_get_digital_toggle',
    'RichShield_get_digital_ultrasonic',

    'RichShield_set_digital_toggle', 
    'RichShield_set_digital_pwm',
    'RichShield_set_digital_servo',
    'RichShield_set_digital_buzzer',


    
    'RichShield_rgbled_event',
    'RichShield_rgbled_clr',
    'RichShield_rgbled_set',
    'RichShield_rgbled_show',

    'RichShield_LCD_event',
    'RichShield_LCD_Control_init',
    'RichShield_LCD_Control_Display',
    'RichShield_LCD_Control_Clear',

    'RichShield_FND_event',
    'RichShield_FND_Control_diplay_brightness',
    'RichShield_FND_Control_display_onoff',
    'RichShield_FND_Control_diplay_char',

    'RichShield_DHT_event',
    'RichShield_DHT_Control_Get_Temper',
    'RichShield_DHT2',


    'RichShield_OLED_event',
    'RichShield_OLED_Display_String',

    'RichShield_IRREMOTE_event',
    'RichShield_IRREMOTE_recv',

];

Entry.RichShield.getBlocks = function() {
    return {
        RichShield_list_digital_basic: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown1',
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
                    value: '5',
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
                return script.getStringField('PORT');
            },
        },
 
        RichShield_list_pullup_setting: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.RichShield_pulldown, '0'],
                        [Lang.Blocks.RichShield_pullup, '255'],
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
            func(sprite, script) {
                return script.getStringField('OPERATOR');
            },
        },
        RichShield_get_digital_ultrasonic: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: Lang.template.RichShield_get_digital_ultrasonic,
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
                        params: ['8'],
                    },
                    {
                        type: 'text',
                        params: ['7'],
                    },
                ],
                type: 'RichShield_get_digital_ultrasonic',
            },
            paramsKeyMap: {
                PORT1: 0,
                PORT2: 1,
            },
            class: 'RichShieldGet',
            isNotFor: ['RichShield'],
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
                Entry.hw.sendQueue['GET'][Entry.RichShield.sensorTypes.ULTRASONIC] = {
                    port: [port1, port2],
                    time: new Date().getTime(),
                };

                return Entry.hw.portData.ULTRASONIC || 0;
            },
            syntax: {
                js: [],
                py: ['RichShield.get_digital_ultrasonic(%1, %2)'],
            },
        },
        RichShield_get_digital: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: Lang.template.RichShield_get_digital,
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
                        type: 'RichShield_list_digital_switch',
                    },
                    {
                        type: 'RichShield_list_pullup_setting',
                    },
                ],
                type: 'RichShield_get_digital',
            },
            paramsKeyMap: {
                PORT: 0,
                OPERATOR: 1,
            },
            class: 'RichShieldGet',
            isNotFor: ['RichShield'],
            func(sprite, script) {
                const port = script.getNumberValue('PORT');
                const opr = script.getNumberValue('OPERATOR');
                //"down = 0" or "up = 2"
                const DIGITAL = Entry.hw.portData.DIGITAL;

                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                if (Entry.hw.sendQueue.SET[port]) {
                    return Entry.hw.sendQueue.SET[port].data;
                } else {
                    Entry.hw.sendQueue.GET[Entry.RichShield.sensorTypes.DIGITAL] = {
                        port,
                        data: opr,
                        time: new Date().getTime(),
                    };
                }
                return DIGITAL ? DIGITAL[port] || 0 : 0;
            },
            syntax: { js: [], py: ['RichShield_get_digital(%1,%2)'] },
        },
        RichShield_get_digital_toggle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            template: Lang.template.RichShield_get_digital_toggle,
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
                        type: 'RichShield_list_digital_switch',
                    },
                    {
                        type: 'RichShield_list_pullup_setting',
                    },
                ],
                type: 'RichShield_get_digital_toggle',
            },
            paramsKeyMap: {
                PORT: 0,
                OPERATOR: 1,
            },
            class: 'RichShieldGet',
            isNotFor: ['RichShield'],
            func(sprite, script) {
                const port = script.getNumberValue('PORT');
                const opr = script.getNumberValue('OPERATOR');
                const DIGITAL = Entry.hw.portData.DIGITAL;

                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                if (Entry.hw.sendQueue.SET[port]) {
                    return Entry.hw.sendQueue.SET[port].data;
                } else {
                    Entry.hw.sendQueue.GET[Entry.Hasseam.sensorTypes.DIGITAL] = {
                        port,
                        data: opr,
                        time: new Date().getTime(),
                    };
                }

                return DIGITAL ? DIGITAL[port] || 0 : 0;
            },
            syntax: { js: [], py: ['RichShield_get_digital_toggle(%1 %2)'] },
        },
        RichShield_list_analog_basic: {
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
        },
        RichShield_get_Analog_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: Lang.template.RichShield_get_Analog_value,
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
                        type: 'RichShield_list_analog_basic',
                    },
                ],
                type: 'RichShield_get_Analog_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'RichShieldGet',
            isNotFor: ['RichShield'],
            func(sprite, script) {
                let port = script.getValue('PORT', script);
                const ANALOG = Entry.hw.portData.ANALOG;

                if (port[0] === 'A') {
                    port = port.substring(1);
                }

                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                Entry.hw.sendQueue.GET[Entry.RichShield.sensorTypes.ANALOG] = {
                    port,
                    time: new Date().getTime(),
                };

                return ANALOG ? ANALOG[port] || 0 : 0;
            },
            syntax: { js: [], py: ['RichShield.Get_Light_Value(%1, %2)'] },
        },
        RichShield_list_digital_basic: {
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
                    value: '5',
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
                return script.getStringField('PORT');
            },
        },
        RichShield_list_digital_pwm: {
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
        RichShield_list_digital_pwm2: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [

                        ['~9', '9'],
                        ['~10', '10'],
                        ['~11', '11'],
                    ],
                    value: '9',
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
        RichShield_list_digital_basic: {
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
        RichShield_list_digital_switch: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['4', '4'],
                        ['5', '5'],                        
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
                PORT: 0,
            },
            func: function(sprite, script) {
                return script.getStringField('PORT');
            },
        },
        RichShield_rgbled_event: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_event',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/start_icon_hardware.svg',
                    size: 14,
                    position: { x: 0, y: -2 },
                },
            ],
            def: { params: [], type: 'RichShield_rgbled_event' },
            class: 'RichShield_rgbled',
            isNotFor: ['RichShield'],
        },
        RichShield_rgbled_clr: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
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
                    null,
                    null,
                ],
                type: 'RichShield_rgbled_clr',
            },
            paramsKeyMap: {
                PORT: 0,
                NO: 1,
                VALUE0: 2,
                VALUE1: 3,
                VALUE2: 4,
            },
            class: 'RichShield_rgbled',
            isNotFor: ['RichShield'],
            func: function(sprite, script) {
                var port = 13;

                if (!script.isStart) {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
                    script.isStart = true;
                    script.timeFlag = 1;
                    const fps = Entry.FPS || 60;
                    const timeValue = (60 / fps) ;

                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.RichShield.sensorTypes.RGBLED,
                        data: {
                            block_Index: 1,
                        },
                        time: new Date().getTime(),
                    };

                    setTimeout(() => {
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
            syntax: { js: [], py: ['RichShield_rgbled_clr(%1)'] },
        },
        RichShield_rgbled_set: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
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
                        params: ['1'],
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
                type: 'RichShield_rgbled_set',
            },
            paramsKeyMap: {
                NO: 0,
                VALUE0: 1,
                VALUE1: 2,
                VALUE2: 3,
            },
            class: 'RichShield_rgbled',
            isNotFor: ['RichShield'],
            func: function(sprite, script) {
                var port = 13;
                var no = script.getNumberValue('NO');
                var value = [3];
                var noValue1;

                let time = new Date().getTime();

                if (!script.isStart) {
                    noValue1 = no - 1;
                    value[0] = script.getNumberValue('VALUE0');
                    value[1] = script.getNumberValue('VALUE1');
                    value[2] = script.getNumberValue('VALUE2');

                    for (var i = 0; i < 3; i++) {
                        value[i] = Math.round(value[i]);
                        value[i] = Math.min(value[i], 255);
                        value[i] = Math.max(value[i], 0);
                    }
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    const fps = Entry.FPS || 60;
                    const timeValue = (60 / fps) ;


                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.RichShield.sensorTypes.RGBLED,
                        data: {
                            block_Index: 2,
                            noValue: noValue1,
                            redValue: value[0],
                            greenValue: value[1],
                            blueValue: value[2],
                        },
                        time: new Date().getTime(),
                    };

                    setTimeout(() => {
                        script.timeFlag = 0;
                    }, timeValue*20);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
                return script.callReturn();
            },
            syntax: { js: [], py: ['RichShield_rgbled_set(%1, %2, %3, %4, %5)'] },
        },
        RichShield_rgbled_show: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
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
                    null,
                    null,
                ],
                type: 'RichShield_rgbled_show',
            },
            paramsKeyMap: {

            },
            class: 'RichShield_rgbled',
            isNotFor: ['RichShield'],
            func: function(sprite, script) {
                var port = 13;

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.RichShield.sensorTypes.RGBLED,
                    data: {
                        block_Index: 3,
                    },
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: { js: [], py: ['RichShield_rgbled_show(%1)'] },
        },
        RichShield_list_digital_servo: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['6', '6'],
                    ],
                    value: '6',
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
        RichShield_list_digital_sound: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['3', '3'],
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
                PORT: 0,
            },
            func: function(sprite, script) {
                return script.getStringField('PORT');
            },
        },
        RichShield_list_digital_octave: {
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
        RichShield_list_digital_toggle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.RichShield_toggle_on, 'on'],
                        [Lang.Blocks.RichShield_toggle_off, 'off'],
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
            func(sprite, script) {
                return script.getStringField('OPERATOR');
            },
        },
        RichShield_set_digital_toggle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.RichShield_set_digital_toggle,
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
                        type: 'RichShield_list_digital_basic',
                    },
                    {
                        type: 'RichShield_list_digital_toggle',
                    },
                    null,
                ],
                type: 'RichShield_set_digital_toggle',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'RichShield_set',
            isNotFor: ['RichShield'],
            func(sprite, script) {
                const port = script.getNumberValue('PORT');
                let value = script.getValue('VALUE');

                if (typeof value === 'string') {
                    value = value.toLowerCase();
                }
                if (Entry.RichShield.highList.indexOf(value) > -1) {
                    value = 255;
                } else if (Entry.RichShield.lowList.indexOf(value) > -1) {
                    value = 0;
                } else {
                    throw new Error();
                }
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[port] = {
                    type: Entry.RichShield.sensorTypes.DIGITAL,
                    data: value,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: { js: [], py: ['RichShield.Set_Digital_Toggle(%1, %2)'] },
        },
        RichShield_set_digital_pwm: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.RichShield_set_digital_pwm,
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
                        type: 'RichShield_list_digital_pwm2',
                    },
                 
                    {
                        type: 'text',
                        params: ['255'],
                    },
                    null,
                ],
                type: 'RichShield_set_digital_pwm',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'RichShield_Set',
            isNotFor: ['RichShield'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var value = script.getNumberValue('VALUE');

                let time = new Date().getTime();

            if (!script.isStart) {
                value = Math.round(value);
                value = Math.min(value, 255);
                value = Math.max(value, 0);
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }

                    script.isStart = true;
                    script.timeFlag = 1;
                    const fps = Entry.FPS || 60;
                    const timeValue = (60 / fps) * 50;

                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.RichShield.sensorTypes.PWM,
                    data: value,
                    time: new Date().getTime(),
                };

                setTimeout(() => {
                        script.timeFlag = 0;
                }, timeValue);
            } else if (script.timeFlag == 1) {
                    return script;
            } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
            }
                return script.callReturn();
            },
            syntax: { js: [], py: ['RichShield.set_digital_pwm(%1, %2)'] },
        },
        RichShield_set_digital_servo: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.RichShield_set_digital_servo,
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
                        type: 'RichShield_list_digital_servo',
                    },
                    {
                        type: 'text',
                        params: ['90'],
                    },
                    null,
                ],
                type: 'RichShield_set_digital_servo',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'RichShield_Set',
            isNotFor: ['RichShield'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var value = script.getNumberValue('VALUE');
                value = Math.min(value, 180);
                value = Math.max(value, 0);

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.RichShield.sensorTypes.SERVO,
                    data: value,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: { js: [], py: ['RichShield.set_digital_servo(%1, %2)'] },
        },
        RichShield_set_digital_buzzer: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.RichShield_set_digital_buzzer,
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
                        type: 'RichShield_list_digital_sound',
                    },
                    {
                        type: 'RichShield_list_digital_tone',
                    },
                    {
                        type: 'RichShield_list_digital_octave',
                    },
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'RichShield_set_digital_buzzer',
            },
            paramsKeyMap: {
                PORT: 0,
                NOTE: 1,
                OCTAVE: 2,
                DURATION: 3,
            },
            class: 'RichShield_Set',
            isNotFor: ['RichShield'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var duration = script.getNumberValue('DURATION');
                var octave = script.getNumberValue('OCTAVE') - 1;
                var value = 0;

                if (!script.isStart) {
                    var note = script.getValue('NOTE');
                    if (!Entry.Utils.isNumber(note)) {
                        note = Entry.RichShield.toneTable[note];
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
                            type: Entry.RichShield.sensorTypes.TONE,
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
                        value = Entry.RichShield.toneMap[note][octave];
                    }

                    duration = duration * 1000;
                    script.isStart = true;
                    script.timeFlag = 1;

                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.RichShield.sensorTypes.TONE,
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
                        type: Entry.RichShield.sensorTypes.TONE,
                        data: 0,
                        time: new Date().getTime(),
                    };
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: ['RichShield.set_digital_toggle(%1, %2, %3, %4)'],
            },
        },
        RichShield_LCD_event: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_event',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/start_icon_hardware.svg',
                    size: 14,
                    position: { x: 0, y: -2 },
                },
            ],
            def: { params: [], type: 'RichShield_LCD_event' },
            class: 'RichShield_LCD',
            isNotFor: ['RichShield'],
        },
        RichShield_LCD_Control_init: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', 1],
                        ['2', 2],
                    ],
                    value: 1,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['0x20', 32],
                        ['0x27', 39],
                        ['0x3f', 63],
                    ],
                    value: 32,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: { params: [], type: 'RichShield_LCD_Control_init' },
            paramsKeyMap: { lcd_device: 0, address: 1 },
            class: 'RichShield_LCD',
            isNotFor: ['RichShield'],
            func(sprite, script) {
                const device = script.getNumberValue('lcd_device', script);
                const addr_val = script.getNumberValue('address', script);

                const text = [];

                // index number patched by Remoted 2020-11-20
                if (!script.isStart) {
                    if (typeof addr_val === 'string') {
                        for (let i = 0; i < 16; i++) {
                            text[i] = string.charAt(i);
                        }
                    } else if (typeof addr_val === 'number') {
                        text[0] = 1;
                        text[1] = addr_val / 1;
                    } else {
                        text[0] = addr_val;
                    }

                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    const fps = Entry.FPS || 60;
                    const timeValue = (60 / fps) * 50;

                    // LCD_Init type data protocol defined
                    Entry.hw.sendQueue.SET[device] = {
                        type: Entry.RichShield.sensorTypes.LCD,
                        data: {
                            block_index:1,
                            text0: text[0],
                            text1: text[1],
                        },
                        time: new Date().getTime(),
                    };

                    setTimeout(() => {
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
            syntax: { js: [], py: ['RichShield_LCD_init(%1, %2)'] },
        },
        RichShield_list_digital_lcd: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.RichShield_lcd_first_line, '0'],
                        [Lang.Blocks.RichShield_lcd_seconds_line, '1'],
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
            func(sprite, script) {
                return script.getField('LINE');
            },
        },

        RichShield_LCD_Control_Display: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            template: Lang.template.RichShield_LCD_Control_Display,
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
                        params: [1],
                    },
                    {
                        type: 'number',
                        params: [1],
                    },
                    {
                        type: 'number',
                        params: [1],
                    },
                    {
                        type: 'text',
                        params: ['RichShield !!'],
                    },
                    null,
                ],
                type: 'RichShield_LCD_Control_Display',
            },
            paramsKeyMap: {
                line: 0,
                Row: 1,
                Col: 2,
                STRING: 3,
            },
            class: 'RichShield_LCD',
            isNotFor: ['RichShield'],
            func(sprite, script) {
                const line = script.getNumberValue('line'); // No used this data in RichShield
                const Row = parseInt(script.getNumberValue('Row'));
                const Col = parseInt(script.getNumberValue('Col'));
                const string = script.getValue('STRING');
                const text = [];

                if (!script.isStart) {
                    if (typeof string === 'string') {
                        for (let i = 0; i < 16; i++) {
                            text[i] = string.charCodeAt(i);
                        }
                    } else if (typeof string === 'number') {
                        text[0] = 1;
                        text[1] = string / 1;
                    } else {
                        text[0] = string;
                    }

                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    const fps = Entry.FPS || 60;
                    const timeValue = (60 / fps) * 60;

                    console.log(
                        `Row : ${Row} / Col : ${Col} / text : ${text}`
                    );

                    Entry.hw.sendQueue.SET[line] = {
                        type: Entry.RichShield.sensorTypes.LCD,
                        data: {
                            block_index: 2,
                            displayRow: Row,
                            displayCol: Col,
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

                    setTimeout(() => {
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
                return script.callReturn();
            },
            syntax: { js: [], py: ['RichShield.LCD_Display(%1, %2, %3, %4)'] },
        },
        RichShield_LCD_Control_Clear: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['1', 1]],
                    value: 1,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: { params: [], type: 'RichShield_LCD_Control_Clear' },
            paramsKeyMap: { lcd_device: 0 },
            class: 'RichShield_LCD',
            isNotFor: ['RichShield'],
            func(sprite, script) {
                const device = script.getNumberValue('lcd_device', script);
                
                let time = new Date().getTime();

                if (!script.isStart) {

                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    const fps = Entry.FPS || 60;
                    const timeValue = (60 / fps) * 50;

                    // LCD_Init type data protocol defined
                    Entry.hw.sendQueue.SET[device] = {
                        type: Entry.RichShield.sensorTypes.LCD,
                        data: {
                            block_index: 3,
                        },
                        time: time,
                    };

                    setTimeout(() => {
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
                return script.callReturn();
            },
            syntax: { js: [], py: ['RichShield_LCD_Control_Clear(%1)'] },
        },
        RichShield_LCD_Control_Scroll: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['1', 1]],
                    value: 1,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['왼쪽', 1],
                        ['오른쪽', 2],
                    ],
                    value: 1,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: { params: [], type: 'RichShield_LCD_Control_Scroll' },
            paramsKeyMap: {
                lcd_device: 0,
                direction: 1,
            },
            class: 'RichShield_LCD',
            isNotFor: ['RichShield'],
            func(sprite, script) {
                const device = script.getNumberValue('lcd_device', script);
                const direction = script.getNumberValue('direction', script);

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }

                // LCD_Init type data protocol defined
                Entry.hw.sendQueue.SET[device] = {
                    type: Entry.RichShield.sensorTypes.LCD,
                    data: {
                        block_index: 4,
                        direction,
                    },
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: { js: [], py: ['RichShield_LCD_Control_Scroll(%1)'] },
        },
        RichShield_FND_event: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_event',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/start_icon_hardware.svg',
                    size: 14,
                    position: { x: 0, y: -2 },
                },
            ],
            def: { params: [], type: 'RichShield_FND_event' },
            class: 'RichShield_FND',
            isNotFor: ['RichShield'],
        },
        RichShield_FND_Control_init: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['1', 1]],
                    value: 1,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [['5', 5]],
                    value: 5,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [['4', 4]],
                    value: 4,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: { params: [], type: 'RichShield_FND_Control_init' },
            paramsKeyMap: { fnd_device: 0, CLK: 1, DIO: 2 },
            class: 'RichShield_FND',
            isNotFor: ['RichShield'],
            func(sprite, script) {
                const device = script.getNumberValue('fnd_device', script);
                const clk_val = script.getNumberValue('CLK', script);
                const dio_val = script.getNumberValue('DIO', script);

                // index number patched by Remoted 2020-11-20
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                // FND_Init type data protocol defined
                Entry.hw.sendQueue.SET[device] = {
                    type: Entry.RichShield.sensorTypes.FND,
                    data: {
                        clk_pin: clk_val,
                        dio_pin: dio_val,
                    },
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: { js: [], py: ['RichShield_FND_init(%1, %2)'] },
        },
        RichShield_FND_Control_diplay_brightness: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['1', 1]],
                    value: 1,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['1', 1],
                        ['2', 2],
                        ['3', 3],
                        ['4', 4],
                        ['5', 5],
                        ['6', 6],
                        ['7', 7],
                    ],
                    value: 3,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: { params: [], type: 'RichShield_FND_Control_diplay_brightness' },
            paramsKeyMap: { fnd_device: 0, level: 1 },
            class: 'RichShield_FND',
            isNotFor: ['RichShield'],
            func(sprite, script) {
                const device = script.getNumberValue('fnd_device', script);
                const level_val = script.getNumberValue('level', script);

                if (!script.isStart) {
                    // index number patched by Remoted 2020-11-20
                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }


                    script.isStart = true;
                    script.timeFlag = 1;
                    const fps = Entry.FPS || 60;
                    const timeValue = (60 / fps) * 50;

                    // FND_Init type data protocol defined
                    Entry.hw.sendQueue.SET[device] = {
                        type: Entry.RichShield.sensorTypes.FND,
                        data: {
                            level_val,
                            block_index: 1,
                        },
                        time: new Date().getTime(),
                    };
                    setTimeout(() => {
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
            syntax: { js: [], py: ['RichShield_FND_Control_diplay_brightness(%1, %2)'] },
        },
        RichShield_FND_Control_display_onoff: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['1', 1]],
                    value: 1,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.RichShield_toggle_off, 0],
                        [Lang.Blocks.RichShield_toggle_on, 1],
                    ],
                    value: 1,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: { params: [], type: 'RichShield_FND_Control_display_onoff' },
            paramsKeyMap: { fnd_device: 0, onoff: 1 },
            class: 'RichShield_FND',
            isNotFor: ['RichShield'],
            func(sprite, script) {
                const device = script.getNumberValue('fnd_device', script);
                const onoff = script.getNumberValue('onoff', script);

                if (!script.isStart) {
                    // index number patched by Remoted 2020-11-20
                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    const fps = Entry.FPS || 60;
                    const timeValue = (60 / fps) * 50;

                    // FND_Init type data protocol defined
                    Entry.hw.sendQueue.SET[device] = {
                        type: Entry.RichShield.sensorTypes.FND,
                        data: {
                            onoff,
                            block_index: 2,
                        },
                        time: new Date().getTime(),
                    };
                    
                    setTimeout(() => {
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
            syntax: { js: [], py: ['RichShield_FND_Control_display_onoff(%1, %2)'] },
        },
        RichShield_FND_Control_diplay_char: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['1', 1]],
                    value: 1,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.RichShield_toggle_off, 0],
                        [Lang.Blocks.RichShield_toggle_on, 1],
                    ],
                    value: 0,
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
                params: [
                    '1',
                    {
                        type: 'number',
                        params: ['1234'],
                    },
                    '0',
                    {
                        type: 'number',
                        params: ['0.1'],
                    },
                ],
                type: 'RichShield_FND_Control_diplay_char',
            },
            events: {},
            paramsKeyMap: { fnd_device: 0, display_value: 1, onoff: 2, delay_ms: 3 },
            class: 'RichShield_FND',
            isNotFor: ['RichShield'],
            func(sprite, script) {
                const device = script.getNumberValue('fnd_device', script);
                const display_str = script.getNumberValue('display_value', script);
                const onoff = script.getNumberValue('onoff', script);
                const delay_ms_sec = script.getNumberValue('delay_ms', script);
                const splited_array = [];
                let display_str_converted = 0;

                if (!script.isStart) {
                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }

                    display_str_converted = display_str.toString();

                    script.isStart = true;
                    script.timeFlag = 1;
                    const fps = Entry.FPS || 60;
                    const timeValue = (60 / fps) * 100;

                    for (let i = 0; i < display_str_converted.length; i++) {
                        splited_array.push(parseInt(display_str_converted.charAt(i)));
                    }

                    console.log(`splited_array :${splited_array}`);

                    // FND_Init type data protocol defined
                    Entry.hw.sendQueue.SET[device] = {
                        type: Entry.RichShield.sensorTypes.FND,
                        data: {
                            display_str,
                            onoff,
                            block_index: 3,
                            str_length: display_str_converted.length,
                            data_0: splited_array[0],
                            data_1: splited_array[1],
                            data_2: splited_array[2],
                            data_3: splited_array[3],
                            delay_ms: delay_ms_sec,
                        },
                        time: new Date().getTime(),
                    };

                        
                    setTimeout(() => {
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
            syntax: { js: [], py: ['RichShield_FND_Control_diplay_char(%1, %2, %3, %4)'] },
        },
        RichShield_DHT_event: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_event',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/start_icon_hardware.svg',
                    size: 14,
                    position: { x: 0, y: -2 },
                },
            ],
            def: { params: [], type: 'RichShield_DHT_event' },
            class: 'RichShield_DHT',
            isNotFor: ['RichShield'],
        },
        RichShield_DHT_Control_Init_Process: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    value: 1,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [['13', 13]],
                    value: 13,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [['DHT11', 4]],
                    value: 4,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: { params: [], type: 'RichShield_DHT_Control_Init_Process' },
            class: 'RichShield_DHT',
            isNotFor: ['RichShield'],
            paramsKeyMap: { dht_device: 0, pin: 1, ver: 2 },
            class: 'RichShield_DHT',
            isNotFor: ['RichShield'],
            func(sprite, script) {
                const device = script.getNumberValue('dht_device', script);
                const dht_val = script.getNumberValue('pin', script);
                const ver_val = script.getNumberValue('ver', script);

                // index number patched by Remoted 2020-11-20
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                // DHT_Init type data protocol defined
                Entry.hw.sendQueue.SET[device] = {
                    type: Entry.RichShield.sensorTypes.DHT,
                    data: {
                        dht_pin: dht_val,
                        ver_info: ver_val,
                        dht_block_index: 0,
                    },
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: { js: [], py: ['RichShield_DHT_Control_Init_Process(%1, %2, %3)'] },
        },

        RichShield_DHT_Control_Get_Temper: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    value: 1,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: { params: [], type: 'RichShield_DHT_Control_Get_Temper' },
            paramsKeyMap: { dht_device: 0},
            class: 'RichShield_DHT',
            isNotFor: ['RichShield'],
            func(sprite, script) {
                const device = script.getNumberValue('dht_device', script);
                const port = 12;

                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }

                // DHT Temp-Reader type data protocol defined
                Entry.hw.sendQueue.GET[Entry.RichShield.sensorTypes.DHT] = {
                    port,
                    //tempMode: tempType,
                    dht_block_index: 0,
                    time: new Date().getTime(),
                };

                console.log((Entry.hw.portData.DHT || 0).toFixed(1));
                return (Entry.hw.portData.DHT || 0).toFixed(0);
            },
            syntax: { js: [], py: ['RichShield_DHT_Control_Get_Temper(%1, %2)'] },
        },

        RichShield_OLED_event: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_event',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/start_icon_hardware.svg',
                    size: 14,
                    position: { x: 0, y: -2 },
                },
            ],
            def: { params: [], type: 'RichShield_OLED_event' },
            class: 'RichShield_OLED',
            isNotFor: ['RichShield'],
        },
        RichShield_OLED_init: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/start_icon_hardware.svg',
                    size: 14,
                    position: { x: 0, y: -2 },
                },
            ],
            def: { params: [], type: 'RichShield_OLED_init' },
            paramsKeyMap: {},
            class: 'RichShield_OLED',
            isNotFor: ['RichShield'],
            func(sprite, script) {
                const device = 1;
                // OLED Block Added By Remoted 2021-03-16
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }

                // DHT Temp-Reader type data protocol defined
                Entry.hw.sendQueue.SET[device] = {
                    type: Entry.RichShield.sensorTypes.OLED,
                    data: {
                        oled_block_index: 0,
                    },
                    time: new Date().getTime(),
                };
            },
            syntax: { js: [], py: ['RichShield_OLED_init(0x3C)'] },
        },
        RichShield_OLED_Display_String: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
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
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'number',
                        params: [1],
                    },
                    {
                        type: 'number',
                        params: [1],
                    },
                    {
                        type: 'text',
                        params: ['RichShield !!'],
                    },
                    null,
                ],
                type: 'RichShield_OLED_Display_String',
            },
            paramsKeyMap: {
                Row: 0,
                Col: 1,
                STRING: 2,
            },
            class: 'RichShield_OLED',
            isNotFor: ['RichShield'],
            func(sprite, script) {
                const device = 1;
                const Row = parseInt(script.getNumberValue('Row'));
                const Col = parseInt(script.getNumberValue('Col'));
                const string = script.getValue('STRING');
                const text = [];

                if (!script.isStart) {
                    if (typeof string === 'string') {
                        for (let i = 0; i < 16; i++) {
                            text[i] = string.charCodeAt(i);
                        }
                    } else if (typeof string === 'number') {
                        text[0] = 1;
                        text[1] = string / 1;
                    } else {
                        text[0] = string;
                    }

                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    const fps = Entry.FPS || 60;
                    const timeValue = (60 / fps) * 50;

                    console.log(
                        `Row : ${Row} / Col : ${Col} / text : ${text}`
                    );

                    Entry.hw.sendQueue.SET[device] = {
                        type: Entry.RichShield.sensorTypes.OLED,
                        data: {
                            oled_block_index: 1,
                            displayRow: Row,
                            displayCol: Col,
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

                    setTimeout(() => {
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
            syntax: { js: [], py: ['RichShield_OLED_Display_String(%1, %2, %3)'] },
        },
                
        RichShield_IRREMOTE_event: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_event',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/start_icon_hardware.svg',
                    size: 14,
                    position: { x: 0, y: -2 },
                },
            ],
            def: { params: [], type: 'RichShield_IRREMOTE_event' },
            class: 'RichShield_IR',
            isNotFor: ['RichShield'],
        },

        RichShield_IRREMOTE_init: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    value: 1,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    value: 2,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: { params: [], type: 'RichShield_IRREMOTE_init' },
            paramsKeyMap: { ir_device: 0, pin: 1 },
            class: 'RichShield_IR',
            isNotFor: ['RichShield'],
            func(sprite, script) {
                const device = script.getNumberValue('ir_device', script);
                const ir_val = script.getNumberValue('pin', script);
                let time = new Date().getTime();

                // index number patched by Remoted 2020-11-20
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                // IR_Init type data protocol defined
                Entry.hw.sendQueue.SET[device] = {
                    type: Entry.RichShield.sensorTypes.IRREMOTE,
                    data: {
                        ir_pin: ir_val,
                        ir_block_index: 0,
                    },
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: { js: [], py: ['RichShield_IRREMOTE_init(%1, %2)'] },
        },


        RichShield_IRREMOTE_recv: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    value: 2,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: { params: [], type: 'RichShield_IRREMOTE_recv' },
            paramsKeyMap: { ir_device: 0 },
            class: 'RichShield_IR',
            isNotFor: ['RichShield'],
            func(sprite, script) {
                const device = script.getNumberValue('ir_device', script);
                const port = 12;

                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }

                // DHT Temp-Reader type data protocol defined
                Entry.hw.sendQueue.GET[Entry.RichShield.sensorTypes.IRREMOTE] = {
                    port,
                    dir:123,
                    //dht_block_index: 2,
                    time: new Date().getTime(),
                };

                console.log((Entry.hw.portData.IRREMOTE || 0).toFixed(1));

                return (Entry.hw.portData.IRREMOTE || 0).toFixed(0);

            },
            syntax: { js: [], py: ['RichShield_IRREMOTE_recv(%1, %2)'], },
        },

        RichShield_DHT2: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    value: 1,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: { params: [], type: 'RichShield_DHT2' },
            paramsKeyMap: { ir_device: 0 },
            class: 'RichShield_DHT',
            isNotFor: ['RichShield'],
            func(sprite, script) {
                const device = script.getNumberValue('ir_device', script);
                const port = 12;

                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }

                // DHT Temp-Reader type data protocol defined
                Entry.hw.sendQueue.GET[Entry.RichShield.sensorTypes.DHT2] = {
                    port,
                    dir:123,
                    time: new Date().getTime(),
                };

                console.log((Entry.hw.portData.DHT2 || 0).toFixed(1));

                return (Entry.hw.portData.DHT2 || 0).toFixed(0);
            },
            syntax: { js: [], py: ['RichShield_DHT2(%1, %2)'] },
        },    

    };
};
module.exports = Entry.RichShield;
