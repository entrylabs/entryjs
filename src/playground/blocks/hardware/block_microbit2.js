'use strict';

const _clamp = require('lodash/clamp');
const _get = require('lodash/get');

const functionKeys = {
    TEST_MESSAGE: 0xfa,
    RESET: 0xfe,
    CHECK_READY: 0xff,
    SET_LED: 0x01,
    SET_STRING: 0x02,
    SET_IMAGE: 0x03,
    GET_LED: 0x31,
    GET_ANALOG: 0x32,
    GET_DIGITAL: 0x33,
    GET_BUTTON: 0x34,
    GET_LIGHT_LEVEL: 0x35,
    GET_TEMPERATURE: 0x36,
    GET_COMPASS_HEADING: 0x37,
    GET_ACCELEROMETER: 0x38,

    PLAY_NOTE: 0x04,
    CHANGE_BPM: 0x05,
    SET_BPM: 0x06,
};

Entry.Microbit2 = new class Microbit2 {
    constructor() {
        this.id = 'FF.1';
        this.url = 'http://Microbit2.org/ko/';
        this.imageName = 'Microbit2.png';
        this.title = {
            en: 'Microbit2',
            ko: '마이크로빗',
        };
        this.name = 'Microbit2';
        this.communicationType = 'manual';
        this.blockMenuBlocks = [
            'Microbit2_led_toggle',
            'microbit2_get_led',
            'Microbit2_show_string',
            'microbit2_show_image',
            'microbit2_get_analog',
            'microbit2_get_analog_map',
            'microbit2_get_digital',
            'microbit2_get_button',
            'microbit2_get_sensor',
            'Microbit2_get_accelerometer',
        ];
    }

    setZero() {
        this.requestCommand(functionKeys.RESET);
        delete Entry.hw.portData.sensorData;
    }

    onReceiveData(portData) {
        console.log('onReceiveData', portData);
    }

    getHashKey() {
        let key = new Date().getSeconds().toString(16);
        if (key.length === 1) {
            key += ((Math.random() * 16) | 0).toString(16);
        }
        return Entry.generateHash(2) + key;
    }

    requestCommand(type, payload) {
        Entry.hw.sendQueue = {
            id: this.getHashKey(),
            type,
            payload,
        };
        Entry.hw.update();
    }

    /**
     * command 요청 후 데이터 송수신이 끝날 때까지 대기한다.
     * @param type
     * @param payload
     */
    requestCommandWithResponse(type, payload) {
        if (!Entry.hw.pending && !this.isCommandRequested) {
            // 첫 진입시 무조건 AsyncError
            this.isCommandRequested = true;
            Entry.hw.sendQueue = {
                id: this.getHashKey(),
                type,
                payload,
            };
            Entry.hw.update();
            throw new Entry.Utils.AsyncError();
        } else if (Entry.hw.pending && this.isCommandRequested) {
            // 두 번째 이상의 진입시도이며 작업이 아직 끝나지 않은 경우
            throw new Entry.Utils.AsyncError();
        } else {
            // 두 번째 이상의 진입시도이며 pending 도 아닌 경우
            // 블록 func 로직에서 다음 데이터를 처리한다.
            delete this.isCommandRequested;
        }
    }

    getBlocks() {
        return {
            Microbit2_led_toggle: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                template: 'LED의 X:%1 Y:%2 %3 %4',
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
                        type: 'Dropdown',
                        options: [['켜기', 'on'], ['끄기', 'off'], ['반전', 'toggle']],
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
                class: 'Microbit2Led',
                isNotFor: ['Microbit2'],
                def: {
                    params: [
                        {
                            type: 'text',
                            params: ['0'],
                        },
                        {
                            type: 'text',
                            params: ['0'],
                        },
                    ],
                    type: 'Microbit2_led_toggle',
                },
                paramsKeyMap: {
                    X: 0,
                    Y: 1,
                    VALUE: 2,
                },
                func: (sprite, script) => {
                    const value = script.getField('VALUE');
                    const x = _clamp(script.getNumberValue('X'), 0, 4);
                    const y = _clamp(script.getNumberValue('Y'), 0, 4);
                    this.requestCommand(functionKeys.SET_LED, { x, y, value });
                },
            },
            microbit2_get_led: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                statements: [],
                template: 'LED의 X:%1 Y:%2 상태값',
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
                ],
                events: {},
                class: 'Microbit2Led',
                isNotFor: ['Microbit2'],
                def: {
                    params: [
                        {
                            type: 'text',
                            params: ['0'],
                        },
                        {
                            type: 'text',
                            params: ['0'],
                        },
                    ],
                    type: 'microbit2_get_led',
                },
                paramsKeyMap: {
                    X: 0,
                    Y: 1,
                },
                func: (sprite, script) => {
                    const x = _clamp(script.getNumberValue('X'), 0, 4);
                    const y = _clamp(script.getNumberValue('Y'), 0, 4);
                    this.requestCommandWithResponse(functionKeys.GET_LED, { x, y });
                    return _get(Entry.hw.portData, ['payload', 'sensorData', 'led', x, y], 0);
                },
            },
            Microbit2_show_string: {
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
                class: 'Microbit2Led',
                isNotFor: ['Microbit2'],
                def: {
                    params: [
                        {
                            type: 'text',
                            params: ['Hello!'],
                        },
                    ],
                    type: 'Microbit2_show_string',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                func: (sprite, script) => {
                    let value = script.getStringValue('VALUE');
                    value = value.replace(
                        /[^A-Za-z0-9_\`\~\!\@\#\$\%\^\&\*\(\)\-\=\+\\\{\}\[\]\'\"\;\:\<\,\>\.\?\/\s]/gim,
                        ''
                    );
                    this.requestCommand(functionKeys.SET_STRING, value);
                },
            },
            microbit2_show_image: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                skeleton: 'basic',
                statements: [],
                template: '%1 아이콘 출력하기 %2',
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            ['하트', 0],
                            ['행복함', 2],
                            ['삼각형', 13],
                            ['사각형', 19],
                            ['다이아몬드', 17],
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
                class: 'Microbit2Led',
                isNotFor: ['Microbit2'],
                def: {
                    type: 'microbit2_show_image',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                func: (sprite, script) => {
                    const value = script.getField('VALUE');
                    this.requestCommand(functionKeys.SET_IMAGE, { value });
                },
            },
            microbit2_get_analog: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                statements: [],
                template: '아날로그 핀 %1번 센서값',
                params: [
                    {
                        type: 'Dropdown',
                        options: [['P0', 0], ['P1', 1], ['P2', 2]],
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                class: 'Microbit2Analog',
                isNotFor: ['Microbit2'],
                def: {
                    type: 'microbit2_get_analog',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                func: (sprite, script) => {
                    const value = script.getField('VALUE');
                    this.requestCommandWithResponse(functionKeys.GET_ANALOG, [value]);
                    return _get(Entry.hw.portData, ['payload', 'sensorData', 'analog', value], 0);
                },
            },
            microbit2_get_analog_map: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                statements: [],
                template: '아날로그 핀 %1번 센서값의 범위를 %2~%3 에서 %4~%5 (으)로 바꾼값',
                params: [
                    {
                        type: 'Dropdown',
                        options: [['P0', 0], ['P1', 1], ['P2', 2]],
                        value: 0,
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
                class: 'Microbit2Analog',
                isNotFor: ['Microbit2'],
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
                    type: 'microbit2_get_analog_map',
                },
                paramsKeyMap: {
                    PORT: 0,
                    VALUE2: 1,
                    VALUE3: 2,
                    VALUE4: 3,
                    VALUE5: 4,
                },
                func: (sprite, script) => {
                    const value = script.getField('VALUE');
                    this.requestCommandWithResponse(functionKeys.GET_ANALOG, [value]);
                    let returnData = _get(
                        Entry.hw.portData,
                        ['payload', 'sensorData', 'analog', value],
                        0
                    );

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
                    let swap;
                    if (value2 > value3) {
                        swap = value2;
                        value2 = value3;
                        value3 = swap;
                    }
                    if (value4 > value5) {
                        swap = value4;
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
            microbit2_get_digital: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_boolean_field',
                statements: [],
                template: '디지털 핀 %1번 센서값',
                params: [
                    {
                        type: 'Dropdown',
                        options: [['P0', 0], ['P1', 1], ['P2', 2]],
                        value: 0,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                class: 'Microbit2Digital',
                isNotFor: ['Microbit2'],
                def: {
                    type: 'microbit2_get_digital',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                func: (sprite, script) => {
                    const value = script.getField('VALUE');
                    this.requestCommandWithResponse(functionKeys.GET_DIGITAL, [value]);
                    return _get(Entry.hw.portData, ['payload', 'sensorData', 'digital', value], 0);
                },
            },
            microbit2_get_button: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_boolean_field',
                statements: [],
                template: '%1버튼을 눌렀는가?',
                params: [
                    {
                        type: 'Dropdown',
                        options: [['A', 1], ['B', 2], ['A+B', 3]],
                        value: 1,
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                class: 'Microbit2Button',
                isNotFor: ['Microbit2'],
                def: {
                    type: 'microbit2_get_button',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                func: (sprite, script) => {
                    const value = script.getField('VALUE');
                    this.requestCommandWithResponse(functionKeys.GET_BUTTON, [value]);
                    return _get(Entry.hw.portData, ['payload', 'sensorData', 'button'], false);
                },
            },
            microbit2_get_sensor: {
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
                            ['자기', 'compassHeading'],
                        ],
                        value: 'temperature',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                class: 'Microbit2Sensor',
                isNotFor: ['Microbit2'],
                def: {
                    type: 'microbit2_get_sensor',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                func: (sprite, script) => {
                    const value = script.getField('VALUE');
                    let commandType;
                    switch (value) {
                        case 'lightLevel':
                            commandType = functionKeys.GET_LIGHT_LEVEL;
                            break;
                        case 'temperature':
                            commandType = functionKeys.GET_TEMPERATURE;
                            break;
                        case 'compassHeading':
                            commandType = functionKeys.GET_COMPASS_HEADING;
                            break;
                        default:
                            // 입력값이 정상적이지 않은 경우 온도값을 표기
                            commandType = functionKeys.GET_TEMPERATURE;
                            break;
                    }
                    this.requestCommandWithResponse(commandType);
                    return _get(Entry.hw.portData, ['payload', 'sensorData', value], -1);
                },
            },
            Microbit2_get_accelerometer: {
                color: EntryStatic.colorSet.block.default.HARDWARE,
                outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                fontColor: '#ffffff',
                skeleton: 'basic_string_field',
                statements: [],
                template: '가속도 센서 %1의 값',
                params: [
                    {
                        type: 'Dropdown',
                        options: [['x축', 0], ['y축', 1], ['z축', 2], ['크기', 3]],
                        value: 'x',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    },
                ],
                events: {},
                class: 'Microbit2Accelerometer',
                isNotFor: ['Microbit2'],
                def: {
                    type: 'Microbit2_get_accelerometer',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                func: (sprite, script) => {
                    const value = script.getField('VALUE');
                    this.requestCommand(functionKeys.GET_ACCELEROMETER, { value });
                    return _get(Entry.hw.portData, 'payload.sensorData.accelerometer', -1);
                },
            },
        };
    }

    // sendMessage({ socket, sendQueue = {} }) {
    //     if (!_.isEmpty(sendQueue)) {
    //         const keys = Object.keys(sendQueue);
    //         const uniqueKey = this.getHashKey();
    //         socket.emit(
    //             'message',
    //             {
    //                 data: JSON.stringify(sendQueue),
    //                 mode: socket.mode,
    //                 type: 'utf8',
    //                 key: uniqueKey,
    //             },
    //             (data) => {
    //                 if (data === uniqueKey) {
    //                     keys.forEach((key) => {
    //                         delete sendQueue[key];
    //                     });
    //                 }
    //             }
    //         );
    //     }
    // }

    // asyncFlowControl({ script, data }, scope) {
    //     if (!this.isExecBlock && !scope.isStart) {
    //         const blockId = this.getHashKey();
    //         this.isExecBlock = true;
    //         scope.isStart = true;
    //         scope.timeFlag = 1;
    //         this.nowBlockId = blockId;
    //         this.lastExecutedBlockIds[blockId] = false;
    //         _merge(Entry.hw.sendQueue, {
    //             [blockId]: data,
    //         });
    //         Entry.hw.update();
    //         setTimeout(() => {
    //             scope.timeFlag = 0;
    //         });
    //         return false;
    //     } else if (this.lastExecutedBlockIds[this.nowBlockId] && scope.timeFlag === 0) {
    //         delete this.lastExecutedBlockIds[this.nowBlockId];
    //         delete scope.isStart;
    //         this.isExecBlock = false;
    //         Entry.engine.isContinue = false;
    //         return true;
    //     }
    //     return false;
    // }
    //
    // postCallReturn(args) {
    //     const { script } = args;
    //     if (!this.asyncFlowControl(args, script)) {
    //         return Entry.STATIC.BREAK;
    //     }
    // }
    //
    // checkValue(args) {
    //     const { script, key } = args;
    //     const { entity, executor } = script;
    //     const { scope } = executor;
    //     const { cacheValue = {} } = scope;
    //     const value = _get(cacheValue, key);
    //     if (value) {
    //         return value;
    //     } else if (!this.asyncFlowControl(args, scope)) {
    //         throw new Entry.Utils.AsyncError();
    //     }
    // }
}();
module.exports = Entry.Microbit2;
