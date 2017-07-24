"use strict";

Entry.Hamster = {
    PORT_MAP: {
        motion:0,
        leftWheel: 0,
        rightWheel: 0,
        buzzer: 0,
        outputA: 0,
        outputB: 0,
        leftLed: 0,
        rightLed: 0,
        note: 0,
        lineTracerMode: 0,
        lineTracerModeId: 0,
        lineTracerSpeed: 5,
        ioModeA: 0,
        ioModeB: 0
    },
    setZero: function() {
        var portMap = Entry.Hamster.PORT_MAP;
        var sq = Entry.hw.sendQueue;
        for (var port in portMap) {
            sq[port] = portMap[port];
        }
        Entry.hw.update();
        var hamster = Entry.Hamster;
        hamster.lineTracerModeId = 0;
        hamster.lineTracerStateId = -1;
        hamster.tempo = 60;
        hamster.boardCommand = 0;
        hamster.removeAllTimeouts();
    },
    lineTracerModeId: 0,
    lineTracerStateId: -1,
    tempo: 60,
    boardCommand: 60,
    timeouts: [],
    removeTimeout: function(id) {
        clearTimeout(id);
        var timeouts = this.timeouts;
        var index = timeouts.indexOf(id);
        if(index >= 0) {
            timeouts.splice(index, 1);
        }
    },
    removeAllTimeouts: function() {
        var timeouts = this.timeouts;
        for(var i in timeouts) {
            clearTimeout(timeouts[i]);
        }
        this.timeouts = [];
    },
    setModule: function(sq) {
        sq.module = "hamster";
    },
    setLineTracerMode: function(sq, mode) {
        this.lineTracerModeId = this.lineTracerModeId % 255 + 1;
        sq.lineTracerMode = mode;
        sq.lineTracerModeId = this.lineTracerModeId;
    },
    name: 'hamster',
    monitorTemplate: {
        imgPath: "hw/hamster.png",
        width: 256,
        height: 256,
        listPorts:{
            "temperature":{name: Lang.Blocks.HAMSTER_sensor_temperature, type: "input", pos: {x: 0, y: 0}},
            "inputA":{name: Lang.Blocks.HAMSTER_sensor_input_a, type: "input", pos: {x: 0, y: 0}},
            "inputB":{name: Lang.Blocks.HAMSTER_sensor_input_b, type: "input", pos: {x: 0, y: 0}},
            "accelerationX":{name: Lang.Blocks.HAMSTER_sensor_acceleration_x, type: "input", pos: {x: 0, y: 0}},
            "accelerationY":{name: Lang.Blocks.HAMSTER_sensor_acceleration_y, type: "input", pos: {x: 0, y: 0}},
            "accelerationZ":{name: Lang.Blocks.HAMSTER_sensor_acceleration_z, type: "input", pos: {x: 0, y: 0}},
            "buzzer":{name: Lang.Hw.buzzer , type: "output", pos: {x: 0, y: 0}},
            "note":{name:  Lang.Hw.note , type: "output", pos: {x: 0, y: 0}},
            "outputA":{name: Lang.Hw.output + "A", type: "output", pos: {x: 0, y: 0}},
            "outputB":{name: Lang.Hw.output + "B", type: "output", pos: {x: 0, y: 0}}
        },
        ports: {
            "leftProximity":{name: Lang.Blocks.HAMSTER_sensor_left_proximity, type: "input", pos: {x: 122, y: 156}},
            "rightProximity":{name: Lang.Blocks.HAMSTER_sensor_right_proximity, type: "input", pos: {x : 10, y: 108}},
            "leftFloor":{name: Lang.Blocks.HAMSTER_sensor_left_floor, type: "input", pos: {x: 100, y: 234}},
            "rightFloor":{name: Lang.Blocks.HAMSTER_sensor_right_floor, type: "input", pos: {x: 13, y: 180}},
            "light":{name: Lang.Blocks.HAMSTER_sensor_light, type: "input", pos: {x: 56, y: 189}},
            "leftWheel":{name: Lang.Hw.leftWheel, type: "output", pos: {x: 209, y: 115}},
            "rightWheel":{name: Lang.Hw.rightWheel, type: "output", pos: {x: 98, y: 30}},
            "leftLed":{name: Lang.Hw.left + " " + Lang.Hw.led_en, type: "output", pos: {x: 87, y: 210}},
            "rightLed":{name: Lang.Hw.right + " " + Lang.Hw.led_en , type: "output", pos: {x: 24, y: 168}},
        },
      mode : 'both'
    }
};
