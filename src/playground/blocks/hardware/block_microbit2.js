'use strict';

const _clamp = require('lodash/clamp');
const _get = require('lodash/get');
const _merge = require('lodash/merge');

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
        this.blockIds = {};
        this.isExecBlock = false;
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
    //         this.blockIds[blockId] = false;
    //         _merge(Entry.hw.sendQueue, {
    //             [blockId]: data,
    //         });
    //         Entry.hw.update();
    //         setTimeout(() => {
    //             scope.timeFlag = 0;
    //         });
    //         return false;
    //     } else if (this.blockIds[this.nowBlockId] && scope.timeFlag === 0) {
    //         delete this.blockIds[this.nowBlockId];
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
Entry.Microbit2.blockMenuBlocks = ['Microbit2_led_toggle'];
Entry.Microbit2.getBlocks = function() {
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
                // const { payload } = Entry.hw.portData;
                // while (!Entry.hw.sendQueue || (payload.status && payload.status === 'pending')) {
                //     console.log('pending...');
                //     await new Promise((resolve) => setTimeout(resolve, 1000 / Entry.FPS));
                // }
                console.log('logic start...');

                const value = script.getField('VALUE');
                const x = _clamp(script.getNumberValue('X'), 0, 4);
                const y = _clamp(script.getNumberValue('Y'), 0, 4);
                Entry.hw.sendQueue = {
                    id: this.getHashKey(),
                    type: 'SET_LED',
                    payload: { x, y, value },
                };
                console.log('logic end...');
            },
        },
    };
};

module.exports = Entry.Microbit2;
