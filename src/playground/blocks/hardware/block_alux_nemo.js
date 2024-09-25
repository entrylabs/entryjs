'use strict';

Entry.nemo = {
    id: ['63.1'],
    name: 'nemo',
    url: 'https://www.aluxonline.com',
    imageName: 'alux_nemo.png',
    title: {
        ko: '네모',
        en: 'NEMO',
    },
    delayTime: 0.001,
    setZero: function() {
        Entry.hw.sendQueue['NEMO_INIT'] = {
            id: Math.random(),
            setZero: 1,
        };
        Entry.hw.update();
        this.setCount = 0;
    },
    numToMS(num) {
        let ms = 0;
        if (num < 0) {
            ms = 0;
        } else if (0 <= num && num <= 5) {
            switch(num) {
                case 0:
                    ms = 0;
                    break;
                case 1:
                    ms = 500;
                    break;
                case 2:
                    ms = 200;
                    break;
                case 3:
                    ms = 100;
                    break;
                case 4:
                    ms = 50;
                    break;
                case 5:
                    ms = 20;
                    break;
            }
        } else {
            ms = 500;
        }
        return ms;
    },
    afterReceive(portData) {
        const motion = portData['NEMO_EVENT_MOTION'];
        const button = portData['NEMO_EVENT_BUTTON'];        
        const temp = Entry.hw.portData['NEMO_DEVICE'].anSwitch;
        if (button === true) {
            Entry.engine.fireEvent('aluxNemoButtonEventReceived');
        }
        if (motion === true) {
            Entry.engine.fireEvent('aluxNemoMotionEventReceived');
        }
    },
    setProcessor(script, delayTime, code) {
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
            delete script.timeFlag;
            delete script.isStart;
            Entry.engine.isContinue = false;
            return script.callReturn();
        }
    },
};

