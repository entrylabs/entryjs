'use strict';
const {ArduinoBase, Cast} = require('./block_roborobo_base.js');

class Cube extends ArduinoBase {
    constructor () {
        super();

        this.id = '10.4';
        this.name = 'roborobo_cube';
        this.url = 'http://www.roborobo.co.kr';
        this.imageName = 'roborobo_cube.png';
        this.title = {
            ko: '큐브',
            en: 'Cube',
        };
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
                sensor_gesture: {name: Lang.Blocks.cube_sensor_gesture, type: 'input', pos: {x: 0, y: 0, }},
                sensor_proximity: {name: Lang.Blocks.cube_sensor_proximity, type: 'input', pos: {x: 0, y: 0, }},
            },
            // 모니터 화면 지정 위치와 선으로 연결하여 표시하는 값
            ports: {},
            mode: 'both',
        };
    }

    getBlockMenuBlocks () {
        return [
            'cube_menu_digital_value',
            'cube_menu_dotmatrix_row',
            'cube_menu_proximity_level',

            'cube_set_dot_state_of_dotmatrix',
            'cube_set_dotmatrix_row',
            //'cube_set_dotmatrix',
            'cube_clear_dotmatrix',
            'cube_play_piezobuzzer',
            'cube_play_piezobuzzer_until_done',
            'cube_set_sensor_mode',
            'cube_get_sensor_value',
            'cube_is_direction_detected_on_gesture_sensor',
            'cube_is_proximity_sensor_detected',
            'cube_compare_proximity_sensor_level',
            'cube_is_tilted_in_direction',
            'cube_is_shaken',
            'cube_is_color_button_pressed',
        ];
    }

    setLanguage () {
        return {
            ko: {
                template: {
                    cube_menu_digital_value: '%1',
                    cube_menu_dotmatrix_row: '%1',
                    cube_menu_proximity_level: '%1',

                    cube_set_dot_state_of_dotmatrix: '도트 매트릭스 x: %1 y: %2 좌표를 %3 (으)로 정하기 %4',
                    cube_set_dotmatrix_row: '도트 매트릭스 y: %1 행에 %2 %3 %4 %5 %6 %7 %8 그리기 %9',
                    //cube_set_dotmatrix: '도트 매트릭스에 %1 그리기 %2',
                    cube_clear_dotmatrix: '도트 매트릭스 모두 지우기 %1',
                    cube_play_piezobuzzer: '스피커로 %1 옥타브 %2 음을 %3 초 소리내기 %4',
                    cube_play_piezobuzzer_until_done: '스피커로 %1 옥타브 %2 음을 %3 초 소리내며 기다리기 %4',
                    cube_set_sensor_mode: '센서 동작을 %1 (으)로 정하기 %2',
                    cube_get_sensor_value: '%1 값',
                    cube_is_direction_detected_on_gesture_sensor: '제스처 센서에 내 %1 방향 움직임이 %2 ?',
                    cube_is_proximity_sensor_detected: '근접 센서가 %1 ?',
                    cube_compare_proximity_sensor_level: '근접 센서 값 %1 %2',
                    cube_is_tilted_in_direction: '큐브가 내 %1 방향으로 기울었는가?',
                    cube_is_shaken: '큐브를 흔들었는가?',
                    cube_is_color_button_pressed: '%1 색 버튼을 %2 ?',
                },
                Blocks: {
                    cube_menu_digital_value_on: '켜기 (1)',
                    cube_menu_digital_value_off: '끄기 (0)',

                    cube_piezobuzzer_tone_c: '도',
                    cube_piezobuzzer_tone_c_sharp: '도♯(레♭)',
                    cube_piezobuzzer_tone_d: '레',
                    cube_piezobuzzer_tone_d_sharp: '레♯(미♭)',
                    cube_piezobuzzer_tone_e: '미',
                    cube_piezobuzzer_tone_f: '파',
                    cube_piezobuzzer_tone_f_sharp: '파♯(솔♭)',
                    cube_piezobuzzer_tone_g: '솔',
                    cube_piezobuzzer_tone_g_sharp: '솔♯(라♭)',
                    cube_piezobuzzer_tone_a: '라',
                    cube_piezobuzzer_tone_a_sharp: '라♯(시♭)',
                    cube_piezobuzzer_tone_b: '시',

                    cube_sensor_gesture: '제스처 센서',
                    cube_sensor_proximity: '근접 센서',
                    cube_sensor_unused: '사용하지 않기',

                    cube_sensor_gesture_direction_up: '위쪽',
                    cube_sensor_gesture_direction_right: '오른쪽',
                    cube_sensor_gesture_direction_down: '아래쪽',
                    cube_sensor_gesture_direction_left: '왼쪽',

                    cube_sensor_tilted_direction_forward: '앞쪽',
                    cube_sensor_tilted_direction_right: '오른쪽',
                    cube_sensor_tilted_direction_backward: '뒤쪽',
                    cube_sensor_tilted_direction_left: '왼쪽',

                    cube_check_detected: '감지되었는가',
                    cube_check_not_detected: '감지되지 않았는가',
                    cube_check_pressed: '눌렀는가',
                    cube_check_not_pressed: '누르지 않았는가',

                    cube_sensor_color_red: '빨간색',
                    cube_sensor_color_yellow: '노란색',
                    cube_sensor_color_green: '초록색',
                    cube_sensor_color_blue: '파란색',
                },
            },
            en: {
                template: {
                    cube_menu_digital_value: '%1',
                    cube_menu_dotmatrix_row: '%1',
                    cube_menu_proximity_level: '%1',

                    cube_set_dot_state_of_dotmatrix: 'set dot matrix X: %1  Y: %2  to %3 %4',
                    cube_set_dotmatrix_row: 'draw %2 %3 %4 %5 %6 %7 %8 on dot matrix y:%1 column %9',
                    //cube_set_dotmatrix: 'draw %1 on dotmatrix %2',
                    cube_clear_dotmatrix: 'clear all dot matrix %1',
                    cube_play_piezobuzzer: 'play %1 otave %2 note for %3 seconds through the speaker %4',
                    cube_play_piezobuzzer_until_done: 'wait with speaker to play %1 otave %2 note for %3 seconds %4',
                    cube_set_sensor_mode: 'set sensor action to %1 %2',
                    cube_get_sensor_value: '%1 value',
                    cube_is_direction_detected_on_gesture_sensor: '%1 direction movement is %2 on the gesture sensor?',
                    cube_is_proximity_sensor_detected: 'is proximity sensor %1 ?',
                    cube_compare_proximity_sensor_level: 'proximity sensor value %1 %2',
                    cube_is_tilted_in_direction: 'is the cube tilted on my %1 ?',
                    cube_is_shaken: 'did the cube shaken?',
                    cube_is_color_button_pressed: '%1 color button %2 ?',
                },
                Blocks: {
                    cube_menu_digital_value_on: 'on (1)',
                    cube_menu_digital_value_off: 'off (0)',

                    cube_piezobuzzer_tone_c: 'C',
                    cube_piezobuzzer_tone_c_sharp: 'C♯(D♭)',
                    cube_piezobuzzer_tone_d: 'D',
                    cube_piezobuzzer_tone_d_sharp: 'D♯(E♭)',
                    cube_piezobuzzer_tone_e: 'E',
                    cube_piezobuzzer_tone_f: 'F',
                    cube_piezobuzzer_tone_f_sharp: 'F♯(G♭)',
                    cube_piezobuzzer_tone_g: 'G',
                    cube_piezobuzzer_tone_g_sharp: 'G♯(A♭)',
                    cube_piezobuzzer_tone_a: 'A',
                    cube_piezobuzzer_tone_a_sharp: 'A♯(B♭)',
                    cube_piezobuzzer_tone_b: 'B',

                    cube_sensor_gesture: 'gesture sensor',
                    cube_sensor_proximity: 'proximity sensor',
                    cube_sensor_unused: 'unuse',

                    cube_sensor_gesture_direction_up: 'up',
                    cube_sensor_gesture_direction_right: 'right',
                    cube_sensor_gesture_direction_down: 'down',
                    cube_sensor_gesture_direction_left: 'left',

                    cube_sensor_tilted_direction_forward: 'forward',
                    cube_sensor_tilted_direction_right: 'right',
                    cube_sensor_tilted_direction_backward: 'backward',
                    cube_sensor_tilted_direction_left: 'left',

                    cube_check_detected: 'detected',
                    cube_check_not_detected: 'not detected',
                    cube_check_pressed: 'pressed',
                    cube_check_not_pressed: 'not pressed',

                    cube_sensor_color_red: 'red',
                    cube_sensor_color_yellow: 'yellow',
                    cube_sensor_color_green: 'green',
                    cube_sensor_color_blue: 'blue',
                },
            },
        };
    };

    getBlocks () {
        return {
            cube_menu_digital_value: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.cube_menu_digital_value_on, '1'],
                            [Lang.Blocks.cube_menu_digital_value_off, '0'],

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
                func: (sprite, script) => {
                    return script.getStringValue('VALUE');
                },
            },
            cube_menu_dotmatrix_row: {
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
                            ['2', '2'],
                            ['3', '3'],
                            ['4', '4'],
                            ['5', '5'],
                            ['6', '6'],
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
                    Y: 0,
                },
                func: (sprite, script) => {
                    return script.getStringField('Y');
                },
            },
            cube_menu_proximity_level: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_string_field',
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
                    LEVEL: 0,
                },
                func: (sprite, script) => {
                    return script.getStringValue('LEVEL');
                },
            },
            cube_set_dot_state_of_dotmatrix: {
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
                        type: 'Block',
                        accept: 'string',
                        defualtType: 'number',
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
                            type: 'number',
                            params: ['0'],
                        },
                        {
                            type: 'number',
                            params: ['0'],
                        },
                        {
                            type: 'cube_menu_digital_value',
                        },
                        null,
                    ],
                    type: 'cube_set_dot_state_of_dotmatrix',
                },
                paramsKeyMap: {
                    X: 0,
                    Y: 1,
                    STATE: 2,
                },
                class: 'looks_dot_matrix',
                isNotFor: ['roborobo_cube'],
                func: (sprite, script) => this.set_dot_state_of_dotmatrix(sprite, script)
            },
            cube_set_dotmatrix_row: {
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
                        type: 'Block',
                        accept: 'string',
                        defualtType: 'number',
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defualtType: 'number',
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defualtType: 'number',
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defualtType: 'number',
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defualtType: 'number',
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                        defualtType: 'number',
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
                            type: 'cube_menu_dotmatrix_row'
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
                        null,

                    ],
                    type: 'cube_set_dotmatrix_row',
                },
                paramsKeyMap: {
                    Y: 0,
                    X0: 1, X1: 2, X2: 3, X3: 4, X4: 5, X5: 6, X6: 7,
                },
                class: 'looks_dot_matrix',
                isNotFor: ['roborobo_cube'],
                func: (sprite, script) => this.set_dotmatrix_row(sprite, script)
            },
            //cube_set_dotmatrix: {
            //    color: EntryStatic.colorSet.block.default.HARDWARE,
            //    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            //    skeleton: 'basic',
            //    statements: [],
            //    params: [
            //        {
            //            type: 'Dropdown',
            //            options: [],
            //            value: '',
            //            fontSize: 11,
            //            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
            //            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
            //        },
            //        {
            //            type: 'Indicator',
            //            img: 'block_icon/hardware_icon.svg',
            //            size: 12,
            //        },
            //    ],
            //    events: {},
            //    def: {
            //        params: [
            //            null,
            //            null,
            //        ],
            //        type: 'cube_set_dotmatrix',
            //    },
            //    paramsKeyMap: {
            //        MATRIX: 0
            //    },
            //    class: 'looks_dot_matrix',
            //    isNotFor: ['roborobo_cube'],
            //    func: (sprite, script) => this.set_dotmatrix(sprite, script)
            //},
            cube_clear_dotmatrix: {
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
                    type: 'cube_clear_dotmatrix',
                },
                paramsKeyMap: {},
                class: 'looks_dot_matrix',
                isNotFor: ['roborobo_cube'],
                func: (sprite, script) => this.clear_dotmatrix(sprite, script)
            },
            cube_play_piezobuzzer: {
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
                            [Lang.Blocks.cube_piezobuzzer_tone_c, '0'],
                            [Lang.Blocks.cube_piezobuzzer_tone_c_sharp, '1'],
                            [Lang.Blocks.cube_piezobuzzer_tone_d, '2'],
                            [Lang.Blocks.cube_piezobuzzer_tone_d_sharp, '3'],
                            [Lang.Blocks.cube_piezobuzzer_tone_e, '4'],
                            [Lang.Blocks.cube_piezobuzzer_tone_f, '5'],
                            [Lang.Blocks.cube_piezobuzzer_tone_f_sharp, '6'],
                            [Lang.Blocks.cube_piezobuzzer_tone_g, '7'],
                            [Lang.Blocks.cube_piezobuzzer_tone_g_sharp, '8'],
                            [Lang.Blocks.cube_piezobuzzer_tone_a, '9'],
                            [Lang.Blocks.cube_piezobuzzer_tone_a_sharp, '10'],
                            [Lang.Blocks.cube_piezobuzzer_tone_b, '11'],
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
                    type: 'cube_play_piezobuzzer',
                },
                paramsKeyMap: {
                    OCTAVE: 0,
                    NOTE: 1,
                    DURATION: 2,
                },
                class: 'sound',
                isNotFor: ['roborobo_cube'],
                func: (sprite, script) => this.play_piezobuzzer(sprite, script)
            },
            cube_play_piezobuzzer_until_done: {
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
                            [Lang.Blocks.cube_piezobuzzer_tone_c, '0'],
                            [Lang.Blocks.cube_piezobuzzer_tone_c_sharp, '1'],
                            [Lang.Blocks.cube_piezobuzzer_tone_d, '2'],
                            [Lang.Blocks.cube_piezobuzzer_tone_d_sharp, '3'],
                            [Lang.Blocks.cube_piezobuzzer_tone_e, '4'],
                            [Lang.Blocks.cube_piezobuzzer_tone_f, '5'],
                            [Lang.Blocks.cube_piezobuzzer_tone_f_sharp, '6'],
                            [Lang.Blocks.cube_piezobuzzer_tone_g, '7'],
                            [Lang.Blocks.cube_piezobuzzer_tone_g_sharp, '8'],
                            [Lang.Blocks.cube_piezobuzzer_tone_a, '9'],
                            [Lang.Blocks.cube_piezobuzzer_tone_a_sharp, '10'],
                            [Lang.Blocks.cube_piezobuzzer_tone_b, '11'],
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
                    type: 'cube_play_piezobuzzer_until_done',
                },
                paramsKeyMap: {
                    OCTAVE: 0,
                    NOTE: 1,
                    DURATION: 2,
                },
                class: 'sound',
                isNotFor: ['roborobo_cube'],
                func: (sprite, script) => this.play_piezobuzzer_until_done(sprite, script)
            },
            cube_set_sensor_mode: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.cube_sensor_gesture, 'gesture'],
                            [Lang.Blocks.cube_sensor_proximity, 'proximity'],
                            [Lang.Blocks.cube_sensor_unused, 'unused'],
                        ],
                        value: 'gesture',
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
                    type: 'cube_set_sensor_mode',
                },
                paramsKeyMap: {
                    OPTION: 0,
                },
                class: 'sensing',
                isNotFor: ['roborobo_cube'],
                func: (sprite, script) => this.set_sensor_mode(sprite, script),
            },
            cube_get_sensor_value: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.cube_sensor_gesture, 'gesture'],
                            [Lang.Blocks.cube_sensor_proximity, 'proximity'],
                        ],
                        value: 'gesture',
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
                    type: 'cube_get_sensor_value',
                },
                paramsKeyMap: {
                    SENSOR: 0,
                },
                class: 'sensing',
                isNotFor: ['roborobo_cube'],
                func: (sprite, script) => this.get_sensor_value(sprite, script),
            },
            cube_is_direction_detected_on_gesture_sensor: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_boolean_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.cube_sensor_gesture_direction_up, 'up'],
                            [Lang.Blocks.cube_sensor_gesture_direction_right, 'right'],
                            [Lang.Blocks.cube_sensor_gesture_direction_down, 'down'],
                            [Lang.Blocks.cube_sensor_gesture_direction_left, 'left'],
                        ],
                        value: 'up',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.cube_check_detected, 'detected'],
                            [Lang.Blocks.cube_check_not_detected, 'not-detected'],
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
                    type: 'cube_is_direction_detected_on_gesture_sensor',
                },
                paramsKeyMap: {
                    DIRECTION: 0,
                    MODE: 1,
                },
                class: 'sensing',
                isNotFor: ['roborobo_cube'],
                func: (sprite, script) => this.is_direction_detected_on_gesture_sensor(sprite, script)
            },
            cube_is_proximity_sensor_detected: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_boolean_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.cube_check_detected, 'detected'],
                            [Lang.Blocks.cube_check_not_detected, 'not-detected'],
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
                    ],
                    type: 'cube_is_proximity_sensor_detected',
                },
                paramsKeyMap: {
                    MODE: 0,
                },
                class: 'sensing',
                isNotFor: ['roborobo_cube'],
                func: (sprite, script) => this.is_proximity_sensor_detected(sprite, script)
            },
            cube_compare_proximity_sensor_level: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_boolean_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            ['＞', 'greater-than'],
                            ['＝', 'equal'],
                            ['＜', 'less-than'],
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
                        null,
                        {
                            type: 'cube_menu_proximity_level',
                        },
                    ],
                    type: 'cube_compare_proximity_sensor_level',
                },
                paramsKeyMap: {
                    SYMBOL: 0,
                    LEVEL: 1,
                },
                class: 'sensing',
                isNotFor: ['roborobo_cube'],
                func: (sprite, script) => this.compare_proximity_sensor_level(sprite, script),
            },
            cube_is_tilted_in_direction: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_boolean_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.cube_sensor_tilted_direction_forward, 'forward'],
                            [Lang.Blocks.cube_sensor_tilted_direction_right, 'right'],
                            [Lang.Blocks.cube_sensor_tilted_direction_backward, 'backward'],
                            [Lang.Blocks.cube_sensor_tilted_direction_left, 'left'],
                        ],
                        value: 'forward',
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
                    type: 'cube_is_tilted_in_direction',
                },
                paramsKeyMap: {
                    DIRECTION: 0,
                },
                class: 'sensing',
                isNotFor: ['roborobo_cube'],
                func: (sprite, script) => this.is_tilted_in_direction(sprite, script),
            },
            cube_is_shaken: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_boolean_field',
                statements: [],
                params: [],
                events: {},
                def: {
                    params: [],
                    type: 'cube_is_shaken',
                },
                paramsKeyMap: {},
                class: 'sensing',
                isNotFor: ['roborobo_cube'],
                func: (sprite, script) => this.is_shaken(sprite, script),
            },


            cube_is_color_button_pressed: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_boolean_field',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.cube_sensor_color_red, '#FF0000'],
                            [Lang.Blocks.cube_sensor_color_yellow, '#FFEE00'],
                            [Lang.Blocks.cube_sensor_color_green, '#00AA00'],
                            [Lang.Blocks.cube_sensor_color_blue, '#0055FF'],
                        ],
                        value: '#FF0000',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.cube_check_pressed, 'detected'],
                            [Lang.Blocks.cube_check_not_pressed, 'not-detected'],
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
                    type: 'cube_is_color_button_pressed',
                },
                paramsKeyMap: {
                    COLOR: 0,
                    MODE: 1,
                },
                class: 'sensing',
                isNotFor: ['roborobo_cube'],
                func: (sprite, script) => this.is_color_button_pressed(sprite, script),
            },
        };
    }

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
    }

    /**
     * -----------------------------------block execute-----------------------------------
     * 공통 사용 함수를 제외한 나머지 블록 동작을 작성
     * -----------------------------------------------------------------------------------
     */

    set_dot_state_of_dotmatrix (sprite, script) {
        const x = script.getNumberValue('X');
        const y = script.getNumberValue('Y');
        const state = script.getNumberValue('STATE');
        if (x < 0 || x > 14 || y < 0 || y > 6) return script.callReturn();

        this.request('setDotMatrix', null, {type: 'dot', x, y, dot: Math.min(1, Math.max(0, state)).toString()}, true);
        return script.callReturn();
    }

    set_dotmatrix_row (sprite, script) {
        const y = script.getNumberValue('Y');
        if (y < 0 || y > 6) return script.callReturn();

        let dots = '';
        for (let i = 0; i < 7; i++) {
            const value = script.getNumberValue('X' + i);
            dots += Math.max(0, Math.min(1, value)).toString();
        }

        this.request('setDotMatrix', null, {type: 'row', y, dots}, true);
        return script.callReturn();
    }

    set_dotmatrix (sprite, script) {
        const example = script.getStringValue('MATRIX');
        this.request('setDotMatrix', null, {type: 'all', dots: example}, true);
        return script.callReturn();
    }

    clear_dotmatrix (sprite, script) {
        const length = 7 * 7;
        let dots = '';
        for (let i = 0; i < length; i++) {dots += 0;}

        this.request('setDotMatrix', null, {type: 'all', dots});
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

    set_sensor_mode (sprite, script) {
        let optionNum = 0;
        const option = script.getStringValue('OPTION');
        if (option === 'gesture') {
            optionNum = 3;
        } else if (option === 'proximity') {
            optionNum = 2;
        }
        this.request('setSensorMode', null, {option: optionNum});
        return script.callReturn();
    }

    get_sensor_value (sprite, script) {
        const sensor = script.getStringValue('SENSOR');
        if (sensor === 'gesture') {
            switch (this.state.rx.gesture) {
                case 1: return 'RIGHT';
                case 2: return 'DOWN';
                case 4: return 'LEFT';
                case 8: return 'UP';
                default: return 'NONE';
            }
        } else if (sensor === 'proximity') {
            let value = this._getProximitySensorValue();
            if (value == 6) {
                value = 'NONE';
            }
            return value;
        }
        return 0;
    }

    is_direction_detected_on_gesture_sensor (sprite, script) {
        const direction = script.getStringValue('DIRECTION');
        const mode = (script.getStringValue('MODE') === 'detected');
        switch (this.state.rx.gesture) {
            case 1: return (direction == 'right' && mode) || (direction != 'right' && !mode);
            case 2: return (direction == 'down' && mode) || (direction != 'down' && !mode);
            case 4: return (direction == 'left' && mode) || (direction != 'left' && !mode);
            case 8: return (direction == 'up' && mode) || (direction != 'up' && !mode);
            default: return (!mode);
        }
    }

    is_proximity_sensor_detected (sprite, script) {
        return this._getProximitySensorValue() < 6;
    }

    compare_proximity_sensor_level (sprite, script) {
        const value1 = this._getProximitySensorValue();
        if (value1 == 6) return false;

        const value2 = script.getNumberValue('LEVEL');
        const symbol = script.getStringValue('SYMBOL');
        switch (symbol) {
            case 'greater-than':
                return value1 > value2;
            case 'equal':
                return value1 == value2;
            case 'less-than':
                return value1 < value2;
        }
        return false;
    }

    _getProximitySensorValue () {
        const value = this.state.rx.proximity;
        let result = 0; // not detected
        if (value >= 255) {
            result = 0;
        } else if (value >= 115) {
            result = 1;
        } else if (value >= 50) {
            result = 2;
        } else if (value >= 30) {
            result = 3;
        } else if (value >= 15) {
            result = 4;
        } else if (value >= 8) {
            result = 5;
        } else {
            result = 6;
        }
        return result;
    }

    is_tilted_in_direction (sprite, script) {
        const reference = 35;
        switch (script.getStringValue('DIRECTION')) {
            case 'forward': return this.state.rx.gyro.angle.y >= reference;
            case 'right': return this.state.rx.gyro.angle.x >= reference;
            case 'backward': return this.state.rx.gyro.angle.y <= -reference;
            case 'left': return this.state.rx.gyro.angle.x <= -reference;
            default: return false;
        }
    }

    is_shaken (sprite, script) {
        return this.state.rx.gyro.shake == 1;
    }

    is_color_button_pressed (sprite, script) {
        let isPressed = false;
        switch (script.getStringValue('COLOR')) {
            case '#FF0000': {
                isPressed = this.state.rx.buttons.r;
            } break;
            case '#00AA00': {
                isPressed = this.state.rx.buttons.g;
            } break;
            case '#0055FF': {
                isPressed = this.state.rx.buttons.b;
            } break;
            case '#FFEE00': {
                isPressed = this.state.rx.buttons.y;
            } break;
        }
        const mode = (script.getStringValue('MODE') === 'detected');
        return (mode && isPressed) || (!mode && !isPressed);
    }
}

module.exports = new Cube();
