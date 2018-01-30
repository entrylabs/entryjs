"use strict";

Entry.CODEino = {
    name: 'CODEino',
    getSensorKey: function () {
        return "xxxxxxxx".replace(/[xy]/g, function(f) {
            var e = Math.random() * 16 | 0, d = f == "x" ? e : (e & 0 * 3 | 0 * 8);
            return d.toString(16)
        }).toUpperCase()
    },
    getSensorTime: function (type) {
        return new Date().getTime() + type;
    },
    setZero: function () {
        if(!Entry.hw.sendQueue.SET) {
            Entry.hw.sendQueue = {
                GET : {},
                SET: {}
            }
        } else {
            var keySet = Object.keys(Entry.hw.sendQueue.SET);
            keySet.forEach(function (key) {
                Entry.hw.sendQueue.SET[key].data = 0;
                Entry.hw.sendQueue.SET[key].time = new Date().getTime();
            });
        }
        Entry.hw.update();
    },
    monitorTemplate: {
        imgPath: "hw/codeino.png",
        width: 431,
        height: 354,
        listPorts: {
            "2":{name: Lang.Hw.port_en + " 2 " + Lang.Hw.port_ko, type: "input", pos: {x : 0, y: 0}},
            "3":{name: Lang.Hw.port_en + " 3 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            "4":{name: Lang.Hw.port_en + " 4 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            "5":{name: Lang.Hw.port_en + " 5 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            "6":{name: Lang.Hw.port_en + " 6 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            "7":{name: Lang.Hw.port_en + " 7 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            "8":{name: Lang.Hw.port_en + " 8 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            "9":{name: Lang.Hw.port_en + " 9 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            "10":{name: Lang.Hw.port_en + " 10 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            "11":{name: Lang.Hw.port_en + " 11 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            "12":{name: Lang.Hw.port_en + " 12 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            "13":{name: Lang.Hw.port_en + " 13 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            "a0":{name: Lang.Hw.port_en + " A0 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            "a1":{name: Lang.Hw.port_en + " A1 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            "a2":{name: Lang.Hw.port_en + " A2 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            "a3":{name: Lang.Hw.port_en + " A3 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            "a4":{name: Lang.Hw.port_en + " A4 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            "a5":{name: Lang.Hw.port_en + " A5 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            "a6":{name: Lang.Hw.port_en + " A6 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}}
        },
        mode : 'both'
    },
    sensorTypes: {
        ALIVE: 0,
        DIGITAL: 1,
        ANALOG: 2,
        PWM: 3,
        RGBLED_PIN: 4,
        TONE: 5,
        PULSEIN: 6,
        ULTRASONIC: 7,
        TIMER: 8,
        ADDCOLOR: 9
    },
    BlockState: {
    },

    LED_RED_VALUE : 0,
    LED_GREEN_VALUE : 0,
    LED_BLUE_VALUE : 0
};
