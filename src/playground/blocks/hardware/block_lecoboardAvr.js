'use strict';

Entry.lecoboardAvr = {
    id: '3C.3',
    name: 'lecoboardAvr',
    url: 'http://www.fnj.or.kr/',
    imageName: 'lecoboardAvr.png',
    title: {
        ko: '레코보드2.0',
        en: 'LECOBOARD2.0',
    },
    setZero() {
        Entry.hw.sendQueue.readablePorts = [];
        for (var port = 0; port < 34; port++) {
            if (port == 13 || port == 14 || port == 15 || port == 16 || port == 33) {
                Entry.hw.sendQueue[port] = 1;
            } else if (port == 17) {
                Entry.hw.sendQueue[port] = 0;
            } else {
                Entry.hw.sendQueue[port] = 0;
                Entry.hw.sendQueue.readablePorts.push(port);
            }
        }
        if (!Entry.hw.sendQueue.SET) {
            Entry.hw.sendQueue = {
                GET: {},
                SET: {},
            };
        } else {
            const keySet = Object.keys(Entry.hw.sendQueue.SET);
            keySet.forEach((key) => {
                Entry.hw.sendQueue.SET[key].data = 0;
                Entry.hw.sendQueue.SET[key].time = new Date().getTime();
            });
        }
        Entry.hw.update();
    },
    sensorTypes: {
        ALIVE: 0,
        DIGITAL: 1,
        ANALOG: 2,
        PWM: 3,
        SERVO_PIN: 4,
        TONE: 5,
        PULSEIN: 6,
        ULTRASONIC: 7,
        TIMER: 8,
        LCD: 9,
        LCD_COMMAND: 10,
        BLE_WRITE: 11,
        BLE_READ: 12,        
        ARM_XYZ: 13,
        ARM_WG: 14,
        HUSKY: 15,
        HUSKY_GET: 16,
        HUSKY_GET_LEARNED_ID_CNT: 17,
        HUSKY_GET_BLOCK_CNT: 18,
        HUSKY_GET_ARROW_CNT: 19,
        HUSKY_GET_ID: 20,
        HUSKY_GET_XD: 21,
        HUSKY_GET_YD: 22,
        HUSKY_GET_WD: 23,
        HUSKY_GET_HT: 24, 
        HUSKY_GET_ID_BL_EXIST: 25,
        HUSKY_GET_ID_AR_EXIST: 26,
        HUSKY_GET_BLOCK_INFO: 27,
        HUSKY_GET_ARROW_INFO: 28, 
        HUSKY_GET_ID_LEARNED: 29,
    },



    toneTable: {
        0: 0,
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
        C2: 13,
    },
    toneMap: {
        1: [33, 65, 131, 262, 523, 1046, 2093, 4186],
        2: [35, 69, 139, 277, 554, 1109, 2217, 4435],
        3: [37, 73, 147, 294, 587, 1175, 2349, 4699],
        4: [39, 78, 156, 311, 622, 1245, 2849, 4978],
        5: [41, 82, 165, 330, 659, 1319, 2637, 5274],
        6: [44, 87, 175, 349, 698, 1397, 2794, 5588],
        7: [46, 92, 185, 370, 740, 1480, 2960, 5920],
        8: [49, 98, 196, 392, 784, 1568, 3136, 6272],
        9: [52, 104, 208, 415, 831, 1661, 3322, 6645],
        10: [55, 110, 220, 440, 880, 1760, 3520, 7040],
        11: [58, 117, 233, 466, 932, 1865, 3729, 7459],
        12: [62, 123, 247, 494, 988, 1976, 3951, 7902],
        13: [65, 131, 262, 523, 1046, 2093, 4186, 8372],
    },
    highList: ['high', '1', 'on'],
    lowList: ['low', '0', 'off'],
    BlockState: {},
    monitorTemplate: {
        //imgPath: 'hw/lecoboard.png',
        //keys: ['value'],
        width: 800,
        height: 600,
        listPorts: {
            BLE_READ: {
                name: '블루투스',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            ULTRASONIC: {
                name: '초음파센서',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            4: {
                name: '버튼입력',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            a0: {
                name: '조도센서',
                type: 'input',
                pos: { x: 0, y: 0 },
            },
            a1: {
                name: '가변저항',
                type: 'input',
                pos: { x: 200, y: 0 },
            },
            a2: {
                name: '습도센서',
                type: 'input',
                pos: { x: 400, y: 0 },
            },
            a7: {
                name: '온도센서',
                type: 'input',
                pos: { x: 600, y: 0 },
            },
            a3: {
                name: '아날로그1',
                type: 'input',
                pos: { x: 0, y: 500 },
            },
            a4: {
                name: '아날로그2',
                type: 'input',
                pos: { x: 200, y: 500 },
            },
            a5: {
                name: '아날로그3',
                type: 'input',
                pos: { x: 400, y: 500 },
            },
            a6: {
                name: '아날로그4',
                type: 'input',
                pos: { x: 600, y: 500 },
            },
            28: {
                name: '입력1',
                type: 'input',
                pos: { x: 0, y: 400 },
            },
            29: {
                name: '입력2',
                type: 'input',
                pos: { x: 200, y: 400 },
            },
            1: {
                name: '입력3',
                type: 'input',
                pos: { x: 400, y: 400 },
            },
            0: {
                name: '입력4',
                type: 'input',
                pos: { x: 600, y: 400 },
            },
        },
        mode: 'both',
    },
};

Entry.lecoboardAvr.setLanguage = function() {
    return {
        ko: {
            template: {
                lecoboardAvr_button_read: '버튼 읽어오기',
                lecoboardAvr_button_read_bool: '버튼 읽어오기',
                lecoboardAvr_ultrasonic_read: '초음파센서 읽어오기',
                lecoboardAvr_cds_read: '조도센서 읽어오기',
                lecoboardAvr_var_read: '가변저항 읽어오기',
                lecoboardAvr_ir_read: '습도센서 읽어오기',
                lecoboardAvr_temp_read: '온도센서 읽어오기',
                lecoboardAvr_analog_read: '아날로그입력 %1 읽어오기',
                lecoboardAvr_digital_read: '디지털 %1 읽어오기',
                lecoboardAvr_dual_led_color_toggle: 'LED %1 색으로 정하기 %2',
                lecoboardAvr_dual_led_toggle: 'LED 녹색 %1 빨강 %2 으로 정하기 %3',
                lecoboardAvr_led_rgb_toggle: 'RGB LED R%1 G%2 B%3 %4',
                //lecoboardAvr_led_strip_toggle: 'LED 스트립 빨강%1 녹색%2 파랑%3 노랑%4 %5',
                lecoboardAvr_set_tone: '부저를 %1 음으로 %2 박자로 연주하기 %3',
                lecoboardAvr_set_tone_long: '부저를 %1 음으로 연주하기 %2',
                lecoboardAvr_set_freq_tone: '신호음 %1번핀에서 %2 주파수로 %3 동안 연주하기 %4',
                lecoboardAvr_set_tone_off: '부저 끄기 %1',
                lecoboardAvr_set_servo: '%1번 서보모터 %2°로 정하기 %3',
                lecoboardAvr_dc_motor: '%1번 DC모터 %2방향으로 속력%3 으로 정하기 %4',
                lecoboardAvr_dc_motor_stop: 'DC 모터 정지하기',
                lecoboardAvr_digital_write: '디지털 %1번핀에 %2 보내기 %3',
                lecoboardAvr_digital_pwm: 'PWM %1 번핀에 %2 보내기 %3',
                lecoboardAvr_convert_value: '%1의 값을 %2부터 %3까지의 값으로 변환하기 %4',
                lecoboardAvr_lcd_command: 'LCD 설정 %1 %2',
                lecoboardAvr_set_lcd: 'LCD %1번째줄 %2번째칸에 %3을 출력하기 %4',
                lecoboardAvr_send_ble: '블루투스로 %1을 보내기 %2',
                lecoboardAvr_get_bluetooth: '블루투스에서 읽어오기',                
                lecoboardAvr_arm_control: '로봇팔 X%1 Y%2 Z%3 %4',
                lecoboardAvr_arm_gripper_control: '로봇팔 그리퍼 A%1 G%2 %3',
                lecoboardAvr_husky_al_set: '허스키렌즈 알고리즘 %1(으)로 설정하기 %2',
                lecoboardAvr_husky_get_learn: '허스키렌즈 학습한 ID수 읽어오기',
                lecoboardAvr_husky_get_item: '허스키렌즈 화면에 인식된 %1 읽어오기',
                lecoboardAvr_husky_get_ID: '허스키렌즈 화면에 인식된 ID %1 %2 읽어오기',
                lecoboardAvr_husky_get_closest_block: '허스키렌즈 화면 중심에서 가까운 %1 프레임 읽어오기',
                lecoboardAvr_husky_get_closest_arrow: '허스키렌즈 화면 중심에서 가까운 %1 화살표 읽어오기',
                lecoboardAvr_husky_get_id_block: '허스키렌즈 ID %1의 프레임에서 %2 읽어오기',
                lecoboardAvr_husky_get_id_arrow: '허스키렌즈 ID %1의 화살표에서 %2 읽어오기',
                lecoboardAvr_husky_get_id_learned: '허스키렌즈 학습한 ID %1이 있는지 읽어오기',
                


                /*
                lecoboardAvr_dc_motor_for_sec: '%1번 DC모터 %2방향으로 속력%3 으로 %4초 동안 동작하기 %5',*/
            },
        },
        en: {
            template: {
                lecoboardAvr_button_read: 'Button value',
                lecoboardAvr_button_read_bool: 'Button value',
                lecoboardAvr_ultrasonic_read: 'Read ultrasonic sensor',
                lecoboardAvr_cds_read: 'Read cds sensor',
                lecoboardAvr_var_read: 'Read var sensor',
                lecoboardAvr_ir_read: 'Read  Humidity sensor',
                lecoboardAvr_temp_read: 'Read temperature sensor',
                lecoboardAvr_analog_read: 'Read Analog Input %1',
                lecoboardAvr_digital_read: 'Read Digital %1 Pin',
                lecoboardAvr_dual_led_color_toggle: 'LED %1 color %2',
                lecoboardAvr_dual_led_toggle: 'LED green %1 red %2 value %3',
                lecoboardAvr_set_tone: 'buzzer %1 tone %2 sec play %3',
                lecoboardAvr_led_rgb_toggle: 'RGB LED R%1 G%2 B%3 %4',
                //lecoboardAvr_led_strip_toggle: 'LED strip red%1 green%2 blue%3 yellow%4 %5',
                lecoboardAvr_set_tone_long: 'buzzer %1 tone play %2',
                lecoboardAvr_set_freq_tone: 'buzzer %1 pin %2 Hz %3 ms %4',
                lecoboardAvr_set_tone_off: 'buzzer off',
                lecoboardAvr_set_servo: '%1 Sevomotor angle as %2 %3',
                lecoboardAvr_dc_motor: '%1 DC motor direction %2 speed %3 %4',
                /*
                lecoboardAvr_dc_motor_for_sec: '%1 DC motor direction %2 speed %3 sec %4 %5', */
                lecoboardAvr_dc_motor_stop: 'DC motor stop',
                lecoboardAvr_digital_write: 'Digital %1 port as %2 %3',
                lecoboardAvr_digital_pwm: 'PWM %1 pin %2 out %3',
                lecoboardAvr_convert_value: 'Convert value %1 from %2 to %3 %4',
                lecoboardAvr_lcd_command: 'Set LCD cmd %1 %2',
                lecoboardAvr_set_lcd: 'Set LCD data %1 %2 %3 %4',
                lecoboardAvr_send_ble: 'BLE print %1 %2',
                lecoboardAvr_get_bluetooth: 'Read from BLE',
                lecoboardAvr_arm_control: 'Arm X%1 Y%2 Z%3 %4',
                lecoboardAvr_arm_gripper_control: 'Arm gripper A%1 G%2 %3',
                lecoboardAvr_husky_al_set: 'Huskylens Algorithm set as %1 %2',
                lecoboardAvr_husky_get_learn: 'Read number of learned IDs',
                lecoboardAvr_husky_get_item: 'Read check if %1 on screen',
                lecoboardAvr_husky_get_ID: 'Read check if ID %1 of %2 on screen',
                lecoboardAvr_husky_get_closest_block: 'Read %1 of frames closest to the center of screen',
                lecoboardAvr_husky_get_closest_arrow: 'Read %1 of arrows closest to the center of screen',
                lecoboardAvr_husky_get_id_block: 'Read frame ID %1  %2',
                lecoboardAvr_husky_get_id_arrow: 'Read arrow ID %1  %2',
                lecoboardAvr_husky_get_id_learned: 'Read Learned ID %1',
            },
        },
    };
};

Entry.lecoboardAvr.blockMenuBlocks = [
    'lecoboardAvr_led_rgb_toggle',
    'lecoboardAvr_dual_led_color_toggle',
    'lecoboardAvr_dual_led_toggle',
    //'lecoboardAvr_led_strip_toggle',
    'lecoboardAvr_button_read_bool',
    'lecoboardAvr_button_read',
    'lecoboardAvr_ultrasonic_read',
    'lecoboardAvr_cds_read',
    'lecoboardAvr_var_read',
    'lecoboardAvr_ir_read',
    'lecoboardAvr_temp_read',
    'lecoboardAvr_analog_read',
    'lecoboardAvr_digital_read',
    'lecoboardAvr_convert_value',
    'lecoboardAvr_set_tone',
    'lecoboardAvr_set_tone_long',
    'lecoboardAvr_set_freq_tone',
    'lecoboardAvr_set_tone_off',
    'lecoboardAvr_set_servo',
    'lecoboardAvr_dc_motor',
    //'lecoboardAvr_dc_motor_for_sec',
    'lecoboardAvr_dc_motor_stop',
    'lecoboardAvr_digital_write',
    'lecoboardAvr_digital_pwm',
    'lecoboardAvr_lcd_command',
    'lecoboardAvr_set_lcd',
    'lecoboardAvr_send_ble',
    'lecoboardAvr_get_bluetooth',    
    'lecoboardAvr_arm_control',
    'lecoboardAvr_arm_gripper_control',
    'lecoboardAvr_husky_al_set',
    'lecoboardAvr_husky_get_learn',
    'lecoboardAvr_husky_get_id_learned',
    'lecoboardAvr_husky_get_item',
    'lecoboardAvr_husky_get_ID',
    'lecoboardAvr_husky_get_closest_block',
    'lecoboardAvr_husky_get_closest_arrow',
    'lecoboardAvr_husky_get_id_block',
    'lecoboardAvr_husky_get_id_arrow',
    
];

Entry.lecoboardAvr.getBlocks = function() {
    return {
        
        lecoboardAvr_husky_al_set: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['얼굴 인식하기', '1'],
                        ['사물 따라가기', '2'],
                        ['사물 인식하기', '3'],
                        ['선 따라가기', '4'],
                        ['색깔 인식하기', '5'],
                        ['태그 인식하기', '6'],
                    ],
                    value: '1',
                    size: 12,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [1,null],
                type: 'lecoboardAvr_husky_al_set',
            },
            paramsKeyMap: {
                VALUE1: 0,
            },
            class: 'lecoboardHuskylens',
            isNotFor: ['lecoboardAvr'],
            func(sprite, script) {                  
                let huskyitem = 1;      
                let huskyset = script.getNumberValue('VALUE1',script);
                
                let port = 0;

                port=1;
                if (!Entry.hw.sendQueue.SET) Entry.hw.sendQueue.SET = {};
                Entry.hw.sendQueue.SET[port] = {
                    type: 15, 
                    data: {
                        huskyitem,
                        huskyset,
                    },
                    time: new Date().getTime(),
                };    
                return script.callReturn();
            },
        },
        lecoboardAvr_husky_get_learn: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},     
            def: {
                params: [],
                type: 'lecoboardAvr_husky_get_learn',
            },
            paramsKeyMap: {},
            class: 'lecoboardHuskylens',
            isNotFor: ['lecoboardAvr'],
            func(sprite, script) {
                const item = 1;
                const id = 0;
                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                Entry.hw.sendQueue.GET[16/*Entry.lecoboardAvr.sensorTypes.HUSKY*/] = {
                    port: item,
                    data: id,
                    time: new Date().getTime(),
                };
                return Entry.hw.portData.HUSKYLENS_LEARNED_CNT;
            },
        },
        lecoboardAvr_husky_get_item: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['프레임', '2'],
                        ['화살표', '3'],
                    ],
                    value: '2',
                    size: 12,
                },                
            ],
            events: {},
            def: {
                params: [2],
                type: 'lecoboardAvr_husky_get_item',
            },
            paramsKeyMap: {
                VALUE1: 0,
            },
            class: 'lecoboardHuskylens',
            isNotFor: ['lecoboardAvr'],
            func(sprite, script) {
                const id = 0;
                let result = 0;
                const item = script.getNumberValue('VALUE1',script);
                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                Entry.hw.sendQueue.GET[16/*Entry.lecoboardAvr.sensorTypes.HUSKY*/] = {
                    port: item,
                    data: id,
                    time: new Date().getTime(),
                };
                if(item==2)
                    if(Entry.hw.portData.HUSKYLENS_BL_EXIST>0)result = true;
                    else result = false;
                else if(item==3)
                    if(Entry.hw.portData.HUSKYLENS_AR_EXIST>0)result = true;
                    else result = false;
                else result = false;
                return result;
            },
        },
        lecoboardAvr_husky_get_ID: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['프레임', '4'],
                        ['화살표', '5'],
                    ],
                    value: '4',
                    size: 12,
                },  
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'number',
                        params: [1,4],
                    },
                ],
                type: 'lecoboardAvr_husky_get_ID',
            },
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
            },
            class: 'lecoboardHuskylens',
            isNotFor: ['lecoboardAvr'],
            func(sprite, script) {
                let id = script.getNumberValue('VALUE1',script);;
                let result = 0;
                let item = script.getNumberValue('VALUE2',script);
                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                Entry.hw.sendQueue.GET[16/*Entry.lecoboardAvr.sensorTypes.HUSKY*/] = {
                    port: item,
                    data: id,
                    time: new Date().getTime(),
                };
                if(item==4)
                    if(Entry.hw.portData.HUSKYLENS_BLID_EXIST>0)result = true;
                    else result = false;
                else if(item==5)
                    if(Entry.hw.portData.HUSKYLENS_ARID_EXIST>0)result = true;
                    else result = false;
                else result = false;
               
                return result;
            },
        },
        lecoboardAvr_husky_get_closest_block: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['ID', '1'],
                        ['X 중심점', '2'],
                        ['Y 중심점', '3'],
                        ['좌우 크기', '4'],
                        ['상하 크기', '5'],
                    ],
                    value: '1',
                    size: 12,
                },                
            ],
            events: {},
            def: {
                params: [1],
                type: 'lecoboardAvr_husky_get_closest_block',
            },
            paramsKeyMap: {
                VALUE1: 0,
            },
            class: 'lecoboardHuskylens',
            isNotFor: ['lecoboardAvr'],
            func(sprite, script) {
                const id = 0;
                let result = script.getNumberValue('VALUE1',script);
                let item = 6;
                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                Entry.hw.sendQueue.GET[16/*Entry.lecoboardAvr.sensorTypes.HUSKY*/] = {
                    port: item,
                    data: id,
                    time: new Date().getTime(),
                };
                
                if(result>=1)
                    return Entry.hw.portData.HUSKYLENS_RESULT[result-1];
                else return 0;
            },
        },
        lecoboardAvr_husky_get_closest_arrow: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['ID', '1'],
                        ['X 시작점', '2'],
                        ['Y 시작점', '3'],
                        ['X 끝점', '4'],
                        ['Y 끝점', '5'],
                    ],
                    value: '1',
                    size: 12,
                },                
            ],
            events: {},
            def: {
                params: [1],
                type: 'lecoboardAvr_husky_get_closest_arrow',
            },
            paramsKeyMap: {
                VALUE1: 0,
            },
            class: 'lecoboardHuskylens',
            isNotFor: ['lecoboardAvr'],
            func(sprite, script) {
                const id = 0;
                let result = script.getNumberValue('VALUE1',script);
                let item = 7;
                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                Entry.hw.sendQueue.GET[16/*Entry.lecoboardAvr.sensorTypes.HUSKY*/] = {
                    port: item,
                    data: id,
                    time: new Date().getTime(),
                };
                if(result>=1)
                    return Entry.hw.portData.HUSKYLENS_RESULT[result-1];
                else return 0;
            },
        },
        lecoboardAvr_husky_get_id_block: {
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
                {
                    type: 'Dropdown',
                    options: [
                        ['X 중심점', '1'],
                        ['Y 중심점', '2'],
                        ['좌우 크기', '3'],
                        ['상하 크기', '4'],
                    ],
                    value: '1',
                    size: 12,
                },                
            ],
            events: {},
            def: {
                params: [1,1],
                type: 'lecoboardAvr_husky_get_id_block',
            },
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
            },
            class: 'lecoboardHuskylens',
            isNotFor: ['lecoboardAvr'],
            func(sprite, script) {
                const id = script.getNumberValue('VALUE1',script);
                let result = script.getNumberValue('VALUE2',script);
                let item = 8;
                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                Entry.hw.sendQueue.GET[16/*Entry.lecoboardAvr.sensorTypes.HUSKY*/] = {
                    port: item,
                    data: id,
                    time: new Date().getTime(),
                };
                if(result>=1)
                    return Entry.hw.portData.HUSKYLENS_RESULT[result];
                else return 0;
            },
        },
        lecoboardAvr_husky_get_id_arrow: {
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
                {
                    type: 'Dropdown',
                    options: [
                        ['X 시작점', '1'],
                        ['Y 시작점', '2'],
                        ['X 끝점', '3'],
                        ['Y 끝점', '4'],
                    ],
                    value: '1',
                    size: 12,
                },                
            ],
            events: {},
            def: {
                params: [1,1],
                type: 'lecoboardAvr_husky_get_id_arrow',
            },
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
            },
            class: 'lecoboardHuskylens',
            isNotFor: ['lecoboardAvr'],
            func(sprite, script) {
                const id = script.getNumberValue('VALUE1',script);
                let result = script.getNumberValue('VALUE2',script);;
                let item = 9;
                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                Entry.hw.sendQueue.GET[16/*Entry.lecoboardAvr.sensorTypes.HUSKY*/] = {
                    port: item,
                    data: id,
                    time: new Date().getTime(),
                };
                if(result>=1)
                    return Entry.hw.portData.HUSKYLENS_RESULT[result];
                else return 0;
            },
        },
        lecoboardAvr_husky_get_id_learned: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            fontSize: 14,
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',                    
                    size: 12,
                },       
            ],
            events: {},
            def: {
                params: [1],
                type: 'lecoboardAvr_husky_get_id_learned',
            },
            paramsKeyMap: {
                VALUE1: 0,
            },
            class: 'lecoboardHuskylens',
            isNotFor: ['lecoboardAvr'],
            func(sprite, script) {
                const id = script.getNumberValue('VALUE1',script);
                const item = 10;
                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                Entry.hw.sendQueue.GET[16/*Entry.lecoboardAvr.sensorTypes.HUSKY*/] = {
                    port: item,
                    data: id,
                    time: new Date().getTime(),
                };
                return Entry.hw.portData.HUSKYLENS_ID_LEARNED;
            },
        },
        lecoboardAvr_arm_control: {
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
                params: [
                    {
                        type: 'number',
                        params: [0],
                    },
                    {
                        type: 'number',
                        params: [95],
                    },
                    {
                        type: 'number',
                        params: [185],
                    },
                    null,
                ],
                type: 'lecoboardAvr_arm_control',
            },
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
                VALUE3: 2,
            },
            class: 'lecoboardRobotArm',
            isNotFor: ['lecoboardAvr'],
            func(sprite, script) {                
                let value_x = script.getNumberValue('VALUE1',script);
                let value_y = script.getNumberValue('VALUE2',script);
                let value_z = script.getNumberValue('VALUE3',script);
                let port = 0;

                value_x = value_x*10;
                value_y = value_y*10;
                value_z = value_z*10;

                port=31;
                if (!Entry.hw.sendQueue.SET) Entry.hw.sendQueue.SET = {};
                Entry.hw.sendQueue.SET[1] = {
                    type: Entry.lecoboardAvr.sensorTypes.ARM_XYZ,
                    data: {
                        value_x,
                        value_y,
                        value_z,
                    },
                    time: new Date().getTime(),
                };  
                return script.callReturn();
            },
        },
        lecoboardAvr_arm_gripper_control: {
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
                params: [
                    {
                        type: 'number',
                        params: [0],
                    },
                    {
                        type: 'number',
                        params: [45],
                    },
                    null,
                ],
                type: 'lecoboardAvr_arm_gripper_control',
            },
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
            },
            class: 'lecoboardRobotArm',
            isNotFor: ['lecoboardAvr'],
            func(sprite, script) {                
                let value_w = script.getNumberValue('VALUE1',script);
                let value_g = script.getNumberValue('VALUE2',script);
                let port = 0;

                value_w = value_w*10;
                value_g = value_g*10;
                

                port=32;
                if (!Entry.hw.sendQueue.SET) Entry.hw.sendQueue.SET = {};
                Entry.hw.sendQueue.SET[port] = {
                    type: Entry.lecoboardAvr.sensorTypes.ARM_WG,
                    data: {
                        value_w,
                        value_g,
                    },
                    time: new Date().getTime(),
                };    
                return script.callReturn();
            },
        },
        lecoboardAvr_port_highlow_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['0', '0'],
                        ['1', '1'],
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
                PORTVALUE: 0,
            },
            func(sprite, script) {
                return script.getField('PORTVALUE');
            },
        },
        lecoboardAvr_digital_write: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    //accept: 'string',
                    defaultType: 'number',
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
                        type: 'lecoboardAvr_servomotor_list',
                        params: [1],
                    },
                    {
                        type: 'arduino_get_digital_toggle',
                        params: ['on'],
                    },
                    null,
                ],
                type: 'lecoboardAvr_digital_write',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'lecoboardTest',
            isNotFor: ['lecoboardAvr'],
            func(sprite, script) {
                let port = script.getNumberValue('PORT');
                let value = script.getValue('VALUE');

                if (port == 1) port = 28;
                else if (port == 2) port = 29;
                else if (port == 3) port = 1;
                else if (port == 4) port = 0;

                /*
                if (value == 1) value = 255;
                else value = 0;
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[port] = {
                    type: Entry.ArduinoExt.sensorTypes.DIGITAL,
                    data: value,
                    time: new Date().getTime(),
                };
                */

                if (typeof value === 'string') value = value.toLowerCase();
                if (Entry.lecoboardAvr.highList.indexOf(value) > -1) value = 255;
                else if (Entry.lecoboardAvr.lowList.indexOf(value) > -1) value = 0;
                else throw new Error();
                if (!Entry.hw.sendQueue.SET) Entry.hw.sendQueue.SET = {};
                Entry.hw.sendQueue.SET[port] = {
                    type: Entry.lecoboardAvr.sensorTypes.DIGITAL,
                    data: value,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
        },
        lecoboardAvr_digital_pwm: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    //accept: 'string',
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
                params: [
                    {
                        type: 'lecoboardAvr_servomotor_list',
                        params: [1],
                    },
                    {
                        type: 'text',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'lecoboardAvr_digital_pwm',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'lecoboardTest',
            isNotFor: ['lecoboardAvr'],
            func(sprite, script) {
                let port = script.getNumberValue('PORT');
                let value = script.getNumberValue('VALUE');

                if (port == 1) port = 28;
                else if (port == 2) port = 29;
                else if (port == 3) port = 1;
                else if (port == 4) port = 0;

                value = 255 * (value / 100);
                value = Math.round(value);
                value = Math.max(value, 0);
                value = Math.min(value, 100);

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[port] = {
                    type: Entry.ArduinoExt.sensorTypes.PWM,
                    data: value,
                    time: new Date().getTime(),
                };
                return script.callReturn();
            },
        },
        lecoboardAvr_analog_input_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', '3'],
                        ['2', '4'],
                        ['3', '5'],
                        ['4', '6'],
                    ],
                    value: '3',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [3],
            },
            paramsKeyMap: {
                PORT: 0,
            },
            func(sprite, script) {
                return script.getField('PORT');
            },
        },
        lecoboardAvr_button_read_bool: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            params: [
                {
                    type: 'TextInput',
                },
            ],
            events: {},
            def: {
                params: ['4'],
                type: 'lecoboardAvr_button_read_bool',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'LecoboardAnalogRead',
            isNotFor: ['lecoboardAvr'],
            func(sprite, script) {
                const port = 4;
                const DIGITAL = Entry.hw.portData.DIGITAL;
                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                Entry.hw.sendQueue.GET[Entry.lecoboardAvr.sensorTypes.DIGITAL] = {
                    port,
                    time: new Date().getTime(),
                };
                let value = DIGITAL[port];
                if (value == 0) value = 1;
                else value = 0;
                return value;
            },
        },
        lecoboardAvr_button_read: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            params: [
                {
                    type: 'TextInput',
                },
            ],
            events: {},
            def: {
                params: ['4'],
                type: 'lecoboardAvr_button_read',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'LecoboardAnalogRead',
            isNotFor: ['lecoboardAvr'],
            func(sprite, script) {
                const port = 4;
                const DIGITAL = Entry.hw.portData.DIGITAL;
                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                Entry.hw.sendQueue.GET[Entry.lecoboardAvr.sensorTypes.DIGITAL] = {
                    port,
                    time: new Date().getTime(),
                };
                let value = DIGITAL[port];
                if (value == 0) value = 1;
                else value = 0;
                return value;
                //return DIGITAL ? DIGITAL[port] || 0 : 1;
            },
        },
        lecoboardAvr_ultrasonic_read: {
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
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'arduino_get_port_number',
                        params: ['6'],
                    },
                    {
                        type: 'arduino_get_port_number',
                        params: ['5'],
                    },
                ],
                type: 'lecoboardAvr_ultrasonic_read',
            },
            paramsKeyMap: {
                PORT1: 0,
                PORT2: 1,
            },
            class: 'LecoboardAnalogRead',
            isNotFor: ['lecoboardAvr'],
            func(sprite, script) {
                const port1 = script.getNumberValue('PORT1', script);
                const port2 = script.getNumberValue('PORT2', script);

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                delete Entry.hw.sendQueue.SET[port1];
                delete Entry.hw.sendQueue.SET[port2];

                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                Entry.hw.sendQueue.GET[Entry.ArduinoExt.sensorTypes.ULTRASONIC] = {
                    port: [port1, port2],
                    time: new Date().getTime(),
                };
                return Entry.hw.portData.ULTRASONIC || 0;
            },
        },
        lecoboardAvr_analog_read: {
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
                params: [
                    {
                        type: 'lecoboardAvr_analog_input_list',
                        params: ['3'],
                    },
                ],
                type: 'lecoboardAvr_analog_read',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'LecoboardAnalogRead',
            isNotFor: ['lecoboardAvr'],
            func(sprite, script) {
                let port = script.getValue('PORT', script);
                const ANALOG = Entry.hw.portData.ANALOG;
                return ANALOG ? ANALOG[port] || 0 : 0;
            },
        },
        lecoboardAvr_cds_read: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [],
                type: 'lecoboardAvr_cds_read',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'LecoboardAnalogRead',
            isNotFor: ['lecoboardAvr'],
            func(sprite, script) {
                let port = 0;
                const ANALOG = Entry.hw.portData.ANALOG;
                return ANALOG ? ANALOG[port] || 0 : 0;
            },
        },
        lecoboardAvr_var_read: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [],
                type: 'lecoboardAvr_var_read',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'LecoboardAnalogRead',
            isNotFor: ['lecoboardAvr'],
            func(sprite, script) {
                let port = 1;
                const ANALOG = Entry.hw.portData.ANALOG;
                return ANALOG ? ANALOG[port] || 0 : 0;
            },
        },
        lecoboardAvr_ir_read: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [],
                type: 'lecoboardAvr_ir_read',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'LecoboardAnalogRead',
            isNotFor: ['lecoboardAvr'],
            func(sprite, script) {
                if (!Entry.hw.sendQueue.SET) Entry.hw.sendQueue.SET = {};
                Entry.hw.sendQueue.SET[7] = {
                    type: Entry.lecoboardAvr.sensorTypes.DIGITAL,
                    data: 1,
                    time: new Date().getTime(),
                };

                let port = 2;
                const ANALOG = Entry.hw.portData.ANALOG;
                return ANALOG ? ANALOG[port] || 0 : 0;
            },
        },
        lecoboardAvr_temp_read: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                params: [],
                type: 'lecoboardAvr_temp_read',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'LecoboardAnalogRead',
            isNotFor: ['lecoboardAvr'],
            func(sprite, script) {
                let port = 7;
                const ANALOG = Entry.hw.portData.ANALOG;
                return ANALOG ? ANALOG[port] || 0 : 0;
            },
        },
        lecoboardAvr_digital_port_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', '28'],
                        ['2', '29'],
                        ['3', '1'],
                        ['4', '0'],
                    ],
                    value: '28',
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
            func(sprite, script) {
                return script.getField('PORT');
            },
        },
        lecoboardAvr_digital_read: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'lecoboardAvr_digital_port_list',
                        params: [28],
                    },
                ],
                type: 'lecoboardAvr_digital_read',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'LecoboardAnalogRead',
            isNotFor: ['lecoboardAvr'],
            func(sprite, script) {
                const { hwModule = {} } = Entry.hw;
                const { name } = hwModule;

                const port = script.getNumberValue('PORT', script);
                const DIGITAL = Entry.hw.portData.DIGITAL;

                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                Entry.hw.sendQueue.GET[Entry.lecoboardAvr.sensorTypes.DIGITAL] = {
                    port,
                    time: new Date().getTime(),
                };
                let value = DIGITAL[port];
                if (value == 0) value = 1;
                else value = 0;
                return value;
            },
        },
        lecoboardAvr_convert_value: {
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
                        params: ['180'],
                    },
                    null,
                ],
                type: 'lecoboardAvr_convert_value',
            },
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
                VALUE3: 2,
            },
            class: 'LecoboardAnalogRead',
            isNotFor: ['lecoboardAvr'],
            func: function(sprite, script) {
                var value1 = script.getNumberValue('VALUE1', script);
                var value2 = script.getNumberValue('VALUE2', script);
                var value3 = script.getNumberValue('VALUE3', script);

                var stringValue2 = script.getValue('VALUE2', script);
                var stringValue3 = script.getValue('VALUE3', script);
                var isFloat = false;

                if (
                    (Entry.Utils.isNumber(stringValue2) && stringValue2.indexOf('.') > -1) ||
                    (Entry.Utils.isNumber(stringValue3) && stringValue3.indexOf('.') > -1)
                ) {
                    isFloat = true;
                }

                var result = value1;
                if (value2 > value3) {
                    var swap = value2;
                    value2 = value3;
                    value3 = swap;
                }
                result = result * ((value3 - value2) / (1023 - 0));
                result += value2;
                result = Math.min(value3, result);
                result = Math.max(value2, result);

                if (isFloat) {
                    result = Math.round(result * 100) / 100;
                } else {
                    result = Math.round(result);
                }

                return result;
            },
        },
        lecoboardAvr_dual_color_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['녹색', '1'],
                        ['빨강', '2'],
                        ['오렌지', '3'],
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
                COLOR: 0,
            },
            func(sprite, script) {
                return script.getField('COLOR');
            },
        },

        lecoboardAvr_dual_led_color_toggle: {
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
                        type: 'lecoboardAvr_dual_color_list',
                        params: [1],
                    },
                    null,
                ],
                type: 'lecoboardAvr_dual_led_color_toggle',
            },
            paramsKeyMap: {
                COLOR: 0,
            },
            class: '0lecoboardAvr_led',
            isNotFor: ['lecoboardAvr'],
            func(sprite, script) {
                const port1 = 17;
                const port2 = 33;
                let value1 = 0; //script.getValue('VALUE1');
                let value2 = 0; //script.getValue('VALUE2');
                let color = script.getValue('COLOR');

                if (color == 1) {
                    value1 = 255;
                    value2 = 0;
                } else if (color == 2) {
                    value1 = 0;
                    value2 = 255;
                } else if (color == 3) {
                    value1 = 255;
                    value2 = 255;
                }

                if (!Entry.hw.sendQueue.SET) Entry.hw.sendQueue.SET = {};
                Entry.hw.sendQueue.SET[port1] = {
                    type: Entry.lecoboardAvr.sensorTypes.DIGITAL,
                    data: value1,
                    time: new Date().getTime(),
                };
                if (!Entry.hw.sendQueue.SET) Entry.hw.sendQueue.SET = {};
                Entry.hw.sendQueue.SET[port2] = {
                    type: Entry.lecoboardAvr.sensorTypes.DIGITAL,
                    data: value2,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
        },
        lecoboardAvr_dual_led_toggle: {
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'arduino_get_digital_toggle',
                        params: ['on'],
                    },
                    {
                        type: 'arduino_get_digital_toggle',
                        params: ['on'],
                    },
                    null,
                ],
                type: 'lecoboardAvr_dual_led_toggle',
            },
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
            },
            class: '0lecoboardAvr_led',
            isNotFor: ['lecoboardAvr'],
            func(sprite, script) {
                const port1 = 17;
                const port2 = 33;
                let value1 = script.getValue('VALUE1');
                let value2 = script.getValue('VALUE2');

                if (typeof value1 === 'string') value1 = value1.toLowerCase();
                if (Entry.lecoboardAvr.highList.indexOf(value1) > -1) value1 = 255;
                else if (Entry.lecoboardAvr.lowList.indexOf(value1) > -1) value1 = 0;
                else throw new Error();
                if (!Entry.hw.sendQueue.SET) Entry.hw.sendQueue.SET = {};
                Entry.hw.sendQueue.SET[port1] = {
                    type: Entry.lecoboardAvr.sensorTypes.DIGITAL,
                    data: value1,
                    time: new Date().getTime(),
                };
                if (typeof value2 === 'string') value2 = value2.toLowerCase();
                if (Entry.lecoboardAvr.highList.indexOf(value2) > -1) value2 = 255;
                else if (Entry.lecoboardAvr.lowList.indexOf(value2) > -1) value2 = 0;
                else throw new Error();
                if (!Entry.hw.sendQueue.SET) Entry.hw.sendQueue.SET = {};
                Entry.hw.sendQueue.SET[port2] = {
                    type: Entry.lecoboardAvr.sensorTypes.DIGITAL,
                    data: value2,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
        },
        lecoboardAvr_led_rgb_toggle: {
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
                        type: 'arduino_get_digital_toggle',
                        params: ['on'],
                    },
                    {
                        type: 'arduino_get_digital_toggle',
                        params: ['on'],
                    },
                    {
                        type: 'arduino_get_digital_toggle',
                        params: ['on'],
                    },
                    null,
                ],
                type: 'lecoboardAvr_led_rgb_toggle',
            },
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
                VALUE3: 2,
            },
            class: '0lecoboardAvr_led',
            isNotFor: ['lecoboardAvr'],
            func(sprite, script) {
                const port1 = 16;
                const port2 = 15;
                const port3 = 14;
                let value1 = script.getValue('VALUE1');
                let value2 = script.getValue('VALUE2');
                let value3 = script.getValue('VALUE3');

                if (typeof value1 === 'string') value1 = value1.toLowerCase();
                if (Entry.lecoboardAvr.highList.indexOf(value1) > -1) value1 = 255;
                else if (Entry.lecoboardAvr.lowList.indexOf(value1) > -1) value1 = 0;
                else throw new Error();
                if (!Entry.hw.sendQueue.SET) Entry.hw.sendQueue.SET = {};
                Entry.hw.sendQueue.SET[port1] = {
                    type: Entry.lecoboardAvr.sensorTypes.DIGITAL,
                    data: value1,
                    time: new Date().getTime(),
                };
                if (typeof value2 === 'string') value2 = value2.toLowerCase();
                if (Entry.lecoboardAvr.highList.indexOf(value2) > -1) value2 = 255;
                else if (Entry.lecoboardAvr.lowList.indexOf(value2) > -1) value2 = 0;
                else throw new Error();
                if (!Entry.hw.sendQueue.SET) Entry.hw.sendQueue.SET = {};
                Entry.hw.sendQueue.SET[port2] = {
                    type: Entry.lecoboardAvr.sensorTypes.DIGITAL,
                    data: value2,
                    time: new Date().getTime(),
                };
                if (typeof value3 === 'string') value3 = value3.toLowerCase();
                if (Entry.lecoboardAvr.highList.indexOf(value3) > -1) value3 = 255;
                else if (Entry.lecoboardAvr.lowList.indexOf(value3) > -1) value3 = 0;
                else throw new Error();
                if (!Entry.hw.sendQueue.SET) Entry.hw.sendQueue.SET = {};
                Entry.hw.sendQueue.SET[port3] = {
                    type: Entry.lecoboardAvr.sensorTypes.DIGITAL,
                    data: value3,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
        },
        lecoboardAvr_led_strip_toggle: {
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
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'arduino_get_digital_toggle',
                        params: ['on'],
                    },
                    {
                        type: 'arduino_get_digital_toggle',
                        params: ['on'],
                    },
                    {
                        type: 'arduino_get_digital_toggle',
                        params: ['on'],
                    },
                    {
                        type: 'arduino_get_digital_toggle',
                        params: ['on'],
                    },
                    null,
                ],
                type: 'lecoboardAvr_led_strip_toggle',
            },
            paramsKeyMap: {
                VALUE1: 0,
                VALUE2: 1,
                VALUE3: 2,
                VALUE4: 3,
            },
            class: '0lecoboardAvr_led',
            isNotFor: ['lecoboardAvr'],
            func(sprite, script) {
                const port1 = 13;
                const port2 = 14;
                const port3 = 15;
                const port4 = 16;
                let value1 = script.getValue('VALUE1');
                let value2 = script.getValue('VALUE2');
                let value3 = script.getValue('VALUE3');
                let value4 = script.getValue('VALUE4');

                if (typeof value1 === 'string') value1 = value1.toLowerCase();
                if (Entry.lecoboardAvr.highList.indexOf(value1) > -1) value1 = 255;
                else if (Entry.lecoboardAvr.lowList.indexOf(value1) > -1) value1 = 0;
                else throw new Error();
                if (!Entry.hw.sendQueue.SET) Entry.hw.sendQueue.SET = {};
                Entry.hw.sendQueue.SET[port1] = {
                    type: Entry.lecoboardAvr.sensorTypes.DIGITAL,
                    data: value1,
                    time: new Date().getTime(),
                };
                if (typeof value2 === 'string') value2 = value2.toLowerCase();
                if (Entry.lecoboardAvr.highList.indexOf(value2) > -1) value2 = 255;
                else if (Entry.lecoboardAvr.lowList.indexOf(value2) > -1) value2 = 0;
                else throw new Error();
                if (!Entry.hw.sendQueue.SET) Entry.hw.sendQueue.SET = {};
                Entry.hw.sendQueue.SET[port2] = {
                    type: Entry.lecoboardAvr.sensorTypes.DIGITAL,
                    data: value2,
                    time: new Date().getTime(),
                };
                if (typeof value3 === 'string') value3 = value3.toLowerCase();
                if (Entry.lecoboardAvr.highList.indexOf(value3) > -1) value3 = 255;
                else if (Entry.lecoboardAvr.lowList.indexOf(value3) > -1) value3 = 0;
                else throw new Error();
                if (!Entry.hw.sendQueue.SET) Entry.hw.sendQueue.SET = {};
                Entry.hw.sendQueue.SET[port3] = {
                    type: Entry.lecoboardAvr.sensorTypes.DIGITAL,
                    data: value3,
                    time: new Date().getTime(),
                };
                if (typeof value4 === 'string') value4 = value4.toLowerCase();
                if (Entry.lecoboardAvr.highList.indexOf(value4) > -1) value4 = 255;
                else if (Entry.lecoboardAvr.lowList.indexOf(value4) > -1) value4 = 0;
                else throw new Error();
                if (!Entry.hw.sendQueue.SET) Entry.hw.sendQueue.SET = {};
                Entry.hw.sendQueue.SET[port4] = {
                    type: Entry.lecoboardAvr.sensorTypes.DIGITAL,
                    data: value4,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
        },
        lecoboardAvr_tone_list: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
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
                        [Lang.Blocks.do_name, 'C2'],
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
            func(sprite, script) {
                return script.getField('NOTE');
            },
        },
        arduino_ext_tone_value: {
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
                        type: 'lecoboardAvr_tone_list',
                    },
                ],
                type: 'arduino_ext_tone_value',
            },
            paramsKeyMap: {
                NOTE: 0,
            },
            func(sprite, script) {
                return script.getNumberValue('NOTE');
            },
        },
        arduino_ext_octave_list: {
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
            func(sprite, script) {
                return script.getField('OCTAVE');
            },
        },
        lecoboardAvr_buzzer_number: {
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
                params: [1],
                type: 'lecoboardAvr_buzzer_number',
            },
            paramsKeyMap: {
                NOTE: 0,
            },
            func(sprite, script) {
                return script.getNumberValue('NOTE');
            },
        },
        lecoboardAvr_set_tone: {
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
                params: [
                    {
                        type: 'lecoboardAvr_tone_list',
                    },
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'lecoboardAvr_set_tone',
            },
            paramsKeyMap: {
                NOTE: 0,
                DURATION: 1,
            },
            class: 'lecoboardAvr_buzzer',
            isNotFor: ['lecoboardAvr'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = 12; //script.getNumberValue('PORT', script);

                let note = script.getValue('NOTE', script);
                if (!Entry.Utils.isNumber(note)) {
                    note = Entry.lecoboardAvr.toneTable[note];
                }

                if (note < 0) {
                    note = 0;
                } else if (note > 13) {
                    note = 13;
                }

                let duration = script.getNumberValue('DURATION', script);

                if (duration < 0) {
                    duration = 0;
                }

                if (!sq.SET) {
                    sq.SET = {};
                }

                if (duration === 0) {
                    sq.SET[port] = {
                        type: Entry.lecoboardAvr.sensorTypes.TONE,
                        data: 0,
                        time: new Date().getTime(),
                    };
                    return script.callReturn();
                }
                let octave = 4;
                let value = 0;

                if (note != 0) {
                    value = Entry.lecoboardAvr.toneMap[note][octave];
                }

                duration = duration * 1000;
                script.isStart = true;
                script.timeFlag = 1;

                sq.SET[port] = {
                    type: Entry.lecoboardAvr.sensorTypes.TONE,
                    data: {
                        value,
                        duration,
                    },
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
        },
        lecoboardAvr_set_freq_tone: {
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
                params: [
                    {
                        type: 'text',
                        params: ['12'],
                    },
                    {
                        type: 'text',
                        params: ['HZ'],
                    },
                    {
                        type: 'text',
                        params: ['1000'],
                    },
                    null,
                ],
                type: 'lecoboardAvr_set_freq_tone',
            },
            paramsKeyMap: {
                PORT: 0,
                NOTE: 1,
                DURATION: 2,
            },
            class: 'lecoboardAvr_buzzer',
            isNotFor: ['lecoboardAvr'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = script.getNumberValue('PORT', script);

                let freq = script.getNumberValue('NOTE', script);

                let duration = script.getNumberValue('DURATION', script);

                if (duration < 0) {
                    duration = 0;
                }

                if (!sq.SET) {
                    sq.SET = {};
                }

                if (duration === 0) {
                    sq.SET[port] = {
                        type: Entry.lecoboardAvr.sensorTypes.TONE,
                        data: 0,
                        time: new Date().getTime(),
                    };
                    return script.callReturn();
                }
                let value = freq;

                script.isStart = true;
                script.timeFlag = 1;

                sq.SET[port] = {
                    type: Entry.lecoboardAvr.sensorTypes.TONE,
                    data: {
                        value,
                        duration,
                    },
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
        },
        lecoboardAvr_set_tone_off: {
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
                params: [
                    {
                        type: 'lecoboardAvr_buzzer_number',
                        params: [1],
                    },
                    {
                        type: 'text',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'lecoboardAvr_set_tone_off',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'lecoboardAvr_buzzer',
            isNotFor: ['lecoboardAvr'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = 12; //script.getNumberValue('PORT', script);

                if (!script.isStart) {
                    let note = 0;
                    let duration = 0;
                    sq.SET[port] = {
                        type: Entry.lecoboardAvr.sensorTypes.TONE,
                        data: 0,
                        time: new Date().getTime(),
                    };

                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
        },
        lecoboardAvr_set_tone_long: {
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
                        type: 'lecoboardAvr_tone_list',
                    },
                ],
                type: 'lecoboardAvr_set_tone_long',
            },
            paramsKeyMap: {
                NOTE: 0,
            },
            class: 'lecoboardAvr_buzzer',
            isNotFor: ['lecoboardAvr'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = 12; //script.getNumberValue('PORT', script);

                let note = script.getValue('NOTE', script);
                if (!Entry.Utils.isNumber(note)) {
                    note = Entry.lecoboardAvr.toneTable[note];
                }

                if (note < 0) {
                    note = 0;
                } else if (note > 13) {
                    note = 13;
                }

                let duration = 20;

                if (!sq.SET) {
                    sq.SET = {};
                }

                let octave = 4;
                let value = 0;

                if (note != 0) {
                    value = Entry.lecoboardAvr.toneMap[note][octave];
                }

                duration = duration * 1000;
                script.isStart = true;
                script.timeFlag = 1;

                sq.SET[port] = {
                    type: Entry.lecoboardAvr.sensorTypes.TONE,
                    data: {
                        value,
                        duration,
                    },
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
        },
        lecoboardAvr_set_tone_off: {
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
                params: [null],
                type: 'lecoboardAvr_set_tone_off',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'lecoboardAvr_buzzer',
            isNotFor: ['lecoboardAvr'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = 12; //script.getNumberValue('PORT', script);

                if (!script.isStart) {
                    let note = 0;
                    let duration = 0;
                    sq.SET[port] = {
                        type: Entry.lecoboardAvr.sensorTypes.TONE,
                        data: 0,
                        time: new Date().getTime(),
                    };

                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            },
        },
        lecoboardAvr_servomotor_list: {
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
            func(sprite, script) {
                return script.getField('PORT');
            },
        },
        lecoboardAvr_set_servo: {
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
                params: [
                    {
                        type: 'lecoboardAvr_servomotor_list',
                        params: [1],
                    },
                    {
                        type: 'number',
                        params: ['90'],
                    },
                ],
                type: 'lecoboardAvr_set_servo',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'lecoboardAvr_servo',
            isNotFor: ['lecoboardAvr'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                let port = script.getNumberValue('PORT', script);

                if (port == 1) port = 28;
                else if (port == 2) port = 29;
                else if (port == 3) port = 1;
                else if (port == 4) port = 0;
                else script.callReturn();

                let value = script.getNumberValue('VALUE', script);
                value = Math.min(180, value);
                value = Math.max(1, value);

                if (!sq.SET) {
                    sq.SET = {};
                }
                sq.SET[port] = {
                    type: Entry.lecoboardAvr.sensorTypes.SERVO_PIN,
                    data: value,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
        },
        lecoboardAvr_dc_motor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['왼쪽', '1'],
                        ['오른쪽', '2'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['시계방향', '0'],
                        ['반시계방향', '1'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                params: [
                    null,
                    null,
                    {
                        type: 'number',
                        params: ['50'],
                    },
                    null,
                ],
                type: 'lecoboardAvr_dc_motor',
            },
            paramsKeyMap: {
                INDEX: 0,
                DIR: 1,
                SPEED: 2,
            },
            class: 'lecoboardAvr_motor',
            isNotFor: ['lecoboardAvr'],
            func: function(sprite, script) {
                var idx = script.getField('INDEX');
                var dir = script.getField('DIR');
                var speed = script.getNumberValue('SPEED');
                var value = 0;
                var value1 = 0;
                var value2 = 0;

                var port1 = 0;
                var port2 = 0;

                if (idx == 1) {
                    port1 = 28;
                    port2 = 29;
                } else if (idx == 2) {
                    port1 = 1;
                    port2 = 0;
                }

                var value = speed;
                value = Math.round(value);
                value = Math.max(value, 0);
                value = Math.min(value, 100);

                value = value * (255 / 100);
                value = Math.round(value);

                if (dir == 0) {
                    value1 = value;
                    value2 = 0;
                } else {
                    value1 = 0;
                    value2 = value;
                }

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[port1] = {
                    type: Entry.lecoboardAvr.sensorTypes.PWM,
                    data: value1,
                    time: new Date().getTime(),
                };
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[port2] = {
                    type: Entry.lecoboardAvr.sensorTypes.PWM,
                    data: value2,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
        },
        lecoboardAvr_dc_motor_for_sec: {
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
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        ['시계방향', '0'],
                        ['반시계방향', '1'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
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
                params: [
                    null,
                    null,
                    {
                        type: 'number',
                        params: ['50'],
                    },
                    {
                        type: 'number',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'lecoboardAvr_dc_motor_for_sec',
            },
            paramsKeyMap: {
                INDEX: 0,
                DIR: 1,
                SPEED: 2,
                SEC: 3,
            },
            class: 'lecoboardAvr_motor',
            isNotFor: ['lecoboardAvr'],
            func: function(sprite, script) {
                if (!script.isStart) {
                    var idx = script.getField('INDEX');
                    var dir = script.getField('DIR');
                    var speed = script.getNumberValue('SPEED');
                    var sec = script.getNumberValue('SEC');
                    var value = 0;
                    var value1 = 0;
                    var value2 = 0;

                    var port1 = 0;
                    var port2 = 0;

                    if (idx == 1) {
                        port1 = 28;
                        port2 = 29;
                    } else if (idx == 2) {
                        port1 = 0;
                        port2 = 1;
                    }

                    var value = speed;
                    value = Math.round(value);
                    value = Math.max(value, 0);
                    value = Math.min(value, 100);

                    value = value * (255 / 100);
                    value = Math.round(value);

                    if (dir == 0) {
                        value1 = value;
                        value2 = 0;
                    } else {
                        value1 = 0;
                        value2 = value;
                    }

                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }
                    Entry.hw.sendQueue.SET[port1] = {
                        type: Entry.lecoboardAvr.sensorTypes.PWM,
                        data: value1,
                        time: new Date().getTime(),
                    };
                    if (!Entry.hw.sendQueue.SET) {
                        Entry.hw.sendQueue.SET = {};
                    }
                    Entry.hw.sendQueue.SET[port2] = {
                        type: Entry.lecoboardAvr.sensorTypes.PWM,
                        data: value2,
                        time: new Date().getTime(),
                    };

                    sec = sec * 1000;
                    script.isStart = true;
                    script.timeFlag = 1;

                    setTimeout(() => {
                        script.timeFlag = 0;
                    }, sec);
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.hw.sendQueue.SET[port1] = {
                        type: Entry.lecoboardAvr.sensorTypes.PWM,
                        data: 0,
                        time: new Date().getTime(),
                    };
                    Entry.hw.sendQueue.SET[port2] = {
                        type: Entry.lecoboardAvr.sensorTypes.PWM,
                        data: 0,
                        time: new Date().getTime(),
                    };
                    Entry.engine.isContinue = false;

                    return script.callReturn();
                }
            },
        },
        lecoboardAvr_dc_motor_stop: {
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
                params: [null, null],
                type: 'lecoboardAvr_dc_motor_stop',
            },
            paramsKeyMap: {
                INDEX: 0,
            },
            class: 'lecoboardAvr_motor',
            isNotFor: ['lecoboardAvr'],
            func: function(sprite, script) {
                var port1 = 28;
                var port2 = 29;
                var port3 = 1;
                var port4 = 0;

                var value = 0;

                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[port1] = {
                    type: Entry.lecoboardAvr.sensorTypes.PWM,
                    data: 0,
                    time: new Date().getTime(),
                };
                if (!Entry.hw.sendQueue.SET) {
                    Entry.hw.sendQueue.SET = {};
                }
                Entry.hw.sendQueue.SET[port2] = {
                    type: Entry.lecoboardAvr.sensorTypes.PWM,
                    data: 0,
                    time: new Date().getTime(),
                };
                Entry.hw.sendQueue.SET[port3] = {
                    type: Entry.lecoboardAvr.sensorTypes.PWM,
                    data: 0,
                    time: new Date().getTime(),
                };
                Entry.hw.sendQueue.SET[port4] = {
                    type: Entry.lecoboardAvr.sensorTypes.PWM,
                    data: 0,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
        },

        lecoboardAvr_list_digital_lcd_line: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', '0'],
                        ['2', '1'],
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
                LINE: 0,
            },
            func: function(sprite, script) {
                return script.getField('LINE');
            },
        },
        lecoboardAvr_list_digital_lcd_column: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', '0'],
                        ['2', '1'],
                        ['3', '2'],
                        ['4', '3'],
                        ['5', '4'],
                        ['6', '5'],
                        ['7', '6'],
                        ['8', '7'],
                        ['9', '8'],
                        ['10', '9'],
                        ['11', '10'],
                        ['12', '11'],
                        ['13', '12'],
                        ['14', '13'],
                        ['15', '14'],
                        ['16', '15'],
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
                COLUMN: 0,
            },
            func: function(sprite, script) {
                return script.getField('COLUMN');
            },
        },
        lecoboardAvr_set_lcd: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            //template: Lang.template.lecoboardAvr_set_lcd,
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
                        type: 'lecoboardAvr_list_digital_lcd_line',
                    },
                    {
                        type: 'lecoboardAvr_list_digital_lcd_column',
                    },
                    {
                        type: 'text',
                        params: ['HELLO'],
                    },
                    null,
                ],
                type: 'lecoboardAvr_set_lcd',
            },
            paramsKeyMap: {
                LINE: 0,
                COLUMN: 1,
                STRING: 2,
            },
            class: 'lecoboardLcd',
            isNotFor: ['lecoboardAvr'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;

                var line = script.getValue('LINE', script);
                var column = script.getValue('COLUMN', script);
                var string = script.getValue('STRING', script);
                var text = [];
                var str;
                let temp = [];
                //var string = script.getField('STRING');
                if (string.length < 1) {
                    return script.callReturn();
                }
                str = string;
                if (!script.isStart) {
                    for (var i = 0; i < string.length; i++) {
                        text[i] = string.charCodeAt(i);
                    }

                    if (!sq['SET']) {
                        sq['SET'] = {};
                    }

                    sq.SET[1] = {
                        type: Entry.lecoboardAvr.sensorTypes.LCD,
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
                        },
                        time: new Date().getTime(),
                    };
                    return script.callReturn();
                }
            },
        },
        lecoboardAvr_list_lcd_command: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['지움', '2'],

                        ['백라이트켜기', '3'],
                        ['백라이트끄기', '4'],
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
                COMMAND: 0,
            },
            func: function(sprite, script) {
                return script.getField('COMMAND');
            },
        },
        lecoboardAvr_lcd_command: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            //template: Lang.template.lecoboardAvr_lcd_command,
            //"template": "%1 %2",
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
                        type: 'lecoboardAvr_list_lcd_command',
                    },
                    null,
                ],
                type: 'lecoboardAvr_lcd_command',
            },
            paramsKeyMap: {
                COMMAND: 0,
            },
            class: 'lecoboardLcd',
            isNotFor: ['lecoboardAvr'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;
                var value = script.getNumberValue('COMMAND', script);
                var command = script.getNumberValue('COMMAND', script);

                if (!sq['SET']) {
                    sq['SET'] = {};
                }

                sq.SET[0] = {
                    type: Entry.lecoboardAvr.sensorTypes.LCD_COMMAND,
                    data: {
                        value: value,
                        command: command,
                    },
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
        },
        lecoboardAvr_send_ble: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            //template: Lang.template.lecoboardAvr_set_lcd,
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
                        params: ['HELLO'],
                    },
                    null,
                ],
                type: 'lecoboardAvr_send_ble',
            },
            paramsKeyMap: {
                STRING: 0,
            },
            class: 'lecoboardble',
            isNotFor: ['lecoboardAvr'],
            func: function(sprite, script) {
                var sq = Entry.hw.sendQueue;

                var string = script.getValue('STRING', script);
                var text = [];
                var str;
                let temp = [];
                //var string = script.getField('STRING');
                if (string.length < 1) {
                    return script.callReturn();
                }
                str = string;
                if (!script.isStart) {
                    for (var i = 0; i < string.length; i++) {
                        text[i] = string.charCodeAt(i);
                    }

                    if (!sq['SET']) {
                        sq['SET'] = {};
                    }

                    sq.SET[1] = {
                        type: Entry.lecoboardAvr.sensorTypes.BLE_WRITE,
                        data: {
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
                        },
                        time: new Date().getTime(),
                    };
                    return script.callReturn();
                }
            },
        },
        lecoboardAvr_get_bluetooth: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            //template: Lang.template.lecoboardAvr_get_digital_bluetooth,
            statements: [],
            params: [],
            events: {},
            def: {
                params: [],
                type: 'lecoboardAvr_get_bluetooth',
            },
            paramsKeyMap: {},
            class: 'lecoboardble',
            isNotFor: ['lecoboardAvr'],
            func: function(sprite, script) {
                var port = 2;
                var getString = Entry.hw.portData.BLE_READ;

                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                Entry.hw.sendQueue.GET[Entry.lecoboardAvr.sensorTypes.BLE_READ] = {
                    port,
                    time: new Date().getTime(),
                };

                return getString ? getString.slice(0, getString.length - 1) : ' ';
            },
        },
    };
};

module.exports = Entry.lecoboardAvr;