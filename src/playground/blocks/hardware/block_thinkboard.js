'use strict';

Entry.ThinkBoard = 
{
	id: '21.2',	
    name: 'ThinkBoard',
    url: 'http://www.thinkfunedu.co.kr/',
    imageName: 'Thinkboard.png',
    title: 
	{
        "ko": "씽크보드", 
        "en": "ThinkBoard"
    },

    setZero: function() 
    {
        if (!Entry.hw.sendQueue.SET) 
        {
            Entry.hw.sendQueue = 
            {
                GET: {},
                SET: {},
            };    
        } 
		else 
		{ 
            var keySet = Object.keys(Entry.hw.sendQueue.SET);
            keySet.forEach(function(key) 
            {             
                if(Entry.hw.sendQueue.SET[key].type === 4)
                {             
                    Entry.hw.sendQueue.SET[key].data[0] = 0;          
                    Entry.hw.sendQueue.SET[key].data[1] = 0;                                          
                }
                else Entry.hw.sendQueue.SET[key].data = 0;                                                                  
                Entry.hw.sendQueue.SET[key].time = new Date().getTime();
            });                                 
        } 
        Entry.hw.update();    
    },
	
    sensorTypes: {
        ALIVE: 0,
        DIGITAL: 1,
        ANALOG: 2,
        BUZZER: 3,
        SERVO: 4,
        TONE: 5,
        TEMP: 6,
        USONIC: 7,
        TIMER: 8,
        RD_BT: 9,
        WRT_BT: 10,
        RGBLED: 11,
        MOTOR: 12,
        LASER: 13,
    },
    toneTable: {
        '0': 0,
        C: 1,
        CS: 2,
        D: 3,
        DS: 4,
        E: 5,
        F: 6,
        FS: 7,
        G: 8,
        GS: 9,
        A: 10,
        AS: 11,
        B: 12,
    },
    toneMap: {
        '1': [33, 65, 131, 262, 523, 1046, 2093, 4186],
        '2': [35, 69, 139, 277, 554, 1109, 2217, 4435],
        '3': [37, 73, 147, 294, 587, 1175, 2349, 4699],
        '4': [39, 78, 156, 311, 622, 1245, 2849, 4978],
        '5': [41, 82, 165, 330, 659, 1319, 2637, 5274],
        '6': [44, 87, 175, 349, 698, 1397, 2794, 5588],
        '7': [46, 92, 185, 370, 740, 1480, 2960, 5920],
        '8': [49, 98, 196, 392, 784, 1568, 3136, 6272],
        '9': [52, 104, 208, 415, 831, 1661, 3322, 6645],
        '10': [55, 110, 220, 440, 880, 1760, 3520, 7040],
        '11': [58, 117, 233, 466, 932, 1865, 3729, 7459],
        '12': [62, 123, 247, 494, 988, 1976, 3951, 7902],
    },
    highList: ['high', '1', 'on'],
    lowList: ['low', '0', 'off'],
    BlockState: {},	
    sValue1: 0,               // LEEJC 2020/03/17
    sValue2: 0	
};

Entry.ThinkBoard.blockMenuBlocks = [
		'thinkboard_buzzer_onoff',			
        'thinkboard_set_digital_buzzer',
		'thinkboard_get_digital_value',	
		'thinkboard_digital_button_pressed',
		'thinkboard_get_analog_value',
		'thinkboard_get_analog_mapping',
		'thinkboard_get_distsensor_value',
		'thinkboard_get_analog_ir_mapping',	
		'thinkboard_get_usonic_value',
		'thinkboard_get_analog_usonic_mapping',
		'thinkboard_get_analog_temp_value',
		'thinkboard_digital_Laser_onoff',
        'thinkboard_digital_rgbled_onoff',
		'thinkboard_digital_rgbled_off',        
//[4/19]'thinkboard_digital_set_rgbled_value',
//[4/19]'thinkboard_digital_rgbled_percent',
		'thinkboard_get_digital_servo_value',
		'thinkboard_digital_set_servo_angle',
		'thinkboard_digital_set_servo_direction',
        'thinkboard_digital_set_servo_stop',
        'thinkboard_get_digital_servo_360_value',
        'thinkboard_digital_set_servo_360_angle',
        'thinkboard_digital_set_servo_360_stop',        
		'thinkboard_digital_set_motor_direction',
		'thinkboard_digital_set_motor_speed',
		'thinkboard_digital_motor_stop',	
];

