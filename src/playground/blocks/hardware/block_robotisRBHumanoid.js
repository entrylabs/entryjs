'use strict';

Entry.Robotis_rb_H = {
    INSTRUCTION: {
        NONE: 0,
        WRITE: 3,
        READ: 2,
        SYNCWRITE: 4,
        REGWRITE: 5,
        ACTION: 6
    },
    CONTROL_TABLE: {
        // [default address, default length, address (when reads together), length (when reads together)]
        CM_LED_R: [79, 1],
        CM_LED_G: [80, 1],
        CM_LED_B: [81, 1],

        RB_LED_L: [40, 1],
        RB_LED_R: [41, 1],
        RB_LED_B: [40, 2],

        CM_BUZZER_INDEX: [60, 1], //[84, 1]
        CM_BUZZER_TIME: [63, 1], //[85, 1]
        CM_SOUND_DETECTED: [86, 1],
        CM_SOUND_DETECTING: [87, 1],
        CM_USER_BUTTON: [26, 1],
        CM_MOTION: [66, 2], //[66,1]

        AUX_SERVO_POSITION: [152, 2],
        
        AUX_CUSTOM: [216, 2],
        
        AUX_SERVO_MODE: [126, 1],
        AUX_SERVO_SPEED: [136, 2],
        AUX_MOTOR_SPEED: [136, 2],
        AUX_LED_MODULE: [210, 1],
    },
    DXL_POSITION: {
        values: [0,0,0,0,0,0,0,0]
    },
    setZero: function () {
        // instruction / address / length / value / default length
        Entry.hw.sendQueue['setZero'] = [1];
        Entry.Robotis_carCont.update();
        Entry.Robotis_carCont.setRobotisData(null);
        Entry.hw.sendQueue['setZero'] = null;
        Entry.Robotis_carCont.update();
        Entry.Robotis_carCont.setRobotisData([
            [Entry.Robotis_rb.INSTRUCTION.WRITE, 21, 2, 20],
            [Entry.Robotis_rb.INSTRUCTION.WRITE, 40, 2, 0],
            [Entry.Robotis_rb.INSTRUCTION.WRITE, 66, 2, 0],
            [Entry.Robotis_rb.INSTRUCTION.WRITE, 710, 2, 0],
            // [Entry.Robotis_rb.INSTRUCTION.WRITE, 163, 2, 30759],
            // [Entry.Robotis_rb.INSTRUCTION.WRITE, 162, 1, 1],
        ]);
        
        Entry.Robotis_carCont.update();
    },
    id: ['7.7', '7.8'],
    name: 'Robotis_rb_H',
    url: 'http://www.robotis.com/index/product.php?cate_code=111310',
    imageName: 'robotis_RB100im_Humanoid.png',
    title: {
        "ko": "로보티즈 꼭두",
        "en": "ROBOTIS Humanoid"
    },
    delay: 30,
    readDelay: 30,
};

Entry.Robotis_rb_H.blockMenuBlocks = [
    //robotis_openCM70
    // 'robotis_openCM70_sensor_value',
    
    //입력
    'robotis_RB_cm_ir_value',
    'robotis_RB_cm_ir_compare',
    'robotis_RB_detectFrontObj',
    'robotis_RB_cm_btn_value',
    'robotis_RB_cm_joystick_value',
    'robotis_RB_mic',
    'robotis_RB_detectSound_compare',
    'robotis_RB_imu',
    'robotis_RB_roll_pitch', 
    'robotis_RB_detectPose',

    'robotis_RB_cm_buzzer_index',
    'robotis_RB_cm_screen',
    'robotis_RB_rsp_screen',

    'robotis_RB_LCDBright',
    'robotis_RB_LCDColor',
    
    'robotis_RB_LEDBright',
    'robotis_RB_cm_led',

    'robotis_RB_Hello',
    'robotis_RB_effectSound',
    'robotis_RB_record',
    'robotis_RB_playRecord',

    'robotis_RB_cm_motion',
    'robotis_RB_cm_motion2',
    'robotis_RB_cm_motion_custom',
    'robotis_dxl_control',
    'robotis_dxl_each_control',
    
    // 'robotis_RB_cm_custom_value2',
    // 'robotis_RB_cm_custom2',
];

