'use strict';

Entry.MagKinder = {
    id: '37.1',
    name: 'magkinder',
    url: 'https://www.magkinder.com',
    imageName: 'magkinder.png',
    title: {
        ko: '맥킨더',
        en: 'MagKinder'
    },
    timeouts: [],
    array: {
        AutoSensing: 0,
        Stop: 1,
        Move: 2,
        Turn: 3,
        WheelSpeed: 4,
        LED: 5,
        Volume: 6,
        Speak: 7,
        Scale: 8,
        Mode: 9,
    },

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
    setZero: function() {

    }
};

Entry.MagKinder.setLanguage = function() {
    return{
        ko: {
            template: {
                magkinder_list_leftSide: '바깥 왼쪽',
                magkinder_list_left: '왼쪽',
                magkinder_list_right: '오른쪽',
                magkinder_list_rightSide: '바깥 오른쪽',
                magkinder_list_front: '앞쪽',
                magkinder_list_both: '양쪽',
                magkinder_list_forward: '앞으로',
                magkinder_list_backwards: '뒤로',
                magkinder_list_on: '켜기',
                magkinder_list_off: '끄기',
                magkinder_list_red: '빨간색',
                magkinder_list_blue: '파란색',
                magkinder_list_green: '초록색',
                magkinder_list_yellow: '노란색',
                magkinder_list_purple: '보라색',
                magkinder_list_white: '하얀색',
                magkinder_list_4_octave_C: '4 옥타브 도',
                magkinder_list_4_octave_D: '4 옥타브 레',
                magkinder_list_4_octave_E: '4 옥타브 미',
                magkinder_list_4_octave_F: '4 옥타브 파',
                magkinder_list_4_octave_G: '4 옥타브 솔',
                magkinder_list_4_octave_A: '4 옥타브 라',
                magkinder_list_4_octave_B: '4 옥타브 시',
                magkinder_list_5_octave_C: '5 옥타브 도',
                magkinder_list_5_octave_D: '5 옥타브 레',
                magkinder_list_5_octave_E: '5 옥타브 미',
                magkinder_list_5_octave_F: '5 옥타브 파',
                magkinder_list_5_octave_G: '5 옥타브 솔',
                magkinder_list_5_octave_A: '5 옥타브 라',
                magkinder_list_5_octave_B: '5 옥타브 시',
                magkinder_list_6_octave_C: '6 옥타브 도',
                magkinder_list_codingMode: '코딩',
                magkinder_list_lineMode: '라인',
                magkinder_list_gestureFollowMode: '몸짓 따라가기',
                magkinder_list_handFollowMode: '손 따라가기',
                magkinder_list_AvoidMode: '피하기',
                magkinder_list_gestureCodingMode: '몸짓 코딩',
                magkinder_list_cardCodingMode: '카드 코딩',
                magkinder_received_bottomSensor_block: '바닥 %1 센서 값',
                magkinder_received_cardSensor_block: '카드 %1 센서 값',
                magkinder_received_frontSensor_block: '전방 %1 센서 값',
                magkinder_transmit_autoSensor_block: '센서값 자동 업데이트 %1 %2',
                magkinder_transmit_moveStop_block: '정지하기 %1',
                magkinder_transmit_move_block: '%1 으로 %2 cm 움직이기 %3',
                magkinder_transmit_turn_block: '%1 으로 %2 ° 회전하기 %3',
                magkinder_transmit_wheelSpeed_block: '%1 바퀴의 빠르기를 %2로 정하기 %3',
                magkinder_transmit_eyeLED_block: '눈 LED 색상을 %1 으로 정하기 %2',
                magkinder_transmit_volumm_block: '소리 크기를 %1 로 정하기 %2',
                magkinder_transmit_speak_block: '%1 번 소리를 내기 %2',
                magkinder_transmit_scale_block: '%1 음을 내기 %2',
                magkinder_transmit_modeSetting_block: '%1 모드로 정하기 %2',
            }
        },
        en: {
            template: {
                magkinder_list_leftSide: 'left side',
                magkinder_list_left: 'left',
                magkinder_list_right: 'right',
                magkinder_list_rightSide: 'right side',
                magkinder_list_front: 'front',
                magkinder_list_forward: 'forward',
                magkinder_list_backwards: 'backwards',
                magkinder_list_both: 'both',
                magkinder_list_on: 'on',
                magkinder_list_off: 'off',
                magkinder_list_red: 'red',
                magkinder_list_blue: 'blue',
                magkinder_list_green: 'green',
                magkinder_list_yellow: 'yellow',
                magkinder_list_purple: 'purple',
                magkinder_list_white: 'white',                
                magkinder_list_4_octave_C: '4 octave C',
                magkinder_list_4_octave_D: '4 octave D',
                magkinder_list_4_octave_E: '4 octave E',
                magkinder_list_4_octave_F: '4 octave F',
                magkinder_list_4_octave_G: '4 octave G',
                magkinder_list_4_octave_A: '4 octave A',
                magkinder_list_4_octave_B: '4 octave B',
                magkinder_list_5_octave_C: '5 octave C',
                magkinder_list_5_octave_D: '5 octave D',
                magkinder_list_5_octave_E: '5 octave E',
                magkinder_list_5_octave_F: '5 octave F',
                magkinder_list_5_octave_G: '5 octave G',
                magkinder_list_5_octave_A: '5 octave A',
                magkinder_list_5_octave_B: '5 octave B',
                magkinder_list_6_octave_C: '6 octave C',
                magkinder_list_codingMode: 'Coding',
                magkinder_list_lineMode: 'Line',
                magkinder_list_gestureFollowMode: 'Gesture follow',
                magkinder_list_handFollowMode: 'Hand follow',
                magkinder_list_AvoidMode: 'Avoid',
                magkinder_list_gestureCodingMode: 'Gesture coding',
                magkinder_list_cardCodingMode: 'Card coding',
                magkinder_received_bottomSensor_block: 'Bottom %1 sensor value',
                magkinder_received_cardSensor_block: 'Card %1 sensor value',
                magkinder_received_frontSensor_block: 'Front %1 sensor value',
                magkinder_transmit_autoSensor_block: 'Automatically update sensor values %1 %2',
                magkinder_transmit_moveStop_block: 'Stop %1',
                magkinder_transmit_move_block: 'Move to %1 %2 cm %3',
                magkinder_transmit_turn_block: 'Rotate to %1 %2 ° %3',
                magkinder_transmit_wheelSpeed_block: 'Set %1 wheel(s) speed %2 %3',
                magkinder_transmit_eyeLED_block: 'Set eye LED color to %1 %2',
                magkinder_transmit_volumm_block: 'Set sound volume to %1 %2',
                magkinder_transmit_speak_block: 'Speaking No. %1 %2',
                magkinder_transmit_scale_block: 'Speaking %1 %2',
                magkinder_transmit_modeSetting_block: 'Set %1 mode %2',
            }
        }
    };
};

