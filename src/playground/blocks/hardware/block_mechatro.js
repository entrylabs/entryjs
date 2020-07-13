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
    imageName: 'mechatro_nano.png',
    title: {
        ko: '메카트로',
        en: 'mechatro',
    },
    setZero: function() {           // 엔트리 정지시 하드웨어 초기화 로직
        Entry.hw.sendQueue = {};    // key 값이 없으면 entry-HW에서 entryJS 정지로 인식
        Entry.hw.update();          // 반드시 업데이트 해야 전송됨 
    },
    monitorTemplate: {
        imgPath: 'hw/transparent.png',
        width: 605,
        height: 434,
        listPorts:{
            '2': {
                name: `${Lang.Hw.port_en} 2 ${Lang.Hw.port_ko}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '4': {
                name: `${Lang.Hw.port_en} 4 ${Lang.Hw.port_ko}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '5': {
                name: `${Lang.Hw.port_en} 5 ${Lang.Hw.port_ko}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '6': {
                name: `${Lang.Hw.port_en} 6 ${Lang.Hw.port_ko}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '7': {
                name: `${Lang.Hw.port_en} 7 ${Lang.Hw.port_ko}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '10': {
                name: `${Lang.Hw.port_en} 10 ${Lang.Hw.port_ko}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '14': {
                name: `${Lang.Hw.port_en} a0 ${Lang.Hw.port_ko}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '15': {
                name: `${Lang.Hw.port_en} a1 ${Lang.Hw.port_ko}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '16': {
                name: `${Lang.Hw.port_en} a2 ${Lang.Hw.port_ko}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '17': {
                name: `${Lang.Hw.port_en} a3 ${Lang.Hw.port_ko}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '18': {
                name: `${Lang.Hw.port_en} a4 ${Lang.Hw.port_ko}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '19': {
                name: `${Lang.Hw.port_en} a5 ${Lang.Hw.port_ko}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '20': {
                name: `${Lang.Hw.port_en} a6 ${Lang.Hw.port_ko}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '21': {
                name: `${Lang.Hw.port_en} a7 ${Lang.Hw.port_ko}`,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            //M3: {
            //    name: `${Lang.Hw.port_en} MA ` + `모터 속도`,
            //    type: 'input',
            //    pos: { x: 0, y: 0 },
            //},
            //M11: {
            //    name: `${Lang.Hw.port_en} MB ` + `모터 속도`,
            //    type: 'input',
            //    pos: { x: 0, y: 0 },
            //},
        },
        mode: 'both',
    },

    thresHold: {
        '14': 512,
        '15': 512,
        '16': 512,
        '17': 512,
        '18': 512,
        '19': 512,
        '20': 512,
        '21': 512,
    },

    portMode: {
        SET_GROUP_DEVICE: 0x80,
        SET_INIT_DEVICE:  0x80,
        SET_BLUE_PW:      0x82,
        SET_NO_TONE:      0x83,
        SET_DIGITAL_OUT:  0x90,

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
    
    transferModeValue(portNo, mode, value) {
        const mPortNo = `m${portNo}`;
        Entry.hw.sendQueue[mPortNo] = mode;
        Entry.hw.sendQueue[portNo] = value;
        /*
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
        }*/
    },

    transferValue(portNo, value) {
        Entry.hw.sendQueue[portNo] = value;
        //Entry.hw.update();
        //delete Entry.hw.sendQueue[portNo];
    },

    transferMode(portNo, mode) {
        const mPortNo = `m${portNo}`;
        Entry.hw.sendQueue[mPortNo] = mode;
        /*
        if (Entry.hw.portData[mPortNo] !== mode) {
            Entry.hw.sendQueue[mPortNo] = mode;
            Entry.hw.update();
            delete Entry.hw.sendQueue[mPortNo];
        }*/
    },
};

Entry.mechatro.setLanguage = function () {
    return {
        ko: {
            // ko.js에 작성하던 내용
            template: {
                mechatro_get_dc_motor_current: "%1모터 사용전류값",
                mechatro_get_digital: "%1 디지털 값",
                mechatro_get_sensor_value: "%1 센서값",
                mechatro_set_get_sensor_value_map: '%1 의 범위를 %2 ~ %3 에서 %4 ~ %5 로 바꾼값',
                mechatro_get_ultrasonic_value: "초음파센서 Trig %1 Echo %2 의 거리값 [cm]",
                mechatro_get_temperature: "%1 온도 센서 값",
                mechatro_set_blue_pw: "블루투스 비밀번호 : %1%2%3%4로 정하기%5",
                mechatro_set_dc_motor: "%1모터 속도 %2로 정하기%3",
                mechatro_set_digital: "%1번 %2 %3",
                mechatro_set_pwm: "%1PWM을 %2%로 정하기 %3",
                mechatro_set_servo_position: "%1서보모터 위치 :%2도로 옮기기 %3",
                mechatro_set_servo_speed: "%1서보모터 속도 : 1초당 %2도로 정하기 %3",
                mechatro_set_threshold: "%1 센서 감도 : %2로 정하기%3",
                mechatro_set_tone: "%1버저 %2 %3 음으로 연주 %4",
                mechatro_set_tone_time: "%1버저 %2 %3 음으로 %4 초 연주 %5",
            }
        },
        en: {
            // en.js에 작성하던 내용
            template: {
                mechatro_get_dc_motor_current: "Get 1%motor current",
                mechatro_get_digital: "%1",
                mechatro_get_sensor_value: "Analog %1 Sensor value",
                mechatro_set_get_sensor_value_map: 'Map Value %1 %2 ~ %3 to %4 ~ %5',
                mechatro_get_ultrasonic_value: "Read ultrasonic sensor trig pin %1 echo pin %2",
                mechatro_get_temperature: "temperature %1 Sensor",
                mechatro_set_blue_pw: "Change PW of Bluetooth to %1%2%3%4 %5",
                mechatro_set_dc_motor: "Set %1 motor speed to %2 %3",
                mechatro_set_digital: "Digital %1 Pin %2 %3",
                mechatro_set_pwm: "Digital %1 Pin %2 %3",
                mechatro_set_servo_position: "Set servo pin %1 angle as %2 %3",
                mechatro_set_servo_speed: "Set servo pin %1 speed %2 degree per second %3",
                mechatro_set_threshold: "Set %1 threshold : %2%3",
                mechatro_set_tone: "Play tone pin %1 on note %2 octave %3 %4",
                mechatro_set_tone_time: "Play tone pin %1 on note %2 octave %3 beat %4 %5",
            }
        }
    }
};


Entry.mechatro.blockMenuBlocks = [
    // mechatro Added 2018-02-12
    'mechatro_set_threshold',
    'mechatro_get_digital',
    'mechatro_get_sensor_value',
    'mechatro_set_get_sensor_value_map',
    'mechatro_get_dc_motor_current',
    'mechatro_get_ultrasonic_value',
    'mechatro_get_temperature',
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
            func(sprite, script) {
                var portNo = script.getNumberField('PORT', script);
                //var mPortNo = `m${portNo}`;
                var mode;
                var value;
                
                if (portNo > 14) {
                    mode = Entry.mechatro.portMode.SET_ANALOG_IN;
                } else {
                    mode = Entry.mechatro.portMode.SET_DIGITAL_IN;
                }
                
                Entry.mechatro.transferMode(portNo,mode);

                if (Entry.hw.portData[portNo] !== undefined) {
                    value = Entry.hw.portData[portNo];
                    if (portNo > 14) {
                        value = value > Entry.mechatro.thresHold[portNo] ? 1 : 0;
                    }
                    return value;
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

                Entry.mechatro.transferMode(portNo,mode);

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
                        params: ['20~1000'],
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
            func(sprite, script) {
                const portNo = script.getNumberField('PORT', script);
                let value = script.getValue('VALUE');

                if (!Entry.Utils.isNumber(value)) {
                    value = 0;
                }
                value = Math.max(value, 100);
                value = Math.min(value, 900);

                Entry.mechatro.thresHold[portNo] = value;

                return script.callReturn();
            },
            syntax: { js: [], py: ['mechatro.set_threshold(%1, %2)'] },
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
                Entry.mechatro.transferMode(portNo,mode);
                if (Entry.hw.portData[portNo] !== undefined) {
                    return Math.round(Entry.hw.portData[portNo]*4.883-500)/10.0;
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

                if (Entry.hw.portData[echo] !== undefined) {
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
            func(sprite, script) {
                const portNo = script.getNumberField('PORT', script);
                const mode = Entry.mechatro.portMode.SET_DIGITAL_OUT;
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
            func(sprite, script) {
                const portNo = script.getNumberField('PORT', script);
                let mode;

                if (!script.isStart) {
                    
                    let duration = script.getNumberValue('DURATION', script);
                    if (duration < 0) {
                        duration = 0;
                    }
                    duration = duration * 1000;

                    let note   = script.getNumberField('NOTE', script);
                    let octave = script.getNumberField('OCTAVE', script);
                    let value = (octave << 4) | (note - 1);

                    script.isStart = true;
                    script.timeFlag = 1;
                    
                    if (duration === 0 || note === 0) {
                        mode = Entry.mechatro.portMode.SET_NO_TONE;
                        Entry.mechatro.transferMode(portNo, mode);
                    } else {
                        mode = Entry.mechatro.portMode.SET_TONE;
                        Entry.mechatro.transferModeValue(portNo, mode, value);
                    }

                    setTimeout(() => {
                        script.timeFlag = 0;
                    }, duration + 32);
                    return script;

                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    mode = Entry.mechatro.portMode.SET_NO_TONE;
                    Entry.mechatro.transferMode(portNo, mode);

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
            func(sprite, script) {
                let portNo = script.getNumberField('PORT', script);
                let note   = script.getNumberField('NOTE', script);
                let octave = script.getNumberField('OCTAVE', script);
                let mode;
                let value = (octave << 4) | (note - 1);

                if (note === 0) {
                    mode = Entry.mechatro.portMode.SET_NO_TONE;
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
            func(sprite, script) {
                const portNo = script.getField('PORT', script);
                let value = script.getValue('SPEED');

                if (!Entry.Utils.isNumber(value)) {
                    value = 0;
                }

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
            func(sprite, script) {
                const portNo = script.getNumberField('PORT', script);
                const mode = Entry.mechatro.portMode.SET_MOTOR_CURRENT;

                Entry.mechatro.transferMode(portNo,mode);

                if (Entry.hw.portData[portNo] !== undefined) {
                    return Entry.hw.portData[portNo];
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
            func(sprite, script) {
                const portNo = script.getNumberField('PORT', script);
                const mode = Entry.mechatro.portMode.SET_SERVO_POSITION;
                let value = script.getValue('DEGREE');

                if (!Entry.Utils.isNumber(value)) {
                    value = 90;
                }
                value = Math.max(value, 0);
                value = Math.min(value, 180);

                Entry.mechatro.transferModeValue(portNo, mode, value);

                return script.callReturn();
            },
            syntax: {
                js: [],
                py: ['mechatro.set_servo_position(%1, %2)'],
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
        //endregion mechatro
    };
};

module.exports = Entry.mechatro;
