'use strict';

Entry.toybot = {
    id: ['4C.2'],
    name: 'toybot',
    url: 'http://www.jinirobot.com',
    imageName: 'jinirobot_toybot.png',
    title: {
        ko: 'ToyBot',
        en: 'ToyBot',
    },
    delayTime: 0.01,
    timeouts: [],
    scoreFlag: false,
    removeAllTimeouts: function() {
        var timeouts = this.timeouts;
        for (var i in timeouts) {
            clearTimeout(timeouts[i]);
        }
        this.timeouts = [];
    },    
    setZero: function() {
        Entry.hw.sendQueue['setblock'] = {
            id: Math.random(),
            setZero: 1
        };
        Entry.hw.update();
        this.setCount = 0;
    },
    removeTimeout: function(id) {
        clearTimeout(id);
        var timeouts = this.timeouts;
        var index = timeouts.indexOf(id);
        if (index >= 0) {
            timeouts.splice(index, 1);
        }
    },
    convert: function(value) {
        const temp = Number(value);
        return isNaN(temp) ? value : temp;
    },
    checkRangeInteger: function(value, min, max) {
        if (isNaN(value)) {
            return 0;
        } else {
            let temp = parseInt(Math.round(value));
            if (temp < min)
                temp = min;
            else if (temp > max)
                temp = max;
            return temp;
        }
    },
    setProcessor: function(script, delayTime, code) {
        if (!script.isStart) {
            script.isStart = true;
            script.timeFlag = 1;
            const fps = Entry.FPS || 60;
            const timeValue = (60 / fps) * delayTime * 1000;
            Entry.TimeWaitManager.add(
                Math.random(),
                () => {
                    script.timeFlag = 0;
                },
                timeValue
            );
            Entry.toybot.scoreFlag = code();
            return script;
        } else if (script.timeFlag == 1) {
            return script;
        } else {
            if (Entry.toybot.scoreFlag === true) {
                Entry.hw.sendQueue['setblock'] = {
                    id: Math.random(),
                    playScore: {
                        beat: 0x0B,
                        pitch: 0,
                    }
                };
                Entry.hw.update();
            }

            delete script.timeFlag;
            delete script.isStart;
            Entry.engine.isContinue = false;
            return script.callReturn();
        }
    },
};

