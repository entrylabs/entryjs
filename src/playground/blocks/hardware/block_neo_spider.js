'use strict';

Entry.NeoSpider = {
    id: '41.1',
    name: 'NeoSpider',
    url: 'http://www.neo3ds.com/',
    imageName: 'NeoSpider.png',
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
        outerMotor: 0,
    },
    setZero() {
        let portMap = Entry.NeoSpider.PORT_MAP;
        let sq = Entry.hw.sendQueue;
        for (let port in portMap) {
            sq[port] = portMap[port];
        }
        Entry.hw.update();
        let NeoSpider = Entry.NeoSpider;
        NeoSpider.removeAllTimeouts();
    },
    timeouts: [],
    removeTimeout: function (id) {
        clearTimeout(id);
        var timeouts = this.timeouts;
        var index = timeouts.indexOf(id);
        if (index >= 0) {
            timeouts.splice(index, 1);
        }
    },
    removeAllTimeouts: function () {
        var timeouts = this.timeouts;
        for (var i in timeouts) {
            clearTimeout(timeouts[i]);
        }
        this.timeouts = [];
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
    highList: ['high', '1', 'on'],
    lowList: ['low', '0', 'off'],
    BlockState: {},
};

Entry.NeoSpider.setLanguage = function () {
    return {
        ko: {
            template: {
                neo_spider_get_analog_value: '아날로그 %1 핀 센서값',
                neo_spider_get_analog_value_map: '%1 의 범위를 %2 ~ %3 에서 %4 ~ %5 로 바꾼값',
                neo_spider_get_ultrasonic_value: '초음파 센서값',
                neo_spider_get_motion_value: '모션 센서값',
                neo_spider_get_infared_value: '적외선 %1 센서값',
                neo_spider_set_tone: '버저를 %2 %3 음으로 %4 초 연주하기 %5',
                neo_spider_set_servo: '서보모터를 %1 의 각도로 정하기 %2',
                neo_spider_motor_state: '네오스파이더 %1 이동하기 %2',
                neo_spider_neopixel: 'RGB LED %1번 빨 %2 녹 %3 파 %4 (으)로 켜기 %5',
                neo_spider_neopixel_all_on: 'RGB LED 전체 빨 %1 녹 %2 파 %3 (으)로 켜기 %4',
                neo_spider_neopixel_all_off: 'RGB LED 전체 끄기 %1',
                neo_spider_outer_motor: '외부모터 %1 %2',
            },
        },
        en: {
            template: {
                neo_spider_get_analog_value: 'Analog %1 pin Sensor value',
                neo_spider_get_analog_value_map: 'Map Value %1 %2 ~ %3 to %4 ~ %5',
                neo_spider_get_ultrasonic_value: 'Ultrasonic Sensor value',
                neo_spider_get_motion_value: 'Motion Sensor value',
                neo_spider_get_infared_value: 'Infared ray %1 Sensor value',
                neo_spider_set_tone: 'Play tone note %2 octave %3 beat %4 %5',
                neo_spider_set_servo: 'Set servo pin angle as %1 %2',
                neo_spider_motor_state: 'Move neospider %1 %2',
                neo_spider_neopixel: 'RGB LED number %1 turn on R %2 G %3 B %4 %5',
                neo_spider_neopixel_all_on: 'All RGB LED turn on R %1 G %2 B %3 %4',
                neo_spider_neopixel_all_off: 'All RGB LED turn off %1',
                neo_spider_outer_motor: 'Outer motor %1 %2',
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
    'neo_spider_set_tone',
    'neo_spider_motor_state',
    'neo_spider_neopixel',
    'neo_spider_neopixel_all_on',
    'neo_spider_neopixel_all_off',
    'neo_spider_outer_motor',
];

Entry.NeoSpider.getBlocks = function () {
    return {
        neo_spider_analog_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['가스', 'gas'],
                        ['조도', 'cds'],
                        ['온도', 'tmp'],
                        ['진동', 'vibe'],
                        ['외부', 'outer'],
                    ],
                    value: 'gas',
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
                                    ['가스', 'gas'],
                                    ['조도', 'cds'],
                                    ['온도', 'tmp'],
                                    ['진동', 'vibe'],
                                    ['외부', 'outer'],
                                ],
                                value: 'gas',
                                fontSize: 11,
                                converter: Entry.block.converters.returnStringKey,
                                codeMap: 'Entry.CodeMap.Arduino.neo_spider_analog_list[0]',
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'neo_spider_analog_list',
                    },
                ],
            },
        },
        neo_spider_get_analog_value: {
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
                        type: 'neo_spider_analog_list',
                    },
                ],
                type: 'neo_spider_get_analog_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'NeoSpiderGet',
            isNotFor: ['NeoSpider'],
            func(sprite, script) {
                const pd = Entry.hw.portData;
                let port = script.getValue('PORT', script);
                return pd[port]
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
        neo_spider_get_analog_value_map: {
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
                        type: 'neo_spider_get_analog_value',
                        params: [
                            {
                                type: 'neo_spider_analog_list',
                            },
                        ],
                    },
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
                let result = script.getValue('PORT', script);
                const pd = Entry.hw.portData; //해당 부분 해볼것
                let value2 = script.getNumberValue('VALUE2', script);
                let value3 = script.getNumberValue('VALUE3', script);
                let value4 = script.getNumberValue('VALUE4', script);
                let value5 = script.getNumberValue('VALUE5', script);
                const stringValue4 = script.getValue('VALUE4', script);
                const stringValue5 = script.getValue('VALUE5', script);
                let isFloat = false;

                if (
                    (Entry.Utils.isNumber(stringValue4) && stringValue4.indexOf('.') > -1) ||
                    (Entry.Utils.isNumber(stringValue5) && stringValue5.indexOf('.') > -1)
                ) {
                    isFloat = true;
                }

                if (value2 > value3) {
                    var swap = value2;
                    value2 = value3;
                    value3 = swap;
                }
                if (value4 > value5) {
                    var swap = value4;
                    value4 = value5;
                    value5 = swap;
                }
                result -= value2;
                result = result * ((value5 - value4) / (value3 - value2));
                result += value4;
                result = Math.min(value5, result);
                result = Math.max(value4, result);

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
                        syntax: 'Arduino.map(%1, %2, %3, %4, %5)',
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
                        type: 'arduino_get_port_number',
                        params: ['13'],
                    },
                ],
                type: 'neo_spider_get_ultrasonic_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'NeoSpiderGet',
            isNotFor: ['NeoSpider'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = script.getNumberValue('PORT', script);

                if (!sq.ultrasonic) {
                    sq.ultrasonic = {};
                }

                sq.ultrasonic = 1;

                return Entry.hw.portData.ultrasonic || 0;
            },
        },
        neo_spider_get_motion_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
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
                        type: 'arduino_get_port_number',
                        params: [11],
                    },
                ],
                type: 'neo_spider_get_motion_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'NeoSpiderGet',
            isNotFor: ['NeoSpider'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                let port = script.getNumberValue('PORT', script);

                if (!sq.motion) {
                    sq.motion = {};
                }

                sq.motion = 1;

                return Entry.hw.portData.motion || 0; // 모션센서 값 감지가 0인지 1인지 파악 필요
            },
        },
        neo_spider_infared_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
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
                params: [null],
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
                        syntax: '1%',
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
                                converter: Entry.block.converters.returnStringKey,
                                codeMap: 'Entry.CodeMap.Arduino.neo_spider_infared_list[0]',
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'neo_spider_infared_list',
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
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'neo_spider_infared_list',
                    },
                ],
                type: 'neo_spider_get_infared_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'NeoSpiderGet',
            isNotFor: ['NeoSpider'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                let port = script.getValue('PORT', script);

                if (!sq.outerMotor) {
                    sq.outerMotor = {};
                }

                sq.outerMotor = 3;

                return Entry.hw.portData[port] || 0; // 이렇게 쓰는게 맞는지 확인 필요
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.digitalRead(%1)',
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
                    defaultType: 'number',
                },
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
                        type: 'arduino_get_port_number',
                        params: [3],
                    },
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
                PORT: 0,
                NOTE: 1,
                OCTAVE: 2,
                DURATION: 3,
            },
            class: 'NeoSpider',
            isNotFor: ['NeoSpider'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = script.getNumberValue('PORT', script);

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
                        syntax: 'Arduino.tone(%1, %2, %3, %4)',
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
                    null,
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
        neo_spider_motor_state: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['정지', 0],
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
                        params: ['1'],
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
                    case 1: {
                        numStr = 'first';
                        break;
                    }
                    case 2: {
                        numStr = 'second';
                        break;
                    }
                    case 3: {
                        numStr = 'third';
                        break;
                    }
                    case 4: {
                        numStr = 'fourth';
                        break;
                    }
                    case 5: {
                        numStr = 'fifth';
                        break;
                    }
                    case 6: {
                        numStr = 'sixth';
                        break;
                    }
                    case 7: {
                        numStr = 'seventh';
                        break;
                    }
                    case 8: {
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
                params: [
                    null,
                ],
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
                        ['정지', 0],
                        ['정회전', 1],
                        ['역회전', 2],
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
                type: 'neo_spider_outer_motor',
            },
            paramsKeyMap: {
                STATE: 0,
            },
            class: 'NeoSpider',
            isNotFor: ['NeoSpider'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                let state = script.getNumberValue('STATE', script);

                if (!sq.outerMotor) {
                    sq.outerMotor = {};
                }

                sq.outerMotor = state;

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
        }
    };
};

module.exports = Entry.NeoSpider;
