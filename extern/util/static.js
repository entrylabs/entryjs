'use strict'

var EntryStatic = {};

EntryStatic.objectTypes = [
    "sprite",
    "textBox"
]

EntryStatic.usageList = [
    'usage_event','usage_signal','usage_scene','usage_repeat', 'usage_condition_repeat',
    'usage_condition','usage_clone', 'usage_arrow_move', 'usage_rotation', 'usage_coordinate', 'usage_shape',
    'usage_speak','usage_picture_effect', 'usage_textBox', 'usage_draw' , 'usage_sound',
    'usage_confirm',  'usage_comp_operation' ,'usage_logical_operation' ,'usage_math_operation',
    'usage_random', 'usage_timer', 'usage_variable', 'usage_list' ,'usage_ask_answer',
    'usage_function', 'usage_arduino'
];

EntryStatic.conceptList = [
    'concept_resource_analytics', 'concept_individual', 'concept_abstractive','concept_procedual',
     'concept_automation', 'concept_simulation', 'concept_parallel'
];

EntryStatic.subjectList = [
    'subject_korean', 'subject_mathmatics',  'subject_social',
    'subject_science', 'subject_english', 'subject_courtesy','subject_music', 'subject_paint',
    'subject_athletic',  'subject_progmatic'
];

EntryStatic.lectureLevels=[1,2,3];

// EntryStatic.lectureLevels = ['level_high', 'level_mid','level_row'];

EntryStatic.lectureGrades = [
    'e_1', 'e_2', 'e_3', 'e_4', 'e_5', 'e_6',
    'm_1', 'm_2', 'm_3',
    'general'
];

EntryStatic.categoryList = [
    'category_game', 'category_animation', 'category_media_art',
    'category_physical', 'category_etc'
];

EntryStatic.requiredTimes = [1,2,3,4,5];

EntryStatic.searchProjectOption = [
   {
       'key':'search_updated',
       'lang':'search_updated',
       'value': 'updated'
   },
   {
       'key':'search_recent',
       'lang':'search_recent',
       'value': 'recent'
   },
   {
       'key':'search_complexity',
       'lang':'search_complexity',
       'value':'complexity'
   },
   {
       'key':'search_staffPicked',
       'lang':'search_staffPicked',
       'value': 'staffPicked'
   },
   {
       'key':'search_childCnt',
       'lang':'search_childCnt',
       'value': 'childCnt'
   },
   {
       'key':'search_likeCnt',
       'lang':'search_likeCnt',
       'value': 'likeCnt'
   }
]

EntryStatic.getAllBlocks = function() {
    return [
        {
            category: "start",
            blocks: [
                "when_run_button_click",
                "when_some_key_pressed",
                "mouse_clicked",
                "mouse_click_cancled",
                "when_object_click",
                "when_object_click_canceled",
                "when_message_cast",
                "message_cast",
                "message_cast_wait",
                "when_scene_start",
                "start_scene",
                "start_neighbor_scene",
            ]
        },
        {
            category: "flow",
            blocks: [
                "wait_second",
                "repeat_basic",
                "repeat_inf",
                "repeat_while_true",
                "stop_repeat",
                "_if",
                "if_else",
                "wait_until_true",
                "stop_object",
                "restart_project",
                "when_clone_start",
                "create_clone",
                "delete_clone",
                "remove_all_clones"
            ]
        },
        {
            category: "moving",
            blocks: [
                "move_direction",
                "bounce_wall",
                "move_x",
                "move_y",
                "move_xy_time",
                "locate_x",
                "locate_y",
                "locate_xy",
                "locate_xy_time",
                "locate",
                "locate_object_time",
                "rotate_relative",
                "direction_relative",
                "rotate_by_time",
                "direction_relative_duration",
                "rotate_absolute",
                "direction_absolute",
                "see_angle_object",
                "move_to_angle"
            ]
        },
        {
            category: "looks",
            blocks: [
                "show",
                "hide",
                "dialog_time",
                "dialog",
                "remove_dialog",
                "change_to_some_shape",
                "change_to_next_shape",
                "add_effect_amount",
                "change_effect_amount",
                "erase_all_effects",
                "change_scale_size",
                "set_scale_size",
                "flip_x",
                "flip_y",
                "change_object_index"
            ]
        },
        {
            category: "brush",
            blocks: [
                "brush_stamp",
                "start_drawing",
                "stop_drawing",
                "set_color",
                "set_random_color",
                "change_thickness",
                "set_thickness",
                "change_brush_transparency",
                "set_brush_tranparency",
                "brush_erase_all"

            ]
        },
        {
            category: "text",
            blocks: [
                "text_write",
                "text_append",
                "text_prepend",
                "text_flush"
            ]
        },
        {
            category: "sound",
            blocks: [
                "sound_something_with_block",
                "sound_something_second_with_block",
                "sound_from_to",
                "sound_something_wait_with_block",
                "sound_something_second_wait_with_block",
                "sound_from_to_and_wait",
                "sound_volume_change",
                "sound_volume_set",
                "sound_silent_all"
            ]
        },
        {
            category: "judgement",
            blocks: [
                "is_clicked",
                "is_press_some_key",
                "reach_something",
                "boolean_basic_operator",
                "boolean_and",
                "boolean_or",
                "boolean_not"
            ]
        },
        {
            category: "calc",
            blocks: [
                "calc_basic",
                "calc_rand",
                "coordinate_mouse",
                "coordinate_object",
                "get_sound_volume",
                "quotient_and_mod",
                "calc_operation",
                "get_project_timer_value",
                "choose_project_timer_action",
                "set_visible_project_timer",
                "get_date",
                "distance_something",
                "get_sound_duration",
                "length_of_string",
                "combine_something",
                "char_at",
                "substring",
                "index_of_string",
                "replace_string",
                "change_string_case"
            ]
        },
        {
            category: "variable",
            blocks: [
                "variableAddButton",
                "listAddButton",
                "ask_and_wait",
                "get_canvas_input_value",
                "set_visible_answer",
                "get_variable",
                "change_variable",
                "set_variable",
                "show_variable",
                "hide_variable",
                "value_of_index_from_list",
                "add_value_to_list",
                "remove_value_from_list",
                "insert_value_to_list",
                "change_value_list_index",
                "length_of_list",
                "is_included_in_list",
                "show_list",
                "hide_list"
            ]
        },
        {
            category: "arduino",
            blocks: [
                "arduino_download_connector",
                "arduino_download_source",
                "arduino_connected",
                "arduino_reconnect",
                "arduino_get_number_sensor_value",
                "arduino_get_digital_value",
                "arduino_toggle_led",
                "arduino_toggle_pwm",
                "arduino_convert_scale",
                //dplay
                "dplay_get_number_sensor_value",
                "dplay_get_digital_value",
                "dplay_toggle_led",
                "dplay_toggle_pwm",
                "dplay_convert_scale",
                //neobot
                "neobot_sensor_value",
                "neobot_turn_left",
                "neobot_stop_left",
                "neobot_turn_right",
                "neobot_stop_right",
                "neobot_run_motor",
                "neobot_servo_1",
                "neobot_servo_2",
                "neobot_play_note_for",
                "neobot_set_sensor_value",
                "bitbrick_sensor_value",
                "bitbrick_convert_scale",
                "bitbrick_is_touch_pressed",
                "bitbrick_turn_off_color_led",
                "bitbrick_turn_on_color_led_by_rgb",
                "bitbrick_turn_on_color_led_by_picker",
                "bitbrick_turn_on_color_led_by_value",
                "bitbrick_buzzer",
                "bitbrick_turn_off_all_motors",
                "bitbrick_dc_speed",
                "bitbrick_dc_direction_speed",
                "bitbrick_servomotor_angle",
				"hamster_hand_found",
                "hamster_value",
				"hamster_move_forward_once",
				"hamster_turn_once",
                "hamster_move_forward_for_secs",
                "hamster_move_backward_for_secs",
                "hamster_turn_for_secs",
				"hamster_change_both_wheels_by",
                "hamster_set_both_wheels_to",
                "hamster_change_wheel_by",
                "hamster_set_wheel_to",
				"hamster_follow_line_using",
				"hamster_follow_line_until",
				"hamster_set_following_speed_to",
                "hamster_stop",
				"hamster_set_led_to",
                "hamster_clear_led",
                "hamster_beep",
				"hamster_change_buzzer_by",
                "hamster_set_buzzer_to",
                "hamster_clear_buzzer",
                "hamster_play_note_for",
                "hamster_rest_for",
                "hamster_change_tempo_by",
                "hamster_set_tempo_to",
				"hamster_set_port_to",
				"hamster_change_output_by",
				"hamster_set_output_to",
                "albert_hand_found",
				"albert_value",
                "albert_move_forward_for_secs",
                "albert_move_backward_for_secs",
                "albert_turn_for_secs",
				"albert_change_both_wheels_by",
                "albert_set_both_wheels_to",
                "albert_change_wheel_by",
                "albert_set_wheel_to",
                "albert_stop",
				"albert_set_pad_size_to",
				"albert_set_eye_to",
                "albert_clear_eye",
                "albert_body_led",
                "albert_front_led",
                "albert_beep",
				"albert_change_buzzer_by",
                "albert_set_buzzer_to",
                "albert_clear_buzzer",
                "albert_play_note_for",
                "albert_rest_for",
                "albert_change_tempo_by",
                "albert_set_tempo_to",
                //sensorBoard
                "sensorBoard_get_named_sensor_value",
                "sensorBoard_is_button_pressed",
                "sensorBoard_led",
                "sensorBoard_get_number_sensor_value",
                "sensorBoard_get_digital_value",
                "sensorBoard_toggle_led",
                "sensorBoard_toggle_pwm",
                "sensorBoard_convert_scale",
                //CODEino
                "CODEino_get_named_sensor_value",
                "CODEino_get_sound_status",
                "CODEino_get_light_status",
                "CODEino_is_button_pressed",
                "CODEino_get_accelerometer_direction",
                "CODEino_get_accelerometer_value",
                "CODEino_get_number_sensor_value",
                "CODEino_get_digital_value",
                "CODEino_toggle_led",
                "CODEino_toggle_pwm",
                "CODEino_convert_scale",
                "robotis_openCM70_sensor_value",
                "robotis_openCM70_aux_sensor_value",
                "robotis_openCM70_cm_buzzer_index",
                "robotis_openCM70_cm_buzzer_melody",
                "robotis_openCM70_cm_sound_detected_clear",
                "robotis_openCM70_cm_led",
                "robotis_openCM70_cm_motion",
                "robotis_openCM70_aux_motor_speed",
                "robotis_openCM70_aux_servo_mode",
                "robotis_openCM70_aux_servo_speed",
                "robotis_openCM70_aux_servo_position",
                "robotis_openCM70_aux_led_module",
                "robotis_openCM70_aux_custom",
                "robotis_openCM70_cm_custom_value",
                "robotis_openCM70_cm_custom",
                "robotis_carCont_sensor_value",
                "robotis_carCont_cm_led",
                "robotis_carCont_cm_sound_detected_clear",
                "robotis_carCont_aux_motor_speed",
                "robotis_carCont_cm_calibration"
            ]
        }
    ]
}