Entry.Robotis_rb_H.setLanguage = function() {
    return {
        ko: {
            template: {
                robotis_RB_cm_ir_value: "%1 번 IR 센서 값",
                robotis_RB_cm_ir_compare: "%1 번 IR 센서 값이 %2  %3이면",
                robotis_RB_detectFrontObj: "앞에 물체가 있으면",
                robotis_RB_cm_btn_value: "%1 버튼이 %2 이면",
                robotis_RB_cm_joystick_value: "조이스틱 위치가 %1 이면",
                robotis_RB_mic: "마이크 음량(dB)",
                robotis_RB_detectSound_compare: "소리가 %1에서 나면",
                robotis_RB_imu: "%1축의 %2 값",
                robotis_RB_roll_pitch: "제어기 각도 %1 값",
                robotis_RB_detectPose: "로봇이 %1 넘어지면",

                robotis_RB_cm_buzzer_index: "제어기 음계값 %1 을(를) %2 옥타브로 %3 초 동안 %4 %5",
                robotis_RB_cm_screen: "제어기 화면 배경을 %1 로 선택 %2",
                robotis_RB_rsp_screen: "제어기 화면에 %1 출력하기 %2",

                robotis_RB_LCDBright: "제어기 화면 밝기를 %1로 정하기 %2",
                robotis_RB_LCDColor: "제어기 화면 색상을 %1로 정하기 %2",
                
                robotis_RB_LEDBright: "제어기 %1 LED 밝기를 %2로 정하기 %3",
                robotis_RB_cm_led: "제어기 %1 LED %2 %3",

                robotis_RB_Hello: "%1 말하기 %2",
                robotis_RB_effectSound: "효과음 %1 재생하기 %2",
                robotis_RB_record: "%1 번 방에 녹음하기 %2",
                robotis_RB_playRecord: "%1 번 방 소리 재생하기 %2",
                
                robotis_RB_cm_motion: "휴머노이드 이동 모션 %1 실행 %2",
                robotis_RB_cm_motion2: "휴머노이드 기타 모션 %1 실행 %2",
                robotis_RB_cm_motion_custom: "휴머노이드 커스텀 모션 %1 실행 %2",
                robotis_dxl_control: "1번 모터 %1° 2번 모터 %2° 3번 모터 %3° 4번 모터 %4° 5번 모터 %5° 6번 모터 %6° 7번 모터 %7° 8번 모터 %8° %9초 동안 움직이기 %10",
                robotis_dxl_each_control: "%1 모터 %2° %3 초 동안 움직이기 %4",
            },
            
        },
        en: {
            template: {
                robotis_RB_cm_ir_value:"IR sensor value of %1 Value of IR Sensor",
                robotis_RB_cm_ir_compare:"If IR sensor value of %1 is %2 %3",
                robotis_RB_detectFrontObj:"If there is an object in front",
                robotis_RB_cm_btn_value:"If %1 button is %2",
                robotis_RB_cm_joystick_value:"If the joystick location is %1",
                robotis_RB_mic:"MIC volume(dB)",
                robotis_RB_detectSound_compare:"If sound is detected from %1",
                robotis_RB_imu:"%1 axis' %2 value",
                robotis_RB_roll_pitch:"%1 Controller position ",
                robotis_RB_detectPose:"If robot falls %1",
                
                robotis_RB_cm_buzzer_index:"%1 at %2 octaves for %3 second(s) -> %4 %5",
                robotis_RB_cm_screen:"Choose %1 as a screen background %2",
                robotis_RB_rsp_screen:"Print %1 on the screen %2",
                
                robotis_RB_LCDBright:"Adjust screen brightness to %1 %2",
                robotis_RB_LCDColor:"Set screen color to %1 %2",
                
                robotis_RB_LEDBright:"Set the brightness of the %1 LED to %2 %3",
                robotis_RB_cm_led:"%1 LED %2 %3",
                
                robotis_RB_Hello:"Say %1 %2",
                robotis_RB_effectSound:"Play the sound of %1 %2",
                robotis_RB_record:"Record in room %1 %2",
                robotis_RB_playRecord:"Play recorded sound in room %1 %2",
                
                robotis_dxl_control:"Move 1st motor %1°, 2nd motor %2°, 3rd motor %3°, 4th motor %4°, 5th motor %5°, 6th motor %6°, 7th motor %7°, 8th motor %8° for  second %9 %10",
                robotis_dxl_each_control:"Move %1th motor %2° for %3 second",
                robotis_RB_cm_motion:"Execute Humonoid motion %1 %2",
                robotis_RB_cm_motion2:"Execute Humonoid motion2 %1 %2",
                robotis_RB_cm_motion_custom:"Execute custom motion %1 %2",
                
                
            },
            
        }
    }
};

