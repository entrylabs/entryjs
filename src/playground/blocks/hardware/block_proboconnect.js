'use strict';

Entry.ProboConnect = {
    id: '27.1',
    name: 'ProboConnect', // isNotFor 속성과 대소문자까지 정확하게 매치되어야 합니다.
    url: 'http://www.arduino.cc/', // 생략 가능합니다. 엔트리 사이트에서 홍보시 사용됩니다.
    imageName: 'ProboConnect.png', // images/hardware 폴더 내에 존재하는 이미지입니다. 엔트리 사이트에서 홍보시 사용됩니다.
    title: {
        ko: '프로보커넥트',
        en: 'ProboConnect',
    },
    Color: [
        /*레드*/ [13, 37],
        /*그린*/ [38, 62],
        /*블루*/ [63, 87],
        /*옐로우*/ [88, 112],
        /*블랙*/ [113, 137],
        /*화이트*/ [138, 162],
    ],
    Melody: [0, 35391, 33405, 31530, 29760, 28090, 26513, 25025, 23621, 22295, 21044, 19863, 18748],
    Infinite_Buff: { AA1: 0, AA2: 0, AA3: 0, AA4: 0 },
    Infinite_Count: { AA1: 0, AA2: 0, AA3: 0, AA4: 0 },
    Infinite_Start: { AA1: 0, AA2: 0, AA3: 0, AA4: 0 },

    InputData: {
        Analog: {
            AA1: 0,
            AA2: 0,
            AA3: 0,
            AA4: 0,
        },
        Digital: {
            A1: 0,
            A2: 0,
            A3: 0,
            A4: 0,
            FEA1: 0,
            FEA2: 0,
            FEA3: 0,
            FEA4: 0,
            REA1: 0,
            REA2: 0,
            REA3: 0,
            REA4: 0,
            BEA1: 0,
            BEA2: 0,
            BEA3: 0,
            BEA4: 0,
        },
        Remote: {
            R_1: 0,
            R_2: 0,
            R_3: 0,
            R_4: 0,
            R_5: 0,
            R_6: 0,
            R_7: 0,
            R_8: 0,
            R_L1: 0,
            R_L2: 0,
            R_R1: 0,
            R_R2: 0,
        },
        EEPROM: {
            EC: 0,
            EEPR2: 0,
            EEPR1: 0,
        },
    },
    RemoteData: {
        B1: 0,
        B2: 0,
        B3: 0,
        B4: 0,
        Servo1: 0,
        Servo2: 0,
        Servo3: 0,
        Servo4: 0,
        DC1: 0,
        DC2: 0,
        DC3: 0,
        DC4: 0,
        MEL2: 0,
        MEL1: 0,
        FND: 100,
        EEPR4: 0,
        EEPR3: 0,
        EEPR2: 0,
        EEPR1: 0,
        ASET2: 0,
        ASET1: 0,
    },
    EdgeFlag: {
        FEA1: 0,
        FEA2: 0,
        FEA3: 0,
        FEA4: 0,
        REA1: 0,
        REA2: 0,
        REA3: 0,
        REA4: 0,
        BEA1: 0,
        BEA2: 0,
        BEA3: 0,
        BEA4: 0,
    },
    EEPROM: {
        EEPROM_Buff: 0,
        EEPROM_Count: 0,
    },

    setZero: function() {
        for (var key in this.EdgeFlag) this.EdgeFlag[key] = 0;
        for (var key in this.RemoteData) Entry.hw.sendQueue[key] = this.RemoteData[key];
        Entry.hw.update();
    },
};

