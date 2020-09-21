'use strict';

Entry.freearduino = {
    id: '2B.1',
    name: 'freearduino',
    url: 'https://cafe.naver.com/robotclubmokdong',
    imageName: 'freearduino.png',
    title: {
        "ko": "프리 아두이노",
        "en": "freearduino"
    },
    setZero: function() {
        Entry.hw.sendQueue.readablePorts = [];
        for (var port = 0; port < 20; port++) {
            Entry.hw.sendQueue.readablePorts.push(port);
        }
        for (var port = 2; port < 20; port++) {
            Entry.hw.sendQueue[port] = 199;
        }
        for (var port = 20; port < 25; port++) {
            Entry.hw.sendQueue[port] = 0;
        }
        Entry.hw.sendQueue[0] = 0;
        Entry.hw.update();
    },
};

Entry.freearduino.blockMenuBlocks = [
    "freearduino_set_digital_value",
    "freearduino_get_digital_value",
    "freearduino_get_digital_value_pullup",
    "freearduino_set_pwm_value",
    "freearduino_get_analog_value",
    "freearduino_get_analog_value_pullup",
    "freearduino_get_analog_mapped_value",
    "freearduino_get_humidity_value",
    "freearduino_get_temperature_value",
    "freearduino_get_distance_value",
    "freearduino_set_servo_angle",
    "freearduino_set_motor_run",
    "freearduino_set_motor_speed",
];

Entry.freearduino.setLanguage = function() {
    return {
        ko: {
            template: {
                "freearduino_get_analog_value": "%1 핀 아날로그 입력값",
                "freearduino_get_analog_value_pullup": "%1 핀 아날로그 입력값 (PULL UP)",
                "freearduino_get_analog_mapped_value": "%1 의 범위를 %2 ~ %3 에서 %4 ~ %5 (으)로 바꾼값",
                "freearduino_get_humidity_value" : "온습도센서 %1 핀 습도값(%)",
                "freearduino_get_temperature_value" : "온습도센서 %1 핀 온도값(C)",
                "freearduino_get_distance_value" : "초음파센서 trig %1 echo %2 핀 거리값(mm)",
                "freearduino_set_digital_value": "%1 핀에 디지털 %2 출력 %3",
                "freearduino_get_digital_value": "%1 핀 디지털 입력값",
                "freearduino_get_digital_value_pullup": "%1 핀의 디지털 입력값 (PULL UP)",
                "freearduino_set_pwm_value" : "%1 핀에 아날로그 %2 값 출력 %3",
                "freearduino_set_servo_angle": "%1 핀 서보모터 각도를 %2 도로 정하기 %3",
                "freearduino_set_motor_run": "모터실드 %1 번 DC모터 %2 %3",
                "freearduino_set_motor_speed": "모터실드 %1 번 DC모터 속도를 %2 (으)로 정하기 %3",
            }
        },
        en: {
            template: {
                "freearduino_get_analog_value": "analogRead %1",
                "freearduino_get_analog_value_pullup": "analogRead %1 (PULL UP)",
                "freearduino_get_analog_mapped_value": "map %1 from %2 ~ %3 to %4 ~ %5",
                "freearduino_get_humidity_value" : "humidity value from DHT11 pin %1 (%)",
                "freearduino_get_temperature_value" : "temperature value from DHT11 pin %1 (C)",
                "freearduino_get_distance_value" : "fistance value from HC-SR04 trig %1 echo %2 (mm)",
                "freearduino_set_digital_value": "digitalWrite %1 to %2 %3",
                "freearduino_get_digital_value": "digitalRead %1 ",
                "freearduino_get_digital_value_pullup": "digitalRead %1 (PULL UP)",
                "freearduino_set_pwm_value" : "analogWrite %1 to %2 %3",
                "freearduino_set_servo_angle": "write servo attached %1 angle as %2 %3",
                "freearduino_set_motor_run": "set L293D motor %1 rotate %2 %3",
                "freearduino_set_motor_speed": "set L293D motor %1 speed to %2 %3",
            }
        }
    }
};

