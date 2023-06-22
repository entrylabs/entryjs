'use strict';
const {ArduinoBase, Cast} = require('./block_roborobo_base.js');

class RoE extends ArduinoBase {
    constructor () {
        super();

        this.id = '48.1';
        this.name = 'roborobo_roe';
        this.url = 'http://www.roborobo.co.kr';
        this.imageName = 'roborobo_roe.png';
        this.title = {
            ko: '로이',
            en: 'Ro-E',
        };
        this.blockMenuBlocks = this.getBlockMenuBlocks();
    }

    /**
     * 언어 번역 사용을 위해 함수 형태로 유지
     */
    monitorTemplate () {
        this.request('language', null, {
            roe_sensor_color_red: Lang.Blocks.roe_sensor_color_red,
            roe_sensor_color_orange: Lang.Blocks.roe_sensor_color_orange,
            roe_sensor_color_yellow: Lang.Blocks.roe_sensor_color_yellow,
            roe_sensor_color_yellow_green: Lang.Blocks.roe_sensor_color_yellow_green,
            roe_sensor_color_green: Lang.Blocks.roe_sensor_color_green,
            roe_sensor_color_sky_blue: Lang.Blocks.roe_sensor_color_sky_blue,
            roe_sensor_color_blue: Lang.Blocks.roe_sensor_color_blue,
            roe_sensor_color_purple: Lang.Blocks.roe_sensor_color_purple,
            roe_sensor_color_pink: Lang.Blocks.roe_sensor_color_pink,
            roe_sensor_color_black: Lang.Blocks.roe_sensor_color_black,
            roe_sensor_color_white: Lang.Blocks.roe_sensor_color_white,
            roe_sensor_color_unknown: Lang.Blocks.roe_sensor_color_unknown,
        }, true);

        return {
            //imgPath: 'hw/~~.png',
            //width: 256,
            //height: 256,
            // 모니터 화면 상단에 차례대로 나열하는 값
            listPorts: {
                sensor_touch: {name: Lang.Blocks.roe_sensor_touch, type: 'input', pos: {x: 0, y: 0, }},
                sensor_infrared: {name: Lang.Blocks.roe_sensor_infrared, type: 'input', pos: {x: 0, y: 0, }},
                sensor_color_left: {name: Lang.Blocks.roe_sensor_color_left, type: 'input', pos: {x: 0, y: 0, }},
                sensor_color_right: {name: Lang.Blocks.roe_sensor_color_right, type: 'input', pos: {x: 0, y: 0, }},
            },
            // 모니터 화면 지정 위치와 선으로 연결하여 표시하는 값
            ports: {},
            mode: 'both',
        };
    }

    getBlockMenuBlocks () {
        return [
            'roe_set_both_step_motors',
            'roe_set_both_step_motors_by_distance',
            'roe_set_step_motor_by_distance',
            'roe_set_line_tracing_mode',
            'roe_stop_line_tracing',
            'roe_set_rgbled_color',
            'roe_set_rgbled_off',
            'roe_play_piezobuzzer',
            'roe_play_piezobuzzer_until_done',
            'roe_get_sensor_value',
            'roe_get_color_sensor_value',
            'roe_is_sensor_detected',
            'roe_is_color_sensor_detected',
            'roe_is_both_color_sensor_detected',
        ];
    }

