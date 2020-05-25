'use strict';

function RoboidWriteQueue(size) {
    this.setSize(size);
    this.output = new Array(19);
}

RoboidWriteQueue.prototype.setSize = function(size) {
    this.buffer = new Array(size);
    this.mask = size - 1;
    this.provider = 0;
    this.consumer = 0;
};

RoboidWriteQueue.prototype.reset = function() {
    this.provider = 0;
    this.consumer = 0;
};

// from https://github.com/google/closure-library/blob/8598d87242af59aac233270742c8984e2b2bdbe0/closure/goog/crypt/crypt.js
RoboidWriteQueue.prototype.stringToUtf8ByteArray = function(str) {
    const out = [];
    let p = 0, c;
    for(let i = 0; i < str.length; i++) {
        c = str.charCodeAt(i);
        if(c < 128) {
            out[p++] = c;
        } else if(c < 2048) {
            out[p++] = (c >> 6) | 192;
            out[p++] = (c & 63) | 128;
        } else if(((c & 0xFC00) == 0xD800) && (i + 1) < str.length && ((str.charCodeAt(i + 1) & 0xFC00) == 0xDC00)) {
            c = 0x10000 + ((c & 0x03FF) << 10) + (str.charCodeAt(++i) & 0x03FF);
            out[p++] = (c >> 18) | 240;
            out[p++] = ((c >> 12) & 63) | 128;
            out[p++] = ((c >> 6) & 63) | 128;
            out[p++] = (c & 63) | 128;
        } else {
            out[p++] = (c >> 12) | 224;
            out[p++] = ((c >> 6) & 63) | 128;
            out[p++] = (c & 63) | 128;
        }
    }
    return out;
};

RoboidWriteQueue.prototype.push = function(str, line) {
    const buffer = this.buffer;
    const mask = this.mask;
    let provider = this.provider;
    let consumer = this.consumer;
    
    if(str.length > 0) {
        const out = this.stringToUtf8ByteArray(str);
        for(let i = 0; i < out.length; ++i) {
            if(((provider - consumer) & mask) == mask) { // full
                consumer = (consumer + 1) & mask;
            }
            buffer[provider] = out[i];
            provider = (provider + 1) & mask;
        }
    }
    if(line) {
        if(((provider - consumer) & mask) == mask) { // full
            consumer = (consumer + 1) & mask;
        }
        buffer[provider] = 0x0D;
        provider = (provider + 1) & mask;
    }
    this.provider = provider;
    this.consumer = consumer;
};

RoboidWriteQueue.prototype.pop = function() {
    const provider = this.provider;
    let consumer = this.consumer;
    if(provider == consumer) return undefined; // empty
    
    const buffer = this.buffer;
    const mask = this.mask;
    const output = this.output;
    let len = (provider - consumer) & mask;
    if(len > 18) len = 18;
    
    output[0] = len;
    let i = 1;
    for(; i <= len && consumer != provider; ++i) {
        output[i] = buffer[consumer];
        consumer = (consumer + 1) & mask;
    }
    for(; i <= 18; ++i) {
        output[i] = 0;
    }
    this.consumer = consumer;
    return output;
};

function RoboidReadQueue(size) {
    this.setSize(size);
}

RoboidReadQueue.prototype.setSize = function(size) {
    this.buffer = new Array(size);
    this.mask = size - 1;
    this.provider = 0;
    this.consumer = 0;
};

RoboidReadQueue.prototype.reset = function() {
    this.provider = 0;
    this.consumer = 0;
};

