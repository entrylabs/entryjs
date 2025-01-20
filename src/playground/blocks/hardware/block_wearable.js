'use strict';

Entry.Wearable = {
    id: '4A.3',
    name: 'wearable', // isNotFor 속성과 대소문자까지 정확하게 매치되어야 합니다.
    url: 'http://www.robolink.co.kr/', // 생략 가능합니다. 엔트리 사이트에서 홍보시 사용됩니다.
    imageName: 'robolink_wearable.png', // images/hardware 폴더 내에 존재하는 이미지입니다. 엔트리 사이트에서 홍보시 사용됩니다.
    title: {
        ko: '로보링크 웨어러블 키트',
        en: 'Robolink Wearable kit',
    },
       
    setZero: function() {
        Entry.hw.update();
    },
};

// 언어 적용
Entry.Wearable.setLanguage = function() {
    return {
        ko: {
            Blocks: {
            turn_On:   '켜기',
            turn_Off:  '끄기',
            output_yaw:   '요우',
            output_pitch: '피치',
            output_roll:  '롤',
            button_up: '위',
            button_down: '아래',
            button_left: '왼쪽',
            button_right: '오른쪽',
            button_joy_left: '조이스틱 왼쪽',
            button_joy_right: '조이스틱 오른쪽',  
            joystick_X: 'X축',
            joystick_Y: 'Y축', 
            LED_board_main: '메인 보드',
            LED_board_left: '왼쪽 조이스틱',
            LED_board_right: '오른쪽 조이스틱',  
            sound_fire_ball: '파이어 볼',
            sound_coin: '코인',
            sound_up1: '보너스',
            sound_beep1: '비프 1번',
            sound_beep2: '비프 2번',
            sound_1: '소리 1번',
            sound_2: '소리 2번',
            sound_3: '소리 3번',
            sound_charging: '충전',
            pitch_mute: '무음',
            pitch_C: '도',
            pitch_CSharp: '도#',
            pitch_D: '레',
            pitch_DSharp: '레#',
            pitch_E: '미',
            pitch_F: '파',
            pitch_FSharp: '파#',
            pitch_G: '솔',
            pitch_GSharp: '솔#',
            pitch_A: '라',
            pitch_ASharp: '라#',
            pitch_B: '시',
            whole_note: '온음표',
            half_note: '2분음표',
            quarter_note: '4분음표',
            eighth_note: '8분음표',
            sixteenth_note: '16분음표',
            
            },
            // ko.js에 작성하던 내용
            template: {
                test_value:'테스트 %1',
                attitude_angle_value:'자세 값 %1',
                leftJoystick_value:'왼쪽 조이스틱 %1',
                rightJoystick_value:'오른쪽 조이스틱 %1',
                button_input:'버튼 입력 %1',
                mic_input:'마이크 입력',
                battery_check:'배터리 체크',
                mainLED_control:'LED %1 번호 %2 R:%3 G:%4 B:%5 동작 %6 %7',
                LED_control_bright:'LED %1 번호 %2 밝기 %3 동작 %4 %5', 
                LED_All_turn_off : '모든 %1 LED 전부 끄기 %2',
                sound_effect:'버저 음향 효과 %1 %2',
                play_pitch:'%1 옥타브 %2 을(를) %3 초 연주 %4'
            },
        },
        en: {
            Blocks: {
                turn_On:   'ON',
                turn_Off:  'OFF',
                output_yaw:   'YAW',
                output_pitch: 'PITCH',
                output_roll:  'ROLL',
                button_up: 'UP',
                button_down: 'DOWN',
                button_left: 'LEFT',
                button_right: 'RIGHT',
                button_joy_left: 'JOY_LEFT',
                button_joy_right: 'JOY_RIGHT',
                joystick_X: 'X',
                joystick_Y: 'Y',
                LED_board_main: 'MAIN',
                LED_board_left: 'LEFT_JOYSTICK',
                LED_board_right: 'RIGHT_JOYSTICK', 
                sound_fire_ball: 'FIRE_BALL',
                sound_coin: 'COIN',
                sound_up1: 'UP1',
                sound_beep1: 'BEEP1',
                sound_beep2: 'BEEP2',
                sound_1: 'SOUND1',
                sound_2: 'SOUND2',
                sound_3: 'SOUND3',
                sound_charging: 'CHARGING',
                pitch_mute: 'MUTE',
                pitch_C: 'C',
                pitch_CSharp: 'C#',
                pitch_D: 'D',
                pitch_DSharp: 'D#',
                pitch_E: 'E',
                pitch_F: 'F',
                pitch_FSharp: 'F#',
                pitch_G: 'G',
                pitch_GSharp: 'G#',
                pitch_A: 'A',
                pitch_ASharp: 'A#',
                pitch_B: 'B',
                whole_note: 'WHOLE_NOTE',
                half_note: 'HELF_NOTE',
                quarter_note: 'QUARTER_NOTE',
                eighth_note: 'EIGHTH_NOTE',
                sixteenth_note: 'SIXTEENTH_NOTE',    
                                   
            },
            // en.js에 작성하던 내용
            template: {
                test_Value:'test %1',
                attitude_angle_value:'attitude %1',
                leftJoystick_value:'left joystick %1',
                rightJoystick_value:'right joystick %1',
                button_input:'button input %1',
                mic_input:'mic input',
                battery_check:'battery check',
                mainLED_control:'LED %1 number %2 R:%3 G:%4 B:%5 turn %6 %7',
                LED_control_bright:'LED %1 number %2 brightness %3 turn %4 %5',
                LED_All_turn_off : 'all %1 LEDs clear %2',
                sound_effect:'sound effect %1 %2',
                play_pitch:'play %1 octave %2 for %3 second %4',
            },
        },
    };
};

