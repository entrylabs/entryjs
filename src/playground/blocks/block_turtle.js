Entry.Turtle = {
    PORT_MAP: {
        module: 'turtle',
        leftWheel: 0,
        rightWheel: 0,
        ledRed: 0,
        ledGreen: 0,
        ledBlue: 0,
        buzzer: 0,
        pulse: 0,
        pulseId: 0,
        note: 0,
        sound: 0,
        soundRepeat: 1,
        soundId: 0,
        lineTracerMode: 0,
        lineTracerModeId: 0,
        lineTracerGain: 5,
        lineTracerSpeed: 5,
        motionId: 0,
        motionType: 0,
        motionUnit: 0,
        motionSpeed: 0,
        motionValue: 0,
        motionRadius: 0
    },
    setZero: function() {
        var portMap = Entry.Turtle.PORT_MAP;
        var sq = Entry.hw.sendQueue;
        for (var port in portMap) {
            sq[port] = portMap[port];
        }
        Entry.hw.update();
        var turtle = Entry.Turtle;
        turtle.pulseId = 0;
        turtle.soundId = 0;
        turtle.lineTracerModeId = 0;
        turtle.motionId = 0;
        turtle.clickedId = -1;
        turtle.doubleClickedId = -1;
        turtle.longPressedId = -1;
        turtle.colorPatternId = -1;
        turtle.wheelStateId = -1;
        turtle.soundStateId = -1;
        turtle.lineTracerStateId = -1;
        turtle.tempo = 60;
        turtle.removeAllTimeouts();
    },
    pulseId: 0,
    soundId: 0,
    lineTracerModeId: 0,
    motionId: 0,
    clickedId: -1,
    doubleClickedId: -1,
    longPressedId: -1,
    colorPatternId: -1,
    wheelStateId: -1,
    soundStateId: -1,
    lineTracerStateId: -1,
    tempo: 60,
    timeouts: [],
    removeTimeout: function(id) {
        clearTimeout(id);
        var timeouts = this.timeouts;
        var index = timeouts.indexOf(id);
        if (index >= 0) {
            timeouts.splice(index, 1);
        }
    },
    removeAllTimeouts: function() {
        var timeouts = this.timeouts;
        for (var i in timeouts) {
            clearTimeout(timeouts[i]);
        }
        this.timeouts = [];
    },
    setModule: function(sq) {
        sq.module = 'turtle';
    },
    setPulse: function(sq, pulse) {
        this.pulseId = (this.pulseId % 255) + 1;
        sq.pulse = pulse;
        sq.pulseId = this.pulseId;
    },
    setSound: function(sq, sound, count) {
        if (typeof count != "number") count = 1;
        if (count < 0) count = -1;
        if (count) {
            this.soundId = (this.soundId % 255) + 1;
            sq.sound = sound;
            sq.soundRepeat = count;
            sq.soundId = this.soundId;
        }
    },
    setLineTracerMode: function(sq, mode) {
        this.lineTracerModeId = (this.lineTracerModeId % 255) + 1;
        sq.lineTracerMode = mode;
        sq.lineTracerModeId = this.lineTracerModeId;
    },
    setMotion: function(sq, type, unit, speed, value, radius) {
        this.motionId = (this.motionId % 255) + 1;
        sq.motionType = type;
        sq.motionUnit = unit;
        sq.motionSpeed = speed;
        sq.motionValue = value;
        sq.motionRadius = radius;
        sq.motionId = this.motionId;
    },
    setLedColor: function(sq, color) {
        if (color == "RED") {
            sq.ledRed = 255;
            sq.ledGreen = 0;
            sq.ledBlue = 0;
        } else if (color == "ORANGE") {
            sq.ledRed = 255;
            sq.ledGreen = 63;
            sq.ledBlue = 0;
        } else if (color == "YELLOW") {
            sq.ledRed = 255;
            sq.ledGreen = 255;
            sq.ledBlue = 0;
        } else if (color == "GREEN") {
            sq.ledRed = 0;
            sq.ledGreen = 255;
            sq.ledBlue = 0;
        } else if (color == "CYAN") {
            sq.ledRed = 0;
            sq.ledGreen = 255;
            sq.ledBlue = 255;
        } else if (color == "BLUE") {
            sq.ledRed = 0;
            sq.ledGreen = 0;
            sq.ledBlue = 255;
        } else if (color == "VIOLET") {
            sq.ledRed = 63;
            sq.ledGreen = 0;
            sq.ledBlue = 255;
        } else if (color == "MAGENTA") {
            sq.ledRed = 255;
            sq.ledGreen = 0;
            sq.ledBlue = 255;
        } else if (color == "WHITE") {
            sq.ledRed = 255;
            sq.ledGreen = 255;
            sq.ledBlue = 255;
        }
    },
    name: 'turtle',
    monitorTemplate: {
        imgPath: "hw/turtle.png",
        width: 480,
        height: 354,
        listPorts: {
            "colorNumber": { name: Lang.Blocks.ROBOID_color_number, type: "input", pos: { x: 0, y: 0 } },
            "accelerationX": { name: Lang.Blocks.ROBOID_acceleration_x, type: "input", pos: { x: 0, y: 0 } },
            "accelerationY": { name: Lang.Blocks.ROBOID_acceleration_y, type: "input", pos: { x: 0, y: 0 } },
            "accelerationZ": { name: Lang.Blocks.ROBOID_acceleration_z, type: "input", pos: { x: 0, y: 0 } },
            "buzzer": { name: Lang.Blocks.ROBOID_buzzer, type: "output", pos: { x: 0, y: 0 } },
            "note": { name: Lang.Blocks.ROBOID_note, type: "output", pos: { x: 0, y: 0 } }
        },
        ports: {
            "floor": { name: Lang.Blocks.ROBOID_floor, type: "input", pos: { x: 193, y: 342 } },
            "button": { name: Lang.Blocks.ROBOID_button, type: "input", pos: { x: 290, y: 30 } },
            "ledRed": { name: Lang.Blocks.ROBOID_head_color + " R", type: "output", pos: { x: 140, y: 280 } },
            "ledGreen": { name: Lang.Blocks.ROBOID_head_color + " G", type: "output", pos: { x: 140, y: 280 } },
            "ledBlue": { name: Lang.Blocks.ROBOID_head_color + " B", type: "output", pos: { x: 140, y: 280 } },
            "leftWheel": { name: Lang.Blocks.ROBOID_left_wheel, type: "output", pos: { x: 363, y: 319 } },
            "rightWheel": { name: Lang.Blocks.ROBOID_right_wheel, type: "output", pos: { x: 120, y: 86 } }
        },
        mode: 'both'
    }
};
Entry.Roboid = {
    TURTLE_SENSOR: {
        floor: 0,
        accelerationX: 0,
        accelerationY: 0,
        accelerationZ: 0,
        button: 0,
        colorNumber: -1,
        colorPattern: -1
    },
    robots: {},
    setZero: function() {
        var robots = Entry.Roboid.robots;
        for (var i in robots) {
            robots[i].setZero();
        }
        Entry.hw.update();
        Entry.Roboid.removeAllTimeouts();
    },
    createHamster: function(index) {
        var hamster = {
            packet: {
                module: 'hamster',
                index: index
            },
            lineTracerModeId: 0,
            lineTracerStateId: -1,
            tempo: 60,
            boardCommand: 0,
            setZero: function() {
                var portMap = Entry.Hamster.PORT_MAP;
                var packet = this.packet;
                for (var p in portMap) {
                    packet[p] = portMap[p];
                }
                this.lineTracerModeId = 0;
                this.lineTracerStateId = -1;
                this.tempo = 60;
                this.boardCommand = 0;
            },
            setLineTracerMode: function(mode) {
                this.lineTracerModeId = (this.lineTracerModeId % 255) + 1;
                this.packet.lineTracerMode = mode;
                this.packet.lineTracerModeId = this.lineTracerModeId;
            }
        };
        return hamster;
    },
    createTurtle: function(index) {
        var turtle = {
            packet: {
                module: 'turtle',
                index: index
            },
            pulseId: 0,
            soundId: 0,
            lineTracerModeId: 0,
            motionId: 0,
            clickedId: -1,
            doubleClickedId: -1,
            longPressedId: -1,
            colorPatternId: -1,
            wheelStateId: -1,
            soundStateId: -1,
            lineTracerStateId: -1,
            tempo: 60,
            setZero: function() {
                var portMap = Entry.Turtle.PORT_MAP;
                var packet = this.packet;
                for (var p in portMap) {
                    packet[p] = portMap[p];
                }
                this.pulseId = 0;
                this.soundId = 0;
                this.lineTracerModeId = 0;
                this.motionId = 0;
                this.clickedId = -1;
                this.doubleClickedId = -1;
                this.longPressedId = -1;
                this.colorPatternId = -1;
                this.wheelStateId = -1;
                this.soundStateId = -1;
                this.lineTracerStateId = -1;
                this.tempo = 60;
            },
            setPulse: function(pulse) {
                this.pulseId = (this.pulseId % 255) + 1;
                var packet = this.packet;
                packet.pulse = pulse;
                packet.pulseId = this.pulseId;
            },
            setSound: function(sound, count) {
                if (typeof count != "number") count = 1;
                if (count < 0) count = -1;
                if (count) {
                    this.soundId = (this.soundId % 255) + 1;
                    var packet = this.packet;
                    packet.sound = sound;
                    packet.soundRepeat = count;
                    packet.soundId = this.soundId;
                }
            },
            setLineTracerMode: function(mode) {
                this.lineTracerModeId = (this.lineTracerModeId % 255) + 1;
                var packet = this.packet;
                packet.lineTracerMode = mode;
                packet.lineTracerModeId = this.lineTracerModeId;
            },
            setMotion: function(type, unit, speed, value, radius) {
                this.motionId = (this.motionId % 255) + 1;
                var packet = this.packet;
                packet.motionType = type;
                packet.motionUnit = unit;
                packet.motionSpeed = speed;
                packet.motionValue = value;
                packet.motionRadius = radius;
                packet.motionId = this.motionId;
            },
            setLedColor: function(color) {
                var packet = this.packet;
                if (color == "RED") {
                    packet.ledRed = 255;
                    packet.ledGreen = 0;
                    packet.ledBlue = 0;
                } else if (color == "ORANGE") {
                    packet.ledRed = 255;
                    packet.ledGreen = 63;
                    packet.ledBlue = 0;
                } else if (color == "YELLOW") {
                    packet.ledRed = 255;
                    packet.ledGreen = 255;
                    packet.ledBlue = 0;
                } else if (color == "GREEN") {
                    packet.ledRed = 0;
                    packet.ledGreen = 255;
                    packet.ledBlue = 0;
                } else if (color == "CYAN") {
                    packet.ledRed = 0;
                    packet.ledGreen = 255;
                    packet.ledBlue = 255;
                } else if (color == "BLUE") {
                    packet.ledRed = 0;
                    packet.ledGreen = 0;
                    packet.ledBlue = 255;
                } else if (color == "VIOLET") {
                    packet.ledRed = 63;
                    packet.ledGreen = 0;
                    packet.ledBlue = 255;
                } else if (color == "MAGENTA") {
                    packet.ledRed = 255;
                    packet.ledGreen = 0;
                    packet.ledBlue = 255;
                } else if (color == "WHITE") {
                    packet.ledRed = 255;
                    packet.ledGreen = 255;
                    packet.ledBlue = 255;
                }
            }
        };
        return turtle;
    },
    getHamster: function(index) {
        var key = 'hamster' + index;
        var robot = this.robots[key];
        if (!robot) {
            robot = this.createHamster(index);
            this.robots[key] = robot;
            Entry.hw.sendQueue[key] = robot.packet;
        }
        return robot;
    },
    getTurtle: function(index) {
        var key = 'turtle' + index;
        var robot = this.robots[key];
        if (!robot) {
            robot = this.createTurtle(index);
            this.robots[key] = robot;
            Entry.hw.sendQueue[key] = robot.packet;
        }
        return robot;
    },
    timeouts: [],
    removeTimeout: function(id) {
        clearTimeout(id);
        var timeouts = this.timeouts;
        var index = timeouts.indexOf(id);
        if (index >= 0) {
            timeouts.splice(index, 1);
        }
    },
    removeAllTimeouts: function() {
        var timeouts = this.timeouts;
        for (var i in timeouts) {
            clearTimeout(timeouts[i]);
        }
        this.timeouts = [];
    },
    name: "roboid",
    monitorTemplate: {
        imgPath: "hw/transparent.png",
        width: 2,
        height: 2,
        listPorts: {
            hamster0leftProximity: { name: Lang.Menus.hamster + ' 0: ' + Lang.Blocks.HAMSTER_sensor_left_proximity, type: "input", pos: { x: 0, y: 0 } },
            hamster0rightProximity: { name: Lang.Menus.hamster + ' 0: ' + Lang.Blocks.HAMSTER_sensor_right_proximity, type: "input", pos: { x: 0, y: 0 } },
            hamster0leftFloor: { name: Lang.Menus.hamster + ' 0: ' + Lang.Blocks.HAMSTER_sensor_left_floor, type: "input", pos: { x: 0, y: 0 } },
            hamster0rightFloor: { name: Lang.Menus.hamster + ' 0: ' + Lang.Blocks.HAMSTER_sensor_right_floor, type: "input", pos: { x: 0, y: 0 } },
            hamster0accelerationX: { name: Lang.Menus.hamster + ' 0: ' + Lang.Blocks.HAMSTER_sensor_acceleration_x, type: "input", pos: { x: 0, y: 0 } },
            hamster0accelerationY: { name: Lang.Menus.hamster + ' 0: ' + Lang.Blocks.HAMSTER_sensor_acceleration_y, type: "input", pos: { x: 0, y: 0 } },
            hamster0accelerationZ: { name: Lang.Menus.hamster + ' 0: ' + Lang.Blocks.HAMSTER_sensor_acceleration_z, type: "input", pos: { x: 0, y: 0 } },
            hamster0light: { name: Lang.Menus.hamster + ' 0: ' + Lang.Blocks.HAMSTER_sensor_light, type: "input", pos: { x: 0, y: 0 } },
            hamster0temperature: { name: Lang.Menus.hamster + ' 0: ' + Lang.Blocks.HAMSTER_sensor_temperature, type: "input", pos: { x: 0, y: 0 } },
            hamster0inputA: { name: Lang.Menus.hamster + ' 0: ' + Lang.Blocks.HAMSTER_sensor_input_a, type: "input", pos: { x: 0, y: 0 } },
            hamster0inputB: { name: Lang.Menus.hamster + ' 0: ' + Lang.Blocks.HAMSTER_sensor_input_b, type: "input", pos: { x: 0, y: 0 } },

            turtle0colorNumber: { name: Lang.Menus.turtle + ' 0: ' + Lang.Blocks.ROBOID_color_number, type: "input", pos: { x: 0, y: 0 } },
            turtle0floor: { name: Lang.Menus.turtle + ' 0: ' + Lang.Blocks.ROBOID_floor, type: "input", pos: { x: 193, y: 342 } },
            turtle0button: { name: Lang.Menus.turtle + ' 0: ' + Lang.Blocks.ROBOID_button, type: "input", pos: { x: 290, y: 30 } },
            turtle0accelerationX: { name: Lang.Menus.turtle + ' 0: ' + Lang.Blocks.ROBOID_acceleration_x, type: "input", pos: { x: 0, y: 0 } },
            turtle0accelerationY: { name: Lang.Menus.turtle + ' 0: ' + Lang.Blocks.ROBOID_acceleration_y, type: "input", pos: { x: 0, y: 0 } },
            turtle0accelerationZ: { name: Lang.Menus.turtle + ' 0: ' + Lang.Blocks.ROBOID_acceleration_z, type: "input", pos: { x: 0, y: 0 } },

            hamster1leftProximity: { name: Lang.Menus.hamster + ' 1: ' + Lang.Blocks.HAMSTER_sensor_left_proximity, type: "input", pos: { x: 0, y: 0 } },
            hamster1rightProximity: { name: Lang.Menus.hamster + ' 1: ' + Lang.Blocks.HAMSTER_sensor_right_proximity, type: "input", pos: { x: 0, y: 0 } },
            hamster1leftFloor: { name: Lang.Menus.hamster + ' 1: ' + Lang.Blocks.HAMSTER_sensor_left_floor, type: "input", pos: { x: 0, y: 0 } },
            hamster1rightFloor: { name: Lang.Menus.hamster + ' 1: ' + Lang.Blocks.HAMSTER_sensor_right_floor, type: "input", pos: { x: 0, y: 0 } },
            hamster1accelerationX: { name: Lang.Menus.hamster + ' 1: ' + Lang.Blocks.HAMSTER_sensor_acceleration_x, type: "input", pos: { x: 0, y: 0 } },
            hamster1accelerationY: { name: Lang.Menus.hamster + ' 1: ' + Lang.Blocks.HAMSTER_sensor_acceleration_y, type: "input", pos: { x: 0, y: 0 } },
            hamster1accelerationZ: { name: Lang.Menus.hamster + ' 1: ' + Lang.Blocks.HAMSTER_sensor_acceleration_z, type: "input", pos: { x: 0, y: 0 } },
            hamster1light: { name: Lang.Menus.hamster + ' 1: ' + Lang.Blocks.HAMSTER_sensor_light, type: "input", pos: { x: 0, y: 0 } },
            hamster1temperature: { name: Lang.Menus.hamster + ' 1: ' + Lang.Blocks.HAMSTER_sensor_temperature, type: "input", pos: { x: 0, y: 0 } },
            hamster1inputA: { name: Lang.Menus.hamster + ' 1: ' + Lang.Blocks.HAMSTER_sensor_input_a, type: "input", pos: { x: 0, y: 0 } },
            hamster1inputB: { name: Lang.Menus.hamster + ' 1: ' + Lang.Blocks.HAMSTER_sensor_input_b, type: "input", pos: { x: 0, y: 0 } },

            turtle1colorNumber: { name: Lang.Menus.turtle + ' 1: ' + Lang.Blocks.ROBOID_color_number, type: "input", pos: { x: 0, y: 0 } },
            turtle1floor: { name: Lang.Menus.turtle + ' 1: ' + Lang.Blocks.ROBOID_floor, type: "input", pos: { x: 193, y: 342 } },
            turtle1button: { name: Lang.Menus.turtle + ' 1: ' + Lang.Blocks.ROBOID_button, type: "input", pos: { x: 290, y: 30 } },
            turtle1accelerationX: { name: Lang.Menus.turtle + ' 1: ' + Lang.Blocks.ROBOID_acceleration_x, type: "input", pos: { x: 0, y: 0 } },
            turtle1accelerationY: { name: Lang.Menus.turtle + ' 1: ' + Lang.Blocks.ROBOID_acceleration_y, type: "input", pos: { x: 0, y: 0 } },
            turtle1accelerationZ: { name: Lang.Menus.turtle + ' 1: ' + Lang.Blocks.ROBOID_acceleration_z, type: "input", pos: { x: 0, y: 0 } },

            hamster2leftProximity: { name: Lang.Menus.hamster + ' 2: ' + Lang.Blocks.HAMSTER_sensor_left_proximity, type: "input", pos: { x: 0, y: 0 } },
            hamster2rightProximity: { name: Lang.Menus.hamster + ' 2: ' + Lang.Blocks.HAMSTER_sensor_right_proximity, type: "input", pos: { x: 0, y: 0 } },
            hamster2leftFloor: { name: Lang.Menus.hamster + ' 2: ' + Lang.Blocks.HAMSTER_sensor_left_floor, type: "input", pos: { x: 0, y: 0 } },
            hamster2rightFloor: { name: Lang.Menus.hamster + ' 2: ' + Lang.Blocks.HAMSTER_sensor_right_floor, type: "input", pos: { x: 0, y: 0 } },
            hamster2accelerationX: { name: Lang.Menus.hamster + ' 2: ' + Lang.Blocks.HAMSTER_sensor_acceleration_x, type: "input", pos: { x: 0, y: 0 } },
            hamster2accelerationY: { name: Lang.Menus.hamster + ' 2: ' + Lang.Blocks.HAMSTER_sensor_acceleration_y, type: "input", pos: { x: 0, y: 0 } },
            hamster2accelerationZ: { name: Lang.Menus.hamster + ' 2: ' + Lang.Blocks.HAMSTER_sensor_acceleration_z, type: "input", pos: { x: 0, y: 0 } },
            hamster2light: { name: Lang.Menus.hamster + ' 2: ' + Lang.Blocks.HAMSTER_sensor_light, type: "input", pos: { x: 0, y: 0 } },
            hamster2temperature: { name: Lang.Menus.hamster + ' 2: ' + Lang.Blocks.HAMSTER_sensor_temperature, type: "input", pos: { x: 0, y: 0 } },
            hamster2inputA: { name: Lang.Menus.hamster + ' 2: ' + Lang.Blocks.HAMSTER_sensor_input_a, type: "input", pos: { x: 0, y: 0 } },
            hamster2inputB: { name: Lang.Menus.hamster + ' 2: ' + Lang.Blocks.HAMSTER_sensor_input_b, type: "input", pos: { x: 0, y: 0 } },

            turtle2colorNumber: { name: Lang.Menus.turtle + ' 2: ' + Lang.Blocks.ROBOID_color_number, type: "input", pos: { x: 0, y: 0 } },
            turtle2floor: { name: Lang.Menus.turtle + ' 2: ' + Lang.Blocks.ROBOID_floor, type: "input", pos: { x: 193, y: 342 } },
            turtle2button: { name: Lang.Menus.turtle + ' 2: ' + Lang.Blocks.ROBOID_button, type: "input", pos: { x: 290, y: 30 } },
            turtle2accelerationX: { name: Lang.Menus.turtle + ' 2: ' + Lang.Blocks.ROBOID_acceleration_x, type: "input", pos: { x: 0, y: 0 } },
            turtle2accelerationY: { name: Lang.Menus.turtle + ' 2: ' + Lang.Blocks.ROBOID_acceleration_y, type: "input", pos: { x: 0, y: 0 } },
            turtle2accelerationZ: { name: Lang.Menus.turtle + ' 2: ' + Lang.Blocks.ROBOID_acceleration_z, type: "input", pos: { x: 0, y: 0 } },
        },
        mode: "both"
    }
};