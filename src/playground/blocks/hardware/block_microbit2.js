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

    PLAY_NOTE: 0x04,
    CHANGE_BPM: 0x05,
    SET_BPM: 0x06,
    GET_LED: 0x31,
    GET_ANALOG: 0x32,
    GET_DIGITAL: 0x33,
    GET_BUTTON: 0x34,
    GET_LIGHT_LEVEL: 0x35,
    GET_TEMPERATURE: 0x36,
    GET_COMPASS_HEADING: 0x37,
    GET_ACCELEROMETER: 0x38,
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
            'Microbit2_show_string',
            'microbit2_show_image',
            'Microbit2_get_accelerometer',
        ];
    }

    setZero() {
        this.requestCommand(functionKeys.RESET);
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
                        '',
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
