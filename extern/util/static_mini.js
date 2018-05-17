'use strict';

var EntryStatic = {};

EntryStatic.isPracticalCourse = true;

EntryStatic.objectTypes = ['sprite', 'textBox'];

EntryStatic.usageList = [
    'usage_event',
    'usage_signal',
    'usage_scene',
    'usage_repeat',
    'usage_condition_repeat',
    'usage_condition',
    'usage_clone',
    'usage_arrow_move',
    'usage_rotation',
    'usage_coordinate',
    'usage_shape',
    'usage_speak',
    'usage_picture_effect',
    'usage_textBox',
    'usage_draw',
    'usage_sound',
    'usage_confirm',
    'usage_comp_operation',
    'usage_logical_operation',
    'usage_math_operation',
    'usage_random',
    'usage_timer',
    'usage_variable',
    'usage_list',
    'usage_ask_answer',
    'usage_function',
    'usage_arduino',
];

EntryStatic.conceptList = [
    'concept_resource_analytics',
    'concept_individual',
    'concept_abstractive',
    'concept_procedual',
    'concept_automation',
    'concept_simulation',
    'concept_parallel',
];

EntryStatic.subjectList = [
    'subject_korean',
    'subject_mathmatics',
    'subject_social',
    'subject_science',
    'subject_english',
    'subject_courtesy',
    'subject_music',
    'subject_paint',
    'subject_athletic',
    'subject_progmatic',
];

EntryStatic.lectureLevels = [1, 2, 3];

// EntryStatic.lectureLevels = ['level_high', 'level_mid','level_row'];

EntryStatic.lectureGrades = [
    'e_1',
    'e_2',
    'e_3',
    'e_4',
    'e_5',
    'e_6',
    'm_1',
    'm_2',
    'm_3',
    'general',
];

EntryStatic.categoryList = [
    'category_game',
    'category_animation',
    'category_media_art',
    'category_physical',
    'category_etc',
];

EntryStatic.requiredTimes = [1, 2, 3, 4, 5];

EntryStatic.searchProjectOption = [
    {
        key: 'search_updated',
        lang: 'search_updated',
        value: 'updated',
    },
    {
        key: 'search_recent',
        lang: 'search_recent',
        value: 'recent',
    },
    {
        key: 'search_complexity',
        lang: 'search_complexity',
        value: 'complexity',
    },
    {
        key: 'search_staffPicked',
        lang: 'search_staffPicked',
        value: 'staffPicked',
    },
    {
        key: 'search_childCnt',
        lang: 'search_childCnt',
        value: 'childCnt',
    },
    {
        key: 'search_likeCnt',
        lang: 'search_likeCnt',
        value: 'recentLikeCnt',
    },
];

