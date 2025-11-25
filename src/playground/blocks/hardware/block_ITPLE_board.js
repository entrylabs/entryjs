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
        NEOPIXELINIT: 9,
        NEOPIXELCOLOR: 10,
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
            },
        },
    };
};

Entry.ITPLE.blockMenuBlocks = [
    'ITPLE_push_button',
    'ITPLE_get_button_value',
    'ITPLE_get_sensor_value',
    'ITPLE_get_ultrasonic_value',
    'ITPLE_is_key_pressed',
    'ITPLE_value_sensor',
    'ITPLE_turn_led',
    'ITPLE_set_tone',
    'ITPLE_set_motor_direction',
    'ITPLE_set_motor_speed',
    'ITPLE_set_servo',
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
          params: [
              {
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
              },
          ],
          events: {},
          def: {
              params: [null],
              type: 'ITPLE_is_key_pressed',
          },
          paramsKeyMap: {
              KEY: 1,
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

              const seletedKey = script.getField('KEY');
              const portConfig = keyToPortMap[seletedKey];

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
                      syntax: 'Arduino.digitalRead(%1)==0',
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
    };
};
//endregion ITPLE 아두이노 확장모드

module.exports = Entry.ITPLE;