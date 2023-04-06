class Testino {
    constructor() {
        this.id = 'FF.FF';
        this.url = 'http://www.my-company.org/';
        this.name = 'Testino';
        this.imageName = 'dalgona.png'; //thumbnail
        this.title = {
            ko: '테스트이노',
            en: 'testino',
        };

        // 작성한 블록의 이름을 추가합니다.
        this.blockMenuBlocks = [
            'dalgona_on_digital_value', 
            'dalgona_off_digital_value',
            'dalgona_get_number_sensor_value',
            'dalgona_convert_scale',
            'dalgona_toggle_pwm',
        ];

        this.sensorTypes = {
        ALIVE: 0,
        DIGITAL: 1,
        ANALOG: 2,
        PWM: 3,
        SERVO_PIN: 4,
        TONE: 5,
        PULSEIN: 6,
        ULTRASONIC: 7,
        TIMER: 8,
        NEOPIXELINIT: 9,
        NEOPIXELCOLOR: 10,
        DHTINIT: 21,
        DHTTEMP: 22,
        DHTHUMI: 23,
        NOTONE: 24,
        PMINIT: 31,
        PMVALUE: 32,
        LCDINIT: 41,
        LCD: 42,
        LCDCLEAR: 43,
        LCDEMOTICON: 44,
        };

        this.duration = {
        TIME_1ms: 1,
        TIME_5ms: 5,
        TIME_10ms: 10,
        TIME_20ms: 20,
        TIME_50ms: 50,
        TIME_100ms: 100,
        TIME_200ms: 200, 
        TIME_500ms: 500,    
        TIME_600ms: 600,
       };
    }

    setZero() {
        // 엔트리 실행이 정지되었을때 보낼 신호 (reset 명령을 보냄)
        // 2번부터 13번 포트를 0으로 초기화 할 것입니다.
        for (let i = 2; i < 14; i++) {
            Entry.hw.sendQueue[i] = 0;
        }

        Entry.hw.update(); // 하드웨어에 정보를 보냄
    }

    

    setLanguage() {
        return {
            ko: {
                template: {
                    dalgona_on_digital_value: '디지털 핀 %1 번을 켜기',
                    dalgona_off_digital_value: '디지털 핀 %1 번을 끄기',
                    dalgona_get_number_sensor_value: '아날로그 %1 번 센서값',
                    dalgona_convert_scale: '%1 값의 범위를 %2 ~ %3 에서 %4 ~ %5 (으)로 바꾼값',
                    dalgona_toggle_pwm: '디지털 %1 번 핀을 %2 (으)로 정하기 %3',
                },
            },
            en: {
                template: {
                    dalgona_on_digital_value: 'turn on digital pin %1',
                    dalgona_off_digital_value: 'turn off digital pin %1',
                    dalgona_get_number_sensor_value: 'Analog %1 Sensor value',
                    dalgona_convert_scale: 'Map Value %1 %2 ~ %3 to %4 ~ %5',
                    dalgona_toggle_pwm: 'Digital %1 Pin %2 %3',
                },
            },
        };
    }

    getBlocks() {
        return {
            // 원래 있던 거에서 조금 수정
            dalgona_on_digital_value: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic', // 블록 모양 템플릿. 자세한 목록은 docs 를 참고해주세요
                statements: [],
                params: [
                    //입력될 파라미터들의 속성을 정의
                    {
                        type: 'Block',
                        accept: 'string', //숫자만 들어가도 string 입니다. 엔트리엔 이를 구분하지 않습니다.
                    },
                    // basic skeleton 의 마지막엔 인디케이터를 추가해주셔야 합니다.
                    { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
                ],
                def: {
                    params: [
                        //파라미터에 들어갈 기본 값.
                        {
                            type: 'number',
                            params: [4],
                        },
                    ],
                    type: 'dalgona_on_digital_value', // 블록 상속과 관련된 값입니다. 블록명과 동일하게 해주면 됩니다.
                },
                paramsKeyMap: {
                    // 실제 블록의 로직인 func 에서 해당 인덱스의 파라미터를 가져올때 쓸 key 값
                    PORT: 0,
                },
                events: {},
                class: 'TestinoBlock', // 블록을 묶어서 보여줄 단위값. 이 값이 바뀌면 사이에 가로줄이 생깁니다.
                isNotFor: ['Testino'], // 하드웨어가 연결되었을 경우만 블록을 보여주겠다는 판단값입니다. name 과 동일해야 합니다.
                func: (sprite, script) => {
                    // paramsKeyMap 에서 PORT 는 파라미터의 0번 인덱스 값이었습니다.
                    const portNumber = script.getNumberValue('PORT');
                    const value = 255;
                    Entry.hw.sendQueue[portNumber] = value;
                    // Entry.hw.setDigitalPortValue(portNumber, value);
                    // 값을 반환해야하는 경우는 return 할 수 있습니다.
                },
                syntax: {
                    // 파이썬 문법 변환에 사용되고 있습니다.
                    js: [],
                    py: [
                        {
                            syntax: 'Testino.turnOnDigitalPort(%1)',
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
            dalgona_off_digital_value: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                    },
                    { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12 },
                ],
                def: {
                    params: [
                        {
                            type: 'number',
                            params: [4],
                        },
                    ],
                    type: 'dalgona_off_digital_value',
                },
                paramsKeyMap: {
                    PORT: 0,
                },
                events: {},
                class: 'TestinoBlock',
                isNotFor: ['Testino'],
                func: (sprite, script) => {
                    const portNumber = script.getNumberValue('PORT');
                    Entry.hw.sendQueue[portNumber] = 0;
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            syntax: 'Testino.turnOffDigitalPort(%1)',
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
            // arduino 문서 참고하여 내가 만드는 거 거의 조금 수정한 꼴이네....
            dalgona_text: {
                color: '#FFD974',
                skeleton: 'basic_string_field',
                statements: [],
                template: "%1",
                params: [
                    {
                        type: 'TextInput',
                    },
                ],
                events: {},
                def: {
                    params: ['10'],
                },
                paramsKeyMap: {
                    NAME: 0,
                },
                func(sprite, script) {
                    return script.getStringField('NAME');
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            syntax: '%1',
                            textParams: [
                                {
                                    type: 'TextInput',
                                    value: 10,
                                    converter: Entry.block.converters.returnStringOrNumberByValue,
                                },
                            ],
                            keyOption: 'dalgona_text',
                        },
                    ],
                },
            },
            dalgona_get_sensor_number:{
                color: "#00979D",
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_string_field',
                template: "%1",
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            ['0', 'A0'],
                            ['1', 'A1'],
                            ['2', 'A2'],
                            ['3', 'A3'],
                            ['4', 'A4'],
                            ['5', 'A5'],
                        ],
                        value: 'A0',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },{type: "Indicator", img: "block_icon/hardware_03.png", size: 12},
                ],
                events: {},
                def: {
                    params: [null],
                    type: "default_dropdown_block",
                },
                paramsKeyMap: {
                    PORT: 0,
                },
                func(sprite, script) {
                    return script.getStringField('PORT');
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
                                        ['0', 'A0'],
                                        ['1', 'A1'],
                                        ['2', 'A2'],
                                        ['3', 'A3'],
                                        ['4', 'A4'],
                                        ['5', 'A5'],
                                    ],
                                    value: 'A0',
                                    fontSize: 11,
                                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                    converter: Entry.block.converters.returnStringValue,
                                },
                            ],
                            keyOption: 'dalgona_get_sensor_number',
                        },
                    ],
                },
            },
            dalgona_get_pwm_port_number: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic_string_field',
                statements: [],
                template: "%1",
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            ['3', '3'],
                            ['5', '5'],
                            ['6', '6'],
                            ['9', '9'],
                            ['10', '10'],
                            ['11', '11'],
                        ],
                        value: '3',
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
                    return script.getStringField('PORT');
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
                                        ['3', '3'],
                                        ['5', '5'],
                                        ['6', '6'],
                                        ['9', '9'],
                                        ['10', '10'],
                                        ['11', '11'],
                                    ],
                                    value: '3',
                                    fontSize: 11,
                                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                    converter: Entry.block.converters.returnStringOrNumberByValue,
                                },
                            ],
                            keyOption: 'dalgona_get_pwm_port_number',
                        },
                    ],
                },
            },

            // 아날로그 n번 센서값
            dalgona_get_number_sensor_value:{
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                        defaultType: 'number',
                    },
                ],
                def: {
                    params: [
                        {
                            type: 'dalgona_get_sensor_number',
                        },
                    ],
                    type: 'dalgona_get_number_sensor_value',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                events: {},
                class: 'TestinoBlock',
                isNotFor: ['Testino'],
                func(sprite, script){
                    const signal = script.getValue('VALUE', script);
                    return Entry.hw.getAnalogPortValue(signal[1]);
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            syntax: 'Tesetino.sensor_value(%1)',
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
            // 디지털 값으로 주는 것
            dalgona_toggle_pwm:{
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
                    { type: 'Indicator', img: 'block_icon/hardware_icon.svg', size: 12, },
                ],
                events: {},
                def: {
                    params: [
                        {
                            type: 'dalgona_get_pwm_port_number',
                        },
                        {
                            type: 'dalgona_text',
                            params: ['255'],
                        },
                        null,
                    ],
                    type: 'dalgona_toggle_pwm',
                },
                paramsKeyMap:{
                    PORT: 0,
                    VALUE: 1,
                },
                
                class: 'TestinoBlock',
                isNotFor: ['Testino'],
                func(sprite, script){
                    const port = script.getNumberValue('PORT');
                    let value = script.getNumberValue('VALUE');
                    value = Math.round(value);
                    value = Math.max(value, 0);
                    value = Math.min(value, 255);
                    Entry.hw.setDigitalPortValue(port, value);
                    return script.callReturn();
                },
                syntax: {
                    js: [],
                    ps: [
                        {
                            syntax: 'Testino.set_pin_digital(%1, %2)',
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
            // 아날로그 값 계산하는 것
            dalgona_convert_scale:{
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
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
                            type: 'dalgona_get_number_sensor_value',
                            params: [
                                {
                                    type: 'dalgona_get_sensor_number',
                                    id: 'bl5e',
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
                            params: ['255'],
                        },
                    ],
                    type: 'dalgona_convert_scale',
                },
                paramsKeyMap: {
                    VALUE1: 0,
                    VALUE2: 1,
                    VALUE3: 2,
                    VALUE4: 3,
                    VALUE5: 4,
                },
                class: 'TestinoBlock',
                isNotFor: ['Testino'],
                func(sprite, script){
                    const value1 = script.getNumberValue('VALUE1', script);
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

                let result = value1;
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
                            syntax: 'Testino.convert_scale(%1, %2, %3, %4, %5)',
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
        };
    }
}

Entry.Testino = new Testino();
module.exports = Entry.Testino;