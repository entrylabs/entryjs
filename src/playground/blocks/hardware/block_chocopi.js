'use strict';

Entry.Chocopi = {
    id: '14.1',
    name: 'chocopi',
    url: 'http://chocopi.org/entry/',
    imageName: 'chocopi.png',
    title: {
        ko: '초코파이보드',
        en: 'ChocoPi',
    },
    p: {},
    ev: {},
    blocks: [],
    setZero: function() {},
    getport: function(id, port) {
        if (!this.blocks) return -1;
        if (this.blocks[port] && this.blocks[port].id == id) return port;
        for (var p in this.blocks) if (this.blocks[port] && this.blocks[p].id == id) return p;
        return -1;
    },
    connected: false,
    portlist: [
        [Lang.Blocks.chocopi_port + '1', 0],
        [Lang.Blocks.chocopi_port + '2', 1],
        [Lang.Blocks.chocopi_port + '3', 2],
        [Lang.Blocks.chocopi_port + '4', 3],
        [Lang.Blocks.chocopi_port + '5', 4],
        [Lang.Blocks.chocopi_port + '6', 5],
        [Lang.Blocks.chocopi_port + '7', 6],
        [Lang.Blocks.chocopi_port + '8', 7],
        ['BLE1', 8],
        ['BLE2', 9],
        ['BLE3', 10],
        ['BLE4', 11],
        ['BLE5', 12],
        ['BLE6', 13],
        ['BLE7', 14],
        ['BLE8', 15],
    ],
    dataHandler: function(data) {
        if (!Entry.hw.sendQueue.data) {
            this.connected = true;
            Entry.hw.sendQueue.init = true;
            Entry.hw.update();
            delete Entry.hw.sendQueue.init;
            Entry.hw.sendQueue.data = {};
        }
        if (data['d']) {
            for (var i in data['d']) {
                this.p[i] = data['d'][i];
            }
        }
        if (data['ev']) {
            for (var i in data['ev']) {
                this.ev[i] = data['ev'][i];
                Entry.engine.fireEvent(this.blocks[i].name + '14');
            }
        }
        if (data['bl']) {
            this.blocks = data['bl'];
        }
    },
};
Entry.Chocopi.blockMenuBlocks = [
    'chocopi_sensor',
    'chocopi_touch_event',
    'chocopi_touch_status',
    'chocopi_touch_value',
    'chocopi_control_event',
    'chocopi_control_joystick',
    'chocopi_control_button',
    'chocopi_motion_photogate_event',
    'chocopi_motion_photogate_time',
    'chocopi_motion_photogate_status',
    'chocopi_motion_value',
    'chocopi_led',
    'chocopi_dc_motor',
    'chocopi_servo_motor',
    'chocopi_map_range',
];
Entry.Chocopi.getBlocks = function () {
    return {
        //region chocopi 초코파이
        chocopi_sensor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.chocopi_port + '1', 0],
                        [Lang.Blocks.chocopi_port + '2', 1],
                        [Lang.Blocks.chocopi_port + '3', 2],
                        [Lang.Blocks.chocopi_port + '4', 3],
                        [Lang.Blocks.chocopi_port + '5', 4],
                        [Lang.Blocks.chocopi_port + '6', 5],
                        [Lang.Blocks.chocopi_port + '7', 6],
                        [Lang.Blocks.chocopi_port + '8', 7],
                        ['BLE1', 8],
                        ['BLE2', 9],
                        ['BLE3', 10],
                        ['BLE4', 11],
                        ['BLE5', 12],
                        ['BLE6', 13],
                        ['BLE7', 14],
                        ['BLE8', 15],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Hw.temp, 'temp'],
                        [Lang.Hw.humidity, 'humi'],
                        [Lang.Hw.light, 'light'],
                        [Lang.Hw.analog + '1', '0'],
                        [Lang.Hw.analog + '2', '1'],
                        [Lang.Hw.analog + '3', '2'],
                    ],
                    value: 'temp',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: { params: [], type: 'chocopi_sensor' },
            paramsKeyMap: { port: 0, sensor: 1 },
            class: 'chocopi_sensor',
            isNotFor: ['chocopi'],
            func: function(sprite, script) {
                var port = Entry.Chocopi.getport(8, script.getField('port'));
                var name = script.getField('sensor');
                if (port == -1) return 0;
                return Entry.Chocopi.p[port][name];
            },
            syntax: { js: [], py: ['Chocopi.sensor(%1, %2)'] },
        },
        chocopi_touch_event: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_event',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/start_icon_hardware.svg',
                    size: 14,
                    position: { x: 0, y: -2 },
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.chocopi_port + '1', 0],
                        [Lang.Blocks.chocopi_port + '2', 1],
                        [Lang.Blocks.chocopi_port + '3', 2],
                        [Lang.Blocks.chocopi_port + '4', 3],
                        [Lang.Blocks.chocopi_port + '5', 4],
                        [Lang.Blocks.chocopi_port + '6', 5],
                        [Lang.Blocks.chocopi_port + '7', 6],
                        [Lang.Blocks.chocopi_port + '8', 7],
                        ['BLE1', 8],
                        ['BLE2', 9],
                        ['BLE3', 10],
                        ['BLE4', 11],
                        ['BLE5', 12],
                        ['BLE6', 13],
                        ['BLE7', 14],
                        ['BLE8', 15],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [1, 0],
                        [2, 1],
                        [3, 2],
                        [4, 3],
                        [5, 4],
                        [6, 5],
                        [7, 6],
                        [8, 7],
                        [9, 8],
                        [10, 9],
                        [11, 10],
                        [12, 11],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.chocopi_touch_event_touch, 1],
                        [Lang.Blocks.chocopi_touch_event_untouch, 0],
                    ],
                    value: 1,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: { params: [], type: 'chocopi_touch_event' },
            paramsKeyMap: { port: 1, id: 2, status: 3 },
            class: 'chocopi_touch',
            isNotFor: ['chocopi'],
            event: 'touch14',
            func: function(sprite, script) {
                var port = Entry.Chocopi.getport(9, script.getField('port'));
                if (port == -1) return this.die();
                var id = script.getField('id');
                var status = script.getField('status');
                var ev = Entry.Chocopi.ev[port];
                if (((ev.id >> id) & 1) != 1 || ((Entry.Chocopi.p[port].ts >> id) & 1) != status) {
                    return this.die();
                }
                return script.callReturn();
            },
            syntax: { js: [], py: ['def on_chocopi_touch(%2, %3, %4 ):'] },
        },
        chocopi_touch_status: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.chocopi_port + '1', 0],
                        [Lang.Blocks.chocopi_port + '2', 1],
                        [Lang.Blocks.chocopi_port + '3', 2],
                        [Lang.Blocks.chocopi_port + '4', 3],
                        [Lang.Blocks.chocopi_port + '5', 4],
                        [Lang.Blocks.chocopi_port + '6', 5],
                        [Lang.Blocks.chocopi_port + '7', 6],
                        [Lang.Blocks.chocopi_port + '8', 7],
                        ['BLE1', 8],
                        ['BLE2', 9],
                        ['BLE3', 10],
                        ['BLE4', 11],
                        ['BLE5', 12],
                        ['BLE6', 13],
                        ['BLE7', 14],
                        ['BLE8', 15],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [1, 0],
                        [2, 1],
                        [3, 2],
                        [4, 3],
                        [5, 4],
                        [6, 5],
                        [7, 6],
                        [8, 7],
                        [9, 8],
                        [10, 9],
                        [11, 10],
                        [12, 11],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: { params: [], type: 'chocopi_touch_status' },
            paramsKeyMap: { port: 0, sensor: 1 },
            class: 'chocopi_touch',
            isNotFor: ['chocopi'],
            func: function(sprite, script) {
                var port = Entry.Chocopi.getport(9, script.getField('port'));
                var sensor = script.getField('sensor');
                if (port == -1) return false;
                if(!Entry.Chocopi.p[port])Entry.Chocopi.p[port] = {ts:0, tv:[]}
                return (Entry.Chocopi.p[port].ts & (1 << sensor)) > 0;
            },
            syntax: { js: [], py: ['Chocopi.touchStatus(%1, %2)'] },
        },
        chocopi_touch_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.chocopi_port + '1', 0],
                        [Lang.Blocks.chocopi_port + '2', 1],
                        [Lang.Blocks.chocopi_port + '3', 2],
                        [Lang.Blocks.chocopi_port + '4', 3],
                        [Lang.Blocks.chocopi_port + '5', 4],
                        [Lang.Blocks.chocopi_port + '6', 5],
                        [Lang.Blocks.chocopi_port + '7', 6],
                        [Lang.Blocks.chocopi_port + '8', 7],
                        ['BLE1', 8],
                        ['BLE2', 9],
                        ['BLE3', 10],
                        ['BLE4', 11],
                        ['BLE5', 12],
                        ['BLE6', 13],
                        ['BLE7', 14],
                        ['BLE8', 15],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [1, 0],
                        [2, 1],
                        [3, 2],
                        [4, 3],
                        [5, 4],
                        [6, 5],
                        [7, 6],
                        [8, 7],
                        [9, 8],
                        [10, 9],
                        [11, 10],
                        [12, 11],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: { params: [], type: 'chocopi_touch_value' },
            paramsKeyMap: { port: 0, sensor: 1 },
            class: 'chocopi_touch',
            isNotFor: ['chocopi'],
            func: function(sprite, script) {
                var port = Entry.Chocopi.getport(9, script.getField('port'));
                if (port == -1) return false;
                var sensor = script.getField('sensor');
                if(!Entry.Chocopi.p[port])Entry.Chocopi.p[port] = {ts:0, tv:[]}
                return Entry.Chocopi.p[port].tv[sensor];
            },
            syntax: { js: [], py: ['Chocopi.touchValue(%1, %2)'] },
        },
        chocopi_control_event: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_event',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/start_icon_hardware.svg',
                    size: 14,
                    position: { x: 0, y: -2 },
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.chocopi_port + '1', 0],
                        [Lang.Blocks.chocopi_port + '2', 1],
                        [Lang.Blocks.chocopi_port + '3', 2],
                        [Lang.Blocks.chocopi_port + '4', 3],
                        [Lang.Blocks.chocopi_port + '5', 4],
                        [Lang.Blocks.chocopi_port + '6', 5],
                        [Lang.Blocks.chocopi_port + '7', 6],
                        [Lang.Blocks.chocopi_port + '8', 7],
                        ['BLE1', 8],
                        ['BLE2', 9],
                        ['BLE3', 10],
                        ['BLE4', 11],
                        ['BLE5', 12],
                        ['BLE6', 13],
                        ['BLE7', 14],
                        ['BLE8', 15],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Hw.button + '1', 0],
                        [Lang.Hw.button + '2', 1],
                        [Lang.Hw.button + '3', 2],
                        [Lang.Hw.button + '4', 3],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.chocopi_control_event_pressed, 1],
                        [Lang.Blocks.chocopi_control_event_released, 0],
                    ],
                    value: 1,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: { params: [], type: 'chocopi_control_event' },
            paramsKeyMap: { port: 1, id: 2, status: 3 },
            class: 'chocopi_control',
            isNotFor: ['chocopi'],
            event: 'control14',
            func: function(sprite, script) {
                var port = Entry.Chocopi.getport(10, script.getField('port'));
                if (port == -1) return this.die();
                var id = script.getField('id');
                var status = script.getField('status');
                var ev = Entry.Chocopi.ev[port];
                if (((ev.id >> (4 - id)) & 1) != 1 || ev.btn[id] != status) {
                    return this.die();
                }
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: ['def on_chocopi_control_button(%2, %3, %4 ):'],
            },
        },
        chocopi_control_joystick: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.chocopi_port + '1', 0],
                        [Lang.Blocks.chocopi_port + '2', 1],
                        [Lang.Blocks.chocopi_port + '3', 2],
                        [Lang.Blocks.chocopi_port + '4', 3],
                        [Lang.Blocks.chocopi_port + '5', 4],
                        [Lang.Blocks.chocopi_port + '6', 5],
                        [Lang.Blocks.chocopi_port + '7', 6],
                        [Lang.Blocks.chocopi_port + '8', 7],
                        ['BLE1', 8],
                        ['BLE2', 9],
                        ['BLE3', 10],
                        ['BLE4', 11],
                        ['BLE5', 12],
                        ['BLE6', 13],
                        ['BLE7', 14],
                        ['BLE8', 15],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.chocopi_joystick_X, 0],
                        [Lang.Blocks.chocopi_joystick_Y, 1],
                        [Lang.Blocks.chocopi_pot, 2],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: { params: [null], type: 'chocopi_control_joystick' },
            paramsKeyMap: { port: 0, sensor: 1 },
            class: 'chocopi_control',
            isNotFor: ['chocopi'],
            func: function(sprite, script) {
                var port = Entry.Chocopi.getport(10, script.getField('port'));
                if (port == -1) return false;
                var sensor = script.getField('sensor');
                if(!Entry.Chocopi.p[port])Entry.Chocopi.p[port] = {xyp:[]}
                return Entry.Chocopi.p[port].xyp[sensor];
            },
            syntax: { js: [], py: ['Chocopi.joystick(%1, %2)'] },
        },
        chocopi_control_button: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.chocopi_port + '1', 0],
                        [Lang.Blocks.chocopi_port + '2', 1],
                        [Lang.Blocks.chocopi_port + '3', 2],
                        [Lang.Blocks.chocopi_port + '4', 3],
                        [Lang.Blocks.chocopi_port + '5', 4],
                        [Lang.Blocks.chocopi_port + '6', 5],
                        [Lang.Blocks.chocopi_port + '7', 6],
                        [Lang.Blocks.chocopi_port + '8', 7],
                        ['BLE1', 8],
                        ['BLE2', 9],
                        ['BLE3', 10],
                        ['BLE4', 11],
                        ['BLE5', 12],
                        ['BLE6', 13],
                        ['BLE7', 14],
                        ['BLE8', 15],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Hw.button + '1', 0],
                        [Lang.Hw.button + '2', 1],
                        [Lang.Hw.button + '3', 2],
                        [Lang.Hw.button + '4', 3],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: { params: [null], type: 'chocopi_control_button' },
            paramsKeyMap: { port: 0, sensor: 1 },
            class: 'chocopi_control',
            isNotFor: ['chocopi'],
            func: function(sprite, script) {
                var port = Entry.Chocopi.getport(10, script.getField('port'));
                if (port == -1) return false;
                var sensor = script.getField('sensor');
                if (!Entry.Chocopi.ev[port]) return 0;
                return Entry.Chocopi.ev[port].btn[sensor];
            },
            syntax: { js: [], py: ['Chocopi.button(%1, %2)'] },
        },
        chocopi_motion_photogate_time: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.chocopi_port + '1', 0],
                        [Lang.Blocks.chocopi_port + '2', 1],
                        [Lang.Blocks.chocopi_port + '3', 2],
                        [Lang.Blocks.chocopi_port + '4', 3],
                        [Lang.Blocks.chocopi_port + '5', 4],
                        [Lang.Blocks.chocopi_port + '6', 5],
                        [Lang.Blocks.chocopi_port + '7', 6],
                        [Lang.Blocks.chocopi_port + '8', 7],
                        ['BLE1', 8],
                        ['BLE2', 9],
                        ['BLE3', 10],
                        ['BLE4', 11],
                        ['BLE5', 12],
                        ['BLE6', 13],
                        ['BLE7', 14],
                        ['BLE8', 15],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [[1, 0], [2, 1]],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.chocopi_motion_photogate_time_unblocked, 0],
                        [Lang.Blocks.chocopi_motion_photogate_time_blocked, 1],
                    ],
                    value: 1,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: { params: [null], type: 'chocopi_motion_photogate_time' },
            paramsKeyMap: { port: 0, sensor: 1, action: 2 },
            class: 'chocopi_motion',
            isNotFor: ['chocopi'],
            func: function(sprite, script) {
                var port = Entry.Chocopi.getport(11, script.getField('port'));
                if (port == -1) return 0;
                var sensor = script.getField('sensor');
                var action = script.getField('action');
                if (!Entry.Chocopi.ev[port]) return 0;
                return Entry.Chocopi.ev[port].time[sensor][action];
            },
            syntax: { js: [], py: ['Chocopi.photogateTime(%1, %2, %3)'] },
        },
        chocopi_motion_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.chocopi_port + '1', 0],
                        [Lang.Blocks.chocopi_port + '2', 1],
                        [Lang.Blocks.chocopi_port + '3', 2],
                        [Lang.Blocks.chocopi_port + '4', 3],
                        [Lang.Blocks.chocopi_port + '5', 4],
                        [Lang.Blocks.chocopi_port + '6', 5],
                        [Lang.Blocks.chocopi_port + '7', 6],
                        [Lang.Blocks.chocopi_port + '8', 7],
                        ['BLE1', 8],
                        ['BLE2', 9],
                        ['BLE3', 10],
                        ['BLE4', 11],
                        ['BLE5', 12],
                        ['BLE6', 13],
                        ['BLE7', 14],
                        ['BLE8', 15],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Hw.IR + ' 1', 0],
                        [Lang.Hw.IR + ' 2', 1],
                        [Lang.Hw.IR + ' 3', 2],
                        [Lang.Blocks.chocopi_motion_angle_x, 9],
                        [Lang.Blocks.chocopi_motion_angle_y, 10],
                        [Lang.Blocks.chocopi_motion_angle_z, 11],
                        [Lang.Hw.acceleration + 'X', 3],
                        [Lang.Hw.acceleration + 'Y', 4],
                        [Lang.Hw.acceleration + 'Z', 5],
                        [Lang.Hw.angular_acceleration + 'U', 6],
                        [Lang.Hw.angular_acceleration + 'V', 7],
                        [Lang.Hw.angular_acceleration + 'W', 8],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: { params: [null], type: 'chocopi_motion_value' },
            paramsKeyMap: { port: 0, sensor: 1 },
            class: 'chocopi_motion',
            isNotFor: ['chocopi'],
            func: function(sprite, script) {
                var port = Entry.Chocopi.getport(11, script.getField('port'));
                if (port == -1) return 0;
                var sensor = script.getField('sensor');
                if(!Entry.Chocopi.p[port])Entry.Chocopi.p[port] = {s:[]}
                var v = Entry.Chocopi.p[port].s;
                if (sensor < 9) return v[sensor];
                switch (sensor) {
                    case 9:
                        return Math.atan2(v[3], v[5]) * 180 / Math.PI;
                    case 10:
                        return Math.atan2(v[4], v[5]) * 180 / Math.PI;
                    case 11:
                        return Math.atan2(v[3], v[4]) * 180 / Math.PI;
                }
                return 0;
            },
            syntax: { js: [], py: ['Chocopi.motionValue(%1, %2)'] },
        },

        chocopi_motion_photogate_status: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.chocopi_port + '1', 0],
                        [Lang.Blocks.chocopi_port + '2', 1],
                        [Lang.Blocks.chocopi_port + '3', 2],
                        [Lang.Blocks.chocopi_port + '4', 3],
                        [Lang.Blocks.chocopi_port + '5', 4],
                        [Lang.Blocks.chocopi_port + '6', 5],
                        [Lang.Blocks.chocopi_port + '7', 6],
                        [Lang.Blocks.chocopi_port + '8', 7],
                        ['BLE1', 8],
                        ['BLE2', 9],
                        ['BLE3', 10],
                        ['BLE4', 11],
                        ['BLE5', 12],
                        ['BLE6', 13],
                        ['BLE7', 14],
                        ['BLE8', 15],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [['1', 0], ['2', 1]],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: { params: [null], type: 'chocopi_motion_photogate_status' },
            paramsKeyMap: { port: 0, sensor: 1 },
            class: 'chocopi_motion',
            isNotFor: ['chocopi'],
            func: function(sprite, script) {
                var port = Entry.Chocopi.getport(11, script.getField('port'));
                if (port == -1) return 0;
                var sensor = script.getField('sensor');
                if (!Entry.Chocopi.ev[port]) return 0;
                return Entry.Chocopi.ev[port].pg[sensor];
            },
            syntax: { js: [], py: ['Chocopi.motionPhotogateStatus(%1, %2)'] },
        },
        chocopi_motion_photogate_event: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_event',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/start_icon_hardware.svg',
                    size: 14,
                    position: { x: 0, y: -2 },
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.chocopi_port + '1', 0],
                        [Lang.Blocks.chocopi_port + '2', 1],
                        [Lang.Blocks.chocopi_port + '3', 2],
                        [Lang.Blocks.chocopi_port + '4', 3],
                        [Lang.Blocks.chocopi_port + '5', 4],
                        [Lang.Blocks.chocopi_port + '6', 5],
                        [Lang.Blocks.chocopi_port + '7', 6],
                        [Lang.Blocks.chocopi_port + '8', 7],
                        ['BLE1', 8],
                        ['BLE2', 9],
                        ['BLE3', 10],
                        ['BLE4', 11],
                        ['BLE5', 12],
                        ['BLE6', 13],
                        ['BLE7', 14],
                        ['BLE8', 15],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [1, 0],
                        [2, 1],
                        [3, 2],
                        [4, 3],
                        [5, 4],
                        [6, 5],
                        [7, 6],
                        [8, 7],
                        [9, 8],
                        [10, 9],
                        [11, 10],
                        [12, 11],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.chocopi_motion_photogate_event_unblocked, 0],
                        [Lang.Blocks.chocopi_motion_photogate_event_blocked, 1],
                    ],
                    value: 1,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: { params: [], type: 'chocopi_motion_photogate_event' },
            paramsKeyMap: { port: 1, id: 2, status: 3 },
            class: 'chocopi_motion',
            isNotFor: ['chocopi'],
            event: 'motion14',
            func: function(sprite, script) {
                var port = Entry.Chocopi.getport(11, script.getField('port'));
                if (port == -1) return this.die();
                var id = script.getField('id');
                var status = script.getField('status');
                if (Entry.Chocopi.ev[port].pg[id] != status) {
                    return this.die();
                }

                return script.callReturn();
            },
            syntax: { js: [], py: ['def on_chocopi_photogate(%2, %3, %4 ):'] },
        },
        chocopi_led: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.chocopi_port + '1', 0],
                        [Lang.Blocks.chocopi_port + '2', 1],
                        [Lang.Blocks.chocopi_port + '3', 2],
                        [Lang.Blocks.chocopi_port + '4', 3],
                        [Lang.Blocks.chocopi_port + '5', 4],
                        [Lang.Blocks.chocopi_port + '6', 5],
                        [Lang.Blocks.chocopi_port + '7', 6],
                        [Lang.Blocks.chocopi_port + '8', 7],
                        ['BLE1', 8],
                        ['BLE2', 9],
                        ['BLE3', 10],
                        ['BLE4', 11],
                        ['BLE5', 12],
                        ['BLE6', 13],
                        ['BLE7', 14],
                        ['BLE8', 15],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            def: {
                params: [
                    null,
                    { type: 'number', params: [1] },
                    { type: 'number', params: [0] },
                    { type: 'number', params: [0] },
                    { type: 'number', params: [0] },
                ],
                type: 'chocopi_led',
            },
            paramsKeyMap: { port: 0, l: 1, r: 2, g: 3, b: 4 },
            class: 'chocopi_output',
            isNotFor: ['chocopi'],
            func: function(sprite, script) {
                var port = Entry.Chocopi.getport(12, script.getField('port'));
                if (port == -1) return script.callReturn();
                var l = script.getNumberValue('l');
                var r = script.getNumberValue('r');
                var g = script.getNumberValue('g');
                var b = script.getNumberValue('b');
                if(!Entry.hw.sendQueue.data)
                    Entry.hw.sendQueue.data = {};
                Entry.hw.sendQueue.data[port] = [l, r, g, b];
                Entry.hw.update();
                delete Entry.hw.sendQueue.data[port];
                return script.callReturn();
            },
            syntax: { js: [], py: ['Chocopi.LED(%1, %2, %3, %4, %5)'] },
        },
        chocopi_dc_motor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.chocopi_port + '1', 0],
                        [Lang.Blocks.chocopi_port + '2', 1],
                        [Lang.Blocks.chocopi_port + '3', 2],
                        [Lang.Blocks.chocopi_port + '4', 3],
                        [Lang.Blocks.chocopi_port + '5', 4],
                        [Lang.Blocks.chocopi_port + '6', 5],
                        [Lang.Blocks.chocopi_port + '7', 6],
                        [Lang.Blocks.chocopi_port + '8', 7],
                        ['BLE1', 8],
                        ['BLE2', 9],
                        ['BLE3', 10],
                        ['BLE4', 11],
                        ['BLE5', 12],
                        ['BLE6', 13],
                        ['BLE7', 14],
                        ['BLE8', 15],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [['1', 0], ['2', 1]],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Block', accept: 'string' },
                {
                    type: 'Dropdown',
                    options: [[Lang.General.clock, 0], [Lang.General.counter_clock, 1]],
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
            def: {
                params: [null, null, { type: 'number', params: [0] }],
                type: 'chocopi_dc_motor',
            },
            paramsKeyMap: { port: 0, id: 1, power: 2, direction: 3 },
            class: 'chocopi_output',
            isNotFor: ['chocopi'],
            func: function(sprite, script) {
                var port = Entry.Chocopi.getport(14, script.getField('port'));
                if (port == -1) return script.callReturn();
                var id = script.getField('id');
                var s = script.getNumberValue('power');
                var d = script.getField('direction');
                if(!Entry.hw.sendQueue.data)
                    Entry.hw.sendQueue.data = {};
                Entry.hw.sendQueue.data[port] = [id, s, d];
                Entry.hw.update();
                delete Entry.hw.sendQueue.data[port];
                return script.callReturn();
            },
            syntax: { js: [], py: ['Chocopi.DCmotor(%1, %2, %3, %4)'] },
        },
        chocopi_servo_motor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.chocopi_port + '1', 0],
                        [Lang.Blocks.chocopi_port + '2', 1],
                        [Lang.Blocks.chocopi_port + '3', 2],
                        [Lang.Blocks.chocopi_port + '4', 3],
                        [Lang.Blocks.chocopi_port + '5', 4],
                        [Lang.Blocks.chocopi_port + '6', 5],
                        [Lang.Blocks.chocopi_port + '7', 6],
                        [Lang.Blocks.chocopi_port + '8', 7],
                        ['BLE1', 8],
                        ['BLE2', 9],
                        ['BLE3', 10],
                        ['BLE4', 11],
                        ['BLE5', 12],
                        ['BLE6', 13],
                        ['BLE7', 14],
                        ['BLE8', 15],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [['1', 0], ['2', 1], ['3', 2], ['4', 3]],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Block', accept: 'string' },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            def: {
                params: [null, null, { type: 'number', params: [90] }],
                type: 'chocopi_servo_motor',
            },
            paramsKeyMap: { port: 0, id: 1, angle: 2 },
            class: 'chocopi_output',
            isNotFor: ['chocopi'],
            func: function(sprite, script) {
                var port = Entry.Chocopi.getport(15, script.getField('port'));
                if (port == -1) return script.callReturn();
                var id = script.getField('id');
                var a = script.getNumberValue('angle');
                if(!Entry.hw.sendQueue.data)
                Entry.hw.sendQueue.data = {};                
                Entry.hw.sendQueue.data[port] = [id, a];
                Entry.hw.update();
                delete Entry.hw.sendQueue.data[port];
                return script.callReturn();
            },
            syntax: { js: [], py: ['Chocopi.servo(%1, %2, %3)'] },
        },        
        chocopi_map_range: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
            ],
            def: {
                params: [
                    { type: 'number', params: [0] },
                    { type: 'number', params: [0] },
                    { type: 'number', params: [4096] },
                    { type: 'number', params: [0] },
                    { type: 'number', params: [255] },
                ],
                type: 'chocopi_map_range',
            },
            paramsKeyMap: { x: 0, x1: 1, x2: 2, y1: 3, y2: 4 },
            class: 'chocopi',
            isNotFor: ['chocopi'],
            func: function(sprite, script) {
                var x = script.getNumberValue('x');
                var x1 = script.getNumberValue('x1');
                var x2 = script.getNumberValue('x2');
                var y1 = script.getNumberValue('y1');
                var y2 = script.getNumberValue('y2');
                if (x1 === x2) return y1;
                return y1 + (x - x1) * (y2 - y1) / (x2 - x1);
            },
            syntax: { js: [], py: ['Chocopi.mapRange(%1, %2, %3, %4, %5)'] },
        },
    };
};