EntryStatic.blockInfo = {
    "when_run_button_click": {
        "xml": "<block type='when_run_button_click'></block>",
        "class": "event",
        "isNotFor": [],
        "usage": ["start"]
    },
    "when_some_key_pressed": {
        "xml": "<block type='when_some_key_pressed'></block>",
        "class": "event",
        "isNotFor": [],
        "usage": ["start"]
    },
    "mouse_clicked": {
        "xml": "<block type='mouse_clicked'></block>",
        "class": "event",
        "isNotFor": [],
        "usage": ["start"]
    },
    "mouse_click_cancled": {
        "xml": "<block type='mouse_click_cancled'></block>",
        "class": "event",
        "isNotFor": [],
        "usage": ["start"]
    },
    "when_object_click": {
        "xml": "<block type='when_object_click'></block>",
        "class": "event",
        "isNotFor": [],
        "usage": ["start"]
    },
    "when_object_click_canceled": {
        "xml": "<block type='when_object_click_canceled'></block>",
        "class": "event",
        "isNotFor": [],
        "usage": ["start"]
    },
    "when_message_cast": {
        "xml": "<block type='when_message_cast'></block>",
        "class": "message",
        "isNotFor": ["message"],
        "usage": ["start", "message"]
    },
    "message_cast": {
        "xml": "<block type='message_cast'></block>",
        "class": "message",
        "isNotFor": ["message"],
        "usage": ["start", "message"]
    },
    "message_cast_wait": {
        "xml": "<block type='message_cast_wait'></block>",
        "class": "message",
        "isNotFor": ["message"],
        "usage": ["start", "message"]
    },
    "when_scene_start": {
        "xml": "<block type='when_scene_start'></block>",
        "class": "scene",
        "isNotFor": ["scene"],
        "usage": ["scene"]
    },
    "start_scene": {
        "xml": "<block type='start_scene'></block>",
        "class": "scene",
        "isNotFor": ["scene"],
        "usage": ["scene"]
    },
    "start_neighbor_scene": {
        "xml": "<block type='start_neighbor_scene'></block>",
        "class": "scene",
        "isNotFor": ["scene"],
        "usage": ["scene"]
    },
    "wait_second": {
        "xml": "<block type='wait_second'><value name='SECOND'><block type='number'><field name='NUM'>2</field></block></value></block>",
        "class": "delay",
        "isNotFor": [],
        "description": "설정한 시간만큼 기다린 후 다음 블록을 실행합니다."
    },
    "repeat_basic": {
        "xml": "<block type='repeat_basic'><value name='VALUE'><block type='number'><field name='NUM'>10</field></block></value></block>",
        "class": "repeat",
        "isNotFor": [],
        "usage": ["repeat"]
    },
    "repeat_inf": {
        "xml": "<block type='repeat_inf'></block>",
        "class": "repeat",
        "isNotFor": [],
        "usage": ["repeat"]
    },
    "repeat_while_true": {
        "xml": "<block type='repeat_while_true'><value name='BOOL'><block type='True'></block> </value> </block>",
        "class": "repeat",
        "isNotFor": [],
        "usage": ["repeat", "condition"]
    },
    "stop_repeat": {
        "xml": "<block type='stop_repeat'></block>",
        "class": "repeat",
        "isNotFor": [],
        "usage": ["repeat"]
    },
    "_if": {
        "xml": "<block type='_if'> <value name='BOOL'> <block type='True'></block> </value> </block>",
        "class": "condition",
        "isNotFor": [],
        "usage": ["condition"]
    },
    "if_else": {
        "xml": "<block type='if_else'> <value name='BOOL'> <block type='True'></block> </value> </block>",
        "class": "condition",
        "isNotFor": [],
        "usage": ["condition"]
    },
    "restart_project": {
        "xml": "<block type='restart_project'></block>",
        "class": "terminate",
        "isNotFor": [],
        "description": "모든 오브젝트들을 처음부터 다시 실행합니다."
    },
    "stop_object": {
        "xml": "<block type='stop_object'></block>",
        "class": "terminate",
        "isNotFor": [],
        "description": "모든 오브젝트 : 모든 오브젝트들이 즉시 실행을 멈춥니다.<br>이 블록 : 이 블록과 연결된 모든 블록들이 즉시 실행을 멈춥니다.<br>이 오브젝트 : 해당 오브젝트의 모든 블록들을 멈춥니다.<br>이 오브젝트의 다른 블록 : 해당 오브젝트 중 이 블록과 연결된 블록은 멈추지 않고 다른 블록들은 멈추게 됩니다."
    },
    "wait_until_true": {
        "xml": "<block type='wait_until_true'> <value name='BOOL'> <block type='True'></block> </value> </block>",
        "class": "wait",
        "isNotFor": [],
        "usage": ["condition"]
    },
    "when_clone_start": {
        "xml": "<block type='when_clone_start'></block>",
        "class": "clone",
        "isNotFor": [],
        "usage": ["clone"]
    },
    "create_clone": {
        "xml": "<block type='create_clone'></block>",
        "class": "clone",
        "isNotFor": [],
        "usage": ["clone"]
    },
    "delete_clone": {
        "xml": "<block type='delete_clone'></block>",
        "class": "clone",
        "isNotFor": [],
        "usage": ["clone"]
    },
    "remove_all_clones": {
        "xml": "<block type='remove_all_clones'></block>",
        "class": "clone",
        "isNotFor": [],
        "usage": ["clone"]
    },
    "move_direction": {
        "xml": "<block type='move_direction'> <value name='VALUE'> <block type='number'><field name='NUM'>10</field></block> </value> </block>",
        "class": "walk",
        "isNotFor": [],
        "usage": ["moving_direction"]
    },
    "move_x": {
        "xml": "<block type='move_x'> <value name='VALUE'> <block type='number'><field name='NUM'>10</field></block> </value> </block>",
        "class": "move_relative",
        "isNotFor": [],
        "usage": ["coordinate"]
    },
    "move_y": {
        "xml": "<block type='move_y'> <value name='VALUE'> <block type='number'><field name='NUM'>10</field></block> </value> </block>",
        "class": "move_relative",
        "isNotFor": [],
        "usage": ["coordinate"]
    },
    "move_xy_time": {
        "xml": "<block type='move_xy_time'><value name='VALUE1'><block type='number'><field name='NUM'>2</field></block></value><value name='VALUE2'><block type='number'><field name='NUM'>10</field></block></value><value name='VALUE3'><block type='number'><field name='NUM'>10</field></block></value></block>",
        "class": "move_relative",
        "isNotFor": [],
        "usage": ["coordinate"]
    },
    "locate_object_time": {
        "xml": "<block type='locate_object_time'><value name='VALUE'><block type='number'><field name='NUM'>2</field></block></value></block>",
        "class": "move_absolute",
        "isNotFor": [],
        "usage": ["coordinate"]
    },
    "locate_x": {
        "xml": "<block type='locate_x'><value name='VALUE'><block type='number'><field name='NUM'>10</field></block></value></block>",
        "class": "move_absolute",
        "isNotFor": [],
        "usage": ["coordinate"]
    },
    "locate_y": {
        "xml": "<block type='locate_y'><value name='VALUE'><block type='number'><field name='NUM'>10</field></block></value></block>",
        "class": "move_absolute",
        "isNotFor": [],
        "usage": ["coordinate"]
    },
    "locate_xy": {
        "xml": "<block type='locate_xy'><value name='VALUE1'><block type='number'><field name='NUM'>0</field></block></value><value name='VALUE2'><block type='number'><field name='NUM'>0</field></block></value></block>",
        "class": "move_absolute",
        "isNotFor": [],
        "usage": ["coordinate"]
    },
    "locate_xy_time": {
        "xml": "<block type='locate_xy_time'><value name='VALUE1'><block type='number'><field name='NUM'>2</field></block></value><value name='VALUE2'><block type='number'><field name='NUM'>10</field></block></value><value name='VALUE3'><block type='number'><field name='NUM'>10</field></block></value></block>",
        "class": "move_absolute",
        "isNotFor": [],
        "usage": ["coordinate"]
    },
    "locate": {
        "xml": "<block type='locate'></block>",
        "class": "move_absolute",
        "isNotFor": [],
        "usage": ["coordinate"]
    },
    "rotate_absolute": {
        "xml": "<block type='rotate_absolute'> <value name='VALUE'> <block type='angle'></block> </value> </block>",
        "class": "rotate_absolute",
        "isNotFor": [],
        "usage": ["direction"]
    },
    "rotate_by_time": {
        "xml": "<block type='rotate_by_time'> <value name='VALUE'> <block type='number'><field name='NUM'>2</field></block> </value> <value name='ANGLE'> <block type='angle'></block> </value> </block>",
        "class": "rotate",
        "isNotFor": [],
        "usage": ["direction"]
    },
    "rotate_relative": {
        "xml": "<block type='rotate_relative'> <value name='VALUE'> <block type='angle'></block> </value> </block>",
        "class": "rotate",
        "isNotFor": [],
        "usage": ["direction"]
    },
    "direction_absolute": {
        "xml": "<block type='direction_absolute'> <value name='VALUE'> <block type='angle'></block> </value> </block>",
        "class": "rotate_absolute",
        "isNotFor": [],
        "usage": ["direction"]
    },
    "direction_relative": {
        "xml": "<block type='direction_relative'> <value name='VALUE'> <block type='angle'></block> </value> </block>",
        "class": "rotate",
        "isNotFor": [],
        "usage": ["direction"]
    },
    "move_to_angle": {
        "xml": "<block type='move_to_angle'> <value name='ANGLE'> <block type='angle'></block> </value> <value name='VALUE'> <block type='number'><field name='NUM'>10</field></block> </value> </block>",
        "class": "move_rotate",
        "isNotFor": [],
        "usage": ["direction"]
    },
    "see_angle_object": {
        "xml": "<block type='see_angle_object'></block>",
        "class": "rotate_absolute",
        "isNotFor": [],
        "usage": ["direction"]
    },
    "bounce_wall": {
        "xml": "<block type='bounce_wall'></block>",
        "class": "walk",
        "isNotFor": [],
        "usage": ["moving_direction"]
    },
    "show": {
        "xml": "<block type='show'></block>",
        "class": "visibility",
        "isNotFor": [],
        "usage": ["shape"]
    },
    "hide": {
        "xml": "<block type='hide'></block>",
        "class": "visibility",
        "isNotFor": [],
        "usage": ["shape"]
    },
    "dialog_time": {
        "xml": "<block type='dialog_time'> <value name='VALUE'> <block type='text'> <field name='NAME'>"+ Lang.Blocks.block_hi +"</field> </block> </value> <value name='SECOND'> <block type='number'><field name='NUM'>4</field></block> </value> </block>",
        "class": "say",
        "isNotFor": ["textBox"],
        "usage": ["dialog"]
    },
    "dialog": {
        "xml": "<block type='dialog'> <value name='VALUE'> <block type='text'> <field name='NAME'>"+ Lang.Blocks.block_hi +"</field> </block> </value> </block>",
        "class": "say",
        "isNotFor": ["textBox"],
        "usage": ["dialog"]
    },
    "remove_dialog": {
        "xml": "<block type='remove_dialog'> </block>",
        "class": "say",
        "isNotFor": ["textBox"],
        "usage": ["dialog"]
    },
    "change_to_some_shape": {
        "xml": "<block type='change_to_some_shape'> <value name='VALUE'> <block type='get_pictures'> </block> </value> </block>",
        "class": "shape",
        "isNotFor": ["textBox"],
        "usage": ["shape"]
    },
    "change_to_next_shape": {
        "xml": "<block type='change_to_next_shape'></block>",
        "class": "shape",
        "isNotFor": ["textBox"],
        "usage": ["shape"]
    },
    "set_effect_volume": {
        "xml": "<block type='set_effect_volume'> <value name='VALUE'> <block type='number'><field name='NUM'>10</field></block> </value> </block>",
        "class": "effect",
        "isNotFor": ["textBox"],
        "usage": ["graphic"]
    },
    "set_effect_amount": {
        "xml": "<block type='set_effect_amount'> <value name='VALUE'> <block type='number'><field name='NUM'>10</field></block> </value> </block>",
        "class": "effect",
        "isNotFor": ["textBox"],
        "description": "해당 오브젝트에 선택한 효과를 입력한 값만큼 줍니다."
    },
    "set_effect": {
        "xml": "<block type='set_effect'> <value name='VALUE'> <block type='number'><field name='NUM'>100</field></block> </value> </block>",
        "class": "effect",
        "isNotFor": ["textBox"],
        "usage": ["graphic"]
    },
    "set_entity_effect": {
        "xml": "<block type='set_entity_effect'> <value name='VALUE'> <block type='number'><field name='NUM'>100</field></block> </value> </block>",
        "class": "effect",
        "isNotFor": ["textBox"],
        "description": "해당 오브젝트에 선택한 효과를 입력한 값으로 정합니다."
    },
    "add_effect_amount": {
        "xml": "<block type='add_effect_amount'> <value name='VALUE'> <block type='number'><field name='NUM'>10</field></block> </value> </block>",
        "class": "effect",
        "isNotFor": ["textBox"],
        "usage": ["graphic"]
    },
    "change_effect_amount": {
        "xml": "<block type='change_effect_amount'> <value name='VALUE'> <block type='number'><field name='NUM'>100</field></block> </value> </block>",
        "class": "effect",
        "isNotFor": ["textBox"],
        "usage": ["graphic"]
    },
    "erase_all_effects": {
        "xml": "<block type='erase_all_effects'></block>",
        "class": "effect",
        "isNotFor": ["textBox"],
        "usage": ["graphic"]
    },
    "change_scale_percent": {
        "xml": "<block type='change_scale_percent'> <value name='VALUE'> <block type='number'><field name='NUM'>10</field></block> </value> </block>",
        "class": "scale",
        "isNotFor": [],
        "usage": ["graphic"]
    },
    "set_scale_percent": {
        "xml": "<block type='set_scale_percent'> <value name='VALUE'> <block type='number'><field name='NUM'>100</field></block> </value> </block>",
        "class": "scale",
        "isNotFor": [],
        "usage": ["graphic"]
    },
    "change_scale_size": {
        "xml": "<block type='change_scale_size'> <value name='VALUE'> <block type='number'><field name='NUM'>10</field></block> </value> </block>",
        "class": "scale",
        "isNotFor": [],
        "usage": ["graphic"]
    },
    "set_scale_size": {
        "xml": "<block type='set_scale_size'> <value name='VALUE'> <block type='number'><field name='NUM'>100</field></block> </value> </block>",
        "class": "scale",
        "isNotFor": [],
        "usage": ["graphic"]
    },
    "flip_x": {
        "xml": "<block type='flip_x'></block>",
        "class": "flip",
        "isNotFor": [],
        "usage": ["graphic"]
    },
    "flip_y": {
        "xml": "<block type='flip_y'></block>",
        "class": "flip",
        "isNotFor": [],
        "usage": ["graphic"]
    },
    "set_object_order": {
        "xml": "<block type='set_object_order'></block>",
        "class": "z-index",
        "isNotFor": [],
        "usage": ["graphic"]
    },
    "change_object_index": {
        "xml": "<block type='change_object_index'></block>",
        "class": "z-index",
        "isNotFor": [],
        "usage": ["graphic"]
    },
    "brush_stamp": {
        "xml": "<block type='brush_stamp'></block>",
        "class": "stamp",
        "isNotFor": ["textBox"],
        "usage": ["brush"]
    },
    "start_drawing": {
        "xml": "<block type='start_drawing'></block>",
        "class": "brush_control",
        "isNotFor": ["textBox"],
        "usage": ["brush"]
    },
    "stop_drawing": {
        "xml": "<block type='stop_drawing'></block>",
        "class": "brush_control",
        "isNotFor": ["textBox"],
        "usage": ["brush"]
    },
    "set_color": {
        "xml": "<block type='set_color'></block>",
        "class": "brush_color",
        "isNotFor": ["textBox"],
        "usage": ["brush"]
    },
    "set_random_color": {
        "xml": "<block type='set_random_color'></block>",
        "class": "brush_color",
        "isNotFor": ["textBox"],
        "usage": ["brush"]
    },
    "change_thickness": {
        "xml": "<block type='change_thickness'> <value name='VALUE'> <block type='number'><field name='NUM'>1</field></block> </value> </block>",
        "class": "brush_thickness",
        "isNotFor": ["textBox"],
        "usage": ["brush"]
    },
    "set_thickness": {
        "xml": "<block type='set_thickness'> <value name='VALUE'> <block type='number'><field name='NUM'>1</field></block> </value> </block>",
        "class": "brush_thickness",
        "isNotFor": ["textBox"],
        "usage": ["brush"]
    },
    "change_opacity": {
        "xml": "<block type='change_opacity'> <value name='VALUE'> <block type='number'><field name='NUM'>10</field></block> </value> </block>",
        "class": "brush_opacity",
        "isNotFor": ["textBox"],
        "usage": ["brush"]
    },
    "change_brush_transparency": {
        "xml": "<block type='change_brush_transparency'> <value name='VALUE'><block type='number'><field name='NUM'>10</field></block> </value></block>",
        "class": "brush_opacity",
        "isNotFor": ["textBox"],
        "usage": ["brush"]
    },
    "set_opacity": {
        "xml": "<block type='set_opacity'> <value name='VALUE'> <block type='number'><field name='NUM'>50</field></block> </value> </block>",
        "class": "brush_opacity",
        "isNotFor": ["textBox"],
        "usage": ["brush"]
    },
    "set_brush_tranparency": {
        "xml": "<block type='set_brush_tranparency'> <value name='VALUE'> <block type='number'><field name='NUM'>50</field></block> </value> </block>",
        "class": "brush_opacity",
        "isNotFor": ["textBox"],
        "usage": ["brush"]
    },
    "brush_erase_all": {
        "xml": "<block type='brush_erase_all'></block>",
        "class": "brush_clear",
        "isNotFor": ["textBox"],
        "usage": ["brush"]
    },
    "sound_something_with_block": {
        "xml": "<block type='sound_something_with_block'><value name='VALUE'><block type='get_sounds'></block></value></block>",
        "class": "sound_play",
        "isNotFor": [],
        "description": "해당 오브젝트가 선택한 소리를 재생하는 동시에 다음 블록을 실행합니다."
    },
    "sound_something_second_with_block": {
        "xml": "<block type='sound_something_second_with_block'><value name='VALUE'><block type='get_sounds'></block></value><value name='SECOND'><block type='number'><field name='NUM'>1</field></block></value></block>",
        "class": "sound_play",
        "isNotFor": [],
        "usage": ["sound"]
    },
    "sound_something_wait_with_block": {
        "xml": "<block type='sound_something_wait_with_block'><value name='VALUE'><block type='get_sounds'></block></value></block>",
        "class": "sound_wait",
        "isNotFor": [],
        "usage": ["sound"]
    },
    "sound_something_second_wait_with_block": {
        "xml": "<block type='sound_something_second_wait_with_block'><value name='VALUE'><block type='get_sounds'></block></value><value name='SECOND'><block type='number'><field name='NUM'>1</field></block></value></block>",
        "class": "sound_wait",
        "isNotFor": [],
        "usage": ["sound"]
    },
    "sound_volume_change": {
        "xml": "<block type='sound_volume_change'> <value name='VALUE'> <block type='number'><field name='NUM'>10</field></block> </value> </block>",
        "class": "sound_volume",
        "isNotFor": [],
        "usage": ["sound"]
    },
    "sound_volume_set": {
        "xml": "<block type='sound_volume_set'> <value name='VALUE'> <block type='number'><field name='NUM'>10</field></block> </value> </block>",
        "class": "sound_volume",
        "isNotFor": [],
        "usage": ["sound"]
    },
    "sound_silent_all": {
        "xml": "<block type='sound_silent_all'></block>",
        "class": "sound_stop",
        "isNotFor": [],
        "usage": ["sound"]
    },
    "is_clicked": {
        "xml": "<block type='is_clicked'></block>",
        "class": "boolean_input",
        "isNotFor": [],
        "usage": ["judgement"]
    },
    "is_press_some_key": {
        "xml": "<block type='is_press_some_key'></block>",
        "class": "boolean_input",
        "isNotFor": [],
        "usage": ["judgement"]
    },
    "reach_something": {
        "xml": "<block type='reach_something'></block>",
        "class": "boolean_collision",
        "isNotFor": [],
        "usage": ["judgement"]
    },
    "is_included_in_list": {
        "xml": "<block type='is_included_in_list'> <value name='DATA'> <block type='text'> <field name='NAME'>10</field> </block> </value> </block>",
        "class": "list",
        "isNotFor": ["list", "listNotExist"],
        "usage": ["list"]
    },
    "boolean_basic_operator": {
        "xml": "<block type='boolean_basic_operator'> <field name='OPERATOR'>EQUAL</field> <value name='LEFTHAND'> <block type='text'><field name='NAME'>10</field></block> </value> <value name='RIGHTHAND'> <block type='text'><field name='NAME'>10</field></block> </value> </block>",
        "xmls": [
            "<block type='boolean_basic_operator'> <field name='OPERATOR'>EQUAL</field> <value name='LEFTHAND'> <block type='text'><field name='NAME'>10</field></block> </value> <value name='RIGHTHAND'> <block type='text'><field name='NAME'>10</field></block> </value> </block>",
            "<block type='boolean_basic_operator'> <field name='OPERATOR'>GREATER</field> <value name='LEFTHAND'> <block type='text'><field name='NAME'>10</field></block> </value> <value name='RIGHTHAND'> <block type='text'><field name='NAME'>10</field></block> </value> </block>",
            "<block type='boolean_basic_operator'> <field name='OPERATOR'>LESS</field> <value name='LEFTHAND'> <block type='text'><field name='NAME'>10</field></block> </value> <value name='RIGHTHAND'> <block type='text'><field name='NAME'>10</field></block> </value> </block>",
            "<block type='boolean_basic_operator'> <field name='OPERATOR'>GREATER_OR_EQUAL</field> <value name='LEFTHAND'> <block type='text'><field name='NAME'>10</field></block> </value> <value name='RIGHTHAND'> <block type='text'><field name='NAME'>10</field></block> </value> </block>",
            "<block type='boolean_basic_operator'> <field name='OPERATOR'>LESS_OR_EQUAL</field> <value name='LEFTHAND'> <block type='text'><field name='NAME'>10</field></block> </value> <value name='RIGHTHAND'> <block type='text'><field name='NAME'>10</field></block> </value> </block>"
        ],
        "class": "boolean_compare",
        "isNotFor": [],
        "usage": ["compute_compare"]
    },
    "boolean_and": {
        "xml": "<block type='boolean_and'> <value name='LEFTHAND'> <block type='True'></block> </value> <value name='RIGHTHAND'> <block type='True'></block> </value> </block>",
        "class": "boolean",
        "isNotFor": [],
        "usage": ["compute_logical"]
    },
    "boolean_or": {
        "xml": "<block type='boolean_or'> <value name='LEFTHAND'> <block type='True'></block> </value> <value name='RIGHTHAND'> <block type='False'></block> </value> </block>",
        "class": "boolean",
        "isNotFor": [],
        "usage": ["compute_logical"]
    },
    "boolean_not": {
        "xml": "<block type='boolean_not'> <value name='VALUE'> <block type='True'></block> </value> </block>",
        "class": "boolean",
        "isNotFor": [],
        "usage": ["compute_logical"]
    },
    "calc_basic": {
        "xml": "<block type='calc_basic'> <field name='OPERATOR'>PLUS</field> <value name='LEFTHAND'> <block type='number'><field name='NUM'>10</field></block> </value> <value name='RIGHTHAND'> <block type='number'><field name='NUM'>10</field></block> </value> </block>",
        "xmls": [
            "<block type='calc_basic'> <field name='OPERATOR'>PLUS</field> <value name='LEFTHAND'> <block type='number'><field name='NUM'>10</field></block> </value> <value name='RIGHTHAND'> <block type='number'><field name='NUM'>10</field></block> </value> </block>",
            "<block type='calc_basic'> <field name='OPERATOR'>MINUS</field> <value name='LEFTHAND'> <block type='number'><field name='NUM'>10</field></block> </value> <value name='RIGHTHAND'> <block type='number'><field name='NUM'>10</field></block> </value> </block>",
            "<block type='calc_basic'> <field name='OPERATOR'>MULTI</field> <value name='LEFTHAND'> <block type='number'><field name='NUM'>10</field></block> </value> <value name='RIGHTHAND'> <block type='number'><field name='NUM'>10</field></block> </value> </block>",
            "<block type='calc_basic'> <field name='OPERATOR'>DIVIDE</field> <value name='LEFTHAND'> <block type='number'><field name='NUM'>10</field></block> </value> <value name='RIGHTHAND'> <block type='number'><field name='NUM'>10</field></block> </value> </block>"
        ],
        "class": "calc",
        "isNotFor": [],
        "usage": ["calculation"]
    },
    "calc_rand": {
        "xml": "<block type='calc_rand'> <value name='LEFTHAND'> <block type='number'><field name='NUM'>0</field></block> </value> <value name='RIGHTHAND'> <block type='number'><field name='NUM'>10</field></block> </value> </block>",
        "class": "calc",
        "isNotFor": [],
        "usage": ["calc"]
    },
    "get_x_coordinate": {
        "xml": "<block type='get_x_coordinate'></block>",
        "class": "calc",
        "isNotFor": [],
        "description": "해당 오브젝트의 x 좌표값을 의미합니다."
    },
    "get_y_coordinate": {
        "xml": "<block type='get_y_coordinate'></block>",
        "class": "calc",
        "isNotFor": [],
        "description": "해당 오브젝트의 y 좌표값을 의미합니다."
    },
    "coordinate_mouse": {
        "xml": "<block type='coordinate_mouse'></block>",
        "class": "calc",
        "isNotFor": [],
        "description": "마우스의 x 또는 y의 좌표 값을 의미합니다."
    },
    "coordinate_object": {
        "xml": "<block type='coordinate_object'></block>",
        "class": "calc",
        "isNotFor": [],
        "description": "선택한 오브젝트의 x,y좌표 및 각종 정보(방향, 모양이름 등)를 의미합니다."
    },
    "get_rotation_direction": {
        "xml": "<block type='get_rotation_direction'></block>",
        "class": "calc",
        "isNotFor": [],
        "description": "해당 오브젝트의 방향값, 이동 방향값을 의미합니다."
    },
    "calc_share": {
        "xml": "<block type='calc_share'> <value name='LEFTHAND'> <block type='number'><field name='NUM'>10</field></block> </value> <value name='RIGHTHAND'> <block type='number'><field name='NUM'>10</field></block> </value> </block>",
        "class": "calc",
        "isNotFor": [],
        "usage": ["calculation"]
    },
    "calc_mod": {
        "xml": "<block type='calc_mod'> <value name='LEFTHAND'> <block type='number'><field name='NUM'>10</field></block> </value> <value name='RIGHTHAND'> <block type='number'><field name='NUM'>10</field></block> </value> </block>",
        "class": "calc",
        "isNotFor": [],
        "usage": ["calculation"]
    },
    "calc_operation": {
        "xml": "<block type='calc_operation'> <value name='LEFTHAND'> <block type='number'><field name='NUM'>10</field></block> </value> </block>",
        "class": "calc",
        "isNotFor": [],
        "usage": ["calculation"]
    },
    "get_date": {
        "xml": "<block type='get_date'> <field name='VALUE'>YEAR</field> </block>",
        "class": "calc_date",
        "isNotFor": [],
        "description": "현재 연도, 월, 일, 시각과 같이 시간에 대한 값을 의미합니다."
    },
    "distance_something": {
        "xml": "<block type='distance_something'></block>",
        "class": "calc_distance",
        "isNotFor": [],
        "description": "해당 오브젝트와 선택한 오브젝트간의 거리를 의미합니다."
    },
    "get_sound_duration": {
        "xml": "<block type='get_sound_duration'></block>",
        "class": "calc_duration",
        "isNotFor": [],
        "description": "선택한 소리의 길이 값을 의미합니다."
    },
    "get_project_timer_value": {
        "xml": "<block type='get_project_timer_value'></block>",
        "class": "calc_timer",
        "isNotFor": [],
        "usage": ["timer"]
    },
    "reset_project_timer": {
        "xml": "<block type='reset_project_timer'></block>",
        "class": "calc_timer",
        "isNotFor": [],
        "usage": ["timer"]
    },
    "set_visible_project_timer": {
        "xml": "<block type='set_visible_project_timer'><field name='ACTION'>HIDE</field></block>",
        "class": "calc_timer",
        "isNotFor": [],
        "usage": ["timer"]
    },
    "variableAddButton": {
        "xml": "<btn text=\"Lang.Workspace.create_variable_block\" onclick=\"Entry.variableContainer.openVariableAddPanel('variable')\"> </btn>",
        "isNotFor": [],
        "class": "button"
    },
    "listAddButton": {
        "xml": "<btn text=\"Lang.Workspace.create_list_block\" onclick=\"Entry.variableContainer.openVariableAddPanel('list')\"></btn>",
        "isNotFor": [],
        "class": "button"
    },
    "ask_and_wait": {
        "xml": "<block type='ask_and_wait'> <value name='VALUE'> <block type='text'> <field name='NAME'>" + Lang.Blocks.block_hi + "</field> </block> </value> </block>",
        "class": "ask",
        "isNotFor": [],
        "usage": ["answer"]
    },
    "get_canvas_input_value": {
        "xml": "<block type='get_canvas_input_value'></block>",
        "class": "ask",
        "isNotFor": [],
        "usage": ["answer"]
    },
    "combine_something": {
        "xml": "<block type='combine_something'> <value name='VALUE1'> <block type='text'> <field name='NAME'>" + Lang.Blocks.block_hi + "</field> </block> </value> <value name='VALUE2'> <block type='text'> <field name='NAME'>" + Lang.Blocks.entry + "</field> </block> </value> </block>",
        "class": "calc_string",
        "isNotFor": [],
        "description": "입력한 두 개의 문자를 결합합니다."
    },
    "get_variable": {
        "xml": "<block type='get_variable'></block>",
        "class": "variable",
        "isNotFor": ["variable", "variableNotExist"],
        "usage": ["variable"]
    },
    "change_variable": {
        "xml": "<block type='change_variable'> <value name='VALUE'> <block type='text'> <field name='NAME'>10</field> </block> </value> </block>",
        "class": "variable",
        "isNotFor": ["variable", "variableNotExist"],
        "usage": ["variable"]
    },
    "set_variable": {
        "xml": "<block type='set_variable'> <value name='VALUE'> <block type='text'> <field name='NAME'>10</field> </block> </value> </block>",
        "class": "variable",
        "isNotFor": ["variable", "variableNotExist"],
        "usage": ["variable"]
    },
    "show_variable": {
        "xml": "<block type='show_variable'></block>",
        "class": "variable_visibility",
        "isNotFor": ["variable", "variableNotExist"],
        "usage": ["variable"]
    },
    "hide_variable": {
        "xml": "<block type='hide_variable'></block>",
        "class": "variable_visibility",
        "isNotFor": ["variable", "variableNotExist"],
        "usage": ["variable"]
    },
    "value_of_index_from_list": {
        "xml": "<block type='value_of_index_from_list'> <value name='INDEX'> <block type='number'><field name='NUM'>1</field></block> </value> </block>",
        "class": "list_element",
        "isNotFor": ["list", "listNotExist"],
        "usage": ["list"]
    },
    "add_value_to_list": {
        "xml": "<block type='add_value_to_list'> <value name='VALUE'> <block type='text'> <field name='NAME'>10</field> </block> </value> </block>",
        "class": "list",
        "isNotFor": ["list", "listNotExist"],
        "usage": ["list"]
    },
    "remove_value_from_list": {
        "xml": "<block type='remove_value_from_list'> <value name='VALUE'> <block type='number'><field name='NUM'>1</field></block> </value> </block>",
        "class": "list",
        "isNotFor": ["list", "listNotExist"],
        "usage": ["list"]
    },
    "insert_value_to_list": {
        "xml": "<block type='insert_value_to_list'> <value name='DATA'> <block type='text'> <field name='NAME'>10</field> </block> </value> <value name='INDEX'> <block type='text'><field name='NAME'>1</field></block> </value> </block>",
        "class": "list",
        "isNotFor": ["list", "listNotExist"],
        "usage": ["list"]
    },
    "change_value_list_index": {
        "xml": "<block type='change_value_list_index'> <value name='INDEX'> <block type='text'><field name='NAME'>1</field></block> </value> <value name='DATA'> <block type='text'> <field name='NAME'>10</field> </block> </value> </block>",
        "class": "list",
        "isNotFor": ["list", "listNotExist"],
        "usage": ["list"]
    },
    "length_of_list": {
        "xml": "<block type='length_of_list'></block>",
        "class": "list",
        "isNotFor": ["list", "listNotExist"],
        "usage": ["list"]
    },
    "show_list": {
        "xml": "<block type='show_list'></block>",
        "class": "list_visibility",
        "isNotFor": ["list", "listNotExist"],
        "usage": ["list"]
    },
    "hide_list": {
        "xml": "<block type='hide_list'></block>",
        "class": "list_visibility",
        "isNotFor": ["list", "listNotExist"],
        "usage": ["list"]
    },
    "text_write": {
        "xml": "<block type='text_write'><value name='VALUE'><block type='text'></block></value></block>",
        "class": "text",
        "isNotFor": ["sprite"],
        "usage": ["textbox"]
    },
    "text_append": {
        "xml": "<block type='text_append'><value name='VALUE'><block type='text'></block></value></block>",
        "class": "text",
        "isNotFor": ["sprite"],
        "usage": ["textbox"]
    },
    "text_prepend": {
        "xml": "<block type='text_prepend'><value name='VALUE'><block type='text'></block></value></block>",
        "class": "text",
        "isNotFor": ["sprite"],
        "usage": ["textbox"]
    },
    "text_flush": {
        "xml": "<block type='text_flush'></block>",
        "class": "text",
        "isNotFor": ["sprite"],
        "usage": ["textbox"]
    },
    "arduino_download_connector": {
        "xml": "<btn text=\"Lang.Blocks.ARDUINO_download_connector\" onclick=\"Entry.hw.downloadConnector()\"></btn>",
        "isNotFor": ["arduinoDisconnected"],
        "usage": ["arduino"],
        "class": "button"
    },
    "arduino_download_source": {
        "xml": "<btn text=\"Lang.Blocks.ARDUINO_download_source\" onclick=\"Entry.hw.downloadSource()\"></btn>",
        "isNotFor": ["arduinoDisconnected"],
        "usage": ["arduino"],
        "class": "button"
    },
    "arduino_reconnect": {
        "xml": "<btn text=\"Lang.Blocks.ARDUINO_reconnect\" onclick=\"Entry.hw.retryConnect()\"></btn>",
        "isNotFor": ["arduinoDisconnected"],
        "usage": ["arduino"],
        "class": "button"
    },
    "arduino_connected": {
        "xml": "<btn text=\"Lang.Blocks.ARDUINO_connected\" onclick=\"\"></btn>",
        "isNotFor": ["arduinoConnected"],
        "usage": ["arduino"],
        "class": "button"
    },
    "arduino_get_number_sensor_value": {
        "xml": "<block type='arduino_get_number_sensor_value'><value name='VALUE'><block type='arduino_get_sensor_number'></block></value></block>",
        "isNotFor": ['arduino'],
        "usage": ["arduino"],
        "class": "arduino_value"
    },
    "dplay_get_number_sensor_value": {
        "xml": "<block type='arduino_get_number_sensor_value'><value name='VALUE'><block type='arduino_get_sensor_number'></block></value></block>",
        "isNotFor": ['dplay'],
        "usage": ["arduino"],
        "class": "arduino_value"
    },
    "sensorBoard_get_number_sensor_value": {
        "xml": "<block type='arduino_get_number_sensor_value'><value name='VALUE'><block type='arduino_get_sensor_number'></block></value></block>",
        "isNotFor": ['sensorBoard'],
        "usage": ["arduino"],
        "class": "arduino_value"
    },
    "CODEino_get_number_sensor_value": {
        "xml": "<block type='arduino_get_number_sensor_value'><value name='VALUE'><block type='CODEino_get_sensor_number'></block></value></block>",
        "isNotFor": ['CODEino'],
        "usage": ["arduino"],
        "class": "arduino_value"
    },
    "arduino_get_digital_value": {
        "xml": "<block type='arduino_get_digital_value'><value name='VALUE'><block type='arduino_get_port_number'></block></value></block>",
        "isNotFor": ['arduino'],
        "usage": ["arduino"],
        "class": "arduino_value"
    },
    "dplay_get_digital_value": {
        "xml": "<block type='arduino_get_digital_value'><value name='VALUE'><block type='arduino_get_port_number'></block></value></block>",
        "isNotFor": ['dplay'],
        "usage": ["arduino"],
        "class": "arduino_value"
    },
    "sensorBoard_get_digital_value": {
        "xml": "<block type='arduino_get_digital_value'><value name='VALUE'><block type='arduino_get_port_number'></block></value></block>",
        "isNotFor": ['sensorBoard'],
        "usage": ["arduino"],
        "class": "arduino_value"
    },
    "CODEino_get_digital_value": {
        "xml": "<block type='arduino_get_digital_value'><value name='VALUE'><block type='arduino_get_port_number'></block></value></block>",
        "isNotFor": ['CODEino'],
        "usage": ["arduino"],
        "class": "arduino_value"
    },
    "arduino_toggle_led": {
        "xml": "<block type='arduino_toggle_led'><value name='VALUE'><block type='arduino_get_port_number'></block></value></block>",
        "isNotFor": ['arduino'],
        "usage": ["arduino"],
        "class": "arduino_set"
    },
    "dplay_toggle_led": {
        "xml": "<block type='arduino_toggle_led'><value name='VALUE'><block type='arduino_get_port_number'></block></value></block>",
        "isNotFor": ['dplay'],
        "usage": ["arduino"],
        "class": "arduino_set"
    },
    "sensorBoard_toggle_led": {
        "xml": "<block type='arduino_toggle_led'><value name='VALUE'><block type='arduino_get_port_number'></block></value></block>",
        "isNotFor": ['sensorBoard'],
        "usage": ["arduino"],
        "class": "arduino_set"
    },
    "CODEino_toggle_led": {
        "xml": "<block type='arduino_toggle_led'><value name='VALUE'><block type='arduino_get_port_number'></block></value></block>",
        "isNotFor": ['CODEino'],
        "usage": ["arduino"],
        "class": "arduino_set"
    },
    "arduino_toggle_pwm": {
        "xml": "<block type='arduino_toggle_pwm'><value name='PORT'><block type='arduino_get_pwm_port_number'></block></value><value name='VALUE'><block type='arduino_text'><field name='NAME'>255</field></block></value></block>",
        "isNotFor": ['arduino'],
        "usage": ["arduino"],
        "class": "arduino_set"
    },
    "dplay_toggle_pwm": {
        "xml": "<block type='arduino_toggle_pwm'><value name='PORT'><block type='arduino_get_pwm_port_number'></block></value><value name='VALUE'><block type='arduino_text'><field name='NAME'>255</field></block></value></block>",
        "isNotFor": ['dplay'],
        "usage": ["arduino"],
        "class": "arduino_set"
    },
    "sensorBoard_toggle_pwm": {
        "xml": "<block type='arduino_toggle_pwm'><value name='PORT'><block type='arduino_get_pwm_port_number'></block></value><value name='VALUE'><block type='arduino_text'><field name='NAME'>255</field></block></value></block>",
        "isNotFor": ['sensorBoard'],
        "usage": ["arduino"],
        "class": "arduino_set"
    },
    "CODEino_toggle_pwm": {
        "xml": "<block type='arduino_toggle_pwm'><value name='PORT'><block type='arduino_get_pwm_port_number'></block></value><value name='VALUE'><block type='arduino_text'><field name='NAME'>255</field></block></value></block>",
        "isNotFor": ['CODEino'],
        "usage": ["arduino"],
        "class": "arduino_set"
    },
    "arduino_convert_scale": {
        "xml": "<block type='arduino_convert_scale'><value name='VALUE1'><block type='arduino_get_number_sensor_value'><value name='VALUE'><block type='arduino_get_sensor_number'></block></value></block></value><value name='VALUE2'> <block type='number'><field name='NUM'>0</field></block> </value><value name='VALUE3'> <block type='number'><field name='NUM'>1023</field></block> </value><value name='VALUE4'> <block type='number'><field name='NUM'>0</field></block> </value><value name='VALUE5'> <block type='number'><field name='NUM'>100</field></block> </value></block>",
        "isNotFor": ['arduino'],
        "usage": ["arduino"],
        "class": "arduino"
    },
    "dplay_convert_scale": {
        "xml": "<block type='arduino_convert_scale'><value name='VALUE1'><block type='arduino_get_number_sensor_value'><value name='VALUE'><block type='arduino_get_sensor_number'></block></value></block></value><value name='VALUE2'> <block type='number'><field name='NUM'>0</field></block> </value><value name='VALUE3'> <block type='number'><field name='NUM'>1023</field></block> </value><value name='VALUE4'> <block type='number'><field name='NUM'>0</field></block> </value><value name='VALUE5'> <block type='number'><field name='NUM'>100</field></block> </value></block>",
        "isNotFor": ['dplay'],
        "usage": ["arduino"],
        "class": "arduino"
    },
    "sensorBoard_convert_scale": {
        "xml": "<block type='arduino_convert_scale'><value name='VALUE1'><block type='arduino_get_number_sensor_value'><value name='VALUE'><block type='arduino_get_sensor_number'></block></value></block></value><value name='VALUE2'> <block type='number'><field name='NUM'>0</field></block> </value><value name='VALUE3'> <block type='number'><field name='NUM'>1023</field></block> </value><value name='VALUE4'> <block type='number'><field name='NUM'>0</field></block> </value><value name='VALUE5'> <block type='number'><field name='NUM'>100</field></block> </value></block>",
        "isNotFor": ['sensorBoard'],
        "usage": ["arduino"],
        "class": "arduino"
    },
    "CODEino_convert_scale": {
        "xml": "<block type='arduino_convert_scale'><value name='VALUE1'><block type='arduino_get_number_sensor_value'><value name='VALUE'><block type='CODEino_get_sensor_number'></block></value></block></value><value name='VALUE2'> <block type='number'><field name='NUM'>0</field></block> </value><value name='VALUE3'> <block type='number'><field name='NUM'>1023</field></block> </value><value name='VALUE4'> <block type='number'><field name='NUM'>0</field></block> </value><value name='VALUE5'> <block type='number'><field name='NUM'>100</field></block> </value></block>",
        "isNotFor": ['CODEino'],
        "usage": ["arduino"],
        "class": "arduino"
    },
    "rotate_by_angle_dropdown": {
        "xml": "<block type='rotate_by_angle_dropdown'> <field name=\"VALUE\">45</field></block>",
        "xmls": [
            "<block type='rotate_by_angle_dropdown'> <field name=\"VALUE\">45</field></block>",
            "<block type='rotate_by_angle_dropdown'> <field name=\"VALUE\">90</field></block>",
            "<block type='rotate_by_angle_dropdown'> <field name=\"VALUE\">135</field></block>",
            "<block type='rotate_by_angle_dropdown'> <field name=\"VALUE\">180</field></block>",
        ],
        "isNotFor": [],
        "class": "ebs"
    },
    "rotate_by_angle": {
        "isNotFor": [],
        "xml": "<block type='rotate_by_angle'><value name=\"VALUE\"><block type=\"number\"><field name=\"NUM\">90</field></block></value></block>",
        "class": "rotate"
    },
    "rotate_by_angle_time": {
        "isNotFor": [],
        "xml": "<block type='rotate_by_angle_time'><value name=\"VALUE\"><block type=\"number\"><field name=\"NUM\">2</field></block></value></block>",
        "class": "rotate"
    },
    "rotate_direction": {
        "isNotFor": [],
        "xml": "<block type='rotate_direction'><value name=\"VALUE\"><block type=\"number\"><field name=\"NUM\">90</field></block></value></block>",
        "class": "rotate"
    },
    "see_angle_direction": {
        "isNotFor": [],
        "xml": "<block type='see_angle_direction'><value name=\"VALUE\"><block type=\"number\"><field name=\"NUM\">90</field></block></value></block>",
        "class": "rotate"
    },
    "see_angle": {
        "isNotFor": [],
        "xml": "<block type='see_angle'><value name=\"VALUE\"><block type=\"number\"><field name=\"NUM\">90</field></block></value></block>",
        "class": "rotate"
    },
    "sound_something": {
        "isNotFor": [],
        "xml": '<block type="sound_something"></block>',
        "class": "sound"
    },
    "sound_something_wait": {
        "isNotFor": [],
        "xml": '<block type="sound_something_wait"></block>',
        "class": "sound"
    },
    "sound_something_second_wait": {
        "isNotFor": [],
        "xml": '<block type="sound_something_second_wait"><value name="SECOND"><block type="number"><field name="NUM">1</field></block></value></block>',
        "class": "sound"
    },
    "sound_something_second": {
        "isNotFor": [],
        "xml": '<block type="sound_something_second"><value name="SECOND"><block type="number"><field name="NUM">1</field></block></value></block>',
        "class": "sound"
    },
    "boolean_equal": {
        "isNotFor": [],
        "xml": '<block type="boolean_equal"><value name="LEFTHAND"><block type="number"><field name="NUM">10</field></block></value><value name="RIGHTHAND"><block type="number"><field name="NUM">10</field></block></value></block>',
        "class": "boolean_compare"
    },
    "boolean_bigger": {
        "isNotFor": [],
        "xml": '<block type="boolean_bigger"><value name="LEFTHAND"><block type="number"><field name="NUM">10</field></block></value><value name="RIGHTHAND"><block type="number"><field name="NUM">10</field></block></value></block>',
        "class": "boolean_compare"
    },
    "boolean_smaller": {
        "isNotFor": [],
        "xml": '<block type="boolean_smaller"><value name="LEFTHAND"><block type="number"><field name="NUM">10</field></block></value><value name="RIGHTHAND"><block type="number"><field name="NUM">10</field></block></value></block>',
        "class": "boolean_compare"
    },
    "change_to_nth_shape": {
        "isNotFor": [],
        "xml": "<block type=\"change_to_nth_shape\"></block>",
        "class": "shape"
    },
    "ebs_if": {
        "isNotFor": [],
        "xml": "<block type='_if'><value name='BOOL'><block type='reach_something'><field name='VALUE'>wall</field></block></value></block>",
        "class": "condition"
    },
    "ebs_if2": {
        "isNotFor": [],
        "xml": "<block type='_if'><value name='BOOL'><block type='reach_something'><field name='VALUE'>cwz5</field></block></value></block>",
        "class": "condition"
    },
    "char_at": {
        "xml": "<block type='char_at'><value name='LEFTHAND'><block type='text'><field name='NAME'>" + Lang.Blocks.hi_entry + "</field></block></value><value name='RIGHTHAND'><block type='number'><field name='NUM'>1</field></block></value></block>",
        "class": "calc_string",
        "isNotFor": [],
        "usage": []
    },
    "length_of_string": {
        "xml": "<block type='length_of_string'><value name='STRING'><block type='text'><field name='NAME'>" + Lang.Blocks.entry + "</field></block></value></block>",
        "class": "calc_string",
        "isNotFor": [],
        "usage": []
    },
    "substring": {
        "xml": "<block type='substring'><value name='STRING'><block type='text'><field name='NAME'>" + Lang.Blocks.hi_entry + "</field></block></value><value name='START'><block type='number'><field name='NUM'>2</field></block></value><value name='END'><block type='number'><field name='NUM'>5</field></block></value></block>",
        "class": "calc_string",
        "isNotFor": [],
        "usage": []
    },
    "replace_string": {
        "xml": "<block type='replace_string'><value name='STRING'><block type='text'><field name='NAME'>" + Lang.Blocks.hi_entry + "</field></block></value><value name='OLD_WORD'><block type='text'><field name='NAME'>" + Lang.Blocks.hello + "</field></block></value><value name='NEW_WORD'><block type='text'><field name='NAME'>" + Lang.Blocks.nice + "</field></block></value></block>",
        "class": "calc_string",
        "isNotFor": [],
        "usage": []
    },
    "change_string_case": {
        "xml": "<block type='change_string_case'><value name='STRING'><block type='text'><field name='NAME'>" + Lang.Blocks.hi_entry + "</field></block></value></block>",
        "class": "calc_string",
        "isNotFor": [],
        "usage": []
    },
    "index_of_string": {
        "xml": "<block type='index_of_string'><value name='LEFTHAND'><block type='text'><field name='NAME'>" + Lang.Blocks.hi_entry + "</field></block></value><value name='RIGHTHAND'><block type='text'><field name='NAME'>" + Lang.Blocks.entry + "</field></block></value></block>",
        "class": "calc_string",
        "isNotFor": [],
        "usage": []
    },
    "neobot_sensor_value": {
        "isNotFor": ['neobot'],
        "xml": "<block type='neobot_sensor_value'></block>",
        "class": "neobot_value"
    },
    "neobot_turn_left": {
        "isNotFor": ['neobot'],
        "xml": "<block type='neobot_turn_left'></block>",
        "class": "neobot_motor"
    },
    "neobot_stop_left": {
        "isNotFor": ['neobot'],
        "xml": "<block type='neobot_stop_left'></block>",
        "class": "neobot_motor"
    },
    "neobot_turn_right": {
        "isNotFor": ['neobot'],
        "xml": "<block type='neobot_turn_right'></block>",
        "class": "neobot_motor"
    },
    "neobot_stop_right": {
        "isNotFor": ['neobot'],
        "xml": "<block type='neobot_stop_right'></block>",
        "class": "neobot_motor"
    },
    "neobot_run_motor": {
        "isNotFor": ['neobot'],
        "xml": "<block type='neobot_run_motor'><value name='DURATION'><block type='text'><field name='NAME'>1</field></block></value></block>",
        "class": "neobot_motor"
    },
    "neobot_servo_1": {
        "isNotFor": ['neobot'],
        "xml": "<block type='neobot_servo_1'></block>",
        "class": "neobot_servo"
    },
    "neobot_servo_2": {
        "isNotFor": ['neobot'],
        "xml": "<block type='neobot_servo_2'></block>",
        "class": "neobot_servo"
    },
    "neobot_play_note_for": {
        "isNotFor": ['neobot'],
        "xml": "<block type='neobot_play_note_for'></block>",
        "class": "neobot_note"
    },
    "neobot_set_sensor_value": {
        "isNotFor": ['neobot'],
        "xml": "<block type='neobot_set_sensor_value'></block>",
        "class": "neobot_set_value"
    },
    "bitbrick_sensor_value": {
        "isNotFor": ['bitbrick'],
        "xml": "<block type='bitbrick_sensor_value'></block>",
        "class": "condition"
    },
    "bitbrick_is_touch_pressed": {
        "isNotFor": ['bitbrick'],
        "xml": "<block type='bitbrick_is_touch_pressed'></block>",
        "class": "condition"
    },
    "bitbrick_turn_off_color_led": {
        "isNotFor": ['bitbrick'],
        "xml": "<block type='bitbrick_turn_off_color_led'></block>",
        "class": "condition"
    },
    "bitbrick_turn_on_color_led_by_rgb": {
        "isNotFor": ['bitbrick'],
        "xml": "<block type='bitbrick_turn_on_color_led_by_rgb'><value name='rValue'><block type='text'><field name='NAME'>255</field></block></value><value name='gValue'><block type='text'><field name='NAME'>255</field></block></value><value name='bValue'><block type='text'><field name='NAME'>255</field></block></value></block>",
        "class": "condition"
    },
    "bitbrick_turn_on_color_led_by_picker": {
        "isNotFor": ['bitbrick'],
        "xml": "<block type='bitbrick_turn_on_color_led_by_picker'></block>",
        "class": "condition"
    },
    "bitbrick_turn_on_color_led_by_value": {
        "isNotFor": ['bitbrick'],
        "xml": "<block type='bitbrick_turn_on_color_led_by_value'><value name='VALUE'><block type='text'><field name='NAME'>0</field></block></value></block>",
        "class": "condition"
    },
    "bitbrick_buzzer": {
        "isNotFor": ['bitbrick'],
        "xml": "<block type='bitbrick_buzzer'><value name='VALUE'><block type='text'><field name='NAME'>60</field></block></value></block>",
        "class": "condition"
    },
    "bitbrick_turn_off_all_motors": {
        "isNotFor": ['bitbrick'],
        "xml": "<block type='bitbrick_turn_off_all_motors'></block>",
        "class": "condition"
    },
    "bitbrick_dc_speed": {
        "isNotFor": ['bitbrick'],
        "xml": "<block type='bitbrick_dc_speed'><value name='VALUE'><block type='text'><field name='NAME'>60</field></block></value></block>",
        "class": "condition"
    },
    "bitbrick_dc_direction_speed": {
        "isNotFor": ['bitbrick'],
        "xml": "<block type='bitbrick_dc_direction_speed'><value name='VALUE'><block type='text'><field name='NAME'>100</field></block></value></block>",
        "class": "condition"
    },
    "bitbrick_servomotor_angle": {
        "isNotFor": ['bitbrick'],
        "xml": "<block type='bitbrick_servomotor_angle'><value name='VALUE'><block type='text'><field name='NAME'>100</field></block></value></block>",
        "class": "condition"
    },
    "bitbrick_convert_scale": {
        "isNotFor": ['bitbrick'],
        "xml": "<block type='bitbrick_convert_scale'><value name='VALUE2'> <block type='number'><field name='NUM'>0</field></block> </value><value name='VALUE3'> <block type='number'><field name='NUM'>1023</field></block> </value><value name='VALUE4'> <block type='number'><field name='NUM'>-100</field></block> </value><value name='VALUE5'> <block type='number'><field name='NUM'>100</field></block> </value></block>",
        "class": "condition"
    },
	"hamster_hand_found": {
        "isNotFor": ["hamster"],
        "xml": "<block type='hamster_hand_found'></block>",
        "class": "hamster_sensor"
    },
    "hamster_value": {
        "isNotFor": ["hamster"],
        "xml": "<block type='hamster_value'></block>",
        "class": "hamster_sensor"
    },
	"hamster_move_forward_once": {
        "isNotFor": ["hamster"],
        "xml": "<block type='hamster_move_forward_once'></block>",
        "class": "hamster_board"
    },
    "hamster_turn_once": {
        "isNotFor": ["hamster"],
        "xml": "<block type='hamster_turn_once'></block>",
        "class": "hamster_board"
    },
    "hamster_move_forward_for_secs": {
        "isNotFor": ["hamster"],
        "xml": "<block type='hamster_move_forward_for_secs'><value name='VALUE'><block type='text'><field name='NAME'>1</field></block></value></block>",
        "class": "hamster_wheel"
    },
    "hamster_move_backward_for_secs": {
        "isNotFor": ["hamster"],
        "xml": "<block type='hamster_move_backward_for_secs'><value name='VALUE'><block type='text'><field name='NAME'>1</field></block></value></block>",
        "class": "hamster_wheel"
    },
    "hamster_turn_for_secs": {
        "isNotFor": ["hamster"],
        "xml": "<block type='hamster_turn_for_secs'><value name='VALUE'><block type='text'><field name='NAME'>1</field></block></value></block>",
        "class": "hamster_wheel"
    },
	"hamster_change_both_wheels_by": {
        "isNotFor": ["hamster"],
        "xml": "<block type='hamster_change_both_wheels_by'><value name='LEFT'><block type='text'><field name='NAME'>10</field></block></value><value name='RIGHT'><block type='text'><field name='NAME'>10</field></block></value></block>",
        "class": "hamster_wheel"
    },
    "hamster_set_both_wheels_to": {
        "isNotFor": ["hamster"],
        "xml": "<block type='hamster_set_both_wheels_to'><value name='LEFT'><block type='text'><field name='NAME'>30</field></block></value><value name='RIGHT'><block type='text'><field name='NAME'>30</field></block></value></block>",
        "class": "hamster_wheel"
    },
    "hamster_change_wheel_by": {
        "isNotFor": ["hamster"],
        "xml": "<block type='hamster_change_wheel_by'><value name='VALUE'><block type='text'><field name='NAME'>10</field></block></value></block>",
        "class": "hamster_wheel"
    },
    "hamster_set_wheel_to": {
        "isNotFor": ["hamster"],
        "xml": "<block type='hamster_set_wheel_to'><value name='VALUE'><block type='text'><field name='NAME'>30</field></block></value></block>",
        "class": "hamster_wheel"
    },
	"hamster_follow_line_using": {
        "isNotFor": ["hamster"],
        "xml": "<block type='hamster_follow_line_using'></block>",
        "class": "hamster_wheel"
    },
	"hamster_follow_line_until": {
        "isNotFor": ["hamster"],
        "xml": "<block type='hamster_follow_line_until'></block>",
        "class": "hamster_wheel"
    },
	"hamster_set_following_speed_to": {
        "isNotFor": ["hamster"],
        "xml": "<block type='hamster_set_following_speed_to'><field name='SPEED'>5</field></block>",
        "class": "hamster_wheel"
    },
    "hamster_stop": {
        "isNotFor": ["hamster"],
        "xml": "<block type='hamster_stop'></block>",
        "class": "hamster_wheel"
    },
	"hamster_set_led_to": {
        "isNotFor": ["hamster"],
        "xml": "<block type='hamster_set_led_to'></block>",
        "class": "hamster_led"
    },
    "hamster_clear_led": {
        "isNotFor": ["hamster"],
        "xml": "<block type='hamster_clear_led'></block>",
        "class": "hamster_led"
    },
    "hamster_beep": {
        "isNotFor": ["hamster"],
        "xml": "<block type='hamster_beep'></block>",
        "class": "hamster_buzzer"
    },
	"hamster_change_buzzer_by": {
        "isNotFor": ["hamster"],
        "xml": "<block type='hamster_change_buzzer_by'><value name='VALUE'><block type='text'><field name='NAME'>10</field></block></value></block>",
        "class": "hamster_buzzer"
    },
    "hamster_set_buzzer_to": {
        "isNotFor": ["hamster"],
        "xml": "<block type='hamster_set_buzzer_to'><value name='VALUE'><block type='text'><field name='NAME'>1000</field></block></value></block>",
        "class": "hamster_buzzer"
    },
    "hamster_clear_buzzer": {
        "isNotFor": ["hamster"],
        "xml": "<block type='hamster_clear_buzzer'></block>",
        "class": "hamster_buzzer"
    },
    "hamster_play_note_for": {
        "isNotFor": ["hamster"],
        "xml": "<block type='hamster_play_note_for'><field name='OCTAVE'>4</field><value name='VALUE'><block type='text'><field name='NAME'>0.5</field></block></value></block>",
        "class": "hamster_buzzer"
    },
    "hamster_rest_for": {
        "isNotFor": ["hamster"],
        "xml": "<block type='hamster_rest_for'><value name='VALUE'><block type='text'><field name='NAME'>0.25</field></block></value></block>",
        "class": "hamster_buzzer"
    },
    "hamster_change_tempo_by": {
        "isNotFor": ["hamster"],
        "xml": "<block type='hamster_change_tempo_by'><value name='VALUE'><block type='text'><field name='NAME'>20</field></block></value></block>",
        "class": "hamster_buzzer"
    },
    "hamster_set_tempo_to": {
        "isNotFor": ["hamster"],
        "xml": "<block type='hamster_set_tempo_to'><value name='VALUE'><block type='text'><field name='NAME'>60</field></block></value></block>",
        "class": "hamster_buzzer"
    },
    "hamster_set_port_to": {
        "isNotFor": ["hamster"],
        "xml": "<block type='hamster_set_port_to'></block>",
        "class": "hamster_port"
    },
    "hamster_change_output_by": {
        "isNotFor": ["hamster"],
        "xml": "<block type='hamster_change_output_by'><value name='VALUE'><block type='text'><field name='NAME'>10</field></block></value></block>",
        "class": "hamster_port"
    },
    "hamster_set_output_to": {
        "isNotFor": ["hamster"],
        "xml": "<block type='hamster_set_output_to'><value name='VALUE'><block type='text'><field name='NAME'>100</field></block></value></block>",
        "class": "hamster_port"
    },

	"albert_hand_found": {
        "isNotFor": ["albert"],
        "xml": "<block type='albert_hand_found'></block>",
        "class": "albert_sensor"
    },
	"albert_value": {
        "isNotFor": ["albert"],
        "xml": "<block type='albert_value'></block>",
        "class": "albert_sensor"
    },
	"albert_move_forward_for_secs": {
        "isNotFor": ["albert"],
        "xml": "<block type='albert_move_forward_for_secs'><value name='VALUE'><block type='text'><field name='NAME'>1</field></block></value></block>",
        "class": "albert_wheel"
    },
    "albert_move_backward_for_secs": {
        "isNotFor": ["albert"],
        "xml": "<block type='albert_move_backward_for_secs'><value name='VALUE'><block type='text'><field name='NAME'>1</field></block></value></block>",
        "class": "albert_wheel"
    },
    "albert_turn_for_secs": {
        "isNotFor": ["albert"],
        "xml": "<block type='albert_turn_for_secs'><value name='VALUE'><block type='text'><field name='NAME'>1</field></block></value></block>",
        "class": "albert_wheel"
    },
	"albert_change_both_wheels_by": {
        "isNotFor": ["albert"],
        "xml": "<block type='albert_change_both_wheels_by'><value name='LEFT'><block type='text'><field name='NAME'>10</field></block></value><value name='RIGHT'><block type='text'><field name='NAME'>10</field></block></value></block>",
        "class": "albert_wheel"
    },
    "albert_set_both_wheels_to": {
        "isNotFor": ["albert"],
        "xml": "<block type='albert_set_both_wheels_to'><value name='LEFT'><block type='text'><field name='NAME'>30</field></block></value><value name='RIGHT'><block type='text'><field name='NAME'>30</field></block></value></block>",
        "class": "albert_wheel"
    },
    "albert_change_wheel_by": {
        "isNotFor": ["albert"],
        "xml": "<block type='albert_change_wheel_by'><value name='VALUE'><block type='text'><field name='NAME'>10</field></block></value></block>",
        "class": "albert_wheel"
    },
    "albert_set_wheel_to": {
        "isNotFor": ["albert"],
        "xml": "<block type='albert_set_wheel_to'><value name='VALUE'><block type='text'><field name='NAME'>30</field></block></value></block>",
        "class": "albert_wheel"
    },
    "albert_stop": {
        "isNotFor": ["albert"],
        "xml": "<block type='albert_stop'></block>",
        "class": "albert_wheel"
    },
	"albert_set_pad_size_to": {
        "isNotFor": ["albert"],
        "xml": "<block type='albert_set_pad_size_to'><value name='WIDTH'><block type='text'><field name='NAME'>108</field></block></value><value name='HEIGHT'><block type='text'><field name='NAME'>76</field></block></value></block>",
        "class": "albert_wheel"
    },
    "albert_set_eye_to": {
        "isNotFor": ["albert"],
        "xml": "<block type='albert_set_eye_to'></block>",
        "class": "albert_led"
    },
    "albert_clear_eye": {
        "isNotFor": ["albert"],
        "xml": "<block type='albert_clear_eye'></block>",
        "class": "albert_led"
    },
    "albert_body_led": {
        "isNotFor": ["albert"],
        "xml": "<block type='albert_body_led'></block>",
        "class": "albert_led"
    },
    "albert_front_led": {
        "isNotFor": ["albert"],
        "xml": "<block type='albert_front_led'></block>",
        "class": "albert_led"
    },
    "albert_beep": {
        "isNotFor": ["albert"],
        "xml": "<block type='albert_beep'></block>",
        "class": "albert_buzzer"
    },
	"albert_change_buzzer_by": {
        "isNotFor": ["albert"],
        "xml": "<block type='albert_change_buzzer_by'><value name='VALUE'><block type='text'><field name='NAME'>10</field></block></value></block>",
        "class": "albert_buzzer"
    },
    "albert_set_buzzer_to": {
        "isNotFor": ["albert"],
        "xml": "<block type='albert_set_buzzer_to'><value name='VALUE'><block type='text'><field name='NAME'>1000</field></block></value></block>",
        "class": "albert_buzzer"
    },
    "albert_clear_buzzer": {
        "isNotFor": ["albert"],
        "xml": "<block type='albert_clear_buzzer'></block>",
        "class": "albert_buzzer"
    },
    "albert_play_note_for": {
        "isNotFor": ["albert"],
        "xml": "<block type='albert_play_note_for'><field name='OCTAVE'>4</field><value name='VALUE'><block type='text'><field name='NAME'>0.5</field></block></value></block>",
        "class": "albert_buzzer"
    },
    "albert_rest_for": {
        "isNotFor": ["albert"],
        "xml": "<block type='albert_rest_for'><value name='VALUE'><block type='text'><field name='NAME'>0.25</field></block></value></block>",
        "class": "albert_buzzer"
    },
    "albert_change_tempo_by": {
        "isNotFor": ["albert"],
        "xml": "<block type='albert_change_tempo_by'><value name='VALUE'><block type='text'><field name='NAME'>20</field></block></value></block>",
        "class": "albert_buzzer"
    },
    "albert_set_tempo_to": {
        "isNotFor": ["albert"],
        "xml": "<block type='albert_set_tempo_to'><value name='VALUE'><block type='text'><field name='NAME'>60</field></block></value></block>",
        "class": "albert_buzzer"
    },
    "sensorBoard_get_named_sensor_value": {
        "xml": "<block type='sensorBoard_get_named_sensor_value'></block>",
        "isNotFor": ['sensorBoard'],
        "usage": ["arduino"],
        "class": "sensorBoard"
    },
    "sensorBoard_is_button_pressed": {
        "isNotFor": ["sensorBoard"],
        "xml": "<block type='sensorBoard_is_button_pressed'></block>",
        "class": "sensorBoard"
    },
    "sensorBoard_led": {
        "isNotFor": ["sensorBoard"],
        "xml": "<block type='sensorBoard_led'></block>",
        "class": "sensorBoard"
    },
    "CODEino_get_named_sensor_value": {
        "xml": "<block type='CODEino_get_named_sensor_value'></block>",
        "isNotFor": ['CODEino'],
        "usage": ["arduino"],
        "class": "CODEino"
    },
    "CODEino_get_sound_status": {
        "xml": "<block type='CODEino_get_sound_status'></block>",
        "isNotFor": ["CODEino"],
        "usage": ["arduino"],
        "class": "CODEino"
    },
    "CODEino_get_light_status": {
        "xml": "<block type='CODEino_get_light_status'></block>",
        "isNotFor": ["CODEino"],
        "usage": ["arduino"],
        "class": "CODEino"
    },
    "CODEino_is_button_pressed": {
        "xml": "<block type='CODEino_is_button_pressed'></block>",
        "isNotFor": ["CODEino"],
        "usage": ["arduino"],
        "class": "CODEino"
    },
    "CODEino_get_accelerometer_direction": {
        "xml": "<block type='CODEino_get_accelerometer_direction'></block>",
        "isNotFor": ["CODEino"],
        "usage": ["arduino"],
        "class": "CODEino"
    },
    "CODEino_get_accelerometer_value": {
        "xml": "<block type='CODEino_get_accelerometer_value'></block>",
        "isNotFor": ["CODEino"],
        "usage": ["arduino"],
        "class": "CODEino"
    },
    "direction_relative_duration": {
        "isNotFor": [""],
        "xml": "<block type='direction_relative_duration'><value name='DURATION'><block type='text'><field name='NAME'>2</field></block></value><value name='AMOUNT'><block type='angle'></block></value></block>",
        "class": "rotate"
    },
    "get_sound_volume": {
        "isNotFor": [""],
        "xml": "<block type='get_sound_volume'></block>",
        "class": "calc"
    },
    "sound_from_to": {
        "isNotFor": [""],
        "xml": "<block type='sound_from_to'><value name='VALUE'><block type='get_sounds'></block></value><value name='START'><block type='text'><field name='NAME'>1</field></block></value><value name='END'><block type='text'><field name='NAME'>10</field></block></value></block>",
        "class": "sound_play"
    },
    "sound_from_to_and_wait": {
        "isNotFor": [""],
        "xml": "<block type='sound_from_to_and_wait'><value name='VALUE'><block type='get_sounds'></block></value><value name='START'><block type='text'><field name='NAME'>1</field></block></value><value name='END'><block type='text'><field name='NAME'>10</field></block></value></block>",
        "class": "sound_wait"
    },
    "quotient_and_mod": {
        "isNotFor": [""],
        "xml": "<block type='quotient_and_mod'><value name='LEFTHAND'><block type='text'><field name='NAME'>10</field></block></value><value name='RIGHTHAND'><block type='text'><field name='NAME'>10</field></block></value></block>",
        //"xmls": [
            //"<block type='quotient_and_mod'><value name='LEFTHAND'><block type='text'><field name='NAME'>10</field></block></value><value name='RIGHTHAND'><block type='text'><field name='NAME'>10</field></block></value><field name='OPERATOR'>QUOTIENT</field></block>",
            //"<block type='quotient_and_mod'><value name='LEFTHAND'><block type='text'><field name='NAME'>10</field></block></value><value name='RIGHTHAND'><block type='text'><field name='NAME'>10</field></block></value><field name='OPERATOR'>MOD</field></block>"
        //],
        "class": "calc"
    },
    "set_visible_answer": {
        "isNotFor": [""],
        "xml": "<block type='set_visible_answer'><field name='BOOL'>HIDE</field></block>",
        "class": "ask"
    },
    "choose_project_timer_action": {
        "isNotFor": [""],
        "xml": "<block type='choose_project_timer_action'><field name='ACTION'>START</field></block>",
        "class": "calc_timer"
    },
    "robotis_openCM70_cm_buzzer_index": {
        "isNotFor": ['robotis_openCM70'],
        "xml": "<block type='robotis_openCM70_cm_buzzer_index'><value name='CM_BUZZER_TIME'><block type='number'><field name='NUM'>1</field></block></value></block>",
        "class": "robotis_openCM70_cm"
    },
    "robotis_openCM70_cm_buzzer_melody": {
        "isNotFor": ['robotis_openCM70'],
        "xml": "<block type='robotis_openCM70_cm_buzzer_melody'></block>",
        "class": "robotis_openCM70_cm"
    },
    "robotis_openCM70_cm_sound_detected_clear": {
        "isNotFor": ['robotis_openCM70'],
        "xml": "<block type='robotis_openCM70_cm_sound_detected_clear'></block>",
        "class": "robotis_openCM70_cm"
    },
    "robotis_openCM70_sensor_value": {
        "isNotFor": ['robotis_openCM70'],
        "xml": "<block type='robotis_openCM70_sensor_value'></block>",
        "class": "robotis_openCM70_cm"
    },
    "robotis_openCM70_aux_sensor_value": {
        "isNotFor": ['robotis_openCM70'],
        "xml": "<block type='robotis_openCM70_aux_sensor_value'></block>",
        "class": "robotis_openCM70_cm"
    },
    "robotis_openCM70_cm_led": {
        "isNotFor": ['robotis_openCM70'],
        "xml": "<block type='robotis_openCM70_cm_led'></block>",
        "class": "robotis_openCM70_cm"
    },
    "robotis_openCM70_cm_motion": {
        "isNotFor": ['robotis_openCM70'],
        "xml": "<block type='robotis_openCM70_cm_motion'><value name='VALUE'><block type='number'><field name='NUM'>1</field></block></value></block>",
        "class": "robotis_openCM70_cm"
    },
    "robotis_openCM70_aux_motor_speed": {
        "isNotFor": ['robotis_openCM70'],
        "xml": "<block type='robotis_openCM70_aux_motor_speed'><value name='VALUE'><block type='number'><field name='NUM'>500</field></block></value></block>",
        "class": "robotis_openCM70_cm"
    },
    "robotis_openCM70_aux_servo_mode": {
        "isNotFor": ['robotis_openCM70'],
        "xml": "<block type='robotis_openCM70_aux_servo_mode'></block>",
        "class": "robotis_openCM70_cm"
    },
    "robotis_openCM70_aux_servo_speed": {
        "isNotFor": ['robotis_openCM70'],
        "xml": "<block type='robotis_openCM70_aux_servo_speed'><value name='VALUE'><block type='number'><field name='NUM'>500</field></block></value></block>",
        "class": "robotis_openCM70_cm"
    },
    "robotis_openCM70_aux_servo_position": {
        "isNotFor": ['robotis_openCM70'],
        "xml": "<block type='robotis_openCM70_aux_servo_position'><value name='VALUE'><block type='number'><field name='NUM'>512</field></block></value></block>",
        "class": "robotis_openCM70_cm"
    },
    "robotis_openCM70_aux_led_module": {
        "isNotFor": ['robotis_openCM70'],
        "xml": "<block type='robotis_openCM70_aux_led_module'></block>",
        "class": "robotis_openCM70_cm"
    },
    "robotis_openCM70_aux_custom": {
        "isNotFor": ['robotis_openCM70'],
        "xml": "<block type='robotis_openCM70_aux_custom'><value name='VALUE'><block type='number'><field name='NUM'>0</field></block></value></block>",
        "class": "robotis_openCM70_cm"
    },
    "robotis_openCM70_cm_custom_value": {
        "isNotFor": ['robotis_openCM70'],
        "xml": "<block type='robotis_openCM70_cm_custom_value'><value name='VALUE'><block type='number'><field name='NUM'>0</field></block></value></block>",
        "class": "robotis_openCM70_custom"
    },
    "robotis_openCM70_cm_custom": {
        "isNotFor": ['robotis_openCM70'],
        "xml": "<block type='robotis_openCM70_cm_custom'><value name='ADDRESS'><block type='number'><field name='NUM'>0</field></block></value><value name='VALUE'><block type='number'><field name='NUM'>0</field></block></value></block>",
        "class": "robotis_openCM70_custom"
    },
    "robotis_carCont_sensor_value": {
        "isNotFor": ['robotis_carCont'],
        "xml": "<block type='robotis_carCont_sensor_value'></block>",
        "class": "robotis_carCont_cm"
    },
    "robotis_carCont_cm_led": {
        "isNotFor": ['robotis_carCont'],
        "xml": "<block type='robotis_carCont_cm_led'></block>",
        "class": "robotis_carCont_cm"
    },
    "robotis_carCont_cm_sound_detected_clear": {
        "isNotFor": ['robotis_carCont'],
        "xml": "<block type='robotis_carCont_cm_sound_detected_clear'></block>",
        "class": "robotis_carCont_cm"
    },
    "robotis_carCont_aux_motor_speed": {
        "isNotFor": ['robotis_carCont'],
        "xml": "<block type='robotis_carCont_aux_motor_speed'><value name='VALUE'><block type='number'><field name='NUM'>500</field></block></value></block>",
        "class": "robotis_carCont_cm"
    },
    "robotis_carCont_cm_calibration": {
        "isNotFor": ['robotis_carCont'],
        "xml": "<block type='robotis_carCont_cm_calibration'><value name='VALUE'><block type='number'><field name='NUM'>0</field></block></value></block>",
        "class": "robotis_carCont_cm"
    },
}

