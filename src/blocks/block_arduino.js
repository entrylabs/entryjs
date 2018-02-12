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
        for (var port = 2; port < 9; port++) {
            Entry.hw.sendQueue[port] = 0;
            Entry.hw.sendQueue.readablePorts.push(port);
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
    toByte: function(data) {
        switch(data) {
            case ' ' : data = 32; break; case '!' : data = 33; break; case '"' : data = 34; break;
            case '#' : data = 35; break; case '$' : data = 36; break; case '%' : data = 37; break;
            case '&' : data = 38; break; case '\'' : data = 39; break; case '(' : data = 40; break;
            case ')' : data = 41; break; case '*' : data = 42; break; case '+' : data = 43; break;           
            case ',' : data = 44; break; case '-' : data = 45; break; case '.' : data = 46; break;
            case '/' : data = 47; break; case '0' : data = 48; break; case '1' : data = 49; break;
            case '2' : data = 50; break; case '3' : data = 51; break; case '4' : data = 52; break;
            case '5' : data = 53; break; case '6' : data = 54; break; case '7' : data = 55; break;
            case '8' : data = 56; break; case '9' : data = 57; break; case ':' : data = 58; break;
            case ';' : data = 59; break; case '<' : data = 60; break; case '=' : data = 61; break;
            case '>' : data = 62; break; case '?' : data = 63; break; case '@' : data = 64; break;
            case 'A' : data = 65; break; case 'B' : data = 66; break; case 'C' : data = 67; break; 
            case 'D' : data = 68; break; case 'E' : data = 69; break; case 'F' : data = 70; break;
            case 'G' : data = 71; break; case 'H' : data = 72; break; case 'I' : data = 73; break;
            case 'J' : data = 74; break; case 'K' : data = 75; break; case 'L' : data = 76; break;
            case 'M' : data = 77; break; case 'N' : data = 78; break; case 'O' : data = 79; break;
            case 'P' : data = 80; break; case 'Q' : data = 81; break; case 'R' : data = 82; break;
            case 'S' : data = 83; break; case 'T' : data = 84; break; case 'U' : data = 85; break;
            case 'V' : data = 86; break; case 'W' : data = 87; break; case 'X' : data = 88; break;
            case 'Y' : data = 89; break; case 'Z' : data = 90; break; case '[' : data = 91; break;
            case '\\' : data = 92; break; case ']' : data = 93; break; case '^' : data = 94; break;
            case '_' : data = 95; break; case '`' : data = 96; break; case 'a' : data = 97; break;
            case 'b' : data = 98; break; case 'c' : data = 99; break; case 'd' : data = 100; break;
            case 'e' : data = 101; break; case 'f' : data = 102; break; case 'g' : data = 103; break;
            case 'h' : data = 104; break; case 'i' : data = 105; break; case 'j' : data = 106; break;
            case 'k' : data = 107; break; case 'l' : data = 108; break; case 'm' : data = 109; break;
            case 'n' : data = 110; break; case 'o' : data = 111; break; case 'p' : data = 112; break;
            case 'q' : data = 113; break; case 'r' : data = 114; break; case 's' : data = 115; break;
            case 't' : data = 116; break; case 'u' : data = 117; break; case 'v' : data = 118; break;
            case 'w' : data = 119; break; case 'x' : data = 120; break; case 'y' : data = 121; break;
            case 'z' : data = 122; break; case '{' : data = 123; break; case '|' : data = 124; break;
            case '}' : data = 125; break; case '~' : data = 126; break; 
        }

        return data;
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
        LCD: 9,
        LCD_COMMAND: 10
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