EntryStatic.getAllBlocks = function() {
    return [
        {
            category: 'start',
            blocks: [
                'when_run_button_click',
                'when_some_key_pressed',
                'mouse_clicked',
                'mouse_click_cancled',
                'when_object_click',
                'when_message_cast',
                'message_cast',
            ],
        },
        {
            category: 'flow',
            blocks: [
                'wait_second',
                'repeat_basic',
                'repeat_inf',
                'repeat_while_true',
                'stop_repeat',
                '_if',
                'if_else',
                'wait_until_true',
            ],
        },
        {
            category: 'moving',
            blocks: [
                'move_direction',
                'bounce_wall',
                'move_x',
                'move_y',
                'move_xy_time',
                'locate_xy',
                'locate_xy_time',
                'locate',
                'locate_object_time',
                'rotate_relative',
                'direction_relative',
                'rotate_absolute',
                'direction_absolute',
                'see_angle_object',
            ],
        },
        {
            category: 'looks',
            blocks: [
                'show',
                'hide',
                'dialog_time',
                'dialog',
                'change_to_some_shape',
                'change_to_next_shape',
                'add_effect_amount',
                'change_effect_amount',
                'erase_all_effects',
                'change_scale_size',
                'set_scale_size',
                'change_object_index',
            ],
        },
        {
            category: 'brush',
            blocks: [
                'brush_stamp',
                'start_drawing',
                'stop_drawing',
                'set_color',
                'change_thickness',
                'set_thickness',
                'brush_erase_all',
            ],
        },
        {
            category: 'text',
            blocks: ['text_write', 'text_append', 'text_prepend', 'text_flush'],
        },
        {
            category: 'sound',
            blocks: [
                'sound_something_with_block',
                'sound_something_wait_with_block',
                'sound_volume_change',
                'sound_volume_set',
            ],
        },
        {
            category: 'judgement',
            blocks: [
                'is_clicked',
                'is_press_some_key',
                'reach_something',
                'boolean_basic_operator',
            ],
        },
        {
            category: 'calc',
            blocks: [
                'calc_basic',
                'calc_rand',
                'coordinate_object',
                'quotient_and_mod',
                'get_project_timer_value',
                'choose_project_timer_action',
                'set_visible_project_timer',
                'length_of_string',
                'combine_something',
                'char_at',
                'substring',
                'replace_string',
            ],
        },
        {
            category: 'variable',
            blocks: [
                'variableAddButton',
                'ask_and_wait',
                'get_canvas_input_value',
                'set_visible_answer',
                'get_variable',
                'change_variable',
                'set_variable',
                'show_variable',
                'hide_variable',
            ],
        },
        {
            category: 'hw_motor',
            visible: false,
            blocks: [
                'practical_course_dummy',
                'practical_course_move_for_secs',
                'practical_course_move_for_secs2',
                'practical_course_move_for',
                'practical_course_move_for2',
                'practical_course_stop_for',
                //roborobo
                'roborobo_move_for_secs',
                'roborobo_move_for',
                'roborobo_turn_for',
                'roborobo_stop_for',
                'practical_course_set_servo2',
                //robotis
                'robotis_aux_move_for',
                'robotis_aux_stop_for',
                'robotis_set_servo_joint',
                'robotis_set_servo_wheel',
                'robotis_move_for_secs',
            ],
        },
        {
            category: 'hw_melody',
            visible: false,
            blocks: [
                'practical_course_dummy',
                'practical_course_melody_note_for',
                //robotis
                'robotis_melody_note_for',
            ],
        },
        {
            category: 'hw_sensor',
            visible: false,
            blocks: [
                'practical_course_dummy',
                'practical_course_touch_value',
                'practical_course_touch_value_boolean',
                'practical_course_light_value',
                'practical_course_light_value_boolean',
                'practical_course_sound_value',
                'practical_course_sound_value_boolean',
                'practical_course_irs_value',
                'practical_course_irs_value_boolean',
                //roborobo
                'roborobo_touch_value',
                'roborobo_touch_value_boolean',
                'roborobo_light_value',
                'roborobo_light_value_boolean',
                'roborobo_sound_value',
                'roborobo_sound_value_boolean',
                'roborobo_irs_value',
                'roborobo_irs_value_boolean',
                //robotis
                'robotis_touch_value',
                'robotis_touch_value_boolean',
                'robotis_irs_value',
                'robotis_irs_value_boolean',
                'robotis_light_value',
                'robotis_light_value_boolean',
                'robotis_detectedsound_value',
                'robotis_detectingsound_value',
                'robotis_detectedsound_value_boolean',
                'robotis_detectingsound_value_boolean',
                'robotis_color_value',
                'robotis_color_value_boolean',
                'robotis_humidity_value',
                'robotis_humidity_value_boolean',
                'robotis_temperature_value',
                'robotis_temperature_value_boolean',
            ],
        },
        {
            category: 'hw_led',
            visible: false,
            blocks: [
                'practical_course_dummy',
                'practical_course_diode_secs_toggle',
                'practical_course_diode_toggle',
                'practical_course_diode_inout_toggle',
                'practical_course_diode_set_output',
                'practical_course_diode_input_value',
                //roborobo
                'roborobo_diode_secs_toggle',
                'roborobo_diode_toggle',
                'roborobo_diode_inout_toggle',
                'roborobo_diode_set_output',
                'roborobo_diode_input_value',
                //robotis
                'robotis_set_led',
            ],
        },
        {
            category: 'hw_robot',
            blocks: [
                'arduino_download_connector',
                'download_guide',
                'arduino_connected',
                'arduino_connect',
                'robot_reconnect',
                'arduino_open',
                'arduino_cloud_pc_open',
            ],
        },
        {
            category: 'arduino',
            visible: false,
            blocks: [
                'arduino_get_number_sensor_value',
                'arduino_get_digital_value',
                'arduino_toggle_led',
                'arduino_toggle_pwm',
                'arduino_convert_scale',
                //arduinoExt
                'arduino_ext_get_analog_value',
                'arduino_ext_get_analog_value_map',
                'arduino_ext_get_ultrasonic_value',
                'arduino_ext_get_digital',
                'arduino_ext_toggle_led',
                'arduino_ext_digital_pwm',
                'arduino_ext_set_servo',
                'arduino_ext_set_tone',
                //joystick
                'joystick_get_number_sensor_value',
                'joystick_get_digital_value',
                'joystick_toggle_led',
                'joystick_toggle_pwm',
                'joystick_convert_scale',
                //dplay
                'dplay_get_number_sensor_value',
                'dplay_get_value',
                'dplay_get_gas_sensor_value',
                'dplay_get_dust_sensor_value',
                'dplay_get_CO2_sensor_value',
                'dplay_convert_scale',
                'dplay_get_digital_value',
                'dplay_get_switch_status',
                'dplay_get_tilt',
                'dplay_toggle_led',
                'dplay_toggle_pwm',
                'dplay_select_led',
                'dplay_DCmotor',
                'dplay_DCmotor_speed',
                'dplay_buzzer',
                'dplay_servo',
                'dplay_Robot_run',
                'dplay_Robot_run_sec',
                'dplay_robot_speed_sel',
                'dplay_robot_speed_set',
                'dplay_robot_stop',
                //nemoino
                'nemoino_get_named_sensor_value',
                'nemoino_get_sound_status',
                'nemoino_is_button_pressed',
                'nemoino_get_accelerometer_direction',
                'nemoino_get_accelerometer_value',
                'nemoino_get_number_sensor_value',
                'nemoino_get_digital_value',
                'nemoino_toggle_led',
                'nemoino_toggle_pwm',
                'nemoino_convert_scale',
                //neobot
                'neobot_sensor_value',
                'neobot_sensor_convert_scale',
                'neobot_left_motor',
                'neobot_stop_left_motor',
                'neobot_right_motor',
                'neobot_stop_right_motor',
                'neobot_all_motor',
                'neobot_stop_all_motor',
                'neobot_set_servo',
                'neobot_set_output',
                'neobot_set_fnd',
                'neobot_set_fnd_off',
                'neobot_play_note_for',
                'bitbrick_sensor_value',
                'bitbrick_convert_scale',
                'bitbrick_is_touch_pressed',
                'bitbrick_turn_off_color_led',
                'bitbrick_turn_on_color_led_by_rgb',
                'bitbrick_turn_on_color_led_by_picker',
                'bitbrick_turn_on_color_led_by_value',
                'bitbrick_buzzer',
                'bitbrick_turn_off_all_motors',
                'bitbrick_dc_speed',
                'bitbrick_dc_direction_speed',
                'bitbrick_servomotor_angle',
                'cobl_read_ultrason',
                'cobl_read_potenmeter',
                'cobl_read_irread1',
                'cobl_read_irread2',
                'cobl_read_joyx',
                'cobl_read_joyy',
                //"cobl_read_sens1",
                //"cobl_read_sens2",
                'cobl_read_tilt',
                'cobl_read_temps',
                'cobl_read_light',
                'cobl_read_btn',
                'cobl_led_control',
                'cobl_servo_angle_control',
                'cobl_melody',
                'cobl_dcmotor',
                'cobl_extention_port',
                'cobl_external_led',
                'cobl_7_segment',
                'hamster_hand_found',
                'hamster_value',
                'hamster_move_forward_once',
                'hamster_turn_once',
                'hamster_move_forward_for_secs',
                'hamster_move_backward_for_secs',
                'hamster_turn_for_secs',
                'hamster_change_both_wheels_by',
                'hamster_set_both_wheels_to',
                'hamster_change_wheel_by',
                'hamster_set_wheel_to',
                'hamster_follow_line_using',
                'hamster_follow_line_until',
                'hamster_set_following_speed_to',
                'hamster_stop',
                'hamster_set_led_to',
                'hamster_clear_led',
                'hamster_beep',
                'hamster_change_buzzer_by',
                'hamster_set_buzzer_to',
                'hamster_clear_buzzer',
                'hamster_play_note_for',
                'hamster_rest_for',
                'hamster_change_tempo_by',
                'hamster_set_tempo_to',
                'hamster_set_port_to',
                'hamster_change_output_by',
                'hamster_set_output_to',
                'albert_hand_found',
                'albert_is_oid_value',
                'albert_value',
                'albert_move_forward_for_secs',
                'albert_move_backward_for_secs',
                'albert_turn_for_secs',
                'albert_change_both_wheels_by',
                'albert_set_both_wheels_to',
                'albert_change_wheel_by',
                'albert_set_wheel_to',
                'albert_stop',
                'albert_set_pad_size_to',
                'albert_move_to_x_y_on_board',
                'albert_set_orientation_on_board',
                'albert_set_eye_to',
                'albert_clear_eye',
                'albert_body_led',
                'albert_front_led',
                'albert_beep',
                'albert_change_buzzer_by',
                'albert_set_buzzer_to',
                'albert_clear_buzzer',
                'albert_play_note_for',
                'albert_rest_for',
                'albert_change_tempo_by',
                'albert_set_tempo_to',
                //sensorBoard
                'sensorBoard_get_named_sensor_value',
                'sensorBoard_is_button_pressed',
                'sensorBoard_led',
                'sensorBoard_get_number_sensor_value',
                'sensorBoard_get_digital_value',
                'sensorBoard_toggle_led',
                'sensorBoard_toggle_pwm',
                'sensorBoard_convert_scale',
                //CODEino
                'CODEino_get_named_sensor_value',
                'CODEino_get_sound_status',
                'CODEino_get_light_status',
                'CODEino_is_button_pressed',
                'CODEino_get_accelerometer_direction',
                'CODEino_get_accelerometer_value',
                //"CODEino_get_number_sensor_value",
                'CODEino_get_digital_value',
                //"CODEino_toggle_led",
                //"CODEino_toggle_pwm",
                'CODEino_convert_scale',
                //2016-09-23
                'CODEino_get_analog_value',
                'CODEino_set_digital_value',
                'CODEino_set_pwm_value',
                'CODEino_led_by_value',
                'CODEino_set_rgb_off',
                'CODEino_set__led_by_rgb',
                'CODEino_rgb_set_color',
                'CODEino_set_rgb_value',
                'CODEino_set_rgb_add_value',
                //robotis_openCM70
                'robotis_openCM70_sensor_value',
                'robotis_openCM70_aux_sensor_value',
                'robotis_openCM70_cm_buzzer_index',
                'robotis_openCM70_cm_buzzer_melody',
                'robotis_openCM70_cm_sound_detected_clear',
                'robotis_openCM70_cm_led',
                'robotis_openCM70_cm_motion',
                'robotis_openCM70_aux_motor_speed',
                'robotis_openCM70_aux_servo_mode',
                'robotis_openCM70_aux_servo_speed',
                'robotis_openCM70_aux_servo_position',
                'robotis_openCM70_aux_led_module',
                'robotis_openCM70_aux_custom',
                'robotis_openCM70_cm_custom_value',
                'robotis_openCM70_cm_custom',
                'robotis_carCont_sensor_value',
                'robotis_carCont_cm_led',
                'robotis_carCont_cm_sound_detected_clear',
                'robotis_carCont_aux_motor_speed',
                'robotis_carCont_aux_motor_speed2',
                'robotis_carCont_cm_calibration',

                //XBOT Blocks added
                'xbot_analogValue',
                'xbot_digitalInput',
                'xbot_digitalOutput',
                'xbot_analogOutput',
                'xbot_rgb',
                'xbot_rgb_picker',
                'xbot_buzzer',
                'xbot_servo',
                'xbot_oneWheel',
                'xbot_twoWheel',
                'xbot_lcd',
                //end of XBOT Blocks added
                // ardublock Added 2016-06-01
                'ardublock_get_number_sensor_value',
                'ardublock_get_digital_value',
                'ardublock_toggle_led',
                'ardublock_toggle_pwm',
                'ardublock_convert_scale',
                // ardublock Added 2016-06-01

                'ev3_get_sensor_value',
                'ev3_touch_sensor',
                'ev3_color_sensor',
                'ev3_motor_power',
                'ev3_motor_power_on_time',
                'ev3_motor_degrees',

                'roduino_on_block',
                'roduino_off_block',
                'roduino_get_analog_value',
                'roduino_get_digital_value',
                'roduino_get_color',
                'roduino_set_digital',
                'roduino_motor',
                'roduino_set_color_pin',

                'schoolkit_on_block',
                'schoolkit_off_block',
                'schoolkit_get_input_value',
                'schoolkit_set_output',
                'schoolkit_motor',
                'schoolkit_set_servo_value',

                // codestar 2016-09-26
                'codestar_color_single',
                'codestar_3color',
                'codestar_vibration',
                'codestar_buzzer',
                'codestar_buzzer_stop',
                'codestar_drive',
                'codestar_wheel',
                'codestar_light',
                'codestar_button',
                'codestar_ir',
                'codestar_sonar',
                'codestar_mic',
                'codestar_temperature',

                //jeil science smartBoard. 2016-11-03
                //smartBoard
                'smartBoard_get_named_sensor_value',
                'smartBoard_is_button_pressed',
                'smartBoard_set_dc_motor_direction',
                'smartBoard_set_dc_motor_speed',
                'smartBoard_set_dc_motor_pwm',
                'smartBoard_set_servo_port_power',
                'smartBoard_set_servo_port_pwm',
                'smartBoard_set_servo_speed',
                'smartBoard_set_servo_angle',
                'smartBoard_set_number_eight_pin',
                'smartBoard_get_number_sensor_value',
                'smartBoard_get_digital_value',
                'smartBoard_toggle_led',
                'smartBoard_toggle_pwm',
                'smartBoard_convert_scale',
            ],
        },
    ];
};

