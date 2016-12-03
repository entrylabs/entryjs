
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
            "edge_right":"wall_right", "edge_left":"edge_left"}, 
            null
        ],
        create_clone: [
            {"자신": "self"} 
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
        coordinate_object: [
            null,
            null,
            null,
            {"자신": "self", "크기":"size", "방향":"rotation", "이동 방향":"direction", 
            "모양 번호":"picture_index", "모양 이름":"picutre_name", 
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
        arduino_ext_toggle_led: [
            null,
            {"on":"HIGH", "off":"LOW", "high":"on", "low":"off"}
        ],
        arduino_ext_analog_list: [
            {"a0":"0", "a1":"1", "a2":"2", "a3":"3", "a4":"4", "a5":"5"}
        ]
    };

    cc.Hamster = {
        hamster_play_note_for: [
            {
                4: "Hamster.NOTE_C",
                5: "Hamster.NOTE_C_SHARP",
                6: "Hamster.NOTE_D",
                7: "Hamster.NOTE_E_FLAT",
                8: "Hamster.NOTE_E",
                9: "Hamster.NOTE_F",
                10: "Hamster.NOTE_F_SHARP",
                11: "Hamster.NOTE_G",
                12: "Hamster.NOTE_G_SHARP",
                13: "Hamster.NOTE_A",
                14: "Hamster.NOTE_B_FLAT",
                15: "Hamster.NOTE_B",
                "Hamster.NOTE_C": 4,
                "Hamster.NOTE_C_SHARP": 5,
                "Hamster.NOTE_D_FLAT": 5,
                "Hamster.NOTE_D": 6,
                "Hamster.NOTE_E_FLAT": 7,
                "Hamster.NOTE_D_SHARP": 7,
                "Hamster.NOTE_E": 8,
                "Hamster.NOTE_F": 8,
                "Hamster.NOTE_F": 9,
                "Hamster.NOTE_F_SHARP": 10,
                "Hamster.NOTE_G_FLAT": 10,
                "Hamster.NOTE_G": 11,
                "Hamster.NOTE_G_SHARP": 12,
                "Hamster.NOTE_A_FLAT": 12,
                "Hamster.NOTE_A": 13,
                "Hamster.NOTE_B_FLAT": 14,
                "Hamster.NOTE_A_SHARP": 14,
                "Hamster.NOTE_B": 15
            },
            null,
            null
        ]
    };
})(Entry.CodeMap);




