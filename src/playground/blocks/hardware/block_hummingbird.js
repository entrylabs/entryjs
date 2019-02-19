'use strict';

Entry.hummingbird = {
    PORT_MAP: {
        triLEDR1: 256, //D7
        triLEDG1: 256, //D4
        triLEDB1: 256, //D12
        triLEDR2: 256, //D11
        triLEDG2: 256, //D6
        triLEDB2: 256, //D5
        led1: 256, //D3
        led2: 256, //D2
        led3: 256, //HWB
        led4: 256, //A0
        vibrat1: 256, //D9
        vibrat2: 256, //D10
        dcMotor1: 256, //spi
        dcMotor2: 256, //spi
        //servo1: 256,  //spi
        //servo2: 256,  //spi
        //servo3: 256, //spi
        //servo4: 256  //spi
    },
    setZero: function() {
        var portMap = Entry.hummingbird.PORT_MAP;
        var sq = Entry.hw.sendQueue;
        for (var port in portMap) {
            sq[port] = portMap[port];
        }
        Entry.hw.update();
        var hummingbird = Entry.hummingbird;
        hummingbird.removeAllTimeouts();
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

    //장치이름, 부사장님과 상의가 필요 일단 허밍버드로
    id: '1C.1',
    name: 'hummingbird',
    url: 'http://www.creartbot.com/hummingbird',
    imageName: 'hummingbirdduo.png',
    title: {
        en: 'Hummingbird Duo',
        ko: '허밍버드 듀오',
    },
};
Entry.hummingbird.blockMenuBlocks = [
    //hummingbirdduo
    'hummingbird_sensorValue',
    'hummingbird_temperatureValue',
    'hummingbird_lightValue',
    'hummingbird_distanceValue',
    'hummingbird_rotaryValue',
    'hummingbird_soundValue',
    'hummingbird_vibeMotor',
    'hummingbird_servo',
    'hummingbird_dcMotor',
    'hummingbird_triLED',
    'hummingbird_led',
];
Entry.hummingbird.getBlocks = function() {
    return {
        //region hummingbird 허밍버드
        //Hummingbird parts
        //범용 센서
        hummingbird_sensorValue: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: '아날로그센서 %1번 값',
            params: [
                {
                    type: 'Dropdown',
                    options: [['1', 'adc1'], ['2', 'adc2'], ['3', 'adc3'], ['4', 'adc4']],
                    value: 'adc1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'hummingbird_sensorValue',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class: 'hummingbird_sensor',
            isNotFor: ['hummingbird'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;
                var dev = script.getField('DEVICE');
                return pd[dev];
            },
            syntax: { js: [], py: [] },
        },

        //온도센서
        hummingbird_temperatureValue: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: 'HB 온도센서 %1번 값',
            params: [
                {
                    type: 'Dropdown',
                    options: [['1', 'adc1'], ['2', 'adc2'], ['3', 'adc3'], ['4', 'adc4']],
                    value: 'adc1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'hummingbird_temperatureValue',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class: 'hummingbird_sensor',
            isNotFor: ['hummingbird'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;
                var dev = script.getField('DEVICE');
                var rawData = (pd[dev] >> 2) & 0xff;
                var temperature_value = Math.floor(((rawData - 127) / 2.4 + 25) * 100 / 100);
                return temperature_value;
            },
            syntax: { js: [], py: [] },
        },
        // 빛 블럭
        hummingbird_lightValue: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: 'HB 빛센서 %1번 값',
            params: [
                {
                    type: 'Dropdown',
                    options: [['1', 'adc1'], ['2', 'adc2'], ['3', 'adc3'], ['4', 'adc4']],
                    value: 'adc1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'hummingbird_lightValue',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class: 'hummingbird_sensor',
            isNotFor: ['hummingbird'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;
                var dev = script.getField('DEVICE');
                var light_value = Math.round(pd[dev] * 100 / 1024);
                return light_value;
            },
            syntax: { js: [], py: [] },
        },

        // 거리센서 블럭
        hummingbird_distanceValue: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: 'HB 거리센서 %1번 값',
            params: [
                {
                    type: 'Dropdown',
                    options: [['1', 'adc1'], ['2', 'adc2'], ['3', 'adc3'], ['4', 'adc4']],
                    value: 'adc1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'hummingbird_distanceValue',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class: 'hummingbird_sensor',
            isNotFor: ['hummingbird'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;
                var dev = script.getField('DEVICE');

                var distance = 0;
                var reading = ((pd[dev] >> 2) & 0xff) * 4;
                if (reading < 130) {
                    distance = 100.0;
                } else {
                    reading = reading - 120;
                    if (reading > 680) {
                        distance = 5.0;
                    } else {
                        var sensor_val_square = reading * reading;
                        distance =
                            sensor_val_square * sensor_val_square * reading * -0.000000000004789 +
                            sensor_val_square * sensor_val_square * 0.000000010057143 -
                            sensor_val_square * reading * 0.000008279033021 +
                            sensor_val_square * 0.003416264518201 -
                            reading * 0.756893112198934 +
                            90.707167605683;
                    }
                }
                return Math.floor(distance);
            },
            syntax: { js: [], py: [] },
        },

        // 소음 센서 블럭
        hummingbird_soundValue: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: 'HB 소리센서 %1번 값',
            params: [
                {
                    type: 'Dropdown',
                    options: [['1', 'adc1'], ['2', 'adc2'], ['3', 'adc3'], ['4', 'adc4']],
                    value: 'adc1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'hummingbird_soundValue',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class: 'hummingbird_sensor',
            isNotFor: ['hummingbird'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;
                var dev = script.getField('DEVICE');
                var sound_value = (pd[dev] >> 2) & 0xff;

                if (sound_value > 14) {
                    return Math.round((sound_value - 15) * 3 / 2);
                } else {
                    return 0;
                }
            },
            syntax: { js: [], py: [] },
        },

        // 회전센서
        hummingbird_rotaryValue: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: 'HB 로터리센서 %1번 값',
            params: [
                {
                    type: 'Dropdown',
                    options: [['1', 'adc1'], ['2', 'adc2'], ['3', 'adc3'], ['4', 'adc4']],
                    value: 'adc1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
                type: 'hummingbird_rotaryValue',
            },
            paramsKeyMap: {
                DEVICE: 0,
            },
            class: 'hummingbird_sensor',
            isNotFor: ['hummingbird'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;
                var dev = script.getField('DEVICE');
                var rotary_value = Math.round(pd[dev] * 100 / 1024);
                //if (rotary_value == 0) rotary_value = 1;
                return rotary_value;
            },
            syntax: { js: [], py: [] },
        },

        //진동모터
        hummingbird_vibeMotor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            template: 'HB 진동모터 %1번 세기: %2 %3',
            params: [
                {
                    type: 'Dropdown',
                    options: [['1', 'vibeMotor1'], ['2', 'vibeMotor2']],
                    value: 'vibeMotor1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                    null,
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'hummingbird_vibeMotor',
            },
            paramsKeyMap: {
                DEVICE: 0,
                VALUE: 1,
            },
            class: 'hummingbird_motor',
            isNotFor: ['hummingbird'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var dev = script.getStringField('DEVICE', script);
                var value = script.getNumberValue('VALUE', script);

                if (value > 100) value = 127;
                else if (value < 0) value = 0;
                else value = Math.floor(value * 1.27); // 0 ~ 127

                if (dev == 'vibeMotor1') sq.vibrat1 = value;
                else if (dev == 'vibeMotor2') sq.vibrat2 = value;
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },

        //서보모터
        hummingbird_servo: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            template: 'HB 서보모터 %1번 각도: %2 %3',
            params: [
                {
                    type: 'Dropdown',
                    options: [['1', 'servo1'], ['2', 'servo2'], ['3', 'servo3'], ['4', 'servo4']],
                    value: 'servo1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                    null,
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'hummingbird_servo',
            },
            paramsKeyMap: {
                DEVICE: 0,
                VALUE: 1,
            },
            class: 'hummingbird_motor',
            isNotFor: ['hummingbird'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var mtype = script.getStringField('DEVICE', script);
                var angle = script.getNumberValue('VALUE', script);

                if (angle < 0) angle = 0;
                else if (angle > 180) angle = 180;

                if (mtype == 'servo1') sq.servo1 = angle;
                else if (mtype == 'servo2') sq.servo2 = angle;
                else if (mtype == 'servo3') sq.servo3 = angle;
                else if (mtype == 'servo4') sq.servo4 = angle;
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },

        //기어모터
        hummingbird_dcMotor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            template: 'HB 기어모터 %1번 속도: %2 %3',
            params: [
                {
                    type: 'Dropdown',
                    options: [['1', 'dcMotor1'], ['2', 'dcMotor2']],
                    value: 'dcMotor1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                    null,
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'hummingbird_dcMotor',
            },
            paramsKeyMap: {
                DEVICE: 0,
                VALUE: 1,
            },
            class: 'hummingbird_motor',
            isNotFor: ['hummingbird'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var dir = script.getStringField('DEVICE', script);
                var speed = script.getNumberValue('VALUE', script);

                if (speed == 0) speed = 256;
                else if (speed > 100) speed = 127;
                else if (speed < -100) speed = -127;
                else speed = Math.floor(speed * 1.27); // range : -127~127

                if (dir == 'dcMotor1') sq.dcMotor1 = speed;
                else if (dir == 'dcMotor2') sq.dcMotor2 = speed;
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },

        // 단색LED
        hummingbird_led: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            template: 'HB 단색LED %1번 밝기: %2 %3',
            params: [
                {
                    type: 'Dropdown',
                    options: [['1', 'led1'], ['2', 'led2'], ['3', 'led3'], ['4', 'led4']],
                    value: 'led1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                    null,
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'hummingbird_led',
            },
            paramsKeyMap: {
                DEVICE: 0,
                VALUE: 1,
            },
            class: 'hummingbird_led',
            isNotFor: ['hummingbird'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var ledtype = script.getStringField('DEVICE', script);
                var value = script.getNumberValue('VALUE', script);
                if (value > 100) value = 100;
                if (value < 0) value = 0;
                value = Math.floor(value * 2.55);

                if (ledtype == 'led1') sq.led1 = value;
                else if (ledtype == 'led2') sq.led2 = value;
                else if (ledtype == 'led3') sq.led3 = value;
                else if (ledtype == 'led4') sq.led4 = value;
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },

        // 삼색LED
        hummingbird_triLED: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            template: 'HB 삼색LED %1번 빨강%2 초록%3 파랑%4 %5',
            params: [
                {
                    type: 'Dropdown',
                    options: [['1', 'triLED1'], ['2', 'triLED2']],
                    value: 'triLED1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                    null,
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
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'hummingbird_triLED',
            },
            paramsKeyMap: {
                DEVICE: 0,
                cRED: 1,
                cGREEN: 2,
                cBLUE: 3,
            },
            class: 'hummingbird_led',
            isNotFor: ['hummingbird'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var ledtype = script.getStringField('DEVICE', script);
                var colorRed = script.getNumberValue('cRED', script);
                var colorGreen = script.getNumberValue('cGREEN', script);
                var colorBlue = script.getNumberValue('cBLUE', script);

                if (colorRed > 100) colorRed = 100;
                if (colorGreen > 100) colorGreen = 100;
                if (colorBlue > 100) colorBlue = 100;
                if (colorRed < 0) colorRed = 0;
                if (colorGreen < 0) colorGreen = 0;
                if (colorBlue < 0) colorBlue = 0;

                colorRed = Math.floor(colorRed * 2.55);
                colorGreen = Math.floor(colorGreen * 2.55);
                colorBlue = Math.floor(colorBlue * 2.55);

                if (ledtype == 'triLED1') {
                    sq.triLEDR1 = colorRed;
                    sq.triLEDG1 = colorGreen;
                    sq.triLEDB1 = colorBlue;
                } else if (ledtype == 'triLED2') {
                    sq.triLEDR2 = colorRed;
                    sq.triLEDG2 = colorGreen;
                    sq.triLEDB2 = colorBlue;
                }
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        //endregion hummingbird 허밍버드
    };
};

module.exports = Entry.hummingbird;
