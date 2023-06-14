'use strict';

Entry.Bridge = {
    id: '55.1',
    name: 'Bridge',
    imageName: 'bridge.png',
    title: {
        ko: '브릿지',
        en: 'Bridge',
    },
    setZero() {
        if (!Entry.hw.sendQueue.SET) {
            Entry.hw.sendQueue = {
                GET: {},
                SET: {},
            };
        } else {
            const keySet = Object.keys(Entry.hw.sendQueue.SET);
            keySet.forEach((key) => {
                Entry.hw.sendQueue.SET[key].data = 0;
                Entry.hw.sendQueue.SET[key].time = new Date().getTime();
            });
        }
        Entry.hw.update();
    },
    sensorTypes: {
        DIGITAL: 1,
    },
    BlockState: {},
};

Entry.Bridge.setLanguage = function() {
    return {
        ko: {
            template: {
                bridge_get_digital1: ' 도 누름 ',
                bridge_get_digital2: ' 레 누름 ',
                bridge_get_digital3: ' 미 누름 ',
                bridge_get_digital4: ' 파 누름 ',
                bridge_get_digital5: ' 솔 누름 ',
                bridge_get_digital6: ' 라 누름 ',
                bridge_get_digital7: ' 시 누름 ',
                bridge_get_digital8: ' 윗 도 누름 ',
                bridge_get_digital9: ' 도# 누름 ',
                bridge_get_digital10: ' 레# 누름 ',
                bridge_get_digital11: ' 파# 누름 ',
                bridge_get_digital12: ' 솔# 누름 ',
                bridge_get_digital13: ' 라# 누름 ',
            },
        },
    };
};

Entry.Bridge.blockMenuBlocks = [
    'bridge_get_digital1',
    'bridge_get_digital2',
    'bridge_get_digital3',
    'bridge_get_digital4',
    'bridge_get_digital5',
    'bridge_get_digital6',
    'bridge_get_digital7',
    'bridge_get_digital8',
    'bridge_get_digital9',
    'bridge_get_digital10',
    'bridge_get_digital11',
    'bridge_get_digital12',
    'bridge_get_digital13',
];

