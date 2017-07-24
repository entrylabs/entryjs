
/*
 *
 */
"use strict";

goog.provide("Entry.CodeMap");

Entry.CodeMap = {};

(function(cc) {
    cc.Entry = {
        start_neighbor_scene: [
            {"다음": "next", "이전": "pre"} 
        ],
        stop_object: [
            {"thisOnly": "self", "thisThread": "this", "otherThread": "others",
             "self": "thisOnly", "this": "thisThread", "others": "otherThread",
             "모든": "all", "자신": "thisOnly", "이": "thisThread", "자신의 다른": "otherThread"}
        ],
        change_to_next_shape: [
            {"prev": "pre", "pre": "prev", "다음": "next", "이전": "prev"}
        ],
        add_effect_amount: [
            {"색깔": "color", "밝기": "brightness", "투명도": "transparency"}
        ],
        change_effect_amount: [
            {"색깔": "color", "밝기": "brightness", "투명도": "transparency"}  
        ],
        change_object_index: [
            {"front": "FRONT", "forward": "FORWARD", "backward": "BACKWARD", "back": "BACK", 
            "맨 앞": "FRONT", "앞": "FORWARD", "뒤": "BACKWARD", "맨 뒤": "BACK"}
        ],
        set_color: [
            {"red": "#FF0000", "orange": "#FF9966", "yellow": "#FFFF66", "green": "#009900", 
             "blue": "#3333FF", "navy": "#000099", "purple": "#993399", "black": "#000000", 
             "white": "#FFFFFF", "brown": "#990000"}
        ],
        reach_something: [
            null, 
            {"mouse": "mouse_pointer", "wall":"edge", "wall_up":"edge_up", 
            "wall_down":"edge_down", "wall_right":"edge_right", "wall_left":"edge_left",
            "mouse_pointer": "mouse", "edge":"wall", "edge_up":"wall_up", "edge_down":"wall_down", 
            "edge_right":"wall_right", "edge_left":"wall_left", "마우스포인터":"mouse"}, 
            null
        ],
        create_clone: [
            {"자신": "self", "self": "self"} 
        ],
        locate: [
            {"mouse": "mouse_pointer", "mouse_pointer": "mouse", "마우스포인터": "mouse"}
        ],
        locate_object_time: [
            null,
            {"mouse": "mouse_pointer", "mouse_pointer": "mouse", "마우스포인터": "mouse"}
        ],
        see_angle_object: [
            {"mouse": "mouse_pointer", "mouse_pointer": "mouse", "마우스포인터": "mouse"}
        ],
        coordinate_mouse: [
            null,
            {"X":"x", "Y":"y"},
            null
        ],
        coordinate_object: [
            null,
            {"자신": "self", "self": "self"}, 
            null,
            {"크기":"size", "방향":"rotation", "이동 방향":"direction", 
            "모양 번호":"picture_index", "모양 이름":"picture_name", 
            "picture_index":"shape_number", "picture_name":"shape_name",
            "shape_number":"picture_index", "shape_name":"picture_name"
            } 
        ],
        choose_project_timer_action: [
            null,
            {"start":"START", "stop":"STOP", "reset":"RESET"}
        ],
        set_visible_project_timer: [
            null,
            {"show":"SHOW", "hide":"HIDE"}
        ],
        get_date: [
            null,
            {"year":"YEAR", "month":"MONTH", "day":"DAY", "hour":"HOUR", "minute":"MINUTE", "second":"SECOND"}
        ],
        distance_something: [
            null,
            {"mouse": "mouse_pointer", "mouse_pointer": "mouse", "마우스포인터": "mouse"}
        ],
        set_visible_answer: [
            {"show": "SHOW", "hide": "HIDE"}
        ]
    };

    cc.Arduino = {
        arduino_ext_analog_list: [
            {"a0":"0", "a1":"1", "a2":"2", "a3":"3", "a4":"4", "a5":"5"}
        ],
        arduino_get_digital_toggle: [
            {"on":"high", "off":"low", "high":"on", "low":"off"}
        ]
    };

    cc.Hamster = {
        hamster_play_note_for: [
            {
                4: "hamster.note_c",
                5: "hamster.note_c_sharp",
                6: "hamster.note_d",
                7: "hamster.note_e_flat",
                8: "hamster.note_e",
                9: "hamster.note_f",
                10: "hamster.note_f_sharp",
                11: "hamster.note_g",
                12: "hamster.note_g_sharp",
                13: "hamster.note_a",
                14: "hamster.note_b_flat",
                15: "hamster.note_b",
                "hamster.note_c": 4,
                "hamster.note_c_sharp": 5,
                "hamster.note_d_flat": 5,
                "hamster.note_d": 6,
                "hamster.note_e_flat": 7,
                "hamster.note_d_sharp": 7,
                "hamster.note_e": 8,
                "hamster.note_f": 9,
                "hamster.note_f_sharp": 10,
                "hamster.note_g_flat": 10,
                "hamster.note_g": 11,
                "hamster.note_g_sharp": 12,
                "hamster.note_a_flat": 12,
                "hamster.note_a": 13,
                "hamster.note_b_flat": 14,
                "hamster.note_a_sharp": 14,
                "hamster.note_b": 15
            },
            null,
            null
        ]
    };
})(Entry.CodeMap);




