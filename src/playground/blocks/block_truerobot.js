'use strict';

Entry.trueRobot = {
    name: 'trueRobot',
    PORT_MAP: {
        singlemotor: 0x0a,
        dualmotor: 0x0a,
        colorled: 0x08,
        leds: 0x46,
        linetracer: 0x4c,
        led_line: 0x05,
        leftWheel: 0x09,
        rightWheel: 0x0a,
        allWheel: 0x0b,
        colorRed: 0,
        colorGreen: 0,
        colorBlue: 0,
        ledPort: 0,
        dualPort: 11,
    },
    setZero: function() {
        var portMap = Entry.trueRobot.PORT_MAP;
        var sq = Entry.hw.sendQueue;
        for (var port in portMap) {
            sq[port] = portMap[port];
        }
        Entry.hw.update();
        /*
        var trueRobot = Entry.trueRobot.DeviceID;
        trueRobot.leftWheel = 0;
        trueRobot.rightWheel = 0;
        trueRobot.colorRed = 0;
        trueRobot.colorGreen = 0;
        trueRobot.colorBlue = 0;
	*/
    },
};

Entry.trueRobot.getBlocks = function() {
    return {
        //region TrueTrueRobot 뚜루뚜루로봇
        truetrue_get_linesensor: {
            color: '#00979D',
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['Left_Out', 'L2'],
                        ['Left_In', 'L1'],
                        ['Right_In', 'R1'],
                        ['Right_Out', 'R2'],
                    ],
                    value: 'Left_Out',
                    fontSize: 11,
                },
            ],
            events: {},
            def: {
                params: ['L2'],
                type: 'truetrue_get_linesensor',
            },
            paramsKeyMap: {
                position: 0,
            },
            class: 'trueRobot_sensor',
            isNotFor: ['trueRobot'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;
                var dev = script.getField('position');
                return pd[dev];
            },
            syntax: { js: [], py: [] },
        },
        truetrue_get_proxisensor: {
            color: '#00979D',
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['Left', 'ProxiLeft'], ['Right', 'ProxiRight']],
                    value: 'Left',
                    fontSize: 11,
                },
            ],
            events: {},
            def: {
                params: ['ProxiLeft'],
                type: 'truetrue_get_proxisensor',
            },
            paramsKeyMap: {
                position: 0,
            },
            class: 'trueRobot_sensor',
            isNotFor: ['trueRobot'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;
                var dev = script.getField('position');
                return pd[dev];
            },
            syntax: { js: [], py: [] },
        },
        truetrue_get_accsensor: {
            color: '#00979D',
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['X-axis', 'AccX'],
                        ['Y-axis', 'AccY'],
                        ['Z-axis', 'AccZ'],
                        ['Tilt', 'AccStatus'],
                    ],
                    value: 'X-axis',
                    fontSize: 11,
                },
            ],
            events: {},
            def: {
                params: ['AccX'],
                type: 'truetrue_get_accsensor',
            },
            paramsKeyMap: {
                position: 0,
            },
            class: 'trueRobot_sensor',
            isNotFor: ['trueRobot'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;
                var dev = script.getField('position');
                return pd[dev];
            },
            syntax: { js: [], py: [] },
        },
        truetrue_get_bottomcolorsensor: {
            color: '#00979D',
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['Red', 'BColorRed'],
                        ['Green', 'BColorGreen'],
                        ['Blue', 'BColorBlue'],
                        ['ColorKey', 'BColorKey'],
                    ],
                    value: 'Red',
                    fontSize: 11,
                },
            ],
            events: {},
            def: {
                params: ['BColorRed'],
                type: 'truetrue_get_bottomcolorsensor',
            },
            paramsKeyMap: {
                position: 0,
            },
            class: 'trueRobot_sensor',
            isNotFor: ['trueRobot'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;
                var dev = script.getField('position');
                return pd[dev];
            },
            syntax: { js: [], py: [] },
        },
        truetrue_get_frontcolorsensor: {
            color: '#00979D',
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['Left', 'FColorLeftKey'],
                        ['Right', 'FColorRightKey'],
                    ],
                    value: 'Left',
                    fontSize: 11,
                },
            ],
            events: {},
            def: {
                params: ['FColorLeftKey'],
                type: 'truetrue_get_frontcolorsensor',
            },
            paramsKeyMap: {
                position: 0,
            },
            class: 'trueRobot_sensor',
            isNotFor: ['trueRobot'],
            func: function(sprite, script) {
                var pd = Entry.hw.portData;
                var dev = script.getField('position');
                return pd[dev];
            },
            syntax: { js: [], py: [] },
        },
        truetrue_set_singlemotor: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['Left', '9'], ['Right', '10']],
                    value: 'Left',
                    fontSize: 11,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: ['9', '0', null],
                type: 'truetrue_set_singlemotor',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'trueRobot_control',
            isNotFor: ['trueRobot'],
            func: function(sprite, script) {
                var device = Entry.trueRobot.PORT_MAP.singlemotor;
                var value = script.getNumberValue('VALUE');
                value = Math.round(value);
                value = Math.max(value, -100);
                value = Math.min(value, 100);
                //set two bytes.
                var speed = 0;
                var direction = 0;
                if (value < 0) {
                    speed = -1 * value;
                    direction = 1;
                } else {
                    speed = value;
                    direction = 0;
                }
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }

                Entry.hw.sendQueue['SET'][device] = {
                    port: script.getNumberField('PORT'),
                    dataA: speed,
                    dataB: direction,
                    dataC: 0,
                };

                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        truetrue_set_dualmotor: {
            color: '#00979D',
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: ['0', '0', '0', null],
                type: 'truetrue_set_dualmotor',
            },
            paramsKeyMap: {
                leftValue: 0,
                rightValue: 1,
                delayValue: 2,
            },
            class: 'trueRobot_control',
            isNotFor: ['trueRobot'],
            func: function(sprite, script) {
                var device = Entry.trueRobot.PORT_MAP.dualmotor;

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }

                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;

                    var leftValue = script.getNumberValue('leftValue');
                    leftValue = Math.round(leftValue);
                    leftValue = Math.max(leftValue, -100);
                    leftValue = Math.min(leftValue, 100);

                    var rightValue = script.getNumberValue('rightValue');
                    rightValue = Math.round(rightValue);
                    rightValue = Math.max(rightValue, -100);
                    rightValue = Math.min(rightValue, 100);

                    var delayValue = script.getNumberValue('delayValue');
                    delayValue = Math.round(delayValue);
                    delayValue = Math.max(delayValue, -100);
                    delayValue = Math.min(delayValue, 100);

                    Entry.hw.sendQueue['SET'][device] = {
                        port: Entry.trueRobot.PORT_MAP.dualPort,
                        dataA: leftValue,
                        dataB: rightValue,
                        dataC: delayValue,
                    };

                    var timeValue = script.getNumberValue('delayValue');
                    timeValue = Math.round(timeValue);
                    timeValue = Math.max(timeValue, -100);
                    timeValue = Math.min(timeValue, 100);
                    var fps = Entry.FPS || 60;
                    timeValue = 60 / fps * timeValue * 1000;
                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;

                    Entry.hw.sendQueue['SET'][device] = {
                        port: Entry.trueRobot.PORT_MAP.dualPort,
                        dataA: 0,
                        dataB: 0,
                        dataC: 0,
                    };

                    return script.callReturn();
                }
            },
            syntax: { js: [], py: [] },
        },
        truetrue_set_colorled: {
            color: '#00979D',
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: ['0', '0', '0', null],
                type: 'truetrue_set_colorled',
            },
            paramsKeyMap: {
                redColor: 0,
                greenColor: 1,
                blueColor: 2,
            },
            class: 'trueRobot_control',
            isNotFor: ['trueRobot'],
            func: function(sprite, script) {
                var device = Entry.trueRobot.PORT_MAP.colorled;

                var redColor = script.getNumberValue('redColor');
                redColor = Math.round(redColor);
                redColor = Math.max(redColor, 0);
                redColor = Math.min(redColor, 255);

                var greenColor = script.getNumberValue('greenColor');
                greenColor = Math.round(greenColor);
                greenColor = Math.max(greenColor, 0);
                greenColor = Math.min(greenColor, 255);

                var blueColor = script.getNumberValue('blueColor');
                blueColor = Math.round(blueColor);
                blueColor = Math.max(blueColor, 0);
                blueColor = Math.min(blueColor, 255);

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][device] = {
                    port: Entry.trueRobot.PORT_MAP.colorled,
                    dataA: redColor,
                    dataB: greenColor,
                    dataC: blueColor,
                };
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        truetrue_set_led_proxi: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['근접센서왼쪽', 9], ['근접센서오른쪽', 10]],
                    value: '근접센서왼쪽',
                    fontSize: 11,
                },
                {
                    type: 'Dropdown',
                    options: [['켜기', 'on'], ['끄기', 'off']],
                    value: '켜기',
                    fontSize: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [9, 'on', null],
                type: 'truetrue_set_led_proxi',
            },
            paramsKeyMap: {
                PORT: 0,
                ONOFF: 1,
            },
            class: 'trueRobot_control',
            isNotFor: ['trueRobot'],
            func: function(sprite, script) {
                var device = Entry.trueRobot.PORT_MAP.leds;

                var onoff = script.getField('ONOFF');
                var value = onoff == 'on' ? 1 : 0;

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][device] = {
                    port: script.getNumberField('PORT'),
                    dataA: value,
                    dataB: 0x07,
                    dataC: 0x07,
                };
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        truetrue_set_led_colorsensor: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['전면컬러센서', 3], ['바닥컬러센서', 4]],
                    value: '전면컬러센서',
                    fontSize: 11,
                },
                {
                    type: 'Dropdown',
                    options: [['켜기', 'on'], ['끄기', 'off']],
                    value: '켜기',
                    fontSize: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [3, 'on', null],
                type: 'truetrue_set_led_colorsensor',
            },
            paramsKeyMap: {
                PORT: 0,
                ONOFF: 1,
            },
            class: 'trueRobot_control',
            isNotFor: ['trueRobot'],
            func: function(sprite, script) {
                var device = Entry.trueRobot.PORT_MAP.leds;

                var onoff = script.getField('ONOFF');
                var value = onoff == 'on' ? 1 : 0;

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][device] = {
                    port: script.getNumberField('PORT'),
                    dataA: value,
                    dataB: 0x07,
                    dataC: 0x07,
                };
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        truetrue_set_led_linesensor: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['켜기', 'on'], ['끄기', 'off']],
                    value: '켜기',
                    fontSize: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: ['on', null],
                type: 'truetrue_set_led_linesensor',
            },
            paramsKeyMap: {
                ONOFF: 0,
            },
            class: 'trueRobot_control',
            isNotFor: ['trueRobot'],
            func: function(sprite, script) {
                var device = Entry.trueRobot.PORT_MAP.leds;

                var onoff = script.getField('ONOFF');
                var value = onoff == 'on' ? 1 : 0;

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][device] = {
                    port: Entry.trueRobot.PORT_MAP.led_line,
                    dataA: value,
                    dataB: 0x07,
                    dataC: 0x07,
                };
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        truetrue_set_linetracer: {
            color: '#00979D',
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [['켜기', 'on'], ['끄기', 'off']],
                    value: '켜기',
                    fontSize: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_03.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: ['on', null],
                type: 'truetrue_set_linetracer',
            },
            paramsKeyMap: {
                ONOFF: 0,
            },
            class: 'trueRobot_control',
            isNotFor: ['trueRobot'],
            func: function(sprite, script) {
                var device = Entry.trueRobot.PORT_MAP.linetracer;

                var onoff = script.getField('ONOFF');
                var value = onoff == 'on' ? 1 : 0;

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][device] = {
                    port: Entry.trueRobot.PORT_MAP.led_line,
                    dataA: value,
                    dataB: 0x07,
                    dataC: 0x07,
                };
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        //endregion TrueTrueRobot 뚜루뚜루로봇
    };
};
