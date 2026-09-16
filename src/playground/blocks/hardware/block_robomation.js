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

LineRobot.prototype.followLineUntilIntersection = function(script) {
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
        this.__setLineTracerMode(9); // LINE_TRACER_MODE_UNTIL_CROSS
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
        floor: 0,
        button: 0,
        gesture: -1,
        colorNumber: -1,
        colorPattern: -1,
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
    this.lineTracerModeId = 0;
    this.motionId = 0;
    this.clickedId = -1;
    this.doubleClickedId = -1;
    this.longPressedId = -1;
    this.gestureId = -1;
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
    this.gesture = -1;
    this.colorPattern = -1;
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

ZeroneRobot.prototype.setZero = function() {
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
    this.gestureId = -1;
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
    this.gesture = -1;
    this.colorPattern = -1;
    this.tempo = 60;
    
    this.__removeAllTimeouts();
};

ZeroneRobot.prototype.afterReceive = function(pd) {
    this.sensory = pd;
    this.handleSensory();
};

ZeroneRobot.prototype.afterSend = function(sq) {
    this.clicked = false;
    this.doubleClicked = false;
    this.longPressed = false;
    this.gesture = -1;
    this.colorPattern = -1;
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

ZeroneRobot.prototype.__setLineTracerMode = function(mode) {
    this.lineTracerModeId = (this.lineTracerModeId % 255) + 1;
    this.motoring.lineTracerMode = mode;
    this.motoring.lineTracerModeId = this.lineTracerModeId;
};

ZeroneRobot.prototype.__cancelLineTracer = function() {
    this.lineTracerCallback = undefined;
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
    
    self.clicked = sensory.clicked == 1;
    self.doubleClicked = sensory.doubleClicked == 1;
    self.longPressed = sensory.longPressed == 1;
    self.gesture = sensory.gesture;
    self.colorPattern = sensory.colorPattern;
    
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
        case 'LONG_TOUCH': return this.gesture == 6;
    }
    return false;
};

ZeroneRobot.prototype.__TOUCHING_COLORS = {
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

ZeroneRobot.prototype.checkTouchingColor = function(script) {
    this.__setModule();
    const color = this.__TOUCHING_COLORS[script.getField('COLOR')];

    if(typeof color == 'number') {
        return this.sensory.colorNumber == color;
    }
    return false;
};

ZeroneRobot.prototype.__PATTERN_COLORS = {
	BLACK: 0,
	RED: 1,
	YELLOW: 2,
	GREEN: 3,
	SKY_BLUE: 4,
	BLUE: 5,
	PURPLE: 6
};

ZeroneRobot.prototype.checkColorPattern = function(script) {
    this.__setModule();
    const color1 = this.__TOUCHING_COLORS[script.getField('COLOR1')];
    const color2 = this.__TOUCHING_COLORS[script.getField('COLOR2')];

    if((typeof color1 == 'number') && (typeof color2 == 'number')) {
        return this.colorPattern == color1 * 10 + color2;
    }
    return false;
};

ZeroneRobot.prototype.checkButtonState = function(script) {
    this.__setModule();
    const state = script.getField('STATE');
    
    switch(state) {
        case 'CLICKED': return this.clicked;
        case 'DOUBLE_CLICKED': return this.doubleClicked;
        case 'LONG_PRESSED': return this.longPressed;
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
    FLOOR: 'floor',
    BUTTON: 'button',
    COLOR_NUMBER: 'colorNumber',
};

ZeroneRobot.prototype.getValue = function(script) {
    this.__setModule();
    const dev = script.getField('DEVICE');
    
    if(dev == 'GESTURE') {
        return this.gesture;
    } else if(dev == 'COLOR_PATTERN') {
        return this.colorPattern;
    } else {
        const sensor = this.__SENSORS[dev] || dev;
        return this.sensory[sensor];
    }
};

ZeroneRobot.prototype.__motionUnit = function(type, unit, value, callback) {
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

ZeroneRobot.prototype.setWheels = function(script) {
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

ZeroneRobot.prototype.changeWheel = function(script) {
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

ZeroneRobot.prototype.setWheel = function(script) {
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

ZeroneRobot.prototype.followLine = function(script) {
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

ZeroneRobot.prototype.followLineUntil = function(script) {
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

ZeroneRobot.prototype.followLineUntilIntersection = function(script) {
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
        this.__setLineTracerMode(9); // LINE_TRACER_MODE_UNTIL_CROSS
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

ZeroneRobot.prototype.crossIntersection = function(script) {
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

ZeroneRobot.prototype.turnAtIntersection = function(script) {
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

ZeroneRobot.prototype.jumpLine = function(script) {
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

ZeroneRobot.prototype.setLineTracerSpeed = function(script) {
    this.__setModule();
    let speed = Number(script.getField('SPEED'));

    speed = parseInt(speed);
    if (typeof speed == 'number') {
        this.motoring.lineTracerSpeed = speed;
    }
    return script.callReturn();
};

ZeroneRobot.prototype.stop = function(script) {
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

/**CheeseRobot Lib**/
const CHEESE_HAT_SHAPES = {
    'SQUARE': [0xf8, 0x88, 0x88, 0x88, 0xf8], //1111 1/1000 1/1000 1/1000 1/1111 1
    'TRIANGLE': [0x00, 0x20, 0x50, 0xf8, 0x00], //0000 0/0010 0/0101 0/1111 1/0000 0
    'DIAMOND': [0x20, 0x50, 0x88, 0x50, 0x20], //0010 0/0101 0/1000 1/0101 0/0010 0
    'CIRCLE': [0x70, 0x88, 0x88, 0x88, 0x70], //0111 0/1000 1/1000 1/1000 1/0111 0
    'X': [0x88, 0x50, 0x20, 0x50, 0x88], //1000 1/0101 0/0010 0/0101 0/1000 1
    'LIKE': [0x50, 0x50, 0x00, 0x88, 0x70], //0101 0/0101 0/0000 0/1000 1/0111 0
    'DISLIKE': [0x50, 0x50, 0x00, 0x70, 0x88], //0101 0/0101 0/0000 0/0111 0/1000 1
    'ANGRY': [0x88, 0x50, 0x00, 0xf8, 0x88], //1000 1/0101 0/0000 0/1111 1/1000 1
    'OPEN_MOUTH': [0x50, 0x00, 0x70, 0x88, 0x70], //0101 0/0000 0/0111 0/1000 1/0111 0
    'CLOSE_MOUTH': [0x50, 0x00, 0x00, 0xf8, 0x00], //0101 0/0000 0/0000 0/1111 1/0000 0
    'WALK1': [0x20, 0x30, 0x60, 0x20, 0x50], //0010 0/0011 0/0110 0/0010 0/0101 0
    'WALK2': [0x20, 0x60, 0x30, 0x20, 0x20], //0010 0/0110 0/0011 0/0010 0/0010 0
    'HEART': [0x50, 0xf8, 0xf8, 0x70, 0x20], //0101 0/1111 1/1111 1/0111 0/0010 0
    'STAR': [0x20, 0xf8, 0x70, 0x70, 0x88], //0010 0/1111 1/0111 0/0111 0/1000 1
    'AIRPLANE': [0x20, 0xb0, 0xc8, 0xb0, 0x20], //0010 0/1011 0/1100 1/1011 0/0010 0
    'PUPPY': [0x30, 0x38, 0xf0, 0x70, 0x50], //0011 0/0011 1/1111 0/0111 0/0101 0
    'BUTTERFLY': [0x88, 0xd8, 0xa8, 0xd8, 0x88], //1000 1/1101 1/1010 1/1101 1/1000 1
    'QUARTER_NOTE': [0x10, 0x10, 0x10, 0x70, 0x70], //0001 0/0001 0/0001 0/0111 0/0111 0
    'EIGHTH_NOTE': [0x20, 0x30, 0x28, 0xe0, 0xe0], //0010 0/0011 0/0010 1/1110 0/1110 0
    'LEFT_ARROW': [0x20, 0x40, 0xf8, 0x40, 0x20], //0010 0/0100 0/1111 1/0100 0/0010 0
    'RIGHT_ARROW': [0x20, 0x10, 0xf8, 0x10, 0x20], //0010 0/0001 0/1111 1/0001 0/0010 0
    'UP_ARROW': [0x20, 0x70, 0xa8, 0x20, 0x20], //0010 0/0111 0/1010 1/0010 0/0010 0
    'DOWN_ARRAY': [0x20, 0x20, 0xa8, 0x70, 0x20] //0010 0/0010 0/1010 1/0111 0/0010 0
};

const CHEESE_HAT_ALPHABETS = {
    'a': { width: 5, data: [0x00, 0x70, 0x90, 0x90, 0x70] }, //0000 0/0111 0/1001 0/1001 0/0111 0
    'b': { width: 5, data: [0x80, 0xe0, 0x90, 0x90, 0xe0] }, //1000 0/1110 0/1001 0/1001 0/1110 0
    'c': { width: 5, data: [0x00, 0x70, 0x80, 0x80, 0x70] }, //0000 0/0111 0/1000 0/1000 0/0111 0
    'd': { width: 5, data: [0x10, 0x70, 0x90, 0x90, 0x70] }, //0001 0/0111 0/1001 0/1001 0/0111 0
    'e': { width: 5, data: [0x00, 0x70, 0xf0, 0x80, 0x70] }, //0000 0/0111 0/1111 0/1000 0/0111 0
    'f': { width: 5, data: [0x30, 0x40, 0xf0, 0x40, 0x40] }, //0011 0/0100 0/1111 0/0100 0/0100 0
    'g': { width: 5, data: [0x70, 0x90, 0x70, 0x10, 0xe0] }, //0111 0/1001 0/0111 0/0001 0/1110 0
    'h': { width: 5, data: [0x80, 0x80, 0xe0, 0x90, 0x90] }, //1000 0/1000 0/1110 0/1001 0/1001 0
    'i': { width: 2, data: [0x80, 0x00, 0x80, 0x80, 0x80] }, //10/00/10/10/10
    'j': { width: 4, data: [0x20, 0x00, 0x20, 0xa0, 0x40] }, //0010/0000/0010/1010/0100
    'k': { width: 4, data: [0x80, 0x80, 0xa0, 0xc0, 0xa0] }, //1000/1000/1010/1100/1010
    'l': { width: 3, data: [0x80, 0x80, 0x80, 0x80, 0x40] }, //100/100/100/100/010
    'm': { width: 6, data: [0x00, 0xf0, 0xa8, 0xa8, 0xa8] }, //0000 00/1111 00/1010 10/1010 10/1010 10
    'n': { width: 5, data: [0x00, 0xe0, 0x90, 0x90, 0x90] }, //0000 0/1110 0/1001 0/1001 0/1001 0
    'o': { width: 5, data: [0x00, 0x60, 0x90, 0x90, 0x60] }, //0000 0/0110 0/1001 0/1001 0/0110 0
    'p': { width: 5, data: [0x00, 0xe0, 0x90, 0xe0, 0x80] }, //0000 0/1110 0/1001 0/1110 0/1000 0
    'q': { width: 5, data: [0x00, 0x70, 0x90, 0x70, 0x10] }, //0000 0/0111 0/1001 0/0111 0/0001 0
    'r': { width: 4, data: [0x00, 0x60, 0x80, 0x80, 0x80] }, //0000/0110/1000/1000/1000
    's': { width: 5, data: [0x00, 0x70, 0xc0, 0x30, 0xe0] }, //0000 0/0111 0/1100 0/0011 0/1110 0
    't': { width: 5, data: [0x40, 0xf0, 0x40, 0x40, 0x30] }, //0100 0/1111 0/0100 0/0100 0/0011 0
    'u': { width: 5, data: [0x00, 0x90, 0x90, 0x90, 0x70] }, //0000 0/1001 0/1001 0/1001 0/0111 0
    'v': { width: 6, data: [0x00, 0x88, 0x50, 0x50, 0x20] }, //0000 00/1000 10/0101 00/0101 00/0010 00
    'w': { width: 6, data: [0x00, 0x88, 0xa8, 0xa8, 0x50] }, //0000 00/1000 10/1010 10/1010 10/0101 00
    'x': { width: 4, data: [0x00, 0xa0, 0x40, 0x40, 0xa0] }, //0000/1010/0100/0100/1010
    'y': { width: 5, data: [0x00, 0x90, 0x70, 0x10, 0x60] }, //0000 0/1001 0/0111 0/0001 0/0110 0
    'z': { width: 5, data: [0x00, 0xf0, 0x20, 0x40, 0xf0] }, //0000 0/1111 0/0010 0/0100 0/1111 0
    'A': { width: 5, data: [0x60, 0x90, 0xf0, 0x90, 0x90] }, //0110 0/1001 0/1111 0/1001 0/1001 0
    'B': { width: 5, data: [0xe0, 0x90, 0xe0, 0x90, 0xe0] }, //1110 0/1001 0/1110 0/1001 0/1110 0
    'C': { width: 5, data: [0x60, 0x90, 0x80, 0x90, 0x60] }, //0110 0/1001 0/1000 0/1001 0/0110 0
    'D': { width: 5, data: [0xe0, 0x90, 0x90, 0x90, 0xe0] }, //1110 0/1001 0/1001 0/1001 0/1110 0
    'E': { width: 5, data: [0xf0, 0x80, 0xf0, 0x80, 0xf0] }, //1111 0/1000 0/1111 0/1000 0/1111 0
    'F': { width: 5, data: [0xf0, 0x80, 0xf0, 0x80, 0x80] }, //1111 0/1000 0/1111 0/1000 0/1000 0
    'G': { width: 5, data: [0x70, 0x80, 0xb0, 0x90, 0x60] }, //0111 0/1000 0/1011 0/1001 0/0110 0
    'H': { width: 5, data: [0x90, 0x90, 0xf0, 0x90, 0x90] }, //1001 0/1001 0/1111 0/1001 0/1001 0
    'I': { width: 4, data: [0xe0, 0x40, 0x40, 0x40, 0xe0] }, //1110/0100/0100/0100/1110
    'J': { width: 5, data: [0xf0, 0x20, 0x20, 0xa0, 0x40] }, //1111 0/0010 0/0010 0/1010 0/0100 0
    'K': { width: 5, data: [0x90, 0xa0, 0xc0, 0xa0, 0x90] }, //1001 0/1010 0/1100 0/1010 0/1001 0
    'L': { width: 5, data: [0x80, 0x80, 0x80, 0x80, 0xf0] }, //1000 0/1000 0/1000 0/1000 0/1111 0
    'M': { width: 6, data: [0x88, 0xd8, 0xa8, 0x88, 0x88] }, //1000 10/1101 10/1010 10/1000 10/1000 10
    'N': { width: 6, data: [0x88, 0xc8, 0xa8, 0x98, 0x88] }, //1000 10/1100 10/1010 10/1001 10/1000 10
    'O': { width: 5, data: [0x60, 0x90, 0x90, 0x90, 0x60] }, //0110 0/1001 0/1001 0/1001 0/0110 0
    'P': { width: 5, data: [0xe0, 0x90, 0xe0, 0x80, 0x80] }, //1110 0/1001 0/1110 0/1000 0/1000 0
    'Q': { width: 5, data: [0x60, 0x90, 0x90, 0xa0, 0x50] }, //0110 0/1001 0/1001 0/1010 0/0101 0
    'R': { width: 5, data: [0xe0, 0x90, 0xe0, 0x90, 0x90] }, //1110 0/1001 0/1110 0/1001 0/1001 0
    'S': { width: 5, data: [0x70, 0x80, 0x60, 0x10, 0xe0] }, //0111 0/1000 0/0110 0/0001 0/1110 0
    'T': { width: 6, data: [0xf8, 0x20, 0x20, 0x20, 0x20] }, //1111 10/0010 00/0010 00/0010 00/0010 00
    'U': { width: 5, data: [0x90, 0x90, 0x90, 0x90, 0x60] }, //1001 0/1001 0/1001 0/1001 0/0110 0
    'V': { width: 6, data: [0x88, 0x88, 0x50, 0x50, 0x20] }, //1000 10/1000 10/0101 00/0101 00/0010 00
    'W': { width: 6, data: [0x88, 0xa8, 0xa8, 0xa8, 0x50] }, //1000 10/1010 10/1010 10/1010 10/0101 00
    'X': { width: 5, data: [0x90, 0x90, 0x60, 0x90, 0x90] }, //1001 0/1001 0/0110 0/1001 0/1001 0
    'Y': { width: 6, data: [0x88, 0x50, 0x20, 0x20, 0x20] }, //1000 10/0101 00/0010 00/0010 00/0010 00
    'Z': { width: 5, data: [0xf0, 0x10, 0x60, 0x80, 0xf0] }, //1111 0/0001 0/0110 0/1000 0/1111 0
    '1': { width: 4, data: [0x40, 0xc0, 0x40, 0x40, 0xe0] }, //0100/1100/0100/0100/1110
    '2': { width: 5, data: [0x60, 0x90, 0x20, 0x40, 0xf0] }, //0110 0/1001 0/0010 0/0100 0/1111 0
    '3': { width: 5, data: [0x60, 0x90, 0x20, 0x90, 0x60] }, //0110 0/1001 0/0010 0/1001 0/0110 0
    '4': { width: 5, data: [0x20, 0x60, 0xa0, 0xf0, 0x20] }, //0010 0/0110 0/1010 0/1111 0/0010 0
    '5': { width: 5, data: [0xf0, 0x80, 0xe0, 0x10, 0xe0] }, //1111 0/1000 0/1110 0/0001 0/1110 0
    '6': { width: 5, data: [0x60, 0x80, 0xe0, 0x90, 0x60] }, //0110 0/1000 0/1110 0/1001 0/0110 0
    '7': { width: 5, data: [0xf0, 0x10, 0x20, 0x40, 0x80] }, //1111 0/0001 0/0010 0/0100 0/1000 0
    '8': { width: 5, data: [0x60, 0x90, 0x60, 0x90, 0x60] }, //0110 0/1001 0/0110 0/1001 0/0110 0
    '9': { width: 5, data: [0x60, 0x90, 0x70, 0x10, 0x60] }, //0110 0/1001 0/0111 0/0001 0/0110 0
    '0': { width: 5, data: [0x60, 0x90, 0x90, 0x90, 0x60] }, //0110 0/1001 0/1001 0/1001 0/0110 0
    '`': { width: 3, data: [0x80, 0x40] }, //100/010/000/000/000
    '~': { width: 6, data: [0x00, 0x40, 0xa8, 0x10] }, //0000 00/0100 00/1010 10/0001 00/0000 00
    '!': { width: 2, data: [0x80, 0x80, 0x80, 0x00, 0x80] }, //10/10/10/00/10
    '@': { width: 5, data: [0x00, 0x60, 0x90, 0xb0, 0xb0] }, //0000 0/0110 0/1001 0/1011 0/1011 0
    '#': { width: 6, data: [0x50, 0xf8, 0x50, 0xf8, 0x50] }, //0101 00/1111 10/0101 00/1111 10/0101 00
    '$': { width: 6, data: [0x70, 0xa0, 0x70, 0x28, 0x70] }, //0111 00/1010 00/0111 00/0010 10/0111 00
    '%': { width: 5, data: [0x00, 0x90, 0x20, 0x40, 0x90] }, //0000 0/1001 0/0010 0/0100 0/1001 0
    '^': { width: 4, data: [0x40, 0xa0] }, //0100/1010/0000/0000/0000
    '&': { width: 5, data: [0x60, 0x90, 0x60, 0xb0, 0x50] }, //0110 0/1001 0/0110 0/1011 0/0101 0
    '*': { width: 4, data: [0x00, 0xa0, 0x40, 0xa0] }, //0000/1010/0100/1010/0000
    '(': { width: 3, data: [0x40, 0x80, 0x80, 0x80, 0x40] }, //010/100/100/100/010
    ')': { width: 3, data: [0x80, 0x40, 0x40, 0x40, 0x80] }, //100/010/010/010/100
    '_': { width: 5, data: [0x00, 0x00, 0x00, 0x00, 0xf0] }, //0000 0/0000 0/0000 0/0000 0/1111 0
    '-': { width: 4, data: [0x00, 0x00, 0xe0] }, //0000/0000/1110/0000/0000
    '+': { width: 4, data: [0x00, 0x40, 0xe0, 0x40] }, //0000/0100/1110/0100/0000
    '|': { width: 2, data: [0x80, 0x80, 0x80, 0x80, 0x80] }, //10/10/10/10/10
    '=': { width: 4, data: [0x00, 0xe0, 0x00, 0xe0] }, //0000/1110/0000/1110/0000
    '\\': { width: 5, data: [0x00, 0x80, 0x40, 0x20, 0x10] }, //0000 0/1000 0/0100 0/0010 0/0001 0
    '{': { width: 4, data: [0x60, 0x40, 0xc0, 0x40, 0x60] }, //0110/0100/1100/0100/0110
    '}': { width: 4, data: [0xc0, 0x40, 0x60, 0x40, 0xc0] }, //1100/0100/0110/0100/1100
    '[': { width: 3, data: [0xc0, 0x80, 0x80, 0x80, 0xc0] }, //110/100/100/100/110
    ']': { width: 3, data: [0xc0, 0x40, 0x40, 0x40, 0xc0] }, //110/010/010/010/110
    ':': { width: 2, data: [0x00, 0x80, 0x00, 0x80] }, //00/10/00/10/00
    ';': { width: 3, data: [0x00, 0x40, 0x00, 0x40, 0x80] }, //000/010/000/010/100
    '"': { width: 4, data: [0xa0, 0xa0] }, //1010/1010/0000/0000/0000
    '\'': { width: 2, data: [0x80, 0x80] }, //10/10/00/00/00
    '<': { width: 4, data: [0x20, 0x40, 0x80, 0x40, 0x20] }, //0010/0100/1000/0100/0010
    '>': { width: 4, data: [0x80, 0x40, 0x20, 0x40, 0x80] }, //1000/0100/0010/0100/1000
    '?': { width: 5, data: [0x60, 0x90, 0x20, 0x00, 0x20] }, //0110 0/1001 0/0010 0/0000 0/0010 0
    ',': { width: 3, data: [0x00, 0x00, 0x00, 0x40, 0x80] }, //000/000/000/010/100
    '.': { width: 2, data: [0x00, 0x00, 0x00, 0x00, 0x80] }, //00/00/00/00/10
    '/': { width: 5, data: [0x00, 0x10, 0x20, 0x40, 0x80] } //0000 0/0001 0/0010 0/0100 0/1000 0
};

const CHEESE_HAT_KO_CHO_JONG = [
    { width: 5, data: [0xf0, 0x10, 0x10, 0x10, 0x10] }, //1111 0/0001 0/0001 0/0001 0/0001 0
    { width: 5, data: [0xf0, 0x50, 0x50, 0x50, 0x50] }, //1111 0/0101 0/0101 0/0101 0/0101 0
    { width: 5, data: [0x80, 0x80, 0x80, 0x80, 0xf0] }, //1000 0/1000 0/1000 0/1000 0/1111 0
    { width: 5, data: [0xf0, 0x80, 0x80, 0x80, 0xf0] }, //1111 0/1000 0/1000 0/1000 0/1111 0
    { width: 5, data: [0xf0, 0xa0, 0xa0, 0xa0, 0xf0] }, //1111 0/1010 0/1010 0/1010 0/1111 0
    { width: 5, data: [0xf0, 0x10, 0xf0, 0x80, 0xf0] }, //1111 0/0001 0/1111 0/1000 0/1111 0
    { width: 5, data: [0xf0, 0x90, 0x90, 0x90, 0xf0] }, //1111 0/1001 0/1001 0/1001 0/1111 0
    { width: 5, data: [0x90, 0x90, 0xf0, 0x90, 0xf0] }, //1001 0/1001 0/1111 0/1001 0/1111 0
    { width: 6, data: [0xa8, 0xa8, 0xf8, 0xa8, 0xf8] }, //1010 1/1010 1/1111 1/1010 1/1111 1
    { width: 5, data: [0x40, 0x40, 0xa0, 0x90, 0x90] }, //0100 0/0100 0/1010 0/1001 0/1001 0
    { width: 6, data: [0x50, 0x50, 0xa8, 0xa8, 0xa8] }, //0101 0/0101 0/1010 1/1010 1/1010 1
    { width: 5, data: [0x60, 0x90, 0x90, 0x90, 0x60] }, //0110 0/1001 0/1001 0/1001 0/0110 0
    { width: 5, data: [0xf0, 0x40, 0x40, 0xa0, 0x90] }, //1111 0/0100 0/0100 0/1010 0/1001 0
    { width: 6, data: [0xf8, 0x50, 0x50, 0xa8, 0xa8] }, //1111 1/0101 0/0101 0/1010 1/1010 1
    { width: 5, data: [0x40, 0xf0, 0x40, 0xa0, 0x90] }, //0100 0/1111 0/0100 0/1010 0/1001 0
    { width: 5, data: [0xf0, 0x10, 0xf0, 0x10, 0x10] }, //1111 0/0001 0/1111 0/0001 0/0001 0
    { width: 5, data: [0xf0, 0x80, 0xf0, 0x80, 0xf0] }, //1111 0/1000 0/1111 0/1000 0/1111 0
    { width: 5, data: [0xf0, 0x60, 0x60, 0x60, 0xf0] }, //1111 0/0110 0/0110 0/0110 0/1111 0
    { width: 5, data: [0x60, 0xf0, 0x60, 0x90, 0x60] }, //0110 0/1111 0/0110 0/1001 0/0110 0
    { width: 6, data: [0xd0, 0x50, 0x68, 0x68, 0x68] }, //1101 0/0101 0/0110 1/0110 1/0110 1
    { width: 6, data: [0xb8, 0x90, 0x90, 0xa8, 0xe8] }, //1011 1/1001 0/1001 0/1010 1/1110 1
    { width: 6, data: [0x90, 0xb8, 0x90, 0xa8, 0xd0] }, //1001 0/1011 1/1001 0/1010 1/1101 0
    { width: 5, data: [0xf0, 0x50, 0xd0, 0x90, 0xd0] }, //1111 0/0101 0/1101 0/1001 0/1101 0
    { width: 6, data: [0xf8, 0x68, 0xe8, 0xa8, 0xf8] }, //1111 1/0110 1/1110 1/1010 1/1111 1
    { width: 6, data: [0xe8, 0x68, 0xf8, 0xa8, 0xf8] }, //1110 1/0110 1/1111 1/1010 1/1111 1
    { width: 6, data: [0xd0, 0x50, 0xe8, 0xa8, 0xe8] }, //1101 0/0101 0/1110 1/1010 1/1110 1
    { width: 5, data: [0xf0, 0x60, 0xf0, 0xa0, 0xf0] }, //1111 0/0110 0/1111 0/1010 0/1111 0
    { width: 6, data: [0xf8, 0x50, 0xf8, 0x90, 0xf8] }, //1111 1/0101 0/1111 1/1001 0/1111 1
    { width: 6, data: [0xd0, 0x78, 0xd0, 0xa8, 0xd0] }, //1101 0/0111 1/1101 0/1010 1/1101 0
    { width: 7, data: [0xa8, 0xa8, 0xf4, 0xb4, 0xf4] } //1010 10/1010 10/1111 01/1011 01/1111 01
];

const CHEESE_HAT_KO_JUNG = [
    { width: 4, data: [0x80, 0x80, 0xe0, 0x80, 0x80] }, //1000 0/1000 0/1110 0/1000 0/1000 0
    { width: 4, data: [0xa0, 0xa0, 0xe0, 0xa0, 0xa0] }, //1010 0/1010 0/1110 0/1010 0/1010 0
    { width: 4, data: [0x80, 0xe0, 0x80, 0xe0, 0x80] }, //1000 0/1110 0/1000 0/1110 0/1000 0
    { width: 4, data: [0xa0, 0xe0, 0xa0, 0xe0, 0xa0] }, //1010 0/1110 0/1010 0/1110 0/1010 0
    { width: 4, data: [0x20, 0x20, 0xe0, 0x20, 0x20] }, //0010 0/0010 0/1110 0/0010 0/0010 0
    { width: 4, data: [0x60, 0x60, 0xe0, 0x60, 0x60] }, //0110 0/0110 0/1110 0/0110 0/0110 0
    { width: 4, data: [0x20, 0xe0, 0x20, 0xe0, 0x20] }, //0010 0/1110 0/0010 0/1110 0/0010 0
    { width: 4, data: [0x60, 0xe0, 0x60, 0xe0, 0x60] }, //0110 0/1110 0/0110 0/1110 0/0110 0
    { width: 6, data: [0x00, 0x20, 0x20, 0xf8, 0x00] }, //0000 0/0010 0/0010 0/1111 1/0000 0
    { width: 6, data: [0x10, 0x50, 0x58, 0xf0, 0x10] }, //0001 0/0101 0/0101 1/1111 0/0001 0
    { width: 6, data: [0x18, 0x58, 0x58, 0xf8, 0x18] }, //0001 1/0101 1/0101 1/1111 1/0001 1
    { width: 5, data: [0x10, 0x50, 0x50, 0xf0, 0x10] }, //0001 0/0101 0/0101 0/1111 0/0001 0
    { width: 6, data: [0x00, 0x50, 0x50, 0xf8, 0x00] }, //0000 0/0101 0/0101 0/1111 1/0000 0
    { width: 6, data: [0x00, 0xf8, 0x20, 0x20, 0x00] }, //0000 0/1111 1/0010 0/0010 0/0000 0
    { width: 6, data: [0x08, 0xf8, 0x48, 0x58, 0x08] }, //0000 1/1111 1/0100 1/0101 1/0000 1
    { width: 6, data: [0x18, 0xf8, 0x58, 0x78, 0x18] }, //0001 1/1111 1/0101 1/0111 1/0001 1
    { width: 5, data: [0x10, 0x10, 0xf0, 0x50, 0x50] }, //0001 0/0001 0/1111 0/0101 0/0101 0
    { width: 6, data: [0x00, 0xf8, 0x50, 0x50, 0x00] }, //0000 0/1111 1/0101 0/0101 0/0000 0
    { width: 5, data: [0x00, 0x00, 0x00, 0xf0, 0x00] }, //0000 0/0000 0/0000 0/1111 0/0000 0
    { width: 5, data: [0x10, 0x10, 0x10, 0xf0, 0x10] }, //0001 0/0001 0/0001 0/1111 0/0001 0
    { width: 2, data: [0x80, 0x80, 0x80, 0x80, 0x80] } //1000 0/1000 0/1000 0/1000 0/1000 0
];

function CheeseHatColorLedBackground(size) {
    this.display = new Array(size);
    this.pos = { x: 0, y: 0 };
    this.reset();
}

CheeseHatColorLedBackground.prototype.clearDisplay = function() {
    const display = this.display;
    for(let i = 0; i < display.length; ++i) {
        display[i] = 0;
    }
};

CheeseHatColorLedBackground.prototype.clear = function() {
    this.data = {};
    this.clearDisplay();
    this.pos.x = 0;
    this.pos.y = 0;
};

CheeseHatColorLedBackground.prototype.reset = function() {
    this.clear();
};

function CheeseHatColorLedSprite(size) {
    this.size = size;
    this.display = new Array(size);
    this.pos = { x: 0, y: 0 };
    this.roi = {};
    this.rot = new Array(4);
    this.rotTmp = new Array(4);
    this.reset();
}

CheeseHatColorLedSprite.prototype.clearDisplay = function() {
    const display = this.display;
    for(let i = 0; i < display.length; ++i) {
        display[i] = 0;
    }
};

CheeseHatColorLedSprite.prototype.clear = function() {
    this.data = {};
    this.clearDisplay();
    this.width = 0;
    this.height = 0;
    const roi = this.roi;
    roi.left = this.size;
    roi.right = 0;
    roi.top = this.size;
    roi.bottom = 0;
};

CheeseHatColorLedSprite.prototype.reset = function() {
    this.clear();
    this.pos.x = 0;
    this.pos.y = 0;
    const rot = this.rot;
    rot[0] = 0; rot[1] = 1; rot[2] = 2; rot[3] = 3;
    this.visible = true;
};

function CheeseHatColorLedTouchCalculator(size) {
    this.size = size;
}

CheeseHatColorLedTouchCalculator.prototype.__checkTouch = function(display1, display2) {
    const size = this.size;
    for(let i = 0; i < size; ++i) {
        if(display1[i] & display2[i]) return true;
    }
    return false;
};

CheeseHatColorLedTouchCalculator.prototype.checkSprites = function(sprite1, sprite2) {
    if(sprite1 && sprite2) return this.__checkTouch(sprite1.display, sprite2.display);
    return false;
};

CheeseHatColorLedTouchCalculator.prototype.checkOtherSprite = function(sprites, i) {
    if(sprites) {
        const sprite = sprites[i];
        if(sprite) {
            let other;
            for(const j in sprites) {
                if(i != j) {
                    other = sprites[j];
                    if(other) {
                        if(this.__checkTouch(sprite.display, other.display)) return true;
                    }
                }
            }
        }
    }
    return false;
};

CheeseHatColorLedTouchCalculator.prototype.checkBackground = function(sprite, background) {
    if(sprite && background) return this.__checkTouch(sprite.display, background.display);
    return false;
};

CheeseHatColorLedTouchCalculator.prototype.checkLeftWall = function(sprite) {
    if(sprite) return sprite.roi.left < 0;
    return false;
};

CheeseHatColorLedTouchCalculator.prototype.checkRightWall = function(sprite) {
    if(sprite) return sprite.roi.right >= this.size;
    return false;
};

CheeseHatColorLedTouchCalculator.prototype.checkTopWall = function(sprite) {
    if(sprite) return sprite.roi.top < 0;
    return false;
};

CheeseHatColorLedTouchCalculator.prototype.checkBottomWall = function(sprite) {
    if(sprite) return sprite.roi.bottom >= this.size;
    return false;
};

CheeseHatColorLedTouchCalculator.prototype.checkAnyWall = function(sprite) {
    if(sprite) {
        const roi = sprite.roi;
        const size = this.size;
        return roi.left < 0 || roi.right >= size || roi.top < 0 || roi.bottom >= size;
    }
    return false;
};

function CheeseHatColorLedMatrix(id, size) {
    this.size = size;
    this.packet = new Array(20);
    this.packet[0] = (id & 0x0f) | 0x20;
    this.packet[1] = (id >> 4) & 0xff;
    this.background = new CheeseHatColorLedBackground(size);
    this.touchCalculator = new CheeseHatColorLedTouchCalculator(size);
    this.reset();
}

CheeseHatColorLedMatrix.prototype.reset = function() {
    const packet = this.packet;
    for(let i = 2; i < 20; ++i) {
        packet[i] = 0;
    }
    packet[19] = 20;
    this.background.reset();
    this.sprites = {};
    this.orderedKey = [];
    this.brightness = 20;
};

CheeseHatColorLedMatrix.prototype.getPacket = function() {
    return this.packet;
};

CheeseHatColorLedMatrix.prototype.__updateBackground = function(target, packet) {
    const data = target.data;
    const display = target.display;
    const pos = target.pos;
    let xy, px, py, value, index;
    
    target.clearDisplay();
    
    const size = this.size;
    for(const i in data) {
        if(data[i] > 0) {
            xy = parseInt(i);
            px = (xy >> 16) & 0xffff;
            if(px > 0x7fff) px -= 0x10000;
            px += pos.x;
            if(px >= 0 && px < size) {
                py = xy & 0xffff;
                if(py > 0x7fff) py -= 0x10000;
                py += pos.y;
                if(py >= 0 && py < size) {
                    value = 0x10 >> py;
                    display[px] |= value;
                    value = py * 5 + px;
                    index = parseInt(value / 2) + 2;
                    if(value % 2 == 1) {
                        packet[index] = (packet[index] & 0xf0) | (data[i] & 0x0f);
                    } else {
                        packet[index] = (packet[index] & 0x0f) | ((data[i] << 4) & 0xf0);
                    }
                }
            }
        }
    }
};

CheeseHatColorLedMatrix.prototype.__updateSprite = function(target, packet) {
    const data = target.data;
    const display = target.display;
    const pos = target.pos;
    const rot = target.rot;
    const rmp = target.rotTmp;
    const width = target.width, height = target.height;
    let xy, px, py, t, value, index;
    
    target.clearDisplay();
    
    if(width > 0 && height > 0) {
        const size = this.size;
        const roi = target.roi;
        const flip = ((rot[0] + 1) % 4) != rot[1];
        if(flip) {
            rmp[0] = rot[1];
            rmp[1] = rot[0];
            rmp[2] = rot[3];
            rmp[3] = rot[2];
        } else {
            rmp[0] = rot[0];
            rmp[1] = rot[1];
            rmp[2] = rot[2];
            rmp[3] = rot[3];
        }
        
        let count = 0;
        for(let i = 0; i < 4; ++i) {
            if(rmp[i] == 0) {
                count = i;
                break;
            }
        }
        
        if(flip) {
            if(count == 1) count = 3;
            else if(count == 3) count = 1;
        }
        
        for(const i in data) {
            if(data[i] > 0) {
                xy = parseInt(i);
                px = (xy >> 16) & 0xffff;
                if(px > 0x7fff) px -= 0x10000;
                py = xy & 0xffff;
                if(py > 0x7fff) py -= 0x10000;
                if(flip) {
                    px = width - 1 - px;
                }
                switch(count) {
                    case 1: {
                        t = px;
                        px = width - 1 - py;
                        py = t;
                        break;
                    }
                    case 2: {
                        px = width - 1 - px;
                        py = height - 1 - py;
                        break;
                    }
                    case 3: {
                        t = px;
                        px = py;
                        py = height - 1 - t;
                        break;
                    }
                }
                px += pos.x;
                if(px >= 0 && px < size) {
                    py += pos.y;
                    if(py >= 0 && py < size) {
                        value = 0x10 >> py;
                        display[px] |= value;
                        value = py * 5 + px;
                        index = parseInt(value / 2) + 2;
                        if(value % 2 == 1) {
                            packet[index] = (packet[index] & 0xf0) | (data[i] & 0x0f);
                        } else {
                            packet[index] = (packet[index] & 0x0f) | ((data[i] << 4) & 0xf0);
                        }
                    }
                }
                if(px < roi.left) roi.left = px;
                if(px > roi.right) roi.right = px;
                if(py < roi.top) roi.top = py;
                if(py > roi.bottom) roi.bottom = py;
            }
        }
    }
};

CheeseHatColorLedMatrix.prototype.update = function() {
    const packet = this.packet;
    for(let i = 2; i < 20; ++i) {
        packet[i] = 0;
    }
    this.__updateBackground(this.background, packet);
    const sprites = this.sprites;
    const orderedKey = this.orderedKey;
    let sprite, roi;
    const size = this.size;
    for(const i in orderedKey) {
        sprite = sprites[orderedKey[i]];
        if(sprite) {
            roi = sprite.roi;
            roi.left = size;
            roi.right = 0;
            roi.top = size;
            roi.bottom = 0;
            if(sprite.visible) {
                this.__updateSprite(sprite, packet);
            }
        }
    }
    packet[19] = this.brightness;
    return packet;
};

CheeseHatColorLedMatrix.prototype.__drawPixel = function(data, tx, ty, color) {
    data[((tx & 0xffff) << 16) | (ty & 0xffff)] = color;
};

CheeseHatColorLedMatrix.prototype.__drawShape = function(data, tx, ty, shape, width, color) {
    let value, mask;
    for(let y = 0; y < shape.length; ++y) {
        value = shape[y];
        mask = 0x80;
        for(let x = 0; x < width; ++x) {
            if(value & mask) {
                data[(((tx + x) & 0xffff) << 16) | (ty & 0xffff)] = color;
            }
            mask >>= 1;
        }
        ++ ty;
    }
};

CheeseHatColorLedMatrix.prototype.__KO_JAMO = [ [0], [0, 0], [0, 9], [2], [2, 12], [2, 18], [3], [3, 3], [5], [5, 0], [5, 6], [5, 7], [5, 9], [5, 16], [5, 17], [5, 18], [6], [7], [7, 7], [7, 9], [9], [9, 9], [11], [12], [12, 12], [14], [15], [16], [17], [18] ];
CheeseHatColorLedMatrix.prototype.__KO_CHO = [ [0], [0, 0], [2], [3], [3, 3], [5], [6], [7], [7, 7], [9], [9, 9], [11], [12], [12, 12], [14], [15], [16], [17], [18] ];
CheeseHatColorLedMatrix.prototype.__KO_JUNG = [ [0], [1], [2], [3], [4], [5], [6], [7], [8], [8, 0], [8, 1], [8, 20], [12], [13], [13, 4], [13, 5], [13, 20], [17], [18], [18, 20], [20] ];
CheeseHatColorLedMatrix.prototype.__KO_JONG = [ [], [0], [0, 0], [0, 9], [2], [2, 12], [2, 18], [3], [5], [5, 0], [5, 6], [5, 7], [5, 9], [5, 16], [5, 17], [5, 18], [6], [7], [7, 9], [9], [9, 9], [11], [12], [14], [15], [16], [17], [18] ];

CheeseHatColorLedMatrix.prototype.__drawString = function(data, tx, ty, text, len, color) {
    let t, width = 0, blank, index, shape;
    for(let j = 0; j < len; ++j) {
        t = text.charCodeAt(j);
        if(t == 32) {
            blank = true;
            tx += 5;
            width += 5;
        } else {
            blank = false;
            if(t >= 0x3131 && t <= 0x314E) {
                index = t - 0x3131;
                if(index >= 0 && index < 30) {
                    index = this.__KO_JAMO[index];
                    for(const i in index) {
                        shape = CHEESE_HAT_KO_CHO_JONG[index[i]];
                        this.__drawShape(data, tx, ty, shape.data, shape.width - 1, color);
                        tx += shape.width;
                        width += shape.width;
                        if(index.length > 1 && i == 0) {
                            tx --;
                            width --;
                        }
                    }
                }
            } else if(t >= 0x314F && t <= 0x3163) {
                index = t - 0x314F;
                if(index >= 0 && index < 21) {
                    index = this.__KO_JUNG[index];
                    for(const i in index) {
                        shape = CHEESE_HAT_KO_JUNG[index[i]];
                        this.__drawShape(data, tx, ty, shape.data, shape.width - 1, color);
                        tx += shape.width;
                        width += shape.width;
                        if(index.length > 1 && i == 0) {
                            tx --;
                            width --;
                        }
                    }
                }
            } else if(t >= 0xAC00 && t <= 0xD7A3) {
                t -= 0xAC00;
                
                index = Math.floor((t / 28) / 21);
                if(index >= 0 && index < 19) {
                    index = this.__KO_CHO[index];
                    for(const i in index) {
                        shape = CHEESE_HAT_KO_CHO_JONG[index[i]];
                        this.__drawShape(data, tx, ty, shape.data, shape.width - 1, color);
                        tx += shape.width;
                        width += shape.width;
                        if(index.length > 1 && i == 0) {
                            tx --;
                            width --;
                        }
                    }
                }
                
                index = Math.floor((t / 28) % 21);
                if(index >= 0 && index < 21) {
                    index = this.__KO_JUNG[index];
                    for(const i in index) {
                        shape = CHEESE_HAT_KO_JUNG[index[i]];
                        this.__drawShape(data, tx, ty, shape.data, shape.width - 1, color);
                        tx += shape.width;
                        width += shape.width;
                        if(index.length > 1 && i == 0) {
                            tx --;
                            width --;
                        }
                    }
                }
                
                index = t % 28;
                if(index > 0 && index < 28) {
                    index = this.__KO_JONG[index];
                    for(const i in index) {
                        shape = CHEESE_HAT_KO_CHO_JONG[index[i]];
                        this.__drawShape(data, tx, ty, shape.data, shape.width - 1, color);
                        tx += shape.width;
                        width += shape.width;
                        if(index.length > 1 && i == 0) {
                            tx --;
                            width --;
                        }
                    }
                }
                
                tx += 2;
                width += 2;
            } else {
                shape = CHEESE_HAT_ALPHABETS[text.charAt(j)];
                if(shape) {
                    this.__drawShape(data, tx, ty, shape.data, shape.width - 1, color);
                    tx += shape.width;
                    width += shape.width;
                }
            }
        }
    }
    if(blank) width -= 5; // last blank
    return width - 1;
};

CheeseHatColorLedMatrix.prototype.__drawPattern = function(data, tx, ty, value, start, len, color) {
    let ch, pos;
    for(let x = 0; x < len; ++x) {
        ch = value.charAt(start + x);
        pos = (((tx + x) & 0xffff) << 16) | (ty & 0xffff);
        if(ch === '1') {
            data[pos] = color;
        } else if(ch === '0') {
            data[pos] = 0;
        } else if(ch === '~') {
            if(data[pos] > 0) data[pos] = 0;
            else data[pos] = color;
        }
    }
};

CheeseHatColorLedMatrix.prototype.setBackgroundPixel = function(x, y, color) {
    const background = this.background;
    const pos = background.pos;
    const tx = x - pos.x, ty = y - pos.y;
    this.__drawPixel(background.data, tx, ty, color);
};

CheeseHatColorLedMatrix.prototype.drawBackgroundShape = function(x, y, shape, color) {
    shape = CHEESE_HAT_SHAPES[shape];
    if(shape) {
        const background = this.background;
        const pos = background.pos;
        const tx = x - pos.x, ty = y - pos.y;
        this.__drawShape(background.data, tx, ty, shape, 5, color);
        return true;
    }
    return false;
};

CheeseHatColorLedMatrix.prototype.drawBackgroundString = function(x, y, text, color) {
    const len = text.length;
    if(len > 0) {
        const background = this.background;
        const pos = background.pos;
        const tx = x - pos.x, ty = y - pos.y;
        this.__drawString(background.data, tx, ty, text, len, color);
        return true;
    }
    return false;
};

CheeseHatColorLedMatrix.prototype.drawBackgroundPattern = function(x, y, pattern, color) {
    pattern = pattern.trim();
    let len = pattern.length;
    if(len > 0) {
        const background = this.background;
        const data = background.data;
        const pos = background.pos;
        let start, end;
        const tx = x - pos.x;
        let ty = y - pos.y;
        const patterns = pattern.split('/');
        
        const candidates = {};
        let del = false;
        let cy = ty;
        for(const i in patterns) {
            pattern = patterns[i].trim();
            len = pattern.length;
            if(len > 0) {
                start = 0;
                end = false;
                if(pattern == '$') {
                    start = 1;
                    end = true;
                    len = 0;
                    del = true;
                } else {
                    if(pattern[len - 1] == '$') {
                        end = true;
                        -- len;
                        del = true;
                    }
                    if(pattern[0] == '$') {
                        start = 1;
                        -- len;
                        del = true;
                    }
                }
                candidates[cy] = [start, end, len, pattern];
            } else {
                candidates[cy] = undefined;
            }
            ++ cy;
        }
        
        let candidate;
        if(del) {
            let xy, px, py;
            for(const i in data) {
                xy = parseInt(i);
                py = xy & 0xffff;
                if(py > 0x7fff) py -= 0x10000;
                py += pos.y;
                candidate = candidates[py];
                if(candidate) {
                    px = (xy >> 16) & 0xffff;
                    if(px > 0x7fff) px -= 0x10000;
                    px += pos.x;
                    if((candidate[0] > 0 && px < tx) || (candidate[1] && px >= tx + candidate[2])) {
                        delete data[i];
                    }
                }
            }
        }
        
        for(const i in candidates) {
            candidate = candidates[i];
            if(candidate) {
                this.__drawPattern(data, tx, i, candidate[3], candidate[0], candidate[2], color);
            }
        }
        return true;
    }
    return false;
};

CheeseHatColorLedMatrix.prototype.clearBackground = function() {
    this.background.clear();
};

CheeseHatColorLedMatrix.prototype.clearAll = function() {
    this.background.clear();
    const sprites = this.sprites;
    let sprite;
    for(const i in sprites) {
        sprite = sprites[i];
        if(sprite) sprite.clear();
    }
};

CheeseHatColorLedMatrix.prototype.scrollBackgroundBy = function(x, y) {
    const pos = this.background.pos;
    pos.x += x;
    pos.y += y;
};

CheeseHatColorLedMatrix.prototype.scrollAllBy = function(x, y) {
    this.scrollBackgroundBy(x, y);
    const sprites = this.sprites;
    let sprite;
    for(const i in sprites) {
        sprite = sprites[i];
        if(sprite) {
            sprite.pos.x += x;
            sprite.pos.y += y;
        }
    }
};

CheeseHatColorLedMatrix.prototype.__getOrCreateSprite = function(i) {
    let sprite = this.sprites[i];
    if(!sprite) {
        sprite = this.sprites[i] = new CheeseHatColorLedSprite(this.size);
        this.orderedKey.push(i);
        this.orderedKey.sort((a, b) => {
            return a - b;
        });
    }
    return sprite;
};

CheeseHatColorLedMatrix.prototype.__getOrCreateEmptySprite = function(i) {
    let sprite = this.sprites[i];
    if(sprite) {
        sprite.data = {};
    } else {
        sprite = this.sprites[i] = new CheeseHatColorLedSprite(this.size);
        this.orderedKey.push(i);
        this.orderedKey.sort((a, b) => {
            return a - b;
        });
    }
    return sprite;
};

CheeseHatColorLedMatrix.prototype.__setSpriteShape = function(sprite, shape, color) {
    if(sprite) {
        shape = CHEESE_HAT_SHAPES[shape];
        if(shape) {
            sprite.width = 5;
            sprite.height = 5;
            this.__drawShape(sprite.data, 0, 0, shape, 5, color);
            return true;
        }
    }
    return false;
};

CheeseHatColorLedMatrix.prototype.setSpriteShape = function(i, shape, color) {
    if(i < 0) {
        const sprites = this.sprites;
        let res = false;
        for(const j in sprites) {
            if(this.__setSpriteShape(sprites[j], shape, color)) res = true;
        }
        return res;
    } else {
        const sprite = this.__getOrCreateEmptySprite(i);
        return this.__setSpriteShape(sprite, shape, color);
    }
};

CheeseHatColorLedMatrix.prototype.__setSpriteString = function(sprite, text, color) {
    if(sprite) {
        const len = text.length;
        if(len > 0) {
            sprite.width = this.__drawString(sprite.data, 0, 0, text, len, color);
            sprite.height = 5;
            return true;
        }
    }
    return false;
};

CheeseHatColorLedMatrix.prototype.setSpriteString = function(i, text, color) {
    if(i < 0) {
        const sprites = this.sprites;
        let res = false;
        for(const j in sprites) {
            if(this.__setSpriteString(sprites[j], text, color)) res = true;
        }
        return res;
    } else {
        const sprite = this.__getOrCreateEmptySprite(i);
        return this.__setSpriteString(sprite, text, color);
    }
};

CheeseHatColorLedMatrix.prototype.__setSpritePattern = function(sprite, pattern, color) {
    if(sprite) {
        pattern = pattern.trim();
        const len = pattern.length;
        if(len > 0) {
            const data = sprite.data;
            let ty = 0, width = 0;
            const patterns = pattern.split('/');
            for(const i in patterns) {
                pattern = patterns[i].trim();
                this.__drawPattern(data, 0, ty, pattern, 0, pattern.length, color);
                width = Math.max(width, pattern.length);
                ++ ty;
            }
            sprite.width = width;
            sprite.height = ty;
            return true;
        }
    }
    return false;
};

CheeseHatColorLedMatrix.prototype.setSpritePattern = function(i, pattern, color) {
    if(i < 0) {
        const sprites = this.sprites;
        let res = false;
        for(const j in sprites) {
            if(this.__setSpritePattern(sprites[j], pattern, color)) res = true;
        }
        return res;
    } else {
        const sprite = this.__getOrCreateEmptySprite(i);
        return this.__setSpritePattern(sprite, pattern, color);
    }
};

CheeseHatColorLedMatrix.prototype.clearSprite = function(i) {
    if(i < 0) {
        const sprites = this.sprites;
        let sprite;
        for(const j in sprites) {
            sprite = sprites[j];
            if(sprite) sprite.clear();
        }
    } else {
        const sprite = this.__getOrCreateSprite(i);
        sprite.clear();
    }
};

CheeseHatColorLedMatrix.prototype.showSprite = function(i) {
    if(i < 0) {
        const sprites = this.sprites;
        let sprite;
        for(const j in sprites) {
            sprite = sprites[j];
            if(sprite) sprite.visible = true;
        }
    } else {
        const sprite = this.__getOrCreateSprite(i);
        sprite.visible = true;
    }
};

CheeseHatColorLedMatrix.prototype.hideSprite = function(i) {
    if(i < 0) {
        const sprites = this.sprites;
        let sprite;
        for(const j in sprites) {
            sprite = sprites[j];
            if(sprite) sprite.visible = false;
        }
    } else {
        const sprite = this.__getOrCreateSprite(i);
        sprite.visible = false;
    }
};

CheeseHatColorLedMatrix.prototype.changeSpritePositionsBy = function(i, x, y) {
    if(i < 0) {
        const sprites = this.sprites;
        let sprite;
        for(const j in sprites) {
            sprite = sprites[j];
            if(sprite) {
                sprite.pos.x += x;
                sprite.pos.y += y;
            }
        }
    } else {
        const sprite = this.__getOrCreateSprite(i);
        sprite.pos.x += x;
        sprite.pos.y += y;
    }
};

CheeseHatColorLedMatrix.prototype.setSpritePositionsTo = function(i, x, y) {
    if(i < 0) {
        const sprites = this.sprites;
        let sprite;
        for(const j in sprites) {
            sprite = sprites[j];
            if(sprite) {
                sprite.pos.x = x;
                sprite.pos.y = y;
            }
        }
    } else {
        const sprite = this.__getOrCreateSprite(i);
        sprite.pos.x = x;
        sprite.pos.y = y;
    }
};

CheeseHatColorLedMatrix.prototype.changeSpritePositionBy = function(i, positionX, value) {
    if(i < 0) {
        const sprites = this.sprites;
        let sprite;
        for(const j in sprites) {
            sprite = sprites[j];
            if(sprite) {
                if(positionX) sprite.pos.x += value;
                else sprite.pos.y += value;
            }
        }
    } else {
        const sprite = this.__getOrCreateSprite(i);
        if(positionX) sprite.pos.x += value;
        else sprite.pos.y += value;
    }
};

CheeseHatColorLedMatrix.prototype.setSpritePositionTo = function(i, positionX, value) {
    if(i < 0) {
        const sprites = this.sprites;
        let sprite;
        for(const j in sprites) {
            sprite = sprites[j];
            if(sprite) {
                if(positionX) sprite.pos.x = value;
                else sprite.pos.y = value;
            }
        }
    } else {
        const sprite = this.__getOrCreateSprite(i);
        if(positionX) sprite.pos.x = value;
        else sprite.pos.y = value;
    }
};

CheeseHatColorLedMatrix.prototype.__rotateSprite = function(sprite, clockwise) {
    if(sprite) {
        const rot = sprite.rot;
        const t0 = rot[0], t1 = rot[1], t2 = rot[2], t3 = rot[3];
        if(clockwise) {
            rot[0] = t3;
            rot[1] = t0;
            rot[2] = t1;
            rot[3] = t2;
        } else {
            rot[0] = t1;
            rot[1] = t2;
            rot[2] = t3;
            rot[3] = t0;
        }
        
        const width = sprite.width, height = sprite.height;
        const shift = parseInt((width - height) / 2);
        sprite.pos.x += shift;
        sprite.pos.y -= shift;
        sprite.width = height;
        sprite.height = width;
    }
};

CheeseHatColorLedMatrix.prototype.rotateSprite = function(i, clockwise) {
    if(i < 0) {
        const sprites = this.sprites;
        for(const j in sprites) {
            this.__rotateSprite(sprites[j], clockwise);
        }
    } else {
        const sprite = this.__getOrCreateSprite(i);
        this.__rotateSprite(sprite, clockwise);
    }
};

CheeseHatColorLedMatrix.prototype.__flipSprite = function(sprite, horz) {
    if(sprite) {
        const rot = sprite.rot;
        const t0 = rot[0], t1 = rot[1], t2 = rot[2], t3 = rot[3];
        if(horz) {
            rot[0] = t1;
            rot[1] = t0;
            rot[2] = t3;
            rot[3] = t2;
        } else {
            rot[0] = t3;
            rot[1] = t2;
            rot[2] = t1;
            rot[3] = t0;
        }
    }
};

CheeseHatColorLedMatrix.prototype.flipSprite = function(i, horz) {
    if(i < 0) {
        const sprites = this.sprites;
        for(const j in sprites) {
            this.__flipSprite(sprites[j], horz);
        }
    } else {
        const sprite = this.__getOrCreateSprite(i);
        this.__flipSprite(sprite, horz);
    }
};

CheeseHatColorLedMatrix.prototype.__stampSprite = function(sprite) {
    if(sprite) {
        const background = this.background;
        const spriteData = sprite.data;
        const backgroundData = background.data;
        const spritePos = sprite.pos;
        const backgroundPos = background.pos;
        let xy, px, py;
        for(const i in spriteData) {
            xy = parseInt(i);
            px = (xy >> 16) & 0xffff;
            if(px > 0x7fff) px -= 0x10000;
            px += spritePos.x - backgroundPos.x;
            py = xy & 0xffff;
            if(py > 0x7fff) py -= 0x10000;
            py += spritePos.y - backgroundPos.y;
            backgroundData[((px & 0xffff) << 16) | (py & 0xffff)] = spriteData[i];
        }
    }
};

CheeseHatColorLedMatrix.prototype.stampSprite = function(i) {
    if(i < 0) {
        const sprites = this.sprites;
        for(const j in sprites) {
            this.__stampSprite(sprites[j]);
        }
    } else {
        this.__stampSprite(this.sprites[i]);
    }
};

CheeseHatColorLedMatrix.prototype.changeBrightnessBy = function(value) {
    value += this.brightness;
    if(value < 0) value = 0;
    else if(value > 100) value = 100;
    this.brightness = value;
};

CheeseHatColorLedMatrix.prototype.setBrightnessTo = function(value) {
    if(value < 0) value = 0;
    else if(value > 100) value = 100;
    this.brightness = value;
};

CheeseHatColorLedMatrix.prototype.getSpritePosition = function(i, positionX) {
    const sprite = this.sprites[i];
    if(sprite) {
        if(positionX) return sprite.pos.x;
        else return sprite.pos.y;
    }
    return 0;
};

CheeseHatColorLedMatrix.prototype.checkSpritesTouched = function(i, j) {
    return this.touchCalculator.checkSprites(this.sprites[i], this.sprites[j]);
};

CheeseHatColorLedMatrix.prototype.checkOtherSpriteTouched = function(i) {
    return this.touchCalculator.checkOtherSprite(this.sprites, i);
};

CheeseHatColorLedMatrix.prototype.checkBackgroundTouched = function(i) {
    return this.touchCalculator.checkBackground(this.sprites[i], this.background);
};

CheeseHatColorLedMatrix.prototype.checkWallTouched = function(i, direction) {
    switch(direction) {
        case -1: return this.touchCalculator.checkAnyWall(this.sprites[i]);
        case 0: return this.touchCalculator.checkLeftWall(this.sprites[i]);
        case 1: return this.touchCalculator.checkRightWall(this.sprites[i]);
        case 2: return this.touchCalculator.checkTopWall(this.sprites[i]);
        case 3: return this.touchCalculator.checkBottomWall(this.sprites[i]);
    }
    return false;
};

function CheeseRange() {
    this.__ranges = {};
}

CheeseRange.prototype.__getOrCreate = function(port) {
    let range = this.__ranges[port];
    if(!range) {
        range = this.__ranges[port] = {};
        this.__reset(range);
    }
    return range;
};

CheeseRange.prototype.__reset = function(range) {
    range.active = false;
    range.has_middle = false;
    range.has_decimal = true;
    range.in_lower = 0;
    range.in_middle = 127;
    range.in_upper = 255;
    range.out_lower = -100;
    range.out_middle = 0;
    range.out_upper = 100;
    range.out_min = -100;
    range.out_max = 100;
};

CheeseRange.prototype.reset = function() {
    const ranges = this.__ranges;
    for(const i in ranges) {
        this.__reset(ranges[i]);
    }
};

CheeseRange.prototype.setLowHigh = function(port, low1, high1, low2, high2, decimal) {
    const range = this.__getOrCreate(port);
    range.has_middle = false;
    range.has_decimal = decimal;
    range.in_lower = low1;
    range.in_upper = high1;
    range.out_lower = low2;
    range.out_upper = high2;
    range.out_min = Math.min(low2, high2);
    range.out_max = Math.max(low2, high2);
    range.active = true;
};

CheeseRange.prototype.setLowMidHigh = function(port, low1, mid1, high1, low2, mid2, high2, decimal) {
    const range = this.__getOrCreate(port);
    if(mid1 == low1 || mid1 == high1) {
        range.has_middle = false;
    } else {
        range.has_middle = true;
    }
    range.has_decimal = decimal;
    range.in_lower = low1;
    range.in_middle = mid1;
    range.in_upper = high1;
    range.out_lower = low2;
    range.out_middle = mid2;
    range.out_upper = high2;
    range.out_min = Math.min(low2, mid2, high2);
    range.out_max = Math.max(low2, mid2, high2);
    range.active = true;
};

CheeseRange.prototype.calc = function(port, value) {
    const range = this.__getOrCreate(port);
    if(range.active) {
        if(range.has_middle) {
            if(range.in_middle == range.in_upper || range.in_middle == range.in_lower) {
                if(range.in_lower == range.in_upper) {
                } else {
                    value = (range.out_upper - range.out_lower) * (value - range.in_lower) / (range.in_upper - range.in_lower) + range.out_lower;
                }
            } else {
                if(value > range.in_middle) {
                    value = (range.out_upper - range.out_middle) * (value - range.in_middle) / (range.in_upper - range.in_middle) + range.out_middle;
                } else {
                    value = (range.out_middle - range.out_lower) * (value - range.in_lower) / (range.in_middle - range.in_lower) + range.out_lower;
                }
            }
        } else {
            if(range.in_lower == range.in_upper) {
            } else {
                value = (range.out_upper - range.out_lower) * (value - range.in_lower) / (range.in_upper - range.in_lower) + range.out_lower;
            }
        }
        if(value < range.out_min) value = range.out_min;
        else if(value > range.out_max) value = range.out_max;
    }
    if(range.has_decimal) return value;
    else return Math.round(value);
};

function CheeseButtonCounter() {
    this.__counters = {};
}

CheeseButtonCounter.prototype.reset = function() {
    const counters = this.__counters;
    for(const i in counters) {
        counters[i] = 0;
    }
};

CheeseButtonCounter.prototype.tick = function() {
    const counters = this.__counters;
    for(const i in counters) {
        if(counters[i] > 0) --counters[i];
    }
};

CheeseButtonCounter.prototype.setCount = function(port, value) {
    this.__counters[port] = value;
};

CheeseButtonCounter.prototype.isCounting = function(port) {
    const counter = this.__counters[port];
    return (counter === undefined) ? false : counter > 0;
};

function CheeseLed(port) {
    this.__port = port;
    this.__PORT_A = port + 'a';
    this.__PORT_B = port + 'b';
    this.__PORT_C = port + 'c';
    this.reset();
}

CheeseLed.prototype.reset = function() {
    this.__r = 0;
    this.__g = 0;
    this.__b = 0;
    this.__anode = false;
    this.__portR = this.__PORT_A;
    this.__portG = this.__PORT_B;
    this.__portB = this.__PORT_C;
};

CheeseLed.prototype.setType = function(type) {
    switch(type) {
        case 'DEFAULT':
        case '-RGB': this.__anode = false; this.__portR = this.__PORT_A; this.__portG = this.__PORT_B; this.__portB = this.__PORT_C; break;
        case '-RBG': this.__anode = false; this.__portR = this.__PORT_A; this.__portB = this.__PORT_B; this.__portG = this.__PORT_C; break;
        case '-GRB': this.__anode = false; this.__portG = this.__PORT_A; this.__portR = this.__PORT_B; this.__portB = this.__PORT_C; break;
        case '-GBR': this.__anode = false; this.__portG = this.__PORT_A; this.__portB = this.__PORT_B; this.__portR = this.__PORT_C; break;
        case '-BRG': this.__anode = false; this.__portB = this.__PORT_A; this.__portR = this.__PORT_B; this.__portG = this.__PORT_C; break;
        case '-BGR': this.__anode = false; this.__portB = this.__PORT_A; this.__portG = this.__PORT_B; this.__portR = this.__PORT_C; break;
        case '+RGB': this.__anode = true; this.__portR = this.__PORT_A; this.__portG = this.__PORT_B; this.__portB = this.__PORT_C; break;
        case '+RBG': this.__anode = true; this.__portR = this.__PORT_A; this.__portB = this.__PORT_B; this.__portG = this.__PORT_C; break;
        case '+GRB': this.__anode = true; this.__portG = this.__PORT_A; this.__portR = this.__PORT_B; this.__portB = this.__PORT_C; break;
        case '+GBR': this.__anode = true; this.__portG = this.__PORT_A; this.__portB = this.__PORT_B; this.__portR = this.__PORT_C; break;
        case '+BRG': this.__anode = true; this.__portB = this.__PORT_A; this.__portR = this.__PORT_B; this.__portG = this.__PORT_C; break;
        case '+BGR': this.__anode = true; this.__portB = this.__PORT_A; this.__portG = this.__PORT_B; this.__portR = this.__PORT_C; break;
    }
};

CheeseLed.prototype.getR = function() {
    return this.__r;
};

CheeseLed.prototype.getG = function() {
    return this.__g;
};

CheeseLed.prototype.getB = function() {
    return this.__b;
};

CheeseLed.prototype.setRgb = function(r, g, b) {
    this.__r = r;
    this.__g = g;
    this.__b = b;
};

CheeseLed.prototype.isAnode = function() {
    return this.__anode;
};

CheeseLed.prototype.getPortR = function() {
    return this.__portR;
};

CheeseLed.prototype.getPortG = function() {
    return this.__portG;
};

CheeseLed.prototype.getPortB = function() {
    return this.__portB;
};

function CheeseButtonChecker() {
    this.reset();
}

CheeseButtonChecker.prototype.reset = function() {
    this.__state = 0;
    this.__pressTime = 0;
    this.__clicked = false;
    this.__longPressed = false;
    this.__clickedEvent = false;
    this.__longPressedEvent = false;
};

CheeseButtonChecker.prototype.clearEvent = function() {
    this.__clickedEvent = false;
    this.__longPressedEvent = false;
};

CheeseButtonChecker.prototype.check = function(pressed) {
    this.__clicked = false;
    this.__longPressed = false;
    switch(this.__state) {
        case 0: // ready state and wait for press
            if(pressed) {
                this.__pressTime = Date.now();
                this.__state = 1;
            }
            break;
        case 1: // check how long button is pressed
            if(pressed) {
                if(Date.now() - this.__pressTime > 1500) {
                    this.__longPressed = true;
                    this.__state = 2;
                }
            } else {
                if(Date.now() - this.__pressTime < 750) {
                    this.__clicked = true;
                }
                this.__state = 0;
            }
            break;
        case 2: // check release of long-click
            if(!pressed) this.__state = 0;
            break;
    }
    if(this.__clicked) this.__clickedEvent = true;
    if(this.__longPressed) this.__longPressedEvent = true;
};

CheeseButtonChecker.prototype.isClicked = function() {
    return this.__clickedEvent;
};

CheeseButtonChecker.prototype.isLongPressed = function() {
    return this.__longPressedEvent;
};

function CheeseNeopixel() {
    const packet = this.__packet = new Array(20);
    for(let i = 0; i < 20; ++i) packet[i] = 0;
    this.__reset();
}

CheeseNeopixel.prototype.__reset = function() {
    this.__cmdId = 0;
    this.__hasWhite = false;
    this.__numLeds = 0;
    this.__brightness = 128;
    this.__brightnessPerc = 50;
    this.__auto = true;
};

CheeseNeopixel.prototype.getPacket = function() {
    return this.__packet;
};

CheeseNeopixel.prototype.end = function() {
    const packet = this.__packet;
    packet[0] = this.__hasWhite ? 0x4d : 0x45;
    packet[1] = 0x50;
    packet[19] = 1;
    
    this.__reset();
    return packet;
};

CheeseNeopixel.prototype.setType = function(type) {
    switch(type) {
        case 0: // grb
            this.__hasWhite = false;
            break;
        case 1: // grbw
            this.__hasWhite = true;
            break;
    }
};

CheeseNeopixel.prototype.setNumLeds = function(value) {
    if(value < 0) value = 0;
    else if(value > 144) value = 144;
    this.__numLeds = value;
};

CheeseNeopixel.prototype.__preparePacket = function(cmd) {
    this.__cmdId = (this.__cmdId % 15) + 1;
    const packet = this.__packet;
    packet[0] = this.__hasWhite ? 0x4d : 0x45;
    packet[1] = ((cmd << 4) & 0xf0) | (this.__cmdId & 0x0f);
    for(let i = 2; i < 20; ++i) packet[i] = 0;
    packet[19] = this.__auto ? 1 : 0;
    return packet;
};

CheeseNeopixel.prototype.__setRgb = function(from, to, inc, r, g, b) {
    const packet = this.__preparePacket(0);
    if(from > to) {
        packet[2] = (inc == 0) ? from : ((from - to) % inc) + to;
        packet[3] = from;
    } else {
        packet[2] = from;
        packet[3] = to;
    }
    packet[4] = inc;
    packet[5] = 0;
    packet[6] = r;
    packet[7] = g;
    packet[8] = b;
    packet[9] = this.__brightness;
};

CheeseNeopixel.prototype.__changeRgb = function(from, to, inc, r, g, b) {
    const packet = this.__preparePacket(1);
    if(from > to) {
        packet[2] = (inc == 0) ? from : ((from - to) % inc) + to;
        packet[3] = from;
    } else {
        packet[2] = from;
        packet[3] = to;
    }
    packet[4] = inc;
    packet[10] = 0;
    if(r < 0) {
        r = -r;
        packet[10] |= 0x04;
    }
    if(g < 0) {
        g = -g;
        packet[10] |= 0x02;
    }
    if(b < 0) {
        b = -b;
        packet[10] |= 0x01;
    }
    packet[5] = 0;
    packet[6] = r;
    packet[7] = g;
    packet[8] = b;
    packet[9] = this.__brightness;
};

CheeseNeopixel.prototype.__clear = function(from, to, inc) {
    const packet = this.__preparePacket(3);
    if(from > to) {
        packet[2] = (inc == 0) ? from : ((from - to) % inc) + to;
        packet[3] = from;
    } else {
        packet[2] = from;
        packet[3] = to;
    }
    packet[4] = 0;
    packet[5] = this.__brightness;
    packet[6] = 1;
    packet[7] = (inc > 0) ? inc - 1 : inc;
};

CheeseNeopixel.prototype.__setPattern = function(from, to, pattern) {
    const packet = this.__preparePacket(3);
    if(from > to) {
        packet[2] = to;
        packet[3] = from;
    } else {
        packet[2] = from;
        packet[3] = to;
    }
    packet[4] = pattern;
    packet[5] = this.__brightness;
    packet[6] = packet[3] - packet[2] + 1;
    packet[7] = 0;
};

CheeseNeopixel.prototype.__shift = function(from, to, bit, shift, left) {
    const packet = this.__preparePacket(4);
    if(from > to) {
        packet[2] = to;
        packet[3] = from;
    } else {
        packet[2] = from;
        packet[3] = to;
    }
    packet[4] = bit;
    packet[5] = shift ? 0 : 1;
    packet[6] = left? 1 : 0;
    packet[7] = this.__brightness;
};

CheeseNeopixel.prototype.__setBrightness = function(from, to, inc, perc) {
    this.__brightnessPerc = perc;
    this.__brightness = parseInt(perc * 2.55);
    const packet = this.__preparePacket(2);
    if(from > to) {
        packet[2] = (inc == 0) ? from : ((from - to) % inc) + to;
        packet[3] = from;
    } else {
        packet[2] = from;
        packet[3] = to;
    }
    packet[4] = inc;
    packet[5] = this.__brightness;
    packet[6] = 255;
    packet[7] = 255;
    packet[8] = 255;
    packet[9] = 255;
};

CheeseNeopixel.prototype.setAllRgb = function(r, g, b) {
    this.__setRgb(0, this.__numLeds - 1, 1, r, g, b);
};

CheeseNeopixel.prototype.changeAllRgb = function(r, g, b) {
    this.__changeRgb(0, this.__numLeds - 1, 1, r, g, b);
};

CheeseNeopixel.prototype.setAllPattern = function(pattern) {
    this.__setPattern(0, this.__numLeds - 1, pattern);
};

CheeseNeopixel.prototype.setRgbAt = function(index, r, g, b) {
    if(index < 0 || index >= this.__numLeds) return false;
    this.__setRgb(index, index, 0, r, g, b);
    return true;
};

CheeseNeopixel.prototype.changeRgbAt = function(index, r, g, b) {
    if(index < 0 || index >= this.__numLeds) return false;
    this.__changeRgb(index, index, 0, r, g, b);
    return true;
};

CheeseNeopixel.prototype.setPatternAt = function(index, pattern) {
    if(index < 0 || index >= this.__numLeds) return false;
    this.__setPattern(index, index, pattern);
    return true;
};

CheeseNeopixel.prototype.setRgbFromTo = function(from, to, interval, r, g, b) {
    if(from < 0 || from >= this.__numLeds) return false;
    if(to < 0 || to >= this.__numLeds) return false;
    if(interval < 0) interval = -interval;
    if(interval >= this.__numLeds) return false;
    if(interval == 0) to = from;
    this.__setRgb(from, to, interval, r, g, b);
    return true;
};

CheeseNeopixel.prototype.changeRgbFromTo = function(from, to, interval, r, g, b) {
    if(from < 0 || from >= this.__numLeds) return false;
    if(to < 0 || to >= this.__numLeds) return false;
    if(interval < 0) interval = -interval;
    if(interval >= this.__numLeds) return false;
    if(interval == 0) to = from;
    this.__changeRgb(from, to, interval, r, g, b);
    return true;
};

CheeseNeopixel.prototype.setPatternFromTo = function(from, to, pattern) {
    if(from < 0 || from >= this.__numLeds) return false;
    if(to < 0 || to >= this.__numLeds) return false;
    this.__setPattern(from, to, pattern);
    return true;
};

CheeseNeopixel.prototype.clearAll = function() {
    this.__preparePacket(5);
};

CheeseNeopixel.prototype.clearAt = function(index) {
    if(index < 0 || index >= this.__numLeds) return false;
    this.__clear(index, index, 0);
    return true;
};

CheeseNeopixel.prototype.clearFromTo = function(from, to, interval) {
    if(from < 0 || from >= this.__numLeds) return false;
    if(to < 0 || to >= this.__numLeds) return false;
    if(interval < 0) interval = -interval;
    if(interval >= this.__numLeds) return false;
    if(interval >= 127) return false;
    if(interval == 0) to = from;
    this.__clear(from, to, interval);
    return true;
};

CheeseNeopixel.prototype.shiftAll = function(bit) {
    if(bit == 0) return false;
    if(bit < 0) {
        if(bit < -143) return false;
        this.__shift(0, this.__numLeds - 1, -bit, true, true);
    } else {
        if(bit > 143) return false;
        this.__shift(0, this.__numLeds - 1, bit, true, false);
    }
    return true;
};

CheeseNeopixel.prototype.rotateAll = function(bit) {
    if(bit == 0) return false;
    if(bit < 0) {
        if(bit < -143) return false;
        this.__shift(0, this.__numLeds - 1, -bit, false, true);
    } else {
        if(bit > 143) return false;
        this.__shift(0, this.__numLeds - 1, bit, false, false);
    }
    return true;
};

CheeseNeopixel.prototype.changeBrightnessBy = function(value) {
    value += this.__brightnessPerc;
    if(value < 0) value = 0;
    else if(value > 100) value = 100;
    this.__setBrightness(0, this.__numLeds - 1, 1, value);
};

CheeseNeopixel.prototype.setBrightnessTo = function(value) {
    if(value < 0) value = 0;
    else if(value > 100) value = 100;
    this.__setBrightness(0, this.__numLeds - 1, 1, value);
};

function CheesePid() {
    this.__buttonChecker1 = new CheeseButtonChecker();
    this.__buttonChecker2 = new CheeseButtonChecker();
    this.reset();
}

CheesePid.prototype.reset = function() {
    this.__distance = 0;
    this.__time = 0;
    this.__temperature = 0;
    this.__humidity = 0;
    this.__x1 = 0;
    this.__y1 = 0;
    this.__x2 = 0;
    this.__y2 = 0;
    this.__button1 = 0;
    this.__button2 = 0;
    this.__buttonChecker1.reset();
    this.__buttonChecker2.reset();
    this.__encoder = 0;
};

CheesePid.prototype.clearEvent = function() {
    this.__buttonChecker1.clearEvent();
    this.__buttonChecker2.clearEvent();
};

CheesePid.prototype.handleSensory = function(modePid, recv) {
    switch(modePid) {
        case 10: // ultrasonic
            this.__distance = (((recv[1] & 0xff) << 8) | (recv[2] & 0xff)) / 10.0;
            this.__time = ((recv[3] & 0xff) << 8) | (recv[4] & 0xff);
            break;
        case 11: // dht
            this.__humidity = (((recv[1] & 0xff) << 8) | (recv[2] & 0xff)) / 10.0;
            this.__temperature = (((recv[4] & 0xff) << 8) | (recv[5] & 0xff)) / 10.0;
            if(recv[3] > 0) this.__temperature = -this.__temperature;
            break;
        case 12: // ds18b20
            this.__temperature = (((recv[2] & 0xff) << 8) | (recv[3] & 0xff)) / 100.0;
            if(recv[1] > 0) this.__temperature = -this.__temperature;
            break;
        case 13: // joystick + button
            this.__x1 = recv[1];
            this.__y1 = recv[2];
            this.__button1 = recv[4];
            this.__button2 = recv[3];
            this.__buttonChecker1.check(this.__button1 == 1);
            this.__buttonChecker2.check(this.__button2 == 1);
            break;
        case 14: // dual joystick
            this.__x1 = recv[4];
            this.__y1 = recv[5];
            this.__button1 = recv[3];
            this.__x2 = recv[1];
            this.__y2 = recv[2];
            this.__button2 = recv[6];
            this.__buttonChecker1.check(this.__button1 == 1);
            this.__buttonChecker2.check(this.__button2 == 1);
            break;
        case 15: // ir transceiver
            break;
        case 16: { // encoder
            this.__button1 = 1 - recv[1];
            let val = (((recv[2] & 0xff) << 8) | (recv[3] & 0xff)) & 0x7ff;
            if(val > 0x3ff) val -= 0x800;
            this.__encoder = val;
            this.__buttonChecker1.check(this.__button1 == 1);
            break;
        }
    }
};

CheesePid.prototype.getDistance = function() {
    return this.__distance;
};

CheesePid.prototype.getTime = function() {
    return this.__time;
};

CheesePid.prototype.getTemperature = function() {
    return this.__temperature;
};

CheesePid.prototype.getHumidity = function() {
    return this.__humidity;
};

CheesePid.prototype.getX1 = function() {
    return this.__x1;
};

CheesePid.prototype.getY1 = function() {
    return this.__y1;
};

CheesePid.prototype.getX2 = function() {
    return this.__x2;
};

CheesePid.prototype.getY2 = function() {
    return this.__y2;
};

CheesePid.prototype.getButton1 = function() {
    return this.__button1;
};

CheesePid.prototype.getButton2 = function() {
    return this.__button2;
};

CheesePid.prototype.isButton1Clicked = function() {
    return this.__buttonChecker1.isClicked();
};

CheesePid.prototype.isButton2Clicked = function() {
    return this.__buttonChecker2.isClicked();
};

CheesePid.prototype.isButton1LongPressed = function() {
    return this.__buttonChecker1.isLongPressed();
};

CheesePid.prototype.isButton2LongPressed = function() {
    return this.__buttonChecker2.isLongPressed();
};

CheesePid.prototype.getEncoder = function() {
    return this.__encoder;
};

function CheeseHat010(sendPacket) {
    this.__sendPacket = sendPacket;
    this.__ledMatrix = new CheeseHatColorLedMatrix(10, 5);
    this.__buttonCheckerA = new CheeseButtonChecker();
    this.__buttonCheckerB = new CheeseButtonChecker();
    this.reset();
}

CheeseHat010.prototype.reset = function() { // mandatory
    this.__waiting = false;
    this.__requestId = 0;
    this.__requestPrevId = 0;
    this.__buttonA = 0;
    this.__buttonB = 0;
    this.__ledMatrix.reset();
    this.__buttonCheckerA.reset();
    this.__buttonCheckerB.reset();
};

CheeseHat010.prototype.clearEvent = function() { // mandatory
    this.__buttonCheckerA.clearEvent();
    this.__buttonCheckerB.clearEvent();
};

CheeseHat010.prototype.getPacket = function() { // mandatory
    return this.__ledMatrix.getPacket();
};

CheeseHat010.prototype.getLedMatrix = function() {
    return this.__ledMatrix;
};

CheeseHat010.prototype.getButtonA = function() {
    return this.__buttonA;
};

CheeseHat010.prototype.getButtonB = function() {
    return this.__buttonB;
};

CheeseHat010.prototype.isButtonAClicked = function() {
    return this.__buttonCheckerA.isClicked();
};

CheeseHat010.prototype.isButtonBClicked = function() {
    return this.__buttonCheckerB.isClicked();
};

CheeseHat010.prototype.isButtonALongPressed = function() {
    return this.__buttonCheckerA.isLongPressed();
};

CheeseHat010.prototype.isButtonBLongPressed = function() {
    return this.__buttonCheckerB.isLongPressed();
};

CheeseHat010.prototype.issueMatrixUpdate = function() {
    this.__ledMatrix.update();
    this.__requestId = (this.__requestId % 255) + 1;
};

CheeseHat010.prototype.handleSensory = function(recv) { // mandatory
    this.__buttonA = 1 - recv[2];
    this.__buttonB = 1 - recv[3];
    this.__buttonCheckerA.check(this.__buttonA == 1);
    this.__buttonCheckerB.check(this.__buttonB == 1);
};

CheeseHat010.prototype.handleRequest = function(sent) {
    if(this.__waiting && sent) this.__waiting = false;
    if(!this.__waiting) {
        if(this.__requestId != this.__requestPrevId) {
            this.__requestPrevId = this.__requestId;
            const packet = this.__ledMatrix.getPacket();
            if(packet) {
                this.__sendPacket(packet);
            }
        }
    }
};

function CheeseHat(sendPacket) {
    this.__sendPacket = sendPacket;
    this.__id = -1;
    this.__hat = undefined;
}

CheeseHat.prototype.__createHat = function(id) {
    this.__hat = undefined;
    switch(id) {
        case 10: this.__hat = new CheeseHat010(this.__sendPacket); break;
    }
    if(this.__hat) this.__id = id;
    return this.__hat;
};

CheeseHat.prototype.getHat = function(id) {
    if(id == this.__id) return this.__hat;
};

CheeseHat.prototype.reset = function() {
    if(this.__hat) this.__hat.reset();
    this.__id = -1;
    this.__hat = undefined;
};

CheeseHat.prototype.start = function(id) {
    let hat = this.getHat(id);
    if(!hat) {
        hat = this.__createHat(id);
        if(hat) {
            this.__sendPacket(hat.getPacket());
        }
    }
};

CheeseHat.prototype.end = function() {
    const hat = this.__hat;
    this.reset();
    if(hat) {
        this.__sendPacket(hat.getPacket());
    }
};

CheeseHat.prototype.clearEvent = function() {
    if(this.__hat) this.__hat.clearEvent();
};

CheeseHat.prototype.handleSensory = function(recv) {
    if(recv && (recv[0] & 0xf0) == 0x20) {
        const id = ((recv[1] & 0xff) << 4) | (recv[0] & 0x0f);
        if(id == this.__id && this.__hat) {
            this.__hat.handleSensory(recv);
        }
    }
};

CheeseHat.prototype.handleRequest = function(sent) {
    if(this.__hat && this.__hat.handleRequest) this.__hat.handleRequest(sent);
};

/**CheeseRobot**/
function CheeseRobot(index) {
    const self = this;
    self.sensory = {
        signalStrength: 0,
        accelerationX: 0,
        accelerationY: 0,
        accelerationZ: 0,
        internalTemperature: 0,
        inputSa: 0,
        inputSb: 0,
        inputSc: 0,
        inputLa: 0,
        inputLb: 0,
        inputLc: 0,
        tilt: 0,
        stepCount: 0,
        batteryState: 2,
    };
    self.motoring = {
        group: 'cheese',
        module: 'cheese',
        index,
    };
    self.stepId = 0;
    self.soundId = 0;
    self.writeHatId = 0;
    self.writePidId = 0;
    self.writeNeopixelId = 0;
    self.pulseScId = -1;
    self.pulseLcId = -1;
    self.freeFallId = -1;
    self.tapId = -1;
    self.stepStateId = -1;
    self.soundStateId = -1;
    self.hatStateId = -1;
    self.pidStateId = -1;
    self.neopixelStateId = -1;
    self.readHatId = -1;
    self.readPidId = -1;
    
    self.blockId = 0;
    self.stepMode = 0x90; // sw wave
    self.stepCallback = undefined;
    self.soundCallback = undefined;
    self.noteBlockId = 0;
    self.noteTimer1 = undefined;
    self.noteTimer2 = undefined;
    self.writeSerialCallbacks = [];
    self.readSerialCallbacks = [];
    self.serialInput = '';
    self.serialDelimiter = 0;
    self.serialPin = 2;
    self.serialRate = 0;
    self.serialSendId = 0;
    self.serialRecvId = -1;
    self.neopixelCallback = undefined;
    self.pulseSc = false;
    self.pulseLc = false;
    self.freeFall = false;
    self.tap = false;
    self.modeMab = 0;
    self.resetEncoderFlag = 0;
    self.tempo = 60;
    self.range = new CheeseRange();
    self.buttonCounter = new CheeseButtonCounter();
    self.buttonChecker = {};
    self.leds = {
        'S': new CheeseLed('S'),
        'L': new CheeseLed('L')
    };
    self.pid = new CheesePid();
    self.hat = new CheeseHat((packet) => {
        if(packet) {
            self.motoring.writeHat = packet;
            self.__issueHat();
        }
    });
    self.neopixel = new CheeseNeopixel();
    self.writeQueue = new RoboidWriteQueue(64);
    self.readQueue = new RoboidReadQueue(64);
    self.timeouts = [];
}

CheeseRobot.prototype.__PORT_MAP = {
    group: 'cheese',
    module: 'cheese',
    outputSa: 0,
    outputSb: 0,
    outputSc: 0,
    outputLa: 0,
    outputLb: 0,
    outputLc: 0,
    outputMab: 0,
    outputMcd: 0,
    buzzer: 0,
    velocity: 0,
    step: 0,
    stepId: 0,
    note: 0,
    sound: 0,
    soundRepeat: 1,
    soundId: 0,
    modeSa: 0,
    modeSb: 0,
    modeSc: 0,
    modeLa: 0,
    modeLb: 0,
    modeLc: 0,
    modeMab: 0,
    modeMcd: 0,
    modePid: 0,
    modeExt: 0
};

CheeseRobot.prototype.setZero = function() {
    const portMap = this.__PORT_MAP;
    const motoring = this.motoring;
    for (const port in portMap) {
        motoring[port] = portMap[port];
    }
    this.stepId = 0;
    this.soundId = 0;
    this.writeHatId = 0;
    this.writePidId = 0;
    this.writeNeopixelId = 0;
    this.pulseScId = -1;
    this.pulseLcId = -1;
    this.freeFallId = -1;
    this.tapId = -1;
    this.stepStateId = -1;
    this.soundStateId = -1;
    this.hatStateId = -1;
    this.pidStateId = -1;
    this.neopixelStateId = -1;
    this.readHatId = -1;
    this.readPidId = -1;
    
    this.blockId = 0;
    this.stepMode = 0x90; // sw wave
    this.stepCallback = undefined;
    this.soundCallback = undefined;
    this.noteBlockId = 0;
    this.noteTimer1 = undefined;
    this.noteTimer2 = undefined;
    this.writeSerialCallbacks = [];
    this.readSerialCallbacks = [];
    this.serialInput = '';
    this.serialDelimiter = 0;
    this.serialPin = 2;
    this.serialRate = 0;
    this.serialRecvId = -1;
    this.neopixelCallback = undefined;
    this.pulseSc = false;
    this.pulseLc = false;
    this.freeFall = false;
    this.tap = false;
    this.modeMab = 0;
    this.tempo = 60;
    
    this.range.reset();
    this.buttonCounter.reset();
    this.buttonChecker = {};
    for(const i in this.leds) {
        this.leds[i].reset();
    }
    this.pid.reset();
    this.hat.end();
    this.__cancelNeopixel();
    this.__setNeopixel(this.neopixel.end());
    this.__removeAllTimeouts();
    this.writeQueue.reset();
    this.readQueue.reset();
};

CheeseRobot.prototype.afterReceive = function(pd) {
    this.sensory = pd;
    this.handleSensory();
};

CheeseRobot.prototype.afterSend = function(sq) {
    this.pulseSc = false;
    this.pulseLc = false;
    this.freeFall = false;
    this.tap = false;
    let bc;
    for(const i in this.buttonChecker) {
        bc = this.buttonChecker[i];
        if(bc) bc.clearEvent();
    }
    this.pid.clearEvent();
    this.hat.clearEvent();
};

CheeseRobot.prototype.setMotoring = function(motoring) {
    this.motoring = motoring;
};

CheeseRobot.prototype.__setModule = function() {
    this.motoring.group = 'cheese';
    this.motoring.module = 'cheese';
};

CheeseRobot.prototype.__removeTimeout = function(id) {
    clearTimeout(id);
    const idx = this.timeouts.indexOf(id);
    if (idx >= 0) {
        this.timeouts.splice(idx, 1);
    }
};

CheeseRobot.prototype.__removeAllTimeouts = function() {
    const timeouts = this.timeouts;
    for (const i in timeouts) {
        clearTimeout(timeouts[i]);
    }
    this.timeouts = [];
};

CheeseRobot.prototype.__fireWriteSerialCallbacks = function() {
    const callbacks = this.writeSerialCallbacks;
    for (const i in callbacks) {
        callbacks[i]();
    }
    this.writeSerialCallbacks = [];
};

CheeseRobot.prototype.__fireReadSerialCallbacks = function() {
    const callbacks = this.readSerialCallbacks;
    for (const i in callbacks) {
        callbacks[i]();
    }
    this.readSerialCallbacks = [];
};

CheeseRobot.prototype.__setStep = function(step) {
    this.stepId = (this.stepId % 255) + 1;
    this.motoring.step = step;
    this.motoring.stepId = this.stepId;
};

CheeseRobot.prototype.__cancelStep = function() {
    this.stepCallback = undefined;
};

CheeseRobot.prototype.__setNote = function(note) {
    this.motoring.note = note;
};

CheeseRobot.prototype.__issueNoteBlockId = function() {
    this.noteBlockId = this.blockId = (this.blockId % 65535) + 1;
    return this.noteBlockId;
};

CheeseRobot.prototype.__cancelNote = function() {
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

CheeseRobot.prototype.__setSound = function(sound) {
    this.soundId = (this.soundId % 255) + 1;
    this.motoring.sound = sound;
    this.motoring.soundId = this.soundId;
};

CheeseRobot.prototype.__runSound = function(sound, count) {
    if(typeof count != 'number') count = 1;
    if(count < 0) count = -1;
    if(count) {
        this.motoring.soundRepeat = count;
        this.__setSound(sound);
    }
};

CheeseRobot.prototype.__cancelSound = function() {
    this.soundCallback = undefined;
};

CheeseRobot.prototype.__setModeSa = function(mode) {
    this.motoring.modeSa = mode;
};

CheeseRobot.prototype.__setModeSb = function(mode) {
    this.motoring.modeSb = mode;
};

CheeseRobot.prototype.__setModeSc = function(mode) {
    this.motoring.modeSc = mode;
};

CheeseRobot.prototype.__setModeLa = function(mode) {
    this.motoring.modeLa = mode;
};

CheeseRobot.prototype.__setModeLb = function(mode) {
    this.motoring.modeLb = mode;
};

CheeseRobot.prototype.__setModeLc = function(mode) {
    this.motoring.modeLc = mode;
};

CheeseRobot.prototype.__setModeMab = function(mode) {
    this.modeMab = mode;
    this.motoring.modeMab = mode;
};

CheeseRobot.prototype.__setModeMcd = function(mode) {
    this.motoring.modeMcd = mode;
};

CheeseRobot.prototype.__setModePid = function(mode) {
    this.motoring.modePid = mode;
};

CheeseRobot.prototype.__setSerialModePid = function() {
    this.motoring.outputLa = ((this.serialPin & 0x3) << 4) | (this.serialRate & 0x7);
    this.__setModeLa(255);
    this.__setModePid(0x03); // serial
};

CheeseRobot.prototype.__setModeExt = function(mode) {
    this.motoring.modeExt = mode;
};

CheeseRobot.prototype.__issueHat = function() {
    this.writeHatId = (this.writeHatId % 255) + 1;
    this.motoring.writeHatId = this.writeHatId;
};

CheeseRobot.prototype.__getOrCreateWritePidArray = function() {
    const motoring = this.motoring;
    if(motoring.writePid == undefined) {
        motoring.writePid = new Array(20);
        for(let i = 0; i < 20; ++i) motoring.writePid[i] = 0;
    }
    return motoring.writePid;
};

CheeseRobot.prototype.__issuePid = function() {
    this.writePidId = (this.writePidId % 255) + 1;
    this.motoring.writePidId = this.writePidId;
};

CheeseRobot.prototype.__setSerial = function(arr) {
    var pid = this.__getOrCreateWritePidArray();
    this.serialSendId = (this.serialSendId % 15) + 1;
    pid[0] = 0x30 | (this.serialSendId & 0x0f);
    for(let i = 1, j = 0; i < 20; ++i, ++j) {
        pid[i] = arr[j];
    }
    this.__issuePid();
};

CheeseRobot.prototype.__setNeopixel = function(packet) {
    this.__setModeSa(0x08); // neopixel output
    this.motoring.writeNeopixel = packet;
    this.__issueNeopixel();
};

CheeseRobot.prototype.__issueNeopixel = function() {
    this.writeNeopixelId = (this.writeNeopixelId % 255) + 1;
    this.motoring.writeNeopixelId = this.writeNeopixelId;
};

CheeseRobot.prototype.__cancelNeopixel = function() {
    this.neopixelCallback = undefined;
};

CheeseRobot.prototype.__isNeopixelIdle = function() {
    return this.neopixelCallback === undefined;
};

CheeseRobot.prototype.handleSensory = function() {
    const self = this;
    const sensory = self.sensory;

    self.pulseSc = sensory.pulseSc == 1;
    self.pulseLc = sensory.pulseLc == 1;
    self.freeFall = sensory.freeFall == 1;
    self.tap = sensory.tap == 1;
    
    if(self.stepCallback) {
        if(sensory.stepStateId != self.stepStateId) {
            self.stepStateId = sensory.stepStateId;
            if(sensory.stepState == 0) {
                self.motoring.velocity = 0;
                var callback = self.stepCallback;
                self.__cancelStep();
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
    self.buttonCounter.tick();
    let bc;
    for(const i in self.buttonChecker) {
        bc = self.buttonChecker[i];
        if(bc) {
            if(self.buttonCounter.isCounting(i)) {
                bc.check(false);
            } else {
                bc.check(sensory['input' + i] == 1);
            }
        }
    }
    
    if(sensory.readPidId != self.readPidId) {
        if(self.readPidId >= 0) {
            const recv = sensory.readPid;
            if(recv && (recv[0] & 0xf0) == 0x30) {
                const id = recv[0] & 0x0f;
                if(self.motoring.modePid == 3) { // serial
                    if(id != self.serialRecvId) {
                        if(self.serialRecvId != -1) {
                            self.readQueue.push(recv, 1);
                        }
                        self.serialRecvId = id;
                    }
                } else if(id > 0) {
                    self.pid.handleSensory(self.motoring.modePid, recv);
                }
            }
        }
        self.readPidId = sensory.readPidId;
    }
    if(sensory.readHatId != self.readHatId) {
        if(self.readHatId >= 0) {
            self.hat.handleSensory(sensory.readHat);
        }
        self.readHatId = sensory.readHatId;
    }
    let hatSent = false;
    if(sensory.hatStateId != self.hatStateId) {
        self.hatStateId = sensory.hatStateId;
        if(sensory.hatState == 1) {
            hatSent = true;
        }
    }
    this.hat.handleRequest(hatSent);
    if(sensory.pidStateId != self.pidStateId) {
        self.pidStateId = sensory.pidStateId;
        if(sensory.pidState == 1) {
            const tmp = self.writeQueue.pop();
            if(self.motoring.modePid == 3) { // serial
                if(tmp) {
                    self.__setSerial(tmp);
                } else {
                    self.__fireWriteSerialCallbacks();
                }
            }
        }
    }
    if(sensory.neopixelStateId != self.neopixelStateId) {
        self.neopixelStateId = sensory.neopixelStateId;
        if(sensory.neopixelState == 1) {
            const callback = self.neopixelCallback;
            self.__cancelNeopixel();
            if(callback) callback();
        }
    }
    if(self.readSerialCallbacks.length > 0) {
        const tmp = self.readQueue.pop(self.serialDelimiter);
        if(tmp && self.motoring.modePid == 3) { // serial
            self.serialInput = tmp;
            self.__fireReadSerialCallbacks();
        }
    }
};

CheeseRobot.prototype.__SENSORS = {
    SIGNAL_STRENGTH: 'signalStrength',
    ACCELERATION_X: 'accelerationX',
    ACCELERATION_Y: 'accelerationY',
    ACCELERATION_Z: 'accelerationZ',
};

CheeseRobot.prototype.getValue = function(script) {
    this.__setModule();
    const dev = script.getField('DEVICE');

    const sensor = this.__SENSORS[dev] || dev;
    return this.sensory[sensor];
};

CheeseRobot.prototype.checkBoolean = function(script) {
    this.__setModule();
    const dev = script.getField('DEVICE');
    switch(dev) {
        case 'TILT_FORWARD': return this.sensory.tilt == 1;
        case 'TILT_BACKWARD': return this.sensory.tilt == -1;
        case 'TILT_LEFT': return this.sensory.tilt == 2;
        case 'TILT_RIGHT': return this.sensory.tilt == -2;
        case 'TILT_FLIP': return this.sensory.tilt == 3;
        case 'TILT_NOT': return this.sensory.tilt == -3;
        case 'TAP': return this.tap;
        case 'FREE_FALL': return this.freeFall;
        case 'BATTERY_NORMAL': return this.sensory.batteryState === 2;
        case 'BATTERY_LOW': return this.sensory.batteryState === 1;
        case 'BATTERY_EMPTY': return this.sensory.batteryState === 0;
    }
    return false;
};

CheeseRobot.prototype.__SOUNDS = {
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

CheeseRobot.prototype.playSound = function(script) {
    this.__setModule();
    this.__cancelNote();
    this.__cancelSound();

    let sound = script.getField('SOUND');
    let count = script.getNumberValue('COUNT');

    sound = this.__SOUNDS[sound];
    count = parseInt(count);
    this.motoring.buzzer = 0;
    this.__setNote(0);
    if (sound && count) {
        this.__runSound(sound, count);
    } else {
        this.__runSound(0);
    }
    return script.callReturn();
};

CheeseRobot.prototype.playSoundUntil = function(script) {
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
        this.__setNote(0);
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

CheeseRobot.prototype.setBuzzer = function(script) {
    this.__setModule();
    this.__cancelNote();
    this.__cancelSound();
    let hz = script.getNumberValue('HZ');

    hz = parseFloat(hz);
    if (typeof hz == 'number') {
        this.motoring.buzzer = hz;
    }
    this.__setNote(0);
    this.__runSound(0);
    return script.callReturn();
};

CheeseRobot.prototype.changeBuzzer = function(script) {
    this.__setModule();
    this.__cancelNote();
    this.__cancelSound();
    let hz = script.getNumberValue('HZ');

    hz = parseFloat(hz);
    if (typeof hz == 'number') {
        const motoring = this.motoring;
        motoring.buzzer = motoring.buzzer != undefined ? motoring.buzzer + hz : hz;
    }
    this.__setNote(0);
    this.__runSound(0);
    return script.callReturn();
};

CheeseRobot.prototype.clearSound = function(script, motoring) {
    this.__setModule();
    this.__cancelNote();
    this.__cancelSound();

    this.motoring.buzzer = 0;
    this.__setNote(0);
    this.__runSound(0);
    return script.callReturn();
};

CheeseRobot.prototype.__NOTES = {
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

CheeseRobot.prototype.playNote = function(script) {
    this.__setModule();
    this.__cancelNote();
    this.__cancelSound();

    let note = script.getField('NOTE');
    let octave = script.getNumberField('OCTAVE');

    note = parseInt(this.__NOTES[note]);
    octave = parseInt(octave);
    this.motoring.buzzer = 0;
    if (note && octave && octave > 0 && octave < 8) {
        note += (octave - 1) * 12;
        this.__setNote(note);
    } else {
        this.__setNote(0);
    }
    this.__runSound(0);
    return script.callReturn();
};

CheeseRobot.prototype.playNoteBeat = function(script) {
    const self = this;
    self.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isPlaying = true;
        self.__cancelNote();
        self.__cancelSound();

        let note = script.getField('NOTE');
        let octave = script.getNumberField('OCTAVE');
        let beat = script.getNumberValue('BEAT');

        note = parseInt(this.__NOTES[note]);
        octave = parseInt(octave);
        beat = parseFloat(beat);
        self.motoring.buzzer = 0;
        if (note && octave && octave > 0 && octave < 8 && beat && beat > 0 && self.tempo > 0) {
            const id = self.__issueNoteBlockId();
            note += (octave - 1) * 12;
            self.__setNote(note);
            const timeValue = (beat * 60 * 1000) / self.tempo;
            if (timeValue > 100) {
                self.noteTimer1 = setTimeout(() => {
                    if (self.noteBlockId == id) {
                        self.__setNote(0);
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
                    self.__setNote(0);
                    self.__cancelNote();
                    script.isPlaying = false;
                }
            }, timeValue);
            self.timeouts.push(self.noteTimer2);
            self.__runSound(0);
        } else {
            self.__setNote(0);
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
        self.__setNote(0);
        return script.callReturn();
    }
};

CheeseRobot.prototype.restBeat = function(script) {
    const self = this;
    self.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isPlaying = true;
        self.__cancelNote();
        self.__cancelSound();
        let beat = script.getNumberValue('BEAT');

        beat = parseFloat(beat);
        self.motoring.buzzer = 0;
        self.__setNote(0);
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

CheeseRobot.prototype.setTempo = function(script) {
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

CheeseRobot.prototype.changeTempo = function(script) {
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

CheeseRobot.prototype.setSoundPort = function(script) {
    this.__setModule();
    const port = script.getField('PORT');
    
    if(port == 'INTERNAL') {
        this.motoring.modeMab = this.modeMab;
    } else {
        this.motoring.modeMab = 0x03; // sound out
    }
    return script.callReturn();
};

CheeseRobot.prototype.__LITERAL_TO_PORT = {
    SA: 'Sa',
    SB: 'Sb',
    SC: 'Sc',
    LA: 'La',
    LB: 'Lb',
    LC: 'Lc',
    MAB: 'Mab',
    MCD: 'Mcd',
    MABC: 'Mabc'
};

CheeseRobot.prototype.__INPUT_SL_MODES = {
    MAKEY: 0x00,
    BUTTON: 0x90,
    DIGITAL_PULL_UP: 0x10,
    DIGITAL_PULL_DOWN: 0x20,
    PULSE: 0x04,
    PULSE_PULL_UP: 0x14,
    PULSE_PULL_DOWN: 0x24,
    ANALOG: 0x01,
    VOLTAGE: 0xc1,
};

CheeseRobot.prototype.setInputModeTo = function(script) {
    this.__setModule();
    
    const port = this.__LITERAL_TO_PORT[script.getField('PORT')];
    let mode = script.getField('MODE');

    mode = this.__INPUT_SL_MODES[mode];
    if(mode == 0x90) {
        this.buttonCounter.setCount(port, 10);
        this.buttonChecker[port] = new CheeseButtonChecker();
    } else {
        this.buttonCounter.setCount(port, 0);
    }
    switch(port) {
        case 'Sa': this.__setModeSa(mode); break;
        case 'Sb': this.__setModeSb(mode); break;
        case 'Sc': this.__setModeSc(mode); break;
        case 'La': this.__setModeLa(mode); break;
        case 'Lb': this.__setModeLb(mode); break;
        case 'Lc': this.__setModeLc(mode); break;
    }
    return script.callReturn();
};

CheeseRobot.prototype.setInputRangeTo = function(script) {
    this.__setModule();
    
    const port = this.__LITERAL_TO_PORT[script.getField('PORT')];
    let low1 = script.getNumberValue('LOW1');
    let high1 = script.getNumberValue('HIGH1');
    let low2 = script.getNumberValue('LOW2');
    let high2 = script.getNumberValue('HIGH2');
    const decimal = script.getField('DECIMAL');

    low1 = parseFloat(low1);
    high1 = parseFloat(high1);
    low2 = parseFloat(low2);
    high2 = parseFloat(high2);
    if((typeof low1 == 'number') && (typeof high1 == 'number') && (typeof low2 == 'number') && (typeof high2 == 'number')) {
        this.range.setLowHigh(port, low1, high1, low2, high2, decimal == 'REAL');
    }
    return script.callReturn();
};

CheeseRobot.prototype.setThreeInputRangesTo = function(script) {
    this.__setModule();
    
    const port = this.__LITERAL_TO_PORT[script.getField('PORT')];
    let low1 = script.getNumberValue('LOW1');
    let mid1 = script.getNumberValue('MIDDLE1');
    let high1 = script.getNumberValue('HIGH1');
    let low2 = script.getNumberValue('LOW2');
    let mid2 = script.getNumberValue('MIDDLE2');
    let high2 = script.getNumberValue('HIGH2');
    const decimal = script.getField('DECIMAL');

    low1 = parseFloat(low1);
    mid1 = parseFloat(mid1);
    high1 = parseFloat(high1);
    low2 = parseFloat(low2);
    mid2 = parseFloat(mid2);
    high2 = parseFloat(high2);
    if((typeof low1 == 'number') && (typeof mid1 == 'number') && (typeof high1 == 'number') && (typeof low2 == 'number') && (typeof mid2 == 'number') && (typeof high2 == 'number')) {
        this.range.setLowMidHigh(port, low1, mid1, high1, low2, mid2, high2, decimal == 'REAL');
    }
    return script.callReturn();
};

CheeseRobot.prototype.__PORT_TO_INPUTS = {
    Sa: 'inputSa',
    Sb: 'inputSb',
    Sc: 'inputSc',
    La: 'inputLa',
    Lb: 'inputLb',
    Lc: 'inputLc'
};

CheeseRobot.prototype.getAnalogInput = function(script) {
    this.__setModule();
    
    const port = this.__LITERAL_TO_PORT[script.getField('PORT')];
    
    const dev = this.__PORT_TO_INPUTS[port];
    if(dev) {
        let val = this.sensory[dev];
        if(this.buttonCounter.isCounting(port)) val = 0;
        return this.range.calc(port, val);
    }
    return 0;
};

CheeseRobot.prototype.checkDigitalInput = function(script) {
    this.__setModule();
    
    const port = this.__LITERAL_TO_PORT[script.getField('PORT')];
    const value = Number(script.getField('VALUE'));
    
    const dev = this.__PORT_TO_INPUTS[port];
    if(dev) {
        let val = this.sensory[dev];
        if(this.buttonCounter.isCounting(port)) val = 0;
        return val === parseInt(value);
    }
    return false;
};

CheeseRobot.prototype.checkButtonState = function(script) {
    this.__setModule();
    
    const port = this.__LITERAL_TO_PORT[script.getField('PORT')];
    const state = script.getField('STATE');
    
    if(this.buttonCounter.isCounting(port)) return false;
    const bc = this.buttonChecker[port];
    if(bc) {
        switch(state) {
            case 'CLICKED': return bc.isClicked();
            case 'LONG_PRESSED': return bc.isLongPressed();
        }
    }
    return false;
};

CheeseRobot.prototype.checkPulseInput = function(script) {
    this.__setModule();
    const port = this.__LITERAL_TO_PORT[script.getField('PORT')];
    
    switch(port) {
        case 'Sc': return this.pulseSc;
        case 'Lc': return this.pulseLc;
    }
    return false;
};

CheeseRobot.prototype.__setDigitalOutputMode = function(port) {
    switch(port) {
        case 'Sa': this.__setModeSa(0x82); break;
        case 'Sb': this.__setModeSb(0x82); break;
        case 'Sc': this.__setModeSc(0x82); break;
        case 'La': this.__setModeLa(0x82); break;
        case 'Lb': this.__setModeLb(0x82); break;
        case 'Lc': this.__setModeLc(0x82); break;
        case 'Mab': this.__setModeMab(0x00); break;
        case 'Mcd': this.__setModeMcd(0x00); break;
    }
};

CheeseRobot.prototype.__PORT_TO_OUTPUTS = {
    Sa: 'outputSa',
    Sb: 'outputSb',
    Sc: 'outputSc',
    La: 'outputLa',
    Lb: 'outputLb',
    Lc: 'outputLc',
    Mab: 'outputMab',
    Mcd: 'outputMcd',
    Mabc: 'outputMab'
};

CheeseRobot.prototype.setDigitalOutput = function(script) {
    this.__setModule();
    
    const port = this.__LITERAL_TO_PORT[script.getField('PORT')];
    let value = Number(script.getField('VALUE'));
    
    const dev = this.__PORT_TO_OUTPUTS[port];
    if(dev) {
        value = parseInt(value);
        if(typeof value == 'number') {
            this.__setDigitalOutputMode(port);
            this.motoring[dev] = value;
        }
    }
    return script.callReturn();
};

CheeseRobot.prototype.__setPwmOutputMode = function(port) {
    switch(port) {
        case 'Sa': this.__setModeSa(0x02); break;
        case 'Sb': this.__setModeSb(0x02); break;
        case 'Sc': this.__setModeSc(0x02); break;
        case 'La': this.__setModeLa(0x02); break;
        case 'Lb': this.__setModeLb(0x02); break;
        case 'Lc': this.__setModeLc(0x02); break;
    }
};

CheeseRobot.prototype.changePwmOutput = function(script) {
    this.__setModule();
    
    const port = this.__LITERAL_TO_PORT[script.getField('PORT')];
    let value = script.getNumberValue('VALUE');
    
    const dev = this.__PORT_TO_OUTPUTS[port];
    if(dev) {
        value = parseFloat(value);
        if(typeof value == 'number') {
            let val = this.motoring[dev];
            this.__setPwmOutputMode(port);
            this.motoring[dev] = (val != undefined) ? val + value : value;
        }
    }
    return script.callReturn();
};

CheeseRobot.prototype.setPwmOutput = function(script) {
    this.__setModule();
    
    const port = this.__LITERAL_TO_PORT[script.getField('PORT')];
    let value = script.getNumberValue('VALUE');
    
    const dev = this.__PORT_TO_OUTPUTS[port];
    if(dev) {
        value = parseFloat(value);
        if(typeof value == 'number') {
            this.__setPwmOutputMode(port);
            this.motoring[dev] = value;
        }
    }
    return script.callReturn();
};

CheeseRobot.prototype.__setServoMotorMode = function(port) {
    switch(port) {
        case 'Sa': this.__setModeSa(0x03); break;
        case 'Sb': this.__setModeSb(0x03); break;
        case 'Sc': this.__setModeSc(0x03); break;
        case 'La': this.__setModeLa(0x03); break;
        case 'Lb': this.__setModeLb(0x03); break;
        case 'Lc': this.__setModeLc(0x03); break;
        case 'Mab': this.__setModeMab(0x02); break;
        case 'Mcd': this.__setModeMcd(0x02); break;
        case 'Mabc': this.__setModeMab(0x40); break;
    }
};

CheeseRobot.prototype.changeServoMotorAngle = function(script) {
    this.__setModule();
    
    const port = this.__LITERAL_TO_PORT[script.getField('PORT')];
    let value = script.getNumberValue('VALUE');
    
    const dev = this.__PORT_TO_OUTPUTS[port];
    if(dev) {
        value = parseFloat(value);
        if(typeof value == 'number') {
            let val = this.motoring[dev];
            value = (val != undefined) ? val + value : value;
            if(value < 1) value = 1;
            else if(value > 180) value = 180;
            this.__setServoMotorMode(port);
            this.motoring[dev] = value;
        }
    }
    return script.callReturn();
};

CheeseRobot.prototype.setServoMotorAngle = function(script) {
    this.__setModule();
    
    const port = this.__LITERAL_TO_PORT[script.getField('PORT')];
    let value = script.getNumberValue('VALUE');
    
    const dev = this.__PORT_TO_OUTPUTS[port];
    if(dev) {
        value = parseFloat(value);
        if(typeof value == 'number') {
            if(value < 1) value = 1;
            else if(value > 180) value = 180;
            this.__setServoMotorMode(port);
            this.motoring[dev] = value;
        }
    }
    return script.callReturn();
};

CheeseRobot.prototype.turnOffServoMotor = function(script) {
    this.__setModule();
    
    const port = this.__LITERAL_TO_PORT[script.getField('PORT')];
    
    const dev = this.__PORT_TO_OUTPUTS[port];
    if(dev) {
        this.__setServoMotorMode(port);
        this.motoring[dev] = 0;
    }
    return script.callReturn();
};

CheeseRobot.prototype.__setDcMotorMode = function(port) {
    switch(port) {
        case 'Mab': this.__setModeMab(0x01); break;
        case 'Mcd': this.__setModeMcd(0x01); break;
    }
};

CheeseRobot.prototype.changeDcMotorVelocity = function(script) {
    this.__setModule();
    
    const port = this.__LITERAL_TO_PORT[script.getField('PORT')];
    let value = script.getNumberValue('VALUE');
    
    const dev = this.__PORT_TO_OUTPUTS[port];
    if(dev) {
        value = parseFloat(value);
        if(typeof value == 'number') {
            let val = this.motoring[dev];
            value = (val != undefined) ? val + value : value;
            if(value < -100) value = -100;
            else if(value > 100) value = 100;
            this.__setDcMotorMode(port);
            this.motoring[dev] = value;
        }
    }
    return script.callReturn();
};

CheeseRobot.prototype.setDcMotorVelocity = function(script) {
    this.__setModule();
    
    const port = this.__LITERAL_TO_PORT[script.getField('PORT')];
    let value = script.getNumberValue('VALUE');
    
    const dev = this.__PORT_TO_OUTPUTS[port];
    if(dev) {
        value = parseFloat(value);
        if(typeof value == 'number') {
            if(value < -100) value = -100;
            else if(value > 100) value = 100;
            this.__setDcMotorMode(port);
            this.motoring[dev] = value;
        }
    }
    return script.callReturn();
};

CheeseRobot.prototype.stopDcMotor = function(script) {
    this.__setModule();
    
    const port = this.__LITERAL_TO_PORT[script.getField('PORT')];
    
    const dev = this.__PORT_TO_OUTPUTS[port];
    if(dev) {
        this.__setDcMotorMode(port);
        this.motoring[dev] = 0;
    }
    return script.callReturn();
};

CheeseRobot.prototype.rotateStepMotor = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isMoving = true;
        this.__cancelStep();
        this.__setModeMab(this.stepMode);

        let step = script.getNumberValue('STEP');
        let velocity = script.getNumberValue('VELOCITY');
        
        step = parseInt(step);
        velocity = parseFloat(velocity);

        if((typeof step == 'number') && (typeof velocity == 'number')) {
            if(velocity < -500) velocity = -500;
            else if(velocity > 500) velocity = 500;
            this.motoring.velocity = velocity;
            this.__setStep(step);
            this.stepCallback = function() {
                script.isMoving = false;
            };
        } else {
            this.motoring.velocity = 0;
            this.__setStep(0);
            script.isMoving = false;
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

CheeseRobot.prototype.changeStepMotorVelocity = function(script) {
    this.__setModule();
    this.__cancelStep();
    this.__setModeMab(this.stepMode);
    
    let velocity = script.getNumberValue('VELOCITY');
    
    velocity = parseFloat(velocity);
    if(typeof velocity == 'number') {
        let vel = this.motoring.velocity;
        velocity = (vel != undefined) ? vel + velocity : velocity;
        if(velocity < -500) velocity = -500;
        else if(velocity > 500) velocity = 500;
        this.motoring.velocity = velocity;
    }
    this.__setStep(0);
    return script.callReturn();
};

CheeseRobot.prototype.setStepMotorVelocity = function(script) {
    this.__setModule();
    this.__cancelStep();
    this.__setModeMab(this.stepMode);
    
    let velocity = script.getNumberValue('VELOCITY');
    
    velocity = parseFloat(velocity);
    if(typeof velocity == 'number') {
        if(velocity < -500) velocity = -500;
        else if(velocity > 500) velocity = 500;
        this.motoring.velocity = velocity;
    }
    this.__setStep(0);
    return script.callReturn();
};

CheeseRobot.prototype.stopOffStepMotor = function(script) {
    this.__setModule();
    this.__cancelStep();
    
    const action = script.getField('ACTION');
    if(action == 'STOP') {
        this.__setModeMab(this.stepMode);
    } else {
        this.__setModeMab(0x80); // sw off
    }
    this.motoring.velocity = 0;
    this.__setStep(0);
    return script.callReturn();
};

CheeseRobot.prototype.__MODE_STEP_MOTORS = {
    NORMAL: 0x90,
    POWER: 0xa0
};

CheeseRobot.prototype.setStepMotorMode = function(script) {
    this.__setModule();
    
    let mode = script.getField('MODE');
    
    mode = this.__MODE_STEP_MOTORS[mode];
    if(typeof mode == 'number') {
        this.stepMode = mode;
        this.__setModeMab(mode);
    }
    return script.callReturn();
};

CheeseRobot.prototype.getStepCount = function(script) {
    this.__setModule();
    return this.sensory.stepCount;
};

CheeseRobot.prototype.__RGB_COLORS = {
    DARK: {
        RED: [15, 0, 0],
        ORANGE: [15, 3, 0],
        YELLOW: [15, 15, 0],
        GREEN: [0, 15, 0],
        SKY_BLUE: [0, 15, 15],
        BLUE: [0, 0, 15],
        VIOLET: [3, 0, 15],
        PURPLE: [15, 0, 15],
        WHITE: [15, 15, 15]
    },
    NORMAL: {
        RED: [63, 0, 0],
        ORANGE: [63, 15, 0],
        YELLOW: [63, 63, 0],
        GREEN: [0, 63, 0],
        SKY_BLUE: [0, 63, 63],
        BLUE: [0, 0, 63],
        VIOLET: [15, 0, 63],
        PURPLE: [63, 0, 63],
        WHITE: [63, 63, 63]
    },
    BRIGHT: {
        RED: [255, 0, 0],
        ORANGE: [255, 63, 0],
        YELLOW: [255, 255, 0],
        GREEN: [0, 255, 0],
        SKY_BLUE: [0, 255, 255],
        BLUE: [0, 0, 255],
        VIOLET: [63, 0, 255],
        PURPLE: [255, 0, 255],
        WHITE: [255, 255, 255]
    }
};

CheeseRobot.prototype.__setLedMode = function(port) {
	switch(port) {
		case 'S':
			this.__setModeSa(0x02);
			this.__setModeSb(0x02);
			this.__setModeSc(0x02);
			break;
		case 'L':
			this.__setModeLa(0x02);
			this.__setModeLb(0x02);
			this.__setModeLc(0x02);
			break;
	}
};

CheeseRobot.prototype.__setLedRgb = function(port, red, green, blue) {
    const led = this.leds[port];
    if(led) {
        led.setRgb(red, green, blue);
        red = parseInt(red * 100 / 255.0);
        green = parseInt(green * 100 / 255.0);
        blue = parseInt(blue * 100 / 255.0);
        if(red < 0) red = 0;
        else if(red > 100) red = 100;
        if(green < 0) green = 0;
        else if(green > 100) green = 100;
        if(blue < 0) blue = 0;
        else if(blue > 100) blue = 100;
        if(led.isAnode()) {
            red = 100 - red;
            green = 100 - green;
            blue = 100 - blue;
        }
        this.__setLedMode(port);
        let dev = this.__PORT_TO_OUTPUTS[led.getPortR()];
        if(dev) this.motoring[dev] = red;
        dev = this.__PORT_TO_OUTPUTS[led.getPortG()];
        if(dev) this.motoring[dev] = green;
        dev = this.__PORT_TO_OUTPUTS[led.getPortB()];
        if(dev) this.motoring[dev] = blue;
    }
};

CheeseRobot.prototype.setLedColor = function(script) {
    this.__setModule();
    
    const port = script.getField('PORT');
    const intensity = script.getField('INTENSITY');
    const color = script.getField('COLOR');
    
    const rgb = this.__RGB_COLORS[intensity][color];
    if(rgb) {
        this.__setLedRgb(port, rgb[0], rgb[1], rgb[2]);
    }
    return script.callReturn();
};

CheeseRobot.prototype.setLedRgbArray = function(script) {
    this.__setModule();
    
    const port = script.getField('PORT');
    const color = script.getField('COLOR');
    
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    this.__setLedRgb(port, r, g, b);
    return script.callReturn();
};

CheeseRobot.prototype.changeLedRgb = function(script) {
    this.__setModule();
    
    const port = script.getField('PORT');
    let red = script.getNumberValue('RED');
    let green = script.getNumberValue('GREEN');
    let blue = script.getNumberValue('BLUE');
    
    const led = this.leds[port];
    if(led) {
        red = parseInt(red);
        green = parseInt(green);
        blue = parseInt(blue);
        if((typeof red == 'number') && (typeof green == 'number') && (typeof blue == 'number')) {
            red += led.getR();
            green += led.getG();
            blue += led.getB();
            if(red < 0) red = 0;
            else if(red > 255) red = 255;
            if(green < 0) green = 0;
            else if(green > 255) green = 255;
            if(blue < 0) blue = 0;
            else if(blue > 255) blue = 255;
            this.__setLedRgb(port, red, green, blue);
        }
    }
    return script.callReturn();
};

CheeseRobot.prototype.setLedRgb = function(script) {
    this.__setModule();
    
    const port = script.getField('PORT');
    let red = script.getNumberValue('RED');
    let green = script.getNumberValue('GREEN');
    let blue = script.getNumberValue('BLUE');
    
    red = parseInt(red);
    green = parseInt(green);
    blue = parseInt(blue);
    if((typeof red == 'number') && (typeof green == 'number') && (typeof blue == 'number')) {
        if(red < 0) red = 0;
        else if(red > 255) red = 255;
        if(green < 0) green = 0;
        else if(green > 255) green = 255;
        if(blue < 0) blue = 0;
        else if(blue > 255) blue = 255;
        this.__setLedRgb(port, red, green, blue);
    }
    return script.callReturn();
};

CheeseRobot.prototype.clearLed = function(script) {
    this.__setModule();
    
    const port = script.getField('PORT');
    
    this.__setLedRgb(port, 0, 0, 0);
    return script.callReturn();
};

CheeseRobot.prototype.setLedType = function(script) {
    this.__setModule();
    
    const port = script.getField('PORT');
    const type = script.getField('TYPE');
    
    const led = this.leds[port];
    if(led) {
        led.setType(type);
    }
    return script.callReturn();
};

CheeseRobot.prototype.__refreshNeopixel = function(callback) {
    const packet = this.neopixel.getPacket();
    if(packet) {
        this.__setNeopixel(packet);
        this.neopixelCallback = callback;
    } else {
        callback();
    }
};

CheeseRobot.prototype.__NEOPIXEL_TYPES = {
    GRB: 0,
    GRBW: 1
};

CheeseRobot.prototype.neopixelSetNumberAndType = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isWaiting = true;
        script.isWorking = true;
        return script;
    } else if (script.isWaiting) {
        if(this.__isNeopixelIdle()) {
            script.isWaiting = false;
            let number = script.getNumberValue('NUMBER');
            let type = script.getField('TYPE');
            
            number = parseInt(number);
            type = this.__NEOPIXEL_TYPES[type];
            if((typeof number == 'number') && (typeof type == 'number')) {
                this.neopixel.setNumLeds(number);
                this.neopixel.setType(type);

                this.neopixel.clearAll();
                this.__refreshNeopixel(function() {
                    script.isWorking = false;
                });
            } else {
                script.isWorking = false;
            }
        }
        return script;
    } else if (script.isWorking) {
        return script;
    } else {
        delete script.isStart;
        delete script.isWaiting;
        delete script.isWorking;
        Entry.engine.isContinue = false;
        return script.callReturn();
    }
};

CheeseRobot.prototype.neopixelSetAllColor = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isWaiting = true;
        script.isWorking = true;
        return script;
    } else if (script.isWaiting) {
        if(this.__isNeopixelIdle()) {
            script.isWaiting = false;
            const color = script.getField('COLOR');
            
            const rgb = this.__RGB_COLORS['BRIGHT'][color];
            if(rgb) {
                this.neopixel.setAllRgb(rgb[0], rgb[1], rgb[2]);
                this.__refreshNeopixel(function() {
                    script.isWorking = false;
                });
            } else {
                script.isWorking = false;
            }
        }
        return script;
    } else if (script.isWorking) {
        return script;
    } else {
        delete script.isStart;
        delete script.isWaiting;
        delete script.isWorking;
        Entry.engine.isContinue = false;
        return script.callReturn();
    }
};

CheeseRobot.prototype.neopixelSetAllRgbArray = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isWaiting = true;
        script.isWorking = true;
        return script;
    } else if (script.isWaiting) {
        if(this.__isNeopixelIdle()) {
            script.isWaiting = false;
            const color = script.getField('COLOR');
            
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);
            if((typeof r == 'number') && (typeof g == 'number') && (typeof b == 'number')) {
                this.neopixel.setAllRgb(r, g, b);
                this.__refreshNeopixel(function() {
                    script.isWorking = false;
                });
            } else {
                script.isWorking = false;
            }
        }
        return script;
    } else if (script.isWorking) {
        return script;
    } else {
        delete script.isStart;
        delete script.isWaiting;
        delete script.isWorking;
        Entry.engine.isContinue = false;
        return script.callReturn();
    }
};

CheeseRobot.prototype.neopixelChangeAllRgb = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isWaiting = true;
        script.isWorking = true;
        return script;
    } else if (script.isWaiting) {
        if(this.__isNeopixelIdle()) {
            script.isWaiting = false;
            let red = script.getNumberValue('RED');
            let green = script.getNumberValue('GREEN');
            let blue = script.getNumberValue('BLUE');
            
            red = parseInt(red);
            green = parseInt(green);
            blue = parseInt(blue);
            if((typeof red == 'number') && (typeof green == 'number') && (typeof blue == 'number')) {
                this.neopixel.changeAllRgb(red, green, blue);
                this.__refreshNeopixel(function() {
                    script.isWorking = false;
                });
            } else {
                script.isWorking = false;
            }
        }
        return script;
    } else if (script.isWorking) {
        return script;
    } else {
        delete script.isStart;
        delete script.isWaiting;
        delete script.isWorking;
        Entry.engine.isContinue = false;
        return script.callReturn();
    }
};

CheeseRobot.prototype.neopixelSetAllRgb = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isWaiting = true;
        script.isWorking = true;
        return script;
    } else if (script.isWaiting) {
        if(this.__isNeopixelIdle()) {
            script.isWaiting = false;
            let red = script.getNumberValue('RED');
            let green = script.getNumberValue('GREEN');
            let blue = script.getNumberValue('BLUE');
            
            red = parseInt(red);
            green = parseInt(green);
            blue = parseInt(blue);
            if((typeof red == 'number') && (typeof green == 'number') && (typeof blue == 'number')) {
                this.neopixel.setAllRgb(red, green, blue);
                this.__refreshNeopixel(function() {
                    script.isWorking = false;
                });
            } else {
                script.isWorking = false;
            }
        }
        return script;
    } else if (script.isWorking) {
        return script;
    } else {
        delete script.isStart;
        delete script.isWaiting;
        delete script.isWorking;
        Entry.engine.isContinue = false;
        return script.callReturn();
    }
};

CheeseRobot.prototype.__NEOPIXEL_PATTERNS = {
    GRADIENT_RED_GREEN: 128,
    GRADIENT_RED_BLUE: 129,
    GRADIENT_RED_WHITE: 130,
    GRADIENT_RED_BLACK: 131,
    GRADIENT_GREEN_BLUE: 132,
    GRADIENT_GREEN_RED: 133,
    GRADIENT_GREEN_WHITE: 134,
    GRADIENT_GREEN_BLACK: 135,
    GRADIENT_BLUE_RED: 136,
    GRADIENT_BLUE_GREEN: 137,
    GRADIENT_BLUE_WHITE: 138,
    GRADIENT_BLUE_BLACK: 139,
    GRADIENT_WHITE_RED: 140,
    GRADIENT_WHITE_GREEN: 141,
    GRADIENT_WHITE_BLUE: 142,
    GRADIENT_WHITE_BLACK: 143,
    GRADIENT_BLACK_RED: 144,
    GRADIENT_BLACK_GREEN: 145,
    GRADIENT_BLACK_BLUE: 146,
    GRADIENT_BLACK_WHITE: 147,
    FILL_3_COLORS: 192,
    FILL_6_COLORS: 193,
    FILL_12_COLORS: 194,
};

CheeseRobot.prototype.neopixelSetAllPattern = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isWaiting = true;
        script.isWorking = true;
        return script;
    } else if (script.isWaiting) {
        if(this.__isNeopixelIdle()) {
            script.isWaiting = false;
            let pattern = script.getField('PATTERN');
            
            pattern = this.__NEOPIXEL_PATTERNS[pattern];
            if(typeof pattern == 'number') {
                this.neopixel.setAllPattern(pattern);
                this.__refreshNeopixel(function() {
                    script.isWorking = false;
                });
            } else {
                script.isWorking = false;
            }
        }
        return script;
    } else if (script.isWorking) {
        return script;
    } else {
        delete script.isStart;
        delete script.isWaiting;
        delete script.isWorking;
        Entry.engine.isContinue = false;
        return script.callReturn();
    }
};

CheeseRobot.prototype.neopixelClearAll = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isWaiting = true;
        script.isWorking = true;
        return script;
    } else if (script.isWaiting) {
        if(this.__isNeopixelIdle()) {
            script.isWaiting = false;
            
            this.neopixel.clearAll();
            this.__refreshNeopixel(function() {
                script.isWorking = false;
            });
        }
        return script;
    } else if (script.isWorking) {
        return script;
    } else {
        delete script.isStart;
        delete script.isWaiting;
        delete script.isWorking;
        Entry.engine.isContinue = false;
        return script.callReturn();
    }
};

CheeseRobot.prototype.neopixelSetLedColor = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isWaiting = true;
        script.isWorking = true;
        return script;
    } else if (script.isWaiting) {
        if(this.__isNeopixelIdle()) {
            script.isWaiting = false;
            let pixel = script.getNumberValue('PIXEL');
            const color = script.getField('COLOR');
            
            pixel = parseInt(pixel);
            const rgb = this.__RGB_COLORS['BRIGHT'][color];
            if((typeof pixel == 'number') && rgb) {
                if(this.neopixel.setRgbAt(pixel - 1, rgb[0], rgb[1], rgb[2])) {
                    this.__refreshNeopixel(function() {
                        script.isWorking = false;
                    });
                } else {
                    script.isWorking = false;
                }
            } else {
                script.isWorking = false;
            }
        }
        return script;
    } else if (script.isWorking) {
        return script;
    } else {
        delete script.isStart;
        delete script.isWaiting;
        delete script.isWorking;
        Entry.engine.isContinue = false;
        return script.callReturn();
    }
};

CheeseRobot.prototype.neopixelSetLedRgbArray = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isWaiting = true;
        script.isWorking = true;
        return script;
    } else if (script.isWaiting) {
        if(this.__isNeopixelIdle()) {
            script.isWaiting = false;
            let pixel = script.getNumberValue('PIXEL');
            const color = script.getField('COLOR');
            
            pixel = parseInt(pixel);
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);
            if((typeof pixel == 'number') && (typeof r == 'number') && (typeof g == 'number') && (typeof b == 'number')) {
                if(this.neopixel.setRgbAt(pixel - 1, r, g, b)) {
                    this.__refreshNeopixel(function() {
                        script.isWorking = false;
                    });
                } else {
                    script.isWorking = false;
                }
            } else {
                script.isWorking = false;
            }
        }
        return script;
    } else if (script.isWorking) {
        return script;
    } else {
        delete script.isStart;
        delete script.isWaiting;
        delete script.isWorking;
        Entry.engine.isContinue = false;
        return script.callReturn();
    }
};

CheeseRobot.prototype.neopixelChangeLedRgb = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isWaiting = true;
        script.isWorking = true;
        return script;
    } else if (script.isWaiting) {
        if(this.__isNeopixelIdle()) {
            script.isWaiting = false;
            let pixel = script.getNumberValue('PIXEL');
            let red = script.getNumberValue('RED');
            let green = script.getNumberValue('GREEN');
            let blue = script.getNumberValue('BLUE');
            
            pixel = parseInt(pixel);
            red = parseInt(red);
            green = parseInt(green);
            blue = parseInt(blue);
            if((typeof pixel == 'number') && (typeof red == 'number') && (typeof green == 'number') && (typeof blue == 'number')) {
                if(this.neopixel.changeRgbAt(pixel - 1, red, green, blue)) {
                    this.__refreshNeopixel(function() {
                        script.isWorking = false;
                    });
                } else {
                    script.isWorking = false;
                }
            } else {
                script.isWorking = false;
            }
        }
        return script;
    } else if (script.isWorking) {
        return script;
    } else {
        delete script.isStart;
        delete script.isWaiting;
        delete script.isWorking;
        Entry.engine.isContinue = false;
        return script.callReturn();
    }
};

CheeseRobot.prototype.neopixelSetLedRgb = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isWaiting = true;
        script.isWorking = true;
        return script;
    } else if (script.isWaiting) {
        if(this.__isNeopixelIdle()) {
            script.isWaiting = false;
            let pixel = script.getNumberValue('PIXEL');
            let red = script.getNumberValue('RED');
            let green = script.getNumberValue('GREEN');
            let blue = script.getNumberValue('BLUE');
            
            pixel = parseInt(pixel);
            red = parseInt(red);
            green = parseInt(green);
            blue = parseInt(blue);
            if((typeof pixel == 'number') && (typeof red == 'number') && (typeof green == 'number') && (typeof blue == 'number')) {
                if(this.neopixel.setRgbAt(pixel - 1, red, green, blue)) {
                    this.__refreshNeopixel(function() {
                        script.isWorking = false;
                    });
                } else {
                    script.isWorking = false;
                }
            } else {
                script.isWorking = false;
            }
        }
        return script;
    } else if (script.isWorking) {
        return script;
    } else {
        delete script.isStart;
        delete script.isWaiting;
        delete script.isWorking;
        Entry.engine.isContinue = false;
        return script.callReturn();
    }
};

CheeseRobot.prototype.neopixelClearLed = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isWaiting = true;
        script.isWorking = true;
        return script;
    } else if (script.isWaiting) {
        if(this.__isNeopixelIdle()) {
            script.isWaiting = false;
            let pixel = script.getNumberValue('PIXEL');
            
            pixel = parseInt(pixel);
            if(typeof pixel == 'number') {
                if(this.neopixel.clearAt(pixel - 1)) {
                    this.__refreshNeopixel(function() {
                        script.isWorking = false;
                    });
                } else {
                    script.isWorking = false;
                }
            } else {
                script.isWorking = false;
            }
        }
        return script;
    } else if (script.isWorking) {
        return script;
    } else {
        delete script.isStart;
        delete script.isWaiting;
        delete script.isWorking;
        Entry.engine.isContinue = false;
        return script.callReturn();
    }
};

