
'use strict';

const DelayTime = 0;
let LmotorSpeed = 0;
let RmotorSpeed = 0;

Entry.krc = 
{
	id: '3A.2',	
    name: 'KRC',
    url: 'http://www.kairobot.co.kr/',
    imageName: 'KRC.png',
    title: {
        'ko': 'KRC_S', 
        'en': 'KRC_S'
    },

    setZero: () => {    ///  하드웨어 초기화 로직
        if (!Entry.hw.sendQueue.SET) {
            Entry.hw.sendQueue = {
                GET: {},
                SET: {},
            };
        } else {
            let keySet = Object.keys(Entry.hw.sendQueue.SET);
            keySet.forEach((key) => {
                Entry.hw.sendQueue.SET[parseInt(key)].data = 0;
                Entry.hw.sendQueue.SET[parseInt(key)].time = new Date().getTime();
            });   
        }
        Entry.hw.update();
        LmotorSpeed = 0;
        RmotorSpeed = 0;

    },
	
    Static: {
//        krc_BLOCK_COLOR: '#00979D', // gray(#848484)
//        krc_ARROW_COLOR_HW: '#00979D',

    },
	
    sensorTypes: {
        ALIVE: 0,
        DIGITAL: 1,
        ANALOG: 2,
        BUZZER: 3,
        SERVO: 4,
        TONE: 5,
        USONIC: 7,
        MOTOR: 12,
        USONIC_SET: 33,
        LCD_SET: 40,
       },
 
    BlockState: {},	
};

Entry.krc.blockMenuBlocks = [    /// 하드웨어 블록 등록 , 여기에 등록된 블록이 순서대로 나열되며 설정한 이름으로 화면에 보임
        'krc_buzzer_onoff',			            // 스피커 삐 소리
        'krc_set_motor_speed',                  // DC모터 속도제어
        'krc_motor_stop',            // DC모터 정지하기	
        'krc_set_servo',                        // 서보모터 제어

        'krc_digital_onoff',                   /// 디지털 포트 제어
        'krc_get_digital_value',	            //디지탈 입력
        'krc_get_analog_value',                 // 아날로그 입력
        'krc_get_usonic_value',              //초음파센서 읽기
       
        'krc_set_lcd_string',
        'krc_set_lcd_backlight',
        'krc_set_lcd_clear',

		'krc_get_analog_mapping',

		
];

Entry.krc.setLanguage = function() {    // 블록 이름  번역
    return {
        ko: {
            template: {
                'krc_buzzer_onoff': '스피커 삐 소리 %1 초 연주하기 %2',				
                'krc_set_motor_speed': 'DC모터 왼쪽 속도%1 오른쪽 속도%2 으로 정하기 %3', 
                'krc_motor_stop': 'DC모터 정지하기 %1',	
                'krc_set_servo': '서보모터 %1포트,  각도%2도,  속도%3%로 이동 %4',		

                'krc_digital_onoff': '디지털 %1 포트 %2 설정하기 %3',         
                'krc_get_digital_value': '디지털 %1 포트 읽기',				
                'krc_get_analog_value': '아날로그 %1 포트 읽기',
                'krc_get_usonic_value': '아날로그형 (US-016)초음파센서 %1포트 읽기',	

                'krc_set_lcd_string': 'lcd 세로%1줄,  가로%2줄 에  %3 표시하기 %4',
                'krc_set_lcd_backlight': 'lcd 후광(백라이트) %1 하기 %2',
                'krc_set_lcd_clear': 'lcd 지우기 %1',

				'krc_get_analog_mapping': ' %1 값 %2 ~ %3 에서 %4 ~ %5 으로 변환값', 
            },
            Blocks: {
                'On_block': '켜짐(HIGH, 5V)',
                'Off_block': '꺼짐(LOW, 0V)',
                'AllOn_block': '모두 켜짐',
                'AllOff_block': '모두 꺼짐',
                'Backlight_on': '켜기',
                'Backlight_off': '끄기',
            }
        },
        en: {
            template: {
                'krc_buzzer_onoff': 'Speakers Beep %1 Playing Second %2',				
                'krc_set_motor_speed': 'Set DC motor left speed %1  right speed %2 %3', 	
                'krc_motor_stop': 'Stop DC Motor %1',	
                'krc_set_servo': 'Servo motor %1 port angle %2 movement %3',		

                'krc_digital_onoff': 'Setting up digital %1 port %2 %3',	
                'krc_get_digital_value': 'Read digital %1 port',				
                'krc_get_analog_value': 'Analog %1 port read',
                'krc_get_usonic_value': 'Analog type (US-016)High sound sensor %1 port read',		
                
                'krc_set_lcd_string': 'lcd Display %3 on line %1 and line %2 %4',
                'krc_set_lcd_backlight': 'Enter lcd backlight %1 %2',		
                'krc_set_lcd_clear': 'Clear lcd %1',		

				
                'krc_get_analog_mapping': '%1 value %2 to %3 ; to %4 to %5 conversion value ',	
								
            },
            Blocks: {
                'On_block': 'On(HIGH, 5V)',
                'Off_block': 'Off(LOW, 0V)',
                'AllOn_block': 'ALL ON',
                'AllOff_block': 'ALL OFF',
                'Backlight_on': 'ON',
                'Backlight_off': 'OFF',
            }
        }
    };
};

