














































'use strict';




Entry.CloverSEntry1 = {
    id: '38.1',
    name: 'CloverSEntry1',
    url: 'http://www.edu-rabbit.com',
    imageName: 'CloverSEntry1.png',
    title: {
        ko: '에듀래빗_클로버',
        en: 'Edurabbit_Clover',
    },
    setZero: function() {
        if (!Entry.hw.sendQueue.SET && !Entry.hw.sendQueue.SET_CLOVER && !Entry.hw.sendQueue.GET) {
            Entry.hw.sendQueue = {
                GET: {},
                SET: {},
                GET_CLOVER: {},
                SET_CLOVER: {},
            };
        }
        else
        {            
            var self = this;
            
            if(Entry.hw.sendQueue.SET)
            {
                var keySet = Object.keys(Entry.hw.sendQueue.SET);
                var keyInt = null;
                keySet.forEach(function(key) 
                {
                    keyInt = parseInt(key);
                    switch(keyInt)
                    {
                        case self.pinMaps.Digital_Port0 :                                  
                        case self.pinMaps.Digital_Port1 :                                  
                            Entry.hw.sendQueue.SET[key].data = 1;
                            break;
                        case self.pinMaps.Digital_Port2 :                                  
                        case self.pinMaps.Digital_Port3 :                                  
                        case self.pinMaps.Digital_Port4 :                                  
                        case self.pinMaps.Digital_Port5 :                                  
                        case self.pinMaps.Digital_Port6 :                                  
                            Entry.hw.sendQueue.SET[key].data = 0;
                            break;
                        
                        default :
                            Entry.hw.sendQueue.SET[key].data = 0xFF;
                            break;
                    }
                    Entry.hw.sendQueue.SET[key].time = new Date().getTime();
                });
            }
            
            if(Entry.hw.sendQueue.GET)
            {
                var keySet = Object.keys(Entry.hw.sendQueue.GET);
                var keyInt = null;
                keySet.forEach(function(key) 
                {
                    keyInt = parseInt(key);
                    switch(keyInt)
                    {
                        case self.sensorTypes.ULTRASONIC :
                            Entry.hw.sendQueue.GET[key].port = [self.pinMaps.Ultrasonic_TRIG, self.pinMaps.Ultrasonic_ECHO];
                            Entry.hw.sendQueue.GET[key].data = 1;
                            break;
                    }
                    Entry.hw.sendQueue.GET[key].time = new Date().getTime();
                });
            }

            if(Entry.hw.sendQueue.SET_CLOVER)
            {
                var keySet = Object.keys(Entry.hw.sendQueue.SET_CLOVER);
                var keyInt = null;
                keySet.forEach(function(key) 
                {
                    keyInt = parseInt(key);
                    if(key == 0)  
                    {
                        Entry.hw.sendQueue.SET_CLOVER[key].data = 0;
                    }
                    else if (key <= 80)  
                    {
                        Entry.hw.sendQueue.SET_CLOVER[key].data = 1;
                    }
                    else if (key <= 100)  
                    {
                        Entry.hw.sendQueue.SET_CLOVER[key].data = 0;
                    }
                    else if(key == 101)  
                    {
                        Entry.hw.sendQueue.SET_CLOVER[key].data = 0;
                    }
                    Entry.hw.sendQueue.SET_CLOVER[key].time = new Date().getTime();
                });
            }
            
            if(Entry.hw.sendQueue.GET_CLOVER)
            {
                var keySet = Object.keys(Entry.hw.sendQueue.GET_CLOVER);
                var keyInt = null;
                keySet.forEach(function(key) 
                {
                    keyInt = parseInt(key);
                    Entry.hw.sendQueue.GET_CLOVER[key].time = new Date().getTime();
                });
            }
        }
           
        Entry.hw.update();
    },
    
    
    
    
	monitorTemplate: { 
        imgPath: 'hw/CloverSEntry1.png',                        
        width: 420,
        height: 420,
        listPorts: {  
            M_SW1: { name: '스위치1', type: 'input', pos: { x: 0, y: 0 }},
            M_SW2: { name: '스위치2', type: 'input', pos: { x: 0, y: 0 }},
            M_ANALOG1: { name: '아날로그1', type: 'input', pos: { x: 0, y: 0 }},
            M_ANALOG2: { name: '아날로그2', type: 'input', pos: { x: 0, y: 0 }},
            M_ULTRASONIC: { name: '초음파센서', type: 'input', pos: { x: 0, y: 0 }},
            M_CDS: { name: '조도센서', type: 'input', pos: { x: 0, y: 0 }},
            M_TEMP: { name: '온도센서', type: 'input', pos: { x: 0, y: 0 }},
            M_C_SW1: { name: '클로버 스위치1', type: 'input', pos: { x: 0, y: 0 }},
            M_C_SW2: { name: '클로버 스위치2', type: 'input', pos: { x: 0, y: 0 }},
            M_C_SW3: { name: '클로버 스위치3', type: 'input', pos: { x: 0, y: 0 }},
            M_C_SW4: { name: '클로버 스위치4', type: 'input', pos: { x: 0, y: 0 }},
            M_C_SW5: { name: '클로버 스위치5', type: 'input', pos: { x: 0, y: 0 }},
            M_C_SW6: { name: '클로버 스위치6', type: 'input', pos: { x: 0, y: 0 }},
            M_C_SW7: { name: '클로버 스위치7', type: 'input', pos: { x: 0, y: 0 }},
            M_C_SW8: { name: '클로버 스위치8', type: 'input', pos: { x: 0, y: 0 }},
        },
        
        ports : {
            
        },
			
		
		
		
        mode: 'both',
    },
    
   
	
    
	actionType :
	{
        GET :            1,
        SET :            2,
        RESET :          3,
	},
	
	
	sensorTypes :
    {
		ALIVE :          0,               
        DIGITAL :        1,               
        ANALOG :         2,               
        PWM :            3,               
        SERVO :          4,               
        TONE :           5,               
        PULSEIN :        6,               
        ULTRASONIC :     7,               
        TIMER :          8,               
        MOTOR_L :        9,               
        MOTOR_R :        10,              
        
        CLOVER_FND :     11,              
        CLOVER_SW :      12,              
        CLOVER_LED :     13,              
        CLOVER_RGB :     14,              
        CLOVER_TEMP :    15,              
	},
    
    
    
    pinMaps : 
    {
        SW1 :             2,               
        SW2 :             7,               
        LED_G :           17,              
        LED_B :           16,              
        BUZZ :            4,               
        CDS :             7,               
                          
        Digital_Port0 :   17,              
        Digital_Port1 :   16,              
        Digital_Port2 :   3,               
        Digital_Port3 :   5,               
        Digital_Port4 :   6,               
        Digital_Port5 :   9,               
        Digital_Port6 :   10,              
        Digital_Port7 :   11,              
        Digital_Port8 :   12,              
        Digital_Port9 :   13,              
                          
        Analog_Port0 :    14,              
        Analog_Port1 :    15,              
                          
        DIR_L :           5,              
        EN_L :            6,              
        DIR_R :           9,              
        EN_R :            10,             
        
        Ultrasonic_TRIG : 13,             
        Ultrasonic_ECHO : 12,             
    },
    
    CloverMaps :
    {
        FND :             0,              
        MODULE0 :         39,             
        MODULE1 :         38,             
        MODULE2 :         37,             
        MODULE3 :         36,             
        MODULE4 :         35,             
        MODULE5 :         34,             
        MODULE6 :         33,             
        MODULE7 :         32,             
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
    
    directionTable: {
        Forward: 0,
        Backward: 1,
    },
  
    highList: ['high', '1', 'on'],
    lowList: ['low', '0', 'off'],
    BlockState: {},
};


Entry.CloverSEntry1.blockMenuBlocks = [
    
    'CloverSEntry1_set_digital',
    'CloverSEntry1_set_digital1',
    'CloverSEntry1_set_tone',
    'CloverSEntry1_set_servo',
    'CloverSEntry1_set_motor',
    'CloverSEntry1_set_rgb',
    'CloverSEntry1_set_fnd',
    'CloverSEntry1_clover_set_led',
    'CloverSEntry1_get_digital',
    'CloverSEntry1_get_digital_servo',
    'CloverSEntry1_get_analog_value',
    'CloverSEntry1_get_analog_value_map',
    'CloverSEntry1_get_ultrasonic_value',
    'CloverSEntry1_get_cds_value',
    'CloverSEntry1_get_temp_value',
    'CloverSEntry1_clover_get_sw',
];


Entry.CloverSEntry1.setLanguage = () => {
	return {
		ko: {
			template: 
            {
				CloverSEntry1_set_digital :          '%1 을 %2 %3',  
                CloverSEntry1_set_digital1 :         '%1 을 %2 %3',
                CloverSEntry1_set_tone :             '부저를  %1 %2 음으로 %3초 연주하기 %4',
                CloverSEntry1_set_servo :            '%1 번 서보모터를 %2 의 각도로 정하기 %3',
                CloverSEntry1_set_motor :            '%1 모터를 %2 으로 %3 회전 속도로 정하기 %4',
                CloverSEntry1_set_fnd :              '클로버 숫자표시기(FND)에 %1 출력하기 %2',
                CloverSEntry1_clover_set_led :       '클로버 LED %1 을 %2 %3',
                CloverSEntry1_get_digital :          '스위치 %1 번 값',
                CloverSEntry1_get_digital_servo :    '디지털 %1 번 값',
                CloverSEntry1_get_analog_value :     '아날로그 %1 번 센서값',
                CloverSEntry1_get_analog_value_map : '아날로그 %1 번 값의 범위를 %2 ~ %3 에서 %4 ~ %5 로 바꾼값',
                CloverSEntry1_get_ultrasonic_value : '초음파센서 센서값',
                CloverSEntry1_get_cds_value :        '조도센서 센서값',
                CloverSEntry1_get_temp_value :       '온도센서 센서값',
                CloverSEntry1_clover_get_sw :        '클로버 버튼 %1 번 값',
                CloverSEntry1_set_rgb :              '컬러LED를 빨강%1 초록%2 파랑%3 밝기%4로 켜기 %5',
			}
		},
		
			
            
				
			
		
        
			
            
				
			
		
        
			
            
				
			
		
	}
};

Entry.CloverSEntry1.getBlocks = function() {
    return {
        
        
        CloverSEntry1_set_digital: 
        {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: 
            [
                {
                    type: 'Dropdown',
                    options : 
                    [
                        ["녹색",    this.pinMaps.Digital_Port0],
                        ["파랑색",  this.pinMaps.Digital_Port1],
					],
                    fontSize: 12,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options :
                    [
                        ["켠다",0],
                        ["끈다",1]
					],
                    fontSize: 12,
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
            def: 
            {
                params: [
                this.pinMaps.Digital_Port0,
                0,
                null,
                ],
                type: 'CloverSEntry1_set_digital',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'setBlock',
            isNotFor: ['CloverSEntry1'],
            func: function(sprite, script)
            {
                
                
                
                var self = Entry.CloverSEntry1;
                
                var sq = Entry.hw.sendQueue;
                var port = script.getField('PORT', script);
                var value = script.getField('VALUE', script);
                
                if (!sq['SET']) { sq['SET'] = {}; }
                
                sq['SET'][port] = {
                   type: self.sensorTypes.DIGITAL,
                   data: value,
                   time: new Date().getTime(),
                };
            },
            
        },
        
        
        
        
        CloverSEntry1_set_digital1: 
        {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: 
            [
                {
                    type: 'Dropdown',
                    options : 
                    [
                        ["디지털3", this.pinMaps.Digital_Port2],
                        ["디지털5", this.pinMaps.Digital_Port3],
                        ["디지털6", this.pinMaps.Digital_Port4],
                        ["디지털9", this.pinMaps.Digital_Port5],
                        ["디지털10", this.pinMaps.Digital_Port6],
					],
                    fontSize: 12,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options :
                    [
                        ["HIGH",1],
                        ["LOW",0]
					],
                    fontSize: 12,
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
            def: 
            {
                params: [
                this.pinMaps.Digital_Port2,
                0,
                null,
                ],
                type: 'CloverSEntry1_set_digital1',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'setBlock',
            isNotFor: ['CloverSEntry1'],
            func: function(sprite, script)
            {
                
                
                
                var self = Entry.CloverSEntry1;
                
                var sq = Entry.hw.sendQueue;
                var port = script.getField('PORT', script);
                var value = script.getField('VALUE', script);
                
                if (!sq['SET']) { sq['SET'] = {}; }
                
                sq['SET'][port] = {
                   type: self.sensorTypes.DIGITAL,
                   data: value,
                   time: new Date().getTime(),
                };
            },
            
        },
         
         
         
        
        CloverSEntry1_tone_list:
        {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: 
            [
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
                    fontSize: 12,
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
            syntax: { js: [], py: [] },
        },
        
        
        
        CloverSEntry1_tone_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
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
                        type: 'CloverSEntry1_tone_list',
                    },
                ],
                type: 'CloverSEntry1_tone_value',
            },
            paramsKeyMap: {
                NOTE: 0,
            },
            func: function(sprite, script) {
                return script.getNumberValue('NOTE');
            },
            syntax: { js: [], py: [] },
        },
        
        
        
        CloverSEntry1_octave_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
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
                    ],
                    value: '3',
                    fontSize: 12,
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
            syntax: { js: [], py: [] },
        },
        
        
        
        CloverSEntry1_set_tone: {
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
                params: [
                    {
                        type: 'CloverSEntry1_tone_list',
                    },
                    {
                        type: 'CloverSEntry1_octave_list',
                    },
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'CloverSEntry1_set_tone',
            },
            paramsKeyMap: {
                NOTE: 0,
                OCTAVE: 1,
                DURATION: 2,
            },
            class: 'setBlock',
            isNotFor: ['CloverSEntry1'],
            func: function(sprite, script) {
                
                
                
                var self = Entry.CloverSEntry1;
                
                var sq = Entry.hw.sendQueue;
                var port = self.pinMaps.BUZZ;
                
                if (!script.isStart)
                {
                    var note = script.getValue('NOTE', script);
                    if (!Entry.Utils.isNumber(note)) note = Entry.CloverSEntry1.toneTable[note];

                    if (note < 0) {
                        note = 0;
                    } else if (note > 12) {
                        note = 12;
                    }

                    var duration = script.getNumberValue('DURATION', script);

                    if (duration < 0) {
                        duration = 0;
                    }
                    
                    if (!sq['SET']) {
                        sq['SET'] = {};
                    }

                    if (duration === 0) {
                        sq['SET'][port] = {
                            type: Entry.CloverSEntry1.sensorTypes.TONE,
                            data: 0,
                            time: new Date().getTime(),
                        };
                        return script.callReturn();
                    }

                    var octave = script.getNumberValue('OCTAVE', script) - 1;
                    if (octave < 0) {
                        octave = 0;
                    } else if (octave > 5) {
                        octave = 5;
                    }

                    var value = 0;

                    if (note != 0) {
                        value = Entry.CloverSEntry1.toneMap[note][octave];
                    }

                    duration = duration * 1000;
                    script.isStart = true;
                    script.timeFlag = 1;

                    sq['SET'][port] = {
                        type: Entry.CloverSEntry1.sensorTypes.TONE,
                        data: {
                            value: value,
                            duration: duration,
                        },
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
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
                    sq['SET'][port] = {
                        type: Entry.CloverSEntry1.sensorTypes.TONE,
                        data: 0,
                        time: new Date().getTime(),
                    };
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
                return null;
            },
            syntax: { js: [], py: [] },
        },
        
        
        
        
        CloverSEntry1_set_servo: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options : 
                    [
                        ['1', this.pinMaps.Digital_Port2],
                        ['2', this.pinMaps.Digital_Port3],
                        ['3', this.pinMaps.Digital_Port4],
                        ['4', this.pinMaps.Digital_Port5],
                        ['5', this.pinMaps.Digital_Port6],
					],
                    fontSize: 12,
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
                    this.pinMaps.Digital_Port2,
                    90,
                    null,
                ],
                type: 'CloverSEntry1_set_servo',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'setBlock',
            isNotFor: ['CloverSEntry1'],
            func: function(sprite, script) {
                
                
                
              
                var self = Entry.CloverSEntry1;
                
                var sq = Entry.hw.sendQueue;
                var port = script.getField('PORT', script);
                var value = script.getNumberValue('VALUE', script);
                
                if(value < 0) value = 0;
                else if (value > 180) value = 180;

                if (!sq['SET']) {
                    sq['SET'] = {};
                }
                sq['SET'][port] = {
                    type: self.sensorTypes.SERVO,
                    data: value,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        
        
        
        
        CloverSEntry1_set_motor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options : 
                    [
                        ['왼쪽', 0],
                        ['오른쪽', 1],
					],
                    fontSize: 12,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options : 
                    [
                        ['앞', 0],
                        ['뒤', 1],
					],
                    fontSize: 12,
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
                    0,
                    0,
                    {
                        type: 'number',
                        params: ['200'],
                    },
                    null,
                ],
                type: 'CloverSEntry1_set_motor',
            },
            paramsKeyMap: {
                MOTOR_ANGLE: 0,
                MOTOR_DIRECTION: 1,
                MOTOR_SPEED: 2,
            },
            class: 'setBlock',
            isNotFor: ['CloverSEntry1'],
            func: function(sprite, script) {
                
                var angle = script.getField('MOTOR_ANGLE', script);
                var direction = script.getField('MOTOR_DIRECTION', script);
                var speed = script.getNumberValue('MOTOR_SPEED', script) - 1;
                
                
                if (speed < 0) 
                {
                    speed = 0;
                }
                else if (speed > 254) 
                {
                    speed = 254;
                }
                
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                
                if(angle == 0)
                {
                    Entry.hw.sendQueue['SET'][0] = 
                    {
                        type: Entry.CloverSEntry1.sensorTypes.MOTOR_L,
                        data: {
                            direction: direction,
                            speed: speed,
                        },
                        time: new Date().getTime(),
                    };
                }
                else
                {
                    Entry.hw.sendQueue['SET'][1] = 
                    {
                        type: Entry.CloverSEntry1.sensorTypes.MOTOR_R,
                        data: {
                            direction: direction,
                            speed: speed,
                        },
                        time: new Date().getTime(),
                    };
                }
                

                setTimeout(function() {
                    script.timeFlag = 0;
                }, 10);

                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        
        
        
        
        CloverSEntry1_set_fnd: 
        {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: 
            [
                {
                    type: 'Block',
                    accept: 'string',
                    
                    fontSize: 12,
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
            def: 
            {
                params: [
                0,
                null,
                ],
                type: 'CloverSEntry1_set_fnd',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'setBlock',
            isNotFor: ['CloverSEntry1'],
            func: function(sprite, script)
            {
                
                
                
                var self = Entry.CloverSEntry1;
                
                var sq = Entry.hw.sendQueue;
                var port = 0; 
                var value = script.getNumberValue('VALUE', script);
                
                if (!sq['SET_CLOVER']) { sq['SET_CLOVER'] = {}; }
                
                sq['SET_CLOVER'][port] = {
                   type: self.sensorTypes.CLOVER_FND,
                   data: value,
                   time: new Date().getTime(),
                };
            },
            
        },
        
        
        
        
        CloverSEntry1_set_rgb: 
        {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: 
            [
                {
                    type: 'Block',
                    accept: 'string',
                    
                    fontSize: 12,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    
                    fontSize: 12,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    
                    fontSize: 12,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    
                    fontSize: 12,
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
            def: 
            {
                params: [
                100,
                100,
                100,
                10,
                null,
                ],
                type: 'CloverSEntry1_set_rgb',
            },
            paramsKeyMap: {
                COLOR_R: 0,
                COLOR_G: 1,
                COLOR_B: 2,
                COLOR_W: 3,
            },
            class: 'setBlock',
            isNotFor: ['CloverSEntry1'],
            func: function(sprite, script)
            {
                
                
                
                var self = Entry.CloverSEntry1;
                var color_r = script.getNumberValue('COLOR_R', script);
                var color_g = script.getNumberValue('COLOR_G', script);
                var color_b = script.getNumberValue('COLOR_B', script);
                var color_w = script.getNumberValue('COLOR_W', script);
                var sq = Entry.hw.sendQueue;
                var port = 101;  
                var value;
                
                
                if(isNaN(color_r)) { color_r = 0; }
                if(isNaN(color_g)) { color_g = 0; }
                if(isNaN(color_b)) { color_b = 0; }
                if(isNaN(color_w)) { color_w = 0; }
                
                if(color_r < 0) { color_r = 0; }; if(color_r > 255) { color_r = 255; }
                if(color_g < 0) { color_g = 0; }; if(color_g > 255) { color_g = 255; }
                if(color_b < 0) { color_b = 0; }; if(color_b > 255) { color_b = 255; }
                if(color_w < 0) { color_w = 0; }; if(color_w > 255) { color_w = 255; }
                
                
                value = 0;  
                value = (color_r << 24) | (color_g << 16) | (color_b << 8) | (color_w << 0);
                
                if (!sq['SET_CLOVER']) { sq['SET_CLOVER'] = {}; }
                
                sq['SET_CLOVER'][port] = {
                  type: self.sensorTypes.CLOVER_RGB,
                  data: value,
                  time: new Date().getTime(),
                };
                
            },
            
        },
        
        
        
        
        CloverSEntry1_get_digital: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            params: [
                {
                    type: 'Dropdown',
                    options : 
                    [
                        ['1', this.pinMaps.SW1],
                        ['2', this.pinMaps.SW2],
					],
                    fontSize: 12,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    this.pinMaps.SW1,
                ],
                type: 'CloverSEntry1_get_digital',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'getBlock',
            isNotFor: ['CloverSEntry1'],
            func: function(sprite, script) {
                var port = script.getField('PORT', script);
                var DIGITAL = Entry.hw.portData.DIGITAL;
                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                Entry.hw.sendQueue['GET'][Entry.CloverSEntry1.sensorTypes.DIGITAL] = {
                    port: port,
                    time: new Date().getTime(),
                };
                
                if( DIGITAL[port] == 0) { return true; }
                else { return false;}
            },
            syntax: { js: [], py: [] },
        },
        
        
        
        
        
        CloverSEntry1_get_digital_servo: 
        {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            params: [
                {
                    type: 'Dropdown',
                    options : 
                    [
                        ["3", 3],
                        ["5", 5],
                        ["6", 6],
                        ["9", 9],
                        ["10", 10],
					],
                    fontSize: 12,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    3,
                ],
                type: 'CloverSEntry1_get_digital_servo',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'getBlock',
            isNotFor: ['CloverSEntry1'],
            func: function(sprite, script) {
                var port = script.getField('PORT', script);
                var DIGITAL = Entry.hw.portData.DIGITAL;
                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                
                Entry.hw.sendQueue['GET'][Entry.CloverSEntry1.sensorTypes.DIGITAL] = {
                    port: port,
                    time: new Date().getTime(),
                };
                
                if( DIGITAL[port] != 0) { return true; }
                else { return false;}
            },
            syntax: { js: [], py: [] },
        },
        
        
        
        
        CloverSEntry1_get_analog_value: 
        {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options : 
                    [
                        ["1", 0],
                        ["2", 1],
					],
                    value : 0,
                    fontSize: 12,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [ null ],
                type: 'CloverSEntry1_get_analog_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'getBlock',
            isNotFor: ['CloverSEntry1'],
            func: function(sprite, script) {
                var port = script.getField('PORT', script);
                var ANALOG = Entry.hw.portData.ANALOG;

                return ANALOG[port];
            },
            syntax: { js: [], py: [] },
        },
            
            

        
        CloverSEntry1_get_analog_value_map:
        {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options : 
                    [
                        ["1", 0],
                        ["2", 1],
					],
                    fontSize: 12,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                    
                },
                {
                    type: 'Block',
                    accept: 'number',
                },
                {
                    type: 'Block',
                    accept: 'number',
                },
                {
                    type: 'Block',
                    accept: 'number',
                },
                {
                    type: 'Block',
                    accept: 'number',
                },
            ],
            events: {},
            def: {
                params: [
                    0,
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
                type: 'CloverSEntry1_get_analog_value_map',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE2: 1,
                VALUE3: 2,
                VALUE4: 3,
                VALUE5: 4,
            },
            class: 'getBlock',
            isNotFor: ['CloverSEntry1'],
            func: function(sprite, script) {
                var port = script.getField('PORT', script);
                var ANALOG = Entry.hw.portData.ANALOG;
                var value2 = script.getNumberValue('VALUE2', script);
                var value3 = script.getNumberValue('VALUE3', script);
                var value4 = script.getNumberValue('VALUE4', script);
                var value5 = script.getNumberValue('VALUE5', script);
                var org_value;      
                var org_percent;    
                var org_range;      
                var dest_range;     
                var dest_value;     
                var swap = 0;
                
                
                if(value2 > value3)
                {
                    swap = value2;
                    value2 = value3;
                    value3 = swap;
                }
                if (value4 > value5) 
                {
                    swap = value4;
                    value4 = value5;
                    value5 = swap;
                }
                
                
                org_value = ANALOG[port] - value2;
                org_range = value3 - value2;
                
                dest_range = value5 - value4;
                
                
                if(org_range <= 0) { return 0; }
                if(dest_range <= 0) { return 0; }
                if(org_value <= 0) {return 0; }
                
                
                org_percent = (org_value / org_range) * 100;
                dest_value = value4 + (dest_range * (org_percent / 100));
                
                
                if(dest_value < value4) { dest_value = value4; }
                if(dest_value > value5) { dest_value = value5; }
                
                return dest_value;
            },
            syntax: { js: [], py: [] },
        },
        
        
        
        
        CloverSEntry1_get_ultrasonic_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
            ],
            events: {},
            def: {
                params: [
                ],
                type: 'CloverSEntry1_get_ultrasonic_value',
            },
            paramsKeyMap: {
            },
            class: 'getBlock',
            isNotFor: ['CloverSEntry1'],
            func: function(sprite, script) {
                var port1 = Entry.CloverSEntry1.pinMaps.Ultrasonic_TRIG;
                var port2 = Entry.CloverSEntry1.pinMaps.Ultrasonic_ECHO;

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                delete Entry.hw.sendQueue['SET'][port1];
                delete Entry.hw.sendQueue['SET'][port2];

                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                Entry.hw.sendQueue['GET'][Entry.CloverSEntry1.sensorTypes.ULTRASONIC] = {
                    port: [port1, port2],
                    data : 0,
                    time: new Date().getTime(),
                };
                
                return Entry.hw.portData.ULTRASONIC;
            },
            syntax: { js: [], py: [] },
        },
        
        
        
        
        CloverSEntry1_get_cds_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
            ],
            events: {},
            def: {
                params: [
                ],
                type: 'CloverSEntry1_get_cds_value',
            },
            paramsKeyMap: {
            },
            class: 'getBlock',
            isNotFor: ['CloverSEntry1'],
            func: function(sprite, script) {
                
                
                
                var self = Entry.CloverSEntry1;
                
                var port = self.pinMaps.CDS;
                var ANALOG = Entry.hw.portData.ANALOG;
                
                return ANALOG[port];
            },
            syntax: { js: [], py: [] },
        },
        
        
        
        
        CloverSEntry1_get_temp_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
            ],
            events: {},
            def: {
                params: [
                ],
                type: 'CloverSEntry1_get_temp_value',
            },
            paramsKeyMap: {
            },
            class: 'getBlock',
            isNotFor: ['CloverSEntry1'],
            func: function(sprite, script) {
                
                
                
                var self = Entry.CloverSEntry1;
                
                var port = self.pinMaps.CDS;
                var temp = Entry.hw.portData.TEMP;
                
                return temp;
            },
            syntax: { js: [], py: [] },
        },

        
        
        
        CloverSEntry1_clover_set_led: 
        {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: 
            [
                {
                    type: 'Dropdown',
                    options : 
                    [
                        ["1",  1],
                        ["2",  2],
                        ["3",  3],
                        ["4",  4],
                        ["5",  5],
                        ["6",  6],
                        ["7",  7],
                        ["8",  8],
					],
                    fontSize: 12,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options :
                    [
                        ["켠다",0],
                        ["끈다",1]
					],
                    fontSize: 12,
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
            def: 
            {
                params: [
                1,
                0,
                null,
                ],
                type: 'CloverSEntry1_clover_set_led',
            },
            paramsKeyMap: {
                NUM : 0,
                VALUE: 1,
            },
            class: 'setBlock',
            isNotFor: ['CloverSEntry1'],
            func: function(sprite, script)
            {
                
                
                
                var self = Entry.CloverSEntry1;
                
                var sq = Entry.hw.sendQueue;
                var port;
                var id = self.CloverMaps.MODULE1; 
                var num = script.getField('NUM', script);
                var value = script.getField('VALUE', script);
                
                switch (id)
                {
                    case self.CloverMaps.MODULE0 :
                        port = (0*10) + num;
                        break;
                        
                    case self.CloverMaps.MODULE1 :
                        port = (1*10) + num;
                        break;
                        
                    case self.CloverMaps.MODULE2 :
                        port = (2*10) + num;
                        break;
                        
                    case self.CloverMaps.MODULE3 :
                        port = (3*10) + num;
                        break;
                        
                    case self.CloverMaps.MODULE4 :
                        port = (4*10) + num;
                        break;
                        
                    case self.CloverMaps.MODULE5 :
                        port = (5*10) + num;
                        break;
                        
                    case self.CloverMaps.MODULE6 :
                        port = (6*10) + num;
                        break;
                        
                    case self.CloverMaps.MODULE7 :
                        port = (7*10) + num;
                        break;
                }
                
                if (!sq['SET_CLOVER']) { sq['SET_CLOVER'] = {}; }
                
                sq['SET_CLOVER'][port] = {
                   type: self.sensorTypes.CLOVER_LED,
                   data: value,
                   num :  num - 1,
                   time: new Date().getTime(),
                };
            },
            
        },
        
        
        
        
        CloverSEntry1_clover_get_sw: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            params: [
                {
                    type: 'Dropdown',
                    options : 
                    [
                        ["1",  1],
                        ["2",  2],
                        ["3",  3],
                        ["4",  4],
                        ["5",  5],
                        ["6",  6],
                        ["7",  7],
                        ["8",  8],
					],
                    fontSize: 12,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    1,
                ],
                type: 'CloverSEntry1_clover_get_sw',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'getBlock',
            isNotFor: ['CloverSEntry1'],
            func: function(sprite, script) {
                
                
                
                
                var self = Entry.CloverSEntry1;
                
                var port = self.CloverMaps.MODULE0;
                var num = script.getField('PORT', script) - 1;
                var id = self.CloverMaps.MODULE0 - port + 1;
                var CLOVER = Entry.hw.portData.CLOVER;
                var value;
                                
                if (!Entry.hw.sendQueue['GET_CLOVER']) {
                    Entry.hw.sendQueue['GET_CLOVER'] = {};
                }
                Entry.hw.sendQueue['GET_CLOVER'][Entry.CloverSEntry1.sensorTypes.CLOVER_SW] = {
                    port: port,
                    data: 0,
                    time: new Date().getTime(),
                };
                
                value = (CLOVER[id] & (0x01 << num)) >> num;
                
                if(value == 1) { return true; }
                else { return false; }
            },
            syntax: { js: [], py: [] },
        },
        
        
        
    };
};

module.exports = Entry.CloverSEntry1;