CheeseRobot.prototype.neopixelSetRangeColor = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isWaiting = true;
        script.isWorking = true;
        return script;
    } else if (script.isWaiting) {
        if(this.__isNeopixelIdle()) {
            script.isWaiting = false;
            let start = script.getNumberValue('START');
            let end = script.getNumberValue('END');
            let increment = script.getNumberValue('INCREMENT');
            const color = script.getField('COLOR');
            
            start = parseInt(start);
            end = parseInt(end);
            increment = parseInt(increment);
            const rgb = this.__RGB_COLORS['BRIGHT'][color];
            if((typeof start == 'number') && (typeof end == 'number') && (typeof increment == 'number') && rgb) {
                if(this.neopixel.setRgbFromTo(start - 1, end - 1, increment, rgb[0], rgb[1], rgb[2])) {
                    this.__refreshNeopixel(function() {
                        script.isWorking = false;
                    });
                } else {
                    script.isWorking = false;
                }
            } else {
                script.isWorking = false;
            }
        }
        return script;
    } else if (script.isWorking) {
        return script;
    } else {
        delete script.isStart;
        delete script.isWaiting;
        delete script.isWorking;
        Entry.engine.isContinue = false;
        return script.callReturn();
    }
};

CheeseRobot.prototype.neopixelSetRangeRgbArray = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isWaiting = true;
        script.isWorking = true;
        return script;
    } else if (script.isWaiting) {
        if(this.__isNeopixelIdle()) {
            script.isWaiting = false;
            let start = script.getNumberValue('START');
            let end = script.getNumberValue('END');
            let increment = script.getNumberValue('INCREMENT');
            const color = script.getField('COLOR');
            
            start = parseInt(start);
            end = parseInt(end);
            increment = parseInt(increment);
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);
            if((typeof start == 'number') && (typeof end == 'number') && (typeof increment == 'number') && (typeof r == 'number') && (typeof g == 'number') && (typeof b == 'number')) {
                if(this.neopixel.setRgbFromTo(start - 1, end - 1, increment, r, g, b)) {
                    this.__refreshNeopixel(function() {
                        script.isWorking = false;
                    });
                } else {
                    script.isWorking = false;
                }
            } else {
                script.isWorking = false;
            }
        }
        return script;
    } else if (script.isWorking) {
        return script;
    } else {
        delete script.isStart;
        delete script.isWaiting;
        delete script.isWorking;
        Entry.engine.isContinue = false;
        return script.callReturn();
    }
};