    setLanguage () {
        return {
            ko: {
                template: {
                    roe_set_both_step_motors: '%1 하기 %2',
                    roe_set_both_step_motors_by_distance: '%1 만큼 %2 %3',
                    roe_set_step_motor_by_distance: '%1 모터 %2 만큼 %3 %4',
                    roe_set_line_tracing_mode: '%1 (을)를 따라 이동하기 %2',
                    roe_stop_line_tracing: '선 따라 이동하기를 멈추기 %1',
                    roe_set_rgbled_color: 'led 색상을 %1 으로 정하기 %2',
                    roe_set_rgbled_off: 'led 끄기 %1',
                    roe_play_piezobuzzer: '스피커로 %1 옥타브 %2 음을 %3 초 소리내기 %4',
                    roe_play_piezobuzzer_until_done: '스피커로 %1 옥타브 %2 음을 %3 초 소리내며 기다리기 %4',
                    roe_get_sensor_value: '%1 센서 값',
                    roe_get_color_sensor_value: '%1 컬러 센서에 감지된 색',
                    roe_is_sensor_detected: '%1 센서가 %2 ?',
                    roe_is_color_sensor_detected: '%1 컬러 센서에 %2 이 %3 ?',
                    roe_is_both_color_sensor_detected: '왼쪽 컬러 센서에 %1 이 %2, 오른쪽 컬러 센서에 %3 색이 %4 ?',
                },
                Blocks: {
                    roe_parts_position_left: '왼쪽',
                    roe_parts_position_right: '오른쪽',
                    roe_parts_position_both: '양쪽',

                    roe_motor_state_cw: '시계 방향 회전',
                    roe_motor_state_ccw: '시계 반대 방향 회전',
                    roe_motor_state_stop: '정지',

                    roe_motors_state_forward: '앞으로 이동',
                    roe_motors_state_backward: '뒤로 이동',
                    roe_motors_state_turn_left: '왼쪽으로 회전',
                    roe_motors_state_turn_right: '오른쪽으로 회전',
                    roe_motors_state_stop: '정지',

                    roe_line_type_curve: '곡선',
                    roe_line_type_intersection: '교차선',

                    roe_piezobuzzer_tone_c: '도',
                    roe_piezobuzzer_tone_c_sharp: '도♯(레♭)',
                    roe_piezobuzzer_tone_d: '레',
                    roe_piezobuzzer_tone_d_sharp: '레♯(미♭)',
                    roe_piezobuzzer_tone_e: '미',
                    roe_piezobuzzer_tone_f: '파',
                    roe_piezobuzzer_tone_f_sharp: '파♯(솔♭)',
                    roe_piezobuzzer_tone_g: '솔',
                    roe_piezobuzzer_tone_g_sharp: '솔♯(라♭)',
                    roe_piezobuzzer_tone_a: '라',
                    roe_piezobuzzer_tone_a_sharp: '라♯(시♭)',
                    roe_piezobuzzer_tone_b: '시',

                    roe_check_detected: '감지되었는가',
                    roe_check_not_detected: '감지되지 않았는가',
                    roe_sensing_detected_between: '감지되고',
                    roe_sensing_not_detected_between: '감지되지 않고',

                    roe_sensor_touch: '접촉 센서',
                    roe_sensor_infrared: '적외선 센서',
                    roe_sensor_color_left: '왼쪽 컬러 센서',
                    roe_sensor_color_right: '오른쪽 컬러 센서',

                    roe_sensor_color_red: '빨간색',
                    roe_sensor_color_orange: '주황색',
                    roe_sensor_color_yellow: '노란색',
                    roe_sensor_color_yellow_green: '연두색',
                    roe_sensor_color_green: '초록색',
                    roe_sensor_color_sky_blue: '하늘색',
                    roe_sensor_color_blue: '파란색',
                    roe_sensor_color_purple: '보라색',
                    roe_sensor_color_pink: '분홍색',
                    roe_sensor_color_white: '흰색',
                    roe_sensor_color_black: '검정색',
                    roe_sensor_color_any: '아무 색',
                    roe_sensor_color_unknown: '알 수 없음',
                },
            },
            en: {
                template: {
                    roe_set_both_step_motors: '%1 %2',
                    roe_set_both_step_motors_by_distance: '%1 by %2 %3',
                    roe_set_step_motor_by_distance: '%1 motor %2 by %3 %4',
                    roe_set_line_tracing_mode: 'move tracing %1 %2',
                    roe_stop_line_tracing: 'stop moving along a line %1',
                    roe_set_rgbled_color: 'set led color to %1 %2',
                    roe_set_rgbled_off: 'turn off led %1',
                    roe_play_piezobuzzer: 'play %1 otave %2 note for %3 seconds through the speaker %4',
                    roe_play_piezobuzzer_until_done: 'wait with speaker to play %1 otave %2 note for %3 seconds %4',
                    roe_get_sensor_value: '%1 sensor value',
                    roe_get_color_sensor_value: 'color detected by %1 color sensor',
                    roe_is_sensor_detected: 'is %1 sensor %2 ?',
                    roe_is_color_sensor_detected: 'is %2 color on %1 color sensor %3 ?',
                    roe_is_both_color_sensor_detected: 'is %1 color on left color sensor %2 and %3 color on right color sensor %4 ?',
                },
                Blocks: {
                    roe_parts_position_left: 'left',
                    roe_parts_position_right: 'right',
                    roe_parts_position_both: 'both sides',

                    roe_motor_state_cw: 'rotate clockwise',
                    roe_motor_state_ccw: 'rotate counterclockwise',
                    roe_motor_state_stop: 'stop',

                    roe_motors_state_forward: 'move forward',
                    roe_motors_state_backward: 'move backword',
                    roe_motors_state_turn_left: 'turn left',
                    roe_motors_state_turn_right: 'turn right',
                    roe_motors_state_stop: 'stop',

                    roe_line_type_curve: 'curve',
                    roe_line_type_intersection: 'intersection',

                    roe_piezobuzzer_tone_c: 'C',
                    roe_piezobuzzer_tone_c_sharp: 'C♯(D♭)',
                    roe_piezobuzzer_tone_d: 'D',
                    roe_piezobuzzer_tone_d_sharp: 'D♯(E♭)',
                    roe_piezobuzzer_tone_e: 'E',
                    roe_piezobuzzer_tone_f: 'F',
                    roe_piezobuzzer_tone_f_sharp: 'F♯(G♭)',
                    roe_piezobuzzer_tone_g: 'G',
                    roe_piezobuzzer_tone_g_sharp: 'G♯(A♭)',
                    roe_piezobuzzer_tone_a: 'A',
                    roe_piezobuzzer_tone_a_sharp: 'A♯(B♭)',
                    roe_piezobuzzer_tone_b: 'B',

                    roe_check_detected: 'detected',
                    roe_check_not_detected: 'not detected',
                    roe_sensing_detected_between: 'detected',
                    roe_sensing_not_detected_between: 'not detected',

                    roe_sensor_touch: 'touch sensor',
                    roe_sensor_infrared: 'infrared sensor',
                    roe_sensor_color_left: 'left color sensor',
                    roe_sensor_color_right: 'right color sensor',

                    roe_sensor_color_red: 'red',
                    roe_sensor_color_orange: 'orange',
                    roe_sensor_color_yellow: 'yellow',
                    roe_sensor_color_yellow_green: 'yellow green',
                    roe_sensor_color_green: 'green',
                    roe_sensor_color_sky_blue: 'sky blue',
                    roe_sensor_color_blue: 'blue',
                    roe_sensor_color_purple: 'purple',
                    roe_sensor_color_pink: 'pink',
                    roe_sensor_color_white: 'white',
                    roe_sensor_color_black: 'black',
                    roe_sensor_color_any: 'any',
                    roe_sensor_color_unknown: 'unknown',
                },
            },
        };
    };

