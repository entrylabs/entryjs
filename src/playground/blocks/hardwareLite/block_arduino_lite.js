'use strict';

// - 라이프사이클 재점검
// - Entry.hw 부분 Entry.hwLite로 수정
// - portData 파라미터 확인
// - 모니터링 로직 확인

import _range from 'lodash/range';

(function () {
    Entry.ArduinoLite = new (class ArduinoLite {
        constructor() {
            this.id = ['1.1', '4.2', '8.1'];
            this.name = 'ArduinoLite';
            this.url = 'http://www.arduino.cc/';
            this.imageName = 'arduinolite.png';
            this.title = {
                ko: '아두이노',
                en: 'Arduino',
            };
            // duration도 미확인
            this.duration = 32;
            this.blockMenuBlocks = [
                'arduinolite_get_number_sensor_value',
                'arduinolite_get_digital_value',
                'arduinolite_toggle_led',
                'arduinolite_toggle_pwm',
                'arduinolite_convert_scale',
            ];
            this.portData = {
                baudRate: 9600,
                duration: 32,
                dataBits: 8,
                parity: 'none',
                stopBits: 1,
                bufferSize: 512,
                constantServing: true,
            };
            this.readablePorts = [];
            this.remainValue = null;
            this.setZero();
        }

        setZero() {
            this.port = new Array(14).fill(0);
            this.digitalValue = new Array(14).fill(0);
            this.remoteDigitalValue = new Array(14).fill(0);
            this.analogValue = new Array(6).fill(0);
            this.readablePorts = _range(0, 19);

            if (Entry.hwLite) {
                Entry.hwLite.update();
            }
        }

        // 디바이스에서 값을 읽어온다.
        handleLocalData(data) {
            // data: Native Buffer
            for (let i = 0; i < 32; i++) {
                let chunk;
                if (!this.remainValue) {
                    chunk = data[i];
                } else {
                    chunk = this.remainValue;
                    i--;
                }
                if (chunk >> 7) {
                    if ((chunk >> 6) & 1) {
                        const nextChunk = data[i + 1];
                        if (!nextChunk && nextChunk !== 0) {
                            this.remainValue = chunk;
                        } else {
                            this.remainValue = null;

                            const port = (chunk >> 3) & 7;
                            this.analogValue[port] = ((chunk & 7) << 7) + (nextChunk & 127);
                        }
                        i++;
                    } else {
                        const port = (chunk >> 2) & 15;
                        this.digitalValue[port] = chunk & 1;
                    }
                }
            }
        }

        //디바이스에 값을 쓴다.
        requestLocalData() {
            const queryString = [];
            const readablePorts = this.readablePorts;

            if (readablePorts) {
                for (const i in readablePorts) {
                    const query = (5 << 5) + (readablePorts[i] << 1);
                    queryString.push(query);
                }
            }
            const readablePortsValues = (readablePorts && Object.values(readablePorts)) || [];
            for (let port = 0; port < 14; port++) {
                if (readablePortsValues.indexOf(port) > -1) {
                    continue;
                }
                const value = this.remoteDigitalValue[port];
                if (value === 255 || value === 0) {
                    const query = (7 << 5) + (port << 1) + (value == 255 ? 1 : 0);
                    queryString.push(query);
                } else if (value > 0 && value < 255) {
                    let query = (6 << 5) + (port << 1) + (value >> 7);
                    queryString.push(query);
                    query = value & 127;
                    queryString.push(query);
                }
            }
            return queryString;
        }

        addReadablePort(port){
            const idx = Entry.ArduinoLite.readablePorts.indexOf(port);
            if (idx === -1) {
                Entry.ArduinoLite.readablePorts.push(port);
            }
        }

        removeReadablePort(port){
            const idx = Entry.ArduinoLite.readablePorts.indexOf(port);
            if (idx >= 0) {
                Entry.ArduinoLite.readablePorts.splice(idx, 1);
            }
        }

        // get monitorTemplate() {
        //     return {
        //         imgPath: 'hw_lite/arduinolite.png',
        //         width: 605,
        //         height: 434,
        //         listPorts: {
        //             '2': {
        //                 name: `${Lang.Hw.port_en} 2 ${Lang.Hw.port_ko}`,
        //                 type: 'input',
        //                 pos: { x: 0, y: 0 },
        //             },
        //             '3': {
        //                 name: `${Lang.Hw.port_en} 3 ${Lang.Hw.port_ko}`,
        //                 type: 'input',
        //                 pos: { x: 0, y: 0 },
        //             },
        //             '4': {
        //                 name: `${Lang.Hw.port_en} 4 ${Lang.Hw.port_ko}`,
        //                 type: 'input',
        //                 pos: { x: 0, y: 0 },
        //             },
        //             '5': {
        //                 name: `${Lang.Hw.port_en} 5 ${Lang.Hw.port_ko}`,
        //                 type: 'input',
        //                 pos: { x: 0, y: 0 },
        //             },
        //             '6': {
        //                 name: `${Lang.Hw.port_en} 6 ${Lang.Hw.port_ko}`,
        //                 type: 'input',
        //                 pos: { x: 0, y: 0 },
        //             },
        //             '7': {
        //                 name: `${Lang.Hw.port_en} 7 ${Lang.Hw.port_ko}`,
        //                 type: 'input',
        //                 pos: { x: 0, y: 0 },
        //             },
        //             '8': {
        //                 name: `${Lang.Hw.port_en} 8 ${Lang.Hw.port_ko}`,
        //                 type: 'input',
        //                 pos: { x: 0, y: 0 },
        //             },
        //             '9': {
        //                 name: `${Lang.Hw.port_en} 9 ${Lang.Hw.port_ko}`,
        //                 type: 'input',
        //                 pos: { x: 0, y: 0 },
        //             },
        //             '10': {
        //                 name: `${Lang.Hw.port_en} 10 ${Lang.Hw.port_ko}`,
        //                 type: 'input',
        //                 pos: { x: 0, y: 0 },
        //             },
        //             '11': {
        //                 name: `${Lang.Hw.port_en} 11 ${Lang.Hw.port_ko}`,
        //                 type: 'input',
        //                 pos: { x: 0, y: 0 },
        //             },
        //             '12': {
        //                 name: `${Lang.Hw.port_en} 12 ${Lang.Hw.port_ko}`,
        //                 type: 'input',
        //                 pos: { x: 0, y: 0 },
        //             },
        //             '13': {
        //                 name: `${Lang.Hw.port_en} 13 ${Lang.Hw.port_ko}`,
        //                 type: 'input',
        //                 pos: { x: 0, y: 0 },
        //             },
        //             a0: {
        //                 name: `${Lang.Hw.port_en} A0 ${Lang.Hw.port_ko}`,
        //                 type: 'input',
        //                 pos: { x: 0, y: 0 },
        //             },
        //             a1: {
        //                 name: `${Lang.Hw.port_en} A1 ${Lang.Hw.port_ko}`,
        //                 type: 'input',
        //                 pos: { x: 0, y: 0 },
        //             },
        //             a2: {
        //                 name: `${Lang.Hw.port_en} A2 ${Lang.Hw.port_ko}`,
        //                 type: 'input',
        //                 pos: { x: 0, y: 0 },
        //             },
        //             a3: {
        //                 name: `${Lang.Hw.port_en} A3 ${Lang.Hw.port_ko}`,
        //                 type: 'input',
        //                 pos: { x: 0, y: 0 },
        //             },
        //             a4: {
        //                 name: `${Lang.Hw.port_en} A4 ${Lang.Hw.port_ko}`,
        //                 type: 'input',
        //                 pos: { x: 0, y: 0 },
        //             },
        //             a5: {
        //                 name: `${Lang.Hw.port_en} A5 ${Lang.Hw.port_ko}`,
        //                 type: 'input',
        //                 pos: { x: 0, y: 0 },
        //             },
        //         },
        //         mode: 'both',
        //     }
        // }

        // getMonitorPort() {
        //     return {
        //         //TODO : 통신때마다 모니터되는 포트 업데이트 하기위해 현재 포트값들 리턴
        //     }
        // }

        setLanguage() {
            return {
                ko: {
                    template: {
                        arduinolite_text: '%1',
                        arduinolite_get_sensor_number: '%1',
                        arduinolite_get_port_number: '%1',
                        arduinolite_get_pwm_port_number: '%1',
                        arduinolite_get_number_sensor_value: '아날로그 %1 번 센서값  ',
                        arduinolite_get_digital_value: '디지털 %1 번 센서값  ',
                        arduinolite_toggle_led: '디지털 %1 번 핀 %2 %3',
                        arduinolite_toggle_pwm: '디지털 %1 번 핀을 %2 (으)로 정하기 %3',
                        arduinolite_convert_scale:
                            '%1 값의 범위를 %2 ~ %3 에서 %4 ~ %5 (으)로 바꾼값  ',
                    },
                    Device: {
                        arduinolite: '아두이노',
                    },
                    Menus: {
                        arduinolite: '아두이노',
                    },
                },
                en: {
                    template: {
                        arduinolite_text: '%1',
                        arduinolite_get_sensor_number: '%1',
                        arduinolite_get_port_number: '%1',
                        arduinolite_get_pwm_port_number: '%1',
                        arduinolite_get_number_sensor_value: 'Analog %1 Sensor value  ',
                        arduinolite_get_digital_value: 'Digital %1 Sensor value  ',
                        arduinolite_toggle_led: 'Digital %1 Pin %2 %3',
                        arduinolite_toggle_pwm: 'Digital %1 Pin %2 %3',
                        arduinolite_convert_scale: 'Map Value %1 %2 ~ %3 to %4 ~ %5  ',
                    },
                    Device: {
                        arduinolite: 'arduinolite',
                    },
                    Menus: {
                        arduinolite: 'ArduinoLite',
                    },
                },
            };
        }

        getBlocks() {
            return {
                //region arduino 아두이노
                arduinolite_text: {
                    color: '#FFD974',
                    skeleton: 'basic_string_field',
                    statements: [],
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
                                        converter:
                                            Entry.block.converters.returnStringOrNumberByValue,
                                    },
                                ],
                                keyOption: 'arduinolite_text',
                            },
                        ],
                    },
                },
                arduinolite_get_sensor_number: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
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
                                keyOption: 'arduinolite_get_sensor_number',
                            },
                        ],
                    },
                },
                arduinolite_get_port_number: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['0', '0'],
                                ['1', '1'],
                                ['2', '2'],
                                ['3', '3'],
                                ['4', '4'],
                                ['5', '5'],
                                ['6', '6'],
                                ['7', '7'],
                                ['8', '8'],
                                ['9', '9'],
                                ['10', '10'],
                                ['11', '11'],
                                ['12', '12'],
                                ['13', '13'],
                            ],
                            value: '0',
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
                                            ['0', '0'],
                                            ['1', '1'],
                                            ['2', '2'],
                                            ['3', '3'],
                                            ['4', '4'],
                                            ['5', '5'],
                                            ['6', '6'],
                                            ['7', '7'],
                                            ['8', '8'],
                                            ['9', '9'],
                                            ['10', '10'],
                                            ['11', '11'],
                                            ['12', '12'],
                                            ['13', '13'],
                                        ],
                                        value: '0',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                    },
                                ],
                                keyOption: 'arduinolite_get_port_number',
                            },
                        ],
                    },
                },
                arduinolite_get_pwm_port_number: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    statements: [],
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
                                        converter:
                                            Entry.block.converters.returnStringOrNumberByValue,
                                    },
                                ],
                                keyOption: 'arduinolite_get_pwm_port_number',
                            },
                        ],
                    },
                },
                arduinolite_get_number_sensor_value: {
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
                                type: 'arduinolite_get_sensor_number',
                            },
                        ],
                        type: 'arduinolite_get_number_sensor_value',
                    },
                    paramsKeyMap: {
                        VALUE: 0,
                    },
                    class: 'arduino_value',
                    isNotFor: ['ArduinoLite'],
                    func(sprite, script) {
                        // const signal = script.getValue('VALUE', script);
                        // return Entry.hw.getAnalogPortValue(signal[1]);
                        return Entry.ArduinoLite.analogValue[
                            script.getNumberValue('VALUE', script)
                        ];
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'ArduinoLite.sensor_value(%1)',
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
                arduinolite_get_digital_value: {
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
                                type: 'arduinolite_get_port_number',
                            },
                        ],
                        type: 'arduinolite_get_digital_value',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                    },
                    class: 'arduino_value',
                    isNotFor: ['ArduinoLite'],
                    func(sprite, script) {
                        if (Entry.hwLite.hwModule.name === 'ArduinoExtLite') {
                            console.log('ArduinoExtLite is not supported');
                            // TO-DO : 아두이노 확장 웹연결 지원시 추가
                            // return Entry.block.arduinolite_ext_get_digital.func(sprite, script);
                        } else {
                            const port = script.getNumberValue('PORT', script);
                            Entry.ArduinoLite.addReadablePort(port);
                            return Entry.ArduinoLite.digitalValue[port];
                        }
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'ArduinoLite.digitalRead(%1)',
                                blockType: 'param',
                                replaceBlockType: 'arduinolite_ext_get_digital',
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
                arduinolite_toggle_led: {
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
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.ARDUINO_on, 'on'],
                                [Lang.Blocks.ARDUINO_off, 'off'],
                            ],
                            value: 'on',
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
                            {
                                type: 'arduinolite_get_port_number',
                            },
                            null,
                            null,
                        ],
                        type: 'arduinolite_toggle_led',
                    },
                    paramsKeyMap: {
                        VALUE: 0,
                        OPERATOR: 1,
                    },
                    class: 'arduino_set',
                    isNotFor: ['ArduinoLite'],
                    func(sprite, script) {
                        const port = script.getNumberValue('VALUE');
                        const operator = script.getField('OPERATOR');
                        const value = operator == 'on' ? 255 : 0;
                        Entry.ArduinoLite.remoteDigitalValue[port] = value;
                        Entry.ArduinoLite.removeReadablePort(port);
                        return script.callReturn();
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'ArduinoLite.pin_digital(%1, %2)',
                                textParams: [
                                    {
                                        type: 'Block',
                                        accept: 'string',
                                    },
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.ARDUINO_on, 'on'],
                                            [Lang.Blocks.ARDUINO_off, 'off'],
                                        ],
                                        value: 'on',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                            },
                        ],
                    },
                },
                arduinolite_toggle_pwm: {
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
                            type: 'Indicator',
                            img: 'block_icon/hardware_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'arduinolite_get_pwm_port_number',
                            },
                            {
                                type: 'arduinolite_text',
                                params: ['255'],
                            },
                            null,
                        ],
                        type: 'arduinolite_toggle_pwm',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                        VALUE: 1,
                    },
                    class: 'arduino_set',
                    isNotFor: ['ArduinoLite'],
                    func(sprite, script) {
                        const port = script.getNumberValue('PORT');
                        let value = script.getNumberValue('VALUE');
                        value = Math.round(value);
                        value = Math.max(value, 0);
                        value = Math.min(value, 255);
                        Entry.ArduinoLite.remoteDigitalValue[port] = value;
                        Entry.ArduinoLite.removeReadablePort(port)
                        return script.callReturn();
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'ArduinoLite.set_pin_digital(%1, %2)',
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
                arduinolite_convert_scale: {
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
                                type: 'arduinolite_get_number_sensor_value',
                                params: [
                                    {
                                        type: 'arduinolite_get_sensor_number',
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
                                params: ['100'],
                            },
                        ],
                        type: 'arduinolite_convert_scale',
                    },
                    paramsKeyMap: {
                        VALUE1: 0,
                        VALUE2: 1,
                        VALUE3: 2,
                        VALUE4: 3,
                        VALUE5: 4,
                    },
                    class: 'arduino',
                    isNotFor: ['ArduinoLite'],
                    func(sprite, script) {
                        const value1 = script.getNumberValue('VALUE1', script);
                        let value2 = script.getNumberValue('VALUE2', script);
                        let value3 = script.getNumberValue('VALUE3', script);
                        let value4 = script.getNumberValue('VALUE4', script);
                        let value5 = script.getNumberValue('VALUE5', script);

                        const stringValue4 = script.getValue('VALUE4', script);
                        const stringValue5 = script.getValue('VALUE5', script);
                        let isFloat = false;

                        if (
                            (Entry.Utils.isNumber(stringValue4) &&
                                stringValue4.indexOf('.') > -1) ||
                            (Entry.Utils.isNumber(stringValue5) && stringValue5.indexOf('.') > -1)
                        ) {
                            isFloat = true;
                        }

                        let result = value1;
                        if (value2 > value3) {
                            const swap = value2;
                            value2 = value3;
                            value3 = swap;
                        }
                        if (value4 > value5) {
                            const swap = value4;
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
                                syntax: 'ArduinoLite.convert_scale(%1, %2, %3, %4, %5)',
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
                //endregion arduino 아두이노
            };
        }
    })();
})();

module.exports = Entry.ArduinoLite;
