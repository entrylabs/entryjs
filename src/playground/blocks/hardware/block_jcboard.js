'use strict';

Entry.JCBoard = {
    Cmd: {
        CMD_GOLDENKEY0: 0,
        CMD_GOLDENKEY1: 1,
        CMD_GOLDENKEY2: 2,
        CMD_GOLDENKEY3: 3,
        CMD_LENGTH: 4,
        CMD_CHECKSUM: 5,
        CMD_LED: 6,
        CMD_PIN: 7,
        CMD_BUZZER: 8,
        CMD_BUZZER_DUR: 9,
        CMD_DC0: 10,
        CMD_DC1: 11,
        CMD_SERVO0: 12,
        CMD_SERVO1: 13,
        CMD_SERVO2: 14,
        CMD_SERVO3: 15,
        CMD_ULTRASONIC: 16,
    },
    Sensor: {
        SENSOR_GOLDENKEY0: 0,
        SENSOR_GOLDENKEY1: 1,
        SENSOR_GOLDENKEY2: 2,
        SENSOR_GOLDENKEY3: 3,
        SENSOR_LENGTH: 4,
        SENSOR_CHECKSUM: 5,
        SENSOR_BUTTON: 6,
        SENSOR_AIN0: 7,
        SENSOR_AIN1: 8,
        SENSOR_AIN2: 9,
        SENSOR_AIN3: 10,
        SENSOR_AIN4: 11,
    },
    setZero() {
        Entry.hw.sendQueue.CMD = [
            0x26,
            0xa8,
            0x14,
            0xc1,
            0x14,
            0x00,
            0x00,
            0x00,
            0x00,
            0x00,
            0x00,
            0x00,
            0x00,
            0x00,
            0x00,
            0x00,
            0x00,
            0x00,
            0x00,
            0x00,
        ];
        Entry.hw.update();
    },
    id: '1D.4',
    name: 'JCBoard',
    url: 'http://www.junilab.co.kr',
    imageName: 'jcboard.png',
    title: {
        en: 'JCBoard',
        ko: '제이씨보드',
    },
    monitorTemplate: {
        imgPath: 'hw/jcboard.png',
        width: 600,
        height: 535,
        ports: {
            A0: {
                name: 'BUTTON1',
                type: 'input',
                pos: {
                    x: 207,
                    y: 385,
                },
            },
            A1: {
                name: 'BUTTON2',
                type: 'input',
                pos: {
                    x: 280,
                    y: 385,
                },
            },
            A2: {
                name: 'AIN1',
                type: 'input',
                pos: {
                    x: 338,
                    y: 385,
                },
            },
            A3: {
                name: 'AIN2',
                type: 'input',
                pos: {
                    x: 380,
                    y: 385,
                },
            },
            A4: {
                name: 'AIN3',
                type: 'input',
                pos: {
                    x: 416,
                    y: 385,
                },
            },
            A5: {
                name: 'AIN4',
                type: 'input',
                pos: {
                    x: 453,
                    y: 385,
                },
            },
            A6: {
                name: 'AIN5',
                type: 'input',
                pos: {
                    x: 490,
                    y: 385,
                },
            },
        },
        mode: 'both',
    },
};

Entry.JCBoard.setLanguage = function() {
    return {
        ko: {
            template: {
                jcboard_sonarport: '%1 번 포트를 초음파센서로 사용 %2',
                jcboard_led: '%1 번 LED %2 %3',
                jcboard_buzzer: '%1 음을 %2 초동안 소리내기 %3',
                jcboard_dcmotor: '%1 번 DC모터를 %2 세기로 돌리기 %3',
                jcboard_servomotor: '%1 번 서보모터를 %2도 회전 %3',
                jcboard_pin: '%1 번 디지털핀을 %2 로 설정 %3',
                jcboard_button: '%1 번 버튼 값',
                jcboard_analog: '%1 번 아날로그 값',

                jcboard_on: '켜기',
                jcboard_off: '끄기',
                jcboard_do: '도',
                jcboard_re: '레',
                jcboard_mi: '미',
                jcboard_fa: '파',
                jcboard_sol: '솔',
                jcboard_ra: '라',
                jcboard_si: '시',
            },
        },
        en: {
            template: {
                jcboard_sonarport: '%1 번 포트를 초음파센서로 사용 %2',
                jcboard_led: '%1 번 LED %2 %3',
                jcboard_buzzer: '%1 음을 %2 초동안 소리내기모 %3',
                jcboard_dcmotor: '%1 번 DC모터를 %2 세기로 돌리기 %3',
                jcboard_servomotor: '%1 번 서보모터를 %2도 회전 %3',
                jcboard_pin: '%1 번 디지털핀을 %2 로 설정 %3',
                jcboard_button: '%1 번 버튼 값',
                jcboard_analog: '%1 번 아날로그 값',

                jcboard_on: '켜기',
                jcboard_off: '끄기',
                jcboard_do: '도',
                jcboard_re: '레',
                jcboard_mi: '미',
                jcboard_fa: '파',
                jcboard_sol: '솔',
                jcboard_ra: '라',
                jcboard_si: '시',
            },
        },
    };
};

