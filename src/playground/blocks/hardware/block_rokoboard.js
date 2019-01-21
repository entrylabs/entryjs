'use strict';

Entry.rokoboard = {
    id: '13.1',
    name: 'rokoboard',
    url: 'http://www.r-steam.com/',
    imageName: 'rokoboard.png',
    title: {
        ko: '로코보드',
        en: 'rokoboard',
    },
    setZero: function() {
        Entry.hw.sendQueue.readablePorts = [];
        for (var port = 0; port < 20; port++) {
            Entry.hw.sendQueue[port] = 0;
            Entry.hw.sendQueue.readablePorts.push(port);
        }
        Entry.hw.update();
    },
    monitorTemplate: {
        imgPath: 'hw/arduino.png',
        width: 605,
        height: 434,
        listPorts: {
            '2': {
                name: Lang.Hw.port_en + ' 2 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '3': {
                name: Lang.Hw.port_en + ' 3 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '4': {
                name: Lang.Hw.port_en + ' 4 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '5': {
                name: Lang.Hw.port_en + ' 5 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '6': {
                name: Lang.Hw.port_en + ' 6 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '7': {
                name: Lang.Hw.port_en + ' 7 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '8': {
                name: Lang.Hw.port_en + ' 8 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '9': {
                name: Lang.Hw.port_en + ' 9 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '10': {
                name: Lang.Hw.port_en + ' 10 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '11': {
                name: Lang.Hw.port_en + ' 11 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '12': {
                name: Lang.Hw.port_en + ' 12 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            '13': {
                name: Lang.Hw.port_en + ' 13 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            a0: {
                name: Lang.Hw.port_en + ' A0 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            a1: {
                name: Lang.Hw.port_en + ' A1 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            a2: {
                name: Lang.Hw.port_en + ' A2 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            a3: {
                name: Lang.Hw.port_en + ' A3 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            a4: {
                name: Lang.Hw.port_en + ' A4 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            a5: {
                name: Lang.Hw.port_en + ' A5 ' + Lang.Hw.port_ko,
                type: 'input',
                pos: { x: 0, y: 0 },
            },
        },
        mode: 'both',
    },
};

Entry.rokoboard.blockMenuBlocks = [
    //rokoboard Blocks
    'rokoboard_get_sensor_value_by_name',
    'rokoboard_is_button_pressed',
];

Entry.rokoboard.getBlocks = function() {
    return {
        //region rokoboard 로코보드
        // rokoboard Implementation
        rokoboard_get_sensor_value_by_name: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.rokoboard_sensor_name_1, '1'],
                        [Lang.Blocks.rokoboard_sensor_name_0, '0'],
                        [Lang.Blocks.rokoboard_sensor_name_2, '2'],
                        [Lang.Blocks.rokoboard_sensor_name_3, '3'],
                        [Lang.Blocks.rokoboard_sensor_name_4, '4'],
                        [Lang.Blocks.rokoboard_sensor_name_5, '5'],
                        [Lang.Blocks.rokoboard_sensor_name_6, '6'],
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
                type: 'rokoboard_get_sensor_value_by_name',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'rokoboard_sensor',
            isNotFor: ['rokoboard'],
            func: function(sprite, script) {
                var port = script.getField('PORT', script);
                var ANALOG = Entry.hw.portData.ANALOG;
                return ANALOG ? ANALOG[port] || 0 : 0;
            },
        },
        rokoboard_is_button_pressed: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Text',
                    text: Lang.Blocks.rokoboard_string_1,
                    color: '#fff',
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'rokoboard_is_button_pressed',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'rokoboard_sensor',
            isNotFor: ['rokoboard'],
            func: function(sprite, script) {
                var port = 7;
                var ANALOG = Entry.hw.portData.ANALOG;
                return ANALOG ? ANALOG[port] < 1 : false;
            },
        },
        //endregion rokoboard 로코보드
    };
};

module.exports = Entry.rokoboard;
