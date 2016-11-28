
/*
 *
 */
"use strict";

goog.provide("Entry.CodeMap");

Entry.CodeMap = {};

(function(cc) {
    cc.Entry = {
        start_scene_to: [
            {"다음": "next", "이전": "pre"}
        ],
        stop_code: [
            {"thisOnly": "self", "thisThread": "this", "otherThread": "others",
             "self": "thisOnly", "this": "thisThread", "others": "otherThread",
             "모든": "all", "자신": "thisOnly", "이": "thisThread", "자신의 다른": "otherThread"}
        ],
        change_shape_to: [
            {"prev": "pre", "pre": "prev", "다음": "next", "이전": "prev"}
        ],
        add_effect: [
            {"색깔": "color", "밝기": "brightness", "투명도": "transparency"}
        ],
        set_effect: [
            {"색깔": "color", "밝기": "brightness", "투명도": "transparency"}
        ],
        send_layer_to: [
            {"front": "FRONT", "forward": "FORWARD", "backward": "BACKWARD", "back": "BACK", 
            "맨 앞": "FRONT", "앞": "FORWARD", "뒤": "BACKWARD", "맨 뒤": "BACK"}
        ],
        set_brush_color_to: [
            {"red": "#FF0000", "orange": "#FF0000", "yellow": "#FF0000", "green": "#FF0000", 
             "blue": "#FF0000", "navy": "#FF0000", "purple": "#FF0000", "black": "#FF0000", 
             "white": "#FF0000", "brown": "#FF0000"}
        ]
    };

    cc.Arduino = {
        digitalWrite: [
            null,
            {"on":"HIGH", "off":"LOW", "high":"on", "low":"off"}
        ], 
        analogRead: [
            {"A0":"0", "A1":"1", "A2":"2", "A3":"3", "A4":"4", "A5":"5"}
        ]
    };

    cc.Hamster = {
        note: [
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




