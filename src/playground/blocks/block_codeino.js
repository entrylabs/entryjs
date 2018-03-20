'use strict';

Entry.CODEino = {
    name: 'CODEino',
    url: 'http://www.kcsi.co.kr/ko/bbs/content.php?co_id=CODEino1',
    imageName: 'codeino.png',
    title: {
        "ko": "코드이노",
        "en": "CODEino"
    },
    getSensorKey: function() {
        return 'xxxxxxxx'
            .replace(/[xy]/g, function(f) {
                var e = (Math.random() * 16) | 0,
                    d = f == 'x' ? e : (e & (0 * 3)) | (0 * 8);
                return d.toString(16);
            })
            .toUpperCase();
    },
    getSensorTime: function(type) {
        return new Date().getTime() + type;
    },
    setZero: function() {
        if (!Entry.hw.sendQueue.SET) {
            Entry.hw.sendQueue = {
                GET: {},
                SET: {},
            };
        } else {
            var keySet = Object.keys(Entry.hw.sendQueue.SET);
            keySet.forEach(function(key) {
                Entry.hw.sendQueue.SET[key].data = 0;
                Entry.hw.sendQueue.SET[key].time = new Date().getTime();
            });
        }
        Entry.hw.update();
    },
    monitorTemplate: {
        imgPath: 'hw/codeino.png',
        width: 431,
        height: 354,
        listPorts: {
            '2': {
                name: Lang.Hw.port_en + ' 2 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '3': {
                name: Lang.Hw.port_en + ' 3 ' + Lang.Hw.port_ko,
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
            '8': {
                name: Lang.Hw.port_en + ' 8 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '9': {
                name: Lang.Hw.port_en + ' 9 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '10': {
                name: Lang.Hw.port_en + ' 10 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '11': {
                name: Lang.Hw.port_en + ' 11 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '12': {
                name: Lang.Hw.port_en + ' 12 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '13': {
                name: Lang.Hw.port_en + ' 13 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            a0: {
                name: Lang.Hw.port_en + ' A0 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            a1: {
                name: Lang.Hw.port_en + ' A1 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            a2: {
                name: Lang.Hw.port_en + ' A2 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            a3: {
                name: Lang.Hw.port_en + ' A3 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            a4: {
                name: Lang.Hw.port_en + ' A4 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            a5: {
                name: Lang.Hw.port_en + ' A5 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            a6: {
                name: Lang.Hw.port_en + ' A6 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
        },
        mode: 'both',
    },
    sensorTypes: {
        ALIVE: 0,
        DIGITAL: 1,
        ANALOG: 2,
        PWM: 3,
        RGBLED_PIN: 4,
        TONE: 5,
        PULSEIN: 6,
        ULTRASONIC: 7,
        TIMER: 8,
        ADDCOLOR: 9,
    },
    BlockState: {},

    LED_RED_VALUE: 0,
    LED_GREEN_VALUE: 0,
    LED_BLUE_VALUE: 0,
};

Entry.CODEino.getBlocks = function() {
    return {
        //region codeino 코드이노
        CODEino_get_sensor_number: {
            color: '#00979D',
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
                        ['6', 'A6'],
                    ],
                    value: 'A0',
                    fontSize: 11,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                PORT: 0,
            },
            func: function(sprite, script) {
                return script.getStringField('PORT');
            },
        },
        CODEino_get_named_sensor_value: {
            // Block UI : <아날로그센서> 센서값
            color: '#00979D',
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.CODEino_sensor_name_0, '0'],
                        [Lang.Blocks.CODEino_sensor_name_1, '1'],
                        [Lang.Blocks.CODEino_sensor_name_2, '2'],
                        [Lang.Blocks.CODEino_sensor_name_3, '3'],
                        [Lang.Blocks.CODEino_sensor_name_4, '4'],
                        [Lang.Blocks.CODEino_sensor_name_5, '5'],
                        [Lang.Blocks.CODEino_sensor_name_6, '6'],
                    ],
                    value: '0',
                    fontSize: 11,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'CODEino_get_named_sensor_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'CODEino_sensor',
            isNotFor: ['CODEino'],
            func: function(sprite, script) {
                var port = script.getField('PORT', script);
                var nowTime = Entry.CODEino.getSensorTime(
                    Entry.CODEino.sensorTypes.ANALOG
                );
                var hardwareTime = Entry.hw.portData['TIME'] || 0;
                var scope = script.executor.scope;
                var ANALOG = Entry.hw.portData.ANALOG;
                if (!scope.isStart) {
                    scope.isStart = true;
                    scope.stamp = nowTime;
                    if (!Entry.hw.sendQueue['GET']) {
                        Entry.hw.sendQueue['GET'] = {};
                    }
                    Entry.hw.sendQueue['GET'][
                        Entry.CODEino.sensorTypes.ANALOG
                    ] = {
                        port: port,
                        time: Entry.CODEino.getSensorTime(
                            Entry.CODEino.sensorTypes.ANALOG
                        ),
                    };
                    throw new Entry.Utils.AsyncError();
                    return;
                } else if (hardwareTime && hardwareTime === scope.stamp) {
                    delete scope.isStart;
                    delete scope.stamp;
                    return ANALOG ? ANALOG[port] || 0 : 0;
                } else if (nowTime - scope.stamp > 64) {
                    delete scope.isStart;
                    delete scope.stamp;
                    return ANALOG ? ANALOG[port] || 0 : 0;
                } else {
                    throw new Entry.Utils.AsyncError();
                    return;
                }
            },
        },
        CODEino_get_sound_status: {
            // Block UI : 소리센서 <음량>
            color: '#00979D',
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.CODEino_string_11, 'GREAT'],
                        [Lang.Blocks.CODEino_string_12, 'SMALL'],
                    ],
                    value: 'GREAT',
                    fontSize: 11,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'CODEino_get_sound_status',
            },
            paramsKeyMap: {
                STATUS: 0,
            },
            class: 'CODEino_sensor',
            isNotFor: ['CODEino'],
            func: function(sprite, script) {
                var value1 = script.getField('STATUS', script);
                var value2 = 1;
                var nowTime = Entry.CODEino.getSensorTime(
                    Entry.CODEino.sensorTypes.ANALOG
                );
                var hardwareTime = Entry.hw.portData['TIME'] || 0;
                var scope = script.executor.scope;
                var ANALOG = Entry.hw.portData.ANALOG;
                if (!scope.isStart) {
                    scope.isStart = true;
                    scope.stamp = nowTime;
                    if (!Entry.hw.sendQueue['GET']) {
                        Entry.hw.sendQueue['GET'] = {};
                    }
                    Entry.hw.sendQueue['GET'][
                        Entry.CODEino.sensorTypes.ANALOG
                    ] = {
                        port: 0,
                        time: Entry.CODEino.getSensorTime(
                            Entry.CODEino.sensorTypes.ANALOG
                        ),
                    };
                    throw new Entry.Utils.AsyncError();
                    return;
                } else if (hardwareTime && hardwareTime === scope.stamp) {
                    delete scope.isStart;
                    delete scope.stamp;
                    if (value1 == 'GREAT') return ANALOG[0] > 600 ? 1 : 0;
                    else return ANALOG[0] <= 600 ? 1 : 0;
                } else if (nowTime - scope.stamp > 64) {
                    delete scope.isStart;
                    delete scope.stamp;
                    if (value1 == 'GREAT') return ANALOG[0] > 600 ? 1 : 0;
                    else return ANALOG[0] <= 600 ? 1 : 0;
                } else {
                    throw new Entry.Utils.AsyncError();
                    return;
                }
            },
        },
        CODEino_get_light_status: {
            // Block UI : 빛센서 <밝기>
            color: '#00979D',
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.CODEino_string_14, 'BRIGHT'],
                        [Lang.Blocks.CODEino_string_15, 'DARK'],
                    ],
                    value: 'BRIGHT',
                    fontSize: 11,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'CODEino_get_light_status',
            },
            paramsKeyMap: {
                STATUS: 0,
            },
            class: 'CODEino_sensor',
            isNotFor: ['CODEino'],
            func: function(sprite, script) {
                var value1 = script.getField('STATUS', script);
                var value2 = 1;
                var nowTime = Entry.CODEino.getSensorTime(
                    Entry.CODEino.sensorTypes.ANALOG
                );
                var hardwareTime = Entry.hw.portData['TIME'] || 0;
                var scope = script.executor.scope;
                var ANALOG = Entry.hw.portData.ANALOG;
                if (!scope.isStart) {
                    scope.isStart = true;
                    scope.stamp = nowTime;
                    if (!Entry.hw.sendQueue['GET']) {
                        Entry.hw.sendQueue['GET'] = {};
                    }
                    Entry.hw.sendQueue['GET'][
                        Entry.CODEino.sensorTypes.ANALOG
                    ] = {
                        port: 1,
                        time: Entry.CODEino.getSensorTime(
                            Entry.CODEino.sensorTypes.ANALOG
                        ),
                    };
                    throw new Entry.Utils.AsyncError();
                    return;
                } else if (hardwareTime && hardwareTime === scope.stamp) {
                    delete scope.isStart;
                    delete scope.stamp;
                    if (value1 == 'GREAT') return ANALOG[value2] < 800 ? 1 : 0;
                    else return ANALOG[value2] <= 800 ? 1 : 0;
                } else if (nowTime - scope.stamp > 64) {
                    delete scope.isStart;
                    delete scope.stamp;
                    if (value1 == 'GREAT') return ANALOG[value2] < 800 ? 1 : 0;
                    else return ANALOG[value2] <= 800 ? 1 : 0;
                } else {
                    throw new Entry.Utils.AsyncError();
                    return;
                }
            },
        },
        CODEino_is_button_pressed: {
            // Block UI : 보드의 <버튼누름/저항연결>
            color: '#00979D',
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.CODEino_string_3, '4'],
                        [Lang.Blocks.CODEino_string_4, '17'],
                        [Lang.Blocks.CODEino_string_5, '18'],
                        [Lang.Blocks.CODEino_string_6, '19'],
                        [Lang.Blocks.CODEino_string_7, '20'],
                    ],
                    value: '4',
                    fontSize: 11,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'CODEino_is_button_pressed',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'CODEino_sensor',
            isNotFor: ['CODEino'],
            func: function(sprite, script) {
                var port = script.getNumberField('PORT', script);
                if (port < 10) {
                    var nowTime = Entry.CODEino.getSensorTime(
                        Entry.CODEino.sensorTypes.DIGITAL
                    );
                    var hardwareTime = Entry.hw.portData['TIME'] || 0;
                    var scope = script.executor.scope;
                    var DIGITAL = Entry.hw.portData.DIGITAL;
                    if (!scope.isStart) {
                        scope.isStart = true;
                        scope.stamp = nowTime;
                        if (!Entry.hw.sendQueue['GET']) {
                            Entry.hw.sendQueue['GET'] = {};
                        }
                        Entry.hw.sendQueue['GET'][
                            Entry.CODEino.sensorTypes.DIGITAL
                        ] = {
                            port: 4,
                            time: Entry.CODEino.getSensorTime(
                                Entry.CODEino.sensorTypes.DIGITAL
                            ),
                        };
                        throw new Entry.Utils.AsyncError();
                        return;
                    } else if (hardwareTime && hardwareTime === scope.stamp) {
                        delete scope.isStart;
                        delete scope.stamp;
                        return DIGITAL ? !(DIGITAL[port] || 0) : 0;
                    } else if (nowTime - scope.stamp > 64) {
                        delete scope.isStart;
                        delete scope.stamp;
                        return DIGITAL ? !(DIGITAL[port] || 0) : 0;
                    } else {
                        throw new Entry.Utils.AsyncError();
                        return;
                    }
                } else {
                    var nowTime = Entry.CODEino.getSensorTime(
                        Entry.CODEino.sensorTypes.ANALOG
                    );
                    var hardwareTime = Entry.hw.portData['TIME'] || 0;
                    var scope = script.executor.scope;
                    var ANALOG = Entry.hw.portData.ANALOG;
                    if (!scope.isStart) {
                        scope.isStart = true;
                        scope.stamp = nowTime;
                        if (!Entry.hw.sendQueue['GET']) {
                            Entry.hw.sendQueue['GET'] = {};
                        }
                        Entry.hw.sendQueue['GET'][
                            Entry.CODEino.sensorTypes.ANALOG
                        ] = {
                            port: port - 14,
                            time: Entry.CODEino.getSensorTime(
                                Entry.CODEino.sensorTypes.ANALOG
                            ),
                        };
                        throw new Entry.Utils.AsyncError();
                        return;
                    } else if (hardwareTime && hardwareTime === scope.stamp) {
                        delete scope.isStart;
                        delete scope.stamp;
                        return ANALOG[port - 14] < 1000 ? 1 : 0;
                    } else if (nowTime - scope.stamp > 64) {
                        delete scope.isStart;
                        delete scope.stamp;
                        return ANALOG[port - 14] < 1000 ? 1 : 0;
                    } else {
                        throw new Entry.Utils.AsyncError();
                        return;
                    }
                }
            },
        },
        CODEino_get_accelerometer_direction: {
            // Block UI : 3축 가속도센서 <기울기>
            color: '#00979D',
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.CODEino_string_16, 'LEFT'],
                        [Lang.Blocks.CODEino_string_17, 'RIGHT'],
                        [Lang.Blocks.CODEino_string_18, 'FRONT'],
                        [Lang.Blocks.CODEino_string_19, 'REAR'],
                        [Lang.Blocks.CODEino_string_20, 'REVERSE'],
                    ],
                    value: 'LEFT',
                    fontSize: 11,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'CODEino_get_accelerometer_direction',
            },
            paramsKeyMap: {
                DIRECTION: 0,
            },
            class: 'CODEino_sensor',
            isNotFor: ['CODEino'],
            func: function(sprite, script) {
                var value1 = script.getField('DIRECTION', script);
                var port = 0;
                var nowTime = Entry.CODEino.getSensorTime(
                    Entry.CODEino.sensorTypes.ANALOG
                );
                var hardwareTime = Entry.hw.portData['TIME'] || 0;
                var scope = script.executor.scope;
                var ANALOG = Entry.hw.portData.ANALOG;
                var value4 = 265;
                var value5 = 402;
                var value6 = -90;
                var value7 = 90;
                var result;
                if (value1 == 'LEFT' || value1 == 'RIGHT') port = 3;
                else if (value1 == 'FRONT' || value1 == 'REAR') port = 4;
                else if (value1 == 'REVERSE') port = 5;

                if (!scope.isStart) {
                    scope.isStart = true;
                    scope.stamp = nowTime;
                    if (!Entry.hw.sendQueue['GET']) {
                        Entry.hw.sendQueue['GET'] = {};
                    }
                    Entry.hw.sendQueue['GET'][
                        Entry.CODEino.sensorTypes.ANALOG
                    ] = {
                        port: port,
                        time: Entry.CODEino.getSensorTime(
                            Entry.CODEino.sensorTypes.ANALOG
                        ),
                    };
                    throw new Entry.Utils.AsyncError();
                    return;
                } else if (hardwareTime && hardwareTime === scope.stamp) {
                    delete scope.isStart;
                    delete scope.stamp;
                    result = ANALOG[port];
                    result -= value4;
                    result = result * ((value7 - value6) / (value5 - value4));
                    result += value6;
                    result = Math.min(value7, result);
                    result = Math.max(value6, result);
                    result = Math.round(result);
                    if (value1 == 'LEFT' || value1 == 'REAR')
                        return result < -30 ? 1 : 0;
                    else if (value1 == 'RIGHT' || value1 == 'FRONT')
                        return result > 30 ? 1 : 0;
                    else if (value1 == 'REVERSE') return result < -50 ? 1 : 0;
                } else if (nowTime - scope.stamp > 64) {
                    delete scope.isStart;
                    delete scope.stamp;
                    result = ANALOG[port];
                    result -= value4;
                    result = result * ((value7 - value6) / (value5 - value4));
                    result += value6;
                    result = Math.min(value7, result);
                    result = Math.max(value6, result);
                    result = Math.round(result);
                    if (value1 == 'LEFT' || value1 == 'REAR')
                        return result < -30 ? 1 : 0;
                    else if (value1 == 'RIGHT' || value1 == 'FRONT')
                        return result > 30 ? 1 : 0;
                    else if (value1 == 'REVERSE') return result < -50 ? 1 : 0;
                } else {
                    throw new Entry.Utils.AsyncError();
                    return;
                }
            },
        },
        CODEino_get_accelerometer_value: {
            // Block UI : 3축 가속도센서 <방향> 축의 센서값
            color: '#00979D',
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['X', '3'], ['Y', '4'], ['Z', '5']],
                    value: '3',
                    fontSize: 11,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'CODEino_get_accelerometer_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'CODEino_sensor',
            isNotFor: ['CODEino'],
            func: function(sprite, script) {
                var port = script.getNumberField('PORT', script);
                var nowTime = Entry.CODEino.getSensorTime(
                    Entry.CODEino.sensorTypes.ANALOG
                );
                var hardwareTime = Entry.hw.portData['TIME'] || 0;
                var scope = script.executor.scope;
                var ANALOG = Entry.hw.portData.ANALOG;
                var result = 0;
                if (!scope.isStart) {
                    scope.isStart = true;
                    scope.stamp = nowTime;
                    if (!Entry.hw.sendQueue['GET']) {
                        Entry.hw.sendQueue['GET'] = {};
                    }
                    Entry.hw.sendQueue['GET'][
                        Entry.CODEino.sensorTypes.ANALOG
                    ] = {
                        port: port,
                        time: Entry.CODEino.getSensorTime(
                            Entry.CODEino.sensorTypes.ANALOG
                        ),
                    };
                    throw new Entry.Utils.AsyncError();
                    return;
                } else if (hardwareTime && hardwareTime === scope.stamp) {
                    delete scope.isStart;
                    delete scope.stamp;
                    result = ANALOG[port];
                    result = (result - 333) * 1.46;
                    result = Math.min(90, result);
                    result = Math.max(-90, result);
                    return Math.round(result);
                } else if (nowTime - scope.stamp > 64) {
                    delete scope.isStart;
                    delete scope.stamp;
                    result = ANALOG[port];
                    result = (result - 333) * 1.46;
                    result = Math.min(90, result);
                    result = Math.max(-90, result);
                    return Math.round(result);
                } else {
                    throw new Entry.Utils.AsyncError();
                    return;
                }
            },
        },
        CODEino_get_analog_value: {
            // Block UI : 아날로그 <핀번호> 센서의 값
            color: '#00979D',
            fontColor: '#fff',
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
                    ],
                    value: '0',
                    fontSize: 11,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'CODEino_get_analog_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'CODEino_Adumode',
            isNotFor: ['CODEino'],
            func: function(sprite, script) {
                var port = script.getField('PORT', script);
                var nowTime = Entry.CODEino.getSensorTime(
                    Entry.CODEino.sensorTypes.ANALOG
                );
                var hardwareTime = Entry.hw.portData['TIME'] || 0;
                var scope = script.executor.scope;
                var ANALOG = Entry.hw.portData.ANALOG;
                if (!scope.isStart) {
                    scope.isStart = true;
                    scope.stamp = nowTime;
                    if (!Entry.hw.sendQueue['GET']) {
                        Entry.hw.sendQueue['GET'] = {};
                    }
                    Entry.hw.sendQueue['GET'][
                        Entry.CODEino.sensorTypes.ANALOG
                    ] = {
                        port: port,
                        time: Entry.CODEino.getSensorTime(
                            Entry.CODEino.sensorTypes.ANALOG
                        ),
                    };
                    throw new Entry.Utils.AsyncError();
                    return;
                } else if (hardwareTime && hardwareTime === scope.stamp) {
                    delete scope.isStart;
                    delete scope.stamp;
                    return ANALOG ? ANALOG[port] || 0 : 0;
                } else if (nowTime - scope.stamp > 64) {
                    delete scope.isStart;
                    delete scope.stamp;
                    return ANALOG ? ANALOG[port] || 0 : 0;
                } else {
                    throw new Entry.Utils.AsyncError();
                    return;
                }
            },
        },
        CODEino_get_digital_value: {
            // Block UI : 디지털 <핀번호> 핀의 값
            color: '#00979D',
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'arduino_get_port_number',
                    },
                ],
                type: 'CODEino_get_digital_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'CODEino_Adumode',
            isNotFor: ['CODEino'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT', script);
                var nowTime = Entry.CODEino.getSensorTime(
                    Entry.CODEino.sensorTypes.DIGITAL
                );
                var hardwareTime = Entry.hw.portData['TIME'] || 0;
                var scope = script.executor.scope;
                var DIGITAL = Entry.hw.portData.DIGITAL;
                if (!scope.isStart) {
                    scope.isStart = true;
                    scope.stamp = nowTime;
                    if (!Entry.hw.sendQueue['GET']) {
                        Entry.hw.sendQueue['GET'] = {};
                    }
                    Entry.hw.sendQueue['GET'][
                        Entry.CODEino.sensorTypes.DIGITAL
                    ] = {
                        port: port,
                        time: Entry.CODEino.getSensorTime(
                            Entry.CODEino.sensorTypes.DIGITAL
                        ),
                    };
                    throw new Entry.Utils.AsyncError();
                    return;
                } else if (hardwareTime && hardwareTime === scope.stamp) {
                    delete scope.isStart;
                    delete scope.stamp;
                    return DIGITAL ? DIGITAL[port] || 0 : 0;
                } else if (nowTime - scope.stamp > 64) {
                    delete scope.isStart;
                    delete scope.stamp;
                    return DIGITAL ? DIGITAL[port] || 0 : 0;
                } else {
                    throw new Entry.Utils.AsyncError();
                    return;
                }
            },
        },
        CODEino_set_digital_value: {
            // Block UI : 디지털 <핀번호> 핀의 <켜기/끄기>
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.ARDUINO_on, '255'],
                        [Lang.Blocks.ARDUINO_off, '0'],
                    ],
                    fontSize: 11,
                    arrowColor: EntryStatic.ARROW_COLOR_HW,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'arduino_get_port_number',
                    },
                    '255',
                    null,
                ],
                type: 'CODEino_set_digital_value',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'CODEino_Setmode',
            isNotFor: ['CODEino'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var value = script.getNumberField('VALUE');

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.CODEino.sensorTypes.DIGITAL,
                    data: value,
                    time: Entry.CODEino.getSensorTime(
                        Entry.CODEino.sensorTypes.DIGITAL
                    ),
                };
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.digitalWrite(%1, %2)',
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
        CODEino_set_pwm_value: {
            // Block UI : 디지털 <핀번호> 번 핀을 <숫자> (으)로 정하기
            color: '#00979D',
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'arduino_get_pwm_port_number',
                    },
                    {
                        type: 'arduino_text',
                        params: ['255'],
                    },
                    null,
                ],
                type: 'CODEino_set_pwm_value',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'CODEino_Setmode',
            isNotFor: ['CODEino'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var value = script.getNumberValue('VALUE');
                value = Math.round(value);
                value = Math.max(value, 0);
                value = Math.min(value, 255);
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.CODEino.sensorTypes.PWM,
                    data: value,
                    time: Entry.CODEino.getSensorTime(
                        Entry.CODEino.sensorTypes.PWM
                    ),
                };
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.analogWrite(%1, %2)',
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
        CODEino_convert_scale: {
            // Block UI : 아날로그 <핀번호> 센서의 값 값의 범위를 0~1023에서 0~100 (으)로 바꾼 값
            color: '#00979D',
            fontColor: '#fff',
            skeleton: 'basic_string_field',
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
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'CODEino_get_analog_value',
                        value: '0',
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
                type: 'CODEino_convert_scale',
            },
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
                VALUE3: 2,
                VALUE4: 3,
                VALUE5: 4,
            },
            class: 'CODEino_extmode',
            isNotFor: ['CODEino'],
            func: function(sprite, script) {
                var value1 = script.getNumberValue('VALUE1', script);
                var value2 = script.getNumberValue('VALUE2', script);
                var value3 = script.getNumberValue('VALUE3', script);
                var value4 = script.getNumberValue('VALUE4', script);
                var value5 = script.getNumberValue('VALUE5', script);
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
                return Math.round(result);
            },
        },
        CODEino_set_rgb_value: {
            // Block UI : 컬러 LED의 <색> 색상을 <숫자> (으)로 정하기
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.CODEino_led_red, '17'],
                        [Lang.Blocks.CODEino_led_green, '18'],
                        [Lang.Blocks.CODEino_led_blue, '19'],
                    ],
                    value: '17',
                    fontSize: 11,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null, null],
                type: 'CODEino_set_rgb_value',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'CODEino_RGBLED_mode',
            isNotFor: ['CODEino'],
            func: function(sprite, script) {
                var port = script.getNumberField('PORT', script);
                var value = script.getNumberValue('VALUE', script);
                value = Math.min(255, value);
                value = Math.max(0, value);

                if (port == 17) {
                    Entry.CODEino.LED_RED_VALUE = value;
                } else if (port == 18) {
                    Entry.CODEino.LED_GREEN_VALUE = value;
                } else if (port == 19) {
                    Entry.CODEino.LED_BLUE_VALUE = value;
                } else {
                    port = 0;
                }

                if (port > 0) {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.CODEino.sensorTypes.RGBLED_PIN,
                        data: value,
                        time: Entry.CODEino.getSensorTime(
                            Entry.CODEino.sensorTypes.RGBLED_PIN
                        ),
                    };
                    return script.callReturn();
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.analogWrite(%1, %2)',
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
        CODEino_set_rgb_add_value: {
            // Block UI : 컬러 LED의 <색> 색상에 <숫자> 만큼 더하기
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.CODEino_led_red, '17'],
                        [Lang.Blocks.CODEino_led_green, '18'],
                        [Lang.Blocks.CODEino_led_blue, '19'],
                    ],
                    value: '17',
                    fontSize: 11,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                type: 'CODEino_set_rgb_add_value',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'CODEino_RGBLED_mode',
            isNotFor: ['CODEino'],
            func: function(sprite, script) {
                var port = script.getNumberField('PORT', script);
                var value = script.getNumberValue('VALUE', script);
                value = Math.min(255, value);
                value = Math.max(0, value);

                if (port == 17) {
                    Entry.CODEino.LED_RED_VALUE =
                        Entry.CODEino.LED_RED_VALUE + value;
                    Entry.CODEino.LED_RED_VALUE = Math.min(
                        255,
                        Entry.CODEino.LED_RED_VALUE
                    );
                    Entry.CODEino.LED_RED_VALUE = Math.max(
                        0,
                        Entry.CODEino.LED_RED_VALUE
                    );
                    value = Entry.CODEino.LED_RED_VALUE;
                }
                if (port == 18) {
                    Entry.CODEino.LED_GREEN_VALUE =
                        Entry.CODEino.LED_GREEN_VALUE + value;
                    Entry.CODEino.LED_GREEN_VALUE = Math.min(
                        255,
                        Entry.CODEino.LED_GREEN_VALUE
                    );
                    Entry.CODEino.LED_GREEN_VALUE = Math.max(
                        0,
                        Entry.CODEino.LED_GREEN_VALUE
                    );
                    value = Entry.CODEino.LED_GREEN_VALUE;
                }
                if (port == 19) {
                    Entry.CODEino.LED_BLUE_VALUE =
                        Entry.CODEino.LED_BLUE_VALUE + value;
                    Entry.CODEino.LED_BLUE_VALUE = Math.min(
                        255,
                        Entry.CODEino.LED_BLUE_VALUE
                    );
                    Entry.CODEino.LED_BLUE_VALUE = Math.max(
                        0,
                        Entry.CODEino.LED_BLUE_VALUE
                    );
                    value = Entry.CODEino.LED_BLUE_VALUE;
                }

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.CODEino.sensorTypes.RGBLED_PIN,
                    data: value,
                    time: Entry.CODEino.getSensorTime(
                        Entry.CODEino.sensorTypes.RGBLED_PIN
                    ),
                };
                return script.callReturn();
            },
        },
        CODEino_rgb_set_color: {
            // Block UI : 컬러 LED의 색상을 <색상표> (으)로 정하기
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Color',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/brush_03.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'CODEino_rgb_set_color',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'CODEino_RGBLED_mode',
            isNotFor: ['CODEino'],
            func: function(sprite, script) {
                var value = script.getStringField('VALUE');
                var sq = Entry.hw.sendQueue;

                Entry.CODEino.LED_RED_VALUE = parseInt(value.substr(1, 2), 16);
                Entry.CODEino.LED_GREEN_VALUE = parseInt(
                    value.substr(3, 2),
                    16
                );
                Entry.CODEino.LED_BLUE_VALUE = parseInt(value.substr(5, 2), 16);

                var port = 17;
                if (!sq['SET']) {
                    sq['SET'] = {};
                }
                sq['SET'][port] = {
                    type: Entry.CODEino.sensorTypes.RGBLED_PIN,
                    data: Entry.CODEino.LED_RED_VALUE,
                    time: Entry.CODEino.getSensorTime(
                        Entry.CODEino.sensorTypes.RGBLED_PIN
                    ),
                };

                port = 18;
                if (!sq['SET']) {
                    sq['SET'] = {};
                }
                sq['SET'][port] = {
                    type: Entry.CODEino.sensorTypes.RGBLED_PIN,
                    data: Entry.CODEino.LED_GREEN_VALUE,
                    time: Entry.CODEino.getSensorTime(
                        Entry.CODEino.sensorTypes.RGBLED_PIN
                    ),
                };

                port = 19;
                if (!sq['SET']) {
                    sq['SET'] = {};
                }
                sq['SET'][port] = {
                    type: Entry.CODEino.sensorTypes.RGBLED_PIN,
                    data: Entry.CODEino.LED_BLUE_VALUE,
                    time: Entry.CODEino.getSensorTime(
                        Entry.CODEino.sensorTypes.RGBLED_PIN
                    ),
                };
                return script.callReturn();
            },
        },
        CODEino_set_rgb_off: {
            // Block UI : 컬러 LED 끄기
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'CODEino_set_rgb_off',
            },
            class: 'CODEino_RGBLED_mode',
            isNotFor: ['CODEino'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;

                var port = 17;
                Entry.CODEino.LED_RED_VALUE = 0;
                if (!sq['SET']) {
                    sq['SET'] = {};
                }
                sq['SET'][port] = {
                    type: Entry.CODEino.sensorTypes.RGBLED_PIN,
                    data: Entry.CODEino.LED_RED_VALUE,
                    time: Entry.CODEino.getSensorTime(
                        Entry.CODEino.sensorTypes.RGBLED_PIN
                    ),
                };

                port = 18;
                Entry.CODEino.LED_GREEN_VALUE = 0;
                if (!sq['SET']) {
                    sq['SET'] = {};
                }
                sq['SET'][port] = {
                    type: Entry.CODEino.sensorTypes.RGBLED_PIN,
                    data: Entry.CODEino.LED_GREEN_VALUE,
                    time: Entry.CODEino.getSensorTime(
                        Entry.CODEino.sensorTypes.RGBLED_PIN
                    ),
                };

                port = 19;
                Entry.CODEino.LED_BLUE_VALUE = 0;
                if (!sq['SET']) {
                    sq['SET'] = {};
                }
                sq['SET'][port] = {
                    type: Entry.CODEino.sensorTypes.RGBLED_PIN,
                    data: Entry.CODEino.LED_BLUE_VALUE,
                    time: Entry.CODEino.getSensorTime(
                        Entry.CODEino.sensorTypes.RGBLED_PIN
                    ),
                };
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.analogWrite(%1, %2)',
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
        CODEino_set__led_by_rgb: {
            color: '#00979D',
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['255'],
                    },
                    {
                        type: 'text',
                        params: ['255'],
                    },
                    {
                        type: 'text',
                        params: ['255'],
                    },
                    null,
                ],
                type: 'CODEino_set__led_by_rgb',
            },
            paramsKeyMap: {
                rValue: 0,
                gValue: 1,
                bValue: 2,
            },
            class: 'CODEino_RGBLED_mode',
            isNotFor: ['CODEino'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;

                Entry.CODEino.LED_RED_VALUE = script.getNumberValue('rValue');
                Entry.CODEino.LED_GREEN_VALUE = script.getNumberValue('gValue');
                Entry.CODEino.LED_BLUE_VALUE = script.getNumberValue('bValue');

                var port = 17;
                if (!sq['SET']) {
                    sq['SET'] = {};
                }
                sq['SET'][port] = {
                    type: Entry.CODEino.sensorTypes.RGBLED_PIN,
                    data: Entry.CODEino.LED_RED_VALUE,
                    time: Entry.CODEino.getSensorTime(
                        Entry.CODEino.sensorTypes.RGBLED_PIN
                    ),
                };

                port = 18;
                if (!sq['SET']) {
                    sq['SET'] = {};
                }
                sq['SET'][port] = {
                    type: Entry.CODEino.sensorTypes.RGBLED_PIN,
                    data: Entry.CODEino.LED_GREEN_VALUE,
                    time: Entry.CODEino.getSensorTime(
                        Entry.CODEino.sensorTypes.RGBLED_PIN
                    ),
                };

                port = 19;
                if (!sq['SET']) {
                    sq['SET'] = {};
                }
                sq['SET'][port] = {
                    type: Entry.CODEino.sensorTypes.RGBLED_PIN,
                    data: Entry.CODEino.LED_BLUE_VALUE,
                    time: Entry.CODEino.getSensorTime(
                        Entry.CODEino.sensorTypes.RGBLED_PIN
                    ),
                };
                return script.callReturn();
            },
        },
        CODEino_led_by_value: {
            // Block UI : 컬러 LED 켜기
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'CODEino_led_by_value',
            },
            class: 'CODEino_RGBLED_mode',
            isNotFor: ['CODEino'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;

                var port = 17;
                Entry.CODEino.LED_RED_VALUE = 100;
                if (!sq['SET']) {
                    sq['SET'] = {};
                }
                sq['SET'][port] = {
                    type: Entry.CODEino.sensorTypes.RGBLED_PIN,
                    data: Entry.CODEino.LED_RED_VALUE,
                    time: Entry.CODEino.getSensorTime(
                        Entry.CODEino.sensorTypes.RGBLED_PIN
                    ),
                };

                port = 18;
                Entry.CODEino.LED_GREEN_VALUE = 100;
                if (!sq['SET']) {
                    sq['SET'] = {};
                }
                sq['SET'][port] = {
                    type: Entry.CODEino.sensorTypes.RGBLED_PIN,
                    data: Entry.CODEino.LED_GREEN_VALUE,
                    time: Entry.CODEino.getSensorTime(
                        Entry.CODEino.sensorTypes.RGBLED_PIN
                    ),
                };

                port = 19;
                Entry.CODEino.LED_BLUE_VALUE = 100;
                if (!sq['SET']) {
                    sq['SET'] = {};
                }
                sq['SET'][port] = {
                    type: Entry.CODEino.sensorTypes.RGBLED_PIN,
                    data: Entry.CODEino.LED_BLUE_VALUE,
                    time: Entry.CODEino.getSensorTime(
                        Entry.CODEino.sensorTypes.RGBLED_PIN
                    ),
                };
                return script.callReturn();
            },
        },
        CODEino_get_number_sensor_value: {
            parent: 'arduino_get_number_sensor_value',
            isNotFor: ['CODEino'],
            def: {
                params: [
                    {
                        type: 'arduino_get_sensor_number',
                    },
                ],
                type: 'CODEino_get_number_sensor_value',
            },
            class: 'arduino_value',
            syntax: { js: [], py: ['CODEino.get_number_sensor_value(%1)'] },
        },
        CODEino_toggle_led: {
            parent: 'arduino_toggle_led',
            isNotFor: ['CODEino'],
            def: {
                params: [
                    {
                        type: 'arduino_get_port_number',
                    },
                    null,
                    null,
                ],
                type: 'CODEino_toggle_led',
            },
            class: 'arduino_set',
            syntax: { js: [], py: ['CODEino.toggle_led(%1)'] },
        },
        CODEino_toggle_pwm: {
            parent: 'arduino_toggle_pwm',
            isNotFor: ['CODEino'],
            def: {
                params: [
                    {
                        type: 'arduino_get_pwm_port_number',
                    },
                    {
                        type: 'arduino_text',
                        params: ['255'],
                    },
                    null,
                ],
                type: 'CODEino_toggle_pwm',
            },
            class: 'arduino_set',
            syntax: { js: [], py: ['CODEino.toggle_pwm(%1, %2)'] },
        },
        //endregion codeino 코드이노
    };
};