// 언어 적용
Entry.ProboConnect.setLanguage = function() {
    return {
        ko: {
            // ko.js에 작성하던 내용
            template: {
                connect_senser_setting: '센서 설정 A1:%1 A2:%2 A3:%3 A4:%4 %5',

                connect_remote_input: '리모컨 입력 %1',
                connect_digital_input: '디지털 센서 %1',
                connect_analog_input: '아날로그 센서 %1',
                connect_value_mapping: '%1 의 %2 ~ %3 값을 %4 ~ %5 (으)로 변환',
                //connect_ultrasonic_cm: '초음파 센서 %1 의 거리(cm)',
                connect_color_input_b: '컬러 센서 %1 이(가) %2 색 인가?',
                connect_color_input_r: '컬러 센서 %1 의 색상',
                connect_infinite_reset: '무한회전 센서 %1 초기화 %2',
                connect_infinite_transform_input: '무한회전 센서 %1 의  %2',
                connect_infinite_mm_diameter: '무한회전 센서 %1  지름 %2 의 mm 값',

                connect_port_output: '출력포트 %1 을(를) %2 %3',
                connect_servo_output: '서보 모터 %1 의 위치를 %2 로 이동 %3',
                connect_dc_output: 'DC 모터 %1 을(를) %2 속도로 회전 %3',
                connect_mel_sec_output: '멜로디 %1 을(를) %2 초 동안 소리내기 %3',
                connect_melody_output: '멜로디 %1 을(를) 소리내기 %2',
                connect_melody_off: '멜로디 소리끄기 %1',
                connect_fnd_output: 'FND를 %1 (으)로 켜기 %2',
                connect_fnd_off: 'FND를 끄기 %1',

                connect_eeprom_write: 'EEPROM %1 주소에 %2 값 설정하기 %3',
                connect_eeprom_buffset: 'EEPROM %1 주소의 값 임시저장소로 호출하기 %2',
                connect_buff_read: 'EEPROM 임시저장소의 값',
            },
        },
        en: {
            // en.js에 작성하던 내용
            template: {
                connect_senser_setting: 'senser setting A1:%1 A2:%2 A3:%3 A4:%4 %5',

                connect_remote_input: 'remote input %1',
                connect_digital_input: 'digital senser %1',
                connect_analog_input: 'analog senser %1',
                connect_value_mapping: '%1 to value %2 ~ %3 change %4 ~ %5',
                //connect_ultrasonic_cm: 'Distance(cm) of ultrasonic sensor %1',
                connect_color_input_b: 'is color sensor %1 to %2 ?',
                connect_color_input_r: 'color of color sensor %1',
                connect_infinite_reset: 'infinite rotation sensor %1 reset %2',
                connect_infinite_transform_input: 'infinite rotation sensor %1 to %2',
                connect_infinite_mm_diameter: 'mm value of infinite rotation sensor %1 diameter %2',

                connect_port_output: 'output %1 port %2 %3',
                connect_servo_output: 'move position of servo motor %1 to %2 %3',
                connect_dc_output: 'rotate dc motor %1 at %2 speed %3',
                connect_mel_sec_output: 'melody %1 sounds for %2 seconds %3',
                connect_melody_output: 'off melody sound %1',
                connect_fnd_output: 'FND on %1 %2',
                connect_fnd_off: 'FND off %1',

                connect_eeprom_write: 'setting the EEPROM %1 address to a value of %2 %3',
                connect_eeprom_buffset:
                    'calling the value of the EEPROM %1 address into the temporary store %2',
                connect_buff_read: 'value of EEPROM temporary store',
            },
        },
    };
};

Entry.ProboConnect.blockMenuBlocks = [
    //region proboconnect
    ////input
    'connect_senser_setting',
    'connect_remote_input',
    'connect_digital_input',
    'connect_analog_input',
    'connect_value_mapping',
    //"connect_ultrasonic_cm",
    'connect_color_input_b',
    'connect_color_input_r',
    'connect_infinite_reset',
    'connect_infinite_transform_input',
    'connect_infinite_mm_diameter',

    ////output
    'connect_port_output',
    'connect_servo_output',
    'connect_dc_output',
    'connect_mel_sec_output',
    'connect_melody_output',
    'connect_melody_off',
    'connect_fnd_output',
    'connect_fnd_off',

    //// EEPROM
    'connect_eeprom_write',
    'connect_eeprom_buffset',
    'connect_buff_read',
    //endregion proboconnect
];