EntryStatic.discussCategories = [
   // 'notice',
   'qna',
   'tips',
    'free',
   'report',
   'notice'
];

EntryStatic.artCategories = [
    {
        'key':'art_category_',
        'lang':'art_category_all',
        'value': ''
    },
    {
        'key':'art_category_게임',
        'lang':'art_category_game',
        'value': '게임'
    },
    {
        'key':'art_category_애니메이션',
        'lang':'art_category_animation',
        'value':'애니메이션'
    },
    {
        'key':'art_category_미디어아트',
        'lang':'art_category_media',
        'value': '미디어아트'
    },
    {
        'key':'art_category_피지컬',
        'lang':'art_category_physical',
        'value': '피지컬'
    },
    {
        'key':'art_category_기타',
        'lang':'art_category_etc',
        'value': '기타'
    }
]

EntryStatic.artSortOptions = [
    {
        'key':'art_sort_updated',
        'lang':'art_sort_updated',
        'value': 'updated'
    },
    {
        'key':'art_sort_visit',
        'lang':'art_sort_visit',
        'value': 'visit'
    },
    {
        'key':'art_sort_likeCnt',
        'lang':'art_sort_likeCnt',
        'value': 'likeCnt'
    },
    {
        'key':'art_sort_comment',
        'lang':'art_sort_comment',
        'value': 'comment'
    },
]