Entry.ThinkBoard.setLanguage = function() {
    return {
        ko: {
            template: {
				"thinkboard_buzzer_onoff": "버저 %1 %2",				
                "thinkboard_set_digital_buzzer": "버저를 %1 옥타브 %2 음 %3 초 연주 %4",	
				"thinkboard_get_digital_value": "포트 %1 버튼 센서 값",				
				"thinkboard_digital_button_pressed": " 포트 %1 버튼 센서 눌림",	
				"thinkboard_get_analog_value": "포트 %1 의 %2 센서 값",
				"thinkboard_get_analog_mapping": "포트 %1 의 %2 센서 값 %3 ~ %4 에서 %5 ~ %6 으로 변환값", 
				"thinkboard_get_distsensor_value": "포트 %1 거리(IR) 센서 값",	
				"thinkboard_get_analog_ir_mapping": "포트 %1 의 거리(IR) 센서 값 %2 ~ %3 에서 %4 ~ %5 으로 변환값", 				
				"thinkboard_get_usonic_value": "포트 %1 초음파 센서 값",	
				"thinkboard_get_analog_usonic_mapping": "포트 %1 의 초음파 센서 값 %2 ~ %3 에서 %4 ~ %5 으로 변환값", 	
				"thinkboard_get_analog_temp_value": "포트 %1 의 %2 센서 값",	
                "thinkboard_digital_Laser_onoff": "포트 %1 의 레이저포인터 %2 %3",             
                "thinkboard_digital_rgbled_onoff": "RGB LED %1 색 켜기 %2",	
				"thinkboard_digital_rgbled_off": "RGB LED 끄기 %1",	                
//[4/19]  "thinkboard_digital_set_rgbled_value": "RGB LED 빨강 %1 초록 %2 파랑 %3 으로 켜기 %4",
//[4/19]  "thinkboard_digital_rgbled_percent": "RGB LED 밝기를 %1 로 정하기 %2",
                "thinkboard_get_digital_servo_value": "포트 %1 180 서보모터 각도 값",
                "thinkboard_digital_set_servo_angle": "포트 %1 의 180 서보모터의 각도를 %2 으로 정하기 %3",
                "thinkboard_digital_set_servo_direction": "포트 %1 의 180 서보모터를 %2 방향으로 1도 바꾸기 %3",
                "thinkboard_digital_set_servo_stop": "포트 %1 의 180 서보모터 정지하기 %2",                
                "thinkboard_get_digital_servo_360_value": "포트 %1 360 서보모터 각도 값",
                "thinkboard_digital_set_servo_360_angle": "포트 %1 의 360 서보모터의 각도를 %2 으로 정하기 %3",
                "thinkboard_digital_set_servo_360_stop": "포트 %1 의 360 서보모터 정지하기 %2",                
				"thinkboard_digital_set_motor_direction": "포트 %1 의 DC모터 방향을 %2 방향으로 정하기 %3",
				"thinkboard_digital_set_motor_speed": "포트 %1 의 DC모터의 속도를 %2 %로 정하기 %3", 
				"thinkboard_digital_motor_stop": "포트 %1 의 DC모터 정지하기 %2",			
            }
        },
        en: {
            template: {
				"thinkboard_buzzer_onoff": "Buzzer %1 %2",				
                "thinkboard_set_digital_buzzer": "Play Buzzer %1 Octave %2 Note %3 Sec %4",	
				"thinkboard_get_digital_value": "Port %1 Button Sensor Value",				
				"thinkboard_digital_button_pressed": " Port %1 Button Sensor Pressed",		
				"thinkboard_get_analog_value": "Port %1 and %2 Sensor Value",
                "thinkboard_get_analog_mapping": "Map analog %1 pin %2 Sensor Value from %3 ~ %4 to %5 ~ %6",	
				"thinkboard_get_distsensor_value": "Port %1 Distance(IR) Sensor Value",		
				"thinkboard_get_analog_ir_mapping": "Map analog %1 Distance(IR) Sensor Value from %2 ~ %3 to %4 ~ %5", 		
				"thinkboard_get_usonic_value": "Port %1 Ultrasonic Sensor Value",		
				"thinkboard_get_analog_usonic_mapping": "Map analog %1 Ultrasonic Sensor Value from %2 ~ %3 to %4 ~ %5", 	
				"thinkboard_get_analog_temp_value": "Port %1 and %2 Sensor Value",	
                "thinkboard_digital_Laser_onoff": "Port %1 and Laserpoint %2 %3",	
//[4/19]  "thinkboard_digital_rgbled_onoff": "RGB LED %1 Color %2 %3",		                
                "thinkboard_digital_rgbled_onoff": "RGB LED %1 Color Turn On %2",	
				"thinkboard_digital_rgbled_off": "RGB LED Turn Off %1",	                	
//[4/19]  "thinkboard_digital_set_rgbled_value": "Turn On RGB LED with RED %1 GREEN %2 BLUE %3 value %4",
//[4/19]  "thinkboard_digital_rgbled_percent": "Set RGB LED Brightness to %1 %2",		
                "thinkboard_get_digital_servo_value": "Port %1 180 Servo Motor Angle Value",
                "thinkboard_digital_set_servo_angle": "Set Port %1 180 Servor Motor Angle Value to %2 %3",
                "thinkboard_digital_set_servo_direction": "Set Port %1 180 Servor Motor Direction 1 Angle to %2 %3",
                "thinkboard_digital_set_servo_stop": "Stop Port %1 180 Servo Motor %2",
                "thinkboard_get_digital_servo_360_value": "Port %1 360 Servo Motor Angle Value",
                "thinkboard_digital_set_servo_360_angle": "Set Port %1 360 Servor Motor Angle Value to %2 %3",  
                "thinkboard_digital_set_servo_360_stop": "Stop Port %1 360 Servo Motor %2",          
				"thinkboard_digital_set_motor_direction": "Set Port %1 DC Motor Direction to %2 %3",		
				"thinkboard_digital_set_motor_speed": "Set Port %1 의 DC Motor Speed to %2 % %3", 	
				"thinkboard_digital_motor_stop": "Stop Port %1 DC Motor %2",					
            }
        }
    }
};

