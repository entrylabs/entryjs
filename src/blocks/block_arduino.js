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
/*
Entry.CODEino = {
    name: 'CODEino',
    setZero: Entry.Arduino.setZero,
    monitorTemplate: Entry.Arduino.monitorTemplate

};
*/
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

Blockly.Blocks.arduino_text = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput("Arduino"), "NAME");
    this.setOutput(true, 'String');
    this.setInputsInline(true);
  }
};

Entry.block.arduino_text = function (sprite, script) {
    return script.getStringField("NAME");
};

Blockly.Blocks.arduino_send = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField(Lang.Blocks.ARDUINO_arduino_send_1);
    this.appendValueInput("VALUE")
        .setCheck(["Number", "String", null]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.ARDUINO_arduino_send_2);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.arduino_send = function (sprite, script) {
    var signal = script.getValue("VALUE", script);
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "POST", 'http://localhost:23518/arduino/', false );
    xmlHttp.send(String(signal));
    Entry.assert(xmlHttp.status == 200, "arduino is not connected");
    return script.callReturn();
};


Blockly.Blocks.arduino_get_string = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField(Lang.Blocks.ARDUINO_arduino_get_string_1);
    this.appendValueInput("VALUE")
        .setCheck(["Number", "String", null]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.ARDUINO_arduino_get_string_2);
    this.setOutput(true, 'String');
    this.setInputsInline(true);
  }
};

Entry.block.arduino_get_number = function (sprite, script) {
    var signal = script.getValue("VALUE", script);
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "POST", 'http://localhost:23518/arduino/', false );
    xmlHttp.send(String(signal));
    Entry.assert(xmlHttp.status == 200, "arduino is not connected");
    var data = xmlHttp.responseText;
    return Number(data);
};

Blockly.Blocks.arduino_get_number = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField(Lang.Blocks.ARDUINO_arduino_get_number_1);
    this.appendValueInput("VALUE")
        .setCheck(["Number", "String", null]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.ARDUINO_arduino_get_number_2);
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
  }
};

Entry.block.arduino_get_string = function (sprite, script) {
    var signal = script.getValue("VALUE", script);
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "POST", 'http://localhost:23518/arduino/', false );
    xmlHttp.send(String(signal));
    Entry.assert(xmlHttp.status == 200, "arduino is not connected");
    var data = xmlHttp.responseText;
    return data;
};

//new blocks here
Blockly.Blocks.arduino_get_sensor_number = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          [Lang.Blocks.ARDUINO_arduino_get_sensor_number_0,"A0"],
          [Lang.Blocks.ARDUINO_arduino_get_sensor_number_1,"A1"],
          [Lang.Blocks.ARDUINO_arduino_get_sensor_number_2,"A2"],
          [Lang.Blocks.ARDUINO_arduino_get_sensor_number_3,"A3"],
          [Lang.Blocks.ARDUINO_arduino_get_sensor_number_4,"A4"],
          [Lang.Blocks.ARDUINO_arduino_get_sensor_number_5,"A5"]
          ]), "PORT");
    this.appendDummyInput()
        .appendField(" ");
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
  }
};

Entry.block.arduino_get_sensor_number = function (sprite, script) {
    return script.getStringField("PORT");
}

Blockly.Blocks.arduino_get_port_number = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['0',"0"],
          ['1',"1"],
          ['2',"2"],
          ['3',"3"],
          ['4',"4"],
          ['5',"5"],
          ['6',"6"],
          ['7',"7"],
          ['8',"8"],
          ['9',"9"],
          ['10',"10"],
          ['11',"11"],
          ['12',"12"],
          ['13',"13"]
          ]), "PORT");
    this.appendDummyInput()
        .appendField(' ');
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
  }
};

Entry.block.arduino_get_port_number = function (sprite, script) {
    return script.getStringField("PORT");
}


Blockly.Blocks.arduino_get_pwm_port_number = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['3',"3"],
          ['5',"5"],
          ['6',"6"],
          ['9',"9"],
          ['10',"10"],
          ['11',"11"]
          ]), "PORT");
    this.appendDummyInput()
        .appendField(" ");
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
  }
};

Entry.block.arduino_get_pwm_port_number = function (sprite, script) {
    return script.getStringField("PORT");
}

Blockly.Blocks.arduino_get_number_sensor_value = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField(Lang.Blocks.ARDUINO_num_sensor_value_1);
    this.appendValueInput("VALUE")
        .setCheck(["Number", "String", null]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.ARDUINO_num_sensor_value_2)
        .appendField(" ");
    this.setInputsInline(true);
    this.setOutput(true, 'Number');
  }
};