Entry.JCBoard.blockMenuBlocks = [
    'jcboard_sonarport',
    'jcboard_led',
    'jcboard_buzzer',
    'jcboard_dcmotor',
    'jcboard_servomotor',
    'jcboard_pin',
    'jcboard_button',
    'jcboard_analog',
];

Entry.JCBoard.getBlocks = function() {
    let noteID = 1;
    const moveID = 1;
    const rotID = 1;
    let oldSensorData = [0x26, 0xa8, 0x14, 0xc1, 0x14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    return {
        //region JCBoard
        jcboard_sonarport: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', 0],
                        ['2', 1],
                        ['3', 2],
                        ['4', 3],
                        ['5', 4],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'jcboard_sonarport',
            },
            paramsKeyMap: {
                SONARPORT: 0,
            },
            class: 'JCBoard_Command',
            isNotFor: ['JCBoard'],

            func(sprite, script) {
                if (typeof Entry.hw.sendQueue.CMD == 'undefined') {
                    Entry.hw.sendQueue.CMD = [
                        0x26,
                        0xa8,
                        0x14,
                        0xc1,
                        0x14,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                    ];
                }
                const cmd = Entry.hw.sendQueue.CMD;
                const port = script.getNumberValue('SONARPORT', script);
                cmd[Entry.JCBoard.Cmd.CMD_ULTRASONIC] |= 0x01 << port;
                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },

        jcboard_led: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', 0],
                        ['2', 1],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.jcboard_on, 0],
                        [Lang.template.jcboard_off, 1],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'jcboard_led',
            },
            paramsKeyMap: {
                LED_PORT: 0,
                LED_ACTION: 1,
            },
            class: 'JCBoard_Command',
            isNotFor: ['JCBoard'],

            func(sprite, script) {
                if (typeof Entry.hw.sendQueue.CMD == 'undefined') {
                    Entry.hw.sendQueue.CMD = [
                        0x26,
                        0xa8,
                        0x14,
                        0xc1,
                        0x14,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                    ];
                }
                const cmd = Entry.hw.sendQueue.CMD;
                const what = script.getNumberValue('LED_PORT', script);
                const act = script.getNumberValue('LED_ACTION', script);
                if (act == 0) {
                    cmd[Entry.JCBoard.Cmd.CMD_LED] |= 0x01 << what;
                } else {
                    cmd[Entry.JCBoard.Cmd.CMD_LED] &= ~(0x01 << what);
                }
                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },

        jcboard_buzzer: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.jcboard_do, 1],
                        [Lang.template.jcboard_re, 2],
                        [Lang.template.jcboard_mi, 3],
                        [Lang.template.jcboard_fa, 4],
                        [Lang.template.jcboard_sol, 5],
                        [Lang.template.jcboard_ra, 6],
                        [Lang.template.jcboard_si, 7],
                    ],
                    value: 1,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['0.5', 5],
                        ['0.8', 8],
                        ['1', 10],
                        ['2', 20],
                        ['3', 30],
                        ['4', 40],
                        ['5', 50],
                    ],
                    value: 10,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'jcboard_buzzer',
            },
            paramsKeyMap: {
                BUZZER_NOTE: 0,
                BUZZER_DUR: 1,
            },
            class: 'JCBoard_Command',
            isNotFor: ['JCBoard'],

            func(sprite, script) {
                if (typeof Entry.hw.sendQueue.CMD == 'undefined') {
                    Entry.hw.sendQueue.CMD = [
                        0x26,
                        0xa8,
                        0x14,
                        0xc1,
                        0x14,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                    ];
                }
                const cmd = Entry.hw.sendQueue.CMD;
                const note = script.getNumberValue('BUZZER_NOTE', script);
                const delay = script.getNumberValue('BUZZER_DUR', script);

                cmd[Entry.JCBoard.Cmd.CMD_BUZZER] = note | (noteID << 4);
                cmd[Entry.JCBoard.Cmd.CMD_BUZZER_DUR] = delay;
                noteID = (noteID + 1) & 0x0f;
                console.log(
                    '%d %d %d',
                    cmd[Entry.JCBoard.Cmd.CMD_BUZZER],
                    cmd[Entry.JCBoard.Cmd.CMD_BUZZER_DUR],
                    noteID
                );
                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },

        jcboard_dcmotor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', 0],
                        ['2', 1],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    value: '0',
                    fontSize: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'jcboard_dcmotor',
            },
            paramsKeyMap: {
                MOTOR_WHAT: 0,
                MOTOR_SPEED: 1,
            },
            class: 'JCBoard_Command',
            isNotFor: ['JCBoard'],

            func(sprite, script) {
                if (typeof Entry.hw.sendQueue.CMD == 'undefined') {
                    Entry.hw.sendQueue.CMD = [
                        0x26,
                        0xa8,
                        0x14,
                        0xc1,
                        0x14,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                    ];
                }
                const cmd = Entry.hw.sendQueue.CMD;
                const what = script.getNumberValue('MOTOR_WHAT', script);
                let speed = script.getNumberValue('MOTOR_SPEED', script);
                if (speed > 100) {
                    speed = 100;
                } else if (speed < -100) {
                    speed = -100;
                }
                cmd[Entry.JCBoard.Cmd.CMD_DC0 + what] = speed;
                //console.log("%d %d", 	what, speed);
                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },

        jcboard_servomotor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', 0],
                        ['2', 1],
                        ['3', 2],
                        ['4', 3],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    value: '0',
                    fontSize: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'jcboard_servomotor',
            },
            paramsKeyMap: {
                SERVO_WHAT: 0,
                SERVO_DEGREE: 1,
            },
            class: 'JCBoard_Command',
            isNotFor: ['JCBoard'],

            func(sprite, script) {
                if (typeof Entry.hw.sendQueue.CMD == 'undefined') {
                    Entry.hw.sendQueue.CMD = [
                        0x26,
                        0xa8,
                        0x14,
                        0xe1,
                        0x14,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                    ];
                }
                const cmd = Entry.hw.sendQueue.CMD;
                const what = script.getNumberValue('SERVO_WHAT', script);
                let degree = script.getNumberValue('SERVO_DEGREE', script);
                if (degree < -90) {
                    degree = -90;
                } else if (degree > 90) {
                    degree = 90;
                }
                cmd[Entry.JCBoard.Cmd.CMD_SERVO0 + what] = degree;
                console.log('servo what:%d degree:%d', what, degree);
                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },

        jcboard_pin: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', 0],
                        ['2', 1],
                        ['3', 2],
                        ['4', 3],
                        ['5', 4],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['HIGH', 0],
                        ['LOW', 1],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'jcboard_pin',
            },
            paramsKeyMap: {
                PIN_WHAT: 0,
                PIN_STATE: 1,
            },
            class: 'JCBoard_Command',
            isNotFor: ['JCBoard'],

            func(sprite, script) {
                if (typeof Entry.hw.sendQueue.CMD == 'undefined') {
                    Entry.hw.sendQueue.CMD = [
                        0x26,
                        0xa8,
                        0x14,
                        0xe1,
                        0x14,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                        0x00,
                    ];
                }
                const cmd = Entry.hw.sendQueue.CMD;
                const what = script.getNumberValue('PIN_WHAT', script);
                const state = script.getNumberValue('PIN_STATE', script);
                if (state == 0) {
                    cmd[Entry.JCBoard.Cmd.CMD_PIN] |= 0x01 << what;
                } else {
                    cmd[Entry.JCBoard.Cmd.CMD_PIN] &= ~(0x01 << what);
                }
                //console.log("servo what:%d degree:%d", 	what, degree);
                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },

        jcboard_button: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', 0],
                        ['2', 1],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'jcboard_button',
            },
            paramsKeyMap: {
                BUTTON_WHAT: 0,
            },
            class: 'JCBoard_Sensor',
            isNotFor: ['JCBoard'],
            func(sprite, script) {
                let sensorData = Entry.hw.portData.CMD;
                const what = script.getNumberValue('BUTTON_WHAT', script);
                sensorData = sensorData[0] == 0x26 ? sensorData : oldSensorData;
                oldSensorData = sensorData;
                return !!(sensorData[Entry.JCBoard.Sensor.SENSOR_BUTTON] & (0x01 << what));
            },
            syntax: { js: [], py: [] },
        },

        jcboard_analog: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', 0],
                        ['2', 1],
                        ['3', 2],
                        ['4', 3],
                        ['5', 4],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'jcboard_analog',
            },
            paramsKeyMap: {
                ANALOG_WHAT: 0,
            },
            class: 'JCBoard_Sensor',
            isNotFor: ['JCBoard'],
            func(sprite, script) {
                let sensorData = Entry.hw.portData.CMD;
                const what = script.getNumberValue('ANALOG_WHAT', script);
                sensorData = sensorData[0] == 0x26 ? sensorData : oldSensorData;
                oldSensorData = sensorData;
                return sensorData[Entry.JCBoard.Sensor.SENSOR_AIN0 + what];
            },
            syntax: { js: [], py: [] },
        },
    };
};

module.exports = Entry.JCBoard;
