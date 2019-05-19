'use strict';

const _set = require('lodash/set');
const _get = require('lodash/get');
const _merge = require('lodash/merge');

Entry.Davinci = new class Davinci {
    constructor() {
	this.id = '2D.1';
        this.url = 'http://www.dasanbooks.com';
        this.imageName = 'davinciai.png';
        this.title = {
            "en": "Davinci",
            "ko": "다빈치"
        };
        this.name = 'davinci';
        this.blockIds = {};
        this.isExecBlock = false;
        this.cacheValues = [];
        this.cacheIndex = 0;
        this.radioTime = 0;
    }

    getHashKey() {
        let key = new Date().getSeconds().toString(16);
        if (key.length === 1) {
            key += ((Math.random() * 16) | 0).toString(16);
        }
        return Entry.generateHash() + key;
    }

    setZero() {
        Entry.hw.sendQueue = {
            [this.getHashKey()]: {
                type: 'RST',
            },
        };
        Entry.hw.update();
        this.blockIds = {};
        this.isExecBlock = false;
        this.execTimeFlag = false;
        this.radioTime = 0;
    }

    sendMessage({ socket, sendQueue = {} }) {
        if (!_.isEmpty(sendQueue)) {
            const keys = Object.keys(sendQueue);
            const uniqueKey = this.getHashKey();
            socket.emit(
                'message',
                {
                    data: JSON.stringify(sendQueue),
                    mode: socket.mode,
                    type: 'utf8',
                    key: uniqueKey,
                },
                (data) => {
                    if (data === uniqueKey) {
                        keys.forEach((key) => {
                            delete sendQueue[key];
                        });
                    }
                }
            );
        }
    }

    asyncFlowControl({ script, data }, scope) {
        if (!this.isExecBlock && !scope.isStart) {
            const blockId = this.getHashKey();
            this.isExecBlock = true;
            scope.isStart = true;
            scope.timeFlag = 1;
            this.nowBlockId = blockId;
            this.blockIds[blockId] = false;
            _merge(Entry.hw.sendQueue, {
                [blockId]: data,
            });
            Entry.hw.update();
            setTimeout(() => {
                scope.timeFlag = 0;
            });
            return false;
        }else if (this.blockIds[this.nowBlockId] && scope.timeFlag === 0) {
            delete this.blockIds[this.nowBlockId];
            delete scope.isStart;
            this.execTimeFlag = 0;
            this.execTimeFlag = undefined;
            this.isExecBlock = false;
            Entry.engine.isContinue = false;
            return true;
        }
        return false;
    }

    postCallReturn(args) {
        const { script } = args;
        if (!this.asyncFlowControl(args, script)) {
            return Entry.STATIC.BREAK;
        }
    }

    checkValue(args) {
        const { script, key } = args;
        const { entity, executor } = script;
        const { scope } = executor;
        const { cacheValue = {} } = scope;
        const value = _get(cacheValue, key);
        if (value) {
            return value;
        } else if (!this.asyncFlowControl(args, scope)) {
            throw new Entry.Utils.AsyncError();
        }
    }

    afterSend(data) {
        // Object.assign(data, {
        //     OUTPUT: {},
        // });
    }

    afterReceive({ blockId = '', RADIO }) {
        if (blockId in this.blockIds) {
            this.blockIds[blockId] = true;
        } else if (
            RADIO &&
            Entry.engine.isState('run') &&
            RADIO.time > this.radioTime
        ) {
            this.radioTime = RADIO.time;
            Entry.engine.fireEvent('DavinciRadioReceive');
        }
    }
}();

Entry.Davinci.blockMenuBlocks = [
                 'davinci_led_toggle',
                 'davinci_get_led',
                 'davinci_show_string',
                 'davinci_show_image',
                 'davinci_get_analog',
                 'davinci_get_analog_map',
                 'davinci_get_digital',
                 'davinci_get_button',
                 'davinci_get_sensor',
                 'davinci_get_accelerometer',
                 'davinci_get_gyro',
                 'davinci_get_magnet',
                 'davinci_play_note',
                 'davinci_play_melody',
                 'davinci_change_bpm',
                 'davinci_set_bpm',
];

