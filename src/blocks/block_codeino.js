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
    monitorTemplate: Entry.Arduino.monitorTemplate,
    setZero: function () {
        if(!Entry.hw.sendQueue.SET) {
            Entry.hw.sendQueue = {
                SET: {
                    '0': { type: Entry.CODEino.sensorTypes.DIGITAL, data: 0 },
                    '1': { type: Entry.CODEino.sensorTypes.DIGITAL, data: 0 },
                    '2': { type: Entry.CODEino.sensorTypes.DIGITAL, data: 0 },
                    '3': { type: Entry.CODEino.sensorTypes.DIGITAL, data: 0 },
                    '4': { type: Entry.CODEino.sensorTypes.DIGITAL, data: 0 },
                    '5': { type: Entry.CODEino.sensorTypes.DIGITAL, data: 0 },
                    '6': { type: Entry.CODEino.sensorTypes.DIGITAL, data: 0 },
                    '7': { type: Entry.CODEino.sensorTypes.DIGITAL, data: 0 },
                    '8': { type: Entry.CODEino.sensorTypes.DIGITAL, data: 0 },
                    '9': { type: Entry.CODEino.sensorTypes.DIGITAL, data: 0 },
                    '10': { type: Entry.CODEino.sensorTypes.DIGITAL, data: 0 },
                    '11': { type: Entry.CODEino.sensorTypes.DIGITAL, data: 0 },
                    '12': { type: Entry.CODEino.sensorTypes.DIGITAL, data: 0 },
                    '13': { type: Entry.CODEino.sensorTypes.DIGITAL, data: 0 }
                },
                TIME: Entry.CODEino.getSensorTime(Entry.CODEino.sensorTypes.DIGITAL),
                KEY: Entry.CODEino.getSensorKey()
            }
        } else {
            var keySet = Object.keys(Entry.hw.sendQueue.SET);
            keySet.forEach(function (key) {
                Entry.hw.sendQueue.SET[key].data = 0;
                Entry.hw.sendQueue.TIME = Entry.CODEino.getSensorTime(Entry.hw.sendQueue.SET[key].type);
                Entry.hw.sendQueue.KEY = Entry.CODEino.getSensorKey();
            });
        }
        Entry.hw.update();
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
    }
};
