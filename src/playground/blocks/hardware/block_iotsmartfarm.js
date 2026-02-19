'use strict';

Entry.IotSmartFarm = {
    PORT_MAP: {
        control: 0,
        led1: 0,
        led2: 0,
        led3: 0,
        led4: 0,
        led5: 0,
        led6: 0,
        display1: 0,
        display2: 0,
        display3: 0,
        display4: 0,
        display5: 0,
        display6: 0,
        display7: 0,
        display8: 0,
        display9: 0,
        switch: 0
    },
    setZero: function() {
        var portMap = Entry.IotSmartFarm.PORT_MAP;
        var sq = Entry.hw.sendQueue;
        for (var port in portMap) {
            sq[port] = portMap[port];
        }
        Entry.hw.update();
        var IotSmartFarm = Entry.IotSmartFarm;
        IotSmartFarm.removeAllTimeouts();
    },
    timeouts: [],
    removeTimeout: function(id) {
        clearTimeout(id);
        var timeouts = this.timeouts;
        var index = timeouts.indexOf(id);
        if (index >= 0) {
            timeouts.splice(index, 1);
        }
    },
    removeAllTimeouts: function() {
        var timeouts = this.timeouts;
        for (var i in timeouts) {
            clearTimeout(timeouts[i]);
        }
        this.timeouts = [];
    },
    id: '18.3',
    name: 'iotsmartfarm',
    url: 'http://saeon.co.kr/',
    imageName: 'iotsmartfarm.png',
    title: {
        en: 'IOT SmartFarm',
        ko: 'IOT 스마트팜',
    },
};

Entry.IotSmartFarm.blockMenuBlocks = [
    'iotsmartfarm_analogValue',
    'iotsmartfarm_stopAll',
    'iotsmartfarm_window',
    'iotsmartfarm_fan',
    'iotsmartfarm_pump',
    'iotsmartfarm_heater',
    'iotsmartfarm_camera',
    'iotsmartfarm_led',
    'iotsmartfarm_led_num',
    'iotsmartfarm_display',
    'iotsmartfarm_switch',
];