Entry.Davinci.getBlocks = function() {
    return {
        davinci_led_toggle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
			outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            template: 'LED의 X:%1 Y:%2 %3 %4',
            params: [
                {
                    type: 'Dropdown',
                    options: [['1', '0'], ['2', '1'], ['3', '2'], ['4', '3'], ['5', '4']],
                    value: '0',
                    fontSize: 11,
                },
                {
                    type: 'Dropdown',
                    options: [['A', '0'], ['B', '1'], ['C', '2'], ['D', '3'], ['E', '4'], ['F', '5']],
                    value: '0',
                    fontSize: 11,
                },
                {
                    type: 'Dropdown',
                    options: [['켜기', '0'], ['끄기', '1'], ['반전', '2']],
                    value: '0',
                    fontSize: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            class: 'DavinciLed',
            isNotFor: ['davinci'],
            def: {
                params: [],
                type: 'davinci_led_toggle',
            },
            paramsKeyMap: {
                X: 0,
                Y: 0,
                VALUE: 0,
            },
            func: function(sprite, script) {
                const value = script.getField('VALUE');
                let x = script.getField('X');
                let y = script.getField('Y');
                x = Math.max(0, x);
                x = Math.min(4, x);
                y = Math.max(0, y);
                y = Math.min(5, y);
                const data = {
                    type: 'SET_LED',
                    data: {
                        x,
                        y,
                        value,
                    },
                };
                return Entry.Davinci.postCallReturn({
                    script,
                    data,
                });
            },
        },
        davinci_get_led: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic_boolean_field',
            statements: [],
            template: 'LED의 X:%1 Y:%2 상태값',
            params: [
                {
                    type: 'Dropdown',
                    options: [['1', '0'], ['2', '1'], ['3', '2'], ['4', '3'], ['5', '4']],
                    value: '0',
                    fontSize: 11,
                },
                {
                    type: 'Dropdown',
                    options: [['A', '0'], ['B', '1'], ['C', '2'], ['D', '3'], ['E', '4'], ['F', '5']],
                    value: '0',
                    fontSize: 11,
                },
            ],
            events: {},
            class: 'DavinciLed',
            isNotFor: ['davinci'],
            def: {
                params: [],
                type: 'davinci_get_led',
            },
            paramsKeyMap: {
                X: 0,
                Y: 0,
            },
            func: function(sprite, script) {
                let x = script.getNumberValue('X');
                let y = script.getNumberValue('Y');
                x = Math.max(1, x);
                x = Math.min(5, x);
                y = Math.max(1, y);
                y = Math.min(6, y);
                const data = {
                    type: 'GET_LED',
                    data: {
                        x,
                        y,
                    },
                };
                let returnData = Entry.Davinci.checkValue({
                    script,
                    data,
                    key: `LED.${x}.${y}`,
                });
                if (!returnData) {
                    returnData = _get(Entry.hw.portData, ['LED']);
                    const { executor } = script;
                    const { scope } = executor;
                    if (!scope.cacheValue) {
                        scope.cacheValue = {};
                    }
                    _set(scope.cacheValue, `LED.${x}.${y}`, returnData);
                }
                return returnData;
            },
        },
        davinci_show_string: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            template: '%1 출력하기 %2',
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
            events: {},
            class: 'DavinciLed',
            isNotFor: ['davinci'],
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['Hello!'],
                    },
                ],
                type: 'davinci_show_string',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            func: function(sprite, script) {
                let value = script.getStringValue('VALUE');
                value = value.replace(
                    /[^A-Za-z0-9_\`\~\!\@\#\$\%\^\&\*\(\)\-\=\+\\\{\}\[\]\'\"\;\:\<\,\>\.\?\/\s]/gim,
                    ''
                );
                const data = {
                    type: 'SET_STRING',
                    data: {
                        value,
                    },
                };
                return Entry.Davinci.postCallReturn({
                    script,
                    data,
                });
            },
        },
        davinci_show_image: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            template: '%1 이모티콘 출력하기 %2',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['하트', 0],
                        ['작은하트', 1],
                        ['정답', 2],
                        ['오답', 3],
                        ['4', 4],
                        ['웃는얼굴', 5],
                        ['화난얼굴', 6],
                        ['슬픈얼굴', 7],
                        ['소얼굴', 8],
                        ['무표정한얼굴', 9],
                        ['10', 10],
                        ['11', 11],
                        ['사슴', 12],
                        ['물음표', 13],
                        ['느낌표', 14],
                        ['기린', 15],
                        ['개', 16],
                        ['17', 17],
                        ['18', 18], 
                        ['19', 19],
                        ['위', 20],
                        ['왼쪽', 21],
                        ['아래', 22],
                        ['오른쪽', 23],
                        ['24', 24],
                    ],
                    value: 0,
                    fontSize: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            class: 'DavinciLed',
            isNotFor: ['davinci'],
            def: {
                type: 'davinci_show_image',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            func: function(sprite, script) {
                const value = script.getField('VALUE');
                const data = {
                    type: 'SET_IMAGE',
                    data: {
                        value,
                    },
                };
                return Entry.Davinci.postCallReturn({
                    script,
                    data,
                });
            },
        },
        davinci_get_analog: {
            color: '#00CFCA',
			outerLine: '#04B5B0',
            fontColor: '#ffffff',
            skeleton: 'basic_string_field',
            statements: [],
            template: '아날로그 핀 %1번 센서값',
            params: [
                {
                    type: 'Dropdown',
                    options: [['P0', 7], ['P1', 8], ['P2', 9]],
                    value: 7,
                    fontSize: 11,
                },
            ],
            events: {},
            class: 'DavinciAnalog',
            isNotFor: ['davinci'],
            def: {
                type: 'davinci_get_analog',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            func: function(sprite, script) {
                const value = script.getField('VALUE');
                const data = {
                    type: 'GET_ANALOG',
                    data: {
                        value,
                    },
                };
                let returnData = Entry.Davinci.checkValue({
                    script,
                    data,
                    key: `GET_ANALOG.${value}`,
                });
                if (!returnData) {
                    returnData = _get(Entry.hw.portData, ['GET_ANALOG']);
                    const { executor } = script;
                    const { scope } = executor;
                    if (!scope.cacheValue) {
                        scope.cacheValue = {};
                    }
                    _set(scope.cacheValue, `GET_ANALOG.${value}`, returnData);
                }
                return returnData;
            },
        },
        davinci_get_analog_map: {
            color: '#00CFCA',
			outerLine: '#04B5B0',
            fontColor: '#ffffff',
            skeleton: 'basic_string_field',
            statements: [],
            template:
                '아날로그 핀 %1번 센서값의 범위를 %2~%3 에서 %4~%5 (으)로 바꾼값',
            params: [
                {
                    type: 'Dropdown',
                    options: [['P0', 7], ['P1', 8], ['P2', 9]],
                    value: 7,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
            class: 'DavinciAnalog',
            isNotFor: ['davinci'],
            def: {
                params: [
                    null,
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
                type: 'davinci_get_analog_map',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE2: 1,
                VALUE3: 2,
                VALUE4: 3,
                VALUE5: 4,
            },
            func: function(sprite, script) {
                const value = script.getField('PORT');
                const data = {
                    type: 'GET_ANALOG',
                    data: {
                        value,
                    },
                };
                let returnData = Entry.Davinci.checkValue({
                    script,
                    data,
                    key: `GET_ANALOG.${value}`,
                });
                if (!returnData) {
                    returnData = _get(Entry.hw.portData, ['GET_ANALOG']);
                    const { executor } = script;
                    const { scope } = executor;
                    if (!scope.cacheValue) {
                        scope.cacheValue = {};
                    }
                    _set(scope.cacheValue, `GET_ANALOG.${value}`, returnData);
                }

                var value2 = script.getNumberValue('VALUE2', script);
                var value3 = script.getNumberValue('VALUE3', script);
                var value4 = script.getNumberValue('VALUE4', script);
                var value5 = script.getNumberValue('VALUE5', script);
                var stringValue4 = script.getValue('VALUE4', script);
                var stringValue5 = script.getValue('VALUE5', script);
                var isFloat = false;

                if (
                    (Entry.Utils.isNumber(stringValue4) && stringValue4.indexOf('.') > -1) ||
                    (Entry.Utils.isNumber(stringValue5) && stringValue5.indexOf('.') > -1)
                ) {
                    isFloat = true;
                }

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
                returnData -= value2;
                returnData = returnData * ((value5 - value4) / (value3 - value2));
                returnData += value4;
                returnData = Math.min(value5, returnData);
                returnData = Math.max(value4, returnData);

                if (isFloat) {
                    returnData = Math.round(returnData * 100) / 100;
                } else {
                    returnData = Math.round(returnData);
                }
                return returnData;
            },
        },
        davinci_get_digital: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic_boolean_field',
            statements: [],
            template: '디지털 핀 %1번 센서값',
            params: [
                {
                    type: 'Dropdown',
                    options: [['P0', 7], ['P1', 8], ['P2', 9]],
                    value: 7,
                    fontSize: 11,
                },
            ],
            events: {},
            class: 'DavinciDigital',
            isNotFor: ['davinci'],
            def: {
                type: 'davinci_get_digital',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            func: function(sprite, script) {
                let value = script.getField('VALUE');
                const data = {
                    type: 'GET_DIGITAL',
                    data: {
                        value,
                    },
                };
                let returnData = Entry.Davinci.checkValue({
                    script,
                    data,
                    key: `GET_DIGITAL.${value}`,
                });
                if (!returnData) {
                    returnData = _get(Entry.hw.portData, ['GET_DIGITAL']);
                    const { executor } = script;
                    const { scope } = executor;
                    if (!scope.cacheValue) {
                        scope.cacheValue = {};
                    }
                    _set(scope.cacheValue, `GET_DIGITAL.${value}`, returnData);
                }
                return returnData;
            },
        },
        davinci_get_button: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic_boolean_field',
            statements: [],
            template: '%1버튼을 눌렀는가?',
            params: [
                {
                    type: 'Dropdown',
                    options: [['A', 10], ['B', 11], ['A + B', 12]],
                    value: 10,
                    fontSize: 11,
                },
            ],
            events: {},
            class: 'DavinciSensor',
            isNotFor: ['davinci'],
            def: {
                type: 'davinci_get_button',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            func: function(sprite, script) {
                let value = script.getField('VALUE');
                const data = {
                    type: 'GET_BUTTON',
                    data: {
                        value,
                    },
                };
                let returnData = Entry.Davinci.checkValue({
                    script,
                    data,
                    key: `GET_BUTTON.${value}`,
                });
                if (!returnData) {
                    returnData = _get(Entry.hw.portData, ['GET_BUTTON']);
                    const { executor } = script;
                    const { scope } = executor;
                    if (!scope.cacheValue) {
                        scope.cacheValue = {};
                    }
                    console.log("RETURN: " + returnData);
                    _set(scope.cacheValue, `GET_BUTTON.${value}`, returnData);
                }
                return returnData;
            },
        },
        davinci_get_sensor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1 센서값',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['빛', 'lightLevel'],
                        ['온도', 'temperature'],
                        ['소리', 'soundLevel'],
                        ['자기', 'compassHeading'],
                    ],
                    value: 'temperature',
                    fontSize: 11,
                },
            ],
            events: {},
            class: 'DavinciSensor',
            isNotFor: ['davinci'],
            def: {
                type: 'davinci_get_sensor',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            func: function(sprite, script) {
                let value = script.getField('VALUE');
                const data = {
                    type: 'GET_SENSOR',
                    data: {
                        value,
                    },
                };
                let returnData = Entry.Davinci.checkValue({
                    script,
                    data,
                    key: `GET_SENSOR.${value}`,
                });
                if (!returnData) {
                    returnData = _get(Entry.hw.portData, ['GET_SENSOR']);
                    const { executor } = script;
                    const { scope } = executor;
                    if (!scope.cacheValue) {
                        scope.cacheValue = {};
                    }
                    _set(scope.cacheValue, `GET_SENSOR.${value}`, returnData);
                }
                return returnData;
            },
        },
        davinci_get_accelerometer: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic_string_field',
            statements: [],
            template: '가속도 센서 %1의 값',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['x축', 0],
                        ['y축', 1],
                        ['z축', 2],
                    ],
                    value: 0,
                    fontSize: 11,
                },
            ],
            events: {},
            class: 'DavinciSensor',
            isNotFor: ['davinci'],
            def: {
                type: 'davinci_get_accelerometer',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            func: function(sprite, script) {
                let value = script.getField('VALUE');
                const data = {
                    type: 'GET_ACCELEROMETER',
                    data: {
                        value,
                    },
                };
                let returnData = Entry.Davinci.checkValue({
                    script,
                    data,
                    key: `GET_ACCELEROMETER.${value}`,
                });
                if (!returnData) {
                    returnData = _get(Entry.hw.portData, ['GET_ACCELEROMETER']);
                    const { executor } = script;
                    const { scope } = executor;
                    if (!scope.cacheValue) {
                        scope.cacheValue = {};
                    }
                    _set(
                        scope.cacheValue,
                        `GET_ACCELEROMETER.${value}`,
                        returnData
                    );
                }
                return returnData;
            },
        },
        davinci_get_gyro: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic_string_field',
            statements: [],
            template: '자이로 센서 %1의 값',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['x축', 0],
                        ['y축', 1],
                        ['z축', 2],
                    ],
                    value: 0,
                    fontSize: 11,
                },
            ],
            events: {},
            class: 'DavinciSensor',
            isNotFor: ['davinci'],
            def: {
                type: 'davinci_get_gyro',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            func: function(sprite, script) {
                let value = script.getField('VALUE');
                const data = {
                    type: 'GET_GYRO',
                    data: {
                        value,
                    },
                };
                let returnData = Entry.Davinci.checkValue({
                    script,
                    data,
                    key: `GET_GYRO.${value}`,
                });
                if (!returnData) {
                    returnData = _get(Entry.hw.portData, ['GET_GYRO']);
                    const { executor } = script;
                    const { scope } = executor;
                    if (!scope.cacheValue) {
                        scope.cacheValue = {};
                    }
                    _set(
                        scope.cacheValue,
                        `GET_GYRO.${value}`,
                        returnData
                    );
                }
                return returnData;
            },
        },
        davinci_get_magnet: {
            color: '#00CFCA',
			outerLine: '#04B5B0',
            fontColor: '#ffffff',
            skeleton: 'basic_string_field',
            statements: [],
            template: '지자기 센서 %1의 값',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['x축', 0],
                        ['y축', 1],
                        ['z축', 2],
                    ],
                    value: 0,
                    fontSize: 11,
                },
            ],
            events: {},
            class: 'DavinciSensor',
            isNotFor: ['davinci'],
            def: {
                type: 'davinci_get_magnet',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            func: function(sprite, script) {
                let value = script.getField('VALUE');
                const data = {
                    type: 'GET_MAGNET',
                    data: {
                        value,
                    },
                };
                let returnData = Entry.Davinci.checkValue({
                    script,
                    data,
                    key: `GET_MAGNET.${value}`,
                });
                if (!returnData) {
                    returnData = _get(Entry.hw.portData, ['GET_MAGNET']);
                    const { executor } = script;
                    const { scope } = executor;
                    if (!scope.cacheValue) {
                        scope.cacheValue = {};
                    }
                    _set(
                        scope.cacheValue,
                        `GET_MAGNET.${value}`,
                        returnData
                    );
                }
                return returnData;
            },
        },
        davinci_play_note: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
            statements: [],
            template: '%1음을 %2박자 연주하기 %3',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['Low C', 1],
                        ['Low C#', 22],
                        ['Low D', 2],
                        ['Low Eb', 23],
                        ['Low E', 3],
                        ['Low F', 4],
                        ['Low F#', 24],
                        ['Low G', 5],
                        ['Low G#', 25],
                        ['Low A', 6],
                        ['Low Bb', 26],
                        ['Low B', 7],
                        ['Middle C', 8],
                        ['Middle C#', 27],
                        ['Middle D', 9],
                        ['Middle Eb', 28],
                        ['Middle E', 10],
                        ['Middle F', 11],
                        ['Middle F#', 29],
                        ['Middle G', 12],
                        ['Middle G#', 30],
                        ['Middle A', 13],
                        ['Middle Bb', 31],
                        ['Middle B', 14],
                        ['High C', 15],
                        ['High C#', 32],
                        ['High D', 16],
                        ['High Eb', 33],
                        ['High E', 17],
                        ['High F', 18],
                        ['High F#', 34],
                        ['High G', 19],
                        ['High G#', 35],
                        ['High A', 20],
                        ['High Bb', 36],
                        ['High B', 21],
                    ],
                    value: 8,
                    fontSize: 11,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['1', 0],
                        ['1/2', 4],
                        ['1/4', 5],
                        ['1/8', 6],
                        ['1/16', 7],
                        ['2', 1],
                        ['4', 2],
                        ['8', 3],
                    ],
                    value: 0,
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
            class: 'DavinciMusic',
            isNotFor: ['davinci'],
            def: {
                type: 'davinci_play_note',
            },
            paramsKeyMap: {
                NOTE: 0,
                BEAT: 1,
            },
            func: function(sprite, script) {
                const note = script.getField('NOTE');
                const beat = script.getField('BEAT');
                const data = {
                    type: 'PLAY_NOTE',
                    data: {
                        note,
                        beat,
                    },
                };
                return Entry.Davinci.postCallReturn({
                    script,
                    data,
                });
            },
        },
        davinci_play_melody: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
            statements: [],
            template: '%1 노래 연주하기%2',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['띠링', 0],
                        ['와우와우와우', 1],
                        ['올라가기', 2],
                        ['내려가기', 3],
                        ['파워업', 4],
                        ['파워다운', 5],
                        ['마법봉', 6],
                        ['비상벨', 7]
                    ],
                    value: 0,
                    fontSize: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            class: 'DavinciMusic',
            isNotFor: ['davinci'],
            def: {
                type: 'davinci_play_melody',
            },
            paramsKeyMap: {
                MELODY: 0,
            },
            func: function(sprite, script) {
                const melody = script.getField('MELODY');
                const data = {
                    type: 'PLAY_MELODY',
                    data: {
                        melody,
                    },
                };
                return Entry.Davinci.postCallReturn({
                    script,
                    data,
                });
            },
        },
        davinci_change_bpm: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
            statements: [],
            template: '연주 속도를 %1BPM 만큼 바꾸기 %2',
            params: [
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
            class: 'DavinciMusic',
            isNotFor: ['davinci'],
            def: {
                params: [
                    {
                        type: 'number',
                        params: [20],
                    },
                ],
                type: 'davinci_change_bpm',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            func: function(sprite, script) {
                const value = script.getNumberValue('VALUE');
                const data = {
                    type: 'CHANGE_BPM',
                    data: {
                        value,
                    },
                };
                return Entry.Davinci.postCallReturn({
                    script,
                    data,
                });
            },
        },
        davinci_set_bpm: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
            statements: [],
            template: '연주 속도를 %1BPM으로 정하기 %2',
            params: [
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
            class: 'DavinciMusic',
            isNotFor: ['davinci'],
            def: {
                params: [
                    {
                        type: 'number',
                        params: [120],
                    },
                ],
                type: 'davinci_set_bpm',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            func: function(sprite, script) {
                const value = script.getNumberValue('VALUE');
                const data = {
                    type: 'SET_BPM',
                    data: {
                        value,
                    },
                };
                return Entry.Davinci.postCallReturn({
                    script,
                    data,
                });
            },
        },
    };
};

module.exports = Entry.Davinci;
