'use strict';

const _set = require('lodash/set');
const _get = require('lodash/get');
const _merge = require('lodash/merge');

const functionKeys = {
    SET_LED: 'set-pixel',
    RESET: 'reset',
};

Entry.Microbit2 = new (class Microbit2 {
    constructor() {
        this.id = '22.3';
        this.url = 'http://microbit.org/ko/';
        this.imageName = 'microbit2.png';
        this.title = {
            en: 'Microbit v2',
            ko: '마이크로빗 v2',
        };
        this.name = 'microbit2';
        this.communicationType = 'manual';
        this.blockMenuBlocks = ['microbit2_set_led_value'];
        this.commandStatus = {};
    }

    setZero() {
        // 엔트리 정지시 하드웨어 초기화 로직
        this.requestCommand(functionKeys.RESET);
        this.lastGesture = -1;
        this.commandStatus = {};
        this.isEngineStop = true;
        delete Entry.hw.portData.sensorData;
    }

    requestCommand(type, payload) {
        this.isEngineStop = false;
        Entry.hw.sendQueue = {
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
    requestCommandWithResponse(entityId, type, payload) {
        this.isEngineStop = false;
        const codeId = `${entityId}-${type}`;
        if (!this.commandStatus[codeId]) {
            // 첫 진입시 무조건 AsyncError
            Entry.hw.sendQueue = {
                type,
                payload,
            };
            this.commandStatus[codeId] = 'pending';
            Entry.hw.sendQueue.codeId = codeId;
            Entry.hw.update();
            throw new Entry.Utils.AsyncError();
        } else if (this.commandStatus[codeId] === 'pending') {
            // 두 번째 이상의 진입시도이며 작업이 아직 끝나지 않은 경우
            throw new Entry.Utils.AsyncError();
        } else if (this.commandStatus[codeId] === 'completed') {
            // 두 번째 이상의 진입시도이며 pending 도 아닌 경우
            // 블록 func 로직에서 다음 데이터를 처리한다.
            this.commandStatus[codeId] = null;
        }
    }
    afterReceive(portData) {
        console.log(portData.payload);
        if (portData.payload.recentlyWaitDone) {
            this.commandStatus[portData.payload.recentlyWaitDone] = 'completed';
        }
    }
    // 언어 적용

    setLanguage() {
        return {
            ko: {
                template: {
                    microbit2_set_led_value: 'LED X:%1 Y:%2 %3 %4 로 세팅',
                },
                Blocks: {},
            },
            en: {
                template: {
                    sample_block: '%1',
                },
                Blocks: {},
            },
        };
    }
    getBlocks = function() {
        return {
            microbit2_set_led_value: {
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
                class: 'microbit2Led',
                isNotFor: ['microbit2'],
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
                        {
                            type: 'text',
                            params: ['0'],
                        },
                    ],
                    type: 'microbit2_set_led_value',
                },
                paramsKeyMap: {
                    X: 0,
                    Y: 1,
                    VALUE: 2,
                },
                func: (sprite, script) => {
                    const value = script.getNumberValue('VALUE');
                    let x = script.getNumberValue('X');
                    let y = script.getNumberValue('Y');
                    x = Math.max(0, x);
                    x = Math.min(4, x);
                    y = Math.max(0, y);
                    y = Math.min(4, y);
                    const data = {
                        type: functionKeys.SET_LED,
                        data: {
                            x,
                            y,
                            value,
                        },
                    };

                    const parsedPayload = `${x};${y};${value}`;
                    this.requestCommandWithResponse(
                        script.entity.id,
                        functionKeys.SET_LED,
                        parsedPayload
                    );
                },
            },
        };
    };
})();

module.exports = Entry.Microbit2;
