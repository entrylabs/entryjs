'use strict';

let delay_time = 0;
let lmotor_speed = 0;
let rmotor_speed = 0;
let rgbled_r = [];
let rgbled_g = [];
let rgbled_b = [];

Entry.ssboard_nano = {
    id: '3D.2',
    name: 'ssboard_nano',
    url: 'http://www.ssmaker.co.kr/',
    imageName: 'ssboard_nano.png',
    title: {
        'ko': '상상보드 나노', 
        'en': 'ssboard_nano'
    },

    setZero: () => {
        ///  하드웨어 초기화 로직
        const rgbled_0 = [];
        if (!Entry.hw.sendQueue.SET) {
            Entry.hw.sendQueue = {
                GET: {},
                SET: {},
            };
        } else {
            var keySet = Object.keys(Entry.hw.sendQueue.SET);
            keySet.forEach((key) => {
                Entry.hw.sendQueue.SET[parseInt(key, 10)].data = 0;
                Entry.hw.sendQueue.SET[parseInt(key, 10)].time = new Date().getTime();
            });
        }
        Entry.hw.update();
        lmotor_speed = 0;
        rmotor_speed = 0;
        rgbled_r = rgbled_0;
        rgbled_g = rgbled_0;
        rgbled_b = rgbled_0;
    },
    Static: {
//        ssboard_nano_BLOCK_COLOR: '#00979D', // gray(#848484)
//        ssboard_nano_ARROW_COLOR_HW: '#00979D',
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

Entry.ssboard_nano.blockMenuBlocks = [
    /// 하드웨어 블록 등록 , 여기에 등록된 블록이 순서대로 나열되며 설정한 이름으로 화면에 보임
    'ssboard_nano_buzzer_onoff',			            // 스피커 삐 소리
    'ssboard_nano_set_digital_buzzer',               // 스피커 멜로디
    'ssboard_nano_set_motor_speed',                  // DC모터 속도제어
  //  'ssboard_nano_motor_stop',            // DC모터 정지하기	
    'ssboard_nano_set_servo',                        // 서보모터 제어

    'ssboard_nano_set_rgbled_onoff',                // rgb led로 지정색 제어
    'ssboard_nano_rgbled_seting',                // rgb led 핀번호 설정
    'ssboard_nano_set_rgbled_value',                //rgb led 개별색 제어
    'ssboard_nano_rgbled_all_onoff',                // rgb led all show, all off

    'ssboard_nano_digital_onoff',                   /// 디지털 포트 제어
    'ssboard_nano_get_digital_value',	            //디지탈 입력
    'ssboard_nano_get_analog_value',                 // 아날로그 입력
    'ssboard_nano_set_pwm',                          //PWM제어

    'ssboard_nano_set_ultrasonic',                   //초음파센서 포트설정
    'ssboard_nano_get_usonic_value',              //초음파센서 읽기
    'ssboard_nano_set_temp',                  //온도센서 연결포트 설정
    'ssboard_nano_get_temp_value',                   // 온도센서 입력
    'ssboard_nano_set_i2c',                   //I2C포트 센서연결설정
    'ssboard_nano_get_color_value',                  // 컬러센서 입력
    'ssboard_nano_get_gyro_value',                   // 자이로센서 입력

    'ssboard_nano_set_lcd_string',
    'ssboard_nano_set_lcd_init',
    'ssboard_nano_set_lcd_clear',

	'ssboard_nano_get_analog_mapping',

		
];

Entry.ssboard_nano.setLanguage = function() {    // 블록 이름  번역
    return {
        ko: {
            template: {
                ssboard_nano_buzzer_onoff: '스피커 삐 소리 %1 초 연주 %2',				
                ssboard_nano_set_digital_buzzer: '스피커음계 %1 옥타브 %2 음 %3 초 연주 %4',	
                ssboard_nano_set_motor_speed: 'DC모터 왼쪽 속도%1 오른쪽 속도%2 으로 정하기 %3', 
                ssboard_nano_motor_stop: 'DC모터 정지하기 %1',	
                ssboard_nano_set_servo: '서보모터 %1번 핀 각도 %2 %3',		

                ssboard_nano_set_rgbled_onoff: 'RGB LED %1 번째 색깔 %2 %3',	
                ssboard_nano_rgbled_seting: 'RGB LED %1핀에 %2개  밝기%3  %4',   
                ssboard_nano_set_rgbled_value: 'RGB LED %1번째  빨강%2 초록%3 파랑%4 %5',
                ssboard_nano_rgbled_all_onoff: 'RGB LED  %1 %2',

                ssboard_nano_digital_onoff: '디지털 %1 핀 %2 %3',         
                ssboard_nano_get_digital_value: '디지털 %1 핀 읽기',				
                ssboard_nano_get_analog_value: '아날로그 %1 핀 읽기',
                ssboard_nano_set_pwm: 'PWM %1 핀에 %2 %3',	

                ssboard_nano_set_ultrasonic: '초음파센서 설정 트리거 %1 핀, 에코 %2 핀 으로 연결 %3',	
                ssboard_nano_get_usonic_value: '초음파센서 값 읽기',	
                ssboard_nano_set_temp: '온도센서 %1 핀에 연결 %2',	
                ssboard_nano_get_temp_value: '온도센서 값 읽기',	
                ssboard_nano_set_i2c: 'I2C포트  %1 연결 %2',	
                ssboard_nano_get_color_value: '컬러센서 %1 값 읽기',
                ssboard_nano_get_gyro_value: '자이로센서 %1 값 읽기',

                ssboard_nano_set_lcd_string: 'lcd 세로%1줄,  가로%2줄 에  %3 표시 %4',
                ssboard_nano_set_lcd_init: 'lcd 설정 : I2C 주소 0x%1 , 가로줄 수 %2 , 세로줄 수 %3 으로 설정하기%4',
                ssboard_nano_set_lcd_clear: 'lcd 지우기 %1',


                ssboard_nano_get_analog_mapping: ' %1 값 %2 ~ %3 에서 %4 ~ %5 으로 변환값', 
            },
            Blocks: {
                On_block: '켜짐(HIGH, 5V)',
                Off_block: '꺼짐(LOW, 0V)',
                AllOn_block: '모두 켜짐',
                AllOff_block: '모두 꺼짐',
                RGB_red: '빨강색',
                RGB_blue: '파란색',
                RGB_green: '초록색',
                RGB_white: '하얀색',
                RGB_skyblue: '하늘색',
                RGB_yellow: '노란색',
                RGB_purple: '보라색',
                RGB_off: '끄기',
            }
        },
        en: {
            template: {
                ssboard_nano_buzzer_onoff: 'Speakers Beep %1 Playing Second %2',				
                ssboard_nano_set_digital_buzzer: 'Speakers  %1 Octave %2 Play %3 seconds %4',	
                ssboard_nano_set_motor_speed: 'Set DC motor left speed %1  right speed %2 %3', 	
                ssboard_nano_motor_stop: 'Stop DC Motor %1',	
                ssboard_nano_set_servo: 'Servo motor %1 pin angle %2 movement %3',		

                ssboard_nano_set_rgbled_onoff: 'RGB LED %1 First Color %2 %3',		
                ssboard_nano_rgbled_seting: 'Setting %2 brightness %3 on RGB LED %1 pin %4',
                ssboard_nano_set_rgbled_value: 'RGB LED %1 st Red %2 Green %3 Blue %4',
                ssboard_nano_rgbled_all_onoff: 'RGB LED %1 %2',		

                ssboard_nano_digital_onoff: 'Setting up digital %1 pin %2 %3',	
                ssboard_nano_get_digital_value: 'Read digital %1 pins',				
                ssboard_nano_get_analog_value: 'Analog %1 pin read',
                ssboard_nano_set_pwm: 'Send %2 to pin %1 %3',		

                ssboard_nano_set_ultrasonic: 'Connecting to the ultrasonic sensor setting trigger %1 pin, echo %2 pin %3',		
                ssboard_nano_get_usonic_value: 'Reading ultrasonic sensor values',		
                ssboard_nano_set_temp: 'Connecting to the temperature sensor %1 pin %2',		
                ssboard_nano_get_temp_value: 'Reading temperature sensor values',		
                ssboard_nano_set_i2c: 'Connect I2Cport %1 %2',		
                ssboard_nano_get_color_value: 'Reading the color sensor %1 value',
                ssboard_nano_get_gyro_value: 'Read gyro sensor %1 value',

                ssboard_nano_set_lcd_string: 'lcd Display %3 on line %1 and line %2 %4',		
                ssboard_nano_set_lcd_init: 'setting lcd : I2C address 0x%1 , horizontal line number %2 , vertical line number %3 %4',	
                ssboard_nano_set_lcd_clear: 'Clear lcd %1',		

				
                ssboard_nano_get_analog_mapping: '%1 value %2 to %3 ; to %4 to %5 conversion value ',	
								
            },
            Blocks: {
                On_block: 'On(HIGH, 5V)',
                Off_block: 'Off(LOW, 0V)',
                AllOn_block: 'ALL ON',
                AllOff_block: 'ALL OFF',
                RGB_red: 'Red',
                RGB_blue: 'Blue',
                RGB_green: 'Green',
                RGB_white: 'White',
                RGB_skyblue: 'Sky blue',
                RGB_yellow: 'Yellow',
                RGB_purple: 'Purple',
                RGB_off: 'Off',
            },
        },
    };
};


Entry.ssboard_nano.getBlocks = function() {
    return {
        ssboard_nano_digital_port_onoff_list: {
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
            func: (sprite, script) => {
                return script.getField('PORT');
            },
        },	
        
        ssboard_nano_list_digital_octave: {
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
            func: (sprite, script) => {
                return script.getField('OCTAVE');
            },
        },
		
        ssboard_nano_list_digital_tone: {
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
            func: (sprite, script) => {
                return script.getField('NOTE');
            },
        },
        ssboard_nano_digital_port_list: {
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
                        ['D3', '3'],
                        ['D4', '4'],
                        ['D5', '5'],
                        ['D13', '13'],
                        ['A0', '14'],
                        ['A1', '15'],
                        ['A2', '16'],
                        ['KEY_UP', '17'],
                        ['KEY_DN', '20'],
                        ['KEY_LEFT', '21'],
                        ['KEY_RIGHT', '2'],
                        ['KEY_A', '12'],
                        ['KEY_B', '11'],

                    ],
                    value: '3',       // 기본 표시값
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
            func: (sprite, script) => {
                return script.getStringField('PORT');
            },
        },

        ssboard_nano_pwn_port_list: 
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
                        ['3', '3'],
                        ['5', '5'],
                    ],
                    value: '3',
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
            func: (sprite, script) => {
                return script.getStringField('PWMPORT');
            },
        },
        ssboard_nano_lcd_add_list: 
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
            func: (sprite, script) => {
                return script.getStringField('LCDADD');
            },
        },
        ssboard_nano_i2c_sen_list: 
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
            func: (sprite, script) => {
                return script.getStringField('SENSOR');
            },
        },

        ssboard_nano_all_onoff_list: {
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
            func: (sprite, script) => {
                return script.getField('VALUE');
            },
        },
        ssboard_nano_analog_port_list: {
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
            func: (sprite, script) => {
                return script.getField('PORT');
            },
        },


        ssboard_nano_ultrasonic_port_list: {
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
                        ['3', '3'],
                        ['4', '4'],
                        ['5', '5'],
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
                PORT: 0,
            },
            func: (sprite, script) => {
                return script.getField('PORT');
            },
        },

        ssboard_nano_analog_rgb_color_list: {
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
            func: (sprite, script) => {
                return script.getField('PORT');
            },
        },


		// 1. 삐소리
        ssboard_nano_buzzer_onoff: {
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
                type: 'ssboard_nano_buzzer_onoff',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'ssboard_nano_LV1',
            isNotFor: ['ssboard_nano'],
            func: (sprite, script) => {
                var port = 10;
                var duration = script.getNumberValue('VALUE');	// 길이	
                var octave = 5;    // 옥타브
                var value = 2400;//698;   // 음 주파수
                var mode = 1;

                if (!script.isStart) {
                    if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                    }
                    if (duration == 0) {// 음 길이가 0 이면
	                    Entry.hw.sendQueue.SET[port] = {
                            type: Entry.ssboard_nano.sensorTypes.TONE,
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

                    Entry.hw.sendQueue.SET[port] = {
                        type: Entry.ssboard_nano.sensorTypes.TONE,
                        data: 
                        {
                            value: value,
                            duration: duration/10,
                        },
                        time: new Date().getTime(),
                    };

                    setTimeout(() => {
                        script.timeFlag = 0;
                    }, duration + 32);
                    return script;

                } else if (script.timeFlag == 1) {
                    return script;
                } 
				else    // 설정 시간이 지나면 출력 리셋
				{
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.hw.sendQueue.SET[port] = 
					{
                        type: Entry.ssboard_nano.sensorTypes.TONE,
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
        ssboard_nano_set_digital_buzzer: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,			
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.ssboard_nano_set_digital_buzzer,
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
                        type: 'ssboard_nano_list_digital_octave',						
                    },
                    {
                        type: 'ssboard_nano_list_digital_tone',
                    },
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'ssboard_nano_set_digital_buzzer',
            },
            paramsKeyMap: {
                OCTAVE: 0,				
                NOTE: 1,
                DURATION: 2,
            },
            class: 'ssboard_nano_LV1',
            isNotFor: ['ssboard_nano'],
            func: (sprite, script) => {
                const port = 10; //script.getNumberValue('PORT');
                let duration = script.getNumberValue('DURATION');
                let octave = script.getNumberValue('OCTAVE') - 1;
                let value = 0;

                if (!script.isStart) {
                    var note = script.getValue('NOTE');
                    if (!Entry.Utils.isNumber(note)) {
                        note = Entry.ssboard_nano.toneTable[note];
                    }
                    if (note < 0) note = 0;
                    else if (note > 12) note = 12;

                    if (duration < 0) duration = 0;
					
                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }
					
                    if (duration == 0) {
                        Entry.hw.sendQueue.SET[port] = 
						{
                            type: Entry.ssboard_nano.sensorTypes.TONE,
                            data: 0,
                            time: new Date().getTime(),
                        };
                        return script.callReturn();
                    }
					
                    if (octave < 0) octave = 0;
                    else if (octave > 8) octave = 8;
                    if (note != 0) value = Entry.ssboard_nano.toneMap[note][octave];
                    if(duration > 300)
                        duration = 300;
                    duration = duration * 1000;
                    script.isStart = true;
                    script.timeFlag = 1;

                    Entry.hw.sendQueue.SET[port] = 
					{
                        type: Entry.ssboard_nano.sensorTypes.TONE,
                        data: 
						{
                            value: value,
                            duration: duration/10,
                        },
                        time: new Date().getTime(),
                    };

                    setTimeout(() => {
                        script.timeFlag = 0;
                    }, duration + 32);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.hw.sendQueue.SET[port] = 
					{
                        type: Entry.ssboard_nano.sensorTypes.TONE,
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
        ssboard_nano_set_motor_speed: {
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
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },				
                    null,
                ],
                type: 'ssboard_nano_set_motor_speed',
            },
            paramsKeyMap: {
                LSPEED: 0,
                RSPEED: 1,
            },
            class: 'ssboard_nano_LV1',
            isNotFor: ['ssboard_nano'],
            func: (sprite, script) => {
                let lspeed = script.getNumberValue('LSPEED', script);
                let rspeed = script.getNumberValue('RSPEED', script);
                const port = 3;
                		
                lspeed = Math.min(100, lspeed);
                lspeed = Math.max(-100, lspeed);		
                rspeed = Math.min(100, rspeed);
                rspeed = Math.max(-100, rspeed);		
                
                if(!(lmotor_speed == lspeed) || !(rmotor_speed == rspeed))
                {
                    if (!script.isStart) 
                    {
                        if (!Entry.hw.sendQueue.SET) {
                            Entry.hw.sendQueue.SET = {};
                        }
                        Entry.hw.sendQueue.SET[port] = 
                        {
                            type: Entry.ssboard_nano.sensorTypes.MOTOR,
                            data: [lspeed, rspeed],
                            time: new Date().getTime(),
                        };
                        lmotor_speed = lspeed;
                        rmotor_speed = rspeed;
                        script.isStart = true;  // 출력 시작 플래그 셋
                        script.timeFlag = 1;    // 시간플래그 셋
                        setTimeout(() => {
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
        ssboard_nano_motor_stop: 
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
                type: 'ssboard_nano_motor_stop',
            },
            paramsKeyMap: {
                //PORT: 0,
            },
            class: 'ssboard_nano_LV1',
            isNotFor: ['ssboard_nano'],
            func: (sprite, script) => {
                var port = 19;//script.getNumberValue('PORT', script);
				//port += 2;
				const lspeed = 0;
                const rspeed = 0;
                
                if(!(lmotor_speed == 0) || !(rmotor_speed == 0)) {
                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }
                    Entry.hw.sendQueue.SET[port] = 
                    {
                        type: Entry.ssboard_nano.sensorTypes.MOTOR,
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
        ssboard_nano_set_servo: {
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
                        type: 'ssboard_nano_digital_port_list',
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },				
                    null,
                ],
                type: 'ssboard_nano_set_servo',
            },
            paramsKeyMap: 
            {
                PORT: 0,
                ANGLE: 1,
            },
            class: 'ssboard_nano_LV1',
            isNotFor: ['ssboard_nano'],
            func: (sprite, script) => {
                const port = script.getNumberValue('PORT', script);
                let angle = script.getNumberValue('ANGLE', script);
				
                angle = Math.min(180, angle);
                angle = Math.max(0, angle);
                angle += 1;
				
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[port] = 
                {
                    type: Entry.ssboard_nano.sensorTypes.SERVO,
                    data: angle,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },


        // 6. RGBLED  색상 설정 및 show
        ssboard_nano_set_rgbled_onoff: {
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
                        type: 'ssboard_nano_analog_rgb_color_list',
                    },
                    null,
                ],
                type: 'ssboard_nano_set_rgbled_onoff',
            },
            paramsKeyMap: {
                LEDNUM: 0,
                COLOR: 1,
            },
            class: 'ssboard_nano_LV2',
            isNotFor: ['ssboard_nano'],
            func: (sprite, script) => {	
                const port = script.getNumberValue('LEDNUM');
                const color = script.getNumberValue('COLOR', script);
                const ledmode = 1;
                let rLED, gLED, bLED;

                switch(color) {
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
                
                
                if(!(rgbled_r[port] == rLED) || !(rgbled_g[port] == gLED) || !(rgbled_b[port] == bLED)) {
                    if (!script.isStart) {
                        if (!Entry.hw.sendQueue.SET) {
                            Entry.hw.sendQueue.SET = {};
                        }
                        Entry.hw.sendQueue.SET[port] = {  // port 를 
                            type: Entry.ssboard_nano.sensorTypes.RGBLED,
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
                        setTimeout(() => {
                            script.timeFlag = 0;
                        }, delay_time );
                        return script;
                    } else if (script.timeFlag == 1) {
                        return script;
                    } else {// 설정 시간이 지나면 출력 리셋
                        delete script.timeFlag;
                        delete script.isStart;
                        Entry.engine.isContinue = false;
                        return script.callReturn();
                    }
                } else
                    return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },

        // 7. rgb led 연결 설정
        ssboard_nano_rgbled_seting: {
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
                        type: 'ssboard_nano_digital_port_list', 
                        params: ['4'],
                    },
                    {
                        type: 'number',
                        params: ['2'],
                    },
                    {
                        type: 'number',
                        params: ['255'],
                    },				
                    null,
                ],
                type: 'ssboard_nano_rgbled_seting',
            },
            paramsKeyMap: {
                RGBPIN:0,
                VALUE0:1,
                VALUE1:2,
            },
            class: 'ssboard_nano_LV2',
            isNotFor: ['ssboard_nano'],
            func: (sprite, script) => {
                const port = 0;
                const rLED = script.getNumberValue('RGBPIN', script);  // 핀번호
                const gLED = script.getNumberValue('VALUE0', script);  // 수량
                const bLED = script.getNumberValue('VALUE1', script);  // 밝기
                const ledmode = 4;  // 핀번호설정

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[port] = {
                    type: Entry.ssboard_nano.sensorTypes.RGBLED,
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
        ssboard_nano_set_rgbled_value: {
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
                        params: ['1'],
                    },
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
                        params: ['0'],
                    },	
                    null,
                ],
                type: 'ssboard_nano_set_rgbled_value',
            },
            paramsKeyMap: {
                RGBNUM:0,
                VALUE0:1,
                VALUE1:2,
                VALUE2:3,
            },
            class: 'ssboard_nano_LV2',
            isNotFor: ['ssboard_nano'],
            func: (sprite, script) => {
                const port = script.getNumberValue('RGBNUM', script);
                const rLED = script.getNumberValue('VALUE0', script);
                const gLED = script.getNumberValue('VALUE1', script);
                const bLED = script.getNumberValue('VALUE2', script);
                const ledmode = 7;

                if(!(rgbled_r[port] == rLED) || !(rgbled_g[port] == gLED) || !(rgbled_b[port] == bLED)) {
                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }
                    Entry.hw.sendQueue.SET[port] = {
                        type: Entry.ssboard_nano.sensorTypes.RGBLED,
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
        ssboard_nano_rgbled_all_onoff: {
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
                        type: 'ssboard_nano_all_onoff_list',
                    },			
                    null,
                ],
                type: 'ssboard_nano_rgbled_all_onoff',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'ssboard_nano_LV2',
            isNotFor: ['ssboard_nano'],
            func: (sprite, script) => {
                const port = 4;//script.getNumberValue('PORT');
                const ledmode = script.getNumberValue('VALUE', script);

				
								
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[port] = {
                    type: Entry.ssboard_nano.sensorTypes.RGBLEDSHOW,
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
        ssboard_nano_digital_onoff: {
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
                        type: 'ssboard_nano_digital_port_list',      
                    },
                    {
                        type: 'ssboard_nano_digital_port_onoff_list',
                    },					
                    null,
                ],
                type: 'ssboard_nano_digital_onoff',
            },
            paramsKeyMap: {   // 실제 블록의 로직인 func에서 key값으로 사용할 파라미터의 인덱스 번호
                PORT: 0,
                VALUE: 1,
            },
            class: 'ssboard_nano_LV3',    // 블록을 묶는 그룹 이름. 이 값이 다르면 사이에 가로줄이 생깁니다
            isNotFor: ['ssboard_nano'],
           func: (sprite, script) => {
                const port = script.getNumberValue('PORT');
                const value = script.getNumberValue('VALUE');
				
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[port] = {
                    type: Entry.ssboard_nano.sensorTypes.DIGITAL,    /// 출력 디바이스
                    data: value,
                    time: new Date().getTime(),
                };
                return script.callReturn();				
            },
            syntax: { js: [], py: [] },
        },

		
		// 11. 디지털입력		
        ssboard_nano_get_digital_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            template: Lang.template.ssboard_nano_get_digital_value,
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
                        type: 'ssboard_nano_digital_port_list',
                    },
                ],
                type: 'ssboard_nano_get_digital_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'ssboard_nano_LV3',
            isNotFor: ['ssboard_nano'],
            func: (sprite, script) => {		
                const port = script.getNumberValue('PORT');
                const DIGITAL = Entry.hw.portData.DIGITAL;

                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                Entry.hw.sendQueue.GET[Entry.ssboard_nano.sensorTypes.DIGITAL] = {
                    port: port,
                    time: new Date().getTime(),
                };
                return DIGITAL[port];
            },
            syntax: { js: [], py: [] },
        },	

        // 12. 아날로그 읽기
        ssboard_nano_get_analog_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,			
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: Lang.template.ssboard_nano_get_analog_value,
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
                        type: 'ssboard_nano_analog_port_list',
                    },				
                ],
                type: 'ssboard_nano_get_analog_value',
            },
            paramsKeyMap: {
                PORT: 0,
                TYPE: 1,
            },
            class: 'ssboard_nano_LV3',
            isNotFor: ['ssboard_nano'],
            func: (sprite, script) => {
                const btn_index = script.getNumberValue('PORT');				
                const ANALOG = Entry.hw.portData.ANALOG;

                return ANALOG[btn_index];
            },
            syntax: { js: [], py: [] },
        },

        // 13.  PWM 제어 	
        ssboard_nano_set_pwm: {
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
                        type: 'ssboard_nano_pwn_port_list',
                    },			
                    {
                        type: 'number',
						params: ['0'],
                    },		
                    null,
                ],
                type: 'ssboard_nano_set_pwm',
            },
            paramsKeyMap: {
				PORT: 0,
                ANGLE: 1,
            },
            class: 'ssboard_nano_LV3',
            isNotFor: ['ssboard_nano'],
            func: (sprite, script) => {
                const port = script.getNumberValue('PORT', script);
                let angle = script.getNumberValue('ANGLE', script);
                
                angle = Math.min(180, angle);
                angle = Math.max(0, angle);
				
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[port] = 
                {
                    type: Entry.ssboard_nano.sensorTypes.PWM,
                    data: angle,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },

        // 14. 초음파센서 설정
        ssboard_nano_set_ultrasonic: {
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
                        type: 'ssboard_nano_ultrasonic_port_list',
                        params: ['3'],
                    },			
                    {
                        type: 'ssboard_nano_ultrasonic_port_list',
                        params: ['4'],
                    },		
                    null,
                ],
                type: 'ssboard_nano_set_ultrasonic',
            },
            paramsKeyMap: {
                TRIG: 0,
                ECHO: 1,
            },
            class: 'ssboard_nano_LV4',
            isNotFor: ['ssboard_nano'],
            func: (sprite, script) => {
                const trig = script.getNumberValue('TRIG', script);
                const echo = script.getNumberValue('ECHO', script);
				//var mode = 2;
                const port = trig;

				
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[port] = 
                {
                    type: Entry.ssboard_nano.sensorTypes.USONIC,
                    data: echo,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },

        // 15. 초음파 센서 값		
        ssboard_nano_get_usonic_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: Lang.template.ssboard_nano_get_usonic_value,
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
                type: 'ssboard_nano_get_usonic_value',
            },
            paramsKeyMap: {
            },
            class: 'ssboard_nano_LV4',
            isNotFor: ['ssboard_nano'],
            func: (sprite, script) => {
                return Entry.hw.portData.USONIC;// || 0;
            },
            syntax: { js: [], py: [] },
        },

        //16. 온도센서 연결핀 설정
        ssboard_nano_set_temp: {
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
                        type: 'ssboard_nano_digital_port_list',
                        params: ['14'],
                    },			
                    null,
                ],
                type: 'ssboard_nano_set_temp',
            },
            paramsKeyMap: {
                SENSOR: 0,
            },
            class: 'ssboard_nano_LV4',
            isNotFor: ['ssboard_nano'],
            func: (sprite, script) => {
                const sensor = script.getNumberValue('SENSOR', script);
                const port = sensor;

				
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[port] = 
                {
                    type: Entry.ssboard_nano.sensorTypes.TEMP,
                    data: sensor,
                    time: new Date().getTime(),
                };
               // return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },

        // 17. 온도센서값 읽기
        ssboard_nano_get_temp_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: Lang.template.ssboard_nano_get_temp_value,
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
                type: 'ssboard_nano_get_temp_value',
            },
            paramsKeyMap: {
            },
            class: 'ssboard_nano_LV4',
            isNotFor: ['ssboard_nano'],
            func: (sprite, script) => {
 
                return Entry.hw.portData.TEMP;// || 0;
            },
            syntax: { js: [], py: [] },
        },

        // 18. i2c포트 센서연결 설정
        ssboard_nano_set_i2c: {
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
                        type: 'ssboard_nano_i2c_sen_list',
                        params: ['1'],
                    },			
                    null,
                ],
                type: 'ssboard_nano_set_i2c',
            },
            paramsKeyMap: {
                SENSOR: 0,
            },
            class: 'ssboard_nano_LV4',
            isNotFor: ['ssboard_nano'],
            func: (sprite, script) => {
                const sensor = script.getNumberValue('SENSOR', script);
                const port = sensor;

				
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[port] = 
                {
                    type: Entry.ssboard_nano.sensorTypes.I2C_SET,
                    data: sensor,
                    time: new Date().getTime(),
                };
               // return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },

        // 19. 컬러센서값
        ssboard_nano_get_color_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,	
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: Lang.template.ssboard_nano_get_color_value,
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
                type: 'ssboard_nano_get_color_value',
            },
            paramsKeyMap: {
                COLOR: 0,
            },
            class: 'ssboard_nano_LV4',
            isNotFor: ['ssboard_nano'],
            func: (sprite, script) => {
                var btn_index = script.getField('COLOR');				

                return Entry.hw.portData.COLOR_SEN[btn_index-1];
            },
           
            syntax: { js: [], py: [] },
        },

        // 20. 자이로센서값
        ssboard_nano_get_gyro_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,	
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: Lang.template.ssboard_nano_get_gyro_value,
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
                type: 'ssboard_nano_get_gyro_value',
            },
            paramsKeyMap: {
                GYRO: 0,
            },
            class: 'ssboard_nano_LV4',
            isNotFor: ['ssboard_nano'],
            func: (sprite, script) => {
                const btn_index = script.getField('GYRO');				

                return Entry.hw.portData.GYRO_SEN[btn_index-1];
            },
           
            syntax: { js: [], py: [] },
        },

        // 21. LCD글자출력
        ssboard_nano_set_lcd_string: {
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
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'text', 
                        params: ['ssmaker.co.kr'],
                    },
                    null,
                ],
                type: 'ssboard_nano_set_lcd_string',
            },
            paramsKeyMap: {
                COLUMN: 0,
                LINE: 1,
                STRING: 2,
            },
            class: 'ssboard_nano_LV5',
            isNotFor: ['ssboard_nano'],
            func: (sprite, script) => {
                // var sq = Entry.hw.sendQueue;
                const line = script.getValue('LINE', script);
                const column = script.getValue('COLUMN', script);
                const string = script.getValue('STRING', script);
                let text = [];
                let buf;

                if (!script.isStart) {
                    if (typeof string === 'string') {
                        for (var i = 0; i < string.length; i++) {
                            buf = Entry.memaker.toByte(string[parseInt(i, 10)]);
                            text[parseInt(i, 10)] = buf;
                        }
                    } else if (typeof string === 'number') {
                        var num_to_string = string.toString();
                        for (var i = 0; i < num_to_string.length; i++) {
                            text[i] = Entry.memaker.toByte(num_to_string[i]);
                        }
                    } else {
                        text[0] = string;
                    }

                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }

                    script.isStart = true;
                    script.timeFlag = 1;
                    //var fps = Entry.FPS || 60;
                   // var timeValue = 60 / fps * 50;

                    Entry.hw.sendQueue.SET[3] = {
                        type: Entry.ssboard_nano.sensorTypes.LCD_SET,
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

                    setTimeout(() => {
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
        ssboard_nano_set_lcd_init: {
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
                        type: 'ssboard_nano_lcd_add_list', 
                        params: ['39'],
                    },
                    {
                        type: 'number',
                        params: ['16'],
                    },
                    {
                        type: 'number',
                        params: ['2'],
                    },				
                    null,
                ],
                type: 'ssboard_nano_set_lcd_init',
            },
            paramsKeyMap: {
                LCD_ADD:0,
                Y_LINE:1,
                X_LINE:2,
            },
            class: 'ssboard_nano_LV5',
            isNotFor: ['ssboard_nano'],
            func: (sprite, script) => {
                //var port = 0;
                const lcd_add = script.getNumberValue('LCD_ADD', script);  // 주소
                const y_line = script.getNumberValue('Y_LINE', script);  // 세로 줄수
                const x_line = script.getNumberValue('X_LINE', script);  // 가로 줄수

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[1] = {
                    type: Entry.ssboard_nano.sensorTypes.LCD_SET,
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
        ssboard_nano_set_lcd_clear: {
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
                params: [null],
                type: 'ssboard_nano_set_lcd_clear',
            },
            paramsKeyMap: {

            },
            class: 'ssboard_nano_LV5',
            isNotFor: ['ssboard_nano'],
            func: (sprite, script) => {
                //var port = 0;

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[4] = {
                    type: Entry.ssboard_nano.sensorTypes.LCD_SET,
                    data: [4, 4, 4,],
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },
		// 3. 소리/빛/가변저항 - 2) mapping 값			
        ssboard_nano_get_analog_mapping: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: Lang.template.ssboard_nano_get_analog_mapping,
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
                type: 'ssboard_nano_get_analog_mapping',
            },
            paramsKeyMap: {
                IDATA: 0,
                VALUE2: 1,
                VALUE3: 2,
                VALUE4: 3,
                VALUE5: 4,
            },
            class: 'ssboard_nano_ANA',
            isNotFor: ['ssboard_nano'],
            func: (sprite, script) => {
                let result = script.getNumberValue('IDATA', script);				
                let value2 = script.getNumberValue('VALUE2', script);
                let value3 = script.getNumberValue('VALUE3', script);
                let value4 = script.getNumberValue('VALUE4', script);
                let value5 = script.getNumberValue('VALUE5', script);
                let swap;
                if (value2 > value3) {
                    swap = value2;
                    value2 = value3;
                    value3 = swap;
                }
                if (value4 > value5) {
                    swap = value4;
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
module.exports = Entry.ssboard_nano;