Entry.nemo.setLanguage = function() {
    return {
        ko: {
            template: {
                title_namo_input: '네모 입력',
                title_namo_output: '네모 출력',
                title_namo_extension: '네모 확장',
                line_emtpy: ' ',

                list_s1: 'S1',
                list_s2: 'S2',
                list_s3: 'S3',
                list_s4: 'S4',
                list_motion_1: '앞으로 기울임',
                list_motion_2: '뒤로 기울임',
                list_motion_3: '왼쪽으로 기울임',
                list_motion_4: '오른쪽으로 기울임',
                list_motion_5: '위로 놓음',
                list_motion_6: '아래로 놓음',
                list_motion_7: '세워 놓음',
                list_motion_8: '충격 받음',
                list_smile: '웃음',
                list_not_much: '별로',
                list_good: '좋음',
                list_bad: '나쁨',
                list_wink: '윙크',
                list_cry: '울음',
                list_absurd: '어이없음',
                list_peck: '뽀뽀',
                list_arrow_1: '화살표 1',
                list_arrow_2: '화살표 2',
                list_arrow_3: '화살표 3',
                list_arrow_4: '화살표 4',
                list_arrow_5: '화살표 5',
                list_arrow_6: '화살표 6',
                list_arrow_7: '화살표 7',
                list_arrow_8: '화살표 8',
                list_spade: '스페이드',
                list_club: '클럽',
                list_diamond: '다이아몬드',
                list_heart: '하트',
                list_circle: '원',
                list_x: '엑스',
                list_triangle: '세모',
                list_square: '네모',
                list_note_1: '음표 1',
                list_note_2: '음표 2',
                list_note_3: '음표 3',
                list_dice_1: '주사위 1',
                list_dice_2: '주사위 2',
                list_dice_3: '주사위 3',
                list_dice_4: '주사위 4',
                list_dice_5: '주사위 5',
                list_dice_6: '주사위 6',
                list_is_pressing: '눌려 있을 때',
                list_pressed: '눌렀을 때',
                list_released: '뗐을 때',
                list_has_prssing: '눌려 있는가',
                list_has_pressed: '눌렀는가',
                list_has_released: '뗐는가',
                list_axis_x: 'X축',
                list_axis_y: 'Y축',
                list_axis_z: 'Z축',
                list_linear_acceleration: '선형 가속도',
                list_off1: '끄기',
                list_on1: '켜기',
                list_off2: '□',
                list_on2: '■',
                list_toggle: '토글',
                list_do_re_mi_song: '도레미송',
                list_an_island_baby: '섬집아기',
                list_twinkle_twinkle_little_star: '작은별',
                list_spring_in_my_hometown: '고향의 봄',
                list_for_elise: '엘리제를 위하여',
                list_celebrated_chop_waltz: '젓가락 행진곡',
                list_happy_birthday_to_you: '생일 축하곡',
                list_lc: 'C(0)',
                list_lcs: 'C#(1)',
                list_ld: 'D(2)',
                list_lds: 'D#(3)',
                list_le: 'E(4)',
                list_lf: 'F(5)',
                list_lfs: 'F#(6)',
                list_lg: 'G(7)',
                list_lgs: 'G#(8)',
                list_la: 'A(9)',
                list_las: 'A#(10)',
                list_lb: 'B(11)',
                list_mc: 'C(12)',
                list_mcs: 'C#(13)',
                list_md: 'D(14)',
                list_mds: 'D#(15)',
                list_me: 'E(16)',
                list_mf: 'F(17)',
                list_mfs: 'F#(18)',
                list_mg: 'G(19)',
                list_mgs: 'G#(20)',
                list_ma: 'A(21)',
                list_mas: 'A#(22)',
                list_mb: 'B(23)',
                list_hc: 'C(24)',
                list_switch: '스위치',
                list_infrared_ray: '적외선',
                list_magnet: '자석',
                list_rotation: '회전',
                list_brightness: '밝기',
                list_sound: '소리',
                list_tilt: '기울기',
                list_pressure: '압력',
                list_heart_rate: '심박',
                list_value: '값',
                list_angle: '각도',
                list_absolute_angle: '절대 각도',
                list_rotation_value: '회전 수',
                list_east: '동쪽',
                list_west: '서쪽',
                list_south: '남쪽',
                list_north: '북쪽',

                input_event_button_state: '%1 %2 버튼 %3',
                input_event_motion_sensing: '%1 %2 이 감지되었을 때',
                input_bool_button_state: '%1 버튼 %2 ?',
                input_bool_motion_sensing: '%1 이 감지되었는가?',
                input_bool_led_state_value: 'LED X: %1 Y: %2 상태값',
                input_field_button_analog_value: '%1 버튼의 아날로그 값',
                input_field_acceleration_value: '가속도 센서 %1 의 값',
                input_field_brightness_value: '밝기 센서의 값',
                input_field_convert_value: '%1 의 값 %2 ~ %3 을 %4 ~ %5 으(로) 변환',

                output_basic_display_led_icon: 'LED 아이콘 %1 을 %2 속도로 출력 %3',
                output_basic_diplay_led_custom_icon: 'LED %1 줄의 %2%3%4%5%6%7%8 을 %9 속도로 출력 %10',
                output_basic_display_led_string: 'LED %1 문자열을 %2 속도로 출력 %3',
                output_basic_delete_all_led: 'LED 출력 지우기 %1',
                output_basic_coordinate_value: 'LED X: %1 Y: %2 %3 %4',
                output_basic_play_melody: '멜로디 %1 재생하기 %2',
                output_basic_play_melody_to_the_end: '멜로디 %1 끝까지 재생하기 %2',
                output_basic_play_note: '%1 음을 재생하기 %2',
                output_basic_play_note_for_seconds: '%1 음을 %2 초동안 재생하기 %3',
                output_basic_stop_all_sound: '모든 소리 정지 %1',

                extension_basic_set_expension: '확장센서를 %1 (으)로 설정 %2',
                extension_basic_set_expension_value: '확장센서를 %1 값으로 정하기',
                extension_bool_expension_state: '확장센서 %1 ? %2',
                extension_field_expension_anlog_value: '확장센서의 아날로그 값 %1',
                extension_field_expension_custom_value: '확장센서의 %1',
                extension_basic_set_compass_value: '나침반센서를 %1 값으로 정하기',
                extension_field_compass_analog_value: '나침반센서의 아날로그 값 %1',
                extension_field_compass_custom_value: '나침반센서의 %1',
                extension_bool_compass_state: '나침반센서의 방향이 %1 인가 ?',
            },
        },
        en: {
            template: {
                title_namo_input: 'NAMO INPUT',
                title_namo_output: 'NAMO OUTPUT',
                title_namo_extension: 'NAMO EXTENSION',
                line_emtpy: ' ',

                list_s1: 'S1',
                list_s2: 'S2',
                list_s3: 'S3',
                list_s4: 'S4',                
                list_motion_1: 'Tilting forward',
                list_motion_2: 'Tilting back',
                list_motion_3: 'Tilting to the left',
                list_motion_4: 'Tilting to the right',
                list_motion_5: 'Put it up',
                list_motion_6: 'Put it down',
                list_motion_7: 'Standing up',
                list_motion_8: 'Impacted',
                list_smile: 'Smile',
                list_not_much: 'Not much',
                list_good: 'Good',
                list_bad: 'Bad',
                list_wink: 'Wink',
                list_cry: 'Cry',
                list_absurd: 'Absurd',
                list_peck: 'Peck',
                list_arrow_1: 'Arrow 1',
                list_arrow_2: 'Arrow 2',
                list_arrow_3: 'Arrow 3',
                list_arrow_4: 'Arrow 4',
                list_arrow_5: 'Arrow 5',
                list_arrow_6: 'Arrow 6',
                list_arrow_7: 'Arrow 7',
                list_arrow_8: 'Arrow 8',
                list_spade: 'Spade',
                list_club: 'Club',
                list_diamond: 'Diamond',
                list_heart: 'heart',
                list_circle: 'Circle',
                list_x: 'X',
                list_triangle: 'Triangle',
                list_square: 'Square',
                list_note_1: 'note 1',
                list_note_2: 'note 2',
                list_note_3: 'note 3',
                list_dice_1: 'dice 1',
                list_dice_2: 'dice 2',
                list_dice_3: 'dice 3',
                list_dice_4: 'dice 4',
                list_dice_5: 'dice 5',
                list_dice_6: 'dice 6',
                list_is_pressing: 'Is pressing',
                list_pressed: 'Pressed',
                list_released: 'released',
                list_has_prssing: 'has be pressing',
                list_has_pressed: 'has pressed',
                list_has_released: 'has released',
                list_axis_x: 'X axis',
                list_axis_y: 'Y axis',
                list_axis_z: 'Z axis',
                list_linear_acceleration: 'Linear acceleration',
                list_off1: 'Off',
                list_on1: 'On',
                list_off2: '□',
                list_on2: '■',
                list_toggle: 'Toggle',
                list_do_re_mi_song: 'Do Re Mi Song',
                list_an_island_baby: 'An Island Baby',
                list_twinkle_twinkle_little_star: 'Twinkle Twinkle Little Star',
                list_spring_in_my_hometown: 'Spring in My Hometwon',
                list_for_elise: 'For Elise',
                list_celebrated_chop_waltz: 'Celebrate Chop Waltz',
                list_happy_birthday_to_you: 'Happy Birthday To You',
                list_lc: 'C(0)',
                list_lcs: 'C#(1)',
                list_ld: 'D(2)',
                list_lds: 'D#(3)',
                list_le: 'E(4)',
                list_lf: 'F(5)',
                list_lfs: 'F#(6)',
                list_lg: 'G(7)',
                list_lgs: 'G#(8)',
                list_la: 'A(9)',
                list_las: 'A#(10)',
                list_lb: 'B(11)',
                list_mc: 'C(12)',
                list_mcs: 'C#(13)',
                list_md: 'D(14)',
                list_mds: 'D#(15)',
                list_me: 'E(16)',
                list_mf: 'F(17)',
                list_mfs: 'F#(18)',
                list_mg: 'G(19)',
                list_mgs: 'G#(20)',
                list_ma: 'A(21)',
                list_mas: 'A#(22)',
                list_mb: 'B(23)',
                list_hc: 'C(24)',
                list_switch: 'Switch',
                list_infrared_ray: 'Infrared ray',
                list_magnet: 'Magnet',
                list_rotation: 'Rotation',
                list_brightness: 'Brightness',
                list_sound: 'Sound',
                list_tilt: 'Tilt',
                list_pressure: 'Pressure',
                list_heart_rate: 'Heart rate',
                list_value: 'Value',
                list_angle: 'Angle',
                list_absolute_angle: 'Absolute angle',
                list_rotation_value: 'Rotation value',
                list_east: 'East',
                list_west: 'West',
                list_south: 'South',
                list_north: 'North',

                input_event_button_state: 'When %1 button %2',
                input_event_button_motion_sensing: 'When %1 motion is detected',
                input_bool_button_state: 'Is %1 button %2 ?',
                input_bool_motion_sensing: 'Is %1 motion detected',
                input_bool_led_state_value: ' LED X: %1 Y: %2 status',
                input_field_button_analog_value: 'Analog value of %1 button',
                input_field_acceleration_value: 'Acceleration sensor %1 value',
                input_field_brightness_value: 'Value of illuminance sensor',
                input_field_convert_value: 'change the value of %1 from %2 ~ %3 to %4 ~ %5',

                output_basic_display_led_icon: 'LED icon %1 output %2 speed %3',
                output_basic_diplay_led_custom_icon: 'LED %1 line %2%3%4%5%6%7%8 at %9 speed %10',
                output_basic_display_led_string: 'LED %1 string output %2 speed %3',
                output_basic_delete_all_led: 'Clear LED output %1',
                output_basic_coordinate_value: 'LED X: %1 Y: %2 %3 %4',
                output_basic_play_melody: 'Play melody %1 %2',
                output_basic_play_melody_to_the_end: 'melody %1 play to the end %2',
                output_basic_play_note: 'Playing note %1 %2',
                output_basic_play_note_for_seconds: 'Play note %1 for %2 second(s) %3',
                output_basic_stop_all_sound: 'Stop all sound %1',

                extension_basic_set_expension: 'Expansion type set %1 %2',
                extension_basic_set_expension_value: 'Expansion sensor set %1 value ? %2',
                extension_bool_expension_state: 'Is extended sensor %1',
                extension_field_expension_anlog_value: 'Value of extended sensor %1',
                extension_field_expension_custom_value: 'Exansion sensor value of %1',
                extension_basic_set_compass_value: 'Compass sensor value Set %1',
                extension_field_compass_analog_value: 'Value of compass sensor %1',
                extension_field_compass_custom_value: 'compass sensor value of %1',
                extension_bool_compass_state: 'Does the rotation sensor point %1 ?',
            },
        },
    };
};

