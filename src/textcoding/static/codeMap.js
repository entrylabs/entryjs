
/*
 *
 */
"use strict";

goog.provide("Entry.CodeMap");

Entry.CodeMap = {};

(function(cc) {
    cc.Arduino = {
        /*analogRead: [
            {"a0":0, "a1":1, "a2":2, "a3":3, "a4":4, "a5":5}
        ],*/
        /*map: [
            {"a0":0, "a1":1, "a2":2, "a3":3, "a4":4, "a5":5},
            null,
            null,
            null,
            null
        ],*/
        digitalWrite: [
            null,
            {"on":"high", "off":"low", "high":"on", "low":"off"}
        ]
    };

    cc.Hamster = {
        note: [
            {
                "Hamster.NOTE_C": 4,
                "Hamster.NOTE_C_SHARP": 5,
                "Hamster.NOTE_D_FLAT": 5,
                "Hamster.NOTE_D": 6,
                "Hamster.NOTE_E_FLAT": 7,
                "Hamster.NOTE_D_SHARP": 7,
                "Hamster.NOTE_E": 8,
                "Hamster.NOTE_F": 8,
                "Hamster.NOTE_F_SHARP": 9,
                "Hamster.NOTE_G_FLAT": 9,
                "Hamster.NOTE_G": 10,
                "Hamster.NOTE_G_SHARP": 11,
                "Hamster.NOTE_A_FLAT": 11,
                "Hamster.NOTE_A": 12,
                "Hamster.NOTE_B_FLAT": 13,
                "Hamster.NOTE_A_SHARP": 13,
                "Hamster.NOTE_B": 14
            },
            null,
            null
        ]
    };
})(Entry.CodeMap);