Entry.Robotis_rb_H.getBlocks = function() {
    return {
        robotis_RB_cm_motion: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_stMotion1, '1'],
                        [Lang.Blocks.robotis_stMotion2, '25'],
                        [Lang.Blocks.robotis_stMotion3, '46'],
                        [Lang.Blocks.robotis_stMotion4, '47'],
                        [Lang.Blocks.robotis_stMotion5, '37'], //Lang.Blocks.robotis_common_green_color
                        [Lang.Blocks.robotis_stMotion6, '38'],
                        [Lang.Blocks.robotis_stMotion7, '39'],
                        [Lang.Blocks.robotis_stMotion8, '41'],
                        [Lang.Blocks.robotis_stMotion9, '40'],
                    ],
                    value: '1',
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
                params: [
                    null,
                    null,
                ],
                type: 'robotis_RB_cm_motion',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_rb_H'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 0;
                var data_length = 0;
                var data_value = 0;
                var extraTime = 0; 

                data_address =
                    Entry.Robotis_rb.CONTROL_TABLE.CM_MOTION[0];
                data_length = Entry.Robotis_rb.CONTROL_TABLE.CM_MOTION[1];
                data_value = script.getField('VALUE', script);


                console.log("motion send");
                var data_sendqueue = [
                    [data_instruction, data_address, data_length, 0],
                    [data_instruction, data_address, data_length, data_value]
                ];
               
                switch(data_value){
                    case '1':
                        extraTime = 100;
                        break;
                    case '25':
                    case '46':
                    case '47':
                        extraTime = 3000;
                        break;
                    case '37':
                        extraTime = 3000;
                        break;
                    case '38':
                        extraTime = 1000;
                        break;
                    case '39':
                        extraTime = 1000;
                        break;
                    case '40':
                        extraTime = 2300;
                        break;
                    case '41':
                        extraTime = 2300;
                        break;
                    
                    
                }

                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay + extraTime + 300
                );
            },
            syntax: { js: [], py: ['Robotis.opencm70_cm_motion(%1)'] },
        },
        robotis_RB_cm_motion2: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_spMotion1, '26'],
                        [Lang.Blocks.robotis_spMotion2, '27'],
                        [Lang.Blocks.robotis_spMotion3, '28'],
                        [Lang.Blocks.robotis_spMotion4, '29'],
                        [Lang.Blocks.robotis_spMotion5, '30'], //Lang.Blocks.robotis_common_green_color
                        [Lang.Blocks.robotis_spMotion6, '31'],
                        [Lang.Blocks.robotis_spMotion7, '32'],
                        [Lang.Blocks.robotis_spMotion8, '33'],
                        [Lang.Blocks.robotis_spMotion9, '48'],
                        [Lang.Blocks.robotis_spMotion10, '35'],
                        [Lang.Blocks.robotis_spMotion11, '36'],
                        [Lang.Blocks.robotis_spMotion12, '42'],
                        [Lang.Blocks.robotis_spMotion13, '43'],
                        [Lang.Blocks.robotis_spMotion14, '44'],
                        [Lang.Blocks.robotis_spMotion15, '45'],
                    ],
                    value: '26',
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
                params: [
                    null,
                    null,
                ],
                type: 'robotis_RB_cm_motion2',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_rb_H'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 0;
                var data_length = 0;
                var data_value = 0;
                var extraTime = 0; 

                data_address =
                    Entry.Robotis_rb.CONTROL_TABLE.CM_MOTION[0];
                data_length = Entry.Robotis_rb.CONTROL_TABLE.CM_MOTION[1];
                data_value = script.getField('VALUE', script);


                console.log("motion send");
                var data_sendqueue = [
                    [data_instruction, data_address, data_length, 0],
                    [data_instruction, data_address, data_length, data_value]
                ];
               
                switch(data_value){
                    case '26':
                        extraTime = 800;
                        break;
                    case '27':
                        extraTime = 1000;
                        break;
                    case '28':
                        extraTime = 800;
                        break;
                    case '29':
                        extraTime = 1000;
                        break;
                    case '30':
                        extraTime = 800;
                        break;
                    case '31':
                        extraTime = 1000;
                        break;
                    case '32':
                        extraTime = 5800;
                        break;
                    case '33':
                        extraTime = 3800;
                        break;
                    case '34':
                        extraTime = 8400;
                        break;
                    case '35':
                        extraTime = 4000;
                        break;
                    case '36':
                        extraTime = 300;
                        break;
                    case '42':
                        extraTime = 600;
                        break;
                    case '43':
                        extraTime = 800;
                        break;
                    case '44':
                        extraTime = 800;
                        break;
                    case '45':
                        extraTime = 1000;
                        break;  
                    case '48':
                        extraTime = 12400;
                        break;     
                }

                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay + extraTime + 200
                );
            },
            syntax: { js: [], py: ['Robotis.opencm70_cm_motion(%1)'] },
        },
        
       
        robotis_RB_cm_motion_custom: {
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
                params: [
                    {
                        type: 'number',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'robotis_RB_cm_motion_custom',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_rb_H'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 0;
                var data_length = 0;
                var data_value = 0;
                var extraTime = 0; 

                data_address =
                    Entry.Robotis_rb.CONTROL_TABLE.CM_MOTION[0];
                data_length = Entry.Robotis_rb.CONTROL_TABLE.CM_MOTION[1];
                data_value = script.getNumberValue('VALUE', script);

                var data_sendqueue = [
                    [data_instruction, data_address, data_length, 0],
                    [data_instruction, data_address, data_length, data_value]
                ];
            
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_rb_H.delay
                    //Entry.Robotis_openCM70.delay + extraTime + 200
                );
            },
            syntax: { js: [], py: ['Robotis.opencm70_cm_motion_custom(%1)'] },
        },
        robotis_dxl_control: {
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
                    {
                        type: 'number',
                        params: ['1'],
                    },
                ],
                type: 'robotis_dxl_control',
            },
            
            paramsKeyMap: {
                ANGLE1: 0,
                ANGLE2: 1,
                ANGLE3: 2,
                ANGLE4: 3,
                
                ANGLE5: 4,
                ANGLE6: 5,
                ANGLE7: 6,
                ANGLE8: 7,
                TIME: 8
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_rb_H'],
            func(entity, script) {
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 19;
                var data_length = 1;
                var data_value = 1;

                var data_sendqueue = [
                    [data_instruction, data_address, data_length, data_value],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 64, 1, 1, [1]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 64, 1, 1, [2]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 64, 1, 1, [3]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 64, 1, 1, [4]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 64, 1, 1, [5]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 64, 1, 1, [6]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 64, 1, 1, [7]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 64, 1, 1, [8]],
                    [Entry.Robotis_rb.INSTRUCTION.ACTION, 0, 0, 0],
                ]
                
                var keyWord = 'ANGLE';
                for(let i = 1; i < 9; i++) {   
                    keyWord = 'ANGLE' + i;
                    var value = script.getNumberValue('ANGLE' + i, script);
                
                    var engValue = 2048;
                    engValue = Math.floor(Math.round(value * 4096) / 360 + 2048);

                    var time = script.getNumberValue('TIME', script) * 1000;
                    
                    var velocity = 0;
                
                    if(time == 0) {
                        velocity = 0;
                    } else {
                        velocity = Math.round(Math.floor(60 * Math.abs(value - Entry.Robotis_rb.DXL_POSITION.values[i - 1]) * 1000 / 360 / time)/0.229);
                    }

                    Entry.Robotis_rb.DXL_POSITION.values[i - 1] = value;

                    data_sendqueue.push([Entry.Robotis_rb.INSTRUCTION.REGWRITE, 112, 8, velocity * 4294967296 + engValue, [i]]);
                    
                }
                
                data_sendqueue.push([Entry.Robotis_rb.INSTRUCTION.ACTION, 0, 0, 0]);

                for(let j = 1; j < 9; j++) {
                    data_sendqueue.push([Entry.Robotis_rb.INSTRUCTION.REGWRITE, 112, 4, 0, [j]]);

                }
                data_sendqueue.push([Entry.Robotis_rb.INSTRUCTION.ACTION, 0, 0, 0]);
                
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    time + Entry.Robotis_openCM70.delay
                    //Entry.Robotis_openCM70.delay
                );
            },
            syntax: { js: [], py: ['Robotis.robotis_dxl_control(%1)'] },
        },

        robotis_dxl_each_control: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ["1", '1'],
                        ["2", '2'], //Lang.Blocks.robotis_common_green_color
                        ["3", '3'],
                        ["4", '4'],
                        ["5", '5'],
                        ["6", '6'],
                        ["7", '7'],
                        ["8", '8'],
                    ],
                    value: '1',
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
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                ],
                type: 'robotis_dxl_each_control',
            },
            
            paramsKeyMap: {
                DXLNUM: 0,
                ANGLE: 1,
                TIME: 2,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_rb_H'],
            func(entity, script) {
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 19;
                var data_length = 1;
                var data_value = 1;

                var data_sendqueue = [
                    [data_instruction, data_address, data_length, data_value],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 64, 1, 1, [1]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 64, 1, 1, [2]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 64, 1, 1, [3]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 64, 1, 1, [4]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 64, 1, 1, [5]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 64, 1, 1, [6]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 64, 1, 1, [7]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 64, 1, 1, [8]],
                    [Entry.Robotis_rb.INSTRUCTION.ACTION, 0, 0, 0],

                    
                ]
                
                var dxlID = script.getField('DXLNUM', script);
                var angle = script.getNumberValue('ANGLE', script);
                var time = script.getNumberValue('TIME', script) * 1000;

                var engValue = 2048;
                engValue = Math.floor(Math.round(angle * 4096) / 360 + 2048);
                var velocity = 0;
                
                if(time == 0) {
                    velocity = 0;
                } else {
                    velocity = Math.round(Math.floor(60 * Math.abs(angle - Entry.Robotis_rb.DXL_POSITION.values[dxlID - 1]) * 1000 / 360 / time)/0.229);
                }

                Entry.Robotis_rb.DXL_POSITION.values[dxlID - 1] = angle;
                data_sendqueue.push([Entry.Robotis_rb.INSTRUCTION.REGWRITE, 112, 8, velocity * 4294967296 + engValue, [dxlID]]);
                
                data_sendqueue.push([Entry.Robotis_rb.INSTRUCTION.ACTION, 0, 0, 0]);

                for(let j = 1; j < 9; j++) {
                    data_sendqueue.push([Entry.Robotis_rb.INSTRUCTION.REGWRITE, 112, 4, 0, [j]]);

                }
                data_sendqueue.push([Entry.Robotis_rb.INSTRUCTION.ACTION, 0, 0, 0]);

                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    time + Entry.Robotis_openCM70.delay
                    //Entry.Robotis_openCM70.delay
                );
            },
            syntax: { js: [], py: ['Robotis.robotis_dxl_each_control(%1)'] },
        },

    };
};

module.exports = [Entry.Robotis_rb_H];



