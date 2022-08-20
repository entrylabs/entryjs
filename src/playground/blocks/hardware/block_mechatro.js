'use strict';

/*******************************************************
 * 명명 규칙
 *
 * 함수명, 변수명 : 첫 글자 소문자, 다음 단어 첫 글자 대문자, 두단어 이상 조합     예) nameRull
 * 키  값 : 모두 대문자, 단어사이 '_' 사용함                                    예) NAME_RULL
 *
 *********************************************************/

class mechatro {
    constructor() {
        this.id = '1F.1';
        this.url = 'http://cafe.naver.com/easybread';
        this.name = 'mechatro';
        this.imageName = 'mechatro_nano.png';
        this.title = {
            ko: '메카트로',
            en: 'mechatro',
        };

        this.monitorTemplate = {
            imgPath: 'hw/transparent.png',
            width: 500,
            height: 434,
            listPorts: {
                '2': {
                    name: ` D2 `,
                    type: 'input',
                    pos: { x: 0, y: 0 },
                },
                '4': {
                    name: ` D4 `,
                    type: 'input',
                    pos: { x: 0, y: 0 },
                },
                '5': {
                    name: ` D5 `,
                    type: 'input',
                    pos: { x: 0, y: 0 },
                },
                '6': {
                    name: ` D6 `,
                    type: 'input',
                    pos: { x: 0, y: 0 },
                },
                '7': {
                    name: ` D7 `,
                    type: 'input',
                    pos: { x: 0, y: 0 },
                },
                '10': {
                    name: ` D10 `,
                    type: 'input',
                    pos: { x: 0, y: 0 },
                },
                '14': {
                    name: `MA current`,
                    type: 'input',
                    pos: { x: 0, y: 0 },
                },
                '15': {
                    name: ` MB current `,
                    type: 'input',
                    pos: { x: 0, y: 0 },
                },
                '16': {
                    name: ` A2 `,
                    type: 'input',
                    pos: { x: 0, y: 0 },
                },
                '17': {
                    name: ` A3 `,
                    type: 'input',
                    pos: { x: 0, y: 0 },
                },
                '18': {
                    name: ` A4 `,
                    type: 'input',
                    pos: { x: 0, y: 0 },
                },
                '19': {
                    name: ` A5 `,
                    type: 'input',
                    pos: { x: 0, y: 0 },
                },
                '20': {
                    name: ` A6 `,
                    type: 'input',
                    pos: { x: 0, y: 0 },
                },
                '21': {
                    name: ` A7 `,
                    type: 'input',
                    pos: { x: 0, y: 0 },
                },
                com: {
                    name: ` inform `,
                    type: 'input',
                    pos: { x: 0, y: 0 },
                },
            },
            mode: 'both',
        };

        this.portMode = {
            SET_GROUP_1: 0x80,
            SET_INIT_DEVICE: 0x80,
            SET_DIGITAL_OUT: 0x81,
            SET_NO_TONE: 0x82,
            SET_PORT_DISABLE: 0x86,
            SET_BLUE_PW: 0x87,

            SET_ALL_SERVO_RUNTIME: 0x88,
            SET_MOTOR_CURRENT: 0x8A,
            SET_MOTOR_CURRENT_A: 0x8A,
            SET_MOTOR_CURRENT_B: 0X8B,

            SET_MOTOR_SPEED_Free: 0x90,
            SET_MOTOR_SPEED_Fast: 0x94,

            SET_TONE: 0x98,
            SET_PWM: 0x9C,

            SET_GROUP_2: 0xA0,
            SET_SERVO_POSITION: 0xA0,

            SET_GROUP_3: 0xC0,
            SET_SERVO_SPEED: 0xC0,
            SET_SERVO_RUNTIME: 0xD0,

            SET_GROUP_INPUT: 0xE0,
            SET_ANALOG_IN: 0xE0,
            SET_ULTRASONIC: 0xE8,
            SET_DIGITAL_IN: 0xF0,
        };

        this.prev_sensor_data = { '2': 0, '4': 0, '5': 0, '6': 0, '7': 0, '10': 0 };
        this.tonePin = 0;

        this.eventState = {
            FALLING: {
                '2': false,
                '4': false,
                '5': false,
                '6': false,
                '7': false,
                '10': false,
                TRIGGER: false,
            },
            RISING: {
                '2': false,
                '4': false,
                '5': false,
                '6': false,
                '7': false,
                '10': false,
                TRIGGER: false,
            },
            ENABLE: { '2': true, '4': true, '5': true, '6': true, '7': true, '10': true },
        };

        // 순서에 따라 화면에 보임
        this.blockMenuBlocks = [
            'mechatro_event_rising_falling',  // Add 2020-07-04
            'mechatro_get_digital',
            'mechatro_get_analog_judgement',  // Add 2022-05-22
            'mechatro_get_sensor_value',
            'mechatro_get_dc_motor_current',
            'mechatro_get_ultrasonic_value',
            'mechatro_get_temperature',
            'mechatro_set_get_sensor_value_map',
            'mechatro_set_digital',
            'mechatro_set_pwm',
            'mechatro_set_tone',
            'mechatro_set_tone_time',
            'mechatro_set_dc_motor',
            'mechatro_set_servo_position',
            'mechatro_set_servo_positions',
            //'mechatro_set_servo_speed',
            'mechatro_set_blue_pw',
        ];
    }
    setLanguage() {
        return {
            ko: {
                // ko.js에 작성하던 내용
                template: {
                    mechatro_event_rising_falling: "%1 %2 이 %3이 될 때",
                    mechatro_get_dc_motor_current: "%1모터 전류값[mA]",
                    mechatro_get_digital: "%1 디지털 값",
                    mechatro_get_analog_judgement: "%1 %2 %3",
                    mechatro_get_sensor_value: "%1 센서값",
                    mechatro_set_get_sensor_value_map: '%1 의 범위를 %2 ~ %3 에서 %4 ~ %5 로 바꾼값',
                    mechatro_get_ultrasonic_value: "초음파센서 Trig %1 Echo %2 의 거리값 [cm]",
                    mechatro_get_temperature: "%1 온도 센서 값 (TMP36)",
                    mechatro_set_blue_pw: "블루투스 비밀번호 : %1%2%3%4로 정하기%5",
                    mechatro_set_dc_motor: "%1모터 속도 %2로 정하기%3",
                    mechatro_set_digital: "%1번 %2 %3",
                    mechatro_set_pwm: "%1PWM을 %2%로 정하기 %3",
                    mechatro_set_servo_position: "%1서보모터 %2˚ 까지 1초당 %3˚씩 이동하기 %4",
                    mechatro_set_servo_positions: "서보각도 D2%1 D5%2 D6%3 D10%4 작동시간: %5초",
                    //mechatro_set_servo_speed: "%1서보모터 속도 : 1초당 %2도로 정하기 %3",
                    mechatro_set_threshold: "%1 센서 감도 : %2로 정하기%3",
                    mechatro_set_tone: "%1버저 %2 %3 음으로 연주 %4",
                    mechatro_set_tone_time: "%1버저 %2 %3 음으로 %4 초 연주 %5",
                },
            },
            en: {
                // en.js에 작성하던 내용
                template: {
                    mechatro_event_rising_falling: "%1 When %2 is turned %3",
                    mechatro_get_dc_motor_current: 'Get 1%motor current',
                    mechatro_get_digital: '%1',
                    mechatro_get_analog_judgement: "%1 %2 %3",
                    mechatro_get_sensor_value: 'Analog %1 Sensor value',
                    mechatro_set_get_sensor_value_map: 'Map Value %1 %2 ~ %3 to %4 ~ %5',
                    mechatro_get_ultrasonic_value: "Read ultrasonic sensor trig pin %1 echo pin %2",
                    mechatro_get_temperature: "temperature %1 Sensor (TMP36)",
                    mechatro_set_blue_pw: "Change PW of Bluetooth to %1%2%3%4 %5",
                    mechatro_set_dc_motor: "Set %1 motor speed to %2 %3",
                    mechatro_set_digital: "Digital %1 Pin %2 %3",
                    mechatro_set_pwm: "Digital %1 Pin %2 %3",
                    mechatro_set_servo_position: "Set servo pin %1 angle %2, speed %3[˚/1s] %4",
                    mechatro_set_servo_positions: "%Servo 1 %2 %3 %4 time %5",
                    //mechatro_set_servo_speed: "Set servo pin %1 speed %2 degree per second %3",
                    mechatro_set_threshold: "Set %1 threshold : %2%3",
                    mechatro_set_tone: "Play tone pin %1 on note %2 octave %3 %4",
                    mechatro_set_tone_time: "Play tone pin %1 on note %2 octave %3 beat %4 %5",
                },
            },
        };
    }

