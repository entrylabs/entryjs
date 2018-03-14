'use strict';

Entry.Chocopi = {
    name: 'chocopi',
    p: {},
    ev: {},
    blocks: [],
    setZero: function() {},
    getport: function(id, port) {
        if (!this.blocks) return -1;
        if (this.blocks[port].id == id) return port;
        for (var p in this.blocks) if (this.blocks[p].id == id) return p;
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
        if (!this.connected) {
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

Entry.Chocopi.getBlocks = function() {
    return {
        //region chocopi 초코파이
        chocopi_sensor: {
            color: '#00979D',
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
            color: '#00979D',
            fontColor: '#fff',
            skeleton: 'basic_event',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/start_icon_hardware.png',
                    size: 17,
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
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.chocopi_touch_event_touch, 1],
                        [Lang.Blocks.chocopi_touch_event_untouch, 0],
                    ],
                    value: 1,
                    fontSize: 11,
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
                if (
                    ((ev.id >> id) & 1) != 1 ||
                    ((Entry.Chocopi.p[port].ts >> id) & 1) != status
                ) {
                    return this.die();
                }
                return script.callReturn();
            },
            syntax: { js: [], py: ['def on_chocopi_touch(%2, %3, %4 ):'] },
        },
        chocopi_touch_status: {
            color: '#00979D',
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
                return (Entry.Chocopi.p[port].ts & (1 << sensor)) > 0;
            },
            syntax: { js: [], py: ['Chocopi.touchStatus(%1, %2)'] },
        },
        chocopi_touch_value: {
            color: '#00979D',
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
                return Entry.Chocopi.p[port].tv[sensor];
            },
            syntax: { js: [], py: ['Chocopi.touchValue(%1, %2)'] },
        },
        chocopi_control_event: {
            color: '#00979D',
            fontColor: '#fff',
            skeleton: 'basic_event',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/start_icon_hardware.png',
                    size: 17,
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
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.chocopi_control_event_pressed, 1],
                        [Lang.Blocks.chocopi_control_event_released, 0],
                    ],
                    value: 1,
                    fontSize: 11,
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
            color: '#00979D',
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
                return Entry.Chocopi.p[port].xyp[sensor];
            },
            syntax: { js: [], py: ['Chocopi.joystick(%1, %2)'] },
        },
        chocopi_control_button: {
            color: '#00979D',
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
            color: '#00979D',
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
                },
                {
                    type: 'Dropdown',
                    options: [[1, 0], [2, 1]],
                    value: '0',
                    fontSize: 11,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [
                            Lang.Blocks.chocopi_motion_photogate_time_unblocked,
                            0,
                        ],
                        [Lang.Blocks.chocopi_motion_photogate_time_blocked, 1],
                    ],
                    value: 1,
                    fontSize: 11,
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
            color: '#00979D',
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
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Hw.IR + ' 1', 0],
                        [Lang.Hw.IR + ' 2', 1],
                        [Lang.Hw.IR + ' 3', 2],
                        [Lang.Hw.acceleration + 'X', 3],
                        [Lang.Hw.acceleration + 'Y', 4],
                        [Lang.Hw.acceleration + 'Z', 5],
                        [Lang.Hw.angular_acceleration + 'U', 6],
                        [Lang.Hw.angular_acceleration + 'V', 7],
                        [Lang.Hw.angular_acceleration + 'W', 8],
                    ],
                    value: '0',
                    fontSize: 11,
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
                return Entry.Chocopi.p[port].s[sensor];
            },
            syntax: { js: [], py: ['Chocopi.motionValue(%1, %2)'] },
        },
        chocopi_motion_photogate_status: {
            color: '#00979D',
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
                },
                {
                    type: 'Dropdown',
                    options: [['1', 0], ['2', 1]],
                    value: 0,
                    fontSize: 11,
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
            color: '#00979D',
            fontColor: '#fff',
            skeleton: 'basic_event',
            statements: [],
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/start_icon_hardware.png',
                    size: 17,
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
                },
                {
                    type: 'Dropdown',
                    options: [
                        [
                            Lang.Blocks
                                .chocopi_motion_photogate_event_unblocked,
                            0,
                        ],
                        [Lang.Blocks.chocopi_motion_photogate_event_blocked, 1],
                    ],
                    value: 1,
                    fontSize: 11,
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
            color: '#00979D',
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
                },
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                { type: 'Block', accept: 'string' },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            def: {
                params: [
                    null,
                    { type: 'number', params: [1] },
                    { type: 'number', params: [2] },
                    { type: 'number', params: [1] },
                    { type: 'number', params: [1] },
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
                console.log([l, r, g, b]);
                Entry.hw.sendQueue.data[port] = [l, r, g, b];
                Entry.hw.update();
                delete Entry.hw.sendQueue.data[port];
                return script.callReturn();
            },
            syntax: { js: [], py: ['Chocopi.LED(%1, %2, %3, %4, %5)'] },
        },
        chocopi_dc_motor: {
            color: '#00979D',
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
                },
                {
                    type: 'Dropdown',
                    options: [['1', 0], ['2', 1]],
                    value: 0,
                    fontSize: 11,
                },
                { type: 'Block', accept: 'string' },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.General.clock, 0],
                        [Lang.General.counter_clock, 1],
                    ],
                    value: 0,
                    fontSize: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            def: {
                params: [null, null, { type: 'number', params: [31] }],
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
                Entry.hw.sendQueue.data[port] = [id, s, d];
                Entry.hw.update();
                delete Entry.hw.sendQueue.data[port];
                return script.callReturn();
            },
            syntax: { js: [], py: ['Chocopi.DCmotor(%1, %2, %3, %4)'] },
        },
        chocopi_servo_motor: {
            color: '#00979D',
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
                },
                {
                    type: 'Dropdown',
                    options: [['1', 0], ['2', 1], ['3', 2], ['4', 3]],
                    value: 0,
                    fontSize: 11,
                },
                { type: 'Block', accept: 'string' },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_03.png',
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
                Entry.hw.sendQueue.data[port] = [id, a];
                Entry.hw.update();
                delete Entry.hw.sendQueue.data[port];
                return script.callReturn();
            },
            syntax: { js: [], py: ['Chocopi.servo(%1, %2, %3)'] },
        },
        //endregion coconut 코코넛
    };
};
