'use strict';

Entry.iCOBOT = {
    id: '50.2',
    name: 'iCOBOT',
    url: 'https://aicontrol.ai/',
    imageName: 'iCOBOT.png',
    title:
    {
        ko: '아이코봇',
        en: 'iCOBOT',
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
        SENSOR: 1,
        MOTOR: 2,
        BUZZER: 3,
        RGBLED: 4,
        TONE: 5,
        TEMP: 6,
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
    sValue1: 0,
    sValue2: 0	
};

Entry.iCOBOT.blockMenuBlocks = [
		'icobot_get_cds_value',
		'icobot_get_sound_value',
		'icobot_get_analog_temp_value',
		'icobot_get_distsensor_value',
		'icobot_buzzer_onoff',		
        'icobot_set_digital_buzzer_notime',		
        'icobot_set_digital_buzzer',
        'icobot_digital_rgbled_off',    
        'icobot_digital_rgbled_onoff',      
        'icobot_digital_set_rgbled_value',
        'icobot_digital_rgbled_percent',  
		'icobot_digital_motor_stop',	
		'icobot_digital_set_motor_speed',
		'icobot_digital_set_motor_direction',
		'icobot_digital_set_motor_angle',
];

Entry.iCOBOT.setLanguage = function() {
    return {
        ko: {
            template: {
				"icobot_buzzer_onoff": "부저 %1 %2",				
                "icobot_set_digital_buzzer": "부저를 %1 옥타브 %2 음 %3 초 연주 %4",
                "icobot_set_digital_buzzer_notime": "부저를 %1 옥타브 %2 음 연주 %3",	
				"icobot_get_cds_value": "조도 센서 값",
				"icobot_get_sound_value": "사운드(소리)감지 센서 값",
				"icobot_get_distsensor_value": "거리(IR) %1 센서 값",
				"icobot_get_analog_temp_value": "%1 센서 값",	        
                "icobot_digital_rgbled_onoff": "RGB LED %1 색 켜기 %2",	
				"icobot_digital_rgbled_off": "RGB LED 끄기 %1",	                
                "icobot_digital_set_rgbled_value": "RGB LED 빨강 %1 초록 %2 파랑 %3 으로 켜기 %4",
				"icobot_digital_set_motor_direction": "%1 모터 방향을 %2 방향으로 정하기 %3",
				"icobot_digital_set_motor_angle": "%1 방향으로 %2 도 회전하기 %3",
				"icobot_digital_set_motor_speed": "%1 모터의 속도를 %2 로 정하기 %3", 
				"icobot_digital_motor_stop": "%1 모터 정지하기 %2",			
            }
        },
        en: {
            template: {
				"icobot_buzzer_onoff": "Buzzer %1 %2",				
                "icobot_set_digital_buzzer": "Play Buzzer %1 Octave %2 Note %3 Sec %4",	
                "icobot_set_digital_buzzer_notime": "Play Buzzer %1 Octave %2 Note %3",
				"icobot_get_cds_value": "CDS Sensor Value",
				"icobot_get_sound_value": "Sound Sensor Value",
				"icobot_get_distsensor_value": "Distance(IR) %1 Sensor Value",	
				"icobot_get_analog_temp_value": "%1 Sensor Value",		                
                "icobot_digital_rgbled_onoff": "RGB LED %1 Color Turn On %2",	
				"icobot_digital_rgbled_off": "RGB LED Turn Off %1",	                	
                "icobot_digital_set_rgbled_value": "Turn On RGB LED with RED %1 GREEN %2 BLUE %3 value %4",
				"icobot_digital_set_motor_direction": "Set %1 Motor Direction to %2 %3",	
				"icobot_digital_set_motor_angle": "Rotation %2 degrees in direction %1 %3",	
				"icobot_digital_set_motor_speed": "Set %1 Motor Speed to %2 %3", 	
				"icobot_digital_motor_stop": "Stop %1 Motor %2",					
            }
        }
    }
};

Entry.iCOBOT.getBlocks = function() {
    return {
        icobot_digital_port_onoff_list: {
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
		
		// 1. 부저 - 1) 부저 On/Off 삐소리
		icobot_buzzer_onoff: {
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
                        type: 'icobot_digital_port_onoff_list',
                    },
                    null,
                ],
                type: 'icobot_buzzer_onoff',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'iCOBOT_BUZ',
            isNotFor: ['iCOBOT'],
            func: function(sprite, script) 
			{
				var port = 6;
                var mode = script.getNumberValue('VALUE');		
				
                if (!Entry.hw.sendQueue['SET']) {
                Entry.hw.sendQueue['SET'] = {};
                }
				
                Entry.hw.sendQueue['SET'][port] = {
                type: Entry.iCOBOT.sensorTypes.BUZZER,
                data: mode,
                time: new Date().getTime(),
                };				
            },
            syntax: { js: [], py: [] },
        },
		
       icobot_list_digital_octave: {
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
                    value: '4',
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
		
        icobot_list_digital_tone: {
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
		
		// 1. 부저 - 2) 부저 옥타브/음/초 동안 연주
        icobot_set_digital_buzzer: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,			
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.icobot_set_digital_buzzer,
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
                        type: 'icobot_list_digital_octave',						
                    },
                    {
                        type: 'icobot_list_digital_tone',
                    },
                    {
                        type: 'number',
						params: ["1"],
                    },
                    null,
                ],
                type: 'icobot_set_digital_buzzer',
            },
            paramsKeyMap: {
                OCTAVE: 0,				
                NOTE: 1,
                DURATION: 2,
            },
            class: 'iCOBOT_BUZ',
            isNotFor: ['iCOBOT'],
            func: function(sprite, script) {
                var port = 6;
                var octave = script.getNumberValue('OCTAVE') - 1;
                var duration = script.getNumberValue('DURATION', script);
                var value = 0;

                if (!script.isStart) 
				{
                    var note = script.getValue('NOTE');
                    if (!Entry.Utils.isNumber(note)) 
					{
                        note = Entry.iCOBOT.toneTable[note];
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
                            type: Entry.iCOBOT.sensorTypes.TONE,
                            data: 0,
                            time: new Date().getTime(),
                        };
                        return script.callReturn();
                    }
					
                    if (octave < 0) octave = 0;
                    else if (octave > 8) octave = 8;
                    if (note != 0) value = Entry.iCOBOT.toneMap[note][octave];

                    duration = duration * 1000;
                    script.isStart = true;
                    script.timeFlag = 1;

                    Entry.hw.sendQueue['SET'][port] = 
					{
                        type: Entry.iCOBOT.sensorTypes.TONE,
                        data: 
						{
                            value: value,
                            duration: duration,
                        },
                        time: new Date().getTime(),  //millis()여서 duration에 1000를 곱함
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
                        type: Entry.iCOBOT.sensorTypes.TONE,
                        data: 0,
                        time: new Date().getTime(),
                    };
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: [] },
        },
		
		// 1. 부저 - 2) 부저 옥타브/음/초 동안 연주
        icobot_set_digital_buzzer_notime: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,			
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.icobot_set_digital_buzzer_notime,
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
                    img: 'block_icon/hardware_bzr2.png',
                    size: 11,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'icobot_list_digital_octave',						
                    },
                    {
                        type: 'icobot_list_digital_tone',
                    },
                    null,
                ],
                type: 'icobot_set_digital_buzzer_notime',
            },
            paramsKeyMap: {
                OCTAVE: 0,				
                NOTE: 1,
            },
            class: 'iCOBOT_BUZ',
            isNotFor: ['iCOBOT'],
            func: function(sprite, script) {
                var port = 6;
                var octave = script.getNumberValue('OCTAVE') - 1;
                var duration = 7;
                var value = 0;

                var note = script.getValue('NOTE');
                if (!Entry.Utils.isNumber(note)) 
                {
                    note = Entry.iCOBOT.toneTable[note];
                }
                if (note < 0) note = 0;
                else if (note > 12) note = 12;
                
                if (!Entry.hw.sendQueue['SET']) 
                {
                    Entry.hw.sendQueue['SET'] = {};
                }
                
                if (octave < 0) octave = 0;
                else if (octave > 8) octave = 8;
                if (note != 0) value = Entry.iCOBOT.toneMap[note][octave];

                Entry.hw.sendQueue['SET'][port] = 
                {
                    type: Entry.iCOBOT.sensorTypes.TONE,
                    data: 
                    {
                        value: value,
                        duration: duration,
                    },
                    time: new Date().getTime(),
                };
            },
            syntax: { js: [], py: [] },
        },
		
		// 3. 빛 - 1) 센서 값 				
        icobot_get_cds_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,			
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: Lang.template.icobot_get_cds_value,
            statements: [],
            params: [],
            events: {},
            def: {
                type: 'icobot_get_cds_value',
            },
            paramsKeyMap: {},
            class: 'iCOBOT_ANA',
            isNotFor: ['iCOBOT'],
            func: function(sprite, script)
			{
                var port = 0;
                var CDS = Entry.hw.portData.SENSOR;
                return CDS[port];
            },
            syntax: { js: [], py: [] },
        },
		
		// 3. 소리 - 1) 센서 값 				
        icobot_get_sound_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,			
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: Lang.template.icobot_get_sound_value,
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
                type: 'icobot_get_sound_value',
            },
            paramsKeyMap: {},
            class: 'iCOBOT_ANA',
            isNotFor: ['iCOBOT'],
            func: function(sprite, script)
			{
                var port = 4;
                var SOUND = Entry.hw.portData.SENSOR;
                return SOUND[port];
            },
            syntax: { js: [], py: [] },
        },
				
         icobot_analog_temp_name: {
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
                          ['습도', '8'],
                          ['온도(섭씨)', '9'],
                      ],
                      value: '8',
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
        icobot_get_analog_temp_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,			
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: Lang.template.icobot_get_analog_temp_value,
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
                        type: 'icobot_analog_temp_name',
                    },					
                ],
                type: 'icobot_get_analog_temp_value',
            },
            paramsKeyMap: {
				PORT: 0,
            },
            class: 'iCOBOT_ANA',
            isNotFor: ['iCOBOT'],
            func: function(sprite, script) 
            {
                var port = script.getValue('PORT', script);
                var temp = Entry.hw.portData.SENSOR;
                return temp[port];                
            },
            syntax: { js: [], py: [] },
        },
		
        icobot_analog_distsensor_list: {
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
                        ['FRONT', '2'],
                        ['LEFT', '7'],
                        ['RIGHT', '5'],
                        ['B/LEFT', '1'],
                        ['B/MID', '6'],
                        ['B/RIGHT', '3'],
                    ],
                    value: '2',
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

		// 6. 거리 - 1) 센서 값		
        icobot_get_distsensor_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,			
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: Lang.template.icobot_get_distsensor_value,
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
                        type: 'icobot_analog_distsensor_list',
                    },
                ],
                type: 'icobot_get_distsensor_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'iCOBOT_ANA',
            isNotFor: ['iCOBOT'],
            func: function(sprite, script)
			{
                var port = script.getValue('PORT', script);	
                var IR = Entry.hw.portData.SENSOR;
                return IR[port];
            },
            syntax: { js: [], py: [] },
        },

		//
       icobot_analog_rgb_color_list: {
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
		icobot_digital_rgbled_onoff: 
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
                        type: 'icobot_analog_rgb_color_list',
                    },			
                    null,
                ],
                type: 'icobot_digital_rgbled_onoff',
            },
            paramsKeyMap: {
                COLOR: 0,
            },
            class: 'iCOBOT_RGB',
            isNotFor: ['iCOBOT'],
            func: function(sprite, script) 
			{	
				var port = 9;
                var color = script.getNumberValue('COLOR', script);

				var rLED, gLED, bLED;

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
                    type: Entry.iCOBOT.sensorTypes.RGBLED,
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
		icobot_digital_rgbled_off: 
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
                type: 'icobot_digital_rgbled_off',
            },
            paramsKeyMap: {
            },
            class: 'iCOBOT_RGB',
            isNotFor: ['iCOBOT'],
            func: function(sprite, script) 
			{	
				var port = 9;
				var rLED = 0, gLED = 0, bLED = 0;
							
                if (!Entry.hw.sendQueue['SET']) 
				{
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.iCOBOT.sensorTypes.RGBLED,
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
		icobot_digital_set_rgbled_value: 
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
                type: 'icobot_digital_set_rgbled_value',
            },
            paramsKeyMap: {
                VALUE0:0,
                VALUE1:1,
				VALUE2:2,
            },
            class: 'iCOBOT_RGB',
            isNotFor: ['iCOBOT'],
            func: function(sprite, script) 
			{
                var port = 9;      
                var rLED = script.getNumberValue('VALUE0', script);
                var gLED = script.getNumberValue('VALUE1', script);
                var bLED = script.getNumberValue('VALUE2', script);

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.iCOBOT.sensorTypes.RGBLED,
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

        icobot_digital_moter_port_list: {
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
                        ['양쪽', '2'],	
                        ['왼쪽', '1'],
                        ['오른쪽', '3'],						
                    ],
                    value: '2',
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

		icobot_motor_direction_list: 
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
                        ['전진', '0'],
                        ['후진', '1'],		
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

        icobot_digital_moter_angle_port_list: {
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
                        ['왼쪽', '1'],
                        ['오른쪽', '3'],						
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

		icobot_motor_angle_list: 
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
                        ['30도', '0'],
                        ['45도', '1'],	
                        ['60도', '2'],
                        ['90도', '3'],	
                        ['120도', '4'],	
                        ['135도', '5'],	
                        ['150도', '6'],	
                        ['180도', '7'],	
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

		// 15. DC 모터 - 1) 방향 바꾸기		
		icobot_digital_set_motor_direction: 
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
                        type: 'icobot_digital_moter_port_list',
                    },			
                    {
                        type: 'icobot_motor_direction_list',
                    },		
                    null,
                ],
                type: 'icobot_digital_set_motor_direction',
            },
            paramsKeyMap: {
                PORT: 0,
				DIR: 1,
			},
            class: 'iCOBOT_DC',
            isNotFor: ['iCOBOT'],
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
                    type: Entry.iCOBOT.sensorTypes.MOTOR,
                    data: 
                    {
                        mode: mode,
                        value: dir,
                    },
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },

		// 15. DC 모터 - 1) 회전하기		
		icobot_digital_set_motor_angle: 
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
                        type: 'icobot_digital_moter_angle_port_list',
                    },			
                    {
                        type: 'icobot_motor_angle_list',
                    },		
                    null,
                ],
                type: 'icobot_digital_set_motor_angle',
            },
            paramsKeyMap: {
                PORT: 0,
				DIR: 1,
			},
            class: 'iCOBOT_DC',
            isNotFor: ['iCOBOT'],
            func: function(sprite, script) 
			{
                var port = script.getNumberValue('PORT', script);
                var dir = script.getNumberValue('DIR', script);
				var mode = 4;
						
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = 
				{
                    type: Entry.iCOBOT.sensorTypes.MOTOR,
                    data: 
                    {
                        mode: mode,
                        value: dir,
                    },
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
		
		// 16. DC 모터 - 2) 모터 속도 정하기		
		icobot_digital_set_motor_speed: 
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
                        type: 'icobot_digital_moter_port_list',
                    },
                    {
                        type: 'number',
						params: ["0"],
                    },				
                    null,
                ],
                type: 'icobot_digital_set_motor_speed',
            },
            paramsKeyMap: {
                PORT: 0,
				SPEED: 1,
            },
            class: 'iCOBOT_DC',
            isNotFor: ['iCOBOT'],
            func: function(sprite, script) 
			{
                var port = script.getNumberValue('PORT', script);
                var speed = script.getNumberValue('SPEED', script);
				var mode = 2;
						
                speed = Math.min(1000, speed);
                speed = Math.max(0, speed);		                           
                
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = 
				{
                    type: Entry.iCOBOT.sensorTypes.MOTOR,
                    data: 
                    {
                        mode: mode,
                        value: speed,
                    },
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
		
		// 17. DC 모터 - 4) 모터 정지하기		
		icobot_digital_motor_stop: 
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
                        type: 'icobot_digital_moter_port_list',
                    },		
                    null,
                ],
                type: 'icobot_digital_motor_stop',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'iCOBOT_DC',
            isNotFor: ['iCOBOT'],
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
                    type: Entry.iCOBOT.sensorTypes.MOTOR,
                    data: 
                    {
                        mode: mode,
                        value: speed,
                    },
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
    };
};

module.exports = Entry.iCOBOT;