Entry.ThinkBoard.getBlocks = function() {
    return {
        thinkboard_digital_port_onoff_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,	
			fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['켜기', '1'],
                        ['끄기', '0'],
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
            },
            paramsKeyMap: {
                PORT: 0,
            },
            func: function(sprite, script) {
                return script.getField('PORT');
            },
        },	
		
		// 1. 버저 - 1) 버저 On/Off
		thinkboard_buzzer_onoff: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,	
			fontColor: '#fff',			
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_bzr2.png',        // img: 'block_icon/hardware_icon.svg',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'thinkboard_digital_port_onoff_list',
                    },
                    null,
                ],
                type: 'thinkboard_buzzer_onoff',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'ThinkBoard_BUZ',
            isNotFor: ['ThinkBoard'],
            func: function(sprite, script) 
			{
				var port = 10;
                var mode = script.getNumberValue('VALUE');		
				
                if (!Entry.hw.sendQueue['SET']) {
                Entry.hw.sendQueue['SET'] = {};
                }
				
                Entry.hw.sendQueue['SET'][port] = {
                type: Entry.ThinkBoard.sensorTypes.BUZZER,
                data: mode,
                time: new Date().getTime(),
                };				
            },
            syntax: { js: [], py: [] },
        },
		
       thinkboard_list_digital_octave: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,	
			fontColor: '#fff',			
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
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
                        ['8', '8'],
                    ],
                    value: '3',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                OCTAVE: 0,
            },
            func: function(sprite, script) {
                return script.getField('OCTAVE');
            },
        },
		
        thinkboard_list_digital_tone: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,	
			fontColor: '#fff',			
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.silent, '0'],
                        [Lang.Blocks.do_name, 'C'],
                        [Lang.Blocks.do_sharp_name, 'CS'],
                        [Lang.Blocks.re_name, 'D'],
                        [Lang.Blocks.re_sharp_name, 'DS'],
                        [Lang.Blocks.mi_name, 'E'],
                        [Lang.Blocks.fa_name, 'F'],
                        [Lang.Blocks.fa_sharp_name, 'FS'],
                        [Lang.Blocks.sol_name, 'G'],
                        [Lang.Blocks.sol_sharp_name, 'GS'],
                        [Lang.Blocks.la_name, 'A'],
                        [Lang.Blocks.la_sharp_name, 'AS'],
                        [Lang.Blocks.si_name, 'B'],
                    ],
                    value: 'C',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                NOTE: 0,
            },
            func: function(sprite, script) {
                return script.getField('NOTE');
            },
        },
		
		// 1. 버저 - 2) 버저 옥타브/음/초 동안 연주
        thinkboard_set_digital_buzzer: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,			
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.thinkboard_set_digital_buzzer,
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
                    img: 'block_icon/hardware_bzr2.png',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'thinkboard_list_digital_octave',						
                    },
                    {
                        type: 'thinkboard_list_digital_tone',
                    },
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'thinkboard_set_digital_buzzer',
            },
            paramsKeyMap: {
                OCTAVE: 0,				
                NOTE: 1,
                DURATION: 2,
            },
            class: 'ThinkBoard_BUZ',
            isNotFor: ['ThinkBoard'],
            func: function(sprite, script) {
                var port = 10;
                var duration = script.getNumberValue('DURATION');
                var octave = script.getNumberValue('OCTAVE') - 1;
                var value = 0;

                if (!script.isStart) 
				{
                    var note = script.getValue('NOTE');
                    if (!Entry.Utils.isNumber(note)) 
					{
                        note = Entry.ThinkBoard.toneTable[note];
                    }
                    if (note < 0) note = 0;
                    else if (note > 12) note = 12;

                    if (duration < 0) duration = 0;
					
                    if (!Entry.hw.sendQueue['SET']) 
					{
                        Entry.hw.sendQueue['SET'] = {};
                    }
					
                    if (duration == 0) 
					{
                        Entry.hw.sendQueue['SET'][port] = 
						{
                            type: Entry.ThinkBoard.sensorTypes.TONE,
                            data: 0,
                            time: new Date().getTime(),
                        };
                        return script.callReturn();
                    }
					
                    if (octave < 0) octave = 0;
                    else if (octave > 8) octave = 8;
                    if (note != 0) value = Entry.ThinkBoard.toneMap[note][octave];

                    duration = duration * 1000;
                    script.isStart = true;
                    script.timeFlag = 1;

                    Entry.hw.sendQueue['SET'][port] = 
					{
                        type: Entry.ThinkBoard.sensorTypes.TONE,
                        data: 
						{
                            value: value,
                            duration: duration,
                        },
                        time: new Date().getTime(),
                    };

                    setTimeout(function() 
					{
                        script.timeFlag = 0;
                    }, duration + 32);
                    return script;
                } 
				else if (script.timeFlag == 1) 
				{
                    return script;
                } 
				else 
				{
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.hw.sendQueue['SET'][port] = 
					{
                        type: Entry.ThinkBoard.sensorTypes.TONE,
                        data: 0,
                        time: new Date().getTime(),
                    };
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: [] },
        },
		
        thinkboard_digital_port_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,			
			fontColor: '#fff',			
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['IN/OUT1', '0'],
                        ['IN/OUT2', '1'],
                        ['IN/OUT3', '2'],
                        ['IN/OUT4', '3'],						
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    arrowColor: EntryStatic.ARROW_COLOR_HW,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                PORT: 0,
            },
            func: function(sprite, script) {
                return script.getStringField('PORT');
            },
        },

        thinkboard_digital_2_port_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,			
			fontColor: '#fff',			
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['IN/OUT2', '1'],
                        ['IN/OUT4', '3'],						
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    arrowColor: EntryStatic.ARROW_COLOR_HW,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                PORT: 0,
            },
            func: function(sprite, script) {
                return script.getStringField('PORT');
            },
        },

		thinkboard_motor_direction_list: 
		{
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,	
			fontColor: '#fff',			
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['시계', '0'],
                        ['반시계', '1'],		
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    arrowColor: EntryStatic.ARROW_COLOR_HW,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                DIR: 0,
            },
            func: function(sprite, script) {
                return script.getStringField('DIR');
            },
        },
		
		// 2. 버튼 - 1) 버튼 센서 값		
        thinkboard_get_digital_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,			
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: Lang.template.thinkboard_get_digital_value,
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },            
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'thinkboard_digital_port_list',
                    },
                ],
                type: 'thinkboard_get_digital_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'ThinkBoard_BTN',
            isNotFor: ['ThinkBoard'],
            func: function(sprite, script) 
			{		
                var port = script.getNumberValue('PORT');
                var DIGITAL = Entry.hw.portData.DIGITAL;
				
                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                Entry.hw.sendQueue['GET'][
                    Entry.ThinkBoard.sensorTypes.DIGITAL
                ] = {
                    port: port,
                    time: new Date().getTime(),
                };
		
				return DIGITAL[port+2];
            },
            syntax: { js: [], py: [] },
        },	
		
		// 2. 버튼 - 2) 버튼 센서 누름	
		thinkboard_digital_button_pressed: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,			
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'thinkboard_digital_port_list',
                    },
                ],
                type: 'thinkboard_digital_button_pressed',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'ThinkBoard_BTN',
            isNotFor: ['ThinkBoard'],
            func: function(sprite, script)
			{
                var btn_index = script.getNumberValue('PORT');
                var value = 0;
                var btn_pressed = 0;

                var DIGITAL = Entry.hw.portData.DIGITAL;
                value = DIGITAL[btn_index+2];
                btn_pressed = value > 0 ? 1 : 0;

                return btn_pressed;
            },
            syntax: { js: [], py: [] },
        },
		
        thinkboard_analog_port_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,			
			fontColor: '#fff',			
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['INPUT1', '0'],
                        ['INPUT2', '1'],
                        ['INPUT3', '2'],
                        ['INPUT4', '3'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                PORT: 0,
            },
            func: function(sprite, script) {
                return script.getField('PORT');
            },
        },

        thinkboard_analog_port_name: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,			
			fontColor: '#fff',			
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['소리', '0'],
                        ['빛', '1'],
                        ['가변저항', '2'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                PORT: 0,
            },
            func: function(sprite, script) {
                return script.getField('PORT');
            },
        },
		
		// 3. 소리/빛/가변저항 - 1) 센서 값 				
        thinkboard_get_analog_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,			
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: Lang.template.thinkboard_get_analog_value,
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
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'thinkboard_analog_port_list',
                    },
                    {
                        type: 'thinkboard_analog_port_name',
                    },					
                ],
                type: 'thinkboard_get_analog_value',
            },
            paramsKeyMap: {
                PORT: 0,
				TYPE: 1,
            },
            class: 'ThinkBoard_ANA',
            isNotFor: ['ThinkBoard'],
            func: function(sprite, script) 
			{
                var port = script.getNumberValue('PORT');		
                var type = script.getValue('TYPE', script);			                		
                var ANALOG = Entry.hw.portData.ANALOG;

                if(type === "2") return (1023-ANALOG[port]);
                else return ANALOG[port];
            },
            syntax: { js: [], py: [] },
        },
		
		// 3. 소리/빛/가변저항 - 2) mapping 값			
        thinkboard_get_analog_mapping: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,			
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: Lang.template.thinkboard_get_analog_mapping,
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
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },				
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'thinkboard_analog_port_list',
                    },
                    {
                        type: 'thinkboard_analog_port_name',
                    },					
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['1023'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['100'],
                    },
                ],
                type: 'thinkboard_get_analog_mapping',
            },
            paramsKeyMap: {
                PORT: 0,
				TYPE: 1,
                VALUE2: 2,
                VALUE3: 3,
                VALUE4: 4,
                VALUE5: 5,
            },
            class: 'ThinkBoard_ANA',
            isNotFor: ['ThinkBoard'],
            func: function(sprite, script) 
			{
                var port = script.getValue('PORT', script);
                var type = script.getValue('TYPE', script);				
                var result = 0;
                var ANALOG = Entry.hw.portData.ANALOG;
                var value2 = script.getNumberValue('VALUE2', script);
                var value3 = script.getNumberValue('VALUE3', script);
                var value4 = script.getNumberValue('VALUE4', script);
                var value5 = script.getNumberValue('VALUE5', script);
			
                if (port[0] === 'A') {
                    port = port.substring(1);
                }
//[4/18]  result = ANALOG ? ANALOG[port] || 0 : 0;           
                if(type === "2") result = 1023-ANALOG[port];
                else result = ANALOG[port];

                if (value2 > value3) {
                    var swap = value2;
                    value2 = value3;
                    value3 = swap;
                }
                if (value4 > value5) {
                    var swap = value4;
                    value4 = value5;
                    value5 = swap;
                }
                result -= value2;
                result = result * ((value5 - value4) / (value3 - value2));
                result += value4;

                result = Math.min(value5, result);
                result = Math.max(value4, result);

                return Math.round(result);
            },
            syntax: { js: [], py: [] },
        },
			
		// 6. 거리 - 1) 센서 값		
        thinkboard_get_distsensor_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,			
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: Lang.template.thinkboard_get_distsensor_value,
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'thinkboard_analog_port_list',
                    },
                ],
                type: 'thinkboard_get_distsensor_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'ThinkBoard_IR',
            isNotFor: ['ThinkBoard'],
            func: function(sprite, script) {
                var port = script.getValue('PORT', script);
                var ANALOG = Entry.hw.portData.ANALOG;

                if (port[0] === 'A') port = port.substring(1);

                return ANALOG ? (1023-ANALOG[port]) || 0 : 0;
            },
            syntax: { js: [], py: [] },
        },
		
		// 6. 거리 센서 - 2) mapping 값			
        thinkboard_get_analog_ir_mapping: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,			
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: Lang.template.thinkboard_get_analog_ir_mapping,
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
                    type: 'Block',
                    accept: 'string',
                },				
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'thinkboard_analog_port_list',
                    },			
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['1023'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['100'],
                    },
                ],
                type: 'thinkboard_get_analog_ir_mapping',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE2: 1,
                VALUE3: 2,
                VALUE4: 3,
                VALUE5: 4,
            },
            class: 'ThinkBoard_IR',
            isNotFor: ['ThinkBoard'],
            func: function(sprite, script) {
                var port = script.getValue('PORT', script);
                var result = 0;
                var ANALOG = Entry.hw.portData.ANALOG;
                var value2 = script.getNumberValue('VALUE2', script);
                var value3 = script.getNumberValue('VALUE3', script);
                var value4 = script.getNumberValue('VALUE4', script);
                var value5 = script.getNumberValue('VALUE5', script);

                if (port[0] === 'A') {
                    port = port.substring(1);
                }
                //[4/19] add
                result = ANALOG ? (1023-ANALOG[port]) || 0 : 0;

                if (value2 > value3) {
                    var swap = value2;
                    value2 = value3;
                    value3 = swap;
                }
                if (value4 > value5) {
                    var swap = value4;
                    value4 = value5;
                    value5 = swap;
                }
                result -= value2;
                result = result * ((value5 - value4) / (value3 - value2));
                result += value4;
                result = Math.min(value5, result);
                result = Math.max(value4, result);

                return Math.round(result);
            },
            syntax: { js: [], py: [] },
        },
		
		// 7. 초음파 - 1) 센서 값		
        thinkboard_get_usonic_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,			
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: Lang.template.thinkboard_get_usonic_value,
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'thinkboard_digital_port_list',
                    },
                ],
                type: 'thinkboard_get_usonic_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'ThinkBoard_USONIC',
            isNotFor: ['ThinkBoard'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                delete Entry.hw.sendQueue['SET'][port];
				
                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                Entry.hw.sendQueue['GET'][
                    Entry.ThinkBoard.sensorTypes.USONIC		
                ] = {
                    port: port,
                    time: new Date().getTime(),
                };

                return Entry.hw.portData.USONIC[port] || 0;
            },
            syntax: { js: [], py: [] },
        },
		
		// 7. 초음파 센서 - 2) mapping 값			
        thinkboard_get_analog_usonic_mapping: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,			
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: Lang.template.thinkboard_get_analog_usonic_mapping,
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
                    type: 'Block',
                    accept: 'string',
                },				
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'thinkboard_digital_port_list',
                    },			
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['400'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['100'],
                    },
                ],
                type: 'thinkboard_get_analog_usonic_mapping',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE2: 1,
                VALUE3: 2,
                VALUE4: 3,
                VALUE5: 4,
            },
            class: 'ThinkBoard_USONIC',
            isNotFor: ['ThinkBoard'],
            func: function(sprite, script) {
                var port = script.getValue('PORT', script);
                var result = 0;
				
                var value2 = script.getNumberValue('VALUE2', script);
                var value3 = script.getNumberValue('VALUE3', script);
                var value4 = script.getNumberValue('VALUE4', script);
                var value5 = script.getNumberValue('VALUE5', script);

               if (!Entry.hw.sendQueue['SET']) {
                Entry.hw.sendQueue['SET'] = {};
                }
                delete Entry.hw.sendQueue['SET'][port];
            
                if (!Entry.hw.sendQueue['GET']) {
                Entry.hw.sendQueue['GET'] = {};
                }
                Entry.hw.sendQueue['GET'][
                    Entry.ThinkBoard.sensorTypes.USONIC		
                ] = {
                    port: port,
                    time: new Date().getTime(),
                };               
                result = Entry.hw.portData.USONIC[port];

                if (value2 > value3) {
                    var swap = value2;
                    value2 = value3;
                    value3 = swap;
                }
                if (value4 > value5) {
                    var swap = value4;
                    value4 = value5;
                    value5 = swap;
                }
                result -= value2;
                result = result * ((value5 - value4) / (value3 - value2));
                result += value4;
                result = Math.min(value5, result);
                result = Math.max(value4, result);
                
                return Math.round(result);
            },
            syntax: { js: [], py: [] },
        },
				
       thinkboard_analog_temp_name: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,	
			fontColor: '#fff',			
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['습도', '0'],
                        ['온도(화씨)', '1'],
                        ['온도(섭씨)', '2'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                PORT: 0,
            },
            func: function(sprite, script) {
                return script.getField('PORT');
            },
        },
		
		// 8. 온습도 - 1) 센서 값 				
        thinkboard_get_analog_temp_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,			
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: Lang.template.thinkboard_get_temp_value,
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
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'thinkboard_digital_port_list',
                    },
                    {
                        type: 'thinkboard_analog_temp_name',
                    },					
                ],
                type: 'thinkboard_get_analog_temp_value',
            },
            paramsKeyMap: {
                PORT: 0,
				TYPE: 1,
            },
            class: 'ThinkBoard_TMP',
            isNotFor: ['ThinkBoard'],
            func: function(sprite, script) 
            {
                var port = script.getNumberValue('PORT');
                var type = script.getNumberValue('TYPE');				
                
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                delete Entry.hw.sendQueue['SET'][port];
        				
                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                Entry.hw.sendQueue['GET'][
                    Entry.ThinkBoard.sensorTypes.TEMP		
                ] = {
                    port,
                    time: new Date().getTime(),
                };

                var temp;
                switch(type)
                {
                    case 0: temp = Entry.hw.portData.TEMP[0];        // humidity
                                break;
                    case 1: temp = Entry.hw.portData.TEMP[1];        // temp_F
                                temp = Math.round(temp*1.8+32);                                               
                                break;                
                    case 2: temp = Entry.hw.portData.TEMP[1];        // temp_C              
                                break;                                                
                }
                return temp || 0;                
            },
            syntax: { js: [], py: [] },
        },
		
		// 9. 레이저 - 1) On/Off
		thinkboard_digital_Laser_onoff: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,	
			fontColor: '#fff',			
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_laser.png',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'thinkboard_digital_port_list',
                    },
                    {
                        type: 'thinkboard_digital_port_onoff_list',
                    },					
                    null,
                ],
                type: 'thinkboard_digital_Laser_onoff',
            },
            paramsKeyMap: {
                PORT: 0,
				VALUE: 1,
            },
            class: 'ThinkBoard_LASER',
            isNotFor: ['ThinkBoard'],
           func: function(sprite, script) 
		   {
                var port = script.getNumberValue('PORT');
                var value = script.getNumberValue('VALUE');
                
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port+2] = {
                    type: Entry.ThinkBoard.sensorTypes.LASER,
                    data: value,
                    time: new Date().getTime(),
                };
                return script.callReturn();				
            },
            syntax: { js: [], py: [] },
        },

		//
       thinkboard_analog_rgb_color_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,		
			fontColor: '#fff',			
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['흰', '1'],
                        ['빨간', '2'],
                        ['연두', '3'],
                        ['파란', '4'],
                        ['노란', '5'],
                        ['하늘', '6'],
                        ['보라', '7'],						
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
            },
            paramsKeyMap: {
                PORT: 0,
            },
            func: function(sprite, script) {
                return script.getField('PORT');
            },
        },
		
		// 10. RGBLED - 1) 종류 선택 및 On/Off
		thinkboard_digital_rgbled_onoff: 
		{
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,		
			fontColor: '#fff',			
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
/*[4/19]                
                {
                    type: 'Block',
                    accept: 'string',
                },				
*/                
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_led.png',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'thinkboard_analog_rgb_color_list',
                    },
