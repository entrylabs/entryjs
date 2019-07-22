'use strict';

const _clamp = require('lodash/clamp');

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
    }

    setZero() {
        console.log('setZero called');
        delete Entry.hw.portData.payload;
        delete Entry.hw.sendQueue.checked;
        delete Entry.hw.sendQueue.requested;
        this.setRequestCommand(functionKeys.RESET);
    }

    getHashKey() {
        let key = new Date().getSeconds().toString(16);
        if (key.length === 1) {
            key += ((Math.random() * 16) | 0).toString(16);
        }
        const generatedId = Entry.generateHash(2) + key;
        this.lastExecutedBlockId = generatedId;
        return generatedId;
    }

    pushBlockIdChecked(blockId) {
        if (!Entry.hw.checked) {
            Entry.hw.checked = [];
        }
        Entry.hw.checked.push(blockId);
    }

    setRequestCommand(type, payload) {
        if (!Entry.hw.sendQueue.requested) {
            Entry.hw.sendQueue.requested = [];
        }
        Entry.hw.sendQueue.requestedRevision = Date.now();
        Entry.hw.sendQueue.requested.push({
            id: this.getHashKey(),
            type,
            payload,
        });
        Entry.hw.update();
    }

    awaitForAcknowledgeSignal() {
        // 마지막으로 실행한 블록이 실제로 실행됐는지 확인한다.
        // 만약 setZero 및 첫실행이라 payload 가 없으면 그냥 넘어간다.
        // 서버에서 executed 를 확인한다. executed 목록에 내 블록이 있으면 넘어간다.
        // 넘어가면서 sendQueue.checked 에 내 블록아이디를 추가한다.
        const { payload } = Entry.hw.portData;
        if (
            this.lastExecutedBlockId &&
            payload &&
            payload.executed.indexOf(this.lastExecutedBlockId) < 0
        ) {
            throw new Entry.Utils.AsyncError();
        } else {
            this.pushBlockIdChecked(this.lastExecutedBlockId);
            this.lastExecutedBlockId = undefined;
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
                    // 아이디를 생성한다.
                    // 아이디를 마지막 블록실행 id 로 등록한다.
                    // 커맨드 오브젝트를 만든다.
                    // 커맨드 오브젝트를 requested에 등록한다.
                    this.awaitForAcknowledgeSignal();
                    console.log('logic start...');
                    const value = script.getField('VALUE');
                    const x = _clamp(script.getNumberValue('X'), 0, 4);
                    const y = _clamp(script.getNumberValue('Y'), 0, 4);
                    console.log(x, y, value);
                    this.setRequestCommand(functionKeys.SET_LED, { x, y, value });
                    console.log('logic end...');
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
Entry.Microbit2.blockMenuBlocks = ['Microbit2_led_toggle'];

module.exports = Entry.Microbit2;