Entry.block.arduino_get_number_sensor_value = function (sprite, script) {
    var signal = script.getValue("VALUE", script);
    return Entry.hw.getAnalogPortValue(signal[1]);
};

Blockly.Blocks.arduino_get_digital_value = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField(Lang.Blocks.ARDUINO_get_digital_value_1);
    this.appendValueInput("VALUE")
        .setCheck("Number");
    this.appendDummyInput()
        .appendField(Lang.Blocks.ARDUINO_num_sensor_value_2)
        .appendField(" ");
    this.setInputsInline(true);
    this.setOutput(true, 'Boolean');
  }
};

Entry.block.arduino_get_digital_value = function (sprite, script) {
    var signal = script.getNumberValue("VALUE", script);
    return Entry.hw.getDigitalPortValue(signal);
};

Blockly.Blocks.arduino_toggle_led = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField(Lang.Blocks.ARDUINO_num_pin_1);
    this.appendValueInput("VALUE")
        .setCheck(["Number", "String", null]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.ARDUINO_num_pin_2);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          [Lang.Blocks.ARDUINO_on,"on"],
          [Lang.Blocks.ARDUINO_off,"off"]
          ]), "OPERATOR")
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.arduino_toggle_led = function (sprite, script) {
    var port = script.getNumberValue("VALUE");
    var operator = script.getField("OPERATOR");
    var value = operator == "on" ? 255 : 0;
    Entry.hw.setDigitalPortValue(port, value);
    return script.callReturn();
};

Blockly.Blocks.arduino_toggle_pwm = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField(Lang.Blocks.ARDUINO_toggle_pwm_1);
    this.appendValueInput("PORT")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.ARDUINO_toggle_pwm_2);
    this.appendValueInput("VALUE")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.ARDUINO_toggle_pwm_3);
    this.appendDummyInput()
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.arduino_toggle_pwm = function (sprite, script) {
    var port = script.getNumberValue("PORT");
    var value = script.getNumberValue("VALUE");
    value = Math.round(value);
    value = Math.max(value, 0);
    value = Math.min(value, 255);
    Entry.hw.setDigitalPortValue(port, value);
    return script.callReturn();
};

Blockly.Blocks.arduino_convert_scale = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField(Lang.Blocks.ARDUINO_convert_scale_1);
    this.appendValueInput("VALUE1")
        .setCheck(["Number", "String", null]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.ARDUINO_convert_scale_2);
    this.appendValueInput("VALUE2")
        .setCheck(["Number", "String", null]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.ARDUINO_convert_scale_3);
    this.appendValueInput("VALUE3")
        .setCheck(["Number", "String", null]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.ARDUINO_convert_scale_4);
    this.appendValueInput("VALUE4")
        .setCheck(["Number", "String", null]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.ARDUINO_convert_scale_5);
    this.appendValueInput("VALUE5")
        .setCheck(["Number", "String", null]);
    this.appendDummyInput()
        .appendField(Lang.Blocks.ARDUINO_convert_scale_6);
    this.appendDummyInput().appendField(" ");
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
  }
};

Entry.block.arduino_convert_scale = function (sprite, script) {
    var value1 = script.getNumberValue("VALUE1", script);
    var value2 = script.getNumberValue("VALUE2", script);
    var value3 = script.getNumberValue("VALUE3", script);
    var value4 = script.getNumberValue("VALUE4", script);
    var value5 = script.getNumberValue("VALUE5", script);
    var result = value1;
    if (value2 > value3) {
        var swap = value2;
        value2 = value3;
        value3 = swap;
    }
    if (value4 > value5) {
        var swap = value4;
        value4 = value5;
        value5 = swap;
    }
    result -= value2;
    result = result * ((value5 - value4) / (value3 - value2));
    result += value4;
    result = Math.min(value5, result);
    result = Math.max(value4, result);
    return Math.round(result);
};

Blockly.Blocks.sensorBoard_get_named_sensor_value = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField('')
        .appendField(new Blockly.FieldDropdown([
          ['소리',"0"],
          ['빛 감지',"1"],
          ['슬라이더',"2"],
          ['온도',"3"]
          ]), "PORT")
        .appendField(' 센서값');
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
  }
};

Entry.block.sensorBoard_get_named_sensor_value = function (sprite, script) {
    return Entry.hw.getAnalogPortValue(script.getField("PORT", script));
};