Entry.Bridge.getBlocks = function() {
    return {
        bridge_get_digital1: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
            ],
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'BridgeGet',
            isnotFor: ['Bridge'],
            func(sprite, script) {
                const { hwModule = {} } = Entry.hw;
                const { name } = hwModule;
                if (name === 'Bridge' || name === 'ArduinoNano') {
                    const port = 0;
                    const DIGITAL = Entry.hw.portData.DIGITAL;
                    if (!Entry.hw.sendQueue.GET) {
                        Entry.hw.sendQueue.GET = {};
                    }
                    Entry.hw.sendQueue.GET[Entry.Bridge.sensorTypes.DIGITAL] = {
                        port,
                        time: new Date().getTime(),
                    };
                    return DIGITAL ? DIGITAL[port] || 0 : 0;
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.digitalRead(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },

        bridge_get_digital2: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
            ],
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'BridgeGet',
            isnotFor: ['Bridge'],
            func(sprite, script) {
                const { hwModule = {} } = Entry.hw;
                const { name } = hwModule;
                if (name === 'Bridge' || name === 'ArduinoNano') {
                    const port = 1;
                    const DIGITAL = Entry.hw.portData.DIGITAL;
                    if (!Entry.hw.sendQueue.GET) {
                        Entry.hw.sendQueue.GET = {};
                    }
                    Entry.hw.sendQueue.GET[Entry.Bridge.sensorTypes.DIGITAL] = {
                        port,
                        time: new Date().getTime(),
                    };
                    return DIGITAL ? DIGITAL[port] || 0 : 0;
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.digitalRead(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },

        bridge_get_digital3: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
            ],
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'BridgeGet',
            isnotFor: ['Bridge'],
            func(sprite, script) {
                const { hwModule = {} } = Entry.hw;
                const { name } = hwModule;
                if (name === 'Bridge' || name === 'ArduinoNano') {
                    const port = 2;
                    const DIGITAL = Entry.hw.portData.DIGITAL;
                    if (!Entry.hw.sendQueue.GET) {
                        Entry.hw.sendQueue.GET = {};
                    }
                    Entry.hw.sendQueue.GET[Entry.Bridge.sensorTypes.DIGITAL] = {
                        port,
                        time: new Date().getTime(),
                    };
                    return DIGITAL ? DIGITAL[port] || 0 : 0;
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.digitalRead(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },

        bridge_get_digital4: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
            ],
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'BridgeGet',
            isnotFor: ['Bridge'],
            func(sprite, script) {
                const { hwModule = {} } = Entry.hw;
                const { name } = hwModule;
                if (name === 'Bridge' || name === 'ArduinoNano') {
                    const port = 3;
                    const DIGITAL = Entry.hw.portData.DIGITAL;
                    if (!Entry.hw.sendQueue.GET) {
                        Entry.hw.sendQueue.GET = {};
                    }
                    Entry.hw.sendQueue.GET[Entry.Bridge.sensorTypes.DIGITAL] = {
                        port,
                        time: new Date().getTime(),
                    };
                    return DIGITAL ? DIGITAL[port] || 0 : 0;
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.digitalRead(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },

        bridge_get_digital5: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
            ],
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'BridgeGet',
            isnotFor: ['Bridge'],
            func(sprite, script) {
                const { hwModule = {} } = Entry.hw;
                const { name } = hwModule;
                if (name === 'Bridge' || name === 'ArduinoNano') {
                    const port = 4;
                    const DIGITAL = Entry.hw.portData.DIGITAL;
                    if (!Entry.hw.sendQueue.GET) {
                        Entry.hw.sendQueue.GET = {};
                    }
                    Entry.hw.sendQueue.GET[Entry.Bridge.sensorTypes.DIGITAL] = {
                        port,
                        time: new Date().getTime(),
                    };
                    return DIGITAL ? DIGITAL[port] || 0 : 0;
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.digitalRead(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },

        bridge_get_digital6: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
            ],
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'BridgeGet',
            isnotFor: ['Bridge'],
            func(sprite, script) {
                const { hwModule = {} } = Entry.hw;
                const { name } = hwModule;
                if (name === 'Bridge' || name === 'ArduinoNano') {
                    const port = 5;
                    const DIGITAL = Entry.hw.portData.DIGITAL;
                    if (!Entry.hw.sendQueue.GET) {
                        Entry.hw.sendQueue.GET = {};
                    }
                    Entry.hw.sendQueue.GET[Entry.Bridge.sensorTypes.DIGITAL] = {
                        port,
                        time: new Date().getTime(),
                    };
                    return DIGITAL ? DIGITAL[port] || 0 : 0;
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.digitalRead(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },

        bridge_get_digital7: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
            ],
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'BridgeGet',
            isnotFor: ['Bridge'],
            func(sprite, script) {
                const { hwModule = {} } = Entry.hw;
                const { name } = hwModule;
                if (name === 'Bridge' || name === 'ArduinoNano') {
                    const port = 6;
                    const DIGITAL = Entry.hw.portData.DIGITAL;
                    if (!Entry.hw.sendQueue.GET) {
                        Entry.hw.sendQueue.GET = {};
                    }
                    Entry.hw.sendQueue.GET[Entry.Bridge.sensorTypes.DIGITAL] = {
                        port,
                        time: new Date().getTime(),
                    };
                    return DIGITAL ? DIGITAL[port] || 0 : 0;
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.digitalRead(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },

        bridge_get_digital8: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
            ],
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'BridgeGet',
            isnotFor: ['Bridge'],
            func(sprite, script) {
                const { hwModule = {} } = Entry.hw;
                const { name } = hwModule;
                if (name === 'Bridge' || name === 'ArduinoNano') {
                    const port = 7;
                    const DIGITAL = Entry.hw.portData.DIGITAL;
                    if (!Entry.hw.sendQueue.GET) {
                        Entry.hw.sendQueue.GET = {};
                    }
                    Entry.hw.sendQueue.GET[Entry.Bridge.sensorTypes.DIGITAL] = {
                        port,
                        time: new Date().getTime(),
                    };
                    return DIGITAL ? DIGITAL[port] || 0 : 0;
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.digitalRead(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },

        bridge_get_digital9: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
            ],
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'BridgeGet',
            isnotFor: ['Bridge'],
            func(sprite, script) {
                const { hwModule = {} } = Entry.hw;
                const { name } = hwModule;
                if (name === 'Bridge' || name === 'ArduinoNano') {
                    const port = 8;
                    const DIGITAL = Entry.hw.portData.DIGITAL;
                    if (!Entry.hw.sendQueue.GET) {
                        Entry.hw.sendQueue.GET = {};
                    }
                    Entry.hw.sendQueue.GET[Entry.Bridge.sensorTypes.DIGITAL] = {
                        port,
                        time: new Date().getTime(),
                    };
                    return DIGITAL ? DIGITAL[port] || 0 : 0;
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.digitalRead(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        bridge_get_digital10: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
            ],
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'BridgeGet',
            isnotFor: ['Bridge'],
            func(sprite, script) {
                const { hwModule = {} } = Entry.hw;
                const { name } = hwModule;
                if (name === 'Bridge' || name === 'ArduinoNano') {
                    const port = 9;
                    const DIGITAL = Entry.hw.portData.DIGITAL;
                    if (!Entry.hw.sendQueue.GET) {
                        Entry.hw.sendQueue.GET = {};
                    }
                    Entry.hw.sendQueue.GET[Entry.Bridge.sensorTypes.DIGITAL] = {
                        port,
                        time: new Date().getTime(),
                    };
                    return DIGITAL ? DIGITAL[port] || 0 : 0;
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.digitalRead(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        bridge_get_digital11: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
            ],
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'BridgeGet',
            isnotFor: ['Bridge'],
            func(sprite, script) {
                const { hwModule = {} } = Entry.hw;
                const { name } = hwModule;
                if (name === 'Bridge' || name === 'ArduinoNano') {
                    const port = 10;
                    const DIGITAL = Entry.hw.portData.DIGITAL;
                    if (!Entry.hw.sendQueue.GET) {
                        Entry.hw.sendQueue.GET = {};
                    }
                    Entry.hw.sendQueue.GET[Entry.Bridge.sensorTypes.DIGITAL] = {
                        port,
                        time: new Date().getTime(),
                    };
                    return DIGITAL ? DIGITAL[port] || 0 : 0;
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.digitalRead(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        bridge_get_digital12: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
            ],
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'BridgeGet',
            isnotFor: ['Bridge'],
            func(sprite, script) {
                const { hwModule = {} } = Entry.hw;
                const { name } = hwModule;
                if (name === 'Bridge' || name === 'ArduinoNano') {
                    const port = 11;
                    const DIGITAL = Entry.hw.portData.DIGITAL;
                    if (!Entry.hw.sendQueue.GET) {
                        Entry.hw.sendQueue.GET = {};
                    }
                    Entry.hw.sendQueue.GET[Entry.Bridge.sensorTypes.DIGITAL] = {
                        port,
                        time: new Date().getTime(),
                    };
                    return DIGITAL ? DIGITAL[port] || 0 : 0;
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.digitalRead(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        bridge_get_digital13: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
            ],
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'BridgeGet',
            isnotFor: ['Bridge'],
            func(sprite, script) {
                const { hwModule = {} } = Entry.hw;
                const { name } = hwModule;
                if (name === 'Bridge' || name === 'ArduinoNano') {
                    const port = 12;
                    const DIGITAL = Entry.hw.portData.DIGITAL;
                    if (!Entry.hw.sendQueue.GET) {
                        Entry.hw.sendQueue.GET = {};
                    }
                    Entry.hw.sendQueue.GET[Entry.Bridge.sensorTypes.DIGITAL] = {
                        port,
                        time: new Date().getTime(),
                    };
                    return DIGITAL ? DIGITAL[port] || 0 : 0;
                }
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.digitalRead(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
    };
};

module.exports = Entry.Bridge;