EntryStatic.discussSortOptions = [
    {
        'lang':'discuss_sort_created',
        'value': 'created'
    },
    {
        'lang':'discuss_sort_visit',
        'value': 'visit'
    },
    {
        'lang':'discuss_sort_likesLength',
        'value': 'likesLength'
    },
    {
        'lang':'discuss_sort_commentsLength',
        'value': 'commentsLength'
    },
]
EntryStatic.discussPeriodOptions = [
    {
        'key':'discuss_period_',
        'lang':'discuss_period_all',
        'value': ''
    },
    {
        'key':'discuss_period_1',
        'lang':'discuss_period_day',
        'value': '1'
    },
    {
        'key':'discuss_period_7',
        'lang':'discuss_period_week',
        'value': '7'
    },
    {
        'key':'discuss_period_30',
        'lang':'discuss_period_month',
        'value': '30'
    },
    {
        'key':'discuss_period_90',
        'lang':'discuss_period_three_month',
        'value': '90'
    },
]


EntryStatic.artPeriodOptions = [
    {
        'key':'art_period_',
        'lang':'art_period_all',
        'value': ''
    },
    {
        'key':'art_period_1',
        'lang':'art_period_day',
        'value': '1'
    },
    {
        'key':'art_period_7',
        'lang':'art_period_week',
        'value': '7'
    },
    {
        'key':'art_period_30',
        'lang':'art_period_month',
        'value': '30'
    },
    {
        'key':'art_period_90',
        'lang':'art_period_three_month',
        'value': '90'
    }
]