Blockly.Blocks.sensorBoard_is_button_pressed = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField('')
        .appendField(new Blockly.FieldDropdown([
          ['빨간',"8"],
          ['파란',"9"],
          ['노란',"10"],
          ['초록',"11"]
          ]), "PORT")
    this.appendDummyInput()
        .appendField(' 버튼을 눌렀는가?');
    this.setInputsInline(true);
    this.setOutput(true, 'Boolean');
  }
};

Entry.block.sensorBoard_is_button_pressed = function (sprite, script) {
    return Entry.hw.getDigitalPortValue(script.getNumberField("PORT", script));
};

Blockly.Blocks.sensorBoard_led = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField('')
        .appendField(new Blockly.FieldDropdown([
          ['빨간',"2"],
          ['초록',"3"],
          ['파란',"4"],
          ['흰색',"5"]
          ]), "PORT")
        .appendField(' LED')
        .appendField(new Blockly.FieldDropdown([
          ['켜기',"255"],
          ['끄기',"0"]
          ]), "OPERATOR")
        .appendField(' ')
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.sensorBoard_led = function (sprite, script) {
    Entry.hw.setDigitalPortValue(script.getField("PORT"),
                                 script.getNumberField("OPERATOR"));
    return script.callReturn();
};

Entry.block.arduino_download_connector = {
    skeleton: "basic_button",
    color: "#eee",
    template: "%1",
    params: [
        {
            type: "Text",
            text: "연결 프로그램 다운로드",
            color: "#333",
            align: "center"
        }
    ],
    func: function() {},
    events: {
        mousedown: [
            function() {
                console.log('download connector');
            }
        ]
    }
};

Entry.block.download_guide = {
    skeleton: "basic_button",
    color: "#eee",
    template: "%1",
    params: [
        {
            type: "Text",
            text: "연결 안내 다운로드",
            color: "#333",
            align: "center"
        }
    ],
    func: function() {},
    events: {
        mousedown: [
            function() {
                console.log('download guide');
            }
        ]
    }
};

Entry.block.arduino_download_source = {
    skeleton: "basic_button",
    color: "#eee",
    template: "%1",
    params: [
        {
            type: "Text",
            text: "엔트리 아두이노 소스",
            color: "#333",
            align: "center"
        }
    ],
    func: function() {},
    events: {
        mousedown: [
            function() {
                console.log('download source');
            }
        ]
    }
};

Entry.block.arduino_connected = {
    skeleton: "basic_button",
    color: "#eee",
    template: "%1",
    params: [
        {
            type: "Text",
            text: "연결 됨",
            color: "#333",
            align: "center"
        }
    ],
    func: function() {},
    events: {
        mousedown: [
            function() {
                console.log('download source');
            }
        ]
    }
};


Entry.block.arduino_reconnect = {
    skeleton: "basic_button",
    color: "#eee",
    template: "%1",
    params: [
        {
            type: "Text",
            text: "다시 연결하기",
            color: "#333",
            align: "center"
        }
    ],
    func: function() {},
    events: {
        mousedown: [
            function() {
                console.log('download source');
            }
        ]
    }
};


Blockly.Blocks.CODEino_get_sensor_number = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          [Lang.Blocks.CODEino_get_sensor_number_0,"A0"],
          [Lang.Blocks.CODEino_get_sensor_number_1,"A1"],
          [Lang.Blocks.CODEino_get_sensor_number_2,"A2"],
          [Lang.Blocks.CODEino_get_sensor_number_3,"A3"],
          [Lang.Blocks.CODEino_get_sensor_number_4,"A4"],
          [Lang.Blocks.CODEino_get_sensor_number_5,"A5"],
          [Lang.Blocks.CODEino_get_sensor_number_6,"A6"],
          ]), "PORT");
    this.appendDummyInput()
        .appendField(" ");
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
  }
};

Entry.block.CODEino_get_sensor_number = function (sprite, script) {
    return script.getStringField("PORT");
}

Blockly.Blocks.CODEino_get_named_sensor_value = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField(' ')
        .appendField(new Blockly.FieldDropdown([
          [Lang.Blocks.CODEino_sensor_name_0,"0"],
          [Lang.Blocks.CODEino_sensor_name_1,"1"],
          [Lang.Blocks.CODEino_sensor_name_2,"2"],
          [Lang.Blocks.CODEino_sensor_name_3,"3"],
          [Lang.Blocks.CODEino_sensor_name_4,"4"],
          [Lang.Blocks.CODEino_sensor_name_5,"5"],
          [Lang.Blocks.CODEino_sensor_name_6,"6"]
          ]), "PORT")
        .appendField(Lang.Blocks.CODEino_string_1);
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
  }
};

