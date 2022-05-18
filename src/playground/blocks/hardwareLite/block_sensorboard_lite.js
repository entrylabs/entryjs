'use strict';

import _range from 'lodash/range';

(function() {
    Entry.SensorboardLite = new (class SensorboardLite {
        constructor() {
            this.id = '1.2';
            this.name = 'SensorboardLite';
            this.url = 'http://www.neweducation.co.kr/';
            this.imageName = 'sensorboardlite.png';
            this.title = {
                ko: 'E-센서보드',
                en: 'E-Sensorboard',
            };
            this.duration = 16;
            this.blockMenuBlocks = [
                'sensorboardlite_get_named_sensor_value',
                'sensorboardlite_is_button_pressed',
                'sensorboardlite_led',
                'sensorboardlite_get_number_sensor_value',
                'sensorboardlite_get_digital_value',
                'sensorboardlite_toggle_digital',
                'sensorboardlite_toggle_pwm',
                'sensorboardlite_convert_scale',
            ];
            this.portData = {
                baudRate: 57600,
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
            this.port = new Array(12).fill(0);
            this.analogValue = new Array(6).fill(0);
            this.digitalValue = new Array(12).fill(0);
            this.remoteDigitalValue = new Array(12).fill(0);
            this.readablePorts = _range(0, 19);

            if (Entry.hwLite) {
                Entry.hwLite.update();
            }
        }

        handleLocalData(data) {
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
            for (let port = 0; port < 12; port++) {
                // if (readablePortsValues.indexOf(port) > -1) {
                //     continue;
                // }
                const value = this.digitalValue[port];
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

        addReadablePort(port) {
            const idx = Entry.SensorboardLite.readablePorts.indexOf(port);
            if (idx === -1) {
                Entry.SensorboardLite.readablePorts.push(port);
            }
        }

        removeReadablePort(port) {
            const idx = Entry.SensorboardLite.readablePorts.indexOf(port);
            if (idx >= 0) {
                Entry.SensorboardLite.readablePorts.splice(idx, 1);
            }
        }

        setLanguage() {
            return {
                ko: {
                    template: {
                        sensorboardlite_get_number_sensor_value: '아날로그 %1 번 센서값  ',
                        sensorboardlite_get_digital_value: '디지털 %1 번 센서값  ',
                        sensorboardlite_toggle_digital: '디지털 %1 번 핀 %2 %3',
                        sensorboardlite_toggle_pwm: '디지털 %1 번 핀을 %2 (으)로 정하기 %3',
                        sensorboardlite_convert_scale:
                            '%1 값의 범위를 %2 ~ %3 에서 %4 ~ %5 (으)로 바꾼값  ',
                        sensorboardlite_get_named_sensor_value: '%1  센서값',
                        sensorboardlite_is_button_pressed: '%1  버튼을 눌렀는가?',
                        sensorboardlite_led: '%1  LED %2   %3',
                    },
                },
                en: {
                    template: {
                        sensorboardlite_get_number_sensor_value: 'Analog %1 Sensor value  ',
                        sensorboardlite_get_digital_value: 'Digital %1 Sensor value  ',
                        sensorboardlite_toggle_digital: 'Digital %1 Pin %2 %3',
                        sensorboardlite_toggle_pwm: 'Digital %1 Pin %2 %3',
                        sensorboardlite_convert_scale: 'Map Value %1 %2 ~ %3 to %4 ~ %5  ',
                        sensorboardlite_get_named_sensor_value: '%1  Sensor value',
                        sensorboardlite_is_button_pressed: 'Pressed %1 button?',
                        sensorboardlite_led: '%1  LED %2   %3',
                    },
                },
            };
        }

        getBlocks() {
            return {
                sensorboardlite_get_named_sensor_value: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_string_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['소리', '0'],
                                ['빛 감지', '1'],
                                ['슬라이더', '2'],
                                ['온도', '3'],
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
                        type: 'sensorboardlite_get_named_sensor_value',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                    },
                    class: 'sensorBoard',
                    isNotFor: ['SensorboardLite'],
                    func(sprite, script) {
                        return Entry.SensorboardLite.analogValue[script.getField('PORT', script)];
                    },
                    syntax: { js: [], py: ['Sensorboard.sensor_value(%1)'] },
                },
                sensorboardlite_is_button_pressed: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_boolean_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['빨간', '8'],
                                ['파란', '9'],
                                ['노랑', '10'],
                                ['초록', '11'],
                            ],
                            value: '8',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null],
                        type: 'sensorboardlite_is_button_pressed',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                    },
                    class: 'sensorBoard',
                    isNotFor: ['SensorboardLite'],
                    func(sprite, script) {
                        const port = script.getNumberValue('PORT', script);
                        Entry.SensorboardLite.addReadablePort(port);
                        return Entry.SensorboardLite.digitalValue[port];
                    },
                    syntax: { js: [], py: ['Sensorboard.is_button_pressed(%1)'] },
                },
                sensorboardlite_led: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['빨간', '2'],
                                ['초록', '3'],
                                ['파란', '4'],
                                ['노랑', '5'],
                            ],
                            value: '2',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                ['켜기', '255'],
                                ['끄기', '0'],
                            ],
                            value: '255',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null, null, null],
                        type: 'sensorboardlite_led',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                        OPERATOR: 1,
                    },
                    class: 'sensorBoard',
                    isNotFor: ['SensorboardLite'],
                    func(sprite, script) {
                        // Entry.SensorboardLite.digitalValue[script.getField('PORT')] =
                        //     script.getNumberField('OPERATOR');
                        const port = script.getField('PORT');
                        const operator = script.getNumberField('OPERATOR');
                        Entry.SensorboardLite.remoteDigitalValue[port] = operator;
                        return script.callReturn();
                    },
                    syntax: { js: [], py: ['Sensorboard.led(%1, %2)'] },
                },
                sensorboardlite_get_number_sensor_value: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    isNotFor: ['SensorboardLite'],
                    def: {
                        type: 'sensorboardlite_get_number_sensor_value',
                    },
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
                            ],
                            value: '0',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    class: 'arduino_value',
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'SensorBoard.get_number_sensor_value(%1)',
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
                    paramsKeyMap: {
                        VALUE: 0,
                    },
                    func(sprite, script) {
                        return Entry.SensorboardLite.analogValue[
                            script.getNumberValue('VALUE', script)
                        ];
                    },
                },
                sensorboardlite_get_digital_value: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    parent: 'arduino_get_digital_value',
                    skeleton: 'basic_boolean_field',
                    isNotFor: ['SensorboardLite'],
                    def: {
                        type: 'sensorboardlite_get_digital_value',
                    },
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
                    class: 'arduino_value',
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'SensorBoard.get_digital_value(%1)',
                                blockType: 'param',
                                replaceBlockType: 'arduino_ext_get_digital',
                                textParams: [
                                    {
                                        type: 'Block',
                                        accept: 'string',
                                    },
                                ],
                            },
                        ],
                    },
                    paramsKeyMap: {
                        PORT: 0,
                    },
                    func(sprite, script) {
                        const port = script.getNumberValue('PORT', script);
                        Entry.SensorboardLite.addReadablePort(port);
                        return Entry.SensorboardLite.digitalValue[port];
                    },
                },
                sensorboardlite_toggle_digital: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    isNotFor: ['SensorboardLite'],
                    def: {
                        type: 'sensorboardlite_toggle_digital',
                    },
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
                        {
                            type: 'Dropdown',
                            options: [
                                ['켜기', 255],
                                ['끄기', 0],
                            ],
                            value: 255,
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    class: 'arduino_set',
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'SensorBoard.toggle_led(%1)',
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
                    paramsKeyMap: {
                        VALUE: 0,
                        OPERATOR: 1,
                    },
                    func(sprite, script) {
                        const port = script.getNumberValue('VALUE');
                        const operator = script.getField('OPERATOR');
                        Entry.SensorboardLite.digitalValue[port] = operator;
                        Entry.SensorboardLite.removeReadablePort(port);
                        return script.callReturn();
                    },
                },
                sensorboardlite_toggle_pwm: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    isNotFor: ['SensorboardLite'],
                    skeleton: 'basic',
                    def: {
                        type: 'sensorboardlite_toggle_pwm',
                    },
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
                        {
                            type: 'Block',
                            accept: 'string',
                            defaultType: 'number',
                            value: 255,
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    class: 'arduino_set',
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'SensorBoard.toggle_pwm(%1, %2)',
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
                    paramsKeyMap: {
                        PORT: 0,
                        VALUE: 1,
                    },
                    func(sprite, script) {
                        const port = script.getNumberValue('PORT');
                        let value = script.getNumberValue('VALUE');
                        value = Math.round(value);
                        value = Math.max(value, 0);
                        value = Math.min(value, 255);
                        Entry.SensorboardLite.remoteDigitalValue[port] = value;
                        Entry.SensorboardLite.removeReadablePort(port);
                        return script.callReturn();
                    },
                },
                sensorboardlite_convert_scale: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic_string_field',
                    isNotFor: ['SensorboardLite'],
                    def: {
                        params: [
                            {
                                type: 'arduino_get_number_sensor_value',
                                params: [
                                    {
                                        type: 'arduino_get_sensor_number',
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
                        type: 'sensorboardlite_convert_scale',
                    },
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
                    class: 'arduino',
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'SensorBoard.convert_scale(%1, %2, %3, %4, %5)',
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
                    paramsKeyMap: {
                        VALUE1: 0,
                        VALUE2: 1,
                        VALUE3: 2,
                        VALUE4: 3,
                        VALUE5: 4,
                    },
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
                },
            };
        }
    })();
})();

module.exports = Entry.SensorboardLite;
