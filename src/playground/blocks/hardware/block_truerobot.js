'use strict';

Entry.trueRobot = {
    id: '19.1',
    name: 'trueRobot',
    url: 'http://www.i-screammedia.co.kr',
    imageName: 'truetrue.png',
    delayTime: 30,
    title: {
		ko: '뚜루뚜루',
        en: 'TrueTrueRobot',
    },
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
        linePort: 0xf0,
    },
    setZero: function() {
		
		
        Entry.hw.sendQueue['SET'] = {};
        
		Entry.hw.sendQueue.leftValue = 0;
		Entry.hw.sendQueue.rightValue = 0;	
		Entry.hw.sendQueue['SET'][Entry.trueRobot.PORT_MAP.dualmotor] = {
                        port: Entry.trueRobot.PORT_MAP.dualPort,
                        dataA: 0,
                        dataB: 0,
                        dataC: 1,
	    };

		Entry.hw.update();


		Entry.hw.sendQueue['SET'][Entry.trueRobot.PORT_MAP.colorled] = {
				port: Entry.trueRobot.PORT_MAP.colorled,
				dataA: 0,
				dataB: 0,
				dataC: 255,
		};
		
		Entry.hw.update();
			

		Entry.hw.sendQueue['SET'] = {};
		Entry.hw.sendQueue['SET'][Entry.trueRobot.PORT_MAP.linetracer] = {
                        port: Entry.trueRobot.PORT_MAP.led_line,
                        dataA: 0,
                        dataB: 0x07,
                        dataC: 0x07,
                    };

		Entry.hw.update();

		var portArray = new Array(4,9,10);

		Entry.hw.sendQueue['SET'] = {};

		var settimer = 100
			for( var port in  portArray ){
				var tempport = 0;
			
				setTimeout(function() {
					Entry.hw.sendQueue['SET'][Entry.trueRobot.PORT_MAP.leds] = {
                        port: portArray[tempport],
                        dataA: 1,
                        dataB: 0x07,
                        dataC: 0x07,
                    };
					
						Entry.hw.update();
						tempport++;	
						settimer = settimer + 30;
						}, settimer);
		
			}


    },
	monitorTemplate: {
		imgPath: 'hw/truebot.png',
		width: 254,
        height: 377,
        listPorts: {
			AccX: {
                name: 'acc X',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
			AccY: {
                name: 'acc Y',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
			AccZ: {
                name: 'acc Z',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
			AccStatus: {
                name: 'acc Tilt',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
			BColorRed: {
                name: 'bottom R Value',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
			BColorGreen: {
                name: 'bottom G Value',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
			BColorBlue: {
                name: 'bottom B Value',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
			BColorKey: {
                name: 'bottom Color Key',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
			leftValue: {
                name: 'leftValue',
                type: 'output',
                pos: { x: 0, y: 0 },
            },
			rightValue: {
                name: 'rightValue',
                type: 'output',
                pos: { x: 0, y: 0 },
            },
			
		},
		ports: {
			FColorLeftKey: {
                name: 'frontcolor Left',
                type: 'input',
                pos: { x: 135, y: 170 },
            },
			FColorRightKey: {
                name: 'frontcolor Right',
                type: 'input',
                pos: { x: 115, y: 170 },
            },
			ProxiRight: {
                name: 'proxi right',
                type: 'input',
                pos: { x: 102, y: 260 },
            },
			ProxiLeft: {
                name: 'proxi left',
                type: 'input',
                pos: { x: 155, y: 260 },
            },

			L2: {
                name: 'line Left Out',
                type: 'input',
                pos: { x: 50, y: 360 },
            },
			L1: {
                name: 'line Left In',
                type: 'input',
                pos: { x: 80, y: 360 },
            },
			R1: {
                name: 'line Right In',
                type: 'input',
                pos: { x: 170, y: 360 },
            },
			R2: {
                name: 'line Right Out',
                type: 'input',
                pos: { x: 200, y: 360 },
            },
            
		},
        mode: 'both',
    },


};

Entry.trueRobot.blockMenuBlocks = [
    //truetrue
    'truetrue_get_linesensor',
    'truetrue_get_proxisensor',
    'truetrue_get_accsensor',
    'truetrue_get_bottomcolorsensor',
    'truetrue_get_frontcolorsensor',
    'truetrue_set_singlemotor',
    'truetrue_set_dualmotor',
    'truetrue_set_colorled',
    'truetrue_set_led_proxi',
    'truetrue_set_led_colorsensor',
    'truetrue_set_led_linesensor',
    'truetrue_set_linetracer',
    'truetrue_set_head_colorled',
    'truetrue_set_move',
    'truetrue_set_sec_move',
    'truetrue_set_rotate',
    'truetrue_set_sec_rotate',
    'truetrue_set_grid_block',
    'truetrue_set_grid_rotate',
];

Entry.trueRobot.getBlocks = function() {
    return {
        //region TrueTrueRobot 뚜루뚜루로봇
        truetrue_get_linesensor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.truetruebot_left+' 2', 'L2'],
                        [Lang.Blocks.truetruebot_left+' 1', 'L1'],
                        [Lang.Blocks.truetruebot_right+' 1', 'R1'],
                        [Lang.Blocks.truetruebot_right+' 2', 'R2'],
                    ],
                    value: 'Left_Out',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
            syntax: {
				js: [],
				py: [
					{
						syntax: 'trueRobot.get_linesensor(%1)',
						textParams: [
							{
								type: 'Dropdown',
								options: [
								[Lang.Blocks.truetruebot_left+' 2', 'L2'],
								[Lang.Blocks.truetruebot_left+' 1', 'L1'],
								[Lang.Blocks.truetruebot_right+' 1', 'R1'],
								[Lang.Blocks.truetruebot_right+' 2', 'R2'],
								],
								value: 'Left_Out',
								fontSize: 11,
								bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
								arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
								converter: Entry.block.converters.returnStringValue,
							},
						],						
					},
				],
			},
        },
        truetrue_get_proxisensor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [[Lang.Blocks.truetruebot_left, 'ProxiLeft'], [Lang.Blocks.truetruebot_right, 'ProxiRight']],
                    value: 'Left',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
				
				Entry.trueRobot.monitorTemplate.listPorts.temperature = pd[dev];
					
                return pd[dev];
            },
            syntax: {
				js: [],
				py: [
					{
						syntax: 'trueRobot.get_proxisensor(%1)',
						textParams: [
							{
								type: 'Dropdown',
								options: [[Lang.Blocks.truetruebot_left, 'ProxiLeft'], [Lang.Blocks.truetruebot_right, 'ProxiRight']],
								value: 'Left',
								fontSize: 11,
								bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
								arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
								converter: Entry.block.converters.returnStringValue,
							},
						],						
					},
				],
			},
        },
        truetrue_get_accsensor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.truetruebot_Xaxis, 'AccX'],
                        [Lang.Blocks.truetruebot_Yaxis, 'AccY'],
                        [Lang.Blocks.truetruebot_Zaxis, 'AccZ'],
                        [Lang.Blocks.truetruebot_Tilt, 'AccStatus'],
                    ],
                    value: 'X-axis',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
            syntax: {
				js: [],
				py: [
					{
						syntax: 'trueRobot.get_accsensor(%1)',
						textParams: [
							{
								type: 'Dropdown',
								options: [
									[Lang.Blocks.truetruebot_Xaxis, 'AccX'],
									[Lang.Blocks.truetruebot_Yaxis, 'AccY'],
									[Lang.Blocks.truetruebot_Zaxis, 'AccZ'],
									[Lang.Blocks.truetruebot_Tilt, 'AccStatus'],
								],
								value: 'X-axis',
								fontSize: 11,
								bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
								arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
								converter: Entry.block.converters.returnStringValue,
							},
						],						
					},
				],
			},
        },
        truetrue_get_bottomcolorsensor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.truetruebot_head_color_red, 'BColorRed'],
                        [Lang.Blocks.truetruebot_head_color_green, 'BColorGreen'],
                        [Lang.Blocks.truetruebot_head_color_blue, 'BColorBlue'],
                        [Lang.Blocks.truetruebot_ColorKey, 'BColorKey'],
                    ],
                    value: 'Red',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
            syntax: {
				js: [],
				py: [
					{
						syntax: 'trueRobot.get_bottomcolorsensor(%1)',
						textParams: [
							{
								type: 'Dropdown',
								options: [
									[Lang.Blocks.truetruebot_head_color_red, 'BColorRed'],
									[Lang.Blocks.truetruebot_head_color_green, 'BColorGreen'],
									[Lang.Blocks.truetruebot_head_color_blue, 'BColorBlue'],
									[Lang.Blocks.truetruebot_ColorKey, 'BColorKey'],
								],
								value: 'Red',
								fontSize: 11,
								bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
								arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
								converter: Entry.block.converters.returnStringValue,
							},
						],						
					},
				],
			},
        },
        truetrue_get_frontcolorsensor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [[Lang.Blocks.truetruebot_left, 'FColorLeftKey'], [Lang.Blocks.truetruebot_right, 'FColorRightKey']],
                    value: 'Left',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
            syntax: {
				js: [],
				py: [
					{
						syntax: 'trueRobot.get_frontcolorsensor(%1)',
						textParams: [
							{
								type: 'Dropdown',
								options: [[Lang.Blocks.truetruebot_left, 'FColorLeftKey'], [Lang.Blocks.truetruebot_right, 'FColorRightKey']],
								value: 'Left',
								fontSize: 11,
								bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
								arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
								converter: Entry.block.converters.returnStringValue,
							},
						],						
					},
				],
			},
        },
        truetrue_set_singlemotor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [[Lang.Blocks.truetruebot_left, '9'], [Lang.Blocks.truetruebot_right, '10'], ['All', '11']],
                    value: 'Left',
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

                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;

                    if (script.getNumberField('PORT') == 11) {
                        device = Entry.trueRobot.PORT_MAP.dualmotor;
                        Entry.hw.sendQueue['SET'][device] = {
                            port: script.getNumberField('PORT'),
                            dataA: value,
                            dataB: value,
                            dataC: 1,
                        };
                    } else {
                        Entry.hw.sendQueue['SET'][device] = {
                            port: script.getNumberField('PORT'),
                            dataA: speed,
                            dataB: direction,
                            dataC: 0,
                        };
                    }
                    var myTimer = setTimeout(function() {
                        script.timeFlag = 2;
                    }, Entry.trueRobot.delayTime);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else if (script.timeFlag == 2) {
                    clearTimeout(myTimer);
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
				js: [],
				py: [
					{
						syntax: 'trueRobot.set_singlemotor(%1, %2)',
						textParams: [
							{
								type: 'Dropdown',
								options: [[Lang.Blocks.truetruebot_left, '9'], [Lang.Blocks.truetruebot_right, '10'], ['All', '11']],
								value: 'Left',
								fontSize: 11,
								bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
								arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
								converter: Entry.block.converters.returnStringOrNumberByValue,
							},
							{
								type: 'Block',
								accept: 'string',
							},
						],
					},
				],
			},
        },
        truetrue_set_dualmotor: {
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: ['0', '0', '1', null],
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

					Entry.hw.sendQueue.leftValue = leftValue;
					Entry.hw.sendQueue.rightValue = rightValue;
                    Entry.hw.sendQueue['SET'][device] = {
                        port: Entry.trueRobot.PORT_MAP.dualPort,
                        dataA: leftValue,
                        dataB: rightValue,
                        dataC: delayValue,
                    };

                    var timeValue = script.getNumberValue('delayValue');

                    if (timeValue == 0) {
                        var myTimer = setTimeout(function() {
                            script.timeFlag = 2;
                        }, Entry.trueRobot.delayTime);
                        return script;
                    }

                    timeValue = Math.round(timeValue);
                    timeValue = Math.max(timeValue, -100);
                    timeValue = Math.min(timeValue, 100);
                    var fps = Entry.FPS || 60;
                    timeValue = 60 / fps * timeValue * 1000;
                    var myTimer = setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else if (script.timeFlag == 2) {
                    clearTimeout(myTimer);
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                } else {
                    Entry.engine.isContinue = false;
					Entry.hw.sendQueue.leftValue = 0;
					Entry.hw.sendQueue.rightValue = 0;
                    Entry.hw.sendQueue['SET'][device] = {
                        port: Entry.trueRobot.PORT_MAP.dualPort,
                        dataA: 0,
                        dataB: 0,
                        dataC: 0,
                    };
                    var myTimer = setTimeout(function() {
                        script.timeFlag = 2;
                    }, Entry.trueRobot.delayTime);
                    return script;
                }
            },
            syntax: {
				js: [],
				py: [
					{
						syntax: 'trueRobot.set_dualmotor(%1, %2 , %3)',
						textParams: [
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
						],
					},
				],
			},
        },
        truetrue_set_colorled: {
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
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

                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;

                    Entry.hw.sendQueue['SET'][device] = {
                        port: Entry.trueRobot.PORT_MAP.colorled,
                        dataA: redColor,
                        dataB: greenColor,
                        dataC: blueColor,
                    };

                    var myTimer = setTimeout(function() {
                        script.timeFlag = 2;
                    }, Entry.trueRobot.delayTime);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else if (script.timeFlag == 2) {
                    clearTimeout(myTimer);
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
				js: [],
				py: [
					{
						syntax: 'trueRobot.set_colorled(%1, %2 , %3)',
						textParams: [
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
						],
					},
				],
			},
        },
        truetrue_set_led_proxi: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.truetruebot_front_near_left, 9],
                        [Lang.Blocks.truetruebot_front_near_right, 10],
                    ],
                    value: 9,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.truetruebot_on, 'on'],
                        [Lang.Blocks.truetruebot_off, 'off'],
                    ],
                    value: 'on',
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

                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;

                    Entry.hw.sendQueue['SET'][device] = {
                        port: script.getNumberField('PORT'),
                        dataA: value,
                        dataB: 0x07,
                        dataC: 0x07,
                    };
                    var myTimer = setTimeout(function() {
                        script.timeFlag = 2;
                    }, Entry.trueRobot.delayTime);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else if (script.timeFlag == 2) {
                    clearTimeout(myTimer);
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
			syntax: {
				js: [],
				py: [
					{
						syntax: 'trueRobot.set_led_proxi(%1, %2)',
						textParams: [
							{
								type: 'Dropdown',
								options: [
									[Lang.Blocks.truetruebot_front_near_left, 9],
									[Lang.Blocks.truetruebot_front_near_right, 10],
								],
								value: 9,
								fontSize: 11,
								bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
								arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
								converter: Entry.block.converters.returnStringOrNumberByValue,
							},
							{
								type: 'Dropdown',
								options: [
									[Lang.Blocks.truetruebot_on, 'on'],
									[Lang.Blocks.truetruebot_off, 'off'],
								],
								value: 'on',
								fontSize: 11,
								bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
								arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
								converter: Entry.block.converters.returnStringValue,
							},
						],
					},
				],
			},
		},
        truetrue_set_led_colorsensor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.truetruebot_front_color, 3],
                        [Lang.Blocks.truetruebot_bottom_color, 4],
                    ],
                    value: 3,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.truetruebot_on, 'on'],
                        [Lang.Blocks.truetruebot_off, 'off'],
                    ],
                    value: 'on',
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

                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;

                    Entry.hw.sendQueue['SET'][device] = {
                        port: script.getNumberField('PORT'),
                        dataA: value,
                        dataB: 0x07,
                        dataC: 0x07,
                    };

                    var myTimer = setTimeout(function() {
                        script.timeFlag = 2;
                    }, Entry.trueRobot.delayTime);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else if (script.timeFlag == 2) {
                    clearTimeout(myTimer);
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
				js: [],
				py: [
					{
						syntax: 'trueRobot.set_led_colorsensor(%1, %2)',
						textParams: [
							{
								type: 'Dropdown',
								options: [
									[Lang.Blocks.truetruebot_front_color, 3],
									[Lang.Blocks.truetruebot_bottom_color, 4],
								],
								value: 3,
								fontSize: 11,
								bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
								arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
								converter: Entry.block.converters.returnStringOrNumberByValue,
							},
							{
								type: 'Dropdown',
								options: [
									[Lang.Blocks.truetruebot_on, 'on'],
									[Lang.Blocks.truetruebot_off, 'off'],
								],
								value: 'on',
								fontSize: 11,
								bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
								arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
								converter: Entry.block.converters.returnStringValue,
							},
						],
					},
				],
			},
        },
        truetrue_set_led_linesensor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.truetruebot_on, 'on'],
                        [Lang.Blocks.truetruebot_off, 'off'],
                    ],
                    value: 'on',
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

                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;

                    Entry.hw.sendQueue['SET'][device] = {
                        port: Entry.trueRobot.PORT_MAP.led_line,
                        dataA: value,
                        dataB: 0x07,
                        dataC: 0x07,
                    };
                    var myTimer = setTimeout(function() {
                        script.timeFlag = 2;
                    }, Entry.trueRobot.delayTime);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else if (script.timeFlag == 2) {
                    clearTimeout(myTimer);
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
				js: [],
				py: [
					{
						syntax: 'trueRobot.set_led_linesensor(%1)',
						textParams: [
							{
								type: 'Dropdown',
								options: [
									[Lang.Blocks.truetruebot_on, 'on'],
									[Lang.Blocks.truetruebot_off, 'off'],
								],
								value: 'on',
								fontSize: 11,
								bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
								arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
								converter: Entry.block.converters.returnStringValue,
							},
						],
					},
				],
			},
        },
        truetrue_set_linetracer: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.truetruebot_on, 'on'],
                        [Lang.Blocks.truetruebot_off, 'off'],
                    ],
                    value: 'on',
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

                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;

                    Entry.hw.sendQueue['SET'][device] = {
                        port: Entry.trueRobot.PORT_MAP.led_line,
                        dataA: value,
                        dataB: 0x07,
                        dataC: 0x07,
                    };

                    var myTimer = setTimeout(function() {
                        script.timeFlag = 2;
                    }, Entry.trueRobot.delayTime);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else if (script.timeFlag == 2) {
                    clearTimeout(myTimer);
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
				js: [],
				py: [
					{
						syntax: 'trueRobot.set_linetracer(%1)',
						textParams: [
							{
								type: 'Dropdown',
								options: [
									[Lang.Blocks.truetruebot_on, 'on'],
									[Lang.Blocks.truetruebot_off, 'off'],
								],
								value: 'on',
								fontSize: 11,
								bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
								arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
								converter: Entry.block.converters.returnStringValue,
							},
						],
					},
				],
			},
        },
        truetrue_set_head_colorled: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.truetruebot_head_color_white, 101],
                        [Lang.Blocks.truetruebot_head_color_red, 102],
                        [Lang.Blocks.truetruebot_head_color_green, 103],
                        [Lang.Blocks.truetruebot_head_color_blue, 104],
                        [Lang.Blocks.truetruebot_head_color_cyan, 105],
                        [Lang.Blocks.truetruebot_head_color_magenta, 106],
                        [Lang.Blocks.truetruebot_head_color_yellow, 107],
                        [Lang.Blocks.truetruebot_head_color_off, 100],
                    ],
                    value: 101,
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
                params: [101, null],
                type: 'truetrue_set_head_colorled',
            },
            paramsKeyMap: {
                headColor: 0,
            },
            class: 'trueRobot_control',
            isNotFor: ['trueRobot'],
            func: function(sprite, script) {
                var device = Entry.trueRobot.PORT_MAP.colorled;

                var headColor = script.getField('headColor');

                var redColor;
                var greenColor;
                var blueColor;

                if (headColor == 101) {
                    redColor = 255;
                    greenColor = 255;
                    blueColor = 255;
                } else if (headColor == 102) {
                    redColor = 255;
                    greenColor = 0;
                    blueColor = 0;
                } else if (headColor == 103) {
                    redColor = 0;
                    greenColor = 255;
                    blueColor = 0;
                } else if (headColor == 104) {
                    redColor = 0;
                    greenColor = 0;
                    blueColor = 255;
                } else if (headColor == 105) {
                    redColor = 0;
                    greenColor = 255;
                    blueColor = 255;
                } else if (headColor == 106) {
                    redColor = 255;
                    greenColor = 0;
                    blueColor = 255;
                } else if (headColor == 107) {
                    redColor = 255;
                    greenColor = 255;
                    blueColor = 0;
                } else if (headColor == 100) {
                    redColor = 0;
                    greenColor = 0;
                    blueColor = 0;
                }

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }

                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;

                    Entry.hw.sendQueue['SET'][device] = {
                        port: Entry.trueRobot.PORT_MAP.colorled,
                        dataA: redColor,
                        dataB: greenColor,
                        dataC: blueColor,
                    };

                    var myTimer = setTimeout(function() {
                        script.timeFlag = 2;
                    }, Entry.trueRobot.delayTime);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else if (script.timeFlag == 2) {
                    clearTimeout(myTimer);
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
				js: [],
				py: [
					{
						syntax: 'trueRobot.set_head_colorled(%1)',
						textParams: [
							{
								type: 'Dropdown',
								options: [
									[Lang.Blocks.truetruebot_head_color_white, 101],
									[Lang.Blocks.truetruebot_head_color_red, 102],
									[Lang.Blocks.truetruebot_head_color_green, 103],
									[Lang.Blocks.truetruebot_head_color_blue, 104],
									[Lang.Blocks.truetruebot_head_color_cyan, 105],
									[Lang.Blocks.truetruebot_head_color_magenta, 106],
									[Lang.Blocks.truetruebot_head_color_yellow, 107],
									[Lang.Blocks.truetruebot_head_color_off, 100],
								],
								value: 101,
								fontSize: 11,
								bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
								arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
								converter: Entry.block.converters.returnStringOrNumberByValue,
							},
						],
					},
				],
			},
        },
        truetrue_set_move: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.truetruebot_move_forward, 101],
                        [Lang.Blocks.truetruebot_move_backward, 102],
                    ],
                    value: 101,
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
                params: [101, null],
                type: 'truetrue_set_move',
            },
            paramsKeyMap: {
                moveValue: 0,
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

                    var moveValue = script.getField('moveValue');
                    var leftValue;
                    var rightValue;
                    var delayValue;

                    if (moveValue == 101) {
                        leftValue = 100;
                        rightValue = 100;
                        delayValue = 0;
                    } else if (moveValue == 102) {
                        leftValue = -100;
                        rightValue = -100;
                        delayValue = 0;
                    }
										
					Entry.hw.sendQueue.leftValue = leftValue;
					Entry.hw.sendQueue.rightValue = rightValue;
                    Entry.hw.sendQueue['SET'][device] = {
                        port: Entry.trueRobot.PORT_MAP.dualPort,
                        dataA: leftValue,
                        dataB: rightValue,
                        dataC: delayValue,
                    };

                    var myTimer = setTimeout(function() {
                        script.timeFlag = 2;
                    }, Entry.trueRobot.delayTime);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else if (script.timeFlag == 2) {
                    clearTimeout(myTimer);
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
				js: [],
				py: [
					{
						syntax: 'trueRobot.set_move(%1)',
						textParams: [
							{
								type: 'Dropdown',
								options: [
									[Lang.Blocks.truetruebot_move_forward, 101],
									[Lang.Blocks.truetruebot_move_backward, 102],
								],
								value: 101,
								fontSize: 11,
								bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
								arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
								converter: Entry.block.converters.returnStringOrNumberByValue,
							},
						],
					},
				],
			},
        },
        truetrue_set_sec_move: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.truetruebot_move_forward, 101],
                        [Lang.Blocks.truetruebot_move_backward, 102],
                    ],
                    value: 101,
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
                params: [101, '1', null],
                type: 'truetrue_set_sec_move',
            },
            paramsKeyMap: {
                moveValue: 0,
                delayValue: 1,
            },
            class: 'trueRobot_control',
            isNotFor: ['trueRobot'],
            func: function(sprite, script) {
                var device = Entry.trueRobot.PORT_MAP.dualmotor;

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }

                var timeValue = script.getNumberValue('delayValue');
                var delayValue = script.getNumberValue('delayValue');

				if( delayValue == 0 ){
					script.isStart = true;
				}

                delayValue = Math.round(delayValue);
                delayValue = Math.max(delayValue, -100);
                delayValue = Math.min(delayValue, 100);

                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;

                    var moveValue = script.getField('moveValue');
                    var leftValue;
                    var rightValue;

                    if (moveValue == 101) {
                        leftValue = 100;
                        rightValue = 100;
                    } else if (moveValue == 102) {
                        leftValue = -100;
                        rightValue = -100;
                    }
					Entry.hw.sendQueue.leftValue = leftValue;
					Entry.hw.sendQueue.rightValue = rightValue;
                    Entry.hw.sendQueue['SET'][device] = {
                        port: Entry.trueRobot.PORT_MAP.dualPort,
                        dataA: leftValue,
                        dataB: rightValue,
                        dataC: delayValue,
                    };

                    if (timeValue == 0) {
                        var myTimer = setTimeout(function() {
                            script.timeFlag = 2;
                        }, Entry.trueRobot.delayTime);
                        return script;
                    }

                    timeValue = Math.round(timeValue);
                    timeValue = Math.max(timeValue, -100);
                    timeValue = Math.min(timeValue, 100);
                    var fps = Entry.FPS || 60;
                    timeValue = 60 / fps * timeValue * 1000;
                    var myTimer = setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else if (script.timeFlag == 2) {
                    clearTimeout(myTimer);
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                } else {
                    Entry.engine.isContinue = false;
					Entry.hw.sendQueue.leftValue = 0;
					Entry.hw.sendQueue.rightValue = 0;
                    Entry.hw.sendQueue['SET'][device] = {
                        port: Entry.trueRobot.PORT_MAP.dualPort,
                        dataA: 0,
                        dataB: 0,
                        dataC: 0,
                    };
                    var myTimer = setTimeout(function() {
                        script.timeFlag = 2;
                    }, Entry.trueRobot.delayTime);
                    return script;
                }
            },
            syntax: {
				js: [],
				py: [
					{
						syntax: 'trueRobot.set_sec_move(%1)',
						textParams: [
							{
								type: 'Dropdown',
								options: [
									[Lang.Blocks.truetruebot_move_forward, 101],
									[Lang.Blocks.truetruebot_move_backward, 102],
								],
								value: 101,
								fontSize: 11,
								bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
								arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
								converter: Entry.block.converters.returnStringOrNumberByValue,
							},
						],
					},
				],
			},
        },
        truetrue_set_rotate: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.truetruebot_move_right, 101],
                        [Lang.Blocks.truetruebot_move_left, 102],
                    ],
                    value: 101,
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
                params: [101, null],
                type: 'truetrue_set_rotate',
            },
            paramsKeyMap: {
                moveValue: 0,
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

                    var moveValue = script.getField('moveValue');
                    var leftValue;
                    var rightValue;
                    var delayValue;

                    if (moveValue == 101) {
                        leftValue = 100;
                        rightValue = -100;
                        delayValue = 0;
                    } else if (moveValue == 102) {
                        leftValue = -100;
                        rightValue = 100;
                        delayValue = 0;
                    }
					Entry.hw.sendQueue.leftValue = leftValue;
					Entry.hw.sendQueue.rightValue = rightValue;
                    Entry.hw.sendQueue['SET'][device] = {
                        port: Entry.trueRobot.PORT_MAP.dualPort,
                        dataA: leftValue,
                        dataB: rightValue,
                        dataC: delayValue,
                    };

                    var myTimer = setTimeout(function() {
                        script.timeFlag = 2;
                    }, Entry.trueRobot.delayTime);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else if (script.timeFlag == 2) {
                    clearTimeout(myTimer);
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: {
				js: [],
				py: [
					{
						syntax: 'trueRobot.set_rotate(%1)',
						textParams: [
							{
								type: 'Dropdown',
								options: [
									[Lang.Blocks.truetruebot_move_right, 101],
									[Lang.Blocks.truetruebot_move_left, 102],
								],
								value: 101,
								fontSize: 11,
								bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
								arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
								converter: Entry.block.converters.returnStringOrNumberByValue,
							},
						],
					},
				],
			},
        },
        truetrue_set_sec_rotate: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.truetruebot_move_right, 101],
                        [Lang.Blocks.truetruebot_move_left, 102],
                    ],
                    value: 101,
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
                params: [101, '1', null],
                type: 'truetrue_set_sec_rotate',
            },
            paramsKeyMap: {
                moveValue: 0,
                delayValue: 1,
            },
            class: 'trueRobot_control',
            isNotFor: ['trueRobot'],
            func: function(sprite, script) {
                var device = Entry.trueRobot.PORT_MAP.dualmotor;

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }

                var timeValue = script.getNumberValue('delayValue');
                var delayValue = script.getNumberValue('delayValue');

				if( delayValue == 0 ){
					script.isStart = true;
				}
				
				delayValue = Math.round(delayValue);
                delayValue = Math.max(delayValue, -100);
                delayValue = Math.min(delayValue, 100);


                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;

                    var moveValue = script.getField('moveValue');
                    var leftValue;
                    var rightValue;

                    if (moveValue == 101) {
                        leftValue = 50;
                        rightValue = -20;
                    } else if (moveValue == 102) {
                        leftValue = -20;
                        rightValue = 50;
                    }
					Entry.hw.sendQueue.leftValue = leftValue;
					Entry.hw.sendQueue.rightValue = rightValue;
                    Entry.hw.sendQueue['SET'][device] = {
                        port: Entry.trueRobot.PORT_MAP.dualPort,
                        dataA: leftValue,
                        dataB: rightValue,
                        dataC: delayValue,
                    };

                    if (timeValue == 0) {
                        var myTimer = setTimeout(function() {
                            script.timeFlag = 2;
                        }, Entry.trueRobot.delayTime);
                        return script;
                    }

                    timeValue = Math.round(timeValue);
                    timeValue = Math.max(timeValue, -100);
                    timeValue = Math.min(timeValue, 100);
                    var fps = Entry.FPS || 60;
                    timeValue = 60 / fps * timeValue * 1000;
                    var myTimer = setTimeout(function() {
                        script.timeFlag = 0;
                    }, timeValue);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else if (script.timeFlag == 2) {
                    clearTimeout(myTimer);
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                } else {
                    Entry.engine.isContinue = false;
					Entry.hw.sendQueue.leftValue = 0;
					Entry.hw.sendQueue.rightValue = 0;
                    Entry.hw.sendQueue['SET'][device] = {
                        port: Entry.trueRobot.PORT_MAP.dualPort,
                        dataA: 0,
                        dataB: 0,
                        dataC: 0,
                    };
                    var myTimer = setTimeout(function() {
                        script.timeFlag = 2;
                    }, Entry.trueRobot.delayTime);
                    return script;
                }
            },
            syntax: {
				js: [],
				py: [
					{
						syntax: 'trueRobot.set_sec_rotate(%1)',
						textParams: [
							{
								type: 'Dropdown',
								options: [
									[Lang.Blocks.truetruebot_move_right, 101],
									[Lang.Blocks.truetruebot_move_left, 102],
								],
								value: 101,
								fontSize: 11,
								bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
								arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
								converter: Entry.block.converters.returnStringOrNumberByValue,
							},
						],
					},
				],
			},
        },

        truetrue_set_grid_block: {
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
                params: ['1', null],
                type: 'truetrue_set_grid_block',
            },
            paramsKeyMap: {
                gridValue: 0,
            },
            class: 'trueRobot_control',
            isNotFor: ['trueRobot'],
            func: function(sprite, script) {
                var device = Entry.trueRobot.PORT_MAP.dualmotor;
                var pd = Entry.hw.portData;
                var leftValue;
                var rightValue;
                var delayValue = 0;
                var gridValue = script.getNumberValue('gridValue');
                if (!script.isStart) {
                    script.flag = 0;
                    script.stop = 0;
                    script.checkCount = 0;
                    script.isStart = true;
                    script.timeFlag = 0;
                    script.bufferFlag = 2;
                }

				if( gridValue == 0 ) {
					script.timeFlag = 3;
				}

                if (script.timeFlag == 0) {
                    script.timeFlag = 1;

                    if (pd['L1'] > 110 && pd['R1'] > 110) {
                        leftValue = 100;
                        rightValue = 100;
                    } else if (pd['L1'] >= 0 || pd['R1'] >= 0) {
                        if (pd['L1'] > pd['R1']-20) {
                            leftValue = 100;
                            rightValue = pd['L1'] - pd['R1'];

                            // var maxright = rightValue;
							
                            rightValue = Math.max(
                                Math.min(Math.round(100 - 100 * rightValue / 230), 100),
                                30
                            );
                        } else if (pd['R1'] > pd['L1']-20) {
                            leftValue = pd['R1'] - pd['L1'];


                            leftValue = Math.max(
                                Math.min(Math.round(100 - 100 * leftValue / 230), 100),
                                30
                            );

                            rightValue = 100;
                        } else {

                            leftValue = 100;
                            rightValue = 100;
                        }
                    } else {
                        leftValue = 100;
                        rightValue = 100;
					}
					//console.log( script.tempcheck +"//"+ pd['L2'] +" :: "+ pd['L1'] +" :: "+ pd['R1'] +" :: "+ pd['R2'] );
                    if (
                        pd['L1'] >= 0 &&
                        pd['R1'] >= 0 &&
                        pd['L2'] > 0 &&
                        pd['R2'] > 0 &&
                        pd['L2'] + pd['L1'] >= 130 &&
                        pd['R2'] + pd['R1'] >= 130
                    ) {
                        if (script.flag == 1) {
                            script.checkCount++;
                            script.flag = 0;

							if (script.checkCount < gridValue) {
								Entry.hw.sendQueue.leftValue = 0;
								Entry.hw.sendQueue.rightValue = 0;
								Entry.hw.sendQueue['SET'][device] = {
									port: Entry.trueRobot.PORT_MAP.dualPort,
									dataA: 0,
									dataB: 0,
									dataC: 1,
								};

								script.timeFlag = 1;
								
								var myTimer = setTimeout(function() {
									script.timeFlag = 0;
								 }, 200);

								return script;
							}


                        }
                        if (script.checkCount >= gridValue) {
                            if (
                                pd['L1'] < 170 &&
                                pd['R1'] < 170 &&
                                pd['L2'] < 170 &&
                                pd['R2'] < 170
                            ) {
                                script.stop = 1;
                            } else {
                                script.stop = 1;
                            }
                        }
                    } else {
                        script.flag = 1;
                    }

                    if (script.stop == 1 && script.flag == 1) {
                        script.timeFlag = 1;
                        script.bufferFlag = 3;

                        var myTimer = setTimeout(function() {
                            script.timeFlag = script.bufferFlag;
                        }, 80);
                        return script;
                    }

                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
					Entry.hw.sendQueue.leftValue = leftValue;
					Entry.hw.sendQueue.rightValue = rightValue;
                    Entry.hw.sendQueue['SET'][device] = {
                        port: Entry.trueRobot.PORT_MAP.dualPort,
                        dataA: leftValue,
                        dataB: rightValue,
                        dataC: delayValue,
                    };

                    var myTimer = setTimeout(function() {
                        script.timeFlag = script.bufferFlag;
                    }, Entry.trueRobot.delayTime / 2);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else if (script.timeFlag == 2) {
                    clearTimeout(myTimer);
                    script.timeFlag = 0;
                    return script;
                } else if (script.timeFlag == 3) {
                    clearTimeout(myTimer);
					Entry.hw.sendQueue.leftValue = 0;
					Entry.hw.sendQueue.rightValue = 0;
                    Entry.hw.sendQueue['SET'][device] = {
                        port: Entry.trueRobot.PORT_MAP.dualPort,
                        dataA: 0,
                        dataB: 0,
                        dataC: 1,
                    };

                    return script.callReturn();
                }

                return script;
            },
            syntax: {
				js: [],
				py: [
					{
						syntax: 'trueRobot.set_grid_block(%1)',
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

        truetrue_set_grid_rotate: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.truetruebot_move_right, 101],
                        [Lang.Blocks.truetruebot_move_left, 102],
                    ],
                    value: 101,
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
                params: [101, '1', null],
                type: 'truetrue_set_grid_rotate',
            },
            paramsKeyMap: {
                moveValue: 0,
                rotateValue: 1,
            },
            class: 'trueRobot_control',
            isNotFor: ['trueRobot'],
            func: function(sprite, script) {
                var device = Entry.trueRobot.PORT_MAP.dualmotor;
                var pd = Entry.hw.portData;
                var leftValue;
                var rightValue;
                var delayValue;

                var moveValue = script.getField('moveValue');
                var rotateValue = script.getNumberValue('rotateValue');

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }

                if (!script.isStart) {
                    script.flag = 0;
                    script.stop = 0;
                    script.checkCount = 0;
                    script.isStart = true;
                    script.timeFlag = 0;
                    script.bufferFlag = 2;
                    script.tempcheck = 0;
                }

				if( rotateValue == 0 ) {
					script.timeFlag = 3;
				}

                if (script.timeFlag == 0) {
                    script.timeFlag = 1;

                    if (moveValue == 101) {
                        leftValue = 50;
                        rightValue = -20;
                        delayValue = 0;
                    } else if (moveValue == 102) {
                        leftValue = -20;
                        rightValue = 50;
                        delayValue = 0;
                    }

                    if (moveValue == 101) {

                        if ( ( pd['L1'] > 170 ||  ( pd['L1'] + pd['L2'] > 170 & pd['L1'] > pd['L2'] ) ) && pd['L2'] >= 0 && pd['R2'] < 10 && pd['R1'] < 10) {

                            if (script.flag == 1) {
                                script.tempcheck = 1;
                            }
                        } else if (pd['L2'] > 0 && pd['L1'] < 10) {
                            script.flag = 1;
                        }
                    } else if (moveValue == 102) {

                        if ( ( pd['R1'] > 170 ||  ( pd['R1'] + pd['R2'] > 170 & pd['R1'] > pd['R2'] ) ) && pd['R2'] >= 0 && pd['L2'] < 10 && pd['L1'] < 10) {

                            if (script.flag == 1) {
                                script.tempcheck = 1;
                            }
                        } else if (pd['R2'] > 0 && pd['R1'] < 10) {
                            script.flag = 1;
                        }
                    }
					//console.log( script.tempcheck +"//"+ pd['L2'] +" :: "+ pd['L1'] +" :: "+ pd['R1'] +" :: "+ pd['R2'] + " script.tempcheck : " + script.tempcheck + " script.flag : "+script.flag );



                    if (script.tempcheck == 1 && pd['L1'] < 230) {
                        script.tempcheck = 0;
                        script.checkCount++;
                        script.flag = 0;

						if (script.flag == 0 && script.checkCount < rotateValue) {
								Entry.hw.sendQueue.leftValue = 0;
								Entry.hw.sendQueue.rightValue = 0;
								Entry.hw.sendQueue['SET'][device] = {
									port: Entry.trueRobot.PORT_MAP.dualPort,
									dataA: 0,
									dataB: 0,
									dataC: 1,
								};

								script.timeFlag = 1;
								//console.log( "!!!!!!!!!!!" );
								var myTimer = setTimeout(function() {
									script.timeFlag = 0;
								 }, 200);

								return script;
							}
                    }

                    if (script.tempcheck == 1 && pd['R1'] < 230) {

                        script.tempcheck = 0;
                        script.checkCount++;
                        script.flag = 0;

						if (script.flag == 0 && script.checkCount < rotateValue) {
								Entry.hw.sendQueue.leftValue = 0;
								Entry.hw.sendQueue.rightValue = 0;	
								Entry.hw.sendQueue['SET'][device] = {
									port: Entry.trueRobot.PORT_MAP.dualPort,
									dataA: 0,
									dataB: 0,
									dataC: 1,
								};

								script.timeFlag = 1;
								//console.log( "!!!!!!!!!!!" );
								var myTimer = setTimeout(function() {
									script.timeFlag = 0;
								 }, 200);

								return script;
						}
                    }

				
                    if (script.checkCount >= rotateValue) {
                        leftValue = 0;
                        rightValue = 0;
                        script.timeFlag = 1;
                        script.bufferFlag = 3;
                    }
					Entry.hw.sendQueue.leftValue = leftValue;
					Entry.hw.sendQueue.rightValue = rightValue;
                    Entry.hw.sendQueue['SET'][device] = {
                        port: Entry.trueRobot.PORT_MAP.dualPort,
                        dataA: leftValue,
                        dataB: rightValue,
                        dataC: delayValue,
                    };

                    var myTimer = setTimeout(function() {
                        script.timeFlag = script.bufferFlag;
                    }, Entry.trueRobot.delayTime / 5);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else if (script.timeFlag == 2) {
                    clearTimeout(myTimer);
                    script.timeFlag = 0;
                    return script;
                } else if (script.timeFlag == 3) {
                    clearTimeout(myTimer);
					Entry.hw.sendQueue.leftValue = 0;
					Entry.hw.sendQueue.rightValue = 0;
                    Entry.hw.sendQueue['SET'][device] = {
                        port: Entry.trueRobot.PORT_MAP.dualPort,
                        dataA: 0,
                        dataB: 0,
                        dataC: 1,
                    };

                    return script.callReturn();
                }

                return script;
            },
            syntax: {
				js: [],
				py: [
					{
						syntax: 'trueRobot.set_grid_rotate(%1, %2)',
						textParams: [
							{
								type: 'Dropdown',
								options: [
									[Lang.Blocks.truetruebot_move_right, 101],
									[Lang.Blocks.truetruebot_move_left, 102],
								],
								value: 101,
								fontSize: 11,
								bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
								arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
								converter: Entry.block.converters.returnStringOrNumberByValue,
							},
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

// 언어 적용
Entry.trueRobot.setLanguage = function() {
    return {
        ko: {
            // ko.js에 작성하던 내용
            template: {
                truetrue_get_accsensor: '가속도센서 %1 의 값',
                truetrue_get_bottomcolorsensor: '바닥컬러센서 %1 의 값',
                truetrue_get_frontcolorsensor: '전면컬러센서 %1 의 값',
                truetrue_get_linesensor: '라인센서 %1 의 값',
                truetrue_get_proxisensor: '근접센서 %1 의 값',
                truetrue_set_colorled: '컬러LED Red %1  Green %2 Blue %3 로 설정 %4',
                truetrue_set_dualmotor: 'DC모터 좌 %1  우 %2 속도로 %3 초 구동 %4',
                truetrue_set_led_colorsensor: '%1 조명용 LED %2 %3',
                truetrue_set_led_linesensor: '라인센서 조명용 LED %1 %2',
                truetrue_set_led_proxi: '%1 조명용 LED %2 %3',
                truetrue_set_linetracer: '라인트레이싱 모드 %1 %2',
                truetrue_set_singlemotor: 'DC모터 %1  속도 %2 로 설정 %3',
                truetrue_set_head_colorled: '머리 LED를 %1 로 변경 %2',
                truetrue_set_move: '로봇을 %1 계속이동 %2',
                truetrue_set_sec_move: '로봇을 %1  %2 초 이동 %3',
                truetrue_set_rotate: '로봇을 %1 계속 회전 %2',
                truetrue_set_sec_rotate: '로봇을 %1  %2 초 회전 %3',
                truetrue_set_grid_block: '뚜루뚜루를 격자 %1 칸 만큼 이동 %2 ',
                truetrue_set_grid_rotate: '뚜루뚜루를 격자에서 %1 %2 회 회전 %3 ',
            },
            Blocks: {
                truetruebot_on: '켜기',
                truetruebot_off: '끄기',
                truetruebot_front_near_right: '근접센서오른쪽',
                truetruebot_front_near_left: '근접센서왼쪽',
                truetruebot_front_color: '전면컬러센서',
                truetruebot_bottom_color: '바닥컬러센서',
                truetruebot_head_color_white: '흰색',
                truetruebot_head_color_red: '빨간색',
                truetruebot_head_color_green: '초록색',
                truetruebot_head_color_blue: '파란색',
                truetruebot_head_color_cyan: '하늘색',
                truetruebot_head_color_magenta: '자주색',
                truetruebot_head_color_yellow: '노란색',
                truetruebot_head_color_off: '끄기',
                truetruebot_move_forward: '앞으로',
                truetruebot_move_backward: '뒤로',
                truetruebot_move_right: '오른쪽으로',
                truetruebot_move_left: '왼쪽으로',
				truetruebot_right: '오른쪽',
				truetruebot_left: '왼쪽',
				truetruebot_Xaxis: 'X축',
				truetruebot_Yaxis: 'Y축',
				truetruebot_Zaxis: 'Z축',
				truetruebot_Tilt: '기울기',
				truetruebot_ColorKey: '컬러키',
            },
        },
        code: {
            template: {
                truetrue_get_accsensor: '가속도센서 %1 의 값',
                truetrue_get_bottomcolorsensor: '바닥컬러센서 %1 의 값',
                truetrue_get_frontcolorsensor: '전면컬러센서 %1 의 값',
                truetrue_get_linesensor: '라인센서 %1 의 값',
                truetrue_get_proxisensor: '근접센서 %1 의 값',
                truetrue_set_colorled: '컬러LED Red %1  Green %2 Blue %3 로 설정 %4',
                truetrue_set_dualmotor: 'DC모터 좌 %1  우 %2 속도로 %3 초 구동 %4',
                truetrue_set_led_colorsensor: '%1 조명용 LED %2 %3',
                truetrue_set_led_linesensor: '라인센서 조명용 LED %1 %2',
                truetrue_set_led_proxi: '%1 조명용 LED %2 %3',
                truetrue_set_linetracer: '라인트레이싱 모드 %1 %2',
                truetrue_set_singlemotor: 'DC모터 %1  속도 %2 로 설정 %3',
                truetrue_set_head_colorled: '머리 LED를 %1 로 변경 %2',
                truetrue_set_move: '로봇을 %1 계속이동 %2',
                truetrue_set_sec_move: '로봇을 %1  %2 초 이동 %3',
                truetrue_set_rotate: '로봇을 %1 계속 회전 %2',
                truetrue_set_sec_rotate: '로봇을 %1  %2 초 회전 %3',
                truetrue_set_grid_block: '뚜루뚜루를 격자 %1 칸 만큼 이동 %2 ',
                truetrue_set_grid_rotate: '뚜루뚜루를 격자에서 %1 %2 회 회전 %3 ',
            },
            Blocks: {
                truetruebot_on: '켜기',
                truetruebot_off: '끄기',
                truetruebot_front_near_right: '근접센서오른쪽',
                truetruebot_front_near_left: '근접센서왼쪽',
                truetruebot_front_color: '전면컬러센서',
                truetruebot_bottom_color: '바닥컬러센서',
                truetruebot_head_color_white: '흰색',
                truetruebot_head_color_red: '빨간색',
                truetruebot_head_color_green: '초록색',
                truetruebot_head_color_blue: '파란색',
                truetruebot_head_color_cyan: '하늘색',
                truetruebot_head_color_magenta: '자주색',
                truetruebot_head_color_yellow: '노란색',
                truetruebot_head_color_off: '끄기',
                truetruebot_move_forward: '앞으로',
                truetruebot_move_backward: '뒤로',
                truetruebot_move_right: '오른쪽으로',
                truetruebot_move_left: '왼쪽으로',
				truetruebot_right: '오른쪽',
				truetruebot_left: '왼쪽',
				truetruebot_Xaxis: 'X축',
				truetruebot_Yaxis: 'Y축',
				truetruebot_Zaxis: 'Z축',
				truetruebot_Tilt: '기울기',
				truetruebot_ColorKey: '컬러키',
            },
        },
        ebs: {
            template: {
                truetrue_get_accsensor: '가속도센서 %1 의 값',
                truetrue_get_bottomcolorsensor: '바닥컬러센서 %1 의 값',
                truetrue_get_frontcolorsensor: '전면컬러센서 %1 의 값',
                truetrue_get_linesensor: '라인센서 %1 의 값',
                truetrue_get_proxisensor: '근접센서 %1 의 값',
                truetrue_set_colorled: '컬러LED Red %1  Green %2 Blue %3 로 설정 %4',
                truetrue_set_dualmotor: 'DC모터 좌 %1  우 %2 속도로 %3 초 구동 %4',
                truetrue_set_led_colorsensor: '%1 조명용 LED %2 %3',
                truetrue_set_led_linesensor: '라인센서 조명용 LED %1 %2',
                truetrue_set_led_proxi: '%1 조명용 LED %2 %3',
                truetrue_set_linetracer: '라인트레이싱 모드 %1 %2',
                truetrue_set_singlemotor: 'DC모터 %1  속도 %2 로 설정 %3',
                truetrue_set_head_colorled: '머리 LED를 %1 로 변경 %2',
                truetrue_set_move: '로봇을 %1 계속이동 %2',
                truetrue_set_sec_move: '로봇을 %1  %2 초 이동 %3',
                truetrue_set_rotate: '로봇을 %1 계속 회전 %2',
                truetrue_set_sec_rotate: '로봇을 %1  %2 초 회전 %3',
                truetrue_set_grid_block: '뚜루뚜루를 격자 %1 칸 만큼 이동 %2 ',
                truetrue_set_grid_rotate: '뚜루뚜루를 격자에서 %1 %2 회 회전 %3 ',
            },
            Blocks: {
                truetruebot_on: '켜기',
                truetruebot_off: '끄기',
                truetruebot_front_near_right: '근접센서오른쪽',
                truetruebot_front_near_left: '근접센서왼쪽',
                truetruebot_front_color: '전면컬러센서',
                truetruebot_bottom_color: '바닥컬러센서',
                truetruebot_head_color_white: '흰색',
                truetruebot_head_color_red: '빨간색',
                truetruebot_head_color_green: '초록색',
                truetruebot_head_color_blue: '파란색',
                truetruebot_head_color_cyan: '하늘색',
                truetruebot_head_color_magenta: '자주색',
                truetruebot_head_color_yellow: '노란색',
                truetruebot_head_color_off: '끄기',
                truetruebot_move_forward: '앞으로',
                truetruebot_move_backward: '뒤로',
                truetruebot_move_right: '오른쪽으로',
                truetruebot_move_left: '왼쪽으로',
				truetruebot_right: '오른쪽',
				truetruebot_left: '왼쪽',
				truetruebot_Xaxis: 'X축',
				truetruebot_Yaxis: 'Y축',
				truetruebot_Zaxis: 'Z축',
				truetruebot_Tilt: '기울기',
				truetruebot_ColorKey: '컬러키',
            },
        },
        jp: {
            template: {
                truetrue_get_accsensor: '3-AXIS Accelerometer %1 Sensor value',
                truetrue_get_bottomcolorsensor: 'Bottom Color %1 Sensor value',
                truetrue_get_frontcolorsensor: 'Front Color %1 Sensor value',
                truetrue_get_linesensor: 'Line %1 Sensor value',
                truetrue_get_proxisensor: 'Proximity %1 Sensor value',
                truetrue_set_colorled: 'Set Color LED Red %1  Green %2 Blue %3 %4',
                truetrue_set_dualmotor: 'Set DC motor left %1  right %2 during %3 seconds %4',
                truetrue_set_led_colorsensor: 'LED for %1 color sensor %2 %3',
                truetrue_set_led_linesensor: 'LED for line sensor %1 %2',
                truetrue_set_led_proxi: 'LED for %1 proximity sensor %2 %3',
                truetrue_set_linetracer: 'Line tracing mode %1 %2',
                truetrue_set_singlemotor: 'Set DC motor %1  speed %2 %3',
                truetrue_set_head_colorled: 'Change LED color to %1 %2',
                truetrue_set_move: 'Move TRUETRUE %1 forever %2',
                truetrue_set_sec_move: 'Move TRUETRUE %1 for %2 second(s) %3',
                truetrue_set_rotate: 'Rotate TRUETRUE %1 forever %2',
                truetrue_set_sec_rotate: 'Rotate TRUETRUE %1 for %2 Second(s) %3',
                truetrue_set_grid_block: 'Move TRUETRUE %1 block(s) on the GRID %2',
                truetrue_set_grid_rotate: 'Rotate TRUETRUE %1 %2 time(s) on the GRID %3',
            },
            Blocks: {
                truetruebot_on: 'on',
                truetruebot_off: 'off',
                truetruebot_front_near_right: 'Proxi Right',
                truetruebot_front_near_left: 'Proxi Left',
                truetruebot_front_color: 'Color sensor (Card)',
                truetruebot_bottom_color: 'Color sensor (Bottom)',
                truetruebot_head_color_white: 'White',
                truetruebot_head_color_red: 'Red',
                truetruebot_head_color_green: 'Green',
                truetruebot_head_color_blue: 'Blue',
                truetruebot_head_color_cyan: 'Cyan',
                truetruebot_head_color_magenta: 'Magenta',
                truetruebot_head_color_yellow: 'Yellow',
                truetruebot_head_color_off: 'off',
                truetruebot_move_forward: 'forward',
                truetruebot_move_backward: 'backward',
                truetruebot_move_right: 'right',
                truetruebot_move_left: 'left',
				truetruebot_right: 'right',
				truetruebot_left: 'left',
				truetruebot_Xaxis: 'X-axis',
				truetruebot_Yaxis: 'Y-axis',
				truetruebot_Zaxis: 'Z-axis',
				truetruebot_Tilt: 'Tilt',
				truetruebot_ColorKey: 'ColorKey',
            },
        },
        vn: {
            template: {
                truetrue_get_accsensor: '3-AXIS Accelerometer %1 Sensor value',
                truetrue_get_bottomcolorsensor: 'Bottom Color %1 Sensor value',
                truetrue_get_frontcolorsensor: 'Front Color %1 Sensor value',
                truetrue_get_linesensor: 'Line %1 Sensor value',
                truetrue_get_proxisensor: 'Proximity %1 Sensor value',
                truetrue_set_colorled: 'Set Color LED Red %1  Green %2 Blue %3 %4',
                truetrue_set_dualmotor: 'Set DC motor left %1  right %2 during %3 seconds %4',
                truetrue_set_led_colorsensor: 'LED for %1 color sensor %2 %3',
                truetrue_set_led_linesensor: 'LED for line sensor %1 %2',
                truetrue_set_led_proxi: 'LED for %1 proximity sensor %2 %3',
                truetrue_set_linetracer: 'Line tracing mode %1 %2',
                truetrue_set_singlemotor: 'Set DC motor %1  speed %2 %3',
                truetrue_set_head_colorled: 'Change LED color to %1 %2',
                truetrue_set_move: 'Move TRUETRUE %1 forever %2',
                truetrue_set_sec_move: 'Move TRUETRUE %1 for %2 second(s) %3',
                truetrue_set_rotate: 'Rotate TRUETRUE %1 forever %2',
                truetrue_set_sec_rotate: 'Rotate TRUETRUE %1 for %2 Second(s) %3',
                truetrue_set_grid_block: 'Move TRUETRUE %1 block(s) on the GRID %2',
                truetrue_set_grid_rotate: 'Rotate TRUETRUE %1 %2 time(s) on the GRID %3',
            },
            Blocks: {
                truetruebot_on: 'on',
                truetruebot_off: 'off',
                truetruebot_front_near_right: 'Proxi Right',
                truetruebot_front_near_left: 'Proxi Left',
                truetruebot_front_color: 'Color sensor (Card)',
                truetruebot_bottom_color: 'Color sensor (Bottom)',
                truetruebot_head_color_white: 'White',
                truetruebot_head_color_red: 'Red',
                truetruebot_head_color_green: 'Green',
                truetruebot_head_color_blue: 'Blue',
                truetruebot_head_color_cyan: 'Cyan',
                truetruebot_head_color_magenta: 'Magenta',
                truetruebot_head_color_yellow: 'Yellow',
                truetruebot_head_color_off: 'off',
                truetruebot_move_forward: 'forward',
                truetruebot_move_backward: 'backward',
                truetruebot_move_right: 'right',
                truetruebot_move_left: 'left',
				truetruebot_right: 'right',
				truetruebot_left: 'left',
				truetruebot_Xaxis: 'X-axis',
				truetruebot_Yaxis: 'Y-axis',
				truetruebot_Zaxis: 'Z-axis',
				truetruebot_Tilt: 'Tilt',
				truetruebot_ColorKey: 'ColorKey',
            },
        },
        en: {
            template: {
                truetrue_get_accsensor: '3-AXIS Accelerometer %1 Sensor value',
                truetrue_get_bottomcolorsensor: 'Bottom Color %1 Sensor value',
                truetrue_get_frontcolorsensor: 'Front Color %1 Sensor value',
                truetrue_get_linesensor: 'Line %1 Sensor value',
                truetrue_get_proxisensor: 'Proximity %1 Sensor value',
                truetrue_set_colorled: 'Set Color LED Red %1  Green %2 Blue %3 %4',
                truetrue_set_dualmotor: 'Set DC motor left %1  right %2 during %3 seconds %4',
                truetrue_set_led_colorsensor: 'LED for %1 color sensor %2 %3',
                truetrue_set_led_linesensor: 'LED for line sensor %1 %2',
                truetrue_set_led_proxi: 'LED for %1 proximity sensor %2 %3',
                truetrue_set_linetracer: 'Line tracing mode %1 %2',
                truetrue_set_singlemotor: 'Set DC motor %1  speed %2 %3',
                truetrue_set_head_colorled: 'Change LED color to %1 %2',
                truetrue_set_move: 'Move TRUETRUE %1 forever %2',
                truetrue_set_sec_move: 'Move TRUETRUE %1 for %2 second(s) %3',
                truetrue_set_rotate: 'Rotate TRUETRUE %1 forever %2',
                truetrue_set_sec_rotate: 'Rotate TRUETRUE %1 for %2 Second(s) %3',
                truetrue_set_grid_block: 'Move TRUETRUE %1 block(s) on the GRID %2',
                truetrue_set_grid_rotate: 'Rotate TRUETRUE %1 %2 time(s) on the GRID %3',
            },
            Blocks: {
                truetruebot_on: 'on',
                truetruebot_off: 'off',
                truetruebot_front_near_right: 'Proxi Right',
                truetruebot_front_near_left: 'Proxi Left',
                truetruebot_front_color: 'Color sensor (Card)',
                truetruebot_bottom_color: 'Color sensor (Bottom)',
                truetruebot_head_color_white: 'White',
                truetruebot_head_color_red: 'Red',
                truetruebot_head_color_green: 'Green',
                truetruebot_head_color_blue: 'Blue',
                truetruebot_head_color_cyan: 'Cyan',
                truetruebot_head_color_magenta: 'Magenta',
                truetruebot_head_color_yellow: 'Yellow',
                truetruebot_head_color_off: 'off',
                truetruebot_move_forward: 'forward',
                truetruebot_move_backward: 'backward',
                truetruebot_move_right: 'right',
                truetruebot_move_left: 'left',
				truetruebot_right: 'right',
				truetruebot_left: 'left',
				truetruebot_Xaxis: 'X-axis',
				truetruebot_Yaxis: 'Y-axis',
				truetruebot_Zaxis: 'Z-axis',
				truetruebot_Tilt: 'Tilt',
				truetruebot_ColorKey: 'ColorKey',
            },
        },
    };
};

module.exports = Entry.trueRobot;