EntryStatic.discussCategories = [
    // 'notice',
    'qna',
    'tips',
    'free',
    'report',
    'notice',
];

EntryStatic.artCategories = [
    {
        key: 'art_category_',
        lang: 'art_category_all',
        value: '',
    },
    {
        key: 'art_category_게임',
        lang: 'art_category_game',
        value: '게임',
    },
    {
        key: 'art_category_애니메이션',
        lang: 'art_category_animation',
        value: '애니메이션',
    },
    {
        key: 'art_category_미디어아트',
        lang: 'art_category_media',
        value: '미디어아트',
    },
    {
        key: 'art_category_피지컬',
        lang: 'art_category_physical',
        value: '피지컬',
    },
    {
        key: 'art_category_기타',
        lang: 'art_category_etc',
        value: '기타',
    },
];

EntryStatic.artSortOptions = [
    {
        key: 'art_sort_updated',
        lang: 'art_sort_updated',
        value: 'updated',
    },
    {
        key: 'art_sort_visit',
        lang: 'art_sort_visit',
        value: 'visit',
    },
    {
        key: 'art_sort_likeCnt',
        lang: 'art_sort_likeCnt',
        value: 'likeCnt',
    },
    {
        key: 'art_sort_comment',
        lang: 'art_sort_comment',
        value: 'comment',
    },
];