CheeseRobot.prototype.neopixelChangeRangeRgb = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isWaiting = true;
        script.isWorking = true;
        return script;
    } else if (script.isWaiting) {
        if(this.__isNeopixelIdle()) {
            script.isWaiting = false;
            let start = script.getNumberValue('START');
            let end = script.getNumberValue('END');
            let increment = script.getNumberValue('INCREMENT');
            let red = script.getNumberValue('RED');
            let green = script.getNumberValue('GREEN');
            let blue = script.getNumberValue('BLUE');
            
            start = parseInt(start);
            end = parseInt(end);
            increment = parseInt(increment);
            red = parseInt(red);
            green = parseInt(green);
            blue = parseInt(blue);
            if((typeof start == 'number') && (typeof end == 'number') && (typeof increment == 'number') && (typeof red == 'number') && (typeof green == 'number') && (typeof blue == 'number')) {
                if(this.neopixel.changeRgbFromTo(start - 1, end - 1, increment, red, green, blue)) {
                    this.__refreshNeopixel(function() {
                        script.isWorking = false;
                    });
                } else {
                    script.isWorking = false;
                }
            } else {
                script.isWorking = false;
            }
        }
        return script;
    } else if (script.isWorking) {
        return script;
    } else {
        delete script.isStart;
        delete script.isWaiting;
        delete script.isWorking;
        Entry.engine.isContinue = false;
        return script.callReturn();
    }
};