    setZero() {                  // 엔트리 정지 시 하드웨어 초기화 로직
        Entry.hw.sendQueue = {
            SEND_DATA: {}, // key 값이 없으면 entry-HW에서 entryJS 정지로 인식
        };
        Entry.hw.update(); // 반드시 업데이트 해야 전송됨
        this.eventState = {
            FALLING: {
                '2': false,
                '4': false,
                '5': false,
                '6': false,
                '7': false,
                '10': false,
                TRIGGER: false,
            },
            RISING: {
                '2': false,
                '4': false,
                '5': false,
                '6': false,
                '7': false,
                '10': false,
                TRIGGER: false,
            },
            ENABLE: { '2': true, '4': true, '5': true, '6': true, '7': true, '10': true },
        };
    }

    afterReceive(pd) {
        /*
        if (!Entry.engine.isState('run')) {
            // 정지시에도 이전값 저장으로 실행하는 순간 발생할 수 있는 이벤트 발생을 금지
            // ??????????????????????????????????????????????????????????????????????????????????????????
            // 값이 상시 없데이트 되므로 불필요할 것으로 생각됨, 필요한지 확인필요
            Object.keys(this.prev_sensor_data).forEach((key) => {
                this.prev_sensor_data[key] = pd[key];
            });
            //console.log("afterReceive ", "run");
            return;
        }
        else {
            //console.log("afterReceive ", "stop");
        }
*/
        Object.keys(this.prev_sensor_data).forEach((key) => {
            // 이벤트 사용 가능 조사 (초음파, PWM, TONE 아웃풋 포트 이벤트 사용 불가)
            if (this.eventState.ENABLE[key]) {
                const new_data = pd[key];
                if (this.prev_sensor_data[key] ^ new_data) {
                    if (new_data) {
                        this.eventState.RISING[key] = true;
                        this.eventState.RISING.TRIGGER = true;
                    } else {
                        this.eventState.FALLING[key] = true;
                        this.eventState.FALLING.TRIGGER = true;
                    }
                }
                this.prev_sensor_data[key] = new_data;
            }
        });

        if (this.eventState.RISING.TRIGGER) {
            this.eventState.RISING.TRIGGER = false;
            Entry.engine.fireEvent('event_digital_input');
        }

        if (this.eventState.FALLING.TRIGGER) {
            this.eventState.FALLING.TRIGGER = false;
            Entry.engine.fireEvent('event_digital_input');
        }
    }

