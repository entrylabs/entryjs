"use strict";
Entry.Bitbrick = {

    SENSOR_MAP : {
        1: "light",
        2: "IR",
        3: "touch",
        4: "potentiometer",
        5: "MIC",
        21: "UserSensor",
        11: "UserInput",
        20: "LED",
        19: "SERVO",
        18: "DC"
    },
    PORT_MAP : {
        "buzzer": 2,
        "5": 4,
        "6": 6,
        "7": 8,
        "8": 10,
        "LEDR": 12,
        "LEDG": 14,
        "LEDB": 16
    },
  sensorList: function() {
    var list = [];
    var portData = Entry.hw.portData;
    for (var i = 1; i < 5; i++) {
        var data = portData[i];
        if (data && (data.value || data.value === 0)) {
            list.push([i + ' - ' + Lang.Blocks['BITBRICK_' + data.type], i.toString()]);
        }
    }

    if (list.length == 0)
      return [[Lang.Blocks.no_target, 'null']]
    return list;
  },
  touchList: function() {
    var list = [];
    var portData = Entry.hw.portData;
    for (var i = 1; i < 5; i++) {
        var data = portData[i];
      if (data && data.type === "touch")
        list.push([i.toString(), i.toString()]);
    }
    if (list.length == 0)
      return [[Lang.Blocks.no_target, 'null']]
    return list;
  },
  servoList: function() {
    var list = [];
    var portData = Entry.hw.portData;
    for (var i = 5; i < 9; i++) {
        var data = portData[i];
        if (data && data.type === "SERVO")
            list.push(["ABCD"[i-5], i.toString()]);
    }
    if (list.length == 0)
        return [[Lang.Blocks.no_target, 'null']]
    return list;
  },
  dcList: function() {
    var list = [];
    var portData = Entry.hw.portData;
    for (var i = 5; i < 9; i++) {
        var data = portData[i];
        if (data && data.type === "DC")
            list.push(["ABCD"[i-5], i.toString()]);
    }
    if (list.length == 0)
      return [[Lang.Blocks.no_target, 'null']]
    return list;
  },
  setZero: function() {
      var sq = Entry.hw.sendQueue;
      for (var port in Entry.Bitbrick.PORT_MAP)
          sq[port] = 0;
      Entry.hw.update();
  },
  name: 'bitbrick',
  servoMaxValue: 181,
  servoMinValue: 1,
  dcMaxValue: 100,
  dcMinValue: -100,
  monitorTemplate: {
        keys: ['value'],
        imgPath: "hw/bitbrick.png",
        width: 400,
        height: 400,
        listPorts: {
            "1":{name: Lang.Hw.port_en + " 1 " + Lang.Hw.port_ko, type: "input", pos: {x : 0, y: 0}},
            "2":{name: Lang.Hw.port_en + " 2 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            "3":{name: Lang.Hw.port_en + " 3 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            "4":{name: Lang.Hw.port_en + " 4 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            "A":{name: Lang.Hw.port_en + " A " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            "B":{name: Lang.Hw.port_en + " B " + Lang.Hw.port_ko, type: "input", pos: {x : 0, y: 0}},
            "C":{name: Lang.Hw.port_en + " C " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}},
            "D":{name: Lang.Hw.port_en + " D " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}}
        }
        // },
        // ports : {
        //     "1":{name: "light", type: "input", pos: {x: 0, y: 0}},
        //     "2":{name: "IR", type: "input", pos: {x : 0, y: 0}},
        //     "3":{name: "touch", type: "input", pos: {x: 0, y: 0}},
        //     "4":{name: "potentiometer", type: "input", pos: {x: 0, y: 0}},
        //     "5":{name: "MIC", type: "input", pos: {x: 0, y: 0}},
        //     "21":{name: "UserSensor", type: "input", pos: {x: 0, y: 0}},
        //     "11":{name: "USER INPUT", type: "input", pos: {x: 0, y: 0}},
        //     "20":{name: "LED", type: "input", pos: {x: 0, y: 0}},
        //     "19":{name: "SERVO", type: "input", pos: {x: 0, y: 0}},
        //     "18":{name: "DC", type: "input", pos: {x: 0, y: 0}},
        //     "buzzer":{name: "부저", type: "input", pos: {x: 0, y: 0}},
        //     "LEDR":{name: "LEDR", type: "output", pos: {x: 0, y: 0}},
        //     "LEDG":{name: "LEDG", type: "output", pos: {x: 0, y: 0}},
        //     "LEDB":{name: "LEDG", type: "output", pos: {x: 0, y: 0}}
        // },
        ,mode: 'both'
    }
};