CheeseRobot.prototype.neopixelSetRangeRgb = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isWaiting = true;
        script.isWorking = true;
        return script;
    } else if (script.isWaiting) {
        if(this.__isNeopixelIdle()) {
            script.isWaiting = false;
            let start = script.getNumberValue('START');
            let end = script.getNumberValue('END');
            let increment = script.getNumberValue('INCREMENT');
            let red = script.getNumberValue('RED');
            let green = script.getNumberValue('GREEN');
            let blue = script.getNumberValue('BLUE');
            
            start = parseInt(start);
            end = parseInt(end);
            increment = parseInt(increment);
            red = parseInt(red);
            green = parseInt(green);
            blue = parseInt(blue);
            if((typeof start == 'number') && (typeof end == 'number') && (typeof increment == 'number') && (typeof red == 'number') && (typeof green == 'number') && (typeof blue == 'number')) {
                if(this.neopixel.setRgbFromTo(start - 1, end - 1, increment, red, green, blue)) {
                    this.__refreshNeopixel(function() {
                        script.isWorking = false;
                    });
                } else {
                    script.isWorking = false;
                }
            } else {
                script.isWorking = false;
            }
        }
        return script;
    } else if (script.isWorking) {
        return script;
    } else {
        delete script.isStart;
        delete script.isWaiting;
        delete script.isWorking;
        Entry.engine.isContinue = false;
        return script.callReturn();
    }
};

CheeseRobot.prototype.neopixelSetRangePattern = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isWaiting = true;
        script.isWorking = true;
        return script;
    } else if (script.isWaiting) {
        if(this.__isNeopixelIdle()) {
            script.isWaiting = false;
            let start = script.getNumberValue('START');
            let end = script.getNumberValue('END');
            let pattern = script.getField('PATTERN');
            
            start = parseInt(start);
            end = parseInt(end);
            pattern = this.__NEOPIXEL_PATTERNS[pattern];
            if((typeof start == 'number') && (typeof end == 'number') && (typeof pattern == 'number')) {
                if(this.neopixel.setPatternFromTo(start - 1, end - 1, pattern)) {
                    this.__refreshNeopixel(function() {
                        script.isWorking = false;
                    });
                } else {
                    script.isWorking = false;
                }
            } else {
                script.isWorking = false;
            }
        }
        return script;
    } else if (script.isWorking) {
        return script;
    } else {
        delete script.isStart;
        delete script.isWaiting;
        delete script.isWorking;
        Entry.engine.isContinue = false;
        return script.callReturn();
    }
};

CheeseRobot.prototype.neopixelClearRange = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isWaiting = true;
        script.isWorking = true;
        return script;
    } else if (script.isWaiting) {
        if(this.__isNeopixelIdle()) {
            script.isWaiting = false;
            let start = script.getNumberValue('START');
            let end = script.getNumberValue('END');
            let increment = script.getNumberValue('INCREMENT');
            
            start = parseInt(start);
            end = parseInt(end);
            increment = parseInt(increment);
            if((typeof start == 'number') && (typeof end == 'number') && (typeof increment == 'number')) {
                if(this.neopixel.clearFromTo(start - 1, end - 1, increment)) {
                    this.__refreshNeopixel(function() {
                        script.isWorking = false;
                    });
                } else {
                    script.isWorking = false;
                }
            } else {
                script.isWorking = false;
            }
        }
        return script;
    } else if (script.isWorking) {
        return script;
    } else {
        delete script.isStart;
        delete script.isWaiting;
        delete script.isWorking;
        Entry.engine.isContinue = false;
        return script.callReturn();
    }
};

CheeseRobot.prototype.neopixelShift = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isWaiting = true;
        script.isWorking = true;
        return script;
    } else if (script.isWaiting) {
        if(this.__isNeopixelIdle()) {
            script.isWaiting = false;
            let bit = script.getNumberValue('BIT');
            
            bit = parseInt(bit);
            if(typeof bit == 'number') {
                if(this.neopixel.shiftAll(bit)) {
                    this.__refreshNeopixel(function() {
                        script.isWorking = false;
                    });
                } else {
                    script.isWorking = false;
                }
            } else {
                script.isWorking = false;
            }
        }
        return script;
    } else if (script.isWorking) {
        return script;
    } else {
        delete script.isStart;
        delete script.isWaiting;
        delete script.isWorking;
        Entry.engine.isContinue = false;
        return script.callReturn();
    }
};

CheeseRobot.prototype.neopixelRotate = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isWaiting = true;
        script.isWorking = true;
        return script;
    } else if (script.isWaiting) {
        if(this.__isNeopixelIdle()) {
            script.isWaiting = false;
            let bit = script.getNumberValue('BIT');
            
            bit = parseInt(bit);
            if(typeof bit == 'number') {
                if(this.neopixel.rotateAll(bit)) {
                    this.__refreshNeopixel(function() {
                        script.isWorking = false;
                    });
                } else {
                    script.isWorking = false;
                }
            } else {
                script.isWorking = false;
            }
        }
        return script;
    } else if (script.isWorking) {
        return script;
    } else {
        delete script.isStart;
        delete script.isWaiting;
        delete script.isWorking;
        Entry.engine.isContinue = false;
        return script.callReturn();
    }
};

CheeseRobot.prototype.neopixelChangeBrightness = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isWaiting = true;
        script.isWorking = true;
        return script;
    } else if (script.isWaiting) {
        if(this.__isNeopixelIdle()) {
            script.isWaiting = false;
            let value = script.getNumberValue('VALUE');
            
            value = parseInt(value);
            if(typeof value == 'number') {
                this.neopixel.changeBrightnessBy(value);
                this.__refreshNeopixel(function() {
                    script.isWorking = false;
                });
            } else {
                script.isWorking = false;
            }
        }
        return script;
    } else if (script.isWorking) {
        return script;
    } else {
        delete script.isStart;
        delete script.isWaiting;
        delete script.isWorking;
        Entry.engine.isContinue = false;
        return script.callReturn();
    }
};

CheeseRobot.prototype.neopixelSetBrightness = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isWaiting = true;
        script.isWorking = true;
        return script;
    } else if (script.isWaiting) {
        if(this.__isNeopixelIdle()) {
            script.isWaiting = false;
            let value = script.getNumberValue('VALUE');
            
            value = parseInt(value);
            if(typeof value == 'number') {
                this.neopixel.setBrightnessTo(value);
                this.__refreshNeopixel(function() {
                    script.isWorking = false;
                });
            } else {
                script.isWorking = false;
            }
        }
        return script;
    } else if (script.isWorking) {
        return script;
    } else {
        delete script.isStart;
        delete script.isWaiting;
        delete script.isWorking;
        Entry.engine.isContinue = false;
        return script.callReturn();
    }
};