EntryStatic.discussSortOptions = [
    {
        lang: 'discuss_sort_created',
        value: 'created',
    },
    {
        lang: 'discuss_sort_visit',
        value: 'visit',
    },
    {
        lang: 'discuss_sort_likesLength',
        value: 'likesLength',
    },
    {
        lang: 'discuss_sort_commentsLength',
        value: 'commentsLength',
    },
];
EntryStatic.discussPeriodOptions = [
    {
        key: 'discuss_period_',
        lang: 'discuss_period_all',
        value: '',
    },
    {
        key: 'discuss_period_1',
        lang: 'discuss_period_day',
        value: '1',
    },
    {
        key: 'discuss_period_7',
        lang: 'discuss_period_week',
        value: '7',
    },
    {
        key: 'discuss_period_30',
        lang: 'discuss_period_month',
        value: '30',
    },
    {
        key: 'discuss_period_90',
        lang: 'discuss_period_three_month',
        value: '90',
    },
];

EntryStatic.artPeriodOptions = [
    {
        key: 'art_period_',
        lang: 'art_period_all',
        value: '',
    },
    {
        key: 'art_period_1',
        lang: 'art_period_day',
        value: '1',
    },
    {
        key: 'art_period_7',
        lang: 'art_period_week',
        value: '7',
    },
    {
        key: 'art_period_30',
        lang: 'art_period_month',
        value: '30',
    },
    {
        key: 'art_period_90',
        lang: 'art_period_three_month',
        value: '90',
    },
];