Entry.nemo.blockMenuBlocks = [
    'nemo_dropdown_button',
    'nemo_dropdown_button_now_state',
    'nemo_dropdown_button_state_question',
    'nemo_dropdown_motion',
    'nemo_dropdown_coordinate_acceleration',
    'nemo_dropdown_led_icon',
    'nemo_dropdown_switch',
    'nemo_dropdown_melody',
    'nemo_dropdown_keyboard',
    'nemo_dropdown_expension_sensor_mode',
    'nemo_dropdown_compass_sensor_mode',
    'nemo_dropdown_direction',
    'nemo_dropdown_index_0_5',
    'nemo_dropdown_index_1_5',
    'nemo_dropdown_index_1_7',
    'nemo_dropdown_toggle',
    'nemo_dropdown_toggle2',
    
    'nemo_title_namo_input',
    'nemo_block_input_event_button_state',
    'nemo_block_input_event_motion_sensing',
    'nemo_block_input_bool_button_state',
    'nemo_block_input_bool_motion_sensing',
    'nemo_block_input_bool_led_state_value',
    'nemo_block_input_field_button_analog_value',
    'nemo_block_input_field_acceleration_value',
    'nemo_block_input_field_brightness_value',
    'nemo_block_input_field_convert_value',

    'nemo_title_namo_output',
    'nemo_block_output_basic_display_led_icon',
    'nemo_block_output_basic_diplay_led_custom_icon',
    'nemo_block_output_basic_display_led_string',
    'nemo_block_output_basic_delete_all_led',
    'nemo_block_output_basic_coordinate_value',
    'nemo_block_output_basic_play_melody',
    'nemo_block_output_basic_play_melody_to_the_end',
    'nemo_block_output_basic_play_note',
    'nemo_block_output_basic_play_note_for_seconds',
    'nemo_block_output_basic_stop_all_sound',

    'nemo_title_namo_extension',
    'nemo_block_extension_basic_set_expension',
    'nemo_block_extension_basic_set_expension_value',
    'nemo_block_extension_bool_expension_state',
    'nemo_block_extension_field_expension_anlog_value',
    'nemo_block_extension_field_expension_custom_value',
    'nemo_block_extension_basic_set_compass_value',
    'nemo_block_extension_field_compass_analog_value',
    'nemo_block_extension_field_compass_custom_value',
    'nemo_block_extension_bool_compass_state',
];

