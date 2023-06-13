'use strict';
const {ArduinoBase} = require('./block_roborobo_base.js');

class Roduino extends ArduinoBase {
    constructor () {
        super();

        this.id = '10.1';
        this.name = 'roborobo_roduino';
        this.url = 'http://www.roborobo.co.kr';
        this.imageName = 'roborobo_roduino.png';
        this.title = {
            ko: '로두이노',
            en: 'Roduino',
        }
        this.blockMenuBlocks = this.getBlockMenuBlocks();
    }

    /**
     * 언어 번역 사용을 위해 함수 형태로 유지
     */
    monitorTemplate () {
        return {
            //imgPath: 'hw/~~.png',
            //width: 256,
            //height: 256,
            // 모니터 화면 상단에 차례대로 나열하는 값
            listPorts: {
                digital_2: {name: (Lang.Blocks.monitor_digital + ': 2'), type: 'input', pos: {x: 0, y: 0, }},
                digital_3: {name: (Lang.Blocks.monitor_digital + ': 3'), type: 'input', pos: {x: 0, y: 0, }},
                digital_4: {name: (Lang.Blocks.monitor_digital + ': 4'), type: 'input', pos: {x: 0, y: 0, }},
                digital_5: {name: (Lang.Blocks.monitor_digital + ': 5'), type: 'input', pos: {x: 0, y: 0, }},
                digital_6: {name: (Lang.Blocks.monitor_digital + ': 6'), type: 'input', pos: {x: 0, y: 0, }},
                digital_7: {name: (Lang.Blocks.monitor_digital + ': 7'), type: 'input', pos: {x: 0, y: 0, }},
                digital_8: {name: (Lang.Blocks.monitor_digital + ': 8'), type: 'input', pos: {x: 0, y: 0, }},
                analog_0: {name: (Lang.Blocks.monitor_analog + ': A0'), type: 'input', pos: {x: 0, y: 0, }},
                analog_1: {name: (Lang.Blocks.monitor_analog + ': A1'), type: 'input', pos: {x: 0, y: 0, }},
                analog_2: {name: (Lang.Blocks.monitor_analog + ': A2'), type: 'input', pos: {x: 0, y: 0, }},
                analog_3: {name: (Lang.Blocks.monitor_analog + ': A3'), type: 'input', pos: {x: 0, y: 0, }},
                analog_4: {name: (Lang.Blocks.monitor_analog + ': A4'), type: 'input', pos: {x: 0, y: 0, }},
                analog_5: {name: (Lang.Blocks.monitor_analog + ': A5'), type: 'input', pos: {x: 0, y: 0, }},
            },
            // 모니터 화면 지정 위치와 선으로 연결하여 표시하는 값
            ports: {},
            mode: 'both',
        }
    }

    getBlockMenuBlocks () {
        return [
            'roduino_menu_digital_pin',
            'roduino_menu_analog_pin',
            'roduino_menu_pin',
            'roduino_menu_digital_value',
            'roduino_menu_motor_number',

            'roduino_set_digital',
            'roduino_set_motor_rotation',
            'roduino_set_rgbled_color',
            'roduino_change_rgbled_brightness_by',
            'roduino_set_rgbled_brightness_to',
            'roduino_play_piezobuzzer',
            'roduino_play_piezobuzzer_until_done',
            'roduino_get_digital_value',
            'roduino_get_analog_value',
            'roduino_get_sensor_value',
            'roduino_is_digital_detected',
            'roduino_compare_analog_value',
            'roduino_compare_sensor_value',
            'roduino_get_rotary_position_sensor_value',
            'roduino_reset_rotary_position_sensor',
            'roduino_get_color_sensor_detected_value',
            'roduino_is_color_sensor_detected',
            'roduino_set_color_sensor_pins',
        ];
    }

