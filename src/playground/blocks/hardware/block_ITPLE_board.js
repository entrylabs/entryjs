'use strict';

Entry.ITPLE = {
    afterReceive(pd) {
        if(Entry.engine.isState('run')) {
            Entry.engine.fireEvent('ITPLE_press_button');
        }
    },
    id: '5E.1',
    name: 'ITPLE',
    url: 'http://www.itpleinfo.com/',
    imageName: 'ITPLE.png',
    title: {
        ko: '잇플보드',
        en: 'ITPLE board',
    },
    setZero() {
        if (!Entry.hw.sendQueue.SET) {
            Entry.hw.sendQueue = {
                GET: {},
                SET: {},
            };
        }

        // 기존 큐 초기화
        const keySet = Object.keys(Entry.hw.sendQueue.SET);
        keySet.forEach((key) => {
            const portNum = parseInt(key);
            // 네오픽셀 관련 포트(100-103, 200-205)와 물리 포트 9는 별도 처리
            // 206(BLINK), 207(BLINK_STOP)은 명시적으로 삭제
            if (portNum === 206 || portNum === 207) {
                delete Entry.hw.sendQueue.SET[key];
            } else if (portNum !== 9 && !(portNum >= 100 && portNum <= 103) && !(portNum >= 200 && portNum <= 205)) {
                Entry.hw.sendQueue.SET[key].data = 0;
                Entry.hw.sendQueue.SET[key].time = new Date().getTime();
            }
        });

        // 깜박이기 중지 명령 전송 (전체) - INIT보다 먼저 실행
        const stopTime = new Date().getTime();
        Entry.hw.sendQueue.SET[206] = {
            type: 15, // NEOPIXEL_BLINK_STOP
            data: { side: 2 }, // 전체
            time: stopTime,
        };
        console.log('[ITPLE] setZero - BLINK_STOP sent at', stopTime);
        Entry.hw.update(); // 즉시 전송

        // NEOPIXEL_INIT 명령 전송 (네오픽셀 끄기)
        // 깜박이기 중지 후 약간의 시간차를 두고 INIT 실행
        setTimeout(() => {
            const initTime = new Date().getTime();
            Entry.hw.sendQueue.SET[200] = {
                type: 9, // NEOPIXEL_INIT
                data: 0,
                time: initTime,
            };
            console.log('[ITPLE] setZero - NEOPIXEL_INIT sent at', initTime);
            Entry.hw.update();
        }, 20);
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
        NEOPIXELINIT: 9,
        NEOPIXELCOLOR: 10,
        NEOPIXEL_BRIGHTNESS: 11,
        NEOPIXEL_SHIFT: 12,
        NEOPIXEL_ROTATE: 13,
        NEOPIXEL_BLINK: 14,
        NEOPIXEL_BLINK_STOP: 15,
    },
    toneTable: {
        0: 0,
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
        1: [33, 65, 131, 262, 523, 1046, 2093, 4186],
        2: [35, 69, 139, 277, 554, 1109, 2217, 4435],
        3: [37, 73, 147, 294, 587, 1175, 2349, 4699],
        4: [39, 78, 156, 311, 622, 1245, 2849, 4978],
        5: [41, 82, 165, 330, 659, 1319, 2637, 5274],
        6: [44, 87, 175, 349, 698, 1397, 2794, 5588],
        7: [46, 92, 185, 370, 740, 1480, 2960, 5920],
        8: [49, 98, 196, 392, 784, 1568, 3136, 6272],
        9: [52, 104, 208, 415, 831, 1661, 3322, 6645],
        10: [55, 110, 220, 440, 880, 1760, 3520, 7040],
        11: [58, 117, 233, 466, 932, 1865, 3729, 7459],
        12: [62, 123, 247, 494, 988, 1976, 3951, 7902],
    },
    duration: {
        TIME_1ms: 1,
        TIME_5ms: 5,
        TIME_10ms: 10,
        TIME_20ms: 20,
        TIME_50ms: 50,
        TIME_100ms: 100,
        TIME_200ms: 200,
        TIME_500ms: 500,
        TIME_600ms: 600,
    },
    highList: ['high', '1', 'on'],
    lowList: ['low', '0', 'off'],
    BlockState: {},
    EdgeFlag: {
        'A0': false,
        'A1': false,
        '7': false,
        '8': false,
    },
};