EntryStatic.getCategoryByBlock = function(blockName) {
    if (!blockName)
        return false;
    var allBlocks = EntryStatic.getAllBlocks();
    for (var i=0,len=allBlocks.length; i<len; i++) {
        var blocks = allBlocks[i].blocks;
        if (blocks.indexOf(blockName) > -1) {
            return allBlocks[i].category;
        }
    }
    return false;
}

// for server node js code
if (typeof exports == "object") {
    exports.blockInfo = EntryStatic.blockInfo;
    exports.getAllBlocks = EntryStatic.getAllBlocks;
    exports.getCategoryByBlock = EntryStatic.getCategoryByBlock;
}


EntryStatic.objectMainCategories = ['entrybot_friends', 'people', 'animal', 'plant', 'vehicles',
                'architect', 'food', 'environment', 'stuff', 'fantasy', 'interface',
                'background'];

EntryStatic.objectSubCategories = {
    'entrybot_friends': [],
    'people': [],
    'animal': ['animal_flying', 'animal_land', 'animal_water', 'animal_others'],
    'plant': ['plant_flower', 'plant_grass', 'plant_tree', 'plant_others'],
    'vehicles': ['vehicles_flying', 'vehicles_land', 'vehicles_water', 'vehicles_others'],
    'architect': ['architect_building', 'architect_monument', 'architect_others'],
    'food': ['food_vegetables', 'food_meat', 'food_drink', 'food_others'],
    'environment': ['environment_nature', 'environment_space', 'environment_others'],
    'stuff': ['stuff_living', 'stuff_hobby', 'stuff_others'],
    'fantasy': [],
    'interface': [],
    'background': ['background_outdoor', 'background_indoor', 'background_nature', 'background_others']
};

EntryStatic.fonts = [
{
    name: '바탕체',
    family: 'KoPub Batang',
    url: '/css/kopubbatang.css'
},
{
    name: '명조체',
    family: 'Nanum Myeongjo',
    url: '/css/nanummyeongjo.css'
},
{
    name: '고딕체',
    family: 'Nanum Gothic',
    url: '/css/nanumgothic.css'
},
{
    name: '필기체',
    family: 'Nanum Pen Script',
    url: '/css/nanumpenscript.css'
},
{
    name: '한라산체',
    family: 'Jeju Hallasan',
    url: '/css/jejuhallasan.css'
},
{
    name: '코딩고딕체',
    family: 'Nanum Gothic Coding',
    url: '/css/nanumgothiccoding.css'
}
];

EntryStatic.getName = function(str, type) {
    var dict = SpriteNames;
    if (type == 'picture')
        dict = PictureNames;
    else if (type == 'sound')
        dict = SoundNames;

    var lang = navigator.language ? navigator.language : 'ko';
    if (window.lang)
        lang = window.lang;

    if (window.user && window.user.language)
        lang = window.user.language;

    if (!dict || lang == 'ko' || lang == 'code') {
        return str;
    } else {
        return dict[str] ? dict[str] : str;
    }
};