    setLanguage () {
        return {
            ko: {
                template: {
                    roduino_menu_digital_pin: '%1',
                    roduino_menu_analog_pin: '%1',
                    roduino_menu_pin: '%1',
                    roduino_menu_digital_value: '%1',
                    roduino_menu_motor_number: '%1',

                    roduino_set_digital: '%1 번 핀 디지털 값을 %2 (으)로 정하기 %3',
                    roduino_set_motor_rotation: '%1 번 모터를 %2 하기 %3',
                    roduino_set_rgbled_color: '%1 번 핀 RGB LED 색상을 %2 색으로 정하기 %3',
                    roduino_change_rgbled_brightness_by: '%1 번 핀 RGB LED 밝기를 %2 만큼 바꾸기 %3',
                    roduino_set_rgbled_brightness_to: '%1 번 핀 RGB LED 밝기를 %2 %로 정하기 %3',
                    roduino_play_piezobuzzer: '%1 번 핀 피에조 버저로 %2 옥타브 %3 음을 %4 초 소리내기 %5',
                    roduino_play_piezobuzzer_until_done: '%1 번 핀 피에조 버저로 %2 옥타브 %3 음을 %4 초 소리내며 기다리기 %5',
                    roduino_get_digital_value: '%1 번 핀 디지털 값',
                    roduino_get_analog_value: '%1 번 핀 아날로그 값',
                    roduino_get_sensor_value: '%1 번 핀 %2 값',
                    roduino_is_digital_detected: '%1 번 핀이 감지되었는가?',
                    roduino_compare_analog_value: '%1 번 핀 아날로그 값 %2 %3',
                    roduino_compare_sensor_value: '%1 번 핀 %2 값 %3 %4',
                    roduino_get_rotary_position_sensor_value: '%1 번 핀 회전 위치 센서 %2 값',
                    roduino_reset_rotary_position_sensor: '%1 번 핀 회전 위치 센서 %2 값을 %3 (으)로 정하기 %4',
                    roduino_get_color_sensor_detected_value: '%1 감지 값',
                    roduino_is_color_sensor_detected: '%1 이 감지되었는가?',
                    roduino_set_color_sensor_pins: '컬러 센서 핀을 R: %1 G: %2 B: %3 번으로 정하기 %4',
                },
                Blocks: {
                    monitor_digital: '디지털',
                    monitor_analog: '아날로그',

                    roduino_motor_state_cw: '시계 방향 회전',
                    roduino_motor_state_ccw: '시계 반대 방향 회전',
                    roduino_motor_state_stop: '정지',

                    roduino_piezobuzzer_tone_c: '도',
                    roduino_piezobuzzer_tone_c_sharp: '도♯(레♭)',
                    roduino_piezobuzzer_tone_d: '레',
                    roduino_piezobuzzer_tone_d_sharp: '레♯(미♭)',
                    roduino_piezobuzzer_tone_e: '미',
                    roduino_piezobuzzer_tone_f: '파',
                    roduino_piezobuzzer_tone_f_sharp: '파♯(솔♭)',
                    roduino_piezobuzzer_tone_g: '솔',
                    roduino_piezobuzzer_tone_g_sharp: '솔♯(라♭)',
                    roduino_piezobuzzer_tone_a: '라',
                    roduino_piezobuzzer_tone_a_sharp: '라♯(시♭)',
                    roduino_piezobuzzer_tone_b: '시',

                    roduino_sensor_temperutre: '온도 센서',
                    roduino_sensor_joystick_x: '조이스틱 x',
                    roduino_sensor_joystick_y: '조이스틱 y',
                    roduino_sensor_light: '빛 센서',
                    roduino_sensor_dial: '다이얼',
                    roduino_sensor_a_keypad: 'A 키패드',
                    roduino_sensor_rotaryposition: '회전 위치 센서',
                    roduino_sensor_magnetic: '자기 센서',
                    roduino_sensor_ultrasonic: '초음파 센서',

                    roduino_sensor_rotaryposition_rotation: '회전',
                    roduino_sensor_rotaryposition_position: '위치',
                    roduino_sensor_rotaryposition_angle: '각도',

                    roduino_sensor_color_red: '빨간색',
                    roduino_sensor_color_yellow: '노란색',
                    roduino_sensor_color_green: '초록색',
                    roduino_sensor_color_blue: '파란색',
                },
            },
            en: {
                template: {
                    roduino_menu_digital_pin: '%1',
                    roduino_menu_analog_pin: '%1',
                    roduino_menu_pin: '%1',
                    roduino_menu_digital_value: '%1',
                    roduino_menu_motor_number: '%1',

                    roduino_set_digital: 'set pin %1 digital value to %2 %3',
                    roduino_set_motor_rotation: 'set %1 the %2 motor %3',
                    roduino_set_rgbled_color: 'set %1 pin RGB LED color to the %2 color %3',
                    roduino_change_rgbled_brightness_by: 'change pin %1 RGB LED brightness by %2 %3',
                    roduino_set_rgbled_brightness_to: 'set pin %1 RGB LED brightness to %2 % %3',
                    roduino_play_piezobuzzer: 'Play pin %1 peizo buzzer with %2 otave %3 note for %4 sec %5',
                    roduino_play_piezobuzzer_until_done: 'Play pin %1 peizo buzzer with %2 otave %3 note for %4 sec and wait %5',
                    roduino_get_digital_value: 'pin %1 digital value',
                    roduino_get_analog_value: 'pin %1 analog value',
                    roduino_get_sensor_value: 'pin %1 %2 value',
                    roduino_is_digital_detected: 'pin %1 detected?',
                    roduino_compare_analog_value: 'pin %1 analog value %2 %3',
                    roduino_compare_sensor_value: 'pin %1 %2 value %3 %4',
                    roduino_get_rotary_position_sensor_value: 'rotary position sensor of pin %1 %2 value',
                    roduino_reset_rotary_position_sensor: 'rotary position sensor of pin %1 set %2 value to %3 %4',
                    roduino_get_color_sensor_detected_value: '%1 detection value',
                    roduino_is_color_sensor_detected: 'is %1 detected?',
                    roduino_set_color_sensor_pins: 'set color sensor pins to R: %1 G: %2 B: %3 %4',
                },
                Blocks: {
                    monitor_digital: 'Digital',
                    monitor_analog: 'Analog',

                    roduino_motor_state_cw: 'rotate clockwise',
                    roduino_motor_state_ccw: 'rotate counterclockwise',
                    roduino_motor_state_stop: 'stop',

                    roduino_piezobuzzer_tone_c: 'C',
                    roduino_piezobuzzer_tone_c_sharp: 'C♯(D♭)',
                    roduino_piezobuzzer_tone_d: 'D',
                    roduino_piezobuzzer_tone_d_sharp: 'D♯(E♭)',
                    roduino_piezobuzzer_tone_e: 'E',
                    roduino_piezobuzzer_tone_f: 'F',
                    roduino_piezobuzzer_tone_f_sharp: 'F♯(G♭)',
                    roduino_piezobuzzer_tone_g: 'G',
                    roduino_piezobuzzer_tone_g_sharp: 'G♯(A♭)',
                    roduino_piezobuzzer_tone_a: 'A',
                    roduino_piezobuzzer_tone_a_sharp: 'A♯(B♭)',
                    roduino_piezobuzzer_tone_b: 'B',

                    roduino_sensor_temperutre: 'temperature sensor',
                    roduino_sensor_joystick_x: 'joystick x',
                    roduino_sensor_joystick_y: 'joystick y',
                    roduino_sensor_light: 'light sensor',
                    roduino_sensor_dial: 'dial',
                    roduino_sensor_a_keypad: 'A keypad',
                    roduino_sensor_rotaryposition: 'rotary position sensor',
                    roduino_sensor_magnetic: 'magnetic sensor',
                    roduino_sensor_ultrasonic: 'ultrasonic sensor',

                    roduino_sensor_rotaryposition_rotation: 'rotation',
                    roduino_sensor_rotaryposition_position: 'position',
                    roduino_sensor_rotaryposition_angle: 'angle',

                    roduino_sensor_color_red: 'red',
                    roduino_sensor_color_yellow: 'yellow',
                    roduino_sensor_color_green: 'green',
                    roduino_sensor_color_blue: 'blue',
                },
            },
        };
    };