    getBlocks () {
        return {
            roe_set_both_step_motors: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.roe_motors_state_forward, 'forward'],
                            [Lang.Blocks.roe_motors_state_backward, 'backward'],
                            [Lang.Blocks.roe_motors_state_turn_left, 'turn-left'],
                            [Lang.Blocks.roe_motors_state_turn_right, 'turn-right'],
                            [Lang.Blocks.roe_motors_state_stop, 'stop'],
                        ],
                        value: 'forward',
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
                        null,

                    ],
                    type: 'roe_set_both_step_motors',
                },
                paramsKeyMap: {
                    STATE: 0,
                },
                class: 'motion',
                isNotFor: ['roborobo_roe'],
                func: (sprite, script) => this.set_both_step_motors(sprite, script)
            },
            roe_set_both_step_motors_by_distance: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                        defualtType: 'number',
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.roe_motors_state_forward, 'forward'],
                            [Lang.Blocks.roe_motors_state_backward, 'backward'],
                            [Lang.Blocks.roe_motors_state_turn_left, 'turn-left'],
                            [Lang.Blocks.roe_motors_state_turn_right, 'turn-right'],
                            [Lang.Blocks.roe_motors_state_stop, 'stop'],
                        ],
                        value: 'forward',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                            type: 'number',
                            params: ['100'],
                        },
                        null,
                        null,
                    ],
                    type: 'roe_set_both_step_motors_by_distance',
                },
                paramsKeyMap: {
                    DISTANCE: 0,
                    STATE: 1,
                },
                class: 'motion',
                isNotFor: ['roborobo_roe'],
                func: (sprite, script) => this.set_both_step_motors_by_distance(sprite, script),
            },
            roe_set_step_motor_by_distance: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.roe_parts_position_left, 'left'],
                            [Lang.Blocks.roe_parts_position_right, 'right'],
                        ],
                        value: 'left',
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
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.roe_motor_state_cw, 'cw'],
                            [Lang.Blocks.roe_motor_state_ccw, 'ccw'],
                            [Lang.Blocks.roe_motor_state_stop, 'stop'],
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
                        null,
                        {
                            type: 'number',
                            params: ['100'],
                        },
                        null,
                        null,

                    ],
                    type: 'roe_set_step_motor_by_distance',
                },
                paramsKeyMap: {
                    POSITION: 0,
                    DISTANCE: 1,
                    STATE: 2,
                },
                class: 'motion',
                isNotFor: ['roborobo_roe'],
                func: (sprite, script) => this.set_step_motor_by_distance(sprite, script)
            },
            roe_set_line_tracing_mode: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.roe_line_type_curve, 'curve'],
                            [Lang.Blocks.roe_line_type_intersection, 'intersection'],
                        ],
                        value: 'curve',
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
                        null,

                    ],
                    type: 'roe_set_line_tracing_mode',
                },
                paramsKeyMap: {
                    OPTION: 0,
                },
                class: 'motion',
                isNotFor: ['roborobo_roe'],
                func: (sprite, script) => this.set_line_tracing_mode(sprite, script)
            },
            roe_stop_line_tracing: {
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
                    type: 'roe_stop_line_tracing',
                },
                paramsKeyMap: {
                },
                class: 'motion',
                isNotFor: ['roborobo_roe'],
                func: (sprite, script) => this.stop_line_tracing(sprite, script)
            },
            roe_set_rgbled_color: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.roe_sensor_color_red, '#FF0000'],
                            [Lang.Blocks.roe_sensor_color_orange, '#FF8800'],
                            [Lang.Blocks.roe_sensor_color_yellow, '#FFEE00'],
                            [Lang.Blocks.roe_sensor_color_yellow_green, '#88EE00'],
                            [Lang.Blocks.roe_sensor_color_green, '#00AA00'],
                            [Lang.Blocks.roe_sensor_color_sky_blue, '#00DDFF'],
                            [Lang.Blocks.roe_sensor_color_blue, '#0055FF'],
                            [Lang.Blocks.roe_sensor_color_purple, '#8800FF'],
                            [Lang.Blocks.roe_sensor_color_pink, '#FF55FF'],
                            [Lang.Blocks.roe_sensor_color_white, '#FFFFFF'],
                            [Lang.Blocks.roe_sensor_color_black, '#000000'],
                            [Lang.Blocks.roe_sensor_color_any, 'random'],
                        ],
                        value: 'random',
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
                        null,
                    ],
                    type: 'roe_set_rgbled_color',
                },
                paramsKeyMap: {
                    COLOR: 0,
                },
                class: 'looks',
                isNotFor: ['roborobo_roe'],
                func: (sprite, script) => this.set_rgbled_color(sprite, script)
            },
            roe_set_rgbled_off: {
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
                    type: 'roe_set_rgbled_off',
                },
                paramsKeyMap: {},
                class: 'looks',
                isNotFor: ['roborobo_roe'],
                func: (sprite, script) => this.set_rgbled_off(sprite, script)
            },
            roe_play_piezobuzzer: {
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
                            [Lang.Blocks.roe_piezobuzzer_tone_c, '0'],
                            [Lang.Blocks.roe_piezobuzzer_tone_c_sharp, '1'],
                            [Lang.Blocks.roe_piezobuzzer_tone_d, '2'],
                            [Lang.Blocks.roe_piezobuzzer_tone_d_sharp, '3'],
                            [Lang.Blocks.roe_piezobuzzer_tone_e, '4'],
                            [Lang.Blocks.roe_piezobuzzer_tone_f, '5'],
                            [Lang.Blocks.roe_piezobuzzer_tone_f_sharp, '6'],
                            [Lang.Blocks.roe_piezobuzzer_tone_g, '7'],
                            [Lang.Blocks.roe_piezobuzzer_tone_g_sharp, '8'],
                            [Lang.Blocks.roe_piezobuzzer_tone_a, '9'],
                            [Lang.Blocks.roe_piezobuzzer_tone_a_sharp, '10'],
                            [Lang.Blocks.roe_piezobuzzer_tone_b, '11'],
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
                        null,
                        null,
                        {
                            type: 'number',
                            params: ['0.5'],
                        },
                        null,

                    ],
                    type: 'roe_play_piezobuzzer',
                },
                paramsKeyMap: {
                    OCTAVE: 0,
                    NOTE: 1,
                    DURATION: 2,
                },
                class: 'sound',
                isNotFor: ['roborobo_roe'],
                func: (sprite, script) => this.play_piezobuzzer(sprite, script)
            },
            roe_play_piezobuzzer_until_done: {
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
                            [Lang.Blocks.roe_piezobuzzer_tone_c, '0'],
                            [Lang.Blocks.roe_piezobuzzer_tone_c_sharp, '1'],
                            [Lang.Blocks.roe_piezobuzzer_tone_d, '2'],
                            [Lang.Blocks.roe_piezobuzzer_tone_d_sharp, '3'],
                            [Lang.Blocks.roe_piezobuzzer_tone_e, '4'],
                            [Lang.Blocks.roe_piezobuzzer_tone_f, '5'],
                            [Lang.Blocks.roe_piezobuzzer_tone_f_sharp, '6'],
                            [Lang.Blocks.roe_piezobuzzer_tone_g, '7'],
                            [Lang.Blocks.roe_piezobuzzer_tone_g_sharp, '8'],
                            [Lang.Blocks.roe_piezobuzzer_tone_a, '9'],
                            [Lang.Blocks.roe_piezobuzzer_tone_a_sharp, '10'],
                            [Lang.Blocks.roe_piezobuzzer_tone_b, '11'],
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
                        null,
                        null,
                        {
                            type: 'number',
                            params: ['0.5'],
                        },
                        null,

                    ],
                    type: 'roe_play_piezobuzzer_until_done',
                },
                paramsKeyMap: {
                    OCTAVE: 0,
                    NOTE: 1,
                    DURATION: 2,
                },
                class: 'sound',
                isNotFor: ['roborobo_roe'],
                func: (sprite, script) => this.play_piezobuzzer_until_done(sprite, script)
            },
            roe_get_sensor_value: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.roe_sensor_touch, 'touch'],
                            [Lang.Blocks.roe_sensor_infrared, 'infrared'],
                        ],
                        value: 'touch',
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
                    type: 'roe_get_sensor_value',
                },
                paramsKeyMap: {
                    SENSOR: 0,
                },
                class: 'sensing',
                isNotFor: ['roborobo_roe'],
                func: (sprite, script) => this.get_sensor_value(sprite, script),
            },
            roe_get_color_sensor_value: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.roe_parts_position_left, 'left'],
                            [Lang.Blocks.roe_parts_position_right, 'right'],
                        ],
                        value: 'left',
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
                    type: 'roe_get_color_sensor_value',
                },
                paramsKeyMap: {
                    POSITION: 0,
                },
                class: 'sensing',
                isNotFor: ['roborobo_roe'],
                func: (sprite, script) => this.get_color_sensor_value(sprite, script),
            },
            roe_is_sensor_detected: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_boolean_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.roe_sensor_touch, 'touch'],
                            [Lang.Blocks.roe_sensor_infrared, 'infrared'],
                        ],
                        value: 'touch',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.roe_check_detected, 'detected'],
                            [Lang.Blocks.roe_check_not_detected, 'not-detected'],
                        ],
                        value: 'detected',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                def: {
                    params: [
                        null,
                        null,
                    ],
                    type: 'roe_is_sensor_detected',
                },
                paramsKeyMap: {
                    SENSOR: 0,
                    MODE: 1,
                },
                class: 'sensing',
                isNotFor: ['roborobo_roe'],
                func: (sprite, script) => this.is_sensor_detected(sprite, script)
            },
            roe_is_color_sensor_detected: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_boolean_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.roe_parts_position_both, 'both'],
                            [Lang.Blocks.roe_parts_position_left, 'left'],
                            [Lang.Blocks.roe_parts_position_right, 'right'],
                        ],
                        value: 'both',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.roe_sensor_color_red, '#FF0000'],
                            [Lang.Blocks.roe_sensor_color_orange, '#FF8800'],
                            [Lang.Blocks.roe_sensor_color_yellow, '#FFEE00'],
                            [Lang.Blocks.roe_sensor_color_yellow_green, '#88EE00'],
                            [Lang.Blocks.roe_sensor_color_green, '#00AA00'],
                            [Lang.Blocks.roe_sensor_color_sky_blue, '#00DDFF'],
                            [Lang.Blocks.roe_sensor_color_blue, '#0055FF'],
                            [Lang.Blocks.roe_sensor_color_purple, '#8800FF'],
                            [Lang.Blocks.roe_sensor_color_pink, '#FF55FF'],
                            [Lang.Blocks.roe_sensor_color_white, '#FFFFFF'],
                            [Lang.Blocks.roe_sensor_color_black, '#000000'],
                            [Lang.Blocks.roe_sensor_color_any, 'random'],
                        ],
                        value: 'random',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.roe_check_detected, 'detected'],
                            [Lang.Blocks.roe_check_not_detected, 'not-detected'],
                        ],
                        value: 'detected',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                def: {
                    params: [
                        null,
                        null,
                        null,
                    ],
                    type: 'roe_is_color_sensor_detected',
                },
                paramsKeyMap: {
                    POSITION: 0,
                    COLOR: 1,
                    MODE: 2,
                },
                class: 'sensing',
                isNotFor: ['roborobo_roe'],
                func: (sprite, script) => this.is_color_sensor_detected(sprite, script),
            },
            roe_is_both_color_sensor_detected: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_boolean_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.roe_sensor_color_red, '#FF0000'],
                            [Lang.Blocks.roe_sensor_color_orange, '#FF8800'],
                            [Lang.Blocks.roe_sensor_color_yellow, '#FFEE00'],
                            [Lang.Blocks.roe_sensor_color_yellow_green, '#88EE00'],
                            [Lang.Blocks.roe_sensor_color_green, '#00AA00'],
                            [Lang.Blocks.roe_sensor_color_sky_blue, '#00DDFF'],
                            [Lang.Blocks.roe_sensor_color_blue, '#0055FF'],
                            [Lang.Blocks.roe_sensor_color_purple, '#8800FF'],
                            [Lang.Blocks.roe_sensor_color_pink, '#FF55FF'],
                            [Lang.Blocks.roe_sensor_color_white, '#FFFFFF'],
                            [Lang.Blocks.roe_sensor_color_black, '#000000'],
                            [Lang.Blocks.roe_sensor_color_any, 'random'],
                        ],
                        value: 'random',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.roe_sensing_detected_between, 'detected'],
                            [Lang.Blocks.roe_sensing_not_detected_between, 'not-detected'],
                        ],
                        value: 'detected',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.roe_sensor_color_red, '#FF0000'],
                            [Lang.Blocks.roe_sensor_color_orange, '#FF8800'],
                            [Lang.Blocks.roe_sensor_color_yellow, '#FFEE00'],
                            [Lang.Blocks.roe_sensor_color_yellow_green, '#88EE00'],
                            [Lang.Blocks.roe_sensor_color_green, '#00AA00'],
                            [Lang.Blocks.roe_sensor_color_sky_blue, '#00DDFF'],
                            [Lang.Blocks.roe_sensor_color_blue, '#0055FF'],
                            [Lang.Blocks.roe_sensor_color_purple, '#8800FF'],
                            [Lang.Blocks.roe_sensor_color_pink, '#FF55FF'],
                            [Lang.Blocks.roe_sensor_color_white, '#FFFFFF'],
                            [Lang.Blocks.roe_sensor_color_black, '#000000'],
                            [Lang.Blocks.roe_sensor_color_any, 'random'],
                        ],
                        value: 'random',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.roe_check_detected, 'detected'],
                            [Lang.Blocks.roe_check_not_detected, 'not-detected'],
                        ],
                        value: 'detected',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                def: {
                    params: [
                        null,
                        null,
                        null,
                        null,
                    ],
                    type: 'roe_is_both_color_sensor_detected',
                },
                paramsKeyMap: {
                    COLOR_LEFT: 0,
                    MODE_LEFT: 1,
                    COLOR_RIGHT: 2,
                    MODE_RIGHT: 3,
                },
                class: 'sensing',
                isNotFor: ['roborobo_roe'],
                func: (sprite, script) => this.is_both_color_sensor_detected(sprite, script),
            },
        };
    }

    /**
     * @override
     */
    setZero () {
        this.stop_line_tracing();
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
    }

    /**
     * -----------------------------------block execute-----------------------------------
     * 공통 사용 함수를 제외한 나머지 블록 동작을 작성
     * -----------------------------------------------------------------------------------
     */

    set_both_step_motors (sprite, script) {
        const state = script.getStringValue('STATE');
        this._setBothStepMotors(script, state);
    }

    set_both_step_motors_by_distance (sprite, script) {
        const state = script.getStringValue('STATE');
        const distance = script.getNumberValue('DISTANCE');
        this._setBothStepMotors(script, state, distance);
    }

    _setBothStepMotors (script, state, distance = null) {
        let stateNum = [0, 0];
        switch (state) {
            case 'forward':
                stateNum = [2, 1];
                break;
            case 'turn-left':
                stateNum = [1, 1];
                break;
            case 'backward':
                stateNum = [1, 2];
                break;
            case 'turn-right':
                stateNum = [2, 2];
                break;
        }

        for (let i = 0; i < 2; i++) {
            this.request('setStepMotor', i + 1, {motor: i + 1, distance: distance, state: stateNum[i]});
        }
        return script.callReturn();
    }

    set_step_motor_by_distance (sprite, script) {
        const position = script.getStringValue('POSITION');
        const state = script.getStringValue('STATE');
        const distance = script.getNumberValue('DISTANCE');
        this._setStepMotor(script, position, state, distance);
    }

    _setStepMotor (script, position, state, distance = null) {
        let stateNum = 0;
        if (state == 'cw') stateNum = 1;
        else if (state == 'ccw') stateNum = 2;

        let motorNum = 1;
        if (position == 'left') motorNum = 1;
        else if (position == 'right') motorNum = 2;

        this.request('setStepMotor', motorNum, {motor: motorNum, distance: distance, state: stateNum});
        return script.callReturn();
    }

    set_line_tracing_mode (sprite, script) {
        if (this.state.isLineTracerRunning) {
            if (script.executeState) {
                if (!script.executeState.isStart) {
                    script.executeState.isStart = true;
                }
                return script;
            } else {
                return script.callReturn();
            }
        } else {
            if (script.executeState) {
                if (script.executeState.isStart) {
                    return script.callReturn();
                } else {
                    return script;
                }
            } else {
                script.executeState = {startTime: Date.now(), isStart: false};
                this.request('setLineTracingMode', null, {mode: script.getStringValue('OPTION')}, true);
                return script;
            }
        }
    }

    stop_line_tracing (sprite, script) {
        if (!script) {
            this.request('stopLineTracing', null, null, true);
            return;
        }

        if (this.state.isLineTracerRunning) {
            if (!script.executeState) {
                script.executeState = {startTime: Date.now()};
                this.request('stopLineTracing', null, null, true);
            }
            return script;
        } else {
            return script.callReturn();
        }
    }

    set_rgbled_color (sprite, script) {
        let color = script.getStringValue('COLOR');
        if (color === 'random') {
            const colors = ['#FF0000', '#FF8800', '#FFEE00', '#88EE00', '#00AA00', '#00DDFF', '#0055FF', '#8800FF', '#FF55FF', '#FFFFFF'];
            const num = Math.floor(Math.random() * colors.length);
            color = colors[num];
        }

        color = Cast.toRgbColorObject(this._toRoEColor(color));
        this.request('setRgbLedColor', null, {color});
        return script.callReturn();
    }

    set_rgbled_off (sprite, script) {
        const color = Cast.toRgbColorObject('#000000');
        this.request('setRgbLedColor', null, {color});
        return script.callReturn();
    }

    play_piezobuzzer (sprite, script) {
        const octave = script.getNumberValue('OCTAVE');
        const duration = script.getNumberValue('DURATION');
        let note = script.getNumberValue('NOTE');
        note = (octave - 1) * 12 + note;

        this.request('setPiezoBuzzer', null, {note, duration});
        return script.callReturn();
    }

    play_piezobuzzer_until_done (sprite, script) {
        if (script.executeState) {
            const duration = (script.getNumberValue('DURATION') * 1000);
            if (Date.now() - script.executeState.startTime > duration) {
                return script.callReturn();
            } else {
                return script;
            }
        } else {
            script.executeState = {startTime: Date.now()};
            this.play_piezobuzzer(sprite, script);
            return script;
        }
    }

    get_sensor_value (sprite, script) {
        const sensor = script.getStringValue('SENSOR');
        let isDetected = false;

        if (sensor === 'infrared') {
            isDetected = this.state.rx.infrared;
        } else if (sensor === 'touch') {
            isDetected = this.state.rx.touch;
        }
        return isDetected ? 1 : 0;
    }

    get_color_sensor_value (sprite, script) {
        const position = script.getStringValue('POSITION');
        if (position === 'left') {
            return this._toRoEColorString(this.state.rx.colorSensor.left);
        } else if (position === 'right') {
            return this._toRoEColorString(this.state.rx.colorSensor.right);
        }
    }

    is_sensor_detected (sprite, script) {
        const sensor = script.getStringValue('SENSOR');
        let isDetected = false;
        if (sensor === 'infrared') {
            isDetected = this.state.rx.infrared;
        } else if (sensor === 'touch') {
            isDetected = this.state.rx.touch;
        } else return false;

        const mode = (script.getStringValue('MODE') === 'detected');
        return (mode && isDetected) || (!mode && !isDetected);
    }

    is_color_sensor_detected (sprite, script) {
        const color = script.getStringValue('COLOR');
        const mode = (script.getStringValue('MODE') === 'detected');

        const position = script.getStringValue('POSITION');
        if (position === 'left') {
            return this._isColorSensorDetected(true, color, mode);
        } else if (position === 'right') {
            return this._isColorSensorDetected(false, color, mode);
        } else {
            return this._isColorSensorDetected(true, color, mode) && this._isColorSensorDetected(false, color, mode);
        }
    }

    is_both_color_sensor_detected (sprite, script) {
        const leftColor = script.getStringValue('COLOR_LEFT');
        const leftMode = (script.getStringValue('MODE_LEFT') === 'detected');

        const rightColor = script.getStringValue('COLOR_RIGHT');
        const rightMode = (script.getStringValue('MODE_RIGHT') === 'detected');

        return this._isColorSensorDetected(device, true, leftColor, leftMode) && this._isColorSensorDetected(device, false, rightColor, rightMode);
    }

    _isColorSensorDetected (isLeft, color, mode = true) {
        const result = isLeft ? this.state.rx.colorSensor.left : this.state.rx.colorSensor.right;
        const targetProtocol = this._toRoEColorProtocol(color);

        let isDetected = false;
        if (color === 'random') {
            isDetected = result != targetProtocol;
        } else {
            isDetected = result == targetProtocol;
        }
        return (mode && isDetected) || (!mode && !isDetected);
    }

    _toRoEColor (color) {
        switch (color) {
            case '#FF0000': return '#FF0000';
            case '#FF8800': return '#FF7F00';
            case '#FFEE00': return '#80FF00';
            case '#88EE00': return '#10D000';
            case '#00AA00': return '#00FF00';
            case '#00DDFF': return '#00D8FF';
            case '#0055FF': return '#0000FF';
            case '#8800FF': return '#DF00FF';
            case '#FF55FF': return '#FF3399';
            case '#FFFFFF': return '#7FFF7F';
            default: return '#000000';
        }
    }

    _toRoEColorString (protocol) {
        switch (protocol) {
            case 1: return Lang.Blocks.roe_sensor_color_red;
            case 2: return Lang.Blocks.roe_sensor_color_orange;
            case 3: return Lang.Blocks.roe_sensor_color_yellow;
            case 7: return Lang.Blocks.roe_sensor_color_yellow_green;
            case 4: return Lang.Blocks.roe_sensor_color_green;
            case 8: return Lang.Blocks.roe_sensor_color_sky_blue;
            case 5: return Lang.Blocks.roe_sensor_color_blue;
            case 6: return Lang.Blocks.roe_sensor_color_purple;
            case 9: return Lang.Blocks.roe_sensor_color_pink;
            case 10: return Lang.Blocks.roe_sensor_color_black;
            case 11: return Lang.Blocks.roe_sensor_color_white;
            default: return Lang.Blocks.roe_sensor_color_unknown;
        }
    }

    _toRoEColorProtocol (color) {
        switch (color) {
            case '#FF0000': return 1;
            case '#FF8800': return 2;
            case '#FFEE00': return 3;
            case '#88EE00': return 7;
            case '#00AA00': return 4;
            case '#00DDFF': return 8;
            case '#0055FF': return 5;
            case '#8800FF': return 6;
            case '#FF55FF': return 9;
            case '#000000': return 10;
            case '#FFFFFF': return 11;
            default: return 127;
        }
    }
}

module.exports = new RoE();