Entry.krc.getBlocks = function() {
    return {
        'krc_digital_port_onoff_list': {
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
       'krc_backlight_onoff_list': {
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
                        [Lang.Blocks.Backlight_on, '0'],
                        [Lang.Blocks.Backlight_off, '1'],
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
		
        
       'krc_digital_port_list': {
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
                        ['D1', '9'],
                        ['D2', '10'],
                        ['A1', '1'],
                        ['A2', '2'],
                        ['A3', '3'],
                        ['A4', '4'],
                        ['A5', '5'],
                        ['A6', '6'],
                        ['A7', '7'],
                        ['A8', '8'],
                        ['S1', '11'],
                        ['S2', '12'],
                        ['S3', '13'],
                        ['S4', '14'],
                        ['S5', '15'],
                        ['S6', '6'],
                    ],
                    value: '9',       // 기본 표시값
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
//                    arrowColor: EntryStatic.ARROW_COLOR_HW,
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
        'krc_servo_port_list': {
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
                        ['S1', '1'],
                        ['S2', '2'],
                        ['S3', '3'],
                        ['S4', '4'],
                        ['S5', '5'],
                        ['S6', '6'],
                        ['S7', '7'],
                    ],
                    value: '1',       // 기본 표시값
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
 //                   arrowColor: EntryStatic.ARROW_COLOR_HW,
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

        'krc_all_onoff_list': {
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
        'krc_analog_port_list': {
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
                        ['A1', '0'],
                        ['A2', '1'],
                        ['A3', '2'],
                        ['A4', '3'],
                        ['A5', '4'],
                        ['A6', '5'],
                        ['A7', '6'],
                        ['A8', '7'],
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
		'krc_buzzer_onoff': {
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
                type: 'krc_buzzer_onoff',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'krc_LV1',
            isNotFor: ['KRC'],
            func: (sprite, script) => {
                const port = 10;
                let duration = script.getNumberValue('VALUE');	// 길이	
//                var octave = 5;    // 옥타브
                const value2 = 2400;//698;   // 음 주파수
//                var mode = 1;
                
                if (!script.isStart) 
				{
                    if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                    }
                    if (duration === 0) // 음 길이가 0 이면
					{
                        Entry.hw.sendQueue['SET'][parseInt(port)] = 
						{
                            type: Entry.krc.sensorTypes.TONE,
                            data: 0,
                            time: new Date().getTime(),
                        };
                        return script.callReturn();
                    }
                    if (duration > 300) {
                        duration = 300;
                    }
                    duration = duration * 1000;
                    script.isStart = true;  // 출력 시작 플래그 셋
                    script.timeFlag = 1;    // 시간플래그 셋

                    Entry.hw.sendQueue['SET'][parseInt(port)] = 
					{
                        type: Entry.krc.sensorTypes.TONE,
                        data: 
						{
                            value: value2,
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
                else if (script.timeFlag === 1) 
				{
                    return script;
                } 
				else    // 설정 시간이 지나면 출력 리셋
				{
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.hw.sendQueue['SET'][parseInt(port)] = 
					{
                        type: Entry.krc.sensorTypes.TONE,
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
		'krc_set_motor_speed': 
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
						params: ['0'],
                    },
                    {
                        type: 'number',
						params: ['0'],
                    },				
                    null,
                ],
                type: 'krc_set_motor_speed',
            },
            paramsKeyMap: {
                LSPEED: 0,
				RSPEED: 1,
            },
            class: 'krc_LV1',
            isNotFor: ['KRC'],
            func: (sprite, script) => {
                var lspeed = script.getNumberValue('LSPEED', script);
                var rspeed = script.getNumberValue('RSPEED', script);
                var port = 3;               		
                lspeed = Math.min(100, lspeed);
                lspeed = Math.max(-100, lspeed);		
                rspeed = Math.min(100, rspeed);
                rspeed = Math.max(-100, rspeed);		
                
                if(!(LmotorSpeed === lspeed) || !(RmotorSpeed === rspeed))
                {
                    if (!script.isStart) 
                    {
                        if (!Entry.hw.sendQueue['SET']) {
                            Entry.hw.sendQueue['SET'] = {};
                        }
                        Entry.hw.sendQueue['SET'][parseInt(port)] = 
                        {
                            type: Entry.krc.sensorTypes.MOTOR,
                            data: [lspeed, rspeed],
                            time: new Date().getTime(),
                        };
                        LmotorSpeed = lspeed;
                        RmotorSpeed = rspeed;
                        script.isStart = true;  // 출력 시작 플래그 셋
                        script.timeFlag = 1;    // 시간플래그 셋
                        setTimeout(function() 
                        {
                            script.timeFlag = 0;
                        }, DelayTime );
                        return script;
                    }
                    else if (script.timeFlag === 1) 
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
                else {
                    return script.callReturn();
                }
            },
            syntax: { js: [], py: [] },
        },
		
		// 4. DC 모터 정지하기		
		'krc_motor_stop': 
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
                type: 'krc_motor_stop',
            },
            paramsKeyMap: {
                //PORT: 0,
            },
            class: 'krc_LV1',
            isNotFor: ['KRC'],
            func: (sprite, script) => {
                var port = 19;//script.getNumberValue('PORT', script);
				//port += 2;
				var lspeed = 0;
                var rspeed = 0;
                
                if(!(LmotorSpeed === 0) || !(RmotorSpeed === 0))
                {
                    if (!Entry.hw.sendQueue['SET']) {
                        Entry.hw.sendQueue['SET'] = {};
                    }
                    Entry.hw.sendQueue['SET'][parseInt(port)] = 
                    {
                        type: Entry.krc.sensorTypes.MOTOR,
                        data: [lspeed, rspeed],
                        time: new Date().getTime(),
                    };
                }

                LmotorSpeed = 0;
                RmotorSpeed = 0;
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },

        // 5.  서보 모터 각도 설정하기		
		'krc_set_servo': 
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
                        type: 'krc_servo_port_list',
                    },
                    {
                        type: 'number',
						params: ['0'],
                    },
                    {
                        type: 'number',
						params: ['100'],
                    },				
                    null,
                ],
                type: 'krc_set_servo',
            },
            paramsKeyMap: 
			{
				PORT: 0,
                ANGLE: 1,
                SPEED: 2,
            },
            class: 'krc_LV1',
            isNotFor: ['KRC'],
            func: (sprite, script) => {
                var port = script.getNumberValue('PORT', script);
                let angle = script.getNumberValue('ANGLE', script);
                let speed = script.getNumberValue('SPEED', script);
//				port += 2;
//				var mode = 1;
				
                angle = Math.min(180, angle);
                angle = Math.max(0, angle);
                speed = Math.min(100, speed);
                speed = Math.max(0, speed);
                speed *= speed*255;
                //angle += 1;
				
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][parseInt(port)] = 
				{
                    type: Entry.krc.sensorTypes.SERVO,
                    data: [angle,speed],
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
            syntax: { js: [], py: [] },
        },


        

        // 10. 디지털  출력
		'krc_digital_onoff': {
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
                        type: 'krc_digital_port_list',      
                    },
                    {
                        type: 'krc_digital_port_onoff_list',
                    },					
                    null,
                ],
                type: 'krc_digital_onoff',
            },
            paramsKeyMap: {   // 실제 블록의 로직인 func에서 key값으로 사용할 파라미터의 인덱스 번호
                PORT: 0,
				VALUE: 1,
            },
            class: 'krc_LV3',    // 블록을 묶는 그룹 이름. 이 값이 다르면 사이에 가로줄이 생깁니다
            isNotFor: ['KRC'],
           func: (sprite, script) => {
                var port = script.getNumberValue('PORT');
                const value = script.getNumberValue('VALUE');
				
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][parseInt(port)] = {
                    type: Entry.krc.sensorTypes.DIGITAL,    /// 출력 디바이스
                    data: value,
                    time: new Date().getTime(),
                };
                return script.callReturn();				
            },
            syntax: { js: [], py: [] },
        },

		
		// 11. 디지털입력		
        'krc_get_digital_value': {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,			
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            template: Lang.template.krc_get_digital_value,
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
                        type: 'krc_digital_port_list',
                    },
                ],
                type: 'krc_get_digital_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'krc_LV3',
            isNotFor: ['KRC'],
            func: (sprite, script) => {		
                var port2 = script.getNumberValue('PORT');
                const DIGITAL = Entry.hw.portData.DIGITAL;
				
                if (!Entry.hw.sendQueue['GET']) {
                    Entry.hw.sendQueue['GET'] = {};
                }
                Entry.hw.sendQueue['GET'][ 
                    Entry.krc.sensorTypes.DIGITAL
                ] = {
                    port: port2,
                    time: new Date().getTime(),
                };
		
				return DIGITAL[parseInt(port)];
            },
            syntax: { js: [], py: [] },
        },	
        
        // 12. 아날로그 읽기
        'krc_get_analog_value': {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,			
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: Lang.template.krc_get_analog_value,
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
                        type: 'krc_analog_port_list',
                    },				
                ],
                type: 'krc_get_analog_value',
            },
            paramsKeyMap: {
                PORT: 0,
//				TYPE: 1,
            },
            class: 'krc_LV3',
            isNotFor: ['KRC'],
            func: (sprite, script) => {
                var BtnIndex = script.getNumberValue('PORT');				
                const ANALOG = Entry.hw.portData.ANALOG;

                return ANALOG[parseInt(BtnIndex)];
            },
            syntax: { js: [], py: [] },
        },


        // 15. 초음파 센서 값		
        'krc_get_usonic_value': {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,			
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: Lang.template.krc_get_usonic_value,
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
                        type: 'krc_analog_port_list',
                    },	
                ],
                type: 'krc_get_usonic_value',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'krc_LV3',
            isNotFor: ['KRC'],
            func: (sprite, script) => {
                const BtnIndex = script.getNumberValue('PORT');				
                const ANALOG = Entry.hw.portData.ANALOG;

                return ((ANALOG[parseInt(BtnIndex)]*4)*3)/10;
            },
            syntax: { js: [], py: [] },
        },

        // 21. LCD글자출력
        'krc_set_lcd_string':
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
						params: ['0'],
                    },
                    {
                        type: 'number',
						params: ['0'],
                    },
                    {
                        type: 'text', 
                        params: ['Hello'],
                    },
                    null,
                ],
                type: 'krc_set_lcd_string',
            },
            paramsKeyMap: {
                COLUMN: 0,
                LINE: 1,
                STRING: 2,
            },
            class: 'krc_LV5',
            isNotFor: ['KRC'],
            func: (sprite, script) => {
                
         //       var sq = Entry.hw.sendQueue;
                var line2 = script.getValue('LINE', script);
                var column2 = script.getValue('COLUMN', script);
                var string = script.getValue('STRING', script);
                let text = [];

                if (!script.isStart) {
                    if (typeof string === 'string') {
                        for (let i = 0; i < string.length; i++) {
                            text[parseInt(i)] = Entry.memaker.toByte(string[parseInt(i)]);
                        }
                    } else if (typeof string === 'number') {
                        var NumToString = string.toString();
                        for (let i = 0; i < NumToString.length; i++) {
                            text[parseInt(i)] = Entry.memaker.toByte(NumToString[parseInt(i)]);
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
                        type: Entry.krc.sensorTypes.LCD_SET,
                        data: {
                            line: line2,
                            column: column2,
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
                        },
                        time: new Date().getTime(),
                    };

                    setTimeout(function() {
                        script.timeFlag = 0;
                    }, DelayTime);
                    return script;
                } else if (script.timeFlag === 1) {
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

       // . LCD 백라이트 
       'krc_set_lcd_backlight': {
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
                        type: 'krc_backlight_onoff_list',
                    },					
                    null,
                ],
                type: 'krc_set_lcd_backlight',
            },
            paramsKeyMap: {  
				VALUE: 0,
            },
            class: 'krc_LV5', 
            isNotFor: ['KRC'],
           func: (sprite, script) => {
                var value = script.getNumberValue('VALUE');
				
                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][1] = {
                    type: Entry.krc.sensorTypes.LCD_SET,    
                    data: [
                        value,
                        1,
                        1,
                    ],
                    time: new Date().getTime(),
                };
                return script.callReturn();				
            },
            syntax: { js: [], py: [] },
        },

        // 23. LCD 지우기
		'krc_set_lcd_clear': 
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
                type: 'krc_set_lcd_clear',
            },
            paramsKeyMap: {

            },
            class: 'krc_LV5',
            isNotFor: ['KRC'],
            func: (sprite, script) => {
                //var port = 0;

                if (!Entry.hw.sendQueue['SET']) {
                    Entry.hw.sendQueue['SET'] = {};
                }
                Entry.hw.sendQueue['SET'][4] = {
                    type: Entry.krc.sensorTypes.LCD_SET,
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
        'krc_get_analog_mapping': {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,			
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            template: Lang.template.krc_get_analog_mapping,
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
                type: 'krc_get_analog_mapping',
            },
            paramsKeyMap: {
				IDATA: 0,
                VALUE2: 1,
                VALUE3: 2,
                VALUE4: 3,
                VALUE5: 4,
            },
            class: 'krc_ANA',
            isNotFor: ['KRC'],
            func: (sprite, script) => {
                var result = script.getNumberValue('IDATA', script);				
                var value2 = script.getNumberValue('VALUE2', script);
                var value3 = script.getNumberValue('VALUE3', script);
                var value4 = script.getNumberValue('VALUE4', script);
                var value5 = script.getNumberValue('VALUE5', script);
                var swap;
				
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

module.exports = Entry.krc;
