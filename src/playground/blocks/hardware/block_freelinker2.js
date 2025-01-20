'use strict';

Entry.freelinker = {
    id: '25.2',
    name: 'freelinker2',
    url: 'http://www.koreadigital.com/kr/main.asp',
    imageName: 'FreeLinker2.png',
    title: {
        'ko': '프리링커2',
        'en': 'freelinker2',
    },
    /*setZero: function() {

        Entry.hw.sendQueue['data'] = 0;

        Entry.hw.update();


    },*/
};
Entry.freelinker.setLanguage = () => {
    return {
        ko: {
            template: {
                A_channel: 'A_channel',
                B_channel: 'B_channel',
                C_channel: 'C_channel',
                D_channel: 'D_channel',
            },
        },
        en: {
            template: {
                A_channel: 'A_channel',
                B_channel: 'B_channel',
                C_channel: 'C_channel',
                D_channel: 'D_channel',
            },
        },
    };
};

Entry.freelinker.blockMenuBlocks = [
    //sciencecube start
    'A_channel',
    'B_channel',
    'C_channel',
    'D_channel',
    //sciencecube end
];

Entry.freelinker.getBlocks = () => {
    return {
        A_channel: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [{
                type: 'A_channel',
                text: 'A채널',
            }, ],
            def: {
                type: 'A_channel',
            },
            paramsKeyMap: {
                VALUE: 0,
                sensor: 1,
            },
            events: {},
            class: 'FreeLinker2',
            isNotFor: ['freelinker2'],
            func: function(sprite, script) {
                Entry.hw.update();
                Entry.hw.sendQueue['data'] = 'A';
                var result = Entry.hw.portData['A'];

                result /= 10000;

                if (result < 0) {
                    result = 0;
                }

                return result;
            },
        },
        B_channel: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [{
                type: 'B_channel',
                text: 'B채널',
            }, ],
            def: {
                type: 'B_channel',
            },
            paramsKeyMap: {
                VALUE: 0,
                sensor: 1,
            },
            events: {},
            class: 'FreeLinker2',
            isNotFor: ['freelinker2'],
            func: function(sprite, script) {
                Entry.hw.update();
                Entry.hw.sendQueue['data'] = 'B';
                var result = Entry.hw.portData['B'];

                result /= 10000;

                if (result < 0) {
                    result = 0;
                }

                return result;
            },
        },
        C_channel: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [{
                type: 'C_channel',
                text: 'C채널',
            }, ],
            def: {
                type: 'C_channel',
            },
            paramsKeyMap: {
                VALUE: 0,
                sensor: 1,
            },
            events: {},
            class: 'FreeLinker2',
            isNotFor: ['freelinker2'],
            func: function(sprite, script) {
                Entry.hw.update();
                Entry.hw.sendQueue['data'] = 'C';
                var result = Entry.hw.portData['C'];

                result /= 10000;

                if (result < 0) {
                    result = 0;
                }

                return result;
            },
        },
        D_channel: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [{
                type: 'D_channel',
                text: 'D채널',
            }, ],
            def: {
                type: 'D_channel',
            },
            paramsKeyMap: {
                VALUE: 0,
                sensor: 1,
            },
            events: {},
            class: 'FreeLinker2',
            isNotFor: ['freelinker2'],
            func: function(sprite, script) {
                Entry.hw.update();
                Entry.hw.sendQueue['data'] = 'D';
                var result = Entry.hw.portData['D'];

                result /= 10000;

                if (result < 0) {
                    result = 0;
                }

                return result;
            },
        },
    };
};

module.exports = Entry.freelinker;