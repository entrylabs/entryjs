'use strict';

/*******************************************************
 * 명명 규칙
 *
 * 함수명, 변수명 : 첫 글자 소문자, 다음 단어 첫 글자 대문자, 두단어 이상 조합     예) nameRull
 * 키  값 : 모두 대문자, 단어사이 '_' 사용함                                    예) NAME_RULL
 *
 *********************************************************/

Entry.mechatro = {
    id: '1F.1',
    name: 'mechatro',
    url: 'http://cafe.naver.com/easybread',
    imageName: 'mechatronics_4d.png',
    title: {
        en: '4D Mechatronics',
        ko: '4D 메카트로닉스',
    },
    setZero: function() {
        Entry.hw.sendQueue = {};
        Entry.hw.sendQueue['entryStop'] = 0;
        Entry.hw.update();

        //Entry.mechatro.entryState.VALUE        =  [0,0,0,0,0,  0,0,0,0,0,  0,0,0,0,0,  0,0,0,0,0,  0,0];
        //Entry.mechatro.entryState.VALUE_U_FLAG =  [0,0,0,0,0,  0,0,0,0,0,  0,0,0,0,0,  0,0,0,0,0,  0,0];
        //Entry.mechatro.entryState.MODE         =  [0,0,0,0,0,  0,0,0,0,0,  0,0,0,0,0,  0,0,0,0,0,  0,0];
        //Entry.mechatro.entryState.MODE_U_FLAG  =  [0,0,0,0,0,  0,0,0,0,0,  0,0,0,0,0,  0,0,0,0,0,  0,0];
        Entry.hw.update();
        Entry.hw.sendQueue = {};
    },
    monitorTemplate: {
        imgPath: 'hw/transparent.png',
        width: 605,
        height: 434,
        listPorts: {
            '2': {
                name: Lang.Hw.port_en + ' 2 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '4': {
                name: Lang.Hw.port_en + ' 4 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '5': {
                name: Lang.Hw.port_en + ' 5 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '6': {
                name: Lang.Hw.port_en + ' 6 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '7': {
                name: Lang.Hw.port_en + ' 7 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '10': {
                name: Lang.Hw.port_en + ' 10 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '14': {
                name: Lang.Hw.port_en + ' a0 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '15': {
                name: Lang.Hw.port_en + ' a1 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '16': {
                name: Lang.Hw.port_en + ' a2 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '17': {
                name: Lang.Hw.port_en + ' a3 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '18': {
                name: Lang.Hw.port_en + ' a4 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '19': {
                name: Lang.Hw.port_en + ' a5 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '20': {
                name: Lang.Hw.port_en + ' a6 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '21': {
                name: Lang.Hw.port_en + ' a7 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            //"m2":{name: Lang.Hw.port_en + " m2 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            //"m4":{name: Lang.Hw.port_en + " m4 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            //"m5":{name: Lang.Hw.port_en + " m5 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            //"m6":{name: Lang.Hw.port_en + " m6 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            //"m7":{name: Lang.Hw.port_en + " m7 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            //"m10":{name: Lang.Hw.port_en + " m10 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            M3: {
                name: Lang.Hw.port_en + ' MA ' + '모터 속도',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            M11: {
                name: Lang.Hw.port_en + ' MB ' + '모터 속도',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
        },
        mode: 'both',
    },
    state: {
        //"VALUE"        : [0,0,0,0,0,  0,0,0,0,0,  0,0,0,0,0,  0,0,0,0,0,  0,0],
        //"MODE"         : [0,0,0,0,0,  0,0,0,0,0,  0,0,0,0,0,  0,0,0,0,0,  0,0],
        //"VALUE_U_FLAG" : [0,0,0,0,0,  0,0,0,0,0,  0,0,0,0,0,  0,0,0,0,0,  0,0],
        //"MODE_U_FLAG"  : [0,0,0,0,0,  0,0,0,0,0,  0,0,0,0,0,  0,0,0,0,0,  0,0],
        THRESHOLD: [
            50,
            50,
            50,
            50,
            50,
            50,
            50,
            50,
            50,
            50,
            50,
            50,
            50,
            50,
            50,
            50,
            50,
            50,
            50,
            50,
            50,
            50,
        ],
    },
    portMode: {
        SET_G_DEVICE: 0x80,
        COM_ALIVE: 0x80,
        COM_INIT_DEVICE: 0x81,
        COM_STANDBY_DEVICE: 0x82,
        COM_NO_TONE: 0x83,
        COM_SET_BLUE_PW: 0x84,
        SET_DIGITAL_OUT: 0x90,

        SET_G_MOTOR: 0xa0,
        SET_MOTOR_SPEED: 0xa0,
        SET_MOTOR_CURRENT: 0xb0,

        SET_G_SERVO_PWM_TON: 0xc0,
        SET_SERVO_POSITION: 0xc0,
        SET_SERVO_SPEED: 0xc8,
        SET_PWM: 0xd0,
        SET_TONE: 0xd8,

        SET_G_INPUT: 0xe0,
        SET_ANALOG_IN: 0xe0,
        SET_DIGITAL_IN: 0xe8,
        SET_ULTRASONIC: 0xf0,
    },
    transferModeValue: function(portNo, mode, value) {
        var mPortNo = 'm' + portNo;
        if (Entry.hw.portData[mPortNo] !== mode) {
            Entry.hw.sendQueue[mPortNo] = mode;
            Entry.hw.sendQueue[portNo] = value;
            Entry.hw.update();
            delete Entry.hw.sendQueue[mPortNo];
            delete Entry.hw.sendQueue[portNo]; // 큐에서 지우면 하드웨어 모니터에서 값 표시가 안됨. 값을 HW 프로그램에서 전송하여 표시
        } else {
            Entry.hw.sendQueue[portNo] = value;
            Entry.hw.update();
            delete Entry.hw.sendQueue[portNo];
        }
    },
    transferValue: function(portNo, value) {
        Entry.hw.sendQueue[portNo] = value;
        Entry.hw.update();
        delete Entry.hw.sendQueue[portNo];
    },
    transferMode: function(portNo, mode) {
        var mPortNo = 'm' + portNo;
        if (Entry.hw.portData[mPortNo] !== mode) {
            Entry.hw.sendQueue[mPortNo] = mode;
            Entry.hw.update();
            delete Entry.hw.sendQueue[mPortNo];
        }
    },
};
Entry.mechatro.blockMenuBlocks = [
    // mechatro Added 2018-02-12
    'mechatro_set_threshold',
    'mechatro_get_digital',
    'mechatro_get_sensor_value',
    'mechatro_get_dc_motor_current',
    'mechatro_get_ultrasonic_value',
    'mechatro_set_digital',
    'mechatro_set_pwm',
    'mechatro_set_tone',
    'mechatro_set_tone_time',
    'mechatro_set_dc_motor',
    'mechatro_set_servo_position',
    'mechatro_set_servo_speed',
    'mechatro_set_blue_pw',
    // mechatro Added 2018-02-12
];
Entry.mechatro.getBlocks = function() {
    return {
        //region mechatro
        mechatro_get_digital: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['D2', '2'],
                        ['D4', '4'],
                        ['D5', '5'],
                        ['D6', '6'],
                        ['D7', '7'],
                        ['D10', '10'],
                        ['A2', '16'],
                        ['A3', '17'],
                        ['A4', '18'],
                        ['A5', '19'],
                        ['A6', '20'],
                        ['A7', '21'],
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
                type: 'mechatro_get_digital',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'MechatroGet',
            isNotFor: ['mechatro'],
            func: function(sprite, script) {
                if (!Entry.hw.connected) {
                    return 0;
                }

                var portNo = script.getNumberField('PORT', script);
                var mPortNo = 'm' + portNo;
                var mode;
                var value;

                if (portNo > 14) {
                    mode = Entry.mechatro.portMode.SET_ANALOG_IN;
                } else {
                    mode = Entry.mechatro.portMode.SET_DIGITAL_IN;
                }

                if (Entry.hw.portData[mPortNo] !== mode) {
                    Entry.hw.sendQueue[mPortNo] = mode;
                    Entry.hw.update();
                    delete Entry.hw.sendQueue[mPortNo];
                }

                if (Entry.hw.portData[portNo] !== undefined) {
                    value = Entry.hw.portData[portNo];
                    if (portNo > 14) {
                        value = value > Entry.mechatro.state.THRESHOLD[portNo] ? 1 : 0;
                    }
                    return value;
                } else {
                    return 0;
                }
            },
            syntax: { js: [], py: ['mechatro.get_digital(%1)'] },
        },
        mechatro_get_sensor_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['A2', '16'],
                        ['A3', '17'],
                        ['A4', '18'],
                        ['A5', '19'],
                        ['A6', '20'],
                        ['A7', '21'],
                    ],
                    value: '16',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'mechatro_get_sensor_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'MechatroGet',
            isNotFor: ['mechatro'],
            func: function(sprite, script) {
                var portNo = script.getNumberField('PORT', script);
                var mPortNo = 'm' + portNo;
                var mode = Entry.mechatro.portMode.SET_ANALOG_IN;

                if (Entry.hw.portData[mPortNo] !== mode) {
                    Entry.hw.sendQueue[mPortNo] = mode;
                    Entry.hw.update();
                    delete Entry.hw.sendQueue[mPortNo];
                }
                if (Entry.hw.portData[portNo] !== undefined) {
                    return Entry.hw.portData[portNo];
                } else {
                    return 0;
                }
            },
            syntax: { js: [], py: ['mechatro.sensor_value(%1)'] },
        },
        mechatro_set_threshold: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['A2', '16'],
                        ['A3', '17'],
                        ['A4', '18'],
                        ['A5', '19'],
                        ['A6', '20'],
                        ['A7', '21'],
                    ],
                    value: '16',
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
                        type: 'number',
                        params: ['10~90'],
                    },
                    null,
                ],
                type: 'mechatro_set_threshold',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'MechatroGet',
            isNotFor: ['mechatro'],
            func: function(sprite, script) {
                var portNo = script.getNumberField('PORT', script);
                var value = script.getValue('VALUE');

                if (!Entry.Utils.isNumber(value)) value = 0;
                value = Math.max(value, 10);
                value = Math.min(value, 90);

                Entry.mechatro.state.THRESHOLD[portNo] = value;

                return script.callReturn();
            },
            syntax: { js: [], py: ['mechatro.set_threshold(%1, %2)'] },
        },
        mechatro_get_ultrasonic_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['D2', '2'],
                        ['D4', '4'],
                        ['D5', '5'],
                        ['D6', '6'],
                        ['D7', '7'],
                        ['D10', '10'],
                    ],
                    value: '2',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['D2', '2'],
                        ['D4', '4'],
                        ['D5', '5'],
                        ['D6', '6'],
                        ['D7', '7'],
                        ['D10', '10'],
                    ],
                    value: '4',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null, null],
                type: 'mechatro_get_ultrasonic_value',
            },
            paramsKeyMap: {
                TIRG: 0,
                ECHO: 1,
            },
            class: 'MechatroGet',
            isNotFor: ['mechatro'],
            func: function(sprite, script) {
                if (!Entry.hw.connected) {
                    return 0;
                }

                var trig = script.getNumberField('TIRG', script);
                var echo = script.getNumberField('ECHO', script);
                var mode = Entry.mechatro.portMode.SET_ULTRASONIC;
                Entry.mechatro.transferModeValue(trig, mode, echo);

                if (Entry.hw.portData[trig] !== undefined) {
                    return Entry.hw.portData[trig];
                } else {
                    return 0;
                }
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
        mechatro_set_digital: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['D2', '2'],
                        ['D4', '4'],
                        ['D5', '5'],
                        ['D6', '6'],
                        ['D7', '7'],
                        ['D10', '10'],
                    ],
                    value: '2',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [['켜기', '1'], ['끄기', '0']],
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
                params: [null, null, null],
                type: 'mechatro_set_digital',
            },
            paramsKeyMap: {
                PORT: 0,
                OPERATOR: 1,
            },
            class: 'Mechatro_d_out',
            isNotFor: ['mechatro'],
            func: function(sprite, script) {
                var portNo = script.getNumberField('PORT', script);
                var mode = Entry.mechatro.portMode.SET_DIGITAL_OUT;
                var value = script.getNumberField('OPERATOR');

                Entry.mechatro.transferModeValue(portNo, mode, value);

                return script.callReturn();
            },
            syntax: { js: [], py: ['mechatro.set_digital(%1, %2)'] },
        },
        mechatro_set_pwm: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['D5', '5'], ['D6', '6']],
                    value: '5',
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
                        type: 'number',
                        params: ['0~100'],
                    },
                    null,
                ],
                type: 'mechatro_set_pwm',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'Mechatro_d_out',
            isNotFor: ['mechatro'],
            func: function(sprite, script) {
                var portNo = script.getNumberField('PORT', script);
                var mode = Entry.mechatro.portMode.SET_PWM;
                var value = script.getValue('VALUE');

                if (!Entry.Utils.isNumber(value)) value = 0;
                value = Math.max(value, 0);
                value = Math.min(value, 100);

                Entry.mechatro.transferModeValue(portNo, mode, value);

                return script.callReturn();
            },
            syntax: { js: [], py: ['mechatro.mechatro_set_pwm(%1, %2)'] },
        },
        mechatro_set_tone_time: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['D2', '2'],
                        ['D4', '4'],
                        ['D5', '5'],
                        ['D6', '6'],
                        ['D7', '7'],
                        ['D10', '10'],
                    ],
                    value: '2',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['무음', '0'],
                        ['도', '1'],
                        ['도#(레♭)', '2'],
                        ['레', '3'],
                        ['레#(미♭)', '4'],
                        ['미', '5'],
                        ['파', '6'],
                        ['파#(솔♭)', '7'],
                        ['솔', '8'],
                        ['솔#(라♭)', '9'],
                        ['라', '10'],
                        ['라#(시♭)', '11'],
                        ['시', '12'],
                    ],
                    value: '1',
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
                        ['5', '4'],
                        ['6', '5'],
                    ],
                    value: '3',
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
                    null,
                    null,
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'mechatro_set_tone_time',
            },
            paramsKeyMap: {
                PORT: 0,
                NOTE: 1,
                OCTAVE: 2,
                DURATION: 3,
            },
            class: 'Mechatro_d_out',
            isNotFor: ['mechatro'],
            func: function(sprite, script) {
                var portNo = script.getNumberField('PORT', script);
                var mPortNo = 'm' + portNo;

                if (!script.isStart) {
                    var duration = script.getNumberValue('DURATION', script);
                    if (duration < 0) {
                        duration = 0;
                    }

                    var note = script.getNumberField('NOTE', script);

                    if (duration === 0 || note === 0) {
                        Entry.hw.sendQueue[mPortNo] = Entry.mechatro.portMode.COM_NO_TONE;
                        Entry.hw.update();
                        delete Entry.hw.sendQueue[mPortNo];
                        return script.callReturn();
                    }

                    var octave = script.getNumberField('OCTAVE', script);
                    var note = script.getNumberField('NOTE', script);
                    duration = duration * 1000;
                    script.isStart = true;
                    script.timeFlag = 1;

                    Entry.hw.sendQueue[mPortNo] = Entry.mechatro.portMode.SET_TONE;
                    Entry.hw.sendQueue[portNo] = (octave << 4) | (note - 1);
                    Entry.hw.update();
                    delete Entry.hw.sendQueue[mPortNo];
                    delete Entry.hw.sendQueue[portNo];

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, duration + 32);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    Entry.hw.sendQueue[mPortNo] = Entry.mechatro.portMode.COM_NO_TONE;
                    delete Entry.hw.sendQueue[portNo];
                    Entry.hw.update();
                    delete Entry.hw.sendQueue[mPortNo];

                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;

                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'mechatro.tone_time(%1, %2, %3, %4)',
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
        mechatro_set_tone: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['D2', '2'],
                        ['D4', '4'],
                        ['D5', '5'],
                        ['D6', '6'],
                        ['D7', '7'],
                        ['D10', '10'],
                    ],
                    value: '2',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['무음', '0'],
                        ['도', '1'],
                        ['도#(레♭)', '2'],
                        ['레', '3'],
                        ['레#(미♭)', '4'],
                        ['미', '5'],
                        ['파', '6'],
                        ['파#(솔♭)', '7'],
                        ['솔', '8'],
                        ['솔#(라♭)', '9'],
                        ['라', '10'],
                        ['라#(시♭)', '11'],
                        ['시', '12'],
                    ],
                    value: '1',
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
                        ['5', '4'],
                        ['6', '5'],
                    ],
                    value: '3',
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
                params: [null, null, null, null],
                type: 'mechatro_set_tone',
            },
            paramsKeyMap: {
                PORT: 0,
                NOTE: 1,
                OCTAVE: 2,
            },
            class: 'Mechatro_d_out',
            isNotFor: ['mechatro'],
            func: function(sprite, script) {
                var portNo = script.getNumberField('PORT', script);
                var note = script.getNumberField('NOTE', script);
                var octave = script.getNumberField('OCTAVE', script);
                var note = script.getNumberField('NOTE', script);
                var mode;
                var value = (octave << 4) | (note - 1);

                if (note === 0) {
                    mode = Entry.mechatro.portMode.COM_NO_TONE;
                    Entry.mechatro.transferMode(portNo, mode);
                } else {
                    mode = Entry.mechatro.portMode.SET_TONE;
                    Entry.mechatro.transferModeValue(portNo, mode, value);
                }
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'mechatro.tone(%1, %2, %3)',
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
        mechatro_set_dc_motor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['MA', '3'], ['MB', '11']],
                    value: '3',
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
                        type: 'number',
                        params: ['-100 ~ 100 사이값'],
                    },
                    null,
                ],
                type: 'mechatro_set_dc_motor',
            },
            paramsKeyMap: {
                PORT: 0,
                SPEED: 1,
            },
            class: 'set_motor',
            isNotFor: ['mechatro'],
            func: function(sprite, script) {
                var portNo = script.getField('PORT', script);
                var value = script.getValue('SPEED');

                if (!Entry.Utils.isNumber(value)) value = 0;

                value = Math.round(value);
                value = value + 100;
                value = Math.max(value, 0);
                value = Math.min(value, 200);

                Entry.mechatro.transferValue(portNo, value);
                return script.callReturn();
            },
        },
        mechatro_get_dc_motor_current: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['MA', '14'], ['MB', '15']],
                    value: '14',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'mechatro_get_dc_motor_current',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'MechatroGet',
            isNotFor: ['mechatro'],
            func: function(sprite, script) {
                var portNo = script.getNumberField('PORT', script);
                var mPortNo = 'm' + portNo;
                var mode = Entry.mechatro.portMode.SET_MOTOR_CURRENT;

                if (Entry.hw.portData[mPortNo] !== mode) {
                    Entry.hw.sendQueue[mPortNo] = mode;
                    Entry.hw.update();
                    delete Entry.hw.sendQueue[mPortNo];
                }
                if (Entry.hw.portData[portNo] !== undefined) {
                    return Entry.hw.portData[portNo];
                } else {
                    return 0;
                }
            },
            syntax: {
                js: [],
                py: ['mechatro.mechatro_get_dc_motor_current(%1)'],
            },
        },
        mechatro_set_servo_position: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['D2', '2'], ['D5', '5'], ['D6', '6'], ['D10', '10']],
                    value: '2',
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
                        type: 'number',
                        params: ['0~180'],
                    },
                    null,
                ],
                type: 'mechatro_set_servo_position',
            },
            paramsKeyMap: {
                PORT: 0,
                DEGREE: 1,
            },
            class: 'set_motor',
            isNotFor: ['mechatro'],
            func: function(sprite, script) {
                var portNo = script.getNumberField('PORT', script);
                var mode = Entry.mechatro.portMode.SET_SERVO_POSITION;
                var value = script.getValue('DEGREE');

                if (!Entry.Utils.isNumber(value)) value = 90;
                value = Math.max(value, 0);
                value = Math.min(value, 180);

                Entry.mechatro.transferModeValue(portNo, mode, value);

                return script.callReturn();
            },
            syntax: {
                js: [],
                py: ['mechatro.mechatro_set_servo_position(%1, %2)'],
            },
        },
        mechatro_set_servo_speed: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['D2', '22'], ['D5', '23'], ['D6', '24'], ['D10', '25']],
                    value: '22',
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
                        type: 'number',
                        params: ['1~255'],
                    },
                    null,
                ],
                type: 'mechatro_set_servo_speed',
            },
            paramsKeyMap: {
                PORT: 0,
                SPEED: 1,
            },
            class: 'set_motor',
            isNotFor: ['mechatro'],
            func: function(sprite, script) {
                var portNo = script.getNumberField('PORT', script);
                var mode = Entry.mechatro.portMode.SET_SERVO_SPEED;
                var value = script.getValue('SPEED');

                if (!Entry.Utils.isNumber(value)) value = 255;
                value = Math.max(value, 0);
                value = Math.min(value, 255);

                Entry.mechatro.transferModeValue(portNo, mode, value);

                return script.callReturn();
            },
            syntax: {
                js: [],
                py: ['mechatro.mechatro_set_servo_speed(%1, %2)'],
            },
        },
        mechatro_set_blue_pw: {
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
                        type: 'number',
                        params: ['1'],
                    },
                    {
                        type: 'number',
                        params: ['2'],
                    },
                    {
                        type: 'number',
                        params: ['3'],
                    },
                    {
                        type: 'number',
                        params: ['4'],
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/hardware_icon.svg',
                        size: 12,
                    },
                ],
                type: 'mechatro_set_blue_pw',
            },
            paramsKeyMap: {
                PW1: 0,
                PW2: 1,
                PW3: 2,
                PW4: 3,
            },
            class: 'Mechatro_blue',
            isNotFor: ['mechatro'],
            func: function(sprite, script) {
                var mode = Entry.mechatro.portMode.COM_SET_BLUE_PW;

                var value =
                    script.getNumberValue('PW1') * 1000 +
                    script.getNumberValue('PW2') * 100 +
                    script.getNumberValue('PW3') * 10 +
                    script.getNumberValue('PW4');

                Entry.mechatro.transferModeValue(2, mode, value);

                return script.callReturn();
            },
            syntax: { js: [], py: ['mechatro.mechatro_set_pwm(%1, %2)'] },
        },
        //endregion mechatro
    };
};

module.exports = Entry.mechatro;