Entry.IotSmartFarm.setLanguage = function() {
    return {
        ko: {
            // ko.js에 작성하던 내용
            Blocks: {
                iotsmartfarm_HUM: '습도',
                iotsmartfarm_HEAT_TEMP: '난방온도',
                iotsmartfarm_TEMP: '온도',
                iotsmartfarm_SOIL: '토양',
                iotsmartfarm_CDS: '조도',
                iotsmartfarm_stopAll: '모두',
                iotsmartfarm_stopWindow: '창문',
                iotsmartfarm_stopFan: '환기',
                iotsmartfarm_stopPump: '펌프',
                iotsmartfarm_stopHeater: '히터',
                iotsmartfarm_stopCamera: '카메라',
                iotsmartfarm_stopLed: '조명',
                iotsmartfarm_stopDisplay: '표시하기',
                iotsmartfarm_open: '열기',
                iotsmartfarm_close: '닫기',
                iotsmartfarm_on: '켜기',
                iotsmartfarm_off: '끄기',
                iotsmartfarm_led_idx1: '1',
                iotsmartfarm_led_idx2: '2',
                iotsmartfarm_led_idx3: '3',
                iotsmartfarm_led_idx4: '4',
                iotsmartfarm_led_val0: '0',
                iotsmartfarm_led_val1: '1',
                iotsmartfarm_led_val2: '2',
                iotsmartfarm_led_val3: '3',
                iotsmartfarm_led_val4: '4',
                iotsmartfarm_led_val5: '5',
                iotsmartfarm_led_val6: '6',
                iotsmartfarm_led_val7: '7',
                iotsmartfarm_led_val8: '8',
                iotsmartfarm_led_val9: '9',
                iotsmartfarm_led_val10: '10',
                iotsmartfarm_led_val11: '11',
                iotsmartfarm_led_val12: '12',
                iotsmartfarm_led_val13: '13',
                iotsmartfarm_led_val14: '14',
                iotsmartfarm_led_val15: '15',
                iotsmartfarm_switch_idx1: '1',
                iotsmartfarm_switch_idx2: '2',
                iotsmartfarm_switch_idx3: '3',
            },
            template: {
                iotsmartfarm_analogValue: 'IOT 스마트팜 %1 센서값',
                iotsmartfarm_stopAll: '정지 %1%2',
                iotsmartfarm_window: '창문 %1 %2',
                iotsmartfarm_fan: '환기 %1 %2',
                iotsmartfarm_pump: '펌프 %1 %2',
                iotsmartfarm_heater: '히터 %1 %2',
                iotsmartfarm_camera: '카메라 %1 %2',
                iotsmartfarm_led: '조명 %1 R:%2 G:%3 B:%4 %5',
                iotsmartfarm_led_num: '조명 %1 R:%2 G:%3 B:%4 %5',
                iotsmartfarm_display: '표시하기 %1 %2',
                iotsmartfarm_switch: '%1 번 스위치를 눌렸는가? %2',
            },
        },
        en: {
            // en.js에 작성하던 내용
            Blocks: {
                iotsmartfarm_HUM: 'HUM',
                iotsmartfarm_HEAT_TEMP: 'HEATER',
                iotsmartfarm_TEMP: 'TEMP',
                iotsmartfarm_SOIL: 'SOIL',
                iotsmartfarm_CDS: 'CDS',
                iotsmartfarm_stopAll: 'All',
                iotsmartfarm_stopWindow: 'Window',
                iotsmartfarm_stopFan: 'Fan',
                iotsmartfarm_stopPump: 'Pump',
                iotsmartfarm_stopHeater: 'Heater',
                iotsmartfarm_stopCamera: 'Cam',
                iotsmartfarm_stopLed: 'Led',
                iotsmartfarm_stopDisplay: 'Display',
                iotsmartfarm_open: 'Open',
                iotsmartfarm_close: 'Close',
                iotsmartfarm_on: 'On',
                iotsmartfarm_off: 'Off',
                iotsmartfarm_led_idx1: '1',
                iotsmartfarm_led_idx2: '2',
                iotsmartfarm_led_idx3: '3',
                iotsmartfarm_led_idx4: '4',
                iotsmartfarm_led_val0: '0',
                iotsmartfarm_led_val1: '1',
                iotsmartfarm_led_val2: '2',
                iotsmartfarm_led_val3: '3',
                iotsmartfarm_led_val4: '4',
                iotsmartfarm_led_val5: '5',
                iotsmartfarm_led_val6: '6',
                iotsmartfarm_led_val7: '7',
                iotsmartfarm_led_val8: '8',
                iotsmartfarm_led_val9: '9',
                iotsmartfarm_led_val10: '10',
                iotsmartfarm_led_val11: '11',
                iotsmartfarm_led_val12: '12',
                iotsmartfarm_led_val13: '13',
                iotsmartfarm_led_val14: '14',
                iotsmartfarm_led_val15: '15',
                iotsmartfarm_switch_idx1: '1',
                iotsmartfarm_switch_idx2: '2',
                iotsmartfarm_switch_idx3: '3',
            },
            template: {
                iotsmartfarm_analogValue: 'IOT SmartFarm %1 sensor value',
                iotsmartfarm_stopAll: 'Stop %1%2',
                iotsmartfarm_window: 'Window %1 %2',
                iotsmartfarm_fan: 'Fan %1 %2',
                iotsmartfarm_pump: 'Pump %1 %2',
                iotsmartfarm_heater: 'Heater %1 %2',
                iotsmartfarm_camera: 'Cam %1 %2',
                iotsmartfarm_led: 'Led %1 R:%2 G:%3 B:%4 %5',
                iotsmartfarm_led_num: 'Led %1 R:%2 G:%3 B:%4 %5',
                iotsmartfarm_display: 'Display %1 %2',
                iotsmartfarm_switch: 'Switch %1 pressed? %2',
            },
        },
    };
};

