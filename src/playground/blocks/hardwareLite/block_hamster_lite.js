'use strict';

(function () {
    const COLOR_TO_RGB = [
        [0, 0, 0],
        [0, 0, 255],
        [0, 255, 0],
        [0, 255, 255],
        [255, 0, 0],
        [255, 0, 255],
        [255, 255, 0],
        [255, 255, 255],
    ];

    Entry.HamsterLite = new (class HamsterLite {
        constructor() {
            this.id = '2.4';
            this.url = 'http://www.robomation.net';
            this.imageName = 'hamsterlite.png';
            this.name = 'HamsterLite';
            this.delimeter = '\r';
            this.blockMenuBlocks = [
                'hamsterlite_hand_found',
                'hamsterlite_boolean',
                'hamsterlite_value',
                'hamsterlite_move_forward_once',
                'hamsterlite_turn_once',
                'hamsterlite_move_forward_for_secs',
                'hamsterlite_move_backward_for_secs',
                'hamsterlite_turn_for_secs',
                'hamsterlite_change_both_wheels_by',
                'hamsterlite_set_both_wheels_to',
                'hamsterlite_change_wheel_by',
                'hamsterlite_set_wheel_to',
                'hamsterlite_follow_line_using',
                'hamsterlite_follow_line_until',
                'hamsterlite_set_following_speed_to',
                'hamsterlite_stop',
                'hamsterlite_set_led_to',
                'hamsterlite_clear_led',
                'hamsterlite_beep',
                'hamsterlite_change_buzzer_by',
                'hamsterlite_set_buzzer_to',
                'hamsterlite_clear_buzzer',
                'hamsterlite_play_note',
                'hamsterlite_play_note_for',
                'hamsterlite_rest_for',
                'hamsterlite_change_tempo_by',
                'hamsterlite_set_tempo_to',
                'hamsterlite_set_port_to',
                'hamsterlite_change_output_by',
                'hamsterlite_set_output_to',
                'hamsterlite_gripper',
                'hamsterlite_release_gripper',
            ];
            this.__SENSORS = {
                SIGNAL_STRENGTH: 'signalStrength',
                LEFT_PROXIMITY: 'leftProximity',
                RIGHT_PROXIMITY: 'rightProximity',
                LEFT_FLOOR: 'leftFloor',
                RIGHT_FLOOR: 'rightFloor',
                ACCELERATION_X: 'accelerationX',
                ACCELERATION_Y: 'accelerationY',
                ACCELERATION_Z: 'accelerationZ',
                LIGHT: 'light',
                TEMPERATURE: 'temperature',
                INPUT_A: 'inputA',
                INPUT_B: 'inputB',
            };
            this.__COLORS = {
                RED: 4,
                ORANGE: 4,
                YELLOW: 6,
                GREEN: 2,
                SKY_BLUE: 3,
                BLUE: 1,
                VIOLET: 5,
                PURPLE: 5,
                WHITE: 7,
                4: 4,
                6: 6,
                2: 2,
                3: 3,
                1: 1,
                5: 5,
                7: 7,
            };
            this.__RGB_COLORS = {
                RED: [255, 0, 0],
                ORANGE: [255, 63, 0],
                YELLOW: [255, 255, 0],
                GREEN: [0, 255, 0],
                SKY_BLUE: [0, 255, 255],
                BLUE: [0, 0, 255],
                VIOLET: [63, 0, 255],
                PURPLE: [255, 0, 255],
                WHITE: [255, 255, 255],
                4: [255, 0, 0],
                6: [255, 255, 0],
                2: [0, 255, 0],
                3: [0, 255, 255],
                1: [0, 0, 255],
                5: [255, 0, 255],
                7: [255, 255, 255],
            };
            this.__NOTES = {
                C: 4,
                'C#': 5,
                Db: 5,
                D: 6,
                'D#': 7,
                Eb: 7,
                E: 8,
                F: 9,
                'F#': 10,
                Gb: 10,
                G: 11,
                'G#': 12,
                Ab: 12,
                A: 13,
                'A#': 14,
                Bb: 14,
                B: 15,
                4: 4,
                5: 5,
                6: 6,
                7: 7,
                8: 8,
                9: 9,
                10: 10,
                11: 11,
                12: 12,
                13: 13,
                14: 14,
                15: 15,
            };
            this.__IO_MODES = {
                ANALOG_INPUT: 0,
                DIGITAL_INPUT: 1,
                DIGITAL_INPUT_PULL_UP: 2,
                DIGITAL_INPUT_PULL_DOWN: 3,
                VOLTAGE_INPUT: 5,
                SERVO_OUTPUT: 8,
                PWM_OUTPUT: 9,
                DIGITAL_OUTPUT: 10,
                0: 0,
                1: 1,
                2: 2,
                3: 3,
                5: 5,
                8: 8,
                9: 9,
                10: 10,
            };
            this.portData = {
                baudRate: 115200,
                dataBits: 8,
                parity: 'none',
                stopBits: 1,
                connectionType: 'bytestream',
                bufferSize: 65536,
                constantServing: true,
                writeAscii: false,
                readAscii: true,
                flowControl: 'hardware',
            };
            this.setZero();
        }

        get monitorTemplate() {
            return {
                imgPath: 'hw_lite/hamsterlite.png',
                width: 256,
                height: 256,
                listPorts: {
                    temperature: {
                        name: Lang.Blocks.hamsterlite_sensor_temperature,
                        type: 'input',
                        pos: { x: 0, y: 0 },
                    },
                    inputA: {
                        name: Lang.Blocks.hamsterlite_sensor_input_a,
                        type: 'input',
                        pos: { x: 0, y: 0 },
                    },
                    inputB: {
                        name: Lang.Blocks.hamsterlite_sensor_input_b,
                        type: 'input',
                        pos: { x: 0, y: 0 },
                    },
                    accelerationX: {
                        name: Lang.Blocks.hamsterlite_sensor_acceleration_x,
                        type: 'input',
                        pos: { x: 0, y: 0 },
                    },
                    accelerationY: {
                        name: Lang.Blocks.hamsterlite_sensor_acceleration_y,
                        type: 'input',
                        pos: { x: 0, y: 0 },
                    },
                    accelerationZ: {
                        name: Lang.Blocks.hamsterlite_sensor_acceleration_z,
                        type: 'input',
                        pos: { x: 0, y: 0 },
                    },
                    buzzer: {
                        name: Lang.Hw.buzzer,
                        type: 'output',
                        pos: { x: 0, y: 0 },
                    },
                    note: { name: Lang.Hw.note, type: 'output', pos: { x: 0, y: 0 } },
                    outputA: {
                        name: `${Lang.Hw.output}A`,
                        type: 'output',
                        pos: { x: 0, y: 0 },
                    },
                    outputB: {
                        name: `${Lang.Hw.output}B`,
                        type: 'output',
                        pos: { x: 0, y: 0 },
                    },
                },
                ports: {
                    leftProximity: {
                        name: Lang.Blocks.hamsterlite_sensor_left_proximity,
                        type: 'input',
                        pos: { x: 122, y: 156 },
                    },
                    rightProximity: {
                        name: Lang.Blocks.hamsterlite_sensor_right_proximity,
                        type: 'input',
                        pos: { x: 10, y: 108 },
                    },
                    leftFloor: {
                        name: Lang.Blocks.hamsterlite_sensor_left_floor,
                        type: 'input',
                        pos: { x: 100, y: 234 },
                    },
                    rightFloor: {
                        name: Lang.Blocks.hamsterlite_sensor_right_floor,
                        type: 'input',
                        pos: { x: 13, y: 180 },
                    },
                    light: {
                        name: Lang.Blocks.hamsterlite_sensor_light,
                        type: 'input',
                        pos: { x: 56, y: 189 },
                    },
                    leftWheel: {
                        name: Lang.Hw.leftWheel,
                        type: 'output',
                        pos: { x: 209, y: 115 },
                    },
                    rightWheel: {
                        name: Lang.Hw.rightWheel,
                        type: 'output',
                        pos: { x: 98, y: 30 },
                    },
                    leftLed: {
                        name: `${Lang.Hw.left} ${Lang.Hw.led_en}`,
                        type: 'output',
                        pos: { x: 87, y: 210 },
                    },
                    rightLed: {
                        name: `${Lang.Hw.right} ${Lang.Hw.led_en}`,
                        type: 'output',
                        pos: { x: 24, y: 168 },
                    },
                },
                mode: 'both',
            };
        }

        setZero() {
            this.sensory = {
                signalStrength: 0,
                leftProximity: 0,
                rightProximity: 0,
                leftFloor: 0,
                rightFloor: 0,
                accelerationX: 0,
                accelerationY: 0,
                accelerationZ: 0,
                light: 0,
                temperature: 0,
                inputA: 0,
                inputB: 0,
                tilt: 0,
                batteryState: 2,
                lineTracerState: 0,
                lineTracerStateId: 0,
                batterytate: 2,
            };
            this.motoring = {
                leftWheel: 0,
                rightWheel: 0,
                buzzer: 0,
                outputA: 0,
                outputB: 0,
                topology: 0,
                leftLed: 0,
                rightLed: 0,
                note: 0,
                lineTracerMode: 0,
                lineTracerModeId: -1,
                lineTracerSpeed: 5,
                ioModeA: 0,
                ioModeB: 0,
                configProximity: 2,
                configGravity: 0,
                configBandWidth: 3,
            };
            this.lineTracer = {
                written: false,
                flag: 0,
                event: 0,
                state: 0,
                count: 0,
            };
            this.battery = {
                state: 2,
                data: new Array(10),
                sum: 0.0,
                index: 0,
                count: 0,
            };
            this.lineTracerModeId = 0;
            this.lineTracerStateId = -1;
            this.blockId = 0;
            this.wheelBlockId = 0;
            this.wheelTimer = undefined;
            this.lineTracerCallback = undefined;
            this.boardCommand = 0;
            this.boardState = 0;
            this.boardCount = 0;
            this.boardCallback = undefined;
            this.noteBlockId = 0;
            this.noteTimer1 = undefined;
            this.noteTimer2 = undefined;
            this.ioBlockId = 0;
            this.ioTimer = undefined;
            this.tempo = 60;
            this.timeouts = [];

            this.__removeAllTimeouts();
            if (Entry.hwLite) {
                Entry.hwLite.update();
            }
        }

        getMonitorPort() {
            return { ...this.sensory, ...this.motoring, ...this.lineTracer };
        }

        setMotoring(motoring) {
            this.motoring = motoring;
        }

        __removeTimeout(id) {
            clearTimeout(id);
            const idx = this.timeouts.indexOf(id);
            if (idx >= 0) {
                this.timeouts.splice(idx, 1);
            }
        }

        __removeAllTimeouts() {
            const timeouts = this.timeouts;
            for (const i in timeouts) {
                clearTimeout(timeouts[i]);
            }
            this.timeouts = [];
        }

        __issueWheelBlockId() {
            this.wheelBlockId = this.blockId = (this.blockId % 65535) + 1;
            return this.wheelBlockId;
        }

        __cancelWheel() {
            this.wheelBlockId = 0;
            if (this.wheelTimer !== undefined) {
                this.__removeTimeout(this.wheelTimer);
            }
            this.wheelTimer = undefined;
        }

        __setLineTracerMode(mode) {
            this.lineTracerModeId = (this.lineTracerModeId % 255) + 1;
            this.motoring.lineTracerMode = mode;
            this.motoring.lineTracerModeId = this.lineTracerModeId;
        }

        __cancelLineTracer() {
            this.lineTracerCallback = undefined;
        }

        __cancelBoard() {
            this.boardCommand = 0;
            this.boardState = 0;
            this.boardCount = 0;
            this.boardCallback = undefined;
        }

        __issueNoteBlockId() {
            this.noteBlockId = this.blockId = (this.blockId % 65535) + 1;
            return this.noteBlockId;
        }

        __cancelNote() {
            this.noteBlockId = 0;
            if (this.noteTimer1 !== undefined) {
                this.__removeTimeout(this.noteTimer1);
            }
            if (this.noteTimer2 !== undefined) {
                this.__removeTimeout(this.noteTimer2);
            }
            this.noteTimer1 = undefined;
            this.noteTimer2 = undefined;
        }

        __issueIoBlockId() {
            this.ioBlockId = this.blockId = (this.blockId % 65535) + 1;
            return this.ioBlockId;
        }

        __cancelIo() {
            this.ioBlockId = 0;
            if (this.ioTimer !== undefined) {
                this.__removeTimeout(this.ioTimer);
            }
            this.ioTimer = undefined;
        }

        handleSensory() {
            const self = this;
            const sensory = self.sensory;
            if (self.lineTracerCallback) {
                if (sensory.lineTracerStateId != self.lineTracerStateId) {
                    self.lineTracerStateId = sensory.lineTracerStateId;
                    if (sensory.lineTracerState == 0x40) {
                        self.__setLineTracerMode(0);
                        var callback = self.lineTracerCallback;
                        self.__cancelLineTracer();
                        if (callback) {
                            callback();
                        }
                    }
                }
            }
            if (self.boardCallback) {
                const motoring = self.motoring;
                if (self.boardCommand == 1) {
                    switch (self.boardState) {
                        case 1: {
                            if (self.boardCount < 2) {
                                if (sensory.leftFloor < 50 && sensory.rightFloor < 50) {
                                    self.boardCount++;
                                } else {
                                    self.boardCount = 0;
                                }
                                var diff = sensory.leftFloor - sensory.rightFloor;
                                motoring.leftWheel = 45 + diff * 0.25;
                                motoring.rightWheel = 45 - diff * 0.25;
                            } else {
                                self.boardCount = 0;
                                self.boardState = 2;
                            }
                            break;
                        }
                        case 2: {
                            var diff = sensory.leftFloor - sensory.rightFloor;
                            motoring.leftWheel = 45 + diff * 0.25;
                            motoring.rightWheel = 45 - diff * 0.25;
                            self.boardState = 3;
                            self.wheelTimer = setTimeout(() => {
                                motoring.leftWheel = 0;
                                motoring.rightWheel = 0;
                                self.boardState = 4;
                                if (self.wheelTimer !== undefined) {
                                    self.__removeTimeout(self.wheelTimer);
                                }
                                self.wheelTimer = undefined;
                            }, 250);
                            self.timeouts.push(self.wheelTimer);
                            break;
                        }
                        case 3: {
                            var diff = sensory.leftFloor - sensory.rightFloor;
                            motoring.leftWheel = 45 + diff * 0.25;
                            motoring.rightWheel = 45 - diff * 0.25;
                            break;
                        }
                        case 4: {
                            motoring.leftWheel = 0;
                            motoring.rightWheel = 0;
                            var callback = self.boardCallback;
                            self.__cancelBoard();
                            if (callback) {
                                callback();
                            }
                            break;
                        }
                    }
                } else if (self.boardCommand == 2) {
                    switch (self.boardState) {
                        case 1: {
                            if (self.boardCount < 2) {
                                if (sensory.leftFloor > 50) {
                                    self.boardCount++;
                                }
                            } else {
                                self.boardCount = 0;
                                self.boardState = 2;
                            }
                            break;
                        }
                        case 2: {
                            if (sensory.leftFloor < 20) {
                                self.boardState = 3;
                            }
                            break;
                        }
                        case 3: {
                            if (self.boardCount < 2) {
                                if (sensory.leftFloor < 20) {
                                    self.boardCount++;
                                }
                            } else {
                                self.boardCount = 0;
                                self.boardState = 4;
                            }
                            break;
                        }
                        case 4: {
                            if (sensory.leftFloor > 50) {
                                self.boardState = 5;
                            }
                            break;
                        }
                        case 5: {
                            var diff = sensory.leftFloor - sensory.rightFloor;
                            if (diff > -15) {
                                motoring.leftWheel = 0;
                                motoring.rightWheel = 0;
                                var callback = self.boardCallback;
                                self.__cancelBoard();
                                if (callback) {
                                    callback();
                                }
                            } else {
                                motoring.leftWheel = diff * 0.5;
                                motoring.rightWheel = -diff * 0.5;
                            }
                            break;
                        }
                    }
                } else if (self.boardCommand == 3) {
                    switch (self.boardState) {
                        case 1: {
                            if (self.boardCount < 2) {
                                if (sensory.rightFloor > 50) {
                                    self.boardCount++;
                                }
                            } else {
                                self.boardCount = 0;
                                self.boardState = 2;
                            }
                            break;
                        }
                        case 2: {
                            if (sensory.rightFloor < 20) {
                                self.boardState = 3;
                            }
                            break;
                        }
                        case 3: {
                            if (self.boardCount < 2) {
                                if (sensory.rightFloor < 20) {
                                    self.boardCount++;
                                }
                            } else {
                                self.boardCount = 0;
                                self.boardState = 4;
                            }
                            break;
                        }
                        case 4: {
                            if (sensory.rightFloor > 50) {
                                self.boardState = 5;
                            }
                            break;
                        }
                        case 5: {
                            var diff = sensory.rightFloor - sensory.leftFloor;
                            if (diff > -15) {
                                motoring.leftWheel = 0;
                                motoring.rightWheel = 0;
                                var callback = self.boardCallback;
                                self.__cancelBoard();
                                if (callback) {
                                    callback();
                                }
                            } else {
                                motoring.leftWheel = -diff * 0.5;
                                motoring.rightWheel = diff * 0.5;
                            }
                            break;
                        }
                    }
                }
            }
        }

        getValue(script) {
            const dev = script.getField('DEVICE');

            const sensor = this.__SENSORS[dev] || dev;
            return this.sensory[sensor];
        }

        checkBoolean(script) {
            const sensory = this.sensory;
            let value = 0;
            const dev = script.getField('DEVICE');

            if (dev.startsWith('TILT')) {
                if (
                    sensory.accelerationZ < 8192 &&
                    sensory.accelerationX > 8192 &&
                    sensory.accelerationY > -4096 &&
                    sensory.accelerationY < 4096
                ) {
                    value = 1;
                } else if (
                    sensory.accelerationZ < 8192 &&
                    sensory.accelerationX < -8192 &&
                    sensory.accelerationY > -4096 &&
                    sensory.accelerationY < 4096
                ) {
                    value = -1;
                } else if (
                    sensory.accelerationZ < 8192 &&
                    sensory.accelerationY > 8192 &&
                    sensory.accelerationX > -4096 &&
                    sensory.accelerationX < 4096
                ) {
                    value = 2;
                } else if (
                    sensory.accelerationZ < 8192 &&
                    sensory.accelerationY < -8192 &&
                    sensory.accelerationX > -4096 &&
                    sensory.accelerationX < 4096
                ) {
                    value = -2;
                } else if (
                    sensory.accelerationZ > 12288 &&
                    sensory.accelerationX > -8192 &&
                    sensory.accelerationX < 8192 &&
                    sensory.accelerationY > -8192 &&
                    sensory.accelerationY < 8192
                ) {
                    value = 3;
                } else if (
                    sensory.accelerationZ < -12288 &&
                    sensory.accelerationX > -4096 &&
                    sensory.accelerationX < 4096 &&
                    sensory.accelerationY > -4096 &&
                    sensory.accelerationY < 4096
                ) {
                    value = -3;
                } else {
                    value = 0;
                }

                switch (dev) {
                    case 'TILT_FORWARD':
                        return value == 1;
                    case 'TILT_BACKWARD':
                        return value == -1;
                    case 'TILT_LEFT':
                        return value == 2;
                    case 'TILT_RIGHT':
                        return value == -2;
                    case 'TILT_FLIP':
                        return value == 3;
                    case 'TILT_NOT':
                        return value == -3;
                }
                return false;
            } else {
                switch (dev) {
                    case 'BATTERY_NORMAL':
                        return sensory.batteryState === 2;
                    case 'BATTERY_LOW':
                        return sensory.batteryState === 1;
                    case 'BATTERY_EMPTY':
                        return sensory.batteryState === 0;
                }
                return false;
            }
        }

        checkHandFound(script) {
            const sensory = this.sensory;
            return sensory.handFound === undefined
                ? sensory.leftProximity > 40 || sensory.rightProximity > 40
                : sensory.handFound;
        }

        __board(leftVelocity, rightVelocity, command, callback) {
            const motoring = this.motoring;
            this.__cancelWheel();
            this.__cancelLineTracer();

            motoring.leftWheel = leftVelocity;
            motoring.rightWheel = rightVelocity;
            motoring.motion = 0;
            this.boardCommand = command;
            this.boardCount = 0;
            this.boardState = 1;
            this.boardCallback = callback;
            this.__setLineTracerMode(0);
        }

        boardForward(script) {
            if (!script.isStart) {
                script.isStart = true;
                script.isMoving = true;
                this.__board(45, 45, 1, () => {
                    script.isMoving = false;
                });
                return script;
            } else if (script.isMoving) {
                return script;
            } else {
                delete script.isStart;
                delete script.isMoving;
                Entry.engine.isContinue = false;
                return script.callReturn();
            }
        }

        boardTurn(script) {
            if (!script.isStart) {
                script.isStart = true;
                script.isMoving = true;
                const direction = script.getField('DIRECTION');
                if (direction == 'LEFT') {
                    this.__board(-45, 45, 2, () => {
                        script.isMoving = false;
                    });
                } else {
                    this.__board(45, -45, 3, () => {
                        script.isMoving = false;
                    });
                }

                return script;
            } else if (script.isMoving) {
                return script;
            } else {
                delete script.isStart;
                delete script.isMoving;
                Entry.engine.isContinue = false;
                return script.callReturn();
            }
        }

        __motion(type, leftVelocity, rightVelocity, secs, callback) {
            const self = this;
            const motoring = self.motoring;
            self.__cancelBoard();
            self.__cancelWheel();
            self.__cancelLineTracer();

            secs = parseFloat(secs);
            if (secs && secs > 0) {
                const id = self.__issueWheelBlockId();
                motoring.leftWheel = leftVelocity;
                motoring.rightWheel = rightVelocity;
                motoring.motion = type;
                self.__setLineTracerMode(0);
                self.wheelTimer = setTimeout(() => {
                    if (self.wheelBlockId == id) {
                        motoring.leftWheel = 0;
                        motoring.rightWheel = 0;
                        motoring.motion = 0;
                        self.__cancelWheel();
                        callback();
                    }
                }, secs * 1000);
                self.timeouts.push(self.wheelTimer);
            } else {
                motoring.leftWheel = 0;
                motoring.rightWheel = 0;
                motoring.motion = 0;
                self.__setLineTracerMode(0);
                callback();
            }
        }

        moveForwardSecs(script) {
            if (!script.isStart) {
                script.isStart = true;
                script.isMoving = true;
                const secs = script.getNumberValue('SECS');
                if (secs < 0) {
                    this.__motion(2, -30, -30, -secs, () => {
                        script.isMoving = false;
                    });
                } else {
                    this.__motion(1, 30, 30, secs, () => {
                        script.isMoving = false;
                    });
                }

                return script;
            } else if (script.isMoving) {
                return script;
            } else {
                delete script.isStart;
                delete script.isMoving;
                Entry.engine.isContinue = false;
                return script.callReturn();
            }
        }

        moveBackwardSecs(script) {
            if (!script.isStart) {
                script.isStart = true;
                script.isMoving = true;
                const secs = script.getNumberValue('SECS');
                if (secs < 0) {
                    this.__motion(1, 30, 30, -secs, () => {
                        script.isMoving = false;
                    });
                } else {
                    this.__motion(2, -30, -30, secs, () => {
                        script.isMoving = false;
                    });
                }

                return script;
            } else if (script.isMoving) {
                return script;
            } else {
                delete script.isStart;
                delete script.isMoving;
                Entry.engine.isContinue = false;
                return script.callReturn();
            }
        }

        turnSecs(script) {
            if (!script.isStart) {
                script.isStart = true;
                script.isMoving = true;
                const direction = script.getField('DIRECTION');
                const secs = script.getNumberValue('SECS');
                if (direction == 'LEFT') {
                    if (secs < 0) {
                        this.__motion(4, 30, -30, -secs, () => {
                            script.isMoving = false;
                        });
                    } else {
                        this.__motion(3, -30, 30, secs, () => {
                            script.isMoving = false;
                        });
                    }
                } else {
                    if (secs < 0) {
                        this.__motion(3, -30, 30, -secs, () => {
                            script.isMoving = false;
                        });
                    } else {
                        this.__motion(4, 30, -30, secs, () => {
                            script.isMoving = false;
                        });
                    }
                }

                return script;
            } else if (script.isMoving) {
                return script;
            } else {
                delete script.isStart;
                delete script.isMoving;
                Entry.engine.isContinue = false;
                return script.callReturn();
            }
        }

        __stopMotion() {
            const motoring = this.motoring;
            this.__cancelBoard();
            this.__cancelWheel();
            this.__cancelLineTracer();

            motoring.leftWheel = 0;
            motoring.rightWheel = 0;
            motoring.motion = 0;
            this.__setLineTracerMode(0);
        }

        moveForwardUnit(script) {
            if (!script.isStart) {
                script.isStart = true;
                script.isMoving = true;
                const value = script.getNumberValue('VALUE');
                const unit = script.getField('UNIT');
                if (unit == 'SEC') {
                    if (value < 0) {
                        this.__motion(2, -30, -30, -value, () => {
                            script.isMoving = false;
                        });
                    } else {
                        this.__motion(1, 30, 30, value, () => {
                            script.isMoving = false;
                        });
                    }
                } else {
                    this.__stopMotion();
                }

                return script;
            } else if (script.isMoving) {
                return script;
            } else {
                delete script.isStart;
                delete script.isMoving;
                Entry.engine.isContinue = false;
                return script.callReturn();
            }
        }

        moveBackwardUnit(script) {
            if (!script.isStart) {
                script.isStart = true;
                script.isMoving = true;
                const value = script.getNumberValue('VALUE');
                const unit = script.getField('UNIT');
                if (unit == 'SEC') {
                    if (value < 0) {
                        this.__motion(1, 30, 30, -value, () => {
                            script.isMoving = false;
                        });
                    } else {
                        this.__motion(2, -30, -30, value, () => {
                            script.isMoving = false;
                        });
                    }
                } else {
                    this.__stopMotion();
                }

                return script;
            } else if (script.isMoving) {
                return script;
            } else {
                delete script.isStart;
                delete script.isMoving;
                Entry.engine.isContinue = false;
                return script.callReturn();
            }
        }

        turnUnit(script) {
            if (!script.isStart) {
                script.isStart = true;
                script.isMoving = true;
                const direction = script.getField('DIRECTION');
                const value = script.getNumberValue('VALUE');
                const unit = script.getField('UNIT');
                if (unit == 'SEC') {
                    if (direction == 'LEFT') {
                        if (value < 0) {
                            this.__motion(4, 30, -30, -value, () => {
                                script.isMoving = false;
                            });
                        } else {
                            this.__motion(3, -30, 30, value, () => {
                                script.isMoving = false;
                            });
                        }
                    } else {
                        if (value < 0) {
                            this.__motion(3, -30, 30, -value, () => {
                                script.isMoving = false;
                            });
                        } else {
                            this.__motion(4, 30, -30, value, () => {
                                script.isMoving = false;
                            });
                        }
                    }
                } else {
                    this.__stopMotion();
                }

                return script;
            } else if (script.isMoving) {
                return script;
            } else {
                delete script.isStart;
                delete script.isMoving;
                Entry.engine.isContinue = false;
                return script.callReturn();
            }
        }

        pivotUnit(script) {
            if (!script.isStart) {
                script.isStart = true;
                script.isMoving = true;
                const part = script.getField('PART');
                const value = script.getNumberValue('VALUE');
                const unit = script.getField('UNIT');
                const toward = script.getField('TOWARD');
                if (unit == 'SEC') {
                    if (part == 'LEFT_PEN') {
                        if (toward == 'FORWARD') {
                            if (value < 0) {
                                this.__motion(14, 0, 0, -value, () => {
                                    script.isMoving = false;
                                });
                            } else {
                                this.__motion(13, 0, 0, value, () => {
                                    script.isMoving = false;
                                });
                            }
                        } else {
                            if (value < 0) {
                                this.__motion(13, 0, 0, -value, () => {
                                    script.isMoving = false;
                                });
                            } else {
                                this.__motion(14, 0, 0, value, () => {
                                    script.isMoving = false;
                                });
                            }
                        }
                    } else if (part == 'RIGHT_PEN') {
                        if (toward == 'FORWARD') {
                            if (value < 0) {
                                this.__motion(16, 0, 0, -value, () => {
                                    script.isMoving = false;
                                });
                            } else {
                                this.__motion(15, 0, 0, value, () => {
                                    script.isMoving = false;
                                });
                            }
                        } else {
                            if (value < 0) {
                                this.__motion(15, 0, 0, -value, () => {
                                    script.isMoving = false;
                                });
                            } else {
                                this.__motion(16, 0, 0, value, () => {
                                    script.isMoving = false;
                                });
                            }
                        }
                    } else if (part == 'LEFT_WHEEL') {
                        if (toward == 'FORWARD') {
                            if (value < 0) {
                                this.__motion(6, 0, -30, -value, () => {
                                    script.isMoving = false;
                                });
                            } else {
                                this.__motion(5, 0, 30, value, () => {
                                    script.isMoving = false;
                                });
                            }
                        } else {
                            if (value < 0) {
                                this.__motion(5, 0, 30, -value, () => {
                                    script.isMoving = false;
                                });
                            } else {
                                this.__motion(6, 0, -30, value, () => {
                                    script.isMoving = false;
                                });
                            }
                        }
                    } else {
                        if (toward == 'FORWARD') {
                            if (value < 0) {
                                this.__motion(8, -30, 0, -value, () => {
                                    script.isMoving = false;
                                });
                            } else {
                                this.__motion(7, 30, 0, value, () => {
                                    script.isMoving = false;
                                });
                            }
                        } else {
                            if (value < 0) {
                                this.__motion(7, 30, 0, -value, () => {
                                    script.isMoving = false;
                                });
                            } else {
                                this.__motion(8, -30, 0, value, () => {
                                    script.isMoving = false;
                                });
                            }
                        }
                    }
                } else {
                    this.__stopMotion();
                }

                return script;
            } else if (script.isMoving) {
                return script;
            } else {
                delete script.isStart;
                delete script.isMoving;
                Entry.engine.isContinue = false;
                return script.callReturn();
            }
        }

        swingUnit(script) {
            if (!script.isStart) {
                script.isStart = true;
                script.isMoving = true;
                const part = script.getField('PART');
                const direction = script.getField('DIRECTION');
                const value = script.getNumberValue('VALUE');
                const unit = script.getField('UNIT');
                let radius = script.getNumberValue('RADIUS');
                const toward = script.getField('TOWARD');
                if (unit == 'SEC') {
                    radius = parseFloat(radius);
                    if (typeof radius == 'number' && radius >= 0) {
                        this.motoring.radius = radius;
                        if (part == 'LEFT_PEN') {
                            if (direction == 'LEFT') {
                                if (toward == 'FORWARD') {
                                    if (value < 0) {
                                        this.__motion(18, 0, 0, -value, () => {
                                            script.isMoving = false;
                                        });
                                    } else {
                                        this.__motion(17, 0, 0, value, () => {
                                            script.isMoving = false;
                                        });
                                    }
                                } else {
                                    if (value < 0) {
                                        this.__motion(17, 0, 0, -value, () => {
                                            script.isMoving = false;
                                        });
                                    } else {
                                        this.__motion(18, 0, 0, value, () => {
                                            script.isMoving = false;
                                        });
                                    }
                                }
                            } else {
                                if (toward == 'FORWARD') {
                                    if (value < 0) {
                                        this.__motion(20, 0, 0, -value, () => {
                                            script.isMoving = false;
                                        });
                                    } else {
                                        this.__motion(19, 0, 0, value, () => {
                                            script.isMoving = false;
                                        });
                                    }
                                } else {
                                    if (value < 0) {
                                        this.__motion(19, 0, 0, -value, () => {
                                            script.isMoving = false;
                                        });
                                    } else {
                                        this.__motion(20, 0, 0, value, () => {
                                            script.isMoving = false;
                                        });
                                    }
                                }
                            }
                        } else if (part == 'RIGHT_PEN') {
                            if (direction == 'LEFT') {
                                if (toward == 'FORWARD') {
                                    if (value < 0) {
                                        this.__motion(22, 0, 0, -value, () => {
                                            script.isMoving = false;
                                        });
                                    } else {
                                        this.__motion(21, 0, 0, value, () => {
                                            script.isMoving = false;
                                        });
                                    }
                                } else {
                                    if (value < 0) {
                                        this.__motion(21, 0, 0, -value, () => {
                                            script.isMoving = false;
                                        });
                                    } else {
                                        this.__motion(22, 0, 0, value, () => {
                                            script.isMoving = false;
                                        });
                                    }
                                }
                            } else {
                                if (toward == 'FORWARD') {
                                    if (value < 0) {
                                        this.__motion(24, 0, 0, -value, () => {
                                            script.isMoving = false;
                                        });
                                    } else {
                                        this.__motion(23, 0, 0, value, () => {
                                            script.isMoving = false;
                                        });
                                    }
                                } else {
                                    if (value < 0) {
                                        this.__motion(23, 0, 0, -value, () => {
                                            script.isMoving = false;
                                        });
                                    } else {
                                        this.__motion(24, 0, 0, value, () => {
                                            script.isMoving = false;
                                        });
                                    }
                                }
                            }
                        } else {
                            if (direction == 'LEFT') {
                                if (toward == 'FORWARD') {
                                    if (value < 0) {
                                        this.__motion(10, 0, 0, -value, () => {
                                            script.isMoving = false;
                                        });
                                    } else {
                                        this.__motion(9, 0, 0, value, () => {
                                            script.isMoving = false;
                                        });
                                    }
                                } else {
                                    if (value < 0) {
                                        this.__motion(9, 0, 0, -value, () => {
                                            script.isMoving = false;
                                        });
                                    } else {
                                        this.__motion(10, 0, 0, value, () => {
                                            script.isMoving = false;
                                        });
                                    }
                                }
                            } else {
                                if (toward == 'FORWARD') {
                                    if (value < 0) {
                                        this.__motion(12, 0, 0, -value, () => {
                                            script.isMoving = false;
                                        });
                                    } else {
                                        this.__motion(11, 0, 0, value, () => {
                                            script.isMoving = false;
                                        });
                                    }
                                } else {
                                    if (value < 0) {
                                        this.__motion(11, 0, 0, -value, () => {
                                            script.isMoving = false;
                                        });
                                    } else {
                                        this.__motion(12, 0, 0, value, () => {
                                            script.isMoving = false;
                                        });
                                    }
                                }
                            }
                        }
                    } else {
                        this.__stopMotion();
                        script.isMoving = false;
                    }
                } else {
                    this.__stopMotion();
                }

                return script;
            } else if (script.isMoving) {
                return script;
            } else {
                delete script.isStart;
                delete script.isMoving;
                Entry.engine.isContinue = false;
                return script.callReturn();
            }
        }

        setWheels(script) {
            const motoring = this.motoring;

            this.__cancelBoard();
            this.__cancelWheel();
            this.__cancelLineTracer();

            let leftVelocity = script.getNumberValue('LEFT');
            let rightVelocity = script.getNumberValue('RIGHT');

            leftVelocity = parseFloat(leftVelocity);
            rightVelocity = parseFloat(rightVelocity);
            if (typeof leftVelocity == 'number') {
                motoring.leftWheel = leftVelocity;
            }
            if (typeof rightVelocity == 'number') {
                motoring.rightWheel = rightVelocity;
            }
            motoring.motion = 0;
            this.__setLineTracerMode(0);
            return script.callReturn();
        }

        changeWheels(script) {
            const motoring = this.motoring;

            this.__cancelBoard();
            this.__cancelWheel();
            this.__cancelLineTracer();

            let leftVelocity = script.getNumberValue('LEFT');
            let rightVelocity = script.getNumberValue('RIGHT');

            leftVelocity = parseFloat(leftVelocity);
            rightVelocity = parseFloat(rightVelocity);
            if (typeof leftVelocity == 'number') {
                motoring.leftWheel =
                    motoring.leftWheel !== undefined
                        ? motoring.leftWheel + leftVelocity
                        : leftVelocity;
            }
            if (typeof rightVelocity == 'number') {
                motoring.rightWheel =
                    motoring.rightWheel !== undefined
                        ? motoring.rightWheel + rightVelocity
                        : rightVelocity;
            }
            motoring.motion = 0;
            this.__setLineTracerMode(0);
            return script.callReturn();
        }

        setWheel(script) {
            const motoring = this.motoring;

            this.__cancelBoard();
            this.__cancelWheel();
            this.__cancelLineTracer();

            const wheel = script.getField('WHEEL');
            let velocity = script.getNumberValue('VELOCITY');

            velocity = parseFloat(velocity);
            if (typeof velocity == 'number') {
                if (wheel == 'LEFT') {
                    motoring.leftWheel = velocity;
                } else if (wheel == 'RIGHT') {
                    motoring.rightWheel = velocity;
                } else {
                    motoring.leftWheel = velocity;
                    motoring.rightWheel = velocity;
                }
            }
            motoring.motion = 0;
            this.__setLineTracerMode(0);
            return script.callReturn();
        }

        changeWheel(script) {
            const motoring = this.motoring;

            this.__cancelBoard();
            this.__cancelWheel();
            this.__cancelLineTracer();

            const wheel = script.getField('WHEEL');
            let velocity = script.getNumberValue('VELOCITY');

            velocity = parseFloat(velocity);
            if (typeof velocity == 'number') {
                if (wheel == 'LEFT') {
                    motoring.leftWheel =
                        motoring.leftWheel != undefined ? motoring.leftWheel + velocity : velocity;
                } else if (wheel == 'RIGHT') {
                    motoring.rightWheel =
                        motoring.rightWheel != undefined
                            ? motoring.rightWheel + velocity
                            : velocity;
                } else {
                    motoring.leftWheel =
                        motoring.leftWheel != undefined ? motoring.leftWheel + velocity : velocity;
                    motoring.rightWheel =
                        motoring.rightWheel != undefined
                            ? motoring.rightWheel + velocity
                            : velocity;
                }
            }
            motoring.motion = 0;
            this.__setLineTracerMode(0);
            return script.callReturn();
        }

        followLine(script) {
            this.__cancelBoard();
            this.__cancelWheel();
            this.__cancelLineTracer();

            const color = script.getField('COLOR');
            const sensor = script.getField('SENSOR');

            let mode = 1;
            if (sensor == 'RIGHT') {
                mode = 2;
            } else if (sensor == 'BOTH') {
                mode = 3;
            }
            if (color == 'WHITE') {
                mode += 7;
            }

            const motoring = this.motoring;
            motoring.leftWheel = 0;
            motoring.rightWheel = 0;
            motoring.motion = 0;
            this.__setLineTracerMode(mode);

            return script.callReturn();
        }

        followLineUntil(script) {
            if (!script.isStart) {
                script.isStart = true;
                script.isMoving = true;
                this.__cancelBoard();
                this.__cancelWheel();

                const color = script.getField('COLOR');
                const direction = script.getField('DIRECTION');

                let mode = 4;
                if (direction == 'RIGHT') {
                    mode = 5;
                } else if (direction == 'FRONT') {
                    mode = 6;
                } else if (direction == 'REAR') {
                    mode = 7;
                }
                if (color == 'WHITE') {
                    mode += 7;
                }

                const motoring = this.motoring;
                motoring.leftWheel = 0;
                motoring.rightWheel = 0;
                motoring.motion = 0;
                this.__setLineTracerMode(mode);
                this.lineTracerCallback = () => {
                    script.isMoving = false;
                };

                return script;
            } else if (script.isMoving) {
                return script;
            } else {
                delete script.isStart;
                delete script.isMoving;
                Entry.engine.isContinue = false;
                return script.callReturn();
            }
        }

        setLineTracerSpeed(script) {
            const speed = parseInt(script.getField('SPEED'));

            if (typeof speed == 'number') {
                this.motoring.lineTracerSpeed = speed;
            }
            return script.callReturn();
        }

        setLineTracerGain(script) {
            return script.callReturn();
        }

        stop(script) {
            this.__cancelBoard();
            this.__cancelWheel();
            this.__cancelLineTracer();

            const motoring = this.motoring;
            motoring.leftWheel = 0;
            motoring.rightWheel = 0;
            motoring.motion = 0;
            this.__setLineTracerMode(0);
            return script.callReturn();
        }
        setLed(script) {
            const led = script.getField('LED');
            let color = script.getField('COLOR');
            color = parseInt(this.__COLORS[color]);

            if (color && color > 0) {
                if (led == 'LEFT') {
                    this.motoring.leftLed = color;
                } else if (led == 'RIGHT') {
                    this.motoring.rightLed = color;
                } else {
                    this.motoring.leftLed = color;
                    this.motoring.rightLed = color;
                }
            }

            return script.callReturn();
        }

        pickLed(script) {
            return script.callReturn();
        }

        clearLed(script) {
            const led = script.getField('LED');

            if (led == 'LEFT') {
                this.motoring.leftLed = 0;
            } else if (led == 'RIGHT') {
                this.motoring.rightLed = 0;
            } else {
                this.motoring.leftLed = 0;
                this.motoring.rightLed = 0;
            }

            return script.callReturn();
        }

        setRgb(script) {
            return script.callReturn();
        }

        changeRgb(script) {
            return script.callReturn();
        }

        __runBeep(count, id, callback) {
            if (count) {
                const self = this;
                const motoring = self.motoring;
                if (!motoring.buzzer) {
                    motoring.buzzer = 440;
                }
                motoring.note = 0;
                self.noteTimer1 = setTimeout(() => {
                    if (!id || self.noteBlockId == id) {
                        if (self.noteTimer1 !== undefined) {
                            self.__removeTimeout(self.noteTimer1);
                        }
                        self.noteTimer1 = undefined;
                    }
                }, 100);
                self.timeouts.push(self.noteTimer1);
                self.noteTimer2 = setTimeout(() => {
                    if (!id || self.noteBlockId == id) {
                        if (self.noteTimer2 !== undefined) {
                            self.__removeTimeout(self.noteTimer2);
                        }
                        self.noteTimer2 = undefined;
                        if (count < 0) {
                            self.__runBeep(-1, id, callback);
                        } else if (count == 1) {
                            self.__cancelNote();
                            if (id && callback) {
                                callback();
                            }
                        } else {
                            self.__runBeep(count - 1, id, callback);
                        }
                    }
                }, 200);
                self.timeouts.push(self.noteTimer2);
            }
        }

        beep(script) {
            if (!script.isStart) {
                script.isStart = true;
                script.isPlaying = true;
                this.__cancelNote();
                const id = this.__issueNoteBlockId();
                this.__runBeep(1, id, () => {
                    script.isPlaying = false;
                });

                return script;
            } else if (script.isPlaying) {
                return script;
            } else {
                delete script.isStart;
                delete script.isPlaying;
                Entry.engine.isContinue = false;
                return script.callReturn();
            }
        }

        playSound(script) {
            this.__cancelNote();
            this.motoring.buzzer = 0;
            this.motoring.note = 0;

            const sound = script.getField('SOUND');
            let count = script.getNumberValue('COUNT');

            count = parseInt(count);
            if (sound == 'BEEP' && count) {
                this.__runBeep(count);
            }
            return script.callReturn();
        }

        playSoundUntil(script) {
            if (!script.isStart) {
                script.isStart = true;
                script.isPlaying = true;
                this.__cancelNote();
                this.motoring.buzzer = 0;
                this.motoring.note = 0;

                const sound = script.getField('SOUND');
                let count = script.getNumberValue('COUNT');

                count = parseInt(count);
                if (count) {
                    if (sound == 'BEEP') {
                        const id = this.__issueNoteBlockId();
                        this.__runBeep(count, id, () => {
                            script.isPlaying = false;
                        });
                    }
                } else {
                    script.isPlaying = false;
                }

                return script;
            } else if (script.isPlaying) {
                return script;
            } else {
                delete script.isStart;
                delete script.isPlaying;
                Entry.engine.isContinue = false;
                return script.callReturn();
            }
        }

        setBuzzer(script) {
            this.__cancelNote();
            let hz = script.getNumberValue('HZ');

            hz = parseFloat(hz);
            if (typeof hz == 'number') {
                this.motoring.buzzer = hz;
            }
            this.motoring.note = 0;
            return script.callReturn();
        }

        changeBuzzer(script) {
            this.__cancelNote();
            let hz = script.getNumberValue('HZ');

            const motoring = this.motoring;
            hz = parseFloat(hz);
            if (typeof hz == 'number') {
                motoring.buzzer = motoring.buzzer != undefined ? motoring.buzzer + hz : hz;
            }
            motoring.note = 0;
            return script.callReturn();
        }

        clearBuzzer(script) {
            this.__cancelNote();
            this.motoring.buzzer = 0;
            this.motoring.note = 0;
            return script.callReturn();
        }

        clearSound(script, motoring) {
            return this.clearBuzzer(script);
        }

        playNote(script) {
            this.__cancelNote();

            let note = script.getField('NOTE');
            let octave = script.getNumberField('OCTAVE');

            note = parseInt(this.__NOTES[note]);
            octave = parseInt(octave);
            const motoring = this.motoring;
            motoring.buzzer = 0;
            if (note && octave && octave > 0 && octave < 8) {
                motoring.note = note + (octave - 1) * 12;
            } else {
                motoring.note = 0;
            }

            return script.callReturn();
        }

        playNoteBeat(script) {
            const self = this;

            if (!script.isStart) {
                script.isStart = true;
                script.isPlaying = true;
                self.__cancelNote();

                const motoring = self.motoring;
                let note = script.getField('NOTE');
                let octave = script.getNumberField('OCTAVE');
                let beat = script.getNumberValue('BEAT');

                note = parseInt(Entry.HamsterLite.__NOTES[note]);
                octave = parseInt(octave);
                beat = parseFloat(beat);
                motoring.buzzer = 0;
                if (
                    note &&
                    octave &&
                    octave > 0 &&
                    octave < 8 &&
                    beat &&
                    beat > 0 &&
                    self.tempo > 0
                ) {
                    const id = self.__issueNoteBlockId();
                    note += (octave - 1) * 12;
                    motoring.note = note;
                    const timeValue = (beat * 60 * 1000) / self.tempo;
                    if (timeValue > 100) {
                        self.noteTimer1 = setTimeout(() => {
                            if (self.noteBlockId == id) {
                                motoring.note = 0;
                                if (self.noteTimer1 !== undefined) {
                                    self.__removeTimeout(self.noteTimer1);
                                }
                                self.noteTimer1 = undefined;
                            }
                        }, timeValue - 100);
                        self.timeouts.push(self.noteTimer1);
                    }
                    self.noteTimer2 = setTimeout(() => {
                        if (self.noteBlockId == id) {
                            motoring.note = 0;
                            self.__cancelNote();
                            script.isPlaying = false;
                        }
                    }, timeValue);
                    self.timeouts.push(self.noteTimer2);
                } else {
                    motoring.note = 0;
                    script.isPlaying = false;
                }
                return script;
            } else if (script.isPlaying) {
                return script;
            } else {
                delete script.isStart;
                delete script.isPlaying;
                Entry.engine.isContinue = false;
                self.motoring.note = 0;
                return script.callReturn();
            }
        }

        restBeat(script) {
            const self = this;

            if (!script.isStart) {
                script.isStart = true;
                script.isPlaying = true;
                self.__cancelNote();
                let beat = script.getNumberValue('BEAT');

                const motoring = self.motoring;
                beat = parseFloat(beat);
                motoring.buzzer = 0;
                motoring.note = 0;
                if (beat && beat > 0 && self.tempo > 0) {
                    const id = self.__issueNoteBlockId();
                    const timeValue = (beat * 60 * 1000) / self.tempo;
                    self.noteTimer1 = setTimeout(() => {
                        if (self.noteBlockId == id) {
                            self.__cancelNote();
                            script.isPlaying = false;
                        }
                    }, timeValue);
                    self.timeouts.push(self.noteTimer1);
                } else {
                    script.isPlaying = false;
                }

                return script;
            } else if (script.isPlaying) {
                return script;
            } else {
                delete script.isStart;
                delete script.isPlaying;
                Entry.engine.isContinue = false;
                return script.callReturn();
            }
        }

        setTempo(script) {
            let bpm = script.getNumberValue('BPM');

            bpm = parseFloat(bpm);
            if (typeof bpm == 'number') {
                this.tempo = bpm < 1 ? 1 : bpm;
            }

            return script.callReturn();
        }

        changeTempo(script) {
            let bpm = script.getNumberValue('BPM');

            bpm = parseFloat(bpm);
            if (typeof bpm == 'number') {
                this.tempo += bpm;
                if (this.tempo < 1) {
                    this.tempo = 1;
                }
            }

            return script.callReturn();
        }

        setIoMode(script) {
            this.__cancelIo();

            const port = script.getField('PORT');
            const mode = parseInt(this.__IO_MODES[script.getField('MODE')]);

            const motoring = this.motoring;
            if (typeof mode == 'number') {
                if (port == 'A') {
                    motoring.ioModeA = mode;
                } else if (port == 'B') {
                    motoring.ioModeB = mode;
                } else {
                    motoring.ioModeA = mode;
                    motoring.ioModeB = mode;
                }
            }

            return script.callReturn();
        }

        setOutput(script) {
            this.__cancelIo();

            const motoring = this.motoring;
            const port = script.getField('PORT');
            let value = script.getNumberValue('VALUE');

            value = parseFloat(value);
            if (typeof value == 'number') {
                if (port == 'A') {
                    motoring.outputA = value;
                } else if (port == 'B') {
                    motoring.outputB = value;
                } else {
                    motoring.outputA = value;
                    motoring.outputB = value;
                }
            }

            return script.callReturn();
        }

        changeOutput(script) {
            this.__cancelIo();

            const motoring = this.motoring;
            const port = script.getField('PORT');
            let value = script.getNumberValue('VALUE');

            value = parseFloat(value);
            if (typeof value == 'number') {
                if (port == 'A') {
                    motoring.outputA =
                        motoring.outputA != undefined ? motoring.outputA + value : value;
                } else if (port == 'B') {
                    motoring.outputB =
                        motoring.outputB != undefined ? motoring.outputB + value : value;
                } else {
                    motoring.outputA =
                        motoring.outputA != undefined ? motoring.outputA + value : value;
                    motoring.outputB =
                        motoring.outputB != undefined ? motoring.outputB + value : value;
                }
            }

            return script.callReturn();
        }

        gripper(script) {
            const self = this;

            if (!script.isStart) {
                script.isStart = true;
                script.isPlaying = true;
                self.__cancelIo();

                const id = self.__issueIoBlockId();
                const action = script.getField('ACTION');

                const motoring = self.motoring;
                motoring.ioModeA = 10;
                motoring.ioModeB = 10;
                if (action == 'OPEN') {
                    motoring.outputA = 1;
                    motoring.outputB = 0;
                } else {
                    motoring.outputA = 0;
                    motoring.outputB = 1;
                }
                self.ioTimer = setTimeout(() => {
                    if (self.ioBlockId == id) {
                        self.__cancelIo();
                        script.isPlaying = false;
                    }
                }, 500);
                self.timeouts.push(self.ioTimer);

                return script;
            } else if (script.isPlaying) {
                return script;
            } else {
                delete script.isStart;
                delete script.isPlaying;
                Entry.engine.isContinue = false;
                return script.callReturn();
            }
        }

        releaseGripper(script) {
            this.__cancelIo();
            const motoring = this.motoring;
            motoring.ioModeA = 10;
            motoring.ioModeB = 10;
            motoring.outputA = 0;
            motoring.outputB = 0;
            return script.callReturn();
        }

        setLanguage() {
            return {
                ko: {
                    template: {
                        hamsterlite_gripper: '집게 %1 %2',
                        hamsterlite_release_gripper: '집게 끄기 %1',
                        hamsterlite_boolean: '%1?',
                        hamsterlite_play_note: '%1 %2 음을 연주하기 %3',
                        hamsterlite_hand_found: '손 찾음?',
                        hamsterlite_value: '%1',
                        hamsterlite_move_forward_once: '말판 앞으로 한 칸 이동하기 %1',
                        hamsterlite_turn_once: '말판 %1 으로 한 번 돌기 %2',
                        hamsterlite_move_forward_for_secs: '앞으로 %1 초 이동하기 %2',
                        hamsterlite_move_backward_for_secs: '뒤로 %1 초 이동하기 %2',
                        hamsterlite_turn_for_secs: '%1 으로 %2 초 돌기 %3',
                        hamsterlite_change_both_wheels_by:
                            '왼쪽 바퀴 %1 오른쪽 바퀴 %2 만큼 바꾸기 %3',
                        hamsterlite_set_both_wheels_to:
                            '왼쪽 바퀴 %1 오른쪽 바퀴 %2 (으)로 정하기 %3',
                        hamsterlite_change_wheel_by: '%1 바퀴 %2 만큼 바꾸기 %3',
                        hamsterlite_set_wheel_to: '%1 바퀴 %2 (으)로 정하기 %3',
                        hamsterlite_follow_line_using: '%1 선을 %2 바닥 센서로 따라가기 %3',
                        hamsterlite_follow_line_until: '%1 선을 따라 %2 교차로까지 이동하기 %3',
                        hamsterlite_set_following_speed_to:
                            '선 따라가기 속도를 %1 (으)로 정하기 %2',
                        hamsterlite_stop: '정지하기 %1',
                        hamsterlite_set_led_to: '%1 LED를 %2 으로 정하기 %3',
                        hamsterlite_clear_led: '%1 LED 끄기 %2',
                        hamsterlite_beep: '삐 소리내기 %1',
                        hamsterlite_change_buzzer_by: '버저 음을 %1 만큼 바꾸기 %2',
                        hamsterlite_set_buzzer_to: '버저 음을 %1 (으)로 정하기 %2',
                        hamsterlite_clear_buzzer: '버저 끄기 %1',
                        hamsterlite_play_note_for: '%1 %2 음을 %3 박자 연주하기 %4',
                        hamsterlite_rest_for: '%1 박자 쉬기 %2',
                        hamsterlite_change_tempo_by: '연주 속도를 %1 만큼 바꾸기 %2',
                        hamsterlite_set_tempo_to: '연주 속도를 %1 BPM으로 정하기 %2',
                        hamsterlite_set_port_to: '포트 %1 를 %2 으로 정하기 %3',
                        hamsterlite_change_output_by: '출력 %1 를 %2 만큼 바꾸기 %3',
                        hamsterlite_set_output_to: '출력 %1 를 %2 (으)로 정하기 %3',
                    },
                    Helper: {
                        hamsterlite_gripper: '집게를 열거나 닫습니다.',
                        hamsterlite_release_gripper:
                            '집게의 전원을 끄고 자유롭게 움직일 수 있도록 합니다.',
                        hamsterlite_boolean:
                            "앞으로 기울임: 앞으로 기울이면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>뒤로 기울임: 뒤로 기울이면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>왼쪽으로 기울임: 왼쪽으로 기울이면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>오른쪽으로 기울임: 오른쪽으로 기울이면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>거꾸로 뒤집음: 거꾸로 뒤집으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>기울이지 않음: 기울이지 않으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>배터리 정상: 배터리 잔량이 충분하면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>배터리 부족: 배터리 잔량이 부족하면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.<br/>배터리 없음: 배터리 잔량이 없으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.",
                        hamsterlite_play_note: '선택한 계이름과 옥타브의 음을 소리 냅니다.',
                        hamsterlite_beep: '버저 소리를 짧게 냅니다.',
                        hamsterlite_change_both_wheels_by:
                            '왼쪽과 오른쪽 바퀴의 현재 속도 값(%)에 입력한 값을 각각 더합니다. 더한 결과가 양수 값이면 바퀴가 앞으로 회전하고, 음수 값이면 뒤로 회전합니다.',
                        hamsterlite_change_buzzer_by:
                            '버저 소리의 현재 음 높이(Hz)에 입력한 값을 더합니다. 소수점 둘째 자리까지 입력할 수 있습니다.',
                        hamsterlite_change_output_by:
                            '선택한 외부 확장 포트의 현재 출력 값에 입력한 값을 더합니다. 더한 결과는 외부 확장 포트의 모드에 따라 다음의 범위를 가집니다.<br/>서보 출력: 유효한 값의 범위는 1 ~ 180도, 0이면 PWM 펄스 없이 항상 0을 출력<br/>PWM 출력: 0 ~ 100%, PWM 파형에서 ON 상태의 듀티비(%)<br/>디지털 출력: 0이면 LOW, 0이 아니면 HIGH',
                        hamsterlite_change_tempo_by:
                            '연주하거나 쉬는 속도의 현재 BPM(분당 박자 수)에 입력한 값을 더합니다.',
                        hamsterlite_change_wheel_by:
                            '왼쪽/오른쪽/양쪽 바퀴의 현재 속도 값(%)에 입력한 값을 더합니다. 더한 결과가 양수 값이면 바퀴가 앞으로 회전하고, 음수 값이면 뒤로 회전합니다.',
                        hamsterlite_clear_buzzer: '버저 소리를 끕니다.',
                        hamsterlite_clear_led: '왼쪽/오른쪽/양쪽 LED를 끕니다.',
                        hamsterlite_follow_line_until:
                            '왼쪽/오른쪽/앞쪽/뒤쪽의 검은색/하얀색 선을 따라 이동하다가 교차로를 만나면 정지합니다.',
                        hamsterlite_follow_line_using:
                            '왼쪽/오른쪽/양쪽 바닥 센서를 사용하여 검은색/하얀색 선을 따라 이동합니다.',
                        hamsterlite_hand_found:
                            "근접 센서 앞에 손 또는 물체가 있으면 '참'으로 판단하고, 아니면 '거짓'으로 판단합니다.",
                        hamsterlite_move_backward_for_secs: '입력한 시간(초) 동안 뒤로 이동합니다.',
                        hamsterlite_move_forward_for_secs:
                            '입력한 시간(초) 동안 앞으로 이동합니다.',
                        hamsterlite_move_forward_once: '말판 위에서 한 칸 앞으로 이동합니다.',
                        hamsterlite_play_note_for:
                            '선택한 계이름과 옥타브의 음을 입력한 박자만큼 소리 냅니다.',
                        hamsterlite_rest_for: '입력한 박자만큼 쉽니다.',
                        hamsterlite_set_both_wheels_to:
                            '왼쪽과 오른쪽 바퀴의 속도를 입력한 값(-100 ~ 100%)으로 각각 설정합니다. 양수 값을 입력하면 바퀴가 앞으로 회전하고, 음수 값을 입력하면 뒤로 회전합니다. 숫자 0을 입력하면 정지합니다.',
                        hamsterlite_set_buzzer_to:
                            '버저 소리의 음 높이를 입력한 값(Hz)으로 설정합니다. 소수점 둘째 자리까지 입력할 수 있습니다. 숫자 0을 입력하면 버저 소리를 끕니다.',
                        hamsterlite_set_following_speed_to:
                            '선을 따라 이동하는 속도(1 ~ 8)를 설정합니다. 숫자가 클수록 이동하는 속도가 빠릅니다.',
                        hamsterlite_set_led_to: '왼쪽/오른쪽/양쪽 LED를 선택한 색깔로 켭니다.',
                        hamsterlite_set_output_to:
                            '선택한 외부 확장 포트의 출력 값을 입력한 값으로 설정합니다. 입력하는 값은 외부 확장 포트의 모드에 따라 다음의 범위를 가집니다.<br/>서보 출력: 유효한 값의 범위는 1 ~ 180도, 0이면 PWM 펄스 없이 항상 0을 출력<br/>PWM 출력: 0 ~ 100%, PWM 파형에서 ON 상태의 듀티비(%)<br/>디지털 출력: 0이면 LOW, 0이 아니면 HIGH',
                        hamsterlite_set_port_to:
                            '선택한 외부 확장 포트의 입출력 모드를 선택한 모드로 설정합니다.',
                        hamsterlite_set_tempo_to:
                            '연주하거나 쉬는 속도를 입력한 BPM(분당 박자 수)으로 설정합니다.',
                        hamsterlite_set_wheel_to:
                            '왼쪽/오른쪽/양쪽 바퀴의 속도를 입력한 값(-100 ~ 100%)으로 설정합니다. 양수 값을 입력하면 바퀴가 앞으로 회전하고, 음수 값을 입력하면 뒤로 회전합니다. 숫자 0을 입력하면 정지합니다.',
                        hamsterlite_stop: '양쪽 바퀴를 정지합니다.',
                        hamsterlite_turn_for_secs:
                            '입력한 시간(초) 동안 왼쪽/오른쪽 방향으로 제자리에서 회전합니다.',
                        hamsterlite_turn_once:
                            '말판 위에서 왼쪽/오른쪽 방향으로 제자리에서 90도 회전합니다.',
                        hamsterlite_value:
                            '왼쪽 근접 센서: 왼쪽 근접 센서의 값 (값의 범위: 0 ~ 255, 초기값: 0)<br/>오른쪽 근접 센서: 오른쪽 근접 센서의 값 (값의 범위: 0 ~ 255, 초기값: 0)<br/>왼쪽 바닥 센서: 왼쪽 바닥 센서의 값 (값의 범위: 0 ~ 100, 초기값: 0)<br/>오른쪽 바닥 센서: 오른쪽 바닥 센서의 값 (값의 범위: 0 ~ 100, 초기값: 0)<br/>x축 가속도: 가속도 센서의 X축 값 (값의 범위: -32768 ~ 32767, 초기값: 0) 로봇이 전진하는 방향이 X축의 양수 방향입니다.<br/>y축 가속도: 가속도 센서의 Y축 값 (값의 범위: -32768 ~ 32767, 초기값: 0) 로봇의 왼쪽 방향이 Y축의 양수 방향입니다.<br/>z축 가속도: 가속도 센서의 Z축 값 (값의 범위: -32768 ~ 32767, 초기값: 0) 로봇의 위쪽 방향이 Z축의 양수 방향입니다.<br/>밝기: 밝기 센서의 값 (값의 범위: 0 ~ 65535, 초기값: 0) 밝을 수록 값이 커집니다.<br/>온도: 로봇 내부의 온도 값 (값의 범위: 섭씨 -40 ~ 88도, 초기값: 0)<br/>신호 세기: 블루투스 무선 통신의 신호 세기 (값의 범위: -128 ~ 0 dBm, 초기값: 0) 신호의 세기가 셀수록 값이 커집니다.<br/>입력 A: 외부 확장 포트 A로 입력되는 신호의 값 (값의 범위: 아날로그 입력 0 ~ 255, 디지털 입력 0 또는 1, 초기값: 0)<br/>입력 B: 외부 확장 포트 B로 입력되는 신호의 값 (값의 범위: 아날로그 입력 0 ~ 255, 디지털 입력 0 또는 1, 초기값: 0)',
                    },
                    Blocks: {
                        hamsterlite_hand_found: '손 찾음?',
                        hamsterlite_sensor_left_proximity: '왼쪽 근접 센서',
                        hamsterlite_sensor_right_proximity: '오른쪽 근접 센서',
                        hamsterlite_sensor_left_floor: '왼쪽 바닥 센서',
                        hamsterlite_sensor_right_floor: '오른쪽 바닥 센서',
                        hamsterlite_sensor_acceleration_x: 'x축 가속도',
                        hamsterlite_sensor_acceleration_y: 'y축 가속도',
                        hamsterlite_sensor_acceleration_z: 'z축 가속도',
                        hamsterlite_sensor_light: '밝기',
                        hamsterlite_sensor_temperature: '온도',
                        hamsterlite_sensor_signal_strength: '신호 세기',
                        hamsterlite_sensor_input_a: '입력 A',
                        hamsterlite_sensor_input_b: '입력 B',
                        hamsterlite_move_forward_once: '말판 앞으로 한 칸 이동하기',
                        hamsterlite_turn_once_1: '말판',
                        hamsterlite_turn_once_2: '으로 한 번 돌기',
                        hamsterlite_turn_once_left: '왼쪽',
                        hamsterlite_turn_right: '오른쪽',
                        hamsterlite_move_forward: '앞으로 이동하기',
                        hamsterlite_move_backward: '뒤로 이동하기',
                        hamsterlite_turn_around_1: '',
                        hamsterlite_turn_around_2: '으로 돌기',
                        hamsterlite_move_forward_for_secs_1: '앞으로',
                        hamsterlite_move_forward_for_secs_2: '초 이동하기',
                        hamsterlite_move_backward_for_secs_1: '뒤로',
                        hamsterlite_move_backward_for_secs_2: '초 이동하기',
                        hamsterlite_turn_for_secs_1: '',
                        hamsterlite_turn_for_secs_2: '으로',
                        hamsterlite_turn_for_secs_3: '초 돌기',
                        hamsterlite_change_both_wheels_by_1: '왼쪽 바퀴',
                        hamsterlite_change_both_wheels_by_2: '오른쪽 바퀴',
                        hamsterlite_change_both_wheels_by_3: '만큼 바꾸기',
                        hamsterlite_set_both_wheels_to_1: '왼쪽 바퀴',
                        hamsterlite_set_both_wheels_to_2: '오른쪽 바퀴',
                        hamsterlite_set_both_wheels_to_3: '(으)로 정하기',
                        hamsterlite_change_wheel_by_1: '',
                        hamsterlite_change_wheel_by_2: '바퀴',
                        hamsterlite_change_wheel_by_3: '만큼 바꾸기',
                        hamsterlite_left_wheel: '왼쪽',
                        hamsterlite_right_wheel: '오른쪽',
                        hamsterlite_both_wheels: '양쪽',
                        hamsterlite_set_wheel_to_1: '',
                        hamsterlite_set_wheel_to_2: '바퀴',
                        hamsterlite_set_wheel_to_3: '(으)로 정하기',
                        hamsterlite_follow_line_using_1: '',
                        hamsterlite_follow_line_using_2: '선을',
                        hamsterlite_follow_line_using_3: '바닥 센서로 따라가기',
                        hamsterlite_left_floor_sensor: '왼쪽',
                        hamsterlite_right_floor_sensor: '오른쪽',
                        hamsterlite_both_floor_sensors: '양쪽',
                        hamsterlite_follow_line_until_1: '',
                        hamsterlite_follow_line_until_2: '선을 따라',
                        hamsterlite_follow_line_until_3: '교차로까지 이동하기',
                        hamsterlite_left_intersection: '왼쪽',
                        hamsterlite_right_intersection: '오른쪽',
                        hamsterlite_front_intersection: '앞쪽',
                        hamsterlite_rear_intersection: '뒤쪽',
                        hamsterlite_set_following_speed_to_1: '선 따라가기 속도를',
                        hamsterlite_set_following_speed_to_2: '(으)로 정하기',
                        hamsterlite_front: '앞쪽',
                        hamsterlite_rear: '뒤쪽',
                        hamsterlite_stop: '정지하기',
                        hamsterlite_set_led_to_1: '',
                        hamsterlite_set_led_to_2: 'LED를',
                        hamsterlite_set_led_to_3: '으로 정하기',
                        hamsterlite_left_led: '왼쪽',
                        hamsterlite_right_led: '오른쪽',
                        hamsterlite_both_leds: '양쪽',
                        hamsterlite_clear_led_1: '',
                        hamsterlite_clear_led_2: 'LED 끄기',
                        hamsterlite_color_cyan: '하늘색',
                        hamsterlite_color_magenta: '자주색',
                        hamsterlite_color_black: '검은색',
                        hamsterlite_color_white: '하얀색',
                        hamsterlite_color_red: '빨간색',
                        hamsterlite_color_yellow: '노란색',
                        hamsterlite_color_green: '초록색',
                        hamsterlite_color_blue: '파란색',
                        hamsterlite_beep: '삐 소리내기',
                        hamsterlite_change_buzzer_by_1: '버저 음을',
                        hamsterlite_change_buzzer_by_2: '만큼 바꾸기',
                        hamsterlite_set_buzzer_to_1: '버저 음을',
                        hamsterlite_set_buzzer_to_2: '(으)로 정하기',
                        hamsterlite_clear_buzzer: '버저 끄기',
                        hamsterlite_play_note_for_1: '',
                        hamsterlite_play_note_for_2: '',
                        hamsterlite_play_note_for_3: '음을',
                        hamsterlite_play_note_for_4: '박자 연주하기',
                        hamsterlite_rest_for_1: '',
                        hamsterlite_rest_for_2: '박자 쉬기',
                        hamsterlite_change_tempo_by_1: '연주 속도를',
                        hamsterlite_change_tempo_by_2: '만큼 바꾸기',
                        hamsterlite_set_tempo_to_1: '연주 속도를 분당',
                        hamsterlite_set_tempo_to_2: '박자로 정하기',
                        hamsterlite_set_port_to_1: '포트',
                        hamsterlite_set_port_to_2: '를',
                        hamsterlite_set_port_to_3: '으로 정하기',
                        hamsterlite_change_output_by_1: '출력',
                        hamsterlite_change_output_by_2: '를',
                        hamsterlite_change_output_by_3: '만큼 바꾸기',
                        hamsterlite_set_output_to_1: '출력',
                        hamsterlite_set_output_to_2: '를',
                        hamsterlite_set_output_to_3: '(으)로 정하기',
                        hamsterlite_port_a: 'A',
                        hamsterlite_port_b: 'B',
                        hamsterlite_port_ab: 'A와 B',
                        hamsterlite_analog_input: '아날로그 입력',
                        hamsterlite_digital_input: '디지털 입력',
                        hamsterlite_servo_output: '서보 출력',
                        hamsterlite_pwm_output: 'PWM 출력',
                        hamsterlite_digital_output: '디지털 출력',
                        hamsterlite_note_c: '도',
                        hamsterlite_note_c_sharp: '도♯(레♭)',
                        hamsterlite_note_d: '레',
                        hamsterlite_note_d_sharp: '레♯(미♭)',
                        hamsterlite_note_e: '미',
                        hamsterlite_note_f: '파',
                        hamsterlite_note_f_sharp: '파♯(솔♭)',
                        hamsterlite_note_g: '솔',
                        hamsterlite_note_g_sharp: '솔♯(라♭)',
                        hamsterlite_note_a: '라',
                        hamsterlite_note_a_sharp: '라♯(시♭)',
                        hamsterlite_note_b: '시',
                        hamsterlite_tilt_forward: '앞으로 기울임',
                        hamsterlite_tilt_backward: '뒤로 기울임',
                        hamsterlite_tilt_left: '왼쪽으로 기울임',
                        hamsterlite_tilt_right: '오른쪽으로 기울임',
                        hamsterlite_tilt_flip: '거꾸로 뒤집음',
                        hamsterlite_tilt_not: '기울이지 않음',
                        hamsterlite_battery_normal: '배터리 정상',
                        hamsterlite_battery_low: '배터리 부족',
                        hamsterlite_battery_empty: '배터리 없음',
                        hamsterlite_open_gripper: '열기',
                        hamsterlite_close_gripper: '닫기',
                    },
                },
                en: {
                    template: {
                        hamsterlite_gripper: '%1 gripper %2',
                        hamsterlite_release_gripper: 'release gripper %1',
                        hamsterlite_boolean: '%1?',
                        hamsterlite_play_note: 'play note %1 %2 %3',
                        hamsterlite_hand_found: 'hand found?',
                        hamsterlite_value: '%1',
                        hamsterlite_move_forward_once: 'move forward once on board %1',
                        hamsterlite_turn_once: 'turn %1 once on board %2',
                        hamsterlite_move_forward_for_secs: 'move forward for %1 secs %2',
                        hamsterlite_move_backward_for_secs: 'move backward for %1 secs %2',
                        hamsterlite_turn_for_secs: 'turn %1 for %2 secs %3',
                        hamsterlite_change_both_wheels_by: 'change wheels by left: %1 right: %2 %3',
                        hamsterlite_set_both_wheels_to: 'set wheels to left: %1 right: %2 %3',
                        hamsterlite_change_wheel_by: 'change %1 wheel by %2 %3',
                        hamsterlite_set_wheel_to: 'set %1 wheel to %2 %3',
                        hamsterlite_follow_line_using: 'follow %1 line using %2 floor sensor %3',
                        hamsterlite_follow_line_until: 'follow %1 line until %2 intersection %3',
                        hamsterlite_set_following_speed_to: 'set following speed to %1 %2',
                        hamsterlite_stop: 'stop %1',
                        hamsterlite_set_led_to: 'set %1 led to %2 %3',
                        hamsterlite_clear_led: 'clear %1 led %2',
                        hamsterlite_beep: 'beep %1',
                        hamsterlite_change_buzzer_by: 'change buzzer by %1 %2',
                        hamsterlite_set_buzzer_to: 'set buzzer to %1 %2',
                        hamsterlite_clear_buzzer: 'clear buzzer %1',
                        hamsterlite_play_note_for: 'play note %1 %2 for %3 beats %4',
                        hamsterlite_rest_for: 'rest for %1 beats %2',
                        hamsterlite_change_tempo_by: 'change tempo by %1 %2',
                        hamsterlite_set_tempo_to: 'set tempo to %1 bpm %2',
                        hamsterlite_set_port_to: 'set port %1 to %2 %3',
                        hamsterlite_change_output_by: 'change output %1 by %2 %3',
                        hamsterlite_set_output_to: 'set output %1 to %2 %3',
                    },
                    Helper: {
                        hamsterlite_gripper: 'Opens or closes the gripper.',
                        hamsterlite_release_gripper:
                            'Turns off the gripper so that it can be moved freely.',
                        hamsterlite_boolean:
                            'tilt forward: If tilted forward, true, otherwise false<br/>tilt backward: If tilted backward, true, otherwise false<br/>tilt left: If tilted to the left, true, otherwise false<br/>tilt right: If tilted to the right, true, otherwise false<br/>tilt flip: If upside-down, true, otherwise false<br/>not tilt: If not tilted, true, otherwise false<br/>battery normal: If the battery is enough, true, otherwise false<br/>battery low: If the battery is low, true, otherwise false<br/>battery empty: If the battery is empty, true, otherwise false',
                        hamsterlite_play_note: 'It sounds the selected tone and octave.',
                        hamsterlite_beep: 'Plays beep sound.',
                        hamsterlite_change_both_wheels_by:
                            'Adds the entered values to the current speed values (%) of the left and right wheels respectively. If the result is positive, the wheel rotates forward; if negative, the wheel rotates backward.',
                        hamsterlite_change_buzzer_by:
                            'Adds the entered value to the current pitch (Hz) of the buzzer sound. You can enter up to two decimal places.',
                        hamsterlite_change_output_by:
                            'Adds the entered value to the current output value of the selected external port. The result will be in the following range depending on the mode of the external port.<br/>Servo output: valid range from 1 to 180 degrees; if 0, output 0 without PWM pulse<br/>PWM output: 0 to 100%, duty ratio (%) of ON state in PWM waveform<br/>Digital output: LOW when 0, otherwise HIGH',
                        hamsterlite_change_tempo_by:
                            'Adds the entered value to the current BPM (beats per minute) of the playing or resting speed.',
                        hamsterlite_change_wheel_by:
                            'Adds the entered value to the current speed value (%) of the left/right/both wheels. If the result is positive, the wheel rotates forward; if negative, the wheel rotates backward.',
                        hamsterlite_clear_buzzer: 'Turns off buzzer sound.',
                        hamsterlite_clear_led: 'Turns off the left/right/both LEDs.',
                        hamsterlite_follow_line_until:
                            'Moves along the black/white line on the left/right/front/back, then stops when the robot meets the intersection.',
                        hamsterlite_follow_line_using:
                            'Moves along the black/white line by using the left/right/both floor sensors.',
                        hamsterlite_hand_found:
                            'If there is a hand or object in front of the proximity sensor, true, otherwise false',
                        hamsterlite_move_backward_for_secs:
                            'Moves backward for the number of seconds entered.',
                        hamsterlite_move_forward_for_secs:
                            'Moves forward for the number of seconds entered.',
                        hamsterlite_move_forward_once: 'Moves one space forward on the board.',
                        hamsterlite_play_note_for:
                            'It sounds the selected tone and octave as much as the beat you entered.',
                        hamsterlite_rest_for: 'Rests as much as the beat you entered.',
                        hamsterlite_set_both_wheels_to:
                            'Sets the speed of the left and right wheels to the entered values (-100 to 100%), respectively. If you enter a positive value, the wheel rotates forward. If you enter a negative value, the wheel rotates backward. Entering the number 0 stops it.',
                        hamsterlite_set_buzzer_to:
                            'Sets the pitch of the buzzer sound to the entered value (Hz). You can enter up to two decimal places. Entering the number 0 turns off the buzzer sound.',
                        hamsterlite_set_following_speed_to:
                            'Sets the speed (1 to 8) to move along the line. The larger the number, the faster the movement.',
                        hamsterlite_set_led_to: 'Turns left/right/both LEDs to the selected color.',
                        hamsterlite_set_output_to:
                            'Sets the output value of the selected external port to the entered value. The value has the following range according to the mode of external port.<br/>Servo output: valid range from 1 to 180 degrees; if 0, output 0 without PWM pulse<br/>PWM output: 0 to 100%, duty ratio (%) of ON state in PWM waveform<br/>Digital output: LOW when 0, otherwise HIGH',
                        hamsterlite_set_port_to:
                            'Sets the io mode of the selected external port to the selected mode.',
                        hamsterlite_set_tempo_to:
                            'Sets the playing or resting speed to the entered BPM (beats per minute).',
                        hamsterlite_set_wheel_to:
                            'Sets the speed of the left/right/both wheels to the entered value (-100 to 100%). If you enter a positive value, the wheel rotates forward. If you enter a negative value, the wheel rotates backward. Entering the number 0 stops it.',
                        hamsterlite_stop: 'Stops both wheels.',
                        hamsterlite_turn_for_secs:
                            'Turns left/right for the number of seconds entered.',
                        hamsterlite_turn_once: 'Turns left/right 90 degrees on the board.',
                        hamsterlite_value:
                            'left proximity: value of left proximity sensor (range: 0 to 255, initial value: 0)<br/>right proximity: value of right proximity sensor (range: 0 to 255, initial value: 0)<br/>left floor: value of left floor sensor (range: 0 to 100, initial value: 0)<br/>right floor: value of right floor sensor (range: 0 to 100, initial value: 0)<br/>x acceleration: x-axis value of acceleration sensor (range: -32768 to 32767, initial value: 0) The direction in which the robot moves forward is the positive direction of the x axis.<br/>y acceleration: y-axis value of acceleration sensor (range: -32768 to 32767, initial value: 0) The left direction of the robot is the positive direction of the y axis.<br/>z acceleration: z-axis value of acceleration sensor (range: -32768 to 32767, initial value: 0) The upward direction of the robot is the positive direction of the z axis.<br/>light: value of light sensor (range: 0 to 65535, initial value: 0) The brighter, the larger the value.<br/>temperature: temperature value inside the robot (range: -40 to 88 degrees Celsius, initial value: 0)<br/>signal strength: signal strength of Bluetooth communication (range: -128 to 0 dBm, initial value: 0) As the signal strength increases, the value increases.<br/>input A: value of signal input to external port A (range: analog input 0 to 255, digital input 0 or 1, initial value: 0)<br/>input B: value of signal input to external port B (range: analog input 0 to 255, digital input 0 or 1, initial value: 0)',
                    },
                    Blocks: {
                        hamsterlite_hand_found: 'hand found?',
                        hamsterlite_sensor_left_proximity: 'left proximity',
                        hamsterlite_sensor_right_proximity: 'right proximity',
                        hamsterlite_sensor_left_floor: 'left floor',
                        hamsterlite_sensor_right_floor: 'right floor',
                        hamsterlite_sensor_acceleration_x: 'x acceleration',
                        hamsterlite_sensor_acceleration_y: 'y acceleration',
                        hamsterlite_sensor_acceleration_z: 'z acceleration',
                        hamsterlite_sensor_light: 'light',
                        hamsterlite_sensor_temperature: 'temperature',
                        hamsterlite_sensor_signal_strength: 'signal strength',
                        hamsterlite_sensor_input_a: 'input A',
                        hamsterlite_sensor_input_b: 'input B',
                        hamsterlite_move_forward_once: 'move forward once on board',
                        hamsterlite_turn_once_1: 'turn',
                        hamsterlite_turn_once_2: 'once on board',
                        hamsterlite_turn_once_left: 'left',
                        hamsterlite_turn_right: 'right',
                        hamsterlite_move_forward: 'move forward',
                        hamsterlite_move_backward: 'move backward',
                        hamsterlite_turn_around_1: 'turn',
                        hamsterlite_turn_around_2: '',
                        hamsterlite_move_forward_for_secs_1: 'move forward for',
                        hamsterlite_move_forward_for_secs_2: 'secs',
                        hamsterlite_move_backward_for_secs_1: 'move backward',
                        hamsterlite_move_backward_for_secs_2: 'secs',
                        hamsterlite_turn_for_secs_1: 'turn',
                        hamsterlite_turn_for_secs_2: 'for',
                        hamsterlite_turn_for_secs_3: 'secs',
                        hamsterlite_change_both_wheels_by_1: 'change wheel by left:',
                        hamsterlite_change_both_wheels_by_2: 'right:',
                        hamsterlite_change_both_wheels_by_3: '',
                        hamsterlite_set_both_wheels_to_1: 'set wheel to left:',
                        hamsterlite_set_both_wheels_to_2: 'right:',
                        hamsterlite_set_both_wheels_to_3: '',
                        hamsterlite_change_wheel_by_1: 'change',
                        hamsterlite_change_wheel_by_2: 'wheel by',
                        hamsterlite_change_wheel_by_3: '',
                        hamsterlite_left_wheel: 'left',
                        hamsterlite_right_wheel: 'right',
                        hamsterlite_both_wheels: 'both',
                        hamsterlite_set_wheel_to_1: 'set',
                        hamsterlite_set_wheel_to_2: 'wheel to',
                        hamsterlite_set_wheel_to_3: '',
                        hamsterlite_follow_line_using_1: 'follow',
                        hamsterlite_follow_line_using_2: 'line using',
                        hamsterlite_follow_line_using_3: 'floor sensor',
                        hamsterlite_left_floor_sensor: 'left',
                        hamsterlite_right_floor_sensor: 'right',
                        hamsterlite_both_floor_sensors: 'both',
                        hamsterlite_follow_line_until_1: 'follow',
                        hamsterlite_follow_line_until_2: 'line until',
                        hamsterlite_follow_line_until_3: 'intersection',
                        hamsterlite_left_intersection: 'left',
                        hamsterlite_right_intersection: 'right',
                        hamsterlite_front_intersection: 'front',
                        hamsterlite_rear_intersection: 'rear',
                        hamsterlite_set_following_speed_to_1: 'set following speed to',
                        hamsterlite_set_following_speed_to_2: '',
                        hamsterlite_front: 'front',
                        hamsterlite_rear: 'rear',
                        hamsterlite_stop: 'stop',
                        hamsterlite_set_led_to_1: 'set',
                        hamsterlite_set_led_to_2: 'led to',
                        hamsterlite_set_led_to_3: '',
                        hamsterlite_left_led: 'left',
                        hamsterlite_right_led: 'right',
                        hamsterlite_both_leds: 'both',
                        hamsterlite_clear_led_1: 'clear',
                        hamsterlite_clear_led_2: 'led',
                        hamsterlite_color_cyan: 'sky blue',
                        hamsterlite_color_magenta: 'purple',
                        hamsterlite_color_black: 'black',
                        hamsterlite_color_white: 'white',
                        hamsterlite_color_red: 'red',
                        hamsterlite_color_yellow: 'yellow',
                        hamsterlite_color_green: 'green',
                        hamsterlite_color_blue: 'blue',
                        hamsterlite_beep: 'beep',
                        hamsterlite_change_buzzer_by_1: 'change buzzer by',
                        hamsterlite_change_buzzer_by_2: '',
                        hamsterlite_set_buzzer_to_1: 'set buzzer to',
                        hamsterlite_set_buzzer_to_2: '',
                        hamsterlite_clear_buzzer: 'clear buzzer',
                        hamsterlite_play_note_for_1: 'play note',
                        hamsterlite_play_note_for_2: '',
                        hamsterlite_play_note_for_3: 'for',
                        hamsterlite_play_note_for_4: 'beats',
                        hamsterlite_rest_for_1: 'rest for',
                        hamsterlite_rest_for_2: 'beats',
                        hamsterlite_change_tempo_by_1: 'change tempo by',
                        hamsterlite_change_tempo_by_2: '',
                        hamsterlite_set_tempo_to_1: 'set tempo to',
                        hamsterlite_set_tempo_to_2: 'bpm',
                        hamsterlite_set_port_to_1: 'set port',
                        hamsterlite_set_port_to_2: 'to',
                        hamsterlite_set_port_to_3: '',
                        hamsterlite_change_output_by_1: 'change output',
                        hamsterlite_change_output_by_2: 'by',
                        hamsterlite_change_output_by_3: '',
                        hamsterlite_set_output_to_1: 'set output',
                        hamsterlite_set_output_to_2: 'to',
                        hamsterlite_set_output_to_3: '',
                        hamsterlite_port_a: 'A',
                        hamsterlite_port_b: 'B',
                        hamsterlite_port_ab: 'A and B',
                        hamsterlite_analog_input: 'analog input',
                        hamsterlite_digital_input: 'digital input',
                        hamsterlite_servo_output: 'servo output',
                        hamsterlite_pwm_output: 'pwm output',
                        hamsterlite_digital_output: 'digital output',
                        hamsterlite_note_c: 'C',
                        hamsterlite_note_c_sharp: 'C♯(D♭)',
                        hamsterlite_note_d: 'D',
                        hamsterlite_note_d_sharp: 'D♯(E♭)',
                        hamsterlite_note_e: 'E',
                        hamsterlite_note_f: 'F',
                        hamsterlite_note_f_sharp: 'F♯(G♭)',
                        hamsterlite_note_g: 'G',
                        hamsterlite_note_g_sharp: 'G♯(A♭)',
                        hamsterlite_note_a: 'A',
                        hamsterlite_note_a_sharp: 'A♯(B♭)',
                        hamsterlite_note_b: 'B',
                        hamsterlite_tilt_forward: 'tilt forward',
                        hamsterlite_tilt_backward: 'tilt backward',
                        hamsterlite_tilt_left: 'tilt left',
                        hamsterlite_tilt_right: 'tilt right',
                        hamsterlite_tilt_flip: 'tilt flip',
                        hamsterlite_tilt_not: 'not tilt',
                        hamsterlite_battery_normal: 'battery normal',
                        hamsterlite_battery_low: 'battery low',
                        hamsterlite_battery_empty: 'battery empty',
                        hamsterlite_open_gripper: 'open',
                        hamsterlite_close_gripper: 'close',
                    },
                },
                jp: {
                    template: {
                        hamsterlite_gripper: 'グリッパを %1 %2',
                        hamsterlite_release_gripper: 'グリッパをオフ %1',
                        hamsterlite_boolean: '%1?',
                        hamsterlite_play_note: '%1 %2 を演奏する %3',
                    },
                    Helper: {
                        hamsterlite_gripper: 'Opens or closes the gripper.',
                        hamsterlite_release_gripper:
                            'Turns off the gripper so that it can be moved freely.',
                        hamsterlite_boolean:
                            'tilt forward: If tilted forward, true, otherwise false<br/>tilt backward: If tilted backward, true, otherwise false<br/>tilt left: If tilted to the left, true, otherwise false<br/>tilt right: If tilted to the right, true, otherwise false<br/>tilt flip: If upside-down, true, otherwise false<br/>not tilt: If not tilted, true, otherwise false<br/>battery normal: If the battery is enough, true, otherwise false<br/>battery low: If the battery is low, true, otherwise false<br/>battery empty: If the battery is empty, true, otherwise false',
                        hamsterlite_play_note: '選択された音階（音名、オクターブ）が鳴ります。',
                    },
                    Blocks: {
                        hamsterlite_note_c: 'ド',
                        hamsterlite_note_c_sharp: 'ド♯(レ♭)',
                        hamsterlite_note_d: 'レ',
                        hamsterlite_note_d_sharp: 'レ♯(ミ♭)',
                        hamsterlite_note_e: 'ミ',
                        hamsterlite_note_f: 'ファ',
                        hamsterlite_note_f_sharp: 'ファ♯(ソ♭)',
                        hamsterlite_note_g: 'ソ',
                        hamsterlite_note_g_sharp: 'ソ♯(ラ♭)',
                        hamsterlite_note_a: 'ラ',
                        hamsterlite_note_a_sharp: 'ラ♯(シ♭)',
                        hamsterlite_note_b: 'シ',
                        hamsterlite_tilt_forward: '前に傾けたか',
                        hamsterlite_tilt_backward: '後に傾けたか',
                        hamsterlite_tilt_left: '左に傾けたか',
                        hamsterlite_tilt_right: '右に傾けたか',
                        hamsterlite_tilt_flip: '上下裏返したか',
                        hamsterlite_tilt_not: '傾けなかったか',
                        hamsterlite_battery_normal: '電池が正常か',
                        hamsterlite_battery_low: '電池が足りないか',
                        hamsterlite_battery_empty: '電池がないか',
                        hamsterlite_open_gripper: '開く',
                        hamsterlite_close_gripper: '閉める',
                    },
                },
                vn: {
                    template: {
                        hamsterlite_gripper: '%1 gripper %2',
                        hamsterlite_release_gripper: 'release gripper %1',
                        hamsterlite_boolean: '%1?',
                        hamsterlite_play_note: 'play note %1 %2 %3',
                    },
                    Helper: {
                        hamsterlite_gripper: 'Opens or closes the gripper.',
                        hamsterlite_release_gripper:
                            'Turns off the gripper so that it can be moved freely.',
                        hamsterlite_boolean:
                            'tilt forward: If tilted forward, true, otherwise false<br/>tilt backward: If tilted backward, true, otherwise false<br/>tilt left: If tilted to the left, true, otherwise false<br/>tilt right: If tilted to the right, true, otherwise false<br/>tilt flip: If upside-down, true, otherwise false<br/>not tilt: If not tilted, true, otherwise false<br/>battery normal: If the battery is enough, true, otherwise false<br/>battery low: If the battery is low, true, otherwise false<br/>battery empty: If the battery is empty, true, otherwise false',
                        hamsterlite_play_note: 'It sounds the selected tone and octave.',
                    },
                    Blocks: {
                        hamsterlite_note_c: 'C',
                        hamsterlite_note_c_sharp: 'C♯(D♭)',
                        hamsterlite_note_d: 'D',
                        hamsterlite_note_d_sharp: 'D♯(E♭)',
                        hamsterlite_note_e: 'E',
                        hamsterlite_note_f: 'F',
                        hamsterlite_note_f_sharp: 'F♯(G♭)',
                        hamsterlite_note_g: 'G',
                        hamsterlite_note_g_sharp: 'G♯(A♭)',
                        hamsterlite_note_a: 'A',
                        hamsterlite_note_a_sharp: 'A♯(B♭)',
                        hamsterlite_note_b: 'B',
                        hamsterlite_tilt_forward: 'tilt forward',
                        hamsterlite_tilt_backward: 'tilt backward',
                        hamsterlite_tilt_left: 'tilt left',
                        hamsterlite_tilt_right: 'tilt right',
                        hamsterlite_tilt_flip: 'tilt flip',
                        hamsterlite_tilt_not: 'not tilt',
                        hamsterlite_battery_normal: 'battery normal',
                        hamsterlite_battery_low: 'battery low',
                        hamsterlite_battery_empty: 'battery empty',
                        hamsterlite_open_gripper: 'open',
                        hamsterlite_close_gripper: 'close',
                    },
                },
            };
        }
        getBlocks() {
            return {
                hamsterlite_hand_found: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_boolean_field',
                    statements: [],
                    params: [],
                    events: {},
                    def: {
                        params: [],
                        type: 'hamsterlite_hand_found',
                    },
                    class: 'hamsterlite_sensor',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return Entry.HamsterLite.checkHandFound(script) || false;
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.hand_found()',
                                blockType: 'param',
                            },
                        ],
                    },
                },
                hamsterlite_boolean: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_boolean_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterlite_tilt_forward, 'TILT_FORWARD'],
                                [Lang.Blocks.hamsterlite_tilt_backward, 'TILT_BACKWARD'],
                                [Lang.Blocks.hamsterlite_tilt_left, 'TILT_LEFT'],
                                [Lang.Blocks.hamsterlite_tilt_right, 'TILT_RIGHT'],
                                [Lang.Blocks.hamsterlite_tilt_flip, 'TILT_FLIP'],
                                [Lang.Blocks.hamsterlite_tilt_not, 'TILT_NOT'],
                                [Lang.Blocks.hamsterlite_battery_normal, 'BATTERY_NORMAL'],
                                [Lang.Blocks.hamsterlite_battery_low, 'BATTERY_LOW'],
                                [Lang.Blocks.hamsterlite_battery_empty, 'BATTERY_EMPTY'],
                            ],
                            value: 'TILT_FORWARD',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null],
                        type: 'hamsterlite_boolean',
                    },
                    paramsKeyMap: {
                        DEVICE: 0,
                    },
                    class: 'hamsterlite_sensor',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return Entry.HamsterLite.checkBoolean(script) || false;
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.boolean_value(%1)',
                                blockType: 'param',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_tilt_forward, 'TILT_FORWARD'],
                                            [
                                                Lang.Blocks.hamsterlite_tilt_backward,
                                                'TILT_BACKWARD',
                                            ],
                                            [Lang.Blocks.hamsterlite_tilt_left, 'TILT_LEFT'],
                                            [Lang.Blocks.hamsterlite_tilt_right, 'TILT_RIGHT'],
                                            [Lang.Blocks.hamsterlite_tilt_flip, 'TILT_FLIP'],
                                            [Lang.Blocks.hamsterlite_tilt_not, 'TILT_NOT'],
                                            [
                                                Lang.Blocks.hamsterlite_battery_normal,
                                                'BATTERY_NORMAL',
                                            ],
                                            [Lang.Blocks.hamsterlite_battery_low, 'BATTERY_LOW'],
                                            [
                                                Lang.Blocks.hamsterlite_battery_empty,
                                                'BATTERY_EMPTY',
                                            ],
                                        ],
                                        value: 'TILT_FORWARD',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                            },
                        ],
                    },
                },
                hamsterlite_value: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    fontColor: '#fff',
                    skeleton: 'basic_string_field',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterlite_sensor_left_proximity, 'leftProximity'],
                                [Lang.Blocks.hamsterlite_sensor_right_proximity, 'rightProximity'],
                                [Lang.Blocks.hamsterlite_sensor_left_floor, 'leftFloor'],
                                [Lang.Blocks.hamsterlite_sensor_right_floor, 'rightFloor'],
                                [Lang.Blocks.hamsterlite_sensor_acceleration_x, 'accelerationX'],
                                [Lang.Blocks.hamsterlite_sensor_acceleration_y, 'accelerationY'],
                                [Lang.Blocks.hamsterlite_sensor_acceleration_z, 'accelerationZ'],
                                [Lang.Blocks.hamsterlite_sensor_light, 'light'],
                                [Lang.Blocks.hamsterlite_sensor_temperature, 'temperature'],
                                [Lang.Blocks.hamsterlite_sensor_signal_strength, 'signalStrength'],
                                [Lang.Blocks.hamsterlite_sensor_input_a, 'inputA'],
                                [Lang.Blocks.hamsterlite_sensor_input_b, 'inputB'],
                            ],
                            value: 'leftProximity',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null],
                        type: 'hamsterlite_value',
                    },
                    paramsKeyMap: {
                        DEVICE: 0,
                    },
                    class: 'hamsterlite_sensor',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return Entry.HamsterLite.getValue(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.sensor_value(%1)',
                                blockType: 'param',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [
                                                Lang.Blocks.hamsterlite_sensor_left_proximity,
                                                'leftProximity',
                                            ],
                                            [
                                                Lang.Blocks.hamsterlite_sensor_right_proximity,
                                                'rightProximity',
                                            ],
                                            [
                                                Lang.Blocks.hamsterlite_sensor_left_floor,
                                                'leftFloor',
                                            ],
                                            [
                                                Lang.Blocks.hamsterlite_sensor_right_floor,
                                                'rightFloor',
                                            ],
                                            [
                                                Lang.Blocks.hamsterlite_sensor_acceleration_x,
                                                'accelerationX',
                                            ],
                                            [
                                                Lang.Blocks.hamsterlite_sensor_acceleration_y,
                                                'accelerationY',
                                            ],
                                            [
                                                Lang.Blocks.hamsterlite_sensor_acceleration_z,
                                                'accelerationZ',
                                            ],
                                            [Lang.Blocks.hamsterlite_sensor_light, 'light'],
                                            [
                                                Lang.Blocks.hamsterlite_sensor_temperature,
                                                'temperature',
                                            ],
                                            [
                                                Lang.Blocks.hamsterlite_sensor_signal_strength,
                                                'signalStrength',
                                            ],
                                            [Lang.Blocks.hamsterlite_sensor_input_a, 'inputA'],
                                            [Lang.Blocks.hamsterlite_sensor_input_b, 'inputB'],
                                        ],
                                        value: 'leftProximity',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                            },
                        ],
                    },
                },
                hamsterlite_move_forward_once: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null],
                        type: 'hamsterlite_move_forward_once',
                    },
                    class: 'hamsterlite_board',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return Entry.HamsterLite.boardForward(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.board_forward()',
                            },
                        ],
                    },
                },
                hamsterlite_turn_once: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterlite_turn_once_left, 'LEFT'],
                                [Lang.Blocks.hamsterlite_turn_right, 'RIGHT'],
                            ],
                            value: 'LEFT',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null, null],
                        type: 'hamsterlite_turn_once',
                    },
                    paramsKeyMap: {
                        DIRECTION: 0,
                    },
                    class: 'hamsterlite_board',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return Entry.HamsterLite.boardTurn(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.board_turn(%1)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_turn_once_left, 'LEFT'],
                                            [Lang.Blocks.hamsterlite_turn_right, 'RIGHT'],
                                        ],
                                        value: 'LEFT',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                            },
                        ],
                    },
                },
                hamsterlite_move_forward_for_secs: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'text',
                                params: ['1'],
                            },
                            null,
                        ],
                        type: 'hamsterlite_move_forward_for_secs',
                    },
                    paramsKeyMap: {
                        SECS: 0,
                    },
                    class: 'hamsterlite_wheel',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return Entry.HamsterLite.moveForwardSecs(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.move_forward(%1)',
                                textParams: [
                                    {
                                        type: 'Block',
                                        accept: 'string',
                                    },
                                ],
                            },
                        ],
                    },
                },
                hamsterlite_move_backward_for_secs: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'text',
                                params: ['1'],
                            },
                            null,
                        ],
                        type: 'hamsterlite_move_backward_for_secs',
                    },
                    paramsKeyMap: {
                        SECS: 0,
                    },
                    class: 'hamsterlite_wheel',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return Entry.HamsterLite.moveBackwardSecs(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.move_backward(%1)',
                                textParams: [
                                    {
                                        type: 'Block',
                                        accept: 'string',
                                    },
                                ],
                            },
                        ],
                    },
                },
                hamsterlite_turn_for_secs: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterlite_turn_once_left, 'LEFT'],
                                [Lang.Blocks.hamsterlite_turn_right, 'RIGHT'],
                            ],
                            value: 'LEFT',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            null,
                            {
                                type: 'text',
                                params: ['1'],
                            },
                            null,
                        ],
                        type: 'hamsterlite_turn_for_secs',
                    },
                    paramsKeyMap: {
                        DIRECTION: 0,
                        SECS: 1,
                    },
                    class: 'hamsterlite_wheel',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return Entry.HamsterLite.turnSecs(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.turn(%1, %2)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_turn_once_left, 'LEFT'],
                                            [Lang.Blocks.hamsterlite_turn_right, 'RIGHT'],
                                        ],
                                        value: 'LEFT',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                    {
                                        type: 'Block',
                                        accept: 'string',
                                    },
                                ],
                            },
                        ],
                    },
                },
                hamsterlite_change_both_wheels_by: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'text',
                                params: ['10'],
                            },
                            {
                                type: 'text',
                                params: ['10'],
                            },
                            null,
                        ],
                        type: 'hamsterlite_change_both_wheels_by',
                    },
                    paramsKeyMap: {
                        LEFT: 0,
                        RIGHT: 1,
                    },
                    class: 'hamsterlite_wheel',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return Entry.HamsterLite.changeWheels(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.add_wheels(%1, %2)',
                                textParams: [
                                    {
                                        type: 'Block',
                                        accept: 'string',
                                    },
                                    {
                                        type: 'Block',
                                        accept: 'string',
                                    },
                                ],
                            },
                        ],
                    },
                },
                hamsterlite_set_both_wheels_to: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'text',
                                params: ['30'],
                            },
                            {
                                type: 'text',
                                params: ['30'],
                            },
                            null,
                        ],
                        type: 'hamsterlite_set_both_wheels_to',
                    },
                    paramsKeyMap: {
                        LEFT: 0,
                        RIGHT: 1,
                    },
                    class: 'hamsterlite_wheel',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return Entry.HamsterLite.setWheels(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.set_wheels(%1, %2)',
                                textParams: [
                                    {
                                        type: 'Block',
                                        accept: 'string',
                                    },
                                    {
                                        type: 'Block',
                                        accept: 'string',
                                    },
                                ],
                            },
                        ],
                    },
                },
                hamsterlite_change_wheel_by: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterlite_left_wheel, 'LEFT'],
                                [Lang.Blocks.hamsterlite_right_wheel, 'RIGHT'],
                                [Lang.Blocks.hamsterlite_both_wheels, 'BOTH'],
                            ],
                            value: 'LEFT',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            null,
                            {
                                type: 'text',
                                params: ['10'],
                            },
                            null,
                        ],
                        type: 'hamsterlite_change_wheel_by',
                    },
                    paramsKeyMap: {
                        WHEEL: 0,
                        VELOCITY: 1,
                    },
                    class: 'hamsterlite_wheel',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return Entry.HamsterLite.changeWheel(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.add_wheel(%1, %2)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_left_wheel, 'LEFT'],
                                            [Lang.Blocks.hamsterlite_right_wheel, 'RIGHT'],
                                            [Lang.Blocks.hamsterlite_both_wheels, 'BOTH'],
                                        ],
                                        value: 'LEFT',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                    {
                                        type: 'Block',
                                        accept: 'string',
                                    },
                                ],
                            },
                        ],
                    },
                },
                hamsterlite_set_wheel_to: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterlite_left_wheel, 'LEFT'],
                                [Lang.Blocks.hamsterlite_right_wheel, 'RIGHT'],
                                [Lang.Blocks.hamsterlite_both_wheels, 'BOTH'],
                            ],
                            value: 'LEFT',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            null,
                            {
                                type: 'text',
                                params: ['30'],
                            },
                            null,
                        ],
                        type: 'hamsterlite_set_wheel_to',
                    },
                    paramsKeyMap: {
                        WHEEL: 0,
                        VELOCITY: 1,
                    },
                    class: 'hamsterlite_wheel',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return Entry.HamsterLite.setWheel(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.set_wheel(%1, %2)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_left_wheel, 'LEFT'],
                                            [Lang.Blocks.hamsterlite_right_wheel, 'RIGHT'],
                                            [Lang.Blocks.hamsterlite_both_wheels, 'BOTH'],
                                        ],
                                        value: 'LEFT',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                    {
                                        type: 'Block',
                                        accept: 'string',
                                    },
                                ],
                            },
                        ],
                    },
                },
                hamsterlite_follow_line_using: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterlite_color_black, 'BLACK'],
                                [Lang.Blocks.hamsterlite_color_white, 'WHITE'],
                            ],
                            value: 'BLACK',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterlite_left_floor_sensor, 'LEFT'],
                                [Lang.Blocks.hamsterlite_right_floor_sensor, 'RIGHT'],
                                [Lang.Blocks.hamsterlite_both_floor_sensors, 'BOTH'],
                            ],
                            value: 'LEFT',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null, null, null],
                        type: 'hamsterlite_follow_line_using',
                    },
                    paramsKeyMap: {
                        COLOR: 0,
                        SENSOR: 1,
                    },
                    class: 'hamsterlite_wheel',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return Entry.HamsterLite.followLine(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.follow_line(%1, %2)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_color_black, 'BLACK'],
                                            [Lang.Blocks.hamsterlite_color_white, 'WHITE'],
                                        ],
                                        value: 'BLACK',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_left_floor_sensor, 'LEFT'],
                                            [Lang.Blocks.hamsterlite_right_floor_sensor, 'RIGHT'],
                                            [Lang.Blocks.hamsterlite_both_floor_sensors, 'BOTH'],
                                        ],
                                        value: 'LEFT',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                            },
                        ],
                    },
                },
                hamsterlite_follow_line_until: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterlite_color_black, 'BLACK'],
                                [Lang.Blocks.hamsterlite_color_white, 'WHITE'],
                            ],
                            value: 'BLACK',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterlite_left_floor_sensor, 'LEFT'],
                                [Lang.Blocks.hamsterlite_right_floor_sensor, 'RIGHT'],
                                [Lang.Blocks.hamsterlite_front, 'FRONT'],
                                [Lang.Blocks.hamsterlite_rear, 'REAR'],
                            ],
                            value: 'FRONT',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null, null, null],
                        type: 'hamsterlite_follow_line_until',
                    },
                    paramsKeyMap: {
                        COLOR: 0,
                        DIRECTION: 1,
                    },
                    class: 'hamsterlite_wheel',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return Entry.HamsterLite.followLineUntil(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.follow_line_until(%1, %2)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_color_black, 'BLACK'],
                                            [Lang.Blocks.hamsterlite_color_white, 'WHITE'],
                                        ],
                                        value: 'BLACK',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_left_floor_sensor, 'LEFT'],
                                            [Lang.Blocks.hamsterlite_right_floor_sensor, 'RIGHT'],
                                            [Lang.Blocks.hamsterlite_front, 'FRONT'],
                                            [Lang.Blocks.hamsterlite_rear, 'REAR'],
                                        ],
                                        value: 'FRONT',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                            },
                        ],
                    },
                },
                hamsterlite_set_following_speed_to: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                ['1', '1'],
                                ['2', '2'],
                                ['3', '3'],
                                ['4', '4'],
                                ['5', '5'],
                                ['6', '6'],
                                ['7', '7'],
                                ['8', '8'],
                            ],
                            value: '1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: ['5', null],
                        type: 'hamsterlite_set_following_speed_to',
                    },
                    paramsKeyMap: {
                        SPEED: 0,
                    },
                    class: 'hamsterlite_wheel',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return Entry.HamsterLite.setLineTracerSpeed(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.set_line_speed(%1)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            ['1', '1'],
                                            ['2', '2'],
                                            ['3', '3'],
                                            ['4', '4'],
                                            ['5', '5'],
                                            ['6', '6'],
                                            ['7', '7'],
                                            ['8', '8'],
                                        ],
                                        value: '1',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter:
                                            Entry.block.converters.returnStringOrNumberByValue,
                                    },
                                ],
                            },
                        ],
                    },
                },
                hamsterlite_stop: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null],
                        type: 'hamsterlite_stop',
                    },
                    class: 'hamsterlite_wheel',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return Entry.HamsterLite.stop(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.stop()',
                            },
                        ],
                    },
                },
                hamsterlite_set_led_to: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterlite_left_led, 'LEFT'],
                                [Lang.Blocks.hamsterlite_right_led, 'RIGHT'],
                                [Lang.Blocks.hamsterlite_both_leds, 'BOTH'],
                            ],
                            value: 'LEFT',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterlite_color_red, '4'],
                                [Lang.Blocks.hamsterlite_color_yellow, '6'],
                                [Lang.Blocks.hamsterlite_color_green, '2'],
                                [Lang.Blocks.hamsterlite_color_cyan, '3'],
                                [Lang.Blocks.hamsterlite_color_blue, '1'],
                                [Lang.Blocks.hamsterlite_color_magenta, '5'],
                                [Lang.Blocks.hamsterlite_color_white, '7'],
                            ],
                            value: '4',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null, null, null],
                        type: 'hamsterlite_set_led_to',
                    },
                    paramsKeyMap: {
                        LED: 0,
                        COLOR: 1,
                    },
                    class: 'hamsterlite_led',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return Entry.HamsterLite.setLed(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.set_led_red(%1)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_left_led, 'LEFT'],
                                            [Lang.Blocks.hamsterlite_right_led, 'RIGHT'],
                                            [Lang.Blocks.hamsterlite_both_leds, 'BOTH'],
                                        ],
                                        value: 'LEFT',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_color_red, '4'],
                                            [Lang.Blocks.hamsterlite_color_yellow, '6'],
                                            [Lang.Blocks.hamsterlite_color_green, '2'],
                                            [Lang.Blocks.hamsterlite_color_cyan, '3'],
                                            [Lang.Blocks.hamsterlite_color_blue, '1'],
                                            [Lang.Blocks.hamsterlite_color_magenta, '5'],
                                            [Lang.Blocks.hamsterlite_color_white, '7'],
                                        ],
                                        value: '4',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                params: [null, '4'],
                            },
                            {
                                syntax: 'Hamsterlite.set_led_yellow(%1)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_left_led, 'LEFT'],
                                            [Lang.Blocks.hamsterlite_right_led, 'RIGHT'],
                                            [Lang.Blocks.hamsterlite_both_leds, 'BOTH'],
                                        ],
                                        value: 'LEFT',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_color_red, '4'],
                                            [Lang.Blocks.hamsterlite_color_yellow, '6'],
                                            [Lang.Blocks.hamsterlite_color_green, '2'],
                                            [Lang.Blocks.hamsterlite_color_cyan, '3'],
                                            [Lang.Blocks.hamsterlite_color_blue, '1'],
                                            [Lang.Blocks.hamsterlite_color_magenta, '5'],
                                            [Lang.Blocks.hamsterlite_color_white, '7'],
                                        ],
                                        value: '4',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                params: [null, '6'],
                            },
                            {
                                syntax: 'Hamsterlite.set_led_green(%1)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_left_led, 'LEFT'],
                                            [Lang.Blocks.hamsterlite_right_led, 'RIGHT'],
                                            [Lang.Blocks.hamsterlite_both_leds, 'BOTH'],
                                        ],
                                        value: 'LEFT',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_color_red, '4'],
                                            [Lang.Blocks.hamsterlite_color_yellow, '6'],
                                            [Lang.Blocks.hamsterlite_color_green, '2'],
                                            [Lang.Blocks.hamsterlite_color_cyan, '3'],
                                            [Lang.Blocks.hamsterlite_color_blue, '1'],
                                            [Lang.Blocks.hamsterlite_color_magenta, '5'],
                                            [Lang.Blocks.hamsterlite_color_white, '7'],
                                        ],
                                        value: '4',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                params: [null, '2'],
                            },
                            {
                                syntax: 'Hamsterlite.set_led_sky_blue(%1)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_left_led, 'LEFT'],
                                            [Lang.Blocks.hamsterlite_right_led, 'RIGHT'],
                                            [Lang.Blocks.hamsterlite_both_leds, 'BOTH'],
                                        ],
                                        value: 'LEFT',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_color_red, '4'],
                                            [Lang.Blocks.hamsterlite_color_yellow, '6'],
                                            [Lang.Blocks.hamsterlite_color_green, '2'],
                                            [Lang.Blocks.hamsterlite_color_cyan, '3'],
                                            [Lang.Blocks.hamsterlite_color_blue, '1'],
                                            [Lang.Blocks.hamsterlite_color_magenta, '5'],
                                            [Lang.Blocks.hamsterlite_color_white, '7'],
                                        ],
                                        value: '4',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                params: [null, '3'],
                            },
                            {
                                syntax: 'Hamsterlite.set_led_blue(%1)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_left_led, 'LEFT'],
                                            [Lang.Blocks.hamsterlite_right_led, 'RIGHT'],
                                            [Lang.Blocks.hamsterlite_both_leds, 'BOTH'],
                                        ],
                                        value: 'LEFT',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_color_red, '4'],
                                            [Lang.Blocks.hamsterlite_color_yellow, '6'],
                                            [Lang.Blocks.hamsterlite_color_green, '2'],
                                            [Lang.Blocks.hamsterlite_color_cyan, '3'],
                                            [Lang.Blocks.hamsterlite_color_blue, '1'],
                                            [Lang.Blocks.hamsterlite_color_magenta, '5'],
                                            [Lang.Blocks.hamsterlite_color_white, '7'],
                                        ],
                                        value: '4',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                params: [null, '1'],
                            },
                            {
                                syntax: 'Hamsterlite.set_led_purple(%1)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_left_led, 'LEFT'],
                                            [Lang.Blocks.hamsterlite_right_led, 'RIGHT'],
                                            [Lang.Blocks.hamsterlite_both_leds, 'BOTH'],
                                        ],
                                        value: 'LEFT',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_color_red, '4'],
                                            [Lang.Blocks.hamsterlite_color_yellow, '6'],
                                            [Lang.Blocks.hamsterlite_color_green, '2'],
                                            [Lang.Blocks.hamsterlite_color_cyan, '3'],
                                            [Lang.Blocks.hamsterlite_color_blue, '1'],
                                            [Lang.Blocks.hamsterlite_color_magenta, '5'],
                                            [Lang.Blocks.hamsterlite_color_white, '7'],
                                        ],
                                        value: '4',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                params: [null, '5'],
                            },
                            {
                                syntax: 'Hamsterlite.set_led_white(%1)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_left_led, 'LEFT'],
                                            [Lang.Blocks.hamsterlite_right_led, 'RIGHT'],
                                            [Lang.Blocks.hamsterlite_both_leds, 'BOTH'],
                                        ],
                                        value: 'LEFT',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_color_red, '4'],
                                            [Lang.Blocks.hamsterlite_color_yellow, '6'],
                                            [Lang.Blocks.hamsterlite_color_green, '2'],
                                            [Lang.Blocks.hamsterlite_color_cyan, '3'],
                                            [Lang.Blocks.hamsterlite_color_blue, '1'],
                                            [Lang.Blocks.hamsterlite_color_magenta, '5'],
                                            [Lang.Blocks.hamsterlite_color_white, '7'],
                                        ],
                                        value: '4',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                params: [null, '7'],
                            },
                        ],
                    },
                },
                hamsterlite_clear_led: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterlite_left_led, 'LEFT'],
                                [Lang.Blocks.hamsterlite_right_led, 'RIGHT'],
                                [Lang.Blocks.hamsterlite_both_leds, 'BOTH'],
                            ],
                            value: 'LEFT',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null, null],
                        type: 'hamsterlite_clear_led',
                    },
                    paramsKeyMap: {
                        LED: 0,
                    },
                    class: 'hamsterlite_led',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return Entry.HamsterLite.clearLed(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.clear_led(%1)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_left_led, 'LEFT'],
                                            [Lang.Blocks.hamsterlite_right_led, 'RIGHT'],
                                            [Lang.Blocks.hamsterlite_both_leds, 'BOTH'],
                                        ],
                                        value: 'LEFT',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                            },
                        ],
                    },
                },
                hamsterlite_beep: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null],
                        type: 'hamsterlite_beep',
                    },
                    class: 'hamsterlite_buzzer',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return Entry.HamsterLite.beep(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.beep()',
                            },
                        ],
                    },
                },
                hamsterlite_change_buzzer_by: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'text',
                                params: ['10'],
                            },
                            null,
                        ],
                        type: 'hamsterlite_change_buzzer_by',
                    },
                    paramsKeyMap: {
                        HZ: 0,
                    },
                    class: 'hamsterlite_buzzer',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return Entry.HamsterLite.changeBuzzer(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.add_buzzer(%1)',
                            },
                        ],
                    },
                },
                hamsterlite_set_buzzer_to: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'text',
                                params: ['1000'],
                            },
                            null,
                        ],
                        type: 'hamsterlite_set_buzzer_to',
                    },
                    paramsKeyMap: {
                        HZ: 0,
                    },
                    class: 'hamsterlite_buzzer',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return Entry.HamsterLite.setBuzzer(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.set_buzzer(%1)',
                            },
                        ],
                    },
                },
                hamsterlite_clear_buzzer: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null],
                        type: 'hamsterlite_clear_buzzer',
                    },
                    class: 'hamsterlite_buzzer',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return Entry.HamsterLite.clearBuzzer(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.clear_buzzer()',
                            },
                        ],
                    },
                },
                hamsterlite_play_note: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterlite_note_c, '4'],
                                [Lang.Blocks.hamsterlite_note_c_sharp, '5'],
                                [Lang.Blocks.hamsterlite_note_d, '6'],
                                [Lang.Blocks.hamsterlite_note_d_sharp, '7'],
                                [Lang.Blocks.hamsterlite_note_e, '8'],
                                [Lang.Blocks.hamsterlite_note_f, '9'],
                                [Lang.Blocks.hamsterlite_note_f_sharp, '10'],
                                [Lang.Blocks.hamsterlite_note_g, '11'],
                                [Lang.Blocks.hamsterlite_note_g_sharp, '12'],
                                [Lang.Blocks.hamsterlite_note_a, '13'],
                                [Lang.Blocks.hamsterlite_note_a_sharp, '14'],
                                [Lang.Blocks.hamsterlite_note_b, '15'],
                            ],
                            value: '4',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                ['1', '1'],
                                ['2', '2'],
                                ['3', '3'],
                                ['4', '4'],
                                ['5', '5'],
                                ['6', '6'],
                                ['7', '7'],
                            ],
                            value: '1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null, '4', null],
                        type: 'hamsterlite_play_note',
                    },
                    paramsKeyMap: {
                        NOTE: 0,
                        OCTAVE: 1,
                    },
                    class: 'hamsterlite_buzzer',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return Entry.HamsterLite.playNote(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.play_pitch_c(%2)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_note_c, '4'],
                                            [Lang.Blocks.hamsterlite_note_c_sharp, '5'],
                                            [Lang.Blocks.hamsterlite_note_d, '6'],
                                            [Lang.Blocks.hamsterlite_note_d_sharp, '7'],
                                            [Lang.Blocks.hamsterlite_note_e, '8'],
                                            [Lang.Blocks.hamsterlite_note_f, '9'],
                                            [Lang.Blocks.hamsterlite_note_f_sharp, '10'],
                                            [Lang.Blocks.hamsterlite_note_g, '11'],
                                            [Lang.Blocks.hamsterlite_note_g_sharp, '12'],
                                            [Lang.Blocks.hamsterlite_note_a, '13'],
                                            [Lang.Blocks.hamsterlite_note_a_sharp, '14'],
                                            [Lang.Blocks.hamsterlite_note_b, '15'],
                                        ],
                                        value: '4',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            ['1', '1'],
                                            ['2', '2'],
                                            ['3', '3'],
                                            ['4', '4'],
                                            ['5', '5'],
                                            ['6', '6'],
                                            ['7', '7'],
                                        ],
                                        value: '1',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter:
                                            Entry.block.converters.returnStringOrNumberByValue,
                                    },
                                ],
                                params: ['4'],
                            },
                            {
                                syntax: 'Hamsterlite.play_pitch_c_sharp(%2)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_note_c, '4'],
                                            [Lang.Blocks.hamsterlite_note_c_sharp, '5'],
                                            [Lang.Blocks.hamsterlite_note_d, '6'],
                                            [Lang.Blocks.hamsterlite_note_d_sharp, '7'],
                                            [Lang.Blocks.hamsterlite_note_e, '8'],
                                            [Lang.Blocks.hamsterlite_note_f, '9'],
                                            [Lang.Blocks.hamsterlite_note_f_sharp, '10'],
                                            [Lang.Blocks.hamsterlite_note_g, '11'],
                                            [Lang.Blocks.hamsterlite_note_g_sharp, '12'],
                                            [Lang.Blocks.hamsterlite_note_a, '13'],
                                            [Lang.Blocks.hamsterlite_note_a_sharp, '14'],
                                            [Lang.Blocks.hamsterlite_note_b, '15'],
                                        ],
                                        value: '4',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            ['1', '1'],
                                            ['2', '2'],
                                            ['3', '3'],
                                            ['4', '4'],
                                            ['5', '5'],
                                            ['6', '6'],
                                            ['7', '7'],
                                        ],
                                        value: '1',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter:
                                            Entry.block.converters.returnStringOrNumberByValue,
                                    },
                                ],
                                params: ['5'],
                            },
                            {
                                syntax: 'Hamsterlite.play_pitch_d(%2)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_note_c, '4'],
                                            [Lang.Blocks.hamsterlite_note_c_sharp, '5'],
                                            [Lang.Blocks.hamsterlite_note_d, '6'],
                                            [Lang.Blocks.hamsterlite_note_d_sharp, '7'],
                                            [Lang.Blocks.hamsterlite_note_e, '8'],
                                            [Lang.Blocks.hamsterlite_note_f, '9'],
                                            [Lang.Blocks.hamsterlite_note_f_sharp, '10'],
                                            [Lang.Blocks.hamsterlite_note_g, '11'],
                                            [Lang.Blocks.hamsterlite_note_g_sharp, '12'],
                                            [Lang.Blocks.hamsterlite_note_a, '13'],
                                            [Lang.Blocks.hamsterlite_note_a_sharp, '14'],
                                            [Lang.Blocks.hamsterlite_note_b, '15'],
                                        ],
                                        value: '4',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            ['1', '1'],
                                            ['2', '2'],
                                            ['3', '3'],
                                            ['4', '4'],
                                            ['5', '5'],
                                            ['6', '6'],
                                            ['7', '7'],
                                        ],
                                        value: '1',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter:
                                            Entry.block.converters.returnStringOrNumberByValue,
                                    },
                                ],
                                params: ['6'],
                            },
                            {
                                syntax: 'Hamsterlite.play_pitch_d_sharp(%2)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_note_c, '4'],
                                            [Lang.Blocks.hamsterlite_note_c_sharp, '5'],
                                            [Lang.Blocks.hamsterlite_note_d, '6'],
                                            [Lang.Blocks.hamsterlite_note_d_sharp, '7'],
                                            [Lang.Blocks.hamsterlite_note_e, '8'],
                                            [Lang.Blocks.hamsterlite_note_f, '9'],
                                            [Lang.Blocks.hamsterlite_note_f_sharp, '10'],
                                            [Lang.Blocks.hamsterlite_note_g, '11'],
                                            [Lang.Blocks.hamsterlite_note_g_sharp, '12'],
                                            [Lang.Blocks.hamsterlite_note_a, '13'],
                                            [Lang.Blocks.hamsterlite_note_a_sharp, '14'],
                                            [Lang.Blocks.hamsterlite_note_b, '15'],
                                        ],
                                        value: '4',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            ['1', '1'],
                                            ['2', '2'],
                                            ['3', '3'],
                                            ['4', '4'],
                                            ['5', '5'],
                                            ['6', '6'],
                                            ['7', '7'],
                                        ],
                                        value: '1',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter:
                                            Entry.block.converters.returnStringOrNumberByValue,
                                    },
                                ],
                                params: ['7'],
                            },
                            {
                                syntax: 'Hamsterlite.play_pitch_e(%2)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_note_c, '4'],
                                            [Lang.Blocks.hamsterlite_note_c_sharp, '5'],
                                            [Lang.Blocks.hamsterlite_note_d, '6'],
                                            [Lang.Blocks.hamsterlite_note_d_sharp, '7'],
                                            [Lang.Blocks.hamsterlite_note_e, '8'],
                                            [Lang.Blocks.hamsterlite_note_f, '9'],
                                            [Lang.Blocks.hamsterlite_note_f_sharp, '10'],
                                            [Lang.Blocks.hamsterlite_note_g, '11'],
                                            [Lang.Blocks.hamsterlite_note_g_sharp, '12'],
                                            [Lang.Blocks.hamsterlite_note_a, '13'],
                                            [Lang.Blocks.hamsterlite_note_a_sharp, '14'],
                                            [Lang.Blocks.hamsterlite_note_b, '15'],
                                        ],
                                        value: '4',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            ['1', '1'],
                                            ['2', '2'],
                                            ['3', '3'],
                                            ['4', '4'],
                                            ['5', '5'],
                                            ['6', '6'],
                                            ['7', '7'],
                                        ],
                                        value: '1',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter:
                                            Entry.block.converters.returnStringOrNumberByValue,
                                    },
                                ],
                                params: ['8'],
                            },
                            {
                                syntax: 'Hamsterlite.play_pitch_f(%2)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_note_c, '4'],
                                            [Lang.Blocks.hamsterlite_note_c_sharp, '5'],
                                            [Lang.Blocks.hamsterlite_note_d, '6'],
                                            [Lang.Blocks.hamsterlite_note_d_sharp, '7'],
                                            [Lang.Blocks.hamsterlite_note_e, '8'],
                                            [Lang.Blocks.hamsterlite_note_f, '9'],
                                            [Lang.Blocks.hamsterlite_note_f_sharp, '10'],
                                            [Lang.Blocks.hamsterlite_note_g, '11'],
                                            [Lang.Blocks.hamsterlite_note_g_sharp, '12'],
                                            [Lang.Blocks.hamsterlite_note_a, '13'],
                                            [Lang.Blocks.hamsterlite_note_a_sharp, '14'],
                                            [Lang.Blocks.hamsterlite_note_b, '15'],
                                        ],
                                        value: '4',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            ['1', '1'],
                                            ['2', '2'],
                                            ['3', '3'],
                                            ['4', '4'],
                                            ['5', '5'],
                                            ['6', '6'],
                                            ['7', '7'],
                                        ],
                                        value: '1',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter:
                                            Entry.block.converters.returnStringOrNumberByValue,
                                    },
                                ],
                                params: ['9'],
                            },
                            {
                                syntax: 'Hamsterlite.play_pitch_f_sharp(%2)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_note_c, '4'],
                                            [Lang.Blocks.hamsterlite_note_c_sharp, '5'],
                                            [Lang.Blocks.hamsterlite_note_d, '6'],
                                            [Lang.Blocks.hamsterlite_note_d_sharp, '7'],
                                            [Lang.Blocks.hamsterlite_note_e, '8'],
                                            [Lang.Blocks.hamsterlite_note_f, '9'],
                                            [Lang.Blocks.hamsterlite_note_f_sharp, '10'],
                                            [Lang.Blocks.hamsterlite_note_g, '11'],
                                            [Lang.Blocks.hamsterlite_note_g_sharp, '12'],
                                            [Lang.Blocks.hamsterlite_note_a, '13'],
                                            [Lang.Blocks.hamsterlite_note_a_sharp, '14'],
                                            [Lang.Blocks.hamsterlite_note_b, '15'],
                                        ],
                                        value: '4',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            ['1', '1'],
                                            ['2', '2'],
                                            ['3', '3'],
                                            ['4', '4'],
                                            ['5', '5'],
                                            ['6', '6'],
                                            ['7', '7'],
                                        ],
                                        value: '1',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter:
                                            Entry.block.converters.returnStringOrNumberByValue,
                                    },
                                ],
                                params: ['10'],
                            },
                            {
                                syntax: 'Hamsterlite.play_pitch_g(%2)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_note_c, '4'],
                                            [Lang.Blocks.hamsterlite_note_c_sharp, '5'],
                                            [Lang.Blocks.hamsterlite_note_d, '6'],
                                            [Lang.Blocks.hamsterlite_note_d_sharp, '7'],
                                            [Lang.Blocks.hamsterlite_note_e, '8'],
                                            [Lang.Blocks.hamsterlite_note_f, '9'],
                                            [Lang.Blocks.hamsterlite_note_f_sharp, '10'],
                                            [Lang.Blocks.hamsterlite_note_g, '11'],
                                            [Lang.Blocks.hamsterlite_note_g_sharp, '12'],
                                            [Lang.Blocks.hamsterlite_note_a, '13'],
                                            [Lang.Blocks.hamsterlite_note_a_sharp, '14'],
                                            [Lang.Blocks.hamsterlite_note_b, '15'],
                                        ],
                                        value: '4',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            ['1', '1'],
                                            ['2', '2'],
                                            ['3', '3'],
                                            ['4', '4'],
                                            ['5', '5'],
                                            ['6', '6'],
                                            ['7', '7'],
                                        ],
                                        value: '1',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter:
                                            Entry.block.converters.returnStringOrNumberByValue,
                                    },
                                ],
                                params: ['11'],
                            },
                            {
                                syntax: 'Hamsterlite.play_pitch_g_sharp(%2)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_note_c, '4'],
                                            [Lang.Blocks.hamsterlite_note_c_sharp, '5'],
                                            [Lang.Blocks.hamsterlite_note_d, '6'],
                                            [Lang.Blocks.hamsterlite_note_d_sharp, '7'],
                                            [Lang.Blocks.hamsterlite_note_e, '8'],
                                            [Lang.Blocks.hamsterlite_note_f, '9'],
                                            [Lang.Blocks.hamsterlite_note_f_sharp, '10'],
                                            [Lang.Blocks.hamsterlite_note_g, '11'],
                                            [Lang.Blocks.hamsterlite_note_g_sharp, '12'],
                                            [Lang.Blocks.hamsterlite_note_a, '13'],
                                            [Lang.Blocks.hamsterlite_note_a_sharp, '14'],
                                            [Lang.Blocks.hamsterlite_note_b, '15'],
                                        ],
                                        value: '4',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            ['1', '1'],
                                            ['2', '2'],
                                            ['3', '3'],
                                            ['4', '4'],
                                            ['5', '5'],
                                            ['6', '6'],
                                            ['7', '7'],
                                        ],
                                        value: '1',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter:
                                            Entry.block.converters.returnStringOrNumberByValue,
                                    },
                                ],
                                params: ['12'],
                            },
                            {
                                syntax: 'Hamsterlite.play_pitch_a(%2)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_note_c, '4'],
                                            [Lang.Blocks.hamsterlite_note_c_sharp, '5'],
                                            [Lang.Blocks.hamsterlite_note_d, '6'],
                                            [Lang.Blocks.hamsterlite_note_d_sharp, '7'],
                                            [Lang.Blocks.hamsterlite_note_e, '8'],
                                            [Lang.Blocks.hamsterlite_note_f, '9'],
                                            [Lang.Blocks.hamsterlite_note_f_sharp, '10'],
                                            [Lang.Blocks.hamsterlite_note_g, '11'],
                                            [Lang.Blocks.hamsterlite_note_g_sharp, '12'],
                                            [Lang.Blocks.hamsterlite_note_a, '13'],
                                            [Lang.Blocks.hamsterlite_note_a_sharp, '14'],
                                            [Lang.Blocks.hamsterlite_note_b, '15'],
                                        ],
                                        value: '4',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            ['1', '1'],
                                            ['2', '2'],
                                            ['3', '3'],
                                            ['4', '4'],
                                            ['5', '5'],
                                            ['6', '6'],
                                            ['7', '7'],
                                        ],
                                        value: '1',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter:
                                            Entry.block.converters.returnStringOrNumberByValue,
                                    },
                                ],
                                params: ['13'],
                            },
                            {
                                syntax: 'Hamsterlite.play_pitch_a_sharp(%2)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_note_c, '4'],
                                            [Lang.Blocks.hamsterlite_note_c_sharp, '5'],
                                            [Lang.Blocks.hamsterlite_note_d, '6'],
                                            [Lang.Blocks.hamsterlite_note_d_sharp, '7'],
                                            [Lang.Blocks.hamsterlite_note_e, '8'],
                                            [Lang.Blocks.hamsterlite_note_f, '9'],
                                            [Lang.Blocks.hamsterlite_note_f_sharp, '10'],
                                            [Lang.Blocks.hamsterlite_note_g, '11'],
                                            [Lang.Blocks.hamsterlite_note_g_sharp, '12'],
                                            [Lang.Blocks.hamsterlite_note_a, '13'],
                                            [Lang.Blocks.hamsterlite_note_a_sharp, '14'],
                                            [Lang.Blocks.hamsterlite_note_b, '15'],
                                        ],
                                        value: '4',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            ['1', '1'],
                                            ['2', '2'],
                                            ['3', '3'],
                                            ['4', '4'],
                                            ['5', '5'],
                                            ['6', '6'],
                                            ['7', '7'],
                                        ],
                                        value: '1',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter:
                                            Entry.block.converters.returnStringOrNumberByValue,
                                    },
                                ],
                                params: ['14'],
                            },
                            {
                                syntax: 'Hamsterlite.play_pitch_b(%2)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_note_c, '4'],
                                            [Lang.Blocks.hamsterlite_note_c_sharp, '5'],
                                            [Lang.Blocks.hamsterlite_note_d, '6'],
                                            [Lang.Blocks.hamsterlite_note_d_sharp, '7'],
                                            [Lang.Blocks.hamsterlite_note_e, '8'],
                                            [Lang.Blocks.hamsterlite_note_f, '9'],
                                            [Lang.Blocks.hamsterlite_note_f_sharp, '10'],
                                            [Lang.Blocks.hamsterlite_note_g, '11'],
                                            [Lang.Blocks.hamsterlite_note_g_sharp, '12'],
                                            [Lang.Blocks.hamsterlite_note_a, '13'],
                                            [Lang.Blocks.hamsterlite_note_a_sharp, '14'],
                                            [Lang.Blocks.hamsterlite_note_b, '15'],
                                        ],
                                        value: '4',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            ['1', '1'],
                                            ['2', '2'],
                                            ['3', '3'],
                                            ['4', '4'],
                                            ['5', '5'],
                                            ['6', '6'],
                                            ['7', '7'],
                                        ],
                                        value: '1',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter:
                                            Entry.block.converters.returnStringOrNumberByValue,
                                    },
                                ],
                                params: ['15'],
                            },
                        ],
                    },
                },
                hamsterlite_play_note_for: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterlite_note_c, '4'],
                                [Lang.Blocks.hamsterlite_note_c_sharp, '5'],
                                [Lang.Blocks.hamsterlite_note_d, '6'],
                                [Lang.Blocks.hamsterlite_note_d_sharp, '7'],
                                [Lang.Blocks.hamsterlite_note_e, '8'],
                                [Lang.Blocks.hamsterlite_note_f, '9'],
                                [Lang.Blocks.hamsterlite_note_f_sharp, '10'],
                                [Lang.Blocks.hamsterlite_note_g, '11'],
                                [Lang.Blocks.hamsterlite_note_g_sharp, '12'],
                                [Lang.Blocks.hamsterlite_note_a, '13'],
                                [Lang.Blocks.hamsterlite_note_a_sharp, '14'],
                                [Lang.Blocks.hamsterlite_note_b, '15'],
                            ],
                            value: '4',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                ['1', '1'],
                                ['2', '2'],
                                ['3', '3'],
                                ['4', '4'],
                                ['5', '5'],
                                ['6', '6'],
                                ['7', '7'],
                            ],
                            value: '1',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            null,
                            '4',
                            {
                                type: 'text',
                                params: ['0.5'],
                            },
                            null,
                        ],
                        type: 'hamsterlite_play_note_for',
                    },
                    paramsKeyMap: {
                        NOTE: 0,
                        OCTAVE: 1,
                        BEAT: 2,
                    },
                    class: 'hamsterlite_buzzer',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return Entry.HamsterLite.playNoteBeat(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.play_note_c(%2, %3)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_note_c, '4'],
                                            [Lang.Blocks.hamsterlite_note_c_sharp, '5'],
                                            [Lang.Blocks.hamsterlite_note_d, '6'],
                                            [Lang.Blocks.hamsterlite_note_d_sharp, '7'],
                                            [Lang.Blocks.hamsterlite_note_e, '8'],
                                            [Lang.Blocks.hamsterlite_note_f, '9'],
                                            [Lang.Blocks.hamsterlite_note_f_sharp, '10'],
                                            [Lang.Blocks.hamsterlite_note_g, '11'],
                                            [Lang.Blocks.hamsterlite_note_g_sharp, '12'],
                                            [Lang.Blocks.hamsterlite_note_a, '13'],
                                            [Lang.Blocks.hamsterlite_note_a_sharp, '14'],
                                            [Lang.Blocks.hamsterlite_note_b, '15'],
                                        ],
                                        value: '4',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            ['1', '1'],
                                            ['2', '2'],
                                            ['3', '3'],
                                            ['4', '4'],
                                            ['5', '5'],
                                            ['6', '6'],
                                            ['7', '7'],
                                        ],
                                        value: '1',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter:
                                            Entry.block.converters.returnStringOrNumberByValue,
                                    },
                                    { type: 'Block', accept: 'string' },
                                ],
                                params: ['4'],
                            },
                            {
                                syntax: 'Hamsterlite.play_note_c_sharp(%2, %3)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_note_c, '4'],
                                            [Lang.Blocks.hamsterlite_note_c_sharp, '5'],
                                            [Lang.Blocks.hamsterlite_note_d, '6'],
                                            [Lang.Blocks.hamsterlite_note_d_sharp, '7'],
                                            [Lang.Blocks.hamsterlite_note_e, '8'],
                                            [Lang.Blocks.hamsterlite_note_f, '9'],
                                            [Lang.Blocks.hamsterlite_note_f_sharp, '10'],
                                            [Lang.Blocks.hamsterlite_note_g, '11'],
                                            [Lang.Blocks.hamsterlite_note_g_sharp, '12'],
                                            [Lang.Blocks.hamsterlite_note_a, '13'],
                                            [Lang.Blocks.hamsterlite_note_a_sharp, '14'],
                                            [Lang.Blocks.hamsterlite_note_b, '15'],
                                        ],
                                        value: '4',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            ['1', '1'],
                                            ['2', '2'],
                                            ['3', '3'],
                                            ['4', '4'],
                                            ['5', '5'],
                                            ['6', '6'],
                                            ['7', '7'],
                                        ],
                                        value: '1',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter:
                                            Entry.block.converters.returnStringOrNumberByValue,
                                    },
                                    { type: 'Block', accept: 'string' },
                                ],
                                params: ['5'],
                            },
                            {
                                syntax: 'Hamsterlite.play_note_d(%2, %3)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_note_c, '4'],
                                            [Lang.Blocks.hamsterlite_note_c_sharp, '5'],
                                            [Lang.Blocks.hamsterlite_note_d, '6'],
                                            [Lang.Blocks.hamsterlite_note_d_sharp, '7'],
                                            [Lang.Blocks.hamsterlite_note_e, '8'],
                                            [Lang.Blocks.hamsterlite_note_f, '9'],
                                            [Lang.Blocks.hamsterlite_note_f_sharp, '10'],
                                            [Lang.Blocks.hamsterlite_note_g, '11'],
                                            [Lang.Blocks.hamsterlite_note_g_sharp, '12'],
                                            [Lang.Blocks.hamsterlite_note_a, '13'],
                                            [Lang.Blocks.hamsterlite_note_a_sharp, '14'],
                                            [Lang.Blocks.hamsterlite_note_b, '15'],
                                        ],
                                        value: '4',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            ['1', '1'],
                                            ['2', '2'],
                                            ['3', '3'],
                                            ['4', '4'],
                                            ['5', '5'],
                                            ['6', '6'],
                                            ['7', '7'],
                                        ],
                                        value: '1',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter:
                                            Entry.block.converters.returnStringOrNumberByValue,
                                    },
                                    { type: 'Block', accept: 'string' },
                                ],
                                params: ['6'],
                            },
                            {
                                syntax: 'Hamsterlite.play_note_d_sharp(%2, %3)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_note_c, '4'],
                                            [Lang.Blocks.hamsterlite_note_c_sharp, '5'],
                                            [Lang.Blocks.hamsterlite_note_d, '6'],
                                            [Lang.Blocks.hamsterlite_note_d_sharp, '7'],
                                            [Lang.Blocks.hamsterlite_note_e, '8'],
                                            [Lang.Blocks.hamsterlite_note_f, '9'],
                                            [Lang.Blocks.hamsterlite_note_f_sharp, '10'],
                                            [Lang.Blocks.hamsterlite_note_g, '11'],
                                            [Lang.Blocks.hamsterlite_note_g_sharp, '12'],
                                            [Lang.Blocks.hamsterlite_note_a, '13'],
                                            [Lang.Blocks.hamsterlite_note_a_sharp, '14'],
                                            [Lang.Blocks.hamsterlite_note_b, '15'],
                                        ],
                                        value: '4',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            ['1', '1'],
                                            ['2', '2'],
                                            ['3', '3'],
                                            ['4', '4'],
                                            ['5', '5'],
                                            ['6', '6'],
                                            ['7', '7'],
                                        ],
                                        value: '1',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter:
                                            Entry.block.converters.returnStringOrNumberByValue,
                                    },
                                    { type: 'Block', accept: 'string' },
                                ],
                                params: ['7'],
                            },
                            {
                                syntax: 'Hamsterlite.play_note_e(%2, %3)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_note_c, '4'],
                                            [Lang.Blocks.hamsterlite_note_c_sharp, '5'],
                                            [Lang.Blocks.hamsterlite_note_d, '6'],
                                            [Lang.Blocks.hamsterlite_note_d_sharp, '7'],
                                            [Lang.Blocks.hamsterlite_note_e, '8'],
                                            [Lang.Blocks.hamsterlite_note_f, '9'],
                                            [Lang.Blocks.hamsterlite_note_f_sharp, '10'],
                                            [Lang.Blocks.hamsterlite_note_g, '11'],
                                            [Lang.Blocks.hamsterlite_note_g_sharp, '12'],
                                            [Lang.Blocks.hamsterlite_note_a, '13'],
                                            [Lang.Blocks.hamsterlite_note_a_sharp, '14'],
                                            [Lang.Blocks.hamsterlite_note_b, '15'],
                                        ],
                                        value: '4',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            ['1', '1'],
                                            ['2', '2'],
                                            ['3', '3'],
                                            ['4', '4'],
                                            ['5', '5'],
                                            ['6', '6'],
                                            ['7', '7'],
                                        ],
                                        value: '1',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter:
                                            Entry.block.converters.returnStringOrNumberByValue,
                                    },
                                    { type: 'Block', accept: 'string' },
                                ],
                                params: ['8'],
                            },
                            {
                                syntax: 'Hamsterlite.play_note_f(%2, %3)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_note_c, '4'],
                                            [Lang.Blocks.hamsterlite_note_c_sharp, '5'],
                                            [Lang.Blocks.hamsterlite_note_d, '6'],
                                            [Lang.Blocks.hamsterlite_note_d_sharp, '7'],
                                            [Lang.Blocks.hamsterlite_note_e, '8'],
                                            [Lang.Blocks.hamsterlite_note_f, '9'],
                                            [Lang.Blocks.hamsterlite_note_f_sharp, '10'],
                                            [Lang.Blocks.hamsterlite_note_g, '11'],
                                            [Lang.Blocks.hamsterlite_note_g_sharp, '12'],
                                            [Lang.Blocks.hamsterlite_note_a, '13'],
                                            [Lang.Blocks.hamsterlite_note_a_sharp, '14'],
                                            [Lang.Blocks.hamsterlite_note_b, '15'],
                                        ],
                                        value: '4',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            ['1', '1'],
                                            ['2', '2'],
                                            ['3', '3'],
                                            ['4', '4'],
                                            ['5', '5'],
                                            ['6', '6'],
                                            ['7', '7'],
                                        ],
                                        value: '1',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter:
                                            Entry.block.converters.returnStringOrNumberByValue,
                                    },
                                    { type: 'Block', accept: 'string' },
                                ],
                                params: ['9'],
                            },
                            {
                                syntax: 'Hamsterlite.play_note_f_sharp(%2, %3)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_note_c, '4'],
                                            [Lang.Blocks.hamsterlite_note_c_sharp, '5'],
                                            [Lang.Blocks.hamsterlite_note_d, '6'],
                                            [Lang.Blocks.hamsterlite_note_d_sharp, '7'],
                                            [Lang.Blocks.hamsterlite_note_e, '8'],
                                            [Lang.Blocks.hamsterlite_note_f, '9'],
                                            [Lang.Blocks.hamsterlite_note_f_sharp, '10'],
                                            [Lang.Blocks.hamsterlite_note_g, '11'],
                                            [Lang.Blocks.hamsterlite_note_g_sharp, '12'],
                                            [Lang.Blocks.hamsterlite_note_a, '13'],
                                            [Lang.Blocks.hamsterlite_note_a_sharp, '14'],
                                            [Lang.Blocks.hamsterlite_note_b, '15'],
                                        ],
                                        value: '4',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            ['1', '1'],
                                            ['2', '2'],
                                            ['3', '3'],
                                            ['4', '4'],
                                            ['5', '5'],
                                            ['6', '6'],
                                            ['7', '7'],
                                        ],
                                        value: '1',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter:
                                            Entry.block.converters.returnStringOrNumberByValue,
                                    },
                                    { type: 'Block', accept: 'string' },
                                ],
                                params: ['10'],
                            },
                            {
                                syntax: 'Hamsterlite.play_note_g(%2, %3)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_note_c, '4'],
                                            [Lang.Blocks.hamsterlite_note_c_sharp, '5'],
                                            [Lang.Blocks.hamsterlite_note_d, '6'],
                                            [Lang.Blocks.hamsterlite_note_d_sharp, '7'],
                                            [Lang.Blocks.hamsterlite_note_e, '8'],
                                            [Lang.Blocks.hamsterlite_note_f, '9'],
                                            [Lang.Blocks.hamsterlite_note_f_sharp, '10'],
                                            [Lang.Blocks.hamsterlite_note_g, '11'],
                                            [Lang.Blocks.hamsterlite_note_g_sharp, '12'],
                                            [Lang.Blocks.hamsterlite_note_a, '13'],
                                            [Lang.Blocks.hamsterlite_note_a_sharp, '14'],
                                            [Lang.Blocks.hamsterlite_note_b, '15'],
                                        ],
                                        value: '4',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            ['1', '1'],
                                            ['2', '2'],
                                            ['3', '3'],
                                            ['4', '4'],
                                            ['5', '5'],
                                            ['6', '6'],
                                            ['7', '7'],
                                        ],
                                        value: '1',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter:
                                            Entry.block.converters.returnStringOrNumberByValue,
                                    },
                                    { type: 'Block', accept: 'string' },
                                ],
                                params: ['11'],
                            },
                            {
                                syntax: 'Hamsterlite.play_note_g_sharp(%2, %3)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_note_c, '4'],
                                            [Lang.Blocks.hamsterlite_note_c_sharp, '5'],
                                            [Lang.Blocks.hamsterlite_note_d, '6'],
                                            [Lang.Blocks.hamsterlite_note_d_sharp, '7'],
                                            [Lang.Blocks.hamsterlite_note_e, '8'],
                                            [Lang.Blocks.hamsterlite_note_f, '9'],
                                            [Lang.Blocks.hamsterlite_note_f_sharp, '10'],
                                            [Lang.Blocks.hamsterlite_note_g, '11'],
                                            [Lang.Blocks.hamsterlite_note_g_sharp, '12'],
                                            [Lang.Blocks.hamsterlite_note_a, '13'],
                                            [Lang.Blocks.hamsterlite_note_a_sharp, '14'],
                                            [Lang.Blocks.hamsterlite_note_b, '15'],
                                        ],
                                        value: '4',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            ['1', '1'],
                                            ['2', '2'],
                                            ['3', '3'],
                                            ['4', '4'],
                                            ['5', '5'],
                                            ['6', '6'],
                                            ['7', '7'],
                                        ],
                                        value: '1',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter:
                                            Entry.block.converters.returnStringOrNumberByValue,
                                    },
                                    { type: 'Block', accept: 'string' },
                                ],
                                params: ['12'],
                            },
                            {
                                syntax: 'Hamsterlite.play_note_a(%2, %3)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_note_c, '4'],
                                            [Lang.Blocks.hamsterlite_note_c_sharp, '5'],
                                            [Lang.Blocks.hamsterlite_note_d, '6'],
                                            [Lang.Blocks.hamsterlite_note_d_sharp, '7'],
                                            [Lang.Blocks.hamsterlite_note_e, '8'],
                                            [Lang.Blocks.hamsterlite_note_f, '9'],
                                            [Lang.Blocks.hamsterlite_note_f_sharp, '10'],
                                            [Lang.Blocks.hamsterlite_note_g, '11'],
                                            [Lang.Blocks.hamsterlite_note_g_sharp, '12'],
                                            [Lang.Blocks.hamsterlite_note_a, '13'],
                                            [Lang.Blocks.hamsterlite_note_a_sharp, '14'],
                                            [Lang.Blocks.hamsterlite_note_b, '15'],
                                        ],
                                        value: '4',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            ['1', '1'],
                                            ['2', '2'],
                                            ['3', '3'],
                                            ['4', '4'],
                                            ['5', '5'],
                                            ['6', '6'],
                                            ['7', '7'],
                                        ],
                                        value: '1',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter:
                                            Entry.block.converters.returnStringOrNumberByValue,
                                    },
                                    { type: 'Block', accept: 'string' },
                                ],
                                params: ['13'],
                            },
                            {
                                syntax: 'Hamsterlite.play_note_a_sharp(%2, %3)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_note_c, '4'],
                                            [Lang.Blocks.hamsterlite_note_c_sharp, '5'],
                                            [Lang.Blocks.hamsterlite_note_d, '6'],
                                            [Lang.Blocks.hamsterlite_note_d_sharp, '7'],
                                            [Lang.Blocks.hamsterlite_note_e, '8'],
                                            [Lang.Blocks.hamsterlite_note_f, '9'],
                                            [Lang.Blocks.hamsterlite_note_f_sharp, '10'],
                                            [Lang.Blocks.hamsterlite_note_g, '11'],
                                            [Lang.Blocks.hamsterlite_note_g_sharp, '12'],
                                            [Lang.Blocks.hamsterlite_note_a, '13'],
                                            [Lang.Blocks.hamsterlite_note_a_sharp, '14'],
                                            [Lang.Blocks.hamsterlite_note_b, '15'],
                                        ],
                                        value: '4',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            ['1', '1'],
                                            ['2', '2'],
                                            ['3', '3'],
                                            ['4', '4'],
                                            ['5', '5'],
                                            ['6', '6'],
                                            ['7', '7'],
                                        ],
                                        value: '1',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter:
                                            Entry.block.converters.returnStringOrNumberByValue,
                                    },
                                    { type: 'Block', accept: 'string' },
                                ],
                                params: ['14'],
                            },
                            {
                                syntax: 'Hamsterlite.play_note_b(%2, %3)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_note_c, '4'],
                                            [Lang.Blocks.hamsterlite_note_c_sharp, '5'],
                                            [Lang.Blocks.hamsterlite_note_d, '6'],
                                            [Lang.Blocks.hamsterlite_note_d_sharp, '7'],
                                            [Lang.Blocks.hamsterlite_note_e, '8'],
                                            [Lang.Blocks.hamsterlite_note_f, '9'],
                                            [Lang.Blocks.hamsterlite_note_f_sharp, '10'],
                                            [Lang.Blocks.hamsterlite_note_g, '11'],
                                            [Lang.Blocks.hamsterlite_note_g_sharp, '12'],
                                            [Lang.Blocks.hamsterlite_note_a, '13'],
                                            [Lang.Blocks.hamsterlite_note_a_sharp, '14'],
                                            [Lang.Blocks.hamsterlite_note_b, '15'],
                                        ],
                                        value: '4',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            ['1', '1'],
                                            ['2', '2'],
                                            ['3', '3'],
                                            ['4', '4'],
                                            ['5', '5'],
                                            ['6', '6'],
                                            ['7', '7'],
                                        ],
                                        value: '1',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter:
                                            Entry.block.converters.returnStringOrNumberByValue,
                                    },
                                    { type: 'Block', accept: 'string' },
                                ],
                                params: ['15'],
                            },
                        ],
                    },
                },
                hamsterlite_rest_for: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'text',
                                params: ['0.25'],
                            },
                            null,
                        ],
                        type: 'hamsterlite_rest_for',
                    },
                    paramsKeyMap: {
                        BEAT: 0,
                    },
                    class: 'hamsterlite_buzzer',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return Entry.HamsterLite.restBeat(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.rest(%1)',
                                textParams: [
                                    {
                                        type: 'Block',
                                        accept: 'string',
                                    },
                                ],
                            },
                        ],
                    },
                },
                hamsterlite_change_tempo_by: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'text',
                                params: ['20'],
                            },
                            null,
                        ],
                        type: 'hamsterlite_change_tempo_by',
                    },
                    paramsKeyMap: {
                        BPM: 0,
                    },
                    class: 'hamsterlite_buzzer',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return Entry.HamsterLite.changeTempo(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.add_tempo(%1)',
                                textParams: [
                                    {
                                        type: 'Block',
                                        accept: 'string',
                                    },
                                ],
                            },
                        ],
                    },
                },
                hamsterlite_set_tempo_to: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            {
                                type: 'text',
                                params: ['60'],
                            },
                            null,
                        ],
                        type: 'hamsterlite_set_tempo_to',
                    },
                    paramsKeyMap: {
                        BPM: 0,
                    },
                    class: 'hamsterlite_buzzer',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return Entry.HamsterLite.setTempo(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.set_tempo(%1)',
                                textParams: [
                                    {
                                        type: 'Block',
                                        accept: 'string',
                                    },
                                ],
                            },
                        ],
                    },
                },
                hamsterlite_set_port_to: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterlite_port_a, 'A'],
                                [Lang.Blocks.hamsterlite_port_b, 'B'],
                                [Lang.Blocks.hamsterlite_port_ab, 'AB'],
                            ],
                            value: 'A',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterlite_analog_input, '0'],
                                [Lang.Blocks.hamsterlite_digital_input, '1'],
                                [Lang.Blocks.hamsterlite_servo_output, '8'],
                                [Lang.Blocks.hamsterlite_pwm_output, '9'],
                                [Lang.Blocks.hamsterlite_digital_output, '10'],
                            ],
                            value: '0',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null, null, null],
                        type: 'hamsterlite_set_port_to',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                        MODE: 1,
                    },
                    class: 'hamsterlite_port',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return Entry.HamsterLite.setIoMode(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.set_io_mode_analog_input(%1)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_port_a, 'A'],
                                            [Lang.Blocks.hamsterlite_port_b, 'B'],
                                            [Lang.Blocks.hamsterlite_port_ab, 'AB'],
                                        ],
                                        value: 'A',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_analog_input, '0'],
                                            [Lang.Blocks.hamsterlite_digital_input, '1'],
                                            [Lang.Blocks.hamsterlite_servo_output, '8'],
                                            [Lang.Blocks.hamsterlite_pwm_output, '9'],
                                            [Lang.Blocks.hamsterlite_digital_output, '10'],
                                        ],
                                        value: '0',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                params: [null, '0'],
                            },
                            {
                                syntax: 'Hamsterlite.set_io_mode_digital_input(%1)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_port_a, 'A'],
                                            [Lang.Blocks.hamsterlite_port_b, 'B'],
                                            [Lang.Blocks.hamsterlite_port_ab, 'AB'],
                                        ],
                                        value: 'A',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_analog_input, '0'],
                                            [Lang.Blocks.hamsterlite_digital_input, '1'],
                                            [Lang.Blocks.hamsterlite_servo_output, '8'],
                                            [Lang.Blocks.hamsterlite_pwm_output, '9'],
                                            [Lang.Blocks.hamsterlite_digital_output, '10'],
                                        ],
                                        value: '0',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                params: [null, '1'],
                            },
                            {
                                syntax: 'Hamsterlite.set_io_mode_servo_output(%1)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_port_a, 'A'],
                                            [Lang.Blocks.hamsterlite_port_b, 'B'],
                                            [Lang.Blocks.hamsterlite_port_ab, 'AB'],
                                        ],
                                        value: 'A',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_analog_input, '0'],
                                            [Lang.Blocks.hamsterlite_digital_input, '1'],
                                            [Lang.Blocks.hamsterlite_servo_output, '8'],
                                            [Lang.Blocks.hamsterlite_pwm_output, '9'],
                                            [Lang.Blocks.hamsterlite_digital_output, '10'],
                                        ],
                                        value: '0',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                params: [null, '8'],
                            },
                            {
                                syntax: 'Hamsterlite.set_io_mode_pwm_output(%1)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_port_a, 'A'],
                                            [Lang.Blocks.hamsterlite_port_b, 'B'],
                                            [Lang.Blocks.hamsterlite_port_ab, 'AB'],
                                        ],
                                        value: 'A',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_analog_input, '0'],
                                            [Lang.Blocks.hamsterlite_digital_input, '1'],
                                            [Lang.Blocks.hamsterlite_servo_output, '8'],
                                            [Lang.Blocks.hamsterlite_pwm_output, '9'],
                                            [Lang.Blocks.hamsterlite_digital_output, '10'],
                                        ],
                                        value: '0',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                params: [null, '9'],
                            },
                            {
                                syntax: 'Hamsterlite.set_io_mode_digital_output(%1)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_port_a, 'A'],
                                            [Lang.Blocks.hamsterlite_port_b, 'B'],
                                            [Lang.Blocks.hamsterlite_port_ab, 'AB'],
                                        ],
                                        value: 'A',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_analog_input, '0'],
                                            [Lang.Blocks.hamsterlite_digital_input, '1'],
                                            [Lang.Blocks.hamsterlite_servo_output, '8'],
                                            [Lang.Blocks.hamsterlite_pwm_output, '9'],
                                            [Lang.Blocks.hamsterlite_digital_output, '10'],
                                        ],
                                        value: '0',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                                params: [null, '10'],
                            },
                        ],
                    },
                },
                hamsterlite_change_output_by: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterlite_port_a, 'A'],
                                [Lang.Blocks.hamsterlite_port_b, 'B'],
                                [Lang.Blocks.hamsterlite_port_ab, 'AB'],
                            ],
                            value: 'A',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            null,
                            {
                                type: 'text',
                                params: ['10'],
                            },
                            null,
                        ],
                        type: 'hamsterlite_change_output_by',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                        VALUE: 1,
                    },
                    class: 'hamsterlite_port',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return Entry.HamsterLite.changeOutput(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.add_output(%1, %2)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_port_a, 'A'],
                                            [Lang.Blocks.hamsterlite_port_b, 'B'],
                                            [Lang.Blocks.hamsterlite_port_ab, 'AB'],
                                        ],
                                        value: 'A',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                    {
                                        type: 'Block',
                                        accept: 'string',
                                    },
                                ],
                            },
                        ],
                    },
                },
                hamsterlite_set_output_to: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterlite_port_a, 'A'],
                                [Lang.Blocks.hamsterlite_port_b, 'B'],
                                [Lang.Blocks.hamsterlite_port_ab, 'AB'],
                            ],
                            value: 'A',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Block',
                            accept: 'string',
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [
                            null,
                            {
                                type: 'text',
                                params: ['100'],
                            },
                            null,
                        ],
                        type: 'hamsterlite_set_output_to',
                    },
                    paramsKeyMap: {
                        PORT: 0,
                        VALUE: 1,
                    },
                    class: 'hamsterlite_port',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return Entry.HamsterLite.setOutput(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.set_output(%1, %2)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_port_a, 'A'],
                                            [Lang.Blocks.hamsterlite_port_b, 'B'],
                                            [Lang.Blocks.hamsterlite_port_ab, 'AB'],
                                        ],
                                        value: 'A',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                    {
                                        type: 'Block',
                                        accept: 'string',
                                    },
                                ],
                            },
                        ],
                    },
                },
                hamsterlite_gripper: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Dropdown',
                            options: [
                                [Lang.Blocks.hamsterlite_open_gripper, 'OPEN'],
                                [Lang.Blocks.hamsterlite_close_gripper, 'CLOSE'],
                            ],
                            value: 'OPEN',
                            fontSize: 11,
                            bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                            arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                        },
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null, null],
                        type: 'hamsterlite_gripper',
                    },
                    paramsKeyMap: {
                        ACTION: 0,
                    },
                    class: 'hamsterlite_port',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return Entry.HamsterLite.gripper(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.set_gripper(%1)',
                                textParams: [
                                    {
                                        type: 'Dropdown',
                                        options: [
                                            [Lang.Blocks.hamsterlite_open_gripper, 'OPEN'],
                                            [Lang.Blocks.hamsterlite_close_gripper, 'CLOSE'],
                                        ],
                                        value: 'OPEN',
                                        fontSize: 11,
                                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                                        converter: Entry.block.converters.returnStringValue,
                                    },
                                ],
                            },
                        ],
                    },
                },
                hamsterlite_release_gripper: {
                    color: EntryStatic.colorSet.block.default.HARDWARE,
                    outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
                    skeleton: 'basic',
                    statements: [],
                    params: [
                        {
                            type: 'Indicator',
                            img: 'block_icon/hardwarelite_icon.svg',
                            size: 12,
                        },
                    ],
                    events: {},
                    def: {
                        params: [null],
                        type: 'hamsterlite_release_gripper',
                    },
                    class: 'hamsterlite_port',
                    isNotFor: ['HamsterLite'],
                    func(sprite, script) {
                        return Entry.HamsterLite.releaseGripper(script);
                    },
                    syntax: {
                        js: [],
                        py: [
                            {
                                syntax: 'Hamsterlite.release_gripper()',
                            },
                        ],
                    },
                },
            };
        }

        toHex(number) {
            var value = parseInt(number);
            if (value < 0) value += 0x100;

            value = value.toString(16).toUpperCase();
            if (value.length > 1) return value;
            else return '0' + value;
        }

        toHex2(number) {
            var value = parseInt(number);
            if (value < 0) value += 0x10000;

            value = value.toString(16).toUpperCase();
            var result = '';
            for (var i = value.length; i < 4; ++i) {
                result += '0';
            }
            return result + value;
        }
        toHex3(number) {
            var value = parseInt(number);
            if (value < 0) value += 0x1000000;

            value = value.toString(16).toUpperCase();
            var result = '';
            for (var i = value.length; i < 6; ++i) {
                result += '0';
            }
            return result + value;
        }
        colorToRgb(color) {
            if (color > 7) color = 7;
            else if (color < 0) color = 0;
            return COLOR_TO_RGB[color];
        }
        speedToGain(speed) {
            if (speed > 10) speed = 10;
            else if (speed < 1) speed = 1;
            switch (speed) {
                case 1:
                case 2:
                    return 6;
                case 3:
                case 4:
                    return 5;
                case 5:
                case 6:
                    return 4;
                case 7:
                case 8:
                    return 3;
                case 9:
                case 10:
                    return 2;
            }
            return 2;
        }

        requestLocalData() {
            var motoring = this.motoring;
            var lineTracer = this.lineTracer;
            if (this.isHamsterS) {
                var str = '10';
                if (motoring.leftWheel < 0) str += this.toHex(motoring.leftWheel * 1.14 - 0.5);
                else str += this.toHex(motoring.leftWheel * 1.14 + 0.5);
                if (motoring.rightWheel < 0) str += this.toHex(motoring.rightWheel * 1.14 - 0.5);
                else str += this.toHex(motoring.rightWheel * 1.14 + 0.5);
                var tmp = this.colorToRgb(motoring.leftLed);
                str += this.toHex(tmp[0]);
                str += this.toHex(tmp[1]);
                str += this.toHex(tmp[2]);
                tmp = this.colorToRgb(motoring.rightLed);
                str += this.toHex(tmp[0]);
                str += this.toHex(tmp[1]);
                str += this.toHex(tmp[2]);
                str += '000000';
                tmp = motoring.lineTracerMode & 0x0f;
                if (tmp > 7) tmp++;
                if (lineTracer.written) {
                    lineTracer.written = false;
                    lineTracer.count = 0;
                    if (tmp > 0) {
                        lineTracer.flag = (lineTracer.flag % 15) + 1;
                        lineTracer.event = 1;
                    } else {
                        lineTracer.event = 0;
                    }
                }
                tmp |= (lineTracer.flag & 0x0f) << 4;
                str += this.toHex(tmp);
                tmp = (motoring.lineTracerSpeed & 0x0f) << 4;
                tmp |= this.speedToGain(motoring.lineTracerSpeed) & 0x0f;
                str += this.toHex(tmp);
                tmp = (motoring.configProximity & 0x07) << 5;
                tmp |= (motoring.configBandWidth & 0x07) << 2;
                tmp |= motoring.configGravity & 0x03;
                str += this.toHex(tmp);
                tmp = (motoring.ioModeA & 0x0f) << 4;
                tmp |= motoring.ioModeB & 0x0f;
                str += this.toHex(tmp);
                str += this.toHex(motoring.outputA);
                str += this.toHex(motoring.outputB);
                if (motoring.note > 0) {
                    str += '01';
                    str += this.toHex(motoring.note);
                } else {
                    str += this.toHex2(motoring.buzzer * 10 + 512);
                }
                str += '-';
                str += this.address;
                str += '\r';
                return str;
            } else {
                var str = this.toHex(motoring.topology & 0x0f);
                str += '0010';
                str += this.toHex(motoring.leftWheel);
                str += this.toHex(motoring.rightWheel);
                str += this.toHex(motoring.leftLed);
                str += this.toHex(motoring.rightLed);
                str += this.toHex3(motoring.buzzer * 100);
                str += this.toHex(motoring.note);
                if (lineTracer.written) {
                    lineTracer.written = false;
                    if (motoring.lineTracerMode > 0) {
                        lineTracer.flag ^= 0x80;
                        lineTracer.event = 1;
                    }
                }
                var tmp = (motoring.lineTracerMode & 0x0f) << 3;
                tmp |= (motoring.lineTracerSpeed - 1) & 0x07;
                tmp |= lineTracer.flag & 0x80;
                str += this.toHex(tmp);
                str += this.toHex(motoring.configProximity);
                tmp = (motoring.configGravity & 0x0f) << 4;
                tmp |= motoring.configBandWidth & 0x0f;
                str += this.toHex(tmp);
                tmp = (motoring.ioModeA & 0x0f) << 4;
                tmp |= motoring.ioModeB & 0x0f;
                str += this.toHex(tmp);
                str += this.toHex(motoring.outputA);
                str += this.toHex(motoring.outputB);
                str += '000000-';
                str += this.address;
                str += '\r';
                return str;
            }
        }

        handleLocalData(data) {
            // data: string
            if (data?.length != 53) {
                return;
            }

            if (this.isHamsterS) {
                var str = data.slice(0, 1);
                var value = parseInt(str, 16);
                if (value != 1) return; // invalid data

                var sensory = this.sensory;
                // left proximity
                str = data.slice(6, 8);
                value = parseInt(str, 16);
                sensory.leftProximity = value;
                // right proximity
                str = data.slice(8, 10);
                value = parseInt(str, 16);
                sensory.rightProximity = value;
                str = data.slice(38, 40);
                var value2 = parseInt(str, 16);
                if ((value2 & 0x01) == 0) {
                    // flag
                    // light
                    str = data.slice(10, 14);
                    value = parseInt(str, 16);
                    sensory.light = value;
                } else {
                    // temperature
                    str = data.slice(10, 12);
                    value = parseInt(str, 16);
                    if (value > 0x7f) value -= 0x100;
                    value = value / 2.0 + 23;
                    value = value.toFixed(1);
                    sensory.temperature = value;
                }
                // left floor
                str = data.slice(14, 16);
                value = parseInt(str, 16);
                sensory.leftFloor = value;
                // right floor
                str = data.slice(16, 18);
                value = parseInt(str, 16);
                sensory.rightFloor = value;
                // acceleration x
                str = data.slice(18, 22);
                value = parseInt(str, 16);
                if (value > 0x7fff) value -= 0x10000;
                sensory.accelerationX = value;
                // acceleration y
                str = data.slice(22, 26);
                value = parseInt(str, 16);
                if (value > 0x7fff) value -= 0x10000;
                sensory.accelerationY = value;
                // acceleration z
                str = data.slice(26, 30);
                value = parseInt(str, 16);
                if (value > 0x7fff) value -= 0x10000;
                sensory.accelerationZ = value;
                // input a
                str = data.slice(30, 32);
                value = parseInt(str, 16);
                sensory.inputA = value;
                // input b
                str = data.slice(32, 34);
                value = parseInt(str, 16);
                sensory.inputB = value;
                // signal strength
                str = data.slice(36, 38);
                value = parseInt(str, 16);
                value -= 0x100;
                sensory.signalStrength = value;
                value = (value2 >> 6) & 0x03;
                if ((value & 0x02) != 0) {
                    var lineTracer = this.lineTracer;
                    if (lineTracer.event == 1) {
                        if (value == 0x02) {
                            if (++lineTracer.count > 5) lineTracer.event = 2;
                        } else {
                            lineTracer.event = 2;
                        }
                    }
                    if (lineTracer.event == 2) {
                        if (value != lineTracer.state || lineTracer.count > 5) {
                            lineTracer.state = value;
                            sensory.lineTracerState = value << 5;
                            sensory.lineTracerStateId = (sensory.lineTracerStateId % 255) + 1;
                            if (value == 0x02) {
                                lineTracer.event = 0;
                                lineTracer.count = 0;
                            }
                        }
                    }
                }
                // battery state
                value = (value2 >> 1) & 0x03;
                if (value == 0) value = 2;
                else if (value >= 2) value = 0;
                var batt = this.battery;
                if (value != batt.state) {
                    batt.state = value;
                    sensory.batteryState = value;
                }
            } else {
                var str = data.slice(4, 5);
                var value = parseInt(str, 16);
                if (value != 1) return; // invalid data

                var sensory = this.sensory;
                // signal strength
                str = data.slice(6, 8);
                value = parseInt(str, 16);
                value -= 0x100;
                sensory.signalStrength = value;
                // left proximity
                str = data.slice(8, 10);
                value = parseInt(str, 16);
                sensory.leftProximity = value;
                // right proximity
                str = data.slice(10, 12);
                value = parseInt(str, 16);
                sensory.rightProximity = value;
                // left floor
                str = data.slice(12, 14);
                value = parseInt(str, 16);
                sensory.leftFloor = value;
                // right floor
                str = data.slice(14, 16);
                value = parseInt(str, 16);
                sensory.rightFloor = value;
                // acceleration x
                str = data.slice(16, 20);
                value = parseInt(str, 16);
                if (value > 0x7fff) value -= 0x10000;
                sensory.accelerationX = value;
                // acceleration y
                str = data.slice(20, 24);
                value = parseInt(str, 16);
                if (value > 0x7fff) value -= 0x10000;
                sensory.accelerationY = value;
                // acceleration z
                str = data.slice(24, 28);
                value = parseInt(str, 16);
                if (value > 0x7fff) value -= 0x10000;
                sensory.accelerationZ = value;
                // flag
                str = data.slice(28, 30);
                var flag = parseInt(str, 16);
                if (flag == 0) {
                    // light
                    str = data.slice(30, 34);
                    value = parseInt(str, 16);
                    sensory.light = value;
                } else {
                    // temperature
                    str = data.slice(30, 32);
                    value = parseInt(str, 16);
                    if (value > 0x7f) value -= 0x100;
                    value = value / 2.0 + 24;
                    value = value.toFixed(1);
                    sensory.temperature = value;
                    // battery
                    str = data.slice(32, 34);
                    value = parseInt(str, 16);
                    value = value / 100.0 + 2;
                    var batt = this.battery;
                    if (batt.count < 10) {
                        ++batt.count;
                    } else {
                        batt.index %= 10;
                        batt.sum -= batt.data[batt.index];
                    }
                    batt.sum += value;
                    batt.data[batt.index] = value;
                    ++batt.index;
                    value = batt.sum / batt.count;
                    var state = 2;
                    if (value < 3.0) state = 0;
                    else if (value < 3.6) state = 1;
                    if (state != batt.state) {
                        batt.state = state;
                        sensory.batteryState = state;
                    }
                }
                // input a
                str = data.slice(34, 36);
                value = parseInt(str, 16);
                sensory.inputA = value;
                // input b
                str = data.slice(36, 38);
                value = parseInt(str, 16);
                sensory.inputB = value;
                // line tracer state
                str = data.slice(38, 40);
                value = parseInt(str, 16);
                if ((value & 0x40) != 0) {
                    var lineTracer = this.lineTracer;
                    if (lineTracer.event == 1) {
                        if (value != 0x40) {
                            lineTracer.event = 2;
                        }
                    }
                    if (lineTracer.event == 2) {
                        if (value != lineTracer.state) {
                            lineTracer.state = value;
                            sensory.lineTracerState = value;
                            sensory.lineTracerStateId = (sensory.lineTracerStateId % 255) + 1;
                            if (value == 0x40) {
                                lineTracer.event = 0;
                            }
                        }
                    }
                }
            }
            this.handleSensory();
        }

        requestInitialData() {
            return 'FF\r';
        }

        async initialHandshake() {
            let status = false;
            while (true) {
                const { value: data, done } = await Entry.hwLite.reader.read();
                if (done) {
                    return false;
                }
                if (data && data.slice(0, 2) == 'FF') {
                    var info = data.split(/[,\n]+/);
                    if (info && info.length >= 5) {
                        if (info[1] == 'Hamster' && info[2] == '04' && info[4].length >= 12) {
                            this.id = '0204' + info[3];
                            this.address = info[4].substring(0, 12);
                            this.isHamsterS = false;
                            status = true;
                            break;
                        } else if (info[2] == '0E' && info[4].length >= 12) {
                            this.id = '0204' + info[3];
                            this.address = info[4].substring(0, 12);
                            this.isHamsterS = true;
                            status = true;
                            break;
                        } else {
                            break;
                        }
                    }
                } else {
                    Entry.hwLite.sendAsciiAsBuffer(this.requestInitialData());
                }
            }
            return status;
        }
    })();
})();

module.exports = Entry.HamsterLite;
