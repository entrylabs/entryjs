"use strict";

Entry.Arduino = {
    name: 'arduino',
    setZero: function() {
        Entry.hw.sendQueue.readablePorts = [];
        for (var port = 0; port < 20; port++) {
            Entry.hw.sendQueue[port] = 0;
            Entry.hw.sendQueue.readablePorts.push(port);
        }
        Entry.hw.update();
    },
    monitorTemplate: {
        imgPath: "hw/arduino.png",
        width: 605,
        height: 434,
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
            "a5":{name: Lang.Hw.port_en + " A5 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}}
        },
        mode : 'both'

    }
};

Entry.ArduinoExt = {
    name: 'ArduinoExt',
    setZero: function () {
        if(!Entry.hw.sendQueue.SET) {
            Entry.hw.sendQueue = {
                GET: {},
                SET: {},
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
    sensorTypes: {
        ALIVE: 0,
        DIGITAL: 1,
        ANALOG: 2,
        PWM: 3,
        SERVO_PIN: 4,
        TONE: 5,
        PULSEIN: 6,
        ULTRASONIC: 7,
        TIMER: 8
    },
    toneTable: {
        "0": 0,
        "C": 1,
        "CS": 2,
        "D": 3,
        "DS": 4,
        "E": 5,
        "F": 6,
        "FS": 7,
        "G": 8,
        "GS": 9,
        "A": 10,
        "AS": 11,
        "B": 12,
    },
    toneMap: {
        "1": [33, 65, 131, 262, 523, 1046, 2093, 4186],
        "2": [35, 69, 139, 277, 554, 1109, 2217, 4435],
        "3": [37, 73, 147, 294, 587, 1175, 2349, 4699],
        "4": [39, 78, 156, 311, 622, 1245, 2849, 4978],
        "5": [41, 82, 165, 330, 659, 1319, 2637, 5274],
        "6": [44, 87, 175, 349, 698, 1397, 2794, 5588],
        "7": [46, 92, 185, 370, 740, 1480, 2960, 5920],
        "8": [49, 98, 196, 392, 784, 1568, 3136, 6272],
        "9": [52, 104, 208, 415, 831, 1661, 3322, 6645],
        "10": [55, 110, 220, 440, 880, 1760, 3520, 7040],
        "11": [58, 117, 233, 466, 932, 1865, 3729, 7459],
        "12": [62, 123, 247, 494, 988, 1976, 3951, 7902]
    },
    highList: [
        'high', '1', 'on'
    ],
    lowList: [
        'low', '0', 'off'
    ],
    BlockState: {
    }
}

Entry.ArduinoNano = $.extend(true, {}, Entry.ArduinoExt, {
    name: 'ArduinoNano',
});


Entry.SmartBoard = {
    name: 'smartBoard',
    setZero: function() {
        Entry.hw.sendQueue.readablePorts = [];
        for (var port = 0; port < 20; port++) {
            if(port != 9 || port != 10 || port != 11 ) {
                Entry.hw.sendQueue[port] = 0;
                Entry.hw.sendQueue.readablePorts.push(port);
            }
        }
        Entry.hw.update();
    },
    monitorTemplate: {
        listPorts: {
            "2":{name: Lang.Hw.port_en + " GS2 ", type: "output", pos: {x: 0, y: 0}},
            "3":{name: Lang.Hw.port_en + " GS1 ", type: "output", pos: {x : 0, y: 0}},
            "4":{name: Lang.Hw.port_en + " MT1 회전 방향 ", type: "output", pos: {x: 0, y: 0}},
            "5":{name: Lang.Hw.port_en + " MT1 PWM ", type: "output", pos: {x: 0, y: 0}},
            "6":{name: Lang.Hw.port_en + " MT2 PWM ", type: "output", pos: {x: 0, y: 0}},
            "7":{name: Lang.Hw.port_en + " MT2 회전 방향 ", type: "output", pos: {x: 0, y: 0}},
            "8":{name: Lang.Hw.port_en + " RELAY ", type: "output", pos: {x: 0, y: 0}},
            "9":{name: Lang.Hw.port_en + " SM3 각도 ", type: "output", pos: {x: 0, y: 0}},
            "10":{name: Lang.Hw.port_en + " SM2 각도 ", type: "output", pos: {x: 0, y: 0}},
            "11":{name: Lang.Hw.port_en + "SM1 각도 ", type: "output", pos: {x: 0, y: 0}},
            "12":{name: Lang.Hw.port_en + " 빨간 " + Lang.Hw.button, type: "input", pos: {x: 0, y: 0}},
            "13":{name: Lang.Hw.port_en + " 노란 " + Lang.Hw.button, type: "input", pos: {x: 0, y: 0}},
            "14":{name: Lang.Hw.port_en + " 초록 " + Lang.Hw.button, type: "input", pos: {x: 0, y: 0}},
            "15":{name: Lang.Hw.port_en + " 파란 " + Lang.Hw.button, type: "input", pos: {x: 0, y: 0}},
            "a2":{name: Lang.Hw.port_en + " 1번 " + Lang.Hw.sensor, type: "input", pos: {x: 0, y: 0}},
            "a3":{name: Lang.Hw.port_en + " 2번 " + Lang.Hw.sensor, type: "input", pos: {x: 0, y: 0}},
            "a4":{name: Lang.Hw.port_en + " 3번 " + Lang.Hw.sensor, type: "input", pos: {x: 0, y: 0}},
            "a5":{name: Lang.Hw.port_en + " 4번 " + Lang.Hw.sensor, type: "input", pos: {x: 0, y: 0}}
        },
        mode : 'both'
    }
};

Entry.SensorBoard = {
    name: 'sensorBoard',
    setZero: Entry.Arduino.setZero
};


Entry.ardublock = {
    name: 'ardublock',
    setZero: function () {
        if(!Entry.hw.sendQueue.SET) {
            Entry.hw.sendQueue = {
                GET: {},
                SET: {},
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
    sensorTypes: {
        ALIVE: 0,
        DIGITAL: 1,
        ANALOG: 2,
        PWM: 3,
        SERVO_PIN: 4,
        TONE: 5,
        PULSEIN: 6,
        ULTRASONIC: 7,
        TIMER: 8,
        MOTOR_LEFT: 9,
        MOTOR_RIGHT: 10
    },
    toneTable: {
        "0": 0,
        "C": 1,
        "CS": 2,
        "D": 3,
        "DS": 4,
        "E": 5,
        "F": 6,
        "FS": 7,
        "G": 8,
        "GS": 9,
        "A": 10,
        "AS": 11,
        "B": 12,
    },
    toneMap: {
        "1": [33, 65, 131, 262, 523, 1046, 2093, 4186],
        "2": [35, 69, 139, 277, 554, 1109, 2217, 4435],
        "3": [37, 73, 147, 294, 587, 1175, 2349, 4699],
        "4": [39, 78, 156, 311, 622, 1245, 2849, 4978],
        "5": [41, 82, 165, 330, 659, 1319, 2637, 5274],
        "6": [44, 87, 175, 349, 698, 1397, 2794, 5588],
        "7": [46, 92, 185, 370, 740, 1480, 2960, 5920],
        "8": [49, 98, 196, 392, 784, 1568, 3136, 6272],
        "9": [52, 104, 208, 415, 831, 1661, 3322, 6645],
        "10": [55, 110, 220, 440, 880, 1760, 3520, 7040],
        "11": [58, 117, 233, 466, 932, 1865, 3729, 7459],
        "12": [62, 123, 247, 494, 988, 1976, 3951, 7902]
    },
    directionTable: {
        "Forward": 0,
        "Backward": 1
    },    
    highList: [
        'high', '1', 'on'
    ],
    lowList: [
        'low', '0', 'off'
    ],
    BlockState: {
    }
}

Entry.mkboard = {
    name: 'mkboard',
    setZero: function () {
        if(!Entry.hw.sendQueue.SET) {
            Entry.hw.sendQueue = {
                GET: {},
                SET: {},
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
    sensorTypes: {
        ALIVE: 0,
        DIGITAL: 1,
        ANALOG: 2,
        PWM: 3,
        SERVO_PIN: 4,
        TONE: 5,
        PULSEIN: 6,
        ULTRASONIC: 7,
        TIMER: 8,
        DC_MOTOR_LEFT: 9,
        DC_MOTOR_RIGHT: 10
    },
    toneTable: {
        "0": 0,
        "C": 1,
        "CS": 2,
        "D": 3,
        "DS": 4,
        "E": 5,
        "F": 6,
        "FS": 7,
        "G": 8,
        "GS": 9,
        "A": 10,
        "AS": 11,
        "B": 12,
    },
    toneMap: {
        "1": [33, 65, 131, 262, 523, 1046, 2093, 4186],
        "2": [35, 69, 139, 277, 554, 1109, 2217, 4435],
        "3": [37, 73, 147, 294, 587, 1175, 2349, 4699],
        "4": [39, 78, 156, 311, 622, 1245, 2849, 4978],
        "5": [41, 82, 165, 330, 659, 1319, 2637, 5274],
        "6": [44, 87, 175, 349, 698, 1397, 2794, 5588],
        "7": [46, 92, 185, 370, 740, 1480, 2960, 5920],
        "8": [49, 98, 196, 392, 784, 1568, 3136, 6272],
        "9": [52, 104, 208, 415, 831, 1661, 3322, 6645],
        "10": [55, 110, 220, 440, 880, 1760, 3520, 7040],
        "11": [58, 117, 233, 466, 932, 1865, 3729, 7459],
        "12": [62, 123, 247, 494, 988, 1976, 3951, 7902]
    },
    directionTable: {
        "Forward": 0,
        "Backward": 1
    },    
    highList: [
        'high', '1', 'on'
    ],
    lowList: [
        'low', '0', 'off'
    ],
    BlockState: {
    }
}

Entry.memaker = {
    name: 'memaker',
    setZero: function () {
        if(!Entry.hw.sendQueue.SET) {
            Entry.hw.sendQueue = {
                GET: {},
                SET: {},
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
    sensorTypes: {
        ALIVE: 0,
        DIGITAL: 1,
        ANALOG: 2,
        PWM: 3,
        SERVO_PIN: 4,
        TONE: 5,
        PULSEIN: 6,
        ULTRASONIC: 7,
        TIMER: 8,
        LCD: 9
    },
    toneTable: {
        "0": 0,
        "C": 1,
        "CS": 2,
        "D": 3,
        "DS": 4,
        "E": 5,
        "F": 6,
        "FS": 7,
        "G": 8,
        "GS": 9,
        "A": 10,
        "AS": 11,
        "B": 12,
    },
    toneMap: {
        "1": [33, 65, 131, 262, 523, 1046, 2093, 4186],
        "2": [35, 69, 139, 277, 554, 1109, 2217, 4435],
        "3": [37, 73, 147, 294, 587, 1175, 2349, 4699],
        "4": [39, 78, 156, 311, 622, 1245, 2849, 4978],
        "5": [41, 82, 165, 330, 659, 1319, 2637, 5274],
        "6": [44, 87, 175, 349, 698, 1397, 2794, 5588],
        "7": [46, 92, 185, 370, 740, 1480, 2960, 5920],
        "8": [49, 98, 196, 392, 784, 1568, 3136, 6272],
        "9": [52, 104, 208, 415, 831, 1661, 3322, 6645],
        "10": [55, 110, 220, 440, 880, 1760, 3520, 7040],
        "11": [58, 117, 233, 466, 932, 1865, 3729, 7459],
        "12": [62, 123, 247, 494, 988, 1976, 3951, 7902]
    },
    directionTable: {
        "Forward": 0,
        "Backward": 1
    },    
    highList: [
        'high', '1', 'on'
    ],
    lowList: [
        'low', '0', 'off'
    ],
    BlockState: {
    }
}



Entry.dplay = {
    name: 'dplay',
    vel_value : 255,
    Left_value : 255,
    Right_value : 255,
    setZero: Entry.Arduino.setZero,
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
    monitorTemplate: {
        imgPath: "hw/dplay.png",
        width: 500,
        height: 600,
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
            "a5":{name: Lang.Hw.port_en + " A5 " + Lang.Hw.port_ko, type: "input", pos: {x: 0, y: 0}}
        },
        mode : 'both'

    } 
};

Entry.nemoino = {
    name: 'nemoino',
    setZero: Entry.Arduino.setZero
};

Entry.joystick = {
    name: 'joystick',
    setZero: Entry.Arduino.setZero
};

//rokoboard start
Entry.rokoboard = {
    name: 'rokoboard',
    setZero: Entry.Arduino.setZero,
    monitorTemplate: Entry.Arduino.monitorTemplate
};