/*[4/19]                    
                    {
                        type: 'thinkboard_digital_port_onoff_list',
                    },	
*/                    				
                    null,
                ],
                type: 'thinkboard_digital_rgbled_onoff',
            },
            paramsKeyMap: {
                COLOR: 0,
//[4/19]  ONOFF: 1,
            },
            class: 'ThinkBoard_RGB',
            isNotFor: ['ThinkBoard'],
            func: function(sprite, script) 
			{	
				var port = 11;
                var color = script.getNumberValue('COLOR', script);
//[4/19]  var onoff = script.getNumberValue('ONOFF', script);

				var rLED, gLED, bLED;

//[4/19]  if(onoff === 0) color = 0;
				switch(color)
				{
					case 0:	rLED = gLED = bLED = 0;			            // Black
								break;
					case 1:	rLED = gLED = bLED = 255;		         // white
								break;					
					case 2:	rLED = 255; gLED = bLED = 0;	        // Red
								break;				
					case 3:	rLED = bLED = 0; gLED = 255;	        // Lime
								break;					
					case 4:	rLED = gLED = 0; bLED = 255;	        // Blue
								break;					
					case 5:	rLED = gLED = 255; bLED = 0;            // Yellow
								break;					
					case 6:	rLED = 0; gLED = bLED = 255;            // Cyan
								break;					
					case 7:	rLED = bLED = 255; gLED = 0;		   // Magenta
								break;
				}
									
                if (!Entry.hw.sendQueue['SET']) 
				{
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.ThinkBoard.sensorTypes.RGBLED,
                    data: {			
                        r: rLED,
                        g: gLED,
                        b: bLED,
                    },
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        
		// 10. RGBLED - 2) Off
		thinkboard_digital_rgbled_off: 
		{
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,		
			fontColor: '#fff',			
            skeleton: 'basic',
            statements: [],
            params: [    
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_led.png',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [ 				
                    null,
                ],
                type: 'thinkboard_digital_rgbled_off',
            },
            paramsKeyMap: {
            },
            class: 'ThinkBoard_RGB',
            isNotFor: ['ThinkBoard'],
            func: function(sprite, script) 
			{	
				var port = 11;
				var rLED = 0, gLED = 0, bLED = 0;
							
                if (!Entry.hw.sendQueue['SET']) 
				{
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.ThinkBoard.sensorTypes.RGBLED,
                    data: {			
                        r: rLED,
                        g: gLED,
                        b: bLED,
                    },
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },        

		// 10. RGBLED - 2) RGB 값으로 켜기
		thinkboard_digital_set_rgbled_value: 
		{
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,	
			fontColor: '#fff',			
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
                    img: 'block_icon/hardware_led.png',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'number',
						params: ["0"],
                    },
                    {
                        type: 'number',
						params: ["0"],
                    },				
					{
                        type: 'number',
						params: ["0"],
                    },	
                    null,
                ],
                type: 'thinkboard_digital_set_rgbled_value',
            },
            paramsKeyMap: {
                VALUE0:0,
                VALUE1:1,
				VALUE2:2,
            },
            class: 'ThinkBoard_RGB',
            isNotFor: ['ThinkBoard'],
            func: function(sprite, script) 
			{
                var port = 12;      
                var rLED = script.getNumberValue('VALUE0', script);
                var gLED = script.getNumberValue('VALUE1', script);
                var bLED = script.getNumberValue('VALUE2', script);

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.ThinkBoard.sensorTypes.RGBLED,
                    data: {
                        r: rLED,
                        g: gLED,
                        b: bLED,
                    },
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        
		// 10. RGBLED - 3) 밝기 설정
		thinkboard_digital_rgbled_percent: 
		{
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,		
			fontColor: '#fff',			
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },				
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_led.png',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'number',
						params: ["0"],
                    },						
                    null,
                ],
                type: 'thinkboard_digital_rgbled_percent',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'ThinkBoard_RGB',
            isNotFor: ['ThinkBoard'],
            func: function(sprite, script) 
			{
                var port = 13;      
                var value = script.getNumberValue('VALUE', script);

				var rLED, gLED, bLED;
				if(value == 0)
				{
					rLED = gLED = bLED = 0;
				}
				else if(value <= 100)
				{
					rLED = (255*value)/100;
					gLED = (255*value)/100;
					bLED = (255*value)/100;				
				}
				else
				{
					rLED = gLED = bLED = 255;
				}
				
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.ThinkBoard.sensorTypes.RGBLED,
                    data: {
                        r: rLED,
                        g: gLED,
                        b: bLED,
                    },
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        
		// 11. 180 서보 모터 - 1) 모터 현재 각도 값	얻어오기	
        thinkboard_get_digital_servo_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,			
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: Lang.template.thinkboard_get_digital_servo_value,
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },      
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'thinkboard_digital_2_port_list',
                    },            
                ],
                type: 'thinkboard_get_digital_servo_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'ThinkBoard_SVO',
            isNotFor: ['ThinkBoard'],
            func: function(sprite, script) 
			{
                var port = script.getNumberValue('PORT');	
                var mode = 0;       
                
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                    }
                    delete Entry.hw.sendQueue['SET'][port];

                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                Entry.hw.sendQueue['GET'][Entry.ThinkBoard.sensorTypes.SERVO] = 
				{
                    port: [port, mode],
                    time: new Date().getTime(),
                };
				
                // LEEJC 2020.3.17
                if(port === 1)  Entry.hw.portData.SERVO[port] = Entry.ThinkBoard.sValue1;     
                else Entry.hw.portData.SERVO[port] = Entry.ThinkBoard.sValue2;    
				
                return Entry.hw.portData.SERVO[port] || 0;
            },
            syntax: { js: [], py: [] },
        },	

		// 11. 180 서보 모터 - 2) 모터 각도 설정하기		
		thinkboard_digital_set_servo_angle: 
		{
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,		
			fontColor: '#fff',			
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_servo.png',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'thinkboard_digital_2_port_list',
                    },	
                    {
                        type: 'number',
						params: ["0"],
                    },				
                    null,
                ],
                type: 'thinkboard_digital_set_servo_angle',
            },
            paramsKeyMap: 
			{
                PORT: 0,
                ANGLE: 1,
            },
            class: 'ThinkBoard_SVO',
            isNotFor: ['ThinkBoard'],
            func: function(sprite, script) 
			{
                var port = script.getNumberValue('PORT', script);
                var mode = 2;                
                var angle = script.getNumberValue('ANGLE', script);
                
                angle = Math.min(180, angle);
                angle = Math.max(0, angle);
				
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = 
				{
                    type: Entry.ThinkBoard.sensorTypes.SERVO,
                    data: [mode, angle],
                    time: new Date().getTime(),
                };
				
                // LEEJC 2020.3.17
                if(port === 1)  Entry.ThinkBoard.sValue1 = angle;     
                else Entry.ThinkBoard.sValue2 = angle;    
				
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
		
		// 11. 180 서보 모터 - 3) 설정 방향 및 1도 바꾸기		
		thinkboard_digital_set_servo_direction: 
		{
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			fontColor: '#fff',			
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_servo.png',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'thinkboard_digital_2_port_list',
                    },			                       
                    {
                        type: 'thinkboard_motor_direction_list',
                    },		
                    null,
                ],
                type: 'thinkboard_digital_set_servo_direction',
            },
            paramsKeyMap: {
                PORT: 0,
                DIR: 1,
            },
            class: 'ThinkBoard_SVO',
            isNotFor: ['ThinkBoard'],
            func: function(sprite, script) 
			{
                var port = script.getNumberValue('PORT', script);
                var mode = 3;                
                var dir = script.getNumberValue('DIR', script);
                
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = 
				{
                    type: Entry.ThinkBoard.sensorTypes.SERVO,
                    data: [mode, dir],
                    time: new Date().getTime(),
                };
				
                if(dir === 0) // 반시계 방향 (-)
                {
                    // LEEJC 2020.3.17
                    if(port === 1)
                    {
                        if(Entry.ThinkBoard.sValue1 > 0) Entry.ThinkBoard.sValue1--;     
                    }
                    else 
                    {
                        if(Entry.ThinkBoard.sValue2 > 0) Entry.ThinkBoard.sValue2--;                  
                    }
                }
                else    // (dir === 1) 시계 방향(++)
                {
                    // LEEJC 2020.3.17
                    if(port === 1)
                    {
                        if(Entry.ThinkBoard.sValue1 < 180) Entry.ThinkBoard.sValue1++;     
                    }
                    else 
                    {
                        if(Entry.ThinkBoard.sValue2 < 180) Entry.ThinkBoard.sValue2++;                  
                    }
                }
				
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },

		// 11. 180 서보 모터 - 4) 모터 정지하기		
		thinkboard_digital_set_servo_stop: 
		{
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,		
			fontColor: '#fff',			
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },              
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_servo.png',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'thinkboard_digital_2_port_list',
                    },	                	
                    null,
                ],
                type: 'thinkboard_digital_set_servo_stop',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'ThinkBoard_SVO',
            isNotFor: ['ThinkBoard'],
            func: function(sprite, script) 
			{
                var port = script.getNumberValue('PORT', script);
                var mode = 4;                
				var angle = 0;
                
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = 
				{
                    type: Entry.ThinkBoard.sensorTypes.SERVO,
                    data: [mode, angle],
                    time: new Date().getTime(),
                };
			
                    // LEEJC 2020.3.17
                if(port === 1) Entry.ThinkBoard.sValue1 = 0;    
                else Entry.ThinkBoard.sValue2 = 0;  	
				
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
           
        // 12. 360도 서보 모터 - 1) 모터 각도 값		
        thinkboard_get_digital_servo_360_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: Lang.template.thinkboard_get_digital_servo_360_value,
            params: [{
                type: 'Block',
                accept: 'string',
            }, ],
            events: {},
            def: {
                params: [{
                    type: 'thinkboard_digital_2_port_list',
                }, ],
                type: 'thinkboard_get_digital_servo_360_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'ThinkBoard_SVO2',
            isNotFor: ['ThinkBoard'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT');
                var mode = 1; // get current 360-Angle

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                delete Entry.hw.sendQueue['SET'][port];

                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                Entry.hw.sendQueue['GET'][
                    Entry.ThinkBoard.sensorTypes.SERVO
                ] = {
                    port: [port, mode],
                    time: new Date().getTime(),
                };
                return Entry.hw.portData.SERVO[port] || 0;                
            },
            syntax: { js: [], py: [] },
        },

        // 12. 360도 서보 모터 - 2) 모터 각도 설정하기		
        thinkboard_digital_set_servo_360_angle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [{
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },           
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_servo.png',                    
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [{
                        type: 'thinkboard_digital_2_port_list',
                    },                    
                    {
                        type: 'number',
                        params: ["0"],
                    },
                    null,
                ],
                type: 'thinkboard_digital_set_servo_360_angle',
            },
            paramsKeyMap: {
                PORT: 0,
                SPEED: 1,
            },
            class: 'ThinkBoard_SVO2',
            isNotFor: ['ThinkBoard'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT', script);
                var speed = script.getNumberValue('SPEED', script);
                var mode = 5;

                speed = Math.min(360, speed);
                speed = Math.max(0, speed);

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.ThinkBoard.sensorTypes.SERVO,
                    data: [mode, speed],
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },

        // 14. 360도 서보 모터 - 4) 모터 정지하기		
        thinkboard_digital_set_servo_360_stop: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            params: [{
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_servo.png',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [{
                        type: 'thinkboard_digital_2_port_list',
                    },
                    null,
                ],
                type: 'thinkboard_digital_set_servo_360_stop',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'ThinkBoard_SVO2',
            isNotFor: ['ThinkBoard'],
            func: function(sprite, script) {
                var port = script.getNumberValue('PORT', script);
                var mode = 6; //script.getNumberValue('VALUE', script);
                var angle = 90;

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.ThinkBoard.sensorTypes.SERVO,
                    data: [mode, angle],
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
      

		// 15. DC 모터 - 1) 방향 바꾸기		
		thinkboard_digital_set_motor_direction: 
		{
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,	
			fontColor: '#fff',			
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_dc.png',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'thinkboard_digital_2_port_list',
                    },			
                    {
                        type: 'thinkboard_motor_direction_list',
                    },		
                    null,
                ],
                type: 'thinkboard_digital_set_motor_direction',
            },
            paramsKeyMap: {
                PORT: 0,
				DIR: 1,
			},
            class: 'ThinkBoard_DC',
            isNotFor: ['ThinkBoard'],
            func: function(sprite, script) 
			{
                var port = script.getNumberValue('PORT', script);
                var dir = script.getNumberValue('DIR', script);
				var mode = 1;
						
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = 
				{
                    type: Entry.ThinkBoard.sensorTypes.MOTOR,
                    data: [mode, dir],
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
		
		// 16. DC 모터 - 2) 모터 속도 정하기		
		thinkboard_digital_set_motor_speed: 
		{
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,	
			fontColor: '#fff',			
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_dc.png',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'thinkboard_digital_2_port_list',
                    },
                    {
                        type: 'number',
						params: ["0"],
                    },				
                    null,
                ],
                type: 'thinkboard_digital_set_motor_speed',
            },
            paramsKeyMap: {
                PORT: 0,
				SPEED: 1,
            },
            class: 'ThinkBoard_DC',
            isNotFor: ['ThinkBoard'],
            func: function(sprite, script) 
			{
                var port = script.getNumberValue('PORT', script);
                var speed = script.getNumberValue('SPEED', script);
				var mode = 2;
						
                speed = Math.min(100, speed);
                speed = Math.max(0, speed);		                           
                
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = 
				{
                    type: Entry.ThinkBoard.sensorTypes.MOTOR,
                    data: [mode, speed],
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
		
		// 17. DC 모터 - 4) 모터 정지하기		
		thinkboard_digital_motor_stop: 
		{
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,		
			fontColor: '#fff',			
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_dc.png',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'thinkboard_digital_2_port_list',
                    },		
                    null,
                ],
                type: 'thinkboard_digital_motor_stop',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'ThinkBoard_DC',
            isNotFor: ['ThinkBoard'],
            func: function(sprite, script) 
			{
                var port = script.getNumberValue('PORT', script);
				var mode = 3;
				var speed = 0;
		
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = 
				{
                    type: Entry.ThinkBoard.sensorTypes.MOTOR,
                    data: [mode, speed],
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
    };
};

module.exports = Entry.ThinkBoard;
