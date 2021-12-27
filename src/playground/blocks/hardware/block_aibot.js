'use strict';

Entry.aibot = {
    id: ['4C.1','4C.2'],
    name: 'aibot',
    url: 'http://www.jinirobot.com',
    imageName: 'aibot.png',
    title: {
        ko: 'AIBOT',
        en: 'AIBOT',
    },
    array: {        
		SERVO_CONTROL: 0,
		HOME_CONTROL: 1,
		PORT_CONTROL: 2,
		PORT_OUT_CONTROL: 3,
		BUZZ_CONTROL: 4,
        SERVO_SPEED: 5,
        SET_SERVO_OFFSET_ZERO:6 ,
        SET_SERVO_HOME_POS: 7,
        AIDESK_CONTROL: 8,
        REMOTE_DEVICE: 9,
        CONNECT_DEVICE: 10,
    },

    delayTime: 50,
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
    
    setZero() {
        
    },
    BlockState: {},
    monitorTemplate: {
        width: 400,
        height: 600,
        listPorts: {
            A0: {
                name: 'D1',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            A1: {
                name: 'D2',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            A2: {
                name: 'D3',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            A3: {
                name: 'D4',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            A4: {
                name: 'A1',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            A5: {
                name: 'A2',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            A6: {
                name: 'A3',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            A7: {
                name: 'A4',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            A8: {
                name: 'RD1',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            A9: {
                name: 'RD2',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            A10: {
                name: 'RD3',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            A11: {
                name: 'RD4',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            A12: {
                name: 'RA1',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            A13: {
                name: 'RA2',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            A14: {
                name: 'RA3',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            A15: {
                name: 'RA4',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            
            AD0: {
                name: 'AID1',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            AD1: {
                name: 'AID2',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            AD2: {
                name: 'AID3',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            AD3: {
                name: 'AID4',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            AD4: {
                name: 'AID5',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            AD5: {
                name: 'AID6',
                type: 'input',
                pos: { x: 0, y: 0 },
            },

        },
        mode: 'both',
    },
};

Entry.aibot.setLanguage = function() {
    return {
        ko: {
            template: {                
                aibot_analog_read: '아날로그 %1번 입력값',
                aibot_digital_read: '디지털 %1번 입력값',
                aibot_set_port: '입출력 %1번을 %2(으)로 설정%3',
                aibot_set_port_out: '디지털출력 %1번 %2 %3',
                aibot_buzzer_play: '%1 효과음 재생하기 %2',
                aibot_set_servo_speed: '제어속도를 %1로 정하기 %2',
                aibot_set_servo_angle_single: '모듈 %1을 %2각도로 제어%3',                
                aibot_set_servo_angle_123: '모듈 1%1, 2%2, 3%3 각도로 제어%4',
                aibot_set_servo_angle_56: '모듈 5%1, 6%2 각도로 제어%3',                
                aibot_set_servo_angle_123456: '모듈 1%1, 2%2, 3%3, 4%4, 5%5, 6%6 각도로 제어%7',
                aibot_set_servo_go_home: '모든 모듈을 기본위치로 제어하기(원점복귀) %1',
                aibot_set_set_offset_zero: '모든 설정값 공장초기화 %1',
                //aibot_set_servo_home_pos_angle: '%1번 모듈의 기본위치 각도를 %2도로 설정하기%3',
                aibot_set_servo_home_pos_current: '%1번 모듈의 90도 위치를 현재의 위치로 정하기%2',
                aibot_set_remote_servo_speed: '원격의 제어속도를 %1로 정하기 %2',
                aibot_set_remote_servo_angle_single: '원격모듈 %1을 %2각도로 제어%3',                
                aibot_set_remote_servo_angle_123: '원격모듈 1%1, 2%2, 3%3 각도로 제어%4',
                aibot_set_remote_servo_angle_56: '원격모듈 5%1, 6%2 각도로 제어%3',
                aibot_set_remote_servo_angle_123456: '원격모듈 1%1, 2%2, 3%3, 4%4, 5%5, 6%6 각도로 제어%7',
                aibot_set_remote_servo_go_home: '원격의 모든 모듈을 기본위치로 제어하기(원점복귀) %1',
                //aibot_aidesk_read_string: 'AI Desk의 %1번 문자열 반환값 가져오기 %2',  
                aibot_aidesk_read_number: 'AI Desk의 %1번 값%2', 
                aibot_aidesk_control_basic: 'AI Desk의 %1번 기능 시작하기(변수1:%2, 변수2:%3, 변수3:%4, 변수4:%5)%6',
                aibot_aidesk_func_stop: 'AI Desk의 %1번 기능 정지하기%2',
                aibot_set_remote_device: '원격 디바이스 설정%1',

                remote1: '원격1',
                remote2: '원격2',
                remote3: '원격3',
                remote4: '원격4',
                digitalInput: '디지털입력',
                digitalOutput: '디지털출력',
                analogInput: '아날로그입력', 
                on: '켜기',
                off: '끄기',   
            },
        },
        en: {
            template: {
                aibot_analog_read: '%1 read analog',
                aibot_digital_read: '%1 read digital',
                aibot_set_port: 'PORT %1 SET TO %2 %3',
                aibot_set_port_out: 'PORT %1 OUT %2 %3',
                aibot_buzzer_play: '%1 play melody %2',
                aibot_set_servo_speed: 'Control Speed %1 %2',
                aibot_set_servo_angle_single: '%1 SERVO %2 DEGREE %3',
                aibot_set_servo_angle_123: 'Module control degree 1%1, 2%2 3%3 %4',     
                aibot_set_servo_angle_56: 'Module control degree 5%1, 6%2 %3',      
                aibot_set_servo_angle_123456: 'Module control degree 1%1, 2%2, 3%3, 4%4, 5%5, 6%6 %7',        
                aibot_set_servo_go_home: 'Module Home Position %1',
                aibot_set_set_offset_zero: 'Factory reset %1',
                //aibot_set_servo_home_pos_angle: 'Servo %1 Set Home Position to %2degree %3',
                aibot_set_servo_home_pos_current: 'Servo %1 Set Home Position to current %2',
                aibot_set_remote_servo_speed: 'Remote Control Speed %1 %2',
                aibot_set_remote_servo_angle_single: 'Remote %1 Module %2 DEGREE %3',
                aibot_set_remote_servo_angle_123: 'Remote Module control degree 1%1, 2%2 3%3 %4',     
                aibot_set_remote_servo_angle_56: 'Remote Module control degree 5%1, 6%2 %3', 
                aibot_set_remote_servo_angle_123456: 'Remote Module control degree 1%1, 2%2, 3%3, 4%4, 5%5, 6%6 %7', 
                aibot_set_remote_servo_go_home: 'Remote Module Home Position %1',
                //aibot_aidesk_read_string: 'Read String %1 of AIDesk %2',  
                aibot_aidesk_read_number: 'Read Number %1 of AIDesk %2',  
                aibot_aidesk_control_basic: 'Start Function%1 of AI Desk(Var1:%2, Var2:%3, Var3:%4, Var4:%5)%6',
                aibot_aidesk_func_stop: 'Stop Function%1 of AI Desk%2',
                aibot_set_remote_device: 'Set Remote Device%1',
            
                remote1: 'REMOTE1',
                remote2: 'REMOTE2',
                remote3: 'REMOTE3',
                remote4: 'REMOTE4',                
                digitalInput: 'DIGITAL INPUT',
                digitalOutput: 'DIGITAL OUTPUT',
                analogInput: 'ANALOG INPUT',                      
                on: 'ON',
                off: 'OFF', 
            }
        },
    };
};

Entry.aibot.blockMenuBlocks = [  
    'aibot_analog_read',    
    'aibot_digital_read',
    'aibot_set_port',
    'aibot_set_port_out',
    'aibot_buzzer_play',
    'aibot_set_servo_speed',
    'aibot_set_servo_angle_single',    
    'aibot_set_servo_angle_123',
    'aibot_set_servo_angle_56',
    'aibot_set_servo_angle_123456',
    'aibot_set_servo_go_home',
    //'aibot_set_servo_home_pos_angle',
    'aibot_set_servo_home_pos_current',    
    'aibot_set_set_offset_zero',
    'aibot_set_remote_servo_speed',
    'aibot_set_remote_servo_angle_single',
    'aibot_set_remote_servo_angle_123',
    'aibot_set_remote_servo_angle_56',
    'aibot_set_remote_servo_angle_123456',
    'aibot_set_remote_servo_go_home',
    'aibot_set_remote_device',
    //'aibot_aidesk_read_string',
    'aibot_aidesk_read_number',
    'aibot_aidesk_control_basic',
    'aibot_aidesk_func_stop',
];

Entry.aibot.getBlocks = function() {
    return {   
        ///======================================================================================================================
        ///======================================================================================================================
        ///======================================================================================================================
        aibot_analog_read: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', '0'],
                        ['2', '1'],
                        ['3', '2'],
                        ['4', '3'],
                        [Lang.template.remote1, '4'],
                        [Lang.template.remote2, '5'],
                        [Lang.template.remote3, '6'],
                        [Lang.template.remote4, '7'],
                    ],
                    value: '0',   
                    fontSize: 11,
                },
            ],
            events: {},
            def: {
                params: [],
                type: 'aibot_analog_read',
            },
            paramsKeyMap: {                    
                VALUE: 0,
            },
            class: 'aibot',
            isNotFor: ['aibot'],
            func: function(sprite, script) { 
                var value = script.getNumberValue('VALUE',script);  
                if(value<4){
                    value = value + 4;
                    var result = Entry.hw.portData.SENSOR[value];
                }    
                else if(value>=4){
                    value = value + 8;
                    var result = Entry.hw.portData.SENSOR[value];
                }              
                return result;
            },
        },
        aibot_digital_read: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', '0'],
                        ['2', '1'],
                        ['3', '2'],
                        ['4', '3'],
                        [Lang.template.remote1, '4'],
                        [Lang.template.remote2, '5'],
                        [Lang.template.remote3, '6'],
                        [Lang.template.remote4, '7'],
                    ],
                    value: '0',   
                    fontSize: 11,
                },
            ],
            events: {},
            def: {
                params: [],
                type: 'aibot_digital_read',
            },
            paramsKeyMap: {                    
                VALUE: 0,
            },
            class: 'aibot',
            isNotFor: ['aibot'],
            func: function(sprite, script) { 
                var value = script.getNumberValue('VALUE',script); 
                if(value<4){
                    value = value;
                    var result = Entry.hw.portData.SENSOR[value];
                }  
                else if(value>=4){
                    value = value + 4;
                    var result = Entry.hw.portData.SENSOR[value];
                }  
                return result;
            },
        },
        aibot_set_port: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [                        
                        ['1', '0'],
                        ['2', '1'],
                        ['3', '2'],
                        ['4', '3'],
                        [Lang.template.remote1, '4'],
                        [Lang.template.remote2, '5'],
                        [Lang.template.remote3, '6'],
                        [Lang.template.remote4, '7'],
                    ],
                    value: '0',
                    fontSize: 11,
                },
                {
                    type: 'Dropdown',
                    options: [                        
                        [Lang.template.digitalInput, '0'],
                        [Lang.template.digitalOutput, '1'],
                        [Lang.template.analogInput, '2'],
                    ],
                    value: '0',
                    fontSize: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [],
                type: 'aibot_set_port',    
            },
            paramsKeyMap: {                    
                PORT: 0,
                MODE: 1,
            },
            class: 'aibot',
            isNotFor: ['aibot'],
            func: function(sprite, script) {
                if(!script.isStart)
                {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.aibot.removeTimeout(timer);
                    }, Entry.aibot.delayTime);
                    Entry.aibot.timeouts.push(timer);
                    return script;
                }
                else if(script.timeFlag == 1)
                {
                    return script;
                }
                else
                {
                    var sq = Entry.hw.sendQueue;
                    var portVal = script.getNumberValue('PORT', script);
                    var modeVal = script.getNumberValue('MODE', script);
                    var remote = 1;
                    if(portVal>=4){
                        remote = 2;
                        portVal=portVal-4;
                    }
                    sq['SEND'] = {};
                    sq['SEND'][Entry.aibot.array.PORT_CONTROL] = {
                        remote: remote,
                        port: portVal,
                        mode: modeVal,
                        Time: new Date().getTime(),
                    };
                    return script.callReturn(); 
                }
            },
        },
        aibot_set_port_out: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [                        
                        ['1', '0'],
                        ['2', '1'],
                        ['3', '2'],
                        ['4', '3'],
                        [Lang.template.remote1, '4'],
                        [Lang.template.remote2, '5'],
                        [Lang.template.remote3, '6'],
                        [Lang.template.remote4, '7'],
                    ],
                    value: '0',
                    fontSize: 11,
                },
                {
                    type: 'Dropdown',
                    options: [                        
                        [Lang.template.on, '1'],
                        [Lang.template.off, '0'],
                    ],
                    value: '1',
                    fontSize: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [],
                type: 'aibot_set_port_out',    
            },
            paramsKeyMap: {                    
                PORT: 0,
                VAL: 1,
            },
            class: 'aibot',
            isNotFor: ['aibot'],
            func: function(sprite, script) {
                if(!script.isStart)
                {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.aibot.removeTimeout(timer);
                    }, Entry.aibot.delayTime);
                    Entry.aibot.timeouts.push(timer);
                    return script;
                }
                else if(script.timeFlag == 1)
                {
                    return script;
                }
                else
                {
                    var sq = Entry.hw.sendQueue;
                    var portVal = script.getNumberValue('PORT', script);
                    var Val = script.getNumberValue('VAL', script);
                    var remote = 1;
                    if(portVal>=4){
                        remote = 2;
                        portVal=portVal-4;
                    }
                    sq['SEND'] = {};
                    sq['SEND'][Entry.aibot.array.PORT_OUT_CONTROL] = {
                        remote: remote,
                        port: portVal,
                        val: Val,
                        Time: new Date().getTime(),
                    };
                    return script.callReturn(); 
                }
            },
        },
        aibot_buzzer_play: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [                        
                        ['1', '0'],
                        ['2', '1'],
                        ['3', '2'],
                        ['4', '3'],
                        ['5', '4'],
                    ],
                    value: '0',
                    fontSize: 11,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [],
                type: 'aibot_buzzer_play',    
            },
            paramsKeyMap: {                    
                MELODY: 0,
            },
            class: 'aibot',
            isNotFor: ['aibot'],
            func: function(sprite, script) {
                if(!script.isStart)
                {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.aibot.removeTimeout(timer);
                    }, Entry.aibot.delayTime);
                    Entry.aibot.timeouts.push(timer);
                    return script;
                }
                else if(script.timeFlag == 1)
                {
                    return script;
                }
                else
                {
                    var sq = Entry.hw.sendQueue;
                    var Melody = script.getNumberValue('MELODY', script);
                    var Remote = 1;
                    sq['SEND'] = {};
                    sq['SEND'][Entry.aibot.array.BUZZ_CONTROL] = {
                        remote: Remote,
                        melody: Melody,
                        Time: new Date().getTime(),
                    };
                    return script.callReturn(); 
                }
            },
        },
        aibot_set_servo_speed: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [                        
                        ['1', '1'],
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['5', '5'],
                    ],
                    value: '1',
                    fontSize: 12,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [],
                type: 'aibot_set_servo_speed',    
            },
            paramsKeyMap: {                    
                SPEED: 0,
            },
            class: 'aibot',
            isNotFor: ['aibot'],
            func: function(sprite, script) {
                if(!script.isStart)
                {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.aibot.removeTimeout(timer);
                    }, Entry.aibot.delayTime);
                    Entry.aibot.timeouts.push(timer);
                    return script;
                }
                else if(script.timeFlag == 1)
                {
                    return script;
                }
                else
                {
                    var sq = Entry.hw.sendQueue;
                    var Speed = script.getNumberValue('SPEED', script);
                    var Remote = 1;
                    sq['SEND'] = {};
                    sq['SEND'][Entry.aibot.array.SERVO_SPEED] = {
                        remote: Remote,
                        speed: Speed,
                        Time: new Date().getTime(),
                    };
                    return script.callReturn(); 
                }
            },
        },
        aibot_set_servo_angle_single: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
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
                    value: '1',
                    fontSize: 12,
                },   
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [1,90],
                type: 'aibot_set_servo_angle_single',    
            },
            paramsKeyMap: {                    
                SERVO: 0,
                ANGLE: 1,
            },
            class: 'aibot',
            isNotFor: ['aibot'],
            func: function(sprite, script) {
                if(!script.isStart)
                {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.aibot.removeTimeout(timer);
                    }, Entry.aibot.delayTime);
                    Entry.aibot.timeouts.push(timer);
                    return script;
                }
                else if(script.timeFlag == 1)
                {
                    return script;
                }
                else
                {
                    var sq = Entry.hw.sendQueue;
                    var Servo1=0;var Servo2=0;var Servo3=0;
                    var Servo4=0;var Servo5=0;var Servo6=0;
                    var Servo = script.getNumberValue('SERVO', script);
                    var Angle = script.getNumberValue('ANGLE', script);
                                        
                    if(Angle<0)Angle = 0;if(Angle>180)Angle = 180;Angle = Angle*10 + 600;                    

                    if(Servo==1)Servo1 = Angle;
                    else if(Servo==2)Servo2 = Angle;
                    else if(Servo==3)Servo3 = Angle;
                    else if(Servo==4)Servo4 = Angle;
                    else if(Servo==5)Servo5 = Angle;
                    else if(Servo==6)Servo6 = Angle;                   

                    var Remote = 1;
                    sq['SEND'] = {};
                    sq['SEND'][Entry.aibot.array.SERVO_CONTROL] = {
                        remote: Remote,
                        servo1: Servo1,
                        servo2: Servo2,
                        servo3: Servo3,
                        servo4: Servo4,
                        servo5: Servo5,
                        servo6: Servo6,                        
                        Time: new Date().getTime(),
                    };
                    return script.callReturn(); 
                }
            },
        },
        aibot_set_remote_servo_angle_123456: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [                
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: ['90','90','90','90','90','90'],
                type: 'aibot_set_remote_servo_angle_123456',    
            },
            paramsKeyMap: {                    
                SERVO1: 0,
                SERVO2: 1,
                SERVO3: 2,
                SERVO4: 3,
                SERVO5: 4,
                SERVO6: 5,
            },
            class: 'aibot_remote',
            isNotFor: ['aibot'],
            func: function(sprite, script) {
                if(!script.isStart)
                {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.aibot.removeTimeout(timer);
                    }, Entry.aibot.delayTime);
                    Entry.aibot.timeouts.push(timer);
                    return script;
                }
                else if(script.timeFlag == 1)
                {
                    return script;
                }
                else
                {
                    var sq = Entry.hw.sendQueue;
                    var Servo1=script.getNumberValue('SERVO1', script);
                    var Servo2=script.getNumberValue('SERVO2', script);
                    var Servo3=script.getNumberValue('SERVO3', script);
                    var Servo4=script.getNumberValue('SERVO4', script);
                    var Servo5=script.getNumberValue('SERVO5', script);
                    var Servo6=script.getNumberValue('SERVO6', script);
                    if(Servo1<0)Servo1 = 0;if(Servo1>180)Servo1 = 180;Servo1 = Servo1*10 + 600;  
                    if(Servo2<0)Servo2 = 0;if(Servo2>180)Servo2 = 180;Servo2 = Servo2*10 + 600;  
                    if(Servo3<0)Servo3 = 0;if(Servo3>180)Servo3 = 180;Servo3 = Servo3*10 + 600;  
                    if(Servo4<0)Servo4 = 0;if(Servo4>180)Servo4 = 180;Servo4 = Servo4*10 + 600;  
                    if(Servo5<0)Servo5 = 0;if(Servo5>180)Servo5 = 180;Servo5 = Servo5*10 + 600;  
                    if(Servo6<0)Servo6 = 0;if(Servo6>180)Servo6 = 180;Servo6 = Servo6*10 + 600;  

                    var Remote = 2;
                    sq['SEND'] = {};
                    sq['SEND'][Entry.aibot.array.SERVO_CONTROL] = {
                        remote: Remote,
                        servo1: Servo1,
                        servo2: Servo2,
                        servo3: Servo3,
                        servo4: Servo4,
                        servo5: Servo5,
                        servo6: Servo6,                        
                        Time: new Date().getTime(),
                    };
                    return script.callReturn(); 
                }
            },
        },
        aibot_set_servo_angle_123456: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [                
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: ['90','90','90','90','90','90'],
                type: 'aibot_set_servo_angle_123456',    
            },
            paramsKeyMap: {                    
                SERVO1: 0,
                SERVO2: 1,
                SERVO3: 2,
                SERVO4: 3,
                SERVO5: 4,
                SERVO6: 5,
            },
            class: 'aibot',
            isNotFor: ['aibot'],
            func: function(sprite, script) {
                if(!script.isStart)
                {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.aibot.removeTimeout(timer);
                    }, Entry.aibot.delayTime);
                    Entry.aibot.timeouts.push(timer);
                    return script;
                }
                else if(script.timeFlag == 1)
                {
                    return script;
                }
                else
                {
                    var sq = Entry.hw.sendQueue;
                    var Servo1=script.getNumberValue('SERVO1', script);
                    var Servo2=script.getNumberValue('SERVO2', script);
                    var Servo3=script.getNumberValue('SERVO3', script);
                    var Servo4=script.getNumberValue('SERVO4', script);
                    var Servo5=script.getNumberValue('SERVO5', script);
                    var Servo6=script.getNumberValue('SERVO6', script);
                    if(Servo1<0)Servo1 = 0;if(Servo1>180)Servo1 = 180;Servo1 = Servo1*10 + 600;  
                    if(Servo2<0)Servo2 = 0;if(Servo2>180)Servo2 = 180;Servo2 = Servo2*10 + 600;  
                    if(Servo3<0)Servo3 = 0;if(Servo3>180)Servo3 = 180;Servo3 = Servo3*10 + 600;  
                    if(Servo4<0)Servo4 = 0;if(Servo4>180)Servo4 = 180;Servo4 = Servo4*10 + 600;  
                    if(Servo5<0)Servo5 = 0;if(Servo5>180)Servo5 = 180;Servo5 = Servo5*10 + 600;  
                    if(Servo6<0)Servo6 = 0;if(Servo6>180)Servo6 = 180;Servo6 = Servo6*10 + 600;  

                    var Remote = 1;
                    sq['SEND'] = {};
                    sq['SEND'][Entry.aibot.array.SERVO_CONTROL] = {
                        remote: Remote,
                        servo1: Servo1,
                        servo2: Servo2,
                        servo3: Servo3,
                        servo4: Servo4,
                        servo5: Servo5,
                        servo6: Servo6,                        
                        Time: new Date().getTime(),
                    };
                    return script.callReturn(); 
                }
            },
        },
        aibot_set_servo_angle_123: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [                
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: ['90','90','90'],
                type: 'aibot_set_servo_angle_123',    
            },
            paramsKeyMap: {                    
                SERVO1: 0,
                SERVO2: 1,
                SERVO3: 2,
            },
            class: 'aibot',
            isNotFor: ['aibot'],
            func: function(sprite, script) {
                if(!script.isStart)
                {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.aibot.removeTimeout(timer);
                    }, Entry.aibot.delayTime);
                    Entry.aibot.timeouts.push(timer);
                    return script;
                }
                else if(script.timeFlag == 1)
                {
                    return script;
                }
                else
                {
                    var sq = Entry.hw.sendQueue;
                    var Servo1=script.getNumberValue('SERVO1', script);
                    var Servo2=script.getNumberValue('SERVO2', script);
                    var Servo3=script.getNumberValue('SERVO3', script);
                    var Servo4=0;var Servo5=0;var Servo6=0;
                    if(Servo1<0)Servo1 = 0;if(Servo1>180)Servo1 = 180;Servo1 = Servo1*10 + 600;  
                    if(Servo2<0)Servo2 = 0;if(Servo2>180)Servo2 = 180;Servo2 = Servo2*10 + 600;  
                    if(Servo3<0)Servo3 = 0;if(Servo3>180)Servo3 = 180;Servo3 = Servo3*10 + 600;  

                    var Remote = 1;
                    sq['SEND'] = {};
                    sq['SEND'][Entry.aibot.array.SERVO_CONTROL] = {
                        remote: Remote,
                        servo1: Servo1,
                        servo2: Servo2,
                        servo3: Servo3,
                        servo4: Servo4,
                        servo5: Servo5,
                        servo6: Servo6,                        
                        Time: new Date().getTime(),
                    };
                    return script.callReturn(); 
                }
            },
        },
        aibot_set_servo_angle_56: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [     
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: ['90','90'],
                type: 'aibot_set_servo_angle_56',    
            },
            paramsKeyMap: {                    
                SERVO5: 0,
                SERVO6: 1,
            },
            class: 'aibot',
            isNotFor: ['aibot'],
            func: function(sprite, script) {
                if(!script.isStart)
                {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.aibot.removeTimeout(timer);
                    }, Entry.aibot.delayTime);
                    Entry.aibot.timeouts.push(timer);
                    return script;
                }
                else if(script.timeFlag == 1)
                {
                    return script;
                }
                else
                {
                    var sq = Entry.hw.sendQueue;
                    var Servo1=0;var Servo2=0;var Servo3=0;
                    var Servo4=0;
                    var Servo5=script.getNumberValue('SERVO5', script);
                    var Servo6=script.getNumberValue('SERVO6', script);
                    if(Servo5<0)Servo5 = 0;if(Servo5>180)Servo5 = 180;Servo5 = Servo5*10 + 600;  
                    if(Servo6<0)Servo6 = 0;if(Servo6>180)Servo6 = 180;Servo6 = Servo6*10 + 600;  
                    
                    var Remote = 1;
                    sq['SEND'] = {};
                    sq['SEND'][Entry.aibot.array.SERVO_CONTROL] = {
                        remote: Remote,
                        servo1: Servo1,
                        servo2: Servo2,
                        servo3: Servo3,
                        servo4: Servo4,
                        servo5: Servo5,
                        servo6: Servo6,                        
                        Time: new Date().getTime(),
                    };
                    return script.callReturn(); 
                }
            },
        },
        aibot_set_remote_servo_speed: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [                        
                        ['1', '1'],
                        ['2', '2'],
                        ['3', '3'],
                        ['4', '4'],
                        ['5', '5'],
                    ],
                    value: '1',
                    fontSize: 12,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [],
                type: 'aibot_set_remote_servo_speed',    
            },
            paramsKeyMap: {                    
                SPEED: 0,
            },
            class: 'aibot_remote',
            isNotFor: ['aibot'],
            func: function(sprite, script) {
                if(!script.isStart)
                {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.aibot.removeTimeout(timer);
                    }, Entry.aibot.delayTime);
                    Entry.aibot.timeouts.push(timer);
                    return script;
                }
                else if(script.timeFlag == 1)
                {
                    return script;
                }
                else
                {
                    var sq = Entry.hw.sendQueue;
                    var Speed = script.getNumberValue('SPEED', script);
                    var Remote = 2;
                    sq['SEND'] = {};
                    sq['SEND'][Entry.aibot.array.SERVO_SPEED] = {
                        remote: Remote,
                        speed: Speed,
                        Time: new Date().getTime(),
                    };
                    return script.callReturn(); 
                }
            },
        },
        aibot_set_remote_servo_angle_single: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
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
                    value: '1',
                    fontSize: 12,
                },   
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [1,90],
                type: 'aibot_set_remote_servo_angle_single',    
            },
            paramsKeyMap: {                    
                SERVO: 0,
                ANGLE: 1,
            },
            class: 'aibot_remote',
            isNotFor: ['aibot'],
            func: function(sprite, script) {
                if(!script.isStart)
                {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.aibot.removeTimeout(timer);
                    }, Entry.aibot.delayTime);
                    Entry.aibot.timeouts.push(timer);
                    return script;
                }
                else if(script.timeFlag == 1)
                {
                    return script;
                }
                else
                {
                    var sq = Entry.hw.sendQueue;
                    var Servo1=0,Servo2=0,Servo3=0;
                    var Servo4=0,Servo5=0,Servo6=0;
                    var Servo = script.getNumberValue('SERVO', script);
                    var Angle = script.getNumberValue('ANGLE', script);
                                        
                    if(Angle<0)Angle = 0;if(Angle>180)Angle = 180;Angle = Angle*10 + 600;                    

                    if(Servo==1)Servo1 = Angle;
                    else if(Servo==2)Servo2 = Angle;
                    else if(Servo==3)Servo3 = Angle;
                    else if(Servo==4)Servo4 = Angle;
                    else if(Servo==5)Servo5 = Angle;
                    else if(Servo==6)Servo6 = Angle;                   

                    var Remote = 2;
                    sq['SEND'] = {};
                    sq['SEND'][Entry.aibot.array.SERVO_CONTROL] = {
                        remote: Remote,
                        servo1: Servo1,
                        servo2: Servo2,
                        servo3: Servo3,
                        servo4: Servo4,
                        servo5: Servo5,
                        servo6: Servo6,                        
                        Time: new Date().getTime(),
                    };
                    return script.callReturn(); 
                }
            },
        },
        aibot_set_remote_servo_angle_123: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [                
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: ['90','90','90'],
                type: 'aibot_set_remote_servo_angle_123',    
            },
            paramsKeyMap: {                    
                SERVO1: 0,
                SERVO2: 1,
                SERVO3: 2,
            },
            class: 'aibot_remote',
            isNotFor: ['aibot'],
            func: function(sprite, script) {
                if(!script.isStart)
                {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.aibot.removeTimeout(timer);
                    }, Entry.aibot.delayTime);
                    Entry.aibot.timeouts.push(timer);
                    return script;
                }
                else if(script.timeFlag == 1)
                {
                    return script;
                }
                else
                {
                    var sq = Entry.hw.sendQueue;
                    var Servo1=script.getNumberValue('SERVO1', script);
                    var Servo2=script.getNumberValue('SERVO2', script);
                    var Servo3=script.getNumberValue('SERVO3', script);
                    var Servo4=0;var Servo5=0;var Servo6=0;
                    if(Servo1<0)Servo1 = 0;if(Servo1>180)Servo1 = 180;Servo1 = Servo1*10 + 600;  
                    if(Servo2<0)Servo2 = 0;if(Servo2>180)Servo2 = 180;Servo2 = Servo2*10 + 600;  
                    if(Servo3<0)Servo3 = 0;if(Servo3>180)Servo3 = 180;Servo3 = Servo3*10 + 600;  

                    var Remote = 2;
                    sq['SEND'] = {};
                    sq['SEND'][Entry.aibot.array.SERVO_CONTROL] = {
                        remote: Remote,
                        servo1: Servo1,
                        servo2: Servo2,
                        servo3: Servo3,
                        servo4: Servo4,
                        servo5: Servo5,
                        servo6: Servo6,                        
                        Time: new Date().getTime(),
                    };
                    return script.callReturn(); 
                }
            },
        },
        aibot_set_remote_servo_angle_56: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [     
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: ['90','90'],
                type: 'aibot_set_remote_servo_angle_56',    
            },
            paramsKeyMap: {                    
                SERVO5: 0,
                SERVO6: 1,
            },
            class: 'aibot_remote',
            isNotFor: ['aibot'],
            func: function(sprite, script) {
                if(!script.isStart)
                {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.aibot.removeTimeout(timer);
                    }, Entry.aibot.delayTime);
                    Entry.aibot.timeouts.push(timer);
                    return script;
                }
                else if(script.timeFlag == 1)
                {
                    return script;
                }
                else
                {
                    var sq = Entry.hw.sendQueue;
                    var Servo1=0;var Servo2=0;var Servo3=0;
                    var Servo4=0;
                    var Servo5=script.getNumberValue('SERVO5', script);
                    var Servo6=script.getNumberValue('SERVO6', script);
                    if(Servo5<0)Servo5 = 0;if(Servo5>180)Servo5 = 180;Servo5 = Servo5*10 + 600;  
                    if(Servo6<0)Servo6 = 0;if(Servo6>180)Servo6 = 180;Servo6 = Servo6*10 + 600;  
                    
                    var Remote = 2;
                    sq['SEND'] = {};
                    sq['SEND'][Entry.aibot.array.SERVO_CONTROL] = {
                        remote: Remote,
                        servo1: Servo1,
                        servo2: Servo2,
                        servo3: Servo3,
                        servo4: Servo4,
                        servo5: Servo5,
                        servo6: Servo6,                        
                        Time: new Date().getTime(),
                    };
                    return script.callReturn(); 
                }
            },
        },
        aibot_set_servo_go_home: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
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
                params: [],
                type: 'aibot_set_servo_go_home',    
            },
            paramsKeyMap: {
            },
            class: 'aibot',
            isNotFor: ['aibot'],
            func: function(sprite, script) {
                if(!script.isStart)
                {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.aibot.removeTimeout(timer);
                    }, Entry.aibot.delayTime);
                    Entry.aibot.timeouts.push(timer);
                    return script;
                }
                else if(script.timeFlag == 1)
                {
                    return script;
                }
                else
                {      
                    var sq = Entry.hw.sendQueue;
                    var Remote = 1;
                    sq['SEND'] = {};
                    sq['SEND'][Entry.aibot.array.HOME_CONTROL] = {
                        remote: Remote,                      
                        Time: new Date().getTime(),
                    };
                    return script.callReturn(); 
                }
            },
        },
        aibot_set_remote_servo_go_home: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
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
                params: [],
                type: 'aibot_set_remote_servo_go_home',    
            },
            paramsKeyMap: {
            },
            class: 'aibot_remote',
            isNotFor: ['aibot'],
            func: function(sprite, script) {
                if(!script.isStart)
                {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.aibot.removeTimeout(timer);
                    }, Entry.aibot.delayTime);
                    Entry.aibot.timeouts.push(timer);
                    return script;
                }
                else if(script.timeFlag == 1)
                {
                    return script;
                }
                else
                {      
                    var sq = Entry.hw.sendQueue;
                    var Remote = 2;
                    sq['SEND'] = {};
                    sq['SEND'][Entry.aibot.array.HOME_CONTROL] = {
                        remote: Remote,                      
                        Time: new Date().getTime(),
                    };
                    return script.callReturn(); 
                }
            },
        },
        aibot_set_servo_home_pos_angle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
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
                    value: '1',
                    fontSize: 12,
                },   
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [1,90],
                type: 'aibot_set_servo_home_pos_angle',    
            },
            paramsKeyMap: {                    
                SERVO: 0,
                ANGLE: 1,
            },
            class: 'aibot',
            isNotFor: ['aibot'],
            func: function(sprite, script) {
                if(!script.isStart)
                {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.aibot.removeTimeout(timer);
                    }, Entry.aibot.delayTime);
                    Entry.aibot.timeouts.push(timer);
                    return script;
                }
                else if(script.timeFlag == 1)
                {
                    return script;
                }
                else
                {
                    var sq = Entry.hw.sendQueue;
                    var Servo1=0;var Servo2=0;var Servo3=0;
                    var Servo4=0;var Servo5=0;var Servo6=0;
                    var Servo = script.getNumberValue('SERVO', script);
                    var Angle = script.getNumberValue('ANGLE', script);
                                        
                    if(Angle<0)Angle = 0;if(Angle>180)Angle = 180;
                    if(Servo==1 || Servo==5 )Angle = 90+Angle;
                    
                    Angle = Angle*10 + 600;                    

                    if(Servo==1)Servo1 = Angle;
                    else if(Servo==2)Servo2 = Angle;
                    else if(Servo==3)Servo3 = Angle;
                    else if(Servo==4)Servo4 = Angle;
                    else if(Servo==5)Servo5 = Angle;
                    else if(Servo==6)Servo6 = Angle;                   

                    var Remote = 3;
                    sq['SEND'] = {};
                    sq['SEND'][Entry.aibot.array.SET_SERVO_HOME_POS] = {
                        remote: Remote,
                        servo1: Servo1,
                        servo2: Servo2,
                        servo3: Servo3,
                        servo4: Servo4,
                        servo5: Servo5,
                        servo6: Servo6,                        
                        Time: new Date().getTime(),
                    };
                    return script.callReturn(); 
                }
            },
        },
        aibot_set_servo_home_pos_current: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
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
                    value: '1',
                    fontSize: 12,
                },   
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [1],
                type: 'aibot_set_servo_home_pos_current',    
            },
            paramsKeyMap: {                    
                SERVO: 0,
            },
            class: 'aibot',
            isNotFor: ['aibot'],
            func: function(sprite, script) {
                if(!script.isStart)
                {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.aibot.removeTimeout(timer);
                    }, Entry.aibot.delayTime);
                    Entry.aibot.timeouts.push(timer);
                    return script;
                }
                else if(script.timeFlag == 1)
                {
                    return script;
                }
                else
                {
                    var sq = Entry.hw.sendQueue;
                    var Servo1=0;var Servo2=0;var Servo3=0;
                    var Servo4=0;var Servo5=0;var Servo6=0;
                    var Servo = script.getNumberValue('SERVO', script);               

                    if(Servo==1)Servo1 = 1;
                    else if(Servo==2)Servo2 = 1;
                    else if(Servo==3)Servo3 = 1;
                    else if(Servo==4)Servo4 = 1;
                    else if(Servo==5)Servo5 = 1;
                    else if(Servo==6)Servo6 = 1;                   

                    var Remote = 4;
                    sq['SEND'] = {};
                    sq['SEND'][Entry.aibot.array.SET_SERVO_HOME_POS] = {
                        remote: Remote,
                        servo1: Servo1,
                        servo2: Servo2,
                        servo3: Servo3,
                        servo4: Servo4,
                        servo5: Servo5,
                        servo6: Servo6,                        
                        Time: new Date().getTime(),
                    };
                    return script.callReturn(); 
                }
            },
        },
        aibot_set_set_offset_zero: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
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
                params: [],
                type: 'aibot_set_set_offset_zero',    
            },
            paramsKeyMap: {
            },
            class: 'aibot',
            isNotFor: ['aibot'],
            func: function(sprite, script) {
                if(!script.isStart)
                {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.aibot.removeTimeout(timer);
                    }, Entry.aibot.delayTime);
                    Entry.aibot.timeouts.push(timer);
                    return script;
                }
                else if(script.timeFlag == 1)
                {
                    return script;
                }
                else
                {      
                    var sq = Entry.hw.sendQueue;
                    var Remote = 2;
                    sq['SEND'] = {};
                    sq['SEND'][Entry.aibot.array.SET_SERVO_OFFSET_ZERO] = {
                        remote: Remote,                      
                        Time: new Date().getTime(),
                    };
                    return script.callReturn(); 
                }
            },
        },
        aibot_aidesk_read_string: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
            ],
            events: {},
            def: {
                params: ['1'],
                type: 'aibot_aidesk_read_string',
            },
            paramsKeyMap: {                    
                VALUE: 0,
            },
            class: 'aibot_aidesk',
            isNotFor: ['aibot'],
            func: function(sprite, script) { 
                var value = script.getNumberValue('VALUE',script);  
                result = Entry.hw.portData.SENSOR[19];
                return result;
            },
        },
        aibot_aidesk_read_number: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
            ],
            events: {},
            def: {
                params: ['1'],
                type: 'aibot_aidesk_read_number',
            },
            paramsKeyMap: {                    
                VALUE: 0,
            },
            class: 'aibot_aidesk',
            isNotFor: ['aibot'],
            func: function(sprite, script) { 
                var value = script.getNumberValue('VALUE',script); 
                if(value>6)value=6; 
                if(value<1)value=1; 
                var result = Entry.hw.portData.AIDESK[value-1];
                return result;
            },
        },
        aibot_aidesk_control_basic: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [                
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: ['1','0','0','0','0'],
                type: 'aibot_aidesk_control_basic',    
            },
            paramsKeyMap: {                    
                FUNC: 0,
                VAR1: 1,
                VAR2: 2,
                VAR3: 3,
                VAR4: 4,
            },
            class: 'aibot_aidesk',
            isNotFor: ['aibot'],
            func: function(sprite, script) {
                if(!script.isStart)
                {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.aibot.removeTimeout(timer);
                    }, Entry.aibot.delayTime);
                    Entry.aibot.timeouts.push(timer);
                    return script;
                }
                else if(script.timeFlag == 1)
                {
                    return script;
                }
                else
                {
                    var sq = Entry.hw.sendQueue;
                    var Func=script.getNumberValue('FUNC', script);
                    var Var1=script.getNumberValue('VAR1', script);
                    var Var2=script.getNumberValue('VAR2', script); 
                    var Var3=script.getNumberValue('VAR3', script); 
                    var Var4=script.getNumberValue('VAR4', script); 

                    if(Var1>2000)Var1=2000;
                    if(Var1<-2000)Var1=-2000;
                    if(Var2>2000)Var2=2000;
                    if(Var2<-2000)Var2=-2000;
                    if(Var3>2000)Var3=2000;
                    if(Var3<-2000)Var3=-2000;
                    if(Var4>2000)Var4=2000;
                    if(Var4<-2000)Var4=-2000;

                    var Remote = 1;
                    sq['SEND'] = {};
                    sq['SEND'][Entry.aibot.array.AIDESK_CONTROL] = {
                        remote: Remote,
                        func: Func,
                        var1: Var1, 
                        var2: Var2,
                        var3: Var3,    
                        var4: Var4,                    
                        Time: new Date().getTime(),
                    };
                    return script.callReturn(); 
                }
            },
        },
        aibot_aidesk_func_stop: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [                
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },                
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: ['1'],
                type: 'aibot_aidesk_func_stop',    
            },
            paramsKeyMap: {                    
                FUNC: 0,
            },
            class: 'aibot_aidesk',
            isNotFor: ['aibot'],
            func: function(sprite, script) {
                if(!script.isStart)
                {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.aibot.removeTimeout(timer);
                    }, Entry.aibot.delayTime);
                    Entry.aibot.timeouts.push(timer);
                    return script;
                }
                else if(script.timeFlag == 1)
                {
                    return script;
                }
                else
                {
                    var sq = Entry.hw.sendQueue;
                    var Func=script.getNumberValue('FUNC', script);
                    var Var1 = 0;
                    var Var2 = 0;
                    var Var3 = 0;
                    var Remote = 2;
                    sq['SEND'] = {};
                    sq['SEND'][Entry.aibot.array.AIDESK_CONTROL] = {
                        remote: Remote,      
                        func: Func,    
                        var1: Var1,
                        var2: Var2, 
                        var3: Var3,        
                        Time: new Date().getTime(),
                    };
                    return script.callReturn(); 
                }
            },
        },
        aibot_set_remote_device: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
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
                params: [],
                type: 'aibot_set_remote_device',    
            },
            paramsKeyMap: {                    
                FUNC: 0,
            },
            class: 'aibot_remote',
            isNotFor: ['aibot'],
            func: function(sprite, script) {
                if(!script.isStart)
                {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.aibot.removeTimeout(timer);
                    }, Entry.aibot.delayTime);
                    Entry.aibot.timeouts.push(timer);
                    return script;
                }
                else if(script.timeFlag == 1)
                {
                    return script;
                }
                else
                {
                    var sq = Entry.hw.sendQueue;
                    var Var1 = 1;
                    var Var2 = 1;
                    var Var3 = 1;
                    var Remote = 2;
                    sq['SEND'] = {};
                    sq['SEND'][Entry.aibot.array.REMOTE_DEVICE] = {
                        remote: Remote,      
                        var1: Var1,    
                        var2: Var2,
                        var3: Var3,         
                        Time: new Date().getTime(),
                    };
                    return script.callReturn(); 
                }
            },
        },



    };
};

module.exports = Entry.aibot;