'use strict';

Entry.NeoSpider = {
    id: '41.1',
    name: 'NeoSpider',
    url: 'http://www.neo3ds.com/',
    imageName: 'neo_spider.png',
    title: {
        ko: '네오스파이더',
        en: 'NeoSpider',
    },
    PORT_MAP: {
        tone: 0,
        motorState: 0,
        servoAngle: 0,
        ultrasonic: 0,
        motion: 0,
        neopixel: 0,
        outerLeftMotor: 0,
        outerRightMotor: 0,
    },
    setZero() {
        let portMap = Entry.NeoSpider.PORT_MAP;
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
        '4': [39, 78, 156, 310, 622, 1245, 2849, 4978],
        '5': [41, 82, 165, 330, 659, 1319, 2637, 5274],
        '6': [44, 87, 175, 349, 698, 1397, 2794, 5588],
        '7': [46, 92, 185, 370, 740, 1480, 2960, 5920],
        '8': [49, 98, 196, 392, 784, 1568, 3136, 6272],
        '9': [52, 104, 208, 415, 831, 1661, 3322, 6645],
        '10': [55, 110, 220, 440, 880, 1760, 3520, 7040],
        '11': [58, 117, 233, 466, 932, 1865, 3729, 7459],
        '12': [62, 123, 247, 494, 988, 1976, 3951, 7902],
    },
    monitorTemplate: {
        imgPath: 'hw/neo_spider.png',
        width: 256,
        height: 256,
        listPorts: {
            gas: {
                name: '가스/외부센서',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            cds: {
                name: '조도센서',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            tmp: {
                name: '온도센서',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            vibe: {
                name: '진동센서',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            left_infared: {
                name: '적외선(좌)',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            right_infared: {
                name: '적외선(우)',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            ultrasonic: {
                name: '초음파센서',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            motion: {
                name: '모션센서',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
        },
        mode: 'both',
    },
    BlockState: {},
};

Entry.NeoSpider.setLanguage = function () {
    return {
        ko: {
            template: {
                neo_spider_get_analog_value: '아날로그 %1 센서값',
                neo_spider_get_analog_value_map: '아날로그 %1 센서값의 범위를 %2 ~ %3 에서 %4 ~ %5 로 바꾼값',
                neo_spider_get_ultrasonic_value: '초음파 센서값',
                neo_spider_get_motion_value: '모션 센서값',
                neo_spider_get_infared_value: '적외선센서 %1 감지됨',
                neo_spider_set_tone: '버저를 %1 %2 음으로 %3 초 연주하기 %4',
                neo_spider_set_servo: '머리방향 %1 의 각도로 정하기 (최소:50, 최대:130) %2',
                neo_spider_set_servo_direction: '머리방향 %1 바라보기 %2',
                neo_spider_motor_state: '네오스파이더 %1 이동하기 %2',
                neo_spider_motor_state_secs: '네오스파이더 %1(으)로 %2초 이동하기 %3',
                neo_spider_motor_stop: '네오스파이더 정지하기 %1',
                neo_spider_neopixel_color_picker: 'RGB LED %1번  %2 (으)로 켜기 %3',
                neo_spider_neopixel: 'RGB LED %1번  빨 %2 녹 %3 파 %4 (으)로 켜기 %5',
                neo_spider_neopixel_color_picker_all_on: 'RGB LED 전체 %1 (으)로 켜기 %2',
                neo_spider_neopixel_all_on: 'RGB LED 전체  빨 %1 녹 %2 파 %3 (으)로 켜기 %4',
                neo_spider_neopixel_all_off: 'RGB LED 전체 끄기 %1',
                neo_spider_outer_motor: '디지털 %1핀 %2 %3',
                neo_spider_outer_motor_pwm: '디지털 %1핀 %2 (으)로 정하기 %3',
            },

            Helper: {
                neo_spider_get_analog_value: '아날로그 센서값을 읽어오는 블럭입니다.<br/>가스, 조도, 진동, 외부 센서는 `0~1023`의 값 가지며, 온도센서는 온도값을 읽어옵니다.<br/><font color="crimson">(단, 가스센서와 외부센서는 동시에 사용할 수 없습니다.)</font>',
                neo_spider_get_analog_value_map: '아날로그 센서값의 범위를 다른 범위로 변환합니다.',
                neo_spider_get_ultrasonic_value: '초음파를 통해 거리를 측정합니다.<br/><font color="crimson">(참고, HC-SR04의 경우 약 0~2cm정도 측정을 못하고 너무 가까우면 이상한 값을 나타냅니다.)</font>',
                neo_spider_get_motion_value: '모션 센서의 값을 가져옵니다.<br/>해당 센서값은 0: `감지 못함`, 1: `감지됨`입니다.<br/><font color="crimson">(참고, 해당 센서의 경우 길게는 약 7초 정도 감지된 값을 유지합니다.)</font>',
                neo_spider_get_infared_value: '적외선 센서의 값을 가져옵니다.<br/>왼쪽과 오른쪽 2가지로 나뉘어 있으며, 센서값은 0: `감지 못함`, 1: `감지됨`입니다.',
                neo_spider_set_tone: '부저를 통해 선택한 옥타브 음계를 통해 해당 시간만큼 소리를 냅니다.<br/><font color="crimson">(참고, 다음 블럭이 있을경우에 부저 연주시간이 끝난 후에 다음 블럭을 실행합니다.)</font>',
                neo_spider_set_servo: '머리각도를 최소 50 ~ 최대 130도 사이의 값으로 움직입니다.',
                neo_spider_set_servo_direction: '머리각도를 왼쪽(50), 정면(90), 오른쪽(130)으로 이동할 수 있습니다.',
                neo_spider_motor_state: '네오스파이더를 전진, 좌회전, 우회전, 후진을 실행합니다.',
                neo_spider_motor_state_secs: '네오스파이더를 전진, 좌회전, 우회전, 후진을 정해진 시간만큼 실행합니다.',
                neo_spider_motor_stop: '네오스파이더 이동을 정지',
                neo_spider_neopixel_color_picker: '색을 보고 RGB색상을 정하여 정해진 LED를 켤 수 있습니다.<br/><font color="crimson">(참고, LED번호는 0번부터 7번까지 입니다.)</font>',
                neo_spider_neopixel: '정해준 LED 번호에 빨강, 파랑, 초록의 색을 넣고 조합하여 LED를 켤 수 있습니다.<br/><font color="crimson">(참고, LED번호는 0번부터 7번까지 입니다.)</font>',
                neo_spider_neopixel_color_picker_all_on: '색을 보고 RGB색상을 정하여 모든 LED를 켤 수 있습니다.',
                neo_spider_neopixel_all_on: '빨강, 파랑, 초록의 색을 넣고 조합하여 모든 LED를 켤 수 있습니다.',
                neo_spider_neopixel_all_off: '모든 LED를 끌 수 있습니다.',
                neo_spider_outer_motor: '외부 모듈을 통하여 D5, D6번을 제어할 수 있습니다.<font color="crimson">(단, 동시에 HIGH를 주어 작동 시킬 수 없습니다.)</font>',
                neo_spider_outer_motor_pwm: '외부 모듈을 통하여 D5, D6번을 제어할 수 있습니다.<font color="crimson">(단, 동시에 0 이상의 값을 주어 작동 시킬 수 없습니다.)</font>',
            },
        },
        en: {
            template: {
                neo_spider_get_analog_value: 'Analog %1 pin Sensor value',
                neo_spider_get_analog_value_map: 'Analog %1 value Map range %2 ~ %3 to %4 ~ %5',
                neo_spider_get_ultrasonic_value: 'Ultrasonic Sensor value',
                neo_spider_get_motion_value: 'Motion Sensor value',
                neo_spider_get_infared_value: 'Infared ray %1 Sensor value',
                neo_spider_set_tone: 'Play tone note %1 octave %2 beat %3 %4',
                neo_spider_set_servo: 'Set head direction as %1 (min:50, max:130) %2',
                neo_spider_set_servo_direction: 'Set head direction as %1 %2',
                neo_spider_motor_state: 'Move neospider %1 %2',
                neo_spider_motor_state_secs: 'Move neospider %1 %2 secs %3',
                neo_spider_motor_stop: 'Neospider stop %1',
                neo_spider_neopixel_color_picker: 'RGB LED number %1 turn on %2 %3',
                neo_spider_neopixel: 'RGB LED number %1 turn on R %2 G %3 B %4 %5',
                neo_spider_neopixel_color_picker_all_on: 'All RGB LED turn on %1 %2',
                neo_spider_neopixel_all_on: 'All RGB LED turn on R %1 G %2 B %3 %4',
                neo_spider_neopixel_all_off: 'All RGB LED turn off %1',
                neo_spider_outer_motor: 'Digital %1 pin %2 %3',
                neo_spider_outer_motor_pwm: 'Digital %1 pin %2 %3',
            },
        },
    };
};


Entry.NeoSpider.blockMenuBlocks = [
    'neo_spider_get_analog_value',
    'neo_spider_get_analog_value_map',
    'neo_spider_get_ultrasonic_value',
    'neo_spider_get_motion_value',
    'neo_spider_get_infared_value',
    'neo_spider_set_servo',
    'neo_spider_set_servo_direction',
    'neo_spider_set_tone',
    'neo_spider_motor_state',
    'neo_spider_motor_state_secs',
    'neo_spider_motor_stop',
    'neo_spider_neopixel_color_picker',
    'neo_spider_neopixel_color_picker_all_on',
    'neo_spider_neopixel',
    'neo_spider_neopixel_all_on',
    'neo_spider_neopixel_all_off',
    'neo_spider_outer_motor',
    'neo_spider_outer_motor_pwm',
];

Entry.NeoSpider.getBlocks = function () {
    return {
        neo_spider_get_analog_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['가스', 'gas'],
                        ['조도', 'cds'],
                        ['온도', 'tmp'],
                        ['진동', 'vibe'],
                        ['외부', 'gas'],
                    ],
                    value: 'gas',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null,],
                type: 'neo_spider_get_analog_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'NeoSpiderGet',
            isNotFor: ['NeoSpider'],
            func(sprite, script) {
                const pd = Entry.hw.portData;
                const port = script.getValue('PORT', script);
                return pd[port];
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'NeoSpider.analogRead(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['가스', 'gas'],
                                    ['조도', 'cds'],
                                    ['온도', 'tmp'],
                                    ['진동', 'vibe'],
                                    ['외부', 'gas'],
                                ],
                                value: 'gas',
                                fontSize: 11,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValueLowerCase,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            },
                        ],
                    },
                ],
            },
        },
        neo_spider_get_analog_value_map: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['가스', 'gas'],
                        ['조도', 'cds'],
                        ['온도', 'tmp'],
                        ['진동', 'vibe'],
                        ['외부', 'gas'],
                    ],
                    value: 'gas',
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
                    null,
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
                type: 'neo_spider_get_analog_value_map',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE2: 1,
                VALUE3: 2,
                VALUE4: 3,
                VALUE5: 4,
            },
            class: 'NeoSpiderGet',
            isNotFor: ['NeoSpider'],
            func(sprite, script) {
                const port = script.getValue('PORT', script);
                const pd = Entry.hw.portData;
                let result = pd[port];
                let value2 = script.getNumberValue('VALUE2', script);
                let value3 = script.getNumberValue('VALUE3', script);
                let value4 = script.getNumberValue('VALUE4', script);
                let value5 = script.getNumberValue('VALUE5', script);

                result = ((result - value2) * (value5 - value4) / value3 - value2) + value4;

                if ((result % 1) == 0) {
                    result = Math.round(result);
                } else {
                    result = Math.round(result * 100) / 100;
                }

                return result;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'NeoSpider.mapAnalog(%1, %2, %3, %4, %5)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['가스', 'gas'],
                                    ['조도', 'cds'],
                                    ['온도', 'tmp'],
                                    ['진동', 'vibe'],
                                    ['외부', 'gas'],
                                ],
                                value: 'gas',
                                fontSize: 11,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValueLowerCase,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
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
        neo_spider_get_ultrasonic_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [],
                type: 'neo_spider_get_ultrasonic_value',
            },
            paramsKeyMap: {},
            class: 'NeoSpiderGet',
            isNotFor: ['NeoSpider'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;

                if (!sq.ultrasonic) {
                    sq.ultrasonic = {};
                }

                sq.ultrasonic = 1;

                return Entry.hw.portData.ultrasonic || 0;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'NeoSpider.getUltrasonic()',
                        blockType: 'param',
                        textParams: [],
                    },
                ],
            },
        },
        neo_spider_get_motion_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            params: [],
            events: {},
            def: {
                params: [],
                type: 'neo_spider_get_motion_value',
            },
            paramsKeyMap: {},
            class: 'NeoSpiderGet',
            isNotFor: ['NeoSpider'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;

                if (!sq.motion) {
                    sq.motion = {};
                }

                sq.motion = 1;

                return Entry.hw.portData.motion || 0;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'NeoSpider.getMotionValue()',
                        blockType: 'param',
                        textParams: [],
                    },
                ],
            },
        },
        neo_spider_get_infared_value : {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['왼쪽', 'left_infared'],
                        ['오른쪽', 'right_infared'],
                    ],
                    value: 'left_infared',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null,],
                type: 'neo_spider_get_infared_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'NeoSpiderGet',
            isNotFor: ['NeoSpider'],
            func(sprite, script) {
                let port = script.getValue('PORT', script);

                return Entry.hw.portData[port] || 0;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'NeoSpider.getInfaredValue(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['왼쪽', 'left_infared'],
                                    ['오른쪽', 'right_infared'],
                                ],
                                value: 'left_infared',
                                fontSize: 11,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                converter: Entry.block.converters.returnStringValueLowerCase,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            },
                        ],
                    },
                ],
            },
        },
        neo_spider_tone_list: {
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
                        keyOption: 'neo_spider_tone_list',
                    },
                ],
            },
        },
        neo_spider_tone_value: {
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
                        type: 'neo_spider_tone_list',
                    },
                ],
                type: 'neo_spider_tone_value',
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
                        keyOption: 'neo_spider_tone_value',
                    },
                ],
            },
        },
        neo_spider_octave_list: {
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
                        keyOption: 'neo_spider_octave_list',
                    },
                ],
            },
        },
        neo_spider_set_tone: {
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
                        type: 'neo_spider_tone_list',
                    },
                    {
                        type: 'neo_spider_octave_list',
                    },
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'neo_spider_set_tone',
            },
            paramsKeyMap: {
                NOTE: 0,
                OCTAVE: 1,
                DURATION: 2,
            },
            class: 'NeoSpider',
            isNotFor: ['NeoSpider'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;

                if (!script.isStart) {
                    let note = script.getValue('NOTE', script);
                    if (!Entry.Utils.isNumber(note)) {
                        note = Entry.NeoSpider.toneTable[note];
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
                            type: Entry.NeoSpider.PORT_MAP.tone,
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
                        value = Entry.NeoSpider.toneMap[note][octave];
                    }

                    duration = duration * 1000;
                    script.isStart = true;
                    script.timeFlag = 1;

                    sq.tone = {
                        type: Entry.NeoSpider.PORT_MAP.tone,
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
                        type: Entry.NeoSpider.PORT_MAP.tone,
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
                        syntax: 'NeoSpider.tone(%1, %2, %3)',
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
        neo_spider_set_servo: {
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
                    90,
                ],
                type: 'neo_spider_set_servo',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'NeoSpider',
            isNotFor: ['NeoSpider'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                let value = script.getNumberValue('VALUE', script);
                value = Math.min(130, value);
                value = Math.max(50, value);

                sq.servoAngle = value;

                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'NeoSpider.servomotorWrite(%1)',
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
        neo_spider_set_servo_direction: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['앞', '90'],
                        ['왼쪽', '50'],
                        ['오른쪽', '130'],
                    ],
                    value: '90',
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
                type: 'neo_spider_set_servo_direction',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'NeoSpider',
            isNotFor: ['NeoSpider'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                let value = script.getNumberValue('VALUE', script);
                value = Math.min(130, value);
                value = Math.max(50, value);

                sq.servoAngle = value;

                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'NeoSpider.servomotorWrite(%1)',
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
        neo_spider_motor_state: {
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
                params: [
                    null,
                ],
                type: 'neo_spider_motor_state',
            },
            paramsKeyMap: {
                STATE: 0,
            },
            class: 'NeoSpider',
            isNotFor: ['NeoSpider'],
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
                        syntax: 'NeoSpider.motorState(%1)',
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
        neo_spider_motor_state_secs: {
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
                type: 'neo_spider_motor_state_secs',
            },
            paramsKeyMap: {
                STATE: 0,
                DURATION: 1,
            },
            class: 'NeoSpider',
            isNotFor: ['NeoSpider'],
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

                    setTimeout(() =>  {
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
                        syntax: 'NeoSpider.motorStateSecs(%1, %2)',
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
        neo_spider_motor_stop: {
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
                type: 'neo_spider_motor_stop',
            },
            paramsKeyMap: {},
            class: 'NeoSpider',
            isNotFor: ['NeoSpider'],
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
                        syntax: 'NeoSpider.motorStop()',
                        textParams: [],
                    },
                ],
            },
        },
        neo_spider_neopixel: {
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
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['100'],
                    },
                    {
                        type: 'number',
                        params: ['100'],
                    },
                    {
                        type: 'number',
                        params: ['100'],
                    },
                    null,
                ],
                type: 'neo_spider_neopixel',
            },
            paramsKeyMap: {
                NUM: 0,
                RED: 1,
                GREEN: 2,
                BLUE: 3,
            },
            class: 'NeoSpider',
            isNotFor: ['NeoSpider'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;
                let num = script.getNumberValue('NUM', script);
                let numStr = '';
                switch (num) {
                    case 0: {
                        numStr = 'first';
                        break;
                    }
                    case 1: {
                        numStr = 'second';
                        break;
                    }
                    case 2: {
                        numStr = 'third';
                        break;
                    }
                    case 3: {
                        numStr = 'fourth';
                        break;
                    }
                    case 4: {
                        numStr = 'fifth';
                        break;
                    }
                    case 5: {
                        numStr = 'sixth';
                        break;
                    }
                    case 6: {
                        numStr = 'seventh';
                        break;
                    }
                    case 7: {
                        numStr = 'eighth';
                        break;
                    }
                }

                let red = script.getNumberValue('RED', script);
                let green = script.getNumberValue('GREEN', script);
                let blue = script.getNumberValue('BLUE', script);

                if (!sq.neopixel) {
                    sq.neopixel = {};
                }

                if (numStr) {
                    sq.neopixel = {
                        type: Entry.NeoSpider.PORT_MAP.neopixel,
                        data: {
                            numStr,
                            red,
                            green,
                            blue
                        },
                        time: new Date().getTime(),
                    };
    
                    Entry.hw.update();
                }

                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'NeoSpider.neopixel(%1, %2, %3, %4)',
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
        neo_spider_neopixel_color_picker: {
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
                        type: 'number',
                        params: ['0'],
                    },
                    null,
                    null,
                ],
                type: 'neo_spider_neopixel_color_picker',
            },
            paramsKeyMap: {
                NUM: 0,
                COLOR: 1,
            },
            class: 'NeoSpider',
            isNotFor: ['NeoSpider'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;
                let num = script.getNumberValue('NUM', script);
                let numStr = '';
                switch (num) {
                    case 0: {
                        numStr = 'first';
                        break;
                    }
                    case 1: {
                        numStr = 'second';
                        break;
                    }
                    case 2: {
                        numStr = 'third';
                        break;
                    }
                    case 3: {
                        numStr = 'fourth';
                        break;
                    }
                    case 4: {
                        numStr = 'fifth';
                        break;
                    }
                    case 5: {
                        numStr = 'sixth';
                        break;
                    }
                    case 6: {
                        numStr = 'seventh';
                        break;
                    }
                    case 7: {
                        numStr = 'eighth';
                        break;
                    }
                }

                let value = script.getStringField('COLOR');

                if (!sq.neopixel) {
                    sq.neopixel = {};
                }

                if (numStr) {
                    let red = parseInt(value.substr(1, 2), 16);
                    let green = parseInt(value.substr(3, 2), 16);
                    let blue = parseInt(value.substr(5, 2), 16);

                    sq.neopixel = {
                        type: Entry.NeoSpider.PORT_MAP.neopixel,
                        data: {
                            numStr,
                            red,
                            green,
                            blue
                        },
                        time: new Date().getTime(),
                    };
    
                    Entry.hw.update();
                }

                return script.callReturn();
            },
        },
        neo_spider_neopixel_color_picker_all_on: {
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
                params: [
                    null,
                    null,
                ],
                type: 'neo_spider_neopixel_color_picker_all_on',
            },
            paramsKeyMap: {
                COLOR: 0,
            },
            class: 'NeoSpider',
            isNotFor: ['NeoSpider'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;
                let value = script.getStringField('COLOR');

                if (!sq.neopixel) {
                    sq.neopixel = {};
                }

                let red = parseInt(value.substr(1, 2), 16);
                let green = parseInt(value.substr(3, 2), 16);
                let blue = parseInt(value.substr(5, 2), 16);

                sq.neopixel = {
                    type: Entry.NeoSpider.PORT_MAP.neopixel,
                    data: {
                        red,
                        green,
                        blue
                    },
                    time: new Date().getTime(),
                };

                Entry.hw.update();
                return script.callReturn();
            },
        },
        neo_spider_neopixel_all_on: {
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
                        params: ['100'],
                    },
                    {
                        type: 'number',
                        params: ['100'],
                    },
                    {
                        type: 'number',
                        params: ['100'],
                    },
                    null,
                ],
                type: 'neo_spider_neopixel_all_on',
            },
            paramsKeyMap: {
                RED: 0,
                GREEN: 1,
                BLUE: 2,
            },
            class: 'NeoSpider',
            isNotFor: ['NeoSpider'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;

                let red = script.getNumberValue('RED', script);
                let green = script.getNumberValue('GREEN', script);
                let blue = script.getNumberValue('BLUE', script);

                if (!sq.neopixel) {
                    sq.neopixel = {};
                }

                sq.neopixel = {
                    type: Entry.NeoSpider.PORT_MAP.neopixel,
                    data: {
                        red,
                        green,
                        blue
                    },
                    time: new Date().getTime(),
                };

                Entry.hw.update();
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'NeoSpider.neopixelAllON(%1, %2, %3)',
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
        neo_spider_neopixel_all_off: {
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
                params: [null,],
                type: 'neo_spider_neopixel_all_off',
            },
            paramsKeyMap: {},
            class: 'NeoSpider',
            isNotFor: ['NeoSpider'],
            func: function (sprite, script) {
                const sq = Entry.hw.sendQueue;

                if (!sq.neopixel) {
                    sq.neopixel = {};
                }

                sq.neopixel = 0;

                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'NeoSpider.neopixelAllOFF()',
                        textParams: [],
                    },
                ],
            },
        },
        neo_spider_outer_motor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['5', '5'],
                        ['6', '6'],
                    ],
                    value: '5',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['LOW', '0'],
                        ['HIGH', '1'],
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
                params: [
                    5,
                    null,
                ],
                type: 'neo_spider_outer_motor',
            },
            paramsKeyMap: {
                PORT: 0,
                STATE: 1,
            },
            class: 'NeoSpider',
            isNotFor: ['NeoSpider'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                let port = script.getNumberValue('PORT', script);
                let state = script.getNumberValue('STATE', script);
                state = state ? 255 : 0;
                if (port == 5) {
                    if (!sq.outerLeftMotor) {
                        sq.outerLeftMotor = {};
                    }
                    sq.outerLeftMotor = state;
                } else if (port == 6) {
                    if (!sq.outerRightMotor) {
                        sq.outerRightMotor = {};
                    }
                    sq.outerRightMotor = state;
                }
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'NeoSpider.outerDigitalPin(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['5', '5'],
                                    ['6', '6'],
                                ],
                                value: '5',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                            {
                                type: 'Dropdown',
                                options: [
                                    ['LOW', '0'],
                                    ['HIGH', '1'],
                                ],
                                value: '0',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                    },
                ],
            },
        },
        neo_spider_outer_motor_pwm: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['5', '5'],
                        ['6', '6'],
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
                    5,
                    null,
                ],
                type: 'neo_spider_outer_motor_pwm',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'NeoSpider',
            isNotFor: ['NeoSpider'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                let port = script.getNumberValue('PORT', script);
                let value = script.getNumberValue('VALUE', script);
                value = Math.round(value);
                value = Math.max(value, 0);
                value = Math.min(value, 255);
                
                if (port == 5) {
                    if (!sq.outerLeftMotor) {
                        sq.outerLeftMotor = {};
                    }
                    sq.outerLeftMotor = value;
                } else if (port == 6) {
                    if (!sq.outerRightMotor) {
                        sq.outerRightMotor = {};
                    }
                    sq.outerRightMotor = value;
                }
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'NeoSpider.outerDigitalPinPWM(%1, %2)',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [
                                    ['5', '5'],
                                    ['6', '6'],
                                ],
                                value: '5',
                                fontSize: 11,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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

module.exports = Entry.NeoSpider;