Entry.block.CODEino_get_named_sensor_value = function (sprite, script) {
    return Entry.hw.getAnalogPortValue(script.getField("PORT", script));
};

Blockly.Blocks.CODEino_get_sound_status = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField(Lang.Blocks.CODEino_string_10)
        .appendField(new Blockly.FieldDropdown([
          [Lang.Blocks.CODEino_string_11,"GREAT"],
          [Lang.Blocks.CODEino_string_12,"SMALL"]
          ]), "STATUS")
        .appendField(' ');
    this.setInputsInline(true);
    this.setOutput(true, 'Boolean');
  }
};

Entry.block.CODEino_get_sound_status = function (sprite, script) {
    var value1 = script.getField("STATUS", script);
    var value2 = 0;
    if (value1 == "GREAT") return Entry.hw.getAnalogPortValue(value2) > 600 ? 1 : 0;
    else return Entry.hw.getAnalogPortValue(value2) < 600 ? 1 : 0;
};

Blockly.Blocks.CODEino_get_light_status = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField(Lang.Blocks.CODEino_string_13)
        .appendField(new Blockly.FieldDropdown([
          [Lang.Blocks.CODEino_string_14,"BRIGHT"],
          [Lang.Blocks.CODEino_string_15,"DARK"]
          ]), "STATUS")
        .appendField(' ');
    this.setInputsInline(true);
    this.setOutput(true, 'Boolean');
  }
};

Entry.block.CODEino_get_light_status = function (sprite, script) {
    var value1 = script.getField("STATUS", script);
    var value2 = 1;
    if (value1 == "DARK") return Entry.hw.getAnalogPortValue(value2) > 800 ? 1 : 0;
    else return Entry.hw.getAnalogPortValue(value2) < 800 ? 1 : 0;
};

Blockly.Blocks.CODEino_is_button_pressed = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField(Lang.Blocks.CODEino_string_2)
        .appendField(new Blockly.FieldDropdown([
          [Lang.Blocks.CODEino_string_3,"4"],
          [Lang.Blocks.CODEino_string_4,"17"],
          [Lang.Blocks.CODEino_string_5,"18"],
          [Lang.Blocks.CODEino_string_6,"19"],
          [Lang.Blocks.CODEino_string_7,"20"]
          ]), "PORT")
        .appendField(' ');
    this.setInputsInline(true);
    this.setOutput(true, 'Boolean');
  }
};

Entry.block.CODEino_is_button_pressed = function (sprite, script) {
    var value = script.getNumberField("PORT", script);
    if (value > 14) {
        value = value - 14;
        return !Entry.hw.getAnalogPortValue(value);
    } else return !Entry.hw.getDigitalPortValue(value);
};

Blockly.Blocks.CODEino_get_accelerometer_direction = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField(Lang.Blocks.CODEino_string_8)
        .appendField(new Blockly.FieldDropdown([
          [Lang.Blocks.CODEino_string_16, "LEFT"],
          [Lang.Blocks.CODEino_string_17, "RIGHT"],
          [Lang.Blocks.CODEino_string_18, "FRONT"],
          [Lang.Blocks.CODEino_string_19, "REAR"],
          [Lang.Blocks.CODEino_string_20, "REVERSE"]
          ]), "DIRECTION")
    this.appendDummyInput()
        .appendField(' ');
    this.setInputsInline(true);
    this.setOutput(true, 'Boolean');
  }
};

Entry.block.CODEino_get_accelerometer_direction = function (sprite, script) {
    var value1 = script.getField("DIRECTION", script);
    var value2 = 0;
    if (value1 == "LEFT" || value1 =="RIGHT") value2 = 3;
    else if (value1 == "FRONT" || value1 =="REAR") value2 = 4;
    else if (value1 == "REVERSE") value2 = 5;
    var value3 = Entry.hw.getAnalogPortValue(value2);
    var value4 = 265;
    var value5 = 402;
    var value6 = -90;
    var value7 = 90;
    var result = value3;
    result -= value4;
    result = result * ((value7 - value6) / (value5 - value4));
    result += value6;
    result = Math.min(value7, result);
    result = Math.max(value6, result);
    result = Math.round(result);
    if (value1 == "LEFT" || value1 == "REAR") return result < -30 ? 1 : 0;
    else if (value1 == "RIGHT" || value1 == "FRONT") return result > 30 ? 1 : 0;
    else if (value1 == "REVERSE") return result < -50 ? 1 : 0;
};