Entry.freearduino.getBlocks = function() {
    return {
        freearduino_get_analog_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,  
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['A0', '0'],
                        ['A1', '1'],
                        ['A2', '2'],
                        ['A3', '3'],
                        ['A4', '4'],
                        ['A5', '5'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: [null],
                type: 'freearduino_get_analog_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'freearduino_basic',
            isNotFor: ['freearduino'],
            func: function(sprite, script) {
                var port = script.getField('PORT',script);
                var ANALOG = Entry.hw.portData.ANALOG;
                return ANALOG[port];
            },
            syntax: { js: [], py: ['freearduino.get_analog_value(%1)'] },
        },

        freearduino_get_analog_value_pullup: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,  
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['A0', '0'],
                        ['A1', '1'],
                        ['A2', '2'],
                        ['A3', '3'],
                        ['A4', '4'],
                        ['A5', '5'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: [null],
                type: 'freearduino_get_analog_value_pullup',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'freearduino_basic',
            isNotFor: ['freearduino'],
            func: function(sprite, script) {
                var port = script.getField('PORT',script);
                var ANALOG = Entry.hw.portData.ANALOG_PULLUP;
                return ANALOG[port];
            },
            syntax: { js: [], py: ['freearduino.get_analog_value_pullup(%1)'] },
        },

        freearduino_get_analog_mapped_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,  
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    value: '0',
                    fontSize: 11,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    value: '0',
                    fontSize: 11,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    value: '1023',
                    fontSize: 11,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    value: '0',
                    fontSize: 11,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    value: '255',
                    fontSize: 11,
                },
            ],
            def: {
                params: [
                    {
                        type: 'freearduino_get_analog_value',
                        params: [ '0'],
                    }, 
                    null, null, null, null],
                type: 'freearduino_get_analog_mapped_value',
            },
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
                VALUE3: 2,
                VALUE4: 3,
                VALUE5: 4,
            },
            class: 'freearduino_basic',
            isNotFor: ['freearduino'],
            func: function(sprite, script) {
                var value1 = script.getNumberValue('VALUE1', script);
                var value2 = script.getNumberValue('VALUE2', script);
                var value3 = script.getNumberValue('VALUE3', script);
                var value4 = script.getNumberValue('VALUE4', script);
                var value5 = script.getNumberValue('VALUE5', script);

                var stringValue4 = script.getValue('VALUE4', script);
                var stringValue5 = script.getValue('VALUE5', script);
                var isFloat = false;

                if (
                    (Entry.Utils.isNumber(stringValue4) &&
                        stringValue4.indexOf('.') > -1) ||
                    (Entry.Utils.isNumber(stringValue5) &&
                        stringValue5.indexOf('.') > -1)
                ) {
                    isFloat = true;
                }

                var result = value1;
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
                py: ['freearduino_get_analog_mapped_value(%1, %2, %3, %4, %5)'],
            },
        },

        freearduino_get_humidity_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,  
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            params: [
                {
                    type: 'Dropdown',
                    options: [
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
                        ['A0', '14'],
                        ['A1', '15'],
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
            def: {
                params: [null],
                type: 'freearduino_get_humidity_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'freearduino_sensor',
            isNotFor: ['freearduino'],
            func: function(sprite, script) {
                var port = script.getField('PORT');
                Entry.hw.setDigitalPortValue(port, 201);
                script.callReturn();
                return Entry.hw.portData.DHT_HUMI;
            },
            syntax: { js: [], py: ['freearduino.get_humidity_value(%1)'] },
        },

        freearduino_get_temperature_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,  
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            params: [
                {
                    type: 'Dropdown',
                    options: [
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
                        ['A0', '14'],
                        ['A1', '15'],
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
            def: {
                params: [null],
                type: 'freearduino_get_temperature_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'freearduino_sensor',
            isNotFor: ['freearduino'],
            func: function(sprite, script) {
                var port = script.getField('PORT');
                Entry.hw.setDigitalPortValue(port, 201);
                script.callReturn();
                return Entry.hw.portData.DHT_TEMP;
            },
            syntax: { js: [], py: ['freearduino.get_temperature_value(%1)'] },
        },

        freearduino_get_distance_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,  
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            params: [
                {
                    type: 'Dropdown',
                    options: [
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
                        ['A0', '14'],
                        ['A1', '15'],
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
                        ['A0', '14'],
                        ['A1', '15'],
                        ['A2', '16'],
                        ['A3', '17'],
                        ['A4', '18'],
                        ['A5', '19'],
                    ],
                    value: '3',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: [null,null],
                type: 'freearduino_get_distance_value',
            },
            paramsKeyMap: {
                PORT1: 0,
                PORT2: 1,
            },
            class: 'freearduino_sensor',
            isNotFor: ['freearduino'],
            func: function(sprite, script) {
                var trig = script.getField('PORT1');
                var echo = script.getField('PORT2');
                Entry.hw.setDigitalPortValue(trig, 202);
                Entry.hw.setDigitalPortValue(echo, 203);
                script.callReturn();
                return Entry.hw.portData.US_DISTANCE;
            },
            syntax: { js: [], py: ['freearduino.get_distance_value(%1, %2)'] },
        },

        freearduino_set_digital_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,  
            skeleton: 'basic',
            fontColor: '#fff',
            params: [
                {
                    type: 'Dropdown',
                    options: [
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
                        ['A0', '14'],
                        ['A1', '15'],
                        ['A2', '16'],
                        ['A3', '17'],
                        ['A4', '18'],
                        ['A5', '19'],
                    ],
                    value: '13',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [['HIGH', '255'], ['LOW', '0']],
                    value: '255',
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
                params: [null, null, null],
                type: 'freearduino_set_digital_value',
            },
            paramsKeyMap: {
                PORT: 0,
                OPERATOR: 1,
            },
            class: 'freearduino_basic',
            isNotFor: ['freearduino'],
            func: function(sprite, script) {
                var port = script.getField('PORT');
                var value = script.getNumberField('OPERATOR');
                Entry.hw.setDigitalPortValue(port,value === 255 ? 200 : 199);
                return script.callReturn();
            },
            syntax: { js: [], py: ['freearduino.set_digital_value(%1, %2)'] },
        },

        freearduino_get_digital_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,  
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            params: [
                {
                    type: 'Dropdown',
                    options: [
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
                        ['A0', '14'],
                        ['A1', '15'],
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
            def: {
                params: [null],
                type: 'freearduino_get_digital_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'freearduino_basic',
            isNotFor: ['freearduino'],
            func: function(sprite, script) {
                var port = script.getField('PORT',script);
                var DIGITAL = Entry.hw.portData.DIGITAL;
                return DIGITAL[port];
            },
            syntax: { js: [], py: ['freearduino.get_digital_value(%1)'] },
        },

        freearduino_get_digital_value_pullup: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,  
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            params: [
                {
                    type: 'Dropdown',
                    options: [
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
                        ['A0', '14'],
                        ['A1', '15'],
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
            def: {
                params: [null],
                type: 'freearduino_get_digital_value_pullup',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'freearduino_basic',
            isNotFor: ['freearduino'],
            func: function(sprite, script) {
                var port = script.getField('PORT',script);
                var DIGITAL = Entry.hw.portData.DIGITAL_PULLUP;
                return DIGITAL[port];
            },
            syntax: { js: [], py: ['freearduino.get_digital_value_pullup(%1)'] },
        },

        freearduino_set_pwm_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,  
            skeleton: 'basic',
            fontColor: '#fff',
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
                    value: '255',
                    fontSize: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            def: {
                params: [null, null, null],
                type: 'freearduino_set_pwm_value',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'freearduino_basic',
            isNotFor: ['freearduino'],
            func: function(sprite, script) {
                var port = script.getField('PORT');
                var value = script.getNumberValue('VALUE');
                value = Math.round(value);
                value = Math.max(value, 0);
                value = Math.min(value, 255);
                var port2;
                if(port == 3) port2 = 20;
                if(port == 5) port2 = 21;
                if(port == 6) port2 = 22;
                if(port == 9) port2 = 23;
                if(port == 10) port2 = 24;
                if(port == 11) port2 = 25;
                Entry.hw.setDigitalPortValue(port2, value);
                Entry.hw.removePortReadable(port);
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: ['freearduino.set_pwm_value(%1, %2)'],
            },
        },


        freearduino_set_servo_angle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,  
            skeleton: 'basic',
            fontColor: '#fff',
            params: [
                {
                    type: 'Dropdown',
                    options: [
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
                        ['A0', '14'],
                        ['A1', '15'],
                        ['A2', '16'],
                        ['A3', '17'],
                        ['A4', '18'],
                        ['A5', '19'],
                    ],
                    value: '9',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    value: '90',
                    fontSize: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            def: {
                params: [null, null, null],
                type: 'freearduino_set_servo_angle',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'freearduino_servo',
            isNotFor: ['freearduino'],
            func: function(sprite, script) {
                var port = script.getField('PORT');
                var value = script.getNumberValue('VALUE');
                value = Math.round(value);
                value = Math.max(value, 0);
                value = Math.min(value, 180);
                Entry.hw.setDigitalPortValue(port, value+1);
                return script.callReturn();
            },
            syntax: { js: [], py: ['freearduino.set_servo_angle(%1, %2)'] },
        },

        freearduino_set_motor_run: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,  
            skeleton: 'basic',
            fontColor: '#fff',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', '1'],
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.roborobo_motor_stop, '4'],
                        [Lang.Blocks.roborobo_motor_CW, '1'],
                        [Lang.Blocks.roborobo_motor_CCW, '2'],
                    ],
                    value: '4',
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
                params: [null, null, null],
                type: 'freearduino_set_motor_run',
            },
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
            },
            class: 'freearduino_motor',
            isNotFor: ['freearduino'],
            func: function(sprite, script) {
                var value1 = Number(script.getField('VALUE1'));
                var value2 = Number(script.getField('VALUE2'));
                var port;
                if (value1 === 1) port = 11;
                if (value1 === 2) port = 3;
                if (value1 === 3) port = 5;
                if (value1 === 4) port = 6;
                Entry.hw.sendQueue[0] = 1;
                Entry.hw.setDigitalPortValue(26,value1*10+value2);
                Entry.hw.removePortReadable(port);
                return script.callReturn();
            },
            syntax: { js: [], py: ['freearduino.set_motor_run(%1, %2)'] },
        },

        freearduino_set_motor_speed: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,  
            skeleton: 'basic',
            fontColor: '#fff',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', '1'],
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    value: '200',
                    fontSize: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            def: {
                params: [null, null, null],
                type: 'freearduino_set_motor_speed',
            },
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
            },
            class: 'freearduino_motor',
            isNotFor: ['freearduino'],
            func: function(sprite, script) {
                var value1 = Number(script.getField('VALUE1'));
                var value2 = script.getNumberValue('VALUE2');
                value2 = Math.round(value2);
                value2 = Math.max(value2, 0);
                value2 = Math.min(value2, 255);
                var port;
                if (value1 === 1) port = 11;
                if (value1 === 2) port = 3;
                if (value1 === 3) port = 5;
                if (value1 === 4) port = 6;
                Entry.hw.sendQueue[0] = 1;
                Entry.hw.setDigitalPortValue(value1+26,value2);
                Entry.hw.removePortReadable(port);
                return script.callReturn();
            },
            syntax: { js: [], py: ['freearduino.set_motor_speed(%1, %2)'] },
        },
    };
};

module.exports = Entry.freearduino;