Entry.Wearable.blockMenuBlocks = [
    //'test_value',
    'mic_input',
    'battery_check',
    'button_input',   
    'attitude_angle_value',
    'leftJoystick_value',
    'rightJoystick_value',
    'mainLED_control',
    'LED_control_bright',
    'LED_All_turn_off', 
    'sound_effect',
    'play_pitch',      
];





// 블록 생성
Entry.Wearable.getBlocks = function() {
    return {
        test_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic_string_field',
            params: [
                {
                    type: 'Dropdown',
                    // Dropdown 생성 기준은
                    // [["key1", "value1"],
                    //  ["key2", "value2"]]
                    options: [
                        ['VAL1', 'VAL1'],
                        ['VAL2', 'VAL2'],
                        ['VAL3', 'VAL3']                        
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: ['VAL1'],
                type: 'test_value',
            },
            paramsKeyMap: {
                TEST: 0,
            },
            class: 'input',
            isNotFor: ['wearable'],
            func: function(sprite, script) {
                const btn = script.getStringField('TEST', script);
                return Entry.hw.portData.sensorValue.test[btn];

            },
        },
        attitude_angle_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic_string_field',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.output_yaw, 'yaw'],
                        [Lang.Blocks.output_pitch, 'pitch'],
                        [Lang.Blocks.output_roll, 'roll']                        
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: ['yaw'],
                type: 'attitude_angle_value',
            },
            paramsKeyMap: {
                EULER: 0,
            },
            class: 'input',
            isNotFor: ['wearable'],
            func: function(sprite, script) {
                const btn = script.getStringField('EULER', script);

                return Entry.hw.portData.sensorValue.euler[btn];
            },
        },
        leftJoystick_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic_string_field',
            params: [
                {
                    type: 'Dropdown',                   
                    options: [
                        [Lang.Blocks.joystick_X, 'leftX'],
                        [Lang.Blocks.joystick_Y, 'leftY'],                      
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: ['leftX'],
                type: 'leftJoystick_value',
            },
            paramsKeyMap: {
                LSTICK: 0,
            },
            class: 'input',
            isNotFor: ['wearable'],
            func: function(sprite, script) {
                const btn = script.getStringField('LSTICK', script);

                return Entry.hw.portData.sensorValue.stick[btn];
            },
        },
        rightJoystick_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic_string_field',
            params: [
                {
                    type: 'Dropdown',                   
                    options: [
                        [ Lang.Blocks.joystick_X, 'rightX'],
                        [ Lang.Blocks.joystick_Y, 'rightY'],                      
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: ['rightX'],
                type: 'rightJoystick_value',
            },
            paramsKeyMap: {
                RSTICK: 0,
            },
            class: 'input',
            isNotFor: ['wearable'],
            func: function(sprite, script) {
                const btn = script.getStringField('RSTICK', script);

                return Entry.hw.portData.sensorValue.stick[btn];
            },
        },
        button_input: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic_boolean_field',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.button_up, 'btnUp'],
                        [Lang.Blocks.button_down, 'btnDown'],
                        [Lang.Blocks.button_left, 'btnLeft'], 
                        [Lang.Blocks.button_right, 'btnRight'],
                        [Lang.Blocks.button_joy_left, 'btnJoyL'],
                        [Lang.Blocks.button_joy_right, 'btnJoyR'],                        
                    ],
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: ['btnUp'],
                type: 'button_input',
            },
            paramsKeyMap: {
                BUTTON: 0,
            },
            class: 'input',
            isNotFor: ['wearable'],
            func: function(sprite, script) {
                const btn = script.getStringField('BUTTON', script);
                if(Entry.hw.portData.sensorValue.button[btn] == 1) return true;
                else return false;
            },
        },
        mic_input: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic_string_field',
            def: {
                type: 'mic_input',
            },           
            class: 'input',
            isNotFor: ['wearable'],
            func: function(sprite, script) {
                return Entry.hw.portData.sensorValue.micInput;
            },
        },
        battery_check: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic_string_field',
            def: {
                type: 'battery_check',
            },           
            class: 'input',
            isNotFor: ['wearable'],
            func: function(sprite, script) {
                return Entry.hw.portData.sensorValue.battery;
            },
        },
        mainLED_control: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
            params:[
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.LED_board_main, 'MAIN'],
                        [Lang.Blocks.LED_board_left, 'LEFT'],
                        [Lang.Blocks.LED_board_right, 'RIGHT'],                                           
                    ],
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
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.turn_On, 'ON'],
                        [Lang.Blocks.turn_Off, 'OFF']                        
                    ],
                    fontSize: 11,

                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Indicator',   img: 'block_icon/hardware_icon.svg',  size: 12 },
            ],
            def: {
                params: ['MAIN', { type: 'number', params: ['0'] }, { type: 'number', params: ['0'] }, {  type: 'number', params: ['0'] }, {  type: 'number', params: ['0'] }, 'ON', null],
                type: 'mainLED_control',
            },
            paramsKeyMap: {
                BOARD: 0,
                NUMBER: 1,
                RED: 2,
                GREEN: 3,
                BLUE: 4,
                TURN: 5,
            },           
            class: 'output',
            isNotFor: ['wearable'],
            func: function(sprite, script) {
                
                var LEDNumber = [
                    'mainLED0',
                    'mainLED1',
                    'mainLED2',
                    'mainLED3',
                    'mainLED4',
                    'mainLED5',
                    'mainLED6',
                    'mainLED7',
                    'mainLED8',
                    'mainLED9',
                    'mainLED10',
                    'mainLED11',
                    'leftLED0',
                    'leftLED1',
                    'leftLED2',
                    'rightLED0',
                    'rightLED1',
                    'rightLED2',
                ];
                
                var LEDNum = '';
                const board = script.getStringField('BOARD', script);
                var _num = script.getNumberValue('NUMBER');
                var _red = script.getNumberValue('RED');
                var _green = script.getNumberValue('GREEN');
                var _blue = script.getNumberValue('BLUE');  
                const _turn = script.getStringField('TURN', script); 
                
                if(_red < 0) _red = 0; else if(_red > 255) _red = 255;
                if(_green < 0) _green = 0; else if(_green > 255) _green = 255;
                if(_blue < 0) _blue = 0; else if(_blue > 255) _blue = 255;

                console.log(board, _num, " R:",_red, "G:", _green, "B:", _blue, " TURN:", _turn);
                
                if(board == 'MAIN') {
                    if(( _num >= 0)&&(_num < 12)) {
                        LEDNum = LEDNumber[_num];
                    }                    
                }
                else if(board == 'LEFT') {
                    if((_num >= 0)&&(_num < 12)) {
                        LEDNum = LEDNumber[_num + 12];
                    }
                }
                else if(board == 'RIGHT') {
                    if((_num >= 0)&&(_num < 12)) {
                        LEDNum = LEDNumber[_num + 15];
                    }
                }                
                if(_turn == 'OFF') {_red = 0; _green = 0; _blue = 0;}
                
                Entry.hw.sendQueue[LEDNum] = [_red, _green, _blue];
            },
        },
        LED_control_bright: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
            params:[
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.LED_board_main, 'MAIN'],
                        [Lang.Blocks.LED_board_left, 'LEFT'],
                        [Lang.Blocks.LED_board_right, 'RIGHT'],                                           
                    ],
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
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.turn_On, 'ON'],
                        [Lang.Blocks.turn_Off, 'OFF']                        
                    ],
                    fontSize: 11,

                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Indicator',   img: 'block_icon/hardware_icon.svg',   size: 12 },
            ],
            def: {
                params: ['MAIN', { type: 'number', params: ['0'] }, { type: 'number', params: ['0'] },  'ON', null],
                type: 'LED_control_bright',
            },
            paramsKeyMap: {
                BOARD: 0,
                NUMBER: 1,
                BRIGHT: 2,
                TURN: 3,
            },           
            class: 'output',
            isNotFor: ['wearable'],
            func: function(sprite, script) {
                
                var LEDNumber = [
                    'mainLED0',
                    'mainLED1',
                    'mainLED2',
                    'mainLED3',
                    'mainLED4',
                    'mainLED5',
                    'mainLED6',
                    'mainLED7',
                    'mainLED8',
                    'mainLED9',
                    'mainLED10',
                    'mainLED11',
                    'leftLED0',
                    'leftLED1',
                    'leftLED2',
                    'rightLED0',
                    'rightLED1',
                    'rightLED2',
                ];
                
                var LEDNum = '';
                const board = script.getStringField('BOARD', script);
                var _num = script.getNumberValue('NUMBER');
                var _bright = script.getNumberValue('BRIGHT');
                const _turn = script.getStringField('TURN', script); 
                                
                if(_bright < 0) _bright = 0; else if(_bright > 255) _bright = 255;    
                console.log(board, _num, " BRIGHTNESS:", _bright, " TURN:", _turn);

                if(board == 'MAIN') {
                    if(( _num >= 0)&&(_num < 12)) {
                        LEDNum = LEDNumber[_num];
                    }                    
                }
                else if(board == 'LEFT') {
                    if((_num >= 0)&&(_num < 12)) {
                        LEDNum = LEDNumber[_num + 12];
                    }
                }
                else if(board == 'RIGHT') {
                    if((_num >= 0)&&(_num < 12)) {
                        LEDNum = LEDNumber[num - 1 + 15];
                    }
                }                
                if(_turn == 'OFF') {_bright = 0;}
                
                Entry.hw.sendQueue[LEDNum] = [_bright, _bright, _bright];
            },
        },
        LED_All_turn_off: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
            params:[
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.LED_board_main, 'MAIN'],
                        [Lang.Blocks.LED_board_left, 'LEFT'],
                        [Lang.Blocks.LED_board_right, 'RIGHT'],                                           
                    ],
                    fontSize: 11,

                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
               
                { type: 'Indicator',   img: 'block_icon/hardware_icon.svg',   size: 12 },
            ],
            def: {
                params: ['MAIN', null],
                type: 'LED_All_turn_off',
            },
            paramsKeyMap: {
                BOARD: 0,               
            },           
            class: 'output',
            isNotFor: ['wearable'],
            func: function(sprite, script) {
                
                var LEDNumber = [
                    'mainLED0',
                    'mainLED1',
                    'mainLED2',
                    'mainLED3',
                    'mainLED4',
                    'mainLED5',
                    'mainLED6',
                    'mainLED7',
                    'mainLED8',
                    'mainLED9',
                    'mainLED10',
                    'mainLED11',
                    'leftLED0',
                    'leftLED1',
                    'leftLED2',
                    'rightLED0',
                    'rightLED1',
                    'rightLED2',
                ];
                
                var LEDNum = '';
                const board = script.getStringField('BOARD', script);                             

                if(board == 'MAIN') {
                                     
                    for (var num = 0; num < 12; num++) {
                        LEDNum = LEDNumber[num];
                        Entry.hw.sendQueue[LEDNum] = [0, 0, 0];
                    }
                }
                else if(board == 'LEFT') {
                   
                    for (var num = 12; num < 15; num++) {
                        LEDNum = LEDNumber[num];
                        Entry.hw.sendQueue[LEDNum] = [0, 0, 0];
                    }

                }
                else if(board == 'RIGHT') {
                    
                    for (var num = 15; num < 18; num++) {
                        LEDNum = LEDNumber[num];
                        Entry.hw.sendQueue[LEDNum] = [0, 0, 0];
                    }
                }              
            },
        },
        sound_effect: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
            params:[
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.sound_fire_ball, '1'],
                        [Lang.Blocks.sound_coin, '2'],
                        [Lang.Blocks.sound_up1, '3'],
                        [Lang.Blocks.sound_beep1, '4'],
                        [Lang.Blocks.sound_beep2, '5'],
                        [Lang.Blocks.sound_1, '6'],
                        [Lang.Blocks.sound_2, '7'],
                        [Lang.Blocks.sound_3, '8'],
                        [Lang.Blocks.sound_charging, '9'],                        
                    ],
                    fontSize: 11,

                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Indicator',  img: 'block_icon/hardware_icon.svg',   size: 12 },               
            ],
            def: {
                params: ['1', null],
                type: 'sound_effect',
            },
            paramsKeyMap: {
                EFFECT: 0,               
            },           
            class: 'output',
            isNotFor: ['wearable'],
            func: function(sprite, script) {
                 const num = script.getNumberField('EFFECT', script);
                 //Entry.hw.sendQueue['soundNumber'] = num;
                 
                 var exTime = new Date();
                 var firstCheck = true;
                 
                 return new Promise(resolve => {
                    
                    var ttt = setInterval(() => {
                        Entry.hw.sendQueue['octave'] = num;
                        Entry.hw.sendQueue['soundNumber'] = num;
                        var tempTime = new Date(); 
                        
                        if((tempTime - exTime) >= 1000) firstCheck = false;
                        
                        if(firstCheck == false) {
                            Entry.hw.sendQueue['octave'] = 0xFE;
                            Entry.hw.sendQueue['soundNumber'] = 0xFE;
                            resolve();
                            clearInterval(ttt);
                        }
                    }, 50);
                 
                });
            },
        },
        play_pitch: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#ffffff',
            skeleton: 'basic',
            params:[
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
                    ],
                    fontSize: 11,

                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.pitch_mute, '0'],
                        [Lang.Blocks.pitch_C, '1'],
                        [Lang.Blocks.pitch_CSharp, '2'],
                        [Lang.Blocks.pitch_D, '3'],
                        [Lang.Blocks.pitch_DSharp, '4'],
                        [Lang.Blocks.pitch_E, '5'],
                        [Lang.Blocks.pitch_F, '6'],
                        [Lang.Blocks.pitch_FSharp, '7'],
                        [Lang.Blocks.pitch_G, '8'],
                        [Lang.Blocks.pitch_GSharp, '9'],
                        [Lang.Blocks.pitch_A, '10'],
                        [Lang.Blocks.pitch_ASharp, '11'],
                        [Lang.Blocks.pitch_B, '12'],                                                                
                    ],
                    fontSize: 11,

                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.Blocks.whole_note, '200'],
                        [Lang.Blocks.half_note,  '100'],
                        [Lang.Blocks.quarter_note, '50'],
                        [Lang.Blocks.eighth_note,  '25'],
                        [Lang.Blocks.sixteenth_note, '10'],                                                                 
                    ],
                    fontSize: 11,

                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                { type: 'Indicator',   img: 'block_icon/hardware_icon.svg',   size: 12 },     
            ],
            def: {
                params: ['1', '0', '200', null],
                type: 'play_pitch',
            },
            paramsKeyMap: {
                OCTAVE: 0,
                PITCH: 1,
                NOTE: 2,               
            },           
            class: 'output',
            isNotFor: ['wearable'],
            func: function(sprite, script) {
                const oct = script.getNumberField('OCTAVE', script);
                const pitch = script.getNumberField('PITCH', script);
                var time = script.getNumberField('NOTE', script);                
                var octave = 0;
                if(pitch == 0)  octave = 0;
                else octave = ((oct - 1) * 12) + pitch;
                
                var exTime = new Date();
                var firstCheck = true;
                
                return new Promise(resolve => {
                    
                    var ttt = setInterval(() => {
                        Entry.hw.sendQueue['soundNumber'] = octave + 100;
                        Entry.hw.sendQueue['octave'] = octave + 100;
                        Entry.hw.sendQueue['note'] = time;     
                        var tempTime = new Date(); 
                        
                        if((tempTime - exTime) >= ((time * 5) * 1.3)) firstCheck = false;
                        
                        if(firstCheck == false) {
                            Entry.hw.sendQueue['soundNumber'] = 0xFE;
                            Entry.hw.sendQueue['octave'] = 0xFE;
                            resolve();
                            clearInterval(ttt);
                        }
                    }, 50);
                 
                });
            },
        },

    };
};

module.exports = Entry.Wearable;