RoboidReadQueue.prototype.utf8ByteArrayToString = function(bytes, current, end) {
    const mask = this.mask, out = [];
    let c = 0, c1, c2, c3, c4, u;
    while(current != end) {
        c1 = bytes[current];
        current = (current + 1) & mask;
        if(c1 < 128) {
            out[c++] = String.fromCharCode(c1);
        } else if(c1 > 191 && c1 < 224) {
            if(current == end) break;
            c2 = bytes[current];
            current = (current + 1) & mask;
            out[c++] = String.fromCharCode((c1 & 31) << 6 | c2 & 63);
        } else if(c1 > 239 && c1 < 365) {
            if(current == end) break;
            c2 = bytes[current];
            current = (current + 1) & mask;
            if(current == end) break;
            c3 = bytes[current];
            current = (current + 1) & mask;
            if(current == end) break;
            c4 = bytes[current];
            current = (current + 1) & mask;
            u = ((c1 & 7) << 18 | (c2 & 63) << 12 | (c3 & 63) << 6 | c4 & 63) - 0x10000;
            out[c++] = String.fromCharCode(0xD800 + (u >> 10));
            out[c++] = String.fromCharCode(0xDC00 + (u & 1023));
        } else {
            if(current == end) break;
            c2 = bytes[current];
            current = (current + 1) & mask;
            if(current == end) break;
            c3 = bytes[current];
            current = (current + 1) & mask;
            out[c++] = String.fromCharCode((c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
        }
    }
    this.consumer = current;
    return out.join('');
};

RoboidReadQueue.prototype.push = function(packet, offset) {
    let len = packet[offset];
    if(len > 0) {
        if(len > 18) len = 18;
        
        const buffer = this.buffer;
        const mask = this.mask;
        let provider = this.provider;
        let consumer = this.consumer;
        const end = len + offset;
        for(let i = 1 + offset; i <= end; ++i) {
            if(((provider - consumer) & mask) == mask) { // full
                consumer = (consumer + 1) & mask;
            }
            buffer[provider] = packet[i];
            provider = (provider + 1) & mask;
        }
        this.provider = provider;
        this.consumer = consumer;
    }
};

RoboidReadQueue.prototype.pop = function(delimiter) {
    const provider = this.provider;
    let consumer = this.consumer;
    if(provider == consumer) return undefined; // empty
    
    if(delimiter == 0) {
        return this.utf8ByteArrayToString(this.buffer, consumer, provider);
    } else {
        const buffer = this.buffer;
        const mask = this.mask;
        let found = -1;
        while(consumer != provider) {
            if(buffer[consumer] == delimiter) {
                found = consumer;
                break;
            }
            consumer = (consumer + 1) & mask;
        }
        if(found >= 0) {
            const str = this.utf8ByteArrayToString(buffer, this.consumer, found);
            this.consumer = (this.consumer + 1) & mask;
            return str;
        }
    }
};

/**HamsterRobot**/
function HamsterRobot(index) {
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
    };
    this.motoring = {
        group: 'hamster',
        module: 'hamster',
        index,
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
}

HamsterRobot.prototype.__PORT_MAP = {
    group: 'hamster',
    module: 'hamster',
    motion: 0,
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
    ioModeB: 0,
    radius: 5,
};

HamsterRobot.prototype.setZero = function() {
    const portMap = this.__PORT_MAP;
    const motoring = this.motoring;
    for (const port in portMap) {
        motoring[port] = portMap[port];
    }
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
    this.__removeAllTimeouts();
};

HamsterRobot.prototype.afterReceive = function(pd) {
    this.sensory = pd;
    this.handleSensory();
};

HamsterRobot.prototype.afterSend = function(sq) {};

HamsterRobot.prototype.setMotoring = function(motoring) {
    this.motoring = motoring;
};

HamsterRobot.prototype.__setModule = function() {
    this.motoring.group = 'hamster';
    this.motoring.module = 'hamster';
};

HamsterRobot.prototype.__removeTimeout = function(id) {
    clearTimeout(id);
    const idx = this.timeouts.indexOf(id);
    if (idx >= 0) {
        this.timeouts.splice(idx, 1);
    }
};

HamsterRobot.prototype.__removeAllTimeouts = function() {
    const timeouts = this.timeouts;
    for (const i in timeouts) {
        clearTimeout(timeouts[i]);
    }
    this.timeouts = [];
};

HamsterRobot.prototype.__issueWheelBlockId = function() {
    this.wheelBlockId = this.blockId = (this.blockId % 65535) + 1;
    return this.wheelBlockId;
};

HamsterRobot.prototype.__cancelWheel = function() {
    this.wheelBlockId = 0;
    if (this.wheelTimer !== undefined) {
        this.__removeTimeout(this.wheelTimer);
    }
    this.wheelTimer = undefined;
};

HamsterRobot.prototype.__setLineTracerMode = function(mode) {
    this.lineTracerModeId = (this.lineTracerModeId % 255) + 1;
    this.motoring.lineTracerMode = mode;
    this.motoring.lineTracerModeId = this.lineTracerModeId;
};

HamsterRobot.prototype.__cancelLineTracer = function() {
    this.lineTracerCallback = undefined;
};

HamsterRobot.prototype.__cancelBoard = function() {
    this.boardCommand = 0;
    this.boardState = 0;
    this.boardCount = 0;
    this.boardCallback = undefined;
};

HamsterRobot.prototype.__issueNoteBlockId = function() {
    this.noteBlockId = this.blockId = (this.blockId % 65535) + 1;
    return this.noteBlockId;
};

HamsterRobot.prototype.__cancelNote = function() {
    this.noteBlockId = 0;
    if (this.noteTimer1 !== undefined) {
        this.__removeTimeout(this.noteTimer1);
    }
    if (this.noteTimer2 !== undefined) {
        this.__removeTimeout(this.noteTimer2);
    }
    this.noteTimer1 = undefined;
    this.noteTimer2 = undefined;
};

HamsterRobot.prototype.__issueIoBlockId = function() {
    this.ioBlockId = this.blockId = (this.blockId % 65535) + 1;
    return this.ioBlockId;
};

HamsterRobot.prototype.__cancelIo = function() {
    this.ioBlockId = 0;
    if (this.ioTimer !== undefined) {
        this.__removeTimeout(this.ioTimer);
    }
    this.ioTimer = undefined;
};

HamsterRobot.prototype.handleSensory = function() {
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
};

HamsterRobot.prototype.__SENSORS = {
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

HamsterRobot.prototype.getValue = function(script) {
    this.__setModule();
    const dev = script.getField('DEVICE');

    const sensor = this.__SENSORS[dev] || dev;
    return this.sensory[sensor];
};

HamsterRobot.prototype.checkBoolean = function(script) {
    this.__setModule();
    const sensory = this.sensory;
    let value = 0;
    const dev = script.getField('DEVICE');
    if (dev.startsWith('TILT')) {
        if (sensory.tilt === undefined) {
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
        } else {
            value = sensory.tilt;
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
};

HamsterRobot.prototype.checkHandFound = function(script) {
    this.__setModule();
    const sensory = this.sensory;
    return sensory.handFound === undefined
        ? sensory.leftProximity > 40 || sensory.rightProximity > 40
        : sensory.handFound;
};

HamsterRobot.prototype.__board = function(leftVelocity, rightVelocity, command, callback) {
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
};

HamsterRobot.prototype.boardForward = function(script) {
    this.__setModule();
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
};

HamsterRobot.prototype.boardTurn = function(script) {
    this.__setModule();
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
};

HamsterRobot.prototype.__motion = function(type, leftVelocity, rightVelocity, secs, callback) {
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
};

HamsterRobot.prototype.moveForwardSecs = function(script) {
    this.__setModule();
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
};

HamsterRobot.prototype.moveBackwardSecs = function(script) {
    this.__setModule();
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
};

HamsterRobot.prototype.turnSecs = function(script) {
    this.__setModule();
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
};

HamsterRobot.prototype.__stopMotion = function() {
    const motoring = this.motoring;
    this.__cancelBoard();
    this.__cancelWheel();
    this.__cancelLineTracer();

    motoring.leftWheel = 0;
    motoring.rightWheel = 0;
    motoring.motion = 0;
    this.__setLineTracerMode(0);
};

HamsterRobot.prototype.moveForwardUnit = function(script) {
    this.__setModule();
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
};

HamsterRobot.prototype.moveBackwardUnit = function(script) {
    this.__setModule();
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
};

HamsterRobot.prototype.turnUnit = function(script) {
    this.__setModule();
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
};

HamsterRobot.prototype.pivotUnit = function(script) {
    this.__setModule();
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
};

HamsterRobot.prototype.swingUnit = function(script) {
    this.__setModule();
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
};

HamsterRobot.prototype.setWheels = function(script) {
    const motoring = this.motoring;
    this.__setModule();
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
};

HamsterRobot.prototype.changeWheels = function(script) {
    const motoring = this.motoring;
    this.__setModule();
    this.__cancelBoard();
    this.__cancelWheel();
    this.__cancelLineTracer();

    let leftVelocity = script.getNumberValue('LEFT');
    let rightVelocity = script.getNumberValue('RIGHT');

    leftVelocity = parseFloat(leftVelocity);
    rightVelocity = parseFloat(rightVelocity);
    if (typeof leftVelocity == 'number') {
        motoring.leftWheel =
            motoring.leftWheel !== undefined ? motoring.leftWheel + leftVelocity : leftVelocity;
    }
    if (typeof rightVelocity == 'number') {
        motoring.rightWheel =
            motoring.rightWheel !== undefined ? motoring.rightWheel + rightVelocity : rightVelocity;
    }
    motoring.motion = 0;
    this.__setLineTracerMode(0);
    return script.callReturn();
};

HamsterRobot.prototype.setWheel = function(script) {
    const motoring = this.motoring;
    this.__setModule();
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
};

HamsterRobot.prototype.changeWheel = function(script) {
    const motoring = this.motoring;
    this.__setModule();
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
                motoring.rightWheel != undefined ? motoring.rightWheel + velocity : velocity;
        } else {
            motoring.leftWheel =
                motoring.leftWheel != undefined ? motoring.leftWheel + velocity : velocity;
            motoring.rightWheel =
                motoring.rightWheel != undefined ? motoring.rightWheel + velocity : velocity;
        }
    }
    motoring.motion = 0;
    this.__setLineTracerMode(0);
    return script.callReturn();
};

HamsterRobot.prototype.followLine = function(script) {
    this.__setModule();
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
};

HamsterRobot.prototype.followLineUntil = function(script) {
    this.__setModule();
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
        this.lineTracerCallback = function() {
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
};

HamsterRobot.prototype.setLineTracerSpeed = function(script) {
    this.__setModule();
    const speed = parseInt(script.getField('SPEED'));

    if (typeof speed == 'number') {
        this.motoring.lineTracerSpeed = speed;
    }
    return script.callReturn();
};

HamsterRobot.prototype.setLineTracerGain = function(script) {
    this.__setModule();
    return script.callReturn();
};

HamsterRobot.prototype.stop = function(script) {
    this.__setModule();
    this.__cancelBoard();
    this.__cancelWheel();
    this.__cancelLineTracer();

    const motoring = this.motoring;
    motoring.leftWheel = 0;
    motoring.rightWheel = 0;
    motoring.motion = 0;
    this.__setLineTracerMode(0);
    return script.callReturn();
};

HamsterRobot.prototype.__COLORS = {
    RED: 4,
    ORANGE: 4,
    YELLOW: 6,
    GREEN: 2,
    SKY_BLUE: 3,
    BLUE: 1,
    VIOLET: 5,
    PURPLE: 5,
    WHITE: 7,
    '4': 4,
    '6': 6,
    '2': 2,
    '3': 3,
    '1': 1,
    '5': 5,
    '7': 7,
};

HamsterRobot.prototype.setLed = function(script) {
    this.__setModule();
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
};

HamsterRobot.prototype.pickLed = function(script) {
    this.__setModule();
    return script.callReturn();
};

HamsterRobot.prototype.clearLed = function(script) {
    this.__setModule();
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
};

HamsterRobot.prototype.setRgb = function(script) {
    this.__setModule();
    return script.callReturn();
};

HamsterRobot.prototype.changeRgb = function(script) {
    this.__setModule();
    return script.callReturn();
};

HamsterRobot.prototype.__runBeep = function(count, id, callback) {
    if (count) {
        const self = this;
        const motoring = self.motoring;
        motoring.buzzer = 440;
        motoring.note = 0;
        self.noteTimer1 = setTimeout(() => {
            if (!id || self.noteBlockId == id) {
                motoring.buzzer = 0;
                if (self.noteTimer1 !== undefined) {
                    self.__removeTimeout(self.noteTimer1);
                }
                self.noteTimer1 = undefined;
            }
        }, 100);
        self.timeouts.push(self.noteTimer1);
        self.noteTimer2 = setTimeout(() => {
            if (!id || self.noteBlockId == id) {
                motoring.buzzer = 0;
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
};

HamsterRobot.prototype.beep = function(script) {
    this.__setModule();
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
};

HamsterRobot.prototype.playSound = function(script) {
    this.__setModule();
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
};

HamsterRobot.prototype.playSoundUntil = function(script) {
    this.__setModule();
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
};

HamsterRobot.prototype.setBuzzer = function(script) {
    this.__setModule();
    this.__cancelNote();
    let hz = script.getNumberValue('HZ');

    hz = parseFloat(hz);
    if (typeof hz == 'number') {
        this.motoring.buzzer = hz;
    }
    this.motoring.note = 0;
    return script.callReturn();
};

HamsterRobot.prototype.changeBuzzer = function(script) {
    this.__setModule();
    this.__cancelNote();
    let hz = script.getNumberValue('HZ');

    const motoring = this.motoring;
    hz = parseFloat(hz);
    if (typeof hz == 'number') {
        motoring.buzzer = motoring.buzzer != undefined ? motoring.buzzer + hz : hz;
    }
    motoring.note = 0;
    return script.callReturn();
};

HamsterRobot.prototype.clearBuzzer = function(script) {
    this.__setModule();
    this.__cancelNote();
    this.motoring.buzzer = 0;
    this.motoring.note = 0;
    return script.callReturn();
};

HamsterRobot.prototype.clearSound = function(script, motoring) {
    return this.clearBuzzer(script);
};

HamsterRobot.prototype.__NOTES = {
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
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    '10': 10,
    '11': 11,
    '12': 12,
    '13': 13,
    '14': 14,
    '15': 15,
};

HamsterRobot.prototype.playNote = function(script) {
    this.__setModule();
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
};

HamsterRobot.prototype.playNoteBeat = function(script) {
    const self = this;
    self.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isPlaying = true;
        self.__cancelNote();

        const motoring = self.motoring;
        let note = script.getField('NOTE');
        let octave = script.getNumberField('OCTAVE');
        let beat = script.getNumberValue('BEAT');

        note = parseInt(this.__NOTES[note]);
        octave = parseInt(octave);
        beat = parseFloat(beat);
        motoring.buzzer = 0;
        if (note && octave && octave > 0 && octave < 8 && beat && beat > 0 && self.tempo > 0) {
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
};

HamsterRobot.prototype.restBeat = function(script) {
    const self = this;
    self.__setModule();
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
};

HamsterRobot.prototype.setTempo = function(script) {
    this.__setModule();
    let bpm = script.getNumberValue('BPM');

    bpm = parseFloat(bpm);
    if (typeof bpm == 'number') {
        this.tempo = bpm;
        if (this.tempo < 1) {
            this.tempo = 1;
        }
    }
    return script.callReturn();
};

HamsterRobot.prototype.changeTempo = function(script) {
    this.__setModule();
    let bpm = script.getNumberValue('BPM');

    bpm = parseFloat(bpm);
    if (typeof bpm == 'number') {
        this.tempo += bpm;
        if (this.tempo < 1) {
            this.tempo = 1;
        }
    }
    return script.callReturn();
};

HamsterRobot.prototype.__IO_MODES = {
    ANALOG_INPUT: 0,
    DIGITAL_INPUT: 1,
    DIGITAL_INPUT_PULL_UP: 2,
    DIGITAL_INPUT_PULL_DOWN: 3,
    VOLTAGE_INPUT: 5,
    SERVO_OUTPUT: 8,
    PWM_OUTPUT: 9,
    DIGITAL_OUTPUT: 10,
    '0': 0,
    '1': 1,
    '2': 2,
    '3': 3,
    '5': 5,
    '8': 8,
    '9': 9,
    '10': 10,
};

HamsterRobot.prototype.setIoMode = function(script) {
    this.__setModule();
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
};

HamsterRobot.prototype.setOutput = function(script) {
    this.__setModule();
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
};

HamsterRobot.prototype.changeOutput = function(script) {
    this.__setModule();
    this.__cancelIo();

    const motoring = this.motoring;
    const port = script.getField('PORT');
    let value = script.getNumberValue('VALUE');

    value = parseFloat(value);
    if (typeof value == 'number') {
        if (port == 'A') {
            motoring.outputA = motoring.outputA != undefined ? motoring.outputA + value : value;
        } else if (port == 'B') {
            motoring.outputB = motoring.outputB != undefined ? motoring.outputB + value : value;
        } else {
            motoring.outputA = motoring.outputA != undefined ? motoring.outputA + value : value;
            motoring.outputB = motoring.outputB != undefined ? motoring.outputB + value : value;
        }
    }
    return script.callReturn();
};

HamsterRobot.prototype.gripper = function(script) {
    const self = this;
    self.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isPlaying = true;
        self.__cancelIo();

        const id = self.__issueIoBlockId();
        const action = script.getField('ACTION');

        const motoring = this.motoring;
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
};

HamsterRobot.prototype.releaseGripper = function(script) {
    this.__setModule();
    this.__cancelIo();

    const motoring = this.motoring;
    motoring.ioModeA = 10;
    motoring.ioModeB = 10;
    motoring.outputA = 0;
    motoring.outputB = 0;
    return script.callReturn();
};

HamsterRobot.prototype.writeSerial = function(script) {
    this.__setModule();
    this.__cancelIo();
    return script;
};

HamsterRobot.prototype.readSerialUntil = function(script) {
    this.__setModule();
    this.__cancelIo();
    return script;
};

HamsterRobot.prototype.setSerialRate = function(script) {
    this.__setModule();
    this.__cancelIo();
    return script;
};

HamsterRobot.prototype.getSerialInput = function(script) {
    this.__setModule();
    return '';
};

/**HamsterSRobot**/
function HamsterSRobot(index) {
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
    };
    this.motoring = {
        group: 'hamster',
        module: 'hamsterS',
        index,
    };
    this.pulseId = 0;
    this.soundId = 0;
    this.lineTracerModeId = 0;
    this.motionId = 0;
    this.writeSerialId = 0;
    this.tapId = -1;
    this.freeFallId = -1;
    this.wheelStateId = -1;
    this.soundStateId = -1;
    this.lineTracerStateId = -1;
    this.readSerialId = -1;
    this.serialStateId = -1;
    this.blockId = 0;
    this.motionCallback = undefined;
    this.lineTracerCallback = undefined;
    this.boardCommand = 0;
    this.boardState = 0;
    this.boardCount = 0;
    this.boardCallback = undefined;
    this.soundCallback = undefined;
    this.noteBlockId = 0;
    this.noteTimer1 = undefined;
    this.noteTimer2 = undefined;
    this.ioBlockId = 0;
    this.ioTimer = undefined;
    this.serialDelimiter = 0;
    this.serialRate = 176;
    this.writeSerialCallbacks = [];
    this.readSerialCallbacks = [];
    this.serialInput = '';
    this.freeFall = false;
    this.tap = false;
    this.tempo = 60;
    this.speed = 5;
    this.gain = -1;
    this.writeQueue = new RoboidWriteQueue(64);
    this.readQueue = new RoboidReadQueue(64);
    this.timeouts = [];
}

HamsterSRobot.prototype.__PORT_MAP = {
    group: 'hamster',
    module: 'hamsterS',
    leftWheel: 0,
    rightWheel: 0,
    leftRgb: '0,0,0',
    leftRed: 0,
    leftGreen: 0,
    leftBlue: 0,
    rightRgb: '0,0,0',
    rightRed: 0,
    rightGreen: 0,
    rightBlue: 0,
    buzzer: 0,
    outputA: 0,
    outputB: 0,
    pulse: 0,
    pulseId: 0,
    note: 0,
    sound: 0,
    soundRepeat: 1,
    soundId: 0,
    lineTracerMode: 0,
    lineTracerModeId: 0,
    lineTracerGain: 4,
    lineTracerSpeed: 5,
    ioModeA: 0,
    ioModeB: 0,
    motionId: 0,
    motionType: 0,
    motionUnit: 0,
    motionSpeed: 0,
    motionValue: 0,
    motionRadius: 0,
};

HamsterSRobot.prototype.setZero = function() {
    const portMap = this.__PORT_MAP;
    const motoring = this.motoring;
    for (const port in portMap) {
        motoring[port] = portMap[port];
    }
    this.pulseId = 0;
    this.soundId = 0;
    this.lineTracerModeId = 0;
    this.motionId = 0;
    this.writeSerialId = 0;
    this.tapId = -1;
    this.freeFallId = -1;
    this.wheelStateId = -1;
    this.soundStateId = -1;
    this.lineTracerStateId = -1;
    this.readSerialId = -1;
    this.serialStateId = -1;
    this.blockId = 0;
    this.motionCallback = undefined;
    this.lineTracerCallback = undefined;
    this.boardCommand = 0;
    this.boardState = 0;
    this.boardCount = 0;
    this.boardCallback = undefined;
    this.soundCallback = undefined;
    this.noteBlockId = 0;
    this.noteTimer1 = undefined;
    this.noteTimer2 = undefined;
    this.ioBlockId = 0;
    this.ioTimer = undefined;
    this.serialDelimiter = 0;
    this.serialRate = 176;
    this.writeSerialCallbacks = [];
    this.readSerialCallbacks = [];
    this.serialInput = '';
    this.freeFall = false;
    this.tap = false;
    this.tempo = 60;
    this.speed = 5;
    this.gain = -1;
    this.__removeAllTimeouts();
    this.writeQueue.reset();
    this.readQueue.reset();
};

HamsterSRobot.prototype.afterReceive = function(pd) {
    this.sensory = pd;
    this.handleSensory();
};

HamsterSRobot.prototype.afterSend = function(sq) {
    this.freeFall = false;
    this.tap = false;
};

HamsterSRobot.prototype.setMotoring = function(motoring) {
    this.motoring = motoring;
};

HamsterSRobot.prototype.__setModule = function() {
    this.motoring.group = 'hamster';
    this.motoring.module = 'hamsterS';
};

HamsterSRobot.prototype.__removeTimeout = function(id) {
    clearTimeout(id);
    const idx = this.timeouts.indexOf(id);
    if (idx >= 0) {
        this.timeouts.splice(idx, 1);
    }
};

HamsterSRobot.prototype.__removeAllTimeouts = function() {
    const timeouts = this.timeouts;
    for (const i in timeouts) {
        clearTimeout(timeouts[i]);
    }
    this.timeouts = [];
};

HamsterSRobot.prototype.__fireWriteSerialCallbacks = function() {
    const callbacks = this.writeSerialCallbacks;
    for (const i in callbacks) {
        callbacks[i]();
    }
    this.writeSerialCallbacks = [];
};

HamsterSRobot.prototype.__fireReadSerialCallbacks = function() {
    const callbacks = this.readSerialCallbacks;
    for (const i in callbacks) {
        callbacks[i]();
    }
    this.readSerialCallbacks = [];
};

HamsterSRobot.prototype.__setPulse = function(pulse) {
    this.pulseId = (this.pulseId % 255) + 1;
    this.motoring.pulse = pulse;
    this.motoring.pulseId = this.pulseId;
};

HamsterSRobot.prototype.__setLineTracerMode = function(mode) {
    this.lineTracerModeId = (this.lineTracerModeId % 255) + 1;
    this.motoring.lineTracerMode = mode;
    this.motoring.lineTracerModeId = this.lineTracerModeId;
};

HamsterSRobot.prototype.__cancelLineTracer = function() {
    this.lineTracerCallback = undefined;
};

HamsterSRobot.prototype.__setMotion = function(type, unit, speed, value, radius) {
    this.motionId = (this.motionId % 255) + 1;
    const motoring = this.motoring;
    motoring.motionType = type;
    motoring.motionUnit = unit;
    motoring.motionSpeed = speed;
    motoring.motionValue = value;
    motoring.motionRadius = radius;
    motoring.motionId = this.motionId;
};

HamsterSRobot.prototype.__cancelMotion = function() {
    this.motionCallback = undefined;
};

HamsterSRobot.prototype.__cancelBoard = function() {
    this.boardCommand = 0;
    this.boardState = 0;
    this.boardCount = 0;
    this.boardCallback = undefined;
};

HamsterSRobot.prototype.__runSound = function(sound, count) {
    if (typeof count != 'number') {
        count = 1;
    }
    if (count < 0) {
        count = -1;
    }
    if (count) {
        this.soundId = (this.soundId % 255) + 1;
        const motoring = this.motoring;
        motoring.sound = sound;
        motoring.soundRepeat = count;
        motoring.soundId = this.soundId;
    }
};

HamsterSRobot.prototype.__cancelSound = function() {
    this.soundCallback = undefined;
};

HamsterSRobot.prototype.__issueNoteBlockId = function() {
    this.noteBlockId = this.blockId = (this.blockId % 65535) + 1;
    return this.noteBlockId;
};

HamsterSRobot.prototype.__cancelNote = function() {
    this.noteBlockId = 0;
    if (this.noteTimer1 !== undefined) {
        this.__removeTimeout(this.noteTimer1);
    }
    if (this.noteTimer2 !== undefined) {
        this.__removeTimeout(this.noteTimer2);
    }
    this.noteTimer1 = undefined;
    this.noteTimer2 = undefined;
};

HamsterSRobot.prototype.__issueIoBlockId = function() {
    this.ioBlockId = this.blockId = (this.blockId % 65535) + 1;
    return this.ioBlockId;
};

HamsterSRobot.prototype.__cancelIo = function() {
    this.ioBlockId = 0;
    if (this.ioTimer !== undefined) {
        this.__removeTimeout(this.ioTimer);
    }
    this.ioTimer = undefined;
};

HamsterSRobot.prototype.__setSerial = function(arr) {
    this.writeSerialId = (this.writeSerialId % 255) + 1;
    const motoring = this.motoring;
    if (motoring.writeSerial == undefined) {
        motoring.writeSerial = new Array(19);
    }
    for (let i = 0; i < 19; ++i) {
        motoring.writeSerial[i] = arr[i];
    }
    motoring.writeSerialId = this.writeSerialId;
};

HamsterSRobot.prototype.handleSensory = function() {
    const self = this;
    const sensory = self.sensory;

    self.freeFall = sensory.freeFall == 1;
    self.tap = sensory.tap == 1;

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
    if (self.motionCallback) {
        if (sensory.wheelStateId != self.wheelStateId) {
            self.wheelStateId = sensory.wheelStateId;
            if (sensory.wheelState == 2) {
                self.motoring.leftWheel = 0;
                self.motoring.rightWheel = 0;
                var callback = self.motionCallback;
                self.__cancelMotion();
                if (callback) {
                    callback();
                }
            }
        }
    }
    if (self.soundCallback) {
        if (sensory.soundStateId != self.soundStateId) {
            self.soundStateId = sensory.soundStateId;
            if (sensory.soundState == 0) {
                var callback = self.soundCallback;
                self.__cancelSound();
                if (callback) {
                    callback();
                }
            }
        }
    }
    if (sensory.readSerialId != self.readSerialId) {
        if (sensory.readSerial && self.readSerialId >= 0) {
            self.readQueue.push(sensory.readSerial, 0);
        }
        self.readSerialId = sensory.readSerialId;
    }
    if (sensory.serialStateId != self.serialStateId) {
        self.serialStateId = sensory.serialStateId;
        if (sensory.serialState == 1) {
            var tmp = self.writeQueue.pop();
            if (tmp) {
                self.__setSerial(tmp);
            } else {
                self.__fireWriteSerialCallbacks();
            }
        }
    }
    if (self.readSerialCallbacks.length > 0) {
        var tmp = self.readQueue.pop(self.serialDelimiter);
        if (tmp) {
            self.serialInput = tmp;
            self.__fireReadSerialCallbacks();
        }
    }
};

HamsterSRobot.prototype.__SENSORS = {
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
    SERIAL_INPUT: 'readSerial',
};

HamsterSRobot.prototype.getValue = function(script) {
    this.__setModule();
    const dev = script.getField('DEVICE');

    if (dev == 'SERIAL_INPUT') {
        return this.getSerialInput();
    } else {
        const sensor = this.__SENSORS[dev] || dev;
        return this.sensory[sensor];
    }
};

HamsterSRobot.prototype.checkBoolean = function(script) {
    this.__setModule();
    const sensory = this.sensory;
    let value = 0;
    const dev = script.getField('DEVICE');
    if (dev.startsWith('TILT')) {
        if (sensory.tilt === undefined) {
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
        } else {
            value = sensory.tilt;
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
            case 'TAP':
                return this.tap;
            case 'FREE_FALL':
                return this.freeFall;
            case 'BATTERY_NORMAL':
                return sensory.batteryState === 2;
            case 'BATTERY_LOW':
                return sensory.batteryState === 1;
            case 'BATTERY_EMPTY':
                return sensory.batteryState === 0;
        }
        return false;
    }
};

HamsterSRobot.prototype.checkHandFound = function(script) {
    this.__setModule();
    const sensory = this.sensory;
    return sensory.handFound === undefined
        ? sensory.leftProximity > 50 || sensory.rightProximity > 50
        : sensory.handFound;
};

HamsterSRobot.prototype.__board = function(leftVelocity, rightVelocity, command, callback) {
    const motoring = this.motoring;
    this.__cancelMotion();
    this.__cancelLineTracer();

    motoring.leftWheel = leftVelocity;
    motoring.rightWheel = rightVelocity;
    this.boardCommand = command;
    this.boardCount = 0;
    this.boardState = 1;
    this.boardCallback = callback;
    this.__setPulse(0);
    this.__setMotion(0, 0, 0, 0, 0);
    this.__setLineTracerMode(0);
};

HamsterSRobot.prototype.boardForward = function(script) {
    this.__setModule();
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
};

HamsterSRobot.prototype.boardTurn = function(script) {
    this.__setModule();
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
};

HamsterSRobot.prototype.__motionUnit = function(type, unit, value, callback) {
    const motoring = this.motoring;
    this.__cancelBoard();
    this.__cancelMotion();
    this.__cancelLineTracer();

    motoring.leftWheel = 0;
    motoring.rightWheel = 0;
    this.__setPulse(0);
    value = parseFloat(value);
    if (value && value > 0) {
        this.__setMotion(type, unit, 0, value, 0); // type, unit, speed, value, radius
        this.motionCallback = callback;
        this.__setLineTracerMode(0);
    } else {
        this.__setMotion(0, 0, 0, 0, 0);
        this.__setLineTracerMode(0);
        callback();
    }
};

HamsterSRobot.prototype.__motionUnitRadius = function(type, unit, value, radius, callback) {
    const motoring = this.motoring;
    this.__cancelBoard();
    this.__cancelMotion();
    this.__cancelLineTracer();

    motoring.leftWheel = 0;
    motoring.rightWheel = 0;
    this.__setPulse(0);
    value = parseFloat(value);
    radius = parseFloat(radius);
    if (value && value > 0 && typeof radius == 'number' && radius >= 0) {
        this.__setMotion(type, unit, 0, value, radius); // type, unit, speed, value, radius
        this.motionCallback = callback;
        this.__setLineTracerMode(0);
    } else {
        this.__setMotion(0, 0, 0, 0, 0);
        this.__setLineTracerMode(0);
        callback();
    }
};

HamsterSRobot.prototype.moveForwardSecs = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isMoving = true;
        const secs = script.getNumberValue('SECS');
        if (secs < 0) {
            this.__motionUnit(2, 2, -secs, () => {
                script.isMoving = false;
            });
        } else {
            this.__motionUnit(1, 2, secs, () => {
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
};

HamsterSRobot.prototype.moveBackwardSecs = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isMoving = true;
        const secs = script.getNumberValue('SECS');
        if (secs < 0) {
            this.__motionUnit(1, 2, -secs, () => {
                script.isMoving = false;
            });
        } else {
            this.__motionUnit(2, 2, secs, () => {
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
};

HamsterSRobot.prototype.turnSecs = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isMoving = true;
        const direction = script.getField('DIRECTION');
        const secs = script.getNumberValue('SECS');
        if (direction == 'LEFT') {
            if (secs < 0) {
                this.__motionUnit(4, 2, -secs, () => {
                    script.isMoving = false;
                });
            } else {
                this.__motionUnit(3, 2, secs, () => {
                    script.isMoving = false;
                });
            }
        } else {
            if (secs < 0) {
                this.__motionUnit(3, 2, -secs, () => {
                    script.isMoving = false;
                });
            } else {
                this.__motionUnit(4, 2, secs, () => {
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
};

HamsterSRobot.prototype.__stopMotion = function() {
    const motoring = this.motoring;
    this.__cancelBoard();
    this.__cancelMotion();
    this.__cancelLineTracer();

    motoring.leftWheel = 0;
    motoring.rightWheel = 0;
    this.__setPulse(0);
    this.__setMotion(0, 0, 0, 0, 0);
    this.__setLineTracerMode(0);
};

HamsterSRobot.prototype.__UNITS = {
    CM: 1,
    DEG: 1,
    SEC: 2,
    PULSE: 3,
};

HamsterSRobot.prototype.moveForwardUnit = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isMoving = true;

        const value = script.getNumberValue('VALUE');
        const unit = script.getField('UNIT');

        if (value < 0) {
            this.__motionUnit(2, this.__UNITS[unit], -value, () => {
                script.isMoving = false;
            });
        } else {
            this.__motionUnit(1, this.__UNITS[unit], value, () => {
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
};

HamsterSRobot.prototype.moveBackwardUnit = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isMoving = true;

        const value = script.getNumberValue('VALUE');
        const unit = script.getField('UNIT');

        if (value < 0) {
            this.__motionUnit(1, this.__UNITS[unit], -value, () => {
                script.isMoving = false;
            });
        } else {
            this.__motionUnit(2, this.__UNITS[unit], value, () => {
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
};

HamsterSRobot.prototype.turnUnit = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isMoving = true;

        const direction = script.getField('DIRECTION');
        const value = script.getNumberValue('VALUE');
        const unit = script.getField('UNIT');

        if (direction == 'LEFT') {
            if (value < 0) {
                this.__motionUnit(4, this.__UNITS[unit], -value, () => {
                    script.isMoving = false;
                });
            } else {
                this.__motionUnit(3, this.__UNITS[unit], value, () => {
                    script.isMoving = false;
                });
            }
        } else {
            if (value < 0) {
                this.__motionUnit(3, this.__UNITS[unit], -value, () => {
                    script.isMoving = false;
                });
            } else {
                this.__motionUnit(4, this.__UNITS[unit], value, () => {
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
};

HamsterSRobot.prototype.pivotUnit = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isMoving = true;

        const part = script.getField('PART');
        const value = script.getNumberValue('VALUE');
        let unit = script.getField('UNIT');
        const toward = script.getField('TOWARD');

        unit = this.__UNITS[unit];
        if (part == 'LEFT_PEN') {
            if (toward == 'FORWARD') {
                if (value < 0) {
                    this.__motionUnit(14, unit, -value, () => {
                        script.isMoving = false;
                    });
                } else {
                    this.__motionUnit(13, unit, value, () => {
                        script.isMoving = false;
                    });
                }
            } else {
                if (value < 0) {
                    this.__motionUnit(13, unit, -value, () => {
                        script.isMoving = false;
                    });
                } else {
                    this.__motionUnit(14, unit, value, () => {
                        script.isMoving = false;
                    });
                }
            }
        } else if (part == 'RIGHT_PEN') {
            if (toward == 'FORWARD') {
                if (value < 0) {
                    this.__motionUnit(16, unit, -value, () => {
                        script.isMoving = false;
                    });
                } else {
                    this.__motionUnit(15, unit, value, () => {
                        script.isMoving = false;
                    });
                }
            } else {
                if (value < 0) {
                    this.__motionUnit(15, unit, -value, () => {
                        script.isMoving = false;
                    });
                } else {
                    this.__motionUnit(16, unit, value, () => {
                        script.isMoving = false;
                    });
                }
            }
        } else if (part == 'LEFT_WHEEL') {
            if (toward == 'FORWARD') {
                if (value < 0) {
                    this.__motionUnit(6, unit, -value, () => {
                        script.isMoving = false;
                    });
                } else {
                    this.__motionUnit(5, unit, value, () => {
                        script.isMoving = false;
                    });
                }
            } else {
                if (value < 0) {
                    this.__motionUnit(5, unit, -value, () => {
                        script.isMoving = false;
                    });
                } else {
                    this.__motionUnit(6, unit, value, () => {
                        script.isMoving = false;
                    });
                }
            }
        } else {
            if (toward == 'FORWARD') {
                if (value < 0) {
                    this.__motionUnit(8, unit, -value, () => {
                        script.isMoving = false;
                    });
                } else {
                    this.__motionUnit(7, unit, value, () => {
                        script.isMoving = false;
                    });
                }
            } else {
                if (value < 0) {
                    this.__motionUnit(7, unit, -value, () => {
                        script.isMoving = false;
                    });
                } else {
                    this.__motionUnit(8, unit, value, () => {
                        script.isMoving = false;
                    });
                }
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
};

HamsterSRobot.prototype.swingUnit = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isMoving = true;

        const part = script.getField('PART');
        const direction = script.getField('DIRECTION');
        const value = script.getNumberValue('VALUE');
        let unit = script.getField('UNIT');
        const radius = script.getNumberValue('RADIUS');
        const toward = script.getField('TOWARD');

        unit = this.__UNITS[unit];
        if (part == 'LEFT_PEN') {
            if (direction == 'LEFT') {
                if (toward == 'FORWARD') {
                    if (value < 0) {
                        this.__motionUnitRadius(18, unit, -value, radius, () => {
                            script.isMoving = false;
                        });
                    } else {
                        this.__motionUnitRadius(17, unit, value, radius, () => {
                            script.isMoving = false;
                        });
                    }
                } else {
                    if (value < 0) {
                        this.__motionUnitRadius(17, unit, -value, radius, () => {
                            script.isMoving = false;
                        });
                    } else {
                        this.__motionUnitRadius(18, unit, value, radius, () => {
                            script.isMoving = false;
                        });
                    }
                }
            } else {
                if (toward == 'FORWARD') {
                    if (value < 0) {
                        this.__motionUnitRadius(20, unit, -value, radius, () => {
                            script.isMoving = false;
                        });
                    } else {
                        this.__motionUnitRadius(19, unit, value, radius, () => {
                            script.isMoving = false;
                        });
                    }
                } else {
                    if (value < 0) {
                        this.__motionUnitRadius(19, unit, -value, radius, () => {
                            script.isMoving = false;
                        });
                    } else {
                        this.__motionUnitRadius(20, unit, value, radius, () => {
                            script.isMoving = false;
                        });
                    }
                }
            }
        } else if (part == 'RIGHT_PEN') {
            if (direction == 'LEFT') {
                if (toward == 'FORWARD') {
                    if (value < 0) {
                        this.__motionUnitRadius(22, unit, -value, radius, () => {
                            script.isMoving = false;
                        });
                    } else {
                        this.__motionUnitRadius(21, unit, value, radius, () => {
                            script.isMoving = false;
                        });
                    }
                } else {
                    if (value < 0) {
                        this.__motionUnitRadius(21, unit, -value, radius, () => {
                            script.isMoving = false;
                        });
                    } else {
                        this.__motionUnitRadius(22, unit, value, radius, () => {
                            script.isMoving = false;
                        });
                    }
                }
            } else {
                if (toward == 'FORWARD') {
                    if (value < 0) {
                        this.__motionUnitRadius(24, unit, -value, radius, () => {
                            script.isMoving = false;
                        });
                    } else {
                        this.__motionUnitRadius(23, unit, value, radius, () => {
                            script.isMoving = false;
                        });
                    }
                } else {
                    if (value < 0) {
                        this.__motionUnitRadius(23, unit, -value, radius, () => {
                            script.isMoving = false;
                        });
                    } else {
                        this.__motionUnitRadius(24, unit, value, radius, () => {
                            script.isMoving = false;
                        });
                    }
                }
            }
        } else {
            if (direction == 'LEFT') {
                if (toward == 'FORWARD') {
                    if (value < 0) {
                        this.__motionUnitRadius(10, unit, -value, radius, () => {
                            script.isMoving = false;
                        });
                    } else {
                        this.__motionUnitRadius(9, unit, value, radius, () => {
                            script.isMoving = false;
                        });
                    }
                } else {
                    if (value < 0) {
                        this.__motionUnitRadius(9, unit, -value, radius, () => {
                            script.isMoving = false;
                        });
                    } else {
                        this.__motionUnitRadius(10, unit, value, radius, () => {
                            script.isMoving = false;
                        });
                    }
                }
            } else {
                if (toward == 'FORWARD') {
                    if (value < 0) {
                        this.__motionUnitRadius(12, unit, -value, radius, () => {
                            script.isMoving = false;
                        });
                    } else {
                        this.__motionUnitRadius(11, unit, value, radius, () => {
                            script.isMoving = false;
                        });
                    }
                } else {
                    if (value < 0) {
                        this.__motionUnitRadius(11, unit, -value, radius, () => {
                            script.isMoving = false;
                        });
                    } else {
                        this.__motionUnitRadius(12, unit, value, radius, () => {
                            script.isMoving = false;
                        });
                    }
                }
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
};

HamsterSRobot.prototype.setWheels = function(script) {
    const motoring = this.motoring;
    this.__setModule();
    this.__cancelBoard();
    this.__cancelMotion();
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
    this.__setPulse(0);
    this.__setMotion(0, 0, 0, 0, 0);
    this.__setLineTracerMode(0);
    return script.callReturn();
};

HamsterSRobot.prototype.changeWheels = function(script) {
    const motoring = this.motoring;
    this.__setModule();
    this.__cancelBoard();
    this.__cancelMotion();
    this.__cancelLineTracer();

    let leftVelocity = script.getNumberValue('LEFT');
    let rightVelocity = script.getNumberValue('RIGHT');

    leftVelocity = parseFloat(leftVelocity);
    rightVelocity = parseFloat(rightVelocity);
    if (typeof leftVelocity == 'number') {
        motoring.leftWheel =
            motoring.leftWheel !== undefined ? motoring.leftWheel + leftVelocity : leftVelocity;
    }
    if (typeof rightVelocity == 'number') {
        motoring.rightWheel =
            motoring.rightWheel !== undefined ? motoring.rightWheel + rightVelocity : rightVelocity;
    }
    this.__setPulse(0);
    this.__setMotion(0, 0, 0, 0, 0);
    this.__setLineTracerMode(0);
    return script.callReturn();
};

HamsterSRobot.prototype.setWheel = function(script) {
    const motoring = this.motoring;
    this.__setModule();
    this.__cancelBoard();
    this.__cancelMotion();
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
    this.__setPulse(0);
    this.__setMotion(0, 0, 0, 0, 0);
    this.__setLineTracerMode(0);
    return script.callReturn();
};

HamsterSRobot.prototype.changeWheel = function(script) {
    const motoring = this.motoring;
    this.__setModule();
    this.__cancelBoard();
    this.__cancelMotion();
    this.__cancelLineTracer();

    const wheel = script.getField('WHEEL');
    let velocity = parseFloat(script.getNumberValue('VELOCITY'));

    velocity = parseFloat(velocity);
    if (typeof velocity == 'number') {
        if (wheel == 'LEFT') {
            motoring.leftWheel =
                motoring.leftWheel != undefined ? motoring.leftWheel + velocity : velocity;
        } else if (wheel == 'RIGHT') {
            motoring.rightWheel =
                motoring.rightWheel != undefined ? motoring.rightWheel + velocity : velocity;
        } else {
            motoring.leftWheel =
                motoring.leftWheel != undefined ? motoring.leftWheel + velocity : velocity;
            motoring.rightWheel =
                motoring.rightWheel != undefined ? motoring.rightWheel + velocity : velocity;
        }
    }
    this.__setPulse(0);
    this.__setMotion(0, 0, 0, 0, 0);
    this.__setLineTracerMode(0);
    return script.callReturn();
};

HamsterSRobot.prototype.followLine = function(script) {
    this.__setModule();
    this.__cancelBoard();
    this.__cancelMotion();
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
    this.__setPulse(0);
    this.__setMotion(0, 0, 0, 0, 0);
    this.__setLineTracerMode(mode);
    return script.callReturn();
};

HamsterSRobot.prototype.followLineUntil = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isMoving = true;
        this.__cancelBoard();
        this.__cancelMotion();

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
        this.__setPulse(0);
        this.__setMotion(0, 0, 0, 0, 0);
        this.__setLineTracerMode(mode);
        this.lineTracerCallback = function() {
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
};

HamsterSRobot.prototype.__GAINS = {
    1: 6,
    2: 6,
    3: 5,
    4: 5,
    5: 4,
    6: 4,
    7: 3,
    8: 3,
};

HamsterSRobot.prototype.setLineTracerSpeed = function(script) {
    this.__setModule();
    const speed = parseInt(script.getField('SPEED'));

    let gain = this.gain;
    if (gain < 0) {
        gain = this.__GAINS[speed];
    }
    if (speed && gain && speed > 0 && gain > 0) {
        this.speed = speed;
        this.motoring.lineTracerSpeed = speed;
        this.motoring.lineTracerGain = gain;
    }
    return script.callReturn();
};

HamsterSRobot.prototype.setLineTracerGain = function(script) {
    this.__setModule();
    let gain = parseInt(script.getField('GAIN'));

    if (gain && gain > 0) {
        this.gain = gain;
        this.motoring.lineTracerGain = gain;
    } else {
        this.gain = -1;
        gain = this.__GAINS[this.speed];
        if (gain && gain > 0) {
            this.motoring.lineTracerGain = gain;
        }
    }
    return script.callReturn();
};

HamsterSRobot.prototype.stop = function(script) {
    this.__setModule();
    this.__cancelBoard();
    this.__cancelMotion();
    this.__cancelLineTracer();

    const motoring = this.motoring;
    motoring.leftWheel = 0;
    motoring.rightWheel = 0;
    this.__setPulse(0);
    this.__setMotion(0, 0, 0, 0, 0);
    this.__setLineTracerMode(0);
    return script.callReturn();
};

HamsterSRobot.prototype.__RGB_COLORS = {
    RED: [255, 0, 0],
    ORANGE: [255, 63, 0],
    YELLOW: [255, 255, 0],
    GREEN: [0, 255, 0],
    SKY_BLUE: [0, 255, 255],
    BLUE: [0, 0, 255],
    VIOLET: [63, 0, 255],
    PURPLE: [255, 0, 255],
    WHITE: [255, 255, 255],
    '4': [255, 0, 0],
    '6': [255, 255, 0],
    '2': [0, 255, 0],
    '3': [0, 255, 255],
    '1': [0, 0, 255],
    '5': [255, 0, 255],
    '7': [255, 255, 255],
};

HamsterSRobot.prototype.setLed = function(script) {
    this.__setModule();
    const led = script.getField('LED');
    const color = script.getField('COLOR');

    const rgb = this.__RGB_COLORS[color];
    if (rgb) {
        const motoring = this.motoring;
        if (led == 'LEFT') {
            motoring.leftRgb = `${rgb[0]},${rgb[1]},${rgb[2]}`;
            motoring.leftRed = rgb[0];
            motoring.leftGreen = rgb[1];
            motoring.leftBlue = rgb[2];
        } else if (led == 'RIGHT') {
            motoring.rightRgb = `${rgb[0]},${rgb[1]},${rgb[2]}`;
            motoring.rightRed = rgb[0];
            motoring.rightGreen = rgb[1];
            motoring.rightBlue = rgb[2];
        } else {
            motoring.leftRgb = `${rgb[0]},${rgb[1]},${rgb[2]}`;
            motoring.leftRed = rgb[0];
            motoring.leftGreen = rgb[1];
            motoring.leftBlue = rgb[2];
            motoring.rightRgb = `${rgb[0]},${rgb[1]},${rgb[2]}`;
            motoring.rightRed = rgb[0];
            motoring.rightGreen = rgb[1];
            motoring.rightBlue = rgb[2];
        }
    }
    return script.callReturn();
};

HamsterSRobot.prototype.pickLed = function(script) {
    this.__setModule();
    const led = script.getField('LED');
    const color = script.getField('COLOR');

    const red = parseInt(color.slice(1, 3), 16);
    const green = parseInt(color.slice(3, 5), 16);
    const blue = parseInt(color.slice(5, 7), 16);

    const motoring = this.motoring;
    if (led == 'LEFT') {
        motoring.leftRgb = `${red},${green},${blue}`;
        motoring.leftRed = red;
        motoring.leftGreen = green;
        motoring.leftBlue = blue;
    } else if (led == 'RIGHT') {
        motoring.rightRgb = `${red},${green},${blue}`;
        motoring.rightRed = red;
        motoring.rightGreen = green;
        motoring.rightBlue = blue;
    } else {
        motoring.leftRgb = `${red},${green},${blue}`;
        motoring.leftRed = red;
        motoring.leftGreen = green;
        motoring.leftBlue = blue;
        motoring.rightRgb = `${red},${green},${blue}`;
        motoring.rightRed = red;
        motoring.rightGreen = green;
        motoring.rightBlue = blue;
    }
    return script.callReturn();
};

HamsterSRobot.prototype.clearLed = function(script) {
    this.__setModule();
    const led = script.getField('LED');

    const motoring = this.motoring;
    if (led == 'LEFT') {
        motoring.leftRgb = '0,0,0';
        motoring.leftRed = 0;
        motoring.leftGreen = 0;
        motoring.leftBlue = 0;
    } else if (led == 'RIGHT') {
        motoring.rightRgb = '0,0,0';
        motoring.rightRed = 0;
        motoring.rightGreen = 0;
        motoring.rightBlue = 0;
    } else {
        motoring.leftRgb = '0,0,0';
        motoring.leftRed = 0;
        motoring.leftGreen = 0;
        motoring.leftBlue = 0;
        motoring.rightRgb = '0,0,0';
        motoring.rightRed = 0;
        motoring.rightGreen = 0;
        motoring.rightBlue = 0;
    }
    return script.callReturn();
};

HamsterSRobot.prototype.setRgb = function(script) {
    this.__setModule();
    const led = script.getField('LED');
    let red = script.getNumberValue('RED');
    let green = script.getNumberValue('GREEN');
    let blue = script.getNumberValue('BLUE');

    const motoring = this.motoring;
    red = parseInt(red);
    green = parseInt(green);
    blue = parseInt(blue);
    if (led == 'LEFT') {
        if (typeof red == 'number') {
            motoring.leftRed = red;
        }
        if (typeof green == 'number') {
            motoring.leftGreen = green;
        }
        if (typeof blue == 'number') {
            motoring.leftBlue = blue;
        }
        motoring.leftRgb = `${motoring.leftRed},${motoring.leftGreen},${motoring.leftBlue}`;
    } else if (led == 'RIGHT') {
        if (typeof red == 'number') {
            motoring.rightRed = red;
        }
        if (typeof green == 'number') {
            motoring.rightGreen = green;
        }
        if (typeof blue == 'number') {
            motoring.rightBlue = blue;
        }
        motoring.rightRgb = `${motoring.rightRed},${motoring.rightGreen},${motoring.rightBlue}`;
    } else {
        if (typeof red == 'number') {
            motoring.leftRed = red;
            motoring.rightRed = red;
        }
        if (typeof green == 'number') {
            motoring.leftGreen = green;
            motoring.rightGreen = green;
        }
        if (typeof blue == 'number') {
            motoring.leftBlue = blue;
            motoring.rightBlue = blue;
        }
        motoring.leftRgb = `${motoring.leftRed},${motoring.leftGreen},${motoring.leftBlue}`;
        motoring.rightRgb = `${motoring.rightRed},${motoring.rightGreen},${motoring.rightBlue}`;
    }
    return script.callReturn();
};

HamsterSRobot.prototype.changeRgb = function(script) {
    this.__setModule();
    const led = script.getField('LED');
    let red = script.getNumberValue('RED');
    let green = script.getNumberValue('GREEN');
    let blue = script.getNumberValue('BLUE');

    const motoring = this.motoring;
    red = parseInt(red);
    green = parseInt(green);
    blue = parseInt(blue);
    if (led == 'LEFT') {
        if (typeof red == 'number') {
            motoring.leftRed += red;
        }
        if (typeof green == 'number') {
            motoring.leftGreen += green;
        }
        if (typeof blue == 'number') {
            motoring.leftBlue += blue;
        }
        motoring.leftRgb = `${motoring.leftRed},${motoring.leftGreen},${motoring.leftBlue}`;
    } else if (led == 'RIGHT') {
        if (typeof red == 'number') {
            motoring.rightRed += red;
        }
        if (typeof green == 'number') {
            motoring.rightGreen += green;
        }
        if (typeof blue == 'number') {
            motoring.rightBlue += blue;
        }
        motoring.rightRgb = `${motoring.rightRed},${motoring.rightGreen},${motoring.rightBlue}`;
    } else {
        if (typeof red == 'number') {
            motoring.leftRed += red;
            motoring.rightRed += red;
        }
        if (typeof green == 'number') {
            motoring.leftGreen += green;
            motoring.rightGreen += green;
        }
        if (typeof blue == 'number') {
            motoring.leftBlue += blue;
            motoring.rightBlue += blue;
        }
        motoring.leftRgb = `${motoring.leftRed},${motoring.leftGreen},${motoring.leftBlue}`;
        motoring.rightRgb = `${motoring.rightRed},${motoring.rightGreen},${motoring.rightBlue}`;
    }
    return script.callReturn();
};

HamsterSRobot.prototype.beep = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isPlaying = true;
        this.__cancelNote();
        this.__cancelSound();

        this.motoring.buzzer = 0;
        this.motoring.note = 0;
        this.__runSound(1, 1);
        this.soundCallback = function() {
            script.isPlaying = false;
        };
        return script;
    } else if (script.isPlaying) {
        return script;
    } else {
        delete script.isStart;
        delete script.isPlaying;
        Entry.engine.isContinue = false;
        return script.callReturn();
    }
};

HamsterSRobot.prototype.__SOUNDS = {
    BEEP: 1,
    RANDOM_BEEP: 2,
    NOISE: 10,
    SIREN: 3,
    ENGINE: 4,
    CHOP: 11,
    ROBOT: 5,
    DIBIDIBIDIP: 8,
    GOOD_JOB: 9,
    HAPPY: 12,
    ANGRY: 13,
    SAD: 14,
    SLEEP: 15,
    MARCH: 6,
    BIRTHDAY: 7,
};

HamsterSRobot.prototype.playSound = function(script) {
    this.__setModule();
    this.__cancelNote();
    this.__cancelSound();

    let sound = script.getField('SOUND');
    let count = script.getNumberValue('COUNT');

    sound = this.__SOUNDS[sound];
    count = parseInt(count);
    this.motoring.buzzer = 0;
    this.motoring.note = 0;
    if (sound && count) {
        this.__runSound(sound, count);
    } else {
        this.__runSound(0);
    }
    return script.callReturn();
};

HamsterSRobot.prototype.playSoundUntil = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isPlaying = true;
        this.__cancelNote();
        this.__cancelSound();

        let sound = script.getField('SOUND');
        let count = script.getNumberValue('COUNT');
        sound = this.__SOUNDS[sound];
        count = parseInt(count);
        this.motoring.buzzer = 0;
        this.motoring.note = 0;
        if (sound && count) {
            this.__runSound(sound, count);
            this.soundCallback = function() {
                script.isPlaying = false;
            };
        } else {
            this.__runSound(0);
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
};

HamsterSRobot.prototype.setBuzzer = function(script) {
    this.__setModule();
    this.__cancelNote();
    this.__cancelSound();
    let hz = script.getNumberValue('HZ');

    hz = parseFloat(hz);
    if (typeof hz == 'number') {
        this.motoring.buzzer = hz;
    }
    this.motoring.note = 0;
    this.__runSound(0);
    return script.callReturn();
};

HamsterSRobot.prototype.changeBuzzer = function(script) {
    this.__setModule();
    this.__cancelNote();
    this.__cancelSound();
    let hz = script.getNumberValue('HZ');

    const motoring = this.motoring;
    hz = parseFloat(hz);
    if (typeof hz == 'number') {
        motoring.buzzer = motoring.buzzer != undefined ? motoring.buzzer + hz : hz;
    }
    motoring.note = 0;
    this.__runSound(0);
    return script.callReturn();
};

HamsterSRobot.prototype.clearBuzzer = function(script) {
    return this.clearSound(script);
};

HamsterSRobot.prototype.clearSound = function(script, motoring) {
    this.__setModule();
    this.__cancelNote();
    this.__cancelSound();

    this.motoring.buzzer = 0;
    this.motoring.note = 0;
    this.__runSound(0);
    return script.callReturn();
};

HamsterSRobot.prototype.__NOTES = {
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
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    '10': 10,
    '11': 11,
    '12': 12,
    '13': 13,
    '14': 14,
    '15': 15,
};

HamsterSRobot.prototype.playNote = function(script) {
    this.__setModule();
    this.__cancelNote();
    this.__cancelSound();

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
    this.__runSound(0);
    return script.callReturn();
};

HamsterSRobot.prototype.playNoteBeat = function(script) {
    const self = this;
    self.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isPlaying = true;
        self.__cancelNote();
        self.__cancelSound();

        const motoring = self.motoring;
        let note = script.getField('NOTE');
        let octave = script.getNumberField('OCTAVE');
        let beat = script.getNumberValue('BEAT');

        note = parseInt(this.__NOTES[note]);
        octave = parseInt(octave);
        beat = parseFloat(beat);
        motoring.buzzer = 0;
        if (note && octave && octave > 0 && octave < 8 && beat && beat > 0 && self.tempo > 0) {
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
            self.__runSound(0);
        } else {
            motoring.note = 0;
            self.__runSound(0);
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
};

HamsterSRobot.prototype.restBeat = function(script) {
    const self = this;
    self.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isPlaying = true;
        self.__cancelNote();
        self.__cancelSound();
        let beat = script.getNumberValue('BEAT');

        const motoring = self.motoring;
        beat = parseFloat(beat);
        motoring.buzzer = 0;
        motoring.note = 0;
        self.__runSound(0);
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
};

HamsterSRobot.prototype.setTempo = function(script) {
    this.__setModule();
    let bpm = script.getNumberValue('BPM');

    bpm = parseFloat(bpm);
    if (typeof bpm == 'number') {
        this.tempo = bpm;
        if (this.tempo < 1) {
            this.tempo = 1;
        }
    }
    return script.callReturn();
};

HamsterSRobot.prototype.changeTempo = function(script) {
    this.__setModule();
    let bpm = script.getNumberValue('BPM');

    bpm = parseFloat(bpm);
    if (typeof bpm == 'number') {
        this.tempo += bpm;
        if (this.tempo < 1) {
            this.tempo = 1;
        }
    }
    return script.callReturn();
};

HamsterSRobot.prototype.__IO_MODES = {
    ANALOG_INPUT: 0,
    DIGITAL_INPUT: 1,
    DIGITAL_INPUT_PULL_UP: 2,
    DIGITAL_INPUT_PULL_DOWN: 3,
    VOLTAGE_INPUT: 5,
    SERVO_OUTPUT: 8,
    PWM_OUTPUT: 9,
    DIGITAL_OUTPUT: 10,
    '0': 0,
    '1': 1,
    '2': 2,
    '3': 3,
    '5': 5,
    '8': 8,
    '9': 9,
    '10': 10,
};

HamsterSRobot.prototype.setIoMode = function(script) {
    this.__setModule();
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
};

HamsterSRobot.prototype.setOutput = function(script) {
    this.__setModule();
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
};

HamsterSRobot.prototype.changeOutput = function(script) {
    this.__setModule();
    this.__cancelIo();

    const motoring = this.motoring;
    const port = script.getField('PORT');
    let value = script.getNumberValue('VALUE');

    value = parseFloat(value);
    if (typeof value == 'number') {
        if (port == 'A') {
            motoring.outputA = motoring.outputA != undefined ? motoring.outputA + value : value;
        } else if (port == 'B') {
            motoring.outputB = motoring.outputB != undefined ? motoring.outputB + value : value;
        } else {
            motoring.outputA = motoring.outputA != undefined ? motoring.outputA + value : value;
            motoring.outputB = motoring.outputB != undefined ? motoring.outputB + value : value;
        }
    }
    return script.callReturn();
};

HamsterSRobot.prototype.gripper = function(script) {
    const self = this;
    self.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isPlaying = true;
        self.__cancelIo();

        const id = self.__issueIoBlockId();
        const action = script.getField('ACTION');

        const motoring = this.motoring;
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
};

HamsterSRobot.prototype.releaseGripper = function(script) {
    this.__setModule();
    this.__cancelIo();

    const motoring = this.motoring;
    motoring.ioModeA = 10;
    motoring.ioModeB = 10;
    motoring.outputA = 0;
    motoring.outputB = 0;
    return script.callReturn();
};

HamsterSRobot.prototype.writeSerial = function(script) {
    const self = this;
    self.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isWriting = true;
        self.__cancelIo();

        const mode = script.getField('MODE');
        const text = script.getValue('STRING');

        const motoring = self.motoring;
        motoring.ioModeA = self.serialRate;
        motoring.ioModeB = self.serialRate;
        const queue = this.writeQueue;
        queue.push(text, mode != 'STRING');
        const data = queue.pop();
        if (data) {
            this.writeSerialCallbacks.push(() => {
                script.isWriting = false;
            });
            this.__setSerial(data);
        }
        return script;
    } else if (script.isWriting) {
        return script;
    } else {
        delete script.isStart;
        delete script.isWriting;
        Entry.engine.isContinue = false;
        return script.callReturn();
    }
};

HamsterSRobot.prototype.__SERIAL_DELIMITERS = {
    ALL: 0,
    COMMA: 0x2c,
    COLON: 0x3a,
    DOLLAR: 0x24,
    SHARP: 0x23,
    NEW_LINE: 0x0d,
};

HamsterSRobot.prototype.readSerialUntil = function(script) {
    const self = this;
    self.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isReading = true;
        self.__cancelIo();

        let delimiter = script.getField('DELIMITER');

        const motoring = self.motoring;
        motoring.ioModeA = self.serialRate;
        motoring.ioModeB = self.serialRate;
        delimiter = this.__SERIAL_DELIMITERS[delimiter];
        if (typeof delimiter == 'number') {
            this.serialDelimiter = delimiter;
            this.readSerialCallbacks.push(() => {
                script.isReading = false;
            });
        }
        return script;
    } else if (script.isReading) {
        return script;
    } else {
        delete script.isStart;
        delete script.isReading;
        Entry.engine.isContinue = false;
        return script.callReturn();
    }
};

HamsterSRobot.prototype.__SERIAL_BAUDS = {
    '9600': 176,
    '14400': 177,
    '19200': 178,
    '28800': 179,
    '38400': 180,
    '57600': 181,
    '76800': 182,
    '115200': 183,
};

HamsterSRobot.prototype.setSerialRate = function(script) {
    this.__setModule();
    this.__cancelIo();
    const baud = this.__SERIAL_BAUDS[script.getField('BAUD')];

    if (baud && baud > 0) {
        this.serialRate = baud;
        this.motoring.ioModeA = baud;
        this.motoring.ioModeB = baud;
    }
    return script.callReturn();
};

HamsterSRobot.prototype.getSerialInput = function(script) {
    this.__setModule();
    return this.serialInput;
};

/**TurtleRobot**/
function TurtleRobot(index) {
    this.sensory = {
        floor: 0,
        accelerationX: 0,
        accelerationY: 0,
        accelerationZ: 0,
        button: 0,
        colorNumber: -1,
        colorPattern: -1,
        tilt: 0,
        batteryState: 2,
    };
    this.motoring = {
        group: 'turtle',
        module: 'turtle',
        index,
    };
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
    this.blockId = 0;
    this.motionCallback = undefined;
    this.lineTracerCallback = undefined;
    this.soundCallback = undefined;
    this.noteBlockId = 0;
    this.noteTimer1 = undefined;
    this.noteTimer2 = undefined;
    this.clicked = false;
    this.doubleClicked = false;
    this.longPressed = false;
    this.colorPattern = -1;
    this.tempo = 60;
    this.timeouts = [];
}

TurtleRobot.prototype.__PORT_MAP = {
    group: 'turtle',
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
    motionRadius: 0,
};

TurtleRobot.prototype.setZero = function() {
    const portMap = this.__PORT_MAP;
    const motoring = this.motoring;
    for (const port in portMap) {
        motoring[port] = portMap[port];
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
    this.blockId = 0;
    this.motionCallback = undefined;
    this.lineTracerCallback = undefined;
    this.soundCallback = undefined;
    this.noteBlockId = 0;
    this.noteTimer1 = undefined;
    this.noteTimer2 = undefined;
    this.clicked = false;
    this.doubleClicked = false;
    this.longPressed = false;
    this.colorPattern = -1;
    this.tempo = 60;
    this.__removeAllTimeouts();
};

TurtleRobot.prototype.afterReceive = function(pd) {
    this.sensory = pd;
    this.handleSensory();
};

TurtleRobot.prototype.afterSend = function(sq) {
    this.clicked = false;
    this.doubleClicked = false;
    this.longPressed = false;
    this.colorPattern = -1;
};

TurtleRobot.prototype.setMotoring = function(motoring) {
    this.motoring = motoring;
};

TurtleRobot.prototype.__setModule = function() {
    this.motoring.group = 'turtle';
    this.motoring.module = 'turtle';
};

TurtleRobot.prototype.__removeTimeout = function(id) {
    clearTimeout(id);
    const idx = this.timeouts.indexOf(id);
    if (idx >= 0) {
        this.timeouts.splice(idx, 1);
    }
};

TurtleRobot.prototype.__removeAllTimeouts = function() {
    const timeouts = this.timeouts;
    for (const i in timeouts) {
        clearTimeout(timeouts[i]);
    }
    this.timeouts = [];
};

TurtleRobot.prototype.__setPulse = function(pulse) {
    this.pulseId = (this.pulseId % 255) + 1;
    this.motoring.pulse = pulse;
    this.motoring.pulseId = this.pulseId;
};

TurtleRobot.prototype.__setLineTracerMode = function(mode) {
    this.lineTracerModeId = (this.lineTracerModeId % 255) + 1;
    this.motoring.lineTracerMode = mode;
    this.motoring.lineTracerModeId = this.lineTracerModeId;
};

TurtleRobot.prototype.__cancelLineTracer = function() {
    this.lineTracerCallback = undefined;
};

TurtleRobot.prototype.__setMotion = function(type, unit, speed, value, radius) {
    this.motionId = (this.motionId % 255) + 1;
    const motoring = this.motoring;
    motoring.motionType = type;
    motoring.motionUnit = unit;
    motoring.motionSpeed = speed;
    motoring.motionValue = value;
    motoring.motionRadius = radius;
    motoring.motionId = this.motionId;
};

TurtleRobot.prototype.__cancelMotion = function() {
    this.motionCallback = undefined;
};

TurtleRobot.prototype.__runSound = function(sound, count) {
    if (typeof count != 'number') {
        count = 1;
    }
    if (count < 0) {
        count = -1;
    }
    if (count) {
        this.soundId = (this.soundId % 255) + 1;
        const motoring = this.motoring;
        motoring.sound = sound;
        motoring.soundRepeat = count;
        motoring.soundId = this.soundId;
    }
};

TurtleRobot.prototype.__cancelSound = function() {
    this.soundCallback = undefined;
};

TurtleRobot.prototype.__issueNoteBlockId = function() {
    this.noteBlockId = this.blockId = (this.blockId % 65535) + 1;
    return this.noteBlockId;
};

TurtleRobot.prototype.__cancelNote = function() {
    this.noteBlockId = 0;
    if (this.noteTimer1 !== undefined) {
        this.__removeTimeout(this.noteTimer1);
    }
    if (this.noteTimer2 !== undefined) {
        this.__removeTimeout(this.noteTimer2);
    }
    this.noteTimer1 = undefined;
    this.noteTimer2 = undefined;
};

TurtleRobot.prototype.handleSensory = function() {
    const self = this;
    const sensory = self.sensory;

    self.clicked = sensory.clicked == 1;
    self.doubleClicked = sensory.doubleClicked == 1;
    self.longPressed = sensory.longPressed == 1;
    self.colorPattern = sensory.colorPattern;

    if (self.lineTracerCallback) {
        if (sensory.lineTracerStateId != self.lineTracerStateId) {
            self.lineTracerStateId = sensory.lineTracerStateId;
            if (sensory.lineTracerState == 0x02) {
                self.__setLineTracerMode(0);
                var callback = self.lineTracerCallback;
                self.__cancelLineTracer();
                if (callback) {
                    callback();
                }
            }
        }
    }
    if (self.motionCallback) {
        if (sensory.wheelStateId != self.wheelStateId) {
            self.wheelStateId = sensory.wheelStateId;
            if (sensory.wheelState == 0) {
                self.motoring.leftWheel = 0;
                self.motoring.rightWheel = 0;
                var callback = self.motionCallback;
                self.__cancelMotion();
                if (callback) {
                    callback();
                }
            }
        }
    }
    if (self.soundCallback) {
        if (sensory.soundStateId != self.soundStateId) {
            self.soundStateId = sensory.soundStateId;
            if (sensory.soundState == 0) {
                var callback = self.soundCallback;
                self.__cancelSound();
                if (callback) {
                    callback();
                }
            }
        }
    }
};

TurtleRobot.prototype.getValue = function(script) {
    this.__setModule();
    const dev = script.getField('DEVICE');
    if (dev == 'colorPattern') {
        return this.colorPattern;
    } else {
        return this.sensory[dev];
    }
};

TurtleRobot.prototype.checkBoolean = function(script) {
    this.__setModule();
    const sensory = this.sensory;
    let value = 0;
    const dev = script.getField('DEVICE');
    if (dev.startsWith('TILT')) {
        if (sensory.tilt === undefined) {
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
        } else {
            value = sensory.tilt;
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
};

TurtleRobot.prototype.checkTouchingColor = function(script) {
    this.__setModule();
    const color = Number(script.getField('COLOR'));

    if (typeof color == 'number') {
        return this.sensory.colorNumber == color - 1;
    }
    return false;
};

TurtleRobot.prototype.checkColorPattern = function(script) {
    this.__setModule();
    const color1 = Number(script.getField('COLOR1'));
    const color2 = Number(script.getField('COLOR2'));

    if (typeof color1 == 'number' && typeof color2 == 'number') {
        return this.colorPattern == color1 * 10 + color2;
    }
    return false;
};

TurtleRobot.prototype.checkButtonState = function(script) {
    this.__setModule();
    const state = script.getField('STATE');
    switch (state) {
        case 'clicked':
            return this.clicked;
        case 'doubleClicked':
            return this.doubleClicked;
        case 'longPressed':
            return this.longPressed;
    }
    return false;
};

TurtleRobot.prototype.__motionUnit = function(type, unit, value, callback) {
    const motoring = this.motoring;
    this.__cancelLineTracer();
    this.__cancelMotion();

    motoring.leftWheel = 0;
    motoring.rightWheel = 0;
    this.__setPulse(0);
    value = parseFloat(value);
    if (value && value > 0) {
        this.__setMotion(type, unit, 0, value, 0); // type, unit, speed, value, radius
        this.motionCallback = callback;
        this.__setLineTracerMode(0);
    } else {
        this.__setMotion(0, 0, 0, 0, 0);
        this.__setLineTracerMode(0);
        callback();
    }
};

TurtleRobot.prototype.__motionUnitRadius = function(type, unit, value, radius, callback) {
    const motoring = this.motoring;
    this.__cancelLineTracer();
    this.__cancelMotion();

    motoring.leftWheel = 0;
    motoring.rightWheel = 0;
    this.__setPulse(0);
    value = parseFloat(value);
    radius = parseFloat(radius);
    if (value && value > 0 && typeof radius == 'number' && radius >= 0) {
        this.__setMotion(type, unit, 0, value, radius); // type, unit, speed, value, radius
        this.motionCallback = callback;
        this.__setLineTracerMode(0);
    } else {
        this.__setMotion(0, 0, 0, 0, 0);
        this.__setLineTracerMode(0);
        callback();
    }
};

TurtleRobot.prototype.__UNITS = {
    CM: 1,
    DEG: 1,
    SEC: 2,
    PULSE: 3,
};

TurtleRobot.prototype.moveForwardUnit = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isMoving = true;

        const value = script.getNumberValue('VALUE');
        const unit = script.getField('UNIT');

        if (value < 0) {
            this.__motionUnit(2, this.__UNITS[unit], -value, () => {
                script.isMoving = false;
            });
        } else {
            this.__motionUnit(1, this.__UNITS[unit], value, () => {
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
};

TurtleRobot.prototype.moveBackwardUnit = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isMoving = true;

        const value = script.getNumberValue('VALUE');
        const unit = script.getField('UNIT');

        if (value < 0) {
            this.__motionUnit(1, this.__UNITS[unit], -value, () => {
                script.isMoving = false;
            });
        } else {
            this.__motionUnit(2, this.__UNITS[unit], value, () => {
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
};

TurtleRobot.prototype.turnUnit = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isMoving = true;

        const direction = script.getField('DIRECTION');
        const value = script.getNumberValue('VALUE');
        const unit = script.getField('UNIT');

        if (direction == 'LEFT') {
            if (value < 0) {
                this.__motionUnit(4, this.__UNITS[unit], -value, () => {
                    script.isMoving = false;
                });
            } else {
                this.__motionUnit(3, this.__UNITS[unit], value, () => {
                    script.isMoving = false;
                });
            }
        } else {
            if (value < 0) {
                this.__motionUnit(3, this.__UNITS[unit], -value, () => {
                    script.isMoving = false;
                });
            } else {
                this.__motionUnit(4, this.__UNITS[unit], value, () => {
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
};

TurtleRobot.prototype.pivotUnit = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isMoving = true;

        const wheel = script.getField('WHEEL');
        const value = script.getNumberValue('VALUE');
        let unit = script.getField('UNIT');
        const toward = script.getField('TOWARD');

        unit = this.__UNITS[unit];
        if (wheel == 'LEFT') {
            if (toward == 'HEAD') {
                if (value < 0) {
                    this.__motionUnit(6, unit, -value, () => {
                        script.isMoving = false;
                    });
                } else {
                    this.__motionUnit(5, unit, value, () => {
                        script.isMoving = false;
                    });
                }
            } else {
                if (value < 0) {
                    this.__motionUnit(5, unit, -value, () => {
                        script.isMoving = false;
                    });
                } else {
                    this.__motionUnit(6, unit, value, () => {
                        script.isMoving = false;
                    });
                }
            }
        } else {
            if (toward == 'HEAD') {
                if (value < 0) {
                    this.__motionUnit(8, unit, -value, () => {
                        script.isMoving = false;
                    });
                } else {
                    this.__motionUnit(7, unit, value, () => {
                        script.isMoving = false;
                    });
                }
            } else {
                if (value < 0) {
                    this.__motionUnit(7, unit, -value, () => {
                        script.isMoving = false;
                    });
                } else {
                    this.__motionUnit(8, unit, value, () => {
                        script.isMoving = false;
                    });
                }
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
};

TurtleRobot.prototype.swingUnit = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isMoving = true;

        const direction = script.getField('DIRECTION');
        const value = script.getNumberValue('VALUE');
        let unit = script.getField('UNIT');
        const radius = script.getNumberValue('RADIUS');
        const toward = script.getField('TOWARD');

        unit = this.__UNITS[unit];
        if (direction == 'LEFT') {
            if (toward == 'HEAD') {
                if (value < 0) {
                    this.__motionUnitRadius(10, unit, -value, radius, () => {
                        script.isMoving = false;
                    });
                } else {
                    this.__motionUnitRadius(9, unit, value, radius, () => {
                        script.isMoving = false;
                    });
                }
            } else {
                if (value < 0) {
                    this.__motionUnitRadius(9, unit, -value, radius, () => {
                        script.isMoving = false;
                    });
                } else {
                    this.__motionUnitRadius(10, unit, value, radius, () => {
                        script.isMoving = false;
                    });
                }
            }
        } else {
            if (toward == 'HEAD') {
                if (value < 0) {
                    this.__motionUnitRadius(12, unit, -value, radius, () => {
                        script.isMoving = false;
                    });
                } else {
                    this.__motionUnitRadius(11, unit, value, radius, () => {
                        script.isMoving = false;
                    });
                }
            } else {
                if (value < 0) {
                    this.__motionUnitRadius(11, unit, -value, radius, () => {
                        script.isMoving = false;
                    });
                } else {
                    this.__motionUnitRadius(12, unit, value, radius, () => {
                        script.isMoving = false;
                    });
                }
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
};

TurtleRobot.prototype.setWheels = function(script) {
    const motoring = this.motoring;
    this.__setModule();
    this.__cancelLineTracer();
    this.__cancelMotion();

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
    this.__setPulse(0);
    this.__setMotion(0, 0, 0, 0, 0);
    this.__setLineTracerMode(0);
    return script.callReturn();
};

TurtleRobot.prototype.changeWheels = function(script) {
    const motoring = this.motoring;
    this.__setModule();
    this.__cancelLineTracer();
    this.__cancelMotion();

    let leftVelocity = script.getNumberValue('LEFT');
    let rightVelocity = script.getNumberValue('RIGHT');

    leftVelocity = parseFloat(leftVelocity);
    rightVelocity = parseFloat(rightVelocity);
    if (typeof leftVelocity == 'number') {
        motoring.leftWheel =
            motoring.leftWheel !== undefined ? motoring.leftWheel + leftVelocity : leftVelocity;
    }
    if (typeof rightVelocity == 'number') {
        motoring.rightWheel =
            motoring.rightWheel !== undefined ? motoring.rightWheel + rightVelocity : rightVelocity;
    }
    this.__setPulse(0);
    this.__setMotion(0, 0, 0, 0, 0);
    this.__setLineTracerMode(0);
    return script.callReturn();
};

TurtleRobot.prototype.setWheel = function(script) {
    const motoring = this.motoring;
    this.__setModule();
    this.__cancelLineTracer();
    this.__cancelMotion();

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
    this.__setPulse(0);
    this.__setMotion(0, 0, 0, 0, 0);
    this.__setLineTracerMode(0);
    return script.callReturn();
};

TurtleRobot.prototype.changeWheel = function(script) {
    const motoring = this.motoring;
    this.__setModule();
    this.__cancelLineTracer();
    this.__cancelMotion();

    const wheel = script.getField('WHEEL');
    let velocity = script.getNumberValue('VELOCITY');

    velocity = parseFloat(velocity);
    if (typeof velocity == 'number') {
        if (wheel == 'LEFT') {
            motoring.leftWheel =
                motoring.leftWheel != undefined ? motoring.leftWheel + velocity : velocity;
        } else if (wheel == 'RIGHT') {
            motoring.rightWheel =
                motoring.rightWheel != undefined ? motoring.rightWheel + velocity : velocity;
        } else {
            motoring.leftWheel =
                motoring.leftWheel != undefined ? motoring.leftWheel + velocity : velocity;
            motoring.rightWheel =
                motoring.rightWheel != undefined ? motoring.rightWheel + velocity : velocity;
        }
    }
    this.__setPulse(0);
    this.__setMotion(0, 0, 0, 0, 0);
    this.__setLineTracerMode(0);
    return script.callReturn();
};

TurtleRobot.prototype.followLine = function(script) {
    this.__setModule();
    this.__cancelLineTracer();
    this.__cancelMotion();

    const mode = Number(script.getField('COLOR'));

    const motoring = this.motoring;
    motoring.leftWheel = 0;
    motoring.rightWheel = 0;
    this.__setPulse(0);
    this.__setMotion(0, 0, 0, 0, 0);
    this.__setLineTracerMode(mode);
    return script.callReturn();
};

TurtleRobot.prototype.followLineUntil = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isMoving = true;
        this.__cancelMotion();

        const mode = Number(script.getField('COLOR'));

        const motoring = this.motoring;
        motoring.leftWheel = 0;
        motoring.rightWheel = 0;
        this.__setPulse(0);
        this.__setMotion(0, 0, 0, 0, 0);
        this.__setLineTracerMode(mode);
        this.lineTracerCallback = function() {
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
};

TurtleRobot.prototype.followLineUntilBlack = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isMoving = true;
        this.__cancelMotion();

        const mode = Number(script.getField('COLOR'));

        const motoring = this.motoring;
        motoring.leftWheel = 0;
        motoring.rightWheel = 0;
        this.__setPulse(0);
        this.__setMotion(0, 0, 0, 0, 0);
        this.__setLineTracerMode(mode);
        this.lineTracerCallback = function() {
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
};

TurtleRobot.prototype.crossIntersection = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isMoving = true;
        this.__cancelMotion();

        const motoring = this.motoring;
        motoring.leftWheel = 0;
        motoring.rightWheel = 0;
        this.__setPulse(0);
        this.__setMotion(0, 0, 0, 0, 0);
        this.__setLineTracerMode(40);
        this.lineTracerCallback = function() {
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
};

TurtleRobot.prototype.turnAtIntersection = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isMoving = true;
        this.__cancelMotion();

        const mode = Number(script.getField('DIRECTION'));

        const motoring = this.motoring;
        motoring.leftWheel = 0;
        motoring.rightWheel = 0;
        this.__setPulse(0);
        this.__setMotion(0, 0, 0, 0, 0);
        this.__setLineTracerMode(mode);
        this.lineTracerCallback = function() {
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
};

TurtleRobot.prototype.setLineTracerSpeed = function(script) {
    this.__setModule();
    let speed = Number(script.getField('SPEED'));

    speed = parseInt(speed);
    if (typeof speed == 'number') {
        this.motoring.lineTracerSpeed = speed;
        this.motoring.lineTracerGain = speed;
    }
    return script.callReturn();
};

TurtleRobot.prototype.stop = function(script) {
    this.__setModule();
    this.__cancelLineTracer();
    this.__cancelMotion();

    const motoring = this.motoring;
    motoring.leftWheel = 0;
    motoring.rightWheel = 0;
    this.__setPulse(0);
    this.__setMotion(0, 0, 0, 0, 0);
    this.__setLineTracerMode(0);
    return script.callReturn();
};

TurtleRobot.prototype.__RGB_COLORS = {
    RED: [255, 0, 0],
    ORANGE: [255, 63, 0],
    YELLOW: [255, 255, 0],
    GREEN: [0, 255, 0],
    CYAN: [0, 255, 255],
    BLUE: [0, 0, 255],
    VIOLET: [63, 0, 255],
    MAGENTA: [255, 0, 255],
    WHITE: [255, 255, 255],
};

TurtleRobot.prototype.setHeadColor = function(script) {
    this.__setModule();
    const color = script.getField('COLOR');

    const rgb = this.__RGB_COLORS[color];
    if (rgb) {
        const motoring = this.motoring;
        motoring.ledRed = rgb[0];
        motoring.ledGreen = rgb[1];
        motoring.ledBlue = rgb[2];
    }
    return script.callReturn();
};

TurtleRobot.prototype.pickHeadColor = function(script) {
    this.__setModule();
    const color = script.getField('COLOR');

    const motoring = this.motoring;
    motoring.ledRed = parseInt(color.slice(1, 3), 16);
    motoring.ledGreen = parseInt(color.slice(3, 5), 16);
    motoring.ledBlue = parseInt(color.slice(5, 7), 16);
    return script.callReturn();
};

TurtleRobot.prototype.setHeadRgb = function(script) {
    this.__setModule();
    let red = script.getNumberValue('RED');
    let green = script.getNumberValue('GREEN');
    let blue = script.getNumberValue('BLUE');

    red = parseInt(red);
    green = parseInt(green);
    blue = parseInt(blue);
    const motoring = this.motoring;
    if (typeof red == 'number') {
        motoring.ledRed = red;
    }
    if (typeof green == 'number') {
        motoring.ledGreen = green;
    }
    if (typeof blue == 'number') {
        motoring.ledBlue = blue;
    }
    return script.callReturn();
};

TurtleRobot.prototype.changeHeadRgb = function(script) {
    this.__setModule();
    let red = script.getNumberValue('RED');
    let green = script.getNumberValue('GREEN');
    let blue = script.getNumberValue('BLUE');

    red = parseInt(red);
    green = parseInt(green);
    blue = parseInt(blue);
    const motoring = this.motoring;
    if (typeof red == 'number') {
        motoring.ledRed = motoring.ledRed != undefined ? motoring.ledRed + red : red;
    }
    if (typeof green == 'number') {
        motoring.ledGreen = motoring.ledGreen != undefined ? motoring.ledGreen + green : green;
    }
    if (typeof blue == 'number') {
        motoring.ledBlue = motoring.ledBlue != undefined ? motoring.ledBlue + blue : blue;
    }
    return script.callReturn();
};

TurtleRobot.prototype.clearHead = function(script) {
    this.__setModule();
    const motoring = this.motoring;
    motoring.ledRed = 0;
    motoring.ledGreen = 0;
    motoring.ledBlue = 0;
    return script.callReturn();
};

TurtleRobot.prototype.playSound = function(script) {
    this.__setModule();
    this.__cancelNote();
    this.__cancelSound();

    const sound = Number(script.getField('SOUND'));
    let count = script.getNumberValue('COUNT');

    count = parseInt(count);
    this.motoring.buzzer = 0;
    this.motoring.note = 0;
    if (sound && count) {
        this.__runSound(sound, count);
    } else {
        this.__runSound(0);
    }
    return script.callReturn();
};

TurtleRobot.prototype.playSoundUntil = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isPlaying = true;
        this.__cancelNote();
        this.__cancelSound();

        const sound = Number(script.getField('SOUND'));
        let count = script.getNumberValue('COUNT');

        count = parseInt(count);
        this.motoring.buzzer = 0;
        this.motoring.note = 0;
        if (sound && count) {
            this.__runSound(sound, count);
            this.soundCallback = function() {
                script.isPlaying = false;
            };
        } else {
            this.__runSound(0);
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
};

TurtleRobot.prototype.setBuzzer = function(script) {
    this.__setModule();
    this.__cancelNote();
    this.__cancelSound();

    let hz = script.getNumberValue('HZ');

    hz = parseFloat(hz);
    if (typeof hz == 'number') {
        this.motoring.buzzer = hz;
    }
    this.motoring.note = 0;
    this.__runSound(0);
    return script.callReturn();
};

TurtleRobot.prototype.changeBuzzer = function(script) {
    this.__setModule();
    this.__cancelNote();
    this.__cancelSound();

    let hz = script.getNumberValue('HZ');

    const motoring = this.motoring;
    hz = parseFloat(hz);
    if (typeof hz == 'number') {
        motoring.buzzer = motoring.buzzer != undefined ? motoring.buzzer + hz : hz;
    }
    motoring.note = 0;
    this.__runSound(0);
    return script.callReturn();
};

TurtleRobot.prototype.clearSound = function(script) {
    this.__setModule();
    this.__cancelNote();
    this.__cancelSound();
    this.motoring.buzzer = 0;
    this.motoring.note = 0;
    this.__runSound(0);
    return script.callReturn();
};

TurtleRobot.prototype.playNote = function(script) {
    this.__setModule();
    this.__cancelNote();
    this.__cancelSound();

    const note = script.getNumberField('NOTE');
    let octave = script.getNumberField('OCTAVE');

    octave = parseInt(octave);
    const motoring = this.motoring;
    motoring.buzzer = 0;
    if (note && octave && octave > 0 && octave < 8) {
        motoring.note = note + (octave - 1) * 12;
    } else {
        motoring.note = 0;
    }
    this.__runSound(0);
    return script.callReturn();
};

TurtleRobot.prototype.playNoteBeat = function(script) {
    const self = this;
    self.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isPlaying = true;
        self.__cancelNote();
        self.__cancelSound();

        const motoring = self.motoring;
        let note = script.getNumberField('NOTE');
        let octave = script.getNumberField('OCTAVE');
        let beat = script.getNumberValue('BEAT');

        octave = parseInt(octave);
        beat = parseFloat(beat);
        motoring.buzzer = 0;
        if (note && octave && octave > 0 && octave < 8 && beat && beat > 0 && self.tempo > 0) {
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
            self.__runSound(0);
            return script;
        } else {
            motoring.note = 0;
            self.__runSound(0);
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
};

TurtleRobot.prototype.restBeat = function(script) {
    const self = this;
    self.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isPlaying = true;
        self.__cancelNote();
        self.__cancelSound();

        const motoring = self.motoring;
        let beat = script.getNumberValue('BEAT');

        beat = parseFloat(beat);
        motoring.buzzer = 0;
        motoring.note = 0;
        self.__runSound(0);
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
            return script;
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
};

TurtleRobot.prototype.setTempo = function(script) {
    this.__setModule();
    let bpm = script.getNumberValue('BPM');

    bpm = parseFloat(bpm);
    if (typeof bpm == 'number') {
        this.tempo = bpm;
        if (this.tempo < 1) {
            this.tempo = 1;
        }
    }
    return script.callReturn();
};

TurtleRobot.prototype.changeTempo = function(script) {
    this.__setModule();
    let bpm = script.getNumberValue('BPM');

    bpm = parseFloat(bpm);
    if (typeof bpm == 'number') {
        this.tempo += bpm;
        if (this.tempo < 1) {
            this.tempo = 1;
        }
    }
    return script.callReturn();
};

/**LineRobot**/
function LineRobot(index, module) {
    this.sensory = {
        signalStrength: 0,
        colorRed: 0,
        colorGreen: 0,
        colorBlue: 0,
        floor: 0,
        accelerationX: 0,
        accelerationY: 0,
        accelerationZ: 0,
        temperature: 0,
        button: 0,
        colorNumber: -1,
        colorPattern: -1,
        pulseCount: 0,
        tilt: 0,
        batteryState: 2,
    };
    this.motoring = {
        group: 'line',
        module: module,
        index,
    };
    this.module = module;
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
    this.freeFallId = -1;
    this.tapId = -1;
    this.blockId = 0;
    this.motionCallback = undefined;
    this.lineTracerCallback = undefined;
    this.soundCallback = undefined;
    this.noteBlockId = 0;
    this.noteTimer1 = undefined;
    this.noteTimer2 = undefined;
    this.clicked = false;
    this.doubleClicked = false;
    this.longPressed = false;
    this.colorPattern = -1;
    this.freeFall = false;
    this.tap = false;
    this.tempo = 60;
    this.timeouts = [];
}

LineRobot.prototype.__PORT_MAP = {
    group: 'line',
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
    lineTracerSpeed: 4,
    motionId: 0,
    motionType: 0,
    motionUnit: 0,
    motionSpeed: 0,
    motionValue: 0,
    motionRadius: 0,
};

LineRobot.prototype.setZero = function() {
    const portMap = this.__PORT_MAP;
    const motoring = this.motoring;
    for (const port in portMap) {
        motoring[port] = portMap[port];
    }
    motoring.module = this.module;
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
    this.freeFallId = -1;
    this.tapId = -1;
    this.blockId = 0;
    this.motionCallback = undefined;
    this.lineTracerCallback = undefined;
    this.soundCallback = undefined;
    this.noteBlockId = 0;
    this.noteTimer1 = undefined;
    this.noteTimer2 = undefined;
    this.clicked = false;
    this.doubleClicked = false;
    this.longPressed = false;
    this.colorPattern = -1;
    this.freeFall = false;
    this.tap = false;
    this.tempo = 60;
    this.__removeAllTimeouts();
};

LineRobot.prototype.afterReceive = function(pd) {
    this.sensory = pd;
    this.handleSensory();
};

LineRobot.prototype.afterSend = function(sq) {
    this.clicked = false;
    this.doubleClicked = false;
    this.longPressed = false;
    this.colorPattern = -1;
    this.freeFall = false;
    this.tap = false;
};

LineRobot.prototype.setMotoring = function(motoring) {
    this.motoring = motoring;
};

LineRobot.prototype.__setModule = function() {
    this.motoring.group = 'line';
    this.motoring.module = this.module;
};

LineRobot.prototype.__removeTimeout = function(id) {
    clearTimeout(id);
    const idx = this.timeouts.indexOf(id);
    if (idx >= 0) {
        this.timeouts.splice(idx, 1);
    }
};

LineRobot.prototype.__removeAllTimeouts = function() {
    const timeouts = this.timeouts;
    for (const i in timeouts) {
        clearTimeout(timeouts[i]);
    }
    this.timeouts = [];
};

LineRobot.prototype.__setPulse = function(pulse) {
    this.pulseId = (this.pulseId % 255) + 1;
    this.motoring.pulse = pulse;
    this.motoring.pulseId = this.pulseId;
};

LineRobot.prototype.__setLineTracerMode = function(mode) {
    this.lineTracerModeId = (this.lineTracerModeId % 255) + 1;
    this.motoring.lineTracerMode = mode;
    this.motoring.lineTracerModeId = this.lineTracerModeId;
};

LineRobot.prototype.__cancelLineTracer = function() {
    this.lineTracerCallback = undefined;
};

LineRobot.prototype.__setMotion = function(type, unit, speed, value, radius) {
    this.motionId = (this.motionId % 255) + 1;
    const motoring = this.motoring;
    motoring.motionType = type;
    motoring.motionUnit = unit;
    motoring.motionSpeed = speed;
    motoring.motionValue = value;
    motoring.motionRadius = radius;
    motoring.motionId = this.motionId;
};

LineRobot.prototype.__cancelMotion = function() {
    this.motionCallback = undefined;
};

LineRobot.prototype.__runSound = function(sound, count) {
    if(typeof count != 'number') count = 1;
    if(count < 0) count = -1;
    if(count) {
        this.soundId = (this.soundId % 255) + 1;
        const motoring = this.motoring;
        motoring.sound = sound;
        motoring.soundRepeat = count;
        motoring.soundId = this.soundId;
    }
};

LineRobot.prototype.__cancelSound = function() {
    this.soundCallback = undefined;
};

LineRobot.prototype.__issueNoteBlockId = function() {
    this.noteBlockId = this.blockId = (this.blockId % 65535) + 1;
    return this.noteBlockId;
};

LineRobot.prototype.__cancelNote = function() {
    this.noteBlockId = 0;
    if (this.noteTimer1 !== undefined) {
        this.__removeTimeout(this.noteTimer1);
    }
    if (this.noteTimer2 !== undefined) {
        this.__removeTimeout(this.noteTimer2);
    }
    this.noteTimer1 = undefined;
    this.noteTimer2 = undefined;
};

LineRobot.prototype.handleSensory = function() {
    const self = this;
    const sensory = self.sensory;
    
    self.clicked = sensory.clicked == 1;
    self.doubleClicked = sensory.doubleClicked == 1;
    self.longPressed = sensory.longPressed == 1;
    self.colorPattern = sensory.colorPattern;
    self.freeFall = sensory.freeFall == 1;
    self.tap = sensory.tap == 1;

    if(self.lineTracerCallback) {
        if(sensory.lineTracerStateId != self.lineTracerStateId) {
            self.lineTracerStateId = sensory.lineTracerStateId;
            if(sensory.lineTracerState == 0x02) {
                self.__setLineTracerMode(0);
                var callback = self.lineTracerCallback;
                self.__cancelLineTracer();
                if(callback) callback();
            }
        }
    }
    if(self.motionCallback) {
        if(sensory.wheelStateId != self.wheelStateId) {
            self.wheelStateId = sensory.wheelStateId;
            if(sensory.wheelState == 0) {
                self.motoring.leftWheel = 0;
                self.motoring.rightWheel = 0;
                var callback = self.motionCallback;
                self.__cancelMotion();
                if(callback) callback();
            }
        }
    }
    if(self.soundCallback) {
        if(sensory.soundStateId != self.soundStateId) {
            self.soundStateId = sensory.soundStateId;
            if(sensory.soundState == 0) {
                var callback = self.soundCallback;
                self.__cancelSound();
                if(callback) callback();
            }
        }
    }
};

LineRobot.prototype.__SENSORS = {
    SIGNAL_STRENGTH: 'signalStrength',
    COLOR_R: 'colorRed',
    COLOR_G: 'colorGreen',
    COLOR_B: 'colorBlue',
    FLOOR: 'floor',
    ACCELERATION_X: 'accelerationX',
    ACCELERATION_Y: 'accelerationY',
    ACCELERATION_Z: 'accelerationZ',
    TEMPERATURE: 'temperature',
    BUTTON: 'button',
    COLOR_NUMBER: 'colorNumber',
};

LineRobot.prototype.getValue = function(script) {
    this.__setModule();
    const dev = script.getField('DEVICE');
    
    if(dev == 'COLOR_PATTERN') {
        return this.colorPattern;
    } else {
        const sensor = this.__SENSORS[dev] || dev;
        return this.sensory[sensor];
    }
};

LineRobot.prototype.checkBoolean = function(script) {
    this.__setModule();
    const dev = script.getField('DEVICE');
    
    const sensory = this.sensory;
    switch(dev) {
        case 'TILT_FORWARD': return sensory.tilt == 1;
        case 'TILT_BACKWARD': return sensory.tilt == -1;
        case 'TILT_LEFT': return sensory.tilt == 2;
        case 'TILT_RIGHT': return sensory.tilt == -2;
        case 'TILT_FLIP': return sensory.tilt == 3;
        case 'TILT_NOT': return sensory.tilt == -3;
        case 'FREE_FALL': return this.freeFall;
        case 'TAP': return this.tap;
        case 'BATTERY_NORMAL': return sensory.batteryState === 2;
        case 'BATTERY_LOW': return sensory.batteryState === 1;
        case 'BATTERY_EMPTY': return sensory.batteryState === 0;
    }
    return false;
};

LineRobot.prototype.__TOUCHING_COLORS = {
    RED: 1,
    ORANGE: 7,
    YELLOW: 2,
    GREEN: 3,
    SKY_BLUE: 4,
    BLUE: 5,
    PURPLE: 6,
    BLACK: 0,
    WHITE: 8,
};

LineRobot.prototype.checkTouchingColor = function(script) {
    this.__setModule();
    const color = this.__TOUCHING_COLORS[script.getField('COLOR')];

    if(typeof color == 'number') {
        return this.sensory.colorNumber == color;
    }
    return false;
};

LineRobot.prototype.__PATTERN_COLORS = {
	BLACK: 0,
	RED: 1,
	YELLOW: 2,
	GREEN: 3,
	SKY_BLUE: 4,
	BLUE: 5,
	PURPLE: 6
};

LineRobot.prototype.checkColorPattern = function(script) {
    this.__setModule();
    const color1 = this.__TOUCHING_COLORS[script.getField('COLOR1')];
    const color2 = this.__TOUCHING_COLORS[script.getField('COLOR2')];

    if((typeof color1 == 'number') && (typeof color2 == 'number')) {
        return this.colorPattern == color1 * 10 + color2;
    }
    return false;
};

LineRobot.prototype.checkButtonState = function(script) {
    this.__setModule();
    const state = script.getField('STATE');
    
    switch(state) {
        case 'CLICKED': return this.clicked;
        case 'DOUBLE_CLICKED': return this.doubleClicked;
        case 'LONG_PRESSED': return this.longPressed;
    }
    return false;
};

LineRobot.prototype.__motionUnit = function(type, unit, value, callback) {
    const motoring = this.motoring;
    this.__cancelLineTracer();
    this.__cancelMotion();

    motoring.leftWheel = 0;
    motoring.rightWheel = 0;
    this.__setPulse(0);
    value = parseFloat(value);
    if (value && value > 0) {
        this.__setMotion(type, unit, 0, value, 0); // type, unit, speed, value, radius
        this.motionCallback = callback;
        this.__setLineTracerMode(0);
    } else {
        this.__setMotion(0, 0, 0, 0, 0);
        this.__setLineTracerMode(0);
        callback();
    }
};

LineRobot.prototype.__motionUnitRadius = function(type, unit, value, radius, callback) {
    const motoring = this.motoring;
    this.__cancelLineTracer();
    this.__cancelMotion();

    motoring.leftWheel = 0;
    motoring.rightWheel = 0;
    this.__setPulse(0);
    value = parseFloat(value);
    radius = parseFloat(radius);
    if (value && value > 0 && typeof radius == 'number' && radius >= 0) {
        this.__setMotion(type, unit, 0, value, radius); // type, unit, speed, value, radius
        this.motionCallback = callback;
        this.__setLineTracerMode(0);
    } else {
        this.__setMotion(0, 0, 0, 0, 0);
        this.__setLineTracerMode(0);
        callback();
    }
};

LineRobot.prototype.__UNITS = {
    CM: 1,
    DEG: 1,
    SEC: 2,
    PULSE: 3,
};

LineRobot.prototype.moveForwardUnit = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isMoving = true;

        const value = script.getNumberValue('VALUE');
        const unit = script.getField('UNIT');

        if (value < 0) {
            this.__motionUnit(2, this.__UNITS[unit], -value, () => {
                script.isMoving = false;
            });
        } else {
            this.__motionUnit(1, this.__UNITS[unit], value, () => {
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
};

LineRobot.prototype.moveBackwardUnit = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isMoving = true;

        const value = script.getNumberValue('VALUE');
        const unit = script.getField('UNIT');

        if (value < 0) {
            this.__motionUnit(1, this.__UNITS[unit], -value, () => {
                script.isMoving = false;
            });
        } else {
            this.__motionUnit(2, this.__UNITS[unit], value, () => {
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
};

LineRobot.prototype.turnUnit = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isMoving = true;

        const direction = script.getField('DIRECTION');
        const value = script.getNumberValue('VALUE');
        const unit = script.getField('UNIT');

        if (direction == 'LEFT') {
            if (value < 0) {
                this.__motionUnit(4, this.__UNITS[unit], -value, () => {
                    script.isMoving = false;
                });
            } else {
                this.__motionUnit(3, this.__UNITS[unit], value, () => {
                    script.isMoving = false;
                });
            }
        } else {
            if (value < 0) {
                this.__motionUnit(3, this.__UNITS[unit], -value, () => {
                    script.isMoving = false;
                });
            } else {
                this.__motionUnit(4, this.__UNITS[unit], value, () => {
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
};

LineRobot.prototype.pivotUnit = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isMoving = true;

        const wheel = script.getField('WHEEL');
        const value = script.getNumberValue('VALUE');
        let unit = script.getField('UNIT');
        const toward = script.getField('TOWARD');

        unit = this.__UNITS[unit];
        if (wheel == 'LEFT') {
            if (toward == 'FORWARD') {
                if (value < 0) {
                    this.__motionUnit(6, unit, -value, () => {
                        script.isMoving = false;
                    });
                } else {
                    this.__motionUnit(5, unit, value, () => {
                        script.isMoving = false;
                    });
                }
            } else {
                if (value < 0) {
                    this.__motionUnit(5, unit, -value, () => {
                        script.isMoving = false;
                    });
                } else {
                    this.__motionUnit(6, unit, value, () => {
                        script.isMoving = false;
                    });
                }
            }
        } else {
            if (toward == 'FORWARD') {
                if (value < 0) {
                    this.__motionUnit(8, unit, -value, () => {
                        script.isMoving = false;
                    });
                } else {
                    this.__motionUnit(7, unit, value, () => {
                        script.isMoving = false;
                    });
                }
            } else {
                if (value < 0) {
                    this.__motionUnit(7, unit, -value, () => {
                        script.isMoving = false;
                    });
                } else {
                    this.__motionUnit(8, unit, value, () => {
                        script.isMoving = false;
                    });
                }
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
};

LineRobot.prototype.circleUnit = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isMoving = true;

        const direction = script.getField('DIRECTION');
        const value = script.getNumberValue('VALUE');
        let unit = script.getField('UNIT');
        const radius = script.getNumberValue('RADIUS');
        const toward = script.getField('TOWARD');

        unit = this.__UNITS[unit];
        if (direction == 'LEFT') {
            if (toward == 'FORWARD') {
                if (value < 0) {
                    this.__motionUnitRadius(10, unit, -value, radius, () => {
                        script.isMoving = false;
                    });
                } else {
                    this.__motionUnitRadius(9, unit, value, radius, () => {
                        script.isMoving = false;
                    });
                }
            } else {
                if (value < 0) {
                    this.__motionUnitRadius(9, unit, -value, radius, () => {
                        script.isMoving = false;
                    });
                } else {
                    this.__motionUnitRadius(10, unit, value, radius, () => {
                        script.isMoving = false;
                    });
                }
            }
        } else {
            if (toward == 'FORWARD') {
                if (value < 0) {
                    this.__motionUnitRadius(12, unit, -value, radius, () => {
                        script.isMoving = false;
                    });
                } else {
                    this.__motionUnitRadius(11, unit, value, radius, () => {
                        script.isMoving = false;
                    });
                }
            } else {
                if (value < 0) {
                    this.__motionUnitRadius(11, unit, -value, radius, () => {
                        script.isMoving = false;
                    });
                } else {
                    this.__motionUnitRadius(12, unit, value, radius, () => {
                        script.isMoving = false;
                    });
                }
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
};

LineRobot.prototype.setWheels = function(script) {
    const motoring = this.motoring;
    this.__setModule();
    this.__cancelLineTracer();
    this.__cancelMotion();

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
    this.__setPulse(0);
    this.__setMotion(0, 0, 0, 0, 0);
    this.__setLineTracerMode(0);
    return script.callReturn();
};

LineRobot.prototype.changeWheels = function(script) {
    const motoring = this.motoring;
    this.__setModule();
    this.__cancelLineTracer();
    this.__cancelMotion();

    let leftVelocity = script.getNumberValue('LEFT');
    let rightVelocity = script.getNumberValue('RIGHT');

    leftVelocity = parseFloat(leftVelocity);
    rightVelocity = parseFloat(rightVelocity);
    if (typeof leftVelocity == 'number') {
        motoring.leftWheel =
            motoring.leftWheel !== undefined ? motoring.leftWheel + leftVelocity : leftVelocity;
    }
    if (typeof rightVelocity == 'number') {
        motoring.rightWheel =
            motoring.rightWheel !== undefined ? motoring.rightWheel + rightVelocity : rightVelocity;
    }
    this.__setPulse(0);
    this.__setMotion(0, 0, 0, 0, 0);
    this.__setLineTracerMode(0);
    return script.callReturn();
};

LineRobot.prototype.setWheel = function(script) {
    const motoring = this.motoring;
    this.__setModule();
    this.__cancelLineTracer();
    this.__cancelMotion();

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
    this.__setPulse(0);
    this.__setMotion(0, 0, 0, 0, 0);
    this.__setLineTracerMode(0);
    return script.callReturn();
};

LineRobot.prototype.changeWheel = function(script) {
    const motoring = this.motoring;
    this.__setModule();
    this.__cancelLineTracer();
    this.__cancelMotion();

    const wheel = script.getField('WHEEL');
    let velocity = script.getNumberValue('VELOCITY');

    velocity = parseFloat(velocity);
    if (typeof velocity == 'number') {
        if (wheel == 'LEFT') {
            motoring.leftWheel =
                motoring.leftWheel != undefined ? motoring.leftWheel + velocity : velocity;
        } else if (wheel == 'RIGHT') {
            motoring.rightWheel =
                motoring.rightWheel != undefined ? motoring.rightWheel + velocity : velocity;
        } else {
            motoring.leftWheel =
                motoring.leftWheel != undefined ? motoring.leftWheel + velocity : velocity;
            motoring.rightWheel =
                motoring.rightWheel != undefined ? motoring.rightWheel + velocity : velocity;
        }
    }
    this.__setPulse(0);
    this.__setMotion(0, 0, 0, 0, 0);
    this.__setLineTracerMode(0);
    return script.callReturn();
};

LineRobot.prototype.followLine = function(script) {
    this.__setModule();
    this.__cancelLineTracer();
    this.__cancelMotion();

    const motoring = this.motoring;
    motoring.leftWheel = 0;
    motoring.rightWheel = 0;
    this.__setPulse(0);
    this.__setMotion(0, 0, 0, 0, 0);
    this.__setLineTracerMode(1); // LINE_TRACER_MODE_FOLLOW
    return script.callReturn();
};

LineRobot.prototype.followLineUntil = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isMoving = true;
        this.__cancelMotion();

        let mode = 2; // LINE_TRACER_MODE_UNTIL_ANY
        switch(script.getField('COLOR')) {
            case 'RED': mode = 10; break;
            case 'YELLOW': mode = 11; break;
            case 'GREEN': mode = 12; break;
            case 'SKY_BLUE': mode = 13; break;
            case 'BLUE': mode = 14; break;
            case 'PURPLE': mode = 15; break;
        }
        const motoring = this.motoring;
        motoring.leftWheel = 0;
        motoring.rightWheel = 0;
        this.__setPulse(0);
        this.__setMotion(0, 0, 0, 0, 0);
        this.__setLineTracerMode(mode);
        this.lineTracerCallback = function() {
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
};

LineRobot.prototype.crossIntersection = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isMoving = true;
        this.__cancelMotion();

        const motoring = this.motoring;
        motoring.leftWheel = 0;
        motoring.rightWheel = 0;
        this.__setPulse(0);
        this.__setMotion(0, 0, 0, 0, 0);
        this.__setLineTracerMode(3); // LINE_TRACER_MODE_MOVE_FORWARD
        this.lineTracerCallback = function() {
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
};

LineRobot.prototype.turnAtIntersection = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isMoving = true;
        this.__cancelMotion();

        let mode = 4; // LINE_TRACER_MODE_TURN_LEFT
        switch(script.getField('DIRECTION')) {
            case 'RIGHT': mode = 5; break;
            case 'BACK': mode = 6; break;
        }

        const motoring = this.motoring;
        motoring.leftWheel = 0;
        motoring.rightWheel = 0;
        this.__setPulse(0);
        this.__setMotion(0, 0, 0, 0, 0);
        this.__setLineTracerMode(mode);
        this.lineTracerCallback = function() {
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
};

LineRobot.prototype.jumpLine = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isMoving = true;
        this.__cancelMotion();

        let mode = 7; // LINE_TRACER_MODE_JUMP_LEFT
        if(script.getField('DIRECTION') == 'RIGHT') mode = 8;

        const motoring = this.motoring;
        motoring.leftWheel = 0;
        motoring.rightWheel = 0;
        this.__setPulse(0);
        this.__setMotion(0, 0, 0, 0, 0);
        this.__setLineTracerMode(mode);
        this.lineTracerCallback = function() {
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
};

LineRobot.prototype.setLineTracerSpeed = function(script) {
    this.__setModule();
    let speed = Number(script.getField('SPEED'));

    speed = parseInt(speed);
    if (typeof speed == 'number') {
        this.motoring.lineTracerSpeed = speed;
    }
    return script.callReturn();
};

LineRobot.prototype.stop = function(script) {
    this.__setModule();
    this.__cancelLineTracer();
    this.__cancelMotion();

    const motoring = this.motoring;
    motoring.leftWheel = 0;
    motoring.rightWheel = 0;
    this.__setPulse(0);
    this.__setMotion(0, 0, 0, 0, 0);
    this.__setLineTracerMode(0);
    return script.callReturn();
};

LineRobot.prototype.__RGB_COLORS = {
    RED: [255, 0, 0],
    ORANGE: [255, 63, 0],
    YELLOW: [255, 255, 0],
    GREEN: [0, 255, 0],
    SKY_BLUE: [0, 255, 255],
    BLUE: [0, 0, 255],
    VIOLET: [63, 0, 255],
    PURPLE: [255, 0, 255],
    WHITE: [255, 255, 255],
};

LineRobot.prototype.setLedColor = function(script) {
    this.__setModule();
    const color = script.getField('COLOR');

    const rgb = this.__RGB_COLORS[color];
    if (rgb) {
        const motoring = this.motoring;
        motoring.ledRed = rgb[0];
        motoring.ledGreen = rgb[1];
        motoring.ledBlue = rgb[2];
    }
    return script.callReturn();
};

LineRobot.prototype.pickLedColor = function(script) {
    this.__setModule();
    const color = script.getField('COLOR');

    const motoring = this.motoring;
    motoring.ledRed = parseInt(color.slice(1, 3), 16);
    motoring.ledGreen = parseInt(color.slice(3, 5), 16);
    motoring.ledBlue = parseInt(color.slice(5, 7), 16);
    return script.callReturn();
};

LineRobot.prototype.setLedRgb = function(script) {
    this.__setModule();
    let red = script.getNumberValue('RED');
    let green = script.getNumberValue('GREEN');
    let blue = script.getNumberValue('BLUE');

    red = parseInt(red);
    green = parseInt(green);
    blue = parseInt(blue);
    const motoring = this.motoring;
    if (typeof red == 'number') {
        motoring.ledRed = red;
    }
    if (typeof green == 'number') {
        motoring.ledGreen = green;
    }
    if (typeof blue == 'number') {
        motoring.ledBlue = blue;
    }
    return script.callReturn();
};

LineRobot.prototype.changeLedRgb = function(script) {
    this.__setModule();
    let red = script.getNumberValue('RED');
    let green = script.getNumberValue('GREEN');
    let blue = script.getNumberValue('BLUE');

    red = parseInt(red);
    green = parseInt(green);
    blue = parseInt(blue);
    const motoring = this.motoring;
    if (typeof red == 'number') {
        motoring.ledRed = motoring.ledRed != undefined ? motoring.ledRed + red : red;
    }
    if (typeof green == 'number') {
        motoring.ledGreen = motoring.ledGreen != undefined ? motoring.ledGreen + green : green;
    }
    if (typeof blue == 'number') {
        motoring.ledBlue = motoring.ledBlue != undefined ? motoring.ledBlue + blue : blue;
    }
    return script.callReturn();
};

LineRobot.prototype.clearLed = function(script) {
    this.__setModule();
    const motoring = this.motoring;
    motoring.ledRed = 0;
    motoring.ledGreen = 0;
    motoring.ledBlue = 0;
    return script.callReturn();
};

LineRobot.prototype.__SOUNDS = {
    BEEP: 1,
    RANDOM_BEEP: 2,
    NOISE: 10,
    SIREN: 3,
    ENGINE: 4,
    CHOP: 11,
    ROBOT: 5,
    DIBIDIBIDIP: 8,
    GOOD_JOB: 9,
    HAPPY: 12,
    ANGRY: 13,
    SAD: 14,
    SLEEP: 15,
    MARCH: 6,
    BIRTHDAY: 7,
};

LineRobot.prototype.playSound = function(script) {
    this.__setModule();
    this.__cancelNote();
    this.__cancelSound();

    let sound = script.getField('SOUND');
    let count = script.getNumberValue('COUNT');

    sound = this.__SOUNDS[sound];
    count = parseInt(count);
    this.motoring.buzzer = 0;
    this.motoring.note = 0;
    if (sound && count) {
        this.__runSound(sound, count);
    } else {
        this.__runSound(0);
    }
    return script.callReturn();
};

LineRobot.prototype.playSoundUntil = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isPlaying = true;
        this.__cancelNote();
        this.__cancelSound();

        let sound = script.getField('SOUND');
        let count = script.getNumberValue('COUNT');
        
        sound = this.__SOUNDS[sound];
        count = parseInt(count);
        this.motoring.buzzer = 0;
        this.motoring.note = 0;
        if (sound && count) {
            this.__runSound(sound, count);
            this.soundCallback = function() {
                script.isPlaying = false;
            };
        } else {
            this.__runSound(0);
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
};

LineRobot.prototype.setBuzzer = function(script) {
    this.__setModule();
    this.__cancelNote();
    this.__cancelSound();
    let hz = script.getNumberValue('HZ');

    hz = parseFloat(hz);
    if (typeof hz == 'number') {
        this.motoring.buzzer = hz;
    }
    this.motoring.note = 0;
    this.__runSound(0);
    return script.callReturn();
};

LineRobot.prototype.changeBuzzer = function(script) {
    this.__setModule();
    this.__cancelNote();
    this.__cancelSound();
    let hz = script.getNumberValue('HZ');

    const motoring = this.motoring;
    hz = parseFloat(hz);
    if (typeof hz == 'number') {
        motoring.buzzer = motoring.buzzer != undefined ? motoring.buzzer + hz : hz;
    }
    motoring.note = 0;
    this.__runSound(0);
    return script.callReturn();
};

LineRobot.prototype.clearSound = function(script) {
    this.__setModule();
    this.__cancelNote();
    this.__cancelSound();

    this.motoring.buzzer = 0;
    this.motoring.note = 0;
    this.__runSound(0);
    return script.callReturn();
};

LineRobot.prototype.__NOTES = {
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
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    '10': 10,
    '11': 11,
    '12': 12,
    '13': 13,
    '14': 14,
    '15': 15,
};

LineRobot.prototype.playNote = function(script) {
    this.__setModule();
    this.__cancelNote();
    this.__cancelSound();

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
    this.__runSound(0);
    return script.callReturn();
};

LineRobot.prototype.playNoteBeat = function(script) {
    const self = this;
    self.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isPlaying = true;
        self.__cancelNote();
        self.__cancelSound();

        const motoring = self.motoring;
        let note = script.getField('NOTE');
        let octave = script.getNumberField('OCTAVE');
        let beat = script.getNumberValue('BEAT');

        note = parseInt(this.__NOTES[note]);
        octave = parseInt(octave);
        beat = parseFloat(beat);
        motoring.buzzer = 0;
        if (note && octave && octave > 0 && octave < 8 && beat && beat > 0 && self.tempo > 0) {
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
            self.__runSound(0);
        } else {
            motoring.note = 0;
            self.__runSound(0);
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
};

LineRobot.prototype.restBeat = function(script) {
    const self = this;
    self.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isPlaying = true;
        self.__cancelNote();
        self.__cancelSound();
        let beat = script.getNumberValue('BEAT');

        const motoring = self.motoring;
        beat = parseFloat(beat);
        motoring.buzzer = 0;
        motoring.note = 0;
        self.__runSound(0);
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
};

LineRobot.prototype.setTempo = function(script) {
    this.__setModule();
    let bpm = script.getNumberValue('BPM');

    bpm = parseFloat(bpm);
    if (typeof bpm == 'number') {
        this.tempo = bpm;
        if (this.tempo < 1) {
            this.tempo = 1;
        }
    }
    return script.callReturn();
};

LineRobot.prototype.changeTempo = function(script) {
    this.__setModule();
    let bpm = script.getNumberValue('BPM');

    bpm = parseFloat(bpm);
    if (typeof bpm == 'number') {
        this.tempo += bpm;
        if (this.tempo < 1) {
            this.tempo = 1;
        }
    }
    return script.callReturn();
};

/**ZeroneRobot**/
function ZeroneRobot(index) {
    this.sensory = {
        signalStrength: 0,
        leftProximity: 0,
        rightProximity: 0,
        frontProximity: 0,
        rearProximity: 0,
        colorRed: 0,
        colorGreen: 0,
        colorBlue: 0,
        gesture: -1,
        colorNumber: -1,
        pulseCount: 0,
        batteryState: 2,
    };
    this.motoring = {
        group: 'zerone',
        module: 'zerone',
        index,
    };
    this.pulseId = 0;
    this.soundId = 0;
    this.motionId = 0;
    this.gestureId = -1;
    this.wheelStateId = -1;
    this.soundStateId = -1;
    this.blockId = 0;
    this.motionCallback = undefined;
    this.soundCallback = undefined;
    this.noteBlockId = 0;
    this.noteTimer1 = undefined;
    this.noteTimer2 = undefined;
    this.gesture = -1;
    this.tempo = 60;
    this.timeouts = [];
}

ZeroneRobot.prototype.__PORT_MAP = {
    group: 'zerone',
    module: 'zerone',
    leftWheel: 0,
    rightWheel: 0,
    leftHeadRgb: '0,0,0',
    leftHeadRed: 0,
    leftHeadGreen: 0,
    leftHeadBlue: 0,
    rightHeadRgb: '0,0,0',
    rightHeadRed: 0,
    rightHeadGreen: 0,
    rightHeadBlue: 0,
    leftTailRgb: '0,0,0',
    leftTailRed: 0,
    leftTailGreen: 0,
    leftTailBlue: 0,
    rightTailRgb: '0,0,0',
    rightTailRed: 0,
    rightTailGreen: 0,
    rightTailBlue: 0,
    buzzer: 0,
    pulse: 0,
    pulseId: 0,
    note: 0,
    sound: 0,
    soundRepeat: 1,
    soundId: 0,
    motionId: 0,
    motionType: 0,
    motionUnit: 0,
    motionSpeed: 0,
    motionValue: 0,
    motionRadius: 0,
    sensorMode: 0,
};

ZeroneRobot.prototype.setZero = function() {
    const portMap = this.__PORT_MAP;
    const motoring = this.motoring;
    for (const port in portMap) {
        motoring[port] = portMap[port];
    }
    this.pulseId = 0;
    this.soundId = 0;
    this.motionId = 0;
    this.gestureId = -1;
    this.wheelStateId = -1;
    this.soundStateId = -1;
    this.blockId = 0;
    this.motionCallback = undefined;
    this.soundCallback = undefined;
    this.noteBlockId = 0;
    this.noteTimer1 = undefined;
    this.noteTimer2 = undefined;
    this.gesture = -1;
    this.tempo = 60;
    
    this.__removeAllTimeouts();
};

ZeroneRobot.prototype.afterReceive = function(pd) {
    this.sensory = pd;
    this.handleSensory();
};

ZeroneRobot.prototype.afterSend = function(sq) {
    this.gesture = -1;
};

ZeroneRobot.prototype.setMotoring = function(motoring) {
    this.motoring = motoring;
};

ZeroneRobot.prototype.__setModule = function() {
    this.motoring.group = 'zerone';
    this.motoring.module = 'zerone';
};

ZeroneRobot.prototype.__removeTimeout = function(id) {
    clearTimeout(id);
    const idx = this.timeouts.indexOf(id);
    if (idx >= 0) {
        this.timeouts.splice(idx, 1);
    }
};

ZeroneRobot.prototype.__removeAllTimeouts = function() {
    const timeouts = this.timeouts;
    for (const i in timeouts) {
        clearTimeout(timeouts[i]);
    }
    this.timeouts = [];
};

ZeroneRobot.prototype.__setPulse = function(pulse) {
    this.pulseId = (this.pulseId % 255) + 1;
    this.motoring.pulse = pulse;
    this.motoring.pulseId = this.pulseId;
};

ZeroneRobot.prototype.__setMotion = function(type, unit, speed, value, radius) {
    this.motionId = (this.motionId % 255) + 1;
    const motoring = this.motoring;
    motoring.motionType = type;
    motoring.motionUnit = unit;
    motoring.motionSpeed = speed;
    motoring.motionValue = value;
    motoring.motionRadius = radius;
    motoring.motionId = this.motionId;
};

ZeroneRobot.prototype.__cancelMotion = function() {
    this.motionCallback = undefined;
};

ZeroneRobot.prototype.__runSound = function(sound, count) {
    if(typeof count != 'number') count = 1;
    if(count < 0) count = -1;
    if(count) {
        this.soundId = (this.soundId % 255) + 1;
        const motoring = this.motoring;
        motoring.sound = sound;
        motoring.soundRepeat = count;
        motoring.soundId = this.soundId;
    }
};

ZeroneRobot.prototype.__cancelSound = function() {
    this.soundCallback = undefined;
};

ZeroneRobot.prototype.__issueNoteBlockId = function() {
    this.noteBlockId = this.blockId = (this.blockId % 65535) + 1;
    return this.noteBlockId;
};

ZeroneRobot.prototype.__cancelNote = function() {
    this.noteBlockId = 0;
    if (this.noteTimer1 !== undefined) {
        this.__removeTimeout(this.noteTimer1);
    }
    if (this.noteTimer2 !== undefined) {
        this.__removeTimeout(this.noteTimer2);
    }
    this.noteTimer1 = undefined;
    this.noteTimer2 = undefined;
};

ZeroneRobot.prototype.handleSensory = function() {
    const self = this;
    const sensory = self.sensory;
    
    self.gesture = sensory.gesture;
    
    if(self.motionCallback) {
        if(sensory.wheelStateId != self.wheelStateId) {
            self.wheelStateId = sensory.wheelStateId;
            if(sensory.wheelState == 0) {
                self.motoring.leftWheel = 0;
                self.motoring.rightWheel = 0;
                var callback = self.motionCallback;
                self.__cancelMotion();
                if(callback) callback();
            }
        }
    }
    if(self.soundCallback) {
        if(sensory.soundStateId != self.soundStateId) {
            self.soundStateId = sensory.soundStateId;
            if(sensory.soundState == 0) {
                var callback = self.soundCallback;
                self.__cancelSound();
                if(callback) callback();
            }
        }
    }
};

ZeroneRobot.prototype.checkGesture = function(script) {
    this.__setModule();
    const gesture = script.getField('GESTURE');
    
    switch(gesture) {
        case 'FORWARD': return this.gesture == 0;
        case 'BACKWARD': return this.gesture == 1;
        case 'LEFTWARD': return this.gesture == 2;
        case 'RIGHTWARD': return this.gesture == 3;
        case 'NEAR': return this.gesture == 4;
        case 'FAR': return this.gesture == 5;
        case 'CLICK': return this.gesture == 6;
        case 'LONG_TOUCH': return this.gesture == 7;
    }
    return false;
};

ZeroneRobot.prototype.__TOUCHING_COLORS = {
    RED: 1,
    YELLOW: 2,
    GREEN: 3,
    SKY_BLUE: 4,
    BLUE: 5,
    PURPLE: 6,
};

ZeroneRobot.prototype.checkTouchingColor = function(script) {
    this.__setModule();
    const color = this.__TOUCHING_COLORS[script.getField('COLOR')];

    if(typeof color == 'number') {
        return this.sensory.colorNumber == color;
    }
    return false;
};

ZeroneRobot.prototype.checkBoolean = function(script) {
    this.__setModule();
    const state = script.getField('STATE');
    
    switch (state) {
        case 'BATTERY_NORMAL': return this.sensory.batteryState === 2;
        case 'BATTERY_LOW': return this.sensory.batteryState === 1;
        case 'BATTERY_EMPTY': return this.sensory.batteryState === 0;
    }
    return false;
};

ZeroneRobot.prototype.__SENSORS = {
    SIGNAL_STRENGTH: 'signalStrength',
    LEFT_PROXIMITY: 'leftProximity',
    RIGHT_PROXIMITY: 'rightProximity',
    FRONT_PROXIMITY: 'frontProximity',
    REAR_PROXIMITY: 'rearProximity',
    COLOR_R: 'colorRed',
    COLOR_G: 'colorGreen',
    COLOR_B: 'colorBlue',
    COLOR_NUMBER: 'colorNumber',
};

ZeroneRobot.prototype.getValue = function(script) {
    this.__setModule();
    const dev = script.getField('DEVICE');
    
    if(dev == 'GESTURE') {
        return this.gesture;
    } else {
        const sensor = this.__SENSORS[dev] || dev;
        return this.sensory[sensor];
    }
};

ZeroneRobot.prototype.startSensor = function(script) {
    this.__setModule();
    const mode = script.getField('MODE');
    
    switch(mode) {
        case 'GESTURE': this.motoring.sensorMode = 0; break;
        case 'COLOR': this.motoring.sensorMode = 1; break;
    }
};

ZeroneRobot.prototype.__motionUnit = function(type, unit, value, callback) {
    const motoring = this.motoring;
    this.__cancelMotion();

    motoring.leftWheel = 0;
    motoring.rightWheel = 0;
    this.__setPulse(0);
    value = parseFloat(value);
    if (value && value > 0) {
        this.__setMotion(type, unit, 0, value, 0); // type, unit, speed, value, radius
        this.motionCallback = callback;
    } else {
        this.__setMotion(0, 0, 0, 0, 0);
        callback();
    }
};

ZeroneRobot.prototype.__UNITS = {
    CM: 1,
    DEG: 1,
    SEC: 2,
    PULSE: 3,
};

ZeroneRobot.prototype.moveForwardUnit = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isMoving = true;

        const value = script.getNumberValue('VALUE');
        const unit = script.getField('UNIT');

        if (value < 0) {
            this.__motionUnit(2, this.__UNITS[unit], -value, () => {
                script.isMoving = false;
            });
        } else {
            this.__motionUnit(1, this.__UNITS[unit], value, () => {
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
};

ZeroneRobot.prototype.moveBackwardUnit = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isMoving = true;

        const value = script.getNumberValue('VALUE');
        const unit = script.getField('UNIT');

        if (value < 0) {
            this.__motionUnit(1, this.__UNITS[unit], -value, () => {
                script.isMoving = false;
            });
        } else {
            this.__motionUnit(2, this.__UNITS[unit], value, () => {
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
};

ZeroneRobot.prototype.turnUnit = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isMoving = true;

        const direction = script.getField('DIRECTION');
        const value = script.getNumberValue('VALUE');
        const unit = script.getField('UNIT');

        if (direction == 'LEFT') {
            if (value < 0) {
                this.__motionUnit(4, this.__UNITS[unit], -value, () => {
                    script.isMoving = false;
                });
            } else {
                this.__motionUnit(3, this.__UNITS[unit], value, () => {
                    script.isMoving = false;
                });
            }
        } else {
            if (value < 0) {
                this.__motionUnit(3, this.__UNITS[unit], -value, () => {
                    script.isMoving = false;
                });
            } else {
                this.__motionUnit(4, this.__UNITS[unit], value, () => {
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
};

ZeroneRobot.prototype.changeWheels = function(script) {
    const motoring = this.motoring;
    this.__setModule();
    this.__cancelMotion();

    let leftVelocity = script.getNumberValue('LEFT');
    let rightVelocity = script.getNumberValue('RIGHT');

    leftVelocity = parseFloat(leftVelocity);
    rightVelocity = parseFloat(rightVelocity);
    if (typeof leftVelocity == 'number') {
        motoring.leftWheel =
            motoring.leftWheel !== undefined ? motoring.leftWheel + leftVelocity : leftVelocity;
    }
    if (typeof rightVelocity == 'number') {
        motoring.rightWheel =
            motoring.rightWheel !== undefined ? motoring.rightWheel + rightVelocity : rightVelocity;
    }
    this.__setPulse(0);
    this.__setMotion(0, 0, 0, 0, 0);
    return script.callReturn();
};

ZeroneRobot.prototype.setWheels = function(script) {
    const motoring = this.motoring;
    this.__setModule();
    this.__cancelMotion();

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
    this.__setPulse(0);
    this.__setMotion(0, 0, 0, 0, 0);
    return script.callReturn();
};

ZeroneRobot.prototype.changeWheel = function(script) {
    const motoring = this.motoring;
    this.__setModule();
    this.__cancelMotion();

    const wheel = script.getField('WHEEL');
    let velocity = script.getNumberValue('VELOCITY');

    velocity = parseFloat(velocity);
    if (typeof velocity == 'number') {
        if (wheel == 'LEFT') {
            motoring.leftWheel =
                motoring.leftWheel != undefined ? motoring.leftWheel + velocity : velocity;
        } else if (wheel == 'RIGHT') {
            motoring.rightWheel =
                motoring.rightWheel != undefined ? motoring.rightWheel + velocity : velocity;
        } else {
            motoring.leftWheel =
                motoring.leftWheel != undefined ? motoring.leftWheel + velocity : velocity;
            motoring.rightWheel =
                motoring.rightWheel != undefined ? motoring.rightWheel + velocity : velocity;
        }
    }
    this.__setPulse(0);
    this.__setMotion(0, 0, 0, 0, 0);
    return script.callReturn();
};

ZeroneRobot.prototype.setWheel = function(script) {
    const motoring = this.motoring;
    this.__setModule();
    this.__cancelMotion();

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
    this.__setPulse(0);
    this.__setMotion(0, 0, 0, 0, 0);
    return script.callReturn();
};

ZeroneRobot.prototype.stop = function(script) {
    this.__setModule();
    this.__cancelMotion();

    const motoring = this.motoring;
    motoring.leftWheel = 0;
    motoring.rightWheel = 0;
    this.__setPulse(0);
    this.__setMotion(0, 0, 0, 0, 0);
    return script.callReturn();
};

ZeroneRobot.prototype.__setRgb = function(led, red, green, blue) {
    const motoring = this.motoring;
    
    red = parseInt(red);
    green = parseInt(green);
    blue = parseInt(blue);
    if(led == 'LEFT_HEAD' || led == 'LEFT' || led == 'HEAD' || led == 'ALL') {
        if(typeof red == 'number') {
            motoring.leftHeadRed = red;
        }
        if(typeof green == 'number') {
            motoring.leftHeadGreen = green;
        }
        if(typeof blue == 'number') {
            motoring.leftHeadBlue = blue;
        }
        motoring.leftHeadRgb = `${motoring.leftHeadRed},${motoring.leftHeadGreen},${motoring.leftHeadBlue}`;
    }
    if(led == 'RIGHT_HEAD' || led == 'RIGHT' || led == 'HEAD' || led == 'ALL') {
        if(typeof red == 'number') {
            motoring.rightHeadRed = red;
        }
        if(typeof green == 'number') {
            motoring.rightHeadGreen = green;
        }
        if(typeof blue == 'number') {
            motoring.rightHeadBlue = blue;
        }
        motoring.rightHeadRgb = `${motoring.rightHeadRed},${motoring.rightHeadGreen},${motoring.rightHeadBlue}`;
    }
    if(led == 'LEFT_TAIL' || led == 'LEFT' || led == 'TAIL' || led == 'ALL') {
        if(typeof red == 'number') {
            motoring.leftTailRed = red;
        }
        if(typeof green == 'number') {
            motoring.leftTailGreen = green;
        }
        if(typeof blue == 'number') {
            motoring.leftTailBlue = blue;
        }
        motoring.leftTailRgb = `${motoring.leftTailRed},${motoring.leftTailGreen},${motoring.leftTailBlue}`;
    }
    if(led == 'RIGHT_TAIL' || led == 'RIGHT' || led == 'TAIL' || led == 'ALL') {
        if(typeof red == 'number') {
            motoring.rightTailRed = red;
        }
        if(typeof green == 'number') {
            motoring.rightTailGreen = green;
        }
        if(typeof blue == 'number') {
            motoring.rightTailBlue = blue;
        }
        motoring.rightTailRgb = `${motoring.rightTailRed},${motoring.rightTailGreen},${motoring.rightTailBlue}`;
    }
};

ZeroneRobot.prototype.__changeRgb = function(led, red, green, blue) {
    const motoring = this.motoring;
    
    red = parseInt(red);
    green = parseInt(green);
    blue = parseInt(blue);
    if(led == 'LEFT_HEAD' || led == 'LEFT' || led == 'HEAD' || led == 'ALL') {
        if(typeof red == 'number') {
            motoring.leftHeadRed += red;
        }
        if(typeof green == 'number') {
            motoring.leftHeadGreen += green;
        }
        if(typeof blue == 'number') {
            motoring.leftHeadBlue += blue;
        }
        motoring.leftHeadRgb = `${motoring.leftHeadRed},${motoring.leftHeadGreen},${motoring.leftHeadBlue}`;
    }
    if(led == 'RIGHT_HEAD' || led == 'RIGHT' || led == 'HEAD' || led == 'ALL') {
        if(typeof red == 'number') {
            motoring.rightHeadRed += red;
        }
        if(typeof green == 'number') {
            motoring.rightHeadGreen += green;
        }
        if(typeof blue == 'number') {
            motoring.rightHeadBlue += blue;
        }
        motoring.rightHeadRgb = `${motoring.rightHeadRed},${motoring.rightHeadGreen},${motoring.rightHeadBlue}`;
    }
    if(led == 'LEFT_TAIL' || led == 'LEFT' || led == 'TAIL' || led == 'ALL') {
        if(typeof red == 'number') {
            motoring.leftTailRed += red;
        }
        if(typeof green == 'number') {
            motoring.leftTailGreen += green;
        }
        if(typeof blue == 'number') {
            motoring.leftTailBlue += blue;
        }
        motoring.leftTailRgb = `${motoring.leftTailRed},${motoring.leftTailGreen},${motoring.leftTailBlue}`;
    }
    if(led == 'RIGHT_TAIL' || led == 'RIGHT' || led == 'TAIL' || led == 'ALL') {
        if(typeof red == 'number') {
            motoring.rightTailRed += red;
        }
        if(typeof green == 'number') {
            motoring.rightTailGreen += green;
        }
        if(typeof blue == 'number') {
            motoring.rightTailBlue += blue;
        }
        motoring.rightTailRgb = `${motoring.rightTailRed},${motoring.rightTailGreen},${motoring.rightTailBlue}`;
    }
};

ZeroneRobot.prototype.__RGB_COLORS = {
    RED: [255, 0, 0],
    ORANGE: [255, 63, 0],
    YELLOW: [255, 255, 0],
    GREEN: [0, 255, 0],
    SKY_BLUE: [0, 255, 255],
    BLUE: [0, 0, 255],
    VIOLET: [63, 0, 255],
    PURPLE: [255, 0, 255],
    WHITE: [255, 255, 255],
};

ZeroneRobot.prototype.setLed = function(script) {
    this.__setModule();
    const led = script.getField('LED');
    const color = script.getField('COLOR');

    const rgb = this.__RGB_COLORS[color];
    if (rgb) {
        this.__setRgb(led, rgb[0], rgb[1], rgb[2]);
    }
    return script.callReturn();
};

ZeroneRobot.prototype.pickLed = function(script) {
    this.__setModule();
    const led = script.getField('LED');
    const color = script.getField('COLOR');

    const red = parseInt(color.slice(1, 3), 16);
    const green = parseInt(color.slice(3, 5), 16);
    const blue = parseInt(color.slice(5, 7), 16);

    this.__setRgb(led, red, green, blue);
    return script.callReturn();
};

ZeroneRobot.prototype.clearLed = function(script) {
    this.__setModule();
    const led = script.getField('LED');
    
    this.__setRgb(led, 0, 0, 0);
    return script.callReturn();
};

ZeroneRobot.prototype.changeRgb = function(script) {
    this.__setModule();
    const led = script.getField('LED');
    const red = script.getNumberValue('RED');
    const green = script.getNumberValue('GREEN');
    const blue = script.getNumberValue('BLUE');
    
    this.__changeRgb(led, red, green, blue);
    return script.callReturn();
};

ZeroneRobot.prototype.setRgb = function(script) {
    this.__setModule();
    const led = script.getField('LED');
    const red = script.getNumberValue('RED');
    const green = script.getNumberValue('GREEN');
    const blue = script.getNumberValue('BLUE');
    
    this.__setRgb(led, red, green, blue);
    return script.callReturn();
};

ZeroneRobot.prototype.__SOUNDS = {
    BEEP: 1,
    RANDOM_BEEP: 2,
    NOISE: 10,
    SIREN: 3,
    ENGINE: 4,
    CHOP: 11,
    ROBOT: 5,
    DIBIDIBIDIP: 8,
    GOOD_JOB: 9,
    HAPPY: 12,
    ANGRY: 13,
    SAD: 14,
    SLEEP: 15,
    MARCH: 6,
    BIRTHDAY: 7,
};

ZeroneRobot.prototype.playSound = function(script) {
    this.__setModule();
    this.__cancelNote();
    this.__cancelSound();

    let sound = script.getField('SOUND');
    let count = script.getNumberValue('COUNT');

    sound = this.__SOUNDS[sound];
    count = parseInt(count);
    this.motoring.buzzer = 0;
    this.motoring.note = 0;
    if (sound && count) {
        this.__runSound(sound, count);
    } else {
        this.__runSound(0);
    }
    return script.callReturn();
};

ZeroneRobot.prototype.playSoundUntil = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isPlaying = true;
        this.__cancelNote();
        this.__cancelSound();

        let sound = script.getField('SOUND');
        let count = script.getNumberValue('COUNT');
        
        sound = this.__SOUNDS[sound];
        count = parseInt(count);
        this.motoring.buzzer = 0;
        this.motoring.note = 0;
        if (sound && count) {
            this.__runSound(sound, count);
            this.soundCallback = function() {
                script.isPlaying = false;
            };
        } else {
            this.__runSound(0);
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
};

ZeroneRobot.prototype.changeBuzzer = function(script) {
    this.__setModule();
    this.__cancelNote();
    this.__cancelSound();
    let hz = script.getNumberValue('HZ');

    const motoring = this.motoring;
    hz = parseFloat(hz);
    if (typeof hz == 'number') {
        motoring.buzzer = motoring.buzzer != undefined ? motoring.buzzer + hz : hz;
    }
    motoring.note = 0;
    this.__runSound(0);
    return script.callReturn();
};

ZeroneRobot.prototype.setBuzzer = function(script) {
    this.__setModule();
    this.__cancelNote();
    this.__cancelSound();
    let hz = script.getNumberValue('HZ');

    hz = parseFloat(hz);
    if (typeof hz == 'number') {
        this.motoring.buzzer = hz;
    }
    this.motoring.note = 0;
    this.__runSound(0);
    return script.callReturn();
};

ZeroneRobot.prototype.clearSound = function(script) {
    this.__setModule();
    this.__cancelNote();
    this.__cancelSound();

    this.motoring.buzzer = 0;
    this.motoring.note = 0;
    this.__runSound(0);
    return script.callReturn();
};

ZeroneRobot.prototype.__NOTES = {
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
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    '10': 10,
    '11': 11,
    '12': 12,
    '13': 13,
    '14': 14,
    '15': 15,
};

ZeroneRobot.prototype.playNote = function(script) {
    this.__setModule();
    this.__cancelNote();
    this.__cancelSound();

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
    this.__runSound(0);
    return script.callReturn();
};

ZeroneRobot.prototype.playNoteBeat = function(script) {
    const self = this;
    self.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isPlaying = true;
        self.__cancelNote();
        self.__cancelSound();

        const motoring = self.motoring;
        let note = script.getField('NOTE');
        let octave = script.getNumberField('OCTAVE');
        let beat = script.getNumberValue('BEAT');

        note = parseInt(this.__NOTES[note]);
        octave = parseInt(octave);
        beat = parseFloat(beat);
        motoring.buzzer = 0;
        if (note && octave && octave > 0 && octave < 8 && beat && beat > 0 && self.tempo > 0) {
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
            self.__runSound(0);
        } else {
            motoring.note = 0;
            self.__runSound(0);
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
};

ZeroneRobot.prototype.restBeat = function(script) {
    const self = this;
    self.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isPlaying = true;
        self.__cancelNote();
        self.__cancelSound();
        let beat = script.getNumberValue('BEAT');

        const motoring = self.motoring;
        beat = parseFloat(beat);
        motoring.buzzer = 0;
        motoring.note = 0;
        self.__runSound(0);
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
};

ZeroneRobot.prototype.changeTempo = function(script) {
    this.__setModule();
    let bpm = script.getNumberValue('BPM');

    bpm = parseFloat(bpm);
    if (typeof bpm == 'number') {
        this.tempo += bpm;
        if (this.tempo < 1) {
            this.tempo = 1;
        }
    }
    return script.callReturn();
};

ZeroneRobot.prototype.setTempo = function(script) {
    this.__setModule();
    let bpm = script.getNumberValue('BPM');

    bpm = parseFloat(bpm);
    if (typeof bpm == 'number') {
        this.tempo = bpm;
        if (this.tempo < 1) {
            this.tempo = 1;
        }
    }
    return script.callReturn();
};

Entry.Robomation = {
    robots: {},
    robotsByGroup: {},
    afterReceive(pd, multi) {
        let index = pd.index;
        if (index === undefined) {
            index = 0;
        }
        let group = undefined,
            module = undefined;
        switch (pd.model) {
            case 0x04:
                group = 'hamster';
                module = 'hamster';
                break;
            case 0x0e:
                group = 'hamster';
                module = 'hamsterS';
                break;
            case 0x09:
                group = 'turtle';
                module = 'turtle';
                break;
            case 0x0f:
                group = 'zerone';
                module = 'zerone';
                break;
            case 0x10:
                group = 'line';
                module = 'brown';
                break;
            case 0x11:
                group = 'line';
                module = 'sally';
                break;
            case 0xff:
                group = pd.group;
                module = pd.module;
                break;
        }
        if (group && module) {
            const key = module + index;
            let robot = this.robots[key];
            if (!robot) {
                if (module == 'hamster') {
                    robot = new HamsterRobot(index);
                } else if (module == 'hamsterS') {
                    robot = new HamsterSRobot(index);
                } else if (module == 'turtle') {
                    robot = new TurtleRobot(index);
                } else if (module == 'zerone') {
                    robot = new ZeroneRobot(index);
                } else if (module == 'brown') {
                    robot = new LineRobot(index, module);
                } else if (module == 'sally') {
                    robot = new LineRobot(index, module);
                }
                if (robot) {
                    this.robots[key] = robot;
                }
            }
            if (robot) {
                if (multi) {
                    Entry.hw.sendQueue[key] = robot.motoring;
                }
                robot.afterReceive(pd);
            }
            this.robotsByGroup[group + index] = robot;
        }
    },
    afterSend(sq) {
        const robots = this.robots;
        for (const i in robots) {
            robots[i].afterSend(sq);
        }
    },
    getRobot(group, index) {
        return this.robotsByGroup[group + index];
    },
    setZero() {
        const robots = this.robots;
        for (const i in robots) {
            robots[i].setZero();
        }
        Entry.hw.update();
    },
};

module.exports = Entry.Robomation;