Entry.toybot.setLanguage = function() {
    return {
        ko: {
            template: {
                list_all: '모두',
                list_button_a: 'A',
                list_button_b: 'B',
                list_color_white: '흰색',
                list_color_red: '빨간색',
                list_color_orange: '주황색',
                list_color_yellow: '노란색',
                list_color_green: '초록색',
                list_color_blue: '파란색',
                list_color_navy: '남색',
                list_color_violet: '보라색',
                list_color_off: '끄기',
                list_accidental_natural: '기본음',
                list_accidental_sharp: '반올림',
                list_accidental_flat: '반내림',
                list_beat_oneeight: '1/8박',
                list_beat_onefour: '1/4박',
                list_beat_onetwo: '1/2박',
                list_beat_one: '1박',
                list_beat_onehalf: '1.5박',
                list_beat_two: '2박',
                list_beat_three: '3박',
                list_beat_four: '4박',
                list_octave_low: '낮은',
                list_octave_middle: '보통',
                list_octave_high: '높은',
                list_pitch_c: '도',
                list_pitch_d: '레',
                list_pitch_e: '미',
                list_pitch_f: '파',
                list_pitch_g: '솔',
                list_pitch_a: '라',
                list_pitch_b: '시',
                list_pitch_r: '쉼표',
                list_rotation_forward: '정회전',
                list_rotation_reverse: '역회전',
                list_rotation_stop: '정지',
                get_ultrasonic_distance: '초음파센서 거리값',
                get_button_state: '%1 버튼 값',
                get_analog_input: '아날로그 입력 값',
                get_servo_angle: '%1번 서보모터 각도 값',
                set_led_color_name: 'LED의 색깔을 %1(으)로 정하기 %2',
                set_led_rgb: 'LED의 색깔을 빨강 %1, 초록 %2, 파랑 %3(으)로 바꾸기 %4',                
                set_play_score: '음표를 %1 %2 %3 %4으로 연주하기 %5',
                set_play_sound_effect: '%1번 효과음 연주하기 %2',
                set_play_melody: '%1번 멜로디 연주하기 %2',
                set_servo_each: '서보모터 %1을(를) 속도 %2, 각도 %3으로 회전하기 %4',
                set_servo_all: '모든 서보모터를 속도 %1, 각도 %2, %3, %4, %5, %6(으)로 회전하기 %7',
                set_servo_home: '모든 서보모터를 속도 %1, 기본위치로 제어하기 %2',
                set_analog_output: '아날로그 출력값을 %1(으)로 정하기 %2',
                set_dc_run: 'DC 모터 %1을(를) 속도 %2(으)로 %3 하기 %4 ',                
                set_servo_offset: '서보모터 %1 의 각도 90°를 현재 위치로 정하기%2',
                set_servo_reset: '모든 설정값을 공장초기화 하기 %1',



                warning_index: '항목 없음',
                warning_over_range: '측정 범위 초과',
            },
        },
        en: {
            template: {
                list_all: 'All',
                list_button_a: 'A',
                list_button_b: 'B',
                list_color_white: 'White',
                list_color_red: 'Red',
                list_color_orange: 'Orange',
                list_color_yellow: 'Yellow',
                list_color_green: 'Green',
                list_color_blue: 'Blue',
                list_color_navy: 'Navy',
                list_color_violet: 'Violet',
                list_color_off: 'Off',
                list_accidental_natural: 'Natural',
                list_accidental_sharp: 'Sharp',
                list_accidental_flat: 'Flat',
                list_beat_oneeight: '1/8 of a beats',
                list_beat_onefour: '1/4 of a beats',
                list_beat_onetwo: '1/2 of a beats',
                list_beat_one: '1 beat',
                list_beat_onehalf: '1.5 beats',
                list_beat_two: '2 beats',
                list_beat_three: '3 beats',
                list_beat_four: '4 beats',
                list_octave_low: 'Low',
                list_octave_middle: 'Middle',
                list_octave_high: 'High',
                list_pitch_c: 'C',
                list_pitch_d: 'D',
                list_pitch_e: 'E',
                list_pitch_f: 'F',
                list_pitch_g: 'G',
                list_pitch_a: 'A',
                list_pitch_b: 'B',
                list_pitch_r: 'Rest',
                list_rotation_forward: 'Forward rotation',
                list_rotation_reverse: 'Reverse rotation',
                list_rotation_stop: 'Stop',
                get_ultrasonic_distance: 'Ultrasonic wave sensor distance value',
                get_button_state: '%1 button value',
                get_analog_input: 'Analog input value',
                get_servo_angle: 'No.%1 servo motor angle value',
                set_led_color_name: 'Set LED color to %1 %2',                
                set_led_rgb: 'Set LED color to red %1, green %2, blue %3 %4',
                set_play_score: 'Play note to %1 %2 %3 %4 %5',
                set_play_sound_effect: 'Play No.%1 sound effect %2',
                set_play_melody: 'Play No.%1 melody %2',
                set_servo_each: 'Rotate %1 servo motor to speed %2, angle %3 %4',
                set_servo_all: 'Rotate all servo motor to speed %1, angle %2, %3, %4, %5, %6 %7',
                set_servo_home: 'Control all servo motor to speed %1, home position %2',
                set_analog_output: 'Set analog output to %1 %2',
                set_dc_run: '%3 DC motor %1 to speed %2 %4',
                set_servo_offset: 'Set angle 90° of servo motor %1 to current position %2',
                set_servo_reset: 'Factory reset all settings %1',

                
                warning_index: 'No item',
                warning_over_range: 'Measurement over range',
            }
        },
    };
};

Entry.toybot.blockMenuBlocks = [
    'dropdown_button',
    'dropdown_color',
    'dropdown_accidental',
    'dropdown_beat',
    'dropdown_octave',
    'dropdown_pitch',
    'dropdown_effect',
    'dropdown_melody',
    'dropdown_servo',
    'dropdown_servo_all',
    'dropdown_speed',
    'dropdown_dc',
    'dropdown_rotation',
    'get_ultrasonic_distance',
    'get_button_state',
    'get_analog_input',
    'get_servo_angle',
    'set_led_color_name',
    'set_led_rgb',
    'set_play_score',
    'set_play_sound_effect',
    'set_play_melody',
    'set_servo_each',
    'set_servo_all',
    'set_servo_home',
    'set_analog_output',
    'set_dc_run',
    'set_servo_offset',
    'set_servo_reset'
];