Entry.MagKinder.blockMenuBlocks = [
    'magkinder_received_bottomSensor_block',
    'magkinder_received_cardSensor_block',
    'magkinder_received_frontSensor_block',
    //'magkinder_transmit_autoSensor_block',
    'magkinder_transmit_moveStop_block',
    'magkinder_transmit_move_block',
    'magkinder_transmit_turn_block',
    'magkinder_transmit_wheelSpeed_block',
    'magkinder_transmit_eyeLED_block',
    'magkinder_transmit_volumm_block',
    'magkinder_transmit_speak_block',
    'magkinder_transmit_scale_block',
    //'magkinder_transmit_modeSetting_block',
];

Entry.MagKinder.getBlocks = function() {
    return {
        // region MagKinder 맥킨더        
        magkinder_list_bottomSensor_block: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.magkinder_list_leftSide, '0'],
                        [Lang.template.magkinder_list_left, '1'],
                        [Lang.template.magkinder_list_right, '2'],
                        [Lang.template.magkinder_list_rightSide, '3'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: [null]
            },
            paramsKeyMap: {
                VALUE: 0
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('VALUE');
            }
        },
        magkinder_list_cardSensor_block: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.magkinder_list_front, '0'],
                        [Lang.template.magkinder_list_left, '1'],
                        [Lang.template.magkinder_list_right, '2'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: [null]
            },
            paramsKeyMap: {
                VALUE: 0
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('VALUE');
            }
        },
        magkinder_list_frontSensor_block: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.magkinder_list_left, '0'],
                        [Lang.template.magkinder_list_right, '1'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: [null]
            },
            paramsKeyMap: {
                VALUE: 0
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('VALUE');
            }
        },
        magkinder_list_toggle_block: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.magkinder_list_off, '0'],
                        [Lang.template.magkinder_list_on, '1'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: [null]
            },
            paramsKeyMap: {
                VALUE: 0
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('VALUE');
            }
        },
        magkinder_list_motionMove_block: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.magkinder_list_forward, '0'],
                        [Lang.template.magkinder_list_backwards, '1'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: [null]
            },
            paramsKeyMap: {
                VALUE: 0
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('VALUE');
            }
        },
        magkinder_list_motionTurn_block: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.magkinder_list_left, '2'],
                        [Lang.template.magkinder_list_right, '3'],
                    ],
                    value: '2',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: [null]
            },
            paramsKeyMap: {
                VALUE: 0
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('VALUE');
            }
        },
        magkinder_list_wheelSpeed_block: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.magkinder_list_left, '0'],
                        [Lang.template.magkinder_list_right, '1'],
                        [Lang.template.magkinder_list_both, '2'],
                    ],
                    value: '2',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: [null]
            },
            paramsKeyMap: {
                VALUE: 0
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('VALUE');
            }
        },
        magkinder_list_color_block: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.magkinder_list_off, '0'],
                        [Lang.template.magkinder_list_red, '1'],
                        [Lang.template.magkinder_list_blue, '2'],
                        [Lang.template.magkinder_list_green, '3'],
                        [Lang.template.magkinder_list_yellow, '4'],
                        [Lang.template.magkinder_list_purple, '5'],                        
                        [Lang.template.magkinder_list_white, '6'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: [null]
            },
            paramsKeyMap: {
                VALUE: 0
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('VALUE');
            }
        },
        magkinder_list_soundVolume_block: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ["0", '0'],
                        ["1", '1'],
                        ["2", '2'],
                        ["3", '3'],
                        ["4", '4'],
                        ["5", '5'],
                        ["6", '6'],
                        ["7", '7'],
                    ],
                    value: '7',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: [null]
            },
            paramsKeyMap: {
                VALUE: 0
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('VALUE');
            }
        },
        magkinder_list_speak_block: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ["1", '1'],
                        ["2", '2'],
                        ["3", '3'],
                        ["4", '4'],
                        ["5", '5'],
                        ["6", '6'],
                        ["7", '7'],
                        ["8", '8'],
                        ["9", '9'],
                        ["10", '10'],
                        ["11", '11'],
                        ["12", '12'],
                        ["13", '13'],
                        ["14", '14'],
                        ["15", '15'],
                        ["16", '16'],
                        ["17", '17'],
                        ["18", '18'],
                        ["19", '19'],
                        ["20", '20'],
                        ["21", '21'],
                        ["22", '22'],
                        ["23", '23'],
                        ["24", '24'],
                        ["25", '25'],
                        ["26", '26'],
                        ["27", '27'],
                        ["28", '28'],
                        ["29", '29'],
                        ["30", '30'],
                        ["31", '31'],
                        ["32", '32'],
                        ["33", '33'],
                        ["34", '34'],
                        ["35", '35'],
                        ["36", '36'],
                        ["37", '37'],
                    ],
                    value: '1',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: [null]
            },
            paramsKeyMap: {
                VALUE: 0
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('VALUE');
            }
        },
        magkinder_list_scale_block: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.magkinder_list_4_octave_C, '22'],
                        [Lang.template.magkinder_list_4_octave_D, '23'],
                        [Lang.template.magkinder_list_4_octave_E, '24'],
                        [Lang.template.magkinder_list_4_octave_F, '25'],
                        [Lang.template.magkinder_list_4_octave_G, '26'],
                        [Lang.template.magkinder_list_4_octave_A, '27'],
                        [Lang.template.magkinder_list_4_octave_B, '28'],
                        [Lang.template.magkinder_list_5_octave_C, '29'],
                        [Lang.template.magkinder_list_5_octave_D, '30'],
                        [Lang.template.magkinder_list_5_octave_E, '31'],
                        [Lang.template.magkinder_list_5_octave_F, '32'],
                        [Lang.template.magkinder_list_5_octave_G, '33'],
                        [Lang.template.magkinder_list_5_octave_A, '34'],
                        [Lang.template.magkinder_list_5_octave_B, '35'],
                        [Lang.template.magkinder_list_6_octave_C, '36'],
                    ],
                    value: '22',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: [null]
            },
            paramsKeyMap: {
                VALUE: 0
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('VALUE');
            }
        },
        magkinder_list_modeSetting_block: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.magkinder_list_codingMode, '0'],
                        [Lang.template.magkinder_list_lineMode, '1'],
                        [Lang.template.magkinder_list_gestureFollowMode, '2'],
                        [Lang.template.magkinder_list_handFollowMode, '3'],
                        [Lang.template.magkinder_list_AvoidMode, '4'],
                        [Lang.template.magkinder_list_gestureCodingMode, '5'],
                        [Lang.template.magkinder_list_cardCodingMode, '6'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: [null]
            },
            paramsKeyMap: {
                VALUE: 0
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('VALUE');
            }
        },
        magkinder_received_bottomSensor_block: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            statements: [],
            template: Lang.template.magkinder_received_bottomSensor_block,
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
            ],
            def: {
                params: [
                    {
                        type: 'magkinder_list_bottomSensor_block',
                    },
                ],
                type: 'magkinder_received_bottomSensor_block',
            },
            paramsKeyMap: {
                BOTTOM_SENSOR: 0
            },
            events: {},
            class: 'SensorClass',
            isNotFor: ['magkinder'],
            func: function(sprite, script) {
                var select = script.getNumberValue('BOTTOM_SENSOR');
                var received = Entry.hw.portData;
                var data = 0;

                switch(select)
                {
                    case 0: data = received.bottom.leftSide; break;
                    case 1: data = received.bottom.left; break;
                    case 2: data = received.bottom.right; break;
                    case 3: data = received.bottom.rightSide; break;
                }

                return data; 
            },
        },
        magkinder_received_cardSensor_block: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            statements: [],
            template: Lang.template.magkinder_received_cardSensor_block,
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
            ],
            def: {
                params: [
                    {
                        type: 'magkinder_list_cardSensor_block',
                    },
                ],
                type: 'magkinder_received_cardSensor_block',
            },
            paramsKeyMap: {
                CARD_SENSOR: 0
            },
            events: {},
            class: 'SensorClass',
            isNotFor: ['magkinder'],
            func: function(sprite, script) {
                var select = script.getNumberValue('CARD_SENSOR');
                var received = Entry.hw.portData;
                var data = 0;

                switch(select)
                {
                    case 0: data = received.card.front; break;
                    case 1: data = received.card.left; break;
                    case 2: data = received.card.right; break;
                }

                return data; 
            },
        },
        magkinder_received_frontSensor_block: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            fontColor: '#fff',
            statements: [],
            template: Lang.template.magkinder_received_frontSensor_block,
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
            ],
            def: {
                params: [
                    {
                        type: 'magkinder_list_frontSensor_block',
                    },
                ],
                type: 'magkinder_received_frontSensor_block',
            },
            paramsKeyMap: {
                CARD_SENSOR: 0
            },
            events: {},
            class: 'SensorClass',
            isNotFor: ['magkinder'],
            func: function(sprite, script) {
                var select = script.getNumberValue('CARD_SENSOR');
                var received = Entry.hw.portData;
                var data = 0;

                switch(select)
                {
                    case 0: data = received.front.left; break;
                    case 1: data = received.front.right; break;
                }

                return data; 
            },
        },
        magkinder_transmit_autoSensor_block: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: Lang.template.magkinder_transmit_autoSensor_block,
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
            def: {
                params: [
                    {
                        type: 'magkinder_list_toggle_block',
                    },
                    null,
                ],
                type: 'magkinder_transmit_autoSensor_block',
            },
            paramsKeyMap: {
                TOGGLE: 1,
            },
            events: {},
            class: 'SensorClass',
            isNotFor: ['magkinder'],
            func: function(sprite, script) {
                var data = script.getNumberValue("TOGGLE");

                if(!script.isStart)
                {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.MagKinder.removeTimeout(timer);
                    }, Entry.MagKinder.delayTime);
                    Entry.MagKinder.timeouts.push(timer);
                    return script;
                }
                else if(script.timeFlag == 1)
                {
                    return script;
                }
                else
                {
                    Entry.hw.sendQueue['TRANSMIT'] = {};
                    Entry.hw.sendQueue['TRANSMIT'][Entry.MagKinder.array.AutoSensing] = {
                        Toggle: data,
                        Time: new Date().getTime(),
                    };
                    return script.callReturn();
                }
            },
        },
        magkinder_transmit_moveStop_block: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: Lang.template.magkinder_transmit_moveStop_block,
             params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            def: {
                params: [
                    null,
                ],
                type: 'magkinder_transmit_moveStop_block',
            },
            paramsKeyMap: {
            },
            events: {},
            class: 'MoveClass',
            isNotFor: ['magkinder'],
            func: function(sprite, script) {

                if(!script.isStart)
                {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.MagKinder.removeTimeout(timer);
                    }, Entry.MagKinder.delayTime);
                    Entry.MagKinder.timeouts.push(timer);
                    return script;
                }
                else if(script.timeFlag == 1)
                {
                    return script;
                }
                else
                {
                    Entry.hw.sendQueue['TRANSMIT'] = {};
                    Entry.hw.sendQueue['TRANSMIT'][Entry.MagKinder.array.Stop] = {
                        Time: new Date().getTime(),
                    };
                    return script.callReturn();
                }
            },
        },
        magkinder_transmit_move_block: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: Lang.template.magkinder_transmit_move_block,
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
            def: {
                params: [
                    {
                        type: 'magkinder_list_motionMove_block',
                    },
                    {
                        type: 'number',
                        params: ['10'],
                    },
                    null,
                ],
                type: 'magkinder_transmit_move_block',
            },
            paramsKeyMap: {
            	DIRECTION: 0,
            	DISTANCE: 1,
            },
            events: {},
            class: 'MoveClass',
            isNotFor: ['magkinder'],
            func: function(sprite, script) {
            	var direction = script.getNumberValue("DIRECTION");
            	var distance = script.getNumberValue("DISTANCE") * 10;

                if(!script.isStart)
                {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.MagKinder.removeTimeout(timer);
                    }, Entry.MagKinder.delayTime);
                    Entry.MagKinder.timeouts.push(timer);
                    return script;
                }
                else if(script.timeFlag == 1)
                {
                    return script;
                }
                else
                {
                    Entry.hw.sendQueue['TRANSMIT'] = {};
                    Entry.hw.sendQueue['TRANSMIT'][Entry.MagKinder.array.Move] = {
                    	Direction: direction,
                    	Distance: distance,
                        Time: new Date().getTime(),
                    };
                    return script.callReturn();
                }
            },
        },
        magkinder_transmit_turn_block: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: Lang.template.magkinder_transmit_turn_block,
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
            def: {
                params: [
                    {
                        type: 'magkinder_list_motionTurn_block',
                    },
                    {
                        type: 'number',
                        params: ['90'],
                    },
                    null,
                ],
                type: 'magkinder_transmit_turn_block',
            },
            paramsKeyMap: {
            	DIRECTION: 0,
            	ANGLE: 1,
            },
            events: {},
            class: 'MoveClass',
            isNotFor: ['magkinder'],
            func: function(sprite, script) {
            	var direction = script.getNumberValue("DIRECTION");
            	var angle = script.getNumberValue("ANGLE");

                if(!script.isStart)
                {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.MagKinder.removeTimeout(timer);
                    }, Entry.MagKinder.delayTime);
                    Entry.MagKinder.timeouts.push(timer);
                    return script;
                }
                else if(script.timeFlag == 1)
                {
                    return script;
                }
                else
                {
                    Entry.hw.sendQueue['TRANSMIT'] = {};
                    Entry.hw.sendQueue['TRANSMIT'][Entry.MagKinder.array.Turn] = {
                    	Direction: direction,
                    	Angle: angle,
                        Time: new Date().getTime(),
                    };
                    return script.callReturn();
                }
            },
        },
        magkinder_transmit_wheelSpeed_block: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: Lang.template.magkinder_transmit_wheelSpeed_block,
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
            def: {
                params: [
                    {
                        type: 'magkinder_list_wheelSpeed_block',
                    },
                    {
                        type: 'number',
                        params: ['999'],
                    },
                    null,
                ],
                type: 'magkinder_transmit_wheelSpeed_block',
            },
            paramsKeyMap: {
            	WHEEL: 0,
            	SPEED: 1,
            },
            events: {},
            class: 'MoveClass',
            isNotFor: ['magkinder'],
            func: function(sprite, script) {
            	var wheel = script.getNumberValue("WHEEL");
            	var speed = script.getNumberValue("SPEED");

            	if(speed < -999) speed = -999;
            	else if(speed > 999) speed = 999;

                if(!script.isStart)
                {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.MagKinder.removeTimeout(timer);
                    }, Entry.MagKinder.delayTime);
                    Entry.MagKinder.timeouts.push(timer);
                    return script;
                }
                else if(script.timeFlag == 1)
                {
                    return script;
                }
                else
                {
                    Entry.hw.sendQueue['TRANSMIT'] = {};
                    Entry.hw.sendQueue['TRANSMIT'][Entry.MagKinder.array.WheelSpeed] = {
                    	Wheel: wheel,
                    	Speed: speed,
                        Time: new Date().getTime(),
                    };
                    return script.callReturn();
                }
            },
        },
        magkinder_transmit_eyeLED_block: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: Lang.template.magkinder_transmit_eyeLED_block,
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
            def: {
                params: [
                    {
                        type: 'magkinder_list_color_block',
                    },
                    null,
                ],
                type: 'magkinder_transmit_eyeLED_block',
            },
            paramsKeyMap: {
            	COLOR: 0,
            	SPEED: 1,
            },
            events: {},
            class: 'LedClass',
            isNotFor: ['magkinder'],
            func: function(sprite, script) {
            	var color = script.getNumberValue("COLOR");

                if(!script.isStart)
                {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.MagKinder.removeTimeout(timer);
                    }, Entry.MagKinder.delayTime);
                    Entry.MagKinder.timeouts.push(timer);
                    return script;
                }
                else if(script.timeFlag == 1)
                {
                    return script;
                }
                else
                {
                    Entry.hw.sendQueue['TRANSMIT'] = {};
                    Entry.hw.sendQueue['TRANSMIT'][Entry.MagKinder.array.LED] = {
                    	Color: color,
                        Time: new Date().getTime(),
                    };
                    return script.callReturn();
                }
            },
        },
        magkinder_transmit_volumm_block: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: Lang.template.magkinder_transmit_volumm_block,
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
            def: {
                params: [
                    {
                        type: 'magkinder_list_soundVolume_block',
                    },
                    null,
                ],
                type: 'magkinder_transmit_volumm_block',
            },
            paramsKeyMap: {
            	VOLUME: 0
            },
            events: {},
            class: 'SoundClass',
            isNotFor: ['magkinder'],
            func: function(sprite, script) {
            	var volume = script.getNumberValue("VOLUME");

                if(!script.isStart)
                {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.MagKinder.removeTimeout(timer);
                    }, Entry.MagKinder.delayTime);
                    Entry.MagKinder.timeouts.push(timer);
                    return script;
                }
                else if(script.timeFlag == 1)
                {
                    return script;
                }
                else
                {
                    Entry.hw.sendQueue['TRANSMIT'] = {};
                    Entry.hw.sendQueue['TRANSMIT'][Entry.MagKinder.array.Volume] = {
                    	Volume: volume,
                        Time: new Date().getTime(),
                    };
                    return script.callReturn();
                }
            },
        },
        magkinder_transmit_speak_block: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: Lang.template.magkinder_transmit_speak_block,
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
            def: {
                params: [
                    {
                        type: 'magkinder_list_speak_block',
                    },
                    null,
                ],
                type: 'magkinder_transmit_speak_block',
            },
            paramsKeyMap: {
            	SPEAK: 0
            },
            events: {},
            class: 'SoundClass',
            isNotFor: ['magkinder'],
            func: function(sprite, script) {
            	var speak = script.getNumberValue("SPEAK") - 1;

                if(!script.isStart)
                {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.MagKinder.removeTimeout(timer);
                    }, Entry.MagKinder.delayTime);
                    Entry.MagKinder.timeouts.push(timer);
                    return script;
                }
                else if(script.timeFlag == 1)
                {
                    return script;
                }
                else
                {
                    Entry.hw.sendQueue['TRANSMIT'] = {};
                    Entry.hw.sendQueue['TRANSMIT'][Entry.MagKinder.array.Speak] = {
                    	Speak: speak,
                        Time: new Date().getTime(),
                    };
                    return script.callReturn();
                }
            },
        },
        magkinder_transmit_scale_block: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: Lang.template.magkinder_transmit_scale_block,
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
            def: {
                params: [
                    {
                        type: 'magkinder_list_scale_block',
                    },
                    null,
                ],
                type: 'magkinder_transmit_scale_block',
            },
            paramsKeyMap: {
                SCALE: 0
            },
            events: {},
            class: 'SoundClass',
            isNotFor: ['magkinder'],
            func: function(sprite, script) {
                var scale = script.getNumberValue("SCALE");

                if(!script.isStart)
                {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.MagKinder.removeTimeout(timer);
                    }, Entry.MagKinder.delayTime);
                    Entry.MagKinder.timeouts.push(timer);
                    return script;
                }
                else if(script.timeFlag == 1)
                {
                    return script;
                }
                else
                {
                    Entry.hw.sendQueue['TRANSMIT'] = {};
                    Entry.hw.sendQueue['TRANSMIT'][Entry.MagKinder.array.Scale] = {
                        Scale: scale,
                        Time: new Date().getTime(),
                    };
                    return script.callReturn();
                }
            },
        },
        magkinder_transmit_modeSetting_block: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            fontColor: '#fff',
            statements: [],
            template: Lang.template.magkinder_transmit_modeSetting_block,
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
            def: {
                params: [
                    {
                        type: 'magkinder_list_modeSetting_block',
                    },
                    null,
                ],
                type: 'magkinder_transmit_modeSetting_block',
            },
            paramsKeyMap: {
                MODE: 0
            },
            events: {},
            class: 'ModeSettingClass',
            isNotFor: ['magkinder'],
            func: function(sprite, script) {
                var mode = script.getNumberValue("MODE");

                if(!script.isStart)
                {
                    script.isStart = true;
                    script.timeFlag = 1;
                    var timer = setTimeout(function() {
                        script.timeFlag = 0;
                        Entry.MagKinder.removeTimeout(timer);
                    }, Entry.MagKinder.delayTime);
                    Entry.MagKinder.timeouts.push(timer);
                    return script;
                }
                else if(script.timeFlag == 1)
                {
                    return script;
                }
                else
                {
                    Entry.hw.sendQueue['TRANSMIT'] = {};
                    Entry.hw.sendQueue['TRANSMIT'][Entry.MagKinder.array.Mode] = {
                        Mode: mode,
                        Time: new Date().getTime(),
                    };
                    return script.callReturn();
                }
            },
        },
        // endregion MagKinder 맥킨더
    };
};

module.exports = Entry.MagKinder