    //this.SEND_DATA = {
    //    portNo:{
    //        mode : 0,
    //        value: 0,
    //    },
    //};

    transferModeValue(portNo, mode, value) {
        if (Entry.hw.sendQueue.SEND_DATA == undefined) {
            Entry.hw.sendQueue = {
                SEND_DATA: {},
            };
        }
        Entry.hw.sendQueue.SEND_DATA[portNo] = {
            MODE: mode,
            VALUE: value,
        };
    }

    transferMode(portNo, mode) {
        if (Entry.hw.sendQueue.SEND_DATA == undefined) {
            Entry.hw.sendQueue = {
                SEND_DATA: {},
            };
        }
        Entry.hw.sendQueue.SEND_DATA[portNo] = {
            MODE: mode,
        };
    }

    getBlocks() {
        return {
            mechatro_event_rising_falling: {  // Digital Low Hit Only, 
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#fff',
                skeleton: 'basic_event',
                params: [
                    {
                        type: 'Indicator',
                        img: 'block_icon/start_icon_hardware.svg',
                        size: 14,
                        position: { x: 0, y: -2 },
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
                        value: '2',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            ['참', '1'],
                            ['거짓', '0'],
                        ],
                        value: '1',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                def: {
                    params: [null, '2', '1'],
                    type: 'mechatro_event_rising_falling',
                },
                paramsKeyMap: {
                    PORT: 1,
                    EDGE: 2,
                },
                class: 'MechatroStart',
                isNotFor: ['mechatro'],
                event: 'event_digital_input',
                func(sprite, script) {
                    const portNo = script.getNumberField('PORT', script);
                    const toggle = script.getNumberField('EDGE', script);
                    if (toggle) {
                        if (Entry.mechatro.eventState.RISING[portNo]) {
                            Entry.mechatro.eventState.RISING[portNo] = false;
                            return script.callReturn();
                        }
                    } else {
                        if (Entry.mechatro.eventState.FALLING[portNo]) {
                            Entry.mechatro.eventState.FALLING[portNo] = false;
                            return script.callReturn();
                        }
                    }
                    return this.die();
                },
                syntax: { js: [], py: [] },
            },
            mechatro_get_digital: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#fff',
                skeleton: 'basic_boolean_field',
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
                class: 'MechatroJudgement',
                isNotFor: ['mechatro'],
                func(sprite, script) {
                    var portNo = script.getNumberField('PORT', script);
                    var mode;
                    var value;
                    mode = Entry.mechatro.portMode.SET_DIGITAL_IN;

                    Entry.mechatro.transferMode(portNo, mode);

                    if (Entry.hw.portData[portNo] !== undefined) {
                        value = Entry.hw.portData[portNo];
                        return value;
                    } else {
                        return 0;
                    }
                },
                syntax: { js: [], py: [] },
            },

            mechatro_get_analog_judgement: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#fff',
                skeleton: 'basic_boolean_field',
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
                        type: 'Dropdown',
                        options: [
                            ['=', 'EQUAL'],
                            ['!=', 'NOT_EQUAL'],
                            ['>', 'GREATER'],
                            ['<', 'LESS'],
                            ['≥', 'GREATER_OR_EQUAL'],
                            ['≤', 'LESS_OR_EQUAL'],
                        ],
                        value: 'LESS',
                        fontSize: 10,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        noArrow: true,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                    },
                ],
                events: {},
                def: {
                    params: [
                        null,
                        'LESS',
                        {
                            type: 'text',
                            params: ['512'],
                        }],
                    type: 'mechatro_get_analog_judgement',
                },
                paramsKeyMap: {
                    PORT: 0,
                    OPERATOR: 1,
                    RIGHTHAND: 2,
                },
                class: 'MechatroJudgement',
                isNotFor: ['mechatro'],
                func(sprite, script) {
                    const operator = script.getField('OPERATOR', script);
                    let [portNo, rightValue] = script.getValues(
                        ['PORT', 'RIGHTHAND'],
                        script
                    );
                    let mode;
                    let leftValue;

                    mode = Entry.mechatro.portMode.SET_ANALOG_IN;
                    Entry.mechatro.transferMode(portNo, mode);

                    if (typeof rightValue === 'string' && rightValue.length) {
                        const rightNumber = Number(rightValue);
                        if (!isNaN(rightNumber)) {
                            rightValue = rightNumber;
                        }
                    }

                    if (Entry.hw.portData[portNo] !== undefined) {
                        leftValue = Entry.hw.portData[portNo];
                        switch (operator) {
                            case 'EQUAL':
                                return leftValue === rightValue;
                            case 'NOT_EQUAL':
                                return leftValue != rightValue;
                            case 'GREATER':
                                return leftValue > rightValue;
                            case 'LESS':
                                return leftValue < rightValue;
                            case 'GREATER_OR_EQUAL':
                                return leftValue >= rightValue;
                            case 'LESS_OR_EQUAL':
                                return leftValue <= rightValue;
                        }
                    } else {
                        return 0;
                    }
                },
                syntax: { js: [], py: [] },
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
                func(sprite, script) {
                    const portNo = script.getNumberField('PORT', script);
                    //const mPortNo = `m${portNo}`;
                    const mode = Entry.mechatro.portMode.SET_ANALOG_IN;

                    Entry.mechatro.transferMode(portNo, mode);

                    if (Entry.hw.portData[portNo] !== undefined) {
                        return Entry.hw.portData[portNo];
                    } else {
                        return 0;
                    }
                },
                syntax: { js: [], py: ['mechatro.sensor_value(%1)'] },
            },
            mechatro_get_temperature: {
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
                    type: 'mechatro_get_temperature',
                },
                paramsKeyMap: {
                    PORT: 0,
                },
                class: 'MechatroGet',
                isNotFor: ['mechatro'],
                func(sprite, script) {
                    const portNo = script.getNumberField('PORT', script);
                    //const mPortNo = `m${portNo}`;
                    const mode = Entry.mechatro.portMode.SET_ANALOG_IN;
                    Entry.mechatro.transferMode(portNo, mode);
                    if (Entry.hw.portData[portNo] !== undefined) {
                        return Math.round((Entry.hw.portData[portNo] * 0.4883 - 50));
                    } else {
                        return 0;
                    }
                },
                syntax: { js: [], py: ['mechatro.sensor_temp(%1)'] },
            },
            mechatro_set_get_sensor_value_map: {
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
                            type: 'mechatro_get_sensor_value',
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
                    type: 'mechatro_set_get_sensor_value_map',
                },
                paramsKeyMap: {
                    PORT: 0,
                    VALUE2: 1,
                    VALUE3: 2,
                    VALUE4: 3,
                    VALUE5: 4,
                },
                class: 'MechatroGet',
                isNotFor: ['mechatro'],
                func(sprite, script) {
                    let result = script.getValue('PORT', script);
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

                    result -= value2;
                    result = result * ((value5 - value4) / (value3 - value2));
                    result += value4;
                    //result = Math.min(value5, result);
                    //result = Math.max(value4, result);

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
                            syntax: 'mechatro.map(%1, %2, %3, %4, %5)',
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
                func(sprite, script) {
                    const trig = script.getNumberField('TIRG', script);
                    const echo = script.getNumberField('ECHO', script);
                    const mode = Entry.mechatro.portMode.SET_ULTRASONIC;
                    Entry.mechatro.transferModeValue(trig, mode, echo);
                    // 받는 값 업데이트 포트를 Disable 함. 디지털, 아날로그핀 설정으로 업데이트가 되지 안도록 함.
                    // Echo 포트의 업데이트는 triger 포트에서 업데이트를 시켜줌
                    Entry.mechatro.transferModeValue(echo, Entry.mechatro.portMode.SET_PORT_DISABLE);
                    Entry.mechatro.eventState.ENABLE[trig] = false;
                    Entry.mechatro.eventState.ENABLE[echo] = false;
                    if (Entry.hw.portData.hasOwnProperty(echo)) {
                        return Entry.hw.portData[echo];
                    } else {
                        return 0;
                    }
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            syntax: 'mechatro.ultrasonicRead(%1, %2)',
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
                            ['A2', '16'],
                            ['A3', '17'],
                            ['A4', '18'],
                            ['A5', '19'],
                        ],
                        value: '2',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                    {
                        type: 'Dropdown',
                        options: [
                            ['켜기', '1'],
                            ['끄기', '0'],
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
                    params: [null, null, null],
                    type: 'mechatro_set_digital',
                },
                paramsKeyMap: {
                    PORT: 0,
                    OPERATOR: 1,
                },
                class: 'Mechatro_d_out',
                isNotFor: ['mechatro'],
                func(sprite, script) {
                    const portNo = script.getNumberField('PORT', script);
                    let mode;
                    mode = Entry.mechatro.portMode.SET_DIGITAL_OUT;
                    const value = script.getNumberField('OPERATOR');

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
                        options: [
                            ['D5', '5'],
                            ['D6', '6'],
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
                func(sprite, script) {
                    const portNo = script.getNumberField('PORT', script);
                    const mode = Entry.mechatro.portMode.SET_PWM;
                    let value = script.getValue('VALUE');

                    if (!Entry.Utils.isNumber(value)) {
                        value = 0;
                    }
                    value = Math.max(value, 0);
                    value = Math.min(value, 100);

                    Entry.mechatro.transferModeValue(portNo, mode, value);
                    Entry.mechatro.eventState.ENABLE[portNo] = false;
                    return script.callReturn();
                },
                syntax: { js: [], py: ['mechatro.set_pwm(%1, %2)'] },
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
                            ['D5', '5'],
                            ['D6', '6'],
                            ['D7', '7'],
                            ['D10', '10'],
                        ],
                        value: '5',
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
                func(sprite, script) {
                    const portNo = script.getNumberField('PORT', script);
                    Entry.mechatro.tonePin = portNo;
                    let mode;
                    if (!script.isStart) {
                        script.isStart = true;
                        script.timeFlag = 1;

                        let note = script.getNumberField('NOTE', script);
                        let octave = script.getNumberField('OCTAVE', script);
                        let value = (octave << 4) | (note - 1);
                        let duration = script.getNumberValue('DURATION', script);

                        duration = duration * 1000;
                        if (duration < 100) {   //  100ms 이상만 연주, 통신 속도 및 음 후반부 50ms 무음처리 위함
                            duration = 50;
                        }

                        if (duration === 50 || note === 0) {   // 음 후반 50ms 무음 처리, 동일음 연속사용시 음간 구분
                            mode = Entry.mechatro.portMode.SET_NO_TONE;
                            Entry.mechatro.transferMode(portNo, mode);
                            Entry.mechatro.eventState.ENABLE[portNo] = true;
                            Entry.mechatro.tonePin = 0;
                        } else {
                            mode = Entry.mechatro.portMode.SET_TONE;
                            Entry.mechatro.transferModeValue(3, Entry.mechatro.portMode.SET_MOTOR_SPEED_Free, 100);    // 모터 사용 중지
                            Entry.mechatro.transferModeValue(11, Entry.mechatro.portMode.SET_MOTOR_SPEED_Free, 100);   // 모터 사용 중지
                            Entry.mechatro.transferModeValue(portNo, mode, value);
                            Entry.mechatro.eventState.ENABLE[portNo] = false;
                        }

                        setTimeout(() => {
                            script.timeFlag = 2;
                        }, duration - 50);

                        setTimeout(() => {
                            script.timeFlag = 0;
                        }, duration);

                        return script;
                    } else if (script.timeFlag == 1) {
                        return script;
                    } else if (script.timeFlag == 2) {
                        mode = Entry.mechatro.portMode.SET_NO_TONE;
                        Entry.mechatro.transferMode(portNo, mode);
                        Entry.mechatro.eventState.ENABLE[portNo] = true;
                        Entry.mechatro.tonePin = 0;
                        return script;
                    } else {
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
                            ['D5', '5'],
                            ['D6', '6'],
                            ['D7', '7'],
                            ['D10', '10'],
                        ],
                        value: '5',
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
                func(sprite, script) {
                    let portNo = script.getNumberField('PORT', script);
                    Entry.mechatro.tonePin = portNo;
                    let note = script.getNumberField('NOTE', script);
                    let octave = script.getNumberField('OCTAVE', script);
                    let mode;
                    let value = (octave << 4) | (note - 1);

                    if (note === 0) {
                        mode = Entry.mechatro.portMode.SET_NO_TONE;
                        Entry.mechatro.transferMode(portNo, mode);
                        Entry.mechatro.eventState.ENABLE[portNo] = true;
                        Entry.mechatro.tonePin = 0;
                    } else {
                        mode = Entry.mechatro.portMode.SET_TONE;
                        Entry.mechatro.transferModeValue(3, Entry.mechatro.portMode.SET_MOTOR_SPEED_Free, 100);
                        Entry.mechatro.transferModeValue(11, Entry.mechatro.portMode.SET_MOTOR_SPEED_Free, 100);
                        Entry.mechatro.transferModeValue(portNo, mode, value);
                        Entry.mechatro.eventState.ENABLE[portNo] = false;
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
                        options: [
                            ['MA', '3'],
                            ['MB', '11'],
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
                func(sprite, script) {
                    const portNo = script.getField('PORT', script);
                    let value = script.getValue('SPEED');

                    if (!Entry.Utils.isNumber(value)) {
                        value = 0;
                    }

                    const mode = Entry.mechatro.portMode.SET_MOTOR_SPEED_Free;
                    value = Math.round(value);
                    value = value + 100;
                    value = Math.max(value, 0);
                    value = Math.min(value, 200);

                    if (Entry.mechatro.tonePin) {   // 22.6.5 톤 중복 사용 금지처리
                        Entry.mechatro.transferMode(Entry.mechatro.tonePin, Entry.mechatro.portMode.SET_NO_TONE);
                        Entry.mechatro.tonePin = 0;
                    }
                    Entry.mechatro.transferModeValue(portNo, mode, value);
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
                        options: [
                            ['MA', '14'],
                            ['MB', '15'],
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
                    type: 'mechatro_get_dc_motor_current',
                },
                paramsKeyMap: {
                    PORT: 0,
                },
                class: 'MechatroGet',
                isNotFor: ['mechatro'],
                func(sprite, script) {
                    const portNo = script.getNumberField('PORT', script);
                    const mode = Entry.mechatro.portMode.SET_MOTOR_CURRENT;

                    Entry.mechatro.transferMode(portNo, mode);

                    if (Entry.hw.portData[portNo] !== undefined) {
                        return Entry.hw.portData[portNo] * 10.0; // [cA] → [mA]
                    } else {
                        return 0;
                    }
                },
                syntax: {
                    js: [],
                    py: ['mechatro.get_dc_motor_current(%1)'],
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
                        options: [
                            ['D2', '2'],
                            ['D5', '5'],
                            ['D6', '6'],
                            ['D10', '10'],
                        ],
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
                        {
                            type: 'number',
                            params: ['1~255'],
                        },
                        null,
                    ],
                    type: 'mechatro_set_servo_position',
                },
                paramsKeyMap: {
                    PORT: 0,
                    DEGREE: 1,
                    SPEED: 2,
                },
                class: 'set_motor',
                isNotFor: ['mechatro'],
                func(sprite, script) {
                    const portNo = script.getNumberField('PORT', script);
                    const mode = Entry.mechatro.portMode.SET_SERVO_SPEED;

                    let degree = script.getValue('DEGREE');
                    if (!Entry.Utils.isNumber(degree)) {
                        degree = 90;
                    };
                    degree = Math.max(degree, 0);
                    degree = Math.min(degree, 180);

                    let speed = script.getValue('SPEED');
                    if (!Entry.Utils.isNumber(speed)) {   // 입력값 검사
                        speed = 60;  //초당 60도
                    };
                    speed = Math.max(speed, 1);
                    speed = Math.min(speed, 255);

                    if (Entry.hw.sendQueue.SEND_DATA == undefined) {
                        Entry.hw.sendQueue = {
                            SEND_DATA: {},
                        };
                    }
                    Entry.hw.sendQueue.SEND_DATA[portNo] = {
                        MODE: mode,
                        POSITION: degree,
                        VALUE: speed,
                    };

                    return script.callReturn();
                },
                syntax: {
                    js: [],
                    py: ['mechatro.set_servo_position(%1, %2)'],
                },
            },
            mechatro_set_servo_positions: {
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
                            params: ['0~180'],
                        },
                        {
                            type: 'number',
                            params: ['0~180'],
                        },
                        {
                            type: 'number',
                            params: ['0~180'],
                        },
                        {
                            type: 'number',
                            params: ['0~180'],
                        },
                        {
                            type: 'number',
                            params: ['0.0~12.0'],
                        },
                        null,
                    ],
                    type: 'mechatro_set_servo_positions',
                },
                paramsKeyMap: {
                    P0: 0,
                    P1: 1,
                    P2: 2,
                    P3: 3,
                    RUNTIME: 4,
                },
                class: 'set_motor',
                isNotFor: ['mechatro'],
                func(sprite, script) {
                    if (!script.isStart) {
                        script.isStart = true;
                        script.timeFlag = 1;

                        const mode = Entry.mechatro.portMode.SET_ALL_SERVO_RUNTIME;
                        let runTime = script.getValue('RUNTIME');
                        let servoP = {
                            '0': script.getValue('P0'),
                            '1': script.getValue('P1'),
                            '2': script.getValue('P2'),
                            '3': script.getValue('P3'),
                        };
                        Object.keys(servoP).forEach((key) => {    // 입력값 검사
                            if (!Entry.Utils.isNumber(servoP[key])) {
                                servoP[key] = 90;
                            };
                            servoP[key] = Math.max(servoP[key], 0);
                            servoP[key] = Math.min(servoP[key], 180);
                        });

                        if (!Entry.Utils.isNumber(runTime)) {   // 입력값 검사
                            runTime = 30;  //3초
                        } else {
                            runTime *= 10;
                        };
                        runTime = Math.max(runTime, 5);
                        runTime = Math.min(runTime, 128);

                        if (Entry.hw.sendQueue.SEND_DATA == undefined) {
                            Entry.hw.sendQueue = {
                                SEND_DATA: {},
                            };
                        }
                        Entry.hw.sendQueue.SEND_DATA["allServoPort"] = {
                            MODE: mode,
                            POSITION: servoP,
                            VALUE: runTime,
                        };
                        setTimeout(() => {
                            script.timeFlag = 0;
                        }, runTime * 100);
                        return script;
                    } else if (script.timeFlag == 1) {
                        return script;
                    } else {
                        delete script.timeFlag;
                        delete script.isStart;
                        Entry.engine.isContinue = false;
                        return script.callReturn();
                    }
                },
                syntax: {
                    js: [],
                    py: ['mechatro.set_servo_positions(%1, %2, %3, %4, %5)'],
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
                        options: [
                            ['D2', '22'],
                            ['D5', '24'],
                            ['D6', '25'],
                            ['D10', '27'],
                        ],
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
                func(sprite, script) {
                    const portNo = script.getNumberField('PORT', script);
                    const mode = Entry.mechatro.portMode.SET_SERVO_SPEED;
                    let value = script.getValue('SPEED');

                    if (!Entry.Utils.isNumber(value)) {
                        value = 255;
                    }
                    value = Math.max(value, 0);
                    value = Math.min(value, 255);

                    Entry.mechatro.transferModeValue(portNo, mode, value);

                    return script.callReturn();
                },
                syntax: {
                    js: [],
                    py: ['mechatro.set_servo_speed(%1, %2)'],
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
                func(sprite, script) {
                    const mode = Entry.mechatro.portMode.SET_BLUE_PW;

                    const value =
                        script.getNumberValue('PW1') * 1000 +
                        script.getNumberValue('PW2') * 100 +
                        script.getNumberValue('PW3') * 10 +
                        script.getNumberValue('PW4');

                    Entry.mechatro.transferModeValue(2, mode, value);

                    return script.callReturn();
                },
                syntax: { js: [], py: ['mechatro.set_pwm(%1, %2)'] },
            },
        };
    }
}

Entry.mechatro = new mechatro();
module.exports = Entry.mechatro;