EntryStatic.getCategoryByBlock = function(blockName) {
    if (!blockName) return false;
    var allBlocks = EntryStatic.getAllBlocks();
    for (var i = 0, len = allBlocks.length; i < len; i++) {
        var blocks = allBlocks[i].blocks;
        if (blocks.indexOf(blockName) > -1) {
            return allBlocks[i].category;
        }
    }
    return false;
};

EntryStatic.objectMainCategories = [
    'entrybot_friends',
    'people',
    'animal',
    'plant',
    'vehicles',
    'architect',
    'food',
    'environment',
    'stuff',
    'fantasy',
    'interface',
    'background',
];

EntryStatic.objectSubCategories = {
    entrybot_friends: [],
    people: [],
    animal: ['animal_flying', 'animal_land', 'animal_water', 'animal_others'],
    plant: ['plant_flower', 'plant_grass', 'plant_tree', 'plant_others'],
    vehicles: [
        'vehicles_flying',
        'vehicles_land',
        'vehicles_water',
        'vehicles_others',
    ],
    architect: ['architect_building', 'architect_monument', 'architect_others'],
    food: ['food_vegetables', 'food_meat', 'food_drink', 'food_others'],
    environment: [
        'environment_nature',
        'environment_space',
        'environment_others',
    ],
    stuff: ['stuff_living', 'stuff_hobby', 'stuff_others'],
    fantasy: [],
    interface: [],
    background: [
        'background_outdoor',
        'background_indoor',
        'background_nature',
        'background_others',
    ],
};