Entry.toybot.getBlocks = function() {
    return {
        ///========================================================================================
        /// dropdown
        ///========================================================================================
        dropdown_button: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.list_button_a, 0],
                        [Lang.template.list_button_b, 1]
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE
                }
            ],
            def: {
                params: [null]
            },
            paramsKeyMap: {
                INDEX: 0
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('INDEX');
            }
        },
        dropdown_color: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.list_color_white, 1],
                        [Lang.template.list_color_red, 2],
                        [Lang.template.list_color_orange, 3],
                        [Lang.template.list_color_yellow, 4],
                        [Lang.template.list_color_green, 5],
                        [Lang.template.list_color_blue, 6],
                        [Lang.template.list_color_navy, 7],
                        [Lang.template.list_color_violet, 8],
                        [Lang.template.list_color_off, 0]
                    ],
                    value: 5,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE
                }
            ],
            def: {
                params: [null]
            },
            paramsKeyMap: {
                INDEX: 0
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('INDEX');
            }
        },
        dropdown_accidental: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.list_accidental_natural, 0],
                        [Lang.template.list_accidental_sharp, 1],
                        [Lang.template.list_accidental_flat, -1]
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE
                }
            ],
            def: {
                params: [null]
            },
            paramsKeyMap: {
                INDEX: 0
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('INDEX');
            }
        },
        dropdown_beat: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.list_beat_oneeight, 1],
                        [Lang.template.list_beat_onefour, 2],
                        [Lang.template.list_beat_onetwo, 3],
                        [Lang.template.list_beat_one, 4],
                        [Lang.template.list_beat_onehalf, 5],
                        [Lang.template.list_beat_two, 6],
                        [Lang.template.list_beat_three, 7],
                        [Lang.template.list_beat_four, 8]
                    ],
                    value: 4,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE
                }
            ],
            def: {
                params: [null]
            },
            paramsKeyMap: {
                INDEX: 0
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('INDEX');
            }
        },
        dropdown_octave: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.list_octave_low, 4],
                        [Lang.template.list_octave_middle, 5],
                        [Lang.template.list_octave_high, 6]
                    ],
                    value: 5,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE
                }
            ],
            def: {
                params: [null]
            },
            paramsKeyMap: {
                INDEX: 0
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('INDEX');
            }
        },
        dropdown_pitch: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.list_pitch_c, 1],
                        [Lang.template.list_pitch_d, 2],
                        [Lang.template.list_pitch_e, 3],
                        [Lang.template.list_pitch_f, 4],
                        [Lang.template.list_pitch_g, 5],
                        [Lang.template.list_pitch_a, 6],
                        [Lang.template.list_pitch_b, 7],
                        [Lang.template.list_pitch_r, 0]
                    ],
                    value: 1,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE
                }
            ],
            def: {
                params: [null]
            },
            paramsKeyMap: {
                INDEX: 0
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('INDEX');
            }
        },
        dropdown_effect: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', 1],
                        ['2', 2],
                        ['3', 3],
                        ['4', 4],
                        ['5', 5]
                    ],
                    value: 1,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE
                }
            ],
            def: {
                params: [null]
            },
            paramsKeyMap: {
                INDEX: 0
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('INDEX');
            }
        },
        dropdown_melody: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', 1],
                        ['2', 2],
                        ['3', 3],
                        ['4', 4]
                    ],
                    value: 1,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE
                }
            ],
            def: {
                params: [null]
            },
            paramsKeyMap: {
                INDEX: 0
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('INDEX');
            }
        },
        dropdown_servo: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['0', 0],
                        ['1', 1],
                        ['2', 2],
                        ['3', 3],
                        ['4', 4]
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE
                }
            ],
            def: {
                params: [null]
            },
            paramsKeyMap: {
                INDEX: 0
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('INDEX');
            }
        },        
        dropdown_servo_all: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['0', 0],
                        ['1', 1],
                        ['2', 2],
                        ['3', 3],
                        ['4', 4],
                        [Lang.template.list_all, 5]
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE
                }
            ],
            def: {
                params: [null]
            },
            paramsKeyMap: {
                INDEX: 0
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('INDEX');
            }
        },
        dropdown_speed: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [                        
                        ['1', 1],
                        ['2', 2],
                        ['3', 3],
                        ['4', 4],
                        ['5', 5]
                    ],
                    value: 3,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE
                }
            ],
            def: {
                params: [null]
            },
            paramsKeyMap: {
                INDEX: 0
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('INDEX');
            }
        },
        dropdown_dc: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', 1],
                        ['2', 2],
                        [Lang.template.list_all, 3]
                    ],
                    value: 1,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE
                }
            ],
            def: {
                params: [null]
            },
            paramsKeyMap: {
                INDEX: 0
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('INDEX');
            }
        },        
        dropdown_rotation: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.list_rotation_forward, 1],
                        [Lang.template.list_rotation_reverse, -1],
                        [Lang.template.list_rotation_stop, 0]
                    ],
                    value: 1,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE
                }
            ],
            def: {
                params: [null]
            },
            paramsKeyMap: {
                INDEX: 0
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('INDEX');
            }
        },
        ///========================================================================================
        /// getblock
        ///========================================================================================
        get_ultrasonic_distance: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: Lang.template.get_ultrasonic_distance,
            params: [],
            events: {},
            def: {
                type: 'get_ultrasonic_distance'
            },
            paramsKeyMap: {},
            class: 'getblock',
            isNotFor: ['toybot'],
            func: function(sprite, script) { 
                const datas = Entry.hw.portData['getblock'];
                return datas['distance'] === 65535
                    ? Lang.template.warning_over_range
                    : datas['distance'] / 10;
            }
        },
        get_button_state: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: Lang.template.get_button_state,
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'dropdown_button'
                    }
                ],
                type: 'get_button_state'
            },
            paramsKeyMap: {
                BUTTON: 0
            },
            class: 'getblock',
            isNotFor: ['toybot'],
            func: function(sprite, script) {
                const button = Entry.toybot.convert(script.getValue('BUTTON', script));
                const datas = Entry.hw.portData['getblock'];
                switch (button) {
                    case 0:
                    case Lang.template.list_button_a:
                        return datas['button'][0] > 0 ? 1 : 0;
                    case 1:
                    case Lang.template.list_button_b:
                        return datas['button'][1] > 0 ? 1 : 0;
                    default: 
                        return Lang.template.warning_index;
                }
            }
        },
        get_analog_input: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: Lang.template.get_analog_input,
            params: [],
            events: {},
            def: {
                type: 'get_analog_input'
            },
            paramsKeyMap: {},
            class: 'getblock',
            isNotFor: ['toybot'],
            func: function(sprite, script) {
                const datas = Entry.hw.portData['getblock'];
                return Math.round((datas['analog'] / 1023) * 100);
            }
        },
        get_servo_angle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: Lang.template.get_servo_angle,
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                }
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'dropdown_servo'
                    }
                ],
                type: 'get_servo_angle'
            },
            paramsKeyMap: {
                SERVO: 0
            },
            class: 'getblock',
            isNotFor: ['toybot'],
            func: function(sprite, script) {
                const servo = Entry.toybot.convert(script.getValue('SERVO', script));
                const datas = Entry.hw.portData['getblock'];
                this.servoPosition = datas['servo'];
                switch (servo) {
                    case 0:
                        return Math.round(datas['servo'][0] / 10);
                    case 1:
                        return Math.round(datas['servo'][1] / 10);
                    case 2:
                        return Math.round(datas['servo'][2] / 10);
                    case 3:
                        return Math.round(datas['servo'][3] / 10);
                    case 4:
                        return Math.round(datas['servo'][4] / 10);
                    default:
                        return Lang.template.warning_index;
                }
            }
        },
        ///========================================================================================
        /// setblock
        ///========================================================================================        
        set_led_color_name: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.set_led_color_name,
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12
                }
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'dropdown_color'
                    },
                    null
                ],
                type: 'set_led_color_name'
            },
            paramsKeyMap: {
                COLOR: 0
            },
            class: 'setblock',
            isNotFor: ['toybot'],
            func: function(sprite, script) {
                return Entry.toybot.setProcessor(script, Entry.toybot.delayTime, function() {
                    const colorName = Entry.toybot.convert(script.getValue('COLOR', script));
                    const color = {
                        r: 0x00,
                        g: 0x00,
                        b: 0x00
                    };
                    switch (colorName) {
                        case 0:
                        case Lang.template.list_color_off:
                            color.r = 0x00;
                            color.g = 0x00;
                            color.b = 0x00;
                            break;
                        case 1:
                        case Lang.template.list_color_white:
                            color.r = 0xFF;
                            color.g = 0xFF;
                            color.b = 0xFF;
                            break;
                        case 2:
                        case Lang.template.list_color_red:
                            color.r = 0xFF;
                            color.g = 0x00;
                            color.b = 0x00;
                            break;
                        case 3:
                        case Lang.template.list_color_orange:
                            color.r = 0xFF;
                            color.g = 0x80;
                            color.b = 0x00;
                            break;
                        case 4:
                        case Lang.template.list_color_yellow:
                            color.r = 0xFF;
                            color.g = 0xFF;
                            color.b = 0x00;
                            break;
                        case 5:
                        case Lang.template.list_color_green:
                            color.r = 0x00;
                            color.g = 0x80;
                            color.b = 0x00;
                            break;
                        case 6:
                        case Lang.template.list_color_blue:
                            color.r = 0x00;
                            color.g = 0x00;
                            color.b = 0xFF;
                            break;
                        case 7:
                        case Lang.template.list_color_navy:
                            color.r = 0x00;
                            color.g = 0x00;
                            color.b = 0x80;
                            break;
                        case 8:
                        case Lang.template.list_color_violet:
                            color.r = 0x7F;
                            color.g = 0x00;
                            color.b = 0xFF;
                            break;
                    }
                    Entry.hw.sendQueue['setblock'] = {
                        id: Math.random(),
                        ledControl: color
                    };

                    return false;
                });
            }
        },
        set_led_rgb: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.set_led_rgb,
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12
                }
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'number',
                        params: [ 100 ]
                    },
                    {
                        type: 'number',
                        params: [ 100 ]
                    },
                    {
                        type: 'number',
                        params: [ 100 ]
                    },
                    null
                ],
                type: 'set_led_rgb'
            },
            paramsKeyMap: {
                RED: 0,
                GREEN: 1,
                BLUE: 2
            },
            class: 'setblock',
            isNotFor: ['toybot'],
            func: function(sprite, script) {
                return Entry.toybot.setProcessor(script, Entry.toybot.delayTime, function() {
                    const red = Entry.toybot.convert(script.getValue('RED', script));
                    const green = Entry.toybot.convert(script.getValue('GREEN', script));
                    const blue = Entry.toybot.convert(script.getValue('BLUE', script));
                    const color = {
                        r: Entry.toybot.checkRangeInteger(red * 2.55, 0, 255),
                        g: Entry.toybot.checkRangeInteger(green * 2.55, 0, 255),
                        b: Entry.toybot.checkRangeInteger(blue * 2.55, 0, 255)
                    };
                    Entry.hw.sendQueue['setblock'] = {
                        id: Math.random(),
                        ledControl: color
                    };

                    return false;
                });
            }
        },
        set_play_score: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.set_play_score,
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                }
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'dropdown_octave'
                    },
                    {
                        type: 'dropdown_pitch'
                    },
                    {
                        type: 'dropdown_accidental'
                    },
                    {
                        type: 'dropdown_beat'
                    },
                    null
                ],
                type: 'set_play_score'
            },
            paramsKeyMap: {
                OCTAVE: 0,
                PITCH: 1,
                ACCIDENTAL: 2,
                BEAT: 3
            },
            class: 'setblock',
            isNotFor: ['toybot'],
            func: function(sprite, script) {
                let beat = Entry.toybot.convert(script.getValue('BEAT', script));
                let octave = Entry.toybot.convert(script.getValue('OCTAVE', script));
                let accidental = Entry.toybot.convert(script.getValue('ACCIDENTAL', script));
                let pitch = Entry.toybot.convert(script.getValue('PITCH', script));
                let delayTime = 0;
                const note = {
                    beat: 0,
                    pitch: 0
                };
                switch (beat) {
                    case 1:
                    case Lang.template.list_beat_oneeight:
                        beat = 11;
                        delayTime = 0.0625;
                        break;                            
                    case 2:
                    case Lang.template.list_beat_onefour:
                        beat = 9;
                        delayTime = 0.125;
                        break;
                    case 3:
                    case Lang.template.list_beat_onetwo:
                        beat = 7;
                        delayTime = 0.25;
                        break;
                    case 4:
                    case Lang.template.list_beat_one:
                        beat = 5;
                        delayTime = 0.5;
                        break;
                    case 5:
                    case Lang.template.list_beat_onehalf:
                        beat = 4;
                        delayTime = 0.75;
                        break;
                    case 6:
                    case Lang.template.list_beat_two:
                        beat = 3;
                        delayTime = 1;
                        break;
                    case 7:
                    case Lang.template.list_beat_three:
                        beat = 2;
                        delayTime = 1.5;
                        break;
                    case 8:
                    case Lang.template.list_beat_four:
                        beat = 1;
                        delayTime = 2;
                        break;
                }
                return Entry.toybot.setProcessor(script, delayTime, function() {                    
                    switch (octave) {
                        case 4:
                        case Lang.template.list_octave_low:
                            octave = 0x40;
                            break;
                        case 5:
                        case Lang.template.list_octave_middle:
                            octave = 0x50;
                            break;
                        case 6:
                        case Lang.template.list_octave_high:
                            octave = 0x60;
                            break;
                    }
                    switch (accidental) {
                        case 0:
                        case Lang.template.list_accidental_natural:
                            accidental = 0;
                            break;
                        case 1:
                        case Lang.template.list_accidental_sharp:
                            accidental = 1;
                            break;
                        case -1:
                        case Lang.template.list_accidental_flat:
                            accidental = -1;
                            break;
                    }
                    switch (pitch) {
                        case 0:
                        case Lang.template.list_pitch_r:
                            pitch = -1;
                            break;
                        case 1:
                        case Lang.template.list_pitch_c:
                            pitch = 1;
                            break;
                        case 2:
                        case Lang.template.list_pitch_d:
                            pitch = 3;
                            break;
                        case 3:
                        case Lang.template.list_pitch_e:
                            pitch = 5;
                            break;
                        case 4:
                        case Lang.template.list_pitch_f:
                            pitch = 6;
                            break;
                        case 5:
                        case Lang.template.list_pitch_g:
                            pitch = 8;
                            break;
                        case 6:
                        case Lang.template.list_pitch_a:
                            pitch = 10;
                            break;
                        case 7:
                        case Lang.template.list_pitch_b:
                            pitch = 12;
                            break;
                    }
                    if (pitch > -1) {
                        pitch = pitch + accidental;
                        switch (pitch) {
                            case 0:
                                octave = octave - 0x10;
                                pitch = 12;
                                break;
                            case 13:
                                octave = octave + 0x10;
                                pitch = 1;
                                break;
                        }
                    } else {
                        pitch = 0;
                    }
                    note.pitch = Entry.toybot.checkRangeInteger(octave | pitch, 0x00, 0x7C);
                    Entry.hw.sendQueue['setblock'] = {
                        id: Math.random(),
                        playScore: note
                    };

                    return true;
                });
            }
        },
        set_play_sound_effect: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.set_play_sound_effect,
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12
                }
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'dropdown_effect'
                    },
                    null
                ],
                type: 'set_play_sound_effect'
            },
            paramsKeyMap: {
                LIST: 0
            },
            class: 'setblock',
            isNotFor: ['toybot'],
            func: function(sprite, script) {
                return Entry.toybot.setProcessor(script, Entry.toybot.delayTime, function() {
                    const list = Entry.toybot.convert(script.getValue('LIST', script));
                    Entry.hw.sendQueue['setblock'] = {
                        id: Math.random(),
                        playList: {
                            name: Entry.toybot.checkRangeInteger(list, 1, 12),
                            play: 1
                        }
                    };

                    return false;
                });
            }
        },
        set_play_melody: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.set_play_melody,
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12
                }
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'dropdown_melody'
                    },
                    null
                ],
                type: 'set_play_melody'
            },
            paramsKeyMap: {
                LIST: 0
            },
            class: 'setblock',
            isNotFor: ['toybot'],
            func: function(sprite, script) {
                return Entry.toybot.setProcessor(script, Entry.toybot.delayTime, function() {
                    const list = Entry.toybot.convert(script.getValue('LIST', script)) + 12;
                    Entry.hw.sendQueue['setblock'] = {
                        id: Math.random(),
                        playList: {
                            name: Entry.toybot.checkRangeInteger(list, 13, 16),
                            play: 1
                        }
                    };

                    return false;
                });
            }
        },
        set_servo_each: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.set_servo_each,
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12
                }
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'dropdown_servo'
                    },
                    {
                        type: 'dropdown_speed'
                    },
                    {
                        type: 'number',
                        params: [ 90 ]
                    },
                    null
                ],
                type: 'set_servo_each'
            },
            paramsKeyMap: {
                SERVO: 0,
                SPEED: 1,
                POSITION: 2
            },
            class: 'setblock',
            isNotFor: ['toybot'],
            func: function(sprite, script) {
                return Entry.toybot.setProcessor(script, Entry.toybot.delayTime, function() {
                    const id = Entry.toybot.convert(script.getValue('SERVO', script));
                    const speed = Entry.toybot.convert(script.getValue('SPEED', script));
                    const position =  Entry.toybot.convert(script.getValue('POSITION', script)) * 10;
                    const servo = [
                        {
                            id: Entry.toybot.checkRangeInteger(id, 0, 4),
                            speed: Entry.toybot.checkRangeInteger(speed, 1, 5),
                            position: Entry.toybot.checkRangeInteger(position, 0, 1800)
                        }
                    ]
                    Entry.hw.sendQueue['setblock'] = {
                        id: Math.random(),
                        servoControl: servo
                    };

                    return false;
                });
            }
        },
        set_servo_all: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.set_servo_all,
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12
                }
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'dropdown_speed'
                    },
                    {
                        type: 'number',
                        params: [ 90 ]
                    },
                    {
                        type: 'number',
                        params: [ 90 ]
                    },
                    {
                        type: 'number',
                        params: [ 90 ]
                    },
                    {
                        type: 'number',
                        params: [ 90 ]
                    },
                    {
                        type: 'number',
                        params: [ 90 ]
                    },
                    null
                ],
                type: 'set_servo_all'
            },
            paramsKeyMap: {
                SPEED: 0,
                POSITION0: 1,
                POSITION1: 2,
                POSITION2: 3,
                POSITION3: 4,
                POSITION4: 5,
            },
            class: 'setblock',
            isNotFor: ['toybot'],
            func: function(sprite, script) {
                return Entry.toybot.setProcessor(script, Entry.toybot.delayTime, function() {
                    const nSpeed =  Entry.toybot.convert(script.getValue('SPEED', script));
                    const nPosition = [
                        Entry.toybot.convert(script.getValue('POSITION0', script)),
                        Entry.toybot.convert(script.getValue('POSITION1', script)),
                        Entry.toybot.convert(script.getValue('POSITION2', script)),
                        Entry.toybot.convert(script.getValue('POSITION3', script)),
                        Entry.toybot.convert(script.getValue('POSITION4', script)),
                    ];
                    const speed = Entry.toybot.checkRangeInteger(nSpeed, 1, 5);
                    const position = [
                        Entry.toybot.checkRangeInteger(nPosition[0] * 10, 0, 1800),
                        Entry.toybot.checkRangeInteger(nPosition[1] * 10, 0, 1800),
                        Entry.toybot.checkRangeInteger(nPosition[2] * 10, 0, 1800),
                        Entry.toybot.checkRangeInteger(nPosition[3] * 10, 0, 1800),
                        Entry.toybot.checkRangeInteger(nPosition[4] * 10, 0, 1800)
                    ];
                    const servo = [
                        {
                            id: 0,
                            speed: speed,
                            position: position[0]
                        },
                        {
                            id: 1,
                            speed: speed,
                            position: position[1]
                        },
                        {
                            id: 2,
                            speed: speed,
                            position: position[2]
                        },
                        {
                            id: 3,
                            speed: speed,
                            position: position[3]
                        },
                        {
                            id: 4,
                            speed: speed,
                            position: position[4]
                        },
                    ]
                    Entry.hw.sendQueue['setblock'] = {
                        id: Math.random(),
                        servoControl: servo
                    };

                    return false;
                });
            }
        },
        set_servo_home: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.set_servo_home,
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12
                }
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'dropdown_speed'
                    },
                    null
                ],
                type: 'set_servo_home'
            },
            paramsKeyMap: {
                SPEED: 0
            },
            class: 'setblock',
            isNotFor: ['toybot'],
            func: function(sprite, script) {
                return Entry.toybot.setProcessor(script, Entry.toybot.delayTime, function() {
                    const nSpeed =  Entry.toybot.convert(script.getValue('SPEED', script));
                    const speed = Entry.toybot.checkRangeInteger(nSpeed, 1, 5);                    
                    const servo = [
                        {
                            id: 0,
                            speed: speed,
                            position: 900
                        },
                        {
                            id: 1,
                            speed: speed,
                            position: 900
                        },
                        {
                            id: 2,
                            speed: speed,
                            position: 900
                        },
                        {
                            id: 3,
                            speed: speed,
                            position: 900
                        },
                        {
                            id: 4,
                            speed: speed,
                            position: 900
                        },
                    ]
                    Entry.hw.sendQueue['setblock'] = {
                        id: Math.random(),
                        servoControl: servo
                    };

                    return false;
                });
            }
        },
        set_analog_output: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.set_analog_output,
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12
                }
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'number',
                        params: [ 70 ]
                    },
                    null
                ],
                type: 'set_analog_output'
            },
            paramsKeyMap: {
                PWM: 0
            },
            class: 'setblock',
            isNotFor: ['toybot'],
            func: function(sprite, script) {
                return Entry.toybot.setProcessor(script, Entry.toybot.delayTime, function() {
                    const pwm = script.getValue('PWM', script);
                    Entry.hw.sendQueue['setblock'] = {
                        id: Math.random(),
                        pwmControl: Entry.toybot.checkRangeInteger(pwm * 10.23, 0, 1023)
                    };

                    return false;
                });
            }
        },
        set_dc_run: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.set_dc_run,
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12
                }
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'dropdown_dc'
                    },
                    {
                        type: 'dropdown_speed'
                    },
                    {
                        type: 'dropdown_rotation'
                    },
                    null
                ],
                type: 'set_dc_run'
            },
            paramsKeyMap: {
                DC:0,
                SPEED: 1,
                DIRECTION: 2
            },
            class: 'setblock',
            isNotFor: ['toybot'],
            func: function(sprite, script) {
                return Entry.toybot.setProcessor(script, Entry.toybot.delayTime, function() {
                    const id = Entry.toybot.convert(script.getValue('DC', script));
                    const pwm = Entry.toybot.convert(script.getValue('SPEED', script));
                    let direction = Entry.toybot.convert(script.getValue('DIRECTION', script));
                    switch (direction) {
                        case Lang.template.list_rotation_forward:
                            direction = 1;
                            break;
                        case Lang.template.list_rotation_reverse:
                            direction = -1;
                            break;
                        case Lang.template.list_rotation_stop:
                            direction = 0;
                            break;
                    }
                    const speed = Entry.toybot.checkRangeInteger((pwm * 51) * direction, -255, 255);
                    const dc = [
                        {
                            id: 0,
                            speed: speed
                        },
                        {
                            id: 1,
                            speed: speed
                        }
                    ];
                    switch (id) {
                        case 1:
                        case 2:
                            Entry.hw.sendQueue['setblock'] = {
                                id: Math.random(),
                                dcControl: [dc[id-1]]
                            };
                            break;
                        case 3:
                        case Lang.template.list_all:                            
                            Entry.hw.sendQueue['setblock'] = {
                                id: Math.random(),
                                dcControl: dc
                            };
                            break;
                    }

                    return false;
                });
            }
        },
        set_servo_offset: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.set_servo_offset,
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number'
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12
                }
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'dropdown_servo_all'
                    },
                    null
                ],
                type: 'set_servo_offset'
            },
            paramsKeyMap: {
                SERVO: 0
            },
            class: 'setblock',
            isNotFor: ['toybot'],
            func: function(sprite, script) {
                return Entry.toybot.setProcessor(script, Entry.toybot.delayTime, function() {
                    let id = Entry.toybot.convert(script.getValue('SERVO', script));
                    const datas = Entry.hw.portData['getblock'];
                    const servoOffset = [
                        {
                            id:0,
                            offset: 0
                        },
                        {
                            id:1,
                            offset: 0
                        },
                        {
                            id:2,
                            offset: 0
                        },
                        {
                            id:3,
                            offset: 0
                        },
                        {
                            id:4,
                            offset: 0
                        }
                    ];
                    for (let i = 0; i < 5; i++) {
                        const offset = datas['offset'][i];
                        const calibration = datas['servo'][i] - 900 + offset;
                        servoOffset[i].offset = Entry.toybot.checkRangeInteger(calibration, -900, 900);
                    }
                    switch (id) {
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                            Entry.hw.sendQueue['setblock'] = {
                                id: Math.random(),
                                servoOffset: [servoOffset[id]]
                            };
                            break;
                        case 5:
                            Entry.hw.sendQueue['setblock'] = {
                                id: Math.random(),
                                servoOffset: servoOffset
                            };
                            break;
                    }

                    return false;
                });
            }
        },
        set_servo_reset: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.set_servo_reset,
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12
                }
            ],
            events: {},
            def: {
                type: 'set_servo_reset'
            },
            paramsKeyMap: {},
            class: 'setblock',
            isNotFor: ['toybot'],
            func: function(sprite, script) {
                return Entry.toybot.setProcessor(script, Entry.toybot.delayTime, function() {
                    const servoOffset = [
                        {
                            id:0,
                            offset: 0
                        },
                        {
                            id:1,
                            offset: 0
                        },
                        {
                            id:2,
                            offset: 0
                        },
                        {
                            id:3,
                            offset: 0
                        },
                        {
                            id:4,
                            offset: 0
                        }
                    ];  
                    Entry.hw.sendQueue['setblock'] = {
                        id: Math.random(),
                        servoOffset: servoOffset
                    };

                    return false;
                });
            }
        },
    };
};

module.exports = Entry.toybot;