Blockly.Blocks.CODEino_get_accelerometer_value = {
  init:function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField(Lang.Blocks.CODEino_string_8)
        .appendField(new Blockly.FieldDropdown([
          [Lang.Blocks.CODEino_accelerometer_X, "3"],
          [Lang.Blocks.CODEino_accelerometer_Y, "4"],
          [Lang.Blocks.CODEino_accelerometer_Z, "5"]
          ]), "PORT")
      .appendField(Lang.Blocks.CODEino_string_9);
    this.setOutput(!0, "Number");
    this.setInputsInline(!0);
  }
};

Entry.block.CODEino_get_accelerometer_value = function (sprite, script) {
    var value1 = Entry.hw.getAnalogPortValue(script.getField("PORT", script));
    var value2 = 265;
    var value3 = 402;
    var value4 = -90;
    var value5 = 90;
    var result = value1;
    if (value2 > value3) {
        var swap = value2;
        value2 = value3;
        value3 = swap;
    }
    if (value4 > value5) {
        var swap = value4;
        value4 = value5;
        value5 = swap;
    }
    result -= value2;
    result = result * ((value5 - value4) / (value3 - value2));
    result += value4;
    result = Math.min(value5, result);
    result = Math.max(value4, result);
    return Math.round(result);
};

Blockly.Blocks.dplay_select_led = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField(Lang.Blocks.ARDUINO_num_pin_1);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['7',"7"],
          ['8',"8"],
          ['9',"9"],
          ['10',"10"]
          ]), "PORT")
    this.appendDummyInput()
        .appendField(Lang.Blocks.dplay_num_pin_1);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          [Lang.Blocks.ARDUINO_on,"on"],
          [Lang.Blocks.ARDUINO_off,"off"]
          ]), "OPERATOR")
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.dplay_select_led = function (sprite, script) {
    var port1 = script.getField("PORT");
    var port = 7;
    if (port1 == "7") port = 7;
    else if (port1 == "8") port = 8;
    else if (port1 == "9") port = 9;
    else if (port1 == "10") port = 10;
    var operator = script.getField("OPERATOR");
    var value = operator == "on" ? 255 : 0;
    Entry.hw.setDigitalPortValue(port, value);
    return script.callReturn();
};

Blockly.Blocks.dplay_get_switch_status = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField("디지털 ");
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['2',"2"],
          ['4',"4"]
          ]), "PORT")
    this.appendDummyInput()
        .appendField(Lang.Blocks.dplay_num_pin_2)
        .appendField(new Blockly.FieldDropdown([
          [Lang.Blocks.dplay_string_5,"ON"],
          [Lang.Blocks.dplay_string_6,"OFF"]
          ]), "STATUS")
        .appendField(' ');
    this.setInputsInline(true);
    this.setOutput(true, 'Boolean');
  }
};

Entry.block.dplay_get_switch_status = function (sprite, script) {
    var port1 = script.getField("PORT");
    var port = 2;
    if (port1 == "2") port = 2;
    else if (port1 == "4") port = 4;
    var value1 = script.getField("STATUS");
    if (value1 == "OFF") return Entry.hw.getDigitalPortValue(port) == 1 ? 1 : 0;
    else return Entry.hw.getDigitalPortValue(port) == 0 ? 1 : 0;
};

Blockly.Blocks.dplay_get_light_status = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField(Lang.Blocks.dplay_light)
        .appendField(new Blockly.FieldDropdown([
          [Lang.Blocks.dplay_string_3,"BRIGHT"],
          [Lang.Blocks.dplay_string_4,"DARK"]
          ]), "STATUS")
        .appendField(' ');
    this.setInputsInline(true);
    this.setOutput(true, 'Boolean');
  }
};

Entry.block.dplay_get_light_status = function (sprite, script) {
    var value1 = script.getField("STATUS", script);
    var value2 = 1;
    if (value1 == "DARK") return Entry.hw.getAnalogPortValue(value2) > 800 ? 1 : 0;
    else return Entry.hw.getAnalogPortValue(value2) < 800 ? 1 : 0;
};