EntryStatic.fonts = [
    {
        name: Lang.Fonts.batang,
        family: 'KoPub Batang',
        url: '/css/kopubbatang.css',
    },
    {
        name: Lang.Fonts.myeongjo,
        family: 'Nanum Myeongjo',
        url: '/css/nanummyeongjo.css',
    },
    {
        name: Lang.Fonts.gothic,
        family: 'Nanum Gothic',
        url: '/css/nanumgothic.css',
    },
    {
        name: Lang.Fonts.pen_script,
        family: 'Nanum Pen Script',
        url: '/css/nanumpenscript.css',
    },
    {
        name: Lang.Fonts.jeju_hallasan,
        family: 'Jeju Hallasan',
        url: '/css/jejuhallasan.css',
    },
    {
        name: Lang.Fonts.gothic_coding,
        family: 'Nanum Gothic Coding',
        url: '/css/nanumgothiccoding.css',
    },
];

EntryStatic.getName = function(str, type) {
    var dict = SpriteNames;
    if (type == 'picture') dict = PictureNames;
    else if (type == 'sound') dict = SoundNames;

    var lang = navigator.language ? navigator.language : 'ko';
    if (window.lang) lang = window.lang;

    if (window.user && window.user.language) lang = window.user.language;

    if (!dict || lang == 'ko' || lang == 'code') {
        return str;
    } else {
        return dict[str] ? dict[str] : str;
    }
};

EntryStatic.ARROW_COLOR_START = '#2f975a';
EntryStatic.ARROW_COLOR_FLOW = '#3a71bc';
EntryStatic.ARROW_COLOR_MOVING = '#8641b6';
EntryStatic.ARROW_COLOR_LOOKS = '#d8234e';
EntryStatic.ARROW_COLOR_SOUNDS = '#83a617';
EntryStatic.ARROW_COLOR_JUDGE = '#89a1f7';
EntryStatic.ARROW_COLOR_CALC = '#e8b349';
EntryStatic.ARROW_COLOR_VARIABLE = '#ce38ce';
EntryStatic.ARROW_COLOR_HW = '#097e84';

EntryStatic.initOptions = {
    listEnable: false,
    functionEnable: false,
    sceneEditable: false,
};

EntryStatic.hwCategoryList = ['hw_motor', 'hw_melody', 'hw_sensor', 'hw_led'];

EntryStatic.hwMiniSupportList = [
    'neobot',
    'roborobo_schoolkit',
    'robotis_openCM70',
];

EntryStatic.COMMAND_TYPES = {
    addThread: 101,
    destroyThread: 102,
    destroyBlock: 103,
    recoverBlock: 104,
    insertBlock: 105,
    separateBlock: 106,
    moveBlock: 107,
    cloneBlock: 108,
    uncloneBlock: 109,
    scrollBoard: 110,
    setFieldValue: 111,

    selectObject: 201,

    do: 301,
    undo: 302,
    redo: 303,
};

// for server node js code
if (typeof exports == 'object') {
    exports.blockInfo = EntryStatic.blockInfo;
    exports.getAllBlocks = EntryStatic.getAllBlocks;
    exports.getCategoryByBlock = EntryStatic.getCategoryByBlock;
    exports.EntryStatic = EntryStatic;
}
