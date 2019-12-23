'use strict';

Entry.Hamster = {
    setZero() {
        Entry.Robomation.setZero();
    },
    afterReceive(pd) {
        Entry.Robomation.afterReceive(pd, false);
    },
    getRobot() {
        const robot = Entry.Robomation.getRobot('hamster', 0);
        if (robot) {
            robot.setMotoring(Entry.hw.sendQueue);
        }
        return robot;
    },
    id: '2.4',
    name: 'hamster',
    url: 'http://www.robomation.net',
    imageName: 'hamster.png',
    title: {
        ko: '햄스터',
        en: 'Hamster',
        jp: 'ハムスター',
        vn: 'Hamster',
    },
    monitorTemplate: {
        imgPath: 'hw/hamster.png',
        width: 256,
        height: 256,
        listPorts: {
            temperature: {
                name: Lang.Blocks.HAMSTER_sensor_temperature,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            inputA: {
                name: Lang.Blocks.HAMSTER_sensor_input_a,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            inputB: {
                name: Lang.Blocks.HAMSTER_sensor_input_b,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            accelerationX: {
                name: Lang.Blocks.HAMSTER_sensor_acceleration_x,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            accelerationY: {
                name: Lang.Blocks.HAMSTER_sensor_acceleration_y,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            accelerationZ: {
                name: Lang.Blocks.HAMSTER_sensor_acceleration_z,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            buzzer: {
                name: Lang.Hw.buzzer,
                type: 'output',
                pos: { x: 0, y: 0 },
            },
            note: { name: Lang.Hw.note, type: 'output', pos: { x: 0, y: 0 } },
            outputA: {
                name: `${Lang.Hw.output}A`,
                type: 'output',
                pos: { x: 0, y: 0 },
            },
            outputB: {
                name: `${Lang.Hw.output}B`,
                type: 'output',
                pos: { x: 0, y: 0 },
            },
        },
        ports: {
            leftProximity: {
                name: Lang.Blocks.HAMSTER_sensor_left_proximity,
                type: 'input',
                pos: { x: 122, y: 156 },
            },
            rightProximity: {
                name: Lang.Blocks.HAMSTER_sensor_right_proximity,
                type: 'input',
                pos: { x: 10, y: 108 },
            },
            leftFloor: {
                name: Lang.Blocks.HAMSTER_sensor_left_floor,
                type: 'input',
                pos: { x: 100, y: 234 },
            },
            rightFloor: {
                name: Lang.Blocks.HAMSTER_sensor_right_floor,
                type: 'input',
                pos: { x: 13, y: 180 },
            },
            light: {
                name: Lang.Blocks.HAMSTER_sensor_light,
                type: 'input',
                pos: { x: 56, y: 189 },
            },
            leftWheel: {
                name: Lang.Hw.leftWheel,
                type: 'output',
                pos: { x: 209, y: 115 },
            },
            rightWheel: {
                name: Lang.Hw.rightWheel,
                type: 'output',
                pos: { x: 98, y: 30 },
            },
            leftLed: {
                name: `${Lang.Hw.left} ${Lang.Hw.led_en}`,
                type: 'output',
                pos: { x: 87, y: 210 },
            },
            rightLed: {
                name: `${Lang.Hw.right} ${Lang.Hw.led_en}`,
                type: 'output',
                pos: { x: 24, y: 168 },
            },
        },
        mode: 'both',
    },
};

Entry.Hamster.setLanguage = () => ({
    ko: {
        template: {
            hamster_gripper: '집게 %1 %2',
            hamster_release_gripper: '집게 끄기 %1',
            hamster_boolean: '%1?',
            hamster_play_note: '%1 %2 음을 연주하기 %3',
        },
        Helper: {
            hamster_gripper: '집게를 열거나 닫습니다.',
            hamster_release_gripper: '집게의 전원을 끄고 자유롭게 움직일 수 있도록 합니다.',
            hamster_boolean:
                "앞으로 기울임: 앞으로 기울이면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>뒤로 기울임: 뒤로 기울이면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>왼쪽으로 기울임: 왼쪽으로 기울이면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>오른쪽으로 기울임: 오른쪽으로 기울이면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>거꾸로 뒤집음: 거꾸로 뒤집으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>기울이지 않음: 기울이지 않으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>배터리 정상: 배터리 잔량이 충분하면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>배터리 부족: 배터리 잔량이 부족하면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>배터리 없음: 배터리 잔량이 없으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.",
            hamster_play_note: '선택한 계이름과 옥타브의 음을 소리 냅니다.',
        },
        Blocks: {
            hamster_note_c: '도',
            hamster_note_c_sharp: '도♯(레♭)',
            hamster_note_d: '레',
            hamster_note_d_sharp: '레♯(미♭)',
            hamster_note_e: '미',
            hamster_note_f: '파',
            hamster_note_f_sharp: '파♯(솔♭)',
            hamster_note_g: '솔',
            hamster_note_g_sharp: '솔♯(라♭)',
            hamster_note_a: '라',
            hamster_note_a_sharp: '라♯(시♭)',
            hamster_note_b: '시',
            hamster_tilt_forward: '앞으로 기울임',
            hamster_tilt_backward: '뒤로 기울임',
            hamster_tilt_left: '왼쪽으로 기울임',
            hamster_tilt_right: '오른쪽으로 기울임',
            hamster_tilt_flip: '거꾸로 뒤집음',
            hamster_tilt_not: '기울이지 않음',
            hamster_battery_normal: '배터리 정상',
            hamster_battery_low: '배터리 부족',
            hamster_battery_empty: '배터리 없음',
            hamster_open_gripper: '열기',
            hamster_close_gripper: '닫기',
        },
    },
    en: {
        template: {
            hamster_gripper: '%1 gripper %2',
            hamster_release_gripper: 'release gripper %1',
            hamster_boolean: '%1?',
            hamster_play_note: 'play note %1 %2 %3',
        },
        Helper: {
            hamster_gripper: 'Opens or closes the gripper.',
            hamster_release_gripper: 'Turns off the gripper so that it can be moved freely.',
            hamster_boolean:
                'tilt forward: If tilted forward, true, otherwise false<br/>tilt backward: If tilted backward, true, otherwise false<br/>tilt left: If tilted to the left, true, otherwise false<br/>tilt right: If tilted to the right, true, otherwise false<br/>tilt flip: If upside-down, true, otherwise false<br/>not tilt: If not tilted, true, otherwise false<br/>battery normal: If the battery is enough, true, otherwise false<br/>battery low: If the battery is low, true, otherwise false<br/>battery empty: If the battery is empty, true, otherwise false',
            hamster_play_note: 'It sounds the selected tone and octave.',
        },
        Blocks: {
            hamster_note_c: 'C',
            hamster_note_c_sharp: 'C♯(D♭)',
            hamster_note_d: 'D',
            hamster_note_d_sharp: 'D♯(E♭)',
            hamster_note_e: 'E',
            hamster_note_f: 'F',
            hamster_note_f_sharp: 'F♯(G♭)',
            hamster_note_g: 'G',
            hamster_note_g_sharp: 'G♯(A♭)',
            hamster_note_a: 'A',
            hamster_note_a_sharp: 'A♯(B♭)',
            hamster_note_b: 'B',
            hamster_tilt_forward: 'tilt forward',
            hamster_tilt_backward: 'tilt backward',
            hamster_tilt_left: 'tilt left',
            hamster_tilt_right: 'tilt right',
            hamster_tilt_flip: 'tilt flip',
            hamster_tilt_not: 'not tilt',
            hamster_battery_normal: 'battery normal',
            hamster_battery_low: 'battery low',
            hamster_battery_empty: 'battery empty',
            hamster_open_gripper: 'open',
            hamster_close_gripper: 'close',
        },
    },
    jp: {
        template: {
            hamster_gripper: 'グリッパを %1 %2',
            hamster_release_gripper: 'グリッパをオフ %1',
            hamster_boolean: '%1?',
            hamster_play_note: '%1 %2 を演奏する %3',
        },
        Helper: {
            hamster_gripper: 'Opens or closes the gripper.',
            hamster_release_gripper: 'Turns off the gripper so that it can be moved freely.',
            hamster_boolean:
                'tilt forward: If tilted forward, true, otherwise false<br/>tilt backward: If tilted backward, true, otherwise false<br/>tilt left: If tilted to the left, true, otherwise false<br/>tilt right: If tilted to the right, true, otherwise false<br/>tilt flip: If upside-down, true, otherwise false<br/>not tilt: If not tilted, true, otherwise false<br/>battery normal: If the battery is enough, true, otherwise false<br/>battery low: If the battery is low, true, otherwise false<br/>battery empty: If the battery is empty, true, otherwise false',
            hamster_play_note: '選択された音階（音名、オクターブ）が鳴ります。',
        },
        Blocks: {
            hamster_note_c: 'ド',
            hamster_note_c_sharp: 'ド♯(レ♭)',
            hamster_note_d: 'レ',
            hamster_note_d_sharp: 'レ♯(ミ♭)',
            hamster_note_e: 'ミ',
            hamster_note_f: 'ファ',
            hamster_note_f_sharp: 'ファ♯(ソ♭)',
            hamster_note_g: 'ソ',
            hamster_note_g_sharp: 'ソ♯(ラ♭)',
            hamster_note_a: 'ラ',
            hamster_note_a_sharp: 'ラ♯(シ♭)',
            hamster_note_b: 'シ',
            hamster_tilt_forward: '前に傾けたか',
            hamster_tilt_backward: '後に傾けたか',
            hamster_tilt_left: '左に傾けたか',
            hamster_tilt_right: '右に傾けたか',
            hamster_tilt_flip: '上下裏返したか',
            hamster_tilt_not: '傾けなかったか',
            hamster_battery_normal: '電池が正常か',
            hamster_battery_low: '電池が足りないか',
            hamster_battery_empty: '電池がないか',
            hamster_open_gripper: '開く',
            hamster_close_gripper: '閉める',
        },
    },
    vn: {
        template: {
            hamster_gripper: '%1 gripper %2',
            hamster_release_gripper: 'release gripper %1',
            hamster_boolean: '%1?',
            hamster_play_note: 'play note %1 %2 %3',
        },
        Helper: {
            hamster_gripper: 'Opens or closes the gripper.',
            hamster_release_gripper: 'Turns off the gripper so that it can be moved freely.',
            hamster_boolean:
                'tilt forward: If tilted forward, true, otherwise false<br/>tilt backward: If tilted backward, true, otherwise false<br/>tilt left: If tilted to the left, true, otherwise false<br/>tilt right: If tilted to the right, true, otherwise false<br/>tilt flip: If upside-down, true, otherwise false<br/>not tilt: If not tilted, true, otherwise false<br/>battery normal: If the battery is enough, true, otherwise false<br/>battery low: If the battery is low, true, otherwise false<br/>battery empty: If the battery is empty, true, otherwise false',
            hamster_play_note: 'It sounds the selected tone and octave.',
        },
        Blocks: {
            hamster_note_c: 'C',
            hamster_note_c_sharp: 'C♯(D♭)',
            hamster_note_d: 'D',
            hamster_note_d_sharp: 'D♯(E♭)',
            hamster_note_e: 'E',
            hamster_note_f: 'F',
            hamster_note_f_sharp: 'F♯(G♭)',
            hamster_note_g: 'G',
            hamster_note_g_sharp: 'G♯(A♭)',
            hamster_note_a: 'A',
            hamster_note_a_sharp: 'A♯(B♭)',
            hamster_note_b: 'B',
            hamster_tilt_forward: 'tilt forward',
            hamster_tilt_backward: 'tilt backward',
            hamster_tilt_left: 'tilt left',
            hamster_tilt_right: 'tilt right',
            hamster_tilt_flip: 'tilt flip',
            hamster_tilt_not: 'not tilt',
            hamster_battery_normal: 'battery normal',
            hamster_battery_low: 'battery low',
            hamster_battery_empty: 'battery empty',
            hamster_open_gripper: 'open',
            hamster_close_gripper: 'close',
        },
    },
});

Entry.Hamster.blockMenuBlocks = [
    'hamster_hand_found',
    'hamster_boolean',
    'hamster_value',
    'hamster_move_forward_once',
    'hamster_turn_once',
    'hamster_move_forward_for_secs',
    'hamster_move_backward_for_secs',
    'hamster_turn_for_secs',
    'hamster_change_both_wheels_by',
    'hamster_set_both_wheels_to',
    'hamster_change_wheel_by',
    'hamster_set_wheel_to',
    'hamster_follow_line_using',
    'hamster_follow_line_until',
    'hamster_set_following_speed_to',
    'hamster_stop',
    'hamster_set_led_to',
    'hamster_clear_led',
    'hamster_beep',
    'hamster_change_buzzer_by',
    'hamster_set_buzzer_to',
    'hamster_clear_buzzer',
    'hamster_play_note',
    'hamster_play_note_for',
    'hamster_rest_for',
    'hamster_change_tempo_by',
    'hamster_set_tempo_to',
    'hamster_set_port_to',
    'hamster_change_output_by',
    'hamster_set_output_to',
    'hamster_gripper',
    'hamster_release_gripper',
];

Entry.Hamster.getBlocks = function() {
    return {
        hamster_hand_found: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [],
                type: 'hamster_hand_found',
            },
            class: 'hamster_sensor',
            isNotFor: ['hamster'],
            func(sprite, script) {
                const robot = Entry.Hamster.getRobot();
                return robot ? robot.checkHandFound(script) : false;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Hamster.hand_found()',
                        blockType: 'param',
                    },
                ],
            },
        },
        hamster_boolean: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.hamster_tilt_forward, 'TILT_FORWARD'],
                        [Lang.Blocks.hamster_tilt_backward, 'TILT_BACKWARD'],
                        [Lang.Blocks.hamster_tilt_left, 'TILT_LEFT'],
                        [Lang.Blocks.hamster_tilt_right, 'TILT_RIGHT'],
                        [Lang.Blocks.hamster_tilt_flip, 'TILT_FLIP'],
                        [Lang.Blocks.hamster_tilt_not, 'TILT_NOT'],
                        [Lang.Blocks.hamster_battery_normal, 'BATTERY_NORMAL'],
                        [Lang.Blocks.hamster_battery_low, 'BATTERY_LOW'],
                        [Lang.Blocks.hamster_battery_empty, 'BATTERY_EMPTY'],
                    ],
                    value: 'TILT_FORWARD',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'hamster_boolean',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class: 'hamster_sensor',
            isNotFor: ['hamster'],
            func(sprite, script) {
                const robot = Entry.Hamster.getRobot();
                return robot ? robot.checkBoolean(script) : false;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Hamster.boolean_value(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_tilt_forward, 'TILT_FORWARD'],
                                    [Lang.Blocks.hamster_tilt_backward, 'TILT_BACKWARD'],
                                    [Lang.Blocks.hamster_tilt_left, 'TILT_LEFT'],
                                    [Lang.Blocks.hamster_tilt_right, 'TILT_RIGHT'],
                                    [Lang.Blocks.hamster_tilt_flip, 'TILT_FLIP'],
                                    [Lang.Blocks.hamster_tilt_not, 'TILT_NOT'],
                                    [Lang.Blocks.hamster_battery_normal, 'BATTERY_NORMAL'],
                                    [Lang.Blocks.hamster_battery_low, 'BATTERY_LOW'],
                                    [Lang.Blocks.hamster_battery_empty, 'BATTERY_EMPTY'],
                                ],
                                value: 'TILT_FORWARD',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        hamster_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.HAMSTER_sensor_left_proximity, 'leftProximity'],
                        [Lang.Blocks.HAMSTER_sensor_right_proximity, 'rightProximity'],
                        [Lang.Blocks.HAMSTER_sensor_left_floor, 'leftFloor'],
                        [Lang.Blocks.HAMSTER_sensor_right_floor, 'rightFloor'],
                        [Lang.Blocks.HAMSTER_sensor_acceleration_x, 'accelerationX'],
                        [Lang.Blocks.HAMSTER_sensor_acceleration_y, 'accelerationY'],
                        [Lang.Blocks.HAMSTER_sensor_acceleration_z, 'accelerationZ'],
                        [Lang.Blocks.HAMSTER_sensor_light, 'light'],
                        [Lang.Blocks.HAMSTER_sensor_temperature, 'temperature'],
                        [Lang.Blocks.HAMSTER_sensor_signal_strength, 'signalStrength'],
                        [Lang.Blocks.HAMSTER_sensor_input_a, 'inputA'],
                        [Lang.Blocks.HAMSTER_sensor_input_b, 'inputB'],
                    ],
                    value: 'leftProximity',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'hamster_value',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class: 'hamster_sensor',
            isNotFor: ['hamster'],
            func(sprite, script) {
                const robot = Entry.Hamster.getRobot();
                if (robot) {
                    return robot.getValue(script);
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Hamster.sensor_value(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_sensor_left_proximity, 'leftProximity'],
                                    [Lang.Blocks.HAMSTER_sensor_right_proximity, 'rightProximity'],
                                    [Lang.Blocks.HAMSTER_sensor_left_floor, 'leftFloor'],
                                    [Lang.Blocks.HAMSTER_sensor_right_floor, 'rightFloor'],
                                    [Lang.Blocks.HAMSTER_sensor_acceleration_x, 'accelerationX'],
                                    [Lang.Blocks.HAMSTER_sensor_acceleration_y, 'accelerationY'],
                                    [Lang.Blocks.HAMSTER_sensor_acceleration_z, 'accelerationZ'],
                                    [Lang.Blocks.HAMSTER_sensor_light, 'light'],
                                    [Lang.Blocks.HAMSTER_sensor_temperature, 'temperature'],
                                    [Lang.Blocks.HAMSTER_sensor_signal_strength, 'signalStrength'],
                                    [Lang.Blocks.HAMSTER_sensor_input_a, 'inputA'],
                                    [Lang.Blocks.HAMSTER_sensor_input_b, 'inputB'],
                                ],
                                value: 'leftProximity',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        hamster_move_forward_once: {
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
                params: [null],
                type: 'hamster_move_forward_once',
            },
            class: 'hamster_board',
            isNotFor: ['hamster'],
            func(sprite, script) {
                const robot = Entry.Hamster.getRobot();
                return robot ? robot.boardForward(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Hamster.board_forward()',
                    },
                ],
            },
        },
        hamster_turn_once: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.HAMSTER_turn_once_left, 'LEFT'],
                        [Lang.Blocks.HAMSTER_turn_right, 'RIGHT'],
                    ],
                    value: 'LEFT',
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
                type: 'hamster_turn_once',
            },
            paramsKeyMap: {
                DIRECTION: 0,
            },
            class: 'hamster_board',
            isNotFor: ['hamster'],
            func(sprite, script) {
                const robot = Entry.Hamster.getRobot();
                return robot ? robot.boardTurn(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Hamster.board_turn(%1)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_turn_once_left, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_turn_right, 'RIGHT'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        hamster_move_forward_for_secs: {
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
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'hamster_move_forward_for_secs',
            },
            paramsKeyMap: {
                SECS: 0,
            },
            class: 'hamster_wheel',
            isNotFor: ['hamster'],
            func(sprite, script) {
                const robot = Entry.Hamster.getRobot();
                return robot ? robot.moveForwardSecs(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Hamster.move_forward(%1)',
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
        hamster_move_backward_for_secs: {
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
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'hamster_move_backward_for_secs',
            },
            paramsKeyMap: {
                SECS: 0,
            },
            class: 'hamster_wheel',
            isNotFor: ['hamster'],
            func(sprite, script) {
                const robot = Entry.Hamster.getRobot();
                return robot ? robot.moveBackwardSecs(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Hamster.move_backward(%1)',
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
        hamster_turn_for_secs: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.HAMSTER_turn_once_left, 'LEFT'],
                        [Lang.Blocks.HAMSTER_turn_right, 'RIGHT'],
                    ],
                    value: 'LEFT',
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
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'hamster_turn_for_secs',
            },
            paramsKeyMap: {
                DIRECTION: 0,
                SECS: 1,
            },
            class: 'hamster_wheel',
            isNotFor: ['hamster'],
            func(sprite, script) {
                const robot = Entry.Hamster.getRobot();
                return robot ? robot.turnSecs(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Hamster.turn(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_turn_once_left, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_turn_right, 'RIGHT'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
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
        hamster_change_both_wheels_by: {
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
                        type: 'text',
                        params: ['10'],
                    },
                    {
                        type: 'text',
                        params: ['10'],
                    },
                    null,
                ],
                type: 'hamster_change_both_wheels_by',
            },
            paramsKeyMap: {
                LEFT: 0,
                RIGHT: 1,
            },
            class: 'hamster_wheel',
            isNotFor: ['hamster'],
            func(sprite, script) {
                const robot = Entry.Hamster.getRobot();
                return robot ? robot.changeWheels(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Hamster.add_wheels(%1, %2)',
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
        hamster_set_both_wheels_to: {
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
                        type: 'text',
                        params: ['30'],
                    },
                    {
                        type: 'text',
                        params: ['30'],
                    },
                    null,
                ],
                type: 'hamster_set_both_wheels_to',
            },
            paramsKeyMap: {
                LEFT: 0,
                RIGHT: 1,
            },
            class: 'hamster_wheel',
            isNotFor: ['hamster'],
            func(sprite, script) {
                const robot = Entry.Hamster.getRobot();
                return robot ? robot.setWheels(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Hamster.set_wheels(%1, %2)',
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
        hamster_change_wheel_by: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.HAMSTER_left_wheel, 'LEFT'],
                        [Lang.Blocks.HAMSTER_right_wheel, 'RIGHT'],
                        [Lang.Blocks.HAMSTER_both_wheels, 'BOTH'],
                    ],
                    value: 'LEFT',
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
                        type: 'text',
                        params: ['10'],
                    },
                    null,
                ],
                type: 'hamster_change_wheel_by',
            },
            paramsKeyMap: {
                WHEEL: 0,
                VELOCITY: 1,
            },
            class: 'hamster_wheel',
            isNotFor: ['hamster'],
            func(sprite, script) {
                const robot = Entry.Hamster.getRobot();
                return robot ? robot.changeWheel(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Hamster.add_wheel(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_wheel, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_wheel, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_wheels, 'BOTH'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
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
        hamster_set_wheel_to: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.HAMSTER_left_wheel, 'LEFT'],
                        [Lang.Blocks.HAMSTER_right_wheel, 'RIGHT'],
                        [Lang.Blocks.HAMSTER_both_wheels, 'BOTH'],
                    ],
                    value: 'LEFT',
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
                        type: 'text',
                        params: ['30'],
                    },
                    null,
                ],
                type: 'hamster_set_wheel_to',
            },
            paramsKeyMap: {
                WHEEL: 0,
                VELOCITY: 1,
            },
            class: 'hamster_wheel',
            isNotFor: ['hamster'],
            func(sprite, script) {
                const robot = Entry.Hamster.getRobot();
                return robot ? robot.setWheel(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Hamster.set_wheel(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_wheel, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_wheel, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_wheels, 'BOTH'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
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
        hamster_follow_line_using: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.HAMSTER_color_black, 'BLACK'],
                        [Lang.Blocks.HAMSTER_color_white, 'WHITE'],
                    ],
                    value: 'BLACK',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.HAMSTER_left_floor_sensor, 'LEFT'],
                        [Lang.Blocks.HAMSTER_right_floor_sensor, 'RIGHT'],
                        [Lang.Blocks.HAMSTER_both_floor_sensors, 'BOTH'],
                    ],
                    value: 'LEFT',
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
                type: 'hamster_follow_line_using',
            },
            paramsKeyMap: {
                COLOR: 0,
                SENSOR: 1,
            },
            class: 'hamster_wheel',
            isNotFor: ['hamster'],
            func(sprite, script) {
                const robot = Entry.Hamster.getRobot();
                return robot ? robot.followLine(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Hamster.follow_line(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_color_black, 'BLACK'],
                                    [Lang.Blocks.HAMSTER_color_white, 'WHITE'],
                                ],
                                value: 'BLACK',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_floor_sensor, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_floor_sensor, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_floor_sensors, 'BOTH'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        hamster_follow_line_until: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.HAMSTER_color_black, 'BLACK'],
                        [Lang.Blocks.HAMSTER_color_white, 'WHITE'],
                    ],
                    value: 'BLACK',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.HAMSTER_left_floor_sensor, 'LEFT'],
                        [Lang.Blocks.HAMSTER_right_floor_sensor, 'RIGHT'],
                        [Lang.Blocks.HAMSTER_front, 'FRONT'],
                        [Lang.Blocks.HAMSTER_rear, 'REAR'],
                    ],
                    value: 'FRONT',
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
                type: 'hamster_follow_line_until',
            },
            paramsKeyMap: {
                COLOR: 0,
                DIRECTION: 1,
            },
            class: 'hamster_wheel',
            isNotFor: ['hamster'],
            func(sprite, script) {
                const robot = Entry.Hamster.getRobot();
                return robot ? robot.followLineUntil(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Hamster.follow_line_until(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_color_black, 'BLACK'],
                                    [Lang.Blocks.HAMSTER_color_white, 'WHITE'],
                                ],
                                value: 'BLACK',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_floor_sensor, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_floor_sensor, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_front, 'FRONT'],
                                    [Lang.Blocks.HAMSTER_rear, 'REAR'],
                                ],
                                value: 'FRONT',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        hamster_set_following_speed_to: {
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
                params: ['5', null],
                type: 'hamster_set_following_speed_to',
            },
            paramsKeyMap: {
                SPEED: 0,
            },
            class: 'hamster_wheel',
            isNotFor: ['hamster'],
            func(sprite, script) {
                const robot = Entry.Hamster.getRobot();
                return robot ? robot.setLineTracerSpeed(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Hamster.set_line_speed(%1)',
                        textParams: [
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
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringOrNumberByValue,
                            },
                        ],
                    },
                ],
            },
        },
        hamster_stop: {
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
                params: [null],
                type: 'hamster_stop',
            },
            class: 'hamster_wheel',
            isNotFor: ['hamster'],
            func(sprite, script) {
                const robot = Entry.Hamster.getRobot();
                return robot ? robot.stop(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Hamster.stop()',
                    },
                ],
            },
        },
        hamster_set_led_to: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.HAMSTER_left_led, 'LEFT'],
                        [Lang.Blocks.HAMSTER_right_led, 'RIGHT'],
                        [Lang.Blocks.HAMSTER_both_leds, 'BOTH'],
                    ],
                    value: 'LEFT',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.HAMSTER_color_red, '4'],
                        [Lang.Blocks.HAMSTER_color_yellow, '6'],
                        [Lang.Blocks.HAMSTER_color_green, '2'],
                        [Lang.Blocks.HAMSTER_color_cyan, '3'],
                        [Lang.Blocks.HAMSTER_color_blue, '1'],
                        [Lang.Blocks.HAMSTER_color_magenta, '5'],
                        [Lang.Blocks.HAMSTER_color_white, '7'],
                    ],
                    value: '4',
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
                type: 'hamster_set_led_to',
            },
            paramsKeyMap: {
                LED: 0,
                COLOR: 1,
            },
            class: 'hamster_led',
            isNotFor: ['hamster'],
            func(sprite, script) {
                const robot = Entry.Hamster.getRobot();
                return robot ? robot.setLed(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Hamster.set_led_red(%1)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_led, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_led, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_leds, 'BOTH'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_color_red, '4'],
                                    [Lang.Blocks.HAMSTER_color_yellow, '6'],
                                    [Lang.Blocks.HAMSTER_color_green, '2'],
                                    [Lang.Blocks.HAMSTER_color_cyan, '3'],
                                    [Lang.Blocks.HAMSTER_color_blue, '1'],
                                    [Lang.Blocks.HAMSTER_color_magenta, '5'],
                                    [Lang.Blocks.HAMSTER_color_white, '7'],
                                ],
                                value: '4',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '4'],
                    },
                    {
                        syntax: 'Hamster.set_led_yellow(%1)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_led, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_led, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_leds, 'BOTH'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_color_red, '4'],
                                    [Lang.Blocks.HAMSTER_color_yellow, '6'],
                                    [Lang.Blocks.HAMSTER_color_green, '2'],
                                    [Lang.Blocks.HAMSTER_color_cyan, '3'],
                                    [Lang.Blocks.HAMSTER_color_blue, '1'],
                                    [Lang.Blocks.HAMSTER_color_magenta, '5'],
                                    [Lang.Blocks.HAMSTER_color_white, '7'],
                                ],
                                value: '4',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '6'],
                    },
                    {
                        syntax: 'Hamster.set_led_green(%1)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_led, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_led, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_leds, 'BOTH'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_color_red, '4'],
                                    [Lang.Blocks.HAMSTER_color_yellow, '6'],
                                    [Lang.Blocks.HAMSTER_color_green, '2'],
                                    [Lang.Blocks.HAMSTER_color_cyan, '3'],
                                    [Lang.Blocks.HAMSTER_color_blue, '1'],
                                    [Lang.Blocks.HAMSTER_color_magenta, '5'],
                                    [Lang.Blocks.HAMSTER_color_white, '7'],
                                ],
                                value: '4',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '2'],
                    },
                    {
                        syntax: 'Hamster.set_led_sky_blue(%1)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_led, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_led, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_leds, 'BOTH'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_color_red, '4'],
                                    [Lang.Blocks.HAMSTER_color_yellow, '6'],
                                    [Lang.Blocks.HAMSTER_color_green, '2'],
                                    [Lang.Blocks.HAMSTER_color_cyan, '3'],
                                    [Lang.Blocks.HAMSTER_color_blue, '1'],
                                    [Lang.Blocks.HAMSTER_color_magenta, '5'],
                                    [Lang.Blocks.HAMSTER_color_white, '7'],
                                ],
                                value: '4',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '3'],
                    },
                    {
                        syntax: 'Hamster.set_led_blue(%1)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_led, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_led, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_leds, 'BOTH'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_color_red, '4'],
                                    [Lang.Blocks.HAMSTER_color_yellow, '6'],
                                    [Lang.Blocks.HAMSTER_color_green, '2'],
                                    [Lang.Blocks.HAMSTER_color_cyan, '3'],
                                    [Lang.Blocks.HAMSTER_color_blue, '1'],
                                    [Lang.Blocks.HAMSTER_color_magenta, '5'],
                                    [Lang.Blocks.HAMSTER_color_white, '7'],
                                ],
                                value: '4',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '1'],
                    },
                    {
                        syntax: 'Hamster.set_led_purple(%1)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_led, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_led, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_leds, 'BOTH'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_color_red, '4'],
                                    [Lang.Blocks.HAMSTER_color_yellow, '6'],
                                    [Lang.Blocks.HAMSTER_color_green, '2'],
                                    [Lang.Blocks.HAMSTER_color_cyan, '3'],
                                    [Lang.Blocks.HAMSTER_color_blue, '1'],
                                    [Lang.Blocks.HAMSTER_color_magenta, '5'],
                                    [Lang.Blocks.HAMSTER_color_white, '7'],
                                ],
                                value: '4',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '5'],
                    },
                    {
                        syntax: 'Hamster.set_led_white(%1)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_led, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_led, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_leds, 'BOTH'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_color_red, '4'],
                                    [Lang.Blocks.HAMSTER_color_yellow, '6'],
                                    [Lang.Blocks.HAMSTER_color_green, '2'],
                                    [Lang.Blocks.HAMSTER_color_cyan, '3'],
                                    [Lang.Blocks.HAMSTER_color_blue, '1'],
                                    [Lang.Blocks.HAMSTER_color_magenta, '5'],
                                    [Lang.Blocks.HAMSTER_color_white, '7'],
                                ],
                                value: '4',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '7'],
                    },
                ],
            },
        },
        hamster_clear_led: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.HAMSTER_left_led, 'LEFT'],
                        [Lang.Blocks.HAMSTER_right_led, 'RIGHT'],
                        [Lang.Blocks.HAMSTER_both_leds, 'BOTH'],
                    ],
                    value: 'LEFT',
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
                type: 'hamster_clear_led',
            },
            paramsKeyMap: {
                LED: 0,
            },
            class: 'hamster_led',
            isNotFor: ['hamster'],
            func(sprite, script) {
                const robot = Entry.Hamster.getRobot();
                return robot ? robot.clearLed(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Hamster.clear_led(%1)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_left_led, 'LEFT'],
                                    [Lang.Blocks.HAMSTER_right_led, 'RIGHT'],
                                    [Lang.Blocks.HAMSTER_both_leds, 'BOTH'],
                                ],
                                value: 'LEFT',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        hamster_beep: {
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
                params: [null],
                type: 'hamster_beep',
            },
            class: 'hamster_buzzer',
            isNotFor: ['hamster'],
            func(sprite, script) {
                const robot = Entry.Hamster.getRobot();
                return robot ? robot.beep(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Hamster.beep()',
                    },
                ],
            },
        },
        hamster_change_buzzer_by: {
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
                        type: 'text',
                        params: ['10'],
                    },
                    null,
                ],
                type: 'hamster_change_buzzer_by',
            },
            paramsKeyMap: {
                HZ: 0,
            },
            class: 'hamster_buzzer',
            isNotFor: ['hamster'],
            func(sprite, script) {
                const robot = Entry.Hamster.getRobot();
                return robot ? robot.changeBuzzer(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Hamster.add_buzzer(%1)',
                    },
                ],
            },
        },
        hamster_set_buzzer_to: {
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
                        type: 'text',
                        params: ['1000'],
                    },
                    null,
                ],
                type: 'hamster_set_buzzer_to',
            },
            paramsKeyMap: {
                HZ: 0,
            },
            class: 'hamster_buzzer',
            isNotFor: ['hamster'],
            func(sprite, script) {
                const robot = Entry.Hamster.getRobot();
                return robot ? robot.setBuzzer(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Hamster.set_buzzer(%1)',
                    },
                ],
            },
        },
        hamster_clear_buzzer: {
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
                params: [null],
                type: 'hamster_clear_buzzer',
            },
            class: 'hamster_buzzer',
            isNotFor: ['hamster'],
            func(sprite, script) {
                const robot = Entry.Hamster.getRobot();
                return robot ? robot.clearBuzzer(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Hamster.clear_buzzer()',
                    },
                ],
            },
        },
        hamster_play_note: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.hamster_note_c, '4'],
                        [Lang.Blocks.hamster_note_c_sharp, '5'],
                        [Lang.Blocks.hamster_note_d, '6'],
                        [Lang.Blocks.hamster_note_d_sharp, '7'],
                        [Lang.Blocks.hamster_note_e, '8'],
                        [Lang.Blocks.hamster_note_f, '9'],
                        [Lang.Blocks.hamster_note_f_sharp, '10'],
                        [Lang.Blocks.hamster_note_g, '11'],
                        [Lang.Blocks.hamster_note_g_sharp, '12'],
                        [Lang.Blocks.hamster_note_a, '13'],
                        [Lang.Blocks.hamster_note_a_sharp, '14'],
                        [Lang.Blocks.hamster_note_b, '15'],
                    ],
                    value: '4',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                params: [null, '4', null],
                type: 'hamster_play_note',
            },
            paramsKeyMap: {
                NOTE: 0,
                OCTAVE: 1,
            },
            class: 'hamster_buzzer',
            isNotFor: ['hamster'],
            func(sprite, script) {
                const robot = Entry.Hamster.getRobot();
                return robot ? robot.playNote(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Hamster.play_pitch_c(%2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_note_c, '4'],
                                    [Lang.Blocks.hamster_note_c_sharp, '5'],
                                    [Lang.Blocks.hamster_note_d, '6'],
                                    [Lang.Blocks.hamster_note_d_sharp, '7'],
                                    [Lang.Blocks.hamster_note_e, '8'],
                                    [Lang.Blocks.hamster_note_f, '9'],
                                    [Lang.Blocks.hamster_note_f_sharp, '10'],
                                    [Lang.Blocks.hamster_note_g, '11'],
                                    [Lang.Blocks.hamster_note_g_sharp, '12'],
                                    [Lang.Blocks.hamster_note_a, '13'],
                                    [Lang.Blocks.hamster_note_a_sharp, '14'],
                                    [Lang.Blocks.hamster_note_b, '15'],
                                ],
                                value: '4',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
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
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringOrNumberByValue,
                            },
                        ],
                        params: ['4'],
                    },
                    {
                        syntax: 'Hamster.play_pitch_c_sharp(%2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_note_c, '4'],
                                    [Lang.Blocks.hamster_note_c_sharp, '5'],
                                    [Lang.Blocks.hamster_note_d, '6'],
                                    [Lang.Blocks.hamster_note_d_sharp, '7'],
                                    [Lang.Blocks.hamster_note_e, '8'],
                                    [Lang.Blocks.hamster_note_f, '9'],
                                    [Lang.Blocks.hamster_note_f_sharp, '10'],
                                    [Lang.Blocks.hamster_note_g, '11'],
                                    [Lang.Blocks.hamster_note_g_sharp, '12'],
                                    [Lang.Blocks.hamster_note_a, '13'],
                                    [Lang.Blocks.hamster_note_a_sharp, '14'],
                                    [Lang.Blocks.hamster_note_b, '15'],
                                ],
                                value: '4',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
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
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringOrNumberByValue,
                            },
                        ],
                        params: ['5'],
                    },
                    {
                        syntax: 'Hamster.play_pitch_d(%2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_note_c, '4'],
                                    [Lang.Blocks.hamster_note_c_sharp, '5'],
                                    [Lang.Blocks.hamster_note_d, '6'],
                                    [Lang.Blocks.hamster_note_d_sharp, '7'],
                                    [Lang.Blocks.hamster_note_e, '8'],
                                    [Lang.Blocks.hamster_note_f, '9'],
                                    [Lang.Blocks.hamster_note_f_sharp, '10'],
                                    [Lang.Blocks.hamster_note_g, '11'],
                                    [Lang.Blocks.hamster_note_g_sharp, '12'],
                                    [Lang.Blocks.hamster_note_a, '13'],
                                    [Lang.Blocks.hamster_note_a_sharp, '14'],
                                    [Lang.Blocks.hamster_note_b, '15'],
                                ],
                                value: '4',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
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
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringOrNumberByValue,
                            },
                        ],
                        params: ['6'],
                    },
                    {
                        syntax: 'Hamster.play_pitch_d_sharp(%2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_note_c, '4'],
                                    [Lang.Blocks.hamster_note_c_sharp, '5'],
                                    [Lang.Blocks.hamster_note_d, '6'],
                                    [Lang.Blocks.hamster_note_d_sharp, '7'],
                                    [Lang.Blocks.hamster_note_e, '8'],
                                    [Lang.Blocks.hamster_note_f, '9'],
                                    [Lang.Blocks.hamster_note_f_sharp, '10'],
                                    [Lang.Blocks.hamster_note_g, '11'],
                                    [Lang.Blocks.hamster_note_g_sharp, '12'],
                                    [Lang.Blocks.hamster_note_a, '13'],
                                    [Lang.Blocks.hamster_note_a_sharp, '14'],
                                    [Lang.Blocks.hamster_note_b, '15'],
                                ],
                                value: '4',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
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
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringOrNumberByValue,
                            },
                        ],
                        params: ['7'],
                    },
                    {
                        syntax: 'Hamster.play_pitch_e(%2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_note_c, '4'],
                                    [Lang.Blocks.hamster_note_c_sharp, '5'],
                                    [Lang.Blocks.hamster_note_d, '6'],
                                    [Lang.Blocks.hamster_note_d_sharp, '7'],
                                    [Lang.Blocks.hamster_note_e, '8'],
                                    [Lang.Blocks.hamster_note_f, '9'],
                                    [Lang.Blocks.hamster_note_f_sharp, '10'],
                                    [Lang.Blocks.hamster_note_g, '11'],
                                    [Lang.Blocks.hamster_note_g_sharp, '12'],
                                    [Lang.Blocks.hamster_note_a, '13'],
                                    [Lang.Blocks.hamster_note_a_sharp, '14'],
                                    [Lang.Blocks.hamster_note_b, '15'],
                                ],
                                value: '4',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
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
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringOrNumberByValue,
                            },
                        ],
                        params: ['8'],
                    },
                    {
                        syntax: 'Hamster.play_pitch_f(%2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_note_c, '4'],
                                    [Lang.Blocks.hamster_note_c_sharp, '5'],
                                    [Lang.Blocks.hamster_note_d, '6'],
                                    [Lang.Blocks.hamster_note_d_sharp, '7'],
                                    [Lang.Blocks.hamster_note_e, '8'],
                                    [Lang.Blocks.hamster_note_f, '9'],
                                    [Lang.Blocks.hamster_note_f_sharp, '10'],
                                    [Lang.Blocks.hamster_note_g, '11'],
                                    [Lang.Blocks.hamster_note_g_sharp, '12'],
                                    [Lang.Blocks.hamster_note_a, '13'],
                                    [Lang.Blocks.hamster_note_a_sharp, '14'],
                                    [Lang.Blocks.hamster_note_b, '15'],
                                ],
                                value: '4',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
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
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringOrNumberByValue,
                            },
                        ],
                        params: ['9'],
                    },
                    {
                        syntax: 'Hamster.play_pitch_f_sharp(%2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_note_c, '4'],
                                    [Lang.Blocks.hamster_note_c_sharp, '5'],
                                    [Lang.Blocks.hamster_note_d, '6'],
                                    [Lang.Blocks.hamster_note_d_sharp, '7'],
                                    [Lang.Blocks.hamster_note_e, '8'],
                                    [Lang.Blocks.hamster_note_f, '9'],
                                    [Lang.Blocks.hamster_note_f_sharp, '10'],
                                    [Lang.Blocks.hamster_note_g, '11'],
                                    [Lang.Blocks.hamster_note_g_sharp, '12'],
                                    [Lang.Blocks.hamster_note_a, '13'],
                                    [Lang.Blocks.hamster_note_a_sharp, '14'],
                                    [Lang.Blocks.hamster_note_b, '15'],
                                ],
                                value: '4',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
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
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringOrNumberByValue,
                            },
                        ],
                        params: ['10'],
                    },
                    {
                        syntax: 'Hamster.play_pitch_g(%2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_note_c, '4'],
                                    [Lang.Blocks.hamster_note_c_sharp, '5'],
                                    [Lang.Blocks.hamster_note_d, '6'],
                                    [Lang.Blocks.hamster_note_d_sharp, '7'],
                                    [Lang.Blocks.hamster_note_e, '8'],
                                    [Lang.Blocks.hamster_note_f, '9'],
                                    [Lang.Blocks.hamster_note_f_sharp, '10'],
                                    [Lang.Blocks.hamster_note_g, '11'],
                                    [Lang.Blocks.hamster_note_g_sharp, '12'],
                                    [Lang.Blocks.hamster_note_a, '13'],
                                    [Lang.Blocks.hamster_note_a_sharp, '14'],
                                    [Lang.Blocks.hamster_note_b, '15'],
                                ],
                                value: '4',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
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
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringOrNumberByValue,
                            },
                        ],
                        params: ['11'],
                    },
                    {
                        syntax: 'Hamster.play_pitch_g_sharp(%2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_note_c, '4'],
                                    [Lang.Blocks.hamster_note_c_sharp, '5'],
                                    [Lang.Blocks.hamster_note_d, '6'],
                                    [Lang.Blocks.hamster_note_d_sharp, '7'],
                                    [Lang.Blocks.hamster_note_e, '8'],
                                    [Lang.Blocks.hamster_note_f, '9'],
                                    [Lang.Blocks.hamster_note_f_sharp, '10'],
                                    [Lang.Blocks.hamster_note_g, '11'],
                                    [Lang.Blocks.hamster_note_g_sharp, '12'],
                                    [Lang.Blocks.hamster_note_a, '13'],
                                    [Lang.Blocks.hamster_note_a_sharp, '14'],
                                    [Lang.Blocks.hamster_note_b, '15'],
                                ],
                                value: '4',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
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
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringOrNumberByValue,
                            },
                        ],
                        params: ['12'],
                    },
                    {
                        syntax: 'Hamster.play_pitch_a(%2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_note_c, '4'],
                                    [Lang.Blocks.hamster_note_c_sharp, '5'],
                                    [Lang.Blocks.hamster_note_d, '6'],
                                    [Lang.Blocks.hamster_note_d_sharp, '7'],
                                    [Lang.Blocks.hamster_note_e, '8'],
                                    [Lang.Blocks.hamster_note_f, '9'],
                                    [Lang.Blocks.hamster_note_f_sharp, '10'],
                                    [Lang.Blocks.hamster_note_g, '11'],
                                    [Lang.Blocks.hamster_note_g_sharp, '12'],
                                    [Lang.Blocks.hamster_note_a, '13'],
                                    [Lang.Blocks.hamster_note_a_sharp, '14'],
                                    [Lang.Blocks.hamster_note_b, '15'],
                                ],
                                value: '4',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
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
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringOrNumberByValue,
                            },
                        ],
                        params: ['13'],
                    },
                    {
                        syntax: 'Hamster.play_pitch_a_sharp(%2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_note_c, '4'],
                                    [Lang.Blocks.hamster_note_c_sharp, '5'],
                                    [Lang.Blocks.hamster_note_d, '6'],
                                    [Lang.Blocks.hamster_note_d_sharp, '7'],
                                    [Lang.Blocks.hamster_note_e, '8'],
                                    [Lang.Blocks.hamster_note_f, '9'],
                                    [Lang.Blocks.hamster_note_f_sharp, '10'],
                                    [Lang.Blocks.hamster_note_g, '11'],
                                    [Lang.Blocks.hamster_note_g_sharp, '12'],
                                    [Lang.Blocks.hamster_note_a, '13'],
                                    [Lang.Blocks.hamster_note_a_sharp, '14'],
                                    [Lang.Blocks.hamster_note_b, '15'],
                                ],
                                value: '4',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
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
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringOrNumberByValue,
                            },
                        ],
                        params: ['14'],
                    },
                    {
                        syntax: 'Hamster.play_pitch_b(%2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_note_c, '4'],
                                    [Lang.Blocks.hamster_note_c_sharp, '5'],
                                    [Lang.Blocks.hamster_note_d, '6'],
                                    [Lang.Blocks.hamster_note_d_sharp, '7'],
                                    [Lang.Blocks.hamster_note_e, '8'],
                                    [Lang.Blocks.hamster_note_f, '9'],
                                    [Lang.Blocks.hamster_note_f_sharp, '10'],
                                    [Lang.Blocks.hamster_note_g, '11'],
                                    [Lang.Blocks.hamster_note_g_sharp, '12'],
                                    [Lang.Blocks.hamster_note_a, '13'],
                                    [Lang.Blocks.hamster_note_a_sharp, '14'],
                                    [Lang.Blocks.hamster_note_b, '15'],
                                ],
                                value: '4',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
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
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringOrNumberByValue,
                            },
                        ],
                        params: ['15'],
                    },
                ],
            },
        },
        hamster_play_note_for: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.hamster_note_c, '4'],
                        [Lang.Blocks.hamster_note_c_sharp, '5'],
                        [Lang.Blocks.hamster_note_d, '6'],
                        [Lang.Blocks.hamster_note_d_sharp, '7'],
                        [Lang.Blocks.hamster_note_e, '8'],
                        [Lang.Blocks.hamster_note_f, '9'],
                        [Lang.Blocks.hamster_note_f_sharp, '10'],
                        [Lang.Blocks.hamster_note_g, '11'],
                        [Lang.Blocks.hamster_note_g_sharp, '12'],
                        [Lang.Blocks.hamster_note_a, '13'],
                        [Lang.Blocks.hamster_note_a_sharp, '14'],
                        [Lang.Blocks.hamster_note_b, '15'],
                    ],
                    value: '4',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                    ],
                    value: '1',
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
                    '4',
                    {
                        type: 'text',
                        params: ['0.5'],
                    },
                    null,
                ],
                type: 'hamster_play_note_for',
            },
            paramsKeyMap: {
                NOTE: 0,
                OCTAVE: 1,
                BEAT: 2,
            },
            class: 'hamster_buzzer',
            isNotFor: ['hamster'],
            func(sprite, script) {
                const robot = Entry.Hamster.getRobot();
                return robot ? robot.playNoteBeat(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Hamster.play_note_c(%2, %3)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_note_c, '4'],
                                    [Lang.Blocks.hamster_note_c_sharp, '5'],
                                    [Lang.Blocks.hamster_note_d, '6'],
                                    [Lang.Blocks.hamster_note_d_sharp, '7'],
                                    [Lang.Blocks.hamster_note_e, '8'],
                                    [Lang.Blocks.hamster_note_f, '9'],
                                    [Lang.Blocks.hamster_note_f_sharp, '10'],
                                    [Lang.Blocks.hamster_note_g, '11'],
                                    [Lang.Blocks.hamster_note_g_sharp, '12'],
                                    [Lang.Blocks.hamster_note_a, '13'],
                                    [Lang.Blocks.hamster_note_a_sharp, '14'],
                                    [Lang.Blocks.hamster_note_b, '15'],
                                ],
                                value: '4',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
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
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringOrNumberByValue,
                            },
                            { type: 'Block', accept: 'string' },
                        ],
                        params: ['4'],
                    },
                    {
                        syntax: 'Hamster.play_note_c_sharp(%2, %3)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_note_c, '4'],
                                    [Lang.Blocks.hamster_note_c_sharp, '5'],
                                    [Lang.Blocks.hamster_note_d, '6'],
                                    [Lang.Blocks.hamster_note_d_sharp, '7'],
                                    [Lang.Blocks.hamster_note_e, '8'],
                                    [Lang.Blocks.hamster_note_f, '9'],
                                    [Lang.Blocks.hamster_note_f_sharp, '10'],
                                    [Lang.Blocks.hamster_note_g, '11'],
                                    [Lang.Blocks.hamster_note_g_sharp, '12'],
                                    [Lang.Blocks.hamster_note_a, '13'],
                                    [Lang.Blocks.hamster_note_a_sharp, '14'],
                                    [Lang.Blocks.hamster_note_b, '15'],
                                ],
                                value: '4',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
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
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringOrNumberByValue,
                            },
                            { type: 'Block', accept: 'string' },
                        ],
                        params: ['5'],
                    },
                    {
                        syntax: 'Hamster.play_note_d(%2, %3)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_note_c, '4'],
                                    [Lang.Blocks.hamster_note_c_sharp, '5'],
                                    [Lang.Blocks.hamster_note_d, '6'],
                                    [Lang.Blocks.hamster_note_d_sharp, '7'],
                                    [Lang.Blocks.hamster_note_e, '8'],
                                    [Lang.Blocks.hamster_note_f, '9'],
                                    [Lang.Blocks.hamster_note_f_sharp, '10'],
                                    [Lang.Blocks.hamster_note_g, '11'],
                                    [Lang.Blocks.hamster_note_g_sharp, '12'],
                                    [Lang.Blocks.hamster_note_a, '13'],
                                    [Lang.Blocks.hamster_note_a_sharp, '14'],
                                    [Lang.Blocks.hamster_note_b, '15'],
                                ],
                                value: '4',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
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
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringOrNumberByValue,
                            },
                            { type: 'Block', accept: 'string' },
                        ],
                        params: ['6'],
                    },
                    {
                        syntax: 'Hamster.play_note_d_sharp(%2, %3)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_note_c, '4'],
                                    [Lang.Blocks.hamster_note_c_sharp, '5'],
                                    [Lang.Blocks.hamster_note_d, '6'],
                                    [Lang.Blocks.hamster_note_d_sharp, '7'],
                                    [Lang.Blocks.hamster_note_e, '8'],
                                    [Lang.Blocks.hamster_note_f, '9'],
                                    [Lang.Blocks.hamster_note_f_sharp, '10'],
                                    [Lang.Blocks.hamster_note_g, '11'],
                                    [Lang.Blocks.hamster_note_g_sharp, '12'],
                                    [Lang.Blocks.hamster_note_a, '13'],
                                    [Lang.Blocks.hamster_note_a_sharp, '14'],
                                    [Lang.Blocks.hamster_note_b, '15'],
                                ],
                                value: '4',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
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
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringOrNumberByValue,
                            },
                            { type: 'Block', accept: 'string' },
                        ],
                        params: ['7'],
                    },
                    {
                        syntax: 'Hamster.play_note_e(%2, %3)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_note_c, '4'],
                                    [Lang.Blocks.hamster_note_c_sharp, '5'],
                                    [Lang.Blocks.hamster_note_d, '6'],
                                    [Lang.Blocks.hamster_note_d_sharp, '7'],
                                    [Lang.Blocks.hamster_note_e, '8'],
                                    [Lang.Blocks.hamster_note_f, '9'],
                                    [Lang.Blocks.hamster_note_f_sharp, '10'],
                                    [Lang.Blocks.hamster_note_g, '11'],
                                    [Lang.Blocks.hamster_note_g_sharp, '12'],
                                    [Lang.Blocks.hamster_note_a, '13'],
                                    [Lang.Blocks.hamster_note_a_sharp, '14'],
                                    [Lang.Blocks.hamster_note_b, '15'],
                                ],
                                value: '4',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
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
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringOrNumberByValue,
                            },
                            { type: 'Block', accept: 'string' },
                        ],
                        params: ['8'],
                    },
                    {
                        syntax: 'Hamster.play_note_f(%2, %3)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_note_c, '4'],
                                    [Lang.Blocks.hamster_note_c_sharp, '5'],
                                    [Lang.Blocks.hamster_note_d, '6'],
                                    [Lang.Blocks.hamster_note_d_sharp, '7'],
                                    [Lang.Blocks.hamster_note_e, '8'],
                                    [Lang.Blocks.hamster_note_f, '9'],
                                    [Lang.Blocks.hamster_note_f_sharp, '10'],
                                    [Lang.Blocks.hamster_note_g, '11'],
                                    [Lang.Blocks.hamster_note_g_sharp, '12'],
                                    [Lang.Blocks.hamster_note_a, '13'],
                                    [Lang.Blocks.hamster_note_a_sharp, '14'],
                                    [Lang.Blocks.hamster_note_b, '15'],
                                ],
                                value: '4',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
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
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringOrNumberByValue,
                            },
                            { type: 'Block', accept: 'string' },
                        ],
                        params: ['9'],
                    },
                    {
                        syntax: 'Hamster.play_note_f_sharp(%2, %3)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_note_c, '4'],
                                    [Lang.Blocks.hamster_note_c_sharp, '5'],
                                    [Lang.Blocks.hamster_note_d, '6'],
                                    [Lang.Blocks.hamster_note_d_sharp, '7'],
                                    [Lang.Blocks.hamster_note_e, '8'],
                                    [Lang.Blocks.hamster_note_f, '9'],
                                    [Lang.Blocks.hamster_note_f_sharp, '10'],
                                    [Lang.Blocks.hamster_note_g, '11'],
                                    [Lang.Blocks.hamster_note_g_sharp, '12'],
                                    [Lang.Blocks.hamster_note_a, '13'],
                                    [Lang.Blocks.hamster_note_a_sharp, '14'],
                                    [Lang.Blocks.hamster_note_b, '15'],
                                ],
                                value: '4',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
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
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringOrNumberByValue,
                            },
                            { type: 'Block', accept: 'string' },
                        ],
                        params: ['10'],
                    },
                    {
                        syntax: 'Hamster.play_note_g(%2, %3)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_note_c, '4'],
                                    [Lang.Blocks.hamster_note_c_sharp, '5'],
                                    [Lang.Blocks.hamster_note_d, '6'],
                                    [Lang.Blocks.hamster_note_d_sharp, '7'],
                                    [Lang.Blocks.hamster_note_e, '8'],
                                    [Lang.Blocks.hamster_note_f, '9'],
                                    [Lang.Blocks.hamster_note_f_sharp, '10'],
                                    [Lang.Blocks.hamster_note_g, '11'],
                                    [Lang.Blocks.hamster_note_g_sharp, '12'],
                                    [Lang.Blocks.hamster_note_a, '13'],
                                    [Lang.Blocks.hamster_note_a_sharp, '14'],
                                    [Lang.Blocks.hamster_note_b, '15'],
                                ],
                                value: '4',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
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
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringOrNumberByValue,
                            },
                            { type: 'Block', accept: 'string' },
                        ],
                        params: ['11'],
                    },
                    {
                        syntax: 'Hamster.play_note_g_sharp(%2, %3)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_note_c, '4'],
                                    [Lang.Blocks.hamster_note_c_sharp, '5'],
                                    [Lang.Blocks.hamster_note_d, '6'],
                                    [Lang.Blocks.hamster_note_d_sharp, '7'],
                                    [Lang.Blocks.hamster_note_e, '8'],
                                    [Lang.Blocks.hamster_note_f, '9'],
                                    [Lang.Blocks.hamster_note_f_sharp, '10'],
                                    [Lang.Blocks.hamster_note_g, '11'],
                                    [Lang.Blocks.hamster_note_g_sharp, '12'],
                                    [Lang.Blocks.hamster_note_a, '13'],
                                    [Lang.Blocks.hamster_note_a_sharp, '14'],
                                    [Lang.Blocks.hamster_note_b, '15'],
                                ],
                                value: '4',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
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
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringOrNumberByValue,
                            },
                            { type: 'Block', accept: 'string' },
                        ],
                        params: ['12'],
                    },
                    {
                        syntax: 'Hamster.play_note_a(%2, %3)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_note_c, '4'],
                                    [Lang.Blocks.hamster_note_c_sharp, '5'],
                                    [Lang.Blocks.hamster_note_d, '6'],
                                    [Lang.Blocks.hamster_note_d_sharp, '7'],
                                    [Lang.Blocks.hamster_note_e, '8'],
                                    [Lang.Blocks.hamster_note_f, '9'],
                                    [Lang.Blocks.hamster_note_f_sharp, '10'],
                                    [Lang.Blocks.hamster_note_g, '11'],
                                    [Lang.Blocks.hamster_note_g_sharp, '12'],
                                    [Lang.Blocks.hamster_note_a, '13'],
                                    [Lang.Blocks.hamster_note_a_sharp, '14'],
                                    [Lang.Blocks.hamster_note_b, '15'],
                                ],
                                value: '4',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
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
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringOrNumberByValue,
                            },
                            { type: 'Block', accept: 'string' },
                        ],
                        params: ['13'],
                    },
                    {
                        syntax: 'Hamster.play_note_a_sharp(%2, %3)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_note_c, '4'],
                                    [Lang.Blocks.hamster_note_c_sharp, '5'],
                                    [Lang.Blocks.hamster_note_d, '6'],
                                    [Lang.Blocks.hamster_note_d_sharp, '7'],
                                    [Lang.Blocks.hamster_note_e, '8'],
                                    [Lang.Blocks.hamster_note_f, '9'],
                                    [Lang.Blocks.hamster_note_f_sharp, '10'],
                                    [Lang.Blocks.hamster_note_g, '11'],
                                    [Lang.Blocks.hamster_note_g_sharp, '12'],
                                    [Lang.Blocks.hamster_note_a, '13'],
                                    [Lang.Blocks.hamster_note_a_sharp, '14'],
                                    [Lang.Blocks.hamster_note_b, '15'],
                                ],
                                value: '4',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
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
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringOrNumberByValue,
                            },
                            { type: 'Block', accept: 'string' },
                        ],
                        params: ['14'],
                    },
                    {
                        syntax: 'Hamster.play_note_b(%2, %3)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_note_c, '4'],
                                    [Lang.Blocks.hamster_note_c_sharp, '5'],
                                    [Lang.Blocks.hamster_note_d, '6'],
                                    [Lang.Blocks.hamster_note_d_sharp, '7'],
                                    [Lang.Blocks.hamster_note_e, '8'],
                                    [Lang.Blocks.hamster_note_f, '9'],
                                    [Lang.Blocks.hamster_note_f_sharp, '10'],
                                    [Lang.Blocks.hamster_note_g, '11'],
                                    [Lang.Blocks.hamster_note_g_sharp, '12'],
                                    [Lang.Blocks.hamster_note_a, '13'],
                                    [Lang.Blocks.hamster_note_a_sharp, '14'],
                                    [Lang.Blocks.hamster_note_b, '15'],
                                ],
                                value: '4',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
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
                                ],
                                value: '1',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringOrNumberByValue,
                            },
                            { type: 'Block', accept: 'string' },
                        ],
                        params: ['15'],
                    },
                ],
            },
        },
        hamster_rest_for: {
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
                        type: 'text',
                        params: ['0.25'],
                    },
                    null,
                ],
                type: 'hamster_rest_for',
            },
            paramsKeyMap: {
                BEAT: 0,
            },
            class: 'hamster_buzzer',
            isNotFor: ['hamster'],
            func(sprite, script) {
                const robot = Entry.Hamster.getRobot();
                return robot ? robot.restBeat(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Hamster.rest(%1)',
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
        hamster_change_tempo_by: {
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
                        type: 'text',
                        params: ['20'],
                    },
                    null,
                ],
                type: 'hamster_change_tempo_by',
            },
            paramsKeyMap: {
                BPM: 0,
            },
            class: 'hamster_buzzer',
            isNotFor: ['hamster'],
            func(sprite, script) {
                const robot = Entry.Hamster.getRobot();
                return robot ? robot.changeTempo(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Hamster.add_tempo(%1)',
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
        hamster_set_tempo_to: {
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
                        type: 'text',
                        params: ['60'],
                    },
                    null,
                ],
                type: 'hamster_set_tempo_to',
            },
            paramsKeyMap: {
                BPM: 0,
            },
            class: 'hamster_buzzer',
            isNotFor: ['hamster'],
            func(sprite, script) {
                const robot = Entry.Hamster.getRobot();
                return robot ? robot.setTempo(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Hamster.set_tempo(%1)',
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
        hamster_set_port_to: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.HAMSTER_port_a, 'A'],
                        [Lang.Blocks.HAMSTER_port_b, 'B'],
                        [Lang.Blocks.HAMSTER_port_ab, 'AB'],
                    ],
                    value: 'A',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.HAMSTER_analog_input, '0'],
                        [Lang.Blocks.HAMSTER_digital_input, '1'],
                        [Lang.Blocks.HAMSTER_servo_output, '8'],
                        [Lang.Blocks.HAMSTER_pwm_output, '9'],
                        [Lang.Blocks.HAMSTER_digital_output, '10'],
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
                params: [null, null, null],
                type: 'hamster_set_port_to',
            },
            paramsKeyMap: {
                PORT: 0,
                MODE: 1,
            },
            class: 'hamster_port',
            isNotFor: ['hamster'],
            func(sprite, script) {
                const robot = Entry.Hamster.getRobot();
                return robot ? robot.setIoMode(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Hamster.set_io_mode_analog_input(%1)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_port_a, 'A'],
                                    [Lang.Blocks.HAMSTER_port_b, 'B'],
                                    [Lang.Blocks.HAMSTER_port_ab, 'AB'],
                                ],
                                value: 'A',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_analog_input, '0'],
                                    [Lang.Blocks.HAMSTER_digital_input, '1'],
                                    [Lang.Blocks.HAMSTER_servo_output, '8'],
                                    [Lang.Blocks.HAMSTER_pwm_output, '9'],
                                    [Lang.Blocks.HAMSTER_digital_output, '10'],
                                ],
                                value: '0',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '0'],
                    },
                    {
                        syntax: 'Hamster.set_io_mode_digital_input(%1)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_port_a, 'A'],
                                    [Lang.Blocks.HAMSTER_port_b, 'B'],
                                    [Lang.Blocks.HAMSTER_port_ab, 'AB'],
                                ],
                                value: 'A',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_analog_input, '0'],
                                    [Lang.Blocks.HAMSTER_digital_input, '1'],
                                    [Lang.Blocks.HAMSTER_servo_output, '8'],
                                    [Lang.Blocks.HAMSTER_pwm_output, '9'],
                                    [Lang.Blocks.HAMSTER_digital_output, '10'],
                                ],
                                value: '0',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '1'],
                    },
                    {
                        syntax: 'Hamster.set_io_mode_servo_output(%1)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_port_a, 'A'],
                                    [Lang.Blocks.HAMSTER_port_b, 'B'],
                                    [Lang.Blocks.HAMSTER_port_ab, 'AB'],
                                ],
                                value: 'A',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_analog_input, '0'],
                                    [Lang.Blocks.HAMSTER_digital_input, '1'],
                                    [Lang.Blocks.HAMSTER_servo_output, '8'],
                                    [Lang.Blocks.HAMSTER_pwm_output, '9'],
                                    [Lang.Blocks.HAMSTER_digital_output, '10'],
                                ],
                                value: '0',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '8'],
                    },
                    {
                        syntax: 'Hamster.set_io_mode_pwm_output(%1)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_port_a, 'A'],
                                    [Lang.Blocks.HAMSTER_port_b, 'B'],
                                    [Lang.Blocks.HAMSTER_port_ab, 'AB'],
                                ],
                                value: 'A',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_analog_input, '0'],
                                    [Lang.Blocks.HAMSTER_digital_input, '1'],
                                    [Lang.Blocks.HAMSTER_servo_output, '8'],
                                    [Lang.Blocks.HAMSTER_pwm_output, '9'],
                                    [Lang.Blocks.HAMSTER_digital_output, '10'],
                                ],
                                value: '0',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '9'],
                    },
                    {
                        syntax: 'Hamster.set_io_mode_digital_output(%1)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_port_a, 'A'],
                                    [Lang.Blocks.HAMSTER_port_b, 'B'],
                                    [Lang.Blocks.HAMSTER_port_ab, 'AB'],
                                ],
                                value: 'A',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_analog_input, '0'],
                                    [Lang.Blocks.HAMSTER_digital_input, '1'],
                                    [Lang.Blocks.HAMSTER_servo_output, '8'],
                                    [Lang.Blocks.HAMSTER_pwm_output, '9'],
                                    [Lang.Blocks.HAMSTER_digital_output, '10'],
                                ],
                                value: '0',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                        params: [null, '10'],
                    },
                ],
            },
        },
        hamster_change_output_by: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.HAMSTER_port_a, 'A'],
                        [Lang.Blocks.HAMSTER_port_b, 'B'],
                        [Lang.Blocks.HAMSTER_port_ab, 'AB'],
                    ],
                    value: 'A',
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
                        type: 'text',
                        params: ['10'],
                    },
                    null,
                ],
                type: 'hamster_change_output_by',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'hamster_port',
            isNotFor: ['hamster'],
            func(sprite, script) {
                const robot = Entry.Hamster.getRobot();
                return robot ? robot.changeOutput(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Hamster.add_output(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_port_a, 'A'],
                                    [Lang.Blocks.HAMSTER_port_b, 'B'],
                                    [Lang.Blocks.HAMSTER_port_ab, 'AB'],
                                ],
                                value: 'A',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
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
        hamster_set_output_to: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.HAMSTER_port_a, 'A'],
                        [Lang.Blocks.HAMSTER_port_b, 'B'],
                        [Lang.Blocks.HAMSTER_port_ab, 'AB'],
                    ],
                    value: 'A',
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
                        type: 'text',
                        params: ['100'],
                    },
                    null,
                ],
                type: 'hamster_set_output_to',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'hamster_port',
            isNotFor: ['hamster'],
            func(sprite, script) {
                const robot = Entry.Hamster.getRobot();
                return robot ? robot.setOutput(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Hamster.set_output(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.HAMSTER_port_a, 'A'],
                                    [Lang.Blocks.HAMSTER_port_b, 'B'],
                                    [Lang.Blocks.HAMSTER_port_ab, 'AB'],
                                ],
                                value: 'A',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
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
        hamster_gripper: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.hamster_open_gripper, 'OPEN'],
                        [Lang.Blocks.hamster_close_gripper, 'CLOSE'],
                    ],
                    value: 'OPEN',
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
                type: 'hamster_gripper',
            },
            paramsKeyMap: {
                ACTION: 0,
            },
            class: 'hamster_port',
            isNotFor: ['hamster'],
            func(sprite, script) {
                const robot = Entry.Hamster.getRobot();
                return robot ? robot.gripper(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Hamster.set_gripper(%1)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    [Lang.Blocks.hamster_open_gripper, 'OPEN'],
                                    [Lang.Blocks.hamster_close_gripper, 'CLOSE'],
                                ],
                                value: 'OPEN',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        hamster_release_gripper: {
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
                params: [null],
                type: 'hamster_release_gripper',
            },
            class: 'hamster_port',
            isNotFor: ['hamster'],
            func(sprite, script) {
                const robot = Entry.Hamster.getRobot();
                return robot ? robot.releaseGripper(script) : script;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Hamster.release_gripper()',
                    },
                ],
            },
        },
    };
};

module.exports = Entry.Hamster;
