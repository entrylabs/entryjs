'use strict';

const _set = require('lodash/set');
const _merge = require('lodash/merge');

Entry.Microbit = new class Microbit {
    constructor() {
        this.name = 'microbit';
    }
    setZero() {
        Entry.hw.sendQueue = {
            [Entry.generateHash()]: {
                type: 'RST',
            },
        };
        // _set(Entry.hw.sendQueue, `OUTPUT.${Entry.generateHash()}`, {
        //     type: 'RST',
        // });
        Entry.hw.update();
    }

    sendMessage({socket, sendQueue = {}}) {
        if(!_.isEmpty(sendQueue)) {
            console.log(sendQueue);
            const keys = Object.keys(sendQueue);
            const uniqueKey = Entry.generateHash();
            socket.emit('message', {
                data: JSON.stringify(sendQueue),
                mode: socket.mode,
                type: 'utf8',
                key: uniqueKey,
            }, (data)=> {
                if(data === uniqueKey) {
                    keys.forEach((key)=> {
                        delete sendQueue[key];
                    });
                }
            });
        }
    }
    afterSend(data) {
        // Object.assign(data, {
        //     OUTPUT: {},
        // });
    }
    afterReceive(data) {
        // console.log('afterReceive', data);
    }
}();

Entry.Microbit.getBlocks = function() {
    return {
        microbit_led_toggle: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            template: 'LED의 X:%1 Y:%2 %3 %4',
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
                    type: 'Dropdown',
                    options: [
                        ['켜기', 'on'],
                        ['끄기', 'off'],
                        ['반전', 'toggle'],
                    ],
                    value: 'on',
                    fontSize: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            events: {},
            class: 'MicrobitLed',
            isNotFor: ['microbit'],
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
                type: 'microbit_led_toggle',
            },
            paramsKeyMap: {
                X: 0,
                Y: 1,
                VALUE: 2,
            },
            func: function(sprite, script) {
                let x = script.getNumberValue('X');
                let y = script.getNumberValue('Y');
                let value = script.getField('VALUE');
                _merge(Entry.hw.sendQueue, {
                    [Entry.generateHash()]: {
                        type: 'LED',
                        data: {
                            x,
                            y,
                            value,
                        },
                    },
                });

                return script.callReturn();
            },
        },
        microbit_led_toggle2: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            template: 'LED의 X:%1 Y:%2 %3 %4',
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
                    type: 'Dropdown',
                    options: [['켜기', true], ['끄기', false]],
                    value: true,
                    fontSize: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            events: {},
            class: 'MicrobitLed',
            isNotFor: ['microbit'],
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
                type: 'microbit_led_toggle2',
            },
            paramsKeyMap: {
                X: 0,
                Y: 1,
                VALUE: 2,
            },
            func: function(sprite, script) {
                let x = script.getNumberValue('X');
                let y = script.getNumberValue('Y');
                let value = script.getField('VALUE');
                _set(Entry.hw.sendQueue, 'STR', {
                    id: Entry.generateHash(),
                    data: 'A',
                });

                return script.callReturn();
            },
        },
    };
};
