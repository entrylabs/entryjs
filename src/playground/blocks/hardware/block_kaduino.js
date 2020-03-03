'use strict';

Entry.kaduino = 
{
	id: '3A.1',	
    name: 'kaduino',
    url: 'http://www.kairobot.co.kr/',
    imageName: 'kaduino.png',
    title: 
	{
        "ko": "카두이노", 
        "en": "kaduino"
    },

    setZero: function() {    ///  하드웨어 초기화 로직
        if (!Entry.hw.sendQueue.SET) {
            Entry.hw.sendQueue = {
                GET: {},
                SET: {},
            };
        } 
		else 
		{
            var keySet = Object.keys(Entry.hw.sendQueue.SET);
            keySet.forEach(function(key) {
                Entry.hw.sendQueue.SET[key].data = 0;
                Entry.hw.sendQueue.SET[key].time = new Date().getTime();
            });   
        }
        Entry.hw.update();
        lmotor_speed = 0;
        rmotor_speed = 0;
        var rgbled_0 = [];
        rgbled_r = rgbled_0;
        rgbled_g = rgbled_0;
        rgbled_b = rgbled_0;
    },
	
    Static: {
//        kaduino_BLOCK_COLOR: '#00979D', // gray(#848484)
//        kaduino_ARROW_COLOR_HW: '#00979D',

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
        RGBLED: 11,
        MOTOR: 12,
        RGBLEDSHOW: 13,
        PWM: 32,
        USONIC_SET: 33,
        I2C_SET: 34,
        LCD_SET: 40,
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
    BlockState: {},	
};

Entry.kaduino.blockMenuBlocks = [    /// 하드웨어 블록 등록 , 여기에 등록된 블록이 순서대로 나열되며 설정한 이름으로 화면에 보임
        'kaduino_buzzer_onoff',			            // 스피커 삐 소리
        'kaduino_set_digital_buzzer',               // 스피커 멜로디
        'kaduino_set_motor_speed',                  // DC모터 속도제어
        'kaduino_motor_stop',            // DC모터 정지하기	
        'kaduino_set_servo',                        // 서보모터 제어

        'kaduino_set_rgbled_onoff',                // rgb led로 지정색 제어
        'kaduino_rgbled_seting',                // rgb led 핀번호 설정
        'kaduino_set_rgbled_value',                //rgb led 개별색 제어
        'kaduino_rgbled_all_onoff',                // rgb led all show, all off

        'kaduino_digital_onoff',                   /// 디지털 포트 제어
        'kaduino_get_digital_value',	            //디지탈 입력
        'kaduino_get_analog_value',                 // 아날로그 입력
        'kaduino_set_pwm',                          //PWM제어

        'kaduino_set_ultrasonic',                   //초음파센서 포트설정
        'kaduino_get_usonic_value',              //초음파센서 읽기
        'kaduino_set_temp',                  //온도센서 연결포트 설정
        'kaduino_get_temp_value',                   // 온도센서 입력
        'kaduino_set_i2c',                   //I2C포트 센서연결설정
        'kaduino_get_color_value',                  // 컬러센서 입력
        'kaduino_get_gyro_value',                   // 자이로센서 입력
       
        'kaduino_set_lcd_string',
        'kaduino_set_lcd_init',
        'kaduino_set_lcd_clear',

		'kaduino_get_analog_mapping',

		
];

Entry.kaduino.setLanguage = function() {    // 블록 이름  번역
    return {
        ko: {
            template: {
                "kaduino_buzzer_onoff": "스피커 삐 소리 %1 초 연주하기 %2",				
                "kaduino_set_digital_buzzer": "스피커음계 %1 옥타브 %2 음 %3 초 연주하기 %4",	
                "kaduino_set_motor_speed": "DC모터 왼쪽 속도%1 오른쪽 속도%2 으로 정하기 %3", 
                "kaduino_motor_stop": "DC모터 정지하기 %1",	
                "kaduino_set_servo": "서보모터 %1핀 각도 %2 이동 %3",		

                "kaduino_set_rgbled_onoff": "RGB LED %1 번째 색깔 %2 하기 %3",	
                "kaduino_rgbled_seting": "RGB LED %1핀에 %2개  밝기%3 설정하기 %4",   
                "kaduino_set_rgbled_value": "RGB LED %1번째  빨강%2 초록%3 파랑%4 으로 하기 %5",
                "kaduino_rgbled_all_onoff": "RGB LED  %1 %2",

                "kaduino_digital_onoff": "디지털 %1 핀 %2 설정하기 %3",         
                "kaduino_get_digital_value": "디지털 %1 핀 읽기",				
                "kaduino_get_analog_value": "아날로그 %1 핀 읽기",
                "kaduino_set_pwm": "PWM %1 핀에 %2 보내기 %3",	

                "kaduino_set_ultrasonic": "초음파센서 설정 트리거 %1 핀, 에코 %2 핀 으로 연결하기 %3",	
                "kaduino_get_usonic_value": "초음파센서 값 읽기",	
                "kaduino_set_temp": "온도센서 %1 핀에 연결하기 %2",	
                "kaduino_get_temp_value": "온도센서 값 읽기",	
                "kaduino_set_i2c": "I2C포트  %1 연결하기 %2",	
                "kaduino_get_color_value": "컬러센서 %1 값 읽기",
                "kaduino_get_gyro_value": "자이로센서 %1 값 읽기",

                "kaduino_set_lcd_string": "lcd 세로%1줄,  가로%2줄 에  %3 표시하기 %4",
                "kaduino_set_lcd_init": "lcd 설정 : I2C 주소 0x%1 , 가로줄 수 %2 , 세로줄 수 %3 으로 정하기%4",
                "kaduino_set_lcd_clear": "lcd 지우기 %1",


				"kaduino_get_analog_mapping": " %1 값 %2 ~ %3 에서 %4 ~ %5 으로 변환값", 
				
            },
            Blocks: {
                On_block: "켜짐(HIGH, 5V)",
                Off_block: "꺼짐(LOW, 0V)",
                AllOn_block: "모두 켜짐",
                AllOff_block: "모두 꺼짐",
                RGB_red: "빨강색",
                RGB_blue: "파란색",
                RGB_green: "초록색",
                RGB_white: "하얀색",
                RGB_skyblue: "하늘색",
                RGB_yellow: "노란색",
                RGB_purple: "보라색",
                RGB_off: "끄기",
            }
        },
        en: {
            template: {
                "kaduino_buzzer_onoff": "Speakers Beep %1 Playing Second %2",				
                "kaduino_set_digital_buzzer": "Speakers  %1 Octave %2 Play %3 seconds %4",	
                "kaduino_set_motor_speed": "Set DC motor left speed %1  right speed %2 %3", 	
                "kaduino_motor_stop": "Stop DC Motor %1",	
                "kaduino_set_servo": "Servo motor %1 pin angle %2 movement %3",		

                "kaduino_set_rgbled_onoff": "RGB LED %1 First Color %2 %3",		
                "kaduino_rgbled_seting": "Setting %2 brightness %3 on RGB LED %1 pin %4",
                "kaduino_set_rgbled_value": "RGB LED %1 st Red %2 Green %3 Blue %4",
                "kaduino_rgbled_all_onoff": "RGB LED %1 %2",		

                "kaduino_digital_onoff": "Setting up digital %1 pin %2 %3",	
                "kaduino_get_digital_value": "Read digital %1 pins",				
                "kaduino_get_analog_value": "Analog %1 pin read",
                "kaduino_set_pwm": "Send %2 to pin %1 %3",		

                "kaduino_set_ultrasonic": "Connecting to the ultrasonic sensor setting trigger %1 pin, echo %2 pin %3",		
                "kaduino_get_usonic_value": "Reading ultrasonic sensor values",		
                "kaduino_set_temp": "Connecting to the temperature sensor %1 pin %2",		
                "kaduino_get_temp_value": "Reading temperature sensor values",		
                "kaduino_set_i2c": "Connect I2Cport %1 %2",		
                "kaduino_get_color_value": "Reading the color sensor %1 value",
				"kaduino_get_gyro_value": "Read gyro sensor %1 value",
                
                "kaduino_set_lcd_string": "lcd Display %3 on line %1 and line %2 %4",		
                "kaduino_set_lcd_init": "setting lcd : I2C address 0x%1 , horizontal line number %2 , vertical line number %3 %4",	
                "kaduino_set_lcd_clear": "Clear lcd %1",		

				
                "kaduino_get_analog_mapping": "%1 value %2 to %3 ; to %4 to %5 conversion value ",	
								
            },
            Blocks: {
                On_block: "On(HIGH, 5V)",
                Off_block: "Off(LOW, 0V)",
                AllOn_block: "ALL ON",
                AllOff_block: "ALL OFF",
                RGB_red: "Red",
                RGB_blue: "Blue",
                RGB_green: "Green",
                RGB_white: "White",
                RGB_skyblue: "Sky blue",
                RGB_yellow: "Yellow",
                RGB_purple: "Purple",
                RGB_off: "Off",
            }
        }
    }
};
var delay_time = 0;
var lmotor_speed = 0;
var rmotor_speed = 0;
var rgbled_r = [];
var rgbled_g = [];
var rgbled_b = [];

Entry.kaduino.getBlocks = function() {
    return {
        kaduino_digital_port_onoff_list: {
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
                        [Lang.Blocks.On_block, '1'],
                        [Lang.Blocks.Off_block, '0'],
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
        
        kaduino_list_digital_octave: {
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
		
        kaduino_list_digital_tone: {
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
        kaduino_digital_port_list: {
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
                        ['D2', '2'],
                        ['D8', '8'],
                        ['D9', '9'],
                        ['D10', '10'],
                        ['D11', '11'],
                        ['D12', '12'],
                        ['D13', '13'],
                        ['A0', '14'],
                        ['A1', '15'],
                        ['A2', '16'],
                        ['A3', '17'],
                        ['A4', '18'],
                        ['A5', '19'],
                    ],
                    value: '8',       // 기본 표시값
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

		kaduino_pwn_port_list: 
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
                        ['9', '9'],
                        ['10', '10'],
                        ['11', '11'],
                    ],
                    value: '9',
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
                PWMPORT: 0,
            },
            func: function(sprite, script) {
                return script.getStringField('PWMPORT');
            },
        },
        kaduino_lcd_add_list: 
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
                        ['27', '39'],
                        ['3f', '63'],
                    ],
                    value: '39',
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
                LCDADD: 0,
            },
            func: function(sprite, script) {
                return script.getStringField('LCDADD');
            },
        },
        kaduino_i2c_sen_list: 
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
                        ['Color Sensor', '1'],
                        ['Gyro Sensor', '2'],
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
                SENSOR: 0,
            },
            func: function(sprite, script) {
                return script.getStringField('SENSOR');
            },
        },

        kaduino_all_onoff_list: {
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
                        [Lang.Blocks.AllOff_block, '2'],
                        [Lang.Blocks.AllOn_block, '3'],
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
                VALUE: 0,
            },
            func: function(sprite, script) {
                return script.getField('VALUE');
            },
        },
        kaduino_analog_port_list: {
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
                        ['A0', '0'],
                        ['A1', '1'],
                        ['A2', '2'],
                        ['A3', '3'],
                        ['A4', '4'],
                        ['A5', '5'],
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

        
		kaduino_ultrasonic_port_list: {
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
                        ['10', '10'],
                        ['11', '11'],
                        ['12', '12'],
                        ['13', '13'],
                    ],
                    value: '10',
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

        kaduino_analog_rgb_color_list: {
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
                        [Lang.Blocks.RGB_red, '0'],
                        [Lang.Blocks.RGB_blue, '1'],
                        [Lang.Blocks.RGB_green, '2'],
                        [Lang.Blocks.RGB_white, '3'],
                        [Lang.Blocks.RGB_skyblue, '4'],
                        [Lang.Blocks.RGB_yellow, '5'],
                        [Lang.Blocks.RGB_purple, '6'],
                        [Lang.Blocks.RGB_off, '7'],						
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







		// 1. 삐소리
		kaduino_buzzer_onoff: {
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
                    null,
                ],
                type: 'kaduino_buzzer_onoff',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'kaduino_LV1',
            isNotFor: ['kaduino'],
            func: function(sprite, script) 
			{
                var port = 10;
                var duration = script.getNumberValue('VALUE');	// 길이	
                var octave = 5;    // 옥타브
                var value = 2400;//698;   // 음 주파수
                var mode = 1;
                
                if (!script.isStart) 
				{
                    if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                    }
                    if (duration == 0) // 음 길이가 0 이면
					{
                        Entry.hw.sendQueue['SET'][port] = 
						{
                            type: Entry.kaduino.sensorTypes.TONE,
                            data: 0,
                            time: new Date().getTime(),
                        };
                        return script.callReturn();
                    }
                    if(duration > 300)
                        duration = 300;
                    duration = duration * 1000;
                    script.isStart = true;  // 출력 시작 플래그 셋
                    script.timeFlag = 1;    // 시간플래그 셋

                    Entry.hw.sendQueue['SET'][port] = 
					{
                        type: Entry.kaduino.sensorTypes.TONE,
                        data: 
						{
                            value: value,
                            duration: duration/10,
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
				else    // 설정 시간이 지나면 출력 리셋
				{
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.hw.sendQueue['SET'][port] = 
					{
                        type: Entry.kaduino.sensorTypes.TONE,
                        data: 0,
                        time: new Date().getTime(),
                    };
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            				
            },
            syntax: { js: [], py: [] },
        },
		
		// 2) 옥타브/음/초 동안 연주
        kaduino_set_digital_buzzer: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,			
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.kaduino_set_digital_buzzer,
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
                        type: 'kaduino_list_digital_octave',						
                    },
                    {
                        type: 'kaduino_list_digital_tone',
                    },
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'kaduino_set_digital_buzzer',
            },
            paramsKeyMap: {
                OCTAVE: 0,				
                NOTE: 1,
                DURATION: 2,
            },
            class: 'kaduino_LV1',
            isNotFor: ['kaduino'],
            func: function(sprite, script) {
                var port = 10; //script.getNumberValue('PORT');
                var duration = script.getNumberValue('DURATION');
                var octave = script.getNumberValue('OCTAVE') - 1;
                var value = 0;

                if (!script.isStart) 
				{
                    var note = script.getValue('NOTE');
                    if (!Entry.Utils.isNumber(note)) 
					{
                        note = Entry.kaduino.toneTable[note];
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
                            type: Entry.kaduino.sensorTypes.TONE,
                            data: 0,
                            time: new Date().getTime(),
                        };
                        return script.callReturn();
                    }
					
                    if (octave < 0) octave = 0;
                    else if (octave > 8) octave = 8;
                    if (note != 0) value = Entry.kaduino.toneMap[note][octave];
                    if(duration > 300)
                        duration = 300;
                    duration = duration * 1000;
                    script.isStart = true;
                    script.timeFlag = 1;

                    Entry.hw.sendQueue['SET'][port] = 
					{
                        type: Entry.kaduino.sensorTypes.TONE,
                        data: 
						{
                            value: value,
                            duration: duration/10,
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
                        type: Entry.kaduino.sensorTypes.TONE,
                        data: 0,
                        time: new Date().getTime(),
                    };
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: [] },
        },
        
        // 3. DC 모터 속도 정하기		
		kaduino_set_motor_speed: 
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
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
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
                    null,
                ],
                type: 'kaduino_set_motor_speed',
            },
            paramsKeyMap: {
                LSPEED: 0,
				RSPEED: 1,
            },
            class: 'kaduino_LV1',
            isNotFor: ['kaduino'],
            func: function(sprite, script) 
			{
                var lspeed = script.getNumberValue('LSPEED', script);
                var rspeed = script.getNumberValue('RSPEED', script);
                var port = 3;
                		
                lspeed = Math.min(100, lspeed);
                lspeed = Math.max(-100, lspeed);		
                rspeed = Math.min(100, rspeed);
                rspeed = Math.max(-100, rspeed);		
                
                if(!(lmotor_speed == lspeed) || !(rmotor_speed == rspeed))
                {
                    if (!script.isStart) 
                    {
                        if (!Entry.hw.sendQueue['SET']) {
                            Entry.hw.sendQueue['SET'] = {};
                        }
                        Entry.hw.sendQueue['SET'][port] = 
                        {
                            type: Entry.kaduino.sensorTypes.MOTOR,
                            data: [lspeed, rspeed],
                            time: new Date().getTime(),
                        };
                        lmotor_speed = lspeed;
                        rmotor_speed = rspeed;
                        script.isStart = true;  // 출력 시작 플래그 셋
                        script.timeFlag = 1;    // 시간플래그 셋
                        setTimeout(function() 
                        {
                            script.timeFlag = 0;
                        }, delay_time );
                        return script;
                    }
                    else if (script.timeFlag == 1) 
                    {
                        return script;
                    } 
                    else    // 설정 시간이 지나면 출력 리셋
                    {
                        delete script.timeFlag;
                        delete script.isStart;
                        Entry.engine.isContinue = false;
                        return script.callReturn();
                    }
                }
                else
                    return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
		
		// 4. DC 모터 정지하기		
		kaduino_motor_stop: 
		{
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,		
			fontColor: '#fff',			
            skeleton: 'basic',
            statements: [],
            params: [
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
                ],
                type: 'kaduino_motor_stop',
            },
            paramsKeyMap: {
                //PORT: 0,
            },
            class: 'kaduino_LV1',
            isNotFor: ['kaduino'],
            func: function(sprite, script) 
			{
                var port = 19;//script.getNumberValue('PORT', script);
				//port += 2;
				var lspeed = 0;
                var rspeed = 0;
                
                if(!(lmotor_speed == 0) || !(rmotor_speed == 0))
                {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
                    Entry.hw.sendQueue['SET'][port] = 
                    {
                        type: Entry.kaduino.sensorTypes.MOTOR,
                        data: [lspeed, rspeed],
                        time: new Date().getTime(),
                    };
                }

                lmotor_speed = 0;
                rmotor_speed = 0;
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },

        // 5.  서보 모터 각도 설정하기		
		kaduino_set_servo: 
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
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'kaduino_digital_port_list',
                    },
                    {
                        type: 'number',
						params: ["0"],
                    },				
                    null,
                ],
                type: 'kaduino_set_servo',
            },
            paramsKeyMap: 
			{
				PORT: 0,
                ANGLE: 1,
            },
            class: 'kaduino_LV1',
            isNotFor: ['kaduino'],
            func: function(sprite, script) 
			{
                var port = script.getNumberValue('PORT', script);
                var angle = script.getNumberValue('ANGLE', script);
//				port += 2;
//				var mode = 1;
				
                angle = Math.min(180, angle);
                angle = Math.max(0, angle);
                angle += 1;
				
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = 
				{
                    type: Entry.kaduino.sensorTypes.SERVO,
                    data: angle,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },


        // 6. RGBLED  색상 설정 및 show
		kaduino_set_rgbled_onoff: 
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
                        type: 'kaduino_analog_rgb_color_list',
                    },
                    null,
                ],
                type: 'kaduino_set_rgbled_onoff',
            },
            paramsKeyMap: {
                LEDNUM: 0,
                COLOR: 1,
            },
            class: 'kaduino_LV2',
            isNotFor: ['kaduino'],
            func: function(sprite, script) 
			{	
				var port = script.getNumberValue('LEDNUM');
                var color = script.getNumberValue('COLOR', script);
                var ledmode = 1;
				var rLED, gLED, bLED;

				switch(color)
				{
						case 0: 	rLED = 255; gLED = 0; bLED = 0;		// Red
									break;				
                        case 1: 	rLED = 0; gLED = 0; bLED = 255;		// Blue
									break;					
                        case 2: 	rLED = 0; gLED = 255;	bLED = 0;	// Lime
									break;					
                        case 3: 	rLED = 255; gLED = 255; bLED = 255;	// white
									break;					
                        case 4: 	rLED = 0; gLED = 255; bLED = 255;	// Cyan
									break;
                        case 5: 	rLED = 255; gLED = 255; bLED = 0;	// Yellow
									break;					
						case 6: 	rLED = 255; gLED = 0;	bLED = 255;	// Magenta
                                    break;
                        case 6: 	rLED = 0; gLED = 0;	bLED = 0;	    // 끄기
									break;
				}
                
                
                if(!(rgbled_r[port] == rLED) || !(rgbled_g[port] == gLED) || !(rgbled_b[port] == bLED))
                {
                    if (!script.isStart) 
                    {
                        if (!Entry.hw.sendQueue['SET']) 
                        {
                            Entry.hw.sendQueue['SET'] = {};
                        }
                        Entry.hw.sendQueue['SET'][port] = {  // port 를 
                            type: Entry.kaduino.sensorTypes.RGBLED,
                            data: {			
                                r: rLED,
                                g: gLED,
                                b: bLED,
                                mode: ledmode,
                            },
                            time: new Date().getTime(),
                        };
                        rgbled_r[port] = rLED;
                        rgbled_g[port] = gLED;
                        rgbled_b[port] = bLED;
                        script.isStart = true;  // 출력 시작 플래그 셋
                        script.timeFlag = 1;    // 시간플래그 셋
                        setTimeout(function() 
                        {
                            script.timeFlag = 0;
                        }, delay_time );
                        return script;
                    }
                    else if (script.timeFlag == 1) 
                    {
                        return script;
                    } 
                    else    // 설정 시간이 지나면 출력 리셋
                    {
                        delete script.timeFlag;
                        delete script.isStart;
                        Entry.engine.isContinue = false;
                        return script.callReturn();
                    }
                }
                else
                    return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },

        // 7. rgb led 연결 설정
        kaduino_rgbled_seting:     
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
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'kaduino_digital_port_list', 
                    },
                    {
                        type: 'number',
						params: ["2"],
                    },
                    {
                        type: 'number',
						params: ["255"],
                    },				
                    null,
                ],
                type: 'kaduino_rgbled_seting',
            },
            paramsKeyMap: {
                RGBPIN:0,
                VALUE0:1,
                VALUE1:2,
            },
            class: 'kaduino_LV2',
            isNotFor: ['kaduino'],
            func: function(sprite, script) 
			{
                var port = 0;
                var rLED = script.getNumberValue('RGBPIN', script);  // 핀번호
                var gLED = script.getNumberValue('VALUE0', script);  // 수량
                var bLED = script.getNumberValue('VALUE1', script);  // 밝기
                var ledmode = 4;  // 핀번호설정

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.kaduino.sensorTypes.RGBLED,
                    data: {
                        r: rLED,
                        g: gLED,
                        b: bLED,
                        mode: ledmode,
                    },
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
		
		// 8. RGBLED 색상설정
		kaduino_set_rgbled_value: 
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
                        type: 'number',
						params: ["1"],
                    },
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
                type: 'kaduino_set_rgbled_value',
            },
            paramsKeyMap: {
                RGBNUM:0,
                VALUE0:1,
                VALUE1:2,
				VALUE2:3,
            },
            class: 'kaduino_LV2',
            isNotFor: ['kaduino'],
            func: function(sprite, script) 
			{
                var port = script.getNumberValue('RGBNUM', script);
                var rLED = script.getNumberValue('VALUE0', script);
                var gLED = script.getNumberValue('VALUE1', script);
                var bLED = script.getNumberValue('VALUE2', script);
                var ledmode = 7;

                if(!(rgbled_r[port] == rLED) || !(rgbled_g[port] == gLED) || !(rgbled_b[port] == bLED))
                {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
                    Entry.hw.sendQueue['SET'][port] = {
                        type: Entry.kaduino.sensorTypes.RGBLED,
                        data: {
                            r: rLED,
                            g: gLED,
                            b: bLED,
                            mode: ledmode,
                        },
                        time: new Date().getTime(),
                    };
                    rgbled_r[port] = rLED;
                    rgbled_g[port] = gLED;
                    rgbled_b[port] = bLED;
                    return script.callReturn();
                }
                else
                    return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
        
		// 9. RGBLED 끄기, SHOW
		kaduino_rgbled_all_onoff: 
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
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'kaduino_all_onoff_list',
                    },			
                    null,
                ],
                type: 'kaduino_rgbled_all_onoff',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'kaduino_LV2',
            isNotFor: ['kaduino'],
            func: function(sprite, script) 
			{
                var port = 4;//script.getNumberValue('PORT');
                var ledmode = script.getNumberValue('VALUE', script);

				
								
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.kaduino.sensorTypes.RGBLEDSHOW,
                    data: {
                        mode: ledmode,
                    },
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },

        // 10. 디지털  출력
		kaduino_digital_onoff: {
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
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'kaduino_digital_port_list',      
                    },
                    {
                        type: 'kaduino_digital_port_onoff_list',
                    },					
                    null,
                ],
                type: 'kaduino_digital_onoff',
            },
            paramsKeyMap: {   // 실제 블록의 로직인 func에서 key값으로 사용할 파라미터의 인덱스 번호
                PORT: 0,
				VALUE: 1,
            },
            class: 'kaduino_LV3',    // 블록을 묶는 그룹 이름. 이 값이 다르면 사이에 가로줄이 생깁니다
            isNotFor: ['kaduino'],
           func: function(sprite, script) 
		   {
                var port = script.getNumberValue('PORT');
                var value = script.getNumberValue('VALUE');
				
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = {
                    type: Entry.kaduino.sensorTypes.DIGITAL,    /// 출력 디바이스
                    data: value,
                    time: new Date().getTime(),
                };
                return script.callReturn();				
            },
            syntax: { js: [], py: [] },
        },

		
		// 11. 디지털입력		
        kaduino_get_digital_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,			
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            template: Lang.template.kaduino_get_digital_value,
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
                        type: 'kaduino_digital_port_list',
                    },
                ],
                type: 'kaduino_get_digital_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'kaduino_LV3',
            isNotFor: ['kaduino'],
            func: function(sprite, script) 
			{		
                var port = script.getNumberValue('PORT');
                var DIGITAL = Entry.hw.portData.DIGITAL;
				
                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                Entry.hw.sendQueue['GET'][ 
                    Entry.kaduino.sensorTypes.DIGITAL
                ] = {
                    port: port,
                    time: new Date().getTime(),
                };
		
				return DIGITAL[port];
            },
            syntax: { js: [], py: [] },
        },	
        
        // 12. 아날로그 읽기
        kaduino_get_analog_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,			
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: Lang.template.kaduino_get_analog_value,
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
                        type: 'kaduino_analog_port_list',
                    },				
                ],
                type: 'kaduino_get_analog_value',
            },
            paramsKeyMap: {
                PORT: 0,
				TYPE: 1,
            },
            class: 'kaduino_LV3',
            isNotFor: ['kaduino'],
            func: function(sprite, script) 
			{
                var btn_index = script.getNumberValue('PORT');				
                var ANALOG = Entry.hw.portData.ANALOG;

                return ANALOG[btn_index];
            },
            syntax: { js: [], py: [] },
        },

        // 13.  PWM 제어 	
		kaduino_set_pwm: 
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
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'kaduino_pwn_port_list',
                    },			
                    {
                        type: 'number',
						params: ["0"],
                    },		
                    null,
                ],
                type: 'kaduino_set_pwm',
            },
            paramsKeyMap: {
				PORT: 0,
                ANGLE: 1,
            },
            class: 'kaduino_LV3',
            isNotFor: ['kaduino'],
            func: function(sprite, script) 
			{
                var port = script.getNumberValue('PORT', script);
                var angle = script.getNumberValue('ANGLE', script);
				//var mode = 2;
                //port += 2;
                
                angle = Math.min(180, angle);
                angle = Math.max(0, angle);
				
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = 
				{
                    type: Entry.kaduino.sensorTypes.PWM,
                    data: angle,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },

        // 14. 초음파센서 설정
        kaduino_set_ultrasonic:   
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
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'kaduino_ultrasonic_port_list',
                        params: ['11'],
                    },			
                    {
                        type: 'kaduino_ultrasonic_port_list',
                        params: ['10'],
                    },		
                    null,
                ],
                type: 'kaduino_set_ultrasonic',
            },
            paramsKeyMap: {
				TRIG: 0,
                ECHO: 1,
            },
            class: 'kaduino_LV4',
            isNotFor: ['kaduino'],
            func: function(sprite, script) 
			{
                var trig = script.getNumberValue('TRIG', script);
                var echo = script.getNumberValue('ECHO', script);
				//var mode = 2;
                var port = trig;

				
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = 
				{
                    type: Entry.kaduino.sensorTypes.USONIC,
                    data: echo,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },

        // 15. 초음파 센서 값		
        kaduino_get_usonic_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,			
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: Lang.template.kaduino_get_usonic_value,
            statements: [],
            params: [
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
                ],
                type: 'kaduino_get_usonic_value',
            },
            paramsKeyMap: {
            },
            class: 'kaduino_LV4',
            isNotFor: ['kaduino'],
            func: function(sprite, script) {
 //               var us = Entry.hw.portData.USONIC ;

//                if (!Entry.hw.sendQueue['SET']) {
//                    Entry.hw.sendQueue['SET'] = {};
//                }
//                delete Entry.hw.sendQueue['SET'][port1];
//                delete Entry.hw.sendQueue['SET'][port2];
				
/*                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                Entry.hw.sendQueue['GET'][
                    Entry.kaduino.sensorTypes.USONIC		
                ] = {
                    port: [port1, port2],
                    time: new Date().getTime(),
                };*/
//                Entry.hw.update();

//                var time2 = new Date().getTime();
//                while(time2 + 1000 > new Date().getTime());
  
                return Entry.hw.portData.USONIC;// || 0;
            },
            syntax: { js: [], py: [] },
        },

        //16. 온도센서 연결핀 설정
        kaduino_set_temp:   
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
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'kaduino_digital_port_list',
                        params: ['14'],
                    },			
                    null,
                ],
                type: 'kaduino_set_temp',
            },
            paramsKeyMap: {
				SENSOR: 0,
            },
            class: 'kaduino_LV4',
            isNotFor: ['kaduino'],
            func: function(sprite, script) 
			{
                var sensor = script.getNumberValue('SENSOR', script);
                var port = sensor;

				
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = 
				{
                    type: Entry.kaduino.sensorTypes.TEMP,
                    data: sensor,
                    time: new Date().getTime(),
                };
               // return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },

        // 17. 온도센서값 읽기
        kaduino_get_temp_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,			
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: Lang.template.kaduino_get_temp_value,
            statements: [],
            params: [
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
                ],
                type: 'kaduino_get_temp_value',
            },
            paramsKeyMap: {
            },
            class: 'kaduino_LV4',
            isNotFor: ['kaduino'],
            func: function(sprite, script) {
 
                return Entry.hw.portData.TEMP;// || 0;
            },
            syntax: { js: [], py: [] },
        },

        // 18. i2c포트 센서연결 설정
        kaduino_set_i2c:   
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
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'kaduino_i2c_sen_list',
                        params: ['1'],
                    },			
                    null,
                ],
                type: 'kaduino_set_i2c',
            },
            paramsKeyMap: {
				SENSOR: 0,
            },
            class: 'kaduino_LV4',
            isNotFor: ['kaduino'],
            func: function(sprite, script) 
			{
                var sensor = script.getNumberValue('SENSOR', script);
                var port = sensor;

				
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][port] = 
				{
                    type: Entry.kaduino.sensorTypes.I2C_SET,
                    data: sensor,
                    time: new Date().getTime(),
                };
               // return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },

        // 19. 컬러센서값
        kaduino_get_color_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,			
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: Lang.template.kaduino_get_color_value,
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['R', '1'],
                        ['G', '2'],
                        ['B', '3']
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                }
				
            ],
            events: {},
            def: {
                params: ['1'],
                type: 'kaduino_get_color_value',
            },
            paramsKeyMap: {
                COLOR: 0,
            },
            class: 'kaduino_LV4',
            isNotFor: ['kaduino'],
            func: function(sprite, script) 
			{
                var btn_index = script.getField('COLOR');				

                return Entry.hw.portData.COLOR_SEN[btn_index-1];
            },
           
            syntax: { js: [], py: [] },
        },

        // 20. 자이로센서값
        kaduino_get_gyro_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,			
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: Lang.template.kaduino_get_gyro_value,
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['angle X', '1'],
                        ['angle Y', '2'],
                        ['angle Z', '3'],
                        ['acc X', '4'],
                        ['acc Y', '5'],
                        ['acc Z', '6']
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                }
				
            ],
            events: {},
            def: {
                params: ['1'],
                type: 'kaduino_get_gyro_value',
            },
            paramsKeyMap: {
                GYRO: 0,
            },
            class: 'kaduino_LV4',
            isNotFor: ['kaduino'],
            func: function(sprite, script) 
			{
                var btn_index = script.getField('GYRO');				

                return Entry.hw.portData.GYRO_SEN[btn_index-1];
            },
           
            syntax: { js: [], py: [] },
        },

        // 21. LCD글자출력
        kaduino_set_lcd_string:
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
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
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
                        type: 'text', 
                        params: ['Hello, Kaduino'],
                    },
                    null,
                ],
                type: 'kaduino_set_lcd_string',
            },
            paramsKeyMap: {
                COLUMN: 0,
                LINE: 1,
                STRING: 2,
            },
            class: 'kaduino_LV5',
            isNotFor: ['kaduino'],
            func: function(sprite, script) 
			{
                
         //       var sq = Entry.hw.sendQueue;
                var line = script.getValue('LINE', script);
                var column = script.getValue('COLUMN', script);
                var string = script.getValue('STRING', script);
                var text = [];

                if (!script.isStart) {
                    if (typeof string === 'string') {
                        for (var i = 0; i < string.length; i++) {
                            text[i] = Entry.memaker.toByte(string[i]);
                        }
                    } else if (typeof string === 'number') {
                        var num_to_string = string.toString();
                        for (var i = 0; i < num_to_string.length; i++) {
                            text[i] = Entry.memaker.toByte(num_to_string[i]);
                        }
                    } else {
                        text[0] = string;
                    }

                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    //var fps = Entry.FPS || 60;
                   // var timeValue = 60 / fps * 50;

                    Entry.hw.sendQueue['SET'][3] = {
                        type: Entry.kaduino.sensorTypes.LCD_SET,
                        data: {
                            line: line,
                            column: column,
                            text0: text[0],
                            text1: text[1],
                            text2: text[2],
                            text3: text[3],
                            text4: text[4],
                            text5: text[5],
                            text6: text[6],
                            text7: text[7],
                            text8: text[8],
                            text9: text[9],
                            text10: text[10],
                            text11: text[11],
                            text12: text[12],
                            text13: text[13],
                            text14: text[14],
                            text15: text[15],
                            text15: text[16],
                            text15: text[17],
                            text15: text[18],
                            text15: text[19],
                        },
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, delay_time);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = true;
                    return script.callReturn();
                }
                 
            },
            syntax: { js: [], py: [] },
        },

        // 22. LCD 연결설정
		kaduino_set_lcd_init: 
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
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'kaduino_lcd_add_list', 
                        params: ["39"],
                    },
                    {
                        type: 'number',
						params: ["16"],
                    },
                    {
                        type: 'number',
						params: ["2"],
                    },				
                    null,
                ],
                type: 'kaduino_set_lcd_init',
            },
            paramsKeyMap: {
                LCD_ADD:0,
                Y_LINE:1,
                X_LINE:2,
            },
            class: 'kaduino_LV5',
            isNotFor: ['kaduino'],
            func: function(sprite, script) 
			{
                //var port = 0;
                var lcd_add = script.getNumberValue('LCD_ADD', script);  // 주소
                var y_line = script.getNumberValue('Y_LINE', script);  // 세로 줄수
                var x_line = script.getNumberValue('X_LINE', script);  // 가로 줄수

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][1] = {
                    type: Entry.kaduino.sensorTypes.LCD_SET,
                    data: [
                        lcd_add,
                        y_line,
                        x_line,
                    ],
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },	
        // 23. LCD 지우기
		kaduino_set_lcd_clear: 
        {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,	
			fontColor: '#fff',			
            skeleton: 'basic',
            statements: [],
            params: [
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
                ],
                type: 'kaduino_set_lcd_clear',
            },
            paramsKeyMap: {

            },
            class: 'kaduino_LV5',
            isNotFor: ['kaduino'],
            func: function(sprite, script) 
			{
                //var port = 0;

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][4] = {
                    type: Entry.kaduino.sensorTypes.LCD_SET,
                    data: [
                        4,
                        4,
                        4,
                    ],
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },


   
		
		// 3. 소리/빛/가변저항 - 2) mapping 값			
        kaduino_get_analog_mapping: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,			
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: Lang.template.kaduino_get_analog_mapping,
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
                        type: 'number',
                        params: ['0'],
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
                type: 'kaduino_get_analog_mapping',
            },
            paramsKeyMap: {
				IDATA: 0,
                VALUE2: 1,
                VALUE3: 2,
                VALUE4: 3,
                VALUE5: 4,
            },
            class: 'kaduino_ANA',
            isNotFor: ['kaduino'],
            func: function(sprite, script) 
			{
                var result = script.getNumberValue('IDATA', script);				
                var value2 = script.getNumberValue('VALUE2', script);
                var value3 = script.getNumberValue('VALUE3', script);
                var value4 = script.getNumberValue('VALUE4', script);
                var value5 = script.getNumberValue('VALUE5', script);
			
				
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
			
		

		
   
       

		
	
				
		
		
		
    };
};

module.exports = Entry.kaduino;
