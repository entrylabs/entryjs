'use strict';

Entry.NeoCannon = {
    id: '41.2',
    name: 'NeoCannon',
    url: 'https://blog.naver.com/PostView.naver?blogId=neo3ds&logNo=223071491275',
    imageName: 'neo_cannon.png',
    title: {
        ko: '네오캐논',
        en: 'NeoCannon',
    },
    PORT_MAP: {
        mode: 1,
        life: 0,
        tone: 0,
        motorState: 0,
        led: 0,
        shootState: 0,
        d9: 0,
        d10: 0,
        angleState: 0,
    },
    setZero() {
        let portMap = Entry.NeoCannon.PORT_MAP;
        let sq = Entry.hw.sendQueue;
        for (let port in portMap) {
            sq[port] = portMap[port];
        }
        Entry.hw.update();
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
        '4': [39, 78, 156, 310, 622, 1245, 2637, 4978],
        '5': [41, 82, 165, 330, 659, 1319, 2794, 5274],
        '6': [44, 87, 175, 349, 698, 1397, 2849, 5588],
        '7': [46, 92, 185, 370, 740, 1480, 2960, 5920],
        '8': [49, 98, 196, 392, 784, 1568, 3136, 6272],
        '9': [52, 104, 208, 415, 831, 1661, 3322, 6645],
        '10': [55, 110, 220, 440, 880, 1760, 3520, 7040],
        '11': [58, 117, 233, 466, 932, 1865, 3729, 7459],
        '12': [62, 123, 247, 494, 988, 1976, 3951, 7902],
    },
    monitorTemplate: {
        imgPath: 'hw/neo_cannon.png',
        width: 400,
        height: 400,
        listPorts: {
            vibe: {
                name: '진동센서',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
        },
        mode: 'both',
    },
    BlockState: {},
};

Entry.NeoCannon.setLanguage = function() {
    return {
        ko: {
            template: {
                neo_cannon_get_vibe_value: '진동 센서 감지됨',
                neo_cannon_set_tone: '부저를 %1 %2 음으로 %3 초 연주하기 %4',
                neo_cannon_motor_state: '%1 이동하기 %2',
                neo_cannon_motor_state_secs: '%1 %2 초 이동하기 %3',
                neo_cannon_motor_stop: '정지하기 %1',
                neo_cannon_shoot_reload: '%1 초 장전하기 %2',
                neo_cannon_shoot_catch: '장전 풀림 방지 %1',
                neo_cannon_shoot_shooting: '발사하기 %1',
                neo_cannon_angle_state: '각도 %1 %2 초 이동하기 %3',
                neo_cannon_rgb_led_select_state: '%1 %2 %3',
                neo_cannon_rgb_led_select_pwm: '%1 %2 세기로 켜기 %3',
                neo_cannon_rgb_led_color_picker: 'RGB LED %1 %2',
                neo_cannon_rgb_led_pwm: 'RGB LED 빨강 %1 초록 %2 파랑 %3 %4',
                neo_cannon_rgb_led_off: 'RGB LED 끄기 %1',
            },

            Helper: {
                neo_cannon_get_vibe_value:
                    '진동 감지 여부를 가져옵니다.<br/><font color="crimson">센서값 0: `감지 못함`, 1: `감지됨`</font>',
                neo_cannon_set_tone:
                    '부저를 통해 선택한 옥타브 음계를 통해 해당 시간만큼 소리를 냅니다.<br/><font color="crimson">(참고, 다음 블럭이 있을경우에 부저 연주시간이 끝난 후에 다음 블럭을 실행합니다.)</font>',
                neo_cannon_motor_state: '네오캐논을 앞, 왼쪽, 오른쪽, 뒤로 이동시킬 수 있습니다.',
                neo_cannon_motor_state_secs:
                    '네오캐논을 앞, 왼쪽, 오른쪽, 뒤로 정해진 시간(초)만큼 이동시킬 수 있습니다.',
                neo_cannon_motor_stop: '네오캐논 이동을 정지합니다.',
                neo_cannon_shoot_reload: '장전 모터를 정해진 시간(초)만큼 장전합니다.',
                neo_cannon_shoot_catch:
                    '장전 모터가 풀리는 것을 방지해주기 위해 일정 세기로 잡아줍니다.',
                neo_cannon_shoot_shooting: '장전 모터를 풀어서 발사합니다.',
                neo_cannon_angle_state:
                    '각도 모터를 제어하여 위, 아래로 정해진 시간(초)만큼 이동합니다.',
                neo_cannon_rgb_led_select_state:
                    'RGB LED 중 빨강, 초록, 파랑을 선택하여 ON/OFF를 제어합니다.<br/><font color="crimson">(주의, LED모드로 진행해주세요.)</font>',
                neo_cannon_rgb_led_select_pwm:
                    'RGB LED 중 빨강, 초록, 파랑을 선택하여 세기값(0~255)을 주어 원하는 색상을 나타낼 수 있습니다.<br/><font color="crimson">(주의, LED모드로 진행해주세요.)</font>',
                neo_cannon_rgb_led_color_picker:
                    'RGB LED를 색을 선택하여 원하는 색상을 나타낼 수 있습니다.<br/><font color="crimson">(주의, LED모드로 진행해주세요.)</font>',
                neo_cannon_rgb_led_pwm:
                    'RGB LED에 세기값(0~255)을 주어 원하는 색상을 나타낼 수 있습니다.<br/><font color="crimson">(주의, LED모드로 진행해주세요.)</font>',
                neo_cannon_rgb_led_off: 'RGB LED를 끌 수 있습니다.',
            },
        },
        en: {
            template: {
                neo_cannon_get_vibe_value: 'Detected Vibe Sensor',
                neo_cannon_set_tone: 'Play tone note %1 octave %2 beat %3 %4',
                neo_cannon_motor_state: 'Move %1 %2',
                neo_cannon_motor_state_secs: 'Move %1 %2 secs %3',
                neo_cannon_motor_stop: 'Move Stop %1',
                neo_cannon_shoot_reload: 'Reload %1 secs %2',
                neo_cannon_shoot_catch: 'Anti-shoot %1',
                neo_cannon_shoot_shooting: 'Shoot %1',
                neo_cannon_angle_state: 'Move Angle %1 %2 secs %3',
                neo_cannon_rgb_led_select_state: '%1 color %2 %3',
                neo_cannon_rgb_led_select_pwm: '%1 color %2 turn on pwm %3',
                neo_cannon_rgb_led_color_picker: 'RGB LED %1 %2',
                neo_cannon_rgb_led_pwm: 'RGB LED R %1 G %2 B %3 %4',
                neo_cannon_rgb_led_off: 'RGB LED OFF',
            },
        },
    };
};

Entry.NeoCannon.blockMenuBlocks = [
    'neo_cannon_get_vibe_value',
    'neo_cannon_set_tone',
    'neo_cannon_motor_state',
    'neo_cannon_motor_state_secs',
    'neo_cannon_motor_stop',
    'neo_cannon_shoot_reload',
    'neo_cannon_shoot_catch',
    'neo_cannon_shoot_shooting',
    'neo_cannon_angle_state',
    'neo_cannon_rgb_led_select_state',
    'neo_cannon_rgb_led_select_pwm',
    'neo_cannon_rgb_led_color_picker',
    'neo_cannon_rgb_led_pwm',
    'neo_cannon_rgb_led_off',
];

Entry.NeoCannon.getBlocks = function() {
    return {
        neo_cannon_get_vibe_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            params: [],
            events: {},
            def: {
                params: [],
                type: 'neo_cannon_get_vibe_value',
            },
            paramsKeyMap: {},
            class: 'NeoCannonGet',
            isNotFor: ['NeoCannon'],
            func(sprite, script) {
                let port = 'vibe'

                return Entry.hw.portData[port] || 0;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'NeoCannon.getVibe()',
                        blockType: 'param',
                        textParams: [],
                    },
                ],
            },
        },
        neo_cannon_tone_list: {
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
                        keyOption: 'neo_cannon_tone_list',
                    },
                ],
            },
        },
        neo_cannon_tone_value: {
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
                        type: 'neo_cannon_tone_list',
                    },
                ],
                type: 'neo_cannon_tone_value',
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
                        keyOption: 'neo_cannon_tone_value',
                    },
                ],
            },
        },
        neo_cannon_octave_list: {
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
                        keyOption: 'neo_cannon_octave_list',
                    },
                ],
            },
        },
        neo_cannon_set_tone: {
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
                        type: 'neo_cannon_tone_list',
                    },
                    {
                        type: 'neo_cannon_octave_list',
                    },
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'neo_cannon_set_tone',
            },
            paramsKeyMap: {
                NOTE: 0,
                OCTAVE: 1,
                DURATION: 2,
            },
            class: 'NeoCannon',
            isNotFor: ['NeoCannon'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;

                if (!script.isStart) {
                    let note = script.getValue('NOTE', script);
                    if (!Entry.Utils.isNumber(note)) {
                        note = Entry.NeoCannon.toneTable[note];
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

                    if (!sq.tone) {
                        sq.tone = {};
                    }

                    if (duration === 0) {
                        sq.tone = {
                            type: Entry.NeoCannon.PORT_MAP.tone,
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
                        value = Entry.NeoCannon.toneMap[note][octave];
                    }

                    duration = duration * 1000;
                    script.isStart = true;
                    script.timeFlag = 1;

                    sq.tone = {
                        type: Entry.NeoCannon.PORT_MAP.tone,
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
                    sq.tone = {
                        type: Entry.NeoCannon.PORT_MAP.tone,
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
                        syntax: 'NeoCannon.tone(%1, %2, %3)',
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
        neo_cannon_motor_state: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['앞으로', 1],
                        ['왼쪽으로', 2],
                        ['오른쪽으로', 3],
                        ['뒤로', 4],
                    ],
                    value: 1,
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
                params: [null],
                type: 'neo_cannon_motor_state',
            },
            paramsKeyMap: {
                STATE: 0,
            },
            class: 'NeoCannon',
            isNotFor: ['NeoCannon'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                let state = script.getNumberValue('STATE', script);

                if (!sq.motorState) {
                    sq.motorState = {};
                }

                sq.motorState = state;

                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'NeoCannon.motorState(%1)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['앞으로', '1'],
                                    ['왼쪽으로', '2'],
                                    ['오른쪽으로', '3'],
                                    ['뒤로', '4'],
                                ],
                                value: '1',
                                fontSize: 11,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValueUpperCase,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            },
                        ],
                    },
                ],
            },
        },
        neo_cannon_motor_state_secs: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['앞으로', 1],
                        ['왼쪽으로', 2],
                        ['오른쪽으로', 3],
                        ['뒤로', 4],
                    ],
                    value: 1,
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
                        type: 'text',
                        params: ['1'],
                    },
                ],
                type: 'neo_cannon_motor_state_secs',
            },
            paramsKeyMap: {
                STATE: 0,
                DURATION: 1,
            },
            class: 'NeoCannon',
            isNotFor: ['NeoCannon'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;

                if (!script.isStart) {
                    let state = script.getNumberValue('STATE', script);
                    let duration = script.getNumberValue('DURATION', script);

                    if (duration <= 0) {
                        duration = 0;
                        state = 0;
                    }

                    duration = duration * 1000;
                    script.isStart = true;
                    script.timeFlag = 1;

                    if (!sq.motorState) {
                        sq.motorState = {};
                    }

                    sq.motorState = state;

                    setTimeout(() => {
                        script.timeFlag = 0;
                    }, duration + 32);

                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    sq.motorState = 0;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'NeoCannon.motorStateSecs(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['앞으로', '1'],
                                    ['왼쪽으로', '2'],
                                    ['오른쪽으로', '3'],
                                    ['뒤로', '4'],
                                ],
                                value: '1',
                                fontSize: 11,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValueUpperCase,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
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
        neo_cannon_motor_stop: {
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
                type: 'neo_cannon_motor_stop',
            },
            paramsKeyMap: {},
            class: 'NeoCannon',
            isNotFor: ['NeoCannon'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                if (!sq.motorState) {
                    sq.motorState = {};
                }
                sq.motorState = 0;
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'NeoCannon.motorStop()',
                        textParams: [],
                    },
                ],
            },
        },
        neo_cannon_shoot_reload: {
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
                        type: 'text',
                        params: ['1'],
                    },
                ],
                type: 'neo_cannon_shoot_reload',
            },
            paramsKeyMap: {
                DURATION: 0,
            },
            class: 'NeoCannon',
            isNotFor: ['NeoCannon'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;

                if (!script.isStart) {
                    let duration = script.getNumberValue('DURATION', script);

                    if (duration <= 0) {
                        duration = 0;
                        state = 0;
                    }

                    duration = duration * 1000;
                    script.isStart = true;
                    script.timeFlag = 1;

                    if (!sq.shootState) {
                        sq.shootState = {};
                    }
                    if (!sq.d9) {
                        sq.d9 = {};
                    }
                    if (!sq.d10) {
                        sq.d10 = {};
                    }

                    sq.shootState = 1;
                    sq.d9 = 200;
                    sq.d10 = 0;

                    setTimeout(() => {
                        script.timeFlag = 0;
                    }, duration + 32);

                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    sq.shootState = 0;
                    sq.d9 = 0;
                    sq.d10 = 0;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'NeoCannon.reload(%1)',
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
        neo_cannon_shoot_catch: {
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
                type: 'neo_cannon_shoot_catch',
            },
            paramsKeyMap: {},
            class: 'NeoCannon',
            isNotFor: ['NeoCannon'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                if (!sq.shootState) {
                    sq.shootState = {};
                }
                if (!sq.d9) {
                    sq.d9 = {};
                }
                if (!sq.d10) {
                    sq.d10 = {};
                }
                sq.shootState = 3;
                sq.d9 = 80;
                sq.d10 = 0;
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'NeoCannon.shootCatch()',
                        textParams: [],
                    },
                ],
            },
        },
        neo_cannon_shoot_shooting: {
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
                type: 'neo_cannon_shoot_shooting',
            },
            paramsKeyMap: {},
            class: 'NeoCannon',
            isNotFor: ['NeoCannon'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;

                if (!script.isStart) {
                    let duration = 40;
                    script.isStart = true;
                    script.timeFlag = 1;

                    if (!sq.shootState) {
                        sq.shootState = {};
                    }
                    if (!sq.d9) {
                        sq.d9 = {};
                    }
                    if (!sq.d10) {
                        sq.d10 = {};
                    }

                    sq.shootState = 2;
                    sq.d9 = 0;
                    sq.d10 = 200;

                    setTimeout(() => {
                        script.timeFlag = 0;
                    }, duration + 32);

                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    sq.shootState = 0;
                    sq.d9 = 0;
                    sq.d10 = 0;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'NeoCannon.shooting()',
                        textParams: [],
                    },
                ],
            },
        },
        neo_cannon_angle_state: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['UP', '1'],
                        ['DOWN', '2'],
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
                        type: 'text',
                        params: ['0.1'],
                    },
                ],
                type: 'neo_cannon_angle_state',
            },
            paramsKeyMap: {
                STATE: 0,
                DURATION: 1,
            },
            class: 'NeoCannon',
            isNotFor: ['NeoCannon'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                if (!script.isStart) {
                    let state = script.getNumberValue('STATE', script);
                    let duration = script.getNumberValue('DURATION', script);

                    if (duration <= 0) {
                        duration = 0;
                        state = 0;
                    }

                    duration = duration * 1000;
                    script.isStart = true;
                    script.timeFlag = 1;

                    if (!sq.angleState) {
                        sq.angleState = {};
                    }

                    sq.angleState = state;

                    setTimeout(() => {
                        script.timeFlag = 0;
                    }, duration + 32);

                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    sq.angleState = 0;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'NeoCannon.angleState(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['UP', '1'],
                                    ['DOWN', '2'],
                                ],
                                value: '1',
                                fontSize: 11,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValueLowerCase,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
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
        neo_cannon_rgb_led_select_state: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['BLUE', '0'],
                        ['RED', '1'],
                        ['GREEN', '2'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['OFF', '0'],
                        ['ON', '1'],
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
                params: [null, null],
                type: 'neo_cannon_rgb_led_select_state',
            },
            paramsKeyMap: {
                COLOR: 0,
                STATE: 1,
            },
            class: 'NeoCannonRGB',
            isNotFor: ['NeoCannon'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                let color = script.getNumberValue('COLOR', script);
                let state = script.getNumberValue('STATE', script);

                let power = state == 1 ? 255 : 0;

                if (color == 0) {
                    if (!sq.led) {
                        sq.led = {};
                    }
                    sq.led = power;
                } else if (color == 1) {
                    if (!sq.shootState) {
                        sq.shootState = {};
                    }
                    if (!sq.d9) {
                        sq.d9 = {};
                    }
                    sq.shootState = 4;
                    sq.d9 = power;
                } else if (color == 2) {
                    if (!sq.shootState) {
                        sq.shootState = {};
                    }
                    if (!sq.d10) {
                        sq.d10 = {};
                    }
                    sq.shootState = 4;
                    sq.d10 = power;
                }

                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'NeoCannon.rgbLedSelectState(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['BLUE', '0'],
                                    ['RED', '1'],
                                    ['GREEN', '2'],
                                ],
                                value: '0',
                                fontSize: 11,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValueUpperCase,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    ['ON', '1'],
                                    ['OFF', '0'],
                                ],
                                value: '1',
                                fontSize: 11,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValueUpperCase,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            },
                        ],
                    },
                ],
            },
        },
        neo_cannon_rgb_led_select_pwm: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['BLUE', '0'],
                        ['RED', '1'],
                        ['GREEN', '2'],
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
                params: [null, null],
                type: 'neo_cannon_rgb_led_select_pwm',
            },
            paramsKeyMap: {
                COLOR: 0,
                POWER: 1,
            },
            class: 'NeoCannonRGB',
            isNotFor: ['NeoCannon'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                let color = script.getNumberValue('COLOR', script);
                let power = script.getNumberValue('POWER', script);

                if (color == 0) {
                    if (!sq.led) {
                        sq.led = {};
                    }
                    sq.led = power;
                } else if (color == 1) {
                    if (!sq.shootState) {
                        sq.shootState = {};
                    }
                    if (!sq.d9) {
                        sq.d9 = {};
                    }
                    sq.shootState = 4;
                    sq.d9 = power;
                } else if (color == 2) {
                    if (!sq.shootState) {
                        sq.shootState = {};
                    }
                    if (!sq.d10) {
                        sq.d10 = {};
                    }
                    sq.shootState = 4;
                    sq.d10 = power;
                }

                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'NeoCannon.rgbLedSelectPwm(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['BLUE', '0'],
                                    ['RED', '1'],
                                    ['GREEN', '2'],
                                ],
                                value: '0',
                                fontSize: 11,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValueUpperCase,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
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
        neo_cannon_rgb_led_color_picker: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
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
                params: ["#0000FF", null],
                type: 'neo_cannon_rgb_led_color_picker',
            },
            paramsKeyMap: {
                COLOR: 0,
            },
            class: 'NeoCannonRGB',
            isNotFor: ['NeoCannon'],
            func: function(sprite, script) {
                const sq = Entry.hw.sendQueue;

                let value = script.getStringField('COLOR');

                if (!sq.shootState) {
                    sq.shootState = {};
                }

                if (!sq.led) {
                    sq.led = {};
                }
                if (!sq.d9) {
                    sq.d9 = {};
                }
                if (!sq.d10) {
                    sq.d10 = {};
                }

                let red = parseInt(value.substr(1, 2), 16);
                let green = parseInt(value.substr(3, 2), 16);
                let blue = parseInt(value.substr(5, 2), 16);

                sq.shootState = 4;
                sq.led = blue;
                sq.d9 = red;
                sq.d10 = green;

                Entry.hw.update();

                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'NeoCannon.rgbLedColorPicker(%1)',
                        textParams: [
                            {
                                type: 'Color',
                                converter: Entry.block.converters.returnStringValue,
                            },
                        ],
                    },
                ],
            },
        },
        neo_cannon_rgb_led_pwm: {
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
                type: 'neo_cannon_rgb_led_pwm',
            },
            paramsKeyMap: {
                RED: 0,
                GREEN: 1,
                BLUE: 2,
            },
            class: 'NeoCannonRGB',
            isNotFor: ['NeoCannon'],
            func: function(sprite, script) {
                const sq = Entry.hw.sendQueue;

                let red = script.getNumberValue('RED', script);
                let green = script.getNumberValue('GREEN', script);
                let blue = script.getNumberValue('BLUE', script);

                if (!sq.shootState) {
                    sq.shootState = {};
                }

                if (!sq.led) {
                    sq.led = {};
                }
                if (!sq.d9) {
                    sq.d9 = {};
                }
                if (!sq.d10) {
                    sq.d10 = {};
                }

                sq.shootState = 4;
                sq.led = blue & 255;
                sq.d9 = red & 255;
                sq.d10 = green & 255;

                Entry.hw.update();
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'NeoCannon.rgbLedPwm(%1, %2, %3)',
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
        neo_cannon_rgb_led_off: {
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
                type: 'neo_cannon_rgb_led_off',
            },
            paramsKeyMap: {},
            class: 'NeoCannonRGB',
            isNotFor: ['NeoCannon'],
            func: function(sprite, script) {
                const sq = Entry.hw.sendQueue;

                if (!sq.shootState) {
                    sq.shootState = {};
                }

                if (!sq.led) {
                    sq.led = {};
                }
                if (!sq.d9) {
                    sq.d9 = {};
                }
                if (!sq.d10) {
                    sq.d10 = {};
                }

                sq.shootState = 4;
                sq.led = 0;
                sq.d9 = 0;
                sq.d10 = 0;

                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'NeoCannon.rgbLedOff()',
                        textParams: [],
                    },
                ],
            },
        },
    };
};

module.exports = Entry.NeoCannon;
