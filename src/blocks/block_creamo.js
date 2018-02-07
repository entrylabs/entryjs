"use static"

Entry.Creamo = {
    name: 'creamo',
    setZero: function () {
        Entry.hw.sendQueue.readablePorts = [];
        for (var port = 0; port < 20; port++) {
            Entry.hw.sendQueue[port] = 0;
            Entry.hw.sendQueue.readablePorts.push(port);
        }
        Entry.hw.update();
    },
    //수정 
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
    monitorTemplate: {
        imgPath: "hw/arduino.png",
        width: 200,
        height: 200,
        listPorts: {
            "1": { name: Lang.Hw.port_en + " LED1 " + Lang.Hw.port_ko, type: "input", pos: { x: 0, y: 0 } },
            "2": { name: Lang.Hw.port_en + " LED2 " + Lang.Hw.port_ko, type: "input", pos: { x: 0, y: 0 } },
            "3": { name: Lang.Hw.port_en + " 4 " + Lang.Hw.port_ko, type: "input", pos: { x: 0, y: 0 } },
            "4": { name: Lang.Hw.port_en + " 5 " + Lang.Hw.port_ko, type: "input", pos: { x: 0, y: 0 } },
            "6": { name: Lang.Hw.port_en + " 6 " + Lang.Hw.port_ko, type: "input", pos: { x: 0, y: 0 } },
            "7": { name: Lang.Hw.port_en + " 7 " + Lang.Hw.port_ko, type: "input", pos: { x: 0, y: 0 } },
            "8": { name: Lang.Hw.port_en + " 8 " + Lang.Hw.port_ko, type: "input", pos: { x: 0, y: 0 } },
            "9": { name: Lang.Hw.port_en + " 9 " + Lang.Hw.port_ko, type: "input", pos: { x: 0, y: 0 } },
            "10": { name: Lang.Hw.port_en + " 10 " + Lang.Hw.port_ko, type: "input", pos: { x: 0, y: 0 } },
            "11": { name: Lang.Hw.port_en + " 11 " + Lang.Hw.port_ko, type: "input", pos: { x: 0, y: 0 } },
            "12": { name: Lang.Hw.port_en + " 12 " + Lang.Hw.port_ko, type: "input", pos: { x: 0, y: 0 } },
            "13": { name: Lang.Hw.port_en + " 13 " + Lang.Hw.port_ko, type: "input", pos: { x: 0, y: 0 } },
            "a0": { name: Lang.Hw.port_en + " A0 " + Lang.Hw.port_ko, type: "input", pos: { x: 0, y: 0 } },
            "a1": { name: Lang.Hw.port_en + " A1 " + Lang.Hw.port_ko, type: "input", pos: { x: 0, y: 0 } },
            "a2": { name: Lang.Hw.port_en + " A2 " + Lang.Hw.port_ko, type: "input", pos: { x: 0, y: 0 } },
            "a3": { name: Lang.Hw.port_en + " A3 " + Lang.Hw.port_ko, type: "input", pos: { x: 0, y: 0 } },
            "a4": { name: Lang.Hw.port_en + " A4 " + Lang.Hw.port_ko, type: "input", pos: { x: 0, y: 0 } },
            "a5": { name: Lang.Hw.port_en + " A5 " + Lang.Hw.port_ko, type: "input", pos: { x: 0, y: 0 } }
        },
        mode: 'both'
    }
};