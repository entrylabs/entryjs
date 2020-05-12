'use strict';

Entry.Lecoboard = {
    id: '3C.1',
    name: 'lecoboard',
    url: 'http://www.arduino.cc/',
    imageName: 'lecoboard.png',
    title: {
        ko: '레코보드',      
        en: 'LECOBOARD',      
    },
    setZero() {
        Entry.hw.sendQueue.readablePorts = [];
        for (var port = 0; port < 34; port++) {

            if (port == 13 || port == 14 || port == 15 || port == 16 || port == 33) {
                Entry.hw.sendQueue[port] = 1;
            }
            else if (port == 17) {
                Entry.hw.sendQueue[port] = 0;
            }           
            else {
                Entry.hw.sendQueue[port] = 0;
                Entry.hw.sendQueue.readablePorts.push(port);
            }            
        }
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
        LCD: 9,
        LCD_COMMAND: 10,  
        BLE_WRITE: 11,
        BLE_READ: 12,
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
        'C2': 13,
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
        '13': [65, 131, 262, 523, 1046, 2093, 4186, 8372],
    },
    highList: ['high', '1', 'on'],
    lowList: ['low', '0', 'off'],
    BlockState: {},
    monitorTemplate: {
        //imgPath: 'hw/lecoboard.png',
        //keys: ['value'],
        width: 800,
        height: 600,
        listPorts: {
            BLE_READ: {
                name: '블루투스',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            ULTRASONIC: {
                name: '초음파센서',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '4': {
                name: '버튼입력',
                type: 'input',
                pos: { x: 0, y: 0 },
            },            
            a0: {
                name: '조도센서',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            a1: {
                name: '가변저항',
                type: 'input',
                pos: { x: 200, y: 0 },
            },
            a2: {
                name: '온도센서',
                type: 'input',
                pos: { x: 400, y: 0 },
            },
            a7: {
                name: '습도센서',
                type: 'input',
                pos: { x: 600, y: 0 },
            },
            a3: {
                name: '아날로그1',
                type: 'input',
                pos: { x: 0, y: 500 },
            },
            a4: {
                name: '아날로그2',
                type: 'input',
                pos: { x: 200, y: 500 },
            },
            a5: {
                name: '아날로그3',
                type: 'input',
                pos: { x: 400, y: 500 },
            }, 
            a6: {
                name: '아날로그4',
                type: 'input',
                pos: { x: 600, y: 500 },
            },     
            '28': {
                name: '입력1',
                type: 'input',
                pos: { x: 0, y: 400 },
            },
            '29': {
                name: '입력2',
                type: 'input',
                pos: { x: 200, y: 400 },
            },
            '1': {
                name: '입력3',
                type: 'input',
                pos: { x: 400, y: 400 },
            },
            '0': {
                name: '입력4',
                type: 'input',
                pos: { x: 600, y: 400 },
            },
            
        },
        mode: 'both',
    },
};

Entry.Lecoboard.setLanguage = function() {
    return {
        ko: {
            template: {
                lecoboard_button_read: '버튼 읽어오기',
                lecoboard_button_read_bool: '버튼 읽어오기',
                lecoboard_ultrasonic_read: '초음파센서 읽어오기',
                lecoboard_cds_read: '조도센서 읽어오기',
                lecoboard_var_read: '가변저항 읽어오기',
                lecoboard_ir_read: '습도센서 읽어오기',
                lecoboard_temp_read: '온도센서 읽어오기',
                lecoboard_analog_read: '아날로그입력 %1 읽어오기',
                lecoboard_digital_read: '디지털 %1 읽어오기',
                lecoboard_dual_led_color_toggle: 'LED %1 색으로 정하기 %2',
                lecoboard_dual_led_toggle: 'LED 녹색 %1 빨강 %2 으로 정하기 %3',
                lecoboard_led_rgb_toggle: 'RGB LED R%1 G%2 B%3 %4',
                lecoboard_led_strip_toggle: 'LED 스트립 빨강%1 녹색%2 파랑%3 노랑%4 %5',
                lecoboard_set_tone: '부저를 %1 음으로 %2 박자로 연주하기 %3',
                lecoboard_set_tone_long: '부저를 %1 음으로 연주하기 %2',
                lecoboard_set_freq_tone: '신호음 %1번핀에서 %2 주파수로 %3 동안 연주하기 %4',
                lecoboard_set_tone_off: '부저 끄기 %1',
                lecobaord_set_servo: '%1번 서보모터 %2°로 정하기 %3',
                lecoboard_dc_motor: '%1번 DC모터 %2방향으로 속력%3 으로 정하기 %4',
                lecoboard_dc_motor_stop: 'DC 모터 정지하기',
                lecoboard_digital_write: '디지털 %1번핀에 %2 보내기 %3',
                lecoboard_digital_pwm: 'PWM %1 번핀에 %2 보내기 %3',
                lecoboard_convert_value: '%1의 값을 %2부터 %3까지의 값으로 변환하기 %4',
                lecoboard_lcd_command: 'LCD 설정 %1 %2',
                lecoboard_set_lcd: 'LCD %1번째줄 %2번째칸에 %3을 출력하기 %4',
                lecoboard_send_ble: '블루투스로 %1을 보내기 %2',
                lecoboard_get_bluetooth: '블루투스에서 읽어오기'
                /*
                lecoboard_dc_motor_for_sec: '%1번 DC모터 %2방향으로 속력%3 으로 %4초 동안 동작하기 %5',*/
            },
        },
        en: {
            template: {
                lecoboard_button_read: 'Button value',
                lecoboard_button_read_bool: 'Button value',
                lecoboard_ultrasonic_read: 'Read ultrasonic sensor',
                lecoboard_cds_read: 'Read cds sensor',
                lecoboard_var_read: 'Read var sensor',
                lecoboard_ir_read: 'Read  Humidity sensor',
                lecoboard_temp_read: 'Read temperature sensor',
                lecoboard_analog_read: 'Read Analog Input %1',
                lecoboard_digital_read: 'Read Digital %1 Pin',
                lecoboard_dual_led_color_toggle: 'LED %1 color %2',
                lecoboard_dual_led_toggle: 'LED green %1 red %2 value %3',
                lecoboard_set_tone: 'buzzer %1 tone %2 sec play %3',
                lecoboard_led_rgb_toggle: 'RGB LED R%1 G%2 B%3 %4',
                lecoboard_led_strip_toggle: 'LED strip red%1 green%2 blue%3 yellow%4 %5',
                lecoboard_set_tone_long: 'buzzer %1 tone play %2',
                lecoboard_set_freq_tone: 'buzzer %1 pin %2 Hz %3 ms %4',
                lecoboard_set_tone_off: 'buzzer off',
                lecobaord_set_servo: '%1 Sevomotor angle as %2 %3',
                lecoboard_dc_motor: '%1 DC motor direction %2 speed %3 %4',
                /*
                lecoboard_dc_motor_for_sec: '%1 DC motor direction %2 speed %3 sec %4 %5', */
                lecoboard_dc_motor_stop: 'DC motor stop',
                lecoboard_digital_write: 'Digital %1 port as %2 %3',
                lecoboard_digital_pwm: 'PWM %1 pin %2 out %3',
                lecoboard_convert_value: 'Convert value %1 from %2 to %3 %4',
                lecoboard_lcd_command: 'Set LCD cmd %1 %2',
                lecoboard_set_lcd: 'Set LCD data %1 %2 %3 %4',
                lecoboard_send_ble: 'BLE print %1 %2',
                lecoboard_get_bluetooth: 'Read from BLE'
            },
        },
    };
};

Entry.Lecoboard.blockMenuBlocks = [
    'lecoboard_led_rgb_toggle',
    'lecoboard_dual_led_color_toggle',
    'lecoboard_dual_led_toggle',      
    'lecoboard_led_strip_toggle',
    'lecoboard_button_read_bool',
    'lecoboard_button_read',    
    'lecoboard_ultrasonic_read',
    'lecoboard_cds_read',
    'lecoboard_var_read',
    'lecoboard_ir_read',
    'lecoboard_temp_read',
    'lecoboard_analog_read',
    'lecoboard_digital_read',
    'lecoboard_convert_value',
    'lecoboard_set_tone',
    'lecoboard_set_tone_long',
    'lecoboard_set_freq_tone',
    'lecoboard_set_tone_off',
    'lecobaord_set_servo',
    'lecoboard_dc_motor',
    //'lecoboard_dc_motor_for_sec',
    'lecoboard_dc_motor_stop',
    'lecoboard_digital_write',
    'lecoboard_digital_pwm',    
    'lecoboard_lcd_command',
    'lecoboard_set_lcd',
    'lecoboard_send_ble',
    'lecoboard_get_bluetooth'
    
];


Entry.Lecoboard.getBlocks = function() {
    return {
        lecoboard_port_highlow_list: {
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
                PORTVALUE: 0,
            },
            func(sprite, script) {
                return script.getField('PORTVALUE');
            },
        },
        lecoboard_digital_write: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    //accept: 'string',
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
                        type: 'lecoboard_servomotor_list',
                        params: [1],
                    },
                    {
                        type: 'arduino_get_digital_toggle',
                        params: ['on'],
                    },
                    null,
                ],
                type: 'lecoboard_digital_write',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'lecoboardTest',
            isNotFor: ['lecoboard'],
            func(sprite, script) {
                let port = script.getNumberValue('PORT');
                let value = script.getValue('VALUE');

                if (port == 1) port = 28;
                else if (port == 2) port = 29;
                else if (port == 3) port = 1;
                else if (port == 4) port = 0;

                /*
                if (value == 1) value = 255;
                else value = 0;

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[port] = {
                    type: Entry.ArduinoExt.sensorTypes.DIGITAL,
                    data: value,
                    time: new Date().getTime(),
                };
                */

                if (typeof value === 'string') value = value.toLowerCase();
                if (Entry.Lecoboard.highList.indexOf(value) > -1) value = 255;
                else if (Entry.Lecoboard.lowList.indexOf(value) > -1) value = 0;
                else throw new Error();
                if (!Entry.hw.sendQueue.SET) Entry.hw.sendQueue.SET = {};
                Entry.hw.sendQueue.SET[port] = {
                    type: Entry.Lecoboard.sensorTypes.DIGITAL,
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
        lecoboard_digital_pwm: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    //accept: 'string',
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
                        type: 'lecoboard_servomotor_list',
                        params: [1],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'lecoboard_digital_pwm',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'lecoboardTest',
            isNotFor: ['lecoboard'],
            func(sprite, script) {
                let port = script.getNumberValue('PORT');
                let value = script.getNumberValue('VALUE');

                if (port == 1) port = 28;
                else if (port == 2) port = 29;
                else if (port == 3) port = 1;
                else if (port == 4) port = 0;

                value = 255 * (value / 100);
                value = Math.round(value);
                value = Math.max(value, 0);
                value = Math.min(value, 100);

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[port] = {
                    type: Entry.ArduinoExt.sensorTypes.PWM,
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
        lecoboard_analog_input_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [                        
                        ['1', '3'],
                        ['2', '4'],
                        ['3', '5'],
                        ['4', '6'],
                    ],
                    value: '3',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [3],
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
                                    ['1', '3'],
                                    ['2', '4'],
                                    ['3', '5'],
                                    ['4', '6'],

                                ],
                                value: '3',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'lecoboard_analog_input_list',
                    },
                ],
            },
        },
        lecoboard_button_read_bool: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            params: [
                {
                type: 'TextInput',
                },
            ],
            events: {},
            def: {
                params: ['4'],
                type: 'lecoboard_button_read_bool',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'LecoboardAnalogRead',
            isNotFor: ['lecoboard'],
            func(sprite, script) {
                const port = 4;
                const DIGITAL = Entry.hw.portData.DIGITAL;
                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                Entry.hw.sendQueue.GET[Entry.Lecoboard.sensorTypes.DIGITAL] = {
                    port,
                    time: new Date().getTime(),
                };
                let value = DIGITAL[port];
                if (value == 0) value = 1;
                else value = 0;
                return value;
            },
        },
        lecoboard_button_read: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            params: [
                {
                    type: 'TextInput',
                },
            ],
            events: {},
            def: {
                params: ['4'],
                type: 'lecoboard_button_read',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'LecoboardAnalogRead',
            isNotFor: ['lecoboard'],
            func(sprite, script) {
                const port = 4;
                const DIGITAL = Entry.hw.portData.DIGITAL;
                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                Entry.hw.sendQueue.GET[Entry.Lecoboard.sensorTypes.DIGITAL] = {
                    port,
                    time: new Date().getTime(),
                };
                let value = DIGITAL[port];
                if (value == 0) value = 1;
                else value = 0;
                return value;
                //return DIGITAL ? DIGITAL[port] || 0 : 1;
            },
        },
        lecoboard_ultrasonic_read: {
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
                type: 'lecoboard_ultrasonic_read',
            },
            paramsKeyMap: {
                PORT1: 0,
                PORT2: 1,
            },
            class: 'LecoboardAnalogRead',
            isNotFor: ['lecoboard'],
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
                Entry.hw.sendQueue.GET[Entry.ArduinoExt.sensorTypes.ULTRASONIC] = {
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
        lecoboard_analog_read: {
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
                        type: 'lecoboard_analog_input_list',
                        params: ['3'],
                    }
                ],
                type: 'lecoboard_analog_read',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'LecoboardAnalogRead',
            isNotFor: ['lecoboard'],
            func(sprite, script) {
                let port = script.getValue('PORT', script);
                const ANALOG = Entry.hw.portData.ANALOG;
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
        lecoboard_cds_read: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [],
                type: 'lecoboard_cds_read',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'LecoboardAnalogRead',
            isNotFor: ['lecoboard'],
            func(sprite, script) {
                let port = 0;
                const ANALOG = Entry.hw.portData.ANALOG;
                return ANALOG ? ANALOG[port] || 0 : 0;

            },
        },
        lecoboard_var_read: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [],
                type: 'lecoboard_var_read',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'LecoboardAnalogRead',
            isNotFor: ['lecoboard'],
            func(sprite, script) {
                let port = 1;
                const ANALOG = Entry.hw.portData.ANALOG;
                return ANALOG ? ANALOG[port] || 0 : 0;

            },
        },
        lecoboard_ir_read: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [],
                type: 'lecoboard_ir_read',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'LecoboardAnalogRead',
            isNotFor: ['lecoboard'],
            func(sprite, script) {
                if (!Entry.hw.sendQueue.SET) Entry.hw.sendQueue.SET = {};
                Entry.hw.sendQueue.SET[7] = {
                    type: Entry.Lecoboard.sensorTypes.DIGITAL,
                    data: 1,
                    time: new Date().getTime(),
                };

                let port = 2;
                const ANALOG = Entry.hw.portData.ANALOG;
                return ANALOG ? ANALOG[port] || 0 : 0;

            },
        },
        lecoboard_temp_read: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [],
                type: 'lecoboard_temp_read',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'LecoboardAnalogRead',
            isNotFor: ['lecoboard'],
            func(sprite, script) {
                let port = 7;
                const ANALOG = Entry.hw.portData.ANALOG;
                return ANALOG ? ANALOG[port] || 0 : 0;

            },
        },       
        lecoboard_digital_port_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', '28'],
                        ['2', '29'],
                        ['3', '1'],
                        ['4', '0'],
                    ],
                    value: '28',
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
        lecoboard_digital_read: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
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
                        type: 'lecoboard_digital_port_list',
                        params: [28],
                    },
                ],
                type: 'lecoboard_digital_read',
            },
            paramsKeyMap: {     
                PORT: 0,
            },
            class: 'LecoboardAnalogRead',
            isNotFor: ['lecoboard'],
            func(sprite, script) {
                const { hwModule = {} } = Entry.hw;
                const { name } = hwModule;

                const port = script.getNumberValue('PORT', script);
                const DIGITAL = Entry.hw.portData.DIGITAL;

                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                Entry.hw.sendQueue.GET[Entry.Lecoboard.sensorTypes.DIGITAL] = {
                    port,
                    time: new Date().getTime(),
                };
                let value = DIGITAL[port];
                if (value == 0) value = 1;
                else value = 0;
                return value;

            },
        },
        lecoboard_convert_value: {
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
                    {
                        type: 'number',
                        params: ['180'],
                    },
                    null,
                ],
                type: 'lecoboard_convert_value',
            },
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
                VALUE3: 2,
            },
            class: 'LecoboardAnalogRead',
            isNotFor: ['lecoboard'],
            func: function (sprite, script) {
                var value1 = script.getNumberValue('VALUE1', script);
                var value2 = script.getNumberValue('VALUE2', script);
                var value3 = script.getNumberValue('VALUE3', script);

                var stringValue2 = script.getValue('VALUE2', script);
                var stringValue3 = script.getValue('VALUE3', script);
                var isFloat = false;

                if (
                    (Entry.Utils.isNumber(stringValue2) && stringValue2.indexOf('.') > -1) ||
                    (Entry.Utils.isNumber(stringValue3) && stringValue3.indexOf('.') > -1)
                ) {
                    isFloat = true;
                }

                var result = value1;
                if (value2 > value3) {
                    var swap = value2;
                    value2 = value3;
                    value3 = swap;
                }
                result = result * ((value3 - value2) / (1023 - 0));
                result += value2;
                result = Math.min(value3, result);
                result = Math.max(value2, result);

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
                        syntax: 'Arduino.convert_scale(%1, %2, %3)',
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
                        ],
                    },
                ],
            },
        },
        lecoboard_dual_color_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['녹색', '1'],
                        ['빨강', '2'],
                        ['오렌지', '3'],
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
                COLOR: 0,
            },
            func(sprite, script) {
                return script.getField('COLOR');
            },
        },

        lecoboard_dual_led_color_toggle: {
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
                        type: 'lecoboard_dual_color_list',
                        params: [1],
                    },
                    null,
                ],
                type: 'lecoboard_dual_led_color_toggle',
            },
            paramsKeyMap: {
                COLOR : 0,
            },
            class: '0lecoboard_led',
            isNotFor: ['lecoboard'],
            func(sprite, script) {
                const port1 = 17;
                const port2 = 33;
                let value1 = 0; //script.getValue('VALUE1');
                let value2 = 0; //script.getValue('VALUE2');
                let color = script.getValue('COLOR');

                if (color == 1) { value1 = 255; value2 = 0; }
                else if (color == 2) { value1 = 0; value2 = 255; }
                else if (color == 3) { value1 = 255; value2 = 255; }

                if (!Entry.hw.sendQueue.SET) Entry.hw.sendQueue.SET = {};
                Entry.hw.sendQueue.SET[port1] = {
                    type: Entry.Lecoboard.sensorTypes.DIGITAL,
                    data: value1,
                    time: new Date().getTime(),
                };
                if (!Entry.hw.sendQueue.SET) Entry.hw.sendQueue.SET = {};
                Entry.hw.sendQueue.SET[port2] = {
                    type: Entry.Lecoboard.sensorTypes.DIGITAL,
                    data: value2,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.digitalWrite(%1)',
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
        lecoboard_dual_led_toggle: {
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
                        params: ['on'],
                    },
                    {
                        type: 'arduino_get_digital_toggle',
                        params: ['on'],
                    },
                    null,
                ],
                type: 'lecoboard_dual_led_toggle',
            },
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
            },
            class: '0lecoboard_led',
            isNotFor: ['lecoboard'],
            func(sprite, script) {
                const port1 = 17;
                const port2 = 33;
                let value1 = script.getValue('VALUE1');
                let value2 = script.getValue('VALUE2');

                if (typeof value1 === 'string') value1 = value1.toLowerCase();
                if (Entry.Lecoboard.highList.indexOf(value1) > -1) value1 = 255;
                else if (Entry.Lecoboard.lowList.indexOf(value1) > -1) value1 = 0;
                else throw new Error();                
                if (!Entry.hw.sendQueue.SET) Entry.hw.sendQueue.SET = {};
                Entry.hw.sendQueue.SET[port1] = {
                    type: Entry.Lecoboard.sensorTypes.DIGITAL,
                    data: value1,
                    time: new Date().getTime(),
                };
                if (typeof value2 === 'string') value2 = value2.toLowerCase();
                if (Entry.Lecoboard.highList.indexOf(value2) > -1) value2 = 255;
                else if (Entry.Lecoboard.lowList.indexOf(value2) > -1) value2 = 0;
                else throw new Error();
                if (!Entry.hw.sendQueue.SET) Entry.hw.sendQueue.SET = {};
                Entry.hw.sendQueue.SET[port2] = {
                    type: Entry.Lecoboard.sensorTypes.DIGITAL,
                    data: value2,
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
        lecoboard_led_rgb_toggle: {
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
                            events: { },
        def: {
            params: [
                {
                    type: 'arduino_get_digital_toggle',
                    params: ['on'],
                },
                {
                    type: 'arduino_get_digital_toggle',
                    params: ['on'],
                },
                {
                    type: 'arduino_get_digital_toggle',
                    params: ['on'],
                },
                null,
            ],
            type: 'lecoboard_led_rgb_toggle',
            },
        paramsKeyMap: {
            VALUE1: 0,
                VALUE2: 1,
                    VALUE3: 2
            },
        class: '0lecoboard_led',
            isNotFor: ['lecoboard'],
                func(sprite, script) {
            const port1 = 16;
            const port2 = 15;
            const port3 = 14;
            let value1 = script.getValue('VALUE1');
            let value2 = script.getValue('VALUE2');
            let value3 = script.getValue('VALUE3');

            if (typeof value1 === 'string') value1 = value1.toLowerCase();
            if (Entry.Lecoboard.highList.indexOf(value1) > -1) value1 = 255;
            else if (Entry.Lecoboard.lowList.indexOf(value1) > -1) value1 = 0;
            else throw new Error();
            if (!Entry.hw.sendQueue.SET) Entry.hw.sendQueue.SET = {};
            Entry.hw.sendQueue.SET[port1] = {
                type: Entry.Lecoboard.sensorTypes.DIGITAL,
                data: value1,
                time: new Date().getTime(),
            };
            if (typeof value2 === 'string') value2 = value2.toLowerCase();
            if (Entry.Lecoboard.highList.indexOf(value2) > -1) value2 = 255;
            else if (Entry.Lecoboard.lowList.indexOf(value2) > -1) value2 = 0;
            else throw new Error();
            if (!Entry.hw.sendQueue.SET) Entry.hw.sendQueue.SET = {};
            Entry.hw.sendQueue.SET[port2] = {
                type: Entry.Lecoboard.sensorTypes.DIGITAL,
                data: value2,
                time: new Date().getTime(),
            };
            if (typeof value3 === 'string') value3 = value3.toLowerCase();
            if (Entry.Lecoboard.highList.indexOf(value3) > -1) value3 = 255;
            else if (Entry.Lecoboard.lowList.indexOf(value3) > -1) value3 = 0;
            else throw new Error();
            if (!Entry.hw.sendQueue.SET) Entry.hw.sendQueue.SET = {};
            Entry.hw.sendQueue.SET[port3] = {
                type: Entry.Lecoboard.sensorTypes.DIGITAL,
                data: value3,
                time: new Date().getTime(),
            };

            return script.callReturn();
        },

    },
        lecoboard_led_strip_toggle: {
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
                        type: 'arduino_get_digital_toggle',
                        params: ['on'],
                    },
                    {
                        type: 'arduino_get_digital_toggle',
                        params: ['on'],
                    },
                    {
                        type: 'arduino_get_digital_toggle',
                        params: ['on'],
                    },
                    {
                        type: 'arduino_get_digital_toggle',
                        params: ['on'],
                    },
                    null,
                ],
                type: 'lecoboard_led_strip_toggle',
            },
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
                VALUE3: 2,
                VALUE4: 3,
            },
            class: '0lecoboard_led',
            isNotFor: ['lecoboard'],
            func(sprite, script) {
                const port1 = 13;
                const port2 = 14;
                const port3 = 15;
                const port4 = 16;
                let value1 = script.getValue('VALUE1');
                let value2 = script.getValue('VALUE2');
                let value3 = script.getValue('VALUE3');
                let value4 = script.getValue('VALUE4');

                if (typeof value1 === 'string') value1 = value1.toLowerCase();
                if (Entry.Lecoboard.highList.indexOf(value1) > -1) value1 = 255;
                else if (Entry.Lecoboard.lowList.indexOf(value1) > -1) value1 = 0;
                else throw new Error();
                if (!Entry.hw.sendQueue.SET) Entry.hw.sendQueue.SET = {};
                Entry.hw.sendQueue.SET[port1] = {
                    type: Entry.Lecoboard.sensorTypes.DIGITAL,
                    data: value1,
                    time: new Date().getTime(),
                };
                if (typeof value2 === 'string') value2 = value2.toLowerCase();
                if (Entry.Lecoboard.highList.indexOf(value2) > -1) value2 = 255;
                else if (Entry.Lecoboard.lowList.indexOf(value2) > -1) value2 = 0;
                else throw new Error();
                if (!Entry.hw.sendQueue.SET) Entry.hw.sendQueue.SET = {};
                Entry.hw.sendQueue.SET[port2] = {
                    type: Entry.Lecoboard.sensorTypes.DIGITAL,
                    data: value2,
                    time: new Date().getTime(),
                };
                if (typeof value3 === 'string') value3 = value3.toLowerCase();
                if (Entry.Lecoboard.highList.indexOf(value3) > -1) value3 = 255;
                else if (Entry.Lecoboard.lowList.indexOf(value3) > -1) value3 = 0;
                else throw new Error();
                if (!Entry.hw.sendQueue.SET) Entry.hw.sendQueue.SET = {};
                Entry.hw.sendQueue.SET[port3] = {
                    type: Entry.Lecoboard.sensorTypes.DIGITAL,
                    data: value3,
                    time: new Date().getTime(),
                };
                if (typeof value4 === 'string') value4 = value4.toLowerCase();
                if (Entry.Lecoboard.highList.indexOf(value4) > -1) value4 = 255;
                else if (Entry.Lecoboard.lowList.indexOf(value4) > -1) value4 = 0;
                else throw new Error();
                if (!Entry.hw.sendQueue.SET) Entry.hw.sendQueue.SET = {};
                Entry.hw.sendQueue.SET[port4] = {
                    type: Entry.Lecoboard.sensorTypes.DIGITAL,
                    data: value4,
                    time: new Date().getTime(),
                };

                

                return script.callReturn();
            },
            
        },
        arduino_ext_tone_list: {
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
                        [Lang.Blocks.do_name, 'C2'],
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
                                    [Lang.Blocks.do_name, 'C2'],
                                ],
                                value: 'C',
                                fontSize: 11,
                                converter: Entry.block.converters.returnStringValueUpperCase,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'arduino_ext_tone_list',
                    },
                ],
            },
        },
        arduino_ext_tone_value: {
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
                        type: 'arduino_ext_tone_list',
                    },
                ],
                type: 'arduino_ext_tone_value',
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
                        keyOption: 'arduino_ext_tone_value',
                    },
                ],
            },
        },
        arduino_ext_octave_list: {
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
                        keyOption: 'arduino_ext_octave_list',
                    },
                ],
            },
        },
        lecoboard_buzzer_number: {
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
                params: [1],
                type: 'lecoboard_buzzer_number',
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
                        keyOption: 'lecoboard_buzzer_number',
                    },
                ],
            },
        },
        lecoboard_set_tone: {
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
                                defaultType: 'number',
                            },
                            {
                                type: 'Indicator',
                                img: 'block_icon/hardware_icon.svg',
                                size: 12,
                            },
                        ],
                            events: { },
        def: {
            params: [
                {
                    type: 'arduino_ext_tone_list',
                },
                {
                    type: 'text',
                    params: ['1'],
                },
                null,
            ],
            type: 'lecoboard_set_tone',
            },
        paramsKeyMap: {
                NOTE: 0,
                        DURATION: 1,
            },
        class: 'lecoboard_buzzer',
            isNotFor: ['lecoboard'],
                func(sprite, script) {
            const sq = Entry.hw.sendQueue;
            const port = 12;//script.getNumberValue('PORT', script);

            
                let note = script.getValue('NOTE', script);
                if (!Entry.Utils.isNumber(note)) {
                    note = Entry.Lecoboard.toneTable[note];
                }

                if (note < 0) {
                    note = 0;
                } else if (note > 13) {
                    note = 13;
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
                        type: Entry.Lecoboard.sensorTypes.TONE,
                        data: 0,
                        time: new Date().getTime(),
                    };
                    return script.callReturn();
                }
                let octave = 4;
                let value = 0;

                if (note != 0) {
                    value = Entry.Lecoboard.toneMap[note][octave];
                }

                duration = duration * 1000;
                script.isStart = true;
                script.timeFlag = 1;

                sq.SET[port] = {
                    type: Entry.Lecoboard.sensorTypes.TONE,
                    data: {
                        value,
                        duration,
                    },
                    time: new Date().getTime(),
                };
                    
                    return script.callReturn();
        },
        syntax: {
            js: [],
                py: [
                    {
                        syntax: 'Arduino.tone(%1, %2)',
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
        lecoboard_set_freq_tone: {
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
                        type: 'text',
                        params: ['12'],
                    },
                    {
                        type: 'text',
                        params: ['HZ'],
                    },
                    {
                        type: 'text',
                        params: ['1000'],
                    },
                    null,
                ],
                type: 'lecoboard_set_freq_tone',
            },
            paramsKeyMap: {
                PORT: 0,
                NOTE: 1,
                DURATION: 2,
            },
            class: 'lecoboard_buzzer',
            isNotFor: ['lecoboard'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = script.getNumberValue('PORT', script);


                let freq = script.getNumberValue('NOTE', script);

                let duration = script.getNumberValue('DURATION', script);

                if (duration < 0) {
                    duration = 0;
                }

                if (!sq.SET) {
                    sq.SET = {};
                }

                if (duration === 0) {
                    sq.SET[port] = {
                        type: Entry.Lecoboard.sensorTypes.TONE,
                        data: 0,
                        time: new Date().getTime(),
                    };
                    return script.callReturn();
                }
                let value = freq;
                
                script.isStart = true;
                script.timeFlag = 1;

                sq.SET[port] = {
                    type: Entry.Lecoboard.sensorTypes.TONE,
                    data: {
                        value,
                        duration,
                    },
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.tone(%1, %2 , %3)',
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
        lecoboard_set_tone_off: {
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
                        type: 'lecoboard_buzzer_number',
                        params: [1],
                    },
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'lecoboard_set_tone_off',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'lecoboard_buzzer',
            isNotFor: ['lecoboard'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = 12;//script.getNumberValue('PORT', script);

                if (!script.isStart) {
                    let note = 0;
                    let duration = 0;
                    sq.SET[port] = {
                        type: Entry.Lecoboard.sensorTypes.TONE,
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
                        syntax: 'Arduino.tone(%1)',
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
        lecoboard_set_tone_long: {
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
                        type: 'arduino_ext_tone_list',
                    },
                ],
                type: 'lecoboard_set_tone_long',
            },
            paramsKeyMap: {
                NOTE: 0,
            },
            class: 'lecoboard_buzzer',
            isNotFor: ['lecoboard'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = 12;//script.getNumberValue('PORT', script);


                let note = script.getValue('NOTE', script);
                if (!Entry.Utils.isNumber(note)) {
                    note = Entry.Lecoboard.toneTable[note];
                }

                if (note < 0) {
                    note = 0;
                } else if (note > 13) {
                    note = 13;
                }

                let duration = 20;

                if (!sq.SET) {
                    sq.SET = {};
                }

                let octave = 4;
                let value = 0;

                if (note != 0) {
                    value = Entry.Lecoboard.toneMap[note][octave];
                }

                duration = duration * 1000;
                script.isStart = true;
                script.timeFlag = 1;

                sq.SET[port] = {
                    type: Entry.Lecoboard.sensorTypes.TONE,
                    data: {
                        value,
                        duration,
                    },
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.tone(%1)',
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
        lecoboard_set_tone_off: {
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
                    null,
                ],
                type: 'lecoboard_set_tone_off',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'lecoboard_buzzer',
            isNotFor: ['lecoboard'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = 12;//script.getNumberValue('PORT', script);

                if (!script.isStart) {
                    let note = 0;
                    let duration = 0;
                    sq.SET[port] = {
                        type: Entry.Lecoboard.sensorTypes.TONE,
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
                        syntax: 'Arduino.tone(%1)',
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
        lecoboard_servomotor_list: {
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
                PORT: 0,
            },
            func(sprite, script) {
                return script.getField('PORT');
            },
        },
        lecobaord_set_servo: {
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
                        type: 'lecoboard_servomotor_list',
                        params: [1],
                    },
                    {
                        type: 'number',
                        params: ['90']
                    }
                ],
                type: 'lecobaord_set_servo',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'lecoboard_servo',
            isNotFor: ['lecoboard'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                let port = script.getNumberValue('PORT', script);
               
                if (port == 1) port = 28;
                else if (port == 2) port = 29;
                else if (port == 3) port = 1;
                else if (port == 4) port = 0;
                else script.callReturn();
                
                let value = script.getNumberValue('VALUE', script);
                value = Math.min(180, value);
                value = Math.max(1, value);

                if (!sq.SET) {
                    sq.SET = {};
                }
                sq.SET[port] = {
                    type: Entry.Lecoboard.sensorTypes.SERVO_PIN,
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
        lecoboard_dc_motor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['왼쪽', '1'],
                        ['오른쪽', '2'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['시계방향', '0'],
                        ['반시계방향', '1'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                params:
                    [
                        null,
                        null,
                        {
                            type: 'number',
                            params: ['50']
                        },
                        null,
                    ],
                type: 'lecoboard_dc_motor'
            },
            paramsKeyMap: {
                'INDEX': 0,
                'DIR': 1,
                'SPEED': 2,
            },
            class: 'lecoboard_motor',
            isNotFor: ['lecoboard'],
            func: function (sprite, script) {
                
                var idx = script.getField('INDEX');
                var dir = script.getField('DIR');
                var speed = script.getNumberValue('SPEED');
                var value = 0;
                var value1 = 0;
                var value2 = 0;

                var port1 = 0;
                var port2 = 0;

                if (idx == 1) {
                    port1 = 28;
                    port2 = 29;
                }
                else if (idx == 2) {
                    port1 = 1;
                    port2 = 0;
                }               

                var value = speed;
                value = Math.round(value);
                value = Math.max(value, 0);
                value = Math.min(value, 100);

                value = value * (255 / 100);
                value = Math.round(value);


                if (dir == 0) {
                    value1 = value;
                    value2 = 0;
                }
                else {
                    value1 = 0;
                    value2 = value;
                }

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[port1] = {
                    type: Entry.Lecoboard.sensorTypes.PWM,
                    data: value1,
                    time: new Date().getTime(),
                };
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[port2] = {
                    type: Entry.Lecoboard.sensorTypes.PWM,
                    data: value2,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: { js: [], py: ['lecoboard.dc_motor(%1, %2, %3, %4)'] }
        },
        lecoboard_dc_motor_for_sec: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', '1'],
                        ['2', '2'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['시계방향', '0'],
                        ['반시계방향', '1'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                params:
                    [
                        null,
                        null,
                        {
                            type: 'number',
                            params: ['50']
                        },
                        {
                            type: 'number',
                            params: ['1']
                        },
                        null,
                    ],
                type: 'lecoboard_dc_motor_for_sec'
            },
            paramsKeyMap: {
                'INDEX': 0,
                'DIR': 1,
                'SPEED': 2,
                'SEC': 3,
            },
            class: 'lecoboard_motor',
            isNotFor: ['lecoboard'],
            func: function (sprite, script) {
                if (!script.isStart) {
                                        
                    

                    var idx = script.getField('INDEX');
                    var dir = script.getField('DIR');
                    var speed = script.getNumberValue('SPEED');
                    var sec = script.getNumberValue('SEC');
                    var value = 0;
                    var value1 = 0;
                    var value2 = 0;

                    var port1 = 0;
                    var port2 = 0;

                    if (idx == 1) {
                        port1 = 28;
                        port2 = 29;
                    }
                    else if (idx == 2) {
                        port1 = 0;
                        port2 = 1;
                    }

                    var value = speed;
                    value = Math.round(value);
                    value = Math.max(value, 0);
                    value = Math.min(value, 100);

                    value = value * (255 / 100);
                    value = Math.round(value);


                    if (dir == 0) {
                        value1 = value;
                        value2 = 0;
                    }
                    else {
                        value1 = 0;
                        value2 = value;
                    }

                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }
                    Entry.hw.sendQueue.SET[port1] = {
                        type: Entry.Lecoboard.sensorTypes.PWM,
                        data: value1,
                        time: new Date().getTime(),
                    };
                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }
                    Entry.hw.sendQueue.SET[port2] = {
                        type: Entry.Lecoboard.sensorTypes.PWM,
                        data: value2,
                        time: new Date().getTime(),
                    };

                    sec = sec * 1000;
                    script.isStart = true;
                    script.timeFlag = 1;

                    setTimeout(() => {
                        script.timeFlag = 0;
                    }, sec );
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.hw.sendQueue.SET[port1] = {
                        type: Entry.Lecoboard.sensorTypes.PWM,
                        data: 0,
                        time: new Date().getTime(),
                    };
                    Entry.hw.sendQueue.SET[port2] = {
                        type: Entry.Lecoboard.sensorTypes.PWM,
                        data: 0,
                        time: new Date().getTime(),
                    };
                    Entry.engine.isContinue = false;

                    return script.callReturn();
                }

            },
            syntax: { js: [], py: ['lecoboard.dc_motor(%1, %2, %3, %4, %5)'] }
        },
        lecoboard_dc_motor_stop: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', '1'],
                        ['2', '2'],
                    ],
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
                params:
                    [
                        null,
                        null,
                    ],
                type: 'lecoboard_dc_motor_stop'
            },
            paramsKeyMap: {
                'INDEX': 0,
            },
            class: 'lecoboard_motor',
            isNotFor: ['lecoboard'],
            func: function (sprite, script) {
                var port1 = 28;
                var port2 = 29;
                var port3 = 1;
                var port4 = 0;

                var value = 0;

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[port1] = {
                    type: Entry.Lecoboard.sensorTypes.PWM,
                    data: 0,
                    time: new Date().getTime(),
                };
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[port2] = {
                    type: Entry.Lecoboard.sensorTypes.PWM,
                    data: 0,
                    time: new Date().getTime(),
                };
                Entry.hw.sendQueue.SET[port3] = {
                    type: Entry.Lecoboard.sensorTypes.PWM,
                    data: 0,
                    time: new Date().getTime(),
                };
                Entry.hw.sendQueue.SET[port4] = {
                    type: Entry.Lecoboard.sensorTypes.PWM,
                    data: 0,
                    time: new Date().getTime(),
                };

                return script.callReturn();
                

            },
            syntax: { js: [], py: ['lecoboard.dc_motor(%1)'] }
        },
        
        lecoboard_list_digital_lcd_line: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [['1', '0'], ['2', '1']],
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
            func: function (sprite, script) {
                return script.getField('LINE');
            },
        },
        lecoboard_list_digital_lcd_column: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', '0'],
                        ['2', '1'],
                        ['3', '2'],
                        ['4', '3'],
                        ['5', '4'],
                        ['6', '5'],
                        ['7', '6'],
                        ['8', '7'],
                        ['9', '8'],
                        ['10', '9'],
                        ['11', '10'],
                        ['12', '11'],
                        ['13', '12'],
                        ['14', '13'],
                        ['15', '14'],
                        ['16', '15'],
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
                COLUMN: 0,
            },
            func: function (sprite, script) {
                return script.getField('COLUMN');
            },
        },
        lecoboard_set_lcd: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            //template: Lang.template.lecoboard_set_lcd,
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
                        type: 'lecoboard_list_digital_lcd_line',
                    },
                    {
                        type: 'lecoboard_list_digital_lcd_column',
                    },
                    {
                        type: 'text',
                        params: ['HELLO'],
                    },
                    null,
                ],
                type: 'lecoboard_set_lcd',
            },
            paramsKeyMap: {
                LINE: 0,
                COLUMN: 1,
                STRING: 2,
            },
            class: 'lecoboardLcd',
            isNotFor: ['lecoboard'],
            func: function (sprite, script) {
                var sq = Entry.hw.sendQueue;

                var line = script.getValue('LINE', script);
                var column = script.getValue('COLUMN', script);
                var string = script.getValue('STRING', script);
                var text = [];
                var str; 
                let temp = [];
                //var string = script.getField('STRING');
                if (string.length < 1) {
                    return script.callReturn();
                }
                str = string;
                if (!script.isStart) {                    
                    
                    for (var i = 0; i < string.length; i++) {
                        text[i] = string.charCodeAt(i);
                    }

                    if (!sq['SET']) {
                        sq['SET'] = {};
                    }
                    
                    sq.SET[1] = {  
                        type: Entry.Lecoboard.sensorTypes.LCD,
                        data: {
                            line: line,
                            column: column,
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
                    return script.callReturn();

                } 
            },
            syntax: { js: [], py: ['lecoboard_set_lcd(%1, %2, %3)'] },



        },
        lecoboard_list_lcd_command: {
           
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['지움', '2'],
                        
                        [ "백라이트켜기", "3" ],
                        [ "백라이트끄기", "4" ]
                        
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
            },
            paramsKeyMap: {
                COMMAND: 0,
            },
            func: function (sprite, script) {
                return script.getField('COMMAND');
            },
        },
        lecoboard_lcd_command: {
            
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            //template: Lang.template.lecoboard_lcd_command,
            //"template": "%1 %2",
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
                        type: 'lecoboard_list_lcd_command',
                    },
                    null,
                ],
                type: 'lecoboard_lcd_command',
            },
            paramsKeyMap: {
                COMMAND: 0,
            },
            class: 'lecoboardLcd',
            isNotFor: ['lecoboard'],
            func: function (sprite, script) {
                var sq = Entry.hw.sendQueue;
                var value = script.getNumberValue('COMMAND', script);
                var command = script.getNumberValue('COMMAND', script);
                
                if (!sq['SET']) {
                    sq['SET'] = {};            
                }
                
                sq.SET[0] = {   
                    type: Entry.Lecoboard.sensorTypes.LCD_COMMAND,
                    data: {
                        value: value,
                        command: command,   
                    },
                    time: new Date().getTime(),
                };

                
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
           
        },
        lecoboard_send_ble: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            //template: Lang.template.lecoboard_set_lcd,
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
                        params: ['HELLO'],
                    },
                    null,
                ],
                type: 'lecoboard_send_ble',
            },
            paramsKeyMap: {
                STRING: 0,
            },
            class: 'lecoboardble',
            isNotFor: ['lecoboard'],
            func: function (sprite, script) {
                var sq = Entry.hw.sendQueue;

                var string = script.getValue('STRING', script);
                var text = [];
                var str;
                let temp = [];
                //var string = script.getField('STRING');
                if (string.length < 1) {
                    return script.callReturn();
                }
                str = string;
                if (!script.isStart) {

                    for (var i = 0; i < string.length; i++) {
                        text[i] = string.charCodeAt(i);
                    }

                    if (!sq['SET']) {
                        sq['SET'] = {};
                    }

                    sq.SET[1] = {
                        type: Entry.Lecoboard.sensorTypes.BLE_WRITE,
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
                    return script.callReturn();

                }
            },
            syntax: { js: [], py: ['lecoboard_send_ble(%1)'] },



        },
        lecoboard_get_bluetooth: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            //template: Lang.template.lecoboard_get_digital_bluetooth,
            statements: [],
            params: [
            ],
            events: {},
            def: {
                params: [
                ],
                type: 'lecoboard_get_bluetooth',
            },
            paramsKeyMap: {
            },
            class: 'lecoboardble',
            isNotFor: ['lecoboard'],
            func: function (sprite, script) {
                
                var port = 2;
                var getString = Entry.hw.portData.BLE_READ;
                
                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                Entry.hw.sendQueue.GET[Entry.Lecoboard.sensorTypes.BLE_READ] = {
                    port,
                    time: new Date().getTime(),
                };

                return getString ? getString.slice(0, getString.length - 1) : ' ';
            },
            syntax: { js: [], py: ['lecoboard.get_digital_bluetooth()'] },
        },
        
        
    };
};
//endregion arduinoExt 아두이노 확장모드

module.exports = Entry.Lecoboard;
