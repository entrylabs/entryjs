
/*
 *
 */
"use strict";

goog.provide("Entry.CodeMap");

Entry.CodeMap = {};

(function(cc) {
    cc.Arduino = {
        analogRead: [
            {0:["A0"], 1:["A1"], 2:["A2"], 3:["A3"], 4:["A4"], 5:["A5"]}
        ],
        map: [
            {0:["A0"], 1:["A1"], 2:["A2"], 3:["A3"], 4:["A4"], 5:["A5"]},
            null,
            null,
            null,
            null
        ],
        digitalWrite: [
            null,
            {on:["HIGH"],off:["LOW"]}
        ]
    };

    cc.Hamster = {
        note: [
            {
                4:["Hamster.NOTE_C"],
                5:["Hamster.NOTE_C_SHARP","Hamster.NOTE_D_FLAT"],
                6:["Hamster.NOTE_D"],
                7:["Hamster.NOTE_E_FLAT","Hamster.NOTE_D_SHARP"],
                8:["Hamster.NOTE_E"],
                9:["Hamster.NOTE_F"],
                10:["Hamster.NOTE_F_SHARP","Hamster.NOTE_G_FLAT"],
                11:["Hamster.NOTE_G"],
                12:["Hamster.NOTE_G_SHARP","Hamster.NOTE_A_FLAT"],
                13:["Hamster.NOTE_A"],
                14:["Hamster.NOTE_B_FLAT","Hamster.NOTE_A_SHARP"],
                15:["Hamster.NOTE_B"]
            },
            null,
            null
        ]
    };
})(Entry.CodeMap);


