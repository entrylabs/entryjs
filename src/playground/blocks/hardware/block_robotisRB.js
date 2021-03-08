'use strict';

Entry.Robotis_rb = {
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
    id: ['7.5', '7.6'],
    name: 'Robotis_rb',
    url: 'http://www.robotis.com/index/product.php?cate_code=111310',
    imageName: 'robotis_RB100im_RGee.png',
    title: {
        "ko": "로보티즈 알쥐",
        "en": "ROBOTIS RGee"
    },
    delay: 30,
    readDelay: 30,
};

Entry.Robotis_rb.blockMenuBlocks = [
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
    'robotis_RB_roll_pitch', // 값 안나옴.
   
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
    
    'robotis_openCM70_RGee_go',
    'robotis_openCM70_RGee_stop',
    'robotis_openCM70_RGee_motion',
    
    'robotis_dxl_control',
    'robotis_dxl_each_control',
    
    // 'robotis_RB_cm_custom_value',
    // 'robotis_RB_cm_custom',
];

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

Entry.Robotis_rb.getBlocks = function () {
    return {
        //region robotis 로보티즈 openCM70
        robotis_RB_rsp_screen: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['가위', '11545'],
                        ['바위', '11546'],
                        ['보', '11547'],
                        ['0', '11283'],
                        ['1', '11284'],
                        ['2', '11285'],
                        ['3', '11286'],
                        ['4', '11287'],
                        ['5', '11288'],
                        ['6', '11289'],
                        ['7', '11290'],
                        ['8', '11291'],
                        ['9', '11292'],
                        ['10', '11293'],
                    ],
                    value: '11545',
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
                ],
                type: 'robotis_RB_rsp_screen',
            },
            paramsKeyMap: {
                ICON: 0,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_rb', 'Robotis_rb_H'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var iconNum = script.getField('ICON', script);
                
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 166;
                var data_length = 2;
                var data_value = 10496;
            
               
                data_value = iconNum;

                var data_sendqueue = [
                    // [
                    //     Entry.Robotis_rb.INSTRUCTION.WRITE, 163, 2, 2817
                    // ],
                    [
                        Entry.Robotis_rb.INSTRUCTION.WRITE, 163, 2, 255
                    ],
                    [
                        Entry.Robotis_rb.INSTRUCTION.WRITE, 130, 4, 0
                    ],
                    [
                        Entry.Robotis_rb.INSTRUCTION.WRITE, 149, 2, 200
                    ],
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                    ],
                    [
                        Entry.Robotis_rb.INSTRUCTION.WRITE, 162, 1, 1
                    ]
                ];
                
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay + 1000
                );
            },
            syntax: {
                js: [],
                py: ['Robotis.RB_rsp_screen(%1)'],
            },
        },
        robotis_RB_cm_custom_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['BYTE', 'BYTE'],
                        ['WORD', 'WORD'],
                        ['DWORD', 'DWORD'],
                    ],
                    value: 'BYTE',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'robotis_RB_cm_custom_value',
            },
            paramsKeyMap: {
                VALUE: 0,
                SIZE: 1,
            },
            class: 'robotis_openCM70_custom',
            isNotFor: ['Robotis_rb'],
            func: function (sprite, script) {
                var scope = script.executor.scope;

                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.READ;
                var data_address = 0;
                var data_length = 0;
                var data_value = 0;

                var data_default_address = 0;
                var data_default_length = 0;

                var size = script.getStringField('SIZE');

                if (size == 'BYTE') {
                    data_length = 1;
                } else if (size == 'WORD') {
                    data_length = 2;
                } else if (size == 'DWORD') {
                    data_length = 4;
                }

                data_address = script.getNumberValue('VALUE');

                data_default_address = data_address;
                data_default_length = data_length;

                if (
                    Entry.hw.sendQueue.prevAddress &&
                    Entry.hw.sendQueue.prevAddress == data_default_address
                ) {
                    if (
                        Entry.hw.sendQueue.prevTime &&
                        new Date() - Entry.hw.sendQueue.prevTime < Entry.Robotis_openCM70.readDelay
                    ) {
                        //throw new Entry.Utils.AsyncError();
                        if(typeof Entry.hw.sendQueue.prevResult == 'undefined') {
                            return 0;
                        }
                        return Entry.hw.sendQueue.prevResult;
                    }
                }

                Entry.Robotis_carCont.setRobotisData([
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                        data_default_length,
                    ],
                ]);
                // Entry.hw.socket.send(JSON.stringify(Entry.hw.sendQueue));
                Entry.Robotis_carCont.update();

                var result = Entry.hw.portData[data_default_address];
                Entry.hw.sendQueue.prevAddress = data_default_address;
                Entry.hw.sendQueue.prevTime = new Date();
                Entry.hw.sendQueue.prevResult = result;

                if(typeof result == 'undefined') {
                    console.log('result is undefined')
                    return 0;
                }
                return result;
            },
            syntax: {
                js: [],
                py: ['Robotis.opencm70_cm_custom_value(%1, %2)'],
            },
        },
        robotis_RB_cm_custom_value2: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['BYTE', 'BYTE'],
                        ['WORD', 'WORD'],
                        ['DWORD', 'DWORD'],
                    ],
                    value: 'BYTE',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'robotis_RB_cm_custom_value2',
            },
            paramsKeyMap: {
                VALUE: 0,
                SIZE: 1,
            },
            class: 'robotis_openCM70_custom',
            isNotFor: ['Robotis_rb_H'],
            func: function (sprite, script) {
                var scope = script.executor.scope;

                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.READ;
                var data_address = 0;
                var data_length = 0;
                var data_value = 0;

                var data_default_address = 0;
                var data_default_length = 0;

                var size = script.getStringField('SIZE');

                if (size == 'BYTE') {
                    data_length = 1;
                } else if (size == 'WORD') {
                    data_length = 2;
                } else if (size == 'DWORD') {
                    data_length = 4;
                }

                data_address = script.getNumberValue('VALUE');

                data_default_address = data_address;
                data_default_length = data_length;

                if (
                    Entry.hw.sendQueue.prevAddress &&
                    Entry.hw.sendQueue.prevAddress == data_default_address
                ) {
                    if (
                        Entry.hw.sendQueue.prevTime &&
                        new Date() - Entry.hw.sendQueue.prevTime < Entry.Robotis_openCM70.readDelay
                    ) {
                        //throw new Entry.Utils.AsyncError();
                        if(typeof Entry.hw.sendQueue.prevResult == 'undefined') {
                            return 0;
                        }
                        return Entry.hw.sendQueue.prevResult;
                    }
                }

                Entry.Robotis_carCont.setRobotisData([
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                        data_default_length,
                    ],
                ]);
                // Entry.hw.socket.send(JSON.stringify(Entry.hw.sendQueue));
                Entry.Robotis_carCont.update();

                var result = Entry.hw.portData[data_default_address];
                Entry.hw.sendQueue.prevAddress = data_default_address;
                Entry.hw.sendQueue.prevTime = new Date();
                Entry.hw.sendQueue.prevResult = result;

                if(typeof result == 'undefined') {
                    console.log('result is undefined')
                    return 0;
                }
                return result;
            },
            syntax: {
                js: [],
                py: ['Robotis.opencm70_cm_custom_value(%1, %2)'],
            },
        },
        robotis_RB_cm_ir_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1번', '360'],
                        ['2번', '362'],
                        ['3번', '364'],
                        ['4번', '366'],
                        ['5번', '368'],
                        ['6번', '370'],
                    ],
                    value: '360',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    null
                ],
                type: 'robotis_RB_cm_ir_value',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'robotis_openCM70_custom',
            isNotFor: ['Robotis_rb', 'Robotis_rb_H'],
            func: function (sprite, script) {
                var scope = script.executor.scope;

                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.READ;
                var data_address = 0;
                var data_length = 2;
                var data_value = 0;

                var data_default_address = 0;
                var data_default_length = 0;

                
                data_address = script.getNumberValue('VALUE');

                data_default_address = data_address;
                data_default_length = data_length;

                if (
                    Entry.hw.sendQueue.prevAddress &&
                    Entry.hw.sendQueue.prevAddress == data_default_address
                ) {
                    if (
                        Entry.hw.sendQueue.prevTime &&
                        new Date() - Entry.hw.sendQueue.prevTime < Entry.Robotis_openCM70.readDelay
                    ) {
                        //throw new Entry.Utils.AsyncError();
                        if(typeof Entry.hw.sendQueue.prevResult == 'undefined') {
                            return 0;
                        }
                        return Entry.hw.sendQueue.prevResult;
                    }
                }

                Entry.Robotis_carCont.setRobotisData([
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                        data_default_length,
                    ],
                ]);
                // Entry.hw.socket.send(JSON.stringify(Entry.hw.sendQueue));
                Entry.Robotis_carCont.update();

                var result = Entry.hw.portData[data_default_address];
                Entry.hw.sendQueue.prevAddress = data_default_address;
                Entry.hw.sendQueue.prevTime = new Date();
                Entry.hw.sendQueue.prevResult = result;

                if(typeof result == 'undefined') {
                    console.log('result is undefined')
                    return 0;
                }
                return result;
            },
            syntax: {
                js: [],
                py: ['Robotis.opencm70_cm_ir_value(%1)'],
            },
        },
        robotis_RB_cm_ir_compare: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1번', '360'],
                        ['2번', '362'],
                        ['3번', '364'],
                        ['4번', '366'],
                        ['5번', '368'],
                        ['6번', '370'],
                    ],
                    value: '360',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['>', '0'],
                        ['<', '1'],
                        ['=', '2'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    null,
                    200
                ],
                type: 'robotis_RB_cm_ir_compare',
            },
            paramsKeyMap: {
                VALUE: 0,
                COMPARE_OP: 1,
                COMPARE_VAL: 2,
            },
            class: 'robotis_openCM70_custom',
            isNotFor: ['Robotis_rb', 'Robotis_rb_H'],
            func: function (sprite, script) {
                var scope = script.executor.scope;

                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.READ;
                var data_address = 0;
                var data_length = 2;
                var data_value = 0;

                var data_default_address = 0;
                var data_default_length = 0;
                var compareValue = script.getNumberValue('COMPARE_VAL');
                var compareOP = script.getNumberValue('COMPARE_OP');

                data_address = script.getNumberValue('VALUE');

                data_default_address = data_address;
                data_default_length = data_length;

                if (
                    Entry.hw.sendQueue.prevAddress &&
                    Entry.hw.sendQueue.prevAddress == data_default_address
                ) {
                    if (
                        Entry.hw.sendQueue.prevTime &&
                        new Date() - Entry.hw.sendQueue.prevTime < Entry.Robotis_openCM70.readDelay//200
                    ) {
                        //throw new Entry.Utils.AsyncError();
                        switch(compareOP) {
                            case 0:
                                return Entry.hw.sendQueue.prevResult > compareValue;
                            case 1:
                                return Entry.hw.sendQueue.prevResult < compareValue;
                            case 2:
                                return Entry.hw.sendQueue.prevResult == compareValue;
                        }

                        
                    }
                }

                Entry.Robotis_carCont.setRobotisData([
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                        data_default_length,
                    ],
                ]);
                // Entry.hw.socket.send(JSON.stringify(Entry.hw.sendQueue));
                Entry.Robotis_carCont.update();

                var result = Entry.hw.portData[data_default_address];
                Entry.hw.sendQueue.prevAddress = data_default_address;
                Entry.hw.sendQueue.prevTime = new Date();
                Entry.hw.sendQueue.prevResult = result;

                switch(compareOP) {
                    case 0:
                        return result > compareValue;
                    case 1:
                        return result < compareValue;
                    case 2:
                        return result == compareValue;
                }
            },
            syntax: {
                js: [],
                py: ['Robotis.robotis_RB_cm_ir_compare(%1)'],
            },
        },
        robotis_RB_LCDBright: {
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
                    null,
                ],
                type: 'robotis_RB_LCDBright',
            },
            paramsKeyMap: {
                BRIGHT: 0,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_rb', 'Robotis_rb_H'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var bright = script.getNumberValue('BRIGHT', script);
                
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 180;
                var data_length = 1;
                var data_value = 0;
                
                data_value = bright;
                
                var data_sendqueue = [
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                    ],
                ];
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay
                );
            },
            syntax: {
                js: [],
                py: ['Robotis.RB_LCDBright(%1)'],
            },
        },
        robotis_RB_LCDColor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['빨강', '224'],
                        ['주황', '244'],
                        ['노랑', '252'],
                        ['초록', '28'],
                        ['파랑', '3'],
                        ['갈색', '173'],
                        ['검정', '0'],
                        ['흰색', '255'],
                    ],
                    value: '224',
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
                ],
                type: 'robotis_RB_LCDColor',
            },
            paramsKeyMap: {
                COLOR: 0,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_rb', 'Robotis_rb_H'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var color = script.getField('COLOR', script);
                
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 163;
                var data_length = 2;
                var data_value = 0;
                
                data_value = color;
                
                var data_sendqueue = [
                    [
                        Entry.Robotis_rb.INSTRUCTION.WRITE, 163, 2, 2817
                    ],
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                    ],
                    [3, 162, 1, 1]
                ];
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay + 100
                );
            },
            syntax: {
                js: [],
                py: ['Robotis.RB_LCDColor(%1)'],
            },
        },
        robotis_RB_detectSound_compare:{
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['왼쪽', '1'],
                        ['중앙', '0'],
                        ['오른쪽', '255'],
                    ],
                    value: '255',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                ],
                type: 'robotis_RB_detectSound_compare',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'robotis_openCM70_custom',
            isNotFor: ['Robotis_rb', 'Robotis_rb_H'],
            func: function (sprite, script) {
                var scope = script.executor.scope;

                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.READ;
                var data_address = 5031;
                var data_length = 1;
                var data_value = 0;

                var data_default_address = 0;
                var data_default_length = 0;
                var compareValue = script.getNumberValue('VALUE');


                data_default_address = data_address;
                data_default_length = data_length;

                if (
                    Entry.hw.sendQueue.prevAddress &&
                    Entry.hw.sendQueue.prevAddress == data_default_address
                ) {
                    if (
                        Entry.hw.sendQueue.prevTime &&
                        new Date() - Entry.hw.sendQueue.prevTime < Entry.Robotis_openCM70.readDelay//200
                    ) {
                        //throw new Entry.Utils.AsyncError();
                        console.log(Entry.hw.sendQueue.prevResult)
                        
                        return Entry.hw.sendQueue.prevResult == compareValue;
                    }
                }

                Entry.Robotis_carCont.setRobotisData([
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                        data_default_length,
                    ],
                ]);
                // Entry.hw.socket.send(JSON.stringify(Entry.hw.sendQueue));
                Entry.Robotis_carCont.update();

                var result = Entry.hw.portData[data_default_address];
                Entry.hw.sendQueue.prevAddress = data_default_address;
                Entry.hw.sendQueue.prevTime = new Date();
                Entry.hw.sendQueue.prevResult = result;

                return result == compareValue;
            },
            syntax: {
                js: [],
                py: ['Robotis.RB_detectSound_compare(%1)'],
            },
        },
        robotis_RB_LEDBright: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['왼쪽', 'RB_LED_L'],
                        ['오른쪽', 'RB_LED_R'],
                        ['양쪽', 'RB_LED_B'],
                    ],
                    value: 'RB_LED_L',
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
                params: [
                    null,
                    {
                        type: 'number',
                        params: [100]
                    }
                ],
                type: 'robotis_RB_LEDBright',
            },
            paramsKeyMap: {
                CMLED: 0,
                BRIGHT: 1,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_rb', 'Robotis_rb_H'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var cmLed = script.getField('CMLED', script);
                var bright = script.getNumberValue('BRIGHT', script);
                
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 0;
                var data_length = 1;
                var data_value = 0;
            
                if(bright < 0){ 
                    bright = 0;
                } else if(bright > 100) {
                    bright = 100
                }
                data_value = 100+bright;
            

                if (cmLed == 'RB_LED_L') {
                    data_address =
                        Entry.Robotis_rb.CONTROL_TABLE.RB_LED_L[0];
                    data_length =
                        Entry.Robotis_rb.CONTROL_TABLE.RB_LED_L[1];
                } else if (cmLed == 'RB_LED_R') {
                    data_address =
                        Entry.Robotis_rb.CONTROL_TABLE.RB_LED_R[0];
                    data_length =
                        Entry.Robotis_rb.CONTROL_TABLE.RB_LED_R[1];
                } else if (cmLed == 'RB_LED_B') {
                    data_address =
                        Entry.Robotis_rb.CONTROL_TABLE.RB_LED_B[0];
                    data_length =
                        Entry.Robotis_rb.CONTROL_TABLE.RB_LED_B[1];
                    if(bright != 0){
                        data_value = 257*(bright+100);
                    }
                }

                var data_sendqueue = [
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                    ],
                ];
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay
                );
            },
            syntax: {
                js: [],
                py: ['Robotis.RB_LEDBright(%1, %2)'],
            },
        },
        robotis_RB_Hello: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['안녕하세요' ,'0'],
                        ['반가워요' ,'1'],
                        ['알겠어요' ,'2'],
                        ['아니에요' ,'3'],
                        ['모르겠어요' ,'4'],
                        ['좋아요' ,'5'],
                        ['싫어요' ,'6'],
                        ['이름을 말하세요' ,'7'],
                        ['무엇을 도와줄까?' ,'8'],
                        ['잘했어' ,'9'],
                        ['괜찮아' ,'10'],
                        ['다시 해보자' ,'11'],
                        ['고마워' ,'12'],
                        ['다시 말해줄래?' ,'13'],
                        ['최고야!' ,'14'],
                        ['신나요' ,'15'],
                        ['즐거워요' ,'16'],
                        ['미안해요' ,'17'],
                        ['화나요' ,'18'],
                        ['부끄러워요' ,'19'],
                        ['무서워요' ,'20'],
                        ['속상해요' ,'21'],
                        ['사랑해요' ,'22'],
                        ['예뻐요' ,'23'],
                        ['신기해요' ,'24'],
                        ['초조해요' ,'25'],
                        ['앞으로 가자' ,'26'],
                        ['뒤로 가자' ,'27'],
                        ['일어나자' ,'28'],
                        ['넘어졌네?' ,'29'],
                        ['오예' ,'30'],
                        ['아싸' ,'31'],
                        ['어머' ,'32'],
                        ['이런' ,'33'],
                        ['오호' ,'34'],
                        ['하하하' ,'35'],
                        ['호호호' ,'36'],
                        ['졸려' ,'37'],
                        ['자장가를 들려줘' ,'38'],
                        ['안녕' ,'39'],
                        ['배고프다' ,'40'],
                        ['도토리 땡긴다' ,'41'],
                        ['아.씻고싶어' ,'42'],
                        ['비누목욕시간이야' ,'43'],
                        ['심심한데' ,'44'],
                        ['간식먹을까' ,'45'],
                        ['아파요' ,'46'],
                        ['약은 없나요?' ,'47'],
                        ['어디로 가야하지?' ,'48'],
                        ['와아 도착이다' ,'49'],
                        ['왼쪽으로 가자' ,'50'],
                        ['오른쪽으로 가자' ,'51'],
                        ['깜짝이야' ,'52'],
                        ['찾았다' ,'53'],
                        ['여긴 없네' ,'54'],
                        ['혹시 나 불렀어?' ,'55'],
                        ['내려주세요' ,'56'],
                        ['앗' ,'57'],
                        ['힝' ,'58'],
                        ['이익' ,'59'],
                    ],
                    value: '0',
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
                ],
                type: 'robotis_RB_Hello',
            },
            paramsKeyMap: {
                HELLO: 0,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_rb', 'Robotis_rb_H'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var cmHello = script.getField('HELLO', script);
                
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 110;
                var data_length = 2;
                var data_value = 0;
            
               
                data_value = 25601+Number(cmHello);

                var data_sendqueue = [
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                    ],
                    [
                        data_instruction,
                        0,
                        2,
                        0
                    ]
                ];
                console.log('hello')

                let extraTime = 0; 
                
                if(cmHello == '38' || cmHello == '55') {
                    extraTime = 2000;
                }

                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    2000 + extraTime
                );
            },
            syntax: {
                js: [],
                py: ['Robotis.RB_Hello(%1)'],
            },
        },
        robotis_RB_effectSound:{
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['개', '0'],
                        ['개구리', '1'],
                        ['고양이', '2'],
                        ['닭', '7'],
                        ['호랑이', '19'],
                        ['쥐', '17'],

                        ['구급차', '773'],
                        ['경적(빵빵)', '781'],
                        ['사이렌(경찰차)', '774'],
                        ['호루라기', '274'],
                        ['총소리', '775'],
                        ['박수', '260'],

                        ['멜로디1', '786'],
                        ['멜로디2', '787'],
                        ['멜로디3', '788'],
                        ['멜로디4', '789'],
                    ],
                    value: '0',
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
                ],
                type: 'robotis_RB_effectSound',
            },
            paramsKeyMap: {
                HELLO: 0,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_rb', 'Robotis_rb_H'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var cmHello = script.getField('HELLO', script);
                
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 110;
                var data_length = 2;
                var data_value = 0;
            
               
                data_value = Number(cmHello);

                var data_sendqueue = [
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                    ],
                    [
                        data_instruction,
                        0,
                        2,
                        0
                    ]
                ];
                
                let extraTime = 0;
                if(cmHello == '272' || cmHello == '786' || cmHello == '787' || cmHello == '788' || cmHello == '789') { //오리
                    extraTime = 0;
                    if(cmHello == '788' || cmHello == '789') {
                        extraTime += 500;
                    }
                }
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    3000 + extraTime
                );
            },
            syntax: {
                js: [],
                py: ['Robotis.RB_Hello(%1)'],
            },
        },
        robotis_RB_record:{
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1번', '0'],
                        ['2번', '1'],
                        ['3번', '2'],
                        ['4번', '3'],
                        ['5번', '4'],
                    ],
                    value: '0',
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
                ],
                type: 'robotis_RB_record',
            },
            paramsKeyMap: {
                ROOM: 0,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_rb', 'Robotis_rb_H'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var roomNum = script.getField('ROOM', script);
                
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 115;
                var data_length = 1;
                var data_value = 0;
            
               
                data_value = roomNum;

                var data_sendqueue = [
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                    ],
                ];
                
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    6000
                );
            },
            syntax: {
                js: [],
                py: ['Robotis.RB_record(%1)'],
            },
        },
        robotis_RB_playRecord:{
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1번', '0'],
                        ['2번', '1'],
                        ['3번', '2'],
                        ['4번', '3'],
                        ['5번', '4'],
                    ],
                    value: '0',
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
                ],
                type: 'robotis_RB_playRecord',
            },
            paramsKeyMap: {
                ROOM: 0,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_rb', 'Robotis_rb_H'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var roomNum = script.getField('ROOM', script);
                
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 116;
                var data_length = 1;
                var data_value = 0;
            
               
                data_value = roomNum;

                var data_sendqueue = [
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                    ],
                ];
                
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    6000
                );
            },
            syntax: {
                js: [],
                py: ['Robotis.RB_playRecord(%1)'],
            },
        },
        robotis_RB_detectFrontObj:{
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                
            ],
            events: {},
            def: {
                params: [
                  
                ],
                type: 'robotis_RB_detectFrontObj',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'robotis_openCM70_custom',
            isNotFor: ['Robotis_rb', 'Robotis_rb_H'],
            func: function (sprite, script) {
                var scope = script.executor.scope;

                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.READ;
                var data_address = 360;
                var data_length = 4;
                var data_value = 0;

                var data_default_address = 0;
                var data_default_length = 0;
                var compareValue = script.getNumberValue('VALUE');


                data_default_address = data_address;
                data_default_length = data_length;

                if (
                    Entry.hw.sendQueue.prevAddress &&
                    Entry.hw.sendQueue.prevAddress == data_default_address
                ) {
                    if (
                        Entry.hw.sendQueue.prevTime &&
                        new Date() - Entry.hw.sendQueue.prevTime < Entry.Robotis_openCM70.readDelay//200
                    ) {
                        
                        let ir_1 = Entry.hw.sendQueue.prevResult & 0xffff;
                        let ir_2 =  Entry.hw.sendQueue.prevResult >> 16;
                        
                        return ir_1 > 100 && ir_2 > 100//Entry.hw.sendQueue.prevResult// > 10000000;
                    }
                }

                Entry.Robotis_carCont.setRobotisData([
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                        data_default_length,
                    ],
                ]);
                Entry.Robotis_carCont.update();

                var result = Entry.hw.portData[data_default_address];
                Entry.hw.sendQueue.prevAddress = data_default_address;
                Entry.hw.sendQueue.prevTime = new Date();
                Entry.hw.sendQueue.prevResult = result;

                let ir_1 = Entry.hw.sendQueue.prevResult & 0xffff;
                let ir_2 =  Entry.hw.sendQueue.prevResult >> 16;
                

                return ir_1 > 100 && ir_2 > 100
                return result// > 10000000;
            },
            syntax: {
                js: [],
                py: ['Robotis.RB_detectFrontObj()'],
            },
        },
        robotis_RB_detectPose:{
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['앞으로', '1'],//72
                        ['뒤로', '2'],//74
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                }
            ],
            events: {},
            def: {
                params: [
                  null
                ],
                type: 'robotis_RB_detectPose',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'robotis_openCM70_custom',
            isNotFor: ['Robotis_rb_H'],
            func: function (sprite, script) {
                var scope = script.executor.scope;

                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.READ;
                var data_address = 78;
                var data_length = 2;
                var data_value = 0;

                var data_default_address = 0;
                var data_default_length = 0;
                var compareValue = script.getNumberValue('VALUE');


                data_default_address = data_address;
                data_default_length = data_length;

                if (
                    Entry.hw.sendQueue.prevAddress &&
                    Entry.hw.sendQueue.prevAddress == data_default_address
                ) {
                    if (
                        Entry.hw.sendQueue.prevTime &&
                        new Date() - Entry.hw.sendQueue.prevTime < Entry.Robotis_openCM70.readDelay//200
                    ) {
                        switch(compareValue) {
                            case 1:
                                return Entry.hw.sendQueue.prevResult > 30;
                            case 2:
                                return Entry.hw.sendQueue.prevResult < -30;
                        }                        

                    }
                }

                Entry.Robotis_carCont.setRobotisData([
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                        data_default_length,
                    ],
                ]);
                Entry.Robotis_carCont.update();

                var result = Entry.hw.portData[data_default_address];
                Entry.hw.sendQueue.prevAddress = data_default_address;
                Entry.hw.sendQueue.prevTime = new Date();
                Entry.hw.sendQueue.prevResult = result;

                switch(compareValue) {
                    case 1:
                        return result > 30;
                    case 2:
                        return result < -30;
                }
            },
            syntax: {
                js: [],
                py: ['Robotis.RB_detectFrontObj()'],
            },
        },
        robotis_RB_mic:{
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [
                    null
                ],
                type: 'robotis_RB_mic',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'robotis_openCM70_custom',
            isNotFor: ['Robotis_rb', 'Robotis_rb_H'],
            func: function (sprite, script) {
                var scope = script.executor.scope;

                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.READ;
                var data_address = 0;
                var data_length = 1;
                var data_value = 0;

                var data_default_address = 0;
                var data_default_length = 0;

                
                data_address = 119;

                data_default_address = data_address;
                data_default_length = data_length;

                if (
                    Entry.hw.sendQueue.prevAddress &&
                    Entry.hw.sendQueue.prevAddress == data_default_address
                ) {
                    if (
                        Entry.hw.sendQueue.prevTime &&
                        new Date() - Entry.hw.sendQueue.prevTime < Entry.Robotis_openCM70.readDelay
                    ) {
                        //throw new Entry.Utils.AsyncError();
                        if(typeof Entry.hw.sendQueue.prevResult == 'undefined') {
                            return 0;
                        }
                        return Entry.hw.sendQueue.prevResult;
                    }
                }

                Entry.Robotis_carCont.setRobotisData([
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                        data_default_length,
                    ],
                ]);
                // Entry.hw.socket.send(JSON.stringify(Entry.hw.sendQueue));
                Entry.Robotis_carCont.update();

                var result = Entry.hw.portData[data_default_address];
                Entry.hw.sendQueue.prevAddress = data_default_address;
                Entry.hw.sendQueue.prevTime = new Date();
                Entry.hw.sendQueue.prevResult = result;

                if(typeof result == 'undefined') {
                    console.log('result is undefined')
                    return 0;
                }
                return result;
            },
            syntax: {
                js: [],
                py: ['Robotis.robotis_RB_mic()'],
            },
        },
        robotis_RB_imu:{
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['x', '78'],//72
                        ['y', '80'],//74
                        ['z', '82']//76
                    ],
                    value: '78',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['가속도', '0'],//72
                        ['자이로', '6'],//74
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                }
            ],
            events: {},
            def: {
                params: [
                    null,
                    null
                ],
                type: 'robotis_RB_imu',
            },
            paramsKeyMap: {
                AXIS: 0,
                MODE: 1,
            },
            class: 'robotis_openCM70_custom',
            isNotFor: ['Robotis_rb', 'Robotis_rb_H'],
            func: function (sprite, script) {
                var scope = script.executor.scope;

                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.READ;
                var data_address = 0;
                var data_length = 2;
                var data_value = 0;

                var data_default_address = 0;
                var data_default_length = 0;

                
                data_address = script.getField('AXIS', script) - script.getField('MODE', script);
                
                data_default_address = data_address;
                data_default_length = data_length;

                if (
                    Entry.hw.sendQueue.prevAddress &&
                    Entry.hw.sendQueue.prevAddress == data_default_address
                ) {
                    if (
                        Entry.hw.sendQueue.prevTime &&
                        new Date() - Entry.hw.sendQueue.prevTime < Entry.Robotis_openCM70.readDelay
                    ) {
                        //throw new Entry.Utils.AsyncError();
                        if(typeof Entry.hw.sendQueue.prevResult == 'undefined') {
                            return 0;
                        }
                        return Entry.hw.sendQueue.prevResult;
                    }
                }

                Entry.Robotis_carCont.setRobotisData([
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                        data_default_length,
                    ],
                ]);
                // Entry.hw.socket.send(JSON.stringify(Entry.hw.sendQueue));
                Entry.Robotis_carCont.update();

                var result = Entry.hw.portData[data_default_address];
                Entry.hw.sendQueue.prevAddress = data_default_address;
                Entry.hw.sendQueue.prevTime = new Date();
                Entry.hw.sendQueue.prevResult = result;

                if(typeof result == 'undefined') {
                    console.log('result is undefined')
                    return 0;
                }
                return result;
            },
            syntax: {
                js: [],
                py: ['Robotis.robotis_RB_imu()'],
            },
        },
        robotis_RB_roll_pitch:{
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['Roll', '70'],//72
                        ['Pitch', '88'],//74
                    ],
                    value: '70',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                }
            ],
            events: {},
            def: {
                params: [
                    null,
                ],
                type: 'robotis_RB_roll_pitch',
            },
            paramsKeyMap: {
                AXIS: 0,
            },
            class: 'robotis_openCM70_custom',
            isNotFor: ['Robotis_rb', 'Robotis_rb_H'],
            func: function (sprite, script) {
                var scope = script.executor.scope;

                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.READ;
                var data_address = 0;
                var data_length = 2;
                var data_value = 0;

                var data_default_address = 0;
                var data_default_length = 0;

                
                data_address = script.getNumberValue('AXIS');
                
                data_default_address = data_address;
                data_default_length = data_length;

                if (
                    Entry.hw.sendQueue.prevAddress &&
                    Entry.hw.sendQueue.prevAddress == data_default_address
                ) {
                    if (
                        Entry.hw.sendQueue.prevTime &&
                        new Date() - Entry.hw.sendQueue.prevTime < Entry.Robotis_openCM70.readDelay
                    ) {
                        //throw new Entry.Utils.AsyncError();
                        if(typeof Entry.hw.sendQueue.prevResult == 'undefined') {
                            return 0;
                        }
                        return Entry.hw.sendQueue.prevResult;
                    }
                }

                Entry.Robotis_carCont.setRobotisData([
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                        data_default_length,
                    ],
                ]);
                // Entry.hw.socket.send(JSON.stringify(Entry.hw.sendQueue));
                Entry.Robotis_carCont.update();

                var result = Entry.hw.portData[data_default_address];
                Entry.hw.sendQueue.prevAddress = data_default_address;
                Entry.hw.sendQueue.prevTime = new Date();
                Entry.hw.sendQueue.prevResult = result;

                if(typeof result == 'undefined') {
                    console.log('result is undefined')
                    return 0;
                }
                return result;
            },
            syntax: {
                js: [],
                py: ['Robotis.robotis_RB_roll_pitch(%1)'],
            },
        },
        robotis_RB_cm_joystick_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [ 
                        ['중앙', '0'],
                        ['←', '1'],
                        ['→', '2'],
                        ['↑', '3'],
                        ['↓', '4'],
                        ['↖', '5'],
                        ['↗', '6'],
                        ['↙', '7'],
                        ['↘', '8'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                }
            ],
            events: {},
            def: {
                params: [
                    null
                ],
                type: 'robotis_RB_cm_joystick_value',
            },
            paramsKeyMap: {
                COMPARE_VAL: 0,
            },
            class: 'robotis_openCM70_custom',
            isNotFor: ['Robotis_rb', 'Robotis_rb_H'],
            func: function (sprite, script) {
                var scope = script.executor.scope;

                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.READ;
                var data_address = 0;
                var data_length = 1;
                var data_value = 0;

                var data_default_address = 0;
                var data_default_length = 0;

                
                data_address = 50;

                data_default_address = data_address;
                data_default_length = data_length;

                var compareValue = script.getNumberValue('COMPARE_VAL', script);

                if (
                    Entry.hw.sendQueue.prevAddress &&
                    Entry.hw.sendQueue.prevAddress == data_default_address
                ) {
                    if (
                        Entry.hw.sendQueue.prevTime &&
                        new Date() - Entry.hw.sendQueue.prevTime < 200
                    ) {
                        //throw new Entry.Utils.AsyncError();
                        return (Entry.hw.sendQueue.prevResult == compareValue);
                    }
                }

                Entry.Robotis_carCont.setRobotisData([
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                        data_default_length,
                    ],
                ]);
                // Entry.hw.socket.send(JSON.stringify(Entry.hw.sendQueue));
                Entry.Robotis_carCont.update();

                var result = Entry.hw.portData[data_default_address];
                Entry.hw.sendQueue.prevAddress = data_default_address;
                Entry.hw.sendQueue.prevTime = new Date();
                Entry.hw.sendQueue.prevResult = result;



                return (result == compareValue);
            },
            syntax: {
                js: [],
                py: ['Robotis.openCM70_cm_joystick_value()'],
            },
        },
        robotis_RB_cm_btn_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['실행', '45'],
                        ['뒤로', '42'],
                    ],
                    value: '45',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['눌림', '1'],
                        ['안눌림', '0'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [
                    null,
                    null
                ],
                type: 'robotis_RB_cm_btn_value',
            },
            paramsKeyMap: {
                VALUE: 0,
                COMPARE_VAL: 1
            },
            class: 'robotis_openCM70_custom',
            isNotFor: ['Robotis_rb', 'Robotis_rb_H'],
            func: function (sprite, script) {
                var scope = script.executor.scope;

                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.READ;
                var data_address = 0;
                var data_length = 1;
                var data_value = 0;

                var data_default_address = 0;
                var data_default_length = 0;

                
                data_address = script.getNumberValue('VALUE');

                data_default_address = data_address;
                data_default_length = data_length;

                var compareValue = script.getNumberValue('COMPARE_VAL');
                if (
                    Entry.hw.sendQueue.prevAddress &&
                    Entry.hw.sendQueue.prevAddress == data_default_address
                ) {
                    if (
                        Entry.hw.sendQueue.prevTime &&
                        new Date() - Entry.hw.sendQueue.prevTime < 50
                    ) {
                        //throw new Entry.Utils.AsyncError();
                        return (Entry.hw.sendQueue.prevResult == compareValue);
                    }
                }

                Entry.Robotis_carCont.setRobotisData([
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                        data_default_length,
                    ],
                ]);
                // Entry.hw.socket.send(JSON.stringify(Entry.hw.sendQueue));
                Entry.Robotis_carCont.update();

                var result = Entry.hw.portData[data_default_address];
                Entry.hw.sendQueue.prevAddress = data_default_address;
                Entry.hw.sendQueue.prevTime = new Date();
                Entry.hw.sendQueue.prevResult = result;

                return (result == compareValue);
            },
            syntax: {
                js: [],
                py: ['Robotis.opencm70_cm_btn_value(%1)'],
            },
        },

       
        robotis_RB_cm_buzzer_index: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.General.note_c + '', '47'],
                        [Lang.General.note_c + '#', '48'],
                        [Lang.General.note_d + '', '49'],
                        [Lang.General.note_d + '#', '50'],
                        [Lang.General.note_e + '', '51'],
                        [Lang.General.note_f + '', '52'],
                        [Lang.General.note_f + '#', '53'],
                        [Lang.General.note_g + '', '54'],
                        [Lang.General.note_g + '#', '55'],
                        [Lang.General.note_a + '', '56'],
                        [Lang.General.note_a + '#', '57'],
                        [Lang.General.note_b + '', '58'],
                    ],
                    value: '47',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['1', '-1'],
                        ['2', '0'],
                        ['3', '1'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['연주', '1'],
                        ['쉼표', '2'],
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
                    '1',
                    null,
                    null,
                ],
                type: 'robotis_RB_cm_buzzer_index',
            },
            paramsKeyMap: {
                CM_BUZZER_INDEX: 0,
                CM_BUZZER_OCTAV: 1,
                CM_BUZZER_DELAY: 2,
                CM_BUZZER_PLAY: 3
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_rb', 'Robotis_rb_H'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var cmBuzzerIndex = script.getField('CM_BUZZER_INDEX', script);
                var cmBuzzerOffset = script.getField('CM_BUZZER_OCTAV', script);
                var cmBuzzerTime = script.getNumberValue('CM_BUZZER_DELAY', script);
                var cmBuzzerPlay = script.getField('CM_BUZZER_PLAY', script);

                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address_1 = 0;
                var data_length_1 = 0;
                var data_value_1 = 0;
                var data_address_2 = 0;
                var data_length_2 = 0;
                var data_value_2 = 0;
                var interval = 50;

                data_address_1 =
                    Entry.Robotis_rb.CONTROL_TABLE.CM_BUZZER_TIME[0];
                data_length_1 =
                    Entry.Robotis_rb.CONTROL_TABLE.CM_BUZZER_TIME[1];
                // data_value_1 = cmBuzzerTime * 10;
                // TODO 텍스트 입력으로 바꾸고 최대는 5초 : 0.5 초 하려면 5를 입력  - console.log(parseInt(0.59 * 10)); max 는 5초
                data_value_1 = parseInt(cmBuzzerTime * 10);
                if (data_value_2 < 0) {
                    data_value_1 = 0;
                }
                if (data_value_1 > 50) {
                    data_value_1 = 50;
                }

                data_address_2 =
                    Entry.Robotis_rb.CONTROL_TABLE.CM_BUZZER_INDEX[0];
                data_length_2 =
                    Entry.Robotis_rb.CONTROL_TABLE.CM_BUZZER_INDEX[1];
                data_value_2 = Number(cmBuzzerIndex) + Number(cmBuzzerOffset * 12);

                // console.log("buzzer send");
                var data_sendqueue = [
                    [
                        data_instruction,
                        data_address_1,
                        data_length_1,
                        data_value_1,
                    ],
                    [
                        data_instruction,
                        data_address_2,
                        data_length_2,
                        data_value_2,
                    ],
                ];

                if(cmBuzzerPlay == '2') {
                    data_sendqueue = [];
                }

                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    cmBuzzerTime * 1000+ interval
                );
            },
            syntax: {
                js: [],
                py: ['Robotis.opencm70_cm_buzzer_index(%1, %2)'],
            },
        },
       
        
        robotis_RB_cm_screen: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        // ["센서 로그", '30759'],
                        // ["다이나믹셀 로그", '30760'],
                        ["무표정", '2817'],
                        ["짜증", '2818'], //Lang.Blocks.robotis_common_green_color
                        ["귀여움", '2819'],
                        ["화냄", '2820'],
                        ["행복", '2821'],

                        ["배고픔", '2822'],
                        ["웃기1", '2823'], //Lang.Blocks.robotis_common_green_color
                        ["웃기2", '2824'],
                        ["당황", '2825'],
                        ["졸림", '2826'],

                        ["쿨쿨", '2827'],
                        ["찡그리기", '2828'], //Lang.Blocks.robotis_common_green_color
                        ["하품", '2829'],
                        
                        ["애니메이션 1", "30730"],
                        ["애니메이션 2", "30731"],
                        ["애니메이션 3", "30732"],
                        ["애니메이션 4", "30733"],
                        ["애니메이션 5", "30734"],
                    ],
                    value: '2817',
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
                params: [null, null, null],
                type: 'robotis_RB_cm_screen',
            },
            paramsKeyMap: {
                BACKGROUND: 0,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_rb', 'Robotis_rb_H'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var screenValue = script.getField('BACKGROUND', script);
                
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 163;
                var data_length = 2;
                var data_value = screenValue;
                console.log("screen send");
                var data_sendqueue = [
                    [data_instruction, data_address, data_length, data_value],
                    [3, 162, 1, 1]
                ];
              


                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay + 1000
                );
            },
            syntax: { js: [], py: ['Robotis.opencm70_cm_screen(%1)'] },
        },
        robotis_RB_cm_led: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ["점멸1", '11'],
                        ["점멸2", '12'], //Lang.Blocks.robotis_common_green_color
                        ["점멸3", '13'],

                        ["점멸4", '21'],
                        ["점멸5", '22'], //Lang.Blocks.robotis_common_green_color
                        ["점멸6", '23'],

                        ["점멸7", '31'],
                        ["점멸8", '32'], //Lang.Blocks.robotis_common_green_color
                        ["점멸9", '33'],
                    ],
                    value: '11',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.robotis_common_on, '1'],
                        [Lang.Blocks.robotis_common_off, '0'],
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
                params: [null, null, null],
                type: 'robotis_RB_cm_led',
            },
            paramsKeyMap: {
                RB_LED: 0,
                VALUE: 1,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_rb', 'Robotis_rb_H'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var cmLed = script.getField('RB_LED', script);
                var value = script.getField('VALUE', script);

                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 40;
                var data_length = 1;
                var data_value = 0;

                
                data_value = value * cmLed;
              
                var data_sendqueue = [
                    [data_instruction, data_address, data_length, data_value],
                ];
                
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay
                );
            },
            syntax: { js: [], py: ['Robotis.opencm70_cm_led(%1, %2)'] },
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
                        ["1번", '1'],
                        ["2번", '2'], //Lang.Blocks.robotis_common_green_color
                        ["3번", '3'],
                        ["4번", '4'],
                        ["5번", '5'],
                        ["6번", '6'],
                        ["7번", '7'],
                        ["8번", '8'],
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

        robotis_dxl_test: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                
            ],
            events: {},
            def: {
                params: [],
                type: 'robotis_dxl_test',
            },
            paramsKeyMap: {
                
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_rb', 'Robotis_rb_H'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                //19번지에 1바이트로 1 설정 

                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 19;
                var data_length = 1;
                var data_value = 1;
                console.log("dxl send");
                var data_sendqueue = [
                    [data_instruction, data_address, data_length, data_value],
                    // [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 64, 1, 1, [1]],
                    // [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 64, 1, 1, [2]],
                    // [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 64, 1, 1, [3]],
                    // [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 64, 1, 1, [4]],
                    // [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 64, 1, 1, [5]],
                    // [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 64, 1, 1, [6]],
                    // [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 64, 1, 1, [7]],
                    // [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 64, 1, 1, [8]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 64, 1, 1, [33]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 64, 1, 1, [34]],
                    [Entry.Robotis_rb.INSTRUCTION.ACTION, 0, 0, 0],
               

                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 116, 4, 2048, [1]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 116, 4, 2048, [2]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 116, 4, 2048, [3]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 116, 4, 2048, [4]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 116, 4, 2048, [5]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 116, 4, 2048, [6]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 116, 4, 2048, [7]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 116, 4, 2048, [8]],
                    [Entry.Robotis_rb.INSTRUCTION.ACTION, 0, 0, 0],

                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 116, 4, 2548, [1]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 116, 4, 1548, [2]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 116, 4, 2048, [3]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 116, 4, 2048, [4]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 116, 4, 2048, [5]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 116, 4, 2048, [6]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 116, 4, 2248, [7]],
                    [Entry.Robotis_rb.INSTRUCTION.REGWRITE, 116, 4, 1848, [8]],
                    [Entry.Robotis_rb.INSTRUCTION.ACTION, 0, 0, 0],
                    
                    /*[Entry.Robotis_rb.INSTRUCTION.SYNCWRITE, 64, 1, 60, [1,2], [1,1]],
                    [Entry.Robotis_rb.INSTRUCTION.SYNCWRITE, 64, 1, 60, [3,4], [1,1]],
                    [Entry.Robotis_rb.INSTRUCTION.SYNCWRITE, 64, 1, 60, [5,6], [1,1]],
                    [Entry.Robotis_rb.INSTRUCTION.SYNCWRITE, 64, 1, 60, [7,8], [1,1]],

                    [Entry.Robotis_rb.INSTRUCTION.SYNCWRITE, 116, 4, 60, [1], [2048]],
                    [Entry.Robotis_rb.INSTRUCTION.SYNCWRITE, 116, 4, 60, [2], [2048]],
                    [Entry.Robotis_rb.INSTRUCTION.SYNCWRITE, 116, 4, 60, [3], [2048]],
                    [Entry.Robotis_rb.INSTRUCTION.SYNCWRITE, 116, 4, 60, [4], [2048]],

                    [Entry.Robotis_rb.INSTRUCTION.SYNCWRITE, 116, 4, 60, [5], [2048]],
                    [Entry.Robotis_rb.INSTRUCTION.SYNCWRITE, 116, 4, 60, [6], [2048]],
                    [Entry.Robotis_rb.INSTRUCTION.SYNCWRITE, 116, 4, 60, [7], [2048]],
                    [Entry.Robotis_rb.INSTRUCTION.SYNCWRITE, 116, 4, 60, [8], [2048]],

                    [Entry.Robotis_rb.INSTRUCTION.SYNCWRITE, 116, 4, 60, [1], [1948]],
                    [Entry.Robotis_rb.INSTRUCTION.SYNCWRITE, 116, 4, 60, [2], [1948]],
                    [Entry.Robotis_rb.INSTRUCTION.SYNCWRITE, 116, 4, 60, [3], [1948]],
                    [Entry.Robotis_rb.INSTRUCTION.SYNCWRITE, 116, 4, 60, [4], [1948]],

                    [Entry.Robotis_rb.INSTRUCTION.SYNCWRITE, 116, 4, 60, [5], [1948]],
                    [Entry.Robotis_rb.INSTRUCTION.SYNCWRITE, 116, 4, 60, [6], [1948]],
                    [Entry.Robotis_rb.INSTRUCTION.SYNCWRITE, 116, 4, 60, [7], [1948]],
                    [Entry.Robotis_rb.INSTRUCTION.SYNCWRITE, 116, 4, 60, [8], [1948]],*/

                ];
               
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    100
                    //Entry.Robotis_openCM70.delay
                );
            },
            syntax: { js: [], py: ['Robotis.opencm70_cm_led(%1, %2)'] },
        },
        robotis_openCM70_RGee_go: {
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
                    type: 'Dropdown',
                    options: [
                        ['전진', '1'],
                        ['후진', '2'],
                        ['좌회전', '3'],
                        ['우회전', '4'],
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
                    null,
                ],
                type: 'robotis_openCM70_RGee_go',
            },
            paramsKeyMap: {
                SPEED: 0,
                DIRECTION: 1,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_rb'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var speed = script.getNumberValue('SPEED', script);
                var direction = script.getField('DIRECTION', script);
                
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 710;
                var data_length = 2;
                var data_value = 0;
                
                switch(direction) {
                    case '1':
                        data_value = speed * 256 + speed;
                        break;
                    case '2':
                        data_value = (256 - speed) * 256 + (256 - speed);
                        break;
                    case '4':
                        data_value = speed * 256 + (256 - speed);
                        break;
                    case '3':
                        data_value = (256 - speed) * 256 + speed;
                        break;
                    default:
                        data_value = 0;
                        break;
                }
                console.log(speed);
                var data_sendqueue = [
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                    ],
                ];
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay
                );
            },
            syntax: {
                js: [],
                py: ['Robotis.opencm70_RGee_go(%1, %2)'],
            },
        },
        robotis_openCM70_RGee_stop: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [
                   
                ],
                type: 'robotis_openCM70_RGee_stop',
            },
            paramsKeyMap: {
                SPEED: 0,
                DIRECTION: 1,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_rb'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var speed = script.getNumberValue('SPEED', script);
                var direction = script.getField('DIRECTION', script);
                
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 710;
                var data_length = 2;
                var data_value = 0;
            
                console.log("rg stop send");
                var data_sendqueue = [
                    [
                        data_instruction,
                        data_address,
                        data_length,
                        data_value,
                    ],
                ];
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay
                );
            },
            syntax: {
                js: [],
                py: ['Robotis.opencm70_RGee_stop()'],
            },
        },
        robotis_openCM70_RGee_motion: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ["일어서기", '50007'],
                        ["앉기", '50008'], //Lang.Blocks.robotis_common_green_color
                        ["발버둥", '50071'],
                        ["발들기", '50072'],
                    ],
                    value: '50007',
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
                params: [null],
                type: 'robotis_openCM70_RGee_motion',
            },
            paramsKeyMap: {
                MotionNumber: 0,
            },
            class: 'robotis_openCM70_cm',
            isNotFor: ['Robotis_rb'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 0;
                var data_length = 0;
                var data_value = 0;

                data_address =
                    Entry.Robotis_rb.CONTROL_TABLE.CM_MOTION[0];
                data_length = Entry.Robotis_rb.CONTROL_TABLE.CM_MOTION[1];
                data_value = script.getField('MotionNumber', script);

                console.log("rg motion send");
                var data_sendqueue = [
                    [data_instruction, data_address, data_length, data_value],
                    //[data_instruction, data_address, data_length, 0],
                ];
                
                //console.log(script);
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    
                    data_value > 50070 ? 2000 : 1000 
                    //Entry.Robotis_openCM70.delay
                );
            },
            syntax: { js: [], py: ['Robotis.opencm70_RGee_motion(%1)'] },
        },
        robotis_RB_cm_motion: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['기본자세', '1'],
                        ["전진", '25'],
                        ["우전진", '46'],
                        ["좌전진", '47'],
                        ["후진", '37'], //Lang.Blocks.robotis_common_green_color
                        ["오른쪽으로", '38'],
                        ["왼쪽으로", '39'],
                        ["우회전", '41'],
                        ["좌회전", '40'],
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
                        ['오른손 들기', '26'],
                        ["오른손 내리기", '27'],
                        ["왼손 들기", '28'],
                        ["왼손 내리기", '29'],
                        ["양손 들기", '30'], //Lang.Blocks.robotis_common_green_color
                        ["양손 내리기", '31'],
                        ["뒤로 넘어지기", '32'],
                        ["앞으로 넘어지기", '33'],
                        ["앞으로 일어서기", '48'],
                        ["뒤로 일어서기", '35'],
                        ["방어", '36'],
                        ["공격1", '42'],
                        ["공격2", '43'],
                        ["공격3", '44'],
                        ["공격4", '45'],
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
       
        
       
        robotis_RB_cm_custom: {
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
                    type: 'Dropdown',
                    options: [
                        ['BYTE', 'BYTE'],
                        ['WORD', 'WORD'],
                        ['DWORD', 'DWORD'],
                    ],
                    value: 'BYTE',
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
                params: [
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    null,
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'robotis_RB_cm_custom',
            },
            paramsKeyMap: {
                ADDRESS: 0,
                LENGTH: 1,
                VALUE: 2,
            },
            class: 'robotis_openCM70_custom',
            isNotFor: ['Robotis_rb'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 0;
                var data_length = 0;
                var data_value = 0;

                data_address = script.getNumberValue('ADDRESS');
                data_value = script.getNumberValue('VALUE');
               
                switch(script.getField('LENGTH')){
                    case 'BYTE':
                        data_length = 1;
                        break;
                    case 'WORD':
                        data_length = 2;
                        break;
                    case 'DWORD':
                        data_length = 4;
                        break;
                    default:
                        break;
                }

                var data_sendqueue = [
                    [data_instruction, data_address, data_length, data_value],
                ];
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay
                );
            },
            syntax: { js: [], py: ['Robotis.opencm70_cm_custom(%1, %2)'] },
        },
        robotis_RB_cm_custom2: {
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
                    type: 'Dropdown',
                    options: [
                        ['BYTE', 'BYTE'],
                        ['WORD', 'WORD'],
                        ['DWORD', 'DWORD'],
                    ],
                    value: 'BYTE',
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
                params: [
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    null,
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'robotis_RB_cm_custom2',
            },
            paramsKeyMap: {
                ADDRESS: 0,
                LENGTH: 1,
                VALUE: 2,
            },
            class: 'robotis_openCM70_custom',
            isNotFor: ['Robotis_rb_H'],
            func: function (sprite, script) {
                // instruction / address / length / value / default length
                var data_instruction = Entry.Robotis_rb.INSTRUCTION.WRITE;
                var data_address = 0;
                var data_length = 0;
                var data_value = 0;

                data_address = script.getNumberValue('ADDRESS');
                data_value = script.getNumberValue('VALUE');
               
                switch(script.getField('LENGTH')){
                    case 'BYTE':
                        data_length = 1;
                        break;
                    case 'WORD':
                        data_length = 2;
                        break;
                    case 'DWORD':
                        data_length = 4;
                        break;
                    default:
                        break;
                }

                var data_sendqueue = [
                    [data_instruction, data_address, data_length, data_value],
                ];
                return Entry.Robotis_carCont.postCallReturn(
                    script,
                    data_sendqueue,
                    Entry.Robotis_openCM70.delay
                );
            },
            syntax: { js: [], py: ['Robotis.opencm70_cm_custom(%1, %2)'] },
        },
        //endregion robotis 로보티즈
    };
};




module.exports = [Entry.Robotis_rb, Entry.Robotis_rb_H];
