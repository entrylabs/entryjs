'use strict';

Entry.Timbo = {
    id: '6A.1',
    name: 'Timbo',

    title: {
        ko: '팀보 커뮤니케이션 블록',
        en: 'Timbo Communication Block',
    },
    setZero() {
        Entry.hw.sendQueue.readablePorts = [];
        for (let port = 0; port < 20; port++) {
            Entry.hw.sendQueue[port] = 0;
            Entry.hw.sendQueue.readablePorts.push(port);
        }
        Entry.hw.update();
    },
};

Entry.Timbo.setLanguage = function () {
    return {
        ko: {
            template: {
                timbo_queen_play: '퀸의 %1 켜기',
                timbo_queen_stop: '퀸의 동작 끄기',
                timbo_motion_play: '모션 %1의 %2 켜기',
                timbo_motion_stop: '모션 %1의 동작 끄기',
                timbo_check_queen: '퀸의 동작여부 체크',
                timbo_check_motion: '모션 %1의 동작여부 체크',
            },
            Device: {
                timbo: '팀보',
            },
            Menus: {
                timbo: '팀보',
            },
            Helper: {
                timbo_queen_play: '퀸의 동작을 선택하여 켭니다.',
                timbo_queen_stop: '퀸의 동작을 멈춥니다.',
                timbo_motion_play: '지정한 모션 번호와 동작 타입으로 모션을 실행합니다.',
                timbo_motion_stop: '지정한 모션 번호의 동작을 멈춥니다.',
                timbo_check_queen: '퀸이 동작 중인지 확인합니다.',
                timbo_check_motion: '지정한 모션 번호가 동작 중인지 확인합니다.',
            },
        },
        en: {
            template: {
                timbo_queen_play: 'Turn on Queen %1',
                timbo_queen_stop: 'Turn off Queen action',
                timbo_motion_play: 'Turn on Motion %1 of %2',
                timbo_motion_stop: 'Turn off Motion %1 action',
                timbo_check_queen: 'Check if Queen is operating',
                timbo_check_motion: 'Check if Motion %1 is operating',
            },
            Device: {
                timbo: 'Timbo',
            },
            Menus: {
                timbo: 'Timbo',
            },
            Helper: {
                timbo_queen_play: 'Turn on selected Queen action.',
                timbo_queen_stop: 'Stop all Queen actions.',
                timbo_motion_play: 'Execute specific Motion with given type.',
                timbo_motion_stop: 'Stop Motion action of given ID.',
                timbo_check_queen: 'Check if Queen is currently operating.',
                timbo_check_motion: 'Check if selected Motion is currently operating.',
            },
        },
    };
};

Entry.Timbo.blockMenuBlocks = [
    'timbo_queen_play',
    'timbo_queen_stop',
    'timbo_motion_play',
    'timbo_motion_stop',
    'timbo_check_queen',
    'timbo_check_motion',
];

Entry.Timbo.getBlocks = function () {
    return {
        timbo_queen_play: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            template: Lang.template.timbo_queen_play,
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['동작', '1'],
                        ['반복동작', '2'],
                        ['한번동작', '3'],
                        ['거꾸로동작', '4'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            paramsKeyMap: {
                ACTION: 0,
            },
            class: 'timbo',
            isNotFor: ['Timbo'],
            func(sprite, script) {
                const action = Number(script.getField('ACTION'));
                Entry.hw.setDigitalPortValue(1, action);
                return script.callReturn();
            },
        },
        timbo_queen_stop: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            template: Lang.template.timbo_queen_stop,
            params: [],
            class: 'timbo',
            isNotFor: ['Timbo'],
            func(sprite, script) {
                Entry.hw.setDigitalPortValue(1, 5);
                return script.callReturn();
            },
        },
        timbo_motion_play: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', '1'],
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['5', '5'],
                        ['6', '6'],
                        ['7', '7'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['동작', '1'],
                        ['반복동작', '2'],
                        ['한번동작', '3'],
                        ['거꾸로동작', '4'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null, null],
                type: 'timbo_motion_play',
            },
            paramsKeyMap: {
                PORT: 0,
                ACTION: 1,
            },
            class: 'timbo_motion',
            isNotFor: ['Timbo'],
            func(sprite, script) {
                const port = Number(script.getField('PORT'));
                const action = Number(script.getField('ACTION'));
                Entry.hw.setDigitalPortValue(port + 1, action);
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Arduino.pin_digital(%1, 1)',
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
        timbo_motion_stop: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', '1'],
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['5', '5'],
                        ['6', '6'],
                        ['7', '7'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'timbo_motion_stop',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'timbo_motion',
            isNotFor: ['Timbo'],
            func(sprite, script) {
                const port = Number(script.getField('PORT'));
                Entry.hw.setDigitalPortValue(port + 1, 5);
                return script.callReturn();
            },
        },

        timbo_check_motion: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', '1'],
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['5', '5'],
                        ['6', '6'],
                        ['7', '7'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'timbo_check_motion',
            },
            paramsKeyMap: {
                PORT: 1,
            },
            class: 'timbo_motion_value',
            isNotFor: ['Timbo'],
            func(sprite, script) {
                const port = Number(script.getField('PORT'));
                return Entry.hw.getDigitalPortValue(port + 1);
            },
        },

        timbo_check_queen: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [],
                type: 'timbo_check_queen',
            },

            class: 'timbo_motion_value',
            isNotFor: ['Timbo'],
            func(sprite, script) {
                return Entry.hw.getDigitalPortValue(1);
            },
        },
    };
};

module.exports = Entry.Timbo;