Entry.IotSmartFarm.getBlocks = function() {
    return {
        //region IotSmartFarm IOT스마트팜
        iotsmartfarm_analogValue: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.iotsmartfarm_HUM, 'hum'],
                        [Lang.Blocks.iotsmartfarm_HEAT_TEMP, 'heatertemp'],
                        [Lang.Blocks.iotsmartfarm_TEMP, 'temp'],
                        [Lang.Blocks.iotsmartfarm_SOIL, 'soil'],
                        [Lang.Blocks.iotsmartfarm_CDS, 'cds'],
                    ],
                    value: 'hum',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'iotsmartfarm_analogValue',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class: 'iotsmartfarm_sensor',
            isNotFor: ['iotsmartfarm'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;
                var dev = script.getField('DEVICE');
                return pd[dev];
            },
            syntax: { js: [], py: ['IotSmartFarm.analog_value(%1)'] },
        },
        iotsmartfarm_stopAll: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.iotsmartfarm_stopAll, 'All'],
                        [Lang.Blocks.iotsmartfarm_stopWindow, 'Window'],
                        [Lang.Blocks.iotsmartfarm_stopFan, 'Fan'],
                        [Lang.Blocks.iotsmartfarm_stopPump, 'Pump'],
                        [Lang.Blocks.iotsmartfarm_stopHeater, 'Heater'],
                        [Lang.Blocks.iotsmartfarm_stopCamera, 'Cam'],
                        [Lang.Blocks.iotsmartfarm_stopLed, 'Led'],
                        [Lang.Blocks.iotsmartfarm_stopDisplay, 'Display'],
                    ],
                    value: 'All',
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
            def: {
                params: [null],
                type: 'iotsmartfarm_stopAll',
            },
            paramsKeyMap: {
                DIRECTION: 0,
            },
            class: 'iotsmartfarm_output',
            isNotFor: ['iotsmartfarm'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var direction = script.getField('DIRECTION', script);

                if (direction == 'All') {
                    sq.control = 0;
                    sq.led1 = 0;
                    sq.led2 = 0;
                    sq.led3 = 0;
                    sq.led4 = 0;
                    sq.led5 = 0;
                    sq.led6 = 0;
                    sq.display1 = 0;
                    sq.display2 = 0;
                    sq.display3 = 0;
                    sq.display4 = 0;
                    sq.display5 = 0;
                    sq.display6 = 0;
                    sq.display7= 0;
                    sq.display8 = 0;
                    sq.display9 = 0;
                } else if (direction == 'Window') {
                    sq.control &= 0xfe;
                } else if (direction == 'Fan') {
                    sq.control &= 0xfd;
                } else if (direction == 'Pump') {
                    sq.control &= 0xfb;
                } else if (direction == 'Heater') {
                    sq.control &= 0xf7;
                } else if (direction == 'Cam') {
                    sq.control &= 0x0f;
                } else if (direction == 'Led') {
                    sq.led1 = 0;
                    sq.led2 = 0;
                    sq.led3 = 0;
                    sq.led4 = 0;
                    sq.led5 = 0;
                    sq.led6 = 0;
                } else if (direction == 'Display') {
                    sq.display1 = 0;
                    sq.display2 = 0;
                    sq.display3 = 0;
                    sq.display4 = 0;
                    sq.display5 = 0;
                    sq.display6 = 0;
                    sq.display7 = 0;
                    sq.display8 = 0;
                    sq.display9 = 0;
                }

                return script.callReturn();
            },
            syntax: { js: [], py: ['IotSmartFarm.stop(%1)'] },
        },
        iotsmartfarm_window: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.iotsmartfarm_open, 'Open'],
                        [Lang.Blocks.iotsmartfarm_close, 'Close'],
                    ],
                    value: 'Close',
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
            def: {
                params: [null, null],
                type: 'iotsmartfarm_window',
            },
            paramsKeyMap: {
                DIRECTION: 0,
            },
            class: 'iotsmartfarm_output',
            isNotFor: ['iotsmartfarm'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var direction = script.getField('DIRECTION', script);

                if (direction == 'Open') {
                    sq.control |= 0x01;
                } else if (direction == 'Close') {
                    sq.control &= 0xfe;
                } 
                return script.callReturn();
            },
            syntax: { js: [], py: ['IotSmartFarm.window(%1)'] },
        },
        iotsmartfarm_fan: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.iotsmartfarm_on, 'On'],
                        [Lang.Blocks.iotsmartfarm_off, 'Off'],
                    ],
                    value: 'Off',
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
            def: {
                params: [null, null],
                type: 'iotsmartfarm_fan',
            },
            paramsKeyMap: {
                DIRECTION: 0,
            },
            class: 'iotsmartfarm_output',
            isNotFor: ['iotsmartfarm'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var direction = script.getField('DIRECTION', script);

                if (direction == 'On') {
                    sq.control |= 0x02;
                } else if (direction == 'Off') {
                    sq.control &= 0xfd;
                } 
                return script.callReturn();
            },
            syntax: { js: [], py: ['IotSmartFarm.fan(%1)'] },
        },
        iotsmartfarm_pump: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.iotsmartfarm_on, 'On'],
                        [Lang.Blocks.iotsmartfarm_off, 'Off'],
                    ],
                    value: 'Off',
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
            def: {
                params: [null, null],
                type: 'iotsmartfarm_pump',
            },
            paramsKeyMap: {
                DIRECTION: 0,
            },
            class: 'iotsmartfarm_output',
            isNotFor: ['iotsmartfarm'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var direction = script.getField('DIRECTION', script);

                if (direction == 'On') {
                    sq.control |= 0x04;
                } else if (direction == 'Off') {
                    sq.control &= 0xfb;
                } 
                return script.callReturn();
            },
            syntax: { js: [], py: ['IotSmartFarm.pump(%1)'] },
        },
        iotsmartfarm_heater: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.iotsmartfarm_on, 'On'],
                        [Lang.Blocks.iotsmartfarm_off, 'Off'],
                    ],
                    value: 'Off',
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
            def: {
                params: [null, null],
                type: 'iotsmartfarm_heater',
            },
            paramsKeyMap: {
                DIRECTION: 0,
            },
            class: 'iotsmartfarm_output',
            isNotFor: ['iotsmartfarm'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var direction = script.getField('DIRECTION', script);

                if (direction == 'On') {
                    sq.control |= 0x08;
                } else if (direction == 'Off') {
                    sq.control &= 0xf7;
                } 
                return script.callReturn();
            },
            syntax: { js: [], py: ['IotSmartFarm.heater(%1)'] },
        },
        iotsmartfarm_camera: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'iotsmartfarm_camera',
            },
            paramsKeyMap: {
                camVal: 0,
            },
            class: 'iotsmartfarm_output',
            isNotFor: ['iotsmartfarm'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var val = 0;

                val = parseInt(Number(script.getStringValue('camVal')), 10);

                if(val < 0) val = 0;
                if(val > 15) val = 15;

                sq.control &= 0x0f;
                sq.control |= (val << 4) & 0xf0;
                
                return script.callReturn();
            },
            syntax: { js: [], py: ['IotSmartFarm.cam(%1)'] },
        },
        iotsmartfarm_led: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {                    
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.iotsmartfarm_led_idx1, '1'],
                        [Lang.Blocks.iotsmartfarm_led_idx2, '2'],
                        [Lang.Blocks.iotsmartfarm_led_idx3, '3'],
                        [Lang.Blocks.iotsmartfarm_led_idx4, '4'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.iotsmartfarm_led_val0, '0'],
                        [Lang.Blocks.iotsmartfarm_led_val1, '1'],
                        [Lang.Blocks.iotsmartfarm_led_val2, '2'],
                        [Lang.Blocks.iotsmartfarm_led_val3, '3'],
                        [Lang.Blocks.iotsmartfarm_led_val4, '4'],
                        [Lang.Blocks.iotsmartfarm_led_val5, '5'],
                        [Lang.Blocks.iotsmartfarm_led_val6, '6'],
                        [Lang.Blocks.iotsmartfarm_led_val7, '7'],
                        [Lang.Blocks.iotsmartfarm_led_val8, '8'],
                        [Lang.Blocks.iotsmartfarm_led_val9, '9'],
                        [Lang.Blocks.iotsmartfarm_led_val10, '10'],
                        [Lang.Blocks.iotsmartfarm_led_val11, '11'],
                        [Lang.Blocks.iotsmartfarm_led_val12, '12'],
                        [Lang.Blocks.iotsmartfarm_led_val13, '13'],
                        [Lang.Blocks.iotsmartfarm_led_val14, '14'],
                        [Lang.Blocks.iotsmartfarm_led_val15, '15'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.iotsmartfarm_led_val0, '0'],
                        [Lang.Blocks.iotsmartfarm_led_val1, '1'],
                        [Lang.Blocks.iotsmartfarm_led_val2, '2'],
                        [Lang.Blocks.iotsmartfarm_led_val3, '3'],
                        [Lang.Blocks.iotsmartfarm_led_val4, '4'],
                        [Lang.Blocks.iotsmartfarm_led_val5, '5'],
                        [Lang.Blocks.iotsmartfarm_led_val6, '6'],
                        [Lang.Blocks.iotsmartfarm_led_val7, '7'],
                        [Lang.Blocks.iotsmartfarm_led_val8, '8'],
                        [Lang.Blocks.iotsmartfarm_led_val9, '9'],
                        [Lang.Blocks.iotsmartfarm_led_val10, '10'],
                        [Lang.Blocks.iotsmartfarm_led_val11, '11'],
                        [Lang.Blocks.iotsmartfarm_led_val12, '12'],
                        [Lang.Blocks.iotsmartfarm_led_val13, '13'],
                        [Lang.Blocks.iotsmartfarm_led_val14, '14'],
                        [Lang.Blocks.iotsmartfarm_led_val15, '15'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.iotsmartfarm_led_val0, '0'],
                        [Lang.Blocks.iotsmartfarm_led_val1, '1'],
                        [Lang.Blocks.iotsmartfarm_led_val2, '2'],
                        [Lang.Blocks.iotsmartfarm_led_val3, '3'],
                        [Lang.Blocks.iotsmartfarm_led_val4, '4'],
                        [Lang.Blocks.iotsmartfarm_led_val5, '5'],
                        [Lang.Blocks.iotsmartfarm_led_val6, '6'],
                        [Lang.Blocks.iotsmartfarm_led_val7, '7'],
                        [Lang.Blocks.iotsmartfarm_led_val8, '8'],
                        [Lang.Blocks.iotsmartfarm_led_val9, '9'],
                        [Lang.Blocks.iotsmartfarm_led_val10, '10'],
                        [Lang.Blocks.iotsmartfarm_led_val11, '11'],
                        [Lang.Blocks.iotsmartfarm_led_val12, '12'],
                        [Lang.Blocks.iotsmartfarm_led_val13, '13'],
                        [Lang.Blocks.iotsmartfarm_led_val14, '14'],
                        [Lang.Blocks.iotsmartfarm_led_val15, '15'],
                    ],
                    value: '0',
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
            def: {
                params: [null, null, null, null],
                type: 'iotsmartfarm_led',
            },
            paramsKeyMap: {
                IDX: 0,
                LED_R: 1,
                LED_G: 2,
                LED_B: 3,
            },
            class: 'iotsmartfarm_output',
            isNotFor: ['iotsmartfarm'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var led_idx = parseInt(Number(script.getStringField('IDX', script)), 10);
                var led_r = parseInt(Number(script.getStringField('LED_R', script)), 10);
                var led_g = parseInt(Number(script.getStringField('LED_G', script)), 10);
                var led_b = parseInt(Number(script.getStringField('LED_B', script)), 10);
                
                var dst = 0;
                var msk = 0xfff;
                var org = 0;

                dst |= led_b;
                dst = (dst << 4) | led_g;
                dst = (dst << 4) | led_r;
                
                dst = dst << ((led_idx - 1) % 2) * 12;
                msk = msk << ((led_idx - 1) % 2) * 12;

                
                if ((led_idx == 1) || (led_idx == 2)) {
                    org = sq.led3;
                    org = (org << 8) | sq.led2;
                    org = (org << 8) | sq.led1;

                    org &= ~msk;
                    org |= dst;

                    sq.led1 = org & 0xff;
                    sq.led2 = (org >> 8) & 0xff;
                    sq.led3 = (org >> 16) & 0xff;
                }
                else if ((led_idx == 3) || (led_idx == 4)) {
                    org = sq.led6;
                    org = (org << 8) | sq.led5;
                    org = (org << 8) | sq.led4;

                    org &= ~msk;
                    org |= dst;

                    sq.led4 = org & 0xff;
                    sq.led5 = (org >> 8) & 0xff;
                    sq.led6 = (org >> 16) & 0xff;
                }

                return script.callReturn();
            },
            syntax: { js: [], py: ['IotSmartFarm.led(%1, %2, %3, %4)'] },
        },
        iotsmartfarm_led_num: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
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
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['1'],
                    },
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
                    null,
                ],
                type: 'iotsmartfarm_led_num',
            },
            paramsKeyMap: {
                LED_IDX: 0,
                LED_R: 1,
                LED_G: 2,
                LED_B: 3,
            },
            class: 'iotsmartfarm_output',
            isNotFor: ['iotsmartfarm'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var led_idx = script.getNumberValue('LED_IDX');
                var led_r = script.getNumberValue('LED_R');
                var led_g = script.getNumberValue('LED_G');
                var led_b = script.getNumberValue('LED_B');
                
                if(led_idx < 1) led_idx = 1;
                if(led_idx > 4) led_idx = 4;

                if(led_r < 0) led_r = 0;
                if(led_r > 15) led_r = 15;

                if(led_g < 0) led_g = 0;
                if(led_g > 15) led_g = 15;

                if(led_b < 0) led_b = 0;
                if(led_b > 15) led_b = 15;

                var dst = 0;
                var msk = 0xfff;
                var org = 0;

                dst |= led_b;
                dst = (dst << 4) | led_g;
                dst = (dst << 4) | led_r;
                
                dst = dst << ((led_idx - 1) % 2) * 12;
                msk = msk << ((led_idx - 1) % 2) * 12;

                
                if ((led_idx == 1) || (led_idx == 2)) {
                    org = sq.led3;
                    org = (org << 8) | sq.led2;
                    org = (org << 8) | sq.led1;

                    org &= ~msk;
                    org |= dst;

                    sq.led1 = org & 0xff;
                    sq.led2 = (org >> 8) & 0xff;
                    sq.led3 = (org >> 16) & 0xff;
                }
                else if ((led_idx == 3) || (led_idx == 4)) {
                    org = sq.led6;
                    org = (org << 8) | sq.led5;
                    org = (org << 8) | sq.led4;

                    org &= ~msk;
                    org |= dst;

                    sq.led4 = org & 0xff;
                    sq.led5 = (org >> 8) & 0xff;
                    sq.led6 = (org >> 16) & 0xff;
                }

                return script.callReturn();
            },
            syntax: { js: [], py: ['IotSmartFarm.led_num(%1, %2, %3, %4)'] },
        },
        iotsmartfarm_display: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'text',
                        params: ['SmartFarm'],
                    },
                    null,
                ],
                type: 'iotsmartfarm_display',
            },
            paramsKeyMap: {
                MSG: 0,
            },
            class: 'iotsmartfarm_output',
            isNotFor: ['iotsmartfarm'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var msg = script.getStringValue('MSG', script);
                var msgbuf;

                for (var i = 0; i < 9; i++) {
                    sq[`display${i + 1}`] = 0;
                }

                if(msg.length > 9) {
                    msg = msg.substr(0, 9);
                }
                if(msg.length < 1) {
                    msg = " ";
                }

                for (var i = 0; i < msg.length; i++) {
                    sq[`display${i + 1}`] = msg.charCodeAt(i);
                }

                return script.callReturn();
            },
            syntax: { js: [], py: ['IotSmartFarm.display(%1)'] },
        },
        iotsmartfarm_switch: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.iotsmartfarm_switch_idx1, "switch1"],
                        [Lang.Blocks.iotsmartfarm_switch_idx2, "switch2"],
                        [Lang.Blocks.iotsmartfarm_switch_idx3, "switch3"],
                    ],
                    fontSize: 11
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    "switch1"
                ],
                type: 'iotsmartfarm_switch',
            },
            paramsKeyMap: {
                IDX: 0,
            },
            class: 'iotsmartfarm_expert',
            isNotFor: ['iotsmartfarm'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;
                var dev = script.getField('IDX');
                console.log(dev + ' : ' +pd[dev]);
                
                if(pd[dev] == 1) {
                    result = true;
                }
                else {
                    result = false;
                }

                var result;

                return result;
            },
            syntax: { js: [], py: ['IotSmartFarm.switch(%1)'] },
        },
    };
};

module.exports = Entry.IotSmartFarm;