Entry.nemo.getBlocks = function() {
    return {
        ///========================================================================================
        /// Dropdown block
        ///========================================================================================
        nemo_dropdown_button: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.list_s1, 0],
                        [Lang.template.list_s2, 1],
                        [Lang.template.list_s3, 2],
                        [Lang.template.list_s4, 3],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            def: {
                params: [null],
            },
            paramsKeyMap: {
                INDEX: 0,
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('INDEX');
            }
        },
        nemo_dropdown_button_now_state: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.list_is_pressing, 0],
                        [Lang.template.list_pressed, 1],
                        [Lang.template.list_released, 2],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                }
            ],
            def: {
                params: [null],
            },
            paramsKeyMap: {
                INDEX: 0,
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('INDEX');
            }
        },        
        nemo_dropdown_button_state_question: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.list_has_prssing, 0],
                        [Lang.template.list_has_pressed, 1],
                        [Lang.template.list_has_released, 2],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                }
            ],
            def: {
                params: [null],
            },
            paramsKeyMap: {
                INDEX: 0,
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('INDEX');
            }
        },
        nemo_dropdown_motion: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.list_motion_1, 0],
                        [Lang.template.list_motion_2, 1],
                        [Lang.template.list_motion_3, 2],
                        [Lang.template.list_motion_4, 3],
                        [Lang.template.list_motion_5, 4],
                        [Lang.template.list_motion_6, 5],
                        [Lang.template.list_motion_7, 6],
                        [Lang.template.list_motion_8, 7],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                }
            ],
            def: {
                params: [null],
            },
            paramsKeyMap: {
                INDEX: 0,
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('INDEX');
            }
        },
        nemo_dropdown_coordinate_acceleration: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.list_axis_x, 0],
                        [Lang.template.list_axis_y, 1],
                        [Lang.template.list_axis_z, 2],
                        [Lang.template.list_linear_acceleration, 3],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                }
            ],
            def: {
                params: [null],
            },
            paramsKeyMap: {
                INDEX: 0,
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('INDEX');
            }
        },
        nemo_dropdown_led_icon: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'DropdownExtra',
                    options: [
                        [Lang.template.list_smile, 1],
                        [Lang.template.list_not_much, 2],
                        [Lang.template.list_good, 3],
                        [Lang.template.list_bad, 4],
                        [Lang.template.list_wink, 5],
                        [Lang.template.list_cry, 6],
                        [Lang.template.list_absurd, 7],
                        [Lang.template.list_peck, 8],
                        [Lang.template.list_arrow_1, 9],
                        [Lang.template.list_arrow_2, 10],
                        [Lang.template.list_arrow_3, 11],
                        [Lang.template.list_arrow_4, 12],
                        [Lang.template.list_arrow_5, 13],
                        [Lang.template.list_arrow_6, 14],
                        [Lang.template.list_arrow_7, 15],
                        [Lang.template.list_arrow_8, 16],                        
                        [Lang.template.list_spade, 17],
                        [Lang.template.list_club, 18],
                        [Lang.template.list_diamond, 19],
                        [Lang.template.list_heart, 20],
                        [Lang.template.list_circle, 21],
                        [Lang.template.list_x, 22],
                        [Lang.template.list_triangle, 23],
                        [Lang.template.list_square, 24],
                        [Lang.template.list_note_1, 25],
                        [Lang.template.list_note_2, 26],
                        [Lang.template.list_note_3, 27],
                        [Lang.template.list_dice_1, 28],
                        [Lang.template.list_dice_2, 29],
                        [Lang.template.list_dice_3, 30],
                        [Lang.template.list_dice_4, 31],
                        [Lang.template.list_dice_5, 32],
                        [Lang.template.list_dice_6, 33],
                    ],
                    value: 1,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                }
            ],
            def: {
                params: [null],
            },
            paramsKeyMap: {
                INDEX: 0,
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('INDEX');
            }
        },
        nemo_dropdown_switch: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.list_off1, 1],
                        [Lang.template.list_on1, 2],
                        [Lang.template.list_toggle, 3],
                    ],
                    value: 1,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                }
            ],
            def: {
                params: [null],
            },
            paramsKeyMap: {
                INDEX: 0,
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('INDEX');
            }
        },
        nemo_dropdown_melody: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.list_do_re_mi_song, 1],
                        [Lang.template.list_an_island_baby, 2],
                        [Lang.template.list_twinkle_twinkle_little_star, 3],
                        [Lang.template.list_spring_in_my_hometown, 4],
                        [Lang.template.list_for_elise, 5],
                        [Lang.template.list_celebrated_chop_waltz, 6],
                        [Lang.template.list_happy_birthday_to_you, 7],
                    ],
                    value: 1,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                }
            ],
            def: {
                params: [null],
            },
            paramsKeyMap: {
                INDEX: 0,
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('INDEX');
            }
        },
        nemo_dropdown_keyboard: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'DropdownExtra',
                    options: [
                        [Lang.template.list_lc, 0],
                        [Lang.template.list_lcs, 1],
                        [Lang.template.list_ld, 2],
                        [Lang.template.list_lds, 3],
                        [Lang.template.list_le, 4],
                        [Lang.template.list_lf, 5],
                        [Lang.template.list_lfs, 6],
                        [Lang.template.list_lg, 7],
                        [Lang.template.list_lgs, 8],
                        [Lang.template.list_la, 9],
                        [Lang.template.list_las, 10],
                        [Lang.template.list_lb, 11],
                        [Lang.template.list_mc, 12],
                        [Lang.template.list_mcs, 13],
                        [Lang.template.list_md, 14],
                        [Lang.template.list_mds, 15],
                        [Lang.template.list_me, 16],
                        [Lang.template.list_mf, 17],
                        [Lang.template.list_mfs, 18],
                        [Lang.template.list_mg, 19],
                        [Lang.template.list_mgs, 20],
                        [Lang.template.list_ma, 21],
                        [Lang.template.list_mas, 22],
                        [Lang.template.list_mb, 23],
                        [Lang.template.list_hc, 24]
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                }
            ],
            def: {
                params: [null],
            },
            paramsKeyMap: {
                INDEX: 0,
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('INDEX');
            }
        },
        nemo_dropdown_expension_sensor_mode: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.list_switch, 0],
                        [Lang.template.list_infrared_ray, 1],
                        [Lang.template.list_magnet, 2],
                        [Lang.template.list_rotation, 3],
                        [Lang.template.list_brightness, 4],
                        [Lang.template.list_sound, 5],
                        [Lang.template.list_tilt, 6],
                        [Lang.template.list_pressure, 7],
                        [Lang.template.list_heart_rate, 8]
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                }
            ],
            def: {
                params: [null],
            },
            paramsKeyMap: {
                INDEX: 0,
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('INDEX');
            }
        },
        nemo_dropdown_compass_sensor_mode: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.list_value, 0],
                        [Lang.template.list_angle, 1],
                        [Lang.template.list_absolute_angle, 2],
                        [Lang.template.list_rotation_value, 3],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                }
            ],
            def: {
                params: [null],
            },
            paramsKeyMap: {
                INDEX: 0,
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('INDEX');
            }
        },
        nemo_dropdown_direction: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.list_east, 0],
                        [Lang.template.list_west, 1],
                        [Lang.template.list_south, 2],
                        [Lang.template.list_north, 3],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                }
            ],
            def: {
                params: [null],
            },
            paramsKeyMap: {
                INDEX: 0,
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('INDEX');
            }
        },
        nemo_dropdown_index_0_5: {
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
                        ['5', 5],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                }
            ],
            def: {
                params: [null],
            },
            paramsKeyMap: {
                INDEX: 0,
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('INDEX');
            }
        },
        nemo_dropdown_index_1_5: {
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
                        ['5', 5],
                    ],
                    value: 1,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                }
            ],
            def: {
                params: [null],
            },
            paramsKeyMap: {
                INDEX: 0,
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('INDEX');
            }
        },        
        nemo_dropdown_index_1_7: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        ['1', 0],
                        ['2', 1],
                        ['3', 2],
                        ['4', 3],
                        ['5', 4],
                        ['6', 5],
                        ['7', 6],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                }
            ],
            def: {
                params: [null],
            },
            paramsKeyMap: {
                INDEX: 0,
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('INDEX');
            }
        },
        nemo_dropdown_toggle: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.list_off1, 0],
                        [Lang.template.list_on1, 1],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                }
            ],
            def: {
                params: [null],
            },
            paramsKeyMap: {
                INDEX: 0,
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('INDEX');
            }
        },
        nemo_dropdown_toggle2: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [
                        [Lang.template.list_off2, 0],
                        [Lang.template.list_on2, 1],
                    ],
                    value: 0,
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                }
            ],
            def: {
                params: [null],
            },
            paramsKeyMap: {
                INDEX: 0,
            },
            events: {},
            func: function(sprite, script) {
                return script.getField('INDEX');
            }
        },
        ///========================================================================================
        /// Input block
        ///========================================================================================
        nemo_title_namo_input: {
            skeleton: 'basic_text',
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#333333',
            template: Lang.template.title_namo_input,
            skeletonOptions: {
                box: {
                    offsetX: 20,
                },
            },
            def: {
                type: 'nemo_title_namo_input',
              },
            isNotFor: ['nemo'],
            class : 'inputBlock',
        },
        nemo_block_input_event_button_state: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_event',
            statements: [],
            template: Lang.template.input_event_button_state,
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/start_icon_hardware.svg',
                    size: 14,
                    position: {
                        x: 0,
                        y: -2,
                    },
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
            ],
            events: {},
            def: {
                params: [
                    null,
                    {
                        type: 'nemo_dropdown_button',
                    },
                    {
                        type: 'nemo_dropdown_button_now_state',
                    },
                ],
                type: 'nemo_block_input_event_button_state',
            },
            paramsKeyMap: {
                DUMMY: 0,
                INDEX: 1,
                STATE: 2,
            },
            event: 'aluxNemoButtonEventReceived',
            class: 'inputBlock',
            isNotFor: ['nemo'],
            func: function(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const state = script.getNumberValue('STATE');
                const getState = Entry.hw.portData['NEMO_DEVICE_EX'].button[index].state[state];
                return getState === true ? script.callReturn() : this.die();
            }
        },
        nemo_block_input_event_motion_sensing: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_event',
            statements: [],
            template: Lang.template.input_event_motion_sensing,
            params: [
                {
                    type: 'Indicator',
                    img: 'block_icon/start_icon_hardware.svg',
                    size: 14,
                    position: {
                        x: 0,
                        y: -2,
                    },
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                }
            ],
            events: {},
            def: {
                params: [
                    null,
                    {
                        type: 'nemo_dropdown_motion',
                    },
                ],
                type: 'nemo_block_input_event_motion_sensing',
            },
            paramsKeyMap: {
                DUMMY: 0,
                INDEX: 1,
            },
            event: 'aluxNemoMotionEventReceived',
            class: 'inputBlock',
            isNotFor: ['nemo'],
            func: function(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const motion = Entry.hw.portData['NEMO_DEVICE'].accelD;
                if (motion[index] === true) {
                    return script.callReturn();
                } else {
                    return this.die();
                }
            }
        },
        nemo_block_input_bool_button_state: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            template: Lang.template.input_bool_button_state,
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
                        type: 'nemo_dropdown_button',
                    },
                    {
                        type: 'nemo_dropdown_button_state_question',
                    },
                ],
                type: 'nemo_block_input_bool_button_state',
            },
            paramsKeyMap: {
                INDEX: 0,
                STATE: 1,
            },
            class: 'inputBlock',
            isNotFor: ['nemo'],
            func: function(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const state = script.getNumberValue('STATE');
                const getState = Entry.hw.portData['NEMO_DEVICE_EX'].button[index].state[state];
                return getState;
            }
        },
        nemo_block_input_bool_motion_sensing: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            template: Lang.template.input_bool_motion_sensing,
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
                        type: 'nemo_dropdown_motion',
                    },
                ],
                type: 'nemo_block_input_bool_motion_sensing',
            },
            paramsKeyMap: {
                INDEX: 0,
            },
            class: 'inputBlock',
            isNotFor: ['nemo'],
            func: function(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const motion = Entry.hw.portData['NEMO_DEVICE'].accelD;
                return motion[index];
            }
        },
        nemo_block_input_bool_led_state_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            template: Lang.template.input_bool_led_state_value,
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
                        type: 'number',
                        params: [ 0 ],
                    },
                    {
                        type: 'number',
                        params: [ 0 ],
                    },
                ],
                type: 'nemo_block_input_bool_led_state_value',
            },
            paramsKeyMap: {
                X: 0,
                Y: 1,
            },
            class: 'inputBlock',
            isNotFor: ['nemo'],
            func: function(sprite, script) {
                const x = script.getNumberValue('X');
                const y = script.getNumberValue('Y');
                const index = x * 7 + y + 1;

                Entry.hw.sendQueue['NEMO_OUTPUT'] = {
                    id: Math.random(),
                    index: 10,
                    readLED: {                        
                        index: index
                    },
                };
                Entry.hw.update();

                const led = Entry.hw.portData['NEMO_DEVICE'].ledRead;
                return led.state;
            }
        },
        nemo_block_input_field_button_analog_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: Lang.template.input_field_button_analog_value,
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
                        type: 'nemo_dropdown_button',
                    },
                ],
                type: 'nemo_block_input_field_button_analog_value',
            },
            paramsKeyMap: {
                INDEX: 0,
            },
            class: 'inputBlock',
            isNotFor: ['nemo'],
            func: function(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const button = Entry.hw.portData['NEMO_DEVICE'].anSwitch;
                return button[index];
            }
        },
        nemo_block_input_field_acceleration_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: Lang.template.input_field_acceleration_value,
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
                        type: 'nemo_dropdown_coordinate_acceleration',
                    },
                ],
                type: 'nemo_block_input_field_acceleration_value',
            },
            paramsKeyMap: {
                INDEX: 0,
            },
            class: 'inputBlock',
            isNotFor: ['nemo'],
            func: function(sprite, script) {
                const index = script.getNumberValue('INDEX');
                const accel = Entry.hw.portData['NEMO_DEVICE'].accelA;
                return accel[index];
            }
        },
        nemo_block_input_field_brightness_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: Lang.template.input_field_brightness_value,
            params: [
            ],
            events: {},
            def: {
                params: [null],
                type: 'nemo_block_input_field_brightness_value',
            },
            paramsKeyMap: {},
            class: 'inputBlock',
            isNotFor: ['nemo'],
            func: function(sprite, script) {
                const illuminance = Entry.hw.portData['NEMO_DEVICE'].illumi;
                return illuminance;
            }
        },
        nemo_block_input_field_convert_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: Lang.template.input_field_convert_value,
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
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'number',
                        params: [ 0 ],
                    },
                    {
                        type: 'number',
                        params: [ 0 ],
                    },
                    {
                        type: 'number',
                        params: [ 0 ],
                    },
                    {
                        type: 'number',
                        params: [ 0 ],
                    },
                    {
                        type: 'number',
                        params: [ 0 ],
                    },
                ],
                type: 'nemo_block_input_field_convert_value',
            },
            paramsKeyMap: {
                VALUE: 0,
                IN_MIN: 1,
                IN_MAX: 2,
                OUT_MIN: 3,
                OUT_MAX: 4,
            },
            class: 'inputBlock',
            isNotFor: ['nemo'],
            func: function(sprite, script) {
                const value = script.getNumberValue('VALUE');
                const inMin = script.getNumberValue('IN_MIN');
                const inMax = script.getNumberValue('IN_MAX');
                const outMin = script.getNumberValue('OUT_MIN');
                const outMax = script.getNumberValue('OUT_MAX');
                let result = Math.round(((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin);
                if (result < outMin) {
                    result = outMin;
                } else if (result > outMax) {
                    result = outMax;
                }
                return result;
            }
        },
        ///========================================================================================
        /// Output block
        ///========================================================================================
        nemo_title_namo_output: {
            skeleton: 'basic_text',
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#333333',
            template: Lang.template.title_namo_output,
            skeletonOptions: {
                box: {
                    offsetX: 20,
                },
            },
            def: {
                type: 'nemo_title_namo_output',
              },
            isNotFor: ['nemo'],
            class : 'outputBlock',
        },
        nemo_block_output_basic_display_led_icon: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.output_basic_display_led_icon,
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
                        type: 'nemo_dropdown_led_icon',
                    },
                    {
                        type: 'nemo_dropdown_index_0_5',
                    },
                    null,
                ],
                type: 'nemo_block_output_basic_display_led_icon',
            },
            paramsKeyMap: {
                INDEX: 0,
                SPEED: 1,
            },
            class: 'outputBlock',
            isNotFor: ['nemo'],
            func: function(sprite, script) {
                return Entry.nemo.setProcessor(script, Entry.nemo.delayTime, function() {
                    const index = script.getNumberValue('INDEX');
                    const speed = script.getNumberValue('SPEED');
                    const time = Entry.nemo.numToMS(speed);
                    Entry.hw.sendQueue['NEMO_OUTPUT'] = {
                        id: Math.random(),
                        index: 0,
                        iconLED: {
                            index: index,
                            time: time,
                        },
                    };
                    return false;
                });
            }
        },
        nemo_block_output_basic_diplay_led_custom_icon: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.output_basic_diplay_led_custom_icon,
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
                        type: 'nemo_dropdown_index_1_7',
                    },
                    {
                        type: 'number',
                        params: [ 0 ],
                    },
                    {
                        type: 'number',
                        params: [ 0 ],
                    },
                    {
                        type: 'number',
                        params: [ 0 ],
                    },
                    {
                        type: 'number',
                        params: [ 0 ],
                    },
                    {
                        type: 'number',
                        params: [ 0 ],
                    },
                    {
                        type: 'number',
                        params: [ 0 ],
                    },
                    {
                        type: 'number',
                        params: [ 0 ],
                    },
                    {
                        type: 'nemo_dropdown_index_0_5',
                    },
                    null,
                ],
                type: 'nemo_block_output_basic_diplay_led_custom_icon',
            },
            paramsKeyMap: {
                INDEX: 0,
                VALUE1: 1,
                VALUE2: 2,
                VALUE3: 3,
                VALUE4: 4,
                VALUE5: 5,
                VALUE6: 6,
                VALUE7: 7,
                SPEED: 8,
            },
            class: 'outputBlock',
            isNotFor: ['nemo'],
            func: function(sprite, script) {
                return Entry.nemo.setProcessor(script, Entry.nemo.delayTime, function() {
                    const index = script.getNumberValue('INDEX');
                    const value1 = script.getNumberValue('VALUE1');
                    const value2 = script.getNumberValue('VALUE2');
                    const value3 = script.getNumberValue('VALUE3');
                    const value4 = script.getNumberValue('VALUE4');
                    const value5 = script.getNumberValue('VALUE5');
                    const value6 = script.getNumberValue('VALUE6');
                    const value7 = script.getNumberValue('VALUE7');
                    const speed = script.getNumberValue('SPEED');
                    const time = Entry.nemo.numToMS(speed);
                    Entry.hw.sendQueue['NEMO_OUTPUT'] = {
                        id: Math.random(),
                        index: 1,
                        customLED: {
                            icon: index,
                            value: [value1, value2, value3, value4, value5, value6, value7],
                            time: time,
                        },
                    };
                    return false;
                });
            }
        },
        nemo_block_output_basic_display_led_string: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.output_basic_display_led_string,
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
                        type: 'text',
                        params: [ 'Hello' ],
                    },
                    {
                        type: 'nemo_dropdown_index_1_5',
                    },
                    null,
                ],
                type: 'nemo_block_output_basic_display_led_string',
            },
            paramsKeyMap: {
                TEXT: 0,
                SPEED: 1,
            },
            class: 'outputBlock',
            isNotFor: ['nemo'],
            func: function(sprite, script) {
                return Entry.nemo.setProcessor(script, Entry.nemo.delayTime, function() {
                    const text = script.getValue('TEXT');
                    const speed = script.getNumberValue('SPEED');
                    const time = Entry.nemo.numToMS(speed);    
                    Entry.hw.sendQueue['NEMO_OUTPUT'] = {
                        id: Math.random(),
                        index: 2,
                        textLED: {
                            text: text,
                            time: time,
                        },
                    };
                    return false;
                });
            }
        },
        nemo_block_output_basic_delete_all_led: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.output_basic_delete_all_led,
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
                type: 'nemo_block_output_basic_delete_all_led',
            },
            paramsKeyMap: {},
            class: 'outputBlock',
            isNotFor: ['nemo'],
            func: function(sprite, script) {
                Entry.hw.sendQueue['NEMO_OUTPUT'] = {
                    id: Math.random(),
                    index: 3,
                    deleteLED: {
                        value: true,
                    },
                };
                
                return script.callReturn();
            }
        },
        nemo_block_output_basic_coordinate_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.output_basic_coordinate_value,
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
                        params: [ 0 ],
                    },
                    {
                        type: 'number',
                        params: [ 0 ],
                    },
                    {
                        type: 'nemo_dropdown_switch',
                    },
                    null,
                ],
                type: 'nemo_block_output_basic_coordinate_value',
            },
            paramsKeyMap: {
                X: 0,
                Y: 1,
                STATE: 2,
            },
            class: 'outputBlock',
            isNotFor: ['nemo'],
            func: function(sprite, script) {
                return Entry.nemo.setProcessor(script, Entry.nemo.delayTime, function() {
                    const x = script.getNumberValue('X');
                    const y = script.getNumberValue('Y');
                    const index = x * 7 + y + 1;
                    const state = script.getNumberValue('STATE');    
                    Entry.hw.sendQueue['NEMO_OUTPUT'] = {
                        id: Math.random(),
                        index: 4,
                        coordinateLED: {
                            index: index,
                            state: state,
                        },
                    };
                    return false;
                });
            }
        },
        nemo_block_output_basic_play_melody: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.output_basic_play_melody,
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
                        type: 'nemo_dropdown_melody',
                    },
                    null,
                ],
                type: 'nemo_block_output_basic_play_melody',
            },
            paramsKeyMap: {
                TITLE: 0,
            },
            class: 'outputBlock',
            isNotFor: ['nemo'],
            func: function(sprite, script) {
                const title = script.getNumberValue('TITLE');
                
                Entry.hw.sendQueue['NEMO_OUTPUT'] = {
                    id: Math.random(),
                    index: 5,
                    playMelody: {
                        title: title,
                    },
                };
                
                return script.callReturn();
            }
        },
        nemo_block_output_basic_play_melody_to_the_end: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.output_basic_play_melody_to_the_end,
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
                        type: 'nemo_dropdown_melody',
                    },
                    null,
                ],
                type: 'nemo_block_output_basic_play_melody_to_the_end',
            },
            paramsKeyMap: {
                TITLE: 0,
            },
            class: 'outputBlock',
            isNotFor: ['nemo'],
            func: function(sprite, script) {
                const title = script.getNumberValue('TITLE');
                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    Entry.hw.sendQueue['NEMO_OUTPUT'] = {
                        id: Math.random(),
                        index: 6,
                        playMelody: {
                            title: title,
                        },
                    };
                    return script;
                } else if (script.timeFlag == 1) {
                    const finished = Entry.hw.portData['NEMO_DEVICE_EX'].timeCheck[1];
                    if (finished.state) {
                        script.timeFlag = 2;
                    }
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();
                }
            }
        },
        nemo_block_output_basic_play_note: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.output_basic_play_note,
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
                        type: 'nemo_dropdown_keyboard',
                    },
                    null,
                ],
                type: 'nemo_block_output_basic_play_note',
            },
            paramsKeyMap: {
                PITCH: 0,
            },
            class: 'outputBlock',
            isNotFor: ['nemo'],
            func: function(sprite, script) {
                return Entry.nemo.setProcessor(script, Entry.nemo.delayTime, function() {
                    const pitch = script.getNumberValue('PITCH');                    
                    Entry.hw.sendQueue['NEMO_OUTPUT'] = {
                        id: Math.random(),
                        index: 7,
                        playNote: {
                            pitch: pitch
                        },
                    };
                    return false;
                });
            }
        },
        nemo_block_output_basic_play_note_for_seconds: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.output_basic_play_note_for_seconds,
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
                        type: 'nemo_dropdown_keyboard',
                    },
                    {
                        type: 'number',
                        params: ['1'],
                    },
                    null,
                ],
                type: 'nemo_block_output_basic_play_note_for_seconds',
            },
            paramsKeyMap: {
                PITCH: 0,
                TIME: 1,
            },
            class: 'outputBlock',
            isNotFor: ['nemo'],
            func: function(sprite, script) {
                const pitch = script.getNumberValue('PITCH');
                const time = script.getNumberValue('TIME');

                if (!script.isStart) {
                    script.isStart = true;
                    script.timeFlag = 1;
                    const fps = Entry.FPS || 60;
                    const timeValue = (60 / fps) * time * 1000;
                    Entry.TimeWaitManager.add(
                        Math.random(),
                        () => {
                            script.timeFlag = 0;
                        },
                        timeValue
                    );
                
                    Entry.hw.sendQueue['NEMO_OUTPUT'] = {
                        id: Math.random(),
                        index: 7,
                        playNote: {
                            pitch: pitch
                        },
                    };
                    return script;
                } else if (script.timeFlag == 1) {
                    return script;
                } else {
                    delete script.timeFlag;
                    delete script.isStart;
                    Entry.engine.isContinue = false;
                    return script.callReturn();     
                }
            }
        },
        nemo_block_output_basic_stop_all_sound: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.output_basic_stop_all_sound,
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
                type: 'nemo_block_output_basic_stop_all_sound',
            },
            paramsKeyMap: {},
            class: 'outputBlock',
            isNotFor: ['nemo'],
            func: function(sprite, script) {
                return Entry.nemo.setProcessor(script, Entry.nemo.delayTime, function() {
                    Entry.hw.sendQueue['NEMO_OUTPUT'] = {
                        id: Math.random(),
                        index: 9,
                        playNote: {
                            pitch: -1,
                        },
                        playMelody: {
                            title: 0,
                        },
                    };
                    return false;
                });
            }
        },
        ///========================================================================================
        /// Extension block
        ///========================================================================================  
        nemo_title_namo_extension: {
            skeleton: 'basic_text',
            color: EntryStatic.colorSet.common.TRANSPARENT,
            fontColor: '#333333',
            template: Lang.template.title_namo_extension,
            skeletonOptions: {
                box: {
                    offsetX: 20,
                },
            },
            def: {
                type: 'nemo_title_namo_extension',
              },
            isNotFor: ['nemo'],
            class : 'extensionBlock',
        },
        nemo_block_extension_basic_set_expension: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.extension_basic_set_expension,
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
                        type: 'nemo_dropdown_expension_sensor_mode',
                    },
                    null,
                ],
                type: 'nemo_block_extension_basic_set_expension',
            },
            paramsKeyMap: {
                TYPE: 0,
            },
            class: 'extensionBlock',
            isNotFor: ['nemo'],
            func: function(sprite, script) {
                return Entry.nemo.setProcessor(script, Entry.nemo.delayTime, function() {
                    const type = script.getNumberValue('TYPE');    
                    Entry.hw.sendQueue['NEMO_EXTENSION'] = {
                        id: Math.random(),
                        index: 0,
                        setExpansion: {
                            type: type,
                        },
                    };
                    return false;
                });
            }
        },
        nemo_block_extension_basic_set_expension_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.extension_basic_set_expension_value,
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
                        type: 'number',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'nemo_block_extension_basic_set_expension_value',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'extensionBlock',
            isNotFor: ['nemo'],
            func: function(sprite, script) {
                return Entry.nemo.setProcessor(script, Entry.nemo.delayTime, function() {
                    const value = script.getNumberValue('VALUE');
                    Entry.hw.sendQueue['NEMO_EXTENSION'] = {
                        id: Math.random(),
                        index: 1,
                        setExpansionValue: {
                            value: value,
                        },
                    };
                    return false;
                });
            }
        },
        nemo_block_extension_bool_expension_state: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            template: Lang.template.extension_bool_expension_state,
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
                        type: 'nemo_dropdown_button_state_question',
                    },
                    null
                ],
                type: 'nemo_block_extension_bool_expension_state',
            },
            paramsKeyMap: {
                STATE: 0,
            },
            class: 'extensionBlock',
            isNotFor: ['nemo'],
            func: function(sprite, script) {
                const state = script.getNumberValue('STATE') + 4;
                const expansion = Entry.hw.portData['NEMO_DEVICE_EX'].expansion;
                return expansion.state[state];
            }
        },
        nemo_block_extension_field_expension_anlog_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: Lang.template.extension_field_expension_anlog_value,
            params: [],
            events: {},
            def: {
                params: [],
                type: 'nemo_block_extension_field_expension_anlog_value',
            },
            paramsKeyMap: {},
            class: 'extensionBlock',
            isNotFor: ['nemo'],
            func: function(sprite, script) {
                const value = Entry.hw.portData['NEMO_DEVICE'].exPort;
                return value;
            }
        },
        nemo_block_extension_field_expension_custom_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: Lang.template.extension_field_expension_custom_value,
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
                        type: 'nemo_dropdown_compass_sensor_mode',
                    },
                ],
                type: 'nemo_block_extension_field_expension_custom_value',
            },
            paramsKeyMap: {
                TYPE: 0,
            },
            class: 'extensionBlock',
            isNotFor: ['nemo'],
            func: function(sprite, script) {
                const type = script.getNumberValue('TYPE');
                const expansion = Entry.hw.portData['NEMO_DEVICE_EX'].expansion;
                return expansion.state[type];
            }
        },        
        nemo_block_extension_basic_set_compass_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic',
            statements: [],
            template: Lang.template.extension_basic_set_compass_value,
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
                        type: 'number',
                        params: ['0'],
                    },
                ],
                type: 'nemo_block_extension_basic_set_compass_value',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'extensionBlock',
            isNotFor: ['nemo'],
            func: function(sprite, script) {
                return Entry.nemo.setProcessor(script, Entry.nemo.delayTime, function() {
                    const value = script.getNumberValue('VALUE');    
                    Entry.hw.sendQueue['NEMO_EXTENSION'] = {
                        id: Math.random(),
                        index: 2,
                        setCompassValue: {
                            value: value,
                        },
                    };
                    return false;
                });
            }
        },
        
        nemo_block_extension_field_compass_analog_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: Lang.template.extension_field_compass_analog_value,
            params: [],
            events: {},
            def: {
                params: [],
                type: 'nemo_block_extension_field_compass_analog_value',
            },
            paramsKeyMap: {},
            class: 'extensionBlock',
            isNotFor: ['nemo'],
            func: function(sprite, script) {
                const value = Entry.hw.portData['NEMO_DEVICE'].compass;
                return value;
            }
        },
        nemo_block_extension_field_compass_custom_value: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            template: Lang.template.extension_field_compass_custom_value,
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
                        type: 'nemo_dropdown_compass_sensor_mode',
                    },
                ],
                type: 'nemo_block_extension_field_compass_custom_value',
            },
            paramsKeyMap: {
                TYPE: 0,
            },
            class: 'extensionBlock',
            isNotFor: ['nemo'],
            func: function(sprite, script) {
                const type = script.getNumberValue('TYPE');
                const compass = Entry.hw.portData['NEMO_DEVICE_EX'].compass;
                return compass.state[type];
            }
        },        
        nemo_block_extension_bool_compass_state: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            template: Lang.template.extension_bool_compass_state,
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },],
            events: {},
            def: {
                params: [
                    {
                        type: 'nemo_dropdown_direction',
                    },
                ],
                type: 'nemo_block_extension_bool_compass_state',
            },
            paramsKeyMap: {
                DIRECTION: 0,
            },
            class: 'extensionBlock',
            isNotFor: ['nemo'],
            func: function(sprite, script) {
                const direction = script.getNumberValue('DIRECTION');
                const compass = Entry.hw.portData['NEMO_DEVICE_EX'].compass;
                return compass.state[4] === direction ? true : false;
            }
        },
    };
};

module.exports = Entry.nemo;