Entry.Chocopi.setLanguage = function() {
    return {
        ko: {
            // ko.js에 작성하던 내용
            Blocks: {
                chocopi_control_event_pressed: '누를 때',
                chocopi_control_event_released: '뗄 때',
                chocopi_joystick_X: '조이스틱 좌우',
                chocopi_joystick_Y: '조이스틱 상하',
                chocopi_motion_photogate_event_blocked: '막았을 때',
                chocopi_motion_photogate_event_unblocked: '열었을 때',
                chocopi_motion_photogate_time_blocked: '막은 시간',
                chocopi_motion_photogate_time_unblocked: '연 시간',
                chocopi_motion_angle_x: '각도X',
                chocopi_motion_angle_y: '각도Y',
                chocopi_motion_angle_z: '각도Z',
                chocopi_port: '포트',
                chocopi_pot: '볼륨',
                chocopi_touch_event_touch: '만질 때',
                chocopi_touch_event_untouch: '뗄 때',
            },
            template: {
                chocopi_control_button: '%1 컨트롤 %2번을 누름',
                chocopi_control_event: '%1 %2 컨트롤 %3을 %4',
                chocopi_control_joystick: '%1 컨트롤 %2의 값',
                chocopi_dc_motor: '%1 DC모터 %2 %3% 세기 %4 방향 %5',
                chocopi_led: '%1 LED %2 RGB(%3 %4 %5) %6',
                chocopi_motion_photogate_event: '%1 %2 포토게이트 %3번을 %4',
                chocopi_motion_photogate_status: '%1 포토게이트 %2번이 막힘',
                chocopi_motion_photogate_time: '%1 포토게이트%2번을 %3',
                chocopi_motion_value: '%1 모션 %2의 값',
                chocopi_motion_angle: '%1 모션 %2',
                chocopi_sensor: '%1 센서 %2',
                chocopi_servo_motor: '%1 서보모터 %2번 %3도 %4',
                chocopi_touch_event: '%1 %2 터치 %3번을 %4',
                chocopi_touch_status: '%1 터치 %2번을 만짐',
                chocopi_touch_value: '%1 터치 %2번의 값',
                chocopi_map_range: '%1을 %2~%3에서 %4~%5로',
            },
            Helper: {
                chocopi_control_button:
                    '버튼이 눌리면 참이 됩니다.<br/><br/>포트번호는 맞추지 않아도 됩니다.<br/>단, 같은 종류의 모듈을 여러 개 연결하는 경우에만 포트를 지정하면 됩니다.',
                chocopi_control_event:
                    '버튼을 누르거나 뗄 때 처리할 엔트리 블록들을 연결합니다.<br/><br/>포트번호는 맞추지 않아도 됩니다.<br/>단, 같은 종류의 모듈을 여러 개 연결하는 경우에만 포트를 지정하면 됩니다.',
                chocopi_control_joystick:
                    '조이스틱 좌우, 상하, 볼륨의 값은 0~4095까지 입니다.<br/>따라서 2047 근처가 중간이 됩니다.<br/><br/>포트번호는 맞추지 않아도 됩니다.<br/>단, 같은 종류의 모듈을 여러 개 연결하는 경우에만 포트를 지정하면 됩니다.',
                chocopi_dc_motor:
                    'DC모터 모듈에는 직류전동기 두개를 연결 할 수 있습니다.<br/> 직류 전동기는 최대 5V로 동작하게 됩니다.<br/>값은 100이 최대(100%)이고 음수를 넣으면 반대 방향으로 회전합니다.<br/><br/>포트번호는 맞추지 않아도 됩니다.<br/>단, 같은 종류의 모듈을 여러 개 연결하는 경우에만 포트를 지정하면 됩니다.',
                chocopi_led:
                    'LED번호는 LED블록에 연결된 순서이고 1번부터 시작합니다.<br/>RGB값은 0~255사이의 값입니다.<br/>빨강(Red),녹색(Green), 파랑(Blue)순서로  입력합니다.<br/>밝은 LED를 직접보면 눈이 아프니까 값을 0~5정도로 씁니다.<br/><br/>포트번호는 맞추지 않아도 됩니다.<br/>단, 같은 종류의 모듈을 여러 개 연결하는 경우에만 포트를 지정하면 됩니다.',
                chocopi_motion_photogate_event:
                    '포토게이트는 모션블록에 연결합니다.<br/>포토게이트는 한쪽에서 나온 빛을 맞은 편의 센서가 감지하는 장치입니다.<br/>빛센서를 물체로 가리거나 치우면 시작되는 엔트리 블록을 연결합니다<br/>모션 모듈에는 포토게이트 2개를 연결할 수 있습니다.<br/><br/>포트번호는 맞추지 않아도 됩니다.<br/>단, 같은 종류의 모듈을 여러 개 연결하는 경우에만 포트를 지정하면 됩니다.',
                chocopi_motion_photogate_status:
                    '포토게이트는 모션블록에 연결합니다.<br/>포토게이트는 한쪽에서 나온 빛을 맞은 편의 센서가 감지하는 장치입니다.<br>물체가 빛센서를 가리면 참</b>이됩니다.<br/><br/>포트번호는 맞추지 않아도 됩니다.<br/>단, 같은 종류의 모듈을 여러 개 연결하는 경우에만 포트를 지정하면 됩니다.',
                chocopi_motion_photogate_time:
                    '포토게이트는 모션블록에 연결합니다.<br/>포토게이트는 한쪽에서 나온 빛을 맞은 편의 센서가 감지하는 장치입니다.<br>이 블록은 물체가 빛센서를 가리거나 벗어난 시간을 가집니다.<br/>1/10000초까지 측정할 수 있습니다.<br/><br/>포트번호는 맞추지 않아도 됩니다.<br/>단, 같은 종류의 모듈을 여러 개 연결하는 경우에만 포트를 지정하면 됩니다.',
                chocopi_motion_value:
                    '모션 모듈에는 3개의 적외선 센서가 있습니다.<br/>0~4095사이의 값을 가질 수 있는데 물체가 빛을 많이 반사할 수록 작은 값을 가집니다. <br/>거리를 대략적으로 측정할 수 있습니다. <br/>가속도와 각가속도 값의 범위는 -32768~32767 까지입니다.<br/>가속도를 이용해서 센서의 기울기를 측정할 수도 있습니다.<br/><br/>포트번호는 맞추지 않아도 됩니다.<br/>단, 같은 종류의 모듈을 여러 개 연결하는 경우에만 포트를 지정하면 됩니다.',
                chocopi_motion_angle:
                    '모션 모듈의 가속도 센서를 이용하여 기울기를 측정합니다.<br/>포트번호는 맞추지 않아도 됩니다.<br/>단, 같은 종류의 모듈을 여러 개 연결하는 경우에만 포트를 지정하면 됩니다.',
                chocopi_sensor:
                    '온도 값은 섭씨 온도입니다.<br/>습도 값은 백분율로 나타낸 상대습도 값입니다.<br/>빛은 로그스케일로 0~4095사이입니다.<br/>아날로그 값은 0~4095사이입니다.<br/><br/>포트번호는 맞추지 않아도 됩니다.<br>단, 같은 종류의 모듈을 여러 개 연결하는 경우에만 포트를 지정하면 됩니다.',
                chocopi_servo_motor:
                    '서보모터 모듈에는 4개의 서보모터를 연결 할 수 있습니다.<br/>서보모터는 5V로 동작하게 됩니다.<br/>각도는 0~200도까지 지정할 수 있습니다.<br/>연속회전식 서보모터를 연결하면 각도에 따라 속도가 변하게됩니다.<br/>90~100 사이가 중간값입니다.<br/><br/>포트번호는 맞추지 않아도 됩니다.<br/>단, 같은 종류의 모듈을 여러 개 연결하는 경우에만 포트를 지정하면 됩니다.',
                chocopi_touch_event:
                    '터치 모듈에는 1~12번의 연결 패드가 있습니다. <br/>만지거나 뗄 때 처리할 엔트리 블록들을 연결합니다.<br/><br/>포트번호는 맞추지 않아도 됩니다.<br/>단, 같은 종류의 모듈을 여러 개 연결하는 경우에만 포트를 지정하면 됩니다.',
                chocopi_touch_status:
                    '터치 모듈의 패드를 만지면 참이됩니다.<br/><br/>포트번호는 맞추지 않아도 됩니다.<br>단, 같은 종류의 모듈을 여러 개 연결하는 경우에만 포트를 지정하면 됩니다.',
                chocopi_touch_value:
                    '터치패드에 연결된 물체의 전기용량이 커지면 값이 작아집니다.<br/>여러 명이 손잡고 만지면 더 작은 값이 됩니다.<br/>전기용량이란 물체에 전기를 띈 입자를 얼마나 가지고 있을 수 있는 지를 말합니다.<br/><br/>포트번호는 맞추지 않아도 됩니다.<br/>단, 같은 종류의 모듈을 여러 개 연결하는 경우에만 포트를 지정하면 됩니다.',
                chocopi_map_range:
                    '예를 들어 설명하면, 컨트럴 블럭의 조이스틱X의 위치에 따라 인형의 위치를 -100에서 100사이로 정해주고 싶다면. 조이스틱X, 0, 4095, -100,100 순서대로 입력합니다.',
            },
        },
        en: {
            // en.js에 작성하던 내용
            Blocks: {
                chocopi_control_event_pressed: 'pressed',
                chocopi_control_event_released: 'released',
                chocopi_joystick_X: 'joystick X',
                chocopi_joystick_Y: 'joystick Y',
                chocopi_motion_photogate_event_blocked: 'blocked',
                chocopi_motion_photogate_event_unblocked: 'unblocked',
                chocopi_motion_photogate_time_blocked: 'blocked',
                chocopi_motion_photogate_time_unblocked: 'unblocked',
                chocopi_motion_angle_x: 'angle X',
                chocopi_motion_angle_y: 'angle Y',
                chocopi_motion_angle_z: 'angle Z',
                chocopi_port: 'P',
                chocopi_pot: 'potentiometer',
                chocopi_touch_event_touch: 'touched',
                chocopi_touch_event_untouch: 'untouched',
            },
            template: {
                chocopi_control_button: '%1 controller %2 is pressed',
                chocopi_control_event: '%1 When %2 controller %3 is %4',
                chocopi_control_joystick: '%1 controller %2 value',
                chocopi_dc_motor: '%1 DC motor #%2  %3 % direction %4 %5',
                chocopi_led: '%1 LED #%2 RGB(%3 %4 %5) %6',
                chocopi_motion_photogate_event: '%1 When %2 photogate %3 is %4',
                chocopi_motion_photogate_status: '%1 photogate #%2 is blocked',
                chocopi_motion_photogate_time: 'time when %1 photogate %2 was %3',
                chocopi_motion_value: '%1 motion %2 value',
                chocopi_sensor: '%1 sensor %2',
                chocopi_servo_motor: '%1 set servo motor #%2 %3 degree %4',
                chocopi_touch_event: '%1 When %2 touch pad%3 is %4',
                chocopi_touch_status: '%1 touch pad%2 is touched',
                chocopi_touch_value: '%1 touch pad%2 value',
                chocopi_map_range: 'map %1 in %2~%3 to %4~%5',
            },
            Helper: {
                chocopi_control_button:
                    'This block will be true if the button is pressed.<br/><br/><br/>Port number(P1~P8) is automatically selected internally<br>It is needed only when multiple modules with the same kind are used',
                chocopi_control_event:
                    'You can attach blocks to process when the button is pressed or released <br/><br/><br/>Port number(P1~P8) is automatically selected internally<br>It is needed only when multiple modules with the same kind are used',
                chocopi_control_joystick:
                    'Joystick X,Y and potentiometer has range of  0~4095.<br/>so, around 2047 will be center value.<br/><br/><br/>Port number(P1~P8) is automatically selected internally<br>It is needed only when multiple modules with the same kind are used',
                chocopi_dc_motor:
                    "Two DC motors can be connected to 'DC motor' module<br/> The motor will be supplied with maximum 5V.<br/>Maximum value is 100 (100%), is negative value is used then it will rotate opposite direction.<br/><br/>Port number(P1~P8) is automatically selected internally<br>It is needed only when multiple modules with the same kind are used",
                chocopi_led:
                    'LED number start from 1 and is the connecting order from the LED module.<br/>You can assign RGB values from 0 to 255<br/>RGB(Red Green Blue) order<br/>To watch an LED with bright light can be painful,<br/>so, please use small number like 0 to 5.<br/><br/>Port number(P1~P8) is automatically selected internally<br>It is needed only when multiple modules with the same kind are used',
                chocopi_motion_photogate_event:
                    "Two photogates can be connected to 'Motion' module<br/>A photogate is a device with light sensor facing light source in opposite side<br/>You can attach blocks when an object blocks or unblocks light sensor<br/><br/><br/>Port number(P1~P8) is automatically selected internally<br>It is needed only when multiple modules with the same kind are used",
                chocopi_motion_photogate_status:
                    "Two photogates can be connected to 'Motion' module<br/>A photogate is a device with light sensor facing light source in opposite side<br/>This block will be <b>true if an object blocks sensor</b><br/><br/>Port number(P1~P8) is automatically selected internally<br>It is needed only when multiple modules with the same kind are used",
                chocopi_motion_photogate_time:
                    "Two photogates can be connected to 'Motion' module<br/>A photogate is a device with light sensor facing light source in opposite side<br/>This block will have the time when an object blocked or unblocked the sensor<br/>It can measure time with resolution of 1/10000 sec<br/><br/>Port number(P1~P8) is automatically selected internally<br>It is needed only when multiple modules with the same kind are used",
                chocopi_motion_value:
                    "'Motion' module has three infrared sensors<br/>The value has range of 0~4095, the more reflection from object, the smaller the value is<br/>It can be used to measure approximate distance between the sensor and an object <br/>Acceleration and angular acceleration value ranges from -32768 to 32767.<br/>You can measure inclination of the sensor using these values.<br/><br/>Port number(P1~P8) is automatically selected internally<br>It is needed only when multiple modules with the same kind are used",
                chocopi_sensor:
                    'Temperature value is Celsius.<br/>Relative humidity value ranges from 0 to 100%.<br/>Light value ranges 0~4095 in log scale.<br/>Analog value ranges from 0 to 4095.<br/><br/>Port number(P1~P8) is automatically selected internally.<br>It is needed only when multiple modules with the same kind are used',
                chocopi_servo_motor:
                    "'Servo' module can be connected to four servo motors<br/>Servo motors are provided with 5V<br/>You can assign 0~200 in degree unit.<br/>If a contineous rotational servo motor is connected, it's speed is determined by the degree value.<br/>Center value is from 90 to 100 varying by motor model.<br/><br/>Port number(P1~P8) is automatically selected internally<br>It is needed only when multiple modules with the same kind are used",
                chocopi_touch_event:
                    'Touch module has #1~12 connecting pads.<br/>You can attach block to process when these pads are touched or untouched.<br/><br/><br/>Port number(P1~P8) is automatically selected internally<br>It is needed only when multiple modules with the same kind are used',
                chocopi_touch_status:
                    'It will be true if the pad is touched.<br/><br/><br/>Port number(P1~P8) is automatically selected internally<br>It is needed only when multiple modules with the same kind are used',
                chocopi_touch_value:
                    "The value will be smaller if the capacitance of the obeject is larger.<br/>If many people hold each other's hand and touch, the value will be smaller<br/>'Capacitance' means how many electric particles the object can hold.<br/><br/><br/>Port number(P1~P8) is automatically selected internally<br>It is needed only when multiple modules with the same kind are used",
                chocopi_map_range:
                    'Usage example: If you want to set a sprite position x according to joystic x position between -100 and 100, you can put five values as Joystic X, 0, 4095, -100, 100.',
            },
        },
    };
};

module.exports = Entry.Chocopi;