Blockly.Blocks.dplay_get_value = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField(Lang.Blocks.dplay_num_pin_3);
    this.appendValueInput("VALUE")
        .setCheck(["Number", "String", null]);
    this.appendDummyInput()
        .appendField("번 ");
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['가변저항',"ADJU"],
          ['빛센서',"LIGHT"],
          ['온도센서',"TEMP"],
          ['조이스틱 X',"JOYS"],
          ['조이스틱 Y',"JOYS"],
          ['적외선',"INFR"]
          ]), "OPERATOR")
    this.appendDummyInput()
        .appendField(Lang.Blocks.dplay_num_pin_5)
    this.setInputsInline(true);
    this.setOutput(true, 'Number');
  }
};

Entry.block.dplay_get_value = function (sprite, script) {
    var signal = script.getValue("VALUE", script);
    return Entry.hw.getAnalogPortValue(signal[1]);
};

Blockly.Blocks.dplay_get_tilt = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField(Lang.Blocks.dplay_tilt)
        .appendField(new Blockly.FieldDropdown([
          ['왼쪽 기울임',"LEFT"],
          ['오른쪽 기울임',"LIGHT"]
          ]), "STATUS")
        .appendField(' ');
    this.setInputsInline(true);
    this.setOutput(true, 'Boolean');
  }
};

Entry.block.dplay_get_tilt = function (sprite, script) {
    var value1 = script.getField("STATUS", script);
    var value2 = 12;
    if (value1 == "LIGHT") return Entry.hw.getDigitalPortValue(value2) == 1 ? 1 : 0;
    else return Entry.hw.getDigitalPortValue(value2) == 0 ? 1 : 0;
};

Blockly.Blocks.dplay_DCmotor = {
    init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['왼쪽',"3"],
          ['오른쪽',"6"]
          ]), "PORT");
    this.appendDummyInput()
        .appendField(' DC모터 상태를');
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['정방향',"FRONT"],
          ['역방향',"REAR"],
          ['정지',"OFF"]
          ]), "OPERATOR")
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.dplay_DCmotor = function (sprite, script) {
    var port1 = script.getField("PORT");
    var port2 = 0;
    if (port1 == "3") port2 = 5;
    else if (port1 == "6") port2 = 11;
    var operator = script.getField("OPERATOR");
    var value1 = 0;
    var value2 = 0;
    if (operator == "FRONT") {
        value1 = 255;
        value2 = 0;
    }
    else if (operator == "REAR") {
        value1 = 0;
        value2 = 255;
    }
    else if (operator == "OFF") {
        value1 = 0;
        value2 = 0;
    }
    Entry.hw.setDigitalPortValue(port1, value1);
    Entry.hw.setDigitalPortValue(port2, value2);
    return script.callReturn();
};

Blockly.Blocks.dplay_buzzer = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField('부저를 ');
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['도',"1"],
          ['레',"2"],
          ['미',"3"]
          ]), "PORT");
    this.appendDummyInput()
        .appendField('로');
    this.appendValueInput("VALUE")
        .setCheck(["Number", "String", null]);
    this.appendDummyInput()
        .appendField('박자로 연주하기');
    this.appendDummyInput()
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.dplay_buzzer = function (sprite, script) {
    var port1 = script.getField("PORT");
    var port = 2;
    if (port1 == "1") port = 2;
    else if (port1 == "2") port = 4;
    else if (port1 == "3") port = 7;
    var value = script.getNumberValue("VALUE");
    value = Math.round(value);
    value = Math.max(value, 0);
    value = Math.min(value, 100);
    Entry.hw.setDigitalPortValue(port, value);
    return script.callReturn();
};

Blockly.Blocks.dplay_servo = {
  init: function() {
    this.setColour("#00979D");
    this.appendDummyInput()
        .appendField('서보모터 각도를');
    this.appendValueInput("VALUE")
        .setCheck(["Number", "String"]);
    this.appendDummyInput()
        .appendField('로 이동');
    this.appendDummyInput()
        .appendField(new Blockly.FieldIcon(Entry.mediaFilePath + 'block_icon/hardware_03.png', '*'));
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Entry.block.dplay_servo = function (sprite, script) {
    var port = 9;
    var value = script.getNumberValue("VALUE");
    value = Math.round(value);
    value = Math.max(value, 0);
    value = Math.min(value, 180);
    Entry.hw.setDigitalPortValue(port, value);
    return script.callReturn();
};

//rokoboard start

Entry.rokoboard = {
    name: 'rokoboard',
    setZero: Entry.Arduino.setZero,
    monitorTemplate: Entry.Arduino.monitorTemplate
};