    getBlocks () {
        return {
            roduino_menu_digital_pin: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
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
                    PIN: 0,
                },
                func: (sprite, script) => {
                    return script.getStringField('PIN');
                },
            },
            roduino_menu_analog_pin: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            ['A0', '14'],
                            ['A1', '15'],
                            ['A2', '16'],
                            ['A3', '17'],
                            ['A4', '18'],
                            ['A5', '19'],
                        ],
                        value: '14',
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
                    PIN: 0,
                },
                func: (sprite, script) => {
                    return script.getStringField('PIN');
                },
            },
            roduino_menu_pin: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            ['A0', '14'],
                            ['A1', '15'],
                            ['A2', '16'],
                            ['A3', '17'],
                            ['A4', '18'],
                            ['A5', '19'],
                            ['2', '2'],
                            ['3', '3'],
                            ['4', '4'],
                            ['5', '5'],
                            ['6', '6'],
                            ['7', '7'],
                            ['8', '8'],
                        ],
                        value: '14',
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
                    PIN: 0,
                },
                func: (sprite, script) => {
                    return script.getStringField('PIN');
                },
            },
            roduino_menu_digital_value: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_string_field',
                statements: [],
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
                    NUM: 0,
                },
                func: (sprite, script) => {
                    return script.getStringField('NUM');
                },
            },
            roduino_menu_motor_number: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            ['1', '1'],
                            ['2', '2']
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
                    NUM: 0,
                },
                func: (sprite, script) => {
                    return script.getStringField('NUM');
                },
            },
            roduino_set_digital: {
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
                    }
                ],
                events: {},
                def: {
                    params: [
                        {
                            type: 'roduino_menu_digital_pin',
                        },
                        {
                            type: 'roduino_menu_digital_value',
                        },
                        null,
                    ],
                    type: 'roduino_set_digital',
                },
                paramsKeyMap: {
                    PIN: 0,
                    VALUE: 1,
                },
                class: 'motion',
                isNotFor: ['roborobo_roduino'],
                func: (sprite, script) => this.set_digital(sprite, script),
            },
            roduino_set_motor_rotation: {
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
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.roduino_motor_state_cw, 'cw'],
                            [Lang.Blocks.roduino_motor_state_ccw, 'ccw'],
                            [Lang.Blocks.roduino_motor_state_stop, 'stop'],
                        ],
                        value: 'cw',
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
                            type: 'roduino_menu_motor_number'
                        },
                        null,
                        null,

                    ],
                    type: 'roduino_set_motor_rotation',
                },
                paramsKeyMap: {
                    MOTOR: 0,
                    STATE: 1,
                },
                class: 'motion',
                isNotFor: ['roborobo_roduino'],
                func: (sprite, script) => this.set_motor_rotation(sprite, script)
            },
            roduino_set_rgbled_color: {
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
                    params: [
                        {
                            type: 'roduino_menu_digital_pin'
                        },
                        null,
                        null,

                    ],
                    type: 'roduino_set_rgbled_color',
                },
                paramsKeyMap: {
                    PIN: 0,
                    COLOR: 1,
                },
                class: 'looks',
                isNotFor: ['roborobo_roduino'],
                func: (sprite, script) => this.set_rgbled_color(sprite, script)
            },
            roduino_change_rgbled_brightness_by: {
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
                        defualtType: 'number',
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
                            type: 'roduino_menu_digital_pin'
                        },
                        {
                            type: 'number',
                            params: ['10'],
                        },
                        null,

                    ],
                    type: 'roduino_change_rgbled_brightness_by',
                },
                paramsKeyMap: {
                    PIN: 0,
                    BRIGHTNESS: 1,
                },
                class: 'looks',
                isNotFor: ['roborobo_roduino'],
                func: (sprite, script) => this.change_rgbled_brightness_by(sprite, script)
            },
            roduino_set_rgbled_brightness_to: {
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
                        defualtType: 'number',
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
                            type: 'roduino_menu_digital_pin'
                        },
                        {
                            type: 'number',
                            params: ['100'],
                        },
                        null,

                    ],
                    type: 'roduino_set_rgbled_brightness_to',
                },
                paramsKeyMap: {
                    PIN: 0,
                    BRIGHTNESS: 1,
                },
                class: 'looks',
                isNotFor: ['roborobo_roduino'],
                func: (sprite, script) => this.set_rgbled_brightness_to(sprite, script)
            },
            roduino_play_piezobuzzer: {
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
                        value: '4',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.roduino_piezobuzzer_tone_c, '0'],
                            [Lang.Blocks.roduino_piezobuzzer_tone_c_sharp, '1'],
                            [Lang.Blocks.roduino_piezobuzzer_tone_d, '2'],
                            [Lang.Blocks.roduino_piezobuzzer_tone_d_sharp, '3'],
                            [Lang.Blocks.roduino_piezobuzzer_tone_e, '4'],
                            [Lang.Blocks.roduino_piezobuzzer_tone_f, '5'],
                            [Lang.Blocks.roduino_piezobuzzer_tone_f_sharp, '6'],
                            [Lang.Blocks.roduino_piezobuzzer_tone_g, '7'],
                            [Lang.Blocks.roduino_piezobuzzer_tone_g_sharp, '8'],
                            [Lang.Blocks.roduino_piezobuzzer_tone_a, '9'],
                            [Lang.Blocks.roduino_piezobuzzer_tone_a_sharp, '10'],
                            [Lang.Blocks.roduino_piezobuzzer_tone_b, '11'],
                        ],
                        value: '0',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defualtType: 'number',
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
                            type: 'roduino_menu_digital_pin'
                        },
                        null,
                        null,
                        {
                            type: 'number',
                            params: ['0.5'],
                        },
                        null,

                    ],
                    type: 'roduino_play_piezobuzzer',
                },
                paramsKeyMap: {
                    PIN: 0,
                    OCTAVE: 1,
                    NOTE: 2,
                    DURATION: 3,
                },
                class: 'sound',
                isNotFor: ['roborobo_roduino'],
                func: (sprite, script) => this.play_piezobuzzer(sprite, script)
            },
            roduino_play_piezobuzzer_until_done: {
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
                        value: '4',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.roduino_piezobuzzer_tone_c, '0'],
                            [Lang.Blocks.roduino_piezobuzzer_tone_c_sharp, '1'],
                            [Lang.Blocks.roduino_piezobuzzer_tone_d, '2'],
                            [Lang.Blocks.roduino_piezobuzzer_tone_d_sharp, '3'],
                            [Lang.Blocks.roduino_piezobuzzer_tone_e, '4'],
                            [Lang.Blocks.roduino_piezobuzzer_tone_f, '5'],
                            [Lang.Blocks.roduino_piezobuzzer_tone_f_sharp, '6'],
                            [Lang.Blocks.roduino_piezobuzzer_tone_g, '7'],
                            [Lang.Blocks.roduino_piezobuzzer_tone_g_sharp, '8'],
                            [Lang.Blocks.roduino_piezobuzzer_tone_a, '9'],
                            [Lang.Blocks.roduino_piezobuzzer_tone_a_sharp, '10'],
                            [Lang.Blocks.roduino_piezobuzzer_tone_b, '11'],
                        ],
                        value: '0',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defualtType: 'number',
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
                            type: 'roduino_menu_digital_pin'
                        },
                        null,
                        null,
                        {
                            type: 'number',
                            params: ['0.5'],
                        },
                        null,

                    ],
                    type: 'roduino_play_piezobuzzer_until_done',
                },
                paramsKeyMap: {
                    PIN: 0,
                    OCTAVE: 1,
                    NOTE: 2,
                    DURATION: 3,
                },
                class: 'sound',
                isNotFor: ['roborobo_roduino'],
                func: (sprite, script) => this.play_piezobuzzer_until_done(sprite, script)
            },
            roduino_get_digital_value: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_string_field',
                statements: [],
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
                            type: 'roduino_menu_digital_pin',
                        },
                    ],
                    type: 'roduino_get_digital_value',
                },
                paramsKeyMap: {
                    PIN: 0,
                },
                class: 'sensing',
                isNotFor: ['roborobo_roduino'],
                func: (sprite, script) => this.get_digital_value(sprite, script),
            },
            roduino_get_analog_value: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_string_field',
                statements: [],
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
                            type: 'roduino_menu_analog_pin',
                        },
                    ],
                    type: 'roduino_get_analog_value',
                },
                paramsKeyMap: {
                    PIN: 0,
                },
                class: 'sensing',
                isNotFor: ['roborobo_roduino'],
                func: (sprite, script) => this.get_analog_value(sprite, script),
            },
            roduino_get_sensor_value: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.roduino_sensor_temperutre, 'temperature'],
                            [Lang.Blocks.roduino_sensor_joystick_x, 'joystickx'],
                            [Lang.Blocks.roduino_sensor_joystick_y, 'joysticky'],
                            [Lang.Blocks.roduino_sensor_light, 'light'],
                            [Lang.Blocks.roduino_sensor_dial, 'dial'],
                            [Lang.Blocks.roduino_sensor_a_keypad, 'akeypad'],
                            [Lang.Blocks.roduino_sensor_rotaryposition, 'rotaryposition'],
                            [Lang.Blocks.roduino_sensor_magnetic, 'magnetic'],
                            [Lang.Blocks.roduino_sensor_ultrasonic, 'ultrasonic'],
                        ],
                        value: 'temperature',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                def: {
                    params: [
                        {
                            type: 'roduino_menu_pin',
                        },
                        null,
                    ],
                    type: 'roduino_get_sensor_value',
                },
                paramsKeyMap: {
                    PIN: 0,
                    SENSOR: 1,
                },
                class: 'sensing',
                isNotFor: ['roborobo_roduino'],
                func: (sprite, script) => this.get_sensor_value(sprite, script)
            },
            roduino_is_digital_detected: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_boolean_field',
                statements: [],
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
                            type: 'roduino_menu_digital_pin',
                        },
                    ],
                    type: 'roduino_is_digital_detected',
                },
                paramsKeyMap: {
                    PIN: 0,
                },
                class: 'sensing',
                isNotFor: ['roborobo_roduino'],
                func: (sprite, script) => this.is_digital_detected(sprite, script),
            },
            roduino_compare_analog_value: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_boolean_field',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            ['>', 'greater-than'],
                            ['=', 'equal'],
                            ['<', 'less-than'],
                        ],
                        value: 'greater-than',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defualtType: 'number',
                    },
                ],
                events: {},
                def: {
                    params: [
                        {
                            type: 'roduino_menu_analog_pin',
                        },
                        null,
                        {
                            type: 'number',
                            params: ['512'],
                        },
                    ],
                    type: 'roduino_compare_analog_value',
                },
                paramsKeyMap: {
                    PIN: 0,
                    SYMBOL: 1,
                    VALUE: 2,
                },
                class: 'sensing',
                isNotFor: ['roborobo_roduino'],
                func: (sprite, script) => this.compare_analog_value(sprite, script),
            },
            roduino_compare_sensor_value: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_boolean_field',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.roduino_sensor_temperutre, 'temperature'],
                            [Lang.Blocks.roduino_sensor_joystick_x, 'joystickx'],
                            [Lang.Blocks.roduino_sensor_joystick_y, 'joysticky'],
                            [Lang.Blocks.roduino_sensor_light, 'light'],
                            [Lang.Blocks.roduino_sensor_dial, 'dial'],
                            [Lang.Blocks.roduino_sensor_a_keypad, 'akeypad'],
                            [Lang.Blocks.roduino_sensor_rotaryposition, 'rotaryposition'],
                            [Lang.Blocks.roduino_sensor_magnetic, 'magnetic'],
                            [Lang.Blocks.roduino_sensor_ultrasonic, 'ultrasonic'],
                        ],
                        value: 'temperature',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            ['>', 'greater-than'],
                            ['=', 'equal'],
                            ['<', 'less-than'],
                        ],
                        value: 'greater-than',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defualtType: 'number',
                    },
                ],
                events: {},
                def: {
                    params: [
                        {
                            type: 'roduino_menu_pin',
                        },
                        null,
                        null,
                        {
                            type: 'number',
                            params: ['0'],
                        },
                    ],
                    type: 'roduino_compare_sensor_value',
                },
                paramsKeyMap: {
                    PIN: 0,
                    SENSOR: 1,
                    SYMBOL: 2,
                    VALUE: 3,
                },
                class: 'sensing',
                isNotFor: ['roborobo_roduino'],
                func: (sprite, script) => this.compare_sensor_value(sprite, script),
            },

            roduino_get_rotary_position_sensor_value: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.roduino_sensor_rotaryposition_rotation, 'rotation'],
                            [Lang.Blocks.roduino_sensor_rotaryposition_position, 'position'],
                            [Lang.Blocks.roduino_sensor_rotaryposition_angle, 'angle']
                        ],
                        value: 'rotation',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                def: {
                    params: [
                        {
                            type: 'roduino_menu_analog_pin',
                        },
                        null,
                    ],
                    type: 'roduino_get_rotary_position_sensor_value',
                },
                paramsKeyMap: {
                    PIN: 0,
                    PROPERTY: 1,
                },
                class: 'sensing_rotary_position_sensor',
                isNotFor: ['roborobo_roduino'],
                func: (sprite, script) => this.get_rotary_position_sensor_value(sprite, script)
            },

            roduino_reset_rotary_position_sensor: {
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
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.roduino_sensor_rotaryposition_rotation, 'rotation'],
                            [Lang.Blocks.roduino_sensor_rotaryposition_position, 'position'],
                            [Lang.Blocks.roduino_sensor_rotaryposition_angle, 'angle']
                        ],
                        value: 'rotation',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defualtType: 'number',
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
                            type: 'roduino_menu_analog_pin',
                        },
                        null,
                        {
                            type: 'number',
                            params: ['0'],
                        },
                        null,
                    ],
                    type: 'roduino_reset_rotary_position_sensor',
                },
                paramsKeyMap: {
                    PIN: 0,
                    PROPERTY: 1,
                    VALUE: 2,
                },
                class: 'sensing_rotary_position_sensor',
                isNotFor: ['roborobo_roduino'],
                func: (sprite, script) => this.reset_rotary_position_sensor(sprite, script)
            },
            roduino_get_color_sensor_detected_value: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.roduino_sensor_color_red, '#FF0000'],
                            [Lang.Blocks.roduino_sensor_color_yellow, '#FFEE00'],
                            [Lang.Blocks.roduino_sensor_color_green, '#00AA00'],
                            [Lang.Blocks.roduino_sensor_color_blue, '#0055FF'],
                        ],
                        value: '#FF0000',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                def: {
                    params: [
                        null,
                    ],
                    type: 'roduino_get_color_sensor_detected_value',
                },
                paramsKeyMap: {
                    COLOR: 0,
                },
                class: 'sensing_color_sensor',
                isNotFor: ['roborobo_roduino'],
                func: (sprite, script) => this.get_color_sensor_detected_value(sprite, script)
            },
            roduino_is_color_sensor_detected: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_boolean_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.roduino_sensor_color_red, '#FF0000'],
                            [Lang.Blocks.roduino_sensor_color_yellow, '#FFEE00'],
                            [Lang.Blocks.roduino_sensor_color_green, '#00AA00'],
                            [Lang.Blocks.roduino_sensor_color_blue, '#0055FF'],
                        ],
                        value: '#FF0000',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                def: {
                    params: [
                        null,
                    ],
                    type: 'roduino_is_color_sensor_detected',
                },
                paramsKeyMap: {
                    COLOR: 0,
                },
                class: 'sensing_color_sensor',
                isNotFor: ['roborobo_roduino'],
                func: (sprite, script) => this.is_color_sensor_detected(sprite, script)
            },
            roduino_set_color_sensor_pins: {
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
                            type: 'roduino_menu_digital_pin',
                            params: ['6'],
                        },
                        {
                            type: 'roduino_menu_digital_pin',
                            params: ['7'],
                        },
                        {
                            type: 'roduino_menu_digital_pin',
                            params: ['8'],
                        },
                        null,
                    ],
                    type: 'roduino_set_color_sensor_pins',
                },
                paramsKeyMap: {
                    RED: 0,
                    GREEN: 1,
                    BLUE: 2,
                },
                class: 'sensing_color_sensor',
                isNotFor: ['roborobo_roduino'],
                func: (sprite, script) => this.set_color_sensor_pins(sprite, script)
            },
        };
    };

    setZero () {
        super.setZero();
    }

    afterReceive (data) {
        super.afterReceive(data);
    }

    afterSend () {
        super.afterSend();
    }

    request (func, subkey, value, updateNow = false) {
        super.request(func, subkey, value, updateNow);
    }

    resetState () {
        super.resetState();
        this.state.tx = {color: {pins: {r: -1, g: -1, b: -1}}};
    }

    /**
     * -----------------------------------block execute-----------------------------------
     * 공통 사용 함수를 제외한 나머지 블록 동작을 작성
     * -----------------------------------------------------------------------------------
     */

    set_motor_rotation (sprite, script) {
        const motor = script.getNumberValue('MOTOR');
        const state = script.getStringValue('STATE');

        let stateNum = 0;
        if (state == 'cw') stateNum = 1;
        else if (state == 'ccw') stateNum = 2;

        this.request('setMotor', motor, {motor, speed: 0, state: stateNum});
        return script.callReturn();
    }

    get_color_sensor_detected_value (sprite, script) {
        const color = script.getStringValue('COLOR');
        return this._isColorSensorDetected(color) ? 1 : 0;
    }

    is_color_sensor_detected (sprite, script) {
        const color = script.getStringValue('COLOR');
        return this._isColorSensorDetected(color);
    }

    _isColorSensorDetected (color) {
        const pins = this.state.tx.color.pins;
        if (!pins || !this.isDigitalPin(pins.r) || !this.isDigitalPin(pins.g) || !this.isDigitalPin(pins.b)) return false;

        const r = this.getDigitalValue(pins.r);
        const g = this.getDigitalValue(pins.g);
        const b = this.getDigitalValue(pins.b);

        switch (color) {
            case '#FF0000':
                return r == 1 && g == 0 && b == 0;
            case '#00AA00':
                return r == 0 && g == 1 && b == 0;
            case '#0055FF':
                return r == 0 && g == 0 && b == 1;
            case '#FFEE00':
                return r == 1 && g == 1 && b == 1;
        }
        return false;
    }

    set_color_sensor_pins (sprite, script) {
        const r = this.pinToNumber(script.getStringValue('RED'));
        const g = this.pinToNumber(script.getStringValue('GREEN'));
        const b = this.pinToNumber(script.getStringValue('BLUE'));

        const colorPins = this.state.tx.color.pins;
        if (!colorPins) return;

        if (colorPins.r != r) {
            this.request('enableDigitalInput', r, {pin: r});
            colorPins.r = r;
        }
        if (colorPins.g != g) {
            this.request('enableDigitalInput', g, {pin: g});
            colorPins.g = g;
        }
        if (colorPins.b != b) {
            this.request('enableDigitalInput', b, {pin: b}, true);
            colorPins.b = b;
        }
    }
}

module.exports = new Roduino();