// 블록 생성
Entry.ProboConnect.getBlocks = function() {
    return {
        connect_remote_input: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic_boolean_field',
            params: [
                {
                    type: 'Dropdown',
                    // Dropdown 생성 기준은
                    // [["key1", "value1"],
                    //  ["key2", "value2"]]
                    options: [
                        ['R_1', 'R_1'],
                        ['R_2', 'R_2'],
                        ['R_3', 'R_3'],
                        ['R_4', 'R_4'],
                        ['R_5', 'R_5'],
                        ['R_6', 'R_6'],
                        ['R_7', 'R_7'],
                        ['R_8', 'R_8'],
                        ['R_L1', 'R_L1'],
                        ['R_L2', 'R_L2'],
                        ['R_R1', 'R_R1'],
                        ['R_R2', 'R_R2'],
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: ['R_1'],
                type: 'connect_remote_input',
            },
            paramsKeyMap: {
                BUTTON: 0,
            },
            class: 'input',
            isNotFor: ['ProboConnect'],
            func: function(sprite, script) {
                const btn = script.getStringField('BUTTON', script);

                return Entry.hw.portData.InputData.Remote[btn] == 1 ? true : false;
            },
        },
        connect_digital_input: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic_boolean_field',
            params: [
                {
                    type: 'Dropdown',

                    options: [
                        ['A1', 'A1'],
                        ['A2', 'A2'],
                        ['A3', 'A3'],
                        ['A4', 'A4'],
                        ['FEA1', 'FEA1'],
                        ['FEA2', 'FEA2'],
                        ['FEA3', 'FEA3'],
                        ['FEA4', 'FEA4'],
                        ['REA1', 'REA1'],
                        ['REA2', 'REA2'],
                        ['REA3', 'REA3'],
                        ['REA4', 'REA4'],
                        ['BEA1', 'BEA1'],
                        ['BEA2', 'BEA2'],
                        ['BEA3', 'BEA3'],
                        ['BEA4', 'BEA4'],
                    ],
                    fontSize: 11,

                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: ['A1'],
                type: 'connect_digital_input',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'input',
            isNotFor: ['ProboConnect'],
            func: function(sprite, script) {
                const port = script.getStringField('PORT', script);
                var rt = false;

                if (
                    port == 'FEA1' ||
                    port == 'FEA2' ||
                    port == 'FEA3' ||
                    port == 'FEA4' ||
                    port == 'REA1' ||
                    port == 'REA2' ||
                    port == 'REA3' ||
                    port == 'REA4' ||
                    port == 'BEA1' ||
                    port == 'BEA2' ||
                    port == 'BEA3' ||
                    port == 'BEA4'
                ) {
                    if (Entry.hw.portData.InputData.Digital[port] == 1) {
                        if (Entry.ProboConnect.EdgeFlag[port] == 0) {
                            Entry.ProboConnect.EdgeFlag[port] = 1;
                            rt = true;
                        }
                    } else {
                        Entry.ProboConnect.EdgeFlag[port] = 0;
                    }
                } else rt = Entry.hw.portData.InputData.Digital[port] == 1 ? true : false;

                return rt;
            },
        },
        connect_analog_input: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic_string_field',
            params: [
                {
                    type: 'Dropdown',
                    // Dropdown 생성 기준은
                    // [["key1", "value1"],
                    //  ["key2", "value2"]]
                    options: [['AA1', 'AA1'], ['AA2', 'AA2'], ['AA3', 'AA3'], ['AA4', 'AA4']],
                    fontSize: 11,

                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: [
                    // Dropdown 값의 경우 Value를 세팅하면 초기값이 처리 됩니다.
                    'AA1',
                ],
                type: 'connect_analog_input',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'input',
            isNotFor: ['ProboConnect'],
            func: function(sprite, script) {
                const port = script.getStringField('PORT', script);

                // Port 라는 key값을 가진 정보를 읽는다.
                return Entry.hw.portData.InputData.Analog[port];
            },
        },
        connect_value_mapping: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic_string_field',
            params: [
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
            ],
            def: {
                params: [
                    // Dropdown 값의 경우 Value를 세팅하면 초기값이 처리 됩니다.
                    '0',
                    '0',
                    '0',
                    '0',
                    '0',
                ],
                type: 'connect_value_mapping',
            },
            paramsKeyMap: {
                DATA: 0,
                SOURCE1: 1,
                SOURCE2: 2,
                TARGET1: 3,
                TARGET2: 4,
            },
            class: 'input',
            isNotFor: ['ProboConnect'],
            func: function(sprite, script) {
                const data = script.getNumberValue('DATA', script);
                const source1 = script.getNumberValue('SOURCE1', script);
                const source2 = script.getNumberValue('SOURCE2', script);
                const target1 = script.getNumberValue('TARGET1', script);
                const target2 = script.getNumberValue('TARGET2', script);

                var value = 0;
                var rate = (data - source1) / (source2 - source1);
                var num = 0;

                if (target1 < target2) {
                    value = (target2 - target1) * rate;

                    num = value % 1;

                    if (num < 0.5) value -= num;
                    else value += 1 - num;

                    value = target1 + value;

                    if (value < target1) value = target1;
                    else if (value > target2) value = target2;
                } else {
                    value = (target1 - target2) * rate;

                    num = value % 1;

                    if (num < 0.5) value -= num;
                    else value += 1 - num;

                    value = target1 - value;

                    if (value > target1) value = target1;
                    else if (value < target2) value = target2;
                }

                return value;
            },
        },
        connect_color_input_b: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic_boolean_field',
            params: [
                {
                    type: 'Dropdown',
                    options: [['AA1', 'AA1'], ['AA2', 'AA2'], ['AA3', 'AA3'], ['AA4', 'AA4']],
                    fontSize: 11,

                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['빨강', '0'],
                        ['초록', '1'],
                        ['파랑', '2'],
                        ['노랑', '3'],
                        ['검정', '4'],
                        ['하양', '5'],
                    ],
                    fontSize: 11,

                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: ['AA1', '0'],
                type: 'connect_color_input_b',
            },
            paramsKeyMap: {
                PORT: 0,
                COLOR: 1,
            },
            class: 'input',
            isNotFor: ['ProboConnect'],
            func: function(sprite, script) {
                const port = script.getStringField('PORT', script);
                const target = script.getNumberField('COLOR', script);
                const value = Entry.hw.portData.InputData.Analog[port];
                var color = Entry.ProboConnect.Color;

                return color[target][0] <= value && value <= color[target][1];
            },
        },
        connect_color_input_r: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic_string_field',
            params: [
                {
                    type: 'Dropdown',
                    options: [['AA1', 'AA1'], ['AA2', 'AA2'], ['AA3', 'AA3'], ['AA4', 'AA4']],
                    fontSize: 11,

                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: ['AA1'],
                type: 'connect_color_input_r',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'input',
            isNotFor: ['ProboConnect'],
            func: function(sprite, script) {
                const port = script.getStringField('PORT', script);
                const value = Entry.hw.portData.InputData.Analog[port];
                var color = Entry.ProboConnect.Color;

                for (var i = 0; i < 6; i++) {
                    if (color[i][0] <= value && value <= color[i][1]) {
                        switch (i) {
                            case 0:
                                return '빨강';
                            case 1:
                                return '초록';
                            case 2:
                                return '파랑';
                            case 3:
                                return '노랑';
                            case 4:
                                return '검정';
                            case 5:
                                return '하양';
                        }
                    }
                }
                return 0;
            },
        },
        connect_infinite_reset: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
            params: [
                {
                    type: 'Dropdown',
                    options: [['AA1', 'AA1'], ['AA2', 'AA2'], ['AA3', 'AA3'], ['AA4', 'AA4']],
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
            def: {
                params: ['AA1', null],
                type: 'connect_infinite_reset',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'input',
            isNotFor: ['ProboConnect'],
            func: function(sprite, script) {
                const port = script.getStringField('PORT', script);
                const value = Entry.hw.portData.InputData.Analog[port];
                Entry.ProboConnect.Infinite_Start[port] = value;
                Entry.ProboConnect.Infinite_Buff[port] = Entry.ProboConnect.Infinite_Start[port];
                Entry.ProboConnect.Infinite_Count[port] = 0;
            },
        },
        connect_infinite_transform_input: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic_string_field',
            params: [
                {
                    type: 'Dropdown',
                    options: [['AA1', 'AA1'], ['AA2', 'AA2'], ['AA3', 'AA3'], ['AA4', 'AA4']],
                    fontSize: 11,

                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [['값', '1'], ['각도', '2'], ['회전 수', '3']],
                    fontSize: 11,

                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: ['AA1', '1'],
                type: 'connect_infinite_transform_input',
            },
            paramsKeyMap: {
                PORT: 0,
                SELECT: 1,
            },
            class: 'input',
            isNotFor: ['ProboConnect'],
            func: function(sprite, script) {
                const port = script.getStringField('PORT', script);
                const value = Entry.hw.portData.InputData.Analog[port];
                const select = script.getNumberField('SELECT', script);

                if (value < Entry.ProboConnect.Infinite_Buff[port] - 150)
                    Entry.ProboConnect.Infinite_Count[port]++;
                else if (value > Entry.ProboConnect.Infinite_Buff[port] + 150)
                    Entry.ProboConnect.Infinite_Count[port]--;

                Entry.ProboConnect.Infinite_Buff[port] = value;

                switch (select) {
                    case 2:
                        return value * 1.41732;
                    case 3:
                        return Entry.ProboConnect.Infinite_Count[port];
                    default:
                        return (
                            value -
                            Entry.ProboConnect.Infinite_Start[port] +
                            Entry.ProboConnect.Infinite_Count[port] * 255
                        );
                }
            },
        },
        connect_infinite_mm_diameter: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic_string_field',
            params: [
                {
                    type: 'Dropdown',
                    options: [['AA1', 'AA1'], ['AA2', 'AA2'], ['AA3', 'AA3'], ['AA4', 'AA4']],
                    fontSize: 11,

                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            def: {
                params: ['AA1', 53.5],
                type: 'connect_infinite_mm_diameter',
            },
            paramsKeyMap: {
                PORT: 0,
                DIAMETER: 1,
            },
            class: 'input',
            isNotFor: ['ProboConnect'],
            func: function(sprite, script) {
                const port = script.getStringField('PORT', script);
                const value = Entry.hw.portData.InputData.Analog[port];
                const diameter = script.getNumberField('DIAMETER', script);

                if (value < Entry.ProboConnect.Infinite_Buff[port] - 150)
                    Entry.ProboConnect.Infinite_Count[port]++;
                else if (value > Entry.ProboConnect.Infinite_Buff[port] + 150)
                    Entry.ProboConnect.Infinite_Count[port]--;

                return Number(
                    2 *
                        3.141592 *
                        (diameter / 2) /
                        255 *
                        (value -
                            Entry.ProboConnect.Infinite_Start[port] +
                            Entry.ProboConnect.Infinite_Count[port] * 255)
                ).toFixed(3);
            },
        },

        //============================================ output =====================================================
        connect_senser_setting: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['스위치', '1'],
                        ['적외선', '2'],
                        ['자석', '3'],
                        ['초음파', '4'],
                        ['회전', '5'],
                        ['조도', '6'],
                        ['온도', '7'],
                        ['소리', '8'],
                        ['기울기', '9'],
                        ['압력', '10'],
                        ['심박', '11'],
                        ['컬러', '12'],
                        ['가속도', '13'],
                    ],
                    fontSize: 11,

                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['스위치', '1'],
                        ['적외선', '2'],
                        ['자석', '3'],
                        ['초음파', '4'],
                        ['회전', '5'],
                        ['조도', '6'],
                        ['온도', '7'],
                        ['소리', '8'],
                        ['기울기', '9'],
                        ['압력', '10'],
                        ['심박', '11'],
                        ['컬러', '12'],
                        ['가속도', '13'],
                    ],
                    fontSize: 11,

                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['스위치', '1'],
                        ['적외선', '2'],
                        ['자석', '3'],
                        ['초음파', '4'],
                        ['회전', '5'],
                        ['조도', '6'],
                        ['온도', '7'],
                        ['소리', '8'],
                        ['기울기', '9'],
                        ['압력', '10'],
                        ['심박', '11'],
                        ['컬러', '12'],
                        ['가속도', '13'],
                    ],
                    fontSize: 11,

                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['스위치', '1'],
                        ['적외선', '2'],
                        ['자석', '3'],
                        ['초음파', '4'],
                        ['회전', '5'],
                        ['조도', '6'],
                        ['온도', '7'],
                        ['소리', '8'],
                        ['기울기', '9'],
                        ['압력', '10'],
                        ['심박', '11'],
                        ['컬러', '12'],
                        ['가속도', '13'],
                    ],
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
            def: {
                params: ['1', '1', '1', '1', null],
                type: 'connect_senser_setting',
            },
            paramsKeyMap: {
                PORT1: 0,
                PORT2: 1,
                PORT3: 2,
                PORT4: 3,
            },
            class: 'setting',
            isNotFor: ['ProboConnect'],
            func: function(sprite, script) {
                var Aset = [0, 0, 0, 0];
                var value = [0, 0, 0, 0];
                Aset[0] = script.getNumberField('PORT1', script);
                Aset[1] = script.getNumberField('PORT2', script);
                Aset[2] = script.getNumberField('PORT3', script);
                Aset[3] = script.getNumberField('PORT4', script);

                for (var i = 0; i < 4; i++) {
                    switch (Aset[i]) {
                        case 1:
                        case 2:
                        case 3:
                            value[i] = 1;
                            break;
                        case 4:
                        case 5:
                        case 6:
                        case 7:
                            value[i] = 2;
                            break;
                        case 8:
                            value[i] = 3;
                            break;
                        case 9:
                            value[i] = 4;
                            break;
                        case 10:
                            value[i] = 5;
                            break;
                        case 11:
                            value[i] = 6;
                            break;
                        case 12:
                            value[i] = 7;
                            break;
                        case 13:
                            value[i] = 8;
                            break;
                    }
                }

                Entry.hw.sendQueue['ASET2'] = (value[0] << 4) | value[1];
                Entry.hw.sendQueue['ASET1'] = (value[2] << 4) | value[3];
            },
        },
        connect_port_output: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
            params: [
                {
                    type: 'Dropdown',
                    options: [['B1', 'B1'], ['B2', 'B2'], ['B3', 'B3'], ['B4', 'B4']],
                    fontSize: 11,

                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [['on', 1], ['off', 0]],
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
            def: {
                params: ['B1', 1, null],
                type: 'connect_port_output',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'output',
            isNotFor: ['ProboConnect'],
            func: function(sprite, script) {
                const motor = script.getStringField('PORT', script);
                const value = script.getNumberField('VALUE', script);

                Entry.hw.sendQueue[motor] = value;
            },
        },
        connect_servo_output: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['B1', 'Servo1'],
                        ['B2', 'Servo2'],
                        ['B3', 'Servo3'],
                        ['B4', 'Servo4'],
                    ],
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
            def: {
                params: ['Servo1', { type: 'number', params: ['1'] }, null],
                type: 'connect_servo_output',
            },
            paramsKeyMap: {
                SERVO: 0,
                VALUE: 1,
            },
            class: 'output',
            isNotFor: ['ProboConnect'],
            func: function(sprite, script) {
                const servo = script.getStringField('SERVO', script);
                const value = script.getNumberValue('VALUE', script) | 0x80;

                Entry.hw.sendQueue[servo] = value;
            },
        },
        connect_dc_output: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
            params: [
                {
                    type: 'Dropdown',
                    options: [['M1', 'DC1'], ['M2', 'DC2'], ['M3', 'DC3'], ['M4', 'DC4']],
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
            def: {
                params: ['DC1', { type: 'number', params: ['0'] }, null],
                type: 'connect_dc_output',
            },
            paramsKeyMap: {
                MOTOR: 0,
                VALUE: 1,
            },
            class: 'output',
            isNotFor: ['ProboConnect'],
            func: function(sprite, script) {
                const motor = script.getStringField('MOTOR', script);
                const value = script.getNumberValue('VALUE', script);

                Entry.hw.sendQueue[motor] = value;
            },
        },
        connect_mel_sec_output: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['[1]도', 1],
                        ['[1]레', 3],
                        ['[1]미', 5],
                        ['[1]파', 6],
                        ['[1]솔', 8],
                        ['[1]라', 10],
                        ['[1]시', 12],
                        ['[2]도', 13],
                        ['[2]레', 15],
                        ['[2]미', 17],
                        ['[2]파', 18],
                        ['[2]솔', 20],
                        ['[2]라', 22],
                        ['[2]시', 24],
                        ['[3]도', 25],
                        ['[3]레', 27],
                        ['[3]미', 29],
                        ['[3]파', 30],
                        ['[3]솔', 32],
                        ['[3]라', 34],
                        ['[3]시', 36],
                        ['[4]도', 37],
                        ['[4]레', 39],
                        ['[4]미', 41],
                        ['[4]파', 42],
                        ['[4]솔', 44],
                        ['[4]라', 46],
                        ['[4]시', 48],
                    ],
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
            def: {
                params: [1, { type: 'number', params: ['1'] }, null],
                type: 'connect_mel_sec_output',
            },
            paramsKeyMap: {
                MELODY: 0,
                SEC: 1,
            },
            class: 'output',
            isNotFor: ['ProboConnect'],
            func: function(sprite, script) {
                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    const mel = script.getNumberField('MELODY', script);
                    var timeValue = script.getNumberValue('SEC', script);
                    var melody = 0;

                    if (mel > 0 && mel < 13) melody = Entry.ProboConnect.Melody[mel];
                    else if (mel < 25) melody = Entry.ProboConnect.Melody[mel - 12] / 2;
                    else if (mel < 37) melody = Entry.ProboConnect.Melody[mel - 24] / 4;
                    else if (mel < 49) melody = Entry.ProboConnect.Melody[mel - 36] / 8;

                    Entry.hw.sendQueue['MEL2'] = melody >> 8;
                    Entry.hw.sendQueue['MEL1'] = melody;

                    var fps = Entry.FPS || 60;
                    timeValue = 60 / fps * timeValue * 1000;

                    var blockId = script.block.id;
                    Entry.TimeWaitManager.add(
                        blockId,
                        function() {
                            script.timeFlag = 0;
                        },
                        timeValue
                    );
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    Entry.hw.sendQueue['MEL2'] = 0;
                    Entry.hw.sendQueue['MEL1'] = 0;

                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
        },
        connect_melody_output: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['[1]도', 1],
                        ['[1]레', 3],
                        ['[1]미', 5],
                        ['[1]파', 6],
                        ['[1]솔', 8],
                        ['[1]라', 10],
                        ['[1]시', 12],
                        ['[2]도', 13],
                        ['[2]레', 15],
                        ['[2]미', 17],
                        ['[2]파', 18],
                        ['[2]솔', 20],
                        ['[2]라', 22],
                        ['[2]시', 24],
                        ['[3]도', 25],
                        ['[3]레', 27],
                        ['[3]미', 29],
                        ['[3]파', 30],
                        ['[3]솔', 32],
                        ['[3]라', 34],
                        ['[3]시', 36],
                        ['[4]도', 37],
                        ['[4]레', 39],
                        ['[4]미', 41],
                        ['[4]파', 42],
                        ['[4]솔', 44],
                        ['[4]라', 46],
                        ['[4]시', 48],
                    ],
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
            def: {
                params: [1, null],
                type: 'connect_melody_output',
            },
            paramsKeyMap: {
                MELODY: 0,
            },
            class: 'output',
            isNotFor: ['ProboConnect'],
            func: function(sprite, script) {
                const mel = script.getNumberField('MELODY', script);
                var melody = 0;

                if (mel > 0 && mel < 13) melody = Entry.ProboConnect.Melody[mel];
                else if (mel < 25) melody = Entry.ProboConnect.Melody[mel - 12] / 2;
                else if (mel < 37) melody = Entry.ProboConnect.Melody[mel - 24] / 4;
                else if (mel < 49) melody = Entry.ProboConnect.Melody[mel - 36] / 8;

                Entry.hw.sendQueue['MEL2'] = melody >> 8;
                Entry.hw.sendQueue['MEL1'] = melody;
            },
        },
        connect_melody_off: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            def: {
                params: [null],
                type: 'connect_melody_off',
            },
            class: 'output',
            isNotFor: ['ProboConnect'],
            func: function(sprite, script) {
                Entry.hw.sendQueue['MEL2'] = 0;
                Entry.hw.sendQueue['MEL1'] = 0;
            },
        },
        connect_fnd_output: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
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
            def: {
                params: ['0', null],
                type: 'connect_fnd_output',
            },
            paramsKeyMap: {
                FND: 0,
            },
            class: 'output',
            isNotFor: ['ProboConnect'],
            func: function(sprite, script) {
                const fnd = script.getNumberValue('FND', script);
                Entry.hw.sendQueue['FND'] = fnd;
            },
        },
        connect_fnd_off: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            def: {
                params: [null],
                type: 'connect_fnd_off',
            },
            class: 'output',
            isNotFor: ['ProboConnect'],
            func: function(sprite, script) {
                Entry.hw.sendQueue['FND'] = 100;
            },
        },

        //============================================ EEPROM =====================================================
        connect_eeprom_buffset: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
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
            def: {
                params: [{ type: 'number', params: ['0'] }, null],
                type: 'connect_eeprom_buffset',
            },
            paramsKeyMap: {
                ADDRESS: 0,
            },
            class: 'EEPROM',
            isNotFor: ['ProboConnect'],
            func: function(sprite, script) {
                const address = script.getNumberValue('ADDRESS', script);
                if (!script.isStart) {
                    Entry.ProboConnect.EEPROM.EEPROM_Count = Entry.hw.portData.InputData.EEPROM.EC;
                    Entry.hw.sendQueue['EEPR4'] = 0x40;
                    Entry.hw.sendQueue['EEPR3'] = address;

                    script.isStart = true;
                    script.timeFlag = 1;
                    var timeValue = 0.05;
                    var fps = Entry.FPS || 60;
                    timeValue = 60 / fps * timeValue * 1000;

                    var blockId = script.block.id;
                    Entry.TimeWaitManager.add(
                        blockId,
                        function() {
                            script.timeFlag = 0;
                        },
                        timeValue
                    );

                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    Entry.ProboConnect.EEPROM.EEPROM_Buff =
                        (Entry.hw.portData.InputData.EEPROM.EEPR2 << 8) +
                        Entry.hw.portData.InputData.EEPROM.EEPR1;
                    Entry.hw.sendQueue['EEPR4'] = 0;

                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
        },
        connect_buff_read: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic_string_field',
            def: {
                type: 'connect_buff_read',
            },
            class: 'EEPROM',
            isNotFor: ['ProboConnect'],
            func: function(sprite, script) {
                var value = 0;
                const count = Entry.ProboConnect.EEPROM.EEPROM_Count;
                if (Entry.hw.portData.InputData.EEPROM.EC != count) {
                    value = Entry.ProboConnect.EEPROM.EEPROM_Buff;
                }
                return value;
            },
        },
        connect_eeprom_write: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
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
            def: {
                params: [
                    { type: 'number', params: ['0'] },
                    { type: 'number', params: ['0'] },
                    null,
                ],
                type: 'connect_eeprom_write',
            },
            paramsKeyMap: {
                ADDRESS: 0,
                VALUE: 1,
            },
            class: 'EEPROM',
            isNotFor: ['ProboConnect'],
            func: function(sprite, script) {
                const address = script.getNumberValue('ADDRESS', script);
                const value = script.getNumberValue('VALUE', script);
                if (!script.isStart) {
                    Entry.hw.sendQueue['EEPR4'] = 0x80;
                    Entry.hw.sendQueue['EEPR3'] = address;
                    Entry.hw.sendQueue['EEPR2'] = value >> 8;
                    Entry.hw.sendQueue['EEPR1'] = value & 0xff;

                    script.isStart = true;
                    script.timeFlag = 1;
                    var timeValue = 0.05;
                    var fps = Entry.FPS || 60;
                    timeValue = 60 / fps * timeValue * 1000;

                    var blockId = script.block.id;
                    Entry.TimeWaitManager.add(
                        blockId,
                        function() {
                            script.timeFlag = 0;
                        },
                        timeValue
                    );

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
        },
    };
};

module.exports = Entry.ProboConnect;
