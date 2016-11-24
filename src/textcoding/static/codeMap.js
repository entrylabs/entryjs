
/*
 *
 */
"use strict";

goog.provide("Entry.CodeMap");

Entry.CodeMap = {};

(function(cc) {
    cc.Arduino = {
        digitalWrite: [
            null,
            {"on":"high", "off":"low", "HIGH":"on", "LOW":"off"}
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
                9: "Hamster.NOTE_F_SHARP",
                10: "Hamster.NOTE_G",
                11: "Hamster.NOTE_G_SHARP",
                12: "Hamster.NOTE_A",
                13: "Hamster.NOTE_B_FLAT",
                14:"Hamster.NOTE_B",
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




