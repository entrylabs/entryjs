'use strict';

Entry.UglyBot = {
    Cmd: {
        CMD_GOLDENKEY0: 0,
        CMD_GOLDENKEY1: 1,
        CMD_GOLDENKEY2: 2,
        CMD_GOLDENKEY3: 3,
        CMD_LENGTH: 4,
        CMD_CHECKSUM: 5,
        CMD_LED: 6,
        CMD_BUZZER_TUNE: 7,
        CMD_BUZZER_DELAY: 8,
        CMD_MOTOR_RIGHT: 9,
        CMD_MOTOR_LEFT: 10,
        CMD_MOVE_LOW: 11,
        CMD_MOVE_HIGH: 12,
        CMD_ROT_LOW: 13,
        CMD_ROT_HIGH: 14,
        CMD_SERVO1: 15,
        CMD_SERVO2: 16,
        CMD_IRPIN: 17,
    },
    Sensor: {
        ENSOR_GOLDENKEY0: 0,
        ENSOR_GOLDENKEY1: 1,
        ENSOR_GOLDENKEY2: 2,
        ENSOR_GOLDENKEY3: 3,
        ENSOR_LENGTH: 4,
        ENSOR_CHECKSUM: 5,
        ENSOR_EXBOARDTYPE: 6,
        SENSOR_BUTTON: 7,
        SENSOR_IR_LEFT: 8,
        SENSOR_IR_MID: 9,
        SENSOR_IR_RIGHT: 10,
        SENSOR_ULTRASONIC: 11,
        SENSOR_JOYSTICK_LR: 12,
        SENSOR_JOYSTICK_TB: 13,
        SENSOR_GYRO_LR: 14,
        SENSOR_GYRO_TB: 15,
        SENSOR_SOUND: 16,
        SENSOR_PHOTO: 17,
    },
    setZero() {
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
        Entry.hw.update();
    },
    id: '1D.3',
    name: 'UglyBot',
    url: 'http://www.junilab.co.kr',
    imageName: 'uglybot.png',
    title: {
        en: 'UglyBot',
        ko: '어글리봇',
    },
    monitorTemplate: {
        imgPath: 'hw/uglybot.png',
        width: 600,
        height: 460,
        listPorts: {
            A6: {
                name: '조이스틱좌우',
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
            A7: {
                name: '조이스틱앞뒤',
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
            A8: {
                name: '기울기센서좌우',
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
            A9: {
                name: '기울기센서앞뒤',
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
            A10: {
                name: '소리센서',
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
            A11: {
                name: '조도센서',
                type: 'input',
                pos: {
                    x: 0,
                    y: 0,
                },
            },
        },
        ports: {
            A0: {
                name: '확장보드',
                type: 'input',
                pos: {
                    x: 280,
                    y: 230,
                },
            },
            A1: {
                name: '버튼',
                type: 'input',
                pos: {
                    x: 585,
                    y: 160,
                },
            },
            A2: {
                name: '왼쪽 적외선센서',
                type: 'input',
                pos: {
                    x: 200,
                    y: 310,
                },
            },
            A3: {
                name: '중간 적외선센서',
                type: 'input',
                pos: {
                    x: 200,
                    y: 230,
                },
            },
            A4: {
                name: '오른쪽 적외선센서',
                type: 'input',
                pos: {
                    x: 200,
                    y: 160,
                },
            },
            A5: {
                name: '초음파센서',
                type: 'input',
                pos: {
                    x: 20,
                    y: 140,
                },
            },
        },
        mode: 'both',
    },
};

Entry.UglyBot.setLanguage = function() {
    return {
        ko: {
            template: {
                uglybot_led: '%1 LED %2 %3',
                uglybot_buzzer: '%1 음을 %2초동안 소리내기 %3',
                uglybot_motor: '%1모터를 %2세기로 회전 %3',
                uglybot_move: '%1(으)로 %2cm 이동 %3',
                uglybot_rotation: '%1방향으로 %2도 회전 %3',
                uglybot_servo: '%1번 서보모터를 %2도 회전 %3',
                uglybot_irpin: '%1 적외선 센서 %2 %3',
                uglybot_button: '버튼 값',
                uglybot_ir: '%1 적외선센서 값',
                uglybot_ultrasonic: '초음파센서 값',
                uglybot_joystick: '%1 조이스틱 값',
                uglybot_tilt: '%1 기울기 값',
                uglybot_sound: '소리센서 값',
                uglybot_illum: '조도센서 값',
                uglybot_left: '왼쪽',
                uglybot_mid: '중간',
                uglybot_right: '오른쪽',
                uglybot_on: '켜기',
                uglybot_off: '끄기',
                uglybot_do: '도',
                uglybot_re: '레',
                uglybot_mi: '미',
                uglybot_fa: '파',
                uglybot_sol: '솔',
                uglybot_ra: '라',
                uglybot_si: '시',
                uglybot_front: '앞',
                uglybot_back: '뒤',
                uglybot_cc: '시계',
                uglybot_rcc: '반시계',
                uglybot_topbottom: '앞뒤',
                uglybot_leftright: '좌우',
            },
            Blocks: {
                uglybot_joystick_lr: '조이스틱좌우',
                uglybot_yoystick_tb: '조이스틱앞뒤',
                uglybot_gyro_lr: '기울기센서좌우',
                uglybot_gyro_tb: '기울기센서앞뒤',
                uglybot_sound2: '소리센서',
                uglybot_photo2: '조도센서',
                uglybot_exboard: '확장보드',
                uglybot_button2: '버튼',
                uglybot_irleft: '왼쪽 적외선센서',
                uglybot_irmid: '중간 적외선센서',
                uglybot_irright: '오른쪽 적외선센서',
                uglybot_ultrsonic2: '초음파센서',
            },
        },
        en: {
            template: {
                uglybot_led: '%1 LED %2 %3',
                uglybot_buzzer: '%1 음을 %2초동안 소리내기 %3',
                uglybot_motor: '%1모터를 %2세기로 회전 %3',
                uglybot_move: '%1(으)로 %2cm 이동 %3',
                uglybot_rotation: '%1(으)로 %2도 회전 %3',
                uglybot_servo: '%1번 서보모터를 %2도 회전 %3',
                uglybot_irpin: '%1 적외선 센서 %2 %3',
                uglybot_button: '버튼 값',
                uglybot_ir: '%1 적외선센서 값',
                uglybot_ultrasonic: '초음파센서 값',
                uglybot_joystick: '%1 조이스틱 값',
                uglybot_tilt: '%1 기울기 값',
                uglybot_sound: '소리센서 값',
                uglybot_illum: '조도센서 값',
                uglybot_left: '왼쪽',
                uglybot_mid: '중간',
                uglybot_right: '오른쪽',
                uglybot_on: '켜기',
                uglybot_off: '끄기',
                uglybot_do: '도',
                uglybot_re: '레',
                uglybot_mi: '미',
                uglybot_fa: '파',
                uglybot_sol: '솔',
                uglybot_ra: '라',
                uglybot_si: '시',
                uglybot_front: '앞',
                uglybot_back: '뒤',
                uglybot_cc: '시계',
                uglybot_rcc: '반시계',
                uglybot_topbottom: '앞뒤',
                uglybot_leftright: '좌우',
            },
            Blocks: {
                uglybot_joystick_lr: '조이스틱좌우',
                uglybot_yoystick_tb: '조이스틱앞뒤',
                uglybot_gyro_lr: '기울기센서좌우',
                uglybot_gyro_tb: '기울기센서앞뒤',
                uglybot_sound2: '소리센서',
                uglybot_photo2: '조도센서',
                uglybot_exboard: '확장보드',
                uglybot_button2: '버튼',
                uglybot_irleft: '왼쪽 적외선센서',
                uglybot_irmid: '중간 적외선센서',
                uglybot_irright: '오른쪽 적외선센서',
                uglybot_ultrsonic2: '초음파센서',
            },
        },
    };
};

Entry.UglyBot.blockMenuBlocks = [
    'uglybot_led',
    'uglybot_buzzer',
    'uglybot_motor',
    'uglybot_move',
    'uglybot_rotation',
    'uglybot_servo',
    'uglybot_irpin',
    'uglybot_button',
    'uglybot_ir',
    'uglybot_ultrasonic',
    'uglybot_joystick',
    'uglybot_tilt',
    'uglybot_sound',
    'uglybot_illum',
];

Entry.UglyBot.getBlocks = function() {
    let noteID = 1;
    let moveID = 1;
    let rotID = 1;
    let oldSensorData = [0x26, 0xa8, 0x14, 0xe1, 0x14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    return {
        //region UglyBot
        uglybot_led: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.uglybot_right, 0],
                        [Lang.template.uglybot_left, 1],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.uglybot_on, 0],
                        [Lang.template.uglybot_off, 1],
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
                type: 'uglybot_led',
            },
            paramsKeyMap: {
                LED_WHAT: 0,
                LED_ACTION: 1,
            },
            class: 'UglyBot_Command',
            isNotFor: ['UglyBot'],

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
                const what = script.getNumberValue('LED_WHAT', script);
                const act = script.getNumberValue('LED_ACTION', script);
                if (act == 0) {
                    cmd[Entry.UglyBot.Cmd.CMD_LED] |= 0x01 << what;
                } else {
                    cmd[Entry.UglyBot.Cmd.CMD_LED] &= ~(0x01 << what);
                }
                cmd[Entry.UglyBot.Cmd.CMD_LED] |= 0x10;
                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },

        uglybot_buzzer: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.uglybot_do, 1],
                        [Lang.template.uglybot_re, 2],
                        [Lang.template.uglybot_mi, 3],
                        [Lang.template.uglybot_fa, 4],
                        [Lang.template.uglybot_sol, 5],
                        [Lang.template.uglybot_ra, 6],
                        [Lang.template.uglybot_si, 7],
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
                type: 'uglybot_buzzer',
            },
            paramsKeyMap: {
                BUZZER_NOTE: 0,
                BUZZER_DELAY: 1,
            },
            class: 'UglyBot_Command',
            isNotFor: ['UglyBot'],

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
                const note = script.getNumberValue('BUZZER_NOTE', script);
                const delay = script.getNumberValue('BUZZER_DELAY', script);

                cmd[Entry.UglyBot.Cmd.CMD_BUZZER_TUNE] = note | (noteID << 4);
                cmd[Entry.UglyBot.Cmd.CMD_BUZZER_DELAY] = delay;
                noteID = (noteID + 1) & 0x0f;
                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },

        uglybot_motor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.uglybot_right, 0],
                        [Lang.template.uglybot_left, 1],
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
                type: 'uglybot_motor',
            },
            paramsKeyMap: {
                MOTOR_WHAT: 0,
                MOTOR_SPEED: 1,
            },
            class: 'UglyBot_Command',
            isNotFor: ['UglyBot'],

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
                const what = script.getNumberValue('MOTOR_WHAT', script);
                let speed = script.getNumberValue('MOTOR_SPEED', script);
                if (speed > 100) {
                    speed = 100;
                } else if (speed < -100) {
                    speed = -100;
                }
                cmd[Entry.UglyBot.Cmd.CMD_MOTOR_RIGHT + what] = speed;
                //console.log("%d %d", 	what, speed);
                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },

        uglybot_move: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.uglybot_front, 0],
                        [Lang.template.uglybot_back, 1],
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
                type: 'uglybot_move',
            },
            paramsKeyMap: {
                MOVE_DIRECTION: 0,
                MOVE_DISTANCE: 1,
            },
            class: 'UglyBot_Command',
            isNotFor: ['UglyBot'],

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
                const direction = script.getNumberValue('MOVE_DIRECTION', script);
                let distance = script.getNumberValue('MOVE_DISTANCE', script);
                distance = direction == 1 ? -1 * distance : distance;
                if (distance > 1000) {
                    distance = 1000;
                } else if (distance < -1000) {
                    distance = -1000;
                }
                cmd[Entry.UglyBot.Cmd.CMD_MOVE_LOW] = distance & 0xff;
                cmd[Entry.UglyBot.Cmd.CMD_MOVE_HIGH] = (distance >> 8) & 0x0f;
                cmd[Entry.UglyBot.Cmd.CMD_MOVE_HIGH] |= moveID << 4;
                moveID = (moveID + 1) & 0x0f;
                //console.log("distance:%d moveID:%d", 	distance, moveID);
                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },

        uglybot_rotation: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.uglybot_cc, 0],
                        [Lang.template.uglybot_rcc, 1],
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
                type: 'uglybot_rotation',
            },
            paramsKeyMap: {
                ROT_DIRECTION: 0,
                ROT_DEGREE: 1,
            },
            class: 'UglyBot_Command',
            isNotFor: ['UglyBot'],

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
                const direction = script.getNumberValue('ROT_DIRECTION', script);
                let degree = script.getNumberValue('ROT_DEGREE', script);
                degree = direction == 1 ? -1 * degree : degree;
                degree = degree > 1000 ? 1000 : degree;
                degree = degree < -1000 ? -1000 : degree;

                cmd[Entry.UglyBot.Cmd.CMD_ROT_LOW] = degree & 0xff;
                cmd[Entry.UglyBot.Cmd.CMD_ROT_HIGH] = (degree >> 8) & 0x0f;
                cmd[Entry.UglyBot.Cmd.CMD_ROT_HIGH] |= rotID << 4;
                rotID = (rotID + 1) & 0x0f;
                //console.log("degree:%d rotID:%d", 	degree, rotID);
                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },

        uglybot_servo: {
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
                type: 'uglybot_servo',
            },
            paramsKeyMap: {
                SERVO_WHAT: 0,
                SERVO_DEGREE: 1,
            },
            class: 'UglyBot_Command',
            isNotFor: ['UglyBot'],

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
                degree = degree < -90 ? -90 : degree;
                degree = degree > 90 ? 90 : degree;
                cmd[Entry.UglyBot.Cmd.CMD_SERVO1 + what] = degree & 0xff;
                //console.log("servo what:%d degree:%d", 	what, degree);
                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },

        uglybot_irpin: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.uglybot_left, 0],
                        [Lang.template.uglybot_mid, 1],
                        [Lang.template.uglybot_right, 2],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.uglybot_on, 0],
                        [Lang.template.uglybot_off, 1],
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
                type: 'uglybot_irpin',
            },
            paramsKeyMap: {
                IRPIN_WHAT: 0,
                IRPIN_ACT: 1,
            },
            class: 'UglyBot_Command',
            isNotFor: ['UglyBot'],

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
                const what = script.getNumberValue('IRPIN_WHAT', script);
                const act = script.getNumberValue('IRPIN_ACT', script);
                if (act == 0) {
                    cmd[Entry.UglyBot.Cmd.CMD_IRPIN] |= 0x01 << what;
                } else {
                    cmd[Entry.UglyBot.Cmd.CMD_IRPIN] &= ~(0x01 << what);
                }
                Entry.hw.update();
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },

        uglybot_button: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [null],
                type: 'uglybot_button',
            },
            class: 'UglyBot_Sensor',
            isNotFor: ['UglyBot'],
            func(sprite, script) {
                let sensorData = Entry.hw.portData.CMD;
                sensorData = sensorData[0] == 0x26 ? sensorData : oldSensorData;
                oldSensorData = sensorData;
                //console.log("%d %d", sensorData[6], sensorData[7]);
                return sensorData[Entry.UglyBot.Sensor.SENSOR_BUTTON];
            },
            syntax: { js: [], py: [] },
        },

        uglybot_ir: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.uglybot_left, 0],
                        [Lang.template.uglybot_mid, 1],
                        [Lang.template.uglybot_right, 2],
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
                type: 'uglybot_ir',
            },
            paramsKeyMap: {
                IR_POS: 0,
            },
            class: 'UglyBot_Sensor',
            isNotFor: ['UglyBot'],
            func(sprite, script) {
                let sensorData = Entry.hw.portData.CMD;
                const pos = script.getNumberValue('IR_POS', script);
                sensorData = sensorData[0] == 0x26 ? sensorData : oldSensorData;
                oldSensorData = sensorData;
                //console.log("%d %d %d", sensorData[8], sensorData[9], sensorData[10]);
                return sensorData[Entry.UglyBot.Sensor.SENSOR_IR_LEFT + pos];
            },
            syntax: { js: [], py: [] },
        },

        uglybot_ultrasonic: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [null],
                type: 'uglybot_ultrasonic',
            },
            class: 'UglyBot_Sensor',
            isNotFor: ['UglyBot'],
            func(sprite, script) {
                let sensorData = Entry.hw.portData.CMD;
                sensorData = sensorData[0] == 0x26 ? sensorData : oldSensorData;
                oldSensorData = sensorData;
                //console.log("%d", sensorData[11]);
                return sensorData[Entry.UglyBot.Sensor.SENSOR_ULTRASONIC];
            },
            syntax: { js: [], py: [] },
        },

        uglybot_joystick: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.uglybot_leftright, 0],
                        [Lang.template.uglybot_topbottom, 1],
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
                type: 'uglybot_joystick',
            },
            paramsKeyMap: {
                JOYSTICK_WHAT: 0,
            },
            class: 'UglyBot_Sensor',
            isNotFor: ['UglyBot'],
            func(sprite, script) {
                let sensorData = Entry.hw.portData.CMD;
                const exBoardType = sensorData[Entry.UglyBot.Sensor.ENSOR_EXBOARDTYPE];
                const what = script.getNumberValue('JOYSTICK_WHAT', script);
                sensorData = sensorData[0] == 0x26 ? sensorData : oldSensorData;
                oldSensorData = sensorData;
                //console.log("%d %d", sensorData[12], sensorData[13]);
                if (exBoardType == 4) {
                    if (what == 1) {
                        return sensorData[Entry.UglyBot.Sensor.SENSOR_JOYSTICK_TB];
                    } else {
                        const aa = sensorData[Entry.UglyBot.Sensor.SENSOR_JOYSTICK_LR];
                        return aa < 127 ? aa : aa - 256;
                    }
                } else {
                    const aa = sensorData[Entry.UglyBot.Sensor.SENSOR_JOYSTICK_LR + what];
                    return aa < 127 ? aa : aa - 256;
                }
            },
            syntax: { js: [], py: [] },
        },

        uglybot_tilt: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.uglybot_leftright, 0],
                        [Lang.template.uglybot_topbottom, 1],
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
                type: 'uglybot_tilt',
            },
            paramsKeyMap: {
                GYRO_WHAT: 0,
            },
            class: 'UglyBot_Sensor',
            isNotFor: ['UglyBot'],
            func(sprite, script) {
                let sensorData = Entry.hw.portData.CMD;
                const what = script.getNumberValue('GYRO_WHAT', script);
                sensorData = sensorData[0] == 0x26 ? sensorData : oldSensorData;
                oldSensorData = sensorData;
                //console.log("%d %d", sensorData[14], sensorData[15]);
                const aa = sensorData[Entry.UglyBot.Sensor.SENSOR_GYRO_LR + what];
                return aa < 127 ? aa : aa - 256;
            },
            syntax: { js: [], py: [] },
        },

        uglybot_sound: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [null],
                type: 'uglybot_sound',
            },
            class: 'UglyBot_Sensor',
            isNotFor: ['UglyBot'],
            func(sprite, script) {
                let sensorData = Entry.hw.portData.CMD;
                sensorData = sensorData[0] == 0x26 ? sensorData : oldSensorData;
                oldSensorData = sensorData;
                //console.log("%d", sensorData[16]);
                const aa = sensorData[Entry.UglyBot.Sensor.SENSOR_SOUND];
                return aa < 128 ? aa : aa - 256;
            },
            syntax: { js: [], py: [] },
        },

        uglybot_illum: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [null],
                type: 'uglybot_illum',
            },
            class: 'UglyBot_Sensor',
            isNotFor: ['UglyBot'],
            func(sprite, script) {
                let sensorData = Entry.hw.portData.CMD;
                sensorData = sensorData[0] == 0x26 ? sensorData : oldSensorData;
                oldSensorData = sensorData;
                //console.log("%d", sensorData[17]);
                return sensorData[Entry.UglyBot.Sensor.SENSOR_PHOTO];
            },
            syntax: { js: [], py: [] },
        },
    };
};

module.exports = Entry.UglyBot;
