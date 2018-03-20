'use strict';

const _set = ('lodash/set');
const _merge = ('lodash/merge');

Entry.Microbit = {
    name: 'microbit',
    setZero: function() {
        _merge(Entry.hw.sendQueue, {
            OUTPUT: {
                [Entry.generateHash()]: {
                    type: 'RST',
                },
            },
        });
        Entry.hw.update();
    },
    update: function(data) {
        console.log(data);
    },
};

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
                    OUTPUT: {
                        [Entry.generateHash()]: {
                            type: 'LED',
                            data: {
                                x,
                                y,
                                value,
                            },
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
                _set(Entry.hw.sendQueue, 'OUTPUT.STR', {
                    id: Entry.generateHash(),
                    data: 'A',
                });

                return script.callReturn();
            },
        },
    };
};