Entry.ITPLE.setLanguage = function () {
    return {
        ko: {
            template: {
                ITPLE_push_button: '%1 %2 버튼을 눌렀을 때',
                ITPLE_get_button_value: '%1 버튼 값',
                ITPLE_get_sensor_value: '%1 센서 값',
                ITPLE_get_ultrasonic_value: '초음파 센서 값',
                ITPLE_is_key_pressed: '%1 키가 눌러져 있는가?',
                ITPLE_value_sensor: '%1 센서 값이 %2보다 %3',
                ITPLE_turn_led: '%1 LED %2 %3',
                ITPLE_set_tone: '버저를 %1 %2 음으로 %3 초 연주하기 %4',
                ITPLE_set_motor_direction: '%1 모터 %2 방향으로 정하기 %3',
                ITPLE_set_motor_speed: '%1 모터 %2 빠르기로 정하기 %3',
                ITPLE_set_servo: '서보모터를 %2 도로 정하기 %3',
                ITPLE_set_neopixel_init: '네오픽셀 모두 끄기 %1',
                ITPLE_set_neopixel: '%1 번째 네오픽셀 LED를 %2 색으로 켜기 %3',
                ITPLE_set_neopixel_all: '네오픽셀 전체의 색상을 %1 (으)로 켜기 %2',
                ITPLE_set_neopixel_range: '%1 번부터 %2 번까지 네오픽셀을 %3 색상으로 켜기 %4',
                ITPLE_set_neopixel_rotate: '네오픽셀 %1 방향으로 %2 칸 이동 %3',
                ITPLE_set_neopixel_brightness: '네오픽셀 최대 밝기를 %1 (으)로 정하기 %2',
                ITPLE_set_neopixel_blink: '%1 네오픽셀 %2 색으로 깜박이기 (간격: %3초) %4',
                ITPLE_stop_neopixel_blink: '%1 네오픽셀 깜박이기 중지 %2',
                ITPLE_color_picker_value: '색상 선택 %1',
                ITPLE_rgb_to_color_value: 'R: %1 G: %2 B: %3 색상값',
            },
        },
        en: {
            template: {
                ITPLE_push_button: '%1 When %2 button is pressed',
                ITPLE_get_button_value: '%1 button value',
                ITPLE_get_sensor_value: '%1 sensor value',
                ITPLE_get_ultrasonic_value: 'Ultrasonic sensor value',
                ITPLE_is_key_pressed: '%1 key pressed',
                ITPLE_value_sensor: 'Is %1 sensor value %3 than %2',
                ITPLE_turn_led: '%1 LED %2 %3',
                ITPLE_set_tone: 'Play tone on note %1 octave %2 beat %3 %4',
                ITPLE_set_motor_direction: '%1 motor %2 direction %3',
                ITPLE_set_motor_speed: '%1 motor %2 speed %3',
                ITPLE_set_servo: 'Set servo motor to %2 degree %3',
                ITPLE_set_neopixel_init: 'Turn off all NeoPixels %1',
                ITPLE_set_neopixel: 'Set NeoPixel %1 to %2 color %3',
                ITPLE_set_neopixel_all: 'Set all NeoPixels to %1 color %2',
                ITPLE_set_neopixel_range: 'Fill NeoPixels from %1 to %2 with %3 color %4',
                ITPLE_set_neopixel_rotate: 'Shift NeoPixels %1 by %2 steps %3',
                ITPLE_set_neopixel_brightness: 'Set NeoPixel max brightness to %1 %2',
                ITPLE_set_neopixel_blink: 'Blink %1 NeoPixels %2 color (interval: %3s) %4',
                ITPLE_stop_neopixel_blink: 'Stop %1 NeoPixel blinking %2',
                ITPLE_color_picker_value: 'Pick color %1',
                ITPLE_rgb_to_color_value: 'Color from R:%1 G:%2 B:%3',
            },
        },
    };
};

Entry.ITPLE.blockMenuBlocks = [
    'ITPLE_push_button',
    'ITPLE_get_button_value',
    'ITPLE_get_sensor_value',
    'ITPLE_get_ultrasonic_value',
    'ITPLE_color_picker_value',
    'ITPLE_rgb_to_color_value',
    'ITPLE_is_key_pressed',
    'ITPLE_value_sensor',
    'ITPLE_turn_led',
    'ITPLE_set_tone',
    'ITPLE_set_motor_direction',
    'ITPLE_set_motor_speed',
    'ITPLE_set_servo',
    'ITPLE_set_neopixel_init',
    'ITPLE_set_neopixel',
    'ITPLE_set_neopixel_all',
    'ITPLE_set_neopixel_range',
    'ITPLE_set_neopixel_rotate',
    'ITPLE_set_neopixel_brightness',
    'ITPLE_set_neopixel_blink',
    'ITPLE_stop_neopixel_blink',
];