CheeseRobot.prototype.writeSerial = function(script) {
    const self = this;
    self.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isWriting = true;

        const mode = script.getField('MODE');
        const text = script.getValue('STRING');

        this.__setSerialModePid();
        const queue = this.writeQueue;
        queue.push(text, mode != 'STRING');
        const data = queue.pop();
        if(data) {
            this.writeSerialCallbacks.push(() => {
                script.isWriting = false;
            });
            this.__setSerial(data);
        } else {
            script.isWriting = false;
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

CheeseRobot.prototype.__SERIAL_DELIMITERS = {
    ALL: 0,
    COMMA: 0x2c,
    COLON: 0x3a,
    DOLLAR: 0x24,
    SHARP: 0x23,
    NEW_LINE: 0x0d,
};
        
CheeseRobot.prototype.readSerialUntil = function(script) {
    const self = this;
    self.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isReading = true;

        let delimiter = script.getField('DELIMITER');

        this.__setSerialModePid();
        delimiter = this.__SERIAL_DELIMITERS[delimiter];
        if(typeof delimiter == 'number') {
            this.serialDelimiter = delimiter;
            this.readSerialCallbacks.push(() => {
                script.isReading = false;
            });
        } else {
            script.isReading = false;
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

CheeseRobot.prototype.__SERIAL_PORTS = {
    WRITE_READ: 2,
    READ_WRITE: 3,
    WRITE: 0,
    READ: 1,
};
        
CheeseRobot.prototype.setSerialPort = function(script) {
    this.__setModule();
    const port = this.__SERIAL_PORTS[script.getField('PORT')];

    if(typeof port == 'number') {
        this.serialPin = port;
        this.__setSerialModePid();
    }
    return script.callReturn();
};

CheeseRobot.prototype.__SERIAL_BAUDS = {
    '9600': 0,
    '14400': 1,
    '19200': 2,
    '28800': 3,
    '38400': 4,
    '57600': 5,
    '76800': 6,
    '115200': 7
};
        
CheeseRobot.prototype.setSerialRate = function(script) {
    this.__setModule();
    const baud = this.__SERIAL_BAUDS[script.getField('BAUD')];

    if(typeof baud == 'number') {
        this.serialRate = baud;
        this.__setSerialModePid();
    }
    return script.callReturn();
};

CheeseRobot.prototype.getSerialInput = function(script) {
    this.__setModule();
    return this.serialInput;
};

CheeseRobot.prototype.pidStart = function(script) {
    this.__setModule();
    
    const dev = script.getField('DEVICE');
    switch(dev) {
        case '10': // PID-10 ultrasonic sensor (HC-SR04+)
            // 0: La(trigger) Lb(echo) Lc(GND)
            // 1: La(trigger) Lb(echo)
            this.motoring.outputLa = 0;
            this.__setModeLa(255);
            this.__setModePid(10);
            break;
        case '11-1': // PID-11-1 humidity/temperature sensor (DHT11)
            // upper 4bits
            // 0: La(data)
            // 1: La(data), Lb(GND)
            // 2: La(data), Lb(VCC)
            this.motoring.outputLa = 1;
            this.__setModeLa(255);
            this.__setModePid(11);
            break;
        case '11-2': // PID-11-2 humidity/temperature sensor (DHT21)
            // upper 4bits
            // 0: La(data)
            // 1: La(data), Lb(GND)
            // 2: La(data), Lb(VCC)
            this.motoring.outputLa = 2;
            this.__setModeLa(255);
            this.__setModePid(11);
            break;
        case '11-3': // PID-11-3 humidity/temperature sensor (DHT22)
            // upper 4bits
            // 0: La(data)
            // 1: La(data), Lb(GND)
            // 2: La(data), Lb(VCC)
            this.motoring.outputLa = 3;
            this.__setModeLa(255);
            this.__setModePid(11);
            break;
        case '12': // PID-12 temperature sensor (DS18B20)
            this.__setModePid(12);
            break;
        case '13': // PID-13 joystick and button
            this.__setModePid(13);
            break;
        case '14': // PID-14 dual joystick
            this.__setModePid(14);
            break;
        case '15': // PID-15 IR transceiver
            this.__setModePid(15);
            break;
        case '16': // PID-16 encoder
            this.__setModePid(16);
            this.__resetEncoder();
            break;
    }
    return script.callReturn();
};

CheeseRobot.prototype.pidSetRangeTo = function(script) {
    this.__setModule();
    
    const input = script.getField('INPUT');
    let low1 = script.getNumberValue('LOW1');
    let high1 = script.getNumberValue('HIGH1');
    let low2 = script.getNumberValue('LOW2');
    let high2 = script.getNumberValue('HIGH2');
    const decimal = script.getField('DECIMAL');

    low1 = parseFloat(low1);
    high1 = parseFloat(high1);
    low2 = parseFloat(low2);
    high2 = parseFloat(high2);
    if((typeof low1 == 'number') && (typeof high1 == 'number') && (typeof low2 == 'number') && (typeof high2 == 'number')) {
        this.range.setLowHigh(input, low1, high1, low2, high2, decimal == 'REAL');
    }
    return script.callReturn();
};

CheeseRobot.prototype.pidSetThreeRangesTo = function(script) {
    this.__setModule();
    
    const input = script.getField('INPUT');
    let low1 = script.getNumberValue('LOW1');
    let mid1 = script.getNumberValue('MIDDLE1');
    let high1 = script.getNumberValue('HIGH1');
    let low2 = script.getNumberValue('LOW2');
    let mid2 = script.getNumberValue('MIDDLE2');
    let high2 = script.getNumberValue('HIGH2');
    const decimal = script.getField('DECIMAL');

    low1 = parseFloat(low1);
    mid1 = parseFloat(mid1);
    high1 = parseFloat(high1);
    low2 = parseFloat(low2);
    mid2 = parseFloat(mid2);
    high2 = parseFloat(high2);
    if((typeof low1 == 'number') && (typeof mid1 == 'number') && (typeof high1 == 'number') && (typeof low2 == 'number') && (typeof mid2 == 'number') && (typeof high2 == 'number')) {
        this.range.setLowMidHigh(input, low1, mid1, high1, low2, mid2, high2, decimal == 'REAL');
    }
    return script.callReturn();
};

CheeseRobot.prototype.__resetEncoder = function() {
    if(this.motoring.modePid == 16) { // encoder
        this.resetEncoderFlag = (this.resetEncoderFlag % 255) + 1;
        const pid = this.__getOrCreateWritePidArray();
        pid[0] = 0x31;
        pid[1] = this.resetEncoderFlag;
        this.__issuePid();
    }
};

CheeseRobot.prototype.pidResetEncoder = function(script) {
    this.__setModule();
    this.__resetEncoder();
    return script.callReturn();
};

CheeseRobot.prototype.pidGetInput = function(script) {
    this.__setModule();
    const input = script.getField('INPUT');
    switch(input) {
        case 'DISTANCE': return this.pid.getDistance();
        case 'TEMPERATURE': return this.pid.getTemperature();
        case 'HUMIDITY': return this.pid.getHumidity();
        case 'X1': return this.range.calc('X1', this.pid.getX1());
        case 'Y1': return this.range.calc('Y1', this.pid.getY1());
        case 'X2': return this.range.calc('X2', this.pid.getX2());
        case 'Y2': return this.range.calc('Y2', this.pid.getY2());
        case 'BUTTON1': return this.pid.getButton1();
        case 'BUTTON2': return this.pid.getButton2();
        case 'ENCODER': return this.pid.getEncoder();
    }
    return 0;
};

CheeseRobot.prototype.pidCheckButtonState = function(script) {
    this.__setModule();
    
    const button = script.getField('BUTTON');
    const state = script.getField('STATE');
    switch(button) {
        case '1':
            switch(state) {
                case 'CLICKED': return this.pid.isButton1Clicked();
                case 'LONG_PRESSED': return this.pid.isButton1LongPressed();
            }
            break;
        case '2':
            switch(state) {
                case 'CLICKED': return this.pid.isButton2Clicked();
                case 'LONG_PRESSED': return this.pid.isButton2LongPressed();
            }
            break;
    }
    return false;
};

CheeseRobot.prototype.hat010Start = function(script) {
    this.__setModule();
    this.hat.start(10);
    return script.callReturn();
};

CheeseRobot.prototype.hat010GetButton = function(script) {
    this.__setModule();
    
    const hat = this.hat.getHat(10);
    if(hat) {
        const button = script.getField('BUTTON');
        switch(button) {
            case 'A': return hat.getButtonA();
            case 'B': return hat.getButtonB();
        }
    }
    return 0;
};

CheeseRobot.prototype.hat010CheckButtonState = function(script) {
    this.__setModule();
    
    const hat = this.hat.getHat(10);
    if(hat) {
        const button = script.getField('BUTTON');
        const state = script.getField('STATE');
        switch(button) {
            case 'A':
                switch(state) {
                    case 'CLICKED': return hat.isButtonAClicked();
                    case 'LONG_PRESSED': return hat.isButtonALongPressed();
                }
                break;
            case 'B':
                switch(state) {
                    case 'CLICKED': return hat.isButtonBClicked();
                    case 'LONG_PRESSED': return hat.isButtonBLongPressed();
                }
                break;
        }
    }
    return false;
};

CheeseRobot.prototype.__LED_MATRIX_COLORS = {
    RED: 4,
    ORANGE: 8,
    YELLOW: 6,
    GREEN: 2,
    SKY_BLUE: 3,
    BLUE: 1,
    PURPLE: 5,
    VIOLET: 9,
    WHITE: 7
};

CheeseRobot.prototype.hat010BackgroundTurnOnXY = function(script) {
    this.__setModule();
    
    let x = script.getNumberValue('X');
    let y = script.getNumberValue('Y');
    let color = script.getField('COLOR');
    const hat = this.hat.getHat(10);
    
    x = parseInt(x);
    y = parseInt(y);
    color = this.__LED_MATRIX_COLORS[color];
    if(hat && (typeof x == 'number') && (typeof y == 'number') && (typeof color == 'number')) {
        hat.getLedMatrix().setBackgroundPixel(x, y, color);
        hat.issueMatrixUpdate();
    }
    return script.callReturn();
};

CheeseRobot.prototype.hat010BackgroundTurnOffXY = function(script) {
    this.__setModule();
    
    let x = script.getNumberValue('X');
    let y = script.getNumberValue('Y');
    const hat = this.hat.getHat(10);
    
    x = parseInt(x);
    y = parseInt(y);
    if(hat && (typeof x == 'number') && (typeof y == 'number')) {
        hat.getLedMatrix().setBackgroundPixel(x, y, 0);
        hat.issueMatrixUpdate();
    }
    return script.callReturn();
};

CheeseRobot.prototype.hat010BackgroundDrawShapeAtXY = function(script) {
    this.__setModule();
    
    let color = script.getField('COLOR');
    const shape = script.getField('SHAPE');
    let x = script.getNumberValue('X');
    let y = script.getNumberValue('Y');
    const hat = this.hat.getHat(10);
    
    x = parseInt(x);
    y = parseInt(y);
    color = this.__LED_MATRIX_COLORS[color];
    if(hat && (typeof x == 'number') && (typeof y == 'number') && (typeof color == 'number') && shape) {
        if(hat.getLedMatrix().drawBackgroundShape(x, y, shape, color)) {
            hat.issueMatrixUpdate();
        }
    }
    return script.callReturn();
};

CheeseRobot.prototype.hat010BackgroundDrawStringAtXY = function(script) {
    this.__setModule();
    
    let color = script.getField('COLOR');
    const text = script.getStringValue('TEXT');
    let x = script.getNumberValue('X');
    let y = script.getNumberValue('Y');
    const hat = this.hat.getHat(10);
    
    x = parseInt(x);
    y = parseInt(y);
    color = this.__LED_MATRIX_COLORS[color];
    if(hat && (typeof x == 'number') && (typeof y == 'number') && (typeof color == 'number') && text) {
        if(hat.getLedMatrix().drawBackgroundString(x, y, text, color)) {
            hat.issueMatrixUpdate();
        }
    }
    return script.callReturn();
};

CheeseRobot.prototype.hat010BackgroundDrawPatternAtXY = function(script) {
    this.__setModule();
    
    let color = script.getField('COLOR');
    const pattern = script.getStringValue('PATTERN');
    let x = script.getNumberValue('X');
    let y = script.getNumberValue('Y');
    const hat = this.hat.getHat(10);
    
    x = parseInt(x);
    y = parseInt(y);
    color = this.__LED_MATRIX_COLORS[color];
    if(hat && (typeof x == 'number') && (typeof y == 'number') && (typeof color == 'number') && pattern) {
        if(hat.getLedMatrix().drawBackgroundPattern(x, y, pattern, color)) {
            hat.issueMatrixUpdate();
        }
    }
    return script.callReturn();
};

CheeseRobot.prototype.hat010Clear = function(script) {
    this.__setModule();
    
    const target = script.getField('TARGET');
    const hat = this.hat.getHat(10);
    
    if(hat) {
        if(target == 'ALL') hat.getLedMatrix().clearAll();
        else hat.getLedMatrix().clearBackground();
        hat.issueMatrixUpdate();
    }
    return script.callReturn();
};

CheeseRobot.prototype.hat010ScrollByXY = function(script) {
    this.__setModule();
    
    const target = script.getField('TARGET');
    let x = script.getNumberValue('X');
    let y = script.getNumberValue('Y');
    const hat = this.hat.getHat(10);
    
    x = parseInt(x);
    y = parseInt(y);
    if(hat && (typeof x == 'number') && (typeof y == 'number')) {
        if(target == 'ALL') hat.getLedMatrix().scrollAllBy(x, y);
        else hat.getLedMatrix().scrollBackgroundBy(x, y);
        hat.issueMatrixUpdate();
    }
    return script.callReturn();
};

CheeseRobot.prototype.hat010SpriteSetToShape = function(script) {
    this.__setModule();
    
    let sprite = script.getNumberValue('SPRITE');
    let color = script.getField('COLOR');
    const shape = script.getField('SHAPE');
    const hat = this.hat.getHat(10);
    
    sprite = parseInt(sprite);
    color = this.__LED_MATRIX_COLORS[color];
    if(hat && (typeof sprite == 'number') && (typeof color == 'number') && shape) {
        if(hat.getLedMatrix().setSpriteShape(sprite, shape, color)) {
            hat.issueMatrixUpdate();
        }
    }
    return script.callReturn();
};

CheeseRobot.prototype.hat010SpriteSetToString = function(script) {
    this.__setModule();
    
    let sprite = script.getNumberValue('SPRITE');
    let color = script.getField('COLOR');
    const text = script.getStringValue('TEXT');
    const hat = this.hat.getHat(10);
    
    sprite = parseInt(sprite);
    color = this.__LED_MATRIX_COLORS[color];
    if(hat && (typeof sprite == 'number') && (typeof color == 'number') && text) {
        if(hat.getLedMatrix().setSpriteString(sprite, text, color)) {
            hat.issueMatrixUpdate();
        }
    }
    return script.callReturn();
};

CheeseRobot.prototype.hat010SpriteSetToPattern = function(script) {
    this.__setModule();
    
    let sprite = script.getNumberValue('SPRITE');
    let color = script.getField('COLOR');
    const pattern = script.getStringValue('PATTERN');
    const hat = this.hat.getHat(10);
    
    sprite = parseInt(sprite);
    color = this.__LED_MATRIX_COLORS[color];
    if(hat && (typeof sprite == 'number') && (typeof color == 'number') && pattern) {
        if(hat.getLedMatrix().setSpritePattern(sprite, pattern, color)) {
            hat.issueMatrixUpdate();
        }
    }
    return script.callReturn();
};

CheeseRobot.prototype.hat010SpriteClearShowHide = function(script) {
    this.__setModule();
    
    let sprite = script.getNumberValue('SPRITE');
    const action = script.getField('ACTION');
    const hat = this.hat.getHat(10);
    
    sprite = parseInt(sprite);
    if(hat && (typeof sprite == 'number')) {
        switch(action) {
            case 'CLEAR': hat.getLedMatrix().clearSprite(sprite); break;
            case 'SHOW': hat.getLedMatrix().showSprite(sprite); break;
            case 'HIDE': hat.getLedMatrix().hideSprite(sprite); break;
        }
        hat.issueMatrixUpdate();
    }
    return script.callReturn();
};

CheeseRobot.prototype.hat010SpriteChangePositionsByXY = function(script) {
    this.__setModule();
    
    let sprite = script.getNumberValue('SPRITE');
    let x = script.getNumberValue('X');
    let y = script.getNumberValue('Y');
    const hat = this.hat.getHat(10);
    
    sprite = parseInt(sprite);
    x = parseInt(x);
    y = parseInt(y);
    if(hat && (typeof sprite == 'number') && (typeof x == 'number') && (typeof y == 'number')) {
        hat.getLedMatrix().changeSpritePositionsBy(sprite, x, y);
        hat.issueMatrixUpdate();
    }
    return script.callReturn();
};

CheeseRobot.prototype.hat010SpriteSetPositionsToXY = function(script) {
    this.__setModule();
    
    let sprite = script.getNumberValue('SPRITE');
    let x = script.getNumberValue('X');
    let y = script.getNumberValue('Y');
    const hat = this.hat.getHat(10);
    
    sprite = parseInt(sprite);
    x = parseInt(x);
    y = parseInt(y);
    if(hat && (typeof sprite == 'number') && (typeof x == 'number') && (typeof y == 'number')) {
        hat.getLedMatrix().setSpritePositionsTo(sprite, x, y);
        hat.issueMatrixUpdate();
    }
    return script.callReturn();
};

CheeseRobot.prototype.hat010SpriteChangePositionByValue = function(script) {
    this.__setModule();
    
    let sprite = script.getNumberValue('SPRITE');
    const position = script.getField('POSITION');
    let value = script.getNumberValue('VALUE');
    const hat = this.hat.getHat(10);
    
    sprite = parseInt(sprite);
    value = parseInt(value);
    if(hat && (typeof sprite == 'number') && (typeof value == 'number')) {
        hat.getLedMatrix().changeSpritePositionBy(sprite, position == 'X', value);
        hat.issueMatrixUpdate();
    }
    return script.callReturn();
};

CheeseRobot.prototype.hat010SpriteSetPositionToValue = function(script) {
    this.__setModule();
    
    let sprite = script.getNumberValue('SPRITE');
    const position = script.getField('POSITION');
    let value = script.getNumberValue('VALUE');
    const hat = this.hat.getHat(10);
    
    sprite = parseInt(sprite);
    value = parseInt(value);
    if(hat && (typeof sprite == 'number') && (typeof value == 'number')) {
        hat.getLedMatrix().setSpritePositionTo(sprite, position == 'X', value);
        hat.issueMatrixUpdate();
    }
    return script.callReturn();
};

CheeseRobot.prototype.hat010SpriteRotate = function(script) {
    this.__setModule();
    
    let sprite = script.getNumberValue('SPRITE');
    const direction = script.getField('DIRECTION');
    const hat = this.hat.getHat(10);
    
    sprite = parseInt(sprite);
    if(hat && (typeof sprite == 'number')) {
        hat.getLedMatrix().rotateSprite(sprite, direction == 'CLOCKWISE');
        hat.issueMatrixUpdate();
    }
    return script.callReturn();
};

CheeseRobot.prototype.hat010SpriteFlipInDirection = function(script) {
    this.__setModule();
    
    let sprite = script.getNumberValue('SPRITE');
    const direction = script.getField('DIRECTION');
    const hat = this.hat.getHat(10);
    
    sprite = parseInt(sprite);
    if(hat && (typeof sprite == 'number')) {
        hat.getLedMatrix().flipSprite(sprite, direction == 'LEFT_RIGHT');
        hat.issueMatrixUpdate();
    }
    return script.callReturn();
};

CheeseRobot.prototype.hat010SpriteStampToBackground = function(script) {
    this.__setModule();
    
    let sprite = script.getNumberValue('SPRITE');
    const hat = this.hat.getHat(10);
    
    sprite = parseInt(sprite);
    if(hat && (typeof sprite == 'number')) {
        hat.getLedMatrix().stampSprite(sprite);
        hat.issueMatrixUpdate();
    }
    return script.callReturn();
};

CheeseRobot.prototype.hat010GetSpritePosition = function(script) {
    this.__setModule();
    
    let sprite = script.getNumberValue('SPRITE');
    const position = script.getField('POSITION');
    const hat = this.hat.getHat(10);
    
    sprite = parseInt(sprite);
    if(hat && (typeof sprite == 'number')) {
        return hat.getLedMatrix().getSpritePosition(sprite, position == 'X');
    }
    return 0;
};

CheeseRobot.prototype.hat010CheckCheckSpriteSpriteTouched = function(script) {
    this.__setModule();
    
    let sprite = script.getNumberValue('SPRITE');
    let target = script.getNumberValue('TARGET');
    const hat = this.hat.getHat(10);
    
    sprite = parseInt(sprite);
    target = parseInt(target);
    if(hat && (typeof sprite == 'number') && (typeof target == 'number')) {
        const matrix = hat.getLedMatrix();
        matrix.update();
        return matrix.checkSpritesTouched(sprite, target);
    }
    return false;
};

CheeseRobot.prototype.hat010CheckCheckSpriteTouched = function(script) {
    this.__setModule();
    
    let sprite = script.getNumberValue('SPRITE');
    const target = script.getField('TARGET');
    const hat = this.hat.getHat(10);
    
    sprite = parseInt(sprite);
    if(hat && (typeof sprite == 'number')) {
        const matrix = hat.getLedMatrix();
        matrix.update();
        switch(target) {
            case 'BACKGROUND': return matrix.checkBackgroundTouched(sprite);
            case 'OTHER_SPRITE': return matrix.checkOtherSpriteTouched(sprite);
            case 'LEFT_WALL': return matrix.checkWallTouched(sprite, 0);
            case 'RIGHT_WALL': return matrix.checkWallTouched(sprite, 1);
            case 'TOP_WALL': return matrix.checkWallTouched(sprite, 2);
            case 'BOTTOM_WALL': return matrix.checkWallTouched(sprite, 3);
            case 'ANY_WALL': return matrix.checkWallTouched(sprite, -1);
        }
    }
    return false;
};

CheeseRobot.prototype.hat010ChangeBrightnessBy = function(script) {
    this.__setModule();
    
    let brightness = script.getNumberValue('BRIGHTNESS');
    const hat = this.hat.getHat(10);
    
    brightness = parseInt(brightness);
    if(hat && (typeof brightness == 'number')) {
        hat.getLedMatrix().changeBrightnessBy(brightness);
        hat.issueMatrixUpdate();
    }
    return script.callReturn();
};

CheeseRobot.prototype.hat010SetBrightnessTo = function(script) {
    this.__setModule();
    
    let brightness = script.getNumberValue('BRIGHTNESS');
    const hat = this.hat.getHat(10);
    
    brightness = parseInt(brightness);
    if(hat && (typeof brightness == 'number')) {
        hat.getLedMatrix().setBrightnessTo(brightness);
        hat.issueMatrixUpdate();
    }
    return script.callReturn();
};

/**PioButtonChecker**/
function PioButtonChecker() {
    this.reset();
}

PioButtonChecker.prototype.reset = function() {
    this.__state = 0;
    this.__pressTime = 0;
    this.__clicked = false;
    this.__longPressed = false;
    this.__prevPressed = false;
    this.__pressedEvent = false;
    this.__releasedEvent = false;
    this.__clickedEvent = false;
    this.__longPressedEvent = false;
};

PioButtonChecker.prototype.clearEvent = function() {
    this.__pressedEvent = false;
    this.__releasedEvent = false;
    this.__clickedEvent = false;
    this.__longPressedEvent = false;
};

PioButtonChecker.prototype.check = function(pressed) {
    this.__clicked = false;
    this.__longPressed = false;
    switch (this.__state) {
        case 0: // ready state and wait for press
            if (pressed) {
                this.__pressTime = Date.now();
                this.__state = 1;
            }
            break;
        case 1: // check how long button is pressed
            if (pressed) {
                if (Date.now() - this.__pressTime > 1500) {
                    this.__longPressed = true;
                    this.__state = 2;
                }
            } else {
                if (Date.now() - this.__pressTime < 750) {
                    this.__clicked = true;
                }
                this.__state = 0;
            }
            break;
        case 2: // check release of long-click
            if (!pressed) this.__state = 0;
            break;
    }
    if (!this.__prevPressed && pressed) this.__pressedEvent = true;
    if (this.__prevPressed && !pressed) this.__releasedEvent = true;
    if (this.__clicked) this.__clickedEvent = true;
    if (this.__longPressed) this.__longPressedEvent = true;
    this.__prevPressed = pressed;
};

PioButtonChecker.prototype.isPressed = function() {
    return this.__pressedEvent;
};

PioButtonChecker.prototype.isReleased = function() {
    return this.__releasedEvent;
};

PioButtonChecker.prototype.isClicked = function() {
    return this.__clickedEvent;
};

PioButtonChecker.prototype.isLongPressed = function() {
    return this.__longPressedEvent;
};

/**PioRobot**/
function PioRobot(index) {
    this.sensory = {
        signalStrength: 0,
        forwardButton: 0,
        backwardButton: 0,
        leftButton: 0,
        rightButton: 0,
        runButton: 0,
        behaviorButton: 0,
        repeatButton: 0,
        clearButton: 0,
        wheelStateId: 0,
        neckEncoder: 0,
        neckStateId: 0,
        soundStateId: 0,
        batteryState: 3,
        usbState: 0,
        chargeState: 0,
    };
    this.motoring = {
        group: 'pio',
        module: 'pio',
        index,
    };
    // sensory.*StateId는 0부터 증가하는 카운터이므로 0으로 초기화한다.
    // -1이면 첫 완료(0->1)가 감지되지 않아 블록 콜백이 실행되지 않는다.
    this.wheelStateId = 0;
    this.neckStateId = 0;
    this.soundStateId = 0;
    this.blockId = 0;
    this.wheelMoving = false;
    this.motionCallback = undefined;
    this.motioning = false;
    this.boardCommand = 0;
    this.boardState = 0;
    this.boardCallback = undefined;
    this.boarding = false;
    this.neckMotionCallback = undefined;
    this.neckMotioning = false;
    this.currentSound = 0;
    this.soundRepeat = 1;
    this.soundCallback = undefined;
    this.sounding = false;
    this.buzzing = false;
    this.noteId = 0;
    this.noteTimer1 = undefined;
    this.noteTimer2 = undefined;
    this.noting = false;
    this.resting = false;
    this.tempo = 60;
    this.timeouts = [];
    this.buttons = new Array(8);
    this.buttonCheckers = new Array(8);
    for (let i = 0; i < 8; ++i) {
        this.buttons[i] = 0;
        this.buttonCheckers[i] = new PioButtonChecker();
    }
}

PioRobot.prototype.__PORT_MAP = {
    group: 'pio',
    module: 'pio',
    leftWheel: 0,
    rightWheel: 0,
    leftEyeRed: 0,
    leftEyeGreen: 0,
    leftEyeBlue: 0,
    rightEyeRed: 0,
    rightEyeGreen: 0,
    rightEyeBlue: 0,
    buzzer: 0,
    turboId: 0,
    turbo: 0,
    pulseId: 0,
    pulse: 0,
    neckSpeedId: 0,
    neckSpeed: 4,
    neckAngleId: 0,
    neckAngle: 0,
    eyePatternId: 0,
    eyePattern: 0,
    noteId: 0,
    note: 0,
    soundId: 0,
    sound: 0,
    motionId: 0,
    motionType: 0,
    motionUnit: 0,
    motionSpeed: 0,
    motionValue: 0,
    motionRadius: 0,
};

// 벤더 규격이 정한 값 범위. 출처는 제조사 문서 BabyChicken_Doc.md 다.
// 바퀴 "0은 정지. 최대 100 %", 목 Mode 3 "Angle은 -90~+90도 범위",
// 버저 "16bit 값으로 1부터 최대 65535 ... 최대값 65535은 6553.5Hz", 눈 RGB 0~255.
PioRobot.prototype.__LIMITS = {
    wheel: { min: -100, max: 100, unit: '' },
    // 이 ±90 은 Mode 3 상대 명령의 프로토콜 범위다. 물리 가동 범위는 ±45 이고 넘기면
    // 소리 없이 탈조한다. 상대 명령이라 ±45 클램프로도 막히지 않는다.
    // 안전한 상한이 확정되지 않았으므로 여기 숫자를 안전 범위로 읽지 말 것.
    neckAngle: { min: -90, max: 90, unit: '°' },
    eyeRgb: { min: 0, max: 255, unit: '' },
    buzzer: { min: 0, max: 6553.5, unit: 'Hz' },
};

// 이동/회전 거리는 entry-hw 가 펄스로 바꿔 16비트 필드에 싣는다. 배수는 entry-hw pio.js 의
// CM_TO_PULSE / DEG_TO_PULSE_* 와 같아야 한다. 넘치면 하위 16비트만 남아 엉뚱한 거리를 간다.
PioRobot.prototype.__MAX_PULSE = 65535;
PioRobot.prototype.__PULSE_PER_UNIT = {
    1: 968,
    2: 968,
    3: 15104 / 360,
    4: 15104 / 360,
    5: 30375 / 360,
    6: 30375 / 360,
    7: 30336 / 360,
    8: 30336 / 360,
};

// 유한한 수일 때만 값을 돌려준다. getNumberValue 는 NaN 을 내지 않지만 Infinity 는 통과시키고,
// 누적하는 블록에서 Infinity 끼리 만나면 NaN 이 되어 버퍼에 영구히 남는다.
PioRobot.prototype.__finite = function(value) {
    const n = parseFloat(value);
    return Number.isFinite(n) ? n : undefined;
};

PioRobot.prototype.__clamp = function(key, value, min, max, unit) {
    // NaN 과 undefined 는 포화시킬 방향이 없다. 중립값으로 둔다(entry-hw _sat 과 같은 정책).
    // (이 방어가 없으면 두 비교가 모두 거짓이 되어 max 로 떨어진다: 바퀴 100, 눈 255.)
    // 부호 있는 무한대는 여기서 걸러내지 않는다. 아래 비교가 각 끝값으로 보내고, 그것이
    // 기존 동작이자 _sat 의 동작이다(_sat 도 isNaN 만 본다).
    if (Number.isNaN(Number(value))) return min <= 0 && max >= 0 ? 0 : min;
    if (value >= min && value <= max) return value;
    const clamped = value < min ? min : max;
    this.__warnLimit(key, min, max, clamped, unit);
    return clamped;
};

// 실행당 항목별 1회만 알린다. setZero(엔진 정지)에서 초기화된다.
PioRobot.prototype.__warnLimit = function(key, min, max, clamped, unit) {
    if (!this.limitWarned) this.limitWarned = {};
    if (this.limitWarned[key]) return;
    // 가드를 플래그보다 먼저 본다. 워크스페이스 초기화 전에는 Entry.toast 가 없는데, 먼저
    // 플래그를 세우면 실행당 1회 예산이 소진돼 그 뒤로 영구히 안내가 안 뜬다.
    // 값 제한 자체는 안내와 무관하게 적용된다.
    if (!Entry.toast) return;
    if (typeof Lang === 'undefined' || !Lang.Msgs || !Lang.Msgs.pio_value_out_of_range) return;
    this.limitWarned[key] = true;
    // 도(°)는 숫자에 붙여 쓰고 cm 와 Hz 는 띄어 쓴다.
    const u = !unit ? '' : unit === '°' ? unit : ' ' + unit;
    Entry.toast.warning(
        Lang.Msgs.pio_value_out_of_range_title,
        Lang.Msgs.pio_value_out_of_range
            .replace('%1', min + u + ' ~ ' + max + u)
            .replace('%2', clamped + u)
    );
};

// 목 각도가 프로토콜 범위를 넘었을 때. 범위도 조정값도 말하지 않는다(__setNeckAngle 주석 참고).
PioRobot.prototype.__warnNeckRange = function() {
    if (!this.limitWarned) this.limitWarned = {};
    if (this.limitWarned.neck) return;
    if (!Entry.toast) return;
    if (typeof Lang === 'undefined' || !Lang.Msgs || !Lang.Msgs.pio_neck_angle_too_large) return;
    this.limitWarned.neck = true;
    Entry.toast.warning(
        Lang.Msgs.pio_neck_angle_too_large_title,
        Lang.Msgs.pio_neck_angle_too_large
    );
};

// setTimeout 의 지연은 32비트 부호 있는 정수(최대 2147483647ms, 약 24.8일)까지만 유효하다.
// 넘는 값을 넘기면 엔진이 지연을 1ms 로 취급해 콜백을 즉시 실행한다. 길게 요청할수록 빨리
// 끝나는 뒤집힌 동작이 된다. 박자와 초 단위 대기는 상한이 없어 이 한계를 넘길 수 있다.
PioRobot.prototype.__MAX_DELAY_MS = 2147483647;

// 대기 시간을 유효 범위로 제한한다. 조정되면 실행당 1회 알린다.
PioRobot.prototype.__clampDelay = function(ms) {
    const n = parseFloat(ms);
    // NaN, 0, 음수는 전부 즉시 실행이다. 특히 NaN 은 "값이 없다"는 뜻이지 "너무 길다"가
    // 아니므로 상한으로 보내면 안 된다(__clamp 와 같은 정책). 알리지도 않는다.
    // 상한 초과와 무한대만 알린다.
    if (!(n > 0)) return 0;
    if (n <= this.__MAX_DELAY_MS) return n;
    this.__warnDelay();
    return this.__MAX_DELAY_MS;
};

// 범위도 조정값도 말하지 않는다. 24.8일이라는 숫자는 사용자에게 의미가 없다.
PioRobot.prototype.__warnDelay = function() {
    if (!this.limitWarned) this.limitWarned = {};
    if (this.limitWarned.delay) return;
    // 가드를 플래그보다 먼저 본다(__warnLimit 주석 참고).
    if (!Entry.toast) return;
    if (typeof Lang === 'undefined' || !Lang.Msgs || !Lang.Msgs.pio_delay_too_long) return;
    this.limitWarned.delay = true;
    Entry.toast.warning(Lang.Msgs.pio_delay_too_long_title, Lang.Msgs.pio_delay_too_long);
};

// 이동/회전 입력값의 상한. 초 단위는 펄스를 쓰지 않아 상한이 없다.
PioRobot.prototype.__motionLimit = function(type, unit) {
    if (unit === 3) return { max: this.__MAX_PULSE, unit: '' };
    if (unit !== 1) return null;
    const per = this.__PULSE_PER_UNIT[type];
    if (!per) return null;
    // 안내 문구에 적히는 한계값과 실제로 전송되는 값이 같도록 소수 1자리에서 내린다.
    return { max: Math.floor((this.__MAX_PULSE / per) * 10) / 10, unit: type <= 2 ? 'cm' : '°' };
};

// 누적하는 블록이 있으므로 델타가 아니라 누적 결과를 제한한다.
PioRobot.prototype.__clampWheels = function() {
    const motoring = this.motoring;
    const L = this.__LIMITS.wheel;
    motoring.leftWheel = this.__clamp('wheel', motoring.leftWheel, L.min, L.max, L.unit);
    motoring.rightWheel = this.__clamp('wheel', motoring.rightWheel, L.min, L.max, L.unit);
};

PioRobot.prototype.__EYE_CHANNELS = [
    'leftEyeRed',
    'leftEyeGreen',
    'leftEyeBlue',
    'rightEyeRed',
    'rightEyeGreen',
    'rightEyeBlue',
];

PioRobot.prototype.__clampEyes = function() {
    const motoring = this.motoring;
    const L = this.__LIMITS.eyeRgb;
    for (const key of this.__EYE_CHANNELS) {
        motoring[key] = this.__clamp('eye', motoring[key], L.min, L.max, L.unit);
    }
};

// (x % 255) + 1 로 증가하는 명령 id 카운터. setZero에서 0으로 재시드하지 않고 보존한다
// (entry-hw 모듈의 _prev_*Id와의 충돌 방지. setZero 주석 참고).
PioRobot.prototype.__ID_PORTS = [
    'turboId',
    'pulseId',
    'neckSpeedId',
    'neckAngleId',
    'eyePatternId',
    'noteId',
    'soundId',
    'motionId',
];

PioRobot.prototype.setZero = function() {
    this.limitWarned = {}; // 실행마다 안내를 다시 낼 수 있게
    // *Id 카운터는 세션 내 단조 증가로 보존한다(0 재시드 금지). entry-hw 모듈의 _prev_*Id는
    // 워크스페이스 소켓이 살아있는 한 유지되는데, 카운터를 0으로 되돌리면 다음 실행이 만드는
    // id가 이전 실행과 같은 값에 도달해 명령이 통째로 삼켜진다(정지 후 재실행 시 터보 무반응,
    // 이어지는 이동 블록이 완료 신호를 못 받아 무한 대기). 옛 재시드가 겸하던 정지
    // 부수효과(터보 해제, 펄스/모션/음/소리 정지, 목 중립 복귀)는 아래에서 명시적 id 증가
    // 명령으로 재현한다.
    const portMap = this.__PORT_MAP;
    const motoring = this.motoring;
    const idPorts = this.__ID_PORTS;
    for (const port in portMap) {
        if (idPorts.indexOf(port) >= 0 && motoring[port] !== undefined) {
            continue; // 카운터 보존 (undefined면 아래 시드로 0 초기화)
        }
        motoring[port] = portMap[port];
    }
    // 정지 부수효과 재현 (각 id 증가 포함, entry-hw가 실제로 반영)
    this.__setTurbo(0); // 터보 기본값(off): 이전 실행의 터보 모드가 새 실행으로 누수되지 않게
    this.__setPulse(0);
    this.__setMotion(0, 0, 0, 0, 0);
    this.__setNeckSpeed(4); // 목 속도 기본값
    // 목 중립 복귀. 알려진 좁은 한계: 이 복귀 명령의 완료 신호가, 목 회전 블록을 쓰는
    // 프로그램을 목이 아직 복귀 중일 때 초고속 재시작하면 그 블록의 완료 기준선 캡처 직후
    // 도착해 조기 완료될 수 있다(사람 조작 간격에선 복귀가 먼저 끝나 발생 안 함).
    this.__setNeckAngle(0);
    this.__setNote(0); // 음 정지
    this.__setSound(0); // 소리 정지
    // 센서 카운터 시작값(0)에 맞춘다(-1 아님). 생성자 주석 참고.
    this.wheelStateId = 0;
    this.neckStateId = 0;
    this.soundStateId = 0;
    this.blockId = 0;
    this.wheelMoving = false;
    this.motionCallback = undefined;
    this.motioning = false;
    this.boardCommand = 0;
    this.boardState = 0;
    this.boardCallback = undefined;
    this.boarding = false;
    this.neckMotionCallback = undefined;
    this.neckMotioning = false;
    this.currentSound = 0;
    this.soundRepeat = 1;
    this.soundCallback = undefined;
    this.sounding = false;
    this.buzzing = false;
    this.noteId = 0;
    this.noteTimer1 = undefined;
    this.noteTimer2 = undefined;
    this.noting = false;
    this.resting = false;
    this.tempo = 60;
    for (let i = 0; i < 8; ++i) {
        this.buttons[i] = 0;
        this.buttonCheckers[i].reset();
    }
    this.__removeAllTimeouts();
};

PioRobot.prototype.afterReceive = function(pd) {
    this.sensory = pd;
    this.handleSensory();
};

PioRobot.prototype.afterSend = function(sq) {};

PioRobot.prototype.setMotoring = function(motoring) {
    this.motoring = motoring;
    // getRobot()은 블록 실행마다 this.motoring을 공유 Entry.hw.sendQueue로 바꾼다.
    // 그 객체에는 Pio의 motoring 필드가 아직 없을 수 있으므로 빠진 필드를 채운다.
    // 그래야 (this.motoring.xId % 255) + 1 계산이 undefined를 읽어 NaN이 되지 않는다.
    const portMap = this.__PORT_MAP;
    for (const port in portMap) {
        if (motoring[port] === undefined) {
            motoring[port] = portMap[port];
        }
    }
};

PioRobot.prototype.__setModule = function() {
    this.motoring.group = 'pio';
    this.motoring.module = 'pio';
};

PioRobot.prototype.clearEvent = function() {
    for (let i = 0; i < 8; ++i) {
        this.buttonCheckers[i].clearEvent();
    }
};

PioRobot.prototype.__BUTTON_INDEX = {
    MOVE_FORWARD: 0,
    MOVE_BACKWARD: 1,
    MOVE_LEFT: 2,
    MOVE_RIGHT: 3,
    RUN: 4,
    BEHAVIOR: 5,
    REPEAT: 6,
    CLEAR: 7,
};

PioRobot.prototype.__BUTTONS = [
    'forwardButton',
    'backwardButton',
    'leftButton',
    'rightButton',
    'runButton',
    'behaviorButton',
    'repeatButton',
    'clearButton',
];

PioRobot.prototype.__removeTimeout = function(id) {
    clearTimeout(id);
    const idx = this.timeouts.indexOf(id);
    if (idx >= 0) {
        this.timeouts.splice(idx, 1);
    }
};

PioRobot.prototype.__removeAllTimeouts = function() {
    const timeouts = this.timeouts;
    for (const i in timeouts) {
        clearTimeout(timeouts[i]);
    }
    this.timeouts = [];
};

PioRobot.prototype.__setTurbo = function(turbo) {
    this.motoring.turbo = turbo;
    this.motoring.turboId = (this.motoring.turboId % 255) + 1;
};

PioRobot.prototype.__setPulse = function(pulse) {
    this.motoring.pulse = pulse;
    this.motoring.pulseId = (this.motoring.pulseId % 255) + 1;
};

PioRobot.prototype.__setNeckSpeed = function(speed) {
    this.motoring.neckSpeed = speed;
    this.motoring.neckSpeedId = (this.motoring.neckSpeedId % 255) + 1;
};

// 목은 공용 안내 문구를 쓰지 않는다. __LIMITS.neckAngle 의 ±90 은 Mode 3 프로토콜 범위이고
// 물리 가동 범위는 ±45 다. 공용 문구는 "%1 범위를 벗어나 %2 로 조정했다"고 말하는데, 목에서는
// 두 숫자 다 사실이 아니다. 90 도는 쓸 수 있는 값이 아니고 조정 결과도 안전하지 않다.
// 안전한 상한이 확정되지 않았으므로 범위를 단정하지 않는 문구로 대신한다.
// clamp 는 와이어 유효성 때문에 남긴다: 제한이 없으면 toHex(3000) 이 int8 -72 가 되어
// 반대 방향으로 돈다.
PioRobot.prototype.__setNeckAngle = function(deg) {
    const L = this.__LIMITS.neckAngle;
    if (!Number.isFinite(deg)) deg = 0;
    else if (deg < L.min || deg > L.max) {
        deg = deg < L.min ? L.min : L.max;
        this.__warnNeckRange();
    }
    this.motoring.neckAngle = deg;
    this.motoring.neckAngleId = (this.motoring.neckAngleId % 255) + 1;
    this.neckMotioning = deg != 0;
};

PioRobot.prototype.__setNote = function(note) {
    this.motoring.note = note;
    this.motoring.noteId = (this.motoring.noteId % 255) + 1;
};

PioRobot.prototype.__issueNoteId = function() {
    this.noteId = this.blockId = (this.blockId % 65535) + 1;
    return this.noteId;
};

PioRobot.prototype.__cancelNote = function() {
    this.noteId = 0;
    if (this.noteTimer1 !== undefined) {
        this.__removeTimeout(this.noteTimer1);
    }
    if (this.noteTimer2 !== undefined) {
        this.__removeTimeout(this.noteTimer2);
    }
    this.noteTimer1 = undefined;
    this.noteTimer2 = undefined;
};

PioRobot.prototype.__setSound = function(sound) {
    this.motoring.sound = sound;
    this.motoring.soundId = (this.motoring.soundId % 255) + 1;
};

PioRobot.prototype.__runSound = function(sound, count) {
    if (typeof count != 'number') count = 1;
    if (count < 0) count = -1;
    if (count) {
        this.currentSound = sound;
        this.soundRepeat = count;
        this.__setSound(sound);
    }
    this.sounding = sound != 0;
};

PioRobot.prototype.__cancelSound = function() {
    this.soundCallback = undefined;
};

PioRobot.prototype.__setMotion = function(type, unit, speed, value, radius) {
    const motoring = this.motoring;
    motoring.motionType = type;
    motoring.motionUnit = unit;
    motoring.motionSpeed = speed;
    motoring.motionValue = value;
    motoring.motionRadius = radius;
    this.motoring.motionId = (this.motoring.motionId % 255) + 1;
    this.motioning = type != 0;
};

// 완료 처리(handleSensory)는 motionCallback / boardCallback 이 살아있는 것을 게이트로 쓴다.
// 취소가 콜백만 지우고 진행 플래그를 남기면, 플래그를 내리는 코드에 다시 도달할 수 없어
// isWheelMoving 이 로봇 상태와 무관하게 계속 참이 된다. 취소는 진행 플래그까지 내린다.
PioRobot.prototype.__cancelMotion = function() {
    this.motionCallback = undefined;
    this.motioning = false;
};

PioRobot.prototype.__cancelBoard = function() {
    this.boardCommand = 0;
    this.boardState = 0;
    this.boardCallback = undefined;
    this.boarding = false;
};

// __cancelMotion/__cancelBoard 와 같은 이유로 진행 플래그까지 내린다. 완료 처리는
// neckMotionCallback 이 살아있는 것을 게이트로 쓰므로, 콜백만 지우면 neckMotioning 을
// 내릴 코드에 다시 도달할 수 없어 isNeckMoving 이 계속 참으로 남는다.
PioRobot.prototype.__cancelNeckMotion = function() {
    this.neckMotionCallback = undefined;
    this.neckMotioning = false;
};

PioRobot.prototype.__checkWheelMoving = function() {
    const motoring = this.motoring;
    this.wheelMoving = motoring.leftWheel != 0 || motoring.rightWheel != 0;
};

PioRobot.prototype.__checkSoundPlaying = function() {
    const motoring = this.motoring;
    this.buzzing = motoring.buzzer != 0;
    this.noting = motoring.note != 0;
    this.resting = false;
};

PioRobot.prototype.handleSensory = function() {
    const sensory = this.sensory;

    // 버튼 엣지 이벤트는 매 수신 패킷 시작 시(재감지 전) 지운다. afterSend가 아니다.
    // afterReceive가 직후 'pioWhenButtonState'를 발생시키고 해당 햇 블록은 다음 엔진
    // 틱에서 실행되므로, 지우는 시점을 패킷 주기에 맞춰야 엣지 플래그가 패킷 사이
    // 구간 동안 살아 있어 햇이 엣지당 한 번씩 감지한다.
    this.clearEvent();
    for (let i = 0; i < 8; ++i) {
        this.buttons[i] = sensory[this.__BUTTONS[i]];
        this.buttonCheckers[i].check(this.buttons[i] == 1);
    }
    if (this.boardCallback && sensory.wheelStateId !== undefined) {
        const t = sensory.wheelStateId;
        if (t != this.wheelStateId) {
            if (this.wheelStateId != -1) {
                const motoring = this.motoring;
                if (this.boardCommand == 1 || this.boardCommand == 2) {
                    motoring.leftWheel = 0;
                    motoring.rightWheel = 0;
                    const callback = this.boardCallback;
                    this.__cancelBoard();
                    this.boarding = false;
                    this.__checkWheelMoving();
                    if (callback) callback();
                } else if (this.boardCommand == 3) {
                    switch (this.boardState) {
                        case 1:
                            this.__board(3, 2, 3, 90, this.boardCallback);
                            break;
                        case 2:
                            this.__board(3, 3, 1, 11.45, this.boardCallback);
                            break;
                        case 3: {
                            motoring.leftWheel = 0;
                            motoring.rightWheel = 0;
                            const callback = this.boardCallback;
                            this.__cancelBoard();
                            this.boarding = false;
                            this.__checkWheelMoving();
                            if (callback) callback();
                            break;
                        }
                    }
                } else if (this.boardCommand == 4) {
                    switch (this.boardState) {
                        case 1:
                            this.__board(4, 2, 4, 90, this.boardCallback);
                            break;
                        case 2:
                            this.__board(4, 3, 1, 11.45, this.boardCallback);
                            break;
                        case 3: {
                            motoring.leftWheel = 0;
                            motoring.rightWheel = 0;
                            const callback = this.boardCallback;
                            this.__cancelBoard();
                            this.boarding = false;
                            this.__checkWheelMoving();
                            if (callback) callback();
                            break;
                        }
                    }
                } else if (this.boardCommand == 5) {
                    switch (this.boardState) {
                        case 1:
                            this.__board(5, 2, 3, 90, this.boardCallback);
                            break;
                        case 2:
                            this.__board(5, 3, 1, 1.45, this.boardCallback);
                            break;
                        case 3: {
                            motoring.leftWheel = 0;
                            motoring.rightWheel = 0;
                            const callback = this.boardCallback;
                            this.__cancelBoard();
                            this.boarding = false;
                            this.__checkWheelMoving();
                            if (callback) callback();
                            break;
                        }
                    }
                } else if (this.boardCommand == 6) {
                    switch (this.boardState) {
                        case 1:
                            this.__board(6, 2, 4, 90, this.boardCallback);
                            break;
                        case 2:
                            this.__board(6, 3, 1, 1.45, this.boardCallback);
                            break;
                        case 3: {
                            motoring.leftWheel = 0;
                            motoring.rightWheel = 0;
                            const callback = this.boardCallback;
                            this.__cancelBoard();
                            this.boarding = false;
                            this.__checkWheelMoving();
                            if (callback) callback();
                            break;
                        }
                    }
                }
            }
            this.wheelStateId = t;
        }
    }
    if (this.motionCallback && sensory.wheelStateId !== undefined) {
        const t = sensory.wheelStateId;
        if (t != this.wheelStateId) {
            if (this.wheelStateId != -1) {
                this.motoring.leftWheel = 0;
                this.motoring.rightWheel = 0;
                this.motioning = false;
                const callback = this.motionCallback;
                this.__cancelMotion();
                this.__checkWheelMoving();
                if (callback) callback();
            }
            this.wheelStateId = t;
        }
    }
    if (this.neckMotionCallback && sensory.neckStateId !== undefined) {
        const t = sensory.neckStateId;
        if (t != this.neckStateId) {
            if (this.neckStateId != -1) {
                this.neckMotioning = false;
                const callback = this.neckMotionCallback;
                this.__cancelNeckMotion();
                if (callback) callback();
            }
            this.neckStateId = t;
        }
    }
    if (sensory.soundStateId !== undefined) {
        const t = sensory.soundStateId;
        if (t != this.soundStateId) {
            if (this.soundStateId != -1) {
                if (this.currentSound > 0) {
                    if (this.soundRepeat < 0) {
                        this.__runSound(this.currentSound, -1);
                    } else if (this.soundRepeat > 1) {
                        this.soundRepeat--;
                        this.__runSound(this.currentSound, this.soundRepeat);
                    } else {
                        this.currentSound = 0;
                        this.soundRepeat = 1;
                        this.sounding = false;
                        const callback = this.soundCallback;
                        this.__cancelSound();
                        this.__checkSoundPlaying();
                        if (callback) callback();
                    }
                } else {
                    this.currentSound = 0;
                    this.soundRepeat = 1;
                    this.sounding = false;
                    const callback = this.soundCallback;
                    this.__cancelSound();
                    this.__checkSoundPlaying();
                    if (callback) callback();
                }
            }
            this.soundStateId = t;
        }
    }
};

PioRobot.prototype.__board = function(command, state, type, value, callback) {
    const motoring = this.motoring;
    this.__cancelMotion();

    motoring.leftWheel = 0;
    motoring.rightWheel = 0;
    this.boardCommand = command;
    this.boardState = state;
    this.boardCallback = callback;
    // 완료 기준선 캡처: entry-hw wheelStateId는 세션 내내 이어지는 카운터라(재실행에도
    // 리셋 안 됨) 절대값 비교가 재실행 때 어긋난다. 시작 시점의 현재값을 기준으로 잡고
    // 이후 카운터가 증가할 때만 완료로 판정한다(재실행 조기완료, 콜백유실 둘 다 방지).
    this.wheelStateId = this.sensory.wheelStateId;
    this.boarding = true;
    this.__setPulse(0);
    motoring.motionType = type;
    motoring.motionUnit = 1;
    motoring.motionSpeed = 0;
    motoring.motionValue = value;
    motoring.motionRadius = 0;
    this.motoring.motionId = (this.motoring.motionId % 255) + 1;
    this.__checkWheelMoving();
};

PioRobot.prototype.__UNITS = {
    CM: 1,
    DEGREES: 1,
    SECONDS: 2,
    PULSES: 3,
};

PioRobot.prototype.__motion = function(type, callback) {
    const motoring = this.motoring;
    this.__cancelBoard();

    motoring.leftWheel = 0;
    motoring.rightWheel = 0;
    this.__setPulse(0);
    this.__setMotion(type, 1, 0, 0, 0); // type, unit, speed, value, radius
    this.motionCallback = callback;
    this.wheelStateId = this.sensory.wheelStateId; // 완료 기준선 캡처(재실행 desync 방지, __board 주석 참고)
    this.__checkWheelMoving();
};

PioRobot.prototype.__motionUnit = function(type, unit, value, callback) {
    const motoring = this.motoring;
    this.__cancelBoard();
    this.__cancelMotion();

    motoring.leftWheel = 0;
    motoring.rightWheel = 0;
    this.__setPulse(0);
    value = this.__finite(value);
    if (value && value > 0) {
        const limit = this.__motionLimit(type, unit);
        if (limit) {
            value = this.__clamp('motion:' + limit.max + limit.unit, value, 0, limit.max, limit.unit);
        }
        this.__setMotion(type, unit, 0, value, 0); // type, unit, speed, value, radius
        this.motionCallback = callback;
        this.wheelStateId = this.sensory.wheelStateId; // 완료 기준선 캡처(재실행 desync 방지, __board 주석 참고)
        this.__checkWheelMoving();
    } else {
        this.__setMotion(0, 0, 0, 0, 0);
        this.__checkWheelMoving();
        callback();
    }
};

PioRobot.prototype.__RGBS = {
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

PioRobot.prototype.__setRgb = function(eye, red, green, blue) {
    const motoring = this.motoring;
    red = this.__finite(red);
    green = this.__finite(green);
    blue = this.__finite(blue);
    if (eye == 'LEFT') {
        if (red !== undefined) motoring.leftEyeRed = red;
        if (green !== undefined) motoring.leftEyeGreen = green;
        if (blue !== undefined) motoring.leftEyeBlue = blue;
    } else if (eye == 'RIGHT') {
        if (red !== undefined) motoring.rightEyeRed = red;
        if (green !== undefined) motoring.rightEyeGreen = green;
        if (blue !== undefined) motoring.rightEyeBlue = blue;
    } else {
        if (red !== undefined) {
            motoring.leftEyeRed = red;
            motoring.rightEyeRed = red;
        }
        if (green !== undefined) {
            motoring.leftEyeGreen = green;
            motoring.rightEyeGreen = green;
        }
        if (blue !== undefined) {
            motoring.leftEyeBlue = blue;
            motoring.rightEyeBlue = blue;
        }
    }
    this.__clampEyes();
};

PioRobot.prototype.__changeRgb = function(eye, red, green, blue) {
    const motoring = this.motoring;
    red = this.__finite(red);
    green = this.__finite(green);
    blue = this.__finite(blue);
    if (eye == 'LEFT') {
        if (red !== undefined) motoring.leftEyeRed += red;
        if (green !== undefined) motoring.leftEyeGreen += green;
        if (blue !== undefined) motoring.leftEyeBlue += blue;
    } else if (eye == 'RIGHT') {
        if (red !== undefined) motoring.rightEyeRed += red;
        if (green !== undefined) motoring.rightEyeGreen += green;
        if (blue !== undefined) motoring.rightEyeBlue += blue;
    } else {
        if (red !== undefined) {
            motoring.leftEyeRed += red;
            motoring.rightEyeRed += red;
        }
        if (green !== undefined) {
            motoring.leftEyeGreen += green;
            motoring.rightEyeGreen += green;
        }
        if (blue !== undefined) {
            motoring.leftEyeBlue += blue;
            motoring.rightEyeBlue += blue;
        }
    }
    this.__clampEyes();
};

PioRobot.prototype.__SOUNDS = {
    BEEP: 1,
    RANDOM_BEEP: 2,
    NOISE: 10,
    SIREN: 3,
    ENGINE: 4,
    CHOP: 11,
    ROBOT: 5,
    DIBIDIBIDIP: 8,
    GOOD_JOB: 9,
    RANDOM_MELODY: 18,
    POO: 20,
    HAPPY: 12,
    ANGRY: 13,
    SAD: 14,
    SLEEP: 15,
    MARCH: 6,
    BIRTHDAY: 7,
    BATH: 21,
};

PioRobot.prototype.__playSound = function(soundField, count) {
    const motoring = this.motoring;
    this.__cancelNote();
    this.__cancelSound();

    const sound = this.__SOUNDS[soundField];
    count = parseInt(count);
    motoring.buzzer = 0;
    this.__setNote(0);
    if (sound && count) {
        this.__runSound(sound, count);
    } else {
        this.__runSound(0);
    }
    this.__checkSoundPlaying();
};

PioRobot.prototype.__NOTES = {
    C: 4,
    CS: 5,
    D: 6,
    DS: 7,
    E: 8,
    F: 9,
    FS: 10,
    G: 11,
    GS: 12,
    A: 13,
    AS: 14,
    B: 15,
};

PioRobot.prototype.__BATTERY_STATES = {
    NORMAL: 3,
    MIDDLE: 2,
    LOW: 1,
    EMPTY: 0,
};

// -------------------- block methods (motion) --------------------

PioRobot.prototype.boardMove = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isMoving = true;
        const direction = script.getField('DIRECTION');
        const callback = () => {
            script.isMoving = false;
        };
        if (direction == 'FORWARD') {
            this.__board(1, 1, 1, 10, callback);
        } else if (direction == 'BACKWARD') {
            this.__board(2, 1, 2, 10, callback);
        } else if (direction == 'LEFT') {
            this.__board(3, 1, 2, 1.45, callback);
        } else {
            this.__board(4, 1, 2, 1.45, callback);
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

PioRobot.prototype.boardTurn = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isMoving = true;
        const direction = script.getField('DIRECTION');
        const callback = () => {
            script.isMoving = false;
        };
        if (direction == 'LEFT') {
            this.__board(5, 1, 2, 1.45, callback);
        } else {
            this.__board(6, 1, 2, 1.45, callback);
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

PioRobot.prototype.moveForward = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isMoving = true;
        this.__motion(101, () => {
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

PioRobot.prototype.moveBackward = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isMoving = true;
        this.__motion(102, () => {
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

PioRobot.prototype.turn = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isMoving = true;
        const direction = script.getField('DIRECTION');
        const callback = () => {
            script.isMoving = false;
        };
        if (direction == 'LEFT') {
            this.__motion(103, callback);
        } else {
            this.__motion(104, callback);
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

PioRobot.prototype.moveForwardUnit = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isMoving = true;
        const value = script.getNumberValue('VALUE');
        const unit = this.__UNITS[script.getField('UNIT')];
        const callback = () => {
            script.isMoving = false;
        };
        if (value < 0) {
            this.__motionUnit(2, unit, -value, callback);
        } else {
            this.__motionUnit(1, unit, value, callback);
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

PioRobot.prototype.moveBackwardUnit = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isMoving = true;
        const value = script.getNumberValue('VALUE');
        const unit = this.__UNITS[script.getField('UNIT')];
        const callback = () => {
            script.isMoving = false;
        };
        if (value < 0) {
            this.__motionUnit(1, unit, -value, callback);
        } else {
            this.__motionUnit(2, unit, value, callback);
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

PioRobot.prototype.turnUnit = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isMoving = true;
        const direction = script.getField('DIRECTION');
        const value = script.getNumberValue('VALUE');
        const unit = this.__UNITS[script.getField('UNIT')];
        const callback = () => {
            script.isMoving = false;
        };
        if (direction == 'LEFT') {
            if (value < 0) {
                this.__motionUnit(4, unit, -value, callback);
            } else {
                this.__motionUnit(3, unit, value, callback);
            }
        } else {
            if (value < 0) {
                this.__motionUnit(3, unit, -value, callback);
            } else {
                this.__motionUnit(4, unit, value, callback);
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

PioRobot.prototype.pivotUnit = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isMoving = true;
        const wheel = script.getField('WHEEL');
        const value = script.getNumberValue('VALUE');
        const unit = this.__UNITS[script.getField('UNIT')];
        const toward = script.getField('TOWARD');
        const callback = () => {
            script.isMoving = false;
        };
        if (wheel == 'LEFT') {
            if (toward == 'FORWARD') {
                if (value < 0) this.__motionUnit(6, unit, -value, callback);
                else this.__motionUnit(5, unit, value, callback);
            } else {
                if (value < 0) this.__motionUnit(5, unit, -value, callback);
                else this.__motionUnit(6, unit, value, callback);
            }
        } else {
            if (toward == 'FORWARD') {
                if (value < 0) this.__motionUnit(8, unit, -value, callback);
                else this.__motionUnit(7, unit, value, callback);
            } else {
                if (value < 0) this.__motionUnit(7, unit, -value, callback);
                else this.__motionUnit(8, unit, value, callback);
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

PioRobot.prototype.changeWheels = function(script) {
    this.__setModule();
    const motoring = this.motoring;
    this.__cancelBoard();
    this.__cancelMotion();

    const leftVelocity = this.__finite(script.getNumberValue('LEFT'));
    const rightVelocity = this.__finite(script.getNumberValue('RIGHT'));
    if (leftVelocity !== undefined) motoring.leftWheel += leftVelocity;
    if (rightVelocity !== undefined) motoring.rightWheel += rightVelocity;
    this.__setPulse(0);
    this.__setMotion(0, 0, 0, 0, 0);
    this.__clampWheels();
    this.__checkWheelMoving();
    return script.callReturn();
};

PioRobot.prototype.setWheels = function(script) {
    this.__setModule();
    const motoring = this.motoring;
    this.__cancelBoard();
    this.__cancelMotion();

    const leftVelocity = this.__finite(script.getNumberValue('LEFT'));
    const rightVelocity = this.__finite(script.getNumberValue('RIGHT'));
    if (leftVelocity !== undefined) motoring.leftWheel = leftVelocity;
    if (rightVelocity !== undefined) motoring.rightWheel = rightVelocity;
    this.__setPulse(0);
    this.__setMotion(0, 0, 0, 0, 0);
    this.__clampWheels();
    this.__checkWheelMoving();
    return script.callReturn();
};

PioRobot.prototype.changeWheel = function(script) {
    this.__setModule();
    const motoring = this.motoring;
    this.__cancelBoard();
    this.__cancelMotion();

    const wheel = script.getField('WHEEL');
    const velocity = this.__finite(script.getNumberValue('VALUE'));
    if (velocity !== undefined) {
        if (wheel == 'LEFT') {
            motoring.leftWheel += velocity;
        } else if (wheel == 'RIGHT') {
            motoring.rightWheel += velocity;
        } else {
            motoring.leftWheel += velocity;
            motoring.rightWheel += velocity;
        }
    }
    this.__setPulse(0);
    this.__setMotion(0, 0, 0, 0, 0);
    this.__clampWheels();
    this.__checkWheelMoving();
    return script.callReturn();
};

PioRobot.prototype.setWheel = function(script) {
    this.__setModule();
    const motoring = this.motoring;
    this.__cancelBoard();
    this.__cancelMotion();

    const wheel = script.getField('WHEEL');
    const velocity = this.__finite(script.getNumberValue('VALUE'));
    if (velocity !== undefined) {
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
    this.__clampWheels();
    this.__checkWheelMoving();
    return script.callReturn();
};

PioRobot.prototype.stop = function(script) {
    this.__setModule();
    const motoring = this.motoring;
    this.__cancelBoard();
    this.__cancelMotion();

    motoring.leftWheel = 0;
    motoring.rightWheel = 0;
    this.__setPulse(0);
    this.__setMotion(0, 0, 0, 0, 0);
    this.__checkWheelMoving();
    return script.callReturn();
};

PioRobot.prototype.setTurboMode = function(script) {
    this.__setModule();
    const mode = script.getField('MODE');
    if (mode == 'ON') this.__setTurbo(1);
    else this.__setTurbo(0);
    return script.callReturn();
};

PioRobot.prototype.isWheelMoving = function(script) {
    return this.wheelMoving || this.motioning || this.boarding;
};

PioRobot.prototype.setNeckSpeed = function(script) {
    this.__setModule();
    const speed = parseInt(script.getField('SPEED'));
    this.__setNeckSpeed(speed);
    return script.callReturn();
};

PioRobot.prototype.rotateNeck = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isMoving = true;
        const direction = script.getField('DIRECTION');
        let deg = this.__finite(script.getNumberValue('VALUE'));
        this.__cancelNeckMotion();
        if (deg !== undefined) {
            if (direction == 'LEFT') deg *= -1;
            this.__setNeckAngle(deg);
            this.neckStateId = this.sensory.neckStateId; // 완료 기준선 캡처(재실행 desync 방지, __board 주석 참고)
            this.neckMotionCallback = () => {
                script.isMoving = false;
            };
        } else {
            script.isMoving = false;
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

PioRobot.prototype.stopNeck = function(script) {
    this.__setModule();
    this.__cancelNeckMotion();
    this.__setNeckAngle(0);
    return script.callReturn();
};

PioRobot.prototype.isNeckMoving = function(script) {
    return this.neckMotioning;
};

// -------------------- block methods (looks / eye) --------------------

PioRobot.prototype.setEyeColor = function(script) {
    this.__setModule();
    const eye = script.getField('EYE');
    const rgb = this.__RGBS[script.getField('COLOR')];
    if (rgb) {
        this.__setRgb(eye, rgb[0], rgb[1], rgb[2]);
    }
    return script.callReturn();
};

PioRobot.prototype.setEyeColorPicker = function(script) {
    this.__setModule();
    const eye = script.getField('EYE');
    const color = script.getField('COLOR');
    const red = parseInt(color.slice(1, 3), 16);
    const green = parseInt(color.slice(3, 5), 16);
    const blue = parseInt(color.slice(5, 7), 16);
    this.__setRgb(eye, red, green, blue);
    return script.callReturn();
};

PioRobot.prototype.changeEyeRgb = function(script) {
    this.__setModule();
    const eye = script.getField('EYE');
    const red = script.getNumberValue('RED');
    const green = script.getNumberValue('GREEN');
    const blue = script.getNumberValue('BLUE');
    this.__changeRgb(eye, red, green, blue);
    return script.callReturn();
};

PioRobot.prototype.setEyeRgb = function(script) {
    this.__setModule();
    const eye = script.getField('EYE');
    const red = script.getNumberValue('RED');
    const green = script.getNumberValue('GREEN');
    const blue = script.getNumberValue('BLUE');
    this.__setRgb(eye, red, green, blue);
    return script.callReturn();
};

PioRobot.prototype.clearEye = function(script) {
    this.__setModule();
    const eye = script.getField('EYE');
    this.__setRgb(eye, 0, 0, 0);
    return script.callReturn();
};

// -------------------- block methods (sound) --------------------

PioRobot.prototype.playSound = function(script) {
    this.__setModule();
    this.__playSound(script.getField('SOUND'), 1);
    return script.callReturn();
};

PioRobot.prototype.playSoundTimes = function(script) {
    this.__setModule();
    this.__playSound(script.getField('SOUND'), script.getNumberValue('REPEAT'));
    return script.callReturn();
};

PioRobot.prototype.playSoundUntil = function(script) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isMoving = true;
        const motoring = this.motoring;
        this.__cancelNote();
        this.__cancelSound();
        const sound = this.__SOUNDS[script.getField('SOUND')];
        let count = parseInt(script.getNumberValue('REPEAT'));
        // 음수는 __runSound 의 "끝없이 반복" 센티널이라 완료 분기가 콜백 대신 재무장한다.
        // 기다리는 블록이므로 영영 끝나지 않는다. 0 은 이미 0 과 -0.5 가 그러하듯 재생하지
        // 않고 정상 종료하는 값이다. 기다리지 않는 playSoundTimes 는 정지하지 않으므로
        // 공용 __playSound 는 건드리지 않는다.
        if (count < 0) count = 0;
        motoring.buzzer = 0;
        this.__setNote(0);
        if (sound && count) {
            this.__runSound(sound, count);
            // soundStateId 완료 분기는 콜백에 게이트되지 않아 idle 패킷마다 재동기화되므로
            // 보통은 어긋나지 않지만, stop 직후 패킷 없이 곧바로 재실행 첫 블록으로 들어오는
            // 극단 케이스를 닫기 위해 wheel/neck와 동일하게 시작 시점 기준선을 캡처한다.
            this.soundStateId = this.sensory.soundStateId;
            this.soundCallback = () => {
                script.isMoving = false;
            };
            this.__checkSoundPlaying();
        } else {
            this.__runSound(0);
            this.__checkSoundPlaying();
            script.isMoving = false;
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

PioRobot.prototype.changeBuzzer = function(script) {
    this.__setModule();
    const motoring = this.motoring;
    this.__cancelNote();
    this.__cancelSound();

    const hz = this.__finite(script.getNumberValue('HZ'));
    if (hz !== undefined) {
        const L = this.__LIMITS.buzzer;
        motoring.buzzer += hz;
        // __checkSoundPlaying 이 buzzer != 0 으로 재생 여부를 판단하므로 그 앞에서 제한한다.
        motoring.buzzer = this.__clamp('buzzer', motoring.buzzer, L.min, L.max, L.unit);
    }
    this.__setNote(0);
    this.__runSound(0);
    this.__checkSoundPlaying();
    return script.callReturn();
};

PioRobot.prototype.setBuzzer = function(script) {
    this.__setModule();
    const motoring = this.motoring;
    this.__cancelNote();
    this.__cancelSound();

    const hz = this.__finite(script.getNumberValue('HZ'));
    if (hz !== undefined) {
        const L = this.__LIMITS.buzzer;
        motoring.buzzer = hz;
        // __checkSoundPlaying 이 buzzer != 0 으로 재생 여부를 판단하므로 그 앞에서 제한한다.
        motoring.buzzer = this.__clamp('buzzer', motoring.buzzer, L.min, L.max, L.unit);
    }
    this.__setNote(0);
    this.__runSound(0);
    this.__checkSoundPlaying();
    return script.callReturn();
};

PioRobot.prototype.clearSound = function(script) {
    this.__setModule();
    this.__cancelNote();
    this.__cancelSound();
    this.motoring.buzzer = 0;
    this.__setNote(0);
    this.__runSound(0);
    this.__checkSoundPlaying();
    return script.callReturn();
};

PioRobot.prototype.playNote = function(script) {
    this.__setModule();
    const motoring = this.motoring;
    this.__cancelNote();
    this.__cancelSound();

    let note = this.__NOTES[script.getField('NOTE')];
    const octave = parseInt(script.getField('OCTAVE'));
    motoring.buzzer = 0;
    if (note && octave && octave > 0 && octave < 8) {
        note += (octave - 1) * 12;
        this.__setNote(note);
    } else {
        this.__setNote(0);
    }
    this.__runSound(0);
    this.__checkSoundPlaying();
    return script.callReturn();
};

PioRobot.prototype.playNoteBeat = function(script) {
    this.__setModule();
    const self = this;
    if (!script.isStart) {
        script.isStart = true;
        script.isMoving = true;
        const motoring = self.motoring;
        self.__cancelNote();
        self.__cancelSound();

        let note = self.__NOTES[script.getField('NOTE')];
        const octave = parseInt(script.getField('OCTAVE'));
        const beat = parseFloat(script.getNumberValue('BEAT'));
        const callback = () => {
            script.isMoving = false;
        };
        motoring.buzzer = 0;
        if (note && octave && octave > 0 && octave < 8 && beat && beat > 0 && self.tempo > 0) {
            const id = self.__issueNoteId();
            note += (octave - 1) * 12;
            self.__setNote(note);
            const timeout = self.__clampDelay((beat * 60 * 1000) / self.tempo);
            const tail = timeout > 100 ? 100 : 0;
            if (tail > 0) {
                self.noteTimer1 = setTimeout(() => {
                    if (self.noteId == id) {
                        self.__setNote(0);
                        if (self.noteTimer1 !== undefined) self.__removeTimeout(self.noteTimer1);
                        self.noteTimer1 = undefined;
                    }
                }, timeout - tail);
                self.timeouts.push(self.noteTimer1);
            }
            self.noteTimer2 = setTimeout(() => {
                if (self.noteId == id) {
                    self.__setNote(0);
                    self.__cancelNote();
                    self.__checkSoundPlaying();
                    callback();
                }
            }, timeout);
            self.timeouts.push(self.noteTimer2);
            self.__runSound(0);
            self.__checkSoundPlaying();
        } else {
            self.__setNote(0);
            self.__runSound(0);
            self.__checkSoundPlaying();
            callback();
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

PioRobot.prototype.restBeat = function(script) {
    this.__setModule();
    const self = this;
    if (!script.isStart) {
        script.isStart = true;
        script.isMoving = true;
        const motoring = self.motoring;
        self.__cancelNote();
        self.__cancelSound();

        const beat = parseFloat(script.getNumberValue('BEAT'));
        const callback = () => {
            script.isMoving = false;
        };
        motoring.buzzer = 0;
        self.__setNote(0);
        self.__runSound(0);
        if (beat && beat > 0 && self.tempo > 0) {
            const id = self.__issueNoteId();
            self.noteTimer1 = setTimeout(() => {
                if (self.noteId == id) {
                    self.__cancelNote();
                    self.__checkSoundPlaying();
                    callback();
                }
            }, self.__clampDelay((beat * 60 * 1000) / self.tempo));
            self.timeouts.push(self.noteTimer1);
            self.__checkSoundPlaying();
            self.resting = true;
        } else {
            self.__checkSoundPlaying();
            callback();
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

PioRobot.prototype.changeTempo = function(script) {
    this.__setModule();
    const bpm = parseFloat(script.getNumberValue('BPM'));
    if (typeof bpm == 'number') {
        this.tempo += bpm;
        if (this.tempo < 1) this.tempo = 1;
    }
    return script.callReturn();
};

PioRobot.prototype.setTempo = function(script) {
    this.__setModule();
    const bpm = parseFloat(script.getNumberValue('BPM'));
    if (typeof bpm == 'number') {
        this.tempo = bpm;
        if (this.tempo < 1) this.tempo = 1;
    }
    return script.callReturn();
};

PioRobot.prototype.isSoundPlaying = function(script) {
    return this.sounding || this.buzzing || this.noting || this.resting;
};

// -------------------- block methods (sensing) --------------------

PioRobot.prototype.getButton = function(script) {
    const index = this.__BUTTON_INDEX[script.getField('BUTTON')];
    if (typeof index == 'number') {
        return this.buttons[index];
    }
    return 0;
};

PioRobot.prototype.getSignalStrength = function(script) {
    return this.sensory.signalStrength;
};

PioRobot.prototype.checkButtonState = function(script) {
    const index = this.__BUTTON_INDEX[script.getField('BUTTON')];
    const state = script.getField('STATE');
    if (typeof index == 'number') {
        switch (state) {
            case 'PRESSED':
                return this.buttonCheckers[index].isPressed();
            case 'RELEASED':
                return this.buttonCheckers[index].isReleased();
            case 'LONG_PRESSED':
                return this.buttonCheckers[index].isLongPressed();
            case 'CLICKED':
                return this.buttonCheckers[index].isClicked();
        }
    }
    return false;
};

PioRobot.prototype.isButtonState = function(script) {
    const index = this.__BUTTON_INDEX[script.getField('BUTTON')];
    const state = script.getField('STATE');
    if (typeof index == 'number') {
        switch (state) {
            case 'PRESSED':
                return this.buttons[index] == 1;
            case 'RELEASED':
                return this.buttons[index] == 0;
            case 'LONG_PRESSED':
                return this.buttonCheckers[index].isLongPressed();
            case 'CLICKED':
                return this.buttonCheckers[index].isClicked();
        }
    }
    return false;
};

PioRobot.prototype.checkBatteryState = function(script) {
    return this.sensory.batteryState == this.__BATTERY_STATES[script.getField('BATTERY')];
};

PioRobot.prototype.isCharging = function(script) {
    return this.sensory.chargeState == 1;
};

PioRobot.prototype.hasButtonEvent = function() {
    for (let i = 0; i < 8; ++i) {
        const checker = this.buttonCheckers[i];
        if (
            checker.isPressed() ||
            checker.isReleased() ||
            checker.isClicked() ||
            checker.isLongPressed()
        ) {
            return true;
        }
    }
    return false;
};

/**RaccoonRobot**/
function RaccoonRobot(index) {
    this.sensory = {
        signalStrength: 0,
        encoder1: 0,
        encoder2: 0,
        encoder3: 0,
        encoder4: 0,
        teachButton: 0,
        playButton: 0,
        deleteButton: 0,
        teachClickedId: 0,
        playClickedId: 0,
        deleteClickedId: 0,
        teachLongPressedId: 0,
        playLongPressedId: 0,
        deleteLongPressedId: 0,
        warning: 0,
        moving: 0,
        collision1Id: 0,
        collision2Id: 0,
        collision3Id: 0,
        collision4Id: 0,
        jointStateId: 0,
        soundStateId: 0,
        batteryState: 2,
        chargeState: 0,
        slotR1Id: 0,
        slotR1: [0, 0, 0, 0, 0, 0, 0, 0],
        slotR2Id: 0,
        slotR2: [0, 0, 0, 0, 0, 0, 0, 0],
        slotR3Id: 0,
        slotR3: [0, 0, 0, 0, 0, 0, 0, 0],
    };
    this.motoring = {
        group: 'raccoon',
        module: 'raccoon',
        index,
    };
    // 각도 명령은 프로토콜상 네 관절 값을 모두 싣는데, motoring.jointAngleN은 장치에서 읽은 값이
    // 아니라 "마지막으로 명령한 값"이다. 속도 블록이나 전원 끄기로 움직인 관절은 그 값이 실제와
    // 어긋나므로 다음 각도 명령 때 실측값(sensory.encoderN)으로 다시 채워야 한다. 관절별로 표시해
    // 두고, 지정하지 않은 관절의 진행 중 목표를 덮어쓰지 않는다.
    // 연결 직후에는 버퍼가 기본 자세를 주장하는데 팔은 이전 세션 자세에 있으므로 전부 true로 시작한다.
    this.jointAngleStale = [true, true, true, true];
    // 보낼 수 없는 자세라 명령을 건너뛴 것을 실행당 1회만 알린다.
    this.unreachablePoseWarned = false;
    this.delayWarned = false;
    this.jointVelocity1 = 0;
    this.jointVelocity2 = 0;
    this.jointVelocity3 = 0;
    this.jointVelocity4 = 0;
    this.teachClickedId = -1;
    this.playClickedId = -1;
    this.deleteClickedId = -1;
    this.teachLongPressedId = -1;
    this.playLongPressedId = -1;
    this.deleteLongPressedId = -1;
    this.collision1Id = -1;
    this.collision2Id = -1;
    this.collision3Id = -1;
    this.collision4Id = -1;
    this.jointStateId = -1;
    this.soundStateId = -1;
    this.slotR1Id = -1;
    this.slotR2Id = -1;
    this.slotR3Id = -1;
    this.blockId = 0;
    this.angleCallback = undefined;
    this.resetting = false;
    this.resetTimer = undefined;
    this.currentSound = 0;
    this.soundRepeat = 1;
    this.soundCallback = undefined;
    this.soundTimeoutTimer = undefined;
    this.sounding = false;
    this.noteId = 0;
    this.noteTimer1 = undefined;
    this.noteTimer2 = undefined;
    this.noting = false;
    this.resting = false;
    this.ioId = 0;
    this.ioTimer = undefined;
    this.teachButton = 0;
    this.playButton = 0;
    this.deleteButton = 0;
    this.teachPressed = false;
    this.playPressed = false;
    this.deletePressed = false;
    this.teachReleased = false;
    this.playReleased = false;
    this.deleteReleased = false;
    this.teachClicked = false;
    this.playClicked = false;
    this.deleteClicked = false;
    this.teachLongPressed = false;
    this.playLongPressed = false;
    this.deleteLongPressed = false;
    this.collided1 = false;
    this.collided2 = false;
    this.collided3 = false;
    this.collided4 = false;
    this.jointMode = this.JOINT_MODE_VELOCITY;
    this.precisionMode = 0;
    this.tempo = 60;
    this.posRef = { x: 0, y: 0, z: 0 };
    this.posRefAbs = { x: 0, y: 0, z: 0 };
    this.posRefRel = { x: 0, y: 0, z: 0 };
    this.posRefDev = this.REF_GRIPPER;
    this.pos = { x: 0, y: 0, z: 0 };
    this.joints = [0, 0, 0, 0];
    this.gripper = { type: -1, state: -1 };
    this.extType = 0;
    // 컨베이어 주변장치. 라쿤 SLOT1 채널을 사용한다.
    // 바이트 계층(slotW1/slotR1)은 entry-hw raccoon.js에 있다.
    this.conveyor = {
        motoring: { mode: 0, velocity: 0, distanceId: 0, distance: 0 },
        sensory: {
            mode: 0,
            velocity: 0,
            distance: 0,
            button: 0,
            clickedId: 0,
            longPressedId: 0,
            stateId: 0,
            moving: 0,
        },
        clickedId: -1,
        longPressedId: -1,
        stateId: -1,
        distanceCallback: undefined,
        movingId: 0,
        movingTimer: undefined,
        moving: false,
        button: 0,
        pressed: false,
        released: false,
        clicked: false,
        longPressed: false,
    };
    this.timeouts = [];
}

RaccoonRobot.prototype.__TO_RADIAN = Math.PI / 180.0;
RaccoonRobot.prototype.__TO_DEGREE = 180.0 / Math.PI;
RaccoonRobot.prototype.__L1 = 8.25;
RaccoonRobot.prototype.__L2 = 10;
RaccoonRobot.prototype.__L3 = 10;
RaccoonRobot.prototype.JOINT_MODE_VELOCITY = 0;
RaccoonRobot.prototype.JOINT_MODE_ANGLE = 1;
RaccoonRobot.prototype.JOINT_MODE_VELOCITY_HORZ = 2;
RaccoonRobot.prototype.JOINT_MODE_VELOCITY_VERT = 3;
RaccoonRobot.prototype.JOINT_MODE_ANGLE_HORZ = 4;
RaccoonRobot.prototype.JOINT_MODE_ANGLE_VERT = 5;
RaccoonRobot.prototype.REF_NONE = 0;
RaccoonRobot.prototype.REF_WRIST = 1;
RaccoonRobot.prototype.REF_GRIPPER = 2;
RaccoonRobot.prototype.__INCH_TO_CM = 2.54;
RaccoonRobot.prototype.__MM_TO_CM = 0.1;
RaccoonRobot.prototype.__RESET_TIMEOUT_MS = 3000;
RaccoonRobot.prototype.__SOUND_TIMEOUT_MS = 10000;

RaccoonRobot.prototype.__PORT_MAP = {
    group: 'raccoon',
    module: 'raccoon',
    jointVelocity1: 0,
    jointVelocity2: 0,
    jointVelocity3: 0,
    jointVelocity4: 0,
    jointSpeed: 100,
    jointAngleId: 0,
    jointAngle1: 0,
    jointAngle2: -10,
    jointAngle3: -140,
    jointAngle4: 60,
    jointModeId: 0,
    jointMode: 0,
    noteId: 0,
    note: 0,
    soundId: 0,
    sound: 0,
    slotW1Id: 0,
    slotW1: [0x10, 0, 0, 0, 0, 0, 0, 0],
    slotW2Id: 0,
    slotW2: [0x20, 0, 0, 0, 0, 0, 0, 0],
    slotW3Id: 0,
    slotW3: [0x30, 0, 0, 0, 0, 0, 0, 0],
};

// (x % 255) + 1 로 증가하는 명령 id 카운터. setZero에서 0으로 재시드하지 않고 보존한다
// (entry-hw 모듈의 _prev_*Id와의 충돌 방지. setZero 주석 참고).
RaccoonRobot.prototype.__ID_PORTS = [
    'jointAngleId',
    'jointModeId',
    'noteId',
    'soundId',
    'slotW1Id',
    'slotW2Id',
    'slotW3Id',
];

RaccoonRobot.prototype.__seedPort = function(motoring, port) {
    const def = this.__PORT_MAP[port];
    // sendQueue 객체는 공유/직렬화되므로 배열은 새 복사본이어야 한다.
    motoring[port] = Array.isArray(def) ? def.slice() : def;
};

RaccoonRobot.prototype.setZero = function() {
    this.unreachablePoseWarned = false; // 실행마다 안내를 다시 낼 수 있게
    this.delayWarned = false;
    // 프로그램 정지 시 reset(): 속도/사운드를 0으로, 그리퍼를 열고, 기본 자세를
    // 명령한다(resetting=true). 정지 시 팔이 원위치로 돌아가는 것이 장치 동작이다.
    // 엔진 정지 후에도 afterReceive는 계속 동작하므로(hw.ts가 'data'를 별도 바인딩)
    // 완료 신호를 받을 수 있고, 아래 3초 타임아웃이 신호가 안 오는 경우를 처리한다.
    //
    // *Id 카운터는 세션 내 단조 증가로 보존한다(0 재시드 금지). entry-hw 모듈의 _prev_*Id는
    // 워크스페이스 소켓이 살아있는 한 유지되는데, 카운터를 0으로 되돌리면 다음 실행이 만드는
    // id가 이전 실행과 같은 값에 도달해 명령이 통째로 삼켜진다(정지 후 재실행 무반응).
    // 옛 재시드가 겸하던 부수효과(soundId=0 전송=소리 정지, slotW3Id=0 전송=W3 중립 재전송)는
    // 아래에서 명시적 id 증가 명령으로 재현한다.
    const portMap = this.__PORT_MAP;
    const motoring = this.motoring;
    const idPorts = this.__ID_PORTS;
    for (const port in portMap) {
        if (idPorts.indexOf(port) >= 0 && motoring[port] !== undefined) {
            continue; // 카운터 보존 (undefined면 아래 시드로 0 초기화)
        }
        this.__seedPort(motoring, port);
    }
    this.__setNote(0); // 음 정지 (noteId 증가 포함)
    this.__setSound(0); // 소리 정지 (soundId 증가 포함)
    this.__issueSlotW3(); // W3 중립 payload 재전송
    this.jointVelocity1 = 0;
    this.jointVelocity2 = 0;
    this.jointVelocity3 = 0;
    this.jointVelocity4 = 0;
    this.teachClickedId = -1;
    this.playClickedId = -1;
    this.deleteClickedId = -1;
    this.teachLongPressedId = -1;
    this.playLongPressedId = -1;
    this.deleteLongPressedId = -1;
    this.collision1Id = -1;
    this.collision2Id = -1;
    this.collision3Id = -1;
    this.collision4Id = -1;
    this.soundStateId = -1;
    this.blockId = 0;
    this.angleCallback = undefined;
    this.currentSound = 0;
    this.soundRepeat = 1;
    this.soundCallback = undefined;
    this.sounding = false;
    this.noteId = 0;
    this.noteTimer1 = undefined;
    this.noteTimer2 = undefined;
    this.soundTimeoutTimer = undefined;
    this.noting = false;
    this.resting = false;
    this.ioId = 0;
    this.ioTimer = undefined;
    this.resetTimer = undefined;
    this.teachButton = 0;
    this.playButton = 0;
    this.deleteButton = 0;
    this.clearEvent();
    this.jointMode = this.JOINT_MODE_VELOCITY;
    this.precisionMode = 0;
    this.tempo = 60;
    const posRefAbs = this.posRefAbs;
    posRefAbs.x = 0;
    posRefAbs.y = 0;
    posRefAbs.z = 0;
    const posRefRel = this.posRefRel;
    posRefRel.x = 0;
    posRefRel.y = 0;
    posRefRel.z = 0;
    this.posRefDev = this.REF_GRIPPER;
    const pos = this.pos;
    pos.x = 0;
    pos.y = 0;
    pos.z = 0;
    const gripper = this.gripper;
    gripper.type = -1;
    gripper.state = -1;
    this.extType = 0;
    this.__removeAllTimeouts();
    this.__resetGripper();
    this.__resetConveyor();
    this.__resetPose();
};

RaccoonRobot.prototype.afterReceive = function(pd) {
    this.sensory = pd;
    this.handleSensory();
};

RaccoonRobot.prototype.afterSend = function(sq) {};

RaccoonRobot.prototype.setMotoring = function(motoring) {
    this.motoring = motoring;
    // getRobot()은 블록 실행마다 this.motoring을 공유 Entry.hw.sendQueue로 바꾼다.
    // 빠진 필드를 채운다(배열 포함. undefined slotW는 entry-hw 인코더를 망가뜨린다).
    // 그래야 (xId % 255) + 1이 undefined를 읽지 않는다.
    const portMap = this.__PORT_MAP;
    for (const port in portMap) {
        if (motoring[port] === undefined) {
            this.__seedPort(motoring, port);
        }
    }
};

RaccoonRobot.prototype.__setModule = function() {
    this.motoring.group = 'raccoon';
    this.motoring.module = 'raccoon';
};

RaccoonRobot.prototype.clearEvent = function() {
    this.teachPressed = false;
    this.playPressed = false;
    this.deletePressed = false;
    this.teachReleased = false;
    this.playReleased = false;
    this.deleteReleased = false;
    this.teachClicked = false;
    this.playClicked = false;
    this.deleteClicked = false;
    this.teachLongPressed = false;
    this.playLongPressed = false;
    this.deleteLongPressed = false;
    this.collided1 = false;
    this.collided2 = false;
    this.collided3 = false;
    this.collided4 = false;
    const conveyor = this.conveyor;
    conveyor.pressed = false;
    conveyor.released = false;
    conveyor.clicked = false;
    conveyor.longPressed = false;
};

RaccoonRobot.prototype.__removeTimeout = function(id) {
    clearTimeout(id);
    const idx = this.timeouts.indexOf(id);
    if (idx >= 0) {
        this.timeouts.splice(idx, 1);
    }
};

RaccoonRobot.prototype.__removeAllTimeouts = function() {
    const timeouts = this.timeouts;
    for (const i in timeouts) {
        clearTimeout(timeouts[i]);
    }
    this.timeouts = [];
};

// ---------------- joint mode / velocity / angle internals ----------------

RaccoonRobot.prototype.__checkJointMode = function(mode) {
    if (mode == this.JOINT_MODE_VELOCITY) {
        if (
            this.jointMode == this.JOINT_MODE_VELOCITY_HORZ ||
            this.jointMode == this.JOINT_MODE_ANGLE_HORZ
        ) {
            this.jointMode = this.JOINT_MODE_VELOCITY_HORZ;
        } else if (
            this.jointMode == this.JOINT_MODE_VELOCITY_VERT ||
            this.jointMode == this.JOINT_MODE_ANGLE_VERT
        ) {
            this.jointMode = this.JOINT_MODE_VELOCITY_VERT;
        } else {
            this.jointMode = this.JOINT_MODE_VELOCITY;
        }
    } else if (mode == this.JOINT_MODE_ANGLE) {
        if (
            this.jointMode == this.JOINT_MODE_ANGLE_HORZ ||
            this.jointMode == this.JOINT_MODE_VELOCITY_HORZ
        ) {
            this.jointMode = this.JOINT_MODE_ANGLE_HORZ;
        } else if (
            this.jointMode == this.JOINT_MODE_ANGLE_VERT ||
            this.jointMode == this.JOINT_MODE_VELOCITY_VERT
        ) {
            this.jointMode = this.JOINT_MODE_ANGLE_VERT;
        } else {
            this.jointMode = this.JOINT_MODE_ANGLE;
        }
    }
    return this.jointMode;
};

RaccoonRobot.prototype.__setJointVelocity = function(joint, vel) {
    // 전체 관절 기본 분기는 명시적 ALL(-1) 센티널 전용이다. 알 수 없는 드롭다운
    // 값(손상된 프로젝트나 OPT_JOINT 불일치)이 네 관절을 모두 움직여선 안 된다.
    if (joint === undefined) return;
    let motoringVel;
    if (vel == 127) {
        motoringVel = 127;
        vel = 0;
    } else {
        if (vel < -100) vel = -100;
        else if (vel > 100) vel = 100;
        motoringVel = vel;
    }
    const motoring = this.motoring;
    switch (joint) {
        case 1:
            motoring.jointVelocity1 = motoringVel;
            this.jointVelocity1 = vel;
            break;
        case 2:
            motoring.jointVelocity2 = motoringVel;
            this.jointVelocity2 = vel;
            break;
        case 3:
            motoring.jointVelocity3 = motoringVel;
            this.jointVelocity3 = vel;
            break;
        case 4:
            motoring.jointVelocity4 = motoringVel;
            this.jointVelocity4 = vel;
            break;
        default:
            motoring.jointVelocity1 = motoringVel;
            motoring.jointVelocity2 = motoringVel;
            motoring.jointVelocity3 = motoringVel;
            motoring.jointVelocity4 = motoringVel;
            this.jointVelocity1 = vel;
            this.jointVelocity2 = vel;
            this.jointVelocity3 = vel;
            this.jointVelocity4 = vel;
            break;
    }
};

RaccoonRobot.prototype.__setFourJointVelocities = function(vel1, vel2, vel3, vel4) {
    if (vel1 < -100) vel1 = -100;
    else if (vel1 > 100) vel1 = 100;
    if (vel2 < -100) vel2 = -100;
    else if (vel2 > 100) vel2 = 100;
    if (vel3 < -100) vel3 = -100;
    else if (vel3 > 100) vel3 = 100;
    if (vel4 < -100) vel4 = -100;
    else if (vel4 > 100) vel4 = 100;
    const motoring = this.motoring;
    motoring.jointVelocity1 = vel1;
    motoring.jointVelocity2 = vel2;
    motoring.jointVelocity3 = vel3;
    motoring.jointVelocity4 = vel4;
    this.jointVelocity1 = vel1;
    this.jointVelocity2 = vel2;
    this.jointVelocity3 = vel3;
    this.jointVelocity4 = vel4;
};

RaccoonRobot.prototype.__changeJointVelocity = function(joint, vel) {
    if (joint === undefined) return; // __setJointVelocity 참고
    if (joint >= 1 && joint <= 4) {
        const cache = ['jointVelocity1', 'jointVelocity2', 'jointVelocity3', 'jointVelocity4'][
            joint - 1
        ];
        vel += this[cache];
        if (vel < -100) vel = -100;
        else if (vel > 100) vel = 100;
        this.motoring[cache] = vel;
        this[cache] = vel;
    } else {
        this.__changeFourJointVelocities(vel, vel, vel, vel);
    }
};

RaccoonRobot.prototype.__changeFourJointVelocities = function(vel1, vel2, vel3, vel4) {
    this.__setFourJointVelocities(
        vel1 + this.jointVelocity1,
        vel2 + this.jointVelocity2,
        vel3 + this.jointVelocity3,
        vel4 + this.jointVelocity4
    );
};

RaccoonRobot.prototype.__canSetJointAngle = function(joint, deg) {
    switch (joint) {
        case 1:
            if (deg < -120 || deg > 120) return false;
            break;
        case 2:
            if (deg < -90 || deg > 30) return false;
            break;
        case 3:
            if (deg < -150 || deg > 0) return false;
            break;
        case 4:
            if (deg < -105 || deg > 105) return false;
            break;
        default:
            return this.__canSetFourJointAngles(deg, deg, deg, deg);
    }
    return true;
};

RaccoonRobot.prototype.__canSetFourJointAngles = function(deg1, deg2, deg3, deg4) {
    if (deg1 < -120 || deg1 > 120) return false;
    if (deg2 < -90 || deg2 > 30) return false;
    if (deg3 < -150 || deg3 > 0) return false;
    if (deg4 < -105 || deg4 > 105) return false;
    return true;
};

RaccoonRobot.prototype.__canChangeJointAngleToTargets = function(joint, deg, t1, t2, t3, t4) {
    if (deg == 0) return true;
    switch (joint) {
        case 1:
            if (t1 < -120 || t1 > 120) return false;
            break;
        case 2:
            if (t2 < -90 || t2 > 30) return false;
            break;
        case 3:
            if (t3 < -150 || t3 > 0) return false;
            break;
        case 4:
            if (t4 < -105 || t4 > 105) return false;
            break;
        default:
            return this.__canChangeFourJointAnglesToTargets(deg, deg, deg, deg, t1, t2, t3, t4);
    }
    return true;
};

RaccoonRobot.prototype.__canChangeFourJointAnglesToTargets = function(
    deg1,
    deg2,
    deg3,
    deg4,
    t1,
    t2,
    t3,
    t4
) {
    if (deg1 == 0 && deg2 == 0 && deg3 == 0 && deg4 == 0) return true;
    if (t1 < -120 || t1 > 120) return false;
    if (t2 < -90 || t2 > 30) return false;
    if (t3 < -150 || t3 > 0) return false;
    if (t4 < -105 || t4 > 105) return false;
    return true;
};

RaccoonRobot.prototype.__setJointAngle = function(joint, deg) {
    this.resetting = false;
    const motoring = this.motoring;
    switch (joint) {
        case 1:
            motoring.jointAngle1 = deg;
            break;
        case 2:
            motoring.jointAngle2 = deg;
            break;
        case 3:
            motoring.jointAngle3 = deg;
            break;
        case 4:
            motoring.jointAngle4 = deg;
            break;
        default:
            motoring.jointAngle1 = deg;
            motoring.jointAngle2 = deg;
            motoring.jointAngle3 = deg;
            motoring.jointAngle4 = deg;
            break;
    }
    this.__clearJointStale(joint);
    motoring.jointAngleId = (motoring.jointAngleId % 255) + 1;
};

RaccoonRobot.prototype.__setFourJointAngles = function(deg1, deg2, deg3, deg4) {
    this.resetting = false;
    const motoring = this.motoring;
    motoring.jointAngle1 = deg1;
    motoring.jointAngle2 = deg2;
    motoring.jointAngle3 = deg3;
    motoring.jointAngle4 = deg4;
    this.__clearJointStale(-1);
    motoring.jointAngleId = (motoring.jointAngleId % 255) + 1;
};

RaccoonRobot.prototype.__changeJointAngleToTargets = function(joint, t1, t2, t3, t4) {
    this.resetting = false;
    const motoring = this.motoring;
    switch (joint) {
        case 1:
            motoring.jointAngle1 = t1;
            break;
        case 2:
            motoring.jointAngle2 = t2;
            break;
        case 3:
            motoring.jointAngle3 = t3;
            break;
        case 4:
            motoring.jointAngle4 = t4;
            break;
        default:
            motoring.jointAngle1 = t1;
            motoring.jointAngle2 = t2;
            motoring.jointAngle3 = t3;
            motoring.jointAngle4 = t4;
            break;
    }
    this.__clearJointStale(joint);
    motoring.jointAngleId = (motoring.jointAngleId % 255) + 1;
};

RaccoonRobot.prototype.__changeFourJointAnglesToTargets = function(t1, t2, t3, t4) {
    this.resetting = false;
    const motoring = this.motoring;
    motoring.jointAngle1 = t1;
    motoring.jointAngle2 = t2;
    motoring.jointAngle3 = t3;
    motoring.jointAngle4 = t4;
    this.__clearJointStale(-1);
    motoring.jointAngleId = (motoring.jointAngleId % 255) + 1;
};

RaccoonRobot.prototype.__setJointMode = function(mode) {
    this.motoring.jointMode = mode;
    this.motoring.jointModeId = (this.motoring.jointModeId % 255) + 1;
};

RaccoonRobot.prototype.__issueSlotW1 = function() {
    this.motoring.slotW1Id = (this.motoring.slotW1Id % 255) + 1;
};

RaccoonRobot.prototype.__issueSlotW2 = function() {
    this.motoring.slotW2Id = (this.motoring.slotW2Id % 255) + 1;
};

RaccoonRobot.prototype.__issueSlotW3 = function() {
    this.motoring.slotW3Id = (this.motoring.slotW3Id % 255) + 1;
};

RaccoonRobot.prototype.__cancelJointAngle = function() {
    this.angleCallback = undefined;
};

// ---------------- reset-pose / gripper internals ----------------

RaccoonRobot.prototype.__resetGripper = function() {
    const sw2 = this.motoring.slotW2;
    sw2[0] = 0x21;
    for (let i = 1; i < 8; ++i) {
        sw2[i] = 0;
    }
    this.__issueSlotW2();
};

RaccoonRobot.prototype.__resetPose = function() {
    this.__cancelJointAngle();
    this.__setJointMode(this.__checkJointMode(this.JOINT_MODE_ANGLE));
    this.__setJointVelocity(-1, 0);
    this.__setFourJointAngles(0, -10, -140, 60);
    this.resetting = true;
    // 타임아웃 가드: jointState 완료가 오지 않으면(복귀 중 연결 끊김, 장치 멈춤)
    // 로컬 리셋을 강제해 상태가 resetting/ANGLE 모드에 갇히지 않게 한다. 정상 완료
    // 경로가 취소할 수 있도록 핸들은 보관한다(__cancelSoundTimeout과 동일).
    this.__cancelResetTimeout();
    const timer = setTimeout(() => {
        this.resetTimer = undefined;
        this.__removeTimeout(timer);
        if (this.resetting) {
            this.resetting = false;
            this.__reset();
            // __reset은 명령을 보내지 않고 버퍼만 기본 자세로 덮는다. 팔은 복귀 도중이거나
            // 연결이 끊긴 자리에 있으므로 버퍼를 믿을 수 없다.
            this.__markJointStale(-1);
        }
    }, this.__RESET_TIMEOUT_MS);
    this.resetTimer = timer;
    this.timeouts.push(timer);
};

RaccoonRobot.prototype.__cancelResetTimeout = function() {
    if (this.resetTimer !== undefined) {
        this.__removeTimeout(this.resetTimer);
        this.resetTimer = undefined;
    }
};

RaccoonRobot.prototype.__reset = function() {
    // _reset(): motoring을 자세 복귀 후 기본값으로 되돌리고 jointState 첫 샘플
    // 캐시를 다시 준비한다. jointAngleId/jointModeId 카운터는 건드리지 않는다
    // (0 재시드 시 다음 실행의 id가 entry-hw _prev와 충돌해 명령이 삼켜짐. setZero 주석 참고).
    const motoring = this.motoring;
    motoring.jointSpeed = 100;
    motoring.jointAngle1 = 0;
    motoring.jointAngle2 = -10;
    motoring.jointAngle3 = -140;
    motoring.jointAngle4 = 60;
    motoring.jointMode = 0;
    this.jointStateId = -1;
};

// ---------------- note / sound internals ----------------

RaccoonRobot.prototype.__setNote = function(note) {
    this.motoring.note = note;
    this.motoring.noteId = (this.motoring.noteId % 255) + 1;
};

RaccoonRobot.prototype.__issueNoteId = function() {
    this.noteId = this.blockId = (this.blockId % 65535) + 1;
    return this.noteId;
};

RaccoonRobot.prototype.__cancelNote = function() {
    this.noteId = 0;
    if (this.noteTimer1 !== undefined) {
        this.__removeTimeout(this.noteTimer1);
    }
    if (this.noteTimer2 !== undefined) {
        this.__removeTimeout(this.noteTimer2);
    }
    this.noteTimer1 = undefined;
    this.noteTimer2 = undefined;
};

RaccoonRobot.prototype.__setSound = function(sound) {
    this.motoring.sound = sound;
    this.motoring.soundId = (this.motoring.soundId % 255) + 1;
};

RaccoonRobot.prototype.__runSound = function(sound, count) {
    if (typeof count != 'number') count = 1;
    if (count < 0) count = -1;
    if (count) {
        this.currentSound = sound;
        this.soundRepeat = count;
        this.__setSound(sound);
    }
    this.sounding = sound != 0;
};

RaccoonRobot.prototype.__cancelSound = function() {
    this.soundCallback = undefined;
    this.__cancelSoundTimeout();
};

RaccoonRobot.prototype.__cancelSoundTimeout = function() {
    if (this.soundTimeoutTimer !== undefined) {
        this.__removeTimeout(this.soundTimeoutTimer);
        this.soundTimeoutTimer = undefined;
    }
};

RaccoonRobot.prototype.__armSoundTimeout = function() {
    // 타임아웃 가드: 장치 soundState가 이미 완료된 채로 시작되면 play-and-wait가
    // 멈출 수 있으므로 이 타임아웃으로 대기 시간을 제한한다.
    this.__cancelSoundTimeout();
    const timer = setTimeout(() => {
        this.soundTimeoutTimer = undefined;
        this.__removeTimeout(timer);
        const callback = this.soundCallback;
        this.currentSound = 0;
        this.soundRepeat = 1;
        this.sounding = false;
        this.soundCallback = undefined;
        this.__checkSoundPlaying();
        if (callback) callback();
    }, this.__SOUND_TIMEOUT_MS);
    this.soundTimeoutTimer = timer;
    this.timeouts.push(timer);
};

RaccoonRobot.prototype.__checkSoundPlaying = function() {
    this.noting = this.motoring.note != 0;
    this.resting = false;
};

RaccoonRobot.prototype.__issueIoId = function() {
    this.ioId = this.blockId = (this.blockId % 65535) + 1;
    return this.ioId;
};

RaccoonRobot.prototype.__cancelIo = function() {
    this.ioId = 0;
    if (this.ioTimer !== undefined) {
        this.__removeTimeout(this.ioTimer);
    }
    this.ioTimer = undefined;
};

// ---------------- sensory ----------------

RaccoonRobot.prototype.handleSensory = function() {
    const sensory = this.sensory;
    // 패킷 주기에 맞춰 먼저 지우고 감지한다. 햇이 엣지당 한 번씩만 감지하도록.
    this.clearEvent();

    if (sensory.teachButton != this.teachButton) {
        if (this.teachButton == 0 && sensory.teachButton == 1) this.teachPressed = true;
        else if (this.teachButton == 1 && sensory.teachButton == 0) this.teachReleased = true;
        this.teachButton = sensory.teachButton;
    }
    if (sensory.playButton != this.playButton) {
        if (this.playButton == 0 && sensory.playButton == 1) this.playPressed = true;
        else if (this.playButton == 1 && sensory.playButton == 0) this.playReleased = true;
        this.playButton = sensory.playButton;
    }
    if (sensory.deleteButton != this.deleteButton) {
        if (this.deleteButton == 0 && sensory.deleteButton == 1) this.deletePressed = true;
        else if (this.deleteButton == 1 && sensory.deleteButton == 0) this.deleteReleased = true;
        this.deleteButton = sensory.deleteButton;
    }

    if (sensory.teachClickedId != this.teachClickedId) {
        if (this.teachClickedId != -1) this.teachClicked = true;
        this.teachClickedId = sensory.teachClickedId;
    }
    if (sensory.playClickedId != this.playClickedId) {
        if (this.playClickedId != -1) this.playClicked = true;
        this.playClickedId = sensory.playClickedId;
    }
    if (sensory.deleteClickedId != this.deleteClickedId) {
        if (this.deleteClickedId != -1) this.deleteClicked = true;
        this.deleteClickedId = sensory.deleteClickedId;
    }

    if (sensory.teachLongPressedId != this.teachLongPressedId) {
        if (this.teachLongPressedId != -1) this.teachLongPressed = true;
        this.teachLongPressedId = sensory.teachLongPressedId;
    }
    if (sensory.playLongPressedId != this.playLongPressedId) {
        if (this.playLongPressedId != -1) this.playLongPressed = true;
        this.playLongPressedId = sensory.playLongPressedId;
    }
    if (sensory.deleteLongPressedId != this.deleteLongPressedId) {
        if (this.deleteLongPressedId != -1) this.deleteLongPressed = true;
        this.deleteLongPressedId = sensory.deleteLongPressedId;
    }

    if (sensory.collision1Id != this.collision1Id) {
        if (this.collision1Id != -1) this.collided1 = true;
        this.collision1Id = sensory.collision1Id;
    }
    if (sensory.collision2Id != this.collision2Id) {
        if (this.collision2Id != -1) this.collided2 = true;
        this.collision2Id = sensory.collision2Id;
    }
    if (sensory.collision3Id != this.collision3Id) {
        if (this.collision3Id != -1) this.collided3 = true;
        this.collision3Id = sensory.collision3Id;
    }
    if (sensory.collision4Id != this.collision4Id) {
        if (this.collision4Id != -1) this.collided4 = true;
        this.collision4Id = sensory.collision4Id;
    }

    if (sensory.jointStateId !== undefined) {
        let t = sensory.jointStateId;
        if (t != this.jointStateId) {
            if (this.jointStateId != -1 && (this.angleCallback || this.resetting)) {
                const callback = this.angleCallback;
                this.__cancelJointAngle();
                this.__setJointMode(this.__checkJointMode(this.JOINT_MODE_VELOCITY));
                // 완료 시 velocity(-1, 0) = 속도 0 유지(토크 ON, 자세 유지).
                // 레퍼런스 raccoonRobot.js 완료 분기와 동일. 127(전원 차단)은 명시적
                // turnOff 블록 전용이며, 완료 때 127을 쓰면 이동 완료 직후 팔 힘이 빠진다.
                this.__setJointVelocity(-1, 0);
                if (this.resetting) {
                    this.resetting = false;
                    this.__cancelResetTimeout();
                    this.__reset();
                    t = -1;
                }
                if (callback) callback();
            }
            this.jointStateId = t;
        }
    }
    if (sensory.soundStateId !== undefined) {
        const t = sensory.soundStateId;
        if (t != this.soundStateId) {
            if (this.soundStateId != -1) {
                if (this.currentSound > 0) {
                    if (this.soundRepeat < 0) {
                        this.__runSound(this.currentSound, -1);
                    } else if (this.soundRepeat > 1) {
                        this.soundRepeat--;
                        this.__runSound(this.currentSound, this.soundRepeat);
                        if (this.soundCallback) this.__armSoundTimeout();
                    } else {
                        this.currentSound = 0;
                        this.soundRepeat = 1;
                        this.sounding = false;
                        const callback = this.soundCallback;
                        this.__cancelSound();
                        this.__checkSoundPlaying();
                        if (callback) callback();
                    }
                } else {
                    this.currentSound = 0;
                    this.soundRepeat = 1;
                    this.sounding = false;
                    const callback = this.soundCallback;
                    this.__cancelSound();
                    this.__checkSoundPlaying();
                    if (callback) callback();
                }
            }
            this.soundStateId = t;
        }
    }
    if (sensory.slotR1Id !== undefined) {
        const t = sensory.slotR1Id;
        if (t != this.slotR1Id) {
            if (sensory.slotR1 !== undefined) {
                const type = sensory.slotR1[0] & 0x0f;
                this.extType = type;
                if (type == 1) {
                    this.__conveyorHandleSensory(sensory.slotR1);
                }
            }
            this.slotR1Id = t;
        }
    }
    if (sensory.slotR2Id !== undefined) {
        const t = sensory.slotR2Id;
        if (t != this.slotR2Id) {
            if (sensory.slotR2 !== undefined) {
                const slotR2 = sensory.slotR2;
                this.gripper.type = slotR2[0] & 0x0f;
                this.gripper.state = slotR2[2] & 0xff;
            }
            this.slotR2Id = t;
        }
    }
    if (sensory.slotR3Id !== undefined) {
        const t = sensory.slotR3Id;
        if (t != this.slotR3Id) {
            this.slotR3Id = t;
        }
    }
    this.__calcKinematics();
};

// ---------------- kinematics ----------------

RaccoonRobot.prototype.__getPosRef = function() {
    if (this.posRefDev == this.REF_WRIST) {
        const posRef = this.posRef;
        const posRefRel = this.posRefRel;
        posRef.x = posRefRel.x;
        posRef.y = posRefRel.y;
        posRef.z = posRefRel.z;
    } else if (this.posRefDev == this.REF_GRIPPER) {
        const posRef = this.posRef;
        posRef.x = 0;
        posRef.y = 0;
        posRef.z = 0;
        const posRefRel = this.posRefRel;
        if (this.gripper.type == 3 || this.gripper.type == 4) {
            // 서보/DC 그리퍼
            posRef.x = 8;
            posRef.y = -0.6;
        } else if (this.gripper.type == 2) {
            // 진공
            posRef.x = 7.5;
        }
        posRef.x += posRefRel.x;
        posRef.y += posRefRel.y;
        posRef.z += posRefRel.z;
    } else {
        const posRef = this.posRef;
        const posRefAbs = this.posRefAbs;
        const posRefRel = this.posRefRel;
        posRef.x = posRefAbs.x + posRefRel.x;
        posRef.y = posRefAbs.y + posRefRel.y;
        posRef.z = posRefAbs.z + posRefRel.z;
    }
    return this.posRef;
};

RaccoonRobot.prototype.__calcKinematics = function() {
    const sensory = this.sensory;
    const posRef = this.__getPosRef();
    const th1 = sensory.encoder1 * this.__TO_RADIAN;
    const th2 = sensory.encoder2 * this.__TO_RADIAN;
    const th3 = sensory.encoder3 * this.__TO_RADIAN;
    const th4 = sensory.encoder4 * this.__TO_RADIAN;
    const c1 = Math.cos(th1);
    const s1 = Math.sin(th1);
    const c4 = Math.cos(th4);
    const s4 = Math.sin(th4);
    const c23 = Math.cos(th2 + th3);
    const s23 = Math.sin(th2 + th3);
    const M1 = c4 * posRef.x - s4 * posRef.y + this.__L3;
    const M2 = s4 * posRef.x + c4 * posRef.y;
    const M = s23 * M1 + c23 * M2 + Math.sin(th2) * this.__L2;
    const x = -c1 * M + s1 * posRef.z;
    const y = -s1 * M - c1 * posRef.z;
    const z = c23 * M1 - s23 * M2 + Math.cos(th2) * this.__L2 + this.__L1;
    const pos = this.pos;
    pos.x = -y;
    pos.y = x;
    pos.z = z;
};

RaccoonRobot.prototype.__calcInvKinematics = function(xx, yy, z) {
    let x = yy;
    let y = -xx;
    const sensory = this.sensory;
    const posRef = this.__getPosRef();
    let th2 = sensory.encoder2 * this.__TO_RADIAN;
    let th3 = sensory.encoder3 * this.__TO_RADIAN;
    const th4 = sensory.encoder4 * this.__TO_RADIAN;
    const alpha = th2 + th3 + th4 + 90 * this.__TO_RADIAN;
    const beta = Math.atan2(posRef.y, posRef.x);
    const L = Math.sqrt(posRef.x * posRef.x + posRef.y * posRef.y);
    const Lx = L * Math.cos(alpha + beta);
    const Ly = L * Math.sin(alpha + beta);
    const th1 = Math.atan2(y, x);
    x = x - Lx * Math.cos(th1);
    y = y - Lx * Math.sin(th1);
    z = z - Ly;
    const c1 = Math.cos(th1);
    const s1 = Math.sin(th1);
    const zL1 = z - this.__L1;
    const c3 =
        (x * x + y * y + zL1 * zL1 - this.__L2 * this.__L2 - this.__L3 * this.__L3) /
        (2 * this.__L2 * this.__L3);
    let c32 = c3 * c3;
    if (c32 > 1 + 1e-9) return null;
    if (c32 > 1) c32 = 1;
    const s3 = -Math.sqrt(1 - c32);
    th3 = Math.atan2(s3, c3);
    const M1 = c3 * this.__L3 + this.__L2;
    const M2 = z - this.__L1;
    const M3 = s3 * this.__L3;
    const M4 = c1 * x + s1 * y;
    const c2 = M1 * M2 - M3 * M4;
    const s2 = -M2 * M3 - M1 * M4;
    th2 = Math.atan2(s2, c2);
    const joints = this.joints;
    joints[0] = th1 * this.__TO_DEGREE;
    joints[1] = th2 * this.__TO_DEGREE;
    joints[2] = th3 * this.__TO_DEGREE;
    joints[3] = alpha * this.__TO_DEGREE - 90 - joints[1] - joints[2];
    // 비유한 입력은 위쪽 c32 가드를 그냥 통과한다. NaN 과의 비교는 전부 false다. 좌표 블록은
    // posRef 를 누적하므로 Infinity 를 양쪽으로 넣으면 NaN 이 만들어진다. 그대로 내보내면
    // 관절 범위 검사(역시 비교)도 통과하고 _degToStep -> toHex2 가 NaN 을 0 으로 접어
    // 네 관절이 모두 0도로 명령된다. 3번 관절은 0도가 가동 끝이다.
    // 호출부(__moveToXyzUntil)가 이미 null 을 거르므로 여기서 null 로 돌려보낸다.
    if (!joints.every(Number.isFinite)) return null;
    return joints;
};

// ---------------- lookup maps (Entry dropdown values) ----------------

RaccoonRobot.prototype.__JOINTS = {
    JOINT1: 1,
    JOINT2: 2,
    JOINT3: 3,
    JOINT4: 4,
    ALL: -1,
};

RaccoonRobot.prototype.__AXES = {
    X: 1,
    Y: 2,
    Z: 0,
};

// Entry 드롭다운 -> 사운드 코드 (entry-hw가 바이트로 변환)
RaccoonRobot.prototype.__SOUNDS = {
    BEEP: 1,
    RANDOM_BEEP: 2,
    NOISE: 10,
    SIREN: 3,
    ENGINE: 4,
    CHOP: 11,
    ROBOT: 5,
    DIBIDIBIDIP: 8,
    GOOD_JOB: 9,
    RANDOM_MELODY: 18,
    WAKE_UP: 22,
    START: 23,
    BYE: 24,
};

// Entry 드롭다운 -> 옥타브-1 음 값 (장치: C_1=4, 옥타브당 +12)
RaccoonRobot.prototype.__NOTES = {
    C: 4,
    CS: 5,
    D: 6,
    DS: 7,
    E: 8,
    F: 9,
    FS: 10,
    G: 11,
    GS: 12,
    A: 13,
    AS: 14,
    B: 15,
};

RaccoonRobot.prototype.__BATTERY_STATES = {
    NORMAL: 2,
    LOW: 1,
    EMPTY: 0,
};

RaccoonRobot.prototype.__unitFactor = function(unit) {
    return unit == 'INCHES' ? this.__INCH_TO_CM : 1;
};

RaccoonRobot.prototype.__errorSound = function() {
    this.__cancelNote();
    this.__cancelSound();
    this.__setNote(0);
    this.__runSound(127, 1);
    this.__checkSoundPlaying();
};

// ---------------- command cores ----------------

// 관절 각도 버퍼가 실제와 어긋났음을 표시한다. 분기는 __setJointVelocity의 계약을 그대로 따른다:
// undefined(알 수 없는 드롭다운 값)는 무시, 1~4는 해당 관절, 그 외(ALL = -1)는 네 관절 전부.
// stop/turnOff 블록은 드롭다운 기본값이 ALL이라 -1이 들어온다.
RaccoonRobot.prototype.__markJointStale = function(joint) {
    if (joint === undefined) return;
    const stale = this.jointAngleStale;
    if (joint >= 1 && joint <= 4) stale[joint - 1] = true;
    else stale[0] = stale[1] = stale[2] = stale[3] = true;
};

// 그 관절의 버퍼가 다시 권위 있게 됐을 때 지운다. 실측값으로 채웠거나 명령으로 덮은 경우다.
RaccoonRobot.prototype.__clearJointStale = function(joint) {
    // __markJointStale과 같은 계약. 지우기는 "버퍼가 권위 있다"는 주장이므로 알 수 없는
    // 값에 네 개를 지우면 안 된다(표시는 중복 재시드 1회로 끝나지만 지우기는 결함이 된다).
    if (joint === undefined) return;
    const stale = this.jointAngleStale;
    if (joint >= 1 && joint <= 4) stale[joint - 1] = false;
    else stale[0] = stale[1] = stale[2] = stale[3] = false;
};

RaccoonRobot.prototype.__canTrustEncoders = function() {
    const s = this.sensory;
    const e = [s.encoder1, s.encoder2, s.encoder3, s.encoder4];
    // afterReceive가 sensory를 통째로 교체하므로 생성자 기본값이 남지 않는다. 필드가 빠지면
    // undefined가 섞이고, 그대로 쓰면 _degToStep -> toHex2가 NaN을 0으로 접어 네 관절 모두
    // 0도로 명령된다(3번 관절은 0도가 가동 끝이다).
    if (!e.every(Number.isFinite)) return false;
    // 유효 패킷을 아직 못 받았으면 entry-hw raccoon.js의 기본값 0이 그대로 온다(손상 프레임은
    // 조기 반환, 재연결 시 reset()이 0으로 되돌림). 네 값이 정확히 0이면 측정 전으로 본다.
    // 실제로 네 관절이 0인 경우를 걸러도 기존 동작으로 돌아갈 뿐이라 무해하다.
    if (e[0] === 0 && e[1] === 0 && e[2] === 0 && e[3] === 0) return false;
    return true;
};

// 표시된 관절만 실측값으로 채우고 표시를 지운다. 반올림은 표시용이며, 엔코더 분해능이
// 0.0879도/step이라 _degToStep의 반올림이 같은 step을 복원한다.
RaccoonRobot.prototype.__seedStaleJointAngles = function() {
    if (!this.__canTrustEncoders()) return;
    const sensory = this.sensory;
    const motoring = this.motoring;
    const stale = this.jointAngleStale;
    for (let i = 1; i <= 4; ++i) {
        if (!stale[i - 1]) continue;
        motoring['jointAngle' + i] = Math.round(sensory['encoder' + i] * 100) / 100;
        stale[i - 1] = false;
    }
};

// setTimeout 의 지연은 32비트 부호 있는 정수(최대 2147483647ms, 약 24.8일)까지만 유효하다.
// 넘는 값을 넘기면 엔진이 지연을 1ms 로 취급해 콜백을 즉시 실행한다. 길게 요청할수록 빨리
// 끝나는 뒤집힌 동작이 된다. 박자와 초 단위 대기는 상한이 없어 이 한계를 넘길 수 있다.
RaccoonRobot.prototype.__MAX_DELAY_MS = 2147483647;

RaccoonRobot.prototype.__clampDelay = function(ms) {
    const n = parseFloat(ms);
    // NaN, 0, 음수는 전부 즉시 실행이다. 특히 NaN 은 "값이 없다"는 뜻이지 "너무 길다"가
    // 아니므로 상한으로 보내면 안 된다(__clamp 와 같은 정책). 알리지도 않는다.
    // 상한 초과와 무한대만 알린다.
    if (!(n > 0)) return 0;
    if (n <= this.__MAX_DELAY_MS) return n;
    this.__warnDelay();
    return this.__MAX_DELAY_MS;
};

RaccoonRobot.prototype.__warnDelay = function() {
    if (this.delayWarned) return;
    if (!Entry.toast) return;
    if (typeof Lang === 'undefined' || !Lang.Msgs || !Lang.Msgs.raccoon_delay_too_long) return;
    this.delayWarned = true;
    Entry.toast.warning(Lang.Msgs.raccoon_delay_too_long_title, Lang.Msgs.raccoon_delay_too_long);
};

// 각도 명령이 거부되면 지금까지는 장치 경고음만 났다. 화면에도 한 줄 남긴다.
// 거부 사유를 구분하지 않는다. 관절 가동 범위를 넘은 경우와 좌표가 팔이 닿지 않는
// 위치인 경우 둘 다 같은 분기로 들어오고, 사용자가 할 일도 같다(값을 줄여 다시 시도).
RaccoonRobot.prototype.__warnUnreachablePose = function() {
    if (this.unreachablePoseWarned) return;
    // 가드를 플래그보다 먼저 본다(__warnLimit 주석 참고). 명령 건너뛰기 자체는 그래도 동작한다.
    if (!Entry.toast) return;
    if (typeof Lang === 'undefined' || !Lang.Msgs || !Lang.Msgs.raccoon_unreachable_pose) return;
    this.unreachablePoseWarned = true;
    Entry.toast.warning(
        Lang.Msgs.raccoon_unreachable_pose_title,
        Lang.Msgs.raccoon_unreachable_pose
    );
};

RaccoonRobot.prototype.__anglesCore = function(wait, canFn, applyFn, callback) {
    // 진행 중 콜백 취소도 전송 경로 안에서 한다. 거부된 명령이 취소하면, 다른 스크립트가
    // 기다리던 각도 이동의 완료 콜백이 사라져 그 스크립트가 영원히 끝나지 않는다.
    // 완료 처리(handleSensory)가 angleCallback 존재를 게이트로 쓰므로 완료 정리도 함께
    // 건너뛰어, 로봇이 각도 모드에 갇힌다.
    // 모드 전환, 속도 초기화, 실측 채우기도 같은 이유로 canFn 통과 후에 한다.
    //
    // entry-hw는 jointMode를 id 게이트 없이 매 주기 읽는다(raccoon.js handleRemoteData의
    // 의도적 비대칭). 그래서 각도 모드로 바꾸는 순간, 아직 새 각도를 싣지 않았어도 다음
    // 프레임이 마지막으로 latch된 네 관절 값을 그대로 내보낸다. 장치는 그 값으로 서보하므로
    // 거부된 명령이 팔을 이전 자세로 튀게 만든다. 전원 끄기로 처진 팔이 직전
    // 각도로 돌아간다.
    //
    // 속도도 같이 미룬다. 각도 모드에서는 속도가 프레임에 실리지 않지만, 모드 전환을
    // 미루면 거부 경로가 속도 모드로 남으므로 여기서 0을 쓰면 전원 끄기(127)를 덮어
    // 팔에 다시 힘이 들어간다.
    if (canFn()) {
        this.__cancelJointAngle();
        this.__setJointMode(this.__checkJointMode(this.JOINT_MODE_ANGLE));
        this.__setJointVelocity(-1, 0);
        // 채우기도 전송 경로 전용이다. entry-hw는 jointAngleId가 바뀔 때만 네 관절 값을
        // latch하고 id를 올리는 것은 applyFn뿐이라, 거부 경로에서 채우면 플래그만 소진돼
        // 다음 명령이 낡은 버퍼를 그대로 내보낸다.
        this.__seedStaleJointAngles();
        applyFn();
        if (this.precisionMode == 1) {
            this.angleCallback = () => {
                this.__cancelJointAngle();
                // 본 경로와 같은 이유로 전송 경로에서만 모드를 바꾼다. 이 콜백은 완료 처리부에서
                // 불리는데 거기서 이미 속도 모드 + 속도 0으로 돌려놨다. 재확인이 실패하면
                // 그 상태를 그대로 두는 것이 맞다.
                if (canFn()) {
                    this.__setJointMode(this.__checkJointMode(this.JOINT_MODE_ANGLE));
                    this.__setJointVelocity(-1, 0);
                    applyFn();
                    if (wait) {
                        this.angleCallback = callback;
                    }
                } else if (wait) {
                    // 재확인이 실패하면 기다리는 블록을 끝낸다. 이 분기가 없으면
                    // angleCallback 이 이미 비워진 상태라 아무도 블록을 깨우지 못해
                    // 스크립트가 영구 정지한다.
                    // 경고음과 안내는 내지 않는다. 1차 통과로 팔은 이미 움직였고,
                    // "블록을 건너뛰었습니다" 는 사실이 아니다. 정밀 보정만 못 한 것이다.
                    callback();
                }
            };
            if (!wait) callback();
        } else if (wait) {
            this.angleCallback = callback;
        } else {
            callback();
        }
    } else {
        this.__errorSound();
        this.__warnUnreachablePose();
        callback();
    }
};

RaccoonRobot.prototype.__changeAnglesUntil = function(wait, deg1, deg2, deg3, deg4, callback) {
    deg1 = parseFloat(deg1);
    deg2 = parseFloat(deg2);
    deg3 = parseFloat(deg3);
    deg4 = parseFloat(deg4);
    if (isNaN(deg1) || isNaN(deg2) || isNaN(deg3) || isNaN(deg4)) {
        callback();
        return;
    }
    const s = this.sensory;
    const t1 = s.encoder1 + deg1;
    const t2 = s.encoder2 + deg2;
    const t3 = s.encoder3 + deg3;
    const t4 = s.encoder4 + deg4;
    this.__anglesCore(
        wait,
        () => this.__canChangeFourJointAnglesToTargets(deg1, deg2, deg3, deg4, t1, t2, t3, t4),
        () => this.__changeFourJointAnglesToTargets(t1, t2, t3, t4),
        callback
    );
};

RaccoonRobot.prototype.__setAnglesUntil = function(wait, deg1, deg2, deg3, deg4, callback) {
    deg1 = parseFloat(deg1);
    deg2 = parseFloat(deg2);
    deg3 = parseFloat(deg3);
    deg4 = parseFloat(deg4);
    if (isNaN(deg1) || isNaN(deg2) || isNaN(deg3) || isNaN(deg4)) {
        callback();
        return;
    }
    this.__anglesCore(
        wait,
        () => this.__canSetFourJointAngles(deg1, deg2, deg3, deg4),
        () => this.__setFourJointAngles(deg1, deg2, deg3, deg4),
        callback
    );
};

RaccoonRobot.prototype.__changeAngleUntil = function(wait, joint, deg, callback) {
    deg = parseFloat(deg);
    if (isNaN(deg) || joint === undefined) {
        callback();
        return;
    }
    const s = this.sensory;
    const t1 = s.encoder1 + deg;
    const t2 = s.encoder2 + deg;
    const t3 = s.encoder3 + deg;
    const t4 = s.encoder4 + deg;
    this.__anglesCore(
        wait,
        () => this.__canChangeJointAngleToTargets(joint, deg, t1, t2, t3, t4),
        () => this.__changeJointAngleToTargets(joint, t1, t2, t3, t4),
        callback
    );
};

RaccoonRobot.prototype.__setAngleUntil = function(wait, joint, deg, callback) {
    deg = parseFloat(deg);
    if (isNaN(deg) || joint === undefined) {
        callback();
        return;
    }
    this.__anglesCore(
        wait,
        () => this.__canSetJointAngle(joint, deg),
        () => this.__setJointAngle(joint, deg),
        callback
    );
};

RaccoonRobot.prototype.__moveToXyzUntil = function(wait, x, y, z, callback) {
    // 시도마다 역기구학을 다시 계산한다(정밀 모드 포함).
    const attempt = () => this.__calcInvKinematics(x, y, z);
    let th = null;
    this.__anglesCore(
        wait,
        () => {
            th = attempt();
            return th != null && this.__canSetFourJointAngles(th[0], th[1], th[2], th[3]);
        },
        () => this.__setFourJointAngles(th[0], th[1], th[2], th[3]),
        callback
    );
};

// ---------------- Entry block methods ----------------

// ---------------- conveyor peripheral ----------------

RaccoonRobot.prototype.__conveyorIssueDistance = function() {
    this.conveyor.motoring.distanceId = (this.conveyor.motoring.distanceId % 255) + 1;
};

RaccoonRobot.prototype.__conveyorCancelDistance = function() {
    this.conveyor.distanceCallback = undefined;
};

RaccoonRobot.prototype.__conveyorIssueMoving = function() {
    this.conveyor.movingId = this.blockId = (this.blockId % 65535) + 1;
    return this.conveyor.movingId;
};

RaccoonRobot.prototype.__conveyorCancelMoving = function() {
    const conveyor = this.conveyor;
    conveyor.movingId = 0;
    if (conveyor.movingTimer !== undefined) {
        this.__removeTimeout(conveyor.movingTimer);
    }
    conveyor.movingTimer = undefined;
};

RaccoonRobot.prototype.__conveyorCheckMoving = function() {
    this.conveyor.moving = this.conveyor.motoring.velocity != 0;
};

RaccoonRobot.prototype.__conveyorUpdate = function() {
    const sw1 = this.motoring.slotW1;
    const conveyorMotoring = this.conveyor.motoring;
    sw1[0] = 0x11;
    sw1[1] = conveyorMotoring.mode;
    sw1[2] = conveyorMotoring.velocity;
    sw1[3] = conveyorMotoring.distanceId;
    sw1[4] = (conveyorMotoring.distance >> 8) & 0xff;
    sw1[5] = conveyorMotoring.distance & 0xff;
    for (let i = 6; i < 8; ++i) {
        sw1[i] = 0;
    }
    this.__issueSlotW1();
};

RaccoonRobot.prototype.__conveyorHandleSensory = function(slotR1) {
    const conveyor = this.conveyor;
    const conveyorSensory = conveyor.sensory;
    conveyorSensory.mode = slotR1[1] & 0xff;
    conveyorSensory.distance = ((slotR1[2] & 0xff) << 8) | (slotR1[3] & 0xff);
    conveyorSensory.button = slotR1[4] & 0x01;
    conveyorSensory.clickedId = (slotR1[4] >> 1) & 0x03;
    conveyorSensory.longPressedId = (slotR1[4] >> 3) & 0x03;
    conveyorSensory.moving = slotR1[5] & 0x01;
    conveyorSensory.stateId = (slotR1[5] >> 1) & 0x03;
    conveyorSensory.velocity = slotR1[6];

    if (conveyorSensory.button != conveyor.button) {
        if (conveyor.button == 0 && conveyorSensory.button == 1) conveyor.pressed = true;
        else if (conveyor.button == 1 && conveyorSensory.button == 0) conveyor.released = true;
        conveyor.button = conveyorSensory.button;
    }
    if (conveyorSensory.clickedId != conveyor.clickedId) {
        if (conveyor.clickedId != -1) conveyor.clicked = true;
        conveyor.clickedId = conveyorSensory.clickedId;
    }
    if (conveyorSensory.longPressedId != conveyor.longPressedId) {
        if (conveyor.longPressedId != -1) conveyor.longPressed = true;
        conveyor.longPressedId = conveyorSensory.longPressedId;
    }
    if (conveyorSensory.stateId !== undefined) {
        const t = conveyorSensory.stateId;
        if (t != conveyor.stateId) {
            if (conveyor.stateId != -1 && conveyor.distanceCallback) {
                const callback = conveyor.distanceCallback;
                this.__conveyorCancelDistance();
                conveyor.motoring.mode = 0;
                conveyor.motoring.velocity = 0;
                this.__conveyorCheckMoving();
                if (callback) callback();
            }
            conveyor.stateId = t;
        }
    }
};

RaccoonRobot.prototype.__conveyorStopInternal = function() {
    this.__conveyorCancelDistance();
    this.__conveyorCancelMoving();
    const conveyorMotoring = this.conveyor.motoring;
    conveyorMotoring.mode = 0;
    conveyorMotoring.velocity = 0;
    this.__conveyorUpdate();
    this.__conveyorCheckMoving();
};

RaccoonRobot.prototype.__resetConveyor = function() {
    this.__conveyorStopInternal();
    const conveyor = this.conveyor;
    const conveyorMotoring = conveyor.motoring;
    conveyorMotoring.mode = 0;
    conveyorMotoring.velocity = 0;
    conveyorMotoring.distance = 0;
    const conveyorSensory = conveyor.sensory;
    conveyorSensory.mode = 0;
    conveyorSensory.velocity = 0;
    conveyorSensory.distance = 0;
    conveyorSensory.button = 0;
    conveyorSensory.clickedId = 0;
    conveyorSensory.longPressedId = 0;
    conveyorSensory.stateId = 0;
    conveyorSensory.moving = 0;
    conveyor.clickedId = -1;
    conveyor.longPressedId = -1;
    conveyor.stateId = -1;
    conveyor.distanceCallback = undefined;
    conveyor.movingId = 0;
    conveyor.movingTimer = undefined;
    conveyor.moving = false;
    conveyor.button = 0;
    conveyor.pressed = false;
    conveyor.released = false;
    conveyor.clicked = false;
    conveyor.longPressed = false;
};

// 단위 값은 Entry 드롭다운의 대문자 값이다(CM/MM/INCHES/SECONDS).
RaccoonRobot.prototype.__conveyorMoveInternal = function(value, unit, speed, callback) {
    this.__conveyorCancelDistance();
    this.__conveyorCancelMoving();
    const conveyorMotoring = this.conveyor.motoring;
    value = parseFloat(value);
    speed = parseFloat(speed);
    if (!isNaN(value) && !isNaN(speed) && value != 0 && speed != 0) {
        if (speed < -100) speed = -100;
        else if (speed > 100) speed = 100;
        if (unit == 'SECONDS') {
            const id = this.__conveyorIssueMoving();
            conveyorMotoring.mode = 0;
            conveyorMotoring.velocity = speed;
            const timer = setTimeout(() => {
                if (this.conveyor.movingId == id) {
                    conveyorMotoring.mode = 0;
                    conveyorMotoring.velocity = 0;
                    this.__conveyorUpdate();
                    this.__conveyorCancelMoving();
                    this.__conveyorCheckMoving();
                    callback();
                }
            }, this.__clampDelay(value * 1000));
            this.conveyor.movingTimer = timer;
            this.timeouts.push(timer);
            this.__conveyorUpdate();
            this.__conveyorCheckMoving();
        } else {
            if (unit == 'MM') {
                value *= this.__MM_TO_CM;
            } else if (unit == 'INCHES') {
                value *= this.__INCH_TO_CM;
            }
            if (value < 0) {
                value = -value;
                speed = -speed;
            }
            conveyorMotoring.mode = 1;
            // 장치 WRITE_DISTANCE 범위 [0,65535]로 클램프 후 내림한다. entry-hw
            // _copySlot은 바이트 단위로만 클램프하므로 오버플로를 여기서 막아야 한다.
            // value는 위에서 이미 음수가 아니게 처리됐다.
            let dist = Math.floor(value * 100);
            if (dist < 0) dist = 0;
            else if (dist > 65535) dist = 65535;
            conveyorMotoring.distance = dist;
            conveyorMotoring.velocity = speed;
            this.conveyor.distanceCallback = callback;
            this.__conveyorIssueDistance();
            this.__conveyorUpdate();
            this.__conveyorCheckMoving();
        }
    } else {
        conveyorMotoring.mode = 0;
        conveyorMotoring.velocity = 0;
        this.__conveyorUpdate();
        this.__conveyorCheckMoving();
        callback();
    }
};

RaccoonRobot.prototype.conveyorMove = function(script) {
    return this.__waitBlock(script, (cb) => {
        this.__conveyorMoveInternal(
            script.getNumberValue('VALUE'),
            script.getField('UNIT'),
            script.getNumberValue('SPEED'),
            cb
        );
    });
};

RaccoonRobot.prototype.conveyorChangeVelocity = function(script) {
    this.__setModule();
    this.__conveyorCancelDistance();
    this.__conveyorCancelMoving();
    const conveyorMotoring = this.conveyor.motoring;
    conveyorMotoring.mode = 0;
    let velocity = parseFloat(script.getNumberValue('VELOCITY'));
    if (!isNaN(velocity)) {
        velocity += conveyorMotoring.velocity;
        if (velocity < -100) velocity = -100;
        else if (velocity > 100) velocity = 100;
        conveyorMotoring.velocity = velocity;
        this.__conveyorUpdate();
    }
    this.__conveyorCheckMoving();
    return script.callReturn();
};

RaccoonRobot.prototype.conveyorSetVelocity = function(script) {
    this.__setModule();
    this.__conveyorCancelDistance();
    this.__conveyorCancelMoving();
    const conveyorMotoring = this.conveyor.motoring;
    conveyorMotoring.mode = 0;
    let velocity = parseFloat(script.getNumberValue('VELOCITY'));
    if (!isNaN(velocity)) {
        if (velocity < -100) velocity = -100;
        else if (velocity > 100) velocity = 100;
        conveyorMotoring.velocity = velocity;
        this.__conveyorUpdate();
    }
    this.__conveyorCheckMoving();
    return script.callReturn();
};

RaccoonRobot.prototype.conveyorStop = function(script) {
    this.__setModule();
    this.__conveyorStopInternal();
    return script.callReturn();
};

RaccoonRobot.prototype.isConveyorMoving = function(script) {
    return this.conveyor.sensory.moving == 1;
};

RaccoonRobot.prototype.getConveyorButton = function(script) {
    return this.conveyor.sensory.button;
};

RaccoonRobot.prototype.__conveyorButtonEventFlag = function(state) {
    const conveyor = this.conveyor;
    switch (state) {
        case 'PRESSED':
            return conveyor.pressed;
        case 'RELEASED':
            return conveyor.released;
        case 'CLICKED':
            return conveyor.clicked;
        case 'LONG_PRESSED':
            return conveyor.longPressed;
    }
    return false;
};

RaccoonRobot.prototype.hasConveyorButtonEvent = function() {
    const conveyor = this.conveyor;
    return conveyor.pressed || conveyor.released || conveyor.clicked || conveyor.longPressed;
};

RaccoonRobot.prototype.checkConveyorButtonEvent = function(script) {
    return this.__conveyorButtonEventFlag(script.getField('STATE'));
};

RaccoonRobot.prototype.isConveyorButtonState = function(script) {
    const state = script.getField('STATE');
    if (state == 'PRESSED') return this.conveyor.sensory.button == 1;
    if (state == 'RELEASED') return this.conveyor.sensory.button == 0;
    return this.__conveyorButtonEventFlag(state);
};

RaccoonRobot.prototype.__waitBlock = function(script, starter) {
    this.__setModule();
    if (!script.isStart) {
        script.isStart = true;
        script.isMoving = true;
        starter(() => {
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

RaccoonRobot.prototype.returnToBasicPose = function(script) {
    return this.__waitBlock(script, (cb) => {
        this.unlockGripperInternal();
        this.__withGripperInternal('PLACE', () => {
            this.__setAnglesUntil(true, 0, -10, -140, 60, cb);
        });
    });
};

RaccoonRobot.prototype.changeJointAnglesBy = function(script) {
    this.__setModule();
    this.__changeAnglesUntil(
        false,
        script.getNumberValue('DEGREE1'),
        script.getNumberValue('DEGREE2'),
        script.getNumberValue('DEGREE3'),
        script.getNumberValue('DEGREE4'),
        () => {}
    );
    return script.callReturn();
};

RaccoonRobot.prototype.changeJointAnglesByUntil = function(script) {
    return this.__waitBlock(script, (cb) => {
        this.__changeAnglesUntil(
            true,
            script.getNumberValue('DEGREE1'),
            script.getNumberValue('DEGREE2'),
            script.getNumberValue('DEGREE3'),
            script.getNumberValue('DEGREE4'),
            cb
        );
    });
};

RaccoonRobot.prototype.setJointAnglesTo = function(script) {
    this.__setModule();
    this.__setAnglesUntil(
        false,
        script.getNumberValue('DEGREE1'),
        script.getNumberValue('DEGREE2'),
        script.getNumberValue('DEGREE3'),
        script.getNumberValue('DEGREE4'),
        () => {}
    );
    return script.callReturn();
};

RaccoonRobot.prototype.setJointAnglesToUntil = function(script) {
    return this.__waitBlock(script, (cb) => {
        this.__setAnglesUntil(
            true,
            script.getNumberValue('DEGREE1'),
            script.getNumberValue('DEGREE2'),
            script.getNumberValue('DEGREE3'),
            script.getNumberValue('DEGREE4'),
            cb
        );
    });
};

RaccoonRobot.prototype.changeAngleBy = function(script) {
    this.__setModule();
    const joint = this.__JOINTS[script.getField('JOINT')];
    this.__changeAngleUntil(false, joint, script.getNumberValue('DEGREE'), () => {});
    return script.callReturn();
};

RaccoonRobot.prototype.changeAngleByUntil = function(script) {
    return this.__waitBlock(script, (cb) => {
        const joint = this.__JOINTS[script.getField('JOINT')];
        this.__changeAngleUntil(true, joint, script.getNumberValue('DEGREE'), cb);
    });
};

RaccoonRobot.prototype.setAngleTo = function(script) {
    this.__setModule();
    const joint = this.__JOINTS[script.getField('JOINT')];
    this.__setAngleUntil(false, joint, script.getNumberValue('DEGREE'), () => {});
    return script.callReturn();
};

RaccoonRobot.prototype.setAngleToUntil = function(script) {
    return this.__waitBlock(script, (cb) => {
        const joint = this.__JOINTS[script.getField('JOINT')];
        this.__setAngleUntil(true, joint, script.getNumberValue('DEGREE'), cb);
    });
};

RaccoonRobot.prototype.__readXyzParams = function(script) {
    const f = this.__unitFactor(script.getField('UNIT'));
    return {
        x: script.getNumberValue('X') * f,
        y: script.getNumberValue('Y') * f,
        z: script.getNumberValue('Z') * f,
    };
};

RaccoonRobot.prototype.changePositionByXYZ = function(script) {
    this.__setModule();
    const p = this.__readXyzParams(script);
    const pos = this.pos;
    this.__moveToXyzUntil(false, pos.x + p.x, pos.y + p.y, pos.z + p.z, () => {});
    return script.callReturn();
};

RaccoonRobot.prototype.changePositionByXYZUntil = function(script) {
    return this.__waitBlock(script, (cb) => {
        const p = this.__readXyzParams(script);
        const pos = this.pos;
        this.__moveToXyzUntil(true, pos.x + p.x, pos.y + p.y, pos.z + p.z, cb);
    });
};

RaccoonRobot.prototype.setPositionToXYZ = function(script) {
    this.__setModule();
    const p = this.__readXyzParams(script);
    this.__moveToXyzUntil(false, p.x, p.y, p.z, () => {});
    return script.callReturn();
};

RaccoonRobot.prototype.setPositionToXYZUntil = function(script) {
    return this.__waitBlock(script, (cb) => {
        const p = this.__readXyzParams(script);
        this.__moveToXyzUntil(true, p.x, p.y, p.z, cb);
    });
};

RaccoonRobot.prototype.changePositionBy = function(script) {
    return this.__waitBlock(script, (cb) => {
        const axis = this.__AXES[script.getField('XYZ')];
        const value = script.getNumberValue('VALUE') * this.__unitFactor(script.getField('UNIT'));
        const pos = this.pos;
        let x = pos.x;
        let y = pos.y;
        let z = pos.z;
        if (axis == 1) x += value;
        else if (axis == 2) y += value;
        else if (axis == 0) z += value;
        this.__moveToXyzUntil(true, x, y, z, cb);
    });
};

RaccoonRobot.prototype.setPositionTo = function(script) {
    return this.__waitBlock(script, (cb) => {
        const axis = this.__AXES[script.getField('XYZ')];
        const value = script.getNumberValue('VALUE') * this.__unitFactor(script.getField('UNIT'));
        const pos = this.pos;
        let x = pos.x;
        let y = pos.y;
        let z = pos.z;
        if (axis == 1) x = value;
        else if (axis == 2) y = value;
        else if (axis == 0) z = value;
        this.__moveToXyzUntil(true, x, y, z, cb);
    });
};

RaccoonRobot.prototype.setPositionRefTo = function(script) {
    this.__setModule();
    this.posRefDev = script.getField('REF') == 'GRIPPER' ? this.REF_GRIPPER : this.REF_WRIST;
    return script.callReturn();
};

RaccoonRobot.prototype.changePositionRefByFrontUp = function(script) {
    this.__setModule();
    const f = this.__unitFactor(script.getField('UNIT'));
    const y = script.getNumberValue('Y') * f;
    const z = script.getNumberValue('Z') * f;
    const posRefRel = this.posRefRel;
    if (script.getField('FRONT_REAR') == 'FRONT') posRefRel.x += y;
    else posRefRel.x -= y;
    if (script.getField('UP_DOWN') == 'UP') posRefRel.y += z;
    else posRefRel.y -= z;
    return script.callReturn();
};

RaccoonRobot.prototype.setPositionRefToFrontUp = function(script) {
    this.__setModule();
    const f = this.__unitFactor(script.getField('UNIT'));
    const y = script.getNumberValue('Y') * f;
    const z = script.getNumberValue('Z') * f;
    const posRefAbs = this.posRefAbs;
    posRefAbs.x = script.getField('FRONT_REAR') == 'FRONT' ? y : -y;
    posRefAbs.y = script.getField('UP_DOWN') == 'UP' ? z : -z;
    posRefAbs.z = 0;
    this.posRefDev = this.REF_NONE;
    return script.callReturn();
};

RaccoonRobot.prototype.changeJointVelocitiesBy = function(script) {
    this.__setModule();
    this.__cancelJointAngle();
    this.__setJointMode(this.__checkJointMode(this.JOINT_MODE_VELOCITY));
    this.__changeFourJointVelocities(
        script.getNumberValue('VELOCITY1'),
        script.getNumberValue('VELOCITY2'),
        script.getNumberValue('VELOCITY3'),
        script.getNumberValue('VELOCITY4')
    );
    this.__markJointStale(-1);
    return script.callReturn();
};

RaccoonRobot.prototype.setJointVelocitiesTo = function(script) {
    this.__setModule();
    this.__cancelJointAngle();
    this.__setJointMode(this.__checkJointMode(this.JOINT_MODE_VELOCITY));
    this.__setFourJointVelocities(
        script.getNumberValue('VELOCITY1'),
        script.getNumberValue('VELOCITY2'),
        script.getNumberValue('VELOCITY3'),
        script.getNumberValue('VELOCITY4')
    );
    this.__markJointStale(-1);
    return script.callReturn();
};

RaccoonRobot.prototype.changeVelocityBy = function(script) {
    this.__setModule();
    this.__cancelJointAngle();
    this.__setJointMode(this.__checkJointMode(this.JOINT_MODE_VELOCITY));
    const joint = this.__JOINTS[script.getField('JOINT')];
    this.__changeJointVelocity(joint, script.getNumberValue('VELOCITY'));
    this.__markJointStale(joint);
    return script.callReturn();
};

RaccoonRobot.prototype.setVelocityTo = function(script) {
    this.__setModule();
    this.__cancelJointAngle();
    this.__setJointMode(this.__checkJointMode(this.JOINT_MODE_VELOCITY));
    const joint = this.__JOINTS[script.getField('JOINT')];
    this.__setJointVelocity(joint, script.getNumberValue('VELOCITY'));
    this.__markJointStale(joint);
    return script.callReturn();
};

RaccoonRobot.prototype.stop = function(script) {
    this.__setModule();
    this.__cancelJointAngle();
    this.__setJointMode(this.__checkJointMode(this.JOINT_MODE_VELOCITY));
    const joint = this.__JOINTS[script.getField('JOINT')];
    this.__setJointVelocity(joint, 0);
    this.__markJointStale(joint);
    return script.callReturn();
};

RaccoonRobot.prototype.turnOff = function(script) {
    this.__setModule();
    this.__cancelJointAngle();
    this.__setJointMode(this.__checkJointMode(this.JOINT_MODE_VELOCITY));
    const joint = this.__JOINTS[script.getField('JOINT')];
    this.__setJointVelocity(joint, 127);
    this.__markJointStale(joint);
    return script.callReturn();
};

RaccoonRobot.prototype.turnPrecisionMode = function(script) {
    this.__setModule();
    this.precisionMode = script.getField('ON_OFF') == 'ON' ? 1 : 0;
    return script.callReturn();
};

RaccoonRobot.prototype.isMoving = function(script) {
    return this.sensory.moving == 1;
};

// ---------------- gripper ----------------

RaccoonRobot.prototype.__withGripperInternal = function(action, callback) {
    this.__cancelIo();
    const id = this.__issueIoId();
    const sw2 = this.motoring.slotW2;
    sw2[0] = 0x21;
    sw2[1] = 0x00;
    sw2[2] = action == 'PICK' ? 1 : 0;
    for (let i = 3; i < 8; ++i) {
        sw2[i] = 0;
    }
    this.__issueSlotW2();
    const timer = setTimeout(() => {
        if (this.ioId == id) {
            this.__cancelIo();
            callback();
        }
    }, 500);
    this.ioTimer = timer;
    this.timeouts.push(timer);
};

RaccoonRobot.prototype.withGripper = function(script) {
    return this.__waitBlock(script, (cb) => {
        this.__withGripperInternal(script.getField('ACTION'), cb);
    });
};

RaccoonRobot.prototype.__lockGripperInternal = function(wait, direction, callback) {
    if (direction == 'HORIZONTAL') {
        if (
            this.jointMode == this.JOINT_MODE_VELOCITY ||
            this.jointMode == this.JOINT_MODE_VELOCITY_HORZ ||
            this.jointMode == this.JOINT_MODE_VELOCITY_VERT
        ) {
            this.jointMode = this.JOINT_MODE_VELOCITY_HORZ;
        } else {
            this.jointMode = this.JOINT_MODE_ANGLE_HORZ;
        }
    } else {
        if (
            this.jointMode == this.JOINT_MODE_VELOCITY ||
            this.jointMode == this.JOINT_MODE_VELOCITY_HORZ ||
            this.jointMode == this.JOINT_MODE_VELOCITY_VERT
        ) {
            this.jointMode = this.JOINT_MODE_VELOCITY_VERT;
        } else {
            this.jointMode = this.JOINT_MODE_ANGLE_VERT;
        }
    }
    this.__setJointMode(this.jointMode);
    this.__changeAngleUntil(wait, -1, 0, callback);
};

RaccoonRobot.prototype.lockGripper = function(script) {
    this.__setModule();
    this.__lockGripperInternal(false, script.getField('DIRECTION'), () => {});
    return script.callReturn();
};

RaccoonRobot.prototype.lockGripperUntil = function(script) {
    return this.__waitBlock(script, (cb) => {
        this.__lockGripperInternal(true, script.getField('DIRECTION'), cb);
    });
};

RaccoonRobot.prototype.unlockGripperInternal = function() {
    if (
        this.jointMode == this.JOINT_MODE_VELOCITY ||
        this.jointMode == this.JOINT_MODE_VELOCITY_HORZ ||
        this.jointMode == this.JOINT_MODE_VELOCITY_VERT
    ) {
        this.jointMode = this.JOINT_MODE_VELOCITY;
    } else {
        this.jointMode = this.JOINT_MODE_ANGLE;
    }
    this.__setJointMode(this.jointMode);
};

RaccoonRobot.prototype.unlockGripper = function(script) {
    this.__setModule();
    this.unlockGripperInternal();
    return script.callReturn();
};

RaccoonRobot.prototype.getGripperState = function(script) {
    return this.gripper.state;
};

// ---------------- sound / note blocks ----------------

RaccoonRobot.prototype.__playSoundCore = function(sound, count, wait, callback) {
    this.__cancelNote();
    this.__cancelSound();
    this.__setNote(0);
    if (sound && count) {
        this.__runSound(sound, count);
        if (wait) {
            this.soundCallback = callback;
            // 타임아웃은 유한 반복에만 적용된다. 무한 반복(count<0)은 완료되지
            // 않으며 영원히 도는 동작을 유지한다.
            if (count > 0) this.__armSoundTimeout();
            this.__checkSoundPlaying();
        } else {
            this.__checkSoundPlaying();
            callback();
        }
    } else {
        this.__runSound(0);
        this.__checkSoundPlaying();
        callback();
    }
};

RaccoonRobot.prototype.playSound = function(script) {
    this.__setModule();
    this.__playSoundCore(this.__SOUNDS[script.getField('SOUND')], 1, false, () => {});
    return script.callReturn();
};

RaccoonRobot.prototype.__readRepeat = function(script) {
    // 각도/박자 경로와 마찬가지로, 비거나 숫자가 아닌 REPEAT는 무시(no-op)가
    // 아니라 한 번 재생한다.
    const count = parseInt(script.getNumberValue('REPEAT'), 10);
    return isNaN(count) ? 1 : count;
};

RaccoonRobot.prototype.playSoundTimes = function(script) {
    this.__setModule();
    this.__playSoundCore(
        this.__SOUNDS[script.getField('SOUND')],
        this.__readRepeat(script),
        false,
        () => {}
    );
    return script.callReturn();
};

RaccoonRobot.prototype.playSoundTimesUntil = function(script) {
    return this.__waitBlock(script, (cb) => {
        // 삐오 playSoundUntil 과 같은 이유로 음수만 막는다. 기다리지 않는
        // playSoundTimes 는 정지하지 않으므로 __readRepeat 은 그대로 둔다.
        const count = this.__readRepeat(script);
        this.__playSoundCore(
            this.__SOUNDS[script.getField('SOUND')],
            count < 0 ? 0 : count,
            true,
            cb
        );
    });
};

RaccoonRobot.prototype.clearSound = function(script) {
    this.__setModule();
    this.__cancelNote();
    this.__cancelSound();
    this.__setNote(0);
    this.__runSound(0);
    this.__checkSoundPlaying();
    return script.callReturn();
};

RaccoonRobot.prototype.__noteValue = function(script) {
    const note = this.__NOTES[script.getField('NOTE')];
    let octave = parseInt(script.getField('OCTAVE'));
    if (note && octave && octave > 0 && octave < 8) {
        octave %= 7;
        if (octave == 0) octave = 7;
        return note + (octave - 1) * 12;
    }
    return 0;
};

RaccoonRobot.prototype.playNote = function(script) {
    this.__setModule();
    this.__cancelNote();
    this.__cancelSound();
    this.__setNote(this.__noteValue(script));
    this.__runSound(0);
    this.__checkSoundPlaying();
    return script.callReturn();
};

RaccoonRobot.prototype.playNoteBeat = function(script) {
    return this.__waitBlock(script, (cb) => {
        this.__cancelNote();
        this.__cancelSound();
        const note = this.__noteValue(script);
        const beat = parseFloat(script.getNumberValue('BEAT'));
        if (note && beat && beat > 0 && this.tempo > 0) {
            const id = this.__issueNoteId();
            this.__setNote(note);
            const timeout = this.__clampDelay((beat * 60 * 1000) / this.tempo);
            const tail = timeout > 100 ? 100 : 0;
            if (tail > 0) {
                const t1 = setTimeout(() => {
                    if (this.noteId == id) {
                        this.__setNote(0);
                        if (this.noteTimer1 !== undefined) this.__removeTimeout(this.noteTimer1);
                        this.noteTimer1 = undefined;
                    }
                }, timeout - tail);
                this.noteTimer1 = t1;
                this.timeouts.push(t1);
            }
            const t2 = setTimeout(() => {
                if (this.noteId == id) {
                    this.__setNote(0);
                    this.__cancelNote();
                    this.__checkSoundPlaying();
                    cb();
                }
            }, timeout);
            this.noteTimer2 = t2;
            this.timeouts.push(t2);
            this.__runSound(0);
            this.__checkSoundPlaying();
        } else {
            this.__setNote(0);
            this.__runSound(0);
            this.__checkSoundPlaying();
            cb();
        }
    });
};

RaccoonRobot.prototype.restBeat = function(script) {
    return this.__waitBlock(script, (cb) => {
        this.__cancelNote();
        this.__cancelSound();
        const beat = parseFloat(script.getNumberValue('BEAT'));
        this.__setNote(0);
        this.__runSound(0);
        if (beat && beat > 0 && this.tempo > 0) {
            const id = this.__issueNoteId();
            const t1 = setTimeout(() => {
                if (this.noteId == id) {
                    this.__cancelNote();
                    this.__checkSoundPlaying();
                    cb();
                }
            }, this.__clampDelay((beat * 60 * 1000) / this.tempo));
            this.noteTimer1 = t1;
            this.timeouts.push(t1);
            this.__checkSoundPlaying();
            this.resting = true;
        } else {
            this.__checkSoundPlaying();
            cb();
        }
    });
};

RaccoonRobot.prototype.changeTempo = function(script) {
    this.__setModule();
    const bpm = parseFloat(script.getNumberValue('BPM'));
    if (!isNaN(bpm)) {
        this.tempo += bpm;
        if (this.tempo < 1) this.tempo = 1;
    }
    return script.callReturn();
};

RaccoonRobot.prototype.setTempo = function(script) {
    this.__setModule();
    const bpm = parseFloat(script.getNumberValue('BPM'));
    if (!isNaN(bpm)) {
        this.tempo = bpm;
        if (this.tempo < 1) this.tempo = 1;
    }
    return script.callReturn();
};

RaccoonRobot.prototype.isSoundPlaying = function(script) {
    return this.sounding || this.noting || this.resting;
};

// ---------------- sensing ----------------

RaccoonRobot.prototype.getEncoder1 = function(script) {
    return this.sensory.encoder1;
};

RaccoonRobot.prototype.getEncoder2 = function(script) {
    return this.sensory.encoder2;
};

RaccoonRobot.prototype.getEncoder3 = function(script) {
    return this.sensory.encoder3;
};

RaccoonRobot.prototype.getEncoder4 = function(script) {
    return this.sensory.encoder4;
};

RaccoonRobot.prototype.getPositionX = function(script) {
    return this.pos.x;
};

RaccoonRobot.prototype.getPositionY = function(script) {
    return this.pos.y;
};

RaccoonRobot.prototype.getPositionZ = function(script) {
    return this.pos.z;
};

RaccoonRobot.prototype.getPositionXInch = function(script) {
    return this.pos.x / this.__INCH_TO_CM;
};

RaccoonRobot.prototype.getPositionYInch = function(script) {
    return this.pos.y / this.__INCH_TO_CM;
};

RaccoonRobot.prototype.getPositionZInch = function(script) {
    return this.pos.z / this.__INCH_TO_CM;
};

RaccoonRobot.prototype.getTeachButton = function(script) {
    return this.sensory.teachButton;
};

RaccoonRobot.prototype.getPlayButton = function(script) {
    return this.sensory.playButton;
};

RaccoonRobot.prototype.getDeleteButton = function(script) {
    return this.sensory.deleteButton;
};

RaccoonRobot.prototype.getSignalStrength = function(script) {
    return this.sensory.signalStrength;
};

RaccoonRobot.prototype.__buttonEventFlag = function(button, state) {
    switch (button) {
        case 'TEACH':
            switch (state) {
                case 'PRESSED':
                    return this.teachPressed;
                case 'RELEASED':
                    return this.teachReleased;
                case 'CLICKED':
                    return this.teachClicked;
                case 'LONG_PRESSED':
                    return this.teachLongPressed;
            }
            break;
        case 'PLAY':
            switch (state) {
                case 'PRESSED':
                    return this.playPressed;
                case 'RELEASED':
                    return this.playReleased;
                case 'CLICKED':
                    return this.playClicked;
                case 'LONG_PRESSED':
                    return this.playLongPressed;
            }
            break;
        case 'DELETE':
            switch (state) {
                case 'PRESSED':
                    return this.deletePressed;
                case 'RELEASED':
                    return this.deleteReleased;
                case 'CLICKED':
                    return this.deleteClicked;
                case 'LONG_PRESSED':
                    return this.deleteLongPressed;
            }
            break;
    }
    return false;
};

RaccoonRobot.prototype.hasButtonEvent = function() {
    return (
        this.teachPressed ||
        this.playPressed ||
        this.deletePressed ||
        this.teachReleased ||
        this.playReleased ||
        this.deleteReleased ||
        this.teachClicked ||
        this.playClicked ||
        this.deleteClicked ||
        this.teachLongPressed ||
        this.playLongPressed ||
        this.deleteLongPressed
    );
};

RaccoonRobot.prototype.checkButtonEvent = function(script) {
    return this.__buttonEventFlag(script.getField('BUTTON'), script.getField('STATE'));
};

RaccoonRobot.prototype.isButtonState = function(script) {
    const button = script.getField('BUTTON');
    const state = script.getField('STATE');
    if (state == 'PRESSED' || state == 'RELEASED') {
        const level =
            button == 'TEACH'
                ? this.sensory.teachButton
                : button == 'PLAY'
                ? this.sensory.playButton
                : this.sensory.deleteButton;
        return state == 'PRESSED' ? level == 1 : level == 0;
    }
    return this.__buttonEventFlag(button, state);
};

RaccoonRobot.prototype.checkBatteryState = function(script) {
    return this.sensory.batteryState == this.__BATTERY_STATES[script.getField('BATTERY')];
};

RaccoonRobot.prototype.isCharging = function(script) {
    return this.sensory.chargeState == 1;
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
            case 0x0d:
                group = 'cheese';
                module = 'cheese';
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
            case 0x20:
                // Pio: roboid 핸드셰이크로 확인한 장치 모델 바이트
                // (PioConnectionChecker는 info[2] === '20'을 요구). entry-hw는
                // portData에 회사 0x02 / 모델 0x20을 실어 보낸다.
                group = 'pio';
                module = 'pio';
                break;
            case 0x30:
                // Raccoon: roboid 핸드셰이크 토큰 '30'
                // (RaccoonConnectionChecker는 info[2] === '30'을 요구). entry-hw는
                // portData에 회사 0x02 / 모델 0x30을 실어 보낸다.
                group = 'raccoon';
                module = 'raccoon';
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
                } else if (module == 'cheese') {
                    robot = new CheeseRobot(index);
                } else if (module == 'zerone') {
                    robot = new ZeroneRobot(index);
                } else if (module == 'brown') {
                    robot = new LineRobot(index, module);
                } else if (module == 'sally') {
                    robot = new LineRobot(index, module);
                } else if (module == 'pio') {
                    robot = new PioRobot(index);
                } else if (module == 'raccoon') {
                    robot = new RaccoonRobot(index);
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