//region ITPLE 보드
Entry.ITPLE.getBlocks = function () {
    return {
        ITPLE_push_button: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_event',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/start_icon_hardware.svg',
                    size: 14,
                    position: {
                        x: 0,
                        y: -2,
                    },
                },
                {
                    type: 'Dropdown',
                    options: [['위쪽', 'A0'], ['아래쪽', 'A1'], ['왼쪽', '7'], ['오른쪽', '8']],
                    value: 'A0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null, 'A0'], 
                type: 'ITPLE_push_button'
            },
            paramsKeyMap: {
                PORT: 1 
            },
            class: 'ITPLEStart',
            isNotFor: ['ITPLE'], 
            event: 'ITPLE_press_button',
            func(sprite, script) {
                const portConfigMap = {
                    'A0': { type: 'ANALOG', index: 0 },
                    'A1': { type: 'ANALOG', index: 1 },
                    '7':  { type: 'DIGITAL', index: 7 },
                    '8':  { type: 'DIGITAL', index: 8 },
                };

                const portKey = script.getValue('PORT', script);
                const config = portConfigMap[portKey];
                const value = Entry.hw.portData[config.type]?.[config.index] ?? 0;

                const hasBeenPressedBefore = Entry.ITPLE.EdgeFlag[portKey];
                
                if (value === 0) {
                    if (!hasBeenPressedBefore) {
                        Entry.ITPLE.EdgeFlag[portKey] = true;
                        return script.callReturn();
                    }
                } else {
                    Entry.ITPLE.EdgeFlag[portKey] = false;
                }

                return this.die();
            },
            
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'def when_push_button(%2):',
                        passTest: true,
                        blockType: 'event',
                        textParams: [
                            undefined,
                            {
                                type: 'Dropdown',
                                options: [['위쪽', 'A0'], ['아래쪽', 'A1'], ['왼쪽', '7'], ['오른쪽', '8']],
                                value: 'A0',
                                arrowColor: EntryStatic.colorSet.arrow.default.START,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },

        ITPLE_get_button_value: {
            color: EntryStatic.colorSet.block["default"].HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [{
                type: 'Dropdown',
                options: [['위쪽', 'A0'], ['아래쪽', 'A1'], ['왼쪽', '7'], ['오른쪽', '8']],
                value: 'A0',
                fontSize: 11,
                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                arrowColor: EntryStatic.colorSet.arrow["default"].HARDWARE
            }],
            events: {},
            def: {
                params: [null],
                type: 'ITPLE_get_button_value'
            },
            paramsKeyMap: {
                PORT: 0
            },
            "class": 'ITPLEGet',
            isNotFor: ['ITPLE'],
            func: function func(sprite, script) {
                const portConfigMap = {
                    'A0': { type: 'ANALOG', index: 0 },
                    'A1': { type: 'ANALOG', index: 1 },
                    '7':  { type: 'DIGITAL', index: 7 },
                    '8':  { type: 'DIGITAL', index: 8 },
                };
                const portKey = script.getValue('PORT', script);
                const config = portConfigMap[portKey];
                if (!config) return 0;
                return Entry.hw.portData[config.type]?.[config.index] ?? 0;
            },
            syntax: {
                js: [],
                py: [{
                    syntax: 'Arduino.digitalRead(%1)',
                    blockType: 'param',
                    textParams: [{ type: 'Block', accept: 'string' }]
                }]
            }
        },
        ITPLE_get_sensor_value: {
            color: EntryStatic.colorSet.block["default"].HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [{
                type: 'Dropdown',
                options: [['조도', 'A2'], ['소리', 'A3'], ['왼쪽 라인', 'A6'], ['오른쪽 라인', 'A7']],
                value: 'A2',
                fontSize: 11,
                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                arrowColor: EntryStatic.colorSet.arrow["default"].HARDWARE
            }],
            events: {},
            def: {
                params: [null],
                type: 'ITPLE_get_sensor_value'
            },
            paramsKeyMap: {
                PORT: 0
            },
            "class": 'ITPLEGet',
            isNotFor: ['ITPLE'],
            func: function func(sprite, script) {
                const portConfigMap = {
                    'A2': { type: 'ANALOG', index: 2 },
                    'A3': { type: 'ANALOG', index: 3 },
                    'A6': { type: 'ANALOG', index: 6 },
                    'A7': { type: 'ANALOG', index: 7 },
                };
                const portKey = script.getValue('PORT', script);
                const config = portConfigMap[portKey];
                if (!config) return 0;
                return Entry.hw.portData[config.type]?.[config.index] ?? 0;
            },
            syntax: {
                js: [],
                py: [{
                    syntax: 'Arduino.analogRead(%1)',
                    blockType: 'param',
                    textParams: [{ type: 'Block', accept: 'string' }]
                }]
            }
        },
        ITPLE_is_key_pressed: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            params: [{
                type: 'Dropdown',
                options: [
                    ['위쪽', 'A0'],
                    ['아래쪽', 'A1'],
                    ['왼쪽', '7'],
                    ['오른쪽', '8'],
                ],
                value: 'A0',
                fontSize: 11,
                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
            },],
            events: {},
            def: {
                params: [null],
                type: 'ITPLE_is_key_pressed',
            },
            paramsKeyMap: {
                KEY: 0,
            },
            "class": 'ITPLEGet',
            isNotFor: ['ITPLE'],
            func(sprite, script) {
                // 각 키에 대한 하드웨어 포트 정보를 객체로 관리하여 확장성을 높입니다.
                const keyToPortMap = {
                    'A0': { type: 'ANALOG', index: 0 },
                    'A1': { type: 'ANALOG', index: 1 },
                    '7':  { type: 'DIGITAL', index: 7 },
                    '8':  { type: 'DIGITAL', index: 8 },
              };

              const selectedKey = script.getField('KEY');
              const portConfig = keyToPortMap[selectedKey];

              // 유효하지 않은 키는 즉시 false를 반환합니다.
              if (!portConfig) {
                  return false;
              }
              
              // 옵셔널 체이닝(?.)과 null 병합 연산자(??)를 사용해
              // 하드웨어 데이터 존재 여부를 확인하고 값을 안전하게 가져옵니다.
              const value = Entry.hw.portData[portConfig.type]?.[portConfig.index] ?? 1;

              // 버튼이 눌렸을 때의 값(0)과 일치하는지 확인하여 boolean 값을 반환합니다.
              return value === 0;
          },
          syntax: {
              js: [],
              py: [
                  {
                      syntax: 'Arduino.digitalRead("%1")==0',
                  },
              ],
          },
        },
        ITPLE_value_sensor: { // 저학년을 위한 센서 블록 생성
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',

            skeleton: 'basic_boolean_field',

            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['조도', '2'],
                        ['소리', '3'],
                        ['왼쪽 라인', '6'],
                        ['오른쪽 라인', '7'],
                    ],
                    value: '2',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'number',
                },
                {
                  type: 'Dropdown',
                  options: [
                    ['크다', '>'],
                    ['크거나같다', '>='],
                    ['같다', '=='],
                    ['작거나같다', '<='],
                    ['작다', '<'],
                  ],
                  value: '>',
                  fontSize: 11,
                  bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                  arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                }
            ],

            events: {},

            def: {
                params: [null, {
                    type: 'number',
                    params: ['500']
                }, null],
                type: 'ITPLE_value_sensor',
            },

            paramsKeyMap: {
                PIN: 0,
                VALUE: 1,
                COMPARISON: 2,
            },
            class: 'ITPLEGet',
            isNotFor: ['ITPLE'],
            
            func(sprite, script) {
                const pin = script.getValue('PIN');
                const value = script.getValue('VALUE');
                const comparison = script.getValue('COMPARISON');

                const analogPortData = Entry.hw.portData.ANALOG;

                if (analogPortData) {
                    switch (comparison) {
                        case '>':
                            return analogPortData[pin] > value;
                        case '<':
                            return analogPortData[pin] < value;
                        case '==':
                            return analogPortData[pin] === value;
                    }
                }
                return false;
            },

            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.analogRead(%1) %3 %2',
                    },
                ],
            },
        },
        ITPLE_get_ultrasonic_value: {
            color: EntryStatic.colorSet.block["default"].HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [{
                type: 'Block',
                accept: 'string',
                defaultType: 'number'
            }, {
                type: 'Block',
                accept: 'string',
                defaultType: 'number'
            }],
            events: {},
            def: {
                params: [{
                    type: 'arduino_get_port_number',
                    params: ['13']
                }, {
                    type: 'arduino_get_port_number',
                    params: ['12']
                }],
                type: 'ITPLE_get_ultrasonic_value'
            },
            paramsKeyMap: {
                PORT1: 0,
                PORT2: 1
            },
            "class": 'ITPLEGet',
            isNotFor: ['ITPLE'],
            func: function func(sprite, script) {
                var port1 = script.getNumberValue('PORT1', script);
                var port2 = script.getNumberValue('PORT2', script);
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                delete Entry.hw.sendQueue.SET[port1];
                delete Entry.hw.sendQueue.SET[port2];
                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                Entry.hw.sendQueue.GET[Entry.ITPLE.sensorTypes.ULTRASONIC] = {
                    port: [port1, port2],
                    time: new Date().getTime()
                };
                return Entry.hw.portData.ULTRASONIC || 0;
            },
            syntax: {
                js: [],
                py: [{
                    syntax: 'Arduino.ultrasonicRead(%1, %2)',
                    blockType: 'param',
                    textParams: [{
                        type: 'Block',
                        accept: 'string'
                    }, {
                        type: 'Block',
                        accept: 'string'
                    }]
                }],
            }
        },
        ITPLE_color_picker_value: {
            color: EntryStatic.colorSet.block["default"].HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                { type: 'Color' },
            ],
            events: {},
            def: {
                params: [null],
                type: 'ITPLE_color_picker_value',
            },
            paramsKeyMap: {
                COLOR: 0,
            },
            class: 'ITPLE_neopixel',
            isNotFor: ['ITPLE'],
            func(sprite, script) {
                // Color 파라미터는 이미 hex 문자열을 반환
                return script.getStringValue('COLOR', script);
            },
            syntax: {
                js: [],
                py: []
            },
        },
        ITPLE_rgb_to_color_value: {
            color: EntryStatic.colorSet.block["default"].HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                { type: 'Block', accept: 'string', defaultType: 'number' },
                { type: 'Block', accept: 'string', defaultType: 'number' },
                { type: 'Block', accept: 'string', defaultType: 'number' },
            ],
            events: {},
            def: {
                params: [
                    { type: 'number', params: ['255'] },
                    { type: 'number', params: ['0'] },
                    { type: 'number', params: ['0'] },
                ],
                type: 'ITPLE_rgb_to_color_value',
            },
            paramsKeyMap: {
                RED: 0,
                GREEN: 1,
                BLUE: 2,
            },
            class: 'ITPLE_neopixel',
            isNotFor: ['ITPLE'],
            func(sprite, script) {
                let r = script.getNumberValue('RED', script);
                let g = script.getNumberValue('GREEN', script);
                let b = script.getNumberValue('BLUE', script);
                // clamp
                r = Math.min(255, Math.max(0, Math.floor(r)));
                g = Math.min(255, Math.max(0, Math.floor(g)));
                b = Math.min(255, Math.max(0, Math.floor(b)));
                const toHex = (v) => v.toString(16).padStart(2, '0').toUpperCase();
                return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
            },
            syntax: {
                js: [],
                py: []
            },
        },
        ITPLE_turn_led: { // 저학년 학생을 위한, 핀 번호 없는 LED 켜기 블록
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',

            skeleton: 'basic',

            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['빨강', 10],
                        ['파랑', 11],
                    ],
                    value: 10,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['켜기', 'on'],
                        ['끄기', 'off'],
                    ],
                    value: 'on',
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
                    null,
                ],
                type: 'ITPLE_turn_led',
            },

            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'ITPLE',
            isNotFor: ['ITPLE'],
            func(sprite, script) {
                const port = script.getNumberValue('PORT');
                let value = script.getValue('VALUE');

                if (typeof value === 'string') {
                    value = value.toLowerCase();
                }
                if (Entry.ITPLE.highList.indexOf(value) > -1) {
                    value = 255;
                } else if (Entry.ITPLE.lowList.indexOf(value) > -1) {
                    value = 0;
                } else {
                    throw new Error();
                }
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[port] = {
                    type: Entry.ITPLE.sensorTypes.DIGITAL,
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
        ITPLE_tone_list: {
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
                        keyOption: 'ITPLE_tone_list',
                    },
                ],
            },
        },
        ITPLE_tone_value: {
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
                        type: 'ITPLE_tone_list',
                    },
                ],
                type: 'ITPLE_tone_value',
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
                        keyOption: 'ITPLE_tone_value',
                    },
                ],
            },
        },
        ITPLE_octave_list: {
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
                        keyOption: 'ITPLE_octave_list',
                    },
                ],
            },
        },
        ITPLE_set_tone: {
            // 버저 핀번호 가림 업데이트
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
                        type: 'ITPLE_tone_list',
                    },
                    {
                        type: 'ITPLE_octave_list',
                    },
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'ITPLE_set_tone',
            },
            paramsKeyMap: {
                NOTE: 0,
                OCTAVE: 1,
                DURATION: 2,
            },
            class: 'ITPLE',
            isNotFor: ['ITPLE'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = 3;

                if (!script.isStart) {
                    let note = script.getValue('NOTE', script);
                    if (!Entry.Utils.isNumber(note)) {
                        note = Entry.ITPLE.toneTable[note];
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
                            type: Entry.ITPLE.sensorTypes.TONE,
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
                        value = Entry.ITPLE.toneMap[note][octave];
                    }

                    duration = duration * 1000;
                    script.isStart = true;
                    script.timeFlag = 1;

                    sq.SET[port] = {
                        type: Entry.ITPLE.sensorTypes.TONE,
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
                        type: Entry.ITPLE.sensorTypes.TONE,
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
                        syntax: 'Arduino.tone(3, %1, %2, %3)',
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
        ITPLE_octave_list: {
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
                        keyOption: 'ITPLE_octave_list',
                    },
                ],
            },
        },
        ITPLE_set_motor_direction: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['왼쪽', '2'],
                        ['오른쪽', '4'],
                    ],
                    value: '2',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['앞쪽', '0'],
                        ['뒤쪽', '1'],
                    ],
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
                params: ['2', '0', null],
                type: 'ITPLE_set_motor_direction',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'ITPLE_motor',
            isNotFor: ['ITPLE'],
            func(sprite, script) {
                const port = script.getNumberValue('PORT');
                let value = script.getValue('VALUE');

                if (typeof value === 'string') {
                    value = value.toLowerCase();
                }
                if (Entry.ITPLE.highList.indexOf(value) > -1) {
                    value = 255;
                } else if (Entry.ITPLE.lowList.indexOf(value) > -1) {
                    value = 0;
                } else {
                    throw new Error();
                }
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[port] = {
                    type: Entry.ITPLE.sensorTypes.DIGITAL,
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
        ITPLE_set_motor_speed: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['왼쪽', '5'],
                        ['오른쪽', '6'],
                    ],
                    value: '5',
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
                params: [
                    '5',
                    {
                        type: 'text',
                        params: ['255'],
                    },
                    null,
                ],
                type: 'ITPLE_set_motor_speed',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'ITPLE_motor',
            isNotFor: ['ITPLE'],
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
                    type: Entry.ITPLE.sensorTypes.PWM,
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
        ITPLE_set_servo: {
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
                    '9',
                    {
                        type: 'text',
                        params: ['180'],
                    },
                    null,
                ],
                type: 'ITPLE_set_servo',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'ITPLE_motor',
            isNotFor: ['ITPLE'],
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
                    type: Entry.ITPLE.sensorTypes.SERVO_PIN,
                    data: value,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [{
                    syntax: 'Arduino.servomotorWrite(%1, %2)',
                    textParams: [{
                        type: 'Block',
                        accept: 'string',
                    },{
                        type: 'Block',
                        accept: 'string',
                    },],
                },],
            },
        },
        ITPLE_set_neopixel_init: {
            color: EntryStatic.colorSet.block["default"].HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [{
                type: 'Indicator',
                img: 'block_icon/hardware_icon.svg',
                size: 12
            }],
            events: {},
            def: {
                params: [null],
                type: 'ITPLE_set_neopixel_init'
            },
            "class": 'ITPLE_neopixel',
            isNotFor: ['ITPLE'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = 200;
    
                if (!script.isStart) {
                    if (!sq.SET) {
                        sq.SET = {};
                    }
    
                    // 시퀀스 번호로 고유한 시간 보장
                    Entry.ITPLE.timeSeq++;
                    const uniqueTime = new Date().getTime() + Entry.ITPLE.timeSeq;
    
                    sq.SET[port] = {
                        type: Entry.ITPLE.sensorTypes.NEOPIXEL_INIT,
                        data: uniqueTime % 10000,
                        time: uniqueTime,
                    };
    
                    script.isStart = true;
                    script.timeFlag = Date.now();
                    return script;
                }
    
                // 10ms 대기
                if (Date.now() - script.timeFlag < 2) {
                    return script;
                }
    
                delete script.isStart;
                delete script.timeFlag;
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [{
                    syntax: 'Arduino.neopixelInit(9, 4)'
                }]
            }
        },
        ITPLE_set_neopixel: {
            color: EntryStatic.colorSet.block["default"].HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [{
                type: 'Dropdown',
                options: [['1', '0'], ['2', '1'], ['3', '2'], ['4', '3']],
                value: '0',
                fontSize: 11,
                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                arrowColor: EntryStatic.colorSet.arrow["default"].HARDWARE
            }, {
                type: 'Block',
                accept: 'string',
                defaultType: 'text'
            }, {
                type: 'Indicator',
                img: 'block_icon/hardware_icon.svg',
                size: 12
            }],
            events: {},
            def: {
                params: [null, {
                    type: 'ITPLE_color_picker_value', params: ['#FF0000']
                }, null],
                type: 'ITPLE_set_neopixel'
            },
            paramsKeyMap: {
                NUM: 0,
                COLOR: 1,
            },
            "class": 'ITPLE_neopixel',
            isNotFor: ['ITPLE'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const num = script.getNumberValue('NUM', script);
                const port = 100 + num;
                const color = script.getStringValue('COLOR', script);
    
                const rgb = Entry.hex2rgb(color);
                let r = rgb.r || 0;
                let g = rgb.g || 0;
                let b = rgb.b || 0;
    
                r = Math.min(255, Math.max(0, r));
                g = Math.min(255, Math.max(0, g));
                b = Math.min(255, Math.max(0, b));
    
                if (!script.isStart) {
                    if (!sq.SET) {
                        sq.SET = {};
                    }
    
                    // 시퀀스 번호로 고유한 시간 보장
                    Entry.ITPLE.timeSeq++;
                    const uniqueTime = new Date().getTime() + Entry.ITPLE.timeSeq;
    
                    sq.SET[port] = {
                        type: Entry.ITPLE.sensorTypes.NEOPIXEL_COLOR,
                        data: { num, r, g, b },
                        time: uniqueTime,
                    };
    
                    script.isStart = true;
                    script.timeFlag = Date.now();
                    return script;
                }
    
                // 10ms 대기
                if (Date.now() - script.timeFlag < 2) {
                    return script;
                }
    
                delete script.isStart;
                delete script.timeFlag;
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [{
                    syntax: 'Arduino.neopixelColor(9, %1, %2)',
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
                }]
            }
        },
        ITPLE_set_neopixel_all: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                { type: 'Block', accept: 'string', defaultType: 'text' },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    { type: 'ITPLE_color_picker_value', params: ['#00FF00'] },
                    null,
                ],
                type: 'ITPLE_set_neopixel_all',
            },
            paramsKeyMap: {
                COLOR: 0,
            },
            class: 'ITPLE_neopixel',
            isNotFor: ['ITPLE'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = 202; // 전체 설정용 가상 포트
                const color = script.getStringValue('COLOR', script);
    
                const rgb = Entry.hex2rgb(color);
                let r = rgb.r || 0;
                let g = rgb.g || 0;
                let b = rgb.b || 0;
    
                r = Math.min(255, Math.max(0, r));
                g = Math.min(255, Math.max(0, g));
                b = Math.min(255, Math.max(0, b));
    
                if (!script.isStart) {
                    if (!sq.SET) {
                        sq.SET = {};
                    }
    
                    // 시퀀스 번호로 고유한 시간 보장
                    Entry.ITPLE.timeSeq++;
                    const uniqueTime = new Date().getTime() + Entry.ITPLE.timeSeq;
    
                    sq.SET[port] = {
                        type: Entry.ITPLE.sensorTypes.NEOPIXEL_COLOR,
                        data: { num: 255, r, g, b }, // num: 255는 전체를 의미
                        time: uniqueTime,
                    };
    
                    script.isStart = true;
                    script.timeFlag = Date.now();
                    return script;
                }
    
                // 10ms 대기
                if (Date.now() - script.timeFlag < 2) {
                    return script;
                }
    
                delete script.isStart;
                delete script.timeFlag;
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.neopixelColorAll(9, %1)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ]
            },
        },
        ITPLE_set_neopixel_range: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', '0'],
                        ['2', '1'],
                        ['3', '2'],
                        ['4', '3'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['1', '0'],
                        ['2', '1'],
                        ['3', '2'],
                        ['4', '3'],
                    ],
                    value: '3',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Block', accept: 'string', defaultType: 'text' },
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
                    { type: 'ITPLE_color_picker_value', params: ['#0000FF'] },
                    null,
                ],
                type: 'ITPLE_set_neopixel_range',
            },
            paramsKeyMap: {
                START: 0,
                END: 1,
                COLOR: 2,
            },
            class: 'ITPLE_neopixel',
            isNotFor: ['ITPLE'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = 203; // 범위 설정용 가상 포트
                let start = script.getNumberValue('START', script);
                let end = script.getNumberValue('END', script);
                const color = script.getStringValue('COLOR', script);
    
                const rgb = Entry.hex2rgb(color);
                let r = rgb.r || 0;
                let g = rgb.g || 0;
                let b = rgb.b || 0;
    
                // 범위 자동 조절 (0~3)
                start = Math.min(3, Math.max(0, start));
                end = Math.min(3, Math.max(0, end));
    
                // start > end인 경우 swap
                if (start > end) {
                    const temp = start;
                    start = end;
                    end = temp;
                }
    
                // RGB 값 조절
                r = Math.min(255, Math.max(0, r));
                g = Math.min(255, Math.max(0, g));
                b = Math.min(255, Math.max(0, b));
    
                if (!script.isStart) {
                    if (!sq.SET) {
                        sq.SET = {};
                    }
    
                    // 시퀀스 번호로 고유한 시간 보장
                    Entry.ITPLE.timeSeq++;
                    const uniqueTime = new Date().getTime() + Entry.ITPLE.timeSeq;
    
                    sq.SET[port] = {
                        type: Entry.ITPLE.sensorTypes.NEOPIXEL_COLOR,
                        data: { num: 254, start, end, r, g, b }, // num: 254는 범위를 의미
                        time: uniqueTime,
                    };
    
                    script.isStart = true;
                    script.timeFlag = Date.now();
                    return script;
                }
    
                // 10ms 대기
                if (Date.now() - script.timeFlag < 2) {
                    return script;
                }
    
                delete script.isStart;
                delete script.timeFlag;
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.neopixelColorRange(9, %1, %2, %3)',
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
                ]
            },
        },
        ITPLE_set_neopixel_rotate: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['왼쪽', '-1'],
                        ['오른쪽', '1'],
                    ],
                    value: '1',
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
                params: [
                    null,
                    {
                        type: 'number',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'ITPLE_set_neopixel_rotate',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                STEPS: 1,
            },
            class: 'ITPLE_neopixel',
            isNotFor: ['ITPLE'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = 205; // 회전용 가상 포트
                let direction = script.getNumberValue('DIRECTION', script);
                let steps = script.getNumberValue('STEPS', script);
    
                // steps 범위 조절 (0~4)
                steps = Math.min(4, Math.max(0, Math.floor(steps)));
    
                if (!script.isStart) {
                    if (!sq.SET) {
                        sq.SET = {};
                    }
    
                    // 시퀀스 번호로 고유한 시간 보장
                    Entry.ITPLE.timeSeq++;
                    const uniqueTime = new Date().getTime() + Entry.ITPLE.timeSeq;
    
                    sq.SET[port] = {
                        type: Entry.ITPLE.sensorTypes.NEOPIXEL_ROTATE,
                        data: { direction, steps },
                        time: uniqueTime,
                    };
    
                    script.isStart = true;
                    script.timeFlag = Date.now();
                    return script;
                }
    
                // 10ms 대기
                if (Date.now() - script.timeFlag < 10) {
                    return script;
                }
    
                delete script.isStart;
                delete script.timeFlag;
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.neopixelRotate(9, %1, %2)',
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
                ]
            },
        },
        ITPLE_set_neopixel_brightness: {
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
                        type: 'number',
                        params: ['255'],
                    },
                    null,
                ],
                type: 'ITPLE_set_neopixel_brightness',
            },
            paramsKeyMap: {
                BRIGHTNESS: 0,
            },
            class: 'ITPLE_neopixel',
            isNotFor: ['ITPLE'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = 201;
                let brightness = script.getNumberValue('BRIGHTNESS', script);
    
                brightness = Math.min(255, Math.max(0, brightness));
    
                if (!script.isStart) {
                    if (!sq.SET) {
                        sq.SET = {};
                    }
    
                    // 시퀀스 번호로 고유한 시간 보장
                    Entry.ITPLE.timeSeq++;
                    const uniqueTime = new Date().getTime() + Entry.ITPLE.timeSeq;
    
                    sq.SET[port] = {
                        type: Entry.ITPLE.sensorTypes.NEOPIXEL_BRIGHTNESS,
                        data: brightness,
                        time: uniqueTime,
                    };
    
                    script.isStart = true;
                    script.timeFlag = Date.now();
                    return script;
                }
    
                // 10ms 대기
                if (Date.now() - script.timeFlag < 2) {
                    return script;
                }
    
                delete script.isStart;
                delete script.timeFlag;
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.neopixelBrightness(9, %1)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ]
            },
        },
        ITPLE_set_neopixel_blink: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['왼쪽', '0'],
                        ['오른쪽', '1'],
                        ['전체', '2'],
                    ],
                    value: '2',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Block', accept: 'string', defaultType: 'text' },
                { type: 'Block', accept: 'string', defaultType: 'number' },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            events: {},
            def: {
                params: [
                    null,
                    { type: 'ITPLE_color_picker_value', params: ['#FFFFFF'] },
                    { type: 'number', params: ['0.5'] },
                    null,
                ],
                type: 'ITPLE_set_neopixel_blink',
            },
            paramsKeyMap: {
                SIDE: 0,
                COLOR: 1,
                INTERVAL: 2,
            },
            class: 'ITPLE_neopixel',
            isNotFor: ['ITPLE'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = 206; // BLINK 가상 포트
    
                const side = script.getNumberValue('SIDE', script); // 2: 전체, 0: 왼쪽, 1: 오른쪽
                const count = 0; // 무한 깜박임
                const color = script.getStringValue('COLOR', script);
                let intervalSec = script.getNumberValue('INTERVAL', script);
    
                const rgb = Entry.hex2rgb(color);
                let r = rgb.r || 0;
                let g = rgb.g || 0;
                let b = rgb.b || 0;
    
                r = Math.min(255, Math.max(0, r));
                g = Math.min(255, Math.max(0, g));
                b = Math.min(255, Math.max(0, b));
                const interval = Math.max(0.1, intervalSec) * 1000; // ms
    
                if (!script.isStart) {
                    if (!sq.SET) {
                        sq.SET = {};
                    }
    
                    // 시퀀스 번호로 고유한 시간 보장 (다른 네오픽셀 동작과 통일)
                    Entry.ITPLE.timeSeq++;
                    const uniqueTime = new Date().getTime() + Entry.ITPLE.timeSeq;
    
                    sq.SET[port] = {
                        type: Entry.ITPLE.sensorTypes.NEOPIXEL_BLINK,
                        data: { side, count, r, g, b, interval },
                        time: uniqueTime,
                    };
    
                    script.isStart = true;
                    script.timeFlag = Date.now();
                    return script;
                }
    
                if (Date.now() - script.timeFlag < 2) {
                    return script;
                }
    
                delete script.isStart;
                delete script.timeFlag;
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.neopixelBlink(%1, %2, %3)',
                        textParams: [
                            { type: 'Block', accept: 'string' },
                            { type: 'Block', accept: 'string' },
                            { type: 'Block', accept: 'string' },
                        ],
                    },
                ]
            },
        },
        ITPLE_stop_neopixel_blink: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['왼쪽', '0'],
                        ['오른쪽', '1'],
                        ['전체', '2'],
                    ],
                    value: '2',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
            ],
            events: {},
            def: {
                params: [null, null],
                type: 'ITPLE_stop_neopixel_blink',
            },
            paramsKeyMap: {
                SIDE: 0,
            },
            class: 'ITPLE_neopixel',
            isNotFor: ['ITPLE'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = 206; // BLINK/STOP 통합 가상 포트
    
                if (!script.isStart) {
                    if (!sq.SET) {
                        sq.SET = {};
                    }
    
                    const side = script.getNumberValue('SIDE', script);
    
                    // 시퀀스 번호로 고유한 시간 보장
                    Entry.ITPLE.timeSeq++;
                    const uniqueTime = new Date().getTime() + Entry.ITPLE.timeSeq;
    
                    sq.SET[port] = {
                        type: Entry.ITPLE.sensorTypes.NEOPIXEL_BLINK_STOP,
                        data: { side },
                        time: uniqueTime,
                    };
    
                    script.isStart = true;
                    script.timeFlag = Date.now();
                    return script;
                }
    
                if (Date.now() - script.timeFlag < 2) {
                    return script;
                }
    
                delete script.isStart;
                delete script.timeFlag;
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    { syntax: 'Arduino.neopixelBlinkStop(9, %1)' },
                ]
            },
        },
    };
};
//endregion ITPLE 아두이노 확장모드

module.exports = Entry.ITPLE;
